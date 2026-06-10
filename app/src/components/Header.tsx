import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { fmt } from "@/lib/data";
import { useAuth } from "@/lib/auth";
import type { User } from "@/lib/api";

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

export default function Header({ user, rank }: { user: User; rank: number }) {
  const nav = useNavigate();
  const { selectedDate, setSelectedDate } = useAuth();
  const dateInputRef = useRef<HTMLInputElement>(null);

  const dt = new Date(selectedDate + "T00:00:00");
  const dateStr = dt.toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const isToday = selectedDate === todayStr();

  const openPicker = () => {
    const inp = dateInputRef.current;
    if (!inp) return;
    inp.value = selectedDate;
    const sp = (inp as HTMLInputElement & { showPicker?: () => void }).showPicker;
    if (typeof sp === "function") {
      try { sp.call(inp); return; } catch { /* fallback */ }
    }
    inp.click();
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    if (!v) return;
    if (v > todayStr()) return;
    void setSelectedDate(v);
  };

  const backToToday = () => void setSelectedDate(todayStr());

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-g to-g2 px-5 pt-[calc(env(safe-area-inset-top)+18px)] pb-6">
      <div className="pointer-events-none absolute -top-6 -right-6 size-[150px] rounded-full border-[26px] border-white/[0.06] after:absolute after:inset-[18px] after:rounded-full after:border-[18px] after:border-white/[0.04] after:content-['']" />
      <div className="text-[14px] tracking-[0.4px] text-white/60">السلام عليكم ورحمة الله</div>
      <div className="mt-1 font-display text-[24px] leading-tight font-bold text-white">{user.name}</div>

      <div className="mt-2.5 flex flex-wrap items-center gap-2">
        <button
          onClick={openPicker}
          className={`inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-[14px] font-medium transition active:scale-95 ${
            isToday
              ? "border-white/20 bg-white/15 text-white"
              : "border-aul/60 bg-aul/25 text-aul"
          }`}
          title="Ketuk untuk pilih tanggal (mis. isi amalan tertinggal kemarin)"
        >
          <span>{isToday ? "🌙" : "📅"}</span>
          <span>{isToday ? "Hari ini · " : ""}{dateStr}</span>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" className="opacity-70">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>
        {!isToday && (
          <button
            onClick={backToToday}
            className="inline-flex items-center rounded-full border border-white/25 bg-white/15 px-3 py-1.5 text-[13px] font-bold text-white transition active:scale-95"
            title="Kembali ke hari ini"
          >
            ↻ Hari Ini
          </button>
        )}
        <input
          ref={dateInputRef}
          type="date"
          max={todayStr()}
          min="2020-01-01"
          onChange={onChange}
          className="sr-only pointer-events-none absolute"
          aria-hidden
        />
      </div>

      <div className="mt-[18px] flex flex-wrap gap-2">
        <Pill v={fmt(user.total_poin)} l="Total Poin" onClick={() => nav("/profil")} />
        <Pill v={`#${rank || "–"}`}      l="Peringkat" onClick={() => nav("/leaderboard")} />
        <Pill v={`${user.streak_days}🔥`} l="Streak"    onClick={() => nav("/riwayat")} />
      </div>
    </div>
  );
}

function Pill({ v, l, onClick }: { v: string; l: string; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 rounded-full border border-white/15 bg-white/15 px-4 py-2 transition-all active:scale-95 hover:bg-white/20"
      aria-label={l}
    >
      <span className="text-[17px] font-bold text-aul">{v}</span>
      <span className="text-[13px] text-white/75">{l}</span>
    </button>
  );
}
