-- AfterHours MySQL Database Schema

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- 1. Users Table
CREATE TABLE IF NOT EXISTS `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `email` VARCHAR(255) NOT NULL UNIQUE,
  `full_name` VARCHAR(255),
  `hashed_password` VARCHAR(255) NOT NULL,
  `is_active` BOOLEAN DEFAULT TRUE,
  `is_superuser` BOOLEAN DEFAULT FALSE,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_user_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Trade Profiles
CREATE TABLE IF NOT EXISTS `trade_profiles` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL UNIQUE,
  `risk_tolerance` ENUM('CONSERVATIVE', 'MODERATE', 'AGGRESSIVE', 'DEGEN') DEFAULT 'MODERATE',
  `investment_style` VARCHAR(100) DEFAULT 'Day Trading',
  `bio` TEXT,
  `preferred_assets` JSON, -- List of assets like ["BTC", "SOL", "AAPL"]
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3. Trade DNA Scores
CREATE TABLE IF NOT EXISTS `trade_dna` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL UNIQUE,
  `score` DECIMAL(5, 2) NOT NULL DEFAULT 0.00,
  `category` VARCHAR(100) DEFAULT 'Neutral',
  `volatility_affinity` DECIMAL(5, 2) DEFAULT 0.00,
  `consistency_score` DECIMAL(5, 2) DEFAULT 0.00,
  `details` JSON, -- Structured JSON with various DNA metrics
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  INDEX `idx_dna_score` (`score`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 4. Signals (Original signals from leaders)
CREATE TABLE IF NOT EXISTS `signals` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `leader_id` INT NOT NULL,
  `asset` VARCHAR(50) NOT NULL,
  `side` ENUM('BUY', 'SELL') NOT NULL,
  `entry_price` DECIMAL(20, 8) NOT NULL,
  `stop_loss` DECIMAL(20, 8),
  `take_profit` DECIMAL(20, 8),
  `risk_level` INT DEFAULT 1, -- 1-5 scale
  `is_active` BOOLEAN DEFAULT TRUE,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`leader_id`) REFERENCES `users`(`id`),
  INDEX `idx_signal_asset` (`asset`),
  INDEX `idx_signal_active` (`is_active`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 5. Translated Signals (Personalized signals for users)
CREATE TABLE IF NOT EXISTS `translated_signals` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `signal_id` INT NOT NULL,
  `user_id` INT NOT NULL,
  `adjusted_size` DECIMAL(20, 8),
  `adjusted_stop_loss` DECIMAL(20, 8),
  `explanation` TEXT,
  `status` ENUM('PENDING', 'EXECUTED', 'EXPIRED', 'CANCELLED') DEFAULT 'PENDING',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`signal_id`) REFERENCES `signals`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  INDEX `idx_translated_user_status` (`user_id`, `status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 6. Emotional Checks
CREATE TABLE IF NOT EXISTS `emotional_checks` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `mood` VARCHAR(100) NOT NULL,
  `intensity` INT DEFAULT 5, -- 1-10 scale
  `notes` TEXT,
  `market_context` TEXT,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  INDEX `idx_emo_user_date` (`user_id`, `created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 7. Portfolios
CREATE TABLE IF NOT EXISTS `portfolios` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL UNIQUE,
  `total_balance` DECIMAL(20, 8) DEFAULT 0.00,
  `available_margin` DECIMAL(20, 8) DEFAULT 0.00,
  `currency` VARCHAR(10) DEFAULT 'USDT',
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 8. Chat History
CREATE TABLE IF NOT EXISTS `chat_history` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `message` TEXT NOT NULL,
  `response` TEXT NOT NULL,
  `sentiment` VARCHAR(50),
  `tokens_used` INT DEFAULT 0,
  `context_metadata` JSON,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  FULLTEXT INDEX `idx_chat_content` (`message`, `response`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 9. Notifications
CREATE TABLE IF NOT EXISTS `notifications` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `type` VARCHAR(50) DEFAULT 'INFO',
  `title` VARCHAR(255) NOT NULL,
  `message` TEXT,
  `is_read` BOOLEAN DEFAULT FALSE,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  INDEX `idx_notif_user_read` (`user_id`, `is_read`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 10. Trade History
CREATE TABLE IF NOT EXISTS `trade_history` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `signal_id` INT,
  `asset` VARCHAR(50) NOT NULL,
  `side` ENUM('BUY', 'SELL') NOT NULL,
  `entry_price` DECIMAL(20, 8) NOT NULL,
  `exit_price` DECIMAL(20, 8),
  `quantity` DECIMAL(20, 8) NOT NULL,
  `pnl` DECIMAL(20, 8) DEFAULT 0.00,
  `status` ENUM('OPEN', 'CLOSED', 'LIQUIDATED') DEFAULT 'CLOSED',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `closed_at` TIMESTAMP NULL,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`signal_id`) REFERENCES `signals`(`id`) ON DELETE SET NULL,
  INDEX `idx_history_user_asset` (`user_id`, `asset`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 11. Risk Logs
CREATE TABLE IF NOT EXISTS `risk_logs` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `action_type` VARCHAR(100) NOT NULL, -- e.g., 'DNA_UPDATE', 'STOP_LOSS_ADJUST'
  `previous_value` VARCHAR(255),
  `new_value` VARCHAR(255),
  `reason` TEXT,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 12. Leaderboard
CREATE TABLE IF NOT EXISTS `leaderboard` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL UNIQUE,
  `current_rank` INT,
  `total_pnl` DECIMAL(20, 8) DEFAULT 0.00,
  `win_rate` DECIMAL(5, 2) DEFAULT 0.00,
  `total_trades` INT DEFAULT 0,
  `points` INT DEFAULT 0,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  INDEX `idx_rank` (`current_rank`),
  INDEX `idx_points` (`points`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

SET FOREIGN_KEY_CHECKS = 1;
