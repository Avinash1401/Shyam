import React, { useState, useEffect } from 'react';
import { useAdmin } from '../../context/AdminContext';
import {
  Radio,
  Search,
  Filter,
  RefreshCw,
  Ticket,
  User,
  Clock,
  CheckCircle2,
  AlertCircle,
  X,
  Wallet,
  Calendar,
  Layers,
  ArrowUpRight,
  Sparkles,
  Zap,
  Phone,
  Hash,
  Shield,
  Eye,
} from 'lucide-react';
import { GameTicket } from '../../types';

export const LiveBetsDashboardView: React.FC = () => {
  const { gameTickets, users, cancelTicket, declareWinningResult, addToast } = useAdmin();

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [userFilter, setUserFilter] = useState('all');
  const [gameFilter, setGameFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all'); // all, today, yesterday, custom
  const [customDate, setCustomDate] = useState('');
  const [roundFilter, setRoundFilter] = useState('');

  // Auto-Refresh
  const [autoRefreshEnabled, setAutoRefreshEnabled] = useState(true);
  const [refreshCountdown, setRefreshCountdown] = useState(4); // 4-second auto pulse
  const [lastUpdatedTime, setLastUpdatedTime] = useState<string>(
    new Date().toLocaleTimeString()
  );
  const [isRefreshingPulse, setIsRefreshingPulse] = useState(false);

  // Detail Modal
  const [selectedTicket, setSelectedTicket] = useState<GameTicket | null>(null);

  // Auto-refresh timer loop (every 3-5s pulse)
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (autoRefreshEnabled) {
      timer = setInterval(() => {
        setRefreshCountdown((prev) => {
          if (prev <= 1) {
            triggerManualPulse();
            return 4;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [autoRefreshEnabled]);

  const triggerManualPulse = () => {
    setIsRefreshingPulse(true);
    setLastUpdatedTime(new Date().toLocaleTimeString());
    setTimeout(() => {
      setIsRefreshingPulse(false);
    }, 600);
  };

  // Date Helper Functions
  const todayStr = new Date().toISOString().split('T')[0];
  const yesterdayStr = new Date(Date.now() - 86400000).toISOString().split('T')[0];

  // Filtering Logic
  const filteredTickets = gameTickets.filter((t) => {
    // Search matching: Player Name, Username, Phone, User ID, Ticket No, Txn ID, Bet Numbers
    const query = searchTerm.toLowerCase().trim();
    const matchesSearch =
      !query ||
      (t.playerName && t.playerName.toLowerCase().includes(query)) ||
      (t.username && t.username.toLowerCase().includes(query)) ||
      (t.mobileNumber && t.mobileNumber.toLowerCase().includes(query)) ||
      (t.userId && t.userId.toLowerCase().includes(query)) ||
      (t.ticketNo && t.ticketNo.toLowerCase().includes(query)) ||
      (t.transactionId && t.transactionId.toLowerCase().includes(query)) ||
      t.selectedNumbers.some((num) => num.toLowerCase().includes(query));

    // User Filter
    const matchesUser = userFilter === 'all' || t.username === userFilter;

    // Game Filter
    const matchesGame = gameFilter === 'all' || t.gameType === gameFilter;

    // Status Filter
    const matchesStatus = statusFilter === 'all' || t.status === statusFilter;

    // Round Filter
    const matchesRound =
      !roundFilter.trim() ||
      (t.roundId && t.roundId.toLowerCase().includes(roundFilter.toLowerCase().trim()));

    // Date Filter
    let matchesDate = true;
    if (dateFilter === 'today') {
      matchesDate = t.createdAt.startsWith(todayStr);
    } else if (dateFilter === 'yesterday') {
      matchesDate = t.createdAt.startsWith(yesterdayStr);
    } else if (dateFilter === 'custom' && customDate) {
      matchesDate = t.createdAt.startsWith(customDate);
    }

    return (
      matchesSearch &&
      matchesUser &&
      matchesGame &&
      matchesStatus &&
      matchesRound &&
      matchesDate
    );
  });

  // Calculate live statistics
  const livePendingCount = gameTickets.filter((t) => t.status === 'Pending').length;
  const livePendingWager = gameTickets
    .filter((t) => t.status === 'Pending')
    .reduce((sum, t) => sum + t.betAmount, 0);

  const todayTickets = gameTickets.filter((t) => t.createdAt.startsWith(todayStr));
  const todayTotalWager = todayTickets.reduce((sum, t) => sum + t.betAmount, 0);
  const todayTotalPayout = todayTickets
    .filter((t) => t.status === 'Won')
    .reduce((sum, t) => sum + (t.winAmount || 0), 0);

  // List of unique users for dropdown filter
  const userOptions = Array.from(
    new Set(gameTickets.map((t) => t.username))
  ).filter(Boolean);

  const handleResetFilters = () => {
    setSearchTerm('');
    setUserFilter('all');
    setGameFilter('all');
    setStatusFilter('all');
    setDateFilter('all');
    setCustomDate('');
    setRoundFilter('');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-gradient-to-br from-cyan-950 to-blue-950 border border-cyan-800/60 text-cyan-400">
            <Radio className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-white">
                Live Bets Real-Time Monitor
              </h1>
              <span className="flex items-center gap-1 text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 font-bold uppercase tracking-wider animate-pulse">
                <span className="w-2 h-2 rounded-full bg-emerald-400" /> Live Sync Active
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Instant player betting feed, user wallet tracking, round IDs, and real-time ledger synchronization.
            </p>
          </div>
        </div>

        {/* Auto Refresh & Timer Controls */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 px-3 py-2 rounded-xl text-xs">
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-slate-400">Syncing in:</span>
            <span className="font-mono font-bold text-cyan-300 w-4">{refreshCountdown}s</span>
          </div>

          <button
            onClick={() => setAutoRefreshEnabled(!autoRefreshEnabled)}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition-all border ${
              autoRefreshEnabled
                ? 'bg-emerald-950/80 text-emerald-400 border-emerald-800'
                : 'bg-slate-800 text-slate-400 border-slate-700'
            }`}
          >
            Auto-Sync: {autoRefreshEnabled ? 'ON 🟢' : 'OFF ⏸️'}
          </button>

          <button
            onClick={triggerManualPulse}
            disabled={isRefreshingPulse}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs shadow-md shadow-cyan-600/20 transition-all disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshingPulse ? 'animate-spin' : ''}`} />
            <span>Sync Now</span>
          </button>
        </div>
      </div>

      {/* Real-time Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Pending Live Bets */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-cyan-950/40 border border-cyan-800/40 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span className="font-semibold">Live Pending Bets</span>
            <Ticket className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-black text-cyan-300 font-mono">
            {livePendingCount} <span className="text-xs font-normal text-slate-400">Tickets</span>
          </div>
          <div className="text-[11px] text-slate-400">
            Pending Wager: <span className="font-bold text-white">₹{livePendingWager.toLocaleString()}</span>
          </div>
        </div>

        {/* Today Total Bets */}
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span className="font-semibold">Today Total Wager</span>
            <Wallet className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-emerald-400 font-mono">
            ₹{todayTotalWager.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-400">
            Across <span className="font-bold text-white">{todayTickets.length}</span> tickets today
          </div>
        </div>

        {/* Today Payout */}
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span className="font-semibold">Today Total Payout</span>
            <Sparkles className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-black text-purple-400 font-mono">
            ₹{todayTotalPayout.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-400">
            House Profit: <span className="font-bold text-emerald-400">₹{(todayTotalWager - todayTotalPayout).toLocaleString()}</span>
          </div>
        </div>

        {/* Total Registered Players */}
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span className="font-semibold">Active Players</span>
            <User className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-amber-400 font-mono">
            {users.length} <span className="text-xs font-normal text-slate-400">Registered</span>
          </div>
          <div className="text-[11px] text-slate-400">
            Last Updated: <span className="font-mono text-slate-300">{lastUpdatedTime}</span>
          </div>
        </div>
      </div>

      {/* Comprehensive Filter Controls Bar */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 shadow-lg">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-cyan-400" /> Advanced Live Bet Filters
          </span>
          <button
            onClick={handleResetFilters}
            className="text-[11px] text-cyan-400 hover:text-cyan-300 font-bold underline"
          >
            Clear All Filters
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3 text-xs">
          {/* Main Search Input */}
          <div className="sm:col-span-2 relative">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search Name, Phone, User ID, Ticket #, Txn ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 text-white rounded-xl pl-9 pr-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-cyan-500"
            />
          </div>

          {/* User Select */}
          <div>
            <select
              value={userFilter}
              onChange={(e) => setUserFilter(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-cyan-500"
            >
              <option value="all">All Users ({userOptions.length})</option>
              {userOptions.map((u) => (
                <option key={u} value={u}>
                  {u}
                </option>
              ))}
            </select>
          </div>

          {/* Game Select */}
          <div>
            <select
              value={gameFilter}
              onChange={(e) => setGameFilter(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-cyan-500"
            >
              <option value="all">All Games</option>
              <option value="2D Lottery">2D Lottery</option>
              <option value="3D Lottery">3D Lottery</option>
              <option value="Lucky 12">Lucky 12</option>
              <option value="12 Card">12 Card</option>
            </select>
          </div>

          {/* Status Select */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-cyan-500"
            >
              <option value="all">All Statuses</option>
              <option value="Pending">Pending (Live)</option>
              <option value="Won">Won</option>
              <option value="Lost">Lost</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>

          {/* Round ID Search */}
          <div>
            <input
              type="text"
              placeholder="Round ID (e.g. 9843)"
              value={roundFilter}
              onChange={(e) => setRoundFilter(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 text-white rounded-xl px-3 py-2 text-xs focus:outline-none"
            />
          </div>
        </div>

        {/* Second Row for Date Filter */}
        <div className="flex items-center gap-3 text-xs pt-1">
          <span className="text-slate-400 font-medium">Date Filter:</span>
          <div className="flex items-center gap-1.5">
            {[
              { id: 'all', label: 'All Dates' },
              { id: 'today', label: 'Today' },
              { id: 'yesterday', label: 'Yesterday' },
              { id: 'custom', label: 'Custom Date' },
            ].map((d) => (
              <button
                key={d.id}
                type="button"
                onClick={() => setDateFilter(d.id)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all border ${
                  dateFilter === d.id
                    ? 'bg-cyan-950 text-cyan-400 border-cyan-800'
                    : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                }`}
              >
                {d.label}
              </button>
            ))}

            {dateFilter === 'custom' && (
              <input
                type="date"
                value={customDate}
                onChange={(e) => setCustomDate(e.target.value)}
                className="bg-slate-950 border border-slate-800 text-white rounded-lg px-2 py-1 text-[11px]"
              />
            )}
          </div>
        </div>
      </div>

      {/* Main Real-Time Bets Table */}
      <div className="overflow-x-auto rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-950/90 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-800">
            <tr>
              <th className="p-3.5">Player Info</th>
              <th className="p-3.5">Game & Round</th>
              <th className="p-3.5">Selected Number/Card</th>
              <th className="p-3.5">Bet Amount</th>
              <th className="p-3.5">Wallet Balance</th>
              <th className="p-3.5">Status & Win</th>
              <th className="p-3.5">Date & Time</th>
              <th className="p-3.5">Transaction ID</th>
              <th className="p-3.5 text-right">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-800/60 font-medium">
            {filteredTickets.length === 0 ? (
              <tr>
                <td colSpan={9} className="p-10 text-center text-slate-500">
                  <div className="space-y-2">
                    <Ticket className="w-8 h-8 text-slate-600 mx-auto" />
                    <p className="text-sm font-semibold">No live bets matching selected criteria.</p>
                    <p className="text-xs text-slate-600">
                      When players place bets in the Player Game Portal, they will instantly appear here.
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              filteredTickets.map((t) => (
                <tr key={t.id} className="hover:bg-slate-800/40 transition-colors">
                  {/* Player Info */}
                  <td className="p-3.5">
                    <div className="space-y-0.5">
                      <div className="font-bold text-white flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-cyan-400" />
                        <span>{t.playerName || t.username}</span>
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono flex items-center gap-1">
                        <Phone className="w-3 h-3 text-emerald-400" />
                        <span>{t.mobileNumber || 'N/A'}</span>
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono">
                        User ID: <span className="text-slate-400">{t.userId || t.username}</span>
                      </div>
                    </div>
                  </td>

                  {/* Game & Round */}
                  <td className="p-3.5">
                    <div className="space-y-1">
                      <span className="inline-block px-2.5 py-0.5 rounded-full bg-indigo-950/80 text-indigo-300 border border-indigo-800/60 font-bold text-[11px]">
                        {t.gameType}
                      </span>
                      <div className="text-[11px] text-slate-400 font-mono flex items-center gap-1">
                        <Hash className="w-3 h-3 text-amber-400" />
                        <span>Round: <strong className="text-amber-300">{t.roundId || 'ROUND-9843'}</strong></span>
                      </div>
                    </div>
                  </td>

                  {/* Selected Numbers/Cards */}
                  <td className="p-3.5 max-w-[200px]">
                    <div className="flex gap-1 flex-wrap">
                      {t.selectedNumbers && t.selectedNumbers.length > 0 ? (
                        t.selectedNumbers.map((num, i) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 rounded-md bg-slate-950 border border-slate-800 text-cyan-300 font-mono font-bold text-xs"
                          >
                            {num}
                          </span>
                        ))
                      ) : (
                        <span className="text-slate-500 text-[11px]">N/A</span>
                      )}
                    </div>
                  </td>

                  {/* Bet Amount */}
                  <td className="p-3.5">
                    <span className="text-sm font-black font-mono text-cyan-400">
                      ₹{t.betAmount.toLocaleString()}
                    </span>
                  </td>

                  {/* Current Wallet Balance */}
                  <td className="p-3.5">
                    <div className="flex items-center gap-1 font-mono font-bold text-slate-200">
                      <Wallet className="w-3.5 h-3.5 text-emerald-400" />
                      <span>₹{(t.currentWalletBalance ?? 4500).toLocaleString()}</span>
                    </div>
                  </td>

                  {/* Status & Win Amount */}
                  <td className="p-3.5">
                    <div className="space-y-1">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wider ${
                          t.status === 'Won'
                            ? 'bg-emerald-950 text-emerald-400 border-emerald-800'
                            : t.status === 'Lost'
                            ? 'bg-rose-950 text-rose-400 border-rose-800'
                            : t.status === 'Cancelled'
                            ? 'bg-slate-950 text-slate-400 border-slate-800'
                            : 'bg-amber-950 text-amber-400 border-amber-800 animate-pulse'
                        }`}
                      >
                        {t.status === 'Won' ? (
                          <CheckCircle2 className="w-3 h-3" />
                        ) : (
                          <AlertCircle className="w-3 h-3" />
                        )}
                        <span>{t.status}</span>
                      </span>

                      {t.status === 'Won' && (
                        <div className="text-[11px] font-bold text-emerald-400 font-mono">
                          Win: +₹{(t.winAmount || 0).toLocaleString()}
                        </div>
                      )}
                    </div>
                  </td>

                  {/* Date & Time */}
                  <td className="p-3.5 whitespace-nowrap text-[11px] text-slate-400 font-mono">
                    <div>{t.createdAt.substring(0, 10)}</div>
                    <div className="text-slate-500">{t.createdAt.substring(11, 19)}</div>
                  </td>

                  {/* Transaction ID */}
                  <td className="p-3.5 font-mono text-[11px] text-slate-300">
                    <div className="flex items-center gap-1">
                      <Shield className="w-3 h-3 text-cyan-400" />
                      <span>{t.transactionId || `txn-${t.ticketNo}`}</span>
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="p-3.5 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => setSelectedTicket(t)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-[11px] font-bold flex items-center gap-1"
                        title="View Full Bet Details"
                      >
                        <Eye className="w-3.5 h-3.5 text-cyan-400" />
                        <span className="hidden sm:inline">Inspect</span>
                      </button>

                      {t.status === 'Pending' && (
                        <button
                          onClick={() => cancelTicket(t.id, 'Cancelled by Admin from Live Bets')}
                          className="px-2 py-1 rounded-lg bg-rose-950/80 hover:bg-rose-900 text-rose-300 border border-rose-800 text-[10px] font-bold"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Ticket Inspector Modal */}
      {selectedTicket && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-lg rounded-2xl p-6 shadow-2xl relative animate-slide-in space-y-4">
            <button
              onClick={() => setSelectedTicket(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-cyan-950 border border-cyan-800 text-cyan-400">
                <Ticket className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">
                  Ticket #{selectedTicket.ticketNo}
                </h3>
                <p className="text-xs text-slate-400">
                  Live synchronized ticket ledger entry
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-500 uppercase font-bold block">
                  Player Name
                </span>
                <span className="font-bold text-white text-sm">
                  {selectedTicket.playerName || selectedTicket.username}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-500 uppercase font-bold block">
                  Mobile Number
                </span>
                <span className="font-bold text-emerald-400 font-mono text-sm">
                  {selectedTicket.mobileNumber || 'N/A'}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-500 uppercase font-bold block">
                  Username & ID
                </span>
                <span className="font-bold text-cyan-300 font-mono">
                  {selectedTicket.username} ({selectedTicket.userId || selectedTicket.username})
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-500 uppercase font-bold block">
                  Game & Round ID
                </span>
                <span className="font-bold text-indigo-300 font-mono">
                  {selectedTicket.gameType} ({selectedTicket.roundId || 'ROUND-9843'})
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-500 uppercase font-bold block">
                  Bet Wager
                </span>
                <span className="font-extrabold text-cyan-400 text-base font-mono">
                  ₹{selectedTicket.betAmount.toLocaleString()}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-500 uppercase font-bold block">
                  Wallet Balance
                </span>
                <span className="font-bold text-emerald-400 text-base font-mono">
                  ₹{(selectedTicket.currentWalletBalance ?? 4500).toLocaleString()}
                </span>
              </div>

              <div className="col-span-2 p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-500 uppercase font-bold block">
                  Selected Number / Cards
                </span>
                <div className="flex gap-1.5 flex-wrap pt-1">
                  {selectedTicket.selectedNumbers.map((num, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-lg bg-cyan-950 border border-cyan-800 text-cyan-300 font-mono font-bold text-xs"
                    >
                      {num}
                    </span>
                  ))}
                </div>
              </div>

              <div className="col-span-2 p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-500 uppercase font-bold block">
                  Transaction & Reference ID
                </span>
                <span className="font-mono text-slate-300 text-xs font-bold">
                  {selectedTicket.transactionId || `txn-${selectedTicket.ticketNo}`}
                </span>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedTicket(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs"
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
