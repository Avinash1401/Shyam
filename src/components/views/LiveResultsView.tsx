import React, { useState, useEffect } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { soundManager } from '../../utils/sound';
import { motion, AnimatePresence } from 'motion/react';
import { Radio, Clock, Trophy, Search, Calendar, Filter, Sparkles, Flame, Dices, ArrowUpRight, CheckCircle } from 'lucide-react';

interface LiveResultsViewProps {
  gameType: '2D Lottery' | '3D Lottery' | 'Lucky 12';
}

export const LiveResultsView: React.FC<LiveResultsViewProps> = ({ gameType }) => {
  const { liveResults } = useAdmin();

  // Search, Calendar, and Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [timeFilter, setTimeFilter] = useState('ALL');

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

  // Filter game results for this game type
  const rawResults = liveResults.filter((r) => r.gameType === gameType);

  // Apply Search, Date, and Time Filters
  const filteredResults = rawResults.filter((item) => {
    // Search match
    if (
      searchTerm &&
      !item.drawNumber.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !item.winningResult.toLowerCase().includes(searchTerm.toLowerCase())
    ) {
      return false;
    }
    // Time filter
    if (timeFilter !== 'ALL' && !item.drawTime.includes(timeFilter)) {
      return false;
    }
    return true;
  });

  const latestResult = filteredResults.length > 0 ? filteredResults[0] : null;
  const olderResults = filteredResults.length > 1 ? filteredResults.slice(1) : filteredResults;

  // Helper function to extract A, B, C panel digits for 3D Lottery
  const parse3DResult = (winningStr: string) => {
    const digits = winningStr.replace(/\D/g, '');
    if (digits.length >= 3) {
      return { a: digits[0], b: digits[1], c: digits[2] };
    }
    return { a: winningStr[0] || '5', b: winningStr[1] || '8', c: winningStr[2] || '1' };
  };

  return (
    <div className="space-y-6 pb-12 font-sans selection:bg-cyan-500 selection:text-slate-950">
      
      {/* Top Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-slate-800/80 backdrop-blur-2xl shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 via-purple-500 to-amber-500 opacity-70" />
        <div className="flex items-center gap-4">
          <div className="p-3.5 rounded-2xl bg-cyan-950/80 border border-cyan-500/40 text-cyan-400 shadow-lg shadow-cyan-500/20">
            {gameType === '3D Lottery' ? (
              <Sparkles className="w-7 h-7 animate-spin" style={{ animationDuration: '8s' }} />
            ) : gameType === '2D Lottery' ? (
              <Dices className="w-7 h-7 text-emerald-400" />
            ) : (
              <Flame className="w-7 h-7 text-amber-400 animate-bounce" />
            )}
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-3 tracking-wider uppercase">
              <span>{gameType === '2D Lottery' ? '2D RESULT CHART' : gameType === '3D Lottery' ? '3D RESULT CHART' : 'LUCKY-12 RESULT CHART'}</span>
              <span className="text-xs px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold tracking-widest animate-pulse">
                LIVE
              </span>
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Official declared draw history, real-time winning numbers, and payout statistics.
            </p>
          </div>
        </div>

        {/* Live Round Countdown Pill */}
        <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-950/90 border border-slate-800/90 shadow-inner shrink-0">
          <Clock className="w-5 h-5 text-amber-400 animate-spin" style={{ animationDuration: '6s' }} />
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-bold block leading-none mb-0.5">Next Draw In</span>
            <span className="font-mono font-black text-amber-400 text-lg tracking-widest">{formatTimer(secondsLeft)}</span>
          </div>
        </div>
      </div>

      {/* SEARCH, CALENDAR & FILTER BAR */}
      <div className="p-4 rounded-3xl bg-slate-900/90 border border-slate-800/80 backdrop-blur-2xl grid grid-cols-1 sm:grid-cols-3 gap-3 shadow-2xl">
        
        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search Draw No or Result..."
            className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-2xl py-2.5 pl-10 pr-4 text-xs text-white placeholder-slate-600 focus:outline-none transition-all font-mono"
          />
        </div>

        {/* Calendar Date Picker */}
        <div className="relative">
          <Calendar className="w-4 h-4 text-cyan-400 absolute left-3.5 top-3.5 pointer-events-none" />
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => {
              soundManager.playClick();
              setSelectedDate(e.target.value);
            }}
            className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-2xl py-2.5 pl-10 pr-4 text-xs font-mono font-bold text-slate-200 focus:outline-none cursor-pointer"
          />
        </div>

        {/* Filter Dropdown */}
        <div className="relative">
          <Filter className="w-4 h-4 text-purple-400 absolute left-3.5 top-3.5 pointer-events-none" />
          <select
            value={timeFilter}
            onChange={(e) => {
              soundManager.playClick();
              setTimeFilter(e.target.value);
            }}
            className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-2xl py-2.5 pl-10 pr-4 text-xs font-bold text-slate-200 focus:outline-none cursor-pointer"
          >
            <option value="ALL">All Draw Timeslots</option>
            <option value="AM">Morning Draws (AM)</option>
            <option value="PM">Evening / Night Draws (PM)</option>
          </select>
        </div>

      </div>

      {/* LATEST RESULT HIGHLIGHT CARD */}
      {latestResult && (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-purple-950/60 to-slate-900 border border-purple-500/40 backdrop-blur-2xl shadow-[0_0_30px_rgba(168,85,247,0.15)] relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 bg-amber-400 text-slate-950 text-[10px] font-black uppercase tracking-widest px-4 py-1 rounded-bl-2xl shadow-md">
            LATEST RESULT
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-slate-400 text-xs font-mono font-bold">
                <Calendar className="w-4 h-4 text-cyan-400" />
                <span>Date: {selectedDate}</span>
                <span className="mx-1">•</span>
                <Clock className="w-4 h-4 text-amber-400" />
                <span>Time: {latestResult.drawTime}</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-wide">
                Draw Slot: {latestResult.drawNumber}
              </h2>
            </div>

            {/* Result Value Display */}
            {gameType === '3D Lottery' ? (
              <div className="flex items-center gap-3">
                {(() => {
                  const { a, b, c } = parse3DResult(latestResult.winningResult);
                  return (
                    <div className="flex items-center gap-3">
                      <div className="p-3.5 rounded-2xl bg-cyan-950/90 border border-cyan-400/60 text-center shadow-lg shadow-cyan-500/20">
                        <span className="text-[10px] text-cyan-400 uppercase font-bold block">A RESULT</span>
                        <span className="text-3xl font-mono font-black text-white">{a}</span>
                      </div>
                      <div className="p-3.5 rounded-2xl bg-emerald-950/90 border border-emerald-400/60 text-center shadow-lg shadow-emerald-500/20">
                        <span className="text-[10px] text-emerald-400 uppercase font-bold block">B RESULT</span>
                        <span className="text-3xl font-mono font-black text-white">{b}</span>
                      </div>
                      <div className="p-3.5 rounded-2xl bg-blue-950/90 border border-blue-400/60 text-center shadow-lg shadow-blue-500/20">
                        <span className="text-[10px] text-blue-400 uppercase font-bold block">C RESULT</span>
                        <span className="text-3xl font-mono font-black text-white">{c}</span>
                      </div>
                    </div>
                  );
                })()}
              </div>
            ) : (
              <div className="px-8 py-4 rounded-3xl bg-slate-950/90 border border-amber-400/60 shadow-[0_0_25px_rgba(245,158,11,0.25)] text-center">
                <span className="text-[10px] text-amber-400 uppercase font-extrabold tracking-widest block mb-0.5">
                  WINNING RESULT
                </span>
                <span className="text-4xl sm:text-5xl font-mono font-black text-amber-300 tracking-widest">
                  {latestResult.winningResult}
                </span>
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* OLDER RESULTS HISTORY LIST & TABLE */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-slate-800/80 backdrop-blur-2xl shadow-2xl space-y-5">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-black text-white flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-400" />
            <span>Complete Day Result History ({olderResults.length})</span>
          </h3>
          <span className="text-xs font-mono text-slate-400">Date: {selectedDate}</span>
        </div>

        {olderResults.length === 0 ? (
          <div className="p-8 text-center bg-slate-950/60 rounded-2xl border border-slate-800/80 text-slate-400 text-xs font-mono">
            No declared results found matching your search or date filter.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {olderResults.map((r, idx) => (
              <motion.div
                key={r.id || `res-${idx}`}
                whileHover={{ scale: 1.02, y: -2 }}
                className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3.5 shadow-lg hover:border-cyan-500/40 transition-all relative overflow-hidden"
              >
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="font-bold text-slate-300">{r.drawNumber}</span>
                  <span className="text-slate-400">{r.drawTime}</span>
                </div>

                {gameType === '3D Lottery' ? (
                  <div>
                    {(() => {
                      const { a, b, c } = parse3DResult(r.winningResult);
                      return (
                        <div className="grid grid-cols-3 gap-2 text-center">
                          <div className="p-2 rounded-xl bg-slate-900 border border-cyan-500/30">
                            <span className="text-[9px] text-cyan-400 font-bold block">A</span>
                            <span className="text-xl font-mono font-black text-white">{a}</span>
                          </div>
                          <div className="p-2 rounded-xl bg-slate-900 border border-emerald-500/30">
                            <span className="text-[9px] text-emerald-400 font-bold block">B</span>
                            <span className="text-xl font-mono font-black text-white">{b}</span>
                          </div>
                          <div className="p-2 rounded-xl bg-slate-900 border border-blue-500/30">
                            <span className="text-[9px] text-blue-400 font-bold block">C</span>
                            <span className="text-xl font-mono font-black text-white">{c}</span>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                ) : (
                  <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-center">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block mb-0.5">Declared Result</span>
                    <span className="text-3xl font-black text-amber-400 font-mono tracking-wider">
                      {r.winningResult}
                    </span>
                  </div>
                )}

                <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 pt-2 border-t border-slate-800/80">
                  <span>Wager: ₹{r.totalBets.toLocaleString()}</span>
                  <span className="text-emerald-400 font-bold">Payout: ₹{r.totalPayout.toLocaleString()}</span>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};

