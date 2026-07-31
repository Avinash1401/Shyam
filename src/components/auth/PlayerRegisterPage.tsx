import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAdmin } from '../../context/AdminContext';
import { Gamepad2, Lock, User, Mail, Phone, Gift, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const PlayerRegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { register, playerSession } = useAdmin();

  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [refCode, setRefCode] = useState('');

  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  // If already logged in as player, redirect to /player/dashboard
  React.useEffect(() => {
    if (playerSession?.isLoggedIn) {
      navigate('/player/dashboard', { replace: true });
    }
  }, [playerSession, navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!name.trim() || !username.trim() || !password || !phone) {
      setErrorMsg('Please fill in all required fields.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const res = register(name, username, password, email, phone, refCode);
      setLoading(false);

      if (res.success) {
        navigate('/player/dashboard', { replace: true });
      } else {
        setErrorMsg(res.message);
      }
    }, 400);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4 relative overflow-hidden font-sans">
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl relative z-10 space-y-5 my-8">
        <div className="text-center space-y-1">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 mb-1">
            <Gamepad2 className="w-7 h-7" />
          </div>
          <h1 className="text-xl font-black text-white">Create Player Account</h1>
          <p className="text-xs text-slate-400">Join Shyam Game & Receive ₹500 Free Bonus</p>
        </div>

        {errorMsg && (
          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-semibold text-center">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div className="space-y-1">
            <label className="text-[11px] font-bold uppercase text-slate-400">Full Name *</label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Rahul Kumar"
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 pl-10 pr-4 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-amber-500/50"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-bold uppercase text-slate-400">Username *</label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="rahul_gamer"
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 pl-10 pr-4 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-amber-500/50"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[11px] font-bold uppercase text-slate-400">Mobile Phone *</label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="9876543210"
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 pl-9 pr-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-amber-500/50"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold uppercase text-slate-400">Email (Optional)</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="rahul@gmail.com"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 pl-9 pr-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-amber-500/50"
                />
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-bold uppercase text-slate-400">Password *</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 pl-10 pr-4 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-amber-500/50"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-bold uppercase text-slate-400">Referral Code (Optional)</label>
            <div className="relative">
              <Gift className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              <input
                type="text"
                value={refCode}
                onChange={(e) => setRefCode(e.target.value)}
                placeholder="REF-USER123"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 pl-10 pr-4 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-amber-500/50"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-extrabold text-xs flex items-center justify-center gap-2 hover:from-amber-400 hover:to-amber-500 transition-all shadow-md shadow-amber-500/20 active:scale-[0.99] disabled:opacity-50 cursor-pointer"
          >
            <span>{loading ? 'Registering...' : 'CREATE ACCOUNT & CLAIM ₹500'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="pt-3 border-t border-slate-800 text-center text-xs text-slate-400">
          Already registered?{' '}
          <Link to="/player/login" className="text-amber-400 font-bold hover:underline">
            Player Login
          </Link>
        </div>
      </div>
    </div>
  );
};
