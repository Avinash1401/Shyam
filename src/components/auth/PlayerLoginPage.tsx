import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAdmin } from '../../context/AdminContext';
import { Gamepad2, Lock, UserCheck, Eye, EyeOff, ArrowRight, Gift, KeyRound, Sparkles, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const PlayerLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { loginAsPlayer, isLoggedIn, userRole, isAuthLoading } = useAdmin();

  const [playerIdOrEmail, setPlayerIdOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);

  // If already logged in as player or admin, navigate to correct dashboard
  React.useEffect(() => {
    if (!isAuthLoading && isLoggedIn) {
      if (userRole === 'player') {
        navigate('/player/dashboard', { replace: true });
      } else if (userRole === 'admin') {
        navigate('/admin/dashboard', { replace: true });
      }
    }
  }, [isLoggedIn, userRole, isAuthLoading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!playerIdOrEmail.trim() || !password) {
      setErrorMsg('Please enter your Player ID / Email and Password.');
      return;
    }

    setLoading(true);
    try {
      const res = await loginAsPlayer(playerIdOrEmail.trim(), password);
      setLoading(false);

      if (res.success) {
        if (res.role === 'admin') {
          navigate('/admin/dashboard', { replace: true });
        } else {
          navigate('/player/dashboard', { replace: true });
        }
      } else {
        setErrorMsg(res.message || 'Invalid player credentials.');
      }
    } catch (err: any) {
      setLoading(false);
      setErrorMsg(err.message || 'Login failed.');
    }
  };

  return (
    <div className="min-h-screen bg-[#070a12] text-slate-100 flex items-center justify-center p-4 relative overflow-hidden font-sans selection:bg-cyan-500 selection:text-slate-950">
      {/* Background Neon Glowing Orbs */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-cyan-500/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-purple-600/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-10 right-1/3 w-64 h-64 bg-amber-500/10 rounded-full blur-[100px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="w-full max-w-md bg-slate-900/80 border border-slate-800/90 rounded-3xl p-6 sm:p-8 backdrop-blur-2xl shadow-[0_20px_60px_rgba(0,0,0,0.8)] relative z-10 space-y-6"
      >
        {/* Brand Header with Glassmorphism Logo */}
        <div className="text-center space-y-2">
          <motion.div
            whileHover={{ scale: 1.05, rotate: 2 }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-purple-600 p-[2px] shadow-[0_0_25px_rgba(14,165,233,0.4)] mb-2 cursor-pointer"
            onClick={() => navigate('/')}
          >
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-cyan-400">
              <Gamepad2 className="w-9 h-9 animate-pulse" />
            </div>
          </motion.div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 uppercase drop-shadow-[0_0_15px_rgba(14,165,233,0.4)]">
            SHYAM111 GAME
          </h1>
          <p className="text-xs text-slate-400 font-medium">Official Player Login & Gaming Portal</p>
        </div>

        {/* Welcome Bonus Banner */}
        <div className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-500/15 via-yellow-500/10 to-transparent border border-amber-500/30 flex items-center gap-3 backdrop-blur-md">
          <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 shrink-0 shadow-inner">
            <Gift className="w-5 h-5 animate-bounce" />
          </div>
          <div>
            <p className="text-xs font-black text-amber-300">Player Welcome Bonus ₹500</p>
            <p className="text-[11px] text-slate-400">Instant credit upon successful registration to play 2D, 3D & L-12</p>
          </div>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-semibold text-center"
          >
            {errorMsg}
          </motion.div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Player ID or Email */}
          <div className="space-y-1.5">
            <label className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
              Player ID / Email
            </label>
            <div className="relative">
              <UserCheck className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
              <input
                type="text"
                value={playerIdOrEmail}
                onChange={(e) => setPlayerIdOrEmail(e.target.value)}
                placeholder="Enter Player ID or Email"
                required
                className="w-full bg-slate-950/90 border border-slate-800 rounded-xl py-3 pl-10 pr-4 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all font-mono"
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                Password
              </label>
              <button
                type="button"
                onClick={() => setShowForgotPasswordModal(true)}
                className="text-xs text-amber-400 hover:text-amber-300 hover:underline font-bold transition-colors"
              >
                Forgot Password?
              </button>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full bg-slate-950/90 border border-slate-800 rounded-xl py-3 pl-10 pr-10 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-3.5 text-slate-500 hover:text-slate-300"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Remember Me Checkbox */}
          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300 font-medium select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded bg-slate-950 border-slate-700 text-cyan-500 focus:ring-0 focus:ring-offset-0 cursor-pointer"
              />
              <span>Remember Me</span>
            </label>
            <span className="text-[11px] text-emerald-400 font-mono font-bold flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              256-Bit SSL
            </span>
          </div>

          {/* Login Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-[0_0_25px_rgba(16,185,129,0.3)] disabled:opacity-50 cursor-pointer"
          >
            <span>{loading ? 'Authenticating...' : 'LOGIN TO PLAY'}</span>
            <ArrowRight className="w-4 h-4" />
          </motion.button>
        </form>

        {/* Register Button & Alternate Links */}
        <div className="pt-4 border-t border-slate-800/80 flex flex-col items-center gap-3">
          <p className="text-xs text-slate-400">Don't have a Player Account yet?</p>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/player/register')}
            className="w-full py-2.5 px-4 rounded-xl bg-slate-950 hover:bg-slate-800 border border-cyan-500/40 text-cyan-400 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md"
          >
            <Sparkles className="w-4 h-4" />
            <span>REGISTER NEW PLAYER ACCOUNT</span>
          </motion.button>
        </div>
      </motion.div>

      {/* Forgot Password Modal */}
      <AnimatePresence>
        {showForgotPasswordModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4"
            >
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/30">
                  <KeyRound className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-black text-white">Reset Password</h3>
                  <p className="text-xs text-slate-400">Shyam111 Player Support</p>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                For security reasons, player passwords can be reset via your registered phone number OTP or by contacting your distributor.
              </p>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs font-mono text-cyan-400 text-center">
                Support Helpline: +91 98765 43210
              </div>

              <button
                onClick={() => setShowForgotPasswordModal(false)}
                className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs"
              >
                Close
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

