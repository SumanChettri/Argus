import React, { useState } from 'react';
import { useTelemetry } from '../context/TelemetryContext';
import { Settings, Cpu, Wifi, Camera, Shield, Save, Check } from 'lucide-react';

export default function SettingsPage() {
  const {
    sensorConfig,
    setSensorConfig,
    networkConfig,
    setNetworkConfig,
    addLog,
  } = useTelemetry();

  const [saved, setSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    addLog('System settings updated and stored in memory configuration', 'info');
    setTimeout(() => setSaved(false), 2000);
  };

  const toggleSensor = (key) => {
    setSensorConfig((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <form onSubmit={handleSave} className="space-y-6 animate-fadeIn font-mono text-xs">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/80 p-5 rounded-2xl border border-slate-800">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
              <Settings className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-100">Rover & Network Configuration</h1>
              <p className="text-xs text-slate-400 mt-0.5">ESP32 Hardware Endpoints & Sensor Interlocks</p>
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold flex items-center gap-2 transition shadow-lg shadow-cyan-950"
        >
          {saved ? <Check className="w-4 h-4 text-emerald-300" /> : <Save className="w-4 h-4" />}
          <span>{saved ? 'Settings Saved!' : 'Save Configuration'}</span>
        </button>
      </div>

      {/* Grid of Setting Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 1. Rover Identity */}
        <div className="card-hud rounded-2xl p-5 border border-slate-800 space-y-4">
          <div className="flex items-center gap-2 text-cyan-400 font-bold border-b border-slate-800 pb-2">
            <Shield className="w-4 h-4" />
            <h3 className="uppercase text-slate-200">1. Rover Identity</h3>
          </div>
          <div className="space-y-3">
            <div>
              <label className="text-slate-400 block mb-1">Rover Name:</label>
              <input
                type="text"
                defaultValue="ARGUS Mission Rover"
                className="w-full bg-slate-900 border border-slate-700 text-slate-100 rounded-lg p-2 focus:outline-none focus:border-cyan-500"
              />
            </div>
            <div>
              <label className="text-slate-400 block mb-1">Rover ID:</label>
              <input
                type="text"
                defaultValue="ARGUS-01"
                disabled
                className="w-full bg-slate-950 border border-slate-800 text-cyan-400 rounded-lg p-2 font-bold cursor-not-allowed"
              />
            </div>
          </div>
        </div>

        {/* 2. Network & API Endpoints */}
        <div className="card-hud rounded-2xl p-5 border border-slate-800 space-y-4">
          <div className="flex items-center gap-2 text-cyan-400 font-bold border-b border-slate-800 pb-2">
            <Wifi className="w-4 h-4" />
            <h3 className="uppercase text-slate-200">2. Network & WebSocket Endpoints</h3>
          </div>
          <div className="space-y-3">
            <div>
              <label className="text-slate-400 block mb-1">REST API Base URL:</label>
              <input
                type="text"
                value={networkConfig.apiBaseUrl}
                onChange={(e) => setNetworkConfig({ ...networkConfig, apiBaseUrl: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 text-slate-100 rounded-lg p-2 focus:outline-none focus:border-cyan-500"
              />
            </div>
            <div>
              <label className="text-slate-400 block mb-1">WebSocket Telemetry URL:</label>
              <input
                type="text"
                value={networkConfig.wsUrl}
                onChange={(e) => setNetworkConfig({ ...networkConfig, wsUrl: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 text-slate-100 rounded-lg p-2 focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>
        </div>

        {/* 3. Sensor Activation Toggles */}
        <div className="card-hud rounded-2xl p-5 border border-slate-800 space-y-4">
          <div className="flex items-center gap-2 text-cyan-400 font-bold border-b border-slate-800 pb-2">
            <Cpu className="w-4 h-4" />
            <h3 className="uppercase text-slate-200">3. Active Sensor Modules</h3>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {Object.entries(sensorConfig).map(([key, val]) => (
              <button
                type="button"
                key={key}
                onClick={() => toggleSensor(key)}
                className={`p-3 rounded-xl border flex items-center justify-between transition ${
                  val ? 'bg-cyan-500/15 border-cyan-500/40 text-cyan-300' : 'bg-slate-900 border-slate-800 text-slate-500'
                }`}
              >
                <span className="capitalize font-bold">{key}</span>
                <span className={`w-2 h-2 rounded-full ${val ? 'bg-cyan-400 animate-pulse' : 'bg-slate-700'}`} />
              </button>
            ))}
          </div>
        </div>

        {/* 4. Camera Stream Settings */}
        <div className="card-hud rounded-2xl p-5 border border-slate-800 space-y-4">
          <div className="flex items-center gap-2 text-cyan-400 font-bold border-b border-slate-800 pb-2">
            <Camera className="w-4 h-4" />
            <h3 className="uppercase text-slate-200">4. ESP32-CAM Stream Settings</h3>
          </div>
          <div className="space-y-3">
            <div>
              <label className="text-slate-400 block mb-1">Camera Stream URL:</label>
              <input
                type="text"
                value={networkConfig.cameraStreamUrl}
                onChange={(e) => setNetworkConfig({ ...networkConfig, cameraStreamUrl: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 text-slate-100 rounded-lg p-2 focus:outline-none focus:border-cyan-500"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-slate-400 block mb-1">Resolution:</label>
                <select className="w-full bg-slate-900 border border-slate-700 text-slate-100 rounded-lg p-2">
                  <option>1080p (Full HD)</option>
                  <option>720p (HD)</option>
                  <option>VGA (640x480)</option>
                </select>
              </div>
              <div>
                <label className="text-slate-400 block mb-1">Target FPS:</label>
                <select className="w-full bg-slate-900 border border-slate-700 text-slate-100 rounded-lg p-2">
                  <option>30 FPS</option>
                  <option>15 FPS</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
