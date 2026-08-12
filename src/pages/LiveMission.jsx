import React from 'react';
import { useTelemetry } from '../context/TelemetryContext';
import CameraFeed from '../components/camera/CameraFeed';
import DPadControl from '../components/control/DPadControl';
import EventTimeline from '../components/mission/EventTimeline';
import ObstacleRadar from '../components/telemetry/ObstacleRadar';
import StatusBadge from '../components/common/StatusBadge';
import { Radio } from 'lucide-react';

export default function LiveMission() {
  const { currentMission, telemetry, roverMode } = useTelemetry();

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/80 p-5 rounded-2xl border border-slate-800">
        <div>
          <div className="flex items-center gap-2 font-mono">
            <Radio className="w-5 h-5 text-rose-500 animate-pulse" />
            <h1 className="text-xl font-bold text-slate-100 uppercase">Live Mission Command Center</h1>
            <StatusBadge status="LIVE" />
          </div>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Active Mission: <strong className="text-cyan-400">{currentMission.name}</strong> • Sector 4 Disaster Zone
          </p>
        </div>

        {/* Mission Metrics Summary Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
          <div className="bg-slate-800/80 p-2.5 rounded-xl border border-slate-700/50">
            <span className="text-[10px] text-slate-400 block">Waypoints</span>
            <span className="font-bold text-cyan-400">{currentMission.completedWaypoints} / {currentMission.targetWaypoints}</span>
          </div>
          <div className="bg-slate-800/80 p-2.5 rounded-xl border border-slate-700/50">
            <span className="text-[10px] text-slate-400 block">Distance</span>
            <span className="font-bold text-slate-100">{telemetry.distanceTraveledKm} km</span>
          </div>
          <div className="bg-slate-800/80 p-2.5 rounded-xl border border-slate-700/50">
            <span className="text-[10px] text-slate-400 block">Mode</span>
            <span className="font-bold text-slate-100">{roverMode}</span>
          </div>
          <div className="bg-slate-800/80 p-2.5 rounded-xl border border-slate-700/50">
            <span className="text-[10px] text-slate-400 block">Hazard Level</span>
            <span className={telemetry.gas.status === 'CRITICAL' ? 'text-rose-400 font-bold' : 'text-emerald-400 font-bold'}>
              {telemetry.gas.status}
            </span>
          </div>
        </div>
      </div>

      {/* Main Command Center Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Main Live Camera Feed */}
        <div className="lg:col-span-2 space-y-6">
          <CameraFeed className="h-[460px]" />
          <ObstacleRadar />
        </div>

        {/* Right 1 Col: Quick Control D-Pad & Timeline */}
        <div className="space-y-6">
          <DPadControl speed={75} />
          <EventTimeline />
        </div>
      </div>
    </div>
  );
}
