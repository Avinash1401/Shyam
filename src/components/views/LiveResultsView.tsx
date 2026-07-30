import React, { useState, useEffect } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { PlayCircle, Radio, Clock, Trophy, RefreshCw, Calendar, Sparkles } from 'lucide-react';

interface LiveResultsViewProps {
  gameType: '2D Lottery' | '3D Lottery' | 'Lucky 12';
}

export const LiveResultsView: React.FC<LiveResultsViewProps> = ({ gameType }) => {
  const { liveResults } = useAdmin();

  // Countdown timer simulation
  const [secondsLeft, setSecondsLeft] = useState(142);

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 180));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const gameResults = liveResults.filter((r) => r.gameType === gameType);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-900 border border-slate-800">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-cyan-950/80 border border-cyan-800/60 text-cyan-400">
            <Radio className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white flex items-center gap-2">
              <span>{gameType} Live Result Stream</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800 font-bold">
                Live Stream Active
              </span>
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Live draw results feed, upcoming draw countdown, and payout statistics.
            </p>
          </div>
        </div>
      </div>

      {/* Live Timer Stage Box */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-cyan-950/40 to-slate-900 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
        <div className="space-y-2 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-950 text-cyan-400 border border-slate-800 text-xs font-semibold">
            <Clock className="w-3.5 h-3.5" />
            <span>Next Scheduled Live Draw</span>
          </div>
          <h2 className="text-2xl font-black text-white">{gameType} - Round #9843</h2>
          <p className="text-xs text-slate-400">
            Accepting bets across all SuperDistributer, Distributer & Retailer terminals.
          </p>
        </div>

        {/* Big Countdown Box */}
        <div className="p-4 rounded-2xl bg-slate-950/90 border border-slate-800 shadow-inner flex items-center gap-4">
          <div className="text-center">
            <span className="text-[10px] text-slate-500 uppercase font-bold block mb-1">
              Next Draw In
            </span>
            <div className="text-3xl font-black font-mono text-cyan-400 tracking-widest bg-cyan-950/60 px-4 py-2 rounded-xl border border-cyan-800/60">
              {formatTimer(secondsLeft)}
            </div>
          </div>
        </div>
      </div>

      {/* Draw History Grid */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Trophy className="w-5 h-5 text-amber-400" />
          <span>Declared Results History</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {gameResults.map((r) => (
            <div
              key={r.id}
              className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400">{r.drawNumber}</span>
                <span className="text-[10px] text-slate-500 font-mono">{r.drawTime}</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-center">
                <span className="text-[10px] text-slate-500 uppercase font-bold block mb-1">
                  Winning Number
                </span>
                <span className="text-2xl font-black text-amber-400 font-mono">
                  {r.winningResult}
                </span>
              </div>

              <div className="flex justify-between text-xs text-slate-400 font-medium pt-1 border-t border-slate-800/80">
                <span>Bets: ₹{r.totalBets.toLocaleString()}</span>
                <span className="text-purple-400">Payout: ₹{r.totalPayout.toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
