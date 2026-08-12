import React from 'react';
import { useTelemetry } from '../../context/TelemetryContext';
import { Gauge, Zap } from 'lucide-react';

export default function MotorStatus({ speed, onSpeedChange }) {
  const { telemetry, eStopped } = useTelemetry();
  const { leftSpeed, rightSpeed, state } = telemetry.motors;

  return (
    <div className="card-hud rounded-2xl p-5 border border-slate-800 flex flex-col justify-between">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
            <Gauge className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Drive Motor Dynamics</h3>
            <p className="text-[11px] font-mono text-slate-400">Differential Speed Controller</p>
          </div>
        </div>
        <span className="text-xs font-mono font-bold text-cyan-400 bg-slate-900 px-2.5 py-1 rounded border border-slate-800">
          {state}
        </span>
      </div>

      {/* Speed Slider */}
      <div className="my-3 bg-slate-900/60 p-4 rounded-xl border border-slate-800">
        <div className="flex items-center justify-between text-xs font-mono mb-2">
          <span className="text-slate-400">Drive Speed Limit:</span>
          <span className="text-sm font-bold text-cyan-400">{speed}%</span>
        </div>
        <input
          type="range"
          min="10"
          max="100"
          value={speed}
          onChange={(e) => onSpeedChange(Number(e.target.value))}
          disabled={eStopped}
          className="w-full accent-cyan-400 cursor-pointer h-2 bg-slate-800 rounded-lg"
        />
        <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
          <span>10% (Crawl)</span>
          <span>50% (Standard)</span>
          <span>100% (Sprint)</span>
        </div>
      </div>

      {/* Motor RPM / Output Gauges */}
      <div className="grid grid-cols-2 gap-3 font-mono">
        <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
          <div className="text-[11px] text-slate-400 mb-1 flex items-center justify-between">
            <span>Left Motor</span>
            <Zap className="w-3 h-3 text-cyan-400" />
          </div>
          <div className="text-xl font-bold text-slate-100 mb-1">{leftSpeed}%</div>
          <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-cyan-400 transition-all duration-300"
              style={{ width: `${leftSpeed}%` }}
            />
          </div>
        </div>

        <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
          <div className="text-[11px] text-slate-400 mb-1 flex items-center justify-between">
            <span>Right Motor</span>
            <Zap className="w-3 h-3 text-cyan-400" />
          </div>
          <div className="text-xl font-bold text-slate-100 mb-1">{rightSpeed}%</div>
          <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-cyan-400 transition-all duration-300"
              style={{ width: `${rightSpeed}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
