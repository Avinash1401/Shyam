import React, { useState } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { Briefcase, Search, Download, CheckCircle2, Clock } from 'lucide-react';
import { CommissionRecord } from '../../types';

interface CommissionReportViewProps {
  type: 'user' | 'game';
}

export const CommissionReportView: React.FC<CommissionReportViewProps> = ({ type }) => {
  const { superDistributers, distributers, retailers, addToast } = useAdmin();
  const [search, setSearch] = useState('');

  // Sample commission data generator
  const getCommissionRecords = (): CommissionRecord[] => {
    if (type === 'game') {
      return [
        {
          id: 'comm-g1',
          username: '2D Lottery Game',
          role: 'SuperAdmin',
          parentName: 'System',
          gameType: '2D Lottery',
          totalPlayAmount: 85000,
          commissionPercentage: 5.0,
          commissionAmount: 4250,
          status: 'Paid',
          date: '2026-07-30',
        },
        {
          id: 'comm-g2',
          username: '3D Lottery Game',
          role: 'SuperAdmin',
          parentName: 'System',
          gameType: '3D Lottery',
          totalPlayAmount: 62000,
          commissionPercentage: 6.0,
          commissionAmount: 3720,
          status: 'Paid',
          date: '2026-07-30',
        },
        {
          id: 'comm-g3',
          username: 'Lucky 12 Game',
          role: 'SuperAdmin',
          parentName: 'System',
          gameType: 'Lucky 12',
          totalPlayAmount: 38400,
          commissionPercentage: 4.5,
          commissionAmount: 1728,
          status: 'Pending',
          date: '2026-07-30',
        },
      ];
    }

    const allAgents = [...superDistributers, ...distributers, ...retailers];
    return allAgents.map((ag) => {
      const play = Math.floor(25000 + (ag.points % 50000));
      const amount = Math.floor(play * (ag.commissionRate / 100));

      return {
        id: `comm-${ag.id}`,
        username: ag.username,
        role: ag.role,
        parentName: ag.parentName || 'superadmin',
        totalPlayAmount: play,
        commissionPercentage: ag.commissionRate,
        commissionAmount: amount,
        status: ag.points > 30000 ? 'Paid' : 'Pending',
        date: '2026-07-30',
      };
    });
  };

  const records = getCommissionRecords();

  const filteredRecords = records.filter(
    (r) =>
      r.username.toLowerCase().includes(search.toLowerCase()) ||
      r.parentName.toLowerCase().includes(search.toLowerCase())
  );

  const totalCommission = filteredRecords.reduce((a, b) => a + b.commissionAmount, 0);

  const handleExport = () => {
    addToast('Commission Export', `Downloaded ${type === 'user' ? 'User Wise' : 'Game Wise'} commission report CSV.`);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-900 border border-slate-800">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-teal-950/80 border border-teal-800/60 text-teal-400">
            <Briefcase className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white flex items-center gap-2">
              <span>{type === 'user' ? 'User Wise Commission' : 'Game Wise Commission'} Report</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-teal-950 text-teal-400 border border-teal-800 font-bold">
                ₹{totalCommission.toLocaleString()} Generated
              </span>
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Commission breakdown generated across agents, retailers, and game titles.
            </p>
          </div>
        </div>

        <button
          onClick={handleExport}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs shadow-lg shadow-cyan-500/20"
        >
          <Download className="w-4 h-4" />
          <span>Export CSV</span>
        </button>
      </div>

      {/* Search */}
      <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search commission record..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 text-slate-200 text-xs rounded-xl pl-9 pr-4 py-2 focus:outline-none"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-2xl bg-slate-900 border border-slate-800 shadow-xl">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-950/80 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-800">
            <tr>
              <th className="p-4">{type === 'user' ? 'Agent / User' : 'Game Title'}</th>
              <th className="p-4">Parent Agency</th>
              <th className="p-4">Total Play Wager</th>
              <th className="p-4">Commission % Rate</th>
              <th className="p-4">Commission Earned</th>
              <th className="p-4">Payout Status</th>
              <th className="p-4 text-right">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-medium">
            {filteredRecords.map((r) => (
              <tr key={r.id} className="hover:bg-slate-800/40 transition-colors">
                <td className="p-4 font-bold text-white">
                  {r.username}
                  <div className="text-[10px] text-slate-500 font-normal">{r.role}</div>
                </td>
                <td className="p-4 text-slate-400">{r.parentName}</td>
                <td className="p-4 font-extrabold text-cyan-400">
                  ₹{r.totalPlayAmount.toLocaleString()}
                </td>
                <td className="p-4 font-bold text-indigo-300">{r.commissionPercentage}%</td>
                <td className="p-4 font-black text-emerald-400 text-sm">
                  ₹{r.commissionAmount.toLocaleString()}
                </td>
                <td className="p-4">
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border ${
                      r.status === 'Paid'
                        ? 'bg-emerald-950/80 text-emerald-400 border-emerald-800/60'
                        : 'bg-amber-950/80 text-amber-400 border-amber-800/60'
                    }`}
                  >
                    {r.status === 'Paid' ? (
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    ) : (
                      <Clock className="w-3.5 h-3.5" />
                    )}
                    {r.status}
                  </span>
                </td>
                <td className="p-4 text-right font-mono text-slate-400">{r.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
