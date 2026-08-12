import React from 'react';
import { Shield, Radio, ArrowRight, Activity, Zap, Cpu } from 'lucide-react';

export default function LandingScreen({ onEnter }) {
  return (
    <div className="fixed inset-0 z-50 bg-[#070b14] text-slate-100 flex flex-col justify-between p-6 sm:p-12 overflow-hidden selection:bg-cyan-500 selection:text-black">
      {/* Background Visual Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.12)_0,transparent_70%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none opacity-50" />

      {/* Header Brand */}
      <div className="relative z-10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 glow-cyan">
            <Shield className="w-6 h-6" />
          </div>
          <span className="text-xl font-black tracking-widest font-mono text-slate-100">ARGUS</span>
        </div>
        <span className="text-xs font-mono text-slate-500 border border-slate-800 px-3 py-1 rounded-full">
          v2.4.8 PROD CONTROL
        </span>
      </div>

      {/* Hero Section */}
      <div className="relative z-10 max-w-3xl mx-auto text-center space-y-6 my-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono font-bold tracking-wider uppercase glow-cyan">
          <Radio className="w-3.5 h-3.5 animate-pulse" />
          Robotics Mission Operations Portal
        </div>

        <h1 className="text-4xl sm:text-6xl font-black text-slate-100 tracking-tight font-mono uppercase">
          ARGUS
        </h1>

        <p className="text-lg sm:text-xl text-slate-300 font-medium leading-relaxed">
          Autonomous Reconnaissance & Ground Utility System
        </p>

        <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto leading-relaxed">
          Search and rescue support • Environmental telemetry monitoring • Hazardous area inspection • 2D Sonar obstacle detection • Real-time video surveillance
        </p>

        <div className="pt-4">
          <button
            onClick={onEnter}
            className="px-8 py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-extrabold text-sm uppercase tracking-wider shadow-2xl shadow-cyan-950 flex items-center gap-3 mx-auto transition-all duration-300 transform hover:scale-105 active:scale-95 glow-cyan"
          >
            <span>ENTER MISSION CONTROL</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Footer Feature Badges */}
      <div className="relative z-10 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl mx-auto w-full font-mono text-xs text-slate-400 border-t border-slate-800/80 pt-6">
        <div className="flex items-center gap-2.5 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
          <Activity className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Real-Time Sensor Telemetry</span>
        </div>
        <div className="flex items-center gap-2.5 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
          <Zap className="w-4 h-4 text-amber-400 shrink-0" />
          <span>Autonomous Waypoint Drive</span>
        </div>
        <div className="flex items-center gap-2.5 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
          <Cpu className="w-4 h-4 text-cyan-400 shrink-0" />
          <span>ESP32 & ESP32-CAM Architecture</span>
        </div>
      </div>
    </div>
  );
}
