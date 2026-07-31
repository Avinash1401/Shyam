import {
  UserAccount,
  OnlinePlayer,
  GameTicket,
  WinPercentageConfig,
  LiveResultDraw,
  TransactionRecord,
  ActivityLog,
} from '../types';

// Production database initial collections - empty by default
export const initialSuperDistributers: UserAccount[] = [];

export const initialDistributers: UserAccount[] = [];

export const initialRetailers: UserAccount[] = [];

export const initialUsers: UserAccount[] = [];

export const initialOnlinePlayers: OnlinePlayer[] = [];

export const initialGameTickets: GameTicket[] = [];

export const initialWinPercentages: WinPercentageConfig[] = [
  {
    gameType: '2D Lottery',
    rtpPercentage: 82.5,
    targetHouseMargin: 17.5,
    mode: 'Auto',
    maxSingleBetLimit: 10000,
    maxDrawLiability: 150000,
    updatedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
  },
  {
    gameType: '3D Lottery',
    rtpPercentage: 80.0,
    targetHouseMargin: 20.0,
    mode: 'Auto',
    maxSingleBetLimit: 5000,
    maxDrawLiability: 200000,
    updatedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
  },
  {
    gameType: 'Lucky 12',
    rtpPercentage: 85.0,
    targetHouseMargin: 15.0,
    mode: 'High Margin',
    maxSingleBetLimit: 20000,
    maxDrawLiability: 300000,
    updatedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
  },
  {
    gameType: '12 Card',
    rtpPercentage: 84.0,
    targetHouseMargin: 16.0,
    mode: 'Auto',
    maxSingleBetLimit: 15000,
    maxDrawLiability: 250000,
    updatedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
  },
];

export const initialLiveResults: LiveResultDraw[] = [];

export const initialTransactions: TransactionRecord[] = [];

export const initialActivityLogs: ActivityLog[] = [
  {
    id: 'log-1',
    username: 'admin',
    role: 'SuperAdmin',
    action: 'System initialized in Production mode.',
    ip: '127.0.0.1',
    timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
    level: 'info',
  },
];
