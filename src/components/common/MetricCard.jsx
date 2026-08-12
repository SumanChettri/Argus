import React from 'react';

export default function MetricCard({
  title,
  value,
  unit = '',
  subtitle,
  icon: Icon,
  trend,
  status = 'default',
  children,
  className = '',
  action,
}) {
  const getBorderGlow = () => {
    switch (status) {
      case 'critical':
        return 'border-rose-500/40 hover:border-rose-500/60 shadow-rose-950/40';
      case 'warning':
        return 'border-amber-500/40 hover:border-amber-500/60 shadow-amber-950/40';
      case 'success':
        return 'border-emerald-500/40 hover:border-emerald-500/60 shadow-emerald-950/40';
      case 'accent':
      default:
        return 'border-slate-800 hover:border-cyan-500/40 shadow-cyan-950/20';
    }
  };

  return (
    <div
      className={`card-hud card-hud-hover rounded-xl p-5 border transition-all duration-300 relative overflow-hidden flex flex-col justify-between ${getBorderGlow()} ${className}`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2.5">
          {Icon && (
            <div className="p-2 rounded-lg bg-slate-800/80 text-cyan-400 border border-slate-700/50">
              <Icon className="w-5 h-5" />
            </div>
          )}
          <div>
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{title}</h3>
            {subtitle && <p className="text-[11px] text-slate-500 font-mono mt-0.5">{subtitle}</p>}
          </div>
        </div>
        {action}
      </div>

      <div className="my-1">
        {value !== undefined && (
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl lg:text-3xl font-extrabold text-slate-100 font-mono tracking-tight">{value}</span>
            {unit && <span className="text-sm font-medium text-slate-400">{unit}</span>}
          </div>
        )}
      </div>

      {trend && (
        <div className="mt-2 text-xs font-mono flex items-center gap-1 text-slate-400">
          <span>{trend}</span>
        </div>
      )}

      {children && <div className="mt-3 pt-3 border-t border-slate-800/80">{children}</div>}
    </div>
  );
}
