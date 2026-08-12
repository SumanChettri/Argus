import React from 'react';
import { useTelemetry } from '../../context/TelemetryContext';
import { Battery, Zap, Clock } from 'lucide-react';

export default function BatteryCard() {
  const { telemetry } = useTelemetry();
  const { percentage, voltage, estimatedRuntimeMin, charging } = telemetry.battery;

  const getBarColor = () => {
    if (percentage <= 20) return 'bg-rose-500 shadow-rose-500/50';
    if (percentage <= 45) return 'bg-amber-500 shadow-amber-500/50';
    return 'bg-emerald-500 shadow-emerald-500/50';
  };

  return (
    <div className="card-hud rounded-xl p-5 border border-slate-800 flex flex-col justify-between">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            <Battery className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Battery Power</h3>
            <p className="text-[11px] font-mono text-slate-400">2S LiPo 7.4V Pack</p>
          </div>
        </div>
        <span className="text-xs font-mono text-slate-400 flex items-center gap-1">
          <Zap className="w-3.5 h-3.5 text-amber-400" />
          {charging ? 'Charging' : 'Discharging'}
        </span>
      </div>

      <div className="my-2">
        <div className="flex items-baseline justify-between mb-1.5 font-mono">
          <span className="text-3xl font-black text-slate-100">{percentage}%</span>
          <span className="text-sm font-semibold text-slate-300">{voltage} V</span>
        </div>

        {/* Visual Progress Bar */}
        <div className="w-full h-3 bg-slate-900 rounded-full p-0.5 border border-slate-800 relative overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${getBarColor()}`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>

      <div className="mt-2 pt-2 border-t border-slate-800 text-[11px] font-mono text-slate-400 flex items-center justify-between">
        <span className="flex items-center gap-1">
          <Clock className="w-3.5 h-3.5 text-cyan-400" /> Est. Runtime:
        </span>
        <span className="font-bold text-slate-200">{estimatedRuntimeMin} min</span>
      </div>
    </div>
  );
}
