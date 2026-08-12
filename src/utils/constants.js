export const ROVER_INFO = {
  id: 'ARGUS-01',
  name: 'ARGUS Mission Rover',
  fullTitle: 'Autonomous Reconnaissance & Ground Utility System',
  firmware: 'v2.4.8-ESP32',
  tagline: 'Mission Control • Situational Awareness • Remote Operations',
};

export const INITIAL_MISSION = {
  id: 'M-2026-ALPHA',
  name: 'Search & Rescue Alpha',
  location: 'Sector 4 - Disaster Response Zone',
  startTime: new Date(Date.now() - 27 * 60 * 1000).toISOString(),
  targetWaypoints: 12,
  completedWaypoints: 7,
  totalDistanceKm: 1.42,
  targetDurationMin: 45,
  waypoints: [
    { id: 1, name: 'Base Station (Drop Point)', lat: 27.3210, lng: 88.6120, status: 'completed' },
    { id: 2, name: 'North Perimeter Scan', lat: 27.3225, lng: 88.6135, status: 'completed' },
    { id: 3, name: 'Structure Alpha Entrance', lat: 27.3240, lng: 88.6150, status: 'completed' },
    { id: 4, name: 'Debris Field Inspection', lat: 27.3252, lng: 88.6170, status: 'completed' },
    { id: 5, name: 'Gas Pipe Hazard Node A', lat: 27.3265, lng: 88.6185, status: 'completed' },
    { id: 6, name: 'Thermal Anomaly Zone', lat: 27.3278, lng: 88.6195, status: 'completed' },
    { id: 7, name: 'Survivors Checkpoint 1', lat: 27.3289, lng: 88.6210, status: 'current' },
    { id: 8, name: 'South Structure Recon', lat: 27.3302, lng: 88.6225, status: 'pending' },
    { id: 9, name: 'Hazard Sampling Area B', lat: 27.3315, lng: 88.6240, status: 'pending' },
    { id: 10, name: 'High Elevation Relay', lat: 27.3328, lng: 88.6260, status: 'pending' },
    { id: 11, name: 'East Boundary Perimeter', lat: 27.3340, lng: 88.6275, status: 'pending' },
    { id: 12, name: 'Extraction Point Bravo', lat: 27.3355, lng: 88.6290, status: 'pending' },
  ],
};

export const SENSOR_THRESHOLDS = {
  gas: {
    safeMax: 200,      // ppm
    warningMax: 400,   // ppm
  },
  temperature: {
    min: 10.0,         // °C
    max: 42.0,         // °C
  },
  battery: {
    warningMin: 25.0,  // %
    criticalMin: 12.0, // %
    nominalVoltage: 7.4 // V (2S LiPo)
  },
  obstacle: {
    criticalMinCm: 30, // cm
    warningMinCm: 60,  // cm
  }
};

export const DEFAULT_SENSOR_CONFIG = {
  temperature: true,
  gas: true,
  gps: true,
  obstacle: true,
  humidity: true,
  camera: true,
  motors: true,
  battery: true,
};

export const DEFAULT_NETWORK_CONFIG = {
  apiBaseUrl: 'http://192.168.4.1/api',
  wsUrl: 'ws://192.168.4.1/ws/telemetry',
  cameraStreamUrl: 'http://192.168.4.1:81/stream',
  roverIp: '192.168.4.1',
  wifiSsid: 'ARGUS-ROVER-AP',
};
