import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

// Koordinat Ka'bah (Masjidil Haram, Makkah)
const KAABA_LAT = 21.4225;
const KAABA_LNG = 39.8262;

const toRad = (d: number) => (d * Math.PI) / 180;
const toDeg = (r: number) => (r * 180) / Math.PI;

// Arah kiblat (bearing awal great-circle) dari titik user ke Ka'bah, 0–360° dari Utara
function qiblaBearing(lat: number, lng: number): number {
  const φ1 = toRad(lat);
  const φ2 = toRad(KAABA_LAT);
  const Δλ = toRad(KAABA_LNG - lng);
  const y = Math.sin(Δλ) * Math.cos(φ2);
  const x = Math.cos(φ1) * Math.sin(φ2) - Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ);
  return (toDeg(Math.atan2(y, x)) + 360) % 360;
}

// Jarak ke Ka'bah (km) — haversine
function jarakKm(lat: number, lng: number): number {
  const R = 6371;
  const dφ = toRad(KAABA_LAT - lat);
  const dλ = toRad(KAABA_LNG - lng);
  const a =
    Math.sin(dφ / 2) ** 2 +
    Math.cos(toRad(lat)) * Math.cos(toRad(KAABA_LAT)) * Math.sin(dλ / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

type IOSOrientationEvent = typeof DeviceOrientationEvent & {
  requestPermission?: () => Promise<"granted" | "denied">;
};

export default function KiblatPage() {
  const nav = useNavigate();
  const [bearing, setBearing] = useState<number | null>(null);
  const [distance, setDistance] = useState<number | null>(null);
  const [heading, setHeading] = useState<number | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [locating, setLocating] = useState(true);
  const [needPermission, setNeedPermission] = useState(false);
  const alignedRef = useRef(false);

  // 1) Ambil lokasi → hitung arah & jarak kiblat
  useEffect(() => {
    if (!("geolocation" in navigator)) {
      setErr("Perangkat tidak mendukung GPS/geolokasi.");
      setLocating(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude: lat, longitude: lng } = pos.coords;
        setBearing(qiblaBearing(lat, lng));
        setDistance(jarakKm(lat, lng));
        setLocating(false);
      },
      (e) => {
        setLocating(false);
        setErr(
          e.code === e.PERMISSION_DENIED
            ? "Izin lokasi ditolak. Aktifkan izin lokasi untuk menghitung arah kiblat."
            : "Gagal mendapatkan lokasi. Pastikan GPS aktif lalu coba lagi.",
        );
      },
      { enableHighAccuracy: true, timeout: 10000 },
    );
  }, []);

  // 2) Pasang sensor orientasi (kompas)
  const orientationHandler = (e: DeviceOrientationEvent) => {
    // iOS menyediakan webkitCompassHeading (derajat dari utara, searah jarum jam)
    const iosHeading = (e as unknown as { webkitCompassHeading?: number }).webkitCompassHeading;
    let h: number | null = null;
    if (typeof iosHeading === "number" && !Number.isNaN(iosHeading)) {
      h = iosHeading;
    } else if (e.absolute && typeof e.alpha === "number") {
      // Android (absolute): heading = 360 - alpha
      h = (360 - e.alpha) % 360;
    } else if (typeof e.alpha === "number") {
      h = (360 - e.alpha) % 360;
    }
    if (h != null) setHeading(((h % 360) + 360) % 360);
  };

  const startCompass = () => {
    const D = DeviceOrientationEvent as IOSOrientationEvent;
    if (typeof D?.requestPermission === "function") {
      // iOS 13+: butuh izin lewat gesture
      D.requestPermission()
        .then((res) => {
          if (res === "granted") {
            setNeedPermission(false);
            window.addEventListener("deviceorientation", orientationHandler, true);
          } else {
            setErr("Izin sensor gerak ditolak. Kompas tidak bisa berjalan.");
          }
        })
        .catch(() => setErr("Gagal meminta izin sensor gerak."));
    } else {
      window.addEventListener("deviceorientationabsolute", orientationHandler as EventListener, true);
      window.addEventListener("deviceorientation", orientationHandler, true);
    }
  };

  useEffect(() => {
    const D = DeviceOrientationEvent as IOSOrientationEvent;
    if (typeof D?.requestPermission === "function") {
      // iOS — tunggu user menekan tombol "Aktifkan Kompas"
      setNeedPermission(true);
    } else if (typeof window !== "undefined" && "DeviceOrientationEvent" in window) {
      window.addEventListener("deviceorientationabsolute", orientationHandler as EventListener, true);
      window.addEventListener("deviceorientation", orientationHandler, true);
    }
    return () => {
      window.removeEventListener("deviceorientationabsolute", orientationHandler as EventListener, true);
      window.removeEventListener("deviceorientation", orientationHandler, true);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sudut putar penunjuk kiblat relatif arah hadap HP
  const relative = bearing != null && heading != null ? (((bearing - heading) % 360) + 360) % 360 : null;
  const aligned = relative != null && (relative < 6 || relative > 354);

  // Getar saat tepat menghadap kiblat
  useEffect(() => {
    if (aligned && !alignedRef.current) {
      alignedRef.current = true;
      if (navigator.vibrate) navigator.vibrate(60);
    } else if (!aligned) {
      alignedRef.current = false;
    }
  }, [aligned]);

  // Sudut yang dipakai memutar dial/jarum:
  // - Jika ada kompas: jarum kiblat = relative (berputar saat HP diputar)
  // - Jika tidak ada kompas: tampilkan statis berdasarkan bearing dari Utara
  const needleAngle = relative != null ? relative : bearing ?? 0;

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
          <div className="font-display text-[22px] font-bold leading-tight">Arah Kiblat</div>
          <div className="text-[13px] text-white/70">🕋 Kompas menghadap Ka'bah</div>
        </div>
      </div>

      <div className="mx-auto max-w-[480px] px-4 pt-5">
        {locating && (
          <div className="py-10 text-center text-[14px] text-mu">⏳ Mendeteksi lokasi…</div>
        )}

        {err && (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-[14px] text-red-700">
            ⚠️ {err}
          </div>
        )}

        {bearing != null && (
          <>
            {/* Info ringkas */}
            <div className="mb-5 grid grid-cols-2 gap-2.5">
              <div className="rounded-2xl bg-white px-4 py-3 text-center shadow-sm">
                <div className="text-[11px] uppercase tracking-wider text-mu">Arah Kiblat</div>
                <div className="font-display text-[22px] font-bold text-g">{Math.round(bearing)}°</div>
                <div className="text-[11px] text-mu">dari Utara</div>
              </div>
              <div className="rounded-2xl bg-white px-4 py-3 text-center shadow-sm">
                <div className="text-[11px] uppercase tracking-wider text-mu">Jarak</div>
                <div className="font-display text-[22px] font-bold text-g">
                  {distance != null ? Math.round(distance).toLocaleString("id-ID") : "—"}
                </div>
                <div className="text-[11px] text-mu">km ke Ka'bah</div>
              </div>
            </div>

            {needPermission && (
              <button
                onClick={startCompass}
                className="mb-5 w-full rounded-xl bg-g py-3.5 text-[14px] font-semibold text-white shadow-md transition active:scale-[0.98]"
              >
                🧭 Aktifkan Kompas
              </button>
            )}

            {/* KOMPAS */}
            <div className="relative mx-auto aspect-square w-full max-w-[320px]">
              {/* Penanda atas tetap (arah hadap HP) */}
              <div className="absolute left-1/2 top-0 z-20 -translate-x-1/2 -translate-y-1">
                <div
                  className="size-0 border-x-[10px] border-t-[16px] border-x-transparent"
                  style={{ borderTopColor: aligned ? "#16a34a" : "#0d4f3c" }}
                />
              </div>

              {/* Dial */}
              <div
                className={`absolute inset-0 rounded-full border-[6px] bg-white shadow-[0_8px_30px_rgba(13,79,60,0.15)] transition-colors ${
                  aligned ? "border-green-500" : "border-[rgba(13,79,60,0.12)]"
                }`}
              >
                {/* Jarum kiblat */}
                <div
                  className="absolute inset-0 flex items-start justify-center"
                  style={{
                    transform: `rotate(${needleAngle}deg)`,
                    transition: "transform 0.18s ease-out",
                  }}
                >
                  <div className="flex flex-col items-center pt-3">
                    <div className="text-[30px] leading-none">🕋</div>
                    <div
                      className="mt-1 w-1.5 rounded-full"
                      style={{
                        height: "92px",
                        background: aligned
                          ? "linear-gradient(#16a34a,#16a34a)"
                          : "linear-gradient(#0d4f3c,#7bbfa5)",
                      }}
                    />
                  </div>
                </div>

                {/* Pusat */}
                <div className="absolute left-1/2 top-1/2 size-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-g ring-4 ring-white" />

                {/* Label arah */}
                <span className="absolute left-1/2 top-2 -translate-x-1/2 text-[12px] font-bold text-mu">U</span>
                <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[12px] font-bold text-mu">T</span>
                <span className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[12px] font-bold text-mu">S</span>
                <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[12px] font-bold text-mu">B</span>
              </div>
            </div>

            {/* Status */}
            <div className="mt-6 text-center">
              {heading == null ? (
                <div className="rounded-xl border border-au/30 bg-aup/40 px-4 py-3 text-[13px] text-aud">
                  🧭 Kompas tidak terdeteksi. Arahkan perangkat ke <b>{Math.round(bearing)}° dari Utara</b> (gunakan kompas fisik bila perlu).
                </div>
              ) : aligned ? (
                <div className="rounded-xl border border-green-300 bg-green-50 px-4 py-3 text-[15px] font-bold text-green-700">
                  ✅ Anda menghadap kiblat
                </div>
              ) : (
                <div className="rounded-xl bg-white px-4 py-3 text-[14px] text-mu shadow-sm">
                  Putar perangkat hingga ikon 🕋 berada di <b>atas</b> (sejajar penanda).
                </div>
              )}
            </div>

            <div className="mt-4 rounded-xl border border-[rgba(13,79,60,0.08)] bg-white px-4 py-3 text-[12px] leading-relaxed text-mu">
              💡 Letakkan perangkat <b>mendatar</b> (sejajar tanah) dan jauhkan dari benda logam/magnet agar kompas akurat. Kalibrasi dengan menggerakkan perangkat membentuk angka 8 bila arah terasa meleset.
            </div>
          </>
        )}
      </div>
    </div>
  );
}
