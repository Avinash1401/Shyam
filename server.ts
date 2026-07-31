import express, { Request, Response } from 'express';
import cors from 'cors';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import {
  getDb,
  registerUser,
  loginUser,
  placeBet,
  cancelBet,
  declareResult,
  createDepositRequest,
  processDepositAction,
  createWithdrawalRequest,
  processWithdrawalAction,
  updateGameControlSetting,
  updateLucky12CardSetting,
  updateWinPercentageSetting,
  adminAddOrUpdateUser,
  adminAdjustUserPoints,
  getDashboardSummary,
} from './server/db';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());

  // API Routes

  // Health check
  app.get('/api/health', (req: Request, res: Response) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // 1. Full Database Sync Snapshot
  app.get('/api/sync', (req: Request, res: Response) => {
    try {
      const db = getDb();
      res.json({ success: true, data: db });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // 2. Auth: Register
  app.post('/api/register', (req: Request, res: Response) => {
    try {
      const { name, username, password, phone, email, role, parentName, initialPoints } = req.body;
      if (!username || !name) {
        return res.status(400).json({ success: false, message: 'Name and Username are required.' });
      }
      const result = registerUser({ name, username, password, phone, email, role, parentName, initialPoints });
      if (!result.success) {
        return res.status(400).json(result);
      }
      res.json(result);
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  });

  // 3. Auth: Login
  app.post('/api/login', (req: Request, res: Response) => {
    try {
      const { username, password } = req.body;
      if (!username) {
        return res.status(400).json({ success: false, message: 'Username is required.' });
      }
      const result = loginUser(username, password);
      if (!result.success) {
        return res.status(401).json(result);
      }
      res.json(result);
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  });

  // 4. Place Bet
  app.post('/api/place-bet', (req: Request, res: Response) => {
    try {
      const { username, gameType, selectedNumbers, betAmount, drawTime } = req.body;
      if (!username || !gameType || !selectedNumbers || !betAmount) {
        return res.status(400).json({ success: false, message: 'Missing required bet parameters.' });
      }
      const result = placeBet({ username, gameType, selectedNumbers, betAmount: Number(betAmount), drawTime });
      if (!result.success) {
        return res.status(400).json(result);
      }
      res.json(result);
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  });

  // 5. Cancel Bet
  app.post('/api/cancel-bet', (req: Request, res: Response) => {
    try {
      const { ticketNo, username } = req.body;
      if (!ticketNo || !username) {
        return res.status(400).json({ success: false, message: 'Ticket Number and Username are required.' });
      }
      const result = cancelBet(ticketNo, username);
      if (!result.success) {
        return res.status(400).json(result);
      }
      res.json(result);
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  });

  // 6. Live Bets
  app.get('/api/live-bets', (req: Request, res: Response) => {
    try {
      const db = getDb();
      res.json({ success: true, bets: db.gameTickets });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // 7. Users Management
  app.get('/api/users', (req: Request, res: Response) => {
    try {
      const db = getDb();
      res.json({ success: true, users: db.users });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  app.post('/api/users', (req: Request, res: Response) => {
    try {
      const result = adminAddOrUpdateUser(req.body);
      res.json(result);
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  });

  app.post('/api/users/points', (req: Request, res: Response) => {
    try {
      const { username, amount, type } = req.body;
      if (!username || !amount || !type) {
        return res.status(400).json({ success: false, message: 'Username, amount and type (Add/Deduct) are required.' });
      }
      const result = adminAdjustUserPoints(username, Number(amount), type);
      if (!result.success) {
        return res.status(400).json(result);
      }
      res.json(result);
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  });

  // 8. Admin Dashboard Stats
  app.get('/api/dashboard', (req: Request, res: Response) => {
    try {
      const summary = getDashboardSummary();
      res.json({ success: true, dashboard: summary });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // 9. Deposit APIs
  app.post('/api/deposit', (req: Request, res: Response) => {
    try {
      const { username, amount, paymentMethod, utrNumber, remark } = req.body;
      if (!username || !amount || !paymentMethod || !utrNumber) {
        return res.status(400).json({ success: false, message: 'Username, amount, payment method and UTR number are required.' });
      }
      const result = createDepositRequest({ username, amount: Number(amount), paymentMethod, utrNumber, remark });
      res.json(result);
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  });

  app.get('/api/deposits', (req: Request, res: Response) => {
    try {
      const db = getDb();
      res.json({ success: true, deposits: db.depositRequests });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  app.post('/api/deposits/action', (req: Request, res: Response) => {
    try {
      const { id, action, remark } = req.body;
      if (!id || !action) {
        return res.status(400).json({ success: false, message: 'Deposit ID and action (Approved/Rejected) are required.' });
      }
      const result = processDepositAction(id, action, remark);
      if (!result.success) {
        return res.status(400).json(result);
      }
      res.json(result);
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  });

  // 10. Withdrawal APIs
  app.post('/api/withdraw', (req: Request, res: Response) => {
    try {
      const { username, amount, paymentMethod, accountDetails, remark } = req.body;
      if (!username || !amount || !paymentMethod || !accountDetails) {
        return res.status(400).json({ success: false, message: 'Username, amount, payment method and account details are required.' });
      }
      const result = createWithdrawalRequest({ username, amount: Number(amount), paymentMethod, accountDetails, remark });
      if (!result.success) {
        return res.status(400).json(result);
      }
      res.json(result);
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  });

  app.get('/api/withdrawals', (req: Request, res: Response) => {
    try {
      const db = getDb();
      res.json({ success: true, withdrawals: db.withdrawalRequests });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  app.post('/api/withdrawals/action', (req: Request, res: Response) => {
    try {
      const { id, action, remark } = req.body;
      if (!id || !action) {
        return res.status(400).json({ success: false, message: 'Withdrawal ID and action (Approved/Rejected) are required.' });
      }
      const result = processWithdrawalAction(id, action, remark);
      if (!result.success) {
        return res.status(400).json(result);
      }
      res.json(result);
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  });

  // 11. Game Configuration APIs
  app.get('/api/game-config', (req: Request, res: Response) => {
    try {
      const db = getDb();
      res.json({
        success: true,
        gameControls: db.gameControls,
        lucky12Cards: db.lucky12Cards,
        winPercentages: db.winPercentages,
      });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  app.post('/api/game-config', (req: Request, res: Response) => {
    try {
      const { gameType, updates } = req.body;
      if (!gameType || !updates) {
        return res.status(400).json({ success: false, message: 'gameType and updates object are required.' });
      }
      const result = updateGameControlSetting(gameType, updates);
      if (!result.success) {
        return res.status(400).json(result);
      }
      res.json(result);
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  });

  app.post('/api/lucky12-card', (req: Request, res: Response) => {
    try {
      const { cardId, updates } = req.body;
      if (!cardId || !updates) {
        return res.status(400).json({ success: false, message: 'cardId and updates object are required.' });
      }
      const result = updateLucky12CardSetting(cardId, updates);
      if (!result.success) {
        return res.status(400).json(result);
      }
      res.json(result);
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  });

  app.post('/api/win-percentage', (req: Request, res: Response) => {
    try {
      const { gameType, updates } = req.body;
      if (!gameType || !updates) {
        return res.status(400).json({ success: false, message: 'gameType and updates object are required.' });
      }
      const result = updateWinPercentageSetting(gameType, updates);
      if (!result.success) {
        return res.status(400).json(result);
      }
      res.json(result);
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  });

  // 12. Results APIs
  app.get('/api/results', (req: Request, res: Response) => {
    try {
      const db = getDb();
      res.json({ success: true, results: db.liveResults });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  app.post('/api/results', (req: Request, res: Response) => {
    try {
      const { gameType, winningResult, drawNumber, drawTime } = req.body;
      if (!gameType || !winningResult) {
        return res.status(400).json({ success: false, message: 'gameType and winningResult are required.' });
      }
      const result = declareResult(gameType, winningResult, drawNumber, drawTime);
      if (!result.success) {
        return res.status(400).json(result);
      }
      res.json(result);
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  });

  // Vite middleware in dev / Static files in production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Unified Full-Stack Backend Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
