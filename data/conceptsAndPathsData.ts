import type {
  ConceptComparisonResult,
  ConceptEdge,
  ConceptNode,
  EvidenceExercise,
  ExplorationScenario,
  LearningPathDefinition,
} from '../types/dynamap';

export const INITIAL_CONCEPT_NODES: ConceptNode[] = [
  // SOCIONICS INFORMATION ELEMENTS & POSITIONS
  {
    id: 'soc-te',
    shortCode: 'Te',
    label: 'Te — Extraverted Logic (Logika Ekstravert)',
    framework: 'Socionics',
    subGroup: 'Elemen Informasi',
    summary: 'Mengukur efektivitas prosedur, fakta operasional, bukti empiris, dan efisiensi eksekusi tindakan.',
    definition:
      'Dalam Socionics, Te (Logika Bisnis/Pragmatik) menyoroti keandalan data faktual, efisiensi alur kerja, biaya-manfaat metode, serta keterujian suatu langkah di dunia nyata.',
    keyMechanism:
      'Mengevaluasi apakah suatu metode bekerja secara objektif berdasarkan hasil terukur, sumber terverifikasi, dan optimasi sumber daya.',
    misconception:
      'Bukan sekadar "suka bekerja keras" atau "bos yang kaku"; Te adalah cara memproses informasi efisiensi proses dan validitas fakta eksternal.',
    targetModule: 'analisis-kepribadian',
    x: 120,
    y: 90,
  },
  {
    id: 'soc-ti',
    shortCode: 'Ti',
    label: 'Ti — Introverted Logic (Logika Introvert)',
    framework: 'Socionics',
    subGroup: 'Elemen Informasi',
    summary: 'Membangun struktur konsep yang konsisten secara internal, definisi tegas, aturan, dan relasi sebab-akibat sistematis.',
    definition:
      'Dalam Socionics, Ti (Logika Struktural) menilai koherensi antar-konsep, ketepatan klasifikasi, dan konsistensi prinsip dari premis hingga kesimpulan.',
    keyMechanism:
      'Membandingkan argumen terhadap kerangka aksioma internal untuk mendeteksi kontradiksi logis atau celah definisi.',
    misconception:
      'Tidak identik dengan "nilai matematika tinggi" atau dingin secara emosi; Ti berfokus pada koherensi struktural ide dan klasifikasi.',
    targetModule: 'analisis-kepribadian',
    x: 310,
    y: 90,
  },
  {
    id: 'soc-ne',
    shortCode: 'Ne',
    label: 'Ne — Extraverted Intuition (Intuisi Ekstravert)',
    framework: 'Socionics',
    subGroup: 'Elemen Informasi',
    summary: 'Menangkap potensi tersembunyi, kemungkinan alternatif, esensi ide, dan koneksi lintas topik.',
    definition:
      'Ne (Intuisi Kemungkinan) membaca apa yang bisa berkembang dari suatu objek, gagasan, atau individu serta membuka variasi skenario baru.',
    keyMechanism:
      'Menghubungkan pola konseptual divergen untuk memunculkan opsi alternatif sebelum mengerucut pada satu keputusan.',
    misconception:
      'Bukan berarti "tidak fokus" atau "selalu kreatif artistik"; Ne melihat ruang kemungkinan objektif dan potensi konseptual.',
    targetModule: 'analisis-kepribadian',
    x: 120,
    y: 220,
  },
  {
    id: 'soc-ni',
    shortCode: 'Ni',
    label: 'Ni — Introverted Intuition (Intuisi Introvert)',
    framework: 'Socionics',
    subGroup: 'Elemen Informasi',
    summary: 'Melacak lintasan waktu, perubahan tren jangka panjang, konsekuensi bertahap, dan keselarasan momen.',
    definition:
      'Ni (Intuisi Waktu) memproses kesinambungan sebab-akibat lintas waktu—bagaimana kondisi masa lalu berkembang menuju kecenderungan masa depan.',
    keyMechanism:
      'Menyaring informasi menjadi alur perkembangan temporal, mengantisipasi titik balik, dan menimbang ketepatan waktu tindakan.',
    misconception:
      'Bukan kemampuan meramal mistis; Ni bekerja dengan mensintesis pola perkembangan dan arah perubahan yang berlangsung perlahan.',
    targetModule: 'analisis-kepribadian',
    x: 310,
    y: 220,
  },
  {
    id: 'soc-fe',
    shortCode: 'Fe',
    label: 'Fe — Extraverted Ethics (Etika Ekstravert)',
    framework: 'Socionics',
    subGroup: 'Elemen Informasi',
    summary: 'Membaca dinamika atmosfer emosional, ekspresi perasaan bersama, semangat kelompok, dan resonansi afektif.',
    definition:
      'Fe (Etika Emosi) menangkap intensitas, nuansa, dan perubahan suasana batin dalam interaksi sosial maupun ekspresi individu.',
    keyMechanism:
      'Menyesuaikan nada bicara, ekspresi, dan ritme interaksi untuk menggerakkan keterlibatan emosional atau meredam ketegangan suasana.',
    misconception:
      'Tidak selalu berarti "ekstrovert ramah"; Fe dapat sangat kritis jika merasa atmosfer kelompok tidak selaras atau palsu.',
    targetModule: 'analisis-kepribadian',
    x: 120,
    y: 350,
  },
  {
    id: 'soc-fi',
    shortCode: 'Fi',
    label: 'Fi — Introverted Ethics (Etika Introvert)',
    framework: 'Socionics',
    subGroup: 'Elemen Informasi',
    summary: 'Menimbang kedekatan relasional, ketulusan personal, nilai etis batin, serta batas kepercayaan antarindividu.',
    definition:
      'Fi (Etika Relasi) memetakan kualitas hubungan satu-lawan-satu—apakah relasi terasa tulus, hormat, dekat, atau melanggar prinsip pribadi.',
    keyMechanism:
      'Mengevaluasi sikap batin dan niat relasional di balik tindakan seseorang serta menjaga jarak psikologis yang proporsional.',
    misconception:
      'Bukan berarti egois atau tertutup dari orang lain; Fi memprioritaskan kedalaman dan integritas relasi personal ketimbang atmosfer massal.',
    targetModule: 'analisis-kepribadian',
    x: 310,
    y: 350,
  },
  {
    id: 'soc-se',
    shortCode: 'Se',
    label: 'Se — Extraverted Sensing (Penginderaan Ekstravert)',
    framework: 'Socionics',
    subGroup: 'Elemen Informasi',
    summary: 'Membaca kesiapan konkret di lapangan, daya dorong kehendak, batas pengaruh, dan aksi langsung.',
    definition:
      'Se (Penginderaan Kekuatan/Volisional) menangkap kualitas fisik langsung, kehadiran nyata, dinamika ketegasan, dan mobilisasi sumber daya di situasi kini.',
    keyMechanism:
      'Merespons kondisi konkret secara langsung untuk menetapkan kendali ruang, ketegasan keputusan, atau mobilisasi gerak kelompok.',
    misconception:
      'Bukan sinonim dari agresivitas; dalam penggunaan sehat, Se berupa ketegasan realistis dan kepekaan terhadap kondisi lapangan.',
    targetModule: 'analisis-kepribadian',
    x: 120,
    y: 480,
  },
  {
    id: 'soc-si',
    shortCode: 'Si',
    label: 'Si — Introverted Sensing (Penginderaan Introvert)',
    framework: 'Socionics',
    subGroup: 'Elemen Informasi',
    summary: 'Memperhatikan kenyamanan fisik, keseimbangan ritme, detail sensoris, dan keselarasan lingkungan harian.',
    definition:
      'Si (Penginderaan Pengalaman/Kenyamanan) menilai bagaimana kondisi fisik, rasa, kecepatan kerja, dan kebiasaan memengaruhi kesejahteraan langsung.',
    keyMechanism:
      'Menjaga keberlanjutan ritme yang nyaman, mengidentifikasi ketidaknyamanan kecil sejak dini, dan merapikan kondisi praktis sekitar.',
    misconception:
      'Tidak sama dengan kemalasan atau sekadar nostalgia; Si memperhatikan kualitas proses sensorik dan keberlanjutan energi fisik.',
    targetModule: 'analisis-kepribadian',
    x: 310,
    y: 480,
  },
  {
    id: 'soc-polr',
    shortCode: 'PoLR',
    label: 'Fungsi PoLR (Titik Rentan / Vulnerable)',
    framework: 'Socionics',
    subGroup: 'Posisi Model A',
    summary: 'Fungsi ke-4 Model A (1D, unvalued) yang sering memicu kelelahan atau sensitivitas bila dituntut terus-menerus.',
    definition:
      'Point of Least Resistance (PoLR) adalah elemen yang paling sulit diproses secara fleksibel karena bergantung pada pengalaman terbatas dan tidak dianggap bernilai utama.',
    keyMechanism:
      'Kritik keras pada area PoLR mudah terasa mengancam atau membingungkan, sehingga dukungan yang ramah jauh lebih efektif daripada tekanan.',
    misconception:
      'PoLR tidak berarti mustahil dipelajari; seseorang tetap bisa melatih keterampilan terkait melalui metode terstruktur yang tidak menekan.',
    targetModule: 'analisis-kepribadian',
    x: 490,
    y: 140,
  },
  {
    id: 'soc-quadra',
    shortCode: 'Quadra',
    label: 'Quadra (Alpha · Beta · Gamma · Delta)',
    framework: 'Socionics',
    subGroup: 'Kelompok Nilai',
    summary: 'Pengelompokan 4 tipe Socionics yang sama-sama menghargai empat elemen informasi tertentu.',
    definition:
      'Setiap Quadra berbagi empat elemen bernilai (valued) dan gaya komunikasi umum, walau tiap anggotanya tetap berbeda peran dan prioritas.',
    keyMechanism:
      'Menjelaskan kecenderungan topik diskusi yang dirasa menghidupkan atau melelahkan tanpa menentukan kecocokan otomatis.',
    misconception:
      'Satu Quadra tidak menjamin bebas konflik—perbedaan latar belakang, Psikosofi, dan kebiasaan tetap dapat memicu gesekan.',
    targetModule: 'eksplorasi-quadra',
    x: 490,
    y: 290,
  },

  // PSIKOSOFI
  {
    id: 'psy-1l',
    shortCode: '1L',
    label: '1L — Logika Pertama (Dogmatis / Hasil)',
    framework: 'Psikosofi',
    subGroup: 'Penempatan Logika',
    summary: 'Logika berorientasi hasil dan percaya diri (Self-Positive, Others-Negative).',
    definition:
      'Pada posisi 1L, pemahaman konseptual dipandang sebagai ranah otonom pribadi: cepat merumuskan kesimpulan dan kurang berminat memperdebatkan dasar yang sudah diyakini.',
    keyMechanism:
      'Menyaring informasi melalui kesimpulan final; diskusi panjang tanpa titik temu mudah terasa melelahkan jika sudah yakin.',
    misconception:
      'Berbeda dari Ti Socionics: 1L berbicara soal sikap otoritas dan hasil pada domain nalar, bukan jenis informasi struktural.',
    targetModule: 'psikosofi',
    x: 680,
    y: 90,
  },
  {
    id: 'psy-2l',
    shortCode: '2L',
    label: '2L — Logika Kedua (Fleksibel / Proses)',
    framework: 'Psikosofi',
    subGroup: 'Penempatan Logika',
    summary: 'Logika berorientasi proses dan dialogis (Self-Positive, Others-Positive).',
    definition:
      'Pada posisi 2L, diskusi intelektual dinikmati sebagai proses tukar pikiran dua arah—percaya diri menyusun argumen sekaligus terbuka menguji sudut pandang lain.',
    keyMechanism:
      'Mengajukan pertanyaan pembanding, menyesuaikan penjelasan dengan lawan bicara, dan nyaman berada di proses diskusi terbuka.',
    misconception:
      'Tidak berarti "tidak punya pendirian"; 2L justru kuat secara rasional namun memandang dialog sebagai ruang eksplorasi sehat.',
    targetModule: 'psikosofi',
    x: 860,
    y: 90,
  },
  {
    id: 'psy-1v',
    shortCode: '1V',
    label: '1V — Kehendak Pertama (Tegas / Otonom)',
    framework: 'Psikosofi',
    subGroup: 'Penempatan Kehendak',
    summary: 'Orientasi arah diri yang mandiri, tegas menentukan prioritas, dan bertanggung jawab penuh atas keputusan.',
    definition:
      '1V (Self-Positive, Others-Negative) memandang tujuan dan pengambilan keputusan sebagai kompas pribadi yang tidak mudah dikompromikan dari luar.',
    keyMechanism:
      'Mengambil inisiatif arah sebelum menunggu konsensus panjang; peka jika otonomi keputusannya dibatasi sepihak.',
    misconception:
      'Tidak selalu berteriak atau mendominasi orang lain; 1V bisa tenang namun sangat sulit digoyahkan dalam keputusan pribadinya.',
    targetModule: 'psikosofi',
    x: 680,
    y: 220,
  },
  {
    id: 'psy-3v',
    shortCode: '3V',
    label: '3V — Kehendak Ketiga (Rentan / Negosiasi)',
    framework: 'Psikosofi',
    subGroup: 'Penempatan Kehendak',
    summary: 'Sangat peduli pada otonomi dan martabat keputusan, namun mudah bimbang atau waspada terhadap tekanan luar.',
    definition:
      '3V (Self-Negative, Others-Negative) sensitif terhadap isu kendali, keadilan posisi, dan ketakutan dianggap lemah atau gagal mengarahkan diri.',
    keyMechanism:
      'Memerlukan negosiasi setara dan pengakuan niat; dapat bereaksi defensif saat merasa diarahkan secara otoriter.',
    misconception:
      'Bukan berarti "tidak punya ambisi"; 3V sering memiliki standar pencapaian tinggi namun berhati-hati dalam memercayai otonomi diri maupun pihak lain.',
    targetModule: 'psikosofi',
    x: 860,
    y: 220,
  },
  {
    id: 'psy-2e',
    shortCode: '2E',
    label: '2E — Emosi Kedua (Ekspresif & Dialogis)',
    framework: 'Psikosofi',
    subGroup: 'Penempatan Emosi',
    summary: 'Terbuka dalam mengekspresikan perasaan sekaligus peka merespons kondisi emosional orang lain.',
    definition:
      '2E memperlakukan suasana emosional sebagai medium interaksi kreatif yang bisa disesuaikan dengan kebutuhan lawan bicara.',
    keyMechanism:
      'Membangun keterhubungan afektif secara fleksibel tanpa kehilangan keseimbangan pribadi.',
    misconception:
      'Berbeda dengan Fe Socionics yang memetakan dinamika informasi emosional objektif; 2E menggambarkan sikap percaya diri & proses dalam ranah emosi.',
    targetModule: 'psikosofi',
    x: 680,
    y: 350,
  },
  {
    id: 'psy-3f',
    shortCode: '3F',
    label: '3F — Fisika Ketiga (Peka Kondisi Fisik)',
    framework: 'Psikosofi',
    subGroup: 'Penempatan Fisika',
    summary: 'Cermat terhadap detail kenyamanan, kebersihan, rasa aman tubuh, atau sumber daya material namun mudah cemas atasnya.',
    definition:
      '3F memproses aspek material, kesehatan, dan lingkungan fisik secara serius dengan kebutuhan kepastian dan kendali yang terukur.',
    keyMechanism:
      'Memeriksa kelayakan kondisi kerja atau kebersihan ruang dengan teliti; rasa tidak nyaman mudah memengaruhi fokus.',
    misconception:
      'Berbeda dari Si Socionics: 3F mencerminkan kepekaan sekaligus keraguan evaluatif dalam domain fisik.',
    targetModule: 'psikosofi',
    x: 860,
    y: 350,
  },

  // ENNEAGRAM
  {
    id: 'enn-triad',
    shortCode: 'Triad',
    label: 'Triad Enneagram (Instinktual · Jantung · Kepala)',
    framework: 'Enneagram',
    subGroup: 'Struktur Pusat',
    summary: 'Tiga pusat kecerdasan & respons emosional inti: Perut/Gut (8,9,1), Hati/Heart (2,3,4), Kepala/Head (5,6,7).',
    definition:
      'Triad mengelompokkan pola pertahanan psikologis terhadap isu dasar kemarahan/otonomi (Gut), citra/penghargaan (Heart), atau kecemasan/kepastian (Head).',
    keyMechanism:
      'Menunjukkan sumber ketegangan motivasi batin saat menghadapi tekanan sosial maupun tugas.',
    misconception:
      'Triad bukan kemampuan kognitif; tipe Kepala tidak selalu lebih analitis, dan tipe Hati tidak selalu lebih emosional secara lahiriah.',
    targetModule: 'analisis-kepribadian',
    x: 490,
    y: 430,
  },
  {
    id: 'enn-instinct',
    shortCode: 'SP/SO/SX',
    label: 'Varian Instingtual (SP · SO · SX)',
    framework: 'Enneagram',
    subGroup: 'Insting & Stacking',
    summary: 'Tiga fokus perhatian biologis-sosial: Self-Preservation (SP), Social (SO), dan Sexual / One-to-One (SX).',
    definition:
      'Insting mengarahkan energi inti tipe Enneagram ke ranah keberlangsungan pribadi & kestabilan (SP), peran & dinamika kelompok (SO), atau intensitas daya tarik spesifik (SX).',
    keyMechanism:
      'Dua orang bertipe inti sama (misal SP4 vs SO4) dapat tampak sangat berbeda di keseharian karena prioritas instingnya berlainan.',
    misconception:
      'SO bukan berarti "ekstrovert suka pesta", dan SX bukan semata soal romansa; ini adalah fokus perhatian terhadap relasi dan intensitas.',
    targetModule: 'analisis-kepribadian',
    x: 680,
    y: 480,
  },
  {
    id: 'enn-tritype',
    shortCode: 'Tritype',
    label: 'Tritype vs Trifix (Tiga Pusat)',
    framework: 'Enneagram',
    subGroup: 'Konfigurasi Lanjutan',
    summary: 'Kombinasi satu tipe dominan dari masing-masing pusat (Head + Heart + Gut) yang memperkaya nuansa motivasi.',
    definition:
      'Trifix/Tritype menjelaskan bagaimana seseorang menggunakan strategi cadangan dari ketiga pusat kecerdasan di luar tipe intinya.',
    keyMechanism:
      'Membedakan motivasi inti utama dengan pola pelengkap (misalnya 351 vs 379 sama-sama Core 3 dengan nuansa pendekatan berbeda).',
    misconception:
      'Tidak menggantikan tipe inti (Core) atau urutan insting; hanya memberi konteks tambahan yang bersifat sekunder.',
    targetModule: 'analisis-kepribadian',
    x: 860,
    y: 480,
  },

  // JUNGIAN
  {
    id: 'jung-func',
    shortCode: 'Fungsi Jung',
    label: 'Notasi Jungian Klasik (mis. ET(N), IF(S))',
    framework: 'Tipologi Jung',
    subGroup: 'Psikologi Analitik',
    summary: 'Orientasi kesadaran utama (E/I) dan fungsi rasional/irasional dominan serta bantu menurut C.G. Jung.',
    definition:
      'Dalam tradisi Jungian klasik, kode seperti ET(N) menandakan Thinking Ekstravert sebagai fungsi utama dengan Intuisi sebagai fungsi bantu.',
    keyMechanism:
      'Menggambarkan orientasi sikap sadar dan peran kompensasi fungsi yang kurang disadari.',
    misconception:
      'Walau menginspirasi Socionics dan MBTI, definisi fungsi Jung tidak identik 1-banding-1 dengan elemen informasi Model A.',
    targetModule: 'analisis-kepribadian',
    x: 490,
    y: 560,
  },
];

export const INITIAL_CONCEPT_EDGES: ConceptEdge[] = [
  {
    id: 'edge-te-ti',
    sourceId: 'soc-te',
    targetId: 'soc-ti',
    relationshipType: 'Same Framework',
    label: 'Pasangan Logika Eksternal vs Internal',
    explanation:
      'Keduanya berada di domain Logika Socionics: Te menilai efektivitas prosedur & bukti empiris, sedangkan Ti mengecek koherensi struktur & konsistensi konsep.',
    cautionNote: 'Menggunakan Ti dengan kuat tidak otomatis meniadakan minat pada praktik; keduanya saling melengkapi saat bekerja sama.',
  },
  {
    id: 'edge-ne-ni',
    sourceId: 'soc-ne',
    targetId: 'soc-ni',
    relationshipType: 'Same Framework',
    label: 'Variasi Kemungkinan vs Lintasan Waktu',
    explanation:
      'Ne memperluas opsi dan potensi konseptual di banyak arah, sementara Ni menyaring pola perkembangan lintas waktu menuju arah tunggal.',
    cautionNote: 'Perbedaan keduanya bukan antara "kreatif" vs "visioner", melainkan cara mengolah peluang vs alur temporal.',
  },
  {
    id: 'edge-fe-fi',
    sourceId: 'soc-fe',
    targetId: 'soc-fi',
    relationshipType: 'Same Framework',
    label: 'Atmosfer Emosional vs Relasi Personal',
    explanation:
      'Fe berfokus pada dinamika ekspresi emosional bersama, sedangkan Fi menilai kedekatan, ketulusan, dan batas etis antarindividu.',
    cautionNote: 'Keduanya sama-sama ranah Etika dalam Socionics, namun sering salah kaprah dianggap sama dengan empati atau kesopanan semata.',
  },
  {
    id: 'edge-se-si',
    sourceId: 'soc-se',
    targetId: 'soc-si',
    relationshipType: 'Same Framework',
    label: 'Ketegasan Situasi Kini vs Keseimbangan Sensoris',
    explanation:
      'Se membaca kesiapan mobilisasi & batas pengaruh langsung, sedangkan Si merawat kenyamanan proses fisik dan keseimbangan ritme.',
    cautionNote: 'Baik Se maupun Si sama-sama berorientasi pada realitas indrawi konkret, bukan konsep abstrak.',
  },
  {
    id: 'edge-ti-quadra',
    sourceId: 'soc-ti',
    targetId: 'soc-quadra',
    relationshipType: 'Structural Relationship',
    label: 'Nilai Inti Quadra Alpha & Beta',
    explanation:
      'Quadra Alpha (bersama Ne, Fe, Si) dan Beta (bersama Ni, Fe, Se) menempatkan Ti dalam jajaran elemen bernilai.',
    cautionNote: 'Memiliki elemen bernilai sama tidak menjamin dua tipe berada di Quadra yang sama.',
  },
  {
    id: 'edge-polr-quadra',
    sourceId: 'soc-polr',
    targetId: 'soc-quadra',
    relationshipType: 'Structural Relationship',
    label: 'Titik Sensitif di Luar Nilai Quadra',
    explanation:
      'Fungsi PoLR selalu merupakan elemen yang tidak dihargai (unvalued) sekaligus berada pada dimensi paling terbatas (1D).',
    cautionNote: 'Mengetahui PoLR berguna untuk menghindari kritik menekan, bukan untuk membatasi kompetensi siswa.',
  },
  {
    id: 'edge-ti-1l',
    sourceId: 'soc-ti',
    targetId: 'psy-1l',
    relationshipType: 'Conceptual Similarity',
    label: 'Sering Tertukar — Beda Domain Teori',
    explanation:
      'Ti mengukur struktur konsistensi logika dalam sistem informasi Socionics, sedangkan 1L menunjukkan sikap hasil & keyakinan mandiri dalam domain Logika Psikosofi.',
    cautionNote: 'Seseorang bisa saja bukan tipe Ti Leading di Socionics namun memiliki 1L, atau sebaliknya.',
  },
  {
    id: 'edge-1l-2l',
    sourceId: 'psy-1l',
    targetId: 'psy-2l',
    relationshipType: 'Same Framework',
    label: 'Logika Hasil vs Logika Proses',
    explanation:
      '1L (Self+, Others-) lebih tertarik pada kesimpulan akhir yang mantap, sedangkan 2L (Self+, Others+) menikmati dialog, perdebatan ramah, dan penjelajahan sudut pandang.',
    cautionNote: 'Kedua posisi tetap menghargai kapasitas nalar pribadi, berbeda pada keterbukaan prosesnya.',
  },
  {
    id: 'edge-1v-3v',
    sourceId: 'psy-1v',
    targetId: 'psy-3v',
    relationshipType: 'Same Framework',
    label: 'Otonomi Mantap vs Negosiasi Hati-Hati',
    explanation:
      '1V mengambil keputusan sebagai wilayah privat yang tegas; 3V sama-sama peduli kedaulatan diri namun rentan terhadap tekanan atau ketidakjelasan posisi.',
    cautionNote: 'Di kelas, 1V dan 3V membutuhkan kejelasan peran agar inisiatif tidak terasa sebagai pemaksaan.',
  },
  {
    id: 'edge-se-1v',
    sourceId: 'soc-se',
    targetId: 'psy-1v',
    relationshipType: 'Analogy',
    label: 'Kemiripan Permukaan pada Ketegasan',
    explanation:
      'Di mata pengamat awam, ketegasan kehendak 1V dan kesiapan mobilisasi Se kerap terlihat mirip dalam situasi rapat kelompok.',
    cautionNote: 'Analogi semata! Banyak individu tanpa Se bernilai memiliki 1V yang tenang namun teguh.',
  },
  {
    id: 'edge-fe-2e',
    sourceId: 'soc-fe',
    targetId: 'psy-2e',
    relationshipType: 'Cross-Framework Association',
    label: 'Pengaruh ke Ekspresi Atmosfer Kelas',
    explanation:
      'Fe menjelaskan elemen informasi yang ditangkap (suasana emosional), sementara 2E menjelaskan kenyamanan prosedural mengekspresikan & memediasi emosi.',
    cautionNote: 'Tidak ada padanan wajib antara tipe Socionics tertentu dengan posisi Psikosofi tertentu.',
  },
  {
    id: 'edge-si-3f',
    sourceId: 'soc-si',
    targetId: 'psy-3f',
    relationshipType: 'Conceptual Similarity',
    label: 'Sama-Sama Peka Detail Fisik, Beda Sikap',
    explanation:
      'Keduanya menaruh perhatian pada kenyamanan fisik dan lingkungan, tetapi 3F disertai ketelitian evaluatif yang mudah lelah bila kondisi fisik berantakan.',
    cautionNote: 'Jangan menyimpulkan Si berarti 1F/2F/3F secara otomatis.',
  },
  {
    id: 'edge-enn-psy-indep',
    sourceId: 'enn-instinct',
    targetId: 'psy-3v',
    relationshipType: 'Independent Concepts',
    label: 'Kerangka Terpisah (Motivasi vs Sikap Aspek)',
    explanation:
      'Enneagram menjelaskan pola ketakutan & fokus motivasi instingtual, sedangkan Psikosofi memetakan prioritas sikap atas empat aspek L·V·E·F.',
    cautionNote: 'Hindari "mengonversi" tipe Enneagram menjadi tipe Psikosofi tanpa observasi terpisah.',
  },
  {
    id: 'edge-jung-soc',
    sourceId: 'jung-func',
    targetId: 'soc-ti',
    relationshipType: 'Cross-Framework Association',
    label: 'Akar Sejarah & Evolusi Definisi',
    explanation:
      'Tipologi Jung meletakkan fondasi konsep sikap (E/I) dan 4 fungsi yang kemudian dikembangkan secara struktural oleh Augusta ke dalam Model A Socionics.',
    cautionNote: 'Kode Jungian klasik tidak selalu berkorespondensi sama persis dengan kebiasaan konversi MBTI.',
  },
  {
    id: 'edge-triad-tritype',
    sourceId: 'enn-triad',
    targetId: 'enn-tritype',
    relationshipType: 'Same Framework',
    label: 'Struktur Tiga Pusat Pembentuk Tritype',
    explanation:
      'Tritype/Trifix disusun dengan mengambil satu perwakilan dari tiap Triad: Hati (2/3/4), Kepala (5/6/7), dan Perut/Gut (8/9/1).',
    cautionNote: 'Analisis utama tetap berangkat dari tipe inti (Core) dan fokus instingnya.',
  },
];

export const CURATED_COMPARISONS: ConceptComparisonResult[] = [
  {
    id: 'cmp-te-ti',
    conceptIds: ['soc-te', 'soc-ti'],
    title: 'Te vs Ti — Logika Pragmatik vs Logika Struktural',
    definitions: [
      {
        code: 'Te',
        name: 'Extraverted Logic',
        framework: 'Socionics',
        definition:
          'Pemrosesan fakta objektif, keandalan metode kerja, pengukuran efisiensi proses, dan keterujian hasil nyata.',
      },
      {
        code: 'Ti',
        name: 'Introverted Logic',
        framework: 'Socionics',
        definition:
          'Penyusunan struktur konseptual yang konsisten, definisi presisi, relasi sebab-akibat internal, dan hukum sistematis.',
      },
    ],
    sharedCharacteristics: [
      'Keduanya termasuk dalam pasangan elemen Logika (berbasis kriteria rasional-impersonal, bukan preferensi emosional pribadi).',
      'Sama-sama mengutamakan kejelasan alasan, bukti/argumen yang bisa diuji, dan penolakan atas inkonsistensi yang membingungkan kerja tim.',
    ],
    fundamentalDifferences: [
      'Tolok ukur validitas: Te memeriksa "apakah metode ini bekerja dengan efisien dan didukung fakta terukur di lapangan?", sedangkan Ti memeriksa "apakah argumen dan aturannya konsisten tanpa kontradiksi internal?".',
      'Orientasi informasi: Te bersifat dinamis-eksternal (mengamati alur kerja, data perubahan, biaya-manfaat), sementara Ti bersifat statis-internal (membangun kategori, hierarki definisi, dan prinsip dasar).',
    ],
    theoreticalAssumptions: [
      'Model A memandang semua manusia memiliki baik Te maupun Ti; perbedaannya terletak pada posisi mana yang sadar, bernilai (valued), dan berdimensi kuat.',
    ],
    coreMechanisms: [
      'Te menyederhanakan prosedur berbelit menjadi langkah kerja yang realistis dan berbasis bukti eksternal.',
      'Ti membongkar kesalahpahaman istilah agar setiap pihak sepakat pada kerangka aturan dan definisi yang sama.',
    ],
    everydayExamples: [
      'Dalam proyek sains SMA: pengguna Te bernilai mengecek alat mana yang paling akurat dan hemat waktu uji coba, sementara pengguna Ti bernilai memastikan definisi variabel penelitian tidak tumpang tindih.',
    ],
    commonMisconceptions: [
      'Keliru menganggap "Te hanya peduli praktik tanpa teori" atau "Ti hanya berteori tanpa bisa bekerja". Kedua fungsi dapat menghasilkan karya ilmiah maupun rekayasa yang kuat dengan titik masuk berbeda.',
    ],
    whenTheyLookSimilar: [
      'Saat sama-sama mengkritik presentasi kelompok yang datanya rancu: Te menyorot ketidakakuratan prosedur/sumber data, sedangkan Ti menyorot lompatan kesimpulan yang tidak logis.',
    ],
    distinguishingQuestions: [
      'Ketika rencana kelas terasa kacau, mana yang pertama kali mengganggu Anda: langkah kerjanya yang boros waktu (Te) atau aturannya yang saling bertabrakan (Ti)?',
      'Apakah Anda lebih puas saat menemukan metode yang langsung meningkatkan hasil nyata, atau saat berhasil merumuskan prinsip yang menjelaskan mengapa sesuatu bekerja?',
    ],
    analyticalLimitations: [
      'Kebiasaan sekolah atau tuntutan tugas laboratorium dapat melatih kedua pola pikir ini terlepas dari tipe Socionics seseorang.',
    ],
    crossFrameworkCaution:
      'Kedua konsep berada di dalam kerangka Socionics; jangan disamakan langsung dengan 1L vs 2L dalam Psikosofi.',
  },
  {
    id: 'cmp-ne-ni',
    conceptIds: ['soc-ne', 'soc-ni'],
    title: 'Ne vs Ni — Intuisi Kemungkinan vs Intuisi Waktu',
    definitions: [
      {
        code: 'Ne',
        name: 'Extraverted Intuition',
        framework: 'Socionics',
        definition:
          'Menangkap ragam potensi, esensi ide, sudut pandang alternatif, serta cabang kemungkinan yang terbuka dari suatu situasi.',
      },
      {
        code: 'Ni',
        name: 'Introverted Intuition',
        framework: 'Socionics',
        definition:
          'Melacak arah perkembangan lintas waktu, perubahan tren bertahap, sebab-akibat jangka panjang, dan ketepatan momentum.',
      },
    ],
    sharedCharacteristics: [
      'Keduanya memproses pola konseptual di balik fakta indrawi langsung (sama-sama elemen Intuisi dalam Model A).',
      'Keduanya cenderung mencari makna yang tidak kasatmata di permukaan kejadian.',
    ],
    fundamentalDifferences: [
      'Arah gerak persepsi: Ne memekarkan satu topik menjadi banyak kemungkinan paralel (divergen), sedangkan Ni memadatkan banyak gejala menjadi satu garis tren waktu (konvergen).',
      'Fokus perhatian: Ne peka terhadap potensi inovasi atau sifat asli suatu objek/orang, sementara Ni peka terhadap risiko keterlambatan, konsekuensi jangka panjang, dan ritme perubahan.',
    ],
    theoreticalAssumptions: [
      'Dalam Model A, seseorang yang menghargai Ne (Alpha/Delta) tidak menghargai Ni, dan sebaliknya (Beta/Gamma menghargai Ni). Namun ketidak-penghargaan tidak berarti ketidaksanggupan total.',
    ],
    coreMechanisms: [
      'Ne membuka ruang brainstorming untuk menghindari kebuntuan satu sudut pandang.',
      'Ni menjaga proyek agar tidak meleset dari lintasan hasil jangka panjang yang realistis.',
    ],
    everydayExamples: [
      'Memilih topik karya ilmiah: pengguna Ne tertarik mengumpulkan 6 ide lintas bidang yang unik; pengguna Ni fokus menelusuri tren masalah 5 tahun ke depan dari satu isu utama.',
    ],
    commonMisconceptions: [
      'Bukan berarti Ne tidak bisa selesai tepat waktu atau Ni selalu pasif merenung; keduanya bisa aktif maupun reflektif.',
    ],
    whenTheyLookSimilar: [
      'Ketika memprediksi dampak suatu kebijakan OSIS: keduanya sama-sama berbicara tentang "kemungkinan ke depan", meski Ne menimbang variasi skenario, sedangkan Ni menyorot alur eskalasinya.',
    ],
    distinguishingQuestions: [
      'Saat memikirkan masa depan, apakah Anda lebih bersemangat mengeksplorasi berbagai cabang jalan alternatif (Ne) atau memahami ke mana kondisi saat ini hampir pasti bermuara seiring waktu (Ni)?',
    ],
    analyticalLimitations: [
      'Kedua pola imajinasi abstrak sering dipengaruhi tingkat kelelahan, rasa aman berpendapat di kelas, dan pengetahuan dasar subjek.',
    ],
    crossFrameworkCaution:
      'Penggunaan istilah "Intuisi" dalam Socionics memiliki definisi elemen informasi spesifik yang lebih teknis daripada makna populer sehari-hari.',
  },
  {
    id: 'cmp-1l-2l',
    conceptIds: ['psy-1l', 'psy-2l'],
    title: '1L vs 2L — Otoritas Hasil vs Dialog Proses (Psikosofi)',
    definitions: [
      {
        code: '1L',
        name: 'Logika Pertama',
        framework: 'Psikosofi',
        definition:
          'Posisi Self-Positive, Others-Negative & Result-oriented pada aspek Logika: percaya penuh pada penalaran sendiri dan cepat mengunci kesimpulan.',
      },
      {
        code: '2L',
        name: 'Logika Kedua',
        framework: 'Psikosofi',
        definition:
          'Posisi Self-Positive, Others-Positive & Process-oriented pada aspek Logika: percaya pada kemampuan nalar diri sekaligus terbuka berdialog aktif dengan argumen lain.',
      },
    ],
    sharedCharacteristics: [
      'Sama-sama memiliki sikap positif terhadap kapasitas intelektual pribadi (Self-Positive) — tidak mudah panik hanya karena berbeda pendapat.',
      'Keduanya memandang kejelasan konsep dan argumen rasional sebagai bagian penting kehidupan.',
    ],
    fundamentalDifferences: [
      'Sikap terhadap sudut pandang luar: 1L lebih melihat pendapat lain sebagai informasi pelengkap/pengganggu yang tidak menggoyahkan kesimpulan pribadi, sedangkan 2L memandang lawan bicara sebagai mitra dialektika.',
      'Orientasi proses vs hasil: 1L ingin segera sampai pada formulasi jawaban yang utuh, sedangkan 2L justru menikmati proses membolak-balik argumen.',
    ],
    theoreticalAssumptions: [
      'Psikosofi memisahkan posisi berorientasi hasil (1 & 4) dengan posisi berorientasi proses (2 & 3). Kesalahan umum adalah menyamakan semua "orang pintar" dengan 1L.',
    ],
    coreMechanisms: [
      '1L: merangkum cepat -> merumuskan prinsip -> selesai (hemat energi debat).',
      '2L: menguji asumsi bersama -> menyesuaikan penjelasan -> terbuka merevisi bagian argumen.',
    ],
    everydayExamples: [
      'Dalam diskusi kelompok: 1L cenderung langsung menyampaikan intisari kesimpulan dan keberatan jika berputar-putar; 2L senang menjadi moderator konseptual yang memancing ide tiap teman.',
    ],
    commonMisconceptions: [
      '1L bukan berarti "keras kepala tanpa alasan", dan 2L bukan berarti "tidak punya pendirian".',
    ],
    whenTheyLookSimilar: [
      'Sama-sama tampak percaya diri dan terstruktur saat menjelaskan materi di depan kelas.',
    ],
    distinguishingQuestions: [
      'Ketika sudah yakin pada jawaban Anda dan ada teman mengajak berdiskusi ulang dari nol, apakah Anda merasa tertarik mengeksplorasi celah baru (2L) atau merasa pembahasannya membuang energi karena intinya sudah jelas (1L)?',
    ],
    analyticalLimitations: [
      'Ketidaknyamanan terhadap diskusi bisa pula dipengaruhi oleh kelelahan, kedekatan relasi, atau posisi Volition (1V vs 3V).',
    ],
    crossFrameworkCaution:
      'Posisi Logika Psikosofi tidak bergantung pada apakah seseorang menggunakan Ti atau Te di Socionics.',
  },
  {
    id: 'cmp-ti-1l',
    conceptIds: ['soc-ti', 'psy-1l'],
    title: 'Ti (Socionics) vs 1L (Psikosofi) — Lintas Kerangka',
    definitions: [
      {
        code: 'Ti',
        name: 'Introverted Logic',
        framework: 'Socionics',
        definition: 'Elemen informasi yang menilai keterkaitan struktural, definisi, hukum logis, dan sistem klasifikasi.',
      },
      {
        code: '1L',
        name: 'Logika Pertama',
        framework: 'Psikosofi',
        definition: 'Sikap eksistensial yang memprioritaskan keyakinan nalar pribadi, kesimpulan cepat, dan otonomi opini rasional.',
      },
    ],
    sharedCharacteristics: [
      'Keduanya sering diasosiasikan dengan ketelitian konsep dan kemandirian berpikir dalam isu intelektual.',
    ],
    fundamentalDifferences: [
      'Apa yang diukur berbeda total: Socionics Ti menjelaskan *bagaimana informasi struktural diproses* (kognisi informasi), sedangkan Psikosofi 1L menjelaskan *bagaimana seseorang bersikap dan memosisikan kepercayaan dirinya terhadap aspek Logika* (hierarki sikap).',
      'Pengguna Ti kuat di Socionics dapat memiliki 2L (sangat dialogis) atau 3L (ragu dan perfeksionis dalam nalar), bukan hanya 1L.',
    ],
    theoreticalAssumptions: [
      'Socionics dan Psikosofi adalah dua sistem independen. Menganggap Ti Leading "pasti 1L" adalah kesalahan kategori lintas sistem.',
    ],
    coreMechanisms: [
      'Ti mengecek "apakah struktur definisinya konsisten?", sementara 1L berujar "penalaran ini sudah tuntas bagi saya."',
    ],
    everydayExamples: [
      'Seorang LII (Ti Leading) dengan 2L senang meluruskan definisi lewat diskusi santai berjam-jam; sebaliknya seorang EIE atau LIE dengan 1L bisa sangat tegas dengan sintesis faktanya dan enggan berdebat hal dasar.',
    ],
    commonMisconceptions: [
      'Kesalahpahaman paling umum adalah mencampuradukkan istilah "Logika" yang sama namanya di kedua sistem seolah bermakna sama.',
    ],
    whenTheyLookSimilar: [
      'Saat sama-sama menolak penjelasan yang tidak masuk akal dan berpegang pada kesimpulan rasional pribadi.',
    ],
    distinguishingQuestions: [
      'Pisahkan dua pertanyaan: (1) Jenis informasi apa yang paling alami Anda cerna (struktur definisi Ti vs efektivitas Te)? dan (2) Bagaimana sikap Anda terhadap diskusi intelektual (tutup hasil 1L vs dialog proses 2L vs ragu/sensitif 3L)?',
    ],
    analyticalLimitations: [
      'Self-typing yang menggabungkan kedua sistem sekaligus sering memicu bias konfirmasi.',
    ],
    crossFrameworkCaution:
      'Tidak ada relasi satu-ke-satu maupun validasi wajib antara elemen Socionics dan posisi Psikosofi.',
  },
];

export const GUIDED_LEARNING_PATHS: LearningPathDefinition[] = [
  {
    id: 'lp-socionics',
    framework: 'Socionics',
    title: 'Jalur Belajar Terpandu: Socionics & Model A',
    description:
      'Urutan bertahap memahami cara Socionics memetakan pemrosesan informasi tanpa terjebak stereotip tipe.',
    steps: [
      {
        id: 'lp-soc-1',
        stepNumber: 1,
        title: 'Pengenalan 8 Elemen Informasi (IMEs)',
        summary: 'Pahami perbedaan logika (Te/Ti), etika (Fe/Fi), intuisi (Ne/Ni), dan penginderaan (Se/Si).',
        prerequisiteIds: [],
        estimatedMinutes: 10,
        targetModule: 'analisis-kepribadian',
        keyTakeaways: [
          'Setiap elemen membaca aspek realitas yang berbeda.',
          'Ekstravert berfokus pada objek/dinamika luar; Introvert berfokus pada relasi antarobjek/kondisi internal.',
        ],
        selfCheckPrompt: 'Dapatkah kamu membedakan Te vs Ti tanpa memakai stereotip "praktis vs akademis"?',
      },
      {
        id: 'lp-soc-2',
        stepNumber: 2,
        title: 'Struktur 8 Fungsi Model A',
        summary: 'Pelajari peran Leading, Creative, Role, PoLR, Suggestive, Mobilizing, Ignoring, dan Demonstrative.',
        prerequisiteIds: ['lp-soc-1'],
        estimatedMinutes: 12,
        targetModule: 'analisis-kepribadian',
        keyTakeaways: [
          'Dimensi kekuatan (1D–4D) berbeda dari apakah fungsi itu bernilai (Valued vs Unvalued).',
          'PoLR (ke-4) bersifat sensitif namun tetap bisa dilatih secara ramah.',
        ],
        selfCheckPrompt: 'Mengapa fungsi ke-7 (Ignoring) sering tampak cakap tetapi tidak dianggap prioritas nilai?',
      },
      {
        id: 'lp-soc-3',
        stepNumber: 3,
        title: 'Empat Quadra & Nilai Informasi Kelompok',
        summary: 'Telusuri Alpha, Beta, Gamma, dan Delta serta dinamika kelas lintas anggota.',
        prerequisiteIds: ['lp-soc-2'],
        estimatedMinutes: 10,
        targetModule: 'eksplorasi-quadra',
        keyTakeaways: [
          'Quadra berbagi 4 elemen bernilai namun tiap individu tetap berbeda kepribadian dan latar belakang.',
          'Kesamaan Quadra tidak otomatis menghapus risiko kesalahpahaman.',
        ],
        selfCheckPrompt: 'Apa dua perbedaan utama antara anggota Quadra yang sama seperti LIE dan ESI?',
      },
      {
        id: 'lp-soc-4',
        stepNumber: 4,
        title: 'Direktori 16 Tipe & Akar Tipologi Jung',
        summary: 'Kenali cara membaca kode 3-huruf Socionics dan kaitannya dengan notasi Jungian klasik.',
        prerequisiteIds: ['lp-soc-2'],
        estimatedMinutes: 12,
        targetModule: 'analisis-kepribadian',
        keyTakeaways: [
          'Huruf terakhir (E/I) menunjukkan sikap fungsi Leading.',
          'Notasi Jungian seperti ET(N) tidak selalu sama konversinya dengan MBTI populer.',
        ],
        selfCheckPrompt: 'Apa fungsi Leading dan Creative pada tipe ILE dibandingkan dengan LIE?',
      },
      {
        id: 'lp-soc-5',
        stepNumber: 5,
        title: 'Hubungan Antar-Tipe & Eskalasi Konflik 5 Tahap',
        summary: 'Pahami relasi struktural bukan sebagai ramalan jodoh, melainkan peta potensi salah paham.',
        prerequisiteIds: ['lp-soc-3', 'lp-soc-4'],
        estimatedMinutes: 15,
        targetModule: 'perbandingan-interpersonal',
        keyTakeaways: [
          'Konflik berkembang bertahap dari perbedaan asumsi hingga ketegangan bila tanpa klarifikasi.',
          'Dialog terbuka lebih menentukan kualitas relasi ketimbang jenis hubungan teoretis.',
        ],
        selfCheckPrompt: 'Apa satu kalimat perbaikan yang bisa meredakan ketegangan pada tahap asimetri komunikasi?',
      },
    ],
  },
  {
    id: 'lp-psikosofi',
    framework: 'Psikosofi',
    title: 'Jalur Belajar Terpandu: Psikosofi (L·V·E·F)',
    description:
      'Pelajari sistem sikap empat aspek Afanasyev dan cara melakukan eksplorasi posisi tanpa bias.',
    steps: [
      {
        id: 'lp-psy-1',
        stepNumber: 1,
        title: 'Pengenalan 4 Aspek: Logika, Kehendak, Emosi, Fisika',
        summary: 'Pahami ruang lingkup masing-masing aspek dan bedanya dari tradisi Attitudinal Psyche modern.',
        prerequisiteIds: [],
        estimatedMinutes: 8,
        targetModule: 'psikosofi',
        keyTakeaways: [
          'Psikosofi mengukur hierarki prioritas sikap atas 4 domain hidup.',
          'Bukan alat ukur klinis atau kecerdasan IQ.',
        ],
        selfCheckPrompt: 'Apa perbedaan domain Volition (V) dengan Logika (L) saat mengambil keputusan kelompok?',
      },
      {
        id: 'lp-psy-2',
        stepNumber: 2,
        title: 'Empat Posisi (1st–4th) & Sumbu Sikap',
        summary: 'Kuasai kombinasi Self(+/-), Others(+/-), dan Result vs Process pada posisi ke-1 hingga ke-4.',
        prerequisiteIds: ['lp-psy-1'],
        estimatedMinutes: 12,
        targetModule: 'psikosofi',
        keyTakeaways: [
          'Posisi 1 & 4 berorientasi hasil (cepat tutup topik); posisi 2 & 3 berorientasi proses (aktif bernegosiasi).',
          'Posisi ke-3 sering paling sensitif sekaligus paling ingin didengar secara setara.',
        ],
        selfCheckPrompt: 'Mengapa posisi ke-4 bukan berarti "tidak mampu" melainkan "mudah menyesuaikan dan hemat energi"?',
      },
      {
        id: 'lp-psy-3',
        stepNumber: 3,
        title: '16 Panduan Identifikasi Penempatan (1L s.d. 4F)',
        summary: 'Pelajari indikator, kesalahan umum, dan pertanyaan pembeda di tiap penempatan.',
        prerequisiteIds: ['lp-psy-2'],
        estimatedMinutes: 15,
        targetModule: 'psikosofi',
        keyTakeaways: [
          'Kesalahan terbanyak terjadi saat tertukar antara posisi 1 dan 3 atau 2 dan 4.',
        ],
        selfCheckPrompt: 'Apa indikator utama yang membedakan 1V dari 3V ketika keputusannya ditentang?',
      },
      {
        id: 'lp-psy-4',
        stepNumber: 4,
        title: '24 Kombinasi Tipe & Keterbatasan Lintas Sistem',
        summary: 'Telusuri bagaimana 4 posisi saling berinteraksi tanpa memaksakan padanan Socionics/Enneagram.',
        prerequisiteIds: ['lp-psy-3'],
        estimatedMinutes: 12,
        targetModule: 'psikosofi',
        keyTakeaways: [
          'Posisi V sering memengaruhi warna penyampaian L, E, dan F di lapangan.',
          'Gunakan status "Provisional" sebelum merasa yakin.',
        ],
        selfCheckPrompt: 'Mengapa tipe Psikosofi tidak boleh ditebak hanya dari tipe Socionics?',
      },
    ],
  },
  {
    id: 'lp-enneagram',
    framework: 'Enneagram',
    title: 'Jalur Belajar Terpandu: Enneagram & Dinamika Motivasi',
    description:
      'Memahami motivasi inti, varian insting, triad, sayap, dan Tritype sebagai cermin refleksi bukan label.',
    steps: [
      {
        id: 'lp-enn-1',
        stepNumber: 1,
        title: 'Tiga Triad & Motivasi Inti 9 Tipe',
        summary: 'Mulai dari akar emosi/ketegangan di pusat Perut (Gut), Hati (Heart), dan Kepala (Head).',
        prerequisiteIds: [],
        estimatedMinutes: 10,
        targetModule: 'analisis-kepribadian',
        keyTakeaways: [
          'Perilaku serupa dapat muncul dari motivasi inti yang bertolak belakang.',
          'Tidak ada tipe yang lebih "unggul" atau lebih "buruk".',
        ],
        selfCheckPrompt: 'Mengapa dua siswa yang sama-sama rajin belajar bisa digerakkan motivasi Tipe 1 vs Tipe 3?',
      },
      {
        id: 'lp-enn-2',
        stepNumber: 2,
        title: 'Varian Instingtual (SP · SO · SX) & Stacking',
        summary: 'Pelajari bagaimana prioritas fokus insting membentuk subtipe konkret dari tiap angka inti.',
        prerequisiteIds: ['lp-enn-1'],
        estimatedMinutes: 12,
        targetModule: 'analisis-kepribadian',
        keyTakeaways: [
          'Insting Dominan, Sekunder, dan Blindspot menjelaskan variasi besar dalam satu angka inti.',
        ],
        selfCheckPrompt: 'Bagaimana perbedaan ekspresi SP4, SO4, dan SX4 dalam menghadapi kekecewaan?',
      },
      {
        id: 'lp-enn-3',
        stepNumber: 3,
        title: 'Sayap, Garis Integrasi/Stres & Tritype/Trifix',
        summary: 'Eksplorasi nuansa lanjutan secara proporsional tanpa mengaburkan tipe inti.',
        prerequisiteIds: ['lp-enn-2'],
        estimatedMinutes: 12,
        targetModule: 'analisis-kepribadian',
        keyTakeaways: [
          'Sayap dan Tritype memberi konteks tambahan, bukan alasan menghindar dari pola utama yang perlu direfleksikan.',
        ],
        selfCheckPrompt: 'Apa perbedaan konvensi urutan kode Tritype berbasis inti vs urutan pusat?',
      },
      {
        id: 'lp-enn-4',
        stepNumber: 4,
        title: 'Memisahkan Fakta Observasi vs Hipotesis Tipologi',
        summary: 'Praktik langsung memisahkan perilaku teramati dari interpretasi motivasi Enneagram.',
        prerequisiteIds: ['lp-enn-3'],
        estimatedMinutes: 10,
        targetModule: 'analisis-kasus',
        keyTakeaways: [
          'Kita dapat mengamati perilaku teman, tetapi motivasi batinnya baru dipastikan melalui dialog empatik.',
        ],
        selfCheckPrompt: 'Apa alternatif penjelasan non-tipologi ketika seseorang terlihat diam sepanjang rapat?',
      },
    ],
  },
];

export const INITIAL_SCENARIOS: ExplorationScenario[] = [
  {
    id: 'scen-keputusan-cepat',
    title: 'Debat Solusi Proyek Kelas Menjelang Tenggat',
    category: 'Kolaborasi Kelas',
    context:
      'Tim proyek SMA memiliki sisa waktu 45 menit sebelum pengumpulan. Satu anggota mengajukan ide eksperimen baru yang menarik, sementara anggota lain cemas apakah waktu cukup untuk merapikan laporan yang sudah ada.',
    dilemmaPrompt: 'Apa reaksi paling alami yang biasanya muncul dalam diri Anda pada situasi seperti ini?',
    options: [
      {
        id: 'opt-efisiensi',
        label: 'Menanyakan rencana langkah praktisnya: mana yang paling realistis diselesaikan dengan kualitas layak dalam 45 menit.',
        tag: 'Orientasi Eksekusi & Kelayakan',
        contextualNature: 'Struktural',
        indications: [
          'Cenderung mengutamakan kejelasan prosedur, pembagian waktu, dan keterujian hasil dalam batas tenggat.',
        ],
        relevantConcepts: [
          { conceptId: 'soc-te', label: 'Te (Efektivitas Operasional)', framework: 'Socionics', targetModule: 'analisis-kepribadian' },
          { conceptId: 'psy-1v', label: 'Kehendak Arah/Prioritas', framework: 'Psikosofi', targetModule: 'psikosofi' },
        ],
        alternativeExplanations: [
          'Tekanan nilai mata pelajaran yang ketat atau pengalaman pernah gagal tepat waktu di tugas sebelumnya.',
        ],
        followUpQuestions: [
          'Apakah kekhawatiran Anda muncul terutama karena ketidakjelasan bukti kelayakan metode baru tersebut, atau karena ingin menjaga ketenangan suasana tim?',
        ],
      },
      {
        id: 'opt-struktur',
        label: 'Memeriksa apakah ide baru itu konsisten dengan rumusan masalah tugas sebelum setuju atau menolak.',
        tag: 'Konsistensi Konseptual',
        contextualNature: 'Struktural',
        indications: [
          'Memprioritaskan kesesuaian prinsip dan keutuhan kerangka logis tugas sebelum bergerak ke eksekusi.',
        ],
        relevantConcepts: [
          { conceptId: 'soc-ti', label: 'Ti (Logika Struktural)', framework: 'Socionics', targetModule: 'analisis-kepribadian' },
          { conceptId: 'psy-2l', label: '2L (Dialog Rasional)', framework: 'Psikosofi', targetModule: 'psikosofi' },
        ],
        alternativeExplanations: [
          'Pernah mengalami pengurangan nilai guru karena isi laporan tidak sesuai rubrik.',
        ],
        followUpQuestions: [
          'Jika rubrik tidak dilanggar, apakah Anda bersedia mencoba ide baru atau tetap lebih nyaman mempertahankan struktur awal?',
        ],
      },
      {
        id: 'opt-tergantung-relasi',
        label: 'Tergantung situasi: bila pengusul terlihat antusias sekaligus mampu mengeksekusinya bersama-sama, saya terbuka; bila tim sudah lelah, saya mengusulkan menjaga ritme yang ada.',
        tag: 'Respons Kontekstual & Relasional',
        contextualNature: 'Kontekstual',
        indications: [
          'Mengintegrasikan kondisi energi fisik/emosional rekan tim sebelum memilih antara eksplorasi ide dan stabilitas.',
        ],
        relevantConcepts: [
          { conceptId: 'soc-fe', label: 'Fe / Kepekaan Suasana', framework: 'Socionics', targetModule: 'analisis-kepribadian' },
          { conceptId: 'soc-si', label: 'Si / Keberlanjutan Energi', framework: 'Socionics', targetModule: 'analisis-kepribadian' },
        ],
        alternativeExplanations: [
          'Kematangan komunikasi kolaboratif dan empati situasional tanpa keterkaitan eksklusif dengan satu tipe saja.',
        ],
        followUpQuestions: [
          'Bagaimana cara Anda menyampaikan penolakan agar pengusul ide tidak merasa gagasannya diremehkan?',
        ],
      },
      {
        id: 'opt-eksplorasi-opsi',
        label: 'Berusaha mencari jalan tengah kreatif: mempertahankan inti laporan lama sambil menyisipkan versi ringkas dari ide baru.',
        tag: 'Sintesis Alternatif',
        contextualNature: 'Adaptif',
        indications: [
          'Nyaman menghubungkan peluang konseptual (Ne) dengan pencarian solusi agar seluruh pihak tetap merasa diakomodasi.',
        ],
        relevantConcepts: [
          { conceptId: 'soc-ne', label: 'Ne (Alternatif Kemungkinan)', framework: 'Socionics', targetModule: 'analisis-kepribadian' },
          { conceptId: 'enn-triad', label: 'Strategi Harmoni / Penghindaran Konflik', framework: 'Enneagram', targetModule: 'analisis-kepribadian' },
        ],
        alternativeExplanations: [
          'Kebiasaan mencari jalan kompromi demi menghindari konflik terbuka saat waktu sempit.',
        ],
        followUpQuestions: [
          'Apakah kompromi dipilih karena solusi gabungan memang lebih baik, atau untuk menghindari ketegangan antaranggota?',
        ],
      },
    ],
    limitationsNote:
      'Satu pilihan skenario hanya memotret kecenderungan situasional. Faktor beban tugas lain, hubungan pertemanan, dan peran sebagai ketua/anggota dapat mengubah respons Anda.',
  },
  {
    id: 'scen-kritik-argumentasi',
    title: 'Presentasi Karya Tulis Mendapat Kritik Mendadak',
    category: 'Konflik Interpersonal',
    context:
      'Setelah Anda mempresentasikan argumen utama di depan kelas, seorang teman langsung menyela bahwa premis dasar presentasi Anda memiliki celah dan kurang tepat.',
    dilemmaPrompt: 'Apa yang paling cepat muncul dalam pikiran atau reaksi batin Anda?',
    options: [
      {
        id: 'opt-uji-bukti',
        label: 'Ingin segera melihat letak celahnya secara spesifik: jika argumen dia valid, saya ingin memperbaikinya; jika tidak, saya jelaskan kembali bagian logikanya.',
        tag: 'Fokus Materi Argumen',
        contextualNature: 'Struktural',
        indications: [
          'Merespons kritik dengan memisahkan isi materi dari harga diri pribadi atau kenyamanan sosial.',
        ],
        relevantConcepts: [
          { conceptId: 'psy-2l', label: '2L (Logika Dialogis)', framework: 'Psikosofi', targetModule: 'psikosofi' },
          { conceptId: 'soc-ti', label: 'Ti (Koherensi Logika)', framework: 'Socionics', targetModule: 'analisis-kepribadian' },
        ],
        alternativeExplanations: [
          'Terbiasa mengikuti forum debat akademik atau suasana kelas yang memang terlatih berdiskusi lugas.',
        ],
        followUpQuestions: [
          'Apakah respons tenang itu tetap bertahan jika penyampaian teman dilakukan dengan nada sinis di depan guru?',
        ],
      },
      {
        id: 'opt-nada-hormat',
        label: 'Isi kritiknya mungkin bisa diterima, tetapi cara menyela di depan umum terasa kurang menghargai usaha dan suasana yang sedang dibangun.',
        tag: 'Kepekaan Cara Penyampaian & Relasi',
        contextualNature: 'Komunikatif',
        indications: [
          'Memberikan bobot signifikan pada adab relasional, keselarasan atmosfer, atau martabat di forum terbuka.',
        ],
        relevantConcepts: [
          { conceptId: 'soc-fi', label: 'Fi / Batas Respek Relasional', framework: 'Socionics', targetModule: 'analisis-kepribadian' },
          { conceptId: 'psy-3v', label: 'Kepekaan Martabat / Posisi', framework: 'Psikosofi', targetModule: 'psikosofi' },
        ],
        alternativeExplanations: [
          'Pengalaman pernah dipermalukan di forum kelas atau sedang kelelahan mempersiapkan presentasi.',
        ],
        followUpQuestions: [
          'Mana yang lebih mengganjal: kritik yang disampaikan secara terbuka, atau rasa khawatir nilai serta citra kerja tim jatuh?',
        ],
      },
      {
        id: 'opt-tergantung-kedekatan',
        label: 'Tergantung situasi dan siapa yang bicara: jika dari teman dekat yang berniat membantu saya langsung terbuka; jika dari orang yang jarang bekerja sama, saya cenderung berjaga-jaga dulu.',
        tag: 'Kepercayaan Relasional Kontekstual',
        contextualNature: 'Kontekstual',
        indications: [
          'Penilaian niat (trust) dan jarak relasi sangat menentukan keterbukaan Anda terhadap masukan.',
        ],
        relevantConcepts: [
          { conceptId: 'soc-fi', label: 'Evaluasi Jarak Relasional', framework: 'Socionics', targetModule: 'analisis-kepribadian' },
          { conceptId: 'enn-instinct', label: 'Fokus Insting & Rasa Aman Sosial', framework: 'Enneagram', targetModule: 'analisis-kepribadian' },
        ],
        alternativeExplanations: [
          'Dinamika sosial kelas yang wajar ketika kejelasan niat lawan bicara belum diketahui.',
        ],
        followUpQuestions: [
          'Bagaimana cara memverifikasi niat teman tersebut setelah kelas selesai sebelum mengambil kesimpulan?',
        ],
      },
    ],
    limitationsNote:
      'Cara menerima kritik sangat dipengaruhi budaya kelas, rasa percaya diri atas penguasaan materi hari itu, serta riwayat relasi dengan pemberi kritik.',
  },
  {
    id: 'scen-belajar-materi-baru',
    title: 'Menghadapi Bab Fisika atau Ekonomi yang Sama Sekali Baru',
    category: 'Gaya Belajar',
    context:
      'Guru memberikan materi bab baru yang padat rumus sekaligus menuntut pemahaman konsep di kehidupan nyata. Ujian formatif dijadwalkan dua minggu lagi.',
    dilemmaPrompt: 'Langkah awal apa yang biasanya paling membantu Anda memahami materi baru?',
    options: [
      {
        id: 'opt-peta-prinsip',
        label: 'Mencari tahu definisi dasar dan mengapa rumus itu diturunkan sehingga seluruh bab membentuk satu peta konsep utuh.',
        tag: 'Prinsip & Struktur Dasar',
        contextualNature: 'Struktural',
        indications: [
          'Cenderung membutuhkan pemahaman kerangka "mengapa" sebelum menghafal atau mengerjakan banyak variasi soal.',
        ],
        relevantConcepts: [
          { conceptId: 'soc-ti', label: 'Ti (Sistem Prinsip)', framework: 'Socionics', targetModule: 'analisis-kepribadian' },
          { conceptId: 'psy-1l', label: 'Kemandirian Sintesis Konsep', framework: 'Psikosofi', targetModule: 'psikosofi' },
        ],
        alternativeExplanations: [
          'Gaya belajar mendalam yang terlatih dari bimbingan belajar atau guru yang menekankan konsep dasar.',
        ],
        followUpQuestions: [
          'Saat waktu persiapan mepet, apakah pendekatan memahami dari akar tetap efektif atau justru membuat terjebak terlalu lama di satu subbab?',
        ],
      },
      {
        id: 'opt-latihan-aplikasi',
        label: 'Langsung melihat contoh kasus nyata dan mencoba 3–5 soal bervariasi agar cepat menangkap pola penerapannya.',
        tag: 'Contoh Konkret & Praktik Cepat',
        contextualNature: 'Adaptif',
        indications: [
          'Belajar paling cepat melalui umpan balik langsung dari penerapan konkret sebelum menyusun ringkasan teori.',
        ],
        relevantConcepts: [
          { conceptId: 'soc-te', label: 'Te (Uji Aplikasi & Efisiensi)', framework: 'Socionics', targetModule: 'analisis-kepribadian' },
        ],
        alternativeExplanations: [
          'Strategi ujian efektif ketika keterbatasan waktu menuntut penguasaan tipe soal.',
        ],
        followUpQuestions: [
          'Apakah sesudah lancar mengerjakan soal latihan, Anda tetap menyempatkan memahami batasan konsep saat bertemu soal modifikasi (HOTS)?',
        ],
      },
      {
        id: 'opt-diskusi-teman',
        label: 'Menjelaskan ulang pemahaman sementara kepada teman atau bertukar catatan agar ketahuan bagian mana yang masih keliru.',
        tag: 'Belajar Dialogis / Peer Teaching',
        contextualNature: 'Komunikatif',
        indications: [
          'Menggunakan artikulasi verbal dan dialog timbal balik sebagai cermin untuk menguji ketajaman pemahaman.',
        ],
        relevantConcepts: [
          { conceptId: 'psy-2l', label: '2L (Belajar Lewat Dialog)', framework: 'Psikosofi', targetModule: 'psikosofi' },
          { conceptId: 'soc-fe', label: 'Energi Interaksi Kelompok', framework: 'Socionics', targetModule: 'analisis-kepribadian' },
        ],
        alternativeExplanations: [
          'Teknik Feynman yang terbukti efektif di psikologi pendidikan untuk berbagai profil kepribadian.',
        ],
        followUpQuestions: [
          'Setelah berdiskusi dengan teman, bagaimana Anda memastikan pemahaman pribadi tetap kokoh saat mengerjakan ujian mandiri?',
        ],
      },
    ],
    limitationsNote:
      'Strategi belajar terbaik bersifat fleksibel mengikuti karakter mata pelajaran (mis. hafalan prosedur vs pemodelan matematis) dan bukan hak eksklusif satu tipe.',
  },
  {
    id: 'scen-pembagian-peran',
    title: 'Kelompok Tanpa Ketua Formal di Awal Tugas',
    category: 'Kepemimpinan Kelompok',
    context:
      'Guru membagi 5 siswa ke dalam kelompok tanpa menunjuk ketua. Sepuluh menit berlalu dan diskusi masih mengambang antara bercanda dan belum ada yang menulis kesepakatan.',
    dilemmaPrompt: 'Kecenderungan apa yang paling mungkin Anda lakukan di menit ke-11?',
    options: [
      {
        id: 'opt-ambil-alur',
        label: 'Langsung mengambil papan/dokumen, merangkum target tugas, dan menawarkan pembagian bagian agar kelompok segera jalan.',
        tag: 'Inisiatif Struktur & Arah',
        contextualNature: 'Struktural',
        indications: [
          'Ketidaknyamanan terhadap ketidakjelasan arah mendorong pengambilan peran inisiatif pengorganisasian.',
        ],
        relevantConcepts: [
          { conceptId: 'psy-1v', label: '1V / Kepemimpinan Arah', framework: 'Psikosofi', targetModule: 'psikosofi' },
          { conceptId: 'soc-se', label: 'Se / Mobilisasi Konkret', framework: 'Socionics', targetModule: 'analisis-kepribadian' },
        ],
        alternativeExplanations: [
          'Rasa tanggung jawab terhadap tenggat tugas atau kebiasaan sebelumnya selalu ditunjuk sebagai koordinator.',
        ],
        followUpQuestions: [
          'Apakah Anda senang memimpin sepanjang proyek, atau hanya mengambil alih di awal karena tidak ada yang bergerak?',
        ],
      },
      {
        id: 'opt-pancing-konsensus',
        label: 'Mengajak seluruh teman menyepakati dulu peran apa yang paling nyaman diambil tiap orang agar tidak ada yang merasa dipaksa.',
        tag: 'Fasilitasi Setara',
        contextualNature: 'Komunikatif',
        indications: [
          'Menjaga kesetaraan partisipasi dan rasa memiliki semua anggota sebelum mengeksekusi pekerjaan.',
        ],
        relevantConcepts: [
          { conceptId: 'psy-3v', label: 'Sensitivitas Kesetaraan Posisi', framework: 'Psikosofi', targetModule: 'psikosofi' },
          { conceptId: 'soc-fi', label: 'Pertimbangan Keadilan Relasional', framework: 'Socionics', targetModule: 'analisis-kepribadian' },
        ],
        alternativeExplanations: [
          'Pernah mengalami kerja kelompok di mana anggota pasif karena pembagian peran terlalu sepihak.',
        ],
        followUpQuestions: [
          'Bagaimana sikap Anda bila setelah diajak memilih pun masih ada anggota yang memilih diam?',
        ],
      },
      {
        id: 'opt-mulai-bagian-sendiri',
        label: 'Tergantung situasi: kalau topiknya saya kuasai, saya tawarkan kerangka; kalau belum, saya mulai menyicil riset bagian saya lalu menunjukkannya agar diskusi jadi konkret.',
        tag: 'Kontribusi Berbasis Konteks',
        contextualNature: 'Kontekstual',
        indications: [
          'Tidak mengejar status formal ketua maupun pasif total; berkontribusi lewat kemajuan kerja nyata.',
        ],
        relevantConcepts: [
          { conceptId: 'soc-te', label: 'Fokus Kemajuan Kerja', framework: 'Socionics', targetModule: 'analisis-kepribadian' },
          { conceptId: 'psy-2v', label: 'Fleksibilitas Posisi Kehendak', framework: 'Psikosofi', targetModule: 'psikosofi' },
        ],
        alternativeExplanations: [
          'Adaptasi alami berdasarkan tingkat kepercayaan diri di mata pelajaran tersebut.',
        ],
        followUpQuestions: [
          'Apakah cara menyicil kerja sendiri tetap dikomunikasikan agar tidak bentrok dengan bagian teman lain?',
        ],
      },
    ],
    limitationsNote:
      'Keaktifan memimpin kelompok di sekolah amat dipengaruhi keakraban antarteman, penguasaan topik, dan kondisi energi fisik hari itu.',
  },
];

export const EVIDENCE_EXERCISES: EvidenceExercise[] = [
  {
    id: 'ev-01',
    title: 'Kasus 1: Teman yang Diam Sepanjang Diskusi Kelompok',
    scenarioText:
      'Dalam kerja kelompok selama 30 menit, Raka hanya berbicara dua kali di bagian akhir, itupun dengan kalimat sangat singkat saat ditanya kesimpulan.',
    observedBehaviors: [
      'Raka menatap catatan sambil mencatat poin pembicaraan teman lain.',
      'Raka berbicara singkat tepat ketika dimintai pendapat penutup.',
    ],
    possibleInterpretations: [
      '"Raka pemalas atau tidak peduli dengan nilai kelompok." (Interpretasi menghakimi yang belum teruji)',
      '"Raka tipe pemikir introvert sehingga pasti tidak suka kerja tim." (Lompatan label tipologi)',
    ],
    typologicalHypotheses: [
      'Mungkin ia sedang memproses struktur informasi secara internal (Introverted Logic/Ethics) sebelum bicara.',
      'Bisa juga posisi 4L/4V atau fokus Self-Preservation yang memilih menyimpan energi saat diskusi sudah ramai.',
    ],
    alternativeNonTypologicalExplanations: [
      'Raka kurang tidur atau sedang kurang sehat pada hari itu.',
      'Ada dua anggota dominan yang berbicara terlalu cepat sehingga Raka tidak melihat celah sopan untuk menyela.',
      'Raka belum sempat membaca materi prasyarat malam sebelumnya sehingga berhati-hati agar tidak keliru.',
    ],
    requiredAdditionalEvidence: [
      'Bertanya secara pribadi dengan nada netral: "Tadi saat diskusi berjalan cepat, bagian mana yang menurutmu perlu diperbaiki atau kamu tangkap?"',
      'Mengamati partisipasi Raka pada topik atau kelompok berbeda sebelum menyimpulkan pola menetap.',
    ],
  },
  {
    id: 'ev-02',
    title: 'Kasus 2: Penolakan Ide Tanpa Penjelasan Panjang',
    scenarioText:
      'Ketika Dina mengusulkan konsep poster warna-warni untuk presentasi Fisika, Bima langsung menjawab: "Nggak usah pakai itu, kepanjangan ngerjainnya."',
    observedBehaviors: [
      'Bima menolak usulan desain poster dalam satu kalimat langsung.',
      'Nada bicaranya datar dan ia langsung menunjuk jadwal pengumpulan di papan.',
    ],
    possibleInterpretations: [
      '"Bima memang orangnya kasar dan membenci kreativitas." (Generalisasi sifat pribadi)',
      '"Dina terlalu sensitif sehingga mudah tersinggung." (Menyalahkan reaksi lawan bicara)',
    ],
    typologicalHypotheses: [
      'Bima mungkin sedang memprioritaskan efisiensi tenggat (Te) atau penutupan cepat berorientasi hasil (1L/1V).',
      'Perbedaan nilai antara ketertarikan estetika/ekspresi dengan urgensi praktis menciptakan gesekan awal.',
    ],
    alternativeNonTypologicalExplanations: [
      'Bima baru saja diingatkan guru bahwa tenggat dimajukan dan panik mengejar kelengkapan isi.',
      'Bima memiliki pengalaman buruk sebelumnya mengerjakan proyek visual yang memakan waktu tanpa menaikkan nilai substansi.',
      'Kebiasaan komunikasi lugas di lingkungan keluarganya membuat Bima tidak sadar kalimat pendeknya terasa tajam.',
    ],
    requiredAdditionalEvidence: [
      'Mengklarifikasi alasan praktis di balik penolakan serta menanyakan alternatif visual yang lebih ringkas.',
      'Memberi umpan balik tentang dampak cara penyampaian singkat terhadap semangat kerja tim.',
    ],
  },
  {
    id: 'ev-03',
    title: 'Kasus 3: Konsistensi Diri vs Tuntutan Pilihan Jurusan',
    scenarioText:
      'Sari suka membahas filsafat dan psikologi bersama teman, tetapi nilai terbaiknya di rapor justru berada di Matematika Lanjut dan Kimia.',
    observedBehaviors: [
      'Sari aktif membaca artikel konsep sosial dan kepribadian di waktu luang.',
      'Sari memperoleh nilai konsisten tinggi pada evaluasi Kimia dan Matematika Lanjut.',
    ],
    possibleInterpretations: [
      '"Sari salah jurusan SMA; harusnya dia tidak mengambil spesialisasi sains." (Determinisme biner)',
      '"Karena jago Matematika, Sari pasti bertipe Ti Leading dan tidak cocok bidang sosial." (Bias stereotip kemampuan akademik = tipe kepribadian)',
    ],
    typologicalHypotheses: [
      'Keterampilan kalkulasi dan penguasaan Kimia dapat dikuasai oleh hampir semua profil kepribadian melalui metode belajar yang sesuai.',
      'Ketertarikan pada dinamika manusia bisa berjalan berdampingan dengan kompetensi eksakta (mis. jalur lintas disiplin seperti Sains Data Sosial, Manajemen Teknologi, atau Teknik Industri).',
    ],
    alternativeNonTypologicalExplanations: [
      'Guru Kimia dan Matematika Sari mengajar dengan sangat terstruktur sehingga materi mudah dikuasainya.',
      'Sari memandang ilmu eksakta sebagai alat kerja sistematis, sedangkan ilmu manusia sebagai minat reflektif pribadi.',
    ],
    requiredAdditionalEvidence: [
      'Mengeksplorasi topik proyek atau tugas mana yang membuat Sari merasa berenergi jangka panjang, bukan hanya nilai ujian sesaat.',
      'Membandingkan kurikulum riil program studi lintas disiplin sebelum mengeliminasi salah satu minat.',
    ],
  },
];
