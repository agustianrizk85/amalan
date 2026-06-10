import { useNavigate } from "react-router-dom";
import { useSettings, DEFAULT_SETTINGS } from "@/lib/settings";
import { useAuth } from "@/lib/auth";
import { QARI } from "@/lib/quran";

export default function SettingsPage() {
  const nav = useNavigate();
  const { settings, update, reset } = useSettings();
  const { user, logout } = useAuth();

  return (
    <div className="min-h-[100dvh] bg-bg pb-[calc(env(safe-area-inset-bottom)+24px)]">
      {/* Header */}
      <div className="sticky top-0 z-10 flex items-center gap-3 border-b border-[rgba(13,79,60,0.08)] bg-gradient-to-br from-g to-g2 px-4 pt-[calc(env(safe-area-inset-top)+12px)] pb-4 text-white shadow-md">
        <button
          onClick={() => nav("/beranda")}
          className="flex size-11 shrink-0 items-center justify-center rounded-full border border-white/20 bg-white/15 transition active:scale-90"
          aria-label="Kembali"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round">
            <path d="m15 18-6-6 6-6" />
          </svg>
        </button>
        <div>
          <div className="font-display text-[22px] font-bold leading-tight">Pengaturan</div>
          <div className="text-[13px] text-white/70">Sesuaikan tampilan & preferensi</div>
        </div>
      </div>

      <div className="mx-auto max-w-[480px] px-4 pt-4">

        {/* ─── ARAB ─── */}
        <Section title="Arabic" icon="📜">
          <Row title="Jenis Penulisan Arab" subtitle="IndoPak lebih mudah dibaca di Asia">
            <Select
              value={settings.arabStyle}
              onChange={(v) => update("arabStyle", v as "indopak" | "uthmani")}
              options={[
                { value: "indopak", label: "IndoPak (Asia)" },
                { value: "uthmani", label: "Uthmani (Standar)" },
              ]}
            />
          </Row>
          <Row title="Ukuran Font Arab" subtitle={`${settings.fontArab} px — semakin besar semakin jelas`}>
            <Stepper
              value={settings.fontArab}
              onChange={(v) => update("fontArab", v)}
              min={22}
              max={48}
              step={2}
            />
          </Row>
          <Row title="Nomor Ayat di Arab" subtitle="Tampilkan ﴾٢﴿ di akhir ayat Arab">
            <Switch checked={settings.showAyatNumberArab} onChange={(v) => update("showAyatNumberArab", v)} />
          </Row>
          <PreviewArab size={settings.fontArab} />
        </Section>

        {/* ─── LATIN ─── */}
        <Section title="Latin (Transliterasi)" icon="📝">
          <Row title="Aktifkan Latin" subtitle="Tampilkan transliterasi di setiap ayat">
            <Switch checked={settings.showLatin} onChange={(v) => update("showLatin", v)} />
          </Row>
          <Row title="Ukuran Font Latin" subtitle={`${settings.fontLatin} px`}>
            <Stepper
              value={settings.fontLatin}
              onChange={(v) => update("fontLatin", v)}
              min={13}
              max={24}
              step={1}
            />
          </Row>
        </Section>

        {/* ─── TERJEMAHAN ─── */}
        <Section title="Terjemahan" icon="🇮🇩">
          <Row title="Aktifkan Terjemahan" subtitle="Tampilkan terjemahan Bahasa Indonesia">
            <Switch checked={settings.showTerjemah} onChange={(v) => update("showTerjemah", v)} />
          </Row>
          <Row title="Ukuran Font Terjemahan" subtitle={`${settings.fontTerjemah} px`}>
            <Stepper
              value={settings.fontTerjemah}
              onChange={(v) => update("fontTerjemah", v)}
              min={13}
              max={24}
              step={1}
            />
          </Row>
        </Section>

        {/* ─── TAMPILAN ─── */}
        <Section title="Tampilan" icon="🎨">
          <Row title="Mode Gelap Reader" subtitle="Latar gelap saat baca Al-Qur'an (malam hari)">
            <Switch checked={settings.darkReader} onChange={(v) => update("darkReader", v)} />
          </Row>
        </Section>

        {/* ─── AUDIO ─── */}
        <Section title="Audio & Murattal" icon="🎧">
          <Row title="Qari Default" subtitle="Suara qari saat putar murattal">
            <Select
              value={settings.defaultQari}
              onChange={(v) => update("defaultQari", v)}
              options={QARI.map((q) => ({ value: q.id, label: q.nama }))}
            />
          </Row>
          <Row title="Auto-Scroll saat Putar" subtitle="Halaman scroll otomatis mengikuti ayat yang dibaca">
            <Switch checked={settings.autoScrollOnPlay} onChange={(v) => update("autoScrollOnPlay", v)} />
          </Row>
        </Section>

        {/* ─── JADWAL SHOLAT ─── */}
        <Section title="Lokasi & Jadwal Sholat" icon="🕌">
          <Row title="Kota" subtitle="Untuk perhitungan jadwal sholat">
            <input
              type="text"
              value={settings.kota}
              onChange={(e) => update("kota", e.target.value)}
              className="w-[140px] rounded-lg border-[1.5px] border-[rgba(13,79,60,0.13)] bg-bg px-3 py-2 text-[15px] outline-none focus:border-g3"
              placeholder="Jakarta"
            />
          </Row>
          <Row title="Metode Perhitungan">
            <Select
              value={String(settings.metode)}
              onChange={(v) => update("metode", parseInt(v))}
              options={[
                { value: "20", label: "Kemenag RI (Indonesia)" },
                { value: "3", label: "Muslim World League" },
                { value: "5", label: "Egyptian General Authority" },
                { value: "2", label: "Islamic Society of N. America" },
              ]}
            />
          </Row>
        </Section>

        {/* ─── PENGINGAT ─── */}
        <Section title="Pengingat Harian" icon="🔔">
          <Row title="Aktifkan Pengingat" subtitle="Notifikasi pengingat amalan setiap hari">
            <Switch checked={settings.reminderHarian} onChange={(v) => update("reminderHarian", v)} />
          </Row>
          {settings.reminderHarian && (
            <Row title="Jam Pengingat" subtitle="Saat ingin diingatkan setiap hari">
              <input
                type="time"
                value={settings.reminderJam}
                onChange={(e) => update("reminderJam", e.target.value)}
                className="w-[110px] rounded-lg border-[1.5px] border-[rgba(13,79,60,0.13)] bg-bg px-3 py-2 text-[15px] outline-none focus:border-g3"
              />
            </Row>
          )}
        </Section>

        {/* ─── AKUN ─── */}
        <Section title="Akun" icon="👤">
          {user && (
            <>
              <Row title="Nama" subtitle={user.name} />
              {user.email && <Row title="Email" subtitle={user.email} />}
              <Row title="Total Poin" subtitle={`${user.total_poin.toLocaleString("id-ID")} poin`} />
              <Row title="Streak" subtitle={`${user.streak_days} hari berturut-turut 🔥`} />
            </>
          )}
          <button
            onClick={async () => {
              if (confirm("Yakin keluar dari akun?")) {
                await logout();
                nav("/");
              }
            }}
            className="mt-3 w-full rounded-xl border-[1.5px] border-red-400/40 bg-red-50 py-3.5 text-[14px] font-bold text-red-600 transition active:scale-[0.98]"
          >
            🚪 Keluar dari Akun
          </button>
        </Section>

        {/* ─── RESET ─── */}
        <button
          onClick={() => {
            if (confirm("Reset semua pengaturan ke awal?")) reset();
          }}
          className="mt-4 mb-2 w-full rounded-xl border-[1.5px] border-dashed border-[rgba(13,79,60,0.3)] bg-transparent py-3.5 text-[13px] font-semibold text-g transition active:bg-gp"
        >
          ↺ Reset ke Pengaturan Awal
        </button>

        <div className="mt-5 text-center text-[11px] text-mu">
          Versi 1.0 · Pengaturan tersimpan otomatis di perangkat ini
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════
// COMPONENTS
// ═══════════════════════════════════════════
function Section({ title, icon, children }: { title: string; icon: string; children: React.ReactNode }) {
  return (
    <div className="mb-5">
      <div className="mb-2 flex items-center gap-2 px-1">
        <span className="text-[16px]">{icon}</span>
        <h3 className="font-display text-[15px] font-bold text-g uppercase tracking-wider">{title}</h3>
      </div>
      <div className="rounded-2xl bg-white p-1 shadow-[0_3px_14px_rgba(13,79,60,0.08)]">
        {children}
      </div>
    </div>
  );
}

function Row({ title, subtitle, children }: { title: string; subtitle?: string; children?: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 border-b border-[rgba(13,79,60,0.06)] px-3 py-3.5 last:border-b-0">
      <div className="min-w-0 flex-1">
        <div className="text-[15px] font-semibold text-dk">{title}</div>
        {subtitle && <div className="mt-0.5 text-[13px] text-mu">{subtitle}</div>}
      </div>
      {children && <div className="shrink-0">{children}</div>}
    </div>
  );
}

function Switch({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={`relative h-7 w-12 shrink-0 rounded-full transition-colors ${
        checked ? "bg-g3" : "bg-[#cbd5e1]"
      }`}
      aria-pressed={checked}
    >
      <span
        className={`absolute top-1 size-5 rounded-full bg-white shadow transition-transform ${
          checked ? "left-[26px]" : "left-1"
        }`}
      />
    </button>
  );
}

function Stepper({
  value,
  onChange,
  min,
  max,
  step,
}: {
  value: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
  step: number;
}) {
  return (
    <div className="flex shrink-0 items-center gap-2">
      <button
        onClick={() => onChange(Math.max(min, value - step))}
        disabled={value <= min}
        className="flex size-9 items-center justify-center rounded-full bg-gp font-bold text-g text-[18px] transition active:scale-90 disabled:opacity-30"
      >
        −
      </button>
      <span className="min-w-[36px] text-center font-display text-[16px] font-bold text-dk">{value}</span>
      <button
        onClick={() => onChange(Math.min(max, value + step))}
        disabled={value >= max}
        className="flex size-9 items-center justify-center rounded-full bg-g font-bold text-white text-[18px] transition active:scale-90 disabled:opacity-30"
      >
        +
      </button>
    </div>
  );
}

function Select({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="max-w-[180px] cursor-pointer rounded-lg border-[1.5px] border-[rgba(13,79,60,0.13)] bg-bg px-3 py-2 text-[14px] font-medium text-dk outline-none focus:border-g3"
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>{o.label}</option>
      ))}
    </select>
  );
}

function PreviewArab({ size }: { size: number }) {
  return (
    <div className="mx-3 my-3 rounded-xl border border-[rgba(13,79,60,0.08)] bg-gp/40 px-4 py-3">
      <div className="mb-1.5 text-[10px] font-bold tracking-wider text-mu uppercase">Pratinjau</div>
      <div className="text-right font-arab text-dk leading-[2]" dir="rtl" style={{ fontSize: size }}>
        بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
      </div>
    </div>
  );
}

// Avoid unused warning
void DEFAULT_SETTINGS;
