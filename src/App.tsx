import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AdminProvider } from './context/AdminContext';

// Authentication Pages
import { PlayerLoginPage } from './components/auth/PlayerLoginPage';
import { PlayerRegisterPage } from './components/auth/PlayerRegisterPage';
import { AdminLoginPage } from './components/auth/AdminLoginPage';

// Layouts
import { AdminLayout } from './components/layout/AdminLayout';
import { PlayerLayout } from './components/layout/PlayerLayout';

export default function App() {
  return (
    <BrowserRouter>
      <AdminProvider>
        <Routes>
          {/* Default root redirects to Player portal */}
          <Route path="/" element={<Navigate to="/player" replace />} />

          {/* Player Dedicated Routes */}
          <Route path="/player/login" element={<PlayerLoginPage />} />
          <Route path="/player/register" element={<PlayerRegisterPage />} />
          <Route path="/player/*" element={<PlayerLayout />} />

          {/* Admin Dedicated Routes */}
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route path="/admin/*" element={<AdminLayout />} />

          {/* Catch-all route */}
          <Route path="*" element={<Navigate to="/player" replace />} />
        </Routes>
      </AdminProvider>
    </BrowserRouter>
  );
}
