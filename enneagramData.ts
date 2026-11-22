import type { EnneagramCore, InstinctCode, InstinctualStacking } from '../types/dynamap';

export interface WingSpec {
  code: string;
  adjacentNumber: EnneagramCore;
  title: string;
  influence: string;
  similaritiesAndDifferences: string;
  interpretationVariation: string;
}

export interface EnneagramTypeSpec {
  number: EnneagramCore;
  name: string;
  indonesianTitle: string;
  center: 'Gut' | 'Heart' | 'Head';
  objectRelations: 'Rejection' | 'Attachment' | 'Frustration';
  harmonic: 'Positive Outlook' | 'Competency' | 'Reactive';
  hornevian: 'Assertive' | 'Compliant' | 'Withdrawn';
  coreMotivation: string;
  coreFear: string;
  coreDesire: string;
  typicalConcerns: string[];
  defenseMechanism: string;
  potentialStrengths: string[];
  potentialLimitations: string[];
  stressDirection: { target: EnneagramCore; description: string };
  growthDirection: { target: EnneagramCore; description: string };
  interpersonalPatterns: string;
  communicationConsiderations: string;
  everydayExamples: string[];
  schoolExamples: string[];
  learningConsiderations: string;
  wings: [WingSpec, WingSpec];
}

export const ENNEAGRAM_TYPES: Record<EnneagramCore, EnneagramTypeSpec> = {
  1: {
    number: 1,
    name: 'Tipe 1 — The Reformer / Pembaru Prinsipil',
    indonesianTitle: 'Berorientasi Integritas, Ketepatan & Perbaikan',
    center: 'Gut',
    objectRelations: 'Frustration',
    harmonic: 'Competency',
    hornevian: 'Compliant',
    coreMotivation: 'Berusaha hidup sesuai standar etika dan kualitas yang benar serta memperbaiki hal-hal yang keliru.',
    coreFear: 'Takut menjadi korup, tidak bermoral, ceroboh, atau melakukan kesalahan yang merusak integritas.',
    coreDesire: 'Memiliki integritas, keseimbangan, dan keselarasan antara niat baik dengan tindakan nyata.',
    typicalConcerns: [
      'Apakah prosedur dan hasil sudah adil serta sesuai standar mutu?',
      'Bagaimana mengendalikan rasa kesal ketika melihat kecerobohan tanpa meledak?',
    ],
    defenseMechanism:
      'Formasi reaksi (Reaction Formation): meredam dorongan marah atau impuls yang dianggap tidak pantas dengan menampilkan sikap sangat tertib, sopan, dan kritis secara terukur.',
    potentialStrengths: [
      'Teliti, berintegritas tinggi, dan konsisten menjaga tanggung jawab.',
      'Mampu melihat ruang perbaikan konstruktif pada mutu pekerjaan kelompok.',
    ],
    potentialLimitations: [
      'Perfeksionisme berlebih dan suara kritik internal yang terlalu keras terhadap diri sendiri maupun teman.',
      'Kesulitan menerima metode alternatif yang tampak kurang rapi di awal.',
    ],
    stressDirection: {
      target: 4,
      description: 'Saat tertekan berkepanjangan (arah garis ke 4), dapat merasa disalahpahami, murung, dan terlalu menghakimi kekurangan diri sendiri.',
    },
    growthDirection: {
      target: 7,
      description: 'Saat bertumbuh (arah garis ke 7), menjadi lebih lapang, menerima ketidaksempurnaan manusiawi, dan menikmati proses eksplorasi.',
    },
    interpersonalPatterns:
      'Menunjukkan kepedulian lewat keandalan dan masukan perbaikan, tetapi nada korektifnya dapat disalahpahami sebagai ketidakpuasan personal.',
    communicationConsiderations:
      'Sampaikan apresiasi atas usaha lebih dulu sebelum koreksi; saat memberi masukan kepada Tipe 1, hargai niat baik mereka menjaga kualitas.',
    everydayExamples: [
      'Merasa gelisah melihat format tugas kelompok tidak seragam menjelang dikumpulkan.',
      'Menahan kejengkelan dengan nada bicara yang kaku dan sangat formal.',
    ],
    schoolExamples: [
      'Menjadi penyunting akhir makalah atau penjaga kepatuhan rubrik penilaian.',
      'Menuntut keadilan pembagian tugas ketika ada anggota yang bekerja asal-asalan.',
    ],
    learningConsiderations:
      'Motivasi belajar kuat saat tujuan rubrik jelas, namun perlu melatih izin untuk membuat draf kasar terlebih dahulu agar tidak terhambat perfeksionisme.',
    wings: [
      {
        code: '1w9',
        adjacentNumber: 9,
        title: '1w9 — Idealis yang Tenang',
        influence: 'Sayap 9 menghadirkan nada yang lebih tenang, sabar, objektif, dan berjarak dari konflik langsung.',
        similaritiesAndDifferences: 'Sama-sama berpegang pada prinsip, tetapi 1w9 lebih memilih menahan diri dan mengamati dibanding menegur secara vokal.',
        interpretationVariation: 'Beberapa penulis menggambarkan 1w9 lebih filosofis; dalam praktik, ketenangan ini juga dipengaruhi insting SP/SO/SX.',
      },
      {
        code: '1w2',
        adjacentNumber: 2,
        title: '1w2 — Advokat yang Hangat & Aktif',
        influence: 'Sayap 2 menambah dorongan interpersonal untuk langsung membimbing, membantu, dan terlibat memperbaiki situasi bersama orang lain.',
        similaritiesAndDifferences: 'Lebih ekspresif dan berorientasi relasi dibanding 1w9, tetapi lebih rentan kecewa jika bantuannya dirasa tidak dihargai.',
        interpretationVariation: 'Tingkat keaktifan sosial 1w2 berbeda-beda tergantung konteks budaya kelas dan varian insting.',
      },
    ],
  },
  2: {
    number: 2,
    name: 'Tipe 2 — The Helper / Penolong Relasional',
    indonesianTitle: 'Berorientasi Koneksi, Kepedulian & Nilai Kehadiran',
    center: 'Heart',
    objectRelations: 'Rejection',
    harmonic: 'Positive Outlook',
    hornevian: 'Compliant',
    coreMotivation: 'Merasa dicintai dan bernilai dengan cara hadir, peka, serta membantu memenuhi kebutuhan orang lain.',
    coreFear: 'Takut tidak dibutuhkan, tidak dicintai, atau ditolak secara emosional oleh orang-orang penting.',
    coreDesire: 'Merasakan kehangatan hubungan timbal balik di mana diri diterima apa adanya, bukan hanya karena jasanya.',
    typicalConcerns: [
      'Apakah orang lain merasa terbantu dan nyaman dengan kehadiranku?',
      'Apakah aku terlalu menekan kebutuhanku sendiri agar disukai kelompok?',
    ],
    defenseMechanism:
      'Represi (Repression): mengesampingkan kebutuhan, rasa lelah, atau kekecewaan pribadi ke latar belakang agar tetap fokus memenuhi kebutuhan orang lain.',
    potentialStrengths: [
      'Hangat, empatik, sigap menangkap kebutuhan emosional teman, dan membangun kepercayaan.',
      'Mampu merangkul anggota kelompok yang merasa terpinggirkan.',
    ],
    potentialLimitations: [
      'Sulit mengatakan "tidak" atau meminta bantuan secara langsung.',
      'Berpotensi merasa terluka secara diam-diam apabila usaha membantu tidak dibalas dengan pengakuan serupa.',
    ],
    stressDirection: {
      target: 8,
      description: 'Saat tertekan (arah garis ke 8), dapat berubah menjadi sangat tegas menuntut pengakuan atau meluapkan kekecewaan secara blak-blakan.',
    },
    growthDirection: {
      target: 4,
      description: 'Saat bertumbuh (arah garis ke 4), lebih jujur mengakui kebutuhan dan batasan emosional diri sendiri tanpa rasa bersalah.',
    },
    interpersonalPatterns:
      'Membangun kedekatan lewat perhatian aktif, tetapi kadang memberi sebelum ditanya sehingga lawan bicara merasa sungkan atau kewalahan.',
    communicationConsiderations:
      'Nyatakan apresiasi secara spesifik, dan biasakan menanyakan apa kebutuhan Tipe 2 sendiri bukan hanya apa yang bisa mereka bantu.',
    everydayExamples: [
      'Langsung menawarkan diri merangkum catatan untuk teman yang sakit meski tugas sendiri menumpuk.',
      'Merasa tersinggung ketika teman menolak bantuan karena ingin mandiri.',
    ],
    schoolExamples: [
      'Menjadi pengingat jadwal atau penengah suasana ketika kelompok belajar tegang.',
      'Kesulitan menolak tambahan bagian tugas dari teman yang menunda pekerjaan.',
    ],
    learningConsiderations:
      'Belajar bersemangat saat merasa terkoneksi dengan kelompok atau guru, namun perlu menjaga batas waktu belajar mandiri agar tidak habis untuk mengurus orang lain.',
    wings: [
      {
        code: '2w1',
        adjacentNumber: 1,
        title: '2w1 — Penolong yang Terstruktur & Etis',
        influence: 'Sayap 1 memberi ketertiban, tanggung jawab moral, dan cara membantu yang lebih terukur serta tenang.',
        similaritiesAndDifferences: 'Lebih tertahan dalam ekspresi emosional dibanding 2w3 dan cenderung membantu lewat tindakan nyata yang rapi.',
        interpretationVariation: 'Dalam beberapa literatur tampak mirip dengan tipe pengasuh yang disiplin; tetap berbeda motif dasarnya dari Tipe 1.',
      },
      {
        code: '2w3',
        adjacentNumber: 3,
        title: '2w3 — Penghubung yang Ekspresif & Adaptif',
        influence: 'Sayap 3 menambahkan keluwesan sosial, pesona komunikasi, dan perhatian pada kesan positif serta capaian bersama.',
        similaritiesAndDifferences: 'Lebih nyaman tampil di forum ramai daripada 2w1 dan lebih peka terhadap pencapaian sosial.',
        interpretationVariation: 'Intensitas sosialnya sangat dipengaruhi varian insting (misalnya SO vs SP).',
      },
    ],
  },
  3: {
    number: 3,
    name: 'Tipe 3 — The Achiever / Penggerak Capaian',
    indonesianTitle: 'Berorientasi Kompetensi, Tujuan & Efektivitas Hasil',
    center: 'Heart',
    objectRelations: 'Attachment',
    harmonic: 'Competency',
    hornevian: 'Assertive',
    coreMotivation: 'Berupaya membuktikan diri bernilai melalui pencapaian nyata, kompetensi yang diakui, dan kemampuan beradaptasi meraih target.',
    coreFear: 'Takut tidak berharga, gagal, atau tidak memiliki pencapaian yang diakui.',
    coreDesire: 'Merasa berharga dan diterima atas jati diri sejati, bukan semata-mata atas prestasi atau citra luar.',
    typicalConcerns: [
      'Bagaimana memastikan proyek ini berhasil dengan efisien dan terlihat meyakinkan?',
      'Apakah aku terlalu menyesuaikan diri dengan ekspektasi orang lain sampai lupa apa yang benar-benar kuinginkan?',
    ],
    defenseMechanism:
      'Identifikasi (Identification): menyatukan harga diri dengan peran, target, atau citra sukses sehingga keraguan emosional pribadi tersisihkan saat mengejar hasil.',
    potentialStrengths: [
      'Berfokus pada solusi, cepat beradaptasi dengan audiens, dan mendorong momentum eksekusi.',
      'Mampu menerjemahkan gagasan rumit menjadi presentasi yang meyakinkan.',
    ],
    potentialLimitations: [
      'Mengukur nilai diri dan teman berdasarkan produktivitas semata.',
      'Cenderung melewati pembahasan emosi yang dianggap menghambat progres cepat.',
    ],
    stressDirection: {
      target: 9,
      description: 'Saat kelelahan atau tertekan berat (arah garis ke 9), dapat kehilangan semangat, menunda secara pasif, dan menarik diri dari target.',
    },
    growthDirection: {
      target: 6,
      description: 'Saat bertumbuh (arah garis ke 6), belajar bekerja sama secara jujur, mengakui keterbatasan, dan setia pada proses tim.',
    },
    interpersonalPatterns:
      'Menghargai kejelasan target dan gerak cepat; bisa merasa frustrasi pada diskusi berputar tanpa hasil konkret.',
    communicationConsiderations:
      'Sampaikan tujuan dan hasil yang diharapkan dengan jelas; beri ruang aman bagi Tipe 3 untuk mengakui kesulitan tanpa takut dinilai gagal.',
    everydayExamples: [
      'Langsung menyusun pembagian slide presentasi agar tampil profesional di depan guru.',
      'Menyembunyikan rasa cemas sebelum lomba agar tetap tampak siap.',
    ],
    schoolExamples: [
      'Mengambil peran presenter atau koordinator target nilai proyek.',
      'Terkadang mengambil alih bagian teman yang lambat demi menjaga skor kelompok.',
    ],
    learningConsiderations:
      'Sangat termotivasi oleh sasaran terukur dan umpan balik kemajuan, tetapi perlu menjaga agar belajar tidak sekadar mengejar nilai angka tanpa pemahaman mendalam.',
    wings: [
      {
        code: '3w2',
        adjacentNumber: 2,
        title: '3w2 — Penggerak yang Hangat & Persuasif',
        influence: 'Sayap 2 menekankan daya tarik interpersonal, dukungan ke anggota tim, dan keinginan sukses bersama.',
        similaritiesAndDifferences: 'Lebih berorientasi koneksi sosial dan pengakuan relasional daripada 3w4 yang lebih personal-profesional.',
        interpretationVariation: 'Varian insting (SO vs SX) memengaruhi apakah fokusnya pada jaringan luas atau kedekatan personal.',
      },
      {
        code: '3w4',
        adjacentNumber: 4,
        title: '3w4 — Profesional yang Reflektif & Orisinal',
        influence: 'Sayap 4 menambah kesadaran estetika, keunikan karya, dan standar autentisitas pribadi dalam berprestasi.',
        similaritiesAndDifferences: 'Lebih selektif dalam tampil sosial dibanding 3w2 dan lebih rentan membandingkan kedalaman karya sendiri.',
        interpretationVariation: 'Sering tampak lebih tenang atau fokus pada bidang keahlian spesifik.',
      },
    ],
  },
  4: {
    number: 4,
    name: 'Tipe 4 — The Individualist / Pencari Makna Autentik',
    indonesianTitle: 'Berorientasi Kedalaman Batin, Keunikan & Kejujuran Emosional',
    center: 'Heart',
    objectRelations: 'Frustration',
    harmonic: 'Reactive',
    hornevian: 'Withdrawn',
    coreMotivation: 'Memahami identitas diri yang autentik, menemukan makna di balik pengalaman emosional, dan mengekspresikan suara batin secara jujur.',
    coreFear: 'Takut tidak memiliki identitas unik, menjadi dangkal, atau tidak benar-benar dipahami oleh siapa pun.',
    coreDesire: 'Menemukan keutuhan diri dan hubungan di mana kedalaman perasaannya diterima tanpa penghakiman.',
    typicalConcerns: [
      'Apakah karya dan sikapku benar-benar mencerminkan diriku yang autentik?',
      'Mengapa orang lain tampak lebih mudah menyesuaikan diri dengan hal-hal biasa?',
    ],
    defenseMechanism:
      'Introjeksi (Introjection): menyerap pengalaman emosional dan kritik ke dalam identitas batin secara intens sehingga rasa sakit atau kekurangan terasa sangat personal.',
    potentialStrengths: [
      'Peka terhadap nuansa emosi manusia, kreatif, empatik pada pengalaman sulit orang lain.',
      'Menghadirkan kedalaman perspektif dan orisinalitas dalam proyek atau esai.',
    ],
    potentialLimitations: [
      'Mudah larut dalam suasana hati atau membandingkan kekurangan diri dengan kelebihan orang lain.',
      'Menarik diri ketika merasa tidak dipahami daripada langsung mengklarifikasi maksud.',
    ],
    stressDirection: {
      target: 2,
      description: 'Saat tertekan (arah garis ke 2), dapat menjadi sangat cemas akan penolakan dan berusaha berlebihan mencari validasi relasional.',
    },
    growthDirection: {
      target: 1,
      description: 'Saat bertumbuh (arah garis ke 1), mampu menata emosi ke dalam disiplin tindakan nyata dan prinsip yang konsisten.',
    },
    interpersonalPatterns:
      'Menghargai percakapan jujur dan bermakna; kurang menyukai respons klise seperti "sudah jangan dipikirkan".',
    communicationConsiderations:
      'Validasi perasaan terlebih dahulu sebelum menawarkan solusi teknis; hindari mengecilkan pengalaman emosional yang sedang mereka ceritakan.',
    everydayExamples: [
      'Merasa kurang terhubung ketika diskusi kelas hanya menyentuh poin hafalan dangkal.',
      'Menunjukkan empati mendalam saat teman mengalami masalah pribadi.',
    ],
    schoolExamples: [
      'Menghasilkan karya tulis, desain, atau analisis humaniora dengan sudut pandang orisinal.',
      'Semangat belajar menurun drastis saat merasa tugas bersifat mekanis tanpa ruang ekspresi.',
    ],
    learningConsiderations:
      'Terbantu dengan kebebasan mencari sudut pandang bermakna, tetapi memerlukan kebiasaan struktur harian agar mood tidak menentukan jadwal belajar.',
    wings: [
      {
        code: '4w3',
        adjacentNumber: 3,
        title: '4w3 — Ekspresif yang Berorientasi Karya',
        influence: 'Sayap 3 memberi dorongan lebih kuat untuk mewujudkan ekspresi batin menjadi karya yang dilihat dan diapresiasi.',
        similaritiesAndDifferences: 'Lebih adaptif dan komunikatif di depan publik dibanding 4w5 yang lebih menarik diri.',
        interpretationVariation: 'Sebagian 4w3 tampak sangat aktif di kegiatan seni atau organisasi kreatif sekolah.',
      },
      {
        code: '4w5',
        adjacentNumber: 5,
        title: '4w5 — Pengamat Batin yang Kontemplatif',
        influence: 'Sayap 5 memperkuat kecenderungan introspeksi mendalam, ketertarikan pada konsep abstrak, dan kebutuhan ruang pribadi.',
        similaritiesAndDifferences: 'Lebih privat dan analitis terhadap perasaannya dibanding 4w3.',
        interpretationVariation: 'Sangat menonjol pada varian SP4 dan SX4 tergantung intensitas keterbukaan personal.',
      },
    ],
  },
  5: {
    number: 5,
    name: 'Tipe 5 — The Investigator / Pengamat Analitis',
    indonesianTitle: 'Berorientasi Pemahaman Mendalam, Kemandirian & Konservasi Energi',
    center: 'Head',
    objectRelations: 'Rejection',
    harmonic: 'Competency',
    hornevian: 'Withdrawn',
    coreMotivation: 'Memahami cara kerja dunia secara mendalam agar mampu mandiri, kompeten, dan tidak kewalahan oleh tuntutan luar.',
    coreFear: 'Takut tidak mampu, tidak berdaya menghadapi dunia, atau kehabisan energi akibat tuntutan yang terlalu banyak.',
    coreDesire: 'Memiliki pemahaman yang jernih dan kecukupan kapasitas untuk menghadapi realitas dengan tenang.',
    typicalConcerns: [
      'Apakah aku sudah cukup menguasai informasi sebelum berbicara atau bertindak?',
      'Bagaimana menjaga ruang pribadi agar energiku tidak terkuras oleh interaksi mendadak?',
    ],
    defenseMechanism:
      'Isolasi afek / Kompartmentalisasi (Isolation): memisahkan emosi dari proses berpikir untuk mengamati situasi secara objektif dari jarak aman.',
    potentialStrengths: [
      'Analitis, tekun menelusuri akar persoalan, tenang di situasi panik.',
      'Mampu melihat detail atau kerangka masalah yang terlewat oleh kelompok.',
    ],
    potentialLimitations: [
      'Terlalu lama mengumpulkan informasi dan menunda partisipasi nyata dalam kelompok.',
      'Menarik diri secara diam-diam ketika merasa privasi atau energinya terganggu.',
    ],
    stressDirection: {
      target: 7,
      description: 'Saat tertekan (arah garis ke 7), pikiran dapat meloncat-loncat mencari distraksi tanpa benar-benar menyelesaikan masalah.',
    },
    growthDirection: {
      target: 8,
      description: 'Saat bertumbuh (arah garis ke 8), berani tampil asertif, mengambil posisi tegas, dan mempraktikkan pengetahuannya di dunia nyata.',
    },
    interpersonalPatterns:
      'Lebih nyaman berdiskusi mengenai gagasan spesifik daripada basa-basi sosial panjang; menghargai persiapan sebelum rapat.',
    communicationConsiderations:
      'Beri waktu untuk berpikir setelah mengajukan pertanyaan; hindari memaksa respons emosional seketika.',
    everydayExamples: [
      'Membaca literatur tambahan berjam-jam sebelum merasa siap menjelaskan satu topik.',
      'Memilih diam mengamati dinamika rapat hingga merasa ada poin penting yang belum disebut.',
    ],
    schoolExamples: [
      'Menjadi sumber referensi utama kelompok dalam riset materi atau analisis data.',
      'Kurang nyaman dengan tugas diskusi spontan tanpa pemberitahuan topik sebelumnya.',
    ],
    learningConsiderations:
      'Unggul dalam studi mendalam mandiri; perlu berlatih metode teaching-back atau diskusi singkat agar pengetahuan tidak berhenti di catatan pribadi.',
    wings: [
      {
        code: '5w4',
        adjacentNumber: 4,
        title: '5w4 — Pemikir yang Imajinatif & Filosofis',
        influence: 'Sayap 4 menambah kepekaan estetika, imajinasi simbolis, dan minat pada makna manusiawi di balik teori.',
        similaritiesAndDifferences: 'Lebih subjektif dan reflektif secara personal dibanding 5w6 yang lebih sistematis-empiris.',
        interpretationVariation: 'Sering tertarik pada seni konseptual, filsafat, atau psikologi.',
      },
      {
        code: '5w6',
        adjacentNumber: 6,
        title: '5w6 — Analis Sistematis & Pemecah Masalah',
        influence: 'Sayap 6 mengarahkan rasa ingin tahu ke pengujian sistem, antisipasi risiko, dan pembuktian fakta yang dapat diandalkan.',
        similaritiesAndDifferences: 'Lebih kolaboratif dalam tugas terstruktur dan fokus pada akurasi teknis dibanding 5w4.',
        interpretationVariation: 'Banyak ditemukan pada minat sains terapan, pemrograman, dan analisis struktural.',
      },
    ],
  },
  6: {
    number: 6,
    name: 'Tipe 6 — The Loyalist / Penjaga Keandalan & Kesiapan',
    indonesianTitle: 'Berorientasi Keamanan, Kejelasan Komitmen & Antisipasi Risiko',
    center: 'Head',
    objectRelations: 'Attachment',
    harmonic: 'Reactive',
    hornevian: 'Compliant',
    coreMotivation: 'Memastikan kepastian, dukungan yang dapat dipercaya, dan kesiapan menghadapi potensi risiko atau ketidakkonsistenan.',
    coreFear: 'Takut kehilangan pegangan, dikhianati kepercayaan, atau tidak siap menghadapi ancaman mendadak.',
    coreDesire: 'Memiliki rasa aman batin, kepercayaan diri terhadap penilaian sendiri, dan komunitas yang setia.',
    typicalConcerns: [
      'Apa kemungkinan terburuk jika rencana ini berubah mendadak?',
      'Apakah komitmen orang-orang dalam kelompok ini benar-benar dapat dipercaya?',
    ],
    defenseMechanism:
      'Proyeksi (Projection): mewaspadai keraguan atau motif tersembunyi di luar diri guna mengantisipasi kemungkinan bahaya sebelum terjadi.',
    potentialStrengths: [
      'Cermat mengidentifikasi risiko tersembunyi, setia kepada kelompok yang dipercaya, dan bertanggung jawab.',
      'Mampu berpikir kritis menguji kelemahan argumen atau rencana.',
    ],
    potentialLimitations: [
      'Overthinking terhadap skenario negatif yang belum tentu terjadi.',
      'Dapat bersikap ragu-ragu atau justru defensif-menguji (counterphobic) saat menghadapi ketidakpastian.',
    ],
    stressDirection: {
      target: 3,
      description: 'Saat tertekan (arah garis ke 3), dapat memaksakan diri bekerja berlebihan demi membuktikan kesigapan atau menghindari kritik.',
    },
    growthDirection: {
      target: 9,
      description: 'Saat bertumbuh (arah garis ke 9), lebih tenang menerima hal di luar kendali dan percaya pada ketahanan diri sendiri.',
    },
    interpersonalPatterns:
      'Menghargai kejujuran, transparansi maksud, dan konsistensi antara janji dan perbuatan.',
    communicationConsiderations:
      'Jelaskan alasan dan rencana cadangan secara terbuka; jangan menganggap pertanyaan kritis Tipe 6 sebagai ketidakpercayaan pribadi.',
    everydayExamples: [
      'Menyiapkan berkas cadangan di dua perangkat sebelum presentasi.',
      'Mengajukan banyak pertanyaan klarifikasi tentang aturan penilaian tugas.',
    ],
    schoolExamples: [
      'Membantu tim mengantisipasi celah sebelum pengumpulan proyek akhir.',
      'Bisa terlihat berhati-hati (SP6) atau berani menantang ketidakjelasan secara langsung (SX6).',
    ],
    learningConsiderations:
      'Belajar efektif dengan kisi-kisi jelas dan latihan soal bertahap; perlu mengelola kecemasan pra-ujian dengan teknik active recall yang membangun rasa siap.',
    wings: [
      {
        code: '6w5',
        adjacentNumber: 5,
        title: '6w5 — Penguji Fakta yang Mandiri',
        influence: 'Sayap 5 memberi pendekatan lebih tenang, analitis, hati-hati, dan mengandalkan verifikasi informasi sendiri.',
        similaritiesAndDifferences: 'Lebih pendiam dan selektif secara sosial daripada 6w7.',
        interpretationVariation: 'Sangat sering fokus pada ketelitian bukti dan kerangka aturan yang konsisten.',
      },
      {
        code: '6w7',
        adjacentNumber: 7,
        title: '6w7 — Rekan Tim yang Komunikatif & Responsif',
        influence: 'Sayap 7 menghadirkan sisi humoris, ramah, cepat mencari alternatif, dan lebih terbuka berdiskusi untuk meredakan cemas.',
        similaritiesAndDifferences: 'Lebih ekspresif mencari masukan teman dibanding 6w5 yang lebih menahan diri.',
        interpretationVariation: 'Kerap mencairkan ketegangan kelompok meski tetap memantau kejelasan rencana.',
      },
    ],
  },
  7: {
    number: 7,
    name: 'Tipe 7 — The Enthusiast / Eksplorator Peluang',
    indonesianTitle: 'Berorientasi Kebebasan, Stimulasi Ide & Optimisme Peluang',
    center: 'Head',
    objectRelations: 'Frustration',
    harmonic: 'Positive Outlook',
    hornevian: 'Assertive',
    coreMotivation: 'Mengalami peluang baru yang menarik, menjaga kebebasan pilihan, dan menghindari rasa terjebak dalam kebosanan atau kepedihan.',
    coreFear: 'Takut terperangkap dalam penderitaan, keterbatasan tanpa jalan keluar, atau kehilangan pengalaman berharga.',
    coreDesire: 'Merasa puas, bersyukur, dan bebas mengeksplorasi hidup tanpa lari dari kedalaman pengalaman.',
    typicalConcerns: [
      'Apakah ada cara yang lebih seru, cepat, atau kreatif untuk mengerjakan ini?',
      'Bagaimana menghindari kebosanan saat menghadapi tugas berulang?',
    ],
    defenseMechanism:
      'Rasionalisasi (Rationalization): membingkai ulang situasi tidak nyaman atau kesalahan menjadi pelajaran positif secara cepat agar tidak terjebak rasa kecewa.',
    potentialStrengths: [
      'Kreatif, optimis menjaga moral tim, cepat menghubungkan berbagai gagasan lintas topik.',
      'Luwes menghadapi perubahan mendadak di lapangan.',
    ],
    potentialLimitations: [
      'Mudah kehilangan fokus pada tahap penyelesaian detail atau revisi berulang.',
      'Berpotensi mengalihkan pembicaraan serius dengan candaan saat suasana terasa berat.',
    ],
    stressDirection: {
      target: 1,
      description: 'Saat tertekan dan merasa terjebak (arah garis ke 1), dapat berubah menjadi sangat kritis, kaku, dan mudah jengkel pada hal kecil.',
    },
    growthDirection: {
      target: 5,
      description: 'Saat bertumbuh (arah garis ke 5), mampu duduk tenang mendalami satu topik hingga tuntas dan menerima nuansa emosi yang sulit.',
    },
    interpersonalPatterns:
      'Menyenangkan dalam diskusi awal, tetapi teman yang butuh penyelesaian tuntas dapat merasa janji tindak lanjut sulit dipegang jika tidak dicatat.',
    communicationConsiderations:
      'Libatkan kreativitasnya di awal, lalu bantu merangkum komitmen konkret secara singkat dan jelas.',
    everydayExamples: [
      'Mencetuskan lima ide lomba kelas sekaligus dalam lima menit.',
      'Menunda merapikan catatan lama karena tertarik membaca topik baru.',
    ],
    schoolExamples: [
      'Sangat aktif saat brainstorming proyek, presentasi dinamis, atau debat ide.',
      'Memerlukan teknik sesi fokus singkat (Pomodoro) untuk tugas hafalan atau latihan berulang.',
    ],
    learningConsiderations:
      'Efektif bila materi dikaitkan dengan variasi pendekatan dan tantangan interaktif, namun tetap memerlukan disiplin penuntasan sebelum berpindah bab.',
    wings: [
      {
        code: '7w6',
        adjacentNumber: 6,
        title: '7w6 — Kolaborator yang Ramah & Akomodatif',
        influence: 'Sayap 6 menambah perhatian pada keterlibatan teman, loyalitas kelompok, dan sedikit lebih peka pada keamanan rencana.',
        similaritiesAndDifferences: 'Lebih mencari kebersamaan tim dibanding 7w8 yang lebih independen dan tegas.',
        interpretationVariation: 'Sering menjadi penghubung sosial yang penuh energi di kelas.',
      },
      {
        code: '7w8',
        adjacentNumber: 8,
        title: '7w8 — Eksekutor Bebas yang Tegas & Pragmatis',
        influence: 'Sayap 8 memperkuat ketegasan sikap, keberanian mengambil tantangan besar, dan fokus pada hasil nyata yang memuaskan.',
        similaritiesAndDifferences: 'Lebih lugas dan kompetitif dibanding 7w6.',
        interpretationVariation: 'Terkadang tampak seperti Tipe 8 dalam ketegasan, tetapi tetap bermotif utama kebebasan dan stimulasi (Head center).',
      },
    ],
  },
  8: {
    number: 8,
    name: 'Tipe 8 — The Challenger / Pelindung yang Tegas',
    indonesianTitle: 'Berorientasi Kemandirian, Kekuatan Kehendak & Keadilan Nyata',
    center: 'Gut',
    objectRelations: 'Rejection',
    harmonic: 'Reactive',
    hornevian: 'Assertive',
    coreMotivation: 'Memegang kendali atas arah hidup sendiri, melindungi diri serta orang yang dianggap lemah, dan menolak dikontrol secara tidak adil.',
    coreFear: 'Takut dikendalikan, dimanipulasi, dikhianati, atau tampak lemah dan tak berdaya.',
    coreDesire: 'Melindungi otonomi diri dan menggunakan kekuatan secara konstruktif demi keadilan dan ketangguhan.',
    typicalConcerns: [
      'Siapa yang bertanggung jawab di sini dan apakah keputusannya adil serta jujur?',
      'Apakah ada pihak yang mencoba memanipulasi keadaan secara terselubung?',
    ],
    defenseMechanism:
      'Penyangkalan kerentanan (Denial): menyingkirkan perasaan sedih, takut, atau butuh bantuan agar tetap siap bertindak kuat menghadapi situasi.',
    potentialStrengths: [
      'Berani mengambil sikap saat orang lain ragu, melindungi anggota kelompok dari perlakuan tidak adil.',
      'Komunikasi jujur, lugas, dan cepat menggerakkan eksekusi.',
    ],
    potentialLimitations: [
      'Intensitas suara dan ketegasan spontan dapat membuat rekan yang lebih halus merasa terintimidasi.',
      'Kesulitan menunjukkan keraguan atau meminta pertolongan saat sebenarnya kewalahan.',
    ],
    stressDirection: {
      target: 5,
      description: 'Saat tertekan berat (arah garis ke 5), dapat menarik diri dari kelompok, menutup akses komunikasi, dan mengamati dari jarak dingin.',
    },
    growthDirection: {
      target: 2,
      description: 'Saat bertumbuh (arah garis ke 2), membuka sisi kehangatan, kesabaran mendengarkan kerentanan, dan kepemimpinan yang mengayomi.',
    },
    interpersonalPatterns:
      'Menghormati orang yang berani bicara jujur dan langsung; kurang menyukai sindiran pasif-agresif atau sikap berbelit.',
    communicationConsiderations:
      'Hadapi diskusi dengan tenang, jujur, dan langsung ke inti; tunjukkan ketegasan batas diri tanpa menyerang balik secara personal.',
    everydayExamples: [
      'Langsung menegur pembagian kerja kelompok yang tidak adil.',
      'Mengambil peran juru bicara ketika kelompok bingung menghadapi kritik.',
    ],
    schoolExamples: [
      'Efektif memimpin koordinasi kegiatan sekolah atau proyek yang butuh ketegasan tenggat.',
      'Perlu melatih kesabaran mendengar anggota yang membutuhkan waktu berpikir lebih lambat.',
    ],
    learningConsiderations:
      'Tertantang oleh masalah nyata, debat bermakna, dan kemandirian memilih strategi belajar; kurang cocok dengan instruksi mikro yang mengekang tanpa alasan jelas.',
    wings: [
      {
        code: '8w7',
        adjacentNumber: 7,
        title: '8w7 — Penggerak Ekspansif & Penuh Energi',
        influence: 'Sayap 7 menambah optimisme, kecepatan gerak, keberanian mencoba ide besar, dan keterbukaan sosial.',
        similaritiesAndDifferences: 'Lebih ekspresif dan cepat bergaul dibanding 8w9 yang lebih tenang.',
        interpretationVariation: 'Sering tampak sangat dominan dalam inisiatif proyek.',
      },
      {
        code: '8w9',
        adjacentNumber: 9,
        title: '8w9 — Pelindung yang Tenang & Stabil',
        influence: 'Sayap 9 menghadirkan ketenangan, kesabaran sebelum bertindak, dan daya pengaruh yang kokoh namun tidak meledak-ledak.',
        similaritiesAndDifferences: 'Lebih sabar mendengar daripada 8w7, tetapi tetap sangat teguh bila batas prinsip dilanggar.',
        interpretationVariation: 'Terkadang disangka Tipe 9 pada kesan awal hingga muncul momen pengambilan keputusan tegas.',
      },
    ],
  },
  9: {
    number: 9,
    name: 'Tipe 9 — The Peacemaker / Penjaga Keseimbangan',
    indonesianTitle: 'Berorientasi Kedamaian, Penerimaan & Keharmonisan Proses',
    center: 'Gut',
    objectRelations: 'Attachment',
    harmonic: 'Positive Outlook',
    hornevian: 'Withdrawn',
    coreMotivation: 'Menjaga kedamaian batin dan keharmonisan hubungan agar terhindar dari perpecahan atau ketegangan yang merusak koneksi.',
    coreFear: 'Takut terputus secara emosional dari orang sekitar, mengalami perpisahan, atau terseret ke dalam konflik berkepanjangan.',
    coreDesire: 'Merasakan keutuhan batin, penerimaan yang stabil, dan kedamaian yang jujur.',
    typicalConcerns: [
      'Bagaimana memastikan semua sudut pandang tetap dihargai tanpa pertengkaran?',
      'Apakah aku menunda menyatakan pendapat pribadiku demi menjaga kenyamanan sesaat?',
    ],
    defenseMechanism:
      'Narkotisasi (Narcotization): mengalihkan perhatian dari konflik atau prioritas sulit ke aktivitas rutin yang menenangkan agar ketegangan tidak terasa.',
    potentialStrengths: [
      'Pendengar yang sabar, mampu melihat kebenaran dari berbagai sisi, dan menenangkan konflik.',
      'Stabil, tidak mudah reaktif, dan suportif dalam kerja kelompok jangka panjang.',
    ],
    potentialLimitations: [
      'Menunda keputusan atau menyetujui secara pasif padahal di dalam hati keberatan.',
      'Kesulitan memprioritaskan agenda diri sendiri ketika dihadapkan pada banyak tuntutan teman.',
    ],
    stressDirection: {
      target: 6,
      description: 'Saat tertekan (arah garis ke 6), dapat menjadi cemas, ragu-ragu berkepanjangan, dan mudah khawatir akan kesalahan.',
    },
    growthDirection: {
      target: 3,
      description: 'Saat bertumbuh (arah garis ke 3), berani menetapkan prioritas pribadi yang jelas, bertindak proaktif, dan menghargai kontribusinya sendiri.',
    },
    interpersonalPatterns:
      'Menyambut semua orang dengan tenang, tetapi ketidaksepakatannya sering muncul sebagai penundaan atau diam, bukan penolakan eksplisit.',
    communicationConsiderations:
      'Beri undangan langsung yang ramah agar Tipe 9 menyampaikan pendapat jujurnya tanpa takut memicu konflik.',
    everydayExamples: [
      'Mengikuti pilihan kelompok meski sebenarnya memiliki usulan lain agar rapat cepat damai.',
      'Menjadi penengah ketika dua teman sekelas berselisih paham.',
    ],
    schoolExamples: [
      'Membantu menjaga stabilitas kelompok kerja tetap utuh hingga akhir proyek.',
      'Perlu menyepakati tenggat kecil agar tugas penting tidak tergeser oleh aktivitas nyaman yang tidak mendesak.',
    ],
    learningConsiderations:
      'Cocok dengan rutinitas tenang bertahap; sangat terbantu bila memulai sesi belajar dengan satu langkah kecil yang sangat jelas dan terukur.',
    wings: [
      {
        code: '9w8',
        adjacentNumber: 8,
        title: '9w8 — Penjaga Damai yang Kokoh & Realistis',
        influence: 'Sayap 8 memberi ketegasan batas ketika kesabaran sudah melewati garis serta pendekatan praktis yang membumi.',
        similaritiesAndDifferences: 'Lebih keras kepala dan lugas saat menolak tekanan dibanding 9w1.',
        interpretationVariation: 'Tetap menghindari konflik yang tidak perlu, namun tidak mudah ditekan.',
      },
      {
        code: '9w1',
        adjacentNumber: 1,
        title: '9w1 — Penjaga Harmoni yang Idealis & Teratur',
        influence: 'Sayap 1 menambah kepekaan pada keteraturan, kesantunan etis, dan keinginan menjaga segala hal tetap rapi serta benar.',
        similaritiesAndDifferences: 'Lebih tertib dan berhati-hati dibanding 9w8, namun lebih mudah menahan kejengkelan secara halus.',
        interpretationVariation: 'Banyak muncul pada siswa yang tampak tenang, sopan, dan menjaga kerapian tugas.',
      },
    ],
  },
};

export interface InstinctVariantSpec {
  code: InstinctCode;
  name: string;
  indonesianName: string;
  summary: string;
  themes: string[];
  classroomManifestation: string;
  potentialMisunderstanding: string;
}

export const INSTINCT_VARIANTS: Record<InstinctCode, InstinctVariantSpec> = {
  SP: {
    code: 'SP',
    name: 'Self-Preservation',
    indonesianName: 'Pelestarian Diri (Self-Preservation / SP)',
    summary:
      'Fokus perhatian teoretis pada pengelolaan sumber daya pribadi, rasa aman, kenyamanan fisik, kesehatan, keberlanjutan energi, dan kestabilan aktivitas sehari-hari.',
    themes: [
      'Sumber daya pribadi (waktu, energi, materi belajar, perlengkapan).',
      'Keamanan dan kesiapan menghadapi kendala praktis.',
      'Kenyamanan fisik, kualitas istirahat, dan kesehatan.',
      'Keberlanjutan ritme hidup serta manajemen keseharian yang realistis.',
    ],
    classroomManifestation:
      'Cenderung memperhatikan kecukupan waktu tidur, beban tugas realistis, kejelasan pembagian kerja agar tidak kelelahan, dan kesiapan perlengkapan.',
    potentialMisunderstanding:
      'Fokus pada batasan energi dan kepraktisan dapat disalahpahami sebagai kurang bersemangat atau terlalu berhitung secara pribadi.',
  },
  SO: {
    code: 'SO',
    name: 'Social',
    indonesianName: 'Sosial / Keterhubungan Kelompok (Social / SO)',
    summary:
      'Fokus perhatian teoretis pada partisipasi kelompok, posisi sosial, rasa memiliki dalam komunitas, jaringan pertemanan, pembagian peran bersama, dan kesadaran norma sosial.',
    themes: [
      'Partisipasi aktif serta kontribusi dalam kelompok atau kelas.',
      'Pemosisian sosial, peran, dan bagaimana kontribusi dipandang komunitas.',
      'Rasa memiliki (belonging), solidaritas, dan jejaring komunikasi.',
      'Kepekaan terhadap aturan tidak tertulis dan dinamika suasana kelompok.',
    ],
    classroomManifestation:
      'Cepat membaca siapa berperan sebagai apa di kelas, peduli pada citra atau kekompakan kelompok, serta peka terhadap keterlibatan tiap anggota.',
    potentialMisunderstanding:
      'Perhatian tinggi pada dinamika kelompok dapat dianggap terlalu memikirkan pendapat orang lain atau terlalu aktif mengatur posisi sosial.',
  },
  SX: {
    code: 'SX',
    name: 'Sexual / One-to-One',
    indonesianName: 'Intensitas / Satu-Lawan-Satu (Sexual / SX)',
    summary:
      'Fokus perhatian teoretis pada intensitas pengalaman, ketertarikan mendalam, koneksi satu-lawan-satu yang terfokus, resonansi personal (chemistry), dan keterlibatan penuh.',
    themes: [
      'Intensitas perhatian pada topik, orang, atau aktivitas yang menggugah.',
      'Koneksi personal yang mendalam dan jujur daripada interaksi permukaan.',
      'Resonansi emosional/intelektual (chemistry) dalam dialog satu-lawan-satu.',
      'Dorongan keterlibatan total saat merasa benar-benar tertarik.',
    ],
    classroomManifestation:
      'Lebih bersemangat dalam diskusi intens dengan satu atau dua teman yang nyambung atau pada topik yang memicu rasa penasaran kuat.',
    potentialMisunderstanding:
      'Intensitas ekspresi dan fokus selektif dapat disalahartikan sebagai terlalu intens, kurang netral dalam kelompok besar, atau cepat bosan pada hal biasa.',
  },
};

export interface InstinctStackingSpec {
  stacking: InstinctualStacking;
  dominant: InstinctCode;
  secondary: InstinctCode;
  blind: InstinctCode;
  everydayTendencies: string;
  interpersonalImplications: string;
  possibleBlindSpots: string;
  developmentSuggestions: string[];
  schoolExample: string;
}

export const INSTINCT_STACKINGS: Record<InstinctualStacking, InstinctStackingSpec> = {
  'SP/SX': {
    stacking: 'SP/SX',
    dominant: 'SP',
    secondary: 'SX',
    blind: 'SO',
    everydayTendencies:
      'Memprioritaskan kestabilan sumber daya, kenyamanan pribadi, dan rutinitas aman (SP), lalu menyalurkan energi secara intens ke minat atau relasi satu-lawan-satu yang dipilih (SX). Perhatian pada dinamika kelompok luas (SO) cenderung lebih sedikit.',
    interpersonalImplications:
      'Sangat setia dan hangat dalam lingkaran dekat atau diskusi berdua, tetapi dapat tampak menjaga jarak saat berada di forum kelas yang besar.',
    possibleBlindSpots:
      'Terkadang kurang menyadari norma tidak tertulis kelompok, dinamika politik kelas, atau dampak perilaku pribadi terhadap suasana kolektif yang lebih luas. Catatan: SO-blind BUKAN berarti tidak peduli atau tidak mampu bersosialisasi.',
    developmentSuggestions: [
      'Sesekali mengamati kebutuhan kelompok secara keseluruhan saat rapat kelas, bukan hanya teman terdekat.',
      'Menyampaikan kabar progres kerja secara terbuka ke seluruh anggota tim agar tidak timbul kesan eksklusif.',
    ],
    schoolExample:
      'Nyaman menjaga jadwal belajar mandiri yang rapi dan berdiskusi mendalam dengan satu sahabat, namun sering lupa ikut memantau grup obrolan kelas.',
  },
  'SP/SO': {
    stacking: 'SP/SO',
    dominant: 'SP',
    secondary: 'SO',
    blind: 'SX',
    everydayTendencies:
      'Mengutamakan ketahanan praktis, kesiapan diri, dan kenyamanan harian (SP), sambil menjaga tanggung jawab peran sosial serta keselarasan dalam komunitas kelas (SO). Fokus pada intensitas satu-lawan-satu yang penuh gairah (SX) relatif lebih jarang diutamakan.',
    interpersonalImplications:
      'Terlihat stabil, dapat diandalkan, sopan dalam kelompok, dan menghargai batas yang aman serta tidak berisiko tinggi.',
    possibleBlindSpots:
      'Cenderung bermain aman dan melewatkan peluang keterlibatan mendalam yang menantang zona nyaman atau membutuhkan keberanian ekspresi personal secara intens. Catatan: SX-blind tidak berarti tidak mampu menjalin hubungan dekat.',
    developmentSuggestions: [
      'Memberi ruang untuk mengeksplorasi minat yang benar-benar memicu antusiasme pribadi meski di luar rutinitas aman.',
      'Berani melakukan percakapan personal yang lebih terbuka tanpa selalu berlindung di balik topik aman atau urusan teknis.',
    ],
    schoolExample:
      'Disiplin menyiapkan tugas tepat waktu dan aktif menjalankan peran di organisasi siswa, tetapi jarang terlibat dalam perdebatan intens tentang minat personal.',
  },
  'SO/SP': {
    stacking: 'SO/SP',
    dominant: 'SO',
    secondary: 'SP',
    blind: 'SX',
    everydayTendencies:
      'Peka terhadap struktur peran, ekspektasi komunitas, dan kerja sama kelompok (SO), lalu menopangnya dengan perhatian pada kestabilan teknis dan keamanan praktis (SP). Intensitas personal yang spontan (SX) cenderung berada di urutan ketiga.',
    interpersonalImplications:
      'Kooperatif, peka terhadap tata krama kelas dan keadilan peran, serta mengutamakan ketertiban kerja bersama.',
    possibleBlindSpots:
      'Bisa terlalu berfokus pada kewajiban peran dan kenyamanan umum hingga menunda ekspresi gairah pribadi atau percakapan satu-lawan-satu yang jujur dan intens.',
    developmentSuggestions: [
      'Menyisihkan waktu untuk kegiatan atau topik yang memicu rasa ingin tahu mendalam secara pribadi.',
      'Melatih kejujuran ekspresi satu-lawan-satu tanpa terlalu khawatir soal kesan sosial yang formal.',
    ],
    schoolExample:
      'Aktif mengoordinasi tugas kelompok agar semua aman dan terstruktur, namun kurang nyaman jika diskusi berubah menjadi sangat personal atau penuh emosi intens.',
  },
  'SO/SX': {
    stacking: 'SO/SX',
    dominant: 'SO',
    secondary: 'SX',
    blind: 'SP',
    everydayTendencies:
      'Memusatkan perhatian pada dinamika komunitas, jejaring teman, dan tujuan kolektif (SO), disertai antusiasme menjalin koneksi mendalam serta ketertarikan pada ide atau figur yang menginspirasi (SX). Pengelolaan energi fisik dan rutinitas praktis (SP) sering terabaikan.',
    interpersonalImplications:
      'Hangat, komunikatif, berenergi tinggi dalam kegiatan sosial dan diskusi bermakna, mudah membangun jejaring maupun keterlibatan kelompok.',
    possibleBlindSpots:
      'Rentan kelelahan fisik, melupakan jadwal makan/istirahat, atau menumpuk komitmen sosial melebihi kapasitas waktu dan sumber daya pribadi. Catatan: SP-blind bukan berarti tidak bisa hidup teratur.',
    developmentSuggestions: [
      'Membuat pengingat praktis untuk istirahat, batasan jam tidur, dan prioritas tugas pribadi sebelum mengambil peran tambahan.',
      'Membiasakan pencatatan tenggat secara realistis agar antusiasme sosial tidak berujung kelelahan.',
    ],
    schoolExample:
      'Aktif di berbagai kepanitiaan sekolah dan diskusi seru dengan teman, tetapi baru sadar tugas mandiri menumpuk di malam menjelang pengumpulan.',
  },
  'SX/SP': {
    stacking: 'SX/SP',
    dominant: 'SX',
    secondary: 'SP',
    blind: 'SO',
    everydayTendencies:
      'Mengejar kedalaman pengalaman, ketertarikan intens pada topik atau relasi pilihan (SX), sambil menjaga batas kenyamanan, kemandirian, dan ruang aman pribadi (SP). Keterlibatan pada dinamika sosial luas (SO) lebih sedikit mendapat prioritas.',
    interpersonalImplications:
      'Autentik, fokus tinggi dalam interaksi berdua atau kelompok sangat kecil, namun tampak selektif atau tertutup terhadap keramaian kelas.',
    possibleBlindSpots:
      'Berpotensi kurang peka terhadap cara pesan pribadi diterima oleh kelompok besar atau mengabaikan pentingnya komunikasi publik dalam kerja tim. Catatan: SO-blind bukan berarti anti-sosial.',
    developmentSuggestions: [
      'Melatih penyampaian ringkas ide atau posisi diri di forum kelompok agar tidak disalahpahami sebagai sikap acuh.',
      'Menjaga kesadaran terhadap kontribusi bersama meski sedang fokus pada proyek atau teman tertentu.',
    ],
    schoolExample:
      'Sangat mendalami satu bidang minat bersama rekan dekat di ruang tenang, tetapi merasa canggung dalam rapat kelas yang ramai.',
  },
  'SX/SO': {
    stacking: 'SX/SO',
    dominant: 'SX',
    secondary: 'SO',
    blind: 'SP',
    everydayTendencies:
      'Didorong oleh ketertarikan intens, semangat pertukaran gagasan yang menggugah (SX), dan keinginan berbagi resonansi itu dengan komunitas atau kelompok sosial (SO). Perhatian pada pemeliharaan fisik serta batas praktis harian (SP) relatif lebih rendah.',
    interpersonalImplications:
      'Ekspresif, penuh gairah dalam menyuarakan ide atau membela kedekatan, serta mampu menghidupkan energi kelompok.',
    possibleBlindSpots:
      'Cenderung mengabaikan sinyal kelelahan tubuh, menganggap remeh rincian logistik praktis, atau terlalu menguras energi dalam konflik maupun antusiasme.',
    developmentSuggestions: [
      'Membangun rutinitas dasar yang menjaga tidur, manajemen waktu, dan pemecahan tugas menjadi langkah kecil yang realistis.',
      'Belajar memberi jeda sebelum merespons sesuatu yang memicu emosi intens.',
    ],
    schoolExample:
      'Sangat bersemangat mempresentasikan proyek idealisme bersama tim, namun lupa mengantisipasi detail teknis seperti perlengkapan atau cadangan file.',
  },
};

export const ENNEAGRAM_CENTERS = [
  {
    id: 'Gut',
    name: 'Pusat Insting / Tubuh (Gut / Body Center)',
    types: [8, 9, 1] as EnneagramCore[],
    coreEmotion: 'Kemarahan (Anger) & Batas Otonomi',
    theoreticalExplanation:
      'Memproses realitas terlebih dahulu melalui respons tubuh langsung, rasa keadilan, batas ruang pribadi, dan keinginan menjaga kendali atau ketenangan lingkungan. Tipe 8 mengekspresikannya ke luar, Tipe 9 meredam/menyelaraskan, dan Tipe 1 mengarahkannya ke koreksi standar internal.',
  },
  {
    id: 'Heart',
    name: 'Pusat Emosi / Citra (Heart / Feeling Center)',
    types: [2, 3, 4] as EnneagramCore[],
    coreEmotion: 'Rasa Malu / Nilai Diri (Shame) & Koneksi Identitas',
    theoreticalExplanation:
      'Memproses realitas melalui perhatian pada hubungan, pengakuan, citra diri, dan pertanyaan "bagaimana aku bernilai di hadapan diri sendiri dan orang lain?". Tipe 2 berfokus ke nilai melalui kepedulian eksternal, Tipe 3 melalui performa/kompetensi, dan Tipe 4 melalui kedalaman identitas batin.',
  },
  {
    id: 'Head',
    name: 'Pusat Pikiran (Head / Thinking Center)',
    types: [5, 6, 7] as EnneagramCore[],
    coreEmotion: 'Kecemasan / Ketakutan (Fear) & Antisipasi Keamanan',
    theoreticalExplanation:
      'Memproses realitas melalui pemetaan mental, antisipasi kemungkinan, dan pencarian pegangan agar merasa siap. Tipe 5 menarik diri untuk menguasai pengetahuan, Tipe 6 menguji keandalan dan bersiaga terhadap risiko, dan Tipe 7 mencari kemungkinan positif untuk meredakan rasa terjebak.',
  },
];

export interface TriadSpec {
  id: string;
  groupName: string;
  family: 'Object Relations' | 'Harmonic' | 'Hornevian';
  types: EnneagramCore[];
  theoreticalConcept: string;
  groupingReason: string;
  differencesAmongThree: string;
  relationalThemes: string;
  everydayExamples: string;
  misconceptions: string;
}

export const ENNEAGRAM_TRIADS: TriadSpec[] = [
  // Object Relations
  {
    id: 'obj-rejection',
    groupName: 'Rejection Triad (2, 5, 8)',
    family: 'Object Relations',
    types: [2, 5, 8],
    theoreticalConcept:
      'Menurut kerangka Object Relations (Riso-Hudson), tipe-tipe ini memandang secara tidak sadar bahwa kebutuhan dasar mereka berisiko ditolak lingkungan, sehingga mereka membangun kapasitas tertentu untuk ditawarkan agar tetap berdaulat atau dibutuhkan.',
    groupingReason:
      'Ketiganya cenderung menyembunyikan kerentanan kebutuhan pribadi: Tipe 2 tampil sebagai pemberi perhatian, Tipe 5 tampil sebagai sumber pengetahuan yang minim tuntutan, dan Tipe 8 tampil kuat melindungi tanpa butuh bergantung.',
    differencesAmongThree:
      'Tipe 2 merangkul secara emosional, Tipe 5 menjaga jarak agar tidak kewalahan, sedangkan Tipe 8 menegaskan batas kekuatan dan otonomi.',
    relationalThemes:
      'Kesulitan mengakui saat diri sendiri sedang rapuh dan membutuhkan bantuan tulus tanpa harus "membayar" dengan jasa, kepintaran, atau ketangguhan.',
    everydayExamples:
      'Menolak tawaran bantuan teman saat tugas menumpuk karena merasa harus tetap tampil mampu atau menjadi pihak yang menolong.',
    misconceptions:
      'Sering dikira mereka benar-benar tidak membutuhkan orang lain, padahal kebutuhan akan penerimaan tulus tetap ada hanya jarang diucapkan langsung.',
  },
  {
    id: 'obj-attachment',
    groupName: 'Attachment Triad (3, 6, 9)',
    family: 'Object Relations',
    types: [3, 6, 9],
    theoreticalConcept:
      'Tipe-tipe pada segitiga tengah Enneagram menyesuaikan diri dengan harapan, norma, atau atmosfer lingkungan guna mempertahankan keterhubungan yang stabil.',
    groupingReason:
      'Ketiganya sangat peka terhadap sinyal dari luar diri: Tipe 3 menyesuaikan diri dengan standar keberhasilan lingkungan, Tipe 6 mengacu pada aturan/kesepakatan kepercayaan, dan Tipe 9 menyelaraskan diri dengan ketenangan bersama.',
    differencesAmongThree:
      'Tipe 3 aktif mengejar pengakuan prestasi, Tipe 6 aktif menguji keamanan komitmen, sedangkan Tipe 9 cenderung melebur dengan arus sekitar untuk menjaga damai.',
    relationalThemes:
      'Tantangan membedakan keinginan autentik pribadi dari ekspektasi teman sebaya, orang tua, atau norma kelompok.',
    everydayExamples:
      'Mengubah gaya penyampaian atau pilihan topik tugas agar sesuai dengan apa yang paling mudah diterima kelompok.',
    misconceptions:
      'Keliru dianggap tidak punya pendirian sama sekali; padahal keluwesan mereka merupakan strategi menjaga koneksi sosial.',
  },
  {
    id: 'obj-frustration',
    groupName: 'Frustration Triad (1, 4, 7)',
    family: 'Object Relations',
    types: [1, 4, 7],
    theoreticalConcept:
      'Tipe-tipe ini membandingkan kenyataan saat ini dengan gambaran ideal di batin sehingga kerap merasakan celah ketidakpuasan ("seharusnya bisa lebih baik / lebih bermakna / lebih menarik").',
    groupingReason:
      'Ketiganya memiliki standar ideal internal yang kuat: Tipe 1 menginginkan ideal etika dan ketepatan, Tipe 4 menginginkan ideal kedalaman dan keaslian, dan Tipe 7 menginginkan ideal pengalaman penuh stimulasi.',
    differencesAmongThree:
      'Tipe 1 merespons celah dengan disiplin korektif, Tipe 4 merespons dengan penghayatan batin mendalam, sedangkan Tipe 7 merespons dengan mencari opsi baru yang lebih menarik.',
    relationalThemes:
      'Berpotensi merasa kecewa pada realitas kelompok kerja yang serba berkompromi jika ekspektasi ideal tidak dikomunikasikan secara realistis.',
    everydayExamples:
      'Merasa proyek kelas kurang memuaskan meski nilainya sudah baik karena belum sesuai gambaran ideal pribadi.',
    misconceptions:
      'Bukan berarti selalu mengeluh tanpa dasar; dorongan idealisme ini justru sering memacu peningkatan kualitas, kreativitas, dan inovasi.',
  },
  // Harmonic
  {
    id: 'harm-positive',
    groupName: 'Positive Outlook Triad (2, 7, 9)',
    family: 'Harmonic',
    types: [2, 7, 9],
    theoreticalConcept:
      'Ketika menghadapi kesulitan atau konflik, tipe dalam kelompok ini cenderung menekankan sisi baik, menjaga suasana tetap nyaman, atau menenangkan ketegangan terlebih dahulu.',
    groupingReason:
      'Ketiganya menghindari berlama-lama di emosi negatif berat: Tipe 2 fokus pada harapan membantu dan relasi positif, Tipe 7 fokus pada alternatif optimis, dan Tipe 9 fokus menjaga ketenangan.',
    differencesAmongThree:
      'Tipe 2 tetap aktif di sisi relasi, Tipe 7 mengalihkan ke kemungkinan baru, sedangkan Tipe 9 meminimalkan urgensi masalah agar damai.',
    relationalThemes:
      'Dapat mempercepat pemulihan semangat, namun berisiko menunda pembicaraan jujur tentang akar konflik yang tidak nyaman.',
    everydayExamples:
      'Mengatakan "nggak apa-apa, nanti juga beres kok" saat kelompok sebenarnya sedang tertinggal jauh dari tenggat.',
    misconceptions:
      'Tidak berarti mereka tidak merasakan cemas atau marah; mereka hanya memilih membungkusnya dengan optimisme atau sikap menenangkan.',
  },
  {
    id: 'harm-competency',
    groupName: 'Competency Triad (1, 3, 5)',
    family: 'Harmonic',
    types: [1, 3, 5],
    theoreticalConcept:
      'Ketika menghadapi masalah atau tekanan, tipe dalam kelompok ini menunda ekspresi emosi subjektif agar tetap objektif, teratur, dan efektif menyelesaikan persoalan.',
    groupingReason:
      'Ketiganya memercayai pengelolaan diri yang rasional: Tipe 1 mengacu pada aturan benar-salah, Tipe 3 pada langkah efisiensi pencapaian, dan Tipe 5 pada analisis fakta.',
    differencesAmongThree:
      'Tipe 1 tetap berfokus pada ketepatan standar, Tipe 3 pada hasil yang berhasil, dan Tipe 5 pada kejelasan logika sistem.',
    relationalThemes:
      'Efektif menjaga rapat tetap fokus saat krisis, tetapi rekan dari kelompok Reactive dapat merasa masalah perasaannya diabaikan.',
    everydayExamples:
      'Langsung membuat daftar koreksi dan pembagian ulang tugas ketika terjadi kesalahan presentasi tanpa membahas kekesalan tim.',
    misconceptions:
      'Sering disangka tidak berperasaan, padahal mereka memilih memproses emosi secara privat setelah masalah teknis tertangani.',
  },
  {
    id: 'harm-reactive',
    groupName: 'Reactive Triad (4, 6, 8)',
    family: 'Harmonic',
    types: [4, 6, 8],
    theoreticalConcept:
      'Ketika menghadapi kesulitan, tipe dalam kelompok ini merasakan reaksi emosional secara langsung dan mengharapkan kejujuran respons yang sama nyata dari lawan bicara.',
    groupingReason:
      'Ketiganya sulit merasa tenang dengan kepalsuan optimisme: Tipe 4 ingin perasaannya benar-benar dipahami, Tipe 6 ingin kepastian dan kewaspadaan dibahas terbuka, dan Tipe 8 ingin masalah dihadapi langsung.',
    differencesAmongThree:
      'Tipe 4 mengekspresikan kedalaman luka/keunikan, Tipe 6 menyuarakan kekhawatiran atau menguji kejelasan, dan Tipe 8 merespons dengan ketegasan konfrontatif.',
    relationalThemes:
      'Mendorong keterbukaan masalah yang nyata, tetapi bila tidak dikelola dengan bahasa asertif dapat memicu eskalasi ketegangan.',
    everydayExamples:
      'Langsung menunjukkan ketidaksetujuan saat merasa ada keputusan kelompok yang tidak jujur atau mengabaikan risiko.',
    misconceptions:
      'Bukan berarti suka mencari masalah; keterbukaan reaksi merupakan cara mereka memastikan kejujuran sebelum percaya.',
  },
  // Hornevian
  {
    id: 'horn-assertive',
    groupName: 'Assertive Triad (3, 7, 8)',
    family: 'Hornevian',
    types: [3, 7, 8],
    theoreticalConcept:
      'Kelompok yang bergerak maju menghadapi lingkungan (moving against / assertive stance) untuk meraih tujuan, ruang pengaruh, atau peluang secara langsung.',
    groupingReason:
      'Ketiganya cenderung mengambil inisiatif dan menyatakan kehendak terlebih dahulu sebelum menunggu arahan panjang.',
    differencesAmongThree:
      'Tipe 3 mengejar keberhasilan dan pengakuan, Tipe 7 mengejar stimulasi serta kebebasan opsi, dan Tipe 8 menegakkan kendali serta perlindungan batas.',
    relationalThemes:
      'Cepat menggerakkan keputusan kelompok, namun perlu memastikan ruang suara anggota yang lebih tenang tetap terbuka.',
    everydayExamples:
      'Langsung mengajukan diri menjadi pemimpin diskusi atau menentukan langkah awal proyek.',
    misconceptions:
      'Sikap proaktif tidak selalu bermaksud mendominasi; sering kali hal itu muncul karena ketidaknyamanan melihat situasi berlarut tanpa arah.',
  },
  {
    id: 'horn-compliant',
    groupName: 'Compliant Triad (1, 2, 6)',
    family: 'Hornevian',
    types: [1, 2, 6],
    theoreticalConcept:
      'Kelompok yang bergerak mendekati tanggung jawab, standar nilai, atau kesepakatan bersama (moving toward / dutiful stance) untuk memperoleh kepastian peran dan kelayakan.',
    groupingReason:
      'Ketiganya merujuk pada "apa yang seharusnya kulakukan": Tipe 1 mengacu pada standar etika internal, Tipe 2 pada kebutuhan relasional orang lain, dan Tipe 6 pada kesepakatan aturan atau kepercayaan kelompok.',
    differencesAmongThree:
      'Tipe 1 patuh pada prinsip ideal, Tipe 2 pada kepedulian sesama, dan Tipe 6 pada komitmen keamanan tim.',
    relationalThemes:
      'Menjaga keandalan tanggung jawab sosial, tetapi berisiko memendam rasa kesal bila pihak lain tampak mengabaikan kewajiban bersama.',
    everydayExamples:
      'Merasa wajib memastikan semua aturan tugas diikuti meski anggota lain tampak santai.',
    misconceptions:
      'Istilah "Compliant" dalam teori Horneyan bukan berarti penurut tanpa suara, melainkan berorientasi pada kewajiban dan tanggung jawab moral.',
  },
  {
    id: 'horn-withdrawn',
    groupName: 'Withdrawn Triad (4, 5, 9)',
    family: 'Hornevian',
    types: [4, 5, 9],
    theoreticalConcept:
      'Kelompok yang cenderung menarik diri sejenak ke ruang batin (moving away / withdrawn stance) untuk memproses pengalaman, menjaga otonomi energi, atau merawat ketenangan.',
    groupingReason:
      'Ketiganya membutuhkan ruang hening internal sebelum merespons tuntutan luar secara penuh.',
    differencesAmongThree:
      'Tipe 4 masuk ke penghayatan identitas dan perasaan, Tipe 5 masuk ke analisis konsep dan pengamatan, dan Tipe 9 masuk ke kenyamanan imajinasi atau rutinitas tenang.',
    relationalThemes:
      'Tampak tenang atau lambat merespons di rapat cepat, padahal memiliki pemikiran kaya yang baru keluar saat diberi ruang aman.',
    everydayExamples:
      'Memilih mendengarkan dulu sepanjang diskusi lalu mengirimkan rangkuman pemikiran matang setelah sesi selesai.',
    misconceptions:
      'Penarikan diri sementara bukan berarti apatis atau tidak mampu berkontribusi.',
  },
];

export const TRITYPE_TERMINOLOGY_GUIDE = {
  coreEnneagram:
    'Satu tipe utama (1–9) yang mencerminkan motivasi inti, ketakutan dasar, dan pola pertahanan paling dominan dalam sistem Enneagram seseorang.',
  threeFix:
    'Istilah deskriptif untuk mencatat tiga kecenderungan dominan dari masing-masing pusat kecerdasan (1 dari Heart: 2/3/4, 1 dari Head: 5/6/7, dan 1 dari Gut: 8/9/1) tanpa mengklaim urutan hierarkis tunggal yang kaku.',
  trifix:
    'Konsep yang berakar pada ajaran fiksasi tiga pusat (Ichazo/Naranjo) yang menyoroti bagaimana tiga fiksasi mental-emosional muncul bersama sebagai pola sekunder di luar tipe inti.',
  tritype:
    'Konvensi model Tritype® (Katherine Chernick Fauvre) yang menempatkan tipe inti (Core) selalu pada posisi pertama, diikuti dua fix dari pusat lainnya sesuai urutan kekuatan pengaruhnya—bukan sekadar diurutkan berdasarkan angka kecil ke besar atau urutan Heart-Head-Gut yang dipaksakan.',
  cautionNote:
    'Tidak setiap kombinasi tiga angka otomatis berarti Tritype yang terverifikasi secara empiris. Di DYNAMAP, pencatatan Three Fix / Trifix / Tritype bersifat hipotesis reflektif yang dapat diedit atau dikosongkan kapan saja.',
};
