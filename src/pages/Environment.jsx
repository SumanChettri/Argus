import React from 'react';
import { useTelemetry } from '../context/TelemetryContext';
import TelemetryChart from '../components/telemetry/TelemetryChart';
import StatusBadge from '../components/common/StatusBadge';
import { Thermometer, Flame, Droplets } from 'lucide-react';

export default function Environment() {
  const { telemetry } = useTelemetry();
  const { temperature, humidity, gas } = telemetry;

  const gases = [
    { name: 'Smoke Index', ppm: gas.smokePpm, threshold: 200, unit: 'PPM' },
    { name: 'LPG Gas', ppm: gas.lpgPpm, threshold: 150, unit: 'PPM' },
    { name: 'Carbon Monoxide (CO)', ppm: gas.coPpm, threshold: 50, unit: 'PPM' },
    { name: 'Methane (CH4)', ppm: gas.methanePpm, threshold: 100, unit: 'PPM' },
  ];

  return (
    <div className="space-y-6 animate-fadeIn font-mono">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/80 p-5 rounded-2xl border border-slate-800">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/30">
              <Thermometer className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-100">Environmental & Hazard Sensor Suite</h1>
              <p className="text-xs text-slate-400 mt-0.5">Disaster Response Air & Thermal Scanner • ARGUS-01</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <StatusBadge status={gas.status} label={`HAZARD LEVEL: ${gas.status}`} />
        </div>
      </div>

      {/* Primary Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Temperature Card */}
        <div className="card-hud rounded-2xl p-5 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 uppercase">Ambient Temperature</span>
            <Thermometer className="w-5 h-5 text-amber-400" />
          </div>
          <div className="text-4xl font-black text-slate-100">{temperature.current}°C</div>
          <div className="flex justify-between text-xs text-slate-400 border-t border-slate-800 pt-2">
            <span>Min: {temperature.min}°C</span>
            <span>Max: {temperature.max}°C</span>
          </div>
        </div>

        {/* Humidity Card */}
        <div className="card-hud rounded-2xl p-5 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 uppercase">Relative Humidity</span>
            <Droplets className="w-5 h-5 text-cyan-400" />
          </div>
          <div className="text-4xl font-black text-slate-100">{humidity}%</div>
          <div className="text-xs text-slate-400 border-t border-slate-800 pt-2">
            Sensor Status: <strong className="text-emerald-400">Normal</strong>
          </div>
        </div>

        {/* Total Gas Hazard Level */}
        <div className="card-hud rounded-2xl p-5 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 uppercase">Overall Gas Hazard</span>
            <Flame className="w-5 h-5 text-rose-400" />
          </div>
          <div className="text-4xl font-black text-slate-100">{gas.smokePpm} <span className="text-sm font-semibold text-slate-400">PPM</span></div>
          <div className="text-xs text-slate-400 border-t border-slate-800 pt-2">
            Risk Assessment: <strong className={gas.status === 'CRITICAL' ? 'text-rose-400' : 'text-emerald-400'}>{gas.status}</strong>
          </div>
        </div>
      </div>

      {/* Gas Breakdown Grid */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Multi-Gas Breakdown Sensors</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {gases.map((g) => (
            <div key={g.name} className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>{g.name}</span>
                <Flame className="w-4 h-4 text-amber-400" />
              </div>
              <div className="text-2xl font-bold text-slate-100">{g.ppm} <span className="text-xs font-normal text-slate-400">{g.unit}</span></div>
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all ${
                    g.ppm > g.threshold ? 'bg-rose-500' : 'bg-emerald-500'
                  }`}
                  style={{ width: `${Math.min(100, (g.ppm / (g.threshold * 2)) * 100)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Telemetry Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TelemetryChart title="Gas Hazard Concentration History (PPM)" dataKey="gas" color="#ef4444" unit=" PPM" />
        <TelemetryChart title="Ambient Temperature History (°C)" dataKey="temperature" color="#f59e0b" unit="°C" />
      </div>
    </div>
  );
}
