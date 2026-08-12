import React from 'react';
import { useTelemetry } from '../../context/TelemetryContext';
import { AlertOctagon, ShieldAlert, CheckCircle2 } from 'lucide-react';

export default function EmergencyStopModal() {
  const { isEStopModalOpen, setIsEStopModalOpen, eStopped, triggerEmergencyStop, resetEmergencyStop } = useTelemetry();

  if (!isEStopModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-slate-900 border-2 border-rose-600/80 rounded-2xl max-w-md w-full p-6 shadow-2xl glow-red relative overflow-hidden">
        {/* Top warning stripe */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-rose-600 via-amber-500 to-rose-600 animate-pulse" />

        <div className="flex items-center gap-4 mb-4">
          <div className="p-3 rounded-xl bg-rose-500/20 text-rose-500 border border-rose-500/40">
            <AlertOctagon className="w-8 h-8 animate-bounce" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-100 tracking-tight">Emergency Stop System</h2>
            <p className="text-xs text-rose-400 font-mono">CRITICAL SAFETY INTERLOCK • ARGUS-01</p>
          </div>
        </div>

        {!eStopped ? (
          <>
            <p className="text-sm text-slate-300 mb-6 leading-relaxed bg-slate-800/60 p-3.5 rounded-xl border border-slate-700/50">
              Are you sure you want to immediately stop all rover motor movements, abort active autonomous waypoints, and force emergency hardware brake state?
            </p>

            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setIsEStopModalOpen(false)}
                className="px-4 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-semibold transition"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  triggerEmergencyStop();
                  setIsEStopModalOpen(false);
                }}
                className="px-5 py-2.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-sm font-bold tracking-wide uppercase shadow-lg shadow-rose-950 flex items-center gap-2 transition"
              >
                <ShieldAlert className="w-4 h-4" />
                EMERGENCY STOP
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="bg-rose-950/40 border border-rose-500/40 rounded-xl p-4 mb-6">
              <div className="flex items-center gap-2 text-rose-400 font-bold mb-1">
                <AlertOctagon className="w-5 h-5" />
                ROVER HALTED & E-STOPPED
              </div>
              <p className="text-xs text-slate-300">
                All actuators and motor drivers are currently in HARDWARE LOCK. Clear E-STOP to resume normal operations.
              </p>
            </div>

            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setIsEStopModalOpen(false)}
                className="px-4 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-semibold transition"
              >
                Keep Halted
              </button>
              <button
                onClick={() => {
                  resetEmergencyStop();
                  setIsEStopModalOpen(false);
                }}
                className="px-5 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold flex items-center gap-2 transition"
              >
                <CheckCircle2 className="w-4 h-4" />
                Clear E-STOP & Resume
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
