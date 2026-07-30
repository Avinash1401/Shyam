import React, { useState } from 'react';
import { useAdmin } from '../../context/AdminContext';
import {
  Wallet,
  Coins,
  Copy,
  Check,
  LogOut,
  User,
  Shield,
  HelpCircle,
  Gift,
  ArrowUpRight,
  ArrowDownRight,
  Gamepad2,
  ChevronDown,
  Bell,
} from 'lucide-react';

export const PlayerHeader: React.FC = () => {
  const { currentUser, logout, switchSessionRole, setCurrentPage, addToast } = useAdmin();
  const [copiedLink, setCopiedLink] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const referralCode = currentUser?.referralCode || `REF-${currentUser?.username.toUpperCase() || 'PLAYER'}`;
  const referralLink = `${window.location.origin}/?ref=${referralCode}`;

  const copyRefLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopiedLink(true);
    addToast('Referral Link Copied!', 'Share with friends to earn bonus rewards.', 'success');
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <header className="sticky top-0 z-30 h-16 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-4 lg:px-6 flex items-center justify-between gap-4">
      {/* Brand & Quick Nav */}
      <div className="flex items-center gap-3">
        <div
          onClick={() => setCurrentPage('user_game_portal')}
          className="flex items-center gap-2.5 cursor-pointer group"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold shadow-md shadow-cyan-500/20">
            <Gamepad2 className="w-5 h-5" />
          </div>
          <div>
            <span className="text-sm font-black text-white tracking-wide block leading-none">
              SHYAM PLAYER
            </span>
            <span className="text-[10px] text-cyan-400 font-semibold leading-none">
              Game Portal
            </span>
          </div>
        </div>
      </div>

      {/* Right Controls: Wallet Balance, Referral Copy, Profile */}
      <div className="flex items-center gap-3">
        {/* Wallet Balance Badge */}
        <div
          onClick={() => setCurrentPage('player_wallet')}
          className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-cyan-800 transition-all cursor-pointer shadow-sm"
        >
          <Wallet className="w-4 h-4 text-emerald-400" />
          <div>
            <span className="text-[9px] text-slate-500 uppercase font-semibold block leading-none">
              Wallet Balance
            </span>
            <span className="text-sm font-black text-emerald-400 font-mono leading-none">
              ₹{(currentUser?.points || 0).toLocaleString()}
            </span>
          </div>
        </div>

        {/* Quick Deposit & Withdrawal Buttons */}
        <div className="hidden sm:flex items-center gap-1.5">
          <button
            onClick={() => setCurrentPage('player_deposit')}
            className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs flex items-center gap-1 shadow-md shadow-emerald-500/10 transition-all"
          >
            <ArrowDownRight className="w-3.5 h-3.5" />
            <span>Deposit</span>
          </button>
          <button
            onClick={() => setCurrentPage('player_withdrawal')}
            className="px-3 py-1.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-200 font-bold text-xs flex items-center gap-1 transition-all"
          >
            <ArrowUpRight className="w-3.5 h-3.5 text-amber-400" />
            <span>Withdraw</span>
          </button>
        </div>

        {/* Referral Link Quick Copy Button */}
        <button
          onClick={copyRefLink}
          className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-950/60 border border-amber-800/80 text-amber-300 text-xs font-bold hover:bg-amber-900/60 transition-all"
          title="Copy Referral Link"
        >
          <Gift className="w-3.5 h-3.5 text-amber-400" />
          <span>{copiedLink ? 'Copied!' : 'Refer & Earn'}</span>
          {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5 text-amber-400" />}
        </button>

        {/* Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-800 transition-colors"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold text-xs">
              {(currentUser?.name || 'P')[0].toUpperCase()}
            </div>
            <div className="hidden sm:block text-left">
              <span className="text-xs font-bold text-white block leading-none">
                {currentUser?.name || 'Player User'}
              </span>
              <span className="text-[10px] text-cyan-400 font-medium leading-none">
                @{currentUser?.username || 'player'}
              </span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-2 z-50 animate-slide-in space-y-1">
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 mb-1">
                <p className="text-xs font-bold text-white">{currentUser?.name}</p>
                <p className="text-[10px] text-slate-400">Ref Code: {referralCode}</p>
              </div>

              <button
                onClick={() => {
                  setCurrentPage('profile');
                  setDropdownOpen(false);
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <User className="w-4 h-4 text-cyan-400" />
                <span>My Profile</span>
              </button>

              <button
                onClick={() => {
                  setCurrentPage('player_referral');
                  setDropdownOpen(false);
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-amber-300 hover:bg-slate-800 transition-colors"
              >
                <Gift className="w-4 h-4 text-amber-400" />
                <span>Referral Earnings</span>
              </button>

              {/* Demo Switch to Admin View */}
              <button
                onClick={() => {
                  switchSessionRole('Admin');
                  setDropdownOpen(false);
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-cyan-400 hover:bg-slate-800 transition-colors font-bold border border-cyan-900/50"
              >
                <Shield className="w-4 h-4" />
                <span>Switch to Admin Panel</span>
              </button>

              <button
                onClick={() => {
                  logout();
                  setDropdownOpen(false);
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-rose-400 hover:bg-rose-950/40 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Log Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
