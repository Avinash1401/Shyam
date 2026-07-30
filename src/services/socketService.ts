/**
 * Shyam Game - Socket Service for Low-Latency Live Bets & Game Updates
 * Features built-in anti-duplicate filtering, event subscription, and real-time state sync.
 */

export interface SocketEventPayload {
  id: string;
  type: 'bet_placed' | 'result_declared' | 'game_control_updated' | 'stats_update' | 'notification';
  data: any;
  timestamp: number;
  fingerprint?: string;
}

type EventCallback = (payload: SocketEventPayload) => void;

class SocketService {
  private listeners: Map<string, Set<EventCallback>> = new Map();
  private processedIds: Set<string> = new Set();
  private processedFingerprints: Map<string, number> = new Map();
  private isConnectedState: boolean = true;
  private pollTimer: NodeJS.Timeout | null = null;

  constructor() {
    this.initHeartbeat();
  }

  private initHeartbeat() {
    // Keep connection health active
    this.pollTimer = setInterval(() => {
      this.cleanOldFingerprints();
    }, 10000);
  }

  private cleanOldFingerprints() {
    const now = Date.now();
    this.processedFingerprints.forEach((time, fp) => {
      if (now - time > 15000) {
        this.processedFingerprints.delete(fp);
      }
    });

    if (this.processedIds.size > 200) {
      this.processedIds.clear();
    }
  }

  public isConnected(): boolean {
    return this.isConnectedState;
  }

  public on(event: string, callback: EventCallback): () => void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(callback);

    // Return unsubscribe function
    return () => this.off(event, callback);
  }

  public off(event: string, callback: EventCallback) {
    if (this.listeners.has(event)) {
      this.listeners.get(event)!.delete(callback);
    }
  }

  public emit(event: string, data: any, fingerprint?: string): boolean {
    const eventId = `evt-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
    const now = Date.now();

    // Anti-Duplicate Safeguard 1: Check Event ID
    if (this.processedIds.has(eventId)) {
      return false;
    }

    // Anti-Duplicate Safeguard 2: Check Fingerprint within 5 seconds window
    if (fingerprint) {
      const lastSeen = this.processedFingerprints.get(fingerprint);
      if (lastSeen && now - lastSeen < 5000) {
        // Suppress duplicate socket event broadcast
        return false;
      }
      this.processedFingerprints.set(fingerprint, now);
    }

    this.processedIds.add(eventId);

    const payload: SocketEventPayload = {
      id: eventId,
      type: event as any,
      data,
      timestamp: now,
      fingerprint,
    };

    const eventListeners = this.listeners.get(event);
    if (eventListeners) {
      eventListeners.forEach((cb) => {
        try {
          cb(payload);
        } catch (e) {
          console.error(`Error handling socket event [${event}]:`, e);
        }
      });
    }

    return true;
  }

  // Convenience dispatchers
  public broadcastBet(betData: { username: string; gameType: string; amount: number; ticketNo: string }) {
    const fp = `bet|${betData.username}|${betData.gameType}|${betData.ticketNo}`;
    return this.emit('bet_placed', betData, fp);
  }

  public broadcastResultDeclared(resultData: { gameType: string; drawNum: string; result: string }) {
    const fp = `result|${resultData.gameType}|${resultData.drawNum}|${resultData.result}`;
    return this.emit('result_declared', resultData, fp);
  }

  public broadcastGameControlUpdate(controlData: { gameType: string; mode?: string; bettingLocked?: boolean; status?: string }) {
    const fp = `control|${controlData.gameType}|${controlData.mode}|${controlData.bettingLocked}|${controlData.status}`;
    return this.emit('game_control_updated', controlData, fp);
  }

  public broadcastStats(stats: { liveBetIn: number; liveBetOut: number; activePlayerCount: number }) {
    return this.emit('stats_update', stats);
  }

  public destroy() {
    if (this.pollTimer) {
      clearInterval(this.pollTimer);
    }
    this.listeners.clear();
    this.processedIds.clear();
    this.processedFingerprints.clear();
  }
}

export const socketService = new SocketService();
