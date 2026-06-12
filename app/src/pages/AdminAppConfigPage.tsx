import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGoBack } from "@/lib/use-back-trap";
import { useAuth } from "@/lib/auth";
import { api, type AppConfig } from "@/lib/api";
import { useToast } from "@/lib/toast";
import { useAppConfig } from "@/lib/app-config";

const EMPTY: AppConfig = {
  meta_pixel_id: "",
  whatsapp_group_url: "",
  whatsapp_group_label: "Gabung Grup WhatsApp Amalan",
  cs_whatsapp_number: "",
  cs_name: "Admin Amalan",
  cs_label: "Chat Admin via WhatsApp",
  contact_enabled: "1",
};

export default function AdminAppConfigPage() {
  const { user } = useAuth();
  const nav = useNavigate();
  const goBack = useGoBack("/profil");
  const fire = useToast();
  const { refresh } = useAppConfig();

  const [form, setForm] = useState<AppConfig>(EMPTY);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) return;
    if (user.role !== "admin") {
      fire("Akses ditolak - hanya admin");
      nav("/profil", { replace: true });
      return;
    }
    let alive = true;
    api
      .getAppConfig()
      .then((r) => alive && setForm({ ...EMPTY, ...r.data }))
      .catch((e: Error) => alive && fire(`Gagal load config: ${e.message}`))
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, [user, nav, fire]);

  const update = <K extends keyof AppConfig>(key: K, val: AppConfig[K]) => {
    setForm((s) => ({ ...s, [key]: val }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.adminUpdateAppConfig(form);
      await refresh();
      fire("Pengaturan tersimpan");
    } catch (e) {
      fire(`Gagal simpan: ${(e as Error).message}`);
    } finally {
      setSaving(false);
    }
  };

  // Helpers
  const previewCsLink = (() => {
    const num = form.cs_whatsapp_number.replace(/[^0-9]/g, "");
    if (!num) return null;
    return `https://wa.me/${num}`;
  })();

  if (loading) {
    return (
      <div className="grid min-h-screen place-items-center bg-bg text-[14px] text-mu">
        Memuat pengaturan...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg pb-24">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white border-b border-gp">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          <button
            onClick={goBack}
            className="p-2 -ml-2 rounded-lg hover:bg-gp transition-colors"
            aria-label="Kembali"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          <div>
            <h1 className="text-base font-semibold text-tx leading-tight">Konfigurasi Aplikasi</h1>
            <p className="text-[11px] text-mu">Pixel, WhatsApp, dan CS Admin</p>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        {/* Info banner */}
        <div className="rounded-xl bg-aup border border-aul/40 p-4 text-[13px] text-tx leading-relaxed">
          <p className="font-medium mb-1">Halaman khusus Admin</p>
          <p className="text-mu">
            Pengaturan di sini berlaku <strong>real-time untuk semua pengguna</strong>.
            Tracking Meta Pixel akan otomatis aktif begitu ID diisi, dan tombol kontak akan
            muncul saat link WhatsApp diisi.
          </p>
        </div>

        {/* Section 1: Meta Pixel */}
        <section className="rounded-2xl bg-white border border-gp p-5">
          <div className="flex items-start justify-between gap-3 mb-3">
            <div>
              <h2 className="text-sm font-semibold text-tx">Meta (Facebook) Pixel</h2>
              <p className="text-[11px] text-mu mt-0.5">
                Lacak konversi pendaftaran dari iklan Facebook / Instagram.
              </p>
            </div>
            <span
              className={
                "text-[10px] font-semibold px-2 py-0.5 rounded-full " +
                (form.meta_pixel_id ? "bg-g/10 text-g" : "bg-mu/10 text-mu")
              }
            >
              {form.meta_pixel_id ? "AKTIF" : "Belum di-set"}
            </span>
          </div>
          <label className="block">
            <span className="text-[12px] font-medium text-tx">Pixel ID</span>
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              value={form.meta_pixel_id}
              onChange={(e) => update("meta_pixel_id", e.target.value.replace(/[^0-9]/g, ""))}
              placeholder="contoh: 1234567890123456"
              className="mt-1 w-full px-3 py-2.5 rounded-lg border border-gp focus:border-g focus:ring-2 focus:ring-g/20 outline-none text-[14px] bg-bg"
            />
            <span className="mt-1 block text-[11px] text-mu">
              Cari di Meta Events Manager - Data Sources. Hanya angka, tanpa karakter lain.
              Kosongkan untuk nonaktifkan.
            </span>
          </label>
          <details className="mt-3 text-[11px] text-mu">
            <summary className="cursor-pointer text-g hover:underline select-none">
              Event yang dilacak otomatis
            </summary>
            <ul className="mt-2 list-disc pl-5 space-y-1">
              <li><code>PageView</code> - setiap kali halaman dibuka</li>
              <li><code>CompleteRegistration</code> - saat user berhasil daftar baru</li>
              <li><code>Login</code> - saat user login (custom event)</li>
              <li><code>Contact</code> - saat user klik tombol kontak / CS</li>
            </ul>
          </details>
        </section>

        {/* Section 2: WhatsApp Group */}
        <section className="rounded-2xl bg-white border border-gp p-5">
          <div className="flex items-start justify-between gap-3 mb-3">
            <div>
              <h2 className="text-sm font-semibold text-tx">Grup WhatsApp Komunitas</h2>
              <p className="text-[11px] text-mu mt-0.5">
                Link invite grup. Bisa diganti kapan saja tanpa update aplikasi.
              </p>
            </div>
            <span
              className={
                "text-[10px] font-semibold px-2 py-0.5 rounded-full " +
                (form.whatsapp_group_url ? "bg-g/10 text-g" : "bg-mu/10 text-mu")
              }
            >
              {form.whatsapp_group_url ? "AKTIF" : "Belum di-set"}
            </span>
          </div>
          <div className="space-y-3">
            <label className="block">
              <span className="text-[12px] font-medium text-tx">URL Invite</span>
              <input
                type="url"
                value={form.whatsapp_group_url}
                onChange={(e) => update("whatsapp_group_url", e.target.value)}
                placeholder="https://chat.whatsapp.com/XXXXXXXXXXXXXXXXXXXXXXXX"
                className="mt-1 w-full px-3 py-2.5 rounded-lg border border-gp focus:border-g focus:ring-2 focus:ring-g/20 outline-none text-[14px] bg-bg"
              />
              <span className="mt-1 block text-[11px] text-mu">
                Buka WhatsApp Web - grup - Setelan Grup - Tautan Undangan. Wajib diawali https://.
              </span>
            </label>
            <label className="block">
              <span className="text-[12px] font-medium text-tx">Label Tombol</span>
              <input
                type="text"
                value={form.whatsapp_group_label}
                onChange={(e) => update("whatsapp_group_label", e.target.value)}
                placeholder="Gabung Grup WhatsApp Amalan"
                maxLength={80}
                className="mt-1 w-full px-3 py-2.5 rounded-lg border border-gp focus:border-g focus:ring-2 focus:ring-g/20 outline-none text-[14px] bg-bg"
              />
            </label>
          </div>
        </section>

        {/* Section 3: CS Admin */}
        <section className="rounded-2xl bg-white border border-gp p-5">
          <div className="flex items-start justify-between gap-3 mb-3">
            <div>
              <h2 className="text-sm font-semibold text-tx">CS / Admin Konsultasi</h2>
              <p className="text-[11px] text-mu mt-0.5">
                Kontak WhatsApp untuk user yang butuh bantuan atau kendala penggunaan.
              </p>
            </div>
            <span
              className={
                "text-[10px] font-semibold px-2 py-0.5 rounded-full " +
                (form.cs_whatsapp_number ? "bg-g/10 text-g" : "bg-mu/10 text-mu")
              }
            >
              {form.cs_whatsapp_number ? "AKTIF" : "Belum di-set"}
            </span>
          </div>
          <div className="space-y-3">
            <label className="block">
              <span className="text-[12px] font-medium text-tx">Nomor WhatsApp</span>
              <input
                type="tel"
                inputMode="numeric"
                value={form.cs_whatsapp_number}
                onChange={(e) => update("cs_whatsapp_number", e.target.value.replace(/[^0-9]/g, ""))}
                placeholder="6281234567890 (format internasional, tanpa +)"
                className="mt-1 w-full px-3 py-2.5 rounded-lg border border-gp focus:border-g focus:ring-2 focus:ring-g/20 outline-none text-[14px] bg-bg"
              />
              <span className="mt-1 block text-[11px] text-mu">
                Pakai kode negara di depan. Contoh Indonesia: 62 + nomor tanpa nol awal.
                {previewCsLink && (
                  <>
                    {" "}Preview: <a href={previewCsLink} target="_blank" rel="noopener noreferrer" className="text-g underline">{previewCsLink}</a>
                  </>
                )}
              </span>
            </label>
            <label className="block">
              <span className="text-[12px] font-medium text-tx">Nama CS / Admin</span>
              <input
                type="text"
                value={form.cs_name}
                onChange={(e) => update("cs_name", e.target.value)}
                placeholder="Admin Amalan"
                maxLength={80}
                className="mt-1 w-full px-3 py-2.5 rounded-lg border border-gp focus:border-g focus:ring-2 focus:ring-g/20 outline-none text-[14px] bg-bg"
              />
            </label>
            <label className="block">
              <span className="text-[12px] font-medium text-tx">Label Tombol</span>
              <input
                type="text"
                value={form.cs_label}
                onChange={(e) => update("cs_label", e.target.value)}
                placeholder="Chat Admin via WhatsApp"
                maxLength={80}
                className="mt-1 w-full px-3 py-2.5 rounded-lg border border-gp focus:border-g focus:ring-2 focus:ring-g/20 outline-none text-[14px] bg-bg"
              />
            </label>
          </div>
        </section>

        {/* Section 4: Master toggle */}
        <section className="rounded-2xl bg-white border border-gp p-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-semibold text-tx">Tombol Kontak (global)</h2>
              <p className="text-[11px] text-mu mt-0.5">
                Matikan untuk menyembunyikan tombol kontak floating di semua halaman.
              </p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={form.contact_enabled === "1"}
              onClick={() => update("contact_enabled", form.contact_enabled === "1" ? "0" : "1")}
              className={
                "relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full transition-colors " +
                (form.contact_enabled === "1" ? "bg-g" : "bg-mu/30")
              }
            >
              <span
                className={
                  "inline-block h-5 w-5 rounded-full bg-white shadow translate-y-1 transition-transform " +
                  (form.contact_enabled === "1" ? "translate-x-6" : "translate-x-1")
                }
              />
            </button>
          </div>
        </section>

        {/* Action bar */}
        <div className="sticky bottom-4 z-10">
          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full px-4 py-3 rounded-xl bg-g text-white font-semibold shadow-lg hover:bg-g2 active:bg-dk transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {saving ? "Menyimpan..." : "Simpan Pengaturan"}
          </button>
        </div>
      </main>
    </div>
  );
}
