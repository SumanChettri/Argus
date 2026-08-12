import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Radio,
  Gamepad2,
  Thermometer,
  Camera,
  LineChart,
  MapPin,
  FileText,
  AlertTriangle,
  Settings,
  Shield,
  Activity,
  Cpu,
} from 'lucide-react';
import { useTelemetry } from '../../context/TelemetryContext';
import StatusBadge from '../common/StatusBadge';

export default function Sidebar({ isOpen, onClose }) {
  const { isConnected, eStopped, alerts, setIsSystemHealthOpen } = useTelemetry();

  const unreadAlerts = alerts.filter(a => a.status === 'new').length;

  const navItems = [
    { path: '/overview', label: 'Overview', icon: LayoutDashboard },
    { path: '/live-mission', label: 'Live Mission', icon: Radio, badge: 'LIVE' },
    { path: '/control', label: 'Rover Control', icon: Gamepad2 },
    { path: '/environment', label: 'Environment', icon: Thermometer },
    { path: '/camera', label: 'Camera', icon: Camera },
    { path: '/telemetry', label: 'Telemetry', icon: LineChart },
    { path: '/map', label: 'Map', icon: MapPin },
    { path: '/logs', label: 'Mission Logs', icon: FileText },
    { path: '/alerts', label: 'Alerts', icon: AlertTriangle, count: unreadAlerts },
    { path: '/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm md:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-[#0d1322] border-r border-slate-800/80 flex flex-col justify-between transition-transform duration-300 ease-in-out md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div>
          <div className="p-5 border-b border-slate-800/80 flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 glow-cyan">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-lg font-black tracking-wider text-slate-100 uppercase font-mono">
                ARGUS
              </h1>
              <p className="text-[11px] text-cyan-400 font-semibold tracking-wider uppercase">
                Mission Control
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-220px)]">
            {navItems.map(item => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all duration-200 ${
                      isActive
                        ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 font-semibold shadow-sm shadow-cyan-950'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent'
                    }`
                  }
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-rose-500 text-white animate-pulse">
                      {item.badge}
                    </span>
                  )}
                  {item.count > 0 && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500 text-black">
                      {item.count}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Bottom Sidebar Status */}
        <div className="p-4 border-t border-slate-800/80 bg-slate-900/60 space-y-3">
          <button
            onClick={() => setIsSystemHealthOpen(true)}
            className="w-full p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/60 text-xs font-semibold flex items-center justify-between transition"
          >
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-cyan-400" />
              <span>System Health</span>
            </div>
            <Activity className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
          </button>

          <div className="flex items-center justify-between text-xs pt-1">
            <span className="text-slate-400 font-mono">Rover ID:</span>
            <span className="font-bold font-mono text-cyan-400">ARGUS-01</span>
          </div>

          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400">Status:</span>
            <StatusBadge
              status={eStopped ? 'E-STOPPED' : isConnected ? 'ONLINE' : 'OFFLINE'}
            />
          </div>
        </div>
      </aside>
    </>
  );
}
