import React from 'react';
import { useTelemetry } from '../context/TelemetryContext';
import TelemetryChart from '../components/telemetry/TelemetryChart';
import ObstacleRadar from '../components/telemetry/ObstacleRadar';
import { LineChart, Zap, Cpu, Wifi, Battery } from 'lucide-react';

export default function TelemetryPage() {
  const { telemetry } = useTelemetry();

  return (
    <div className="space-y-6 animate-fadeIn font-mono">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/80 p-5 rounded-2xl border border-slate-800">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
              <LineChart className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-100">Engineering Telemetry & Diagnostics</h1>
              <p className="text-xs text-slate-400 mt-0.5">Subsystem Signals, Power, Motors & Radio RSSI • ARGUS-01</p>
            </div>
          </div>
        </div>
      </div>

      {/* Engineering Diagnostic Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Power Subsystem */}
        <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Power & Battery</span>
            <Battery className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-slate-100">{telemetry.battery.percentage}%</div>
          <div className="text-[11px] text-slate-400 space-y-0.5">
            <div>Voltage: <strong className="text-slate-200">{telemetry.battery.voltage} V</strong></div>
            <div>Draw: <strong className="text-slate-200">{telemetry.battery.currentDrawAmp} A</strong></div>
          </div>
        </div>

        {/* Drive Actuators */}
        <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Motor Actuators</span>
            <Zap className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-bold text-slate-100">{telemetry.motors.state}</div>
          <div className="text-[11px] text-slate-400 space-y-0.5">
            <div>Left Motor: <strong className="text-cyan-400">{telemetry.motors.leftSpeed}%</strong></div>
            <div>Right Motor: <strong className="text-cyan-400">{telemetry.motors.rightSpeed}%</strong></div>
          </div>
        </div>

        {/* Environmental Sensors */}
        <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Sensor Array</span>
            <Cpu className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-slate-100">{telemetry.temperature.current}°C</div>
          <div className="text-[11px] text-slate-400 space-y-0.5">
            <div>Gas PPM: <strong className="text-slate-200">{telemetry.gas.smokePpm}</strong></div>
            <div>Humidity: <strong className="text-slate-200">{telemetry.humidity}%</strong></div>
          </div>
        </div>

        {/* Radio Link */}
        <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Communication Link</span>
            <Wifi className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-slate-100">{telemetry.connection.signalDbm} <span className="text-xs font-normal text-slate-400">dBm</span></div>
          <div className="text-[11px] text-slate-400 space-y-0.5">
            <div>Latency: <strong className="text-slate-200">{telemetry.connection.pingMs} ms</strong></div>
            <div>Packets: <strong className="text-slate-200">{telemetry.connection.packetsReceived}</strong></div>
          </div>
        </div>
      </div>

      {/* Real-time Telemetry Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TelemetryChart title="Battery Level (%)" dataKey="battery" color="#10b981" unit="%" />
        <TelemetryChart title="Wi-Fi Signal Strength (%)" dataKey="signal" color="#06b6d4" unit="%" />
      </div>

      <ObstacleRadar />
    </div>
  );
}
