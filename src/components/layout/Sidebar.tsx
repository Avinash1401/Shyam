import React, { useState } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { NavigationPage } from '../../types';
import {
  LayoutDashboard,
  Users,
  UserCheck,
  UserPlus,
  User,
  Radio,
  History,
  Percent,
  Calculator,
  BarChart3,
  Briefcase,
  PlayCircle,
  Activity,
  Trophy,
  ChevronDown,
  ChevronRight,
  ShieldAlert,
  Trash2,
  Ticket,
  X,
  Layers,
  Sparkles,
  Gamepad2,
  Code2,
  SlidersHorizontal,
  ArrowDownRight,
  Gift,
  Flame,
  Crown,
  Dices,
  Wallet,
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const {
    currentPage,
    setCurrentPage,
    sidebarOpen,
    setSidebarOpen,
    superDistributers,
    distributers,
    retailers,
    users,
    onlinePlayers,
    depositRequests,
    currentUser,
  } = useAdmin();

  // Collapsible dropdown states
  const [openLiveResults, setOpenLiveResults] = useState(
    ['live_2d', 'live_3d', 'live_lucky12'].includes(currentPage)
  );
  const [openOthersActivity, setOpenOthersActivity] = useState(
    ['history_transactions', 'history_logs', 'history_delete', 'history_cancel_tickets'].includes(
      currentPage
    )
  );
  const [openWinningDeclare, setOpenWinningDeclare] = useState(
    ['declare_2d', 'declare_3d', 'declare_lucky12'].includes(currentPage)
  );

  const navigateTo = (page: NavigationPage) => {
    setCurrentPage(page);
    // On mobile, close sidebar on navigate
    if (window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  };

  const isNavActive = (page: NavigationPage) => currentPage === page;

  return (
    <>
      {/* Mobile overlay backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed top-0 left-0 bottom-0 z-50 w-64 bg-[#0F172A] border-r border-slate-800/80 text-slate-300 flex flex-col transition-transform duration-300 ease-in-out shadow-2xl ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0 lg:w-64'
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 flex items-center justify-between px-5 border-b border-slate-800/80 bg-[#111827]/90 backdrop-blur-md shrink-0">
          <button
            onClick={() => navigateTo('dashboard')}
            className="flex items-center gap-3 group text-left"
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 via-amber-400 to-yellow-500 p-0.5 shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-[#0F172A] rounded-[14px] flex items-center justify-center">
                <Crown className="w-5 h-5 text-amber-400 animate-pulse" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-amber-300 to-yellow-200 tracking-tight">
                  Shyam111
                </span>
                <span className="px-1.5 py-0.2 text-[9px] font-black uppercase rounded bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  ADMIN
                </span>
              </div>
              <span className="text-[10px] uppercase tracking-widest text-slate-400 font-semibold block">
                Gaming Master Panel
              </span>
            </div>
          </button>

          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-slate-400 hover:text-white p-1.5 rounded-xl hover:bg-slate-800/80 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sidebar Nav List */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-5 custom-scrollbar">
          {/* MAIN */}
          <div>
            <div className="px-3 mb-2 text-[10px] font-black tracking-widest text-slate-400 uppercase">
              Main
            </div>
            <button
              onClick={() => navigateTo('dashboard')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl font-bold text-sm transition-all ${
                isNavActive('dashboard')
                  ? 'bg-gradient-to-r from-emerald-500/20 to-emerald-600/10 text-emerald-400 border border-emerald-500/40 shadow-lg shadow-emerald-500/10'
                  : 'hover:bg-slate-800/60 hover:text-white text-slate-300'
              }`}
            >
              <LayoutDashboard className="w-4 h-4 text-emerald-400" />
              <span>Dashboard</span>
            </button>
          </div>

          {/* MANAGEMENT */}
          <div>
            <div className="px-3 mb-2 text-[10px] font-black tracking-widest text-slate-400 uppercase">
              Management
            </div>
            <div className="space-y-1">
              {(currentUser?.role === 'admin' || currentUser?.role === 'SuperAdmin' || !currentUser?.role) && (
                <button
                  onClick={() => navigateTo('superdistributer')}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl font-semibold text-sm transition-all ${
                    isNavActive('superdistributer')
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : 'hover:bg-slate-800/60 hover:text-white text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <UserCheck className="w-4 h-4 text-purple-400" />
                    <span>Super Distributor</span>
                  </div>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-purple-950/80 text-purple-300 border border-purple-800/60 font-mono">
                    {superDistributers.length}
                  </span>
                </button>
              )}

              {(currentUser?.role === 'admin' || currentUser?.role === 'SuperAdmin' || currentUser?.role === 'SuperDistributer' || !currentUser?.role) && (
                <button
                  onClick={() => navigateTo('distributer')}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl font-semibold text-sm transition-all ${
                    isNavActive('distributer')
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : 'hover:bg-slate-800/60 hover:text-white text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <UserPlus className="w-4 h-4 text-blue-400" />
                    <span>Distributor</span>
                  </div>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-blue-950/80 text-blue-300 border border-blue-800/60 font-mono">
                    {distributers.length}
                  </span>
                </button>
              )}

              {(currentUser?.role === 'admin' || currentUser?.role === 'SuperAdmin' || currentUser?.role === 'SuperDistributer' || currentUser?.role === 'Distributer' || !currentUser?.role) && (
                <button
                  onClick={() => navigateTo('retailer')}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl font-semibold text-sm transition-all ${
                    isNavActive('retailer')
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : 'hover:bg-slate-800/60 hover:text-white text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Users className="w-4 h-4 text-emerald-400" />
                    <span>Retailer</span>
                  </div>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-800/60 font-mono">
                    {retailers.length}
                  </span>
                </button>
              )}

              <button
                onClick={() => navigateTo('users')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl font-semibold text-sm transition-all ${
                  isNavActive('users')
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : 'hover:bg-slate-800/60 hover:text-white text-slate-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <User className="w-4 h-4 text-amber-400" />
                  <span>Users</span>
                </div>
                <span className="text-xs px-2 py-0.5 rounded-full bg-amber-950/80 text-amber-300 border border-amber-800/60 font-mono">
                  {users.length}
                </span>
              </button>

              <button
                onClick={() => navigateTo('online_players')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl font-semibold text-sm transition-all ${
                  isNavActive('online_players')
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : 'hover:bg-slate-800/60 hover:text-white text-slate-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Radio className="w-4 h-4 text-rose-400 animate-pulse" />
                  <span>Online Players</span>
                </div>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-rose-950/90 text-rose-300 border border-rose-800/80 animate-pulse font-extrabold font-mono">
                  {onlinePlayers.length}
                </span>
              </button>
            </div>
          </div>

          {/* GAME */}
          <div>
            <div className="px-3 mb-2 text-[10px] font-black tracking-widest text-slate-400 uppercase">
              Game
            </div>
            <div className="space-y-1">
              <button
                onClick={() => navigateTo('2d_lottery')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl font-bold text-sm transition-all ${
                  isNavActive('2d_lottery')
                    ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/50 shadow-md shadow-indigo-500/10'
                    : 'hover:bg-slate-800/60 hover:text-white text-indigo-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Sparkles className="w-4 h-4 text-indigo-400" />
                  <span>2D Lottery Dashboard</span>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-950 text-indigo-300 border border-indigo-800 font-extrabold">
                  2D
                </span>
              </button>

              <button
                onClick={() => navigateTo('declare_3d')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl font-bold text-sm transition-all ${
                  isNavActive('declare_3d')
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50 shadow-md shadow-amber-500/10'
                    : 'hover:bg-slate-800/60 hover:text-white text-amber-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Trophy className="w-4 h-4 text-amber-400" />
                  <span>3D Lottery Dashboard</span>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-950 text-amber-300 border border-amber-800 font-extrabold">
                  3D
                </span>
              </button>

              <button
                onClick={() => navigateTo('declare_lucky12')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl font-bold text-sm transition-all ${
                  isNavActive('declare_lucky12') || isNavActive('admin_lucky12_config')
                    ? 'bg-purple-500/20 text-purple-300 border border-purple-500/50 shadow-md shadow-purple-500/10'
                    : 'hover:bg-slate-800/60 hover:text-white text-purple-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Flame className="w-4 h-4 text-purple-400" />
                  <span>Lucky 12 Dashboard</span>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-950 text-purple-300 border border-purple-800 font-extrabold">
                  12X
                </span>
              </button>

              <button
                onClick={() => navigateTo('live_bets_dashboard')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl font-bold text-sm transition-all ${
                  isNavActive('live_bets_dashboard')
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50 shadow-md shadow-amber-500/10'
                    : 'hover:bg-slate-800/60 hover:text-white text-amber-400'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Dices className="w-4 h-4 text-amber-400 animate-bounce" />
                  <span>Live Bets Dashboard</span>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-950 text-amber-300 border border-amber-800 font-extrabold animate-pulse">
                  LIVE
                </span>
              </button>

              <button
                onClick={() => navigateTo('user_game_portal')}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl font-bold text-sm transition-all ${
                  isNavActive('user_game_portal')
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : 'hover:bg-slate-800/60 hover:text-white text-emerald-400'
                }`}
              >
                <Gamepad2 className="w-4 h-4 text-emerald-400" />
                <span>Player Game Portal</span>
              </button>

              <button
                onClick={() => navigateTo('admin_lucky12_config')}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl font-semibold text-sm transition-all ${
                  isNavActive('admin_lucky12_config')
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : 'hover:bg-slate-800/60 hover:text-white text-amber-300'
                }`}
              >
                <Flame className="w-4 h-4 text-amber-400" />
                <span>Lucky 12 Cards GIF</span>
              </button>

              <button
                onClick={() => navigateTo('result_settings')}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl font-semibold text-sm transition-all ${
                  isNavActive('result_settings')
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : 'hover:bg-slate-800/60 hover:text-white text-cyan-300'
                }`}
              >
                <SlidersHorizontal className="w-4 h-4 text-cyan-400" />
                <span>Result Mode & Lock</span>
              </button>

              <button
                onClick={() => navigateTo('game_history')}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl font-semibold text-sm transition-all ${
                  isNavActive('game_history')
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : 'hover:bg-slate-800/60 hover:text-white text-slate-300'
                }`}
              >
                <History className="w-4 h-4 text-emerald-400" />
                <span>Game History</span>
              </button>

              <button
                onClick={() => navigateTo('win_percentage')}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl font-semibold text-sm transition-all ${
                  isNavActive('win_percentage')
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : 'hover:bg-slate-800/60 hover:text-white text-slate-300'
                }`}
              >
                <Percent className="w-4 h-4 text-indigo-400" />
                <span>Win Percentage</span>
              </button>

              <button
                onClick={() => navigateTo('calculator_note')}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl font-semibold text-sm transition-all ${
                  isNavActive('calculator_note')
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : 'hover:bg-slate-800/60 hover:text-white text-slate-300'
                }`}
              >
                <Calculator className="w-4 h-4 text-teal-400" />
                <span>Calculator Note</span>
              </button>

              <button
                onClick={() => navigateTo('source_code_export')}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl font-semibold text-sm transition-all ${
                  isNavActive('source_code_export')
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : 'hover:bg-slate-800/60 hover:text-white text-amber-400'
                }`}
              >
                <Code2 className="w-4 h-4 text-amber-400" />
                <span>PHP/SQL Source Code</span>
              </button>
            </div>
          </div>

          {/* TURN-OVER REPORTS */}
          <div>
            <div className="px-3 mb-2 text-[10px] font-black tracking-widest text-slate-400 uppercase">
              Turn-Over Reports
            </div>
            <div className="space-y-1">
              <button
                onClick={() => navigateTo('turnover_admin')}
                className={`w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                  isNavActive('turnover_admin')
                    ? 'bg-emerald-500/20 text-emerald-400 font-bold'
                    : 'hover:bg-slate-800/60 text-slate-300 hover:text-white'
                }`}
              >
                <BarChart3 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Admin Reports</span>
              </button>

              <button
                onClick={() => navigateTo('turnover_superdistributer')}
                className={`w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                  isNavActive('turnover_superdistributer')
                    ? 'bg-emerald-500/20 text-emerald-400 font-bold'
                    : 'hover:bg-slate-800/60 text-slate-300 hover:text-white'
                }`}
              >
                <BarChart3 className="w-3.5 h-3.5 text-purple-400" />
                <span>Super Distributor Reports</span>
              </button>

              <button
                onClick={() => navigateTo('turnover_distributer')}
                className={`w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                  isNavActive('turnover_distributer')
                    ? 'bg-emerald-500/20 text-emerald-400 font-bold'
                    : 'hover:bg-slate-800/60 text-slate-300 hover:text-white'
                }`}
              >
                <BarChart3 className="w-3.5 h-3.5 text-blue-400" />
                <span>Distributor Reports</span>
              </button>

              <button
                onClick={() => navigateTo('turnover_retailer')}
                className={`w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                  isNavActive('turnover_retailer')
                    ? 'bg-emerald-500/20 text-emerald-400 font-bold'
                    : 'hover:bg-slate-800/60 text-slate-300 hover:text-white'
                }`}
              >
                <BarChart3 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Retailer Reports</span>
              </button>

              <button
                onClick={() => navigateTo('turnover_user')}
                className={`w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                  isNavActive('turnover_user')
                    ? 'bg-emerald-500/20 text-emerald-400 font-bold'
                    : 'hover:bg-slate-800/60 text-slate-300 hover:text-white'
                }`}
              >
                <BarChart3 className="w-3.5 h-3.5 text-amber-400" />
                <span>User Reports</span>
              </button>
            </div>
          </div>

          {/* COMMISSION */}
          <div>
            <div className="px-3 mb-2 text-[10px] font-black tracking-widest text-slate-400 uppercase">
              Commission
            </div>
            <div className="space-y-1">
              <button
                onClick={() => navigateTo('commission_user')}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl font-semibold text-sm transition-all ${
                  isNavActive('commission_user')
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : 'hover:bg-slate-800/60 hover:text-white text-slate-300'
                }`}
              >
                <Briefcase className="w-4 h-4 text-emerald-400" />
                <span>User Wise Commission</span>
              </button>

              <button
                onClick={() => navigateTo('commission_game')}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl font-semibold text-sm transition-all ${
                  isNavActive('commission_game')
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : 'hover:bg-slate-800/60 hover:text-white text-slate-300'
                }`}
              >
                <Briefcase className="w-4 h-4 text-teal-400" />
                <span>Game Wise Commission</span>
              </button>
            </div>
          </div>

          {/* LIVE RESULT (COLLAPSIBLE) */}
          <div>
            <button
              onClick={() => setOpenLiveResults(!openLiveResults)}
              className="w-full flex items-center justify-between px-3.5 py-2 text-xs font-black tracking-widest text-slate-400 hover:text-white uppercase group"
            >
              <div className="flex items-center gap-2">
                <PlayCircle className="w-4 h-4 text-emerald-400" />
                <span>Live Result</span>
              </div>
              {openLiveResults ? (
                <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-emerald-400" />
              ) : (
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-400" />
              )}
            </button>

            {openLiveResults && (
              <div className="mt-1 ml-3 pl-3 border-l border-slate-800/80 space-y-1">
                <button
                  onClick={() => navigateTo('live_2d')}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                    isNavActive('live_2d')
                      ? 'bg-emerald-500/20 text-emerald-400 font-bold'
                      : 'hover:bg-slate-800/60 text-slate-300 hover:text-white'
                  }`}
                >
                  2D Lottery
                </button>
                <button
                  onClick={() => navigateTo('live_3d')}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                    isNavActive('live_3d')
                      ? 'bg-emerald-500/20 text-emerald-400 font-bold'
                      : 'hover:bg-slate-800/60 text-slate-300 hover:text-white'
                  }`}
                >
                  3D Lottery
                </button>
                <button
                  onClick={() => navigateTo('live_lucky12')}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                    isNavActive('live_lucky12')
                      ? 'bg-emerald-500/20 text-emerald-400 font-bold'
                      : 'hover:bg-slate-800/60 text-slate-300 hover:text-white'
                  }`}
                >
                  Lucky 12
                </button>
              </div>
            )}
          </div>

          {/* OTHERS ACTIVITY (COLLAPSIBLE) */}
          <div>
            <button
              onClick={() => setOpenOthersActivity(!openOthersActivity)}
              className="w-full flex items-center justify-between px-3.5 py-2 text-xs font-black tracking-widest text-slate-400 hover:text-white uppercase group"
            >
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-blue-400" />
                <span>Others Activity</span>
              </div>
              {openOthersActivity ? (
                <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-blue-400" />
              ) : (
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-400" />
              )}
            </button>

            {openOthersActivity && (
              <div className="mt-1 ml-3 pl-3 border-l border-slate-800/80 space-y-1">
                <button
                  onClick={() => navigateTo('history_transactions')}
                  className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                    isNavActive('history_transactions')
                      ? 'bg-emerald-500/20 text-emerald-400 font-bold'
                      : 'hover:bg-slate-800/60 text-slate-300 hover:text-white'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>Transaction History</span>
                </button>
                <button
                  onClick={() => navigateTo('history_logs')}
                  className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                    isNavActive('history_logs')
                      ? 'bg-emerald-500/20 text-emerald-400 font-bold'
                      : 'hover:bg-slate-800/60 text-slate-300 hover:text-white'
                  }`}
                >
                  <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
                  <span>Logs</span>
                </button>
                <button
                  onClick={() => navigateTo('history_delete')}
                  className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                    isNavActive('history_delete')
                      ? 'bg-rose-500/20 text-rose-400 font-bold'
                      : 'hover:bg-slate-800/60 text-slate-300 hover:text-white'
                  }`}
                >
                  <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                  <span>Delete Data</span>
                </button>
                <button
                  onClick={() => navigateTo('history_cancel_tickets')}
                  className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                    isNavActive('history_cancel_tickets')
                      ? 'bg-emerald-500/20 text-emerald-400 font-bold'
                      : 'hover:bg-slate-800/60 text-slate-300 hover:text-white'
                  }`}
                >
                  <Ticket className="w-3.5 h-3.5 text-purple-400" />
                  <span>Cancel Tickets</span>
                </button>
              </div>
            )}
          </div>

          {/* WINNING DECLARE (COLLAPSIBLE) */}
          <div>
            <button
              onClick={() => setOpenWinningDeclare(!openWinningDeclare)}
              className="w-full flex items-center justify-between px-3.5 py-2 text-xs font-black tracking-widest text-slate-400 hover:text-white uppercase group"
            >
              <div className="flex items-center gap-2">
                <Trophy className="w-4 h-4 text-amber-400" />
                <span>Winning Declare</span>
              </div>
              {openWinningDeclare ? (
                <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-amber-400" />
              ) : (
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-amber-400" />
              )}
            </button>

            {openWinningDeclare && (
              <div className="mt-1 ml-3 pl-3 border-l border-slate-800/80 space-y-1">
                <button
                  onClick={() => navigateTo('declare_2d')}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                    isNavActive('declare_2d')
                      ? 'bg-amber-500/20 text-amber-400 font-bold'
                      : 'hover:bg-slate-800/60 text-slate-300 hover:text-white'
                  }`}
                >
                  2D Lottery
                </button>
                <button
                  onClick={() => navigateTo('declare_3d')}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                    isNavActive('declare_3d')
                      ? 'bg-amber-500/20 text-amber-400 font-bold'
                      : 'hover:bg-slate-800/60 text-slate-300 hover:text-white'
                  }`}
                >
                  3D Lottery
                </button>
                <button
                  onClick={() => navigateTo('declare_lucky12')}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                    isNavActive('declare_lucky12')
                      ? 'bg-amber-500/20 text-amber-400 font-bold'
                      : 'hover:bg-slate-800/60 text-slate-300 hover:text-white'
                  }`}
                >
                  Lucky 12
                </button>
              </div>
            )}
          </div>

          {/* FINANCIALS & REFERRALS */}
          <div className="pt-2 border-t border-slate-800/80 space-y-1">
            <button
              onClick={() => navigateTo('admin_deposits')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all ${
                isNavActive('admin_deposits')
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <ArrowDownRight className="w-4 h-4 text-emerald-400" />
                <span>Deposits & Withdrawals</span>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-800 font-mono">
                {depositRequests.filter((d) => d.status === 'Pending').length}
              </span>
            </button>

            <button
              onClick={() => navigateTo('admin_referrals')}
              className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all ${
                isNavActive('admin_referrals')
                  ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Gift className="w-4 h-4 text-amber-400" />
              <span>Referral Program</span>
            </button>
          </div>
        </div>

        {/* Footer Info */}
        <div className="p-3 border-t border-slate-800/80 bg-[#111827]/80 space-y-2 shrink-0">
          <div className="text-xs text-slate-400 flex items-center justify-between px-1">
            <div>
              <span className="text-white font-bold block">Shyam111 v3.5</span>
              <span className="text-[10px] text-slate-400">Casino Admin Engine</span>
            </div>
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
          </div>
        </div>
      </aside>
    </>
  );
};
