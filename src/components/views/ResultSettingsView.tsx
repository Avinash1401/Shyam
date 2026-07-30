import React, { useState } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { useLiveStats } from '../../hooks/useLiveStats';
import { socketService } from '../../services/socketService';
import {
  Sliders,
  Lock,
  Unlock,
  ShieldAlert,
  Sparkles,
  Zap,
  Clock,
  Key,
  VolumeX,
  Volume2,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  TrendingUp,
  Wallet,
  Users,
  Radio,
  Gamepad2,
  SlidersHorizontal,
} from 'lucide-react';

export const ResultSettingsView: React.FC = () => {
  const {
    gameControls,
    toggleResultMode,
    toggleGameStatus,
    toggleBettingLock,
    updateGameControl,
    verifyAdminPin,
    silenceBettingNotifications,
    toggleSilenceBettingNotifications,
    addToast,
  } = useAdmin();

  const { liveBetIn, liveBetOut, activePlayerCount, todayProfitLoss, isConnected, lastUpdatedTime, refreshStats } =
    useLiveStats();

  const [inputPin, setInputPin] = useState('');
  const [pinError, setPinError] = useState(false);
  const [modalTarget, setModalTarget] = useState<{
    type: 'lock_game' | 'lock_betting' | 'bulk_lock' | 'bulk_unlock' | 'update_config';
    gameType?: string;
    actionLabel: string;
    pendingUpdates?: Partial<any>;
  } | null>(null);

  // Editable form state per game
  const [editingGame, setEditingGame] = useState<string | null>(null);
  const [durationInput, setDurationInput] = useState<number>(60);
  const [minBetInput, setMinBetInput] = useState<number>(10);
  const [maxBetInput, setMaxBetInput] = useState<number>(50000);
  const [payoutInput, setPayoutInput] = useState<number>(90);

  const openConfigModal = (
    type: 'lock_game' | 'lock_betting' | 'bulk_lock' | 'bulk_unlock' | 'update_config',
    gameType?: string,
    actionLabel: string = 'Confirm Action',
    pendingUpdates?: Partial<any>
  ) => {
    setModalTarget({ type, gameType, actionLabel, pendingUpdates });
    setInputPin('');
    setPinError(false);
  };

  const handleConfirmAction = () => {
    if (!verifyAdminPin(inputPin)) {
      setPinError(true);
      addToast('Security PIN Invalid', 'Master Admin Security PIN is required (Default: 1234)', 'error');
      return;
    }

    if (!modalTarget) return;

    if (modalTarget.type === 'lock_game' && modalTarget.gameType) {
      toggleGameStatus(modalTarget.gameType);
      socketService.broadcastGameControlUpdate({ gameType: modalTarget.gameType, status: 'Stopped' });
    } else if (modalTarget.type === 'lock_betting' && modalTarget.gameType) {
      toggleBettingLock(modalTarget.gameType);
      socketService.broadcastGameControlUpdate({ gameType: modalTarget.gameType, bettingLocked: true });
    } else if (modalTarget.type === 'bulk_lock') {
      gameControls.forEach((gc) => {
        if (!gc.bettingLocked) toggleBettingLock(gc.gameType);
      });
      addToast('Bulk Action Executed', 'All games betting locked successfully.', 'warning');
    } else if (modalTarget.type === 'bulk_unlock') {
      gameControls.forEach((gc) => {
        if (gc.bettingLocked) toggleBettingLock(gc.gameType);
      });
      addToast('Bulk Action Executed', 'All games betting unlocked successfully.', 'success');
    } else if (modalTarget.type === 'update_config' && modalTarget.gameType && modalTarget.pendingUpdates) {
      updateGameControl(modalTarget.gameType, modalTarget.pendingUpdates);
      addToast('Configuration Saved', `${modalTarget.gameType} parameter rules updated.`, 'success');
      setEditingGame(null);
    }

    setModalTarget(null);
    setInputPin('');
    setPinError(false);
  };

  const startEditGame = (gameType: string) => {
    const gc = gameControls.find((g) => g.gameType === gameType);
    if (gc) {
      setEditingGame(gameType);
      setDurationInput(gc.roundDurationSeconds);
      setMinBetInput(gc.minBet);
      setMaxBetInput(gc.maxBet);
      setPayoutInput(gc.payoutPercentage);
    }
  };

  return (
    <div className="space-y-6 animate-slide-in pb-12">
      {/* Top Banner Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-white flex items-center gap-2">
              <SlidersHorizontal className="w-6 h-6 text-cyan-400" />
              <span>Result Mode & Game Lock Control</span>
            </h1>
            <span className="text-[10px] uppercase font-bold px-2.5 py-0.5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800">
              Admin Master
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Toggle between Manual vs Automatic draw results, lock/unlock game betting, and manage anti-spam notifications.
          </p>
        </div>

        {/* Global Action Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => openConfigModal('bulk_lock', undefined, 'Lock All Games Betting')}
            className="px-3.5 py-2 rounded-xl bg-rose-950/80 hover:bg-rose-900 border border-rose-800/80 text-rose-200 text-xs font-bold flex items-center gap-2 transition-all shadow-md"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Lock All Games</span>
          </button>

          <button
            onClick={() => openConfigModal('bulk_unlock', undefined, 'Unlock All Games Betting')}
            className="px-3.5 py-2 rounded-xl bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-800/80 text-emerald-200 text-xs font-bold flex items-center gap-2 transition-all shadow-md"
          >
            <Unlock className="w-3.5 h-3.5" />
            <span>Unlock All Games</span>
          </button>
        </div>
      </div>

      {/* Real-time Socket & Live Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-xl flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-cyan-950 border border-cyan-800 flex items-center justify-center shrink-0">
            <Radio className="w-5 h-5 text-cyan-400 animate-pulse" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Socket Sync</span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-emerald-400 animate-ping' : 'bg-amber-400'}`} />
              <span className="text-xs font-bold text-white">{isConnected ? 'Live WebSocket' : 'Polling (2s)'}</span>
            </div>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-xl flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-950 border border-blue-800 flex items-center justify-center shrink-0">
            <Wallet className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Live Bet In</span>
            <span className="text-sm font-bold text-white font-mono">₹{liveBetIn.toLocaleString()}</span>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-xl flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-purple-950 border border-purple-800 flex items-center justify-center shrink-0">
            <TrendingUp className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Live Bet Out</span>
            <span className="text-sm font-bold text-white font-mono">₹{liveBetOut.toLocaleString()}</span>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-xl flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-950 border border-amber-800 flex items-center justify-center shrink-0">
            <Users className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Active Players</span>
            <span className="text-sm font-bold text-white font-mono">{activePlayerCount} Online</span>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-xl flex items-center justify-between col-span-2 md:col-span-1">
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Today Profit/Loss</span>
            <span className={`text-sm font-bold font-mono ${todayProfitLoss >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              ₹{todayProfitLoss.toLocaleString()}
            </span>
          </div>
          <button
            onClick={refreshStats}
            className="p-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-400 hover:text-white"
            title={`Last updated at ${lastUpdatedTime}`}
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Notification Silence Settings (Requirement: Stop Betting Notification for Admin & User) */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-950/80 border border-amber-800 flex items-center justify-center shrink-0 mt-0.5">
            {silenceBettingNotifications ? (
              <VolumeX className="w-5 h-5 text-amber-400" />
            ) : (
              <Volume2 className="w-5 h-5 text-cyan-400" />
            )}
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <span>Betting Closed Popups / Toast Notifications</span>
              <span
                className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${
                  silenceBettingNotifications
                    ? 'bg-amber-950 text-amber-400 border-amber-800'
                    : 'bg-emerald-950 text-emerald-400 border-emerald-800'
                }`}
              >
                {silenceBettingNotifications ? 'SILENCED (NO SPAM)' : 'ACTIVE'}
              </span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Stop automatic round timer ended toast popups for both Admin and User interfaces. Prevents popup spam completely.
            </p>
          </div>
        </div>

        <button
          onClick={toggleSilenceBettingNotifications}
          className={`px-4 py-2.5 rounded-xl border text-xs font-bold flex items-center gap-2 transition-all ${
            silenceBettingNotifications
              ? 'bg-amber-950/80 text-amber-300 border-amber-800 hover:bg-amber-900'
              : 'bg-slate-950 text-slate-300 border-slate-800 hover:bg-slate-800'
          }`}
        >
          {silenceBettingNotifications ? (
            <>
              <VolumeX className="w-4 h-4 text-amber-400" />
              <span>Betting Notifications Muted</span>
            </>
          ) : (
            <>
              <Volume2 className="w-4 h-4 text-cyan-400" />
              <span>Enable Betting Notifications</span>
            </>
          )}
        </button>
      </div>

      {/* Main Game Settings Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {gameControls.map((gc) => (
          <div
            key={gc.gameType}
            className={`bg-slate-900 border rounded-2xl p-5 shadow-xl transition-all space-y-4 ${
              gc.status === 'Stopped'
                ? 'border-rose-900/50 opacity-90'
                : gc.bettingLocked
                ? 'border-amber-900/50'
                : 'border-slate-800'
            }`}
          >
            {/* Card Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-center">
                  <Gamepad2 className="w-4 h-4 text-cyan-400" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">{gc.gameType}</h3>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span
                      className={`text-[10px] px-2 py-0.2 rounded-full font-bold border ${
                        gc.status === 'Active'
                          ? 'bg-emerald-950 text-emerald-400 border-emerald-800'
                          : 'bg-rose-950 text-rose-400 border-rose-800'
                      }`}
                    >
                      {gc.status}
                    </span>

                    <span
                      className={`text-[10px] px-2 py-0.2 rounded-full font-bold border ${
                        gc.bettingLocked
                          ? 'bg-amber-950 text-amber-400 border-amber-800'
                          : 'bg-blue-950 text-blue-400 border-blue-800'
                      }`}
                    >
                      {gc.bettingLocked ? 'Betting Locked' : 'Betting Open'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Toggle Mode Button (Manual vs Auto) */}
              <button
                type="button"
                onClick={() => {
                  toggleResultMode(gc.gameType);
                  socketService.broadcastGameControlUpdate({
                    gameType: gc.gameType,
                    mode: gc.mode === 'Auto' ? 'Manual' : 'Auto',
                  });
                  addToast('Result Mode Switched', `${gc.gameType} set to ${gc.mode === 'Auto' ? 'Manual' : 'Auto'} mode.`, 'info');
                }}
                className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm ${
                  gc.mode === 'Auto'
                    ? 'bg-cyan-950 text-cyan-300 border-cyan-800 hover:bg-cyan-900'
                    : 'bg-amber-950 text-amber-300 border-amber-800 hover:bg-amber-900'
                }`}
                title="Click to switch between Manual vs Automatic draw mode"
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>Mode: {gc.mode}</span>
              </button>
            </div>

            {/* Quick Status Stats */}
            <div className="grid grid-cols-3 gap-2 bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs">
              <div>
                <span className="text-[10px] text-slate-500 uppercase block font-medium">Round No</span>
                <span className="font-mono text-white font-bold">{gc.currentRoundNo}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 uppercase block font-medium">Round Timer</span>
                <span className="font-mono text-cyan-400 font-bold">{gc.secondsRemaining}s</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 uppercase block font-medium">Payout Rate</span>
                <span className="font-mono text-emerald-400 font-bold">{gc.payoutPercentage}%</span>
              </div>
            </div>

            {/* Editing Parameters Form */}
            {editingGame === gc.gameType ? (
              <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800 space-y-3 text-xs">
                <div className="font-bold text-white flex items-center justify-between border-b border-slate-800 pb-2">
                  <span>Edit Game Rules ({gc.gameType})</span>
                  <button
                    onClick={() => setEditingGame(null)}
                    className="text-slate-500 hover:text-white text-[10px]"
                  >
                    Cancel
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1">Round Duration (sec)</label>
                    <input
                      type="number"
                      value={durationInput}
                      onChange={(e) => setDurationInput(Number(e.target.value))}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-white font-mono text-xs focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1">Payout Ratio (%)</label>
                    <input
                      type="number"
                      value={payoutInput}
                      onChange={(e) => setPayoutInput(Number(e.target.value))}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-white font-mono text-xs focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1">Min Bet (₹)</label>
                    <input
                      type="number"
                      value={minBetInput}
                      onChange={(e) => setMinBetInput(Number(e.target.value))}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-white font-mono text-xs focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1">Max Bet (₹)</label>
                    <input
                      type="number"
                      value={maxBetInput}
                      onChange={(e) => setMaxBetInput(Number(e.target.value))}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-white font-mono text-xs focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    openConfigModal(
                      'update_config',
                      gc.gameType,
                      `Save Rules for ${gc.gameType}`,
                      {
                        roundDurationSeconds: durationInput,
                        payoutPercentage: payoutInput,
                        minBet: minBetInput,
                        maxBet: maxBetInput,
                      }
                    )
                  }
                  className="w-full py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs transition-colors"
                >
                  Apply Rule Changes
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>
                  Limits: ₹{gc.minBet} - ₹{gc.maxBet.toLocaleString()} | Round: {gc.roundDurationSeconds}s
                </span>
                <button
                  onClick={() => startEditGame(gc.gameType)}
                  className="text-cyan-400 hover:text-cyan-300 font-bold underline text-[11px]"
                >
                  Configure Rules
                </button>
              </div>
            )}

            {/* Quick Action Locks */}
            <div className="flex items-center gap-2 pt-2 border-t border-slate-800/80">
              <button
                type="button"
                onClick={() =>
                  openConfigModal(
                    'lock_betting',
                    gc.gameType,
                    `${gc.bettingLocked ? 'Unlock' : 'Lock'} Betting for ${gc.gameType}`
                  )
                }
                className={`flex-1 py-2 rounded-xl border font-bold text-xs flex items-center justify-center gap-1.5 transition-all ${
                  gc.bettingLocked
                    ? 'bg-amber-950/80 text-amber-300 border-amber-800 hover:bg-amber-900'
                    : 'bg-slate-950 text-slate-300 border-slate-800 hover:bg-slate-800'
                }`}
              >
                {gc.bettingLocked ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
                <span>{gc.bettingLocked ? 'Unlock Betting' : 'Lock Betting'}</span>
              </button>

              <button
                type="button"
                onClick={() =>
                  openConfigModal(
                    'lock_game',
                    gc.gameType,
                    `${gc.status === 'Active' ? 'Stop' : 'Activate'} ${gc.gameType}`
                  )
                }
                className={`px-3 py-2 rounded-xl border font-bold text-xs flex items-center justify-center gap-1.5 transition-all ${
                  gc.status === 'Active'
                    ? 'bg-rose-950/60 text-rose-300 border-rose-800 hover:bg-rose-900'
                    : 'bg-emerald-950/60 text-emerald-300 border-emerald-800 hover:bg-emerald-900'
                }`}
              >
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>{gc.status === 'Active' ? 'Stop Game' : 'Activate'}</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Security PIN Safeguard Modal */}
      {modalTarget && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-2xl p-6 shadow-2xl relative animate-slide-in">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-amber-950/80 border border-amber-800 flex items-center justify-center text-amber-400 shrink-0">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">{modalTarget.actionLabel}</h3>
                <p className="text-xs text-slate-400">Admin Security Verification Required</p>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              You are modifying critical game engine parameters. Please verify your Master Admin Security PIN to execute this operation.
            </p>

            <div className="mb-5">
              <label className="block text-slate-300 text-xs font-bold mb-1 flex items-center gap-1">
                <Key className="w-3.5 h-3.5 text-rose-400" />
                <span>Master Admin Security PIN</span>
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
                className={`w-full bg-slate-950 border text-white font-mono rounded-xl px-3.5 py-2.5 text-xs focus:outline-none ${
                  pinError ? 'border-rose-500 focus:border-rose-500' : 'border-slate-800 focus:border-amber-500'
                }`}
              />
            </div>

            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setModalTarget(null)}
                className="px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 hover:text-white text-xs font-bold"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleConfirmAction}
                className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-extrabold shadow-lg transition-colors"
              >
                Verify & Execute
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
