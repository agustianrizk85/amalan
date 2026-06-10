import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api, type DzikirItem, type DzikirKategori } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { useToast } from "@/lib/toast";

const KATEGORI_LIST: { id: DzikirKategori; label: string; emoji: string; waktu: string; desc: string }[] = [
  { id: "pagi",   label: "Dzikir Pagi",   emoji: "🌅", waktu: "Setelah Subuh - Dzuhur", desc: "Al-Ma'tsurat & wirid pagi" },
  { id: "petang", label: "Dzikir Petang", emoji: "🌇", waktu: "Setelah Ashar - Maghrib", desc: "Al-Ma'tsurat & wirid sore" },
  { id: "tidur",  label: "Dzikir Tidur",  emoji: "😴", waktu: "Sebelum tidur",          desc: "Tasbih, Tahmid, Takbir & Ayat Kursi" },
  { id: "bangun", label: "Dzikir Bangun", emoji: "☀️", waktu: "Setelah bangun tidur",   desc: "Doa bangun & istighfar" },
];

function todayIso() { return new Date().toISOString().slice(0, 10); }

function fmtDateLong(iso: string): string {
  return new Date(iso).toLocaleDateString("id-ID", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  });
}

export default function DzikirPage() {
  const nav = useNavigate();
  const fire = useToast();
  const { refresh } = useAuth();
  const [date, setDate] = useState(todayIso());
  const [items, setItems] = useState<DzikirItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<DzikirKategori | null>(null);

  const load = async (d: string) => {
    setLoading(true);
    try {
      const r = await api.getDzikir(d);
      setItems(r.data);
    } catch (e) {
      fire(`⚠️ ${(e as Error).message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { void load(date); }, [date]);

  const handleToggle = async (kategori: DzikirKategori, currentDone: boolean) => {
    setSaving(kategori);
    try {
      if (currentDone) {
        await api.hapusDzikir(kategori, date);
      } else {
        await api.catatDzikir(kategori, date);
        const meta = KATEGORI_LIST.find((k) => k.id === kategori);
        fire(`${meta?.emoji ?? "📿"} ${meta?.label} dicatat`);
      }
      await load(date);
      await refresh();
    } catch (e) {
      fire(`⚠️ ${(e as Error).message}`);
    } finally {
      setSaving(null);
    }
  };

  const selesai = items.filter((i) => i.done).length;
  const totalPoin = items.reduce((s, i) => s + i.poin, 0);

  return (
    <div className="min-h-screen bg-bg pb-24">
      <header className="sticky top-0 z-10 bg-white border-b border-gp">
        <div className="max-w-md mx-auto px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => nav("/beranda")}
            className="p-2 -ml-2 rounded-lg hover:bg-gp transition-colors"
            aria-label="Kembali"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          <div>
            <h1 className="text-base font-semibold text-tx leading-tight">Dzikir Harian</h1>
            <p className="text-[11px] text-mu">Pagi, petang, tidur, bangun</p>
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-4 space-y-4">
        {/* Date */}
        <div className="rounded-xl bg-white border border-gp p-3 text-center">
          <p className="text-[10px] uppercase tracking-wider text-mu">Tanggal</p>
          <p className="text-[14px] font-semibold text-tx">{fmtDateLong(date)}</p>
          {date !== todayIso() && (
            <button
              onClick={() => setDate(todayIso())}
              className="mt-1 text-[11px] text-g underline"
            >
              Kembali ke hari ini
            </button>
          )}
        </div>

        {/* Summary */}
        <div className="rounded-2xl bg-gradient-to-br from-g to-g3 p-4 text-white">
          <div className="flex items-baseline justify-between">
            <div>
              <p className="text-[11px] uppercase tracking-wider text-white/70">Selesai</p>
              <p className="font-display text-3xl font-bold">{selesai} / 4</p>
            </div>
            <div className="text-right">
              <p className="text-[11px] uppercase tracking-wider text-white/70">Poin Hari Ini</p>
              <p className="font-display text-2xl font-bold text-aul">+{totalPoin}</p>
            </div>
          </div>
        </div>

        {/* List */}
        <div className="space-y-3">
          {KATEGORI_LIST.map((k) => {
            const item = items.find((i) => i.kategori === k.id);
            const done = item?.done ?? false;
            return (
              <button
                key={k.id}
                onClick={() => handleToggle(k.id, done)}
                disabled={saving === k.id}
                className={`w-full flex items-center gap-3 rounded-2xl border-2 p-3 text-left transition-all ${
                  done
                    ? "bg-gp border-g"
                    : "bg-white border-gp hover:border-mu"
                } disabled:opacity-60`}
              >
                <div className={`grid place-items-center size-12 rounded-xl text-2xl ${done ? "bg-g/15" : "bg-gp"}`}>
                  {k.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-[14px] font-semibold ${done ? "text-g" : "text-tx"}`}>{k.label}</p>
                  <p className="text-[11px] text-mu">{k.waktu}</p>
                  <p className="text-[10px] text-mu mt-0.5 truncate">{k.desc}</p>
                </div>
                <div className={`shrink-0 grid place-items-center size-8 rounded-full ${done ? "bg-g" : "border-2 border-gp"}`}>
                  {done && (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        <div className="rounded-xl bg-aup border border-aul/40 p-3 text-[11px] text-tx leading-relaxed">
          <p className="font-semibold mb-1">💡 Tips</p>
          <p className="text-mu">
            Konsisten dzikir pagi & petang adalah benteng dari gangguan setan
            (HR. Abu Dawud). Setiap kategori = <strong>+5 poin</strong>.
          </p>
        </div>

        {loading && (
          <p className="text-center text-[12px] text-mu pt-2">Memuat...</p>
        )}
      </main>
    </div>
  );
}
