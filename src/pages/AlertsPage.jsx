import React, { useState } from 'react';
import { useTelemetry } from '../context/TelemetryContext';
import StatusBadge from '../components/common/StatusBadge';
import { AlertTriangle, Info, Check, Trash2, Volume2, VolumeX, Filter } from 'lucide-react';

export default function AlertsPage() {
  const { alerts, acknowledgeAlert, clearAlerts, soundEnabled, setSoundEnabled } = useTelemetry();
  const [severityFilter, setSeverityFilter] = useState('ALL');

  const filteredAlerts = alerts.filter(a => {
    if (severityFilter === 'ALL') return true;
    return a.severity.toUpperCase() === severityFilter;
  });

  return (
    <div className="space-y-6 animate-fadeIn font-mono">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/80 p-5 rounded-2xl border border-slate-800">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/30">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-100">Mission Alerts & Interlock Center</h1>
              <p className="text-xs text-slate-400 mt-0.5">Real-time Hazard Notifications & Sensor Alarms</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`px-3 py-2 rounded-xl border flex items-center gap-1.5 transition ${
              soundEnabled
                ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40'
                : 'bg-slate-800 text-slate-400 border-slate-700'
            }`}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            {soundEnabled ? 'Audio Alarms Active' : 'Muted'}
          </button>

          {alerts.length > 0 && (
            <button
              onClick={clearAlerts}
              className="px-3 py-2 rounded-xl bg-rose-600/20 hover:bg-rose-600 text-rose-400 hover:text-white border border-rose-500/40 flex items-center gap-1.5 transition"
            >
              <Trash2 className="w-4 h-4" /> Clear All
            </button>
          )}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 bg-slate-900/60 p-2 rounded-xl border border-slate-800 text-xs">
        <Filter className="w-4 h-4 text-slate-400 ml-2" />
        <span className="text-slate-400 mr-2">Severity Filter:</span>
        {['ALL', 'CRITICAL', 'WARNING', 'INFO'].map((f) => (
          <button
            key={f}
            onClick={() => setSeverityFilter(f)}
            className={`px-3 py-1.5 rounded-lg transition font-bold ${
              severityFilter === f
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Alerts Cards List */}
      <div className="space-y-3">
        {filteredAlerts.length === 0 ? (
          <div className="card-hud rounded-2xl p-12 text-center text-slate-500 text-sm">
            No alerts found matching filter criteria. All systems nominal.
          </div>
        ) : (
          filteredAlerts.map((a) => {
            const isNew = a.status === 'new';
            const isCrit = a.severity === 'critical';
            const isWarn = a.severity === 'warning';

            return (
              <div
                key={a.id}
                className={`card-hud rounded-2xl p-4 border transition flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                  isCrit
                    ? 'border-rose-500/40 bg-rose-950/20 glow-red'
                    : isWarn
                    ? 'border-amber-500/40 bg-amber-950/20 glow-amber'
                    : 'border-slate-800'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`p-2.5 rounded-xl shrink-0 mt-0.5 ${
                      isCrit
                        ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                        : isWarn
                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                        : 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40'
                    }`}
                  >
                    {isCrit || isWarn ? <AlertTriangle className="w-5 h-5" /> : <Info className="w-5 h-5" />}
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-100 text-sm">{a.sensor}</span>
                      <StatusBadge status={a.severity} />
                      {isNew && (
                        <span className="px-2 py-0.5 rounded text-[9px] font-extrabold bg-amber-500 text-black">
                          NEW
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">{a.message}</p>
                    <p className="text-[10px] text-slate-500">
                      Timestamp: {new Date(a.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  {isNew && (
                    <button
                      onClick={() => acknowledgeAlert(a.id)}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1 transition border border-slate-700"
                    >
                      <Check className="w-3.5 h-3.5 text-emerald-400" /> Acknowledge
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
