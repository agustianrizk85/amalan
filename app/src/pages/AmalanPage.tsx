import { useMemo, useState } from "react";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { useToast } from "@/lib/toast";
import { SURAT, KATEGORI, grupOf, type Surat, type AmalanKategori } from "@/lib/data";
import { hasBacaan } from "@/lib/bacaan";
import QuranReader from "@/components/QuranReader";
import BacaanReader from "@/components/BacaanReader";

type FilterId = AmalanKategori | "all";

function todayStr() { return new Date().toISOString().slice(0, 10); }

export default function AmalanPage() {
  const {
    todaySurat, setTodaySurat,
    todayDetail, setTodayDetail,
    selectedDate,
    setUser,
  } = useAuth();
  const fire = useToast();
  const [busy, setBusy] = useState<string | null>(null);
  const [filter, setFilter] = useState<FilterId>("all");
  const [reader, setReader] = useState<{ nomor: number | null; picker: boolean } | null>(null);
  const [bacaanReader, setBacaanReader] = useState<Surat | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(new Set());
  const [kelipatan, setKelipatan] = useState<{ surat: Surat; n: number } | null>(null);

  const isToday = selectedDate === todayStr();
  const dateLabelShort = isToday
    ? "hari ini"
    : new Date(selectedDate + "T00:00:00").toLocaleDateString("id-ID", { day: "numeric", month: "long" });

  const filtered = useMemo(
    () => (filter === "all" ? SURAT : SURAT.filter((s) => s.kategori === filter)),
    [filter],
  );

  const grouped = useMemo(() => {
    const out: { key: string; label: string; icon: string; items: Surat[] }[] = [];
    const seen = new Map<string, { items: Surat[]; label: string; icon: string }>();
    for (const s of filtered) {
      let key: string;
      let label: string;
      let icon: string;
      if (filter === "all") {
        key = s.kategori;
        const k = KATEGORI.find((x) => x.id === s.kategori);
        label = k?.label ?? s.kategori;
        icon = k?.icon ?? "•";
      } else {
        key = `${s.kategori}::${grupOf(s)}`;
        label = grupOf(s);
        icon = "•";
      }
      if (!seen.has(key)) {
        const entry = { items: [s], label, icon };
        seen.set(key, entry);
        out.push({ key, label, icon, items: entry.items });
      } else {
        seen.get(key)!.items.push(s);
      }
    }
    return out;
  }, [filtered, filter]);

  const doneCount = filtered.filter((s) => todaySurat.has(s.id)).length;
  const todayPoin = filtered
    .filter((s) => todaySurat.has(s.id))
    .reduce((a, s) => a + (todayDetail.get(s.id)?.poin ?? s.poin), 0);
  const pct = filtered.length ? (doneCount / filtered.length) * 100 : 0;
  const totalPoinSemua = SURAT
    .filter((s) => todaySurat.has(s.id))
    .reduce((a, s) => a + (todayDetail.get(s.id)?.poin ?? s.poin), 0);

  // ─── CHECK / UNCHECK / KELIPATAN ───
  const onCheck = async (s: Surat) => {
    if (busy === s.id) return;
    const already = todaySurat.has(s.id);
    setBusy(s.id);
    try {
      if (already) {
        // UNCHECK
        const r = await api.hapusAmalan({ surat_id: s.id, tanggal: isToday ? undefined : selectedDate });
        const next = new Set(todaySurat);
        next.delete(s.id);
        setTodaySurat(next);
        const nextDetail = new Map(todayDetail);
        const old = nextDetail.get(s.id);
        nextDetail.delete(s.id);
        setTodayDetail(nextDetail);
        setUser(r.user);
        fire(`↩️ Batal centang · −${old?.poin ?? s.poin} poin`);
      } else {
        // CHECK (count=1)
        const r = await api.catatAmalan({
          surat_id: s.id,
          surat_name: s.name,
          poin: s.poin,
          count: 1,
          tanggal: isToday ? undefined : selectedDate,
        });
        const next = new Set(todaySurat);
        next.add(s.id);
        setTodaySurat(next);
        const nextDetail = new Map(todayDetail);
        nextDetail.set(s.id, { count: r.count ?? 1, poin: r.poin_total ?? s.poin });
        setTodayDetail(nextDetail);
        setUser(r.user);
        fire(`✅ +${r.poin_total ?? s.poin} poin · ${s.name}`);
      }
    } catch (e) {
      fire(`⚠️ ${(e as Error).message}`);
    } finally {
      setBusy(null);
    }
  };

  const openKelipatan = (s: Surat) => {
    const existing = todayDetail.get(s.id);
    setKelipatan({ surat: s, n: existing?.count ?? 1 });
  };

  const saveKelipatan = async () => {
    if (!kelipatan) return;
    const { surat, n } = kelipatan;
    const count = Math.max(1, Math.min(99999, Math.floor(n)));
    setKelipatan(null);
    setBusy(surat.id);
    try {
      const r = await api.catatAmalan({
        surat_id: surat.id,
        surat_name: surat.name,
        poin: surat.poin,
        count,
        tanggal: isToday ? undefined : selectedDate,
      });
      const next = new Set(todaySurat);
      next.add(surat.id);
      setTodaySurat(next);
      const nextDetail = new Map(todayDetail);
      nextDetail.set(surat.id, { count: r.count ?? count, poin: r.poin_total ?? surat.poin * count });
      setTodayDetail(nextDetail);
      setUser(r.user);
      fire(`✅ +${r.poin_total ?? surat.poin * count} poin · ${surat.name} ×${count}`);
    } catch (e) {
      fire(`⚠️ ${(e as Error).message}`);
    } finally {
      setBusy(null);
    }
  };

  const onCardTap = (s: Surat) => {
    if (s.nomor != null) setReader({ nomor: s.nomor, picker: false });
    else if (s.picker) setReader({ nomor: null, picker: true });
    else if (hasBacaan(s.id)) setBacaanReader(s);
    else setExpanded((cur) => (cur === s.id ? null : s.id));
  };

  const toggleGroup = (key: string) => {
    setCollapsedGroups((cur) => {
      const next = new Set(cur);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  return (
    <>
      {/* Banner mode retroaktif */}
      {!isToday && (
        <div className="mb-2 rounded-xl border border-aul/50 bg-aul/15 px-3 py-2 text-[12px] text-au">
          📅 Mode <b>isi amalan tertinggal</b> — sedang menandai tanggal <b>{dateLabelShort}</b>. Klik <b>↻ Hari Ini</b> di atas untuk kembali.
        </div>
      )}

      {/* PROGRESS — lebih besar untuk user lansia */}
      <div className="mb-3 rounded-2xl bg-white px-4 py-3.5 shadow-[0_3px_14px_rgba(13,79,60,0.09)]">
        <div className="mb-2 flex items-baseline justify-between gap-2">
          <span className="text-[15px] font-bold text-tx">
            {filter === "all" ? `Progress ${dateLabelShort}` : `${KATEGORI.find((k) => k.id === filter)?.label}`}
          </span>
          <span className="shrink-0 text-[15px] font-bold text-g">
            {doneCount}/{filtered.length} · +{todayPoin}p
          </span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-gp">
          <div
            className="h-full rounded-full bg-gradient-to-r from-g via-g3 to-au transition-[width] duration-500"
            style={{ width: `${pct}%` }}
          />
        </div>
        {filter !== "all" && totalPoinSemua > todayPoin && (
          <div className="mt-1.5 text-[12px] text-mu">Total semua: <b className="text-g">+{totalPoinSemua}p</b></div>
        )}
      </div>

      {/* FILTER */}
      <div className="scroll-chips -mx-3.5 mb-3 flex gap-2 px-3.5 pb-0.5">
        {KATEGORI.map((k) => (
          <button
            key={k.id}
            onClick={() => setFilter(k.id as FilterId)}
            className={`shrink-0 rounded-full border-[1.5px] px-4 py-2 text-[14px] font-semibold transition-all active:scale-95 ${
              filter === k.id
                ? "border-g bg-g text-white shadow-[0_2px_8px_rgba(13,79,60,0.22)]"
                : "border-[rgba(13,79,60,0.13)] bg-white text-mu"
            }`}
          >
            <span className="mr-1.5">{k.icon}</span>
            {k.label}
          </button>
        ))}
      </div>

      <div className="mb-3 text-[13px] text-mu">
        Ketuk kartu → buka bacaan · Ketuk ○ → tandai · <b>×N</b> → kelipatan
      </div>

      <div>
        {grouped.map((g) => {
          const doneInGroup = g.items.filter((s) => todaySurat.has(s.id)).length;
          const collapsed = collapsedGroups.has(g.key);
          return (
            <div key={g.key} className="mb-3">
              <button
                onClick={() => toggleGroup(g.key)}
                className="sticky top-0 z-10 -mx-3.5 flex w-[calc(100%+1.75rem)] items-center justify-between bg-bg/95 px-3.5 py-2.5 backdrop-blur-sm transition-colors active:bg-gp/50"
              >
                <div className="flex items-baseline gap-2">
                  <span className="text-[13px]">{g.icon}</span>
                  <span className="font-display text-[15px] font-bold tracking-wide text-dk uppercase">{g.label}</span>
                  <span className="text-[12px] text-mu">
                    {doneInGroup}/{g.items.length}
                  </span>
                </div>
                <span className="text-[15px] font-bold text-mu">{collapsed ? "▾" : "▴"}</span>
              </button>

              {!collapsed && (
                <div>
                  {g.items.map((s, i) => {
                    const done = todaySurat.has(s.id);
                    const det = todayDetail.get(s.id);
                    const cnt = det?.count ?? 1;
                    const earned = det?.poin ?? s.poin;
                    const isQuranItem = s.nomor != null || s.picker === true;
                    const isBacaanItem = !isQuranItem && hasBacaan(s.id);
                    const hasReader = isQuranItem || isBacaanItem;
                    const isOpen = expanded === s.id;
                    return (
                      <div
                        key={s.id}
                        className={`anim-rise relative mb-1.5 overflow-hidden rounded-xl border shadow-[0_2px_10px_rgba(13,79,60,0.07)] transition-all ${
                          done
                            ? "border-[rgba(45,143,111,0.18)] bg-gradient-to-br from-[#f0faf5] to-[#eaf6f0]"
                            : "border-transparent bg-white"
                        }`}
                        style={{ animationDelay: `${Math.min(i, 8) * 0.025}s` }}
                      >
                        {done && <span className="absolute top-0 bottom-0 left-0 w-[3px] bg-gradient-to-b from-au to-g3" />}

                        <div className="flex items-center gap-3 py-3 pr-3 pl-3.5">
                          <button
                            type="button"
                            onClick={() => onCardTap(s)}
                            className={`flex size-12 shrink-0 items-center justify-center rounded-xl border text-[16px] font-arab transition-all active:scale-95 ${
                              done
                                ? "border-transparent bg-gradient-to-br from-g to-g3 text-white"
                                : "border-[rgba(13,79,60,0.1)] bg-gp text-g"
                            }`}
                            aria-label={`Buka ${s.name}`}
                          >
                            {s.arabic}
                          </button>

                          <button
                            type="button"
                            onClick={() => onCardTap(s)}
                            className="min-w-0 flex-1 text-left active:opacity-70"
                          >
                            <div className="flex items-center gap-1.5">
                              <span className="truncate font-display text-[16px] leading-tight font-bold text-dk">
                                {s.name}
                              </span>
                              {done && cnt > 1 && (
                                <span className="rounded-full bg-au px-2 py-0.5 text-[11px] font-bold text-white">×{cnt}</span>
                              )}
                              {hasReader && <span className="text-[11px] text-g/70">›</span>}
                            </div>
                            <div className="mt-0.5 flex items-center gap-1.5 text-[12px] text-mu">
                              <span className="rounded-full bg-aup px-2 py-0.5 text-au font-semibold">
                                +{done ? earned : s.poin}p
                              </span>
                              <span>{s.ayat} {s.satuan ?? "ayat"}</span>
                              <span className="truncate opacity-70">· {s.tema}</span>
                            </div>
                          </button>

                          {/* Kelipatan / × button — lebih besar */}
                          <button
                            onClick={(e) => { e.stopPropagation(); openKelipatan(s); }}
                            title="Kelipatan / berapa kali baca"
                            aria-label="Kelipatan"
                            className="flex size-9 shrink-0 items-center justify-center rounded-full bg-aup text-[12px] font-bold text-au transition active:scale-90 hover:bg-aup/80"
                          >
                            ×N
                          </button>

                          {/* Check / Uncheck button — lebih besar (44px touch target) */}
                          <button
                            onClick={() => onCheck(s)}
                            disabled={busy === s.id}
                            title={done ? "Ketuk untuk batalkan centang" : "Tandai selesai"}
                            aria-label={done ? "Batalkan centang" : `Tandai ${s.name} selesai`}
                            className={`flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-full border-2 transition-all active:scale-90 ${
                              done
                                ? "border-transparent bg-gradient-to-br from-g to-g3 text-white shadow-[0_2px_8px_rgba(13,79,60,0.25)]"
                                : "border-[rgba(13,79,60,0.13)] bg-white text-mu disabled:cursor-wait disabled:opacity-50"
                            }`}
                          >
                            {busy === s.id ? (
                              <span className="text-[18px] animate-pulse">⋯</span>
                            ) : done ? (
                              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="20 6 9 17 4 12" />
                              </svg>
                            ) : (
                              <span className="text-[22px] leading-none">○</span>
                            )}
                          </button>
                        </div>

                        {isOpen && s.keutamaan && !hasReader && (
                          <div className="anim-expand mx-3 mb-3 rounded-xl border border-[rgba(13,79,60,0.08)] bg-gradient-to-br from-aup/40 to-white px-3.5 py-2.5">
                            <div className="mb-1 text-[11px] font-bold tracking-wider text-au uppercase">
                              ✨ Keutamaan
                            </div>
                            <div className="text-[14px] leading-relaxed text-tx italic">{s.keutamaan}</div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="py-11 text-center text-[14px] text-mu">Tidak ada amalan di kategori ini.</div>
        )}
      </div>

      {reader && (
        <QuranReader
          initialNomor={reader.nomor}
          pickerMode={reader.picker}
          onClose={() => setReader(null)}
        />
      )}

      {bacaanReader && (
        <BacaanReader
          amalanId={bacaanReader.id}
          arabic={bacaanReader.arabic}
          kategori={KATEGORI.find((k) => k.id === bacaanReader.kategori)?.label ?? ""}
          poin={bacaanReader.poin}
          satuan={bacaanReader.ayat + " " + (bacaanReader.satuan ?? "")}
          keutamaan={bacaanReader.keutamaan}
          onClose={() => setBacaanReader(null)}
        />
      )}

      {/* MODAL KELIPATAN */}
      {kelipatan && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/55 p-5"
          onClick={() => setKelipatan(null)}
        >
          <div
            className="w-full max-w-[380px] overflow-hidden rounded-2xl bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between gap-3 bg-gradient-to-br from-g to-g2 px-5 py-4 text-white">
              <div className="min-w-0">
                <div className="font-display text-[20px] font-bold">Berapa Kali Baca?</div>
                <div className="truncate text-[12px] text-white/70">
                  {kelipatan.surat.name} · {kelipatan.surat.poin} poin per 1×
                </div>
              </div>
              <button
                onClick={() => setKelipatan(null)}
                className="flex size-8 shrink-0 items-center justify-center rounded-full border border-white/25 bg-white/15 text-[13px] text-white"
                aria-label="Tutup"
              >
                ✕
              </button>
            </div>

            <div className="p-5">
              <div className="mb-4 grid grid-cols-3 gap-2">
                {[1, 3, 7, 10, 33, 100].map((q) => (
                  <button
                    key={q}
                    onClick={() => setKelipatan({ ...kelipatan, n: q })}
                    className="rounded-xl border-[1.5px] border-[rgba(13,79,60,0.13)] bg-bg py-2.5 text-[14px] font-bold text-g transition active:scale-95 hover:bg-g hover:text-white"
                  >
                    {q}×
                  </button>
                ))}
              </div>

              <div className="mb-3 flex items-center justify-center gap-2.5">
                <button
                  onClick={() => setKelipatan({ ...kelipatan, n: Math.max(1, kelipatan.n - 1) })}
                  className="flex size-11 items-center justify-center rounded-full bg-g text-[20px] font-bold text-white transition active:scale-95"
                >
                  −
                </button>
                <input
                  type="number"
                  min={1}
                  max={9999}
                  value={kelipatan.n}
                  onChange={(e) => setKelipatan({ ...kelipatan, n: Math.max(1, parseInt(e.target.value || "1")) })}
                  className="w-[120px] rounded-xl border-2 border-g3 bg-bg p-3 text-center font-display text-[28px] font-bold text-g outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                />
                <button
                  onClick={() => setKelipatan({ ...kelipatan, n: Math.min(9999, kelipatan.n + 1) })}
                  className="flex size-11 items-center justify-center rounded-full bg-g text-[20px] font-bold text-white transition active:scale-95"
                >
                  +
                </button>
              </div>

              <div className="mb-3 rounded-xl border border-au/30 bg-aup px-3 py-2.5 text-center text-[13px] font-semibold text-au">
                {kelipatan.surat.poin} × {kelipatan.n} = <b>+{kelipatan.surat.poin * kelipatan.n} poin</b>
              </div>

              <button
                onClick={saveKelipatan}
                className="w-full rounded-xl bg-gradient-to-br from-g to-g3 py-3 text-[14px] font-bold tracking-wide text-white uppercase shadow-md transition active:scale-[0.98]"
              >
                ✓ Simpan
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
