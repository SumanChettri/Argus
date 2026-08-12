import React, { useState } from 'react';
import { Camera, Video, Download, RefreshCw, Settings, Check } from 'lucide-react';
import { useTelemetry } from '../../context/TelemetryContext';

export default function CameraControls({ source, onSourceChange }) {
  const { addLog } = useTelemetry();
  const [isRecording, setIsRecording] = useState(false);
  const [snapshotTaken, setSnapshotTaken] = useState(false);

  const sources = [
    'ESP32-CAM (Demo Stream)',
    'IP Camera Stream (RTSP)',
    'Local Video File',
    'Simulated Hazard Recon Feed',
  ];

  const handleSnapshot = () => {
    setSnapshotTaken(true);
    addLog('Camera snapshot saved to mission storage buffer', 'info');
    setTimeout(() => setSnapshotTaken(false), 2000);
  };

  const handleRecordToggle = () => {
    setIsRecording(!isRecording);
    addLog(`Surveillance recording ${!isRecording ? 'started' : 'stopped'}`, !isRecording ? 'info' : 'warning');
  };

  return (
    <div className="card-hud rounded-2xl p-5 border border-slate-800 space-y-4 font-mono text-xs">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
            <Camera className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Camera Surveillance Controls</h3>
            <p className="text-[11px] font-mono text-slate-400">ESP32-CAM Video Subsystem</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* Source Dropdown */}
        <div className="bg-slate-900/60 p-3.5 rounded-xl border border-slate-800 space-y-2">
          <label className="text-slate-400 block">Video Source Stream:</label>
          <select
            value={source}
            onChange={(e) => onSourceChange(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 text-slate-100 text-xs font-mono rounded-lg p-2 focus:outline-none focus:border-cyan-500"
          >
            {sources.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        {/* Action Buttons */}
        <div className="bg-slate-900/60 p-3.5 rounded-xl border border-slate-800 flex items-center gap-3">
          <button
            onClick={handleSnapshot}
            className="flex-1 py-2.5 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold flex items-center justify-center gap-2 transition border border-slate-700"
          >
            {snapshotTaken ? <Check className="w-4 h-4 text-emerald-400" /> : <Camera className="w-4 h-4 text-cyan-400" />}
            {snapshotTaken ? 'Snapshot Saved!' : 'Take Snapshot'}
          </button>

          <button
            onClick={handleRecordToggle}
            className={`flex-1 py-2.5 px-3 rounded-lg font-bold flex items-center justify-center gap-2 transition border ${
              isRecording
                ? 'bg-rose-600/30 text-rose-300 border-rose-500 animate-pulse'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
            }`}
          >
            <Video className="w-4 h-4" />
            {isRecording ? 'Stop Rec' : 'Start Rec'}
          </button>
        </div>
      </div>
    </div>
  );
}
