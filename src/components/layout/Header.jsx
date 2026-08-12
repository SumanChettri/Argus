import React, { useState, useEffect } from 'react';
import { useTelemetry } from '../../context/TelemetryContext';
import {
  ShieldAlert,
  Battery,
  Wifi,
  Bell,
  Clock,
  Menu,
  Zap,
  Radio,
  AlertTriangle,
  Play,
  Pause,
} from 'lucide-react';
import NotificationPanel from '../common/NotificationPanel';
import StatusBadge from '../common/StatusBadge';

export default function Header({ onToggleMobileMenu }) {
  const {
    telemetry,
    isConnected,
    eStopped,
    setIsEStopModalOpen,
    isDemoMode,
    setIsDemoMode,
    hazardOverride,
    setHazardOverride,
    alerts,
    currentMission,
  } = useTelemetry();

  const [timeStr, setTimeStr] = useState('');
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(
        now.toLocaleTimeString('en-US', {
          hour12: false,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        }) + ' UTC'
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const unreadAlerts = alerts.filter(a => a.status === 'new').length;
  const batteryPct = telemetry.battery.percentage;

  const getBatteryColor = () => {
    if (batteryPct <= 20) return 'text-rose-400 fill-rose-500';
    if (batteryPct <= 45) return 'text-amber-400 fill-amber-500';
    return 'text-emerald-400 fill-emerald-500';
  };

  return (
    <header className="sticky top-0 z-30 bg-[#0d1322]/90 backdrop-blur-md border-b border-slate-800/80 px-4 py-3 flex items-center justify-between gap-4">
      {/* Left: Mobile Menu + Mission info */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleMobileMenu}
          className="p-2 rounded-xl bg-slate-800 text-slate-300 md:hidden hover:text-white transition"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-100 font-mono tracking-wide">
              {currentMission.name}
            </span>
            <StatusBadge
              status={eStopped ? 'E-STOPPED' : isConnected ? 'ONLINE' : 'OFFLINE'}
            />
          </div>
          <p className="text-[10px] text-slate-400 font-mono hidden sm:block">
            Mode: <span className="text-cyan-400 font-semibold">{telemetry.motors.mode}</span> • Sensor Grid Active
          </p>
        </div>
      </div>

      {/* Center: Presentation Demo Mode Simulator Controls */}
      <div className="hidden lg:flex items-center gap-2 bg-slate-900/80 p-1.5 rounded-xl border border-slate-800 text-xs">
        <button
          onClick={() => setIsDemoMode(!isDemoMode)}
          className={`px-2.5 py-1 rounded-lg font-mono text-[11px] font-bold flex items-center gap-1.5 transition ${
            isDemoMode
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
              : 'bg-slate-800 text-slate-400'
          }`}
        >
          {isDemoMode ? <Play className="w-3 h-3 text-cyan-400 fill-cyan-400" /> : <Pause className="w-3 h-3" />}
          {isDemoMode ? 'DEMO ENGINE ACTIVE' : 'LIVE API MODE'}
        </button>

        {isDemoMode && (
          <div className="flex items-center gap-1 pl-2 border-l border-slate-800">
            <span className="text-[10px] text-slate-500 font-mono">SIM HAZARD:</span>
            <button
              onClick={() => setHazardOverride('normal')}
              className={`px-2 py-0.5 rounded text-[10px] font-bold transition ${
                hazardOverride === 'normal'
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              SAFE
            </button>
            <button
              onClick={() => setHazardOverride('warning')}
              className={`px-2 py-0.5 rounded text-[10px] font-bold transition ${
                hazardOverride === 'warning'
                  ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              WARN
            </button>
            <button
              onClick={() => setHazardOverride('critical')}
              className={`px-2 py-0.5 rounded text-[10px] font-bold transition ${
                hazardOverride === 'critical'
                  ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              CRIT
            </button>
          </div>
        )}
      </div>

      {/* Right: Telemetry, Battery, E-STOP & Notifications */}
      <div className="flex items-center gap-3">
        {/* Clock */}
        <div className="hidden sm:flex items-center gap-1.5 text-xs font-mono text-slate-400 bg-slate-900/60 px-2.5 py-1.5 rounded-lg border border-slate-800">
          <Clock className="w-3.5 h-3.5 text-cyan-400" />
          <span>{timeStr}</span>
        </div>

        {/* Battery Gauge */}
        <div className="flex items-center gap-2 bg-slate-900/60 px-2.5 py-1.5 rounded-lg border border-slate-800">
          <Battery className={`w-4 h-4 ${getBatteryColor()}`} />
          <div className="text-right">
            <div className="text-xs font-bold font-mono text-slate-100">{batteryPct}%</div>
            <div className="text-[9px] text-slate-400 font-mono">{telemetry.battery.voltage}V</div>
          </div>
        </div>

        {/* Emergency Stop Button */}
        <button
          onClick={() => setIsEStopModalOpen(true)}
          className={`px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-md ${
            eStopped
              ? 'bg-rose-600 text-white animate-pulse glow-red'
              : 'bg-rose-600/20 hover:bg-rose-600 text-rose-400 hover:text-white border border-rose-600/40'
          }`}
        >
          <ShieldAlert className="w-4 h-4" />
          <span className="hidden sm:inline">E-STOP</span>
        </button>

        {/* Notification Bell Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsNotifOpen(!isNotifOpen)}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 relative transition"
          >
            <Bell className="w-4 h-4" />
            {unreadAlerts > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-amber-500 text-black text-[10px] font-extrabold rounded-full flex items-center justify-center">
                {unreadAlerts}
              </span>
            )}
          </button>

          <NotificationPanel
            isOpen={isNotifOpen}
            onClose={() => setIsNotifOpen(false)}
          />
        </div>
      </div>
    </header>
  );
}
