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
      id: 'login.php',
      name: 'api/login.php',
      type: 'REST API',
      icon: ShieldCheck,
      content: `<?php
/**
 * Shyam Game - Authentication Login API
 */
require_once __DIR__ . '/../config/database.php';

header('Content-Type: application/json');

$input = json_decode(file_get_contents('php://input'), true);
$username = sanitizeInput($input['username'] ?? '');
$password = $input['password'] ?? '';

$db = Database::getConnection();
$stmt = $db->prepare("SELECT * FROM users WHERE username = :username LIMIT 1");
$stmt->execute(['username' => $username]);
$user = $stmt->fetch();

if ($user && password_verify($password, $user['password'])) {
    sendJSONResponse(true, 'Login successful', $user);
} else {
    sendJSONResponse(false, 'Invalid credentials');
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
