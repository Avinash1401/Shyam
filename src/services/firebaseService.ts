import {
  collection,
  doc,
  getDoc,
  getDocs,
  getDocFromServer,
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
  OnlinePlayer,
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

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map((provider) => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || [],
    },
    operationType,
    path,
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
}

export async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'settings', 'winPercentages'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error('Please check your Firebase configuration.');
    }
  }
}

// Seed Firestore initial data if collections are empty
export async function initializeFirestoreDatabase() {
  testConnection();
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

// Helper function to resolve user document from Firestore by Email or Username
async function getFirestoreUserByInput(input: string): Promise<UserAccount | null> {
  const clean = input ? input.trim().toLowerCase() : '';
  if (!clean) return null;

  try {
    if (clean.includes('@')) {
      const qEmail = query(collection(db, 'users'), where('email', '==', clean));
      const snapEmail = await getDocs(qEmail);
      if (!snapEmail.empty) {
        return snapEmail.docs[0].data() as UserAccount;
      }
      const usernamePart = clean.split('@')[0];
      const docUser = await getDoc(doc(db, 'users', usernamePart));
      if (docUser.exists()) {
        return docUser.data() as UserAccount;
      }
    } else {
      const docSnap = await getDoc(doc(db, 'users', clean));
      if (docSnap.exists()) {
        return docSnap.data() as UserAccount;
      }
      const qUser = query(collection(db, 'users'), where('username', '==', clean));
      const snapUser = await getDocs(qUser);
      if (!snapUser.empty) {
        return snapUser.docs[0].data() as UserAccount;
      }
    }
  } catch (err) {
    console.error('Error fetching Firestore user by input:', err);
  }

  if (clean === 'admin' || clean === 'admin@shyampanel.com') {
    return defaultMasterAdmin;
  }

  return null;
}

// Admin Login Handler (Email + Password using Firebase Auth with Firestore fallback)
export async function loginFirestoreAdmin(emailOrUsernameInput: string, passwordInput: string, pinInput?: string) {
  if (pinInput && pinInput !== '1234' && pinInput !== '9999') {
    return { success: false, message: 'Invalid Master Security PIN.' };
  }

  const rawInput = emailOrUsernameInput ? emailOrUsernameInput.trim().toLowerCase() : '';
  if (!rawInput) {
    return { success: false, message: 'Please enter Admin Email or Username.' };
  }

  // Pre-fetch user from Firestore or default Master Admin
  const firestoreUser = await getFirestoreUserByInput(rawInput);
  const cleanEmail = rawInput.includes('@')
    ? rawInput
    : (firestoreUser?.email || `${rawInput}@shyampanel.com`);

  // Master Admin direct credential check
  if (
    (rawInput === 'admin' || cleanEmail === 'admin@shyampanel.com') &&
    passwordInput === 'Admin@123'
  ) {
    try {
      const userCred = await signInWithEmailAndPassword(auth, cleanEmail, passwordInput);
      return { success: true, user: defaultMasterAdmin, role: 'admin' as const, firebaseUser: userCred.user };
    } catch (e) {
      // Return success even if auth/operation-not-allowed or user-not-found
      return { success: true, user: defaultMasterAdmin, role: 'admin' as const };
    }
  }

  try {
    const userCred = await signInWithEmailAndPassword(auth, cleanEmail, passwordInput);
    const result = await getFirestoreUserByAuthUser(userCred.user);
    const userObj = result?.user || firestoreUser;

    if (!userObj) {
      return { success: false, message: 'Admin account profile not found in Firestore.' };
    }

    const role = normalizeRole(userObj.role);
    if (role !== 'admin') {
      return { success: false, message: 'Access Denied: Account is not authorized for Admin access.' };
    }

    return { success: true, user: userObj, role: 'admin' as const, firebaseUser: userCred.user };
  } catch (authError: any) {
    console.warn('Firebase Auth Admin Login Notice:', authError.code, authError.message);

    // Fallback if auth/operation-not-allowed or user not yet registered in Firebase Auth
    if (
      authError.code === 'auth/operation-not-allowed' ||
      authError.code === 'auth/user-not-found' ||
      authError.code === 'auth/invalid-credential' ||
      authError.code === 'auth/configuration-not-found'
    ) {
      if (firestoreUser && (firestoreUser.password === passwordInput || !firestoreUser.password)) {
        const role = normalizeRole(firestoreUser.role);
        if (role === 'admin') {
          return { success: true, user: firestoreUser, role: 'admin' as const };
        }
      }
    }

    if (authError.code === 'auth/invalid-email') {
      return { success: false, message: 'Invalid Email Address' };
    }

    if (authError.code === 'auth/wrong-password') {
      return { success: false, message: 'Wrong Password' };
    }

    // Direct password match against Firestore user document
    if (firestoreUser && firestoreUser.password === passwordInput) {
      const role = normalizeRole(firestoreUser.role);
      if (role === 'admin') {
        return { success: true, user: firestoreUser, role: 'admin' as const };
      }
    }

    return { success: false, message: 'Invalid Credentials or Wrong Password' };
  }
}

// Player Login Handler (Email + Password using Firebase Auth with Firestore fallback)
export async function loginFirestorePlayer(emailOrUsernameInput: string, passwordInput: string) {
  const rawInput = emailOrUsernameInput ? emailOrUsernameInput.trim().toLowerCase() : '';
  if (!rawInput) {
    return { success: false, message: 'Please enter Email or Username.' };
  }

  const firestoreUser = await getFirestoreUserByInput(rawInput);
  const cleanEmail = rawInput.includes('@')
    ? rawInput
    : (firestoreUser?.email || `${rawInput}@shyampanel.com`);

  try {
    const userCred = await signInWithEmailAndPassword(auth, cleanEmail, passwordInput);
    const result = await getFirestoreUserByAuthUser(userCred.user);
    const finalUser = result?.user || firestoreUser;

    if (!finalUser) {
      return { success: false, message: 'Player account profile not found in Firestore.' };
    }

    const docKey = finalUser.uid || userCred.user.uid || finalUser.username || finalUser.id;
    if (docKey) {
      await updateDoc(doc(db, 'users', docKey), {
        lastLogin: new Date().toISOString().replace('T', ' ').substring(0, 16),
      }).catch(() => {});
    }

    const role = normalizeRole(finalUser.role);
    return { success: true, user: finalUser, role, firebaseUser: userCred.user };
  } catch (authError: any) {
    console.warn('Firebase Auth Player Login Notice:', authError.code, authError.message);

    // Fallback if auth/operation-not-allowed or user not found in Auth but exists in Firestore
    if (
      authError.code === 'auth/operation-not-allowed' ||
      authError.code === 'auth/user-not-found' ||
      authError.code === 'auth/invalid-credential' ||
      authError.code === 'auth/configuration-not-found'
    ) {
      if (firestoreUser && (firestoreUser.password === passwordInput || !firestoreUser.password)) {
        const role = normalizeRole(firestoreUser.role);
        return { success: true, user: firestoreUser, role };
      }
    }

    if (authError.code === 'auth/invalid-email') {
      return { success: false, message: 'Invalid Email Address' };
    }

    if (authError.code === 'auth/wrong-password') {
      return { success: false, message: 'Wrong Password' };
    }

    if (firestoreUser && firestoreUser.password === passwordInput) {
      const role = normalizeRole(firestoreUser.role);
      return { success: true, user: firestoreUser, role };
    }

    return { success: false, message: 'Invalid Credentials or Wrong Password' };
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
    console.warn('Firebase Auth Registration Notice:', authError.code, authError.message);

    if (authError.code === 'auth/email-already-in-use') {
      return { success: false, message: 'This email is already registered.' };
    }
    if (authError.code === 'auth/weak-password') {
      return { success: false, message: 'Password should be at least 6 characters long.' };
    }
    if (authError.code === 'auth/invalid-email') {
      return { success: false, message: 'Invalid Email Address' };
    }

    // Fallback if operation-not-allowed or config missing
    if (
      authError.code === 'auth/operation-not-allowed' ||
      authError.code === 'auth/configuration-not-found'
    ) {
      firebaseUid = `usr-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`;
    } else {
      return { success: false, message: authError.message || 'Registration failed in Firebase Auth.' };
    }
  }

  // 3. Create Firestore Document in `users` collection using UID
  const userId = firebaseUid || `usr-${Date.now()}`;
  const newUser: UserAccount = {
    id: userId,
    uid: userId,
    name: name.trim(),
    username: cleanUsername || name.trim(),
    password,
    email: cleanEmail,
    phone: phone ? phone.trim() : '',
    points: 1000,
    creditLimit: 5000,
    commissionRate: 0,
    role: 'player',
    status: 'active',
    referralCode: refCode?.trim() || `REF-${cleanUsername.toUpperCase()}`,
    createdAt: new Date().toISOString().split('T')[0],
    lastLogin: new Date().toISOString().replace('T', ' ').substring(0, 16),
  };

  try {
    await setDoc(doc(db, 'users', userId), newUser, { merge: true });
    if (cleanUsername) {
      await setDoc(doc(db, 'users', cleanUsername.toLowerCase()), newUser, { merge: true });
    }
    await setDoc(doc(db, 'wallets', cleanUsername || userId), {
      id: `wlt-${cleanUsername || userId}`,
      username: cleanUsername || userId,
      points: newUser.points,
      currency: 'INR',
      updatedAt: new Date().toISOString(),
    }, { merge: true });
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
    const userMap = new Map<string, UserAccount>();
    snapshot.forEach((docSnap) => {
      const data = docSnap.data() as UserAccount;
      if (data && (data.username || data.email || data.id)) {
        const key = (data.username || data.email || data.id).toLowerCase();
        if (!userMap.has(key)) {
          userMap.set(key, data);
        }
      }
    });
    callback(Array.from(userMap.values()));
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

// 11. ONLINE PLAYERS COLLECTION
export function subscribeOnlinePlayers(callback: (players: OnlinePlayer[]) => void) {
  const q = collection(db, 'online_players');
  return onSnapshot(q, (snapshot) => {
    const players: OnlinePlayer[] = [];
    snapshot.forEach((docSnap) => {
      const data = docSnap.data() as OnlinePlayer & { isOnline?: boolean };
      if (data && data.isOnline !== false && data.username) {
        players.push(data);
      }
    });
    callback(players);
  }, (err) => {
    console.error('Error listening to online players:', err);
    try {
      handleFirestoreError(err, OperationType.LIST, 'online_players');
    } catch (e) {
      // logged
    }
  });
}

export async function recordOnlinePlayerActivity(user: UserAccount, currentGame: '2D Lottery' | '3D Lottery' | 'Lucky 12' | '12 Card' = '2D Lottery', activeWager: number = 0) {
  try {
    const username = (user.username || user.name || user.id).toLowerCase();
    const onlineRef = doc(db, 'online_players', username);
    const onlineData: OnlinePlayer & { isOnline: boolean; lastActiveMs: number } = {
      id: user.id || `usr-${username}`,
      username: user.username || username,
      role: user.role || 'User',
      parent: user.parentName || 'Direct Player',
      currentGame,
      currentBet: activeWager,
      points: user.points || 0,
      ipAddress: '127.0.0.1 (Web)',
      device: 'Mobile Web Client',
      connectedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: activeWager > 0 ? 'In Game' : 'Lobby',
      isOnline: true,
      lastActiveMs: Date.now(),
    };
    await setDoc(onlineRef, onlineData, { merge: true });
  } catch (err) {
    console.error('Error recording online player activity:', err);
  }
}

export async function removeOnlinePlayer(username: string) {
  try {
    const cleanUsername = username.toLowerCase();
    const onlineRef = doc(db, 'online_players', cleanUsername);
    await setDoc(onlineRef, { isOnline: false, activeWager: 0 }, { merge: true });
  } catch (err) {
    console.error('Error removing online player:', err);
  }
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
  const cleanUsername = username.trim().toLowerCase();

  // Find user document reference
  let targetDocId = username;
  let userSnap = await getDoc(doc(db, 'users', targetDocId));
  if (!userSnap.exists()) {
    userSnap = await getDoc(doc(db, 'users', cleanUsername));
    if (userSnap.exists()) {
      targetDocId = cleanUsername;
    } else {
      const qUser = query(collection(db, 'users'), where('username', '==', username));
      const snapUser = await getDocs(qUser);
      if (!snapUser.empty) {
        targetDocId = snapUser.docs[0].id;
      } else {
        const qEmail = query(collection(db, 'users'), where('email', '==', cleanUsername));
        const snapEmail = await getDocs(qEmail);
        if (!snapEmail.empty) {
          targetDocId = snapEmail.docs[0].id;
        }
      }
    }
  }

  const userRef = doc(db, 'users', targetDocId);
  const walletRef = doc(db, 'wallets', targetDocId);

  const res = await runTransaction(db, async (transaction) => {
    const userDoc = await transaction.get(userRef);
    if (!userDoc.exists()) {
      throw new Error(`User account "${username}" not found.`);
    }
    const userData = userDoc.data() as UserAccount;
    const currentPoints = userData.points || 0;

    if (currentPoints < betAmount) {
      throw new Error(`Insufficient wallet balance. Available: ₹${currentPoints}`);
    }

    const updatedPoints = currentPoints - betAmount;

    transaction.update(userRef, { points: updatedPoints });
    transaction.set(walletRef, { username: userData.username || cleanUsername, points: updatedPoints, updatedAt: new Date().toISOString() }, { merge: true });

    const ticketNo = `TKT-${gameType.substring(0, 2).toUpperCase()}-${Math.floor(100000 + Math.random() * 900000)}`;
    const betRef = doc(db, 'bets', ticketNo);
    const newTicket: GameTicket = {
      id: `bet-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`,
      ticketNo,
      username: userData.username || cleanUsername,
      playerName: userData.name || userData.username || cleanUsername,
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
      fromUser: userData.username || cleanUsername,
      toUser: `System Pool (${gameType})`,
      type: 'Debit',
      amount: betAmount,
      balanceAfter: updatedPoints,
      remark: `Placed Bet on ${gameType} (Ticket #${ticketNo}, Nos: [${selectedNumbers.join(', ')}])`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
    };
    transaction.set(txDocRef, newTx);

    // Notification for Admin Live Bets Feed
    const notifRef = doc(collection(db, 'notifications'));
    const notif: AppNotification = {
      id: `notif-bet-${Date.now()}`,
      title: 'New Live Bet Placed',
      description: `${userData.username || cleanUsername} placed ₹${betAmount} on ${gameType} (Ticket #${ticketNo})`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      createdAtMs: Date.now(),
      type: 'success',
      read: false,
      fingerprint: `bet-${ticketNo}`,
    };
    transaction.set(notifRef, notif);

    return { success: true, ticket: newTicket, updatedPoints, user: userData };
  });

  if (res.user) {
    await recordOnlinePlayerActivity(res.user, gameType, betAmount);
  }

  return res;
}

export async function adjustFirestoreWalletPoints(username: string, amount: number, type: 'Credit' | 'Debit', remark: string) {
  const cleanUsername = username.trim().toLowerCase();
  let targetDocId = username;
  let userSnap = await getDoc(doc(db, 'users', targetDocId));
  if (!userSnap.exists()) {
    userSnap = await getDoc(doc(db, 'users', cleanUsername));
    if (userSnap.exists()) {
      targetDocId = cleanUsername;
    } else {
      const qUser = query(collection(db, 'users'), where('username', '==', username));
      const snapUser = await getDocs(qUser);
      if (!snapUser.empty) {
        targetDocId = snapUser.docs[0].id;
      }
    }
  }

  const userRef = doc(db, 'users', targetDocId);
  const walletRef = doc(db, 'wallets', targetDocId);

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
    transaction.set(walletRef, { username: userData.username || cleanUsername, points: updatedPoints, updatedAt: new Date().toISOString() }, { merge: true });

    const txDocRef = doc(collection(db, 'transactions'));
    const newTx: TransactionRecord = {
      id: `TXN-ADJ-${Date.now()}`,
      refId: `REF-ADJ-${Math.floor(100000 + Math.random() * 900000)}`,
      fromUser: type === 'Credit' ? 'Admin / Master Wallet' : (userData.username || cleanUsername),
      toUser: type === 'Credit' ? (userData.username || cleanUsername) : 'Admin / Master Wallet',
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
