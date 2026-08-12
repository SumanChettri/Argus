import React from 'react';
import RoverMap from '../components/map/RoverMap';
import RouteSidebar from '../components/map/RouteSidebar';
import { MapPin } from 'lucide-react';

export default function MapPage() {
  return (
    <div className="space-y-6 animate-fadeIn font-mono">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/80 p-5 rounded-2xl border border-slate-800">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
              <MapPin className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-100">Tactical Map & GPS Rover Tracking</h1>
              <p className="text-xs text-slate-400 mt-0.5">Real-time Satellite Geo-Positioning & Waypoint Route Matrix</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Map + Route Sidebar Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RoverMap height="520px" />
        </div>
        <div>
          <RouteSidebar />
        </div>
      </div>
    </div>
  );
}
