export type BacaanItem = {
  title?: string;
  arab?: string;
  latin?: string;
  terjemahan?: string;
  repeat?: number;
  catatan?: string;
};

export type Bacaan = {
  judul: string;
  pengantar?: string;
  items: BacaanItem[];
};

export const BACAAN: Record<string, Bacaan> = {
  // ─── DZIKIR PAGI ───
  "dzikir-pagi": {
    judul: "Dzikir Pagi (al-Ma'tsurat)",
    pengantar:
      "Dibaca setelah Sholat Subuh hingga matahari terbit. Benteng dari kejahatan dan sumber ketenangan sepanjang hari.",
    items: [
      {
        title: "Ta'awudz & Basmalah",
        arab: "أَعُوذُ بِاللهِ مِنَ الشَّيْطَانِ الرَّجِيمِ ۞ بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ",
        latin: "A'ūdzu billāhi minasy syaiṭānir rajīm. Bismillāhirraḥmānirraḥīm.",
        terjemahan: "Aku berlindung kepada Allah dari godaan setan yang terkutuk. Dengan nama Allah Yang Maha Pengasih, Maha Penyayang.",
      },
      {
        title: "Al-Ikhlas",
        repeat: 3,
        arab: "قُلْ هُوَ اللَّهُ أَحَدٌ ۞ اللَّهُ الصَّمَدُ ۞ لَمْ يَلِدْ وَلَمْ يُولَدْ ۞ وَلَمْ يَكُنْ لَهُ كُفُوًا أَحَدٌ",
        latin: "Qul huwallāhu aḥad. Allāhuṣ-ṣamad. Lam yalid wa lam yūlad. Wa lam yakul lahū kufuwan aḥad.",
        terjemahan: "Katakanlah: Dia-lah Allah Yang Maha Esa. Allah tempat bergantung. Dia tidak beranak dan tidak pula diperanakkan. Dan tidak ada seorang pun yang setara dengan-Nya.",
      },
      {
        title: "Al-Falaq",
        repeat: 3,
        arab: "قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ ۞ مِنْ شَرِّ مَا خَلَقَ ۞ وَمِنْ شَرِّ غَاسِقٍ إِذَا وَقَبَ ۞ وَمِنْ شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ ۞ وَمِنْ شَرِّ حَاسِدٍ إِذَا حَسَدَ",
        latin: "Qul a'ūdzu birabbil falaq. Min syarri mā khalaq. Wa min syarri ghāsiqin idzā waqab. Wa min syarrin-naffātsāti fil-'uqad. Wa min syarri ḥāsidin idzā ḥasad.",
        terjemahan: "Aku berlindung kepada Tuhan yang menguasai subuh, dari kejahatan makhluk-Nya, dari kejahatan malam apabila telah gelap gulita, dari kejahatan tukang sihir, dan dari kejahatan pendengki bila ia dengki.",
      },
      {
        title: "An-Nas",
        repeat: 3,
        arab: "قُلْ أَعُوذُ بِرَبِّ النَّاسِ ۞ مَلِكِ النَّاسِ ۞ إِلَهِ النَّاسِ ۞ مِنْ شَرِّ الْوَسْوَاسِ الْخَنَّاسِ ۞ الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ ۞ مِنَ الْجِنَّةِ وَالنَّاسِ",
        latin: "Qul a'ūdzu birabbin-nās. Malikin-nās. Ilāhin-nās. Min syarril-waswāsil-khannās. Alladzī yuwaswisu fī ṣudūrin-nās. Minal jinnati wan-nās.",
        terjemahan: "Aku berlindung kepada Tuhan manusia, Raja manusia, Sesembahan manusia, dari kejahatan bisikan setan yang biasa bersembunyi, yang membisikkan kejahatan ke dalam dada manusia, dari golongan jin dan manusia.",
      },
      {
        title: "Ayat Kursi",
        arab: "اللَّهُ لَا إِلَهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ، لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ...",
        latin: "Allāhu lā ilāha illā huwal-ḥayyul-qayyūm. Lā ta'khudzuhū sinatun wa lā naum...",
        terjemahan: "Allah, tidak ada Tuhan selain Dia. Yang Mahahidup, Yang terus-menerus mengurus makhluk-Nya, tidak mengantuk dan tidak tidur. (QS. Al-Baqarah: 255)",
        catatan: "Baca lengkap dari mushaf.",
      },
      {
        title: "Doa Pagi",
        arab: "أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ",
        latin: "Aṣbaḥnā wa aṣbaḥal-mulku lillāh, wal-ḥamdu lillāh, lā ilāha illallāhu waḥdahū lā syarīka lah, lahul-mulku wa lahul-ḥamdu wa huwa 'alā kulli syai'in qadīr.",
        terjemahan: "Kami berpagi dan kerajaan pun berpagi hanya milik Allah. Segala puji bagi Allah. Tidak ada tuhan selain Allah Yang Maha Esa, tidak ada sekutu bagi-Nya. Bagi-Nya kerajaan dan segala puji, dan Dia Maha Kuasa atas segala sesuatu.",
      },
      {
        title: "Sayyidul Istighfar",
        arab: "اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلَّا أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ، وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ، أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ، أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ، وَأَبُوءُ بِذَنْبِي فَاغْفِرْ لِي، فَإِنَّهُ لَا يَغْفِرُ الذُّنُوبَ إِلَّا أَنْتَ",
        latin: "Allāhumma anta rabbī lā ilāha illā anta, khalaqtanī wa anā 'abduka, wa anā 'alā 'ahdika wa wa'dika mastaṭa'tu, a'ūdzu bika min syarri mā ṣana'tu, abū'u laka bini'matika 'alayya, wa abū'u bidzanbī faghfir lī, fa innahū lā yaghfirudz-dzunūba illā anta.",
        terjemahan: "Ya Allah, Engkau Tuhanku, tidak ada tuhan selain Engkau. Engkau menciptakanku, dan aku adalah hamba-Mu, aku menetapi perjanjian-Mu sebatas kemampuanku. Aku berlindung pada-Mu dari kejahatan yang kuperbuat. Aku mengakui nikmat-Mu padaku, dan aku akui dosaku. Maka ampunilah aku, sebab tiada yang mampu mengampuni dosa selain Engkau.",
      },
      {
        title: "Perlindungan",
        repeat: 3,
        arab: "بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ",
        latin: "Bismillāhilladzī lā yaḍurru ma'asmihī syai'un fil-arḍi wa lā fis-samā'i wa huwas-samī'ul-'alīm.",
        terjemahan: "Dengan nama Allah, yang dengan nama-Nya tidak akan membahayakan segala sesuatu di bumi dan di langit, dan Dia Maha Mendengar lagi Maha Mengetahui.",
      },
      {
        title: "Hasbiyallah",
        repeat: 7,
        arab: "حَسْبِيَ اللَّهُ لَا إِلَهَ إِلَّا هُوَ، عَلَيْهِ تَوَكَّلْتُ وَهُوَ رَبُّ الْعَرْشِ الْعَظِيمِ",
        latin: "Ḥasbiyallāhu lā ilāha illā huwa, 'alaihi tawakkaltu wa huwa rabbul-'arsyil-'aẓīm.",
        terjemahan: "Cukuplah Allah bagiku, tidak ada tuhan selain Dia. Hanya kepada-Nya aku bertawakal, dan Dia adalah Tuhan pemilik 'Arsy yang agung.",
      },
      {
        title: "Sholawat",
        repeat: 10,
        arab: "اللَّهُمَّ صَلِّ وَسَلِّمْ عَلَى نَبِيِّنَا مُحَمَّدٍ",
        latin: "Allāhumma ṣalli wa sallim 'alā nabiyyinā Muḥammad.",
        terjemahan: "Ya Allah, limpahkanlah shalawat dan salam kepada Nabi kami Muhammad ﷺ.",
      },
      {
        title: "Tasbih Penutup",
        repeat: 100,
        arab: "سُبْحَانَ اللَّهِ وَبِحَمْدِهِ",
        latin: "Subḥānallāhi wa biḥamdih.",
        terjemahan: "Maha Suci Allah dan segala puji bagi-Nya.",
      },
    ],
  },

  // ─── DZIKIR SORE ───
  "dzikir-sore": {
    judul: "Dzikir Sore (al-Ma'tsurat)",
    pengantar:
      "Dibaca setelah Sholat Ashar hingga Maghrib. Tidak ada bahaya yang menimpa orang yang membaca dzikir sore.",
    items: [
      {
        title: "Al-Ikhlas",
        repeat: 3,
        arab: "قُلْ هُوَ اللَّهُ أَحَدٌ ۞ اللَّهُ الصَّمَدُ ۞ لَمْ يَلِدْ وَلَمْ يُولَدْ ۞ وَلَمْ يَكُنْ لَهُ كُفُوًا أَحَدٌ",
        latin: "Qul huwallāhu aḥad. Allāhuṣ-ṣamad. Lam yalid wa lam yūlad. Wa lam yakul lahū kufuwan aḥad.",
        terjemahan: "Katakanlah: Dia-lah Allah Yang Maha Esa. Allah tempat bergantung. Dia tidak beranak dan tidak pula diperanakkan. Dan tidak ada seorang pun yang setara dengan-Nya.",
      },
      {
        title: "Al-Falaq",
        repeat: 3,
        arab: "قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ ۞ مِنْ شَرِّ مَا خَلَقَ ۞ وَمِنْ شَرِّ غَاسِقٍ إِذَا وَقَبَ ۞ وَمِنْ شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ ۞ وَمِنْ شَرِّ حَاسِدٍ إِذَا حَسَدَ",
        latin: "Qul a'ūdzu birabbil falaq. Min syarri mā khalaq. Wa min syarri ghāsiqin idzā waqab. Wa min syarrin-naffātsāti fil-'uqad. Wa min syarri ḥāsidin idzā ḥasad.",
        terjemahan: "Aku berlindung kepada Tuhan yang menguasai subuh, dari kejahatan makhluk-Nya, dari kejahatan malam apabila telah gelap gulita, dari kejahatan tukang sihir, dan dari kejahatan pendengki bila ia dengki.",
      },
      {
        title: "An-Nas",
        repeat: 3,
        arab: "قُلْ أَعُوذُ بِرَبِّ النَّاسِ ۞ مَلِكِ النَّاسِ ۞ إِلَهِ النَّاسِ ۞ مِنْ شَرِّ الْوَسْوَاسِ الْخَنَّاسِ ۞ الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ ۞ مِنَ الْجِنَّةِ وَالنَّاسِ",
        latin: "Qul a'ūdzu birabbin-nās. Malikin-nās. Ilāhin-nās. Min syarril-waswāsil-khannās. Alladzī yuwaswisu fī ṣudūrin-nās. Minal jinnati wan-nās.",
        terjemahan: "Aku berlindung kepada Tuhan manusia, Raja manusia, Sesembahan manusia, dari kejahatan bisikan setan yang biasa bersembunyi, yang membisikkan kejahatan ke dalam dada manusia, dari golongan jin dan manusia.",
      },
      {
        title: "Ayat Kursi",
        arab: "اللَّهُ لَا إِلَهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ، لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ، لَهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ، مَنْ ذَا الَّذِي يَشْفَعُ عِنْدَهُ إِلَّا بِإِذْنِهِ، يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ، وَلَا يُحِيطُونَ بِشَيْءٍ مِنْ عِلْمِهِ إِلَّا بِمَا شَاءَ، وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالْأَرْضَ، وَلَا يَؤُودُهُ حِفْظُهُمَا، وَهُوَ الْعَلِيُّ الْعَظِيمُ",
        latin: "Allāhu lā ilāha illā huwal-ḥayyul-qayyūm. Lā ta'khudzuhū sinatun wa lā naum. Lahū mā fis-samāwāti wa mā fil-arḍ. Man dzal-ladzī yasyfa'u 'indahū illā bi'idznih. Ya'lamu mā baina aidīhim wa mā khalfahum, wa lā yuḥīṭūna bisyai'in min 'ilmihī illā bimā syā'. Wasi'a kursiyyuhus-samāwāti wal-arḍ, wa lā ya'ūduhū ḥifẓuhumā, wa huwal-'aliyyul-'aẓīm.",
        terjemahan: "Allah, tidak ada tuhan selain Dia, Yang Mahahidup, Yang terus-menerus mengurus makhluk-Nya. Tidak mengantuk dan tidak tidur. Milik-Nya apa yang ada di langit dan apa yang ada di bumi. Tiada yang dapat memberi syafaat di sisi-Nya tanpa izin-Nya. Dia mengetahui apa yang di hadapan mereka dan di belakang mereka, dan mereka tidak mengetahui apa pun dari ilmu-Nya melainkan apa yang Dia kehendaki. Kursi-Nya meliputi langit dan bumi. Dia tidak merasa berat memelihara keduanya. Dan Dia Mahatinggi, Mahaagung. (QS. Al-Baqarah: 255)",
      },
      {
        title: "Doa Sore",
        arab: "أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ",
        latin: "Amsainā wa amsal-mulku lillāh, wal-ḥamdu lillāh, lā ilāha illallāhu waḥdahū lā syarīka lah, lahul-mulku wa lahul-ḥamdu wa huwa 'alā kulli syai'in qadīr.",
        terjemahan: "Kami berpetang dan kerajaan pun berpetang hanya milik Allah. Segala puji bagi Allah. Tidak ada tuhan selain Allah Yang Maha Esa, tidak ada sekutu bagi-Nya. Bagi-Nya kerajaan dan segala puji, dan Dia Maha Kuasa atas segala sesuatu.",
      },
      {
        title: "Perlindungan Sore",
        repeat: 3,
        arab: "أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ",
        latin: "A'ūdzu bikalimātillāhit-tāmmāti min syarri mā khalaq.",
        terjemahan: "Aku berlindung dengan kalimat-kalimat Allah yang sempurna dari kejahatan apa yang Dia ciptakan.",
        catatan: "Khusus sore — sangat dianjurkan oleh Rasulullah ﷺ.",
      },
      {
        title: "Sayyidul Istighfar",
        arab: "اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلَّا أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ، وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ، أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ، أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ، وَأَبُوءُ بِذَنْبِي فَاغْفِرْ لِي، فَإِنَّهُ لَا يَغْفِرُ الذُّنُوبَ إِلَّا أَنْتَ",
        latin: "Allāhumma anta rabbī lā ilāha illā anta, khalaqtanī wa anā 'abduka, wa anā 'alā 'ahdika wa wa'dika mastaṭa'tu, a'ūdzu bika min syarri mā ṣana'tu, abū'u laka bini'matika 'alayya, wa abū'u bidzanbī faghfir lī, fa innahū lā yaghfirudz-dzunūba illā anta.",
        terjemahan: "Ya Allah, Engkau Tuhanku, tidak ada tuhan selain Engkau. Engkau menciptakanku, dan aku adalah hamba-Mu, aku menetapi perjanjian-Mu sebatas kemampuanku. Aku berlindung pada-Mu dari kejahatan yang kuperbuat. Aku mengakui nikmat-Mu padaku, dan aku akui dosaku. Maka ampunilah aku, sebab tiada yang mampu mengampuni dosa selain Engkau.",
      },
      {
        title: "Sholawat",
        repeat: 10,
        arab: "اللَّهُمَّ صَلِّ وَسَلِّمْ عَلَى نَبِيِّنَا مُحَمَّدٍ",
        latin: "Allāhumma ṣalli wa sallim 'alā nabiyyinā Muḥammad.",
        terjemahan: "Ya Allah, limpahkanlah shalawat dan salam kepada Nabi kami Muhammad ﷺ.",
      },
      {
        title: "Tasbih Penutup",
        repeat: 100,
        arab: "سُبْحَانَ اللَّهِ وَبِحَمْدِهِ",
        latin: "Subḥānallāhi wa biḥamdih.",
        terjemahan: "Maha Suci Allah dan segala puji bagi-Nya.",
      },
    ],
  },

  // ─── DZIKIR BA'DA SHOLAT ───
  "dzikir-sholat": {
    judul: "Dzikir Ba'da Sholat",
    pengantar: "Dibaca setelah salam pada setiap sholat fardhu.",
    items: [
      {
        title: "Istighfar",
        repeat: 3,
        arab: "أَسْتَغْفِرُ اللَّهَ",
        latin: "Astaghfirullāh.",
        terjemahan: "Aku memohon ampun kepada Allah.",
      },
      {
        title: "Permohonan Keselamatan",
        arab: "اللَّهُمَّ أَنْتَ السَّلَامُ وَمِنْكَ السَّلَامُ، تَبَارَكْتَ يَا ذَا الْجَلَالِ وَالْإِكْرَامِ",
        latin: "Allāhumma antas-salām wa minkas-salām, tabārakta yā dzal-jalāli wal-ikrām.",
        terjemahan: "Ya Allah, Engkaulah pemberi keselamatan, dan dari-Mu keselamatan. Maha Berkah Engkau, wahai pemilik keagungan dan kemuliaan.",
      },
      {
        title: "Tasbih",
        repeat: 33,
        arab: "سُبْحَانَ اللَّهِ",
        latin: "Subḥānallāh.",
        terjemahan: "Maha Suci Allah.",
      },
      {
        title: "Tahmid",
        repeat: 33,
        arab: "الْحَمْدُ لِلَّهِ",
        latin: "Alḥamdulillāh.",
        terjemahan: "Segala puji bagi Allah.",
      },
      {
        title: "Takbir",
        repeat: 33,
        arab: "اللَّهُ أَكْبَرُ",
        latin: "Allāhu akbar.",
        terjemahan: "Allah Maha Besar.",
      },
      {
        title: "Penutup (Genap 100)",
        arab: "لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ",
        latin: "Lā ilāha illallāhu waḥdahū lā syarīka lah, lahul-mulku wa lahul-ḥamdu wa huwa 'alā kulli syai'in qadīr.",
        terjemahan: "Tidak ada tuhan selain Allah Yang Maha Esa, tidak ada sekutu bagi-Nya. Bagi-Nya kerajaan dan segala puji, dan Dia Maha Kuasa atas segala sesuatu.",
      },
    ],
  },

  // ─── SHOLAWAT ───
  sholawat: {
    judul: "Sholawat kepada Nabi ﷺ",
    pengantar: "Satu sholawat darimu, sepuluh sholawat Allah untukmu. (HR. Muslim)",
    items: [
      {
        title: "Sholawat Pendek",
        repeat: 100,
        arab: "اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ",
        latin: "Allāhumma ṣalli 'alā Muḥammad wa 'alā āli Muḥammad.",
        terjemahan: "Ya Allah, limpahkanlah shalawat kepada Nabi Muhammad dan keluarga Nabi Muhammad.",
      },
      {
        title: "Sholawat Ibrahimiyah",
        arab: "اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ، كَمَا صَلَّيْتَ عَلَى إِبْرَاهِيمَ وَعَلَى آلِ إِبْرَاهِيمَ، وَبَارِكْ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ، كَمَا بَارَكْتَ عَلَى إِبْرَاهِيمَ وَعَلَى آلِ إِبْرَاهِيمَ، فِي الْعَالَمِينَ إِنَّكَ حَمِيدٌ مَجِيدٌ",
        latin: "Allāhumma ṣalli 'alā Muḥammad wa 'alā āli Muḥammad, kamā ṣallaita 'alā Ibrāhīm wa 'alā āli Ibrāhīm, wa bārik 'alā Muḥammad wa 'alā āli Muḥammad, kamā bārakta 'alā Ibrāhīm wa 'alā āli Ibrāhīm, fil-'ālamīna innaka ḥamīdun majīd.",
        terjemahan: "Ya Allah, berikanlah shalawat kepada Nabi Muhammad dan keluarganya, sebagaimana Engkau memberikan shalawat kepada Nabi Ibrahim dan keluarganya. Dan berkahilah Nabi Muhammad dan keluarganya sebagaimana Engkau memberikan keberkahan kepada Nabi Ibrahim dan keluarganya. Di seluruh alam, sesungguhnya Engkau Maha Terpuji lagi Maha Mulia.",
        catatan: "Sholawat yang dibaca dalam tasyahud akhir.",
      },
    ],
  },

  // ─── ISTIGHFAR ───
  istighfar: {
    judul: "Istighfar — Pintu Ampunan",
    pengantar: "Siapa membiasakan istighfar, Allah jadikan kelapangan dari setiap kesempitan. (HR. Abu Dawud)",
    items: [
      {
        title: "Istighfar Pendek",
        repeat: 100,
        arab: "أَسْتَغْفِرُ اللَّهَ",
        latin: "Astaghfirullāh.",
        terjemahan: "Aku memohon ampun kepada Allah.",
      },
      {
        title: "Istighfar Sayyid",
        arab: "أَسْتَغْفِرُ اللَّهَ الْعَظِيمَ الَّذِي لَا إِلَهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ وَأَتُوبُ إِلَيْهِ",
        latin: "Astaghfirullāhal-'aẓīm alladzī lā ilāha illā huwal-ḥayyul-qayyūm wa atūbu ilaih.",
        terjemahan: "Aku memohon ampun kepada Allah Yang Maha Agung, yang tidak ada tuhan selain Dia, Yang Mahahidup dan Mahaterus-menerus mengurus, dan aku bertaubat kepada-Nya.",
      },
    ],
  },

  // ─── TASBIH ───
  tasbih: {
    judul: "Tasbih 33×",
    pengantar: "Menanam pohon di surga untuk setiap tasbih. (HR. Tirmidzi)",
    items: [
      {
        title: "Tasbih",
        repeat: 33,
        arab: "سُبْحَانَ اللَّهِ",
        latin: "Subḥānallāh.",
        terjemahan: "Maha Suci Allah.",
      },
      {
        title: "Tasbih Lengkap",
        arab: "سُبْحَانَ اللَّهِ وَبِحَمْدِهِ، سُبْحَانَ اللَّهِ الْعَظِيمِ",
        latin: "Subḥānallāhi wa biḥamdih, subḥānallāhil-'aẓīm.",
        terjemahan: "Maha Suci Allah dan segala puji bagi-Nya, Maha Suci Allah Yang Maha Agung.",
        catatan: "Dua kalimat yang ringan di lisan, berat di timbangan, dicintai Ar-Rahman (HR. Bukhari Muslim).",
      },
    ],
  },

  // ─── SHOLAT WAJIB ───
  "sholat-subuh": {
    judul: "Sholat Subuh — 2 Rakaat (+ Bacaan Lengkap)",
    pengantar: "Waktu: dari terbit fajar shadiq hingga sebelum terbit matahari. Bacaan ruku', sujud, dll di entry ini berlaku untuk SEMUA sholat fardhu maupun sunnah.",
    items: [
      {
        title: "1. Niat Sholat Subuh",
        arab: "أُصَلِّي فَرْضَ الصُّبْحِ رَكْعَتَيْنِ مُسْتَقْبِلَ الْقِبْلَةِ أَدَاءً لِلَّهِ تَعَالَى",
        latin: "Uṣallī farḍaṣ-ṣubḥi rak'ataini mustaqbilal-qiblati adā'an lillāhi ta'ālā.",
        terjemahan: "Aku berniat sholat fardhu Subuh dua rakaat menghadap kiblat, tunai karena Allah Ta'ala.",
      },
      {
        title: "2. Takbiratul Ihram",
        arab: "اللَّهُ أَكْبَرُ",
        latin: "Allāhu akbar.",
        terjemahan: "Allah Maha Besar.",
        catatan: "Bersamaan mengangkat kedua tangan setinggi telinga.",
      },
      {
        title: "3. Doa Iftitah",
        arab: "اللَّهُ أَكْبَرُ كَبِيرًا وَالْحَمْدُ لِلَّهِ كَثِيرًا وَسُبْحَانَ اللَّهِ بُكْرَةً وَأَصِيلًا. إِنِّي وَجَّهْتُ وَجْهِيَ لِلَّذِي فَطَرَ السَّمَاوَاتِ وَالْأَرْضَ حَنِيفًا مُسْلِمًا وَمَا أَنَا مِنَ الْمُشْرِكِينَ. إِنَّ صَلَاتِي وَنُسُكِي وَمَحْيَايَ وَمَمَاتِي لِلَّهِ رَبِّ الْعَالَمِينَ. لَا شَرِيكَ لَهُ وَبِذَلِكَ أُمِرْتُ وَأَنَا مِنَ الْمُسْلِمِينَ",
        latin: "Allāhu akbar kabīrā, walḥamdulillāhi katsīrā, wa subḥānallāhi bukratan wa aṣīlā. Innī wajjahtu wajhiya lilladzī faṭaras-samāwāti wal-arḍa ḥanīfan musliman wa mā ana minal-musyrikīn. Inna ṣalātī wa nusukī wa maḥyāya wa mamātī lillāhi rabbil-'ālamīn. Lā syarīka lah, wa bidzālika umirtu wa ana minal-muslimīn.",
        terjemahan: "Allah Maha Besar dengan sebesar-besarnya, segala puji bagi Allah dengan pujian yang banyak, Maha Suci Allah di waktu pagi dan petang. Aku hadapkan wajahku kepada Yang menciptakan langit dan bumi dengan lurus dan berserah diri, dan aku bukanlah dari golongan musyrik. Sesungguhnya sholatku, ibadahku, hidupku, dan matiku, hanya untuk Allah Tuhan semesta alam. Tiada sekutu bagi-Nya, dengan itulah aku diperintah, dan aku termasuk orang-orang muslim.",
      },
      {
        title: "4. Al-Fatihah & Surat Pendek",
        terjemahan: "Baca Al-Fatihah. Setelah \"āmīn\", baca surat pendek (mis. Al-Ikhlas, An-Nas, dll). Rakaat 1 baca yang berbeda dari rakaat 2.",
      },
      {
        title: "5. Ruku' — Bacaan",
        repeat: 3,
        arab: "سُبْحَانَ رَبِّيَ الْعَظِيمِ وَبِحَمْدِهِ",
        latin: "Subḥāna rabbiyal-'aẓīmi wa biḥamdih.",
        terjemahan: "Maha Suci Tuhanku Yang Maha Agung, dan dengan memuji-Nya.",
        catatan: "Dibaca minimal 3× (sunnah lebih banyak ganjil).",
      },
      {
        title: "6. I'tidal — Bangkit dari Ruku'",
        arab: "سَمِعَ اللَّهُ لِمَنْ حَمِدَهُ",
        latin: "Sami'allāhu liman ḥamidah.",
        terjemahan: "Allah Maha Mendengar bagi siapa yang memuji-Nya.",
        catatan: "Dibaca saat bangkit dari ruku'.",
      },
      {
        title: "7. I'tidal — Berdiri Tegak",
        arab: "رَبَّنَا لَكَ الْحَمْدُ مِلْءَ السَّمَاوَاتِ وَمِلْءَ الْأَرْضِ وَمِلْءَ مَا شِئْتَ مِنْ شَيْءٍ بَعْدُ",
        latin: "Rabbanā lakal-ḥamdu mil'as-samāwāti wa mil'al-arḍi wa mil'a mā syi'ta min syai'in ba'd.",
        terjemahan: "Ya Tuhan kami, bagi-Mu segala puji sepenuh langit, sepenuh bumi, dan sepenuh apa pun yang Engkau kehendaki sesudah itu.",
      },
      {
        title: "8. Sujud — Bacaan",
        repeat: 3,
        arab: "سُبْحَانَ رَبِّيَ الْأَعْلَى وَبِحَمْدِهِ",
        latin: "Subḥāna rabbiyal-a'lā wa biḥamdih.",
        terjemahan: "Maha Suci Tuhanku Yang Maha Tinggi, dan dengan memuji-Nya.",
        catatan: "Dibaca minimal 3×. 7 anggota sujud: dahi, kedua telapak tangan, kedua lutut, dan kedua ujung kaki.",
      },
      {
        title: "9. Duduk Antara Dua Sujud",
        arab: "رَبِّ اغْفِرْ لِي وَارْحَمْنِي وَاجْبُرْنِي وَارْفَعْنِي وَارْزُقْنِي وَاهْدِنِي وَعَافِنِي وَاعْفُ عَنِّي",
        latin: "Rabbighfir lī, warḥamnī, wajburnī, warfa'nī, warzuqnī, wahdinī, wa 'āfinī, wa'fu 'annī.",
        terjemahan: "Tuhanku, ampunilah aku, kasihanilah aku, tutuplah kekuranganku, angkatlah derajatku, berilah aku rezeki, berilah aku petunjuk, beri aku afiat, dan maafkanlah aku.",
      },
      {
        title: "10. Doa Qunut (Rakaat 2 Subuh)",
        arab: "اللَّهُمَّ اهْدِنِي فِيمَنْ هَدَيْتَ، وَعَافِنِي فِيمَنْ عَافَيْتَ، وَتَوَلَّنِي فِيمَنْ تَوَلَّيْتَ، وَبَارِكْ لِي فِيمَا أَعْطَيْتَ، وَقِنِي شَرَّ مَا قَضَيْتَ، فَإِنَّكَ تَقْضِي وَلَا يُقْضَى عَلَيْكَ، وَإِنَّهُ لَا يَذِلُّ مَنْ وَالَيْتَ، وَلَا يَعِزُّ مَنْ عَادَيْتَ، تَبَارَكْتَ رَبَّنَا وَتَعَالَيْتَ، فَلَكَ الْحَمْدُ عَلَى مَا قَضَيْتَ، أَسْتَغْفِرُكَ وَأَتُوبُ إِلَيْكَ، وَصَلَّى اللَّهُ عَلَى سَيِّدِنَا مُحَمَّدٍ وَآلِهِ وَصَحْبِهِ وَسَلَّمَ",
        latin: "Allāhummahdinī fīman hadait, wa 'āfinī fīman 'āfait, wa tawallanī fīman tawallait, wa bārik lī fīmā a'ṭait, wa qinī syarra mā qaḍait, fa innaka taqḍī wa lā yuqḍā 'alaik, wa innahū lā yadzillu man wālait, wa lā ya'izzu man 'ādait, tabārakta rabbanā wa ta'ālait, falakal-ḥamdu 'alā mā qaḍait, astaghfiruka wa atūbu ilaik, wa ṣallallāhu 'alā sayyidinā Muḥammadin wa ālihī wa ṣaḥbihī wa sallam.",
        terjemahan: "Ya Allah, berilah aku petunjuk seperti orang yang Engkau beri petunjuk, beri aku afiat seperti orang yang Engkau afiat, peliharalah aku seperti yang Engkau pelihara, berkahilah pemberian-Mu padaku, lindungilah dari keburukan keputusan-Mu. Sungguh Engkau yang memutuskan dan tidak diputuskan atas-Mu. Tidak terhina yang Engkau bela, tidak mulia yang Engkau musuhi. Maha Berkah Engkau Tuhan kami dan Maha Tinggi, segala puji bagi-Mu atas yang Engkau putuskan, aku memohon ampun dan bertaubat kepada-Mu. Sholawat Allah atas junjungan kami Muhammad, keluarganya, sahabatnya, dan salam.",
        catatan: "Dibaca setelah i'tidal di rakaat ke-2 Subuh (menurut mazhab Syafi'i). Mengangkat kedua tangan.",
      },
      {
        title: "11. Tasyahud Awal (Sholat ≥3 Rakaat)",
        arab: "التَّحِيَّاتُ الْمُبَارَكَاتُ الصَّلَوَاتُ الطَّيِّبَاتُ لِلَّهِ. السَّلَامُ عَلَيْكَ أَيُّهَا النَّبِيُّ وَرَحْمَةُ اللَّهِ وَبَرَكَاتُهُ. السَّلَامُ عَلَيْنَا وَعَلَى عِبَادِ اللَّهِ الصَّالِحِينَ. أَشْهَدُ أَنْ لَا إِلَهَ إِلَّا اللَّهُ، وَأَشْهَدُ أَنَّ مُحَمَّدًا رَسُولُ اللَّهِ",
        latin: "At-taḥiyyātul-mubārakātuṣ-ṣalawātuṭ-ṭayyibātu lillāh. Assalāmu 'alaika ayyuhan-nabiyyu wa raḥmatullāhi wa barakātuh. Assalāmu 'alainā wa 'alā 'ibādillāhiṣ-ṣāliḥīn. Asyhadu allā ilāha illallāh, wa asyhadu anna Muḥammadan rasūlullāh.",
        terjemahan: "Segala penghormatan yang berkah, sholawat dan kebaikan adalah milik Allah. Semoga keselamatan, rahmat Allah, dan keberkahan-Nya tercurah atasmu wahai Nabi. Keselamatan atas kami dan atas hamba-hamba Allah yang sholeh. Aku bersaksi tidak ada tuhan selain Allah, dan aku bersaksi Muhammad adalah utusan Allah.",
      },
      {
        title: "12. Tasyahud Akhir + Sholawat Ibrahimiyah",
        arab: "[Tasyahud di atas] + اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ، كَمَا صَلَّيْتَ عَلَى إِبْرَاهِيمَ وَعَلَى آلِ إِبْرَاهِيمَ، وَبَارِكْ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ، كَمَا بَارَكْتَ عَلَى إِبْرَاهِيمَ وَعَلَى آلِ إِبْرَاهِيمَ، فِي الْعَالَمِينَ إِنَّكَ حَمِيدٌ مَجِيدٌ",
        latin: "[Tasyahud di atas] + Allāhumma ṣalli 'alā Muḥammad wa 'alā āli Muḥammad, kamā ṣallaita 'alā Ibrāhīm wa 'alā āli Ibrāhīm, wa bārik 'alā Muḥammad wa 'alā āli Muḥammad, kamā bārakta 'alā Ibrāhīm wa 'alā āli Ibrāhīm, fil-'ālamīna innaka ḥamīdun majīd.",
        terjemahan: "Ya Allah, limpahkanlah shalawat kepada Nabi Muhammad dan keluarganya, sebagaimana Engkau limpahkan shalawat kepada Nabi Ibrahim dan keluarganya. Berkahilah Nabi Muhammad dan keluarganya sebagaimana Engkau berkahi Nabi Ibrahim dan keluarganya, di seluruh alam. Sesungguhnya Engkau Maha Terpuji dan Maha Mulia.",
      },
      {
        title: "13. Doa Sebelum Salam",
        arab: "اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنْ عَذَابِ الْقَبْرِ، وَمِنْ عَذَابِ النَّارِ، وَمِنْ فِتْنَةِ الْمَحْيَا وَالْمَمَاتِ، وَمِنْ فِتْنَةِ الْمَسِيحِ الدَّجَّالِ",
        latin: "Allāhumma innī a'ūdzu bika min 'adzābil-qabri, wa min 'adzābin-nār, wa min fitnatil-maḥyā wal-mamāt, wa min fitnatil-masīḥid-dajjāl.",
        terjemahan: "Ya Allah, aku berlindung kepada-Mu dari siksa kubur, dari siksa neraka, dari fitnah kehidupan dan kematian, dan dari fitnah Al-Masih Ad-Dajjal.",
      },
      {
        title: "14. Salam — Kanan & Kiri",
        arab: "السَّلَامُ عَلَيْكُمْ وَرَحْمَةُ اللَّهِ",
        latin: "Assalāmu 'alaikum wa raḥmatullāh.",
        terjemahan: "Semoga keselamatan dan rahmat Allah atas kalian.",
        catatan: "Tengok ke kanan saat salam pertama, lalu ke kiri.",
      },
    ],
  },
  "sholat-dzuhur": {
    judul: "Sholat Dzuhur — 4 Rakaat",
    pengantar: "Waktu: dari condongnya matahari hingga panjang bayangan = tinggi benda. Bacaan dalam sholat (Iftitah, Ruku', Sujud, Tasyahud, dll) sama dengan Sholat Subuh — lihat menu Sholat Subuh untuk lengkapnya.",
    items: [
      {
        title: "Niat Sholat Dzuhur",
        arab: "أُصَلِّي فَرْضَ الظُّهْرِ أَرْبَعَ رَكَعَاتٍ مُسْتَقْبِلَ الْقِبْلَةِ أَدَاءً لِلَّهِ تَعَالَى",
        latin: "Uṣallī farḍaẓ-ẓuhri arba'a raka'ātin mustaqbilal-qiblati adā'an lillāhi ta'ālā.",
        terjemahan: "Aku berniat sholat fardhu Dzuhur empat rakaat menghadap kiblat, tunai karena Allah Ta'ala.",
      },
      {
        title: "Tata Cara",
        terjemahan: "Rakaat 1-2: Al-Fatihah + surat pendek. Rakaat 3-4: hanya Al-Fatihah (bisa pelan). Tasyahud awal di rakaat 2, tasyahud akhir di rakaat 4. Bacaan ruku, sujud, dll → lihat Sholat Subuh.",
      },
    ],
  },
  "sholat-ashar": {
    judul: "Sholat Ashar — 4 Rakaat",
    pengantar: "Waktu: setelah Dzuhur hingga matahari menguning. Bacaan dalam sholat sama dengan Sholat Subuh.",
    items: [
      {
        title: "Niat Sholat Ashar",
        arab: "أُصَلِّي فَرْضَ الْعَصْرِ أَرْبَعَ رَكَعَاتٍ مُسْتَقْبِلَ الْقِبْلَةِ أَدَاءً لِلَّهِ تَعَالَى",
        latin: "Uṣallī farḍal-'aṣri arba'a raka'ātin mustaqbilal-qiblati adā'an lillāhi ta'ālā.",
        terjemahan: "Aku berniat sholat fardhu Ashar empat rakaat menghadap kiblat, tunai karena Allah Ta'ala.",
      },
      {
        title: "Tata Cara",
        terjemahan: "Sama dengan Sholat Dzuhur — 4 rakaat. Bacaan pelan/sirr (tidak dikeraskan). Lihat Sholat Subuh untuk bacaan ruku, sujud, tasyahud.",
      },
    ],
  },
  "sholat-maghrib": {
    judul: "Sholat Maghrib — 3 Rakaat",
    pengantar: "Waktu: dari terbenamnya matahari hingga hilang mega merah. Bacaan dalam sholat sama dengan Sholat Subuh.",
    items: [
      {
        title: "Niat Sholat Maghrib",
        arab: "أُصَلِّي فَرْضَ الْمَغْرِبِ ثَلَاثَ رَكَعَاتٍ مُسْتَقْبِلَ الْقِبْلَةِ أَدَاءً لِلَّهِ تَعَالَى",
        latin: "Uṣallī farḍal-maghribi tsalātsa raka'ātin mustaqbilal-qiblati adā'an lillāhi ta'ālā.",
        terjemahan: "Aku berniat sholat fardhu Maghrib tiga rakaat menghadap kiblat, tunai karena Allah Ta'ala.",
      },
      {
        title: "Tata Cara",
        terjemahan: "Rakaat 1-2: Al-Fatihah + surat pendek, dibaca KERAS (jahr). Rakaat 3: hanya Al-Fatihah, pelan. Tasyahud awal di rakaat 2, akhir di rakaat 3.",
      },
    ],
  },
  "sholat-isya": {
    judul: "Sholat Isya — 4 Rakaat",
    pengantar: "Waktu: setelah hilang mega merah hingga sebelum fajar shadiq. Bacaan dalam sholat sama dengan Sholat Subuh.",
    items: [
      {
        title: "Niat Sholat Isya",
        arab: "أُصَلِّي فَرْضَ الْعِشَاءِ أَرْبَعَ رَكَعَاتٍ مُسْتَقْبِلَ الْقِبْلَةِ أَدَاءً لِلَّهِ تَعَالَى",
        latin: "Uṣallī farḍal-'isyā'i arba'a raka'ātin mustaqbilal-qiblati adā'an lillāhi ta'ālā.",
        terjemahan: "Aku berniat sholat fardhu Isya empat rakaat menghadap kiblat, tunai karena Allah Ta'ala.",
      },
      {
        title: "Tata Cara",
        terjemahan: "Rakaat 1-2: dibaca KERAS (jahr). Rakaat 3-4: hanya Al-Fatihah, pelan. Tasyahud awal di rakaat 2, akhir di rakaat 4.",
      },
    ],
  },

  // ─── SHOLAT SUNNAH ───
  tahajud: {
    judul: "Sholat Tahajud",
    pengantar: "Dilakukan setelah tidur, di sepertiga malam terakhir. Sebaik-baik sholat sunnah setelah yang wajib.",
    items: [
      {
        title: "Niat Sholat Tahajud",
        arab: "أُصَلِّي سُنَّةَ التَّهَجُّدِ رَكْعَتَيْنِ لِلَّهِ تَعَالَى",
        latin: "Uṣallī sunnatat-tahajjudi rak'ataini lillāhi ta'ālā.",
        terjemahan: "Aku berniat sholat sunnah Tahajud dua rakaat karena Allah Ta'ala.",
      },
      {
        title: "Doa Iftitah Tahajud",
        arab: "اللَّهُمَّ لَكَ الْحَمْدُ أَنْتَ نُورُ السَّمَاوَاتِ وَالْأَرْضِ وَمَنْ فِيهِنَّ، وَلَكَ الْحَمْدُ أَنْتَ قَيِّمُ السَّمَاوَاتِ وَالْأَرْضِ وَمَنْ فِيهِنَّ...",
        latin: "Allāhumma lakal-ḥamdu anta nūrus-samāwāti wal-arḍi wa man fīhinna, wa lakal-ḥamdu anta qayyimus-samāwāti wal-arḍi wa man fīhinna...",
        terjemahan: "Ya Allah, segala puji bagi-Mu, Engkau cahaya langit dan bumi serta isinya. Segala puji bagi-Mu, Engkau pengatur langit dan bumi serta isinya...",
      },
    ],
  },
  dhuha: {
    judul: "Sholat Dhuha",
    pengantar: "Waktu: setelah matahari naik setinggi tombak hingga sebelum tergelincir. Minimal 2 rakaat.",
    items: [
      {
        title: "Niat Sholat Dhuha",
        arab: "أُصَلِّي سُنَّةَ الضُّحَى رَكْعَتَيْنِ لِلَّهِ تَعَالَى",
        latin: "Uṣallī sunnataḍ-ḍuḥā rak'ataini lillāhi ta'ālā.",
        terjemahan: "Aku berniat sholat sunnah Dhuha dua rakaat karena Allah Ta'ala.",
      },
      {
        title: "Doa Setelah Dhuha",
        arab: "اللَّهُمَّ إِنَّ الضُّحَاءَ ضُحَاؤُكَ، وَالْبَهَاءَ بَهَاؤُكَ، وَالْجَمَالَ جَمَالُكَ، وَالْقُوَّةَ قُوَّتُكَ، وَالْقُدْرَةَ قُدْرَتُكَ، وَالْعِصْمَةَ عِصْمَتُكَ. اللَّهُمَّ إِنْ كَانَ رِزْقِي فِي السَّمَاءِ فَأَنْزِلْهُ، وَإِنْ كَانَ فِي الْأَرْضِ فَأَخْرِجْهُ...",
        latin: "Allāhumma innaḍ-ḍuḥā'a ḍuḥā'uka, wal-bahā'a bahā'uka, wal-jamāla jamāluka, wal-quwwata quwwatuka, wal-qudrata qudratuka, wal-'iṣmata 'iṣmatuk. Allāhumma in kāna rizqī fis-samā'i fa anzilhu, wa in kāna fil-arḍi fa akhrijhu...",
        terjemahan: "Ya Allah, sesungguhnya waktu dhuha adalah dhuha-Mu, keagungan adalah keagungan-Mu, keindahan adalah keindahan-Mu, kekuatan adalah kekuatan-Mu, kekuasaan adalah kekuasaan-Mu, dan perlindungan adalah perlindungan-Mu. Ya Allah, jika rezekiku masih di langit, turunkanlah; jika di bumi, keluarkanlah...",
      },
    ],
  },
  witir: {
    judul: "Sholat Witir",
    pengantar: "Sholat penutup malam — jumlah ganjil (1, 3, 5, 7, atau 9 rakaat).",
    items: [
      {
        title: "Niat Sholat Witir (1 rakaat)",
        arab: "أُصَلِّي سُنَّةَ الْوِتْرِ رَكْعَةً لِلَّهِ تَعَالَى",
        latin: "Uṣallī sunnatal-witri rak'atan lillāhi ta'ālā.",
        terjemahan: "Aku berniat sholat sunnah Witir satu rakaat karena Allah Ta'ala.",
      },
      {
        title: "Wirid Setelah Witir",
        repeat: 3,
        arab: "سُبْحَانَ الْمَلِكِ الْقُدُّوسِ",
        latin: "Subḥānal-malikil-quddūs.",
        terjemahan: "Maha Suci Allah, Raja Yang Maha Suci.",
      },
    ],
  },
  "rawatib-subuh": {
    judul: "Qabliyah Subuh — 2 Rakaat",
    pengantar: "Dua rakaat fajar lebih baik dari dunia dan seisinya. (HR. Muslim)",
    items: [
      {
        title: "Niat Qabliyah Subuh",
        arab: "أُصَلِّي سُنَّةَ الصُّبْحِ رَكْعَتَيْنِ قَبْلِيَّةً لِلَّهِ تَعَالَى",
        latin: "Uṣallī sunnataṣ-ṣubḥi rak'ataini qabliyyatan lillāhi ta'ālā.",
        terjemahan: "Aku berniat sholat sunnah qabliyah Subuh dua rakaat karena Allah Ta'ala.",
      },
    ],
  },
  "rawatib-dzuhur": {
    judul: "Rawatib Dzuhur",
    pengantar: "2 rakaat sebelum + 2 rakaat sesudah Dzuhur. Diharamkan api neraka bagi yang menjaganya.",
    items: [
      {
        title: "Niat Qabliyah Dzuhur",
        arab: "أُصَلِّي سُنَّةَ الظُّهْرِ رَكْعَتَيْنِ قَبْلِيَّةً لِلَّهِ تَعَالَى",
        latin: "Uṣallī sunnataẓ-ẓuhri rak'ataini qabliyyatan lillāhi ta'ālā.",
        terjemahan: "Aku berniat sholat sunnah qabliyah Dzuhur dua rakaat karena Allah Ta'ala.",
      },
      {
        title: "Niat Ba'diyah Dzuhur",
        arab: "أُصَلِّي سُنَّةَ الظُّهْرِ رَكْعَتَيْنِ بَعْدِيَّةً لِلَّهِ تَعَالَى",
        latin: "Uṣallī sunnataẓ-ẓuhri rak'ataini ba'diyyatan lillāhi ta'ālā.",
        terjemahan: "Aku berniat sholat sunnah ba'diyah Dzuhur dua rakaat karena Allah Ta'ala.",
      },
    ],
  },

  // ─── PUASA ───
  "puasa-senin": {
    judul: "Puasa Senin",
    pengantar: "Hari kelahiran Nabi ﷺ dan turunnya wahyu pertama.",
    items: [
      {
        title: "Niat Puasa Senin",
        arab: "نَوَيْتُ صَوْمَ يَوْمِ الْإِثْنَيْنِ سُنَّةً لِلَّهِ تَعَالَى",
        latin: "Nawaitu ṣauma yaumil itsnaini sunnatan lillāhi ta'ālā.",
        terjemahan: "Aku berniat puasa sunnah hari Senin karena Allah Ta'ala.",
        catatan: "Diniatkan sejak malam atau pagi hari sebelum tergelincir matahari (puasa sunnah).",
      },
      {
        title: "Doa Berbuka",
        arab: "اللَّهُمَّ لَكَ صُمْتُ وَبِكَ آمَنْتُ وَعَلَى رِزْقِكَ أَفْطَرْتُ بِرَحْمَتِكَ يَا أَرْحَمَ الرَّاحِمِينَ",
        latin: "Allāhumma laka ṣumtu wa bika āmantu wa 'alā rizqika afṭartu biraḥmatika yā arḥamar-rāḥimīn.",
        terjemahan: "Ya Allah, untuk-Mu aku berpuasa, kepada-Mu aku beriman, dengan rezeki-Mu aku berbuka. Dengan rahmat-Mu wahai Maha Penyayang.",
      },
    ],
  },
  "puasa-kamis": {
    judul: "Puasa Kamis",
    pengantar: "Hari di mana amal-amal dihadapkan kepada Allah ﷻ.",
    items: [
      {
        title: "Niat Puasa Kamis",
        arab: "نَوَيْتُ صَوْمَ يَوْمِ الْخَمِيسِ سُنَّةً لِلَّهِ تَعَالَى",
        latin: "Nawaitu ṣauma yaumil khamīsi sunnatan lillāhi ta'ālā.",
        terjemahan: "Aku berniat puasa sunnah hari Kamis karena Allah Ta'ala.",
      },
      {
        title: "Doa Berbuka",
        arab: "اللَّهُمَّ لَكَ صُمْتُ وَبِكَ آمَنْتُ وَعَلَى رِزْقِكَ أَفْطَرْتُ بِرَحْمَتِكَ يَا أَرْحَمَ الرَّاحِمِينَ",
        latin: "Allāhumma laka ṣumtu wa bika āmantu wa 'alā rizqika afṭartu biraḥmatika yā arḥamar-rāḥimīn.",
        terjemahan: "Ya Allah, untuk-Mu aku berpuasa, kepada-Mu aku beriman, dengan rezeki-Mu aku berbuka. Dengan rahmat-Mu wahai Maha Penyayang.",
      },
    ],
  },
  "puasa-bidh": {
    judul: "Puasa Ayyamul Bidh",
    pengantar: "Puasa tanggal 13, 14, 15 setiap bulan Hijriyah. Setara puasa setahun penuh (HR. Nasa'i).",
    items: [
      {
        title: "Niat Puasa Ayyamul Bidh",
        arab: "نَوَيْتُ صَوْمَ أَيَّامِ الْبِيضِ سُنَّةً لِلَّهِ تَعَالَى",
        latin: "Nawaitu ṣauma ayyāmil bīḍi sunnatan lillāhi ta'ālā.",
        terjemahan: "Aku berniat puasa sunnah Ayyamul Bidh karena Allah Ta'ala.",
      },
      {
        title: "Doa Berbuka",
        arab: "اللَّهُمَّ لَكَ صُمْتُ وَبِكَ آمَنْتُ وَعَلَى رِزْقِكَ أَفْطَرْتُ بِرَحْمَتِكَ يَا أَرْحَمَ الرَّاحِمِينَ",
        latin: "Allāhumma laka ṣumtu wa bika āmantu wa 'alā rizqika afṭartu biraḥmatika yā arḥamar-rāḥimīn.",
        terjemahan: "Ya Allah, untuk-Mu aku berpuasa, kepada-Mu aku beriman, dengan rezeki-Mu aku berbuka. Dengan rahmat-Mu wahai Maha Penyayang.",
      },
    ],
  },

  // ═══════════════════════════════════════════
  // DOA HARIAN
  // ═══════════════════════════════════════════
  "doa-sebelum-makan": {
    judul: "Doa Sebelum Makan",
    pengantar: "Rasulullah ﷺ memerintahkan menyebut nama Allah saat mulai makan.",
    items: [
      {
        arab: "اللَّهُمَّ بَارِكْ لَنَا فِيمَا رَزَقْتَنَا وَقِنَا عَذَابَ النَّارِ، بِسْمِ اللَّهِ",
        latin: "Allāhumma bārik lanā fīmā razaqtanā wa qinā 'adzāban-nār. Bismillāh.",
        terjemahan: "Ya Allah, berkahilah kami atas rezeki yang Engkau berikan, dan lindungilah kami dari siksa neraka. Dengan nama Allah.",
      },
      {
        title: "Jika Lupa di Awal",
        arab: "بِسْمِ اللَّهِ أَوَّلَهُ وَآخِرَهُ",
        latin: "Bismillāhi awwalahū wa ākhirah.",
        terjemahan: "Dengan nama Allah, di awal dan akhirnya.",
        catatan: "Dibaca bila sudah terlanjur makan/minum tanpa basmalah. (HR. Abu Dawud)",
      },
    ],
  },
  "doa-sesudah-makan": {
    judul: "Doa Sesudah Makan",
    items: [
      {
        arab: "الْحَمْدُ لِلَّهِ الَّذِي أَطْعَمَنَا وَسَقَانَا وَجَعَلَنَا مُسْلِمِينَ",
        latin: "Alḥamdulillāhilladzī aṭ'amanā wa saqānā wa ja'alanā muslimīn.",
        terjemahan: "Segala puji bagi Allah, yang telah memberi kami makan dan minum, serta menjadikan kami sebagai muslim.",
      },
    ],
  },
  "doa-sesudah-minum": {
    judul: "Doa Sesudah Minum",
    items: [
      {
        arab: "الْحَمْدُ لِلَّهِ الَّذِي جَعَلَهُ عَذْبًا فُرَاتًا بِرَحْمَتِهِ وَلَمْ يَجْعَلْهُ مِلْحًا أُجَاجًا بِذُنُوبِنَا",
        latin: "Alḥamdulillāhilladzī ja'alahū 'adzban furātan biraḥmatihī wa lam yaj'alhū milḥan ujājan bidzunūbinā.",
        terjemahan: "Segala puji bagi Allah, yang dengan rahmat-Nya menjadikan air ini tawar dan segar, dan tidak menjadikannya asin disebabkan dosa-dosa kami.",
      },
    ],
  },
  "doa-tidur": {
    judul: "Doa Sebelum Tidur",
    pengantar: "Tidurnya orang berdzikir bernilai ibadah.",
    items: [
      {
        title: "Doa Pendek",
        arab: "بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا",
        latin: "Bismika Allāhumma amūtu wa aḥyā.",
        terjemahan: "Dengan nama-Mu ya Allah, aku mati dan aku hidup.",
      },
      {
        title: "Al-Mu'awwidzatain",
        repeat: 3,
        terjemahan: "Baca Al-Ikhlas, Al-Falaq, An-Nas 3× lalu tiup ke telapak tangan dan usapkan ke seluruh tubuh. (HR. Bukhari)",
      },
      {
        title: "Ayat Kursi",
        arab: "اللَّهُ لَا إِلَهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ...",
        terjemahan: "Baca Ayat Kursi sebelum tidur — selalu ada malaikat penjaga hingga subuh, setan tidak akan mendekat. (HR. Bukhari)",
      },
    ],
  },
  "doa-bangun": {
    judul: "Doa Bangun Tidur",
    items: [
      {
        arab: "الْحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا بَعْدَمَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ",
        latin: "Alḥamdulillāhilladzī aḥyānā ba'damā amātanā wa ilaihin-nusyūr.",
        terjemahan: "Segala puji bagi Allah, yang menghidupkan kami setelah mematikan kami, dan kepada-Nya-lah tempat kembali.",
      },
    ],
  },
  "doa-masuk-wc": {
    judul: "Doa Masuk WC / Toilet",
    pengantar: "Dibaca SEBELUM masuk, dengan kaki kiri terlebih dahulu.",
    items: [
      {
        arab: "اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْخُبُثِ وَالْخَبَائِثِ",
        latin: "Allāhumma innī a'ūdzu bika minal-khubutsi wal-khabā'its.",
        terjemahan: "Ya Allah, aku berlindung kepada-Mu dari setan jantan dan setan betina.",
        catatan: "Boleh juga tambahkan: \"Bismillāh\" di depannya.",
      },
    ],
  },
  "doa-keluar-wc": {
    judul: "Doa Keluar WC / Toilet",
    pengantar: "Keluar dengan kaki kanan terlebih dahulu.",
    items: [
      {
        arab: "غُفْرَانَكَ",
        latin: "Ghufrānak.",
        terjemahan: "Aku memohon ampunan-Mu (ya Allah).",
      },
      {
        title: "Versi Panjang",
        arab: "الْحَمْدُ لِلَّهِ الَّذِي أَذْهَبَ عَنِّي الْأَذَى وَعَافَانِي",
        latin: "Alḥamdulillāhilladzī adzhaba 'annil-adzā wa 'āfānī.",
        terjemahan: "Segala puji bagi Allah, yang telah menghilangkan kotoran dariku dan memberiku 'afiyah.",
      },
    ],
  },
  "doa-masuk-rumah": {
    judul: "Doa Masuk Rumah",
    items: [
      {
        arab: "بِسْمِ اللَّهِ وَلَجْنَا، وَبِسْمِ اللَّهِ خَرَجْنَا، وَعَلَى اللَّهِ رَبِّنَا تَوَكَّلْنَا، السَّلَامُ عَلَيْكُمْ",
        latin: "Bismillāhi walajnā, wa bismillāhi kharajnā, wa 'alallāhi rabbinā tawakkalnā. Assalāmu 'alaikum.",
        terjemahan: "Dengan nama Allah kami masuk, dengan nama Allah kami keluar, dan kepada Allah Tuhan kami, kami bertawakal. Salam sejahtera (untuk penghuni).",
        catatan: "Salam dibaca walaupun rumah kosong — diniatkan untuk diri sendiri dan malaikat.",
      },
    ],
  },
  "doa-keluar-rumah": {
    judul: "Doa Keluar Rumah",
    items: [
      {
        arab: "بِسْمِ اللَّهِ، تَوَكَّلْتُ عَلَى اللَّهِ، لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ",
        latin: "Bismillāh, tawakkaltu 'alallāh, lā ḥaula wa lā quwwata illā billāh.",
        terjemahan: "Dengan nama Allah, aku bertawakal kepada Allah. Tidak ada daya dan kekuatan kecuali dengan Allah.",
        catatan: '"Engkau telah dicukupi, dilindungi, dan setan akan menjauh." (HR. Abu Dawud & Tirmidzi)',
      },
    ],
  },
  "doa-masuk-masjid": {
    judul: "Doa Masuk Masjid",
    pengantar: "Masuk dengan kaki KANAN terlebih dahulu.",
    items: [
      {
        arab: "اللَّهُمَّ افْتَحْ لِي أَبْوَابَ رَحْمَتِكَ",
        latin: "Allāhummaftaḥ lī abwāba raḥmatik.",
        terjemahan: "Ya Allah, bukakanlah untukku pintu-pintu rahmat-Mu.",
      },
    ],
  },
  "doa-keluar-masjid": {
    judul: "Doa Keluar Masjid",
    pengantar: "Keluar dengan kaki KIRI terlebih dahulu.",
    items: [
      {
        arab: "اللَّهُمَّ إِنِّي أَسْأَلُكَ مِنْ فَضْلِكَ",
        latin: "Allāhumma innī as'aluka min faḍlik.",
        terjemahan: "Ya Allah, aku memohon kepada-Mu sebagian dari karunia-Mu.",
      },
    ],
  },
  "doa-wudhu": {
    judul: "Doa Setelah Wudhu",
    pengantar: "Dibukakan 8 pintu surga, masuk dari mana saja yang ia mau. (HR. Muslim)",
    items: [
      {
        arab: "أَشْهَدُ أَنْ لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، وَأَشْهَدُ أَنَّ مُحَمَّدًا عَبْدُهُ وَرَسُولُهُ. اللَّهُمَّ اجْعَلْنِي مِنَ التَّوَّابِينَ وَاجْعَلْنِي مِنَ الْمُتَطَهِّرِينَ",
        latin: "Asyhadu allā ilāha illallāhu waḥdahū lā syarīka lah, wa asyhadu anna Muḥammadan 'abduhū wa rasūluh. Allāhummaj'alnī minat-tawwābīna waj'alnī minal-mutaṭahhirīn.",
        terjemahan: "Aku bersaksi tidak ada tuhan selain Allah Yang Maha Esa, tidak ada sekutu bagi-Nya, dan aku bersaksi bahwa Muhammad adalah hamba dan utusan-Nya. Ya Allah, jadikanlah aku termasuk orang-orang yang bertaubat dan jadikanlah aku termasuk orang-orang yang bersuci.",
      },
    ],
  },
  "doa-kendaraan": {
    judul: "Doa Naik Kendaraan",
    items: [
      {
        arab: "سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَذَا وَمَا كُنَّا لَهُ مُقْرِنِينَ، وَإِنَّا إِلَى رَبِّنَا لَمُنْقَلِبُونَ",
        latin: "Subḥānalladzī sakhkhara lanā hādzā wa mā kunnā lahū muqrinīn, wa innā ilā rabbinā lamunqalibūn.",
        terjemahan: "Maha Suci Tuhan yang menundukkan kendaraan ini untuk kami, padahal kami sebelumnya tidak mampu menguasainya. Sesungguhnya kami akan kembali kepada Tuhan kami.",
        catatan: "QS. Az-Zukhruf: 13-14",
      },
    ],
  },
  "doa-safar": {
    judul: "Doa Bepergian (Safar)",
    items: [
      {
        arab: "اللَّهُمَّ إِنَّا نَسْأَلُكَ فِي سَفَرِنَا هَذَا الْبِرَّ وَالتَّقْوَى، وَمِنَ الْعَمَلِ مَا تَرْضَى. اللَّهُمَّ هَوِّنْ عَلَيْنَا سَفَرَنَا هَذَا وَاطْوِ عَنَّا بُعْدَهُ. اللَّهُمَّ أَنْتَ الصَّاحِبُ فِي السَّفَرِ وَالْخَلِيفَةُ فِي الْأَهْلِ",
        latin: "Allāhumma innā nas'aluka fī safarinā hādzal birra wat-taqwā, wa minal 'amali mā tarḍā. Allāhumma hawwin 'alainā safaranā hādzā waṭwi 'annā bu'dah. Allāhumma antaṣ-ṣāḥibu fis-safari wal-khalīfatu fil-ahl.",
        terjemahan: "Ya Allah, kami memohon dalam perjalanan ini kebaikan dan ketakwaan, serta amal yang Engkau ridhai. Ya Allah, mudahkanlah perjalanan kami ini dan dekatkanlah jaraknya yang jauh. Ya Allah, Engkaulah teman dalam perjalanan dan pengganti dalam keluarga.",
      },
    ],
  },
  "doa-sapu-jagad": {
    judul: "Doa Sapu Jagad",
    pengantar: "Doa terlengkap dalam Al-Qur'an. Dibaca minimal di akhir doa apa pun.",
    items: [
      {
        arab: "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ",
        latin: "Rabbanā ātinā fid-dunyā ḥasanah wa fil-ākhirati ḥasanah wa qinā 'adzāban-nār.",
        terjemahan: "Ya Tuhan kami, berilah kami kebaikan di dunia dan kebaikan di akhirat, dan peliharalah kami dari siksa neraka.",
        catatan: "QS. Al-Baqarah: 201",
      },
    ],
  },

  // ═══════════════════════════════════════════
  // DOA SITUASIONAL & KELUARGA
  // ═══════════════════════════════════════════
  "doa-ilmu": {
    judul: "Doa Minta Tambahan Ilmu",
    pengantar: "Doa yang Allah perintahkan langsung kepada Nabi Muhammad ﷺ.",
    items: [
      {
        arab: "رَبِّ زِدْنِي عِلْمًا",
        latin: "Rabbi zidnī 'ilmā.",
        terjemahan: "Ya Tuhanku, tambahkanlah kepadaku ilmu pengetahuan.",
        catatan: "QS. Thaha: 114",
      },
      {
        title: "Doa Sebelum Belajar",
        arab: "رَبِّ زِدْنِي عِلْمًا وَارْزُقْنِي فَهْمًا، اللَّهُمَّ افْتَحْ عَلَيَّ فُتُوحَ الْعَارِفِينَ",
        latin: "Rabbi zidnī 'ilman warzuqnī fahmā, Allāhummaftaḥ 'alayya futūḥal-'ārifīn.",
        terjemahan: "Ya Tuhanku, tambahkanlah ilmuku dan berikan aku pemahaman. Ya Allah, bukakanlah bagiku pintu-pintu (pengetahuan) sebagaimana terbuka bagi orang-orang yang arif.",
      },
    ],
  },
  "doa-rezeki": {
    judul: "Doa Minta Rezeki Halal",
    items: [
      {
        arab: "اللَّهُمَّ اكْفِنِي بِحَلَالِكَ عَنْ حَرَامِكَ، وَأَغْنِنِي بِفَضْلِكَ عَمَّنْ سِوَاكَ",
        latin: "Allāhummakfinī biḥalālika 'an ḥarāmik, wa aghninī bifaḍlika 'amman siwāk.",
        terjemahan: "Ya Allah, cukupkanlah aku dengan rezeki halal-Mu dari yang haram, dan kayakanlah aku dengan karunia-Mu dari selain-Mu.",
        catatan: "HR. Tirmidzi",
      },
      {
        title: "Doa Nabi Musa AS",
        arab: "رَبِّ إِنِّي لِمَا أَنْزَلْتَ إِلَيَّ مِنْ خَيْرٍ فَقِيرٌ",
        latin: "Rabbi innī limā anzalta ilayya min khairin faqīr.",
        terjemahan: "Ya Tuhanku, sungguh aku sangat memerlukan kebaikan yang Engkau turunkan kepadaku.",
        catatan: "QS. Al-Qashash: 24",
      },
    ],
  },
  "doa-keturunan": {
    judul: "Doa Minta Keturunan Sholeh",
    items: [
      {
        title: "Doa Nabi Zakaria AS",
        arab: "رَبِّ هَبْ لِي مِنْ لَدُنْكَ ذُرِّيَّةً طَيِّبَةً، إِنَّكَ سَمِيعُ الدُّعَاءِ",
        latin: "Rabbi hab lī min ladunka dzurriyyatan ṭayyibah, innaka samī'ud-du'ā.",
        terjemahan: "Ya Tuhanku, berilah aku dari sisi-Mu keturunan yang baik. Sesungguhnya Engkau Maha Mendengar doa.",
        catatan: "QS. Ali Imran: 38",
      },
      {
        title: "Doa Ibadurrahman",
        arab: "رَبَّنَا هَبْ لَنَا مِنْ أَزْوَاجِنَا وَذُرِّيَّاتِنَا قُرَّةَ أَعْيُنٍ وَاجْعَلْنَا لِلْمُتَّقِينَ إِمَامًا",
        latin: "Rabbanā hab lanā min azwājinā wa dzurriyyātinā qurrata a'yunin waj'alnā lil-muttaqīna imāmā.",
        terjemahan: "Ya Tuhan kami, anugerahkanlah kepada kami pasangan dan keturunan kami sebagai penyejuk mata, dan jadikanlah kami imam bagi orang-orang yang bertakwa.",
        catatan: "QS. Al-Furqan: 74",
      },
    ],
  },
  "doa-lapang-dada": {
    judul: "Doa Lapang Dada (Nabi Musa AS)",
    pengantar: "Dibaca saat menghadapi tugas berat, ujian, atau saat cemas.",
    items: [
      {
        arab: "رَبِّ اشْرَحْ لِي صَدْرِي، وَيَسِّرْ لِي أَمْرِي، وَاحْلُلْ عُقْدَةً مِنْ لِسَانِي، يَفْقَهُوا قَوْلِي",
        latin: "Rabbisyraḥ lī ṣadrī, wa yassir lī amrī, waḥlul 'uqdatan min lisānī, yafqahū qaulī.",
        terjemahan: "Ya Tuhanku, lapangkanlah dadaku, mudahkanlah urusanku, dan lepaskanlah kekakuan dari lidahku, supaya mereka mengerti perkataanku.",
        catatan: "QS. Thaha: 25-28",
      },
    ],
  },
  "doa-hujan": {
    judul: "Doa Saat Hujan",
    pengantar: "Waktu hujan adalah waktu mustajab — perbanyak doa.",
    items: [
      {
        title: "Saat Mulai Hujan",
        arab: "اللَّهُمَّ صَيِّبًا نَافِعًا",
        latin: "Allāhumma ṣayyiban nāfi'ā.",
        terjemahan: "Ya Allah, jadikanlah hujan ini hujan yang bermanfaat.",
      },
      {
        title: "Setelah Hujan",
        arab: "مُطِرْنَا بِفَضْلِ اللَّهِ وَرَحْمَتِهِ",
        latin: "Muṭirnā bifaḍlillāhi wa raḥmatih.",
        terjemahan: "Telah diturunkan hujan kepada kami berkat karunia Allah dan rahmat-Nya.",
      },
      {
        title: "Bila Hujan Lebat (Khawatir Bahaya)",
        arab: "اللَّهُمَّ حَوَالَيْنَا وَلَا عَلَيْنَا، اللَّهُمَّ عَلَى الْآكَامِ وَالظِّرَابِ وَبُطُونِ الْأَوْدِيَةِ وَمَنَابِتِ الشَّجَرِ",
        latin: "Allāhumma ḥawālainā wa lā 'alainā, Allāhumma 'alal-ākāmi waẓ-ẓirābi wa buṭūnil-audiyati wa manābitisy-syajar.",
        terjemahan: "Ya Allah, (turunkanlah hujan) di sekitar kami, bukan menimpa kami. Ya Allah, ke tempat-tempat tinggi, perbukitan, lembah-lembah, dan tempat tumbuhnya pohon-pohon.",
      },
    ],
  },
  "doa-besuk": {
    judul: "Doa Saat Besuk Orang Sakit",
    pengantar: "Diutus 70 ribu malaikat untuk mendoakan orang yang membesuk. (HR. Tirmidzi)",
    items: [
      {
        title: "Doa Pendek (7×)",
        repeat: 7,
        arab: "أَسْأَلُ اللَّهَ الْعَظِيمَ رَبَّ الْعَرْشِ الْعَظِيمِ أَنْ يَشْفِيَكَ",
        latin: "As'alullāhal-'aẓīma rabbal-'arsyil-'aẓīmi an yasyfiyak.",
        terjemahan: "Aku memohon kepada Allah Yang Maha Agung, Tuhan 'Arsy yang agung, agar menyembuhkanmu.",
        catatan: "Dibaca 7× di sisi orang sakit. (HR. Abu Dawud)",
      },
      {
        title: "Doa Lengkap",
        arab: "اللَّهُمَّ رَبَّ النَّاسِ، أَذْهِبِ الْبَأْسَ، اشْفِ أَنْتَ الشَّافِي، لَا شِفَاءَ إِلَّا شِفَاؤُكَ، شِفَاءً لَا يُغَادِرُ سَقَمًا",
        latin: "Allāhumma rabban-nās, adzhibil-ba'sa, isyfi antasy-syāfī, lā syifā'a illā syifā'uka, syifā'an lā yughādiru saqamā.",
        terjemahan: "Ya Allah, Tuhan manusia, hilangkanlah penyakit, sembuhkanlah karena Engkau Maha Penyembuh. Tidak ada kesembuhan kecuali kesembuhan-Mu — kesembuhan yang tidak meninggalkan sakit.",
      },
    ],
  },
  "doa-ziarah-kubur": {
    judul: "Doa Ziarah Kubur",
    pengantar: "Salam untuk ahli kubur saat berziarah.",
    items: [
      {
        title: "Salam Ahli Kubur",
        arab: "السَّلَامُ عَلَيْكُمْ يَا أَهْلَ الْقُبُورِ، يَغْفِرُ اللَّهُ لَنَا وَلَكُمْ، أَنْتُمْ سَلَفُنَا وَنَحْنُ بِالْأَثَرِ",
        latin: "Assalāmu 'alaikum yā ahlal-qubūr, yaghfirullāhu lanā wa lakum, antum salafunā wa naḥnu bil-atsar.",
        terjemahan: "Semoga keselamatan tercurah kepada kalian wahai ahli kubur, semoga Allah mengampuni kami dan kalian. Kalian telah mendahului kami, dan kami akan menyusul kemudian.",
      },
      {
        title: "Doa untuk yang Meninggal",
        arab: "اللَّهُمَّ اغْفِرْ لَهُ وَارْحَمْهُ وَعَافِهِ وَاعْفُ عَنْهُ، وَأَكْرِمْ نُزُلَهُ، وَوَسِّعْ مُدْخَلَهُ",
        latin: "Allāhummaghfir lahu warḥamhu wa 'āfihi wa'fu 'anhu, wa akrim nuzulah, wa wassi' mudkhalah.",
        terjemahan: "Ya Allah, ampunilah dia, rahmatilah, sehatkanlah, dan maafkanlah dia. Muliakanlah tempatnya, dan lapangkanlah kuburnya.",
      },
    ],
  },
  "doa-lailatul-qadar": {
    judul: "Doa Lailatul Qadar",
    pengantar: "Diajarkan Nabi ﷺ kepada Aisyah RA — perbanyak di 10 malam terakhir Ramadhan.",
    items: [
      {
        arab: "اللَّهُمَّ إِنَّكَ عَفُوٌّ كَرِيمٌ تُحِبُّ الْعَفْوَ فَاعْفُ عَنِّي",
        latin: "Allāhumma innaka 'afuwwun karīmun tuḥibbul-'afwa fa'fu 'annī.",
        terjemahan: "Ya Allah, sesungguhnya Engkau Maha Pemaaf, Mahamulia, Engkau mencintai pemaafan, maka maafkanlah aku.",
        catatan: "HR. Tirmidzi & Ibnu Majah",
      },
    ],
  },
  "doa-talbiyah": {
    judul: "Talbiyah Haji & Umroh",
    pengantar: "Dibaca sejak niat ihram hingga melempar jumrah aqabah (haji) atau hingga thawaf (umroh).",
    items: [
      {
        arab: "لَبَّيْكَ اللَّهُمَّ لَبَّيْكَ، لَبَّيْكَ لَا شَرِيكَ لَكَ لَبَّيْكَ، إِنَّ الْحَمْدَ وَالنِّعْمَةَ لَكَ وَالْمُلْكَ، لَا شَرِيكَ لَكَ",
        latin: "Labbaika Allāhumma labbaik, labbaika lā syarīka laka labbaik, innal-ḥamda wan-ni'mata laka wal-mulk, lā syarīka lak.",
        terjemahan: "Aku penuhi panggilan-Mu ya Allah, aku penuhi panggilan-Mu. Aku penuhi panggilan-Mu, tidak ada sekutu bagi-Mu. Sesungguhnya segala puji, nikmat, dan kerajaan adalah milik-Mu, tidak ada sekutu bagi-Mu.",
      },
    ],
  },
  "doa-akad-nikah": {
    judul: "Doa Setelah Akad Nikah",
    pengantar: "Doa Nabi ﷺ untuk pengantin agar diberkahi.",
    items: [
      {
        arab: "بَارَكَ اللَّهُ لَكَ، وَبَارَكَ عَلَيْكَ، وَجَمَعَ بَيْنَكُمَا فِي خَيْرٍ",
        latin: "Bārakallāhu lak, wa bāraka 'alaik, wa jama'a bainakumā fī khair.",
        terjemahan: "Semoga Allah memberkahimu, melimpahkan berkah atasmu, dan menyatukan kalian berdua dalam kebaikan.",
        catatan: "HR. Tirmidzi, Abu Dawud — diucapkan kepada pengantin baru.",
      },
    ],
  },
  "doa-aqiqah": {
    judul: "Doa Aqiqah",
    pengantar: "Sunnah hari ke-7 kelahiran — sembelih kambing & beri nama.",
    items: [
      {
        title: "Niat Aqiqah Saat Menyembelih",
        arab: "بِسْمِ اللَّهِ، اللَّهُمَّ هَذِهِ عَقِيقَةُ فُلَانٍ بْنِ فُلَانٍ، لَحْمُهَا بِلَحْمِهِ وَدَمُهَا بِدَمِهِ وَعَظْمُهَا بِعَظْمِهِ، اللَّهُمَّ اجْعَلْهَا فِدَاءً لِابْنِي مِنَ النَّارِ",
        latin: "Bismillāh. Allāhumma hādzihī 'aqīqatu fulānin bni fulān, laḥmuhā biliḥmihī wa damuhā bidamihī wa 'aẓmuhā bi'aẓmih. Allāhummaj'alhā fidā'an libnī minan-nār.",
        terjemahan: "Dengan nama Allah. Ya Allah, ini aqiqah si fulan bin fulan, dagingnya untuk dagingnya, darahnya untuk darahnya, tulangnya untuk tulangnya. Ya Allah, jadikanlah aqiqah ini tebusan bagi anakku dari (siksa) neraka.",
        catatan: "Sebutkan nama anak dan ayah secara lengkap. Untuk anak laki-laki 2 kambing, perempuan 1 kambing.",
      },
    ],
  },

  // ─── DOA ORTU ───
  "doa-ortu": {
    judul: "Doa untuk Kedua Orang Tua",
    pengantar: "Doa anak sholeh adalah salah satu dari tiga amal yang tidak terputus. (HR. Muslim)",
    items: [
      {
        title: "Doa Pendek",
        arab: "رَبِّ اغْفِرْ لِي وَلِوَالِدَيَّ وَارْحَمْهُمَا كَمَا رَبَّيَانِي صَغِيرًا",
        latin: "Rabbighfir lī wa liwālidayya warḥamhumā kamā rabbayānī ṣaghīrā.",
        terjemahan: "Wahai Tuhanku, ampunilah aku dan kedua orang tuaku, dan sayangilah mereka sebagaimana mereka menyayangiku di waktu kecil.",
        catatan: "QS. Al-Isra: 24",
      },
      {
        title: "Doa Lengkap",
        arab: "اللَّهُمَّ اغْفِرْ لِي وَلِوَالِدَيَّ، وَارْحَمْهُمَا كَمَا رَبَّيَانِي صَغِيرًا، وَلِجَمِيعِ الْمُسْلِمِينَ وَالْمُسْلِمَاتِ وَالْمُؤْمِنِينَ وَالْمُؤْمِنَاتِ، الْأَحْيَاءِ مِنْهُمْ وَالْأَمْوَاتِ، إِنَّكَ سَمِيعٌ قَرِيبٌ مُجِيبُ الدَّعَوَاتِ",
        latin: "Allāhummaghfir lī wa liwālidayya, warḥamhumā kamā rabbayānī ṣaghīrā, wa lijamī'il-muslimīna wal-muslimāti wal-mu'minīna wal-mu'mināt, al-aḥyā'i minhum wal-amwāt, innaka samī'un qarību mujībud-da'awāt.",
        terjemahan: "Ya Allah, ampunilah aku dan kedua orang tuaku, sayangilah keduanya sebagaimana mereka menyayangiku sewaktu kecil. Dan ampunilah seluruh kaum muslimin dan muslimat, mukminin dan mukminat, yang masih hidup maupun yang sudah meninggal. Sesungguhnya Engkau Maha Mendengar, Maha Dekat, dan Maha Mengabulkan doa.",
      },
    ],
  },

  // ═══════════════════════════════════════════
  // ADAB HARIAN — TAMBAHAN
  // ═══════════════════════════════════════════
  "doa-buka-puasa": {
    judul: "Doa Berbuka Puasa",
    pengantar: "Dibaca saat berbuka — momen mustajab. (HR. Abu Dawud, Tirmidzi)",
    items: [
      {
        title: "Doa Berbuka (Riwayat Abu Dawud)",
        arab: "ذَهَبَ الظَّمَأُ، وَابْتَلَّتِ الْعُرُوقُ، وَثَبَتَ الْأَجْرُ إِنْ شَاءَ اللَّهُ",
        latin: "Dzahabaẓ-ẓama'u, wabtallatil-'urūqu, wa tsabatal-ajru insyā'allāh.",
        terjemahan: "Telah hilang dahaga, urat-urat menjadi basah, dan telah tetap pahala insya Allah.",
      },
      {
        title: "Doa Berbuka (Populer di Indonesia)",
        arab: "اللَّهُمَّ لَكَ صُمْتُ وَبِكَ آمَنْتُ وَعَلَى رِزْقِكَ أَفْطَرْتُ، بِرَحْمَتِكَ يَا أَرْحَمَ الرَّاحِمِينَ",
        latin: "Allāhumma laka ṣumtu wa bika āmantu wa 'alā rizqika afṭartu, bi-raḥmatika yā arḥamar-rāḥimīn.",
        terjemahan: "Ya Allah, karena-Mu aku berpuasa, kepada-Mu aku beriman, dan atas rezeki-Mu aku berbuka. Dengan rahmat-Mu wahai Yang Maha Penyayang.",
      },
    ],
  },
  "doa-sahur": {
    judul: "Niat Puasa & Sahur",
    pengantar: "Niat puasa wajib Ramadhan diucapkan sebelum fajar; sahur sendiri adalah sunnah berkah.",
    items: [
      {
        title: "Niat Puasa Ramadhan",
        arab: "نَوَيْتُ صَوْمَ غَدٍ عَنْ أَدَاءِ فَرْضِ شَهْرِ رَمَضَانَ هَذِهِ السَّنَةِ لِلَّهِ تَعَالَى",
        latin: "Nawaitu ṣauma ghadin 'an adā'i farḍi syahri Ramaḍāna hādzihis-sanati lillāhi ta'ālā.",
        terjemahan: "Saya niat berpuasa esok hari untuk menunaikan kewajiban bulan Ramadhan tahun ini karena Allah Ta'ala.",
      },
      {
        title: "Doa Sahur (Syukur)",
        arab: "اللَّهُمَّ بَارِكْ لَنَا فِيمَا رَزَقْتَنَا وَأَعِنَّا عَلَى صِيَامِنَا",
        latin: "Allāhumma bārik lanā fīmā razaqtanā wa a'innā 'alā ṣiyāminā.",
        terjemahan: "Ya Allah, berkahilah rezeki yang Engkau berikan kepada kami, dan tolonglah kami dalam menjalankan puasa.",
      },
    ],
  },
  "doa-bercermin": {
    judul: "Doa Saat Bercermin",
    pengantar: "Diajarkan Nabi ﷺ untuk memohon akhlak yang baik sebanding dengan rupa yang baik.",
    items: [
      {
        title: "Doa Bercermin",
        arab: "اللَّهُمَّ كَمَا حَسَّنْتَ خَلْقِي فَحَسِّنْ خُلُقِي",
        latin: "Allāhumma kamā ḥassanta khalqī fa-ḥassin khuluqī.",
        terjemahan: "Ya Allah, sebagaimana Engkau telah memperindah penciptaanku, maka perindahlah pula akhlakku.",
        catatan: "HR. Ahmad. Sangat dianjurkan setiap kali bercermin.",
      },
    ],
  },
  "doa-pakaian-baru": {
    judul: "Doa Memakai Pakaian Baru",
    pengantar: "Diampuni dosa-dosa yang lalu bagi yang mengamalkannya. (HR. Tirmidzi)",
    items: [
      {
        title: "Doa Pakaian Baru",
        arab: "اللَّهُمَّ لَكَ الْحَمْدُ، أَنْتَ كَسَوْتَنِيهِ، أَسْأَلُكَ مِنْ خَيْرِهِ وَخَيْرِ مَا صُنِعَ لَهُ، وَأَعُوذُ بِكَ مِنْ شَرِّهِ وَشَرِّ مَا صُنِعَ لَهُ",
        latin: "Allāhumma lakal-ḥamdu, anta kasautanīh, as'aluka min khairihī wa khairi mā ṣuni'a lah, wa a'ūdzu bika min syarrihī wa syarri mā ṣuni'a lah.",
        terjemahan: "Ya Allah, segala puji bagi-Mu. Engkau yang memberiku pakaian ini. Aku memohon kepada-Mu kebaikannya dan kebaikan apa yang ia dibuat untuknya. Dan aku berlindung kepada-Mu dari keburukannya dan keburukan apa yang ia dibuat untuknya.",
      },
    ],
  },
  "doa-bersin": {
    judul: "Doa Bersin & Balasannya",
    pengantar: "Adab bersin antara muslim — hak sesama yang dianjurkan Nabi ﷺ. (HR. Bukhari)",
    items: [
      {
        title: "Yang Bersin Mengucapkan",
        arab: "الْحَمْدُ لِلَّهِ",
        latin: "Alḥamdulillāh.",
        terjemahan: "Segala puji bagi Allah.",
      },
      {
        title: "Yang Mendengar Membalas",
        arab: "يَرْحَمُكَ اللَّهُ",
        latin: "Yarḥamukallāh.",
        terjemahan: "Semoga Allah merahmatimu.",
      },
      {
        title: "Yang Bersin Membalas",
        arab: "يَهْدِيكُمُ اللَّهُ وَيُصْلِحُ بَالَكُمْ",
        latin: "Yahdīkumullāhu wa yuṣliḥu bālakum.",
        terjemahan: "Semoga Allah memberimu hidayah dan memperbaiki keadaanmu.",
      },
    ],
  },
  "doa-pasar": {
    judul: "Doa Masuk Pasar",
    pengantar: "Ditulis untuknya sejuta kebaikan, dihapus sejuta kesalahan, dan diangkat sejuta derajat. (HR. Tirmidzi)",
    items: [
      {
        title: "Doa Masuk Pasar",
        arab: "لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ، يُحْيِي وَيُمِيتُ، وَهُوَ حَيٌّ لَا يَمُوتُ، بِيَدِهِ الْخَيْرُ، وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ",
        latin: "Lā ilāha illallāhu waḥdahū lā syarīka lah, lahul-mulku wa lahul-ḥamdu, yuḥyī wa yumītu, wa huwa ḥayyun lā yamūtu, biyadihil-khairu, wa huwa 'alā kulli syai'in qadīr.",
        terjemahan: "Tidak ada Tuhan selain Allah Yang Maha Esa, tiada sekutu bagi-Nya. Bagi-Nya kerajaan dan segala puji. Dia menghidupkan dan mematikan, sedang Dia Mahahidup tidak akan mati. Di tangan-Nya segala kebaikan, dan Dia Mahakuasa atas segala sesuatu.",
      },
    ],
  },
  "doa-zam-zam": {
    judul: "Doa Minum Air Zam-zam",
    pengantar: "Air zam-zam sesuai dengan niat orang yang meminumnya. (HR. Ibnu Majah)",
    items: [
      {
        title: "Doa Minum Zam-zam (Ibnu Abbas)",
        arab: "اللَّهُمَّ إِنِّي أَسْأَلُكَ عِلْمًا نَافِعًا، وَرِزْقًا وَاسِعًا، وَشِفَاءً مِنْ كُلِّ دَاءٍ",
        latin: "Allāhumma innī as'aluka 'ilman nāfi'ā, wa rizqan wāsi'ā, wa syifā'an min kulli dā'.",
        terjemahan: "Ya Allah, aku memohon kepada-Mu ilmu yang bermanfaat, rezeki yang luas, dan kesembuhan dari segala penyakit.",
        catatan: "Riwayat Imam Daruquthni dari Ibnu Abbas RA.",
      },
    ],
  },
  "doa-mimpi-buruk": {
    judul: "Doa Setelah Mimpi Buruk",
    pengantar: "Sunnah Nabi saat mengalami mimpi yang tidak menyenangkan. (HR. Bukhari & Muslim)",
    items: [
      {
        title: "Langkah-langkah",
        terjemahan: "1) Meludah ringan ke kiri 3 kali. 2) Baca ta'awudz. 3) Pindah posisi tidur. 4) Tidak menceritakan kepada siapa pun.",
      },
      {
        title: "Bacaan Ta'awudz",
        arab: "أَعُوذُ بِاللَّهِ مِنَ الشَّيْطَانِ الرَّجِيمِ وَمِنْ شَرِّ مَا رَأَيْتُ",
        latin: "A'ūdzu billāhi minasy-syaiṭānir-rajīm wa min syarri mā ra'ait.",
        terjemahan: "Aku berlindung kepada Allah dari setan yang terkutuk dan dari keburukan apa yang aku lihat.",
      },
    ],
  },
  "doa-istikharah-teks": {
    judul: "Doa Istikharah (Setelah 2 Rakaat)",
    pengantar: "Untuk meminta pilihan terbaik dari Allah dalam keputusan penting. (HR. Bukhari)",
    items: [
      {
        title: "Doa Istikharah",
        arab: "اللَّهُمَّ إِنِّي أَسْتَخِيرُكَ بِعِلْمِكَ، وَأَسْتَقْدِرُكَ بِقُدْرَتِكَ، وَأَسْأَلُكَ مِنْ فَضْلِكَ الْعَظِيمِ، فَإِنَّكَ تَقْدِرُ وَلَا أَقْدِرُ، وَتَعْلَمُ وَلَا أَعْلَمُ، وَأَنْتَ عَلَّامُ الْغُيُوبِ. اللَّهُمَّ إِنْ كُنْتَ تَعْلَمُ أَنَّ هَذَا الْأَمْرَ خَيْرٌ لِي فِي دِينِي وَمَعَاشِي وَعَاقِبَةِ أَمْرِي، فَاقْدُرْهُ لِي وَيَسِّرْهُ لِي ثُمَّ بَارِكْ لِي فِيهِ. وَإِنْ كُنْتَ تَعْلَمُ أَنَّ هَذَا الْأَمْرَ شَرٌّ لِي فِي دِينِي وَمَعَاشِي وَعَاقِبَةِ أَمْرِي، فَاصْرِفْهُ عَنِّي وَاصْرِفْنِي عَنْهُ، وَاقْدُرْ لِيَ الْخَيْرَ حَيْثُ كَانَ ثُمَّ أَرْضِنِي بِهِ",
        latin: "Allāhumma innī astakhīruka bi-'ilmik, wa astaqdiruka bi-qudratik, wa as'aluka min faḍlikal-'aẓīm, fa innaka taqdiru wa lā aqdir, wa ta'lamu wa lā a'lam, wa anta 'allāmul-ghuyūb. Allāhumma in kunta ta'lamu anna hādzal-amra khairun lī fī dīnī wa ma'āsyī wa 'āqibati amrī, faqdurhu lī wa yassirhu lī tsumma bārik lī fīh. Wa in kunta ta'lamu anna hādzal-amra syarrun lī fī dīnī wa ma'āsyī wa 'āqibati amrī, faṣrifhu 'annī waṣrifnī 'anh, waqdur liyal-khaira ḥaitsu kāna tsumma arḍinī bih.",
        terjemahan: "Ya Allah, aku memohon pilihan-Mu dengan ilmu-Mu, dan memohon kemampuan dengan kekuasaan-Mu, serta aku memohon karunia-Mu yang besar. Sesungguhnya Engkau Mahakuasa sedang aku tidak; Engkau Maha Mengetahui sedang aku tidak; dan Engkau Maha Mengetahui yang gaib. Ya Allah, jika Engkau ketahui bahwa perkara ini (sebutkan) baik bagiku, agamaku, kehidupanku, dan akibat urusanku, maka takdirkanlah ia untukku, mudahkanlah, dan berkahilah untukku. Tetapi jika Engkau ketahui ia buruk bagiku..., maka palingkanlah ia dariku dan palingkan aku darinya, lalu takdirkan untukku yang terbaik di mana pun ia berada, kemudian buatlah aku ridha dengannya.",
      },
    ],
  },
  "doa-qunut-subuh": {
    judul: "Doa Qunut Subuh",
    pengantar: "Dibaca saat i'tidal rakaat kedua sholat Subuh. (HR. Tirmidzi — diajarkan kepada Hasan bin Ali)",
    items: [
      {
        title: "Doa Qunut",
        arab: "اللَّهُمَّ اهْدِنِي فِيمَنْ هَدَيْتَ، وَعَافِنِي فِيمَنْ عَافَيْتَ، وَتَوَلَّنِي فِيمَنْ تَوَلَّيْتَ، وَبَارِكْ لِي فِيمَا أَعْطَيْتَ، وَقِنِي شَرَّ مَا قَضَيْتَ، فَإِنَّكَ تَقْضِي وَلَا يُقْضَى عَلَيْكَ، وَإِنَّهُ لَا يَذِلُّ مَنْ وَالَيْتَ، وَلَا يَعِزُّ مَنْ عَادَيْتَ، تَبَارَكْتَ رَبَّنَا وَتَعَالَيْتَ، فَلَكَ الْحَمْدُ عَلَى مَا قَضَيْتَ، أَسْتَغْفِرُكَ وَأَتُوبُ إِلَيْكَ، وَصَلَّى اللَّهُ عَلَى سَيِّدِنَا مُحَمَّدٍ وَعَلَى آلِهِ وَصَحْبِهِ وَسَلَّمَ",
        latin: "Allāhummahdinī fīman hadait, wa 'āfinī fīman 'āfait, wa tawallanī fīman tawallait, wa bārik lī fīmā a'ṭait, wa qinī syarra mā qaḍait, fa innaka taqḍī wa lā yuqḍā 'alaik, wa innahū lā yadzillu man wālait, wa lā ya'izzu man 'ādait, tabārakta rabbanā wa ta'ālait, fa lakal-ḥamdu 'alā mā qaḍait, astaghfiruka wa atūbu ilaik, wa ṣallallāhu 'alā sayyidinā Muḥammadin wa 'alā ālihī wa ṣaḥbihī wa sallam.",
        terjemahan: "Ya Allah, berilah aku petunjuk seperti orang-orang yang Engkau beri petunjuk. Berilah aku kesehatan seperti orang-orang yang Engkau beri kesehatan. Lindungilah aku seperti orang-orang yang Engkau lindungi. Berkahilah apa yang Engkau berikan kepadaku. Lindungilah aku dari keburukan yang Engkau takdirkan, karena Engkau yang menetapkan dan tidak ada yang menetapkan atas-Mu. Tidak akan hina orang yang Engkau bela, dan tidak akan mulia orang yang Engkau musuhi. Mahasuci Engkau wahai Tuhan kami, Mahatinggi Engkau. Bagi-Mu segala puji atas apa yang telah Engkau takdirkan. Aku memohon ampun dan bertaubat kepada-Mu. Semoga shalawat dan salam atas Nabi Muhammad ﷺ, keluarga, dan sahabatnya.",
      },
    ],
  },

  // ═══════════════════════════════════════════
  // SITUASIONAL — TAMBAHAN
  // ═══════════════════════════════════════════
  "doa-sakit": {
    judul: "Doa Saat Sakit",
    pengantar: "Diajarkan Nabi — kecuali ajal sudah dekat, Allah akan menyembuhkan. (HR. Tirmidzi)",
    items: [
      {
        title: "Doa Saat Sakit (Dibaca 7×)",
        repeat: 7,
        arab: "أَسْأَلُ اللَّهَ الْعَظِيمَ رَبَّ الْعَرْشِ الْعَظِيمِ أَنْ يَشْفِيَكَ",
        latin: "As'alullāhal-'aẓīma rabbal-'arsyil-'aẓīmi an yasyfiyaka.",
        terjemahan: "Aku memohon kepada Allah Yang Maha Agung, Tuhan 'Arsy yang agung, agar menyembuhkanmu.",
      },
      {
        title: "Doa Meminta Kesembuhan Sendiri",
        arab: "اللَّهُمَّ رَبَّ النَّاسِ، أَذْهِبِ الْبَاسَ، اشْفِ أَنْتَ الشَّافِي، لَا شِفَاءَ إِلَّا شِفَاؤُكَ، شِفَاءً لَا يُغَادِرُ سَقَمًا",
        latin: "Allāhumma rabban-nās, adzhibil-ba's, isyfi antasy-syāfī, lā syifā'a illā syifā'uk, syifā'an lā yughādiru saqamā.",
        terjemahan: "Ya Allah, Tuhan manusia, hilangkanlah penyakit, sembuhkanlah, Engkau Yang Maha Menyembuhkan. Tidak ada kesembuhan kecuali kesembuhan dari-Mu, kesembuhan yang tidak menyisakan penyakit.",
      },
    ],
  },
  "doa-jenguk-sakit": {
    judul: "Doa Menjenguk Orang Sakit",
    pengantar: "Sunnah Nabi — 70 ribu malaikat mendoakan orang yang menjenguk. (HR. Tirmidzi)",
    items: [
      {
        title: "Doa Pendek (Dibaca 7×)",
        repeat: 7,
        arab: "لَا بَأْسَ طَهُورٌ إِنْ شَاءَ اللَّهُ",
        latin: "Lā ba'sa ṭahūrun in syā'allāh.",
        terjemahan: "Tidak mengapa, semoga (sakit ini) menjadi penghapus dosa, insya Allah.",
      },
    ],
  },
  "doa-musibah": {
    judul: "Doa Saat Tertimpa Musibah (Istirja')",
    pengantar: "Allah ganti dengan yang lebih baik bagi yang sabar mengucapkannya. (HR. Muslim)",
    items: [
      {
        title: "Istirja'",
        arab: "إِنَّا لِلَّهِ وَإِنَّا إِلَيْهِ رَاجِعُونَ، اللَّهُمَّ أْجُرْنِي فِي مُصِيبَتِي وَأَخْلِفْ لِي خَيْرًا مِنْهَا",
        latin: "Innā lillāhi wa innā ilaihi rāji'ūn. Allāhumma'jurnī fī muṣībatī wa akhlif lī khairan minhā.",
        terjemahan: "Sesungguhnya kami milik Allah dan hanya kepada-Nya kami kembali. Ya Allah, berilah aku pahala atas musibahku dan gantikanlah dengan yang lebih baik darinya.",
      },
    ],
  },
  "doa-marah": {
    judul: "Doa Saat Marah",
    pengantar: "Marah berasal dari setan — padamkan dengan ta'awudz. (HR. Bukhari)",
    items: [
      {
        title: "Ta'awudz",
        arab: "أَعُوذُ بِاللَّهِ مِنَ الشَّيْطَانِ الرَّجِيمِ",
        latin: "A'ūdzu billāhi minasy-syaiṭānir-rajīm.",
        terjemahan: "Aku berlindung kepada Allah dari setan yang terkutuk.",
        catatan: "Plus: duduk jika berdiri, atau berbaring jika duduk. Berwudhu juga membantu.",
      },
    ],
  },
  "doa-sedih": {
    judul: "Doa Hilangkan Kesedihan & Kegelisahan",
    pengantar: "Tidak ada yang membaca doa ini kecuali Allah akan menghilangkan kesedihannya. (HR. Ahmad)",
    items: [
      {
        title: "Doa Pelapang Hati",
        arab: "اللَّهُمَّ إِنِّي عَبْدُكَ، ابْنُ عَبْدِكَ، ابْنُ أَمَتِكَ، نَاصِيَتِي بِيَدِكَ، مَاضٍ فِيَّ حُكْمُكَ، عَدْلٌ فِيَّ قَضَاؤُكَ. أَسْأَلُكَ بِكُلِّ اسْمٍ هُوَ لَكَ، سَمَّيْتَ بِهِ نَفْسَكَ، أَوْ أَنْزَلْتَهُ فِي كِتَابِكَ، أَوْ عَلَّمْتَهُ أَحَدًا مِنْ خَلْقِكَ، أَوِ اسْتَأْثَرْتَ بِهِ فِي عِلْمِ الْغَيْبِ عِنْدَكَ؛ أَنْ تَجْعَلَ الْقُرْآنَ رَبِيعَ قَلْبِي، وَنُورَ صَدْرِي، وَجَلَاءَ حُزْنِي، وَذَهَابَ هَمِّي",
        latin: "Allāhumma innī 'abduka, ibnu 'abdika, ibnu amatika, nāṣiyatī biyadika, māḍin fiyya ḥukmuka, 'adlun fiyya qaḍā'uk. As'aluka bi-kullismin huwa laka, sammaita bihi nafsaka, au anzaltahū fī kitābika, au 'allamtahū aḥadan min khalqika, awista'tsarta bihī fī 'ilmil-ghaibi 'indak; an taj'alal-qur'āna rabī'a qalbī, wa nūra ṣadrī, wa jalā'a ḥuznī, wa dzahāba hammī.",
        terjemahan: "Ya Allah, aku adalah hamba-Mu, anak hamba-Mu (laki-laki), anak hamba-Mu (perempuan). Ubun-ubunku di tangan-Mu, berlaku padaku hukum-Mu, adil padaku ketetapan-Mu. Aku memohon kepada-Mu dengan setiap nama yang menjadi milik-Mu, yang Engkau namakan diri-Mu dengannya, atau Engkau turunkan dalam kitab-Mu, atau Engkau ajarkan kepada salah seorang makhluk-Mu, atau Engkau khususkan dalam ilmu gaib di sisi-Mu; agar Engkau jadikan Al-Qur'an penyejuk hatiku, cahaya dadaku, penghapus kesedihanku, dan penghilang kegelisahanku.",
      },
    ],
  },
  "doa-takut": {
    judul: "Doa Saat Takut",
    pengantar: "Doa Nabi Ibrahim AS saat dilemparkan ke api. (HR. Bukhari)",
    items: [
      {
        title: "Hasbunallah",
        arab: "حَسْبُنَا اللَّهُ وَنِعْمَ الْوَكِيلُ",
        latin: "Ḥasbunallāhu wa ni'mal-wakīl.",
        terjemahan: "Cukuplah Allah bagi kami, dan Dia sebaik-baik tempat berserah diri.",
        catatan: "QS. Ali Imran: 173. Diucapkan Nabi Ibrahim AS saat di tengah api yang akhirnya menjadi dingin atas izin Allah.",
      },
    ],
  },
  "doa-yunus-musibah": {
    judul: "Doa Nabi Yunus (Saat dalam Kesulitan)",
    pengantar: "Tidak ada seorang muslim yang berdoa dengan doa ini kecuali Allah mengabulkan. (HR. Tirmidzi)",
    items: [
      {
        title: "Doa Nabi Yunus AS",
        arab: "لَا إِلَهَ إِلَّا أَنْتَ سُبْحَانَكَ إِنِّي كُنْتُ مِنَ الظَّالِمِينَ",
        latin: "Lā ilāha illā anta subḥānaka innī kuntu minaẓ-ẓālimīn.",
        terjemahan: "Tidak ada tuhan selain Engkau, Mahasuci Engkau, sesungguhnya aku termasuk orang-orang yang zalim.",
        catatan: "QS. Al-Anbiya: 87. Diucapkan Nabi Yunus saat ditelan ikan paus.",
      },
    ],
  },
  "doa-hutang": {
    judul: "Doa Pelunas Hutang",
    pengantar: "Allah cukupi orang yang berdoa ini meski hutangnya sebesar gunung. (HR. Tirmidzi)",
    items: [
      {
        title: "Doa Hutang",
        arab: "اللَّهُمَّ اكْفِنِي بِحَلَالِكَ عَنْ حَرَامِكَ، وَأَغْنِنِي بِفَضْلِكَ عَمَّنْ سِوَاكَ",
        latin: "Allāhummakfinī bi-ḥalālika 'an ḥarāmika wa aghninī bi-faḍlika 'amman siwāk.",
        terjemahan: "Ya Allah, cukupkanlah aku dengan rezeki halal-Mu dari yang haram, dan kayakanlah aku dengan karunia-Mu dari (bergantung kepada) selain-Mu.",
      },
      {
        title: "Doa Tambahan",
        arab: "اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْهَمِّ وَالْحَزَنِ، وَالْعَجْزِ وَالْكَسَلِ، وَالْبُخْلِ وَالْجُبْنِ، وَضَلَعِ الدَّيْنِ وَغَلَبَةِ الرِّجَالِ",
        latin: "Allāhumma innī a'ūdzu bika minal-hammi wal-ḥazan, wal-'ajzi wal-kasal, wal-bukhli wal-jubn, wa ḍala'id-daini wa ghalabatir-rijāl.",
        terjemahan: "Ya Allah, aku berlindung kepada-Mu dari kegelisahan dan kesedihan, lemah dan malas, kikir dan penakut, beratnya hutang dan tekanan orang.",
      },
    ],
  },
  "doa-perlindungan-setan": {
    judul: "Doa Perlindungan dari Setan, Sihir, dan Bahaya",
    pengantar: "Tidak akan ada bahaya yang menimpa orang yang membacanya tiga kali. (HR. Muslim)",
    items: [
      {
        title: "Kalimat-kalimat Allah yang Sempurna (3×)",
        repeat: 3,
        arab: "أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ",
        latin: "A'ūdzu bi-kalimātillāhit-tāmmāti min syarri mā khalaq.",
        terjemahan: "Aku berlindung dengan kalimat-kalimat Allah yang sempurna dari kejahatan apa yang Dia ciptakan.",
      },
      {
        title: "Bismillah Lengkap (3×)",
        repeat: 3,
        arab: "بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ",
        latin: "Bismillāhilladzī lā yaḍurru ma'asmihī syai'un fil-arḍi wa lā fis-samā'i wa huwas-samī'ul-'alīm.",
        terjemahan: "Dengan nama Allah, yang dengan nama-Nya tiada sesuatu pun di bumi dan di langit yang dapat memberikan mudarat, dan Dia Maha Mendengar lagi Maha Mengetahui.",
      },
    ],
  },
  "doa-tetap-iman": {
    judul: "Doa Tetap Istiqomah dalam Iman",
    pengantar: "Doa yang paling sering dibaca Rasulullah ﷺ. (HR. Tirmidzi — dishahihkan)",
    items: [
      {
        title: "Yā Muqallibal Qulūb",
        arab: "يَا مُقَلِّبَ الْقُلُوبِ ثَبِّتْ قَلْبِي عَلَى دِينِكَ",
        latin: "Yā Muqallibal-qulūbi tsabbit qalbī 'alā dīnik.",
        terjemahan: "Wahai Yang Membolak-balikkan hati, teguhkanlah hatiku di atas agama-Mu.",
      },
    ],
  },
  "doa-stress": {
    judul: "Doa Saat Stress & Cemas",
    pengantar: "Doa Nabi Muhammad ﷺ saat menghadapi kesulitan besar. (HR. Bukhari)",
    items: [
      {
        title: "Doa Saat Stres",
        arab: "لَا إِلَهَ إِلَّا اللَّهُ الْعَظِيمُ الْحَلِيمُ، لَا إِلَهَ إِلَّا اللَّهُ رَبُّ الْعَرْشِ الْعَظِيمِ، لَا إِلَهَ إِلَّا اللَّهُ رَبُّ السَّمَاوَاتِ وَرَبُّ الْأَرْضِ وَرَبُّ الْعَرْشِ الْكَرِيمِ",
        latin: "Lā ilāha illallāhul-'aẓīmul-ḥalīm, lā ilāha illallāhu rabbul-'arsyil-'aẓīm, lā ilāha illallāhu rabbus-samāwāti wa rabbul-arḍi wa rabbul-'arsyil-karīm.",
        terjemahan: "Tidak ada tuhan selain Allah Yang Mahaagung lagi Mahalembut. Tidak ada tuhan selain Allah, Tuhan 'Arsy yang agung. Tidak ada tuhan selain Allah, Tuhan langit, Tuhan bumi, dan Tuhan 'Arsy yang mulia.",
      },
    ],
  },
  "doa-ujian": {
    judul: "Doa Sebelum Ujian / Wawancara",
    pengantar: "Tidak ada kemudahan kecuali yang Engkau jadikan mudah. (HR. Ibnu Hibban)",
    items: [
      {
        title: "Doa Kemudahan",
        arab: "اللَّهُمَّ لَا سَهْلَ إِلَّا مَا جَعَلْتَهُ سَهْلًا، وَأَنْتَ تَجْعَلُ الْحَزْنَ إِذَا شِئْتَ سَهْلًا",
        latin: "Allāhumma lā sahla illā mā ja'altahu sahlā, wa anta taj'alul-ḥazna idzā syi'ta sahlā.",
        terjemahan: "Ya Allah, tidak ada yang mudah kecuali apa yang Engkau jadikan mudah. Dan Engkau-lah yang menjadikan kesulitan menjadi mudah jika Engkau kehendaki.",
      },
      {
        title: "Doa Nabi Musa AS (Lapang Dada)",
        arab: "رَبِّ اشْرَحْ لِي صَدْرِي وَيَسِّرْ لِي أَمْرِي وَاحْلُلْ عُقْدَةً مِنْ لِسَانِي يَفْقَهُوا قَوْلِي",
        latin: "Rabbisyraḥ lī ṣadrī wa yassir lī amrī waḥlul 'uqdatan min lisānī yafqahū qaulī.",
        terjemahan: "Ya Tuhanku, lapangkanlah dadaku, mudahkanlah urusanku, dan lepaskanlah simpul dari lidahku, agar mereka mengerti perkataanku. (QS. Taha: 25-28)",
      },
    ],
  },
  "doa-akhir-baik": {
    judul: "Doa Husnul Khotimah",
    pengantar: "Doa memohon akhir hidup yang baik — dalam keimanan dan ketaatan.",
    items: [
      {
        title: "Doa Husnul Khotimah",
        arab: "اللَّهُمَّ اخْتِمْ لَنَا بِحُسْنِ الْخَاتِمَةِ، وَلَا تَخْتِمْ عَلَيْنَا بِسُوءِ الْخَاتِمَةِ",
        latin: "Allāhummakhtim lanā bi-ḥusnil-khātimah, wa lā takhtim 'alainā bi-sū'il-khātimah.",
        terjemahan: "Ya Allah, akhirilah hidup kami dengan akhir yang baik, dan janganlah Engkau akhiri hidup kami dengan akhir yang buruk.",
      },
    ],
  },

  // ═══════════════════════════════════════════
  // KELUARGA — TAMBAHAN
  // ═══════════════════════════════════════════
  "doa-pasangan": {
    judul: "Doa untuk Pasangan & Keluarga",
    pengantar: "Doa Al-Qur'an memohon pasangan & keturunan yang menyejukkan mata.",
    items: [
      {
        title: "Doa Sakinah",
        arab: "رَبَّنَا هَبْ لَنَا مِنْ أَزْوَاجِنَا وَذُرِّيَّاتِنَا قُرَّةَ أَعْيُنٍ وَاجْعَلْنَا لِلْمُتَّقِينَ إِمَامًا",
        latin: "Rabbanā hab lanā min azwājinā wa dzurriyyātinā qurrata a'yun, waj'alnā lil-muttaqīna imāmā.",
        terjemahan: "Ya Tuhan kami, anugerahkanlah kepada kami pasangan dan keturunan kami sebagai penyejuk mata, dan jadikanlah kami sebagai imam bagi orang-orang bertakwa. (QS. Al-Furqan: 74)",
      },
    ],
  },
  "doa-bayi": {
    judul: "Doa Perlindungan Bayi (Tahnik)",
    pengantar: "Doa yang dibaca Nabi untuk cucunya Hasan dan Husain. (HR. Bukhari)",
    items: [
      {
        title: "Doa Perlindungan Anak",
        arab: "أُعِيذُكَ بِكَلِمَاتِ اللَّهِ التَّامَّةِ، مِنْ كُلِّ شَيْطَانٍ وَهَامَّةٍ، وَمِنْ كُلِّ عَيْنٍ لَامَّةٍ",
        latin: "U'īdzuka bi-kalimātillāhit-tāmmati, min kulli syaiṭānin wa hāmmatin, wa min kulli 'ainin lāmmah.",
        terjemahan: "Aku berlindungkanmu dengan kalimat-kalimat Allah yang sempurna, dari setiap setan dan hewan berbisa, dan dari setiap pandangan mata yang dengki.",
      },
    ],
  },
  "doa-pengantin": {
    judul: "Doa untuk Pengantin Baru",
    pengantar: "Doa yang diajarkan Nabi ﷺ untuk pengantin agar dipenuhi keberkahan. (HR. Tirmidzi)",
    items: [
      {
        title: "Doa Pengantin",
        arab: "بَارَكَ اللَّهُ لَكَ، وَبَارَكَ عَلَيْكَ، وَجَمَعَ بَيْنَكُمَا فِي خَيْرٍ",
        latin: "Bārakallāhu laka, wa bāraka 'alaika, wa jama'a bainakumā fī khair.",
        terjemahan: "Semoga Allah memberkahimu, melimpahkan keberkahan untukmu, dan mempertemukan kalian berdua dalam kebaikan.",
      },
    ],
  },
  "doa-ortu-meninggal": {
    judul: "Doa untuk Orang Tua yang Telah Meninggal",
    pengantar: "Doa Nabi ﷺ saat menyolatkan jenazah. (HR. Muslim)",
    items: [
      {
        title: "Doa Jenazah (Laki-laki)",
        arab: "اللَّهُمَّ اغْفِرْ لَهُ، وَارْحَمْهُ، وَعَافِهِ، وَاعْفُ عَنْهُ، وَأَكْرِمْ نُزُلَهُ، وَوَسِّعْ مُدْخَلَهُ، وَاغْسِلْهُ بِالْمَاءِ وَالثَّلْجِ وَالْبَرَدِ، وَنَقِّهِ مِنَ الْخَطَايَا كَمَا نَقَّيْتَ الثَّوْبَ الْأَبْيَضَ مِنَ الدَّنَسِ، وَأَبْدِلْهُ دَارًا خَيْرًا مِنْ دَارِهِ، وَأَهْلًا خَيْرًا مِنْ أَهْلِهِ، وَزَوْجًا خَيْرًا مِنْ زَوْجِهِ، وَأَدْخِلْهُ الْجَنَّةَ، وَأَعِذْهُ مِنْ عَذَابِ الْقَبْرِ وَعَذَابِ النَّارِ",
        latin: "Allāhummaghfir lahu, warḥamhu, wa 'āfihi, wa'fu 'anhu, wa akrim nuzulah, wa wassi' mudkhalah, waghsilhu bil-mā'i was-tsalji wal-barad, wa naqqihī minal-khaṭāyā kamā naqqaitats-tsaubal-abyaḍa minad-danas, wa abdilhu dāran khairan min dārih, wa ahlan khairan min ahlih, wa zaujan khairan min zaujih, wa adkhilhul-jannah, wa a'idzhu min 'adzābil-qabri wa 'adzābin-nār.",
        terjemahan: "Ya Allah, ampunilah dia, rahmatilah dia, sehatkanlah dia, dan maafkanlah dia. Muliakanlah tempatnya, luaskanlah kuburnya, mandikanlah dia dengan air, salju, dan embun. Bersihkanlah dia dari kesalahan sebagaimana pakaian putih dibersihkan dari kotoran. Gantilah rumahnya dengan rumah yang lebih baik, keluarganya dengan keluarga yang lebih baik, pasangannya dengan pasangan yang lebih baik. Masukkanlah dia ke surga dan jauhkan dari azab kubur dan azab neraka.",
        catatan: "Untuk perempuan, ganti dhamir (kata ganti) dari -hu menjadi -hā.",
      },
    ],
  },
  "doa-anak-sholeh": {
    judul: "Doa untuk Anak Sholeh",
    pengantar: "Doa Nabi Ibrahim AS untuk keturunannya. (QS. Ibrahim: 40-41)",
    items: [
      {
        title: "Doa Anak Sholeh",
        arab: "رَبِّ اجْعَلْنِي مُقِيمَ الصَّلَاةِ وَمِنْ ذُرِّيَّتِي، رَبَّنَا وَتَقَبَّلْ دُعَاءِ، رَبَّنَا اغْفِرْ لِي وَلِوَالِدَيَّ وَلِلْمُؤْمِنِينَ يَوْمَ يَقُومُ الْحِسَابُ",
        latin: "Rabbij'alnī muqīmaṣ-ṣalāti wa min dzurriyyatī, rabbanā wa taqabbal du'ā'. Rabbanaghfir lī wa li-wālidayya wa lil-mu'minīna yauma yaqūmul-ḥisāb.",
        terjemahan: "Ya Tuhanku, jadikanlah aku dan anak cucuku orang yang tetap mendirikan shalat. Ya Tuhan kami, perkenankanlah doaku. Ya Tuhan kami, ampunilah aku, kedua orang tuaku, dan seluruh orang-orang mukmin pada hari diadakan perhitungan.",
      },
    ],
  },

  // ═══════════════════════════════════════════
  // DOA PARA NABI
  // ═══════════════════════════════════════════
  "doa-nabi-adam": {
    judul: "Doa Nabi Adam AS",
    pengantar: "Taubat pertama umat manusia setelah memakan buah khuldi. (QS. Al-A'raf: 23)",
    items: [
      {
        title: "Doa Taubat Adam AS",
        arab: "رَبَّنَا ظَلَمْنَا أَنْفُسَنَا وَإِنْ لَمْ تَغْفِرْ لَنَا وَتَرْحَمْنَا لَنَكُونَنَّ مِنَ الْخَاسِرِينَ",
        latin: "Rabbanā ẓalamnā anfusanā wa illam taghfir lanā wa tarḥamnā lanakūnanna minal-khāsirīn.",
        terjemahan: "Ya Tuhan kami, kami telah menzalimi diri kami sendiri. Jika Engkau tidak mengampuni dan merahmati kami, niscaya kami termasuk orang-orang yang merugi.",
      },
    ],
  },
  "doa-nabi-nuh": {
    judul: "Doa Nabi Nuh AS",
    pengantar: "Doa memohon ampun untuk diri, kedua orang tua, dan seluruh kaum mukmin. (QS. Nuh: 28)",
    items: [
      {
        title: "Doa Ampunan Lengkap",
        arab: "رَبِّ اغْفِرْ لِي وَلِوَالِدَيَّ وَلِمَنْ دَخَلَ بَيْتِيَ مُؤْمِنًا وَلِلْمُؤْمِنِينَ وَالْمُؤْمِنَاتِ، وَلَا تَزِدِ الظَّالِمِينَ إِلَّا تَبَارًا",
        latin: "Rabbighfir lī wa liwālidayya wa liman dakhala baitiya mu'minan wa lil-mu'minīna wal-mu'mināt, wa lā tazidiẓ-ẓālimīna illā tabārā.",
        terjemahan: "Ya Tuhanku, ampunilah aku, kedua orang tuaku, dan siapa yang masuk ke rumahku dengan beriman, juga seluruh orang mukmin laki-laki dan perempuan. Dan janganlah Engkau tambahkan kepada orang-orang zalim selain kebinasaan.",
      },
    ],
  },
  "doa-nabi-ibrahim": {
    judul: "Doa Nabi Ibrahim AS",
    pengantar: "Doa pendiri Ka'bah memohon keturunan yang taat. (QS. Ibrahim: 35-41)",
    items: [
      {
        title: "Doa Keturunan Sholeh",
        arab: "رَبِّ اجْعَلْنِي مُقِيمَ الصَّلَاةِ وَمِنْ ذُرِّيَّتِي، رَبَّنَا وَتَقَبَّلْ دُعَاءِ",
        latin: "Rabbij'alnī muqīmaṣ-ṣalāti wa min dzurriyyatī, rabbanā wa taqabbal du'ā'.",
        terjemahan: "Ya Tuhanku, jadikanlah aku dan anak cucuku orang yang tetap mendirikan shalat. Ya Tuhan kami, perkenankanlah doaku.",
      },
      {
        title: "Doa Negeri Aman",
        arab: "رَبِّ اجْعَلْ هَذَا بَلَدًا آمِنًا وَارْزُقْ أَهْلَهُ مِنَ الثَّمَرَاتِ مَنْ آمَنَ مِنْهُمْ بِاللَّهِ وَالْيَوْمِ الْآخِرِ",
        latin: "Rabbij'al hādzā baladan āminan warzuq ahlahū minats-tsamarāti man āmana minhum billāhi wal-yaumil-ākhir.",
        terjemahan: "Ya Tuhanku, jadikanlah ini negeri yang aman, dan berilah rezeki dari buah-buahan kepada penduduknya yang beriman kepada Allah dan hari akhir. (QS. Al-Baqarah: 126)",
      },
    ],
  },
  "doa-nabi-yusuf": {
    judul: "Doa Nabi Yusuf AS",
    pengantar: "Doa Husnul Khotimah saat berkuasa di Mesir. (QS. Yusuf: 101)",
    items: [
      {
        title: "Wafat dalam Islam",
        arab: "رَبِّ قَدْ آتَيْتَنِي مِنَ الْمُلْكِ وَعَلَّمْتَنِي مِنْ تَأْوِيلِ الْأَحَادِيثِ، فَاطِرَ السَّمَاوَاتِ وَالْأَرْضِ، أَنْتَ وَلِيِّي فِي الدُّنْيَا وَالْآخِرَةِ، تَوَفَّنِي مُسْلِمًا وَأَلْحِقْنِي بِالصَّالِحِينَ",
        latin: "Rabbi qad ātaitanī minal-mulki wa 'allamtanī min ta'wīlil-aḥādīts, fāṭiras-samāwāti wal-arḍi, anta waliyyī fid-dunyā wal-ākhirah, tawaffanī musliman wa alḥiqnī biṣ-ṣāliḥīn.",
        terjemahan: "Ya Tuhanku, Engkau telah menganugerahkan kepadaku sebagian kekuasaan dan telah mengajarkan kepadaku sebagian takwil mimpi. Wahai Pencipta langit dan bumi, Engkau-lah Pelindungku di dunia dan di akhirat, wafatkanlah aku dalam keadaan muslim, dan gabungkanlah aku dengan orang-orang sholeh.",
      },
    ],
  },
  "doa-nabi-musa": {
    judul: "Doa Nabi Musa AS",
    pengantar: "Doa memohon dilapangkan dada saat menghadapi Fir'aun. (QS. Taha: 25-28)",
    items: [
      {
        title: "Lapang Dada & Mudah Urusan",
        arab: "رَبِّ اشْرَحْ لِي صَدْرِي، وَيَسِّرْ لِي أَمْرِي، وَاحْلُلْ عُقْدَةً مِنْ لِسَانِي يَفْقَهُوا قَوْلِي",
        latin: "Rabbisyraḥ lī ṣadrī, wa yassir lī amrī, waḥlul 'uqdatan min lisānī yafqahū qaulī.",
        terjemahan: "Ya Tuhanku, lapangkanlah dadaku, mudahkanlah urusanku, dan lepaskanlah simpul dari lidahku, agar mereka mengerti perkataanku.",
      },
      {
        title: "Doa Mohon Rezeki",
        arab: "رَبِّ إِنِّي لِمَا أَنْزَلْتَ إِلَيَّ مِنْ خَيْرٍ فَقِيرٌ",
        latin: "Rabbi innī limā anzalta ilayya min khairin faqīr.",
        terjemahan: "Ya Tuhanku, sesungguhnya aku sangat memerlukan kebaikan yang Engkau turunkan kepadaku. (QS. Al-Qashash: 24)",
      },
    ],
  },
  "doa-nabi-sulaiman": {
    judul: "Doa Nabi Sulaiman AS",
    pengantar: "Doa syukur saat raja semut diturunkan. (QS. An-Naml: 19)",
    items: [
      {
        title: "Doa Syukur Nikmat",
        arab: "رَبِّ أَوْزِعْنِي أَنْ أَشْكُرَ نِعْمَتَكَ الَّتِي أَنْعَمْتَ عَلَيَّ وَعَلَى وَالِدَيَّ وَأَنْ أَعْمَلَ صَالِحًا تَرْضَاهُ وَأَدْخِلْنِي بِرَحْمَتِكَ فِي عِبَادِكَ الصَّالِحِينَ",
        latin: "Rabbi auzi'nī an asykura ni'matakallatī an'amta 'alayya wa 'alā wālidayya wa an a'mala ṣāliḥan tarḍāhu wa adkhilnī bi-raḥmatika fī 'ibādikaṣ-ṣāliḥīn.",
        terjemahan: "Ya Tuhanku, anugerahkanlah kepadaku ilham untuk mensyukuri nikmat-Mu yang telah Engkau anugerahkan kepadaku dan kepada kedua orang tuaku, agar aku dapat beramal saleh yang Engkau ridhai, dan masukkanlah aku dengan rahmat-Mu ke dalam golongan hamba-hamba-Mu yang sholeh.",
      },
    ],
  },
  "doa-nabi-ayyub": {
    judul: "Doa Nabi Ayyub AS",
    pengantar: "Doa saat sakit lama — Allah pun menyembuhkannya. (QS. Al-Anbiya: 83)",
    items: [
      {
        title: "Doa Sakit Berkepanjangan",
        arab: "أَنِّي مَسَّنِيَ الضُّرُّ وَأَنْتَ أَرْحَمُ الرَّاحِمِينَ",
        latin: "Annī massaniyaḍ-ḍurru wa anta arḥamur-rāḥimīn.",
        terjemahan: "(Ya Tuhanku) sesungguhnya aku telah ditimpa penyakit, sedangkan Engkau adalah Yang Maha Penyayang di antara semua penyayang.",
      },
    ],
  },
  "doa-nabi-zakaria": {
    judul: "Doa Nabi Zakaria AS",
    pengantar: "Doa memohon keturunan di usia tua, dikabulkan dengan kelahiran Yahya. (QS. Ali Imran: 38)",
    items: [
      {
        title: "Mohon Keturunan",
        arab: "رَبِّ هَبْ لِي مِنْ لَدُنْكَ ذُرِّيَّةً طَيِّبَةً إِنَّكَ سَمِيعُ الدُّعَاءِ",
        latin: "Rabbi hab lī min ladunka dzurriyyatan ṭayyibah innaka samī'ud-du'ā'.",
        terjemahan: "Ya Tuhanku, anugerahkanlah kepadaku keturunan yang baik dari sisi-Mu. Sesungguhnya Engkau Maha Mendengar doa.",
      },
    ],
  },
  "doa-nabi-muhammad": {
    judul: "Doa Nabi Muhammad ﷺ — Padat Lengkap",
    pengantar: "Doa singkat yang mencakup empat kebutuhan terbesar manusia. (HR. Muslim)",
    items: [
      {
        title: "Hidayah, Takwa, Kesucian, Kekayaan Hati",
        arab: "اللَّهُمَّ إِنِّي أَسْأَلُكَ الْهُدَى وَالتُّقَى وَالْعَفَافَ وَالْغِنَى",
        latin: "Allāhumma innī as'aluka al-hudā wat-tuqā wal-'afāfa wal-ghinā.",
        terjemahan: "Ya Allah, aku memohon kepada-Mu petunjuk, ketakwaan, kesucian (dari yang haram), dan kecukupan (hati).",
      },
    ],
  },

  // ═══════════════════════════════════════════
  // SHOLAT KHUSUS
  // ═══════════════════════════════════════════
  "sholat-tarawih": {
    judul: "Sholat Tarawih",
    pengantar: "Sunnah muakkadah di malam Ramadhan. Umumnya 8 atau 20 rakaat + 3 witir.",
    items: [
      {
        title: "Niat Sholat Tarawih (2 Rakaat)",
        arab: "أُصَلِّي سُنَّةَ التَّرَاوِيحِ رَكْعَتَيْنِ مَأْمُومًا لِلَّهِ تَعَالَى",
        latin: "Uṣallī sunnatat-tarāwīḥi rak'ataini ma'mūman lillāhi ta'ālā.",
        terjemahan: "Aku berniat sholat sunnah tarawih dua rakaat sebagai makmum karena Allah Ta'ala.",
        catatan: "Jika sendiri (munfarid), ganti \"ma'mūman\" dengan \"adā'an\". Jika jadi imam, ganti dengan \"imāman\".",
      },
      {
        title: "Doa Antar Tarawih (Bilal)",
        arab: "اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ، اللَّهُمَّ صَلِّ عَلَيْهِ وَسَلِّمْ",
        latin: "Allāhumma ṣalli 'alā Muḥammad, Allāhumma ṣalli 'alaihi wa sallim.",
        terjemahan: "Ya Allah, limpahkanlah shalawat kepada Nabi Muhammad. Ya Allah, limpahkanlah shalawat dan salam kepadanya.",
        catatan: "Tradisi Indonesia: bilal mengingatkan setelah 2 rakaat, jamaah menjawab dengan sholawat.",
      },
    ],
  },
  "sholat-hajat": {
    judul: "Sholat Hajat",
    pengantar: "Sholat 2 rakaat saat punya keperluan besar — sebelum berdoa kepada Allah.",
    items: [
      {
        title: "Niat Sholat Hajat",
        arab: "أُصَلِّي سُنَّةَ الْحَاجَةِ رَكْعَتَيْنِ لِلَّهِ تَعَالَى",
        latin: "Uṣallī sunnatal-ḥājati rak'ataini lillāhi ta'ālā.",
        terjemahan: "Aku berniat sholat sunnah hajat dua rakaat karena Allah Ta'ala.",
      },
      {
        title: "Doa Setelah Sholat Hajat",
        arab: "لَا إِلَهَ إِلَّا اللَّهُ الْحَلِيمُ الْكَرِيمُ، سُبْحَانَ اللَّهِ رَبِّ الْعَرْشِ الْعَظِيمِ، الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ. أَسْأَلُكَ مُوجِبَاتِ رَحْمَتِكَ، وَعَزَائِمَ مَغْفِرَتِكَ، وَالْغَنِيمَةَ مِنْ كُلِّ بِرٍّ، وَالسَّلَامَةَ مِنْ كُلِّ إِثْمٍ، لَا تَدَعْ لِي ذَنْبًا إِلَّا غَفَرْتَهُ، وَلَا هَمًّا إِلَّا فَرَّجْتَهُ، وَلَا حَاجَةً هِيَ لَكَ رِضًا إِلَّا قَضَيْتَهَا، يَا أَرْحَمَ الرَّاحِمِينَ",
        latin: "Lā ilāha illallāhul-ḥalīmul-karīm, subḥānallāhi rabbil-'arsyil-'aẓīm, alḥamdulillāhi rabbil-'ālamīn. As'aluka mūjibāti raḥmatik, wa 'azā'ima maghfiratik, wal-ghanīmata min kulli birr, was-salāmata min kulli itsm, lā tada' lī dzanban illā ghafartah, wa lā hamman illā farrajtah, wa lā ḥājatan hiya laka riḍan illā qaḍaitahā, yā arḥamar-rāḥimīn.",
        terjemahan: "Tidak ada tuhan selain Allah Yang Maha Penyantun, Maha Mulia. Maha Suci Allah Tuhan 'Arsy yang agung. Segala puji bagi Allah Tuhan semesta alam. Aku memohon hal-hal yang mendatangkan rahmat-Mu, sebab-sebab keampunan-Mu, kemenangan dari segala kebaikan, keselamatan dari segala dosa. Janganlah Engkau biarkan satu dosa kecuali Engkau ampuni, satu kesusahan kecuali Engkau berikan jalan keluar, dan satu hajat yang Engkau ridhai kecuali Engkau kabulkan. Wahai Maha Penyayang dari yang menyayangi.",
        catatan: "Lalu sebutkan hajat/keperluan dengan rinci.",
      },
    ],
  },
  "sholat-istikharah": {
    judul: "Sholat Istikharah",
    pengantar: "Dilakukan saat menghadapi pilihan penting (jodoh, pekerjaan, dll). Bukan untuk hal wajib/sudah jelas hukumnya.",
    items: [
      {
        title: "Niat Sholat Istikharah",
        arab: "أُصَلِّي سُنَّةَ الْاِسْتِخَارَةِ رَكْعَتَيْنِ لِلَّهِ تَعَالَى",
        latin: "Uṣallī sunnatal-istikhārati rak'ataini lillāhi ta'ālā.",
        terjemahan: "Aku berniat sholat sunnah istikharah dua rakaat karena Allah Ta'ala.",
      },
      {
        title: "Doa Istikharah",
        arab: "اللَّهُمَّ إِنِّي أَسْتَخِيرُكَ بِعِلْمِكَ، وَأَسْتَقْدِرُكَ بِقُدْرَتِكَ، وَأَسْأَلُكَ مِنْ فَضْلِكَ الْعَظِيمِ، فَإِنَّكَ تَقْدِرُ وَلَا أَقْدِرُ، وَتَعْلَمُ وَلَا أَعْلَمُ، وَأَنْتَ عَلَّامُ الْغُيُوبِ. اللَّهُمَّ إِنْ كُنْتَ تَعْلَمُ أَنَّ هَذَا الْأَمْرَ خَيْرٌ لِي فِي دِينِي وَمَعَاشِي وَعَاقِبَةِ أَمْرِي فَاقْدُرْهُ لِي وَيَسِّرْهُ لِي ثُمَّ بَارِكْ لِي فِيهِ، وَإِنْ كُنْتَ تَعْلَمُ أَنَّ هَذَا الْأَمْرَ شَرٌّ لِي فِي دِينِي وَمَعَاشِي وَعَاقِبَةِ أَمْرِي فَاصْرِفْهُ عَنِّي وَاصْرِفْنِي عَنْهُ وَاقْدُرْ لِيَ الْخَيْرَ حَيْثُ كَانَ ثُمَّ أَرْضِنِي بِهِ",
        latin: "Allāhumma innī astakhīruka bi'ilmik, wa astaqdiruka biqudratik, wa as'aluka min faḍlikal-'aẓīm, fa innaka taqdiru wa lā aqdir, wa ta'lamu wa lā a'lam, wa anta 'allāmul-ghuyūb. Allāhumma in kunta ta'lamu anna hādzal-amra khairun lī fī dīnī wa ma'āsyī wa 'āqibati amrī faqdurhu lī wa yassirhu lī tsumma bārik lī fīh, wa in kunta ta'lamu anna hādzal-amra syarrun lī fī dīnī wa ma'āsyī wa 'āqibati amrī faṣrifhu 'annī waṣrifnī 'anhu waqdur liyal-khaira ḥaitsu kāna tsumma arḍinī bih.",
        terjemahan: "Ya Allah, sungguh aku memohon pilihan kepada-Mu dengan ilmu-Mu, memohon ketetapan kepada-Mu dengan kekuasaan-Mu, memohon kepada-Mu dari karunia-Mu yang agung. Engkau Maha Kuasa, aku tidak; Engkau Maha Tahu, aku tidak; Engkau Maha Mengetahui hal-hal gaib. Ya Allah, jika urusan ini Engkau ketahui baik bagiku dalam agama, kehidupan, dan akibatnya, takdirkanlah untukku, mudahkanlah, dan berkahilah. Jika Engkau ketahui buruk bagiku, palingkanlah dariku dan palingkan aku darinya, lalu takdirkanlah kebaikan di mana pun adanya, kemudian ridhakanlah aku dengannya.",
        catatan: "Saat menyebut \"hādzal-amra\" (urusan ini), niatkan dalam hati hajat/pilihan yang dimaksud.",
      },
    ],
  },
  "sholat-taubat": {
    judul: "Sholat Taubat",
    pengantar: "Dilakukan setelah berdosa — wudhu sempurna, sholat 2 rakaat, istighfar.",
    items: [
      {
        title: "Niat Sholat Taubat",
        arab: "أُصَلِّي سُنَّةَ التَّوْبَةِ رَكْعَتَيْنِ لِلَّهِ تَعَالَى",
        latin: "Uṣallī sunnatat-taubati rak'ataini lillāhi ta'ālā.",
        terjemahan: "Aku berniat sholat sunnah taubat dua rakaat karena Allah Ta'ala.",
      },
      {
        title: "Sayyidul Istighfar (Setelah Sholat)",
        arab: "اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلَّا أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ، وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ، أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ، أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ، وَأَبُوءُ بِذَنْبِي فَاغْفِرْ لِي، فَإِنَّهُ لَا يَغْفِرُ الذُّنُوبَ إِلَّا أَنْتَ",
        latin: "Allāhumma anta rabbī lā ilāha illā anta, khalaqtanī wa anā 'abduka, wa anā 'alā 'ahdika wa wa'dika mastaṭa'tu, a'ūdzu bika min syarri mā ṣana'tu, abū'u laka bini'matika 'alayya, wa abū'u bidzanbī faghfir lī, fa innahū lā yaghfirudz-dzunūba illā anta.",
        terjemahan: "Ya Allah, Engkau Tuhanku, tidak ada tuhan selain Engkau. Engkau menciptakanku, dan aku adalah hamba-Mu. Maka ampunilah aku, sebab tiada yang mampu mengampuni dosa selain Engkau. (HR. Bukhari)",
      },
    ],
  },
  "sholat-tasbih": {
    judul: "Sholat Tasbih",
    pengantar: "Diajarkan Nabi kepada paman beliau, Abbas RA. 4 rakaat, total 300 tasbih di dalamnya.",
    items: [
      {
        title: "Niat Sholat Tasbih (4 Rakaat)",
        arab: "أُصَلِّي سُنَّةَ التَّسْبِيحِ أَرْبَعَ رَكَعَاتٍ لِلَّهِ تَعَالَى",
        latin: "Uṣallī sunnatat-tasbīḥi arba'a raka'ātin lillāhi ta'ālā.",
        terjemahan: "Aku berniat sholat sunnah tasbih empat rakaat karena Allah Ta'ala.",
      },
      {
        title: "Bacaan Tasbih (75× Per Rakaat)",
        repeat: 75,
        arab: "سُبْحَانَ اللَّهِ وَالْحَمْدُ لِلَّهِ وَلَا إِلَهَ إِلَّا اللَّهُ وَاللَّهُ أَكْبَرُ",
        latin: "Subḥānallāh, walḥamdu lillāh, wa lā ilāha illallāh, wallāhu akbar.",
        terjemahan: "Maha Suci Allah, segala puji bagi Allah, tidak ada tuhan selain Allah, dan Allah Maha Besar.",
        catatan: "Tata cara: 15× setelah Al-Fatihah & surat, 10× ruku', 10× i'tidal, 10× sujud 1, 10× duduk antara 2 sujud, 10× sujud 2, 10× duduk sebelum bangkit. Total 75× × 4 rakaat = 300.",
      },
    ],
  },
  "sholat-jenazah": {
    judul: "Sholat Jenazah",
    pengantar: "Fardhu kifayah. 4 takbir, tanpa ruku' dan sujud. Pahala = sebesar gunung.",
    items: [
      {
        title: "Niat Sholat Jenazah Laki-laki",
        arab: "أُصَلِّي عَلَى هَذَا الْمَيِّتِ أَرْبَعَ تَكْبِيرَاتٍ فَرْضَ الْكِفَايَةِ مَأْمُومًا لِلَّهِ تَعَالَى",
        latin: "Uṣallī 'alā hādzal-mayyiti arba'a takbīrātin farḍal-kifāyati ma'mūman lillāhi ta'ālā.",
        terjemahan: "Aku berniat sholat atas jenazah ini dengan empat takbir, fardhu kifayah, sebagai makmum karena Allah Ta'ala.",
      },
      {
        title: "Takbir 1: Al-Fatihah",
        terjemahan: "Setelah takbir pertama, baca Al-Fatihah.",
      },
      {
        title: "Takbir 2: Sholawat Ibrahimiyah",
        arab: "اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ...",
        terjemahan: "Lihat Sholawat Ibrahimiyah lengkap di menu Sholawat.",
      },
      {
        title: "Takbir 3: Doa untuk Jenazah",
        arab: "اللَّهُمَّ اغْفِرْ لَهُ وَارْحَمْهُ وَعَافِهِ وَاعْفُ عَنْهُ، وَأَكْرِمْ نُزُلَهُ، وَوَسِّعْ مُدْخَلَهُ، وَاغْسِلْهُ بِالْمَاءِ وَالثَّلْجِ وَالْبَرَدِ، وَنَقِّهِ مِنَ الْخَطَايَا كَمَا يُنَقَّى الثَّوْبُ الْأَبْيَضُ مِنَ الدَّنَسِ",
        latin: "Allāhummaghfir lahu warḥamhu wa 'āfihi wa'fu 'anhu, wa akrim nuzulah, wa wassi' mudkhalah, waghsilhu bil-mā'i wats-tsalji wal-barad, wa naqqihī minal-khaṭāyā kamā yunaqqats-tsaubul-abyaḍu minad-danas.",
        terjemahan: "Ya Allah, ampunilah, sayangilah, sehatkanlah, dan maafkanlah dia. Muliakanlah tempatnya, lapangkanlah kuburnya. Mandikan ia dengan air, salju, dan air dingin. Bersihkan dari kesalahan sebagaimana pakaian putih dibersihkan dari kotoran.",
        catatan: "Untuk perempuan: ganti \"lahu\" menjadi \"lahā\", dst.",
      },
      {
        title: "Takbir 4: Doa Penutup",
        arab: "اللَّهُمَّ لَا تَحْرِمْنَا أَجْرَهُ وَلَا تَفْتِنَّا بَعْدَهُ، وَاغْفِرْ لَنَا وَلَهُ",
        latin: "Allāhumma lā taḥrimnā ajrahū wa lā taftinnā ba'dah, waghfir lanā wa lah.",
        terjemahan: "Ya Allah, janganlah Engkau halangi kami dari pahalanya, jangan timpakan fitnah kepada kami setelah kepergiannya, ampunilah kami dan dia.",
      },
      {
        title: "Salam",
        terjemahan: "Lalu salam ke kanan dan kiri.",
      },
    ],
  },
  "sholat-jumat": {
    judul: "Sholat Jumat",
    pengantar: "Wajib bagi laki-laki muslim yang baligh, berakal, merdeka, mukim, dan tidak udzur. Pengganti sholat Dzuhur di hari Jumat.",
    items: [
      {
        title: "Niat Sholat Jumat",
        arab: "أُصَلِّي فَرْضَ الْجُمْعَةِ رَكْعَتَيْنِ مَأْمُومًا مُسْتَقْبِلَ الْقِبْلَةِ أَدَاءً لِلَّهِ تَعَالَى",
        latin: "Uṣallī farḍal-jumu'ati rak'ataini ma'mūman mustaqbilal-qiblati adā'an lillāhi ta'ālā.",
        terjemahan: "Aku berniat sholat fardhu Jumat dua rakaat sebagai makmum menghadap kiblat, tunai karena Allah Ta'ala.",
      },
      {
        title: "Sunnah Hari Jumat",
        terjemahan: "Mandi (ghusl) Jumat • Pakai pakaian terbaik & wangi • Datang lebih awal • Membaca Surat Al-Kahfi • Memperbanyak sholawat • Berdoa di waktu mustajab (antara duduk khatib hingga sholat).",
      },
    ],
  },
  "sholat-idul-fitri": {
    judul: "Sholat Idul Fitri",
    pengantar: "Sunnah muakkadah di pagi 1 Syawal. 2 rakaat — rakaat 1: 7 takbir tambahan, rakaat 2: 5 takbir tambahan.",
    items: [
      {
        title: "Niat Sholat Idul Fitri",
        arab: "أُصَلِّي سُنَّةَ عِيدِ الْفِطْرِ رَكْعَتَيْنِ مَأْمُومًا لِلَّهِ تَعَالَى",
        latin: "Uṣallī sunnata 'īdil-fiṭri rak'ataini ma'mūman lillāhi ta'ālā.",
        terjemahan: "Aku berniat sholat sunnah Idul Fitri dua rakaat sebagai makmum karena Allah Ta'ala.",
      },
      {
        title: "Takbir Ied",
        arab: "اللَّهُ أَكْبَرُ اللَّهُ أَكْبَرُ اللَّهُ أَكْبَرُ، لَا إِلَهَ إِلَّا اللَّهُ وَاللَّهُ أَكْبَرُ، اللَّهُ أَكْبَرُ وَلِلَّهِ الْحَمْدُ",
        latin: "Allāhu akbar, Allāhu akbar, Allāhu akbar, lā ilāha illallāhu wallāhu akbar, Allāhu akbar wa lillāhil-ḥamd.",
        terjemahan: "Allah Maha Besar, Allah Maha Besar, Allah Maha Besar, tidak ada tuhan selain Allah, dan Allah Maha Besar. Allah Maha Besar dan segala puji bagi Allah.",
        catatan: "Dikumandangkan sejak malam Idul Fitri hingga imam naik mimbar.",
      },
    ],
  },
  "sholat-idul-adha": {
    judul: "Sholat Idul Adha",
    pengantar: "Sunnah muakkadah di pagi 10 Dzulhijjah. Tata cara sama dengan Idul Fitri.",
    items: [
      {
        title: "Niat Sholat Idul Adha",
        arab: "أُصَلِّي سُنَّةَ عِيدِ الْأَضْحَى رَكْعَتَيْنِ مَأْمُومًا لِلَّهِ تَعَالَى",
        latin: "Uṣallī sunnata 'īdil-aḍḥā rak'ataini ma'mūman lillāhi ta'ālā.",
        terjemahan: "Aku berniat sholat sunnah Idul Adha dua rakaat sebagai makmum karena Allah Ta'ala.",
      },
      {
        title: "Takbir Tasyriq",
        arab: "اللَّهُ أَكْبَرُ اللَّهُ أَكْبَرُ اللَّهُ أَكْبَرُ، لَا إِلَهَ إِلَّا اللَّهُ وَاللَّهُ أَكْبَرُ، اللَّهُ أَكْبَرُ وَلِلَّهِ الْحَمْدُ",
        latin: "Allāhu akbar, Allāhu akbar, Allāhu akbar, lā ilāha illallāhu wallāhu akbar, Allāhu akbar wa lillāhil-ḥamd.",
        terjemahan: "Allah Maha Besar, Allah Maha Besar, Allah Maha Besar, tidak ada tuhan selain Allah, dan Allah Maha Besar. Allah Maha Besar dan segala puji bagi Allah.",
        catatan: "Dikumandangkan ba'da sholat fardhu sejak Subuh 9 Dzulhijjah hingga Ashar 13 Dzulhijjah (hari tasyriq).",
      },
      {
        title: "Niat Qurban",
        arab: "اللَّهُمَّ هَذِهِ مِنْكَ وَإِلَيْكَ فَتَقَبَّلْ مِنِّي. بِسْمِ اللَّهِ، اللَّهُ أَكْبَرُ",
        latin: "Allāhumma hādzihī minka wa ilaika fataqabbal minnī. Bismillāh, Allāhu akbar.",
        terjemahan: "Ya Allah, ini dari-Mu dan untuk-Mu, maka terimalah dari kami. Dengan nama Allah, Allah Maha Besar.",
      },
    ],
  },

  // ═══════════════════════════════════════════
  // PUASA TAMBAHAN
  // ═══════════════════════════════════════════
  "puasa-ramadhan": {
    judul: "Puasa Ramadhan",
    pengantar: "Rukun Islam ke-4. Wajib bagi setiap muslim yang baligh & berakal.",
    items: [
      {
        title: "Niat Puasa Ramadhan",
        arab: "نَوَيْتُ صَوْمَ غَدٍ عَنْ أَدَاءِ فَرْضِ شَهْرِ رَمَضَانَ هَذِهِ السَّنَةِ لِلَّهِ تَعَالَى",
        latin: "Nawaitu ṣauma ghadin 'an adā'i farḍi syahri Ramaḍāna hādzihis-sanati lillāhi ta'ālā.",
        terjemahan: "Aku berniat puasa besok untuk menunaikan fardhu bulan Ramadhan tahun ini karena Allah Ta'ala.",
        catatan: "Wajib diniatkan sejak malam (sebelum fajar shadiq).",
      },
      {
        title: "Doa Sahur",
        arab: "اللَّهُمَّ بَارِكْ لَنَا فِيمَا رَزَقْتَنَا وَأَطْعِمْنَا خَيْرًا مِنْهُ، وَجَعَلْنَا مِنَ الصَّابِرِينَ",
        latin: "Allāhumma bārik lanā fīmā razaqtanā wa aṭ'imnā khairan minh, wa ja'alnā minaṣ-ṣābirīn.",
        terjemahan: "Ya Allah, berkahilah kami atas rezeki yang Engkau berikan, berilah kami makanan yang lebih baik darinya, dan jadikanlah kami termasuk orang-orang yang sabar.",
      },
      {
        title: "Doa Berbuka",
        arab: "ذَهَبَ الظَّمَأُ وَابْتَلَّتِ الْعُرُوقُ وَثَبَتَ الْأَجْرُ إِنْ شَاءَ اللَّهُ",
        latin: "Dzahabaẓ-ẓama'u wabtallatil-'urūqu wa tsabatal-ajru in syā'allāh.",
        terjemahan: "Telah hilang dahaga, urat-urat telah basah, dan pahala telah tetap, insya Allah.",
        catatan: "Doa berbuka yang paling shahih (HR. Abu Dawud).",
      },
      {
        title: "Niat Sholat Tarawih",
        terjemahan: "Lihat menu Sholat Tarawih.",
      },
    ],
  },
  "puasa-syawal": {
    judul: "Puasa Syawal — 6 Hari",
    pengantar: "Setelah Ramadhan + 6 hari Syawal = puasa setahun penuh. (HR. Muslim)",
    items: [
      {
        title: "Niat Puasa Syawal",
        arab: "نَوَيْتُ صَوْمَ غَدٍ عَنْ سِتَّةٍ مِنْ شَوَّالٍ سُنَّةً لِلَّهِ تَعَالَى",
        latin: "Nawaitu ṣauma ghadin 'an sittatin min Syawwālin sunnatan lillāhi ta'ālā.",
        terjemahan: "Aku berniat puasa besok 6 hari di bulan Syawal sebagai sunnah karena Allah Ta'ala.",
        catatan: "Dilakukan dari tanggal 2 Syawal — boleh berurutan atau terpisah dalam bulan Syawal.",
      },
    ],
  },
  "puasa-arafah": {
    judul: "Puasa Arafah",
    pengantar: "Tanggal 9 Dzulhijjah — menghapus dosa 2 tahun (setahun lalu & yang akan datang). (HR. Muslim)",
    items: [
      {
        title: "Niat Puasa Arafah",
        arab: "نَوَيْتُ صَوْمَ عَرَفَةَ سُنَّةً لِلَّهِ تَعَالَى",
        latin: "Nawaitu ṣauma 'Arafata sunnatan lillāhi ta'ālā.",
        terjemahan: "Aku berniat puasa Arafah sebagai sunnah karena Allah Ta'ala.",
        catatan: "Khusus untuk yang TIDAK sedang berhaji (yang berhaji tidak puasa).",
      },
      {
        title: "Doa Berbuka",
        arab: "اللَّهُمَّ لَكَ صُمْتُ وَبِكَ آمَنْتُ وَعَلَى رِزْقِكَ أَفْطَرْتُ بِرَحْمَتِكَ يَا أَرْحَمَ الرَّاحِمِينَ",
        latin: "Allāhumma laka ṣumtu wa bika āmantu wa 'alā rizqika afṭartu biraḥmatika yā arḥamar-rāḥimīn.",
        terjemahan: "Ya Allah, untuk-Mu aku berpuasa, kepada-Mu aku beriman, dengan rezeki-Mu aku berbuka. Dengan rahmat-Mu wahai Maha Penyayang.",
      },
    ],
  },
  "puasa-tasua": {
    judul: "Puasa Tasua — 9 Muharram",
    pengantar: "Dibarengkan dengan Asyura untuk membedakan dari Yahudi.",
    items: [
      {
        title: "Niat Puasa Tasua",
        arab: "نَوَيْتُ صَوْمَ تَاسُوعَاءَ سُنَّةً لِلَّهِ تَعَالَى",
        latin: "Nawaitu ṣauma tāsū'ā'a sunnatan lillāhi ta'ālā.",
        terjemahan: "Aku berniat puasa Tasua sebagai sunnah karena Allah Ta'ala.",
      },
    ],
  },
  "puasa-asyura": {
    judul: "Puasa Asyura — 10 Muharram",
    pengantar: "Menghapus dosa setahun yang lalu. (HR. Muslim)",
    items: [
      {
        title: "Niat Puasa Asyura",
        arab: "نَوَيْتُ صَوْمَ عَاشُورَاءَ سُنَّةً لِلَّهِ تَعَالَى",
        latin: "Nawaitu ṣauma 'āsyūrā'a sunnatan lillāhi ta'ālā.",
        terjemahan: "Aku berniat puasa Asyura sebagai sunnah karena Allah Ta'ala.",
      },
    ],
  },
  "puasa-daud": {
    judul: "Puasa Daud",
    pengantar: "Puasa selang-seling: sehari puasa, sehari tidak. Paling dicintai Allah. (HR. Bukhari)",
    items: [
      {
        title: "Niat Puasa Daud",
        arab: "نَوَيْتُ صَوْمَ دَاوُدَ سُنَّةً لِلَّهِ تَعَالَى",
        latin: "Nawaitu ṣauma Dāwūda sunnatan lillāhi ta'ālā.",
        terjemahan: "Aku berniat puasa Daud sebagai sunnah karena Allah Ta'ala.",
      },
    ],
  },
  "puasa-qadha": {
    judul: "Puasa Qadha Ramadhan",
    pengantar: "Mengganti puasa Ramadhan yang ditinggalkan karena uzur (sakit, safar, haid, dll).",
    items: [
      {
        title: "Niat Puasa Qadha",
        arab: "نَوَيْتُ صَوْمَ غَدٍ عَنْ قَضَاءِ فَرْضِ شَهْرِ رَمَضَانَ لِلَّهِ تَعَالَى",
        latin: "Nawaitu ṣauma ghadin 'an qaḍā'i farḍi syahri Ramaḍāna lillāhi ta'ālā.",
        terjemahan: "Aku berniat puasa besok untuk meng-qadha fardhu bulan Ramadhan karena Allah Ta'ala.",
        catatan: "Wajib diniatkan sejak malam. Lebih utama disegerakan sebelum Ramadhan berikutnya.",
      },
    ],
  },

  // ═══════════════════════════════════════════
  // DZIKIR TAMBAHAN
  // ═══════════════════════════════════════════
  "asmaul-husna": {
    judul: "Asmaul Husna — 99 Nama Allah",
    pengantar: "Siapa yang menghafalnya, akan masuk surga. (HR. Bukhari & Muslim)",
    items: [
      { title: "1. Ar-Rahman",   arab: "الرَّحْمَنُ",      latin: "Ar-Raḥmān",      terjemahan: "Yang Maha Pengasih" },
      { title: "2. Ar-Rahim",    arab: "الرَّحِيمُ",       latin: "Ar-Raḥīm",       terjemahan: "Yang Maha Penyayang" },
      { title: "3. Al-Malik",    arab: "الْمَلِكُ",        latin: "Al-Malik",       terjemahan: "Maha Merajai / Penguasa" },
      { title: "4. Al-Quddus",   arab: "الْقُدُّوسُ",      latin: "Al-Quddūs",      terjemahan: "Maha Suci" },
      { title: "5. As-Salam",    arab: "السَّلَامُ",       latin: "As-Salām",       terjemahan: "Maha Pemberi Kesejahteraan" },
      { title: "6. Al-Mu'min",   arab: "الْمُؤْمِنُ",      latin: "Al-Mu'min",      terjemahan: "Maha Memberi Keamanan" },
      { title: "7. Al-Muhaimin", arab: "الْمُهَيْمِنُ",    latin: "Al-Muhaimin",    terjemahan: "Maha Pemelihara" },
      { title: "8. Al-'Aziz",    arab: "الْعَزِيزُ",       latin: "Al-'Azīz",       terjemahan: "Maha Perkasa" },
      { title: "9. Al-Jabbar",   arab: "الْجَبَّارُ",      latin: "Al-Jabbār",      terjemahan: "Maha Kuasa" },
      { title: "10. Al-Mutakabbir", arab: "الْمُتَكَبِّرُ",latin: "Al-Mutakabbir",  terjemahan: "Maha Megah" },
      { title: "11. Al-Khaliq",  arab: "الْخَالِقُ",       latin: "Al-Khāliq",      terjemahan: "Maha Pencipta" },
      { title: "12. Al-Bari'",   arab: "الْبَارِئُ",       latin: "Al-Bāri'",       terjemahan: "Maha Mengadakan" },
      { title: "13. Al-Mushawwir", arab: "الْمُصَوِّرُ",   latin: "Al-Muṣawwir",    terjemahan: "Maha Pembentuk Rupa" },
      { title: "14. Al-Ghaffar", arab: "الْغَفَّارُ",      latin: "Al-Ghaffār",     terjemahan: "Maha Pengampun" },
      { title: "15. Al-Qahhar",  arab: "الْقَهَّارُ",      latin: "Al-Qahhār",      terjemahan: "Maha Memaksa" },
      { title: "16. Al-Wahhab",  arab: "الْوَهَّابُ",      latin: "Al-Wahhāb",      terjemahan: "Maha Pemberi Karunia" },
      { title: "17. Ar-Razzaq",  arab: "الرَّزَّاقُ",      latin: "Ar-Razzāq",      terjemahan: "Maha Pemberi Rezeki" },
      { title: "18. Al-Fattah",  arab: "الْفَتَّاحُ",      latin: "Al-Fattāḥ",      terjemahan: "Maha Pembuka Rahmat" },
      { title: "19. Al-'Alim",   arab: "الْعَلِيمُ",       latin: "Al-'Alīm",       terjemahan: "Maha Mengetahui" },
      { title: "20. Al-Qabidh",  arab: "الْقَابِضُ",       latin: "Al-Qābiḍ",       terjemahan: "Maha Menyempitkan" },
      { title: "21. Al-Basith",  arab: "الْبَاسِطُ",       latin: "Al-Bāsiṭ",       terjemahan: "Maha Melapangkan" },
      { title: "22. Al-Khafidh", arab: "الْخَافِضُ",       latin: "Al-Khāfiḍ",      terjemahan: "Maha Merendahkan" },
      { title: "23. Ar-Rafi'",   arab: "الرَّافِعُ",       latin: "Ar-Rāfi'",       terjemahan: "Maha Meninggikan" },
      { title: "24. Al-Mu'izz",  arab: "الْمُعِزُّ",       latin: "Al-Mu'izz",      terjemahan: "Maha Memuliakan" },
      { title: "25. Al-Mudzill", arab: "الْمُذِلُّ",       latin: "Al-Mudzill",     terjemahan: "Maha Menghinakan" },
      { title: "26. As-Sami'",   arab: "السَّمِيعُ",       latin: "As-Samī'",       terjemahan: "Maha Mendengar" },
      { title: "27. Al-Bashir",  arab: "الْبَصِيرُ",       latin: "Al-Baṣīr",       terjemahan: "Maha Melihat" },
      { title: "28. Al-Hakam",   arab: "الْحَكَمُ",        latin: "Al-Ḥakam",       terjemahan: "Maha Menetapkan" },
      { title: "29. Al-'Adl",    arab: "الْعَدْلُ",        latin: "Al-'Adl",        terjemahan: "Maha Adil" },
      { title: "30. Al-Lathif",  arab: "اللَّطِيفُ",       latin: "Al-Laṭīf",       terjemahan: "Maha Lembut" },
      { title: "31. Al-Khabir",  arab: "الْخَبِيرُ",       latin: "Al-Khabīr",      terjemahan: "Maha Mengenal" },
      { title: "32. Al-Halim",   arab: "الْحَلِيمُ",       latin: "Al-Ḥalīm",       terjemahan: "Maha Penyantun" },
      { title: "33. Al-'Azhim",  arab: "الْعَظِيمُ",       latin: "Al-'Aẓīm",       terjemahan: "Maha Agung" },
      { title: "34. Al-Ghafur",  arab: "الْغَفُورُ",       latin: "Al-Ghafūr",      terjemahan: "Maha Pengampun" },
      { title: "35. Asy-Syakur", arab: "الشَّكُورُ",       latin: "Asy-Syakūr",     terjemahan: "Maha Mensyukuri" },
      { title: "36. Al-'Aliy",   arab: "الْعَلِيُّ",       latin: "Al-'Aliyy",      terjemahan: "Maha Tinggi" },
      { title: "37. Al-Kabir",   arab: "الْكَبِيرُ",       latin: "Al-Kabīr",       terjemahan: "Maha Besar" },
      { title: "38. Al-Hafizh",  arab: "الْحَفِيظُ",       latin: "Al-Ḥafīẓ",       terjemahan: "Maha Memelihara" },
      { title: "39. Al-Muqit",   arab: "الْمُقِيتُ",       latin: "Al-Muqīt",       terjemahan: "Maha Pemberi Kecukupan" },
      { title: "40. Al-Hasib",   arab: "الْحَسِيبُ",       latin: "Al-Ḥasīb",       terjemahan: "Maha Membuat Perhitungan" },
      { title: "41. Al-Jalil",   arab: "الْجَلِيلُ",       latin: "Al-Jalīl",       terjemahan: "Maha Luhur" },
      { title: "42. Al-Karim",   arab: "الْكَرِيمُ",       latin: "Al-Karīm",       terjemahan: "Maha Pemurah" },
      { title: "43. Ar-Raqib",   arab: "الرَّقِيبُ",       latin: "Ar-Raqīb",       terjemahan: "Maha Mengawasi" },
      { title: "44. Al-Mujib",   arab: "الْمُجِيبُ",       latin: "Al-Mujīb",       terjemahan: "Maha Mengabulkan" },
      { title: "45. Al-Wasi'",   arab: "الْوَاسِعُ",       latin: "Al-Wāsi'",       terjemahan: "Maha Luas" },
      { title: "46. Al-Hakim",   arab: "الْحَكِيمُ",       latin: "Al-Ḥakīm",       terjemahan: "Maha Bijaksana" },
      { title: "47. Al-Wadud",   arab: "الْوَدُودُ",       latin: "Al-Wadūd",       terjemahan: "Maha Mengasihi" },
      { title: "48. Al-Majid",   arab: "الْمَجِيدُ",       latin: "Al-Majīd",       terjemahan: "Maha Mulia" },
      { title: "49. Al-Ba'its",  arab: "الْبَاعِثُ",       latin: "Al-Bā'its",      terjemahan: "Maha Membangkitkan" },
      { title: "50. Asy-Syahid", arab: "الشَّهِيدُ",       latin: "Asy-Syahīd",     terjemahan: "Maha Menyaksikan" },
      { title: "51. Al-Haqq",    arab: "الْحَقُّ",         latin: "Al-Ḥaqq",        terjemahan: "Maha Benar" },
      { title: "52. Al-Wakil",   arab: "الْوَكِيلُ",       latin: "Al-Wakīl",       terjemahan: "Maha Pemelihara" },
      { title: "53. Al-Qawiyy",  arab: "الْقَوِيُّ",       latin: "Al-Qawiyy",      terjemahan: "Maha Kuat" },
      { title: "54. Al-Matin",   arab: "الْمَتِينُ",       latin: "Al-Matīn",       terjemahan: "Maha Kokoh" },
      { title: "55. Al-Waliyy",  arab: "الْوَلِيُّ",       latin: "Al-Waliyy",      terjemahan: "Maha Melindungi" },
      { title: "56. Al-Hamid",   arab: "الْحَمِيدُ",       latin: "Al-Ḥamīd",       terjemahan: "Maha Terpuji" },
      { title: "57. Al-Muhshi",  arab: "الْمُحْصِي",       latin: "Al-Muḥṣī",       terjemahan: "Maha Mengkalkulasi" },
      { title: "58. Al-Mubdi'",  arab: "الْمُبْدِئُ",      latin: "Al-Mubdi'",      terjemahan: "Maha Memulai" },
      { title: "59. Al-Mu'id",   arab: "الْمُعِيدُ",       latin: "Al-Mu'īd",       terjemahan: "Maha Mengembalikan" },
      { title: "60. Al-Muhyi",   arab: "الْمُحْيِي",       latin: "Al-Muḥyī",       terjemahan: "Maha Menghidupkan" },
      { title: "61. Al-Mumit",   arab: "الْمُمِيتُ",       latin: "Al-Mumīt",       terjemahan: "Maha Mematikan" },
      { title: "62. Al-Hayy",    arab: "الْحَيُّ",         latin: "Al-Ḥayy",        terjemahan: "Maha Hidup" },
      { title: "63. Al-Qayyum",  arab: "الْقَيُّومُ",      latin: "Al-Qayyūm",      terjemahan: "Maha Berdiri Sendiri" },
      { title: "64. Al-Wajid",   arab: "الْوَاجِدُ",       latin: "Al-Wājid",       terjemahan: "Maha Penemu" },
      { title: "65. Al-Majid",   arab: "الْمَاجِدُ",       latin: "Al-Mājid",       terjemahan: "Maha Mulia" },
      { title: "66. Al-Wahid",   arab: "الْوَاحِدُ",       latin: "Al-Wāḥid",       terjemahan: "Maha Esa" },
      { title: "67. Al-Ahad",    arab: "الْأَحَدُ",        latin: "Al-Aḥad",        terjemahan: "Maha Tunggal" },
      { title: "68. Ash-Shamad", arab: "الصَّمَدُ",        latin: "Aṣ-Ṣamad",       terjemahan: "Maha Dibutuhkan / Tempat Bergantung" },
      { title: "69. Al-Qadir",   arab: "الْقَادِرُ",       latin: "Al-Qādir",       terjemahan: "Maha Menentukan" },
      { title: "70. Al-Muqtadir",arab: "الْمُقْتَدِرُ",    latin: "Al-Muqtadir",    terjemahan: "Maha Berkuasa" },
      { title: "71. Al-Muqaddim",arab: "الْمُقَدِّمُ",     latin: "Al-Muqaddim",    terjemahan: "Maha Mendahulukan" },
      { title: "72. Al-Mu'akhkhir", arab: "الْمُؤَخِّرُ", latin: "Al-Mu'akhkhir",  terjemahan: "Maha Mengakhirkan" },
      { title: "73. Al-Awwal",   arab: "الْأَوَّلُ",       latin: "Al-Awwal",       terjemahan: "Maha Awal" },
      { title: "74. Al-Akhir",   arab: "الْآخِرُ",         latin: "Al-Ākhir",       terjemahan: "Maha Akhir" },
      { title: "75. Azh-Zhahir", arab: "الظَّاهِرُ",       latin: "Aẓ-Ẓāhir",       terjemahan: "Maha Nyata" },
      { title: "76. Al-Bathin",  arab: "الْبَاطِنُ",       latin: "Al-Bāṭin",       terjemahan: "Maha Tersembunyi" },
      { title: "77. Al-Wali",    arab: "الْوَالِي",        latin: "Al-Wālī",        terjemahan: "Maha Memerintah" },
      { title: "78. Al-Muta'ali",arab: "الْمُتَعَالِي",    latin: "Al-Muta'ālī",    terjemahan: "Maha Tinggi" },
      { title: "79. Al-Barr",    arab: "الْبَرُّ",         latin: "Al-Barr",        terjemahan: "Maha Penderma" },
      { title: "80. At-Tawwab",  arab: "التَّوَّابُ",      latin: "At-Tawwāb",      terjemahan: "Maha Penerima Taubat" },
      { title: "81. Al-Muntaqim",arab: "الْمُنْتَقِمُ",    latin: "Al-Muntaqim",    terjemahan: "Maha Pemberi Balasan" },
      { title: "82. Al-'Afuww",  arab: "الْعَفُوُّ",       latin: "Al-'Afuww",      terjemahan: "Maha Pemaaf" },
      { title: "83. Ar-Ra'uf",   arab: "الرَّءُوفُ",       latin: "Ar-Ra'ūf",       terjemahan: "Maha Pengasih" },
      { title: "84. Malikul Mulk", arab: "مَالِكُ الْمُلْكِ",latin: "Mālikul-Mulk", terjemahan: "Maha Pemilik Kerajaan" },
      { title: "85. Dzul Jalali wal Ikram", arab: "ذُو الْجَلَالِ وَالْإِكْرَامِ", latin: "Dzul-Jalāli wal-Ikrām", terjemahan: "Maha Pemilik Keagungan & Kemuliaan" },
      { title: "86. Al-Muqsith", arab: "الْمُقْسِطُ",      latin: "Al-Muqsiṭ",      terjemahan: "Maha Adil" },
      { title: "87. Al-Jami'",   arab: "الْجَامِعُ",       latin: "Al-Jāmi'",       terjemahan: "Maha Mengumpulkan" },
      { title: "88. Al-Ghaniyy", arab: "الْغَنِيُّ",       latin: "Al-Ghaniyy",     terjemahan: "Maha Kaya" },
      { title: "89. Al-Mughni",  arab: "الْمُغْنِي",       latin: "Al-Mughnī",      terjemahan: "Maha Pemberi Kekayaan" },
      { title: "90. Al-Mani'",   arab: "الْمَانِعُ",       latin: "Al-Māni'",       terjemahan: "Maha Mencegah" },
      { title: "91. Adh-Dharr",  arab: "الضَّارُّ",        latin: "Aḍ-Ḍārr",        terjemahan: "Maha Penimpa Mudharat" },
      { title: "92. An-Nafi'",   arab: "النَّافِعُ",       latin: "An-Nāfi'",       terjemahan: "Maha Pemberi Manfaat" },
      { title: "93. An-Nur",     arab: "النُّورُ",         latin: "An-Nūr",         terjemahan: "Maha Bercahaya" },
      { title: "94. Al-Hadi",    arab: "الْهَادِي",        latin: "Al-Hādī",        terjemahan: "Maha Pemberi Petunjuk" },
      { title: "95. Al-Badi'",   arab: "الْبَدِيعُ",       latin: "Al-Badī'",       terjemahan: "Maha Pencipta Tiada Banding" },
      { title: "96. Al-Baqi",    arab: "الْبَاقِي",        latin: "Al-Bāqī",        terjemahan: "Maha Kekal" },
      { title: "97. Al-Warits",  arab: "الْوَارِثُ",       latin: "Al-Wārits",      terjemahan: "Maha Pewaris" },
      { title: "98. Ar-Rasyid",  arab: "الرَّشِيدُ",       latin: "Ar-Rasyīd",      terjemahan: "Maha Pandai" },
      { title: "99. Ash-Shabur", arab: "الصَّبُورُ",       latin: "Aṣ-Ṣabūr",       terjemahan: "Maha Penyabar" },
    ],
  },
  tahlil: {
    judul: "Tahlil & Yasin",
    pengantar: "Susunan tahlilan khas Indonesia — kirim doa untuk yang meninggal. Tradisi NU.",
    items: [
      {
        title: "1. Al-Fatihah (Hadhrah)",
        terjemahan: "Diawali dengan Al-Fatihah yang dihadiahkan untuk Nabi Muhammad ﷺ, para sahabat, keluarga, ulama, ahli kubur, dan arwah yang dimaksud.",
      },
      {
        title: "2. Surat Yasin",
        terjemahan: "Baca Surat Yasin lengkap (lihat menu Yasin di Al-Qur'an).",
      },
      {
        title: "3. Tasbih, Tahmid, Tahlil, Takbir",
        repeat: 33,
        arab: "سُبْحَانَ اللَّهِ، الْحَمْدُ لِلَّهِ، لَا إِلَهَ إِلَّا اللَّهُ، اللَّهُ أَكْبَرُ",
        latin: "Subḥānallāh, alḥamdulillāh, lā ilāha illallāh, Allāhu akbar.",
        terjemahan: "Maha Suci Allah, segala puji bagi Allah, tidak ada tuhan selain Allah, Allah Maha Besar.",
      },
      {
        title: "4. La Ilaha Illallah",
        repeat: 100,
        arab: "لَا إِلَهَ إِلَّا اللَّهُ",
        latin: "Lā ilāha illallāh.",
        terjemahan: "Tidak ada tuhan selain Allah.",
        catatan: "Inti tahlil — diulang 100× atau lebih.",
      },
      {
        title: "5. Penutup",
        arab: "مُحَمَّدٌ رَسُولُ اللَّهِ صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ",
        latin: "Muḥammadun rasūlullāhi ṣallallāhu 'alaihi wa sallam.",
        terjemahan: "Muhammad adalah utusan Allah, semoga shalawat dan salam tercurah kepadanya.",
      },
      {
        title: "6. Doa Penutup",
        terjemahan: "Doa untuk arwah yang dihadiahkan (lihat Doa Ziarah Kubur).",
      },
    ],
  },
  "khatmil-quran": {
    judul: "Doa Khatmil Qur'an",
    pengantar: "Dibaca saat menyelesaikan tilawah Al-Qur'an — momen mustajab.",
    items: [
      {
        arab: "اللَّهُمَّ ارْحَمْنِي بِالْقُرْآنِ، وَاجْعَلْهُ لِي إِمَامًا وَنُورًا وَهُدًى وَرَحْمَةً. اللَّهُمَّ ذَكِّرْنِي مِنْهُ مَا نَسِيتُ، وَعَلِّمْنِي مِنْهُ مَا جَهِلْتُ، وَارْزُقْنِي تِلَاوَتَهُ آنَاءَ اللَّيْلِ وَأَطْرَافَ النَّهَارِ، وَاجْعَلْهُ لِي حُجَّةً يَا رَبَّ الْعَالَمِينَ",
        latin: "Allāhummarḥamnī bil-Qur'ān, waj'alhu lī imāman wa nūran wa hudan wa raḥmah. Allāhumma dzakkirnī minhu mā nasītu, wa 'allimnī minhu mā jahiltu, warzuqnī tilāwatahū ānā'al-laili wa aṭrāfan-nahār, waj'alhu lī ḥujjatan yā rabbal-'ālamīn.",
        terjemahan: "Ya Allah, rahmatilah aku dengan Al-Qur'an, jadikan ia bagiku imam, cahaya, petunjuk, dan rahmat. Ya Allah, ingatkanlah aku dari apa yang aku lupa, ajarkan apa yang aku tidak tahu, anugerahi aku membacanya di malam hari dan sepanjang siang. Jadikan ia hujjah bagiku, wahai Tuhan semesta alam.",
      },
    ],
  },
  "qunut-nazilah": {
    judul: "Qunut Nazilah",
    pengantar: "Dibaca di rakaat terakhir setiap sholat fardhu saat umat tertimpa musibah besar.",
    items: [
      {
        arab: "اللَّهُمَّ اهْدِنَا فِيمَنْ هَدَيْتَ، وَعَافِنَا فِيمَنْ عَافَيْتَ، وَتَوَلَّنَا فِيمَنْ تَوَلَّيْتَ، وَبَارِكْ لَنَا فِيمَا أَعْطَيْتَ، وَقِنَا شَرَّ مَا قَضَيْتَ، فَإِنَّكَ تَقْضِي وَلَا يُقْضَى عَلَيْكَ. اللَّهُمَّ انْصُرْ إِخْوَانَنَا الْمُسْتَضْعَفِينَ فِي كُلِّ مَكَانٍ، اللَّهُمَّ ارْفَعِ الْبَلَاءَ وَالْغَلَاءَ وَالْوَبَاءَ وَالرِّبَا وَالزِّنَا وَالزَّلَازِلَ وَالْمِحَنَ وَسُوءَ الْفِتَنِ مَا ظَهَرَ مِنْهَا وَمَا بَطَنَ، عَنْ بَلَدِنَا هَذَا خَاصَّةً وَعَنْ سَائِرِ بِلَادِ الْمُسْلِمِينَ عَامَّةً، يَا رَبَّ الْعَالَمِينَ",
        latin: "Allāhummahdinā fīman hadait, wa 'āfinā fīman 'āfait, wa tawallanā fīman tawallait, wa bārik lanā fīmā a'ṭait, wa qinā syarra mā qaḍait, fa innaka taqḍī wa lā yuqḍā 'alaik. Allāhummanṣur ikhwānanal-mustaḍ'afīna fī kulli makān, Allāhummarfa'il-balā'a wal-ghalā'a wal-wabā'a war-ribā waz-zinā waz-zalāzila wal-miḥana wa sū'al-fitani mā ẓahara minhā wa mā baṭana, 'an baladinā hādzā khāṣṣatan wa 'an sā'iri bilādil-muslimīna 'āmmah, yā rabbal-'ālamīn.",
        terjemahan: "Ya Allah, berilah kami petunjuk... (qunut). Ya Allah, tolonglah saudara-saudara kami yang tertindas di seluruh dunia. Ya Allah, angkatlah bala, kemahalan, wabah, riba, zina, gempa, ujian, dan keburukan fitnah yang nampak maupun tersembunyi, dari negeri kami khususnya dan negeri kaum muslimin pada umumnya, wahai Tuhan semesta alam.",
        catatan: "Versi disesuaikan dengan situasi musibah saat itu.",
      },
    ],
  },
  "sholawat-nariyah": {
    judul: "Sholawat Nariyah",
    pengantar: "Diijazahkan Imam Tafrizi — populer di pesantren NU sebagai penolak bala. Sering dibaca 4444×.",
    items: [
      {
        arab: "اللَّهُمَّ صَلِّ صَلَاةً كَامِلَةً، وَسَلِّمْ سَلَامًا تَامًّا، عَلَى سَيِّدِنَا مُحَمَّدٍ، الَّذِي تَنْحَلُّ بِهِ الْعُقَدُ، وَتَنْفَرِجُ بِهِ الْكُرَبُ، وَتُقْضَى بِهِ الْحَوَائِجُ، وَتُنَالُ بِهِ الرَّغَائِبُ، وَحُسْنُ الْخَوَاتِيمِ، وَيُسْتَسْقَى الْغَمَامُ بِوَجْهِهِ الْكَرِيمِ، وَعَلَى آلِهِ وَصَحْبِهِ، فِي كُلِّ لَمْحَةٍ وَنَفَسٍ بِعَدَدِ كُلِّ مَعْلُومٍ لَكَ",
        latin: "Allāhumma ṣalli ṣalātan kāmilatan, wa sallim salāman tāmman, 'alā sayyidinā Muḥammad, alladzī tanḥallu bihil-'uqad, wa tanfariju bihil-kurab, wa tuqḍā bihil-ḥawā'ij, wa tunālu bihir-raghā'ib, wa ḥusnul-khawātīm, wa yustasqal-ghamāmu biwajhihil-karīm, wa 'alā ālihī wa ṣaḥbih, fī kulli lamḥatin wa nafasin bi'adadi kulli ma'lūmin lak.",
        terjemahan: "Ya Allah, limpahkanlah shalawat yang sempurna dan salam yang utuh kepada junjungan kami Muhammad, yang dengannya terurai segala simpul, terlepas segala kesusahan, terkabul segala hajat, tercapai segala harapan dan husnul khatimah, awan-pun mencurahkan hujan dengan berkah wajahnya yang mulia. Begitu pula kepada keluarga dan sahabatnya, di setiap kerlingan mata dan setiap tarikan nafas, sebanyak jumlah segala yang Engkau ketahui.",
      },
    ],
  },
  "sholawat-munjiyat": {
    judul: "Sholawat Munjiyat",
    pengantar: "Sholawat penyelamat — dari kesusahan, ketakutan, dan terkabulnya hajat.",
    items: [
      {
        arab: "اللَّهُمَّ صَلِّ عَلَى سَيِّدِنَا مُحَمَّدٍ صَلَاةً تُنْجِينَا بِهَا مِنْ جَمِيعِ الْأَهْوَالِ وَالْآفَاتِ، وَتَقْضِي لَنَا بِهَا جَمِيعَ الْحَاجَاتِ، وَتُطَهِّرُنَا بِهَا مِنْ جَمِيعِ السَّيِّئَاتِ، وَتَرْفَعُنَا بِهَا أَعْلَى الدَّرَجَاتِ، وَتُبَلِّغُنَا بِهَا أَقْصَى الْغَايَاتِ، مِنْ جَمِيعِ الْخَيْرَاتِ فِي الْحَيَاةِ وَبَعْدَ الْمَمَاتِ",
        latin: "Allāhumma ṣalli 'alā sayyidinā Muḥammad, ṣalātan tunjīnā bihā min jamī'il-ahwāli wal-āfāt, wa taqḍī lanā bihā jamī'al-ḥājāt, wa tuṭahhirunā bihā min jamī'is-sayyi'āt, wa tarfa'unā bihā a'lad-darajāt, wa tuballighunā bihā aqṣal-ghāyāt, min jamī'il-khairāti fil-ḥayāti wa ba'dal-mamāt.",
        terjemahan: "Ya Allah, limpahkan shalawat kepada junjungan kami Muhammad — shalawat yang dengannya Engkau menyelamatkan kami dari segala ketakutan dan musibah, mengabulkan segala hajat kami, membersihkan kami dari segala keburukan, mengangkat kami ke derajat tertinggi, dan menyampaikan kami pada cita-cita tertinggi dari segala kebaikan di kehidupan dan setelah kematian.",
      },
    ],
  },
  "sholawat-badar": {
    judul: "Sholawat Badar",
    pengantar: "Qoshidah karya KH. Ali Manshur Siddiq Sedan Rembang — populer di majelis sholawat NU.",
    items: [
      {
        title: "Bait Pembuka",
        arab: "صَلَاةُ اللَّهِ سَلَامُ اللَّهِ ۞ عَلَى طَهَ رَسُولِ اللَّهِ\nصَلَاةُ اللَّهِ سَلَامُ اللَّهِ ۞ عَلَى يَس حَبِيبِ اللَّهِ",
        latin: "Ṣalātullāh salāmullāh, 'alā Ṭāhā rasūlillāh.\nṢalātullāh salāmullāh, 'alā Yāsīn ḥabībillāh.",
        terjemahan: "Shalawat Allah dan salam-Nya, atas Thaha utusan Allah.\nShalawat Allah dan salam-Nya, atas Yasin kekasih Allah.",
      },
      {
        title: "Bait Tawassul",
        arab: "تَوَسَّلْنَا بِبِسْمِ اللَّهِ ۞ وَبِالْهَادِي رَسُولِ اللَّهِ\nوَكُلِّ مُجَاهِدٍ لِلَّهِ ۞ بِأَهْلِ الْبَدْرِ يَا اللَّهُ",
        latin: "Tawassalnā bibismillāh, wa bil-hādī rasūlillāh.\nWa kulli mujāhidin lillāh, bi-ahlil-Badri yā Allāh.",
        terjemahan: "Kami bertawassul dengan nama Allah, dan dengan pemberi petunjuk utusan Allah.\nDan semua mujahid karena Allah, dengan ahli Badar, wahai Allah.",
        catatan: "Lengkapnya 28 bait — biasanya dibaca lengkap di majelis sholawat.",
      },
    ],
  },
};

export function hasBacaan(id: string): boolean {
  return id in BACAAN;
}
