import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGoBack } from "@/lib/use-back-trap";
import { api, type SholatDay, type SholatItem, type SholatStatus, type SholatWaktu } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { useToast } from "@/lib/toast";

const WAKTU_LIST: { id: SholatWaktu; label: string; emoji: string; jam: string }[] = [
  { id: "subuh",   label: "Subuh",   emoji: "🌅", jam: "04:30 - 05:45" },
  { id: "dzuhur",  label: "Dzuhur",  emoji: "🕛", jam: "12:00 - 14:30" },
  { id: "ashar",   label: "Ashar",   emoji: "🌤️", jam: "15:30 - 17:30" },
  { id: "maghrib", label: "Maghrib", emoji: "🌇", jam: "18:00 - 19:00" },
  { id: "isya",    label: "Isya",    emoji: "🌙", jam: "19:15 - 04:00" },
];

const STATUS_LIST: { id: SholatStatus; label: string; short: string; emoji: string; color: string; border: string; poin: number }[] = [
  { id: "tepat_waktu", label: "Tepat Waktu", short: "Tepat", emoji: "✅", color: "bg-g text-white",        border: "border-g",       poin: 10 },
  { id: "telat",       label: "Telat",       short: "Telat", emoji: "⏰", color: "bg-au text-white",       border: "border-au",      poin: 5  },
  { id: "terlewat",    label: "Terlewat",    short: "Qadha", emoji: "❌", color: "bg-[#dc3545] text-white", border: "border-[#dc3545]", poin: 2  },
  { id: "uzur",        label: "Uzur",        short: "Uzur",  emoji: "🤲", color: "bg-mu text-white",       border: "border-mu",      poin: 0  },
];

function todayIso() { return new Date().toISOString().slice(0, 10); }

function fmtDateLong(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("id-ID", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  });
}

function addDays(iso: string, n: number): string {
  const d = new Date(iso);
  d.setDate(d.getDate() + n);
  return d.toISOString().slice(0, 10);
}

export default function SholatPage() {
  const nav = useNavigate();
  const goBack = useGoBack();
  const fire = useToast();
  const { refresh } = useAuth();
  const [date, setDate] = useState<string>(todayIso());
  const [day, setDay] = useState<SholatDay | null>(null);
  const [loading, setLoading] = useState(true);
  const [savingWaktu, setSavingWaktu] = useState<SholatWaktu | null>(null);

  const isToday = date === todayIso();
  const isFuture = date > todayIso();

  const load = async (d: string) => {
    setLoading(true);
    try {
      const r = await api.getSholat(d);
      setDay(r);
    } catch (e) {
      fire(`⚠️ ${(e as Error).message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { void load(date); }, [date]);

  const summary = useMemo(() => {
    if (!day) return { selesai: 0, total: 5, totalPoin: 0 };
    const selesai = day.data.filter((d) => d.status !== null).length;
    return { selesai, total: 5, totalPoin: day.total_poin };
  }, [day]);

  const handleStatus = async (waktu: SholatWaktu, status: SholatStatus) => {
    if (isFuture) {
      fire("⚠️ Tidak bisa catat untuk masa depan");
      return;
    }
    setSavingWaktu(waktu);
    try {
      await api.catatSholat({ waktu, status, tanggal: date });
      await load(date);
      await refresh();
      const meta = STATUS_LIST.find((s) => s.id === status);
      fire(`${meta?.emoji ?? "✅"} ${meta?.label} - ${WAKTU_LIST.find((w) => w.id === waktu)?.label}`);
    } catch (e) {
      fire(`⚠️ ${(e as Error).message}`);
    } finally {
      setSavingWaktu(null);
    }
  };

  const handleClear = async (waktu: SholatWaktu) => {
    setSavingWaktu(waktu);
    try {
      await api.hapusSholat({ waktu, tanggal: date });
      await load(date);
      await refresh();
    } catch (e) {
      fire(`⚠️ ${(e as Error).message}`);
    } finally {
      setSavingWaktu(null);
    }
  };

  const handleAutoUzur = async () => {
    if (!confirm("Tandai semua sholat hari ini sebagai 'Uzur'?")) return;
    try {
      await api.autoUzurSholat(date);
      await load(date);
      await refresh();
      fire("🤲 Semua waktu sholat ditandai Uzur");
    } catch (e) {
      fire(`⚠️ ${(e as Error).message}`);
    }
  };

  return (
    <div className="min-h-screen bg-bg pb-24">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white border-b border-gp">
        <div className="max-w-md mx-auto px-4 py-3 flex items-center gap-3">
          <button
            onClick={goBack}
            className="p-2 -ml-2 rounded-lg hover:bg-gp transition-colors"
            aria-label="Kembali"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          <div>
            <h1 className="text-base font-semibold text-tx leading-tight">Sholat 5 Waktu</h1>
            <p className="text-[11px] text-mu">Track ibadah wajib harianmu</p>
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-4 space-y-4">
        {/* Date selector */}
        <div className="flex items-center justify-between gap-2 rounded-2xl bg-white border border-gp p-3">
          <button
            onClick={() => setDate(addDays(date, -1))}
            className="p-2 rounded-lg hover:bg-gp transition-colors text-mu"
            aria-label="Hari sebelumnya"
          >
            ←
          </button>
          <div className="flex-1 text-center">
            <p className="text-[10px] uppercase tracking-wider text-mu">{isToday ? "Hari Ini" : "Tanggal"}</p>
            <p className="text-[13px] font-semibold text-tx">{fmtDateLong(date)}</p>
          </div>
          <button
            onClick={() => setDate(addDays(date, 1))}
            disabled={isToday}
            className="p-2 rounded-lg hover:bg-gp transition-colors text-mu disabled:opacity-30"
            aria-label="Hari berikutnya"
          >
            →
          </button>
        </div>

        {/* Summary card */}
        <div className="rounded-2xl bg-gradient-to-br from-g to-g3 p-4 text-white">
          <div className="flex items-baseline justify-between">
            <div>
              <p className="text-[11px] uppercase tracking-wider text-white/70">Selesai Hari Ini</p>
              <p className="font-display text-3xl font-bold leading-tight">
                {summary.selesai} / {summary.total}
              </p>
            </div>
            <div className="text-right">
              <p className="text-[11px] uppercase tracking-wider text-white/70">Poin Hari Ini</p>
              <p className="font-display text-2xl font-bold text-aul">+{summary.totalPoin}</p>
            </div>
          </div>
          <div className="mt-3 h-2 rounded-full bg-white/15 overflow-hidden">
            <div
              className="h-full bg-aul transition-all"
              style={{ width: `${(summary.selesai / summary.total) * 100}%` }}
            />
          </div>
        </div>

        {/* Haid banner */}
        {day?.haid_active && (
          <div className="rounded-xl bg-[#fce7f3] border border-[#fbcfe8] p-3 text-[12px] text-[#831843]">
            <div className="flex items-start gap-2">
              <span>🌸</span>
              <div className="flex-1">
                <p className="font-semibold">Sedang dalam periode haid</p>
                <p className="text-[11px] opacity-80 mt-0.5">
                  Sholat tidak wajib selama haid. Tandai sebagai "Uzur" otomatis bila perlu.
                </p>
              </div>
              <button
                onClick={handleAutoUzur}
                className="shrink-0 text-[11px] font-semibold underline"
              >
                Tandai semua
              </button>
            </div>
          </div>
        )}

        {/* Sholat list */}
        <div className="space-y-3">
          {WAKTU_LIST.map((w) => {
            const item = day?.data.find((d) => d.waktu === w.id);
            return (
              <SholatCard
                key={w.id}
                waktu={w}
                item={item}
                saving={savingWaktu === w.id}
                disabled={isFuture}
                onSetStatus={(s) => handleStatus(w.id, s)}
                onClear={() => handleClear(w.id)}
              />
            );
          })}
        </div>

        {/* Stats link */}
        <button
          onClick={() => nav("/sholat/statistik")}
          className="w-full mt-2 flex items-center justify-between rounded-xl border border-gp bg-white px-4 py-3 text-[13px] font-semibold text-g hover:bg-gp transition-all"
        >
          <span>📊 Lihat Statistik Bulan Ini</span>
          <span className="text-mu">→</span>
        </button>

        {loading && (
          <p className="text-center text-[12px] text-mu pt-4">Memuat data sholat...</p>
        )}
      </main>
    </div>
  );
}

function SholatCard({
  waktu,
  item,
  saving,
  disabled,
  onSetStatus,
  onClear,
}: {
  waktu: typeof WAKTU_LIST[number];
  item?: SholatItem;
  saving: boolean;
  disabled: boolean;
  onSetStatus: (s: SholatStatus) => void;
  onClear: () => void;
}) {
  const current = item?.status ?? null;
  const meta = STATUS_LIST.find((s) => s.id === current);

  return (
    <div className="rounded-2xl bg-white border border-gp p-3">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="grid place-items-center size-10 rounded-xl bg-gp text-xl">
            {waktu.emoji}
          </div>
          <div>
            <p className="font-semibold text-tx">{waktu.label}</p>
            <p className="text-[11px] text-mu">{waktu.jam}</p>
          </div>
        </div>
        {current && meta && (
          <button
            onClick={onClear}
            disabled={saving}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold ${meta.color} disabled:opacity-50`}
            aria-label={`Hapus status ${meta.label}`}
          >
            <span>{meta.emoji}</span>
            <span>{meta.short}</span>
            <span className="opacity-70">×</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-4 gap-1.5">
        {STATUS_LIST.map((s) => {
          const active = current === s.id;
          return (
            <button
              key={s.id}
              onClick={() => onSetStatus(s.id)}
              disabled={saving || disabled}
              className={`flex flex-col items-center justify-center rounded-xl border-2 py-2 px-1 transition-all ${
                active
                  ? `${s.color} ${s.border}`
                  : "bg-white text-tx border-gp hover:border-mu"
              } disabled:opacity-40 disabled:cursor-not-allowed`}
            >
              <span className="text-lg">{s.emoji}</span>
              <span className="text-[10px] font-semibold leading-tight">{s.short}</span>
              {!active && (
                <span className="text-[9px] text-mu mt-0.5">+{s.poin}p</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
