import { useEffect, useState } from "react";
import { api, type RiwayatDay } from "@/lib/api";
import SectionHeader from "@/components/SectionHeader";

export default function RiwayatPage() {
  const [data, setData] = useState<RiwayatDay[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    api
      .riwayat()
      .then((r) => alive && setData(r.data))
      .catch(() => {})
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, []);

  return (
    <>
      <SectionHeader title="Riwayat Amalan" sub="Rekam jejak ibadah kamu" />

      {loading ? (
        <div className="py-11 text-center text-[14px] text-mu">Memuat...</div>
      ) : data.length === 0 ? (
        <div className="py-11 text-center text-[14px] leading-[1.8] text-mu">
          📖 Belum ada riwayat.
          <br />
          Mulai catat amalan hari ini!
        </div>
      ) : (
        <div>
          {data.map((r, i) => {
            const total = r.items.reduce((a, x) => a + x.poin, 0);
            const tgl = new Date(r.date + "T00:00:00").toLocaleDateString("id-ID", {
              weekday: "long",
              day: "numeric",
              month: "long",
              year: "numeric",
            });
            return (
              <div
                key={r.date}
                className="anim-rise mb-2.5 rounded-2xl bg-white p-3.5 shadow-[0_4px_24px_rgba(13,79,60,0.11)]"
                style={{ animationDelay: `${i * 0.055}s` }}
              >
                <div className="mb-2.5 text-[11px] font-semibold tracking-[0.7px] text-mu uppercase">
                  📅 {tgl}
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {r.items.map((it) => (
                    <span
                      key={it.id}
                      className="inline-flex items-center gap-1 rounded-[20px] border border-[rgba(13,79,60,0.11)] bg-gp px-2.5 py-[3px] text-[12px] font-medium text-g"
                    >
                      ✓ {it.name}
                      {it.count && it.count > 1 && (
                        <span className="rounded-full bg-au px-1.5 py-px text-[10px] font-bold text-white">×{it.count}</span>
                      )}
                      <span className="text-[11px] font-bold text-au">+{it.poin}</span>
                    </span>
                  ))}
                </div>
                <div className="mt-2.5 text-[12px] font-medium text-mu">
                  Total hari ini: <b className="text-g">+{total} poin</b>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
