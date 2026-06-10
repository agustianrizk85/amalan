-- ═══════════════════════════════════════════
-- AMALAN HARIAN — Migration Script (idempotent)
-- Jalankan di phpMyAdmin atau:
--   mysql -u USER -p DBNAME < migrate.sql
--
-- Aman dijalankan berulang kali — semua DDL dicek dulu.
-- ═══════════════════════════════════════════

SET NAMES utf8mb4;
SET time_zone = '+00:00';

-- 1) USERS — buat kalau belum ada
CREATE TABLE IF NOT EXISTS users (
  id            CHAR(36)      NOT NULL,
  name          VARCHAR(100)  NOT NULL,
  email         VARCHAR(150)  DEFAULT NULL,
  password_hash VARCHAR(255)  NOT NULL,
  total_poin    INT           NOT NULL DEFAULT 0,
  streak_days   INT           NOT NULL DEFAULT 0,
  last_active   DATE          DEFAULT NULL,
  created_at    TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uniq_email (email),
  KEY idx_total_poin (total_poin)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2) AMALAN_LOG — buat kalau belum ada (sudah dengan kolom count_n)
CREATE TABLE IF NOT EXISTS amalan_log (
  id          CHAR(36)     NOT NULL,
  user_id     CHAR(36)     NOT NULL,
  surat_id    VARCHAR(50)  NOT NULL,
  surat_name  VARCHAR(100) NOT NULL,
  poin        INT          NOT NULL,
  count_n     INT          NOT NULL DEFAULT 1,
  tanggal     DATE         NOT NULL,
  created_at  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uniq_user_surat_day (user_id, surat_id, tanggal),
  KEY idx_user_tgl (user_id, tanggal),
  CONSTRAINT fk_log_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3) SESSIONS
CREATE TABLE IF NOT EXISTS sessions (
  token       CHAR(64)   NOT NULL,
  user_id     CHAR(36)   NOT NULL,
  expires_at  TIMESTAMP  NOT NULL,
  created_at  TIMESTAMP  NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (token),
  KEY idx_session_user (user_id),
  CONSTRAINT fk_session_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4) MIGRATION untuk DB existing yang belum punya kolom count_n
-- Gunakan stored procedure agar idempotent (tidak error jika sudah ada)
DROP PROCEDURE IF EXISTS amalan_migrate_count_n;
DELIMITER $$
CREATE PROCEDURE amalan_migrate_count_n()
BEGIN
  DECLARE col_exists INT DEFAULT 0;
  SELECT COUNT(*) INTO col_exists
  FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = 'amalan_log'
    AND COLUMN_NAME = 'count_n';
  IF col_exists = 0 THEN
    ALTER TABLE amalan_log ADD COLUMN count_n INT NOT NULL DEFAULT 1 AFTER poin;
  END IF;
END$$
DELIMITER ;
CALL amalan_migrate_count_n();
DROP PROCEDURE amalan_migrate_count_n;

-- 5) Cleanup session expired (opsional — jalankan periodik)
-- DELETE FROM sessions WHERE expires_at < NOW();

-- ═══════════════════════════════════════════
-- 6z) USER GENDER — untuk gate fitur khusus wanita (haid)
-- ═══════════════════════════════════════════
DROP PROCEDURE IF EXISTS amalan_migrate_gender;
DELIMITER $$
CREATE PROCEDURE amalan_migrate_gender()
BEGIN
  DECLARE col_exists INT DEFAULT 0;
  SELECT COUNT(*) INTO col_exists FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'users' AND COLUMN_NAME = 'gender';
  IF col_exists = 0 THEN
    ALTER TABLE users
      ADD COLUMN gender ENUM('male','female') DEFAULT NULL AFTER role;
  END IF;
END$$
DELIMITER ;
CALL amalan_migrate_gender();
DROP PROCEDURE amalan_migrate_gender;

-- ═══════════════════════════════════════════
-- 6a) USER ROLE — admin/user, untuk halaman admin
-- ═══════════════════════════════════════════
DROP PROCEDURE IF EXISTS amalan_migrate_role;
DELIMITER $$
CREATE PROCEDURE amalan_migrate_role()
BEGIN
  DECLARE col_exists INT DEFAULT 0;
  SELECT COUNT(*) INTO col_exists FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'users' AND COLUMN_NAME = 'role';
  IF col_exists = 0 THEN
    ALTER TABLE users
      ADD COLUMN role ENUM('admin','user') NOT NULL DEFAULT 'user' AFTER password_hash;
  END IF;
END$$
DELIMITER ;
CALL amalan_migrate_role();
DROP PROCEDURE amalan_migrate_role;

-- ═══════════════════════════════════════════
-- 6b) REFERRAL FEATURE — tambah kolom + tabel + backfill kode
-- ═══════════════════════════════════════════
DROP PROCEDURE IF EXISTS amalan_migrate_referral;
DELIMITER $$
CREATE PROCEDURE amalan_migrate_referral()
BEGIN
  DECLARE col_ref_code INT DEFAULT 0;
  DECLARE col_ref_by INT DEFAULT 0;

  SELECT COUNT(*) INTO col_ref_code FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'users' AND COLUMN_NAME = 'referral_code';
  SELECT COUNT(*) INTO col_ref_by FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'users' AND COLUMN_NAME = 'referred_by';

  IF col_ref_code = 0 THEN
    ALTER TABLE users
      ADD COLUMN referral_code VARCHAR(12) DEFAULT NULL AFTER last_active,
      ADD UNIQUE KEY uniq_referral_code (referral_code);
  END IF;

  IF col_ref_by = 0 THEN
    ALTER TABLE users
      ADD COLUMN referred_by CHAR(36) DEFAULT NULL AFTER referral_code,
      ADD KEY idx_referred_by (referred_by);
  END IF;
END$$
DELIMITER ;
CALL amalan_migrate_referral();
DROP PROCEDURE amalan_migrate_referral;

-- Buat tabel referrals kalau belum ada
CREATE TABLE IF NOT EXISTS referrals (
  id              CHAR(36)      NOT NULL,
  referrer_id     CHAR(36)      NOT NULL,
  referred_id     CHAR(36)      NOT NULL,
  poin_awarded    INT           NOT NULL DEFAULT 50,
  created_at      TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uniq_referred (referred_id),
  KEY idx_referrer (referrer_id),
  CONSTRAINT fk_ref_referrer FOREIGN KEY (referrer_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_ref_referred FOREIGN KEY (referred_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Backfill: generate referral_code untuk user existing yang belum punya.
-- Pakai stored procedure dengan retry-on-collision per-row supaya unique-constraint
-- aman walaupun ada banyak user atau UUID time-prefix bentrok.
DROP PROCEDURE IF EXISTS amalan_backfill_referral_codes;
DELIMITER $$
CREATE PROCEDURE amalan_backfill_referral_codes()
BEGIN
  DECLARE done INT DEFAULT 0;
  DECLARE u_id CHAR(36);
  DECLARE new_code VARCHAR(12);
  DECLARE attempts INT;
  DECLARE collision INT;

  DECLARE cur CURSOR FOR
    SELECT id FROM users WHERE referral_code IS NULL OR referral_code = '';
  DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = 1;

  OPEN cur;
  read_loop: LOOP
    FETCH cur INTO u_id;
    IF done THEN LEAVE read_loop; END IF;

    SET attempts = 0;
    retry: LOOP
      SET attempts = attempts + 1;
      -- 6 char random dari MD5 + waktu microsecond + id user, lalu sanitasi karakter ambigu
      SET new_code = UPPER(
        REPLACE(REPLACE(REPLACE(REPLACE(
          SUBSTRING(MD5(CONCAT(u_id, RAND(), NOW(6), attempts)), 1, 6),
          '0', 'A'), 'O', 'B'), '1', 'C'), 'I', 'D')
      );

      SELECT COUNT(*) INTO collision
        FROM users WHERE referral_code = new_code;

      IF collision = 0 THEN
        UPDATE users SET referral_code = new_code WHERE id = u_id;
        LEAVE retry;
      END IF;

      IF attempts >= 20 THEN
        -- fallback: pakai 8 char (kemungkinan collision jauh lebih kecil)
        SET new_code = UPPER(SUBSTRING(MD5(CONCAT(u_id, NOW(6), attempts)), 1, 8));
        UPDATE users SET referral_code = new_code WHERE id = u_id;
        LEAVE retry;
      END IF;
    END LOOP retry;
  END LOOP read_loop;
  CLOSE cur;
END$$
DELIMITER ;
CALL amalan_backfill_referral_codes();
DROP PROCEDURE amalan_backfill_referral_codes;

-- ═══════════════════════════════════════════
-- 7a) SHOLAT_LOG — tracking sholat wajib 5 waktu dengan 4 status
-- Status: tepat_waktu (10p) / telat (5p) / terlewat/qadha (2p) / uzur (0p, tidak putuskan streak)
-- ═══════════════════════════════════════════
CREATE TABLE IF NOT EXISTS sholat_log (
  id          CHAR(36)                                              NOT NULL,
  user_id     CHAR(36)                                              NOT NULL,
  tanggal     DATE                                                  NOT NULL,
  waktu       ENUM('subuh','dzuhur','ashar','maghrib','isya')       NOT NULL,
  status      ENUM('tepat_waktu','telat','terlewat','uzur')         NOT NULL,
  catatan     VARCHAR(255)                                          DEFAULT NULL,
  poin        INT                                                   NOT NULL DEFAULT 0,
  created_at  TIMESTAMP                                             NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP                                             NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uniq_user_tgl_waktu (user_id, tanggal, waktu),
  KEY idx_user_tanggal (user_id, tanggal),
  CONSTRAINT fk_sholat_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ═══════════════════════════════════════════
-- 7b) HAID_LOG — tracking periode haid muslimah
-- ═══════════════════════════════════════════
CREATE TABLE IF NOT EXISTS haid_log (
  id              CHAR(36)      NOT NULL,
  user_id         CHAR(36)      NOT NULL,
  tanggal_mulai   DATE          NOT NULL,
  tanggal_selesai DATE          DEFAULT NULL,
  catatan         VARCHAR(255)  DEFAULT NULL,
  created_at      TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at      TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_user_haid (user_id, tanggal_mulai),
  CONSTRAINT fk_haid_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ═══════════════════════════════════════════
-- 7c) PUASA_LOG — tracking puasa wajib (Ramadan) + sunnah
-- Jenis: ramadan, senin, kamis, ayyamul_bidh (13/14/15 Hijriah), syawal, arafah, asyura, daud, lainnya
-- Status: penuh / batal / uzur (haid otomatis uzur)
-- ═══════════════════════════════════════════
CREATE TABLE IF NOT EXISTS puasa_log (
  id          CHAR(36)                                                                          NOT NULL,
  user_id     CHAR(36)                                                                          NOT NULL,
  tanggal     DATE                                                                              NOT NULL,
  jenis       ENUM('ramadan','senin','kamis','ayyamul_bidh','syawal','arafah','asyura','daud','sunnah_lain')  NOT NULL,
  status      ENUM('penuh','batal','uzur')                                                      NOT NULL DEFAULT 'penuh',
  catatan     VARCHAR(255)                                                                      DEFAULT NULL,
  poin        INT                                                                               NOT NULL DEFAULT 0,
  created_at  TIMESTAMP                                                                         NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP                                                                         NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uniq_user_puasa_day (user_id, tanggal),
  KEY idx_user_puasa (user_id, tanggal),
  CONSTRAINT fk_puasa_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ═══════════════════════════════════════════
-- 7d) DZIKIR_LOG — pagi & petang
-- Kategori: pagi / petang / tidur / bangun
-- ═══════════════════════════════════════════
CREATE TABLE IF NOT EXISTS dzikir_log (
  id          CHAR(36)                                  NOT NULL,
  user_id     CHAR(36)                                  NOT NULL,
  tanggal     DATE                                      NOT NULL,
  kategori    ENUM('pagi','petang','tidur','bangun')    NOT NULL,
  poin        INT                                       NOT NULL DEFAULT 5,
  created_at  TIMESTAMP                                 NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uniq_user_dzikir_day (user_id, tanggal, kategori),
  KEY idx_user_dzikir (user_id, tanggal),
  CONSTRAINT fk_dzikir_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ═══════════════════════════════════════════
-- 7) APP_CONFIG — key/value untuk Meta Pixel, WA Group, CS contact
-- ═══════════════════════════════════════════
CREATE TABLE IF NOT EXISTS app_config (
  config_key    VARCHAR(64)   NOT NULL,
  config_value  TEXT          DEFAULT NULL,
  updated_at    TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (config_key)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Seed default kunci kalau belum ada (INSERT IGNORE biar idempotent)
INSERT IGNORE INTO app_config (config_key, config_value) VALUES
  ('meta_pixel_id',       ''),
  ('whatsapp_group_url',  ''),
  ('whatsapp_group_label','Gabung Grup WhatsApp Amalan'),
  ('cs_whatsapp_number',  ''),
  ('cs_name',             'Admin Amalan'),
  ('cs_label',            'Chat Admin via WhatsApp'),
  ('contact_enabled',     '1');

-- ═══════════════════════════════════════════
-- VERIFIKASI — query untuk cek hasil migrasi
-- ═══════════════════════════════════════════
SELECT 'users' AS tabel, COUNT(*) AS row_count FROM users
UNION ALL
SELECT 'amalan_log', COUNT(*) FROM amalan_log
UNION ALL
SELECT 'sessions', COUNT(*) FROM sessions
UNION ALL
SELECT 'referrals', COUNT(*) FROM referrals
UNION ALL
SELECT 'app_config', COUNT(*) FROM app_config
UNION ALL
SELECT 'sholat_log', COUNT(*) FROM sholat_log
UNION ALL
SELECT 'haid_log', COUNT(*) FROM haid_log
UNION ALL
SELECT 'puasa_log', COUNT(*) FROM puasa_log
UNION ALL
SELECT 'dzikir_log', COUNT(*) FROM dzikir_log;

-- Cek struktur users (harus ada referral_code + referred_by + role)
SHOW COLUMNS FROM users;

-- ═══════════════════════════════════════════
-- Set admin pertama (manual — edit email-nya):
-- UPDATE users SET role='admin' WHERE email='emailmu@contoh.com';
-- ═══════════════════════════════════════════
