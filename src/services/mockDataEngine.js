import { SENSOR_THRESHOLDS } from '../utils/constants';

let currentPathIndex = 0;
let distanceTraveledKm = 1.42;
let batteryPercentage = 78.5;
let batteryVoltage = 7.42;
let baseTemp = 31.4;
let minTempSeen = 28.2;
let maxTempSeen = 34.8;
let lastHeading = 42;

// Simulated coordinate track points for rover motion in demo mode
const SIMULATED_PATH = [
  { lat: 27.3289, lng: 88.6210, name: 'Checkpoint 1 - Sector 4' },
  { lat: 27.3292, lng: 88.6214, name: 'Approaching South Structure' },
  { lat: 27.3296, lng: 88.6219, name: 'Debris Field Crossing' },
  { lat: 27.3300, lng: 88.6223, name: 'Structure Entrance Node' },
  { lat: 27.3304, lng: 88.6227, name: 'Hazard Probe Location B' },
  { lat: 27.3308, lng: 88.6231, name: 'Relay Sub-Station' },
];

export function createInitialTelemetry() {
  return {
    roverId: 'ARGUS-01',
    timestamp: new Date().toISOString(),
    battery: {
      percentage: 78,
      voltage: 7.42,
      currentDrawAmp: 1.85,
      estimatedRuntimeMin: 145,
      charging: false,
    },
    temperature: {
      current: 31.4,
      min: minTempSeen,
      max: maxTempSeen,
      trend: 'stable',
      unit: '°C',
    },
    humidity: 58.4,
    gas: {
      value: 124, // overall index
      smokePpm: 124,
      lpgPpm: 45,
      coPpm: 18,
      methanePpm: 32,
      status: 'SAFE', // SAFE | WARNING | CRITICAL
      sensorState: 'Operational',
    },
    gps: {
      latitude: 27.3289,
      longitude: 88.6210,
      heading: lastHeading,
      satellites: 9,
      accuracyMeters: 1.2,
      lock: true,
      altitudeMeters: 412.5,
    },
    motors: {
      leftSpeed: 68,
      rightSpeed: 65,
      state: 'FORWARD', // FORWARD | REVERSE | TURNING_LEFT | TURNING_RIGHT | STOPPED
      mode: 'AUTONOMOUS', // MANUAL | ASSISTED | AUTONOMOUS
    },
    obstacle: {
      frontCm: 142,
      leftCm: 88,
      rightCm: 95,
      rearCm: 210,
      detected: false,
      status: 'SAFE DISTANCE', // SAFE DISTANCE | CAUTION | OBSTACLE DETECTED
    },
    connection: {
      status: 'connected',
      type: 'Wi-Fi 2.4GHz',
      signalDbm: -58,
      signalPercentage: 84,
      pingMs: 14,
      packetsReceived: 14280,
      packetsLost: 3,
    },
    distanceTraveledKm: 1.42,
  };
}

export function generateNextTelemetry(prevTelemetry, mode = 'normal', isMoving = true) {
  const now = new Date();
  
  // Battery simulation
  batteryPercentage = Math.max(5, batteryPercentage - 0.015);
  batteryVoltage = parseFloat((6.2 + (batteryPercentage / 100) * 1.3).toFixed(2));
  
  // Temperature simulation
  const tempDelta = (Math.random() - 0.48) * 0.3;
  let tempCurrent = parseFloat((prevTelemetry.temperature.current + tempDelta).toFixed(1));
  if (mode === 'warning') tempCurrent = 39.5;
  if (mode === 'critical') tempCurrent = 48.2;
  
  minTempSeen = Math.min(minTempSeen, tempCurrent);
  maxTempSeen = Math.max(maxTempSeen, tempCurrent);
  
  // Gas hazard simulation based on mode override or realistic drift
  let smokeVal = 110 + Math.floor(Math.random() * 25);
  let lpgVal = 40 + Math.floor(Math.random() * 15);
  let coVal = 15 + Math.floor(Math.random() * 10);
  let methaneVal = 30 + Math.floor(Math.random() * 12);
  let gasStatus = 'SAFE';

  if (mode === 'warning') {
    smokeVal = 310;
    lpgVal = 180;
    gasStatus = 'WARNING';
  } else if (mode === 'critical') {
    smokeVal = 580;
    lpgVal = 420;
    coVal = 190;
    gasStatus = 'CRITICAL';
  } else {
    if (smokeVal > SENSOR_THRESHOLDS.gas.warningMax) {
      gasStatus = 'CRITICAL';
    } else if (smokeVal > SENSOR_THRESHOLDS.gas.safeMax) {
      gasStatus = 'WARNING';
    }
  }

  // Position & heading simulation
  if (isMoving && prevTelemetry.motors.state !== 'STOPPED') {
    currentPathIndex = (currentPathIndex + 1) % SIMULATED_PATH.length;
    distanceTraveledKm = parseFloat((distanceTraveledKm + 0.0003).toFixed(3));
    lastHeading = (lastHeading + (Math.random() - 0.5) * 6 + 360) % 360;
  }
  const pos = SIMULATED_PATH[currentPathIndex];

  // Obstacle sonar simulation
  let frontCm = 120 + Math.floor(Math.random() * 60);
  let leftCm = 70 + Math.floor(Math.random() * 40);
  let rightCm = 80 + Math.floor(Math.random() * 40);
  let rearCm = 180 + Math.floor(Math.random() * 50);
  let obstacleDetected = false;
  let obstacleStatus = 'SAFE DISTANCE';

  if (mode === 'warning') {
    frontCm = 52;
    obstacleStatus = 'CAUTION';
  } else if (mode === 'critical') {
    frontCm = 24;
    obstacleDetected = true;
    obstacleStatus = 'OBSTACLE DETECTED';
  }

  return {
    roverId: 'ARGUS-01',
    timestamp: now.toISOString(),
    battery: {
      percentage: parseFloat(batteryPercentage.toFixed(1)),
      voltage: batteryVoltage,
      currentDrawAmp: prevTelemetry.motors.state === 'STOPPED' ? 0.45 : 1.92,
      estimatedRuntimeMin: Math.round((batteryPercentage / 100) * 180),
      charging: false,
    },
    temperature: {
      current: tempCurrent,
      min: parseFloat(minTempSeen.toFixed(1)),
      max: parseFloat(maxTempSeen.toFixed(1)),
      trend: tempDelta > 0.05 ? 'rising' : tempDelta < -0.05 ? 'falling' : 'stable',
      unit: '°C',
    },
    humidity: parseFloat((58.0 + (Math.random() - 0.5) * 1.5).toFixed(1)),
    gas: {
      value: smokeVal,
      smokePpm: smokeVal,
      lpgPpm: lpgVal,
      coPpm: coVal,
      methanePpm: methaneVal,
      status: gasStatus,
      sensorState: 'Operational',
    },
    gps: {
      latitude: pos.lat + (Math.random() - 0.5) * 0.0001,
      longitude: pos.lng + (Math.random() - 0.5) * 0.0001,
      heading: Math.round(lastHeading),
      satellites: 9 + Math.floor(Math.random() * 3),
      accuracyMeters: parseFloat((1.1 + Math.random() * 0.3).toFixed(1)),
      lock: true,
      altitudeMeters: 412.5,
    },
    motors: {
      leftSpeed: prevTelemetry.motors.state === 'STOPPED' ? 0 : 65 + Math.floor(Math.random() * 8),
      rightSpeed: prevTelemetry.motors.state === 'STOPPED' ? 0 : 64 + Math.floor(Math.random() * 8),
      state: prevTelemetry.motors.state,
      mode: prevTelemetry.motors.mode,
    },
    obstacle: {
      frontCm,
      leftCm,
      rightCm,
      rearCm,
      detected: obstacleDetected,
      status: obstacleStatus,
    },
    connection: {
      status: 'connected',
      type: 'Wi-Fi 2.4GHz',
      signalDbm: -55 - Math.floor(Math.random() * 8),
      signalPercentage: 82 + Math.floor(Math.random() * 10),
      pingMs: 12 + Math.floor(Math.random() * 8),
      packetsReceived: prevTelemetry.connection.packetsReceived + 1,
      packetsLost: prevTelemetry.connection.packetsLost,
    },
    distanceTraveledKm,
  };
}
