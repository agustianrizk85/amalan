import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { api, type Gender } from "@/lib/api";
import { useToast } from "@/lib/toast";

type Tab = "profile" | "password";

export default function EditProfilePage() {
  const { user, setUser } = useAuth();
  const nav = useNavigate();
  const fire = useToast();

  const [tab, setTab] = useState<Tab>("profile");

  // Profile fields
  const [name, setName] = useState(user?.name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [gender, setGender] = useState<Gender | "">(user?.gender ?? "");
  const [savingProfile, setSavingProfile] = useState(false);

  // Password fields
  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [savingPw, setSavingPw] = useState(false);

  useEffect(() => {
    if (!user) nav("/", { replace: true });
  }, [user, nav]);

  if (!user) return null;

  const profileDirty =
    name.trim() !== user.name ||
    (email.trim() || null) !== user.email ||
    (gender || null) !== (user.gender ?? null);
  const profileValid = name.trim().length >= 2;

  const saveProfile = async () => {
    if (name.trim().length < 2) return fire("⚠️ Nama minimal 2 karakter");
    setSavingProfile(true);
    try {
      // Gender opsional di edit. Hanya kirim ke backend kalau dipilih
      // dan berbeda dari sebelumnya (atau sebelumnya kosong).
      const payload: { name: string; email: string | null; gender?: Gender } = {
        name: name.trim(),
        email: email.trim() || null,
      };
      if (gender && gender !== (user.gender ?? "")) {
        payload.gender = gender as Gender;
      }
      const res = await api.updateProfile(payload);
      setUser(res.user);
      fire("✅ Profil tersimpan");
      nav("/profil");
    } catch (e) {
      fire(`⚠️ ${(e as Error).message}`);
    } finally {
      setSavingProfile(false);
    }
  };

  const savePassword = async () => {
    if (currentPw === "") return fire("⚠️ Isi password lama");
    if (newPw.length < 6) return fire("⚠️ Password baru minimal 6 karakter");
    if (newPw !== confirmPw) return fire("⚠️ Konfirmasi password baru tidak cocok");
    if (currentPw === newPw) return fire("⚠️ Password baru harus berbeda");

    setSavingPw(true);
    try {
      await api.changePassword({ current_password: currentPw, new_password: newPw });
      fire("✅ Password berhasil diubah");
      setCurrentPw("");
      setNewPw("");
      setConfirmPw("");
      // Session lain di-revoke server-side — sesi sekarang tetap valid.
      nav("/profil");
    } catch (e) {
      fire(`⚠️ ${(e as Error).message}`);
    } finally {
      setSavingPw(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg pb-24">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white border-b border-gp">
        <div className="max-w-md mx-auto px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => nav("/profil")}
            className="p-2 -ml-2 rounded-lg hover:bg-gp transition-colors"
            aria-label="Kembali"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          <div>
            <h1 className="text-base font-semibold text-tx leading-tight">Edit Profil</h1>
            <p className="text-[11px] text-mu">Perbarui data akun kamu</p>
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-5 space-y-4">
        {/* Tab switcher */}
        <div className="flex gap-1 rounded-lg bg-gp p-1">
          {(["profile", "password"] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={
                "flex-1 px-2 py-2 rounded-md text-[13px] font-medium transition-all " +
                (tab === t
                  ? "bg-g text-white shadow-[0_2px_8px_rgba(13,79,60,0.3)]"
                  : "bg-transparent text-mu")
              }
            >
              {t === "profile" ? "Data Diri" : "Ganti Password"}
            </button>
          ))}
        </div>

        {tab === "profile" && (
          <section className="rounded-2xl bg-white border border-gp p-5 space-y-4">
            <label className="block">
              <span className="text-[12px] font-medium text-tx">Nama</span>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nama lengkap"
                maxLength={100}
                className="mt-1 w-full px-3 py-2.5 rounded-lg border border-gp focus:border-g focus:ring-2 focus:ring-g/20 outline-none text-[14px] bg-bg"
              />
              <span className="mt-1 block text-[11px] text-mu">
                Ditampilkan di profil, leaderboard, dan komentar.
              </span>
            </label>

            <div>
              <div className="flex items-baseline justify-between mb-1.5">
                <span className="text-[12px] font-medium text-tx">Jenis Kelamin</span>
                <span className="text-[10px] text-mu">Opsional</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setGender("male")}
                  className={`flex items-center justify-center gap-2 rounded-lg border px-3 py-2.5 text-[13px] font-semibold transition-all ${
                    gender === "male"
                      ? "border-g bg-gp text-g"
                      : "border-gp bg-bg text-mu hover:border-mu"
                  }`}
                >
                  <span>👨</span>
                  <span>Laki-laki</span>
                </button>
                <button
                  type="button"
                  onClick={() => setGender("female")}
                  className={`flex items-center justify-center gap-2 rounded-lg border px-3 py-2.5 text-[13px] font-semibold transition-all ${
                    gender === "female"
                      ? "border-[#ec4899] bg-[#fdf2f8] text-[#ec4899]"
                      : "border-gp bg-bg text-mu hover:border-mu"
                  }`}
                >
                  <span>👩</span>
                  <span>Perempuan</span>
                </button>
              </div>
              <span className="mt-1 block text-[11px] text-mu">
                {user.gender === null
                  ? "Pilih jika ingin akses fitur catatan haid (khusus perempuan)."
                  : "Catatan haid hanya tersedia untuk akun perempuan."}
              </span>
            </div>

            <label className="block">
              <span className="text-[12px] font-medium text-tx">Email (opsional)</span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@contoh.com"
                maxLength={150}
                className="mt-1 w-full px-3 py-2.5 rounded-lg border border-gp focus:border-g focus:ring-2 focus:ring-g/20 outline-none text-[14px] bg-bg"
              />
              <span className="mt-1 block text-[11px] text-mu">
                Dipakai untuk login alternatif dan recovery. Kosongkan untuk
                hapus email dari akun.
              </span>
            </label>

            <div className="rounded-lg bg-gp px-3 py-2.5 text-[11px] text-mu leading-relaxed">
              <strong>Catatan:</strong> Password, kode referral, dan total poin
              tidak bisa diubah di sini. Ganti password di tab sebelah.
            </div>

            <button
              onClick={saveProfile}
              disabled={!profileDirty || !profileValid || savingProfile}
              className="w-full px-4 py-3 rounded-xl bg-g text-white font-semibold shadow-lg hover:bg-g2 active:bg-dk transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {savingProfile ? "Menyimpan..." : profileDirty ? "Simpan Perubahan" : "Tidak ada perubahan"}
            </button>
          </section>
        )}

        {tab === "password" && (
          <section className="rounded-2xl bg-white border border-gp p-5 space-y-4">
            <PasswordField
              label="Password Lama"
              value={currentPw}
              onChange={setCurrentPw}
              show={showCurrent}
              onToggle={() => setShowCurrent((v) => !v)}
              placeholder="Password saat ini"
            />
            <PasswordField
              label="Password Baru"
              value={newPw}
              onChange={setNewPw}
              show={showNew}
              onToggle={() => setShowNew((v) => !v)}
              placeholder="Minimal 6 karakter"
              hint="Kombinasikan huruf, angka, dan simbol untuk keamanan."
            />
            <PasswordField
              label="Konfirmasi Password Baru"
              value={confirmPw}
              onChange={setConfirmPw}
              show={showNew}
              onToggle={() => setShowNew((v) => !v)}
              placeholder="Ulangi password baru"
            />

            <div className="rounded-lg bg-aup border border-aul/40 px-3 py-2.5 text-[11px] text-tx leading-relaxed">
              <strong>Keamanan:</strong> Mengganti password akan otomatis
              logout sesi di perangkat lain. Sesi yang sedang kamu pakai tetap
              aktif.
            </div>

            <button
              onClick={savePassword}
              disabled={savingPw}
              className="w-full px-4 py-3 rounded-xl bg-g text-white font-semibold shadow-lg hover:bg-g2 active:bg-dk transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {savingPw ? "Menyimpan..." : "Ganti Password"}
            </button>
          </section>
        )}
      </main>
    </div>
  );
}

function PasswordField({
  label,
  value,
  onChange,
  show,
  onToggle,
  placeholder,
  hint,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  show: boolean;
  onToggle: () => void;
  placeholder: string;
  hint?: string;
}) {
  return (
    <label className="block">
      <span className="text-[12px] font-medium text-tx">{label}</span>
      <div className="relative mt-1">
        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          autoComplete="off"
          className="w-full px-3 py-2.5 pr-10 rounded-lg border border-gp focus:border-g focus:ring-2 focus:ring-g/20 outline-none text-[14px] bg-bg"
        />
        <button
          type="button"
          onClick={onToggle}
          aria-label={show ? "Sembunyikan password" : "Tampilkan password"}
          className="absolute right-1 top-1/2 -translate-y-1/2 p-2 text-mu hover:text-tx"
        >
          {show ? (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
              <line x1="1" y1="1" x2="23" y2="23" />
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          )}
        </button>
      </div>
      {hint && <span className="mt-1 block text-[11px] text-mu">{hint}</span>}
    </label>
  );
}
