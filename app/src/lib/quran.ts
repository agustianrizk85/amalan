export type Ayat = {
  nomorAyat: number;
  teksArab: string;
  teksLatin?: string;
  teksIndonesia?: string;
  audio?: Record<string, string>;
};

export type SuratLengkap = {
  nomor: number;
  nama: string;
  namaLatin: string;
  arti: string;
  jumlahAyat: number;
  tempatTurun: string;
  deskripsi?: string;
  audioFull?: Record<string, string>;
  ayat: Ayat[];
};

export type QuranData = {
  surat: SuratLengkap[];
  total_surat: number;
};

export const QARI = [
  { id: "01", nama: "Abdullah Al-Juhany" },
  { id: "02", nama: "Abdul Muhsin Al-Qasim" },
  { id: "03", nama: "Abdurrahman As-Sudais" },
  { id: "04", nama: "Ibrahim Al-Dossari" },
  { id: "05", nama: "Misyari Rasyid Al-Afasy" },
  { id: "06", nama: "Yasser Al-Dosari" },
] as const;

let cache: QuranData | null = null;
let inflight: Promise<QuranData> | null = null;

export function loadQuran(): Promise<QuranData> {
  if (cache) return Promise.resolve(cache);
  if (inflight) return inflight;
  inflight = import("@/data/quran_lengkap.json").then((mod) => {
    cache = mod.default as QuranData;
    inflight = null;
    return cache;
  });
  return inflight;
}

export function stripTags(s: string | undefined): string {
  if (!s) return "";
  return s.replace(/<[^>]*>/g, "").replace(/&nbsp;/g, " ").trim();
}
