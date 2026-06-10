import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { BACAAN } from "@/lib/bacaan";
import { useSettings } from "@/lib/settings";

type Props = {
  amalanId: string;
  arabic: string;
  kategori: string;
  poin: number;
  satuan?: string;
  keutamaan?: string;
  onClose: () => void;
};

const STORAGE_KEY = "amalan_counters_v1";

function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

function loadCounters(amalanId: string): Record<number, number> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const data = JSON.parse(raw) as { date: string; counters: Record<string, Record<number, number>> };
    if (data.date !== todayKey()) return {}; // reset harian
    return data.counters[amalanId] ?? {};
  } catch {
    return {};
  }
}

function saveCounters(amalanId: string, counters: Record<number, number>) {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const today = todayKey();
    let data: { date: string; counters: Record<string, Record<number, number>> } = {
      date: today,
      counters: {},
    };
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed?.date === today) data = parsed;
    }
    // Drop entries yang semua-nol untuk hemat
    const cleaned: Record<number, number> = {};
    for (const k of Object.keys(counters)) {
      const v = counters[Number(k)];
      if (v && v > 0) cleaned[Number(k)] = v;
    }
    if (Object.keys(cleaned).length === 0) {
      delete data.counters[amalanId];
    } else {
      data.counters[amalanId] = cleaned;
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {}
}

export default function BacaanReader({ amalanId, arabic, kategori, poin, satuan, keutamaan, onClose }: Props) {
  const bacaan = BACAAN[amalanId];
  const { settings } = useSettings();
  const [counters, setCounters] = useState<Record<number, number>>(() => loadCounters(amalanId));

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  // Sync counter ke localStorage tiap perubahan
  useEffect(() => {
    saveCounters(amalanId, counters);
  }, [counters, amalanId]);

  if (!bacaan) return null;

  const bump = (i: number, max: number) => {
    setCounters((c) => {
      const cur = c[i] ?? 0;
      const next = cur >= max ? 0 : cur + 1;
      return { ...c, [i]: next };
    });
  };

  const reset = (i: number) => setCounters((c) => ({ ...c, [i]: 0 }));

  const content = (
    <div className="fixed inset-0 z-[100] mx-auto flex max-w-[480px] flex-col bg-bg shadow-[0_0_60px_rgba(13,79,60,0.1)]">
      {/* HEADER */}
      <div className="relative shrink-0 bg-gradient-to-br from-g to-g2 px-4 pt-[calc(env(safe-area-inset-top)+12px)] pb-4 text-white">
        <div className="flex items-center gap-2">
          <button
            onClick={onClose}
            className="flex size-11 shrink-0 items-center justify-center rounded-full border border-white/20 bg-white/15 transition-all active:scale-90"
            aria-label="Kembali"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round">
              <path d="m15 18-6-6 6-6" />
            </svg>
          </button>
          <div className="min-w-0 flex-1">
            <div className="font-display text-[20px] leading-tight font-bold">{bacaan.judul}</div>
            <div className="text-[13px] text-white/70">{kategori}</div>
          </div>
          <div className="font-arab text-[30px] leading-none text-aul">{arabic}</div>
        </div>

        <div className="mt-3 flex flex-wrap gap-2 text-[13px] text-white/80">
          <span className="rounded-full border border-[rgba(201,168,76,0.4)] bg-[rgba(201,168,76,0.25)] px-3 py-1 font-bold text-aul">
            +{poin} poin
          </span>
          <span className="rounded-full border border-white/10 bg-white/10 px-3 py-1">
            📋 {bacaan.items.length} bacaan
          </span>
          {satuan && (
            <span className="rounded-full border border-white/10 bg-white/10 px-3 py-1">
              {satuan}
            </span>
          )}
        </div>
      </div>

      {/* BODY */}
      <div className="flex-1 overflow-y-auto px-3.5 pt-3.5 pb-[calc(env(safe-area-inset-bottom)+16px)]">
        {bacaan.pengantar && (
          <div className="mb-3 rounded-xl border border-[rgba(13,79,60,0.08)] bg-white px-4 py-3 text-[14px] leading-relaxed text-mu">
            {bacaan.pengantar}
          </div>
        )}

        {bacaan.items.map((item, i) => {
          const counter = counters[i] ?? 0;
          const maxRepeat = item.repeat ?? 0;
          const isComplete = maxRepeat > 0 && counter >= maxRepeat;
          return (
            <div
              key={i}
              className={`anim-rise mb-2.5 overflow-hidden rounded-2xl border-[1.5px] shadow-[0_4px_24px_rgba(13,79,60,0.11)] transition-all ${
                isComplete ? "border-[rgba(45,143,111,0.18)] bg-gradient-to-br from-[#f0faf5] to-[#eaf6f0]" : "border-transparent bg-white"
              }`}
              style={{ animationDelay: `${Math.min(i, 12) * 0.04}s` }}
            >
              <div className="px-4 pt-4 pb-3.5">
                {(item.title || item.repeat) && (
                  <div className="mb-3 flex items-center justify-between gap-2 border-b border-dashed border-[rgba(13,79,60,0.13)] pb-3">
                    {item.title && (
                      <div className="font-display text-[17px] font-bold text-g">{item.title}</div>
                    )}
                    {item.repeat && item.repeat > 1 && (
                      <button
                        onClick={() => bump(i, maxRepeat)}
                        onContextMenu={(e) => { e.preventDefault(); reset(i); }}
                        className={`flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[13px] font-bold transition-all active:scale-95 ${
                          isComplete
                            ? "bg-gradient-to-br from-g to-g3 text-white"
                            : counter > 0
                            ? "bg-au text-white"
                            : "border border-[rgba(201,168,76,0.4)] bg-aup text-au"
                        }`}
                        title="Tap untuk hitung, long-press untuk reset"
                      >
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="12" r="9" />
                        </svg>
                        {counter}/{item.repeat}×
                      </button>
                    )}
                    {item.repeat === 1 && (
                      <span className="shrink-0 rounded-full bg-aup px-3 py-1 text-[12px] font-bold text-au">1×</span>
                    )}
                  </div>
                )}
                {item.arab && (
                  <div
                    className="mb-3 text-right font-arab leading-[2.1] text-dk"
                    dir="rtl"
                    style={{ fontSize: settings.fontArab }}
                  >
                    {item.arab}
                  </div>
                )}
                {settings.showLatin && item.latin && (
                  <div
                    className="mb-2 italic leading-[1.6] text-mu"
                    style={{ fontSize: settings.fontLatin }}
                  >
                    {item.latin}
                  </div>
                )}
                {settings.showTerjemah && item.terjemahan && (
                  <div
                    className="leading-[1.65] text-tx"
                    style={{ fontSize: settings.fontTerjemah }}
                  >
                    {item.terjemahan}
                  </div>
                )}
                {item.catatan && (
                  <div className="mt-2.5 rounded-lg border border-[rgba(201,168,76,0.25)] bg-aup px-3 py-2 text-[13px] leading-relaxed text-au">
                    💡 {item.catatan}
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {keutamaan && (
          <div className="mt-2 rounded-2xl border border-[rgba(13,79,60,0.08)] bg-gradient-to-br from-aup/40 to-white px-4 py-4">
            <div className="mb-1.5 text-[12px] font-bold tracking-wider text-au uppercase">✨ Keutamaan</div>
            <div className="text-[14px] leading-relaxed text-tx italic">{keutamaan}</div>
          </div>
        )}
      </div>
    </div>
  );

  return createPortal(content, document.body);
}
