import React from 'react';
import { useTelemetry } from '../../context/TelemetryContext';
import { Activity, AlertTriangle, CheckCircle, Info } from 'lucide-react';

export default function EventTimeline() {
  const { logs } = useTelemetry();

  return (
    <div className="card-hud rounded-2xl p-5 border border-slate-800 space-y-4 font-mono">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Mission Event Stream</h3>
            <p className="text-[11px] text-slate-500">Real-time Telemetry & Command Log</p>
          </div>
        </div>
      </div>

      <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
        {logs.map((log) => {
          const isCrit = log.type === 'critical';
          const isWarn = log.type === 'warning';

          return (
            <div
              key={log.id}
              className={`p-3 rounded-xl border transition flex items-start gap-3 text-xs ${
                isCrit
                  ? 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                  : isWarn
                  ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                  : 'bg-slate-900/60 border-slate-800 text-slate-300'
              }`}
            >
              <div className="mt-0.5 shrink-0">
                {isCrit || isWarn ? (
                  <AlertTriangle className={`w-4 h-4 ${isCrit ? 'text-rose-400' : 'text-amber-400'}`} />
                ) : (
                  <Info className="w-4 h-4 text-cyan-400" />
                )}
              </div>

              <div className="flex-1">
                <div className="flex items-center justify-between text-[10px] text-slate-400 mb-0.5">
                  <span className="font-bold">{log.timestamp}</span>
                  <span className="uppercase font-semibold">{log.type}</span>
                </div>
                <p className="text-slate-200">{log.event}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
