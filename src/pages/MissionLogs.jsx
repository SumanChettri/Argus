import React, { useState } from 'react';
import MissionDetailModal from '../components/mission/MissionDetailModal';
import StatusBadge from '../components/common/StatusBadge';
import { FileText, Search, ChevronRight } from 'lucide-react';

export default function MissionLogs() {
  const [selectedMission, setSelectedMission] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const sampleMissions = [
    {
      id: 'M-2026-ALPHA',
      name: 'Search & Rescue Alpha',
      date: '2026-08-12',
      duration: '00:27:41',
      distance: '1.42',
      mode: 'AUTONOMOUS',
      result: 'COMPLETED',
      summary: 'Autonomous search scan in Sector 4 disaster zone. Located 1 survivor checkpoint node and verified gas safety levels.',
    },
    {
      id: 'M-2026-BETA',
      name: 'Hazard Survey Delta',
      date: '2026-08-11',
      duration: '00:42:15',
      distance: '2.18',
      mode: 'AUTONOMOUS',
      result: 'COMPLETED',
      summary: 'Perimeter monitoring scan for toxic gas leaks. Detected 1 elevated PPM spike at North Valve B.',
    },
    {
      id: 'M-2026-GAMMA',
      name: 'Campus Perimeter Patrol',
      date: '2026-08-10',
      duration: '01:05:00',
      distance: '3.45',
      mode: 'ASSISTED',
      result: 'COMPLETED',
      summary: 'Routine security and ultrasonic obstacle mapping around research facility perimeter.',
    },
    {
      id: 'M-2026-EPSILON',
      name: 'Environmental Scan Phase 1',
      date: '2026-08-08',
      duration: '00:18:22',
      distance: '0.85',
      mode: 'MANUAL',
      result: 'RESOLVED',
      summary: 'Manual drive thermal testing across structural rubble terrain.',
    },
  ];

  const filteredMissions = sampleMissions.filter(
    m => m.name.toLowerCase().includes(searchQuery.toLowerCase()) || m.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fadeIn font-mono">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/80 p-5 rounded-2xl border border-slate-800">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-100">Mission History & Logs Database</h1>
              <p className="text-xs text-slate-400 mt-0.5">Historical Reconnaissance Records & Telemetry Archives</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search mission name or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-slate-900 border border-slate-700 text-slate-100 text-xs rounded-xl pl-9 pr-4 py-2 focus:outline-none focus:border-cyan-500 w-64"
            />
          </div>
        </div>
      </div>

      {/* Missions Table */}
      <div className="card-hud rounded-2xl border border-slate-800 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-900/80 border-b border-slate-800 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="p-4">Mission ID</th>
                <th className="p-4">Mission Name</th>
                <th className="p-4">Date</th>
                <th className="p-4">Duration</th>
                <th className="p-4">Distance</th>
                <th className="p-4">Drive Mode</th>
                <th className="p-4">Result</th>
                <th className="p-4 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-xs text-slate-200">
              {filteredMissions.map((m) => (
                <tr
                  key={m.id}
                  onClick={() => setSelectedMission(m)}
                  className="hover:bg-slate-800/60 cursor-pointer transition"
                >
                  <td className="p-4 font-bold text-cyan-400">{m.id}</td>
                  <td className="p-4 font-bold text-slate-100">{m.name}</td>
                  <td className="p-4 text-slate-400">{m.date}</td>
                  <td className="p-4 text-slate-300">{m.duration}</td>
                  <td className="p-4 text-slate-300">{m.distance} km</td>
                  <td className="p-4 font-semibold text-slate-300">{m.mode}</td>
                  <td className="p-4">
                    <StatusBadge status={m.result} />
                  </td>
                  <td className="p-4 text-right">
                    <button className="p-1 rounded bg-slate-800 hover:bg-cyan-600 text-slate-300 hover:text-white transition">
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mission Detail Modal Popup */}
      <MissionDetailModal
        mission={selectedMission}
        onClose={() => setSelectedMission(null)}
      />
    </div>
  );
}
