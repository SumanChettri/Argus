import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import MobileNav from './MobileNav';
import EmergencyStopModal from '../common/EmergencyStopModal';
import SystemHealthModal from '../common/SystemHealthModal';

export default function Layout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col antialiased selection:bg-cyan-500 selection:text-black">
      {/* Persistent Left Sidebar */}
      <Sidebar
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />

      {/* Main Content Workspace */}
      <div className="flex-1 md:pl-64 flex flex-col min-h-screen">
        <Header onToggleMobileMenu={() => setMobileMenuOpen(!mobileMenuOpen)} />

        <main className="flex-1 p-4 md:p-6 pb-20 md:pb-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>

        <MobileNav />
      </div>

      {/* Global Modals */}
      <EmergencyStopModal />
      <SystemHealthModal />
    </div>
  );
}
