import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGoBack } from "@/lib/use-back-trap";
import { useAuth } from "@/lib/auth";
import { api, type AdminUserRow, type AdminReferralRow } from "@/lib/api";
import { useToast } from "@/lib/toast";
import { avatarOf, fmt } from "@/lib/data";

type SortKey = "total" | "amalan" | "referral" | "streak" | "name";

export default function AdminPoinPage() {
  const { user } = useAuth();
  const nav = useNavigate();
  const goBack = useGoBack("/profil");
  const fire = useToast();

  const [rows, setRows] = useState<AdminUserRow[]>([]);
  const [referrals, setReferrals] = useState<AdminReferralRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortKey>("total");

  useEffect(() => {
    if (!user) return;
    if (user.role !== "admin") {
      fire("⚠️ Akses ditolak — hanya admin");
      nav("/profil", { replace: true });
      return;
    }
    let alive = true;
    api
      .adminListUsers()
      .then((r) => alive && setRows(r.data))
      .catch((e: Error) => alive && fire(`⚠️ ${e.message}`))
      .finally(() => alive && setLoading(false));
    api
      .adminListReferrals()
      .then((r) => alive && setReferrals(r.data))
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, [user, nav, fire]);

  // Kelompokkan: referrer_id → daftar orang yang diajak
  const referralsByReferrer = useMemo(() => {
    const map: Record<string, AdminReferralRow[]> = {};
    for (const r of referrals) {
      (map[r.referrer_id] ??= []).push(r);
    }
    return map;
  }, [referrals]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    let list = q
      ? rows.filter(
          (r) =>
            r.name.toLowerCase().includes(q) ||
            (r.email ?? "").toLowerCase().includes(q) ||
            (r.referral_code ?? "").toLowerCase().includes(q),
        )
      : rows.slice();
    // Saat sort "referral", filter hanya yang punya referral aktif
    if (sort === "referral") {
      list = list.filter((r) => r.referral_count > 0);
    }
    list.sort((a, b) => {
      switch (sort) {
        case "amalan":
          return b.amalan_poin - a.amalan_poin;
        case "referral":
          return b.referral_count - a.referral_count;
        case "streak":
          return b.streak_days - a.streak_days;
        case "name":
          return a.name.localeCompare(b.name);
        default:
          return b.total_poin - a.total_poin;
      }
    });
    return list;
  }, [rows, search, sort]);

  const totalUsers = rows.length;
  const totalPoinAll = rows.reduce((s, r) => s + r.total_poin, 0);
  const totalReferral = rows.reduce((s, r) => s + r.referral_count, 0);

  const promote = async (row: AdminUserRow) => {
    if (row.id === user?.id) {
      fire("⚠️ Tidak bisa ubah role sendiri");
      return;
    }
    const isAdmin = row.role === "admin";
    const newRole: "admin" | "user" = isAdmin ? "user" : "admin";
    const label = isAdmin ? "demote ke User" : "promote ke Admin";
    if (!window.confirm(`${label}: ${row.name}?`)) return;
    try {
      await api.adminSetRole(row.id, newRole);
      setRows((prev) => prev.map((r) => (r.id === row.id ? { ...r, role: newRole } : r)));
      fire(`✅ ${row.name} → ${newRole}`);
    } catch (e) {
      fire(`⚠️ ${(e as Error).message}`);
    }
  };

  const resetPassword = async (row: AdminUserRow) => {
    // Password lama tidak bisa dilihat (ter-hash). Admin menetapkan yang baru.
    const np = window.prompt(
      `Set password BARU untuk ${row.name}\n(minimal 6 karakter — user akan ter-logout & wajib login ulang dengan password ini)`,
    );
    if (np === null) return; // dibatalkan
    if (np.trim().length < 6) {
      fire("⚠️ Password minimal 6 karakter");
      return;
    }
    try {
      await api.adminResetPassword(row.id, np.trim());
      fire(`🔑 Password ${row.name} diganti. Sampaikan ke user-nya.`);
    } catch (e) {
      fire(`⚠️ ${(e as Error).message}`);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-bg pb-10">
      {/* Header */}
      <div className="sticky top-0 z-10 border-b border-[rgba(13,79,60,0.08)] bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-2xl items-center gap-3 px-4 py-3.5">
          <button
            onClick={goBack}
            className="flex size-9 cursor-pointer items-center justify-center rounded-full bg-gp text-mu transition hover:bg-[rgba(13,79,60,0.08)] hover:text-g active:scale-90"
            aria-label="Kembali"
          >
            ←
          </button>
          <div className="flex-1">
            <div className="font-display text-[17px] font-bold text-dk">Evaluasi Poin User</div>
            <div className="text-[11px] text-mu">Admin · monitoring & manajemen</div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-2xl px-4 pt-4">
        {/* Summary stats */}
        <div className="mb-3 grid grid-cols-3 gap-2.5">
          <SumStat label="Total User" value={String(totalUsers)} />
          <SumStat label="Total Poin" value={fmt(totalPoinAll)} />
          <SumStat label="Total Referral" value={String(totalReferral)} />
        </div>

        {/* Search + Sort */}
        <div className="mb-3 flex flex-col gap-2">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari nama, email, atau kode referral..."
            className="w-full rounded-[10px] border-[1.5px] border-[rgba(13,79,60,0.13)] bg-white px-3.5 py-2.5 text-[14px] text-tx outline-none transition-colors focus:border-g3"
          />
          <div className="flex flex-wrap gap-1.5">
            {([
              ["total", "Total Poin"],
              ["amalan", "Poin Amalan"],
              ["referral", "Referral"],
              ["streak", "Streak"],
              ["name", "Nama"],
            ] as [SortKey, string][]).map(([k, label]) => (
              <button
                key={k}
                onClick={() => setSort(k)}
                className={`cursor-pointer rounded-full px-3 py-1 text-[11px] font-medium transition-all ${
                  sort === k
                    ? "bg-g text-white shadow-[0_2px_8px_rgba(13,79,60,0.25)]"
                    : "bg-white text-mu border border-[rgba(13,79,60,0.13)] hover:bg-gp"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* List */}
        {loading ? (
          <div className="rounded-2xl bg-white p-6 text-center text-[13px] text-mu">Memuat...</div>
        ) : filtered.length === 0 ? (
          <div className="rounded-2xl bg-white p-6 text-center text-[13px] text-mu">
            {sort === "referral"
              ? "Belum ada user yang dapat referral 🎁"
              : "Tidak ada user yang cocok"}
          </div>
        ) : (
          <div className="space-y-2">
            {filtered.map((r, i) => (
              <UserCard
                key={r.id}
                row={r}
                rank={i + 1}
                isSelf={r.id === user.id}
                referredList={referralsByReferrer[r.id] ?? []}
                onTogglePromote={() => promote(r)}
                onResetPassword={() => resetPassword(r)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function SumStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[12px] bg-white p-2.5 text-center shadow-[0_2px_8px_rgba(13,79,60,0.06)]">
      <div className="font-display text-[18px] font-bold text-g leading-none">{value}</div>
      <div className="mt-1 text-[10px] font-medium tracking-[0.3px] text-mu uppercase">{label}</div>
    </div>
  );
}

function UserCard({
  row,
  rank,
  isSelf,
  referredList,
  onTogglePromote,
  onResetPassword,
}: {
  row: AdminUserRow;
  rank: number;
  isSelf: boolean;
  referredList: AdminReferralRow[];
  onTogglePromote: () => void;
  onResetPassword: () => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const rankBadge =
    rank === 1 ? "🥇" : rank === 2 ? "🥈" : rank === 3 ? "🥉" : `#${rank}`;
  const isAdmin = row.role === "admin";

  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-[0_2px_12px_rgba(13,79,60,0.07)]">
      <button
        onClick={() => setExpanded((v) => !v)}
        className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-gp/40"
      >
        <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-g to-g3 text-[13px] font-bold text-white">
          {avatarOf(row.name)}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="truncate text-[14px] font-semibold text-dk">{row.name}</span>
            {isSelf && <span className="rounded bg-g/10 px-1 py-0.5 text-[9px] font-bold uppercase text-g">Anda</span>}
            {isAdmin && <span className="rounded bg-au/15 px-1 py-0.5 text-[9px] font-bold uppercase text-aud">Admin</span>}
          </div>
          {row.email && <div className="truncate text-[11px] text-mu">{row.email}</div>}
        </div>
        <div className="shrink-0 text-right">
          <div className="font-display text-[16px] font-bold text-g leading-none">{fmt(row.total_poin)}</div>
          <div className="mt-0.5 flex items-center justify-end gap-1 text-[10px] text-mu">
            <span>{rankBadge}</span>
            <span>{row.streak_days}🔥</span>
          </div>
        </div>
      </button>

      {expanded && (
        <div className="border-t border-[rgba(13,79,60,0.06)] bg-gp/30 px-4 py-3">
          <div className="grid grid-cols-2 gap-2 text-[12px] sm:grid-cols-4">
            <Detail label="Poin Amalan" value={fmt(row.amalan_poin)} />
            <Detail label="Total Amalan" value={String(row.amalan_log_count)} />
            <Detail label="Referral" value={String(row.referral_count)} />
            <Detail label="Poin Referral" value={`+${fmt(row.referral_poin)}`} />
          </div>
          <div className="mt-2.5 grid grid-cols-1 gap-2 text-[12px] sm:grid-cols-2">
            <Detail label="Kode Referral" value={row.referral_code ?? "—"} mono />
            <Detail label="Diajak Oleh" value={row.referred_by_name ?? "—"} />
            <Detail label="Aktif Terakhir" value={row.last_active ?? "Belum aktif"} />
            <Detail label="Daftar" value={(row.created_at || "").slice(0, 10) || "—"} />
          </div>

          {/* Daftar orang yang diajak user ini */}
          {referredList.length > 0 && (
            <div className="mt-2.5 rounded-[8px] bg-white px-2.5 py-2">
              <div className="mb-1.5 text-[10px] uppercase tracking-[0.3px] text-mu">
                Mengajak {referredList.length} orang
              </div>
              <ul className="flex flex-col gap-1">
                {referredList.map((ref, i) => (
                  <li
                    key={i}
                    className="flex items-center gap-2 rounded-[6px] bg-gp/50 px-2 py-1.5"
                  >
                    <span className="grid size-6 shrink-0 place-items-center rounded-full bg-g/10 text-[9px] font-bold text-g">
                      {avatarOf(ref.referred_name)}
                    </span>
                    <span className="min-w-0 flex-1 truncate text-[12px] font-medium text-dk">
                      {ref.referred_gender === "female" ? "👩 " : ref.referred_gender === "male" ? "👨 " : ""}
                      {ref.referred_name}
                    </span>
                    <span className="shrink-0 text-[10px] text-mu">{(ref.created_at || "").slice(0, 10)}</span>
                    <span className="shrink-0 rounded bg-g/10 px-1.5 py-0.5 text-[10px] font-semibold text-g">
                      +{ref.poin_awarded}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <div className="mt-3 flex flex-col gap-2">
            {/* Reset password — tersedia untuk semua user (kecuali diri sendiri,
                pakai menu Pengaturan untuk itu) karena password lama tak bisa dilihat. */}
            {!isSelf && (
              <button
                onClick={onResetPassword}
                className="w-full cursor-pointer rounded-[8px] border border-[rgba(13,79,60,0.18)] px-3 py-2 text-[12px] font-semibold text-g transition-all hover:bg-gp active:scale-[0.98]"
              >
                🔑 Reset Password User
              </button>
            )}
            {!isSelf && (
              <button
                onClick={onTogglePromote}
                className={`w-full cursor-pointer rounded-[8px] px-3 py-2 text-[12px] font-semibold transition-all active:scale-[0.98] ${
                  isAdmin
                    ? "border border-[#dc3545]/30 text-[#dc3545] hover:bg-[rgba(220,53,69,0.05)]"
                    : "bg-g text-white shadow-[0_2px_8px_rgba(13,79,60,0.2)] hover:bg-g3"
                }`}
              >
                {isAdmin ? "↓ Demote ke User" : "↑ Jadikan Admin"}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function Detail({ label, value, mono = false }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="rounded-[8px] bg-white px-2.5 py-1.5">
      <div className="text-[10px] uppercase tracking-[0.3px] text-mu">{label}</div>
      <div className={`mt-0.5 font-semibold text-dk ${mono ? "font-mono tracking-wider text-[13px]" : "text-[12px]"}`}>
        {value}
      </div>
    </div>
  );
}
