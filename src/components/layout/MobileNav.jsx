import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Radio, Gamepad2, MapPin, AlertTriangle } from 'lucide-react';
import { useTelemetry } from '../../context/TelemetryContext';

export default function MobileNav() {
  const { alerts } = useTelemetry();
  const unreadAlerts = alerts.filter(a => a.status === 'new').length;

  const items = [
    { path: '/overview', label: 'Overview', icon: LayoutDashboard },
    { path: '/live-mission', label: 'Live', icon: Radio },
    { path: '/control', label: 'Control', icon: Gamepad2 },
    { path: '/map', label: 'Map', icon: MapPin },
    { path: '/alerts', label: 'Alerts', icon: AlertTriangle, count: unreadAlerts },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 bg-[#0d1322]/95 backdrop-blur-md border-t border-slate-800 md:hidden flex items-center justify-around py-2 px-1">
      {items.map(item => {
        const Icon = item.icon;
        return (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 py-1 px-3 rounded-xl text-[10px] font-semibold transition ${
                isActive
                  ? 'text-cyan-400 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`
            }
          >
            <div className="relative">
              <Icon className="w-5 h-5" />
              {item.count > 0 && (
                <span className="absolute -top-1 -right-2 bg-amber-500 text-black text-[9px] font-extrabold rounded-full px-1">
                  {item.count}
                </span>
              )}
            </div>
            <span>{item.label}</span>
          </NavLink>
        );
      })}
    </nav>
  );
}
