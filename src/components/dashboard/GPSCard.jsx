import React from 'react';
import { useTelemetry } from '../../context/TelemetryContext';
import { Navigation, Satellite } from 'lucide-react';
import { formatCoordinates } from '../../utils/formatters';

export default function GPSCard() {
  const { telemetry } = useTelemetry();
  const { latitude, longitude, satellites, lock, accuracyMeters } = telemetry.gps;

  return (
    <div className="card-hud rounded-xl p-5 border border-slate-800 flex flex-col justify-between">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
            <Navigation className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">GPS Position</h3>
            <p className="text-[11px] font-mono text-slate-400">NEO-M8N GNSS</p>
          </div>
        </div>
        <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
          {lock ? '3D LOCK' : 'SEARCHING'}
        </span>
      </div>

      <div className="my-2 font-mono">
        <div className="text-xs text-slate-400 mb-0.5">Coordinates:</div>
        <div className="text-sm font-bold text-slate-100 truncate">
          {formatCoordinates(latitude, longitude, 5)}
        </div>
      </div>

      <div className="mt-2 pt-2 border-t border-slate-800 text-[11px] font-mono text-slate-400 flex items-center justify-between">
        <span className="flex items-center gap-1">
          <Satellite className="w-3.5 h-3.5 text-cyan-400" /> Sats: <strong className="text-slate-200">{satellites}</strong>
        </span>
        <span>Accuracy: <strong className="text-slate-200">{accuracyMeters}m</strong></span>
      </div>
    </div>
  );
}
