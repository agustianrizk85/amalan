import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type Settings = {
  // Display
  fontArab: number;        // 22-44
  fontLatin: number;       // 13-22
  fontTerjemah: number;    // 13-22
  showLatin: boolean;
  showTerjemah: boolean;
  showAyatNumberArab: boolean;
  darkReader: boolean;
  arabStyle: "indopak" | "uthmani";

  // Audio
  defaultQari: string;     // "01".."06"
  autoScrollOnPlay: boolean;

  // Lokasi & jadwal
  kota: string;            // Untuk jadwal sholat — default Jakarta
  metode: number;          // 20 = Kementerian Agama RI (Aladhan API)

  // Notifikasi
  reminderHarian: boolean;
  reminderJam: string;     // "HH:MM"
};

export const DEFAULT_SETTINGS: Settings = {
  fontArab: 30,
  fontLatin: 15,
  fontTerjemah: 15,
  showLatin: true,
  showTerjemah: true,
  showAyatNumberArab: true,
  darkReader: false,
  arabStyle: "indopak",
  defaultQari: "05",
  autoScrollOnPlay: true,
  kota: "Jakarta",
  metode: 20,
  reminderHarian: false,
  reminderJam: "05:00",
};

const STORAGE_KEY = "amalan_settings_v2";

type Ctx = {
  settings: Settings;
  update: <K extends keyof Settings>(key: K, val: Settings[K]) => void;
  reset: () => void;
};

const SettingsCtx = createContext<Ctx | null>(null);

function load(): Settings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULT_SETTINGS };
    const parsed = JSON.parse(raw);
    return { ...DEFAULT_SETTINGS, ...parsed };
  } catch {
    return { ...DEFAULT_SETTINGS };
  }
}

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<Settings>(() => load());

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(settings)); } catch { /* ignore */ }
  }, [settings]);

  const update = useCallback(<K extends keyof Settings>(key: K, val: Settings[K]) => {
    setSettings((s) => ({ ...s, [key]: val }));
  }, []);

  const reset = useCallback(() => {
    setSettings({ ...DEFAULT_SETTINGS });
  }, []);

  const value = useMemo<Ctx>(() => ({ settings, update, reset }), [settings, update, reset]);

  return <SettingsCtx.Provider value={value}>{children}</SettingsCtx.Provider>;
}

export function useSettings(): Ctx {
  const v = useContext(SettingsCtx);
  if (!v) throw new Error("useSettings must be used inside SettingsProvider");
  return v;
}

// ─── Terakhir Baca (lokasi terakhir dibaca, per ayat) ───
export type TerakhirBaca = {
  nomor: number;
  namaLatin: string;
  arti: string;
  ayat?: number;       // opsional - kalau set, akan auto-scroll ke ayat saat buka
  tanggal: string;
};

const TB_KEY = "amalan_terakhir_baca_v1";

export function saveTerakhirBaca(b: TerakhirBaca) {
  try {
    localStorage.setItem(TB_KEY, JSON.stringify(b));
  } catch { /* ignore */ }
}

export function loadTerakhirBaca(): TerakhirBaca | null {
  try {
    const raw = localStorage.getItem(TB_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as TerakhirBaca;
  } catch {
    return null;
  }
}

// ─── Bookmark (banyak entry, per ayat) ───
export type Bookmark = {
  id: string;        // `${nomor}-${ayat}`
  nomor: number;
  namaLatin: string;
  arti: string;
  ayat: number;
  catatan?: string;
  tanggal: string;
};

const BK_KEY = "amalan_bookmarks_v1";

export function loadBookmarks(): Bookmark[] {
  try {
    const raw = localStorage.getItem(BK_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function isBookmarked(nomor: number, ayat: number): boolean {
  const id = `${nomor}-${ayat}`;
  return loadBookmarks().some((b) => b.id === id);
}

export function addBookmark(b: Omit<Bookmark, "id" | "tanggal">): Bookmark {
  const id = `${b.nomor}-${b.ayat}`;
  const entry: Bookmark = { id, ...b, tanggal: new Date().toISOString() };
  const list = loadBookmarks().filter((x) => x.id !== id);
  list.unshift(entry);
  // batasi 50 bookmark terakhir
  const trimmed = list.slice(0, 50);
  try { localStorage.setItem(BK_KEY, JSON.stringify(trimmed)); } catch { /* ignore */ }
  return entry;
}

export function removeBookmark(nomor: number, ayat: number) {
  const id = `${nomor}-${ayat}`;
  const list = loadBookmarks().filter((x) => x.id !== id);
  try { localStorage.setItem(BK_KEY, JSON.stringify(list)); } catch { /* ignore */ }
}
