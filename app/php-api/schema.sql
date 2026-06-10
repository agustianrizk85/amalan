-- Amalan Al-Quran — MySQL schema
-- Jalankan di phpMyAdmin atau via mysql CLI:
--   mysql -u USER -p DBNAME < schema.sql

SET NAMES utf8mb4;
SET time_zone = '+00:00';

CREATE TABLE IF NOT EXISTS users (
  id              CHAR(36)      NOT NULL,
  name            VARCHAR(100)  NOT NULL,
  email           VARCHAR(150)  DEFAULT NULL,
  password_hash   VARCHAR(255)  NOT NULL,
  role            ENUM('admin','user') NOT NULL DEFAULT 'user',
  gender          ENUM('male','female') DEFAULT NULL,
  total_poin      INT           NOT NULL DEFAULT 0,
  streak_days     INT           NOT NULL DEFAULT 0,
  last_active     DATE          DEFAULT NULL,
  referral_code   VARCHAR(12)   DEFAULT NULL,
  referred_by     CHAR(36)      DEFAULT NULL,
  created_at      TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uniq_email (email),
  UNIQUE KEY uniq_referral_code (referral_code),
  KEY idx_total_poin (total_poin),
  KEY idx_referred_by (referred_by)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

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

-- MIGRATION untuk DB existing (jalankan satu kali jika tabel sudah ada tanpa kolom count_n):
-- ALTER TABLE amalan_log ADD COLUMN count_n INT NOT NULL DEFAULT 1 AFTER poin;

CREATE TABLE IF NOT EXISTS sessions (
  token       CHAR(64)   NOT NULL,
  user_id     CHAR(36)   NOT NULL,
  expires_at  TIMESTAMP  NOT NULL,
  created_at  TIMESTAMP  NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (token),
  KEY idx_session_user (user_id),
  CONSTRAINT fk_session_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- App-wide config (key/value) untuk Meta Pixel, WhatsApp group, CS contact
CREATE TABLE IF NOT EXISTS app_config (
  config_key    VARCHAR(64)   NOT NULL,
  config_value  TEXT          DEFAULT NULL,
  updated_at    TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (config_key)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT IGNORE INTO app_config (config_key, config_value) VALUES
  ('meta_pixel_id',       ''),
  ('whatsapp_group_url',  ''),
  ('whatsapp_group_label','Gabung Grup WhatsApp Amalan'),
  ('cs_whatsapp_number',  ''),
  ('cs_name',             'Admin Amalan'),
  ('cs_label',            'Chat Admin via WhatsApp'),
  ('contact_enabled',     '1');

-- Sholat wajib 5 waktu tracker
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

-- Haid period tracker
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

-- Puasa wajib & sunnah tracker
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

-- Dzikir pagi/petang/tidur/bangun
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
