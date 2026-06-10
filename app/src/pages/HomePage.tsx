import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { loadTerakhirBaca } from "@/lib/settings";
import QuranReader from "@/components/QuranReader";

export default function HomePage() {
  const nav = useNavigate();
  const { user } = useAuth();
  const [reader, setReader] = useState<{ nomor: number | null; ayat: number | null; picker: boolean } | null>(null);

  const onTerakhirBaca = () => {
    const tb = loadTerakhirBaca();
    if (tb) setReader({ nomor: tb.nomor, ayat: tb.ayat ?? null, picker: false });
    else setReader({ nomor: null, ayat: null, picker: true });
  };

  return (
    <div className="relative min-h-[100dvh] overflow-hidden bg-[#0c1a24] text-white">
      {/* Background gradient + tekstur masjid samar */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0c1a24] via-[#0e2433] to-[#1a3340]" />
        <div className="absolute inset-x-0 top-1/2 h-1/2 bg-[radial-gradient(ellipse_at_center_top,rgba(255,255,255,0.05),transparent_70%)]" />
        {/* Subtle mosque silhouette suggestion */}
        <div
          className="absolute bottom-0 left-0 right-0 h-[40%] opacity-[0.08]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 50% 100%, rgba(255,255,255,0.4) 0%, transparent 40%)",
            filter: "blur(8px)",
          }}
        />
      </div>

      <div className="relative z-10 mx-auto flex min-h-[100dvh] max-w-[420px] flex-col px-7 pt-[calc(env(safe-area-inset-top)+24px)] pb-[calc(env(safe-area-inset-bottom)+24px)]">

        {/* Salam + nama */}
        {user && (
          <div className="mb-4 text-center">
            <div className="text-[13px] tracking-[0.3em] text-white/55 uppercase">
              Assalamu'alaikum
            </div>
            <div className="mt-1 font-display text-[20px] font-bold text-white">{user.name}</div>
          </div>
        )}

        {/* Logo "Al-Qur'an Al-Karim" + ikon kitab */}
        <div className="mb-10 mt-2 flex flex-col items-center">
          <div className="font-arab text-[44px] leading-none text-white/95">الْقُرْآنُ الْكَرِيْم</div>
          <div className="mt-3">
            <QuranBookIcon />
          </div>
          {/* Garis cahaya tipis seperti screenshot */}
          <div className="mt-3 h-[1px] w-[140px] bg-gradient-to-r from-transparent via-white/40 to-transparent" />
        </div>

        {/* Tombol-tombol menu */}
        <div className="flex flex-1 flex-col gap-2.5">
          <BtnMenu label="BACA QUR'AN" onClick={() => setReader({ nomor: null, ayat: null, picker: true })} />
          <BtnMenu label="TERAKHIR BACA" onClick={onTerakhirBaca} />
          <BtnMenu label="JADWAL SHOLAT" onClick={() => nav("/jadwal")} />
          {/* New: Tracker ibadah */}
          <div className="grid grid-cols-2 gap-2.5">
            <BtnMenuMini label="KIBLAT" emoji="🧭" onClick={() => nav("/kiblat")} />
            <BtnMenuMini label="JUZ DIRI" emoji="🧠" onClick={() => nav("/juz-diri")} />
            <BtnMenuMini label="SHOLAT" emoji="🕌" onClick={() => nav("/sholat")} />
            <BtnMenuMini label="PUASA" emoji="🌙" onClick={() => nav("/puasa")} />
            <BtnMenuMini label="DZIKIR" emoji="📿" onClick={() => nav("/dzikir")} />
            {user?.gender === "female" && (
              <BtnMenuMini label="HAID" emoji="🌸" onClick={() => nav("/haid")} />
            )}
          </div>
          <BtnMenu label="PENGATURAN" onClick={() => nav("/pengaturan")} />
        </div>

        {/* Tombol Amalan Harian — masuk ke tracker utama */}
        <button
          onClick={() => nav("/amalan")}
          className="mt-5 rounded-2xl border border-[rgba(232,201,109,0.5)] bg-gradient-to-br from-[rgba(232,201,109,0.18)] to-[rgba(232,201,109,0.08)] py-3.5 text-[14px] font-bold tracking-[0.2em] text-aul uppercase transition active:scale-[0.98]"
        >
          ✦ Amalan Harian
        </button>

        <div className="mt-3 text-center text-[11px] text-white/35">
          v1.0 · Tracker amalan & Al-Qur'an
        </div>
      </div>

      {reader && (
        <QuranReader
          initialNomor={reader.nomor}
          initialAyat={reader.ayat}
          pickerMode={reader.picker}
          onClose={() => setReader(null)}
        />
      )}
    </div>
  );
}

function BtnMenu({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="relative w-full rounded-2xl border border-white/25 bg-white/[0.04] py-4 text-center text-[15px] font-bold tracking-[0.25em] text-white uppercase backdrop-blur-sm transition-all active:scale-[0.98] hover:bg-white/[0.08] hover:border-white/40"
    >
      {label}
    </button>
  );
}

function BtnMenuMini({ label, emoji, onClick }: { label: string; emoji: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center justify-center gap-2 rounded-xl border border-white/25 bg-white/[0.04] py-3 text-center text-[12px] font-bold tracking-[0.2em] text-white uppercase backdrop-blur-sm transition-all active:scale-[0.98] hover:bg-white/[0.08] hover:border-aul/60"
    >
      <span className="text-base">{emoji}</span>
      <span>{label}</span>
    </button>
  );
}

function QuranBookIcon() {
  return (
    <svg width="56" height="56" viewBox="0 0 64 64" fill="none">
      {/* Mihrab arch */}
      <path
        d="M32 6c-7 0-12 5-12 12v16h24V18c0-7-5-12-12-12z"
        stroke="#4dd1b6"
        strokeWidth="1.5"
        fill="none"
      />
      {/* Book */}
      <path
        d="M14 34h36c1 0 2 1 2 2v18c0 1-1 2-2 2H14c-1 0-2-1-2-2V36c0-1 1-2 2-2z"
        fill="#4dd1b6"
        opacity="0.9"
      />
      <path d="M32 38v16" stroke="#0c1a24" strokeWidth="1.5" />
      <path d="M18 42h10M18 46h10M36 42h10M36 46h10" stroke="#0c1a24" strokeWidth="0.8" opacity="0.6" />
    </svg>
  );
}
