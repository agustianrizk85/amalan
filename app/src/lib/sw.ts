/* Service Worker registration helper.
   Memanggil onUpdate callback saat ada versi baru menunggu activate. */

type UpdateCallback = (reg: ServiceWorkerRegistration) => void;

let registered = false;

export function registerSW(onUpdate: UpdateCallback) {
  if (registered) return;
  if (typeof window === "undefined") return;
  if (!("serviceWorker" in navigator)) return;
  // Skip di dev mode (Vite serve, jangan caching agresif)
  if (import.meta.env.DEV) return;
  registered = true;

  window.addEventListener("load", async () => {
    try {
      const reg = await navigator.serviceWorker.register("/sw.js", { scope: "/" });

      // Sudah ada SW menunggu saat page load (mis. user buka tab baru)
      if (reg.waiting && navigator.serviceWorker.controller) {
        onUpdate(reg);
      }

      reg.addEventListener("updatefound", () => {
        const installing = reg.installing;
        if (!installing) return;
        installing.addEventListener("statechange", () => {
          if (installing.state === "installed" && navigator.serviceWorker.controller) {
            // Ada SW baru terinstall, ada juga SW aktif sekarang → update tersedia
            onUpdate(reg);
          }
        });
      });

      // Reload saat controller berubah (SW baru take over)
      let refreshing = false;
      navigator.serviceWorker.addEventListener("controllerchange", () => {
        if (refreshing) return;
        refreshing = true;
        window.location.reload();
      });

      // Cek update setiap 1 jam
      setInterval(() => reg.update().catch(() => {}), 60 * 60 * 1000);
    } catch {
      // Silent fail — SW tidak kritis
    }
  });
}

export function activateWaitingSW(reg: ServiceWorkerRegistration) {
  reg.waiting?.postMessage("SKIP_WAITING");
}
