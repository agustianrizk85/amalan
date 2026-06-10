import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import { loadQuran, stripTags, QARI, type QuranData, type SuratLengkap, type Ayat } from "@/lib/quran";
import {
  useSettings,
  saveTerakhirBaca,
  addBookmark,
  isBookmarked,
  removeBookmark,
} from "@/lib/settings";
import { useToast } from "@/lib/toast";

type Props = {
  initialNomor: number | null;
  initialAyat?: number | null;
  pickerMode: boolean;
  onClose: () => void;
};

export default function QuranReader({ initialNomor, initialAyat, pickerMode, onClose }: Props) {
  const { settings } = useSettings();
  const nav = useNavigate();
  const fire = useToast();
  const initialAyatScrolledRef = useRef(false);
  const [data, setData] = useState<QuranData | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [nomor, setNomor] = useState<number | null>(pickerMode ? null : initialNomor);
  const [search, setSearch] = useState("");
  const [qari, setQari] = useState<string>(settings.defaultQari);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const bodyRef = useRef<HTMLDivElement | null>(null);
  const [playingAyat, setPlayingAyat] = useState<number | null>(null);
  const [playingFull, setPlayingFull] = useState(false);

  // Auto-play state
  const [autoPlay, setAutoPlay] = useState(false);
  const autoPlayRef = useRef(false);

  // Context menu
  const [ayatMenu, setAyatMenu] = useState<Ayat | null>(null);
  const longPressRef = useRef<number | null>(null);

  // Swipe
  const swipeStart = useRef<{ x: number; y: number; t: number } | null>(null);
  const [swipeDx, setSwipeDx] = useState(0);

  // Ayat picker (loncat ke ayat tertentu)
  const [ayatPicker, setAyatPicker] = useState(false);

  useEffect(() => {
    let alive = true;
    loadQuran()
      .then((d) => alive && setData(d))
      .catch((e) => alive && setErr(e?.message ?? "Gagal memuat data Al-Qur'an"));
    return () => { alive = false; };
  }, []);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  useEffect(() => () => stopAudio(), []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.remove();
        audioRef.current = null;
      }
    };
  }, []);

  // Keyboard nav (desktop)
  useEffect(() => {
    if (nomor == null) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" && nomor > 1) gotoSurat(nomor - 1);
      else if (e.key === "ArrowRight" && nomor < 114) gotoSurat(nomor + 1);
      else if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nomor]);

  const surat = useMemo<SuratLengkap | null>(() => {
    if (!data || nomor == null) return null;
    return data.surat.find((s) => s.nomor === nomor) ?? null;
  }, [data, nomor]);

  // Auto-save "terakhir baca" setiap kali user buka surat.
  // Hanya save level surat (ayat tidak ditimpa — itu hanya di-set saat user
  // explicit klik "Tandai Terakhir Baca" via context menu per ayat).
  useEffect(() => {
    if (surat) {
      saveTerakhirBaca({
        nomor: surat.nomor,
        namaLatin: surat.namaLatin,
        arti: surat.arti,
        ayat: surat.nomor === initialNomor ? (initialAyat ?? undefined) : undefined,
        tanggal: new Date().toISOString(),
      });
    }
  }, [surat?.nomor]); // eslint-disable-line react-hooks/exhaustive-deps

  // Auto-scroll ke initialAyat sekali setelah surat ready (saat user buka dari
  // "Terakhir Baca" yang punya ayat tersimpan).
  useEffect(() => {
    if (!surat || !initialAyat) return;
    if (initialAyatScrolledRef.current) return;
    if (surat.nomor !== initialNomor) return;
    // Tunggu DOM siap dan ayat ter-render
    const t = window.setTimeout(() => {
      const el = document.getElementById(`ayat-${initialAyat}`);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
        // Highlight sementara
        el.classList.add("ring-2", "ring-aul");
        window.setTimeout(() => el.classList.remove("ring-2", "ring-aul"), 2000);
      }
      initialAyatScrolledRef.current = true;
    }, 350);
    return () => window.clearTimeout(t);
  }, [surat?.nomor, initialAyat, initialNomor]);

  const prevSurat = useMemo<SuratLengkap | null>(() => {
    if (!data || nomor == null || nomor <= 1) return null;
    return data.surat.find((s) => s.nomor === nomor - 1) ?? null;
  }, [data, nomor]);

  const nextSurat = useMemo<SuratLengkap | null>(() => {
    if (!data || nomor == null || nomor >= 114) return null;
    return data.surat.find((s) => s.nomor === nomor + 1) ?? null;
  }, [data, nomor]);

  const filteredSurat = useMemo(() => {
    if (!data) return [];
    const q = search.trim().toLowerCase();
    if (!q) return data.surat;
    return data.surat.filter(
      (s) =>
        String(s.nomor) === q ||
        s.namaLatin.toLowerCase().includes(q) ||
        s.arti.toLowerCase().includes(q) ||
        s.nama.includes(search.trim()),
    );
  }, [data, search]);

  function ensureAudio(): HTMLAudioElement {
    if (!audioRef.current) {
      const a = document.createElement("audio");
      a.preload = "none";
      document.body.appendChild(a);
      audioRef.current = a;
    }
    return audioRef.current;
  }

  function stopAudio() {
    const a = audioRef.current;
    if (a) { a.pause(); a.removeAttribute("src"); a.load(); a.onended = null; }
    setPlayingAyat(null);
    setPlayingFull(false);
  }

  function stopAutoPlay() {
    autoPlayRef.current = false;
    setAutoPlay(false);
    stopAudio();
  }

  function gotoSurat(n: number) {
    stopAutoPlay();
    setNomor(n);
    if (bodyRef.current) bodyRef.current.scrollTop = 0;
  }

  function playFullSurat() {
    if (autoPlayRef.current) stopAutoPlay();
    if (!surat) return;
    if (playingFull) { stopAudio(); return; }
    const url = surat.audioFull?.[qari] ?? surat.audioFull?.["05"];
    if (!url) return;
    stopAudio();
    const a = ensureAudio();
    a.src = url;
    a.play().then(() => setPlayingFull(true)).catch(() => setPlayingFull(false));
    a.onended = () => setPlayingFull(false);
  }

  function playAyat(nomorAyat: number) {
    if (autoPlayRef.current) stopAutoPlay();
    if (!surat) return;
    if (playingAyat === nomorAyat) { stopAudio(); return; }
    const ayat = surat.ayat.find((a) => a.nomorAyat === nomorAyat);
    const url = ayat?.audio?.[qari] ?? ayat?.audio?.["05"] ?? ayat?.audio?.["01"];
    if (!url) return;
    stopAudio();
    const a = ensureAudio();
    a.src = url;
    a.play().then(() => setPlayingAyat(nomorAyat)).catch(() => setPlayingAyat(null));
    a.onended = () => setPlayingAyat(null);
  }

  function startAutoPlay(fromIdx = 0) {
    if (!surat) return;
    stopAudio();
    autoPlayRef.current = true;
    setAutoPlay(true);
    playAutoAt(fromIdx);
  }

  function playAutoAt(idx: number) {
    if (!autoPlayRef.current || !surat) return;
    if (idx >= surat.ayat.length) {
      autoPlayRef.current = false;
      setAutoPlay(false);
      setPlayingAyat(null);
      return;
    }
    const ayat = surat.ayat[idx];
    const url = ayat.audio?.[qari] ?? ayat.audio?.["05"] ?? ayat.audio?.["01"];
    if (!url) { setTimeout(() => playAutoAt(idx + 1), 200); return; }

    const a = ensureAudio();
    a.src = url;
    setPlayingAyat(ayat.nomorAyat);

    // Scroll ke ayat aktif
    setTimeout(() => {
      const el = document.getElementById(`ayat-${ayat.nomorAyat}`);
      el?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 100);

    a.play().catch(() => {
      // gagal — lanjut ayat berikutnya
      setTimeout(() => playAutoAt(idx + 1), 200);
    });
    a.onended = () => {
      if (!autoPlayRef.current) return;
      setTimeout(() => playAutoAt(idx + 1), 300);
    };
  }

  function toggleAutoPlay() {
    if (autoPlay) stopAutoPlay();
    else startAutoPlay(0);
  }

  // ─── Share / Copy seluruh surat ───
  async function shareSurat() {
    if (!surat) return;
    const text = `QS. ${surat.namaLatin} (${surat.nomor}) — ${surat.arti}\n${surat.jumlahAyat} ayat, ${capitalize(surat.tempatTurun)}\n\n${surat.ayat.map((a) => `${a.nomorAyat}. ${a.teksArab}\n${a.teksIndonesia ?? ""}`).join("\n\n")}`;
    if (navigator.share) {
      try { await navigator.share({ text, title: surat.namaLatin }); return; } catch { /* user cancel */ }
    }
    try { await navigator.clipboard.writeText(text); alert("Surat disalin ke clipboard."); } catch { /* fail */ }
  }

  function loncatKeAyat(n: number) {
    setAyatPicker(false);
    setTimeout(() => {
      const el = document.getElementById(`ayat-${n}`);
      el?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
  }

  // ─── Context menu ───
  function openAyatMenu(a: Ayat) { setAyatMenu(a); }
  function closeAyatMenu() { setAyatMenu(null); }

  function pressStart(a: Ayat) {
    if (longPressRef.current) window.clearTimeout(longPressRef.current);
    longPressRef.current = window.setTimeout(() => {
      if (navigator.vibrate) navigator.vibrate(40);
      openAyatMenu(a);
      longPressRef.current = null;
    }, 500);
  }
  function pressCancel() {
    if (longPressRef.current) {
      window.clearTimeout(longPressRef.current);
      longPressRef.current = null;
    }
  }

  async function ayatAction(action: "play" | "share" | "copy" | "mark" | "bookmark") {
    if (!ayatMenu || !surat) return;
    const a = ayatMenu;
    closeAyatMenu();
    if (action === "play") {
      playAyat(a.nomorAyat);
    } else if (action === "share" || action === "copy") {
      const text = `QS. ${surat.namaLatin}: Ayat ${a.nomorAyat}\n\n${a.teksArab}\n\n${a.teksLatin ?? ""}\n\n"${a.teksIndonesia ?? ""}"`;
      if (action === "share" && navigator.share) {
        try { await navigator.share({ text, title: `${surat.namaLatin} ${a.nomorAyat}` }); } catch { /* user cancel */ }
        return;
      }
      try {
        await navigator.clipboard.writeText(text);
        if (action === "copy") fire("📋 Ayat disalin");
      } catch { /* fail */ }
    } else if (action === "mark") {
      saveTerakhirBaca({
        nomor: surat.nomor,
        namaLatin: surat.namaLatin,
        arti: surat.arti,
        ayat: a.nomorAyat,
        tanggal: new Date().toISOString(),
      });
      fire(`🔖 Ditandai terakhir baca: ${surat.namaLatin} ayat ${a.nomorAyat}`);
    } else if (action === "bookmark") {
      const already = isBookmarked(surat.nomor, a.nomorAyat);
      if (already) {
        removeBookmark(surat.nomor, a.nomorAyat);
        fire(`🗑️ Bookmark dihapus`);
      } else {
        addBookmark({
          nomor: surat.nomor,
          namaLatin: surat.namaLatin,
          arti: surat.arti,
          ayat: a.nomorAyat,
        });
        fire(`⭐ Ditambahkan ke Bookmark: ${surat.namaLatin} ayat ${a.nomorAyat}`);
      }
    }
  }

  // ─── Swipe handlers ───
  function onTouchStart(e: React.TouchEvent) {
    if (autoPlay || nomor == null) return;
    swipeStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY, t: Date.now() };
  }
  function onTouchMove(e: React.TouchEvent) {
    if (!swipeStart.current) return;
    const dx = e.touches[0].clientX - swipeStart.current.x;
    const dy = Math.abs(e.touches[0].clientY - swipeStart.current.y);
    if (Math.abs(dx) > 20 && dy < 80) setSwipeDx(dx * 0.25);
  }
  function onTouchEnd(e: React.TouchEvent) {
    const start = swipeStart.current;
    setSwipeDx(0);
    swipeStart.current = null;
    if (!start || nomor == null) return;
    const dx = e.changedTouches[0].clientX - start.x;
    const dy = Math.abs(e.changedTouches[0].clientY - start.y);
    const dt = Date.now() - start.t;
    if (Math.abs(dx) < 60 || dy > 80 || dt > 600) return;
    if (dx < 0 && nomor < 114) gotoSurat(nomor + 1);
    else if (dx > 0 && nomor > 1) gotoSurat(nomor - 1);
  }

  const showPicker = nomor == null;

  const dark = settings.darkReader;
  const juz = surat ? getJuzForSurat(surat.nomor) : 1;

  const content = (
    <div className={`fixed inset-0 z-[100] mx-auto flex max-w-[480px] flex-col shadow-[0_0_60px_rgba(13,79,60,0.1)] ${
      dark ? "bg-[#0f1a17] text-[#e5e7eb]" : "bg-[#f8f1de]"
    }`}>
      {/* HEADER — light cream theme sesuai screenshot */}
      <div className={`shrink-0 ${
        dark ? "bg-[#1b2a25] text-[#e5e7eb] border-b border-white/10"
             : "bg-[#f0e4cf] text-[#1a4d3a] border-b border-[#c9b88a]/50"
      } px-3 pt-[calc(env(safe-area-inset-top)+8px)] pb-0`}>

        {/* ─── TOP BAR ─── */}
        <div className="flex items-center gap-1.5 pb-2">
          <button
            onClick={() => {
              if (pickerMode && !showPicker) { stopAutoPlay(); setNomor(null); }
              else { stopAutoPlay(); onClose(); }
            }}
            className={`flex size-10 shrink-0 items-center justify-center rounded-full transition active:scale-90 ${
              dark ? "bg-white/10 text-white" : "bg-g text-white"
            }`}
            aria-label="Kembali"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round">
              <path d="m15 18-6-6 6-6" />
            </svg>
          </button>

          {showPicker ? (
            <div className="flex-1 px-2">
              <div className={`font-display text-[19px] font-bold leading-tight ${dark ? "text-white" : "text-[#1a4d3a]"}`}>
                Pilih Surat
              </div>
              <div className={`text-[12px] ${dark ? "text-white/55" : "text-[#1a4d3a]/55"}`}>
                114 surat — ketuk untuk membaca
              </div>
            </div>
          ) : (
            <div className="flex-1 text-center font-display text-[18px] font-bold">
              Juz {juz}
            </div>
          )}

          {!showPicker && surat && (
            <div className="flex shrink-0 items-center gap-0.5">
              {/* Ayat picker */}
              <HeaderIcon
                onClick={() => setAyatPicker(true)}
                dark={dark}
                title="Loncat ke ayat"
                ariaLabel="Pilih ayat"
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                  <line x1="8" y1="6" x2="21" y2="6" />
                  <line x1="8" y1="12" x2="21" y2="12" />
                  <line x1="8" y1="18" x2="21" y2="18" />
                  <line x1="3" y1="6" x2="3.01" y2="6" />
                  <line x1="3" y1="12" x2="3.01" y2="12" />
                  <line x1="3" y1="18" x2="3.01" y2="18" />
                </svg>
              </HeaderIcon>

              {/* Auto-Play */}
              <HeaderIcon
                onClick={toggleAutoPlay}
                dark={dark}
                title="Auto-Baca: putar + scroll otomatis"
                ariaLabel={autoPlay ? "Stop Auto-Baca" : "Mulai Auto-Baca"}
                active={autoPlay}
                disabled={!surat.audioFull?.[qari] && !surat.audioFull?.["05"]}
              >
                {autoPlay ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="6" width="12" height="12" rx="2"/></svg>
                ) : (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="7 6 12 11 17 6"/>
                    <polyline points="7 13 12 18 17 13"/>
                  </svg>
                )}
              </HeaderIcon>

              {/* Share / Salin surat */}
              <HeaderIcon
                onClick={shareSurat}
                dark={dark}
                title="Bagikan / Salin Surat"
                ariaLabel="Bagikan surat"
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
              </HeaderIcon>

              {/* Settings */}
              <HeaderIcon
                onClick={() => { stopAutoPlay(); nav("/pengaturan"); }}
                dark={dark}
                title="Pengaturan"
                ariaLabel="Pengaturan"
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="3" />
                  <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 0 1-4 0v-.1a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1A1.7 1.7 0 0 0 4.6 15a1.7 1.7 0 0 0-1.5-1H3a2 2 0 0 1 0-4h.1a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 0 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 0 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z" />
                </svg>
              </HeaderIcon>
            </div>
          )}
        </div>

        {/* SURAT TABS — prev / current / next */}
        {!showPicker && surat && (
          <div className={`-mx-3 flex border-t ${dark ? "border-white/10" : "border-[#c9b88a]/40"}`}>
            {prevSurat ? (
              <button
                onClick={() => gotoSurat(prevSurat.nomor)}
                className={`flex-1 truncate py-2.5 text-center text-[13px] transition active:scale-95 ${
                  dark ? "text-white/40" : "text-[#1a4d3a]/45"
                }`}
              >
                {prevSurat.nomor}. {prevSurat.namaLatin}
              </button>
            ) : <div className="flex-1" />}
            <div className={`flex-1 truncate py-2.5 text-center font-display text-[15px] font-bold ${
              dark ? "text-white border-b-[3px] border-aul" : "text-[#1a4d3a] border-b-[3px] border-[#1a4d3a]"
            }`}>
              {surat.nomor}. {surat.namaLatin}
            </div>
            {nextSurat ? (
              <button
                onClick={() => gotoSurat(nextSurat.nomor)}
                className={`flex-1 truncate py-2.5 text-center text-[13px] transition active:scale-95 ${
                  dark ? "text-white/40" : "text-[#1a4d3a]/45"
                }`}
              >
                {nextSurat.nomor}. {nextSurat.namaLatin}
              </button>
            ) : <div className="flex-1" />}
          </div>
        )}

        {/* ORNAMENTAL PILLS ROW */}
        {!showPicker && surat && (
          <div className={`-mx-3 px-3 py-3 ${dark ? "bg-[#0f1a17]" : "bg-[#ebdfc4]"}`}>
            <div className={`relative rounded-2xl border ${
              dark ? "border-aul/40 bg-white/5" : "border-[#c9b88a]/60 bg-[#f8f1de]"
            } px-2.5 py-2`}>
              {/* Corner ornaments */}
              <Ornament position="tl" dark={dark} />
              <Ornament position="tr" dark={dark} />
              <Ornament position="bl" dark={dark} />
              <Ornament position="br" dark={dark} />

              <div className="flex items-center justify-between gap-2">
                <span className={`rounded-full px-3 py-1.5 text-[13px] font-semibold ${
                  dark ? "bg-white/10 text-aul" : "bg-white/80 text-[#1a4d3a]"
                }`}>
                  📍 {capitalize(surat.tempatTurun)}
                </span>
                <span className={`font-display text-[18px] font-bold tracking-wide ${dark ? "text-aul" : "text-[#1a4d3a]"}`}>
                  {surat.arti}
                </span>
                <span className={`rounded-full px-3 py-1 text-center text-[11px] leading-tight font-semibold ${
                  dark ? "bg-white/10 text-aul" : "bg-white/80 text-[#1a4d3a]"
                }`}>
                  <b className="block text-[15px]">{surat.jumlahAyat}</b>Ayat
                </span>
              </div>
            </div>
          </div>
        )}

        {/* QARI compact bar */}
        {!showPicker && surat && (
          <div className={`-mx-3 flex items-center gap-2 border-t px-3 py-2 ${
            dark ? "border-white/10 bg-[#0c1614]" : "border-[#c9b88a]/30 bg-[#ebdfc4]/70"
          }`}>
            <span className={`shrink-0 text-[11px] ${dark ? "text-white/55" : "text-[#1a4d3a]/55"}`}>Qari:</span>
            <select
              value={qari}
              onChange={(e) => { stopAutoPlay(); setQari(e.target.value); }}
              className={`min-w-0 flex-1 cursor-pointer rounded-md border px-2 py-1 text-[13px] outline-none ${
                dark
                  ? "border-white/15 bg-white/10 text-white"
                  : "border-[#c9b88a]/40 bg-white/80 text-[#1a4d3a]"
              }`}
            >
              {QARI.map((q) => (
                <option key={q.id} value={q.id}>{q.nama}</option>
              ))}
            </select>
            <button
              onClick={playFullSurat}
              disabled={!surat.audioFull?.[qari] && !surat.audioFull?.["05"]}
              className={`flex shrink-0 items-center gap-1 rounded-md px-2.5 py-1 text-[12px] font-bold transition active:scale-95 disabled:opacity-40 ${
                dark ? "bg-aul text-dk" : "bg-g text-white"
              }`}
            >
              {playingFull ? (
                <>
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
                    <rect x="6" y="5" width="4" height="14" />
                    <rect x="14" y="5" width="4" height="14" />
                  </svg>
                  Stop
                </>
              ) : (
                <>
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
                    <polygon points="5 3 19 12 5 21 5 3" />
                  </svg>
                  Putar
                </>
              )}
            </button>
          </div>
        )}

        {showPicker && (
          <div className={`mt-1 mb-3 flex items-center gap-2 rounded-xl border px-3 py-2 ${
            dark ? "border-white/10 bg-white/5" : "border-[#c9b88a]/50 bg-white/70"
          }`}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={dark ? "text-white/60" : "text-[#1a4d3a]/60"}>
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
            <input
              autoFocus
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari surat (nama, arti, nomor)..."
              className={`min-w-0 flex-1 bg-transparent text-[15px] outline-none ${
                dark ? "text-white placeholder:text-white/40" : "text-[#1a4d3a] placeholder:text-[#1a4d3a]/40"
              }`}
            />
          </div>
        )}
      </div>

      {/* CONTEXT MENU AYAT */}
      {ayatMenu && surat && (
        <div className="fixed inset-0 z-[110] flex items-end justify-center bg-black/55" onClick={closeAyatMenu}>
          <div className="w-full max-w-[480px] rounded-t-2xl bg-white pt-4 pb-7" onClick={(e) => e.stopPropagation()}>
            <div className="border-b border-[rgba(13,79,60,0.1)] px-5 pb-4 text-center font-display text-[17px] font-bold text-dk">
              QS. {surat.namaLatin}: Ayat {ayatMenu.nomorAyat}
            </div>
            <button onClick={() => ayatAction("play")} className="flex w-full items-center gap-4 px-5 py-4 text-left text-[16px] font-medium text-dk transition active:bg-gp">
              <span className="w-7 text-center text-[20px] text-g">▶</span>
              <span>Putar Murattal</span>
            </button>
            <button onClick={() => ayatAction("share")} className="flex w-full items-center gap-4 px-5 py-4 text-left text-[16px] font-medium text-dk transition active:bg-gp">
              <span className="w-7 text-center text-[20px] text-[#2196f3]">↗</span>
              <span>Bagikan Ayat</span>
            </button>
            <button onClick={() => ayatAction("copy")} className="flex w-full items-center gap-4 px-5 py-4 text-left text-[16px] font-medium text-dk transition active:bg-gp">
              <span className="w-7 text-center text-[20px] text-au">⧉</span>
              <span>Salin Ayat</span>
            </button>
            <button onClick={() => ayatAction("bookmark")} className="flex w-full items-center gap-4 px-5 py-4 text-left text-[16px] font-medium text-dk transition active:bg-gp">
              <span className="w-7 text-center text-[20px] text-[#9c27b0]">
                {isBookmarked(surat.nomor, ayatMenu.nomorAyat) ? "★" : "☆"}
              </span>
              <span>
                {isBookmarked(surat.nomor, ayatMenu.nomorAyat)
                  ? "Hapus dari Bookmark"
                  : "Tambah ke Bookmark"}
              </span>
            </button>
            <button onClick={() => ayatAction("mark")} className="flex w-full items-center gap-4 px-5 py-4 text-left text-[16px] font-medium text-dk transition active:bg-gp">
              <span className="w-7 text-center text-[20px] text-g">🔖</span>
              <span>Tandai Terakhir Baca</span>
            </button>
            <button onClick={closeAyatMenu} className="mx-3 mt-3 w-[calc(100%-1.5rem)] rounded-xl border-[1.5px] border-[rgba(13,79,60,0.13)] bg-bg py-3.5 text-[15px] font-semibold text-mu transition active:bg-gp">
              Batal
            </button>
          </div>
        </div>
      )}

      {/* AYAT PICKER MODAL — loncat ke ayat */}
      {ayatPicker && surat && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/55 p-5" onClick={() => setAyatPicker(false)}>
          <div className="w-full max-w-[380px] overflow-hidden rounded-2xl bg-white shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between bg-gradient-to-br from-g to-g2 px-5 py-3.5 text-white">
              <div className="font-display text-[18px] font-bold">Loncat ke Ayat</div>
              <button onClick={() => setAyatPicker(false)} className="size-8 rounded-full bg-white/15 text-[14px]">✕</button>
            </div>
            <div className="max-h-[60vh] overflow-y-auto p-3">
              <div className="grid grid-cols-5 gap-2">
                {surat.ayat.map((a) => (
                  <button
                    key={a.nomorAyat}
                    onClick={() => loncatKeAyat(a.nomorAyat)}
                    className="aspect-square rounded-lg border border-[rgba(13,79,60,0.13)] bg-bg text-[15px] font-bold text-g transition active:scale-90 hover:bg-g hover:text-white"
                  >
                    {a.nomorAyat}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* BODY */}
      <div
        ref={bodyRef}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        className="flex-1 overflow-y-auto px-3.5 pt-3.5 pb-[calc(env(safe-area-inset-bottom)+16px)]"
        style={{ transform: swipeDx ? `translateX(${swipeDx}px)` : undefined, transition: swipeDx ? "none" : "transform .25s ease" }}
      >
        {err && (
          <div className="rounded-xl bg-red-50 px-4 py-3 text-[14px] text-red-700">⚠️ {err}</div>
        )}

        {!data && !err && (
          <div className="py-14 text-center text-[15px] text-mu">
            <div className="mb-1 font-bold text-g text-[16px]">⏳ Memuat Al-Qur'an...</div>
            <div>Sekitar 7 MB — hanya download sekali.</div>
          </div>
        )}

        {data && showPicker && (
          <div>
            {filteredSurat.length === 0 ? (
              <div className="py-11 text-center text-[15px] text-mu">🔍 Tidak ditemukan surat yang cocok.</div>
            ) : (
              filteredSurat.map((s, i) => (
                <button
                  key={s.nomor}
                  onClick={() => setNomor(s.nomor)}
                  className="anim-rise mb-2 flex w-full items-center gap-3 rounded-2xl bg-white px-3.5 py-3.5 text-left shadow-[0_3px_14px_rgba(13,79,60,0.08)] transition-all active:scale-[0.98]"
                  style={{ animationDelay: `${Math.min(i, 15) * 0.015}s` }}
                >
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-full border-[1.5px] border-[rgba(13,79,60,0.13)] bg-gp font-display text-[14px] font-bold text-g">
                    {s.nomor}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-display text-[16px] font-bold text-dk">{s.namaLatin}</div>
                    <div className="text-[12px] text-mu">
                      {s.arti} · {s.jumlahAyat} ayat · {s.tempatTurun}
                    </div>
                  </div>
                  <div className="font-arab text-[22px] leading-none text-g">{s.nama}</div>
                </button>
              ))
            )}
          </div>
        )}

        {data && surat && (
          <div>
            {surat.deskripsi && (
              <div className="mb-3 rounded-xl border border-[rgba(13,79,60,0.08)] bg-white px-3.5 py-3 text-[14px] leading-relaxed text-mu">
                {stripTags(surat.deskripsi)}
              </div>
            )}
            {surat.ayat.map((a, i) => {
              const isPlaying = playingAyat === a.nomorAyat;
              const hasAudio = a.audio && Object.keys(a.audio).length > 0;
              return (
                <div
                  key={a.nomorAyat}
                  id={`ayat-${a.nomorAyat}`}
                  className={`anim-rise mb-3 select-none rounded-2xl px-3 pt-3.5 pb-3 transition-all ${
                    isPlaying
                      ? dark
                        ? "bg-[#2a3a32] shadow-[0_8px_28px_rgba(232,201,109,0.25)] ring-2 ring-aul"
                        : "bg-[#fef8e6] shadow-[0_6px_22px_rgba(201,168,76,0.25)] ring-2 ring-au"
                      : dark
                      ? "bg-[#1b2a25] shadow-[0_4px_18px_rgba(0,0,0,0.5)]"
                      : "bg-[#fdf8e8] shadow-[0_2px_10px_rgba(0,0,0,0.04)]"
                  }`}
                  style={{ animationDelay: `${Math.min(i, 20) * 0.012}s` }}
                  onClick={() => openAyatMenu(a)}
                  onContextMenu={(e) => { e.preventDefault(); openAyatMenu(a); }}
                  onTouchStart={() => pressStart(a)}
                  onTouchEnd={pressCancel}
                  onTouchMove={pressCancel}
                  onTouchCancel={pressCancel}
                >
                  {/* Baris atas: nomor ornamental (kiri) + ayat arab (kanan) */}
                  <div className="mb-2 flex items-start gap-2">
                    <AyatNumber n={a.nomorAyat} dark={dark} isPlaying={isPlaying} />
                    <div
                      className={`flex-1 pt-1 text-right font-arab leading-[2] ${dark ? "text-[#f0f4f1]" : "text-[#0f3b2c]"}`}
                      dir="rtl"
                      style={{ fontSize: settings.fontArab }}
                    >
                      {a.teksArab}
                      {settings.showAyatNumberArab && (
                        <span
                          className="mx-1 inline-block text-[0.7em] font-normal"
                          style={{ color: dark ? "#4dd1b6" : "#4a9b6b" }}
                        >
                          ﴾{toArabicNum(a.nomorAyat)}﴿
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Latin (teal italic) */}
                  {settings.showLatin && a.teksLatin && (
                    <div
                      className={`mb-1.5 leading-[1.55] ${dark ? "text-[#7dc3a6]" : "text-[#4a9b6b]"}`}
                      style={{ fontSize: settings.fontLatin }}
                    >
                      {a.teksLatin}
                    </div>
                  )}

                  {/* Terjemahan */}
                  {settings.showTerjemah && a.teksIndonesia && (
                    <div
                      className={`leading-[1.6] ${dark ? "text-[#cbd5e1]" : "text-[#2d3a36]"}`}
                      style={{ fontSize: settings.fontTerjemah }}
                    >
                      {a.teksIndonesia}
                    </div>
                  )}

                  {/* Tombol play ayat (bottom right, kecil) */}
                  {hasAudio && (
                    <div className="mt-2 flex justify-end">
                      <button
                        onClick={(e) => { e.stopPropagation(); playAyat(a.nomorAyat); }}
                        className={`flex size-8 items-center justify-center rounded-full transition-all active:scale-90 ${
                          isPlaying
                            ? "bg-au text-white"
                            : dark
                            ? "bg-white/[0.06] text-aul"
                            : "bg-[#e6dcc0] text-[#1a4d3a]"
                        }`}
                        aria-label={isPlaying ? "Hentikan ayat" : "Putar ayat"}
                      >
                        {isPlaying ? (
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                            <rect x="6" y="5" width="4" height="14" />
                            <rect x="14" y="5" width="4" height="14" />
                          </svg>
                        ) : (
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                            <polygon points="5 3 19 12 5 21 5 3" />
                          </svg>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
            <div className="py-4 text-center text-[12px] text-mu">
              💡 <b>Geser kiri/kanan</b> untuk pindah surat · <b>Ketuk</b> ayat untuk tandai / putar / bagikan
            </div>
          </div>
        )}
      </div>

      {/* AUTO-PLAY STATUS BAR */}
      {autoPlay && surat && playingAyat != null && (
        <div className="bg-gradient-to-br from-au to-[#b8943f] px-4 py-3 text-white shadow-[0_-6px_20px_rgba(0,0,0,0.2)]">
          <div className="flex items-center gap-3">
            <span className="text-[14px] font-bold">🎧 Auto-Baca</span>
            <span className="text-[13px]">
              Ayat <b>{playingAyat}</b> / {surat.ayat.length}
            </span>
            <div className="ml-auto h-1.5 flex-1 overflow-hidden rounded-full bg-white/30">
              <div className="h-full bg-white transition-all" style={{ width: `${(playingAyat / surat.ayat.length) * 100}%` }} />
            </div>
            <button onClick={stopAutoPlay} className="rounded-md bg-black/25 px-3 py-1 text-[12px] font-bold transition active:scale-95">Stop</button>
          </div>
        </div>
      )}
    </div>
  );

  return createPortal(content, document.body);
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function toArabicNum(n: number): string {
  const digits = "٠١٢٣٤٥٦٧٨٩";
  return String(n).split("").map((d) => digits[+d] ?? d).join("");
}

// Juz number untuk awal surat (114 surat → 30 juz)
function getJuzForSurat(suratNum: number): number {
  const map: Record<number, number> = {
    1:1, 2:1, 3:3, 4:4, 5:6, 6:7, 7:8, 8:9, 9:10, 10:11,
    11:11, 12:12, 13:13, 14:13, 15:14, 16:14, 17:15, 18:15, 19:16, 20:16,
    21:17, 22:17, 23:18, 24:18, 25:18, 26:19, 27:19, 28:20, 29:20, 30:21,
    31:21, 32:21, 33:21, 34:22, 35:22, 36:22, 37:23, 38:23, 39:23, 40:24,
    41:24, 42:25, 43:25, 44:25, 45:25, 46:26, 47:26, 48:26, 49:26, 50:26,
    51:26, 52:27, 53:27, 54:27, 55:27, 56:27, 57:27, 58:28, 59:28, 60:28,
    61:28, 62:28, 63:28, 64:28, 65:28, 66:28, 67:29, 68:29, 69:29, 70:29,
    71:29, 72:29, 73:29, 74:29, 75:29, 76:29, 77:29,
  };
  if (map[suratNum]) return map[suratNum];
  if (suratNum >= 78) return 30;
  return 1;
}

// ═══════════════════════════════════════════
// SUB-COMPONENTS
// ═══════════════════════════════════════════

function HeaderIcon({
  children, onClick, dark, title, ariaLabel, active = false, disabled = false,
}: {
  children: React.ReactNode;
  onClick: () => void;
  dark: boolean;
  title: string;
  ariaLabel: string;
  active?: boolean;
  disabled?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={title}
      aria-label={ariaLabel}
      className={`flex size-10 items-center justify-center rounded-full transition active:scale-90 ${
        active
          ? (dark ? "bg-aul text-dk" : "bg-g text-white animate-pulse")
          : (dark ? "text-white/85 hover:bg-white/10" : "text-[#1a4d3a] hover:bg-black/5")
      } disabled:opacity-40`}
    >
      {children}
    </button>
  );
}

// Nomor ayat ornamental — bentuk octagonal/hexagonal seperti screenshot
function AyatNumber({ n, dark, isPlaying }: { n: number; dark: boolean; isPlaying: boolean }) {
  const bg = isPlaying
    ? (dark ? "#e8c96d" : "#c9a84c")
    : (dark ? "transparent" : "transparent");
  const border = isPlaying
    ? (dark ? "#e8c96d" : "#c9a84c")
    : (dark ? "#4dd1b6" : "#4a9b6b");
  const color = isPlaying
    ? "#1a4d3a"
    : (dark ? "#4dd1b6" : "#4a9b6b");

  return (
    <div className="shrink-0">
      <div
        className="flex size-9 items-center justify-center font-display text-[13px] font-bold leading-none"
        style={{
          backgroundColor: bg,
          border: `1.5px solid ${border}`,
          color,
          clipPath: "polygon(25% 0, 75% 0, 100% 25%, 100% 75%, 75% 100%, 25% 100%, 0 75%, 0 25%)",
        }}
      >
        {n}
      </div>
    </div>
  );
}

// Ornament di sudut container pills
function Ornament({ position, dark }: { position: "tl" | "tr" | "bl" | "br"; dark: boolean }) {
  const pos: Record<string, string> = {
    tl: "top-0 left-0",
    tr: "top-0 right-0 rotate-90",
    bl: "bottom-0 left-0 -rotate-90",
    br: "bottom-0 right-0 rotate-180",
  };
  const color = dark ? "#e8c96d" : "#1a4d3a";
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      className={`pointer-events-none absolute ${pos[position]}`}
      fill="none"
    >
      <path d="M0 1 L1 1 L1 0" stroke={color} strokeWidth="1.5" />
      <path d="M0 5 L5 5 L5 0" stroke={color} strokeWidth="0.8" opacity="0.5" />
    </svg>
  );
}
