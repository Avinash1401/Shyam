import React, { useState, useEffect } from 'react';
import { useAdmin } from '../../context/AdminContext';
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
  TrendingUp,
} from 'lucide-react';

export const UserGamePortalView: React.FC = () => {
  const { users, gameTickets, liveResults, placeBet, adjustPoints, addToast, lucky12Cards } = useAdmin();

  // Active user account for gaming simulation (defaults to player_suresh or first user)
  const activeUser = users.find((u) => u.username === 'player_suresh') || users[0];

  const [activeTab, setActiveTab] = useState<'2d' | '3d' | 'lucky12'>('2d');
  const [betAmount, setBetAmount] = useState<number>(100);

  // Selections
  const [selected2DNumbers, setSelected2DNumbers] = useState<string[]>([]);
  const [digit1, setDigit1] = useState<number>(4);
  const [digit2, setDigit2] = useState<number>(8);
  const [digit3, setDigit3] = useState<number>(9);
  const [selectedCards, setSelectedCards] = useState<string[]>([]);

  // Timers
  const [timeLeft2D, setTimeLeft2D] = useState<number>(165); // 2 mins 45s
  const [timeLeft3D, setTimeLeft3D] = useState<number>(72);  // 1 min 12s
  const [timeLeftLucky, setTimeLeftLucky] = useState<number>(38); // 38s

  // Modal for deposit request
  const [showDepositModal, setShowDepositModal] = useState<boolean>(false);
  const [depositAmount, setDepositAmount] = useState<number>(1000);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft2D((prev) => (prev > 1 ? prev - 1 : 180));
      setTimeLeft3D((prev) => (prev > 1 ? prev - 1 : 120));
      setTimeLeftLucky((prev) => (prev > 1 ? prev - 1 : 60));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // 12 Lucky Symbols
  const luckyCards = [
    { id: 'c1', name: 'Golden Crown', icon: '👑', multiplier: '10x' },
    { id: 'c2', name: 'Lucky Seven', icon: '7️⃣', multiplier: '10x' },
    { id: 'c3', name: 'Royal Diamond', icon: '💎', multiplier: '10x' },
    { id: 'c4', name: 'Mystic Star', icon: '⭐', multiplier: '10x' },
    { id: 'c5', name: 'Golden Horseshoe', icon: '🧲', multiplier: '10x' },
    { id: 'c6', name: 'Dragon Fortune', icon: '🐉', multiplier: '10x' },
    { id: 'c7', name: 'Golden Lotus', icon: '🪷', multiplier: '10x' },
    { id: 'c8', name: 'Royal Eagle', icon: '🦅', multiplier: '10x' },
    { id: 'c9', name: 'Fire Phoenix', icon: '🔥', multiplier: '10x' },
    { id: 'c10', name: 'Jade Lion', icon: '🦁', multiplier: '10x' },
    { id: 'c11', name: 'Ace of Spades', icon: '♠️', multiplier: '10x' },
    { id: 'c12', name: 'Sun God', icon: '☀️', multiplier: '10x' },
  ];

  const toggle2DNumber = (numStr: string) => {
    if (selected2DNumbers.includes(numStr)) {
      setSelected2DNumbers((prev) => prev.filter((n) => n !== numStr));
    } else {
      setSelected2DNumbers((prev) => [...prev, numStr]);
    }
  };

  const select2DPreset = (preset: 'odd' | 'even' | 'clear' | 'random5') => {
    if (preset === 'clear') {
      setSelected2DNumbers([]);
    } else if (preset === 'even') {
      const evens = Array.from({ length: 100 }, (_, i) => i.toString().padStart(2, '0')).filter(
        (n) => parseInt(n, 10) % 2 === 0
      );
      setSelected2DNumbers(evens.slice(0, 20));
    } else if (preset === 'odd') {
      const odds = Array.from({ length: 100 }, (_, i) => i.toString().padStart(2, '0')).filter(
        (n) => parseInt(n, 10) % 2 !== 0
      );
      setSelected2DNumbers(odds.slice(0, 20));
    } else if (preset === 'random5') {
      const picks: string[] = [];
      while (picks.length < 5) {
        const rand = Math.floor(Math.random() * 100)
          .toString()
          .padStart(2, '0');
        if (!picks.includes(rand)) picks.push(rand);
      }
      setSelected2DNumbers(picks);
    }
  };

  const toggleLuckyCard = (name: string) => {
    if (selectedCards.includes(name)) {
      setSelectedCards((prev) => prev.filter((c) => c !== name));
    } else {
      setSelectedCards((prev) => [...prev, name]);
    }
  };

  const handlePlaceBet = () => {
    if (!activeUser) return;

    let gameType: '2D Lottery' | '3D Lottery' | 'Lucky 12' = '2D Lottery';
    let selections: string[] = [];

    if (activeTab === '2d') {
      gameType = '2D Lottery';
      selections = selected2DNumbers;
    } else if (activeTab === '3d') {
      gameType = '3D Lottery';
      selections = [`${digit1}${digit2}${digit3}`];
    } else {
      gameType = 'Lucky 12';
      selections = selectedCards;
    }

    const totalWager = betAmount * (selections.length || 1);

    const success = placeBet(activeUser.username, gameType, selections, totalWager);
    if (success) {
      if (activeTab === '2d') setSelected2DNumbers([]);
      if (activeTab === 'lucky12') setSelectedCards([]);
    }
  };

  const handleRequestPoints = () => {
    if (!activeUser) return;
    adjustPoints(activeUser.username, depositAmount, 'Credit', 'User Self-Deposit Request Approved');
    setShowDepositModal(false);
  };

  // Filter tickets for this user
  const userTickets = gameTickets.filter((t) => t.username === activeUser?.username);

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Banner Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-cyan-950 p-6 border border-cyan-500/20 shadow-xl">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 p-0.5 shadow-lg shadow-cyan-500/30">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                <Gamepad2 className="w-7 h-7 text-cyan-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black text-white tracking-wide">SHYAM GAME</h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  Player Portal
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Original Number Selection, 3-Digit Prediction & Lucky Selection Games
              </p>
            </div>
          </div>

          {/* User Wallet Card */}
          <div className="flex items-center gap-4 bg-slate-950/70 border border-slate-800 rounded-2xl p-3.5 backdrop-blur-md">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Wallet className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-wider text-slate-400 block font-semibold">
                Player: <span className="text-white font-bold">{activeUser?.username}</span>
              </span>
              <span className="text-xl font-black text-emerald-400">
                ₹{activeUser?.points.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </span>
            </div>
            <button
              onClick={() => setShowDepositModal(true)}
              className="ml-2 px-3.5 py-2 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 border border-cyan-500/40 text-xs font-semibold flex items-center gap-1.5 transition-all active:scale-95"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Add Points</span>
            </button>
          </div>
        </div>
      </div>

      {/* Game Selector Tabs */}
      <div className="grid grid-cols-3 gap-3 bg-slate-900/80 p-2 rounded-2xl border border-slate-800">
        <button
          onClick={() => setActiveTab('2d')}
          className={`flex items-center justify-center gap-2.5 py-3 px-4 rounded-xl font-bold text-sm transition-all ${
            activeTab === '2d'
              ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg shadow-cyan-500/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <Dices className="w-4 h-4" />
          <span>Number Selection (2D)</span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-950/60 border border-cyan-400/30 text-cyan-300">
            90x
          </span>
        </button>

        <button
          onClick={() => setActiveTab('3d')}
          className={`flex items-center justify-center gap-2.5 py-3 px-4 rounded-xl font-bold text-sm transition-all ${
            activeTab === '3d'
              ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-500/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>3-Digit Prediction (3D)</span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-950/60 border border-purple-400/30 text-purple-300">
            900x
          </span>
        </button>

        <button
          onClick={() => setActiveTab('lucky12')}
          className={`flex items-center justify-center gap-2.5 py-3 px-4 rounded-xl font-bold text-sm transition-all ${
            activeTab === 'lucky12'
              ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-lg shadow-amber-500/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <Flame className="w-4 h-4" />
          <span>Lucky Selection (12 Card)</span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-950/60 border border-amber-400/30 text-amber-300">
            10x
          </span>
        </button>
      </div>

      {/* Main Game Interface Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Interactive Betting Engine */}
        <div className="lg:col-span-8 space-y-6">
          {/* Active Timer Header */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-emerald-500 animate-ping" />
              <div>
                <span className="text-xs text-slate-400 font-medium block">Current Round</span>
                <span className="text-sm font-bold text-white">
                  DRW-{activeTab.toUpperCase()}-20260730
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 bg-slate-950 px-4 py-2 rounded-xl border border-slate-800">
              <Clock className="w-4 h-4 text-cyan-400 animate-pulse" />
              <span className="text-xs text-slate-400">Draw Closes In:</span>
              <span className="font-mono text-lg font-black text-cyan-400">
                {activeTab === '2d'
                  ? formatTimer(timeLeft2D)
                  : activeTab === '3d'
                  ? formatTimer(timeLeft3D)
                  : formatTimer(timeLeftLucky)}
              </span>
            </div>
          </div>

          {/* TAB 1: 2D NUMBER SELECTION */}
          {activeTab === '2d' && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-white flex items-center gap-2">
                    <Dices className="w-5 h-5 text-cyan-400" />
                    Select 2-Digit Numbers (00 - 99)
                  </h3>
                  <p className="text-xs text-slate-400">Payout: 90x for winning match</p>
                </div>

                {/* Quick Presets */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => select2DPreset('random5')}
                    className="px-2.5 py-1 text-xs rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium"
                  >
                    🎲 Quick 5
                  </button>
                  <button
                    onClick={() => select2DPreset('even')}
                    className="px-2.5 py-1 text-xs rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium"
                  >
                    Evens
                  </button>
                  <button
                    onClick={() => select2DPreset('odd')}
                    className="px-2.5 py-1 text-xs rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium"
                  >
                    Odds
                  </button>
                  <button
                    onClick={() => select2DPreset('clear')}
                    className="px-2.5 py-1 text-xs rounded-lg bg-rose-950/60 hover:bg-rose-900/60 text-rose-300 border border-rose-800/40 font-medium"
                  >
                    Clear
                  </button>
                </div>
              </div>

              {/* 10x10 Grid */}
              <div className="grid grid-cols-10 gap-2 max-h-80 overflow-y-auto p-2 bg-slate-950/60 rounded-xl border border-slate-800 custom-scrollbar">
                {Array.from({ length: 100 }, (_, i) => {
                  const numStr = i.toString().padStart(2, '0');
                  const isSelected = selected2DNumbers.includes(numStr);
                  return (
                    <button
                      key={numStr}
                      onClick={() => toggle2DNumber(numStr)}
                      className={`h-10 rounded-xl font-mono text-sm font-bold transition-all ${
                        isSelected
                          ? 'bg-gradient-to-tr from-cyan-500 to-blue-500 text-white shadow-md shadow-cyan-500/30 scale-105 border border-cyan-300'
                          : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800/80'
                      }`}
                    >
                      {numStr}
                    </button>
                  );
                })}
              </div>

              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>
                  Selected:{' '}
                  <strong className="text-cyan-400 font-bold">{selected2DNumbers.length}</strong>{' '}
                  numbers
                </span>
                <span>
                  Total Wager:{' '}
                  <strong className="text-emerald-400 font-bold">
                    ₹{(betAmount * selected2DNumbers.length).toLocaleString()}
                  </strong>
                </span>
              </div>
            </div>
          )}

          {/* TAB 2: 3D THREE DIGIT PREDICTION */}
          {activeTab === '3d' && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-6">
              <div>
                <h3 className="font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-purple-400" />
                  3-Digit Reel Predictor
                </h3>
                <p className="text-xs text-slate-400">
                  Select exact 3-digit combination (000 to 999). Win 900x your wager!
                </p>
              </div>

              {/* 3 Reel Pickers */}
              <div className="grid grid-cols-3 gap-6 py-4 bg-slate-950/60 rounded-2xl border border-slate-800 p-6">
                {/* Reel 1 */}
                <div className="text-center space-y-3">
                  <span className="text-xs uppercase font-bold text-purple-400 tracking-wider">
                    1st Digit
                  </span>
                  <div className="text-5xl font-black font-mono text-white bg-slate-900 py-4 rounded-2xl border border-purple-500/30 shadow-inner">
                    {digit1}
                  </div>
                  <div className="flex justify-center gap-1.5 flex-wrap">
                    {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
                      <button
                        key={`d1-${n}`}
                        onClick={() => setDigit1(n)}
                        className={`w-8 h-8 rounded-lg font-mono font-bold text-xs ${
                          digit1 === n
                            ? 'bg-purple-600 text-white shadow-md'
                            : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                        }`}
                      >
                        {n}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Reel 2 */}
                <div className="text-center space-y-3">
                  <span className="text-xs uppercase font-bold text-purple-400 tracking-wider">
                    2nd Digit
                  </span>
                  <div className="text-5xl font-black font-mono text-white bg-slate-900 py-4 rounded-2xl border border-purple-500/30 shadow-inner">
                    {digit2}
                  </div>
                  <div className="flex justify-center gap-1.5 flex-wrap">
                    {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
                      <button
                        key={`d2-${n}`}
                        onClick={() => setDigit2(n)}
                        className={`w-8 h-8 rounded-lg font-mono font-bold text-xs ${
                          digit2 === n
                            ? 'bg-purple-600 text-white shadow-md'
                            : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                        }`}
                      >
                        {n}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Reel 3 */}
                <div className="text-center space-y-3">
                  <span className="text-xs uppercase font-bold text-purple-400 tracking-wider">
                    3rd Digit
                  </span>
                  <div className="text-5xl font-black font-mono text-white bg-slate-900 py-4 rounded-2xl border border-purple-500/30 shadow-inner">
                    {digit3}
                  </div>
                  <div className="flex justify-center gap-1.5 flex-wrap">
                    {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
                      <button
                        key={`d3-${n}`}
                        onClick={() => setDigit3(n)}
                        className={`w-8 h-8 rounded-lg font-mono font-bold text-xs ${
                          digit3 === n
                            ? 'bg-purple-600 text-white shadow-md'
                            : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                        }`}
                      >
                        {n}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-purple-950/30 border border-purple-800/40 flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-400">Selected Combination:</span>
                  <span className="font-mono text-xl font-black text-purple-300 block">
                    {digit1}
                    {digit2}
                    {digit3}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-400">Potential Payout (900x):</span>
                  <span className="font-mono text-xl font-black text-emerald-400 block">
                    ₹{(betAmount * 900).toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: LUCKY 12 CARD SELECTION */}
          {activeTab === 'lucky12' && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="font-bold text-white flex items-center gap-2">
                    <Flame className="w-5 h-5 text-amber-400" />
                    <span>Lucky 12 Symbols & Cards</span>
                  </h3>
                  <p className="text-xs text-slate-400">
                    Loaded directly from GitHub repository configuration. Pick your lucky cards for 10x payout!
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      const allNames = lucky12Cards.map((c) => c.name);
                      setSelectedCards(allNames);
                    }}
                    className="px-2.5 py-1 text-xs rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold"
                  >
                    Select All 12
                  </button>
                  <button
                    onClick={() => setSelectedCards([])}
                    className="px-2.5 py-1 text-xs rounded-lg bg-rose-950/60 hover:bg-rose-900/60 text-rose-300 border border-rose-800/40 font-semibold"
                  >
                    Clear
                  </button>
                </div>
              </div>

              {/* Dynamic Responsive 12 Cards Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5">
                {lucky12Cards.map((card) => {
                  const isSelected = selectedCards.includes(card.name);
                  return (
                    <div
                      key={card.id}
                      className={`p-3.5 rounded-2xl border transition-all duration-300 flex flex-col items-center justify-between gap-3 group hover:-translate-y-1 hover:shadow-xl ${
                        isSelected
                          ? 'bg-gradient-to-b from-slate-900 via-slate-900 to-amber-950/80 border-amber-400/80 shadow-lg shadow-amber-500/20 ring-1 ring-amber-400/50'
                          : 'bg-slate-950/80 hover:bg-slate-800/80 text-slate-300 border-slate-800'
                      }`}
                    >
                      {/* Top Badge: Card Number & Multiplier */}
                      <div className="w-full flex items-center justify-between text-[10px]">
                        <span className="font-mono font-bold text-slate-400 bg-slate-900 px-2 py-0.5 rounded-md border border-slate-800">
                          #{card.cardNo.toString().padStart(2, '0')}
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-amber-950/80 text-amber-300 border border-amber-800 font-bold">
                          {card.multiplier}
                        </span>
                      </div>

                      {/* Image Container with GitHub Image & Fallback */}
                      <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center justify-center p-1.5 shadow-inner group-hover:scale-105 transition-transform relative overflow-hidden">
                        {card.imageUrl ? (
                          <img
                            src={card.imageUrl}
                            alt={card.name}
                            className="w-full h-full object-contain drop-shadow-md"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = 'none';
                              const parent = (e.target as HTMLImageElement).parentElement;
                              if (parent && !parent.querySelector('.l12-fallback-icon')) {
                                const fallback = document.createElement('span');
                                fallback.className = 'l12-fallback-icon text-4xl';
                                fallback.innerText = card.icon || '👑';
                                parent.appendChild(fallback);
                              }
                            }}
                          />
                        ) : (
                          <span className="text-4xl">{card.icon}</span>
                        )}
                      </div>

                      {/* Card Title Name */}
                      <div className="text-center">
                        <span className="text-xs font-black text-white block tracking-wide">
                          {card.icon} {card.name}
                        </span>
                      </div>

                      {/* Bet Amount Input per Card */}
                      <div className="w-full space-y-1.5">
                        <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 rounded-xl px-2 py-1">
                          <span className="text-[10px] text-slate-400 font-bold">₹</span>
                          <input
                            type="number"
                            value={betAmount}
                            onChange={(e) =>
                              setBetAmount(Math.max(1, parseInt(e.target.value) || 0))
                            }
                            className="w-full bg-transparent text-xs font-mono font-bold text-cyan-300 focus:outline-none text-center"
                            placeholder="Bet"
                          />
                        </div>

                        {/* Select Button */}
                        <button
                          type="button"
                          onClick={() => toggleLuckyCard(card.name)}
                          className={`w-full py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-1 ${
                            isSelected
                              ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 shadow-md shadow-amber-500/30'
                              : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                          }`}
                        >
                          {isSelected ? (
                            <>
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Selected</span>
                            </>
                          ) : (
                            <span>Select Card</span>
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Bottom Wager Controls & Place Bet Action */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-amber-400" />
                Set Bet Amount Per Selection
              </span>
              <span className="text-xs font-bold text-emerald-400">
                Wallet: ₹{activeUser?.points.toLocaleString('en-IN')}
              </span>
            </div>

            {/* Bet Quick Selector Buttons */}
            <div className="flex items-center gap-2 flex-wrap">
              {[10, 50, 100, 500, 1000, 5000].map((val) => (
                <button
                  key={`bet-${val}`}
                  onClick={() => setBetAmount(val)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    betAmount === val
                      ? 'bg-cyan-500 text-slate-950 shadow-md font-extrabold'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                  }`}
                >
                  ₹{val}
                </button>
              ))}

              <div className="flex items-center gap-2 ml-auto">
                <span className="text-xs text-slate-400">Custom:</span>
                <input
                  type="number"
                  value={betAmount}
                  onChange={(e) => setBetAmount(Math.max(1, parseInt(e.target.value) || 0))}
                  className="w-24 px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white font-mono font-bold focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            <button
              onClick={handlePlaceBet}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-slate-950 font-black text-base uppercase tracking-wider hover:brightness-110 transition-all shadow-lg shadow-emerald-500/20 active:scale-[0.99] flex items-center justify-center gap-2"
            >
              <Ticket className="w-5 h-5" />
              <span>Confirm & Place Bet (₹{(betAmount * (selected2DNumbers.length || selectedCards.length || 1)).toLocaleString()})</span>
            </button>
          </div>
        </div>

        {/* Right Column: Live Draw Results & User Ticket Ledger */}
        <div className="lg:col-span-4 space-y-6">
          {/* Latest Draw Live Feed */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
            <h3 className="font-bold text-white text-sm flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Trophy className="w-4 h-4 text-amber-400" />
                Live Result Stream
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800">
                Updated
              </span>
            </h3>

            <div className="space-y-2.5">
              {liveResults.slice(0, 5).map((draw) => (
                <div
                  key={draw.id}
                  className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 flex items-center justify-between"
                >
                  <div>
                    <span className="text-xs font-semibold text-slate-300 block">{draw.gameType}</span>
                    <span className="text-[10px] font-mono text-slate-500">{draw.drawNumber}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-mono font-black text-lg text-amber-400 px-2 py-0.5 rounded-lg bg-amber-950/40 border border-amber-800/50">
                      {draw.winningResult}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* User Ticket Ledger */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
            <h3 className="font-bold text-white text-sm flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Ticket className="w-4 h-4 text-cyan-400" />
                My Bet Tickets ({userTickets.length})
              </span>
            </h3>

            <div className="space-y-2.5 max-h-96 overflow-y-auto custom-scrollbar">
              {userTickets.length === 0 ? (
                <div className="p-6 text-center text-xs text-slate-500">
                  No tickets placed yet. Pick your numbers above!
                </div>
              ) : (
                userTickets.map((tkt) => (
                  <div
                    key={tkt.id}
                    className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1.5"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-mono font-bold text-cyan-400">#{tkt.ticketNo}</span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          tkt.status === 'Won'
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                            : tkt.status === 'Lost'
                            ? 'bg-slate-800 text-slate-400'
                            : 'bg-amber-950 text-amber-300 border border-amber-800'
                        }`}
                      >
                        {tkt.status}
                      </span>
                    </div>

                    <div className="text-xs text-slate-300 font-medium">
                      {tkt.gameType} • Selection:{' '}
                      <span className="font-mono font-bold text-white">{tkt.selectedNumbers.join(', ')}</span>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                      <span>Amount: ₹{tkt.betAmount.toLocaleString()}</span>
                      {tkt.winAmount > 0 && (
                        <span className="text-emerald-400 font-bold">
                          Win: +₹{tkt.winAmount.toLocaleString()}
                        </span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Deposit Request Modal */}
      {showDepositModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 space-y-5 animate-scaleUp">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Wallet className="w-5 h-5 text-emerald-400" />
                Add Points to Player Wallet
              </h3>
              <button
                onClick={() => setShowDepositModal(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-400">
              Direct point allocation for account <strong>{activeUser?.username}</strong>.
            </p>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300">Point Amount (₹)</label>
              <input
                type="number"
                value={depositAmount}
                onChange={(e) => setDepositAmount(parseInt(e.target.value) || 0)}
                className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono text-lg font-bold focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowDepositModal(false)}
                className="w-1/2 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleRequestPoints}
                className="w-1/2 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-500/20"
              >
                Confirm Deposit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
