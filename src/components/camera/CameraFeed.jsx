import React, { useState, useEffect } from 'react';
import { useTelemetry } from '../../context/TelemetryContext';
import { Camera, Radio, Maximize2, ShieldCheck, AlertTriangle, Eye } from 'lucide-react';
import { formatCoordinates } from '../../utils/formatters';

export default function CameraFeed({ className = '', source = 'ESP32-CAM (Demo Stream)' }) {
  const { telemetry } = useTelemetry();
  const [fps, setFps] = useState(30);
  const [nightVision, setNightVision] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Slight FPS jitter for realism
  useEffect(() => {
    const interval = setInterval(() => {
      setFps(28 + Math.floor(Math.random() * 5));
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className={`relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 flex flex-col justify-between group shadow-2xl ${
        nightVision ? 'hue-rotate-90 contrast-125 saturate-200' : ''
      } ${className}`}
      style={{ minHeight: '340px' }}
    >
      {/* Background Visual Stream Generator (Realistic Surveillance Grid) */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900/60 via-slate-950/90 to-slate-900/90 z-0">
        {/* Animated Scanlines */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%)] bg-[length:100%_4px] opacity-40 pointer-events-none" />

        {/* Center Target Reticle Crosshair */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-40">
          <div className="w-32 h-32 border border-cyan-500/40 rounded-full flex items-center justify-center">
            <div className="w-16 h-16 border border-cyan-400/60 rounded-full flex items-center justify-center">
              <div className="w-2 h-2 bg-cyan-400 rounded-full animate-ping" />
            </div>
          </div>
          <div className="absolute w-48 h-0.5 bg-cyan-500/20" />
          <div className="absolute h-48 w-0.5 bg-cyan-500/20" />
        </div>

        {/* Simulated Object Detection Bounding Box */}
        <div className="absolute top-[28%] left-[40%] w-32 h-28 border-2 border-amber-400/80 rounded p-1 font-mono text-[9px] text-amber-300 pointer-events-none animate-pulse">
          <span className="bg-amber-500/20 px-1 py-0.5 rounded">SURVIVOR / OBSTACLE [88%]</span>
        </div>
      </div>

      {/* TOP OVERLAY HUD */}
      <div className="relative z-10 p-4 flex items-start justify-between bg-gradient-to-b from-black/80 via-black/40 to-transparent">
        <div className="flex items-center gap-3 font-mono text-xs">
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-rose-600/30 text-rose-300 border border-rose-500/50 font-bold uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" /> LIVE
          </span>
          <span className="text-slate-200 font-bold">ARGUS-01</span>
          <span className="text-slate-400 text-[11px] hidden sm:inline">| {source}</span>
        </div>

        <div className="flex items-center gap-3 font-mono text-xs text-slate-300">
          <span className="bg-slate-900/80 px-2 py-1 rounded border border-slate-800 text-[11px]">
            1920x1080 • {fps} FPS
          </span>
          <button
            onClick={() => setNightVision(!nightVision)}
            className={`p-1.5 rounded-lg border transition ${
              nightVision ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500' : 'bg-slate-900/80 text-slate-400 border-slate-800'
            }`}
            title="Toggle Night Vision"
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* BOTTOM OVERLAY HUD */}
      <div className="relative z-10 p-4 bg-gradient-to-t from-black/90 via-black/50 to-transparent flex items-end justify-between font-mono text-xs">
        <div className="space-y-1">
          <div className="text-cyan-400 font-bold flex items-center gap-1.5 text-[11px]">
            <Radio className="w-3.5 h-3.5" />
            <span>GPS: {formatCoordinates(telemetry.gps.latitude, telemetry.gps.longitude, 4)}</span>
          </div>
          <div className="text-slate-300 text-[10px]">
            HEADING: <strong className="text-slate-100">{telemetry.gps.heading}° NE</strong> • SPEED:{' '}
            <strong className="text-slate-100">{telemetry.motors.leftSpeed} RPM</strong>
          </div>
        </div>

        <div className="text-right space-y-1">
          <div className="text-slate-200 font-bold text-[11px]">
            TEMP: {telemetry.temperature.current}°C • BAT: {telemetry.battery.percentage}%
          </div>
          <div className="text-[10px] flex items-center justify-end gap-1">
            <span>HAZARD LEVEL:</span>
            <span
              className={
                telemetry.gas.status === 'CRITICAL'
                  ? 'text-rose-400 font-bold'
                  : telemetry.gas.status === 'WARNING'
                  ? 'text-amber-400 font-bold'
                  : 'text-emerald-400 font-bold'
              }
            >
              {telemetry.gas.status} ({telemetry.gas.smokePpm} PPM)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
