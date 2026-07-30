import React, { useState, useEffect } from 'react';
import { useAdmin } from '../../context/AdminContext';
import {
  UserCheck,
  UserPlus,
  Users,
  User,
  Ticket,
  Radio,
  Trophy,
  ArrowUpRight,
  TrendingUp,
  Coins,
  ShieldAlert,
  PlayCircle,
  Plus,
  ChevronRight,
  Sparkles,
  Lock,
  Unlock,
  Play,
  Pause,
  RefreshCw,
  Sliders,
  Clock,
  DollarSign,
  Activity,
  Key,
  X,
  CheckCircle2,
  AlertTriangle,
  Zap,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';
import { GameControlConfig } from '../../types';

const chartData = [
  { time: '06:00', bet: 12000, payout: 9500, profit: 2500 },
  { time: '08:00', bet: 28000, payout: 21000, profit: 7000 },
  { time: '10:00', bet: 45000, payout: 38000, profit: 7000 },
  { time: '12:00', bet: 72000, payout: 56000, profit: 16000 },
  { time: '14:00', bet: 98000, payout: 79000, profit: 19000 },
  { time: '16:00', bet: 129332, payout: 98000, profit: 31332 },
];

const gameDistributionData = [
  { name: '2D Lottery', bets: 54200, color: '#00f0ff' },
  { name: '3D Lottery', bets: 42100, color: '#a855f7' },
  { name: 'Lucky 12', bets: 23032, color: '#f59e0b' },
  { name: '12 Card', bets: 10000, color: '#10b981' },
];

export const DashboardView: React.FC = () => {
  const {
    superDistributers,
    distributers,
    retailers,
    users,
    onlinePlayers,
    gameTickets,
    setCurrentPage,
    liveResults,
    activityLogs,
    gameControls,
    liveBetIn,
    liveBetOut,
    todayProfitLoss,
    systemWalletBalance,
    toggleGameStatus,
    toggleBettingLock,
    toggleResultMode,
    updateGameControl,
    declareWinningResult,
    verifyAdminPin,
    addToast,
    transactions,
  } = useAdmin();

  // Settings Modal State
  const [editingGame, setEditingGame] = useState<GameControlConfig | null>(null);
  const [tempDuration, setTempDuration] = useState(120);
  const [tempMinBet, setTempMinBet] = useState(10);
  const [tempMaxBet, setTempMaxBet] = useState(10000);
  const [tempPayout, setTempPayout] = useState(90);

  // Result Declaration Pin Modal State
  const [declareModalOpen, setDeclareModalOpen] = useState(false);
  const [selectedDeclareGame, setSelectedDeclareGame] = useState<
    '2D Lottery' | '3D Lottery' | 'Lucky 12' | '12 Card'
  >('2D Lottery');
  const [declareValue, setDeclareValue] = useState('');
  const [inputPin, setInputPin] = useState('');
  const [pinError, setPinError] = useState(false);

  // Live Auto-Refresh Pulse Counter
  const [refreshPulse, setRefreshPulse] = useState(0);

  useEffect(() => {
    const pulseTimer = setInterval(() => {
      setRefreshPulse((p) => (p + 1) % 100);
    }, 2000);
    return () => clearInterval(pulseTimer);
  }, []);

  const handleOpenSettings = (gc: GameControlConfig) => {
    setEditingGame(gc);
    setTempDuration(gc.roundDurationSeconds);
    setTempMinBet(gc.minBet);
    setTempMaxBet(gc.maxBet);
    setTempPayout(gc.payoutPercentage);
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingGame) {
      updateGameControl(editingGame.gameType, {
        roundDurationSeconds: tempDuration,
        minBet: tempMinBet,
        maxBet: tempMaxBet,
        payoutPercentage: tempPayout,
      });
      setEditingGame(null);
    }
  };

  const handleOpenDeclareModal = (gameType: '2D Lottery' | '3D Lottery' | 'Lucky 12' | '12 Card') => {
    setSelectedDeclareGame(gameType);
    setDeclareValue('');
    setInputPin('');
    setPinError(false);
    setDeclareModalOpen(true);
  };

  const handleConfirmDeclare = (e: React.FormEvent) => {
    e.preventDefault();
    if (!verifyAdminPin(inputPin)) {
      setPinError(true);
      addToast('Security PIN Invalid', 'Please enter correct Admin Master Security PIN (e.g. 1234)', 'error');
      return;
    }

    if (!declareValue) {
      addToast('Missing Value', 'Please enter a winning result value.', 'error');
      return;
    }

    const currentGc = gameControls.find((g) => g.gameType === selectedDeclareGame);
    const roundNo = currentGc ? currentGc.currentRoundNo : 'DRW-9900';

    declareWinningResult(selectedDeclareGame, roundNo, declareValue, 'superadmin');
    setDeclareModalOpen(false);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Banner Header with Real-Time Stream Status */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-cyan-950/40 to-slate-900 border border-slate-800 p-6 shadow-2xl">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-cyan-500/10 via-transparent to-transparent pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950/80 text-cyan-400 border border-cyan-800/80 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5 animate-spin text-cyan-400" />
                <span>Shyam Panel Real-Time Engine</span>
              </span>

              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-950/80 text-emerald-400 border border-emerald-800/80 text-xs font-mono font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>AJAX LIVE STREAM (2s)</span>
              </span>
            </div>

            <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              Shyam Gaming Master Dashboard
            </h1>
            <p className="text-xs md:text-sm text-slate-400 mt-1 max-w-2xl">
              Live bet streaming, instant manual/auto result control, risk liability management, and financial ledger.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => handleOpenDeclareModal('2D Lottery')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/20 transition-all hover:scale-[1.02]"
            >
              <Trophy className="w-4 h-4" />
              <span>Manual Result Declare</span>
            </button>

            <button
              onClick={() => setCurrentPage('win_percentage')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition-all"
            >
              <Sliders className="w-4 h-4 text-cyan-400" />
              <span>RTP & Limits</span>
            </button>
          </div>
        </div>
      </div>

      {/* SECTION 1: REQUIRED 7 DASHBOARD WIDGETS */}
      <div className="space-y-2">
        <h2 className="text-sm font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
          <Activity className="w-4 h-4 text-cyan-400" />
          <span>Real-Time Core Performance Widgets</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-3">
          {/* Widget 1: Live Bet In */}
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">
                1. Live Bet In
              </span>
              <div className="p-1.5 rounded-lg bg-cyan-950 text-cyan-400 border border-cyan-800/60">
                <Ticket className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="text-xl font-black text-cyan-400">₹{liveBetIn.toLocaleString()}</div>
            <p className="text-[10px] text-slate-500 mt-1">Pending active round wagers</p>
          </div>

          {/* Widget 2: Live Bet Out */}
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">
                2. Live Bet Out
              </span>
              <div className="p-1.5 rounded-lg bg-purple-950 text-purple-400 border border-purple-800/60">
                <Trophy className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="text-xl font-black text-purple-400">₹{liveBetOut.toLocaleString()}</div>
            <p className="text-[10px] text-slate-500 mt-1">Winning payouts distributed</p>
          </div>

          {/* Widget 3: Current Round */}
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">
                3. Current Round
              </span>
              <div className="p-1.5 rounded-lg bg-amber-950 text-amber-400 border border-amber-800/60">
                <Zap className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="text-sm font-black font-mono text-amber-300">
              {gameControls[0]?.currentRoundNo || 'DRW-2D-9845'}
            </div>
            <p className="text-[10px] text-slate-500 mt-1">Primary active draw ID</p>
          </div>

          {/* Widget 4: Countdown Timer */}
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">
                4. Timer
              </span>
              <div className="p-1.5 rounded-lg bg-emerald-950 text-emerald-400 border border-emerald-800/60">
                <Clock className="w-3.5 h-3.5 animate-spin" />
              </div>
            </div>
            <div className="text-xl font-black font-mono text-emerald-400">
              {gameControls[0]?.secondsRemaining || 0}s
            </div>
            <p className="text-[10px] text-slate-500 mt-1">Time to round draw</p>
          </div>

          {/* Widget 5: Online Users */}
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">
                5. Online Users
              </span>
              <div className="p-1.5 rounded-lg bg-rose-950 text-rose-400 border border-rose-800/60">
                <Radio className="w-3.5 h-3.5 animate-pulse" />
              </div>
            </div>
            <div className="text-xl font-black text-rose-400">{onlinePlayers.length}</div>
            <p className="text-[10px] text-slate-500 mt-1">Live connected players</p>
          </div>

          {/* Widget 6: Wallet Balance Summary */}
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">
                6. Wallet Total
              </span>
              <div className="p-1.5 rounded-lg bg-blue-950 text-blue-400 border border-blue-800/60">
                <DollarSign className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="text-lg font-black text-blue-400 truncate">
              ₹{systemWalletBalance.toLocaleString()}
            </div>
            <p className="text-[10px] text-slate-500 mt-1">System user liquidity</p>
          </div>

          {/* Widget 7: Today's Profit / Loss */}
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">
                7. Today P/L
              </span>
              <div className="p-1.5 rounded-lg bg-emerald-950 text-emerald-400 border border-emerald-800/60">
                <TrendingUp className="w-3.5 h-3.5" />
              </div>
            </div>
            <div
              className={`text-lg font-black ${
                todayProfitLoss >= 0 ? 'text-emerald-400' : 'text-rose-400'
              }`}
            >
              ₹{todayProfitLoss.toLocaleString()}
            </div>
            <p className="text-[10px] text-slate-500 mt-1">Net house profit/loss</p>
          </div>
        </div>
      </div>

      {/* SECTION 2: LIVE GAME CONTROL PANELS (Start/Stop, Betting Lock, Timing, Result Mode) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <Sliders className="w-4 h-4 text-amber-400" />
            <span>Game Controls & Result Declaration Engine</span>
          </h2>
          <span className="text-xs text-slate-400">
            Real-time control switches for 2D, 3D, Lucky 12 & 12 Card
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {gameControls.map((gc) => (
            <div
              key={gc.gameType}
              className={`p-5 rounded-2xl bg-slate-900 border transition-all space-y-4 shadow-xl ${
                gc.status === 'Stopped'
                  ? 'border-rose-900/60 bg-rose-950/10'
                  : gc.bettingLocked
                  ? 'border-amber-900/60 bg-amber-950/10'
                  : 'border-slate-800'
              }`}
            >
              {/* Header Info */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                    <span>{gc.gameType}</span>
                    {gc.status === 'Stopped' && (
                      <span className="text-[10px] px-2 py-0.5 rounded bg-rose-950 text-rose-400 border border-rose-800 font-bold">
                        STOPPED
                      </span>
                    )}
                  </h3>
                  <span className="text-[11px] font-mono text-cyan-400 font-bold block mt-0.5">
                    {gc.currentRoundNo}
                  </span>
                </div>

                {/* Mode Badge (Manual vs Auto) */}
                <button
                  type="button"
                  onClick={() => toggleResultMode(gc.gameType)}
                  className={`px-2.5 py-1 rounded-xl text-xs font-bold border transition-all ${
                    gc.mode === 'Auto'
                      ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40 hover:bg-cyan-500/30'
                      : 'bg-amber-500/20 text-amber-400 border-amber-500/40 hover:bg-amber-500/30'
                  }`}
                  title="Click to toggle Manual vs Automatic Mode"
                >
                  Mode: {gc.mode}
                </button>
              </div>

              {/* Timer Ring & Quick Stats */}
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-bold block">
                    Round Countdown
                  </span>
                  <div className="text-xl font-mono font-black text-white flex items-center gap-2">
                    <span className={gc.secondsRemaining <= 10 ? 'text-rose-400 animate-pulse' : 'text-emerald-400'}>
                      {gc.secondsRemaining}s
                    </span>
                    <span className="text-[10px] text-slate-500 font-normal">/ {gc.roundDurationSeconds}s</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-slate-500 uppercase font-bold block">
                    Payout % (RTP)
                  </span>
                  <span className="text-sm font-extrabold text-amber-400">{gc.payoutPercentage}%</span>
                </div>
              </div>

              {/* Betting Limits Summary */}
              <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-400">
                <div className="p-2 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="text-[9px] text-slate-500 block">MIN BET</span>
                  <span className="font-bold text-slate-200">₹{gc.minBet}</span>
                </div>
                <div className="p-2 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="text-[9px] text-slate-500 block">MAX BET</span>
                  <span className="font-bold text-slate-200">₹{gc.maxBet.toLocaleString()}</span>
                </div>
              </div>

              {/* Quick Action Control Buttons */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                {/* Start / Stop Toggle */}
                <button
                  type="button"
                  onClick={() => toggleGameStatus(gc.gameType)}
                  className={`flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                    gc.status === 'Active'
                      ? 'bg-rose-950/80 hover:bg-rose-900 text-rose-300 border border-rose-800'
                      : 'bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 border border-emerald-800'
                  }`}
                >
                  {gc.status === 'Active' ? (
                    <>
                      <Pause className="w-3.5 h-3.5" /> Stop Game
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5" /> Start Game
                    </>
                  )}
                </button>

                {/* Lock / Unlock Betting */}
                <button
                  type="button"
                  onClick={() => toggleBettingLock(gc.gameType)}
                  className={`flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                    gc.bettingLocked
                      ? 'bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 border border-emerald-800'
                      : 'bg-amber-950/80 hover:bg-amber-900 text-amber-300 border border-amber-800'
                  }`}
                >
                  {gc.bettingLocked ? (
                    <>
                      <Unlock className="w-3.5 h-3.5" /> Unlock Bet
                    </>
                  ) : (
                    <>
                      <Lock className="w-3.5 h-3.5" /> Lock Bet
                    </>
                  )}
                </button>
              </div>

              {/* Declare & Edit Settings Row */}
              <div className="flex items-center gap-2 border-t border-slate-800 pt-3">
                <button
                  type="button"
                  onClick={() => handleOpenDeclareModal(gc.gameType)}
                  className="flex-1 py-2 px-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-md shadow-amber-500/20 text-center"
                >
                  Declare Result
                </button>

                <button
                  type="button"
                  onClick={() => handleOpenSettings(gc)}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700"
                  title="Configure timing & limits"
                >
                  <Sliders className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Analytics & Real-Time Chart Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Hourly Turnover & Payout Chart */}
        <div className="lg:col-span-2 p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-cyan-400" />
                <span>Today's Turnover & Profit Metrics</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Real-time play wager tracking vs payout distribution
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="flex items-center gap-1.5 text-cyan-400 font-medium">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" /> Bet Wager
              </span>
              <span className="flex items-center gap-1.5 text-purple-400 font-medium">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-400" /> Payout
              </span>
            </div>
          </div>

          <div className="h-64 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorBet" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00f0ff" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#00f0ff" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorPayout" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#a855f7" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="time" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} tickFormatter={(v) => `₹${v / 1000}k`} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '12px',
                    fontSize: '12px',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="bet"
                  stroke="#00f0ff"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorBet)"
                />
                <Area
                  type="monotone"
                  dataKey="payout"
                  stroke="#a855f7"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorPayout)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-3 gap-3 pt-3 border-t border-slate-800 text-center">
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
              <span className="text-[10px] text-slate-500 uppercase font-semibold block">
                Total Wager
              </span>
              <span className="text-sm font-bold text-cyan-400">
                ₹{liveBetIn.toLocaleString()}
              </span>
            </div>
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
              <span className="text-[10px] text-slate-500 uppercase font-semibold block">
                Total Payout
              </span>
              <span className="text-sm font-bold text-purple-400">
                ₹{liveBetOut.toLocaleString()}
              </span>
            </div>
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
              <span className="text-[10px] text-slate-500 uppercase font-semibold block">
                Net Profit
              </span>
              <span className="text-sm font-bold text-emerald-400">
                ₹{todayProfitLoss.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Live Transaction Feed */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Activity className="w-5 h-5 text-emerald-400" />
                <span>Live Transaction Stream</span>
              </h3>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                LIVE
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">Real-time ledger updates across all terminals</p>
          </div>

          <div className="space-y-2.5 overflow-y-auto max-h-72 pr-1">
            {transactions.slice(0, 6).map((tx) => (
              <div
                key={tx.id}
                className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center justify-between gap-2 text-xs"
              >
                <div>
                  <span className="font-bold text-white block">{tx.fromUser}</span>
                  <span className="text-[10px] text-slate-500 block truncate max-w-[160px]">
                    {tx.remark}
                  </span>
                </div>
                <div className="text-right">
                  <span
                    className={`font-black font-mono block ${
                      tx.type === 'Credit' ? 'text-emerald-400' : 'text-rose-400'
                    }`}
                  >
                    {tx.type === 'Credit' ? '+' : '-'}₹{tx.amount.toLocaleString()}
                  </span>
                  <span className="text-[9px] text-slate-500 block">{tx.timestamp.substring(11, 19)}</span>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => setCurrentPage('history_transactions')}
            className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs text-center border border-slate-700 mt-2"
          >
            View Full Ledger
          </button>
        </div>
      </div>

      {/* GAME SETTINGS MODAL */}
      {editingGame && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-2xl p-6 shadow-2xl relative animate-slide-in">
            <button
              onClick={() => setEditingGame(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
              <Sliders className="w-5 h-5 text-amber-400" />
              <span>{editingGame.gameType} Settings</span>
            </h3>
            <p className="text-xs text-slate-400 mb-5">
              Set round durations, betting limits, and return to player (RTP) percentage.
            </p>

            <form onSubmit={handleSaveSettings} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1">
                  Round Duration (Seconds)
                </label>
                <input
                  type="number"
                  min={30}
                  max={600}
                  value={tempDuration}
                  onChange={(e) => setTempDuration(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 text-white rounded-xl px-3 py-2 text-xs"
                />
                <span className="text-[10px] text-slate-500 mt-1 block">
                  Current value: {tempDuration}s ({Math.floor(tempDuration / 60)}m {tempDuration % 60}s)
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Min Bet (₹)</label>
                  <input
                    type="number"
                    min={1}
                    value={tempMinBet}
                    onChange={(e) => setTempMinBet(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 text-white rounded-xl px-3 py-2 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Max Bet (₹)</label>
                  <input
                    type="number"
                    min={100}
                    value={tempMaxBet}
                    onChange={(e) => setTempMaxBet(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 text-white rounded-xl px-3 py-2 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">
                  Payout Percentage (RTP %): <span className="text-amber-400 font-extrabold">{tempPayout}%</span>
                </label>
                <input
                  type="range"
                  min={50}
                  max={98}
                  value={tempPayout}
                  onChange={(e) => setTempPayout(Number(e.target.value))}
                  className="w-full accent-amber-400 h-2 bg-slate-950 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                  <span>50% (High House Margin)</span>
                  <span>98% (High Player Payout)</span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingGame(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black shadow-lg shadow-amber-500/20"
                >
                  Save Settings
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MANUAL RESULT DECLARE MODAL WITH ADMIN SECURITY PIN */}
      {declareModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-2xl p-6 shadow-2xl relative animate-slide-in">
            <button
              onClick={() => setDeclareModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-12 h-12 rounded-2xl bg-amber-950 border border-amber-800/80 text-amber-400 flex items-center justify-center mb-4">
              <Trophy className="w-6 h-6" />
            </div>

            <h3 className="text-lg font-bold text-white mb-1">Declare Winning Result</h3>
            <p className="text-xs text-slate-400 mb-4">
              Enter official draw result for <span className="text-amber-400 font-bold">{selectedDeclareGame}</span>. Master PIN security verification required.
            </p>

            <form onSubmit={handleConfirmDeclare} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Game Selected</label>
                <select
                  value={selectedDeclareGame}
                  onChange={(e) =>
                    setSelectedDeclareGame(
                      e.target.value as '2D Lottery' | '3D Lottery' | 'Lucky 12' | '12 Card'
                    )
                  }
                  className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 text-white rounded-xl px-3 py-2 text-xs font-bold"
                >
                  <option value="2D Lottery">2D Lottery (00-99)</option>
                  <option value="3D Lottery">3D Lottery (000-999)</option>
                  <option value="Lucky 12">Lucky 12 (Card #01 - Card #12)</option>
                  <option value="12 Card">12 Card Game</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Winning Result Value</label>
                <input
                  type="text"
                  required
                  placeholder={
                    selectedDeclareGame === '2D Lottery'
                      ? 'e.g. 89'
                      : selectedDeclareGame === '3D Lottery'
                      ? 'e.g. 489'
                      : 'e.g. Card #07'
                  }
                  value={declareValue}
                  onChange={(e) => setDeclareValue(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 text-amber-300 font-mono text-lg font-black rounded-xl px-4 py-2.5 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1 flex items-center gap-1.5">
                  <Key className="w-3.5 h-3.5 text-rose-400" />
                  <span>Admin Master Security PIN</span>
                </label>
                <input
                  type="password"
                  required
                  placeholder="Enter PIN (Default: 1234)"
                  value={inputPin}
                  onChange={(e) => {
                    setInputPin(e.target.value);
                    setPinError(false);
                  }}
                  className={`w-full bg-slate-950 border text-white font-mono rounded-xl px-3 py-2 text-xs focus:outline-none ${
                    pinError ? 'border-rose-500 focus:border-rose-500' : 'border-slate-800 focus:border-amber-500'
                  }`}
                />
                <span className="text-[10px] text-slate-500 mt-1 block">
                  Security PIN validates admin identity for result declarations.
                </span>
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setDeclareModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black shadow-lg shadow-amber-500/20"
                >
                  Confirm & Declare
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
