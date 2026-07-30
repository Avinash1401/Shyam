import { useState, useEffect, useCallback } from 'react';
import { useAdmin } from '../context/AdminContext';
import { socketService, SocketEventPayload } from '../services/socketService';

export interface LiveStats {
  liveBetIn: number;
  liveBetOut: number;
  activePlayerCount: number;
  todayProfitLoss: number;
  isConnected: boolean;
  lastUpdatedTime: string;
}

export const useLiveStats = () => {
  const { gameTickets, onlinePlayers } = useAdmin();

  const [stats, setStats] = useState<LiveStats>(() => {
    const liveBetIn = gameTickets
      .filter((t) => t.status === 'Pending')
      .reduce((sum, t) => sum + t.betAmount, 0);

    const liveBetOut = gameTickets
      .filter((t) => t.status === 'Won')
      .reduce((sum, t) => sum + t.winAmount, 0);

    const totalBetsAll = gameTickets.reduce((sum, t) => sum + t.betAmount, 0);
    const totalPayoutAll = gameTickets.reduce((sum, t) => sum + (t.status === 'Won' ? t.winAmount : 0), 0);

    return {
      liveBetIn,
      liveBetOut,
      activePlayerCount: onlinePlayers.length,
      todayProfitLoss: totalBetsAll - totalPayoutAll,
      isConnected: socketService.isConnected(),
      lastUpdatedTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    };
  });

  const calculateNormalizedStats = useCallback(() => {
    const liveBetIn = gameTickets
      .filter((t) => t.status === 'Pending')
      .reduce((sum, t) => sum + t.betAmount, 0);

    const liveBetOut = gameTickets
      .filter((t) => t.status === 'Won')
      .reduce((sum, t) => sum + t.winAmount, 0);

    const totalBetsAll = gameTickets.reduce((sum, t) => sum + t.betAmount, 0);
    const totalPayoutAll = gameTickets.reduce((sum, t) => sum + (t.status === 'Won' ? t.winAmount : 0), 0);
    const todayProfitLoss = totalBetsAll - totalPayoutAll;
    const activePlayerCount = onlinePlayers.length;

    return {
      liveBetIn,
      liveBetOut,
      activePlayerCount,
      todayProfitLoss,
      isConnected: socketService.isConnected(),
      lastUpdatedTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    };
  }, [gameTickets, onlinePlayers]);

  // Recalculate stats on tickets/players change or Socket event
  useEffect(() => {
    const newStats = calculateNormalizedStats();
    setStats(newStats);

    // Broadcast updated normalized stats via socket service
    socketService.broadcastStats({
      liveBetIn: newStats.liveBetIn,
      liveBetOut: newStats.liveBetOut,
      activePlayerCount: newStats.activePlayerCount,
    });
  }, [calculateNormalizedStats]);

  // AJAX Polling every 2 seconds for live stats synchronization
  useEffect(() => {
    const pollInterval = setInterval(() => {
      const refreshed = calculateNormalizedStats();
      setStats((prev) => {
        if (
          prev.liveBetIn === refreshed.liveBetIn &&
          prev.liveBetOut === refreshed.liveBetOut &&
          prev.activePlayerCount === refreshed.activePlayerCount &&
          prev.todayProfitLoss === refreshed.todayProfitLoss
        ) {
          return prev; // Prevent unnecessary state updates & re-renders
        }
        return refreshed;
      });
    }, 2000);

    // Listen to real-time socket events for low-latency updates
    const unsubscribeSocket = socketService.on('stats_update', (payload: SocketEventPayload) => {
      if (payload.data) {
        setStats((prev) => ({
          ...prev,
          liveBetIn: payload.data.liveBetIn ?? prev.liveBetIn,
          liveBetOut: payload.data.liveBetOut ?? prev.liveBetOut,
          activePlayerCount: payload.data.activePlayerCount ?? prev.activePlayerCount,
          lastUpdatedTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        }));
      }
    });

    return () => {
      clearInterval(pollInterval);
      unsubscribeSocket();
    };
  }, [calculateNormalizedStats]);

  const refreshStats = useCallback(() => {
    setStats(calculateNormalizedStats());
  }, [calculateNormalizedStats]);

  return {
    ...stats,
    refreshStats,
  };
};
