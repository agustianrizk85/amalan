import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api, type PuasaItem, type PuasaJenis, type PuasaStatus } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { useToast } from "@/lib/toast";

const JENIS_LIST: { id: PuasaJenis; label: string; emoji: string; poin: number; desc: string }[] = [
  { id: "ramadan",      label: "Ramadan",       emoji: "🌙",  poin: 25, desc: "Puasa wajib bulan Ramadan" },
  { id: "arafah",       label: "Arafah",        emoji: "🕋",  poin: 20, desc: "9 Dzulhijjah, hapus 2 tahun dosa" },
  { id: "asyura",       label: "Asyura",        emoji: "💎",  poin: 15, desc: "10 Muharram, hapus 1 tahun dosa" },
  { id: "syawal",       label: "6 Syawal",      emoji: "✨",  poin: 15, desc: "6 hari setelah Idul Fitri" },
  { id: "ayyamul_bidh", label: "Ayyamul Bidh",  emoji: "🌕",  poin: 12, desc: "13, 14, 15 bulan Hijriah" },
  { id: "daud",         label: "Daud",          emoji: "👑",  poin: 12, desc: "Sehari puasa sehari tidak" },
  { id: "senin",        label: "Senin",         emoji: "📿",  poin: 10, desc: "Hari diangkatnya amal" },
  { id: "kamis",        label: "Kamis",         emoji: "📿",  poin: 10, desc: "Hari diangkatnya amal" },
  { id: "sunnah_lain",  label: "Sunnah Lain",   emoji: "🤲",  poin: 8,  desc: "Puasa sunnah lainnya" },
];

const STATUS_LIST: { id: PuasaStatus; label: string; emoji: string; color: string }[] = [
  { id: "penuh", label: "Penuh", emoji: "✅", color: "bg-g text-white" },
  { id: "batal", label: "Batal", emoji: "❌", color: "bg-[#dc3545] text-white" },
  { id: "uzur",  label: "Uzur",  emoji: "🤲", color: "bg-mu text-white" },
];

function todayIso() { return new Date().toISOString().slice(0, 10); }
function currentMonth() { return new Date().toISOString().slice(0, 7); }

function fmtMonth(yyyymm: string): string {
  const [y, m] = yyyymm.split("-").map(Number);
  return new Date(y, m - 1, 1).toLocaleDateString("id-ID", { month: "long", year: "numeric" });
}

function fmtDateShort(iso: string): string {
  return new Date(iso).toLocaleDateString("id-ID", { day: "numeric", month: "short" });
}

function addMonth(yyyymm: string, n: number): string {
  const [y, m] = yyyymm.split("-").map(Number);
  const d = new Date(y, m - 1 + n, 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

export default function PuasaPage() {
  const nav = useNavigate();
  const fire = useToast();
  const { refresh } = useAuth();
  const [month, setMonth] = useState(currentMonth());
  const [items, setItems] = useState<PuasaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formTanggal, setFormTanggal] = useState(todayIso());
  const [formJenis, setFormJenis] = useState<PuasaJenis>("senin");
  const [formStatus, setFormStatus] = useState<PuasaStatus>("penuh");
  const [saving, setSaving] = useState(false);

  const load = async (m: string) => {
    setLoading(true);
    try {
      const r = await api.getPuasa(m);
      setItems(r.data);
    } catch (e) {
      fire(`⚠️ ${(e as Error).message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { void load(month); }, [month]);

  const summary = useMemo(() => {
    const penuh = items.filter((i) => i.status === "penuh").length;
    const totalPoin = items.reduce((s, i) => s + i.poin, 0);
    return { penuh, totalPoin };
  }, [items]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.catatPuasa({
        tanggal: formTanggal,
        jenis: formJenis,
        status: formStatus,
      });
      setShowForm(false);
      setFormTanggal(todayIso());
      setFormJenis("senin");
      setFormStatus("penuh");
      await load(month);
      await refresh();
      fire(`${JENIS_LIST.find((j) => j.id === formJenis)?.emoji ?? "✅"} Puasa dicatat`);
    } catch (e) {
      fire(`⚠️ ${(e as Error).message}`);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (tanggal: string) => {
    if (!confirm("Hapus catatan puasa ini?")) return;
    try {
      await api.hapusPuasa(tanggal);
      await load(month);
      await refresh();
    } catch (e) {
      fire(`⚠️ ${(e as Error).message}`);
    }
  };

  return (
    <div className="min-h-screen bg-bg pb-24">
      <header className="sticky top-0 z-10 bg-white border-b border-gp">
        <div className="max-w-md mx-auto px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => nav("/beranda")}
            className="p-2 -ml-2 rounded-lg hover:bg-gp transition-colors"
            aria-label="Kembali"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          <div>
            <h1 className="text-base font-semibold text-tx leading-tight">Puasa</h1>
            <p className="text-[11px] text-mu">Wajib (Ramadan) & Sunnah</p>
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-4 space-y-4">
        {/* Month selector */}
        <div className="flex items-center justify-between gap-2 rounded-2xl bg-white border border-gp p-3">
          <button onClick={() => setMonth(addMonth(month, -1))} className="p-2 rounded-lg hover:bg-gp text-mu" aria-label="Bulan sebelumnya">←</button>
          <div className="flex-1 text-center">
            <p className="text-[10px] uppercase tracking-wider text-mu">Bulan</p>
            <p className="text-[14px] font-semibold text-tx capitalize">{fmtMonth(month)}</p>
          </div>
          <button
            onClick={() => setMonth(addMonth(month, 1))}
            disabled={month >= currentMonth()}
            className="p-2 rounded-lg hover:bg-gp text-mu disabled:opacity-30"
            aria-label="Bulan berikutnya"
          >
            →
          </button>
        </div>

        {/* Summary */}
        <div className="rounded-2xl bg-gradient-to-br from-g to-g3 p-4 text-white">
          <div className="flex items-baseline justify-between">
            <div>
              <p className="text-[11px] uppercase tracking-wider text-white/70">Puasa Penuh</p>
              <p className="font-display text-3xl font-bold">{summary.penuh} hari</p>
            </div>
            <div className="text-right">
              <p className="text-[11px] uppercase tracking-wider text-white/70">Total Poin</p>
              <p className="font-display text-2xl font-bold text-aul">+{summary.totalPoin}</p>
            </div>
          </div>
        </div>

        {/* Add button / form */}
        {!showForm ? (
          <button
            onClick={() => setShowForm(true)}
            className="w-full rounded-2xl border-2 border-dashed border-gp bg-white p-4 text-center hover:border-g transition-all"
          >
            <p className="text-2xl">🌙+</p>
            <p className="text-[14px] font-semibold text-g mt-1">Catat Puasa</p>
          </button>
        ) : (
          <div className="rounded-2xl bg-white border border-gp p-4 space-y-3">
            <div className="flex items-center justify-between">
              <p className="font-semibold text-tx">Catat Puasa</p>
              <button onClick={() => setShowForm(false)} className="text-mu text-xl leading-none">×</button>
            </div>

            <label className="block">
              <span className="text-[12px] font-medium text-tx">Tanggal</span>
              <input
                type="date"
                value={formTanggal}
                onChange={(e) => setFormTanggal(e.target.value)}
                max={todayIso()}
                className="mt-1 w-full px-3 py-2.5 rounded-lg border border-gp focus:border-g outline-none text-[14px] bg-bg"
              />
            </label>

            <div>
              <span className="text-[12px] font-medium text-tx block mb-2">Jenis Puasa</span>
              <div className="grid grid-cols-2 gap-2">
                {JENIS_LIST.map((j) => {
                  const active = formJenis === j.id;
                  return (
                    <button
                      key={j.id}
                      onClick={() => setFormJenis(j.id)}
                      className={`flex items-center gap-2 rounded-xl border-2 px-2 py-2 text-left transition-all ${
                        active ? "border-g bg-gp" : "border-gp bg-white hover:border-mu"
                      }`}
                    >
                      <span className="text-lg">{j.emoji}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-[12px] font-semibold text-tx truncate">{j.label}</p>
                        <p className="text-[10px] text-mu">+{j.poin}p</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <span className="text-[12px] font-medium text-tx block mb-2">Status</span>
              <div className="grid grid-cols-3 gap-2">
                {STATUS_LIST.map((s) => {
                  const active = formStatus === s.id;
                  return (
                    <button
                      key={s.id}
                      onClick={() => setFormStatus(s.id)}
                      className={`flex flex-col items-center justify-center rounded-xl border-2 py-2.5 transition-all ${
                        active ? s.color : "bg-white text-tx border-gp hover:border-mu"
                      }`}
                    >
                      <span className="text-lg">{s.emoji}</span>
                      <span className="text-[11px] font-semibold">{s.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              onClick={handleSave}
              disabled={saving}
              className="w-full px-4 py-3 rounded-xl bg-g text-white font-semibold disabled:opacity-50"
            >
              {saving ? "Menyimpan..." : "Simpan"}
            </button>
          </div>
        )}

        {/* History */}
        <div>
          <p className="text-[11px] uppercase tracking-wider text-mu mb-2 px-1">Riwayat Bulan Ini</p>
          {loading ? (
            <p className="text-center text-[12px] text-mu py-6">Memuat...</p>
          ) : items.length === 0 ? (
            <div className="rounded-xl border border-dashed border-gp bg-white p-6 text-center">
              <p className="text-3xl">🌙</p>
              <p className="text-[13px] font-medium text-tx mt-2">Belum ada catatan</p>
              <p className="text-[11px] text-mu mt-0.5">Mulai catat puasamu di atas</p>
            </div>
          ) : (
            <div className="space-y-2">
              {items.map((it) => {
                const jenis = JENIS_LIST.find((j) => j.id === it.jenis);
                const status = STATUS_LIST.find((s) => s.id === it.status);
                return (
                  <div key={it.tanggal} className="rounded-xl bg-white border border-gp p-3">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className="grid place-items-center size-10 rounded-xl bg-gp text-lg">
                          {jenis?.emoji ?? "🌙"}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[13px] font-semibold text-tx">{jenis?.label}</p>
                          <p className="text-[11px] text-mu">{fmtDateShort(it.tanggal)} · +{it.poin}p</p>
                        </div>
                      </div>
                      <span className={`shrink-0 text-[11px] font-semibold px-2 py-1 rounded-full ${status?.color}`}>
                        {status?.label}
                      </span>
                      <button
                        onClick={() => handleDelete(it.tanggal)}
                        className="shrink-0 text-mu hover:text-[#dc3545] p-1"
                        aria-label="Hapus"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
