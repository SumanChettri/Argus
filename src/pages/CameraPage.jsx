import React, { useState } from 'react';
import CameraFeed from '../components/camera/CameraFeed';
import CameraControls from '../components/camera/CameraControls';
import { Camera } from 'lucide-react';

export default function CameraPage() {
  const [source, setSource] = useState('ESP32-CAM (Demo Stream)');

  return (
    <div className="space-y-6 animate-fadeIn font-mono">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/80 p-5 rounded-2xl border border-slate-800">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
              <Camera className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-100">Live Surveillance & Reconnaissance Camera</h1>
              <p className="text-xs text-slate-400 mt-0.5">ESP32-CAM High-Definition Stream Subsystem</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Camera View */}
      <CameraFeed className="h-[520px]" source={source} />

      {/* Camera Controls & Stream Selector */}
      <CameraControls source={source} onSourceChange={setSource} />
    </div>
  );
}
