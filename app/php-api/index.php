<?php
declare(strict_types=1);

// ─────────────────────────────────────────────────────────────
// LOAD CONFIG
// ─────────────────────────────────────────────────────────────
$configPath = __DIR__ . '/config.php';
if (!file_exists($configPath)) {
    header('Content-Type: application/json; charset=utf-8');
    http_response_code(500);
    echo json_encode(['message' => 'Missing config.php. Salin config.example.php menjadi config.php lalu isi kredensial DB.']);
    exit;
}
$config = require $configPath;

// ─────────────────────────────────────────────────────────────
// CORS
// ─────────────────────────────────────────────────────────────
$rawOrigins = $config['cors_origin'] ?? '*';
$allowed = is_array($rawOrigins) ? $rawOrigins : array_map('trim', explode(',', (string) $rawOrigins));
$reqOrigin = $_SERVER['HTTP_ORIGIN'] ?? '';
if (in_array('*', $allowed, true)) {
    $corsOrigin = $reqOrigin !== '' ? $reqOrigin : '*';
} elseif (in_array($reqOrigin, $allowed, true)) {
    $corsOrigin = $reqOrigin;
} else {
    $corsOrigin = $allowed[0];
}
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: ' . $corsOrigin);
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Access-Control-Max-Age: 86400');
header('Vary: Origin, Authorization');
// Cegah LiteSpeed / Cloudflare / browser cache response API per-user
header('Cache-Control: no-store, no-cache, must-revalidate, private');
header('Pragma: no-cache');
header('Expires: 0');
header('X-LiteSpeed-Cache-Control: no-cache');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

// ─────────────────────────────────────────────────────────────
// DB CONNECTION (PDO)
// ─────────────────────────────────────────────────────────────
try {
    $pdo = new PDO(
        sprintf('mysql:host=%s;dbname=%s;charset=%s', $config['db_host'], $config['db_name'], $config['db_charset'] ?? 'utf8mb4'),
        $config['db_user'],
        $config['db_pass'],
        [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false,
        ]
    );
} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode(['message' => 'DB connection failed', 'error' => $e->getMessage()]);
    exit;
}

// ─────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────
function uuid(): string {
    $b = random_bytes(16);
    $b[6] = chr((ord($b[6]) & 0x0f) | 0x40);
    $b[8] = chr((ord($b[8]) & 0x3f) | 0x80);
    return vsprintf('%s%s-%s-%s-%s-%s%s%s', str_split(bin2hex($b), 4));
}

function send(int $status, array $body): void {
    http_response_code($status);
    echo json_encode($body);
    exit;
}

function readJson(): array {
    $raw = file_get_contents('php://input') ?: '';
    if ($raw === '') return [];
    $data = json_decode($raw, true);
    return is_array($data) ? $data : [];
}

function bearerToken(): ?string {
    $h = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
    if ($h === '' && function_exists('apache_request_headers')) {
        $hh = apache_request_headers();
        $h = $hh['Authorization'] ?? $hh['authorization'] ?? '';
    }
    if (preg_match('/Bearer\s+([A-Za-z0-9]+)/', $h, $m)) return $m[1];
    return null;
}

function authUser(PDO $pdo): array {
    $token = bearerToken();
    if (!$token) send(401, ['message' => 'Unauthorized']);
    $stmt = $pdo->prepare(
        'SELECT u.* FROM sessions s JOIN users u ON u.id = s.user_id
         WHERE s.token = :t AND s.expires_at > NOW() LIMIT 1'
    );
    $stmt->execute([':t' => $token]);
    $user = $stmt->fetch();
    if (!$user) send(401, ['message' => 'Session expired']);
    return $user;
}

function publicUser(array $u): array {
    return [
        'id'            => $u['id'],
        'name'          => $u['name'],
        'email'         => $u['email'],
        'role'          => $u['role'] ?? 'user',
        'gender'        => $u['gender'] ?? null,
        'total_poin'    => (int) $u['total_poin'],
        'streak_days'   => (int) $u['streak_days'],
        'last_active'   => $u['last_active'],
        'referral_code' => $u['referral_code'] ?? null,
    ];
}

function avatarOf(string $name): string {
    $parts = preg_split('/\s+/', trim($name)) ?: [];
    $av = '';
    foreach ($parts as $p) {
        if ($p !== '') $av .= mb_substr($p, 0, 1);
        if (mb_strlen($av) >= 2) break;
    }
    return mb_strtoupper($av);
}

function generateReferralCode(PDO $pdo): string {
    // Generate 6-char code, retry kalau collision
    for ($i = 0; $i < 10; $i++) {
        $code = strtoupper(substr(bin2hex(random_bytes(4)), 0, 6));
        // Hindari ambigu (0/O, 1/I) — replace dengan huruf lain
        $code = strtr($code, ['0' => 'A', 'O' => 'B', '1' => 'C', 'I' => 'D']);
        $st = $pdo->prepare('SELECT 1 FROM users WHERE referral_code = :c LIMIT 1');
        $st->execute([':c' => $code]);
        if (!$st->fetchColumn()) return $code;
    }
    return strtoupper(substr(bin2hex(random_bytes(6)), 0, 12));
}

// ─────────────────────────────────────────────────────────────
// ROUTING
// ─────────────────────────────────────────────────────────────
$path = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH) ?? '/';
// Buang prefix /api jika ada (untuk dev proxy / shared hosting di subfolder)
$path = preg_replace('#^.*?/(?:api|php-api)#', '', $path) ?: $path;
$path = '/' . trim($path, '/');
$method = $_SERVER['REQUEST_METHOD'];

try {
    // ── REGISTER ─────────────────────────────────────────────
    if ($method === 'POST' && $path === '/register') {
        $b = readJson();
        $name = trim((string)($b['name'] ?? ''));
        $email = trim((string)($b['email'] ?? ''));
        $password = (string)($b['password'] ?? '');
        $referralCode = strtoupper(trim((string)($b['referral_code'] ?? '')));
        $gender = trim((string)($b['gender'] ?? ''));

        if ($name === '' || $password === '') send(400, ['message' => 'Nama dan password wajib diisi']);
        if (strlen($password) < 6) send(400, ['message' => 'Password minimal 6 karakter']);
        if ($gender === '' || !in_array($gender, ['male','female'], true)) {
            send(400, ['message' => 'Jenis kelamin wajib dipilih (laki-laki atau perempuan)']);
        }

        if ($email !== '') {
            $st = $pdo->prepare('SELECT 1 FROM users WHERE email = :e');
            $st->execute([':e' => $email]);
            if ($st->fetchColumn()) send(409, ['message' => 'Email sudah terdaftar']);
        }

        // Validasi referral code (opsional)
        $referrer = null;
        if ($referralCode !== '') {
            $st = $pdo->prepare('SELECT * FROM users WHERE referral_code = :c LIMIT 1');
            $st->execute([':c' => $referralCode]);
            $referrer = $st->fetch();
            if (!$referrer) {
                send(400, ['message' => 'Kode referral tidak valid']);
            }
        }

        $id = uuid();
        $hash = password_hash($password, PASSWORD_DEFAULT);
        $newCode = generateReferralCode($pdo);

        $pdo->beginTransaction();
        try {
            $st = $pdo->prepare(
                'INSERT INTO users (id, name, email, password_hash, gender, referral_code, referred_by)
                 VALUES (:id, :n, :e, :h, :g, :rc, :rb)'
            );
            $st->execute([
                ':id' => $id,
                ':n'  => $name,
                ':e'  => $email !== '' ? $email : null,
                ':h'  => $hash,
                ':g'  => $gender,
                ':rc' => $newCode,
                ':rb' => $referrer ? $referrer['id'] : null,
            ]);

            // Beri reward ke referrer kalau ada
            if ($referrer) {
                $reward = 50;
                $st = $pdo->prepare(
                    'INSERT INTO referrals (id, referrer_id, referred_id, poin_awarded)
                     VALUES (:id, :rr, :rd, :p)'
                );
                $st->execute([
                    ':id' => uuid(),
                    ':rr' => $referrer['id'],
                    ':rd' => $id,
                    ':p'  => $reward,
                ]);
                $st = $pdo->prepare('UPDATE users SET total_poin = total_poin + :p WHERE id = :id');
                $st->execute([':p' => $reward, ':id' => $referrer['id']]);
            }

            $pdo->commit();
        } catch (Throwable $e) {
            $pdo->rollBack();
            throw $e;
        }

        $token = bin2hex(random_bytes(32));
        $ttl = (int)($config['session_ttl'] ?? 2592000);
        $st = $pdo->prepare('INSERT INTO sessions (token, user_id, expires_at) VALUES (:t, :u, DATE_ADD(NOW(), INTERVAL :s SECOND))');
        $st->execute([':t' => $token, ':u' => $id, ':s' => $ttl]);

        $user = $pdo->prepare('SELECT * FROM users WHERE id = :id');
        $user->execute([':id' => $id]);
        send(200, ['token' => $token, 'user' => publicUser($user->fetch())]);
    }

    // ── LOGIN ────────────────────────────────────────────────
    if ($method === 'POST' && $path === '/login') {
        $b = readJson();
        $name = trim((string)($b['name'] ?? ''));
        $email = trim((string)($b['email'] ?? ''));
        $password = (string)($b['password'] ?? '');

        if ($password === '' || ($name === '' && $email === '')) {
            send(400, ['message' => 'Isi nama atau email + password']);
        }

        if ($email !== '') {
            $st = $pdo->prepare('SELECT * FROM users WHERE email = :e LIMIT 1');
            $st->execute([':e' => $email]);
        } else {
            $st = $pdo->prepare('SELECT * FROM users WHERE name = :n ORDER BY created_at LIMIT 1');
            $st->execute([':n' => $name]);
        }
        $user = $st->fetch();
        if (!$user || !password_verify($password, $user['password_hash'])) {
            send(401, ['message' => 'Nama/email atau password salah']);
        }

        $token = bin2hex(random_bytes(32));
        $ttl = (int)($config['session_ttl'] ?? 2592000);
        $st = $pdo->prepare('INSERT INTO sessions (token, user_id, expires_at) VALUES (:t, :u, DATE_ADD(NOW(), INTERVAL :s SECOND))');
        $st->execute([':t' => $token, ':u' => $user['id'], ':s' => $ttl]);

        send(200, ['token' => $token, 'user' => publicUser($user)]);
    }

    // ── LOGOUT ───────────────────────────────────────────────
    if ($method === 'POST' && $path === '/logout') {
        $token = bearerToken();
        if ($token) {
            $st = $pdo->prepare('DELETE FROM sessions WHERE token = :t');
            $st->execute([':t' => $token]);
        }
        send(200, ['ok' => true]);
    }

    // ── ME (info user + status hari ini / tanggal tertentu) ──
    if ($method === 'GET' && $path === '/me') {
        $u = authUser($pdo);

        // Optional ?date=YYYY-MM-DD untuk mode retroaktif
        $date = $_GET['date'] ?? date('Y-m-d');
        if (!preg_match('/^\d{4}-\d{2}-\d{2}$/', $date)) $date = date('Y-m-d');
        if ($date > date('Y-m-d')) $date = date('Y-m-d');

        // Cek apakah kolom count_n sudah ada (backward compat)
        $hasCount = false;
        try {
            $chk = $pdo->query("SHOW COLUMNS FROM amalan_log LIKE 'count_n'");
            $hasCount = $chk && $chk->fetchColumn() !== false;
        } catch (Throwable $e) { $hasCount = false; }

        $cols = $hasCount ? 'surat_id, count_n, poin' : 'surat_id, 1 AS count_n, poin';
        $st = $pdo->prepare("SELECT $cols FROM amalan_log WHERE user_id = :u AND tanggal = :d");
        $st->execute([':u' => $u['id'], ':d' => $date]);
        $rows = $st->fetchAll();

        $today = [];        // backward compat: array of ids
        $todayDetail = [];  // detail: [{surat_id, count, poin}]
        foreach ($rows as $r) {
            $today[] = $r['surat_id'];
            $todayDetail[] = [
                'surat_id' => $r['surat_id'],
                'count'    => (int)$r['count_n'],
                'poin'     => (int)$r['poin'],
            ];
        }

        // Hitung peringkat
        $st = $pdo->prepare('SELECT COUNT(*) + 1 AS rnk FROM users WHERE total_poin > :p');
        $st->execute([':p' => (int)$u['total_poin']]);
        $rank = (int) $st->fetchColumn();

        // Hitung referral stats (count + total poin earned)
        $referralCount = 0;
        $referralPoin  = 0;
        try {
            $st = $pdo->prepare(
                'SELECT COUNT(*) AS cnt, COALESCE(SUM(poin_awarded), 0) AS poin
                 FROM referrals WHERE referrer_id = :u'
            );
            $st->execute([':u' => $u['id']]);
            $refRow = $st->fetch();
            if ($refRow) {
                $referralCount = (int)$refRow['cnt'];
                $referralPoin  = (int)$refRow['poin'];
            }
        } catch (Throwable $e) { /* tabel referrals belum ada — abaikan */ }

        send(200, [
            'user'          => publicUser($u),
            'today_surat'   => $today,
            'today_detail'  => $todayDetail,
            'date'          => $date,
            'rank'          => $rank,
            'referral_stats' => [
                'count'       => $referralCount,
                'poin_earned' => $referralPoin,
            ],
        ]);
    }

    // ── DAFTAR REFERRAL (nama orang yang diajak user ini) ────
    if ($method === 'GET' && $path === '/referrals') {
        $u = authUser($pdo);
        $list = [];
        try {
            $st = $pdo->prepare(
                'SELECT us.name, us.gender, r.poin_awarded, r.created_at
                 FROM referrals r
                 JOIN users us ON us.id = r.referred_id
                 WHERE r.referrer_id = :u
                 ORDER BY r.created_at DESC'
            );
            $st->execute([':u' => $u['id']]);
            foreach ($st->fetchAll() as $row) {
                $list[] = [
                    'name'         => $row['name'],
                    'gender'       => $row['gender'],
                    'poin_awarded' => (int)$row['poin_awarded'],
                    'created_at'   => $row['created_at'],
                ];
            }
        } catch (Throwable $e) { /* tabel referrals belum ada — abaikan */ }
        send(200, ['data' => $list]);
    }

    // ── CATAT AMALAN ─────────────────────────────────────────
    if ($method === 'POST' && $path === '/amalan') {
        $u = authUser($pdo);
        $b = readJson();
        $suratId   = trim((string)($b['surat_id'] ?? ''));
        $suratName = trim((string)($b['surat_name'] ?? ''));
        $poinBase  = (int)($b['poin'] ?? 0);
        $count     = max(1, (int)($b['count'] ?? 1));
        if ($count > 99999) $count = 99999;

        // Tanggal opsional (untuk isi amalan tertinggal). Tidak boleh masa depan.
        $tanggal = trim((string)($b['tanggal'] ?? ''));
        if ($tanggal === '' || !preg_match('/^\d{4}-\d{2}-\d{2}$/', $tanggal)) {
            $tanggal = date('Y-m-d');
        }
        if ($tanggal > date('Y-m-d')) $tanggal = date('Y-m-d');
        if ($tanggal < '2020-01-01') $tanggal = date('Y-m-d');

        if ($suratId === '' || $suratName === '' || $poinBase <= 0) {
            send(400, ['message' => 'surat_id, surat_name, dan poin wajib diisi']);
        }

        $poinTotal = $poinBase * $count;

        // Cek kolom count_n (backward compat)
        $hasCount = false;
        try {
            $chk = $pdo->query("SHOW COLUMNS FROM amalan_log LIKE 'count_n'");
            $hasCount = $chk && $chk->fetchColumn() !== false;
        } catch (Throwable $e) { $hasCount = false; }

        $pdo->beginTransaction();
        try {
            // Cek apakah sudah ada entry untuk surat & tanggal ini (untuk update kelipatan)
            $st = $pdo->prepare('SELECT id, poin FROM amalan_log WHERE user_id = :u AND surat_id = :sid AND tanggal = :tg LIMIT 1');
            $st->execute([':u' => $u['id'], ':sid' => $suratId, ':tg' => $tanggal]);
            $existing = $st->fetch();

            if ($existing) {
                // Update existing (mode kelipatan): replace count & poin
                $oldPoin = (int)$existing['poin'];
                if ($hasCount) {
                    $st = $pdo->prepare('UPDATE amalan_log SET poin = :p, count_n = :c WHERE id = :id');
                    $st->execute([':p' => $poinTotal, ':c' => $count, ':id' => $existing['id']]);
                } else {
                    $st = $pdo->prepare('UPDATE amalan_log SET poin = :p WHERE id = :id');
                    $st->execute([':p' => $poinTotal, ':id' => $existing['id']]);
                }
                $delta = $poinTotal - $oldPoin;
                $st = $pdo->prepare('UPDATE users SET total_poin = GREATEST(0, total_poin + :p), last_active = GREATEST(COALESCE(last_active, :tg1), :tg2) WHERE id = :u');
                $st->execute([':p' => $delta, ':tg1' => $tanggal, ':tg2' => $tanggal, ':u' => $u['id']]);
            } else {
                // Insert baru
                if ($hasCount) {
                    $st = $pdo->prepare(
                        'INSERT INTO amalan_log (id, user_id, surat_id, surat_name, poin, count_n, tanggal)
                         VALUES (:id, :u, :sid, :sn, :p, :c, :tg)'
                    );
                    $st->execute([
                        ':id'  => uuid(), ':u'   => $u['id'], ':sid' => $suratId,
                        ':sn'  => $suratName, ':p' => $poinTotal, ':c' => $count, ':tg' => $tanggal,
                    ]);
                } else {
                    $st = $pdo->prepare(
                        'INSERT INTO amalan_log (id, user_id, surat_id, surat_name, poin, tanggal)
                         VALUES (:id, :u, :sid, :sn, :p, :tg)'
                    );
                    $st->execute([
                        ':id'  => uuid(), ':u'   => $u['id'], ':sid' => $suratId,
                        ':sn'  => $suratName, ':p' => $poinTotal, ':tg' => $tanggal,
                    ]);
                }
                $st = $pdo->prepare('UPDATE users SET total_poin = total_poin + :p WHERE id = :u');
                $st->execute([':p' => $poinTotal, ':u' => $u['id']]);

                // Update last_active hanya jika tanggal > existing last_active
                $st = $pdo->prepare('UPDATE users SET last_active = :tg1 WHERE id = :u AND (last_active IS NULL OR last_active < :tg2)');
                $st->execute([':tg1' => $tanggal, ':tg2' => $tanggal, ':u' => $u['id']]);
            }

            // Streak hanya update bila tanggal = hari ini
            if ($tanggal === date('Y-m-d')) {
                $oldLast = $u['last_active'];
                $today = date('Y-m-d');
                $yesterday = date('Y-m-d', strtotime('-1 day'));
                if ($oldLast === $today) {
                    $newStreak = max(1, (int)$u['streak_days']);
                } elseif ($oldLast === $yesterday) {
                    $newStreak = (int)$u['streak_days'] + 1;
                } else {
                    $newStreak = 1;
                }
                $st = $pdo->prepare('UPDATE users SET streak_days = :s WHERE id = :u');
                $st->execute([':s' => $newStreak, ':u' => $u['id']]);
            }

            $pdo->commit();
        } catch (Throwable $e) {
            $pdo->rollBack();
            throw $e;
        }

        $st = $pdo->prepare('SELECT * FROM users WHERE id = :u');
        $st->execute([':u' => $u['id']]);
        send(200, ['status' => 'ok', 'user' => publicUser($st->fetch()), 'count' => $count, 'poin_total' => $poinTotal]);
    }

    // ── HAPUS / UNCHECK AMALAN ───────────────────────────────
    if ($method === 'POST' && $path === '/amalan/delete') {
        $u = authUser($pdo);
        $b = readJson();
        $suratId = trim((string)($b['surat_id'] ?? ''));
        $tanggal = trim((string)($b['tanggal'] ?? ''));
        if ($tanggal === '' || !preg_match('/^\d{4}-\d{2}-\d{2}$/', $tanggal)) {
            $tanggal = date('Y-m-d');
        }
        if ($suratId === '') send(400, ['message' => 'surat_id wajib diisi']);

        $pdo->beginTransaction();
        try {
            $st = $pdo->prepare('SELECT id, poin FROM amalan_log WHERE user_id = :u AND surat_id = :sid AND tanggal = :tg LIMIT 1');
            $st->execute([':u' => $u['id'], ':sid' => $suratId, ':tg' => $tanggal]);
            $row = $st->fetch();
            if (!$row) {
                $pdo->commit();
                send(200, ['status' => 'not_found']);
            }
            $poin = (int)$row['poin'];

            $st = $pdo->prepare('DELETE FROM amalan_log WHERE id = :id');
            $st->execute([':id' => $row['id']]);

            $st = $pdo->prepare('UPDATE users SET total_poin = GREATEST(0, total_poin - :p) WHERE id = :u');
            $st->execute([':p' => $poin, ':u' => $u['id']]);

            $pdo->commit();
        } catch (Throwable $e) {
            $pdo->rollBack();
            throw $e;
        }

        $st = $pdo->prepare('SELECT * FROM users WHERE id = :u');
        $st->execute([':u' => $u['id']]);
        send(200, ['status' => 'ok', 'user' => publicUser($st->fetch())]);
    }

    // ── LEADERBOARD ──────────────────────────────────────────
    if ($method === 'GET' && $path === '/leaderboard') {
        $st = $pdo->query(
            'SELECT id, name, total_poin, streak_days
             FROM users ORDER BY total_poin DESC, name ASC LIMIT 50'
        );
        $rows = $st->fetchAll();
        $out = [];
        foreach ($rows as $i => $r) {
            $out[] = [
                'id'          => $r['id'],
                'name'        => $r['name'],
                'avatar'      => avatarOf($r['name']),
                'total_poin'  => (int) $r['total_poin'],
                'streak_days' => (int) $r['streak_days'],
                'rank'        => $i + 1,
            ];
        }
        send(200, ['data' => $out]);
    }

    // ── RIWAYAT ──────────────────────────────────────────────
    if ($method === 'GET' && $path === '/riwayat') {
        $u = authUser($pdo);

        // Cek kolom count_n (backward compat)
        $hasCount = false;
        try {
            $chk = $pdo->query("SHOW COLUMNS FROM amalan_log LIKE 'count_n'");
            $hasCount = $chk && $chk->fetchColumn() !== false;
        } catch (Throwable $e) { $hasCount = false; }

        $cols = $hasCount
            ? 'surat_id, surat_name, poin, count_n, tanggal'
            : 'surat_id, surat_name, poin, 1 AS count_n, tanggal';
        $st = $pdo->prepare(
            "SELECT $cols FROM amalan_log WHERE user_id = :u
             ORDER BY tanggal DESC, created_at DESC"
        );
        $st->execute([':u' => $u['id']]);
        $rows = $st->fetchAll();

        $grouped = [];
        foreach ($rows as $r) {
            $d = $r['tanggal'];
            if (!isset($grouped[$d])) $grouped[$d] = ['date' => $d, 'items' => []];
            $grouped[$d]['items'][] = [
                'id'    => $r['surat_id'],
                'name'  => $r['surat_name'],
                'poin'  => (int) $r['poin'],
                'count' => (int) $r['count_n'],
            ];
        }
        send(200, ['data' => array_values($grouped)]);
    }

    // ── ADMIN: LIST USERS (admin only) ───────────────────────
    if ($method === 'GET' && $path === '/admin/users') {
        $u = authUser($pdo);
        if (($u['role'] ?? 'user') !== 'admin') {
            send(403, ['message' => 'Akses ditolak — hanya admin']);
        }

        // Aggregate dengan jumlah amalan log + referral
        $sql = "
            SELECT
                u.id, u.name, u.email, u.role, u.total_poin, u.streak_days,
                u.last_active, u.referral_code, u.referred_by, u.created_at,
                COALESCE(refs.cnt, 0)   AS referral_count,
                COALESCE(refs.poin, 0)  AS referral_poin,
                COALESCE(logs.cnt, 0)   AS log_count,
                COALESCE(logs.amal_poin, 0) AS amalan_poin,
                ru.name AS referred_by_name
            FROM users u
            LEFT JOIN (
                SELECT referrer_id, COUNT(*) AS cnt, SUM(poin_awarded) AS poin
                FROM referrals GROUP BY referrer_id
            ) refs ON refs.referrer_id = u.id
            LEFT JOIN (
                SELECT user_id, COUNT(*) AS cnt, SUM(poin) AS amal_poin
                FROM amalan_log GROUP BY user_id
            ) logs ON logs.user_id = u.id
            LEFT JOIN users ru ON ru.id = u.referred_by
            ORDER BY u.total_poin DESC, u.name ASC
        ";
        $rows = $pdo->query($sql)->fetchAll();

        // Cast types
        $out = [];
        foreach ($rows as $r) {
            $out[] = [
                'id'                => $r['id'],
                'name'              => $r['name'],
                'email'             => $r['email'],
                'role'              => $r['role'],
                'total_poin'        => (int)$r['total_poin'],
                'streak_days'       => (int)$r['streak_days'],
                'last_active'       => $r['last_active'],
                'referral_code'     => $r['referral_code'],
                'referred_by_name'  => $r['referred_by_name'],
                'referral_count'    => (int)$r['referral_count'],
                'referral_poin'     => (int)$r['referral_poin'],
                'amalan_log_count'  => (int)$r['log_count'],
                'amalan_poin'       => (int)$r['amalan_poin'],
                'created_at'        => $r['created_at'],
            ];
        }
        send(200, ['data' => $out]);
    }

    // ── ADMIN: SEMUA REFERRAL (admin only) ───────────────────
    // Daftar semua pasangan pengajak → yang diajak, dengan nama keduanya.
    if ($method === 'GET' && $path === '/admin/referrals') {
        $u = authUser($pdo);
        if (($u['role'] ?? 'user') !== 'admin') {
            send(403, ['message' => 'Akses ditolak — hanya admin']);
        }
        $list = [];
        try {
            $sql = "
                SELECT
                    r.referrer_id,
                    pengajak.name AS referrer_name,
                    diajak.name   AS referred_name,
                    diajak.gender AS referred_gender,
                    r.poin_awarded,
                    r.created_at
                FROM referrals r
                JOIN users pengajak ON pengajak.id = r.referrer_id
                JOIN users diajak   ON diajak.id   = r.referred_id
                ORDER BY r.created_at DESC
            ";
            foreach ($pdo->query($sql)->fetchAll() as $r) {
                $list[] = [
                    'referrer_id'     => $r['referrer_id'],
                    'referrer_name'   => $r['referrer_name'],
                    'referred_name'   => $r['referred_name'],
                    'referred_gender' => $r['referred_gender'],
                    'poin_awarded'    => (int)$r['poin_awarded'],
                    'created_at'      => $r['created_at'],
                ];
            }
        } catch (Throwable $e) { /* tabel referrals belum ada — abaikan */ }
        send(200, ['data' => $list]);
    }

    // ── ADMIN: SET ROLE (admin only) ─────────────────────────
    if ($method === 'POST' && $path === '/admin/set-role') {
        $u = authUser($pdo);
        if (($u['role'] ?? 'user') !== 'admin') {
            send(403, ['message' => 'Akses ditolak — hanya admin']);
        }
        $b = readJson();
        $targetId = trim((string)($b['user_id'] ?? ''));
        $newRole  = trim((string)($b['role'] ?? ''));
        if ($targetId === '' || !in_array($newRole, ['admin', 'user'], true)) {
            send(400, ['message' => 'user_id dan role (admin/user) wajib diisi']);
        }
        // Cegah admin menghapus role dirinya sendiri (biar gak terkunci)
        if ($targetId === $u['id'] && $newRole !== 'admin') {
            send(400, ['message' => 'Tidak bisa menurunkan role diri sendiri']);
        }
        $st = $pdo->prepare('UPDATE users SET role = :r WHERE id = :id');
        $st->execute([':r' => $newRole, ':id' => $targetId]);
        send(200, ['ok' => true]);
    }

    // ── ADMIN: RESET PASSWORD USER (admin only) ──────────────
    // Body: { "user_id": "...", "new_password": "..." }
    // Catatan keamanan: password tersimpan ter-hash (bcrypt) jadi password lama
    // TIDAK bisa ditampilkan. Admin hanya bisa MENETAPKAN password baru, lalu
    // memberitahukannya ke user. Semua sesi user target di-logout agar password
    // lama tidak bisa dipakai lagi.
    if ($method === 'POST' && $path === '/admin/reset-password') {
        $u = authUser($pdo);
        if (($u['role'] ?? 'user') !== 'admin') {
            send(403, ['message' => 'Akses ditolak — hanya admin']);
        }
        $b = readJson();
        $targetId = trim((string)($b['user_id'] ?? ''));
        $new = (string)($b['new_password'] ?? '');
        if ($targetId === '') send(400, ['message' => 'user_id wajib diisi']);
        if (strlen($new) < 6) send(400, ['message' => 'Password baru minimal 6 karakter']);

        // Pastikan user target ada
        $st = $pdo->prepare('SELECT id, name FROM users WHERE id = :id LIMIT 1');
        $st->execute([':id' => $targetId]);
        $target = $st->fetch();
        if (!$target) send(404, ['message' => 'User tidak ditemukan']);

        $hash = password_hash($new, PASSWORD_DEFAULT);
        $st = $pdo->prepare('UPDATE users SET password_hash = :h WHERE id = :id');
        $st->execute([':h' => $hash, ':id' => $targetId]);

        // Logout semua sesi user target (paksa login ulang dengan password baru)
        $st = $pdo->prepare('DELETE FROM sessions WHERE user_id = :id');
        $st->execute([':id' => $targetId]);

        send(200, ['ok' => true, 'name' => $target['name']]);
    }

    // ── UPDATE PROFILE (name + email + gender) ───────────────
    // Body: { "name": "Nama Baru", "email": "email@baru.com", "gender": "male|female" }
    // Email & gender opsional di body (kalau tidak dikirim, tidak berubah).
    // Returns updated user object.
    if ($method === 'POST' && $path === '/me/update') {
        $u = authUser($pdo);
        $b = readJson();
        $name = trim((string)($b['name'] ?? ''));
        $emailRaw = $b['email'] ?? null;
        $email = $emailRaw === null ? null : trim((string) $emailRaw);

        if ($name === '') send(400, ['message' => 'Nama wajib diisi']);
        if (mb_strlen($name) < 2) send(400, ['message' => 'Nama minimal 2 karakter']);
        if (mb_strlen($name) > 100) send(400, ['message' => 'Nama maksimal 100 karakter']);

        // Email opsional - kalau diisi harus valid + unik (kecuali email sendiri)
        $emailToSave = null;
        if ($email !== null && $email !== '') {
            if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
                send(400, ['message' => 'Format email tidak valid']);
            }
            if (mb_strlen($email) > 150) {
                send(400, ['message' => 'Email terlalu panjang']);
            }
            // Cek unik
            $st = $pdo->prepare('SELECT id FROM users WHERE email = :e AND id <> :id LIMIT 1');
            $st->execute([':e' => $email, ':id' => $u['id']]);
            if ($st->fetchColumn()) {
                send(409, ['message' => 'Email sudah dipakai user lain']);
            }
            $emailToSave = $email;
        }

        // Gender: kalau key tidak dikirim sama sekali → tidak diubah.
        // Kalau dikirim, harus valid. Kalau user sudah set female → tidak boleh
        // diubah ke male (cegah data haid yatim piatu); sebaliknya boleh.
        $updateGender = array_key_exists('gender', $b);
        $genderToSave = $u['gender'] ?? null;
        if ($updateGender) {
            $gender = trim((string)($b['gender'] ?? ''));
            if ($gender === '' || !in_array($gender, ['male','female'], true)) {
                send(400, ['message' => 'Jenis kelamin tidak valid']);
            }
            // Cegah perubahan female → male kalau ada riwayat haid (data jadi yatim)
            if (($u['gender'] ?? null) === 'female' && $gender === 'male') {
                $st = $pdo->prepare('SELECT COUNT(*) FROM haid_log WHERE user_id = :u');
                $st->execute([':u' => $u['id']]);
                if ((int)$st->fetchColumn() > 0) {
                    send(409, ['message' => 'Tidak bisa ubah ke laki-laki karena sudah ada riwayat haid. Hubungi admin kalau perlu reset.']);
                }
            }
            $genderToSave = $gender;
        }

        $st = $pdo->prepare('UPDATE users SET name = :n, email = :e, gender = :g WHERE id = :id');
        $st->execute([':n' => $name, ':e' => $emailToSave, ':g' => $genderToSave, ':id' => $u['id']]);

        $st = $pdo->prepare('SELECT * FROM users WHERE id = :id');
        $st->execute([':id' => $u['id']]);
        send(200, ['user' => publicUser($st->fetch())]);
    }

    // ── CHANGE PASSWORD ──────────────────────────────────────
    // Body: { "current_password": "...", "new_password": "..." }
    // Wajib verifikasi current password supaya user yang token-nya bocor
    // tidak bisa ganti password korban tanpa tahu password lama.
    if ($method === 'POST' && $path === '/me/change-password') {
        $u = authUser($pdo);
        $b = readJson();
        $current = (string)($b['current_password'] ?? '');
        $new = (string)($b['new_password'] ?? '');

        if ($current === '') send(400, ['message' => 'Password lama wajib diisi']);
        if (strlen($new) < 6) send(400, ['message' => 'Password baru minimal 6 karakter']);
        if ($current === $new) send(400, ['message' => 'Password baru harus berbeda dari yang lama']);

        if (!password_verify($current, $u['password_hash'])) {
            send(401, ['message' => 'Password lama salah']);
        }

        $hash = password_hash($new, PASSWORD_DEFAULT);
        $st = $pdo->prepare('UPDATE users SET password_hash = :h WHERE id = :id');
        $st->execute([':h' => $hash, ':id' => $u['id']]);

        // Optional: invalidate semua session lain (kecuali yang sekarang dipakai)
        // supaya kalau token bocor di device lain, dia langsung logout.
        $currentToken = bearerToken();
        $st = $pdo->prepare('DELETE FROM sessions WHERE user_id = :id AND token <> :t');
        $st->execute([':id' => $u['id'], ':t' => $currentToken]);

        send(200, ['ok' => true]);
    }

    // ─────────────────────────────────────────────────────────────
    // SHOLAT WAJIB — 5 waktu dengan 4 status
    // ─────────────────────────────────────────────────────────────

    // Helper: cek apakah user sedang haid pada tanggal tertentu
    // Returns true kalau ada haid_log yang overlap (mulai <= tanggal AND (selesai IS NULL OR selesai >= tanggal))
    if (!function_exists('isHaidActive')) {
        function isHaidActive(PDO $pdo, string $userId, string $tanggal): bool {
            $st = $pdo->prepare(
                'SELECT 1 FROM haid_log
                 WHERE user_id = :u
                   AND tanggal_mulai <= :d
                   AND (tanggal_selesai IS NULL OR tanggal_selesai >= :d)
                 LIMIT 1'
            );
            $st->execute([':u' => $userId, ':d' => $tanggal]);
            return (bool) $st->fetchColumn();
        }
    }

    // Poin per status sholat
    if (!function_exists('poinSholat')) {
        function poinSholat(string $status): int {
            return match ($status) {
                'tepat_waktu' => 10,
                'telat'       => 5,
                'terlewat'    => 2,
                'uzur'        => 0,
                default       => 0,
            };
        }
    }

    // GET /sholat?date=YYYY-MM-DD — list 5 waktu untuk tanggal tersebut + status user
    if ($method === 'GET' && $path === '/sholat') {
        $u = authUser($pdo);
        $date = $_GET['date'] ?? date('Y-m-d');
        if (!preg_match('/^\d{4}-\d{2}-\d{2}$/', $date)) $date = date('Y-m-d');

        $st = $pdo->prepare(
            'SELECT waktu, status, catatan, poin FROM sholat_log WHERE user_id = :u AND tanggal = :d'
        );
        $st->execute([':u' => $u['id'], ':d' => $date]);
        $existing = [];
        foreach ($st->fetchAll() as $r) {
            $existing[$r['waktu']] = [
                'status'  => $r['status'],
                'catatan' => $r['catatan'],
                'poin'    => (int) $r['poin'],
            ];
        }

        $haid = isHaidActive($pdo, $u['id'], $date);

        $waktuList = ['subuh','dzuhur','ashar','maghrib','isya'];
        $out = [];
        $totalPoin = 0;
        foreach ($waktuList as $w) {
            $row = $existing[$w] ?? null;
            $totalPoin += $row['poin'] ?? 0;
            $out[] = [
                'waktu'   => $w,
                'status'  => $row['status'] ?? null,
                'catatan' => $row['catatan'] ?? null,
                'poin'    => $row['poin'] ?? 0,
            ];
        }
        send(200, [
            'date'        => $date,
            'haid_active' => $haid,
            'data'        => $out,
            'total_poin'  => $totalPoin,
        ]);
    }

    // POST /sholat — set/upsert status sholat
    // Body: { "waktu": "subuh", "status": "tepat_waktu", "catatan"?: "...", "tanggal"?: "YYYY-MM-DD" }
    if ($method === 'POST' && $path === '/sholat') {
        $u = authUser($pdo);
        $b = readJson();
        $waktu = (string)($b['waktu'] ?? '');
        $status = (string)($b['status'] ?? '');
        $catatan = isset($b['catatan']) ? trim((string)$b['catatan']) : null;
        $tanggal = $b['tanggal'] ?? date('Y-m-d');

        if (!in_array($waktu, ['subuh','dzuhur','ashar','maghrib','isya'], true)) {
            send(400, ['message' => 'Waktu sholat tidak valid']);
        }
        if (!in_array($status, ['tepat_waktu','telat','terlewat','uzur'], true)) {
            send(400, ['message' => 'Status sholat tidak valid']);
        }
        if (!preg_match('/^\d{4}-\d{2}-\d{2}$/', $tanggal)) $tanggal = date('Y-m-d');
        if ($tanggal > date('Y-m-d')) {
            send(400, ['message' => 'Tidak bisa catat sholat untuk tanggal di masa depan']);
        }
        if ($catatan !== null && strlen($catatan) > 250) $catatan = substr($catatan, 0, 250);

        $poin = poinSholat($status);

        // Cek existing untuk delta poin user
        $st = $pdo->prepare('SELECT poin FROM sholat_log WHERE user_id = :u AND tanggal = :d AND waktu = :w');
        $st->execute([':u' => $u['id'], ':d' => $tanggal, ':w' => $waktu]);
        $oldPoin = $st->fetchColumn();

        if ($oldPoin === false) {
            $st = $pdo->prepare(
                'INSERT INTO sholat_log (id, user_id, tanggal, waktu, status, catatan, poin)
                 VALUES (:id, :u, :d, :w, :s, :c, :p)'
            );
            $st->execute([
                ':id' => uuid(),
                ':u'  => $u['id'],
                ':d'  => $tanggal,
                ':w'  => $waktu,
                ':s'  => $status,
                ':c'  => $catatan,
                ':p'  => $poin,
            ]);
            $delta = $poin;
        } else {
            $st = $pdo->prepare(
                'UPDATE sholat_log SET status = :s, catatan = :c, poin = :p
                 WHERE user_id = :u AND tanggal = :d AND waktu = :w'
            );
            $st->execute([
                ':s' => $status,
                ':c' => $catatan,
                ':p' => $poin,
                ':u' => $u['id'],
                ':d' => $tanggal,
                ':w' => $waktu,
            ]);
            $delta = $poin - (int) $oldPoin;
        }

        if ($delta !== 0) {
            $st = $pdo->prepare('UPDATE users SET total_poin = total_poin + :d WHERE id = :id');
            $st->execute([':d' => $delta, ':id' => $u['id']]);
        }

        send(200, ['status' => 'ok', 'waktu' => $waktu, 'new_status' => $status, 'poin' => $poin]);
    }

    // POST /sholat/delete — hapus catatan sholat
    if ($method === 'POST' && $path === '/sholat/delete') {
        $u = authUser($pdo);
        $b = readJson();
        $waktu = (string)($b['waktu'] ?? '');
        $tanggal = $b['tanggal'] ?? date('Y-m-d');
        if (!in_array($waktu, ['subuh','dzuhur','ashar','maghrib','isya'], true)) {
            send(400, ['message' => 'Waktu tidak valid']);
        }
        if (!preg_match('/^\d{4}-\d{2}-\d{2}$/', $tanggal)) $tanggal = date('Y-m-d');

        $st = $pdo->prepare('SELECT poin FROM sholat_log WHERE user_id = :u AND tanggal = :d AND waktu = :w');
        $st->execute([':u' => $u['id'], ':d' => $tanggal, ':w' => $waktu]);
        $poin = $st->fetchColumn();
        if ($poin !== false) {
            $st = $pdo->prepare('DELETE FROM sholat_log WHERE user_id = :u AND tanggal = :d AND waktu = :w');
            $st->execute([':u' => $u['id'], ':d' => $tanggal, ':w' => $waktu]);
            if ((int)$poin > 0) {
                $st = $pdo->prepare('UPDATE users SET total_poin = GREATEST(0, total_poin - :p) WHERE id = :id');
                $st->execute([':p' => (int)$poin, ':id' => $u['id']]);
            }
        }
        send(200, ['status' => 'ok']);
    }

    // POST /sholat/auto-uzur — tandai semua waktu di tanggal X jadi 'uzur' (saat haid)
    // Body: { "tanggal": "YYYY-MM-DD" }
    if ($method === 'POST' && $path === '/sholat/auto-uzur') {
        $u = authUser($pdo);
        $b = readJson();
        $tanggal = $b['tanggal'] ?? date('Y-m-d');
        if (!preg_match('/^\d{4}-\d{2}-\d{2}$/', $tanggal)) $tanggal = date('Y-m-d');
        if ($tanggal > date('Y-m-d')) send(400, ['message' => 'Tanggal tidak valid']);

        $pdo->beginTransaction();
        try {
            $waktuList = ['subuh','dzuhur','ashar','maghrib','isya'];
            foreach ($waktuList as $w) {
                $st = $pdo->prepare(
                    'INSERT INTO sholat_log (id, user_id, tanggal, waktu, status, poin)
                     VALUES (:id, :u, :d, :w, "uzur", 0)
                     ON DUPLICATE KEY UPDATE status = "uzur", poin = 0'
                );
                $st->execute([
                    ':id' => uuid(),
                    ':u'  => $u['id'],
                    ':d'  => $tanggal,
                    ':w'  => $w,
                ]);
            }
            $pdo->commit();
        } catch (Throwable $e) {
            $pdo->rollBack();
            throw $e;
        }
        send(200, ['status' => 'ok', 'tanggal' => $tanggal]);
    }

    // GET /sholat/stats?month=YYYY-MM — statistik per bulan
    if ($method === 'GET' && $path === '/sholat/stats') {
        $u = authUser($pdo);
        $month = $_GET['month'] ?? date('Y-m');
        if (!preg_match('/^\d{4}-\d{2}$/', $month)) $month = date('Y-m');
        $start = $month . '-01';
        $end = date('Y-m-t', strtotime($start));

        $st = $pdo->prepare(
            'SELECT status, COUNT(*) AS cnt FROM sholat_log
             WHERE user_id = :u AND tanggal BETWEEN :s AND :e
             GROUP BY status'
        );
        $st->execute([':u' => $u['id'], ':s' => $start, ':e' => $end]);
        $stats = ['tepat_waktu' => 0, 'telat' => 0, 'terlewat' => 0, 'uzur' => 0];
        foreach ($st->fetchAll() as $r) {
            $stats[$r['status']] = (int) $r['cnt'];
        }
        $total = array_sum($stats);
        // Hari di bulan ini sampai sekarang
        $today = date('Y-m-d');
        $cutoff = $today < $end ? $today : $end;
        $daysCounted = (int)((strtotime($cutoff) - strtotime($start)) / 86400) + 1;
        $targetSholat = $daysCounted * 5;

        send(200, [
            'month'         => $month,
            'stats'         => $stats,
            'total_recorded'=> $total,
            'target'        => $targetSholat,
            'days_counted'  => $daysCounted,
        ]);
    }

    // ─────────────────────────────────────────────────────────────
    // HAID — tracking periode menstruasi
    // Gate: hanya untuk user dengan gender = 'female'
    // ─────────────────────────────────────────────────────────────

    if (!function_exists('requireFemale')) {
        function requireFemale(array $u): void {
            if (($u['gender'] ?? null) !== 'female') {
                send(403, ['message' => 'Fitur catatan haid hanya tersedia untuk pengguna perempuan']);
            }
        }
    }

    // GET /haid — list semua periode (DESC), batas 12
    if ($method === 'GET' && $path === '/haid') {
        $u = authUser($pdo);
        requireFemale($u);
        $st = $pdo->prepare(
            'SELECT id, tanggal_mulai, tanggal_selesai, catatan, created_at FROM haid_log
             WHERE user_id = :u ORDER BY tanggal_mulai DESC LIMIT 12'
        );
        $st->execute([':u' => $u['id']]);
        $rows = $st->fetchAll();
        $today = date('Y-m-d');
        $active = null;
        foreach ($rows as $r) {
            if ($r['tanggal_mulai'] <= $today && ($r['tanggal_selesai'] === null || $r['tanggal_selesai'] >= $today)) {
                $active = $r;
                break;
            }
        }
        $out = [];
        foreach ($rows as $r) {
            $start = $r['tanggal_mulai'];
            $endTanggal = $r['tanggal_selesai'] ?? $today;
            $durasi = (int)((strtotime($endTanggal) - strtotime($start)) / 86400) + 1;
            $out[] = [
                'id'              => $r['id'],
                'tanggal_mulai'   => $start,
                'tanggal_selesai' => $r['tanggal_selesai'],
                'catatan'         => $r['catatan'],
                'durasi_hari'     => $durasi,
                'active'          => $r['tanggal_selesai'] === null,
            ];
        }
        send(200, ['data' => $out, 'active' => $active !== null]);
    }

    // POST /haid/mulai — { "tanggal_mulai"?: "YYYY-MM-DD" (default hari ini), "catatan"?: "..." }
    // Tidak boleh ada periode aktif (selesai = null) sebelumnya
    if ($method === 'POST' && $path === '/haid/mulai') {
        $u = authUser($pdo);
        requireFemale($u);
        $b = readJson();
        $tanggal = $b['tanggal_mulai'] ?? date('Y-m-d');
        $catatan = isset($b['catatan']) ? trim((string)$b['catatan']) : null;
        if (!preg_match('/^\d{4}-\d{2}-\d{2}$/', $tanggal)) $tanggal = date('Y-m-d');
        if ($tanggal > date('Y-m-d')) send(400, ['message' => 'Tanggal mulai tidak boleh di masa depan']);
        if ($catatan !== null && strlen($catatan) > 250) $catatan = substr($catatan, 0, 250);

        $st = $pdo->prepare('SELECT id FROM haid_log WHERE user_id = :u AND tanggal_selesai IS NULL LIMIT 1');
        $st->execute([':u' => $u['id']]);
        if ($st->fetchColumn()) {
            send(409, ['message' => 'Masih ada periode haid aktif. Selesaikan dulu sebelum mencatat yang baru.']);
        }

        $id = uuid();
        $st = $pdo->prepare(
            'INSERT INTO haid_log (id, user_id, tanggal_mulai, catatan) VALUES (:id, :u, :d, :c)'
        );
        $st->execute([':id' => $id, ':u' => $u['id'], ':d' => $tanggal, ':c' => $catatan]);
        send(200, ['status' => 'ok', 'id' => $id]);
    }

    // POST /haid/selesai — { "tanggal_selesai"?: "YYYY-MM-DD" (default hari ini) }
    if ($method === 'POST' && $path === '/haid/selesai') {
        $u = authUser($pdo);
        requireFemale($u);
        $b = readJson();
        $tanggal = $b['tanggal_selesai'] ?? date('Y-m-d');
        if (!preg_match('/^\d{4}-\d{2}-\d{2}$/', $tanggal)) $tanggal = date('Y-m-d');

        $st = $pdo->prepare(
            'SELECT id, tanggal_mulai FROM haid_log
             WHERE user_id = :u AND tanggal_selesai IS NULL
             ORDER BY tanggal_mulai DESC LIMIT 1'
        );
        $st->execute([':u' => $u['id']]);
        $row = $st->fetch();
        if (!$row) send(404, ['message' => 'Tidak ada periode haid aktif']);
        if ($tanggal < $row['tanggal_mulai']) {
            send(400, ['message' => 'Tanggal selesai tidak boleh sebelum tanggal mulai']);
        }

        $st = $pdo->prepare('UPDATE haid_log SET tanggal_selesai = :s WHERE id = :id');
        $st->execute([':s' => $tanggal, ':id' => $row['id']]);
        send(200, ['status' => 'ok']);
    }

    // POST /haid/delete — { "id": "..." }
    if ($method === 'POST' && $path === '/haid/delete') {
        $u = authUser($pdo);
        requireFemale($u);
        $b = readJson();
        $id = (string)($b['id'] ?? '');
        if ($id === '') send(400, ['message' => 'id wajib']);
        $st = $pdo->prepare('DELETE FROM haid_log WHERE id = :id AND user_id = :u');
        $st->execute([':id' => $id, ':u' => $u['id']]);
        send(200, ['status' => 'ok']);
    }

    // ─────────────────────────────────────────────────────────────
    // PUASA — wajib (Ramadan) + sunnah
    // ─────────────────────────────────────────────────────────────

    if (!function_exists('poinPuasa')) {
        function poinPuasa(string $jenis, string $status): int {
            if ($status !== 'penuh') return 0;
            return match ($jenis) {
                'ramadan'      => 25,
                'arafah'       => 20,
                'asyura'       => 15,
                'syawal'       => 15,
                'ayyamul_bidh' => 12,
                'daud'         => 12,
                'senin','kamis'=> 10,
                'sunnah_lain'  => 8,
                default        => 5,
            };
        }
    }

    // GET /puasa?month=YYYY-MM — list semua puasa di bulan tertentu
    if ($method === 'GET' && $path === '/puasa') {
        $u = authUser($pdo);
        $month = $_GET['month'] ?? date('Y-m');
        if (!preg_match('/^\d{4}-\d{2}$/', $month)) $month = date('Y-m');
        $start = $month . '-01';
        $end = date('Y-m-t', strtotime($start));

        $st = $pdo->prepare(
            'SELECT tanggal, jenis, status, catatan, poin FROM puasa_log
             WHERE user_id = :u AND tanggal BETWEEN :s AND :e
             ORDER BY tanggal DESC'
        );
        $st->execute([':u' => $u['id'], ':s' => $start, ':e' => $end]);
        $rows = $st->fetchAll();
        $out = array_map(fn($r) => [
            'tanggal' => $r['tanggal'],
            'jenis'   => $r['jenis'],
            'status'  => $r['status'],
            'catatan' => $r['catatan'],
            'poin'    => (int) $r['poin'],
        ], $rows);
        $totalPenuh = array_sum(array_map(fn($r) => $r['status'] === 'penuh' ? 1 : 0, $rows));
        send(200, [
            'month'       => $month,
            'data'        => $out,
            'total_penuh' => $totalPenuh,
        ]);
    }

    // POST /puasa — { "tanggal"?, "jenis", "status"?, "catatan"? }
    if ($method === 'POST' && $path === '/puasa') {
        $u = authUser($pdo);
        $b = readJson();
        $tanggal = $b['tanggal'] ?? date('Y-m-d');
        $jenis = (string)($b['jenis'] ?? '');
        $status = (string)($b['status'] ?? 'penuh');
        $catatan = isset($b['catatan']) ? trim((string)$b['catatan']) : null;

        if (!preg_match('/^\d{4}-\d{2}-\d{2}$/', $tanggal)) $tanggal = date('Y-m-d');
        if ($tanggal > date('Y-m-d')) send(400, ['message' => 'Tidak bisa catat puasa untuk tanggal di masa depan']);
        $validJenis = ['ramadan','senin','kamis','ayyamul_bidh','syawal','arafah','asyura','daud','sunnah_lain'];
        if (!in_array($jenis, $validJenis, true)) {
            send(400, ['message' => 'Jenis puasa tidak valid']);
        }
        if (!in_array($status, ['penuh','batal','uzur'], true)) {
            send(400, ['message' => 'Status puasa tidak valid']);
        }
        if ($catatan !== null && strlen($catatan) > 250) $catatan = substr($catatan, 0, 250);

        $poin = poinPuasa($jenis, $status);

        $st = $pdo->prepare('SELECT poin FROM puasa_log WHERE user_id = :u AND tanggal = :d');
        $st->execute([':u' => $u['id'], ':d' => $tanggal]);
        $oldPoin = $st->fetchColumn();

        if ($oldPoin === false) {
            $st = $pdo->prepare(
                'INSERT INTO puasa_log (id, user_id, tanggal, jenis, status, catatan, poin)
                 VALUES (:id, :u, :d, :j, :s, :c, :p)'
            );
            $st->execute([
                ':id' => uuid(),
                ':u'  => $u['id'],
                ':d'  => $tanggal,
                ':j'  => $jenis,
                ':s'  => $status,
                ':c'  => $catatan,
                ':p'  => $poin,
            ]);
            $delta = $poin;
        } else {
            $st = $pdo->prepare(
                'UPDATE puasa_log SET jenis = :j, status = :s, catatan = :c, poin = :p
                 WHERE user_id = :u AND tanggal = :d'
            );
            $st->execute([
                ':j' => $jenis,
                ':s' => $status,
                ':c' => $catatan,
                ':p' => $poin,
                ':u' => $u['id'],
                ':d' => $tanggal,
            ]);
            $delta = $poin - (int) $oldPoin;
        }

        if ($delta !== 0) {
            $st = $pdo->prepare('UPDATE users SET total_poin = total_poin + :d WHERE id = :id');
            $st->execute([':d' => $delta, ':id' => $u['id']]);
        }

        send(200, ['status' => 'ok', 'tanggal' => $tanggal, 'jenis' => $jenis, 'poin' => $poin]);
    }

    // POST /puasa/delete — { "tanggal" }
    if ($method === 'POST' && $path === '/puasa/delete') {
        $u = authUser($pdo);
        $b = readJson();
        $tanggal = $b['tanggal'] ?? date('Y-m-d');
        if (!preg_match('/^\d{4}-\d{2}-\d{2}$/', $tanggal)) $tanggal = date('Y-m-d');

        $st = $pdo->prepare('SELECT poin FROM puasa_log WHERE user_id = :u AND tanggal = :d');
        $st->execute([':u' => $u['id'], ':d' => $tanggal]);
        $poin = $st->fetchColumn();
        if ($poin !== false) {
            $st = $pdo->prepare('DELETE FROM puasa_log WHERE user_id = :u AND tanggal = :d');
            $st->execute([':u' => $u['id'], ':d' => $tanggal]);
            if ((int)$poin > 0) {
                $st = $pdo->prepare('UPDATE users SET total_poin = GREATEST(0, total_poin - :p) WHERE id = :id');
                $st->execute([':p' => (int)$poin, ':id' => $u['id']]);
            }
        }
        send(200, ['status' => 'ok']);
    }

    // ─────────────────────────────────────────────────────────────
    // DZIKIR — pagi/petang/tidur/bangun
    // ─────────────────────────────────────────────────────────────

    // GET /dzikir?date=YYYY-MM-DD
    if ($method === 'GET' && $path === '/dzikir') {
        $u = authUser($pdo);
        $date = $_GET['date'] ?? date('Y-m-d');
        if (!preg_match('/^\d{4}-\d{2}-\d{2}$/', $date)) $date = date('Y-m-d');

        $st = $pdo->prepare('SELECT kategori, poin FROM dzikir_log WHERE user_id = :u AND tanggal = :d');
        $st->execute([':u' => $u['id'], ':d' => $date]);
        $done = [];
        foreach ($st->fetchAll() as $r) {
            $done[$r['kategori']] = (int) $r['poin'];
        }
        $categories = ['pagi','petang','tidur','bangun'];
        $out = array_map(fn($c) => [
            'kategori' => $c,
            'done'     => isset($done[$c]),
            'poin'     => $done[$c] ?? 0,
        ], $categories);
        send(200, ['date' => $date, 'data' => $out]);
    }

    // POST /dzikir — { "kategori": "pagi", "tanggal"? }
    if ($method === 'POST' && $path === '/dzikir') {
        $u = authUser($pdo);
        $b = readJson();
        $kategori = (string)($b['kategori'] ?? '');
        $tanggal = $b['tanggal'] ?? date('Y-m-d');
        if (!in_array($kategori, ['pagi','petang','tidur','bangun'], true)) {
            send(400, ['message' => 'Kategori dzikir tidak valid']);
        }
        if (!preg_match('/^\d{4}-\d{2}-\d{2}$/', $tanggal)) $tanggal = date('Y-m-d');
        if ($tanggal > date('Y-m-d')) send(400, ['message' => 'Tanggal tidak valid']);

        $st = $pdo->prepare('SELECT 1 FROM dzikir_log WHERE user_id = :u AND tanggal = :d AND kategori = :k');
        $st->execute([':u' => $u['id'], ':d' => $tanggal, ':k' => $kategori]);
        if ($st->fetchColumn()) {
            send(200, ['status' => 'already_done']);
        }

        $poin = 5;
        $st = $pdo->prepare(
            'INSERT INTO dzikir_log (id, user_id, tanggal, kategori, poin)
             VALUES (:id, :u, :d, :k, :p)'
        );
        $st->execute([
            ':id' => uuid(),
            ':u'  => $u['id'],
            ':d'  => $tanggal,
            ':k'  => $kategori,
            ':p'  => $poin,
        ]);
        $st = $pdo->prepare('UPDATE users SET total_poin = total_poin + :p WHERE id = :id');
        $st->execute([':p' => $poin, ':id' => $u['id']]);
        send(200, ['status' => 'ok', 'poin' => $poin]);
    }

    // POST /dzikir/delete — { "kategori", "tanggal"? }
    if ($method === 'POST' && $path === '/dzikir/delete') {
        $u = authUser($pdo);
        $b = readJson();
        $kategori = (string)($b['kategori'] ?? '');
        $tanggal = $b['tanggal'] ?? date('Y-m-d');
        if (!in_array($kategori, ['pagi','petang','tidur','bangun'], true)) {
            send(400, ['message' => 'Kategori tidak valid']);
        }
        if (!preg_match('/^\d{4}-\d{2}-\d{2}$/', $tanggal)) $tanggal = date('Y-m-d');

        $st = $pdo->prepare('SELECT poin FROM dzikir_log WHERE user_id = :u AND tanggal = :d AND kategori = :k');
        $st->execute([':u' => $u['id'], ':d' => $tanggal, ':k' => $kategori]);
        $poin = $st->fetchColumn();
        if ($poin !== false) {
            $st = $pdo->prepare('DELETE FROM dzikir_log WHERE user_id = :u AND tanggal = :d AND kategori = :k');
            $st->execute([':u' => $u['id'], ':d' => $tanggal, ':k' => $kategori]);
            $st = $pdo->prepare('UPDATE users SET total_poin = GREATEST(0, total_poin - :p) WHERE id = :id');
            $st->execute([':p' => (int)$poin, ':id' => $u['id']]);
        }
        send(200, ['status' => 'ok']);
    }

    // ── APP CONFIG: GET (public, no auth) ────────────────────
    // Return semua config yg aman ditampilkan ke frontend
    // (meta pixel id, WA group, CS contact). Frontend pakai untuk inject pixel
    // dan render tombol Hubungi Kami.
    if ($method === 'GET' && $path === '/app-config') {
        $rows = $pdo->query('SELECT config_key, config_value FROM app_config')->fetchAll();
        $out = [];
        foreach ($rows as $r) {
            $out[$r['config_key']] = $r['config_value'];
        }
        // Pastikan semua default keys ada walaupun row di DB belum di-seed
        $defaults = [
            'meta_pixel_id'         => '',
            'whatsapp_group_url'    => '',
            'whatsapp_group_label'  => 'Gabung Grup WhatsApp Amalan',
            'cs_whatsapp_number'    => '',
            'cs_name'               => 'Admin Amalan',
            'cs_label'              => 'Chat Admin via WhatsApp',
            'contact_enabled'       => '1',
        ];
        foreach ($defaults as $k => $v) {
            if (!isset($out[$k])) $out[$k] = $v;
        }
        send(200, ['data' => $out]);
    }

    // ── APP CONFIG: PATCH (admin only) ───────────────────────
    // Body: { "meta_pixel_id": "...", "whatsapp_group_url": "...", ... }
    // Hanya key yang ada di whitelist yang diupdate; sisanya diabaikan.
    if ($method === 'POST' && $path === '/admin/app-config') {
        $u = authUser($pdo);
        if (($u['role'] ?? 'user') !== 'admin') {
            send(403, ['message' => 'Akses ditolak - hanya admin']);
        }
        $b = readJson();
        $allowed = [
            'meta_pixel_id', 'whatsapp_group_url', 'whatsapp_group_label',
            'cs_whatsapp_number', 'cs_name', 'cs_label', 'contact_enabled',
        ];
        $updated = [];
        $pdo->beginTransaction();
        try {
            $st = $pdo->prepare(
                'INSERT INTO app_config (config_key, config_value) VALUES (:k, :v)
                 ON DUPLICATE KEY UPDATE config_value = VALUES(config_value)'
            );
            foreach ($allowed as $key) {
                if (array_key_exists($key, $b)) {
                    $val = $b[$key];
                    if ($val === null) $val = '';
                    if (!is_string($val)) $val = (string) $val;
                    // Basic sanitization untuk URL/number field
                    if ($key === 'meta_pixel_id') {
                        $val = preg_replace('/[^0-9]/', '', $val) ?? '';
                    } elseif ($key === 'cs_whatsapp_number') {
                        // Hilangkan spasi, dash, plus, dll - simpan digit only
                        $val = preg_replace('/[^0-9]/', '', $val) ?? '';
                    } elseif ($key === 'whatsapp_group_url') {
                        $val = trim($val);
                        if ($val !== '' && !preg_match('#^https?://#i', $val)) {
                            send(400, ['message' => 'whatsapp_group_url harus diawali http:// atau https://']);
                        }
                    } elseif ($key === 'contact_enabled') {
                        $val = ($val === '1' || $val === 'true' || $val === 1 || $val === true) ? '1' : '0';
                    } else {
                        $val = trim($val);
                        if (mb_strlen($val) > 255) $val = mb_substr($val, 0, 255);
                    }
                    $st->execute([':k' => $key, ':v' => $val]);
                    $updated[$key] = $val;
                }
            }
            $pdo->commit();
        } catch (Throwable $e) {
            $pdo->rollBack();
            throw $e;
        }
        send(200, ['ok' => true, 'updated' => $updated]);
    }

    // ── HEALTH ───────────────────────────────────────────────
    if ($method === 'GET' && ($path === '/' || $path === '/health')) {
        // Cek konektivitas DB & struktur tabel
        $checks = [
            'ok' => true,
            'service' => 'amalan-api',
            'version' => '1.1',
            'db' => 'unknown',
            'tables' => [],
            'features' => [],
        ];
        try {
            $pdo->query('SELECT 1');
            $checks['db'] = 'connected';

            $tables = ['users', 'amalan_log', 'sessions'];
            foreach ($tables as $t) {
                $st = $pdo->query("SHOW TABLES LIKE '$t'");
                $checks['tables'][$t] = $st && $st->fetchColumn() ? 'ok' : 'MISSING';
            }

            // Cek fitur kelipatan
            $st = $pdo->query("SHOW COLUMNS FROM amalan_log LIKE 'count_n'");
            $checks['features']['kelipatan'] = $st && $st->fetchColumn() ? 'enabled' : 'fallback (run migrate.sql)';
        } catch (Throwable $e) {
            $checks['ok'] = false;
            $checks['db'] = 'error: ' . $e->getMessage();
        }
        send(200, $checks);
    }

    send(404, ['message' => 'Route not found', 'path' => $path]);
} catch (Throwable $e) {
    send(500, ['message' => 'Server error', 'error' => $e->getMessage()]);
}
