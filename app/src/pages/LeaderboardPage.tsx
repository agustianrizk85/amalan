import { useEffect, useState } from "react";
import { api, type LeaderboardRow } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { fmt } from "@/lib/data";
import SectionHeader from "@/components/SectionHeader";

const medals = ["🥇", "🥈", "🥉"];

export default function LeaderboardPage() {
  const { user } = useAuth();
  const [rows, setRows] = useState<LeaderboardRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    api
      .leaderboard()
      .then((r) => alive && setRows(r.data))
      .catch(() => {})
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, []);

  const top3 = rows.slice(0, 3);
  const podiumOrder = [top3[1], top3[0], top3[2]];
  const bulan = new Date().toLocaleDateString("id-ID", { month: "long", year: "numeric" });

  return (
    <>
      <SectionHeader title="Papan Peringkat" sub="Update otomatis saat amalan ditandai" />

      <div className="mb-3.5 rounded-2xl bg-gradient-to-br from-g to-g2 px-5 pt-[22px] pb-7">
        <div className="font-display text-[22px] text-white">🏆 Top Pembaca</div>
        <div className="text-[13px] text-white/55">{bulan}</div>
        <div className="mt-[22px] flex items-end justify-center gap-2">
          {podiumOrder.map((u, i) => (
            <div key={u?.id ?? i} className="flex flex-1 flex-col items-center">
              <div
                className={`relative mb-1.5 flex items-center justify-center rounded-full border-2 font-bold text-white ${
                  i === 1
                    ? "size-[58px] border-aul bg-[rgba(201,168,76,0.2)] text-[17px] shadow-[0_0_0_4px_rgba(201,168,76,0.13)]"
                    : "size-[46px] border-white/25 bg-white/[0.14] text-sm"
                }`}
              >
                {i === 1 && <span className="absolute -top-3 text-base">👑</span>}
                {u?.avatar ?? "·"}
              </div>
              <div className="mb-[3px] max-w-[68px] text-center text-[11px] leading-[1.2] font-semibold text-white/80">
                {u?.name?.split(" ")[0] ?? "—"}
              </div>
              <div className="text-[12px] font-bold text-aul">{u ? fmt(u.total_poin) : 0}</div>
              <div
                className={`mt-1.5 w-full rounded-t-md border ${
                  i === 1
                    ? "h-14 border-[rgba(201,168,76,0.25)] bg-[rgba(201,168,76,0.18)]"
                    : i === 0
                    ? "h-8 border-white/10 bg-white/10"
                    : "h-5 border-white/10 bg-white/10"
                }`}
              />
            </div>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="py-11 text-center text-[14px] text-mu">Memuat...</div>
      ) : rows.length === 0 ? (
        <div className="py-11 text-center text-[14px] text-mu">Belum ada data peringkat</div>
      ) : (
        <div>
          {rows.map((u, i) => {
            const me = u.id === user?.id;
            return (
              <div
                key={u.id}
                className={`anim-rise mb-2.5 flex items-center gap-3 rounded-2xl border-[1.5px] px-3.5 py-3 shadow-[0_4px_24px_rgba(13,79,60,0.11)] ${
                  me
                    ? "border-[rgba(201,168,76,0.38)] bg-gradient-to-br from-[#fffdf3] to-white"
                    : "border-transparent bg-white"
                }`}
                style={{ animationDelay: `${i * 0.045}s` }}
              >
                <div
                  className={`w-[26px] shrink-0 text-center font-display text-[17px] font-bold ${
                    i < 3 ? "text-au" : "text-mu"
                  }`}
                >
                  {i < 3 ? medals[i] : i + 1}
                </div>
                <div className="flex size-10 shrink-0 items-center justify-center rounded-full border-[1.5px] border-[rgba(13,79,60,0.13)] bg-gp text-[13px] font-bold text-g">
                  {u.avatar}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-[14px] font-semibold text-dk">
                    {u.name}
                    {me && " (Kamu)"}
                  </div>
                  <div className="mt-px text-[11px] text-mu">🔥 {u.streak_days} hari streak</div>
                </div>
                <div className="text-right">
                  <div className="text-[15px] font-bold text-g">{fmt(u.total_poin)}</div>
                  <div className="text-[10px] text-mu">poin</div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
