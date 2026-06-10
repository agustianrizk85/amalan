<?php
/**
 * DEBUG — cek kenapa role rikiadmin gak match.
 *
 * Upload ke api.amalan-mu.com (sejajar dengan index.php),
 * buka: https://api.../check-role.php
 *
 * HAPUS setelah selesai!
 */
declare(strict_types=1);
header('Content-Type: application/json; charset=utf-8');

$configPath = __DIR__ . '/config.php';
if (!file_exists($configPath)) {
    echo json_encode(['error' => 'config.php tidak ada']);
    exit;
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

    $info = [
        'config_says_db_name'  => $config['db_name'],
        'actual_db_in_use'     => $pdo->query('SELECT DATABASE()')->fetchColumn(),
        'all_databases'        => $pdo->query('SHOW DATABASES')->fetchAll(PDO::FETCH_COLUMN),
        'users_table_columns'  => $pdo->query('SHOW COLUMNS FROM users')->fetchAll(PDO::FETCH_COLUMN),
        'rikiadmin_row'        => null,
        'total_users'          => (int)$pdo->query('SELECT COUNT(*) FROM users')->fetchColumn(),
    ];

    $st = $pdo->prepare("SELECT id, name, email, role FROM users WHERE name = 'rikiadmin' LIMIT 1");
    $st->execute();
    $info['rikiadmin_row'] = $st->fetch(PDO::FETCH_ASSOC) ?: 'NOT FOUND in this DB';

    echo json_encode($info, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
} catch (Throwable $e) {
    echo json_encode([
        'error'   => 'DB error',
        'message' => $e->getMessage(),
        'config'  => [
            'db_host' => $config['db_host'] ?? null,
            'db_name' => $config['db_name'] ?? null,
            'db_user' => $config['db_user'] ?? null,
        ],
    ], JSON_PRETTY_PRINT);
}
