import React, { useState, useEffect } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { soundManager } from '../../utils/sound';
import { motion, AnimatePresence } from 'motion/react';
import {
  Wallet,
  Clock,
  Timer,
  Volume2,
  VolumeX,
  User,
  LogOut,
  Gift,
  ArrowUpRight,
  ArrowDownRight,
  Gamepad2,
  ChevronDown,
  Sparkles,
  Zap,
} from 'lucide-react';

export const PlayerHeader: React.FC = () => {
  const { currentUser, logout, setCurrentPage, addToast } = useAdmin();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(soundManager.isMuted());
  
  // Live Clock & Draw Timers
  const [currentTime, setCurrentTime] = useState<string>('');
  const [currentDraw, setCurrentDraw] = useState<string>('05:30 PM');
  const [nextDraw, setNextDraw] = useState<string>('06:00 PM');
  const [countdown, setCountdown] = useState<{ minutes: number; seconds: number }>({ minutes: 14, seconds: 32 });

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));

      // Calculate upcoming 30-min draw interval
      const currentMin = now.getMinutes();
      const currentHour = now.getHours();

      let drawMin = currentMin >= 30 ? 30 : 0;
      let nextMin = currentMin >= 30 ? 0 : 30;
      let nextHour = currentMin >= 30 ? currentHour + 1 : currentHour;

      const formatHour = (h: number, m: number) => {
        const d = new Date();
        d.setHours(h, m, 0, 0);
        return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      };

      setCurrentDraw(formatHour(currentHour, drawMin));
      setNextDraw(formatHour(nextHour, nextMin));

      // Calculate countdown to next draw
      const targetTime = new Date();
      targetTime.setHours(nextHour, nextMin, 0, 0);
      const diffMs = targetTime.getTime() - now.getTime();
      if (diffMs > 0) {
        const totalSec = Math.floor(diffMs / 1000);
        const mins = Math.floor(totalSec / 60);
        const secs = totalSec % 60;
        setCountdown({ minutes: mins, seconds: secs });
      } else {
        setCountdown({ minutes: 0, seconds: 0 });
      }
    };

    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const toggleSound = () => {
    const muted = soundManager.toggleMute();
    setIsMuted(muted);
    addToast(
      muted ? 'Muted' : 'Sound Enabled',
      muted ? 'Game audio is now muted' : 'Game audio effects turned on',
      'info'
    );
  };

  const currentPoints = currentUser?.points || 0;

  return (
    <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-2xl border-b border-slate-800/80 px-3 sm:px-6 py-2.5 shadow-[0_10px_30px_rgba(0,0,0,0.8)]">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-4">
        
        {/* Brand & Logo */}
        <motion.div 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => {
            soundManager.playClick();
            setCurrentPage('user_game_portal');
          }}
          className="flex items-center gap-2.5 cursor-pointer group shrink-0"
        >
          <div className="relative w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-purple-600 p-[1.5px] shadow-[0_0_20px_rgba(14,165,233,0.4)]">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-cyan-400 group-hover:bg-transparent group-hover:text-white transition-all duration-300">
              <Gamepad2 className="w-5 h-5 animate-pulse" />
            </div>
          </div>
          <div className="hidden sm:block">
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400">
                SHYAM111
              </span>
              <span className="px-1.5 py-0.5 text-[9px] font-black uppercase rounded-md bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                PRO
              </span>
            </div>
            <span className="text-[10px] text-slate-400 font-semibold tracking-wide block">
              Gaming Arena
            </span>
          </div>
        </motion.div>

        {/* Live Draw & Clock Info Center Bar */}
        <div className="hidden md:flex items-center gap-3 px-4 py-1.5 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md text-xs">
          {/* Current Clock */}
          <div className="flex items-center gap-1.5 text-slate-300 pr-3 border-r border-slate-800">
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
            <span className="font-mono font-bold text-slate-200">{currentTime || '00:00:00'}</span>
          </div>

          {/* Draw Info */}
          <div className="flex items-center gap-3 pr-3 border-r border-slate-800">
            <div>
              <span className="text-[9px] uppercase font-bold text-slate-500 block leading-tight">Current Draw</span>
              <span className="font-bold text-cyan-300 text-[11px]">{currentDraw}</span>
            </div>
            <div>
              <span className="text-[9px] uppercase font-bold text-slate-500 block leading-tight">Next Draw</span>
              <span className="font-bold text-purple-300 text-[11px]">{nextDraw}</span>
            </div>
          </div>

          {/* Countdown Timer */}
          <div className="flex items-center gap-2">
            <Timer className="w-4 h-4 text-amber-400 animate-spin" style={{ animationDuration: '4s' }} />
            <div>
              <span className="text-[9px] uppercase font-bold text-amber-400/80 block leading-tight">Closes In</span>
              <span className="font-mono font-black text-amber-400 text-xs tracking-wider">
                {String(countdown.minutes).padStart(2, '0')}m : {String(countdown.seconds).padStart(2, '0')}s
              </span>
            </div>
          </div>
        </div>

        {/* Right Section: Sound, Wallet, Quick Buttons, Profile */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          
          {/* Sound Toggle */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleSound}
            className={`p-2 rounded-xl border backdrop-blur-md transition-all ${
              isMuted
                ? 'bg-slate-900/60 border-slate-800 text-slate-500 hover:text-slate-300'
                : 'bg-cyan-950/40 border-cyan-500/40 text-cyan-400 shadow-[0_0_15px_rgba(14,165,233,0.2)]'
            }`}
            title={isMuted ? 'Unmute Sound' : 'Mute Sound'}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </motion.button>

          {/* Animated Wallet Balance */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              soundManager.playClick();
              setCurrentPage('player_wallet');
            }}
            className="flex items-center gap-2.5 px-3 py-1.5 rounded-2xl bg-slate-900/90 border border-emerald-500/30 hover:border-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.15)] cursor-pointer transition-all"
          >
            <div className="w-7 h-7 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Wallet className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block leading-none">
                Wallet
              </span>
              <motion.span 
                key={currentPoints}
                initial={{ scale: 1.2, color: '#34d399' }}
                animate={{ scale: 1, color: '#10b981' }}
                transition={{ duration: 0.3 }}
                className="text-xs sm:text-sm font-black text-emerald-400 font-mono block leading-tight"
              >
                ₹{currentPoints.toLocaleString('en-IN')}
              </motion.span>
            </div>
          </motion.div>

          {/* Gold Deposit Button */}
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => {
              soundManager.playClick();
              setCurrentPage('player_deposit');
            }}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600 text-slate-950 font-black text-xs shadow-[0_0_20px_rgba(245,158,11,0.3)] hover:shadow-[0_0_25px_rgba(245,158,11,0.5)] transition-all"
          >
            <ArrowDownRight className="w-3.5 h-3.5" />
            <span>Deposit</span>
          </motion.button>

          {/* Withdraw Button */}
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => {
              soundManager.playClick();
              setCurrentPage('player_withdrawal');
            }}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-slate-900/80 hover:bg-slate-800 border border-slate-700/60 text-slate-200 font-bold text-xs transition-all"
          >
            <ArrowUpRight className="w-3.5 h-3.5 text-amber-400" />
            <span>Withdraw</span>
          </motion.button>

          {/* Profile Dropdown */}
          <div className="relative">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => {
                soundManager.playClick();
                setDropdownOpen(!dropdownOpen);
              }}
              className="flex items-center gap-2 p-1.5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all"
            >
              <div className="relative">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-purple-600 flex items-center justify-center text-white font-extrabold text-xs shadow-md">
                  {(currentUser?.name || currentUser?.username || 'P')[0].toUpperCase()}
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 border-2 border-slate-950 rounded-full" />
              </div>
              <div className="hidden lg:block text-left">
                <span className="text-xs font-bold text-white block leading-none">
                  {currentUser?.name || currentUser?.username || 'Player'}
                </span>
                <span className="text-[10px] text-cyan-400 font-medium leading-none block mt-0.5">
                  @{currentUser?.username || 'player'}
                </span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </motion.button>

            <AnimatePresence>
              {dropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 mt-2 w-60 bg-slate-900/95 border border-slate-800/90 rounded-2xl shadow-2xl p-2.5 z-50 backdrop-blur-2xl space-y-1.5"
                >
                  <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800/80">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-black text-white">{currentUser?.name || currentUser?.username}</p>
                      <span className="px-1.5 py-0.5 text-[9px] font-bold bg-cyan-500/20 text-cyan-400 rounded-md">PRO</span>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-1 font-mono">Ref Code: {currentUser?.referralCode || `REF-${currentUser?.username?.toUpperCase()}`}</p>
                  </div>

                  <button
                    onClick={() => {
                      soundManager.playClick();
                      setCurrentPage('profile');
                      setDropdownOpen(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-200 hover:text-white hover:bg-slate-800/80 transition-colors"
                  >
                    <User className="w-4 h-4 text-cyan-400" />
                    <span>My Profile</span>
                  </button>

                  <button
                    onClick={() => {
                      soundManager.playClick();
                      setCurrentPage('player_referral');
                      setDropdownOpen(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-amber-300 hover:bg-slate-800/80 transition-colors"
                  >
                    <Gift className="w-4 h-4 text-amber-400" />
                    <span>Referral Rewards</span>
                  </button>

                  <button
                    onClick={() => {
                      soundManager.playClick();
                      logout();
                      setDropdownOpen(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-rose-400 hover:bg-rose-950/40 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>

      </div>
    </header>
  );
};
