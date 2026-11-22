import type { ArcadeGameId } from '../types/dynamap';

export interface VerifiedTheoryReference {
  id: string;
  framework: 'MBTI' | 'SLOAN' | 'Temperament';
  sourceType:
    | 'Karya Primer'
    | 'Jurnal Peer-Reviewed'
    | 'Buku Akademik'
    | 'Manual Resmi'
    | 'Sumber Komunitas Daring (Non-Klinis)';
  apaCitation: string;
  url?: string;
  note: string;
}

export const VERIFIED_EXTENDED_REFERENCES: VerifiedTheoryReference[] = [
  // ==================== MBTI REFERENCES ====================
  {
    id: 'ref-mbti-jung-1971',
    framework: 'MBTI',
    sourceType: 'Karya Primer',
    apaCitation:
      'Jung, C. G. (1971). Psychological types (H. G. Baynes & R. F. C. Hull, Trans.; Collected Works of C. G. Jung, Vol. 6). Princeton University Press. (Original work published 1921).',
    note: 'Sumber primer asli sikap Introversi/Ekstraversi dan 4 fungsi psikologis (Thinking, Feeling, Sensation, Intuition).',
  },
  {
    id: 'ref-mbti-gifts-1995',
    framework: 'MBTI',
    sourceType: 'Karya Primer',
    apaCitation:
      'Myers, I. B., & Myers, P. B. (1995). Gifts differing: Understanding personality type (Original work published 1980). Davies-Black Publishing.',
    note: 'Uraian teoretis Isabel Briggs Myers dan Peter B. Myers tentang 4 dikotomi MBTI serta keterkaitannya dengan fungsi Jung.',
  },
  {
    id: 'ref-mbti-manual-1998',
    framework: 'MBTI',
    sourceType: 'Manual Resmi',
    apaCitation:
      'Myers, I. B., McCaulley, M. H., Quenk, N. L., & Hammer, A. L. (1998). MBTI manual: A guide to the development and use of the Myers-Briggs Type Indicator (3rd ed.). Consulting Psychologists Press.',
    note: 'Manual psikometrik standar instrumen resmi MBTI, reliabilitas uji ulang, dan etika interpretasi dikotomi.',
  },
  {
    id: 'ref-mbti-grant-1983',
    framework: 'MBTI',
    sourceType: 'Buku Akademik',
    apaCitation:
      'Grant, W. H., Thompson, M. M., & Clarke, T. E. (1983). From image to likeness: A Jungian path in the Gospel journey. Paulist Press.',
    note: 'Memopulerkan urutan tumpukan 4 fungsi sadar (Dom-Aux-Ter-Inf) berselang-seling sikap E/I yang sering dirujuk komunitas modern.',
  },
  {
    id: 'ref-mbti-beebe-2016',
    framework: 'MBTI',
    sourceType: 'Buku Akademik',
    apaCitation:
      'Beebe, J. (2016). Energies and patterns in psychological type: The reservoir of consciousness. Routledge.',
    note: 'Model psikologi mendalam 8-fungsi dengan 8 posisi arketipal (Hero, Parent, Child, Inferior, serta 4 fungsi bayangan/shadow).',
  },

  // ==================== SLOAN / BIG FIVE REFERENCES ====================
  {
    id: 'ref-sloan-goldberg-1990',
    framework: 'SLOAN',
    sourceType: 'Jurnal Peer-Reviewed',
    apaCitation:
      "Goldberg, L. R. (1990). An alternative 'description of personality': The Big-Five factor structure. Journal of Personality and Social Psychology, 59(6), 1216–1229. https://doi.org/10.1037/0022-3514.59.6.1216",
    url: 'https://doi.org/10.1037/0022-3514.59.6.1216',
    note: 'Studi leksikal fundamental yang memantapkan struktur lima faktor besar ("Big Five").',
  },
  {
    id: 'ref-sloan-costa-1992-art',
    framework: 'SLOAN',
    sourceType: 'Jurnal Peer-Reviewed',
    apaCitation:
      'Costa, P. T., Jr., & McCrae, R. R. (1992). Normal personality assessment in clinical practice: The NEO Personality Inventory. Psychological Assessment, 4(1), 5–13.',
    note: 'Pembahasan validitas inventori lima faktor (FFM) beserta 30 fasetnya untuk memahami variasi kepribadian normal.',
  },
  {
    id: 'ref-sloan-costa-1992-man',
    framework: 'SLOAN',
    sourceType: 'Manual Resmi',
    apaCitation:
      'Costa, P. T., Jr., & McCrae, R. R. (1992). Revised NEO Personality Inventory (NEO PI-R) and NEO Five-Factor Inventory (NEO-FFI) professional manual. Psychological Assessment Resources.',
    note: 'Manual standar instrumen FFM (OCEAN: Neuroticism, Extraversion, Openness, Agreeableness, Conscientiousness).',
  },
  {
    id: 'ref-sloan-john-1999',
    framework: 'SLOAN',
    sourceType: 'Buku Akademik',
    apaCitation:
      'John, O. P., & Srivastava, S. (1999). The Big-Five trait taxonomy: History, measurement, and theoretical perspectives. In L. A. Pervin & O. P. John (Eds.), Handbook of personality: Theory and research (2nd ed., pp. 102–138). Guilford Press.',
    note: 'Tinjauan sejarah hipotesis leksikal dan taksonomi Big Five secara komprehensif.',
  },
  {
    id: 'ref-sloan-similarminds',
    framework: 'SLOAN',
    sourceType: 'Sumber Komunitas Daring (Non-Klinis)',
    apaCitation:
      'SimilarMinds. (n.d.). Global 5 / SLOAN personality classification system [Sumber komunitas daring].',
    url: 'https://similarminds.com/global5/',
    note: 'Sumber adaptasi komunitas daring yang menerjemahkan skor kontinum Big Five menjadi kode dikotomi 5 huruf (SLOAN) serta konvensi notasi lanjutan [X]/x/.',
  },

  // ==================== TEMPERAMENT REFERENCES ====================
  {
    id: 'ref-temp-kagan-1994',
    framework: 'Temperament',
    sourceType: 'Buku Akademik',
    apaCitation:
      "Kagan, J. (1994). Galen's prophecy: Temperament in human nature. Basic Books.",
    note: 'Penghubung kritis antara gagasan historis Galen dan riset modern mengenai reaktivitas saraf serta inhibisi perilaku pada anak.',
  },
  {
    id: 'ref-temp-thomas-1977',
    framework: 'Temperament',
    sourceType: 'Buku Akademik',
    apaCitation:
      'Thomas, A., & Chess, S. (1977). Temperament and development. Brunner/Mazel.',
    note: 'Studi Longitudinal New York tentang 9 dimensi temperamen awal serta konsep "goodness of fit" dengan lingkungan pengasuhan & belajar.',
  },
  {
    id: 'ref-temp-eysenck-1967',
    framework: 'Temperament',
    sourceType: 'Buku Akademik',
    apaCitation:
      'Eysenck, H. J. (1967). The biological basis of personality. Charles C. Thomas.',
    note: 'Menghubungkan dimensi biologis Ekstraversi–Introversi dan Neurotisisme dengan kuadran klasik Sanguin, Koleris, Melankolis, dan Plegmatis.',
  },
  {
    id: 'ref-temp-keirsey-1998',
    framework: 'Temperament',
    sourceType: 'Buku Akademik',
    apaCitation:
      'Keirsey, D. (1998). Please understand me II: Temperament, character, intelligence. Prometheus Nemesis Book Company. (Original Keirsey & Bates work published 1978).',
    note: 'Mempopulerkan 4 Temperamen Keirsey (Artisan SP, Guardian SJ, Idealist NF, Rational NT) sebagai kerangka perilaku modern.',
  },
];

// ============================================================================
// 10A. MBTI COMPLETE THEORY LIBRARY
// ============================================================================

export interface MbtiTypeLibraryEntry {
  code: string;
  roleTitle: string;
  dichotomyBreakdown: { EorI: 'E' | 'I'; SorN: 'S' | 'N'; TorF: 'T' | 'F'; JorP: 'J' | 'P' };
  grantStack: [string, string, string, string];
  shadowStack: [string, string, string, string];
  overview: string;
  dichotomyInterpretation: string;
  cognitiveStackInterpretation: string;
  tendenciesStrengths: string[];
  potentialChallenges: string[];
  commonMisunderstandings: string[];
  concreteExample: string;
  relatedReferenceIds: string[];
}

export const MBTI_HISTORY_TIMELINE = [
  {
    era: '1921 · Fondasi Awal',
    title: 'Carl Gustav Jung — Psychological Types',
    detail:
      'Jung mempublikasikan Psychologische Typen, memperkenalkan sikap dasar Extraversion vs Introversion serta empat fungsi sadar: Thinking, Feeling, Sensation, dan Intuition (Jung, 1921/1971). Jung melihat tipe sebagai kecenderungan preferensi yang terus berkembang, bukan kotak kaku.',
  },
  {
    era: '1940s–1962 · Operasionalisasi Kuesioner',
    title: 'Katharine Cook Briggs & Isabel Briggs Myers',
    detail:
      'Terinspirasi karya Jung dan pengamatan perbedaan manusia selama Perang Dunia II, ibu dan anak ini menambahkan sumbu Judging vs Perceiving (J/P) untuk mengidentifikasi fungsi mana yang diarahkan keluar (ekstraversi) dan mana yang bekerja di batin (Myers & Myers, 1980/1995).',
  },
  {
    era: '1980–1998 · Standarisasi Manual',
    title: 'Gifts Differing & MBTI Manual',
    detail:
      'Instrumen MBTI digunakan luas dalam bimbingan akademik dan karier dengan fokus eksplorasi preferensi komunikasi dan keputusan (Myers et al., 1998). Fokus resmi instrumen berpusat pada 4 pasang dikotomi.',
  },
  {
    era: '1983–2016 · Evolusi Model Tumpukan Komunitas',
    title: 'W. Harold Grant (IEIE/EIEI) & John Beebe (8-Fungsi Arketipal)',
    detail:
      'Komunitas tipologi modern kerap memakai urutan fungsi berselang-seling Grant (mis. Ni-Te-Fi-Se untuk INTJ) dan teori bayangan 8-fungsi Beebe (2016). Kedua perkembangan ini melampaui manual resmi kuesioner Myers-Briggs dan berbeda dari teori asli Jung maupun Socionics.',
  },
];

export const MBTI_DICHOTOMIES = [
  {
    axis: 'E / I — Extraversion vs Introversion (Arah Fokus Energi)',
    leftCode: 'E',
    leftTitle: 'Extraversion',
    leftDesc: 'Energi psikis dan perhatian terdorong ke dunia luar—orang, objek, aktivitas kolektif, dan dialog spontan.',
    rightCode: 'I',
    rightTitle: 'Introversion',
    rightDesc: 'Energi diarahkan terlebih dahulu ke refleksi batin, pengolahan ide internal, serta interaksi mendalam lingkaran kecil.',
    clarification: 'Berbeda dengan kelancaran berbicara atau sifat pemalu (Social/Calm di Big Five). Orang berpreferensi I tetap dapat tampil komunikatif di kelas.',
  },
  {
    axis: 'S / N — Sensing vs Intuition (Gaya Menghimpun Informasi)',
    leftCode: 'S',
    leftTitle: 'Sensing',
    leftDesc: 'Memprioritaskan fakta terobservasi, detail konkret, langkah kronologis, dan pengalaman praktis saat ini.',
    rightCode: 'N',
    rightTitle: 'Intuition',
    rightDesc: 'Fokus pada pola tersirat, keterkaitan konsep abstrak, kemungkinan jangka panjang, serta makna di balik data mentah.',
    clarification: 'S bukan berarti "tidak kreatif", dan N bukan berarti "lebih cerdas". Kedua cara menerima informasi saling melengkapi dalam sains maupun seni.',
  },
  {
    axis: 'T / F — Thinking vs Feeling (Kriteria Menarik Kesimpulan)',
    leftCode: 'T',
    leftTitle: 'Thinking',
    leftDesc: 'Mendasarkan penilaian pada konsistensi sebab-akibat, prinsip objektif, keadilan prosedural, serta analisis kritis.',
    rightCode: 'F',
    rightTitle: 'Feeling',
    rightDesc: 'Mendasarkan penilaian pada dampak terhadap manusia, keutuhan nilai personal, empati relasional, dan keharmonisan etis.',
    clarification: 'Thinking bukan berarti tanpa emosi, dan Feeling bukan berarti tidak logis. Keduanya adalah rasionalitas keputusan dengan bobot prioritas berbeda.',
  },
  {
    axis: 'J / P — Judging vs Perceiving (Orientasi Terhadap Lingkungan Luar)',
    leftCode: 'J',
    leftTitle: 'Judging',
    leftDesc: 'Lebih nyaman ketika struktur, kesepakatan tenggat, dan keputusan rencana ditetapkan jelas sejak awal.',
    rightCode: 'P',
    rightTitle: 'Perceiving',
    rightDesc: 'Lebih nyaman menjaga opsi tetap terbuka, merespons informasi baru secara fleksibel, dan menunda penutupan hingga data matang.',
    clarification: 'Judging tidak bermakna "menghakimi orang", dan Perceiving tidak bermakna "ceroboh". Dalam fungsi MBTI, huruf J/P menandai apakah fungsi rasional (T/F) atau persepsi (S/N) yang menghadap keluar.',
  },
];

export const MBTI_MODEL_COMPARISON = [
  {
    aspect: 'Fokus Struktur Utama',
    jungOriginal: '2 Sikap (E/I) + 4 Fungsi dasar; hanya fungsi Dominan & Sekunder yang dibahas rinci (Jung, 1921/1971).',
    officialMbti: '4 dikotomi berpasangan (E/I, S/N, T/F, J/P) untuk 16 tipe preferensi perilaku.',
    grantStack: 'Urutan 4 fungsi sadar berselang-seling sikap: Dom-Aux-Ter-Inf (mis. INFP = Fi-Ne-Si-Te) plus 4 Shadow ala Beebe.',
    communityOnline: 'Sering memperlakukan fungsi kognitif sebagai stereotip tetap atau mencampuradukkannya langsung dengan Socionics.',
  },
  {
    aspect: 'Cara Mengukur',
    jungOriginal: 'Observasi klinis dan refleksi perkembangan individu sepanjang hidup (individuasi).',
    officialMbti: 'Kuesioner pilihan paksa resmi MBTI Form M / Step II dengan validasi skor preferensi (Myers et al., 1998).',
    grantStack: 'Identifikasi kualitatif kesesuaian fungsi dominan dan poros aksis (Ti/Fe vs Fi/Te, Ni/Se vs Si/Ne).',
    communityOnline: 'Kuis internet cepat, pencocokan meme, atau penebakan visual dari perilaku permukaan.',
  },
  {
    aspect: 'Hubungan dengan Socionics',
    jungOriginal: 'Sama-sama berakar pada Jung, tetapi Socionics dikembangkan secara terpisah oleh Aushra Augustinavichiute.',
    officialMbti: 'Terpisah total: J/P MBTI adalah sikap perilaku eksternal; j/p Socionics (mis. LII = INTj) merujuk apakah fungsi Leading rasional/irasional.',
    grantStack: 'Terlihat mirip di permukaan huruf (Ni-Te-Fi-Se mirip ILI), namun definisi fungsi Se/Si/Ni/Fe di Socionics berbeda secara sistematis.',
    communityOnline: 'Kerap keliru mengonversi langsung huruf ke-4 (mis. mengira INTJ selalu INTj, padahal secara struktural lebih dekat ke INTp/ILI).',
  },
];

export const ALL_16_MBTI_PROFILES: MbtiTypeLibraryEntry[] = [
  {
    code: 'INTJ',
    roleTitle: 'Arsitek Strategis Reflektif',
    dichotomyBreakdown: { EorI: 'I', SorN: 'N', TorF: 'T', JorP: 'J' },
    grantStack: ['Ni', 'Te', 'Fi', 'Se'],
    shadowStack: ['Ne', 'Ti', 'Fe', 'Si'],
    overview: 'Memadukan fokus internal terhadap arah jangka panjang dengan keinginan merancang sistem eksternal yang efektif dan terukur.',
    dichotomyInterpretation: 'Secara dikotomi resmi, memilih energi privat (I), pola konseptual masa depan (N), kriteria objektif (T), serta rencana terstruktur (J).',
    cognitiveStackInterpretation: 'Dalam model Grant/Beebe: Ni dominan menyintesis skenario masa depan, dibantu Te untuk menata langkah faktual, Fi sebagai kompas nilai batin, dan Se inferior terkait kesadaran detail fisik spontan.',
    tendenciesStrengths: ['Mampu melihat keterkaitan sistem jangka panjang dalam proyek kompleks.', 'Mandiri merancang standar kerja efisien tanpa perlu pengawasan ketat.'],
    potentialChallenges: ['Bisa tampak terlalu tertutup atau mengabaikan kebutuhan harmoni sosial saat fokus berargumen.', 'Rentan kelelahan sensorik bila terlalu lama memaksakan rutinitas fisik serba cepat (Se inferior).'],
    commonMisunderstandings: ['Dianggap selalu dingin atau ahli catur tanpa emosi; kenyataannya Fi tersier memberi komitmen nilai yang kuat secara privat.'],
    concreteExample: 'Dalam proyek karya tulis SMA, siswa berpreferensi INTJ sering langsung merancang kerangka bab dari akar ke hasil sebelum membagi tugas jadwal.',
    relatedReferenceIds: ['ref-mbti-gifts-1995', 'ref-mbti-grant-1983'],
  },
  {
    code: 'INTP',
    roleTitle: 'Analis Koherensi Konseptual',
    dichotomyBreakdown: { EorI: 'I', SorN: 'N', TorF: 'T', JorP: 'P' },
    grantStack: ['Ti', 'Ne', 'Si', 'Fe'],
    shadowStack: ['Te', 'Ni', 'Se', 'Fi'],
    overview: 'Mengutamakan kejernihan kerangka berpikir internal serta eksplorasi kemungkinan teoretis sebelum mengambil kesimpulan akhir.',
    dichotomyInterpretation: 'Secara dikotomi: reflektif (I), menyukai ide abstrak (N), analisis logis konsisten (T), dan fleksibel menjaga opsi terbuka (P).',
    cognitiveStackInterpretation: 'Ti dominan menguji konsistensi premis secara internal, didukung Ne yang bercabang mencari alternatif, Si sebagai arsip ingatan, serta Fe inferior.',
    tendenciesStrengths: ['Cermat menemukan kontradiksi asumsi dalam debat akademik.', 'Terbuka mengeksplorasi sudut pandang lintas disiplin tanpa tergesa menghakimi.'],
    potentialChallenges: ['Terkadang menunda eksekusi tugas praktis karena model di kepala terasa belum selesai.', 'Canggung menavigasi situasi emosional mendadak di kelompok besar (Fe inferior).'],
    commonMisunderstandings: ['Keliru disangka malas atau anti-sosial; sebenarnya mereka sangat aktif berpikir dan antusias berdiskusi pada topik yang diminati.'],
    concreteExample: 'Saat belajar Fisika atau Sosiologi, sering menanyakan "mengapa definisi ini disepakati seperti itu?" dibanding sekadar menghafal rumus.',
    relatedReferenceIds: ['ref-mbti-jung-1971', 'ref-mbti-grant-1983'],
  },
  {
    code: 'ENTJ',
    roleTitle: 'Pengarah Sistem & Eksekusi',
    dichotomyBreakdown: { EorI: 'E', SorN: 'N', TorF: 'T', JorP: 'J' },
    grantStack: ['Te', 'Ni', 'Se', 'Fi'],
    shadowStack: ['Ti', 'Ne', 'Si', 'Fe'],
    overview: 'Menggerakkan koordinasi eksternal menuju target jangka panjang dengan penataan sumber daya dan tenggat yang jelas.',
    dichotomyInterpretation: 'Berenergi lewat interaksi aktif (E), menatap arah strategis (N), mengutamakan tolok ukur logis (T), dan memutuskan terstruktur (J).',
    cognitiveStackInterpretation: 'Te dominan menata efisiensi eksternal, dipandu visi terarah Ni, kecakapan aksi Se tersier, dan pertimbangan nilai personal Fi inferior.',
    tendenciesStrengths: ['Berani mengambil keputusan sulit dan membagi peran tim secara terukur.', 'Cepat menyederhanakan kekacauan menjadi rencana aksi bertahap.'],
    potentialChallenges: ['Bisa terkesan terlalu mendominasi forum jika rekan membutuhkan tempo diskusi lebih lambat.', 'Kurang memberi ruang refleksi perasaan pribadi hingga kelelahan muncul (Fi inferior).'],
    commonMisunderstandings: ['Tidak selalu identik dengan bos yang kasar; pemimpin bertipe ENTJ yang matang sangat menghargai otonomi kompetensi anggota tim.'],
    concreteExample: 'Di organisasi siswa, cepat memetakan timeline acara, anggaran, serta pembagian panitia sejak rapat pertama.',
    relatedReferenceIds: ['ref-mbti-manual-1998', 'ref-mbti-grant-1983'],
  },
  {
    code: 'ENTP',
    roleTitle: 'Eksplorator Gagasan & Dialektika',
    dichotomyBreakdown: { EorI: 'E', SorN: 'N', TorF: 'T', JorP: 'P' },
    grantStack: ['Ne', 'Ti', 'Fe', 'Si'],
    shadowStack: ['Ni', 'Te', 'Fi', 'Se'],
    overview: 'Senang menghubungkan ide-ide tak terduga dan menguji gagasan baru lewat perdebatan konstruktif bersama orang lain.',
    dichotomyInterpretation: 'Ekspresif ke dunia luar (E), tertarik kemungkinan baru (N), menggunakan kritik logis (T), dan fleksibel spontan (P).',
    cognitiveStackInterpretation: 'Ne dominan melihat banyak jalur alternatif, disaring prinsip Ti, diperhalus kesadaran sosial Fe tersier, serta Si inferior terkait ketelitian rutinitas.',
    tendenciesStrengths: ['Lihai mencairkan kebuntuan kreatif lewat analogi segar lintas bidang.', 'Cepat memahami dinamika argumen dari dua sisi berlawanan.'],
    potentialChallenges: ['Mudah bosan saat harus menyelesaikan tahap administrasi berulang setelah fase ide selesai.', 'Debat iseng kadang disalahartikan sebagai serangan pribadi oleh rekan yang sensitif.'],
    commonMisunderstandings: ['Tidak selalu suka memicu keributan; kecenderungan menantang ide sering diniatkan untuk mencari kebenaran yang lebih jernih.'],
    concreteExample: 'Saat curah gagasan kelompok, bisa mengusulkan 5 konsep lomba berbeda dalam 10 menit sambil menguji mana yang paling masuk akal.',
    relatedReferenceIds: ['ref-mbti-gifts-1995', 'ref-mbti-beebe-2016'],
  },
  {
    code: 'INFJ',
    roleTitle: 'Penyintesis Makna & Empati',
    dichotomyBreakdown: { EorI: 'I', SorN: 'N', TorF: 'F', JorP: 'J' },
    grantStack: ['Ni', 'Fe', 'Ti', 'Se'],
    shadowStack: ['Ne', 'Fi', 'Te', 'Si'],
    overview: 'Mengamati pola terdalam manusia dan peristiwa untuk membangun keselarasan etis serta makna jangka panjang.',
    dichotomyInterpretation: 'Reflektif secara internal (I), mencari makna konseptual (N), menimbang dampak manusiawi (F), dan menghargai kejelasan arah (J).',
    cognitiveStackInterpretation: 'Ni dominan memproyeksikan pola jangka panjang, Fe mengomunikasikan kehangatan sosial, Ti mengklarifikasi logika batin, dan Se sebagai fungsi inferior.',
    tendenciesStrengths: ['Peka membaca ketegangan psikologis yang belum terucap di kelompok.', 'Mampu menerjemahkan konsep manusiawi abstrak menjadi panduan reflektif.'],
    potentialChallenges: ['Rentan memikul beban emosi orang lain terlalu dalam sambil mengabaikan batas energi fisik (Se inferior).', 'Kadang sulit menjelaskan intuisi holistik secara bertahap.'],
    commonMisunderstandings: ['Bukan tipe "mistis" yang selalu bisa membaca pikiran; pemahaman mereka tetap berbasis observasi sosial dan refleksi batin.'],
    concreteExample: 'Sering menjadi teman curhat yang merangkum inti konflik dua temannya lalu mengajak mencari titik tengah.',
    relatedReferenceIds: ['ref-mbti-gifts-1995', 'ref-mbti-grant-1983'],
  },
  {
    code: 'INFP',
    roleTitle: 'Idealis Nilai & Kemungkinan',
    dichotomyBreakdown: { EorI: 'I', SorN: 'N', TorF: 'F', JorP: 'P' },
    grantStack: ['Fi', 'Ne', 'Si', 'Te'],
    shadowStack: ['Fe', 'Ni', 'Se', 'Ti'],
    overview: 'Menjunjung keaslian nilai pribadi sekaligus membayangkan beragam cara bermakna untuk mengekspresikan idealisme.',
    dichotomyInterpretation: 'Berfokus ke dalam (I), imajinatif pada kemungkinan (N), memutuskan lewat nilai empati pribadi (F), dan terbuka adaptif (P).',
    cognitiveStackInterpretation: 'Fi dominan mengevaluasi keselarasan hati nurani, didukung Ne untuk ide kreatif, Si sebagai jangkar ingatan berharga, dan Te inferior.',
    tendenciesStrengths: ['Setia pada nilai kemanusiaan serta mampu memahami keragaman cerita individu tanpa mudah menghakimi.', 'Kreatif menyusun metafora tulisan, seni, atau narasi.'],
    potentialChallenges: ['Dapat tersandung tuntutan efisiensi objektif atau kritik lugas tanpa konteks empatik (Te inferior).', 'Cenderung menyendiri jika merasa prinsip pribadinya tidak didengar.'],
    commonMisunderstandings: ['Tidak selalu rapuh atau anti-logika; saat prinsipnya kuat, INFP sangat teguh membela keadilan.'],
    concreteExample: 'Memilih topik riset atau esai yang menyentuh isu kemanusiaan nyata ketimbang topik teknis semata.',
    relatedReferenceIds: ['ref-mbti-jung-1971', 'ref-mbti-grant-1983'],
  },
  {
    code: 'ENFJ',
    roleTitle: 'Fasilitator Harmoni & Potensi',
    dichotomyBreakdown: { EorI: 'E', SorN: 'N', TorF: 'F', JorP: 'J' },
    grantStack: ['Fe', 'Ni', 'Se', 'Ti'],
    shadowStack: ['Fi', 'Ne', 'Si', 'Te'],
    overview: 'Aktif membangun keterhubungan kelompok sambil memotivasi orang lain menuju visi perkembangan bersama.',
    dichotomyInterpretation: 'Berorientasi interaksi sosial (E), melihat gambaran potensi masa depan (N), berbasis nilai empati bersama (F), dan tertata (J).',
    cognitiveStackInterpretation: 'Fe dominan menyelaraskan suasana sosial, Ni memberi fokus tujuan, Se mendukung ekspresi langsung, dan Ti sebagai sisi reflektif pribadi.',
    tendenciesStrengths: ['Menciptakan ruang aman agar anggota pendiam berani berbicara.', 'Menghubungkan tujuan akademik dengan makna kebersamaan tim.'],
    potentialChallenges: ['Berisiko terlalu memprioritaskan penerimaan sosial hingga menekan keraguan pribadi (Ti inferior).', 'Mudah kewalahan jika konflik kelompok tak kunjung selesai.'],
    commonMisunderstandings: ['Tidak selalu haus popularitas; dorongan mereka sering berasal dari keinginan tulus melihat kelompok berkembang serempak.'],
    concreteExample: 'Dalam kerja kelompok SMA, memastikan pembagian peran adil dan mengingatkan rekan yang mulai tertinggal dengan hangat.',
    relatedReferenceIds: ['ref-mbti-manual-1998', 'ref-mbti-grant-1983'],
  },
  {
    code: 'ENFP',
    roleTitle: 'Katalis Inspirasi & Eksplorasi',
    dichotomyBreakdown: { EorI: 'E', SorN: 'N', TorF: 'F', JorP: 'P' },
    grantStack: ['Ne', 'Fi', 'Te', 'Si'],
    shadowStack: ['Ni', 'Fe', 'Ti', 'Se'],
    overview: 'Antusias menggali keterkaitan gagasan baru sambil menjaga autentisitas rasa dan empati antarindividu.',
    dichotomyInterpretation: 'Energetik dalam berinteraksi (E), fokus pada peluang imajinatif (N), mempertimbangkan nilai kemanusiaan (F), dan fleksibel (P).',
    cognitiveStackInterpretation: 'Ne dominan memicu aliran ide, Fi menilai makna personalnya, Te tersier menata eksekusi bila termotivasi, dan Si inferior pada detail rutin.',
    tendenciesStrengths: ['Menginspirasi tim lewat antusiasme segar dan cara pandang inklusif.', 'Mudah beradaptasi lintas lingkungan sosial baru.'],
    potentialChallenges: ['Rentan memulai banyak proyek baru sebelum menyelesaikan proyek sebelumnya.', 'Kesulitan menjaga konsistensi tugas administratif berulang (Si inferior).'],
    commonMisunderstandings: ['Tidak sekadar ceria atau kurang fokus; ketika nilai Fi mereka tersentuh, mereka bisa meneliti topik berjam-jam.'],
    concreteExample: 'Membuka presentasi kelas dengan cerita analogi menarik agar teman-teman langsung terlibat secara emosional dan intelektual.',
    relatedReferenceIds: ['ref-mbti-gifts-1995', 'ref-mbti-beebe-2016'],
  },
  {
    code: 'ISTJ',
    roleTitle: 'Penjaga Ketelitian & Fakta Teruji',
    dichotomyBreakdown: { EorI: 'I', SorN: 'S', TorF: 'T', JorP: 'J' },
    grantStack: ['Si', 'Te', 'Fi', 'Ne'],
    shadowStack: ['Se', 'Ti', 'Fe', 'Ni'],
    overview: 'Mengandalkan akurasi data historis, ketekunan prosedur, serta tanggung jawab konsisten pada komitmen nyata.',
    dichotomyInterpretation: 'Reflektif tenang (I), bertumpu pada fakta terverifikasi (S), objektif rasional (T), serta teratur menyelesaikan rencana (J).',
    cognitiveStackInterpretation: 'Si dominan membandingkan pengalaman kini dengan catatan teruji, Te mengeksekusi tugas terukur, Fi menjaga integritas senyap, dan Ne inferior.',
    tendenciesStrengths: ['Sangat dapat diandalkan dalam akurasi fakta, tenggat, dan dokumentasi.', 'Tenang menata proyek kompleks langkah demi langkah.'],
    potentialChallenges: ['Bisa ragu menerima perubahan mendadak yang belum memiliki bukti keberhasilan (Ne inferior).', 'Kurang nyaman dengan instruksi terlalu kabur tanpa contoh konkret.'],
    commonMisunderstandings: ['Bukan "robot aturan yang kaku"; mereka menghormati struktur karena terbukti menjaga keadilan dan kualitas hasil.'],
    concreteExample: 'Saat praktikum laboratorium, mencatat setiap angka pengukuran, satuan, dan prosedur keselamatan secara rapi.',
    relatedReferenceIds: ['ref-mbti-manual-1998', 'ref-mbti-grant-1983'],
  },
  {
    code: 'ISFJ',
    roleTitle: 'Pemelihara Kesinambungan & Kepedulian',
    dichotomyBreakdown: { EorI: 'I', SorN: 'S', TorF: 'F', JorP: 'J' },
    grantStack: ['Si', 'Fe', 'Ti', 'Ne'],
    shadowStack: ['Se', 'Fi', 'Te', 'Ni'],
    overview: 'Memperhatikan kebutuhan praktis dan detail kenyamanan orang lain berdasarkan kepekaan pada kebiasaan nyata.',
    dichotomyInterpretation: 'Tenang privat (I), peka detail konkret (S), berorientasi kepedulian manusia (F), dan menghargai keteraturan komitmen (J).',
    cognitiveStackInterpretation: 'Si dominan mengingat detail personal serta kebiasaan orang sekitar, Fe mewujudkan perhatian sosial, Ti menata penalaran mandiri, dan Ne inferior.',
    tendenciesStrengths: ['Teliti memperhatikan hal kecil yang sering terlewat rekan lain.', 'Membangun stabilitas dan keandalan hangat dalam tim belajar.'],
    potentialChallenges: ['Sering memendam kelelahan atau keberatan pribadi demi menghindari konflik langsung.', 'Cemas ketika dihadapkan ketidakpastian mendadak tanpa arahan jelas (Ne inferior).'],
    commonMisunderstandings: ['Kesediaan membantu bukan berarti tidak punya pendapat tegas; prinsip batin mereka sangat kuat saat nilai kepedulian dilanggar.'],
    concreteExample: 'Menyimpan rangkuman catatan pelajaran terstruktur dan bersedia meminjamkannya dengan penjelasan langkah demi langkah.',
    relatedReferenceIds: ['ref-mbti-gifts-1995', 'ref-mbti-grant-1983'],
  },
  {
    code: 'ESTJ',
    roleTitle: 'Koordinator Operasional Terstruktur',
    dichotomyBreakdown: { EorI: 'E', SorN: 'S', TorF: 'T', JorP: 'J' },
    grantStack: ['Te', 'Si', 'Ne', 'Fi'],
    shadowStack: ['Ti', 'Se', 'Ni', 'Fe'],
    overview: 'Mengelola proses kerja nyata dengan standar yang jelas, mengandalkan praktik terbaik yang terbukti berhasil.',
    dichotomyInterpretation: 'Aktif mengoordinasi (E), fokus kenyataan praktis (S), keputusan objektif lugas (T), dan disiplin jadwal (J).',
    cognitiveStackInterpretation: 'Te dominan mengatur tata kerja, didukung referensi pengalaman Si, kelincahan ide Ne tersier, dan pertimbangan batin Fi inferior.',
    tendenciesStrengths: ['Mampu mengubah wacana menjadi pembagian tugas dan jadwal konkret.', 'Konsisten menjaga keadilan aturan bersama.'],
    potentialChallenges: ['Terkadang kurang sabar menghadapi diskusi abstrak panjang tanpa kesimpulan praktis.', 'Kurang menyadari dampak nada bicara tegas pada rekan yang sensitif (Fi inferior).'],
    commonMisunderstandings: ['Ketegasan prosedural bertujuan mempercepat keberhasilan bersama, bukan sekadar ingin mengatur orang lain.'],
    concreteExample: 'Menjadi koordinator tugas kelompok yang langsung membuat checklist rubrik penilaian agar tidak ada syarat tugas terlewat.',
    relatedReferenceIds: ['ref-mbti-manual-1998', 'ref-mbti-grant-1983'],
  },
  {
    code: 'ESFJ',
    roleTitle: 'Penghubung Kebersamaan & Harmoni Nyata',
    dichotomyBreakdown: { EorI: 'E', SorN: 'S', TorF: 'F', JorP: 'J' },
    grantStack: ['Fe', 'Si', 'Ne', 'Ti'],
    shadowStack: ['Fi', 'Se', 'Ni', 'Te'],
    overview: 'Menggerakkan solidaritas kelompok dan merawat tradisi kebersamaan melalui perhatian nyata pada setiap anggota.',
    dichotomyInterpretation: 'Terbuka berinteraksi (E), peka situasi konkret (S), berdasar keselarasan interpersonal (F), dan terorganisir (J).',
    cognitiveStackInterpretation: 'Fe dominan membaca atmosfer sosial, Si menjaga kontinuitas detail acara/norma, Ne tersier membuka alternatif ramah, dan Ti inferior.',
    tendenciesStrengths: ['Menyatukan kelompok heterogen agar setiap orang merasa diterima.', 'Sigap mengatur logistik acara sekolah atau kegiatan sosial.'],
    potentialChallenges: ['Terlalu sensitif terhadap kritik impersonal yang tidak disertai pengakuan usaha (Ti inferior).', 'Cenderung menanggung beban terlalu banyak agar suasana tetap aman.'],
    commonMisunderstandings: ['Perhatian pada norma sosial bukan dangkal; itu cara konkret mereka menjaga kohesi komunitas.'],
    concreteExample: 'Mengingat ulang tahun anggota kelas, mengatur jadwal piket, dan mencairkan suasana canggung saat kedatangan siswa baru.',
    relatedReferenceIds: ['ref-mbti-gifts-1995', 'ref-mbti-grant-1983'],
  },
  {
    code: 'ISTP',
    roleTitle: 'Pemecah Masalah Taktis Langsung',
    dichotomyBreakdown: { EorI: 'I', SorN: 'S', TorF: 'T', JorP: 'P' },
    grantStack: ['Ti', 'Se', 'Ni', 'Fe'],
    shadowStack: ['Te', 'Si', 'Ne', 'Fi'],
    overview: 'Membedah cara kerja mekanisme fisik maupun logis secara tenang dan bertindak responsif sesuai situasi di lapangan.',
    dichotomyInterpretation: 'Mandiri reflektif (I), menyentuh realitas konkret (S), analitis objektif (T), serta adaptif terhadap momen kini (P).',
    cognitiveStackInterpretation: 'Ti dominan memahami struktur teknis-logis, Se responsif menguji fakta langsung, Ni tersier melihat pola inti, dan Fe inferior.',
    tendenciesStrengths: ['Tetap tenang memecahkan krisis teknis atau alat bermasalah di saat genting.', 'Belajar paling cepat melalui praktik langsung dan eksperimen.'],
    potentialChallenges: ['Kurang menyukai aturan formal atau teori bertele-tele tanpa contoh mekanisme nyata.', 'Canggung mengekspresikan kehangatan emosional verbal secara spontan (Fe inferior).'],
    commonMisunderstandings: ['Bukan berarti cuek atau tidak peduli teman; mereka sering menunjukkan kepedulian lewat bantuan aksi nyata dibanding kata-kata panjang.'],
    concreteExample: 'Langsung membongkar prototipe alat praktik sekolah untuk mengecek bagian mana yang macet daripada sekadar membaca manual tebal.',
    relatedReferenceIds: ['ref-mbti-jung-1971', 'ref-mbti-grant-1983'],
  },
  {
    code: 'ISFP',
    roleTitle: 'Ekspresor Nilai & Pengalaman Estetik',
    dichotomyBreakdown: { EorI: 'I', SorN: 'S', TorF: 'F', JorP: 'P' },
    grantStack: ['Fi', 'Se', 'Ni', 'Te'],
    shadowStack: ['Fe', 'Si', 'Ne', 'Ti'],
    overview: 'Menjalani nilai batin autentik yang diwujudkan secara langsung lewat kepekaan sensorik, karya, dan tindakan lembut.',
    dichotomyInterpretation: 'Privat tenang (I), hidup di momen nyata (S), menimbang nilai empati personal (F), dan fleksibel spontan (P).',
    cognitiveStackInterpretation: 'Fi dominan menjaga integritas batin, Se menangkap kualitas estetika dan kenyataan fisik, Ni tersier memberi makna simbolik, dan Te inferior.',
    tendenciesStrengths: ['Peka terhadap warna, detail suasana, serta ketulusan tindakan nyata.', 'Tidak mudah ikut arus hanya demi pujian bila bertentangan dengan nurani.'],
    potentialChallenges: ['Kesulitan menyusun penjadwalan administratif jangka panjang bila terpisah dari makna personal (Te inferior).', 'Cenderung menarik diri diam-diam ketika menghadapi tekanan konfrontatif.'],
    commonMisunderstandings: ['Ketenangan ISFP bukan kepasifan; mereka sangat berprinsip dan ekspresif dalam medium pilihan mereka sendiri.'],
    concreteExample: 'Menyumbang visual poster kelas yang kuat secara rasa tanpa banyak berdebat panjang dalam rapat.',
    relatedReferenceIds: ['ref-mbti-gifts-1995', 'ref-mbti-grant-1983'],
  },
  {
    code: 'ESTP',
    roleTitle: 'Eksekutor Taktis Momen Kini',
    dichotomyBreakdown: { EorI: 'E', SorN: 'S', TorF: 'T', JorP: 'P' },
    grantStack: ['Se', 'Ti', 'Fe', 'Ni'],
    shadowStack: ['Si', 'Te', 'Fi', 'Ne'],
    overview: 'Cepat membaca peluang praktis di lingkungan nyata sambil mengambil langkah logis berisiko terukur.',
    dichotomyInterpretation: 'Aktif berinteraksi nyata (E), fokus fakta inderawi langsung (S), keputusan taktis objektif (T), dan luwes cepat beradaptasi (P).',
    cognitiveStackInterpretation: 'Se dominan menyerap kondisi sekitar saat ini, Ti memfilter taktik efisien, Fe tersier membaca respons orang, dan Ni inferior.',
    tendenciesStrengths: ['Lincah merespons perubahan mendadak tanpa panik.', 'Menarik perhatian audiens dengan gaya penyampaian hidup dan contoh nyata.'],
    potentialChallenges: ['Kadang kurang sabar mempertimbangkan konsekuensi jangka panjang yang masih abstrak (Ni inferior).', 'Cepat bosan pada pembelajaran pasif satu arah.'],
    commonMisunderstandings: ['Tidak selalu sembrono; ESTP yang matang tajam dalam membaca kalkulasi risiko di situasi nyata.'],
    concreteExample: 'Dalam lomba debat atau simulasi bisnis SMA, cepat mengubah strategi ketika pertanyaan juri berubah arah.',
    relatedReferenceIds: ['ref-mbti-manual-1998', 'ref-mbti-grant-1983'],
  },
  {
    code: 'ESFP',
    roleTitle: 'Penggerak Energi & Pengalaman Bersama',
    dichotomyBreakdown: { EorI: 'E', SorN: 'S', TorF: 'F', JorP: 'P' },
    grantStack: ['Se', 'Fi', 'Te', 'Ni'],
    shadowStack: ['Si', 'Fe', 'Ti', 'Ne'],
    overview: 'Hadir antusias di momen nyata untuk menciptakan pengalaman positif, ekspresif, dan hangat bersama orang lain.',
    dichotomyInterpretation: 'Berenergi dari kebersamaan aktif (E), menghargai pengalaman konkret (S), berdasar empati dan nilai personal (F), dan spontan adaptif (P).',
    cognitiveStackInterpretation: 'Se dominan menangkap suasana sekitar secara hidup, Fi menimbang ketulusan, Te tersier mengeksekusi proyek konkret, dan Ni inferior.',
    tendenciesStrengths: ['Menghidupkan kolaborasi yang kaku dan mudah melibatkan teman baru.', 'Praktis menghadirkan hasil nyata yang bisa langsung dirasakan.'],
    potentialChallenges: ['Mudah terdistraksi oleh aktivitas baru ketika tugas menuntut perencanaan jangka panjang terisolasi (Ni inferior).', 'Bisa merasa terlalu terpukul oleh kritik pribadi yang terasa dingin.'],
    commonMisunderstandings: ['Sifat ceria tidak berarti kurang serius soal masa depan; ESFP belajar sangat efektif saat konsep dikaitkan dengan praktik manusia nyata.'],
    concreteExample: 'Memimpin sesi simulasi kelas atau kegiatan seni sekolah sehingga semua teman berpartisipasi aktif.',
    relatedReferenceIds: ['ref-mbti-gifts-1995', 'ref-mbti-beebe-2016'],
  },
];

// ============================================================================
// 10B. SLOAN / GLOBAL 5 & BIG FIVE THEORY LIBRARY
// ============================================================================

export const SLOAN_THEORY_OVERVIEW = {
  title: 'Big Five (OCEAN) & Global 5 / SLOAN',
  historyTimeline: [
    {
      era: '1930s–1980s · Hipotesis Leksikal',
      title: 'Akar Bahasa Alamiah Sifat Kepribadian',
      detail:
        'Para psikolog (dimulai dari Allport & Odbert hingga Cattell dan Tupes & Christal) meneliti ribuan kata sifat dalam kamus untuk menemukan dimensi dasar yang konsisten menggambarkan variasi perilaku manusia lintas bahasa (John & Srivastava, 1999).',
    },
    {
      era: '1990 · Terminologi "Big Five"',
      title: 'Lewis R. Goldberg — Faktor Leksikal Lima Besar',
      detail:
        'Melalui analisis faktor ekstensif, Goldberg (1990) menunjukkan lima dimensi utama yang relatif saling bebas dan stabil lintas metode pengukuran.',
    },
    {
      era: '1992 · Five-Factor Model (FFM)',
      title: 'Paul T. Costa Jr. & Robert R. McCrae (NEO-PI-R)',
      detail:
        'Costa dan McCrae (1992) menyusun NEO Personality Inventory-Revised dengan 5 domain utama (Neuroticism, Extraversion, Openness, Agreeableness, Conscientiousness) beserta 30 sub-faset terukur secara kontinum/persentil.',
    },
    {
      era: '2000s · Adaptasi Komunitas "Global 5 / SLOAN"',
      title: 'Dari Skor Kontinum Menjadi Kode 5 Huruf (SimilarMinds)',
      detail:
        'Situs komunitas daring SimilarMinds menciptakan singkatan Global 5 / SLOAN agar pengguna tipe kepribadian (seperti MBTI) dapat menerjemahkan skor kontinum Big Five menjadi kode 32 kombinasi biner (misalnya RLOAI, SCOAI) serta notasi lanjutan [X]/x/ untuk menggambarkan kekuatan dominan.',
    },
  ],
  comparisons: [
    {
      framework: 'Big Five Akademik (OCEAN / NEO-PI-R)',
      scaleType: 'Kontinum statistik (skor persentil 0–100% + 30 faset)',
      keyDifference: 'Menolak pengkotakan tipe kaku; dua orang dengan skor 52% dan 96% dianggap berbeda derajat secara bermakna.',
      scientificStanding: 'Standar emas riset psikologi kepribadian empiris dan psikometrik modern (Costa & McCrae, 1992; Goldberg, 1990).',
    },
    {
      framework: 'Global 5 / SLOAN (Standar 5 Huruf & Notasi Lanjutan)',
      scaleType: 'Kategorisasi biner 32 tipe + tanda kekuatan komunitas ([S]lo/E/I)',
      keyDifference: 'Menyederhanakan skor menjadi 5 huruf mudah dibaca; mudah dipelajari namun kehilangan presisi skor tengah (borderline 45–55%).',
      scientificStanding: 'Adaptasi komunitas populer untuk edukasi & eksplorasi diri; notasi [X]/x/ adalah konvensi forum, bukan aturan resmi APA/PAR.',
    },
    {
      framework: 'MBTI (Myers-Briggs)',
      scaleType: '4 Dikotomi preferensi kognitif/keputusan (E/I, S/N, T/F, J/P)',
      keyDifference: 'Tidak mengukur reaktivitas emosional (Neuroticism / L–C). Dua orang INTP bisa sangat berbeda pada skor C vs L atau O vs U.',
      scientificStanding: 'Fokus preferensi refleksi & bimbingan; Big Five lebih tinggi daya prediksi empirisnya terhadap kebiasaan kerja sehari-hari.',
    },
    {
      framework: 'Socionics (Model A)',
      scaleType: 'Metabolisme informasi 8 fungsi & hubungan intertipe',
      keyDifference: 'Menjelaskan *cara memproses informasi* di pikiran, sedangkan SLOAN mengukur *kecenderungan perilaku teramati* dari luar.',
      scientificStanding: 'Tidak ada peta 1-ke-1 mutlak antara kode Socionics (mis. ILE) dan kode SLOAN.',
    },
    {
      framework: 'Enneagram',
      scaleType: '9 Motivasi inti emosional, ketakutan dasar & insting',
      keyDifference: 'Dua orang berkode SLOAN RCOAI dapat memiliki motif Enneagram berbeda (mis. Tipe 5 mencari kompetensi vs Tipe 1 menjaga integritas).',
      scientificStanding: 'Enneagram menanyakan "mengapa dorongan batin muncul", SLOAN memetakan "seberapa sering sifat itu tampak".',
    },
  ],
  misconceptions: [
    'Mengira kode "E (Egocentric)" berarti egois secara moral—dalam Big Five, ini sekadar posisi lebih rendah pada skala kompromi Agreeableness (lugas/kompetitif).',
    'Mengira kode "L (Limbic)" berarti sakit mental—pada kenyataannya ini mengukur kepekaan normal terhadap stresor yang dialami semua manusia dalam derajat berbeda.',
    'Mengira kode "N (Non-Curious)" (atau di sebagian variasi situs disingkat berbeda) berarti malas berpikir—kutub ini sebenarnya menunjukkan orientasi pragmatis dan berbasis fakta konkret.',
    'Menghafal kode 5 huruf tanpa memahami bahwa skor persentil tengah (45–55%) bersifat fleksibel tergantung konteks kelas dan stres.',
  ],
};

// ============================================================================
// 10C. TEMPERAMENT COMPLETE THEORY LIBRARY
// ============================================================================

export interface ClassicalTemperamentEntry {
  id: 'sanguine' | 'choleric' | 'melancholic' | 'phlegmatic';
  name: string;
  indoName: string;
  historicalElement: string;
  eysenckMapping: string;
  coreTraits: string[];
  cognitiveEmotionalTendencies: string[];
  learningCommunicationStyle: string;
  teamStrengths: string[];
  challengesUnderStress: string[];
  helpfulSupport: string;
  exampleScenario: string;
}

export interface MixedTemperamentBlendEntry {
  id: string;
  pairKey: string;
  primary: 'Sanguine' | 'Choleric' | 'Melancholic' | 'Phlegmatic';
  secondary: 'Sanguine' | 'Choleric' | 'Melancholic' | 'Phlegmatic';
  title: string;
  indoTitle: string;
  dynamicBalance: string;
  internalTension: string;
  academicStrength: string;
  watchOut: string;
  generalCharacteristics: string;
  dominantVsSecondary: string;
  interactionDynamics: string;
  strengths: string[];
  challenges: string[];
  communicationPatterns: string;
  behavioralExamples: string[];
  contrastWithReversed: string;
  misconceptions: string[];
  references: string[];
}

export interface MbtiFunctionPositionEntry {
  position: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
  group: 'Sadar (Ego Stack — Grant)' | 'Bayangan (Shadow Stack — Beebe)';
  title: string;
  archetypeLabel: string;
  roleSummary: string;
  healthyExpression: string;
  imbalanceOrStress: string;
  developmentDirection: string;
  modelNuance: string;
}

export interface MbtiStackDynamicsEntry {
  code: string;
  stackLabel: string;
  domAuxDynamic: string;
  domTerDynamic: string;
  domInfDynamic: string;
  auxTerDynamic: string;
  integratedSystemBehavior: string;
  realLifeExamples: string[];
  growthDevelopment: string;
  internalTensions: string;
  stressLoopsAndGrip: string;
  misconceptionsAndAlternatives: string;
  references: string[];
}

export interface CrossFrameworkComparisonEntry {
  id: string;
  title: string;
  frameworkA: string;
  frameworkB: string;
  tagline: string;
  sharedConcepts: string[];
  falseFriends: {
    term: string;
    meaningInA: string;
    meaningInB: string;
    clarification: string;
  }[];
  coreDifferences: {
    dimension: string;
    inA: string;
    inB: string;
  }[];
  classificationStructure: string;
  interpretationMethods: string;
  historicalRoots: string;
  typeConstruction: string;
  misconceptions: string[];
  sameSituationExample: {
    situation: string;
    interpretationA: string;
    interpretationB: string;
    synthesisTakeaway: string;
  };
  references: string[];
}

export const TEMPERAMENT_HISTORY_AND_MODELS = {
  medicalDisclaimer:
    'Klarifikasi Sejarah & Sains: Teori empat humor klasik (darah, empedu kuning, empedu hitam, dahak) adalah model sejarah filsafat kedokteran Yunani Kuno—BUKAN ilmu biologi atau diagnosis medis modern. Di masa kini, konsep "temperamen" digunakan dalam dua jalur berbeda: (1) psikologi perkembangan/biologis modern mengenai reaktivitas & regulasi diri (Thomas & Chess, 1977; Kagan, 1994; Eysenck, 1967), serta (2) tipologi perilaku populer atau 4 Temperamen Keirsey (1998).',
  historyTimeline: [
    {
      era: '~400 SM – 200 M · Akar Klasik Yunani-Romawi',
      title: 'Hippocrates & Galen dari Pergamon',
      detail:
        'Hippocrates merumuskan empat cairan tubuh (humorisme), kemudian Galen mengaitkan keseimbangan dominannya dengan empat kecenderungan karakter manusia: Sanguine, Choleric, Melancholic, dan Phlegmatic (dibahas historis dalam Kagan, 1994).',
    },
    {
      era: 'Abad 19–20 · Penyatuan Campuran Sekunder',
      title: 'Tradisi Kombinasi Temperamen Primer–Sekunder',
      detail:
        'Para pendidik dan penulis kepribadian modern menyadari hampir tidak ada individu yang 100% murni satu sifat, sehingga muncul klasifikasi kombinasi (seperti Melankolis–Plegmatis atau Koleris–Sanguin). Penting dicatat bahwa pasangan campuran eksplisit ini merupakan pengembangan lanjutan di atas kerangka asli Galen.',
    },
    {
      era: '1967–1994 · Riset Biologis & Perkembangan Modern',
      title: 'Eysenck (1967), Thomas & Chess (1977), dan Jerome Kagan (1994)',
      detail:
        'Hans Eysenck (1967) memetakan keempat label klasik ke dua sumbu empiris: Ekstraversi–Introversi dan Stabilitas–Neurotisisme. Sementara Thomas & Chess (1977) serta Kagan (1994) meneliti temperamen sejak masa bayi secara ilmiah melalui reaktivitas saraf dan kesesuaian lingkungan ("goodness of fit").',
    },
    {
      era: '1978–1998 · Temperamen Keirsey',
      title: 'David Keirsey — Artisan (SP), Guardian (SJ), Idealist (NF), Rational (NT)',
      detail:
        'Keirsey (1998) mengadaptasi istilah "temperamen" secara berbeda lagi dengan mengelompokkan 16 tipe MBTI menjadi 4 kelompok peran sosial dan kecerdasan perilaku. Kerangka Keirsey TIDAK sama secara satu-banding-satu dengan 4 humor klasik Galen.',
    },
  ],
  modelComparisons: [
    {
      dimension: 'Fokus Inti',
      classical: '4 pola energi emosional & kecepatan reaksi (Sanguin, Koleris, Melankolis, Plegmatis).',
      psychobiological: '9 dimensi bawaan anak (tingkat aktivitas, adaptabilitas, ambang respons) serta reaktivitas amigdala/saraf (Kagan, 1994; Thomas & Chess, 1977).',
      eysenck: 'Persilangan 2 faktor psikometrik: Ekstraversi (tinggi/rendah) × Neurotisisme (tinggi/rendah) (Eysenck, 1967).',
      keirsey: 'Pola kebutuhan peran, bahasa, dan penggunaan instrumen komunikasi berbasis kelompok tipe SP, SJ, NF, NT (Keirsey, 1998).',
    },
    {
      dimension: 'Status Empiris Saat Ini',
      classical: 'Bahasa deskriptif klasik untuk refleksi pedagogis; teori humoral biologisnya sudah ditinggalkan ilmu kedokteran.',
      psychobiological: 'Didukung riset longitudinal perkembangan anak dan psikobiologi kontemporer.',
      eysenck: 'Jembatan statistik awal yang kemudian berkembang dan diperkaya oleh riset Big Five.',
      keirsey: 'Model populer untuk eksplorasi karakter & karier yang beririsan dengan MBTI.',
    },
  ],
};

export const CLASSICAL_4_TEMPERAMENTS: ClassicalTemperamentEntry[] = [
  {
    id: 'sanguine',
    name: 'Sanguine',
    indoName: 'Sanguinis',
    historicalElement: 'Simbol Historis: Udara · Hangat & Cepat Merespons',
    eysenckMapping: 'Dalam kuadran Eysenck (1967): Ekstraversi Tinggi + Stabilitas Emosional Tinggi (Stabil-Ekstrovert).',
    coreTraits: ['Ekspresif dan antusias', 'Cepat membangun keakraban', 'Spontan, optimis, dan berorientasi variasi'],
    cognitiveEmotionalTendencies: [
      'Cepat membangkitkan semangat saat berinteraksi dengan orang baru atau topik segar.',
      'Reaksi emosional ekspresif dan cepat bergeser suasana tanpa menyimpan dendam lama.',
    ],
    learningCommunicationStyle: 'Belajar optimal melalui diskusi aktif, cerita, simulasi peran, dan variasi aktivitas dinamis.',
    teamStrengths: ['Mencairkan suasana rapat yang kaku.', 'Menularkan optimisme saat tim mengalami kebuntuan moral.'],
    challengesUnderStress: ['Rentan kehilangan detail jadwal atau lupa menindaklanjuti janji rutin jika tidak dicatat.'],
    helpfulSupport: 'Bantu dengan pengingat visual ringkas dan pecah proyek panjang menjadi pos capaian pendek.',
    exampleScenario: 'Saat presentasi kelas, langsung menyapa audiens dengan humor ringan agar presentasi terasa hidup.',
  },
  {
    id: 'choleric',
    name: 'Choleric',
    indoName: 'Koleris',
    historicalElement: 'Simbol Historis: Api · Cepat Beraksi & Terarah Tujuan',
    eysenckMapping: 'Dalam kuadran Eysenck (1967): Ekstraversi Tinggi + Reaktivitas Emosional Tinggi (Labil-Ekstrovert / Tegas).',
    coreTraits: ['Berorientasi target dan hasil', 'Berani mengambil inisiatif tegas', 'Cepat memutuskan dan kompetitif'],
    cognitiveEmotionalTendencies: [
      'Langsung melihat hambatan sebagai tantangan yang harus diatasi segera.',
      'Cenderung mengutamakan progres nyata di atas keraguan panjang.',
    ],
    learningCommunicationStyle: 'Menyukai komunikasi lugas langsung ke inti persoalan, tantangan studi kasus nyata, dan otonomi peran.',
    teamStrengths: ['Menggerakkan tim dari wacana menuju eksekusi.', 'Berani mengambil tanggung jawab saat krisis waktu.'],
    challengesUnderStress: ['Dapat terdengar tidak sabaran atau terlalu mendominasi ketika rekan bergerak dengan tempo lebih lambat.'],
    helpfulSupport: 'Berikan kejelasan otoritas bagian tugasnya sambil ingatkan pentingnya jeda mendengarkan sudut pandang tim.',
    exampleScenario: 'Saat diskusi macet 15 menit tanpa keputusan, langsung menawarkan pembagian kerja agar kelompok segera bergerak.',
  },
  {
    id: 'melancholic',
    name: 'Melancholic',
    indoName: 'Melankolis',
    historicalElement: 'Simbol Historis: Bumi · Mendalam, Analitis & Terstruktur',
    eysenckMapping: 'Dalam kuadran Eysenck (1967): Ekstraversi Rendah + Reaktivitas Tinggi (Sensitif-Introvert).',
    coreTraits: ['Teliti terhadap standar kualitas', 'Berpikir reflektif mendalam', 'Terencana, setia, dan peka makna'],
    cognitiveEmotionalTendencies: [
      'Memproses peristiwa secara internal dan memikirkan konsekuensi detail maupun risiko sebelum bertindak.',
      'Peka terhadap ketidaksesuaian antara ideal dan kenyataan.',
    ],
    learningCommunicationStyle: 'Unggul lewat analisis mendalam, daftar periksa terstruktur, waktu berpikir tenang, dan instruksi presisi.',
    teamStrengths: ['Menemukan celah kesalahan rencana sebelum presentasi atau pengumpulan.', 'Menghasilkan laporan dan karya berkedalaman tinggi.'],
    challengesUnderStress: ['Rentan terjebak perfeksionisme atau kritik diri berlebih jika hasil terasa kurang sempurna.'],
    helpfulSupport: 'Sampaikan apresiasi spesifik terhadap ketelitiannya serta batasi standar revisi agar tugas tetap selesai tepat waktu.',
    exampleScenario: 'Meneliti daftar pustaka dan kesesuaian data grafik laporan sampai larut karena tidak ingin ada kesalahan kutipan.',
  },
  {
    id: 'phlegmatic',
    name: 'Phlegmatic',
    indoName: 'Plegmatis',
    historicalElement: 'Simbol Historis: Air · Tenang, Stabil & Diplomatis',
    eysenckMapping: 'Dalam kuadran Eysenck (1967): Ekstraversi Rendah + Stabilitas Emosional Tinggi (Stabil-Introvert).',
    coreTraits: ['Kalem dan tidak mudah tersulut panik', 'Pendengar sabar dan diplomatis', 'Konsisten pada ritme stabil'],
    cognitiveEmotionalTendencies: [
      'Menjaga keseimbangan emosional di tengah perdebatan panas dan memilih respons yang menenangkan.',
      'Lebih nyaman bekerja tanpa tekanan konflik terbuka yang tak perlu.',
    ],
    learningCommunicationStyle: 'Belajar optimal dalam suasana kondusif bebas intimidasi, tempo teratur, dan contoh aplikasi tenang.',
    teamStrengths: ['Menjadi penengah objektif saat terjadi gesekan antarteman.', 'Menjaga konsistensi kerja kelompok di fase penyelesaian rutin.'],
    challengesUnderStress: ['Bisa menunda menyampaikan keberatan atau terlihat pasif demi menghindari konflik dengan tokoh dominan.'],
    helpfulSupport: 'Minta pendapatnya secara eksplisit dalam forum kecil dan beri kepastian bahwa masukan jujurnya dihargai.',
    exampleScenario: 'Saat dua rekan berdebat sengit soal desain makalah, menyimak keduanya lalu merangkum bagian yang bisa digabungkan.',
  },
];

export const MIXED_12_TEMPERAMENTS: MixedTemperamentBlendEntry[] = [
  {
    id: 'sang-chol',
    pairKey: 'sang-chol-pair',
    primary: 'Sanguine',
    secondary: 'Choleric',
    title: 'Sanguine–Choleric',
    indoTitle: 'Sanguinis–Koleris (Antusias & Penggerak)',
    dynamicBalance: 'Memadukan daya tarik sosial dan spontanitas ide Sanguin dengan keberanian mengambil keputusan serta dorongan hasil Koleris.',
    internalTension: 'Keinginan menjaga suasana tetap menyenangkan vs ketidaksabaran menghadapi kinerja lambat.',
    academicStrength: 'Menonjol pada proyek presentasi kreatif, kepemimpinan acara organisasi, debat, dan wirausaha siswa.',
    watchOut: 'Berisiko mengambil terlalu banyak komitmen sekaligus lalu terburu-buru mengabaikan detail.',
    generalCharacteristics: 'Temperamen ekspresif berenergi tinggi yang mengutamakan keterlibatan sosial dan kejelasan momentum. Sanguinis memberi kehangatan, improvisasi, dan keterbukaan terhadap variasi, sementara Koleris memberi ketegasan menentukan arah ketika diskusi mulai buntu.',
    dominantVsSecondary: 'Sanguinis (Primer) menjadi motor utama yang mencari koneksi, variasi, dan inspirasi antusias; Koleris (Sekunder) hadir sebagai penyokong ketegasan untuk mengunci keputusan dan menggerakkan eksekusi.',
    interactionDynamics: 'Kehangatan Sanguin melembutkan ketajaman Koleris sehingga ajakan bertindak terdengar persuasif alih-alih memerintah; sebaliknya arah tujuan Koleris menahan Sanguin agar obrolan tidak berhenti di wacana.',
    strengths: [
      'Cepat membangkitkan semangat kelompok yang lesu atau baru berkenalan.',
      'Mampu berimprovisasi di panggung maupun saat presentasi dadakan tetap fokus pada pesan inti.',
      'Berani menawarkan solusi baru sambil merangkul banyak orang.',
    ],
    challenges: [
      'Mudah bosan pada pengerjaan administratif berulang atau penelusuran bibliografi panjang.',
      'Kadang menjanjikan target terlalu optimistis tanpa menghitung kapasitas waktu riil.',
    ],
    communicationPatterns: 'Komunikasinya hangat, penuh cerita atau humor ringan, tetapi cepat mengerucut ke ajakan tindakan nyata saat merasa waktunya mendesak.',
    behavioralExamples: [
      'Membuka rapat panitia dengan candaan cair lalu langsung menunjuk siapa memegang seksi acara dan publikasi.',
      'Lebih bersemangat saat belajar lewat diskusi kasus hidup ketimbang membaca diktat sunyi berjam-jam.',
    ],
    contrastWithReversed: 'Berbeda dari Koleris–Sanguinis yang memulai dari target dan efisiensi lalu memakai pesona sosial sebagai alat menggerakkan tim, Sanguinis–Koleris justru digerakkan oleh keakraban dan kegembiraan interaksi terlebih dahulu sebelum menyalakan ketegasan Koleris saat dibutuhkan.',
    misconceptions: [
      'Tidak selalu sembrono atau sekadar suka tampil; sisi Koleris memberi kepekaan tinggi pada hasil nyata.',
      'Berbeda dengan Keirsey Artisan maupun dikotomi E+P MBTI yang tidak memetakan tingkat kestabilan emosi.',
    ],
    references: ['Eysenck (1967)', 'Kagan (1994)', 'Thomas & Chess (1977)'],
  },
  {
    id: 'chol-sang',
    pairKey: 'sang-chol-pair',
    primary: 'Choleric',
    secondary: 'Sanguine',
    title: 'Choleric–Sanguine',
    indoTitle: 'Koleris–Sanguinis (Direktif & Karismatik)',
    dynamicBalance: 'Mengutamakan pencapaian target dan kepemimpinan lugas ala Koleris, sambil ditopang keluwesan sosial dan optimisme Sanguinis.',
    internalTension: 'Dorongan langsung ke inti hasil vs godaan menyimpang mengikuti ide-ide seru yang muncul di tengah jalan.',
    academicStrength: 'Kuat pada koordinasi proyek lintas tim, negosiasi, lomba debat strategis, dan kepemimpinan kelas.',
    watchOut: 'Bisa terdengar terlalu memaksa dengan nada ceria sehingga mengira semua orang siap berlari secepat dirinya.',
    generalCharacteristics: 'Kombinasi yang proaktif, penuh inisiatif, dan berfokus pada solusi cepat di lingkungan sosial. Ketegasan Koleris hadir di garda depan sejak menit pertama, sementara sisi Sanguin membuatnya mudah disukai dan lihai membaca respons audiens.',
    dominantVsSecondary: 'Koleris (Primer) menetapkan standar, tujuan, dan tempo; Sanguinis (Sekunder) memberi bumbu keramahan, humor, dan kelenturan persuasi.',
    interactionDynamics: 'Ketika sisi Koleris berisiko terdengar keras atau tak sabaran, sisi Sanguin segera mencairkan ketegangan sehingga kritik terasa lebih ringan diterima.',
    strengths: [
      'Tegas mengarahkan tim besar menuju satu tujuan tanpa membuat suasana kaku.',
      'Optimis menghadapi hambatan mendadak dan cepat mencari jalan pintas realistis.',
      'Mampu meyakinkan guru atau juri dengan argumen terstruktur sekaligus percaya diri.',
    ],
    challenges: [
      'Kurang sabar mendengarkan penjelasan lambat atau keraguan mendetail dari rekan introvert.',
      'Rentan meremehkan kelelahan diri sendiri atau anggota tim karena antusiasme mengejar hasil.',
    ],
    communicationPatterns: 'Lugas, ekspresif, persuasif, dan cenderung memimpin alur percakapan sejak kalimat pembuka.',
    behavioralExamples: [
      'Menyusun pembagian kerja makalah dalam 5 menit sambil meyakinkan teman-teman bahwa tugas pasti beres.',
      'Mengubah aturan diskusi yang macet dengan usulan konkret bernada optimistis.',
    ],
    contrastWithReversed: 'Berbeda dari Sanguinis–Koleris yang fokus awalnya menjaga hubungan hangat baru memikirkan target, Koleris–Sanguinis memandang hubungan sosial melalui kacamata keberhasilan tujuan bersama dan jarang lupa pada tenggat utama.',
    misconceptions: [
      'Tidak selalu otoriter tanpa empati; sisi Sanguin membuatnya cukup peka terhadap atmosfer kelompok.',
      'Bukan padanan mutlak MBTI ENTJ/ESTP karena ketegasan perilaku bisa dimiliki tipe Feeling maupun Thinking.',
    ],
    references: ['Eysenck (1967)', 'Keirsey (1998)'],
  },
  {
    id: 'sang-mel',
    pairKey: 'sang-mel-pair',
    primary: 'Sanguine',
    secondary: 'Melancholic',
    title: 'Sanguine–Melancholic',
    indoTitle: 'Sanguinis–Melankolis (Ekspresif & Mendalam)',
    dynamicBalance: 'Menghubungkan kehangatan interaksi Sanguin dengan kepekaan nilai, estetika, dan refleksi analitis Melankolis.',
    internalTension: 'Naik-turun antara dorongan tampil ceria bersama teman dan kebutuhan ruang sunyi untuk mencerna perasaan/kritik.',
    academicStrength: 'Kuat pada penulisan kreatif, psikologi komunikasi, seni, sastra, serta presentasi materi kompleks agar menyentuh audiens.',
    watchOut: 'Mudah mengalami kelelahan emosional apabila terlalu memikirkan tanggapan sosial saat sedang bereksperimen.',
    generalCharacteristics: 'Perpaduan antara kutub ekspresif-ekstrovert dan kutub reflektif-sensitif. Individu ini sangat hidup saat berbagi gagasan bersama orang lain, namun di balik layar menyimpan standar makna pribadi dan kedalaman emosi yang tinggi.',
    dominantVsSecondary: 'Sanguinis (Primer) mendorong keterbukaan, spontanitas cerita, dan daya tarik relasional; Melankolis (Sekunder) memberi kepekaan estetika, detail makna, serta rasa ingin menyentuh kedalaman.',
    interactionDynamics: 'Sisi Sanguin menyelamatkan sisi Melankolis dari keterpurukan berlarut, sementara sisi Melankolis mencegah sisi Sanguin menjadi dangkal atau mengulang kesalahan detail.',
    strengths: [
      'Bercerita dan menjelaskan gagasan dengan nuansa emosional yang autentik.',
      'Peka terhadap suasana hati orang sekitar sekaligus mampu meramu empati dalam karya nyata.',
      'Memiliki perpaduan kreativitas spontan dan kesadaran kualitas estetis.',
    ],
    challenges: [
      'Fluktuasi energi yang terasa kontras: sangat antusias hari ini, lalu butuh menarik diri keesokan harinya.',
      'Sensitif terhadap kritik mendadak tepat setelah membuka ide secara bersemangat.',
    ],
    communicationPatterns: 'Hangat, ekspresif, kaya metafora dan contoh personal, namun langsung meredup bila merasa tidak dipahami.',
    behavioralExamples: [
      'Mendesain presentasi kelas yang jenaka sekaligus diselipi kutipan reflektif mendalam.',
      'Setelah acara sekolah yang meriah, langsung butuh waktu hening menuliskan catatan harian.',
    ],
    contrastWithReversed: 'Berbeda dari Melankolis–Sanguinis yang berhati-hati, terstruktur dulu, baru menghangatkan suasana di lingkup kecil, Sanguinis–Melankolis jauh lebih cepat menyapa dan berbagi ide ke luar sebelum mengevaluasi kualitas batinnya belakangan.',
    misconceptions: [
      'Naik-turun antusiasme bukan ketidakstabilan patologis; dalam kerangka klasik itu dinamika alami dua kutub berlawanan (ekstraversi vs refleksi sensitif).',
    ],
    references: ['Eysenck (1967)', 'Kagan (1994)'],
  },
  {
    id: 'mel-sang',
    pairKey: 'sang-mel-pair',
    primary: 'Melancholic',
    secondary: 'Sanguine',
    title: 'Melancholic–Sanguine',
    indoTitle: 'Melankolis–Sanguinis (Reflektif & Hangat)',
    dynamicBalance: 'Mengutamakan kedalaman analisis, ketelitian konsep, dan standar ideal Melankolis, diperkaya keluwesan humor serta keterbukaan Sanguinis.',
    internalTension: 'Keinginan menjaga kesempurnaan karya di ruang sunyi vs keinginan ikut terlibat dalam percakapan hangat kelompok.',
    academicStrength: 'Sangat baik dalam riset humaniora, desain komunikasi visual, pengajaran kreatif, dan analisis terstruktur yang ramah audiens.',
    watchOut: 'Sering mengkritik diri sendiri seusai tampil sosial karena merasa ada detail perkataan yang kurang tepat.',
    generalCharacteristics: 'Pribadi berprinsip yang memproses segala sesuatu secara cermat dari dalam, namun mampu tampil komunikatif dan jenaka saat merasa nyaman dengan konteks atau topiknya.',
    dominantVsSecondary: 'Melankolis (Primer) mengatur ketelitian, pengamatan mendalam, dan kepekaan terhadap standar; Sanguinis (Sekunder) melunakkan kekakuan analisis lewat keterbukaan dan daya tarik verbal.',
    interactionDynamics: 'Sisi Sanguin membantu Melankolis tidak terisolasi di menara gading konsepnya, sedangkan sisi Melankolis menjaga agar kehangatan ekspresifnya tetap bermutu dan bermakna.',
    strengths: [
      'Mampu menerjemahkan materi rumit yang diteliti mendalam menjadi penyampaian yang menarik.',
      'Setia pada komitmen kualitas namun tetap mudah didekati oleh teman sekelas.',
      'Peka terhadap ketidaksesuaian logis maupun nuansa emosional sekaligus.',
    ],
    challenges: [
      'Cenderung kehabisan baterai sosial lebih cepat daripada Sanguinis–Melankolis.',
      'Rentan ragu memulai presentasi bila bahan belum terasa sempurna.',
    ],
    communicationPatterns: 'Terstruktur dan berhati-hati di awal, lalu mengalir ekspresif dengan analogi segar begitu topik menyentuh minatnya.',
    behavioralExamples: [
      'Menyusun naskah laporan penelitian hingga detail catatan kaki, lalu membawakannya dengan ilustrasi ringan saat presentasi.',
      'Aktif berdiskusi di kelompok belajar beranggotakan 3–4 teman dekat, tetapi lebih banyak mengamati di forum besar.',
    ],
    contrastWithReversed: 'Berbeda dari Sanguinis–Melankolis yang mengawali kontak lewat energi spontan lalu merenung di belakang, Melankolis–Sanguinis mengamati dan memvalidasi kelayakan situasi terlebih dahulu sebelum membuka sisi cerianya.',
    misconceptions: [
      'Tidak berarti "ekstrovert palsu" atau berkepribadian ganda; manusia wajar memiliki kecenderungan analitis tinggi sekaligus kenikmatan berbagi hangat.',
    ],
    references: ['Eysenck (1967)', 'Thomas & Chess (1977)'],
  },
  {
    id: 'sang-phleg',
    pairKey: 'sang-phleg-pair',
    primary: 'Sanguine',
    secondary: 'Phlegmatic',
    title: 'Sanguine–Phlegmatic',
    indoTitle: 'Sanguinis–Plegmatis (Ramah & Menenangkan)',
    dynamicBalance: 'Kehangatan ramah dan spontanitas Sanguin diperhalus oleh kesabaran tanpa konfrontasi dari sisi Plegmatis.',
    internalTension: 'Antusiasme mencoba berbagai kegiatan seru vs kecenderungan menunda tugas berat yang penuh tekanan.',
    academicStrength: 'Mudah diterima di beragam lingkaran pergaulan kelas dan andal dalam peran mediasi atau konseling sebaya.',
    watchOut: 'Perlu sistem akuntabilitas eksternal agar kenyamanan diskusi santai tidak membuat tenggat terlewat.',
    generalCharacteristics: 'Kombinasi yang ramah, mudah didekati, dan minim gesekan agresif. Sisi Sanguin membawa keceriaan dan keterbukaan sosial, sedangkan sisi Plegmatis menjaga suasana tetap aman tanpa memaksa siapa pun.',
    dominantVsSecondary: 'Sanguinis (Primer) memicu keterlibatan sosial aktif dan humor akrab; Plegmatis (Sekunder) meredam impuls kompetitif serta menghadirkan penerimaan tenang.',
    interactionDynamics: 'Sisi Plegmatis menahan Sanguin dari berbicara terlalu berlebihan tanpa mendengar; sisi Sanguin menarik Plegmatis agar berani berinisiatif sosial.',
    strengths: [
      'Cepat meruntuhkan kecanggungan di kelas baru atau kelompok campuran.',
      'Pendengar yang hangat tanpa menginterupsi dengan nada menghakimi.',
      'Menjaga moral kelompok tetap stabil tanpa drama.',
    ],
    challenges: [
      'Kesulitan berkata "tidak" ketika diajak banyak aktivitas padahal tenggat belajar menumpuk.',
      'Cenderung menghindari pembahasan konflik serius dengan candaan pengalih.',
    ],
    communicationPatterns: 'Santai, suportif, penuh senyum dan penerimaan, menghindari tuntutan keras atau konfrontasi tajam.',
    behavioralExamples: [
      'Menyambut siswa pindahan atau anggota kelompok yang pendiam agar langsung merasa bagian dari tim.',
      'Menunda revisi bagian makalah yang dianggap membosankan sampai diingatkan rekan yang lebih terstruktur.',
    ],
    contrastWithReversed: 'Berbeda dari Plegmatis–Sanguinis yang bergerak lebih tenang, hemat bicara, dan menunggu ajakan lingkungan sebelum bercanda akrab, Sanguinis–Plegmatis jauh lebih proaktif memulai sapaan dan menjadi pusat kehangatan kelas.',
    misconceptions: [
      'Sifat santai dan ramah bukan tanda kurang ambisi; mereka sering bekerja baik bila tujuan terasa bermakna secara sosial.',
    ],
    references: ['Eysenck (1967)', 'Thomas & Chess (1977)'],
  },
  {
    id: 'phleg-sang',
    pairKey: 'sang-phleg-pair',
    primary: 'Phlegmatic',
    secondary: 'Sanguine',
    title: 'Phlegmatic–Sanguine',
    indoTitle: 'Plegmatis–Sanguinis (Kalem & Hangat Akrab)',
    dynamicBalance: 'Mengedepankan kestabilan emosi dan ritme tenang Plegmatis yang ditemani keramahan ringan serta humor hangat Sanguinis.',
    internalTension: 'Kebutuhan menjaga kenyamanan rutin vs ketertarikan ikut ajakan spontan teman agar tidak terkesan kaku.',
    academicStrength: 'Efektif sebagai anggota kelompok yang menjaga keharmonisan, presentator tenang, dan pendukung konsisten.',
    watchOut: 'Bisa terlalu pasif mengikuti arus kelompok sehingga gagasan pribadinya jarang terdengar.',
    generalCharacteristics: 'Temperamen damai yang konsisten dan menyenangkan diajak bekerja sama. Di situasi tenang, ia stabil dan tekun; di lingkungan teman dekat, sisi Sanguin muncul dalam selera humor lembut dan keramahan natural.',
    dominantVsSecondary: 'Plegmatis (Primer) menjadi fondasi kestabilan ritme, diplomasi, dan ketenangan batin; Sanguinis (Sekunder) menambah keluwesan sosial agar tidak terlalu tertutup.',
    interactionDynamics: 'Ketenangan Plegmatis menjaga sisi Sanguin tetap rendah hati dan penuh pertimbangan; sisi Sanguin memberi percikan ekspresif saat berinteraksi.',
    strengths: [
      'Menenangkan situasi tegang tanpa memihak secara emosional.',
      'Konsisten hadir dan mudah diajak berkompromi mengenai pembagian peran.',
      'Memberikan rasa nyaman bagi rekan yang gugup sebelum tampil.',
    ],
    challenges: [
      'Sulit memulai inisiatif perubahan ketika merasa sistem lama masih "cukup aman".',
      'Bisa terlihat kurang bersemangat oleh rekan Koleris meski sebenarnya sedang bekerja stabil.',
    ],
    communicationPatterns: 'Lembut, diplomatis, menyelipkan humor ringan tidak agresif, dan lebih sering bertanya daripada mendikte.',
    behavioralExamples: [
      'Tetap tenang mencatat risalah saat teman-teman berdebat, lalu melontarkan komentar ringan yang meredakan ketegangan.',
      'Menikmati kerja kelompok yang diselingi obrolan santai tanpa saling mengejar secara panik.',
    ],
    contrastWithReversed: 'Berbeda dari Sanguinis–Plegmatis yang berenergi sosial tinggi dan cepat mengambil peran pembawa suasana, Plegmatis–Sanguinis lebih menjaga hemat energi, baru menyalakan kehangatan sosial setelah atmosfer terasa aman.',
    misconceptions: [
      'Kalem bukan berarti apatis; Plegmatis–Sanguinis kerap sangat peduli terhadap kenyamanan seluruh anggota kelas.',
    ],
    references: ['Kagan (1994)', 'Eysenck (1967)'],
  },
  {
    id: 'chol-mel',
    pairKey: 'chol-mel-pair',
    primary: 'Choleric',
    secondary: 'Melancholic',
    title: 'Choleric–Melancholic',
    indoTitle: 'Koleris–Melankolis (Tegas & Presisi)',
    dynamicBalance: 'Menyatukan determinasi eksekusi Koleris dengan ketelitian perencanaan strategis dan standar mutu tinggi Melankolis.',
    internalTension: 'Dorongan bergerak cepat mencapai sasaran vs dorongan memeriksa ulang agar tidak ada celah kesalahan.',
    academicStrength: 'Cocok pada riset terapan terstruktur, pemrograman sistem, lomba karya ilmiah, serta manajemen proyek jangka panjang.',
    watchOut: 'Rentan menerapkan standar sangat tinggi kepada diri sendiri maupun anggota tim sehingga perlu latihan fleksibilitas empatik.',
    generalCharacteristics: 'Kombinasi berorientasi pencapaian tinggi yang menggabungkan keberanian bertindak dan kedisiplinan detail. Mereka tidak hanya ingin pekerjaan cepat selesai, tetapi juga selesai dengan kualitas rapi dan dapat dipertanggungjawabkan.',
    dominantVsSecondary: 'Koleris (Primer) mendorong pengambilan keputusan tegas dan fokus pada tujuan akhir; Melankolis (Sekunder) memastikan analisis risiko, struktur, dan standar kualitas terjaga.',
    interactionDynamics: 'Sisi Koleris mencegah perfeksionisme Melankolis berubah menjadi kelumpuhan tindakan; sisi Melankolis mencegah ketergesa-gesaan Koleris menghasilkan kesalahan ceroboh.',
    strengths: [
      'Mampu merancang sistem kerja terperinci sekaligus mengeksekusinya hingga tuntas.',
      'Tegas mempertahankan integritas mutu dan objektivitas data.',
      'Tangguh menuntaskan proyek besar tanpa perlu diingatkan berulang kali.',
    ],
    challenges: [
      'Nada koreksi terhadap kesalahan rekan bisa terdengar ganda ketajamannya (cepat + perfeksionis).',
      'Sulit berhenti bekerja sebelum seluruh daftar target terasa sempurna.',
    ],
    communicationPatterns: 'Terstruktur, berorientasi fakta dan solusi, padat tanpa basa-basi panjang, dan menuntut kejelasan tanggung jawab.',
    behavioralExamples: [
      'Membuat jadwal proyek lengkap dengan indikator penilaian serta mengecek sendiri konsistensi antarbagian sebelum dikumpulkan.',
      'Mengkritisi asumsi lemah dalam diskusi makalah sekaligus langsung menawarkan perbaikan strukturnya.',
    ],
    contrastWithReversed: 'Berbeda dari Melankolis–Koleris yang mengutamakan pendalaman teori dan kesempurnaan rancangan sebelum berani bergerak, Koleris–Melankolis langsung menetapkan target besar lebih awal lalu menuntut standar Melankolis mengikuti laju eksekusi tersebut.',
    misconceptions: [
      'Ketegasan berbasis standar bukan kekejaman pribadi; mereka biasanya menuntut diri sendiri seketat menuntut tim.',
      'Berbeda dari Keirsey Rational (NT) karena banyak siswa bertipe SJ juga memiliki kombinasi Koleris–Melankolis.',
    ],
    references: ['Eysenck (1967)', 'Keirsey (1998)'],
  },
  {
    id: 'mel-chol',
    pairKey: 'chol-mel-pair',
    primary: 'Melancholic',
    secondary: 'Choleric',
    title: 'Melancholic–Choleric',
    indoTitle: 'Melankolis–Koleris (Analitis & Berketeguhan)',
    dynamicBalance: 'Menjadikan kedalaman analisis dan ketelitian standar Melankolis sebagai fondasi, diperkuat ketegasan eksekusi dan kemandirian Koleris.',
    internalTension: 'Kebutuhan merencanakan seluruh rincian secara matang vs dorongan bertindak tegas agar tidak didikte situasi luar.',
    academicStrength: 'Unggul di penelitian mendalam, rekayasa sistem, audit data, penulisan ilmiah kritis, dan proyek mandiri berstandar tinggi.',
    watchOut: 'Cenderung menarik seluruh beban tugas bila merasa orang lain bekerja di bawah standar ketelitiannya.',
    generalCharacteristics: 'Pribadi serius, mandiri, dan sangat berorientasi ketepatan. Tidak mudah terbawa arus sosial; ketika sudah yakin terhadap suatu kesimpulan berbasis analisis, ia mampu mempertahankannya dengan sikap sangat tegas.',
    dominantVsSecondary: 'Melankolis (Primer) mengutamakan observasi mendalam, identifikasi risiko, dan prinsip mutu; Koleris (Sekunder) memberi daya dorong agar gagasan matang itu benar-benar terwujud.',
    interactionDynamics: 'Sisi Melankolis meneliti akar persoalan secara menyeluruh; sisi Koleris muncul kuat ketika hasil penelitian tersebut harus dibela atau diimplementasikan.',
    strengths: [
      'Cermat mengantisipasi masalah tersembunyi jauh sebelum tim menyadarinya.',
      'Tidak gampang goyah oleh tekanan teman sebaya bila bertentangan dengan data atau prinsip.',
      'Mandiri menyelesaikan tugas kompleks hingga detail terkecil.',
    ],
    challenges: [
      'Bisa tampak dingin atau terlalu kritis jika rekan menyampaikan ide yang masih mentah.',
      'Rentan stres batin bila terpaksa bekerja dalam sistem yang kacau dan tanpa aturan jelas.',
    ],
    communicationPatterns: 'Terukur, penuh pertimbangan, ringkas namun tajam saat melihat ketidaksesuaian bukti.',
    behavioralExamples: [
      'Diam mencatat kejanggalan data sepanjang rapat, lalu menyampaikan koreksi tegas disertai langkah alternatif terperinci.',
      'Memilih mengerjakan bagian terberat laporan sendirian daripada membiarkan kesalahan lolos.',
    ],
    contrastWithReversed: 'Berbeda dari Koleris–Melankolis yang bergerak cepat lalu menambal detail di perjalanan, Melankolis–Koleris menuntut kerangka analisis dan kualitas data kokoh terlebih dahulu baru menyalakan ketegasan eksekusi.',
    misconceptions: [
      'Diam mengamati di awal bukan pasif; mereka sedang mengevaluasi struktur masalah secara internal sebelum bersikap.',
    ],
    references: ['Eysenck (1967)', 'Kagan (1994)'],
  },
  {
    id: 'chol-phleg',
    pairKey: 'chol-phleg-pair',
    primary: 'Choleric',
    secondary: 'Phlegmatic',
    title: 'Choleric–Phlegmatic',
    indoTitle: 'Koleris–Plegmatis (Tegas namun Kalem)',
    dynamicBalance: 'Memiliki arah tujuan tegas ala Koleris, tetapi dijalankan dengan ketenangan stabil dan pendekatan diplomatis ala Plegmatis.',
    internalTension: 'Kemauan kuat memegang kendali hasil vs keengganan membuang energi untuk konflik emosional yang tidak produktif.',
    academicStrength: 'Efektif memimpin kelompok beragam karakter tanpa menimbulkan kepanikan; efisien membagi tugas sesuai kapasitas teman.',
    watchOut: 'Terkadang menahan kekecewaan terlalu lama dengan wajah datar sebelum tiba-tiba mengambil alih seluruh pekerjaan sendirian.',
    generalCharacteristics: 'Kombinasi yang menggabungkan ketegasan arah dan stabilitas emosional tinggi. Alih-alih memimpin lewat luapan suara keras, ia mengarahkan tim secara tenang, realistis, dan sulit dipancing terpancing amarah.',
    dominantVsSecondary: 'Koleris (Primer) menjaga kejelasan sasaran, efisiensi waktu, dan keberanian mengambil keputusan; Plegmatis (Sekunder) melapisi ketegasan itu dengan kesabaran serta kontrol diri tinggi.',
    interactionDynamics: 'Sisi Plegmatis meredam sifat mudah meledak Koleris menjadi ketegasan dingin yang terukur; sisi Koleris menjaga agar sisi Plegmatis tidak ragu mengambil sikap sulit.',
    strengths: [
      'Tetap tenang dan sistematis saat kelompok menghadapi tenggat mepet.',
      'Mampu memberi arahan jelas tanpa mempermalukan anggota tim.',
      'Praktis menyelesaikan masalah nyata tanpa drama emosional.',
    ],
    challenges: [
      'Ekspresi wajah yang terlalu tenang membuat rekan kadang salah mengira ia tidak peduli atau terlalu dingin.',
      'Cenderung memilih menanggung atau merapikan diam-diam daripada berdebat berulang kali.',
    ],
    communicationPatterns: 'Tenang, langsung pada inti praktis, hemat kata, tetapi jelas batas mana yang disetujui dan mana yang ditolak.',
    behavioralExamples: [
      'Ketika perdebatan kelompok memanas, membiarkan suasana mereda 1 menit lalu berkata tenang: "Oke, supaya selesai jam 4, kita pakai opsi B dan bagi 3 bagian sekarang."',
      'Membimbing anggota yang bingung dengan langkah praktis tanpa nada marah.',
    ],
    contrastWithReversed: 'Berbeda dari Plegmatis–Koleris yang memprioritaskan kenyamanan bersama baru bergerak tegas saat batas dilanggar, Koleris–Plegmatis sejak awal sudah menetapkan target serta struktur tugas, hanya saja membawakannya dengan pembawaan kalem.',
    misconceptions: [
      'Ketenangan bukan tanda kurang semangat; sering kali itu bentuk efisiensi energi agar fokus tetap pada solusi.',
    ],
    references: ['Eysenck (1967)', 'Thomas & Chess (1977)'],
  },
  {
    id: 'phleg-chol',
    pairKey: 'chol-phleg-pair',
    primary: 'Phlegmatic',
    secondary: 'Choleric',
    title: 'Phlegmatic–Choleric',
    indoTitle: 'Plegmatis–Koleris (Tenang & Berdaya Tahan Tegas)',
    dynamicBalance: 'Mengedepankan pembawaan tenang, sabar, dan diplomatis Plegmatis dengan cadangan ketegasan realistis serta determinasi Koleris saat diperlukan.',
    internalTension: 'Keinginan menjaga kestabilan tanpa ribut vs ketidaksabaran internal saat melihat ketidakjelasan berlarut-larut.',
    academicStrength: 'Handal dalam proyek jangka panjang yang menuntut konsistensi, negosiasi tenang, koordinasi di balik layar, dan ketahanan stres.',
    watchOut: 'Orang sering meremehkan keteguhannya sampai akhirnya terkejut ketika ia menolak keras prinsip yang melampaui batasnya.',
    generalCharacteristics: 'Individu yang tampak tenang dan tidak agresif dalam keseharian, namun menyimpan tulang punggung keteguhan yang kuat. Ia tidak senang mencari konflik, tetapi juga tidak mudah ditekan atau dipaksa mengalah pada hal penting.',
    dominantVsSecondary: 'Plegmatis (Primer) menjadi ruang kerja alami yang stabil, sabar mendengarkan, dan hemat konflik; Koleris (Sekunder) aktif sebagai jangkar ketegasan dan penyelesaian praktis.',
    interactionDynamics: 'Selama lingkungan berjalan adil, sisi Plegmatis tampil ramah dan kooperatif; begitu situasi kacau atau pihak lain bertindak sepihak, sisi Koleris melangkah maju menetapkan batas tegas.',
    strengths: [
      'Tidak gampang goyah oleh kepanikan kelompok ataupun provokasi emosional.',
      'Mendengarkan semua pihak dulu sebelum memberi keputusan praktis yang sulit digugat.',
      'Daya tahan kerja konstan dari awal sampai akhir proyek.',
    ],
    challenges: [
      'Kadang terlalu lambat mengambil inisiatif memimpin karena menunggu orang lain menawarkan diri lebih dulu.',
      'Bisa menjadi sangat keras kepala dalam diam apabila dipaksa mengubah ritme tanpa alasan logis.',
    ],
    communicationPatterns: 'Tenang, ekonomis, sabar menyimak, namun kalimat penutupnya tegas dan langsung mengunci kesepakatan.',
    behavioralExamples: [
      'Lebih memilih menyimak berbagai usulan teman, lalu merangkum solusi paling realistis sambil menjaga semua pihak tetap terlibat.',
      'Menolak pembagian kerja tidak adil dengan nada datar namun tak tergoyahkan.',
    ],
    contrastWithReversed: 'Berbeda dari Koleris–Plegmatis yang berinisiatif memimpin arah sejak detik pertama, Plegmatis–Koleris lebih suka membiarkan proses berjalan kooperatif terlebih dahulu dan hanya mengerahkan ketegasan Koleris sebagai penyangga saat dibutuhkan.',
    misconceptions: [
      'Tenang bukan berarti penurut; Plegmatis–Koleris memiliki batas otonomi yang sangat kokoh.',
    ],
    references: ['Kagan (1994)', 'Eysenck (1967)'],
  },
  {
    id: 'mel-phleg',
    pairKey: 'mel-phleg-pair',
    primary: 'Melancholic',
    secondary: 'Phlegmatic',
    title: 'Melancholic–Phlegmatic',
    indoTitle: 'Melankolis–Plegmatis (Analitis & Harmonis)',
    dynamicBalance: 'Menggabungkan ketelitian kualitas serta pemikiran reflektif Melankolis dengan ketenangan hati dan kerendahan hati Plegmatis.',
    internalTension: 'Perfeksionisme standar batin vs kecenderungan menjaga kedamaian dengan tidak mendebat orang yang lebih vokal.',
    academicStrength: 'Sangat teliti menyusun analisis data, tinjauan literatur ilmiah, penyuntingan naskah, dan pendampingan belajar berkesinambungan.',
    watchOut: 'Perlu keberanian lebih dini untuk menyuarakan gagasan bermutu agar tidak tertutup suara rekan yang lebih dominan.',
    generalCharacteristics: 'Kombinasi reflektif yang teliti, setia, dan menenangkan. Ia memikirkan standar kualitas dan detail persoalan secara mendalam, namun jarang menyampaikannya dengan nada kasar atau konfrontatif.',
    dominantVsSecondary: 'Melankolis (Primer) mengarahkan perhatian ke kedalaman konsep, akurasi detail, dan kepekaan makna; Plegmatis (Sekunder) meredam ketegangan perfeksionisme sehingga pembawaannya tetap sabar dan bersahaja.',
    interactionDynamics: 'Sisi Plegmatis menjaga Melankolis dari reaksi emosional meledak atau konflik tajam; sisi Melankolis mencegah sisi Plegmatis menurunkan standar mutu tugas.',
    strengths: [
      'Menghasilkan pekerjaan akademik dengan kerapian tinggi tanpa menuntut sorotan panggung.',
      'Pendengar empatik sekaligus pengamat detail yang sangat cermat.',
      'Konsisten menuntaskan tanggung jawab yang sering dianggap membosankan oleh orang lain.',
    ],
    challenges: [
      'Memendam keberatan terhadap kualitas kerja teman karena enggan menimbulkan pertengkaran.',
      'Rentan kelelahan batin jika beban kerja menumpuk tanpa diutarakan.',
    ],
    communicationPatterns: 'Halus, terstruktur, penuh pertimbangan sebelum berbicara, dan cenderung lebih jernih lewat tulisan atau diskusi kecil.',
    behavioralExamples: [
      'Merapikan keseluruhan sitasi dan tabel laporan kelompok secara sukarela sambil memastikan format tidak keliru.',
      'Memberikan masukan tertulis sopan alih-alih menyanggah keras di depan forum kelas.',
    ],
    contrastWithReversed: 'Berbeda dari Plegmatis–Melankolis yang berorientasi kenyamanan stabil terlebih dahulu dan relatif lebih santai soal kesempurnaan, Melankolis–Plegmatis merasakan dorongan batin lebih kuat terhadap ketepatan standar, estetika, dan struktur rapi.',
    misconceptions: [
      'Kesopanan lembut bukan berarti tidak punya kritik tajam; mereka sering melihat celah kesalahan paling awal.',
    ],
    references: ['Kagan (1994)', 'Thomas & Chess (1977)', 'Eysenck (1967)'],
  },
  {
    id: 'phleg-mel',
    pairKey: 'mel-phleg-pair',
    primary: 'Phlegmatic',
    secondary: 'Melancholic',
    title: 'Phlegmatic–Melancholic',
    indoTitle: 'Plegmatis–Melankolis (Stabil & Cermat)',
    dynamicBalance: 'Berpijak pada keseimbangan emosional, kesabaran, dan sifat kooperatif Plegmatis, dilengkapi ketelitian terstruktur serta kesadaran risiko dari Melankolis.',
    internalTension: 'Kebutuhan rutinitas nyaman dan aman vs kecemasan batin ketika menyadari masih ada detail yang belum tuntas.',
    academicStrength: 'Sangat baik dalam menjaga konsistensi belajar harian, dokumentasi laboratorium, kerja tim tenang, dan evaluasi berhati-hati.',
    watchOut: 'Rentan menunda memulai langkah baru apabila merasa instruksinya kurang aman atau berisiko menimbulkan kritik.',
    generalCharacteristics: 'Temperamen yang kalem, rendah hati, dapat diandalkan, dan bekerja penuh kehati-hatian. Ia menyukai lingkungan tanpa tekanan intimidatif di mana ia bisa mengerjakan tugas secara sistematis langkah demi langkah.',
    dominantVsSecondary: 'Plegmatis (Primer) menstabilkan emosi, membangun suasana damai, dan mempertahankan ketekunan rutin; Melankolis (Sekunder) memberi struktur perencanaan dan kehati-hatian analitis.',
    interactionDynamics: 'Sisi Plegmatis menurunkan intensitas kecemasan perfeksionis menjadi ketelitian tenang; sisi Melankolis membantu Plegmatis tetap waspada agar tidak terlalu santai terhadap detail penting.',
    strengths: [
      'Sangat dapat dipercaya menjaga rutinitas tugas tim tanpa konflik pribadi.',
      'Cermat mengikuti prosedur keselamatan maupun rubrik penilaian secara tenang.',
      'Menciptakan atmosfer belajar yang stabil bagi teman yang mudah cemas.',
    ],
    challenges: [
      'Kurang menyukai perubahan rencana mendadak atau improvisasi di menit terakhir.',
      'Berisiko membiarkan orang lain mengambil keputusan besar padahal ia punya pertimbangan risiko yang matang.',
    ],
    communicationPatterns: 'Tenang, sopan, realistis dalam melihat risiko, dan memilih kalimat yang menghindari gesekan emosional.',
    behavioralExamples: [
      'Selalu menyiapkan rangkuman materi dan alat praktikum jauh hari agar tidak terburu-buru di pagi hari.',
      'Diam-diam memeriksa ulang jadwal pengumpulan kelompok supaya tidak ada yang terlewat.',
    ],
    contrastWithReversed: 'Berbeda dari Melankolis–Plegmatis yang sensitivitas batin dan perfeksionisme standarnya lebih intens, Plegmatis–Melankolis jauh lebih tenang menghadapi kekurangan kecil dan lebih cepat kembali ke titik seimbang setelah stres.',
    misconceptions: [
      'Kehati-hatian dan tempo tenang bukan kelambanan berpikir; mereka cenderung menimbang semua variabel dengan stabil.',
    ],
    references: ['Thomas & Chess (1977)', 'Kagan (1994)'],
  },
];

export const MIXED_6_TEMPERAMENTS: MixedTemperamentBlendEntry[] = MIXED_12_TEMPERAMENTS.filter((item) =>
  ['sang-chol', 'sang-mel', 'sang-phleg', 'chol-mel', 'chol-phleg', 'mel-phleg'].includes(item.id)
);

export const MBTI_FUNCTION_POSITIONS: MbtiFunctionPositionEntry[] = [
  {
    position: 1,
    group: 'Sadar (Ego Stack — Grant)',
    title: 'Fungsi Dominan (Dominant / Hero)',
    archetypeLabel: 'Pusat Kesadaran & Arah Utama',
    roleSummary: 'Cara berpikir atau memersepsi yang paling alami, otomatis, dan dipercaya penuh sebagai lensa utama membaca realitas.',
    healthyExpression: 'Memberi kejernihan visi, kepercayaan diri otentik, dan keahlian khas tanpa terasa memaksa.',
    imbalanceOrStress: 'Bila mendominasi sendirian tanpa fungsi Auxiliary, individu menjadi berat sebelah (mis. terlalu abstrak atau terlalu sibuk beraksi tanpa refleksi).',
    developmentDirection: 'Keseimbangan datang bukan dengan menekan fungsi Dominan, melainkan memasangkannya secara sadar dengan fungsi Auxiliary yang berlawanan sikap (E/I).',
    modelNuance: 'Jung (1921/1971) menamai fungsi ini "Superior Function" dan menjadikannya inti karakter sadar sebelum dikembangkannya model 8 posisi Beebe (2016).',
  },
  {
    position: 2,
    group: 'Sadar (Ego Stack — Grant)',
    title: 'Fungsi Bantu (Auxiliary / Parent)',
    archetypeLabel: 'Penyeimbang & Pembimbing Realistis',
    roleSummary: 'Menyeimbangkan arah energi (E↔I) sekaligus kategori fungsi (Persepsi↔Penilaian) agar fungsi Dominan dapat berkomunikasi efektif dengan dunia luar maupun batin.',
    healthyExpression: 'Memberikan kedewasaan praktis, tanggung jawab seimbang, dan kemampuan mendengar sudut pandang berbeda.',
    imbalanceOrStress: 'Jika dilewati ("Dom–Ter Loop"), keputusan kehilangan uji realitas (untuk N/S) atau kehilangan empati/nalar penyeimbang (untuk T/F).',
    developmentDirection: 'Dilatih secara sadar di usia remaja–dewasa awal melalui proyek kolaborasi dan umpan balik nyata.',
    modelNuance: 'Isabel Briggs Myers (1995) menekankan peran krusial Auxiliary agar tipe Introvert tetap mampu mengekspresikan diri ke luar dan tipe Ekstrovert memiliki jangkar refleksi batin.',
  },
  {
    position: 3,
    group: 'Sadar (Ego Stack — Grant)',
    title: 'Fungsi Tersier (Tertiary / Child)',
    archetypeLabel: 'Sumber Eksplorasi Bermain & Kerentanan Loop',
    roleSummary: 'Fungsi yang bersikap sama dengan Dominan (sama-sama E atau sama-sama I), namun berlawanan jenis rasional/irasionalnya dengan Auxiliary.',
    healthyExpression: 'Membawa rasa ingin tahu segar, kreativitas bermain, dan fleksibilitas penyeimbang di usia bertumbuh.',
    imbalanceOrStress: 'Dalam kondisi stres atau kelelahan, pikiran dapat terjebak "Dom–Ter Loop": hanya mengulang fungsi nyaman bersikap sama sambil menghindari Auxiliary yang lebih menuntut.',
    developmentDirection: 'Nikmati fungsi Tersier sebagai ruang belajar ringan tanpa menjadikannya alat pertahanan ego untuk menghindari uji realitas Auxiliary.',
    modelNuance: 'Dalam model Grant (1983) sikap Tersier sama dengan Dominan (E-I-E-I atau I-E-I-E); catatan: sebagian penafsir Jung awal dan model Beebe/Myers lama pernah memperdebatkan arah E/I posisi ke-3.',
  },
  {
    position: 4,
    group: 'Sadar (Ego Stack — Grant)',
    title: 'Fungsi Inferior (Inferior / Aspirational)',
    archetypeLabel: 'Kutub Terbalik, Titik Stres & Gerbang Kedewasaan',
    roleSummary: 'Berada tepat berlawanan arah energi dan mekanismenya dari fungsi Dominan (mis. Ni ↔ Se, Ti ↔ Fe, Fi ↔ Te, Si ↔ Ne).',
    healthyExpression: 'Menjadi sumber aspirasi inspiratif, rasa takjub, dan pengingat keseimbangan hidup ketika diakui dengan rendah hati.',
    imbalanceOrStress: 'Saat tekanan melampaui kapasitas Dominan, dapat muncul kondisi "In the Grip": reaksi ekstrem, kaku, atau meluap yang terasa asing bagi diri sendiri.',
    developmentDirection: 'Bangun kebiasaan kecil yang aman dan rendah tekanan untuk berdamai dengan fungsi Inferior, bukan menuntut kesempurnaan instan.',
    modelNuance: 'Jung (1921/1971) membahas mendalam bagaimana fungsi Inferior tetap semi-sadar dan menjadi jembatan ke ketidaksadaran kolektif/personal.',
  },
  {
    position: 5,
    group: 'Bayangan (Shadow Stack — Beebe)',
    title: 'Posisi 5 — Lawan Sikap (Opposing Role)',
    archetypeLabel: 'Fungsi Bayangan Pertama (Sikap Berlawanan dari Dominan)',
    roleSummary: 'Fungsi yang sama dengan Dominan namun arah E/I berlawanan (mis. jika Dominan Ni, Posisi 5 adalah Ne). Kerap muncul sebagai sikap defensif atau skeptis pasif saat merasa terancam.',
    healthyExpression: 'Membantu melihat alternatif atau perspektif lawan secara objektif tanpa harus meninggalkan fokus inti.',
    imbalanceOrStress: 'Muncul sebagai perlawanan keras kepala atau kecurigaan tanpa dasar ketika merasa otonomi terdesak.',
    developmentDirection: 'Kenali saat diri mulai bersikap sinis di ranah ini, lalu ubah menjadi pertanyaan klarifikasi terbuka.',
    modelNuance: 'Posisi 5–8 berasal dari teori arketipal John Beebe (2016), BUKAN bagian dari skor resmi instrumen kuesioner MBTI Myers-Briggs.',
  },
  {
    position: 6,
    group: 'Bayangan (Shadow Stack — Beebe)',
    title: 'Posisi 6 — Kritikus Batin (Critical Parent / Senex)',
    archetypeLabel: 'Fungsi Bayangan Kedua (Sikap Berlawanan dari Auxiliary)',
    roleSummary: 'Cukup cakap digunakan, tetapi dalam model Beebe kerap bernada menghakimi kesalahan diri sendiri maupun orang lain dengan standar kaku.',
    healthyExpression: 'Menjadi penasehat kritis yang bijak untuk mendeteksi celah logis atau kelayakan etis sebelum bertindak.',
    imbalanceOrStress: 'Memicu suara kritik batin berlebihan atau menyalahkan ketidakcakapan orang lain secara dingin.',
    developmentDirection: 'Gunakan ketajaman posisi ke-6 untuk evaluasi konstruktif, bukan vonis moral terhadap diri maupun teman.',
    modelNuance: 'Sering beririsan secara pengamatan dengan "Demonstrative Function" di Socionics Model A (posisi 6), meski mekanisme definisinya berbeda.',
  },
  {
    position: 7,
    group: 'Bayangan (Shadow Stack — Beebe)',
    title: 'Posisi 7 — Titik Buta (Trickster / Poltergeist)',
    archetypeLabel: 'Area Ambigu, Rawan Salah Baca & Kebingungan Konteks',
    roleSummary: 'Berlawanan sikap dari fungsi Tersier; sering dianggap membingungkan, memicu kesalahpahaman, atau terasa seperti aturan tak masuk akal.',
    healthyExpression: 'Dapat memicu humor paradoks atau kesadaran kerendahan hati untuk meminta bantuan teman yang kuat di area tersebut.',
    imbalanceOrStress: 'Menimbulkan kebuntuan sosial/teknis atau salah tafsir niat orang lain saat situasi menuntut kelincahan di fungsi ini.',
    developmentDirection: 'Jangan malu bekerja sama dengan teman yang fungsi ke-1/ke-2-nya berada di titik buta Anda.',
    modelNuance: 'Dalam diskusi komunitas modern kerap dibandingkan dengan PoLR (posisi ke-4) di Socionics, namun kerangka Jung–Beebe menyorot dinamika psikodinamikanya.',
  },
  {
    position: 8,
    group: 'Bayangan (Shadow Stack — Beebe)',
    title: 'Posisi 8 — Dasar Bayangan (Demon / Daimon)',
    archetypeLabel: 'Paling Asing bagi Kesadaran — Potensi Transformatif atau Destruktif',
    roleSummary: 'Berlawanan sikap dari fungsi Inferior (mis. pada Ni-dom INTJ/INFJ, posisi 8 adalah Si). Jarang diakses secara sadar sehari-hari.',
    healthyExpression: 'Saat individu matang secara mendalam, dapat menghadirkan kebijaksanaan tak terduga ("Daimon") yang melengkapi keutuhan diri.',
    imbalanceOrStress: 'Dalam krisis berkepanjangan, bisa memunculkan sinisme dingin atau keterlepasan ekstrem terhadap hal yang biasanya dijunjung.',
    developmentDirection: 'Tidak perlu dipaksa dikuasai setiap hari; fokus utama tetap merawat keseimbangan posisi 1–4 terlebih dahulu.',
    modelNuance: 'Model Beebe bersifat interpretatif-kedalaman (depth psychology) dan bukan fakta terukur statistik seperti faset Big Five.',
  },
];

export const MBTI_STACK_DYNAMICS_16: Record<string, MbtiStackDynamicsEntry> = {
  INTJ: {
    code: 'INTJ',
    stackLabel: 'Ni – Te – Fi – Se',
    domAuxDynamic: 'Ni (Dominan) merumuskan pola arah jangka panjang, lalu Te (Auxiliary) menyaringnya menjadi rencana terukur, struktur argumen, dan langkah eksekusi nyata.',
    domTerDynamic: 'Ni–Fi bekerja dalam ruang batin yang sunyi: visi strategis (Ni) diikat dengan keyakinan nilai personal mendalam (Fi) sehingga tujuan terasa bermakna secara pribadi, meski rawan menjadi "Ni–Fi loop" yang mengabaikan uji realitas eksternal Te.',
    domInfDynamic: 'Poros Ni–Se mengatur ketegangan antara abstraksi masa depan (Ni) dan realitas inderawi mendadak (Se). Ketergantungan berlebihan pada Ni membuat individu mudah terkejut atau lelah saat lingkungan berubah cepat secara fisik.',
    auxTerDynamic: 'Te dan Fi membentuk poros pengambilan keputusan: Te bertanya "apakah rencana ini efektif dan objektif?", sedangkan Fi menahan agar efektivitas tersebut tidak mengorbankan prinsip moral personal.',
    integratedSystemBehavior: 'Saat seluruh tumpukan seimbang, INTJ memadukan visi jangka panjang (Ni), ketegasan sistem teruji fakta (Te), integritas nilai senyap (Fi), dan kelenturan menghadapi kenyataan kini (Se).',
    realLifeExamples: [
      'Merancang kerangka riset ilmiah dari tujuan akhir mundur ke jadwal eksperimen mingguan (Ni+Te).',
      'Menolak topik populer jika tidak sesuai kompas nilai intelektual pribadi (Fi).',
    ],
    growthDevelopment: 'Latih Te melalui umpan balik rekan sejak draf awal sebelum rencana membeku, serta beri waktu istirahat sensorik sehat (Se) tanpa target produktivitas.',
    internalTensions: 'Ketegangan antara tuntutan efisiensi lugas (Te) dan kehalusan kepekaan nilai batin yang sulit diungkapkan dengan kata-kata (Fi).',
    stressLoopsAndGrip: 'Ni–Fi Loop: menarik diri, mengulang asumsi pesimistis di kepala, merasa tidak ada yang mengerti tanpa menguji asumsi ke luar. Se Grip: kelelahan mental yang memicu sensitivitas berlebihan pada kebisingan, kekacauan fisik, atau tindakan impulsif sesaat.',
    misconceptionsAndAlternatives: 'Sering distereotipkan sebagai ahli catur dingin; padahal Fi tersier membuat mereka sangat loyal pada hal bermakna. Dalam Socionics, struktur Ni-Te lebih dekat ke ILI (INTp), bukan selalu LII (INTj).',
    references: ['Myers & Myers (1995)', 'Grant et al. (1983)', 'Beebe (2016)'],
  },
  INTP: {
    code: 'INTP',
    stackLabel: 'Ti – Ne – Si – Fe',
    domAuxDynamic: 'Ti (Dominan) menguji konsistensi logika premis secara internal, sedangkan Ne (Auxiliary) menyuplai berbagai sudut pandang, analogi, dan kemungkinan baru agar sistem Ti tidak menjadi sempit.',
    domTerDynamic: 'Ti–Si loop membuat individu terus memutar ulang kesalahan atau definisi masa lalu di kepala secara tertutup tanpa membuka kemungkinan segar Ne.',
    domInfDynamic: 'Poros Ti–Fe mempertentangkan analisis objektif yang bebas sentimen (Ti) dengan kepekaan terhadap iklim sosial dan penerimaan emosional kelompok (Fe).',
    auxTerDynamic: 'Poros Ne–Si menghubungkan imajinasi bercabang (Ne) dengan memori perbandingan detail konkret yang pernah dialami (Si).',
    integratedSystemBehavior: 'Sistem sehat menggabungkan ketajaman prinsip logis (Ti), kelincahan menghubungkan ide lintas bidang (Ne), ketepatan mengingat contoh relevan (Si), serta kehangatan sopan dalam berdialog (Fe).',
    realLifeExamples: [
      'Menemukan kelemahan definisi dalam argumen debat lalu menawarkan 3 sudut pandang alternatif (Ti+Ne).',
      'Merasa canggung secara mendadak ketika harus menenangkan teman yang menangis (Fe inferior).',
    ],
    growthDevelopment: 'Kembangkan Ne dengan berdiskusi rutin bersama teman lintas minat dan latih Fe lewat pengakuan verbal singkat atas usaha orang lain sebelum mengkritik idenya.',
    internalTensions: 'Keinginan menjaga kejujuran intelektual murni (Ti) vs kebutuhan tetap diterima hangat dalam kerja sama kelas (Fe).',
    stressLoopsAndGrip: 'Ti–Si Loop: mengisolasi diri, terjebak menganalisis ulang pengalaman negatif masa lalu. Fe Grip: ledakan frustrasi sosial atau kekhawatiran berlebihan bahwa seluruh kelompok membencinya.',
    misconceptionsAndAlternatives: 'Tidak semua INTP suka berdebat sengit atau berantakan; beberapa sangat teratur berkat dukungan Si atau skor Organized SLOAN tinggi.',
    references: ['Jung (1921/1971)', 'Grant et al. (1983)', 'Myers et al. (1998)'],
  },
  ENTJ: {
    code: 'ENTJ',
    stackLabel: 'Te – Ni – Se – Fi',
    domAuxDynamic: 'Te (Dominan) mengorganisir target, sumber daya, dan tolok ukur objektif di dunia luar, sementara Ni (Auxiliary) memberi arah visi jangka panjang agar tindakan memiliki prioritas strategis.',
    domTerDynamic: 'Te–Se loop mendorong individu mengejar hasil segera dan kendali cepat di momen kini sambil melewati refleksi strategis Ni jangka panjang.',
    domInfDynamic: 'Poros Te–Fi menyeimbangkan tuntutan efektivitas eksternal dengan pengakuan terhadap nilai kemanusiaan serta kebutuhan batin pribadi.',
    auxTerDynamic: 'Poros Ni–Se memberi kemampuan melihat arah tren besar (Ni) sekaligus eksekusi tangkas saat momen lapangan berubah (Se).',
    integratedSystemBehavior: 'Saat matang, ENTJ mampu menata sistem kerja efektif (Te), bervisi tajam (Ni), tangkas di situasi nyata (Se), serta menghormati nilai dan perasaan rekan secara tulus (Fi).',
    realLifeExamples: [
      'Mengubah rapat organisasi buntu menjadi pembagian peran bertenggat jelas (Te+Ni).',
      'Terkejut sendiri ketika kelelahan emosional muncul karena terlalu lama menunda refleksi pribadi (Fi inferior).',
    ],
    growthDevelopment: 'Latih Ni dengan memberi jeda menyimak perspektif tim sebelum mengunci rencana; rawat Fi lewat refleksi harian tentang apa yang bernilai bagi manusia di balik angka target.',
    internalTensions: 'Dorongan mempercepat eksekusi terukur (Te) vs kesadaran bahwa perasaan dan nilai personal (Fi) tidak bisa dipaksa dengan jadwal efisien.',
    stressLoopsAndGrip: 'Te–Se Loop: menjadi sangat menuntut, sibuk mengatur detail eksternal agresif tanpa berhenti berpikir jangka panjang. Fi Grip: merasa terisolasi, tidak dihargai secara tulus, atau meragukan makna seluruh pencapaiannya.',
    misconceptionsAndAlternatives: 'Bukan diktator tanpa hati; banyak ENTJ dengan Fi berkembang menjadi mentor tegas yang sangat melindungi pertumbuhan anggotanya.',
    references: ['Myers et al. (1998)', 'Grant et al. (1983)', 'Beebe (2016)'],
  },
  ENTP: {
    code: 'ENTP',
    stackLabel: 'Ne – Ti – Fe – Si',
    domAuxDynamic: 'Ne (Dominan) melihat lautan koneksi ide dan peluang tak terduga, sedangkan Ti (Auxiliary) menyaring mana gagasan yang benar-benar masuk akal dan konsisten secara logis.',
    domTerDynamic: 'Ne–Fe loop membuat individu sibuk membaca reaksi sosial dan memikat audiens tanpa berhenti menguji koherensi faktual idenya dengan Ti.',
    domInfDynamic: 'Poros Ne–Si mempertemukan keinginan mengejar kebaruan konstan (Ne) dengan tuntutan ketelitian prosedur berulang, kebiasaan fisik, dan ingatan konkret (Si).',
    auxTerDynamic: 'Poros Ti–Fe memberi kemampuan mengkritisi argumen secara tajam (Ti) sekaligus merangkai penyampaian yang menarik suasana sosial (Fe).',
    integratedSystemBehavior: 'ENTP seimbang menggabungkan kreativitas inovatif (Ne), ketelitian struktur logika (Ti), kesadaran dampak interpersonal (Fe), dan tindak lanjut konsisten (Si).',
    realLifeExamples: [
      'Menghasilkan 5 ide proyek lintas pelajaran lalu memilih 1 yang paling logis dan menarik dipresentasikan (Ne+Ti+Fe).',
      'Kesulitan merapikan format daftar pustaka setelah bagian konsep selesai (Si inferior).',
    ],
    growthDevelopment: 'Asah Ti untuk menuntaskan evaluasi ide sampai matang sebelum melompat ke ide baru; bangun rutinitas sederhana agar kesehatan fisik dan jadwal terjaga (Si).',
    internalTensions: 'Haus eksplorasi tanpa batas (Ne) vs kebutuhan ketertiban langkah demi langkah agar ide benar-benar terwujud (Si).',
    stressLoopsAndGrip: 'Ne–Fe Loop: over-adaptif mencari validasi atau memprovokasi reaksi sosial untuk menghindari kerja analitis sunyi. Si Grip: mendadak terobsesi pada detail sepele, keluhan fisik kecil, atau ketakutan mengulang kesalahan lama.',
    misconceptionsAndAlternatives: 'Tidak selalu suka memicu debat kusir; debat bagi ENTP sering merupakan cara kolaboratif menyempurnakan konsep.',
    references: ['Myers & Myers (1995)', 'Grant et al. (1983)', 'Beebe (2016)'],
  },
  INFJ: {
    code: 'INFJ',
    stackLabel: 'Ni – Fe – Ti – Se',
    domAuxDynamic: 'Ni (Dominan) menangkap pola makna tersembunyi di balik perilaku dan waktu, lalu Fe (Auxiliary) menerjemahkannya ke komunikasi hangat yang peka terhadap iklim sosial.',
    domTerDynamic: 'Ni–Ti loop terjadi saat individu mengisolasi diri untuk merangkai analisis kesimpulan pribadi yang kaku tanpa mengeceknya lewat dialog empatik Fe.',
    domInfDynamic: 'Poros Ni–Se menyeimbangkan dunia simbol-makna abstrak dengan kesadaran tubuh, keterlibatan fisik langsung, dan momen nyata saat ini.',
    auxTerDynamic: 'Poros Fe–Ti mengintegrasikan empati komunal (Fe) dengan kejernihan nalar kritis independen (Ti) agar kepedulian tetap objektif.',
    integratedSystemBehavior: 'INFJ yang utuh menggabungkan kejelasan visi jangka panjang (Ni), kehangatan fasilitasi manusia (Fe), ketajaman nalar pribadi (Ti), dan kehadiran penuh di dunia nyata (Se).',
    realLifeExamples: [
      'Merangkum keresahan terpendam kelas dan menyampaikannya secara diplomatis kepada wali kelas (Ni+Fe).',
      'Kewalahan bila berada berjam-jam di keramaian penuh stimulus bising (Se inferior).',
    ],
    growthDevelopment: 'Latih Fe secara sehat dengan menguji firasat melalui pertanyaan klarifikasi terbuka alih-alih menganggap pembacaan batin selalu 100% tepat; rawat kontak fisik alam/olahraga ringan (Se).',
    internalTensions: 'Kebutuhan privasi mendalam dan keheningan (Ni) vs dorongan merawat keharmonisan kelompok luar (Fe).',
    stressLoopsAndGrip: 'Ni–Ti Loop: menarik diri, menjadi sangat skeptis terhadap niat orang lain, sibuk menganalisis tanpa komunikasi nyata. Se Grip: sensitivitas sensorik ekstrem, kelelahan total, atau pelarian pada aktivitas inderawi berlebihan.',
    misconceptionsAndAlternatives: 'Kemampuan membaca pola antarmanusia bukan kekuatan supranatural, melainkan hasil pengamatan sosial berulang (Ni+Fe).',
    references: ['Myers & Myers (1995)', 'Grant et al. (1983)', 'Beebe (2016)'],
  },
  INFP: {
    code: 'INFP',
    stackLabel: 'Fi – Ne – Si – Te',
    domAuxDynamic: 'Fi (Dominan) menjaga keselarasan nilai nurani dan keaslian emosi pribadi, sementara Ne (Auxiliary) membuka beragam cara kreatif dan sudut pandang empatik untuk memahaminya.',
    domTerDynamic: 'Fi–Si loop menjebak individu mengulang-ulang luka atau pengalaman lama secara tertutup di ruang batin tanpa membuka jendela perspektif baru Ne.',
    domInfDynamic: 'Poros Fi–Te menyandingkan komitmen keaslian nilai batin (Fi) dengan tuntutan efisiensi objektif, jadwal tegas, dan hasil terukur di luar diri (Te).',
    auxTerDynamic: 'Poros Ne–Si memadukan imajinasi kemungkinan puitis (Ne) dengan memori personal yang kaya makna (Si).',
    integratedSystemBehavior: 'Ketika selaras, INFP memadukan keteguhan kompas etis (Fi), keterbukaan imajinatif (Ne), penghargaan pengalaman konkret (Si), dan kemampuan mengorganisir langkah eksekusi (Te).',
    realLifeExamples: [
      'Menulis esai argumentatif menyentuh nilai kemanusiaan dengan analogi tak terduga (Fi+Ne).',
      'Merasa tertekan bila mendapat kritik teknis bernada dingin tanpa konteks menghargai usahanya (Te inferior).',
    ],
    growthDevelopment: 'Gunakan Ne untuk menguji ide dari banyak sudut sebelum menarik kesimpulan batin; latih Te bertahap dengan memecah proyek kreatif menjadi daftar aksi kecil berjangka.',
    internalTensions: 'Melindungi keotentikan nurani agar tidak terkompromikan (Fi) vs kebutuhan struktur terukur agar karya benar-benar selesai (Te).',
    stressLoopsAndGrip: 'Fi–Si Loop: mengurung diri, memutar ulang memori menyakitkan dan meragukan nilai diri. Te Grip: mendadak berbicara sangat kaku, mengkritik ketidakefisienan lingkungan dengan nada tajam dan lelah.',
    misconceptionsAndAlternatives: 'Keliru dianggap lemah atau selalu melankolis; banyak INFP tampil tenang sekaligus teguh membela prinsip keadilan.',
    references: ['Jung (1921/1971)', 'Grant et al. (1983)', 'Myers et al. (1998)'],
  },
  ENFJ: {
    code: 'ENFJ',
    stackLabel: 'Fe – Ni – Se – Ti',
    domAuxDynamic: 'Fe (Dominan) membaca serta menyelaraskan kebutuhan dan atmosfer kelompok, dipandu Ni (Auxiliary) agar kepedulian tersebut terarah pada potensi pertumbuhan jangka panjang.',
    domTerDynamic: 'Fe–Se loop membuat individu terlalu sibuk melayani reaksi langsung lingkungan atau mengejar penerimaan segera tanpa berhenti menilai arah jangka panjang dengan Ni.',
    domInfDynamic: 'Poros Fe–Ti menuntut keseimbangan antara kesepakatan emosional bersama (Fe) dan kejujuran analisis logis independen meski tidak populer (Ti).',
    auxTerDynamic: 'Poros Ni–Se membantu menghubungkan wawasan makna jangka panjang (Ni) dengan kehadiran aktif nan ekspresif di ruangan nyata (Se).',
    integratedSystemBehavior: 'ENFJ dewasa menyatukan kehangatan kepemimpinan sosial (Fe), visi bermakna (Ni), energi hadir penuh (Se), dan kejernihan berpikir objektif untuk berkata "tidak" bila perlu (Ti).',
    realLifeExamples: [
      'Menyatukan anggota kelompok heterogen sambil mengarahkan mereka ke target proyek besar (Fe+Ni).',
      'Bimbang saat harus mengevaluasi teman dekat secara logis objektif (Ti inferior).',
    ],
    growthDevelopment: 'Kembangkan Ti dengan memberi waktu tenang menganalisis fakta tanpa mempertimbangkan "apakah orang lain akan tersinggung?" terlebih dahulu.',
    internalTensions: 'Tanggung jawab menjaga keharmonisan suasana (Fe) vs dorongan menuntut kejujuran analitis tanpa kompromi semu (Ti).',
    stressLoopsAndGrip: 'Fe–Se Loop: over-komitmen menyenangkan banyak pihak sekaligus secara impulsif. Ti Grip: mendadak sangat kritis terhadap diri sendiri maupun orang lain dengan analisis dingin penuh keraguan.',
    misconceptionsAndAlternatives: 'Bukan sekadar ekstrovert ramah; Ni auxiliary memberi ENFJ sisi reflektif yang dalam ketika sendiri.',
    references: ['Myers & Myers (1995)', 'Grant et al. (1983)'],
  },
  ENFP: {
    code: 'ENFP',
    stackLabel: 'Ne – Fi – Te – Si',
    domAuxDynamic: 'Ne (Dominan) menangkap percikan ide dan kemungkinan hubungan antarhal, sementara Fi (Auxiliary) menilai mana peluang yang autentik selaras dengan nilai hati nurani.',
    domTerDynamic: 'Ne–Te loop melompat langsung ke eksekusi banyak proyek sekaligus tanpa berhenti memeriksa keselarasan makna pribadi dengan Fi.',
    domInfDynamic: 'Poros Ne–Si mempertentangkan semangat inovasi spontan (Ne) dengan ketekunan rutinitas fisik, pengulangan detail, dan konsistensi catatan (Si).',
    auxTerDynamic: 'Poros Fi–Te menghubungkan komitmen nilai pribadi yang hangat (Fi) dengan ketegasan mewujudkan langkah praktis di dunia nyata (Te).',
    integratedSystemBehavior: 'Sistem utuh memadukan inspirasi kreatif (Ne), ketulusan prinsip batin (Fi), pengorganisasian sasaran nyata (Te), dan penghargaan terhadap ritme stabil (Si).',
    realLifeExamples: [
      'Mengusulkan proyek sosial sekolah yang orisinal sekaligus menggalang tim relawan (Ne+Fi+Te).',
      'Sering menumpuk catatan ide di banyak buku berbeda sebelum dirapikan (Si inferior).',
    ],
    growthDevelopment: 'Berikan ruang sunyi bagi Fi untuk menyaring mana 1–2 proyek paling bermakna sebelum memulai eksekusi; gunakan sistem pengingat sederhana untuk merawat Si.',
    internalTensions: 'Ketakutan kehilangan kemungkinan baru jika mengunci pilihan (Ne) vs kebutuhan menuntaskan satu jalur dengan konsisten (Te+Si).',
    stressLoopsAndGrip: 'Ne–Te Loop: hiperaktif memulai terlalu banyak target demi bukti produktivitas tanpa makna batin. Si Grip: merasa terkekang detail rutin, cemas soal kesehatan/kegagalan kecil, dan menarik diri.',
    misconceptionsAndAlternatives: 'Antusiasme terbuka sering dikira kurang analitis; padahal pasangan Fi–Te dapat bekerja sangat efektif pada topik yang diyakini.',
    references: ['Myers & Myers (1995)', 'Grant et al. (1983)', 'Beebe (2016)'],
  },
  ISTJ: {
    code: 'ISTJ',
    stackLabel: 'Si – Te – Fi – Ne',
    domAuxDynamic: 'Si (Dominan) mengandalkan arsip pengalaman teruji dan akurasi detail nyata, sementara Te (Auxiliary) menyusunnya menjadi prosedur efisien, jadwal, dan standar kerja jelas.',
    domTerDynamic: 'Si–Fi loop memicu keterikatan berlebih pada cara lama dan kekecewaan personal diam-diam tanpa membuka ruang pertimbangan objektif atau efisiensi baru Te.',
    domInfDynamic: 'Poros Si–Ne mempertemukan kebutuhan kestabilan metode terverifikasi (Si) dengan ketidakpastian kemungkinan baru atau perubahan mendadak tanpa preseden (Ne).',
    auxTerDynamic: 'Poros Te–Fi memastikan langkah kerja yang terstruktur tetap berpijak pada rasa tanggung jawab etis serta integritas batin.',
    integratedSystemBehavior: 'ISTJ matang memadukan ketelitian fakta teruji (Si), ketegasan tata kelola objektif (Te), kesetiaan prinsip senyap (Fi), serta keterbukaan terukur pada inovasi berguna (Ne).',
    realLifeExamples: [
      'Menyusun protokol laporan praktikum bebas kesalahan berdasarkan standar kelas sebelumnya (Si+Te).',
      'Cemas bila dosen/guru mengubah format tugas H-1 tanpa contoh jelas (Ne inferior).',
    ],
    growthDevelopment: 'Latih Ne dalam skala aman dengan mencoba satu variasi metode belajar baru tiap semester tanpa mengorbankan keandalan dasar.',
    internalTensions: 'Kesetiaan pada prosedur terbukti (Si) vs dorongan beradaptasi cepat terhadap variabel baru tak terduga (Ne).',
    stressLoopsAndGrip: 'Si–Fi Loop: memendam kejengkelan karena perubahan aturan sambil mengulang kekhawatiran pribadi. Ne Grip: membayangkan rangkaian skenario terburuk tak terkendali secara tiba-tiba.',
    misconceptionsAndAlternatives: 'Bukan kaku tanpa humor atau kreativitas; banyak ISTJ memiliki selera humor kering tajam dan ketekunan seni tinggi.',
    references: ['Myers et al. (1998)', 'Grant et al. (1983)'],
  },
  ISFJ: {
    code: 'ISFJ',
    stackLabel: 'Si – Fe – Ti – Ne',
    domAuxDynamic: 'Si (Dominan) mengingat detail pengalaman nyata dan kebiasaan spesifik orang sekitar, lalu Fe (Auxiliary) mewujudkannya dalam perhatian praktis dan menjaga keharmonisan.',
    domTerDynamic: 'Si–Ti loop membuat individu membedah kesalahan kecil pribadi berulang-ulang secara dingin di dalam kepala tanpa berbagi atau mengonfirmasinya dengan Fe.',
    domInfDynamic: 'Poros Si–Ne menavigasi ketegangan antara rutinitas nyaman yang akrab (Si) dan perubahan mendadak penuh spekulasi abstrak (Ne).',
    auxTerDynamic: 'Poros Fe–Ti menggabungkan kepekaan relasional hangat (Fe) dengan penilaian logis mandiri (Ti) agar kepedulian tetap sehat serta berbatas.',
    integratedSystemBehavior: 'ISFJ seimbang memadukan ketelitian perhatian konkret (Si), kehangatan dukungan sosial (Fe), keberanian menilai secara jernih (Ti), dan kelenturan menghadapi kemungkinan baru (Ne).',
    realLifeExamples: [
      'Mengingat jadwal ujian teman sekelompok dan menyiapkan catatan cadangan rapi (Si+Fe).',
      'Sulit beristirahat jika khawatir masa depan penuh hal tak terduga (Ne inferior).',
    ],
    growthDevelopment: 'Kembangkan Ti untuk berani berkata tidak secara tenang saat kapasitas kerja sudah penuh; biasakan eksplorasi ide Ne bersama orang tepercaya.',
    internalTensions: 'Keinginan menjaga stabilitas dan perasaan semua pihak (Si+Fe) vs kebutuhan mengkritisi ketimpangan secara objektif (Ti).',
    stressLoopsAndGrip: 'Si–Ti Loop: terjebak menyalahkan diri secara detail atas kejadian kecil masa lalu. Ne Grip: mendadak panik membayangkan banyak kemungkinan buruk yang belum tentu terjadi.',
    misconceptionsAndAlternatives: 'Sering dikira selalu penurut; nilai dan kesetiaan Si+Fe justru membuat ISFJ sangat gigih melindungi orang yang disayangi.',
    references: ['Myers & Myers (1995)', 'Grant et al. (1983)'],
  },
  ESTJ: {
    code: 'ESTJ',
    stackLabel: 'Te – Si – Ne – Fi',
    domAuxDynamic: 'Te (Dominan) menata target, aturan, dan efisiensi tindakan bersama, ditopang Si (Auxiliary) yang merujuk pada pengalaman praktis serta preseden nyata yang terbukti berhasil.',
    domTerDynamic: 'Te–Ne loop terburu-buru mengejar banyak opsi solusi cepat untuk memaksa hasil tanpa memeriksa kelayakan fakta dan catatan pengalaman Si.',
    domInfDynamic: 'Poros Te–Fi mempertemukan fokus penataan sistem objektif (Te) dengan kesadaran akan kerentanan perasaan dan nilai pribadi (Fi).',
    auxTerDynamic: 'Poros Si–Ne menjaga keseimbangan antara mempertahankan praktik teruji (Si) dan melirik peluang perbaikan kreatif (Ne).',
    integratedSystemBehavior: 'ESTJ terintegrasi memadukan ketegasan koordinasi (Te), keandalan pengalaman nyata (Si), kelincahan memecahkan hambatan baru (Ne), dan kepekaan terhadap nilai manusia (Fi).',
    realLifeExamples: [
      'Mengaudit seluruh syarat rubrik tugas dan membagi jadwal piket tim secara adil (Te+Si).',
      'Terkejut bila nadanya dianggap menyakitkan padahal hanya berniat memperbaiki hasil (Fi inferior).',
    ],
    growthDevelopment: 'Latih kesadaran Fi dengan menanyakan dampak emosional keputusan terhadap anggota tim yang lebih pendiam sebelum mengunci aturan.',
    internalTensions: 'Menuntut standar objektif yang setara bagi semua (Te) vs memahami kebutuhan personal yang berbeda-beda tiap individu (Fi).',
    stressLoopsAndGrip: 'Te–Ne Loop: memaksa perubahan cepat ke berbagai arah sekaligus ketika panik hasil tertinggal. Fi Grip: merasa seluruh pengorbanannya tidak dihargai secara tulus atau mendadak tertekan oleh keraguan diri.',
    misconceptionsAndAlternatives: 'Bukan selalu keras kepala anti-ide; Ne tersier membuat ESTJ yang sehat cepat mengadopsi metode baru bila terbukti praktis.',
    references: ['Myers et al. (1998)', 'Grant et al. (1983)'],
  },
  ESFJ: {
    code: 'ESFJ',
    stackLabel: 'Fe – Si – Ne – Ti',
    domAuxDynamic: 'Fe (Dominan) peka menjaga atmosfer kebersamaan dan norma saling menghargai, sementara Si (Auxiliary) membantu mewujudkannya lewat tradisi, logistik konkret, dan ketelitian acara.',
    domTerDynamic: 'Fe–Ne loop sibuk mengantisipasi reaksi banyak orang dan skenario sosial tanpa mengecek kenyataan detail lewat Si.',
    domInfDynamic: 'Poros Fe–Ti menantang individu untuk tetap berani berpikir kritis mandiri (Ti) meskipun kesimpulannya berpotensi mengganggu kenyamanan sosial sementara (Fe).',
    auxTerDynamic: 'Poros Si–Ne memadukan penghargaan pada kebiasaan akrab (Si) dengan ide kreatif ramah untuk mencairkan kebosanan kelompok (Ne).',
    integratedSystemBehavior: 'ESFJ matang menyatukan kepedulian sosial aktif (Fe), kehandalan organisasi praktis (Si), keluwesan gagasan menyenangkan (Ne), dan kejernihan nalar mandiri (Ti).',
    realLifeExamples: [
      'Mengatur acara kelas dan memastikan anggota pendiam ikut kebagian peran nyaman (Fe+Si).',
      'Merasa sangat terusik oleh debat logis impersonal yang terasa dingin (Ti inferior).',
    ],
    growthDevelopment: 'Latih Ti dengan membiasakan menyusun alasan logis tertulis secara mandiri sebelum berkonsultasi ke seluruh kelompok.',
    internalTensions: 'Menjaga keterhubungan emosional kelompok (Fe) vs memberi kritik objektif jujur yang mungkin tidak langsung disukai (Ti).',
    stressLoopsAndGrip: 'Fe–Ne Loop: terlalu cemas menebak-nebak pikiran orang lain sambil over-komitmen sosial. Ti Grip: mengisolasi diri dan melontarkan analisis dingin penuh curiga terhadap ketulusan orang sekitar.',
    misconceptionsAndAlternatives: 'Kepedulian sosial ESFJ bukanlah sekadar ikut arus; itu keterampilan koordinasi komunitas yang nyata.',
    references: ['Myers & Myers (1995)', 'Grant et al. (1983)'],
  },
  ISTP: {
    code: 'ISTP',
    stackLabel: 'Ti – Se – Ni – Fe',
    domAuxDynamic: 'Ti (Dominan) membedah prinsip mekanisme cara kerja sesuatu secara objektif, sementara Se (Auxiliary) langsung mengujinya lewat pengamatan fisik dan eksperimen lapangan nyata.',
    domTerDynamic: 'Ti–Ni loop membuat individu mengurung diri merangkai kesimpulan tajam tentang niat atau sistem tanpa mengujinya melalui aksi langsung Se.',
    domInfDynamic: 'Poros Ti–Fe menimbang kebutuhan kejernihan logis mandiri (Ti) terhadap ekspresi kehangatan emosional dan ekspektasi tata krama kelompok (Fe).',
    auxTerDynamic: 'Poros Se–Ni menyatukan respons cepat terhadap realitas fisik (Se) dengan firasat inti arah perkembangan situasi (Ni).',
    integratedSystemBehavior: 'ISTP seimbang memadukan ketajaman nalar teknis (Ti), ketangkasan aksi nyata (Se), intuisi pola inti (Ni), dan kesadaran menjaga jembatan sosial hangat (Fe).',
    realLifeExamples: [
      'Menemukan penyebab alat praktikum error lalu memperbaikinya langsung tanpa panik (Ti+Se).',
      'Merasa kikuk ketika diminta memberi pidato penyemangat emosional mendadak (Fe inferior).',
    ],
    growthDevelopment: 'Gunakan Se aktif dalam kegiatan fisik/karya nyata agar tidak terjebak pikiran dingin; latih Fe dengan mengungkapkan apresiasi secara verbal singkat.',
    internalTensions: 'Otonomi penuh menganalisis dan bertindak tanpa aturan kaku (Ti+Se) vs tuntutan koordinasi emosional kolektif (Fe).',
    stressLoopsAndGrip: 'Ti–Ni Loop: menjadi sangat sinis, curiga terhadap pola niat orang lain tanpa mau turun mengecek fakta. Fe Grip: reaksi emosional mendadak yang canggung atau kekhawatiran berlebih akan penolakan sosial.',
    misconceptionsAndAlternatives: 'Diam mandiri tidak berarti tidak peduli; ISTP sering menunjukkan loyalitas lewat bantuan teknis konkret.',
    references: ['Jung (1921/1971)', 'Grant et al. (1983)'],
  },
  ISFP: {
    code: 'ISFP',
    stackLabel: 'Fi – Se – Ni – Te',
    domAuxDynamic: 'Fi (Dominan) menjaga kesetiaan terhadap nilai batin dan keaslian rasa, sementara Se (Auxiliary) menyalurkannya secara nyata melalui kepekaan estetika, karya fisik, dan tindakan spontan hangat.',
    domTerDynamic: 'Fi–Ni loop menarik diri ke dalam keyakinan simbolik batin yang kaku mengenai nasib atau niat orang lain tanpa berinteraksi langsung dengan realitas Se.',
    domInfDynamic: 'Poros Fi–Te menjembatani kepekaan nilai personal yang halus (Fi) dengan kebutuhan tata kelola objektif, tenggat terukur, dan struktur eksternal (Te).',
    auxTerDynamic: 'Poros Se–Ni menggabungkan kepekaan detail fisik-estetis saat ini (Se) dengan pemaknaan simbolik yang mendalam (Ni).',
    integratedSystemBehavior: 'ISFP utuh menyatukan autentisitas nilai batin (Fi), kehadiran penuh aksi dan estetika (Se), ketajaman makna inti (Ni), dan disiplin mewujudkan rencana kerja (Te).',
    realLifeExamples: [
      'Menciptakan karya visual atau musik yang mengekspresikan sikap sosial secara tulus tanpa pidato panjang (Fi+Se).',
      'Tertekan jika dipaksa mengikuti birokrasi kaku tanpa memahami makna personalnya (Te inferior).',
    ],
    growthDevelopment: 'Jaga keterlibatan dengan lingkungan fisik lewat Se agar terhindar dari overthinking; latih Te lewat jadwal target visual sederhana.',
    internalTensions: 'Keinginan hidup otentik mengikuti arus momen berharga (Fi+Se) vs kebutuhan memaksakan struktur jadwal jangka panjang (Te).',
    stressLoopsAndGrip: 'Fi–Ni Loop: menutup diri penuh luka batin sambil menarik kesimpulan pesimistis tentang masa depan. Te Grip: meledak menyalahkan ketidakefisienan lingkungan dengan nada keras yang terasa asing bagi dirinya.',
    misconceptionsAndAlternatives: 'Kelembutan pembawaan sering disalahartikan sebagai pasif; ISFP sangat tegas menjaga batas kemandirian pribadi.',
    references: ['Myers & Myers (1995)', 'Grant et al. (1983)'],
  },
  ESTP: {
    code: 'ESTP',
    stackLabel: 'Se – Ti – Fe – Ni',
    domAuxDynamic: 'Se (Dominan) membaca dinamika lingkungan nyata dengan cepat dan responsif, dibantu Ti (Auxiliary) untuk memilih taktik paling logis, efisien, dan masuk akal secara langsung.',
    domTerDynamic: 'Se–Fe loop mengejar aksi memikat, validasi sosial cepat, atau sensasi sesaat tanpa memfilter kelayakan logis jangka pendek dengan Ti.',
    domInfDynamic: 'Poros Se–Ni menyeimbangkan ketangkasan merespons momen kini (Se) dengan kesabaran membaca konsekuensi jangka panjang yang belum terlihat (Ni).',
    auxTerDynamic: 'Poros Ti–Fe menggabungkan kejernihan analisis taktis (Ti) dengan pesona membaca suasana serta motivasi orang sekitar (Fe).',
    integratedSystemBehavior: 'ESTP seimbang memadukan keberanian aksi real-time (Se), ketajaman taktis (Ti), keluwesan persuasi sosial (Fe), dan kejelasan arah jangka panjang (Ni).',
    realLifeExamples: [
      'Menyesuaikan strategi debat seketika melihat kelemahan argumen lawan di panggung (Se+Ti).',
      'Kurang sabar mendengarkan proyeksi teoretis 5 tahun ke depan tanpa contoh konkret (Ni inferior).',
    ],
    growthDevelopment: 'Gunakan Ti untuk berhenti menganalisis mekanisme masalah sebelum bertindak; latih Ni dengan menyisihkan 10 menit meninjau dampak jangka panjang keputusan hari ini.',
    internalTensions: 'Merespons peluang nyata di depan mata secepat mungkin (Se) vs menahan diri memikirkan implikasi tersembunyi di masa depan (Ni).',
    stressLoopsAndGrip: 'Se–Fe Loop: over-fokus membaca kesan audiens dan mengejar aksi impulsif tanpa kalkulasi Ti. Ni Grip: tiba-tiba diliputi firasat pesimistis atau paranoik tentang arah masa depan.',
    misconceptionsAndAlternatives: 'Bukan tipe anti-intelektual; banyak ESTP unggul di analisis krisis lapangan, olahraga strategis, hingga kedokteran darurat.',
    references: ['Myers et al. (1998)', 'Grant et al. (1983)', 'Beebe (2016)'],
  },
  ESFP: {
    code: 'ESFP',
    stackLabel: 'Se – Fi – Te – Ni',
    domAuxDynamic: 'Se (Dominan) menangkap suasana hidup secara antusias dan hadir penuh di momen nyata, sementara Fi (Auxiliary) menimbang ketulusan, rasa nyaman etis, dan makna personal.',
    domTerDynamic: 'Se–Te loop fokus bergerak cepat menyelesaikan tugas atau tuntutan hasil praktis tanpa mengecek apakah aktivitas tersebut selaras dengan nilai batin Fi.',
    domInfDynamic: 'Poros Se–Ni menyeimbangkan kelincahan merespons kenyataan konkret hari ini (Se) dengan perencanaan visi jangka panjang serta abstraksi simbolik (Ni).',
    auxTerDynamic: 'Poros Fi–Te membantu menyalurkan kepedulian tulus (Fi) menjadi proyek nyata yang terorganisir (Te).',
    integratedSystemBehavior: 'ESFP dewasa menyatukan antusiasme hadir di lapangan (Se), keteguhan nilai tulus (Fi), keterampilan menata hasil nyata (Te), dan kesadaran arah jangka panjang (Ni).',
    realLifeExamples: [
      'Menghidupkan simulasi kelompok agar seluruh teman ikut berpartisipasi secara hangat (Se+Fi).',
      'Jenuh jika harus merencanakan skenario abstrak jauh ke depan sendirian (Ni inferior).',
    ],
    growthDevelopment: 'Berikan ruang bagi Fi untuk mengevaluasi motivasi diri sebelum mengiyakan ajakan baru; latih Te dan Ni melalui penetapan tujuan mingguan tertulis.',
    internalTensions: 'Menikmati keterlibatan hangat di momen sekarang (Se+Fi) vs disiplin menahan diri demi tujuan jangka panjang abstrak (Ni).',
    stressLoopsAndGrip: 'Se–Te Loop: bekerja berlebihan demi hasil terlihat sambil mengabaikan kelelahan batin. Ni Grip: cemas berlebihan memikirkan makna buruk tersembunyi di balik peristiwa.',
    misconceptionsAndAlternatives: 'Ekspresif bukan berarti dangkal; Fi auxiliary memberi ESFP kedalaman empati personal yang sangat tulus.',
    references: ['Myers & Myers (1995)', 'Grant et al. (1983)'],
  },
};

export const CROSS_FRAMEWORK_COMPARISONS: CrossFrameworkComparisonEntry[] = [
  {
    id: 'mbti-vs-socionics',
    title: 'MBTI vs Socionics',
    frameworkA: 'MBTI (Myers-Briggs & Grant Stack)',
    frameworkB: 'Socionics (Model A & Quadra)',
    tagline: 'Sama-sama berakar pada Jung (1921), namun berbeda definisi fungsi, sistem J/P, dan fokus mekanisme.',
    sharedConcepts: [
      'Keduanya memakai 4 dikotomi sikap & fungsi (E/I, S/N, T/F) serta menyebut 8 elemen/fungsi (Te, Ti, Fe, Fi, Se, Si, Ne, Ni).',
      'Sama-sama memetakan 16 kombinasi tipe dasar untuk memahami gaya komunikasi dan pengambilan keputusan.',
    ],
    falseFriends: [
      {
        term: 'Huruf ke-4: J/P (MBTI) vs j/p (Socionics)',
        meaningInA: 'Menandai apakah fungsi persepsi (S/N) atau penilaian (T/F) yang diekstravertkan ke luar, sehingga memengaruhi gaya keteraturan luar.',
        meaningInB: 'Menandai sifat fungsi Leading (posisi 1): Rasional (j) jika Leading T/F, Irasional (p) jika Leading S/N—TIDAK berubah di dalam kesadaran.',
        clarification: 'Konversi langsung 1:1 keliru untuk tipe Introvert: INTJ di MBTI (Leading Ni) secara struktural paralel dengan INTp/ILI di Socionics, bukan INTj/LII.',
      },
      {
        term: 'Definisi Se, Si, Ni, Fe',
        meaningInA: 'Se: stimulasi indrawi saat ini; Si: ingatan tradisi/detail konkret; Fe: harmoni sosial.',
        meaningInB: 'Se: kekuatan kehendak/tekanan ruang; Si: kenyamanan homeostasis & relaksasi sensorik; Fe: ekspresi dinamika emosi aktif.',
        clarification: 'Walau simbol hurufnya persis sama, cakupan maknanya berbeda sehingga tidak boleh disamakan mentah-mentah.',
      },
    ],
    coreDifferences: [
      { dimension: 'Fokus Teori', inA: 'Preferensi sadar individu (self-report kuesioner & perkembangan pribadi).', inB: 'Metabolisme informasi antar-individu & dinamika Hubungan Intertipe (Duality, Conflict, Quadra).' },
      { dimension: 'Struktur Model', inA: '4 dikotomi resmi (Form M) atau tumpukan 4/8 fungsi Grant–Beebe.', inB: 'Model A (8 fungsi tetap: Blok Ego, Super-Ego, Super-Id, Id + Valued vs Subdued).' },
      { dimension: 'Validasi Empiris', inA: 'Manual psikometrik resmi mengukur 4 dikotomi (Myers et al., 1998).', inB: 'Model konseptual-observasional Eropa Timur; bukan instrumen psikometrik APA standar.' },
    ],
    classificationStructure: 'MBTI mengelompokkan 16 tipe berdasarkan 4 dikotomi biner (atau 4 fungsi sadar berurutan E/I berselang-seling); Socionics menyusun 16 tipe ke dalam 4 Quadra (Alpha, Beta, Gamma, Delta) serta 14 relasi intertipe.',
    interpretationMethods: 'MBTI menafsirkan preferensi belajar, keputusan, dan pola stres individu; Socionics menafsirkan bagaimana dua individu bertukar informasi lewat Blok Ego vs titik peka PoLR/Suggestive.',
    historicalRoots: 'Keduanya tumbuh terpisah dari karya Jung (1921): Myers & Briggs di Amerika Serikat (1940-an–1962) dan Aushra Augustinavichiute di Lithuania (1970-an).',
    typeConstruction: 'MBTI membangun tipe dari 4 preferensi dikotomi atau poros fungsi Dom-Aux-Ter-Inf; Socionics membangun tipe dari pasangan Leading + Creative yang menentukan Quadra nilai.',
    misconceptions: [
      'Mengira kode MBTI INTJ otomatis berarti Socionics LII (INTj).',
      'Mengira Quadra nilai di Socionics menentukan tingkat kecocokan pertemanan secara mutlak.',
    ],
    sameSituationExample: {
      situation: 'Dua teman sekelas berdebat soal metode pengerjaan makalah Biologi menjelang tenggat.',
      interpretationA: 'MBTI melihat apakah konflik dipicu perbedaan kriteria keputusan (Thinking vs Feeling) atau tempo penutupan rencana (Judging vs Perceiving).',
      interpretationB: 'Socionics memetakan apakah argumen pihak A mengenai efisiensi langsung (Te Ego) secara tak sengaja menekan titik PoLR pihak B.',
      synthesisTakeaway: 'Menggabungkan keduanya memperjelas gaya komunikasi individu (MBTI) sekaligus titik gesekan pertukaran informasi (Socionics).',
    },
    references: ['Jung (1921/1971)', 'Myers et al. (1998)', 'Grant et al. (1983)'],
  },
  {
    id: 'bigfive-vs-sloan',
    title: 'Big Five (OCEAN) vs SLOAN / Global 5',
    frameworkA: 'Big Five Akademik (FFM / NEO-PI-R)',
    frameworkB: 'Global 5 / SLOAN (+ Notasi Lanjutan [X]/x/)',
    tagline: 'Satu akar statistik lima dimensi kepribadian, berbeda cara penyajian antara skor kontinum ilmiah dan kode biner komunitas.',
    sharedConcepts: [
      'Sama-sama bertumpu pada lima dimensi leksikal utama: Extraversion, Neuroticism, Conscientiousness, Agreeableness, dan Openness.',
      'Tidak bergantung pada arketipe Jungian melainkan pengamatan kecenderungan perilaku sehari-hari.',
    ],
    falseFriends: [
      {
        term: 'Kode "E" & "L" di SLOAN',
        meaningInA: 'Skor rendah Agreeableness (lugas/kompetitif) dan skor tinggi Neuroticism (reaktivitas stres).',
        meaningInB: 'E (Egocentric) dan L (Limbic) kerap disalahpahami orang awam sebagai "egois jahat" atau "labil klinis".',
        clarification: 'Baik di Big Five maupun SLOAN, itu hanyalah ujung kontinum sifat normal tanpa label moral atau gangguan psikologis.',
      },
      {
        term: 'Notasi [R]cO/A/I',
        meaningInA: 'Tidak dikenal dalam standar psikometrik APA/NEO-PI-R (yang memakai persentil T-score 0–100).',
        meaningInB: 'Konvensi forum daring SimilarMinds untuk menunjukkan hierarki mana sifat paling dominan ([X]) vs moderat (huruf kecil/garis miring).',
        clarification: 'Notasi lanjutan berguna untuk refleksi diri kualitatif, tetapi bukan laporan pengukuran psikometrik presisi.',
      },
    ],
    coreDifferences: [
      { dimension: 'Skala Pengukuran', inA: 'Kontinum persentil bergradasi + 30 faset khusus.', inB: 'Dikotomi 32 kombinasi biner 5 huruf (S/R, L/C, O/U, A/E, I/N).' },
      { dimension: 'Presisi Tengah (45–55%)', inA: 'Tercatat eksplisit sebagai skor rata-rata/moderat.', inB: 'Kode 5 huruf polos memaksa masuk satu kutub meski skor hanya selisih 1%. Notasi huruf kecil mencoba menambal celah ini.' },
      { dimension: 'Penggunaan Riset', inA: 'Standar emas penelitian akademik psikologi kepribadian.', inB: 'Alat bantu komunikasi & diskusi komunitas edukatif.' },
    ],
    classificationStructure: 'Big Five berbentuk 5 sumbu berlanjut (trait continuum) tanpa tipe kaku; SLOAN mengonversinya menjadi 32 kombinasi biner atau kode hierarkis.',
    interpretationMethods: 'Big Five menafsirkan profil faset & persentil secara komparatif terhadap norma; SLOAN membaca kombinasi 5 kutub sebagai ringkasan kebiasaan perilaku.',
    historicalRoots: 'Berawal dari hipotesis leksikal Allport–Odbert & Goldberg (1990) serta Costa & McCrae (1992), lalu diadaptasi SimilarMinds di era 2000-an menjadi Global 5/SLOAN.',
    typeConstruction: 'Big Five menghasilkan 5 skor terpisah; SLOAN merangkai 5 huruf berurutan tetap (S/R → L/C → O/U → A/E → I/N).',
    misconceptions: [
      'Mengira orang berkode SCOAI pasti identik 100% sifatnya padahal perbedaan intensitas 51% vs 99% sangat besar.',
      'Mengira Big Five bisa menjawab "fungsi kognitif Jung" secara langsung.',
    ],
    sameSituationExample: {
      situation: 'Seorang siswa tampak tenang saat pengumuman nilai ujian mendadak dan lebih suka belajar sendiri dengan jadwal ketat.',
      interpretationA: 'Big Five mencatat skor Extraversion rendah-menengah, Neuroticism rendah, dan Conscientiousness tinggi (persentil).',
      interpretationB: 'SLOAN merangkumnya secara ringkas menjadi pola R-C-O-?-? atau notasi R[C]O untuk menonjolkan ketenangan dan keteraturan.',
      synthesisTakeaway: 'Gunakan kode SLOAN sebagai ringkasan praktis sambil selalu mengingat adanya derajat spektrum kontinum Big Five di baliknya.',
    },
    references: ['Goldberg (1990)', 'Costa & McCrae (1992)', 'John & Srivastava (1999)'],
  },
  {
    id: 'enneagram-vs-trifix',
    title: 'Enneagram Inti vs Trifix / Tritype',
    frameworkA: 'Enneagram Inti (+ Sayap & Insting)',
    frameworkB: 'Trifix / Tritype (3 Pusat Kecerdasan)',
    tagline: 'Motivasi inti emosional tunggal vs interaksi lintas tiga pusat (Jantung, Pikiran, Insting).',
    sharedConcepts: [
      'Berbagi sembilan arketipe motivasi inti (Tipe 1–9) beserta tiga pusat kecerdasan (Heart 2-3-4, Head 5-6-7, Gut 8-9-1).',
      'Menyoroti motif batin, ketakutan dasar, dan strategi pertahanan emosi alih-alih sekadar kemampuan kognitif.',
    ],
    falseFriends: [
      {
        term: 'Angka ke-2 dan ke-3 (mis. 258)',
        meaningInA: 'Dalam model inti klasik, seseorang hanya memiliki SATU tipe inti (mis. Tipe 2) yang dipengaruhi sayap tetangga (2w1/2w3) dan garis integrasi.',
        meaningInB: 'Dalam Trifix/Tritype, dua angka lain (mis. 5 & 8) mewakili cara kerja sekunder di pusat lain—BUKAN berarti seseorang memiliki "3 tipe inti setara".',
        clarification: 'Jangan menyetarakan peran Tipe 2 (inti) dengan fix 5 dan 8; tipe inti tetap menentukan kerangka utama.',
      },
    ],
    coreDifferences: [
      { dimension: 'Kompleksitas Fokus', inA: 'Mendalami akar gairah, ketakutan inti, dan dinamika sayap/insting tipe tunggal.', inB: 'Menjelaskan mengapa dua orang bertipe inti sama (mis. sama-sama Tipe 4) tampak berbeda dalam cara berpikir dan menangani konflik.' },
      { dimension: 'Konsensus Teoretis', inA: 'Diterima luas di hampir semua aliran Enneagram (Naranjo, Riso-Hudson, Ichazo).', inB: 'Pengembangan lebih spesifik (Ichazo Trifix / Fauvre Tritype) yang tidak dipakai oleh seluruh praktisi tradisional.' },
    ],
    classificationStructure: 'Enneagram inti: 9 tipe × 2 sayap × 3 varian (27 subtipe instingtual); Trifix: memilih tepat 1 wakil dari masing-masing pusat (3×3×3 = 27 himpunan Three Fix).',
    interpretationMethods: 'Enneagram inti bekerja dengan menelusuri motivasi terdalam dan mekanisme pertahanan utama; Trifix melengkapi nuansa bagaimana ketakutan & batasan diekspresikan di pusat non-inti.',
    historicalRoots: 'Enneagram psikologis dipopulerkan Oscar Ichazo & Claudio Naranjo (1970-an) lalu Riso-Hudson; konsep Trifix/Tritype diperluas oleh Ichazo dan Katherine Chernick Fauvre.',
    typeConstruction: 'Enneagram inti menentukan 1 pusat dominan; Tritype menyusun 3 angka (biasanya core-first atau urutan Heart-Head-Gut).',
    misconceptions: [
      'Sibuk mencari kode 3 angka Tritype sebelum benar-benar memahami ketakutan dan mekanisme tipe inti sendiri.',
      'Mengira angka ke-2 dan ke-3 adalah pengganti sayap (wing) atau panah integrasi.',
    ],
    sameSituationExample: {
      situation: 'Dua siswa sama-sama Tipe 6 mencari kepastian dalam kerja kelompok.',
      interpretationA: 'Enneagram inti menjelaskan rasa cemas keduanya mencari rasa aman dan keandalan aturan.',
      interpretationB: 'Trifix membedakan bahwa Siswa A (6-4-1) lebih peka terhadap otentisitas nilai etis, sedangkan Siswa B (6-3-9) lebih menjaga citra efisiensi dan kedamaian suasana.',
      synthesisTakeaway: 'Gunakan Enneagram Inti sebagai fondasi utama; gunakan Trifix sekadar memperhalus variasi ekspresi.',
    },
    references: ['Riso & Hudson (1999)', 'Naranjo (1994)'],
  },
  {
    id: 'temperament-vs-mbti',
    title: 'Temperamen Klasik & Modern vs MBTI',
    frameworkA: 'Temperamen (4 Humor Klasik / Eysenck / Keirsey)',
    frameworkB: 'MBTI (Myers-Briggs Type Indicator)',
    tagline: 'Istilah "temperamen" punya beberapa makna historis berbeda yang sering tertukar dengan tipe MBTI.',
    sharedConcepts: [
      'Sama-sama memakai empat kategori berpasangan untuk mendeskripsikan gaya respons manusia di lingkungan belajar dan kelompok.',
      'Membantu siswa menyadari bahwa ritme energi dan kebutuhan interaksi teman-temannya beragam.',
    ],
    falseFriends: [
      {
        term: '4 Temperamen Keirsey vs 4 Humor Galen',
        meaningInA: 'Galen/Eysenck membagi Sanguin, Koleris, Melankolis, Plegmatis berdasar kecepatan reaksi emosi & ekstraversi.',
        meaningInB: 'David Keirsey membagi 16 tipe MBTI menjadi Artisan (SP), Guardian (SJ), Idealist (NF), Rational (NT)—yang secara konseptual berbeda.',
        clarification: 'Menyebut ENTJ otomatis "Koleris" atau INFP otomatis "Melankolis" sering meleset karena preferensi kognitif tidak mengunci laju reaktivitas saraf.',
      },
    ],
    coreDifferences: [
      { dimension: 'Objek Deskripsi', inA: 'Nada reaktivitas emosional, ketahanan tenang, dan laju gerak energi perilaku.', inB: 'Preferensi sadar dalam mengumpulkan informasi (S/N) dan memutuskan (T/F).' },
      { dimension: 'Dimensi Emosi', inA: 'Mengukur perbedaan reaktivitas emosional (mis. Melankolis/Koleris lebih reaktif vs Sanguin/Plegmatis lebih tenang di model Eysenck).', inB: 'Tidak mengukur tingkat kecemasan atau kestabilan emosional.' },
    ],
    classificationStructure: 'Temperamen klasik memakai 4 tipe utama + 12 kombinasi terarah primer–sekunder; MBTI memakai 16 kombinasi 4 huruf dikotomi.',
    interpretationMethods: 'Temperamen menyorot bagaimana orang bereaksi secara spontan, cepat, atau tenang menghadapi stimulasi; MBTI menafsirkan cara pikiran menyusun informasi dan kriteria nilai.',
    historicalRoots: 'Temperamen berakar pada Yunani Kuno lalu diteliti secara psikobiologis oleh Eysenck (1967), Thomas & Chess (1977), dan Kagan (1994); MBTI berakar pada Jung (1921) dan Myers-Briggs (1940-an).',
    typeConstruction: 'Temperamen dibentuk dari sifat primer + sekunder opsional (mis. Melankolis–Plegmatis); MBTI dari 4 preferensi biner (E/I, S/N, T/F, J/P).',
    misconceptions: [
      'Mengira teori 4 cairan tubuh Galen masih diakui sebagai fakta medis modern.',
      'Mengira satu tipe MBTI hanya boleh punya satu temperamen klasik tertentu.',
    ],
    sameSituationExample: {
      situation: 'Dua siswa sama-sama bertipe INTJ (Ni–Te) menghadapi revisi mendadak menjelang lomba.',
      interpretationA: 'Siswa A (Koleris–Melankolis) segera membagi ulang peran dengan nada tegas; Siswa B (Plegmatis–Melankolis) tetap tenang membisu sambil menata ulang struktur daftar kerja.',
      interpretationB: 'MBTI melihat keduanya memakai visi strategis (Ni) dan efektivitas sistem (Te), tanpa membedakan laju reaktivitas emosionalnya.',
      synthesisTakeaway: 'Temperamen melengkapi MBTI dengan menggambarkan tempo energi dan regulasi emosional yang tampak di permukaan.',
    },
    references: ['Kagan (1994)', 'Eysenck (1967)', 'Keirsey (1998)', 'Myers et al. (1998)'],
  },
  {
    id: 'psychosophy-vs-socionics',
    title: 'Psikosofi (L·V·E·F) vs Socionics Model A',
    frameworkA: 'Psikosofi / Attitudinal Psyche (Afanasiev)',
    frameworkB: 'Socionics Model A (Augustinavichiute)',
    tagline: 'Dua sistem dari tradisi Eropa Timur yang memetakan aspek berbeda: prioritas sikap eksistensial vs pemrosesan elemen informasi.',
    sharedConcepts: [
      'Sama-sama menaruh perhatian pada posisi kepekaan psikologis (Posisi 3 di Psikosofi vs PoLR/Posisi 4 di Socionics).',
      'Sama-sama memiliki dimensi dialog dua arah yang sehat (Posisi 2 Proses vs Creative/Dual) dan keteguhan diri (Posisi 1 vs Leading).',
    ],
    falseFriends: [
      {
        term: 'Simbol L (Logic) vs T (Ti/Te), serta E (Emotion) vs F (Fi/Fe)',
        meaningInA: 'L mencakup seluruh sikap percaya diri atau keraguan terhadap ranah argumen intelektual; E mencakup seluruh ekspresi rasa, estetika, dan suasana emosional.',
        meaningInB: 'Socionics membedakan tegas antara orientasi Ekstraverted (Te/Fe) dan Introverted (Ti/Fi) dengan definisi informasi berbeda.',
        clarification: 'Seseorang bertipe Socionics LII bisa saja berposisi 3L atau 2L, bukan otomatis 1L—tergantung seberapa fleksibel sikapnya terhadap kritik logis.',
      },
    ],
    coreDifferences: [
      { dimension: 'Komponen Inti', inA: '4 aspek universal: Logika (L), Kehendak/Volition (V), Emosi (E), dan Fisika/Materi (F) berurutan posisi 1–4.', inB: '8 elemen informasi (Te, Ti, Fe, Fi, Se, Si, Ne, Ni) terdistribusi dalam 8 blok Model A.' },
      { dimension: 'Fokus Konflik', inA: 'Menyorot asimetri posisi kuat (1/2) vs posisi sensitif (3/4), terutama benturan Volition 1V vs 3V.', inB: 'Menyorot kesesuaian Quadra serta hubungan antar-elemen (mis. Ego vs PoLR atau Suggestive).' },
    ],
    classificationStructure: 'Psikosofi membentuk 24 permutasi urutan (4!); Socionics membentuk 16 tipe dengan 4 Quadra.',
    interpretationMethods: 'Psikosofi menafsirkan cara individu memberi bobot penting (Posisi 1/3) vs santai (2/4) pada aspek hidup; Socionics menafsirkan arah aliran dan kekuatan metabolisme informasi.',
    historicalRoots: 'Psikosofi dikembangkan Alexander Afanasiev pada 1990-an; Socionics dikembangkan Aushra Augustinavichiute pada 1970-an—keduanya kerap dipadukan oleh komunitas tipologi modern.',
    typeConstruction: 'Psikosofi mengurutkan 4 huruf L, V, E, F; Socionics memasangkan Leading dan Creative dari fungsi berlawanan E/I dan Rasional/Irasional.',
    misconceptions: [
      'Mengira 1V pasti tipe Se-leading (SLE/SEE); orang bertipe Ni/Ti-leading juga bisa sangat berteguh pada kehendak (1V) jika yakin dengan arah batinnya.',
      'Mengira aspek F (Physics) hanya soal kekuatan olahraga; F mencakup kenyamanan fisik, barang, kesehatan, dan materi praktis.',
    ],
    sameSituationExample: {
      situation: 'Ketegangan muncul saat koordinator kelompok menetapkan jadwal kerja tanpa bertanya ke anggota lain.',
      interpretationA: 'Psikosofi menyoroti benturan 1V (tegas memutus sepihak) dengan 3V (merasa martabat otonominya diremehkan meski secara pribadi menginginkan kejelasan).',
      interpretationB: 'Socionics memeriksa apakah koordinator menekan lewat Se/Te yang mengenai PoLR pihak lain.',
      synthesisTakeaway: 'Keduanya saling memperkaya pemahaman konflik antara masalah isi informasi dan masalah harga diri/kehendak.',
    },
    references: ['Jung (1921/1971)', 'Dokumentasi Komunitas Psikosofi & Model A'],
  },
  {
    id: 'jungian-vs-contemporary',
    title: 'Tipologi Jung Asli (1921) vs Sistem Kontemporer',
    frameworkA: 'Tipologi Psikologis Asli C. G. Jung (1921)',
    frameworkB: 'Sistem Populer Kontemporer (MBTI Grant/Beebe & Kuis Online)',
    tagline: 'Memisahkan fondasi psikologi kedalaman Jung dari modifikasi modern agar tidak mencampuradukkan klaim.',
    sharedConcepts: [
      'Berbagi konsep sikap Extraversion vs Introversion dan keempat fungsi sadar Thinking, Feeling, Sensation, Intuition.',
      'Menghargai bahwa perkembangan diri menuntut integrasi sisi yang selama ini kurang terpakai.',
    ],
    falseFriends: [
      {
        term: 'Kode seperti "IN(F)" vs "INFJ"',
        meaningInA: 'Notasi klasik Jung hanya menentukan sikap + fungsi dominan (Intuition Introvert) serta fungsi bantu yang kadang sama sikapnya atau fleksibel.',
        meaningInB: 'Sistem Grant mematok urutan kaku E-I-E-I (mis. Ni–Fe–Ti–Se untuk INFJ).',
        clarification: 'Jung sendiri mengakui bahwa fungsi bantu sering lebih bersifat pelengkap pragmatis dan tidak merumuskan tabel 8 fungsi Beebe maupun dikotomi J/P.',
      },
    ],
    coreDifferences: [
      { dimension: 'Tujuan Utama', inA: 'Memahami proses individuasi psikis dan jembatan ke ketidaksadaran.', inB: 'Klasifikasi cepat gaya belajar, tim kerja, dan komunikasi praktis.' },
      { dimension: 'Sikap Terhadap Kategori', inA: 'Jung mengingatkan tipe murni sangat jarang dan kepribadian bersifat cair sepanjang hidup.', inB: 'Sering memperlakukan kode 4 huruf sebagai identitas permanen tak berubah.' },
    ],
    classificationStructure: 'Jung (1921): 2 sikap × 4 fungsi = 8 tipe psikologis utama (mis. ET, EF, IT, IF, ES, EN, IS, IN) beserta sub-aksesorinya; Kontemporer: 16 tipe 4-huruf plus 8-slot tumpukan.',
    interpretationMethods: 'Jung membaca ketimpangan kesadaran sebagai dinamika perkembangan jangka panjang; sistem kontemporer memakai kuesioner atau profil fungsi harian.',
    historicalRoots: 'Karya monumental "Psychologische Typen" (1921) menjadi mata air bagi Briggs-Myers (1940s), Socionics (1970s), Grant (1983), dan Beebe (2016).',
    typeConstruction: 'Jung memulai dari fungsi paling terdeferensiasi; sistem kontemporer mengombinasikan sumbu J/P atau aturan aksis simetris.',
    misconceptions: [
      'Mengutip kalimat "Jung mengatakan tipe punya 8 slot hero-trickster-demon"—padahal model 8 arketipal itu karya John Beebe (2016).',
      'Mengira tes online singkat 10 menit bisa memastikan tipe Jungian mendalam secara akurat.',
    ],
    sameSituationExample: {
      situation: 'Seorang siswa yang biasanya tenang dan abstrak tiba-tiba marah besar terhadap detail fisik berantakan.',
      interpretationA: 'Jung (1921) membacanya sebagai letupan sementara "Inferior Function" dari ketidaksadaran saat ego kelelahan.',
      interpretationB: 'Forum kontemporer memberi istilah "Se Grip" lengkap dengan teori loop spesifik.',
      synthesisTakeaway: 'Mengenal akar Jung membantu kita tetap rendah hati memakai model modern sebagai alat refleksi perkembangan, bukan label kaku.',
    },
    references: ['Jung (1921/1971)', 'Myers & Myers (1995)', 'Beebe (2016)'],
  },
];

// ============================================================================
// EDUCATIONAL INTEGRATION GUIDES FOR ALL 12 ARCADE MINI-GAMES
// ============================================================================

export interface ArcadeEducationalGuide {
  gameId: ArcadeGameId;
  instructions: string[];
  theoryOverview: string;
  keyDefinitions: { term: string; meaning: string }[];
  workedExample: string;
  references: string[];
  learnMoreSection: 'analisis-kepribadian' | 'psikosofi' | 'eksplorasi-quadra' | 'peta-konsep';
  learnMoreLabel: string;
  recommendedTheoryTab?: 'socionics' | 'mbti' | 'enneagram' | 'jungian' | 'sloan' | 'temperament';
}

export const ARCADE_GAME_EDUCATION: Record<ArcadeGameId, ArcadeEducationalGuide> = {
  'match-up': {
    gameId: 'match-up',
    instructions: [
      'Pilih kerangka dan tingkat kesulitan (Pemula / Menengah / Lanjutan) lalu tekan Mulai.',
      'Klik satu kartu istilah di kolom kiri, lalu pasangkan dengan kartu definisi atau konsep yang paling tepat di kolom kanan.',
      'Tinjau rangkuman penjelasan setiap pasangan pada akhir ronde untuk memperkuat daya ingat konseptual.',
    ],
    theoryOverview:
      'Latihan pencocokan ini melatih ketepatan membedakan definisi inti antarkerangka tanpa mencampuradukkan istilah yang mirip secara huruf (misalnya "Fe" di MBTI/Socionics vs "E" Egocentric di SLOAN atau "F" Physics di Psikosofi).',
    keyDefinitions: [
      { term: 'Elemen / Dikotomi', meaning: 'Satuan dasar pemrosesan informasi atau preferensi sikap dalam suatu kerangka tertentu.' },
      { term: 'Kutub Biner SLOAN', meaning: 'Penanda tinggi/rendah tiap dimensi Big Five (S/R, L/C, O/U, A/E, I/N).' },
      { term: 'Temperamen Klasik', meaning: 'Empat pola energi perilaku historis (Sanguine, Choleric, Melancholic, Phlegmatic).' },
    ],
    workedExample: 'Misalnya: Jika muncul "C (Calm)" di SLOAN, pasangannya adalah "Stabilitas emosional tinggi / reaktivitas stres rendah" — bukan berarti tidak peduli orang lain.',
    references: ['Jung (1921/1971); Myers & Myers (1995); Goldberg (1990); Eysenck (1967).'],
    learnMoreSection: 'analisis-kepribadian',
    learnMoreLabel: 'Pelajari Teori di Perpustakaan Kerangka',
    recommendedTheoryTab: 'mbti',
  },
  'function-builder': {
    gameId: 'function-builder',
    instructions: [
      'Baca target tipe (misalnya tipe Socionics Model A atau MBTI 4-fungsi) yang ditampilkan.',
      'Pilih elemen dari palet dan tempatkan ke posisi Dominan/Leading, Kreatif/Auxiliary, Role/Tertiary, hingga Inferior/PoLR.',
      'Klik Periksa Susunan untuk melihat analisis tiap posisi dan alasan pola aksis fungsinya.',
    ],
    theoryOverview:
      'Dalam Socionics (Blok Ego–Super-Ego) maupun tumpukan Grant MBTI (Dom–Aux–Ter–Inf), fungsi bekerja berpasangan secara simetris. Memahami aturan poros membantu menalar susunan tanpa menghafal buta.',
    keyDefinitions: [
      { term: 'Poros Fungsi (Axis)', meaning: 'Jika fungsi ke-2/ke-3 menggunakan Ti, pasangannya di sumbu keputusan adalah Fe (dan sebaliknya Te berpasangan dengan Fi).' },
      { term: 'Blok Ego Model A', meaning: 'Dua fungsi terkuat dan paling bernilai (Leading + Creative) dalam Socionics.' },
    ],
    workedExample: 'Untuk MBTI INFJ: Fungsi Dominan adalah Ni (persepsi internal), dibantu Fe (eksternal empatik), sehingga Tersiernya adalah Ti dan Inferiornya Se.',
    references: ['Grant, Thompson, & Clarke (1983); Beebe (2016); Socionics Model A.'],
    learnMoreSection: 'analisis-kepribadian',
    learnMoreLabel: 'Buka Teori Fungsi & MBTI',
    recommendedTheoryTab: 'mbti',
  },
  detective: {
    gameId: 'detective',
    instructions: [
      'Cermati pernyataan bukti dan konteks situasi yang diberikan di kartu kasus.',
      'Hindari menyimpulkan terlalu jauh melampaui data: pilih interpretasi yang benar-benar disokong bukti.',
      'Bila petunjuk menunjukkan data belum cukup untuk memastikan tipe tunggal, pilih opsi pengakuan ambiguitas yang jujur.',
    ],
    theoryOverview:
      'Kesalahan paling umum dalam belajar tipologi adalah "confirmation bias"—langsung melompat ke label tipe dari satu perilaku permukaan. Detektif Tipologi melatih disiplin membedakan indikasi teoretis dari kepastian palsu.',
    keyDefinitions: [
      { term: 'Over-Interpretation', meaning: 'Menarik klaim tipe tertentu hanya dari satu kebiasaan tanpa memeriksa motivasi atau konteks situasi.' },
      { term: 'Ambiguitas Terkendali', meaning: 'Pengakuan bahwa dua tipe berbeda bisa menunjukkan perilaku luar serupa karena alasan berbeda.' },
    ],
    workedExample: 'Siswa yang mencatat rapi belum tentu tipe J atau O: bisa jadi ia tipe P dengan kecemasan tinggi (Limbic) atau memakai daftar periksa untuk mengimbangi kebiasaan lupa.',
    references: ['Myers et al. (1998); Costa & McCrae (1992).'],
    learnMoreSection: 'analisis-kepribadian',
    learnMoreLabel: 'Baca Prinsip Interpretasi Etis',
    recommendedTheoryTab: 'sloan',
  },
  'quadra-sort': {
    gameId: 'quadra-sort',
    instructions: [
      'Pilih kategori target yang sesuai untuk kartu sifat, elemen, atau temperamen yang sedang aktif.',
      'Kelompokkan berdasarkan nilai kerangka sebenarnya (Alpha/Beta/Gamma/Delta, Triad Enneagram, Dimensi SLOAN, atau 4 Temperamen).',
      'Pelajari penjelasan mengapa suatu ciri masuk kategori tersebut.',
    ],
    theoryOverview:
      'Setiap kerangka membagi kategori berdasarkan kriteria struktural yang tegas: Quadra berdasar fungsi bernilai, Triad Enneagram berdasar pusat emosi dominan, sementara Temperamen menyorot laju reaksi & regulasi diri.',
    keyDefinitions: [
      { term: 'Quadra Nilai', meaning: 'Empat kelompok Socionics yang berbagi keempat elemen informasi sadar yang dihargai (valued elements).' },
      { term: 'Pusat Triad (Heart/Head/Gut)', meaning: 'Tiga pusat kecerdasan Enneagram yang menyoroti emosi dasar malu, takut, atau marah.' },
    ],
    workedExample: 'Sifat "antusias mencairkan suasana dan cepat bergerak secara ekstrovert-stabil" tergolong Sanguine, bukan Choleric yang lebih tinggi dorongan kendali/reaktivitasnya.',
    references: ['Eysenck (1967); Thomas & Chess (1977).'],
    learnMoreSection: 'eksplorasi-quadra',
    learnMoreLabel: 'Pelajari Eksplorasi Quadra',
  },
  'type-cipher': {
    gameId: 'type-cipher',
    instructions: [
      'Urai petunjuk berantai berupa ciri fungsi, simbol Big Five, notasi lanjutan [X]/x/, atau campuran temperamen.',
      'Pilih atau ketik kode tipe yang paling akurat menjawab seluruh petunjuk secara serempak.',
      'Baca dekode jawaban untuk melihat arti tiap huruf atau tanda.',
    ],
    theoryOverview:
      'Beragam sistem memakai singkatan padat huruf yang sekilas mirip ("E" bisa Extraversion MBTI, Emotion Psikosofi, atau Egocentric SLOAN). Latihan sandi ini membiasakan membaca huruf sesuai konteks kerangkanya.',
    keyDefinitions: [
      { term: 'Notasi Lanjutan SLOAN [X]xx/X', meaning: 'Tanda [X] menunjuk trait dominan utama, huruf kecil berarti kekuatan sedang, dan setelah garis miring (/) berarti sisi paling lemah.' },
    ],
    workedExample: 'Sandi "[R]cO/A/i" dibaca: paling menonjol Reserved ([R]), tenang moderat (c), teratur kuat (O), serta urutan penekanan akhir Accommodating lalu Inquisitive moderat.',
    references: ['SimilarMinds Global 5; John & Srivastava (1999).'],
    learnMoreSection: 'analisis-kepribadian',
    learnMoreLabel: 'Pelajari Kode & Notasi SLOAN',
    recommendedTheoryTab: 'sloan',
  },
  memory: {
    gameId: 'memory',
    instructions: [
      'Buka dua kartu sekaligus untuk menemukan pasangan simbol dan definisinya yang sesuai.',
      'Ingat letak kartu yang sudah terbuka agar jumlah langkah tetap hemat dan fokus.',
      'Setelah seluruh pasangan cocok, tinjau ringkasan pasangan konsep yang telah Anda kuasai.',
    ],
    theoryOverview:
      'Pengulangan aktif berjarak membantu memindahkan kosakata teknis (seperti PoLR, Triads, Inquisitive, Sanguine–Melancholic) dari sekadar istilah hafalan menjadi peta makna cepat.',
    keyDefinitions: [
      { term: 'Recall Berpasangan', meaning: 'Menghubungkan kode simbolik ringkas dengan deskripsi konkret dalam satu unit mental.' },
    ],
    workedExample: 'Pasangkan kartu "Keirsey Artisan" dengan kode "SP (Sensing-Perceiving)" alih-alih mencampurkannya dengan humor darah Galen.',
    references: ['Keirsey (1998); Jung (1921/1971).'],
    learnMoreSection: 'analisis-kepribadian',
    learnMoreLabel: 'Buka Glosarium Teori',
    recommendedTheoryTab: 'temperament',
  },
  blitz: {
    gameId: 'blitz',
    instructions: [
      'Jawab rangkaian pertanyaan konsep dari kerangka pilihan dalam tempo tanggap yang nyaman.',
      'Setiap jawaban langsung memunculkan umpan balik penjelasan teoretis mengapa pilihan itu benar dan mengapa pengecoh keliru.',
      'Gunakan filter kerangka MBTI, SLOAN, atau Temperamen untuk mendalami topik spesifik.',
    ],
    theoryOverview:
      'Kuis berumpan-balik segera memastikan setiap miskonsepsi langsung diluruskan pada saat belajar, bukan dibiarkan mengendap sampai akhir sesi.',
    keyDefinitions: [
      { term: 'Distinction Model', meaning: 'Membedakan definisi konsep di dalam satu kerangka agar tidak tertukar dengan konsep sistem lain.' },
    ],
    workedExample: 'Pertanyaan "Apa arti F dalam Psikosofi FLVE vs MBTI INFP?" melatih kepekaan membedakan Physics (materi/fisik) vs Feeling (penilaian nilai).',
    references: ['Myers & Myers (1995); Goldberg (1990); Kagan (1994).'],
    learnMoreSection: 'analisis-kepribadian',
    learnMoreLabel: 'Pelajari Materi Kerangka Lengkap',
    recommendedTheoryTab: 'mbti',
  },
  reconstruction: {
    gameId: 'reconstruction',
    instructions: [
      'Susun blok kode yang masih acak menjadi urutan tipe yang utuh (mis. 4 posisi L·V·E·F, urutan huruf S-L-O-A-N, atau pasangan temperamen).',
      'Perhatikan urutan dimensi wajib: dalam SLOAN urutan selalu S/R → L/C → O/U → A/E → I/N.',
      'Klik Periksa Susunan untuk memvalidasi setiap posisi.',
    ],
    theoryOverview:
      'Kode tipe bekerja secara posisional. Mengubah urutan satu huruf dalam LVEF vs LVFE atau S-L-O-A-N mengubah makna teoretisnya secara menyeluruh.',
    keyDefinitions: [
      { term: 'Urutan Posisional', meaning: 'Setiap indeks urutan dalam kode mewakili dimensi dan tingkat peran tertentu.' },
    ],
    workedExample: 'Kode "RCOAI" tidak bisa ditulis "OCRIA" karena posisi pertama khusus E/R (Social/Reserved), kedua L/C, ketiga O/U, keempat A/E, dan kelima I/N.',
    references: ['Costa & McCrae (1992); Myers et al. (1998).'],
    learnMoreSection: 'psikosofi',
    learnMoreLabel: 'Pelajari Struktur Posisional',
  },
  'mistype-hunter': {
    gameId: 'mistype-hunter',
    instructions: [
      'Baca klaim tipologi yang umum beredar di media sosial atau forum diskusi.',
      'Identifikasi letak kesalahan logika konversi silang, stereotip sempit, atau kerancuan lintas model.',
      'Pilih alasan koreksi yang paling tepat secara ilmiah dan metodologis.',
    ],
    theoryOverview:
      'Media sosial penuh mitos berbahaya seperti "semua tipe E itu berisik", "Choleric pasti kejam", atau "nilai Limbic tinggi berarti lemah". Fitur ini membongkar mitos tersebut satu per satu.',
    keyDefinitions: [
      { term: 'Fallacy Konversi 1:1', meaning: 'Asumsi keliru bahwa satu kode di MBTI otomatis menentukan satu tipe Socionics, Enneagram, SLOAN, atau Temperamen tertentu.' },
    ],
    workedExample: 'Klaim "INTJ pasti tipe 5w6 RCOEI" keliru karena motif batin (Enneagram), kebiasaan teramati (SLOAN), dan preferensi kognitif (MBTI) berdiri independen.',
    references: ['Kagan (1994); Goldberg (1990); Jung (1921/1971).'],
    learnMoreSection: 'peta-konsep',
    learnMoreLabel: 'Bandingkan Antar-Kerangka di Peta Konsep',
  },
  'scenario-lens': {
    gameId: 'scenario-lens',
    instructions: [
      'Amati skenario kelas atau kolaborasi nyata dari beberapa sudut pandang kerangka sekaligus.',
      'Pilih lensa teoretis yang paling relevan menjelaskan akar dinamika situasi tersebut tanpa menyalahkan individu.',
      'Pelajari rekomendasi langkah komunikasi konstruktif setelah memilih jawaban.',
    ],
    theoryOverview:
      'Satu peristiwa yang sama (misalnya debat di rapat panitia) tampak berbeda melalui lensa MBTI (S vs N dalam membahas rencana), SLOAN (O vs U), atau Temperamen (Choleric vs Phlegmatic dalam gaya bicara).',
    keyDefinitions: [
      { term: 'Multi-Lens Framing', meaning: 'Membaca satu interaksi menggunakan kacamata berbeda untuk menemukan strategi komunikasi paling praktis.' },
    ],
    workedExample: 'Siswa U (spontan) dan siswa O (terjadwal) berselisih bukan karena niat buruk, melainkan beda kebutuhan kepastian jadwal awal.',
    references: ['Thomas & Chess (1977); Myers et al. (1998).'],
    learnMoreSection: 'analisis-kepribadian',
    learnMoreLabel: 'Pelajari Lensa Perilaku Lengkap',
    recommendedTheoryTab: 'temperament',
  },
  wheel: {
    gameId: 'wheel',
    instructions: [
      'Putar Roda Tantangan untuk memilih secara acak topik lintas kerangka (MBTI, SLOAN, Temperamen, Socionics, Enneagram, Psikosofi).',
      'Jawab tantangan konsep atau studi mini yang keluar dari roda.',
      'Gunakan mode ini untuk meninjau luasnya pemahaman lintas sistem tanpa memilih topik favorit saja.',
    ],
    theoryOverview:
      'Keberagaman topik acak melatih kelenturan berpindah antar-paradigma teoretis—dari psikologi sifat empiris (Big Five) hingga teori preferensi kognitif (MBTI) dan temperamen.',
    keyDefinitions: [
      { term: 'Interleaved Practice', meaning: 'Strategi belajar mencampur berbagai topik kerangka dalam satu sesi agar batas konsep makin tajam.' },
    ],
    workedExample: 'Putaran 1 bisa membahas "Sanguine vs Social", diikuti putaran 2 tentang "Fungsi Auxiliary Ti pada ENTP".',
    references: ['John & Srivastava (1999); Jung (1921/1971).'],
    learnMoreSection: 'analisis-kepribadian',
    learnMoreLabel: 'Tinjau Seluruh Kerangka Teori',
    recommendedTheoryTab: 'sloan',
  },
  'escape-room': {
    gameId: 'escape-room',
    instructions: [
      'Selesaikan 5 ruang observatorium teka-teki berantai yang menggabungkan kode fungsi, sandi SLOAN lanjutan, temperamen campuran, dan validasi bukti.',
      'Setiap ruangan membutuhkan ketepatan pemecahan kunci konsep agar pintu ruang berikutnya terbuka.',
      'Gunakan petunjuk teori bila menemui jalan buntu sebelum mengunci jawaban.',
    ],
    theoryOverview:
      'Escape Room mengintegrasikan seluruh kemampuan analisis sintesis lintas 7 kerangka DYNAMAP dalam tantangan pemecahan masalah bertahap.',
    keyDefinitions: [
      { term: 'Sintesis Lintas Kerangka', meaning: 'Menghubungkan tanda-tanda independen (fungsi, motif, perilaku, temperamen) secara koheren tanpa reduksi.' },
    ],
    workedExample: 'Ruang gabungan menuntut membaca kode MBTI bersama sandi SLOAN [R]cO/A/I untuk membuka kunci verifikasi analisis.',
    references: ['Jung (1921/1971); Costa & McCrae (1992); Keirsey (1998).'],
    learnMoreSection: 'peta-konsep',
    learnMoreLabel: 'Tinjau Peta Relasi Konsep',
  },
};
