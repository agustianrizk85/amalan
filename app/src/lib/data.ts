export type AmalanKategori = "sholat" | "quran" | "dzikir" | "puasa" | "doa" | "lainnya";

export type Surat = {
  id: string;
  name: string;
  arabic: string;
  ayat: number;
  satuan?: string;
  poin: number;
  tema: string;
  kategori: AmalanKategori;
  grup?: string;      // sub-section dalam kategori (e.g., "Wajib", "Sunnah Khusus")
  keutamaan?: string;
  nomor?: number;     // nomor surat 1-114 untuk Quran Reader
  picker?: boolean;   // true → buka surat picker (untuk Tadarus)
};

export const KATEGORI: { id: AmalanKategori | "all"; label: string; icon: string }[] = [
  { id: "all",     label: "Semua",      icon: "✨" },
  { id: "sholat",  label: "Sholat",     icon: "🕌" },
  { id: "quran",   label: "Al-Qur'an",  icon: "📖" },
  { id: "dzikir",  label: "Dzikir",     icon: "📿" },
  { id: "doa",     label: "Doa Harian", icon: "🤲" },
  { id: "puasa",   label: "Puasa",      icon: "🌙" },
  { id: "lainnya", label: "Lainnya",    icon: "💫" },
];

export const SURAT: Surat[] = [
  // ─── SHOLAT WAJIB ───
  { id: "sholat-subuh",   kategori: "sholat", name: "Sholat Subuh",   arabic: "الصبح",   ayat: 2, satuan: "rakaat", poin: 30, tema: "Sholat Wajib",          keutamaan: '"Sholat Subuh berjamaah pahalanya seperti sholat semalam penuh." (HR. Muslim)' },
  { id: "sholat-dzuhur",  kategori: "sholat", name: "Sholat Dzuhur",  arabic: "الظهر",   ayat: 4, satuan: "rakaat", poin: 30, tema: "Sholat Wajib",          keutamaan: "Menjaga sholat di tengah kesibukan dunia — bukti cinta pada Allah." },
  { id: "sholat-ashar",   kategori: "sholat", name: "Sholat Ashar",   arabic: "العصر",   ayat: 4, satuan: "rakaat", poin: 30, tema: "Sholat Wajib",          keutamaan: '"Barang siapa meninggalkan sholat Ashar, terhapus amal kebaikannya." (HR. Bukhari)' },
  { id: "sholat-maghrib", kategori: "sholat", name: "Sholat Maghrib", arabic: "المغرب",  ayat: 3, satuan: "rakaat", poin: 30, tema: "Sholat Wajib",          keutamaan: "Penutup ibadah siang & pembuka ibadah malam." },
  { id: "sholat-isya",    kategori: "sholat", name: "Sholat Isya",    arabic: "العشاء",  ayat: 4, satuan: "rakaat", poin: 30, tema: "Sholat Wajib",          keutamaan: '"Sholat Isya berjamaah seperti sholat separuh malam." (HR. Muslim)' },

  // ─── SHOLAT SUNNAH ───
  { id: "tahajud",        kategori: "sholat", name: "Sholat Tahajud", arabic: "التهجد",  ayat: 2, satuan: "rakaat", poin: 40, tema: "Sunnah Malam",          keutamaan: '"Sebaik-baik sholat setelah yang wajib adalah sholat malam." (HR. Muslim)' },
  { id: "dhuha",          kategori: "sholat", name: "Sholat Dhuha",   arabic: "الضحى",   ayat: 2, satuan: "rakaat", poin: 35, tema: "Sunnah Pagi",           keutamaan: '"Dua rakaat Dhuha mencukupi sedekah seluruh persendian." (HR. Muslim)' },
  { id: "witir",          kategori: "sholat", name: "Sholat Witir",   arabic: "الوتر",   ayat: 1, satuan: "rakaat", poin: 25, tema: "Sunnah Penutup",        keutamaan: '"Sesungguhnya Allah witir dan mencintai yang witir." (HR. Bukhari & Muslim)' },
  { id: "rawatib-subuh",  kategori: "sholat", name: "Qabliyah Subuh", arabic: "قبل الصبح", ayat: 2, satuan: "rakaat", poin: 20, tema: "Sunnah Rawatib",       keutamaan: '"Dua rakaat fajar lebih baik dari dunia dan seisinya." (HR. Muslim)' },
  { id: "rawatib-dzuhur", kategori: "sholat", name: "Rawatib Dzuhur", arabic: "رواتب",   ayat: 4, satuan: "rakaat", poin: 20, tema: "Sunnah Rawatib",        keutamaan: "Diharamkan api neraka bagi yang menjaganya. (HR. Tirmidzi)" },

  // ─── QUR'AN ───
  { id: "tadarus-juz",    kategori: "quran",  name: "Tadarus 1 Juz",     arabic: "تلاوة",   ayat: 20, satuan: "lembar", poin: 50, tema: "Membaca Al-Qur'an",    keutamaan: '"Bacalah Al-Qur\'an, ia datang sebagai pemberi syafaat di hari kiamat." (HR. Muslim)', picker: true },
  { id: "tadarus-lembar", kategori: "quran",  name: "Tadarus 1 Lembar",  arabic: "صفحة",    ayat: 1,  satuan: "lembar", poin: 15, tema: "Setiap huruf 10 kebaikan", keutamaan: "Satu huruf Al-Qur'an = 10 kebaikan. (HR. Tirmidzi)", picker: true },
  { id: "fatihah",        kategori: "quran",  name: "Al-Fatihah",        arabic: "الفاتحة", ayat: 7,  poin: 10, tema: "Ummul Kitab",           keutamaan: "Surat paling agung dalam Al-Qur'an. (HR. Bukhari)", nomor: 1 },
  { id: "waqiah",         kategori: "quran",  name: "Al-Wāqi'ah",        arabic: "الواقعة", ayat: 96, poin: 50, tema: "Rezeki & Kemakmuran",   keutamaan: '"Siapa membaca Al-Waqi\'ah setiap malam, tidak akan ditimpa kefakiran." (HR. Baihaqi)', nomor: 56 },
  { id: "rahman",         kategori: "quran",  name: "Ar-Rahmān",         arabic: "الرحمن",  ayat: 78, poin: 45, tema: "Kasih Sayang Allah",    keutamaan: '"Untuk setiap sesuatu ada pengantinnya, dan pengantin Al-Qur\'an adalah Ar-Rahman." (HR. Baihaqi)', nomor: 55 },
  { id: "yasin",          kategori: "quran",  name: "Yā-Sīn",            arabic: "يس",      ayat: 83, poin: 55, tema: "Jantung Al-Qur'an",     keutamaan: '"Yasin adalah jantung Al-Qur\'an." (HR. Tirmidzi)', nomor: 36 },
  { id: "mulk",           kategori: "quran",  name: "Al-Mulk",           arabic: "الملك",   ayat: 30, poin: 35, tema: "Penjaga dari Azab Kubur", keutamaan: '"Al-Mulk memberi syafaat sampai pembacanya diampuni." (HR. Tirmidzi)', nomor: 67 },
  { id: "kahfi",          kategori: "quran",  name: "Al-Kahfi",          arabic: "الكهف",   ayat: 110,poin: 65, tema: "Cahaya Antara Dua Jumat", keutamaan: '"Siapa membaca Al-Kahfi di hari Jumat, diberi cahaya hingga Jumat berikutnya." (HR. Hakim)', nomor: 18 },
  { id: "juzzamma",       kategori: "quran",  name: "Juz 'Amma",         arabic: "جزء عم",  ayat: 37, satuan: "surat",  poin: 100,tema: "37 Surat Pendek",       keutamaan: "Mudah dihafal, kaya pelajaran tauhid dan akhirat.", nomor: 78 },

  // ─── DZIKIR & DOA ───
  { id: "dzikir-pagi",  kategori: "dzikir", name: "Dzikir Pagi",       arabic: "أذكار الصباح", ayat: 1, satuan: "kali", poin: 30, tema: "al-Ma'tsurat Subuh",   keutamaan: "Benteng dari kejahatan setan, jin, dan sumber ketenangan sepanjang hari." },
  { id: "dzikir-sore",  kategori: "dzikir", name: "Dzikir Sore",       arabic: "أذكار المساء", ayat: 1, satuan: "kali", poin: 30, tema: "al-Ma'tsurat Petang",  keutamaan: '"Tidak akan ada bahaya yang menimpa orang yang membaca dzikir sore." (HR. Abu Dawud)' },
  { id: "dzikir-sholat",kategori: "dzikir", name: "Dzikir Ba'da Sholat", arabic: "بعد الصلاة", ayat: 33, satuan: "kali", poin: 25, tema: "Subhanallah · Alhamdulillah · Allahu Akbar", keutamaan: '"Dosanya diampuni meski sebanyak buih di lautan." (HR. Muslim)' },
  { id: "sholawat",     kategori: "dzikir", name: "Sholawat 100×",     arabic: "الصلاة على النبي", ayat: 100, satuan: "kali", poin: 20, tema: "Cinta Rasulullah ﷺ", keutamaan: '"Satu sholawat darimu, sepuluh sholawat dari Allah untukmu." (HR. Muslim)' },
  { id: "istighfar",    kategori: "dzikir", name: "Istighfar 100×",    arabic: "استغفر الله", ayat: 100, satuan: "kali", poin: 20, tema: "Pintu Ampunan",       keutamaan: '"Siapa membiasakan istighfar, Allah jadikan kelapangan dari setiap kesempitan." (HR. Abu Dawud)' },
  { id: "tasbih",       kategori: "dzikir", name: "Tasbih 33×",        arabic: "سبحان الله", ayat: 33, satuan: "kali", poin: 15, tema: "Subhanallah",          keutamaan: "Menanam pohon di surga untuk setiap tasbih. (HR. Tirmidzi)" },

  // ─── PUASA SUNNAH ───
  { id: "puasa-senin",  kategori: "puasa",  name: "Puasa Senin",       arabic: "صوم الاثنين", ayat: 1, satuan: "hari", poin: 60, tema: "Hari Lahir Nabi ﷺ",   keutamaan: '"Itulah hari aku dilahirkan dan diturunkan wahyu kepadaku." (HR. Muslim)' },
  { id: "puasa-kamis",  kategori: "puasa",  name: "Puasa Kamis",       arabic: "صوم الخميس",  ayat: 1, satuan: "hari", poin: 60, tema: "Amal Diangkat",       keutamaan: "Senin & Kamis amal dihadapkan kepada Allah — aku suka amalku dihadapkan saat berpuasa. (HR. Tirmidzi)" },
  { id: "puasa-bidh",   kategori: "puasa",  name: "Ayyamul Bidh",      arabic: "الأيام البيض",ayat: 3, satuan: "hari", poin: 75, tema: "13, 14, 15 Hijriyah", keutamaan: "Setara dengan puasa setahun penuh. (HR. Nasa'i)" },

  // ─── LAINNYA ───
  { id: "sedekah",      kategori: "lainnya", name: "Sedekah Harian",  arabic: "الصدقة",  ayat: 1, satuan: "kali", poin: 30, tema: "Membersihkan Harta",      keutamaan: '"Sedekah memadamkan dosa seperti air memadamkan api." (HR. Tirmidzi)' },
  { id: "senyum-salam", kategori: "lainnya", name: "Senyum & Salam",  arabic: "السلام",  ayat: 1, satuan: "kali", poin: 10, tema: "Adab Sesama Muslim",       keutamaan: '"Senyummu di hadapan saudaramu adalah sedekah." (HR. Tirmidzi)' },
  { id: "bantu-sesama", kategori: "lainnya", name: "Bantu Sesama",    arabic: "الإحسان", ayat: 1, satuan: "kali", poin: 20, tema: "Berbuat Baik",             keutamaan: '"Allah menolongmu selama engkau menolong saudaramu." (HR. Muslim)' },
  { id: "doa-ortu",     kategori: "doa",     name: "Doa untuk Ortu",  arabic: "دعاء الوالدين", ayat: 1, satuan: "kali", poin: 15, tema: "Birrul Walidain",        keutamaan: "Doa anak yang sholeh — amal yang tidak terputus. (HR. Muslim)" },

  // ─── SHOLAT KHUSUS ───
  { id: "sholat-tarawih",     kategori: "sholat", name: "Sholat Tarawih",     arabic: "التراويح",  ayat: 8,  satuan: "rakaat", poin: 50, tema: "Sunnah Ramadhan",    keutamaan: '"Siapa qiyam Ramadhan dengan iman dan ihtisab, diampuni dosanya yang lalu." (HR. Bukhari)' },
  { id: "sholat-hajat",       kategori: "sholat", name: "Sholat Hajat",       arabic: "الحاجة",    ayat: 2,  satuan: "rakaat", poin: 35, tema: "Minta Keperluan",    keutamaan: "Sholat 2 rakaat saat punya hajat besar — dikabulkan dengan izin Allah." },
  { id: "sholat-istikharah",  kategori: "sholat", name: "Sholat Istikharah",  arabic: "الاستخارة", ayat: 2,  satuan: "rakaat", poin: 40, tema: "Minta Petunjuk",     keutamaan: "Untuk meminta pilihan terbaik dari Allah dalam keputusan penting." },
  { id: "sholat-taubat",      kategori: "sholat", name: "Sholat Taubat",      arabic: "التوبة",    ayat: 2,  satuan: "rakaat", poin: 45, tema: "Memohon Ampun",      keutamaan: '"Siapa yang berdosa lalu wudhu dan sholat 2 rakaat, pasti Allah ampuni." (HR. Tirmidzi)' },
  { id: "sholat-tasbih",      kategori: "sholat", name: "Sholat Tasbih",      arabic: "التسبيح",   ayat: 4,  satuan: "rakaat", poin: 50, tema: "Penghapus Dosa",     keutamaan: "Diajarkan Nabi kepada paman beliau Abbas — menghapus dosa dari yang pertama hingga terakhir." },
  { id: "sholat-jenazah",     kategori: "sholat", name: "Sholat Jenazah",     arabic: "الجنازة",   ayat: 4,  satuan: "takbir", poin: 40, tema: "Hak Sesama Muslim",  keutamaan: '"Siapa yang menyolatkan jenazah, baginya 1 qirath pahala — sebesar gunung." (HR. Bukhari)' },
  { id: "sholat-jumat",       kategori: "sholat", name: "Sholat Jumat",       arabic: "الجمعة",    ayat: 2,  satuan: "rakaat", poin: 50, tema: "Wajib Setiap Jumat", keutamaan: "Hari Jumat adalah sayyidul ayyam (raja semua hari). Sholat Jumat menggugurkan dosa antar Jumat." },
  { id: "sholat-idul-fitri",  kategori: "sholat", name: "Sholat Idul Fitri",  arabic: "عيد الفطر",  ayat: 2,  satuan: "rakaat", poin: 60, tema: "1 Syawal",           keutamaan: "Sholat berjamaah merayakan kemenangan setelah Ramadhan." },
  { id: "sholat-idul-adha",   kategori: "sholat", name: "Sholat Idul Adha",   arabic: "عيد الأضحى", ayat: 2,  satuan: "rakaat", poin: 60, tema: "10 Dzulhijjah",      keutamaan: "Sholat ied + qurban — meneladani pengorbanan Nabi Ibrahim AS." },

  // ─── PUASA TAMBAHAN ───
  { id: "puasa-ramadhan",     kategori: "puasa",  name: "Puasa Ramadhan",     arabic: "صوم رمضان",  ayat: 1, satuan: "hari", poin: 100, tema: "Rukun Islam ke-4",     keutamaan: '"Setiap amal anak Adam untuknya, kecuali puasa — ia untuk-Ku dan Aku yang membalasnya." (HR. Bukhari)' },
  { id: "puasa-syawal",       kategori: "puasa",  name: "Puasa Syawal",       arabic: "صوم شوال",   ayat: 6, satuan: "hari", poin: 80,  tema: "6 Hari di Syawal",     keutamaan: '"Puasa Ramadhan + 6 hari Syawal = puasa setahun penuh." (HR. Muslim)' },
  { id: "puasa-arafah",       kategori: "puasa",  name: "Puasa Arafah",       arabic: "صوم عرفة",   ayat: 1, satuan: "hari", poin: 90,  tema: "9 Dzulhijjah",         keutamaan: '"Menghapus dosa setahun yang lalu dan setahun yang akan datang." (HR. Muslim)' },
  { id: "puasa-tasua",        kategori: "puasa",  name: "Puasa Tasua",        arabic: "صوم تاسوعاء",ayat: 1, satuan: "hari", poin: 70,  tema: "9 Muharram",           keutamaan: "Sunnah dilakukan bersama Asyura untuk membedakan dari Yahudi." },
  { id: "puasa-asyura",       kategori: "puasa",  name: "Puasa Asyura",       arabic: "صوم عاشوراء",ayat: 1, satuan: "hari", poin: 80,  tema: "10 Muharram",          keutamaan: '"Menghapus dosa setahun yang lalu." (HR. Muslim)' },
  { id: "puasa-daud",         kategori: "puasa",  name: "Puasa Daud",         arabic: "صوم داود",   ayat: 1, satuan: "hari", poin: 85,  tema: "Selang-seling",        keutamaan: '"Puasa yang paling dicintai Allah adalah puasa Nabi Daud — sehari puasa, sehari tidak." (HR. Bukhari)' },
  { id: "puasa-qadha",        kategori: "puasa",  name: "Puasa Qadha",        arabic: "صوم قضاء",   ayat: 1, satuan: "hari", poin: 70,  tema: "Mengganti Ramadhan",   keutamaan: "Kewajiban mengganti puasa Ramadhan yang ditinggalkan karena uzur." },

  // ─── DZIKIR TAMBAHAN ───
  { id: "asmaul-husna",       kategori: "dzikir", name: "Asmaul Husna",       arabic: "الأسماء الحسنى", ayat: 99, satuan: "nama", poin: 50, tema: "99 Nama Allah",     keutamaan: '"Siapa yang menghafalnya, akan masuk surga." (HR. Bukhari Muslim)' },
  { id: "tahlil",             kategori: "dzikir", name: "Tahlil & Yasin",     arabic: "تهليل",     ayat: 1,  satuan: "rangkaian", poin: 60, tema: "Khas Indonesia",     keutamaan: "Bacaan tahlil — La ilaha illallah. Susunan lengkap untuk yasinan/kirim doa." },
  { id: "khatmil-quran",      kategori: "dzikir", name: "Doa Khatmil Qur'an", arabic: "ختم القرآن",ayat: 1,  satuan: "kali", poin: 40, tema: "Selesai Tilawah",       keutamaan: "Dibaca saat menyelesaikan tilawah Al-Qur'an — momen mustajab." },
  { id: "qunut-nazilah",      kategori: "dzikir", name: "Qunut Nazilah",      arabic: "قنوت نازلة",ayat: 1,  satuan: "kali", poin: 35, tema: "Saat Musibah",          keutamaan: "Dibaca di rakaat terakhir sholat fardhu saat umat tertimpa musibah besar." },
  { id: "sholawat-nariyah",   kategori: "dzikir", name: "Sholawat Nariyah",   arabic: "النارية",   ayat: 4444,satuan: "kali", poin: 50, tema: "Pembuka Hajat",         keutamaan: "Diijazahkan oleh Imam Tafrizi — penolak bala & pembuka hajat. Tradisi pesantren Indonesia." },
  { id: "sholawat-munjiyat",  kategori: "dzikir", name: "Sholawat Munjiyat",  arabic: "المنجية",   ayat: 1000,satuan: "kali", poin: 45, tema: "Penyelamat Bahaya",     keutamaan: "Sholawat penyelamat — dari kesusahan, ketakutan, hajat dipenuhi." },
  { id: "sholawat-badar",     kategori: "dzikir", name: "Sholawat Badar",     arabic: "البدر",     ayat: 1,  satuan: "qoshidah", poin: 30, tema: "Tradisi NU Indonesia",  keutamaan: "Qoshidah karya KH. Ali Manshur Siddiq — populer di majelis sholawat NU." },

  // ─── DOA HARIAN ───
  { id: "doa-sebelum-makan",  kategori: "doa", name: "Doa Sebelum Makan",  arabic: "قبل الأكل",    ayat: 1, satuan: "kali", poin: 5,  tema: "Adab Makan",          keutamaan: "Mengingatkan bahwa rezeki dari Allah, mengundang keberkahan." },
  { id: "doa-sesudah-makan",  kategori: "doa", name: "Doa Sesudah Makan",  arabic: "بعد الأكل",    ayat: 1, satuan: "kali", poin: 5,  tema: "Syukur Makan",        keutamaan: "Menyempurnakan adab — bersyukur atas rezeki." },
  { id: "doa-sesudah-minum",  kategori: "doa", name: "Doa Sesudah Minum",  arabic: "بعد الشرب",    ayat: 1, satuan: "kali", poin: 5,  tema: "Syukur Minum",        keutamaan: "Mengingat nikmat air — salah satu nikmat terbesar." },
  { id: "doa-tidur",          kategori: "doa", name: "Doa Sebelum Tidur",  arabic: "قبل النوم",    ayat: 1, satuan: "kali", poin: 10, tema: "Adab Tidur",          keutamaan: "Tidur dalam keadaan suci & berdzikir — jika meninggal, dalam fitrah." },
  { id: "doa-bangun",         kategori: "doa", name: "Doa Bangun Tidur",   arabic: "الاستيقاظ",    ayat: 1, satuan: "kali", poin: 10, tema: "Syukur Hidup",        keutamaan: "Bersyukur Allah menghidupkan kembali setelah dimatikan (tidur)." },
  { id: "doa-masuk-wc",       kategori: "doa", name: "Doa Masuk WC",       arabic: "دخول الخلاء", ayat: 1, satuan: "kali", poin: 5,  tema: "Adab Buang Hajat",    keutamaan: "Perlindungan dari setan jantan dan betina di tempat kotor." },
  { id: "doa-keluar-wc",      kategori: "doa", name: "Doa Keluar WC",      arabic: "الخروج من الخلاء", ayat: 1, satuan: "kali", poin: 5,  tema: "Syukur Selesai",  keutamaan: "Syukur bahwa Allah hilangkan kotoran/bahaya dari tubuh kita." },
  { id: "doa-masuk-rumah",    kategori: "doa", name: "Doa Masuk Rumah",    arabic: "دخول البيت",  ayat: 1, satuan: "kali", poin: 5,  tema: "Adab di Rumah",       keutamaan: "Setan tidak akan masuk rumah yang penghuninya berdoa & bersalam." },
  { id: "doa-keluar-rumah",   kategori: "doa", name: "Doa Keluar Rumah",   arabic: "الخروج من البيت", ayat: 1, satuan: "kali", poin: 5,  tema: "Adab Keluar",      keutamaan: "Tawakal sebelum keluar — \"Cukuplah engkau, dijaga & dipelihara.\" (HR. Tirmidzi)" },
  { id: "doa-masuk-masjid",   kategori: "doa", name: "Doa Masuk Masjid",   arabic: "دخول المسجد", ayat: 1, satuan: "kali", poin: 5,  tema: "Adab Masjid",         keutamaan: "Memohon dibuka pintu rahmat Allah di rumah-Nya." },
  { id: "doa-keluar-masjid",  kategori: "doa", name: "Doa Keluar Masjid",  arabic: "الخروج من المسجد", ayat: 1, satuan: "kali", poin: 5,  tema: "Adab Keluar Masjid", keutamaan: "Memohon karunia Allah saat keluar dari rumah-Nya." },
  { id: "doa-wudhu",          kategori: "doa", name: "Doa Setelah Wudhu",  arabic: "بعد الوضوء",  ayat: 1, satuan: "kali", poin: 10, tema: "Penyempurna Wudhu",   keutamaan: '"Dibukakan baginya 8 pintu surga, masuk dari mana saja ia mau." (HR. Muslim)' },
  { id: "doa-kendaraan",      kategori: "doa", name: "Doa Naik Kendaraan", arabic: "الركوب",      ayat: 1, satuan: "kali", poin: 10, tema: "Adab Berkendara",     keutamaan: "Bersyukur atas nikmat kendaraan yang ditundukkan Allah untuk kita." },
  { id: "doa-safar",          kategori: "doa", name: "Doa Bepergian (Safar)", arabic: "السفر",   ayat: 1, satuan: "kali", poin: 15, tema: "Adab Perjalanan",      keutamaan: "Memohon keselamatan, ketakwaan, dan amal yang diridhai dalam perjalanan." },
  { id: "doa-sapu-jagad",     kategori: "doa", name: "Doa Sapu Jagad",     arabic: "ربنا آتنا",   ayat: 1, satuan: "kali", poin: 10, tema: "Dunia & Akhirat",     keutamaan: "Doa terlengkap dalam Al-Qur'an — mencakup kebaikan dunia & akhirat. (QS. Al-Baqarah: 201)" },
  { id: "doa-ilmu",           kategori: "doa", name: "Doa Minta Ilmu",     arabic: "زدني علما",   ayat: 1, satuan: "kali", poin: 10, tema: "Tambah Ilmu",         keutamaan: 'Doa yang Allah perintahkan langsung kepada Nabi ﷺ. (QS. Thaha: 114)' },
  { id: "doa-rezeki",         kategori: "doa", name: "Doa Minta Rezeki",   arabic: "رزقا حلالا", ayat: 1, satuan: "kali", poin: 10, tema: "Rezeki Halal",         keutamaan: "Memohon rezeki yang halal, baik, dan diberkahi." },
  { id: "doa-keturunan",      kategori: "doa", name: "Doa Minta Keturunan Sholeh", arabic: "ذرية طيبة", ayat: 1, satuan: "kali", poin: 15, tema: "Anak Sholeh", keutamaan: "Doa Nabi Zakaria AS — memohon keturunan yang baik. (QS. Ali Imran: 38)" },
  { id: "doa-lapang-dada",    kategori: "doa", name: "Doa Lapang Dada",    arabic: "اشرح صدري",  ayat: 1, satuan: "kali", poin: 10, tema: "Saat Cemas",          keutamaan: "Doa Nabi Musa AS — minta dilapangkan dada, dimudahkan urusan. (QS. Thaha: 25-28)" },
  { id: "doa-hujan",          kategori: "doa", name: "Doa Saat Hujan",     arabic: "صيب نافعا",  ayat: 1, satuan: "kali", poin: 10, tema: "Waktu Mustajab",       keutamaan: "Waktu hujan adalah waktu mustajab — perbanyak doa." },
  { id: "doa-besuk",          kategori: "doa", name: "Doa Besuk Orang Sakit", arabic: "زيارة المريض", ayat: 1, satuan: "kali", poin: 15, tema: "Hak Sesama",       keutamaan: '"Tidak ada hamba muslim yang membesuk orang sakit kecuali Allah utus 70 ribu malaikat mendoakannya." (HR. Tirmidzi)' },
  { id: "doa-ziarah-kubur",   kategori: "doa", name: "Doa Ziarah Kubur",   arabic: "زيارة القبور", ayat: 1, satuan: "kali", poin: 20, tema: "Mengingat Akhirat",   keutamaan: "Mengingat kematian — pelajaran terbaik tentang fana-nya dunia." },
  { id: "doa-lailatul-qadar", kategori: "doa", name: "Doa Lailatul Qadar", arabic: "ليلة القدر",  ayat: 1, satuan: "kali", poin: 30, tema: "10 Malam Terakhir Ramadhan", keutamaan: "Doa yang diajarkan Nabi kepada Aisyah saat Lailatul Qadar." },
  { id: "doa-talbiyah",       kategori: "doa", name: "Talbiyah Haji/Umroh",arabic: "تلبية",       ayat: 1, satuan: "kali", poin: 25, tema: "Ihram",               keutamaan: "Dibaca sejak niat ihram hingga melempar jumrah aqabah." },
  { id: "doa-akad-nikah",     kategori: "doa", name: "Doa Akad Nikah",     arabic: "النكاح",      ayat: 1, satuan: "kali", poin: 30, tema: "Setelah Akad",        keutamaan: "Doa dari Nabi ﷺ untuk pengantin agar dipenuhi keberkahan." },
  { id: "doa-aqiqah",         kategori: "doa", name: "Doa Aqiqah",         arabic: "العقيقة",     ayat: 1, satuan: "kali", poin: 25, tema: "Kelahiran Anak",      keutamaan: "Sunnah hari ke-7 kelahiran — sembelih kambing & doakan anak." },

  // ─── ADAB HARIAN (TAMBAHAN) ───
  { id: "doa-buka-puasa",     kategori: "doa", name: "Doa Berbuka Puasa",  arabic: "إفطار",        ayat: 1, satuan: "kali", poin: 10, tema: "Waktu Mustajab",       keutamaan: '"Telah hilang dahaga, urat-urat menjadi basah, pahala telah tetap insya Allah." (HR. Abu Dawud)' },
  { id: "doa-sahur",          kategori: "doa", name: "Doa Sahur (Niat Puasa)", arabic: "نية الصوم",ayat: 1, satuan: "kali", poin: 10, tema: "Awal Puasa",          keutamaan: '"Bersahurlah karena dalam sahur ada keberkahan." (HR. Bukhari & Muslim)' },
  { id: "doa-buka-orang",     kategori: "doa", name: "Doa Berbuka di Tempat Orang", arabic: "أفطر عندكم", ayat: 1, satuan: "kali", poin: 10, tema: "Tamu Berpuasa",      keutamaan: '"Berbukalah orang-orang berpuasa di rumah kalian, dimakan makanan kalian oleh orang-orang baik..." (HR. Abu Dawud)' },
  { id: "doa-bersin",         kategori: "doa", name: "Doa Bersin & Balasannya", arabic: "تشميت العاطس",ayat: 1, satuan: "kali", poin: 5,  tema: "Hak Sesama Muslim",   keutamaan: 'Bersin → "Alhamdulillah". Balasan → "Yarhamukallah". Pembersin balas → "Yahdikumullah." (HR. Bukhari)' },
  { id: "doa-bercermin",      kategori: "doa", name: "Doa Bercermin",       arabic: "النظر في المرآة", ayat: 1, satuan: "kali", poin: 5,  tema: "Adab Bercermin",    keutamaan: '"Allāhumma kamā ḥassanta khalqī fa-ḥassin khuluqī" — Ya Allah, sebagaimana Engkau perindah penciptaanku, perindahlah akhlakku. (HR. Ahmad)' },
  { id: "doa-pakaian-baru",   kategori: "doa", name: "Doa Pakaian Baru",    arabic: "لبس الجديد",  ayat: 1, satuan: "kali", poin: 5,  tema: "Syukur Sandang",       keutamaan: '"Allāhumma lakal-ḥamdu anta kasautanīh..." — Diampuni dosa yang lalu. (HR. Tirmidzi)' },
  { id: "doa-pakaian",        kategori: "doa", name: "Doa Memakai Pakaian", arabic: "اللبس",       ayat: 1, satuan: "kali", poin: 5,  tema: "Adab Berpakaian",     keutamaan: 'Memuji Allah atas nikmat pakaian — penutup aurat dan pelindung tubuh.' },
  { id: "doa-makan-lupa",     kategori: "doa", name: "Doa Makan Jika Lupa Bismillah", arabic: "أوله وآخره",ayat: 1, satuan: "kali", poin: 5,  tema: "Adab Makan",       keutamaan: '"Bismillāhi awwalahū wa ākhirah" — disebut di tengah jika lupa di awal. (HR. Tirmidzi)' },
  { id: "doa-mimpi-buruk",    kategori: "doa", name: "Doa Setelah Mimpi Buruk", arabic: "بعد الحلم السيئ",ayat: 1, satuan: "kali", poin: 10, tema: "Perlindungan Tidur",  keutamaan: 'Meludah ringan ke kiri 3×, ta\'awudz, lalu ganti posisi tidur. (HR. Bukhari & Muslim)' },
  { id: "doa-mimpi-baik",     kategori: "doa", name: "Doa Setelah Mimpi Baik", arabic: "بعد الحلم الحسن",ayat: 1, satuan: "kali", poin: 5,  tema: "Syukur Mimpi",       keutamaan: 'Bersyukur kepada Allah dan boleh menceritakan kepada orang yang dicintai. (HR. Bukhari)' },
  { id: "doa-pasar",          kategori: "doa", name: "Doa Masuk Pasar",     arabic: "دخول السوق",  ayat: 1, satuan: "kali", poin: 10, tema: "Tempat Lalai",        keutamaan: '"Lā ilāha illallāh waḥdahū lā syarīka lah..." — Ditulis baginya sejuta kebaikan & dihapus sejuta kesalahan. (HR. Tirmidzi)' },
  { id: "doa-zam-zam",        kategori: "doa", name: "Doa Minum Air Zam-zam", arabic: "ماء زمزم", ayat: 1, satuan: "kali", poin: 15, tema: "Air Berkah",          keutamaan: '"Air zam-zam sesuai dengan niat orang yang meminumnya." (HR. Ibnu Majah)' },
  { id: "doa-azab-kubur",     kategori: "doa", name: "Doa Perlindungan Azab Kubur", arabic: "من عذاب القبر",ayat: 1, satuan: "kali", poin: 10, tema: "Setelah Tasyahud Akhir",keutamaan: '"Allāhumma innī a\'ūdzu bika min \'adzābil-qabri..." — Diajarkan Nabi di tasyahud akhir. (HR. Bukhari)' },
  { id: "doa-istikharah-teks",kategori: "doa", name: "Doa Istikharah",      arabic: "الاستخارة",   ayat: 1, satuan: "kali", poin: 15, tema: "Setelah 2 Rakaat",    keutamaan: '"Jika kamu hendak melakukan sesuatu, sholatlah 2 rakaat lalu berdoa..." (HR. Bukhari)' },
  { id: "doa-qunut-subuh",    kategori: "doa", name: "Doa Qunut Subuh",     arabic: "قنوت الصبح",  ayat: 1, satuan: "kali", poin: 15, tema: "I\'tidal Rakaat Akhir",keutamaan: '"Allāhummahdinī fīman hadait..." — Diajarkan Rasulullah kepada Hasan bin Ali. (HR. Tirmidzi)' },

  // ─── SITUASIONAL (TAMBAHAN) ───
  { id: "doa-sakit",          kategori: "doa", name: "Doa Saat Sakit",      arabic: "عند المرض",   ayat: 1, satuan: "kali", poin: 10, tema: "Mohon Kesembuhan",     keutamaan: '"As\'alullāhal-\'aẓīma rabbal-\'arsyil-\'aẓīmi an yasyfiyaka" 7× — kecuali ajal, Allah sembuhkan. (HR. Tirmidzi)' },
  { id: "doa-jenguk-sakit",   kategori: "doa", name: "Doa Menjenguk Orang Sakit",arabic: "زيارة المريض",ayat: 1, satuan: "kali", poin: 15, tema: "Hak Sesama",         keutamaan: '"Lā ba\'sa ṭahūrun in syā\'allāh" — Tidak mengapa, semoga jadi penghapus dosa. (HR. Bukhari)' },
  { id: "doa-musibah",        kategori: "doa", name: "Doa Saat Tertimpa Musibah",arabic: "إنا لله",ayat: 1, satuan: "kali", poin: 15, tema: "Istirja\'",            keutamaan: '"Innā lillāhi wa innā ilaihi rāji\'ūn. Allāhumma\'jurnī fī muṣībatī..." — Allah ganti dengan yang lebih baik. (HR. Muslim)' },
  { id: "doa-marah",          kategori: "doa", name: "Doa Saat Marah",      arabic: "عند الغضب",   ayat: 1, satuan: "kali", poin: 10, tema: "Tahan Amarah",        keutamaan: '"A\'ūdzu billāhi minasy-syaiṭānir-rajīm" — Marah dari setan, padamkan dengan ta\'awudz. (HR. Bukhari)' },
  { id: "doa-sedih",          kategori: "doa", name: "Doa Hilangkan Kesedihan",arabic: "الهم والحزن",ayat: 1, satuan: "kali", poin: 15, tema: "Pelapang Hati",       keutamaan: '"Allāhumma innī \'abduka..." — Allah hilangkan kesedihannya, ganti dengan kebahagiaan. (HR. Ahmad)' },
  { id: "doa-takut",          kategori: "doa", name: "Doa Saat Takut",      arabic: "عند الخوف",   ayat: 1, satuan: "kali", poin: 10, tema: "Hasbunallah",         keutamaan: '"Ḥasbunallāhu wa ni\'mal-wakīl" — Doa Nabi Ibrahim di tengah api. (HR. Bukhari)' },
  { id: "doa-yunus-musibah",  kategori: "doa", name: "Doa Nabi Yunus (Musibah Besar)",arabic: "لا إله إلا أنت",ayat: 1, satuan: "kali", poin: 20, tema: "QS. Al-Anbiya: 87",  keutamaan: '"Lā ilāha illā anta subḥānaka innī kuntu minaẓ-ẓālimīn" — Allah selamatkan dari setiap kesusahan. (HR. Tirmidzi)' },
  { id: "doa-hutang",         kategori: "doa", name: "Doa Pelunas Hutang",  arabic: "قضاء الدين",  ayat: 1, satuan: "kali", poin: 15, tema: "Mohon Kecukupan",     keutamaan: '"Allāhummakfinī bi-ḥalālika \'an ḥarāmika wa aghninī bi-faḍlika \'amman siwāk." (HR. Tirmidzi)' },
  { id: "doa-angin",          kategori: "doa", name: "Doa Saat Angin Kencang",arabic: "عند الريح",ayat: 1, satuan: "kali", poin: 10, tema: "Tanda Kekuasaan",      keutamaan: '"Allāhumma innī as\'aluka khairahā..." — memohon kebaikan dan berlindung dari keburukannya. (HR. Muslim)' },
  { id: "doa-petir",          kategori: "doa", name: "Doa Saat Petir",      arabic: "عند الرعد",   ayat: 1, satuan: "kali", poin: 5,  tema: "Tanda Kekuasaan",     keutamaan: '"Subḥānalladzī yusabbiḥur-ra\'du bi-ḥamdihi wal-malā\'ikatu min khīfatih" — Mahasuci yang petir bertasbih kepada-Nya. (Muwaththa\' Malik)' },
  { id: "doa-hilang",         kategori: "doa", name: "Doa Hilang Barang",   arabic: "ضياع الحاجة", ayat: 1, satuan: "kali", poin: 10, tema: "Mohon Ditemukan",     keutamaan: '"Allāhumma rāddaḍ-ḍāllati hādī aḍ-ḍalāli..." — memohon Allah kembalikan barang yang hilang.' },
  { id: "doa-perlindungan-setan",kategori: "doa", name: "Doa Perlindungan dari Setan/Sihir",arabic: "كلمات الله التامات",ayat: 3, satuan: "kali", poin: 15, tema: "Perlindungan Diri",   keutamaan: '"A\'ūdzu bi-kalimātillāhit-tāmmāti min syarri mā khalaq" 3× — tidak akan ada bahaya yang menimpa. (HR. Muslim)' },
  { id: "doa-tetap-iman",     kategori: "doa", name: "Doa Tetap Istiqomah dalam Iman",arabic: "تثبيت القلب",ayat: 1, satuan: "kali", poin: 15, tema: "Tsabbit Qalbi",     keutamaan: '"Yā Muqallibal-qulūb tsabbit qalbī \'alā dīnik" — Doa yang sering dibaca Rasulullah ﷺ. (HR. Tirmidzi)' },
  { id: "doa-stress",         kategori: "doa", name: "Doa Saat Stress/Cemas",arabic: "عند الكرب",  ayat: 1, satuan: "kali", poin: 15, tema: "Pelapang Dada",       keutamaan: '"Lā ilāha illallāhul-\'aẓīmul-ḥalīm..." — Doa kesusahan, Nabi membacanya saat tertimpa kesulitan. (HR. Bukhari)' },
  { id: "doa-ujian",          kategori: "doa", name: "Doa Sebelum Ujian/Wawancara",arabic: "اللهم سهل",ayat: 1, satuan: "kali", poin: 10, tema: "Mohon Kemudahan",    keutamaan: '"Allāhumma lā sahla illā mā ja\'altahu sahlā..." — Tidak ada kemudahan kecuali yang Engkau mudahkan. (HR. Ibnu Hibban)' },
  { id: "doa-kebaikan-amal",  kategori: "doa", name: "Doa Mohon Diterima Amal",arabic: "تقبل اعمالنا",ayat: 1, satuan: "kali", poin: 10, tema: "Doa Nabi Ibrahim",    keutamaan: '"Rabbanā taqabbal minnā innaka antas-samī\'ul-\'alīm" (QS. Al-Baqarah: 127)' },
  { id: "doa-akhir-baik",     kategori: "doa", name: "Doa Husnul Khotimah", arabic: "حسن الخاتمة", ayat: 1, satuan: "kali", poin: 15, tema: "Akhir Hidup Baik",     keutamaan: '"Allāhummakhtim lanā bi-ḥusnil-khātimah" — memohon akhir hidup yang baik dalam keimanan.' },
  { id: "doa-mati-syahid",    kategori: "doa", name: "Doa Mati Syahid",     arabic: "الشهادة",     ayat: 1, satuan: "kali", poin: 20, tema: "Cita-cita Tertinggi",  keutamaan: '"Allāhumma innī as\'aluka syahādatan fī sabīlik..." — Doa Umar bin Khattab RA.' },

  // ─── KELUARGA (TAMBAHAN) ───
  { id: "doa-pasangan",       kategori: "doa", name: "Doa untuk Pasangan",  arabic: "للزوج/الزوجة",ayat: 1, satuan: "kali", poin: 15, tema: "Sakinah Mawaddah",    keutamaan: '"Rabbanā hab lanā min azwājinā wa dzurriyyātinā qurrata a\'yun..." (QS. Al-Furqan: 74)' },
  { id: "doa-hamil",          kategori: "doa", name: "Doa untuk Ibu Hamil", arabic: "للحامل",      ayat: 1, satuan: "kali", poin: 15, tema: "Bayi & Persalinan",    keutamaan: 'Doa memohon kesehatan janin, kelancaran persalinan, dan anak yang sholeh.' },
  { id: "doa-melahirkan",     kategori: "doa", name: "Doa Saat Melahirkan", arabic: "الولادة",     ayat: 1, satuan: "kali", poin: 20, tema: "Kelancaran Persalinan",keutamaan: 'Doa Maryam saat melahirkan: "Yā laitanī mittu qabla hādzā..." (QS. Maryam: 23) dan istighfar memperbanyak.' },
  { id: "doa-bayi",           kategori: "doa", name: "Doa untuk Bayi (Tahnik)",arabic: "للمولود", ayat: 1, satuan: "kali", poin: 15, tema: "Perlindungan Bayi",   keutamaan: '"U\'īdzuka bi-kalimātillāhit-tāmmati min kulli syaiṭānin..." — Doa Nabi untuk Hasan & Husain. (HR. Bukhari)' },
  { id: "doa-pengantin",      kategori: "doa", name: "Doa untuk Pengantin Baru",arabic: "بارك الله",ayat: 1, satuan: "kali", poin: 15, tema: "Doa Pernikahan",      keutamaan: '"Bārakallāhu laka wa bāraka \'alaika wa jama\'a bainakumā fī khair." (HR. Tirmidzi)' },
  { id: "doa-ortu-meninggal", kategori: "doa", name: "Doa untuk Orang Tua yang Meninggal",arabic: "للوالدين الميت",ayat: 1, satuan: "kali", poin: 20, tema: "Birrul Walidain",  keutamaan: '"Allāhummaghfir lahu warḥamhu wa \'āfihi wa\'fu \'anhu..." — Doa Nabi saat menyolatkan jenazah. (HR. Muslim)' },
  { id: "doa-anak-sholeh",    kategori: "doa", name: "Doa untuk Anak Sholeh",arabic: "للأبناء",   ayat: 1, satuan: "kali", poin: 15, tema: "Pendidikan Anak",     keutamaan: '"Rabbij\'alnī muqīmaṣ-ṣalāti wa min dzurriyyatī..." (QS. Ibrahim: 40)' },
  { id: "doa-muslim-saudara", kategori: "doa", name: "Doa untuk Saudara Muslim",arabic: "للمسلمين",ayat: 1, satuan: "kali", poin: 10, tema: "Doa Ghoib",           keutamaan: '"Doa seorang muslim untuk saudaranya tanpa sepengetahuan dia adalah mustajab." (HR. Muslim)' },

  // ─── DOA PARA NABI ───
  { id: "doa-nabi-adam",      kategori: "doa", name: "Doa Nabi Adam AS",    arabic: "ربنا ظلمنا",  ayat: 1, satuan: "kali", poin: 15, tema: "Taubat Pertama",       keutamaan: '"Rabbanā ẓalamnā anfusanā wa illam taghfir lanā wa tarḥamnā lanakūnanna minal-khāsirīn." (QS. Al-A\'raf: 23)' },
  { id: "doa-nabi-nuh",       kategori: "doa", name: "Doa Nabi Nuh AS",     arabic: "رب اغفر لي", ayat: 1, satuan: "kali", poin: 15, tema: "Mohon Ampun Orangtua", keutamaan: '"Rabbighfir lī wa li-wālidayya wa liman dakhala baitiyya mu\'minan..." (QS. Nuh: 28)' },
  { id: "doa-nabi-ibrahim",   kategori: "doa", name: "Doa Nabi Ibrahim AS", arabic: "رب اجعلني",  ayat: 1, satuan: "kali", poin: 20, tema: "Keturunan Sholeh",     keutamaan: '"Rabbij\'alnī muqīmaṣ-ṣalāti wa min dzurriyyatī, rabbanā wa taqabbal du\'ā\'." (QS. Ibrahim: 40)' },
  { id: "doa-nabi-yusuf",     kategori: "doa", name: "Doa Nabi Yusuf AS",   arabic: "توفني مسلما",ayat: 1, satuan: "kali", poin: 20, tema: "Husnul Khotimah",      keutamaan: '"Tawaffanī musliman wa alḥiqnī biṣ-ṣāliḥīn" — Wafatkan aku dalam Islam, gabungkan dengan orang sholeh. (QS. Yusuf: 101)' },
  { id: "doa-nabi-musa",      kategori: "doa", name: "Doa Nabi Musa AS",    arabic: "رب اشرح",    ayat: 1, satuan: "kali", poin: 20, tema: "Lapang Dada",          keutamaan: '"Rabbisyraḥ lī ṣadrī wa yassir lī amrī waḥlul \'uqdatan min lisānī yafqahū qaulī." (QS. Taha: 25-28)' },
  { id: "doa-nabi-sulaiman",  kategori: "doa", name: "Doa Nabi Sulaiman AS",arabic: "رب أوزعني",  ayat: 1, satuan: "kali", poin: 20, tema: "Syukur Nikmat",        keutamaan: '"Rabbi auzi\'nī an asykura ni\'matakallatī an\'amta \'alayya wa \'alā wālidayya..." (QS. An-Naml: 19)' },
  { id: "doa-nabi-ayyub",     kategori: "doa", name: "Doa Nabi Ayyub AS",   arabic: "أني مسني",   ayat: 1, satuan: "kali", poin: 20, tema: "Saat Sakit Lama",       keutamaan: '"Annī massaniyaḍ-ḍurru wa anta arḥamur-rāḥimīn." (QS. Al-Anbiya: 83)' },
  { id: "doa-nabi-zakaria",   kategori: "doa", name: "Doa Nabi Zakaria AS", arabic: "هب لي",      ayat: 1, satuan: "kali", poin: 20, tema: "Mohon Keturunan",       keutamaan: '"Rabbi hab lī min ladunka dzurriyyatan ṭayyibah innaka samī\'ud-du\'ā\'." (QS. Ali Imran: 38)' },
  { id: "doa-nabi-syuaib",    kategori: "doa", name: "Doa Nabi Syu\'aib AS",arabic: "ربنا افتح",  ayat: 1, satuan: "kali", poin: 18, tema: "Mohon Putusan Hak",    keutamaan: '"Rabbanaftaḥ bainanā wa baina qauminā bil-ḥaqqi wa anta khairul-fātiḥīn." (QS. Al-A\'raf: 89)' },
  { id: "doa-nabi-muhammad",  kategori: "doa", name: "Doa Nabi Muhammad ﷺ", arabic: "اللهم إني أسألك",ayat: 1, satuan: "kali", poin: 20, tema: "Doa Pendek Lengkap",keutamaan: '"Allāhumma innī as\'aluka al-hudā wat-tuqā wal-\'afāfa wal-ghinā." (HR. Muslim)' },
  { id: "doa-nabi-ashabul-kahfi",kategori: "doa", name: "Doa Ashabul Kahfi",arabic: "ربنا آتنا من لدنك",ayat: 1, satuan: "kali", poin: 15, tema: "Petunjuk dalam Fitnah",keutamaan: '"Rabbanā ātinā min ladunka raḥmatan wa hayyi\' lanā min amrinā rasyadā." (QS. Al-Kahf: 10)' },
];

// Sub-section grouping per kategori — dipakai untuk header section di AmalanPage
const GRUP_MAP: Record<string, string> = {
  // Sholat
  "sholat-subuh": "Wajib", "sholat-dzuhur": "Wajib", "sholat-ashar": "Wajib", "sholat-maghrib": "Wajib", "sholat-isya": "Wajib",
  tahajud: "Sunnah Harian", dhuha: "Sunnah Harian", witir: "Sunnah Harian", "rawatib-subuh": "Sunnah Harian", "rawatib-dzuhur": "Sunnah Harian",
  "sholat-tarawih": "Sunnah Khusus", "sholat-hajat": "Sunnah Khusus", "sholat-istikharah": "Sunnah Khusus", "sholat-taubat": "Sunnah Khusus",
  "sholat-tasbih": "Sunnah Khusus", "sholat-jenazah": "Sunnah Khusus", "sholat-jumat": "Sunnah Khusus", "sholat-idul-fitri": "Sunnah Khusus", "sholat-idul-adha": "Sunnah Khusus",
  // Qur'an
  "tadarus-juz": "Tadarus Rutin", "tadarus-lembar": "Tadarus Rutin",
  fatihah: "Surat Pilihan", waqiah: "Surat Pilihan", rahman: "Surat Pilihan", yasin: "Surat Pilihan",
  mulk: "Surat Pilihan", kahfi: "Surat Pilihan", juzzamma: "Surat Pilihan",
  // Dzikir
  "dzikir-pagi": "Dzikir Harian", "dzikir-sore": "Dzikir Harian", "dzikir-sholat": "Dzikir Harian",
  sholawat: "Dzikir Harian", istighfar: "Dzikir Harian", tasbih: "Dzikir Harian",
  "asmaul-husna": "Dzikir Khusus", tahlil: "Dzikir Khusus", "khatmil-quran": "Dzikir Khusus", "qunut-nazilah": "Dzikir Khusus",
  "sholawat-nariyah": "Sholawat Khusus", "sholawat-munjiyat": "Sholawat Khusus", "sholawat-badar": "Sholawat Khusus",
  // Doa
  "doa-sebelum-makan": "Adab Harian", "doa-sesudah-makan": "Adab Harian", "doa-sesudah-minum": "Adab Harian",
  "doa-tidur": "Adab Harian", "doa-bangun": "Adab Harian",
  "doa-masuk-wc": "Adab Harian", "doa-keluar-wc": "Adab Harian",
  "doa-masuk-rumah": "Adab Harian", "doa-keluar-rumah": "Adab Harian",
  "doa-masuk-masjid": "Adab Harian", "doa-keluar-masjid": "Adab Harian",
  "doa-wudhu": "Adab Harian", "doa-kendaraan": "Adab Harian",
  "doa-safar": "Situasional", "doa-sapu-jagad": "Situasional",
  "doa-ilmu": "Situasional", "doa-rezeki": "Situasional", "doa-keturunan": "Situasional",
  "doa-lapang-dada": "Situasional", "doa-hujan": "Situasional", "doa-besuk": "Situasional",
  "doa-ziarah-kubur": "Situasional", "doa-lailatul-qadar": "Situasional",
  "doa-talbiyah": "Situasional", "doa-ortu": "Situasional",
  "doa-akad-nikah": "Keluarga", "doa-aqiqah": "Keluarga",
  // Doa — tambahan ADAB HARIAN
  "doa-buka-puasa": "Adab Harian", "doa-sahur": "Adab Harian", "doa-buka-orang": "Adab Harian",
  "doa-bersin": "Adab Harian", "doa-bercermin": "Adab Harian", "doa-pakaian": "Adab Harian",
  "doa-pakaian-baru": "Adab Harian", "doa-makan-lupa": "Adab Harian",
  "doa-mimpi-buruk": "Adab Harian", "doa-mimpi-baik": "Adab Harian",
  "doa-pasar": "Adab Harian", "doa-zam-zam": "Adab Harian", "doa-azab-kubur": "Adab Harian",
  "doa-istikharah-teks": "Adab Harian", "doa-qunut-subuh": "Adab Harian",
  // Doa — tambahan SITUASIONAL
  "doa-sakit": "Situasional", "doa-jenguk-sakit": "Situasional", "doa-musibah": "Situasional",
  "doa-marah": "Situasional", "doa-sedih": "Situasional", "doa-takut": "Situasional",
  "doa-yunus-musibah": "Situasional", "doa-hutang": "Situasional",
  "doa-angin": "Situasional", "doa-petir": "Situasional", "doa-hilang": "Situasional",
  "doa-perlindungan-setan": "Situasional", "doa-tetap-iman": "Situasional",
  "doa-stress": "Situasional", "doa-ujian": "Situasional",
  "doa-kebaikan-amal": "Situasional", "doa-akhir-baik": "Situasional", "doa-mati-syahid": "Situasional",
  // Doa — tambahan KELUARGA
  "doa-pasangan": "Keluarga", "doa-hamil": "Keluarga", "doa-melahirkan": "Keluarga",
  "doa-bayi": "Keluarga", "doa-pengantin": "Keluarga", "doa-ortu-meninggal": "Keluarga",
  "doa-anak-sholeh": "Keluarga", "doa-muslim-saudara": "Keluarga",
  // Doa — DOA PARA NABI (grup baru)
  "doa-nabi-adam": "Doa Para Nabi", "doa-nabi-nuh": "Doa Para Nabi", "doa-nabi-ibrahim": "Doa Para Nabi",
  "doa-nabi-yusuf": "Doa Para Nabi", "doa-nabi-musa": "Doa Para Nabi", "doa-nabi-sulaiman": "Doa Para Nabi",
  "doa-nabi-ayyub": "Doa Para Nabi", "doa-nabi-zakaria": "Doa Para Nabi", "doa-nabi-syuaib": "Doa Para Nabi",
  "doa-nabi-muhammad": "Doa Para Nabi", "doa-nabi-ashabul-kahfi": "Doa Para Nabi",
  // Puasa
  "puasa-senin": "Sunnah Rutin", "puasa-kamis": "Sunnah Rutin", "puasa-bidh": "Sunnah Rutin",
  "puasa-syawal": "Sunnah Khusus", "puasa-arafah": "Sunnah Khusus", "puasa-tasua": "Sunnah Khusus",
  "puasa-asyura": "Sunnah Khusus", "puasa-daud": "Sunnah Khusus",
  "puasa-ramadhan": "Wajib & Pengganti", "puasa-qadha": "Wajib & Pengganti",
};

export function grupOf(s: Surat): string {
  return s.grup ?? GRUP_MAP[s.id] ?? "Lainnya";
}

export const fmt = (n: number) => n.toLocaleString("id-ID");

export const todayISO = () => new Date().toISOString().slice(0, 10);

export const avatarOf = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
