const API_BASE = (import.meta.env.VITE_API_URL as string | undefined) ?? "/api";
const TOKEN_KEY = "amalan_token";

export type Gender = "male" | "female";

export type User = {
  id: string;
  name: string;
  email: string | null;
  role: "admin" | "user";
  gender: Gender | null;
  total_poin: number;
  streak_days: number;
  last_active: string | null;
  referral_code: string | null;
};

export type AdminUserRow = {
  id: string;
  name: string;
  email: string | null;
  role: "admin" | "user";
  total_poin: number;
  streak_days: number;
  last_active: string | null;
  referral_code: string | null;
  referred_by_name: string | null;
  referral_count: number;
  referral_poin: number;
  amalan_log_count: number;
  amalan_poin: number;
  created_at: string;
};

export type ReferralStats = {
  count: number;
  poin_earned: number;
};

export type ReferralItem = {
  name: string;
  gender: Gender | null;
  poin_awarded: number;
  created_at: string;
};

export type AdminReferralRow = {
  referrer_id: string;
  referrer_name: string;
  referred_name: string;
  referred_gender: Gender | null;
  poin_awarded: number;
  created_at: string;
};

export type LeaderboardRow = {
  id: string;
  name: string;
  avatar: string;
  total_poin: number;
  streak_days: number;
  rank: number;
};

export type RiwayatItem = { id: string; name: string; poin: number; count?: number };
export type RiwayatDay = { date: string; items: RiwayatItem[] };

export type TodayDetailItem = { surat_id: string; count: number; poin: number };

export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const setToken = (t: string | null) => {
  if (t) localStorage.setItem(TOKEN_KEY, t);
  else localStorage.removeItem(TOKEN_KEY);
};

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...((init?.headers as Record<string, string>) ?? {}),
  };
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${path}`, { ...init, headers });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.message ?? `HTTP ${res.status}`);
  return data as T;
}

export const api = {
  register: (body: { name: string; email?: string; password: string; referral_code?: string; gender: Gender }) =>
    request<{ token: string; user: User }>("/register", { method: "POST", body: JSON.stringify(body) }),

  login: (body: { name?: string; email?: string; password: string }) =>
    request<{ token: string; user: User }>("/login", { method: "POST", body: JSON.stringify(body) }),

  logout: () => request<{ ok: true }>("/logout", { method: "POST" }),

  me: (date?: string) =>
    request<{
      user: User;
      today_surat: string[];
      today_detail?: TodayDetailItem[];
      date?: string;
      rank: number;
      referral_stats?: ReferralStats;
    }>(`/me${date ? `?date=${encodeURIComponent(date)}` : ""}`, { method: "GET" }),

  catatAmalan: (body: { surat_id: string; surat_name: string; poin: number; count?: number; tanggal?: string }) =>
    request<{ status: string; user: User; count?: number; poin_total?: number }>("/amalan", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  hapusAmalan: (body: { surat_id: string; tanggal?: string }) =>
    request<{ status: string; user: User }>("/amalan/delete", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  leaderboard: () => request<{ data: LeaderboardRow[] }>("/leaderboard", { method: "GET" }),

  // Daftar nama orang yang diajak oleh user yang login
  referrals: () => request<{ data: ReferralItem[] }>("/referrals", { method: "GET" }),

  riwayat: () => request<{ data: RiwayatDay[] }>("/riwayat", { method: "GET" }),

  adminListUsers: () =>
    request<{ data: AdminUserRow[] }>("/admin/users", { method: "GET" }),

  // Semua pasangan referral (pengajak → yang diajak) — admin only
  adminListReferrals: () =>
    request<{ data: AdminReferralRow[] }>("/admin/referrals", { method: "GET" }),

  adminSetRole: (userId: string, role: "admin" | "user") =>
    request<{ ok: true }>("/admin/set-role", {
      method: "POST",
      body: JSON.stringify({ user_id: userId, role }),
    }),

  // Update profile (name + email + optional gender)
  updateProfile: (body: { name: string; email?: string | null; gender?: Gender }) =>
    request<{ user: User }>("/me/update", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  // Change password (require current password)
  changePassword: (body: { current_password: string; new_password: string }) =>
    request<{ ok: true }>("/me/change-password", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  // App config (Meta Pixel, WhatsApp, CS) - GET public, PATCH admin only
  getAppConfig: () =>
    request<{ data: AppConfig }>("/app-config", { method: "GET" }),

  adminUpdateAppConfig: (body: Partial<AppConfig>) =>
    request<{ ok: true; updated: Partial<AppConfig> }>("/admin/app-config", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  // ─── Sholat ───
  getSholat: (date?: string) =>
    request<SholatDay>(`/sholat${date ? `?date=${encodeURIComponent(date)}` : ""}`, { method: "GET" }),

  catatSholat: (body: { waktu: SholatWaktu; status: SholatStatus; catatan?: string; tanggal?: string }) =>
    request<{ status: string; waktu: SholatWaktu; new_status: SholatStatus; poin: number }>("/sholat", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  hapusSholat: (body: { waktu: SholatWaktu; tanggal?: string }) =>
    request<{ status: string }>("/sholat/delete", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  autoUzurSholat: (tanggal: string) =>
    request<{ status: string; tanggal: string }>("/sholat/auto-uzur", {
      method: "POST",
      body: JSON.stringify({ tanggal }),
    }),

  sholatStats: (month?: string) =>
    request<SholatStats>(`/sholat/stats${month ? `?month=${encodeURIComponent(month)}` : ""}`, { method: "GET" }),

  // ─── Haid ───
  getHaid: () => request<{ data: HaidPeriod[]; active: boolean }>("/haid", { method: "GET" }),

  mulaiHaid: (body: { tanggal_mulai?: string; catatan?: string }) =>
    request<{ status: string; id: string }>("/haid/mulai", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  selesaiHaid: (body: { tanggal_selesai?: string }) =>
    request<{ status: string }>("/haid/selesai", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  hapusHaid: (id: string) =>
    request<{ status: string }>("/haid/delete", {
      method: "POST",
      body: JSON.stringify({ id }),
    }),

  // ─── Puasa ───
  getPuasa: (month?: string) =>
    request<{ month: string; data: PuasaItem[]; total_penuh: number }>(
      `/puasa${month ? `?month=${encodeURIComponent(month)}` : ""}`,
      { method: "GET" },
    ),

  catatPuasa: (body: { tanggal?: string; jenis: PuasaJenis; status?: PuasaStatus; catatan?: string }) =>
    request<{ status: string; tanggal: string; jenis: PuasaJenis; poin: number }>("/puasa", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  hapusPuasa: (tanggal: string) =>
    request<{ status: string }>("/puasa/delete", {
      method: "POST",
      body: JSON.stringify({ tanggal }),
    }),

  // ─── Dzikir ───
  getDzikir: (date?: string) =>
    request<{ date: string; data: DzikirItem[] }>(
      `/dzikir${date ? `?date=${encodeURIComponent(date)}` : ""}`,
      { method: "GET" },
    ),

  catatDzikir: (kategori: DzikirKategori, tanggal?: string) =>
    request<{ status: string; poin?: number }>("/dzikir", {
      method: "POST",
      body: JSON.stringify({ kategori, tanggal }),
    }),

  hapusDzikir: (kategori: DzikirKategori, tanggal?: string) =>
    request<{ status: string }>("/dzikir/delete", {
      method: "POST",
      body: JSON.stringify({ kategori, tanggal }),
    }),
};

export type AppConfig = {
  meta_pixel_id: string;
  whatsapp_group_url: string;
  whatsapp_group_label: string;
  cs_whatsapp_number: string;
  cs_name: string;
  cs_label: string;
  contact_enabled: string;
};

// ─── Sholat ───
export type SholatWaktu = "subuh" | "dzuhur" | "ashar" | "maghrib" | "isya";
export type SholatStatus = "tepat_waktu" | "telat" | "terlewat" | "uzur";
export type SholatItem = {
  waktu: SholatWaktu;
  status: SholatStatus | null;
  catatan: string | null;
  poin: number;
};
export type SholatDay = {
  date: string;
  haid_active: boolean;
  data: SholatItem[];
  total_poin: number;
};
export type SholatStats = {
  month: string;
  stats: { tepat_waktu: number; telat: number; terlewat: number; uzur: number };
  total_recorded: number;
  target: number;
  days_counted: number;
};

// ─── Haid ───
export type HaidPeriod = {
  id: string;
  tanggal_mulai: string;
  tanggal_selesai: string | null;
  catatan: string | null;
  durasi_hari: number;
  active: boolean;
};

// ─── Puasa ───
export type PuasaJenis =
  | "ramadan" | "senin" | "kamis" | "ayyamul_bidh"
  | "syawal" | "arafah" | "asyura" | "daud" | "sunnah_lain";
export type PuasaStatus = "penuh" | "batal" | "uzur";
export type PuasaItem = {
  tanggal: string;
  jenis: PuasaJenis;
  status: PuasaStatus;
  catatan: string | null;
  poin: number;
};

// ─── Dzikir ───
export type DzikirKategori = "pagi" | "petang" | "tidur" | "bangun";
export type DzikirItem = {
  kategori: DzikirKategori;
  done: boolean;
  poin: number;
};
