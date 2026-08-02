import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AdminProvider, useAdmin } from './context/AdminContext';

// Opening / Home Page
import { OpeningHomePage } from './components/views/OpeningHomePage';

// Authentication Pages
import { PlayerLoginPage } from './components/auth/PlayerLoginPage';
import { PlayerRegisterPage } from './components/auth/PlayerRegisterPage';
import { AdminLoginPage } from './components/auth/AdminLoginPage';

// Layouts
import { AdminLayout } from './components/layout/AdminLayout';
import { PlayerLayout } from './components/layout/PlayerLayout';

function HomeOrRedirect() {
  const { isAuthLoading } = useAdmin();

  if (isAuthLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
        <div className="w-10 h-10 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Always show the Opening Home Page for visitors at /
  return <OpeningHomePage />;
}

export default function App() {
  useEffect(() => {
    document.title = 'SHYAM111 GAME';
  }, []);

  return (
    <BrowserRouter>
      <AdminProvider>
        <Routes>
          {/* Main Opening Home Page */}
          <Route path="/" element={<HomeOrRedirect />} />
          <Route path="/home" element={<OpeningHomePage />} />

          {/* Player Dedicated Routes */}
          <Route path="/player/login" element={<PlayerLoginPage />} />
          <Route path="/player/register" element={<PlayerRegisterPage />} />
          <Route path="/player/dashboard" element={<PlayerLayout />} />
          <Route path="/player/*" element={<PlayerLayout />} />

          {/* Admin Dedicated Routes */}
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route path="/admin/dashboard" element={<AdminLayout />} />
          <Route path="/admin/*" element={<AdminLayout />} />

          {/* Catch-all route */}
          <Route path="*" element={<HomeOrRedirect />} />
        </Routes>
      </AdminProvider>
    </BrowserRouter>
  );
}

