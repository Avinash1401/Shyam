import React, { useState } from 'react';
import { useAdmin } from '../../context/AdminContext';
import {
  Layers,
  ShieldAlert,
  Trash2,
  Ticket,
  Search,
  Filter,
  AlertTriangle,
  RefreshCw,
  Coins,
  CheckCircle2,
} from 'lucide-react';

interface OthersActivityViewProps {
  section: 'transactions' | 'logs' | 'delete' | 'cancel_tickets';
}

export const OthersActivityView: React.FC<OthersActivityViewProps> = ({ section }) => {
  const { transactions, activityLogs, gameTickets, cancelTicket, clearOldLogs, addToast } = useAdmin();

  // Search filter
  const [search, setSearch] = useState('');

  // Cancel Ticket form state
  const [ticketSearchInput, setTicketSearchInput] = useState('');
  const [cancelReason, setCancelReason] = useState('Player request before draw');

  // Delete Data confirmation modal state
  const [deleteModalType, setDeleteModalType] = useState<'logs' | 'tickets' | 'transactions' | null>(
    null
  );

  // Filtered Transactions
  const filteredTxns = transactions.filter(
    (t) =>
      t.refId.toLowerCase().includes(search.toLowerCase()) ||
      t.fromUser.toLowerCase().includes(search.toLowerCase()) ||
      t.toUser.toLowerCase().includes(search.toLowerCase()) ||
      t.remark.toLowerCase().includes(search.toLowerCase())
  );

  // Filtered Logs
  const filteredLogs = activityLogs.filter(
    (l) =>
      l.username.toLowerCase().includes(search.toLowerCase()) ||
      l.action.toLowerCase().includes(search.toLowerCase()) ||
      l.ip.includes(search)
  );

  // Handle Cancel Ticket
  const handleCancelTicketSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketSearchInput) return;
    cancelTicket(ticketSearchInput, cancelReason);
    setTicketSearchInput('');
  };

  const handleConfirmClear = () => {
    if (deleteModalType) {
      clearOldLogs(deleteModalType);
      setDeleteModalType(null);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* SECTION 1: TRANSACTION HISTORY */}
      {section === 'transactions' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-900 border border-slate-800">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-2xl bg-cyan-950/80 border border-cyan-800/60 text-cyan-400">
                <Layers className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white flex items-center gap-2">
                  <span>Transaction Ledger History</span>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800 font-bold">
                    {transactions.length} Records
                  </span>
                </h1>
                <p className="text-xs text-slate-400 mt-0.5">
                  Complete financial audit trail of point transfers, payouts, credits, and debits.
                </p>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search transactions by reference, user, remark..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 text-slate-200 text-xs rounded-xl pl-9 pr-4 py-2 focus:outline-none"
              />
            </div>
          </div>

          <div className="overflow-x-auto rounded-2xl bg-slate-900 border border-slate-800 shadow-xl">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/80 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-800">
                <tr>
                  <th className="p-4">Ref ID</th>
                  <th className="p-4">Sender / From</th>
                  <th className="p-4">Recipient / To</th>
                  <th className="p-4">Type</th>
                  <th className="p-4">Amount</th>
                  <th className="p-4">Balance After</th>
                  <th className="p-4">Remark</th>
                  <th className="p-4 text-right">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-medium">
                {filteredTxns.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="p-4 font-mono font-bold text-cyan-400">{t.refId}</td>
                    <td className="p-4 font-bold text-white">{t.fromUser}</td>
                    <td className="p-4 font-bold text-slate-200">{t.toUser}</td>
                    <td className="p-4">
                      <span className="px-2.5 py-1 rounded-full bg-slate-950 text-indigo-300 border border-indigo-800/50 font-bold">
                        {t.type}
                      </span>
                    </td>
                    <td className="p-4 font-extrabold text-emerald-400">
                      ₹{t.amount.toLocaleString()}
                    </td>
                    <td className="p-4 font-bold text-slate-300">
                      ₹{t.balanceAfter.toLocaleString()}
                    </td>
                    <td className="p-4 text-slate-400">{t.remark}</td>
                    <td className="p-4 text-right font-mono text-slate-500">{t.timestamp}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SECTION 2: LOGS */}
      {section === 'logs' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-900 border border-slate-800">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-2xl bg-amber-950/80 border border-amber-800/60 text-amber-400">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white flex items-center gap-2">
                  <span>System Activity Logs</span>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-950 text-amber-400 border border-amber-800 font-bold">
                    {activityLogs.length} Security Entries
                  </span>
                </h1>
                <p className="text-xs text-slate-400 mt-0.5">
                  Audit log of admin actions, point transfers, result declarations, and security alerts.
                </p>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search activity logs..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 text-slate-200 text-xs rounded-xl pl-9 pr-4 py-2 focus:outline-none"
              />
            </div>
          </div>

          <div className="overflow-x-auto rounded-2xl bg-slate-900 border border-slate-800 shadow-xl">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/80 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-800">
                <tr>
                  <th className="p-4">User / Role</th>
                  <th className="p-4">Action Detail</th>
                  <th className="p-4">IP Address</th>
                  <th className="p-4">Severity</th>
                  <th className="p-4 text-right">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-medium">
                {filteredLogs.map((l) => (
                  <tr key={l.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="p-4 font-bold text-white">
                      {l.username}
                      <span className="text-[10px] text-slate-500 font-normal block">{l.role}</span>
                    </td>
                    <td className="p-4 text-slate-200">{l.action}</td>
                    <td className="p-4 font-mono text-slate-400">{l.ip}</td>
                    <td className="p-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                          l.level === 'danger'
                            ? 'bg-rose-950 text-rose-400 border-rose-800'
                            : l.level === 'warning'
                            ? 'bg-amber-950 text-amber-400 border-amber-800'
                            : 'bg-cyan-950 text-cyan-400 border-cyan-800'
                        }`}
                      >
                        {l.level.toUpperCase()}
                      </span>
                    </td>
                    <td className="p-4 text-right font-mono text-slate-500">{l.timestamp}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SECTION 3: DELETE DATA MAINTENANCE */}
      {section === 'delete' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-900 border border-slate-800">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-2xl bg-rose-950/80 border border-rose-800/60 text-rose-400">
                <Trash2 className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white flex items-center gap-2">
                  <span>Database Maintenance & Data Purging</span>
                </h1>
                <p className="text-xs text-slate-400 mt-0.5">
                  Purge archived game ticket records, system activity logs, or ledger transaction logs.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-amber-400" />
                <span>Purge Security Activity Logs</span>
              </h3>
              <p className="text-xs text-slate-400">
                Clears all stored security activity audit logs.
              </p>
              <button
                onClick={() => setDeleteModalType('logs')}
                className="w-full py-2.5 rounded-xl bg-rose-950/80 hover:bg-rose-900 text-rose-300 font-bold text-xs border border-rose-800/80 transition-colors"
              >
                Clear All Logs
              </button>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Ticket className="w-5 h-5 text-purple-400" />
                <span>Purge Archived Tickets</span>
              </h3>
              <p className="text-xs text-slate-400">
                Deletes processed won/lost ticket history (keeps active pending tickets).
              </p>
              <button
                onClick={() => setDeleteModalType('tickets')}
                className="w-full py-2.5 rounded-xl bg-rose-950/80 hover:bg-rose-900 text-rose-300 font-bold text-xs border border-rose-800/80 transition-colors"
              >
                Clear Old Tickets
              </button>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Layers className="w-5 h-5 text-cyan-400" />
                <span>Purge Transaction History</span>
              </h3>
              <p className="text-xs text-slate-400">
                Purges old point allocation transaction entries.
              </p>
              <button
                onClick={() => setDeleteModalType('transactions')}
                className="w-full py-2.5 rounded-xl bg-rose-950/80 hover:bg-rose-900 text-rose-300 font-bold text-xs border border-rose-800/80 transition-colors"
              >
                Clear Transactions
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 4: CANCEL TICKETS */}
      {section === 'cancel_tickets' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-900 border border-slate-800">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-2xl bg-purple-950/80 border border-purple-800/60 text-purple-400">
                <Ticket className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white flex items-center gap-2">
                  <span>Cancel Ticket & Point Refund Tool</span>
                </h1>
                <p className="text-xs text-slate-400 mt-0.5">
                  Search active game tickets, verify details, and issue immediate point refunds to player accounts.
                </p>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 max-w-xl mx-auto space-y-4">
            <h3 className="text-base font-bold text-white">Find Ticket to Cancel</h3>

            <form onSubmit={handleCancelTicketSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Ticket Number or Ticket ID
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. SHM-20260730-8803"
                  value={ticketSearchInput}
                  onChange={(e) => setTicketSearchInput(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 text-white rounded-xl px-3 py-2.5 font-mono text-xs focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Cancellation Reason</label>
                <input
                  type="text"
                  required
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 text-white rounded-xl px-3 py-2.5 focus:outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-red-700 hover:from-rose-500 hover:to-red-600 text-white font-bold text-xs shadow-lg shadow-rose-500/20"
                >
                  Cancel Ticket & Process Refund
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Safeguard Modal */}
      {deleteModalType && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-2xl p-6 shadow-2xl relative animate-slide-in">
            <div className="w-12 h-12 rounded-2xl bg-rose-950 border border-rose-800 text-rose-400 flex items-center justify-center mb-4">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <h3 className="text-lg font-bold text-white mb-1">Confirm Data Purging</h3>
            <p className="text-xs text-slate-400 mb-5">
              Are you sure you want to purge <span className="text-rose-400 font-bold">{deleteModalType.toUpperCase()}</span>? This operation cannot be undone.
            </p>

            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setDeleteModalType(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmClear}
                className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-lg shadow-rose-500/20"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
