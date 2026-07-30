import React, { useState } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { Gift, Copy, Check, Share2, Users, Coins, Sparkles, ArrowRight } from 'lucide-react';

export const PlayerReferralView: React.FC = () => {
  const { currentUser, referralRecords, addToast } = useAdmin();
  const [copied, setCopied] = useState(false);

  const refCode = currentUser?.referralCode || `REF-${currentUser?.username.toUpperCase() || 'PLAYER'}`;
  const refLink = `${window.location.origin}/?ref=${refCode}`;

  const myReferrals = referralRecords.filter((r) => r.referrerUsername === currentUser?.username);
  const totalEarned = myReferrals.reduce((sum, r) => sum + r.bonusPoints, 0);

  const handleCopy = () => {
    navigator.clipboard.writeText(refLink);
    setCopied(true);
    addToast('Referral Link Copied!', 'Share link with friends to earn ₹200 bonus per invite.', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 animate-slide-in pb-12">
      {/* Referral Hero Banner */}
      <div className="bg-gradient-to-r from-amber-950 via-slate-900 to-slate-900 border border-amber-800/80 p-6 sm:p-8 rounded-3xl shadow-2xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-amber-500/10 to-transparent pointer-events-none" />

        <div className="relative z-10 space-y-4 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-black">
            <Gift className="w-4 h-4 text-amber-400" />
            <span>PLAYER REFERRAL PROGRAM</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-wide leading-tight">
            Invite Friends & Earn <span className="text-amber-400">₹200 Bonus</span> Per Sign Up!
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Every time a friend registers using your unique referral link or code, they get ₹500 welcome bonus and you instantly receive ₹200 credited straight to your wallet.
          </p>

          {/* Referral Link & Code Box */}
          <div className="pt-2 flex flex-col sm:flex-row gap-3">
            <div className="flex-1 bg-slate-950 border border-amber-800/60 rounded-2xl p-3 flex items-center justify-between gap-3">
              <div className="min-w-0">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Your Referral Link</span>
                <span className="text-xs font-mono font-bold text-amber-300 truncate block">{refLink}</span>
              </div>
              <button
                onClick={handleCopy}
                className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center gap-1.5 shrink-0 shadow-md transition-all"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Copied' : 'Copy Link'}</span>
              </button>
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-3 px-5 text-center shrink-0">
              <span className="text-[10px] text-slate-500 uppercase font-bold block">Referral Code</span>
              <span className="text-sm font-black font-mono text-white tracking-widest">{refCode}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/30">
            <Coins className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-bold block">Total Referral Earnings</span>
            <span className="text-2xl font-black text-amber-400 font-mono">₹{totalEarned.toLocaleString()}</span>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0 border border-cyan-500/30">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-bold block">Friends Joined</span>
            <span className="text-2xl font-black text-white font-mono">{myReferrals.length} Players</span>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/30">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-bold block">Bonus Per Referral</span>
            <span className="text-2xl font-black text-emerald-400 font-mono">₹200 Instant</span>
          </div>
        </div>
      </div>

      {/* Referral History Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <Users className="w-5 h-5 text-amber-400" />
          <span>My Referred Friends & Reward Logs</span>
        </h2>

        {myReferrals.length === 0 ? (
          <div className="p-8 text-center bg-slate-950 rounded-2xl border border-slate-800 space-y-3">
            <Gift className="w-10 h-10 text-slate-600 mx-auto" />
            <p className="text-xs text-slate-400">You have not referred any friends yet.</p>
            <button
              onClick={handleCopy}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs inline-flex items-center gap-2"
            >
              <span>Copy Link & Start Inviting</span>
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="p-3">Referred User</th>
                  <th className="p-3">Referral Code Used</th>
                  <th className="p-3">Bonus Earned</th>
                  <th className="p-3">Date Linked</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {myReferrals.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-800/40">
                    <td className="p-3 font-bold text-white">@{r.referredUsername}</td>
                    <td className="p-3 font-mono text-amber-400">{r.referralCode}</td>
                    <td className="p-3 font-mono text-emerald-400 font-bold">+₹{r.bonusPoints}</td>
                    <td className="p-3 text-slate-500 font-mono">{r.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
