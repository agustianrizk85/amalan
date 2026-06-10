#!/usr/bin/env python3
"""
Download Dataset Al-Qur'an Lengkap
===================================
Sumber: EQuran.id API v2 (gratis, tanpa registrasi)
Output:
  - quran_lengkap.json  : semua data dalam 1 file JSON
  - quran_ayat.csv      : data per ayat (siap untuk pandas/Excel)
  - quran_surat.csv     : metadata 114 surat
  - audio_urls.csv      : daftar URL audio per ayat dari 6 qari

Setiap ayat berisi:
  - Teks Arab          (teksArab)
  - Teks Latin/transliterasi (teksLatin)
  - Terjemahan Indonesia    (teksIndonesia)
  - Audio dari 6 qari:
      01 = Abdullah Al-Juhany
      02 = Abdul Muhsin Al-Qasim
      03 = Abdurrahman As-Sudais
      04 = Ibrahim Al-Dossari
      05 = Misyari Rasyid Al-Afasy
      06 = Yasser Al-Dosari

Cara pakai:
    pip install requests
    python download_quran.py
"""

import csv
import json
import time
from pathlib import Path

import requests

BASE = "https://equran.id/api/v2"
HEADERS = {"User-Agent": "Mozilla/5.0 (compatible; QuranDownloader/1.0)"}
OUT_DIR = Path(".")


def fetch_json(url: str, max_retry: int = 3) -> dict:
    """Ambil JSON dari endpoint dengan retry sederhana."""
    for attempt in range(1, max_retry + 1):
        try:
            r = requests.get(url, headers=HEADERS, timeout=30)
            r.raise_for_status()
            return r.json()
        except Exception as e:
            if attempt == max_retry:
                raise
            print(f"  ! Gagal ({e}), coba lagi ({attempt}/{max_retry})...")
            time.sleep(2 * attempt)


def download_all() -> dict:
    """Download semua 114 surat dengan ayat-ayatnya."""
    print("📥 Mengambil daftar surat...")
    daftar = fetch_json(f"{BASE}/surat")["data"]
    print(f"   ✓ {len(daftar)} surat ditemukan\n")

    semua = []
    for i, s in enumerate(daftar, 1):
        nomor = s["nomor"]
        print(f"[{i:3d}/114] Surat {nomor:3d} - {s['namaLatin']:<20s} ({s['jumlahAyat']:3d} ayat)", end="")
        detail = fetch_json(f"{BASE}/surat/{nomor}")["data"]
        semua.append(detail)
        print(" ✓")
        time.sleep(0.15)  # sopan ke server
    return {"surat": semua, "total_surat": len(semua)}


def save_json(data: dict, path: Path):
    with path.open("w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    size_mb = path.stat().st_size / 1024 / 1024
    print(f"   ✓ {path.name}  ({size_mb:.2f} MB)")


def save_csv_surat(data: dict, path: Path):
    cols = ["nomor", "nama", "namaLatin", "jumlahAyat", "tempatTurun", "arti", "deskripsi", "audioFull"]
    with path.open("w", encoding="utf-8", newline="") as f:
        w = csv.writer(f)
        w.writerow(cols)
        for s in data["surat"]:
            # audioFull adalah dict 6 qari → ambil qari 05 (Al-Afasy, paling populer)
            audio_full = s.get("audioFull", {})
            audio_05 = audio_full.get("05", "") if isinstance(audio_full, dict) else ""
            w.writerow([s["nomor"], s["nama"], s["namaLatin"], s["jumlahAyat"],
                        s["tempatTurun"], s["arti"], s.get("deskripsi", ""), audio_05])
    print(f"   ✓ {path.name}")


def save_csv_ayat(data: dict, path: Path):
    cols = ["surat_nomor", "surat_nama", "surat_namaLatin", "ayat_nomor",
            "teksArab", "teksLatin", "teksIndonesia"]
    with path.open("w", encoding="utf-8", newline="") as f:
        w = csv.writer(f)
        w.writerow(cols)
        for s in data["surat"]:
            for a in s["ayat"]:
                w.writerow([s["nomor"], s["nama"], s["namaLatin"], a["nomorAyat"],
                            a["teksArab"], a["teksLatin"], a["teksIndonesia"]])
    print(f"   ✓ {path.name}")


def save_csv_audio(data: dict, path: Path):
    cols = ["surat_nomor", "ayat_nomor",
            "audio_01_juhany", "audio_02_qasim", "audio_03_sudais",
            "audio_04_dossari", "audio_05_afasy", "audio_06_yasser"]
    with path.open("w", encoding="utf-8", newline="") as f:
        w = csv.writer(f)
        w.writerow(cols)
        for s in data["surat"]:
            for a in s["ayat"]:
                audio = a.get("audio", {})
                w.writerow([s["nomor"], a["nomorAyat"],
                            audio.get("01", ""), audio.get("02", ""),
                            audio.get("03", ""), audio.get("04", ""),
                            audio.get("05", ""), audio.get("06", "")])
    print(f"   ✓ {path.name}")


def main():
    print("=" * 60)
    print("  DOWNLOAD DATASET AL-QUR'AN (EQuran.id API v2)")
    print("=" * 60 + "\n")
    t0 = time.time()

    data = download_all()

    print("\n💾 Menyimpan file...")
    save_json(data, OUT_DIR / "quran_lengkap.json")
    save_csv_surat(data, OUT_DIR / "quran_surat.csv")
    save_csv_ayat(data, OUT_DIR / "quran_ayat.csv")
    save_csv_audio(data, OUT_DIR / "audio_urls.csv")

    total_ayat = sum(len(s["ayat"]) for s in data["surat"])
    dt = time.time() - t0
    print(f"\n✅ Selesai dalam {dt:.1f} detik")
    print(f"   {data['total_surat']} surat • {total_ayat} ayat")
    print(f"   File tersimpan di: {OUT_DIR.resolve()}\n")


if __name__ == "__main__":
    main()
