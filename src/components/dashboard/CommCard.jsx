import React from 'react';
import { useTelemetry } from '../../context/TelemetryContext';
import { Wifi, Signal, Activity } from 'lucide-react';

export default function CommCard() {
  const { telemetry, isConnected } = useTelemetry();
  const { type, signalDbm, signalPercentage, pingMs, packetsReceived } = telemetry.connection;

  return (
    <div className="card-hud rounded-xl p-5 border border-slate-800 flex flex-col justify-between">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            <Wifi className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Communication</h3>
            <p className="text-[11px] font-mono text-slate-400">{type}</p>
          </div>
        </div>
        <span className="text-xs font-mono text-slate-400 flex items-center gap-1">
          <Signal className="w-3.5 h-3.5 text-cyan-400" />
          {signalPercentage}%
        </span>
      </div>

      <div className="my-2 font-mono flex items-baseline justify-between">
        <div>
          <span className="text-3xl font-black text-slate-100">{signalDbm}</span>
          <span className="text-sm font-semibold text-slate-400 ml-1">dBm</span>
        </div>
        <div className="text-right">
          <div className="text-xs text-slate-400">Latency</div>
          <div className="text-sm font-bold text-emerald-400">{pingMs} ms</div>
        </div>
      </div>

      <div className="mt-2 pt-2 border-t border-slate-800 text-[11px] font-mono text-slate-400 flex items-center justify-between">
        <span>Packets: <strong className="text-slate-200">{packetsReceived}</strong></span>
        <span className="text-emerald-400 flex items-center gap-1">
          <Activity className="w-3 h-3 animate-pulse" /> {isConnected ? 'Connected' : 'Offline'}
        </span>
      </div>
    </div>
  );
}
