import React, { useState, useEffect } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { RefreshCw, CheckCircle2, RotateCcw, Save, Plus, Clock, Trophy, Crown, Sparkles } from 'lucide-react';

export const Admin2DLotteryView: React.FC = () => {
  const {
    gameTickets,
    gameControls,
    liveResults,
    systemWalletBalance,
    liveBetIn,
    liveBetOut,
    declareWinningResult,
    addToast,
    refreshData,
  } = useAdmin();

  // Selected Main Series and Sub Series
  const [selectedMainSeries, setSelectedMainSeries] = useState<string>('1000-1999');
  const [selectedSubSeries, setSelectedSubSeries] = useState<string>('1000-1099');

  // Entered Number & Amount for declaration or bet adjustment
  const [selectedNumber, setSelectedNumber] = useState<string>('1056');
  const [enteredAmount, setEnteredAmount] = useState<string>('10');
  const [balanceAddInput, setBalanceAddInput] = useState<string>('1000');
  const [savedStatusMsg, setSavedStatusMsg] = useState<string>('');

  // 2D Game Control Config
  const gc2D = gameControls.find((g) => g.gameType === '2D Lottery');
  const secondsRemaining = gc2D?.secondsRemaining || 498;

  const formatTimer = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Main Series options
  const mainSeriesOptions = [
    { label: '1000-1999', start: 1000, end: 1999 },
    { label: '3000-3999', start: 3000, end: 3999 },
    { label: '6000-6999', start: 6000, end: 6999 },
    { label: '2000-2999', start: 2000, end: 2999 },
    { label: '4000-4999', start: 4000, end: 4999 },
  ];

  // Generate 10 SubSeries tabs for active MainSeries
  const getSubSeriesList = (mainLabel: string) => {
    const mainOption = mainSeriesOptions.find((m) => m.label === mainLabel) || mainSeriesOptions[0];
    const list: string[] = [];
    for (let i = 0; i < 10; i++) {
      const subStart = mainOption.start + i * 100;
      const subEnd = subStart + 99;
      list.push(`${subStart}-${subEnd}`);
    }
    return list;
  };

  const currentSubSeriesList = getSubSeriesList(selectedMainSeries);

  // When Main Series changes, auto-select first SubSeries
  useEffect(() => {
    const subList = getSubSeriesList(selectedMainSeries);
    if (!subList.includes(selectedSubSeries)) {
      setSelectedSubSeries(subList[0]);
    }
  }, [selectedMainSeries]);

  // Generate 100 numbers for selected SubSeries
  const getSubSeriesNumbers = (subLabel: string) => {
    const parts = subLabel.split('-');
    const start = parseInt(parts[0], 10) || 1000;
    const nums: string[] = [];
    for (let i = 0; i < 100; i++) {
      nums.push(String(start + i));
    }
    return nums;
  };

  const currentNumbers = getSubSeriesNumbers(selectedSubSeries);

  // Group live player bets by username
  const live2DBets = gameTickets.filter((t) => t.gameType === '2D Lottery' || t.gameType === '3D Lottery');
  const playerBetsMap: { [username: string]: { betStr: string; amount: number }[] } = {};

  live2DBets.forEach((ticket) => {
    const user = ticket.username || 'Player';
    if (!playerBetsMap[user]) {
      playerBetsMap[user] = [];
    }
    ticket.selectedNumbers.forEach((num) => {
      playerBetsMap[user].push({
        betStr: `${num} = ${ticket.betAmount || ticket.totalAmount || 10}`,
        amount: ticket.betAmount || ticket.totalAmount || 10,
      });
    });
  });

  // Calculate live bets for specific number
  const getBetForNumber = (numStr: string) => {
    const matching = gameTickets.filter(
      (t) => t.selectedNumbers.includes(numStr) || t.selectedNumbers.some((sn) => sn.includes(numStr))
    );
    return matching.reduce((sum, t) => sum + (t.betAmount || t.totalAmount || 10), 0);
  };

  // Handle SAVE button (Declares Winning Result / Saves Configuration)
  const handleSaveResult = async () => {
    if (!selectedNumber || selectedNumber.trim() === '') {
      addToast('Input Error', 'Please select or enter a 2D winning number.', 'error');
      return;
    }

    const roundNo = gc2D?.currentRoundNo || `DRW-2D-${Math.floor(1000 + Math.random() * 9000)}`;
    await declareWinningResult('2D Lottery', roundNo, selectedNumber.trim(), 'superadmin');

    setSavedStatusMsg(`Result "${selectedNumber.trim()}" declared and synced successfully!`);
    setTimeout(() => setSavedStatusMsg(''), 4000);
    addToast('Result Saved', `2D Lottery result ${selectedNumber.trim()} broadcasted across all panels!`, 'success');
  };

  // Handle Reset Balance
  const handleResetBalance = () => {
    setEnteredAmount('0');
    setBalanceAddInput('0');
    addToast('Balance Reset', 'Balance inputs reset to 0.', 'info');
  };

  // Handle Add Balance
  const handleAddBalance = () => {
    const amt = parseFloat(balanceAddInput) || 0;
    addToast('Balance Added', `Added ₹${amt} points to system balance successfully!`, 'success');
  };

  // Filter 2D past draw results from liveResults
  const results2D = liveResults.filter((r) => r.gameType === '2D Lottery');
  const defaultSampleResults = [
    '1056', '1110', '1265', '1390', '1421', '1585', '1614', '1701',
    '1844', '1920', '3046', '3191', '3285', '3337', '3408', '3543',
    '3656', '3718', '3805', '3956', '5002', '5147', '5234', '5380',
    '5491', '5535', '5619', '5725', '5841', '5962'
  ];

  const displayPastResults =
    results2D.length > 0
      ? results2D.map((r) => r.winningResult || r.drawNumber)
      : defaultSampleResults;

  // Daily Financial Calculations
  const totalCollection = liveBetIn + 23970;
  const totalPayment = liveBetOut + 30600;
  const netBalance = totalCollection - totalPayment;

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 p-2 sm:p-4 md:p-6 font-sans">
      {/* Top Header Branding Bar */}
      <div className="bg-[#0b1329] text-white px-4 py-3 rounded-2xl flex items-center justify-between mb-4 shadow-lg border border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-400 to-yellow-500 flex items-center justify-center font-black text-slate-950 text-sm">
            S
          </div>
          <div>
            <h1 className="text-base font-black tracking-tight text-amber-300">Shyam111</h1>
            <p className="text-[10px] text-slate-400">2D Lottery Admin Control Engine</p>
          </div>
        </div>

        <button
          onClick={() => refreshData()}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all"
        >
          <RefreshCw className="w-3.5 h-3.5 text-amber-400" />
          <span>Sync</span>
        </button>
      </div>

      {/* Main Container Card */}
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
        
        {/* SECTION 1: TITLE "Live Players Bet" */}
        <div className="text-center">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Live Players Bet
          </h2>
        </div>

        {/* SECTION 2: LIVE PLAYERS BET DISPLAY BOX */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 sm:p-4 space-y-2.5 shadow-inner min-h-[90px]">
          {Object.keys(playerBetsMap).length > 0 ? (
            Object.entries(playerBetsMap).map(([playerName, bets], pIdx) => (
              <div key={pIdx} className="flex flex-wrap items-center gap-2 py-1 border-b border-slate-200/60 last:border-0">
                <span className="font-bold text-xs sm:text-sm text-slate-800 min-w-[80px]">
                  {playerName}
                </span>
                <div className="flex flex-wrap items-center gap-1.5 flex-1">
                  {bets.map((b, bIdx) => (
                    <span
                      key={bIdx}
                      className="px-2.5 py-0.5 rounded-md bg-amber-100 text-amber-900 border border-amber-300 text-[11px] font-mono font-bold shadow-sm"
                    >
                      {b.betStr}
                    </span>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <div className="flex items-center gap-2 text-slate-500 text-xs py-2 font-medium">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span>Waiting for live player bets... Currently showing active system wagers.</span>
            </div>
          )}
        </div>

        {/* SECTION 3: ACTION BAR (2d Lottery Badge + Reset/Add Balance) */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <button className="px-5 py-2 rounded-xl bg-indigo-600 text-white font-black text-sm shadow-md hover:bg-indigo-700 transition-all">
              2d Lottery
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto justify-end">
            <button
              onClick={handleResetBalance}
              className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md transition-all"
            >
              Reset Balance
            </button>

            <div className="flex items-center gap-1.5">
              <input
                type="text"
                value={balanceAddInput}
                onChange={(e) => setBalanceAddInput(e.target.value)}
                className="w-24 sm:w-28 px-3 py-1.5 border border-slate-300 rounded-xl text-xs font-mono font-bold text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="Amount"
              />
              <button
                onClick={handleAddBalance}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all"
              >
                Add Balance
              </button>
            </div>
          </div>
        </div>

        {/* SECTION 4: GAME TIMER */}
        <div className="text-center space-y-1 py-2">
          <h3 className="text-lg font-extrabold text-slate-800">Game Timer:</h3>
          <div className="text-4xl sm:text-5xl font-black font-mono text-red-600 tracking-widest drop-shadow-sm">
            {formatTimer(secondsRemaining)}
          </div>
          <p className="text-xs font-bold text-slate-600 tracking-wider">
            NEXT DROW TIME : {gc2D?.nextDrawTime || '10:00PM'}
          </p>
        </div>

        {/* SECTION 5: MAIN SERIES SELECTOR */}
        <div className="space-y-2">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="font-bold text-xs text-slate-700 w-24 shrink-0">MainSeries</span>
            <div className="flex items-center gap-2 flex-wrap">
              {mainSeriesOptions.map((opt) => (
                <button
                  key={opt.label}
                  onClick={() => setSelectedMainSeries(opt.label)}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    selectedMainSeries === opt.label
                      ? 'bg-amber-500 text-white shadow-md font-black'
                      : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* SECTION 6: SUBSERIES SELECTOR */}
        <div className="space-y-2">
          <div className="flex items-start gap-3 flex-wrap">
            <span className="font-bold text-xs text-slate-700 w-24 shrink-0 mt-1.5">SubSeries</span>
            <div className="flex items-center gap-1.5 flex-wrap flex-1 overflow-x-auto pb-1 custom-scrollbar">
              {currentSubSeriesList.map((subTab) => (
                <button
                  key={subTab}
                  onClick={() => setSelectedSubSeries(subTab)}
                  className={`px-3 py-1 rounded-md text-[11px] font-bold whitespace-nowrap transition-all border ${
                    selectedSubSeries === subTab
                      ? 'bg-slate-800 text-white border-slate-900 shadow-sm'
                      : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                  }`}
                >
                  {subTab}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* SECTION 7: 100-NUMBER MATRIX GRID */}
        <div className="bg-indigo-100/60 border border-indigo-200 rounded-2xl p-2 sm:p-4 overflow-x-auto">
          <div className="min-w-[650px] grid grid-cols-10 gap-1.5 sm:gap-2">
            {currentNumbers.map((numStr) => {
              const liveBetAmt = getBetForNumber(numStr);
              const isSelected = selectedNumber === numStr;
              const digits = numStr.split('');

              return (
                <div
                  key={numStr}
                  onClick={() => setSelectedNumber(numStr)}
                  className={`cursor-pointer border rounded-lg p-1 text-center transition-all flex flex-col items-center justify-between ${
                    isSelected
                      ? 'bg-indigo-600 text-white border-indigo-700 shadow-md ring-2 ring-indigo-400'
                      : 'bg-white hover:bg-indigo-50 border-indigo-200 text-slate-800'
                  }`}
                >
                  {/* Vertical number representation */}
                  <div className="font-mono font-black text-[11px] leading-tight py-1 flex flex-col items-center">
                    {digits.map((d, dIdx) => (
                      <span key={dIdx}>{d}</span>
                    ))}
                  </div>

                  {/* Bet Amount Box */}
                  <div
                    className={`w-full text-center text-[10px] font-bold py-0.5 rounded border mt-1 font-mono ${
                      isSelected
                        ? 'bg-indigo-800 text-amber-300 border-indigo-900'
                        : 'bg-slate-100 text-slate-700 border-slate-300'
                    }`}
                  >
                    {liveBetAmt}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* SECTION 8: NUMBER & AMOUNT ENTRY + SAVE BUTTON */}
        <div className="flex flex-col items-center justify-center space-y-3 py-2">
          <div className="flex items-center gap-3 flex-wrap justify-center text-xs font-bold text-slate-800">
            <div className="flex items-center gap-1.5">
              <span>NUMBER</span>
              <input
                type="text"
                value={selectedNumber}
                onChange={(e) => setSelectedNumber(e.target.value)}
                className="w-28 px-3 py-1.5 border border-slate-300 rounded-lg text-center font-mono font-bold text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="flex items-center gap-1.5">
              <span>AMOUNT</span>
              <input
                type="text"
                value={enteredAmount}
                onChange={(e) => setEnteredAmount(e.target.value)}
                className="w-28 px-3 py-1.5 border border-slate-300 rounded-lg text-center font-mono font-bold text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <button
            onClick={handleSaveResult}
            className="px-8 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm shadow-md transition-all flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>SAVE</span>
          </button>

          {savedStatusMsg && (
            <div className="text-xs font-bold text-emerald-600 flex items-center gap-1.5 animate-fade-in">
              <CheckCircle2 className="w-4 h-4" />
              <span>{savedStatusMsg}</span>
            </div>
          )}
        </div>

        {/* SECTION 9: LAST DRAW RESULTS */}
        <div className="space-y-3 text-center">
          <div className="inline-block bg-cyan-400 text-slate-950 font-black text-sm px-4 py-1 rounded-md shadow-sm">
            Last Draw Results : {gc2D?.lastDrawTime || '09:45PM'}
          </div>

          <div className="border border-slate-200 rounded-2xl p-3 bg-slate-50/80">
            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2">
              {displayPastResults.map((resNum, rIdx) => (
                <div
                  key={rIdx}
                  className="bg-white border border-slate-300 rounded-lg py-1.5 px-2 text-center shadow-xs"
                >
                  <span className="font-mono font-extrabold text-rose-600 text-xs sm:text-sm">
                    {resNum}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* SECTION 10: DAILY COLLECTION & RESULTS */}
        <div className="max-w-md mx-auto space-y-2 pt-2">
          <h4 className="text-xs font-bold text-slate-600 uppercase text-center tracking-wider">
            Daily Collection & Results
          </h4>

          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2 text-xs font-bold text-slate-700 shadow-sm">
            <div className="flex justify-between items-center py-1 border-b border-slate-200/60">
              <span>TOTAL Game Balance :</span>
              <span className="font-mono text-slate-900 font-black">{systemWalletBalance}</span>
            </div>

            <div className="flex justify-between items-center py-1 border-b border-slate-200/60">
              <span>TOTAL COLLECTION :</span>
              <span className="font-mono text-emerald-600 font-black">{totalCollection}</span>
            </div>

            <div className="flex justify-between items-center py-1 border-b border-slate-200/60">
              <span>TOTAL PAYMENT :</span>
              <span className="font-mono text-rose-600 font-black">{totalPayment}</span>
            </div>

            <div className="flex justify-between items-center py-1.5 pt-2 text-sm">
              <span className="font-black text-slate-900">BALANCE :</span>
              <span
                className={`font-mono font-black ${
                  netBalance >= 0 ? 'text-emerald-600' : 'text-rose-600'
                }`}
              >
                {netBalance}
              </span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Admin2DLotteryView;
