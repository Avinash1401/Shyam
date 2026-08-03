import React, { useState } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { UserAccount, UserRole } from '../../types';
import {
  Users,
  UserCheck,
  UserPlus,
  User,
  Plus,
  Search,
  Lock,
  Unlock,
  Coins,
  Edit2,
  Trash2,
  X,
  Phone,
  Mail,
  Shield,
  Layers,
  ArrowDownRight,
  ArrowUpRight,
} from 'lucide-react';

interface ManagementViewProps {
  role: UserRole;
}

export const ManagementView: React.FC<ManagementViewProps> = ({ role }) => {
  const {
    superDistributers,
    distributers,
    retailers,
    users,
    searchTerm,
    currentUser,
    addUserAccount,
    updateUserAccount,
    adjustPoints,
    toggleUserStatus,
  } = useAdmin();

  // Selected list based on role
  const getAccountList = (): UserAccount[] => {
    switch (role) {
      case 'SuperDistributer':
        return superDistributers;
      case 'Distributer':
        return distributers;
      case 'Retailer':
        return retailers;
      case 'User':
      default:
        return users;
    }
  };

  const accountList = getAccountList();

  // Search & Filter
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'blocked'>('all');
  const [localSearch, setLocalSearch] = useState('');

  const activeSearch = searchTerm || localSearch;

  const filteredAccounts = accountList.filter((acc) => {
    const matchesSearch =
      acc.name.toLowerCase().includes(activeSearch.toLowerCase()) ||
      acc.username.toLowerCase().includes(activeSearch.toLowerCase()) ||
      (acc.parentName && acc.parentName.toLowerCase().includes(activeSearch.toLowerCase())) ||
      (acc.phone && acc.phone.includes(activeSearch));

    const matchesStatus = statusFilter === 'all' || acc.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isPointModalOpen, setIsPointModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const [selectedAccount, setSelectedAccount] = useState<UserAccount | null>(null);

  // Form States for New Account
  const [newName, setNewName] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newParent, setNewParent] = useState('');
  const [newPoints, setNewPoints] = useState(0);
  const [newCreditLimit, setNewCreditLimit] = useState(100000);
  const [newCommission, setNewCommission] = useState(role === 'Retailer' ? 7.0 : role === 'Distributer' ? 5.0 : 3.5);
  const [newPhone, setNewPhone] = useState('');

  // Form States for Points Adjustment
  const [pointAmount, setPointAmount] = useState<number>(10000);
  const [pointType, setPointType] = useState<'Credit' | 'Debit'>('Credit');
  const [pointRemark, setPointRemark] = useState('');

  // Form States for Edit Account
  const [editName, setEditName] = useState('');
  const [editCommission, setEditCommission] = useState(0);
  const [editCreditLimit, setEditCreditLimit] = useState(0);

  const handleOpenPointModal = (acc: UserAccount, type: 'Credit' | 'Debit') => {
    setSelectedAccount(acc);
    setPointType(type);
    setPointAmount(10000);
    setPointRemark('');
    setIsPointModalOpen(true);
  };

  const handleOpenEditModal = (acc: UserAccount) => {
    setSelectedAccount(acc);
    setEditName(acc.name);
    setEditCommission(acc.commissionRate);
    setEditCreditLimit(acc.creditLimit);
    setIsEditModalOpen(true);
  };

  const handleCreateAccountSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newUsername) return;

    const defaultParent = currentUser?.username || 'admin';

    addUserAccount({
      name: newName,
      username: newUsername,
      password: newPassword || 'User@123',
      role,
      parentName: newParent || defaultParent,
      points: Number(newPoints),
      creditLimit: Number(newCreditLimit),
      status: 'active',
      commissionRate: Number(newCommission),
      phone: newPhone || '+91 98000 00000',
    });

    setIsAddModalOpen(false);
    setNewName('');
    setNewUsername('');
    setNewPassword('');
    setNewParent('');
    setNewPoints(0);
  };

  const handlePointSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAccount) return;

    const success = adjustPoints(selectedAccount.username, pointAmount, pointType, pointRemark);
    if (success) {
      setIsPointModalOpen(false);
    }
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAccount) return;

    updateUserAccount(selectedAccount.id, {
      name: editName,
      commissionRate: Number(editCommission),
      creditLimit: Number(editCreditLimit),
    });

    setIsEditModalOpen(false);
  };

  const roleTitle =
    role === 'SuperDistributer'
      ? 'SuperDistributer'
      : role === 'Distributer'
      ? 'Distributer'
      : role === 'Retailer'
      ? 'Retailer'
      : 'Users';

  const roleIcon =
    role === 'SuperDistributer' ? (
      <UserCheck className="w-6 h-6 text-purple-400" />
    ) : role === 'Distributer' ? (
      <UserPlus className="w-6 h-6 text-blue-400" />
    ) : role === 'Retailer' ? (
      <Users className="w-6 h-6 text-emerald-400" />
    ) : (
      <User className="w-6 h-6 text-amber-400" />
    );

  return (
    <div className="space-y-6 animate-fade-in">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-900 border border-slate-800">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 shadow-inner">
            {roleIcon}
          </div>
          <div>
            <h1 className="text-xl font-bold text-white flex items-center gap-2">
              <span>{roleTitle} Management</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800 font-semibold">
                {accountList.length} Total
              </span>
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Manage accounts, credit limits, point allocations, and security locks for {roleTitle}.
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs shadow-lg shadow-cyan-500/20 transition-all hover:scale-[1.02]"
        >
          <Plus className="w-4 h-4" />
          <span>Add New {roleTitle}</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 rounded-xl bg-slate-900/80 border border-slate-800">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder={`Search ${roleTitle} by name, username, phone...`}
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 text-slate-200 text-xs rounded-xl pl-9 pr-4 py-2 focus:outline-none focus:ring-1 focus:ring-cyan-500/50"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <span className="text-xs text-slate-400 font-medium">Status Filter:</span>
          <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1 rounded-lg transition-colors font-medium ${
                statusFilter === 'all'
                  ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setStatusFilter('active')}
              className={`px-3 py-1 rounded-lg transition-colors font-medium ${
                statusFilter === 'active'
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Active
            </button>
            <button
              onClick={() => setStatusFilter('blocked')}
              className={`px-3 py-1 rounded-lg transition-colors font-medium ${
                statusFilter === 'blocked'
                  ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Blocked
            </button>
          </div>
        </div>
      </div>

      {/* Main Table */}
      <div className="overflow-x-auto rounded-2xl bg-slate-900 border border-slate-800 shadow-xl">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-950/80 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-800">
            <tr>
              <th className="p-4">Account / ID</th>
              <th className="p-4">Username</th>
              {role !== 'SuperDistributer' && <th className="p-4">Parent Agency</th>}
              <th className="p-4">Point Balance</th>
              <th className="p-4">Credit Limit</th>
              <th className="p-4">Commission %</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-center">Point Actions</th>
              <th className="p-4 text-right">Settings</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-medium">
            {filteredAccounts.length === 0 ? (
              <tr>
                <td colSpan={9} className="p-8 text-center text-slate-500">
                  No {roleTitle} accounts found matching your search criteria.
                </td>
              </tr>
            ) : (
              filteredAccounts.map((acc) => (
                <tr
                  key={acc.id}
                  className="hover:bg-slate-800/40 transition-colors group"
                >
                  <td className="p-4">
                    <div className="font-bold text-white group-hover:text-cyan-400 transition-colors">
                      {acc.name}
                    </div>
                    <div className="text-[10px] text-slate-500 font-mono">{acc.id}</div>
                  </td>

                  <td className="p-4 font-semibold text-slate-200">
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                      {acc.username}
                    </div>
                  </td>

                  {role !== 'SuperDistributer' && (
                    <td className="p-4 text-slate-400 font-semibold">
                      {acc.parentName || 'superadmin'}
                    </td>
                  )}

                  <td className="p-4">
                    <span className="font-extrabold text-cyan-400 text-sm">
                      ₹{acc.points.toLocaleString()}
                    </span>
                  </td>

                  <td className="p-4 text-slate-300">
                    ₹{acc.creditLimit.toLocaleString()}
                  </td>

                  <td className="p-4">
                    <span className="px-2 py-0.5 rounded-full bg-slate-950 text-indigo-300 border border-indigo-800/50 font-bold">
                      {acc.commissionRate}%
                    </span>
                  </td>

                  <td className="p-4">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border ${
                        acc.status === 'active'
                          ? 'bg-emerald-950/80 text-emerald-400 border-emerald-800/60'
                          : 'bg-rose-950/80 text-rose-400 border-rose-800/60'
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          acc.status === 'active' ? 'bg-emerald-400' : 'bg-rose-400'
                        }`}
                      />
                      {acc.status.toUpperCase()}
                    </span>
                  </td>

                  <td className="p-4">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => handleOpenPointModal(acc, 'Credit')}
                        className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-950/60 hover:bg-emerald-900/80 text-emerald-300 border border-emerald-800/60 transition-colors font-bold text-[11px]"
                        title="Add Points to user"
                      >
                        <ArrowUpRight className="w-3.5 h-3.5" />
                        <span>Add</span>
                      </button>

                      <button
                        onClick={() => handleOpenPointModal(acc, 'Debit')}
                        className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-rose-950/60 hover:bg-rose-900/80 text-rose-300 border border-rose-800/60 transition-colors font-bold text-[11px]"
                        title="Deduct Points from user"
                      >
                        <ArrowDownRight className="w-3.5 h-3.5" />
                        <span>Deduct</span>
                      </button>
                    </div>
                  </td>

                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => toggleUserStatus(acc.id)}
                        className={`p-1.5 rounded-lg border transition-colors ${
                          acc.status === 'active'
                            ? 'bg-slate-950 border-slate-800 text-slate-400 hover:text-rose-400 hover:border-rose-800'
                            : 'bg-emerald-950 border-emerald-800 text-emerald-400 hover:bg-emerald-900'
                        }`}
                        title={acc.status === 'active' ? 'Lock Account' : 'Unlock Account'}
                      >
                        {acc.status === 'active' ? (
                          <Lock className="w-3.5 h-3.5" />
                        ) : (
                          <Unlock className="w-3.5 h-3.5" />
                        )}
                      </button>

                      <button
                        onClick={() => handleOpenEditModal(acc)}
                        className="p-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-400 hover:text-cyan-400 hover:border-cyan-800 transition-colors"
                        title="Edit Account Details"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* CREATE ACCOUNT MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-2xl p-6 shadow-2xl relative animate-slide-in">
            <button
              onClick={() => setIsAddModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
              <Plus className="w-5 h-5 text-cyan-400" />
              <span>Create New {roleTitle}</span>
            </h3>
            <p className="text-xs text-slate-400 mb-5">
              Enter detail credentials to initialize a new {roleTitle} account.
            </p>

            <form onSubmit={handleCreateAccountSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Royal Gaming SD"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl px-3 py-2 text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Username (Login ID)</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. agent_user1"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl px-3 py-2 text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Login Password</label>
                <input
                  type="password"
                  required
                  placeholder="Assign initial password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl px-3 py-2 text-white focus:outline-none"
                />
              </div>

              {role !== 'SuperDistributer' && (
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Parent Username</label>
                  <input
                    type="text"
                    placeholder="e.g. admin"
                    value={newParent}
                    onChange={(e) => setNewParent(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl px-3 py-2 text-white focus:outline-none"
                  />
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Opening Points</label>
                  <input
                    type="number"
                    value={newPoints}
                    onChange={(e) => setNewPoints(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl px-3 py-2 text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Credit Limit (₹)</label>
                  <input
                    type="number"
                    value={newCreditLimit}
                    onChange={(e) => setNewCreditLimit(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl px-3 py-2 text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Commission %</label>
                  <input
                    type="number"
                    step="0.1"
                    value={newCommission}
                    onChange={(e) => setNewCommission(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl px-3 py-2 text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Phone Number</label>
                  <input
                    type="text"
                    placeholder="+91 98765 00000"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl px-3 py-2 text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold shadow-lg shadow-cyan-500/20"
                >
                  Create Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADJUST POINTS MODAL */}
      {isPointModalOpen && selectedAccount && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-2xl p-6 shadow-2xl relative animate-slide-in">
            <button
              onClick={() => setIsPointModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
              <Coins className="w-5 h-5 text-amber-400" />
              <span>{pointType === 'Credit' ? 'Add Points' : 'Deduct Points'}</span>
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Account: <span className="text-white font-bold">{selectedAccount.username}</span> ({selectedAccount.name})
            </p>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 mb-4 flex items-center justify-between text-xs">
              <span className="text-slate-400 font-medium">Current Balance:</span>
              <span className="text-cyan-400 font-extrabold text-sm">
                ₹{selectedAccount.points.toLocaleString()}
              </span>
            </div>

            <form onSubmit={handlePointSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Amount to {pointType} (₹)
                </label>
                <input
                  type="number"
                  required
                  min={1}
                  value={pointAmount}
                  onChange={(e) => setPointAmount(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl px-3 py-2 text-white font-bold text-sm focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Remark / Reference Note</label>
                <input
                  type="text"
                  placeholder="e.g. Daily Balance Refill"
                  value={pointRemark}
                  onChange={(e) => setPointRemark(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl px-3 py-2 text-white focus:outline-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsPointModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`px-5 py-2 rounded-xl text-white font-bold shadow-lg ${
                    pointType === 'Credit'
                      ? 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-500/20'
                      : 'bg-rose-600 hover:bg-rose-500 shadow-rose-500/20'
                  }`}
                >
                  Confirm {pointType}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT ACCOUNT MODAL */}
      {isEditModalOpen && selectedAccount && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-2xl p-6 shadow-2xl relative animate-slide-in">
            <button
              onClick={() => setIsEditModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
              <Edit2 className="w-5 h-5 text-cyan-400" />
              <span>Edit Account Settings</span>
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Username: <span className="text-white font-bold">{selectedAccount.username}</span>
            </p>

            <form onSubmit={handleEditSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Account Display Name</label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl px-3 py-2 text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Commission %</label>
                <input
                  type="number"
                  step="0.1"
                  value={editCommission}
                  onChange={(e) => setEditCommission(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl px-3 py-2 text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Credit Limit (₹)</label>
                <input
                  type="number"
                  value={editCreditLimit}
                  onChange={(e) => setEditCreditLimit(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl px-3 py-2 text-white focus:outline-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold shadow-lg shadow-cyan-500/20"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
