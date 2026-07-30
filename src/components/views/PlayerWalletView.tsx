import React, { useState } from 'react';
import { useAdmin } from '../../context/AdminContext';
import {
  Wallet,
  ArrowDownRight,
  ArrowUpRight,
  CreditCard,
  QrCode,
  Building,
  CheckCircle2,
  Clock,
  XCircle,
  ShieldCheck,
  AlertCircle,
  Receipt,
  Sparkles,
} from 'lucide-react';

export const PlayerWalletView: React.FC = () => {
  const {
    currentUser,
    depositRequests,
    withdrawalRequests,
    submitDepositRequest,
    submitWithdrawalRequest,
    addToast,
  } = useAdmin();

  const [activeTab, setActiveTab] = useState<'deposit' | 'withdraw' | 'history'>('deposit');

  // Deposit Form
  const [depAmount, setDepAmount] = useState<number>(1000);
  const [depMethod, setDepMethod] = useState<'UPI' | 'Bank Transfer' | 'Crypto'>('UPI');
  const [depUtr, setDepUtr] = useState<string>('');

  // Withdrawal Form
  const [wdAmount, setWdAmount] = useState<number>(500);
  const [wdMethod, setWdMethod] = useState<'UPI' | 'Bank Transfer'>('UPI');
  const [wdAccount, setWdAccount] = useState<string>('');

  const myDeposits = depositRequests.filter((d) => d.username === currentUser?.username);
  const myWithdrawals = withdrawalRequests.filter((w) => w.username === currentUser?.username);

  const handleDepositSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (depAmount < 100) {
      addToast('Minimum Deposit', 'Minimum deposit amount is ₹100.', 'error');
      return;
    }
    if (!depUtr.trim()) {
      addToast('UTR Required', 'Please enter transaction reference / UTR number.', 'error');
      return;
    }

    const success = submitDepositRequest(depAmount, depMethod, depUtr.trim());
    if (success) {
      setDepUtr('');
      setActiveTab('history');
    }
  };

  const handleWithdrawalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (wdAmount < 300) {
      addToast('Minimum Withdrawal', 'Minimum withdrawal amount is ₹300.', 'error');
      return;
    }
    if (!wdAccount.trim()) {
      addToast('Account Details Required', 'Please enter your UPI ID or Bank account details.', 'error');
      return;
    }

    const success = submitWithdrawalRequest(wdAmount, wdMethod, wdAccount.trim());
    if (success) {
      setWdAccount('');
      setActiveTab('history');
    }
  };

  return (
    <div className="space-y-6 animate-slide-in pb-12">
      {/* Wallet Balance Hero Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-cyan-950/60 border border-slate-800 p-6 rounded-3xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/20 shrink-0">
            <Wallet className="w-7 h-7" />
          </div>
          <div>
            <span className="text-xs uppercase font-extrabold text-slate-400 block tracking-wider">
              Available Wallet Balance
            </span>
            <div className="text-3xl font-black text-white font-mono mt-0.5 flex items-center gap-2">
              <span>₹{(currentUser?.points || 0).toLocaleString()}</span>
              <span className="text-xs font-bold text-emerald-400 bg-emerald-950/80 px-2.5 py-0.5 rounded-full border border-emerald-800">
                ACTIVE
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">Instant Deposit & Automated Withdrawal Processing</p>
          </div>
        </div>

        {/* Quick Action Tabs */}
        <div className="flex bg-slate-950 p-1.5 rounded-2xl border border-slate-800 text-xs font-bold">
          <button
            onClick={() => setActiveTab('deposit')}
            className={`px-4 py-2.5 rounded-xl flex items-center gap-2 transition-all ${
              activeTab === 'deposit'
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <ArrowDownRight className="w-4 h-4" />
            <span>Deposit</span>
          </button>

          <button
            onClick={() => setActiveTab('withdraw')}
            className={`px-4 py-2.5 rounded-xl flex items-center gap-2 transition-all ${
              activeTab === 'withdraw'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <ArrowUpRight className="w-4 h-4" />
            <span>Withdraw</span>
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`px-4 py-2.5 rounded-xl flex items-center gap-2 transition-all ${
              activeTab === 'history'
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Receipt className="w-4 h-4" />
            <span>Request History</span>
          </button>
        </div>
      </div>

      {/* TAB 1: DEPOSIT REQUEST FORM */}
      {activeTab === 'deposit' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <ArrowDownRight className="w-5 h-5 text-emerald-400" />
                <span>Add Points to Wallet (Deposit Request)</span>
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Select your payment method, scan QR / pay to UPI/Bank details, and enter UTR reference number for quick approval.
              </p>
            </div>

            <form onSubmit={handleDepositSubmit} className="space-y-5">
              {/* Preset Amount Selectors */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-2">Select Deposit Amount (₹)</label>
                <div className="grid grid-cols-4 gap-2 mb-3">
                  {[500, 1000, 2000, 5000].map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setDepAmount(amt)}
                      className={`py-2 rounded-xl border text-xs font-bold font-mono transition-all ${
                        depAmount === amt
                          ? 'bg-emerald-950 text-emerald-300 border-emerald-500'
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
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white font-mono font-bold focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Payment Method Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-2">Payment Gateway Method</label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: 'UPI', label: 'UPI / GPay / PhonePe', icon: QrCode },
                    { id: 'Bank Transfer', label: 'IMPS / NEFT Bank', icon: Building },
                    { id: 'Crypto', label: 'USDT / Crypto', icon: CreditCard },
                  ].map((m) => {
                    const IconComp = m.icon;
                    return (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => setDepMethod(m.id as any)}
                        className={`p-3 rounded-2xl border text-left flex flex-col items-center justify-center gap-2 transition-all ${
                          depMethod === m.id
                            ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300'
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

              {/* Transaction Reference / UTR Number */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Transaction UTR / Reference ID</label>
                <input
                  type="text"
                  required
                  placeholder="Enter 12-digit UTR Number after completing payment"
                  value={depUtr}
                  onChange={(e) => setDepUtr(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white font-mono uppercase focus:outline-none focus:border-emerald-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2"
              >
                <span>Submit Deposit Request</span>
                <Sparkles className="w-4 h-4" />
              </button>
            </form>
          </div>

          {/* Payment QR / Bank Details Box */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <QrCode className="w-4 h-4 text-cyan-400" />
              <span>System Deposit Gateway</span>
            </h3>

            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-center space-y-3">
              <div className="w-36 h-36 mx-auto bg-white p-2 rounded-2xl flex items-center justify-center shadow-md">
                <QrCode className="w-28 h-28 text-slate-900" />
              </div>
              <p className="text-[11px] text-slate-400">Scan QR or Copy Official UPI ID below</p>
              <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800 text-xs font-mono font-bold text-cyan-300">
                shyamgaming.pay@upi
              </div>
            </div>

            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2 text-xs">
              <span className="font-bold text-slate-300 block">Bank Account Details:</span>
              <p className="text-slate-400">Bank: HDFC Bank Ltd</p>
              <p className="text-slate-400">Account: 5020008891204</p>
              <p className="text-slate-400">IFSC: HDFC0001234</p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: WITHDRAWAL REQUEST FORM */}
      {activeTab === 'withdraw' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl max-w-2xl mx-auto space-y-6">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <ArrowUpRight className="w-5 h-5 text-amber-400" />
              <span>Withdraw Points to Bank/UPI</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Minimum withdrawal is ₹300. Payouts are processed directly by Master Admin.
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
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white font-mono font-bold focus:outline-none focus:border-amber-500"
              />
              <span className="text-[10px] text-slate-500 mt-1 block">
                Available Wallet Points: ₹{(currentUser?.points || 0).toLocaleString()}
              </span>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-2">Payout Method</label>
              <div className="grid grid-cols-2 gap-3">
                {['UPI', 'Bank Transfer'].map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setWdMethod(m as any)}
                    className={`p-3 rounded-2xl border text-center font-bold text-xs transition-all ${
                      wdMethod === m
                        ? 'bg-amber-950/80 border-amber-500 text-amber-300'
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
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-amber-500/20 transition-all"
            >
              Request Payout
            </button>
          </form>
        </div>
      )}

      {/* TAB 3: REQUEST HISTORY */}
      {activeTab === 'history' && (
        <div className="space-y-6">
          {/* Deposit Requests */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <ArrowDownRight className="w-4 h-4 text-emerald-400" />
              <span>My Deposit Requests</span>
            </h3>

            {myDeposits.length === 0 ? (
              <p className="text-xs text-slate-500 py-4 text-center">No deposit requests submitted yet.</p>
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

          {/* Withdrawal Requests */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <ArrowUpRight className="w-4 h-4 text-amber-400" />
              <span>My Withdrawal Requests</span>
            </h3>

            {myWithdrawals.length === 0 ? (
              <p className="text-xs text-slate-500 py-4 text-center">No withdrawal requests submitted yet.</p>
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
    </div>
  );
};
