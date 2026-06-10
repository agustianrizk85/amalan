<?php
// Salin file ini ke `config.php` lalu isi sesuai database hosting kamu.
return [
    'db_host'     => 'localhost',
    'db_name'     => 'GANTI_ISI_NAMA_DATABASE',
    'db_user'     => 'GANTI_USER_DATABASE',
    'db_pass'     => 'GANTI_PASSWORD_DATABASE',
    'db_charset'  => 'utf8mb4',

    // Origin yang diizinkan (CORS).
    // Frontend Amalan di-host di amalan.dbntracker.com — jadi hanya ini yang boleh
    // memanggil API. Tambah origin lain kalau perlu (array).
    'cors_origin' => 'https://amalan.dbntracker.com',

    // Berapa lama session valid (detik). Default 30 hari.
    'session_ttl' => 60 * 60 * 24 * 30,
];
