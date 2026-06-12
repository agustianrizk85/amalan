import { useEffect, useState } from "react";
import { useGoBack } from "@/lib/use-back-trap";
import { api, type SholatStats } from "@/lib/api";
import { useToast } from "@/lib/toast";

const STATUS_META: { id: keyof SholatStats["stats"]; label: string; emoji: string; bar: string }[] = [
  { id: "tepat_waktu", label: "Tepat Waktu", emoji: "✅", bar: "bg-g" },
  { id: "telat",       label: "Telat",       emoji: "⏰", bar: "bg-au" },
  { id: "terlewat",    label: "Qadha",       emoji: "❌", bar: "bg-[#dc3545]" },
  { id: "uzur",        label: "Uzur",        emoji: "🤲", bar: "bg-mu" },
];

function thisMonth() { return new Date().toISOString().slice(0, 7); }

function addMonth(ym: string, n: number): string {
  const [y, m] = ym.split("-").map(Number);
  const d = new Date(y, m - 1 + n, 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

function fmtMonth(ym: string): string {
  const [y, m] = ym.split("-").map(Number);
  return new Date(y, m - 1, 1).toLocaleDateString("id-ID", { month: "long", year: "numeric" });
}

export default function SholatStatistikPage() {
  const goBack = useGoBack("/sholat");
  const fire = useToast();
  const [month, setMonth] = useState<string>(thisMonth());
  const [data, setData] = useState<SholatStats | null>(null);
  const [loading, setLoading] = useState(true);

  const isCurrent = month >= thisMonth();

  useEffect(() => {
    let cancel = false;
    setLoading(true);
    api
      .sholatStats(month)
      .then((r) => { if (!cancel) setData(r); })
      .catch((e) => { if (!cancel) fire(`⚠️ ${(e as Error).message}`); })
      .finally(() => { if (!cancel) setLoading(false); });
    return () => { cancel = true; };
  }, [month, fire]);

  const recorded = data?.total_recorded ?? 0;
  const target = data?.target ?? 0;
  const persen = target > 0 ? Math.round((recorded / target) * 100) : 0;

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
            <h1 className="text-base font-semibold text-tx leading-tight">Statistik Sholat</h1>
            <p className="text-[11px] text-mu">Rekap ibadah wajib per bulan</p>
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-4 space-y-4">
        {/* Month selector */}
        <div className="flex items-center justify-between gap-2 rounded-2xl bg-white border border-gp p-3">
          <button
            onClick={() => setMonth(addMonth(month, -1))}
            className="p-2 rounded-lg hover:bg-gp transition-colors text-mu"
            aria-label="Bulan sebelumnya"
          >
            ←
          </button>
          <div className="flex-1 text-center">
            <p className="text-[10px] uppercase tracking-wider text-mu">Bulan</p>
            <p className="text-[13px] font-semibold text-tx">{fmtMonth(month)}</p>
          </div>
          <button
            onClick={() => setMonth(addMonth(month, 1))}
            disabled={isCurrent}
            className="p-2 rounded-lg hover:bg-gp transition-colors text-mu disabled:opacity-30"
            aria-label="Bulan berikutnya"
          >
            →
          </button>
        </div>

        {/* Ringkasan */}
        <div className="rounded-2xl bg-gradient-to-br from-g to-g3 p-4 text-white">
          <p className="text-[11px] uppercase tracking-wider text-white/70">Tercatat Bulan Ini</p>
          <p className="font-display text-3xl font-bold leading-tight">
            {recorded} <span className="text-lg font-semibold text-white/70">/ {target}</span>
          </p>
          <div className="mt-3 h-2 rounded-full bg-white/15 overflow-hidden">
            <div className="h-full bg-aul transition-all" style={{ width: `${Math.min(persen, 100)}%` }} />
          </div>
          <p className="mt-2 text-[11px] text-white/70">
            {persen}% dari target {target} sholat
            {data ? ` (${data.days_counted} hari × 5 waktu)` : ""}
          </p>
        </div>

        {/* Breakdown per status */}
        <div className="rounded-2xl bg-white border border-gp p-4 space-y-3">
          <p className="text-[12px] font-semibold text-tx">Rincian Status</p>
          {STATUS_META.map((s) => {
            const val = data?.stats[s.id] ?? 0;
            const pct = recorded > 0 ? Math.round((val / recorded) * 100) : 0;
            return (
              <div key={s.id}>
                <div className="flex items-center justify-between text-[12px] mb-1">
                  <span className="text-tx">{s.emoji} {s.label}</span>
                  <span className="font-semibold text-tx">{val} <span className="text-mu font-normal">({pct}%)</span></span>
                </div>
                <div className="h-2 rounded-full bg-gp overflow-hidden">
                  <div className={`h-full ${s.bar} transition-all`} style={{ width: `${pct}%` }} />
                </div>
              </div>
            );
          })}
          {!loading && recorded === 0 && (
            <p className="text-center text-[12px] text-mu pt-1">Belum ada catatan sholat di bulan ini.</p>
          )}
        </div>

        {loading && (
          <p className="text-center text-[12px] text-mu pt-2">Memuat statistik...</p>
        )}
      </main>
    </div>
  );
}
