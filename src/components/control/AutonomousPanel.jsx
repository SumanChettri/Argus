import React, { useState } from 'react';
import { useTelemetry } from '../../context/TelemetryContext';
import { Play, Pause, XCircle, Navigation, MapPin, CheckCircle2 } from 'lucide-react';
import StatusBadge from '../common/StatusBadge';

export default function AutonomousPanel() {
  const { currentMission, roverMode, setRoverMode, telemetry, addLog } = useTelemetry();
  const [selectedMission, setSelectedMission] = useState('Search & Rescue Alpha');
  const [missionState, setMissionState] = useState('RUNNING'); // 'RUNNING' | 'PAUSED' | 'IDLE'

  const missions = [
    'Search & Rescue Alpha',
    'Environmental Survey',
    'Hazard Inspection',
    'Campus Patrol',
    'Custom Mission',
  ];

  const handleStart = () => {
    setMissionState('RUNNING');
    setRoverMode('AUTONOMOUS');
    addLog(`Autonomous mission "${selectedMission}" resumed/started`, 'info');
  };

  const handlePause = () => {
    setMissionState('PAUSED');
    addLog(`Autonomous mission "${selectedMission}" paused by operator`, 'warning');
  };

  const handleAbort = () => {
    setMissionState('IDLE');
    setRoverMode('MANUAL');
    addLog(`Autonomous mission "${selectedMission}" aborted by operator`, 'critical');
  };

  const completedWaypoints = currentMission.completedWaypoints;
  const totalWaypoints = currentMission.targetWaypoints;
  const progressPct = Math.round((completedWaypoints / totalWaypoints) * 100);

  return (
    <div className="card-hud rounded-2xl p-5 border border-slate-800 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
            <Navigation className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Autonomous Mission Control</h3>
            <p className="text-[11px] font-mono text-slate-400">Waypoint Navigation Engine</p>
          </div>
        </div>
        <StatusBadge status={roverMode === 'AUTONOMOUS' ? 'AUTONOMOUS' : 'MANUAL'} />
      </div>

      {/* Mission Selector */}
      <div className="bg-slate-900/60 p-3.5 rounded-xl border border-slate-800 space-y-2">
        <label className="text-xs text-slate-400 font-mono block">Active Mission Routine:</label>
        <select
          value={selectedMission}
          onChange={(e) => setSelectedMission(e.target.value)}
          className="w-full bg-slate-900 border border-slate-700 text-slate-100 text-xs font-mono rounded-lg p-2 focus:outline-none focus:border-cyan-500"
        >
          {missions.map(m => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>
      </div>

      {/* Control Buttons */}
      <div className="grid grid-cols-3 gap-2">
        <button
          onClick={handleStart}
          disabled={missionState === 'RUNNING'}
          className={`py-2 px-3 rounded-lg text-xs font-bold font-mono flex items-center justify-center gap-1.5 transition ${
            missionState === 'RUNNING'
              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
              : 'bg-emerald-600 hover:bg-emerald-500 text-white'
          }`}
        >
          <Play className="w-3.5 h-3.5" /> Start
        </button>

        <button
          onClick={handlePause}
          disabled={missionState !== 'RUNNING'}
          className="py-2 px-3 rounded-lg bg-amber-600/20 hover:bg-amber-600 text-amber-400 hover:text-white border border-amber-500/40 text-xs font-bold font-mono flex items-center justify-center gap-1.5 transition"
        >
          <Pause className="w-3.5 h-3.5" /> Pause
        </button>

        <button
          onClick={handleAbort}
          className="py-2 px-3 rounded-lg bg-rose-600/20 hover:bg-rose-600 text-rose-400 hover:text-white border border-rose-500/40 text-xs font-bold font-mono flex items-center justify-center gap-1.5 transition"
        >
          <XCircle className="w-3.5 h-3.5" /> Abort
        </button>
      </div>

      {/* Progress & Waypoints Status */}
      <div className="bg-slate-900/60 p-3.5 rounded-xl border border-slate-800 space-y-3 font-mono text-xs">
        <div className="flex items-center justify-between">
          <span className="text-slate-400">Progress ({completedWaypoints}/{totalWaypoints} Waypoints):</span>
          <span className="font-bold text-cyan-400">{progressPct}%</span>
        </div>

        <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-cyan-400 transition-all duration-500"
            style={{ width: `${progressPct}%` }}
          />
        </div>

        <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
          <div>
            <span className="text-slate-500 block">Current Waypoint:</span>
            <span className="font-bold text-slate-200 flex items-center gap-1">
              <MapPin className="w-3 h-3 text-cyan-400" /> Waypoint 7 (Survivors)
            </span>
          </div>
          <div>
            <span className="text-slate-500 block">Current Heading:</span>
            <span className="font-bold text-slate-200">{telemetry.gps.heading}° NE</span>
          </div>
        </div>
      </div>
    </div>
  );
}
