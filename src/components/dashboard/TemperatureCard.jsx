import React from 'react';
import { useTelemetry } from '../../context/TelemetryContext';
import { Thermometer, TrendingUp, TrendingDown, Minus } from 'lucide-react';

export default function TemperatureCard() {
  const { telemetry } = useTelemetry();
  const { current, min, max, trend, unit } = telemetry.temperature;

  const renderTrendIcon = () => {
    if (trend === 'rising') return <TrendingUp className="w-3.5 h-3.5 text-rose-400" />;
    if (trend === 'falling') return <TrendingDown className="w-3.5 h-3.5 text-emerald-400" />;
    return <Minus className="w-3.5 h-3.5 text-slate-400" />;
  };

  return (
    <div className="card-hud rounded-xl p-5 border border-slate-800 flex flex-col justify-between">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/30">
            <Thermometer className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Temperature</h3>
            <p className="text-[11px] font-mono text-slate-400">Ambient Sensor</p>
          </div>
        </div>
        <div className="flex items-center gap-1 text-xs font-mono text-slate-400 bg-slate-900/60 px-2 py-0.5 rounded border border-slate-800">
          {renderTrendIcon()}
          <span className="capitalize">{trend}</span>
        </div>
      </div>

      <div className="my-2">
        <div className="flex items-baseline gap-1 font-mono">
          <span className="text-3xl font-black text-slate-100">{current}</span>
          <span className="text-sm font-semibold text-slate-400">{unit}</span>
        </div>
      </div>

      <div className="mt-2 pt-2 border-t border-slate-800 text-[11px] font-mono text-slate-400 flex items-center justify-between">
        <span>Min: <strong className="text-slate-200">{min}{unit}</strong></span>
        <span>Max: <strong className="text-slate-200">{max}{unit}</strong></span>
      </div>
    </div>
  );
}
