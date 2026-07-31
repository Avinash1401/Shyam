import fs from 'fs';
import path from 'path';
import {
  UserAccount,
  OnlinePlayer,
  GameTicket,
  WinPercentageConfig,
  LiveResultDraw,
  TransactionRecord,
  AppNotification,
  ActivityLog,
  GameControlConfig,
  DepositRequest,
  WithdrawalRequest,
  Lucky12CardConfig,
} from '../src/types';

export interface DatabaseSchema {
  users: UserAccount[];
  gameTickets: GameTicket[];
  depositRequests: DepositRequest[];
  withdrawalRequests: WithdrawalRequest[];
  liveResults: LiveResultDraw[];
  winPercentages: WinPercentageConfig[];
  gameControls: GameControlConfig[];
  lucky12Cards: Lucky12CardConfig[];
  onlinePlayers: OnlinePlayer[];
  notifications: AppNotification[];
  transactions: TransactionRecord[];
  activityLogs: ActivityLog[];
}

const DB_FILE = path.join(process.cwd(), 'database', 'db.json');

function loadDb(): DatabaseSchema {
  try {
    if (!fs.existsSync(DB_FILE)) {
      const defaultData: DatabaseSchema = {
        users: [
          {
            id: 'usr-admin',
            name: 'Master Admin',
            username: 'admin',
            password: 'Admin@123',
            role: 'SuperAdmin',
            points: 1000000,
            creditLimit: 5000000,
            status: 'active',
            commissionRate: 0,
            phone: '+91 99999 88888',
            email: 'admin@shyampanel.com',
            createdAt: '2025-01-01 00:00:00',
            lastLogin: new Date().toISOString().replace('T', ' ').substring(0, 16),
            referralCode: 'REF-ADMIN',
          },
        ],
        gameTickets: [],
        depositRequests: [],
        withdrawalRequests: [],
        liveResults: [],
        winPercentages: [
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
        ],
        gameControls: [
          {
            gameType: '2D Lottery',
            status: 'Active',
            bettingLocked: false,
            roundDurationSeconds: 300,
            minBet: 10,
            maxBet: 10000,
            payoutPercentage: 90,
            mode: 'Auto',
            currentRoundNo: 'RD-20260731-001',
            secondsRemaining: 240,
          },
          {
            gameType: '3D Lottery',
            status: 'Active',
            bettingLocked: false,
            roundDurationSeconds: 600,
            minBet: 20,
            maxBet: 20000,
            payoutPercentage: 85,
            mode: 'Auto',
            currentRoundNo: 'RD-3D-101',
            secondsRemaining: 420,
          },
          {
            gameType: 'Lucky 12',
            status: 'Active',
            bettingLocked: false,
            roundDurationSeconds: 180,
            minBet: 10,
            maxBet: 5000,
            payoutPercentage: 92,
            mode: 'Auto',
            currentRoundNo: 'L12-901',
            secondsRemaining: 110,
          },
          {
            gameType: '12 Card',
            status: 'Active',
            bettingLocked: false,
            roundDurationSeconds: 120,
            minBet: 5,
            maxBet: 2000,
            payoutPercentage: 90,
            mode: 'Auto',
            currentRoundNo: '12C-501',
            secondsRemaining: 85,
          },
        ],
        lucky12Cards: [
          { id: 'l12-1', cardNo: 1, name: 'Golden Crown', icon: '👑', imageUrl: 'https://raw.githubusercontent.com/avinashsaini1401/lucky12-assets/main/cards/card1_crown.png', multiplier: '10x', status: 'active' },
          { id: 'l12-2', cardNo: 2, name: 'Lucky Seven', icon: '7️⃣', imageUrl: 'https://raw.githubusercontent.com/avinashsaini1401/lucky12-assets/main/cards/card2_seven.png', multiplier: '10x', status: 'active' },
          { id: 'l12-3', cardNo: 3, name: 'Royal Diamond', icon: '💎', imageUrl: 'https://raw.githubusercontent.com/avinashsaini1401/lucky12-assets/main/cards/card3_diamond.png', multiplier: '10x', status: 'active' },
          { id: 'l12-4', cardNo: 4, name: 'Mystic Star', icon: '⭐', imageUrl: 'https://raw.githubusercontent.com/avinashsaini1401/lucky12-assets/main/cards/card4_star.png', multiplier: '10x', status: 'active' },
          { id: 'l12-5', cardNo: 5, name: 'Golden Horseshoe', icon: '🧲', imageUrl: 'https://raw.githubusercontent.com/avinashsaini1401/lucky12-assets/main/cards/card5_horseshoe.png', multiplier: '10x', status: 'active' },
          { id: 'l12-6', cardNo: 6, name: 'Dragon Fortune', icon: '🐉', imageUrl: 'https://raw.githubusercontent.com/avinashsaini1401/lucky12-assets/main/cards/card6_dragon.png', multiplier: '10x', status: 'active' },
          { id: 'l12-7', cardNo: 7, name: 'Golden Lotus', icon: '🪷', imageUrl: 'https://raw.githubusercontent.com/avinashsaini1401/lucky12-assets/main/cards/card7_lotus.png', multiplier: '10x', status: 'active' },
          { id: 'l12-8', cardNo: 8, name: 'Royal Eagle', icon: '🦅', imageUrl: 'https://raw.githubusercontent.com/avinashsaini1401/lucky12-assets/main/cards/card8_eagle.png', multiplier: '10x', status: 'active' },
          { id: 'l12-9', cardNo: 9, name: 'Fire Phoenix', icon: '🔥', imageUrl: 'https://raw.githubusercontent.com/avinashsaini1401/lucky12-assets/main/cards/card9_phoenix.png', multiplier: '10x', status: 'active' },
          { id: 'l12-10', cardNo: 10, name: 'Jade Lion', icon: '🦁', imageUrl: 'https://raw.githubusercontent.com/avinashsaini1401/lucky12-assets/main/cards/card10_lion.png', multiplier: '10x', status: 'active' },
          { id: 'l12-11', cardNo: 11, name: 'Ace of Spades', icon: '♠️', imageUrl: 'https://raw.githubusercontent.com/avinashsaini1401/lucky12-assets/main/cards/card11_spade.png', multiplier: '10x', status: 'active' },
          { id: 'l12-12', cardNo: 12, name: 'Sun God', icon: '☀️', imageUrl: 'https://raw.githubusercontent.com/avinashsaini1401/lucky12-assets/main/cards/card12_sungod.png', multiplier: '10x', status: 'active' },
        ],
        onlinePlayers: [],
        notifications: [],
        transactions: [],
        activityLogs: [],
      };
      fs.writeFileSync(DB_FILE, JSON.stringify(defaultData, null, 2), 'utf-8');
      return defaultData;
    }
    const content = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(content);
  } catch (err) {
    console.error('Error loading database file:', err);
    return {
      users: [],
      gameTickets: [],
      depositRequests: [],
      withdrawalRequests: [],
      liveResults: [],
      winPercentages: [],
      gameControls: [],
      lucky12Cards: [],
      onlinePlayers: [],
      notifications: [],
      transactions: [],
      activityLogs: [],
    };
  }
}

let dbMemoryCache: DatabaseSchema = loadDb();

export function saveDb(data: DatabaseSchema) {
  dbMemoryCache = data;
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing database file:', err);
  }
}

export function getDb(): DatabaseSchema {
  return dbMemoryCache;
}

// Helper DB operations
export function registerUser(userData: {
  name: string;
  username: string;
  password?: string;
  phone?: string;
  email?: string;
  role?: 'User' | 'Retailer' | 'Distributer' | 'SuperDistributer' | 'SuperAdmin';
  parentName?: string;
  initialPoints?: number;
}): { success: boolean; message?: string; user?: UserAccount } {
  const db = getDb();
  const normUser = userData.username.trim().toLowerCase();
  
  const existing = db.users.find(
    (u) => u.username.toLowerCase() === normUser || (userData.phone && u.phone === userData.phone)
  );

  if (existing) {
    return { success: false, message: 'Username or phone number is already registered.' };
  }

  const newUser: UserAccount = {
    id: `usr-${Date.now()}`,
    name: userData.name,
    username: userData.username,
    password: userData.password || '123456',
    role: userData.role || 'User',
    parentName: userData.parentName || 'Direct Player',
    points: userData.initialPoints !== undefined ? userData.initialPoints : 500,
    creditLimit: 10000,
    status: 'active',
    commissionRate: 5.0,
    phone: userData.phone,
    email: userData.email,
    createdAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
    lastLogin: new Date().toISOString().replace('T', ' ').substring(0, 19),
    referralCode: `REF-${userData.username.toUpperCase()}`,
  };

  db.users.unshift(newUser);

  // Add initial signup bonus transaction
  if (newUser.points > 0) {
    db.transactions.unshift({
      id: `tx-${Date.now()}`,
      refId: `BONUS-${Date.now().toString().slice(-6)}`,
      fromUser: 'System',
      toUser: newUser.username,
      type: 'Credit',
      amount: newUser.points,
      balanceAfter: newUser.points,
      remark: 'New Player Registration Signup Bonus',
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
    });
  }

  // Add online player session
  db.onlinePlayers = db.onlinePlayers.filter((p) => p.username !== newUser.username);
  db.onlinePlayers.unshift({
    id: `onl-${Date.now()}`,
    username: newUser.username,
    role: newUser.role,
    parent: newUser.parentName || 'Direct Player',
    currentGame: '2D Lottery',
    points: newUser.points,
    currentBet: 0,
    ipAddress: '103.110.244.18',
    device: 'Web Client',
    connectedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    status: 'Lobby',
  });

  db.activityLogs.unshift({
    id: `log-${Date.now()}`,
    username: newUser.username,
    role: newUser.role,
    action: `Registered new player account with ₹${newUser.points} bonus.`,
    ip: '103.110.244.18',
    timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
    level: 'info',
  });

  saveDb(db);
  return { success: true, message: 'Registration successful!', user: newUser };
}

export function loginUser(usernameInput: string, passwordInput?: string): { success: boolean; message?: string; user?: UserAccount } {
  const db = getDb();
  const normUser = usernameInput.trim().toLowerCase();
  const cleanPhone = normUser.replace(/[\s\+]+/g, '');

  const user = db.users.find(
    (u) =>
      u.username.toLowerCase() === normUser ||
      (u.email && u.email.toLowerCase() === normUser) ||
      (u.phone && u.phone.replace(/[\s\+]+/g, '').includes(cleanPhone) && cleanPhone.length >= 4)
  );

  if (!user) {
    return { success: false, message: 'Invalid username, phone, or credentials.' };
  }

  if (user.status === 'blocked' || user.status === 'suspended') {
    return { success: false, message: 'Account is blocked or suspended.' };
  }

  user.lastLogin = new Date().toISOString().replace('T', ' ').substring(0, 19);

  // Update online players list
  db.onlinePlayers = db.onlinePlayers.filter((p) => p.username !== user.username);
  db.onlinePlayers.unshift({
    id: `onl-${Date.now()}`,
    username: user.username,
    role: user.role,
    parent: user.parentName || 'Direct Player',
    currentGame: '2D Lottery',
    points: user.points,
    currentBet: 0,
    ipAddress: '103.110.244.18',
    device: 'Web Client',
    connectedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    status: 'Lobby',
  });

  saveDb(db);
  return { success: true, message: 'Login successful', user };
}

export function placeBet(betData: {
  username: string;
  gameType: '2D Lottery' | '3D Lottery' | 'Lucky 12' | '12 Card';
  selectedNumbers: string[];
  betAmount: number;
  drawTime?: string;
}): { success: boolean; message?: string; ticket?: GameTicket; updatedBalance?: number } {
  const db = getDb();
  const user = db.users.find((u) => u.username === betData.username);

  if (!user) {
    return { success: false, message: 'User account not found.' };
  }

  if (user.points < betData.betAmount) {
    return { success: false, message: `Insufficient points! Required: ₹${betData.betAmount}, Available: ₹${user.points}` };
  }

  // Deduct user balance
  user.points -= betData.betAmount;

  const ticketId = `TKT-${Date.now().toString().slice(-8)}`;
  const gameControl = db.gameControls.find((g) => g.gameType === betData.gameType);

  const newTicket: GameTicket = {
    id: `tkt-${Date.now()}`,
    ticketNo: ticketId,
    userId: user.id,
    username: user.username,
    playerName: user.name,
    mobileNumber: user.phone || '9876543210',
    role: user.role,
    parentName: user.parentName || 'Direct Player',
    gameType: betData.gameType,
    selectedNumbers: betData.selectedNumbers,
    betAmount: betData.betAmount,
    winAmount: 0,
    status: 'Pending',
    roundId: gameControl?.currentRoundNo || `RD-${Date.now().toString().slice(-4)}`,
    drawTime: betData.drawTime || new Date(Date.now() + 5 * 60 * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    createdAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
    currentWalletBalance: user.points,
    transactionId: `TX-BET-${Date.now().toString().slice(-6)}`,
  };

  db.gameTickets.unshift(newTicket);

  // Add transaction
  db.transactions.unshift({
    id: `tx-${Date.now()}`,
    refId: newTicket.ticketNo,
    fromUser: user.username,
    toUser: 'House',
    type: 'Debit',
    amount: betData.betAmount,
    balanceAfter: user.points,
    remark: `Bet Placed - ${betData.gameType} (${betData.selectedNumbers.join(', ')})`,
    timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
  });

  // Update online players
  const online = db.onlinePlayers.find((p) => p.username === user.username);
  if (online) {
    online.currentGame = betData.gameType;
    online.currentBet = betData.betAmount;
    online.points = user.points;
    online.status = 'In Game';
  }

  saveDb(db);
  return { success: true, message: 'Bet placed successfully!', ticket: newTicket, updatedBalance: user.points };
}

export function cancelBet(ticketNo: string, username: string): { success: boolean; message?: string; ticket?: GameTicket; updatedBalance?: number } {
  const db = getDb();
  const ticket = db.gameTickets.find((t) => t.ticketNo === ticketNo || t.id === ticketNo);

  if (!ticket) {
    return { success: false, message: 'Bet ticket not found.' };
  }

  if (ticket.status !== 'Pending') {
    return { success: false, message: `Cannot cancel ticket with status '${ticket.status}'.` };
  }

  const user = db.users.find((u) => u.username === ticket.username);
  if (!user) {
    return { success: false, message: 'Associated user account not found.' };
  }

  ticket.status = 'Cancelled';
  user.points += ticket.betAmount;

  db.transactions.unshift({
    id: `tx-${Date.now()}`,
    refId: `REFUND-${ticket.ticketNo}`,
    fromUser: 'House',
    toUser: user.username,
    type: 'Refund',
    amount: ticket.betAmount,
    balanceAfter: user.points,
    remark: `Ticket Cancelled - Refund for ${ticket.ticketNo}`,
    timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
  });

  saveDb(db);
  return { success: true, message: 'Ticket cancelled and refunded.', ticket, updatedBalance: user.points };
}

export function declareResult(
  gameType: '2D Lottery' | '3D Lottery' | 'Lucky 12' | '12 Card',
  winningResult: string,
  drawNumber?: string,
  drawTime?: string
): { success: boolean; message?: string; draw?: LiveResultDraw } {
  const db = getDb();

  const currentRound = drawNumber || db.gameControls.find((g) => g.gameType === gameType)?.currentRoundNo || `RD-${Date.now().toString().slice(-4)}`;
  const timeStr = drawTime || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  // Evaluate all pending tickets for this game
  let totalBetsCount = 0;
  let totalPayout = 0;

  db.gameTickets.forEach((t) => {
    if (t.gameType === gameType && t.status === 'Pending') {
      totalBetsCount++;
      const isWinner = t.selectedNumbers.includes(winningResult);

      if (isWinner) {
        let multiplier = 10;
        if (gameType === '2D Lottery') multiplier = 90;
        if (gameType === '3D Lottery') multiplier = 800;
        if (gameType === 'Lucky 12') {
          const card = db.lucky12Cards.find((c) => c.name === winningResult || c.cardNo.toString() === winningResult);
          multiplier = card ? parseInt(card.multiplier) || 10 : 10;
        }

        const winAmount = t.betAmount * multiplier;
        t.status = 'Won';
        t.winAmount = winAmount;
        totalPayout += winAmount;

        const user = db.users.find((u) => u.username === t.username);
        if (user) {
          user.points += winAmount;
          db.transactions.unshift({
            id: `tx-${Date.now()}`,
            refId: `WIN-${t.ticketNo}`,
            fromUser: 'House',
            toUser: user.username,
            type: 'Win Payout',
            amount: winAmount,
            balanceAfter: user.points,
            remark: `Win Payout for Ticket ${t.ticketNo} (${gameType} Result: ${winningResult})`,
            timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
          });
        }
      } else {
        t.status = 'Lost';
        t.winAmount = 0;
      }
    }
  });

  const newDraw: LiveResultDraw = {
    id: `drw-${Date.now()}`,
    gameType,
    drawNumber: currentRound,
    winningResult,
    drawTime: timeStr,
    totalBets: totalBetsCount,
    totalPayout,
    status: 'Declared',
  };

  db.liveResults.unshift(newDraw);

  // Advance game control round number
  const gControl = db.gameControls.find((g) => g.gameType === gameType);
  if (gControl) {
    const nextNum = parseInt(gControl.currentRoundNo.replace(/\D/g, '')) + 1 || Date.now() % 1000;
    gControl.currentRoundNo = `RD-${nextNum}`;
    gControl.secondsRemaining = gControl.roundDurationSeconds;
  }

  saveDb(db);
  return { success: true, message: `Result ${winningResult} declared for ${gameType}!`, draw: newDraw };
}

export function createDepositRequest(reqData: {
  username: string;
  amount: number;
  paymentMethod: 'UPI' | 'Bank Transfer' | 'Crypto' | 'USDT';
  utrNumber: string;
  remark?: string;
}): { success: boolean; message?: string; deposit?: DepositRequest } {
  const db = getDb();
  const user = db.users.find((u) => u.username === reqData.username);

  const newDeposit: DepositRequest = {
    id: `dep-${Date.now()}`,
    username: reqData.username,
    userRole: user?.role || 'User',
    amount: reqData.amount,
    paymentMethod: reqData.paymentMethod,
    utrNumber: reqData.utrNumber,
    status: 'Pending',
    createdAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
    remark: reqData.remark || 'Submitted by player',
  };

  db.depositRequests.unshift(newDeposit);
  saveDb(db);
  return { success: true, message: 'Deposit request submitted successfully!', deposit: newDeposit };
}

export function processDepositAction(id: string, action: 'Approved' | 'Rejected', remark?: string): { success: boolean; message?: string } {
  const db = getDb();
  const deposit = db.depositRequests.find((d) => d.id === id);

  if (!deposit) {
    return { success: false, message: 'Deposit request not found.' };
  }

  if (deposit.status !== 'Pending') {
    return { success: false, message: `Request is already ${deposit.status}.` };
  }

  deposit.status = action;
  if (remark) deposit.remark = remark;

  if (action === 'Approved') {
    const user = db.users.find((u) => u.username === deposit.username);
    if (user) {
      user.points += deposit.amount;
      db.transactions.unshift({
        id: `tx-${Date.now()}`,
        refId: `DEP-${deposit.id}`,
        fromUser: 'Admin',
        toUser: user.username,
        type: 'Credit',
        amount: deposit.amount,
        balanceAfter: user.points,
        remark: `Deposit Approved (${deposit.paymentMethod} UTR: ${deposit.utrNumber})`,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      });
    }
  }

  saveDb(db);
  return { success: true, message: `Deposit request ${action} successfully.` };
}

export function createWithdrawalRequest(reqData: {
  username: string;
  amount: number;
  paymentMethod: 'UPI' | 'Bank Transfer';
  accountDetails: string;
  remark?: string;
}): { success: boolean; message?: string; withdrawal?: WithdrawalRequest } {
  const db = getDb();
  const user = db.users.find((u) => u.username === reqData.username);

  if (!user) {
    return { success: false, message: 'User account not found.' };
  }

  if (user.points < reqData.amount) {
    return { success: false, message: `Insufficient points balance! Available: ₹${user.points}` };
  }

  // Deduct points up front
  user.points -= reqData.amount;

  const newWithdrawal: WithdrawalRequest = {
    id: `wth-${Date.now()}`,
    username: reqData.username,
    userRole: user.role,
    amount: reqData.amount,
    paymentMethod: reqData.paymentMethod,
    accountDetails: reqData.accountDetails,
    status: 'Pending',
    createdAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
    remark: reqData.remark || 'Withdrawal request submitted',
  };

  db.withdrawalRequests.unshift(newWithdrawal);

  db.transactions.unshift({
    id: `tx-${Date.now()}`,
    refId: `WTH-${newWithdrawal.id}`,
    fromUser: user.username,
    toUser: 'Admin',
    type: 'Debit',
    amount: reqData.amount,
    balanceAfter: user.points,
    remark: `Withdrawal Request Submitted (${reqData.paymentMethod})`,
    timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
  });

  saveDb(db);
  return { success: true, message: 'Withdrawal request submitted successfully!', withdrawal: newWithdrawal };
}

export function processWithdrawalAction(id: string, action: 'Approved' | 'Rejected', remark?: string): { success: boolean; message?: string } {
  const db = getDb();
  const wth = db.withdrawalRequests.find((w) => w.id === id);

  if (!wth) {
    return { success: false, message: 'Withdrawal request not found.' };
  }

  if (wth.status !== 'Pending') {
    return { success: false, message: `Request is already ${wth.status}.` };
  }

  wth.status = action;
  if (remark) wth.remark = remark;

  if (action === 'Rejected') {
    // Refund points to user
    const user = db.users.find((u) => u.username === wth.username);
    if (user) {
      user.points += wth.amount;
      db.transactions.unshift({
        id: `tx-${Date.now()}`,
        refId: `REFUND-WTH-${wth.id}`,
        fromUser: 'Admin',
        toUser: user.username,
        type: 'Refund',
        amount: wth.amount,
        balanceAfter: user.points,
        remark: `Withdrawal Request Rejected - Refunded ₹${wth.amount}`,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      });
    }
  }

  saveDb(db);
  return { success: true, message: `Withdrawal request ${action}.` };
}

export function updateGameControlSetting(
  gameType: string,
  updates: Partial<GameControlConfig>
): { success: boolean; message?: string } {
  const db = getDb();
  const gc = db.gameControls.find((g) => g.gameType === gameType);
  if (!gc) {
    return { success: false, message: `Game control for ${gameType} not found.` };
  }

  Object.assign(gc, updates);
  saveDb(db);
  return { success: true, message: `Game settings updated for ${gameType}.` };
}

export function updateLucky12CardSetting(cardId: string, updates: Partial<Lucky12CardConfig>): { success: boolean; message?: string } {
  const db = getDb();
  const card = db.lucky12Cards.find((c) => c.id === cardId || c.cardNo.toString() === cardId);
  if (!card) {
    return { success: false, message: 'Lucky 12 card not found.' };
  }

  Object.assign(card, updates);
  saveDb(db);
  return { success: true, message: `Lucky 12 card ${card.name} updated.` };
}

export function updateWinPercentageSetting(
  gameType: string,
  updates: Partial<WinPercentageConfig>
): { success: boolean; message?: string } {
  const db = getDb();
  const wp = db.winPercentages.find((w) => w.gameType === gameType);
  if (!wp) {
    return { success: false, message: `Win percentage config for ${gameType} not found.` };
  }

  Object.assign(wp, updates, { updatedAt: new Date().toISOString().replace('T', ' ').substring(0, 16) });
  saveDb(db);
  return { success: true, message: `Win percentage settings updated for ${gameType}.` };
}

export function adminAddOrUpdateUser(
  userPayload: Partial<UserAccount> & { username: string }
): { success: boolean; message?: string; user?: UserAccount } {
  const db = getDb();
  const normUser = userPayload.username.trim().toLowerCase();
  let user = db.users.find((u) => u.username.toLowerCase() === normUser);

  if (user) {
    // Update existing user
    Object.assign(user, userPayload);
  } else {
    // Add new user
    user = {
      id: userPayload.id || `usr-${Date.now()}`,
      name: userPayload.name || userPayload.username,
      username: userPayload.username,
      password: userPayload.password || '123456',
      role: userPayload.role || 'User',
      parentName: userPayload.parentName || 'Direct Player',
      points: userPayload.points !== undefined ? userPayload.points : 1000,
      creditLimit: userPayload.creditLimit || 5000,
      status: userPayload.status || 'active',
      commissionRate: userPayload.commissionRate || 5.0,
      phone: userPayload.phone || '9876543210',
      email: userPayload.email,
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
      lastLogin: new Date().toISOString().replace('T', ' ').substring(0, 19),
      referralCode: `REF-${userPayload.username.toUpperCase()}`,
    };
    db.users.unshift(user);
  }

  saveDb(db);
  return { success: true, message: 'User saved successfully.', user };
}

export function adminAdjustUserPoints(
  username: string,
  amount: number,
  type: 'Add' | 'Deduct'
): { success: boolean; message?: string; updatedBalance?: number } {
  const db = getDb();
  const user = db.users.find((u) => u.username === username);

  if (!user) {
    return { success: false, message: 'User not found.' };
  }

  if (type === 'Deduct' && user.points < amount) {
    return { success: false, message: `Cannot deduct ₹${amount}. User only has ₹${user.points}.` };
  }

  if (type === 'Add') {
    user.points += amount;
  } else {
    user.points -= amount;
  }

  db.transactions.unshift({
    id: `tx-${Date.now()}`,
    refId: `ADJ-${Date.now().toString().slice(-6)}`,
    fromUser: 'Admin',
    toUser: user.username,
    type: type === 'Add' ? 'Credit' : 'Debit',
    amount,
    balanceAfter: user.points,
    remark: `Admin ${type} Points adjustment`,
    timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
  });

  saveDb(db);
  return { success: true, message: `Successfully ${type.toLowerCase()}ed ₹${amount} points for ${username}.`, updatedBalance: user.points };
}

export function getDashboardSummary() {
  const db = getDb();

  const totalUsers = db.users.length;
  const onlineUsersCount = db.onlinePlayers.length;
  const liveBetsCount = db.gameTickets.filter((t) => t.status === 'Pending').length;
  const totalTurnover = db.gameTickets.reduce((sum, t) => sum + t.betAmount, 0);
  const totalDeposits = db.depositRequests.filter((d) => d.status === 'Approved').reduce((sum, d) => sum + d.amount, 0);
  const totalWithdrawals = db.withdrawalRequests.filter((w) => w.status === 'Approved').reduce((sum, w) => sum + w.amount, 0);
  const totalWalletBalance = db.users.reduce((sum, u) => sum + u.points, 0);

  return {
    totalUsers,
    onlineUsersCount,
    liveBetsCount,
    totalTurnover,
    totalDeposits,
    totalWithdrawals,
    totalWalletBalance,
    recentBets: db.gameTickets.slice(0, 10),
    recentTransactions: db.transactions.slice(0, 10),
    pendingDepositsCount: db.depositRequests.filter((d) => d.status === 'Pending').length,
    pendingWithdrawalsCount: db.withdrawalRequests.filter((w) => w.status === 'Pending').length,
  };
}
