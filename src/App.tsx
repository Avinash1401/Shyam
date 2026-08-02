import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AdminProvider, useAdmin } from './context/AdminContext';

// Authentication Pages
import { PlayerLoginPage } from './components/auth/PlayerLoginPage';
import { PlayerRegisterPage } from './components/auth/PlayerRegisterPage';
import { AdminLoginPage } from './components/auth/AdminLoginPage';

// Layouts
import { AdminLayout } from './components/layout/AdminLayout';
import { PlayerLayout } from './components/layout/PlayerLayout';

function RoleBasedRootRedirect() {
  const { isLoggedIn, userRole, isAuthLoading } = useAdmin();

  if (isAuthLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
        <div className="w-10 h-10 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (isLoggedIn) {
    if (userRole === 'admin') {
      return <Navigate to="/admin/dashboard" replace />;
    }
    return <Navigate to="/player/dashboard" replace />;
  }

  // Default redirect for unauthenticated visitors
  return <Navigate to="/player/login" replace />;
}

export default function App() {
  useEffect(() => {
    document.title = 'Shyam111';
  }, []);

  return (
    <BrowserRouter>
      <AdminProvider>
        <Routes>
          {/* Default root redirects based on role */}
          <Route path="/" element={<RoleBasedRootRedirect />} />

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
          <Route path="*" element={<RoleBasedRootRedirect />} />
        </Routes>
      </AdminProvider>
    </BrowserRouter>
  );
}
