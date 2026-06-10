import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

/**
 * Aturan tampilan banner install:
 * - Kalau aplikasi dibuka sebagai PWA (display-mode: standalone, atau iOS
 *   navigator.standalone === true) → SEMBUNYIKAN.
 * - Kalau dibuka via browser tab (web) → TAMPILKAN selalu, tanpa cooldown,
 *   tanpa "dismiss" yang permanen.
 *
 * Tujuannya: user yang belum install terus diingatkan; user yang sudah install
 * dan membuka dari icon home screen tidak akan pernah lihat banner lagi.
 */

function isPwaStandalone(): boolean {
  if (typeof window === "undefined") return false;
  if (window.matchMedia?.("(display-mode: standalone)").matches) return true;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if ((window.navigator as any).standalone === true) return true;
  return false;
}

function isIosSafari(): boolean {
  if (typeof navigator === "undefined") return false;
  const ua = navigator.userAgent;
  const isIos = /iPad|iPhone|iPod/.test(ua);
  const isSafari = /Safari/.test(ua) && !/CriOS|FxiOS|EdgiOS/.test(ua);
  return isIos && isSafari;
}

export default function InstallButton() {
  const [prompt, setPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [standalone, setStandalone] = useState(() => isPwaStandalone());
  // Ditutup hanya untuk sesi ini (sampai halaman di-reload), supaya banner
  // tidak menutupi tombol form. Reload → muncul lagi (reminder tetap jalan).
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    if (standalone) return;

    const onBeforeInstall = (e: Event) => {
      e.preventDefault();
      setPrompt(e as BeforeInstallPromptEvent);
    };

    const onInstalled = () => {
      // Setelah berhasil install + dibuka sebagai PWA, display-mode akan
      // standalone otomatis. Tapi kita juga set state di sini supaya banner
      // langsung hilang di tab yang sama.
      setPrompt(null);
      setStandalone(true);
    };

    window.addEventListener("beforeinstallprompt", onBeforeInstall);
    window.addEventListener("appinstalled", onInstalled);

    const mq = window.matchMedia?.("(display-mode: standalone)");
    const onDisplayChange = (e: MediaQueryListEvent) => {
      if (e.matches) setStandalone(true);
    };
    mq?.addEventListener?.("change", onDisplayChange);

    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstall);
      window.removeEventListener("appinstalled", onInstalled);
      mq?.removeEventListener?.("change", onDisplayChange);
    };
  }, [standalone]);

  // Banner hilang: aplikasi dibuka sebagai PWA standalone, ATAU user menutup
  // banner untuk sesi ini (sampai reload).
  if (standalone || hidden) return null;

  const handleInstall = async () => {
    if (!prompt) return;
    try {
      await prompt.prompt();
      const choice = await prompt.userChoice;
      if (choice.outcome === "accepted") {
        // Tidak set standalone=true di sini — biarkan event `appinstalled`
        // atau matchMedia change yang melakukannya. Banner akan auto-hide.
        setPrompt(null);
      }
    } catch {
      setPrompt(null);
    }
  };

  const iosMode = isIosSafari();
  const canPrompt = !!prompt;

  // Helper text berdasarkan kondisi:
  // - iOS Safari → arahkan ke Share menu
  // - Chrome/Edge dengan prompt siap → tombol install langsung
  // - Browser lain / Chrome belum fire event → arahkan ke menu browser
  const subtitle = iosMode
    ? 'Buka menu Share lalu pilih "Add to Home Screen"'
    : canPrompt
      ? "Akses lebih cepat langsung dari layar utama"
      : "Buka menu browser → pilih \"Install app\" atau \"Add to Home Screen\"";

  const card = (
    <div className="fixed inset-x-0 bottom-4 z-[100] flex justify-center px-4 pointer-events-none">
      <div
        role="dialog"
        aria-label="Install Amalan Harian"
        className="anim-rise pointer-events-auto w-full max-w-md rounded-2xl bg-neutral-900 text-white shadow-2xl ring-1 ring-white/10"
      >
        <div className="flex items-start gap-3 p-4">
          <div className="shrink-0 w-10 h-10 rounded-xl bg-amber-400/15 flex items-center justify-center ring-1 ring-amber-300/30">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fcd34d" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
              <line x1="12" y1="18" x2="12.01" y2="18" />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold">Install Amalan Harian</p>
            <p className="text-xs text-neutral-300 mt-0.5">{subtitle}</p>
          </div>
          <button
            onClick={() => setHidden(true)}
            aria-label="Tutup"
            className="shrink-0 -mr-1 -mt-1 grid size-7 place-items-center rounded-lg text-neutral-400 transition-colors hover:bg-white/10 hover:text-white"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
        {!iosMode && canPrompt && (
          <div className="px-4 pb-4">
            <button
              onClick={handleInstall}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-amber-400 hover:bg-amber-300 transition-colors text-neutral-900 font-semibold text-sm py-2.5"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              Install Aplikasi
            </button>
          </div>
        )}
      </div>
    </div>
  );

  return createPortal(card, document.body);
}
