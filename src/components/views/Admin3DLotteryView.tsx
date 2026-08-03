import React, { useState } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { Menu, RefreshCw, Save, CheckCircle2 } from 'lucide-react';

export const Admin3DLotteryView: React.FC = () => {
  const {
    gameTickets,
    gameControls,
    liveResults,
    declareWinningResult,
    adjustPoints,
    addToast,
    refreshData,
  } = useAdmin();

  // State for balance addition
  const [balanceAddInput, setBalanceAddInput] = useState<string>('1000');
  
  // State for digit inputs A, B, C for 3D Lottery declaration
  const [inputA, setInputA] = useState<string>('');
  const [inputB, setInputB] = useState<string>('180');
  const [inputC, setInputC] = useState<string>('');

  // 3D Game Control Config & Timer
  const gc3D = gameControls.find((g) => g.gameType === '3D Lottery');
  const secondsRemaining = gc3D?.secondsRemaining || 490;

  const formatTimer = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Filter 3D Lottery bets from real-time gameTickets (from Firestore)
  const live3DBets = gameTickets.filter((t) => t.gameType === '3D Lottery');

  // Group bets by player username to display in the Live Players Bet table
  // Each username maps to an array of formatted bet detail strings
  const playerBetsMap: { [username: string]: { id: string; betStr: string; amount: number; time: string }[] } = {};

  live3DBets.forEach((ticket) => {
    const user = ticket.username || ticket.playerName || 'Player';
    if (!playerBetsMap[user]) {
      playerBetsMap[user] = [];
    }

    const betTime = ticket.drawTime || (ticket.createdAt ? ticket.createdAt.substring(11, 16) : '10:00PM');
    const amt = ticket.betAmount || 10;

    if (ticket.selectedNumbers && ticket.selectedNumbers.length > 0) {
      ticket.selectedNumbers.forEach((num) => {
        let formatted = num;
        // Clean up formatting to match BoxA-001 = 10, STRA-001 = 10 style
        if (num.includes('=')) {
          formatted = num;
        } else if (num.includes('(')) {
          // e.g. "180 (Box)" or "001 (BoxA)"
          const parts = num.split('(');
          const val = parts[0].trim();
          const typeStr = parts[1].replace(')', '').trim();
          const prefix = typeStr.toLowerCase().includes('str') ? 'STRA' : typeStr.toLowerCase().includes('boxb') ? 'BoxB' : 'BoxA';
          formatted = `${prefix}-${val} = ${amt}`;
        } else {
          formatted = `BoxA-${num} = ${amt}`;
        }

        playerBetsMap[user].push({
          id: `${ticket.id}-${num}`,
          betStr: formatted,
          amount: amt,
          time: betTime,
        });
      });
    } else {
      playerBetsMap[user].push({
        id: ticket.id,
        betStr: `3D Bet = ${amt}`,
        amount: amt,
        time: betTime,
      });
    }
  });

  const playerUsernames = Object.keys(playerBetsMap);

  // Handle Save / Declare Result for 3D
  const handleSaveResult = async () => {
    const combinedVal = [inputA, inputB, inputC].filter(Boolean).join('-');
    if (!combinedVal) {
      addToast('Enter Result', 'Please enter digit values for A, B, or C.', 'warning');
      return;
    }
    const currentRound = gc3D?.currentRoundNo || 'DRW-3D-4122';
    await declareWinningResult('3D Lottery', currentRound, combinedVal, 'superadmin');
    addToast('Result Saved', `3D Result "${combinedVal}" saved for ${currentRound}`, 'success');
  };

  // Handle Add Balance
  const handleAddBalance = async () => {
    const amt = parseFloat(balanceAddInput);
    if (isNaN(amt) || amt <= 0) {
      addToast('Invalid Amount', 'Please enter a valid positive number.', 'error');
      return;
    }
    if (playerUsernames.length > 0) {
      const targetUser = playerUsernames[0];
      await adjustPoints(targetUser, amt, 'Credit', `Admin Balance Addition on 3D Dashboard`);
      addToast('Balance Added', `Added ₹${amt} to ${targetUser}'s wallet.`, 'success');
    } else {
      addToast('No Player', 'No active players found to credit balance.', 'warning');
    }
  };

  // Handle Reset Balance
  const handleResetBalance = async () => {
    if (playerUsernames.length > 0) {
      for (const user of playerUsernames) {
        await adjustPoints(user, 0, 'Debit', `Admin Reset Balance on 3D Dashboard`);
      }
      addToast('Balance Reset', `Reset active player balances.`, 'info');
    } else {
      addToast('Info', 'No active 3D players to reset.', 'info');
    }
  };

  // Get last 3D results from liveResults
  const last3DDraws = liveResults.filter((r) => r.gameType === '3D Lottery');
  const latestResult = last3DDraws[0] || {
    drawTime: '09:45PM',
    winningResult: 'A968, B203, C727',
  };

  return (
    <div className="min-h-screen bg-[#f5eedc] p-3 sm:p-6 font-sans flex flex-col items-center justify-start text-slate-900 animate-fade-in">
      
      {/* Top Bar Header */}
      <div className="w-full max-w-5xl bg-[#0e1626] text-white px-4 py-3 rounded-xl flex items-center justify-between mb-4 shadow-md border border-slate-800">
        <button className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-300 transition-colors">
          <Menu className="w-5 h-5" />
        </button>
        <div className="text-sm font-extrabold tracking-wider text-amber-400">
          SHYAM PANEL • 3D LOTTERY ADMIN
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => refreshData()} className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-300 transition-colors">
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Content Card Container */}
      <div className="w-full max-w-5xl bg-white rounded-2xl p-4 sm:p-6 shadow-xl border border-slate-200/80 space-y-6">
        
        {/* SECTION 1: "Live Players Bet" */}
        <div className="space-y-3">
          <h2 className="text-2xl font-black text-slate-900 text-center tracking-tight">
            Live Players Bet
          </h2>

          <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm bg-white">
            {playerUsernames.length === 0 ? (
              <div className="py-10 text-center text-slate-500 font-extrabold text-sm bg-slate-50/50">
                No Live 3D Bets
              </div>
            ) : (
              <div className="divide-y divide-slate-200">
                {playerUsernames.map((username) => {
                  const bets = playerBetsMap[username];
                  return (
                    <div key={`user-row-${username}`} className="flex flex-col sm:flex-row items-stretch border-b border-slate-200 last:border-b-0">
                      {/* Left Column: Username */}
                      <div className="w-full sm:w-36 bg-slate-50/80 px-4 py-3 font-extrabold text-slate-800 text-sm border-b sm:border-b-0 sm:border-r border-slate-200 flex items-center justify-center sm:justify-start text-center sm:text-left shrink-0">
                        {username}
                      </div>

                      {/* Right Column: Bet items list */}
                      <div className="flex-1 p-2.5 flex items-center gap-2 overflow-x-auto custom-scrollbar flex-wrap">
                        {bets.map((b) => (
                          <span
                            key={b.id}
                            className="px-3 py-1.5 rounded bg-[#fef3c7] text-[#92400e] border border-[#fde68a] text-xs font-bold font-mono inline-flex items-center gap-1 shadow-sm shrink-0"
                          >
                            {b.betStr}
                          </span>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* SECTION 2: CONTROLS & BALANCE BAR */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          {/* Left: 3D Lottery Badge */}
          <button className="bg-[#6366f1] hover:bg-[#4f46e5] text-white text-xs font-bold px-5 py-2 rounded-lg shadow-sm transition-all w-full sm:w-auto">
            3D Lottery
          </button>

          {/* Right: Reset Balance & Add Balance */}
          <div className="flex flex-wrap items-center justify-end gap-2 w-full sm:w-auto">
            <button
              onClick={handleResetBalance}
              className="bg-[#ec4899] hover:bg-[#db2777] text-white text-xs font-bold px-4 py-2 rounded-lg shadow-sm transition-all"
            >
              Reset Balance
            </button>

            <div className="flex items-center gap-1.5">
              <input
                type="number"
                value={balanceAddInput}
                onChange={(e) => setBalanceAddInput(e.target.value)}
                className="w-28 px-3 py-1.5 border border-slate-300 rounded-lg text-xs font-mono font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="Amount"
              />
              <button
                onClick={handleAddBalance}
                className="bg-[#10b981] hover:bg-[#059669] text-white text-xs font-bold px-4 py-2 rounded-lg shadow-sm transition-all"
              >
                Add Balance
              </button>
            </div>
          </div>
        </div>

        {/* SECTION 3: GAME TIMER & DIGIT INPUTS */}
        <div className="bg-slate-50/60 p-5 rounded-2xl border border-slate-200/80 space-y-3 text-center">
          <h3 className="text-xl font-black text-slate-900 tracking-tight">
            Game Timer:
          </h3>
          <div className="text-4xl sm:text-5xl font-extrabold text-red-600 tracking-wider font-mono">
            {formatTimer(secondsRemaining)}
          </div>
          <div className="text-xs font-extrabold text-slate-700 tracking-wider uppercase">
            NEXT DROW TIME : 10:00PM
          </div>

          {/* A, B, C Digit Inputs Row */}
          <div className="flex items-center justify-center gap-3 pt-2 font-mono font-bold text-xs">
            <span className="text-slate-800">A</span>
            <input
              type="text"
              value={inputA}
              onChange={(e) => setInputA(e.target.value)}
              className="w-24 px-3 py-1.5 border border-slate-300 rounded text-center font-mono font-extrabold text-xs text-slate-900 focus:outline-none focus:border-emerald-500 shadow-inner"
              placeholder=""
            />

            <span className="text-slate-800">B</span>
            <input
              type="text"
              value={inputB}
              onChange={(e) => setInputB(e.target.value)}
              className="w-24 px-3 py-1.5 border border-slate-300 rounded text-center font-mono font-extrabold text-xs text-slate-900 focus:outline-none focus:border-emerald-500 shadow-inner"
            />

            <span className="text-slate-800">C</span>
            <input
              type="text"
              value={inputC}
              onChange={(e) => setInputC(e.target.value)}
              className="w-24 px-3 py-1.5 border border-slate-300 rounded text-center font-mono font-extrabold text-xs text-slate-900 focus:outline-none focus:border-emerald-500 shadow-inner"
              placeholder=""
            />
          </div>

          {/* Action Buttons: View & Save */}
          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              onClick={() => refreshData()}
              className="bg-[#6b7280] hover:bg-[#4b5563] text-white text-xs font-bold px-6 py-1.5 rounded-lg shadow-sm transition-all"
            >
              View
            </button>
            <button
              onClick={handleSaveResult}
              className="bg-[#10b981] hover:bg-[#059669] text-white text-xs font-bold px-6 py-1.5 rounded-lg shadow-sm transition-all"
            >
              SAVE
            </button>
          </div>
        </div>

        {/* SECTION 4: SALES & WINNING TABLE */}
        <div className="flex justify-center">
          <table className="border-2 border-slate-900 text-xs font-extrabold font-mono text-center shadow-sm w-80">
            <thead>
              <tr className="border-b-2 border-slate-900 bg-slate-100">
                <th className="py-2 px-3 border-r-2 border-slate-900 text-slate-800">Details</th>
                <th className="py-2 px-3 border-r-2 border-slate-900 text-slate-800">A</th>
                <th className="py-2 px-3 border-r-2 border-slate-900 text-slate-800">B</th>
                <th className="py-2 px-3 text-slate-800">C</th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-slate-900">
              <tr>
                <td className="py-2 px-3 border-r-2 border-slate-900 bg-slate-50 text-slate-800">SALES</td>
                <td className="py-2 px-3 border-r-2 border-slate-900 text-slate-900">0</td>
                <td className="py-2 px-3 border-r-2 border-slate-900 text-slate-900">0</td>
                <td className="py-2 px-3 text-slate-900">0</td>
              </tr>
              <tr>
                <td className="py-2 px-3 border-r-2 border-slate-900 bg-slate-50 text-slate-800">WINNING</td>
                <td className="py-2 px-3 border-r-2 border-slate-900 text-slate-900">0</td>
                <td className="py-2 px-3 border-r-2 border-slate-900 text-slate-900">0</td>
                <td className="py-2 px-3 text-slate-900">0</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* SECTION 5: BOTTOM CARDS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          
          {/* Left Card: Daily Collection & Results */}
          <div className="p-4 border border-slate-200 rounded-2xl bg-white shadow-sm space-y-3">
            <div className="text-xs font-bold text-slate-700 text-center uppercase tracking-wide">
              Daily Collection & Results
            </div>
            <div className="space-y-2 text-xs font-extrabold font-mono text-slate-800">
              <div className="flex justify-between border-b border-slate-100 pb-1.5">
                <span>TOTAL Game Balance :</span>
                <span className="text-slate-900">1410</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-1.5">
                <span>TOTAL COLLECTION :</span>
                <span className="text-slate-900">37100</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-1.5">
                <span>TOTAL PAYMENT :</span>
                <span className="text-slate-900">39300</span>
              </div>
              <div className="flex justify-between pt-1">
                <span>BALANCE :</span>
                <span className="text-red-600 font-black">-2200</span>
              </div>
            </div>
          </div>

          {/* Right Card: Last Draw Results */}
          <div className="p-4 border border-slate-200 rounded-2xl bg-white shadow-sm flex flex-col items-center justify-center space-y-3">
            <div className="bg-[#06b6d4] text-slate-950 font-black px-5 py-1.5 rounded text-xs text-center border border-cyan-400 shadow-sm w-full">
              Last Draw Results : {latestResult.drawTime || '09:45PM'}
            </div>

            <div className="grid grid-cols-2 gap-2 w-full pt-1">
              <div className="border border-slate-300 rounded px-4 py-2 bg-white text-center shadow-sm text-[#db2777] font-extrabold text-sm font-mono">
                A968
              </div>
              <div className="border border-slate-300 rounded px-4 py-2 bg-white text-center shadow-sm text-[#db2777] font-extrabold text-sm font-mono">
                B203
              </div>
            </div>
            <div className="w-1/2 border border-slate-300 rounded px-4 py-2 bg-white text-center shadow-sm text-[#db2777] font-extrabold text-sm font-mono">
              C727
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
