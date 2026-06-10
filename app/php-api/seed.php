<?php
/**
 * Seeder demo data — inisialisasi 6 user dummy untuk papan peringkat.
 *
 * Cara pakai (dari folder php-api/):
 *   php seed.php           # tambah data jika belum ada
 *   php seed.php --reset   # hapus semua data dulu, lalu seed ulang
 *
 * Password default semua demo user: "demo123"
 */
declare(strict_types=1);

$configPath = __DIR__ . '/config.php';
if (!file_exists($configPath)) {
    fwrite(STDERR, "❌ config.php tidak ditemukan. Salin config.example.php → config.php dan isi kredensial DB.\n");
    exit(1);
}
$config = require $configPath;

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
    fwrite(STDERR, "❌ Koneksi DB gagal: " . $e->getMessage() . "\n");
    exit(1);
}

$reset = in_array('--reset', $argv, true);
if ($reset) {
    echo "⚠️  Reset mode — menghapus semua data...\n";
    $pdo->exec('SET FOREIGN_KEY_CHECKS = 0');
    $pdo->exec('TRUNCATE TABLE sessions');
    $pdo->exec('TRUNCATE TABLE amalan_log');
    $pdo->exec('TRUNCATE TABLE users');
    $pdo->exec('SET FOREIGN_KEY_CHECKS = 1');
}

function uuid(): string {
    $b = random_bytes(16);
    $b[6] = chr((ord($b[6]) & 0x0f) | 0x40);
    $b[8] = chr((ord($b[8]) & 0x3f) | 0x80);
    return vsprintf('%s%s-%s-%s-%s-%s%s%s', str_split(bin2hex($b), 4));
}

// Data demo — 10 santri/santriwati untuk papan peringkat
$demo = [
    ['name' => 'Ustadz Abdul Hakim',    'email' => 'hakim@demo.test',    'poin' => 1875, 'streak' => 42],
    ['name' => 'Hafidzah Aisyah',       'email' => 'aisyah@demo.test',   'poin' => 1620, 'streak' => 35],
    ['name' => 'Muhammad Iqbal',        'email' => 'iqbal@demo.test',    'poin' => 1450, 'streak' => 28],
    ['name' => 'Khadijah Nurhayati',    'email' => 'khadijah@demo.test', 'poin' => 1290, 'streak' => 21],
    ['name' => 'Ahmad Fauzi Ramadhan',  'email' => 'fauzi@demo.test',    'poin' => 1180, 'streak' => 18],
    ['name' => 'Siti Rahmah Wulandari', 'email' => 'rahmah@demo.test',   'poin' => 1050, 'streak' => 14],
    ['name' => 'Yusuf Haikal Pratama',  'email' => 'yusuf@demo.test',    'poin' =>  920, 'streak' => 10],
    ['name' => 'Fatimah Az-Zahra',      'email' => 'fatimah@demo.test',  'poin' =>  815, 'streak' =>  7],
    ['name' => 'Hasan Bukhori',         'email' => 'hasan@demo.test',    'poin' =>  680, 'streak' =>  5],
    ['name' => 'Maryam Salsabila',      'email' => 'maryam@demo.test',   'poin' =>  540, 'streak' =>  3],
];

$password = 'demo123';
$hash = password_hash($password, PASSWORD_DEFAULT);

$insertedUser = 0;
$skippedUser = 0;
$insertedLog = 0;

foreach ($demo as $u) {
    // Cek apakah email sudah ada (idempotent)
    $check = $pdo->prepare('SELECT id FROM users WHERE email = :e');
    $check->execute([':e' => $u['email']]);
    $existing = $check->fetchColumn();
    if ($existing) {
        echo "  · {$u['name']} sudah ada, dilewati.\n";
        $skippedUser++;
        continue;
    }

    $id = uuid();
    $today = date('Y-m-d');

    $stmt = $pdo->prepare(
        'INSERT INTO users (id, name, email, password_hash, total_poin, streak_days, last_active)
         VALUES (:id, :n, :e, :h, :p, :s, :la)'
    );
    $stmt->execute([
        ':id' => $id,
        ':n'  => $u['name'],
        ':e'  => $u['email'],
        ':h'  => $hash,
        ':p'  => $u['poin'],
        ':s'  => $u['streak'],
        ':la' => $today,
    ]);
    $insertedUser++;

    // Tambah beberapa entri log hari ini supaya tampak aktif & poin konsisten
    $sampleAmalan = [
        ['id' => 'sholat-subuh',   'name' => 'Sholat Subuh',     'poin' => 30],
        ['id' => 'sholat-dzuhur',  'name' => 'Sholat Dzuhur',    'poin' => 30],
        ['id' => 'sholat-ashar',   'name' => 'Sholat Ashar',     'poin' => 30],
        ['id' => 'tahajud',        'name' => 'Sholat Tahajud',   'poin' => 40],
        ['id' => 'dhuha',          'name' => 'Sholat Dhuha',     'poin' => 35],
        ['id' => 'dzikir-pagi',    'name' => 'Dzikir Pagi',      'poin' => 30],
        ['id' => 'dzikir-sore',    'name' => 'Dzikir Sore',      'poin' => 30],
        ['id' => 'tadarus-juz',    'name' => 'Tadarus 1 Juz',    'poin' => 50],
        ['id' => 'kahfi',          'name' => 'Al-Kahfi',         'poin' => 65],
        ['id' => 'yasin',          'name' => 'Yā-Sīn',           'poin' => 55],
        ['id' => 'waqiah',         'name' => "Al-Wāqi'ah",       'poin' => 50],
        ['id' => 'mulk',           'name' => 'Al-Mulk',          'poin' => 35],
        ['id' => 'sholawat',       'name' => 'Sholawat 100×',    'poin' => 20],
        ['id' => 'istighfar',      'name' => 'Istighfar 100×',   'poin' => 20],
        ['id' => 'sedekah',        'name' => 'Sedekah Harian',   'poin' => 30],
    ];
    // Pilih 2-4 amalan random untuk user ini
    shuffle($sampleAmalan);
    $countPicks = rand(2, 4);
    for ($k = 0; $k < $countPicks; $k++) {
        $pick = $sampleAmalan[$k];
        try {
            $logStmt = $pdo->prepare(
                'INSERT INTO amalan_log (id, user_id, surat_id, surat_name, poin, tanggal)
                 VALUES (:id, :u, :sid, :sn, :p, :t)'
            );
            $logStmt->execute([
                ':id'  => uuid(),
                ':u'   => $id,
                ':sid' => $pick['id'],
                ':sn'  => $pick['name'],
                ':p'   => $pick['poin'],
                ':t'   => $today,
            ]);
            $insertedLog++;
        } catch (PDOException $e) {
            if ($e->getCode() !== '23000') throw $e;
        }
    }

    echo "  ✓ {$u['name']} ({$u['poin']} poin)\n";
}

echo "\n✅ Selesai.\n";
echo "   User baru   : {$insertedUser}\n";
echo "   Dilewati    : {$skippedUser}\n";
echo "   Amalan log  : {$insertedLog}\n";
echo "\nLogin demo: email apa saja di atas + password \"{$password}\"\n";
