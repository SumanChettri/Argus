import React from 'react';

export default function StatusBadge({ status, label, className = '' }) {
  const getStyles = () => {
    switch (status?.toUpperCase()) {
      case 'ONLINE':
      case 'CONNECTED':
      case 'SAFE':
      case 'OPERATIONAL':
      case 'RESOLVED':
      case 'COMPLETED':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 glow-emerald';
      case 'WARNING':
      case 'CAUTION':
      case 'ASSISTED':
      case 'ATTENTION':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30 glow-amber';
      case 'CRITICAL':
      case 'E-STOPPED':
      case 'STOPPED':
      case 'FAILURE':
      case 'OFFLINE':
      case 'DISCONNECTED':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/30 glow-red';
      case 'AUTONOMOUS':
      case 'MANUAL':
      case 'INFO':
      default:
        return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30 glow-cyan';
    }
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider border transition-all ${getStyles()} ${className}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
      {label || status}
    </span>
  );
}
