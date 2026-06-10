import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { registerSW, activateWaitingSW } from "@/lib/sw";

export default function SwUpdateBanner() {
  const [reg, setReg] = useState<ServiceWorkerRegistration | null>(null);
  const [applying, setApplying] = useState(false);

  useEffect(() => {
    registerSW((r) => setReg(r));
  }, []);

  if (!reg) return null;

  const onRefresh = () => {
    setApplying(true);
    activateWaitingSW(reg);
    // controllerchange listener di sw.ts akan reload otomatis.
    // Fallback manual setelah 1.5 detik jika tidak reload.
    setTimeout(() => window.location.reload(), 1500);
  };

  const banner = (
    <div
      className="anim-rise pointer-events-auto fixed bottom-[calc(72px+env(safe-area-inset-bottom))] left-1/2 z-[95] w-[calc(100vw-24px)] max-w-[420px] -translate-x-1/2 rounded-2xl border border-aul/30 bg-gradient-to-br from-g to-g2 px-4 py-3 shadow-[0_12px_40px_rgba(13,79,60,0.4)]"
      role="status"
      aria-live="polite"
    >
      <div className="flex items-center gap-3">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-aul/20 ring-1 ring-aul/40">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#e8c96d" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 12a9 9 0 1 1-9-9c2.39 0 4.68.94 6.4 2.6L21 8" />
            <path d="M21 3v5h-5" />
          </svg>
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-[13px] leading-tight font-bold text-white">Versi baru tersedia</div>
          <div className="mt-0.5 text-[11px] text-white/70">Refresh untuk pakai versi terbaru</div>
        </div>
        <button
          onClick={onRefresh}
          disabled={applying}
          className="shrink-0 rounded-lg bg-aul px-3 py-1.5 text-[12px] font-semibold text-dk transition-all active:scale-95 hover:bg-aul/90 disabled:opacity-60"
        >
          {applying ? "Memuat..." : "Refresh"}
        </button>
      </div>
    </div>
  );

  return createPortal(banner, document.body);
}
