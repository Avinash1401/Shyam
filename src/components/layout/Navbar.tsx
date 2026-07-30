import React, { useState } from 'react';
import { useAdmin } from '../../context/AdminContext';
import {
  Menu,
  Search,
  Bell,
  User,
  LogOut,
  Settings,
  Shield,
  ChevronDown,
  Coins,
  Radio,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    toggleSidebar,
    searchTerm,
    setSearchTerm,
    setCurrentPage,
    addToast,
    superDistributers,
    distributers,
    retailers,
    users,
  } = useAdmin();

  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  // Total system circulating points calculation
  const totalCirculatingPoints =
    superDistributers.reduce((acc, u) => acc + u.points, 0) +
    distributers.reduce((acc, u) => acc + u.points, 0) +
    retailers.reduce((acc, u) => acc + u.points, 0) +
    users.reduce((acc, u) => acc + u.points, 0);

  const handleLogout = () => {
    addToast('Logged Out', 'You have been logged out of Shyam Panel.', 'info');
    setProfileDropdownOpen(false);
  };

  return (
    <header className="sticky top-0 z-30 h-16 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-4 lg:px-6 flex items-center justify-between gap-4">
      {/* Left section: Sidebar Toggler & Global Search */}
      <div className="flex items-center gap-3 flex-1 max-w-md">
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors focus:outline-none"
          title="Toggle Navigation Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="relative w-full">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search accounts, tickets, games..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-950/80 border border-slate-800 focus:border-cyan-500 text-slate-200 text-xs rounded-xl pl-9 pr-4 py-2 focus:outline-none focus:ring-1 focus:ring-cyan-500/50 transition-all placeholder:text-slate-500"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 text-xs"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Right section: System status, points summary, notifications, profile */}
      <div className="flex items-center gap-3">
        {/* Circulating System Points Badge */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs">
          <Coins className="w-4 h-4 text-amber-400" />
          <div>
            <span className="text-[10px] text-slate-500 block uppercase font-semibold leading-none">
              Pool Circulation
            </span>
            <span className="text-amber-300 font-bold leading-none">
              ₹{totalCirculatingPoints.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Live System Online Tag */}
        <div className="hidden md:flex items-center gap-2 px-2.5 py-1 rounded-full bg-cyan-950/60 border border-cyan-800/60 text-[11px] text-cyan-300 font-medium">
          <Radio className="w-3 h-3 text-cyan-400 animate-pulse" />
          <span>Server Active</span>
        </div>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setNotificationsOpen(!notificationsOpen);
              setProfileDropdownOpen(false);
            }}
            className="relative p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-cyan-400 ring-2 ring-slate-900 animate-ping" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-cyan-400 ring-2 ring-slate-900" />
          </button>

          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-4 z-50 text-slate-300 animate-slide-in">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
                <h4 className="text-xs font-bold uppercase text-white tracking-wider">
                  Admin Notifications
                </h4>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800">
                  3 New
                </span>
              </div>
              <div className="space-y-3 text-xs">
                <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
                  <div className="flex items-center justify-between text-slate-200 font-medium">
                    <span>Draw Result Declared</span>
                    <span className="text-[10px] text-slate-500">2m ago</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    2D Lottery Draw DRW-2D-9842 result declared as [89].
                  </p>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
                  <div className="flex items-center justify-between text-slate-200 font-medium">
                    <span>Point Request</span>
                    <span className="text-[10px] text-slate-500">15m ago</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    SuperDistributer "super_royal" added 100,000 points.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Profile Avatar Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setProfileDropdownOpen(!profileDropdownOpen);
              setNotificationsOpen(false);
            }}
            className="flex items-center gap-3 p-1.5 rounded-xl hover:bg-slate-800/80 transition-colors text-left"
          >
            <div className="relative">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold text-sm shadow-md shadow-cyan-500/20">
                SA
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-slate-900" />
            </div>

            <div className="hidden sm:block">
              <p className="text-xs font-bold text-white leading-tight">superadmin</p>
              <p className="text-[10px] text-cyan-400 font-medium leading-tight">
                Master Admin
              </p>
            </div>

            <ChevronDown className="w-4 h-4 text-slate-400 hidden sm:block" />
          </button>

          {profileDropdownOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden z-50 animate-slide-in">
              <div className="p-4 bg-gradient-to-b from-cyan-950/40 to-slate-900 border-b border-slate-800 text-center">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 mx-auto flex items-center justify-center text-white font-bold text-lg mb-2 shadow-lg shadow-cyan-500/20">
                  SA
                </div>
                <h4 className="text-sm font-bold text-white">superadmin</h4>
                <p className="text-xs text-slate-400">admin@gmail.com</p>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800 text-[10px] mt-2 font-semibold">
                  <Shield className="w-3 h-3" />
                  <span>Full Control Granted</span>
                </div>
              </div>

              <div className="p-2 space-y-1">
                <button
                  onClick={() => {
                    setCurrentPage('profile');
                    setProfileDropdownOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  <Settings className="w-4 h-4 text-cyan-400" />
                  <span>Edit Profile & Security</span>
                </button>

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium text-rose-400 hover:bg-rose-950/40 hover:text-rose-300 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Log Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
