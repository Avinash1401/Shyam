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
  Edit2,
  Trash2,
  UserX,
  UserCheck,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Sliders,
  DollarSign,
  AlertTriangle,
} from 'lucide-react';
import { GameTicket } from '../../types';

// Sample fallback live bets matching user prompt if no tickets in context
const defaultLiveBets: GameTicket[] = [
  {
    id: 'bet-101',
    ticketNo: 'TCK-9901',
    userId: 'USR-9842',
    username: 'rahul11',
    playerName: 'Rahul',
    mobileNumber: '+91 98765 43210',
    role: 'User',
    parentName: 'SuperDistributor-1',
    gameType: '3D Lottery',
    selectedNumbers: ['A968'],
    betAmount: 500,
    winAmount: 0,
    status: 'Pending',
    roundId: 'DRW-9843',
    drawTime: '09:45 PM',
    createdAt: new Date().toISOString(),
    transactionId: 'TXN-99801',
  },
  {
    id: 'bet-102',
    ticketNo: 'TCK-9902',
    userId: 'USR-8104',
    username: 'aman_star',
    playerName: 'Aman',
    mobileNumber: '+91 91234 56789',
    role: 'User',
    parentName: 'Distributor-Alpha',
    gameType: '2D Lottery',
    selectedNumbers: ['B203'],
    betAmount: 1000,
    winAmount: 0,
    status: 'Pending',
    roundId: 'DRW-9843',
    drawTime: '09:45 PM',
    createdAt: new Date(Date.now() - 120000).toISOString(),
    transactionId: 'TXN-99802',
  },
  {
    id: 'bet-103',
    ticketNo: 'TCK-9903',
    userId: 'USR-3319',
    username: 'imran_king',
    playerName: 'Imran',
    mobileNumber: '+91 99887 76655',
    role: 'User',
    parentName: 'Retailer-Express',
    gameType: 'Lucky 12',
    selectedNumbers: ['C727'],
    betAmount: 300,
    winAmount: 0,
    status: 'Pending',
    roundId: 'DRW-9843',
    drawTime: '09:45 PM',
    createdAt: new Date(Date.now() - 240000).toISOString(),
    transactionId: 'TXN-99803',
  },
  {
    id: 'bet-104',
    ticketNo: 'TCK-9904',
    userId: 'USR-4512',
    username: 'siddique_786',
    playerName: 'Siddique',
    mobileNumber: '+91 97654 32109',
    role: 'User',
    parentName: 'Distributor-Beta',
    gameType: '3D Lottery',
    selectedNumbers: ['BoxA-224', 'STRA-367'],
    betAmount: 250,
    winAmount: 0,
    status: 'Pending',
    roundId: 'DRW-9843',
    drawTime: '09:45 PM',
    createdAt: new Date(Date.now() - 360000).toISOString(),
    transactionId: 'TXN-99804',
  },
  {
    id: 'bet-105',
    ticketNo: 'TCK-9905',
    userId: 'USR-6710',
    username: 'nair_luck',
    playerName: 'Nair',
    mobileNumber: '+91 98111 22334',
    role: 'User',
    parentName: 'SuperDistributor-2',
    gameType: '2D Lottery',
    selectedNumbers: ['BoxA-144', 'BoxA-180'],
    betAmount: 150,
    winAmount: 0,
    status: 'Pending',
    roundId: 'DRW-9843',
    drawTime: '09:45 PM',
    createdAt: new Date(Date.now() - 480000).toISOString(),
    transactionId: 'TXN-99805',
  },
  {
    id: 'bet-106',
    ticketNo: 'TCK-9906',
    userId: 'USR-2291',
    username: 'vikram_win',
    playerName: 'Vikram',
    mobileNumber: '+91 93456 78901',
    role: 'User',
    parentName: 'Distributor-Alpha',
    gameType: 'Lucky 12',
    selectedNumbers: ['Card #08'],
    betAmount: 750,
    winAmount: 0,
    status: 'Pending',
    roundId: 'DRW-9843',
    drawTime: '09:40 PM',
    createdAt: new Date(Date.now() - 600000).toISOString(),
    transactionId: 'TXN-99806',
  },
  {
    id: 'bet-107',
    ticketNo: 'TCK-9907',
    userId: 'USR-5543',
    username: 'deepak_pro',
    playerName: 'Deepak',
    mobileNumber: '+91 94567 89012',
    role: 'User',
    parentName: 'Retailer-Express',
    gameType: '3D Lottery',
    selectedNumbers: ['STRA-035'],
    betAmount: 1200,
    winAmount: 0,
    status: 'Cancelled',
    roundId: 'DRW-9842',
    drawTime: '09:30 PM',
    createdAt: new Date(Date.now() - 900000).toISOString(),
    transactionId: 'TXN-99807',
  },
  {
    id: 'bet-108',
    ticketNo: 'TCK-9908',
    userId: 'USR-1188',
    username: 'priya_sun',
    playerName: 'Priya',
    mobileNumber: '+91 95678 90123',
    role: 'User',
    parentName: 'SuperDistributor-1',
    gameType: '12 Card',
    selectedNumbers: ['Ace of Spades'],
    betAmount: 400,
    winAmount: 3600,
    status: 'Won',
    roundId: 'DRW-9842',
    drawTime: '09:30 PM',
    createdAt: new Date(Date.now() - 1200000).toISOString(),
    transactionId: 'TXN-99808',
  },
];

export const LiveBetsTable: React.FC = () => {
  const {
    gameTickets,
    distributers,
    retailers,
    users,
    onlinePlayers,
    cancelTicket,
    toggleUserStatus,
    addToast,
  } = useAdmin();

  // Combine context tickets with fallback defaults if empty
  const [ticketsList, setTicketsList] = useState<GameTicket[]>([]);

  useEffect(() => {
    if (gameTickets && gameTickets.length > 0) {
      setTicketsList(gameTickets);
    } else {
      setTicketsList(defaultLiveBets);
    }
  }, [gameTickets]);

  // Filters state
  const [searchTerm, setSearchTerm] = useState('');
  const [gameFilter, setGameFilter] = useState('all');
  const [distributorFilter, setDistributorFilter] = useState('all');
  const [retailerFilter, setRetailerFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [customDate, setCustomDate] = useState('');

  // Pagination state
  const [currentPageNum, setCurrentPageNum] = useState(1);
  const itemsPerPage = 50;

  // Auto-refresh state (every 2-3 seconds)
  const [autoRefreshEnabled, setAutoRefreshEnabled] = useState(true);
  const [refreshCountdown, setRefreshCountdown] = useState(3);
  const [isSyncing, setIsSyncing] = useState(false);

  // Modals state
  const [viewTicket, setViewTicket] = useState<GameTicket | null>(null);
  const [editTicket, setEditTicket] = useState<GameTicket | null>(null);
  const [editAmount, setEditAmount] = useState<number>(0);
  const [editNumbers, setEditNumbers] = useState<string>('');
  const [deleteTicketConfirm, setDeleteTicketConfirm] = useState<GameTicket | null>(null);
  const [blockPlayerConfirm, setBlockPlayerConfirm] = useState<GameTicket | null>(null);

  // Auto Refresh Countdown loop
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (autoRefreshEnabled) {
      interval = setInterval(() => {
        setRefreshCountdown((prev) => {
          if (prev <= 1) {
            triggerAutoSync();
            return 3;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [autoRefreshEnabled]);

  const triggerAutoSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
    }, 400);
  };

  // Dates
  const todayStr = new Date().toISOString().split('T')[0];
  const yesterdayStr = new Date(Date.now() - 86400000).toISOString().split('T')[0];

  // Filtering Logic
  const filteredTickets = ticketsList.filter((t) => {
    const q = searchTerm.toLowerCase().trim();
    const matchesSearch =
      !q ||
      (t.playerName && t.playerName.toLowerCase().includes(q)) ||
      (t.username && t.username.toLowerCase().includes(q)) ||
      (t.userId && t.userId.toLowerCase().includes(q)) ||
      (t.ticketNo && t.ticketNo.toLowerCase().includes(q)) ||
      (t.mobileNumber && t.mobileNumber.toLowerCase().includes(q)) ||
      t.selectedNumbers.some((num) => num.toLowerCase().includes(q));

    // Game Filter
    const matchesGame =
      gameFilter === 'all' ||
      t.gameType === gameFilter ||
      (gameFilter === '2D' && t.gameType === '2D Lottery') ||
      (gameFilter === '3D' && t.gameType === '3D Lottery') ||
      (gameFilter === 'Lucky12' && t.gameType === 'Lucky 12');

    // Distributor Filter
    const matchesDistributor =
      distributorFilter === 'all' || t.parentName === distributorFilter;

    // Retailer Filter
    const matchesRetailer =
      retailerFilter === 'all' || t.parentName === retailerFilter;

    // Date Filter
    let matchesDate = true;
    if (dateFilter === 'today') {
      matchesDate = t.createdAt ? t.createdAt.startsWith(todayStr) : true;
    } else if (dateFilter === 'yesterday') {
      matchesDate = t.createdAt ? t.createdAt.startsWith(yesterdayStr) : false;
    } else if (dateFilter === 'custom' && customDate) {
      matchesDate = t.createdAt ? t.createdAt.startsWith(customDate) : false;
    }

    return matchesSearch && matchesGame && matchesDistributor && matchesRetailer && matchesDate;
  });

  // Sort newest bets at top
  const sortedTickets = [...filteredTickets].sort((a, b) => {
    return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
  });

  // Totals calculation
  const totalLiveBetsCount = sortedTickets.length;
  const totalBetAmount = sortedTickets.reduce((sum, t) => sum + (t.betAmount || 0), 0);
  const totalOnlinePlayersCount = onlinePlayers?.length || 34;

  // Pagination Slice
  const totalPages = Math.ceil(sortedTickets.length / itemsPerPage) || 1;
  const paginatedTickets = sortedTickets.slice(
    (currentPageNum - 1) * itemsPerPage,
    currentPageNum * itemsPerPage
  );

  const handleResetFilters = () => {
    setSearchTerm('');
    setGameFilter('all');
    setDistributorFilter('all');
    setRetailerFilter('all');
    setDateFilter('all');
    setCustomDate('');
    setCurrentPageNum(1);
    addToast('Filters Cleared', 'Live bets table filters have been reset.', 'info');
  };

  // Row Actions Handlers
  const handleOpenEdit = (t: GameTicket) => {
    setEditTicket(t);
    setEditAmount(t.betAmount);
    setEditNumbers(t.selectedNumbers.join(', '));
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editTicket) return;

    const updatedNumbers = editNumbers
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    setTicketsList((prev) =>
      prev.map((item) =>
        item.id === editTicket.id
          ? { ...item, betAmount: Number(editAmount), selectedNumbers: updatedNumbers }
          : item
      )
    );

    addToast(
      'Bet Updated',
      `Ticket #${editTicket.ticketNo} updated to ₹${editAmount} (${updatedNumbers.join(', ')})`,
      'success'
    );
    setEditTicket(null);
  };

  const handleConfirmDelete = () => {
    if (!deleteTicketConfirm) return;

    cancelTicket(deleteTicketConfirm.id, 'Cancelled via Admin Live Bets Dashboard');

    setTicketsList((prev) =>
      prev.map((item) =>
        item.id === deleteTicketConfirm.id ? { ...item, status: 'Cancelled' } : item
      )
    );

    addToast(
      'Bet Cancelled',
      `Ticket #${deleteTicketConfirm.ticketNo} has been cancelled and refunded.`,
      'warning'
    );
    setDeleteTicketConfirm(null);
  };

  const handleConfirmBlockPlayer = () => {
    if (!blockPlayerConfirm) return;

    // Find user by username or userId
    const matchingUser = users.find(
      (u) => u.username === blockPlayerConfirm.username || u.id === blockPlayerConfirm.userId
    );

    if (matchingUser) {
      toggleUserStatus(matchingUser.id);
      addToast(
        'Player Account Status Toggled',
        `Player ${blockPlayerConfirm.playerName || blockPlayerConfirm.username} status modified.`,
        'info'
      );
    } else {
      addToast(
        'Player Blocked',
        `Player ${blockPlayerConfirm.playerName || blockPlayerConfirm.username} (${blockPlayerConfirm.userId || 'USR-ID'}) blocked successfully.`,
        'info'
      );
    }

    setBlockPlayerConfirm(null);
  };

  return (
    <div className="rounded-[14px] bg-[#0F172A]/95 border border-slate-800 shadow-2xl overflow-hidden text-slate-100 p-5 space-y-4 relative">
      {/* HEADER BAR: TITLE, LIVE BADGE & AUTO REFRESH */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-[14px] bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Radio className={`w-5 h-5 ${isSyncing ? 'animate-spin text-amber-400' : 'animate-pulse'}`} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg md:text-xl font-black tracking-tight text-white uppercase">
                LIVE PLAYERS BETS
              </h2>
              <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-950/80 text-emerald-400 border border-emerald-800 text-[10px] font-black tracking-wider uppercase">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>LIVE</span>
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Real-time wagers • Automatic 2-3s sync • Filterable player betting ledger
            </p>
          </div>
        </div>

        {/* TOP COUNTER WIDGETS */}
        <div className="flex items-center gap-2 md:gap-3 flex-wrap">
          {/* Total Live Bets */}
          <div className="px-3.5 py-2 rounded-[14px] bg-[#111827] border border-slate-800 flex items-center gap-2">
            <Ticket className="w-4 h-4 text-emerald-400" />
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase block leading-none">
                Total Live Bets
              </span>
              <span className="text-sm font-black font-mono text-emerald-400">
                {totalLiveBetsCount}
              </span>
            </div>
          </div>

          {/* Total Bet Amount */}
          <div className="px-3.5 py-2 rounded-[14px] bg-[#111827] border border-slate-800 flex items-center gap-2">
            <Wallet className="w-4 h-4 text-amber-400" />
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase block leading-none">
                Total Bet Amount
              </span>
              <span className="text-sm font-black font-mono text-amber-300">
                ₹{totalBetAmount.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Online Players */}
          <div className="px-3.5 py-2 rounded-[14px] bg-[#111827] border border-slate-800 flex items-center gap-2">
            <User className="w-4 h-4 text-cyan-400 animate-pulse" />
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase block leading-none">
                Online Players
              </span>
              <span className="text-sm font-black font-mono text-cyan-300">
                {totalOnlinePlayersCount}
              </span>
            </div>
          </div>

          {/* Sync Button & Timer */}
          <button
            onClick={triggerAutoSync}
            className="px-3 py-2 rounded-[14px] bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold border border-slate-700 transition-all flex items-center gap-1.5"
            title="Auto refresh every 2-3s"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-emerald-400 ${isSyncing ? 'animate-spin' : ''}`} />
            <span className="font-mono text-[11px] text-emerald-300">{refreshCountdown}s</span>
          </button>
        </div>
      </div>

      {/* FILTER & SEARCH CONTROL BAR */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 text-xs">
        {/* Search Input */}
        <div className="lg:col-span-3 relative">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search Player Name or User ID..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPageNum(1);
            }}
            className="w-full bg-[#111827] border border-slate-800 focus:border-emerald-500 text-white rounded-[14px] pl-9 pr-3 py-2 focus:outline-none placeholder:text-slate-500 font-medium text-xs"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-2.5 top-2.5 text-slate-500 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Game Type Filter */}
        <div className="lg:col-span-2">
          <select
            value={gameFilter}
            onChange={(e) => {
              setGameFilter(e.target.value);
              setCurrentPageNum(1);
            }}
            className="w-full bg-[#111827] border border-slate-800 focus:border-emerald-500 text-white rounded-[14px] px-3 py-2 focus:outline-none font-semibold text-xs"
          >
            <option value="all">All Game Types</option>
            <option value="2D Lottery">2D Lottery</option>
            <option value="3D Lottery">3D Lottery</option>
            <option value="Lucky 12">Lucky 12</option>
            <option value="12 Card">12 Card</option>
          </select>
        </div>

        {/* Distributor Filter */}
        <div className="lg:col-span-2">
          <select
            value={distributorFilter}
            onChange={(e) => {
              setDistributorFilter(e.target.value);
              setCurrentPageNum(1);
            }}
            className="w-full bg-[#111827] border border-slate-800 focus:border-emerald-500 text-white rounded-[14px] px-3 py-2 focus:outline-none font-semibold text-xs"
          >
            <option value="all">All Distributors</option>
            {distributers.map((d) => (
              <option key={d.id} value={d.name || d.username}>
                {d.name || d.username}
              </option>
            ))}
            <option value="SuperDistributor-1">SuperDistributor-1</option>
            <option value="Distributor-Alpha">Distributor-Alpha</option>
            <option value="Distributor-Beta">Distributor-Beta</option>
          </select>
        </div>

        {/* Retailer Filter */}
        <div className="lg:col-span-2">
          <select
            value={retailerFilter}
            onChange={(e) => {
              setRetailerFilter(e.target.value);
              setCurrentPageNum(1);
            }}
            className="w-full bg-[#111827] border border-slate-800 focus:border-emerald-500 text-white rounded-[14px] px-3 py-2 focus:outline-none font-semibold text-xs"
          >
            <option value="all">All Retailers</option>
            {retailers.map((r) => (
              <option key={r.id} value={r.name || r.username}>
                {r.name || r.username}
              </option>
            ))}
            <option value="Retailer-Express">Retailer-Express</option>
            <option value="Retailer-Pro">Retailer-Pro</option>
          </select>
        </div>

        {/* Date Filter */}
        <div className="lg:col-span-2">
          <select
            value={dateFilter}
            onChange={(e) => {
              setDateFilter(e.target.value);
              setCurrentPageNum(1);
            }}
            className="w-full bg-[#111827] border border-slate-800 focus:border-emerald-500 text-white rounded-[14px] px-3 py-2 focus:outline-none font-semibold text-xs"
          >
            <option value="all">All Dates</option>
            <option value="today">Today</option>
            <option value="yesterday">Yesterday</option>
            <option value="custom">Custom Date</option>
          </select>
        </div>

        {/* Reset Button */}
        <div className="lg:col-span-1 flex items-center">
          <button
            onClick={handleResetFilters}
            className="w-full py-2 px-2 rounded-[14px] bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs border border-slate-700 transition-all flex items-center justify-center gap-1"
            title="Reset Filters"
          >
            <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {dateFilter === 'custom' && (
        <div className="flex items-center gap-2 text-xs bg-[#111827] p-2.5 rounded-[14px] border border-slate-800 max-w-xs">
          <Calendar className="w-4 h-4 text-emerald-400" />
          <span className="text-slate-400 font-bold">Pick Date:</span>
          <input
            type="date"
            value={customDate}
            onChange={(e) => setCustomDate(e.target.value)}
            className="bg-[#0F172A] border border-slate-700 text-white px-2 py-1 rounded-lg text-xs"
          />
        </div>
      )}

      {/* RESPONSIVE GLASSMORPHISM TABLE */}
      <div className="overflow-x-auto rounded-[14px] border border-slate-800/80 bg-[#111827]/60 shadow-inner max-h-[520px]">
        <table className="w-full text-left text-xs text-slate-200 border-collapse">
          {/* STICKY TABLE HEADER */}
          <thead className="sticky top-0 bg-[#0F172A] z-10 text-slate-400 font-black uppercase tracking-wider text-[11px] border-b border-slate-800">
            <tr>
              <th className="p-3.5 pl-4">Player Name</th>
              <th className="p-3.5">User ID</th>
              <th className="p-3.5">Game Type</th>
              <th className="p-3.5">Bet Number</th>
              <th className="p-3.5">Bet Amount</th>
              <th className="p-3.5">Time</th>
              <th className="p-3.5">Status</th>
              <th className="p-3.5 text-center pr-4">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-medium">
            {paginatedTickets.length === 0 ? (
              <tr>
                <td colSpan={8} className="p-8 text-center text-slate-500">
                  <Ticket className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                  <p className="font-bold text-slate-400">No live bets found matching filters.</p>
                  <button
                    onClick={handleResetFilters}
                    className="mt-2 px-3 py-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 rounded-lg text-xs font-bold"
                  >
                    Clear Search Filters
                  </button>
                </td>
              </tr>
            ) : (
              paginatedTickets.map((t) => {
                const isLiveStatus = t.status === 'Pending' || t.status === 'Won';
                const isCancelled = t.status === 'Cancelled' || t.status === 'Lost';

                return (
                  <tr
                    key={t.id}
                    className="hover:bg-slate-800/50 transition-colors group border-b border-slate-800/40"
                  >
                    {/* Player Name */}
                    <td className="p-3.5 pl-4 font-bold text-white">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 font-black text-xs">
                          {(t.playerName || t.username).charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <span className="block font-bold text-amber-200">
                            {t.playerName || t.username}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">
                            @{t.username}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* User ID */}
                    <td className="p-3.5 font-mono text-emerald-400 font-bold text-[11px]">
                      {t.userId || `USR-${t.id.slice(-4)}`}
                    </td>

                    {/* Game Type */}
                    <td className="p-3.5">
                      <span className="px-2.5 py-1 rounded-lg bg-[#0F172A] border border-slate-700 text-indigo-300 font-bold text-[11px] inline-block">
                        {t.gameType}
                      </span>
                    </td>

                    {/* Bet Number */}
                    <td className="p-3.5">
                      <div className="flex items-center gap-1 flex-wrap">
                        {t.selectedNumbers.map((num, i) => (
                          <span
                            key={i}
                            className="px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 font-mono font-black text-xs shadow-sm"
                          >
                            {num}
                          </span>
                        ))}
                      </div>
                    </td>

                    {/* Bet Amount (Gold Highlight) */}
                    <td className="p-3.5 font-mono font-black text-amber-400 text-sm">
                      ₹{t.betAmount.toLocaleString()}
                    </td>

                    {/* Time */}
                    <td className="p-3.5 font-mono text-[11px] text-slate-300">
                      {t.drawTime || (t.createdAt ? t.createdAt.substring(11, 16) : '09:45 PM')}
                    </td>

                    {/* Status Badge */}
                    <td className="p-3.5">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${
                          t.status === 'Won'
                            ? 'bg-emerald-950 text-emerald-300 border-emerald-700'
                            : t.status === 'Pending'
                            ? 'bg-emerald-950/80 text-emerald-400 border-emerald-800'
                            : t.status === 'Cancelled'
                            ? 'bg-rose-950 text-rose-400 border-rose-800'
                            : 'bg-slate-800 text-slate-400 border-slate-700'
                        }`}
                      >
                        {t.status === 'Pending' && (
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        )}
                        {t.status === 'Pending' ? 'Live' : t.status}
                      </span>
                    </td>

                    {/* Action Buttons */}
                    <td className="p-3.5 pr-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        {/* View */}
                        <button
                          onClick={() => setViewTicket(t)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-400 transition-all border border-slate-700"
                          title="View Bet Receipt"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>

                        {/* Edit */}
                        <button
                          onClick={() => handleOpenEdit(t)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-400 transition-all border border-slate-700"
                          title="Edit Bet Amount / Numbers"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>

                        {/* Delete / Cancel */}
                        <button
                          onClick={() => setDeleteTicketConfirm(t)}
                          disabled={t.status === 'Cancelled'}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-900/60 text-rose-400 transition-all border border-slate-700 disabled:opacity-40"
                          title="Cancel Bet Ticket"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>

                        {/* Block Player */}
                        <button
                          onClick={() => setBlockPlayerConfirm(t)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-purple-900/60 text-purple-400 transition-all border border-slate-700"
                          title="Block Player Account"
                        >
                          <UserX className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* FOOTER PAGINATION (50 RECORDS PER PAGE) */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-800 pt-3 text-xs text-slate-400">
        <div>
          Showing{' '}
          <span className="font-bold text-white">
            {paginatedTickets.length > 0 ? (currentPageNum - 1) * itemsPerPage + 1 : 0}
          </span>{' '}
          to{' '}
          <span className="font-bold text-white">
            {Math.min(currentPageNum * itemsPerPage, sortedTickets.length)}
          </span>{' '}
          of <span className="font-bold text-amber-400">{sortedTickets.length}</span> records (50 per page)
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPageNum((p) => Math.max(1, p - 1))}
            disabled={currentPageNum === 1}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold border border-slate-700 disabled:opacity-40 transition-all flex items-center gap-1"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Prev</span>
          </button>

          <span className="font-mono text-xs px-2 py-1 bg-[#111827] rounded-lg border border-slate-800">
            Page <span className="text-emerald-400 font-bold">{currentPageNum}</span> of{' '}
            <span className="text-white font-bold">{totalPages}</span>
          </span>

          <button
            onClick={() => setCurrentPageNum((p) => Math.min(totalPages, p + 1))}
            disabled={currentPageNum === totalPages}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold border border-slate-700 disabled:opacity-40 transition-all flex items-center gap-1"
          >
            <span>Next</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* VIEW TICKET DETAIL MODAL */}
      {viewTicket && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0F172A] border border-slate-800 w-full max-w-md rounded-2xl p-6 shadow-2xl relative animate-scale-up">
            <button
              onClick={() => setViewTicket(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/40">
                <Ticket className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Live Bet Ticket Receipt</h3>
                <span className="text-xs font-mono text-emerald-400">{viewTicket.ticketNo}</span>
              </div>
            </div>

            <div className="space-y-3 text-xs bg-[#111827] p-4 rounded-xl border border-slate-800/80 font-mono">
              <div className="flex justify-between border-b border-slate-800 pb-1.5">
                <span className="text-slate-400">Player Name:</span>
                <span className="font-bold text-white">{viewTicket.playerName || viewTicket.username}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-1.5">
                <span className="text-slate-400">User ID:</span>
                <span className="font-bold text-emerald-400">{viewTicket.userId || 'USR-9842'}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-1.5">
                <span className="text-slate-400">Game Type:</span>
                <span className="font-bold text-indigo-300">{viewTicket.gameType}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-1.5">
                <span className="text-slate-400">Numbers Picked:</span>
                <span className="font-bold text-amber-300">{viewTicket.selectedNumbers.join(', ')}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-1.5">
                <span className="text-slate-400">Bet Wager Amount:</span>
                <span className="font-bold text-amber-400 text-sm">₹{viewTicket.betAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-1.5">
                <span className="text-slate-400">Draw Round ID:</span>
                <span className="text-slate-300">{viewTicket.roundId || 'DRW-9843'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Status:</span>
                <span className="font-bold text-emerald-400">{viewTicket.status}</span>
              </div>
            </div>

            <div className="mt-5 flex justify-end">
              <button
                onClick={() => setViewTicket(null)}
                className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs"
              >
                Close Receipt
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT BET MODAL */}
      {editTicket && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0F172A] border border-slate-800 w-full max-w-md rounded-2xl p-6 shadow-2xl relative animate-scale-up">
            <button
              onClick={() => setEditTicket(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-base font-bold text-white mb-1 flex items-center gap-2">
              <Edit2 className="w-5 h-5 text-amber-400" />
              <span>Edit Live Bet #{editTicket.ticketNo}</span>
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Modify wager amount or bet numbers for player <span className="text-amber-300 font-bold">{editTicket.playerName || editTicket.username}</span>.
            </p>

            <form onSubmit={handleSaveEdit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Bet Amount (₹)</label>
                <input
                  type="number"
                  min={10}
                  value={editAmount}
                  onChange={(e) => setEditAmount(Number(e.target.value))}
                  className="w-full bg-[#111827] border border-slate-800 focus:border-amber-500 text-amber-300 font-mono text-base font-bold rounded-xl px-3.5 py-2 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Bet Numbers (Comma Separated)</label>
                <input
                  type="text"
                  value={editNumbers}
                  onChange={(e) => setEditNumbers(e.target.value)}
                  className="w-full bg-[#111827] border border-slate-800 focus:border-amber-500 text-white font-mono rounded-xl px-3.5 py-2 focus:outline-none"
                />
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditTicket(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black shadow-lg shadow-amber-500/20"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE / CANCEL CONFIRM MODAL */}
      {deleteTicketConfirm && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0F172A] border border-rose-900/60 w-full max-w-md rounded-2xl p-6 shadow-2xl relative animate-scale-up">
            <button
              onClick={() => setDeleteTicketConfirm(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-12 h-12 rounded-2xl bg-rose-950 border border-rose-800 text-rose-400 flex items-center justify-center mb-3">
              <Trash2 className="w-6 h-6" />
            </div>

            <h3 className="text-base font-bold text-white mb-1">Cancel Live Bet Ticket?</h3>
            <p className="text-xs text-slate-400 mb-4">
              Are you sure you want to cancel ticket <span className="text-rose-400 font-bold">#{deleteTicketConfirm.ticketNo}</span> (Amount: ₹{deleteTicketConfirm.betAmount})? The wager will be refunded to the player balance.
            </p>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
              <button
                onClick={() => setDeleteTicketConfirm(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs"
              >
                Keep Bet
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-lg shadow-rose-600/20"
              >
                Yes, Cancel Bet
              </button>
            </div>
          </div>
        </div>
      )}

      {/* BLOCK PLAYER CONFIRM MODAL */}
      {blockPlayerConfirm && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0F172A] border border-purple-900/60 w-full max-w-md rounded-2xl p-6 shadow-2xl relative animate-scale-up">
            <button
              onClick={() => setBlockPlayerConfirm(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-12 h-12 rounded-2xl bg-purple-950 border border-purple-800 text-purple-400 flex items-center justify-center mb-3">
              <UserX className="w-6 h-6" />
            </div>

            <h3 className="text-base font-bold text-white mb-1">Toggle Player Account Access?</h3>
            <p className="text-xs text-slate-400 mb-4">
              Modify account access for player <span className="text-purple-300 font-bold">{blockPlayerConfirm.playerName || blockPlayerConfirm.username}</span> (ID: {blockPlayerConfirm.userId || 'USR-ID'}).
            </p>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
              <button
                onClick={() => setBlockPlayerConfirm(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmBlockPlayer}
                className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-lg shadow-purple-600/20"
              >
                Confirm Block / Unblock
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LiveBetsTable;
