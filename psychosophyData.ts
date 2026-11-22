import type {
  PsychosophyAspect,
  PsychosophyPositionNumber,
} from '../types/dynamap';

export interface PsychosophyIntroSection {
  title: string;
  definition: string;
  psychosophyVsAttitudinalPsyche: {
    aspect: string;
    psychosophyAfanasyev: string;
    attitudinalPsyche: string;
  }[];
  scientificAndEthicalLimitations: string[];
  nonEquivalencyRules: {
    placementOrAspect: string;
    misconception: string;
    clarification: string;
  }[];
}

export const PSYCHOSOPHY_INTRO: PsychosophyIntroSection = {
  title: 'Pengantar Psikosofi (Psychosophy) & Attitudinal Psyche',
  definition:
    'Psikosofi (Psychosophy) adalah kerangka tipologi teoretis yang memetakan bagaimana seseorang memprioritaskan, mengevaluasi, mengekspresikan, dan merespons empat aspek kehidupan psikologis: Logika (L — Logic), Kehendak (V — Volition), Emosi (E — Emotion), dan Fisika (F — Physics). Kerangka ini tidak mengukur kemampuan objektif atau bakat bawaan seseorang, melainkan sikap subjektif, tingkat kepastian internal, sensitivitas, serta investasi energi pada masing-masing aspek.',
  psychosophyVsAttitudinalPsyche: [
    {
      aspect: 'Asal-usul & Pencetus',
      psychosophyAfanasyev:
        'Dikembangkan oleh penulis dan pemikir Rusia Aleksandr Afanasyev dalam bukunya Sintaks Lyubvi ("Syntax of Love", 1993) dengan penekanan pada hierarki kebutuhan, ketahanan psikologis, dan dinamika relasi antar-posisi.',
      attitudinalPsyche:
        'Dikembangkan oleh Rob Zuber sebagai sistem modern yang terinspirasi Psikosofi dengan pembaruan istilah fungsi sikap, pembagian Sextet/Club, dan fokus pada sikap sadar terhadap diri vs orang lain.',
    },
    {
      aspect: 'Penamaan Posisi (1–4)',
      psychosophyAfanasyev:
        'Sering memakai label klasik atau deskriptif berdasarkan urutan prioritas: Posisi 1 (Pertama / Dominan-Agresif terhadap hasil), Posisi 2 (Kedua / Kreatif-Proses), Posisi 3 (Ketiga / Rentan-Luka atau Ulcer / Insecure), dan Posisi 4 (Keempat / Pasrah-Hasil / Pustyshka atau rendah prioritas).',
      attitudinalPsyche:
        'Menggunakan label terstandar: 1st = Confident (Self-Positive, Others-Negative, Result), 2nd = Flexible (Self-Positive, Others-Positive, Process), 3rd = Insecure (Self-Negative, Others-Negative, Process), 4th = Unbothered (Self-Negative, Others-Positive, Result).',
    },
    {
      aspect: 'Konvensi Nama Tipe (24 Tipe)',
      psychosophyAfanasyev:
        'Menggunakan julukan tokoh historis/sastra (misalnya LVEF = "Einstein", ELVF = "Andersen", VLEF = "Socrates") sebagai simbol ilustratif. Sebagian julukan memiliki variasi terjemahan atau perdebatan komunitas.',
      attitudinalPsyche:
        'Lebih mengutamakan kode 4 huruf (mis. LVEF) dan pengelompokan Sextet / Temperamen (mis. Inquisitive, Pragmatic, Diplomatic, Tempered) daripada julukan tokoh historis.',
    },
    {
      aspect: 'Aturan DYNAMAP',
      psychosophyAfanasyev:
        'DYNAMAP menjadikan kode 4 huruf (mis. LVEF) sebagai pengenal utama. Bila julukan Afanasyev ditampilkan, sumber tradisinya selalu dicatat secara eksplisit.',
      attitudinalPsyche:
        'Konsep dari Psychosophy dan Attitudinal Psyche dijelaskan perbandingannya tanpa mencampuradukkan istilah secara diam-diam seolah keduanya identik.',
    },
  ],
  scientificAndEthicalLimitations: [
    'Psikosofi dan Attitudinal Psyche adalah kerangka tipologi teoretis untuk refleksi komunikasi—BUKAN alat asesmen klinis, tes psikologi terstandardisasi, maupun pengukuran ilmiah kepribadian.',
    'Tidak ada bukti empiris psikometrik bahwa manusia terbagi secara mutlak ke dalam 24 tipe diskrit tanpa perubahan seiring konteks, usia, atau pengalaman hidup.',
    'Posisi dalam Psikosofi menggambarkan sikap dan prioritas subjektif, bukan kemampuan objektif, kecerdasan intelektual, kestabilan kesehatan mental, atau kualitas moral.',
    'Dalam lingkungan sekolah SMA, kode Psikosofi tidak boleh dipakai untuk menentukan jurusan, menilai kelayakan ketua organisasi, ataupun menyalahkan seseorang saat terjadi konflik.',
  ],
  nonEquivalencyRules: [
    {
      placementOrAspect: '1L vs 4L (Logika)',
      misconception: '1L berarti paling cerdas/jenius, sedangkan 4L berarti bodoh atau tidak mampu berpikir kritis.',
      clarification:
        '1L hanya menunjukkan keyakinan dan kemandirian tinggi atas kerangka logika pribadi; orang 1L tetap bisa membuat kekeliruan fakta. Sebaliknya, 4L dapat sangat cerdas secara akademik namun tidak merasa perlu memperdebatkan argumen secara pribadi jika tidak mendesak.',
    },
    {
      placementOrAspect: '1V vs 4V (Kehendak / Volition)',
      misconception: '1V otomatis pemimpin yang kompeten, sedangkan 4V lemah, penurut, atau tidak punya ambisi.',
      clarification:
        '1V berfokus pada arah kehendak pribadi yang tegas, tetapi belum tentu terampil bernegosiasi atau memfasilitasi tim. 4V dapat berprestasi tinggi dan tegas pada nilai pribadinya, hanya saja lebih hemat energi dalam perebutan status atau kontrol langsung.',
    },
    {
      placementOrAspect: '1E vs 3E (Emosi)',
      misconception: '1E sama dengan kecerdasan emosional (EQ) atau empati tinggi, sedangkan 3E berarti tidak stabil secara psikologis.',
      clarification:
        '1E lebih menggambarkan ekspresivitas dan keterikatan kuat pada pengalaman emosi diri; kadang justru kurang peka terhadap reaksi emosional orang lain. 3E menggambarkan kehati-hatian dan kepekaan terhadap penilaian emosional—bukan gangguan kesehatan mental.',
    },
    {
      placementOrAspect: '1F vs 4F (Fisika / Physics)',
      misconception: 'F berarti Feeling (Perasaan); atau 1F pasti atletis, kaya, dan menarik secara fisik sementara 4F pasti tidak sehat.',
      clarification:
        'F adalah singkatan dari Physics (ranah materi, tubuh, kenyamanan fisik, dan kondisi lingkungan), BUKAN Feeling. Posisi Fisika mencerminkan perhatian dan kenyamanan sikap terhadap hal material-fisik, bukan kondisi kesehatan medis atau status ekonomi.',
    },
  ],
};

export interface PsychosophyAspectSpec {
  code: PsychosophyAspect;
  englishName: string;
  indonesianName: string;
  criticalNote?: string;
  domainItems: string[];
  overview: string;
  acrossPositionsSummary: {
    position: PsychosophyPositionNumber;
    summary: string;
  }[];
  notEquatedWith: string;
}

export const PSYCHOSOPHY_ASPECTS: Record<PsychosophyAspect, PsychosophyAspectSpec> = {
  L: {
    code: 'L',
    englishName: 'Logic',
    indonesianName: 'Logika (Informasi, Penalaran & Kebenaran Konseptual)',
    domainItems: [
      'Informasi, pengetahuan, dan ketepatan fakta.',
      'Konsistensi logis dan koherensi sebuah argumen.',
      'Penalaran sebab-akibat dan penyusunan penjelasan.',
      'Teori, prinsip, dan sistem konseptual.',
      'Cara menghadapi perbedaan pendapat intelektual.',
      'Kebutuhan untuk memastikan kebenaran dan pemahaman pribadi.',
    ],
    overview:
      'Aspek Logika (L) menggambarkan sikap individu terhadap kebenaran konseptual, kejelasan penalaran, pertukaran ide, dan diskusi argumen. Aspek ini menyoroti seberapa besar seseorang mengandalkan pendapatnya sendiri, menikmati proses dialog intelektual, merasa rentan terhadap kritik logika, atau bersikap praktis tanpa memperpanjang perdebatan teoretis.',
    acrossPositionsSummary: [
      {
        position: 1,
        summary: 'Keyakinan tinggi dan mandiri terhadap kesimpulan logis diri sendiri; cepat menentukan mana yang masuk akal, terkadang tampak mutlak bila tidak disadari.',
      },
      {
        position: 2,
        summary: 'Luwes, dialogis, dan menikmati eksplorasi argumen dua arah; mampu melihat banyak sisi tanpa merasa terancam saat gagasannya diuji.',
      },
      {
        position: 3,
        summary: 'Sangat sadar akan kemungkinan salah nalar; peka terhadap kritik intelektual atau nada menggurui, sehingga sering mengecek ulang argumen atau menghindari debat terbuka.',
      },
      {
        position: 4,
        summary: 'Tidak menganggap perdebatan konseptual sebagai prioritas personal; cenderung menerima kesimpulan yang jelas/praktis dari sumber tepercaya agar fokus ke hal lain.',
      },
    ],
    notEquatedWith:
      'Logika (L) BUKAN ukuran skor IQ, nilai rapor akademik, ataupun kepandaian berhitung. Seseorang dengan 3L atau 4L dapat menjadi ilmuwan atau siswa berprestasi, dan seseorang dengan 1L tetap bisa terjebak bias kognitif.',
  },
  V: {
    code: 'V',
    englishName: 'Volition',
    indonesianName: 'Kehendak / Volition (Keputusan, Otonomi & Arah Diri)',
    domainItems: [
      'Kehendak pribadi dan ketetapan niat.',
      'Pengambilan keputusan serta keberanian menentukan arah.',
      'Tujuan, ambisi, dan prioritas hidup jangka panjang.',
      'Otonomi, kemandirian sikap, dan batas pribadi (boundaries).',
      'Sikap terhadap otoritas, aturan, dan tanggung jawab kepemimpinan.',
      'Kendali atas pilihan serta arah perjalanan diri.',
    ],
    overview:
      'Aspek Kehendak atau Volition (V) menggambarkan sikap individu terhadap kuasa pengambilan keputusan, tanggung jawab, otonomi, serta bagaimana ia menegosiasikan keinginannya dengan keinginan orang lain. Dalam kerangka Afanasyev maupun AP, posisi V sering memengaruhi bagaimana ketiga aspek lainnya diekspresikan dalam interaksi sosial.',
    acrossPositionsSummary: [
      {
        position: 1,
        summary: 'Arah diri sangat tegas dan berdaulat; terbiasa mengambil keputusan utama sendiri dan sulit menerima arahan sepihak tanpa alasan kuat.',
      },
      {
        position: 2,
        summary: 'Otonom sekaligus kolaboratif; mampu memimpin maupun memberi ruang bagi kehendak orang lain melalui negosiasi setara dan hormat.',
      },
      {
        position: 3,
        summary: 'Sangat peka terhadap tekanan otoritas, kritik atas kompetensi keputusan, atau ancaman terhadap kebebasan diri; dapat tampak ragu-ragu atau justru defensif keras saat didesak.',
      },
      {
        position: 4,
        summary: 'Tidak berminat memperebutkan kendali atau status kekuasaan; bersedia mengikuti arah kelompok selama ruang batas dasarnya tidak dilanggar secara ekstrem.',
      },
    ],
    notEquatedWith:
      'Volition (V) BUKAN sinonim kepemimpinan yang baik atau keberhasilan karier. 1V bisa bertindak otoriter jika kurang dialog, sedangkan 4V bisa sangat bertanggung jawab pada tugas tanpa perlu mendominasi keputusan sosial.',
  },
  E: {
    code: 'E',
    englishName: 'Emotion',
    indonesianName: 'Emosi (Ekspresi, Atmosfer & Pengalaman Perasaan)',
    domainItems: [
      'Ekspresi emosional verbal maupun non-verbal.',
      'Atmosfer emosional dalam percakapan dan kelompok.',
      'Reaksi batin terhadap pengalaman seni, estetika, dan makna personal.',
      'Cara mengomunikasikan perasaan (hangat, dramatis, tenang, atau tertutup).',
      'Harapan emosional terhadap respons orang lain.',
      'Kenyamanan saat menghadapi intensitas emosi pihak lain.',
    ],
    overview:
      'Aspek Emosi (E) menggambarkan bagaimana individu bersikap terhadap perasaan, suasana hati, antusiasme, dan ekspresi emosional dalam dirinya maupun dalam ruangan bersama. Ada orang yang menjadikan kedalaman emosi sebagai kompas utama (1E/2E), ada yang berhati-hati menampakkan emosi karena takut dinilai berlebihan atau canggung (3E), dan ada yang membiarkan suasana emosional mengikuti keadaan tanpa menginvestasikan energi besar (4E).',
    acrossPositionsSummary: [
      {
        position: 1,
        summary: 'Menghayati emosi secara kuat, langsung, dan autentik dari dalam diri; ekspresivitas cenderung penuh keyakinan dan tidak menunggu izin suasana luar.',
      },
      {
        position: 2,
        summary: 'Ekspresif namun luwes membaca suasana; mampu menghangatkan percakapan, memvalidasi perasaan orang lain, dan memodulasi nada sesuai konteks.',
      },
      {
        position: 3,
        summary: 'Peka dan mudah canggung terhadap suasana emosional terbuka; khawatir emosinya terlihat berlebihan, tidak pantas, atau disalahpahami orang lain.',
      },
      {
        position: 4,
        summary: 'Tenang, irit energi emosional, dan mudah menyesuaikan atau menyerap nada emosional lingkungan tanpa banyak drama internal.',
      },
    ],
    notEquatedWith:
      'Aspek Emosi (E) TIDAK sama dengan kecerdasan emosional (EQ), tingkat empati, kebaikan hati, ataupun kesehatan mental. 1E tetap dapat keliru membaca perasaan orang lain, dan 4E tetap dapat sangat peduli dan setia melalui tindakan nyata.',
  },
  F: {
    code: 'F',
    englishName: 'Physics',
    indonesianName: 'Fisika / Physics (Kenyamanan Fisik, Materi & Pengaturan Praktis)',
    criticalNote:
      'PENTING: Huruf F dalam Psikosofi adalah singkatan dari PHYSICS (Fisika / Dunia Material & Sensorik), BUKAN Feeling (Perasaan).',
    domainItems: [
      'Kenyamanan fisik, istirahat, suhu ruangan, dan ergonomi.',
      'Sikap terhadap makanan, selera sensorik, dan kebutuhan tubuh.',
      'Penampilan, kerapian diri, dan estetika benda konkret.',
      'Pengaturan barang pribadi, kepemilikan, serta sumber daya material.',
      'Pengelolaan lingkungan fisik dan pengaturan praktis sehari-hari.',
      'Keterlibatan dalam aktivitas konkret dan pengalaman inderawi.',
    ],
    overview:
      'Aspek Fisika (F) menggambarkan sikap dan prioritas seseorang terhadap dunia materi, kenyamanan tubuh, pengalaman sensorik, serta urusan praktis sehari-hari. Posisi F menjelaskan mengapa sebagian siswa sangat memperhatikan kerapian tata letak, makanan, kenyamanan tempat duduk, atau detail materi (1F/2F), sementara sebagian lain mudah merasa terganggu oleh kritik soal penampilan/keterampilan fisik (3F) atau bersikap sangat simpel selama kebutuhan dasar terpenuhi (4F).',
    acrossPositionsSummary: [
      {
        position: 1,
        summary: 'Sangat tahu apa yang terasa nyaman, nikmat, atau praktis bagi dirinya sendiri; berpendirian tegas atas preferensi fisik/material dan kebutuhan tubuhnya.',
      },
      {
        position: 2,
        summary: 'Aktif, cekatan, dan senang berbagi kenyamanan atau keterampilan praktis bersama orang lain; menikmati aktivitas fisik/material secara luwes.',
      },
      {
        position: 3,
        summary: 'Sering merasa waspada, perfeksionis, atau tidak nyaman bila penampilan, kondisi tubuh, kebersihan, atau pengaturan praktisnya dikomentari atau didesak.',
      },
      {
        position: 4,
        summary: 'Tidak terlalu terpaku pada detail kenyamanan fisik atau kepemilikan materi; mudah beradaptasi dengan kondisi ruang sederhana selama tidak mengganggu fokus utamanya.',
      },
    ],
    notEquatedWith:
      'Fisika (F) TIDAK sama dengan kemampuan atletik, kekuatan otot, daya tarik fisik, kekayaan materi, ataupun kesehatan medis. Seseorang ber-4F dapat menjadi atlet disiplin lewat kebiasaan, dan seseorang ber-1F tidak otomatis kaya atau selalu bugar.',
  },
};

export interface PsychosophyPositionSpec {
  position: PsychosophyPositionNumber;
  labelIndonesian: string;
  afanasyevTerms: string[];
  attitudinalPsycheTerms: string[];
  orientationDichotomies: string;
  coreCharacteristics: string;
  comparisonRow: {
    basicAttitude: string;
    confidenceVsSensitivity: string;
    responseToOthersInput: string;
    processVsResult: string;
    mistypingRisk: string;
  };
  schoolNuanceNote: string;
}

export const PSYCHOSOPHY_POSITIONS: Record<PsychosophyPositionNumber, PsychosophyPositionSpec> = {
  1: {
    position: 1,
    labelIndonesian: 'Posisi Pertama (1st — Dominan / Confident)',
    afanasyevTerms: ['Pertama (1st)', 'Agresif terhadap Hasil', 'Monologis / Berpusat pada Diri'],
    attitudinalPsycheTerms: ['Confident (Self-Positive, Others-Negative, Result)'],
    orientationDichotomies: 'Result-oriented · Self-Positive · Others-Negative (pada domain ini)',
    coreCharacteristics:
      'Aspek di Posisi 1 adalah prioritas internal paling tegas dan paling diyakini secara mandiri. Individu memperlakukan ranah ini sebagai urusan pribadi yang kesimpulannya ditentukan dari dalam diri sendiri. Mereka cenderung langsung menuju hasil yang dirasa benar dan tidak mudah mengubah pendirian hanya karena pendapat orang lain—kecuali disertai bukti atau alasan yang benar-benar menyentuh standar internalnya.',
    comparisonRow: {
      basicAttitude: 'Tegas, mandiri, menganggap keputusan di ranah ini sebagai otoritas pribadi.',
      confidenceVsSensitivity: 'Kepercayaan diri internal tinggi; jarang goyah oleh keraguan luar, namun bisa kaku jika ditantang langsung.',
      responseToOthersInput: 'Selektif atau skeptis; tidak merasa wajib berdiskusi panjang kecuali masukan dirasa selaras atau relevan secara nyata.',
      processVsResult: 'Result (Fokus Hasil): cepat menyimpulkan/menetapkan standar akhir tanpa perlu proses bolak-balik terlalu lama.',
      mistypingRisk: 'Sering dikira Posisi 2 jika orangnya ramah, atau dikira "paling ahli" padahal percaya diri ≠ kompetensi objektif.',
    },
    schoolNuanceNote:
      'Perbedaan tegas 1st vs 2nd: Posisi 1 bersikap monologis dan fokus pada kepastian hasil pribadi ("aku sudah tahu mana yang kupegang"), sedangkan Posisi 2 bersikap dialogis dan menikmati proses saling bertukar ide/ekspresi dengan orang lain.',
  },
  2: {
    position: 2,
    labelIndonesian: 'Posisi Kedua (2nd — Kreatif / Flexible)',
    afanasyevTerms: ['Kedua (2nd)', 'Kreatif / Proses Sehat', 'Dialogis / Kolaboratif'],
    attitudinalPsycheTerms: ['Flexible (Self-Positive, Others-Positive, Process)'],
    orientationDichotomies: 'Process-oriented · Self-Positive · Others-Positive',
    coreCharacteristics:
      'Aspek di Posisi 2 merupakan ruang dialog yang sehat, aktif, dan penuh keluwesan. Individu merasa cukup aman atas kapasitas dirinya di aspek ini sekaligus terbuka terhadap kontribusi, perbedaan sudut pandang, dan partisipasi orang lain. Mereka menikmati proses membahas, menyesuaikan, dan membangun ranah ini bersama-sama tanpa merasa tersaingi.',
    comparisonRow: {
      basicAttitude: 'Luwes, dialogis, adaptif; nyaman melibatkan orang lain dan menimbang berbagai kemungkinan.',
      confidenceVsSensitivity: 'Stabil dan tidak mudah tersinggung; mampu menerima kritik dengan rasa ingin tahu daripada defensif.',
      responseToOthersInput: 'Terbuka, mengundang diskusi, senang memberi ruang agar rekan juga berpendapat atau berkontribusi.',
      processVsResult: 'Process (Fokus Proses): menikmati perjalanan eksplorasi, penyesuaian bertahap, dan interaksi timbal balik.',
      mistypingRisk: 'Sering disangka ragu-ragu (3rd) karena mau mempertimbangkan banyak sisi, padahal motivasinya adalah eksplorasi terbuka, bukan kecemasan.',
    },
    schoolNuanceNote:
      'Saat siswa dengan Posisi 2 bekerja dengan rekan ber-Posisi 3 di aspek yang sama, Posisi 2 sering berperan sebagai penenang yang membantu Posisi 3 merasa aman—asalkan tidak terlalu memaksa terus membahas tanpa jeda.',
  },
  3: {
    position: 3,
    labelIndonesian: 'Posisi Ketiga (3rd — Rentan / Role / Insecure)',
    afanasyevTerms: ['Ketiga (3rd)', 'Luka / Titik Peka (Ulcer)', 'Proses Defensif atau Perfeksionis'],
    attitudinalPsycheTerms: ['Insecure (Self-Negative, Others-Negative, Process)'],
    orientationDichotomies: 'Process-oriented · Self-Negative · Others-Negative',
    coreCharacteristics:
      'Aspek di Posisi 3 adalah titik kesadaran diri yang tinggi, sensitif, dan sering diiringi keraguan internal maupun kewaspadaan terhadap penilaian pihak lain. Individu kerap menginginkan validasi dan rasa aman di ranah ini, tetapi di saat yang sama bisa bersikap sangat kritis atau berhati-hati terhadap cara orang lain menanganinya. PENTING: Posisi 3 TIDAK berarti tidak mampu atau lemah—banyak orang justru berusaha ekstra keras, teliti, dan berprestasi di aspek ke-3.',
    comparisonRow: {
      basicAttitude: 'Waspada, sangat sadar standar/kesalahan, sering terombang-ambing antara ingin dibantu dan takut dinilai kurang.',
      confidenceVsSensitivity: 'Sensitivitas tinggi terhadap kritik, nada meremehkan, atau tekanan mendadak di ranah ini.',
      responseToOthersInput: 'Butuh pendekatan yang hormat dan jelas; bisa menolak masukan kasar sambil diam-diam mencemaskannya.',
      processVsResult: 'Process (Fokus Proses): cenderung memikirkan/mengulang-ulang detail karena khawatir hasil belum cukup aman.',
      mistypingRisk: 'Paling sering salah dikira 1st jika terlihat sangat menuntut/perfeksionis di luar, atau dikira "pasti tidak kompeten" padahal hanya lebih peka.',
    },
    schoolNuanceNote:
      'Membedakan 3rd dari trauma sesaat atau minimnya pengalaman: Posisi 3 mencerminkan kepekaan berulang lintas berbagai situasi dan waktu, bukan sekadar rasa gugup sebelum satu ujian tertentu.',
  },
  4: {
    position: 4,
    labelIndonesian: 'Posisi Keempat (4th — Ringan / Unbothered / Results)',
    afanasyevTerms: ['Keempat (4th)', 'Pustyshka / Ringan-Pasrah', 'Berorientasi Hasil Eksternal'],
    attitudinalPsycheTerms: ['Unbothered (Self-Negative, Others-Positive, Result)'],
    orientationDichotomies: 'Result-oriented · Self-Negative · Others-Positive',
    coreCharacteristics:
      'Aspek di Posisi 4 menempati prioritas terendah dalam investasi energi emosional atau ego pribadi. Dalam tradisi Psikosofi Afanasyev, posisi ke-4 sering disebut berorientasi "Hasil" atau mengikuti standar luar yang sudah terbukti bekerja, sementara Attitudinal Psyche menamainya "Unbothered" (tidak ambil pusing) karena individu tidak merasa perlu mempertahankan ego maupun berproses panjang di ranah ini. Posisi 4 BUKAN berarti bodoh, lemah, atau tidak mampu—melainkan memilih menyederhanakan urusan ini agar energinya mengalir ke aspek 1, 2, atau 3.',
    comparisonRow: {
      basicAttitude: 'Ringan, pragmatis, cepat selesai, tidak menjadikan ranah ini ukuran harga diri pribadi.',
      confidenceVsSensitivity: 'Rendah ego & tidak terlalu sensitif; jarang tersinggung bila dikoreksi selama tidak melampaui batas wajar.',
      responseToOthersInput: 'Cukup mudah mengikuti preferensi orang lain yang lebih peduli atau berpengalaman di bidang ini.',
      processVsResult: 'Result (Fokus Hasil Ringkas): ingin jawaban atau penyelesaian yang langsung bisa dipakai tanpa proses berlarut-larut.',
      mistypingRisk: 'Sering dikira tidak peduli terhadap orang lain, padahal ia hanya hemat energi pada aspek tersebut. Juga berbeda dari 3rd yang mudah cemas.',
    },
    schoolNuanceNote:
      'Catatan Perbedaan Istilah Antar-Aliran: Afanasyev menekankan sisi "pengikut/adaptif hasil luar" pada posisi ke-4, sedangkan Attitudinal Psyche menekankan sifat "Unbothered" (santai & berorientasi hasil ringkas). Keduanya sepakat bahwa keterlibatan ego pribadi di posisi 4 lebih ringan daripada posisi 1–3.',
  },
};

export interface PsychosophyPlacementGuide {
  code: string; // e.g. "1L"
  aspect: PsychosophyAspect;
  position: PsychosophyPositionNumber;
  title: string;
  coreAttitude: string;
  typicalSubjectiveExperience: string;
  potentialStrengths: string[];
  potentialDifficulties: string[];
  reflectiveQuestions: string[];
  everydayExamples: string[];
  possibleMisinterpretations: string;
  differencesFromAdjacentPositions: string;
}

export const PSYCHOSOPHY_16_PLACEMENTS: Record<string, PsychosophyPlacementGuide> = {
  // ================= LOGIC (1L - 4L) =================
  '1L': {
    code: '1L',
    aspect: 'L',
    position: 1,
    title: '1L — Logika Pertama (Dominan / Confident Logic)',
    coreAttitude:
      'Menjadikan penalaran dan kesimpulan intelektual pribadi sebagai patokan utama yang mandiri; yakin pada kebenaran kerangka berpikir yang sudah dibangun sendiri dan lebih berorientasi pada kesimpulan akhir daripada debat bertele-tele.',
    typicalSubjectiveExperience:
      'Merasa cepat melihat inti masuk akal atau tidaknya suatu penjelasan. Ketika sudah menyusun kesimpulan, dorongan untuk membuang waktu berdebat soal definisi dasar terasa melelahkan kecuali lawan bicara membawa fakta yang benar-benar baru.',
    potentialStrengths: [
      'Kemandirian berpikir dan keberanian mempertahankan argumen yang diyakini benar.',
      'Kejernihan menyaring gagasan menjadi kesimpulan atau prinsip inti dengan cepat.',
      'Tidak mudah goyah hanya karena opini mayoritas bila bukti dirasa tidak kuat.',
    ],
    potentialDifficulties: [
      'Berisiko terdengar mutlak, menutup diskusi terlalu cepat, atau terkesan tidak menghargai proses berpikir orang lain.',
      'Kurang sabar mendengarkan penjelasan panjang yang belum sampai ke poin utama.',
      'Dapat keliru merasa cukup yakin padahal data awal yang dipakai ternyata belum lengkap.',
    ],
    reflectiveQuestions: [
      'Saat berbeda pendapat di kelas, apakah aku langsung memotong ke kesimpulan "yang benar adalah..." alih-alih menikmati tanya-jawab prosesnya?',
      'Apakah aku merasa pendapat logisku adalah tanggung jawabku sendiri dan jarang butuh validasi orang lain untuk merasa masuk akal?',
      'Apakah perdebatan yang berputar-putar tanpa kesimpulan membuatku cepat jemu?',
    ],
    everydayExamples: [
      'Saat diskusi kelompok makalah, langsung merumuskan kerangka kesimpulan utama lalu merasa malas mengulang debat hal kecil yang sudah dianggap selesai.',
      'Memegang pandangan kuat tentang suatu teori pelajaran dan hanya mengubahnya jika ada bukti kontradiktif yang sangat jelas.',
    ],
    possibleMisinterpretations:
      'Sering disamakan dengan kecerdasan tinggi/nilai rapor tinggi, atau disalahpahami sebagai sikap sombong. Padahal, ketegasan ucapan bisa juga berasal dari kepribadian yang hanya terbiasa bicara lugas, atau sebaliknya orang 3L yang sedang defensif keras.',
    differencesFromAdjacentPositions:
      'Berbeda dari 2L: 1L lebih monologis dan mencari kepastian kesimpulan sendiri, sedangkan 2L senang berdialog panjang, menimbang berbagai sudut pandang, dan menganggap pertukaran argumen sebagai kesenangan bersama.',
  },
  '2L': {
    code: '2L',
    aspect: 'L',
    position: 2,
    title: '2L — Logika Kedua (Kreatif / Flexible Logic)',
    coreAttitude:
      'Melihat logika, gagasan, dan diskusi intelektual sebagai ruang interaksi terbuka yang sehat; percaya diri pada kemampuan menalar sekaligus menghargai serta mengundang cara berpikir orang lain.',
    typicalSubjectiveExperience:
      'Menikmati proses menjelaskan suatu konsep agar mudah dipahami teman, membandingkan beberapa teori sekaligus, serta mengubah atau memperkaya sudut pandang ketika mendengar alasan bagus dari lawan bicara tanpa merasa harga diri terancam.',
    potentialStrengths: [
      'Komunikatif secara intelektual; pandai menjembatani perbedaan pemahaman di dalam kelompok.',
      'Fleksibel menguji beberapa sudut pandang secara objektif tanpa keras kepala.',
      'Mampu berdebat sehat dengan nada ramah dan membangun rasa aman bagi rekan yang ragu bertanya.',
    ],
    potentialDifficulties: [
      'Terkadang terlalu lama mengeksplorasi sudut pandang sehingga kelompok menunggu keputusan final.',
      'Dapat tanpa sadar membuat rekan 1L kesal karena terus bertanya "bagaimana kalau dilihat dari sisi lain?", atau membuat rekan 4L lelah dengan panjangnya pembahasan.',
    ],
    reflectiveQuestions: [
      'Apakah aku tetap merasa nyaman dan bersemangat bahkan ketika orang lain menunjukkan celah atau sudut pandang baru atas argumenku?',
      'Apakah aku senang menyesuaikan cara menjelaskan materi tergantung siapa yang kulayani bertanya?',
      'Apakah bagiku proses berdiskusi dan bertukar alasan sama pentingnya dengan menemukan jawaban akhir?',
    ],
    everydayExamples: [
      'Menjadi penengah dalam rapat kelas dengan merangkum alasan pro dan kontra dari dua kubu secara adil.',
      'Senang mengajari teman sekelas konsep Fisika/Sejarah melalui analogi dan tanya-jawab dua arah.',
    ],
    possibleMisinterpretations:
      'Sikap mau mendengarkan banyak sudut pandang sering disalahartikan sebagai keraguan diri (seperti 3L), padahal 2L merasa aman dan tidak cemas ketika gagasannya dipertanyakan.',
    differencesFromAdjacentPositions:
      'Berbeda dari 1L: 2L berorientasi proses dan dialogis (tidak memaksakan satu kesimpulan tunggal sebagai otoritas pribadi). Berbeda dari 3L: 2L tidak merasa tersinggung atau cemas saat argumennya dikritik.',
  },
  '3L': {
    code: '3L',
    aspect: 'L',
    position: 3,
    title: '3L — Logika Ketiga (Peka / Insecure Logic)',
    coreAttitude:
      'Menaruh perhatian tinggi dan kewaspadaan terhadap ketepatan logika; sangat menginginkan pemahamannya diakui masuk akal, namun mudah merasa ragu, takut keliru, atau tersinggung oleh nada yang terasa menggurui atau meremehkan.',
    typicalSubjectiveExperience:
      'Sering memeriksa ulang catatan atau argumen berkali-kali sebelum berbicara di kelas karena khawatir terdengar tidak logis. Jika ada teman memotong atau menyalahkan argumennya dengan nada tajam, muncul dorongan untuk menarik diri atau justru membantah secara defensif.',
    potentialStrengths: [
      'Sangat teliti mengecek celah logika, asumsi tersembunyi, dan rincian argumentasi sebelum dipresentasikan.',
      'Mampu mengajukan pertanyaan kritis yang mendalam setelah diberi waktu berpikir tenang.',
      'Berhati-hati agar tidak menyimpulkan sesuatu secara gegabah.',
    ],
    potentialDifficulties: [
      'Mudah merasa terintimidasi atau tidak aman saat berhadapan dengan gaya penyampaian 1L yang terlalu lugas.',
      'Bisa menunda menyampaikan ide bagus karena terlalu khawatir salah, atau terjebak memikirkan kritik intelektual terlalu lama.',
    ],
    reflectiveQuestions: [
      'Apakah aku sering menahan pendapat di forum kelas karena takut dianggap kurang masuk akal atau dikoreksi di depan umum?',
      'Bagaimana perasaanku saat seseorang langsung menyebut pendapatku "salah" tanpa menjelaskan prosesnya dengan hormat?',
      'Apakah aku tetap rajin mencari tahu dan memverifikasi pemahaman secara pribadi, meski ragu saat harus berdebat cepat?',
    ],
    everydayExamples: [
      'Menyiapkan jawaban tertulis secara mendetail sebelum sesi tanya-jawab presentasi agar tidak gagap bila ditanya.',
      'Merasa kesal atau kecil hati lebih lama jika teman kelompok menertawakan pertanyaan yang diajukan.',
    ],
    possibleMisinterpretations:
      'Bukan berarti kurang cerdas! Juga perlu dibedakan dari rasa malu sementara di awal semester, guru yang terlalu galak, atau topik yang memang belum pernah dipelajari sebelumnya.',
    differencesFromAdjacentPositions:
      'Berbeda dari 2L: 3L mengalami beban kecemasan dan sensitivitas saat logikanya diuji secara terbuka. Berbeda dari 4L: 3L sangat peduli apakah dirinya dianggap masuk akal dan sulit bersikap acuh terhadap kritik intelektual.',
  },
  '4L': {
    code: '4L',
    aspect: 'L',
    position: 4,
    title: '4L — Logika Keempat (Ringan / Unbothered Logic)',
    coreAttitude:
      'Memandang diskusi teoretis dan perdebatan argumen sebagai prioritas yang ringan; tidak merasa perlu mempertahankan ego intelektual dan bersikap praktis mengikuti penjelasan yang jelas dari sumber yang dipercaya.',
    typicalSubjectiveExperience:
      'Tidak tertarik berdebat panjang demi memenangkan teori abstrak. Jika ada penjelasan yang runtut, langsung dipakai secara praktis; energi mental lebih banyak diarahkan ke aspek yang berada di posisi 1–3 (misalnya perasaan, kehendak, atau kenyamanan nyata).',
    potentialStrengths: [
      'Tidak keras kepala dalam perdebatan konseptual; cepat menerima fakta baru tanpa drama ego.',
      'Praktis dan tidak memperumit keputusan dengan analisis berlebihan (overthinking teoretis).',
      'Menjadi pendengar yang tenang saat rekan 1L atau 2L memaparkan kerangka berpikir.',
    ],
    potentialDifficulties: [
      'Berisiko terlalu cepat menerima kesimpulan pihak lain tanpa menguji asumsi kritisnya terlebih dahulu.',
      'Dapat merasa bosan atau lelah bila diajak berdiskusi konseptual berjam-jam tanpa arah tindakan.',
    ],
    reflectiveQuestions: [
      'Dalam perdebatan ide kelompok, apakah aku sering berpikir "yang penting jelas mana yang mau dikerjakan, nggak usah debat panjang"?',
      'Apakah aku jarang merasa harga diriku terluka bila gagasanku direvisi secara logis oleh teman yang lebih mendalami topik itu?',
      'Apakah aku lebih memilih ringkasan praktis daripada mendalami fondasi teori jika tidak diwajibkan?',
    ],
    everydayExamples: [
      'Saat mengerjakan tugas kelompok, lebih memilih langsung membagi pekerjaan daripada berdebat 40 menit soal definisi judul makalah.',
      'Mengikuti cara penyelesaian soal yang paling jelas dari guru atau teman tanpa merasa perlu menemukan rumus alternatif sendiri.',
    ],
    possibleMisinterpretations:
      'Sering keliru disamakan dengan kemalasan berpikir atau kecerdasan rendah. Padahal siswa 4L bisa sangat tekun dan berprestasi tinggi bila termotivasi oleh tujuan (V), makna emosi (E), atau hasil nyata (F).',
    differencesFromAdjacentPositions:
      'Berbeda dari 3L: 4L tidak cemas atau defensif saat dikoreksi secara intelektual dan tidak memikul beban pembuktian logika. Berbeda dari 1L: 4L sama sekali tidak merasa perlu memegang otoritas kebenaran konseptual sendiri.',
  },

  // ================= VOLITION (1V - 4V) =================
  '1V': {
    code: '1V',
    aspect: 'V',
    position: 1,
    title: '1V — Kehendak Pertama (Dominan / Confident Volition)',
    coreAttitude:
      'Memiliki kedaulatan arah diri yang kuat dan tegas; melihat keputusan, tujuan pribadi, serta tanggung jawab sebagai sesuatu yang ditentukan oleh kehendak sendiri dari dalam.',
    typicalSubjectiveExperience:
      'Cepat tahu apa yang diinginkan dan apa yang tidak ingin diikuti. Merasa paling nyaman ketika memegang kendali atas langkah hidupnya sendiri, serta mudah terganggu bila ada pihak luar yang mencoba memerintah atau memaksakan kehendak secara sepihak.',
    potentialStrengths: [
      'Ketegasan sikap, kemandirian menentukan arah, dan ketahanan menghadapi tekanan kelompok (peer pressure).',
      'Berani mengambil keputusan sulit saat kelompok terhenti dalam keraguan.',
      'Memiliki kejelasan visi dan batas pribadi yang tegas.',
    ],
    potentialDifficulties: [
      'Terkadang terdengar terlalu memaksakan arah atau kurang memberi ruang bagi suara rekan yang lebih pelan.',
      'Sulit diajak kompromi jika melihat permintaan orang lain sebagai gangguan atas otonomi diri.',
    ],
    reflectiveQuestions: [
      'Ketika berada dalam tim, apakah secara alami aku punya gambaran arah paling tegas dan sulit merasa nyaman jika hanya disuruh mengikuti tanpa kejelasan alasan?',
      'Apakah batas pribadiku atas keputusan hidup hampir tidak pernah berubah hanya karena desakan sosial?',
      'Apakah aku lebih suka mengambil tanggung jawab penuh atas hasil pilihanku daripada bergantung pada keputusan orang lain?',
    ],
    everydayExamples: [
      'Menetapkan target pribadi dalam proyek kelas dan langsung bergerak tanpa menunggu persetujuan panjang.',
      'Menolak dengan tegas pembagian peran yang dirasa tidak sesuai prinsip atau prioritas pribadi.',
    ],
    possibleMisinterpretations:
      'Tidak berarti selalu menjadi ketua kelas yang populer atau selalu bijak dalam memimpin. Seseorang 1V yang belum matang dapat memicu konflik kekuasaan, sementara sikap tegas juga bisa muncul dari Socionics Se atau Enneagram Tipe 8.',
    differencesFromAdjacentPositions:
      'Berbeda dari 2V: 1V berfokus pada kedaulatan kehendak sendiri (kurang tertarik bernegosiasi berlama-lama tentang siapa memimpin apa), sedangkan 2V aktif menumbuhkan rasa kepemilikan bersama dan menghargai kehendak orang lain sama besarnya.',
  },
  '2V': {
    code: '2V',
    aspect: 'V',
    position: 2,
    title: '2V — Kehendak Kedua (Kreatif / Flexible Volition)',
    coreAttitude:
      'Memandang kehendak, kepemimpinan, dan tanggung jawab secara demokratis dan dialogis; yakin terhadap kemampuan diri menentukan pilihan sekaligus menghormati otonomi serta suara orang lain.',
    typicalSubjectiveExperience:
      'Nyaman memimpin saat dibutuhkan maupun menjadi anggota aktif saat orang lain memimpin, asalkan terjalin saling menghargai. Mampu menegosiasikan perbedaan tujuan secara tenang tanpa merasa kehilangan wibawa.',
    potentialStrengths: [
      'Mampu memfasilitasi kesepakatan adil di kelompok dengan mendengarkan suara semua anggota.',
      'Menghormati batas diri sendiri maupun batas orang lain secara seimbang.',
      'Mendorong kemandirian rekan yang masih ragu-ragu mengambil bagian.',
    ],
    potentialDifficulties: [
      'Terkadang terlalu lama mencoba mencari konsensus saat situasi darurat menuntut keputusan cepat sepihak.',
      'Dapat kelelahan jika terus-menerus menjembatani benturan kehendak antara anggota 1V dan 3V.',
    ],
    reflectiveQuestions: [
      'Apakah aku nyaman bernegosiasi menentukan tujuan kelompok agar semua pihak merasa dihargai, bukan sekadar mengikuti atau memaksa?',
      'Apakah aku merasa tetap utuh dan berharga meski keputusanku bukan satu-satunya yang dipakai tim?',
      'Apakah aku aktif mencegah ada anggota yang mendominasi atau terpinggirkan saat memilih peran?',
    ],
    everydayExamples: [
      'Dalam rapat OSIS atau kerja kelompok, memetakan usulan masing-masing anggota lalu menyusun pembagian tugas yang disetujui bersama.',
      'Memberi masukan tegas kepada teman tanpa merendahkan hak pilih teman tersebut.',
    ],
    possibleMisinterpretations:
      'Kesediaan bernegosiasi kadang disalahartikan sebagai kurang tegas atau 4V, padahal 2V punya pendirian kuat sekaligus menghargai hak setara orang lain.',
    differencesFromAdjacentPositions:
      'Berbeda dari 1V: 2V aktif melibatkan kehendak pihak lain dalam proses keputusan. Berbeda dari 3V: 2V tidak merasa wibawanya terancam saat gagasannya dimodifikasi bersama.',
  },
  '3V': {
    code: '3V',
    aspect: 'V',
    position: 3,
    title: '3V — Kehendak Ketiga (Peka / Insecure Volition)',
    coreAttitude:
      'Sangat peka terhadap isu kekuasaan, penilaian diri, otonomi, dan keadilan perlakuan; menginginkan suaranya dihormati dan dianggap mampu, namun mudah merasa tertekan, ragu, atau tersinggung oleh sikap yang terkesan memerintah atau meremehkan.',
    typicalSubjectiveExperience:
      'Sering mengalami tarik-ulur antara keinginan untuk tampil berdaya dan kekhawatiran salah mengambil keputusan. Saat diminta terlalu mendadak atau ditekan oleh otoritas yang kaku, bisa bereaksi pasif-defensif atau justru melawan secara keras.',
    potentialStrengths: [
      'Sangat peka terhadap ketidakadilan atau penyalahgunaan wewenang di kelompok.',
      'Mempertimbangkan dampak dan tanggung jawab keputusan secara mendalam sebelum berkomitmen.',
      'Mampu berjuang sangat gigih membuktikan diri ketika mendapat dukungan yang saling menghormati.',
    ],
    potentialDifficulties: [
      'Mudah merasa terjebak atau tidak berdaya menghadapi nada perintah langsung dari 1V.',
      'Sulit menolak secara tegas di awal, lalu menyimpan rasa tidak nyaman bila batasnya terlewati.',
    ],
    reflectiveQuestions: [
      'Apakah aku sering peka terhadap cara orang lain menyampaikan perintah—merasa nyaman jika diajak berdiskusi setara, namun sangat kesal jika merasa dipaksa atau diremehkan?',
      'Apakah aku kerap meragukan kelayakanku memegang tanggung jawab besar, meski diam-diam ingin berkontribusi berarti?',
      'Apakah kritik terhadap keputusan atau usahaku terasa menyentuh harga diri lebih dalam dibanding kritik teknis biasa?',
    ],
    everydayExamples: [
      'Merasa tertekan saat ditunjuk dadakan menjadi pemimpin kelompok tanpa diberi kejelasan dukungan dan ruang bertanya.',
      'Mempertanyakan keadilan pembagian peran karena merasa kontribusinya tidak dihargai setara oleh koordinator.',
    ],
    possibleMisinterpretations:
      'Sangat sering salah dikira 1V (karena perlawanan defensifnya saat merasa ditekan terlihat keras) atau dikira malas/lemah (padahal beban keraguannya berasal dari kewaspadaan tinggi terhadap evaluasi). Juga bedakan dari pengalaman lingkungan otoriter di rumah/sekolah.',
    differencesFromAdjacentPositions:
      'Berbeda dari 2V: 3V tidak santai menghadapi tarik-menarik kehendak dan mudah merasa terancam oleh tekanan otoritas. Berbeda dari 4V: 3V sangat peduli apakah posisinya dihormati dan sulit bersikap acuh bila perannya diremehkan.',
  },
  '4V': {
    code: '4V',
    aspect: 'V',
    position: 4,
    title: '4V — Kehendak Keempat (Ringan / Unbothered Volition)',
    coreAttitude:
      'Tidak menempatkan kontrol kekuasaan, status kepemimpinan, atau penentuan arah kelompok sebagai fokus ego pribadi; merasa nyaman menyerahkan keputusan koordinasi kepada pihak yang memang ingin memegang peran itu selama batas pribadinya aman.',
    typicalSubjectiveExperience:
      'Merasa hidup jauh lebih efisien ketika tidak harus memperebutkan siapa yang jadi ketua. Bersedia mengikuti kesepakatan bersama dengan ringan hati agar energinya bisa dicurahkan pada hal yang lebih bermakna baginya (seperti L, E, atau F di posisi tinggi).',
    potentialStrengths: [
      'Kooperatif, rendah ego perebutan kuasa, dan menenangkan konflik kepemimpinan di dalam tim.',
      'Adaptif terhadap berbagai gaya koordinasi selama tujuan dan aturannya masuk akal.',
      'Dapat menyelesaikan porsi tugasnya dengan sangat baik tanpa butuh sorotan status.',
    ],
    potentialDifficulties: [
      'Berisiko terlalu mengikuti arus mayoritas atau rekan dominan hingga mengabaikan kebutuhan dirinya sendiri.',
      'Terkadang menunda mengambil keputusan pribadi yang sebenarnya penting karena menunggu dorongan dari luar.',
    ],
    reflectiveQuestions: [
      'Dalam kerja kelompok, apakah aku merasa lega bila ada orang lain yang bersedia mengoordinasi dan membagi jadwal, selama pembagiannya adil?',
      'Apakah aku jarang merasa terganggu secara pribadi ketika keputusanku diubah oleh kesepakatan tim?',
      'Apakah ambisiku lebih terasa lewat minat atau kenyamanan tertentu (L/E/F) daripada keinginan mengarahkan orang lain?',
    ],
    everydayExamples: [
      'Dalam kelompok SMA, berkata "Aku ikut kesepakatan jadwal kalian saja, beri tahu bagian mana yang harus kukerjakan."',
      'Tidak mempermasalahkan posisi struktur kepengurusan kelas asalkan suasana kerja tetap nyaman.',
    ],
    possibleMisinterpretations:
      'Sering dikira tidak punya pendirian atau tidak bertanggung jawab. Padahal 4V tetap memiliki prinsip etis (terutama bila L/E tinggi) dan dapat menolak tegas apabila nilai atau kenyamanan dasarnya benar-benar dilanggar.',
    differencesFromAdjacentPositions:
      'Berbeda dari 3V: 4V tidak cemas memikirkan wibawa atau apakah orang lain memandang dirinya kuat/lemah. Berbeda dari 1V: 4V sama sekali tidak membutuhkan posisi pengendali atas pilihan kelompok.',
  },

  // ================= EMOTION (1E - 4E) =================
  '1E': {
    code: '1E',
    aspect: 'E',
    position: 1,
    title: '1E — Emosi Pertama (Dominan / Confident Emotion)',
    coreAttitude:
      'Menjadikan intensitas perasaan pribadi, ekspresi autentik, dan pengalaman emosional/estetis dari dalam diri sebagai pusat kesadaran yang kuat dan tidak membutuhkan izin lingkungan luar.',
    typicalSubjectiveExperience:
      'Merasakan antusiasme, haru, kegelisahan, atau ketidaksukaan secara sangat penuh dan langsung. Ekspresi emosinya cenderung mengalir kuat apa adanya, dan terasa tidak jujur bila harus berpura-pura datar demi menjaga formalitas semata.',
    potentialStrengths: [
      'Keaslian ekspresi emosi, gairah batin yang kuat dalam berkarya atau menyampaikan pesan, dan kepekaan estetis.',
      'Mampu menghidupkan inspirasi serta keberanian berekspresi dengan tulus.',
      'Jujur terhadap apa yang dirasakan tanpa banyak manipulasi.',
    ],
    potentialDifficulties: [
      'Intensitas reaksi emosional yang mendadak atau dramatis bisa mengejutkan rekan 3E atau terasa melelahkan bagi 4E.',
      'Terkadang terlalu fokus pada apa yang dirasakan sendiri hingga kurang menyesuaikan nada dengan kondisi psikologis lawan bicara.',
    ],
    reflectiveQuestions: [
      'Apakah aku merasakan emosi secara sangat intens dari dalam diri sehingga suasana hati orang lain di sekitarku jarang bisa langsung memadamkan atau mengubah apa yang kurasakan?',
      'Apakah bagiku mengekspresikan perasaan secara jujur jauh lebih penting daripada menjaga suasana tetap netral dan tenang?',
      'Apakah aku sering menilai suatu momen atau karya dari seberapa kuat ia menggugah perasaanku?',
    ],
    everydayExamples: [
      'Menunjukkan antusiasme sangat tinggi atau kekecewaan langsung melalui nada suara dan ekspresi saat diskusi topik yang menyentuh hati.',
      'Membutuhkan ruang ekspresi melalui musik, penulisan kreatif, seni, atau cerita emosional yang mendalam.',
    ],
    possibleMisinterpretations:
      'JANGAN disamakan dengan kecerdasan emosional tinggi, empati otomatis, atau sebaliknya ketidakstabilan klinis. 1E hanya menunjukkan kuat dan yakinnya arus emosi internal—bisa sangat berempati maupun terkadang kurang membaca batas emosi orang lain.',
    differencesFromAdjacentPositions:
      'Berbeda dari 2E: 1E lebih berorientasi pada intensitas emosi diri sendiri (monologis), sedangkan 2E lebih berorientasi membangun jembatan suasana timbal balik (dialogis) dengan orang lain.',
  },
  '2E': {
    code: '2E',
    aspect: 'E',
    position: 2,
    title: '2E — Emosi Kedua (Kreatif / Flexible Emotion)',
    coreAttitude:
      'Memandang emosi sebagai bahasa komunikasi dan penghubung antarmanusia; nyaman mengekspresikan perasaan secara hangat sekaligus terampil membaca, menampung, dan menyesuaikan suasana emosional bersama.',
    typicalSubjectiveExperience:
      'Mudah merasakan suasana canggung dalam ruangan dan berinisiatif mencairkannya lewat humor, kehangatan, atau sapaan empatik. Tidak mudah panik menghadapi tangisan, kemarahan, atau kekhawatiran teman.',
    potentialStrengths: [
      'Kemampuan alami membangun kehangatan sosial, mendorong keterlibatan kelompok, dan memvalidasi perasaan orang lain.',
      'Mampu memodulasi nada suara agar kritik tetap diterima tanpa melukai.',
      'Membuat rekan 3E merasa lebih aman membuka diri.',
    ],
    potentialDifficulties: [
      'Terkadang terlalu sering memancing tanggapan emosional dari rekan 3E atau 4E yang sedang ingin bekerja secara tenang tanpa basa-basi perasaan.',
      'Dapat mengorbankan fokus tugas jika suasana hati kelompok terlalu lama dibahas.',
    ],
    reflectiveQuestions: [
      'Apakah aku merasa nyaman menyesuaikan nada ekspresiku (hangat, bercanda, atau serius) tergantung kebutuhan emosional orang di hadapanku?',
      'Apakah aku senang mendengarkan curhat atau perasaan teman tanpa merasa canggung atau bingung harus merespons bagaimana?',
      'Apakah suasana kelompok yang hangat terasa sebagai bagian penting dari kerja sama yang sehat?',
    ],
    everydayExamples: [
      'Mengawali rapat kelompok yang tegang dengan candaan ringan lalu memastikan semua anggota merasa nyaman berpendapat.',
      'Menghibur teman yang kecewa setelah nilai ujian turun dengan kalimat validasi sebelum masuk ke solusi teknis.',
    ],
    possibleMisinterpretations:
      'Jangan disamakan dengan kepribadian ceria terus-menerus atau selalu "ekstrovert". Orang introver pun bisa memiliki 2E dan hangat dalam interaksi personal atau kelompok kecil.',
    differencesFromAdjacentPositions:
      'Berbeda dari 1E: 2E sangat memperhatikan umpan balik emosional orang lain dan mengatur ekspresinya secara interaktif. Berbeda dari 3E: 2E tidak merasa canggung atau terancam saat situasi emosional menjadi terbuka.',
  },
  '3E': {
    code: '3E',
    aspect: 'E',
    position: 3,
    title: '3E — Emosi Ketiga (Peka / Insecure Emotion)',
    coreAttitude:
      'Memiliki kesadaran dan kewaspadaan tinggi terhadap ekspresi emosi dan iklim sosial; mendambakan kehangatan serta penerimaan tulus, namun mudah merasa canggung, rentan, atau takut tampak terlalu berlebihan/dingin di hadapan orang lain.',
    typicalSubjectiveExperience:
      'Sering menahan ekspresi perasaan di lingkungan baru sambil mengamati apakah aman untuk terbuka. Mudah terganggu bila ada orang meluapkan emosi terlalu keras secara tiba-tiba, atau bila seseorang menuntutnya "harus lebih ceria/ekspresif" di depan umum.',
    potentialStrengths: [
      'Kepekaan halus terhadap ketulusan nada bicara dan nuansa emosional tersembunyi.',
      'Mampu menjaga ketenangan sikap di ruang publik dan tidak memaksakan drama pada orang lain.',
      'Menciptakan ikatan sangat tulus dan mendalam ketika sudah berada di ruang aman tepercaya.',
    ],
    potentialDifficulties: [
      'Canggung saat harus memberi dukungan emosional spontan di depan ramai.',
      'Sering salah dibaca sebagai "dingin" atau "tidak peduli" oleh tipe ekspresif, padahal di dalam dirinya bisa merasakan emosi secara mendalam.',
    ],
    reflectiveQuestions: [
      'Apakah aku sering ragu bagaimana cara mengekspresikan simpati atau rasa senang di depan orang lain agar tidak terasa kaku atau berlebihan?',
      'Apakah suasana emosional yang terlalu ramai atau dramatis cepat membuatku lelah atau ingin menjaga jarak?',
      'Apakah aku lebih nyaman berbagi perasaan secara tulus dengan satu-dua teman dekat daripada di hadapan kelas?',
    ],
    everydayExamples: [
      'Merasa kikuk ketika diminta memberi kata-kata penyemangat penuh drama di depan kelas, lalu memilih membantu teman lewat tindakan atau pesan teks pribadi.',
      'Sangat peka menangkap perubahan nada bicara teman dekat meski teman itu bilang "tidak apa-apa".',
    ],
    possibleMisinterpretations:
      'Posisi 3E BUKAN gangguan kecemasan sosial ataupun ketidakmampuan berempati. Bedakan pula dari budaya keluarga yang memang jarang membicarakan emosi secara terbuka.',
    differencesFromAdjacentPositions:
      'Berbeda dari 2E: 3E tidak spontan mengolah suasana emosional publik secara bebas karena disertai kewaspadaan internal. Berbeda dari 4E: 3E jauh lebih sering memikirkan apakah ekspresi emosinya sudah pas atau diterima.',
  },
  '4E': {
    code: '4E',
    aspect: 'E',
    position: 4,
    title: '4E — Emosi Keempat (Ringan / Unbothered Emotion)',
    coreAttitude:
      'Bersikap ringan dan hemat energi dalam urusan ekspresi emosi; tidak menjadikan intensitas suasana hati sebagai pusat penilaian, dan cenderung menyesuaikan atau menerima iklim emosional yang tenang/sehat dari lingkungan sekitar.',
    typicalSubjectiveExperience:
      'Jarang mengalami gejolak emosional yang berkepanjangan hanya karena perbedaan gaya bicara. Saat berhadapan dengan teman yang sangat ekspresif, bisa ikut menikmati atau tetap tenang tanpa merasa perlu mengimbangi dengan drama serupa.',
    potentialStrengths: [
      'Menjadi penyeimbang yang tenang ketika diskusi memanas atau dipenuhi kepanikan.',
      'Mudah diajak bekerja sama secara objektif tanpa baper berkepanjangan.',
      'Menerima keragaman gaya ekspresi teman tanpa banyak menuntut.',
    ],
    potentialDifficulties: [
      'Terkadang kurang menyadari bahwa lawan bicara sangat membutuhkan validasi perasaan sebelum langsung diberi solusi praktis.',
      'Dapat tampak kurang antusias secara ekspresi wajah meskipun sebenarnya menghargai proyek atau pertemanan tersebut.',
    ],
    reflectiveQuestions: [
      'Apakah aku jarang memikirkan ekspresi emosiku sendiri maupun menuntut orang lain harus selalu peka terhadap suasana hatiku?',
      'Saat orang di sebelahku sangat bersemangat atau agak kesal, apakah perasaanku lebih cenderung tetap stabil atau sekadar mengikuti suasana sebentar lalu cepat kembali netral?',
      'Apakah aku lebih sering menunjukkan kepedulian lewat tindakan konkret, logika membantu, atau dukungan nyata daripada kalimat emosional?',
    ],
    everydayExamples: [
      'Saat terjadi perbedaan pendapat di kelas, tetap bersuara datar dan fokus pada solusi kerja tanpa terbawa ketegangan berhari-hari.',
      'Tidak tersinggung bila teman mengirim pesan chat singkat tanpa emoji.',
    ],
    possibleMisinterpretations:
      'Sering dikira tidak berperasaan atau dingin. Padahal individu 4E tetap memiliki kasih sayang, kesetiaan, dan nilai moral yang kuat—hanya tidak menjadikannya panggung utama kesadaran harian.',
    differencesFromAdjacentPositions:
      'Berbeda dari 3E: 4E tidak canggung atau cemas memikirkan penilaian emosional orang lain. Berbeda dari 1E: 4E tidak dikendalikan oleh arus emosi pribadi yang intens.',
  },

  // ================= PHYSICS (1F - 4F) =================
  '1F': {
    code: '1F',
    aspect: 'F',
    position: 1,
    title: '1F — Fisika Pertama (Dominan / Confident Physics)',
    coreAttitude:
      'Menjadikan kenyamanan tubuh, realitas materi, kualitas sensorik, dan preferensi fisik pribadi sebagai standar mandiri yang jelas dan tegas.',
    typicalSubjectiveExperience:
      'Sangat peka dan tahu persis apa yang terasa nyaman bagi tubuhnya—mulai dari rasa makanan, kerapian meja, pencahayaan ruangan, hingga keawetan barang. Tidak mudah dibujuk mengorbankan kenyamanan fisik atau kepemilikannya demi alasan abstrak semata.',
    potentialStrengths: [
      'Kesadaran tinggi terhadap kebutuhan fisik nyata, kualitas material, dan penguasaan sumber daya praktis.',
      'Realistis, membumi, dan pandai menciptakan kenyamanan konkret bagi diri sendiri.',
      'Jelas menetapkan batas atas barang pribadi, ruang kerja, dan kondisi istirahat.',
    ],
    potentialDifficulties: [
      'Bisa tampak sangat pilih-pilih atau sulit berkompromi terkait tempat, makanan, maupun pengaturan ruang bersama.',
      'Terkadang terlalu mendahulukan kenyamanan fisik saat tugas menuntut adaptasi di kondisi serba terbatas.',
    ],
    reflectiveQuestions: [
      'Apakah aku memiliki preferensi sangat jelas soal kenyamanan ruang, makanan, barang, dan penampilan yang sulit diganggu gugat orang lain?',
      'Apakah gangguan fisik seperti ruang terlalu panas, lapar, atau barang dipakai tanpa izin langsung menyita fokusku?',
      'Apakah keputusan praktisku sering berangkat dari apa yang paling nyaman, terasa nyata, dan fungsional bagiku?',
    ],
    everydayExamples: [
      'Membawa perlengkapan belajar yang paling nyaman dipakai sendiri dan menjaga meja kerja kelas tetap sesuai selera pribadi.',
      'Memilih lokasi kerja kelompok dengan mempertimbangkan ketersediaan tempat duduk nyaman, makanan, dan suasana fisik yang enak.',
    ],
    possibleMisinterpretations:
      'INGAT: F adalah Physics, bukan Feeling. 1F juga BUKAN berarti kaya, kuat secara atletik, atau selalu tampil modis—melainkan berpendirian tegas atas kenyamanan fisik dan dunia materi pribadinya.',
    differencesFromAdjacentPositions:
      'Berbeda dari 2F: 1F berpusat pada kenyamanan serta standar fisik dirinya sendiri, sedangkan 2F senang mengolah ruang fisik, aktivitas, dan kenyamanan secara kolaboratif bersama orang lain.',
  },
  '2F': {
    code: '2F',
    aspect: 'F',
    position: 2,
    title: '2F — Fisika Kedua (Kreatif / Flexible Physics)',
    coreAttitude:
      'Memandang aktivitas fisik, dunia materi, estetika praktis, dan perawatan lingkungan sebagai ruang interaksi yang menyenangkan, aktif, dan penuh keluwesan bersama orang lain.',
    typicalSubjectiveExperience:
      'Senang menata barang, menyiapkan konsumsi, membantu merapikan alat praktikum, atau mengajak teman bergerak/beraktivitas nyata dengan santai. Tidak canggung membicarakan soal penampilan, olahraga, makanan, maupun pengaturan kerja teknis.',
    potentialStrengths: [
      'Cekatan secara praktis, penuh perhatian pada kenyamanan fisik anggota kelompok, dan terampil menggerakkan kerja lapangan.',
      'Luwes menyesuaikan standar fisik dengan kondisi teman tanpa menghakimi.',
      'Energi sehat dalam menjaga kerapian, logistik acara sekolah, dan keseimbangan istirahat.',
    ],
    potentialDifficulties: [
      'Terkadang kelewat aktif menawarkan bantuan praktis/fisik atau komentar gaya hidup kepada rekan 3F yang sedang sensitif.',
      'Bisa kurang sabar menghadapi rapat yang hanya berteori tanpa satu pun langkah nyata.',
    ],
    reflectiveQuestions: [
      'Apakah aku merasa senang dan berenergi saat terlibat mengurus hal konkret (logistik, alat praktikum, dekorasi, memasak, atau aktivitas fisik) bersama teman?',
      'Apakah aku cukup luwes beradaptasi dengan selera fisik orang lain sambil tetap aktif menjaga kenyamanan bersama?',
      'Apakah kritik soal kerapian atau keterampilan praktisku lebih mudah kujadikan bahan perbaikan daripada menjadi beban batin?',
    ],
    everydayExamples: [
      'Mengambil inisiatif mengatur perlengkapan presentasi, kabel proyektor, dan tata letak bangku agar kerja tim berjalan lancar.',
      'Senang berbagi bekal atau mengajak teman istirahat makan sebelum melanjutkan diskusi tugas.',
    ],
    possibleMisinterpretations:
      'Bukan sekadar rajin bersih-bersih atau hobi olahraga; ciri utamanya adalah rasa nyaman dan keterlibatan aktif-dialogis dalam urusan fisik-material bersama orang lain.',
    differencesFromAdjacentPositions:
      'Berbeda dari 1F: 2F fokus pada proses beraktivitas dan berbagi ruang fisik bersama orang lain. Berbeda dari 3F: 2F tidak dibayangi kecemasan atas penampilan atau kemampuan fisiknya.',
  },
  '3F': {
    code: '3F',
    aspect: 'F',
    position: 3,
    title: '3F — Fisika Ketiga (Peka / Insecure Physics)',
    coreAttitude:
      'Memiliki kesadaran dan sensitivitas tinggi terhadap kondisi tubuh, penampilan, kebersihan, kemampuan fisik, dan hal-hal material; sering menginginkan kerapian serta kenyamanan, namun mudah merasa kurang percaya diri atau tertekan saat dikomentari.',
    typicalSubjectiveExperience:
      'Bisa sangat teliti merawat kerapian atau justru merasa canggung bila penampilan, tulisan tangan, hasil prakarya, atau kondisi fisiknya diperhatikan dan dinilai orang lain. Lingkungan fisik yang berantakan atau kritik blak-blakan soal tubuh/barang dapat memicu rasa tidak nyaman mendalam.',
    potentialStrengths: [
      'Perhatian tinggi terhadap detail estetika, kebersihan, serta pencegahan ketidaknyamanan fisik.',
      'Mampu menjaga barang dengan sangat hati-hati atau menyusun standar kerja rapi ketika diberi kendali ruang pribadi.',
      'Empatik terhadap teman yang merasa tidak nyaman secara fisik.',
    ],
    potentialDifficulties: [
      'Sensitif terhadap candaan tentang penampilan, postur, kelelahan fisik, atau kecanggungan motorik.',
      'Cepat merasa terbebani ketika tugas lapangan/praktikum menuntut improvisasi fisik di bawah sorotan orang banyak.',
    ],
    reflectiveQuestions: [
      'Apakah komentar santai orang lain mengenai penampilan, kerapian, makanan, atau ketangkasan fisikku lebih mudah membuatku merasa tidak nyaman atau waspada?',
      'Apakah aku sering berusaha ekstra keras memastikan aspek fisik/materiku tampak aman agar tidak dikritik, namun tetap merasa kurang puas?',
      'Apakah ruang fisik yang terlalu semrawut atau sentuhan mendadak mudah menguras energiku?',
    ],
    everydayExamples: [
      'Merasa sangat tidak nyaman saat teman berkomentar langsung soal pakaian atau kerapian tas meski berniat bercanda.',
      'Gugup saat praktik olahraga atau demonstrasi alat laboratorium di depan seluruh kelas karena takut terlihat canggung.',
    ],
    possibleMisinterpretations:
      '3F BUKAN berarti tidak sehat, ceroboh, atau tidak rapi—justru banyak orang 3F sangat rapi dan sadar estetika! Juga bedakan dari faktor kesehatan fisik nyata atau tekanan sosial remaja pada umumnya.',
    differencesFromAdjacentPositions:
      'Berbeda dari 2F: 3F mengalami kerentanan dan beban evaluasi di ranah fisik-praktis. Berbeda dari 4F: 3F tidak mudah bersikap cuek terhadap kondisi penampilan atau kritik material.',
  },
  '4F': {
    code: '4F',
    aspect: 'F',
    position: 4,
    title: '4F — Fisika Keempat (Ringan / Unbothered Physics)',
    coreAttitude:
      'Menempatkan urusan kenyamanan fisik, detail materi, dan kepemilikan benda pada prioritas paling ringan; fokus pada kebutuhan dasar yang cukup agar energi bisa digunakan untuk logika, tujuan, atau emosi.',
    typicalSubjectiveExperience:
      'Mudah beradaptasi di ruang sederhana, tidak terlalu rewel soal variasi makanan atau dekorasi, dan terkadang baru sadar lapar atau lelah setelah sangat asyik membaca/berdiskusi. Tidak mengambil hati koreksi ringan soal kerapian.',
    potentialStrengths: [
      'Sangat adaptif dalam kondisi keterbatasan fasilitas dan tidak rewel terhadap hal material.',
      'Hemat energi dari kekhawatiran berlebihan soal status barang atau penampilan mewah.',
      'Cepat merasa cukup dengan solusi praktis yang sederhana.',
    ],
    potentialDifficulties: [
      'Rentan mengabaikan sinyal istirahat tubuh, pola makan teratur, atau kerapian dokumen tugas bila terlalu larut dalam ide/perasaan.',
      'Dapat kurang peka bahwa rekan 1F atau 3F merasa terganggu oleh kondisi ruangan yang berantakan.',
    ],
    reflectiveQuestions: [
      'Apakah saat fokus pada topik yang menarik (misalnya membaca, berdiskusi, atau mengejar target), aku mudah lupa waktu makan, suhu ruangan, atau detail barang di sekitarku?',
      'Apakah aku jarang merasa perlu mengatur tampilan ruang/materi secara rumit selama fungsinya berjalan?',
      'Apakah aku bersikap santai mengikuti pilihan tempat makan atau tempat kerja yang dipilih teman-teman?',
    ],
    everydayExamples: [
      'Tetap fokus berdiskusi kelompok dengan duduk di lantai perpustakaan atau sudut kelas tanpa memusingkan kenyamanan kursi.',
      'Menyerahkan urusan desain logistik dan konsumsi acara kepada rekan yang lebih berminat.',
    ],
    possibleMisinterpretations:
      '4F BUKAN berarti tidak peduli kesehatan atau pasti berantakan. Banyak individu 4F tetap menjaga kebersihan dan kebugaran sebagai rutinitas sederhana (hasil ringkas) tanpa menjadikannya obsesi ego.',
    differencesFromAdjacentPositions:
      'Berbeda dari 3F: 4F tidak merasa terancam atau cemas saat urusan fisik/penampilannya dikomentari secara ringan. Berbeda dari 1F: 4F tidak menuntut kondisi fisik/material spesifik sesuai selera pribadi.',
  },
};

export interface PsychosophyTypeSpec {
  code: string;
  order: [PsychosophyAspect, PsychosophyAspect, PsychosophyAspect, PsychosophyAspect];
  afanasyevNickname: string;
  alternateHistoricalNotes?: string;
  attitudinalPsycheClub: string;
  overview: string;
  positionalSynthesis: string;
}

export const ALL_24_PSYCHOSOPHY_TYPES: PsychosophyTypeSpec[] = [
  {
    code: 'LVEF',
    order: ['L', 'V', 'E', 'F'],
    afanasyevNickname: 'Einstein',
    attitudinalPsycheClub: 'Sextet Inquisitive / Logika-Kehendak Result-Process',
    overview:
      'Mengutamakan ketepatan analisis mandiri (1L) yang didukung otonomi kolaboratif dan tenang dalam mengambil tanggung jawab (2V), dengan kepekaan hati-hati atas ekspresi emosi (3E) serta fokus material yang simpel (4F).',
    positionalSynthesis:
      '1L memberi kepastian kerangka berpikir dari dalam, lalu 2V menjembatani ide itu agar bisa dinegosiasikan dengan adil bersama orang lain. Karena 3E berhati-hati dalam suasana emosional terbuka dan 4F ringan terhadap urusan materi, pendekatan paling nyaman adalah diskusi bermakna yang tenang dan tidak dramatis.',
  },
  {
    code: 'LEVF',
    order: ['L', 'E', 'V', 'F'],
    afanasyevNickname: 'Pascal',
    attitudinalPsycheClub: 'Sextet Philosophic / Logika-Emosi Terhubung',
    overview:
      'Menyatukan ketegasan prinsip logis (1L) dengan kehangatan dan keterbukaan ekspresi emosional (2E), sambil menjaga kewaspadaan terhadap tekanan otoritas atau keputusan sepihak (3V) dan kesederhanaan fisik (4F).',
    positionalSynthesis:
      '1L dan 2E bekerja beriringan: gagasan serius dapat disampaikan dengan intonasi hangat dan menggugah. Namun ketika rekan memaksakan perintah tanpa dialog, 3V dapat cepat terpicu defensif atau ragu; 4F membuat kebutuhan material jarang menjadi penghalang utama.',
  },
  {
    code: 'LVFE',
    order: ['L', 'V', 'F', 'E'],
    afanasyevNickname: 'Lao Tzu',
    attitudinalPsycheClub: 'Sextet Pragmatic-Inquisitive / Fokus Logika & Otonomi',
    overview:
      'Berdiri kuat di atas kesimpulan intelektual mandiri (1L) dan pengarahan kehendak yang luwes serta menghargai batas (2V), dengan kewaspadaan di ranah fisik-praktis (3F) dan ketenangan emosional berjarak (4E).',
    positionalSynthesis:
      '1L + 2V membentuk pemikir strategis yang tenang dan diplomatis dalam keputusan. Sementara itu, 3F membuat kenyamanan ruang dan komentar fisik perlu dihormati secara halus, dan 4E membiarkan dinamika suasana hati berjalan tanpa banyak drama.',
  },
  {
    code: 'LEFV',
    order: ['L', 'E', 'F', 'V'],
    afanasyevNickname: 'Augustine',
    attitudinalPsycheClub: 'Sextet Reflective / Logika-Emosi dengan Kehendak Ringan',
    overview:
      'Memadukan keyakinan berpikir filosofis-konseptual (1L) dan kepekaan dialogis terhadap perasaan orang lain (2E), disertai kecermatan tinggi pada detail fisik-kenyamanan (3F) dan sikap rendah ego terhadap kekuasaan (4V).',
    positionalSynthesis:
      '1L menjadi jangkar prinsip, sedangkan 2E mengekspresikan ide dengan sentuhan empati. Energi tidak dihabiskan untuk berebut kepemimpinan (4V), namun 3F tetap membutuhkan ruang kerja fisik yang terjaga dari gangguan mendadak.',
  },
  {
    code: 'LFVE',
    order: ['L', 'F', 'V', 'E'],
    afanasyevNickname: 'Plato',
    attitudinalPsycheClub: 'Sextet Structured-Realist / Logika & Aksi Praktis',
    overview:
      'Menggabungkan kepastian konsep internal (1L) dengan kecekatan kerja nyata dan pengaturan materi secara aktif bersama orang lain (2F), sembari berhati-hati atas kendali kehendak (3V) dan tenang secara emosi (4E).',
    positionalSynthesis:
      '1L memetakan sistem pemikiran, lalu 2F mewujudkannya lewat tindakan praktis yang bisa dilihat bersama. Kewaspadaan 3V menuntut pembagian peran yang adil dan tanpa pemaksaan, sementara 4E menjaga suasana tetap tidak emosional.',
  },
  {
    code: 'LFEV',
    order: ['L', 'F', 'E', 'V'],
    afanasyevNickname: 'Berthier',
    alternateHistoricalNotes: 'Dalam beberapa daftar komunitas juga disebut Berdyayev.',
    attitudinalPsycheClub: 'Sextet Realist-Gentle / Logika, Praktis & Kehendak Ringan',
    overview:
      'Mengandalkan kerangka berpikir mandiri (1L) dan kemampuan mengurus hal-hal konkret secara luwes (2F), dengan sisi batin emosional yang sensitif (3E) serta sikap kooperatif tanpa perebutan kuasa (4V).',
    positionalSynthesis:
      '1L dan 2F membuat pola kerjanya jelas antara gagasan dan pelaksanaan nyata. Ketegangan lebih sering muncul bila suasana emosional terlalu menekan atau memaksa keterbukaan cepat (3E), sementara dalam peran kelompok (4V) ia cenderung menghindari konflik wewenang.',
  },
  {
    code: 'VLEF',
    order: ['V', 'L', 'E', 'F'],
    afanasyevNickname: 'Socrates',
    attitudinalPsycheClub: 'Sextet Strategic-Inquisitive / Kehendak & Dialog Logika',
    overview:
      'Menyatukan ketegasan arah tujuan dan kemandirian keputusan (1V) dengan kemampuan berdiskusi intelektual yang terbuka dan dialogis (2L), disertai kehati-hatian pada ranah ekspresi emosi (3E) dan kesederhanaan fisik (4F).',
    positionalSynthesis:
      '1V menetapkan arah besar dan tidak mudah goyah, namun 2L tetap membuka ruang tanya-jawab logis sehingga keputusan bisa diuji bersama. Karena 3E peka terhadap drama emosional dan 4F ringan terhadap kenyamanan materi, diskusi efektif paling cocok berfokus pada alasan dan tujuan.',
  },
  {
    code: 'VLFE',
    order: ['V', 'L', 'F', 'E'],
    afanasyevNickname: 'Lenin',
    attitudinalPsycheClub: 'Sextet Executive-Inquisitive / Kehendak & Strategi Logis',
    overview:
      'Berfokus pada ketegasan kehendak dan eksekusi keputusan (1V) yang dijelaskan melalui argumentasi logis aktif (2L), dengan kepekaan tinggi terhadap kondisi fisik-materi (3F) dan jarak ringan atas atmosfer emosional (4E).',
    positionalSynthesis:
      'Kombinasi 1V + 2L tangguh dalam merumuskan langkah dan membela alasannya lewat diskusi terbuka. Sisi sensitif 3F membuat kritik soal kerapian atau kelelahan tubuh mudah terasa mengganggu, sementara 4E jarang memprioritaskan pengelolaan emosi berlarut-larut.',
  },
  {
    code: 'VELF',
    order: ['V', 'E', 'L', 'F'],
    afanasyevNickname: 'Akhmatova',
    attitudinalPsycheClub: 'Sextet Expressive-Will / Kehendak & Kehangatan Emosi',
    overview:
      'Menggabungkan ketetapan arah pribadi yang tegas (1V) dengan kemampuan menggerakkan dan menyentuh suasana emosional secara dialogis (2E), diiringi kewaspadaan terhadap uji logika mendadak (3L) dan fokus fisik yang ringan (4F).',
    positionalSynthesis:
      '1V memberi keyakinan langkah sementara 2E menjalin kedekatan dan semangat dengan orang lain. Namun ketika argumen teoretisnya dipertanyakan dengan nada meremehkan, 3L cepat merasa waspada; 4F membuat detail materi tidak menjadi pusat perhatian.',
  },
  {
    code: 'VEFL',
    order: ['V', 'E', 'F', 'L'],
    afanasyevNickname: 'Tolstoy',
    attitudinalPsycheClub: 'Sextet Charismatic-Relational / Kehendak & Emosi',
    overview:
      'Berdiri di atas otoritas kehendak dan prinsip pribadi (1V) yang disalurkan melalui kehangatan komunikasi emosional (2E), disertai perhatian sensitif pada kondisi fisik-praktis (3F) dan pendekatan pragmatis terhadap teori abstrak (4L).',
    positionalSynthesis:
      '1V + 2E menciptakan pengaruh sosial yang kuat, hangat, sekaligus berpendirian keras. Ketegangan sering berkaitan dengan kenyamanan fisik atau komentar atas hal material (3F), sedangkan perdebatan konseptual berlarut tidak diprioritaskan (4L).',
  },
  {
    code: 'VFLE',
    order: ['V', 'F', 'L', 'E'],
    afanasyevNickname: 'Napoleon',
    attitudinalPsycheClub: 'Sextet Action-Will / Kehendak & Eksekusi Fisik',
    overview:
      'Menyatukan ketegasan arah kehendak pribadi (1V) dengan keluwesan bertindak di dunia nyata dan menggerakkan sumber daya fisik (2F), sambil berhati-hati saat masuk ke perdebatan teori rumit (3L) dan ringan terhadap isu emosi (4E).',
    positionalSynthesis:
      '1V dan 2F membentuk orientasi eksekusi yang sangat konkret dan berdaya gerak tinggi. Bila diajak menguji ketelitian premis abstrak secara tajam (3L), dapat timbul rasa defensif, sedangkan dinamika emosional (4E) ditangani secara ringkas.',
  },
  {
    code: 'VFEL',
    order: ['V', 'F', 'E', 'L'],
    afanasyevNickname: 'Tvardovsky',
    alternateHistoricalNotes: 'Dalam beberapa sumber berbahasa Inggris juga muncul variasi label seperti Zhukov.',
    attitudinalPsycheClub: 'Sextet Pragmatic-Will / Arah Tegas & Kerja Nyata',
    overview:
      'Memadukan ketegasan penentuan arah diri (1V) dengan kecekatan mengurus kebutuhan fisik-praktis bersama orang lain (2F), sementara ranah ekspresi perasaan (3E) lebih berhati-hati dan teori abstrak (4L) diperlakukan praktis.',
    positionalSynthesis:
      '1V + 2F unggul dalam organisasi lapangan yang nyata dan langsung terasa manfaatnya. Kebutuhan emosional yang terlalu mendesak dapat membuat 3E canggung, dan diskusi panjang konseptual (4L) lebih sering diringkas menuju aksi.',
  },
  {
    code: 'ELVF',
    order: ['E', 'L', 'V', 'F'],
    afanasyevNickname: 'Andersen',
    attitudinalPsycheClub: 'Sextet Idealistic-Inquisitive / Emosi & Eksplorasi Logika',
    overview:
      'Mengutamakan kedalaman penghayatan emosional-estetis dari dalam diri (1E) bersama keingintahuan dialogis atas gagasan serta penalaran (2L), disertai kepekaan terhadap tekanan kehendak (3V) dan sikap ringan atas materi (4F).',
    positionalSynthesis:
      '1E memberi warna batin dan ketulusan makna, sedangkan 2L menyalurkannya menjadi refleksi atau percakapan intelektual yang kreatif. Karena 3V rentan terhadap perintah sepihak, komunikasi yang hormat tanpa pemaksaan sangat menentukan rasa aman (4F tidak menuntut banyak kenyamanan materi).',
  },
  {
    code: 'ELFV',
    order: ['E', 'L', 'F', 'V'],
    afanasyevNickname: 'Rousseau',
    attitudinalPsycheClub: 'Sextet Humanist-Philosophic / Emosi, Logika & Kehendak Ringan',
    overview:
      'Menyatukan kejujuran arus emosi pribadi (1E) dan diskusi ide yang luwes (2L), dengan kesadaran cermat atas kenyamanan fisik (3F) dan keterbukaan kooperatif mengikuti kesepakatan peran (4V).',
    positionalSynthesis:
      '1E + 2L mampu mengartikulasikan perasaan batin melalui pemikiran yang rapi. Tidak adanya dorongan merebut dominasi kuasa (4V) memudahkan kerja sama, selama ruang fisik (3F) tetap terjaga nyaman dan tidak dikritik kasar.',
  },
  {
    code: 'EVLF',
    order: ['E', 'V', 'L', 'F'],
    afanasyevNickname: 'Ghazali',
    alternateHistoricalNotes: 'Merujuk pada filsuf Al-Ghazali dalam daftar klasik Afanasyev.',
    attitudinalPsycheClub: 'Sextet Inspiring-Relational / Emosi & Otonomi Dialogis',
    overview:
      'Menggabungkan intensitas penghayatan emosi pribadi (1E) dengan keberanian bernegosiasi tujuan secara bermartabat dan adil (2V), sambil bersikap waspada pada pembuktian logika ketat (3L) dan santai soal materi (4F).',
    positionalSynthesis:
      '1E dan 2V melahirkan dorongan kuat memperjuangkan nilai kemanusiaan secara dialogis. Kritik yang memukul celah argumen dengan nada dingin mudah menyentuh sensitivitas 3L, sehingga klarifikasi intelektual perlu dilakukan secara suportif (4F jarang menuntut fasilitas mewah).',
  },
  {
    code: 'EVFL',
    order: ['E', 'V', 'F', 'L'],
    afanasyevNickname: 'Pasternak',
    attitudinalPsycheClub: 'Sextet Lyrical-Will / Emosi, Negosiasi & Kepekaan Fisik',
    overview:
      'Berpusat pada kedalaman perasaan dan estetika batin (1E) serta kemauan kolaboratif menata arah bersama (2V), dengan perhatian peka terhadap kualitas fisik-lingkungan (3F) dan pendekatan teori yang praktis (4L).',
    positionalSynthesis:
      '1E + 2V membawa semangat empatik sekaligus kemampuan membangun kesepakatan kelompok. Tantangan muncul saat berhadapan dengan ketidaknyamanan fisik atau komentar atas penampilan/kerapian (3F), sedangkan perdebatan konseptual abstrak tidak diambil pusing (4L).',
  },
  {
    code: 'EFLV',
    order: ['E', 'F', 'L', 'V'],
    afanasyevNickname: 'Bukharin',
    attitudinalPsycheClub: 'Sextet Sensory-Expressive / Emosi & Kehangatan Praktis',
    overview:
      'Menyatukan ekspresi emosi internal yang hidup (1E) dengan keterlibatan aktif merawat suasana fisik serta kebersamaan nyata (2F), disertai kehati-hatian pada kritik logis (3L) dan kehendak yang adaptif (4V).',
    positionalSynthesis:
      '1E dan 2F menghadirkan kehangatan emosional sekaligus tindakan praktis yang membumi. Di ruang akademik, kritik langsung terhadap struktur logika (3L) butuh penyampaian ramah, sementara peran koordinator formal tidak terlalu diperebutkan (4V).',
  },
  {
    code: 'EFVL',
    order: ['E', 'F', 'V', 'L'],
    afanasyevNickname: 'Pushkin',
    attitudinalPsycheClub: 'Sextet Artistic-Vital / Emosi, Fisik & Kepekaan Otonomi',
    overview:
      'Menggabungkan arus perasaan autentik (1E) dan energi aktif menikmati serta berbagi pengalaman fisik-material (2F), dengan kesadaran sensitif terhadap tekanan kehendak (3V) dan kesederhanaan terhadap perdebatan teori (4L).',
    positionalSynthesis:
      '1E + 2F penuh daya hidup dan ekspresi konkret. Namun nada memerintah atau meremehkan kebebasan pilihannya mudah menyentuh 3V, sementara pembahasan teori panjang tanpa implikasi langsung cenderung cepat ditinggalkan (4L).',
  },
  {
    code: 'FLEV',
    order: ['F', 'L', 'E', 'V'],
    afanasyevNickname: 'Epicurus',
    attitudinalPsycheClub: 'Sextet Grounded-Inquisitive / Fisik Realistis & Dialog Logika',
    overview:
      'Mengutamakan kejelasan kenyamanan fisik dan realitas konkret (1F) bersama keterbukaan diskusi nalar yang santai dan objektif (2L), dengan kehati-hatian terhadap tuntutan emosi intens (3E) dan sikap ringan pada status kuasa (4V).',
    positionalSynthesis:
      '1F menjaga pijakan pada kenyataan praktis, sementara 2L membuat pembahasan gagasan berlangsung jernih dan kolaboratif. Tekanan drama emosional membuat 3E berjarak, dan dalam pembagian peran kelompok 4V lebih suka mengikuti alur yang efisien tanpa perebutan kuasa.',
  },
  {
    code: 'FLVE',
    order: ['F', 'L', 'V', 'E'],
    afanasyevNickname: 'Aristippus',
    attitudinalPsycheClub: 'Sextet Pragmatic-Realist / Fisik, Logika & Kepekaan Otonomi',
    overview:
      'Berdiri di atas standar kenyamanan dan efisiensi fisik pribadi (1F) yang diperkuat oleh diskusi logis yang luwes (2L), dengan kepekaan tinggi terhadap pembatasan otonomi (3V) dan ekspresi emosi yang tenang (4E).',
    positionalSynthesis:
      '1F + 2L berpikir sangat realistis dan pandai menimbang manfaat konkret suatu gagasan. Ia tidak senang diarahkan secara paksa tanpa penjelasan adil (3V), sementara fluktuasi suasana emosional jarang menjadi fokus utamanya (4E).',
  },
  {
    code: 'FVLE',
    order: ['F', 'V', 'L', 'E'],
    afanasyevNickname: 'Goethe',
    attitudinalPsycheClub: 'Sextet Executive-Realist / Fisik Mandiri & Kehendak Kolaboratif',
    overview:
      'Menyatukan kemandirian atas kenyamanan dan sumber daya fisik (1F) dengan kemampuan mengoordinasi serta menegosiasikan tujuan bersama secara hormat (2V), diiringi kehati-hatian terhadap debat teoretis kaku (3L) dan ketenangan emosi (4E).',
    positionalSynthesis:
      '1F dan 2V menjadikannya pengelola praktis yang membumi sekaligus adil dalam memimpin/berunding. Diskusi yang terasa menguji kepintaran teoretis secara tajam dapat menyentuh 3L, sedangkan suasana emosi ditanggapi secara tenang dan tidak berbelit (4E).',
  },
  {
    code: 'FVEL',
    order: ['F', 'V', 'E', 'L'],
    afanasyevNickname: 'Chekhov',
    attitudinalPsycheClub: 'Sextet Steady-Coordinator / Fisik, Negosiasi & Kepekaan Emosi',
    overview:
      'Menggabungkan kejelasan preferensi materi-kenyamanan (1F) dengan ketegasan demokratis dalam bekerja sama (2V), sambil menjaga batas hati-hati atas luapan emosi terbuka (3E) dan bersikap praktis terhadap teori abstrak (4L).',
    positionalSynthesis:
      '1F + 2V menonjolkan keandalan membangun kesepakatan kerja yang nyaman dan masuk akal secara nyata. Keterbukaan emosional membutuhkan rasa percaya terlebih dahulu (3E), dan teori yang terlalu jauh dari penerapan praktis cepat diringkas (4L).',
  },
  {
    code: 'FELV',
    order: ['F', 'E', 'L', 'V'],
    afanasyevNickname: 'Borgia',
    alternateHistoricalNotes: 'Dalam beberapa sumber psikosofi alternatif juga ditemukan variasi penamaan seperti Rabelais.',
    attitudinalPsycheClub: 'Sextet Warm-Realist / Fisik, Ekspresi Emosi & Kehendak Ringan',
    overview:
      'Memadukan ketegasan atas pengalaman inderawi dan kenyamanan pribadi (1F) dengan kehangatan membangun suasana emosional bersama (2E), sambil berhati-hati menghadapi perdebatan logis tajam (3L) dan ringan terhadap kendali otoritas (4V).',
    positionalSynthesis:
      '1F + 2E menciptakan atmosfer ramah, hangat, dan penuh perhatian terhadap hal-hal konkret. Saat berdebat konseptual secara keras, 3L bisa merasa terpojok; sementara dalam keputusan peran kelompok, 4V bersedia mengikuti selama suasana dan kenyamanannya tetap baik.',
  },
  {
    code: 'FEVL',
    order: ['F', 'E', 'V', 'L'],
    afanasyevNickname: 'Dumas',
    attitudinalPsycheClub: 'Sextet Convivial-Realist / Fisik, Kehangatan & Kepekaan Peran',
    overview:
      'Menyatukan kecintaan pada kenyamanan dan kualitas fisik pribadi (1F) dengan keluwesan merangkul suasana emosional orang lain (2E), disertai kewaspadaan terhadap tekanan wewenang (3V) dan pendekatan simpel pada teori abstrak (4L).',
    positionalSynthesis:
      '1F dan 2E kuat membangun kebersamaan yang hangat, praktis, dan menyenangkan. Namun bila seseorang mendikte kehendak secara kaku, 3V dapat cepat terganggu; perdebatan logika berkepanjangan bukan prioritas utama (4L).',
  },
];

export const PSYCHOSOPHY_MAP: Record<string, PsychosophyTypeSpec> = Object.fromEntries(
  ALL_24_PSYCHOSOPHY_TYPES.map((t) => [t.code, t])
);

export interface PsychosophyPairwiseConflictPrinciple {
  id: string;
  title: string;
  appliesWhen: string;
  whatEachTakesForGranted: string;
  unintendedTone: string;
  howMisunderstood: string;
  exhaustionOrFrustration: string;
  whatEachNeeds: string;
  defensiveTrigger: string;
  communicationBridge: string;
}

export const PSYCHOSOPHY_CONFLICT_PRINCIPLES: PsychosophyPairwiseConflictPrinciple[] = [
  {
    id: '1v-3v',
    title: 'Dinamika 1V (Kehendak Tegas) berhadapan dengan 3V (Kehendak Peka)',
    appliesWhen: 'Satu pihak menempatkan V di posisi 1 dan pihak lain di posisi 3.',
    whatEachTakesForGranted:
      'Pihak 1V menganggap keputusan tegas yang langsung menunjuk arah membantu tim bergerak cepat; pihak 3V menganggap kesetaraan suara dan rasa dihargai sebelum diarahkan adalah syarat dasar kerja sama.',
    unintendedTone:
      '1V dapat terdengar memerintah atau meremehkan suara anggota tanpa bermaksud menjatuhkan; 3V dapat terdengar menolak atau mempersoalkan wewenang padahal sedang melindungi otonominya.',
    howMisunderstood:
      '1V menafsirkan keraguan/protes 3V sebagai pembangkangan tanpa solusi; 3V menafsirkan langkah cepat 1V sebagai dominasi atau kurangnya penghargaan terhadap kapasitas dirinya.',
    exhaustionOrFrustration:
      '1V merasa terhambat setiap kali keputusannya dicurigai; 3V merasa terpojok, tidak berdaya, atau tegang terus-menerus bila perannya diputuskan sepihak.',
    whatEachNeeds:
      '1V membutuhkan kejelasan tujuan dan komitmen hasil; 3V membutuhkan ruang dialog setara, penjelasan alasan keputusan, dan pengakuan atas kontribusinya.',
    defensiveTrigger:
      'Nada instruksi sepihak tanpa pertanyaan ("Pokoknya kerjakan bagian ini") memicu defensif 3V; penolakan pasif atau sindiran tanpa usul alternatif memicu frustrasi 1V.',
    communicationBridge:
      'Sampaikan tujuan akhir bersama secara jelas, lalu tawarkan dua pilihan peran yang setara sehingga arah tetap cepat (memenuhi 1V) dan otonomi tetap dihormati (menjaga rasa aman 3V).',
  },
  {
    id: '1l-3l',
    title: 'Dinamika 1L (Logika Mandiri) berhadapan dengan 3L (Logika Peka)',
    appliesWhen: 'Satu pihak menempatkan L di posisi 1 dan pihak lain di posisi 3.',
    whatEachTakesForGranted:
      '1L menganggap koreksi langsung terhadap kekeliruan nalar adalah efisiensi biasa agar kebenaran cepat jelas; 3L menganggap cara penyampaian koreksi mencerminkan penghormatan terhadap martabat intelektualnya.',
    unintendedTone:
      '1L terdengar memutus argumen secara final atau meremehkan tanpa niat menyerang pribadi; 3L bisa terdengar terlalu defensif atau berputar pada detail kecil.',
    howMisunderstood:
      '1L mengira 3L terlalu sensitif terhadap fakta objektif; 3L mengira 1L menganggap dirinya tidak mampu berpikir.',
    exhaustionOrFrustration:
      '1L lelah harus mengemas fakta panjang lebar; 3L kehilangan rasa aman bertanya di diskusi terbuka.',
    whatEachNeeds:
      '1L membutuhkan kejelasan poin inti tanpa basa-basi berbelit; 3L membutuhkan pengakuan atas usaha berpikirnya serta koreksi yang fokus pada isi argumen, bukan kemampuan pribadinya.',
    defensiveTrigger:
      'Kalimat "Ini jelas tidak masuk akal" memicu penarikan diri atau defensif keras pada 3L.',
    communicationBridge:
      'Validasi pertanyaan atau dasar pemikiran 3L terlebih dahulu, lalu sampaikan koreksi berbasis data spesifik dengan memberi waktu jeda untuk mencerna.',
  },
  {
    id: '1e2e-3e4e',
    title: 'Dinamika 1E/2E (Emosi Kuat/Dialogis) berhadapan dengan 3E/4E (Emosi Peka/Ringan)',
    appliesWhen: 'Satu pihak ber-1E atau 2E dan pihak lain ber-3E atau 4E.',
    whatEachTakesForGranted:
      'Pihak 1E/2E menganggap keterbukaan perasaan dan kehangatan suara merupakan tanda ketulusan serta kepedulian; pihak 3E/4E menganggap ketenangan nada dan fokus ke pokok masalah sebagai bentuk sikap dewasa dan hormat.',
    unintendedTone:
      '1E/2E bisa terasa terlalu menekan atau menuntut respons perasaan cepat; 3E/4E bisa terlihat datar, dingin, atau seolah tidak peduli.',
    howMisunderstood:
      '1E/2E menyimpulkan 3E/4E tidak tulus atau menjaga jarak; 3E merasa terintimidasi oleh intensitas suasana, sementara 4E bingung mengapa diskusi terasa penuh drama.',
    exhaustionOrFrustration:
      '1E/2E merasa bertepuk sebelah tangan secara emosional; 3E/4E kelelahan bila dipaksa merespons dengan intensitas emosional yang tidak alami baginya.',
    whatEachNeeds:
      '1E/2E membutuhkan konfirmasi eksplisit bahwa kepedulian dan pesan batinnya benar-benar didengar; 3E/4E membutuhkan izin untuk merespons dengan nada tenang tanpa dicap tidak peduli.',
    defensiveTrigger:
      'Tuduhan "Kamu nggak punya perasaan ya?" kepada 3E/4E atau "Kamu lebay banget sih" kepada 1E/2E.',
    communicationBridge:
      'Sebutkan kepedulian dan keseriusan secara verbal dengan kalimat singkat yang jelas (untuk menenangkan 1E/2E) tanpa menuntut ekspresi dramatis balik (melindungi 3E/4E).',
  },
  {
    id: '1f2f-3f4f',
    title: 'Dinamika 1F/2F (Fisika Dominan/Aktif) berhadapan dengan 3F/4F (Fisika Peka/Ringan)',
    appliesWhen: 'Satu pihak ber-1F atau 2F dan pihak lain ber-3F atau 4F.',
    whatEachTakesForGranted:
      '1F/2F menganggap pengaturan ruang fisik, makanan, kerapian, dan penampilan adalah dasar kerja nyata yang wajar diperhatikan; 3F sensitif bila fisiknya dievaluasi langsung, sementara 4F sering tidak memikirkan detail tersebut.',
    unintendedTone:
      'Komentar praktis 1F/2F tentang kerapian atau penampilan dapat terasa seperti kritik personal bagi 3F; sikap cuek 4F terhadap fasilitas/batas barang bisa terasa sembrono bagi 1F.',
    howMisunderstood:
      '1F/2F mengira 4F malas atau tidak menghargai ruang bersama; 3F mengira 1F/2F sedang menghakimi kekurangan dirinya.',
    exhaustionOrFrustration:
      '1F kesal ruang kerjanya berantakan atau nyamannya terganggu; 3F tegang bila dikomentari fisiknya; 4F bingung mengapa detail kecil fisik menjadi perdebatan panjang.',
    whatEachNeeds:
      '1F/2F membutuhkan kesepakatan praktis jelas soal kebersihan dan batas barang; 3F membutuhkan komentar yang sopan terhadap ranah personal; 4F membutuhkan pengingat praktis sederhana tanpa penghakiman.',
    defensiveTrigger:
      'Komentar langsung pada penampilan atau kecanggungan fisik 3F; mengabaikan kesepakatan kerapian ruang milik 1F.',
    communicationBridge:
      'Bicarakan standar ruang bersama sebagai kesepakatan logistik yang spesifik ("Kita rapikan meja 5 menit sebelum pulang") bukan penilaian sifat pribadi.',
  },
  {
    id: 'result-vs-process',
    title: 'Ritme Berbeda: Result (Posisi 1 & 4) vs Process (Posisi 2 & 3)',
    appliesWhen: 'Satu pihak menempatkan aspek konflik di posisi Result (1/4) dan pihak lain di posisi Process (2/3).',
    whatEachTakesForGranted:
      'Posisi Result (1 atau 4) ingin segera mendapat kesimpulan akhir atau jalan pintas praktis tanpa membedah berulang kali; posisi Process (2 atau 3) merasa penting meninjau, mendiskusikan, atau menguji setiap tahap bersama.',
    unintendedTone:
      'Posisi Result tampak memotong pembicaraan atau terburu-buru; posisi Process tampak memperlambat atau mengulang topik yang sama.',
    howMisunderstood:
      'Result mengira Process berputar-putar; Process mengira Result mengabaikan pertimbangan penting.',
    exhaustionOrFrustration:
      'Result jenuh oleh diskusi berulang; Process belum merasa yakin atau aman karena langkahnya dilompati.',
    whatEachNeeds:
      'Kesepakatan batas waktu diskusi ("Mari bahas pertimbangannya 10 menit, lalu kita tetapkan keputusan awal yang bisa dievaluasi nanti").',
    defensiveTrigger:
      'Menutup pembahasan sepihak terlalu dini atau sebaliknya menuntut pembahasan berulang tanpa batas akhir.',
    communicationBridge:
      'Bagi percakapan menjadi dua tahap singkat: ruang eksplorasi terstruktur (melayani Process) diikuti rangkuman kesepakatan konkret (memenuhi Result).',
  },
];
