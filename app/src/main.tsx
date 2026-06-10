import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";

// Tangkap kode referral dari URL (`?ref=KODE`) SEBELUM router/auth mount.
// Tanpa ini, kalau user sudah login, <Navigate to="/beranda"> akan
// menghilangkan query string sebelum AuthPage sempat membacanya.
(() => {
  try {
    const params = new URLSearchParams(window.location.search);
    const ref = params.get("ref");
    if (ref && ref.trim()) {
      localStorage.setItem("amalan_ref", ref.trim().toUpperCase());
      // Bersihkan ref dari URL biar tidak terbawa-bawa saat navigasi
      params.delete("ref");
      const newSearch = params.toString();
      const newUrl =
        window.location.pathname +
        (newSearch ? `?${newSearch}` : "") +
        window.location.hash;
      window.history.replaceState({}, "", newUrl);
    }
  } catch {
    // Ignore — fitur ini opsional
  }
})();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
);
