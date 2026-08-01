import React from 'react';
import { useAdmin } from '../../context/AdminContext';
import { soundManager } from '../../utils/sound';
import { motion } from 'motion/react';
import { Gamepad2, Layers, History, Wallet, User } from 'lucide-react';

export const BottomNavigation: React.FC = () => {
  const { currentPage, setCurrentPage } = useAdmin();

  const navItems = [
    { page: 'user_game_portal', label: 'Home', icon: Gamepad2 },
    { page: 'user_game_portal', label: 'Games', icon: Layers },
    { page: 'game_history', label: 'History', icon: History },
    { page: 'player_wallet', label: 'Wallet', icon: Wallet },
    { page: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <div className="md:hidden fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-md">
      <div className="bg-slate-900/90 backdrop-blur-2xl border border-cyan-500/30 rounded-3xl p-2 shadow-[0_10px_35px_rgba(0,0,0,0.9)] flex items-center justify-around relative">
        {navItems.map((item, idx) => {
          const Icon = item.icon;
          const isActive =
            currentPage === item.page ||
            (item.label === 'Games' && currentPage === 'user_game_portal') ||
            (item.label === 'Wallet' && (currentPage === 'player_deposit' || currentPage === 'player_withdrawal'));

          return (
            <button
              key={`${item.label}-${idx}`}
              onClick={() => {
                soundManager.playClick();
                setCurrentPage(item.page as any);
              }}
              className="relative flex flex-col items-center justify-center py-1.5 px-3 rounded-2xl transition-all"
            >
              {isActive && (
                <motion.div
                  layoutId="bottomNavGlow"
                  className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-2xl border border-cyan-500/40 shadow-[0_0_15px_rgba(14,165,233,0.3)]"
                  transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                />
              )}
              <Icon
                className={`w-5 h-5 relative z-10 transition-transform duration-200 ${
                  isActive ? 'text-cyan-400 scale-110' : 'text-slate-400 hover:text-slate-200'
                }`}
              />
              <span
                className={`text-[10px] font-bold mt-1 relative z-10 ${
                  isActive ? 'text-white font-extrabold' : 'text-slate-400'
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
