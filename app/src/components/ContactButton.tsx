import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useAppConfig, trackPixelEvent } from "@/lib/app-config";

/**
 * Floating bubble di pojok kanan bawah dengan menu:
 * - Gabung Grup WhatsApp (kalau whatsapp_group_url di-set admin)
 * - Chat Admin / CS WhatsApp (kalau cs_whatsapp_number di-set admin)
 *
 * Otomatis HIDE kalau:
 * - contact_enabled = "0", atau
 * - kedua link kosong, atau
 * - admin matikan dari /admin/app-config
 *
 * Semua label dan target link dinamis — admin bisa ganti via halaman
 * /admin/app-config tanpa rebuild.
 */
export default function ContactButton() {
  const { isContactEnabled, hasWhatsAppGroup, hasCS, config, csWhatsAppLink } = useAppConfig();
  const [open, setOpen] = useState(false);
  const popRef = useRef<HTMLDivElement | null>(null);
  const btnRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (!open) return;
    const onClickOutside = (e: MouseEvent) => {
      const t = e.target as Node;
      if (popRef.current?.contains(t)) return;
      if (btnRef.current?.contains(t)) return;
      setOpen(false);
    };
    const onEsc = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("mousedown", onClickOutside);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onClickOutside);
      document.removeEventListener("keydown", onEsc);
    };
  }, [open]);

  if (!isContactEnabled) return null;
  if (!hasWhatsAppGroup && !hasCS) return null;

  const handleGroupClick = () => {
    trackPixelEvent("Contact", { type: "whatsapp_group" });
    setOpen(false);
  };

  const handleCSClick = () => {
    trackPixelEvent("Contact", { type: "cs_whatsapp" });
    setOpen(false);
  };

  const node = (
    <div className="fixed bottom-20 right-4 z-[110] sm:bottom-6 sm:right-6">
      {open && (
        <div
          ref={popRef}
          role="menu"
          aria-label="Kontak dan bantuan"
          className="anim-rise mb-3 w-72 rounded-2xl bg-white shadow-2xl ring-1 ring-black/10 overflow-hidden"
        >
          <div className="px-4 py-3 bg-emerald-600 text-white">
            <p className="text-sm font-semibold">Butuh Bantuan?</p>
            <p className="text-[11px] text-emerald-50/90 mt-0.5">
              Pilih saluran kontak di bawah ini
            </p>
          </div>
          <div className="p-2 flex flex-col gap-1">
            {hasWhatsAppGroup && (
              <a
                href={config.whatsapp_group_url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleGroupClick}
                className="flex items-center gap-3 rounded-xl px-3 py-2.5 hover:bg-emerald-50 transition-colors"
              >
                <div className="shrink-0 w-9 h-9 rounded-lg bg-emerald-100 flex items-center justify-center">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-neutral-900 truncate">
                    {config.whatsapp_group_label || "Gabung Grup WhatsApp"}
                  </p>
                  <p className="text-[11px] text-neutral-500 truncate">
                    Komunitas pengguna Amalan
                  </p>
                </div>
              </a>
            )}
            {hasCS && csWhatsAppLink && (
              <a
                href={csWhatsAppLink}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleCSClick}
                className="flex items-center gap-3 rounded-xl px-3 py-2.5 hover:bg-emerald-50 transition-colors"
              >
                <div className="shrink-0 w-9 h-9 rounded-lg bg-emerald-100 flex items-center justify-center">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-neutral-900 truncate">
                    {config.cs_label || "Chat Admin"}
                  </p>
                  <p className="text-[11px] text-neutral-500 truncate">
                    {config.cs_name || "Admin Amalan"}
                  </p>
                </div>
              </a>
            )}
          </div>
          <div className="px-4 pb-3 pt-1">
            <p className="text-[10px] text-neutral-400 text-center">
              Konsultasi & kendala penggunaan
            </p>
          </div>
        </div>
      )}

      <button
        ref={btnRef}
        type="button"
        aria-label={open ? "Tutup menu kontak" : "Buka menu kontak & bantuan"}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="group relative w-14 h-14 rounded-full bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 shadow-xl ring-4 ring-white/40 transition-colors flex items-center justify-center"
      >
        {open ? (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        ) : (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="#ffffff">
            <path d="M20.52 3.48A11.92 11.92 0 0 0 12.04 0C5.46 0 .12 5.34.11 11.92c0 2.1.55 4.16 1.6 5.97L0 24l6.27-1.64a11.9 11.9 0 0 0 5.76 1.47h.01c6.58 0 11.92-5.34 11.93-11.92a11.86 11.86 0 0 0-3.45-8.43Zm-8.48 18.34h-.01a9.9 9.9 0 0 1-5.04-1.38l-.36-.21-3.72.98.99-3.63-.24-.37a9.91 9.91 0 0 1-1.52-5.29c0-5.48 4.46-9.94 9.94-9.94 2.66 0 5.15 1.04 7.03 2.92a9.86 9.86 0 0 1 2.91 7.03c0 5.48-4.46 9.93-9.98 9.93Zm5.45-7.44c-.3-.15-1.76-.87-2.04-.97-.27-.1-.47-.15-.66.15-.2.3-.76.97-.93 1.17-.17.2-.34.22-.64.07-.3-.15-1.26-.47-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.34.45-.51.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.66-1.6-.91-2.18-.24-.57-.48-.5-.66-.51l-.56-.01c-.2 0-.5.07-.77.37-.27.3-1.02 1-1.02 2.43 0 1.44 1.04 2.82 1.19 3.02.15.2 2.05 3.13 4.97 4.39.69.3 1.24.48 1.66.62.7.22 1.34.19 1.84.12.56-.08 1.76-.72 2-1.41.25-.7.25-1.29.17-1.41-.07-.12-.27-.2-.57-.35Z"/>
          </svg>
        )}
        {/* Pulse ring untuk menarik perhatian saat belum dibuka */}
        {!open && (
          <span className="pointer-events-none absolute inset-0 rounded-full bg-emerald-400 opacity-40 animate-ping" aria-hidden />
        )}
      </button>
    </div>
  );

  return createPortal(node, document.body);
}
