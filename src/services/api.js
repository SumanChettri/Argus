const API_BASE_URL = typeof window !== 'undefined' ? window.location.origin : '';

export async function fetchLiveTelemetry() {
  try {
    const res = await fetch(`${API_BASE_URL}/api/rover/telemetry`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return data;
  } catch (err) {
    console.warn('[API Service] Telemetry fetch warning:', err);
    return null;
  }
}

export async function sendControlCommand(commandPayload) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/rover/control`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(commandPayload)
    });
    return await res.json();
  } catch (err) {
    console.error('[API Service] Control command error:', err);
    return { error: err.message };
  }
}

export async function sendEmergencyStop() {
  try {
    const res = await fetch(`${API_BASE_URL}/api/rover/emergency-stop`, {
      method: 'POST'
    });
    return await res.json();
  } catch (err) {
    console.error('[API Service] Emergency stop error:', err);
    return { error: err.message };
  }
}
