import { useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";

/**
 * Halaman "root" aplikasi — tempat tombol back TIDAK boleh menutup app
 * secara tak sengaja, dan tidak ada parent natural untuk kembali.
 */
const ROOT_PATHS = new Set(["/", "/beranda", "/amalan"]);

/**
 * Mencegah tombol back hardware/browser langsung menutup aplikasi saat user
 * berada di halaman root — TANPA mengganggu navigasi back normal.
 *
 * Implementasi lama menyimpan stack halaman sendiri lalu memanggil nav() dari
 * popstate. Itu rapuh: setiap kali tombol back di dalam halaman memanggil
 * nav("/beranda"), stack itu menganggapnya navigasi MAJU, sehingga tombol back
 * berikutnya melompat ke halaman yang salah ("tidak bisa back").
 *
 * Pendekatan baru: percayakan history browser apa adanya. react-router sudah
 * mendorong satu entry per navigasi, jadi back hardware/browser otomatis benar.
 * Hook ini hanya memasang satu "buffer" entry dan memasangnya ulang HANYA ketika
 * user menekan back di halaman root — sehingga app tetap terbuka di sana. Di
 * halaman lain hook ini tidak melakukan apa-apa (back native berjalan normal).
 */
export function useBackTrap() {
  useEffect(() => {
    // Pertahankan idx milik react-router (kalau ada) supaya tidak bikin desync.
    const arm = () =>
      window.history.pushState(
        { ...(window.history.state as object | null), amalanGuard: true },
        "",
      );

    // Pasang satu buffer di awal supaya back pertama di root tidak menutup app.
    arm();

    const onPopState = () => {
      // Hanya jaga halaman root: pasang ulang buffer agar app tidak tertutup.
      // Halaman lain dibiarkan — back native menuju halaman sebelumnya.
      if (ROOT_PATHS.has(window.location.pathname)) arm();
    };

    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);
}

/**
 * Tombol "Kembali" di dalam halaman. Kembali ke halaman SEBELUMNYA yang
 * sesungguhnya (history browser) — bukan selalu ke /beranda. Kalau tidak ada
 * history dalam app (mis. dibuka langsung lewat deep-link), pakai `fallback`.
 */
export function useGoBack(fallback = "/beranda") {
  const nav = useNavigate();
  return useCallback(() => {
    const idx = (window.history.state as { idx?: number } | null)?.idx;
    if (typeof idx === "number" && idx > 0) nav(-1);
    else nav(fallback, { replace: true });
  }, [nav, fallback]);
}
