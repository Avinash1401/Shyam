import React, { useState } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { soundManager } from '../../utils/sound';
import { motion } from 'motion/react';
import {
  User,
  Shield,
  Key,
  Mail,
  Phone,
  Wallet,
  LogOut,
  Gift,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

export const ProfileView: React.FC = () => {
  const { currentUser, playerSession, logout, addToast } = useAdmin();

  // Active user account
  const activeUser = playerSession?.isLoggedIn && playerSession.user ? playerSession.user : currentUser;

  const [name, setName] = useState(activeUser?.name || activeUser?.username || 'Player User');
  const [email, setEmail] = useState(activeUser?.email || `${activeUser?.username || 'player'}@shyam.com`);
  const [phone, setPhone] = useState(activeUser?.phone || '+91 9876543210');

  // Change Password
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    soundManager.playClick();
    addToast('Profile Updated', 'Your profile details have been saved successfully.', 'success');
  };

  const handleSecuritySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    soundManager.playClick();
    if (newPassword && newPassword !== confirmPassword) {
      addToast('Password Mismatch', 'New password and confirmation password do not match.', 'error');
      return;
    }
    soundManager.playBetSuccess();
    addToast('Password Changed', 'Your security password has been updated.', 'success');
    setOldPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      
      {/* Player Header Banner */}
      <div className="bg-slate-900/90 border border-slate-800/80 p-6 sm:p-8 rounded-3xl backdrop-blur-2xl shadow-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center gap-5 relative z-10">
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-purple-600 p-0.5 shadow-xl shadow-cyan-500/20 shrink-0">
            <div className="w-full h-full bg-slate-950 rounded-[22px] flex items-center justify-center text-white font-black text-2xl">
              {(activeUser?.name || activeUser?.username || 'P')[0].toUpperCase()}
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-white tracking-wide">
                {activeUser?.name || activeUser?.username}
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-[10px] font-bold">
                {activeUser?.role || 'Player'}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">@{activeUser?.username}</p>
            <p className="text-xs font-mono text-cyan-400 mt-1">
              Referral Code: <strong className="text-amber-400 font-bold">{activeUser?.referralCode || `REF-${activeUser?.username?.toUpperCase()}`}</strong>
            </p>
          </div>
        </div>

        {/* Action Logout */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            soundManager.playClick();
            logout();
          }}
          className="px-5 py-2.5 rounded-2xl bg-rose-950/60 hover:bg-rose-900/60 border border-rose-800/80 text-rose-300 font-bold text-xs flex items-center gap-2 transition-all shrink-0 self-start sm:self-center"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </motion.button>
      </div>

      {/* Forms Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Edit Profile */}
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-slate-800/80 backdrop-blur-2xl shadow-2xl space-y-5">
          <h3 className="text-base font-black text-white flex items-center gap-2">
            <User className="w-5 h-5 text-cyan-400" />
            <span>Edit Profile Information</span>
          </h3>

          <form onSubmit={handleProfileSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-300 font-bold mb-1">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 text-white rounded-2xl px-4 py-3 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-bold mb-1">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 text-white rounded-2xl px-4 py-3 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-bold mb-1">Mobile Phone Number</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 text-white rounded-2xl px-4 py-3 focus:outline-none"
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-cyan-500/20"
            >
              Save Profile Details
            </motion.button>
          </form>
        </div>

        {/* Change Password */}
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-slate-800/80 backdrop-blur-2xl shadow-2xl space-y-5">
          <h3 className="text-base font-black text-white flex items-center gap-2">
            <Key className="w-5 h-5 text-amber-400" />
            <span>Change Password</span>
          </h3>

          <form onSubmit={handleSecuritySubmit} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-300 font-bold mb-1">Current Password</label>
              <input
                type="password"
                placeholder="••••••••"
                required
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 text-white rounded-2xl px-4 py-3 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-bold mb-1">New Password</label>
              <input
                type="password"
                placeholder="••••••••"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 text-white rounded-2xl px-4 py-3 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-bold mb-1">Confirm New Password</label>
              <input
                type="password"
                placeholder="••••••••"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 text-white rounded-2xl px-4 py-3 focus:outline-none"
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="w-full py-3.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-amber-400/20"
            >
              Update Password
            </motion.button>
          </form>
        </div>

      </div>

    </div>
  );
};
