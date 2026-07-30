import React from 'react';
import { useAdmin } from '../../context/AdminContext';
import { NavigationPage } from '../../types';
import {
  Gamepad2,
  Wallet,
  ArrowDownRight,
  ArrowUpRight,
  History,
  Trophy,
  Receipt,
  Gift,
  HelpCircle,
  User,
  LogOut,
  ChevronRight,
  Shield,
} from 'lucide-react';

export const PlayerSidebar: React.FC = () => {
  const { currentPage, setCurrentPage, sidebarOpen, logout, switchSessionRole } = useAdmin();

  const navItems: {
    page: NavigationPage;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: string;
  }[] = [
    { page: 'user_game_portal', label: 'Game Lobby', icon: Gamepad2, badge: 'LIVE' },
    { page: 'player_wallet', label: 'My Wallet', icon: Wallet },
    { page: 'player_deposit', label: 'Deposit Funds', icon: ArrowDownRight },
    { page: 'player_withdrawal', label: 'Withdraw Points', icon: ArrowUpRight },
    { page: 'game_history', label: 'Bet History', icon: History },
    { page: 'live_2d', label: 'Result History', icon: Trophy },
    { page: 'history_transactions', label: 'Transactions', icon: Receipt },
    { page: 'player_referral', label: 'Referral Program', icon: Gift, badge: 'BONUS' },
    { page: 'player_support', label: 'Help & Support', icon: HelpCircle },
    { page: 'profile', label: 'My Profile', icon: User },
  ];

  return (
    <aside
      className={`fixed top-16 left-0 z-20 h-[calc(100vh-4rem)] bg-slate-900 border-r border-slate-800 transition-all duration-300 flex flex-col justify-between ${
        sidebarOpen ? 'w-64' : 'w-20'
      }`}
    >
      <div className="p-3 space-y-1.5 overflow-y-auto">
        <div className={`px-3 py-2 text-[10px] font-bold text-slate-500 uppercase ${!sidebarOpen && 'hidden'}`}>
          Player Portal Navigation
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.page;

          return (
            <button
              key={item.page}
              onClick={() => setCurrentPage(item.page)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                isActive
                  ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/10 text-cyan-400 border border-cyan-500/30 shadow-md shadow-cyan-500/10'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/80'
              }`}
              title={item.label}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                {sidebarOpen && <span>{item.label}</span>}
              </div>

              {sidebarOpen && item.badge && (
                <span className="text-[9px] px-2 py-0.2 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800 font-extrabold">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Footer Switch Role / Logout */}
      <div className="p-3 border-t border-slate-800 space-y-1">
        <button
          onClick={() => switchSessionRole('Admin')}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-bold text-cyan-400 bg-slate-950 border border-cyan-800/80 hover:bg-slate-800 transition-colors ${
            !sidebarOpen && 'justify-center'
          }`}
          title="Switch to Admin Panel"
        >
          <Shield className="w-4 h-4 shrink-0 text-cyan-400" />
          {sidebarOpen && <span>Admin Panel</span>}
        </button>

        <button
          onClick={logout}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-bold text-rose-400 hover:bg-rose-950/40 transition-colors ${
            !sidebarOpen && 'justify-center'
          }`}
          title="Logout"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          {sidebarOpen && <span>Log Out</span>}
        </button>
      </div>
    </aside>
  );
};
