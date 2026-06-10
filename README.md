# Dataset Al-Qur'an Lengkap (Arab + Latin + Indonesia + Audio)

Skrip Python untuk download dataset Al-Qur'an dari **EQuran.id API v2** — gratis, tanpa registrasi, tanpa API key.

## Yang Kamu Dapatkan

- **114 surat** lengkap
- **6.236 ayat** dengan:
  - Teks Arab (mushaf standar)
  - Teks Latin / transliterasi
  - Terjemahan Bahasa Indonesia (Kemenag)
  - URL audio MP3 dari **6 qari**:
    - 01 — Abdullah Al-Juhany
    - 02 — Abdul Muhsin Al-Qasim
    - 03 — Abdurrahman As-Sudais
    - 04 — Ibrahim Al-Dossari
    - 05 — Misyari Rasyid Al-Afasy
    - 06 — Yasser Al-Dosari

## Cara Pakai

```bash
# 1. Install dependency (cuma butuh requests)
pip install requests

# 2. Jalankan
python download_quran.py
```

Selesai dalam **~30-60 detik** tergantung koneksi.

## Output

| File | Isi | Format |
|---|---|---|
| `quran_lengkap.json` | Semua data dalam 1 file (nested) | JSON, ~10 MB |
| `quran_surat.csv` | Metadata 114 surat | CSV, untuk Excel/pandas |
| `quran_ayat.csv` | 6.236 ayat (Arab + Latin + Indonesia) | CSV, untuk Excel/pandas |
| `audio_urls.csv` | URL audio per ayat × 6 qari | CSV |

## Contoh Penggunaan Data

### Dengan pandas (Python):
```python
import pandas as pd
df = pd.read_csv("quran_ayat.csv")
print(df.head())

# Cari ayat tentang sabar
hasil = df[df["teksIndonesia"].str.contains("sabar", case=False, na=False)]
print(hasil[["surat_namaLatin", "ayat_nomor", "teksIndonesia"]].head())
```

### Dengan JSON (JavaScript/Node):
```javascript
const quran = require("./quran_lengkap.json");
const alFatihah = quran.surat[0];
console.log(alFatihah.ayat[0].teksLatin);
// "Bismillāhir-raḥmānir-raḥīm(i)."
```

## Catatan

- File **audio TIDAK ikut terdownload** — yang disimpan hanya URL-nya. Audio bisa di-stream langsung dari CDN EQuran.id (cepat & ringan).
- Jika ingin download file MP3 audio juga, beritahu aku, bisa kubuatkan skrip tambahan (ukurannya akan jadi ~3-5 GB untuk semua qari).
- Lihat `sample_struktur.json` untuk preview struktur datanya (berisi Surat Al-Fatihah sebagai contoh).

## Sumber & Lisensi

- API: [EQuran.id v2](https://equran.id/apidev/v2)
- Teks Al-Qur'an: Mushaf Standar Indonesia (Kemenag RI)
- Audio: 6 qari terkenal, CDN global EQuran.id
