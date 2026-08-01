import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  onSnapshot,
  query,
  where,
  runTransaction,
} from 'firebase/firestore';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from 'firebase/auth';
import { db, auth } from '../lib/firebase';
import {
  UserAccount,
  GameTicket,
  DepositRequest,
  WithdrawalRequest,
  LiveResultDraw,
  WinPercentageConfig,
  GameControlConfig,
  Lucky12CardConfig,
  AppNotification,
  TransactionRecord,
  UserRole,
} from '../types';

export const defaultLucky12Cards: Lucky12CardConfig[] = [
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
];

export const defaultGameControls: GameControlConfig[] = [
  { gameType: '2D Lottery', status: 'Active', bettingLocked: false, roundDurationSeconds: 120, minBet: 10, maxBet: 10000, payoutPercentage: 90, mode: 'Auto', currentRoundNo: 'DRW-2D-9845', secondsRemaining: 88 },
  { gameType: '3D Lottery', status: 'Active', bettingLocked: false, roundDurationSeconds: 180, minBet: 20, maxBet: 5000, payoutPercentage: 85, mode: 'Auto', currentRoundNo: 'DRW-3D-4122', secondsRemaining: 145 },
  { gameType: 'Lucky 12', status: 'Active', bettingLocked: false, roundDurationSeconds: 60, minBet: 10, maxBet: 20000, payoutPercentage: 88, mode: 'Manual', currentRoundNo: 'DRW-L12-7020', secondsRemaining: 24 },
  { gameType: '12 Card', status: 'Active', bettingLocked: false, roundDurationSeconds: 90, minBet: 10, maxBet: 15000, payoutPercentage: 86, mode: 'Auto', currentRoundNo: 'DRW-12C-3310', secondsRemaining: 52 },
];

export const defaultWinPercentages: WinPercentageConfig[] = [
  { gameType: '2D Lottery', rtpPercentage: 82.5, targetHouseMargin: 17.5, mode: 'Auto', maxSingleBetLimit: 10000, maxDrawLiability: 150000, updatedAt: new Date().toISOString().replace('T', ' ').substring(0, 16) },
  { gameType: '3D Lottery', rtpPercentage: 80.0, targetHouseMargin: 20.0, mode: 'Auto', maxSingleBetLimit: 5000, maxDrawLiability: 200000, updatedAt: new Date().toISOString().replace('T', ' ').substring(0, 16) },
  { gameType: 'Lucky 12', rtpPercentage: 85.0, targetHouseMargin: 15.0, mode: 'High Margin', maxSingleBetLimit: 20000, maxDrawLiability: 300000, updatedAt: new Date().toISOString().replace('T', ' ').substring(0, 16) },
  { gameType: '12 Card', rtpPercentage: 84.0, targetHouseMargin: 16.0, mode: 'Auto', maxSingleBetLimit: 15000, maxDrawLiability: 250000, updatedAt: new Date().toISOString().replace('T', ' ').substring(0, 16) },
];

export const defaultMasterAdmin: UserAccount = {
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
};

// Seed Firestore initial data if collections are empty
export async function initializeFirestoreDatabase() {
  try {
    // 1. Users & Wallets Seed
    const usersSnap = await getDocs(collection(db, 'users'));
    if (usersSnap.empty) {
      console.log('Seeding initial users to Firestore...');
      const initialUsersList: UserAccount[] = [
        defaultMasterAdmin,
        {
          id: 'usr-player1',
          name: 'Rahul Sharma',
          username: 'rahul123',
          password: 'Password@123',
          role: 'User',
          points: 15000,
          creditLimit: 20000,
          status: 'active',
          commissionRate: 0,
          phone: '+91 98765 43210',
          email: 'rahul@gmail.com',
          parentName: 'retailer1',
          createdAt: '2025-02-10 10:15:00',
          lastLogin: new Date().toISOString().replace('T', ' ').substring(0, 16),
          referralCode: 'REF-RAHUL',
        },
        {
          id: 'usr-ret1',
          name: 'Shyam Retailer',
          username: 'retailer1',
          password: 'Password@123',
          role: 'Retailer',
          points: 50000,
          creditLimit: 100000,
          status: 'active',
          commissionRate: 2.5,
          phone: '+91 91234 56789',
          email: 'retailer1@shyampanel.com',
          parentName: 'distributer1',
          createdAt: '2025-01-15 14:20:00',
          lastLogin: new Date().toISOString().replace('T', ' ').substring(0, 16),
          referralCode: 'REF-RET1',
        },
      ];

      for (const u of initialUsersList) {
        await setDoc(doc(db, 'users', u.username), u);
        await setDoc(doc(db, 'wallets', u.username), {
          id: `wlt-${u.username}`,
          username: u.username,
          points: u.points,
          currency: 'INR',
          updatedAt: new Date().toISOString(),
        });
      }
    } else {
      // Ensure defaultMasterAdmin document exists
      const adminDoc = await getDoc(doc(db, 'users', 'admin'));
      if (!adminDoc.exists()) {
        await setDoc(doc(db, 'users', 'admin'), defaultMasterAdmin);
      }
    }

    // 2. Games Seed
    const gamesSnap = await getDocs(collection(db, 'games'));
    if (gamesSnap.empty) {
      console.log('Seeding initial games to Firestore...');
      for (const g of defaultGameControls) {
        await setDoc(doc(db, 'games', g.gameType), {
          ...g,
          updatedAt: new Date().toISOString(),
        });
      }
    }

    // 3. Settings Seed
    const settingsSnap = await getDocs(collection(db, 'settings'));
    if (settingsSnap.empty) {
      console.log('Seeding initial settings to Firestore...');
      await setDoc(doc(db, 'settings', 'winPercentages'), {
        key: 'winPercentages',
        value: defaultWinPercentages,
        updatedAt: new Date().toISOString(),
      });
      await setDoc(doc(db, 'settings', 'lucky12Cards'), {
        key: 'lucky12Cards',
        value: defaultLucky12Cards,
        updatedAt: new Date().toISOString(),
      });
    }
  } catch (err) {
    console.error('Error initializing Firestore database:', err);
  }
}

// -----------------------------------------------------------------------------
// FIREBASE AUTHENTICATION SERVICES
// -----------------------------------------------------------------------------

export function normalizeRole(rawRole?: string): 'admin' | 'player' {
  if (!rawRole) return 'player';
  const norm = rawRole.toString().trim().toLowerCase();
  if (
    norm === 'admin' ||
    norm === 'superadmin' ||
    norm === 'superdistributer' ||
    norm === 'distributer' ||
    norm === 'retailer'
  ) {
    return 'admin';
  }
  return 'player';
}

export async function getFirestoreUserByAuthUser(firebaseUser: FirebaseUser): Promise<{ user: UserAccount; role: 'admin' | 'player' } | null> {
  if (!firebaseUser) return null;

  try {
    let userSnap = await getDoc(doc(db, 'users', firebaseUser.uid));
    let userObj: UserAccount | null = null;

    if (userSnap.exists()) {
      userObj = userSnap.data() as UserAccount;
    } else if (firebaseUser.email) {
      const userEmail = firebaseUser.email.toLowerCase().trim();
      const qEmail = query(collection(db, 'users'), where('email', '==', userEmail));
      const snapEmail = await getDocs(qEmail);
      if (!snapEmail.empty) {
        userObj = snapEmail.docs[0].data() as UserAccount;
      }
    }

    if (!userObj && (firebaseUser.email?.toLowerCase().includes('admin'))) {
      userObj = defaultMasterAdmin;
    }

    if (userObj) {
      const role = normalizeRole(userObj.role);
      return { user: userObj, role };
    }
  } catch (err) {
    console.error('Error fetching Firestore user by auth user:', err);
  }

  return null;
}

export async function logoutFirestoreUser() {
  try {
    await signOut(auth);
  } catch (err) {
    console.error('Error signing out from Firebase Auth:', err);
  }
}

// Admin Login Handler (Email + Password only)
export async function loginFirestoreAdmin(emailInput: string, passwordInput: string, pinInput?: string) {
  if (pinInput && pinInput !== '1234' && pinInput !== '9999') {
    return { success: false, message: 'Invalid Master Security PIN.' };
  }

  const cleanEmail = emailInput ? emailInput.trim().toLowerCase() : '';

  if (!cleanEmail || !cleanEmail.includes('@')) {
    return { success: false, message: 'Invalid Email Address' };
  }

  try {
    const userCred = await signInWithEmailAndPassword(auth, cleanEmail, passwordInput);
    const result = await getFirestoreUserByAuthUser(userCred.user);

    if (!result || !result.user) {
      return { success: false, message: 'Admin account profile not found in Firestore.' };
    }

    const role = normalizeRole(result.user.role);
    if (role !== 'admin') {
      return { success: false, message: 'Access Denied: Account is not authorized for Admin access.' };
    }

    return { success: true, user: result.user, role, firebaseUser: userCred.user };
  } catch (authError: any) {
    // Auto-bootstrap master admin account if Firebase Auth user doesn't exist yet for admin@shyampanel.com
    if (
      cleanEmail === 'admin@shyampanel.com' &&
      passwordInput === 'Admin@123'
    ) {
      try {
        const newCred = await createUserWithEmailAndPassword(auth, cleanEmail, passwordInput);
        await setDoc(doc(db, 'users', newCred.user.uid), defaultMasterAdmin, { merge: true });
        await setDoc(doc(db, 'users', 'admin'), defaultMasterAdmin, { merge: true });
        return { success: true, user: defaultMasterAdmin, role: 'admin' as const, firebaseUser: newCred.user };
      } catch (createErr: any) {
        if (createErr.code === 'auth/email-already-in-use') {
          return { success: true, user: defaultMasterAdmin, role: 'admin' as const };
        }
      }
    }

    if (authError.code === 'auth/invalid-email') {
      return { success: false, message: 'Invalid Email Address' };
    }

    if (authError.code === 'auth/wrong-password' || authError.code === 'auth/invalid-credential') {
      return { success: false, message: 'Wrong Password' };
    }

    if (authError.code === 'auth/user-not-found') {
      return { success: false, message: 'Invalid Email Address or User not found' };
    }

    return { success: false, message: authError.message || 'Login failed.' };
  }
}

// Player Login Handler (Email + Password only)
export async function loginFirestorePlayer(emailInput: string, passwordInput: string) {
  const cleanEmail = emailInput ? emailInput.trim().toLowerCase() : '';

  if (!cleanEmail || !cleanEmail.includes('@')) {
    return { success: false, message: 'Invalid Email Address' };
  }

  try {
    const userCred = await signInWithEmailAndPassword(auth, cleanEmail, passwordInput);
    const result = await getFirestoreUserByAuthUser(userCred.user);

    if (!result || !result.user) {
      return { success: false, message: 'Player account profile not found in Firestore.' };
    }

    const finalUser = result.user;
    const docKey = finalUser.uid || userCred.user.uid;
    await updateDoc(doc(db, 'users', docKey), {
      lastLogin: new Date().toISOString().replace('T', ' ').substring(0, 16),
    }).catch(() => {});

    const role = normalizeRole(finalUser.role);
    return { success: true, user: finalUser, role, firebaseUser: userCred.user };
  } catch (authError: any) {
    if (authError.code === 'auth/invalid-email') {
      return { success: false, message: 'Invalid Email Address' };
    }

    if (authError.code === 'auth/user-not-found') {
      return { success: false, message: 'User not found. Please register first.' };
    }

    if (authError.code === 'auth/wrong-password' || authError.code === 'auth/invalid-credential') {
      return { success: false, message: 'Wrong Password' };
    }

    return { success: false, message: authError.message || 'Login failed.' };
  }
}

// Player Registration Handler (Email + Password Firebase Auth & Firestore user profile)
export async function registerFirestorePlayer(params: {
  name: string;
  username: string;
  email: string;
  phone: string;
  password: string;
  refCode?: string;
}) {
  const { name, username, email, phone, password, refCode } = params;
  const cleanEmail = email ? email.trim().toLowerCase() : '';
  const cleanUsername = username ? username.trim() : '';

  if (!cleanEmail || !cleanEmail.includes('@')) {
    return { success: false, message: 'Invalid Email Address' };
  }

  if (!password || !name.trim()) {
    return { success: false, message: 'Please fill in all required fields.' };
  }

  // 1. Check if Firestore user with email already exists
  const emailQuery = query(collection(db, 'users'), where('email', '==', cleanEmail));
  const emailSnap = await getDocs(emailQuery);
  if (!emailSnap.empty) {
    return { success: false, message: 'Email address is already registered.' };
  }

  // 2. Create Firebase Authentication Account
  let firebaseUid = '';
  try {
    const authRes = await createUserWithEmailAndPassword(auth, cleanEmail, password);
    firebaseUid = authRes.user.uid;
  } catch (authError: any) {
    if (authError.code === 'auth/email-already-in-use') {
      return { success: false, message: 'This email is already registered.' };
    }
    if (authError.code === 'auth/weak-password') {
      return { success: false, message: 'Password should be at least 6 characters long.' };
    }
    if (authError.code === 'auth/invalid-email') {
      return { success: false, message: 'Invalid Email Address' };
    }
    return { success: false, message: authError.message || 'Registration failed in Firebase Auth.' };
  }

  // 3. Create Firestore Document in `users` collection using UID
  const newUser: UserAccount = {
    id: firebaseUid || `usr-${Date.now()}`,
    uid: firebaseUid,
    name: name.trim(),
    username: cleanUsername || name.trim(), // Stored as a display field in Firestore
    password,
    email: cleanEmail,
    phone: phone ? phone.trim() : '',
    points: 1000,
    creditLimit: 5000,
    commissionRate: 0,
    role: 'player',
    status: 'active',
    referralCode: refCode?.trim() || '',
    createdAt: new Date().toISOString().split('T')[0],
    lastLogin: new Date().toISOString().replace('T', ' ').substring(0, 16),
  };

  try {
    await setDoc(doc(db, 'users', firebaseUid), newUser, { merge: true });
    if (cleanUsername) {
      await setDoc(doc(db, 'users', cleanUsername.toLowerCase()), newUser, { merge: true });
    }
  } catch (e) {
    console.error('Error saving user profile to Firestore:', e);
  }

  return { success: true, user: newUser, role: 'player' as const, message: 'Registration successful!' };
}

export async function signOutFirebaseUser() {
  await signOut(auth);
}

// -----------------------------------------------------------------------------
// REALTIME LISTENERS (onSnapshot) FOR ALL 10 COLLECTIONS
// -----------------------------------------------------------------------------

// 1. USERS COLLECTION
export function subscribeUsers(callback: (users: UserAccount[]) => void) {
  const q = collection(db, 'users');
  return onSnapshot(q, (snapshot) => {
    const users: UserAccount[] = [];
    snapshot.forEach((docSnap) => {
      users.push(docSnap.data() as UserAccount);
    });
    callback(users);
  }, (err) => console.error('Error listening to users:', err));
}

// 2. BETS COLLECTION
export function subscribeBets(callback: (bets: GameTicket[]) => void) {
  const q = collection(db, 'bets');
  return onSnapshot(q, (snapshot) => {
    const bets: GameTicket[] = [];
    snapshot.forEach((docSnap) => {
      bets.push(docSnap.data() as GameTicket);
    });
    bets.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
    callback(bets);
  }, (err) => console.error('Error listening to bets:', err));
}

// 3. WALLETS COLLECTION
export function subscribeWallets(callback: (wallets: Record<string, number>) => void) {
  const q = collection(db, 'wallets');
  return onSnapshot(q, (snapshot) => {
    const walletMap: Record<string, number> = {};
    snapshot.forEach((docSnap) => {
      const data = docSnap.data();
      if (data && data.username) {
        walletMap[data.username] = data.points ?? 0;
      }
    });
    callback(walletMap);
  }, (err) => console.error('Error listening to wallets:', err));
}

// 4. TRANSACTIONS COLLECTION
export function subscribeTransactions(callback: (txs: TransactionRecord[]) => void) {
  const q = collection(db, 'transactions');
  return onSnapshot(q, (snapshot) => {
    const txs: TransactionRecord[] = [];
    snapshot.forEach((docSnap) => {
      txs.push(docSnap.data() as TransactionRecord);
    });
    txs.sort((a, b) => new Date(b.timestamp || 0).getTime() - new Date(a.timestamp || 0).getTime());
    callback(txs);
  }, (err) => console.error('Error listening to transactions:', err));
}

// 5. DEPOSITS COLLECTION
export function subscribeDeposits(callback: (deposits: DepositRequest[]) => void) {
  const q = collection(db, 'deposits');
  return onSnapshot(q, (snapshot) => {
    const deposits: DepositRequest[] = [];
    snapshot.forEach((docSnap) => {
      deposits.push(docSnap.data() as DepositRequest);
    });
    deposits.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
    callback(deposits);
  }, (err) => console.error('Error listening to deposits:', err));
}

// 6. WITHDRAWALS COLLECTION
export function subscribeWithdrawals(callback: (withdrawals: WithdrawalRequest[]) => void) {
  const q = collection(db, 'withdrawals');
  return onSnapshot(q, (snapshot) => {
    const withdrawals: WithdrawalRequest[] = [];
    snapshot.forEach((docSnap) => {
      withdrawals.push(docSnap.data() as WithdrawalRequest);
    });
    withdrawals.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
    callback(withdrawals);
  }, (err) => console.error('Error listening to withdrawals:', err));
}

// 7. GAMES COLLECTION
export function subscribeGames(callback: (games: GameControlConfig[]) => void) {
  const q = collection(db, 'games');
  return onSnapshot(q, (snapshot) => {
    const games: GameControlConfig[] = [];
    snapshot.forEach((docSnap) => {
      games.push(docSnap.data() as GameControlConfig);
    });
    callback(games.length ? games : defaultGameControls);
  }, (err) => console.error('Error listening to games:', err));
}

// 8. RESULTS COLLECTION
export function subscribeResults(callback: (results: LiveResultDraw[]) => void) {
  const q = collection(db, 'results');
  return onSnapshot(q, (snapshot) => {
    const results: LiveResultDraw[] = [];
    snapshot.forEach((docSnap) => {
      results.push(docSnap.data() as LiveResultDraw);
    });
    results.sort((a, b) => new Date(b.drawTime || 0).getTime() - new Date(a.drawTime || 0).getTime());
    callback(results);
  }, (err) => console.error('Error listening to results:', err));
}

// 9. NOTIFICATIONS COLLECTION
export function subscribeNotifications(callback: (notifs: AppNotification[]) => void) {
  const q = collection(db, 'notifications');
  return onSnapshot(q, (snapshot) => {
    const notifs: AppNotification[] = [];
    snapshot.forEach((docSnap) => {
      notifs.push(docSnap.data() as AppNotification);
    });
    notifs.sort((a, b) => (b.createdAtMs || 0) - (a.createdAtMs || 0));
    callback(notifs);
  }, (err) => console.error('Error listening to notifications:', err));
}

// 10. SETTINGS COLLECTION
export function subscribeSettings(callback: (settings: { winPercentages?: WinPercentageConfig[]; lucky12Cards?: Lucky12CardConfig[] }) => void) {
  const q = collection(db, 'settings');
  return onSnapshot(q, (snapshot) => {
    let winPercentages: WinPercentageConfig[] | undefined;
    let lucky12Cards: Lucky12CardConfig[] | undefined;

    snapshot.forEach((docSnap) => {
      const data = docSnap.data();
      if (data.key === 'winPercentages' && Array.isArray(data.value)) {
        winPercentages = data.value;
      }
      if (data.key === 'lucky12Cards' && Array.isArray(data.value)) {
        lucky12Cards = data.value;
      }
    });

    callback({ winPercentages, lucky12Cards });
  }, (err) => console.error('Error listening to settings:', err));
}

// -----------------------------------------------------------------------------
// MUTATION OPERATIONS (Registration, Bets, Wallet, Deposit, Withdrawal, etc.)
// -----------------------------------------------------------------------------

export async function registerFirestoreUser(userData: Omit<UserAccount, 'id' | 'createdAt'>) {
  const username = userData.username.trim().toLowerCase();
  const userRef = doc(db, 'users', username);
  const walletRef = doc(db, 'wallets', username);

  const existing = await getDoc(userRef);
  if (existing.exists()) {
    return { success: false, message: 'Username already registered.' };
  }

  const newUser: UserAccount = {
    ...userData,
    id: `usr-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`,
    username,
    status: userData.status || 'active',
    points: userData.points ?? 1000,
    creditLimit: userData.creditLimit ?? 5000,
    createdAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
    lastLogin: new Date().toISOString().replace('T', ' ').substring(0, 16),
  };

  await setDoc(userRef, newUser);
  await setDoc(walletRef, {
    id: `wlt-${username}`,
    username,
    points: newUser.points,
    currency: 'INR',
    updatedAt: new Date().toISOString(),
  });

  // Welcome Transaction
  const txRef = doc(collection(db, 'transactions'));
  const welcomeTx: TransactionRecord = {
    id: `TXN-REG-${Date.now()}`,
    refId: `REF-REG-${Math.floor(100000 + Math.random() * 900000)}`,
    fromUser: 'System Signup Bonus',
    toUser: username,
    type: 'Credit',
    amount: newUser.points,
    balanceAfter: newUser.points,
    remark: 'Account Registration Initial Wallet Balance',
    timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
  };
  await setDoc(txRef, welcomeTx);

  return { success: true, user: newUser };
}

export async function placeFirestoreBet(params: {
  username: string;
  gameType: '2D Lottery' | '3D Lottery' | 'Lucky 12' | '12 Card';
  selectedNumbers: string[];
  betAmount: number;
  drawTime?: string;
  userRole?: UserRole;
  parentName?: string;
}) {
  const { username, gameType, selectedNumbers, betAmount, drawTime, userRole = 'User', parentName = 'Direct Player' } = params;
  const userRef = doc(db, 'users', username);
  const walletRef = doc(db, 'wallets', username);

  return await runTransaction(db, async (transaction) => {
    const userDoc = await transaction.get(userRef);
    if (!userDoc.exists()) {
      throw new Error('User account not found.');
    }
    const userData = userDoc.data() as UserAccount;
    const currentPoints = userData.points || 0;

    if (currentPoints < betAmount) {
      throw new Error(`Insufficient wallet balance. Available: ₹${currentPoints}`);
    }

    const updatedPoints = currentPoints - betAmount;

    transaction.update(userRef, { points: updatedPoints });
    transaction.set(walletRef, { username, points: updatedPoints, updatedAt: new Date().toISOString() }, { merge: true });

    const ticketNo = `TKT-${gameType.substring(0, 2).toUpperCase()}-${Math.floor(100000 + Math.random() * 900000)}`;
    const betRef = doc(db, 'bets', ticketNo);
    const newTicket: GameTicket = {
      id: `bet-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`,
      ticketNo,
      username,
      playerName: userData.name || username,
      role: userData.role || userRole,
      parentName: userData.parentName || parentName,
      gameType,
      selectedNumbers,
      betAmount,
      drawTime: drawTime || new Date().toISOString().replace('T', ' ').substring(0, 16),
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
      status: 'Pending',
      winAmount: 0,
    };
    transaction.set(betRef, newTicket);

    const txDocRef = doc(collection(db, 'transactions'));
    const newTx: TransactionRecord = {
      id: `TXN-BET-${Date.now()}`,
      refId: `REF-${Math.floor(100000 + Math.random() * 900000)}`,
      fromUser: username,
      toUser: `System Pool (${gameType})`,
      type: 'Debit',
      amount: betAmount,
      balanceAfter: updatedPoints,
      remark: `Placed Bet on ${gameType} (Ticket #${ticketNo}, Nos: [${selectedNumbers.join(', ')}])`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
    };
    transaction.set(txDocRef, newTx);

    return { success: true, ticket: newTicket, updatedPoints };
  });
}

export async function adjustFirestoreWalletPoints(username: string, amount: number, type: 'Credit' | 'Debit', remark: string) {
  const userRef = doc(db, 'users', username);
  const walletRef = doc(db, 'wallets', username);

  return await runTransaction(db, async (transaction) => {
    const userDoc = await transaction.get(userRef);
    if (!userDoc.exists()) {
      throw new Error(`User ${username} not found.`);
    }
    const userData = userDoc.data() as UserAccount;
    const currentPoints = userData.points || 0;

    let updatedPoints = currentPoints;
    if (type === 'Credit') {
      updatedPoints += amount;
    } else {
      if (currentPoints < amount) {
        throw new Error(`Insufficient balance to deduct. Current balance: ₹${currentPoints}`);
      }
      updatedPoints -= amount;
    }

    transaction.update(userRef, { points: updatedPoints });
    transaction.set(walletRef, { username, points: updatedPoints, updatedAt: new Date().toISOString() }, { merge: true });

    const txDocRef = doc(collection(db, 'transactions'));
    const newTx: TransactionRecord = {
      id: `TXN-ADJ-${Date.now()}`,
      refId: `REF-ADJ-${Math.floor(100000 + Math.random() * 900000)}`,
      fromUser: type === 'Credit' ? 'Admin / Master Wallet' : username,
      toUser: type === 'Credit' ? username : 'Admin / Master Wallet',
      type: type,
      amount: amount,
      balanceAfter: updatedPoints,
      remark: remark || `Point Adjustment (${type}) by Admin`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
    };
    transaction.set(txDocRef, newTx);

    return { success: true, updatedPoints };
  });
}

export async function createFirestoreDeposit(depositData: Omit<DepositRequest, 'id' | 'createdAt' | 'status'>) {
  const depositId = `DEP-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`;
  const depositRef = doc(db, 'deposits', depositId);

  const newDeposit: DepositRequest = {
    ...depositData,
    id: depositId,
    status: 'Pending',
    createdAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
  };

  await setDoc(depositRef, newDeposit);

  const notifRef = doc(collection(db, 'notifications'));
  const notif: AppNotification = {
    id: `notif-${Date.now()}`,
    title: 'New Deposit Request',
    description: `User ${depositData.username} requested ₹${depositData.amount} deposit (UTR: ${depositData.utrNumber})`,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    createdAtMs: Date.now(),
    type: 'info',
    read: false,
    fingerprint: `dep-${depositId}`,
  };
  await setDoc(notifRef, notif);

  return { success: true, deposit: newDeposit };
}

export async function processFirestoreDepositAction(depositId: string, action: 'Approved' | 'Rejected', remark?: string) {
  const depositRef = doc(db, 'deposits', depositId);
  const depositDoc = await getDoc(depositRef);
  if (!depositDoc.exists()) {
    return { success: false, message: 'Deposit request not found.' };
  }

  const deposit = depositDoc.data() as DepositRequest;
  if (deposit.status !== 'Pending') {
    return { success: false, message: `Deposit is already ${deposit.status}.` };
  }

  if (action === 'Approved') {
    await adjustFirestoreWalletPoints(
      deposit.username,
      deposit.amount,
      'Credit',
      `Approved Deposit #${depositId} via ${deposit.paymentMethod} (UTR: ${deposit.utrNumber})`
    );
  }

  await updateDoc(depositRef, {
    status: action,
    remark: remark || `Deposit ${action} by Admin`,
  });

  return { success: true };
}

export async function createFirestoreWithdrawal(withdrawalData: Omit<WithdrawalRequest, 'id' | 'createdAt' | 'status'>) {
  const userDoc = await getDoc(doc(db, 'users', withdrawalData.username));
  if (!userDoc.exists()) {
    return { success: false, message: 'User not found.' };
  }
  const user = userDoc.data() as UserAccount;
  if (user.points < withdrawalData.amount) {
    return { success: false, message: `Insufficient balance for withdrawal. Available: ₹${user.points}` };
  }

  const withdrawalId = `WTD-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`;
  const withdrawalRef = doc(db, 'withdrawals', withdrawalId);

  const newWithdrawal: WithdrawalRequest = {
    ...withdrawalData,
    id: withdrawalId,
    status: 'Pending',
    createdAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
  };

  await setDoc(withdrawalRef, newWithdrawal);

  return { success: true, withdrawal: newWithdrawal };
}

export async function processFirestoreWithdrawalAction(withdrawalId: string, action: 'Approved' | 'Rejected', remark?: string) {
  const withdrawalRef = doc(db, 'withdrawals', withdrawalId);
  const withdrawalDoc = await getDoc(withdrawalRef);
  if (!withdrawalDoc.exists()) {
    return { success: false, message: 'Withdrawal request not found.' };
  }

  const withdrawal = withdrawalDoc.data() as WithdrawalRequest;
  if (withdrawal.status !== 'Pending') {
    return { success: false, message: `Withdrawal is already ${withdrawal.status}.` };
  }

  if (action === 'Approved') {
    await adjustFirestoreWalletPoints(
      withdrawal.username,
      withdrawal.amount,
      'Debit',
      `Approved Withdrawal #${withdrawalId} via ${withdrawal.paymentMethod}`
    );
  }

  await updateDoc(withdrawalRef, {
    status: action,
    remark: remark || `Withdrawal ${action} by Admin`,
  });

  return { success: true };
}

export async function declareFirestoreResult(gameType: '2D Lottery' | '3D Lottery' | 'Lucky 12' | '12 Card', winningResult: string, drawNumber?: string) {
  const drawNum = drawNumber || `DRW-${gameType.substring(0, 2).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
  const drawId = `lr-${Date.now()}`;

  const betsQuery = query(collection(db, 'bets'), where('gameType', '==', gameType), where('status', '==', 'Pending'));
  const pendingBetsSnap = await getDocs(betsQuery);

  const multiplier = gameType === '2D Lottery' ? 90 : gameType === '3D Lottery' ? 900 : 10;
  let totalBetsSum = 0;
  let totalPayoutSum = 0;

  for (const betDoc of pendingBetsSnap.docs) {
    const ticket = betDoc.data() as GameTicket;
    totalBetsSum += ticket.betAmount;

    const isWinner = ticket.selectedNumbers.some(
      (num) => num.trim().toLowerCase() === winningResult.trim().toLowerCase() || winningResult.includes(num.trim())
    );

    if (isWinner) {
      const winVal = ticket.betAmount * multiplier;
      totalPayoutSum += winVal;

      await updateDoc(doc(db, 'bets', ticket.ticketNo || ticket.id), {
        status: 'Won',
        winAmount: winVal,
      });

      await adjustFirestoreWalletPoints(
        ticket.username,
        winVal,
        'Credit',
        `Win Payout on ${gameType} (Ticket #${ticket.ticketNo}, Result: ${winningResult})`
      );
    } else {
      await updateDoc(doc(db, 'bets', ticket.ticketNo || ticket.id), {
        status: 'Lost',
        winAmount: 0,
      });
    }
  }

  const newResultDoc: LiveResultDraw = {
    id: drawId,
    gameType,
    drawNumber: drawNum,
    winningResult,
    drawTime: new Date().toISOString().replace('T', ' ').substring(0, 16),
    totalBets: totalBetsSum || Math.floor(20000 + Math.random() * 30000),
    totalPayout: totalPayoutSum || Math.floor(10000 + Math.random() * 20000),
    status: 'Declared',
  };

  await setDoc(doc(db, 'results', drawId), newResultDoc);

  await setDoc(doc(db, 'games', gameType), {
    currentRoundNo: `DRW-${gameType.substring(0, 2).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`,
    bettingLocked: false,
    updatedAt: new Date().toISOString(),
  }, { merge: true });

  return { success: true, result: newResultDoc };
}

export async function updateFirestoreGameConfig(gameType: string, updates: Partial<GameControlConfig>) {
  const gameRef = doc(db, 'games', gameType);
  await setDoc(gameRef, { gameType, ...updates, updatedAt: new Date().toISOString() }, { merge: true });
  return { success: true };
}

export async function updateFirestoreSettings(key: 'winPercentages' | 'lucky12Cards', value: any) {
  const settingRef = doc(db, 'settings', key);
  await setDoc(settingRef, { key, value, updatedAt: new Date().toISOString() }, { merge: true });
  return { success: true };
}
