export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  return res.status(200).json({
    status: "ONLINE",
    roverId: "ARGUS-01",
    firmware: "v2.4-STA-HCSR04-DHT11",
    timestamp: new Date().toISOString()
  });
}
