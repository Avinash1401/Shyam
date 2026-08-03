import React, { useState } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { BarChart3, Download, Calendar, Search, TrendingUp, Coins, Briefcase } from 'lucide-react';
import { TurnoverRecord, UserRole } from '../../types';

interface TurnoverReportViewProps {
  level: 'Admin' | 'SuperDistributer' | 'Distributer' | 'Retailer' | 'User';
}

export const TurnoverReportView: React.FC<TurnoverReportViewProps> = ({ level }) => {
  const { superDistributers, distributers, retailers, users, addToast } = useAdmin();

  const [dateRange, setDateRange] = useState<'today' | 'yesterday' | 'week' | 'month'>('today');
  const [search, setSearch] = useState('');

  // Generate tier-specific turnover data
  const getTurnoverRecords = (): TurnoverRecord[] => {
    let sourceList =
      level === 'SuperDistributer'
        ? superDistributers
        : level === 'Distributer'
        ? distributers
        : level === 'Retailer'
        ? retailers
        : level === 'User'
        ? users
        : superDistributers;

    if (level === 'Admin') {
      return [
        {
          id: 'to-admin-1',
          accountName: 'Shyam111 Master Network',
          role: 'SuperAdmin',
          totalPlay: 185400,
          totalWin: 124200,
          netTurnover: 61200,
          commissionEarned: 9270,
          netProfit: 51930,
          period: 'Today (2026-07-30)',
        },
      ];
    }

    return sourceList.map((acc, i) => {
      const play = Math.floor(30000 + (i * 12500) % 80000);
      const win = Math.floor(play * 0.72);
      const net = play - win;
      const comm = Math.floor(play * (acc.commissionRate / 100));
      const profit = net - comm;

      return {
        id: `to-${acc.id}`,
        accountName: `${acc.name} (${acc.username})`,
        role: acc.role,
        totalPlay: play,
        totalWin: win,
        netTurnover: net,
        commissionEarned: comm,
        netProfit: profit,
        period: dateRange === 'today' ? 'Today' : dateRange,
      };
    });
  };

  const records = getTurnoverRecords();

  const filteredRecords = records.filter((r) =>
    r.accountName.toLowerCase().includes(search.toLowerCase())
  );

  const totalPlayAll = filteredRecords.reduce((a, b) => a + b.totalPlay, 0);
  const totalWinAll = filteredRecords.reduce((a, b) => a + b.totalWin, 0);
  const netTurnoverAll = filteredRecords.reduce((a, b) => a + b.netTurnover, 0);
  const commissionAll = filteredRecords.reduce((a, b) => a + b.commissionEarned, 0);
  const netProfitAll = filteredRecords.reduce((a, b) => a + b.netProfit, 0);

  const handleExportCSV = () => {
    addToast('CSV Download Started', `Exporting ${level} Turnover Report...`, 'success');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-900 border border-slate-800">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-cyan-950/80 border border-cyan-800/60 text-cyan-400">
            <BarChart3 className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white flex items-center gap-2">
              <span>{level} Turn-Over Report</span>
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Financial turnover, total bets, payouts, commission costs, and net house revenue for {level} tier.
            </p>
          </div>
        </div>

        <button
          onClick={handleExportCSV}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs shadow-lg shadow-cyan-500/20"
        >
          <Download className="w-4 h-4" />
          <span>Export Report (CSV)</span>
        </button>
      </div>

      {/* Date Filter & Search */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 rounded-xl bg-slate-900/80 border border-slate-800">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Filter accounts in report..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 text-slate-200 text-xs rounded-xl pl-9 pr-4 py-2 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-slate-400" />
          <span className="text-xs text-slate-400 font-medium">Period:</span>
          <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => setDateRange('today')}
              className={`px-3 py-1 rounded-lg font-medium transition-colors ${
                dateRange === 'today'
                  ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Today
            </button>
            <button
              onClick={() => setDateRange('yesterday')}
              className={`px-3 py-1 rounded-lg font-medium transition-colors ${
                dateRange === 'yesterday'
                  ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Yesterday
            </button>
            <button
              onClick={() => setDateRange('week')}
              className={`px-3 py-1 rounded-lg font-medium transition-colors ${
                dateRange === 'week'
                  ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              This Week
            </button>
          </div>
        </div>
      </div>

      {/* Aggregate Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <span className="text-[10px] text-slate-500 uppercase font-bold block">Total Play</span>
          <div className="text-xl font-black text-cyan-400 mt-1">₹{totalPlayAll.toLocaleString()}</div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <span className="text-[10px] text-slate-500 uppercase font-bold block">Total Win</span>
          <div className="text-xl font-black text-purple-400 mt-1">₹{totalWinAll.toLocaleString()}</div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <span className="text-[10px] text-slate-500 uppercase font-bold block">Net Turnover</span>
          <div className="text-xl font-black text-amber-400 mt-1">₹{netTurnoverAll.toLocaleString()}</div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <span className="text-[10px] text-slate-500 uppercase font-bold block">Commission</span>
          <div className="text-xl font-black text-indigo-400 mt-1">₹{commissionAll.toLocaleString()}</div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <span className="text-[10px] text-slate-500 uppercase font-bold block">Net Profit</span>
          <div className="text-xl font-black text-emerald-400 mt-1">₹{netProfitAll.toLocaleString()}</div>
        </div>
      </div>

      {/* Breakdown Table */}
      <div className="overflow-x-auto rounded-2xl bg-slate-900 border border-slate-800 shadow-xl">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-950/80 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-800">
            <tr>
              <th className="p-4">Account Name</th>
              <th className="p-4">Role Tier</th>
              <th className="p-4">Total Play Wager</th>
              <th className="p-4">Total Win Payout</th>
              <th className="p-4">Net Turnover</th>
              <th className="p-4">Commission</th>
              <th className="p-4 text-right">Net Profit</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-medium">
            {filteredRecords.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-8 text-center text-slate-500">
                  No records found.
                </td>
              </tr>
            ) : (
              filteredRecords.map((rec) => (
                <tr key={rec.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-4 font-bold text-white">{rec.accountName}</td>
                  <td className="p-4 text-slate-400">{rec.role}</td>
                  <td className="p-4 font-extrabold text-cyan-400">₹{rec.totalPlay.toLocaleString()}</td>
                  <td className="p-4 font-extrabold text-purple-400">₹{rec.totalWin.toLocaleString()}</td>
                  <td className="p-4 font-bold text-amber-400">₹{rec.netTurnover.toLocaleString()}</td>
                  <td className="p-4 font-bold text-indigo-300">₹{rec.commissionEarned.toLocaleString()}</td>
                  <td className="p-4 text-right font-black text-emerald-400 text-sm">
                    ₹{rec.netProfit.toLocaleString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
