import React, { useState } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { Lock, ShieldAlert, KeyRound, ArrowRight } from 'lucide-react';

export const ForcePasswordChangeModal: React.FC = () => {
  const { changeAdminPassword } = useAdmin();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!newPassword || !confirmPassword) {
      setErrorMsg('Please enter and confirm your new admin password.');
      return;
    }

    if (newPassword.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }

    if (newPassword === 'ChangeMe@123') {
      setErrorMsg('New password cannot be the default password (ChangeMe@123).');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMsg('Passwords do not match. Please try again.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const res = changeAdminPassword(newPassword);
      setLoading(false);
      if (!res.success) {
        setErrorMsg(res.message || 'Failed to update password.');
      }
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-md bg-slate-900 border border-amber-500/30 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6 relative overflow-hidden">
        <div className="absolute -top-20 -right-20 w-48 h-48 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 mb-1">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-black text-white tracking-tight">MANDATORY PASSWORD CHANGE</h2>
          <p className="text-xs text-slate-400">
            For security compliance, you must change the default Admin password (<span className="text-amber-400 font-mono">ChangeMe@123</span>) before accessing the Master Admin Dashboard.
          </p>
        </div>

        {errorMsg && (
          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-semibold text-center">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">New Admin Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new strong password"
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-amber-500/50"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Confirm New Password</label>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter new password"
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-amber-500/50"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-extrabold text-sm flex items-center justify-center gap-2 hover:from-amber-400 hover:to-amber-500 transition-all shadow-lg shadow-amber-500/20 cursor-pointer disabled:opacity-50"
          >
            <span>{loading ? 'Updating Password...' : 'UPDATE PASSWORD & PROCEED'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
