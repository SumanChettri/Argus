import React from 'react';
import { X, Calendar, MapPin, ShieldCheck, Clock, Navigation } from 'lucide-react';
import StatusBadge from '../common/StatusBadge';
import { formatCoordinates } from '../../utils/formatters';

export default function MissionDetailModal({ mission, onClose }) {
  if (!mission) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl max-w-2xl w-full p-6 shadow-2xl relative font-mono text-xs max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div>
            <span className="text-[10px] text-cyan-400 font-bold uppercase">{mission.id}</span>
            <h2 className="text-lg font-bold text-slate-100">{mission.name}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-4">
          <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/50">
            <span className="text-[10px] text-slate-400 block uppercase">Duration</span>
            <span className="font-bold text-slate-100">{mission.duration}</span>
          </div>
          <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/50">
            <span className="text-[10px] text-slate-400 block uppercase">Distance</span>
            <span className="font-bold text-cyan-400">{mission.distance} km</span>
          </div>
          <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/50">
            <span className="text-[10px] text-slate-400 block uppercase">Mode</span>
            <span className="font-bold text-slate-100">{mission.mode}</span>
          </div>
          <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/50">
            <span className="text-[10px] text-slate-400 block uppercase">Result</span>
            <StatusBadge status={mission.result} />
          </div>
        </div>

        <div className="bg-slate-800/40 p-4 rounded-xl border border-slate-700/50 space-y-2 mb-4">
          <h4 className="font-bold text-slate-200 uppercase text-xs">Mission Summary & Key Findings</h4>
          <p className="text-slate-300 leading-relaxed text-[11px]">
            {mission.summary || 'Rover completed autonomous scanning of designated perimeter nodes. Gas levels remained within normal ranges, and obstacle auto-rerouting successfully avoided structural debris.'}
          </p>
        </div>

        <div className="space-y-2">
          <h4 className="font-bold text-slate-200 uppercase text-xs">Sample Telemetry Highlights</h4>
          <div className="grid grid-cols-2 gap-2 text-[11px]">
            <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
              <span className="text-slate-400">Peak Gas Detected:</span>{' '}
              <strong className="text-amber-400">142 PPM (Safe)</strong>
            </div>
            <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
              <span className="text-slate-400">Battery Consumed:</span>{' '}
              <strong className="text-emerald-400">22% (Pack Nominal)</strong>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-semibold transition"
          >
            Close Summary
          </button>
        </div>
      </div>
    </div>
  );
}
