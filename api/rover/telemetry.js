// In-memory telemetry cache & heartbeat store for Vercel Serverless Function
let latestTelemetry = {
  roverId: "ARGUS-01",
  timestamp: Date.now(),
  lastSeenTimestamp: 0,
  temperature: {
    current: null,
    min: null,
    max: null,
    unit: "°C",
    status: "not_connected"
  },
  humidity: null,
  obstacle: {
    frontCm: null,
    leftCm: null,
    rightCm: null,
    rearCm: null,
    status: "not_connected",
    detected: false
  },
  connection: {
    status: "offline",
    type: "Wi-Fi 2.4GHz (STA)",
    signalDbm: -100,
    signalPercentage: 0,
    ip: "N/A"
  },
  gas: {
    value: null,
    smokePpm: null,
    lpgPpm: null,
    coPpm: null,
    methanePpm: null,
    status: "not_connected",
    sensorState: "Hardware Not Connected"
  },
  gps: {
    latitude: null,
    longitude: null,
    heading: null,
    satellites: 0,
    lock: false,
    status: "not_connected"
  },
  motors: {
    leftSpeed: 0,
    rightSpeed: 0,
    state: "STOPPED",
    mode: "MANUAL",
    status: "not_connected"
  },
  battery: {
    percentage: null,
    voltage: null,
    status: "not_connected"
  }
};

let pendingCommand = null;

export default function handler(req, res) {
  // CORS Headers for Vercel Serverless Function
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST,PUT,DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // POST: ESP32 sends real sensor telemetry
  if (req.method === 'POST') {
    try {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      const now = Date.now();

      latestTelemetry.timestamp = now;
      latestTelemetry.lastSeenTimestamp = now;

      // Real DHT11 Temperature & Humidity
      if (body.temperature !== undefined && body.temperature !== null) {
        latestTelemetry.temperature.current = body.temperature;
        latestTelemetry.temperature.status = "connected";
        if (latestTelemetry.temperature.min === null || body.temperature < latestTelemetry.temperature.min) {
          latestTelemetry.temperature.min = body.temperature;
        }
        if (latestTelemetry.temperature.max === null || body.temperature > latestTelemetry.temperature.max) {
          latestTelemetry.temperature.max = body.temperature;
        }
      }

      if (body.humidity !== undefined && body.humidity !== null) {
        latestTelemetry.humidity = body.humidity;
      }

      // Real HC-SR04 Obstacles (Front, Left, Right)
      if (body.obstacle) {
        latestTelemetry.obstacle.frontCm = body.obstacle.frontCm ?? null;
        latestTelemetry.obstacle.leftCm = body.obstacle.leftCm ?? null;
        latestTelemetry.obstacle.rightCm = body.obstacle.rightCm ?? null;
        latestTelemetry.obstacle.rearCm = null; // Disconnected for hardware test

        const front = body.obstacle.frontCm ?? 999;
        const left = body.obstacle.leftCm ?? 999;
        const right = body.obstacle.rightCm ?? 999;
        const minDist = Math.min(front, left, right);

        if (minDist < 30) {
          latestTelemetry.obstacle.status = "OBSTACLE DETECTED";
          latestTelemetry.obstacle.detected = true;
        } else if (minDist < 60) {
          latestTelemetry.obstacle.status = "CAUTION";
          latestTelemetry.obstacle.detected = false;
        } else {
          latestTelemetry.obstacle.status = "SAFE DISTANCE";
          latestTelemetry.obstacle.detected = false;
        }
      }

      // Wi-Fi Connection
      if (body.connection) {
        latestTelemetry.connection.status = "connected";
        latestTelemetry.connection.signalDbm = body.connection.rssi ?? -55;
        latestTelemetry.connection.signalPercentage = Math.min(100, Math.max(0, 2 * ((body.connection.rssi ?? -55) + 100)));
        latestTelemetry.connection.ip = body.connection.ip ?? "STA Mode";
      }

      // Return response + any pending command to ESP32
      const cmdToSend = pendingCommand;
      pendingCommand = null;

      return res.status(200).json({
        success: true,
        receivedAt: now,
        command: cmdToSend
      });
    } catch (err) {
      return res.status(400).json({ error: "Invalid JSON telemetry payload" });
    }
  }

  // GET: Dashboard fetches telemetry
  if (req.method === 'GET') {
    const now = Date.now();
    const timeDiffSec = Math.floor((now - (latestTelemetry.lastSeenTimestamp || 0)) / 1000);
    const isOnline = latestTelemetry.lastSeenTimestamp > 0 && timeDiffSec < 10;

    latestTelemetry.connection.status = isOnline ? "connected" : "offline";

    return res.status(200).json({
      ...latestTelemetry,
      isOnline,
      lastSeenSecAgo: timeDiffSec
    });
  }

  return res.status(405).json({ error: "Method Not Allowed" });
}
