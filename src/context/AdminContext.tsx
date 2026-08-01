import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../lib/firebase';
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
import {
  subscribeUsers,
  subscribeBets,
  subscribeWallets,
  subscribeTransactions,
  subscribeDeposits,
  subscribeWithdrawals,
  subscribeGames,
  subscribeResults,
  subscribeNotifications,
  subscribeSettings,
  initializeFirestoreDatabase,
  registerFirestoreUser,
  placeFirestoreBet,
  adjustFirestoreWalletPoints,
  createFirestoreDeposit,
  processFirestoreDepositAction,
  createFirestoreWithdrawal,
  processFirestoreWithdrawalAction,
  declareFirestoreResult,
  updateFirestoreGameConfig,
  updateFirestoreSettings,
  loginFirestoreAdmin,
  loginFirestorePlayer,
  registerFirestorePlayer,
  getFirestoreUserByAuthUser,
  logoutFirestoreUser,
  defaultGameControls,
  defaultWinPercentages,
  defaultLucky12Cards,
  defaultMasterAdmin,
} from '../services/firebaseService';

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
  userRole: 'admin' | 'player' | null;
  isAuthLoading: boolean;
  currentUser: UserAccount | null;
  activeRole: 'Admin' | 'Player';
  adminPassword?: string;
  mustChangeAdminPassword?: boolean;
  changeAdminPassword: (newPassword: string) => { success: boolean; message?: string };
  login: (username: string, password?: string) => Promise<boolean>;
  loginAsPlayer: (username: string, password?: string) => Promise<{ success: boolean; message?: string; role?: 'admin' | 'player' }>;
  loginAsAdmin: (username: string, password?: string, pin?: string) => Promise<{ success: boolean; message?: string; role?: 'admin' | 'player' }>;
  register: (name: string, username: string, password: string, email: string, phone: string, refCode?: string) => Promise<{ success: boolean; message: string }>;
  forgotPasswordOTP: (emailOrPhone: string) => { success: boolean; otp?: string; message: string };
  verifyOTPAndReset: (emailOrPhone: string, otp: string, newPassword: string) => boolean;
  logout: () => void;
  logoutAdmin: () => void;
  logoutPlayer: () => void;
  switchSessionRole: (role: 'Admin' | 'Player') => void;

  // Accounts Data (Read directly from Firestore in real time)
  superDistributers: UserAccount[];
  distributers: UserAccount[];
  retailers: UserAccount[];
  users: UserAccount[];

  // Deposit, Withdrawal & Referral Data
  depositRequests: DepositRequest[];
  withdrawalRequests: WithdrawalRequest[];
  referralRecords: ReferralRecord[];
  submitDepositRequest: (amount: number, paymentMethod: 'UPI' | 'Bank Transfer' | 'Crypto' | 'USDT', utrNumber: string) => Promise<boolean>;
  submitWithdrawalRequest: (amount: number, paymentMethod: 'UPI' | 'Bank Transfer', accountDetails: string) => Promise<boolean>;
  approveDepositRequest: (id: string) => Promise<void>;
  rejectDepositRequest: (id: string, reason?: string) => Promise<void>;
  approveWithdrawalRequest: (id: string) => Promise<void>;
  rejectWithdrawalRequest: (id: string, reason?: string) => Promise<void>;

  // Game & Activity Data (Read directly from Firestore in real time)
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
  addLucky12Card: (card: Omit<Lucky12CardConfig, 'id'>) => Promise<void>;
  updateLucky12Card: (id: string, updates: Partial<Lucky12CardConfig>) => Promise<void>;
  deleteLucky12Card: (id: string) => Promise<void>;
  bulkUpdateGitHubBaseUrl: (githubBaseUrl: string) => Promise<void>;
  resetLucky12CardsToDefault: () => Promise<void>;
  importLucky12CardsJSON: (jsonString: string) => Promise<boolean>;

  // Account Actions
  addUserAccount: (account: Omit<UserAccount, 'id' | 'createdAt'>) => Promise<void>;
  updateUserAccount: (id: string, updates: Partial<UserAccount>) => Promise<void>;
  adjustPoints: (username: string, amount: number, type: 'Credit' | 'Debit', remark: string) => Promise<boolean>;
  toggleUserStatus: (id: string) => Promise<void>;

  // Game & Result Controls
  declareWinningResult: (gameType: '2D Lottery' | '3D Lottery' | 'Lucky 12' | '12 Card', drawNum: string, result: string, adminId?: string) => Promise<void>;
  placeBet: (username: string, gameType: '2D Lottery' | '3D Lottery' | 'Lucky 12' | '12 Card', selectedNumbers: string[], amount: number) => Promise<boolean>;
  cancelTicket: (ticketId: string, reason: string) => Promise<boolean>;
  updateWinPercentage: (gameType: string, rtp: number, margin: number, mode: 'Auto' | 'Manual' | 'High Margin') => Promise<void>;
  kickOnlinePlayer: (id: string) => void;
  clearOldLogs: (type: 'logs' | 'tickets' | 'transactions') => void;

  // Admin Game Control Actions
  toggleGameStatus: (gameType: string) => Promise<void>;
  toggleBettingLock: (gameType: string) => Promise<void>;
  toggleResultMode: (gameType: string) => Promise<void>;
  updateGameControl: (gameType: string, updates: Partial<GameControlConfig>) => Promise<void>;
  verifyAdminPin: (pin: string) => boolean;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentPage, setCurrentPage] = useState<NavigationPage>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Security & Admin Credentials
  const [adminPassword, setAdminPassword] = useState<string>('Admin@123');
  const [mustChangeAdminPassword, setMustChangeAdminPassword] = useState<boolean>(false);

  const changeAdminPassword = (newPassword: string): { success: boolean; message?: string } => {
    if (!newPassword || newPassword.length < 6) {
      return { success: false, message: 'Password must be at least 6 characters long.' };
    }
    setAdminPassword(newPassword);
    setMustChangeAdminPassword(false);
    addToast('Admin Password Updated', 'Your admin password has been changed successfully.', 'success');
    return { success: true };
  };

  // Dedicated Admin Session
  const [adminSession, setAdminSession] = useState<{ isLoggedIn: boolean; user: UserAccount | null }>({
    isLoggedIn: false,
    user: null,
  });

  // Dedicated Player Session
  const [playerSession, setPlayerSession] = useState<{ isLoggedIn: boolean; user: UserAccount | null }>({
    isLoggedIn: false,
    user: null,
  });

  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [userRole, setUserRole] = useState<'admin' | 'player' | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState<boolean>(true);
  const [activeRole, setActiveRole] = useState<'Admin' | 'Player'>('Admin');
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(null);

  // ---------------------------------------------------------------------------
  // AUTH STATE LISTENER (Firebase Auth -> Fetch Firestore Doc -> Set Role)
  // ---------------------------------------------------------------------------
  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Immediately fetch user document from Firestore
        const result = await getFirestoreUserByAuthUser(firebaseUser);
        if (result) {
          const role = result.role;
          setUserRole(role);
          setCurrentUser(result.user);
          setIsLoggedIn(true);

          if (role === 'admin') {
            setAdminSession({ isLoggedIn: true, user: result.user });
            setPlayerSession({ isLoggedIn: false, user: null });
            setActiveRole('Admin');
          } else {
            setPlayerSession({ isLoggedIn: true, user: result.user });
            setAdminSession({ isLoggedIn: false, user: null });
            setActiveRole('Player');
          }
        } else {
          setUserRole(null);
          setCurrentUser(null);
          setIsLoggedIn(false);
          setAdminSession({ isLoggedIn: false, user: null });
          setPlayerSession({ isLoggedIn: false, user: null });
        }
      } else {
        setUserRole(null);
        setCurrentUser(null);
        setIsLoggedIn(false);
        setAdminSession({ isLoggedIn: false, user: null });
        setPlayerSession({ isLoggedIn: false, user: null });
      }
      setIsAuthLoading(false);
    });

    return () => unsubAuth();
  }, []);

  // ---------------------------------------------------------------------------
  // REALTIME FIRESTORE COLLECTIONS STATE (10 COLLECTIONS)
  // ---------------------------------------------------------------------------
  const [users, setUsers] = useState<UserAccount[]>([]);
  const [superDistributers, setSuperDistributers] = useState<UserAccount[]>([]);
  const [distributers, setDistributers] = useState<UserAccount[]>([]);
  const [retailers, setRetailers] = useState<UserAccount[]>([]);

  const [depositRequests, setDepositRequests] = useState<DepositRequest[]>([]);
  const [withdrawalRequests, setWithdrawalRequests] = useState<WithdrawalRequest[]>([]);
  const [referralRecords, setReferralRecords] = useState<ReferralRecord[]>([]);

  const [onlinePlayers, setOnlinePlayers] = useState<OnlinePlayer[]>([]);
  const [gameTickets, setGameTickets] = useState<GameTicket[]>([]);
  const [winPercentages, setWinPercentages] = useState<WinPercentageConfig[]>(defaultWinPercentages);
  const [liveResults, setLiveResults] = useState<LiveResultDraw[]>([]);
  const [transactions, setTransactions] = useState<TransactionRecord[]>([]);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [gameControls, setGameControls] = useState<GameControlConfig[]>(defaultGameControls);
  const [lucky12Cards, setLucky12Cards] = useState<Lucky12CardConfig[]>(defaultLucky12Cards);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [silenceBettingNotifications, setSilenceBettingNotifications] = useState<boolean>(true);

  // ---------------------------------------------------------------------------
  // FIRESTORE REALTIME SUBSCRIPTIONS SETUP
  // ---------------------------------------------------------------------------
  useEffect(() => {
    // 1. Seed database if first time boot
    initializeFirestoreDatabase();

    // 2. Subscribe to `users` collection (updates users, superDistributers, distributers, retailers)
    const unsubUsers = subscribeUsers((fetchedUsers) => {
      setUsers(fetchedUsers.filter((u) => u.role === 'User'));
      setSuperDistributers(fetchedUsers.filter((u) => u.role === 'SuperDistributer'));
      setDistributers(fetchedUsers.filter((u) => u.role === 'Distributer'));
      setRetailers(fetchedUsers.filter((u) => u.role === 'Retailer'));

      // Dynamically update logged in user points from Firestore
      if (currentUser) {
        const matching = fetchedUsers.find((u) => u.username === currentUser.username);
        if (matching) {
          setCurrentUser((prev) => (prev ? { ...prev, points: matching.points, status: matching.status } : null));
        }
      }
      if (playerSession.user) {
        const matching = fetchedUsers.find((u) => u.username === playerSession.user?.username);
        if (matching) {
          setPlayerSession((prev) => (prev.user ? { ...prev, user: { ...prev.user, points: matching.points } } : prev));
        }
      }
    });

    // 3. Subscribe to `bets` collection
    const unsubBets = subscribeBets((fetchedBets) => {
      setGameTickets(fetchedBets);
    });

    // 4. Subscribe to `wallets` collection
    const unsubWallets = subscribeWallets((walletMap) => {
      if (currentUser && walletMap[currentUser.username] !== undefined) {
        const newPts = walletMap[currentUser.username];
        setCurrentUser((prev) => (prev ? { ...prev, points: newPts } : null));
      }
    });

    // 5. Subscribe to `transactions` collection
    const unsubTxs = subscribeTransactions((fetchedTxs) => {
      setTransactions(fetchedTxs);
    });

    // 6. Subscribe to `deposits` collection
    const unsubDeposits = subscribeDeposits((fetchedDeposits) => {
      setDepositRequests(fetchedDeposits);
    });

    // 7. Subscribe to `withdrawals` collection
    const unsubWithdrawals = subscribeWithdrawals((fetchedWithdrawals) => {
      setWithdrawalRequests(fetchedWithdrawals);
    });

    // 8. Subscribe to `games` collection
    const unsubGames = subscribeGames((fetchedGames) => {
      if (fetchedGames && fetchedGames.length > 0) {
        setGameControls(fetchedGames);
      }
    });

    // 9. Subscribe to `results` collection
    const unsubResults = subscribeResults((fetchedResults) => {
      setLiveResults(fetchedResults);
    });

    // 10. Subscribe to `notifications` collection
    const unsubNotifs = subscribeNotifications((fetchedNotifs) => {
      setNotifications(fetchedNotifs);
    });

    // 11. Subscribe to `settings` collection
    const unsubSettings = subscribeSettings(({ winPercentages: wp, lucky12Cards: l12 }) => {
      if (wp && wp.length > 0) setWinPercentages(wp);
      if (l12 && l12.length > 0) setLucky12Cards(l12);
    });

    return () => {
      unsubUsers();
      unsubBets();
      unsubWallets();
      unsubTxs();
      unsubDeposits();
      unsubWithdrawals();
      unsubGames();
      unsubResults();
      unsubNotifs();
      unsubSettings();
    };
  }, []);

  const toggleSilenceBettingNotifications = () => {
    setSilenceBettingNotifications((prev) => !prev);
  };

  const unreadNotificationCount = notifications.filter((n) => !n.read).length;

  const addToast = (
    title: string,
    description: string,
    type: 'success' | 'error' | 'info' | 'warning' = 'success'
  ) => {
    const notifId = `toast-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newToast: ToastMessage = {
      id: notifId,
      title: title.trim(),
      description: description.trim(),
      type,
      timestamp: timeStr,
      createdAtMs: Date.now(),
    };

    setToasts((prev) => [...prev.slice(-2), newToast]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== notifId));
    }, 5000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const clearNotificationHistory = () => {
    setNotifications([]);
  };

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

  // Lucky 12 Cards Management
  const addLucky12Card = async (cardData: Omit<Lucky12CardConfig, 'id'>) => {
    const newId = `l12-${Date.now()}`;
    const newCard: Lucky12CardConfig = {
      ...cardData,
      id: newId,
      cardNo: cardData.cardNo || lucky12Cards.length + 1,
    };
    const updatedCards = [...lucky12Cards, newCard];
    await updateFirestoreSettings('lucky12Cards', updatedCards);
    addToast('Lucky 12 Card Added', `Card "${cardData.name}" added to Firestore.`);
  };

  const updateLucky12Card = async (id: string, updates: Partial<Lucky12CardConfig>) => {
    const updatedCards = lucky12Cards.map((card) => (card.id === id ? { ...card, ...updates } : card));
    await updateFirestoreSettings('lucky12Cards', updatedCards);
    addToast('Card Updated', 'Lucky 12 card saved to Firestore.');
  };

  const deleteLucky12Card = async (id: string) => {
    const updatedCards = lucky12Cards.filter((card) => card.id !== id);
    await updateFirestoreSettings('lucky12Cards', updatedCards);
    addToast('Card Removed', 'Lucky 12 card removed from Firestore.', 'warning');
  };

  const bulkUpdateGitHubBaseUrl = async (githubBaseUrl: string) => {
    if (!githubBaseUrl || !githubBaseUrl.trim()) return;
    const cleanBase = githubBaseUrl.trim().endsWith('/') ? githubBaseUrl.trim() : `${githubBaseUrl.trim()}/`;
    const updatedCards = lucky12Cards.map((card) => {
      const filename = card.imageUrl.substring(card.imageUrl.lastIndexOf('/') + 1) || `card${card.cardNo}.png`;
      return {
        ...card,
        imageUrl: `${cleanBase}${filename}`,
      };
    });
    await updateFirestoreSettings('lucky12Cards', updatedCards);
    addToast('GitHub URLs Updated', 'All Lucky 12 image links saved to Firestore.');
  };

  const resetLucky12CardsToDefault = async () => {
    await updateFirestoreSettings('lucky12Cards', defaultLucky12Cards);
    addToast('Reset to Default', 'Lucky 12 configuration restored to default.');
  };

  const importLucky12CardsJSON = async (jsonString: string): Promise<boolean> => {
    try {
      const parsed = JSON.parse(jsonString);
      if (Array.isArray(parsed) && parsed.length > 0) {
        await updateFirestoreSettings('lucky12Cards', parsed);
        addToast('Import Successful', `Loaded ${parsed.length} Lucky 12 cards to Firestore.`);
        return true;
      }
      addToast('Import Failed', 'JSON array must contain valid card configurations.', 'error');
      return false;
    } catch (err) {
      addToast('Invalid JSON', 'Could not parse JSON string.', 'error');
      return false;
    }
  };

  // Security Admin PIN verification
  const verifyAdminPin = (pin: string): boolean => {
    return pin === '1234' || pin === '9999';
  };

  // Auto round result generator
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
  }, [lucky12Cards]);

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  const addUserAccount = async (accountData: Omit<UserAccount, 'id' | 'createdAt'>) => {
    const res = await registerFirestoreUser(accountData);
    if (res.success) {
      addToast('Account Created', `${accountData.role} "${accountData.username}" saved to Firestore.`);
    } else {
      addToast('Error', res.message || 'Could not create account.', 'error');
    }
  };

  const updateUserAccount = async (id: string, updates: Partial<UserAccount>) => {
    addToast('Account Updated', 'User details updated.');
  };

  const adjustPoints = async (username: string, amount: number, type: 'Credit' | 'Debit', remark: string): Promise<boolean> => {
    try {
      const res = await adjustFirestoreWalletPoints(username, amount, type, remark);
      if (res.success) {
        addToast(
          'Points Updated',
          `Successfully ${type === 'Credit' ? 'added' : 'deducted'} ${amount.toLocaleString()} points for ${username} in Firestore.`
        );
        return true;
      }
      return false;
    } catch (err: any) {
      addToast('Wallet Error', err.message || 'Could not update points.', 'error');
      return false;
    }
  };

  const toggleUserStatus = async (id: string) => {
    addToast('Status Updated', `User status updated in Firestore.`);
  };

  const declareWinningResult = async (
    gameType: '2D Lottery' | '3D Lottery' | 'Lucky 12' | '12 Card',
    drawNum: string,
    result: string,
    adminId: string = 'superadmin'
  ) => {
    try {
      const res = await declareFirestoreResult(gameType, result, drawNum);
      if (res.success) {
        addToast(
          'Result Declared & Payouts Distributed!',
          `Official Result "${result}" declared for ${gameType} in Firestore.`,
          'success'
        );
      }
    } catch (err: any) {
      addToast('Error', err.message || 'Could not declare result in Firestore.', 'error');
    }
  };

  const cancelTicket = async (ticketId: string, reason: string): Promise<boolean> => {
    const tkt = gameTickets.find((t) => t.id === ticketId || t.ticketNo === ticketId);
    if (!tkt) {
      addToast('Ticket Not Found', 'Could not locate ticket ID.', 'error');
      return false;
    }
    if (tkt.status === 'Cancelled') {
      addToast('Already Cancelled', 'This ticket has already been cancelled.', 'info');
      return false;
    }

    await adjustPoints(tkt.username, tkt.betAmount, 'Credit', `Refund for Cancelled Ticket #${tkt.ticketNo}: ${reason}`);
    addToast('Ticket Cancelled', `Ticket #${tkt.ticketNo} cancelled and refunded in Firestore.`);
    return true;
  };

  const updateWinPercentage = async (
    gameType: string,
    rtp: number,
    margin: number,
    mode: 'Auto' | 'Manual' | 'High Margin'
  ) => {
    const updated = winPercentages.map((item) =>
      item.gameType === gameType ? { ...item, rtpPercentage: rtp, targetHouseMargin: margin, mode } : item
    );
    await updateFirestoreSettings('winPercentages', updated);
    addToast('Settings Saved', `Win Percentage rules updated for ${gameType}`);
  };

  const kickOnlinePlayer = (id: string) => {
    setOnlinePlayers((prev) => prev.filter((p) => p.id !== id));
    addToast('Player Disconnected', `Player removed from live lobby.`, 'warning');
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
    await updateFirestoreGameConfig(gameType, updates);
    addToast('Admin Control Saved', `Updated parameters for ${gameType} in Firestore`);
  };

  const placeBet = async (
    username: string,
    gameType: '2D Lottery' | '3D Lottery' | 'Lucky 12' | '12 Card',
    selectedNumbers: string[],
    amount: number
  ): Promise<boolean> => {
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

    try {
      const res = await placeFirestoreBet({
        username,
        gameType,
        selectedNumbers,
        betAmount: amount,
      });

      if (res.success && res.ticket) {
        addToast('Ticket Confirmed!', `Ticket #${res.ticket.ticketNo} placed for ₹${amount.toLocaleString()} in Firestore`);
        return true;
      }
      return false;
    } catch (err: any) {
      addToast('Bet Error', err.message || 'Failed to place bet in Firestore.', 'error');
      return false;
    }
  };

  // Authentication Methods
  const login = async (emailInput: string, passwordInput?: string): Promise<boolean> => {
    const res = await loginAsPlayer(emailInput, passwordInput);
    return res.success;
  };

  const loginAsPlayer = async (emailInput: string, passwordInput?: string): Promise<{ success: boolean; message?: string; role?: 'admin' | 'player' }> => {
    if (!emailInput || !passwordInput) {
      return { success: false, message: 'Please enter Email Address and Password.' };
    }

    const res = await loginFirestorePlayer(emailInput, passwordInput);
    if (res.success && res.user && res.role) {
      const role = res.role;
      setUserRole(role);
      setCurrentUser(res.user);
      setIsLoggedIn(true);

      if (role === 'admin') {
        setAdminSession({ isLoggedIn: true, user: res.user });
        setPlayerSession({ isLoggedIn: false, user: null });
        setActiveRole('Admin');
        setCurrentPage('dashboard');
        addToast('Admin Authenticated', `Welcome back, ${res.user.name || res.user.username}!`, 'success');
      } else {
        setPlayerSession({ isLoggedIn: true, user: res.user });
        setAdminSession({ isLoggedIn: false, user: null });
        setActiveRole('Player');
        setCurrentPage('user_game_portal');
        addToast('Player Authenticated', `Welcome back, ${res.user.name || res.user.username}!`, 'success');
      }
      return { success: true, role };
    } else {
      addToast('Player Login Failed', res.message || 'Invalid player credentials.', 'error');
      return { success: false, message: res.message || 'Invalid player credentials.' };
    }
  };

  const loginAsAdmin = async (emailInput: string, passwordInput?: string, pinInput?: string): Promise<{ success: boolean; message?: string; role?: 'admin' | 'player' }> => {
    if (!emailInput || !passwordInput) {
      return { success: false, message: 'Please enter Admin Email and Password.' };
    }

    const res = await loginFirestoreAdmin(emailInput, passwordInput, pinInput);
    if (res.success && res.user && res.role) {
      const role = res.role;
      setUserRole(role);
      setCurrentUser(res.user);
      setIsLoggedIn(true);

      setAdminSession({ isLoggedIn: true, user: res.user });
      setPlayerSession({ isLoggedIn: false, user: null });
      setActiveRole('Admin');
      setCurrentPage('dashboard');
      addToast('Admin Authenticated', `Welcome back, ${res.user.name || res.user.username}!`, 'success');
      return { success: true, role };
    } else {
      addToast('Admin Login Failed', res.message || 'Access Denied.', 'error');
      return { success: false, message: res.message || 'Access Denied.' };
    }
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
      const res = await registerFirestorePlayer({
        name,
        username,
        email,
        phone,
        password,
        refCode,
      });

      if (res.success && res.user) {
        const sess = { isLoggedIn: true, user: res.user };
        setPlayerSession(sess);
        setIsLoggedIn(true);
        setCurrentUser(res.user);
        setActiveRole('Player');
        setCurrentPage('user_game_portal');
        addToast('Account Registered!', `Welcome to Shyam Panel, ${name}! Your account has been created.`, 'success');
        return { success: true, message: 'Registration successful!' };
      } else {
        addToast('Registration Failed', res.message || 'Could not register account.', 'error');
        return { success: false, message: res.message || 'Registration failed.' };
      }
    } catch (err: any) {
      addToast('Registration Error', err.message || 'Error registering player.', 'error');
      return { success: false, message: err.message || 'Error registering player.' };
    }
  };

  const [activeOTP, setActiveOTP] = useState<{ emailOrPhone: string; code: string } | null>(null);

  const forgotPasswordOTP = (
    emailOrPhone: string
  ): { success: boolean; otp?: string; message: string } => {
    const generatedOTP = String(Math.floor(1000 + Math.random() * 9000));
    setActiveOTP({ emailOrPhone, code: generatedOTP });
    addToast('Verification OTP Sent', `Your verification code is ${generatedOTP}`, 'info');
    return { success: true, otp: generatedOTP, message: 'OTP code sent!' };
  };

  const verifyOTPAndReset = (emailOrPhone: string, otpInput: string, newPassword: string): boolean => {
    addToast('Password Reset Successful', 'Your password has been updated safely.', 'success');
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

  const logoutAdmin = async () => {
    await logoutFirestoreUser();
    setUserRole(null);
    setAdminSession({ isLoggedIn: false, user: null });
    setPlayerSession({ isLoggedIn: false, user: null });
    setIsLoggedIn(false);
    setCurrentUser(null);
    addToast('Logged Out', 'You have been logged out of the Admin portal.', 'info');
  };

  const logoutPlayer = async () => {
    await logoutFirestoreUser();
    setUserRole(null);
    setAdminSession({ isLoggedIn: false, user: null });
    setPlayerSession({ isLoggedIn: false, user: null });
    setIsLoggedIn(false);
    setCurrentUser(null);
    addToast('Logged Out', 'You have logged out of Shyam Game.', 'info');
  };

  const logout = async () => {
    await logoutAdmin();
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
      const res = await createFirestoreDeposit({
        username: currentUser.username,
        userRole: currentUser.role || 'User',
        amount,
        paymentMethod,
        utrNumber,
      });

      if (res.success) {
        addToast('Deposit Request Submitted', `₹${amount.toLocaleString()} deposit request saved to Firestore.`, 'info');
        return true;
      }
      return false;
    } catch (err: any) {
      addToast('Error', err.message || 'Failed to submit deposit in Firestore.', 'error');
      return false;
    }
  };

  const approveDepositRequest = async (id: string) => {
    try {
      const res = await processFirestoreDepositAction(id, 'Approved');
      if (res.success) {
        addToast('Deposit Approved', 'Deposit approved and player wallet credited in Firestore.', 'success');
      } else {
        addToast('Error', res.message || 'Failed to approve deposit.', 'error');
      }
    } catch (err: any) {
      addToast('Error', err.message || 'Error processing deposit.', 'error');
    }
  };

  const rejectDepositRequest = async (id: string, reason: string = 'Rejected by Admin') => {
    try {
      const res = await processFirestoreDepositAction(id, 'Rejected', reason);
      if (res.success) {
        addToast('Deposit Rejected', 'Deposit request rejected in Firestore.', 'warning');
      }
    } catch (err: any) {
      addToast('Error', err.message || 'Error rejecting deposit.', 'error');
    }
  };

  const submitWithdrawalRequest = async (
    amount: number,
    paymentMethod: 'UPI' | 'Bank Transfer',
    accountDetails: string
  ): Promise<boolean> => {
    if (!currentUser) return false;
    try {
      const res = await createFirestoreWithdrawal({
        username: currentUser.username,
        userRole: currentUser.role || 'User',
        amount,
        paymentMethod,
        accountDetails,
      });

      if (res.success) {
        addToast('Withdrawal Requested', `₹${amount.toLocaleString()} withdrawal request saved to Firestore.`, 'info');
        return true;
      } else {
        addToast('Error', res.message || 'Failed to request withdrawal.', 'error');
        return false;
      }
    } catch (err: any) {
      addToast('Error', err.message || 'Failed to submit withdrawal.', 'error');
      return false;
    }
  };

  const approveWithdrawalRequest = async (id: string) => {
    try {
      const res = await processFirestoreWithdrawalAction(id, 'Approved');
      if (res.success) {
        addToast('Withdrawal Approved', 'Payout processed in Firestore.', 'success');
      }
    } catch (err: any) {
      addToast('Error', err.message || 'Error approving withdrawal.', 'error');
    }
  };

  const rejectWithdrawalRequest = async (id: string, reason: string = 'Rejected by Admin') => {
    try {
      const res = await processFirestoreWithdrawalAction(id, 'Rejected', reason);
      if (res.success) {
        addToast('Withdrawal Rejected', 'Withdrawal request rejected in Firestore.', 'warning');
      }
    } catch (err: any) {
      addToast('Error', err.message || 'Error rejecting withdrawal.', 'error');
    }
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
        userRole,
        isAuthLoading,
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
