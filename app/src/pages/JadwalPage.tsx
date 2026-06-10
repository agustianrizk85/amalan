import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useSettings } from "@/lib/settings";

type Timings = {
  Fajr: string;
  Sunrise: string;
  Dhuhr: string;
  Asr: string;
  Maghrib: string;
  Isha: string;
};

type AladhanRes = {
  code: number;
  status: string;
  data: {
    timings: Timings;
    date: { readable: string; gregorian: { date: string }; hijri: { date: string; weekday: { en: string }; month: { en: string } } };
    meta: { timezone: string };
  };
};

const SHOLAT_ITEMS: { key: keyof Timings; label: string; icon: string; deskripsi: string }[] = [
  { key: "Fajr",    label: "Subuh",    icon: "🌅", deskripsi: "Sholat fajar — pembuka hari" },
  { key: "Sunrise", label: "Syuruq",   icon: "☀️", deskripsi: "Terbit matahari (akhir waktu Subuh)" },
  { key: "Dhuhr",   label: "Dzuhur",   icon: "🌤️", deskripsi: "Sholat tengah hari" },
  { key: "Asr",     label: "Ashar",    icon: "🌇", deskripsi: "Sholat sore" },
  { key: "Maghrib", label: "Maghrib",  icon: "🌆", deskripsi: "Sholat saat matahari terbenam" },
  { key: "Isha",    label: "Isya",     icon: "🌙", deskripsi: "Sholat malam" },
];

type Geo = { lat: number; lng: number; label: string };
const GEO_KEY = "amalan_jadwal_geo_v1";

function loadGeo(): Geo | null {
  try {
    const raw = localStorage.getItem(GEO_KEY);
    return raw ? (JSON.parse(raw) as Geo) : null;
  } catch {
    return null;
  }
}

function minutesNow(): number {
  const d = new Date();
  return d.getHours() * 60 + d.getMinutes();
}

function timeToMinutes(t: string): number {
  const [h, m] = t.split(":").map(Number);
  return (h || 0) * 60 + (m || 0);
}

function fmtRemaining(diffMin: number): string {
  if (diffMin < 0) return "—";
  const h = Math.floor(diffMin / 60);
  const m = diffMin % 60;
  if (h === 0) return `${m} menit lagi`;
  if (m === 0) return `${h} jam lagi`;
  return `${h} jam ${m} menit lagi`;
}

export default function JadwalPage() {
  const nav = useNavigate();
  const { settings } = useSettings();
  const [timings, setTimings] = useState<Timings | null>(null);
  const [hijri, setHijri] = useState<string>("");
  const [tz, setTz] = useState<string>("");
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [nowMin, setNowMin] = useState(() => minutesNow());
  const [geo, setGeo] = useState<Geo | null>(() => loadGeo());
  const [locating, setLocating] = useState(false);

  useEffect(() => {
    const t = setInterval(() => setNowMin(minutesNow()), 30000);
    return () => clearInterval(t);
  }, []);

  // Minta lokasi GPS, lalu cari nama wilayah (reverse geocode, opsional)
  const useMyLocation = () => {
    if (!("geolocation" in navigator)) {
      setErr("Perangkat tidak mendukung GPS/geolokasi.");
      return;
    }
    setLocating(true);
    setErr(null);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        let label = "Lokasi saya (GPS)";
        try {
          const r = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=id`,
          );
          const j = await r.json();
          const nama = j.city || j.locality || j.principalSubdivision;
          if (nama) label = `${nama} (GPS)`;
        } catch {
          /* abaikan — pakai label default */
        }
        const g: Geo = { lat, lng, label };
        setGeo(g);
        try {
          localStorage.setItem(GEO_KEY, JSON.stringify(g));
        } catch {
          /* abaikan */
        }
        setLocating(false);
      },
      (e) => {
        setLocating(false);
        setErr(
          e.code === e.PERMISSION_DENIED
            ? "Izin lokasi ditolak. Aktifkan izin lokasi di browser untuk pakai GPS."
            : "Gagal mendapatkan lokasi GPS. Coba lagi atau pakai kota manual.",
        );
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 5 * 60 * 1000 },
    );
  };

  const clearGeo = () => {
    setGeo(null);
    try {
      localStorage.removeItem(GEO_KEY);
    } catch {
      /* abaikan */
    }
  };

  const lokasiLabel = geo ? geo.label : settings.kota;

  useEffect(() => {
    let alive = true;
    setLoading(true);
    setErr(null);
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, "0");
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const yyyy = today.getFullYear();
    const url = geo
      ? `https://api.aladhan.com/v1/timings/${dd}-${mm}-${yyyy}?latitude=${geo.lat}&longitude=${geo.lng}&method=${settings.metode}`
      : `https://api.aladhan.com/v1/timingsByCity/${dd}-${mm}-${yyyy}?city=${encodeURIComponent(
          settings.kota,
        )}&country=Indonesia&method=${settings.metode}`;

    fetch(url)
      .then((r) => r.json() as Promise<AladhanRes>)
      .then((j) => {
        if (!alive) return;
        if (j.code !== 200) throw new Error(j.status || "Gagal memuat jadwal");
        // Normalisasi format jam (Aladhan kadang "04:33 (WIB)")
        const t = j.data.timings;
        const clean = (s: string) => s.replace(/\s.*$/, "");
        setTimings({
          Fajr: clean(t.Fajr),
          Sunrise: clean(t.Sunrise),
          Dhuhr: clean(t.Dhuhr),
          Asr: clean(t.Asr),
          Maghrib: clean(t.Maghrib),
          Isha: clean(t.Isha),
        });
        const h = j.data.date.hijri;
        setHijri(`${h.weekday.en}, ${h.date} ${h.month.en}`);
        setTz(j.data.meta.timezone);
      })
      .catch((e) => alive && setErr((e as Error).message))
      .finally(() => alive && setLoading(false));

    return () => { alive = false; };
  }, [settings.kota, settings.metode, geo]);

  // Cari waktu sholat berikutnya
  const next = useMemo(() => {
    if (!timings) return null;
    const candidates = SHOLAT_ITEMS
      .filter((s) => s.key !== "Sunrise")
      .map((s) => ({ ...s, time: timings[s.key], min: timeToMinutes(timings[s.key]) }));
    const future = candidates.filter((c) => c.min > nowMin);
    if (future.length === 0) {
      // Sudah Isya lewat, jadwal berikutnya = Fajr besok
      const fajr = candidates[0];
      return { ...fajr, diff: 24 * 60 - nowMin + fajr.min };
    }
    const n = future[0];
    return { ...n, diff: n.min - nowMin };
  }, [timings, nowMin]);

  const dateStr = new Date().toLocaleDateString("id-ID", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  });

  return (
    <div className="min-h-[100dvh] bg-bg pb-[calc(env(safe-area-inset-bottom)+24px)]">
      {/* Header */}
      <div className="sticky top-0 z-10 flex items-center gap-3 bg-gradient-to-br from-g to-g2 px-4 pt-[calc(env(safe-area-inset-top)+12px)] pb-4 text-white shadow-md">
        <button
          onClick={() => nav("/beranda")}
          className="flex size-11 shrink-0 items-center justify-center rounded-full border border-white/20 bg-white/15 transition active:scale-90"
          aria-label="Kembali"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round">
            <path d="m15 18-6-6 6-6" />
          </svg>
        </button>
        <div className="min-w-0 flex-1">
          <div className="font-display text-[22px] font-bold leading-tight">Jadwal Sholat</div>
          <div className="truncate text-[13px] text-white/70">📍 {lokasiLabel}</div>
        </div>
      </div>

      <div className="mx-auto max-w-[480px] px-4 pt-4">

        {/* Tanggal banner */}
        <div className="mb-4 rounded-2xl bg-gradient-to-br from-g to-g3 px-5 py-4 text-white shadow-lg">
          <div className="text-[13px] text-white/75">Hari ini</div>
          <div className="font-display text-[20px] font-bold">{dateStr}</div>
          {hijri && <div className="mt-1 text-[14px] text-aul">{hijri} H</div>}
          {tz && <div className="mt-1 text-[11px] text-white/55">Zona waktu: {tz}</div>}
        </div>

        {/* Tombol lokasi GPS */}
        <div className="mb-4 flex items-center gap-2">
          <button
            onClick={useMyLocation}
            disabled={locating}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl border-[1.5px] border-g/20 bg-white py-3 text-[13px] font-semibold text-g shadow-sm transition active:scale-[0.98] disabled:opacity-60"
          >
            {locating ? (
              <>⏳ Mendeteksi lokasi…</>
            ) : (
              <>📍 {geo ? "Perbarui lokasi GPS" : "Gunakan Lokasi Saya (GPS)"}</>
            )}
          </button>
          {geo && (
            <button
              onClick={clearGeo}
              className="rounded-xl border-[1.5px] border-[rgba(13,79,60,0.13)] bg-white px-3 py-3 text-[13px] font-semibold text-mu transition active:scale-[0.98]"
              title="Kembali ke kota manual"
            >
              ✕ Kota
            </button>
          )}
        </div>

        {/* Next prayer */}
        {next && (
          <div className="mb-4 rounded-2xl border-2 border-au bg-gradient-to-br from-aup to-white px-5 py-4 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[11px] font-bold tracking-wider text-au uppercase">Sholat Berikutnya</div>
                <div className="mt-0.5 font-display text-[24px] font-bold text-dk">{next.icon} {next.label}</div>
                <div className="text-[14px] text-mu">{fmtRemaining(next.diff)}</div>
              </div>
              <div className="text-right">
                <div className="font-display text-[34px] font-bold leading-none text-g">{next.time}</div>
              </div>
            </div>
          </div>
        )}

        {err && (
          <div className="mb-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-[14px] text-red-700">
            ⚠️ {err}<br />
            <span className="text-[12px]">Pastikan nama kota benar di Pengaturan, dan koneksi internet aktif.</span>
          </div>
        )}

        {loading && !timings && (
          <div className="py-10 text-center text-[14px] text-mu">⏳ Memuat jadwal...</div>
        )}

        {/* Daftar waktu sholat */}
        {timings && (
          <div className="rounded-2xl bg-white p-1 shadow-[0_3px_14px_rgba(13,79,60,0.08)]">
            {SHOLAT_ITEMS.map((s, i) => {
              const time = timings[s.key];
              const min = timeToMinutes(time);
              const isPassed = nowMin > min;
              const isNext = next?.key === s.key;
              return (
                <div
                  key={s.key}
                  className={`flex items-center gap-3 border-b border-[rgba(13,79,60,0.06)] px-3 py-3.5 last:border-b-0 ${
                    isNext ? "bg-aup/30 rounded-xl" : ""
                  }`}
                  style={{ animationDelay: `${i * 0.04}s` }}
                >
                  <div className="text-[26px]">{s.icon}</div>
                  <div className="min-w-0 flex-1">
                    <div className={`font-display text-[18px] font-bold ${isPassed && !isNext ? "text-mu" : "text-dk"}`}>
                      {s.label}
                    </div>
                    <div className="text-[12px] text-mu">{s.deskripsi}</div>
                  </div>
                  <div className={`font-display text-[24px] font-bold leading-none ${
                    isNext ? "text-au" : isPassed ? "text-mu" : "text-g"
                  }`}>
                    {time}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="mt-4 rounded-xl border border-[rgba(13,79,60,0.08)] bg-white px-4 py-3 text-[12px] leading-relaxed text-mu">
          💡 Jadwal dihitung dari API <b>Aladhan.com</b> dengan metode <b>{
            settings.metode === 20 ? "Kemenag RI" :
            settings.metode === 3 ? "Muslim World League" :
            settings.metode === 5 ? "Egyptian General Authority" :
            "Islamic Society of N. America"
          }</b>. Ganti kota & metode di <b>Pengaturan</b>.
        </div>

        <button
          onClick={() => nav("/pengaturan")}
          className="mt-3 w-full rounded-xl border-[1.5px] border-[rgba(13,79,60,0.13)] bg-white py-3.5 text-[14px] font-semibold text-g transition active:scale-[0.98]"
        >
          ⚙️ Ubah Kota / Metode
        </button>
      </div>
    </div>
  );
}
