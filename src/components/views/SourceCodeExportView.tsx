import React, { useState } from 'react';
import {
  Code2,
  Database,
  FileCode,
  Copy,
  Check,
  Download,
  FolderTree,
  Server,
  Layers,
  Terminal,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

export const SourceCodeExportView: React.FC = () => {
  const [activeFile, setActiveFile] = useState<string>('shyam_game.sql');
  const [copied, setCopied] = useState<boolean>(false);

  const filesList = [
    {
      id: 'shyam_game.sql',
      name: 'database/shyam_game.sql',
      type: 'SQL Schema',
      icon: Database,
      content: `-- =========================================================
-- Shyam Game - Online Gaming Management System Schema
-- Core PHP 8 + MySQL Database Definition
-- =========================================================

CREATE TABLE \`users\` (
  \`id\` INT AUTO_INCREMENT PRIMARY KEY,
  \`name\` VARCHAR(100) NOT NULL,
  \`username\` VARCHAR(50) NOT NULL UNIQUE,
  \`password\` VARCHAR(255) NOT NULL,
  \`role\` ENUM('SuperDistributer', 'Distributer', 'Retailer', 'User') DEFAULT 'User',
  \`parent_id\` INT NULL,
  \`commission_rate\` DECIMAL(5,2) DEFAULT 5.00,
  \`status\` ENUM('active', 'blocked', 'suspended') DEFAULT 'active',
  \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE \`wallet\` (
  \`id\` INT AUTO_INCREMENT PRIMARY KEY,
  \`user_id\` INT NOT NULL UNIQUE,
  \`balance\` DECIMAL(12,2) NOT NULL DEFAULT 0.00
);

CREATE TABLE \`games\` (
  \`id\` INT AUTO_INCREMENT PRIMARY KEY,
  \`code\` VARCHAR(30) NOT NULL UNIQUE,
  \`name\` VARCHAR(100) NOT NULL,
  \`multiplier\` DECIMAL(8,2) NOT NULL DEFAULT 10.00
);

CREATE TABLE \`bets\` (
  \`id\` INT AUTO_INCREMENT PRIMARY KEY,
  \`ticket_no\` VARCHAR(50) NOT NULL UNIQUE,
  \`user_id\` INT NOT NULL,
  \`game_id\` INT NOT NULL,
  \`selected_numbers\` TEXT NOT NULL,
  \`bet_amount\` DECIMAL(12,2) NOT NULL,
  \`status\` ENUM('Won', 'Lost', 'Pending', 'Cancelled') DEFAULT 'Pending'
);`,
    },
    {
      id: 'database.php',
      name: 'config/database.php',
      type: 'PHP Config',
      icon: Server,
      content: `<?php
/**
 * Shyam Game - Database Connection Manager (PDO + Prepared Statements)
 * Core PHP 8
 */

class Database {
    private static ?PDO $instance = null;

    public static function getConnection(): PDO {
        if (self::$instance === null) {
            $dsn = "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=utf8mb4";
            self::$instance = new PDO($dsn, DB_USER, DB_PASS, [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
            ]);
        }
        return self::$instance;
    }
}`,
    },
    {
      id: 'place_bet.php',
      name: 'api/place_bet.php',
      type: 'REST API',
      icon: FileCode,
      content: `<?php
/**
 * Shyam Game - Place Bet REST API
 */
require_once __DIR__ . '/../config/database.php';

header('Content-Type: application/json');

$input = json_decode(file_get_contents('php://input'), true);
$userId = (int)$input['user_id'];
$betAmount = (float)$input['bet_amount'];

$db = Database::getConnection();
$db->beginTransaction();

// Deduct wallet and place wager
$stmt = $db->prepare("UPDATE wallet SET balance = balance - :amount WHERE user_id = :user_id");
$stmt->execute(['amount' => $betAmount, 'user_id' => $userId]);

$db->commit();
echo json_encode(['success' => true, 'message' => 'Bet ticket generated']);`,
    },
    {
      id: 'notifications.sql',
      name: 'database/notifications.sql',
      type: 'SQL Schema',
      icon: Database,
      content: `-- =========================================================
-- Anti-Spam Notification System Schema
-- Prevents duplicate alerts and tracks read status efficiently
-- =========================================================

CREATE TABLE IF NOT EXISTS \`notifications\` (
  \`id\` BIGINT AUTO_INCREMENT PRIMARY KEY,
  \`user_id\` INT NOT NULL,
  \`title\` VARCHAR(150) NOT NULL,
  \`description\` TEXT NOT NULL,
  \`type\` ENUM('success', 'error', 'info', 'warning') DEFAULT 'info',
  \`fingerprint\` VARCHAR(64) NOT NULL, -- SHA256 / MD5 hash of title+description for deduplication
  \`is_read\` TINYINT(1) NOT NULL DEFAULT 0,
  \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX \`idx_user_read\` (\`user_id\`, \`is_read\`),
  INDEX \`idx_fingerprint\` (\`user_id\`, \`fingerprint\`, \`created_at\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`,
    },
    {
      id: 'NotificationService.php',
      name: 'services/NotificationService.php',
      type: 'PHP Service',
      icon: Server,
      content: `<?php
/**
 * Shyam Game - Zero-Spam Notification Service
 * Handles notification creation with deduplication, read tracking, and incremental AJAX fetch
 */
require_once __DIR__ . '/../config/database.php';

class NotificationService {
    private PDO $db;

    public function __construct() {
        $this->db = Database::getConnection();
    }

    /**
     * Dispatch notification with strict deduplication check
     */
    public function dispatchNotification(int $userId, string $title, string $description, string $type = 'info'): bool {
        $fingerprint = md5(strtolower(trim($title)) . '|' . strtolower(trim($description)));

        // Check if duplicate notification exists created within the last 10 seconds
        $checkStmt = $this->db->prepare("
            SELECT id FROM notifications 
            WHERE user_id = :user_id 
              AND fingerprint = :fingerprint 
              AND created_at >= NOW() - INTERVAL 10 SECOND
            LIMIT 1
        ");
        $checkStmt->execute(['user_id' => $userId, 'fingerprint' => $fingerprint]);

        if ($checkStmt->fetch()) {
            return false; // Duplicate suppressed
        }

        $stmt = $this->db->prepare("
            INSERT INTO notifications (user_id, title, description, type, fingerprint, is_read) 
            VALUES (:user_id, :title, :description, :type, :fingerprint, 0)
        ");
        return $stmt->execute([
            'user_id' => $userId,
            'title' => $title,
            'description' => $description,
            'type' => $type,
            'fingerprint' => $fingerprint
        ]);
    }

    /**
     * Fetch unread new notifications using Incremental ID filter (prevents polling old records)
     */
    public function getNewNotifications(int $userId, int $lastSeenId = 0): array {
        $stmt = $this->db->prepare("
            SELECT id, title, description, type, is_read, DATE_FORMAT(created_at, '%H:%i') as timestamp 
            FROM notifications 
            WHERE user_id = :user_id 
              AND id > :last_id 
              AND is_read = 0 
            ORDER BY id ASC 
            LIMIT 10
        ");
        $stmt->execute(['user_id' => $userId, 'last_id' => $lastSeenId]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    /**
     * Mark single notification as read (never shown again)
     */
    public function markAsRead(int $userId, int $notifId): bool {
        $stmt = $this->db->prepare("
            UPDATE notifications 
            SET is_read = 1 
            WHERE id = :id AND user_id = :user_id
        ");
        return $stmt->execute(['id' => $notifId, 'user_id' => $userId]);
    }

    /**
     * Mark ALL notifications as read
     */
    public function markAllAsRead(int $userId): bool {
        $stmt = $this->db->prepare("
            UPDATE notifications 
            SET is_read = 1 
            WHERE user_id = :user_id AND is_read = 0
        ");
        return $stmt->execute(['user_id' => $userId]);
    }
}`,
    },
    {
      id: 'notifications.js',
      name: 'assets/js/notifications.js',
      type: 'JS / AJAX',
      icon: Terminal,
      content: `/**
 * Shyam Game - Zero-Spam Anti-Duplicate Notification Manager
 * JavaScript AJAX / WebSocket Client Engine
 */
class NotificationEngine {
    constructor(userId) {
        this.userId = userId;
        this.lastSeenId = parseInt(localStorage.getItem('shyam_last_notif_id') || '0', 10);
        this.activeToasts = new Map();
        this.maxActiveToasts = 3; // Maximum 3 active notifications on screen
        this.autoDismissMs = 5000; // 5 seconds auto-remove
        this.shownFingerprints = new Set();
        this.init();
    }

    init() {
        this.bindEvents();
        // Optimized polling (5s interval, uses ID cursor to prevent duplicate/old data traffic)
        this.startPoll();
    }

    bindEvents() {
        document.getElementById('mark-all-read-btn')?.addEventListener('click', () => {
            this.markAllAsRead();
        });
    }

    async pollNewNotifications() {
        try {
            const response = await fetch(\`/api/get_notifications.php?user_id=\${this.userId}&last_id=\${this.lastSeenId}\`);
            const data = await response.json();

            if (data.success && data.notifications.length > 0) {
                data.notifications.forEach(notif => {
                    if (notif.id > this.lastSeenId) {
                        this.lastSeenId = notif.id;
                        localStorage.setItem('shyam_last_notif_id', this.lastSeenId.toString());
                    }
                    this.renderToast(notif);
                });
            }
        } catch (err) {
            console.warn('Notification sync paused:', err);
        }
    }

    renderToast(notif) {
        const fingerprint = \`\${notif.title.toLowerCase()}|\${notif.description.toLowerCase()}\`;

        // Anti-Duplicate Safeguard
        if (this.shownFingerprints.has(fingerprint) || this.activeToasts.has(notif.id)) {
            return;
        }

        this.shownFingerprints.add(fingerprint);

        // Cap active toasts to maximum 3
        if (this.activeToasts.size >= this.maxActiveToasts) {
            const oldestKey = this.activeToasts.keys().next().value;
            this.removeToast(oldestKey);
        }

        // Create Toast Card Element
        const toastEl = document.createElement('div');
        toastEl.className = \`toast-card \${notif.type} animate-slide-in\`;
        toastEl.innerHTML = \`
            <div class="toast-body">
                <strong>\${notif.title}</strong>
                <p>\${notif.description}</p>
            </div>
            <button onclick="notifEngine.markAsRead(\${notif.id})">&times;</button>
            <div class="timer-bar" style="animationDuration: 5s;"></div>
        \`;

        document.getElementById('toast-container').appendChild(toastEl);
        this.activeToasts.set(notif.id, toastEl);

        // Auto remove after 5 seconds
        setTimeout(() => {
            this.removeToast(notif.id);
        }, this.autoDismissMs);
    }

    removeToast(id) {
        const el = this.activeToasts.get(id);
        if (el) {
            el.remove();
            this.activeToasts.delete(id);
        }
    }

    async markAsRead(id) {
        this.removeToast(id);
        await fetch('/api/mark_read.php', {
            method: 'POST',
            body: JSON.stringify({ user_id: this.userId, notif_id: id })
        });
    }

    async markAllAsRead() {
        this.activeToasts.forEach((_, id) => this.removeToast(id));
        await fetch('/api/mark_all_read.php', {
            method: 'POST',
            body: JSON.stringify({ user_id: this.userId })
        });
        document.querySelectorAll('.unread-badge').forEach(el => el.remove());
    }

    startPoll() {
        setInterval(() => this.pollNewNotifications(), 5000);
    }
}`,
    },
  ];

  const currentFileObj = filesList.find((f) => f.id === activeFile) || filesList[0];

  const copyCode = () => {
    navigator.clipboard.writeText(currentFileObj.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Code2 className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white flex items-center gap-2">
              PHP 8 & MySQL Source Code Package
            </h1>
            <p className="text-xs text-slate-400">
              Complete backend REST APIs, database schema, and Core PHP 8 files for "Shyam Game".
            </p>
          </div>
        </div>

        <button
          onClick={copyCode}
          className="px-4 py-2.5 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs flex items-center gap-2 hover:bg-cyan-400 transition-all shadow-md shadow-cyan-500/20"
        >
          {copied ? <Check className="w-4 h-4 text-slate-950" /> : <Copy className="w-4 h-4" />}
          <span>{copied ? 'Copied to Clipboard!' : 'Copy Code File'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: File Explorer List */}
        <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
            <FolderTree className="w-4 h-4 text-cyan-400" />
            Backend File Tree
          </h3>

          <div className="space-y-1.5">
            {filesList.map((file) => {
              const IconComp = file.icon;
              const isActive = file.id === activeFile;
              return (
                <button
                  key={file.id}
                  onClick={() => setActiveFile(file.id)}
                  className={`w-full text-left p-3 rounded-xl transition-all flex items-center justify-between ${
                    isActive
                      ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 font-bold'
                      : 'hover:bg-slate-800/60 text-slate-400 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <IconComp className="w-4 h-4 text-cyan-400" />
                    <span className="text-xs font-mono">{file.name}</span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-slate-950 text-slate-500 font-sans">
                    {file.type}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2 text-xs text-slate-400">
            <span className="text-white font-bold block flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Requirements & Stack
            </span>
            <ul className="list-disc list-inside space-y-1 text-[11px] text-slate-400">
              <li>PHP 8.0 or higher</li>
              <li>MySQL / MariaDB with PDO extension</li>
              <li>Prepared statements & BCRYPT password hashing</li>
              <li>Bootstrap 5 + jQuery AJAX frontend</li>
            </ul>
          </div>
        </div>

        {/* Right Column: Code Viewer */}
        <div className="lg:col-span-8 bg-slate-950 border border-slate-800 rounded-2xl p-4 overflow-hidden space-y-3">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs">
            <span className="font-mono font-bold text-cyan-400 flex items-center gap-2">
              <Terminal className="w-4 h-4 text-slate-400" />
              {currentFileObj.name}
            </span>
            <span className="text-slate-500 text-[10px]">Syntax Highlighted</span>
          </div>

          <pre className="p-4 rounded-xl bg-slate-900 border border-slate-800/80 font-mono text-xs text-slate-300 overflow-x-auto max-h-[500px] custom-scrollbar">
            <code>{currentFileObj.content}</code>
          </pre>
        </div>
      </div>
    </div>
  );
};
