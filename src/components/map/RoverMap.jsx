import React, { useEffect, useState } from 'react';
import { useTelemetry } from '../../context/TelemetryContext';
import { Navigation, MapPin, AlertTriangle, ShieldCheck } from 'lucide-react';
import { formatCoordinates } from '../../utils/formatters';

export default function RoverMap({ height = '450px', className = '' }) {
  const { telemetry, currentMission } = useTelemetry();
  const { latitude, longitude, heading, satellites } = telemetry.gps;

  const [LeafletComponents, setLeafletComponents] = useState(null);

  useEffect(() => {
    // Dynamic import to prevent SSR/window issues with Leaflet
    Promise.all([import('react-leaflet'), import('leaflet')]).then(([RL, L]) => {
      // Fix default Leaflet marker icon paths
      delete L.Icon.Default.prototype._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      });

      setLeafletComponents({
        MapContainer: RL.MapContainer,
        TileLayer: RL.TileLayer,
        Marker: RL.Marker,
        Polyline: RL.Polyline,
        Popup: RL.Popup,
        CircleMarker: RL.CircleMarker,
        L,
      });
    });
  }, []);

  if (!LeafletComponents) {
    return (
      <div
        className={`card-hud rounded-2xl border border-slate-800 flex flex-col items-center justify-center font-mono text-xs text-slate-400 p-8 ${className}`}
        style={{ height }}
      >
        <Navigation className="w-8 h-8 text-cyan-400 animate-spin mb-2" />
        <span>INITIALIZING TACTICAL GPS MAP ENGINE...</span>
      </div>
    );
  }

  const { MapContainer, TileLayer, Marker, Polyline, Popup, CircleMarker, L } = LeafletComponents;

  // Custom ARGUS Rover Marker HTML Icon with rotated heading arrow
  const createRoverIcon = (headingDeg) => {
    return L.divIcon({
      className: 'custom-rover-marker',
      html: `
        <div style="transform: rotate(${headingDeg}deg);" class="w-10 h-10 flex items-center justify-center bg-cyan-500 text-black rounded-full border-2 border-white shadow-xl glow-cyan">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
            <polygon points="12 2 19 21 12 17 5 21 12 2"/>
          </svg>
        </div>
      `,
      iconSize: [40, 40],
      iconAnchor: [20, 20],
    });
  };

  const centerPos = [latitude, longitude];
  const polylineCoords = currentMission.waypoints.map(w => [w.lat, w.lng]);

  return (
    <div className={`relative rounded-2xl overflow-hidden border border-slate-800 shadow-2xl ${className}`} style={{ height }}>
      {/* HUD Map Header Overlay */}
      <div className="absolute top-3 left-3 z-[1000] bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-700/80 text-xs font-mono flex items-center gap-3">
        <div className="flex items-center gap-1.5 text-cyan-400 font-bold">
          <Navigation className="w-4 h-4" />
          <span>ARGUS-01 TRACKER</span>
        </div>
        <span className="text-slate-400 text-[11px]">| Sats: {satellites}</span>
      </div>

      <MapContainer
        center={centerPos}
        zoom={15}
        scrollWheelZoom={true}
        style={{ width: '100%', height: '100%' }}
      >
        {/* CartoDB Dark Matter Map Tiles */}
        <TileLayer
          attribution='&copy; <a href="https://carto.com/">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />

        {/* Route Polyline */}
        <Polyline positions={polylineCoords} color="#06b6d4" weight={3} dashArray="6, 8" />

        {/* Waypoint Markers */}
        {currentMission.waypoints.map((wp) => (
          <CircleMarker
            key={wp.id}
            center={[wp.lat, wp.lng]}
            radius={wp.status === 'current' ? 9 : 6}
            pathOptions={{
              color: wp.status === 'completed' ? '#10b981' : wp.status === 'current' ? '#06b6d4' : '#64748b',
              fillColor: wp.status === 'completed' ? '#10b981' : wp.status === 'current' ? '#06b6d4' : '#1e293b',
              fillOpacity: 0.8,
            }}
          >
            <Popup>
              <div className="p-1 font-mono text-xs">
                <strong className="text-cyan-400 block mb-1">Waypoint {wp.id}: {wp.name}</strong>
                <p className="text-[11px] text-slate-300">Status: {wp.status.toUpperCase()}</p>
                <p className="text-[10px] text-slate-400 mt-1">{formatCoordinates(wp.lat, wp.lng)}</p>
              </div>
            </Popup>
          </CircleMarker>
        ))}

        {/* Moving ARGUS Rover Position Marker */}
        <Marker position={centerPos} icon={createRoverIcon(heading)}>
          <Popup>
            <div className="p-1 font-mono text-xs">
              <strong className="text-cyan-400 block mb-1">ARGUS-01 ROVER</strong>
              <p className="text-slate-200">Current Pos: {formatCoordinates(latitude, longitude)}</p>
              <p className="text-slate-300 text-[11px] mt-1">Heading: {heading}° NE</p>
            </div>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
