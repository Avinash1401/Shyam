import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from '../../context/AdminContext';
import { soundManager } from '../../utils/sound';
import { motion, AnimatePresence } from 'motion/react';
import {
  Gamepad2,
  Play,
  Dices,
  Sparkles,
  Flame,
  Calendar,
  Trophy,
  User,
  ShieldCheck,
  X,
  ArrowRight,
  Clock,
  Search,
  CheckCircle2,
  Lock,
  ChevronLeft,
  Zap,
} from 'lucide-react';
import { LiveResultsView } from './LiveResultsView';

export const OpeningHomePage: React.FC = () => {
  const navigate = useNavigate();
  const { isLoggedIn, userRole } = useAdmin();

  // Modal State for "PLAY FREE" choice popup
  const [showAuthChoiceModal, setShowAuthChoiceModal] = useState(false);

  // Active Chart Modal (allows viewing 2D, 3D, and L-12 result charts without login)
  const [activeChart, setActiveChart] = useState<'2D' | '3D' | 'L12' | null>(null);

  const isPlayerAuth = isLoggedIn && userRole === 'player';
  const isAdminAuth = isLoggedIn && userRole === 'admin';

  const handlePlayFreeClick = () => {
    soundManager.playClick();
    if (isPlayerAuth) {
      navigate('/player/dashboard');
    } else if (isAdminAuth) {
      navigate('/admin/dashboard');
    } else {
      setShowAuthChoiceModal(true);
    }
  };

  const handleGameButtonClick = (gameType: '2d' | '3d' | 'lucky12') => {
    soundManager.playClick();
    if (isPlayerAuth) {
      navigate('/player/dashboard');
    } else if (isAdminAuth) {
      navigate('/admin/dashboard');
    } else {
      setShowAuthChoiceModal(true);
    }
  };

  const handleOpenChart = (type: '2D' | '3D' | 'L12') => {
    soundManager.playClick();
    setActiveChart(type);
  };

  return (
    <div className="min-h-screen bg-[#070a12] text-slate-100 flex flex-col relative overflow-x-hidden font-sans selection:bg-cyan-500 selection:text-slate-950">
      {/* Background Neon Glowing Particles and Orbs */}
      <div className="fixed top-[-10%] left-[-10%] w-[55vw] h-[55vw] max-w-[600px] max-h-[600px] bg-cyan-500/15 rounded-full blur-[140px] pointer-events-none z-0 animate-pulse" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[55vw] h-[55vw] max-w-[600px] max-h-[600px] bg-purple-600/15 rounded-full blur-[140px] pointer-events-none z-0" />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40vw] h-[40vw] max-w-[450px] max-h-[450px] bg-emerald-500/10 rounded-full blur-[130px] pointer-events-none z-0" />

      {/* TOP HEADER */}
      <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-2xl border-b border-slate-800/80 px-4 py-3 shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          {/* Brand Logo & Name */}
          <motion.div
            whileHover={{ scale: 1.03 }}
            onClick={() => navigate('/')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-cyan-500 via-emerald-500 to-purple-600 p-[2px] shadow-[0_0_20px_rgba(16,185,129,0.4)] transition-all group-hover:shadow-[0_0_25px_rgba(14,165,233,0.6)]">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-cyan-400">
                <Gamepad2 className="w-6 h-6 animate-pulse" />
              </div>
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-emerald-300 to-yellow-400 uppercase drop-shadow-[0_0_12px_rgba(14,165,233,0.4)]">
                SHYAM111 GAME
              </h1>
              <p className="text-[10px] font-bold text-amber-400 uppercase tracking-widest flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-400 inline" /> Official Gaming Portal
              </p>
            </div>
          </motion.div>

          {/* Quick Header Actions */}
          <div className="flex items-center gap-2">
            {isLoggedIn ? (
              <button
                onClick={() => navigate(userRole === 'admin' ? '/admin/dashboard' : '/player/dashboard')}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow-[0_0_15px_rgba(14,165,233,0.4)] hover:scale-105 transition-all cursor-pointer"
              >
                <User className="w-4 h-4" />
                <span>Dashboard</span>
              </button>
            ) : (
              <button
                onClick={() => setShowAuthChoiceModal(true)}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-slate-950 text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow-[0_0_15px_rgba(16,185,129,0.4)] hover:scale-105 transition-all cursor-pointer"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Login</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* MAIN CONTENT CONTAINER */}
      <main className="flex-1 max-w-lg w-full mx-auto px-4 py-6 z-10 space-y-6">
        {/* Banner Hero Greeting */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-2 py-2"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-slate-900/90 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-widest shadow-inner">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>24/7 Live Gaming & Instant Results</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-wide">
            WELCOME TO <span className="text-amber-400 drop-shadow-[0_0_10px_rgba(251,191,36,0.4)]">SHYAM111</span>
          </h2>
          <p className="text-xs text-slate-400 font-medium max-w-xs mx-auto">
            Choose a game to play or check real-time result history charts below.
          </p>
        </motion.div>

        {/* MAIN MENU BUTTONS (6 LARGE PREMIUM GREEN BUTTONS) */}
        <div className="space-y-4">
          {/* BUTTON 1: PLAY FREE */}
          <motion.button
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.97 }}
            onClick={handlePlayFreeClick}
            className="w-full py-4 sm:py-5 px-6 rounded-2xl bg-gradient-to-r from-emerald-700 via-green-600 to-emerald-600 hover:from-emerald-600 hover:to-green-500 border-2 border-emerald-400/80 hover:border-cyan-300 text-white font-black text-xl uppercase tracking-wider flex items-center justify-between shadow-[0_10px_30px_rgba(16,185,129,0.35)] transition-all group cursor-pointer relative overflow-hidden"
          >
            <div className="flex items-center gap-3.5 z-10">
              <div className="p-2.5 rounded-xl bg-slate-950/50 border border-white/20 text-amber-300 group-hover:scale-110 transition-transform shadow-inner">
                <Play className="w-6 h-6 fill-amber-300 animate-pulse" />
              </div>
              <span className="drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] font-sans tracking-wide">
                PLAY FREE
              </span>
            </div>
            <div className="flex items-center gap-2 z-10">
              <span className="text-[11px] font-black uppercase tracking-wider text-amber-300 bg-slate-950/70 px-3 py-1 rounded-full border border-amber-400/40 shadow-inner">
                FREE DEMO
              </span>
              <ArrowRight className="w-5 h-5 text-emerald-200 group-hover:translate-x-1 transition-transform" />
            </div>
            {/* Shimmer Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none" />
          </motion.button>

          {/* BUTTON 2: SHYAM111 2D GAME */}
          <motion.button
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => handleGameButtonClick('2d')}
            className="w-full py-4 sm:py-5 px-6 rounded-2xl bg-gradient-to-r from-emerald-700 via-green-600 to-emerald-600 hover:from-emerald-600 hover:to-green-500 border-2 border-emerald-400/80 hover:border-cyan-300 text-white font-black text-xl uppercase tracking-wider flex items-center justify-between shadow-[0_10px_30px_rgba(16,185,129,0.35)] transition-all group cursor-pointer relative overflow-hidden"
          >
            <div className="flex items-center gap-3.5 z-10">
              <div className="p-2.5 rounded-xl bg-slate-950/50 border border-white/20 text-cyan-300 group-hover:scale-110 transition-transform shadow-inner">
                <Dices className="w-6 h-6 text-cyan-300" />
              </div>
              <span className="drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] font-sans tracking-wide">
                SHYAM111 2D
              </span>
            </div>
            <div className="flex items-center gap-2 z-10">
              <span className="text-[11px] font-black uppercase tracking-wider text-cyan-300 bg-slate-950/70 px-3 py-1 rounded-full border border-cyan-400/40 shadow-inner">
                90x PAYOUT
              </span>
              <ArrowRight className="w-5 h-5 text-emerald-200 group-hover:translate-x-1 transition-transform" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none" />
          </motion.button>

          {/* BUTTON 3: SHYAM111 3D GAME */}
          <motion.button
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => handleGameButtonClick('3d')}
            className="w-full py-4 sm:py-5 px-6 rounded-2xl bg-gradient-to-r from-emerald-700 via-green-600 to-emerald-600 hover:from-emerald-600 hover:to-green-500 border-2 border-emerald-400/80 hover:border-cyan-300 text-white font-black text-xl uppercase tracking-wider flex items-center justify-between shadow-[0_10px_30px_rgba(16,185,129,0.35)] transition-all group cursor-pointer relative overflow-hidden"
          >
            <div className="flex items-center gap-3.5 z-10">
              <div className="p-2.5 rounded-xl bg-slate-950/50 border border-white/20 text-purple-300 group-hover:scale-110 transition-transform shadow-inner">
                <Sparkles className="w-6 h-6 text-purple-300" />
              </div>
              <span className="drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] font-sans tracking-wide">
                SHYAM111 3D
              </span>
            </div>
            <div className="flex items-center gap-2 z-10">
              <span className="text-[11px] font-black uppercase tracking-wider text-purple-300 bg-slate-950/70 px-3 py-1 rounded-full border border-purple-400/40 shadow-inner">
                900x PAYOUT
              </span>
              <ArrowRight className="w-5 h-5 text-emerald-200 group-hover:translate-x-1 transition-transform" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none" />
          </motion.button>

          {/* BUTTON 4: SHYAM111 L-12 GAME */}
          <motion.button
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => handleGameButtonClick('lucky12')}
            className="w-full py-4 sm:py-5 px-6 rounded-2xl bg-gradient-to-r from-emerald-700 via-green-600 to-emerald-600 hover:from-emerald-600 hover:to-green-500 border-2 border-emerald-400/80 hover:border-cyan-300 text-white font-black text-xl uppercase tracking-wider flex items-center justify-between shadow-[0_10px_30px_rgba(16,185,129,0.35)] transition-all group cursor-pointer relative overflow-hidden"
          >
            <div className="flex items-center gap-3.5 z-10">
              <div className="p-2.5 rounded-xl bg-slate-950/50 border border-white/20 text-amber-300 group-hover:scale-110 transition-transform shadow-inner">
                <Flame className="w-6 h-6 text-amber-300" />
              </div>
              <span className="drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] font-sans tracking-wide">
                SHYAM111 L-12
              </span>
            </div>
            <div className="flex items-center gap-2 z-10">
              <span className="text-[11px] font-black uppercase tracking-wider text-amber-300 bg-slate-950/70 px-3 py-1 rounded-full border border-amber-400/40 shadow-inner">
                10x PAYOUT
              </span>
              <ArrowRight className="w-5 h-5 text-emerald-200 group-hover:translate-x-1 transition-transform" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none" />
          </motion.button>

          {/* BUTTON 5: 2D RESULT CHART */}
          <motion.button
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => handleOpenChart('2D')}
            className="w-full py-4 sm:py-5 px-6 rounded-2xl bg-gradient-to-r from-emerald-700 via-green-600 to-emerald-600 hover:from-emerald-600 hover:to-green-500 border-2 border-emerald-400/80 hover:border-cyan-300 text-white font-black text-xl uppercase tracking-wider flex items-center justify-between shadow-[0_10px_30px_rgba(16,185,129,0.35)] transition-all group cursor-pointer relative overflow-hidden"
          >
            <div className="flex items-center gap-3.5 z-10">
              <div className="p-2.5 rounded-xl bg-slate-950/50 border border-white/20 text-teal-300 group-hover:scale-110 transition-transform shadow-inner">
                <Calendar className="w-6 h-6 text-teal-300" />
              </div>
              <span className="drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] font-sans tracking-wide">
                2D RESULT CHART
              </span>
            </div>
            <div className="flex items-center gap-2 z-10">
              <span className="text-[11px] font-black uppercase tracking-wider text-teal-300 bg-slate-950/70 px-3 py-1 rounded-full border border-teal-400/40 shadow-inner">
                HISTORY
              </span>
              <ArrowRight className="w-5 h-5 text-emerald-200 group-hover:translate-x-1 transition-transform" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none" />
          </motion.button>

          {/* BUTTON 6: 3D RESULT CHART */}
          <motion.button
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => handleOpenChart('3D')}
            className="w-full py-4 sm:py-5 px-6 rounded-2xl bg-gradient-to-r from-emerald-700 via-green-600 to-emerald-600 hover:from-emerald-600 hover:to-green-500 border-2 border-emerald-400/80 hover:border-cyan-300 text-white font-black text-xl uppercase tracking-wider flex items-center justify-between shadow-[0_10px_30px_rgba(16,185,129,0.35)] transition-all group cursor-pointer relative overflow-hidden"
          >
            <div className="flex items-center gap-3.5 z-10">
              <div className="p-2.5 rounded-xl bg-slate-950/50 border border-white/20 text-rose-300 group-hover:scale-110 transition-transform shadow-inner">
                <Trophy className="w-6 h-6 text-rose-300" />
              </div>
              <span className="drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] font-sans tracking-wide">
                3D RESULT CHART
              </span>
            </div>
            <div className="flex items-center gap-2 z-10">
              <span className="text-[11px] font-black uppercase tracking-wider text-rose-300 bg-slate-950/70 px-3 py-1 rounded-full border border-rose-400/40 shadow-inner">
                ABC RESULTS
              </span>
              <ArrowRight className="w-5 h-5 text-emerald-200 group-hover:translate-x-1 transition-transform" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none" />
          </motion.button>

          {/* BUTTON 7: L-12 RESULT CHART */}
          <motion.button
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => handleOpenChart('L12')}
            className="w-full py-4 sm:py-5 px-6 rounded-2xl bg-gradient-to-r from-emerald-700 via-green-600 to-emerald-600 hover:from-emerald-600 hover:to-green-500 border-2 border-emerald-400/80 hover:border-cyan-300 text-white font-black text-xl uppercase tracking-wider flex items-center justify-between shadow-[0_10px_30px_rgba(16,185,129,0.35)] transition-all group cursor-pointer relative overflow-hidden"
          >
            <div className="flex items-center gap-3.5 z-10">
              <div className="p-2.5 rounded-xl bg-slate-950/50 border border-white/20 text-amber-300 group-hover:scale-110 transition-transform shadow-inner">
                <Flame className="w-6 h-6 text-amber-300" />
              </div>
              <span className="drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] font-sans tracking-wide">
                L-12 RESULT CHART
              </span>
            </div>
            <div className="flex items-center gap-2 z-10">
              <span className="text-[11px] font-black uppercase tracking-wider text-amber-300 bg-slate-950/70 px-3 py-1 rounded-full border border-amber-400/40 shadow-inner">
                LUCKY 12
              </span>
              <ArrowRight className="w-5 h-5 text-emerald-200 group-hover:translate-x-1 transition-transform" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none" />
          </motion.button>
        </div>

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-3 gap-3 pt-2">
          <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl text-center space-y-1">
            <ShieldCheck className="w-5 h-5 text-emerald-400 mx-auto" />
            <p className="text-[11px] font-bold text-slate-200">100% Secure</p>
            <p className="text-[9px] text-slate-400 font-mono">Verified System</p>
          </div>
          <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl text-center space-y-1">
            <Zap className="w-5 h-5 text-amber-400 mx-auto" />
            <p className="text-[11px] font-bold text-slate-200">Instant Result</p>
            <p className="text-[9px] text-slate-400 font-mono">Live Clock Draw</p>
          </div>
          <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl text-center space-y-1">
            <Trophy className="w-5 h-5 text-cyan-400 mx-auto" />
            <p className="text-[11px] font-bold text-slate-200">High Payouts</p>
            <p className="text-[9px] text-slate-400 font-mono">Up to 900x</p>
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="py-6 border-t border-slate-900 bg-slate-950/90 text-center text-xs text-slate-400 z-10 space-y-2">
        <p className="font-bold tracking-wider text-slate-300">SHYAM111 GAME © 2026</p>
        <p className="text-[10px] text-slate-400 font-mono">All Rights Reserved • Official Gaming & Live Results Portal</p>
      </footer>

      {/* ========================================================= */}
      {/* MODAL 1: PLAY FREE CHOICE POPUP (PLAYER LOGIN vs ADMIN LOGIN) */}
      {/* ========================================================= */}
      <AnimatePresence>
        {showAuthChoiceModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xl">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-[0_20px_60px_rgba(0,0,0,0.9)] space-y-6 relative overflow-hidden"
            >
              {/* Glow background */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

              {/* Close Button */}
              <button
                onClick={() => {
                  soundManager.playClick();
                  setShowAuthChoiceModal(false);
                }}
                className="absolute top-4 right-4 p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="text-center space-y-2 pt-2">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 to-emerald-500 p-[2px] mx-auto shadow-lg">
                  <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-emerald-400">
                    <Play className="w-6 h-6 fill-emerald-400" />
                  </div>
                </div>
                <h3 className="text-xl font-black text-white tracking-wide uppercase">
                  CHOOSE LOGIN MODE
                </h3>
                <p className="text-xs text-slate-400 font-medium">
                  Select your login portal to access Shyam111 Game
                </p>
              </div>

              {/* TWO CHOICE BUTTONS */}
              <div className="space-y-3 pt-2">
                {/* CHOICE 1: PLAYER LOGIN */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    soundManager.playClick();
                    setShowAuthChoiceModal(false);
                    navigate('/player/login');
                  }}
                  className="w-full py-4 px-5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 border border-emerald-400/50 text-white font-black text-base uppercase tracking-wider flex items-center justify-between shadow-lg shadow-emerald-950/50 cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-slate-950/40 text-emerald-300">
                      <User className="w-5 h-5" />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-black text-white">PLAYER LOGIN</p>
                      <p className="text-[10px] text-emerald-200 font-normal">Play 2D, 3D & L-12 Games</p>
                    </div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-emerald-200 group-hover:translate-x-1 transition-transform" />
                </motion.button>

                {/* CHOICE 2: ADMIN LOGIN */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    soundManager.playClick();
                    setShowAuthChoiceModal(false);
                    navigate('/admin/login');
                  }}
                  className="w-full py-4 px-5 rounded-2xl bg-slate-950 hover:bg-slate-800 border border-slate-700 text-slate-200 font-black text-base uppercase tracking-wider flex items-center justify-between shadow-lg cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-black text-white">ADMIN LOGIN</p>
                      <p className="text-[10px] text-slate-400 font-normal font-mono">Master Management Panel</p>
                    </div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-cyan-400 group-hover:translate-x-1 transition-transform" />
                </motion.button>
              </div>

              <div className="text-center pt-1">
                <p className="text-[11px] text-slate-400">
                  New Player?{' '}
                  <span
                    onClick={() => {
                      setShowAuthChoiceModal(false);
                      navigate('/player/register');
                    }}
                    className="text-amber-400 font-bold underline cursor-pointer hover:text-amber-300"
                  >
                    Register Free Account
                  </span>
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================= */}
      {/* MODAL 2: PUBLIC RESULT CHART MODAL (NO LOGIN REQUIRED) */}
      {/* ========================================================= */}
      <AnimatePresence>
        {activeChart && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/90 backdrop-blur-2xl overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 30 }}
              className="w-full max-w-4xl bg-slate-950 border border-slate-800 rounded-3xl p-4 sm:p-6 shadow-[0_25px_80px_rgba(0,0,0,0.95)] space-y-4 my-auto relative"
            >
              {/* Header with Back Button */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <button
                  onClick={() => {
                    soundManager.playClick();
                    setActiveChart(null);
                  }}
                  className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Back to Home</span>
                </button>

                <div className="text-center">
                  <h3 className="text-base sm:text-lg font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-cyan-400 to-amber-300 uppercase tracking-wider">
                    {activeChart === '2D' && 'SHYAM111 2D RESULT CHART'}
                    {activeChart === '3D' && 'SHYAM111 3D RESULT CHART'}
                    {activeChart === 'L12' && 'SHYAM111 L-12 RESULT CHART'}
                  </h3>
                  <p className="text-[10px] text-slate-400 font-mono">Live Unrestricted Result History</p>
                </div>

                <button
                  onClick={() => {
                    soundManager.playClick();
                    setActiveChart(null);
                  }}
                  className="p-2 rounded-xl bg-slate-900 text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Render Chart View directly without login */}
              <div className="pt-2">
                <LiveResultsView
                  gameType={
                    activeChart === '2D'
                      ? '2D Lottery'
                      : activeChart === '3D'
                      ? '3D Lottery'
                      : 'Lucky 12'
                  }
                />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
