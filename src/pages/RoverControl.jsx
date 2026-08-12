import React, { useState } from 'react';
import { useTelemetry } from '../context/TelemetryContext';
import DPadControl from '../components/control/DPadControl';
import MotorStatus from '../components/control/MotorStatus';
import AutonomousPanel from '../components/control/AutonomousPanel';
import StatusBadge from '../components/common/StatusBadge';
import { Gamepad2, ShieldAlert } from 'lucide-react';

export default function RoverControl() {
  const { roverMode, setRoverMode, eStopped, setIsEStopModalOpen } = useTelemetry();
  const [driveSpeed, setDriveSpeed] = useState(70);

  const modes = [
    { id: 'MANUAL', label: 'Manual Drive', desc: 'Direct D-Pad & Keyboard Joystick Control' },
    { id: 'ASSISTED', label: 'Assisted Drive', desc: 'Manual Steering with Sonar Auto-Braking' },
    { id: 'AUTONOMOUS', label: 'Autonomous Mission', desc: 'GPS & Waypoint Path Routine Execution' },
  ];

  return (
    <div className="space-y-6 animate-fadeIn font-mono">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/80 p-5 rounded-2xl border border-slate-800">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
              <Gamepad2 className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-100">Dedicated Rover Control Station</h1>
              <p className="text-xs text-slate-400 mt-0.5">Actuator & Motor Control Interlock • ARGUS-01</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsEStopModalOpen(true)}
            className={`px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 transition ${
              eStopped
                ? 'bg-rose-600 text-white glow-red animate-pulse'
                : 'bg-rose-600/20 hover:bg-rose-600 text-rose-400 hover:text-white border border-rose-500/40'
            }`}
          >
            <ShieldAlert className="w-4 h-4" />
            <span>EMERGENCY STOP</span>
          </button>
        </div>
      </div>

      {/* Mode Switcher Tabs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {modes.map((m) => {
          const isActive = roverMode === m.id;
          return (
            <button
              key={m.id}
              onClick={() => setRoverMode(m.id)}
              className={`p-4 rounded-xl border text-left transition flex flex-col justify-between ${
                isActive
                  ? 'bg-cyan-500/15 border-cyan-500/50 text-slate-100 glow-cyan shadow-lg shadow-cyan-950'
                  : 'bg-slate-900/60 hover:bg-slate-800/80 border-slate-800 text-slate-400'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase">{m.label}</span>
                <StatusBadge status={isActive ? 'ONLINE' : 'OFFLINE'} label={isActive ? 'ACTIVE' : 'READY'} />
              </div>
              <p className="text-[11px] text-slate-400">{m.desc}</p>
            </button>
          );
        })}
      </div>

      {/* Main Control Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Manual D-Pad Controller */}
        <DPadControl speed={driveSpeed} />

        {/* Motor Speed Dynamics & Gauges */}
        <MotorStatus speed={driveSpeed} onSpeedChange={setDriveSpeed} />

        {/* Autonomous Waypoint Navigation Runner */}
        <AutonomousPanel />
      </div>
    </div>
  );
}
