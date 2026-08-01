import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAdmin } from '../../context/AdminContext';
import { Shield, Key, Lock, Mail, Eye, EyeOff, ArrowRight } from 'lucide-react';

export const AdminLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { loginAsAdmin, isLoggedIn, userRole, isAuthLoading } = useAdmin();

  const [email, setEmail] = useState('admin@shyampanel.com');
  const [password, setPassword] = useState('Admin@123');
  const [pin, setPin] = useState('1234');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  // If already logged in as Admin, navigate to /admin/dashboard
  React.useEffect(() => {
    if (!isAuthLoading && isLoggedIn) {
      if (userRole === 'admin') {
        navigate('/admin/dashboard', { replace: true });
      }
    }
  }, [isLoggedIn, userRole, isAuthLoading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email.trim() || !password || !pin) {
      setErrorMsg('Please enter Admin Email, Password, and Security PIN.');
      return;
    }

    if (!email.includes('@')) {
      setErrorMsg('Invalid Email Address');
      return;
    }

    setLoading(true);
    try {
      const res = await loginAsAdmin(email.trim(), password, pin.trim());
      setLoading(false);

      if (res.success) {
        if (res.role === 'admin') {
          navigate('/admin/dashboard', { replace: true });
        } else {
          navigate('/player/dashboard', { replace: true });
        }
      } else {
        setErrorMsg(res.message || 'Invalid admin credentials or authorization failed.');
      }
    } catch (err: any) {
      setLoading(false);
      setErrorMsg(err.message || 'Login failed.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Background ambient glows */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl relative z-10 space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 mb-1 shadow-lg shadow-cyan-500/10">
            <Shield className="w-8 h-8" />
          </div>
          <h1 className="text-xl font-black tracking-tight text-white flex items-center justify-center gap-2">
            <span>🛡️ ADMIN PORTAL LOGIN</span>
          </h1>
          <p className="text-xs text-slate-400">Master Control & Distribution Management</p>
        </div>

        {/* Security Notice */}
        <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs space-y-1">
          <div className="flex items-center gap-2 font-bold text-cyan-400">
            <Key className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>Master Admin Credentials:</span>
          </div>
          <div className="font-mono text-[11px] text-slate-300 pl-6 space-y-0.5">
            <div>Email: <span className="text-cyan-300 font-bold">admin@shyampanel.com</span></div>
            <div>Password: <span className="text-amber-300 font-bold">Admin@123</span></div>
            <div>PIN: <span className="text-cyan-300 font-bold">1234</span></div>
          </div>
          <p className="text-[10px] text-slate-400 pl-6 pt-0.5">
            * Mandatory password change enforced on first login.
          </p>
        </div>

        {errorMsg && (
          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-semibold text-center animate-shake">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Admin Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@shyampanel.com"
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all font-mono"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-10 pr-10 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all"
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

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Master Security PIN</label>
              <span className="text-[10px] text-cyan-400 font-mono">Default PIN: 1234</span>
            </div>
            <div className="relative">
              <Key className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
              <input
                type="password"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="1234"
                maxLength={6}
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all font-mono tracking-widest"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-extrabold text-sm flex items-center justify-center gap-2 hover:from-cyan-400 hover:to-blue-500 transition-all shadow-lg shadow-cyan-500/20 active:scale-[0.99] disabled:opacity-50 cursor-pointer"
          >
            <span>{loading ? 'Authenticating...' : 'AUTHENTICATE ADMIN'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="pt-4 border-t border-slate-800 text-center text-xs text-slate-400 flex flex-col items-center gap-2">
          <span>Are you a Player?</span>
          <Link to="/player/login" className="text-amber-400 font-bold hover:underline flex items-center gap-1">
            <span>Go to Player Gaming Portal</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
};
