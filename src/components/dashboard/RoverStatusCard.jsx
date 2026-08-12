import React from 'react';
import { useTelemetry } from '../../context/TelemetryContext';
import { Shield, Radio, Cpu, Activity } from 'lucide-react';
import StatusBadge from '../common/StatusBadge';

export default function RoverStatusCard() {
  const { telemetry, isConnected, eStopped } = useTelemetry();

  return (
    <div className="card-hud rounded-xl p-5 border border-slate-800 flex flex-col justify-between">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Rover Status</h3>
            <p className="text-[11px] font-mono text-cyan-400 font-bold mt-0.5">ARGUS-01</p>
          </div>
        </div>
        <StatusBadge
          status={eStopped ? 'E-STOPPED' : isConnected ? 'ONLINE' : 'OFFLINE'}
        />
      </div>

      <div className="grid grid-cols-2 gap-3 my-2 text-xs font-mono">
        <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
          <span className="text-[10px] text-slate-500 block uppercase">Mode</span>
          <span className="font-bold text-slate-100">{telemetry.motors.mode}</span>
        </div>
        <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
          <span className="text-[10px] text-slate-500 block uppercase">State</span>
          <span className="font-bold text-cyan-400">{telemetry.motors.state}</span>
        </div>
      </div>

      <div className="mt-2 pt-2 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between font-mono">
        <span>MCU: ESP32 Dual-Core</span>
        <span className="text-emerald-400 flex items-center gap-1">
          <Activity className="w-3 h-3 animate-pulse" /> Live System
        </span>
      </div>
    </div>
  );
}
