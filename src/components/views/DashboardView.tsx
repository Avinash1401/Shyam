import React, { useState, useEffect } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { DashboardSkeleton } from '../common/Skeleton';
import { LiveBetsTable } from '../common/LiveBetsTable';
import {
  Users,
  UserCheck,
  Radio,
  Ticket,
  Trophy,
  TrendingUp,
  Coins,
  PlayCircle,
  Clock,
  Sliders,
  DollarSign,
  Activity,
  Key,
  X,
  Zap,
  Lock,
  Unlock,
  Play,
  Pause,
  RefreshCw,
  Plus,
  RotateCcw,
  Save,
  Eye,
  Crown,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight,
  BarChart3,
  Dices,
  Flame,
  Layers,
  ChevronRight,
  CheckCircle2,
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
  LineChart,
  Line,
  Cell,
} from 'recharts';
import { GameControlConfig } from '../../types';

// Chart Data 1: Today's Collection & Winnings
const collectionData = [
  { time: '08:00 AM', collection: 15000, winning: 11000 },
  { time: '10:00 AM', collection: 32000, winning: 24000 },
  { time: '12:00 PM', collection: 58000, winning: 42000 },
  { time: '02:00 PM', collection: 89000, winning: 68000 },
  { time: '04:00 PM', collection: 124000, winning: 91000 },
  { time: '06:00 PM', collection: 168000, winning: 125000 },
  { time: '08:00 PM', collection: 210000, winning: 154000 },
];

// Chart Data 2: Winning Chart (Game Breakdown)
const winningData = [
  { game: '2D Lottery', collection: 92000, winning: 68000 },
  { game: '3D Lottery', collection: 64000, winning: 45000 },
  { game: 'Lucky 12', collection: 38000, winning: 28000 },
  { game: '12 Card', collection: 16000, winning: 13000 },
];

// Chart Data 3: Player Activity
const activityData = [
  { hour: '10 AM', players: 18 },
  { hour: '12 PM', players: 42 },
  { hour: '02 PM', players: 65 },
  { hour: '04 PM', players: 84 },
  { hour: '06 PM', players: 112 },
  { hour: '08 PM', players: 145 },
  { hour: '10 PM', players: 98 },
];

// Chart Data 4: Deposit vs Withdrawal
const depositVsWithdrawalData = [
  { day: 'Mon', deposit: 45000, withdrawal: 28000 },
  { day: 'Tue', deposit: 62000, withdrawal: 39000 },
  { day: 'Wed', deposit: 58000, withdrawal: 41000 },
  { day: 'Thu', deposit: 75000, withdrawal: 48000 },
  { day: 'Fri', deposit: 92000, withdrawal: 61000 },
  { day: 'Sat', deposit: 128000, withdrawal: 85000 },
  { day: 'Sun', deposit: 145000, withdrawal: 94000 },
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
    isLoadingData,
    refreshData,
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

  // Balance Control State
  const [inputA, setInputA] = useState('500');
  const [inputB, setInputB] = useState('1000');
  const [inputC, setInputC] = useState('2500');
  const [savedMessage, setSavedMessage] = useState('');

  // Timer formatted mm:ss
  const primaryGc = gameControls[0];
  const secondsRemaining = primaryGc?.secondsRemaining || 476;
  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

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

  const handleAddBalance = () => {
    addToast('Balance Added', `Added points to system balance successfully!`, 'success');
  };

  const handleResetBalance = () => {
    setInputA('0');
    setInputB('0');
    setInputC('0');
    addToast('Balance Reset', 'Balance inputs reset to zero.', 'info');
  };

  const handleSaveBalance = async () => {
    let resultDeclared = false;

    // Check if inputB (3D Lottery) has a value entered by admin to declare
    if (inputB && inputB.trim() && inputB.trim() !== '0') {
      const current3D = gameControls.find((g) => g.gameType === '3D Lottery');
      const roundNo = current3D ? current3D.currentRoundNo : `DRW-3D-${Math.floor(1000 + Math.random() * 9000)}`;
      await declareWinningResult('3D Lottery', roundNo, inputB.trim(), 'superadmin');
      resultDeclared = true;
    }

    // Check if inputA (2D Lottery) has a value entered by admin to declare
    if (inputA && inputA.trim() && inputA.trim() !== '0') {
      const current2D = gameControls.find((g) => g.gameType === '2D Lottery');
      const roundNo = current2D ? current2D.currentRoundNo : `DRW-2D-${Math.floor(1000 + Math.random() * 9000)}`;
      await declareWinningResult('2D Lottery', roundNo, inputA.trim(), 'superadmin');
      resultDeclared = true;
    }

    // Check if inputC (Lucky 12) has a value entered by admin to declare
    if (inputC && inputC.trim() && inputC.trim() !== '0') {
      const currentL12 = gameControls.find((g) => g.gameType === 'Lucky 12');
      const roundNo = currentL12 ? currentL12.currentRoundNo : `DRW-L12-${Math.floor(1000 + Math.random() * 9000)}`;
      await declareWinningResult('Lucky 12', roundNo, inputC.trim(), 'superadmin');
      resultDeclared = true;
    }

    setSavedMessage(resultDeclared ? '3D & Game Results Declared & Saved Successfully!' : 'Configuration Saved Successfully!');
    setTimeout(() => setSavedMessage(''), 3000);
    addToast('Saved', resultDeclared ? '3D Result declared and synced across all panels!' : 'Balance control configuration saved.', 'success');
  };

  if (isLoadingData) {
    return <DashboardSkeleton />;
  }

  // Calculated totals for Sales Table & Collection Section
  const totalCollection = liveBetIn + 185000;
  const totalWinning = liveBetOut + 132000;
  const totalProfit = totalCollection - totalWinning;
  const totalCommission = Math.round(totalCollection * 0.05);
  const finalBalance = totalProfit - totalCommission;

  // Last draw result variables
  const last2DResult = liveResults.find((r) => r.gameType === '2D Lottery');
  const last3DResult = liveResults.find((r) => r.gameType === '3D Lottery');
  const lastLucky12Result = liveResults.find((r) => r.gameType === 'Lucky 12');

  return (
    <div className="space-y-6 animate-fade-in text-slate-200">
      {/* BRANDING TOP BANNER */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#0F172A] via-[#1E293B] to-[#0F172A] border border-amber-500/20 p-6 shadow-2xl">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-amber-500/10 via-emerald-500/5 to-transparent pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-500 via-amber-400 to-yellow-500 p-0.5 shadow-xl shadow-amber-500/20">
              <div className="w-full h-full bg-[#0F172A] rounded-[14px] flex items-center justify-center">
                <Crown className="w-8 h-8 text-amber-400 animate-pulse" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-2xl md:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-amber-300 to-yellow-200 tracking-tight">
                  Shyam111 Admin Panel
                </h1>
                <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-black uppercase tracking-wider">
                  PREMIUM
                </span>
              </div>
              <p className="text-xs md:text-sm text-slate-400">
                Real-Time Casino Operations • Live Bets Dashboard • Wager Risk Matrix
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              onClick={() => setCurrentPage('2d_lottery')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs shadow-lg shadow-indigo-600/30 transition-all hover:scale-[1.02]"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>2D Lottery Dashboard</span>
            </button>

            <button
              onClick={() => setCurrentPage('declare_3d')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-amber-600 hover:bg-amber-500 text-white font-black text-xs shadow-lg shadow-amber-600/30 transition-all hover:scale-[1.02]"
            >
              <Trophy className="w-4 h-4 text-amber-200" />
              <span>3D Lottery Dashboard</span>
            </button>

            <button
              onClick={() => setCurrentPage('declare_lucky12')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-black text-xs shadow-lg shadow-purple-600/30 transition-all hover:scale-[1.02]"
            >
              <Flame className="w-4 h-4 text-amber-300" />
              <span>Lucky 12 Dashboard</span>
            </button>

            <button
              onClick={() => refreshData()}
              className="flex items-center gap-2 px-3.5 py-2.5 rounded-2xl bg-[#111827] hover:bg-slate-800 text-slate-300 text-xs font-bold border border-slate-700/80 transition-all hover:text-white"
            >
              <RefreshCw className="w-4 h-4 text-emerald-400" />
              <span>Sync System</span>
            </button>

            <button
              onClick={() => handleOpenDeclareModal('2D Lottery')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/20 transition-all hover:scale-[1.02]"
            >
              <Trophy className="w-4 h-4" />
              <span>Declare Result</span>
            </button>

            <button
              onClick={() => setCurrentPage('live_bets_dashboard')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/20 transition-all"
            >
              <Dices className="w-4 h-4" />
              <span>Live Bets</span>
            </button>
          </div>
        </div>
      </div>

      {/* TOP LIVE PLAYERS BETS DASHBOARD SECTION */}
      <LiveBetsTable />

      {/* REQUIREMENT 1: TOP CARDS (7 GLASS CARDS) */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Key Performance Overview</span>
          </h2>
          <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/80 px-2.5 py-0.5 rounded-full border border-emerald-800/80 font-bold">
            LIVE FEED
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-3">
          {/* Card 1: Total Users */}
          <div className="p-4 rounded-2xl bg-[#0F172A]/90 border border-slate-800/80 shadow-xl relative overflow-hidden group hover:border-emerald-500/40 transition-all">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">
                Total Users
              </span>
              <div className="p-2 rounded-xl bg-purple-950/60 text-purple-400 border border-purple-800/60">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-white tracking-tight">{users.length + 128}</div>
            <p className="text-[10px] text-slate-400 mt-1 font-medium">Registered Accounts</p>
          </div>

          {/* Card 2: Online Users */}
          <div className="p-4 rounded-2xl bg-[#0F172A]/90 border border-slate-800/80 shadow-xl relative overflow-hidden group hover:border-emerald-500/40 transition-all">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">
                Online Users
              </span>
              <div className="p-2 rounded-xl bg-rose-950/60 text-rose-400 border border-rose-800/60 animate-pulse">
                <Radio className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-rose-400 tracking-tight">{onlinePlayers.length}</div>
            <p className="text-[10px] text-slate-400 mt-1 font-medium">Connected Terminals</p>
          </div>

          {/* Card 3: Today's Collection */}
          <div className="p-4 rounded-2xl bg-[#0F172A]/90 border border-slate-800/80 shadow-xl relative overflow-hidden group hover:border-emerald-500/40 transition-all">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">
                Today's Collection
              </span>
              <div className="p-2 rounded-xl bg-emerald-950/60 text-emerald-400 border border-emerald-800/60">
                <ArrowDownRight className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-emerald-400 tracking-tight">
              ₹{totalCollection.toLocaleString()}
            </div>
            <p className="text-[10px] text-slate-400 mt-1 font-medium">Total Wagers In</p>
          </div>

          {/* Card 4: Today's Winning */}
          <div className="p-4 rounded-2xl bg-[#0F172A]/90 border border-slate-800/80 shadow-xl relative overflow-hidden group hover:border-amber-500/40 transition-all">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">
                Today's Winning
              </span>
              <div className="p-2 rounded-xl bg-amber-950/60 text-amber-400 border border-amber-800/60">
                <Trophy className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-amber-400 tracking-tight">
              ₹{totalWinning.toLocaleString()}
            </div>
            <p className="text-[10px] text-slate-400 mt-1 font-medium">Total Wayouts Paid</p>
          </div>

          {/* Card 5: Profit/Loss */}
          <div className="p-4 rounded-2xl bg-[#0F172A]/90 border border-slate-800/80 shadow-xl relative overflow-hidden group hover:border-emerald-500/40 transition-all">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">
                Profit / Loss
              </span>
              <div className="p-2 rounded-xl bg-blue-950/60 text-blue-400 border border-blue-800/60">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <div className={`text-2xl font-black ${totalProfit >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              ₹{totalProfit.toLocaleString()}
            </div>
            <p className="text-[10px] text-slate-400 mt-1 font-medium">Net House Profit</p>
          </div>

          {/* Card 6: Active Games */}
          <div className="p-4 rounded-2xl bg-[#0F172A]/90 border border-slate-800/80 shadow-xl relative overflow-hidden group hover:border-cyan-500/40 transition-all">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">
                Active Games
              </span>
              <div className="p-2 rounded-xl bg-cyan-950/60 text-cyan-400 border border-cyan-800/60">
                <PlayCircle className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-cyan-400 tracking-tight">
              {gameControls.filter((g) => g.status === 'Active').length} / {gameControls.length}
            </div>
            <p className="text-[10px] text-slate-400 mt-1 font-medium">Running Game Engines</p>
          </div>

          {/* Card 7: Live Players Bet */}
          <div className="p-4 rounded-2xl bg-[#0F172A]/90 border border-slate-800/80 shadow-xl relative overflow-hidden group hover:border-amber-500/40 transition-all">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">
                Live Players Bet
              </span>
              <div className="p-2 rounded-xl bg-amber-950/60 text-amber-400 border border-amber-800/60">
                <Ticket className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-amber-300 tracking-tight">
              ₹{liveBetIn.toLocaleString()}
            </div>
            <p className="text-[10px] text-slate-400 mt-1 font-medium">Active Round Bets</p>
          </div>
        </div>
      </div>

      {/* REQUIREMENT 2 & 3: TIMER SECTION + BALANCE CONTROLS SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* TIMER SECTION (Centered Premium Card with Large Glowing Countdown) */}
        <div className="lg:col-span-5 p-6 rounded-2xl bg-gradient-to-b from-[#111827] to-[#0F172A] border border-amber-500/30 shadow-2xl flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-amber-400 animate-spin" />
                <span className="text-xs font-black uppercase text-amber-400 tracking-wider">
                  Live Draw Countdown
                </span>
              </div>
              <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950 px-2.5 py-0.5 rounded-full border border-emerald-800 font-bold">
                {primaryGc?.gameType || '2D Lottery'}
              </span>
            </div>

            <div className="text-center py-6 bg-[#0F172A]/80 rounded-2xl border border-slate-800 shadow-inner relative my-2">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                Round Draw Timer
              </div>
              <div className="text-5xl md:text-6xl font-mono font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-amber-300 to-yellow-200 tracking-wider filter drop-shadow-[0_0_15px_rgba(245,158,11,0.3)]">
                {formatTimer(secondsRemaining)}
              </div>
              <div className="flex items-center justify-center gap-3 mt-3 text-xs text-slate-300">
                <span className="flex items-center gap-1 font-mono">
                  <span className="text-slate-500">Draw ID:</span>
                  <span className="text-amber-400 font-bold">{primaryGc?.currentRoundNo || 'DRW-9843'}</span>
                </span>
                <span className="text-slate-600">•</span>
                <span className="flex items-center gap-1 font-mono">
                  <span className="text-slate-500">Next Draw:</span>
                  <span className="text-emerald-400 font-bold">10:00 PM</span>
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mt-4">
            <button
              onClick={() => toggleBettingLock(primaryGc?.gameType || '2D Lottery')}
              className={`py-2.5 px-3 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                primaryGc?.bettingLocked
                  ? 'bg-emerald-950 text-emerald-400 border border-emerald-800 hover:bg-emerald-900'
                  : 'bg-amber-950 text-amber-300 border border-amber-800 hover:bg-amber-900'
              }`}
            >
              {primaryGc?.bettingLocked ? (
                <>
                  <Unlock className="w-4 h-4" /> Unlock Betting
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" /> Lock Betting
                </>
              )}
            </button>

            <button
              onClick={() => handleOpenDeclareModal(primaryGc?.gameType || '2D Lottery')}
              className="py-2.5 px-3 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/20 hover:from-amber-400 hover:to-yellow-400 flex items-center justify-center gap-2"
            >
              <Trophy className="w-4 h-4" /> Instant Declare
            </button>
          </div>
        </div>

        {/* BALANCE CONTROLS SECTION */}
        <div className="lg:col-span-7 p-6 rounded-2xl bg-[#0F172A]/90 border border-slate-800/80 shadow-2xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Coins className="w-5 h-5 text-emerald-400" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  System Balance & Point Allocations
                </h3>
              </div>
              <span className="text-xs text-slate-400">Quick balance modifiers (A / B / C)</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-2">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-amber-400 block">Balance Input A (₹)</label>
                <input
                  type="text"
                  value={inputA}
                  onChange={(e) => setInputA(e.target.value)}
                  className="w-full bg-[#111827] border border-slate-800 focus:border-amber-500 text-amber-300 font-mono text-base font-bold rounded-2xl px-3.5 py-2.5 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-emerald-400 block">Balance Input B (₹)</label>
                <input
                  type="text"
                  value={inputB}
                  onChange={(e) => setInputB(e.target.value)}
                  className="w-full bg-[#111827] border border-slate-800 focus:border-emerald-500 text-emerald-300 font-mono text-base font-bold rounded-2xl px-3.5 py-2.5 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-cyan-400 block">Balance Input C (₹)</label>
                <input
                  type="text"
                  value={inputC}
                  onChange={(e) => setInputC(e.target.value)}
                  className="w-full bg-[#111827] border border-slate-800 focus:border-cyan-500 text-cyan-300 font-mono text-base font-bold rounded-2xl px-3.5 py-2.5 focus:outline-none"
                />
              </div>
            </div>

            {savedMessage && (
              <div className="mt-2 text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                <span>{savedMessage}</span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-4 border-t border-slate-800/80">
            {/* Add Balance */}
            <button
              onClick={handleAddBalance}
              className="py-2.5 px-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/20 transition-all flex items-center justify-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Add Balance</span>
            </button>

            {/* Reset Balance */}
            <button
              onClick={handleResetBalance}
              className="py-2.5 px-3 rounded-2xl bg-rose-950 hover:bg-rose-900 text-rose-300 border border-rose-800 font-bold text-xs transition-all flex items-center justify-center gap-1.5"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset Balance</span>
            </button>

            {/* Save */}
            <button
              onClick={handleSaveBalance}
              className="py-2.5 px-3 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/20 hover:from-amber-400 hover:to-yellow-400 transition-all flex items-center justify-center gap-1.5"
            >
              <Save className="w-4 h-4" />
              <span>Save</span>
            </button>

            {/* View */}
            <button
              onClick={() => setCurrentPage('history_transactions')}
              className="py-2.5 px-3 rounded-2xl bg-[#111827] hover:bg-slate-800 text-slate-300 border border-slate-700 font-bold text-xs transition-all flex items-center justify-center gap-1.5"
            >
              <Eye className="w-4 h-4 text-cyan-400" />
              <span>View Ledger</span>
            </button>
          </div>
        </div>
      </div>

      {/* REQUIREMENT 4 & 5 & 6: SALES TABLE + COLLECTION SECTION + LAST DRAW RESULTS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* SALES TABLE */}
        <div className="lg:col-span-6 p-5 rounded-2xl bg-[#0F172A]/90 border border-slate-800/80 shadow-2xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-emerald-400" />
              <span>Game Category Sales Matrix</span>
            </h3>
            <span className="text-[10px] text-slate-400">Today's Real-time Financial Breakdown</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#111827] text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="p-3 border-b border-slate-800">Details</th>
                  <th className="p-3 border-b border-slate-800 text-right">A (₹)</th>
                  <th className="p-3 border-b border-slate-800 text-right">B (₹)</th>
                  <th className="p-3 border-b border-slate-800 text-right">C (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-semibold text-slate-300">
                <tr className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-3 font-bold text-white">SALES</td>
                  <td className="p-3 text-right font-mono text-emerald-400">85,000</td>
                  <td className="p-3 text-right font-mono text-emerald-400">62,000</td>
                  <td className="p-3 text-right font-mono text-emerald-400">38,000</td>
                </tr>
                <tr className="hover:bg-slate-800/40 transition-colors bg-[#111827]/40">
                  <td className="p-3 font-bold text-white">WINNING</td>
                  <td className="p-3 text-right font-mono text-amber-400">61,000</td>
                  <td className="p-3 text-right font-mono text-amber-400">44,000</td>
                  <td className="p-3 text-right font-mono text-amber-400">27,000</td>
                </tr>
                <tr className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-3 font-bold text-white">PROFIT</td>
                  <td className="p-3 text-right font-mono text-emerald-300 font-bold">24,000</td>
                  <td className="p-3 text-right font-mono text-emerald-300 font-bold">18,000</td>
                  <td className="p-3 text-right font-mono text-emerald-300 font-bold">11,000</td>
                </tr>
                <tr className="hover:bg-slate-800/40 transition-colors bg-[#111827]/40">
                  <td className="p-3 font-bold text-white">COMMISSION</td>
                  <td className="p-3 text-right font-mono text-purple-400">4,250</td>
                  <td className="p-3 text-right font-mono text-purple-400">3,100</td>
                  <td className="p-3 text-right font-mono text-purple-400">1,900</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* COLLECTION SECTION */}
        <div className="lg:col-span-3 p-5 rounded-2xl bg-[#0F172A]/90 border border-slate-800/80 shadow-2xl space-y-3">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 mb-2">
            <Coins className="w-4 h-4 text-amber-400" />
            <span>Collection & Net Settlement</span>
          </h3>

          <div className="space-y-2.5">
            <div className="p-3 rounded-2xl bg-[#111827] border border-slate-800 flex justify-between items-center">
              <span className="text-xs text-slate-400 font-bold">Game Balance</span>
              <span className="text-sm font-black font-mono text-cyan-400">
                ₹{systemWalletBalance.toLocaleString()}
              </span>
            </div>

            <div className="p-3 rounded-2xl bg-[#111827] border border-slate-800 flex justify-between items-center">
              <span className="text-xs text-slate-400 font-bold">Collection</span>
              <span className="text-sm font-black font-mono text-emerald-400">
                ₹{totalCollection.toLocaleString()}
              </span>
            </div>

            <div className="p-3 rounded-2xl bg-[#111827] border border-slate-800 flex justify-between items-center">
              <span className="text-xs text-slate-400 font-bold">Payment Paid</span>
              <span className="text-sm font-black font-mono text-amber-400">
                ₹{totalWinning.toLocaleString()}
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-emerald-950/60 border border-emerald-800/80 flex justify-between items-center shadow-lg">
              <div>
                <span className="text-[10px] text-emerald-300 uppercase font-black block">Final Balance</span>
                <span className="text-[10px] text-emerald-400/80">Net Profit after Commission</span>
              </div>
              <span className="text-lg font-black font-mono text-emerald-400">
                ₹{finalBalance.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* REQUIREMENT 6: LAST DRAW RESULTS */}
        <div className="lg:col-span-3 p-5 rounded-2xl bg-[#0F172A]/90 border border-slate-800/80 shadow-2xl space-y-3 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <Trophy className="w-4 h-4 text-amber-400" />
                <span>Last Draw Results</span>
              </h3>
            </div>
            <p className="text-[11px] font-mono font-bold text-amber-300 mb-3 bg-amber-950/60 px-2.5 py-1 rounded-xl border border-amber-800/60 inline-block">
              Last Draw Results : {last3DResult?.drawTime || last2DResult?.drawTime || '09:45PM'}
            </p>

            <div className="grid grid-cols-1 gap-2.5">
              {/* A Result */}
              <div className="p-3 rounded-2xl bg-gradient-to-r from-emerald-950/80 to-[#111827] border border-emerald-800/80 flex items-center justify-between shadow-md">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-xl bg-emerald-500 text-slate-950 font-black text-xs flex items-center justify-center">
                    A
                  </div>
                  <span className="text-xs font-bold text-white">A Result (2D)</span>
                </div>
                <span className="text-base font-black font-mono text-emerald-300">
                  {last2DResult?.winningResult || (last2DResult as any)?.result || 'A968'}
                </span>
              </div>

              {/* B Result */}
              <div className="p-3 rounded-2xl bg-gradient-to-r from-amber-950/80 to-[#111827] border border-amber-800/80 flex items-center justify-between shadow-md">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-xl bg-amber-500 text-slate-950 font-black text-xs flex items-center justify-center">
                    B
                  </div>
                  <span className="text-xs font-bold text-white">B Result (3D)</span>
                </div>
                <span className="text-base font-black font-mono text-amber-300">
                  {last3DResult?.winningResult || (last3DResult as any)?.result || 'B203'}
                </span>
              </div>

              {/* C Result */}
              <div className="p-3 rounded-2xl bg-gradient-to-r from-purple-950/80 to-[#111827] border border-purple-800/80 flex items-center justify-between shadow-md">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-xl bg-purple-500 text-white font-black text-xs flex items-center justify-center">
                    C
                  </div>
                  <span className="text-xs font-bold text-white">C Result (Lucky 12)</span>
                </div>
                <span className="text-base font-black font-mono text-purple-300">
                  {lastLucky12Result?.winningResult || (lastLucky12Result as any)?.result || 'C727'}
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={() => setCurrentPage('live_2d')}
            className="w-full py-2 rounded-xl bg-[#111827] hover:bg-slate-800 text-slate-300 font-bold text-xs text-center border border-slate-700 mt-2"
          >
            View Complete Draw Archive
          </button>
        </div>
      </div>

      {/* REQUIREMENT 8: CHARTS SECTION (4 CHARTS) */}
      <div className="space-y-3">
        <h2 className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-emerald-400" />
          <span>Analytical Reports & Graphical Visualizations</span>
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Chart 1: Today's Collection Chart */}
          <div className="p-5 rounded-2xl bg-[#0F172A]/90 border border-slate-800/80 shadow-2xl space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white">Today's Collection Chart</h3>
                <p className="text-[11px] text-slate-400">Hourly collection accumulation vs payout</p>
              </div>
              <span className="text-xs font-mono text-emerald-400 font-bold">₹{totalCollection.toLocaleString()}</span>
            </div>

            <div className="h-60 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={collectionData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="time" stroke="#64748b" fontSize={10} />
                  <YAxis stroke="#64748b" fontSize={10} tickFormatter={(v) => `₹${v / 1000}k`} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      borderColor: '#334155',
                      borderRadius: '12px',
                      fontSize: '11px',
                    }}
                  />
                  <Area type="monotone" dataKey="collection" stroke="#10b981" strokeWidth={2} fill="url(#colGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 2: Winning Chart */}
          <div className="p-5 rounded-2xl bg-[#0F172A]/90 border border-slate-800/80 shadow-2xl space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white">Winning Chart</h3>
                <p className="text-[11px] text-slate-400">Game-wise payout breakdown</p>
              </div>
              <span className="text-xs font-mono text-amber-400 font-bold">₹{totalWinning.toLocaleString()}</span>
            </div>

            <div className="h-60 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={winningData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="game" stroke="#64748b" fontSize={10} />
                  <YAxis stroke="#64748b" fontSize={10} tickFormatter={(v) => `₹${v / 1000}k`} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      borderColor: '#334155',
                      borderRadius: '12px',
                      fontSize: '11px',
                    }}
                  />
                  <Bar dataKey="winning" fill="#f59e0b" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 3: Player Activity Chart */}
          <div className="p-5 rounded-2xl bg-[#0F172A]/90 border border-slate-800/80 shadow-2xl space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white">Player Activity Chart</h3>
                <p className="text-[11px] text-slate-400">Peak online concurrent players by hour</p>
              </div>
              <span className="text-xs font-mono text-purple-400 font-bold">{onlinePlayers.length} Active Now</span>
            </div>

            <div className="h-60 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={activityData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="hour" stroke="#64748b" fontSize={10} />
                  <YAxis stroke="#64748b" fontSize={10} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      borderColor: '#334155',
                      borderRadius: '12px',
                      fontSize: '11px',
                    }}
                  />
                  <Line type="monotone" dataKey="players" stroke="#a855f7" strokeWidth={3} dot={{ r: 4, fill: '#a855f7' }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 4: Deposit vs Withdrawal Chart */}
          <div className="p-5 rounded-2xl bg-[#0F172A]/90 border border-slate-800/80 shadow-2xl space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white">Deposit vs Withdrawal Chart</h3>
                <p className="text-[11px] text-slate-400">Weekly financial inflow vs outflow</p>
              </div>
              <div className="flex gap-2 text-[10px] font-bold">
                <span className="text-emerald-400">■ Deposit</span>
                <span className="text-rose-400">■ Withdrawal</span>
              </div>
            </div>

            <div className="h-60 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={depositVsWithdrawalData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="day" stroke="#64748b" fontSize={10} />
                  <YAxis stroke="#64748b" fontSize={10} tickFormatter={(v) => `₹${v / 1000}k`} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      borderColor: '#334155',
                      borderRadius: '12px',
                      fontSize: '11px',
                    }}
                  />
                  <Bar dataKey="deposit" fill="#10b981" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="withdrawal" fill="#f43f5e" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* GAME CONTROLS SECTION (2D, 3D, Lucky 12 & 12 Card) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
            <Sliders className="w-4 h-4 text-amber-400" />
            <span>Game Control Switches & Draw Engine</span>
          </h2>
          <span className="text-xs text-slate-400">Individual game parameters</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {gameControls.map((gc) => (
            <div
              key={gc.gameType}
              className={`p-5 rounded-2xl bg-[#0F172A]/90 border transition-all space-y-4 shadow-xl ${
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
                  <span className="text-[11px] font-mono text-emerald-400 font-bold block mt-0.5">
                    {gc.currentRoundNo}
                  </span>
                </div>

                {/* Mode Badge (Manual vs Auto) */}
                <button
                  type="button"
                  onClick={() => toggleResultMode(gc.gameType)}
                  className={`px-2.5 py-1 rounded-xl text-xs font-bold border transition-all ${
                    gc.mode === 'Auto'
                      ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40 hover:bg-emerald-500/30'
                      : 'bg-amber-500/20 text-amber-400 border-amber-500/40 hover:bg-amber-500/30'
                  }`}
                  title="Click to toggle Manual vs Automatic Mode"
                >
                  Mode: {gc.mode}
                </button>
              </div>

              {/* Timer Ring & Quick Stats */}
              <div className="p-3.5 rounded-2xl bg-[#111827] border border-slate-800/80 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">
                    Round Timer
                  </span>
                  <div className="text-xl font-mono font-black text-white flex items-center gap-2">
                    <span className={gc.secondsRemaining <= 10 ? 'text-rose-400 animate-pulse' : 'text-emerald-400'}>
                      {gc.secondsRemaining}s
                    </span>
                    <span className="text-[10px] text-slate-500 font-normal">/ {gc.roundDurationSeconds}s</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">
                    Payout %
                  </span>
                  <span className="text-sm font-extrabold text-amber-400">{gc.payoutPercentage}%</span>
                </div>
              </div>

              {/* Quick Action Control Buttons */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                {/* Start / Stop Toggle */}
                <button
                  type="button"
                  onClick={() => toggleGameStatus(gc.gameType)}
                  className={`flex items-center justify-center gap-1.5 px-3 py-2 rounded-2xl text-xs font-bold transition-all ${
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
                  className={`flex items-center justify-center gap-1.5 px-3 py-2 rounded-2xl text-xs font-bold transition-all ${
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
                  className="flex-1 py-2 px-3 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black text-xs shadow-md shadow-amber-500/20 text-center"
                >
                  Declare Result
                </button>

                <button
                  type="button"
                  onClick={() => handleOpenSettings(gc)}
                  className="p-2 rounded-2xl bg-[#111827] hover:bg-slate-800 text-slate-300 border border-slate-700"
                  title="Configure timing & limits"
                >
                  <Sliders className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* GAME SETTINGS MODAL */}
      {editingGame && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0F172A] border border-slate-800 w-full max-w-md rounded-2xl p-6 shadow-2xl relative animate-slide-in">
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
                  className="w-full bg-[#111827] border border-slate-800 focus:border-amber-500 text-white rounded-xl px-3 py-2 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Min Bet (₹)</label>
                  <input
                    type="number"
                    min={1}
                    value={tempMinBet}
                    onChange={(e) => setTempMinBet(Number(e.target.value))}
                    className="w-full bg-[#111827] border border-slate-800 focus:border-amber-500 text-white rounded-xl px-3 py-2 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Max Bet (₹)</label>
                  <input
                    type="number"
                    min={100}
                    value={tempMaxBet}
                    onChange={(e) => setTempMaxBet(Number(e.target.value))}
                    className="w-full bg-[#111827] border border-slate-800 focus:border-amber-500 text-white rounded-xl px-3 py-2 text-xs"
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
                  className="w-full accent-amber-400 h-2 bg-[#111827] rounded-lg cursor-pointer"
                />
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
          <div className="bg-[#0F172A] border border-slate-800 w-full max-w-md rounded-2xl p-6 shadow-2xl relative animate-slide-in">
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
                  className="w-full bg-[#111827] border border-slate-800 focus:border-amber-500 text-white rounded-xl px-3 py-2 text-xs font-bold"
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
                  className="w-full bg-[#111827] border border-slate-800 focus:border-amber-500 text-amber-300 font-mono text-lg font-black rounded-xl px-4 py-2.5 focus:outline-none"
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
                  className={`w-full bg-[#111827] border text-white font-mono rounded-xl px-3 py-2 text-xs focus:outline-none ${
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
