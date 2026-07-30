import React, { useState } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { History, Search, Ticket, Filter, X, RefreshCw, CheckCircle2, AlertCircle } from 'lucide-react';
import { GameTicket } from '../../types';

export const GameHistoryView: React.FC = () => {
  const { gameTickets } = useAdmin();
  const [search, setSearch] = useState('');
  const [gameFilter, setGameFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedTicket, setSelectedTicket] = useState<GameTicket | null>(null);

  const filteredTickets = gameTickets.filter((t) => {
    const matchesSearch =
      t.ticketNo.toLowerCase().includes(search.toLowerCase()) ||
      t.username.toLowerCase().includes(search.toLowerCase()) ||
      t.parentName.toLowerCase().includes(search.toLowerCase());

    const matchesGame = gameFilter === 'all' || t.gameType === gameFilter;
    const matchesStatus = statusFilter === 'all' || t.status === statusFilter;

    return matchesSearch && matchesGame && matchesStatus;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-900 border border-slate-800">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-cyan-950/80 border border-cyan-800/60 text-cyan-400">
            <History className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white flex items-center gap-2">
              <span>Game Ticket History</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800 font-bold">
                {gameTickets.length} Logs
              </span>
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Comprehensive ticket ledger across 2D, 3D, Lucky 12, and 12 Card games.
            </p>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 rounded-xl bg-slate-900/80 border border-slate-800">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by ticket no, username, agency..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 text-slate-200 text-xs rounded-xl pl-9 pr-4 py-2 focus:outline-none focus:ring-1 focus:ring-cyan-500/50"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto flex-wrap">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-medium">Game:</span>
            <select
              value={gameFilter}
              onChange={(e) => setGameFilter(e.target.value)}
              className="bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-cyan-500"
            >
              <option value="all">All Games</option>
              <option value="2D Lottery">2D Lottery</option>
              <option value="3D Lottery">3D Lottery</option>
              <option value="Lucky 12">Lucky 12</option>
              <option value="12 Card">12 Card</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-medium">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-cyan-500"
            >
              <option value="all">All Statuses</option>
              <option value="Won">Won</option>
              <option value="Lost">Lost</option>
              <option value="Pending">Pending</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tickets Table */}
      <div className="overflow-x-auto rounded-2xl bg-slate-900 border border-slate-800 shadow-xl">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-950/80 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-800">
            <tr>
              <th className="p-4">Ticket Number</th>
              <th className="p-4">Player / Agency</th>
              <th className="p-4">Game Type</th>
              <th className="p-4">Selected Digits</th>
              <th className="p-4">Bet Wager</th>
              <th className="p-4">Win Payout</th>
              <th className="p-4">Draw Date/Time</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-medium">
            {filteredTickets.length === 0 ? (
              <tr>
                <td colSpan={9} className="p-8 text-center text-slate-500">
                  No ticket records found.
                </td>
              </tr>
            ) : (
              filteredTickets.map((ticket) => (
                <tr key={ticket.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-4 font-mono font-bold text-white flex items-center gap-2">
                    <Ticket className="w-4 h-4 text-cyan-400" />
                    <span>{ticket.ticketNo}</span>
                  </td>

                  <td className="p-4">
                    <div className="font-bold text-slate-200">{ticket.username}</div>
                    <div className="text-[10px] text-slate-500">Agency: {ticket.parentName}</div>
                  </td>

                  <td className="p-4">
                    <span className="px-2.5 py-1 rounded-full bg-slate-950 text-indigo-300 border border-indigo-800/50 font-bold">
                      {ticket.gameType}
                    </span>
                  </td>

                  <td className="p-4">
                    <div className="flex gap-1 flex-wrap">
                      {ticket.selectedNumbers.map((num, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded-md bg-slate-950 border border-slate-800 text-cyan-300 font-mono font-bold text-[11px]"
                        >
                          {num}
                        </span>
                      ))}
                    </div>
                  </td>

                  <td className="p-4 font-bold text-slate-200">
                    ₹{ticket.betAmount.toLocaleString()}
                  </td>

                  <td className="p-4">
                    <span className={`font-extrabold ${ticket.winAmount > 0 ? 'text-emerald-400' : 'text-slate-500'}`}>
                      ₹{ticket.winAmount.toLocaleString()}
                    </span>
                  </td>

                  <td className="p-4 text-slate-400 font-mono text-[11px]">
                    {ticket.drawTime}
                  </td>

                  <td className="p-4">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border ${
                        ticket.status === 'Won'
                          ? 'bg-emerald-950/80 text-emerald-400 border-emerald-800/60'
                          : ticket.status === 'Lost'
                          ? 'bg-slate-950 text-slate-400 border-slate-800'
                          : ticket.status === 'Pending'
                          ? 'bg-amber-950/80 text-amber-400 border-amber-800/60 animate-pulse'
                          : 'bg-rose-950/80 text-rose-400 border-rose-800/60'
                      }`}
                    >
                      {ticket.status}
                    </span>
                  </td>

                  <td className="p-4 text-right">
                    <button
                      onClick={() => setSelectedTicket(ticket)}
                      className="px-3 py-1 rounded-lg bg-slate-950 hover:bg-slate-800 text-slate-300 font-semibold border border-slate-800"
                    >
                      Inspect
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Inspect Ticket Modal */}
      {selectedTicket && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-2xl p-6 shadow-2xl relative animate-slide-in">
            <button
              onClick={() => setSelectedTicket(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
              <Ticket className="w-5 h-5 text-cyan-400" />
              <span>Ticket Inspection</span>
            </h3>
            <p className="text-xs text-slate-400 mb-4 font-mono">{selectedTicket.ticketNo}</p>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-400">Player:</span>
                  <span className="text-white font-bold">{selectedTicket.username}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Retailer Agency:</span>
                  <span className="text-slate-200">{selectedTicket.parentName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Game Type:</span>
                  <span className="text-cyan-400 font-bold">{selectedTicket.gameType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Draw Schedule:</span>
                  <span className="text-slate-300 font-mono">{selectedTicket.drawTime}</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-400 block mb-2 font-semibold">Selected Digits / Cards:</span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedTicket.selectedNumbers.map((num, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 rounded-lg bg-cyan-950 border border-cyan-800 text-cyan-300 font-mono font-bold"
                    >
                      {num}
                    </span>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-slate-500 text-[10px] uppercase font-bold block">
                    Bet Wager
                  </span>
                  <span className="text-sm font-extrabold text-white">
                    ₹{selectedTicket.betAmount.toLocaleString()}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-slate-500 text-[10px] uppercase font-bold block">
                    Win Payout
                  </span>
                  <span className="text-sm font-extrabold text-emerald-400">
                    ₹{selectedTicket.winAmount.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-4 mt-2 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setSelectedTicket(null)}
                className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
