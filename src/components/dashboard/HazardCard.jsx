import React from 'react';
import { useTelemetry } from '../../context/TelemetryContext';
import { Flame, AlertTriangle, ShieldCheck } from 'lucide-react';
import StatusBadge from '../common/StatusBadge';

export default function HazardCard() {
  const { telemetry } = useTelemetry();
  const { smokePpm, status, sensorState } = telemetry.gas;

  const renderStatusIcon = () => {
    if (status === 'CRITICAL') return <AlertTriangle className="w-5 h-5 text-rose-400 animate-bounce" />;
    if (status === 'WARNING') return <AlertTriangle className="w-5 h-5 text-amber-400" />;
    return <ShieldCheck className="w-5 h-5 text-emerald-400" />;
  };

  return (
    <div className="card-hud rounded-xl p-5 border border-slate-800 flex flex-col justify-between">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/30">
            <Flame className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Gas / Hazard</h3>
            <p className="text-[11px] font-mono text-slate-400">MQ-2 Array</p>
          </div>
        </div>
        <StatusBadge status={status} />
      </div>

      <div className="my-2">
        <div className="flex items-baseline justify-between font-mono">
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-black text-slate-100">{smokePpm}</span>
            <span className="text-sm font-semibold text-slate-400">PPM</span>
          </div>
          {renderStatusIcon()}
        </div>
      </div>

      <div className="mt-2 pt-2 border-t border-slate-800 text-[11px] font-mono text-slate-400 flex items-center justify-between">
        <span>State: <strong className="text-slate-200">{sensorState}</strong></span>
        <span className="text-cyan-400 font-semibold">Smoke / LPG / CO</span>
      </div>
    </div>
  );
}
