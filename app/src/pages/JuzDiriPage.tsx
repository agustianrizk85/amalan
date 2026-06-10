import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { JUZ_DIRI, CARA_PENGAMALAN, hitungJuzDiri } from "@/data/juzDiri";

export default function JuzDiriPage() {
  const nav = useNavigate();
  const [selected, setSelected] = useState<number | null>(null);
  const [showCara, setShowCara] = useState(false);
  const [showCalc, setShowCalc] = useState(false);
  const [showTragic, setShowTragic] = useState(false);
  const [n1, setN1] = useState("");
  const [n2, setN2] = useState("");
  const [thn, setThn] = useState("");
  const [calcErr, setCalcErr] = useState<string | null>(null);

  const juz = selected ? JUZ_DIRI.find((j) => j.juz === selected) ?? null : null;

  const hitung = () => {
    setCalcErr(null);
    const a = parseInt(n1, 10), b = parseInt(n2, 10), y = parseInt(thn, 10);
    if (!a || !b || !y) {
      setCalcErr("Lengkapi ketiga isian dengan angka.");
      return;
    }
    const res = hitungJuzDiri(a, b, y);
    if (res == null) {
      setCalcErr("Nilai di luar jangkauan. Nilai Nama 1 = 1–31, Nilai Nama 2 = 1–12.");
      return;
    }
    setSelected(res);
    setShowCara(false);
    if (typeof document !== "undefined") {
      setTimeout(() => document.getElementById("hasil-juz")?.scrollIntoView({ behavior: "smooth" }), 60);
    }
  };

  return (
    <div className="min-h-[100dvh] bg-bg pb-[calc(env(safe-area-inset-bottom)+24px)]">
      {/* Header */}
      <div className="sticky top-0 z-10 flex items-center gap-3 bg-gradient-to-br from-g to-g2 px-4 pt-[calc(env(safe-area-inset-top)+12px)] pb-4 text-white shadow-md">
        <button
          onClick={() => nav("/beranda")}
          className="flex size-11 shrink-0 items-center justify-center rounded-full border border-white/20 bg-white/15 transition active:scale-90"
          aria-label="Kembali"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round">
            <path d="m15 18-6-6 6-6" />
          </svg>
        </button>
        <div className="min-w-0 flex-1">
          <div className="font-display text-[22px] font-bold leading-tight">Juz Diri</div>
          <div className="text-[13px] text-white/70">🧠 Psiko Quran — potensi kepribadian</div>
        </div>
      </div>

      <div className="mx-auto max-w-[480px] px-4 pt-4">
        {/* Penjelasan konsep */}
        <div className="mb-4 rounded-2xl bg-gradient-to-br from-g to-g3 px-5 py-4 text-white shadow-lg">
          <div className="font-display text-[16px] font-bold">Apa itu Juz Diri?</div>
          <p className="mt-1.5 text-[13px] leading-relaxed text-white/85">
            Juz Diri adalah media untuk mengenal potensi diri dan berfungsi sebagai
            <i> Operating System</i> otak manusia. Mengaktivasi Juz Diri (membacanya sekaligus)
            diyakini memperbaiki & meningkatkan kualitas diri lahir-batin.
          </p>
        </div>

        {/* Kalkulator otomatis */}
        <div className="mb-4 overflow-hidden rounded-2xl bg-white shadow-[0_3px_14px_rgba(13,79,60,0.08)]">
          <button
            onClick={() => setShowCalc((v) => !v)}
            className="flex w-full items-center justify-between px-5 py-4 text-left transition active:bg-gp/40"
          >
            <span className="font-display text-[15px] font-bold text-dk">🔢 Hitung Juz Diri Otomatis</span>
            <span className="text-[13px] text-mu">{showCalc ? "Tutup ▲" : "Buka ▼"}</span>
          </button>
          {showCalc && (
            <div className="border-t border-[rgba(13,79,60,0.06)] px-5 py-4">
              <p className="mb-3 text-[12px] leading-relaxed text-mu">
                Masukkan <b>dua nilai nama</b> (hasil hitung abjad sesuai metode PsikoQuran) dan
                <b> tahun lahir</b>. Sistem menghitung nomor Juz Diri persis seperti perangkat resmi.
              </p>
              <div className="grid grid-cols-3 gap-2.5">
                <Field label="Nilai Nama 1" hint="1–31" value={n1} onChange={setN1} />
                <Field label="Nilai Nama 2" hint="1–12" value={n2} onChange={setN2} />
                <Field label="Tahun Lahir" hint="mis. 1995" value={thn} onChange={setThn} />
              </div>
              {calcErr && <div className="mt-2.5 text-[12px] text-red-600">⚠️ {calcErr}</div>}
              <button
                onClick={hitung}
                className="mt-3 w-full rounded-xl bg-g py-3 text-[14px] font-semibold text-white shadow-md transition active:scale-[0.98]"
              >
                Hitung Juz Diri
              </button>
              <p className="mt-2.5 text-[11px] italic leading-relaxed text-mu">
                Belum tahu nilai nama Anda? Pilih nomor Juz langsung di bawah, atau hubungi konsultan PsikoQuran.
              </p>
            </div>
          )}
        </div>

        {/* Pemilih Juz */}
        <div className="mb-2 text-[13px] font-semibold text-dk">Pilih Juz Diri Anda (1–30)</div>
        <div className="mb-4 grid grid-cols-6 gap-2">
          {JUZ_DIRI.map((j) => (
            <button
              key={j.juz}
              onClick={() => { setSelected(j.juz); setShowCara(false); }}
              className={`aspect-square rounded-xl text-[15px] font-bold transition active:scale-90 ${
                selected === j.juz
                  ? "bg-g text-white shadow-[0_3px_10px_rgba(13,79,60,0.3)]"
                  : "border border-[rgba(13,79,60,0.13)] bg-white text-g hover:bg-gp"
              }`}
            >
              {j.juz}
            </button>
          ))}
        </div>

        {!juz && (
          <div className="rounded-2xl border border-dashed border-[rgba(13,79,60,0.2)] bg-white px-4 py-8 text-center text-[13px] text-mu">
            👆 Pilih nomor Juz Diri Anda untuk melihat potensi kepribadiannya.
          </div>
        )}

        {juz && (
          <>
            {/* Detail Juz */}
            <div id="hasil-juz" className="mb-3 overflow-hidden rounded-2xl bg-white shadow-[0_3px_14px_rgba(13,79,60,0.08)] scroll-mt-20">
              <div className="bg-gradient-to-br from-g to-g3 px-5 py-4 text-white">
                <div className="text-[12px] uppercase tracking-wider text-white/70">Juz {juz.juz}</div>
                <div className="font-display text-[24px] font-bold">{juz.nama}</div>
              </div>
              <div className="px-5 py-4">
                <div className="text-[11px] font-bold uppercase tracking-wider text-au">Struktur Juz</div>
                <p className="mt-1 text-[13px] leading-relaxed text-mu">{juz.struktur}</p>

                <div className="mt-4 text-[11px] font-bold uppercase tracking-wider text-au">Potensi & Kepribadian</div>
                <p className="mt-1 text-[14px] leading-relaxed text-tx">{juz.potensi}</p>
              </div>
            </div>

            {/* Cara Pengamalan */}
            <div className="overflow-hidden rounded-2xl bg-white shadow-[0_3px_14px_rgba(13,79,60,0.08)]">
              <button
                onClick={() => setShowCara((v) => !v)}
                className="flex w-full items-center justify-between px-5 py-4 text-left transition active:bg-gp/40"
              >
                <span className="font-display text-[15px] font-bold text-dk">🤲 Cara Pengamalan / Aktivasi</span>
                <span className="text-[13px] text-mu">{showCara ? "Tutup ▲" : "Buka ▼"}</span>
              </button>
              {showCara && (
                <div className="border-t border-[rgba(13,79,60,0.06)] px-5 py-4">
                  <p className="mb-3 text-[12px] italic leading-relaxed text-mu">
                    Aktivasi Juz Diri dibaca <b>sekaligus tanpa dipotong</b>. Jika berhenti di tengah,
                    proses dianggap belum selesai. Lakukan dengan tenang & khusyuk.
                  </p>
                  <ol className="flex flex-col gap-2.5">
                    {CARA_PENGAMALAN.map((c, i) => (
                      <li key={i} className="flex gap-2.5">
                        <span className="grid size-5 shrink-0 place-items-center rounded-full bg-g/10 text-[10px] font-bold text-g">
                          {i + 1}
                        </span>
                        <span className="text-[13px] leading-relaxed text-tx">{c}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              )}
            </div>

            <div className="mt-4 rounded-xl border border-[rgba(13,79,60,0.08)] bg-white px-4 py-3 text-[12px] leading-relaxed text-mu">
              💡 Penentuan Juz Diri secara resmi dihitung dari <b>nama lengkap + tahun lahir</b> melalui
              metode PsikoQuran. Bila Anda sudah tahu nomor Juz Diri Anda, pilih di atas untuk melihat detailnya.
            </div>
          </>
        )}

        {/* Info Tragic Endings */}
        <div className="mt-3 overflow-hidden rounded-2xl border border-au/30 bg-aup/30 shadow-[0_3px_14px_rgba(13,79,60,0.06)]">
          <button
            onClick={() => setShowTragic((v) => !v)}
            className="flex w-full items-center justify-between px-5 py-4 text-left transition active:bg-aup/50"
          >
            <span className="font-display text-[15px] font-bold text-aud">⚠️ Tentang Energi "Tragic Endings"</span>
            <span className="text-[13px] text-aud/70">{showTragic ? "Tutup ▲" : "Buka ▼"}</span>
          </button>
          {showTragic && (
            <div className="border-t border-au/20 px-5 py-4 text-[13px] leading-relaxed text-tx">
              <p>
                Dalam metode PsikoQuran dikenal istilah <b>Energi Tragic Endings</b>, yaitu indikasi energi
                pada nama lengkap (dikaitkan dengan tanggal lahir) yang menurut metode ini dapat menarik
                bahaya bagi pemiliknya. Energi ini dianggap perlu diwaspadai bila kadarnya
                <b> mencapai 35% ke atas</b>.
              </p>
              <p className="mt-2">
                Analisis Tragic Endings bersifat <b>personal dan sensitif</b>, sehingga tidak dihitung otomatis
                di aplikasi ini. Bila ingin mengetahui ada/tidaknya energi ini pada nama Anda beserta solusinya,
                disarankan melakukan <b>konseling langsung</b> dengan konsultan PsikoQuran. <i>Wallahu a'lam.</i>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  hint,
  value,
  onChange,
}: {
  label: string;
  hint: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-[11px] font-semibold text-dk">{label}</span>
      <input
        inputMode="numeric"
        value={value}
        onChange={(e) => onChange(e.target.value.replace(/[^\d]/g, ""))}
        placeholder={hint}
        className="w-full rounded-[10px] border-[1.5px] border-[rgba(13,79,60,0.13)] bg-white px-2.5 py-2 text-center text-[15px] font-bold text-g outline-none transition-colors focus:border-g3"
      />
    </label>
  );
}
