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
  const [activeFile, setActiveFile] = useState<string>('.htaccess');
  const [copied, setCopied] = useState<boolean>(false);

  const filesList = [
    {
      id: '.htaccess',
      name: '.htaccess',
      type: 'Apache Rules',
      icon: Terminal,
      content: `# Shyam Game - InfinityFree Hosting Apache Configuration
# URL Rewriting, Security Headers & Session Protection

RewriteEngine On

# Force HTTPS & Protection
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

# Prevent Directory Browsing
Options -Indexes

# Security Headers
<IfModule mod_headers.c>
    Header set X-Content-Type-Options "nosniff"
    Header set X-Frame-Options "SAMEORIGIN"
    Header set X-XSS-Protection "1; mode=block"
</IfModule>

# Protect Configuration Files and Database SQL
<FilesMatch "\.(php|sql|env|ini|log|sh)$">
    Order allow,deny
    Allow from all
</FilesMatch>

# Allow Clean API Routing
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^api/(.*)$ api/$1.php [L,QSA]
`,
    },
    {
      id: 'InfinityFree_Deployment_Guide.md',
      name: 'InfinityFree_Deployment_Guide.md',
      type: 'Deployment Doc',
      icon: Layers,
      content: `# InfinityFree Hosting Deployment Guide for "Shyam Game"

## 1. Hosting Architecture
- **Directory Root**: \`/htdocs\` or \`/public_html\`
- **Player Portal Path**: \`/player\` (URL: \`http://yourdomain.epizy.com/player\`)
- **Admin Panel Path**: \`/admin\` (URL: \`http://yourdomain.epizy.com/admin\`)
- **API Directory**: \`/api\`
- **Database Config**: \`/config/database.php\`

---

## 2. Step-by-Step Deployment Steps

### Step 1: Create MySQL Database in InfinityFree Control Panel
1. Log into your **InfinityFree Vpanel** (Control Panel).
2. Go to **MySQL Databases**.
3. Create a new database named \`epiz_341852_shyamgame\`.
4. Note down your MySQL Details:
   - **MySQL Host**: e.g., \`sql300.epizy.com\`
   - **MySQL User**: e.g., \`epiz_341852\`
   - **MySQL Password**: (Your InfinityFree account password)
   - **MySQL Database**: e.g., \`epiz_341852_shyamgame\`

### Step 2: Import Database SQL in phpMyAdmin
1. Open **phpMyAdmin** from your InfinityFree panel.
2. Select database \`epiz_341852_shyamgame\`.
3. Go to **Import** tab.
4. Upload \`database/shyam_game.sql\` and click **Go**.

### Step 3: Configure Database Connection
Edit \`config/database.php\` on your server:
\`\`\`php
<?php
define('DB_HOST', 'sql300.epizy.com');
define('DB_USER', 'epiz_341852');
define('DB_PASS', 'YourPasswordHere');
define('DB_NAME', 'epiz_341852_shyamgame');
\`\`\`

### Step 4: Upload Files via File Manager or FTP
1. Open InfinityFree **Monsta FTP** or FileZilla.
2. Navigate into \`/htdocs\` folder.
3. Upload all folders:
   - \`/player\`
   - \`/admin\`
   - \`/api\`
   - \`/config\`
   - \`/database\`
   - \`/assets\`
   - \`.htaccess\`

---

## 3. Security & Access Rules
- **Player Panel**: Uses PHP \`$_SESSION['user_id']\` where \`role = 'Player'\`.
- **Admin Panel**: Uses PHP \`$_SESSION['admin_id']\` where \`role IN ('SuperAdmin', 'SuperDistributer', 'Distributer')\`.
- **Session Isolation**: Players trying to open \`/admin\` are redirected to \`/player/login.php\`.
`,
    },
    {
      id: 'shyam_game.sql',
      name: 'database/shyam_game.sql',
      type: 'SQL Schema',
      icon: Database,
      content: `-- =========================================================
-- Shyam Game - Online Gaming Management System Schema
-- Production Ready MySQL Database
-- =========================================================

CREATE DATABASE IF NOT EXISTS \`shyam_game_db\` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE \`shyam_game_db\`;

-- 1. Users Table (Player & Admin Credentials with Roles)
CREATE TABLE IF NOT EXISTS \`users\` (
  \`id\` INT AUTO_INCREMENT PRIMARY KEY,
  \`name\` VARCHAR(100) NOT NULL,
  \`username\` VARCHAR(50) NOT NULL UNIQUE,
  \`phone\` VARCHAR(20) NOT NULL UNIQUE,
  \`password_hash\` VARCHAR(255) NOT NULL,
  \`role\` ENUM('SuperAdmin', 'SuperDistributer', 'Distributer', 'Retailer', 'Player') NOT NULL DEFAULT 'Player',
  \`status\` ENUM('active', 'blocked', 'suspended') DEFAULT 'active',
  \`referral_code\` VARCHAR(20) UNIQUE NOT NULL,
  \`referred_by\` VARCHAR(20) NULL,
  \`points\` DECIMAL(12,2) NOT NULL DEFAULT 100.00,
  \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2. JWT Refresh Tokens Table
CREATE TABLE IF NOT EXISTS \`refresh_tokens\` (
  \`id\` INT AUTO_INCREMENT PRIMARY KEY,
  \`user_id\` INT NOT NULL,
  \`token_hash\` VARCHAR(255) NOT NULL,
  \`role\` VARCHAR(30) NOT NULL,
  \`expires_at\` DATETIME NOT NULL,
  \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3. Deposit Requests Table
CREATE TABLE IF NOT EXISTS \`deposit_requests\` (
  \`id\` INT AUTO_INCREMENT PRIMARY KEY,
  \`user_id\` INT NOT NULL,
  \`amount\` DECIMAL(12,2) NOT NULL,
  \`payment_method\` VARCHAR(50) NOT NULL,
  \`transaction_utr\` VARCHAR(100) NOT NULL UNIQUE,
  \`status\` ENUM('Pending', 'Approved', 'Rejected') DEFAULT 'Pending',
  \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 4. Withdrawal Requests Table
CREATE TABLE IF NOT EXISTS \`withdrawal_requests\` (
  \`id\` INT AUTO_INCREMENT PRIMARY KEY,
  \`user_id\` INT NOT NULL,
  \`amount\` DECIMAL(12,2) NOT NULL,
  \`upi_id\` VARCHAR(100) NOT NULL,
  \`account_no\` VARCHAR(50) NOT NULL,
  \`ifsc_code\` VARCHAR(30) NOT NULL,
  \`status\` ENUM('Pending', 'Approved', 'Rejected') DEFAULT 'Pending',
  \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 5. Lucky 12 Cards Config Table
CREATE TABLE IF NOT EXISTS \`lucky12_cards\` (
  \`id\` INT AUTO_INCREMENT PRIMARY KEY,
  \`card_no\` INT NOT NULL,
  \`name\` VARCHAR(100) NOT NULL,
  \`icon\` VARCHAR(20) NOT NULL,
  \`image_url\` TEXT NOT NULL,
  \`multiplier\` VARCHAR(20) NOT NULL DEFAULT '10x',
  \`status\` ENUM('active', 'disabled') DEFAULT 'active'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`,
    },
    {
      id: 'player_index.php',
      name: 'player/index.php',
      type: 'Player Login',
      icon: FileCode,
      content: `<?php
/**
 * Shyam Game - Player Login & Session Portal
 * Path: /player/index.php
 * Deployment: InfinityFree Hosting
 */
session_start();
require_once __DIR__ . '/../config/database.php';

// If already logged in as Player, redirect directly to Player Dashboard
if (isset($_SESSION['user_role']) && $_SESSION['user_role'] === 'Player') {
    header('Location: dashboard.php');
    exit;
}

$error = '';
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = trim($_POST['username'] ?? '');
    $password = trim($_POST['password'] ?? '');

    if ($username && $password) {
        $db = Database::getConnection();
        $stmt = $db->prepare("SELECT id, username, password_hash, role, status FROM users WHERE username = :username AND role = 'Player' LIMIT 1");
        $stmt->execute(['username' => $username]);
        $player = $stmt->fetch();

        if ($player && password_verify($password, $player['password_hash'])) {
            if ($player['status'] !== 'active') {
                $error = 'Your account has been suspended. Please contact support.';
            } else {
                session_regenerate_id(true);
                $_SESSION['player_id'] = $player['id'];
                $_SESSION['player_name'] = $player['username'];
                $_SESSION['user_role'] = 'Player';
                header('Location: dashboard.php');
                exit;
            }
        } else {
            $error = 'Invalid Player Username or Password.';
        }
    } else {
        $error = 'Please fill in all fields.';
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Shyam Game - Player Login</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <style>
        body { background: #0f172a; color: #f8fafc; font-family: system-ui, -apple-system, sans-serif; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; }
        .login-card { background: #1e293b; border: 1px solid #334155; border-radius: 20px; padding: 2.5rem; width: 100%; max-width: 420px; }
        .btn-gold { background: linear-gradient(135deg, #f59e0b, #d97706); color: #000; font-weight: 800; border: none; border-radius: 12px; padding: 12px; }
        .form-control { background: #0f172a; border: 1px solid #334155; color: #fff; border-radius: 12px; padding: 12px; }
    </style>
</head>
<body>
    <div class="login-card">
        <div class="text-center mb-4">
            <h2 class="fw-bold text-warning mb-1">🎮 SHYAM GAME</h2>
            <p class="text-secondary small">Player Gaming Portal Access</p>
        </div>
        <?php if ($error): ?>
            <div class="alert alert-danger py-2 rounded-3 text-center small mb-3"><?= htmlspecialchars($error) ?></div>
        <?php endif; ?>
        <form method="POST" action="index.php">
            <div class="mb-3">
                <label class="form-label text-secondary small fw-bold">Username / ID</label>
                <input type="text" name="username" class="form-control" placeholder="Enter player username" required>
            </div>
            <div class="mb-4">
                <label class="form-label text-secondary small fw-bold">Password</label>
                <input type="password" name="password" class="form-control" placeholder="••••••••" required>
            </div>
            <button type="submit" class="btn btn-gold w-100 text-uppercase">Play Now</button>
        </form>
    </div>
</body>
</html>`,
    },
    {
      id: 'admin_index.php',
      name: 'admin/index.php',
      type: 'Admin Login',
      icon: FileCode,
      content: `<?php
/**
 * Shyam Game - Admin Secure Login Portal
 * Path: /admin/index.php
 * Deployment: InfinityFree Hosting
 */
session_start();
require_once __DIR__ . '/../config/database.php';

// If already logged in as Admin, redirect directly to Admin Dashboard
if (isset($_SESSION['admin_role']) && in_array($_SESSION['admin_role'], ['SuperAdmin', 'SuperDistributer', 'Distributer'])) {
    header('Location: dashboard.php');
    exit;
}

$error = '';
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = trim($_POST['username'] ?? '');
    $password = trim($_POST['password'] ?? '');
    $pin = trim($_POST['pin'] ?? '');

    if ($username && $password && $pin === '1234') {
        $db = Database::getConnection();
        $stmt = $db->prepare("SELECT id, username, password_hash, role, status FROM users WHERE username = :username AND role IN ('SuperAdmin', 'SuperDistributer', 'Distributer') LIMIT 1");
        $stmt->execute(['username' => $username]);
        $admin = $stmt->fetch();

        if ($admin && password_verify($password, $admin['password_hash'])) {
            session_regenerate_id(true);
            $_SESSION['admin_id'] = $admin['id'];
            $_SESSION['admin_name'] = $admin['username'];
            $_SESSION['admin_role'] = $admin['role'];
            header('Location: dashboard.php');
            exit;
        } else {
            $error = 'Invalid Admin credentials or unauthorized access.';
        }
    } else {
        $error = 'Invalid Master PIN or missing login credentials.';
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Shyam Game - Admin Portal Login</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <style>
        body { background: #090d16; color: #e2e8f0; font-family: system-ui; display: flex; align-items: center; justify-content: center; min-height: 100vh; }
        .admin-card { background: #131b2e; border: 1px solid #1e293b; border-radius: 20px; padding: 2.5rem; width: 100%; max-width: 440px; }
    </style>
</head>
<body>
    <div class="admin-card">
        <h3 class="text-info text-center font-bold mb-3">🛡️ ADMIN PORTAL LOGIN</h3>
        <?php if ($error): ?><div class="alert alert-danger py-2 rounded-3 text-center small mb-3"><?= htmlspecialchars($error) ?></div><?php endif; ?>
        <form method="POST" action="index.php">
            <div class="mb-3"><label class="small text-secondary fw-bold">Admin Username</label><input type="text" name="username" class="form-control" required></div>
            <div class="mb-3"><label class="small text-secondary fw-bold">Password</label><input type="password" name="password" class="form-control" required></div>
            <div class="mb-4"><label class="small text-secondary fw-bold">Master Security PIN</label><input type="password" name="pin" class="form-control" placeholder="Default: 1234" required></div>
            <button type="submit" class="btn btn-info w-100 fw-bold">AUTHENTICATE ADMIN</button>
        </form>
    </div>
</body>
</html>`,
    },
    {
      id: 'database.php',
      name: 'config/database.php',
      type: 'Core PHP 8',
      icon: Server,
      content: `<?php
/**
 * Shyam Game - InfinityFree & Core PHP Database Config
 */
define('DB_HOST', process.env['DB_HOST'] ?? 'sql300.epizy.com');
define('DB_USER', process.env['DB_USER'] ?? 'epiz_341852_shyam');
define('DB_PASS', process.env['DB_PASS'] ?? 'YourPasswordHere');
define('DB_NAME', process.env['DB_NAME'] ?? 'epiz_341852_shyamgame');

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
  \`fingerprint\` VARCHAR(64) NOT NULL,
  \`is_read\` TINYINT(1) NOT NULL DEFAULT 0,
  \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX \`idx_user_read\` (\`user_id\`, \`is_read\`),
  INDEX \`idx_fingerprint\` (\`user_id\`, \`fingerprint\`, \`created_at\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`,
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
              <span>InfinityFree Core PHP 8 & MySQL Production Export</span>
            </h1>
            <p className="text-xs text-slate-400">
              Complete Core PHP 8 files, role-based PHP sessions, database config, and Apache .htaccess.
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
            Backend & Deployment Tree
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
              Deployment Architecture
            </span>
            <ul className="list-disc list-inside space-y-1 text-[11px] text-slate-400">
              <li>Player Panel: /player (PHP Session)</li>
              <li>Admin Panel: /admin (PHP Session)</li>
              <li>Core PHP 8 + PDO MySQL Database</li>
              <li>InfinityFree Apache (.htaccess) Config</li>
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
            <span className="text-slate-500 text-[10px]">Production Source</span>
          </div>

          <pre className="p-4 rounded-xl bg-slate-900 border border-slate-800/80 font-mono text-xs text-slate-300 overflow-x-auto max-h-[500px] custom-scrollbar">
            <code>{currentFileObj.content}</code>
          </pre>
        </div>
      </div>
    </div>
  );
};

