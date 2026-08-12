import React from 'react';
import { useTelemetry } from '../context/TelemetryContext';
import RoverStatusCard from '../components/dashboard/RoverStatusCard';
import BatteryCard from '../components/dashboard/BatteryCard';
import TemperatureCard from '../components/dashboard/TemperatureCard';
import HazardCard from '../components/dashboard/HazardCard';
import GPSCard from '../components/dashboard/GPSCard';
import CommCard from '../components/dashboard/CommCard';
import CameraFeed from '../components/camera/CameraFeed';
import RoverMap from '../components/map/RoverMap';
import EventTimeline from '../components/mission/EventTimeline';
import ObstacleRadar from '../components/telemetry/ObstacleRadar';
import { Radio, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Overview() {
  const { currentMission, telemetry, alerts } = useTelemetry();
  const navigate = useNavigate();

  const criticalAlerts = alerts.filter(a => a.severity === 'critical' || a.severity === 'warning');

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Overview Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/60 p-5 rounded-2xl border border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-100 font-mono">ARGUS Mission Control</h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
              OPERATIONAL
            </span>
          </div>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Autonomous Reconnaissance & Ground Utility System • {currentMission.name}
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono">
          <button
            onClick={() => navigate('/live-mission')}
            className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold flex items-center gap-2 shadow-lg shadow-cyan-950 transition"
          >
            <Radio className="w-4 h-4 animate-pulse" />
            Open Command Center View
          </button>
        </div>
      </div>

      {/* Critical Alert Warning Banner if escalated */}
      {criticalAlerts.length > 0 && (
        <div
          onClick={() => navigate('/alerts')}
          className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono flex items-center justify-between cursor-pointer hover:bg-amber-500/20 transition"
        >
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              <strong>ATTENTION:</strong> {criticalAlerts[0].message}
            </span>
          </div>
          <span className="underline text-[11px]">View All Alerts &rarr;</span>
        </div>
      )}

      {/* Primary 6 Status Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <RoverStatusCard />
        <BatteryCard />
        <TemperatureCard />
        <HazardCard />
        <GPSCard />
        <CommCard />
      </div>

      {/* Secondary Quick Previews Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Live Camera Feed Preview */}
        <div className="space-y-3">
          <div className="flex items-center justify-between font-mono text-xs">
            <span className="font-bold text-slate-200">LIVE SURVEILLANCE FEED</span>
            <button
              onClick={() => navigate('/camera')}
              className="text-cyan-400 hover:underline text-[11px]"
            >
              Expand Camera &rarr;
            </button>
          </div>
          <CameraFeed className="h-[320px]" />
        </div>

        {/* Tactical Map Preview */}
        <div className="space-y-3">
          <div className="flex items-center justify-between font-mono text-xs">
            <span className="font-bold text-slate-200">TACTICAL GPS TRACKER</span>
            <button
              onClick={() => navigate('/map')}
              className="text-cyan-400 hover:underline text-[11px]"
            >
              Full Interactive Map &rarr;
            </button>
          </div>
          <RoverMap height="320px" />
        </div>
      </div>

      {/* Sonar Radar & Event Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ObstacleRadar />
        <EventTimeline />
      </div>
    </div>
  );
}
