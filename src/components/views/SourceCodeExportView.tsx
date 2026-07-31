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
  const [activeFile, setActiveFile] = useState<string>('vercel.json');
  const [copied, setCopied] = useState<boolean>(false);

  const filesList = [
    {
      id: 'vercel.json',
      name: 'vercel.json',
      type: 'Vercel Config',
      icon: Terminal,
      content: `{
  "version": 2,
  "name": "shyam-game-platform",
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ]
}`,
    },
    {
      id: 'VERCEL_DEPLOYMENT_GUIDE.md',
      name: 'VERCEL_DEPLOYMENT_GUIDE.md',
      type: 'Deployment Doc',
      icon: Layers,
      content: `# Vercel React SPA Single Project Deployment Guide

## Architecture
- **Framework**: React 19 + Vite + TypeScript
- **Router**: React Router DOM (v7)
- **Deployment Platform**: Vercel Single Project Deployment
- **Player Portal Route**: \`/player\` & \`/player/login\`
- **Admin Panel Route**: \`/admin\` & \`/admin/login\`

---

## Deploy to Vercel in 3 Steps

1. **Push Repository to GitHub / GitLab / Bitbucket**
2. **Import Project into Vercel Dashboard**
   - Framework Preset: **Vite**
   - Build Command: \`npm run build\`
   - Output Directory: \`dist\`
3. **Deploy**
   - Vercel will automatically read \`vercel.json\` SPA rewrites and route all deep paths (\`/player/*\`, \`/admin/*\`) to \`index.html\`.
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
`,
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
              <span>Vercel React SPA Production Deployment Export</span>
            </h1>
            <p className="text-xs text-slate-400">
              Complete Vercel rewrites configuration, deployment documentation, and SQL schema.
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
            Deployment Architecture
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
              <li>Player Route: /player (React Router)</li>
              <li>Admin Route: /admin (React Router)</li>
              <li>React 19 + Vite + TypeScript</li>
              <li>Vercel Single Project Deployment</li>
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

