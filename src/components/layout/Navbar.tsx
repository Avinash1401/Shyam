import React, { useState } from 'react';
import { useAdmin } from '../../context/AdminContext';
import {
  Menu,
  Search,
  Bell,
  LogOut,
  Settings,
  Shield,
  ChevronDown,
  Coins,
  Radio,
  CheckCheck,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  Info,
  Crown,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    toggleSidebar,
    searchTerm,
    setSearchTerm,
    setCurrentPage,
    addToast,
    notifications,
    unreadNotificationCount,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    clearNotificationHistory,
    superDistributers,
    distributers,
    retailers,
    users,
    logout,
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
    logout();
    addToast('Logged Out', 'You have been logged out of Shyam111 Admin Panel.', 'info');
    setProfileDropdownOpen(false);
  };

  return (
    <header className="sticky top-0 z-30 h-16 bg-[#111827]/90 backdrop-blur-md border-b border-slate-800/80 px-4 lg:px-6 flex items-center justify-between gap-4">
      {/* Left section: Sidebar Toggler & Global Search & Shyam111 Logo (Mobile) */}
      <div className="flex items-center gap-3 flex-1 max-w-md">
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors focus:outline-none"
          title="Toggle Navigation Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Small Brand Title for mobile screens */}
        <div className="flex items-center gap-2 lg:hidden">
          <Crown className="w-5 h-5 text-amber-400" />
          <span className="text-base font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-amber-300">
            Shyam111
          </span>
        </div>

        <div className="relative w-full hidden sm:block">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search accounts, tickets, games..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#0F172A] border border-slate-800 focus:border-emerald-500 text-slate-200 text-xs rounded-xl pl-9 pr-4 py-2 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 transition-all placeholder:text-slate-500"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 text-xs font-bold"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Right section: System status, points summary, notifications, profile */}
      <div className="flex items-center gap-3">
        {/* Circulating System Points Badge */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#0F172A] border border-slate-800 text-xs">
          <Coins className="w-4 h-4 text-amber-400" />
          <div>
            <span className="text-[10px] text-slate-400 block uppercase font-bold leading-none">
              Circulating Pool
            </span>
            <span className="text-amber-300 font-extrabold leading-none">
              ₹{totalCirculatingPoints.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Live System Online Tag */}
        <div className="hidden md:flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-950/60 border border-emerald-800/60 text-[11px] text-emerald-300 font-medium">
          <Radio className="w-3 h-3 text-emerald-400 animate-pulse" />
          <span>Shyam111 Online</span>
        </div>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setNotificationsOpen(!notificationsOpen);
              setProfileDropdownOpen(false);
            }}
            className="relative p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Notifications Center"
          >
            <Bell className="w-5 h-5" />
            {unreadNotificationCount > 0 && (
              <>
                <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-amber-400 ring-2 ring-[#0F172A] animate-ping" />
                <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-amber-400 ring-2 ring-[#0F172A]" />
              </>
            )}
          </button>

          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-[#0F172A] border border-slate-800 rounded-2xl shadow-2xl p-4 z-50 text-slate-300 animate-slide-in max-h-[85vh] flex flex-col">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3 shrink-0">
                <div className="flex items-center gap-2">
                  <h4 className="text-xs font-bold uppercase text-white tracking-wider">
                    Notifications
                  </h4>
                  {unreadNotificationCount > 0 ? (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 font-bold">
                      {unreadNotificationCount} New
                    </span>
                  ) : (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-950 text-slate-500 border border-slate-800">
                      All Read
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1.5">
                  {unreadNotificationCount > 0 && (
                    <button
                      onClick={markAllNotificationsAsRead}
                      className="text-[11px] text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-emerald-950/60 border border-emerald-800/50 transition-all"
                      title="Mark all notifications as read"
                    >
                      <CheckCheck className="w-3.5 h-3.5" />
                      <span>Mark All Read</span>
                    </button>
                  )}

                  {notifications.length > 0 && (
                    <button
                      onClick={clearNotificationHistory}
                      className="text-slate-500 hover:text-rose-400 p-1 rounded-lg hover:bg-slate-800 transition-colors"
                      title="Clear History"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Notification List */}
              <div className="space-y-2 overflow-y-auto custom-scrollbar max-h-80 pr-1 text-xs">
                {notifications.length === 0 ? (
                  <div className="text-center py-8 text-slate-500 space-y-1">
                    <Bell className="w-8 h-8 mx-auto text-slate-700 mb-2 stroke-1" />
                    <p className="font-medium text-xs text-slate-400">No Notifications</p>
                    <p className="text-[10px]">You are all caught up!</p>
                  </div>
                ) : (
                  notifications.map((n) => {
                    let IconComp = CheckCircle2;
                    let iconColor = 'text-emerald-400';
                    if (n.type === 'error') {
                      IconComp = AlertCircle;
                      iconColor = 'text-rose-400';
                    } else if (n.type === 'warning') {
                      IconComp = AlertTriangle;
                      iconColor = 'text-amber-400';
                    } else if (n.type === 'info') {
                      IconComp = Info;
                      iconColor = 'text-blue-400';
                    }

                    return (
                      <div
                        key={n.id}
                        onClick={() => markNotificationAsRead(n.id)}
                        className={`p-3 rounded-xl border transition-all cursor-pointer group flex items-start gap-3 ${
                          !n.read
                            ? 'bg-[#111827] border-emerald-900/50 hover:border-emerald-500/50 shadow-sm'
                            : 'bg-[#111827]/40 border-slate-800/60 opacity-75 hover:opacity-100'
                        }`}
                      >
                        <IconComp className={`w-4 h-4 shrink-0 mt-0.5 ${iconColor}`} />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1">
                            <span className={`font-semibold text-xs ${!n.read ? 'text-white' : 'text-slate-300'}`}>
                              {n.title}
                            </span>
                            <span className="text-[10px] font-mono text-slate-500 shrink-0">
                              {n.timestamp}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed line-clamp-2">
                            {n.description}
                          </p>
                        </div>

                        {!n.read && (
                          <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0 mt-1.5 animate-pulse" title="Unread" />
                        )}
                      </div>
                    );
                  })
                )}
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
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 via-amber-400 to-yellow-500 flex items-center justify-center text-slate-950 font-black text-sm shadow-md shadow-emerald-500/20">
                S111
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-slate-900" />
            </div>

            <div className="hidden sm:block">
              <p className="text-xs font-bold text-white leading-tight">Shyam Admin</p>
              <p className="text-[10px] text-amber-400 font-semibold leading-tight">
                Master Admin
              </p>
            </div>

            <ChevronDown className="w-4 h-4 text-slate-400 hidden sm:block" />
          </button>

          {profileDropdownOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-[#0F172A] border border-slate-800 rounded-2xl shadow-2xl overflow-hidden z-50 animate-slide-in">
              <div className="p-4 bg-gradient-to-b from-emerald-950/40 to-[#0F172A] border-b border-slate-800 text-center">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 via-amber-400 to-yellow-500 mx-auto flex items-center justify-center text-slate-950 font-black text-lg mb-2 shadow-lg shadow-emerald-500/20">
                  S111
                </div>
                <h4 className="text-sm font-bold text-white">Shyam Admin</h4>
                <p className="text-xs text-slate-400">admin@shyam111.com</p>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px] mt-2 font-semibold">
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
                  <Settings className="w-4 h-4 text-emerald-400" />
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
