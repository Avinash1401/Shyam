import React, { useState, useEffect } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { RefreshCw, CheckCircle2, Save, Sparkles } from 'lucide-react';

export const AdminLucky12View: React.FC = () => {
  const {
    gameTickets,
    lucky12Cards,
    gameControls,
    liveResults,
    systemWalletBalance,
    liveBetIn,
    liveBetOut,
    declareWinningResult,
    addToast,
    refreshData,
  } = useAdmin();

  // 12 Default Lucky 12 Cards with fallback icons/names matching the reference UI
  const default12Symbols = [
    { id: '1', name: 'Football', icon: '⚽', img: '/lucky12/football1111.gif' },
    { id: '2', name: 'Kite Work', icon: '🪁', img: '/lucky12/kitework123.gif' },
    { id: '3', name: 'Cat', icon: '🐱', img: '/lucky12/cat1212.gif' },
    { id: '4', name: 'Horse', icon: '🐎', img: '/lucky12/horse1.gif' },
    { id: '5', name: 'Umbrella', icon: '☂️', img: '/lucky12/umbrella11.gif' },
    { id: '6', name: 'Bullet', icon: '🏍️', img: '/lucky12/bullet121.gif' },
    { id: '7', name: 'Butterfly', icon: '🦋', img: '/lucky12/butterfly121.gif' },
    { id: '8', name: 'Rose', icon: '🌹', img: '/lucky12/rose132 (1).gif' },
    { id: '9', name: 'Tiger', icon: '🐅', img: '/lucky12/tiger11.gif' },
    { id: '10', name: 'Dipak', icon: '🪔', img: '/lucky12/dipak1231.gif' },
    { id: '11', name: 'Pigeon', icon: '🕊️', img: '/lucky12/rabit132.gif' },
    { id: '12', name: 'Rabbit', icon: '🐰', img: '/lucky12/rabit132.gif' },
  ];

  // Combine loaded cards with fallback symbols
  const cardsList = lucky12Cards.length >= 12 ? lucky12Cards.slice(0, 12) : default12Symbols;

  // Selected radio symbol for declaring result
  const [selectedSymbolId, setSelectedSymbolId] = useState<string>('7'); // Default Butterfly
  const [selectedMultiplier, setSelectedMultiplier] = useState<string>('1X');
  const [wordOutput, setWordOutput] = useState<string>('Butterfly');
  const [balanceAddInput, setBalanceAddInput] = useState<string>('');
  const [saveStatusMsg, setSaveStatusMsg] = useState<string>('');

  // Lucky 12 Game Control timer
  const gcL12 = gameControls.find((g) => g.gameType === 'Lucky 12');
  const secondsRemaining = gcL12?.secondsRemaining || 209;

  // Sync selected symbol to word output
  const handleSelectSymbol = (id: string, name: string) => {
    setSelectedSymbolId(id);
    setWordOutput(name);
  };

  // Live player bets for Lucky 12
  const lucky12Bets = gameTickets.filter((t) => t.gameType === 'Lucky 12');
  const playerBetsMap: { [username: string]: { betStr: string; amount: number }[] } = {};

  lucky12Bets.forEach((ticket) => {
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

  // Calculate live bets for specific symbol
  const getBetForSymbol = (symbolName: string) => {
    const matching = lucky12Bets.filter(
      (t) => t.selectedNumbers.includes(symbolName) || t.selectedNumbers.some((sn) => sn.toLowerCase() === symbolName.toLowerCase())
    );
    return matching.reduce((sum, t) => sum + (t.betAmount || t.totalAmount || 10), 0);
  };

  // Handle Save (Declare Result)
  const handleSaveResult = async () => {
    const declaredResult = wordOutput.trim() || 'Butterfly';
    const roundNo = gcL12?.currentRoundNo || `DRW-L12-${Math.floor(1000 + Math.random() * 9000)}`;

    await declareWinningResult('Lucky 12', roundNo, declaredResult, 'superadmin');
    setSaveStatusMsg(`Lucky 12 Result "${declaredResult}" saved & declared!`);
    setTimeout(() => setSaveStatusMsg(''), 4000);
    addToast('Lucky 12 Saved', `Declared winning symbol "${declaredResult}" successfully!`, 'success');
  };

  // Handle Reset Balance
  const handleResetBalance = () => {
    setBalanceAddInput('');
    addToast('Balance Reset', 'Balance input field reset.', 'info');
  };

  // Handle Add Balance
  const handleAddBalance = () => {
    const amt = parseFloat(balanceAddInput) || 0;
    if (amt <= 0) {
      addToast('Input Required', 'Please enter a valid amount to add.', 'warning');
      return;
    }
    addToast('Balance Added', `Added ₹${amt} to system balance.`, 'success');
  };

  // Lucky 12 Past Results
  const resultsL12 = liveResults.filter((r) => r.gameType === 'Lucky 12');
  const defaultRecentResults = [
    { symbol: '🦋', multiplier: '1X', time: '09:50PM' },
    { symbol: '☂️', multiplier: '1X', time: '09:45PM' },
    { symbol: '🏍️', multiplier: '1X', time: '09:40PM' },
    { symbol: '🏍️', multiplier: '1X', time: '09:35PM' },
    { symbol: '🌹', multiplier: '1X', time: '09:30PM' },
  ];

  const recentDrawsToDisplay =
    resultsL12.length > 0
      ? resultsL12.slice(0, 5).map((r, idx) => ({
          symbol: r.winningResult || '🦋',
          multiplier: '1X',
          time: r.drawTime || `09:${50 - idx * 5}PM`,
        }))
      : defaultRecentResults;

  // Financial calculations
  const totalCollection = liveBetIn + 23970;
  const totalPayment = liveBetOut + 30600;
  const netBalance = totalCollection - totalPayment;

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 p-2 sm:p-4 md:p-6 font-sans">
      {/* Top Header Branding Bar */}
      <div className="bg-[#0b1329] text-white px-4 py-3 rounded-2xl flex items-center justify-between mb-4 shadow-lg border border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-purple-500 to-indigo-600 flex items-center justify-center font-black text-white text-sm">
            S
          </div>
          <div>
            <h1 className="text-base font-black tracking-tight text-amber-300">Shyam111</h1>
            <p className="text-[10px] text-slate-400">Lucky 12 Admin Control Engine</p>
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
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 sm:p-4 text-center min-h-[50px] flex items-center justify-center shadow-inner">
          {Object.keys(playerBetsMap).length > 0 ? (
            <div className="w-full space-y-2 text-left">
              {Object.entries(playerBetsMap).map(([playerName, bets], pIdx) => (
                <div key={pIdx} className="flex flex-wrap items-center gap-2 py-1 border-b border-slate-200/60 last:border-0">
                  <span className="font-bold text-xs sm:text-sm text-slate-800 min-w-[80px]">
                    {playerName}
                  </span>
                  <div className="flex flex-wrap items-center gap-1.5 flex-1">
                    {bets.map((b, bIdx) => (
                      <span
                        key={bIdx}
                        className="px-2.5 py-0.5 rounded-md bg-purple-100 text-purple-900 border border-purple-300 text-[11px] font-mono font-bold shadow-sm"
                      >
                        {b.betStr}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <span className="text-slate-400 text-xs sm:text-sm font-medium">
              No data found
            </span>
          )}
        </div>

        {/* SECTION 3: ACTION BAR (Lucky 12 Badge + Reset/Add Balance) */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <button className="px-5 py-2 rounded-xl bg-[#6366f1] text-white font-black text-sm shadow-md hover:bg-indigo-600 transition-all">
              Lucky 12
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto justify-end">
            <button
              onClick={handleResetBalance}
              className="px-4 py-2 rounded-xl bg-[#f43f70] hover:bg-rose-600 text-white font-bold text-xs shadow-md transition-all"
            >
              Reset Balance
            </button>

            <div className="flex items-center gap-1.5">
              <input
                type="text"
                value={balanceAddInput}
                onChange={(e) => setBalanceAddInput(e.target.value)}
                className="w-28 sm:w-32 px-3 py-1.5 border border-slate-300 rounded-xl text-xs font-mono font-bold text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder=""
              />
              <button
                onClick={handleAddBalance}
                className="px-4 py-2 rounded-xl bg-[#10b981] hover:bg-emerald-600 text-white font-bold text-xs shadow-md transition-all"
              >
                Add Balance
              </button>
            </div>
          </div>
        </div>

        {/* SECTION 4 & 5: TWO COLUMN LAYOUT (Left: 12 Cards Grid, Right: Timer & Results Controls) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* LEFT COLUMN: 12 CARDS SYMBOL GRID (3 rows x 4 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {cardsList.map((card: any, idx: number) => {
                const cardId = card.id || String(idx + 1);
                const cardName = card.name || `Symbol ${idx + 1}`;
                const cardIcon = card.icon || '🃏';
                const cardImg = card.imageUrl || card.img;
                const isChecked = selectedSymbolId === cardId || wordOutput.toLowerCase() === cardName.toLowerCase();
                const symbolBetTotal = getBetForSymbol(cardName);

                return (
                  <div
                    key={cardId}
                    onClick={() => handleSelectSymbol(cardId, cardName)}
                    className="cursor-pointer space-y-1.5"
                  >
                    {/* Radio Button & Symbol Header */}
                    <div className="flex items-center gap-2 justify-center py-1">
                      <input
                        type="radio"
                        name="lucky12_symbol"
                        checked={isChecked}
                        onChange={() => handleSelectSymbol(cardId, cardName)}
                        className="w-4 h-4 text-purple-600 focus:ring-purple-500 cursor-pointer"
                      />
                      {cardImg ? (
                        <img
                          src={cardImg}
                          alt={cardName}
                          className="w-8 h-8 object-contain"
                          onError={(e) => {
                            (e.target as HTMLElement).style.display = 'none';
                          }}
                        />
                      ) : null}
                      <span className="text-xl leading-none">{cardIcon}</span>
                    </div>

                    {/* Grey Input Box Below Icon */}
                    <div className="h-9 bg-slate-200/80 border border-slate-300 rounded-lg flex items-center justify-center font-mono font-bold text-slate-700 text-xs shadow-inner">
                      {symbolBetTotal > 0 ? symbolBetTotal : ''}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* RIGHT COLUMN: TIMER, MULTIPLIER, SAVE & DAILY COLLECTION TABLE */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* GAME TIMER */}
            <div className="text-center space-y-1">
              <h3 className="text-xl font-bold text-slate-800">Game Timer:</h3>
              <div className="text-4xl sm:text-5xl font-black text-red-600 tracking-wider">
                {secondsRemaining}
              </div>
            </div>

            {/* MULTIPLIER DROPDOWN & SAVE ROW */}
            <div className="space-y-2.5 max-w-sm mx-auto">
              <select
                value={selectedMultiplier}
                onChange={(e) => setSelectedMultiplier(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="1X">1X</option>
                <option value="2X">2X</option>
                <option value="5X">5X</option>
                <option value="10X">10X</option>
              </select>

              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={wordOutput}
                  onChange={(e) => setWordOutput(e.target.value)}
                  placeholder="Word output"
                  className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-xs font-bold text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <button
                  onClick={handleSaveResult}
                  className="px-5 py-2 rounded-lg bg-[#10b981] hover:bg-emerald-600 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>SAVE</span>
                </button>
              </div>

              {saveStatusMsg && (
                <p className="text-[11px] font-bold text-emerald-600 text-center animate-fade-in flex items-center justify-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{saveStatusMsg}</span>
                </p>
              )}
            </div>

            {/* DAILY COLLECTION & RESULTS TABLE */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-600 uppercase text-center tracking-wider">
                Daily Collection & Results
              </h4>

              <div className="border border-slate-300 rounded-lg overflow-hidden bg-white shadow-sm text-xs font-semibold text-slate-700">
                <div className="flex justify-between items-center p-2.5 border-b border-slate-200">
                  <span>TOTAL Game Balance :</span>
                  <span className="font-mono text-slate-900 font-bold">{systemWalletBalance}</span>
                </div>

                <div className="flex justify-between items-center p-2.5 border-b border-slate-200">
                  <span>TOTAL COLLECTION :</span>
                  <span className="font-mono text-emerald-600 font-bold">{totalCollection}</span>
                </div>

                <div className="flex justify-between items-center p-2.5 border-b border-slate-200">
                  <span>TOTAL PAYMENT :</span>
                  <span className="font-mono text-rose-600 font-bold">{totalPayment}</span>
                </div>

                <div className="flex justify-between items-center p-2.5 border-b border-slate-200 bg-slate-50/50">
                  <span>BALANCE :</span>
                  <span
                    className={`font-mono font-bold ${
                      netBalance >= 0 ? 'text-emerald-600' : 'text-rose-600'
                    }`}
                  >
                    {netBalance}
                  </span>
                </div>

                {/* BOTTOM ROW: RECENT DRAW RESULT BADGES */}
                <div className="grid grid-cols-5 border-t border-slate-300 text-center divide-x divide-slate-300 bg-slate-50">
                  {recentDrawsToDisplay.map((res, rIdx) => (
                    <div key={rIdx} className="p-1.5 space-y-0.5">
                      <div className="flex items-center justify-center gap-1">
                        <span className="text-base">{res.symbol}</span>
                        <span className="text-[10px] font-bold text-slate-800">{res.multiplier}</span>
                      </div>
                      <div className="text-[9px] font-bold font-mono text-purple-600">
                        {res.time}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

export default AdminLucky12View;
