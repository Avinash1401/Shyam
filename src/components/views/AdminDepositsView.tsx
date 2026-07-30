import React, { useState } from 'react';
import { useAdmin } from '../../context/AdminContext';
import {
  ArrowDownRight,
  ArrowUpRight,
  CheckCircle2,
  XCircle,
  Clock,
  Search,
  Filter,
  ShieldCheck,
  Building,
  QrCode,
  AlertCircle,
} from 'lucide-react';

export const AdminDepositsView: React.FC = () => {
  const {
    depositRequests,
    withdrawalRequests,
    approveDepositRequest,
    rejectDepositRequest,
    approveWithdrawalRequest,
    rejectWithdrawalRequest,
  } = useAdmin();

  const [activeTab, setActiveTab] = useState<'deposits' | 'withdrawals'>('deposits');
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const filteredDeposits = depositRequests.filter((d) => {
    const matchesStatus = filterStatus === 'All' || d.status === filterStatus;
    const matchesSearch =
      d.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.utrNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.id.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const filteredWithdrawals = withdrawalRequests.filter((w) => {
    const matchesStatus = filterStatus === 'All' || w.status === filterStatus;
    const matchesSearch =
      w.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      w.accountDetails.toLowerCase().includes(searchTerm.toLowerCase()) ||
      w.id.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6 animate-slide-in pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-5 rounded-3xl shadow-xl">
        <div>
          <h1 className="text-xl font-black text-white flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-cyan-400" />
            <span>Deposit & Withdrawal Request Management</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">Review, approve, or reject player wallet requests in real-time.</p>
        </div>

        {/* Tab Selector */}
        <div className="flex bg-slate-950 p-1.5 rounded-2xl border border-slate-800 text-xs font-bold">
          <button
            onClick={() => setActiveTab('deposits')}
            className={`px-4 py-2 rounded-xl flex items-center gap-2 transition-all ${
              activeTab === 'deposits'
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <ArrowDownRight className="w-4 h-4" />
            <span>Deposits ({depositRequests.filter((d) => d.status === 'Pending').length})</span>
          </button>

          <button
            onClick={() => setActiveTab('withdrawals')}
            className={`px-4 py-2 rounded-xl flex items-center gap-2 transition-all ${
              activeTab === 'withdrawals'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <ArrowUpRight className="w-4 h-4" />
            <span>Withdrawals ({withdrawalRequests.filter((w) => w.status === 'Pending').length})</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by username, UTR number, or Request ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
          />
        </div>

        <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-2xl px-3 py-1 text-xs font-bold text-slate-300">
          <Filter className="w-4 h-4 text-slate-500" />
          <span>Status:</span>
          {['All', 'Pending', 'Approved', 'Rejected'].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-2.5 py-1 rounded-xl transition-all ${
                filterStatus === st
                  ? 'bg-cyan-500 text-slate-950 font-black'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* TAB 1: DEPOSITS TABLE */}
      {activeTab === 'deposits' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <ArrowDownRight className="w-4 h-4 text-emerald-400" />
            <span>Player Deposit Verification Queue</span>
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="p-3">Req ID</th>
                  <th className="p-3">User</th>
                  <th className="p-3">Amount</th>
                  <th className="p-3">Method</th>
                  <th className="p-3">UTR Reference</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Submitted</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {filteredDeposits.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="p-6 text-center text-slate-500">
                      No deposit requests matching criteria.
                    </td>
                  </tr>
                ) : (
                  filteredDeposits.map((d) => (
                    <tr key={d.id} className="hover:bg-slate-800/40">
                      <td className="p-3 font-mono font-bold text-white">{d.id}</td>
                      <td className="p-3 font-bold text-cyan-400">@{d.username}</td>
                      <td className="p-3 font-mono text-emerald-400 font-bold">₹{d.amount.toLocaleString()}</td>
                      <td className="p-3 text-slate-300">{d.paymentMethod}</td>
                      <td className="p-3 font-mono text-amber-300 font-bold">{d.utrNumber}</td>
                      <td className="p-3">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                            d.status === 'Approved'
                              ? 'bg-emerald-950 text-emerald-400 border-emerald-800'
                              : d.status === 'Rejected'
                              ? 'bg-rose-950 text-rose-400 border-rose-800'
                              : 'bg-amber-950 text-amber-400 border-amber-800 animate-pulse'
                          }`}
                        >
                          {d.status}
                        </span>
                      </td>
                      <td className="p-3 text-slate-500 font-mono text-[11px]">{d.createdAt}</td>
                      <td className="p-3 text-right">
                        {d.status === 'Pending' && (
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => approveDepositRequest(d.id)}
                              className="px-3 py-1 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-[11px] flex items-center gap-1 shadow"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Approve</span>
                            </button>
                            <button
                              onClick={() => rejectDepositRequest(d.id)}
                              className="px-3 py-1 rounded-xl bg-rose-950 hover:bg-rose-900 border border-rose-800 text-rose-300 font-bold text-[11px] flex items-center gap-1"
                            >
                              <XCircle className="w-3.5 h-3.5" />
                              <span>Reject</span>
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: WITHDRAWALS TABLE */}
      {activeTab === 'withdrawals' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <ArrowUpRight className="w-4 h-4 text-amber-400" />
            <span>Player Payout Verification Queue</span>
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="p-3">Req ID</th>
                  <th className="p-3">User</th>
                  <th className="p-3">Amount</th>
                  <th className="p-3">Method</th>
                  <th className="p-3">Payout Account Details</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Submitted</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {filteredWithdrawals.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="p-6 text-center text-slate-500">
                      No withdrawal requests matching criteria.
                    </td>
                  </tr>
                ) : (
                  filteredWithdrawals.map((w) => (
                    <tr key={w.id} className="hover:bg-slate-800/40">
                      <td className="p-3 font-mono font-bold text-white">{w.id}</td>
                      <td className="p-3 font-bold text-cyan-400">@{w.username}</td>
                      <td className="p-3 font-mono text-amber-400 font-bold">₹{w.amount.toLocaleString()}</td>
                      <td className="p-3 text-slate-300">{w.paymentMethod}</td>
                      <td className="p-3 text-slate-300">{w.accountDetails}</td>
                      <td className="p-3">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                            w.status === 'Approved'
                              ? 'bg-emerald-950 text-emerald-400 border-emerald-800'
                              : w.status === 'Rejected'
                              ? 'bg-rose-950 text-rose-400 border-rose-800'
                              : 'bg-amber-950 text-amber-400 border-amber-800 animate-pulse'
                          }`}
                        >
                          {w.status}
                        </span>
                      </td>
                      <td className="p-3 text-slate-500 font-mono text-[11px]">{w.createdAt}</td>
                      <td className="p-3 text-right">
                        {w.status === 'Pending' && (
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => approveWithdrawalRequest(w.id)}
                              className="px-3 py-1 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-[11px] flex items-center gap-1 shadow"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Approve Payout</span>
                            </button>
                            <button
                              onClick={() => rejectWithdrawalRequest(w.id)}
                              className="px-3 py-1 rounded-xl bg-rose-950 hover:bg-rose-900 border border-rose-800 text-rose-300 font-bold text-[11px] flex items-center gap-1"
                            >
                              <XCircle className="w-3.5 h-3.5" />
                              <span>Reject</span>
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
