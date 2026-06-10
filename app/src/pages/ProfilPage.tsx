import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { api, type ReferralItem } from "@/lib/api";
import { avatarOf, fmt } from "@/lib/data";
import SectionHeader from "@/components/SectionHeader";
import { useToast } from "@/lib/toast";

export default function ProfilPage() {
  const { user, rank, referralStats, logout } = useAuth();
  const nav = useNavigate();
  const fire = useToast();
  const [hariAktif, setHariAktif] = useState(0);
  const [copied, setCopied] = useState(false);
  const [refList, setRefList] = useState<ReferralItem[]>([]);
  const [showRefList, setShowRefList] = useState(false);

  useEffect(() => {
    let alive = true;
    api
      .riwayat()
      .then((r) => alive && setHariAktif(r.data.length))
      .catch(() => {});
    api
      .referrals()
      .then((r) => alive && setRefList(r.data))
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, []);

  if (!user) return null;

  const onLogout = async () => {
    await logout();
    nav("/", { replace: true });
  };

  const referralLink = user.referral_code
    ? `${window.location.origin}/?ref=${user.referral_code}`
    : "";

  const copyCode = async () => {
    if (!user.referral_code) return;
    try {
      await navigator.clipboard.writeText(user.referral_code);
      setCopied(true);
      fire("✅ Kode disalin");
      setTimeout(() => setCopied(false), 1500);
    } catch {
      fire("⚠️ Gagal menyalin");
    }
  };

  const copyLink = async () => {
    if (!referralLink) return;
    try {
      await navigator.clipboard.writeText(referralLink);
      fire("✅ Link disalin");
    } catch {
      fire("⚠️ Gagal menyalin link");
    }
  };

  const shareApp = async () => {
    if (!referralLink) return;
    const shareText = `🌙 Yuk ikut catat amalan harian di Amalan Al-Quran! Pakai kode referral saya: ${user.referral_code}\n\n${referralLink}`;
    if (typeof navigator.share === "function") {
      try {
        await navigator.share({
          title: "Amalan Al-Quran",
          text: shareText,
          url: referralLink,
        });
      } catch (e) {
        // user cancel — abaikan
        if ((e as Error).name !== "AbortError") fire("⚠️ Gagal berbagi");
      }
    } else {
      // Fallback: copy text
      await navigator.clipboard.writeText(shareText);
      fire("✅ Teks ajakan disalin");
    }
  };

  return (
    <>
      <SectionHeader title="Profil Saya" sub="Statistik & pengaturan akun" />

      <div className="mb-3 flex flex-col items-center rounded-2xl bg-white p-[22px] text-center shadow-[0_4px_24px_rgba(13,79,60,0.11)]">
        <div className="relative mb-3">
          <div className="flex size-[68px] items-center justify-center rounded-full bg-gradient-to-br from-g to-g3 text-[22px] font-bold text-white shadow-[0_4px_14px_rgba(13,79,60,0.28)]">
            {avatarOf(user.name)}
          </div>
          <button
            onClick={() => nav("/profil/edit")}
            aria-label="Edit profil"
            className="absolute -bottom-1 -right-1 grid size-[26px] cursor-pointer place-items-center rounded-full border-2 border-white bg-g text-white shadow-md transition-colors hover:bg-g2 active:bg-dk"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
          </button>
        </div>
        <div className="mb-px font-display text-[20px] font-bold text-dk">{user.name}</div>
        {user.email && <div className="text-[13px] text-mu">{user.email}</div>}

        <div className="mt-2 mb-4 flex items-center gap-2">
          {user.gender === "female" ? (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#fdf2f8] border border-[#fbcfe8] px-2.5 py-1 text-[11px] font-semibold text-[#ec4899]">
              <span>👩</span>
              <span>Perempuan</span>
            </span>
          ) : user.gender === "male" ? (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-gp border border-[rgba(13,79,60,0.18)] px-2.5 py-1 text-[11px] font-semibold text-g">
              <span>👨</span>
              <span>Laki-laki</span>
            </span>
          ) : (
            <button
              onClick={() => nav("/profil/edit")}
              className="inline-flex items-center gap-1.5 rounded-full bg-aup border border-aul/40 px-2.5 py-1 text-[11px] font-semibold text-[#92400e] hover:bg-aul/30 transition-colors"
            >
              <span>⚠️</span>
              <span>Set jenis kelamin →</span>
            </button>
          )}
        </div>

        <div className="grid w-full grid-cols-3 gap-2.5">
          <Stat n={fmt(user.total_poin)} l="Total Poin" />
          <Stat n={`#${rank || "–"}`} l="Peringkat" />
          <Stat n={String(hariAktif)} l="Hari Aktif" />
        </div>

        <button
          onClick={() => nav("/profil/edit")}
          className="mt-4 flex w-full cursor-pointer items-center justify-center gap-2 rounded-[10px] border-[1.5px] border-[rgba(13,79,60,0.18)] bg-white px-4 py-2.5 text-[13px] font-semibold text-g transition-all hover:bg-gp active:scale-[0.99]"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
          </svg>
          Edit Profil & Password
        </button>
      </div>

      {/* Kartu Referral */}
      {user.referral_code && (
        <div className="mb-3 overflow-hidden rounded-2xl bg-gradient-to-br from-g to-g3 p-[20px] text-white shadow-[0_4px_24px_rgba(13,79,60,0.15)]">
          <div className="flex items-center gap-2">
            <span className="text-[20px]">🎁</span>
            <span className="font-display text-[15px] font-bold tracking-wide">Kode Referral Kamu</span>
          </div>
          <div className="mt-1 text-[12px] text-white/75">
            Ajak teman & dapat <strong className="text-aul">50 poin</strong> per orang yang daftar!
          </div>

          {/* Kode display */}
          <button
            onClick={copyCode}
            className="mt-3 flex w-full cursor-pointer items-center justify-between rounded-[12px] border border-white/20 bg-white/15 px-4 py-3 backdrop-blur-sm transition-all hover:bg-white/25 active:scale-[0.98]"
          >
            <div className="flex flex-col items-start">
              <span className="text-[10px] uppercase tracking-[0.1em] text-white/65">Kode</span>
              <span className="font-display text-[22px] font-bold tracking-[0.15em] text-white">
                {user.referral_code}
              </span>
            </div>
            <span className="rounded-[8px] bg-white/25 px-2.5 py-1 text-[11px] font-semibold">
              {copied ? "✓ Disalin" : "Salin"}
            </span>
          </button>

          {/* Stats */}
          <div className="mt-3 grid grid-cols-2 gap-2.5">
            <button
              onClick={() => referralStats.count > 0 && setShowRefList((v) => !v)}
              className={`rounded-[10px] bg-white/10 px-3 py-2.5 text-left transition-all ${
                referralStats.count > 0 ? "cursor-pointer hover:bg-white/20 active:scale-[0.98]" : "cursor-default"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase tracking-wider text-white/65">Teman Diajak</span>
                {referralStats.count > 0 && (
                  <span className="text-[10px] text-white/65">{showRefList ? "Tutup ▲" : "Lihat ▼"}</span>
                )}
              </div>
              <div className="font-display text-[18px] font-bold">{referralStats.count}</div>
            </button>
            <div className="rounded-[10px] bg-white/10 px-3 py-2.5 text-left">
              <div className="text-[10px] uppercase tracking-wider text-white/65">Poin Didapat</div>
              <div className="font-display text-[18px] font-bold">+{fmt(referralStats.poin_earned)}</div>
            </div>
          </div>

          {/* Daftar nama teman yang diajak */}
          {showRefList && (
            <div className="mt-2.5 rounded-[12px] bg-white/10 p-2.5">
              {refList.length === 0 ? (
                <div className="py-2 text-center text-[12px] text-white/65">Memuat daftar…</div>
              ) : (
                <ul className="flex flex-col gap-1.5">
                  {refList.map((r, i) => (
                    <li
                      key={i}
                      className="flex items-center gap-2.5 rounded-[8px] bg-white/10 px-2.5 py-2"
                    >
                      <span className="grid size-[30px] shrink-0 place-items-center rounded-full bg-white/20 text-[11px] font-bold">
                        {avatarOf(r.name)}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-[13px] font-semibold leading-tight">
                          {r.gender === "female" ? "👩 " : r.gender === "male" ? "👨 " : ""}
                          {r.name}
                        </div>
                        <div className="text-[10px] text-white/60">{fmtTanggal(r.created_at)}</div>
                      </div>
                      <span className="shrink-0 rounded-[6px] bg-aul/20 px-2 py-0.5 text-[11px] font-semibold text-aul">
                        +{r.poin_awarded}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="mt-3 flex gap-2">
            <button
              onClick={shareApp}
              className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-[10px] bg-white px-3 py-2.5 text-[13px] font-semibold text-g transition-all hover:bg-white/95 active:scale-[0.97]"
            >
              <span>📤</span> Bagikan
            </button>
            <button
              onClick={copyLink}
              className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-[10px] border border-white/25 bg-transparent px-3 py-2.5 text-[13px] font-semibold text-white transition-all hover:bg-white/10 active:scale-[0.97]"
            >
              <span>🔗</span> Salin Link
            </button>
          </div>
        </div>
      )}

      {user.role === "admin" && (
        <>
          <button
            onClick={() => nav("/admin/poin")}
            className="mb-2 flex w-full cursor-pointer items-center justify-between rounded-[10px] border-[1.5px] border-[rgba(13,79,60,0.18)] bg-white px-4 py-3 text-[14px] font-semibold text-g transition-all hover:bg-gp active:scale-[0.99]"
          >
            <span className="flex items-center gap-2">
              <span>🛡️</span>
              <span>Panel Admin — Evaluasi Poin</span>
            </span>
            <span className="text-mu">→</span>
          </button>
          <button
            onClick={() => nav("/admin/app-config")}
            className="mb-2 flex w-full cursor-pointer items-center justify-between rounded-[10px] border-[1.5px] border-[rgba(13,79,60,0.18)] bg-white px-4 py-3 text-[14px] font-semibold text-g transition-all hover:bg-gp active:scale-[0.99]"
          >
            <span className="flex items-center gap-2">
              <span>⚙️</span>
              <span>Konfigurasi Aplikasi (Pixel, WA, CS)</span>
            </span>
            <span className="text-mu">→</span>
          </button>
        </>
      )}

      <button
        onClick={onLogout}
        className="w-full cursor-pointer rounded-[10px] border-[1.5px] border-[rgba(220,53,69,0.28)] bg-transparent px-3 py-3 text-[14px] font-semibold text-[#dc3545] transition-colors hover:bg-[rgba(220,53,69,0.05)]"
      >
        Keluar dari Akun
      </button>
    </>
  );
}

function fmtTanggal(s: string): string {
  const d = new Date(s.replace(" ", "T"));
  if (isNaN(d.getTime())) return s;
  return d.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
}

function Stat({ n, l }: { n: string; l: string }) {
  return (
    <div className="rounded-[10px] bg-gp px-1.5 py-3 text-center">
      <div className="font-display text-[20px] font-bold text-g">{n}</div>
      <div className="mt-0.5 text-[10px] font-medium tracking-[0.4px] text-mu uppercase">{l}</div>
    </div>
  );
}
