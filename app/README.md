# Amalan Al-Quran

Aplikasi pencatat amalan harian (membaca surat) dengan leaderboard, riwayat, dan streak.

**Stack:** Vite + React + TypeScript + Tailwind v4 + PHP + MySQL.
Tanpa framework backend ribet — cukup PHP + MySQL biasa, bisa di-deploy ke shared hosting (cPanel) atau VPS.

```
amalan/app/
├── src/                  ← Frontend React
│   ├── App.tsx
│   ├── main.tsx
│   ├── components/       ← Header, BottomNav, AppShell, SectionHeader
│   ├── pages/            ← AuthPage, AmalanPage, LeaderboardPage, RiwayatPage, ProfilPage
│   └── lib/              ← api.ts, auth.tsx, toast.tsx, data.ts
├── public/.htaccess      ← SPA fallback (akan dikopi ke dist/ saat build)
├── php-api/
│   ├── index.php         ← Single-file API (semua endpoint)
│   ├── config.example.php ← Salin → config.php, isi kredensial DB
│   ├── schema.sql        ← Skema MySQL
│   └── .htaccess
└── package.json
```

## 1. Setup Database (MySQL)

1. Buat database baru di phpMyAdmin / MySQL CLI, mis: `amalan_db`.
2. Import `php-api/schema.sql`:
   ```bash
   mysql -u root -p amalan_db < php-api/schema.sql
   ```
   Atau di phpMyAdmin: tab **Import** → pilih `schema.sql` → Go.

## 2. Setup PHP API

```bash
cd php-api
cp config.example.php config.php
# Edit config.php → isi db_host, db_name, db_user, db_pass
```

**Test API lokal** (butuh PHP ≥ 7.4 dengan ext PDO + mysql):
```bash
cd php-api
php -S localhost:8080
# Buka http://localhost:8080/health → {"ok":true,"service":"amalan-api"}
```

## 3. Setup Frontend

```bash
npm install
npm run dev      # buka http://localhost:5173
```

Saat dev, request `/api/*` di-proxy otomatis ke `http://localhost:8080` (lihat `vite.config.ts`).

**Production build:**
```bash
npm run build    # output → dist/
```

## 4. Deploy ke Shared Hosting (cPanel)

Layout final di `public_html/`:

```
public_html/
├── index.html              ← dari dist/
├── assets/                 ← dari dist/assets/
├── .htaccess               ← dari dist/ (SPA fallback)
└── api/
    ├── index.php           ← dari php-api/
    ├── config.php          ← isi kredensial DB hosting
    └── .htaccess           ← dari php-api/
```

**Langkah:**

1. Jalankan `npm run build` lokal → folder `dist/` siap upload.
2. Login cPanel → **File Manager** → `public_html`.
3. Upload semua isi `dist/` ke `public_html/`.
4. Buat folder `public_html/api/`.
5. Upload `php-api/index.php` + `php-api/.htaccess` ke `public_html/api/`.
6. Buat database MySQL di cPanel (**MySQL Databases**), lalu import `schema.sql` lewat phpMyAdmin.
7. Salin `php-api/config.example.php` → `public_html/api/config.php`, isi kredensial DB cPanel.
8. Buka `https://domain-kamu.com` — selesai!

## 5. Deploy Frontend & API Terpisah (opsional)

Kalau frontend di-host di Vercel/Netlify dan PHP di hosting lain:

1. Set `VITE_API_URL=https://api.domain-kamu.com` di `.env.local` sebelum build.
2. Di `config.php`, ubah `cors_origin` ke domain frontend, mis:
   ```php
   'cors_origin' => 'https://app.domain-kamu.com',
   ```

## API Endpoints

| Method | Path             | Auth | Body                                          | Return |
|--------|------------------|------|-----------------------------------------------|--------|
| POST   | `/register`      | –    | `{ name, email?, password }`                  | `{ token, user }` |
| POST   | `/login`         | –    | `{ name? \| email?, password }`               | `{ token, user }` |
| POST   | `/logout`        | ✓    | –                                             | `{ ok: true }` |
| GET    | `/me`            | ✓    | –                                             | `{ user, today_surat[], rank }` |
| POST   | `/amalan`        | ✓    | `{ surat_id, surat_name, poin }`              | `{ status, user }` |
| GET    | `/leaderboard`   | –    | –                                             | `{ data: [...] }` |
| GET    | `/riwayat`       | ✓    | –                                             | `{ data: [{ date, items[] }] }` |

Auth: header `Authorization: Bearer <token>`. Token didapat dari `/login` atau `/register` dan disimpan di `localStorage`.

## Anti-cheat

- Constraint `UNIQUE (user_id, surat_id, tanggal)` di tabel `amalan_log` — satu surat hanya bisa dicatat 1× per hari per user.
- `total_poin` di-update atomik via transaksi PHP (`BEGIN ... COMMIT`).
- Streak dihitung server-side: jika `last_active = kemarin` → +1, jika hari yang sama → tetap, lainnya → reset ke 1.

## Catatan Keamanan

- Ganti `cors_origin` ke domain spesifik di production.
- Pastikan `config.php` tidak ter-commit ke git (`.gitignore` sudah include).
- Password di-hash pakai `password_hash()` (bcrypt).
- Session token = 32 byte random hex; expire default 30 hari (atur di `session_ttl`).
