import { useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";

/**
 * Mencegah tombol back hardware/browser menutup aplikasi saat user
 * berada di halaman "root" (yang tidak punya parent natural).
 *
 * Strategi:
 * 1. Track urutan halaman yang user kunjungi di memory (max 20 entry).
 * 2. Push dummy history entry sekali di awal supaya selalu ada satu
 *    "buffer" yang user tekan back tidak langsung close app.
 * 3. Saat popstate fire (user tekan back hardware/browser):
 *    - Re-push dummy entry supaya next back juga ter-intercept.
 *    - Cari halaman sebelumnya di memory stack.
 *    - Kalau ada → navigate ke sana.
 *    - Kalau tidak ada → tidak melakukan apa-apa (app stay terbuka, tidak ke home).
 *
 * User tetap bisa close app via tombol recent apps / overview.
 */
export function useBackTrap() {
  const nav = useNavigate();
  const location = useLocation();
  const stackRef = useRef<string[]>([]);
  const ignoreNextPopRef = useRef(false);

  // Track urutan kunjungan tiap kali path berubah.
  // Skip kalau push terjadi karena efek dari kita sendiri (nav() dari popstate).
  useEffect(() => {
    const path = location.pathname + location.search;
    const stack = stackRef.current;
    if (stack[stack.length - 1] !== path) {
      stack.push(path);
      if (stack.length > 20) stack.shift();
    }
  }, [location.pathname, location.search]);

  // Setup popstate handler sekali saja.
  useEffect(() => {
    // Push dummy entry sekali. Browser/Android menerimanya sebagai "next" state,
    // sehingga first back press akan trigger popstate (bukan langsung close).
    try {
      window.history.pushState({ amalanTrap: true }, "");
    } catch {
      // ignore
    }

    const onPopState = (_e: PopStateEvent) => {
      if (ignoreNextPopRef.current) {
        ignoreNextPopRef.current = false;
        return;
      }

      // Re-push dummy state segera supaya next back juga ter-intercept.
      try {
        window.history.pushState({ amalanTrap: true }, "");
      } catch {
        // ignore
      }

      const stack = stackRef.current;
      if (stack.length >= 2) {
        // Pop current path dari stack, navigate ke previous.
        stack.pop();
        const prev = stack[stack.length - 1];
        // Set flag supaya effect di atas tidak push duplicate
        // (nav() akan trigger location change → effect → push lagi).
        // Workaround: kita pop sekarang, dan saat effect jalan akan push ulang.
        // Itu OK karena yang di-push adalah path yang benar (prev).
        if (prev) nav(prev);
      }
      // Kalau stack tinggal 1 entry (root pertama yang dikunjungi),
      // biarkan saja — app tetap terbuka di halaman tersebut.
    };

    window.addEventListener("popstate", onPopState);
    return () => {
      window.removeEventListener("popstate", onPopState);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
