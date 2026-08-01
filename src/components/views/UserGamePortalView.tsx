import React, { useState, useEffect } from 'react';
import { useAdmin } from '../../context/AdminContext';
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
  Search,
  Check,
  X,
  History,
  Info,
  ChevronRight,
  Filter,
} from 'lucide-react';

export const UserGamePortalView: React.FC = () => {
  const {
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
  } = useAdmin();

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
  const [betType3D, setBetType3D] = useState<'Straight' | 'Box' | 'Single' | 'Double' | 'Triple' | 'Pair' | 'Split'>('Straight');
  const [digit1, setDigit1] = useState<number>(4);
  const [digit2, setDigit2] = useState<number>(8);
  const [digit3, setDigit3] = useState<number>(9);
  const [selectedPanel, setSelectedPanel] = useState<'A' | 'B' | 'C' | 'ABC'>('ABC');

  // ------------------ 2D GAME STATE ------------------
  const [selected2DNumbers, setSelected2DNumbers] = useState<string[]>([]);
  const [searchQuery2D, setSearchQuery2D] = useState<string>('');
  const [active2DRange, setActive2DRange] = useState<string>('all');

  // Modals
  const [showDepositModal, setShowDepositModal] = useState<boolean>(false);
  const [depositAmount, setDepositAmount] = useState<number>(1000);
  const [showHistoryModal, setShowHistoryModal] = useState<boolean>(false);

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

  return (
    <div className="space-y-6 pb-12">
      
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
            <div className="space-y-6">
              
              {/* Lucky 12 Info Bar */}
              <div className="p-4 sm:p-5 rounded-3xl bg-slate-900/80 border border-amber-500/30 backdrop-blur-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-[0_0_30px_rgba(245,158,11,0.1)]">
                <div>
                  <div className="flex items-center gap-2">
                    <Flame className="w-5 h-5 text-amber-400 animate-pulse" />
                    <h2 className="text-base sm:text-lg font-black text-white tracking-wide">LUCKY-12 ARENA</h2>
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-bold">
                      10x WIN
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    Select 1 or more lucky cards below. Enter wager amount and click <strong className="text-amber-400">BUY NOW</strong> to confirm.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      const allNames = lucky12Cards.map((c) => c.name);
                      setSelectedCards(allNames);
                      soundManager.playClick();
                    }}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all border border-slate-700"
                  >
                    Select All 12
                  </button>
                  <button
                    onClick={handleClearLucky12}
                    className="px-3 py-1.5 rounded-xl bg-rose-950/60 hover:bg-rose-900/60 text-rose-300 border border-rose-800/60 text-xs font-bold transition-all"
                  >
                    Clear All
                  </button>
                </div>
              </div>

              {/* 12 Cards Responsive Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {lucky12Cards.map((card) => {
                  const isSelected = selectedCards.includes(card.name);
                  const currentCardBet = cardBets[card.name] || betAmount;

                  return (
                    <motion.div
                      key={card.id}
                      whileHover={{ scale: 1.04, y: -4 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => toggleLuckyCard(card.name)}
                      className={`relative rounded-3xl p-4 border transition-all cursor-pointer flex flex-col justify-between gap-3 backdrop-blur-xl ${
                        isSelected
                          ? 'bg-gradient-to-b from-slate-900 via-slate-900 to-amber-950/90 border-amber-400 shadow-[0_0_25px_rgba(245,158,11,0.35)] ring-2 ring-amber-400/60'
                          : 'bg-slate-900/70 border-slate-800 hover:border-amber-500/40 hover:bg-slate-800/80 text-slate-300'
                      }`}
                    >
                      {/* Top Card Badge */}
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs font-black text-amber-400 bg-slate-950/80 px-2.5 py-1 rounded-xl border border-slate-800">
                          #{card.cardNo.toString().padStart(2, '0')}
                        </span>
                        <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
                          {card.multiplier}
                        </span>
                      </div>

                      {/* Card Image / Icon */}
                      <div className="w-full h-24 rounded-2xl bg-slate-950/90 border border-slate-800 flex items-center justify-center p-2 relative overflow-hidden group shadow-inner">
                        {isSelected && (
                          <div className="absolute inset-0 bg-amber-500/10 backdrop-blur-[1px] animate-pulse" />
                        )}
                        {card.imageUrl ? (
                          <img
                            src={card.imageUrl}
                            alt={card.name}
                            className="w-full h-full object-contain drop-shadow-[0_5px_15px_rgba(0,0,0,0.8)] transition-transform duration-300 group-hover:scale-110"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = 'none';
                              const parent = (e.target as HTMLImageElement).parentElement;
                              if (parent && !parent.querySelector('.fallback-card-icon')) {
                                const fallback = document.createElement('span');
                                fallback.className = 'fallback-card-icon text-5xl';
                                fallback.innerText = card.icon || '👑';
                                parent.appendChild(fallback);
                              }
                            }}
                          />
                        ) : (
                          <span className="text-5xl">{card.icon}</span>
                        )}
                      </div>

                      {/* Card Title */}
                      <div className="text-center">
                        <h4 className="text-xs font-black text-white tracking-wide flex items-center justify-center gap-1">
                          <span>{card.icon}</span>
                          <span>{card.name}</span>
                        </h4>
                      </div>

                      {/* Bet Input per Card */}
                      <div
                        onClick={(e) => e.stopPropagation()}
                        className="space-y-1.5"
                      >
                        <div className="flex items-center gap-1 bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1">
                          <span className="text-[10px] text-slate-500 font-bold">₹</span>
                          <input
                            type="number"
                            value={currentCardBet}
                            onChange={(e) => {
                              const val = Math.max(1, parseInt(e.target.value) || 0);
                              setCardBetAmount(card.name, val);
                              if (!selectedCards.includes(card.name)) {
                                setSelectedCards((prev) => [...prev, card.name]);
                              }
                            }}
                            className="w-full bg-transparent text-xs font-mono font-black text-amber-300 focus:outline-none text-center"
                            placeholder="Bet ₹"
                          />
                        </div>

                        <div
                          className={`w-full py-1.5 rounded-xl text-[11px] font-black uppercase tracking-wider text-center transition-all flex items-center justify-center gap-1 ${
                            isSelected
                              ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/30'
                              : 'bg-slate-800 text-slate-400 group-hover:text-white'
                          }`}
                        >
                          {isSelected ? (
                            <>
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Selected</span>
                            </>
                          ) : (
                            <span>Tap to Select</span>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Lucky 12 Bottom Action Controls Bar: Buy Button, Cancel Button, History Button */}
              <div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 backdrop-blur-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-2xl">
                <div>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                    Total Wager Summary
                  </span>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-sm text-slate-300 font-medium">
                      Selected: <strong className="text-amber-400 font-bold">{selectedCards.length} Cards</strong>
                    </span>
                    <span className="text-xl font-black text-emerald-400 font-mono">
                      ₹{selectedCards.reduce((sum, name) => sum + (cardBets[name] || betAmount), 0).toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {/* Cancel Button */}
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={handleClearLucky12}
                    className="px-4 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all border border-slate-700"
                  >
                    Cancel Selection
                  </motion.button>

                  {/* History Button */}
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => {
                      soundManager.playClick();
                      setShowHistoryModal(true);
                    }}
                    className="px-4 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-cyan-400 text-xs font-bold transition-all border border-cyan-500/30 flex items-center gap-1.5"
                  >
                    <History className="w-4 h-4" />
                    <span>Bet History</span>
                  </motion.button>

                  {/* Buy Button */}
                  <motion.button
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={handlePlaceBet}
                    className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600 text-slate-950 font-black text-sm uppercase tracking-wider shadow-[0_0_25px_rgba(245,158,11,0.4)] hover:shadow-[0_0_35px_rgba(245,158,11,0.6)] transition-all flex items-center gap-2"
                  >
                    <Ticket className="w-5 h-5" />
                    <span>BUY NOW</span>
                  </motion.button>
                </div>
              </div>

            </div>
          )}

          {/* ===================== GAME 2: 3D GAME ===================== */}
          {activeTab === '3d' && (
            <div className="space-y-6">
              
              {/* 3D Header Info */}
              <div className="p-4 sm:p-5 rounded-3xl bg-slate-900/80 border border-purple-500/30 backdrop-blur-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-[0_0_30px_rgba(168,85,247,0.1)]">
                <div>
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-purple-400 animate-spin" style={{ animationDuration: '6s' }} />
                    <h2 className="text-base sm:text-lg font-black text-white tracking-wide">3D GAME PREDICTOR</h2>
                    <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40 text-[10px] font-bold">
                      900x WIN
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    Select your ABC Panel digits, choose combination mode, and place your wager.
                  </p>
                </div>

                {/* Bet Type Tabs: Single, Double, Triple, Straight, Box, Pair, Split */}
                <div className="flex items-center gap-1.5 overflow-x-auto custom-scrollbar pb-1 sm:pb-0">
                  {['Straight', 'Box', 'Single', 'Double', 'Triple', 'Pair', 'Split'].map((mode) => (
                    <button
                      key={mode}
                      onClick={() => {
                        soundManager.playClick();
                        setBetType3D(mode as any);
                      }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all ${
                        betType3D === mode
                          ? 'bg-purple-600 text-white shadow-md shadow-purple-600/40'
                          : 'bg-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {mode}
                    </button>
                  ))}
                </div>
              </div>

              {/* ABC Panel Reel Selectors */}
              <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-slate-800 backdrop-blur-2xl shadow-2xl space-y-6">
                
                {/* Panel Indicator */}
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-purple-400 uppercase tracking-wider flex items-center gap-2">
                    <Layers className="w-4 h-4" />
                    <span>ABC Panel Selectors</span>
                  </span>
                  <span className="text-xs text-slate-400">
                    Mode: <strong className="text-purple-300 font-bold">{betType3D}</strong>
                  </span>
                </div>

                {/* 3 Reels Display */}
                <div className="grid grid-cols-3 gap-4 sm:gap-6 bg-slate-950/80 p-5 sm:p-8 rounded-3xl border border-slate-800">
                  
                  {/* Digit 1 - Panel A */}
                  <div className="text-center space-y-4">
                    <span className="text-xs font-black uppercase text-purple-400 tracking-wider block">
                      Panel A
                    </span>
                    <motion.div
                      key={digit1}
                      initial={{ scale: 1.2, color: '#c084fc' }}
                      animate={{ scale: 1, color: '#ffffff' }}
                      className="text-4xl sm:text-6xl font-black font-mono bg-slate-900/90 py-5 sm:py-6 rounded-3xl border border-purple-500/40 shadow-inner"
                    >
                      {digit1}
                    </motion.div>
                    <div className="flex justify-center gap-1.5 flex-wrap">
                      {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
                        <button
                          key={`digit1-${n}`}
                          onClick={() => {
                            soundManager.playClick();
                            setDigit1(n);
                          }}
                          className={`w-7 h-7 sm:w-8 sm:h-8 rounded-xl font-mono font-bold text-xs transition-all ${
                            digit1 === n
                              ? 'bg-purple-600 text-white shadow-md scale-110'
                              : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                          }`}
                        >
                          {n}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Digit 2 - Panel B */}
                  <div className="text-center space-y-4">
                    <span className="text-xs font-black uppercase text-purple-400 tracking-wider block">
                      Panel B
                    </span>
                    <motion.div
                      key={digit2}
                      initial={{ scale: 1.2, color: '#c084fc' }}
                      animate={{ scale: 1, color: '#ffffff' }}
                      className="text-4xl sm:text-6xl font-black font-mono bg-slate-900/90 py-5 sm:py-6 rounded-3xl border border-purple-500/40 shadow-inner"
                    >
                      {digit2}
                    </motion.div>
                    <div className="flex justify-center gap-1.5 flex-wrap">
                      {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
                        <button
                          key={`digit2-${n}`}
                          onClick={() => {
                            soundManager.playClick();
                            setDigit2(n);
                          }}
                          className={`w-7 h-7 sm:w-8 sm:h-8 rounded-xl font-mono font-bold text-xs transition-all ${
                            digit2 === n
                              ? 'bg-purple-600 text-white shadow-md scale-110'
                              : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                          }`}
                        >
                          {n}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Digit 3 - Panel C */}
                  <div className="text-center space-y-4">
                    <span className="text-xs font-black uppercase text-purple-400 tracking-wider block">
                      Panel C
                    </span>
                    <motion.div
                      key={digit3}
                      initial={{ scale: 1.2, color: '#c084fc' }}
                      animate={{ scale: 1, color: '#ffffff' }}
                      className="text-4xl sm:text-6xl font-black font-mono bg-slate-900/90 py-5 sm:py-6 rounded-3xl border border-purple-500/40 shadow-inner"
                    >
                      {digit3}
                    </motion.div>
                    <div className="flex justify-center gap-1.5 flex-wrap">
                      {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
                        <button
                          key={`digit3-${n}`}
                          onClick={() => {
                            soundManager.playClick();
                            setDigit3(n);
                          }}
                          className={`w-7 h-7 sm:w-8 sm:h-8 rounded-xl font-mono font-bold text-xs transition-all ${
                            digit3 === n
                              ? 'bg-purple-600 text-white shadow-md scale-110'
                              : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                          }`}
                        >
                          {n}
                        </button>
                      ))}
                    </div>
                  </div>

                </div>

                {/* Triple Quick Presets */}
                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                  <span className="text-xs text-slate-400 font-bold uppercase shrink-0">Triplets:</span>
                  {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((val) => (
                    <button
                      key={`triple-${val}`}
                      onClick={() => set3DTriplePreset(val)}
                      className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-purple-900/60 text-slate-300 text-xs font-mono font-bold transition-all border border-slate-700 shrink-0"
                    >
                      {val}{val}{val}
                    </button>
                  ))}
                </div>

                {/* Wager Input & Place Bet */}
                <div className="p-5 rounded-2xl bg-purple-950/30 border border-purple-800/40 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <span className="text-xs text-slate-400 font-bold block">Selected 3D Combination:</span>
                    <span className="text-3xl font-black font-mono text-purple-300">
                      {digit1}{digit2}{digit3}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1 bg-slate-950 border border-slate-800 rounded-2xl px-3 py-2">
                      <span className="text-xs text-slate-400 font-bold">Wager: ₹</span>
                      <input
                        type="number"
                        value={betAmount}
                        onChange={(e) => setBetAmount(Math.max(1, parseInt(e.target.value) || 0))}
                        className="w-24 bg-transparent text-sm font-mono font-black text-emerald-400 focus:outline-none"
                      />
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.96 }}
                      onClick={handlePlaceBet}
                      className="px-6 py-3 rounded-2xl bg-gradient-to-r from-purple-500 via-indigo-600 to-purple-700 text-white font-black text-sm uppercase tracking-wider shadow-[0_0_25px_rgba(168,85,247,0.4)] hover:shadow-[0_0_35px_rgba(168,85,247,0.6)] transition-all flex items-center gap-2"
                    >
                      <Ticket className="w-5 h-5" />
                      <span>PLACE 3D BET</span>
                    </motion.button>
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* ===================== GAME 3: 2D GAME ===================== */}
          {activeTab === '2d' && (
            <div className="space-y-6">
              
              {/* 2D Header Bar */}
              <div className="p-4 sm:p-5 rounded-3xl bg-slate-900/80 border border-cyan-500/30 backdrop-blur-xl flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-[0_0_30px_rgba(14,165,233,0.1)]">
                <div>
                  <div className="flex items-center gap-2">
                    <Dices className="w-5 h-5 text-cyan-400 animate-pulse" />
                    <h2 className="text-base sm:text-lg font-black text-white tracking-wide">2D NUMBER GRID (00 - 99)</h2>
                    <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-[10px] font-bold">
                      90x WIN
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    Select 2-digit numbers manually or use Quick Select filters.
                  </p>
                </div>

                {/* Search Bar for 2D Numbers */}
                <div className="relative w-full md:w-64">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search Number (e.g. 48)"
                    value={searchQuery2D}
                    onChange={(e) => setSearchQuery2D(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-white focus:outline-none focus:border-cyan-500"
                  />
                  {searchQuery2D && (
                    <button
                      onClick={() => setSearchQuery2D('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Quick Filter Controls: Even/Odd, Small/Big, Range Selection, Quick Select */}
              <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold text-slate-400 flex items-center gap-1 mr-2">
                  <Filter className="w-3.5 h-3.5 text-cyan-400" />
                  Quick Filters:
                </span>

                <button
                  onClick={() => select2DFilter('even')}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all"
                >
                  Even Numbers
                </button>
                <button
                  onClick={() => select2DFilter('odd')}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all"
                >
                  Odd Numbers
                </button>
                <button
                  onClick={() => select2DFilter('small')}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all"
                >
                  Small (00-49)
                </button>
                <button
                  onClick={() => select2DFilter('big')}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all"
                >
                  Big (50-99)
                </button>
                <button
                  onClick={() => select2DFilter('random5')}
                  className="px-3 py-1.5 rounded-xl bg-cyan-950/60 text-cyan-300 border border-cyan-500/30 text-xs font-bold transition-all"
                >
                  Random 5
                </button>
                <button
                  onClick={() => select2DFilter('random10')}
                  className="px-3 py-1.5 rounded-xl bg-cyan-950/60 text-cyan-300 border border-cyan-500/30 text-xs font-bold transition-all"
                >
                  Random 10
                </button>

                {/* Range Selection Dropdown */}
                <select
                  value={active2DRange}
                  onChange={(e) => setActive2DRange(e.target.value)}
                  className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-bold text-slate-300 focus:outline-none focus:border-cyan-500 ml-auto"
                >
                  <option value="all">All Ranges (00-99)</option>
                  <option value="00-19">Range 00 - 19</option>
                  <option value="20-39">Range 20 - 39</option>
                  <option value="40-59">Range 40 - 59</option>
                  <option value="60-79">Range 60 - 79</option>
                  <option value="80-99">Range 80 - 99</option>
                </select>

                <button
                  onClick={() => select2DFilter('clear')}
                  className="px-3 py-1.5 rounded-xl bg-rose-950/60 text-rose-300 border border-rose-800/60 text-xs font-bold transition-all"
                >
                  Clear
                </button>
              </div>

              {/* Responsive 2D Number Grid */}
              <div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 backdrop-blur-2xl shadow-2xl">
                <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-2 max-h-[420px] overflow-y-auto p-2 bg-slate-950/80 rounded-2xl border border-slate-800 custom-scrollbar">
                  {filtered2DNumbers.map((numStr) => {
                    const isSelected = selected2DNumbers.includes(numStr);
                    return (
                      <motion.button
                        key={numStr}
                        whileHover={{ scale: 1.08 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => toggle2DNumber(numStr)}
                        className={`h-11 rounded-2xl font-mono text-sm font-black transition-all flex items-center justify-center ${
                          isSelected
                            ? 'bg-gradient-to-tr from-cyan-500 via-blue-600 to-purple-600 text-white shadow-[0_0_18px_rgba(14,165,233,0.4)] border border-cyan-300'
                            : 'bg-slate-900/90 hover:bg-slate-800 text-slate-300 border border-slate-800'
                        }`}
                      >
                        {numStr}
                      </motion.button>
                    );
                  })}
                </div>

                {/* 2D Bottom Summary & Place Bet */}
                <div className="mt-5 p-4 rounded-2xl bg-slate-950/80 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <span className="text-xs text-slate-400 font-bold block">
                      Selected Numbers: <strong className="text-cyan-400 font-bold">{selected2DNumbers.length}</strong>
                    </span>
                    <span className="text-xl font-black text-emerald-400 font-mono">
                      Total Wager: ₹{(betAmount * selected2DNumbers.length).toLocaleString()}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2">
                      <span className="text-xs text-slate-400 font-bold">Bet/Number: ₹</span>
                      <input
                        type="number"
                        value={betAmount}
                        onChange={(e) => setBetAmount(Math.max(1, parseInt(e.target.value) || 0))}
                        className="w-20 bg-transparent text-xs font-mono font-bold text-cyan-300 focus:outline-none"
                      />
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.96 }}
                      onClick={handlePlaceBet}
                      className="px-6 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-600 to-cyan-600 text-slate-950 font-black text-sm uppercase tracking-wider shadow-[0_0_25px_rgba(14,165,233,0.4)] hover:shadow-[0_0_35px_rgba(14,165,233,0.6)] transition-all flex items-center gap-2"
                    >
                      <Ticket className="w-5 h-5" />
                      <span>PLACE 2D BET</span>
                    </motion.button>
                  </div>
                </div>

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

    </div>
  );
};
