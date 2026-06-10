import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { api, type AppConfig } from "@/lib/api";

const DEFAULTS: AppConfig = {
  meta_pixel_id: "",
  whatsapp_group_url: "",
  whatsapp_group_label: "Gabung Grup WhatsApp Amalan",
  cs_whatsapp_number: "",
  cs_name: "Admin Amalan",
  cs_label: "Chat Admin via WhatsApp",
  contact_enabled: "1",
};

const STORAGE_KEY = "amalan_app_config_v1";

type Ctx = {
  config: AppConfig;
  loading: boolean;
  refresh: () => Promise<void>;
  isContactEnabled: boolean;
  hasWhatsAppGroup: boolean;
  hasCS: boolean;
  csWhatsAppLink: string | null;
};

const AppConfigCtx = createContext<Ctx | null>(null);

function loadCached(): AppConfig {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULTS;
    return { ...DEFAULTS, ...JSON.parse(raw) };
  } catch {
    return DEFAULTS;
  }
}

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    _fbq?: unknown;
  }
}

function injectMetaPixel(pixelId: string) {
  if (!pixelId) return;
  if (typeof window === "undefined") return;
  // Idempotent: kalau script untuk pixel ini sudah ada, skip
  const existing = document.getElementById("meta-pixel-script");
  if (existing && existing.getAttribute("data-pixel-id") === pixelId) return;
  if (existing) existing.remove();

  // Standard Meta Pixel base code
  (function (f: Window, b: Document, e: string, v: string) {
    let n: ((...args: unknown[]) => void) & { callMethod?: unknown; queue?: unknown[]; push?: unknown; loaded?: boolean; version?: string };
    if (f.fbq) return;
    n = function (this: unknown, ...args: unknown[]) {
      // @ts-expect-error - dynamic call shape
      n.callMethod ? n.callMethod.apply(this, args) : (n.queue as unknown[]).push(args);
    } as typeof n;
    f.fbq = n;
    if (!f._fbq) f._fbq = n;
    n.push = n;
    n.loaded = true;
    n.version = "2.0";
    n.queue = [];
    const t = b.createElement(e) as HTMLScriptElement;
    t.async = true;
    t.src = v;
    t.id = "meta-pixel-script";
    t.setAttribute("data-pixel-id", pixelId);
    const s = b.getElementsByTagName(e)[0];
    s?.parentNode?.insertBefore(t, s);
  })(window, document, "script", "https://connect.facebook.net/en_US/fbevents.js");

  window.fbq?.("init", pixelId);
  window.fbq?.("track", "PageView");
}

function removeMetaPixel() {
  if (typeof window === "undefined") return;
  document.getElementById("meta-pixel-script")?.remove();
  document.getElementById("meta-pixel-noscript")?.remove();
  delete window.fbq;
  delete window._fbq;
}

export function trackPixelEvent(event: string, params?: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  try {
    window.fbq?.("track", event, params ?? {});
  } catch {
    // ignore
  }
}

export function AppConfigProvider({ children }: { children: ReactNode }) {
  const [config, setConfig] = useState<AppConfig>(() => loadCached());
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const res = await api.getAppConfig();
      const merged = { ...DEFAULTS, ...res.data };
      setConfig(merged);
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(merged)); } catch { /* ignore */ }
    } catch {
      // Network error: keep cached / defaults
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  // Inject / remove Meta Pixel saat config.meta_pixel_id berubah
  useEffect(() => {
    if (config.meta_pixel_id) injectMetaPixel(config.meta_pixel_id);
    else removeMetaPixel();
  }, [config.meta_pixel_id]);

  const isContactEnabled = config.contact_enabled !== "0";
  const hasWhatsAppGroup = Boolean(config.whatsapp_group_url?.trim());
  const hasCS = Boolean(config.cs_whatsapp_number?.trim());
  const csWhatsAppLink = useMemo(() => {
    const num = config.cs_whatsapp_number.replace(/[^0-9]/g, "");
    if (!num) return null;
    const greet = `Halo ${config.cs_name || "Admin"}, saya butuh bantuan terkait aplikasi Amalan.`;
    return `https://wa.me/${num}?text=${encodeURIComponent(greet)}`;
  }, [config.cs_whatsapp_number, config.cs_name]);

  const value = useMemo<Ctx>(
    () => ({ config, loading, refresh, isContactEnabled, hasWhatsAppGroup, hasCS, csWhatsAppLink }),
    [config, loading, refresh, isContactEnabled, hasWhatsAppGroup, hasCS, csWhatsAppLink],
  );

  return <AppConfigCtx.Provider value={value}>{children}</AppConfigCtx.Provider>;
}

export function useAppConfig(): Ctx {
  const v = useContext(AppConfigCtx);
  if (!v) throw new Error("useAppConfig must be used inside AppConfigProvider");
  return v;
}
