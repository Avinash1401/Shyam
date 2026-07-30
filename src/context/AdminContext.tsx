import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  UserAccount,
  OnlinePlayer,
  GameTicket,
  WinPercentageConfig,
  LiveResultDraw,
  TransactionRecord,
  ActivityLog,
  NavigationPage,
  UserRole,
  GameControlConfig,
} from '../types';
import {
  initialSuperDistributers,
  initialDistributers,
  initialRetailers,
  initialUsers,
  initialOnlinePlayers,
  initialGameTickets,
  initialWinPercentages,
  initialLiveResults,
  initialTransactions,
  initialActivityLogs,
} from '../data/mockData';

export interface ToastMessage {
  id: string;
  title: string;
  description: string;
  type: 'success' | 'error' | 'info' | 'warning';
}

const initialGameControls: GameControlConfig[] = [
  {
    gameType: '2D Lottery',
    status: 'Active',
    bettingLocked: false,
    roundDurationSeconds: 120,
    minBet: 10,
    maxBet: 10000,
    payoutPercentage: 90,
    mode: 'Auto',
    currentRoundNo: 'DRW-2D-9845',
    secondsRemaining: 88,
  },
  {
    gameType: '3D Lottery',
    status: 'Active',
    bettingLocked: false,
    roundDurationSeconds: 180,
    minBet: 20,
    maxBet: 5000,
    payoutPercentage: 85,
    mode: 'Auto',
    currentRoundNo: 'DRW-3D-4122',
    secondsRemaining: 145,
  },
  {
    gameType: 'Lucky 12',
    status: 'Active',
    bettingLocked: false,
    roundDurationSeconds: 60,
    minBet: 10,
    maxBet: 20000,
    payoutPercentage: 88,
    mode: 'Manual',
    currentRoundNo: 'DRW-L12-7020',
    secondsRemaining: 24,
  },
  {
    gameType: '12 Card',
    status: 'Active',
    bettingLocked: false,
    roundDurationSeconds: 90,
    minBet: 10,
    maxBet: 15000,
    payoutPercentage: 86,
    mode: 'Auto',
    currentRoundNo: 'DRW-12C-3310',
    secondsRemaining: 52,
  },
];

interface AdminContextType {
  currentPage: NavigationPage;
  setCurrentPage: (page: NavigationPage) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;

  // Accounts Data
  superDistributers: UserAccount[];
  distributers: UserAccount[];
  retailers: UserAccount[];
  users: UserAccount[];

  // Game & Activity
  onlinePlayers: OnlinePlayer[];
  gameTickets: GameTicket[];
  winPercentages: WinPercentageConfig[];
  liveResults: LiveResultDraw[];
  transactions: TransactionRecord[];
  activityLogs: ActivityLog[];
  gameControls: GameControlConfig[];

  // Toast
  toasts: ToastMessage[];
  addToast: (title: string, description: string, type?: 'success' | 'error' | 'info' | 'warning') => void;
  removeToast: (id: string) => void;

  // Real-Time Metrics
  liveBetIn: number;
  liveBetOut: number;
  todayProfitLoss: number;
  systemWalletBalance: number;

  // Account Actions
  addUserAccount: (account: Omit<UserAccount, 'id' | 'createdAt'>) => void;
  updateUserAccount: (id: string, updates: Partial<UserAccount>) => void;
  adjustPoints: (username: string, amount: number, type: 'Credit' | 'Debit', remark: string) => boolean;
  toggleUserStatus: (id: string) => void;

  // Game & Result Controls
  declareWinningResult: (gameType: '2D Lottery' | '3D Lottery' | 'Lucky 12' | '12 Card', drawNum: string, result: string, adminId?: string) => void;
  placeBet: (username: string, gameType: '2D Lottery' | '3D Lottery' | 'Lucky 12' | '12 Card', selectedNumbers: string[], amount: number) => boolean;
  cancelTicket: (ticketId: string, reason: string) => boolean;
  updateWinPercentage: (gameType: string, rtp: number, margin: number, mode: 'Auto' | 'Manual' | 'High Margin') => void;
  kickOnlinePlayer: (id: string) => void;
  clearOldLogs: (type: 'logs' | 'tickets' | 'transactions') => void;

  // Admin Game Control Actions
  toggleGameStatus: (gameType: string) => void;
  toggleBettingLock: (gameType: string) => void;
  toggleResultMode: (gameType: string) => void;
  updateGameControl: (gameType: string, updates: Partial<GameControlConfig>) => void;
  verifyAdminPin: (pin: string) => boolean;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentPage, setCurrentPage] = useState<NavigationPage>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');

  const [superDistributers, setSuperDistributers] = useState<UserAccount[]>(() => {
    const saved = localStorage.getItem('shyam_super_distributers');
    return saved ? JSON.parse(saved) : initialSuperDistributers;
  });

  const [distributers, setDistributers] = useState<UserAccount[]>(() => {
    const saved = localStorage.getItem('shyam_distributers');
    return saved ? JSON.parse(saved) : initialDistributers;
  });

  const [retailers, setRetailers] = useState<UserAccount[]>(() => {
    const saved = localStorage.getItem('shyam_retailers');
    return saved ? JSON.parse(saved) : initialRetailers;
  });

  const [users, setUsers] = useState<UserAccount[]>(() => {
    const saved = localStorage.getItem('shyam_users');
    return saved ? JSON.parse(saved) : initialUsers;
  });

  const [onlinePlayers, setOnlinePlayers] = useState<OnlinePlayer[]>(initialOnlinePlayers);
  const [gameTickets, setGameTickets] = useState<GameTicket[]>(initialGameTickets);
  const [winPercentages, setWinPercentages] = useState<WinPercentageConfig[]>(initialWinPercentages);
  const [liveResults, setLiveResults] = useState<LiveResultDraw[]>(initialLiveResults);
  const [transactions, setTransactions] = useState<TransactionRecord[]>(initialTransactions);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>(initialActivityLogs);
  const [gameControls, setGameControls] = useState<GameControlConfig[]>(initialGameControls);

  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('shyam_super_distributers', JSON.stringify(superDistributers));
  }, [superDistributers]);

  useEffect(() => {
    localStorage.setItem('shyam_distributers', JSON.stringify(distributers));
  }, [distributers]);

  useEffect(() => {
    localStorage.setItem('shyam_retailers', JSON.stringify(retailers));
  }, [retailers]);

  useEffect(() => {
    localStorage.setItem('shyam_users', JSON.stringify(users));
  }, [users]);

  // Real-Time Metrics Calculations
  const liveBetIn = gameTickets
    .filter((t) => t.status === 'Pending')
    .reduce((sum, t) => sum + t.betAmount, 0);

  const liveBetOut = gameTickets
    .filter((t) => t.status === 'Won')
    .reduce((sum, t) => sum + t.winAmount, 0);

  const totalBetsAll = gameTickets.reduce((sum, t) => sum + t.betAmount, 0);
  const totalPayoutAll = gameTickets.reduce((sum, t) => sum + (t.status === 'Won' ? t.winAmount : 0), 0);
  const todayProfitLoss = totalBetsAll - totalPayoutAll;

  const systemWalletBalance =
    superDistributers.reduce((s, a) => s + a.points, 0) +
    distributers.reduce((s, a) => s + a.points, 0) +
    retailers.reduce((s, a) => s + a.points, 0) +
    users.reduce((s, a) => s + a.points, 0);

  // Security Admin PIN verification
  const verifyAdminPin = (pin: string): boolean => {
    return pin === '1234' || pin === '9999';
  };

  const addToast = (
    title: string,
    description: string,
    type: 'success' | 'error' | 'info' | 'warning' = 'success'
  ) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, title, description, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Automated Result Generator Helper for Auto Mode
  const generateRandomResult = (gameType: string): string => {
    if (gameType === '2D Lottery') {
      const num = Math.floor(Math.random() * 100);
      return num.toString().padStart(2, '0');
    } else if (gameType === '3D Lottery') {
      const num = Math.floor(Math.random() * 1000);
      return num.toString().padStart(3, '0');
    } else if (gameType === 'Lucky 12') {
      const luckyCards = [
        'Card #01 (Golden Crown)',
        'Card #02 (Lucky Seven)',
        'Card #03 (Royal Diamond)',
        'Card #04 (Mystic Star)',
        'Card #05 (Golden Horseshoe)',
        'Card #06 (Dragon Fortune)',
        'Card #07 (Golden Lotus)',
        'Card #08 (Royal Eagle)',
        'Card #09 (Fire Phoenix)',
        'Card #10 (Jade Lion)',
        'Card #11 (Ace of Spades)',
        'Card #12 (Sun God)',
      ];
      return luckyCards[Math.floor(Math.random() * luckyCards.length)];
    } else {
      return `Card #${Math.floor(1 + Math.random() * 12)}`;
    }
  };

  // Live Timer Loop & Auto Result Dispatcher
  useEffect(() => {
    const interval = setInterval(() => {
      setGameControls((prevControls) =>
        prevControls.map((gc) => {
          if (gc.status !== 'Active') return gc;

          if (gc.secondsRemaining <= 1) {
            // Round ended
            addToast(
              `Betting Closed (${gc.gameType})`,
              `Round ${gc.currentRoundNo} timer ended. Processing round draw...`,
              'warning'
            );

            if (gc.mode === 'Auto') {
              const result = generateRandomResult(gc.gameType);
              setTimeout(() => {
                declareWinningResult(gc.gameType, gc.currentRoundNo, result, 'SYSTEM_AUTO_ENGINE');
              }, 500);

              const nextRoundNum = `DRW-${gc.gameType.substring(0, 2).toUpperCase()}-${Math.floor(
                1000 + Math.random() * 9000
              )}`;

              return {
                ...gc,
                currentRoundNo: nextRoundNum,
                secondsRemaining: gc.roundDurationSeconds,
                bettingLocked: false,
              };
            } else {
              // Manual Mode - Lock betting until result declared
              return {
                ...gc,
                secondsRemaining: 0,
                bettingLocked: true,
              };
            }
          }

          return {
            ...gc,
            secondsRemaining: gc.secondsRemaining - 1,
          };
        })
      );
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  // Find account across state lists
  const findAccountList = (role: UserRole) => {
    switch (role) {
      case 'SuperDistributer':
        return { list: superDistributers, setList: setSuperDistributers };
      case 'Distributer':
        return { list: distributers, setList: setDistributers };
      case 'Retailer':
        return { list: retailers, setList: setRetailers };
      case 'User':
      default:
        return { list: users, setList: setUsers };
    }
  };

  const addUserAccount = (accountData: Omit<UserAccount, 'id' | 'createdAt'>) => {
    const newId = `${accountData.role.substring(0, 3).toLowerCase()}-${Date.now().toString().slice(-4)}`;
    const newAccount: UserAccount = {
      ...accountData,
      id: newId,
      createdAt: new Date().toISOString().split('T')[0],
      lastLogin: 'Never',
    };

    const { list, setList } = findAccountList(accountData.role);
    setList([...list, newAccount]);

    // Add activity log
    const newLog: ActivityLog = {
      id: `log-${Date.now()}`,
      username: 'superadmin',
      role: 'SuperAdmin',
      action: `Created new ${accountData.role}: ${accountData.username} (${accountData.name})`,
      ip: '103.110.244.18',
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      level: 'info',
    };
    setActivityLogs((prev) => [newLog, ...prev]);

    addToast('Account Created', `${accountData.role} "${accountData.username}" created successfully.`);
  };

  const updateUserAccount = (id: string, updates: Partial<UserAccount>) => {
    const updateInList = (list: UserAccount[], setList: React.Dispatch<React.SetStateAction<UserAccount[]>>) => {
      setList((prev) => prev.map((item) => (item.id === id ? { ...item, ...updates } : item)));
    };

    updateInList(superDistributers, setSuperDistributers);
    updateInList(distributers, setDistributers);
    updateInList(retailers, setRetailers);
    updateInList(users, setUsers);

    addToast('Account Updated', 'Account details saved.');
  };

  const adjustPoints = (username: string, amount: number, type: 'Credit' | 'Debit', remark: string): boolean => {
    if (amount <= 0) {
      addToast('Invalid Amount', 'Please enter a valid positive number.', 'error');
      return false;
    }

    let foundRole: UserRole | null = null;
    let currentBalance = 0;

    const allLists = [
      { list: superDistributers, setList: setSuperDistributers },
      { list: distributers, setList: setDistributers },
      { list: retailers, setList: setRetailers },
      { list: users, setList: setUsers },
    ];

    let updated = false;

    allLists.forEach(({ list, setList }) => {
      const match = list.find((a) => a.username === username);
      if (match) {
        foundRole = match.role;
        currentBalance = match.points;

        if (type === 'Debit' && currentBalance < amount) {
          addToast('Insufficient Points', `User ${username} only has ${currentBalance} points.`, 'error');
          updated = false;
          return;
        }

        const newBalance = type === 'Credit' ? currentBalance + amount : currentBalance - amount;

        setList((prev) =>
          prev.map((a) => (a.username === username ? { ...a, points: newBalance } : a))
        );
        updated = true;

        // Add Transaction Record
        const newTxn: TransactionRecord = {
          id: `txn-${Date.now()}`,
          refId: `REF-${Math.floor(100000 + Math.random() * 900000)}`,
          fromUser: 'superadmin',
          toUser: username,
          type,
          amount,
          balanceAfter: newBalance,
          remark: remark || `Point ${type} by Admin`,
          timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
        };
        setTransactions((prev) => [newTxn, ...prev]);

        // Add Activity Log
        const newLog: ActivityLog = {
          id: `log-${Date.now()}`,
          username: 'superadmin',
          role: 'SuperAdmin',
          action: `${type}ed ${amount.toLocaleString()} points to ${username} (${foundRole}). Balance: ${newBalance.toLocaleString()}`,
          ip: '103.110.244.18',
          timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
          level: 'info',
        };
        setActivityLogs((prev) => [newLog, ...prev]);

        addToast(
          'Points Updated',
          `Successfully ${type === 'Credit' ? 'added' : 'deducted'} ${amount.toLocaleString()} points for ${username}.`
        );
      }
    });

    return updated;
  };

  const toggleUserStatus = (id: string) => {
    const toggleInList = (list: UserAccount[], setList: React.Dispatch<React.SetStateAction<UserAccount[]>>) => {
      setList((prev) =>
        prev.map((item) => {
          if (item.id === id) {
            const newStatus = item.status === 'active' ? 'suspended' : 'active';
            addToast('Status Changed', `User ${item.username} is now ${newStatus.toUpperCase()}`, newStatus === 'suspended' ? 'warning' : 'success');
            return { ...item, status: newStatus };
          }
          return item;
        })
      );
    };

    toggleInList(superDistributers, setSuperDistributers);
    toggleInList(distributers, setDistributers);
    toggleInList(retailers, setRetailers);
    toggleInList(users, setUsers);
  };

  const declareWinningResult = (
    gameType: '2D Lottery' | '3D Lottery' | 'Lucky 12' | '12 Card',
    drawNum: string,
    result: string,
    adminId: string = 'superadmin'
  ) => {
    const newDraw: LiveResultDraw = {
      id: `lr-${Date.now()}`,
      gameType,
      drawNumber: drawNum || `DRW-${gameType.substring(0, 2).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`,
      winningResult: result,
      drawTime: new Date().toISOString().replace('T', ' ').substring(0, 16),
      totalBets: Math.floor(20000 + Math.random() * 50000),
      totalPayout: Math.floor(15000 + Math.random() * 35000),
      status: 'Declared',
    };

    setLiveResults((prev) => [newDraw, ...prev]);

    // Resolve Pending Tickets for this game type
    const multiplier = gameType === '2D Lottery' ? 90 : gameType === '3D Lottery' ? 900 : 10;

    setGameTickets((prev) =>
      prev.map((ticket) => {
        if (ticket.gameType === gameType && ticket.status === 'Pending') {
          const isWinner = ticket.selectedNumbers.some(
            (num) => num.trim().toLowerCase() === result.trim().toLowerCase() || result.includes(num.trim())
          );

          if (isWinner) {
            const winVal = ticket.betAmount * multiplier;
            // Credit winner user wallet
            setUsers((prevUsers) =>
              prevUsers.map((u) => (u.username === ticket.username ? { ...u, points: u.points + winVal } : u))
            );
            return { ...ticket, status: 'Won', winAmount: winVal };
          } else {
            return { ...ticket, status: 'Lost', winAmount: 0 };
          }
        }
        return ticket;
      })
    );

    // Audit Logging
    const newLog: ActivityLog = {
      id: `log-${Date.now()}`,
      username: adminId,
      role: 'SuperAdmin',
      action: `Declared Winning Result [${result}] for ${gameType} (${newDraw.drawNumber}) | Admin ID: ${adminId}`,
      ip: '103.110.244.18',
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      level: 'warning',
    };
    setActivityLogs((prev) => [newLog, ...prev]);

    // Reset game control timer if in manual mode
    setGameControls((prev) =>
      prev.map((gc) =>
        gc.gameType === gameType
          ? {
              ...gc,
              secondsRemaining: gc.roundDurationSeconds,
              bettingLocked: false,
              currentRoundNo: `DRW-${gameType.substring(0, 2).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`,
            }
          : gc
      )
    );

    addToast(
      'Result Declared & Payouts Distributed!',
      `Official Result "${result}" declared for ${gameType} (${newDraw.drawNumber}) by ${adminId}.`
    );
  };

  const cancelTicket = (ticketId: string, reason: string): boolean => {
    const tkt = gameTickets.find((t) => t.id === ticketId || t.ticketNo === ticketId);
    if (!tkt) {
      addToast('Ticket Not Found', 'Could not locate ticket ID.', 'error');
      return false;
    }

    if (tkt.status === 'Cancelled') {
      addToast('Already Cancelled', 'This ticket has already been cancelled.', 'info');
      return false;
    }

    // Refund player
    adjustPoints(tkt.username, tkt.betAmount, 'Credit', `Refund for Cancelled Ticket #${tkt.ticketNo}: ${reason}`);

    // Update Ticket status
    setGameTickets((prev) =>
      prev.map((t) => (t.id === tkt.id ? { ...t, status: 'Cancelled' } : t))
    );

    addToast('Ticket Cancelled', `Ticket #${tkt.ticketNo} cancelled. Refunded ${tkt.betAmount} points.`);
    return true;
  };

  const updateWinPercentage = (
    gameType: string,
    rtp: number,
    margin: number,
    mode: 'Auto' | 'Manual' | 'High Margin'
  ) => {
    setWinPercentages((prev) =>
      prev.map((item) =>
        item.gameType === gameType
          ? {
              ...item,
              rtpPercentage: rtp,
              targetHouseMargin: margin,
              mode,
              updatedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
            }
          : item
      )
    );

    addToast('Settings Saved', `Win Percentage rules updated for ${gameType}`);
  };

  const kickOnlinePlayer = (id: string) => {
    const player = onlinePlayers.find((p) => p.id === id);
    setOnlinePlayers((prev) => prev.filter((p) => p.id !== id));
    if (player) {
      addToast('Player Disconnected', `Forced disconnection for ${player.username}`, 'warning');
    }
  };

  const toggleGameStatus = (gameType: string) => {
    setGameControls((prev) =>
      prev.map((gc) => {
        if (gc.gameType === gameType) {
          const nextStatus = gc.status === 'Active' ? 'Stopped' : 'Active';
          addToast('Game Status Changed', `${gameType} is now ${nextStatus}`, nextStatus === 'Active' ? 'success' : 'warning');
          return { ...gc, status: nextStatus };
        }
        return gc;
      })
    );
  };

  const toggleBettingLock = (gameType: string) => {
    setGameControls((prev) =>
      prev.map((gc) => {
        if (gc.gameType === gameType) {
          const nextLocked = !gc.bettingLocked;
          addToast('Betting Lock Updated', `Betting on ${gameType} is now ${nextLocked ? 'LOCKED 🔒' : 'UNLOCKED 🔓'}`, nextLocked ? 'warning' : 'success');
          return { ...gc, bettingLocked: nextLocked };
        }
        return gc;
      })
    );
  };

  const toggleResultMode = (gameType: string) => {
    setGameControls((prev) =>
      prev.map((gc) => {
        if (gc.gameType === gameType) {
          const nextMode = gc.mode === 'Auto' ? 'Manual' : 'Auto';
          addToast('Result Control Mode Changed', `${gameType} switched to ${nextMode} Result Mode`, 'info');
          return { ...gc, mode: nextMode };
        }
        return gc;
      })
    );
  };

  const updateGameControl = (gameType: string, updates: Partial<GameControlConfig>) => {
    setGameControls((prev) =>
      prev.map((gc) => (gc.gameType === gameType ? { ...gc, ...updates } : gc))
    );
    addToast('Admin Control Saved', `Updated parameters for ${gameType}`);
  };

  const placeBet = (
    username: string,
    gameType: '2D Lottery' | '3D Lottery' | 'Lucky 12' | '12 Card',
    selectedNumbers: string[],
    amount: number
  ): boolean => {
    const gc = gameControls.find((c) => c.gameType === gameType);
    if (gc) {
      if (gc.status === 'Stopped') {
        addToast('Game Stopped', `${gameType} is currently stopped by Admin.`, 'error');
        return false;
      }
      if (gc.bettingLocked) {
        addToast('Betting Closed', `Betting is locked for ${gameType} right now.`, 'warning');
        return false;
      }
      if (amount < gc.minBet) {
        addToast('Below Min Bet', `Minimum bet for ${gameType} is ₹${gc.minBet}`, 'error');
        return false;
      }
      if (amount > gc.maxBet) {
        addToast('Exceeds Max Bet', `Maximum bet limit for ${gameType} is ₹${gc.maxBet}`, 'error');
        return false;
      }
    }

    if (amount <= 0) {
      addToast('Invalid Bet', 'Bet amount must be greater than zero.', 'error');
      return false;
    }

    if (selectedNumbers.length === 0) {
      addToast('No Selection', 'Please select at least one number or symbol.', 'error');
      return false;
    }

    // Find real user
    const user = users.find((u) => u.username === username) || users[0];
    if (!user) {
      addToast('User Error', 'Active registered user account not found.', 'error');
      return false;
    }

    if (user.status !== 'active') {
      addToast('Account Suspended', `User ${user.username} is ${user.status}. Cannot place bet.`, 'error');
      return false;
    }

    if (user.points < amount) {
      addToast('Insufficient Balance', `Wallet balance is ₹${user.points.toLocaleString()}. Needed: ₹${amount.toLocaleString()}.`, 'error');
      return false;
    }

    // Deduct points
    setUsers((prev) =>
      prev.map((u) => (u.username === user.username ? { ...u, points: u.points - amount } : u))
    );

    // Create ticket
    const ticketNo = `SHM-${Date.now().toString().slice(-6)}`;
    const newTicket: GameTicket = {
      id: `tkt-${Date.now()}`,
      ticketNo,
      username: user.username,
      role: user.role,
      parentName: user.parentName || 'ret_luck1',
      gameType,
      selectedNumbers,
      betAmount: amount,
      winAmount: 0,
      status: 'Pending',
      drawTime: gc ? `${gc.secondsRemaining}s` : 'In 2 mins',
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
    };

    setGameTickets((prev) => [newTicket, ...prev]);

    // Transaction
    const newTxn: TransactionRecord = {
      id: `txn-${Date.now()}`,
      refId: `REF-${Math.floor(100000 + Math.random() * 900000)}`,
      fromUser: user.username,
      toUser: 'System Wallet',
      type: 'Debit',
      amount,
      balanceAfter: user.points - amount,
      remark: `Bet placed on ${gameType} (Ticket #${ticketNo})`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
    };
    setTransactions((prev) => [newTxn, ...prev]);

    // Update player online status
    setOnlinePlayers((prev) =>
      prev.map((p) =>
        p.username === user.username
          ? { ...p, currentBet: p.currentBet + amount, status: 'In Game' }
          : p
      )
    );

    addToast('Ticket Confirmed!', `Ticket #${ticketNo} placed for ₹${amount.toLocaleString()}`);
    return true;
  };

  const clearOldLogs = (type: 'logs' | 'tickets' | 'transactions') => {
    if (type === 'logs') {
      setActivityLogs([]);
      addToast('Logs Cleared', 'System activity audit logs purged.', 'info');
    } else if (type === 'tickets') {
      setGameTickets((prev) => prev.filter((t) => t.status === 'Pending'));
      addToast('Old Tickets Cleared', 'Completed ticket archives purged.', 'info');
    } else if (type === 'transactions') {
      setTransactions([]);
      addToast('Ledger Cleared', 'Historical ledger records purged.', 'info');
    }
  };

  return (
    <AdminContext.Provider
      value={{
        currentPage,
        setCurrentPage,
        sidebarOpen,
        setSidebarOpen,
        toggleSidebar,
        searchTerm,
        setSearchTerm,
        superDistributers,
        distributers,
        retailers,
        users,
        onlinePlayers,
        gameTickets,
        winPercentages,
        liveResults,
        transactions,
        activityLogs,
        gameControls,
        toasts,
        addToast,
        removeToast,
        liveBetIn,
        liveBetOut,
        todayProfitLoss,
        systemWalletBalance,
        addUserAccount,
        updateUserAccount,
        adjustPoints,
        toggleUserStatus,
        declareWinningResult,
        placeBet,
        cancelTicket,
        updateWinPercentage,
        kickOnlinePlayer,
        clearOldLogs,
        toggleGameStatus,
        toggleBettingLock,
        toggleResultMode,
        updateGameControl,
        verifyAdminPin,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};
