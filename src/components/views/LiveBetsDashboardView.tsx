import React from 'react';
import { LiveBetsTable } from '../common/LiveBetsTable';
import { Crown, Sparkles } from 'lucide-react';

export const LiveBetsDashboardView: React.FC = () => {
  return (
    <div className="space-y-6 animate-fade-in text-slate-100">
      {/* BRANDING TOP HEADER */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#0F172A] via-[#1E293B] to-[#0F172A] border border-amber-500/20 p-5 shadow-2xl">
        <div className="flex items-center justify-between gap-4 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 via-amber-400 to-yellow-500 p-0.5 shadow-xl shadow-amber-500/20">
              <div className="w-full h-full bg-[#0F172A] rounded-[14px] flex items-center justify-center">
                <Crown className="w-6 h-6 text-amber-400 animate-pulse" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl md:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-amber-300 to-yellow-200">
                  Shyam111 Admin Panel
                </h1>
                <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-black uppercase">
                  LIVE BETS
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Real-Time Live Players Bet Monitor & Multi-Category Wager Ledger
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* LIVE BETS TABLE DASHBOARD */}
      <LiveBetsTable />
    </div>
  );
};
