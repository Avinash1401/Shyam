import React, { useState } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { soundManager } from '../../utils/sound';
import { motion, AnimatePresence } from 'motion/react';
import {
  Wallet,
  ArrowDownRight,
  ArrowUpRight,
  CreditCard,
  QrCode,
  Building,
  CheckCircle2,
  Clock,
  Receipt,
  Sparkles,
  Trophy,
  History,
  ShieldCheck,
  Zap,
} from 'lucide-react';

export const PlayerWalletView: React.FC = () => {
  const {
    currentUser,
    playerSession,
    depositRequests,
    withdrawalRequests,
    gameTickets,
    submitDepositRequest,
    submitWithdrawalRequest,
    addToast,
  } = useAdmin();

  const [activeTab, setActiveTab] = useState<'deposit' | 'withdraw' | 'history' | 'winning'>('deposit');

  // Active player username
  const activeUser = playerSession?.isLoggedIn && playerSession.user ? playerSession.user : currentUser;
  const activeUsername = activeUser?.username || '';

  // Deposit Form
  const [depAmount, setDepAmount] = useState<number>(1000);
  const [depMethod, setDepMethod] = useState<'UPI' | 'Bank Transfer' | 'Crypto'>('UPI');
  const [depUtr, setDepUtr] = useState<string>('');

  // Withdrawal Form
  const [wdAmount, setWdAmount] = useState<number>(500);
  const [wdMethod, setWdMethod] = useState<'UPI' | 'Bank Transfer'>('UPI');
  const [wdAccount, setWdAccount] = useState<string>('');

  const myDeposits = depositRequests.filter((d) => d.username.toLowerCase() === activeUsername.toLowerCase());
  const myWithdrawals = withdrawalRequests.filter((w) => w.username.toLowerCase() === activeUsername.toLowerCase());
  const myWinningTickets = gameTickets.filter(
    (t) => t.username.toLowerCase() === activeUsername.toLowerCase() && (t.status === 'Won' || t.winAmount > 0)
  );

  const handleDepositSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    soundManager.playClick();
    if (depAmount < 100) {
      addToast('Minimum Deposit', 'Minimum deposit amount is ₹100.', 'error');
      return;
    }
    if (!depUtr.trim()) {
      addToast('UTR Required', 'Please enter transaction reference / UTR number.', 'error');
      return;
    }

    const success = await submitDepositRequest(depAmount, depMethod, depUtr.trim());
    if (success) {
      soundManager.playBetSuccess();
      setDepUtr('');
      setActiveTab('history');
    }
  };

  const handleWithdrawalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    soundManager.playClick();
    if (wdAmount < 300) {
      addToast('Minimum Withdrawal', 'Minimum withdrawal amount is ₹300.', 'error');
      return;
    }
    if (!wdAccount.trim()) {
      addToast('Account Details Required', 'Please enter your UPI ID or Bank account details.', 'error');
      return;
    }

    const success = await submitWithdrawalRequest(wdAmount, wdMethod, wdAccount.trim());
    if (success) {
      soundManager.playBetSuccess();
      setWdAccount('');
      setActiveTab('history');
    }
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Wallet Balance Hero Header */}
      <div className="bg-slate-900/90 border border-slate-800/80 p-6 sm:p-8 rounded-3xl backdrop-blur-2xl shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center gap-5 relative z-10">
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-cyan-500 p-0.5 shadow-xl shadow-emerald-500/20 shrink-0">
            <div className="w-full h-full bg-slate-950 rounded-[22px] flex items-center justify-center text-emerald-400">
              <Wallet className="w-8 h-8 animate-pulse" />
            </div>
          </div>
          <div>
            <span className="text-xs uppercase font-extrabold text-slate-400 block tracking-widest">
              Available Wallet Balance
            </span>
            <div className="text-3xl sm:text-4xl font-black text-white font-mono mt-0.5 flex items-center gap-3">
              <span>₹{(activeUser?.points || 0).toLocaleString('en-IN')}</span>
              <span className="text-[10px] font-black text-emerald-400 bg-emerald-950/90 px-3 py-1 rounded-full border border-emerald-500/30 tracking-wider uppercase">
                ACTIVE
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">Instant Deposit & Automated Payout System</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex bg-slate-950/80 p-1.5 rounded-2xl border border-slate-800 text-xs font-bold gap-1 relative z-10 overflow-x-auto">
          {[
            { id: 'deposit', label: 'Deposit', icon: ArrowDownRight, color: 'emerald' },
            { id: 'withdraw', label: 'Withdraw', icon: ArrowUpRight, color: 'amber' },
            { id: 'history', label: 'Transaction History', icon: Receipt, color: 'cyan' },
            { id: 'winning', label: 'Winning History', icon: Trophy, color: 'purple' },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => {
                  soundManager.playClick();
                  setActiveTab(tab.id as any);
                }}
                className={`relative px-4 py-2.5 rounded-xl font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/20 font-black'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.2 }}
        >
          {/* TAB 1: DEPOSIT */}
          {activeTab === 'deposit' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 backdrop-blur-2xl shadow-2xl space-y-6">
                <div>
                  <h2 className="text-base font-black text-white flex items-center gap-2">
                    <ArrowDownRight className="w-5 h-5 text-emerald-400" />
                    <span>Deposit Funds to Wallet</span>
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Select deposit amount, pay via UPI/Bank details, and enter your 12-digit UTR reference ID.
                  </p>
                </div>

                <form onSubmit={handleDepositSubmit} className="space-y-5">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-2">Select Deposit Amount (₹)</label>
                    <div className="grid grid-cols-4 gap-2.5 mb-3">
                      {[500, 1000, 2000, 5000].map((amt) => (
                        <button
                          key={amt}
                          type="button"
                          onClick={() => {
                            soundManager.playClick();
                            setDepAmount(amt);
                          }}
                          className={`py-2.5 rounded-2xl border text-xs font-black font-mono transition-all ${
                            depAmount === amt
                              ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-md shadow-emerald-500/20'
                              : 'bg-slate-950 text-slate-300 border-slate-800 hover:bg-slate-800'
                          }`}
                        >
                          ₹{amt.toLocaleString()}
                        </button>
                      ))}
                    </div>

                    <input
                      type="number"
                      min={100}
                      required
                      value={depAmount}
                      onChange={(e) => setDepAmount(Number(e.target.value))}
                      className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3 text-sm text-white font-mono font-black focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-2">Payment Method</label>
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { id: 'UPI', label: 'UPI / GPay / PhonePe', icon: QrCode },
                        { id: 'Bank Transfer', label: 'IMPS / NEFT Bank', icon: Building },
                        { id: 'Crypto', label: 'USDT / Crypto', icon: CreditCard },
                      ].map((m) => {
                        const IconComp = m.icon;
                        const isSel = depMethod === m.id;
                        return (
                          <button
                            key={m.id}
                            type="button"
                            onClick={() => {
                              soundManager.playClick();
                              setDepMethod(m.id as any);
                            }}
                            className={`p-3.5 rounded-2xl border text-left flex flex-col items-center justify-center gap-2 transition-all ${
                              isSel
                                ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300 shadow-lg shadow-emerald-500/10'
                                : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                            }`}
                          >
                            <IconComp className="w-5 h-5 text-emerald-400" />
                            <span className="text-[11px] font-bold text-center leading-tight">{m.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Transaction UTR / Reference ID</label>
                    <input
                      type="text"
                      required
                      placeholder="Enter 12-digit UTR Number after completing payment"
                      value={depUtr}
                      onChange={(e) => setDepUtr(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3 text-xs text-white font-mono uppercase focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 text-slate-950 font-black text-sm uppercase tracking-wider shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2"
                  >
                    <span>Submit Deposit Request</span>
                    <Sparkles className="w-4 h-4" />
                  </motion.button>
                </form>
              </div>

              {/* QR / Bank Info */}
              <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 backdrop-blur-2xl shadow-2xl space-y-4">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <QrCode className="w-4 h-4 text-cyan-400" />
                  <span>Official Deposit Gateway</span>
                </h3>

                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-center space-y-3">
                  <div className="w-36 h-36 mx-auto bg-white p-2 rounded-2xl flex items-center justify-center shadow-md">
                    <QrCode className="w-28 h-28 text-slate-900" />
                  </div>
                  <p className="text-[11px] text-slate-400">Scan QR or Copy Official UPI ID</p>
                  <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800 text-xs font-mono font-bold text-cyan-300">
                    shyamgaming.pay@upi
                  </div>
                </div>

                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2 text-xs">
                  <span className="font-bold text-slate-300 block">Bank Details:</span>
                  <p className="text-slate-400">Bank: HDFC Bank Ltd</p>
                  <p className="text-slate-400">Account: 5020008891204</p>
                  <p className="text-slate-400">IFSC: HDFC0001234</p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: WITHDRAW */}
          {activeTab === 'withdraw' && (
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 backdrop-blur-2xl shadow-2xl max-w-2xl mx-auto space-y-6">
              <div>
                <h2 className="text-base font-black text-white flex items-center gap-2">
                  <ArrowUpRight className="w-5 h-5 text-amber-400" />
                  <span>Withdrawal Payout Request</span>
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Minimum withdrawal is ₹300. Processing times usually range from 5 to 30 minutes.
                </p>
              </div>

              <form onSubmit={handleWithdrawalSubmit} className="space-y-5">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Withdrawal Amount (₹)</label>
                  <input
                    type="number"
                    min={300}
                    required
                    value={wdAmount}
                    onChange={(e) => setWdAmount(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3 text-sm text-white font-mono font-bold focus:outline-none focus:border-amber-500"
                  />
                  <span className="text-[10px] text-slate-500 mt-1 block">
                    Available Wallet Points: ₹{(activeUser?.points || 0).toLocaleString()}
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-2">Payout Method</label>
                  <div className="grid grid-cols-2 gap-3">
                    {['UPI', 'Bank Transfer'].map((m) => (
                      <button
                        key={m}
                        type="button"
                        onClick={() => {
                          soundManager.playClick();
                          setWdMethod(m as any);
                        }}
                        className={`p-3.5 rounded-2xl border text-center font-bold text-xs transition-all ${
                          wdMethod === m
                            ? 'bg-amber-950/80 border-amber-500 text-amber-300 shadow-md shadow-amber-500/10'
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        {m} Payout
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">UPI ID or Bank Account Details</label>
                  <textarea
                    rows={2}
                    required
                    placeholder="e.g. user@upi (GPay) OR Bank Name, Account Number, IFSC Code"
                    value={wdAccount}
                    onChange={(e) => setWdAccount(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-3.5 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600 text-slate-950 font-black text-sm uppercase tracking-wider shadow-lg shadow-amber-500/20 transition-all"
                >
                  Request Payout Now
                </motion.button>
              </form>
            </div>
          )}

          {/* TAB 3: TRANSACTION HISTORY */}
          {activeTab === 'history' && (
            <div className="space-y-6">
              {/* Deposit History */}
              <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 backdrop-blur-2xl shadow-2xl space-y-4">
                <h3 className="text-sm font-black text-white flex items-center gap-2">
                  <ArrowDownRight className="w-4 h-4 text-emerald-400" />
                  <span>My Deposit History</span>
                </h3>

                {myDeposits.length === 0 ? (
                  <p className="text-xs text-slate-500 py-6 text-center">No deposit requests submitted yet.</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
                        <tr>
                          <th className="p-3">Req ID</th>
                          <th className="p-3">Amount</th>
                          <th className="p-3">Method</th>
                          <th className="p-3">UTR / Ref</th>
                          <th className="p-3">Status</th>
                          <th className="p-3">Date</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800">
                        {myDeposits.map((d) => (
                          <tr key={d.id} className="hover:bg-slate-800/40">
                            <td className="p-3 font-mono font-bold text-white">{d.id}</td>
                            <td className="p-3 font-mono text-emerald-400 font-bold">₹{d.amount.toLocaleString()}</td>
                            <td className="p-3 text-slate-300">{d.paymentMethod}</td>
                            <td className="p-3 font-mono text-slate-400">{d.utrNumber}</td>
                            <td className="p-3">
                              <span
                                className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                                  d.status === 'Approved'
                                    ? 'bg-emerald-950 text-emerald-400 border-emerald-800'
                                    : d.status === 'Rejected'
                                    ? 'bg-rose-950 text-rose-400 border-rose-800'
                                    : 'bg-amber-950 text-amber-400 border-amber-800 animate-pulse'
                                }`}
                              >
                                {d.status}
                              </span>
                            </td>
                            <td className="p-3 text-slate-500 font-mono text-[11px]">{d.createdAt}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Withdrawal History */}
              <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 backdrop-blur-2xl shadow-2xl space-y-4">
                <h3 className="text-sm font-black text-white flex items-center gap-2">
                  <ArrowUpRight className="w-4 h-4 text-amber-400" />
                  <span>My Withdrawal History</span>
                </h3>

                {myWithdrawals.length === 0 ? (
                  <p className="text-xs text-slate-500 py-6 text-center">No withdrawal requests submitted yet.</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
                        <tr>
                          <th className="p-3">Req ID</th>
                          <th className="p-3">Amount</th>
                          <th className="p-3">Method</th>
                          <th className="p-3">Account Details</th>
                          <th className="p-3">Status</th>
                          <th className="p-3">Date</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800">
                        {myWithdrawals.map((w) => (
                          <tr key={w.id} className="hover:bg-slate-800/40">
                            <td className="p-3 font-mono font-bold text-white">{w.id}</td>
                            <td className="p-3 font-mono text-amber-400 font-bold">₹{w.amount.toLocaleString()}</td>
                            <td className="p-3 text-slate-300">{w.paymentMethod}</td>
                            <td className="p-3 text-slate-400">{w.accountDetails}</td>
                            <td className="p-3">
                              <span
                                className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                                  w.status === 'Approved'
                                    ? 'bg-emerald-950 text-emerald-400 border-emerald-800'
                                    : w.status === 'Rejected'
                                    ? 'bg-rose-950 text-rose-400 border-rose-800'
                                    : 'bg-amber-950 text-amber-400 border-amber-800'
                                }`}
                              >
                                {w.status}
                              </span>
                            </td>
                            <td className="p-3 text-slate-500 font-mono text-[11px]">{w.createdAt}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 4: WINNING HISTORY */}
          {activeTab === 'winning' && (
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 backdrop-blur-2xl shadow-2xl space-y-4">
              <h3 className="text-sm font-black text-white flex items-center gap-2">
                <Trophy className="w-5 h-5 text-amber-400" />
                <span>My Winning Tickets Ledger</span>
              </h3>

              {myWinningTickets.length === 0 ? (
                <div className="text-center py-12 space-y-2">
                  <Trophy className="w-12 h-12 text-slate-700 mx-auto" />
                  <p className="text-xs text-slate-500">No winning records yet. Place bets on games to win!</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {myWinningTickets.map((tkt) => (
                    <div
                      key={tkt.id}
                      className="p-4 rounded-2xl bg-slate-950/80 border border-emerald-500/30 flex items-center justify-between gap-4 shadow-lg shadow-emerald-500/5"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-cyan-400">#{tkt.ticketNo}</span>
                          <span className="text-xs font-black text-white">{tkt.gameType}</span>
                        </div>
                        <span className="text-xs font-mono text-slate-400 mt-1 block">
                          Numbers: {tkt.selectedNumbers.join(', ')}
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono">{tkt.createdAt}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-xs text-slate-400 block">Wager: ₹{tkt.betAmount}</span>
                        <span className="text-lg font-black text-emerald-400 font-mono">
                          +₹{tkt.winAmount.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </motion.div>
      </AnimatePresence>

    </div>
  );
};
