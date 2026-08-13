import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { createInitialTelemetry, generateNextTelemetry } from '../services/mockDataEngine';
import { fetchLiveTelemetry, sendControlCommand } from '../services/api';
import { INITIAL_MISSION, DEFAULT_SENSOR_CONFIG, DEFAULT_NETWORK_CONFIG } from '../utils/constants';

const TelemetryContext = createContext(null);

export const TelemetryProvider = ({ children }) => {
  const [telemetry, setTelemetry] = useState(createInitialTelemetry());
  const [telemetryHistory, setTelemetryHistory] = useState(() => {
    // Generate initial historical points for chart streams
    const initialHist = [];
    let tempTel = createInitialTelemetry();
    for (let i = 0; i < 25; i++) {
      tempTel = generateNextTelemetry(tempTel, 'normal', false);
      initialHist.push({
        time: new Date(Date.now() - (25 - i) * 2000).toLocaleTimeString([], { hour12: false, minute: '2-digit', second: '2-digit' }),
        battery: tempTel.battery.percentage,
        voltage: tempTel.battery.voltage,
        temperature: tempTel.temperature.current,
        humidity: tempTel.humidity,
        gas: tempTel.gas.smokePpm,
        signal: tempTel.connection.signalPercentage,
        speed: tempTel.motors.leftSpeed,
      });
    }
    return initialHist;
  });

  const [isDemoMode, setIsDemoMode] = useState(true);
  const [isConnected, setIsConnected] = useState(true);
  const [eStopped, setEStopped] = useState(false);
  const [roverMode, setRoverModeState] = useState('MANUAL');
  const [hazardOverride, setHazardOverride] = useState('normal'); // 'normal' | 'warning' | 'critical'
  const [currentMission, setCurrentMission] = useState(INITIAL_MISSION);
  const [sensorConfig, setSensorConfig] = useState(DEFAULT_SENSOR_CONFIG);
  const [networkConfig, setNetworkConfig] = useState(DEFAULT_NETWORK_CONFIG);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isSystemHealthOpen, setIsSystemHealthOpen] = useState(false);
  const [isEStopModalOpen, setIsEStopModalOpen] = useState(false);
  const [lastSeenSecAgo, setLastSeenSecAgo] = useState(0);

  // Initial alerts setup
  const [alerts, setAlerts] = useState([
    {
      id: 'alt-101',
      severity: 'info',
      sensor: 'System',
      message: 'ARGUS Command Station Initialized. Toggle LIVE HARDWARE MODE to connect to ESP32.',
      timestamp: new Date().toISOString(),
      status: 'acknowledged',
    },
  ]);

  // Initial mission event logs timeline
  const [logs, setLogs] = useState([
    { id: 1, timestamp: new Date().toLocaleTimeString([], { hour12: false }), event: 'ARGUS Mission Control Portal online', type: 'info' },
  ]);

  const addAlert = useCallback((severity, sensor, message) => {
    const newAlert = {
      id: `alt-${Date.now()}`,
      severity,
      sensor,
      message,
      timestamp: new Date().toISOString(),
      status: 'new',
    };
    setAlerts(prev => [newAlert, ...prev]);
  }, []);

  const addLog = useCallback((event, type = 'info') => {
    const timeStr = new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setLogs(prev => [{ id: Date.now(), timestamp: timeStr, event, type }, ...prev]);
  }, []);

  // -----------------------------------------------------------------------------------
  // 1. DEMO MODE TELEMETRY GENERATOR
  // -----------------------------------------------------------------------------------
  useEffect(() => {
    if (!isDemoMode) return;

    const interval = setInterval(() => {
      setTelemetry(prev => {
        if (eStopped) {
          return {
            ...prev,
            motors: { ...prev.motors, leftSpeed: 0, rightSpeed: 0, state: 'STOPPED' }
          };
        }

        const next = generateNextTelemetry(prev, hazardOverride, true);

        // Append to history buffer (max 60 points)
        setTelemetryHistory(hPrev => {
          const newPoint = {
            time: new Date().toLocaleTimeString([], { hour12: false, minute: '2-digit', second: '2-digit' }),
            battery: next.battery.percentage,
            voltage: next.battery.voltage,
            temperature: next.temperature.current,
            humidity: next.humidity,
            gas: next.gas.smokePpm,
            signal: next.connection.signalPercentage,
            speed: next.motors.leftSpeed,
          };
          const updated = [...hPrev, newPoint];
          return updated.length > 60 ? updated.slice(updated.length - 60) : updated;
        });

        return next;
      });
    }, 1200);

    return () => clearInterval(interval);
  }, [isDemoMode, eStopped, hazardOverride]);

  // -----------------------------------------------------------------------------------
  // 2. LIVE HARDWARE TELEMETRY POLLING (When isDemoMode === false)
  // -----------------------------------------------------------------------------------
  useEffect(() => {
    if (isDemoMode) return;

    const fetchTelemetryFromVercel = async () => {
      const liveData = await fetchLiveTelemetry();
      if (!liveData) {
        setIsConnected(false);
        return;
      }

      setIsConnected(liveData.isOnline ?? false);
      setLastSeenSecAgo(liveData.lastSeenSecAgo ?? 0);

      // Merge real hardware readings with current status schema
      setTelemetry(prev => {
        const nextTemp = liveData.temperature?.current ?? prev.temperature.current;
        const nextHum = liveData.humidity ?? prev.humidity;

        const nextFront = liveData.obstacle?.frontCm ?? null;
        const nextLeft = liveData.obstacle?.leftCm ?? null;
        const nextRight = liveData.obstacle?.rightCm ?? null;

        const isOnline = liveData.isOnline ?? false;

        // Auto alerts for real obstacle or temp spike
        if (isOnline && nextFront !== null && nextFront < 30 && prev.obstacle.frontCm >= 30) {
          addAlert('critical', 'Front Sonar', `REAL OBSTACLE DETECTED: ${nextFront}cm ahead!`);
          addLog(`HARDWARE ALERT: Front obstacle detected at ${nextFront}cm`, 'critical');
        }

        // Push real temp to telemetry chart history
        if (nextTemp !== null) {
          setTelemetryHistory(hPrev => {
            const newPoint = {
              time: new Date().toLocaleTimeString([], { hour12: false, minute: '2-digit', second: '2-digit' }),
              battery: prev.battery.percentage ?? 0,
              voltage: prev.battery.voltage ?? 0,
              temperature: nextTemp,
              humidity: nextHum ?? 0,
              gas: 0,
              signal: liveData.connection?.signalPercentage ?? 0,
              speed: 0,
            };
            const updated = [...hPrev, newPoint];
            return updated.length > 60 ? updated.slice(updated.length - 60) : updated;
          });
        }

        return {
          ...prev,
          roverId: liveData.roverId || "ARGUS-01",
          temperature: {
            current: nextTemp !== null ? parseFloat(nextTemp.toFixed(1)) : "N/A",
            min: liveData.temperature?.min ?? "N/A",
            max: liveData.temperature?.max ?? "N/A",
            unit: "°C",
            trend: "stable",
            status: liveData.temperature?.status || "connected"
          },
          humidity: nextHum !== null ? parseFloat(nextHum.toFixed(1)) : "N/A",
          obstacle: {
            frontCm: nextFront,
            leftCm: nextLeft,
            rightCm: nextRight,
            rearCm: null, // Hardware not connected for rear sonar
            status: liveData.obstacle?.status || (isOnline ? "SAFE DISTANCE" : "OFFLINE"),
            detected: liveData.obstacle?.detected || false
          },
          connection: {
            status: isOnline ? "connected" : "offline",
            type: "Wi-Fi 2.4GHz (STA)",
            signalDbm: liveData.connection?.signalDbm ?? -100,
            signalPercentage: liveData.connection?.signalPercentage ?? 0,
            pingMs: 14,
            packetsReceived: prev.connection.packetsReceived + 1,
            packetsLost: isOnline ? prev.connection.packetsLost : prev.connection.packetsLost + 1
          },
          gas: {
            value: null,
            smokePpm: "N/A",
            lpgPpm: "N/A",
            coPpm: "N/A",
            methanePpm: "N/A",
            status: "SAFE",
            sensorState: "Hardware Not Connected"
          },
          gps: {
            ...prev.gps,
            lock: false,
            satellites: 0
          },
          motors: {
            ...prev.motors,
            state: "STOPPED",
            mode: "MANUAL"
          }
        };
      });
    };

    fetchTelemetryFromVercel();
    const interval = setInterval(fetchTelemetryFromVercel, 1200);
    return () => clearInterval(interval);
  }, [isDemoMode, addAlert, addLog]);

  // Emergency Stop Handler
  const triggerEmergencyStop = useCallback(() => {
    setEStopped(true);
    sendControlCommand({ command: 'ESTOP' });
    setTelemetry(prev => ({
      ...prev,
      motors: { ...prev.motors, leftSpeed: 0, rightSpeed: 0, state: 'STOPPED' }
    }));
    addAlert('critical', 'E-STOP SYSTEM', 'EMERGENCY STOP ACTIVATED! All rover motors halted immediately.');
    addLog('CRITICAL: EMERGENCY STOP PRESSED — All motors halted', 'critical');
  }, [addAlert, addLog]);

  const resetEmergencyStop = useCallback(() => {
    setEStopped(false);
    sendControlCommand({ command: 'CLEAR_ESTOP' });
    setTelemetry(prev => ({
      ...prev,
      motors: { ...prev.motors, state: 'FORWARD', leftSpeed: 60, rightSpeed: 60 }
    }));
    addAlert('info', 'E-STOP SYSTEM', 'Emergency stop cleared. Rover control restored.');
    addLog('Emergency stop cleared by operator', 'info');
  }, [addAlert, addLog]);

  // Drive Commands
  const sendDriveCommand = useCallback((direction, speed = 70) => {
    if (eStopped) return;
    setRoverModeState('MANUAL');
    sendControlCommand({ command: 'DRIVE', direction, speed });

    let stateStr = direction;
    let lSpeed = speed;
    let rSpeed = speed;

    if (direction === 'LEFT') {
      stateStr = 'TURNING_LEFT';
      lSpeed = Math.round(speed * 0.3);
    } else if (direction === 'RIGHT') {
      stateStr = 'TURNING_RIGHT';
      rSpeed = Math.round(speed * 0.3);
    } else if (direction === 'STOP') {
      stateStr = 'STOPPED';
      lSpeed = 0;
      rSpeed = 0;
    }

    setTelemetry(prev => ({
      ...prev,
      motors: {
        ...prev.motors,
        state: stateStr,
        leftSpeed: lSpeed,
        rightSpeed: rSpeed,
        mode: 'MANUAL'
      }
    }));
    addLog(`Manual command sent: ${stateStr} (Speed: ${speed}%)`, 'info');
  }, [eStopped, addLog]);

  const setRoverMode = useCallback((mode) => {
    setRoverModeState(mode);
    sendControlCommand({ command: 'SET_MODE', mode });
    setTelemetry(prev => ({
      ...prev,
      motors: { ...prev.motors, mode }
    }));
    addLog(`Rover operating mode changed to: ${mode}`, 'info');
  }, [addLog]);

  const acknowledgeAlert = useCallback((id) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, status: 'acknowledged' } : a));
  }, []);

  const clearAlerts = useCallback(() => {
    setAlerts([]);
  }, []);

  return (
    <TelemetryContext.Provider
      value={{
        telemetry,
        telemetryHistory,
        isDemoMode,
        setIsDemoMode,
        isConnected,
        setIsConnected,
        eStopped,
        triggerEmergencyStop,
        resetEmergencyStop,
        roverMode,
        setRoverMode,
        hazardOverride,
        setHazardOverride,
        currentMission,
        setCurrentMission,
        sensorConfig,
        setSensorConfig,
        networkConfig,
        setNetworkConfig,
        alerts,
        acknowledgeAlert,
        clearAlerts,
        addAlert,
        logs,
        addLog,
        soundEnabled,
        setSoundEnabled,
        sendDriveCommand,
        isSystemHealthOpen,
        setIsSystemHealthOpen,
        isEStopModalOpen,
        setIsEStopModalOpen,
        lastSeenSecAgo,
      }}
    >
      {children}
    </TelemetryContext.Provider>
  );
};

export const useTelemetry = () => {
  const context = useContext(TelemetryContext);
  if (!context) {
    throw new Error('useTelemetry must be used within a TelemetryProvider');
  }
  return context;
};
