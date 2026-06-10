<?php
/**
 * SEED ADMIN — bikin / promote user jadi admin.
 *
 * Cara pakai:
 *   1. Upload ke document root API amalan (sejajar dengan index.php)
 *   2. EDIT kredensial di bawah (ADMIN_NAME, ADMIN_EMAIL, ADMIN_PASSWORD)
 *   3. Buka di browser: https://api-amalan-kamu.com/seed-admin.php
 *   4. ⚠️ WAJIB HAPUS FILE INI setelah selesai
 */

declare(strict_types=1);
header('Content-Type: text/plain; charset=utf-8');

// ─── EDIT DI SINI ─────────────────────────────────────────────
const ADMIN_NAME     = 'rikiadmin';
const ADMIN_EMAIL    = 'admin@amalan.test';    // boleh diganti, atau biarin
const ADMIN_PASSWORD = 'admin123';              // GANTI ini biar aman
// ──────────────────────────────────────────────────────────────

$configPath = __DIR__ . '/config.php';
if (!file_exists($configPath)) {
    die("ERROR: config.php tidak ada.\n");
}
$config = require $configPath;

try {
    $pdo = new PDO(
        sprintf('mysql:host=%s;dbname=%s;charset=%s',
            $config['db_host'],
            $config['db_name'],
            $config['db_charset'] ?? 'utf8mb4'),
        $config['db_user'],
        $config['db_pass'] ?? $config['db_password'] ?? '',
        [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
    );

    // Pastikan kolom role exist (auto-add kalau belum)
    $col = $pdo->query("SHOW COLUMNS FROM users LIKE 'role'")->fetch();
    if (!$col) {
        echo "→ Kolom 'role' belum ada — auto add...\n";
        $pdo->exec(
            "ALTER TABLE users
             ADD COLUMN role ENUM('admin','user') NOT NULL DEFAULT 'user' AFTER password_hash"
        );
        echo "✓ Kolom 'role' added\n\n";
    }

    // Cek user existing by name
    $st = $pdo->prepare('SELECT id, name, email, role FROM users WHERE name = :n LIMIT 1');
    $st->execute([':n' => ADMIN_NAME]);
    $existing = $st->fetch(PDO::FETCH_ASSOC);

    if ($existing) {
        // User ada — promote jadi admin (dan reset password)
        $hash = password_hash(ADMIN_PASSWORD, PASSWORD_DEFAULT);
        $st = $pdo->prepare(
            'UPDATE users SET role = :r, password_hash = :h, email = :e WHERE id = :id'
        );
        $st->execute([
            ':r'  => 'admin',
            ':h'  => $hash,
            ':e'  => ADMIN_EMAIL,
            ':id' => $existing['id'],
        ]);
        echo "✓ User existing dipromote jadi ADMIN:\n";
        echo "  - id     : {$existing['id']}\n";
        echo "  - name   : " . ADMIN_NAME . "\n";
        echo "  - email  : " . ADMIN_EMAIL . " (di-update)\n";
        echo "  - password: " . ADMIN_PASSWORD . " (di-reset)\n";
        echo "  - role   : admin (was: {$existing['role']})\n";
    } else {
        // User belum ada — bikin baru
        $id   = generateUuid();
        $hash = password_hash(ADMIN_PASSWORD, PASSWORD_DEFAULT);
        $code = strtoupper(substr(bin2hex(random_bytes(4)), 0, 6));

        $st = $pdo->prepare(
            'INSERT INTO users (id, name, email, password_hash, role, referral_code)
             VALUES (:id, :n, :e, :h, :r, :rc)'
        );
        $st->execute([
            ':id' => $id,
            ':n'  => ADMIN_NAME,
            ':e'  => ADMIN_EMAIL,
            ':h'  => $hash,
            ':r'  => 'admin',
            ':rc' => $code,
        ]);
        echo "✓ User ADMIN baru dibuat:\n";
        echo "  - id     : $id\n";
        echo "  - name   : " . ADMIN_NAME . "\n";
        echo "  - email  : " . ADMIN_EMAIL . "\n";
        echo "  - password: " . ADMIN_PASSWORD . "\n";
        echo "  - role   : admin\n";
        echo "  - kode   : $code\n";
    }

    echo "\n────────────────────────────────────────\n";
    echo "✓ SELESAI\n\n";
    echo "Login pakai:\n";
    echo "  Email   : " . ADMIN_EMAIL . "\n";
    echo "  Nama    : " . ADMIN_NAME . "\n";
    echo "  Password: " . ADMIN_PASSWORD . "\n\n";
    echo "⚠️  HAPUS FILE INI (seed-admin.php) DARI SERVER SEKARANG JUGA!\n";

} catch (Throwable $e) {
    die("ERROR: " . $e->getMessage() . "\n");
}

function generateUuid(): string {
    $data = random_bytes(16);
    $data[6] = chr(ord($data[6]) & 0x0f | 0x40);
    $data[8] = chr(ord($data[8]) & 0x3f | 0x80);
    return vsprintf('%s%s-%s-%s-%s-%s%s%s', str_split(bin2hex($data), 4));
}
