import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { TelemetryProvider } from './context/TelemetryContext';
import Layout from './components/layout/Layout';
import LandingScreen from './components/landing/LandingScreen';

import Overview from './pages/Overview';
import LiveMission from './pages/LiveMission';
import RoverControl from './pages/RoverControl';
import Environment from './pages/Environment';
import CameraPage from './pages/CameraPage';
import TelemetryPage from './pages/TelemetryPage';
import MapPage from './pages/MapPage';
import MissionLogs from './pages/MissionLogs';
import AlertsPage from './pages/AlertsPage';
import SettingsPage from './pages/SettingsPage';

export default function App() {
  const [hasEntered, setHasEntered] = useState(false);

  if (!hasEntered) {
    return <LandingScreen onEnter={() => setHasEntered(true)} />;
  }

  return (
    <TelemetryProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Navigate to="/overview" replace />} />
            <Route path="overview" element={<Overview />} />
            <Route path="live-mission" element={<LiveMission />} />
            <Route path="control" element={<RoverControl />} />
            <Route path="environment" element={<Environment />} />
            <Route path="camera" element={<CameraPage />} />
            <Route path="telemetry" element={<TelemetryPage />} />
            <Route path="map" element={<MapPage />} />
            <Route path="logs" element={<MissionLogs />} />
            <Route path="alerts" element={<AlertsPage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="*" element={<Navigate to="/overview" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </TelemetryProvider>
  );
}
