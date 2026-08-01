import React from 'react';
import { useAdmin } from '../../context/AdminContext';
import { soundManager } from '../../utils/sound';
import { NavigationPage } from '../../types';
import { motion } from 'motion/react';
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
  Sparkles,
} from 'lucide-react';

export const PlayerSidebar: React.FC = () => {
  const { currentPage, setCurrentPage, sidebarOpen, logout } = useAdmin();

  const navItems: {
    page: NavigationPage;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: string;
  }[] = [
    { page: 'user_game_portal', label: 'Game Arena', icon: Gamepad2, badge: 'HOT' },
    { page: 'player_wallet', label: 'My Wallet', icon: Wallet },
    { page: 'player_deposit', label: 'Deposit Funds', icon: ArrowDownRight },
    { page: 'player_withdrawal', label: 'Withdraw Points', icon: ArrowUpRight },
    { page: 'game_history', label: 'Bet History', icon: History },
    { page: 'live_2d', label: 'Result Stream', icon: Trophy },
    { page: 'history_transactions', label: 'Transactions', icon: Receipt },
    { page: 'player_referral', label: 'Referral Program', icon: Gift, badge: 'BONUS' },
    { page: 'player_support', label: 'Help & Support', icon: HelpCircle },
    { page: 'profile', label: 'My Profile', icon: User },
  ];

  return (
    <aside
      className={`fixed top-16 left-0 z-20 h-[calc(100vh-4rem)] bg-slate-900/95 border-r border-slate-800/80 backdrop-blur-2xl transition-all duration-300 flex flex-col justify-between shadow-2xl ${
        sidebarOpen ? 'w-64' : 'w-20'
      }`}
    >
      <div className="p-3 space-y-1.5 overflow-y-auto custom-scrollbar">
        {sidebarOpen && (
          <div className="px-3 py-2 text-[10px] font-black text-slate-500 uppercase tracking-wider">
            Player Navigation
          </div>
        )}

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.page;

          return (
            <motion.button
              key={item.page}
              whileHover={{ x: sidebarOpen ? 4 : 0, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                soundManager.playClick();
                setCurrentPage(item.page);
              }}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-xs font-black transition-all ${
                isActive
                  ? 'bg-gradient-to-r from-cyan-500/20 via-blue-600/20 to-purple-600/20 text-cyan-300 border border-cyan-500/40 shadow-lg shadow-cyan-500/10'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
              title={item.label}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-cyan-400 animate-pulse' : 'text-slate-400'}`} />
                {sidebarOpen && <span>{item.label}</span>}
              </div>

              {sidebarOpen && item.badge && (
                <span className="text-[9px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 font-black tracking-wider uppercase">
                  {item.badge}
                </span>
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Footer Logout */}
      <div className="p-3 border-t border-slate-800/80">
        <button
          onClick={() => {
            soundManager.playClick();
            logout();
          }}
          className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-2xl text-xs font-black text-rose-400 hover:bg-rose-950/50 hover:text-rose-300 transition-colors ${
            !sidebarOpen && 'justify-center'
          }`}
          title="Sign Out"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          {sidebarOpen && <span>Sign Out</span>}
        </button>
      </div>
    </aside>
  );
};
