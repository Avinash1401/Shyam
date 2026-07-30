import React, { useState } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { Radio, Search, LogOut, ShieldAlert, Monitor, Smartphone, Globe, RefreshCw } from 'lucide-react';

export const OnlinePlayersView: React.FC = () => {
  const { onlinePlayers, kickOnlinePlayer, addToast } = useAdmin();
  const [filterGame, setFilterGame] = useState<string>('all');
  const [search, setSearch] = useState<string>('');

  const filteredPlayers = onlinePlayers.filter((player) => {
    const matchesSearch =
      player.username.toLowerCase().includes(search.toLowerCase()) ||
      player.parent.toLowerCase().includes(search.toLowerCase()) ||
      player.ipAddress.includes(search);

    const matchesGame = filterGame === 'all' || player.currentGame === filterGame;

    return matchesSearch && matchesGame;
  });

  const handleRefresh = () => {
    addToast('Refreshed Online Tables', 'Live player ping statuses updated.', 'info');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-900 border border-slate-800">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-rose-950/80 border border-rose-800/60 text-rose-400">
            <Radio className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white flex items-center gap-2">
              <span>Online Players Live Monitor</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-rose-950 text-rose-400 border border-rose-800 font-bold animate-pulse">
                {onlinePlayers.length} Connected
              </span>
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Real-time active connection tracking, current table wagers, device info, and IP monitoring.
            </p>
          </div>
        </div>

        <button
          onClick={handleRefresh}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition-all"
        >
          <RefreshCw className="w-4 h-4 text-cyan-400" />
          <span>Refresh Live Feeds</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 rounded-xl bg-slate-900/80 border border-slate-800">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by username, parent agency, or IP..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 text-slate-200 text-xs rounded-xl pl-9 pr-4 py-2 focus:outline-none focus:ring-1 focus:ring-cyan-500/50"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <span className="text-xs text-slate-400 font-medium">Filter Game Table:</span>
          <select
            value={filterGame}
            onChange={(e) => setFilterGame(e.target.value)}
            className="bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-cyan-500 font-medium"
          >
            <option value="all">All Game Tables</option>
            <option value="2D Lottery">2D Lottery</option>
            <option value="3D Lottery">3D Lottery</option>
            <option value="Lucky 12">Lucky 12</option>
            <option value="12 Card">12 Card</option>
          </select>
        </div>
      </div>

      {/* Players Grid Table */}
      <div className="overflow-x-auto rounded-2xl bg-slate-900 border border-slate-800 shadow-xl">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-950/80 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-800">
            <tr>
              <th className="p-4">Player / Account</th>
              <th className="p-4">Parent Agency</th>
              <th className="p-4">Current Game</th>
              <th className="p-4">In-Play Wager</th>
              <th className="p-4">Points Balance</th>
              <th className="p-4">IP & Device Client</th>
              <th className="p-4">Connected At</th>
              <th className="p-4 text-right">Force Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-medium">
            {filteredPlayers.length === 0 ? (
              <tr>
                <td colSpan={8} className="p-8 text-center text-slate-500">
                  No online players currently connected matching filters.
                </td>
              </tr>
            ) : (
              filteredPlayers.map((player) => (
                <tr key={player.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-4">
                    <div className="font-bold text-white flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                      {player.username}
                    </div>
                    <div className="text-[10px] text-slate-500">{player.role}</div>
                  </td>

                  <td className="p-4 text-slate-400 font-semibold">{player.parent}</td>

                  <td className="p-4">
                    <span className="px-2.5 py-1 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800/60 font-bold">
                      {player.currentGame}
                    </span>
                  </td>

                  <td className="p-4">
                    <span className="font-extrabold text-amber-400 text-sm">
                      ₹{player.currentBet.toLocaleString()}
                    </span>
                  </td>

                  <td className="p-4 font-extrabold text-cyan-400">
                    ₹{player.points.toLocaleString()}
                  </td>

                  <td className="p-4">
                    <div className="flex items-center gap-1.5 text-slate-300 font-mono text-[11px]">
                      <Globe className="w-3.5 h-3.5 text-slate-500" />
                      {player.ipAddress}
                    </div>
                    <div className="text-[10px] text-slate-500 mt-0.5 flex items-center gap-1">
                      {player.device.includes('Android') ? (
                        <Smartphone className="w-3 h-3 text-emerald-400" />
                      ) : (
                        <Monitor className="w-3 h-3 text-blue-400" />
                      )}
                      <span>{player.device}</span>
                    </div>
                  </td>

                  <td className="p-4 text-slate-400 text-[11px] font-mono">
                    {player.connectedAt}
                  </td>

                  <td className="p-4 text-right">
                    <button
                      onClick={() => kickOnlinePlayer(player.id)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-950/80 hover:bg-rose-900 text-rose-300 border border-rose-800/80 transition-colors font-bold text-xs"
                      title="Disconnect user session"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Kick / Disconnect</span>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
