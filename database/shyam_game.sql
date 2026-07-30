-- =========================================================
-- Shyam Game - Online Gaming Management System Schema
-- Core PHP 8 + MySQL Database Definition
-- =========================================================

SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS `bets`;
DROP TABLE IF EXISTS `results`;
DROP TABLE IF EXISTS `transactions`;
DROP TABLE IF EXISTS `wallet`;
DROP TABLE IF EXISTS `games`;
DROP TABLE IF EXISTS `users`;
DROP TABLE IF EXISTS `admins`;
DROP TABLE IF EXISTS `settings`;
SET FOREIGN_KEY_CHECKS = 1;

-- ---------------------------------------------------------
-- 1. Admins Table
-- ---------------------------------------------------------
CREATE TABLE `admins` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `username` VARCHAR(50) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL,
  `email` VARCHAR(100) NOT NULL UNIQUE,
  `role` ENUM('SuperAdmin', 'Manager') DEFAULT 'SuperAdmin',
  `security_pin` VARCHAR(10) DEFAULT '8899',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert default admin (Password: admin123)
INSERT INTO `admins` (`id`, `username`, `password`, `email`, `role`, `security_pin`) VALUES
(1, 'superadmin', '$2y$10$e.wA2zEa4sDkX.yO93Xp4.x8M3kY7Vn1B2Z3C4D5E6F7G8H9I0J1K', 'admin@shyamgame.com', 'SuperAdmin', '8899');

-- ---------------------------------------------------------
-- 2. Users Table (Multi-Tier Hierarchy)
-- ---------------------------------------------------------
CREATE TABLE `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL,
  `username` VARCHAR(50) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL,
  `email` VARCHAR(100) NULL,
  `phone` VARCHAR(20) NULL,
  `role` ENUM('SuperDistributer', 'Distributer', 'Retailer', 'User') NOT NULL DEFAULT 'User',
  `parent_id` INT NULL,
  `commission_rate` DECIMAL(5,2) DEFAULT 5.00,
  `credit_limit` DECIMAL(12,2) DEFAULT 0.00,
  `status` ENUM('active', 'blocked', 'suspended') DEFAULT 'active',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `fk_users_parent` FOREIGN KEY (`parent_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Sample Hierarchy Users
INSERT INTO `users` (`id`, `name`, `username`, `password`, `email`, `phone`, `role`, `parent_id`, `commission_rate`, `credit_limit`, `status`) VALUES
(1, 'Aman Sharma', 'super_aman', '$2y$10$e.wA2zEa4sDkX.yO93Xp4.x8M3kY7Vn1B2Z3C4D5E6F7G8H9I0J1K', 'aman@shyam.com', '9876543210', 'SuperDistributer', NULL, 8.50, 1000000.00, 'active'),
(2, 'Rahul Verma', 'dist_rahul', '$2y$10$e.wA2zEa4sDkX.yO93Xp4.x8M3kY7Vn1B2Z3C4D5E6F7G8H9I0J1K', 'rahul@shyam.com', '9876543211', 'Distributer', 1, 6.00, 500000.00, 'active'),
(3, 'Vijay Retail', 'ret_vijay', '$2y$10$e.wA2zEa4sDkX.yO93Xp4.x8M3kY7Vn1B2Z3C4D5E6F7G8H9I0J1K', 'vijay@shyam.com', '9876543212', 'Retailer', 2, 4.00, 100000.00, 'active'),
(4, 'Suresh Player', 'player_suresh', '$2y$10$e.wA2zEa4sDkX.yO93Xp4.x8M3kY7Vn1B2Z3C4D5E6F7G8H9I0J1K', 'suresh@shyam.com', '9876543213', 'User', 3, 0.00, 0.00, 'active');

-- ---------------------------------------------------------
-- 3. Wallet Table
-- ---------------------------------------------------------
CREATE TABLE `wallet` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL UNIQUE,
  `balance` DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `fk_wallet_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `wallet` (`user_id`, `balance`) VALUES
(1, 450000.00),
(2, 180000.00),
(3, 75000.00),
(4, 25000.00);

-- ---------------------------------------------------------
-- 4. Games Catalog Table
-- ---------------------------------------------------------
CREATE TABLE `games` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `code` VARCHAR(30) NOT NULL UNIQUE,
  `name` VARCHAR(100) NOT NULL,
  `multiplier` DECIMAL(8,2) NOT NULL DEFAULT 10.00,
  `rtp_percentage` DECIMAL(5,2) DEFAULT 80.00,
  `house_margin` DECIMAL(5,2) DEFAULT 20.00,
  `mode` ENUM('Auto', 'Manual', 'High Margin') DEFAULT 'Auto',
  `status` ENUM('active', 'inactive') DEFAULT 'active',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `games` (`id`, `code`, `name`, `multiplier`, `rtp_percentage`, `house_margin`, `mode`, `status`) VALUES
(1, '2D_LOTTERY', 'Number Selection Game (2D)', 90.00, 80.00, 20.00, 'Auto', 'active'),
(2, '3D_LOTTERY', 'Three Digit Prediction Game (3D)', 900.00, 75.00, 25.00, 'Auto', 'active'),
(3, 'LUCKY_12', 'Lucky Selection Game (Lucky 12)', 10.00, 85.00, 15.00, 'Auto', 'active');

-- ---------------------------------------------------------
-- 5. Game Results Table
-- ---------------------------------------------------------
CREATE TABLE `results` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `game_id` INT NOT NULL,
  `draw_number` VARCHAR(50) NOT NULL,
  `winning_result` VARCHAR(50) NOT NULL,
  `draw_time` DATETIME NOT NULL,
  `total_bets` DECIMAL(12,2) DEFAULT 0.00,
  `total_payout` DECIMAL(12,2) DEFAULT 0.00,
  `status` ENUM('Declared', 'Live', 'Upcoming') DEFAULT 'Declared',
  `declared_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_results_game` FOREIGN KEY (`game_id`) REFERENCES `games` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `results` (`game_id`, `draw_number`, `winning_result`, `draw_time`, `total_bets`, `total_payout`, `status`) VALUES
(1, 'DRW-2D-8801', '89', '2026-07-30 11:30:00', 45000.00, 31500.00, 'Declared'),
(2, 'DRW-3D-4402', '489', '2026-07-30 11:30:00', 38000.00, 27000.00, 'Declared'),
(3, 'DRW-L12-1103', 'Card #07', '2026-07-30 11:30:00', 21000.00, 15000.00, 'Declared');

-- ---------------------------------------------------------
-- 6. Bets Table
-- ---------------------------------------------------------
CREATE TABLE `bets` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `ticket_no` VARCHAR(50) NOT NULL UNIQUE,
  `user_id` INT NOT NULL,
  `game_id` INT NOT NULL,
  `draw_number` VARCHAR(50) NOT NULL,
  `selected_numbers` TEXT NOT NULL,
  `bet_amount` DECIMAL(12,2) NOT NULL,
  `win_amount` DECIMAL(12,2) DEFAULT 0.00,
  `status` ENUM('Won', 'Lost', 'Pending', 'Cancelled') DEFAULT 'Pending',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_bets_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_bets_game` FOREIGN KEY (`game_id`) REFERENCES `games` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `bets` (`ticket_no`, `user_id`, `game_id`, `draw_number`, `selected_numbers`, `bet_amount`, `win_amount`, `status`) VALUES
('SHM-20260730-8801', 4, 1, 'DRW-2D-8801', '89, 24', 500.00, 45000.00, 'Won'),
('SHM-20260730-8802', 4, 2, 'DRW-3D-4402', '489', 200.00, 0.00, 'Lost'),
('SHM-20260730-8803', 4, 3, 'DRW-L12-1103', 'Card #07', 300.00, 3000.00, 'Won');

-- ---------------------------------------------------------
-- 7. Transactions Table
-- ---------------------------------------------------------
CREATE TABLE `transactions` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `ref_id` VARCHAR(50) NOT NULL UNIQUE,
  `user_id` INT NOT NULL,
  `from_user` VARCHAR(50) NOT NULL,
  `to_user` VARCHAR(50) NOT NULL,
  `type` ENUM('Credit', 'Debit', 'Commission', 'Win Payout', 'Refund') NOT NULL,
  `amount` DECIMAL(12,2) NOT NULL,
  `balance_after` DECIMAL(12,2) NOT NULL,
  `remark` TEXT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_transactions_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `transactions` (`ref_id`, `user_id`, `from_user`, `to_user`, `type`, `amount`, `balance_after`, `remark`) VALUES
('REF-918234', 4, 'superadmin', 'player_suresh', 'Credit', 10000.00, 10000.00, 'Initial point load'),
('REF-918235', 4, 'player_suresh', 'System', 'Debit', 500.00, 9500.00, 'Bet placement for 2D Lottery'),
('REF-918236', 4, 'System', 'player_suresh', 'Win Payout', 45000.00, 54500.00, 'Winning payout for Ticket #SHM-20260730-8801');

-- ---------------------------------------------------------
-- 8. Global System Settings Table
-- ---------------------------------------------------------
CREATE TABLE `settings` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `setting_key` VARCHAR(100) NOT NULL UNIQUE,
  `setting_value` TEXT NULL,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `settings` (`setting_key`, `setting_value`) VALUES
('site_title', 'Shyam Game - Premium Gaming Management System'),
('min_deposit', '100'),
('max_deposit', '500000'),
('min_withdrawal', '500'),
('maintenance_mode', 'off'),
('currency_symbol', '₹');

SET FOREIGN_KEY_CHECKS = 1;
