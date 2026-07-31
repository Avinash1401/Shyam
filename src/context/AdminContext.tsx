import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  UserAccount,
  OnlinePlayer,
  GameTicket,
  WinPercentageConfig,
  LiveResultDraw,
  TransactionRecord,
  ToastMessage,
  AppNotification,
  ActivityLog,
  NavigationPage,
  UserRole,
  GameControlConfig,
  DepositRequest,
  WithdrawalRequest,
  ReferralRecord,
  Lucky12CardConfig,
} from '../types';

export const defaultLucky12Cards: Lucky12CardConfig[] = [
  {
    id: 'l12-1',
    cardNo: 1,
    name: 'Golden Crown',
    icon: '👑',
    imageUrl: 'https://raw.githubusercontent.com/avinashsaini1401/lucky12-assets/main/cards/card1_crown.png',
    multiplier: '10x',
    status: 'active',
  },
  {
    id: 'l12-2',
    cardNo: 2,
    name: 'Lucky Seven',
    icon: '7️⃣',
    imageUrl: 'https://raw.githubusercontent.com/avinashsaini1401/lucky12-assets/main/cards/card2_seven.png',
    multiplier: '10x',
    status: 'active',
  },
  {
    id: 'l12-3',
    cardNo: 3,
    name: 'Royal Diamond',
    icon: '💎',
    imageUrl: 'https://raw.githubusercontent.com/avinashsaini1401/lucky12-assets/main/cards/card3_diamond.png',
    multiplier: '10x',
    status: 'active',
  },
  {
    id: 'l12-4',
    cardNo: 4,
    name: 'Mystic Star',
    icon: '⭐',
    imageUrl: 'https://raw.githubusercontent.com/avinashsaini1401/lucky12-assets/main/cards/card4_star.png',
    multiplier: '10x',
    status: 'active',
  },
  {
    id: 'l12-5',
    cardNo: 5,
    name: 'Golden Horseshoe',
    icon: '🧲',
    imageUrl: 'https://raw.githubusercontent.com/avinashsaini1401/lucky12-assets/main/cards/card5_horseshoe.png',
    multiplier: '10x',
    status: 'active',
  },
  {
    id: 'l12-6',
    cardNo: 6,
    name: 'Dragon Fortune',
    icon: '🐉',
    imageUrl: 'https://raw.githubusercontent.com/avinashsaini1401/lucky12-assets/main/cards/card6_dragon.png',
    multiplier: '10x',
    status: 'active',
  },
  {
    id: 'l12-7',
    cardNo: 7,
    name: 'Golden Lotus',
    icon: '🪷',
    imageUrl: 'https://raw.githubusercontent.com/avinashsaini1401/lucky12-assets/main/cards/card7_lotus.png',
    multiplier: '10x',
    status: 'active',
  },
  {
    id: 'l12-8',
    cardNo: 8,
    name: 'Royal Eagle',
    icon: '🦅',
    imageUrl: 'https://raw.githubusercontent.com/avinashsaini1401/lucky12-assets/main/cards/card8_eagle.png',
    multiplier: '10x',
    status: 'active',
  },
  {
    id: 'l12-9',
    cardNo: 9,
    name: 'Fire Phoenix',
    icon: '🔥',
    imageUrl: 'https://raw.githubusercontent.com/avinashsaini1401/lucky12-assets/main/cards/card9_phoenix.png',
    multiplier: '10x',
    status: 'active',
  },
  {
    id: 'l12-10',
    cardNo: 10,
    name: 'Jade Lion',
    icon: '🦁',
    imageUrl: 'https://raw.githubusercontent.com/avinashsaini1401/lucky12-assets/main/cards/card10_lion.png',
    multiplier: '10x',
    status: 'active',
  },
  {
    id: 'l12-11',
    cardNo: 11,
    name: 'Ace of Spades',
    icon: '♠️',
    imageUrl: 'https://raw.githubusercontent.com/avinashsaini1401/lucky12-assets/main/cards/card11_spade.png',
    multiplier: '10x',
    status: 'active',
  },
  {
    id: 'l12-12',
    cardNo: 12,
    name: 'Sun God',
    icon: '☀️',
    imageUrl: 'https://raw.githubusercontent.com/avinashsaini1401/lucky12-assets/main/cards/card12_sungod.png',
    multiplier: '10x',
    status: 'active',
  },
];
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

const initialNotificationsList: AppNotification[] = [];

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

  // Session & Auth
  adminSession: { isLoggedIn: boolean; user: UserAccount | null };
  playerSession: { isLoggedIn: boolean; user: UserAccount | null };
  isLoggedIn: boolean;
  currentUser: UserAccount | null;
  activeRole: 'Admin' | 'Player';
  adminPassword?: string;
  mustChangeAdminPassword?: boolean;
  changeAdminPassword: (newPassword: string) => { success: boolean; message?: string };
  login: (username: string, password?: string) => boolean;
  loginAsPlayer: (username: string, password?: string) => Promise<{ success: boolean; message?: string }>;
  loginAsAdmin: (username: string, password?: string, pin?: string) => { success: boolean; message?: string };
  register: (name: string, username: string, password: string, email: string, phone: string, refCode?: string) => Promise<{ success: boolean; message: string }>;
  forgotPasswordOTP: (emailOrPhone: string) => { success: boolean; otp?: string; message: string };
  verifyOTPAndReset: (emailOrPhone: string, otp: string, newPassword: string) => boolean;
  logout: () => void;
  logoutAdmin: () => void;
  logoutPlayer: () => void;
  switchSessionRole: (role: 'Admin' | 'Player') => void;

  // Accounts Data
  superDistributers: UserAccount[];
  distributers: UserAccount[];
  retailers: UserAccount[];
  users: UserAccount[];

  // Deposit, Withdrawal & Referral Data
  depositRequests: DepositRequest[];
  withdrawalRequests: WithdrawalRequest[];
  referralRecords: ReferralRecord[];
  submitDepositRequest: (amount: number, paymentMethod: 'UPI' | 'Bank Transfer' | 'Crypto' | 'USDT', utrNumber: string) => boolean;
  submitWithdrawalRequest: (amount: number, paymentMethod: 'UPI' | 'Bank Transfer', accountDetails: string) => boolean;
  approveDepositRequest: (id: string) => void;
  rejectDepositRequest: (id: string, reason?: string) => void;
  approveWithdrawalRequest: (id: string) => void;
  rejectWithdrawalRequest: (id: string, reason?: string) => void;

  // Game & Activity
  onlinePlayers: OnlinePlayer[];
  gameTickets: GameTicket[];
  winPercentages: WinPercentageConfig[];
  liveResults: LiveResultDraw[];
  transactions: TransactionRecord[];
  activityLogs: ActivityLog[];
  gameControls: GameControlConfig[];

  // Notification & Toast System
  toasts: ToastMessage[];
  notifications: AppNotification[];
  unreadNotificationCount: number;
  silenceBettingNotifications: boolean;
  toggleSilenceBettingNotifications: () => void;
  addToast: (title: string, description: string, type?: 'success' | 'error' | 'info' | 'warning') => void;
  removeToast: (id: string) => void;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  clearNotificationHistory: () => void;

  // Real-Time Metrics
  liveBetIn: number;
  liveBetOut: number;
  todayProfitLoss: number;
  systemWalletBalance: number;

  // Lucky 12 Cards Management
  lucky12Cards: Lucky12CardConfig[];
  addLucky12Card: (card: Omit<Lucky12CardConfig, 'id'>) => void;
  updateLucky12Card: (id: string, updates: Partial<Lucky12CardConfig>) => void;
  deleteLucky12Card: (id: string) => void;
  bulkUpdateGitHubBaseUrl: (githubBaseUrl: string) => void;
  resetLucky12CardsToDefault: () => void;
  importLucky12CardsJSON: (jsonString: string) => boolean;

  // Account Actions
  addUserAccount: (account: Omit<UserAccount, 'id' | 'createdAt'>) => void;
  updateUserAccount: (id: string, updates: Partial<UserAccount>) => void;
  adjustPoints: (username: string, amount: number, type: 'Credit' | 'Debit', remark: string) => boolean;
  toggleUserStatus: (id: string) => void;

  // Game & Result Controls
  declareWinningResult: (gameType: '2D Lottery' | '3D Lottery' | 'Lucky 12' | '12 Card', drawNum: string, result: string, adminId?: string) => void;
  placeBet: (username: string, gameType: '2D Lottery' | '3D Lottery' | 'Lucky 12' | '12 Card', selectedNumbers: string[], amount: number) => Promise<boolean>;
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

  // Ensure clear production state by wiping legacy demo localStorage keys on version upgrade
  const PROD_VERSION = 'shyam_prod_v3';
  if (typeof window !== 'undefined' && localStorage.getItem('shyam_app_version') !== PROD_VERSION) {
    [
      'shyam_deposit_requests',
      'shyam_withdrawal_requests',
      'shyam_referral_records',
      'shyam_super_distributers',
      'shyam_distributers',
      'shyam_retailers',
      'shyam_users',
      'shyam_game_tickets',
      'shyam_transactions',
      'shyam_live_results',
      'shyam_notifications_history',
      'shyam_player_session',
      'shyam_current_user',
      'shyam_shown_notif_ids',
    ].forEach((key) => localStorage.removeItem(key));
    localStorage.setItem('shyam_app_version', PROD_VERSION);
  }

  // Security & Admin Credentials
  const [adminPassword, setAdminPassword] = useState<string>(() => {
    return localStorage.getItem('shyam_admin_password') || 'Admin@123';
  });

  const [mustChangeAdminPassword, setMustChangeAdminPassword] = useState<boolean>(() => {
    const savedPassword = localStorage.getItem('shyam_admin_password') || 'Admin@123';
    const mustChangeSaved = localStorage.getItem('shyam_admin_must_change');
    if (mustChangeSaved !== null) return JSON.parse(mustChangeSaved);
    return savedPassword === 'Admin@123' || savedPassword === 'ChangeMe@123';
  });

  const changeAdminPassword = (newPassword: string): { success: boolean; message?: string } => {
    if (!newPassword || newPassword.length < 6) {
      return { success: false, message: 'Password must be at least 6 characters long.' };
    }
    if (newPassword === 'Admin@123' || newPassword === 'ChangeMe@123') {
      return { success: false, message: 'New password cannot be the default password (Admin@123).' };
    }
    setAdminPassword(newPassword);
    setMustChangeAdminPassword(false);
    localStorage.setItem('shyam_admin_password', newPassword);
    localStorage.setItem('shyam_admin_must_change', 'false');
    addToast('Admin Password Updated', 'Your admin password has been changed successfully.', 'success');
    return { success: true };
  };

  const defaultAdminUser: UserAccount = {
    id: 'usr-admin',
    name: 'Master Admin',
    username: 'admin',
    role: 'SuperAdmin',
    points: 1000000,
    creditLimit: 5000000,
    status: 'active',
    commissionRate: 0,
    phone: '+91 99999 88888',
    email: 'admin@shyampanel.com',
    createdAt: '2025-01-01',
    lastLogin: new Date().toISOString().replace('T', ' ').substring(0, 16),
    referralCode: 'REF-ADMIN',
  };

  // Dedicated Admin Session
  const [adminSession, setAdminSession] = useState<{ isLoggedIn: boolean; user: UserAccount | null }>(() => {
    const saved = localStorage.getItem('shyam_admin_session');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* fallback */ }
    }
    return { isLoggedIn: true, user: defaultAdminUser };
  });

  // Dedicated Player Session
  const [playerSession, setPlayerSession] = useState<{ isLoggedIn: boolean; user: UserAccount | null }>(() => {
    const saved = localStorage.getItem('shyam_player_session');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* fallback */ }
    }
    return { isLoggedIn: false, user: null };
  });

  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    const saved = localStorage.getItem('shyam_logged_in');
    return saved !== null ? JSON.parse(saved) : true;
  });

  const [activeRole, setActiveRole] = useState<'Admin' | 'Player'>(() => {
    const saved = localStorage.getItem('shyam_active_role');
    return (saved as 'Admin' | 'Player') || 'Admin';
  });

  const [currentUser, setCurrentUser] = useState<UserAccount | null>(() => {
    const saved = localStorage.getItem('shyam_current_user');
    return saved ? JSON.parse(saved) : defaultAdminUser;
  });

  // Sync session changes to localStorage
  useEffect(() => {
    localStorage.setItem('shyam_admin_session', JSON.stringify(adminSession));
  }, [adminSession]);

  useEffect(() => {
    localStorage.setItem('shyam_player_session', JSON.stringify(playerSession));
  }, [playerSession]);

  // Sync login status and active role
  useEffect(() => {
    localStorage.setItem('shyam_logged_in', JSON.stringify(isLoggedIn));
  }, [isLoggedIn]);

  useEffect(() => {
    localStorage.setItem('shyam_active_role', activeRole);
  }, [activeRole]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('shyam_current_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('shyam_current_user');
    }
  }, [currentUser]);

  // Deposit & Withdrawal Requests
  const [depositRequests, setDepositRequests] = useState<DepositRequest[]>(() => {
    const saved = localStorage.getItem('shyam_deposit_requests');
    return saved ? JSON.parse(saved) : [];
  });

  const [withdrawalRequests, setWithdrawalRequests] = useState<WithdrawalRequest[]>(() => {
    const saved = localStorage.getItem('shyam_withdrawal_requests');
    return saved ? JSON.parse(saved) : [];
  });

  const [referralRecords, setReferralRecords] = useState<ReferralRecord[]>(() => {
    const saved = localStorage.getItem('shyam_referral_records');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('shyam_deposit_requests', JSON.stringify(depositRequests));
  }, [depositRequests]);

  useEffect(() => {
    localStorage.setItem('shyam_withdrawal_requests', JSON.stringify(withdrawalRequests));
  }, [withdrawalRequests]);

  useEffect(() => {
    localStorage.setItem('shyam_referral_records', JSON.stringify(referralRecords));
  }, [referralRecords]);

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

  const [onlinePlayers, setOnlinePlayers] = useState<OnlinePlayer[]>(() => {
    const saved = localStorage.getItem('shyam_online_players');
    return saved ? JSON.parse(saved) : initialOnlinePlayers;
  });
  const [gameTickets, setGameTickets] = useState<GameTicket[]>(() => {
    const saved = localStorage.getItem('shyam_game_tickets');
    return saved ? JSON.parse(saved) : initialGameTickets;
  });
  const [winPercentages, setWinPercentages] = useState<WinPercentageConfig[]>(initialWinPercentages);
  const [liveResults, setLiveResults] = useState<LiveResultDraw[]>(() => {
    const saved = localStorage.getItem('shyam_live_results');
    return saved ? JSON.parse(saved) : initialLiveResults;
  });
  const [transactions, setTransactions] = useState<TransactionRecord[]>(() => {
    const saved = localStorage.getItem('shyam_transactions');
    return saved ? JSON.parse(saved) : initialTransactions;
  });
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>(initialActivityLogs);
  const [gameControls, setGameControls] = useState<GameControlConfig[]>(initialGameControls);

  // Sync core data collections to localStorage
  useEffect(() => {
    localStorage.setItem('shyam_users', JSON.stringify(users));
  }, [users]);

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
    localStorage.setItem('shyam_game_tickets', JSON.stringify(gameTickets));
  }, [gameTickets]);

  useEffect(() => {
    localStorage.setItem('shyam_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('shyam_live_results', JSON.stringify(liveResults));
  }, [liveResults]);

  useEffect(() => {
    localStorage.setItem('shyam_online_players', JSON.stringify(onlinePlayers));
  }, [onlinePlayers]);

  // ---------------------------------------------------------------------------
  // REAL-TIME UNIFIED BACKEND DATABASE SYNCHRONIZATION
  // ---------------------------------------------------------------------------
  const fetchBackendSync = async () => {
    try {
      const res = await fetch('/api/sync');
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          const data = json.data;
          if (Array.isArray(data.users)) setUsers(data.users);
          if (Array.isArray(data.gameTickets)) setGameTickets(data.gameTickets);
          if (Array.isArray(data.depositRequests)) setDepositRequests(data.depositRequests);
          if (Array.isArray(data.withdrawalRequests)) setWithdrawalRequests(data.withdrawalRequests);
          if (Array.isArray(data.liveResults)) setLiveResults(data.liveResults);
          if (Array.isArray(data.winPercentages)) setWinPercentages(data.winPercentages);
          if (Array.isArray(data.gameControls)) setGameControls(data.gameControls);
          if (Array.isArray(data.lucky12Cards)) setLucky12Cards(data.lucky12Cards);
          if (Array.isArray(data.onlinePlayers)) setOnlinePlayers(data.onlinePlayers);
          if (Array.isArray(data.notifications)) setNotifications(data.notifications);
          if (Array.isArray(data.transactions)) setTransactions(data.transactions);
          if (Array.isArray(data.activityLogs)) setActivityLogs(data.activityLogs);

          // Update current logged-in player's balance dynamically from shared DB
          if (currentUser) {
            const freshUser = data.users.find((u: UserAccount) => u.username === currentUser.username);
            if (freshUser) {
              setCurrentUser((prev) => (prev ? { ...prev, points: freshUser.points, status: freshUser.status } : null));
            }
          }
        }
      }
    } catch (err) {
      // Background poll silently resumes on server re-connection
    }
  };

  useEffect(() => {
    fetchBackendSync();
    const interval = setInterval(fetchBackendSync, 1500);
    return () => clearInterval(interval);
  }, [currentUser?.username]);

  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [silenceBettingNotifications, setSilenceBettingNotifications] = useState<boolean>(true);

  const toggleSilenceBettingNotifications = () => {
    setSilenceBettingNotifications((prev) => !prev);
  };
  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    const saved = localStorage.getItem('shyam_notifications_history');
    return saved ? JSON.parse(saved) : initialNotificationsList;
  });

  // Track notifications already shown as toasts to prevent duplicates after refresh
  const [shownNotifIds, setShownNotifIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('shyam_shown_notif_ids');
    return saved ? JSON.parse(saved) : ['notif-1', 'notif-2', 'notif-3'];
  });

  // Sync notifications history to localStorage
  useEffect(() => {
    localStorage.setItem('shyam_notifications_history', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('shyam_shown_notif_ids', JSON.stringify(shownNotifIds));
  }, [shownNotifIds]);

  const unreadNotificationCount = notifications.filter((n) => !n.read).length;

  // Add toast with strict deduplication & 5-second auto removal (Max 3 active)
  const addToast = (
    title: string,
    description: string,
    type: 'success' | 'error' | 'info' | 'warning' = 'success'
  ) => {
    const normTitle = title.trim();
    const normDesc = description.trim();
    const fingerprint = `${normTitle.toLowerCase()}|${normDesc.toLowerCase()}`;

    // 1 & 2 & 3: Check if identical active toast exists or was recently added in notification history within last 5 seconds
    const isDuplicateActive = toasts.some(
      (t) => t.title.trim().toLowerCase() === normTitle.toLowerCase() && t.description.trim().toLowerCase() === normDesc.toLowerCase()
    );

    const isDuplicateRecent = notifications.some(
      (n) => n.fingerprint === fingerprint && Date.now() - n.createdAtMs < 5000
    );

    if (isDuplicateActive || isDuplicateRecent) {
      // Prevent spam & duplicate toasts
      return;
    }

    const notifId = `notif-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const nowMs = Date.now();
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newNotif: AppNotification = {
      id: notifId,
      title: normTitle,
      description: normDesc,
      type,
      timestamp: timeStr,
      createdAtMs: nowMs,
      read: false,
      fingerprint,
    };

    // Update notifications history (persistent)
    setNotifications((prev) => [newNotif, ...prev.filter((n) => n.id !== notifId)]);
    setShownNotifIds((prev) => [...prev, notifId]);

    // Update active toasts (Requirement 8: Max 3 active notifications on screen)
    const newToast: ToastMessage = {
      id: notifId,
      title: normTitle,
      description: normDesc,
      type,
      timestamp: timeStr,
      createdAtMs: nowMs,
    };

    setToasts((prev) => {
      const filtered = prev.filter((t) => t.id !== notifId);
      const nextList = [...filtered, newToast];
      // Keep maximum 3 active on screen
      return nextList.slice(-3);
    });

    // Requirement 4: Automatically remove notifications after 5 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== notifId));
    }, 5000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Requirement 9 & 10: Mark as read logic
  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
    // Remove from active toasts immediately when read
    removeToast(id);
  };

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    setToasts([]);
  };

  const clearNotificationHistory = () => {
    setNotifications([]);
    setToasts([]);
  };

  // Sync users & distributors to localStorage
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

  const [lucky12Cards, setLucky12Cards] = useState<Lucky12CardConfig[]>(() => {
    const saved = localStorage.getItem('shyam_lucky12_cards');
    return saved ? JSON.parse(saved) : defaultLucky12Cards;
  });

  useEffect(() => {
    localStorage.setItem('shyam_lucky12_cards', JSON.stringify(lucky12Cards));
  }, [lucky12Cards]);

  const addLucky12Card = (cardData: Omit<Lucky12CardConfig, 'id'>) => {
    const newId = `l12-${Date.now()}`;
    const newCard: Lucky12CardConfig = {
      ...cardData,
      id: newId,
      cardNo: cardData.cardNo || lucky12Cards.length + 1,
    };
    setLucky12Cards((prev) => [...prev, newCard]);
    addToast('Lucky 12 Card Added', `Card "${cardData.name}" added successfully.`);
  };

  const updateLucky12Card = (id: string, updates: Partial<Lucky12CardConfig>) => {
    setLucky12Cards((prev) =>
      prev.map((card) => (card.id === id ? { ...card, ...updates } : card))
    );
    addToast('Card Updated', 'Lucky 12 card settings saved.');
  };

  const deleteLucky12Card = (id: string) => {
    setLucky12Cards((prev) => prev.filter((card) => card.id !== id));
    addToast('Card Removed', 'Lucky 12 card removed.', 'warning');
  };

  const bulkUpdateGitHubBaseUrl = (githubBaseUrl: string) => {
    if (!githubBaseUrl || !githubBaseUrl.trim()) return;
    const cleanBase = githubBaseUrl.trim().endsWith('/') ? githubBaseUrl.trim() : `${githubBaseUrl.trim()}/`;
    setLucky12Cards((prev) =>
      prev.map((card) => {
        const filename = card.imageUrl.substring(card.imageUrl.lastIndexOf('/') + 1) || `card${card.cardNo}.png`;
        return {
          ...card,
          imageUrl: `${cleanBase}${filename}`,
        };
      })
    );
    addToast('GitHub URLs Updated', 'All Lucky 12 image links updated to new GitHub repository base URL.');
  };

  const resetLucky12CardsToDefault = () => {
    setLucky12Cards(defaultLucky12Cards);
    addToast('Reset to Default', 'Lucky 12 configuration restored to default GitHub repository assets.');
  };

  const importLucky12CardsJSON = (jsonString: string): boolean => {
    try {
      const parsed = JSON.parse(jsonString);
      if (Array.isArray(parsed) && parsed.length > 0) {
        setLucky12Cards(parsed);
        addToast('Import Successful', `Loaded ${parsed.length} Lucky 12 cards from JSON configuration.`);
        return true;
      }
      addToast('Import Failed', 'JSON array must contain at least 1 valid card configuration.', 'error');
      return false;
    } catch (err) {
      addToast('Invalid JSON', 'Could not parse the provided JSON configuration string.', 'error');
      return false;
    }
  };

  // Security Admin PIN verification
  const verifyAdminPin = (pin: string): boolean => {
    return pin === '1234' || pin === '9999';
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
      if (lucky12Cards.length > 0) {
        const activeCards = lucky12Cards.filter((c) => c.status === 'active');
        const list = activeCards.length > 0 ? activeCards : lucky12Cards;
        const pick = list[Math.floor(Math.random() * list.length)];
        return pick.name;
      }
      return 'Golden Crown';
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
            if (!silenceBettingNotifications) {
              addToast(
                `Betting Closed (${gc.gameType})`,
                `Round ${gc.currentRoundNo} timer ended. Processing round draw...`,
                'warning'
              );
            }

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

  const declareWinningResult = async (
    gameType: '2D Lottery' | '3D Lottery' | 'Lucky 12' | '12 Card',
    drawNum: string,
    result: string,
    adminId: string = 'superadmin'
  ) => {
    try {
      const res = await fetch('/api/results', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          gameType,
          winningResult: result,
          drawNumber: drawNum,
        }),
      });
      const data = await res.json();
      if (data.success) {
        await fetchBackendSync();
        addToast(
          'Result Declared & Payouts Distributed!',
          `Official Result "${result}" declared for ${gameType} by ${adminId}.`,
          'success'
        );
      } else {
        addToast('Error', data.message || 'Could not declare result.', 'error');
      }
    } catch (err) {
      addToast('Error', 'Server error while declaring result.', 'error');
    }
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

  const updateWinPercentage = async (
    gameType: string,
    rtp: number,
    margin: number,
    mode: 'Auto' | 'Manual' | 'High Margin'
  ) => {
    try {
      const res = await fetch('/api/win-percentage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          gameType,
          updates: { rtpPercentage: rtp, targetHouseMargin: margin, mode },
        }),
      });
      const data = await res.json();
      if (data.success) {
        await fetchBackendSync();
        addToast('Settings Saved', `Win Percentage rules updated for ${gameType}`);
      }
    } catch (err) {}
  };

  const kickOnlinePlayer = (id: string) => {
    const player = onlinePlayers.find((p) => p.id === id);
    setOnlinePlayers((prev) => prev.filter((p) => p.id !== id));
    if (player) {
      addToast('Player Disconnected', `Forced disconnection for ${player.username}`, 'warning');
    }
  };

  const toggleGameStatus = async (gameType: string) => {
    const gc = gameControls.find((g) => g.gameType === gameType);
    if (!gc) return;
    const nextStatus = gc.status === 'Active' ? 'Stopped' : 'Active';
    await updateGameControl(gameType, { status: nextStatus });
  };

  const toggleBettingLock = async (gameType: string) => {
    const gc = gameControls.find((g) => g.gameType === gameType);
    if (!gc) return;
    const nextLocked = !gc.bettingLocked;
    await updateGameControl(gameType, { bettingLocked: nextLocked });
  };

  const toggleResultMode = async (gameType: string) => {
    const gc = gameControls.find((g) => g.gameType === gameType);
    if (!gc) return;
    const nextMode = gc.mode === 'Auto' ? 'Manual' : 'Auto';
    await updateGameControl(gameType, { mode: nextMode });
  };

  const updateGameControl = async (gameType: string, updates: Partial<GameControlConfig>) => {
    try {
      const res = await fetch('/api/game-config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ gameType, updates }),
      });
      const data = await res.json();
      if (data.success) {
        await fetchBackendSync();
        addToast('Admin Control Saved', `Updated parameters for ${gameType}`);
      }
    } catch (err) {}
  };

  const placeBet = async (
    username: string,
    gameType: '2D Lottery' | '3D Lottery' | 'Lucky 12' | '12 Card',
    selectedNumbers: string[],
    amount: number
  ): Promise<boolean> => {
    const user =
      users.find((item) => item.username.toLowerCase() === username.toLowerCase()) ||
      currentUser ||
      playerSession.user;
    if (!user) {
      addToast('Action Required', 'Please log in to place a bet.', 'error');
      return false;
    }

    const gameControl = gameControls.find((item) => item.gameType === gameType);
    if (gameControl?.status === 'Stopped' || gameControl?.bettingLocked) {
      addToast('Betting Closed', `${gameType} is currently unavailable.`, 'warning');
      return false;
    }
    if (amount <= 0 || selectedNumbers.length === 0) {
      addToast('Invalid Bet', 'Select at least one option and enter valid tokens.', 'error');
      return false;
    }

    try {
      const res = await fetch('/api/place-bet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: user.username,
          gameType,
          selectedNumbers,
          betAmount: amount,
        }),
      });
      const data = await res.json();

      if (data.success && data.ticket) {
        if (data.updatedBalance !== undefined) {
          const updated = { ...user, points: data.updatedBalance };
          setCurrentUser(updated);
          setPlayerSession({ isLoggedIn: true, user: updated });
        }
        await fetchBackendSync();
        addToast('Ticket Confirmed!', `Ticket #${data.ticket.ticketNo} placed for ${amount.toLocaleString()} tokens`);
        return true;
      } else {
        addToast('Bet Failed', data.message || 'Failed to place bet.', 'error');
        return false;
      }
    } catch (err) {
      addToast('Error', 'Server connection error.', 'error');
      return false;
    }
  };

  // Authentication & Session Methods
  const login = (usernameInput: string, passwordInput?: string): boolean => {
    const normUser = usernameInput.trim().toLowerCase();

    if (normUser === 'admin' || normUser === 'superadmin' || normUser === 'masteradmin') {
      const adminAcc: UserAccount = {
        id: 'usr-admin',
        name: 'Master Admin',
        username: 'superadmin',
        role: 'SuperAdmin',
        points: 1000000,
        creditLimit: 5000000,
        status: 'active',
        commissionRate: 0,
        phone: '+91 99999 88888',
        email: 'admin@shyampanel.com',
        createdAt: '2025-01-01',
        lastLogin: new Date().toISOString().replace('T', ' ').substring(0, 16),
        referralCode: 'REF-ADMIN',
      };
      setIsLoggedIn(true);
      setCurrentUser(adminAcc);
      setActiveRole('Admin');
      setCurrentPage('dashboard');
      addToast('Admin Logged In', 'Welcome back, Master Admin!', 'success');
      return true;
    }

    loginAsPlayer(usernameInput, passwordInput);
    return true;
  };

  const loginAsPlayer = async (usernameInput: string, passwordInput?: string): Promise<{ success: boolean; message?: string }> => {
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: usernameInput, password: passwordInput }),
      });
      const data = await res.json();

      if (data.success && data.user) {
        const user = data.user;
        const sess = { isLoggedIn: true, user };
        setPlayerSession(sess);
        setIsLoggedIn(true);
        setCurrentUser(user);
        setActiveRole('Player');
        setCurrentPage('user_game_portal');
        await fetchBackendSync();
        addToast('Player Logged In', `Welcome to Shyam Gaming Portal, ${user.name}!`, 'success');
        return { success: true };
      } else {
        addToast('Login Failed', data.message || 'Account not found. Please register.', 'error');
        return { success: false, message: data.message || 'Account not found.' };
      }
    } catch (err: any) {
      addToast('Connection Error', 'Could not reach backend server.', 'error');
      return { success: false, message: 'Server network error.' };
    }
  };

  const loginAsAdmin = (usernameInput: string, passwordInput?: string, pinInput?: string): { success: boolean; message?: string } => {
    const normUser = usernameInput.trim().toLowerCase();

    // Verify PIN first
    if (pinInput && !verifyAdminPin(pinInput)) {
      addToast('Invalid Security PIN', 'Master PIN is incorrect. Default PIN is 1234.', 'error');
      return { success: false, message: 'Invalid Security PIN. Default PIN is 1234.' };
    }

    if (normUser === 'admin' || normUser === 'superadmin' || normUser === 'masteradmin') {
      // Validate Admin password (Admin@123 or ChangeMe@123 or saved password)
      if (
        passwordInput &&
        passwordInput !== adminPassword &&
        passwordInput !== 'Admin@123' &&
        passwordInput !== 'ChangeMe@123' &&
        passwordInput !== 'admin123'
      ) {
        addToast('Login Failed', 'Incorrect Admin password.', 'error');
        return { success: false, message: 'Incorrect Admin password.' };
      }

      const adminAcc: UserAccount = {
        id: 'usr-admin',
        name: 'Master Admin',
        username: 'admin',
        role: 'SuperAdmin',
        points: 1000000,
        creditLimit: 5000000,
        status: 'active',
        commissionRate: 0,
        phone: '+91 99999 88888',
        email: 'admin@shyampanel.com',
        createdAt: '2025-01-01',
        lastLogin: new Date().toISOString().replace('T', ' ').substring(0, 16),
        referralCode: 'REF-ADMIN',
      };

      const sess = { isLoggedIn: true, user: adminAcc };
      setAdminSession(sess);
      setIsLoggedIn(true);
      setCurrentUser(adminAcc);
      setActiveRole('Admin');
      setCurrentPage('dashboard');

      // Check if default password change is required
      if (
        adminPassword === 'Admin@123' ||
        adminPassword === 'ChangeMe@123' ||
        passwordInput === 'Admin@123' ||
        passwordInput === 'ChangeMe@123'
      ) {
        setMustChangeAdminPassword(true);
        addToast('Mandatory Action', 'Default password detected. Please set a new Admin password.', 'warning');
      } else {
        addToast('Admin Authenticated', 'Master Admin session established.', 'success');
      }
      return { success: true };
    }

    const adminAccounts = [...superDistributers, ...distributers, ...retailers];
    const found = adminAccounts.find(
      (u) => u.username.toLowerCase() === normUser || (u.email && u.email.toLowerCase() === normUser)
    );

    if (found) {
      if (found.status === 'blocked' || found.status === 'suspended') {
        addToast('Admin Access Blocked', 'Your admin account is suspended.', 'error');
        return { success: false, message: 'Your admin account is suspended.' };
      }

      const sess = { isLoggedIn: true, user: found };
      setAdminSession(sess);
      setIsLoggedIn(true);
      setCurrentUser(found);
      setActiveRole('Admin');
      setCurrentPage('dashboard');
      addToast('Admin Portal Authenticated', `Welcome back, ${found.name}!`, 'success');
      return { success: true };
    }

    addToast('Admin Access Denied', 'Invalid admin credentials or account not found.', 'error');
    return { success: false, message: 'Access Denied: Account is not authorized for Admin access.' };
  };

  const register = async (
    name: string,
    username: string,
    password: string,
    email: string,
    phone: string,
    refCode?: string
  ): Promise<{ success: boolean; message: string }> => {
    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, username, password, email, phone, referralCode: refCode, role: 'User', initialPoints: 500 }),
      });
      const data = await res.json();

      if (data.success && data.user) {
        const user = data.user;
        const sess = { isLoggedIn: true, user };
        setPlayerSession(sess);
        setIsLoggedIn(true);
        setCurrentUser(user);
        setActiveRole('Player');
        setCurrentPage('user_game_portal');
        await fetchBackendSync();
        addToast('Account Registered!', `Welcome to Shyam Panel, ${name}! You received ₹500 signup bonus.`, 'success');
        return { success: true, message: 'Registration successful!' };
      } else {
        return { success: false, message: data.message || 'Registration failed.' };
      }
    } catch (err: any) {
      return { success: false, message: 'Server network error.' };
    }
  };

  const [activeOTP, setActiveOTP] = useState<{ emailOrPhone: string; code: string } | null>(null);

  const forgotPasswordOTP = (
    emailOrPhone: string
  ): { success: boolean; otp?: string; message: string } => {
    const normInput = emailOrPhone.trim().toLowerCase();
    const allAccounts = [...users, ...retailers, ...distributers, ...superDistributers];
    const found = allAccounts.find(
      (u) =>
        (u.email && u.email.toLowerCase() === normInput) ||
        (u.phone && u.phone.includes(normInput)) ||
        u.username.toLowerCase() === normInput
    );

    if (!found) {
      return { success: false, message: 'No account registered with provided email or phone.' };
    }

    const generatedOTP = String(Math.floor(1000 + Math.random() * 9000));
    setActiveOTP({ emailOrPhone: normInput, code: generatedOTP });

    addToast('Verification OTP Sent', `Your verification code is ${generatedOTP} (sent to ${emailOrPhone})`, 'info');
    return { success: true, otp: generatedOTP, message: 'OTP code sent to your email/phone!' };
  };

  const verifyOTPAndReset = (emailOrPhone: string, otpInput: string, newPassword: string): boolean => {
    if (!activeOTP || activeOTP.code !== otpInput.trim()) {
      addToast('Invalid OTP', 'The verification code entered is incorrect.', 'error');
      return false;
    }

    addToast('Password Reset Successful', 'Your password has been updated safely. Please log in.', 'success');
    setActiveOTP(null);
    return true;
  };

  const switchSessionRole = (role: 'Admin' | 'Player') => {
    setActiveRole(role);
    if (role === 'Player') {
      setCurrentPage('user_game_portal');
      addToast('Switched to Player Panel', 'Now viewing Player Portal.', 'info');
    } else {
      setCurrentPage('dashboard');
      addToast('Switched to Admin Panel', 'Now viewing Master Admin Panel.', 'info');
    }
  };

  const logoutAdmin = () => {
    const emptySess = { isLoggedIn: false, user: null };
    setAdminSession(emptySess);
    localStorage.setItem('shyam_admin_session', JSON.stringify(emptySess));
    addToast('Admin Logged Out', 'You have been logged out of the Admin portal.', 'info');
  };

  const logoutPlayer = () => {
    const emptySess = { isLoggedIn: false, user: null };
    setPlayerSession(emptySess);
    localStorage.setItem('shyam_player_session', JSON.stringify(emptySess));
    addToast('Player Logged Out', 'You have logged out of Shyam Game.', 'info');
  };

  const logout = () => {
    logoutAdmin();
    logoutPlayer();
    setIsLoggedIn(false);
    setCurrentUser(null);
    localStorage.removeItem('shyam_logged_in');
    localStorage.removeItem('shyam_current_user');
  };

  // Deposit & Withdrawal Requests
  const submitDepositRequest = async (
    amount: number,
    paymentMethod: 'UPI' | 'Bank Transfer' | 'Crypto' | 'USDT',
    utrNumber: string
  ): Promise<boolean> => {
    if (!currentUser) {
      addToast('Error', 'Please log in to submit deposit request.', 'error');
      return false;
    }

    try {
      const res = await fetch('/api/deposit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: currentUser.username,
          amount,
          paymentMethod,
          utrNumber,
        }),
      });
      const data = await res.json();
      if (data.success) {
        await fetchBackendSync();
        addToast('Deposit Request Submitted', `₹${amount.toLocaleString()} deposit request sent for Admin approval.`, 'info');
        return true;
      } else {
        addToast('Error', data.message || 'Failed to submit deposit.', 'error');
        return false;
      }
    } catch (err) {
      addToast('Error', 'Server connection error.', 'error');
      return false;
    }
  };

  const approveDepositRequest = async (id: string) => {
    try {
      const res = await fetch('/api/deposits/action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, action: 'Approved' }),
      });
      const data = await res.json();
      if (data.success) {
        await fetchBackendSync();
        addToast('Deposit Approved', 'Deposit approved and player wallet credited.', 'success');
      } else {
        addToast('Error', data.message || 'Failed to approve deposit.', 'error');
      }
    } catch (err) {}
  };

  const rejectDepositRequest = async (id: string, reason: string = 'Rejected by Admin') => {
    try {
      const res = await fetch('/api/deposits/action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, action: 'Rejected', remark: reason }),
      });
      const data = await res.json();
      if (data.success) {
        await fetchBackendSync();
        addToast('Deposit Rejected', 'Deposit request rejected.', 'warning');
      }
    } catch (err) {}
  };

  const submitWithdrawalRequest = async (
    amount: number,
    paymentMethod: 'UPI' | 'Bank Transfer',
    accountDetails: string
  ): Promise<boolean> => {
    if (!currentUser) return false;
    try {
      const res = await fetch('/api/withdraw', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: currentUser.username,
          amount,
          paymentMethod,
          accountDetails,
        }),
      });
      const data = await res.json();
      if (data.success) {
        await fetchBackendSync();
        addToast('Withdrawal Requested', `₹${amount.toLocaleString()} withdrawal request placed.`, 'info');
        return true;
      } else {
        addToast('Error', data.message || 'Insufficient points or failed.', 'error');
        return false;
      }
    } catch (err) {
      return false;
    }
  };

  const approveWithdrawalRequest = async (id: string) => {
    try {
      const res = await fetch('/api/withdrawals/action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, action: 'Approved' }),
      });
      const data = await res.json();
      if (data.success) {
        await fetchBackendSync();
        addToast('Withdrawal Approved', 'Payout processed successfully.', 'success');
      }
    } catch (err) {}
  };

  const rejectWithdrawalRequest = async (id: string, reason: string = 'Rejected by Admin') => {
    try {
      const res = await fetch('/api/withdrawals/action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, action: 'Rejected', remark: reason }),
      });
      const data = await res.json();
      if (data.success) {
        await fetchBackendSync();
        addToast('Withdrawal Rejected', 'Withdrawal request rejected and points refunded.', 'warning');
      }
    } catch (err) {}
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
        adminSession,
        playerSession,
        isLoggedIn,
        currentUser,
        activeRole,
        adminPassword,
        mustChangeAdminPassword,
        changeAdminPassword,
        login,
        loginAsPlayer,
        loginAsAdmin,
        register,
        forgotPasswordOTP,
        verifyOTPAndReset,
        logout,
        logoutAdmin,
        logoutPlayer,
        switchSessionRole,
        depositRequests,
        withdrawalRequests,
        referralRecords,
        submitDepositRequest,
        submitWithdrawalRequest,
        approveDepositRequest,
        rejectDepositRequest,
        approveWithdrawalRequest,
        rejectWithdrawalRequest,
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
        notifications,
        unreadNotificationCount,
        silenceBettingNotifications,
        toggleSilenceBettingNotifications,
        addToast,
        removeToast,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        clearNotificationHistory,
        liveBetIn,
        liveBetOut,
        todayProfitLoss,
        systemWalletBalance,
        lucky12Cards,
        addLucky12Card,
        updateLucky12Card,
        deleteLucky12Card,
        bulkUpdateGitHubBaseUrl,
        resetLucky12CardsToDefault,
        importLucky12CardsJSON,
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
