import { useEffect, useState, type KeyboardEvent } from "react";
import { useNavigate } from "react-router-dom";
import { api, setToken, type Gender } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { useToast } from "@/lib/toast";
import { trackPixelEvent, useAppConfig } from "@/lib/app-config";

type Mode = "login" | "register";

export default function AuthPage() {
  const [mode, setMode] = useState<Mode>("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [gender, setGender] = useState<Gender | "">("");
  const [referralCode, setReferralCode] = useState("");
  const [busy, setBusy] = useState(false);
  const fire = useToast();
  const { refresh } = useAuth();
  const nav = useNavigate();
  const { config } = useAppConfig();

  // Link "Lupa password" → arahkan user chat admin/CS via WhatsApp supaya admin
  // bisa reset password-nya (password lama tak bisa dilihat karena ter-hash).
  const forgotPasswordLink = (() => {
    const num = (config.cs_whatsapp_number || "").replace(/[^0-9]/g, "");
    if (!num) return null;
    const who = name.trim() ? ` Nama akun saya: ${name.trim()}.` : "";
    const msg = `Halo ${config.cs_name || "Admin"}, saya lupa password akun Amalan saya.${who} Mohon dibantu reset. Terima kasih 🙏`;
    return `https://wa.me/${num}?text=${encodeURIComponent(msg)}`;
  })();

  // Auto-prefill referral code dari URL (?ref=KODE) atau localStorage.
  // main.tsx sudah memindahkan ref ke localStorage sebelum router mount,
  // jadi sumber primernya localStorage. URL hanya fallback (jika main.tsx skip).
  useEffect(() => {
    let ref = "";
    try {
      ref = localStorage.getItem("amalan_ref") ?? "";
    } catch {
      ref = "";
    }
    if (!ref) {
      const params = new URLSearchParams(window.location.search);
      ref = params.get("ref") ?? "";
    }
    if (ref.trim()) {
      setReferralCode(ref.trim().toUpperCase());
      setMode("register"); // Auto-switch ke tab Daftar
    }
  }, []);

  const submit = async () => {
    if (busy) return;
    if (mode === "register") {
      if (!name.trim()) return fire("⚠️ Masukkan nama terlebih dahulu");
      if (!gender) return fire("⚠️ Pilih jenis kelamin");
      if (password.length < 6) return fire("⚠️ Password minimal 6 karakter");
      if (password !== confirm) return fire("⚠️ Konfirmasi password tidak cocok");
    } else {
      if (!name.trim() && !email.trim()) return fire("⚠️ Isi nama atau email");
      if (!password) return fire("⚠️ Masukkan password");
    }

    setBusy(true);
    try {
      const res =
        mode === "register"
          ? await api.register({
              name: name.trim(),
              email: email.trim() || undefined,
              password,
              referral_code: referralCode.trim() || undefined,
              gender: gender as Gender,
            })
          : await api.login({
              name: name.trim() || undefined,
              email: email.trim() || undefined,
              password,
            });
      setToken(res.token);
      // Bersihkan referral cache — sudah dipakai (register) atau tidak relevan (login).
      try { localStorage.removeItem("amalan_ref"); } catch { /* ignore */ }
      // Track Meta Pixel conversion — hanya fire kalau pixel di-set admin.
      // Fire BOTH Lead + CompleteRegistration supaya cocok dengan optimasi iklan
      // "Prospek Situs Web" (Lead) DAN tracking funnel registrasi.
      if (mode === "register") {
        trackPixelEvent("Lead", {
          content_name: "Amalan Harian - Pendaftaran",
          content_category: "registration",
          value: 1,
          currency: "IDR",
        });
        trackPixelEvent("CompleteRegistration", {
          content_name: "Amalan Harian",
          status: true,
          referral_used: Boolean(referralCode.trim()),
        });
      } else {
        trackPixelEvent("Login");
      }
      await refresh();
      fire(`🌙 Selamat datang, ${res.user?.name ?? ""}!`);
      nav("/amalan", { replace: true });
    } catch (e) {
      fire(`⚠️ ${(e as Error).message}`);
    } finally {
      setBusy(false);
    }
  };

  const onEnter = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") void submit();
  };

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-[#0a3d2e] via-g to-g2 px-5 py-7">
      <div
        className="pointer-events-none fixed inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "repeating-conic-gradient(var(--color-au) 0deg, transparent 25deg, transparent 50deg)",
          backgroundSize: "72px 72px",
        }}
      />
      <div className="text-center font-display text-[42px] leading-[1.1] text-white">
        Amalan
        <br />
        <em className="not-italic text-aul">Al-Quran</em>
      </div>
      <div className="mt-1.5 mb-9 text-[13px] tracking-[0.3px] text-white/55">
        Catat · Konsisten · Raih Berkah
      </div>

      <div className="z-10 w-full max-w-[360px] rounded-[22px] bg-white px-6 py-7 shadow-[0_20px_60px_rgba(0,0,0,0.28)]">
        <div className="mb-6 flex gap-[3px] rounded-lg bg-gp p-[3px]">
          {(["login", "register"] as Mode[]).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`flex-1 cursor-pointer rounded-md px-2 py-[9px] text-[14px] font-medium transition-all ${
                mode === m
                  ? "bg-g text-white shadow-[0_2px_8px_rgba(13,79,60,0.3)]"
                  : "bg-transparent text-mu"
              }`}
            >
              {m === "login" ? "Masuk" : "Daftar"}
            </button>
          ))}
        </div>

        <Field label="Nama">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={onEnter}
            placeholder="Nama lengkap kamu"
            autoFocus
          />
        </Field>

        {mode === "register" && (
          <Field label="Email (opsional)">
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={onEnter}
              type="email"
              placeholder="email@contoh.com"
            />
          </Field>
        )}

        <Field label="Password">
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={onEnter}
            type="password"
            placeholder={mode === "register" ? "Min. 6 karakter" : "••••••••"}
          />
        </Field>

        {mode === "login" && (
          <div className="-mt-1.5 mb-3 text-right">
            {forgotPasswordLink ? (
              <a
                href={forgotPasswordLink}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackPixelEvent("Contact", { type: "forgot_password" })}
                className="text-[12px] font-medium text-g hover:underline"
              >
                Lupa password?
              </a>
            ) : (
              <button
                type="button"
                onClick={() => fire("ℹ️ Hubungi admin untuk reset password akunmu.")}
                className="text-[12px] font-medium text-g hover:underline"
              >
                Lupa password?
              </button>
            )}
          </div>
        )}

        {mode === "register" && (
          <Field label="Konfirmasi Password">
            <input
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              onKeyDown={onEnter}
              type="password"
              placeholder="Ulangi password"
            />
          </Field>
        )}

        {mode === "register" && (
          <Field label="Jenis Kelamin">
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setGender("male")}
                className={`flex items-center justify-center gap-2 rounded-[10px] border-[1.5px] px-3 py-2.5 text-[13px] font-semibold transition-all ${
                  gender === "male"
                    ? "border-g bg-gp text-g"
                    : "border-[rgba(13,79,60,0.13)] bg-bg text-mu hover:border-mu"
                }`}
              >
                <span>👨</span>
                <span>Laki-laki</span>
              </button>
              <button
                type="button"
                onClick={() => setGender("female")}
                className={`flex items-center justify-center gap-2 rounded-[10px] border-[1.5px] px-3 py-2.5 text-[13px] font-semibold transition-all ${
                  gender === "female"
                    ? "border-[#ec4899] bg-[#fdf2f8] text-[#ec4899]"
                    : "border-[rgba(13,79,60,0.13)] bg-bg text-mu hover:border-mu"
                }`}
              >
                <span>👩</span>
                <span>Perempuan</span>
              </button>
            </div>
            <p className="mt-1.5 text-[10px] text-mu">
              Untuk akses fitur catatan haid (khusus perempuan).
            </p>
          </Field>
        )}

        {mode === "register" && (
          <Field label="Kode Referral (opsional)">
            <input
              value={referralCode}
              onChange={(e) => setReferralCode(e.target.value.toUpperCase())}
              onKeyDown={onEnter}
              placeholder="Masukkan kode dari teman"
              maxLength={12}
              style={{ textTransform: "uppercase", letterSpacing: "0.05em" }}
            />
          </Field>
        )}

        <button
          onClick={submit}
          disabled={busy}
          className="mt-1.5 w-full cursor-pointer rounded-[10px] bg-gradient-to-br from-g to-g3 px-3 py-3 text-[15px] font-semibold text-white transition-all hover:-translate-y-px hover:opacity-90 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {busy ? "..." : mode === "login" ? "Masuk →" : "Buat Akun →"}
        </button>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-3.5 [&_input]:w-full [&_input]:rounded-[10px] [&_input]:border-[1.5px] [&_input]:border-[rgba(13,79,60,0.13)] [&_input]:bg-bg [&_input]:px-3.5 [&_input]:py-3 [&_input]:text-[15px] [&_input]:text-tx [&_input]:outline-none [&_input]:transition-colors [&_input:focus]:border-g3 [&_input:focus]:bg-white">
      <label className="mb-[5px] block text-[11px] font-semibold tracking-[0.8px] text-mu uppercase">
        {label}
      </label>
      {children}
    </div>
  );
}
