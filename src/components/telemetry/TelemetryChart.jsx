import React, { useState } from 'react';
import { useTelemetry } from '../../context/TelemetryContext';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { LineChart, Play, Pause, RefreshCw } from 'lucide-react';

export default function TelemetryChart({ title = 'Live Telemetry History', dataKey = 'temperature', color = '#06b6d4', unit = '°C' }) {
  const { telemetryHistory } = useTelemetry();
  const [timeRange, setTimeRange] = useState('5m');
  const [isPaused, setIsPaused] = useState(false);

  // Filter history based on time range
  const getSliceCount = () => {
    switch (timeRange) {
      case '1m': return 15;
      case '5m': return 30;
      case '15m': return 45;
      case '1h':
      default: return 60;
    }
  };

  const chartData = isPaused ? telemetryHistory : telemetryHistory.slice(-getSliceCount());

  // Compute min/max
  const values = chartData.map(d => Number(d[dataKey]) || 0);
  const minVal = values.length ? Math.min(...values).toFixed(1) : 0;
  const maxVal = values.length ? Math.max(...values).toFixed(1) : 0;
  const currVal = values.length ? values[values.length - 1] : 0;

  return (
    <div className="card-hud rounded-2xl p-5 border border-slate-800 space-y-4 font-mono">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
            <LineChart className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{title}</h3>
            <p className="text-[11px] text-slate-500">
              Current: <strong className="text-slate-100">{currVal}{unit}</strong> • Min: {minVal}{unit} • Max: {maxVal}{unit}
            </p>
          </div>
        </div>

        {/* Range & Pause Controls */}
        <div className="flex items-center gap-2 text-xs">
          <button
            onClick={() => setIsPaused(!isPaused)}
            className={`p-1.5 rounded-lg border transition ${
              isPaused ? 'bg-amber-500/20 text-amber-400 border-amber-500/40' : 'bg-slate-800 text-slate-300 border-slate-700'
            }`}
            title={isPaused ? 'Resume Chart Stream' : 'Pause Chart Stream'}
          >
            {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
          </button>

          <div className="flex items-center bg-slate-900 rounded-lg p-1 border border-slate-800 text-[11px]">
            {['1m', '5m', '15m', '1h'].map(r => (
              <button
                key={r}
                onClick={() => setTimeRange(r)}
                className={`px-2 py-0.5 rounded transition ${
                  timeRange === r ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Chart Canvas Container */}
      <div className="w-full h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id={`grad-${dataKey}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={0.4} />
                <stop offset="95%" stopColor={color} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis dataKey="time" stroke="#64748b" tick={{ fontSize: 10 }} />
            <YAxis stroke="#64748b" tick={{ fontSize: 10 }} domain={['auto', 'auto']} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#0f172a',
                borderColor: 'rgba(255,255,255,0.1)',
                borderRadius: '8px',
                color: '#f8fafc',
                fontSize: '12px',
                fontFamily: 'JetBrains Mono',
              }}
            />
            <Area
              type="monotone"
              dataKey={dataKey}
              stroke={color}
              strokeWidth={2}
              fillOpacity={1}
              fill={`url(#grad-${dataKey})`}
              isAnimationActive={!isPaused}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
