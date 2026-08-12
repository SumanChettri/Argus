import React, { useEffect, useState } from 'react';
import { useTelemetry } from '../../context/TelemetryContext';
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Octagon } from 'lucide-react';

export default function DPadControl({ speed = 70 }) {
  const { sendDriveCommand, eStopped, telemetry } = useTelemetry();
  const [activeKey, setActiveKey] = useState(null);

  // Keyboard navigation event listeners (WASD / Arrow Keys)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.repeat || eStopped) return;
      let dir = null;
      if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') dir = 'FORWARD';
      if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') dir = 'REVERSE';
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') dir = 'LEFT';
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') dir = 'RIGHT';
      if (e.key === ' ' || e.key === 'Escape') dir = 'STOP';

      if (dir) {
        setActiveKey(dir);
        sendDriveCommand(dir, speed);
      }
    };

    const handleKeyUp = (e) => {
      if (['ArrowUp', 'w', 'W', 'ArrowDown', 's', 'S', 'ArrowLeft', 'a', 'A', 'ArrowRight', 'd', 'D'].includes(e.key)) {
        setActiveKey(null);
        sendDriveCommand('STOP', 0);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [sendDriveCommand, speed, eStopped]);

  const handleBtnPress = (direction) => {
    if (eStopped) return;
    setActiveKey(direction);
    sendDriveCommand(direction, speed);
  };

  const handleBtnRelease = () => {
    setActiveKey(null);
    sendDriveCommand('STOP', 0);
  };

  const currentState = telemetry.motors.state;

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-slate-900/80 rounded-2xl border border-slate-800 relative overflow-hidden">
      <div className="text-xs font-mono text-slate-400 mb-4 text-center">
        MANUAL D-PAD DIRECTIONAL DRIVE
        <p className="text-[10px] text-slate-500 mt-0.5">Use On-Screen Controls or Keyboard (WASD / Arrows)</p>
      </div>

      <div className="relative w-56 h-56 flex items-center justify-center">
        {/* FORWARD (UP) */}
        <button
          onMouseDown={() => handleBtnPress('FORWARD')}
          onMouseUp={handleBtnRelease}
          onTouchStart={() => handleBtnPress('FORWARD')}
          onTouchEnd={handleBtnRelease}
          disabled={eStopped}
          className={`absolute top-0 w-16 h-16 rounded-2xl border flex items-center justify-center font-bold transition-all shadow-lg ${
            currentState === 'FORWARD' || activeKey === 'FORWARD'
              ? 'bg-cyan-500 text-black border-cyan-300 scale-105 glow-cyan'
              : 'bg-slate-800/90 hover:bg-slate-700 text-slate-200 border-slate-700/80 active:scale-95'
          } ${eStopped ? 'opacity-40 cursor-not-allowed' : ''}`}
        >
          <ArrowUp className="w-7 h-7" />
        </button>

        {/* LEFT */}
        <button
          onMouseDown={() => handleBtnPress('LEFT')}
          onMouseUp={handleBtnRelease}
          onTouchStart={() => handleBtnPress('LEFT')}
          onTouchEnd={handleBtnRelease}
          disabled={eStopped}
          className={`absolute left-0 w-16 h-16 rounded-2xl border flex items-center justify-center font-bold transition-all shadow-lg ${
            currentState === 'TURNING_LEFT' || activeKey === 'LEFT'
              ? 'bg-cyan-500 text-black border-cyan-300 scale-105 glow-cyan'
              : 'bg-slate-800/90 hover:bg-slate-700 text-slate-200 border-slate-700/80 active:scale-95'
          } ${eStopped ? 'opacity-40 cursor-not-allowed' : ''}`}
        >
          <ArrowLeft className="w-7 h-7" />
        </button>

        {/* CENTER STOP BUTTON */}
        <button
          onClick={() => sendDriveCommand('STOP', 0)}
          disabled={eStopped}
          className="z-10 w-16 h-16 rounded-full bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-xs tracking-wider border-2 border-rose-400 shadow-xl shadow-rose-950 flex flex-col items-center justify-center gap-0.5 active:scale-95 transition glow-red"
        >
          <Octagon className="w-5 h-5 fill-white text-rose-600" />
          <span>STOP</span>
        </button>

        {/* RIGHT */}
        <button
          onMouseDown={() => handleBtnPress('RIGHT')}
          onMouseUp={handleBtnRelease}
          onTouchStart={() => handleBtnPress('RIGHT')}
          onTouchEnd={handleBtnRelease}
          disabled={eStopped}
          className={`absolute right-0 w-16 h-16 rounded-2xl border flex items-center justify-center font-bold transition-all shadow-lg ${
            currentState === 'TURNING_RIGHT' || activeKey === 'RIGHT'
              ? 'bg-cyan-500 text-black border-cyan-300 scale-105 glow-cyan'
              : 'bg-slate-800/90 hover:bg-slate-700 text-slate-200 border-slate-700/80 active:scale-95'
          } ${eStopped ? 'opacity-40 cursor-not-allowed' : ''}`}
        >
          <ArrowRight className="w-7 h-7" />
        </button>

        {/* REVERSE (DOWN) */}
        <button
          onMouseDown={() => handleBtnPress('REVERSE')}
          onMouseUp={handleBtnRelease}
          onTouchStart={() => handleBtnPress('REVERSE')}
          onTouchEnd={handleBtnRelease}
          disabled={eStopped}
          className={`absolute bottom-0 w-16 h-16 rounded-2xl border flex items-center justify-center font-bold transition-all shadow-lg ${
            currentState === 'REVERSE' || activeKey === 'REVERSE'
              ? 'bg-cyan-500 text-black border-cyan-300 scale-105 glow-cyan'
              : 'bg-slate-800/90 hover:bg-slate-700 text-slate-200 border-slate-700/80 active:scale-95'
          } ${eStopped ? 'opacity-40 cursor-not-allowed' : ''}`}
        >
          <ArrowDown className="w-7 h-7" />
        </button>
      </div>

      <div className="mt-5 text-center font-mono text-xs text-slate-400">
        Active Direction: <span className="font-bold text-cyan-400 uppercase">{currentState}</span>
      </div>
    </div>
  );
}
