import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api, type HaidPeriod } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { useToast } from "@/lib/toast";

function todayIso() { return new Date().toISOString().slice(0, 10); }

function fmtDateShort(iso: string | null): string {
  if (!iso) return "—";
  const d = new Date(iso);
  return d.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
}

function fmtDateLong(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("id-ID", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  });
}

export default function HaidPage() {
  const nav = useNavigate();
  const fire = useToast();
  const { user } = useAuth();
  const [periods, setPeriods] = useState<HaidPeriod[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formDate, setFormDate] = useState(todayIso());
  const [formCatatan, setFormCatatan] = useState("");
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const r = await api.getHaid();
      setPeriods(r.data);
    } catch (e) {
      fire(`⚠️ ${(e as Error).message}`);
    } finally {
      setLoading(false);
    }
  };

  // Gate: kalau user bukan perempuan, redirect ke beranda dengan pesan.
  useEffect(() => {
    if (user && user.gender !== "female") {
      fire("⚠️ Fitur catatan haid hanya untuk pengguna perempuan");
      nav("/beranda", { replace: true });
    }
  }, [user, nav, fire]);

  useEffect(() => {
    if (user?.gender === "female") void load();
  }, [user]);

  const handleMulai = async () => {
    setSaving(true);
    try {
      await api.mulaiHaid({
        tanggal_mulai: formDate,
        catatan: formCatatan.trim() || undefined,
      });
      setShowForm(false);
      setFormCatatan("");
      setFormDate(todayIso());
      await load();
      fire("🌸 Periode haid dicatat");
    } catch (e) {
      fire(`⚠️ ${(e as Error).message}`);
    } finally {
      setSaving(false);
    }
  };

  const handleSelesai = async (tanggal?: string) => {
    if (!confirm("Tandai haid sudah selesai?")) return;
    setSaving(true);
    try {
      await api.selesaiHaid({ tanggal_selesai: tanggal ?? todayIso() });
      await load();
      fire("✅ Periode haid selesai");
    } catch (e) {
      fire(`⚠️ ${(e as Error).message}`);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Hapus periode ini? Tidak bisa dikembalikan.")) return;
    setSaving(true);
    try {
      await api.hapusHaid(id);
      await load();
      fire("🗑️ Periode dihapus");
    } catch (e) {
      fire(`⚠️ ${(e as Error).message}`);
    } finally {
      setSaving(false);
    }
  };

  // Hitung rata-rata siklus & durasi
  const stats = (() => {
    const finished = periods.filter((p) => p.tanggal_selesai !== null);
    if (finished.length === 0) return { avgDurasi: 0, avgSiklus: 0 };
    const avgDurasi = Math.round(
      finished.reduce((s, p) => s + p.durasi_hari, 0) / finished.length,
    );
    let siklusSum = 0, siklusCount = 0;
    for (let i = 0; i < finished.length - 1; i++) {
      const a = new Date(finished[i].tanggal_mulai);
      const b = new Date(finished[i + 1].tanggal_mulai);
      const diff = Math.abs((a.getTime() - b.getTime()) / 86400000);
      siklusSum += diff;
      siklusCount++;
    }
    return {
      avgDurasi,
      avgSiklus: siklusCount > 0 ? Math.round(siklusSum / siklusCount) : 0,
    };
  })();

  const active = periods.find((p) => p.active);

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
            <h1 className="text-base font-semibold text-tx leading-tight">Catatan Haid</h1>
            <p className="text-[11px] text-mu">Riwayat & status periode</p>
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-4 space-y-4">
        {/* Active period card */}
        {active && (
          <div className="rounded-2xl bg-gradient-to-br from-[#fb7185] to-[#ec4899] p-4 text-white">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xl">🌸</span>
              <p className="text-sm font-semibold">Sedang Haid</p>
            </div>
            <p className="font-display text-3xl font-bold">
              Hari ke-{active.durasi_hari}
            </p>
            <p className="text-[12px] text-white/85 mt-0.5">
              Mulai {fmtDateShort(active.tanggal_mulai)}
            </p>
            <button
              onClick={() => handleSelesai()}
              disabled={saving}
              className="mt-3 w-full px-4 py-2.5 rounded-xl bg-white text-[#ec4899] font-semibold text-[13px] hover:bg-white/90 disabled:opacity-60"
            >
              Tandai Sudah Selesai
            </button>
          </div>
        )}

        {/* Action: mulai baru */}
        {!active && !showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="w-full rounded-2xl border-2 border-dashed border-[#fbcfe8] bg-[#fdf2f8] p-5 text-center hover:border-[#f9a8d4] transition-all"
          >
            <p className="text-2xl mb-1">🌸+</p>
            <p className="text-[14px] font-semibold text-[#831843]">Mulai Periode Baru</p>
            <p className="text-[11px] text-[#9d174d] mt-1">Catat hari pertama haid</p>
          </button>
        )}

        {/* Form mulai */}
        {!active && showForm && (
          <div className="rounded-2xl bg-white border border-gp p-4 space-y-3">
            <div className="flex items-center justify-between">
              <p className="font-semibold text-tx">Mulai Periode Baru</p>
              <button onClick={() => setShowForm(false)} className="text-mu text-xl leading-none">×</button>
            </div>
            <label className="block">
              <span className="text-[12px] font-medium text-tx">Tanggal Mulai</span>
              <input
                type="date"
                value={formDate}
                onChange={(e) => setFormDate(e.target.value)}
                max={todayIso()}
                className="mt-1 w-full px-3 py-2.5 rounded-lg border border-gp focus:border-g focus:ring-2 focus:ring-g/20 outline-none text-[14px] bg-bg"
              />
            </label>
            <label className="block">
              <span className="text-[12px] font-medium text-tx">Catatan (opsional)</span>
              <textarea
                value={formCatatan}
                onChange={(e) => setFormCatatan(e.target.value)}
                placeholder="Mis. nyeri ringan, mood, dll"
                maxLength={250}
                rows={2}
                className="mt-1 w-full px-3 py-2.5 rounded-lg border border-gp focus:border-g focus:ring-2 focus:ring-g/20 outline-none text-[14px] bg-bg resize-none"
              />
            </label>
            <button
              onClick={handleMulai}
              disabled={saving}
              className="w-full px-4 py-3 rounded-xl bg-[#ec4899] text-white font-semibold disabled:opacity-50"
            >
              {saving ? "Menyimpan..." : "Mulai"}
            </button>
          </div>
        )}

        {/* Stats */}
        {stats.avgDurasi > 0 && (
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-white border border-gp p-3">
              <p className="text-[10px] uppercase tracking-wider text-mu">Rata-rata Durasi</p>
              <p className="font-display text-xl font-bold text-tx">{stats.avgDurasi} hari</p>
            </div>
            <div className="rounded-xl bg-white border border-gp p-3">
              <p className="text-[10px] uppercase tracking-wider text-mu">Rata-rata Siklus</p>
              <p className="font-display text-xl font-bold text-tx">
                {stats.avgSiklus > 0 ? `${stats.avgSiklus} hari` : "—"}
              </p>
            </div>
          </div>
        )}

        {/* History */}
        <div>
          <p className="text-[11px] uppercase tracking-wider text-mu mb-2 px-1">Riwayat</p>
          {loading ? (
            <p className="text-center text-[12px] text-mu py-6">Memuat...</p>
          ) : periods.length === 0 ? (
            <div className="rounded-xl border border-dashed border-gp bg-white p-6 text-center">
              <p className="text-3xl">📋</p>
              <p className="text-[13px] font-medium text-tx mt-2">Belum ada catatan</p>
              <p className="text-[11px] text-mu mt-0.5">Catatan akan muncul di sini</p>
            </div>
          ) : (
            <div className="space-y-2">
              {periods.map((p) => (
                <div
                  key={p.id}
                  className={`rounded-xl bg-white border p-3 ${p.active ? "border-[#fbcfe8] bg-[#fdf2f8]" : "border-gp"}`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm">🌸</span>
                        <p className="text-[13px] font-semibold text-tx">
                          {fmtDateLong(p.tanggal_mulai)}
                        </p>
                      </div>
                      <p className="text-[11px] text-mu mt-0.5">
                        Selesai: {fmtDateShort(p.tanggal_selesai)} · {p.durasi_hari} hari
                      </p>
                      {p.catatan && (
                        <p className="text-[11px] text-tx mt-1 bg-gp rounded px-2 py-1">
                          {p.catatan}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => handleDelete(p.id)}
                      disabled={saving}
                      className="shrink-0 text-mu hover:text-[#dc3545] p-1 disabled:opacity-50"
                      aria-label="Hapus"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="rounded-xl bg-aup border border-aul/40 p-3 text-[11px] text-tx leading-relaxed">
          <p className="font-semibold mb-1">ℹ️ Tentang Tracker Ini</p>
          <p className="text-mu">
            Catatan haid bersifat <strong>private</strong> — hanya kamu yang bisa lihat.
            Saat periode aktif, halaman Sholat akan menyarankan tandai 'Uzur' otomatis.
            Tracker juga menghitung rata-rata siklus dari riwayatmu.
          </p>
        </div>
      </main>
    </div>
  );
}
