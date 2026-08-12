import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { createInitialTelemetry, generateNextTelemetry } from '../services/mockDataEngine';
import { INITIAL_MISSION, DEFAULT_SENSOR_CONFIG, DEFAULT_NETWORK_CONFIG } from '../utils/constants';

const TelemetryContext = createContext(null);

export const TelemetryProvider = ({ children }) => {
  const [telemetry, setTelemetry] = useState(createInitialTelemetry());
  const [telemetryHistory, setTelemetryHistory] = useState(() => {
    // Generate 20 initial historical points for crisp immediate charts
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
  const [roverMode, setRoverModeState] = useState('AUTONOMOUS');
  const [hazardOverride, setHazardOverride] = useState('normal'); // 'normal' | 'warning' | 'critical'
  const [currentMission, setCurrentMission] = useState(INITIAL_MISSION);
  const [sensorConfig, setSensorConfig] = useState(DEFAULT_SENSOR_CONFIG);
  const [networkConfig, setNetworkConfig] = useState(DEFAULT_NETWORK_CONFIG);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isSystemHealthOpen, setIsSystemHealthOpen] = useState(false);
  const [isEStopModalOpen, setIsEStopModalOpen] = useState(false);

  // Initial alerts setup
  const [alerts, setAlerts] = useState([
    {
      id: 'alt-101',
      severity: 'info',
      sensor: 'GPS',
      message: 'GPS Satellite Lock Acquired (9 Satellites)',
      timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
      status: 'acknowledged',
    },
    {
      id: 'alt-102',
      severity: 'warning',
      sensor: 'Obstacle Sonar',
      message: 'Obstacle detected 52cm ahead in autonomous path',
      timestamp: new Date(Date.now() - 4 * 60 * 1000).toISOString(),
      status: 'new',
    },
  ]);

  // Initial mission event logs timeline
  const [logs, setLogs] = useState([
    { id: 1, timestamp: '14:32:00', event: 'Mission Search & Rescue Alpha started', type: 'info' },
    { id: 2, timestamp: '14:34:12', event: 'GPS lock acquired (Satellites: 9, Accuracy: 1.2m)', type: 'info' },
    { id: 3, timestamp: '14:37:45', event: 'Obstacle detected at Waypoint 6, rerouting path', type: 'warning' },
    { id: 4, timestamp: '14:41:10', event: 'Sensor node scan completed: Gas level safe (124 ppm)', type: 'info' },
  ]);

  // Handle periodic telemetry updates in Demo Mode
  useEffect(() => {
    if (!isDemoMode || !isConnected) return;

    const interval = setInterval(() => {
      setTelemetry(prev => {
        if (eStopped) {
          return {
            ...prev,
            motors: { ...prev.motors, leftSpeed: 0, rightSpeed: 0, state: 'STOPPED' },
            connection: { ...prev.connection, pingMs: 10 + Math.floor(Math.random() * 5) }
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

        // Trigger automatic alerts if hazard level escalates
        if (next.gas.status === 'CRITICAL' && prev.gas.status !== 'CRITICAL') {
          addAlert('critical', 'Gas Hazard', `CRITICAL: High gas concentration detected (${next.gas.smokePpm} PPM)`);
          addLog(`CRITICAL HAZARD DETECTED: Gas level ${next.gas.smokePpm} PPM`, 'critical');
        } else if (next.obstacle.status === 'OBSTACLE DETECTED' && prev.obstacle.status !== 'OBSTACLE DETECTED') {
          addAlert('warning', 'Sonar Radar', `Obstacle detected ${next.obstacle.frontCm}cm directly ahead`);
          addLog(`Obstacle auto-avoidance triggered (${next.obstacle.frontCm}cm)`, 'warning');
        }

        return next;
      });
    }, 1200);

    return () => clearInterval(interval);
  }, [isDemoMode, isConnected, eStopped, hazardOverride]);

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

  // Emergency Stop Handler
  const triggerEmergencyStop = useCallback(() => {
    setEStopped(true);
    setTelemetry(prev => ({
      ...prev,
      motors: { ...prev.motors, leftSpeed: 0, rightSpeed: 0, state: 'STOPPED' }
    }));
    addAlert('critical', 'E-STOP SYSTEM', 'EMERGENCY STOP ACTIVATED! All rover motors halted immediately.');
    addLog('CRITICAL: EMERGENCY STOP PRESSED — All motors halted', 'critical');
  }, [addAlert, addLog]);

  const resetEmergencyStop = useCallback(() => {
    setEStopped(false);
    setTelemetry(prev => ({
      ...prev,
      motors: { ...prev.motors, state: 'FORWARD', leftSpeed: 60, rightSpeed: 60 }
    }));
    addAlert('info', 'E-STOP SYSTEM', 'Emergency stop cleared. Rover control restored.');
    addLog('Emergency stop cleared by operator', 'info');
  }, [addAlert, addLog]);

  // Movement commands
  const sendDriveCommand = useCallback((direction, speed = 70) => {
    if (eStopped) return;
    setRoverModeState('MANUAL');
    let stateStr = 'FORWARD';
    let lSpeed = speed;
    let rSpeed = speed;

    switch (direction) {
      case 'FORWARD':
        stateStr = 'FORWARD';
        break;
      case 'REVERSE':
        stateStr = 'REVERSE';
        break;
      case 'LEFT':
        stateStr = 'TURNING_LEFT';
        lSpeed = Math.round(speed * 0.3);
        rSpeed = speed;
        break;
      case 'RIGHT':
        stateStr = 'TURNING_RIGHT';
        lSpeed = speed;
        rSpeed = Math.round(speed * 0.3);
        break;
      case 'STOP':
      default:
        stateStr = 'STOPPED';
        lSpeed = 0;
        rSpeed = 0;
        break;
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
