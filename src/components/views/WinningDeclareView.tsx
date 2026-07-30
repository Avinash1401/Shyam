import React, { useState } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { Trophy, CheckCircle2, AlertTriangle, Sparkles, X, ShieldAlert, Key, Sliders } from 'lucide-react';

export const WinningDeclareView: React.FC = () => {
  const { declareWinningResult, verifyAdminPin, gameControls, toggleResultMode, addToast } = useAdmin();

  const [selectedGame, setSelectedGame] = useState<'2D Lottery' | '3D Lottery' | 'Lucky 12'>('2D Lottery');
  const [drawNum, setDrawNum] = useState(`DRW-9844`);
  const [winningResult, setWinningResult] = useState('');
  const [inputPin, setInputPin] = useState('');
  const [pinError, setPinError] = useState(false);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);

  const currentGameControl = gameControls.find((gc) => gc.gameType === selectedGame);

  // Quick preset choices
  const quickPresets2D = ['07', '12', '24', '48', '89', '99'];
  const quickPresets3D = ['124', '350', '489', '777', '912'];
  const quickPresetsLucky12 = ['Card #01 (Golden Crown)', 'Card #02 (Lucky Seven)', 'Card #07 (Golden Lotus)', 'Card #11 (Ace of Spades)'];

  const handleDeclareSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!winningResult) {
      addToast('Select Result', 'Please enter or select a winning result.', 'error');
      return;
    }
    setConfirmModalOpen(true);
  };

  const handleFinalConfirm = () => {
    if (!verifyAdminPin(inputPin)) {
      setPinError(true);
      addToast('Security PIN Invalid', 'Master Admin Security PIN is incorrect (Default: 1234)', 'error');
      return;
    }

    declareWinningResult(selectedGame, drawNum, winningResult, 'superadmin');
    setConfirmModalOpen(false);
    setWinningResult('');
    setInputPin('');
    setPinError(false);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-900 border border-slate-800">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-amber-950/80 border border-amber-800/60 text-amber-400">
            <Trophy className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white flex items-center gap-2">
              <span>Winning Result Declaration Master</span>
              {currentGameControl && (
                <button
                  type="button"
                  onClick={() => toggleResultMode(selectedGame)}
                  className={`text-xs px-2.5 py-0.5 rounded-full border font-bold transition-all ${
                    currentGameControl.mode === 'Auto'
                      ? 'bg-cyan-950 text-cyan-400 border-cyan-800'
                      : 'bg-amber-950 text-amber-400 border-amber-800'
                  }`}
                  title="Click to toggle Manual vs Automatic mode"
                >
                  Mode: {currentGameControl.mode} Mode
                </button>
              )}
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Declare official draw outcomes for 2D Lottery, 3D Lottery, and Lucky 12 games.
            </p>
          </div>
        </div>

        <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-semibold">
          <button
            onClick={() => setSelectedGame('2D Lottery')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              selectedGame === '2D Lottery'
                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            2D Lottery
          </button>
          <button
            onClick={() => setSelectedGame('3D Lottery')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              selectedGame === '3D Lottery'
                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            3D Lottery
          </button>
          <button
            onClick={() => setSelectedGame('Lucky 12')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              selectedGame === 'Lucky 12'
                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Lucky 12
          </button>
        </div>
      </div>

      {/* Main Form Box */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl max-w-2xl mx-auto space-y-6">
        <div className="border-b border-slate-800 pb-4 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <span>Declare Result for {selectedGame}</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Entering the official result will automatically credit winning tickets and record security audit log.
            </p>
          </div>

          <button
            type="button"
            onClick={() => toggleResultMode(selectedGame)}
            className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 font-bold flex items-center gap-1.5"
          >
            <Sliders className="w-3.5 h-3.5 text-cyan-400" /> Switch to {currentGameControl?.mode === 'Auto' ? 'Manual' : 'Auto'}
          </button>
        </div>

        <form onSubmit={handleDeclareSubmit} className="space-y-5 text-xs">
          <div>
            <label className="block text-slate-300 font-semibold mb-1">Draw Code / ID</label>
            <input
              type="text"
              required
              value={drawNum}
              onChange={(e) => setDrawNum(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 text-white rounded-xl px-3 py-2 font-mono text-xs focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Winning Result Value</label>
            <input
              type="text"
              required
              placeholder={selectedGame === '2D Lottery' ? 'e.g. 89' : selectedGame === '3D Lottery' ? 'e.g. 489' : 'e.g. Card #07'}
              value={winningResult}
              onChange={(e) => setWinningResult(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 text-amber-300 font-mono text-lg font-black rounded-xl px-4 py-3 focus:outline-none"
            />
          </div>

          {/* Quick Preset Buttons */}
          <div>
            <span className="text-slate-400 font-medium block mb-2">Quick Choice Selector:</span>
            <div className="flex flex-wrap gap-2">
              {(selectedGame === '2D Lottery'
                ? quickPresets2D
                : selectedGame === '3D Lottery'
                ? quickPresets3D
                : quickPresetsLucky12
              ).map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setWinningResult(preset)}
                  className={`px-3 py-1.5 rounded-xl border text-xs font-mono font-bold transition-all ${
                    winningResult === preset
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-md'
                      : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800 flex justify-end">
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-black text-sm shadow-lg shadow-amber-500/20"
            >
              <Trophy className="w-4 h-4" />
              <span>Finalize & Publish Winner</span>
            </button>
          </div>
        </form>
      </div>

      {/* Confirmation Safeguard Modal with Security PIN */}
      {confirmModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-2xl p-6 shadow-2xl relative animate-slide-in">
            <button
              onClick={() => setConfirmModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-12 h-12 rounded-2xl bg-amber-950 border border-amber-800/80 text-amber-400 flex items-center justify-center mb-4">
              <ShieldAlert className="w-6 h-6" />
            </div>

            <h3 className="text-lg font-bold text-white mb-1">Confirm Winner Declaration</h3>
            <p className="text-xs text-slate-400 mb-4">
              Are you sure you want to declare winning result <span className="text-amber-400 font-extrabold font-mono text-sm">[{winningResult}]</span> for <span className="text-white font-bold">{selectedGame}</span> ({drawNum})?
            </p>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 space-y-2 mb-4">
              <div className="flex justify-between">
                <span>Draw ID:</span>
                <span className="font-mono text-white">{drawNum}</span>
              </div>
              <div className="flex justify-between">
                <span>Game:</span>
                <span className="text-cyan-400 font-bold">{selectedGame}</span>
              </div>
            </div>

            <div className="mb-5">
              <label className="block text-slate-300 text-xs font-bold mb-1 flex items-center gap-1">
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
            </div>

            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setConfirmModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleFinalConfirm}
                className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/20"
              >
                Confirm & Declare
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
