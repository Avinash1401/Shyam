import React, { useState, useEffect } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { soundManager } from '../../utils/sound';
import { motion } from 'motion/react';
import { Radio, Clock, Trophy, Sparkles, Flame } from 'lucide-react';

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
    <div className="space-y-6 pb-12">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-slate-800/80 backdrop-blur-2xl shadow-2xl">
        <div className="flex items-center gap-4">
          <div className="p-3.5 rounded-2xl bg-cyan-950/80 border border-cyan-500/40 text-cyan-400 shadow-lg shadow-cyan-500/10">
            <Radio className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
              <span>{gameType} Live Draw Center</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold uppercase tracking-wider">
                LIVE
              </span>
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Real-time declared winning numbers, draw schedules, and payout analytics.
            </p>
          </div>
        </div>
      </div>

      {/* Live Timer Stage Box */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-cyan-950/40 to-slate-900 border border-slate-800/80 backdrop-blur-2xl flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl relative overflow-hidden">
        <div className="space-y-2 text-center md:text-left z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-950 text-cyan-400 border border-slate-800 text-xs font-bold">
            <Clock className="w-3 h-3 animate-spin" />
            <span>Next Live Scheduled Round</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-wide">
            {gameType} - Round #9843
          </h2>
          <p className="text-xs text-slate-400">
            Live bets open. Automatic draw execution powered by server RNG.
          </p>
        </div>

        {/* Big Countdown Box */}
        <div className="p-5 rounded-3xl bg-slate-950/90 border border-slate-800 shadow-inner flex items-center gap-4 z-10">
          <div className="text-center">
            <span className="text-[10px] text-slate-500 uppercase font-bold block mb-1">
              Time Remaining
            </span>
            <div className="text-3xl sm:text-4xl font-black font-mono text-cyan-400 tracking-widest bg-cyan-950/60 px-5 py-2.5 rounded-2xl border border-cyan-500/40 shadow-lg shadow-cyan-500/20">
              {formatTimer(secondsLeft)}
            </div>
          </div>
        </div>
      </div>

      {/* Declared Results History Grid */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-slate-800/80 backdrop-blur-2xl shadow-2xl space-y-5">
        <h3 className="text-base font-black text-white flex items-center gap-2">
          <Trophy className="w-5 h-5 text-amber-400" />
          <span>Declared Winning Results History</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {gameResults.map((r) => (
            <motion.div
              key={r.id}
              whileHover={{ scale: 1.02, y: -2 }}
              className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3 shadow-lg hover:border-amber-500/40 transition-all"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-slate-300">{r.drawNumber}</span>
                <span className="text-[10px] text-slate-500 font-mono">{r.drawTime}</span>
              </div>

              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-center relative overflow-hidden">
                <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">
                  Winning Combination / Card
                </span>
                <span className="text-3xl font-black text-amber-400 font-mono tracking-wider">
                  {r.winningResult}
                </span>
              </div>

              <div className="flex justify-between text-xs text-slate-400 font-medium pt-2 border-t border-slate-800/80">
                <span>Total Wager: ₹{r.totalBets.toLocaleString()}</span>
                <span className="text-emerald-400 font-bold">Payout: ₹{r.totalPayout.toLocaleString()}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

    </div>
  );
};
