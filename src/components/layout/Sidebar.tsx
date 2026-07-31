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
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const {
    currentPage,
    setCurrentPage,
    sidebarOpen,
    setSidebarOpen,
    switchSessionRole,
    superDistributers,
    distributers,
    retailers,
    users,
    onlinePlayers,
    depositRequests,
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
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed top-0 left-0 bottom-0 z-50 w-64 bg-slate-900 border-r border-slate-800 text-slate-300 flex flex-col transition-transform duration-300 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0 lg:w-64'
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 flex items-center justify-between px-5 border-b border-slate-800 bg-slate-950/40">
          <button
            onClick={() => navigateTo('dashboard')}
            className="flex items-center gap-3 group text-left"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-600 via-cyan-400 to-blue-500 p-0.5 shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-cyan-400 animate-pulse" />
              </div>
            </div>
            <div>
              <span className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-cyan-200 to-white tracking-wider block">
                SHYAM PANEL
              </span>
              <span className="text-[10px] uppercase tracking-widest text-slate-500 font-semibold block">
                Gaming Master Admin
              </span>
            </div>
          </button>

          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sidebar Nav List */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6 custom-scrollbar">
          {/* MAIN */}
          <div>
            <div className="px-3 mb-2 text-[11px] font-bold tracking-widest text-slate-500 uppercase">
              Main
            </div>
            <button
              onClick={() => navigateTo('dashboard')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm transition-all ${
                isNavActive('dashboard')
                  ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 shadow-sm shadow-cyan-500/10'
                  : 'hover:bg-slate-800/60 hover:text-white text-slate-400'
              }`}
            >
              <LayoutDashboard className="w-4 h-4 text-cyan-400" />
              <span>Dashboard</span>
            </button>
          </div>

          {/* MANAGEMENT */}
          <div>
            <div className="px-3 mb-2 text-[11px] font-bold tracking-widest text-slate-500 uppercase">
              Management
            </div>
            <div className="space-y-1">
              <button
                onClick={() => navigateTo('superdistributer')}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-medium text-sm transition-all ${
                  isNavActive('superdistributer')
                    ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30'
                    : 'hover:bg-slate-800/60 hover:text-white text-slate-400'
                }`}
              >
                <div className="flex items-center gap-3">
                  <UserCheck className="w-4 h-4 text-purple-400" />
                  <span>SuperDistributer</span>
                </div>
                <span className="text-xs px-2 py-0.5 rounded-full bg-purple-950/60 text-purple-300 border border-purple-800/50">
                  {superDistributers.length}
                </span>
              </button>

              <button
                onClick={() => navigateTo('distributer')}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-medium text-sm transition-all ${
                  isNavActive('distributer')
                    ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30'
                    : 'hover:bg-slate-800/60 hover:text-white text-slate-400'
                }`}
              >
                <div className="flex items-center gap-3">
                  <UserPlus className="w-4 h-4 text-blue-400" />
                  <span>Distributer</span>
                </div>
                <span className="text-xs px-2 py-0.5 rounded-full bg-blue-950/60 text-blue-300 border border-blue-800/50">
                  {distributers.length}
                </span>
              </button>

              <button
                onClick={() => navigateTo('retailer')}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-medium text-sm transition-all ${
                  isNavActive('retailer')
                    ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30'
                    : 'hover:bg-slate-800/60 hover:text-white text-slate-400'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Users className="w-4 h-4 text-emerald-400" />
                  <span>Retailer</span>
                </div>
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-950/60 text-emerald-300 border border-emerald-800/50">
                  {retailers.length}
                </span>
              </button>

              <button
                onClick={() => navigateTo('users')}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-medium text-sm transition-all ${
                  isNavActive('users')
                    ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30'
                    : 'hover:bg-slate-800/60 hover:text-white text-slate-400'
                }`}
              >
                <div className="flex items-center gap-3">
                  <User className="w-4 h-4 text-amber-400" />
                  <span>Users</span>
                </div>
                <span className="text-xs px-2 py-0.5 rounded-full bg-amber-950/60 text-amber-300 border border-amber-800/50">
                  {users.length}
                </span>
              </button>

              <button
                onClick={() => navigateTo('online_players')}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-medium text-sm transition-all ${
                  isNavActive('online_players')
                    ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30'
                    : 'hover:bg-slate-800/60 hover:text-white text-slate-400'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Radio className="w-4 h-4 text-rose-400 animate-pulse" />
                  <span>Online Players</span>
                </div>
                <span className="text-xs px-2 py-0.5 rounded-full bg-rose-950/80 text-rose-300 border border-rose-800/60 animate-pulse font-bold">
                  {onlinePlayers.length}
                </span>
              </button>
            </div>
          </div>

          {/* GAME */}
          <div>
            <div className="px-3 mb-2 text-[11px] font-bold tracking-widest text-slate-500 uppercase">
              Game
            </div>
            <div className="space-y-1">
              <button
                onClick={() => navigateTo('user_game_portal')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm transition-all ${
                  isNavActive('user_game_portal')
                    ? 'bg-gradient-to-r from-cyan-600/30 to-blue-600/30 text-cyan-300 border border-cyan-500/40 shadow-sm'
                    : 'hover:bg-slate-800/60 hover:text-white text-emerald-400 font-semibold'
                }`}
              >
                <Gamepad2 className="w-4 h-4 text-emerald-400 animate-pulse" />
                <span>Player Game Portal</span>
              </button>

              <button
                onClick={() => navigateTo('admin_lucky12_config')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm transition-all ${
                  isNavActive('admin_lucky12_config')
                    ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30 shadow-sm shadow-amber-500/10'
                    : 'hover:bg-slate-800/60 hover:text-white text-amber-400 font-semibold'
                }`}
              >
                <Flame className="w-4 h-4 text-amber-400" />
                <span>Lucky 12 GitHub Cards</span>
              </button>

              <button
                onClick={() => navigateTo('result_settings')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm transition-all ${
                  isNavActive('result_settings')
                    ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 shadow-sm shadow-cyan-500/10'
                    : 'hover:bg-slate-800/60 hover:text-white text-cyan-400 font-semibold'
                }`}
              >
                <SlidersHorizontal className="w-4 h-4 text-cyan-400" />
                <span>Result Mode & Lock</span>
              </button>

              <button
                onClick={() => navigateTo('game_history')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm transition-all ${
                  isNavActive('game_history')
                    ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30'
                    : 'hover:bg-slate-800/60 hover:text-white text-slate-400'
                }`}
              >
                <History className="w-4 h-4 text-cyan-400" />
                <span>Game History</span>
              </button>

              <button
                onClick={() => navigateTo('win_percentage')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm transition-all ${
                  isNavActive('win_percentage')
                    ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30'
                    : 'hover:bg-slate-800/60 hover:text-white text-slate-400'
                }`}
              >
                <Percent className="w-4 h-4 text-indigo-400" />
                <span>Win Percentage</span>
              </button>

              <button
                onClick={() => navigateTo('calculator_note')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm transition-all ${
                  isNavActive('calculator_note')
                    ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30'
                    : 'hover:bg-slate-800/60 hover:text-white text-slate-400'
                }`}
              >
                <Calculator className="w-4 h-4 text-teal-400" />
                <span>Calculator Note</span>
              </button>

              <button
                onClick={() => navigateTo('source_code_export')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm transition-all ${
                  isNavActive('source_code_export')
                    ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30'
                    : 'hover:bg-slate-800/60 hover:text-white text-amber-400 font-semibold'
                }`}
              >
                <Code2 className="w-4 h-4 text-amber-400" />
                <span>PHP/SQL Source Code</span>
              </button>
            </div>
          </div>

          {/* TURN-OVER REPORTS */}
          <div>
            <div className="px-3 mb-2 text-[11px] font-bold tracking-widest text-slate-500 uppercase">
              Turn-Over Reports
            </div>
            <div className="space-y-1">
              <button
                onClick={() => navigateTo('turnover_admin')}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                  isNavActive('turnover_admin')
                    ? 'bg-cyan-500/15 text-cyan-400 font-semibold'
                    : 'hover:bg-slate-800/60 text-slate-400 hover:text-white'
                }`}
              >
                <BarChart3 className="w-3.5 h-3.5 text-cyan-400" />
                <span>Admin</span>
              </button>

              <button
                onClick={() => navigateTo('turnover_superdistributer')}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                  isNavActive('turnover_superdistributer')
                    ? 'bg-cyan-500/15 text-cyan-400 font-semibold'
                    : 'hover:bg-slate-800/60 text-slate-400 hover:text-white'
                }`}
              >
                <BarChart3 className="w-3.5 h-3.5 text-purple-400" />
                <span>SuperDistributer</span>
              </button>

              <button
                onClick={() => navigateTo('turnover_distributer')}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                  isNavActive('turnover_distributer')
                    ? 'bg-cyan-500/15 text-cyan-400 font-semibold'
                    : 'hover:bg-slate-800/60 text-slate-400 hover:text-white'
                }`}
              >
                <BarChart3 className="w-3.5 h-3.5 text-blue-400" />
                <span>Distributer</span>
              </button>

              <button
                onClick={() => navigateTo('turnover_retailer')}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                  isNavActive('turnover_retailer')
                    ? 'bg-cyan-500/15 text-cyan-400 font-semibold'
                    : 'hover:bg-slate-800/60 text-slate-400 hover:text-white'
                }`}
              >
                <BarChart3 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Retailer</span>
              </button>

              <button
                onClick={() => navigateTo('turnover_user')}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                  isNavActive('turnover_user')
                    ? 'bg-cyan-500/15 text-cyan-400 font-semibold'
                    : 'hover:bg-slate-800/60 text-slate-400 hover:text-white'
                }`}
              >
                <BarChart3 className="w-3.5 h-3.5 text-amber-400" />
                <span>User</span>
              </button>
            </div>
          </div>

          {/* COMMISSION */}
          <div>
            <div className="px-3 mb-2 text-[11px] font-bold tracking-widest text-slate-500 uppercase">
              Commission
            </div>
            <div className="space-y-1">
              <button
                onClick={() => navigateTo('commission_user')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm transition-all ${
                  isNavActive('commission_user')
                    ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30'
                    : 'hover:bg-slate-800/60 hover:text-white text-slate-400'
                }`}
              >
                <Briefcase className="w-4 h-4 text-emerald-400" />
                <span>User Wise</span>
              </button>

              <button
                onClick={() => navigateTo('commission_game')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm transition-all ${
                  isNavActive('commission_game')
                    ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30'
                    : 'hover:bg-slate-800/60 hover:text-white text-slate-400'
                }`}
              >
                <Briefcase className="w-4 h-4 text-teal-400" />
                <span>Game Wise</span>
              </button>
            </div>
          </div>

          {/* LIVE RESULT (COLLAPSIBLE) */}
          <div>
            <button
              onClick={() => setOpenLiveResults(!openLiveResults)}
              className="w-full flex items-center justify-between px-3 py-2 text-xs font-bold tracking-widest text-slate-400 hover:text-white uppercase group"
            >
              <div className="flex items-center gap-2">
                <PlayCircle className="w-4 h-4 text-cyan-400" />
                <span>Live Result</span>
              </div>
              {openLiveResults ? (
                <ChevronDown className="w-4 h-4 text-slate-500 group-hover:text-cyan-400" />
              ) : (
                <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400" />
              )}
            </button>

            {openLiveResults && (
              <div className="mt-1 ml-3 pl-3 border-l border-slate-800 space-y-1">
                <button
                  onClick={() => navigateTo('live_2d')}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                    isNavActive('live_2d')
                      ? 'bg-cyan-500/15 text-cyan-400 font-semibold'
                      : 'hover:bg-slate-800/60 text-slate-400 hover:text-white'
                  }`}
                >
                  2D Lottery
                </button>
                <button
                  onClick={() => navigateTo('live_3d')}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                    isNavActive('live_3d')
                      ? 'bg-cyan-500/15 text-cyan-400 font-semibold'
                      : 'hover:bg-slate-800/60 text-slate-400 hover:text-white'
                  }`}
                >
                  3D Lottery
                </button>
                <button
                  onClick={() => navigateTo('live_lucky12')}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                    isNavActive('live_lucky12')
                      ? 'bg-cyan-500/15 text-cyan-400 font-semibold'
                      : 'hover:bg-slate-800/60 text-slate-400 hover:text-white'
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
              className="w-full flex items-center justify-between px-3 py-2 text-xs font-bold tracking-widest text-slate-400 hover:text-white uppercase group"
            >
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-blue-400" />
                <span>Others Activity</span>
              </div>
              {openOthersActivity ? (
                <ChevronDown className="w-4 h-4 text-slate-500 group-hover:text-blue-400" />
              ) : (
                <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-blue-400" />
              )}
            </button>

            {openOthersActivity && (
              <div className="mt-1 ml-3 pl-3 border-l border-slate-800 space-y-1">
                <button
                  onClick={() => navigateTo('history_transactions')}
                  className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                    isNavActive('history_transactions')
                      ? 'bg-cyan-500/15 text-cyan-400 font-semibold'
                      : 'hover:bg-slate-800/60 text-slate-400 hover:text-white'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>Transaction History</span>
                </button>
                <button
                  onClick={() => navigateTo('history_logs')}
                  className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                    isNavActive('history_logs')
                      ? 'bg-cyan-500/15 text-cyan-400 font-semibold'
                      : 'hover:bg-slate-800/60 text-slate-400 hover:text-white'
                  }`}
                >
                  <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
                  <span>Logs</span>
                </button>
                <button
                  onClick={() => navigateTo('history_delete')}
                  className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                    isNavActive('history_delete')
                      ? 'bg-rose-500/15 text-rose-400 font-semibold'
                      : 'hover:bg-slate-800/60 text-slate-400 hover:text-white'
                  }`}
                >
                  <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                  <span>Delete Data</span>
                </button>
                <button
                  onClick={() => navigateTo('history_cancel_tickets')}
                  className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                    isNavActive('history_cancel_tickets')
                      ? 'bg-cyan-500/15 text-cyan-400 font-semibold'
                      : 'hover:bg-slate-800/60 text-slate-400 hover:text-white'
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
              className="w-full flex items-center justify-between px-3 py-2 text-xs font-bold tracking-widest text-slate-400 hover:text-white uppercase group"
            >
              <div className="flex items-center gap-2">
                <Trophy className="w-4 h-4 text-amber-400" />
                <span>Winning Declare</span>
              </div>
              {openWinningDeclare ? (
                <ChevronDown className="w-4 h-4 text-slate-500 group-hover:text-amber-400" />
              ) : (
                <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-amber-400" />
              )}
            </button>

            {openWinningDeclare && (
              <div className="mt-1 ml-3 pl-3 border-l border-slate-800 space-y-1">
                <button
                  onClick={() => navigateTo('declare_2d')}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                    isNavActive('declare_2d')
                      ? 'bg-amber-500/15 text-amber-400 font-semibold'
                      : 'hover:bg-slate-800/60 text-slate-400 hover:text-white'
                  }`}
                >
                  2D Lottery
                </button>
                <button
                  onClick={() => navigateTo('declare_3d')}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                    isNavActive('declare_3d')
                      ? 'bg-amber-500/15 text-amber-400 font-semibold'
                      : 'hover:bg-slate-800/60 text-slate-400 hover:text-white'
                  }`}
                >
                  3D Lottery
                </button>
                <button
                  onClick={() => navigateTo('declare_lucky12')}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                    isNavActive('declare_lucky12')
                      ? 'bg-amber-500/15 text-amber-400 font-semibold'
                      : 'hover:bg-slate-800/60 text-slate-400 hover:text-white'
                  }`}
                >
                  Lucky 12
                </button>
              </div>
            )}
          </div>

          {/* FINANCIALS & REFERRALS */}
          <div className="pt-2 border-t border-slate-800 space-y-1">
            <button
              onClick={() => navigateTo('admin_deposits')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                isNavActive('admin_deposits')
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <ArrowDownRight className="w-4 h-4 text-emerald-400" />
                <span>Deposits & Withdrawals</span>
              </div>
              <span className="px-2 py-0.2 rounded-full text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-800">
                {depositRequests.filter((d) => d.status === 'Pending').length}
              </span>
            </button>

            <button
              onClick={() => navigateTo('admin_referrals')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                isNavActive('admin_referrals')
                  ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Gift className="w-4 h-4 text-amber-400" />
              <span>Referral Program</span>
            </button>
          </div>
        </div>

        {/* Footer Info */}
        <div className="p-3 border-t border-slate-800 bg-slate-950/60 space-y-2">
          <div className="text-xs text-slate-500 flex items-center justify-between px-1">
            <div>
              <span className="text-slate-400 font-semibold block">Shyam Panel v3.5</span>
              <span className="text-[10px]">Master Admin Engine</span>
            </div>
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          </div>
        </div>
      </aside>
    </>
  );
};
