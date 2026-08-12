import React from 'react';
import { useTelemetry } from '../../context/TelemetryContext';
import { Radio, AlertOctagon, ShieldCheck } from 'lucide-react';
import StatusBadge from '../common/StatusBadge';

export default function ObstacleRadar() {
  const { telemetry } = useTelemetry();
  const { frontCm, leftCm, rightCm, rearCm, status } = telemetry.obstacle;

  const getDistanceColor = (distCm) => {
    if (distCm < 30) return 'text-rose-400 border-rose-500 bg-rose-500/10 glow-red animate-pulse';
    if (distCm < 60) return 'text-amber-400 border-amber-500 bg-amber-500/10 glow-amber';
    return 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10';
  };

  return (
    <div className="card-hud rounded-2xl p-5 border border-slate-800 space-y-4 font-mono">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
            <Radio className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Sonar Obstacle Radar</h3>
            <p className="text-[11px] font-mono text-slate-400">2D Ultrasonic Range Detector</p>
          </div>
        </div>
        <StatusBadge status={status === 'OBSTACLE DETECTED' ? 'CRITICAL' : status === 'CAUTION' ? 'WARNING' : 'SAFE'} label={status} />
      </div>

      {/* 2D Visual Radar Map */}
      <div className="relative w-full h-64 bg-slate-950 rounded-2xl border border-slate-800 flex items-center justify-center overflow-hidden">
        {/* Concentric Radar Distance Rings */}
        <div className="absolute w-52 h-52 border border-cyan-500/20 rounded-full flex items-center justify-center">
          <div className="absolute w-36 h-36 border border-cyan-500/30 rounded-full flex items-center justify-center">
            <div className="absolute w-20 h-20 border border-cyan-500/40 rounded-full flex items-center justify-center">
              <div className="w-4 h-4 bg-cyan-500/60 rounded-full" />
            </div>
          </div>
        </div>

        {/* Rotating Radar Line Sweep */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-56 h-56 rounded-full animate-radar-sweep opacity-40 bg-[conic-gradient(from_0deg,transparent_0_300deg,rgba(6,182,212,0.4)_360deg)]" />
        </div>

        {/* FRONT DISTANCE INDICATOR */}
        <div className={`absolute top-3 px-3 py-1 rounded-lg border text-xs font-bold ${getDistanceColor(frontCm)}`}>
          FRONT: {frontCm} cm
        </div>

        {/* LEFT DISTANCE INDICATOR */}
        <div className={`absolute left-3 px-3 py-1 rounded-lg border text-xs font-bold ${getDistanceColor(leftCm)}`}>
          LEFT: {leftCm} cm
        </div>

        {/* CENTER ROVER ICON */}
        <div className="z-10 p-2.5 rounded-xl bg-slate-900 border-2 border-cyan-400 text-cyan-300 font-extrabold text-[10px] text-center shadow-lg">
          ARGUS-01
        </div>

        {/* RIGHT DISTANCE INDICATOR */}
        <div className={`absolute right-3 px-3 py-1 rounded-lg border text-xs font-bold ${getDistanceColor(rightCm)}`}>
          RIGHT: {rightCm} cm
        </div>

        {/* REAR DISTANCE INDICATOR */}
        <div className={`absolute bottom-3 px-3 py-1 rounded-lg border text-xs font-bold ${getDistanceColor(rearCm)}`}>
          REAR: {rearCm} cm
        </div>
      </div>
    </div>
  );
}
