import React, { useState } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { Percent, Shield, Sliders, CheckCircle2, Save, Sparkles, RefreshCw } from 'lucide-react';
import { WinPercentageConfig } from '../../types';

export const WinPercentageView: React.FC = () => {
  const { winPercentages, updateWinPercentage } = useAdmin();

  // Local state for editing sliders
  const [localConfigs, setLocalConfigs] = useState<WinPercentageConfig[]>(winPercentages);

  const handleSliderChange = (gameType: string, newRtp: number) => {
    const margin = Math.round((100 - newRtp) * 10) / 10;
    setLocalConfigs((prev) =>
      prev.map((c) => (c.gameType === gameType ? { ...c, rtpPercentage: newRtp, targetHouseMargin: margin } : c))
    );
  };

  const handleModeChange = (gameType: string, mode: 'Auto' | 'Manual' | 'High Margin') => {
    setLocalConfigs((prev) =>
      prev.map((c) => (c.gameType === gameType ? { ...c, mode } : c))
    );
  };

  const handleSave = (cfg: WinPercentageConfig) => {
    updateWinPercentage(cfg.gameType, cfg.rtpPercentage, cfg.targetHouseMargin, cfg.mode);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-900 border border-slate-800">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-indigo-950/80 border border-indigo-800/60 text-indigo-400">
            <Percent className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white flex items-center gap-2">
              <span>Game Win Percentage & Risk Controls</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-950 text-indigo-400 border border-indigo-800 font-bold">
                House RTP Margin
              </span>
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Control return to player (RTP) percentages, target house margins, and automatic risk balancing.
            </p>
          </div>
        </div>
      </div>

      {/* Grid of Game Win Percentage Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {localConfigs.map((cfg) => (
          <div
            key={cfg.gameType}
            className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-5"
          >
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-cyan-400" />
                  <span>{cfg.gameType}</span>
                </h3>
                <span className="text-[10px] text-slate-500 block mt-0.5">
                  Last updated: {cfg.updatedAt}
                </span>
              </div>

              <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => handleModeChange(cfg.gameType, 'Auto')}
                  className={`px-2.5 py-1 rounded-lg transition-colors ${
                    cfg.mode === 'Auto'
                      ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Auto
                </button>
                <button
                  type="button"
                  onClick={() => handleModeChange(cfg.gameType, 'Manual')}
                  className={`px-2.5 py-1 rounded-lg transition-colors ${
                    cfg.mode === 'Manual'
                      ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Manual
                </button>
                <button
                  type="button"
                  onClick={() => handleModeChange(cfg.gameType, 'High Margin')}
                  className={`px-2.5 py-1 rounded-lg transition-colors ${
                    cfg.mode === 'High Margin'
                      ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  High Margin
                </button>
              </div>
            </div>

            {/* RTP Slider Control */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-slate-300">Return to Player (RTP %):</span>
                <span className="text-cyan-400 text-base">{cfg.rtpPercentage}%</span>
              </div>

              <input
                type="range"
                min={50}
                max={95}
                step={0.5}
                value={cfg.rtpPercentage}
                onChange={(e) => handleSliderChange(cfg.gameType, parseFloat(e.target.value))}
                className="w-full accent-cyan-400 h-2 bg-slate-950 rounded-lg cursor-pointer"
              />

              <div className="flex justify-between text-[11px] text-slate-500 font-medium">
                <span>50% (High House Margin)</span>
                <span>95% (High Player Payout)</span>
              </div>
            </div>

            {/* Target House Margin & Limits Stats */}
            <div className="grid grid-cols-2 gap-3 p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs">
              <div>
                <span className="text-[10px] text-slate-500 uppercase font-bold block">
                  Target House Margin
                </span>
                <span className="text-sm font-extrabold text-emerald-400">
                  {cfg.targetHouseMargin}%
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 uppercase font-bold block">
                  Max Draw Liability
                </span>
                <span className="text-sm font-extrabold text-purple-400">
                  ₹{cfg.maxDrawLiability.toLocaleString()}
                </span>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => handleSave(cfg)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs shadow-lg shadow-cyan-500/20"
              >
                <Save className="w-4 h-4" />
                <span>Save Rule Settings</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
