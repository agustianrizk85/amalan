# 🚀 Deploy Amalan Harian

## 📦 Isi Folder

| File | Ukuran | Untuk |
|---|---|---|
| `amalan-frontend.zip` | **1.4 MB** | Upload ke domain frontend (public_html) |
| `amalan-api.zip` | **12 KB** | Upload ke domain/folder backend (php-api) |

---

## 1️⃣ Setup Database (sekali saja)

Login ke phpMyAdmin / mysql CLI, lalu jalankan:

```sql
-- Pilih database tujuan
USE nama_database_kamu;

-- Jalankan file migration
SOURCE /path/to/migrate.sql;
```

Atau copy-paste isi `migrate.sql` ke phpMyAdmin → tab SQL → Go.

Script ini **idempotent** (aman dijalankan berulang) — akan:
- Buat tabel `users`, `amalan_log`, `sessions` kalau belum ada
- Tambah kolom `count_n` ke `amalan_log` kalau belum ada
- Return statistik baris di akhir

---

## 2️⃣ Setup Backend (`amalan-api.zip`)

1. **Extract** `amalan-api.zip` ke folder backend di hosting (mis. `public_html/api/` atau subdomain `api.domainmu.com`)
2. **Buat `config.php`** dari template `config.example.php`:
   ```php
   <?php return [
     'db_host'      => 'localhost',
     'db_name'      => 'nama_database',
     'db_user'      => 'username_db',
     'db_pass'      => 'password_db',
     'db_charset'   => 'utf8mb4',
     'session_ttl'  => 2592000, // 30 hari
     'cors_origin'  => 'https://domain-frontend-kamu.com', // atau '*' untuk dev
   ];
   ```
3. **Pastikan `.htaccess`** terupload (zip sudah include — kalau tidak terlihat di cPanel, enable "Show hidden files")
4. **Test**: buka `https://api-kamu.com/health` di browser — harus return JSON:
   ```json
   {
     "ok": true,
     "service": "amalan-api",
     "db": "connected",
     "tables": {"users":"ok","amalan_log":"ok","sessions":"ok"},
     "features": {"kelipatan":"enabled"}
   }
   ```

Kalau `db:"error: ..."` muncul → cek kredensial di `config.php`.
Kalau `kelipatan:"fallback"` → jalankan ulang `migrate.sql`.

---

## 3️⃣ Setup Frontend (`amalan-frontend.zip`)

1. **Extract** `amalan-frontend.zip` ke root domain frontend (`public_html/`)
2. **Pastikan `.htaccess` terupload** (penting untuk SPA routing)
3. **Buka domain** di browser → harus muncul halaman login Amalan

### Kalau API di domain berbeda

Edit `index.html` sebelum upload, ATAU buat `.env` di mesin build dengan:
```
VITE_API_URL=https://api.domainmu.com
```
Lalu rebuild ulang: `npm run build`.

**Default**: frontend cari API di `/api` (asumsi backend di subfolder `/api` di domain yang sama).

---

## 4️⃣ Verifikasi setelah Deploy

✅ **Health check**: `https://domain/api/health` → JSON `ok:true`  
✅ **Register**: buka frontend → buat akun baru → cek tabel `users`  
✅ **Centang amalan**: klik bulatan → cek row di `amalan_log`  
✅ **Kelipatan**: klik `×N` → 100× → cek `count_n=100` di DB  
✅ **Date picker**: pilih tanggal kemarin → centang → cek tanggal di DB  
✅ **Uncheck**: klik centang yang hijau → row di DB terhapus  
✅ **Beranda**: scroll button — Baca Qur'an, Terakhir Baca, Pencarian, Jadwal Sholat, Pengaturan  
✅ **Pengaturan**: ubah font size → live preview → tutup → buka surat → font terapan  
✅ **Jadwal Sholat**: pilih kota → waktu sholat muncul (Aladhan API)  

---

## 🔧 Troubleshooting

### "Cache lama masih kepake"
User existing perlu unregister Service Worker lama (otomatis di v8 ini, tapi kalau ada yang ngeluh):
- F12 → Application → Service Workers → **Unregister**
- Hard refresh `Ctrl+Shift+R`

### CORS error di browser
Edit `config.php` di backend, isi `cors_origin` dengan domain frontend tepat, atau pakai `'*'` untuk testing.

### 404 saat klik link `/beranda` atau `/pengaturan`
`.htaccess` di frontend tidak terupload atau `mod_rewrite` server mati. Aktifkan di cPanel atau hubungi hosting provider.

### Database error 1062 (duplicate)
UNIQUE constraint (user_id, surat_id, tanggal) sudah otomatis handle via UPSERT — kalau masih error, restart PHP-FPM atau clear OPcache.

---

## 📊 Bundle Info

- **Frontend bundle**: 481 KB (gzip 143 KB) — fast load
- **Quran data**: 6.5 MB (gzip 1.3 MB) — lazy-loaded saat user buka reader (sekali doang, cached SW)
- **Service Worker**: v8 — auto-invalidate cache lama user existing

---

🤲 _Semoga aplikasi ini bermanfaat untuk umat._
