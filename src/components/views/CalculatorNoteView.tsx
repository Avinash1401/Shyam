import React, { useState } from 'react';
import { Calculator, Sparkles, RefreshCw, AlertTriangle, Coins } from 'lucide-react';

export const CalculatorNoteView: React.FC = () => {
  const [selectedGame, setSelectedGame] = useState<'2D' | '3D' | 'Lucky12'>('2D');
  const [betPerDigit, setBetPerDigit] = useState<{ [digit: string]: number }>({
    '07': 500,
    '24': 1200,
    '48': 350,
    '89': 2500,
    '99': 150,
  });

  const [inputDigit, setInputDigit] = useState('');
  const [inputAmount, setInputAmount] = useState(100);

  const handleAddDigitBet = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputDigit) return;

    setBetPerDigit((prev) => ({
      ...prev,
      [inputDigit]: (prev[inputDigit] || 0) + Number(inputAmount),
    }));

    setInputDigit('');
  };

  const handleClear = () => {
    setBetPerDigit({});
  };

  const totalBet = Object.values(betPerDigit).reduce((a: number, b: number) => a + b, 0);

  // Multiplier matrix: 2D = 90x, 3D = 900x, Lucky12 = 10x
  const multiplier = selectedGame === '2D' ? 90 : selectedGame === '3D' ? 900 : 10;

  // Compute highest liability digit
  let maxExposureDigit = 'None';
  let maxExposureAmount = 0;

  Object.entries(betPerDigit).forEach(([digit, amount]) => {
    const numAmount = Number(amount);
    const payoutIfWins = numAmount * multiplier;
    if (payoutIfWins > maxExposureAmount) {
      maxExposureAmount = payoutIfWins;
      maxExposureDigit = digit;
    }
  });

  const netHouseProfitIfMaxWins = Number(totalBet) - Number(maxExposureAmount);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-900 border border-slate-800">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-teal-950/80 border border-teal-800/60 text-teal-400">
            <Calculator className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white flex items-center gap-2">
              <span>Calculator Note & Liability Analysis</span>
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Simulate digit bet collections and analyze maximum payout liability exposure.
            </p>
          </div>
        </div>

        <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-semibold">
          <button
            onClick={() => setSelectedGame('2D')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              selectedGame === '2D'
                ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            2D Lottery (90x)
          </button>
          <button
            onClick={() => setSelectedGame('3D')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              selectedGame === '3D'
                ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            3D Lottery (900x)
          </button>
          <button
            onClick={() => setSelectedGame('Lucky12')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              selectedGame === 'Lucky12'
                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Lucky 12 (10x)
          </button>
        </div>
      </div>

      {/* Simulator Inputs & Key Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Input Form */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Coins className="w-4 h-4 text-cyan-400" />
            <span>Add Digit Bet Volume</span>
          </h3>

          <form onSubmit={handleAddDigitBet} className="space-y-3 text-xs">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Digit / Combination Number
              </label>
              <input
                type="text"
                required
                placeholder={selectedGame === '2D' ? 'e.g. 89' : selectedGame === '3D' ? 'e.g. 489' : 'e.g. Card 07'}
                value={inputDigit}
                onChange={(e) => setInputDigit(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 text-white rounded-xl px-3 py-2 font-mono focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Bet Points (₹)</label>
              <input
                type="number"
                required
                min={10}
                value={inputAmount}
                onChange={(e) => setInputAmount(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 text-white rounded-xl px-3 py-2 font-bold focus:outline-none"
              />
            </div>

            <div className="pt-2 flex gap-2">
              <button
                type="submit"
                className="flex-1 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs shadow-lg shadow-cyan-500/20"
              >
                Add Bet Load
              </button>
              <button
                type="button"
                onClick={handleClear}
                className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs"
              >
                Reset
              </button>
            </div>
          </form>
        </div>

        {/* Calculated Exposure Metrics */}
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
            <span className="text-xs font-bold uppercase text-slate-400 tracking-wider">
              Total Bet Pool
            </span>
            <div className="text-2xl font-black text-white mt-2">
              ₹{totalBet.toLocaleString()}
            </div>
            <span className="text-[11px] text-slate-500 mt-2">
              Aggregated across all numbers
            </span>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
            <span className="text-xs font-bold uppercase text-slate-400 tracking-wider">
              Highest Risk Digit
            </span>
            <div className="text-2xl font-black text-rose-400 mt-2 font-mono flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-rose-400" />
              <span>[{maxExposureDigit}]</span>
            </div>
            <span className="text-[11px] text-rose-300 mt-2">
              Potential Payout: ₹{maxExposureAmount.toLocaleString()}
            </span>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
            <span className="text-xs font-bold uppercase text-slate-400 tracking-wider">
              Net Margin Exposure
            </span>
            <div
              className={`text-2xl font-black mt-2 ${
                netHouseProfitIfMaxWins >= 0 ? 'text-emerald-400' : 'text-rose-400'
              }`}
            >
              ₹{netHouseProfitIfMaxWins.toLocaleString()}
            </div>
            <span className="text-[11px] text-slate-500 mt-2">
              {netHouseProfitIfMaxWins >= 0 ? 'Profitable Draw' : 'House Negative Exposure'}
            </span>
          </div>
        </div>
      </div>

      {/* Breakdown Matrix Grid */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        <h3 className="text-sm font-bold text-white">Digit Bet Liability Table</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {Object.entries(betPerDigit).map(([digit, bet]) => {
            const numBet = Number(bet);
            const payout = numBet * multiplier;
            const netMargin = Number(totalBet) - Number(payout);

            return (
              <div
                key={digit}
                className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex flex-col justify-between space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-cyan-400 font-mono">Digit {digit}</span>
                  <span className="text-[10px] text-slate-400 font-semibold">{multiplier}x Payout</span>
                </div>

                <div>
                  <div className="text-sm font-extrabold text-white">Bet: ₹{bet.toLocaleString()}</div>
                  <div className="text-xs text-rose-400 font-bold">Payout: ₹{payout.toLocaleString()}</div>
                </div>

                <div className="pt-2 border-t border-slate-800/80 text-[11px]">
                  <span className="text-slate-500 block text-[10px]">Net House Impact:</span>
                  <span className={`font-bold ${netMargin >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    ₹{netMargin.toLocaleString()}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
