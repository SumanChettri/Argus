import React from 'react';
import { useTelemetry } from '../../context/TelemetryContext';
import { Bell, AlertTriangle, Info, Check, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function NotificationPanel({ isOpen, onClose }) {
  const { alerts, acknowledgeAlert, clearAlerts } = useTelemetry();
  const navigate = useNavigate();

  if (!isOpen) return null;

  const unreadCount = alerts.filter(a => a.status === 'new').length;

  return (
    <div className="absolute right-0 top-12 w-80 sm:w-96 bg-slate-900 border border-slate-700/80 rounded-xl shadow-2xl z-50 overflow-hidden animate-fadeIn backdrop-blur-lg">
      <div className="flex items-center justify-between px-4 py-3 bg-slate-800/80 border-b border-slate-700/60">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-cyan-400" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">Mission Notifications</h3>
          {unreadCount > 0 && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500 text-black">
              {unreadCount} NEW
            </span>
          )}
        </div>
        {alerts.length > 0 && (
          <button
            onClick={clearAlerts}
            className="text-[11px] text-slate-400 hover:text-rose-400 flex items-center gap-1 transition"
          >
            <Trash2 className="w-3 h-3" /> Clear All
          </button>
        )}
      </div>

      <div className="max-h-80 overflow-y-auto divide-y divide-slate-800">
        {alerts.length === 0 ? (
          <div className="p-6 text-center text-slate-500 text-xs font-mono">
            No active alerts or notifications
          </div>
        ) : (
          alerts.map(a => {
            const isNew = a.status === 'new';
            return (
              <div
                key={a.id}
                onClick={() => {
                  acknowledgeAlert(a.id);
                  onClose();
                  navigate('/alerts');
                }}
                className={`p-3.5 hover:bg-slate-800/60 cursor-pointer transition flex items-start gap-3 ${
                  isNew ? 'bg-slate-800/30' : 'opacity-80'
                }`}
              >
                <div
                  className={`p-1.5 rounded-lg shrink-0 mt-0.5 ${
                    a.severity === 'critical'
                      ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                      : a.severity === 'warning'
                      ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      : 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                  }`}
                >
                  {a.severity === 'critical' ? (
                    <AlertTriangle className="w-4 h-4" />
                  ) : (
                    <Info className="w-4 h-4" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="text-xs font-bold text-slate-200 truncate">{a.sensor}</span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {new Date(a.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 line-clamp-2">{a.message}</p>
                </div>
              </div>
            );
          })
        )}
      </div>

      <div className="p-2.5 bg-slate-900 border-t border-slate-800 text-center">
        <button
          onClick={() => {
            onClose();
            navigate('/alerts');
          }}
          className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition"
        >
          Open Alerts Center &rarr;
        </button>
      </div>
    </div>
  );
}
