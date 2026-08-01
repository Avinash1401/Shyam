export type UserRole = 'SuperAdmin' | 'SuperDistributer' | 'Distributer' | 'Retailer' | 'User' | 'admin' | 'player';

export interface UserAccount {
  id: string;
  uid?: string;
  name: string;
  username: string;
  role: UserRole;
  parentName?: string;
  points: number;
  creditLimit: number;
  status: 'active' | 'blocked' | 'suspended';
  commissionRate: number; // e.g., 5.0 %
  childrenCount?: number;
  phone?: string;
  email?: string;
  createdAt: string;
  lastLogin?: string;
  password?: string;
  referralCode?: string;
  referredBy?: string;
  referralEarnings?: number;
}

export interface DepositRequest {
  id: string;
  username: string;
  userRole: UserRole;
  amount: number;
  paymentMethod: 'UPI' | 'Bank Transfer' | 'Crypto' | 'USDT';
  utrNumber: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  createdAt: string;
  remark?: string;
}

export interface WithdrawalRequest {
  id: string;
  username: string;
  userRole: UserRole;
  amount: number;
  paymentMethod: 'UPI' | 'Bank Transfer';
  accountDetails: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  createdAt: string;
  remark?: string;
}

export interface ReferralRecord {
  id: string;
  referrerUsername: string;
  referredUsername: string;
  referralCode: string;
  bonusPoints: number;
  date: string;
}

export interface OnlinePlayer {
  id: string;
  username: string;
  role: UserRole;
  parent: string;
  currentGame: '2D Lottery' | '3D Lottery' | 'Lucky 12' | '12 Card';
  points: number;
  currentBet: number;
  ipAddress: string;
  device: string;
  connectedAt: string;
  status: 'In Game' | 'Lobby' | 'Idle';
}

export interface GameTicket {
  id: string;
  ticketNo: string;
  userId?: string;
  username: string;
  playerName?: string;
  mobileNumber?: string;
  role: UserRole;
  parentName: string;
  gameType: '2D Lottery' | '3D Lottery' | 'Lucky 12' | '12 Card';
  selectedNumbers: string[];
  betAmount: number;
  winAmount: number;
  status: 'Won' | 'Lost' | 'Pending' | 'Cancelled';
  roundId?: string;
  drawTime: string;
  createdAt: string;
  currentWalletBalance?: number;
  transactionId?: string;
}

export interface GameControlConfig {
  gameType: '2D Lottery' | '3D Lottery' | 'Lucky 12' | '12 Card';
  status: 'Active' | 'Stopped';
  bettingLocked: boolean;
  roundDurationSeconds: number;
  minBet: number;
  maxBet: number;
  payoutPercentage: number;
  mode: 'Manual' | 'Auto';
  currentRoundNo: string;
  secondsRemaining: number;
}

export interface WinPercentageConfig {
  gameType: '2D Lottery' | '3D Lottery' | 'Lucky 12' | '12 Card';
  rtpPercentage: number; // Return to player %
  targetHouseMargin: number; // %
  mode: 'Auto' | 'Manual' | 'High Margin';
  maxSingleBetLimit: number;
  maxDrawLiability: number;
  updatedAt: string;
}

export interface TurnoverRecord {
  id: string;
  accountName: string;
  role: UserRole;
  totalPlay: number;
  totalWin: number;
  netTurnover: number;
  commissionEarned: number;
  netProfit: number;
  period: string;
}

export interface CommissionRecord {
  id: string;
  username: string;
  role: UserRole;
  parentName: string;
  gameType?: string;
  totalPlayAmount: number;
  commissionPercentage: number;
  commissionAmount: number;
  status: 'Paid' | 'Pending' | 'Processing';
  date: string;
}

export interface LiveResultDraw {
  id: string;
  gameType: '2D Lottery' | '3D Lottery' | 'Lucky 12' | '12 Card';
  drawNumber: string;
  winningResult: string;
  drawTime: string;
  totalBets: number;
  totalPayout: number;
  status: 'Declared' | 'Live' | 'Upcoming';
}

export interface TransactionRecord {
  id: string;
  refId: string;
  fromUser: string;
  toUser: string;
  type: 'Credit' | 'Debit' | 'Commission' | 'Win Payout' | 'Refund';
  amount: number;
  balanceAfter: number;
  remark: string;
  timestamp: string;
}

export interface AppNotification {
  id: string;
  title: string;
  description: string;
  type: 'success' | 'error' | 'info' | 'warning';
  timestamp: string;
  createdAtMs: number;
  read: boolean;
  fingerprint: string;
}

export interface ToastMessage {
  id: string;
  title: string;
  description: string;
  type?: 'success' | 'error' | 'info' | 'warning';
  timestamp?: string;
  createdAtMs?: number;
}

export interface ActivityLog {
  id: string;
  username: string;
  role: UserRole;
  action: string;
  ip: string;
  timestamp: string;
  level: 'info' | 'warning' | 'danger';
}

export interface Lucky12CardConfig {
  id: string;
  cardNo: number;
  name: string;
  icon: string;
  imageUrl: string;
  multiplier: string;
  status: 'active' | 'disabled';
}

export type NavigationPage = 
  | 'dashboard'
  | 'superdistributer'
  | 'distributer'
  | 'retailer'
  | 'users'
  | 'online_players'
  | 'game_history'
  | 'win_percentage'
  | 'calculator_note'
  | 'turnover_admin'
  | 'turnover_superdistributer'
  | 'turnover_distributer'
  | 'turnover_retailer'
  | 'turnover_user'
  | 'commission_user'
  | 'commission_game'
  | 'live_2d'
  | 'live_3d'
  | 'live_lucky12'
  | 'history_transactions'
  | 'history_logs'
  | 'history_delete'
  | 'history_cancel_tickets'
  | 'declare_2d'
  | 'declare_3d'
  | 'declare_lucky12'
  | 'user_game_portal'
  | 'live_bets_dashboard'
  | 'result_settings'
  | 'source_code_export'
  | 'profile'
  | 'player_wallet'
  | 'player_deposit'
  | 'player_withdrawal'
  | 'player_referral'
  | 'player_support'
  | 'admin_deposits'
  | 'admin_withdrawals'
  | 'admin_referrals'
  | 'admin_lucky12_config';
