import React from 'react';
import { useTelemetry } from '../../context/TelemetryContext';
import { MapPin, CheckCircle2, Clock, Navigation } from 'lucide-react';
import { formatCoordinates } from '../../utils/formatters';

export default function RouteSidebar() {
  const { currentMission } = useTelemetry();

  return (
    <div className="card-hud rounded-2xl p-5 border border-slate-800 flex flex-col h-full font-mono text-xs">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-cyan-400" />
          <h3 className="font-bold text-slate-100 uppercase">Mission Route Timeline</h3>
        </div>
        <span className="text-[11px] text-slate-400">
          {currentMission.completedWaypoints}/{currentMission.targetWaypoints} Done
        </span>
      </div>

      <div className="space-y-3 overflow-y-auto max-h-[380px] pr-1">
        {currentMission.waypoints.map((wp, i) => {
          const isDone = wp.status === 'completed';
          const isCurrent = wp.status === 'current';

          return (
            <div
              key={wp.id}
              className={`p-3 rounded-xl border transition flex items-start gap-3 ${
                isCurrent
                  ? 'bg-cyan-500/15 border-cyan-500/40 text-cyan-300 shadow-sm shadow-cyan-950'
                  : isDone
                  ? 'bg-slate-900/60 border-slate-800 text-slate-300'
                  : 'bg-slate-900/30 border-slate-800/60 text-slate-500'
              }`}
            >
              <div className="mt-0.5 shrink-0">
                {isDone ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ) : isCurrent ? (
                  <Navigation className="w-4 h-4 text-cyan-400 animate-bounce" />
                ) : (
                  <Clock className="w-4 h-4 text-slate-500" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1 mb-0.5">
                  <span className="font-bold truncate text-slate-200">
                    {wp.id}. {wp.name}
                  </span>
                  <span
                    className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase ${
                      isDone
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : isCurrent
                        ? 'bg-cyan-500/20 text-cyan-400'
                        : 'bg-slate-800 text-slate-500'
                    }`}
                  >
                    {wp.status}
                  </span>
                </div>
                <div className="text-[10px] text-slate-400">
                  {formatCoordinates(wp.lat, wp.lng, 4)}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
