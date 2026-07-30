import React from 'react';
import { useAdmin } from '../../context/AdminContext';
import { Gift, Users, Coins, TrendingUp, Sparkles } from 'lucide-react';

export const AdminReferralsView: React.FC = () => {
  const { referralRecords } = useAdmin();

  const totalBonusPaid = referralRecords.reduce((sum, r) => sum + r.bonusPoints, 0);

  return (
    <div className="space-y-6 animate-slide-in pb-12">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-white flex items-center gap-2">
            <Gift className="w-6 h-6 text-amber-400" />
            <span>Referral Program & Signup Bonus Analytics</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Monitor player referral links, inviter bonus payouts, and registration conversions.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-amber-950/60 border border-amber-800/80 px-4 py-2.5 rounded-2xl">
          <Coins className="w-5 h-5 text-amber-400" />
          <div>
            <span className="text-[10px] text-amber-300 uppercase font-bold block leading-none">Total Bonuses Distributed</span>
            <span className="text-lg font-black font-mono text-amber-400 leading-none">₹{totalBonusPaid.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Referral History Logs */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
        <h2 className="text-sm font-bold text-white flex items-center gap-2">
          <Users className="w-4 h-4 text-cyan-400" />
          <span>Referral Sign Up Ledger</span>
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
              <tr>
                <th className="p-3">Ref Record ID</th>
                <th className="p-3">Inviter (Referrer)</th>
                <th className="p-3">New Player (Referred)</th>
                <th className="p-3">Code Used</th>
                <th className="p-3">Bonus Payout</th>
                <th className="p-3">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {referralRecords.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-6 text-center text-slate-500">
                    No referral conversion records logged yet.
                  </td>
                </tr>
              ) : (
                referralRecords.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-800/40">
                    <td className="p-3 font-mono font-bold text-white">{r.id}</td>
                    <td className="p-3 font-bold text-amber-400">@{r.referrerUsername}</td>
                    <td className="p-3 font-bold text-cyan-400">@{r.referredUsername}</td>
                    <td className="p-3 font-mono text-slate-300">{r.referralCode}</td>
                    <td className="p-3 font-mono text-emerald-400 font-bold">+₹{r.bonusPoints}</td>
                    <td className="p-3 text-slate-500 font-mono">{r.date}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
