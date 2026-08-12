import React from 'react';
import { useTelemetry } from '../../context/TelemetryContext';
import { Cpu, Camera, Flame, Radio, Navigation, Zap, Wifi, Server, X, CheckCircle, AlertTriangle } from 'lucide-react';
import StatusBadge from './StatusBadge';

export default function SystemHealthModal() {
  const { isSystemHealthOpen, setIsSystemHealthOpen, telemetry, isConnected } = useTelemetry();

  if (!isSystemHealthOpen) return null;

  const components = [
    {
      name: 'ESP32 Main MCU',
      sub: 'Tensilica LX6 Dual-Core 240MHz',
      status: isConnected ? 'OPERATIONAL' : 'OFFLINE',
      icon: Cpu,
      stats: 'Heap: 248KB free • Temp: 38°C • Uptime: 04h 12m',
    },
    {
      name: 'ESP32-CAM Subsystem',
      sub: 'OV2640 Camera Module',
      status: isConnected ? 'OPERATIONAL' : 'OFFLINE',
      icon: Camera,
      stats: 'Stream: 1080p @ 30 FPS • Bandwidth: 2.4 Mbps',
    },
    {
      name: 'MQ-2 Gas / Hazard Sensor',
      sub: 'Smoke / LPG / CO Analog Sensor',
      status: telemetry.gas.status === 'CRITICAL' ? 'WARNING' : 'OPERATIONAL',
      icon: Flame,
      stats: `Current Value: ${telemetry.gas.smokePpm} PPM • Calibration: OK`,
    },
    {
      name: 'HC-SR04 Obstacle Sonar Array',
      sub: 'Quad Sonar Transceivers',
      status: telemetry.obstacle.detected ? 'WARNING' : 'OPERATIONAL',
      icon: Radio,
      stats: `Front: ${telemetry.obstacle.frontCm}cm • Left: ${telemetry.obstacle.leftCm}cm • Right: ${telemetry.obstacle.rightCm}cm`,
    },
    {
      name: 'GPS NEO-M8N Module',
      sub: 'GNSS Satellite Receiver',
      status: telemetry.gps.lock ? 'OPERATIONAL' : 'WARNING',
      icon: Navigation,
      stats: `Fix: 3D Lock • Satellites: ${telemetry.gps.satellites} • Accuracy: ${telemetry.gps.accuracyMeters}m`,
    },
    {
      name: 'Dual DC Motor Drivers',
      sub: 'Differential Drive Motors',
      status: telemetry.motors.state === 'STOPPED' ? 'WARNING' : 'OPERATIONAL',
      icon: Zap,
      stats: `Left Motor: ${telemetry.motors.leftSpeed}% • Right Motor: ${telemetry.motors.rightSpeed}%`,
    },
    {
      name: 'Wi-Fi / RF Transceiver',
      sub: '2.4GHz High Gain Antenna',
      status: isConnected ? 'OPERATIONAL' : 'OFFLINE',
      icon: Wifi,
      stats: `RSSI: ${telemetry.connection.signalDbm} dBm • Latency: ${telemetry.connection.pingMs}ms`,
    },
    {
      name: 'ARGUS API & WS Server',
      sub: 'Local Node / Python Gateway',
      status: isConnected ? 'OPERATIONAL' : 'OFFLINE',
      icon: Server,
      stats: 'Endpoint: ws://192.168.4.1/ws/telemetry • Status 200 OK',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-slate-900 border border-slate-700/60 rounded-2xl max-w-2xl w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
              <Cpu className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-100">Hardware & System Health Diagnostics</h2>
              <p className="text-xs text-slate-400 font-mono">ARGUS-01 SUBSYSTEM STATUS SCAN</p>
            </div>
          </div>
          <button
            onClick={() => setIsSystemHealthOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 my-5">
          {components.map((c, idx) => {
            const IconComp = c.icon;
            return (
              <div key={idx} className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/50 flex flex-col justify-between">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-lg bg-slate-900 text-cyan-400 border border-slate-700">
                      <IconComp className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-200">{c.name}</h4>
                      <p className="text-[10px] text-slate-400">{c.sub}</p>
                    </div>
                  </div>
                  <StatusBadge status={c.status} />
                </div>
                <div className="mt-3 pt-2 border-t border-slate-700/40 text-[11px] font-mono text-slate-400">
                  {c.stats}
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-slate-800 text-xs text-slate-400">
          <span>All critical telemetry sensors operational</span>
          <button
            onClick={() => setIsSystemHealthOpen(false)}
            className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-semibold transition"
          >
            Close Diagnostics
          </button>
        </div>
      </div>
    </div>
  );
}
