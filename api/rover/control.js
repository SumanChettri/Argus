let commandQueue = [];

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'POST') {
    try {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      const cmd = {
        roverId: body.roverId || "ARGUS-01",
        command: body.command || "DRIVE",
        direction: body.direction || "STOP",
        speed: body.speed || 0,
        mode: body.mode || "MANUAL",
        timestamp: Date.now()
      };
      commandQueue.push(cmd);
      return res.status(200).json({ success: true, queuedCommand: cmd });
    } catch (err) {
      return res.status(400).json({ error: "Invalid JSON command payload" });
    }
  }

  if (req.method === 'GET') {
    const nextCmd = commandQueue.shift() || null;
    return res.status(200).json({ command: nextCmd });
  }

  return res.status(405).json({ error: "Method Not Allowed" });
}
