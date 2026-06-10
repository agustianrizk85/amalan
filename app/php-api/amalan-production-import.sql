-- ─────────────────────────────────────────────────────────────
-- Amalan Al-Quran — Production Import
-- ─────────────────────────────────────────────────────────────
-- File mandiri: drop tabel lama → buat ulang → seed 6 user demo
-- + 6 entri amalan_log hari ini.
--
-- Cara import:
--   mysql -u USER -p DBNAME < amalan-production-import.sql
-- atau via phpMyAdmin → tab "Import" → pilih file ini.
--
-- ⚠️ HATI-HATI: file ini menjalankan DROP TABLE — semua data
-- pada tabel users / amalan_log / sessions akan hilang.
--
-- Login demo (semua user): password = "demo123"
-- ─────────────────────────────────────────────────────────────

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS `sessions`;
DROP TABLE IF EXISTS `amalan_log`;
DROP TABLE IF EXISTS `users`;
SET FOREIGN_KEY_CHECKS = 1;

-- ─────────────────────────────────────────────────────────────
-- TABLES
-- ─────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS `users` (
  `id` CHAR(36) NOT NULL,
  `name` VARCHAR(100) NOT NULL,
  `email` VARCHAR(150) DEFAULT NULL,
  `password_hash` VARCHAR(255) NOT NULL,
  `total_poin` INT NOT NULL DEFAULT 0,
  `streak_days` INT NOT NULL DEFAULT 0,
  `last_active` DATE DEFAULT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_email_unique` (`email`),
  KEY `users_total_poin_index` (`total_poin`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `amalan_log` (
  `id` CHAR(36) NOT NULL,
  `user_id` CHAR(36) NOT NULL,
  `surat_id` VARCHAR(50) NOT NULL,
  `surat_name` VARCHAR(100) NOT NULL,
  `poin` INT NOT NULL,
  `tanggal` DATE NOT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `amalan_log_user_surat_day_unique` (`user_id`, `surat_id`, `tanggal`),
  KEY `amalan_log_user_date_index` (`user_id`, `tanggal`),
  CONSTRAINT `fk_amalan_log_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `sessions` (
  `token` CHAR(64) NOT NULL,
  `user_id` CHAR(36) NOT NULL,
  `expires_at` TIMESTAMP NOT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`token`),
  KEY `sessions_user_index` (`user_id`),
  CONSTRAINT `fk_sessions_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─────────────────────────────────────────────────────────────
-- SEED DATA
-- Password semua user = "demo123" (bcrypt $2y$10$…)
-- ─────────────────────────────────────────────────────────────

INSERT INTO `users` (`id`, `name`, `email`, `password_hash`, `total_poin`, `streak_days`, `last_active`) VALUES
('16d11689-4e32-4e13-a321-2c8c6f36f010', 'Ahmad Fauzi',    'ahmad@demo.test',    '$2y$10$JDhM/Hym7DdvruXiowo7SOYZFsdsQ79ws7fqKrnW/VHswbe5XvBTi', 1240, 14, CURDATE()),
('d21ba0ba-badc-4ca5-ab14-182aa431993b', 'Siti Rahayu',    'siti@demo.test',     '$2y$10$UVIak7xQk.m605PYl7Gp7u2d7VLu9GOVYY8ElUuXKRKeW3z8aoHvi', 1105, 21, CURDATE()),
('023cf2ef-5170-4b43-aaef-81139321a31e', 'Muhammad Rizki', 'rizki@demo.test',    '$2y$10$R.wRikpUCwBmSAH0D8VPJezktQFX9Qri8ig916lzui3O6dTBtevGq', 980,  7,  CURDATE()),
('24d44d5e-eada-433b-a2d9-45d85100b3ac', 'Fatimah Zahra',  'fatimah@demo.test',  '$2y$10$/rX85X32ntr7ktWT3JWrNuSz47z3UxJXLiEJ3mfQosgI3GlqnKvfm', 875,  5,  CURDATE()),
('c923bf4d-441d-40bb-b05d-c94ec8ad376f', 'Yusuf Haikal',   'yusuf@demo.test',    '$2y$10$5qQmOSqUTZ8zo39nL9rwuOG/HYhM4cr3TTzGyHX/Mk5YyVVEqSP96', 760,  3,  CURDATE()),
('2b2e66ea-9609-4cab-8cd9-0164df91a5e1', 'Khadijah Putri', 'khadijah@demo.test', '$2y$10$0E4bwfD9XHnGS50Xua1P9./YHDvweL6U9C93mr6XNFBD.HF3NNI8y', 640,  2,  CURDATE());

INSERT INTO `amalan_log` (`id`, `user_id`, `surat_id`, `surat_name`, `poin`, `tanggal`) VALUES
('0c3254d6-9a6f-4342-a7f1-af29de8f5ed4', '16d11689-4e32-4e13-a321-2c8c6f36f010', 'kahfi',    'Al-Kahf',    65, CURDATE()),
('3e9cace4-b040-483c-a532-ec5a74eb928b', 'd21ba0ba-badc-4ca5-ab14-182aa431993b', 'yasin',    'Yā-Sīn',     55, CURDATE()),
('50f273f9-8670-4097-a29d-a8ba073ef8f5', '023cf2ef-5170-4b43-aaef-81139321a31e', 'waqiah',   'Al-Wāqi''ah', 50, CURDATE()),
('f9687ecb-e0f8-44fc-be3a-762da479e2a8', '24d44d5e-eada-433b-a2d9-45d85100b3ac', 'rahman',   'Ar-Rahmān',  45, CURDATE()),
('cf39fac9-e54d-44d1-9b6f-2a5d6267eb58', 'c923bf4d-441d-40bb-b05d-c94ec8ad376f', 'mulk',     'Al-Mulk',    35, CURDATE()),
('6d65f49f-38c4-400e-bff4-550fd9b10dcb', '2b2e66ea-9609-4cab-8cd9-0164df91a5e1', 'juzzamma', 'Juz ''Amma',  100, CURDATE());
