import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { api, getToken, setToken, type User, type TodayDetailItem, type ReferralStats } from "./api";

export type DoneEntry = { count: number; poin: number };

type AuthState = {
  user: User | null;
  rank: number;
  todaySurat: Set<string>;
  todayDetail: Map<string, DoneEntry>;
  selectedDate: string;          // YYYY-MM-DD
  referralStats: ReferralStats;
  loading: boolean;
  refresh: () => Promise<void>;
  setUser: (u: User) => void;
  setTodaySurat: (s: Set<string>) => void;
  setTodayDetail: (m: Map<string, DoneEntry>) => void;
  setSelectedDate: (d: string) => Promise<void>;
  logout: () => Promise<void>;
};

const Ctx = createContext<AuthState | null>(null);

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

function detailToMap(detail?: TodayDetailItem[]): Map<string, DoneEntry> {
  const m = new Map<string, DoneEntry>();
  if (!detail) return m;
  for (const d of detail) m.set(d.surat_id, { count: d.count, poin: d.poin });
  return m;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<User | null>(null);
  const [rank, setRank] = useState(0);
  const [todaySurat, setTodaySuratState] = useState<Set<string>>(new Set());
  const [todayDetail, setTodayDetailState] = useState<Map<string, DoneEntry>>(new Map());
  const [selectedDate, setSelectedDateState] = useState<string>(todayStr());
  const [referralStats, setReferralStats] = useState<ReferralStats>({ count: 0, poin_earned: 0 });
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!getToken()) {
      setUserState(null);
      setLoading(false);
      return;
    }
    try {
      const isToday = selectedDate === todayStr();
      const r = await api.me(isToday ? undefined : selectedDate);
      setUserState(r.user);
      setRank(r.rank);
      setTodaySuratState(new Set(r.today_surat));
      setTodayDetailState(detailToMap(r.today_detail));
      if (r.referral_stats) setReferralStats(r.referral_stats);
    } catch {
      setToken(null);
      setUserState(null);
    } finally {
      setLoading(false);
    }
  }, [selectedDate]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const setSelectedDate = useCallback(async (d: string) => {
    setSelectedDateState(d);
    // refresh akan dipicu via useEffect karena dependency selectedDate
  }, []);

  const logout = useCallback(async () => {
    try {
      await api.logout();
    } catch {
      // ignore
    }
    setToken(null);
    setUserState(null);
    setRank(0);
    setTodaySuratState(new Set());
    setTodayDetailState(new Map());
    setSelectedDateState(todayStr());
    setReferralStats({ count: 0, poin_earned: 0 });
  }, []);

  const value = useMemo<AuthState>(
    () => ({
      user,
      rank,
      todaySurat,
      todayDetail,
      selectedDate,
      referralStats,
      loading,
      refresh,
      setUser: setUserState,
      setTodaySurat: setTodaySuratState,
      setTodayDetail: setTodayDetailState,
      setSelectedDate,
      logout,
    }),
    [user, rank, todaySurat, todayDetail, selectedDate, referralStats, loading, refresh, setSelectedDate, logout],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAuth() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useAuth must be used inside AuthProvider");
  return v;
}
