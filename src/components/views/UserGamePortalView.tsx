import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from '../../context/AdminContext';
import { GameCardSkeleton, GamePortalSkeleton } from '../common/Skeleton';
import { soundManager } from '../../utils/sound';
import { motion, AnimatePresence } from 'motion/react';
import {
  Gamepad2,
  Trophy,
  Clock,
  Wallet,
  Sparkles,
  RefreshCw,
  PlusCircle,
  Ticket,
  Dices,
  Layers,
  Flame,
  Zap,
  CheckCircle2,
  ArrowUpRight,
  ArrowDownRight,
  Search,
  Check,
  X,
  History,
  Info,
  ChevronRight,
  Filter,
  LogOut,
  Gift,
  KeyRound,
  Bell,
  User,
  ShieldCheck,
  Play,
  Calendar,
} from 'lucide-react';

export const UserGamePortalView: React.FC = () => {
  const navigate = useNavigate();
  const {
    isLoggedIn,
    userRole,
    currentUser,
    playerSession,
    users,
    gameTickets,
    liveResults,
    placeBet,
    submitDepositRequest,
    addToast,
    lucky12Cards,
    setCurrentPage,
    isLoadingData,
    refreshData,
    logoutPlayer,
    logout,
    notifications,
  } = useAdmin();

  // Player authentication state
  const isPlayerAuth = (isLoggedIn && userRole === 'player') || Boolean(playerSession?.isLoggedIn);

  // Active user account for player session
  const activeUser =
    playerSession?.isLoggedIn && playerSession.user
      ? playerSession.user
      : currentUser || (users.length > 0 ? users[0] : null);

  // Active Game Tab: Only ONE game visible at a time
  const [activeTab, setActiveTab] = useState<'lucky12' | '3d' | '2d'>('lucky12');
  const [betAmount, setBetAmount] = useState<number>(100);

  // ------------------ LUCKY 12 STATE ------------------
  const [selectedCards, setSelectedCards] = useState<string[]>([]);
  const [cardBets, setCardBets] = useState<{ [cardName: string]: number }>({});

  // ------------------ 3D GAME STATE ------------------
  const [betType3D, setBetType3D] = useState<string>('Box');
  const [digit1, setDigit1] = useState<number>(5);
  const [digit2, setDigit2] = useState<number>(8);
  const [digit3, setDigit3] = useState<number>(1);
  const [selectedPanel, setSelectedPanel] = useState<'All' | 'A' | 'B' | 'C'>('All');
  const [rangeFrom3D, setRangeFrom3D] = useState<string>('');
  const [rangeTo3D, setRangeTo3D] = useState<string>('');
  const [selectedRate3D, setSelectedRate3D] = useState<number>(10);
  const [added3DNumbers, setAdded3DNumbers] = useState<{ number: string; type: string; rate: number }[]>([]);

  // ------------------ 2D GAME STATE ------------------
  const [selected2DNumbers, setSelected2DNumbers] = useState<string[]>([]);
  const [searchQuery2D, setSearchQuery2D] = useState<string>('');
  const [active2DRange, setActive2DRange] = useState<string>('all');
  const [selected2DRangeBlock, setSelected2DRangeBlock] = useState<string>('5000-5099');
  const [boRowValues, setBoRowValues] = useState<{ [rowKey: string]: string }>({});
  const [quickFilter2D, setQuickFilter2D] = useState<string>('All');

  // Modals
  const [showDepositModal, setShowDepositModal] = useState<boolean>(false);
  const [depositAmount, setDepositAmount] = useState<number>(1000);
  const [showHistoryModal, setShowHistoryModal] = useState<boolean>(false);
  const [showNotificationsModal, setShowNotificationsModal] = useState<boolean>(false);

  // ------------------ HANDLERS ------------------
  const toggleLuckyCard = (cardName: string) => {
    soundManager.playClick();
    if (selectedCards.includes(cardName)) {
      setSelectedCards((prev) => prev.filter((c) => c !== cardName));
    } else {
      setSelectedCards((prev) => [...prev, cardName]);
      if (!cardBets[cardName]) {
        setCardBets((prev) => ({ ...prev, [cardName]: betAmount }));
      }
    }
  };

  const setCardBetAmount = (cardName: string, amount: number) => {
    setCardBets((prev) => ({ ...prev, [cardName]: amount }));
  };

  const handleClearLucky12 = () => {
    soundManager.playClick();
    setSelectedCards([]);
  };

  const toggle2DNumber = (numStr: string) => {
    soundManager.playClick();
    if (selected2DNumbers.includes(numStr)) {
      setSelected2DNumbers((prev) => prev.filter((n) => n !== numStr));
    } else {
      setSelected2DNumbers((prev) => [...prev, numStr]);
    }
  };

  const select2DFilter = (filter: 'even' | 'odd' | 'small' | 'big' | 'random5' | 'random10' | 'clear') => {
    soundManager.playClick();
    if (filter === 'clear') {
      setSelected2DNumbers([]);
      return;
    }

    const all = Array.from({ length: 100 }, (_, i) => i.toString().padStart(2, '0'));
    if (filter === 'even') {
      setSelected2DNumbers(all.filter((n) => parseInt(n, 10) % 2 === 0));
    } else if (filter === 'odd') {
      setSelected2DNumbers(all.filter((n) => parseInt(n, 10) % 2 !== 0));
    } else if (filter === 'small') {
      setSelected2DNumbers(all.filter((n) => parseInt(n, 10) < 50));
    } else if (filter === 'big') {
      setSelected2DNumbers(all.filter((n) => parseInt(n, 10) >= 50));
    } else if (filter === 'random5' || filter === 'random10') {
      const count = filter === 'random5' ? 5 : 10;
      const picks: string[] = [];
      while (picks.length < count) {
        const rand = Math.floor(Math.random() * 100).toString().padStart(2, '0');
        if (!picks.includes(rand)) picks.push(rand);
      }
      setSelected2DNumbers(picks);
    }
  };

  // 3D Presets
  const set3DTriplePreset = (digit: number) => {
    soundManager.playClick();
    setDigit1(digit);
    setDigit2(digit);
    setDigit3(digit);
  };

  // Place Bet Action
  const handlePlaceBet = async () => {
    soundManager.playClick();
    if (!activeUser) {
      addToast('Login Required', 'Please log in to place bets.', 'error');
      return;
    }

    let gameType: '2D Lottery' | '3D Lottery' | 'Lucky 12' = 'Lucky 12';
    let selections: string[] = [];
    let totalWager = 0;

    if (activeTab === 'lucky12') {
      gameType = 'Lucky 12';
      selections = selectedCards;
      if (selections.length === 0) {
        addToast('No Card Selected', 'Please select at least 1 Lucky 12 card.', 'warning');
        return;
      }
      // Calculate total wager
      totalWager = selections.reduce((sum, name) => sum + (cardBets[name] || betAmount), 0);
    } else if (activeTab === '3d') {
      gameType = '3D Lottery';
      selections = [`${digit1}${digit2}${digit3} (${betType3D})`];
      totalWager = betAmount;
    } else {
      gameType = '2D Lottery';
      selections = selected2DNumbers;
      if (selections.length === 0) {
        addToast('No Number Selected', 'Please select at least 1 number from 00 to 99.', 'warning');
        return;
      }
      totalWager = betAmount * selections.length;
    }

    if (activeUser.points < totalWager) {
      addToast('Insufficient Balance', `You need ₹${totalWager} to place this bet. Please add points.`, 'error');
      return;
    }

    const success = await placeBet(activeUser.username, gameType, selections, totalWager);
    if (success) {
      soundManager.playBetSuccess();
      if (activeTab === 'lucky12') setSelectedCards([]);
      if (activeTab === '2d') setSelected2DNumbers([]);
    }
  };

  const handleRequestPoints = async () => {
    soundManager.playClick();
    if (!activeUser) return;
    const success = await submitDepositRequest(
      depositAmount,
      'UPI',
      `UTR-${Math.floor(10000000 + Math.random() * 90000000)}`
    );
    if (success) {
      setShowDepositModal(false);
    }
  };

  // Filter user tickets
  const userTickets = gameTickets.filter((t) => t.username?.toLowerCase() === activeUser?.username?.toLowerCase());

  // Filter 2D grid numbers by search and range
  const filtered2DNumbers = Array.from({ length: 100 }, (_, i) => i.toString().padStart(2, '0')).filter((num) => {
    if (searchQuery2D && !num.includes(searchQuery2D)) return false;
    if (active2DRange === '00-19') return parseInt(num, 10) >= 0 && parseInt(num, 10) <= 19;
    if (active2DRange === '20-39') return parseInt(num, 10) >= 20 && parseInt(num, 10) <= 39;
    if (active2DRange === '40-59') return parseInt(num, 10) >= 40 && parseInt(num, 10) <= 59;
    if (active2DRange === '60-79') return parseInt(num, 10) >= 60 && parseInt(num, 10) <= 79;
    if (active2DRange === '80-99') return parseInt(num, 10) >= 80 && parseInt(num, 10) <= 99;
    return true;
  });

  if (isLoadingData) {
    return <GamePortalSkeleton />;
  }

  return (
    <div className="space-y-6 pb-12 font-sans selection:bg-cyan-500 selection:text-slate-950">
      
      {/* SHYAM111 GAME HERO BRANDING BANNER */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-cyan-950/80 via-slate-900 to-slate-900 border border-cyan-500/40 backdrop-blur-2xl shadow-[0_20px_60px_rgba(14,165,233,0.2)] relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-400 via-blue-500 to-emerald-400 opacity-90 animate-pulse" />
        <div className="flex flex-col md:flex-row items-center gap-4 z-10 w-full justify-center md:justify-start">
          <motion.div
            whileHover={{ scale: 1.08, rotate: 3 }}
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-cyan-400 via-blue-600 to-emerald-400 p-[2px] shadow-[0_0_35px_rgba(14,165,233,0.5)] shrink-0"
          >
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-cyan-300">
              <Gamepad2 className="w-10 h-10 animate-pulse" />
            </div>
          </motion.div>
          <div>
            <h1 className="text-2xl sm:text-4xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-blue-300 to-emerald-300 uppercase drop-shadow-[0_0_20px_rgba(14,165,233,0.5)]">
              SHYAM111 GAME
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 font-semibold mt-1 flex items-center justify-center md:justify-start gap-2">
              <Sparkles className="w-4 h-4 text-amber-400 animate-spin" style={{ animationDuration: '6s' }} />
              <span>Official Gaming Portal • 2D, 3D, L-12 & Live Results</span>
            </p>
          </div>
        </div>

        {/* Player Dashboard Quick Info Box */}
        {activeUser && (
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 backdrop-blur-md flex items-center gap-4 shrink-0 shadow-inner z-10">
            <div className="p-3 rounded-xl bg-cyan-950 text-cyan-400 border border-cyan-500/30">
              <User className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-extrabold tracking-wider block">
                {activeUser.name || activeUser.username || 'Player'}
              </span>
              <span className="text-xl font-mono font-black text-amber-400 block">
                ₹{activeUser.points?.toLocaleString('en-IN') || '0'}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* PLAYER DASHBOARD CONTROL BAR */}
      {activeUser && (
        <div className="p-4 rounded-3xl bg-slate-900/90 border border-slate-800/80 backdrop-blur-2xl shadow-xl flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
            <span className="text-xs font-bold text-white font-mono">
              Welcome, <span className="text-cyan-400">{activeUser.name || activeUser.username}</span>
            </span>
            <span className="text-xs font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/30">
              ID: #{activeUser.id?.slice(0, 8) || 'P-111'}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setCurrentPage('profile')}
              className="px-3 py-1.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white text-xs font-bold flex items-center gap-1.5 transition-all"
            >
              <User className="w-3.5 h-3.5 text-cyan-400" />
              <span>Profile</span>
            </button>
            <button
              onClick={() => setCurrentPage('player_deposit')}
              className="px-3 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center gap-1.5 transition-all"
            >
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>Deposit</span>
            </button>
            <button
              onClick={() => setCurrentPage('player_withdrawal')}
              className="px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-400 text-xs font-bold flex items-center gap-1.5 transition-all"
            >
              <ArrowDownRight className="w-3.5 h-3.5" />
              <span>Withdraw</span>
            </button>
            <button
              onClick={() => setShowHistoryModal(true)}
              className="px-3 py-1.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white text-xs font-bold flex items-center gap-1.5 transition-all"
            >
              <History className="w-3.5 h-3.5 text-cyan-400" />
              <span>History</span>
            </button>
            <button
              onClick={() => setShowNotificationsModal(true)}
              className="px-3 py-1.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white text-xs font-bold flex items-center gap-1.5 transition-all relative"
            >
              <Bell className="w-3.5 h-3.5 text-purple-400" />
              <span>Notifications</span>
              {notifications && notifications.length > 0 && (
                <span className="w-2 h-2 rounded-full bg-red-500 absolute -top-0.5 -right-0.5 animate-pulse" />
              )}
            </button>
            <button
              onClick={() => {
                if (logoutPlayer) logoutPlayer();
                else if (logout) logout();
                addToast('Logged out successfully', 'info');
              }}
              className="px-3 py-1.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 text-xs font-bold flex items-center gap-1.5 transition-all"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      )}


      
      {/* Game Mode Tab Selector with Framer Motion Glass Styling */}
      <div className="relative p-1.5 rounded-3xl bg-slate-900/90 border border-slate-800 backdrop-blur-2xl shadow-2xl flex items-center gap-2">
        {[
          { id: 'lucky12', label: 'Lucky-12', icon: Flame, badge: '10x Multiplier', color: 'from-amber-500 to-yellow-600' },
          { id: '3d', label: '3D Game', icon: Sparkles, badge: '900x Multiplier', color: 'from-purple-500 to-indigo-600' },
          { id: '2d', label: '2D Game', icon: Dices, badge: '90x Multiplier', color: 'from-cyan-500 to-blue-600' },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => {
                soundManager.playClick();
                setActiveTab(tab.id as any);
              }}
              className="relative flex-1 py-3 px-3 sm:px-5 rounded-2xl text-xs sm:text-sm font-black transition-all flex items-center justify-center gap-2 z-10"
            >
              {isActive && (
                <motion.div
                  layoutId="activeGameTab"
                  className={`absolute inset-0 bg-gradient-to-r ${tab.color} rounded-2xl shadow-[0_0_25px_rgba(14,165,233,0.3)]`}
                  transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                />
              )}
              <Icon className={`w-4 h-4 sm:w-5 sm:h-5 relative z-20 ${isActive ? 'text-slate-950 animate-bounce' : 'text-slate-400'}`} />
              <span className={`relative z-20 uppercase tracking-wider ${isActive ? 'text-slate-950 font-black' : 'text-slate-300 hover:text-white'}`}>
                {tab.label}
              </span>
              <span
                className={`hidden md:inline-block relative z-20 text-[9px] px-2 py-0.5 rounded-full font-bold uppercase ${
                  isActive
                    ? 'bg-slate-950/80 text-white border border-white/20'
                    : 'bg-slate-800 text-slate-400 border border-slate-700'
                }`}
              >
                {tab.badge}
              </span>
            </button>
          );
        })}
      </div>

      {/* Main Game Interface Area */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.25 }}
        >
          {/* ===================== GAME 1: LUCKY-12 ===================== */}
          {activeTab === 'lucky12' && (
            <div className="space-y-4">
              
              {/* Top Title & Quick Navigation Header */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900/90 via-slate-900/95 to-slate-900/90 border border-slate-800/80 backdrop-blur-2xl flex flex-col md:flex-row items-center justify-between gap-3 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent blur-xs opacity-70" />
                
                <div className="flex items-center gap-3">
                  <span className="text-2xl animate-bounce">👑</span>
                  <h1 className="text-2xl sm:text-3xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500 drop-shadow-[0_0_15px_rgba(245,158,11,0.5)] uppercase">
                    LUCKY-12
                  </h1>
                  <span className="text-2xl animate-bounce">👑</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      soundManager.playClick();
                      setActiveTab('3d');
                    }}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-950/80 hover:bg-slate-800 text-cyan-400 border border-cyan-500/30 text-xs font-bold transition-all hover:scale-105"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>3D Game</span>
                  </button>
                  <button
                    onClick={() => {
                      soundManager.playClick();
                      setActiveTab('2d');
                    }}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-950/80 hover:bg-slate-800 text-emerald-400 border border-emerald-500/30 text-xs font-bold transition-all hover:scale-105"
                  >
                    <Dices className="w-4 h-4" />
                    <span>2D Game</span>
                  </button>
                </div>
              </div>

              {/* Action Control Button Bar */}
              <div className="p-2.5 rounded-2xl bg-slate-900/90 border border-slate-800/80 backdrop-blur-xl grid grid-cols-5 gap-2 shadow-xl">
                <button
                  onClick={() => {
                    soundManager.playClick();
                    refreshData();
                    addToast('Data Refreshed', 'Game arena data re-synchronized.', 'info');
                  }}
                  className="flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl bg-slate-800/90 hover:bg-slate-700/90 text-cyan-400 border border-cyan-500/30 text-xs font-extrabold transition-all hover:text-white"
                >
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '8s' }} />
                  <span>Refresh</span>
                </button>

                <button
                  onClick={() => {
                    soundManager.playClick();
                    setCurrentPage('live_lucky12');
                  }}
                  className="flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl bg-purple-950/70 hover:bg-purple-900/70 text-purple-300 border border-purple-500/40 text-xs font-extrabold transition-all"
                >
                  <Trophy className="w-3.5 h-3.5 text-purple-400" />
                  <span>Result</span>
                </button>

                <button
                  onClick={() => {
                    soundManager.playClick();
                    setShowHistoryModal(true);
                  }}
                  className="flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl bg-indigo-950/70 hover:bg-indigo-900/70 text-indigo-300 border border-indigo-500/40 text-xs font-extrabold transition-all"
                >
                  <History className="w-3.5 h-3.5 text-indigo-400" />
                  <span>History</span>
                </button>

                <button
                  onClick={() => {
                    soundManager.playClick();
                    addToast('Advance Draw', 'Select upcoming draw rounds for advance bets.', 'info');
                  }}
                  className="flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl bg-emerald-950/70 hover:bg-emerald-900/70 text-emerald-300 border border-emerald-500/40 text-xs font-extrabold transition-all"
                >
                  <Zap className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Advance</span>
                </button>

                <button
                  onClick={handleClearLucky12}
                  className="flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl bg-rose-950/80 hover:bg-rose-900/80 text-rose-300 border border-rose-500/40 text-xs font-extrabold transition-all"
                >
                  <X className="w-3.5 h-3.5 text-rose-400" />
                  <span>Cancel</span>
                </button>
              </div>

              {/* 12 Cards Grid - 6 columns on desktop, 3 on tablet, 2 on mobile */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                {lucky12Cards.map((card, idx) => {
                  const isSelected = selectedCards.includes(card.name);
                  const currentCardBet = cardBets[card.name] || '';

                  // Fallback icons / illustration graphics for the 12 cards
                  const cardGraphics = [
                    '⚽', '🪁', '🐱', '🐎', '🏍️', '🦋', '🌹', '🐅', '🪔', '🐇', '☂️', '☀️'
                  ];
                  const fallbackGraphic = card.icon || cardGraphics[idx % 12];

                  return (
                    <motion.div
                      key={card.id || `card-${idx}`}
                      whileHover={{ scale: 1.03, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => toggleLuckyCard(card.name)}
                      className={`relative rounded-2xl p-3 border transition-all cursor-pointer flex flex-col justify-between gap-2.5 backdrop-blur-xl ${
                        isSelected
                          ? 'bg-gradient-to-b from-slate-900 via-slate-900 to-purple-950/90 border-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.35)] ring-2 ring-amber-400/50'
                          : 'bg-slate-900/80 border-slate-800 hover:border-slate-700 hover:bg-slate-800/80'
                      }`}
                    >
                      {/* Card Illustration Container */}
                      <div className="w-full h-28 sm:h-32 rounded-xl bg-slate-950/90 border border-slate-800/80 flex flex-col items-center justify-center p-2 relative overflow-hidden group shadow-inner">
                        {isSelected && (
                          <div className="absolute inset-0 bg-amber-500/10 backdrop-blur-[1px] animate-pulse" />
                        )}
                        {card.imageUrl ? (
                          <img
                            src={card.imageUrl}
                            alt={card.name}
                            className="w-full h-full object-contain drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)] transition-transform duration-300 group-hover:scale-110"
                            onError={(e) => {
                              const imgEl = e.target as HTMLImageElement;
                              if (imgEl.src && !imgEl.dataset.retried) {
                                imgEl.dataset.retried = 'true';
                                if (imgEl.src.includes('/lucky12/')) {
                                  imgEl.src = imgEl.src.replace('/lucky12/', '/public/lucky12/');
                                  return;
                                }
                              }
                              imgEl.style.display = 'none';
                              const parent = imgEl.parentElement;
                              if (parent && !parent.querySelector('.fallback-icon')) {
                                const el = document.createElement('span');
                                el.className = 'fallback-icon text-5xl';
                                el.innerText = fallbackGraphic;
                                parent.appendChild(el);
                              }
                            }}
                          />
                        ) : (
                          <span className="text-5xl">{fallbackGraphic}</span>
                        )}
                      </div>

                      {/* Manual Amount Input Field */}
                      <div onClick={(e) => e.stopPropagation()} className="space-y-1.5">
                        <input
                          type="number"
                          placeholder="Enter Amount"
                          value={currentCardBet}
                          onChange={(e) => {
                            const val = parseInt(e.target.value) || 0;
                            setCardBetAmount(card.name, val);
                            if (val > 0 && !selectedCards.includes(card.name)) {
                              setSelectedCards((prev) => [...prev, card.name]);
                            } else if (val <= 0 && selectedCards.includes(card.name)) {
                              setSelectedCards((prev) => prev.filter((c) => c !== card.name));
                            }
                          }}
                          className="w-full bg-slate-950/90 border border-slate-800 focus:border-amber-400 rounded-xl px-2.5 py-1.5 text-xs font-mono font-bold text-center text-amber-300 placeholder-slate-500 focus:outline-none transition-all"
                        />

                        {/* BET Button */}
                        <button
                          onClick={() => {
                            toggleLuckyCard(card.name);
                          }}
                          className={`w-full py-1.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-1 shadow-md ${
                            isSelected
                              ? 'bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 shadow-amber-500/30'
                              : 'bg-gradient-to-r from-purple-800 to-indigo-900 hover:from-purple-700 hover:to-indigo-800 text-white'
                          }`}
                        >
                          {isSelected ? (
                            <>
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>SELECTED</span>
                            </>
                          ) : (
                            <span>BET</span>
                          )}
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Bottom Action Footer Bar: Exit Button, Last Transaction Amount, Free Buy */}
              <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800/80 backdrop-blur-2xl flex flex-col sm:flex-row items-center justify-between gap-3 shadow-2xl">
                
                {/* Exit Button */}
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => {
                    soundManager.playClick();
                    setCurrentPage('dashboard');
                  }}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-700 to-red-800 hover:from-rose-600 hover:to-red-700 text-white font-extrabold text-xs flex items-center justify-center gap-2 border border-rose-600/40 shadow-lg shadow-rose-900/30"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Exit</span>
                </motion.button>

                {/* Last Transaction Amount Box */}
                <div className="px-5 py-2 rounded-xl bg-slate-950/90 border border-slate-800 flex items-center gap-2 font-mono text-xs text-slate-300 font-bold">
                  <span className="text-slate-400">Last Trsn Amount ( ₹ )</span>
                  <span className="text-amber-400 font-extrabold text-sm">
                    {selectedCards.length > 0
                      ? selectedCards.reduce((sum, name) => sum + (cardBets[name] || 0), 0).toFixed(2)
                      : '0.00'}
                  </span>
                </div>

                {/* Free Buy & Place Bet Buttons */}
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => {
                      soundManager.playClick();
                      if (selectedCards.length === 0) {
                        const randomCard = lucky12Cards[Math.floor(Math.random() * lucky12Cards.length)];
                        setSelectedCards([randomCard.name]);
                        setCardBetAmount(randomCard.name, 10);
                        addToast('Free Buy Activated', `Selected ${randomCard.name} with free bonus credits!`, 'success');
                      } else {
                        handlePlaceBet();
                      }
                    }}
                    className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 border border-emerald-400/40 shadow-lg shadow-emerald-500/30"
                  >
                    <Gift className="w-4 h-4" />
                    <span>FREE BUY</span>
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={handlePlaceBet}
                    className="flex-1 sm:flex-initial px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:to-yellow-300 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-amber-500/30"
                  >
                    <Ticket className="w-4 h-4" />
                    <span>BUY NOW</span>
                  </motion.button>
                </div>

              </div>

            </div>
          )}

          {/* ===================== GAME 2: 3D GAME ===================== */}
          {activeTab === '3d' && (
            <div className="space-y-3.5">
              
              {/* TOP HEADER 1: Last Draw Badge + Title "Games 3D" */}
              <div className="p-3 rounded-2xl bg-gradient-to-r from-slate-900/95 via-purple-950/80 to-slate-900/95 border border-purple-500/30 backdrop-blur-2xl flex flex-col md:flex-row items-center justify-between gap-3 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent blur-xs opacity-70" />
                
                {/* Last Draw Badge */}
                <div className="px-4 py-2 rounded-xl bg-slate-950/90 border border-slate-800 text-center shrink-0 w-full md:w-auto">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Last Draw</div>
                  <div className="font-mono text-xs font-black text-amber-400">10:00 PM</div>
                </div>

                {/* Title: Games 3D */}
                <div className="flex items-center gap-3">
                  <Sparkles className="w-6 h-6 text-cyan-400 animate-spin" style={{ animationDuration: '8s' }} />
                  <h1 className="text-2xl sm:text-4xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-blue-400 to-purple-400 drop-shadow-[0_0_20px_rgba(6,182,212,0.6)] uppercase">
                    Games 3D
                  </h1>
                  <Sparkles className="w-6 h-6 text-purple-400 animate-spin" style={{ animationDuration: '8s' }} />
                </div>

                {/* Empty spacer / Quick Balance indicator */}
                <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-950/80 border border-slate-800 text-xs font-mono font-bold text-slate-300">
                  <span className="text-slate-400">Balance:</span>
                  <span className="text-emerald-400 text-sm font-black">₹{activeUser?.points.toLocaleString()}</span>
                </div>
              </div>

              {/* ABC PANELS (3 Responsive Panels A, B, C displaying result numbers) */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                
                {/* Panel A */}
                <div className="p-3 rounded-2xl bg-slate-900/90 border border-cyan-500/30 backdrop-blur-xl space-y-2 shadow-xl">
                  <div className="py-1 px-3 rounded-xl bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 text-center text-xs font-black uppercase tracking-wider">
                    Panel A
                  </div>
                  <div className="grid grid-cols-3 gap-2 bg-slate-950/90 p-2.5 rounded-xl border border-slate-800">
                    {[5, 8, 1].map((val, idx) => (
                      <div
                        key={`panelA-${idx}`}
                        className={`py-3 rounded-xl font-mono text-xl sm:text-2xl font-black text-center transition-all cursor-pointer ${
                          digit1 === val
                            ? 'bg-gradient-to-b from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/40 border border-cyan-300 scale-105'
                            : 'bg-slate-900 text-cyan-400 hover:bg-slate-800 border border-slate-800'
                        }`}
                        onClick={() => {
                          soundManager.playClick();
                          setDigit1(val);
                        }}
                      >
                        {val}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Panel B */}
                <div className="p-3 rounded-2xl bg-slate-900/90 border border-emerald-500/30 backdrop-blur-xl space-y-2 shadow-xl">
                  <div className="py-1 px-3 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-center text-xs font-black uppercase tracking-wider">
                    Panel B
                  </div>
                  <div className="grid grid-cols-3 gap-2 bg-slate-950/90 p-2.5 rounded-xl border border-slate-800">
                    {[4, 4, 7].map((val, idx) => (
                      <div
                        key={`panelB-${idx}`}
                        className={`py-3 rounded-xl font-mono text-xl sm:text-2xl font-black text-center transition-all cursor-pointer ${
                          digit2 === val
                            ? 'bg-gradient-to-b from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/40 border border-emerald-300 scale-105'
                            : 'bg-slate-900 text-emerald-400 hover:bg-slate-800 border border-slate-800'
                        }`}
                        onClick={() => {
                          soundManager.playClick();
                          setDigit2(val);
                        }}
                      >
                        {val}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Panel C */}
                <div className="p-3 rounded-2xl bg-slate-900/90 border border-blue-500/30 backdrop-blur-xl space-y-2 shadow-xl">
                  <div className="py-1 px-3 rounded-xl bg-blue-950/80 border border-blue-500/40 text-blue-300 text-center text-xs font-black uppercase tracking-wider">
                    Panel C
                  </div>
                  <div className="grid grid-cols-3 gap-2 bg-slate-950/90 p-2.5 rounded-xl border border-slate-800">
                    {[2, 4, 4].map((val, idx) => (
                      <div
                        key={`panelC-${idx}`}
                        className={`py-3 rounded-xl font-mono text-xl sm:text-2xl font-black text-center transition-all cursor-pointer ${
                          digit3 === val
                            ? 'bg-gradient-to-b from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/40 border border-blue-300 scale-105'
                            : 'bg-slate-900 text-blue-400 hover:bg-slate-800 border border-slate-800'
                        }`}
                        onClick={() => {
                          soundManager.playClick();
                          setDigit3(val);
                        }}
                      >
                        {val}
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* TOP HEADER 2: Info Widgets (Date, Time, Timeslot, Remain Time Countdown) */}
              <div className="p-2.5 rounded-2xl bg-slate-900/90 border border-slate-800/80 backdrop-blur-2xl grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs font-bold shadow-xl">
                <div className="p-2 rounded-xl bg-slate-950/90 border border-slate-800 text-slate-300 flex items-center justify-center gap-1 font-mono">
                  <span>Sat, 01-Aug-2026</span>
                </div>

                <div className="p-2 rounded-xl bg-slate-950/90 border border-slate-800 text-cyan-300 flex items-center justify-center gap-1 font-mono">
                  <span className="text-slate-400">Current Time :</span>
                  <span className="text-cyan-200 font-black">10:55:37 PM</span>
                </div>

                <div className="p-2 rounded-xl bg-slate-950/90 border border-slate-800 text-sky-300 flex items-center justify-center gap-1 font-mono">
                  <span className="text-slate-400">Current Timeslot :</span>
                  <span className="text-sky-200 font-black">11:00 PM</span>
                </div>

                <div className="p-2 rounded-xl bg-rose-950/80 border border-rose-600/60 text-rose-300 flex items-center justify-center gap-1 font-mono">
                  <Clock className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
                  <span className="text-slate-400">Remain Time :</span>
                  <span className="text-rose-400 font-black text-sm ml-1">04:23</span>
                </div>
              </div>

              {/* TOP ACTIONS BUTTONS: All, A, B, C, 2D Game, Lucky-12 */}
              <div className="p-2 rounded-2xl bg-slate-900/90 border border-slate-800/80 backdrop-blur-xl grid grid-cols-6 gap-2 shadow-xl">
                
                <button
                  onClick={() => {
                    soundManager.playClick();
                    setSelectedPanel('All');
                  }}
                  className={`py-2 px-2 rounded-xl text-xs font-black transition-all ${
                    selectedPanel === 'All'
                      ? 'bg-gradient-to-r from-red-600 to-rose-700 text-white shadow-lg shadow-red-900/50'
                      : 'bg-rose-950/60 hover:bg-rose-900/60 text-rose-300 border border-rose-800/40'
                  }`}
                >
                  All
                </button>

                <button
                  onClick={() => {
                    soundManager.playClick();
                    setSelectedPanel('A');
                  }}
                  className={`py-2 px-2 rounded-xl text-xs font-black transition-all ${
                    selectedPanel === 'A'
                      ? 'bg-gradient-to-r from-amber-600 to-orange-700 text-white shadow-lg shadow-amber-900/50'
                      : 'bg-amber-950/60 hover:bg-amber-900/60 text-amber-300 border border-amber-800/40'
                  }`}
                >
                  A
                </button>

                <button
                  onClick={() => {
                    soundManager.playClick();
                    setSelectedPanel('B');
                  }}
                  className={`py-2 px-2 rounded-xl text-xs font-black transition-all ${
                    selectedPanel === 'B'
                      ? 'bg-gradient-to-r from-amber-700 to-orange-800 text-white shadow-lg shadow-amber-900/50'
                      : 'bg-amber-950/60 hover:bg-amber-900/60 text-amber-300 border border-amber-800/40'
                  }`}
                >
                  B
                </button>

                <button
                  onClick={() => {
                    soundManager.playClick();
                    setSelectedPanel('C');
                  }}
                  className={`py-2 px-2 rounded-xl text-xs font-black transition-all ${
                    selectedPanel === 'C'
                      ? 'bg-gradient-to-r from-amber-800 to-amber-900 text-white shadow-lg shadow-amber-900/50'
                      : 'bg-amber-950/60 hover:bg-amber-900/60 text-amber-300 border border-amber-800/40'
                  }`}
                >
                  C
                </button>

                <button
                  onClick={() => {
                    soundManager.playClick();
                    setActiveTab('2d');
                  }}
                  className="py-2 px-2 rounded-xl bg-purple-900/90 hover:bg-purple-800 text-purple-200 border border-purple-500/40 text-xs font-black transition-all flex items-center justify-center gap-1 shadow-md shadow-purple-950/50"
                >
                  <Dices className="w-3.5 h-3.5" />
                  <span>2D Game</span>
                </button>

                <button
                  onClick={() => {
                    soundManager.playClick();
                    setActiveTab('lucky12');
                  }}
                  className="py-2 px-2 rounded-xl bg-emerald-950/90 hover:bg-emerald-900 text-emerald-300 border border-emerald-500/40 text-xs font-black transition-all flex items-center justify-center gap-1 shadow-md shadow-emerald-950/50"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Lucky-12</span>
                </button>

              </div>

              {/* NUMBER SELECTION BUTTONS (0 - 9) + BET TYPE BUTTONS ROW 1 */}
              <div className="p-3 rounded-2xl bg-slate-900/90 border border-slate-800/80 backdrop-blur-2xl space-y-3 shadow-xl">
                
                {/* Digits 0 - 9 and Main Bet Types Row */}
                <div className="flex flex-col lg:flex-row items-center gap-3">
                  
                  {/* Number Selection Buttons (0-9) */}
                  <div className="grid grid-cols-5 sm:grid-cols-10 gap-1.5 w-full lg:w-auto shrink-0">
                    {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                      <button
                        key={`num-btn-${num}`}
                        onClick={() => {
                          soundManager.playClick();
                          // Set active digit in order: digit1 -> digit2 -> digit3
                          if (selectedPanel === 'A') setDigit1(num);
                          else if (selectedPanel === 'B') setDigit2(num);
                          else if (selectedPanel === 'C') setDigit3(num);
                          else {
                            setDigit1(num);
                          }
                        }}
                        className="w-full h-10 rounded-xl bg-slate-950/90 hover:bg-cyan-950/80 border border-slate-800 hover:border-cyan-500/50 text-white font-mono font-black text-sm flex items-center justify-center transition-all hover:scale-105"
                      >
                        {num}
                      </button>
                    ))}
                  </div>

                  {/* Bet Type Category Row 1: Single, Double, Triple, Round, L-Pick */}
                  <div className="grid grid-cols-5 gap-1.5 w-full">
                    {['Single', 'Double', 'Triple', 'Round', 'L-Pick'].map((typeStr) => {
                      const isActive = betType3D === typeStr;
                      return (
                        <button
                          key={typeStr}
                          onClick={() => {
                            soundManager.playClick();
                            setBetType3D(typeStr);
                          }}
                          className={`py-2 px-2 rounded-xl text-xs font-black transition-all border ${
                            isActive
                              ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-cyan-300 shadow-md shadow-blue-900/50 scale-105'
                              : 'bg-slate-950/80 hover:bg-slate-800 text-slate-300 border-slate-800'
                          }`}
                        >
                          {typeStr}
                        </button>
                      );
                    })}
                  </div>

                </div>

                {/* Bet Type Category Row 2: Box, Straight, Split-Pair, Front-Pair, Back-Pair, Any-Pair */}
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5">
                  {['Box', 'Straight', 'Split-Pair', 'Front-Pair', 'Back-Pair', 'Any-Pair'].map((typeStr) => {
                    const isActive = betType3D === typeStr;
                    return (
                      <button
                        key={typeStr}
                        onClick={() => {
                          soundManager.playClick();
                          setBetType3D(typeStr);
                        }}
                        className={`py-2.5 px-2 rounded-xl text-xs font-black transition-all border ${
                          isActive
                            ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white border-amber-300 shadow-md shadow-purple-900/50 scale-105'
                            : 'bg-slate-950/80 hover:bg-slate-800 text-slate-300 border-slate-800'
                        }`}
                      >
                        {typeStr}
                      </button>
                    );
                  })}
                </div>

              </div>

              {/* BET INPUT AREA (Add Number, Range From/To, Bet Type Dropdown, Rate Selection 10,20,30,40,50,100,200) */}
              <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800/80 backdrop-blur-2xl space-y-3 shadow-2xl">
                
                <div className="flex flex-col lg:flex-row items-center justify-between gap-3">
                  
                  {/* Left Controls: Add Number Button + Range Inputs */}
                  <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
                    
                    {/* Add Number Button */}
                    <button
                      onClick={() => {
                        soundManager.playClick();
                        const combo = `${digit1}${digit2}${digit3}`;
                        setAdded3DNumbers((prev) => [...prev, { number: combo, type: betType3D, rate: selectedRate3D }]);
                        addToast('Number Added', `Added 3D number ${combo} (${betType3D}) at ₹${selectedRate3D}.`, 'success');
                      }}
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-extrabold text-xs border border-cyan-400/40 shadow-md shadow-cyan-900/30 shrink-0"
                    >
                      Add Number
                    </button>

                    {/* Range Inputs */}
                    <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-slate-300">
                      <span className="text-slate-400">Range :</span>
                      <input
                        type="number"
                        placeholder="NUM."
                        value={rangeFrom3D}
                        onChange={(e) => setRangeFrom3D(e.target.value)}
                        className="w-16 bg-slate-950 border border-slate-800 focus:border-cyan-400 rounded-lg px-2 py-1.5 text-center text-xs text-amber-300 placeholder-slate-600 focus:outline-none"
                      />
                      <span className="text-slate-400">To</span>
                      <input
                        type="number"
                        placeholder="NUM."
                        value={rangeTo3D}
                        onChange={(e) => setRangeTo3D(e.target.value)}
                        className="w-16 bg-slate-950 border border-slate-800 focus:border-cyan-400 rounded-lg px-2 py-1.5 text-center text-xs text-amber-300 placeholder-slate-600 focus:outline-none"
                      />
                    </div>

                    {/* L-P Bet Type Dropdown */}
                    <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-slate-300">
                      <span className="text-slate-400">L-P :</span>
                      <select
                        value={betType3D}
                        onChange={(e) => setBetType3D(e.target.value)}
                        className="bg-slate-950 border border-slate-800 focus:border-cyan-400 rounded-lg px-2 py-1.5 text-xs font-bold text-cyan-300 focus:outline-none"
                      >
                        {['Box', 'Straight', 'Single', 'Double', 'Triple', 'Round', 'L-Pick', 'Split-Pair', 'Front-Pair', 'Back-Pair', 'Any-Pair'].map((t) => (
                          <option key={`opt-${t}`} value={t}>{t}</option>
                        ))}
                      </select>
                    </div>

                  </div>

                  {/* Right Controls: Rate Selection (10, 20, 30, 40, 50, 100, 200) */}
                  <div className="flex items-center gap-1.5 flex-wrap w-full lg:w-auto justify-end">
                    <span className="text-xs font-mono font-bold text-slate-400 mr-1">Rate :</span>
                    {[10, 20, 30, 40, 50, 100, 200].map((rateVal) => (
                      <button
                        key={`rate-${rateVal}`}
                        onClick={() => {
                          soundManager.playClick();
                          setSelectedRate3D(rateVal);
                          setBetAmount(rateVal);
                        }}
                        className={`px-3 py-1.5 rounded-xl font-mono text-xs font-bold transition-all border ${
                          selectedRate3D === rateVal
                            ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-md font-black scale-105'
                            : 'bg-slate-950/80 hover:bg-slate-800 text-slate-300 border-slate-800'
                        }`}
                      >
                        {rateVal}
                      </button>
                    ))}
                  </div>

                </div>

                {/* DIGIT REEL EDITABLE INPUTS & PLACE 3D BET BAR */}
                <div className="p-3 rounded-xl bg-slate-950/90 border border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3">
                  
                  {/* Selected 3D combination preview */}
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">
                      Selected Combo:
                    </span>
                    <div className="flex items-center gap-1 font-mono font-black text-2xl text-amber-400">
                      <input
                        type="number"
                        min="0"
                        max="9"
                        value={digit1}
                        onChange={(e) => setDigit1(Math.min(9, Math.max(0, parseInt(e.target.value) || 0)))}
                        className="w-10 h-10 bg-slate-900 border border-slate-700 rounded-lg text-center text-amber-300 font-mono font-black text-xl focus:border-cyan-400 focus:outline-none"
                      />
                      <input
                        type="number"
                        min="0"
                        max="9"
                        value={digit2}
                        onChange={(e) => setDigit2(Math.min(9, Math.max(0, parseInt(e.target.value) || 0)))}
                        className="w-10 h-10 bg-slate-900 border border-slate-700 rounded-lg text-center text-emerald-300 font-mono font-black text-xl focus:border-cyan-400 focus:outline-none"
                      />
                      <input
                        type="number"
                        min="0"
                        max="9"
                        value={digit3}
                        onChange={(e) => setDigit3(Math.min(9, Math.max(0, parseInt(e.target.value) || 0)))}
                        className="w-10 h-10 bg-slate-900 border border-slate-700 rounded-lg text-center text-cyan-300 font-mono font-black text-xl focus:border-cyan-400 focus:outline-none"
                      />
                    </div>
                    <span className="text-xs px-2.5 py-1 rounded-full bg-purple-950 text-purple-300 border border-purple-800 font-bold">
                      {betType3D}
                    </span>
                  </div>

                  {/* Manual Quantity Input & Buy Button */}
                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5">
                      <span className="text-xs text-slate-400 font-bold">Qty / Bet: ₹</span>
                      <input
                        type="number"
                        value={betAmount}
                        onChange={(e) => setBetAmount(Math.max(1, parseInt(e.target.value) || 0))}
                        className="w-20 bg-transparent text-xs font-mono font-black text-emerald-400 focus:outline-none"
                      />
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.96 }}
                      onClick={handlePlaceBet}
                      className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:to-yellow-300 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-amber-500/30"
                    >
                      <Ticket className="w-4 h-4" />
                      <span>PLACE 3D BET</span>
                    </motion.button>
                  </div>

                </div>

              </div>

            </div>
          )}

          {/* ===================== GAME 3: 2D GAME ===================== */}
          {activeTab === '2d' && (
            <div className="space-y-3.5">
              
              {/* TOP HEADER 1: Date/Time + Top Draw Winners Bar */}
              <div className="p-2.5 rounded-2xl bg-slate-900/90 border border-slate-800/80 backdrop-blur-2xl flex flex-col md:flex-row items-center gap-2 shadow-xl overflow-hidden">
                {/* Date/Time Badge */}
                <div className="px-3 py-2 rounded-xl bg-slate-950/90 border border-slate-800 text-center shrink-0">
                  <div className="font-mono text-xs font-bold text-slate-300">2026-08-01</div>
                  <div className="font-mono text-xs font-black text-amber-400">10:00 PM</div>
                </div>

                {/* Top Winning Number Cards Bar */}
                <div className="flex items-center gap-1.5 overflow-x-auto w-full custom-scrollbar pb-1 md:pb-0">
                  {['5042', '5159', '5288', '5317', '5428', '5580', '5604', '5749', '5819', '5951'].map((num, i) => (
                    <div
                      key={`winner-${i}`}
                      className="px-3.5 py-2 rounded-xl bg-gradient-to-b from-orange-500 to-amber-600 text-slate-950 font-mono font-black text-xs shadow-md shrink-0 border border-amber-300/40 tracking-wider hover:scale-105 transition-all cursor-pointer"
                    >
                      {num}
                    </div>
                  ))}
                </div>
              </div>

              {/* TOP HEADER 2: Info Widgets (Free Points, Today, Time, Timeslot, Countdown Timer) */}
              <div className="p-2.5 rounded-2xl bg-slate-900/90 border border-slate-800/80 backdrop-blur-2xl grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 text-center text-xs font-bold shadow-xl">
                <div className="p-2 rounded-xl bg-slate-950/90 border border-slate-800 text-slate-200 flex items-center justify-center gap-1">
                  <span className="text-slate-400">{activeUser?.username || 'Anil'}'s Free Point:</span>
                  <span className="text-amber-400 font-mono font-black text-sm">{activeUser?.points || 256}</span>
                </div>

                <div className="p-2 rounded-xl bg-teal-950/60 border border-teal-800/50 text-teal-300 flex items-center justify-center gap-1">
                  <span className="text-teal-400">Today :</span>
                  <span>Sat, 01-Aug-2026</span>
                </div>

                <div className="p-2 rounded-xl bg-cyan-950/60 border border-cyan-800/50 text-cyan-300 flex items-center justify-center gap-1 font-mono">
                  <span className="text-cyan-400">Current Time :</span>
                  <span className="text-cyan-200 font-black">10:55:29</span>
                </div>

                <div className="p-2 rounded-xl bg-sky-950/60 border border-sky-800/50 text-sky-300 flex items-center justify-center gap-1 font-mono">
                  <span className="text-sky-400">Current Timeslot :</span>
                  <span className="text-cyan-300 font-black">11:00 PM</span>
                </div>

                <div className="p-2 rounded-xl bg-emerald-950/80 border border-emerald-600/60 text-emerald-300 flex items-center justify-center gap-1 col-span-2 sm:col-span-1">
                  <Clock className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                  <span className="text-emerald-400">Timer</span>
                  <span className="text-emerald-300 font-mono font-black text-sm ml-1">04:31</span>
                </div>
              </div>

              {/* ACTION BAR: Refresh, Result, History, Cancel, Advance, 3D Game, Lucky-12 */}
              <div className="p-2 rounded-2xl bg-slate-900/90 border border-slate-800/80 backdrop-blur-xl grid grid-cols-4 sm:grid-cols-7 gap-1.5 shadow-xl">
                <button
                  onClick={() => {
                    soundManager.playClick();
                    refreshData();
                    addToast('Refreshed', '2D Game grid refreshed.', 'info');
                  }}
                  className="py-2 px-2 rounded-xl bg-purple-950/80 hover:bg-purple-900/80 text-purple-300 border border-purple-500/30 text-xs font-black transition-all flex items-center justify-center gap-1"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Refresh</span>
                </button>

                <button
                  onClick={() => {
                    soundManager.playClick();
                    setCurrentPage('live_lucky12');
                  }}
                  className="py-2 px-2 rounded-xl bg-purple-950/80 hover:bg-purple-900/80 text-purple-300 border border-purple-500/30 text-xs font-black transition-all flex items-center justify-center gap-1"
                >
                  <Trophy className="w-3 h-3" />
                  <span>Result</span>
                </button>

                <button
                  onClick={() => {
                    soundManager.playClick();
                    setShowHistoryModal(true);
                  }}
                  className="py-2 px-2 rounded-xl bg-purple-950/80 hover:bg-purple-900/80 text-purple-300 border border-purple-500/30 text-xs font-black transition-all flex items-center justify-center gap-1"
                >
                  <History className="w-3 h-3" />
                  <span>History</span>
                </button>

                <button
                  onClick={() => {
                    soundManager.playClick();
                    setSelected2DNumbers([]);
                    setBoRowValues({});
                    addToast('Selection Cleared', 'All 2D bet choices reset.', 'info');
                  }}
                  className="py-2 px-2 rounded-xl bg-purple-950/80 hover:bg-purple-900/80 text-purple-300 border border-purple-500/30 text-xs font-black transition-all flex items-center justify-center gap-1"
                >
                  <X className="w-3 h-3" />
                  <span>Cancel</span>
                </button>

                <button
                  onClick={() => {
                    soundManager.playClick();
                    addToast('Advance Draw', 'Selected upcoming advance 2D draw slots.', 'info');
                  }}
                  className="py-2 px-2 rounded-xl bg-purple-950/80 hover:bg-purple-900/80 text-purple-300 border border-purple-500/30 text-xs font-black transition-all flex items-center justify-center gap-1"
                >
                  <Zap className="w-3 h-3" />
                  <span>Advance</span>
                </button>

                <button
                  onClick={() => {
                    soundManager.playClick();
                    setActiveTab('3d');
                  }}
                  className="py-2 px-2 rounded-xl bg-cyan-950/90 hover:bg-cyan-900/90 text-cyan-300 border border-cyan-500/40 text-xs font-black transition-all flex items-center justify-center gap-1"
                >
                  <Sparkles className="w-3 h-3" />
                  <span>3D Game</span>
                </button>

                <button
                  onClick={() => {
                    soundManager.playClick();
                    setActiveTab('lucky12');
                  }}
                  className="py-2 px-2 rounded-xl bg-emerald-950/90 hover:bg-emerald-900/90 text-emerald-300 border border-emerald-500/40 text-xs font-black transition-all flex items-center justify-center gap-1 col-span-2 sm:col-span-1"
                >
                  <Dices className="w-3 h-3" />
                  <span>L-12</span>
                </button>
              </div>

              {/* QUICK FILTER BAR: All, 10-19, 30-39, 50-59, EVEN, ODD, CP, FP */}
              <div className="p-2 rounded-2xl bg-slate-900/90 border border-slate-800/80 backdrop-blur-xl flex flex-wrap items-center justify-between gap-2 shadow-xl">
                <button
                  onClick={() => {
                    soundManager.playClick();
                    setQuickFilter2D('All');
                    setSelected2DNumbers([]);
                  }}
                  className={`px-4 py-1.5 rounded-xl text-xs font-black transition-all ${
                    quickFilter2D === 'All'
                      ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  All
                </button>

                <div className="flex items-center gap-2 flex-wrap">
                  {['10-19', '30-39', '50-59', 'EVEN', 'ODD', 'CP', 'FP'].map((flt) => {
                    const isActive = quickFilter2D === flt;
                    return (
                      <label
                        key={flt}
                        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl border text-xs font-black cursor-pointer transition-all ${
                          isActive
                            ? 'bg-purple-950 border-purple-400 text-purple-200'
                            : 'bg-slate-950/80 border-slate-800 text-slate-300 hover:border-slate-700'
                        }`}
                        onClick={() => {
                          soundManager.playClick();
                          setQuickFilter2D(flt);
                          const base = parseInt(selected2DRangeBlock.split('-')[0], 10) || 5000;
                          let nums: string[] = [];
                          if (flt === '10-19') {
                            nums = Array.from({ length: 10 }, (_, i) => (base + 10 + i).toString());
                          } else if (flt === '30-39') {
                            nums = Array.from({ length: 10 }, (_, i) => (base + 30 + i).toString());
                          } else if (flt === '50-59') {
                            nums = Array.from({ length: 10 }, (_, i) => (base + 50 + i).toString());
                          } else if (flt === 'EVEN') {
                            nums = Array.from({ length: 100 }, (_, i) => base + i).filter((n) => n % 2 === 0).map(String);
                          } else if (flt === 'ODD') {
                            nums = Array.from({ length: 100 }, (_, i) => base + i).filter((n) => n % 2 !== 0).map(String);
                          } else if (flt === 'CP' || flt === 'FP') {
                            nums = Array.from({ length: 10 }, (_, i) => (base + i * 11).toString());
                          }
                          setSelected2DNumbers(nums);
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={isActive}
                          readOnly
                          className="w-3.5 h-3.5 rounded bg-slate-900 border-slate-700 text-purple-500 focus:ring-0"
                        />
                        <span>{flt}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* MAIN SECTION: LEFT RANGE BLOCK SIDEBAR + NUMBER GRID TABLE */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
                
                {/* LEFT SIDEBAR: SELECTABLE RANGE BLOCKS */}
                <div className="md:col-span-3 lg:col-span-2 space-y-1.5 p-2 rounded-2xl bg-slate-900/90 border border-slate-800/80 backdrop-blur-xl shadow-xl">
                  <div className="text-[11px] font-black uppercase text-purple-400 tracking-wider px-2 py-1 flex items-center justify-between border-b border-slate-800/80 mb-1">
                    <span>Range Blocks</span>
                    <Layers className="w-3.5 h-3.5" />
                  </div>

                  {[
                    '5000-5099',
                    '5100-5199',
                    '5200-5299',
                    '5300-5399',
                    '5400-5499',
                    '5500-5599',
                    '5600-5699',
                    '5700-5799',
                    '5800-5899',
                    '5900-5999',
                  ].map((rangeStr) => {
                    const isSelected = selected2DRangeBlock === rangeStr;
                    return (
                      <button
                        key={rangeStr}
                        onClick={() => {
                          soundManager.playClick();
                          setSelected2DRangeBlock(rangeStr);
                          setSelected2DNumbers([]);
                        }}
                        className={`w-full py-2 px-2.5 rounded-xl text-xs font-mono font-bold flex items-center gap-2 border transition-all ${
                          isSelected
                            ? 'bg-gradient-to-r from-purple-900 to-indigo-900 border-purple-400 text-white shadow-lg shadow-purple-900/40'
                            : 'bg-slate-950/80 border-slate-800/80 text-slate-300 hover:bg-slate-800/60'
                        }`}
                      >
                        <div className={`w-3.5 h-3.5 rounded border flex items-center justify-center shrink-0 ${
                          isSelected ? 'bg-amber-400 border-amber-300 text-slate-950' : 'border-slate-700 bg-slate-900'
                        }`}>
                          {isSelected && <CheckCircle2 className="w-3 h-3" />}
                        </div>
                        <span>{rangeStr}</span>
                      </button>
                    );
                  })}
                </div>

                {/* RIGHT: RESPONSIVE NUMBER GRID TABLE */}
                <div className="md:col-span-9 lg:col-span-10 p-3 rounded-2xl bg-slate-900/90 border border-slate-800/80 backdrop-blur-2xl shadow-2xl overflow-x-auto custom-scrollbar">
                  {(() => {
                    const base2D = parseInt(selected2DRangeBlock.split('-')[0], 10) || 5000;
                    const rows = ['F0', 'F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7', 'F8', 'F9'];

                    return (
                      <table className="w-full text-center text-xs font-mono border-collapse min-w-[700px]">
                        <thead>
                          <tr className="border-b border-slate-800 text-slate-400 font-extrabold text-[11px] uppercase">
                            <th className="py-2 px-1 text-purple-400">BLOCK</th>
                            <th className="py-2 px-1 text-slate-300">BO</th>
                            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((colIdx) => (
                              <th key={`col-head-${colIdx}`} className="py-2 px-1 text-amber-300">
                                {colIdx}
                              </th>
                            ))}
                            <th className="py-2 px-1 text-purple-300">C</th>
                            <th className="py-2 px-1 text-purple-300">F</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/60">
                          {rows.map((rowKey, rowIdx) => {
                            const rowStartNum = base2D + rowIdx * 10;
                            const rowNums = Array.from({ length: 10 }, (_, i) => (rowStartNum + i).toString());
                            const selectedCountInRow = rowNums.filter((n) => selected2DNumbers.includes(n)).length;
                            const boValue = boRowValues[rowKey] || '';

                            return (
                              <tr key={rowKey} className="hover:bg-slate-800/30 transition-colors">
                                {/* Block Label e.g. F0, F1 */}
                                <td className="py-1.5 px-1 font-black text-amber-400 text-xs">
                                  {rowKey}
                                </td>

                                {/* BO Quantity Input Box */}
                                <td className="py-1.5 px-1">
                                  <input
                                    type="number"
                                    placeholder=""
                                    value={boValue}
                                    onChange={(e) => {
                                      const val = e.target.value;
                                      setBoRowValues((prev) => ({ ...prev, [rowKey]: val }));
                                      if (val && parseInt(val, 10) > 0) {
                                        // Auto select all 10 numbers in this row
                                        setSelected2DNumbers((prev) => Array.from(new Set([...prev, ...rowNums])));
                                      } else if (!val) {
                                        // Deselect numbers in this row if cleared
                                        setSelected2DNumbers((prev) => prev.filter((n) => !rowNums.includes(n)));
                                      }
                                    }}
                                    className="w-10 h-7 bg-slate-950 border border-slate-700 focus:border-amber-400 rounded-md text-center text-xs font-bold text-amber-300 focus:outline-none"
                                  />
                                </td>

                                {/* 10 Number Cells */}
                                {rowNums.map((numStr) => {
                                  const isSelected = selected2DNumbers.includes(numStr);
                                  return (
                                    <td key={numStr} className="py-1.5 px-1">
                                      <button
                                        onClick={() => toggle2DNumber(numStr)}
                                        className={`w-full py-1.5 px-1 rounded-lg font-mono font-extrabold text-xs transition-all border ${
                                          isSelected
                                            ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white border-amber-300 shadow-md shadow-purple-900/50 scale-105'
                                            : 'bg-slate-950/80 hover:bg-slate-800 text-slate-200 border-slate-800/80'
                                        }`}
                                      >
                                        {numStr}
                                      </button>
                                    </td>
                                  );
                                })}

                                {/* C Column: Count of selected numbers in row */}
                                <td className="py-1.5 px-1 font-black text-purple-400 bg-purple-950/30">
                                  {selectedCountInRow}
                                </td>

                                {/* F Column: Total Front Count / BO */}
                                <td className="py-1.5 px-1 font-black text-purple-400 bg-purple-950/30">
                                  {boValue ? parseInt(boValue, 10) * 10 : selectedCountInRow * 10}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    );
                  })()}
                </div>

              </div>

              {/* BOTTOM BAR: LOGOUT, CHANGE PASSWORD, FREE BUY, BUY NOW */}
              <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800/80 backdrop-blur-2xl flex flex-col sm:flex-row items-center justify-between gap-3 shadow-2xl">
                
                {/* Logout Button */}
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => {
                    soundManager.playClick();
                    setCurrentPage('dashboard');
                  }}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-rose-700 to-red-800 hover:from-rose-600 hover:to-red-700 text-white font-extrabold text-xs flex items-center justify-center gap-2 border border-rose-600/40 shadow-lg shadow-rose-900/30"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </motion.button>

                {/* Change Password Button */}
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => {
                    soundManager.playClick();
                    setCurrentPage('profile');
                  }}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-800 to-indigo-900 hover:from-purple-700 hover:to-indigo-800 text-white font-extrabold text-xs flex items-center justify-center gap-2 border border-purple-500/40 shadow-lg shadow-purple-900/30"
                >
                  <KeyRound className="w-4 h-4" />
                  <span>C-Password</span>
                </motion.button>

                {/* Free Buy Central Button */}
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => {
                    soundManager.playClick();
                    if (selected2DNumbers.length === 0) {
                      const base = parseInt(selected2DRangeBlock.split('-')[0], 10) || 5000;
                      const rand = (base + Math.floor(Math.random() * 100)).toString();
                      setSelected2DNumbers([rand]);
                      addToast('Free Buy Activated!', `Selected random number ${rand} with free points!`, 'success');
                    } else {
                      handlePlaceBet();
                    }
                  }}
                  className="w-full sm:flex-1 py-2.5 px-8 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 border border-emerald-400/40 shadow-lg shadow-emerald-500/30"
                >
                  <Gift className="w-4 h-4" />
                  <span>Free Buy</span>
                </motion.button>

                {/* BUY NOW Button */}
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={handlePlaceBet}
                  className="w-full sm:w-auto px-8 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:to-yellow-300 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-amber-500/30 shrink-0"
                >
                  <Ticket className="w-4 h-4" />
                  <span>BUY NOW (₹{(betAmount * Math.max(1, selected2DNumbers.length)).toLocaleString()})</span>
                </motion.button>

              </div>

            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* History Modal */}
      <AnimatePresence>
        {showHistoryModal && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-2xl p-6 space-y-4 shadow-2xl max-h-[85vh] overflow-y-auto custom-scrollbar"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <h3 className="text-lg font-black text-white flex items-center gap-2">
                  <History className="w-5 h-5 text-cyan-400" />
                  My Recent Bet History
                </h3>
                <button
                  onClick={() => setShowHistoryModal(false)}
                  className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3">
                {userTickets.length === 0 ? (
                  <p className="text-xs text-slate-500 text-center py-8">No bet history found.</p>
                ) : (
                  userTickets.map((tkt) => (
                    <div
                      key={tkt.id}
                      className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center justify-between gap-4"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-cyan-400">#{tkt.ticketNo}</span>
                          <span className="text-xs font-bold text-white">{tkt.gameType}</span>
                        </div>
                        <span className="text-xs font-mono text-slate-400 mt-1 block">
                          Selections: {tkt.selectedNumbers.join(', ')}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="font-mono text-sm font-black text-emerald-400 block">
                          ₹{tkt.betAmount.toLocaleString()}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full inline-block mt-1 ${
                            tkt.status === 'Won'
                              ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                              : 'bg-amber-950 text-amber-300 border border-amber-800'
                          }`}
                        >
                          {tkt.status}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Deposit Request Modal */}
      <AnimatePresence>
        {showDepositModal && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md p-6 space-y-5 shadow-2xl"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-black text-white flex items-center gap-2">
                  <Wallet className="w-5 h-5 text-emerald-400" />
                  Deposit Wallet Points
                </h3>
                <button
                  onClick={() => setShowDepositModal(false)}
                  className="text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300">Amount (₹)</label>
                <input
                  type="number"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(parseInt(e.target.value) || 0)}
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-2xl text-white font-mono text-lg font-bold focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowDepositModal(false)}
                  className="w-1/2 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  onClick={handleRequestPoints}
                  className="w-1/2 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black shadow-lg shadow-emerald-500/20"
                >
                  Submit Deposit
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Notifications Modal */}
      <AnimatePresence>
        {showNotificationsModal && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg p-6 space-y-4 shadow-2xl max-h-[80vh] overflow-y-auto custom-scrollbar"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <h3 className="text-lg font-black text-white flex items-center gap-2">
                  <Bell className="w-5 h-5 text-purple-400 animate-bounce" />
                  Player Notifications
                </h3>
                <button
                  onClick={() => setShowNotificationsModal(false)}
                  className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3">
                {(!notifications || notifications.length === 0) ? (
                  <div className="p-8 text-center text-slate-500 text-xs font-mono">
                    No active notifications at this time.
                  </div>
                ) : (
                  notifications.map((notif) => (
                    <div
                      key={notif.id}
                      className="p-4 rounded-2xl bg-slate-950/90 border border-slate-800 space-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-white">{notif.title}</span>
                        <span className="text-[10px] text-slate-500 font-mono">{notif.timestamp}</span>
                      </div>
                      <p className="text-xs text-slate-400">{notif.message}</p>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
