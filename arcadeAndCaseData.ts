import type {
  ArcadeDifficulty,
  ArcadeFramework,
  ArcadeGameId,
  InformationElement,
  QuadraName,
  SocionicsCode,
} from '../types/dynamap';

export interface MbtiStackSpec {
  code: string;
  title: string;
  stack: [InformationElement, InformationElement, InformationElement, InformationElement];
  shadow: [InformationElement, InformationElement, InformationElement, InformationElement];
  summary: string;
}

export const MBTI_TYPE_STACKS: Record<string, MbtiStackSpec> = {
  INTJ: {
    code: 'INTJ',
    title: 'Perancang Strategis Introvert',
    stack: ['Ni', 'Te', 'Fi', 'Se'],
    shadow: ['Ne', 'Ti', 'Fe', 'Si'],
    summary: 'Menggabungkan sintesis visi jangka panjang (Ni) dengan organisasi fakta dan sistem kerja objektif (Te).',
  },
  INTP: {
    code: 'INTP',
    title: 'Analis Prinsip Konseptual',
    stack: ['Ti', 'Ne', 'Si', 'Fe'],
    shadow: ['Te', 'Ni', 'Se', 'Fi'],
    summary: 'Mengutamakan koherensi sistem logika internal (Ti) dan eksplorasi kemungkinan konseptual bercabang (Ne).',
  },
  ENTJ: {
    code: 'ENTJ',
    title: 'Penggerak Sistem Ekstrovert',
    stack: ['Te', 'Ni', 'Se', 'Fi'],
    shadow: ['Ti', 'Ne', 'Si', 'Fe'],
    summary: 'Berfokus pada efektivitas eksekusi tujuan terukur (Te) yang dipandu antisipasi arah jangka panjang (Ni).',
  },
  ENTP: {
    code: 'ENTP',
    title: 'Penjelajah Gagasan & Dialektika',
    stack: ['Ne', 'Ti', 'Fe', 'Si'],
    shadow: ['Ni', 'Te', 'Fi', 'Se'],
    summary: 'Menangkap beragam kemungkinan baru (Ne) dan mengujinya melalui analisis konsistensi logis (Ti).',
  },
  INFJ: {
    code: 'INFJ',
    title: 'Penyintesis Makna & Empati',
    stack: ['Ni', 'Fe', 'Ti', 'Se'],
    shadow: ['Ne', 'Fi', 'Te', 'Si'],
    summary: 'Menyaring pola perkembangan jangka panjang (Ni) dengan kepekaan terhadap iklim emosional kolektif (Fe).',
  },
  INFP: {
    code: 'INFP',
    title: 'Idealis Nilai & Kemungkinan',
    stack: ['Fi', 'Ne', 'Si', 'Te'],
    shadow: ['Fe', 'Ni', 'Se', 'Ti'],
    summary: 'Menimbang keaslian nilai batin personal (Fi) dan mengeksplorasi makna simbolik alternatif (Ne).',
  },
  ENFJ: {
    code: 'ENFJ',
    title: 'Fasilitator Harmoni & Arah',
    stack: ['Fe', 'Ni', 'Se', 'Ti'],
    shadow: ['Fi', 'Ne', 'Si', 'Te'],
    summary: 'Menggerakkan resonansi suasana bersama (Fe) sembari menjaga arah perkembangan visi kelompok (Ni).',
  },
  ENFP: {
    code: 'ENFP',
    title: 'Katalis Inspirasi & Nilai',
    stack: ['Ne', 'Fi', 'Te', 'Si'],
    shadow: ['Ni', 'Fe', 'Ti', 'Se'],
    summary: 'Membangkitkan opsi-opsi kreatif (Ne) yang disaring melalui integritas perasaan personal (Fi).',
  },
  ISTJ: {
    code: 'ISTJ',
    title: 'Penjaga Prosedur & Rekaman Fakta',
    stack: ['Si', 'Te', 'Fi', 'Ne'],
    shadow: ['Se', 'Ti', 'Fe', 'Ni'],
    summary: 'Mengandalkan presisi pengalaman teruji (Si) dan keteraturan pelaksanaan faktual (Te).',
  },
  ISFJ: {
    code: 'ISFJ',
    title: 'Pemelihara Kestabilan & Kepedulian',
    stack: ['Si', 'Fe', 'Ti', 'Ne'],
    shadow: ['Se', 'Fi', 'Te', 'Ni'],
    summary: 'Menjaga kenyamanan serta kesinambungan konkret (Si) untuk mendukung kesejahteraan suasana sosial (Fe).',
  },
  ESTJ: {
    code: 'ESTJ',
    title: 'Pengelola Operasional Terstruktur',
    stack: ['Te', 'Si', 'Ne', 'Fi'],
    shadow: ['Ti', 'Se', 'Ni', 'Fe'],
    summary: 'Mengatur alur kerja objektif (Te) dengan berpegang pada standar praktik yang terbukti berhasil (Si).',
  },
  ESFJ: {
    code: 'ESFJ',
    title: 'Koordinator Kebersamaan Praktis',
    stack: ['Fe', 'Si', 'Ne', 'Ti'],
    shadow: ['Fi', 'Se', 'Ni', 'Te'],
    summary: 'Membangun kehangatan interaksi kolektif (Fe) melalui perhatian pada tradisi dan kebutuhan nyata (Si).',
  },
  ISTP: {
    code: 'ISTP',
    title: 'Pemecah Masalah Taktis Langsung',
    stack: ['Ti', 'Se', 'Ni', 'Fe'],
    shadow: ['Te', 'Si', 'Ne', 'Fi'],
    summary: 'Memahami cara kerja mekanisme logis (Ti) dan langsung bertindak responsif pada situasi fisik saat ini (Se).',
  },
  ISFP: {
    code: 'ISFP',
    title: 'Ekspresor Nilai Konkret',
    stack: ['Fi', 'Se', 'Ni', 'Te'],
    shadow: ['Fe', 'Si', 'Ne', 'Ti'],
    summary: 'Memegang prinsip batin personal (Fi) yang diwujudkan secara spontan melalui pengalaman inderawi langsung (Se).',
  },
  ESTP: {
    code: 'ESTP',
    title: 'Eksekutor Dinamis Momen Kini',
    stack: ['Se', 'Ti', 'Fe', 'Ni'],
    shadow: ['Si', 'Te', 'Fi', 'Ne'],
    summary: 'Cepat membaca peluang nyata di lingkungan fisik (Se) sambil menganalisis taktik paling logis (Ti).',
  },
  ESFP: {
    code: 'ESFP',
    title: 'Penggerak Energi & Pengalaman Nyata',
    stack: ['Se', 'Fi', 'Te', 'Ni'],
    shadow: ['Si', 'Fe', 'Ti', 'Ne'],
    summary: 'Hadir penuh di realitas fisik saat ini (Se) sambil menimbang nilai personal dan keaslian ekspresi (Fi).',
  },
};

export interface SloanTraitSpec {
  id: 'social' | 'limbic' | 'organized' | 'accommodating' | 'inquisitive';
  traitName: string;
  bigFiveDimension: string;
  highCode: 'S' | 'L' | 'O' | 'A' | 'I';
  highLabel: string;
  highDesc: string;
  lowCode: 'R' | 'C' | 'U' | 'E' | 'N';
  lowLabel: string;
  lowDesc: string;
}

export const SLOAN_DIMENSIONS: SloanTraitSpec[] = [
  {
    id: 'social',
    traitName: 'Extraversion (Ekstraversi Sosial)',
    bigFiveDimension: 'Extraversion',
    highCode: 'S',
    highLabel: 'S — Social',
    highDesc: 'Cenderung berenergi lewat interaksi kelompok, ekspresif secara sosial, dan mudah memulai percakapan.',
    lowCode: 'R',
    lowLabel: 'R — Reserved',
    lowDesc: 'Cenderung lebih tenang di keramaian, nyaman dengan aktivitas mandiri atau lingkaran kecil.',
  },
  {
    id: 'limbic',
    traitName: 'Neuroticism / Reaktivitas Emosional',
    bigFiveDimension: 'Emotional Stability vs Neuroticism',
    highCode: 'L',
    highLabel: 'L — Limbic',
    highDesc: 'Lebih mudah merasakan fluktuasi emosi, kewaspadaan terhadap tekanan, atau kepekaan terhadap stres.',
    lowCode: 'C',
    lowLabel: 'C — Calm',
    lowDesc: 'Relatif tenang saat menghadapi tekanan, cepat pulih emosinya, dan stabil secara afektif.',
  },
  {
    id: 'organized',
    traitName: 'Conscientiousness (Ketertiban & Ketekunan)',
    bigFiveDimension: 'Conscientiousness',
    highCode: 'O',
    highLabel: 'O — Organized',
    highDesc: 'Mengutamakan perencanaan rapi, ketepatan jadwal, disiplin prosedur, dan ketuntasan tugas.',
    lowCode: 'U',
    lowLabel: 'U — Unstructured',
    lowDesc: 'Lebih spontan, fleksibel terhadap perubahan rencana, dan kurang menyukai rutinitas birokratis ketat.',
  },
  {
    id: 'accommodating',
    traitName: 'Agreeableness (Keselarasan Interpersonal)',
    bigFiveDimension: 'Agreeableness',
    highCode: 'A',
    highLabel: 'A — Accommodating',
    highDesc: 'Cenderung kooperatif, menghindari konflik tak perlu, dan mengutamakan keramahan serta empati.',
    lowCode: 'E',
    lowLabel: 'E — Egocentric / Direct',
    lowDesc: 'Cenderung lugas, kompetitif atau menomorsatukan kepentingan objektif di atas persetujuan sosial.',
  },
  {
    id: 'inquisitive',
    traitName: 'Openness to Experience (Keterbukaan Intelektual)',
    bigFiveDimension: 'Openness / Intellect',
    highCode: 'I',
    highLabel: 'I — Inquisitive',
    highDesc: 'Haus rasa ingin tahu, menyukai ide abstrak, eksplorasi estetika, dan sudut pandang baru.',
    lowCode: 'N',
    lowLabel: 'N — Non-Curious / Pragmatic',
    lowDesc: 'Berpijak pada hal konkret yang sudah terbukti praktis daripada spekulasi teoretis jauh.',
  },
];

export const ARCADE_FRAMEWORK_META: {
  id: ArcadeFramework;
  label: string;
  shortDesc: string;
}[] = [
  { id: 'Socionics', label: 'Socionics', shortDesc: 'Model A, Blok Ego/Super-Id, Quadra & 8 Elemen' },
  { id: 'MBTI', label: 'MBTI', shortDesc: 'Dikotomi E/I·S/N·T/F·J/P & Tumpukan 4 Fungsi' },
  { id: 'Jungian', label: 'Tipologi Jung', shortDesc: 'Notasi klasik dominan-sekunder (mis. ET(N))' },
  { id: 'Enneagram', label: 'Enneagram', shortDesc: '9 Motif Inti, Triad & Garis Stres/Pertumbuhan' },
  { id: 'Wings', label: 'Sayap Enneagram', shortDesc: 'Variasi sayap bersebelahan (mis. 3w2 vs 3w4)' },
  { id: 'Instincts', label: 'Varian Insting', shortDesc: 'Fokus perhatian SP, SO, dan SX' },
  { id: 'InstinctualStacking', label: 'Stacking Insting', shortDesc: 'Urutan Dominan / Sekunder / Blind Spot' },
  { id: 'Tritype', label: 'Tritype / Trifix', shortDesc: 'Kombinasi 3 pusat: Heart, Head & Gut' },
  { id: 'Psychosophy', label: 'Psikosofi / AP', shortDesc: 'Sikap 4 Aspek (L·V·E·F) & 24 Tipe' },
  { id: 'SLOAN', label: 'Big Five / SLOAN', shortDesc: 'Kontinum 5 dimensi Global 5 & Notasi Lanjutan [X]xx/X' },
  { id: 'Temperament', label: 'Temperamen', shortDesc: '4 Temperamen Klasik, 6 Campuran & Riset Modern' },
  { id: 'Campuran', label: 'Campuran Lintas Kerangka', shortDesc: 'Gabungan acak seluruh kerangka DYNAMAP' },
];

export const ARCADE_GAME_CATALOG: {
  id: ArcadeGameId;
  title: string;
  tagline: string;
  mechanicLabel: string;
  description: string;
  supportedFrameworks: ArcadeFramework[];
}[] = [
  {
    id: 'match-up',
    title: 'Typology Match-Up',
    tagline: 'Pasangkan konsep, simbol, elemen & definisi yang tepat',
    mechanicLabel: 'Pencocokan Pasangan',
    description: 'Hubungkan pasangan istilah dan makna teoretisnya dari kerangka yang Anda pilih.',
    supportedFrameworks: ['Socionics', 'MBTI', 'Jungian', 'Enneagram', 'Instincts', 'Psychosophy', 'SLOAN', 'Temperament', 'Campuran'],
  },
  {
    id: 'function-builder',
    title: 'Function Builder',
    tagline: 'Susun urutan fungsi kognitif untuk tipe target',
    mechanicLabel: 'Teka-teki Konstruksi',
    description: 'Rakit tumpukan fungsi Socionics Model A (Blok Ego/Super-Ego) atau MBTI 4-fungsi dengan tepat.',
    supportedFrameworks: ['Socionics', 'MBTI', 'Jungian'],
  },
  {
    id: 'detective',
    title: 'Typology Detective',
    tagline: 'Deduksi petunjuk kasus tanpa memaksa kepastian palsu',
    mechanicLabel: 'Analisis Petunjuk & Deduksi',
    description: 'Evaluasi fakta narasi dan pilih interpretasi teoretis yang benar-benar didukung bukti (atau akui ambiguitas).',
    supportedFrameworks: ['Socionics', 'Enneagram', 'Psychosophy', 'Instincts', 'MBTI', 'SLOAN', 'Temperament', 'Campuran'],
  },
  {
    id: 'quadra-sort',
    title: 'Quadra & Category Sort',
    tagline: 'Kelompokkan nilai, ciri & elemen ke kategori yang tepat',
    mechanicLabel: 'Tantangan Klasifikasi',
    description: 'Pilahkan kartu ke Quadra (Alpha/Beta/Gamma/Delta) atau kategori kerangka lain seperti Pusat Triad, Temperamen & SLOAN.',
    supportedFrameworks: ['Socionics', 'Enneagram', 'Psychosophy', 'Instincts', 'SLOAN', 'Temperament'],
  },
  {
    id: 'type-cipher',
    title: 'Type Cipher',
    tagline: 'Tebak kode atau konsep dari 5 petunjuk bertahap',
    mechanicLabel: 'Sandi Petunjuk Progresif',
    description: 'Buka petunjuk satu per satu; semakin cepat Anda menebak dengan sedikit petunjuk, semakin tinggi skor.',
    supportedFrameworks: ['Socionics', 'MBTI', 'Enneagram', 'Psychosophy', 'SLOAN', 'Temperament', 'Campuran'],
  },
  {
    id: 'memory',
    title: 'Typology Memory',
    tagline: 'Buka kartu dan temukan pasangan konsep yang sepadan',
    mechanicLabel: 'Kartu Memori',
    description: 'Latih ingatan visual menghubungkan simbol fungsi, tipe, insting, SLOAN, temperamen, dan definisinya.',
    supportedFrameworks: ['Socionics', 'MBTI', 'Enneagram', 'Psychosophy', 'SLOAN', 'Temperament', 'Campuran'],
  },
  {
    id: 'blitz',
    title: 'Typology Blitz',
    tagline: 'Kuis cepat berbatas waktu dengan penelusuran streak',
    mechanicLabel: 'Trivia Berwaktu',
    description: 'Jawab serangkaian soal acak sesuai kerangka & tingkat kesulitan sebelum penghitung waktu habis.',
    supportedFrameworks: ['Socionics', 'MBTI', 'Jungian', 'Enneagram', 'Wings', 'Instincts', 'InstinctualStacking', 'Tritype', 'Psychosophy', 'SLOAN', 'Temperament', 'Campuran'],
  },
  {
    id: 'reconstruction',
    title: 'Type Reconstruction',
    tagline: 'Pulihkan konfigurasi acak atau rumpang menjadi utuh',
    mechanicLabel: 'Rekonstruksi Struktur',
    description: 'Lengkapi susunan sayap Enneagram, stacking insting, Tritype, urutan LVEF, temperamen campuran, atau dimensi SLOAN.',
    supportedFrameworks: ['Socionics', 'MBTI', 'Wings', 'InstinctualStacking', 'Tritype', 'Psychosophy', 'SLOAN', 'Temperament'],
  },
  {
    id: 'mistype-hunter',
    title: 'Mistype Hunter',
    tagline: 'Temukan kekeliruan konsep atau perbedaan dua tipe mirip',
    mechanicLabel: 'Deteksi Kekeliruan Teori',
    description: 'Identifikasi pernyataan yang menyalahartikan teori (mis. shadow stack vs Model A, humoral kuno, atau notasi SLOAN).',
    supportedFrameworks: ['Socionics', 'MBTI', 'Jungian', 'Enneagram', 'Psychosophy', 'SLOAN', 'Temperament', 'Campuran'],
  },
  {
    id: 'scenario-lens',
    title: 'Scenario Lens',
    tagline: 'Pilih lensa teoretis paling relevan untuk situasi kelas',
    mechanicLabel: 'Interpretasi Skenario',
    description: 'Baca dinamika kelompok SMA dan tentukan mekanisme atau konsep mana yang paling tepat menjelaskannya.',
    supportedFrameworks: ['Socionics', 'MBTI', 'Enneagram', 'InstinctualStacking', 'Psychosophy', 'SLOAN', 'Temperament', 'Campuran'],
  },
  {
    id: 'wheel',
    title: 'Typology Wheel',
    tagline: 'Putar roda acak untuk mendapat tantangan kerangka mendadak',
    mechanicLabel: 'Roda Tantangan Acak',
    description: 'Putar roda peruntungan celestia dan langsung selesaikan misi acak sesuai sektor yang berhenti.',
    supportedFrameworks: ['Campuran', 'Socionics', 'MBTI', 'Enneagram', 'Psychosophy', 'SLOAN', 'Temperament'],
  },
  {
    id: 'escape-room',
    title: 'Typology Escape Room',
    tagline: 'Petualangan 5 ruang teka-teki berurutan lintas kerangka',
    mechanicLabel: 'Ruang Teka-Teki Berantai',
    description: 'Pecahkan 5 kunci berurutan—Pencocokan, Sandi, Rekonstruksi, Deteksi Mistype, dan Deduksi Final.',
    supportedFrameworks: ['Campuran', 'Socionics', 'Enneagram', 'Psychosophy', 'MBTI', 'Temperament'],
  },
];

export interface BlitzQuestion {
  id: string;
  framework: ArcadeFramework;
  difficulty: ArcadeDifficulty;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export const CURATED_BLITZ_QUESTIONS: BlitzQuestion[] = [
  {
    id: 'bq-1',
    framework: 'Socionics',
    difficulty: 'dasar',
    question: 'Dalam Socionics Model A, blok manakah yang berisi fungsi Leading (1) dan Creative (2)?',
    options: ['Blok Super-Ego', 'Blok Ego', 'Blok Super-Id', 'Blok Id'],
    correctIndex: 1,
    explanation: 'Posisi 1 (Leading) dan 2 (Creative) membentuk Blok Ego—area paling disadari, kuat, dan bernilai (valued).',
  },
  {
    id: 'bq-2',
    framework: 'Socionics',
    difficulty: 'menengah',
    question: 'Manakah pasangan elemen informasi yang bernilai (valued) pada Quadra Gamma?',
    options: ['Ne, Ti, Fe, Si', 'Te, Fi, Se, Ni', 'Ti, Fe, Se, Ni', 'Te, Fi, Ne, Si'],
    correctIndex: 1,
    explanation: 'Quadra Gamma menghargai Te, Fi, Se, dan Ni (seperti pada tipe LIE, ESI, SEE, dan ILI).',
  },
  {
    id: 'bq-3',
    framework: 'Socionics',
    difficulty: 'lanjutan',
    question: 'Mengapa kode 3-huruf + p/j pada Socionics (mis. INTj = LII) tidak boleh disamakan mentah-mentah dengan MBTI INTJ?',
    options: [
      'Karena huruf ke-4 Socionics menandai Rasional/Irasional yang merujuk ke fungsi dominan berbeda (LII dominan Ti, MBTI INTJ dominan Ni)',
      'Karena Socionics tidak mengenal fungsi Introvert',
      'Karena MBTI memakai 8 blok Model A secara identik',
      'Karena huruf terakhir tidak berpengaruh pada fungsi dominan',
    ],
    correctIndex: 0,
    explanation: 'LII (INTj) memiliki Ti Leading dan Ne Creative, sedangkan MBTI INTJ memiliki Ni Dominan dan Te Auxiliary.',
  },
  {
    id: 'bq-4',
    framework: 'MBTI',
    difficulty: 'dasar',
    question: 'Tumpukan 4 fungsi sadar untuk tipe MBTI ENFP adalah:',
    options: ['Ne – Fi – Te – Si', 'Fe – Ni – Se – Ti', 'Ne – Ti – Fe – Si', 'Fi – Se – Ni – Te'],
    correctIndex: 0,
    explanation: 'ENFP dipimpin oleh Extraverted Intuition (Ne), dibantu Introverted Feeling (Fi), lalu Te dan Si.',
  },
  {
    id: 'bq-5',
    framework: 'MBTI',
    difficulty: 'menengah',
    question: 'Apa perbedaan utama arah perhatian Ti dibandingkan Te dalam pembahasan teori MBTI/Socionics?',
    options: [
      'Ti menilai konsistensi struktur logis internal; Te menilai efektivitas prosedur dan bukti faktual eksternal',
      'Ti selalu tentang angka matematika; Te selalu tentang seni',
      'Ti berorientasi pada emosi kelompok; Te pada emosi personal',
      'Keduanya identik dalam pengambilan keputusan',
    ],
    correctIndex: 0,
    explanation: 'Ti mencari koherensi prinsip dan definisi internal, sedangkan Te menguji efisiensi kerja dan bukti empiris objektif.',
  },
  {
    id: 'bq-6',
    framework: 'Jungian',
    difficulty: 'dasar',
    question: 'Dalam notasi Tipologi Jung klasik di DYNAMAP, kode "ET(N)" berarti:',
    options: [
      'Extraverted Thinking dominan dengan fungsi pendamping Intuition',
      'Extraverted Feeling dominan dengan Thinking inferior',
      'Introverted Thinking dominan dengan Sensing pendamping',
      'Sama persis dengan kode MBTI ENTJ tanpa perlu klarifikasi',
    ],
    correctIndex: 0,
    explanation: 'Notasi ET(N) membaca dua huruf awal sebagai fungsi dominan (Extraverted Thinking) dan huruf dalam kurung sebagai pendamping (Intuition).',
  },
  {
    id: 'bq-7',
    framework: 'Enneagram',
    difficulty: 'dasar',
    question: 'Tiga tipe mana sajakah yang berada dalam Pusat Kecerdasan Kepala (Head Center / Fear Triad)?',
    options: ['Tipe 2, 3, dan 4', 'Tipe 5, 6, dan 7', 'Tipe 8, 9, dan 1', 'Tipe 1, 3, dan 5'],
    correctIndex: 1,
    explanation: 'Head Center diisi Tipe 5, 6, dan 7 yang fokus pada antisipasi, analisis kepastian, dan rasa aman mental.',
  },
  {
    id: 'bq-8',
    framework: 'Enneagram',
    difficulty: 'menengah',
    question: 'Dalam kerangka Enneagram, Tipe 9 terhubung ke tipe mana pada arah pertumbuhan/integrasi (growth line)?',
    options: ['Tipe 6', 'Tipe 3', 'Tipe 4', 'Tipe 8'],
    correctIndex: 1,
    explanation: 'Pada garis integrasi, Tipe 9 mengambil energi proaktif, fokus tujuan, dan keterlibatan nyata seperti kualitas sehat Tipe 3.',
  },
  {
    id: 'bq-9',
    framework: 'Wings',
    difficulty: 'menengah',
    question: 'Manakah pasangan sayap yang valid secara teoretis untuk Enneagram Tipe 4?',
    options: ['4w2 atau 4w6', '4w3 atau 4w5', '4w1 atau 4w9', '4w5 atau 4w7'],
    correctIndex: 1,
    explanation: 'Sayap selalu berasal dari angka bersebelahan pada lingkaran 1–9; bagi Tipe 4 adalah sayap 3 (4w3) atau 5 (4w5).',
  },
  {
    id: 'bq-10',
    framework: 'Instincts',
    difficulty: 'dasar',
    question: 'Manakah deskripsi yang paling tepat untuk insting Self-Preservation (SP)?',
    options: [
      'Perhatian tinggi pada daya tarik satu-lawan-satu dan intensitas chemistry',
      'Perhatian pada kesehatan, pengelolaan energi pribadi, keamanan praktis, dan kenyamanan dasar',
      'Perhatian penuh pada struktur status kelompok besar',
      'Hanya berkaitan dengan sifat introvert',
    ],
    correctIndex: 1,
    explanation: 'Insting SP berfokus pada keberlanjutan energi, sumber daya pribadi, jadwal istirahat, dan kesiapan praktis sehari-hari.',
  },
  {
    id: 'bq-11',
    framework: 'InstinctualStacking',
    difficulty: 'menengah',
    question: 'Jika seseorang memiliki stacking "SO/SX", insting manakah yang menjadi posisi blind spot (ketiga)?',
    options: ['SO (Social)', 'SX (Sexual)', 'SP (Self-Preservation)', 'Tidak ada blind spot'],
    correctIndex: 2,
    explanation: 'Pada stacking SO/SX, dominan adalah SO, sekunder adalah SX, dan posisi ketiga (kurang diutamakan) adalah SP.',
  },
  {
    id: 'bq-12',
    framework: 'Tritype',
    difficulty: 'menengah',
    question: 'Aturan struktural utama dalam menyusun Tritype / Trifix adalah memilih tepat satu motif dari:',
    options: [
      'Tiga angka acak yang paling disukai',
      'Satu dari Heart (2/3/4), satu dari Head (5/6/7), dan satu dari Gut (8/9/1)',
      'Tiga tipe dari pusat kecerdasan yang sama',
      'Core + kedua sayapnya sekaligus',
    ],
    correctIndex: 1,
    explanation: 'Tritype memetakan kecenderungan dominan dari masing-masing tiga pusat kecerdasan: Heart, Head, dan Gut.',
  },
  {
    id: 'bq-13',
    framework: 'Psychosophy',
    difficulty: 'dasar',
    question: 'Dalam Psikosofi (L·V·E·F), huruf "F" merupakan singkatan dari aspek apa?',
    options: [
      'Feeling (Perasaan emosional)',
      'Physics (Fisika — ranah tubuh, kenyamanan fisik, dan hal material)',
      'Flexibility (Keluwesan sosial)',
      'Future (Proyeksi masa depan)',
    ],
    correctIndex: 1,
    explanation: 'F dalam Psikosofi adalah Physics (Fisika), bukan Feeling. Ranah perasaan dipetakan oleh E (Emotion).',
  },
  {
    id: 'bq-14',
    framework: 'Psychosophy',
    difficulty: 'menengah',
    question: 'Dalam Psikosofi / Attitudinal Psyche, posisi manakah yang bersifat fleksibel, berorientasi proses, serta positif pada diri maupun orang lain (Self+ Others+)?',
    options: ['Posisi 1 (Confident)', 'Posisi 2 (Flexible)', 'Posisi 3 (Insecure)', 'Posisi 4 (Unbothered)'],
    correctIndex: 1,
    explanation: 'Posisi 2 bersifat dialogis, berorientasi proses, percaya diri namun terbuka bertukar pandangan dengan orang lain (Self+, Others+).',
  },
  {
    id: 'bq-15',
    framework: 'SLOAN',
    difficulty: 'dasar',
    question: 'Dalam sistem Big Five / Global 5 SLOAN, huruf "C" pada posisi kedua (L vs C) menunjukkan:',
    options: [
      'Creative (Kreatif)',
      'Calm — kestabilan emosional tinggi & rendah reaktivitas kecemasan',
      'Conscientious — sangat disiplin',
      'Curious — suka hal baru',
    ],
    correctIndex: 1,
    explanation: 'Pada poros kedua SLOAN, L = Limbic (reaktivitas emosional tinggi) dan C = Calm (lebih tenang menghadapi stres).',
  },
  {
    id: 'bq-16',
    framework: 'SLOAN',
    difficulty: 'lanjutan',
    question: 'Mengapa pendekatan Big Five / SLOAN dianggap berbeda secara metodologis dari tipologi diskrit seperti Socionics atau Enneagram?',
    options: [
      'Big Five mengukur kontinum sifat berbasis riset psikometri faktor, sedangkan tipologi adalah kerangka teoretis kualitatif',
      'Big Five melarang perubahan perilaku sepanjang waktu',
      'Tipologi lebih akurat secara klinis daripada Big Five',
      'Keduanya memakai instrumen laboratorium medis yang sama',
    ],
    correctIndex: 0,
    explanation: 'Big Five berasal dari penelitian empiris leksikal/faktor pada kontinum skor, sementara kerangka tipologi adalah peta konsep teoretis.',
  },
  {
    id: 'bq-17',
    framework: 'SLOAN',
    difficulty: 'lanjutan',
    question: 'Dalam notasi komunitas SLOAN lanjutan "[R]CoA/I/", makna tanda kurung siku [R] dan garis miring /I/ adalah:',
    options: [
      '[R] menandai sifat utama/paling menonjol, sedangkan /I/ menandai kecenderungan paling lemah atau ambang sedang',
      '[R] menandai sifat paling lemah dan /I/ sifat paling ekstrem',
      'Keduanya merupakan singkatan resmi dari buku manual klinis NEO PI-R',
      'Garis miring berarti ciri tersebut dihapus dari hasil psikometri',
    ],
    correctIndex: 0,
    explanation: 'Pada konvensi notasi lanjutan komunitas Global 5/SLOAN, [X] menandai sifat paling dominan/tegas, huruf kapital X berarti menonjol, huruf kecil x agak condong, dan /X/ berarti sangat ringan atau nyaris netral.',
  },
  {
    id: 'bq-18',
    framework: 'Temperament',
    difficulty: 'dasar',
    question: 'Dalam empat temperamen klasik Hippocrates-Galen, kombinasi sifat hangat-cepat (reaktivitas tinggi) dan penuh antusiasme sosial secara historis disebut:',
    options: ['Melankolis (Melancholic)', 'Flegmatis (Phlegmatic)', 'Sanguinis (Sanguine)', 'Koleris (Choleric)'],
    correctIndex: 2,
    explanation: 'Sanguinis klasik dicirikan oleh ekspresivitas hangat, antusiasme sosial, dan respons cepat terhadap rangsangan baru.',
  },
  {
    id: 'bq-19',
    framework: 'Temperament',
    difficulty: 'menengah',
    question: 'Apa status ilmiah teori empat cairan tubuh (darah, empedu kuning, empedu hitam, dahak) milik Galen dalam psikologi modern?',
    options: [
      'Masih digunakan sebagai diagnosis medis utama di rumah sakit jiwa',
      'Merupakan model sejarah kuno—psikologi modern meneliti temperamen lewat regulasi emosi & biologis saraf (seperti Kagan, Thomas & Chess, Eysenck)',
      'Identik seratus persen dengan 16 kode Socionics Model A',
      'Hanya berlaku untuk usia di atas 30 tahun',
    ],
    correctIndex: 1,
    explanation: 'Hipotesis empat humor biologis adalah catatan sejarah kuno; riset kontemporer (Kagan, Thomas & Chess, Eysenck) mengkaji reaktivitas saraf, ketekunan, dan goodness-of-fit lingkungan tanpa teori humor darah/empedu.',
  },
  {
    id: 'bq-20',
    framework: 'Temperament',
    difficulty: 'lanjutan',
    question: 'Apa kontribusi utama konsep "Goodness of Fit" oleh Alexander Thomas & Stella Chess (1977) terhadap pemahaman temperamen siswa?',
    options: [
      'Menyatakan temperamen anak tidak bisa berubah sama sekali oleh lingkungan',
      'Menekankan bahwa hasil perkembangan muncul dari keselarasan antara profil temperamen anak dengan tuntutan & dukungan lingkungannya',
      'Membuktikan bahwa Koleris selalu lebih pintar daripada Flegmatis',
      'Menyamakan empat temperamen dengan 4 fungsi Jung',
    ],
    correctIndex: 1,
    explanation: 'Thomas & Chess menunjukkan tidak ada temperamen "baik/buruk" mutlak; adaptasi positif bergantung pada kesesuaian tuntutan kelas dan dukungan sosial terhadap pola temperamen siswa.',
  },
  {
    id: 'bq-21',
    framework: 'MBTI',
    difficulty: 'lanjutan',
    question: 'Perbedaan paling mendasar antara pandangan asli C. G. Jung (1921) dan pemetaan populer MBTI 4-huruf (Briggs & Myers) adalah:',
    options: [
      'Jung menganggap sikap (E/I) dan fungsi sebagai kecenderungan dinamis bukan kotak tipe statis, serta Myers-Briggs menambahkan dikotomi ke-4 (J/P)',
      'Jung menciptakan huruf J dan P pertama kali pada tahun 1921',
      'Myers-Briggs melarang keberadaan tipe Introvert',
      'Tidak ada perbedaan teoretis sama sekali',
    ],
    correctIndex: 0,
    explanation: 'Jung (1921) tidak merumuskan kode 4-huruf maupun huruf J/P; Myers & Briggs menambahkan poros J/P sebagai indikator fungsi ekstrovert agar jenis dominan vs penunjang dapat diidentifikasi.',
  },
];

export interface DetectiveMystery {
  id: string;
  title: string;
  framework: ArcadeFramework;
  difficulty: ArcadeDifficulty;
  narrative: string;
  clues: string[];
  question: string;
  options: { id: string; label: string; supported: boolean; feedback: string }[];
}

export const DETECTIVE_MYSTERIES: DetectiveMystery[] = [
  {
    id: 'det-1',
    title: 'Kasus Rapat Panitia Pensi',
    framework: 'Socionics',
    difficulty: 'menengah',
    narrative:
      'Selama persiapan panggung, Nadia langsung membuat tabel alokasi anggaran dan mengecek apakah alur kerja tiap divisi realistis selesai tepat waktu. Ketika teman satu tim mengkritik bahwa suasananya jadi terlalu kaku dan melupakan perasaan panitia baru, Nadia tampak bingung dan merasa ia sudah bersikap paling membantu.',
    clues: [
      'Fokus spontan pada efisiensi langkah, bukti terukur, dan alokasi sumber daya (indikator Te).',
      'Kebingungan membaca nuansa ketegangan emosional di ruangan saat fokus bekerja.',
      'Belum ada informasi tentang cara Nadia memandang hubungan pribadi jangka panjang vs tradisi fisik.',
    ],
    question: 'Pilih pernyataan analisis yang PALING didukung bukti kasus (tanpa melompat ke kesimpulan tunggal yang belum terbukti):',
    options: [
      {
        id: 'opt-a',
        label: 'Menunjukkan perhatian kuat pada Logika Ekstrovert (Te), namun informasi masih belum cukup untuk memvonis tipe 4-blok Model A secara mutlak.',
        supported: true,
        feedback: 'Tepat! Bukti mendukung fokus pada efisiensi faktual (Te) dan tantangan di iklim sosial, namun penentuan tipe penuh butuh pengamatan lebih luas.',
      },
      {
        id: 'opt-b',
        label: 'Pasti 100% Socionics LIE tanpa keraguan sedikit pun karena setiap orang efisien pasti LIE.',
        supported: false,
        feedback: 'Keliru: LSE, ILI, maupun SLI juga dapat menekankan efisiensi faktual. Bukti tidak cukup untuk memvonis satu tipe.',
      },
      {
        id: 'opt-c',
        label: 'Menunjukkan dominasi Fe yang sangat sensitif pada suasana kelompok.',
        supported: false,
        feedback: 'Bertentangan dengan bukti: justru atmosfer emosional kelompok terlewat olehnya.',
      },
    ],
  },
  {
    id: 'det-2',
    title: 'Misteri Draf Lomba Karya Ilmiah',
    framework: 'Psychosophy',
    difficulty: 'menengah',
    narrative:
      'Dalam diskusi riset, Bima sangat yakin dengan kerangka argumennya sendiri dan langsung merapikan kesimpulan tertulis tanpa panjang lebar berdebat—tetapi ia mudah menjadi defensif dan ragu jika ketua kelompok mendiktekan keputusan jadwal secara sepihak tanpa memberi ruang diskusi setara.',
    clues: [
      'Keyakinan mandiri pada kerangka logika pribadi tanpa butuh banyak perdebatan panjang (ciri Logika berorientasi hasil yang percaya diri / 1L atau nyaman).',
      'Kepekaan khusus terhadap kontrol keputusan sepihak dan otoritas (indikator area sensitif di ranah Kehendak / 3V).',
      'Tidak ada petunjuk tentang sikapnya terhadap kenyamanan fisik atau ekspresi emosi terbuka.',
    ],
    question: 'Interpretasi Psikosofi mana yang paling beralasan dari petunjuk di atas?',
    options: [
      {
        id: 'opt-a',
        label: 'Pola ini selaras dengan hipotesis 1L yang tenang namun tegas pada kesimpulan + kepekaan 3V pada dinamika kendali, sambil mengakui E dan F masih belum terobservasi.',
        supported: true,
        feedback: 'Benar! Hipotesis 1L + 3V sesuai dengan bukti, dan Anda tepat menjaga kehati-hatian karena posisi E dan F belum tampak.',
      },
      {
        id: 'opt-b',
        label: 'Pasti tipe LEFV karena semua peneliti yang ragu pada otoritas adalah 4V.',
        supported: false,
        feedback: 'Kurang akurat: sikap 4V biasanya lebih santai terhadap otoritas, bukan sensitif/defensif seperti 3V.',
      },
      {
        id: 'opt-c',
        label: 'Membuktikan Bima memiliki IQ tertinggi di kelas karena ciri 1L.',
        supported: false,
        feedback: 'Keliru secara teoretis: Psikosofi memetakan sikap subjektif terhadap aspek, bukan mengukur IQ.',
      },
    ],
  },
  {
    id: 'det-3',
    title: 'Tekanan Menjelang Ujian Sekolah',
    framework: 'Enneagram',
    difficulty: 'dasar',
    narrative:
      'Dua minggu sebelum ujian, Raka memeriksa ulang catatan dari tiga sumber berbeda untuk berjaga-jaga kalau ada soal menjebak, lalu bertanya kepada wali kelas apakah rubrik penilaiannya bisa berubah mendadak. Ia ingin memastikan tidak ada skenario risiko yang terlewat.',
    clues: [
      'Mengantisipasi kemungkinan kendala dan ketidakpastian dengan verifikasi berulang.',
      'Mencari kejelasan kepastian aturan dari pihak otoritas yang dipercaya.',
      'Fokus utama pada rasa aman dan kesiapan menghadapi risiko tersembunyi.',
    ],
    question: 'Pusat kecerdasan dan pola motivasi Enneagram mana yang paling tampak sebagai hipotesis awal?',
    options: [
      {
        id: 'opt-a',
        label: 'Ciri Head Center (khususnya tema antisipasi risiko & pencarian kepastian ala Tipe 6 atau sayap 6), namun perlu klarifikasi motivasi pribadi Raka.',
        supported: true,
        feedback: 'Tepat! Pola antisipasi skenario risiko dan pencarian kepastian sejalan dengan tema Head Center / Tipe 6, sambil tetap terbuka terhadap motif lain (mis. kecemasan situasional).',
      },
      {
        id: 'opt-b',
        label: 'Pasti Tipe 8 yang sedang mendorong kendali fisik tanpa keraguan.',
        supported: false,
        feedback: 'Kurang cocok dengan bukti: fokus utamanya bukan menentang otoritas atau kontrol fisik, melainkan mengantisipasi skenario tak terduga.',
      },
      {
        id: 'opt-c',
        label: 'Menunjukkan gangguan klinis obsesif sehingga bukan ranah refleksi.',
        supported: false,
        feedback: 'Terlalu melompat: mempersiapkan ujian dengan teliti bukan diagnosis klinis.',
      },
    ],
  },
  {
    id: 'det-4',
    title: 'Kasus Kerja Kelompok Lintas Gaya',
    framework: 'Campuran',
    difficulty: 'lanjutan',
    narrative:
      'Sinta sangat menjaga kestabilan energi hariannya (selalu memastikan istirahat cukup dan menyiapkan bekal kerja sendiri), jarang memantau obrolan grup kelas yang ramai, tetapi bisa berdiskusi sangat intens dan jujur berdua bersama sahabatnya tentang filosofi film selama dua jam penuh.',
    clues: [
      'Prioritas nyata pada kestabilan energi dan kesiapan diri sendiri.',
      'Keterlibatan mendalam dan intens dalam percakapan satu-lawan-satu.',
      'Perhatian relatif rendah terhadap arus obrolan kelompok besar.',
    ],
    question: 'Kombinasi pembacaan mana yang PALING selaras tanpa menyamaratakan semua kerangka?',
    options: [
      {
        id: 'opt-a',
        label: 'Dalam Enneagram Insting, polanya mirip SP/SX (SO di posisi ketiga) dengan preferensi percakapan terfokus; tidak otomatis membuktikan tipe Socionics atau SLOAN tertentu.',
        supported: true,
        feedback: 'Sangat tepat! Anda membedakan dengan bersih antara bukti fokus insting (SP/SX) tanpa memaksa konversi ke Socionics atau SLOAN.',
      },
      {
        id: 'opt-b',
        label: 'SP/SX otomatis berarti orang itu pasti LII dan RCOAI dalam SLOAN.',
        supported: false,
        feedback: 'Miskonsepsi umum: stacking insting tidak mengunci satu tipe Socionics maupun skor SLOAN tertentu.',
      },
      {
        id: 'opt-c',
        label: 'Karena jarang memantau grup kelas, Sinta pasti tidak peduli pada orang lain.',
        supported: false,
        feedback: 'Keliru: posisi ketiga (SO-blind) hanya menggambarkan prioritas perhatian, bukan ketiadaan empati.',
      },
    ],
  },
  {
    id: 'det-5',
    title: 'Kasus Irama Kerja Dua Ketua Divisi',
    framework: 'Temperament',
    difficulty: 'dasar',
    narrative:
      'Saat simulasi lomba debat antarkelas, Bagus langsung berapi-api menetapkan target menang, membagi strategi serang dalam hitungan menit, dan kurang sabar bila rapat bertele-tele. Sebaliknya, Lutfi tetap bernada tenang, mendengarkan keberatan peserta secara sabar, menjaga ritme tim agar tidak panik, namun cenderung lambat menyetujui perubahan strategi mendadak.',
    clues: [
      'Bagus: tempo cepat, berorientasi keputusan tegas, dan dorongan pencapaian langsung.',
      'Lutfi: tempo stabil, tenang di bawah tekanan, menjaga kestabilan dan kesepakatan tim.',
      'Belum ada data tentang motivasi batin terdalam (Enneagram) atau dimensi keterbukaan ide abstrak (SLOAN I/N).',
    ],
    question: 'Pembacaan kerangka Temperamen manakah yang paling tepat tanpa melampaui bukti?',
    options: [
      {
        id: 'opt-a',
        label: 'Bagus menampilkan ciri klasik kecenderungan Koleris (cepat & berorientasi target), sedangkan Lutfi lebih dekat ke Flegmatis (stabil & menjaga ritme)—dan keduanya saling melengkapi lewat komunikasi.',
        supported: true,
        feedback: 'Tepat! Tempo keputusan dan gaya regulasi emosi keduanya dapat dipahami lewat lensa Temperamen klasik/modern tanpa melabeli mana yang lebih baik.',
      },
      {
        id: 'opt-b',
        label: 'Lutfi pasti lemah kepemimpinannya karena Flegmatis tidak mungkin menjadi pemimpin.',
        supported: false,
        feedback: 'Keliru: kepemimpinan Flegmatis justru kuat dalam menjaga kestabilan konflik dan konsensus tim jangka panjang.',
      },
      {
        id: 'opt-c',
        label: 'Ini membuktikan Bagus kelebihan cairan empedu kuning secara medis.',
        supported: false,
        feedback: 'Keliru: konsep cairan humoral Galen adalah teori kuno yang sudah ditinggalkan oleh ilmu kedokteran modern.',
      },
    ],
  },
];

export interface CipherPuzzle {
  id: string;
  answer: string;
  acceptedAliases: string[];
  framework: ArcadeFramework;
  difficulty: ArcadeDifficulty;
  clues: [string, string, string, string, string];
  explanation: string;
}

export const CIPHER_PUZZLES: CipherPuzzle[] = [
  {
    id: 'cip-1',
    answer: 'LIE',
    acceptedAliases: ['lie', 'entj', 'jack london'],
    framework: 'Socionics',
    difficulty: 'menengah',
    clues: [
      'Berada di Quadra Gamma bersama ESI, SEE, dan ILI.',
      'Fungsi Leading (1) berfokus pada efektivitas faktual dan optimasi proses (Te).',
      'Fungsi Creative (2) membaca lintasan waktu dan proyeksi tren jangka panjang (Ni).',
      'Area kebutuhannya (Suggestive, posisi 5) adalah nilai relasional pribadi (Fi).',
      'Notasi lengkap Socionics 3 hurufnya berakhiran huruf E (Logical-Intuitive Extravert).',
    ],
    explanation: 'LIE (Logical-Intuitive Extravert) memiliki Blok Ego Te + Ni dan Blok Super-Id Fi + Se.',
  },
  {
    id: 'cip-2',
    answer: 'LVEF',
    acceptedAliases: ['lvef', 'einstein'],
    framework: 'Psychosophy',
    difficulty: 'menengah',
    clues: [
      'Termasuk salah satu dari 24 permutasi kode 4 huruf dalam Psikosofi.',
      'Aspek pertama (1) adalah ketegasan kerangka berpikir mandiri (Logika).',
      'Aspek kedua (2) bersifat kolaboratif dan dialogis dalam mengambil keputusan bersama (Volition).',
      'Emosi berada di posisi ke-3 yang berhati-hati dan sensitif terhadap drama terbuka.',
      'Fisika berada di posisi ke-4, membuatnya ringan terhadap detail material. Julukan Afanasyev-nya: "Einstein".',
    ],
    explanation: 'LVEF menempatkan 1L (Confident Logic), 2V (Flexible Volition), 3E (Insecure Emotion), dan 4F (Unbothered Physics).',
  },
  {
    id: 'cip-3',
    answer: 'SX/SO',
    acceptedAliases: ['sx/so', 'sxso', 'sx so'],
    framework: 'InstinctualStacking',
    difficulty: 'dasar',
    clues: [
      'Merupakan salah satu dari 6 kemungkinan urutan varian insting Enneagram.',
      'Insting pertamanya mengutamakan intensitas, resonansi mendalam, dan fokus satu-lawan-satu.',
      'Insting keduanya peka terhadap dinamika komunitas, jaringan sosial, dan peran bersama.',
      'Posisi ketiganya (blind spot) adalah pengelolaan rutinitas fisik dan sumber daya pribadi sehari-hari.',
      'Ditulis dengan format dua kode dua huruf dipisahkan garis miring (mis. XX/YY).',
    ],
    explanation: 'SX/SO menempatkan Sexual/One-to-One sebagai dominan, Social sebagai sekunder, dan Self-Preservation di urutan ketiga.',
  },
  {
    id: 'cip-4',
    answer: 'ALPHA',
    acceptedAliases: ['alpha', 'quadra alpha'],
    framework: 'Socionics',
    difficulty: 'dasar',
    clues: [
      'Merupakan salah satu dari empat Quadra dalam Socionics.',
      'Beranggotakan tipe ILE, SEI, ESE, dan LII.',
      'Menghargai pertukaran gagasan bercabang (Ne) dan konsistensi logis terbuka (Ti).',
      'Juga menghargai kehangatan atmosfer emosional bersama (Fe) dan kenyamanan inderawi (Si).',
      'Sering diasosiasikan dengan warna kuning dalam kode warna DYNAMAP.',
    ],
    explanation: 'Quadra Alpha memadukan elemen valued Ne, Ti, Fe, dan Si.',
  },
  {
    id: 'cip-5',
    answer: 'SCOAI',
    acceptedAliases: ['scoai'],
    framework: 'SLOAN',
    difficulty: 'lanjutan',
    clues: [
      'Merupakan kombinasi 5 huruf dalam model Global 5 / SLOAN (Big Five).',
      'Huruf ke-1: Social (Ekstraversi sosial tinggi).',
      'Huruf ke-2: Calm (Stabilitas emosional tenang di bawah tekanan).',
      'Huruf ke-3: Organized (Terencana, rapi, dan tekun).',
      'Huruf ke-4 & ke-5: Accommodating (kooperatif) dan Inquisitive (rasa ingin tahu tinggi).',
    ],
    explanation: 'SCOAI menggabungkan Social + Calm + Organized + Accommodating + Inquisitive.',
  },
  {
    id: 'cip-6',
    answer: 'SANGUINE',
    acceptedAliases: ['sanguine', 'sanguinis'],
    framework: 'Temperament',
    difficulty: 'dasar',
    clues: [
      'Salah satu dari empat temperamen klasik sejak era Yunani kuno.',
      'Ditandai dengan antusiasme sosial tinggi, cepat hangat, dan mudah memicu semangat kelompok.',
      'Dalam kajian Eysenck, dekat dengan spektrum Extraversion tinggi dengan stabilitas relatif fleksibel.',
      'Sering memerlukan pengingat jadwal rinci karena mudah tertarik oleh banyak ide baru sekaligus.',
      'Namanya berasal dari kata Latin yang secara historis diasosiasikan dengan kegembiraan hangat (8 huruf: S _ _ _ _ _ _ E).',
    ],
    explanation: 'Sanguine (Sanguinis) adalah temperamen klasik berenergi hangat, spontan, dan ekspresif secara sosial.',
  },
  {
    id: 'cip-7',
    answer: 'INFJ',
    acceptedAliases: ['infj'],
    framework: 'MBTI',
    difficulty: 'menengah',
    clues: [
      'Salah satu dari 16 kode kepribadian Myers-Briggs (MBTI).',
      'Huruf J di belakang menandakan fungsi evaluasi ekstrovert (Fe) muncul di posisi kedua (Auxiliary).',
      'Fungsi dominannya bersifat perseptif-introvert yang menyaring pola makna dan lintasan masa depan (Ni).',
      'Fungsi ketiga adalah Ti (koherensi logis pribadi) dan fungsi keempatnya Se (pengalaman inderawi langsung).',
      'Tumpukan sadar lengkapnya: Ni – Fe – Ti – Se.',
    ],
    explanation: 'INFJ memiliki urutan fungsi sadar Ni – Fe – Ti – Se menurut kerangka Myers-Briggs & Grant/Beebe.',
  },
];

export interface MistypeChallenge {
  id: string;
  framework: ArcadeFramework;
  difficulty: ArcadeDifficulty;
  prompt: string;
  statements: { id: string; text: string; isError: boolean; explanation: string }[];
}

export const MISTYPE_CHALLENGES: MistypeChallenge[] = [
  {
    id: 'mis-1',
    framework: 'Psychosophy',
    difficulty: 'dasar',
    prompt: 'Temukan SATU pernyataan yang KELIRU secara teoretis mengenai Psikosofi:',
    statements: [
      {
        id: 's1',
        text: 'Huruf F dalam L·V·E·F merujuk pada aspek Physics (hal material dan kenyamanan fisik).',
        isError: false,
        explanation: 'Benar — F berarti Physics.',
      },
      {
        id: 's2',
        text: 'Siswa dengan posisi 1L otomatis lebih cerdas secara akademik dan nilai ujian dibanding siswa berposisi 4L.',
        isError: true,
        explanation: 'Tepat ditemukan! 1L menunjukkan sikap yakin terhadap kerangka logika pribadi, BUKAN mengukur IQ atau prestasi akademik.',
      },
      {
        id: 's3',
        text: 'Posisi ke-2 menggambarkan aspek yang nyaman diajak berproses dan dialog dua arah.',
        isError: false,
        explanation: 'Benar — 2nd adalah posisi Proses yang fleksibel (Self+ Others+).',
      },
      {
        id: 's4',
        text: 'Kode Psikosofi memiliki 24 permutasi unik dari huruf L, V, E, dan F.',
        isError: false,
        explanation: 'Benar — 4! = 24 tipe.',
      },
    ],
  },
  {
    id: 'mis-2',
    framework: 'Socionics',
    difficulty: 'menengah',
    prompt: 'Identifikasi SATU kesalahpahaman teori yang terdapat di antara pernyataan Socionics berikut:',
    statements: [
      {
        id: 's1',
        text: 'Dalam Model A, fungsi ke-7 dan ke-8 (Blok Id) sebenarnya kuat secara kapasitas, tetapi tidak menjadi nilai sadar utama (subdued).',
        isError: false,
        explanation: 'Benar — Blok Id kuat namun subdued.',
      },
      {
        id: 's2',
        text: 'Jika dua siswa berada di Quadra yang berbeda, mereka secara alami tidak akan pernah bisa bekerja sama dalam kelompok.',
        isError: true,
        explanation: 'Kekeliruan deterministik! Perbedaan Quadra memetakan fokus nilai informasi yang berbeda, tetapi kerja sama tetap sukses lewat komunikasi dan pembagian peran adil.',
      },
      {
        id: 's3',
        text: 'Fungsi ke-5 (Suggestive) dan ke-6 (Mobilizing) termasuk elemen yang dihargai (valued) di Blok Super-Id.',
        isError: false,
        explanation: 'Benar — Blok Super-Id berisi elemen valued yang memberi motivasi.',
      },
      {
        id: 's4',
        text: 'Quadra Delta menghargai Te, Fi, Ne, dan Si.',
        isError: false,
        explanation: 'Benar — Delta (LSE, EII, IEE, SLI) bernilai Te, Fi, Ne, Si.',
      },
    ],
  },
  {
    id: 'mis-3',
    framework: 'Enneagram',
    difficulty: 'menengah',
    prompt: 'Manakah klaim yang SALAH tentang struktur Enneagram, Sayap, dan Tritype?',
    statements: [
      {
        id: 's1',
        text: 'Tritype selalu memadukan satu angka dari Heart (2/3/4), satu dari Head (5/6/7), dan satu dari Gut (8/9/1).',
        isError: false,
        explanation: 'Benar — setiap pusat kecerdasan diwakili satu fix.',
      },
      {
        id: 's2',
        text: 'Seseorang dengan tipe inti 5 dapat memilih sayap 5w2 jika ia sering bersikap ramah kepada teman sekelasnya.',
        isError: true,
        explanation: 'Tepat ditemukan! Sayap harus berasal dari angka bersebelahan pada lingkaran (untuk 5 hanya 5w4 atau 5w6). Sikap ramah tidak membuat sayap melompat ke 2.',
      },
      {
        id: 's3',
        text: 'Garis stres dan pertumbuhan menggambarkan dinamika kecenderungan ketika tertekan vs bertumbuh, bukan perubahan tipe permanen.',
        isError: false,
        explanation: 'Benar — garis arah menunjukkan pergerakan dinamis.',
      },
      {
        id: 's4',
        text: 'Insting SP, SO, dan SX dapat muncul pada semua sembilan tipe inti Enneagram.',
        isError: false,
        explanation: 'Benar — 9 tipe × 3 insting dominan = 27 subtipe insting.',
      },
    ],
  },
  {
    id: 'mis-4',
    framework: 'Campuran',
    difficulty: 'lanjutan',
    prompt: 'Cari SATU kekeliruan konversi silang (cross-framework error) di bawah ini:',
    statements: [
      {
        id: 's1',
        text: 'Notasi Jung ET(N) tidak otomatis dapat diterjemahkan menjadi MBTI ENTJ tanpa memeriksa orientasi fungsi kedua.',
        isError: false,
        explanation: 'Benar — DYNAMAP menjaga batas konversi Jung vs MBTI.',
      },
      {
        id: 's2',
        text: 'Urutan 8 fungsi Model A Socionics sama persis secara posisional dengan 8 fungsi "Shadow Stack" Beebe dalam MBTI.',
        isError: true,
        explanation: 'Tepat! Dalam Socionics Model A posisi 5–6 adalah Super-Id (valued) dan 7–8 adalah Id (subdued), berbeda asumsi dari urutan 5–8 Shadow Beebe.',
      },
      {
        id: 's3',
        text: 'SLOAN mengukur lima spektrum kontinum Big Five, bukan kotak kategori yang saling eksklusif kaku.',
        isError: false,
        explanation: 'Benar — SLOAN merupakan pengkodean spektrum lima faktor.',
      },
      {
        id: 's4',
        text: 'Kode Psikosofi LVEF dapat muncul pada individu dengan latar tipologi Enneagram atau Socionics yang berbeda-beda.',
        isError: false,
        explanation: 'Benar — kerangka bersifat independen secara struktural.',
      },
    ],
  },
  {
    id: 'mis-5',
    framework: 'Temperament',
    difficulty: 'dasar',
    prompt: 'Temukan SATU pernyataan yang KELIRU mengenai sejarah dan sains Temperamen:',
    statements: [
      {
        id: 's1',
        text: 'Dalam penelitian perkembangan Thomas & Chess (1977), kecocokan antara temperamen anak dan tuntutan lingkungan disebut "Goodness of Fit".',
        isError: false,
        explanation: 'Benar — konsep Goodness of Fit berasal dari studi longitudinal Thomas & Chess.',
      },
      {
        id: 's2',
        text: 'Jerome Kagan meneliti reaktivitas biologis bayi (high-reactive vs low-reactive) dalam kajian ilmiah modern tentang temperamen.',
        isError: false,
        explanation: 'Benar — sebagaimana diuraikan Kagan (1994) dalam Galen’s Prophecy.',
      },
      {
        id: 's3',
        text: 'Dokter psikologi modern masih mendiagnosis kepribadian siswa menggunakan pemeriksaan kadar empedu kuning dan darah milik Galen.',
        isError: true,
        explanation: 'Tepat ditemukan! Empat cairan tubuh (humors) adalah metafora medis kuno yang telah dibantah sains modern dan hanya dipelajari sebagai sejarah gagasan.',
      },
      {
        id: 's4',
        text: 'Temperamen campuran (seperti Melankolis-Flegmatis) merupakan model deskriptif tambahan yang memadukan ciri utama dan sekunder.',
        isError: false,
        explanation: 'Benar — klasifikasi campuran dikembangkan belakangan untuk menggambarkan perpaduan dua kecenderungan.',
      },
    ],
  },
  {
    id: 'mis-6',
    framework: 'SLOAN',
    difficulty: 'menengah',
    prompt: 'Cari SATU kekeliruan mengenai sistem kode Big Five / SLOAN berikut:',
    statements: [
      {
        id: 's1',
        text: 'Huruf I dan N pada dimensi kelima SLOAN masing-masing merujuk pada Inquisitive (terbuka pada ide) dan Non-Curious (pragmatis).',
        isError: false,
        explanation: 'Benar — poros ke-5 memetakan Openness to Experience sebagai I vs N.',
      },
      {
        id: 's2',
        text: 'Tanda kurung siku seperti [R] pada notasi lanjutan komunitas menandakan dimensi paling dominan/kuat menurut penafsiran informal.',
        isError: false,
        explanation: 'Benar — konvensi komunitas Global 5 memakai [X] sebagai sorotan sifat utama.',
      },
      {
        id: 's3',
        text: 'Notasi lanjutan "[S]lo/E/i" adalah bagian dari standar psikometri klinis APA yang menggantikan skor angka NEO PI-R secara resmi.',
        isError: true,
        explanation: 'Tepat! Notasi bersimbol seperti [S]lo/E/i adalah konvensi komunitas web non-klinis, bukan instrumen standar resmi NEO PI-R (Costa & McCrae).',
      },
      {
        id: 's4',
        text: 'Terdapat 32 kemungkinan kombinasi dasar 5-huruf dalam notasi standar SLOAN (2⁵ = 32).',
        isError: false,
        explanation: 'Benar — lima poros biner menghasilkan 32 kombinasi dasar.',
      },
    ],
  },
];

export interface ScenarioLensItem {
  id: string;
  framework: ArcadeFramework;
  difficulty: ArcadeDifficulty;
  situation: string;
  question: string;
  options: { id: string; label: string; correct: boolean; explanation: string }[];
}

export const SCENARIO_LENS_ITEMS: ScenarioLensItem[] = [
  {
    id: 'sl-1',
    framework: 'Socionics',
    difficulty: 'dasar',
    situation:
      'Dalam diskusi proyek Biologi, Dito semangat memunculkan lima ide eksperimen alternatif yang berbeda-beda, sementara rekan satu kelompoknya mulai gelisah karena tenggat pengumpulan tinggal dua hari dan belum ada satu rencana langkah pun yang disepakati.',
    question: 'Lensa elemen informasi mana yang paling membantu menjelaskan ketegangan metode diskusi ini?',
    options: [
      {
        id: 'a',
        label: 'Ketegangan antara eksplorasi opsi divergen (Ne) dan kebutuhan kepastian langkah eksekusi terukur (Te/Si)',
        correct: true,
        explanation: 'Tepat! Membingkai situasi sebagai perbedaan prioritas (membuka kemungkinan vs mengunci langkah kerja) membantu tim memberi slot brainstorming 15 menit sebelum memilih eksekusi.',
      },
      {
        id: 'b',
        label: 'Dito pasti tidak bertanggung jawab karena selalu membuang waktu',
        correct: false,
        explanation: 'Itu adalah label menghakimi, bukan lensa analisis konstruktif.',
      },
      {
        id: 'c',
        label: 'Mereka berada di pusat Gut vs Heart Enneagram sehingga harus berganti anggota',
        correct: false,
        explanation: 'Tidak perlu mengganti anggota; perbedaan fokus informasi bisa dijembatani lewat kesepakatan batas waktu.',
      },
    ],
  },
  {
    id: 'sl-2',
    framework: 'Psychosophy',
    difficulty: 'menengah',
    situation:
      'Saat kelas berdebat soal pilihan tempat studi tur, Tari tampak tenang mendengarkan berbagai argumen ilmiah dengan ekspresi antusias, tetapi tiba-tiba terdiam dan menarik diri ketika ada teman yang menyindir kondisi fisiknya yang mudah lelah di perjalanan jauh.',
    question: 'Dari lensa Psikosofi, fenomena sensitivitas mendadak pada area kondisi fisik ini paling mirip dengan:',
    options: [
      {
        id: 'a',
        label: 'Kepekaan posisi rentan di ranah Fisika (3F) yang membutuhkan rasa aman dan penghargaan batas kenyamanan tubuh',
        correct: true,
        explanation: 'Benar! Aspek pada posisi ke-3 cenderung sensitif terhadap komentar atau kritik langsung, berbeda dari ekspresinya yang hangat di ranah lain.',
      },
      {
        id: 'b',
        label: 'Posisi 1F yang sangat percaya diri menghadapi kritik fisik',
        correct: false,
        explanation: 'Posisi 1F umumnya percaya diri dan tidak mudah terluka oleh komentar seputar kenyamanan fisik.',
      },
      {
        id: 'c',
        label: 'Posisi 4L yang menolak berdebat logika',
        correct: false,
        explanation: 'Narasi tidak menunjukkan masalah pada logika, melainkan sensitivitas pada komentar kelelahan fisik.',
      },
    ],
  },
  {
    id: 'sl-3',
    framework: 'InstinctualStacking',
    difficulty: 'menengah',
    situation:
      'Pada malam sebelum pentas seni, Rafi lupa memastikan jadwal makan malam tim dan perlengkapan pribadinya tertinggal di rumah karena ia terlalu sibuk memastikan seluruh anggota panitia merasa terhubung dan posisi peran tiap divisi berjalan harmonis.',
    question: 'Interpretasi urutan insting mana yang paling relevan sebagai refleksi?',
    options: [
      {
        id: 'a',
        label: 'Fokus dominan pada keterhubungan sosial kelompok (SO) disertai kurangnya perhatian pada kebutuhan praktis pribadi (SP di posisi ketiga/blind)',
        correct: true,
        explanation: 'Tepat! Ketika SO mendominasi dan SP berada di posisi bawah, urusan kenyamanan & logistik pribadi mudah terlupakan di tengah kesibukan koordinasi kelompok.',
      },
      {
        id: 'b',
        label: 'Fokus SP dominan karena sangat mengutamakan perlengkapan pribadi',
        correct: false,
        explanation: 'Justru perlengkapan dan jadwal makan pribadinya terabaikan karena prioritas tertuju pada kelompok.',
      },
      {
        id: 'c',
        label: 'SX dominan karena ia memilih mengobrol dengan satu orang saja',
        correct: false,
        explanation: 'Rafi fokus pada seluruh panitia dan keselarasan divisi, yang mencerminkan insting Social (SO).',
      },
    ],
  },
  {
    id: 'sl-4',
    framework: 'Campuran',
    difficulty: 'lanjutan',
    situation:
      'Seorang siswa berprofil LIE (Socionics) merasa sangat nyaman memimpin proyek teknologi terstruktur, tetapi mengaku sangat cemas setiap kali harus berbicara spontan di depan kelas tanpa catatan lengkap.',
    question: 'Sikap ilmiah dan etis terbaik menurut prinsip DYNAMAP terhadap kondisi ini adalah:',
    options: [
      {
        id: 'a',
        label: 'Memahami bahwa kecemasan bicara publik dipengaruhi pengalaman, latihan, serta mungkin preferensi kestabilan emosi (seperti dimensi Big Five/konteks)—tanpa menganggap kode LIE memaksa seseorang harus kebal gugup.',
        correct: true,
        explanation: 'Tepat! Kode tipologi tidak menentukan tingkat kecemasan sosial seseorang; latihan bertahap dan faktor situasi nyata sangat berperan.',
      },
      {
        id: 'b',
        label: 'Menyatakan bahwa ia pasti salah ketik tipe karena seorang ekstravert Socionics mustahil merasa gugup',
        correct: false,
        explanation: 'Ekstraversi dalam Socionics merujuk pada fokus elemen objek eksternal, bukan kekebalan terhadap kecemasan panggung.',
      },
      {
        id: 'c',
        label: 'Menyarankannya menghindari semua presentasi selamanya',
        correct: false,
        explanation: 'Membatasi diri berdasarkan label bertentangan dengan prinsip pertumbuhan DYNAMAP.',
      },
    ],
  },
  {
    id: 'sl-5',
    framework: 'Temperament',
    difficulty: 'dasar',
    situation:
      'Dalam tim jurnalistik sekolah, Mira (yang berirama Melankolis-Sanguinis) bersemangat memunculkan tema majalah yang menyentuh hati dan estetik, namun cepat merasa kelelahan emosional ketika revisi naskah menumpuk mepet tenggat. Rekan kerjanya, Darel, tidak terlalu ekspresif memuji ide Mira, tetapi tenang membereskan tata letak satu per satu sampai tuntas.',
    question: 'Strategi kolaborasi berbasis pemahaman Temperamen manakah yang paling sehat diterapkan?',
    options: [
      {
        id: 'a',
        label: 'Memanfaatkan ritme cepat kreatif Mira di awal perencanaan sembari memberi batas waktu jeda sebelum tenggat, lalu menyandingkannya dengan konsistensi eksekusi bertahap Darel.',
        correct: true,
        explanation: 'Tepat! Memahami perbedaan reaktivitas dan ritme ketahanan emosi memungkinkan pembagian fase kerja yang adil tanpa menyalahkan karakter pribadi.',
      },
      {
        id: 'b',
        label: 'Meminta Mira berubah total menjadi tanpa emosi agar bisa bekerja seperti Darel',
        correct: false,
        explanation: 'Memaksa seseorang meninggalkan ritme alaminya justru mempercepat kelelahan (burnout).',
      },
      {
        id: 'c',
        label: 'Mengeluarkan Darel karena kurang bersemangat saat sesi brainstorming awal',
        correct: false,
        explanation: 'Ketenangan Darel justru menjadi penyeimbang berharga pada tahap eksekusi produksi.',
      },
    ],
  },
];

export interface EscapeRoomStage {
  stageNumber: 1 | 2 | 3 | 4 | 5;
  chamberTitle: string;
  mechanicLabel: string;
  storyPrompt: string;
  puzzleType: 'choice' | 'sequence' | 'cipher';
  question: string;
  options?: string[];
  correctAnswer: string;
  sequenceItems?: string[];
  correctSequence?: string[];
  hint: string;
  unlockMessage: string;
}

export const ESCAPE_ROOM_STAGES: EscapeRoomStage[] = [
  {
    stageNumber: 1,
    chamberTitle: 'Ruang I — Gerbang Model A',
    mechanicLabel: 'Pencocokan Blok Ego',
    storyPrompt:
      'Pintu pertama berukir empat elemen Quadra Alpha (Ne, Ti, Fe, Si). Anda menemukan catatan: "Penjaga gerbang adalah tipe ILE (Eksplorator Konseptual)."',
    puzzleType: 'choice',
    question: 'Pilih pasangan Blok Ego (Leading + Creative) yang tepat untuk membuka segel ILE:',
    options: ['Ne + Ti', 'Ti + Ne', 'Fe + Si', 'Te + Ni'],
    correctAnswer: 'Ne + Ti',
    hint: 'ILE adalah Intuitive-Logical Extravert: Leading-nya berorientasi kemungkinan (Ne), lalu didukung struktur logis (Ti).',
    unlockMessage: 'Segel Gerbang Model A terbuka! Cahaya kobalt menerangi lorong kedua.',
  },
  {
    stageNumber: 2,
    chamberTitle: 'Ruang II — Menara Enneagram',
    mechanicLabel: 'Sandi Tiga Pusat',
    storyPrompt:
      'Di meja astronomi terdapat mekanisme tiga roda: Heart (2/3/4), Head (5/6/7), dan Gut (8/9/1). Kertas petunjuk bertuliskan: "Intinya mencari integritas yang benar, hatinya menghargai keaslian batin unik, pikirannya cermat mencari rasa aman dan kepastian."',
    puzzleType: 'cipher',
    question: 'Ketik kode Tritype 3 digit (urutan inti Gut-terlebih-dahulu atau angka tanpa spasi, contoh 146):',
    options: ['146', '1-4-6', '164'],
    correctAnswer: '146',
    hint: 'Integritas prinsip = 1 (Gut), keaslian batin unik = 4 (Heart), kepastian & antisipasi = 6 (Head).',
    unlockMessage: 'Tiga roda berputar selaras pada kode 146! Pintu menuju ruang Psikosofi terbuka.',
  },
  {
    stageNumber: 3,
    chamberTitle: 'Ruang III — Ruang L·V·E·F',
    mechanicLabel: 'Rekonstruksi Hierarki',
    storyPrompt:
      'Empat kristal berlabel L, V, E, dan F harus disusun dari Posisi 1 hingga Posisi 4 sesuai catatan penjaga arsip: "Ia teguh pada kesimpulan logis (1), sensitif bila kehendaknya ditekan sepihak (3), ringan menghadapi kenyamanan materi (4), serta hangat dan dialogis dalam ekspresi perasaan (2)."',
    puzzleType: 'sequence',
    question: 'Klik kartu sesuai urutan Posisi 1 → 2 → 3 → 4 untuk menyusun kode 4 huruf yang tepat:',
    sequenceItems: ['F', 'V', 'L', 'E'],
    correctSequence: ['L', 'E', 'V', 'F'],
    correctAnswer: 'LEVF',
    hint: 'Posisi 1 = L, Posisi 2 = E (hangat dialogis), Posisi 3 = V (sensitif tekanan), Posisi 4 = F (ringan materi).',
    unlockMessage: 'Kristal tersusun membentuk kode LEVF ("Pascal")! Anda memasuki Ruang IV.',
  },
  {
    stageNumber: 4,
    chamberTitle: 'Ruang IV — Ruang Deteksi Mistype',
    mechanicLabel: 'Identifikasi Kekeliruan',
    storyPrompt:
      'Sebuah prasasti tua berisi empat klaim teori. Hanya dengan menunjuk SATU klaim yang sesatlah mekanisme kunci keempat akan terlepas.',
    puzzleType: 'choice',
    question: 'Pilih klaim yang KELIRU untuk membongkar jebakan ruang keempat:',
    options: [
      'Notasi Jung ET(N) tidak otomatis dikonversi menjadi ENTJ tanpa meninjau orientasi fungsi pendamping',
      'Siswa 4L tidak mungkin memahami pelajaran Fisika karena posisinya rendah di Logika',
      'Dimensi Big Five / SLOAN memetakan kecenderungan kontinum, bukan tipe mutlak',
      'Insting SO-blind tetap bisa bersikap ramah dalam interaksi satu-lawan-satu',
    ],
    correctAnswer: 'Siswa 4L tidak mungkin memahami pelajaran Fisika karena posisinya rendah di Logika',
    hint: 'Ingat prinsip non-ekuivalensi Psikosofi: posisi ke-4 bukan ketidakmampuan intelektual atau akademik!',
    unlockMessage: 'Prasasti keliru runtuh! Anda kini berdiri di depan Gerbang Terakhir.',
  },
  {
    stageNumber: 5,
    chamberTitle: 'Ruang V — Gerbang Bintang Utama',
    mechanicLabel: 'Sintesis Akhir Multi-Kerangka',
    storyPrompt:
      'Kunci terakhir menuntut kebijaksanaan DYNAMAP: seorang siswa tercatat berkode LIE, 3w2, LVEF, dan minat tinggi pada Psikologi serta Desain Komunikasi Visual meski paket mapel SMA-nya adalah Fisika, Kimia, Matematika Lanjut, dan Ekonomi.',
    puzzleType: 'choice',
    question: 'Keputusan manakah yang paling tepat menurut filosofi ilmiah & eksplorasi DYNAMAP?',
    options: [
      'Melarangnya mendaftar Psikologi karena LIE adalah pemikir logis dan tidak mengambil Biologi/Sosiologi',
      'Memisahkan minat personal, kesiapan materi jembatan, dan syarat formal SNBP/SNBT sehingga ia tetap bebas mengeksplorasi Psikologi maupun DKV',
      'Mengharuskan tes ulang sampai ia berubah menjadi tipe Etika (Fe/Fi)',
      'Menyimpulkan kecocokan kariernya pasti 94% hanya di bidang Akuntansi',
    ],
    correctAnswer: 'Memisahkan minat personal, kesiapan materi jembatan, dan syarat formal SNBP/SNBT sehingga ia tetap bebas mengeksplorasi Psikologi maupun DKV',
    hint: 'Ingat filosofi inti DYNAMAP: paket mapel SMA dan tipologi tidak pernah membatasi hak eksplorasi bidang ilmu.',
    unlockMessage: 'Seluruh 5 ruang berhasil ditaklukkan! Pintu utama Observatorium DYNAMAP terbuka penuh.',
  },
];

export type CaseStudyCategory =
  | 'Fictional character analysis'
  | 'Hypothetical personality cases'
  | 'Decision-making scenarios'
  | 'Communication scenarios'
  | 'Theory comparison cases'
  | 'Multi-framework cases';

export interface CaseStudyDefinition {
  id: string;
  title: string;
  category: CaseStudyCategory;
  categoryIndo: string;
  difficulty: ArcadeDifficulty;
  frameworksRelevant: string[];
  narrative: string;
  evidenceItems: { id: string; text: string; type: 'observed' | 'ambiguous' }[];
  interpretations: {
    id: string;
    framework: string;
    label: string;
    plausibility: 'Didukung Bukti' | 'Kemungkinan Alternatif' | 'Kurang Didukung';
    analysis: string;
  }[];
  missingInfoNotes: string[];
  guidingSynthesis: string;
  linkedConcepts: string[];
}

export const CASE_STUDIES_CATALOG: CaseStudyDefinition[] = [
  {
    id: 'cs-01',
    title: 'Tokoh Fiktif "Arsen": Arsitek Menara Jam yang Terobsesi Ketepatan Waktu',
    category: 'Fictional character analysis',
    categoryIndo: 'Analisis Tokoh Fiktif',
    difficulty: 'menengah',
    frameworksRelevant: ['Socionics', 'Enneagram', 'Psikosofi'],
    narrative:
      'Dalam novel fiksi "Kota Lonceng", Arsen adalah perancang sistem lonceng kota. Ia menyusun ulang jadwal perawatan mesin berdasarkan perhitungan efisiensi suku cadang (bukan tradisi lama), sangat menghargai asisten yang jujur secara personal meski pendiam, dan menolak pesta perayaan megah. Namun, ketika asistennya mengubah rencana tanpa berunding, Arsen tampak gelisah bukan karena takut aturan dilanggar, melainkan karena khawatir kerja kerasnya tidak akan meninggalkan hasil yang diakui.',
    evidenceItems: [
      { id: 'ev-1', text: 'Mengoptimalkan efisiensi kerja dan perawatan berbasis perhitungan faktual (indikasi Te).', type: 'observed' },
      { id: 'ev-2', text: 'Menghargai ketulusan hubungan personal 1-on-1 daripada keramaian formal (selaras Fi/SP).', type: 'observed' },
      { id: 'ev-3', text: 'Motivasi sensitif terhadap pengakuan nilai hasil kerja kerasnya.', type: 'observed' },
      { id: 'ev-4', text: 'Belum diketahui apakah ia memproses visi waktu jangka panjang (Ni) atau detail kenyamanan fisik (Si).', type: 'ambiguous' },
    ],
    interpretations: [
      {
        id: 'int-1',
        framework: 'Socionics',
        label: 'Hipotesis Quadra Gamma/Delta berbasis nilai Te + Fi (mis. LIE, SLI, atau LSE)',
        plausibility: 'Didukung Bukti',
        analysis: 'Fokus pada efisiensi objektif (Te) dipadukan penghargaan pada ketulusan personal (Fi) dan ketidaknyamanan pada atmosfer pesta ramai (Fe subdued) mengarah kuat pada poros Te/Fi.',
      },
      {
        id: 'int-2',
        framework: 'Enneagram',
        label: 'Motif campuran kompetensi & pengakuan hasil (kemungkinan Tipe 3 atau Tipe 1 dengan fix 3)',
        plausibility: 'Kemungkinan Alternatif',
        analysis: 'Kekhawatiran bahwa hasil kerja kerasnya tidak diakui bisa menandakan motif Heart (3) di balik tampilan serba rapi, atau perpaduan Core 1 dengan 3-fix.',
      },
      {
        id: 'int-3',
        framework: 'Psikosofi',
        label: 'Memvonis pasti tipe VFLE tanpa data sikap Emosi/Fisika',
        plausibility: 'Kurang Didukung',
        analysis: 'Belum ada cukup bukti mengenai bagaimana Arsen menyikapi kebutuhan fisik atau sensitivitas posisi 3 secara menyeluruh.',
      },
    ],
    missingInfoNotes: [
      'Bagaimana reaksi Arsen saat menghadapi krisis mendadak vs perencanaan jangka panjang (Ni vs Si)?',
      'Apakah motivasinya lebih didorong ketakutan akan ketidaksempurnaan moral (Tipe 1) atau takut dianggap tidak bernilai/gagal (Tipe 3)?',
    ],
    guidingSynthesis:
      'Analisis tokoh fiktif yang baik mengakui bahwa satu perilaku luar (disiplin & fokus efisiensi) dapat muncul dari lebih dari satu kombinasi tipe. Poros Te–Fi tampak kuat, sedangkan pembedaan LIE vs LSE/SLI dan Enneagram 1 vs 3 tetap dibuka sebagai hipotesis alternatif.',
    linkedConcepts: ['Te (Logika Ekstravert)', 'Fi (Etika Introvert)', 'Quadra Gamma vs Delta', 'Motif Tipe 1 vs 3'],
  },
  {
    id: 'cs-02',
    title: 'Kasus Hipotetis "Kania": Siswa IPS dengan Minat Astronomi & Sistem Sosial',
    category: 'Hypothetical personality cases',
    categoryIndo: 'Kasus Kepribadian Hipotetis',
    difficulty: 'dasar',
    frameworksRelevant: ['MBTI / Jungian', 'SLOAN', 'Enneagram'],
    narrative:
      'Kania berada di kelas peminatan Sosial-Humaniora, namun sepulang sekolah ia rutin membaca buku astrofisika populer dan mencatat peta konsep tentang bagaimana sejarah sains berkembang. Di kelas, ia tenang, tidak suka konflik terbuka, cenderung menunda tugas administratif yang berulang, tetapi selalu menjadi tempat teman-teman bertanya ketika mereka mencari sudut pandang baru yang menghubungkan topik berbeda.',
    evidenceItems: [
      { id: 'ev-1', text: 'Rasa ingin tahu lintas disiplin tinggi & suka peta konsep abstrak (Openness / I pada SLOAN, serta indikasi Intuisi).', type: 'observed' },
      { id: 'ev-2', text: 'Tenang di forum besar & menghindari konflik terbuka (Reserved / Accommodating).', type: 'observed' },
      { id: 'ev-3', text: 'Menunda tugas administratif repetitif (Unstructured / lebih eksploratif).', type: 'observed' },
      { id: 'ev-4', text: 'Tidak ada bukti apakah ia menilai argumen lewat Ti (konsistensi logis) atau Fi (nilai personal).', type: 'ambiguous' },
    ],
    interpretations: [
      {
        id: 'int-1',
        framework: 'SLOAN',
        label: 'Profil kontinum mengarah pada R (Reserved) · A (Accommodating) · U (Unstructured) · I (Inquisitive)',
        plausibility: 'Didukung Bukti',
        analysis: 'Data perilaku cukup eksplisit menunjukkan ketenangan sosial (R), keterbukaan intelektual tinggi (I), fleksibilitas jadwal (U), dan keharmonisan (A).',
      },
      {
        id: 'int-2',
        framework: 'MBTI / Jungian',
        label: 'Antara INTP (Ti–Ne) atau INFP (Fi–Ne) — keduanya sama-sama eksploratif secara konseptual',
        plausibility: 'Kemungkinan Alternatif',
        analysis: 'Karena alasan batin saat mengevaluasi gagasan (Ti vs Fi) belum terungkap, tidak bijak memaksakan salah satunya secara sepihak.',
      },
    ],
    missingInfoNotes: [
      'Bagaimana Kania mengambil keputusan penting: lebih memakai koherensi logis netral atau keselarasan nilai personal?',
      'Bagaimana respons emosionalnya saat menghadapi tekanan tinggi (poros Limbic vs Calm)?',
    ],
    guidingSynthesis:
      'Dalam kasus ini, pengamatan SLOAN relatif jelas pada 4 dari 5 dimensi, sementara klasifikasi tipologi diskrit (INTP vs INFP) tetap membutuhkan klarifikasi proses evaluasi internal.',
    linkedConcepts: ['Global 5 SLOAN', 'Ti vs Fi', 'Intuisi Eksploratif (Ne)', 'Prinsip Ketidakpastian'],
  },
  {
    id: 'cs-03',
    title: 'Dilema Keputusan Pemilihan Ketua Ekstrakurikuler Riset',
    category: 'Decision-making scenarios',
    categoryIndo: 'Skenario Pengambilan Keputusan',
    difficulty: 'menengah',
    frameworksRelevant: ['Socionics', 'Psikosofi', 'Enneagram'],
    narrative:
      'Dua kandidat mencalonkan diri: Kandidat A menyusun proposal sangat rinci dengan linimasa terukur, namun tampak mudah tersinggung saat ada anggota muda yang mempertanyakan otoritas keputusannya. Kandidat B jarang memaksa suara di rapat, lebih suka membangun konsensus antaranggota, tetapi sempat kewalahan ketika harus mengambil keputusan darurat dalam 5 menit.',
    evidenceItems: [
      { id: 'ev-1', text: 'Kandidat A kuat di perencanaan operasional, sensitif terhadap tantangan atas kehendak/otoritasnya.', type: 'observed' },
      { id: 'ev-2', text: 'Kandidat B mengutamakan kesepakatan relasional bersama, namun ragu saat tekanan waktu mendadak.', type: 'observed' },
      { id: 'ev-3', text: 'Pengalaman kepemimpinan sebelumnya & beban jadwal pribadi keduanya tidak disebutkan.', type: 'ambiguous' },
    ],
    interpretations: [
      {
        id: 'int-1',
        framework: 'Psikosofi',
        label: 'Dinamika sikap Volition berbeda (kepekaan 3V pada tantangan vs keengganan mengambil kontrol sepihak pada 4V/2V)',
        plausibility: 'Didukung Bukti',
        analysis: 'Membantu pembina melihat bahwa sensitivitas pada otoritas bisa ditopang dengan aturan musyawarah yang jelas, bukan sekadar menilai "A galak" atau "B lemah".',
      },
      {
        id: 'int-2',
        framework: 'Etika DYNAMAP',
        label: 'Keputusan pemilihan harus berdasarkan program kerja, rekam jejak, dan pembagian peran (Ketua + Wakil), BUKAN melabeli kelayakan dari kode tipe',
        plausibility: 'Didukung Bukti',
        analysis: 'Tipologi menjelaskan perbedaan gaya koordinasi yang saling melengkapi—misal memadukan kekuatan perencanaan dengan fasilitator musyawarah.',
      },
    ],
    missingInfoNotes: [
      'Bagaimana rekam jejak penyelesaian konflik nyata kedua kandidat di semester sebelumnya?',
      'Apakah kecanggungan Kandidat B saat darurat hanya karena belum pernah dilatih simulasi krisis?',
    ],
    guidingSynthesis:
      'Kerangka kepribadian dapat memetakan titik dukungan yang dibutuhkan setiap gaya kepemimpinan (latihan menerima kritik bagi A, latihan keputusan cepat terstruktur bagi B), tanpa pernah menjadi alat diskriminasi pemilihan.',
    linkedConcepts: ['Volition (V) dalam Psikosofi', 'Etika Non-Determinisme', 'Keputusan Berbasis Bukti'],
  },
  {
    id: 'cs-04',
    title: 'Kesalahpahaman di Grup Proyek Akhir: "Mengapa Pesanku Hanya Dibalas Singkat?"',
    category: 'Communication scenarios',
    categoryIndo: 'Skenario Komunikasi',
    difficulty: 'dasar',
    frameworksRelevant: ['Socionics', 'Instincts', 'Psikosofi'],
    narrative:
      'Nayla mengirim paragraf panjang berisi curahan kekhawatiran tentang kualitas presentasi beserta tiga ide perbaikan visual. Lima belas menit kemudian, Fajar membalas singkat: "Oke, slide 3–5 aku rapikan malam ini." Nayla merasa usahanya tidak dihargai dan menganggap Fajar dingin; padahal Fajar merasa langsung menindaklanjuti hal konkret adalah bentuk dukungan terbaik.',
    evidenceItems: [
      { id: 'ev-1', text: 'Nayla menggabungkan ekspresi kekhawatiran emosional dengan usulan perbaikan.', type: 'observed' },
      { id: 'ev-2', text: 'Fajar merespons langsung ke tindakan pragmatis tanpa mengomentari nada perasaan.', type: 'observed' },
      { id: 'ev-3', text: 'Fajar mungkin sedang terburu-buru di sela kegiatan lain (faktor situasional).', type: 'ambiguous' },
    ],
    interpretations: [
      {
        id: 'int-1',
        framework: 'Socionics',
        label: 'Kesenjangan respons: kebutuhan resonansi atmosfer/validasi (Fe/Fi) bertemu gaya tindak lanjut pragmatis langsung (Te)',
        plausibility: 'Didukung Bukti',
        analysis: 'Nayla menafsirkan keringnya balasan sebagai jarak emosional, padahal Fajar bermaksud menunjukkan kepedulian melalui aksi langsung.',
      },
      {
        id: 'int-2',
        framework: 'Faktor Situasional',
        label: 'Keterbatasan waktu saat membalas di ponsel & gaya komunikasi teks asinkron',
        plausibility: 'Kemungkinan Alternatif',
        analysis: 'Pesan teks tanpa intonasi suara sangat rentan disalahpahami terlepas dari tipe apa pun.',
      },
    ],
    missingInfoNotes: [
      'Bagaimana interaksi keduanya saat berbicara tatap muka dibanding lewat pesan teks?',
      'Apakah ada kesepakatan cara memberi feedback di awal proyek?',
    ],
    guidingSynthesis:
      'Solusi praktisnya sederhana: Fajar cukup menambahkan satu kalimat pengakuan ("Terima kasih idenya jelas banget, slide 3–5 aku rapikan malam ini"), dan Nayla mengecek klarifikasi sebelum menyimpulkan penolakan.',
    linkedConcepts: ['Te vs Fe dalam Komunikasi', 'Fakta vs Asumsi Teks', 'Perbaikan Dialog'],
  },
  {
    id: 'cs-05',
    title: 'Komparasi Teori: Mengapa "Introvert" di Socionics, MBTI, dan Big Five Bisa Berbeda?',
    category: 'Theory comparison cases',
    categoryIndo: 'Kasus Perbandingan Teori',
    difficulty: 'lanjutan',
    frameworksRelevant: ['Socionics', 'MBTI', 'SLOAN', 'Jungian'],
    narrative:
      'Seorang siswa bernama Gilang sangat ramah berbicara dengan banyak teman di kantin, tetapi menurut kerangka Jung/Socionics ia tercatat sebagai LII (Introverted Logical) / IT(N), sementara di pengamatan skala sosial SLOAN ia cenderung berada di tengah-tengah agak Reserved atau bahkan sedikit Social (S). Hal ini membuat teman-temannya bingung: "Katanya introvert, kok suka mengobrol?"',
    evidenceItems: [
      { id: 'ev-1', text: 'Definisi Introvert dalam Jung/Socionics = arah fokus fungsi dominan ke struktur internal/subjek (Ti), bukan pemalu.', type: 'observed' },
      { id: 'ev-2', text: 'Definisi Social (S) pada Big Five/SLOAN = frekuensi dan kenyamanan interaksi sosial di lingkungan luar.', type: 'observed' },
    ],
    interpretations: [
      {
        id: 'int-1',
        framework: 'Komparasi Lintas Kerangka',
        label: 'Introversi kognitif (arah pemrosesan Ti) berbeda dari introversi sosial (tingkat aktivitas pergaulan pada Big Five)',
        plausibility: 'Didukung Bukti',
        analysis: 'Seseorang bisa memproses argumen dari kerangka logika internalnya (Ti-leading) sambil tetap senang bertukar pikiran hangat dengan teman sekelas.',
      },
      {
        id: 'int-2',
        framework: 'Miskonsepsi Populer',
        label: 'Menganggap semua tipe berkode I wajib pendiam dan tidak pernah menikmati diskusi ramai',
        plausibility: 'Kurang Didukung',
        analysis: 'Ini mencampuradukkan istilah teknis Jungian dengan stereotip perilaku sosial sehari-hari.',
      },
    ],
    missingInfoNotes: [
      'Di situasi mana Gilang merasa energinya pulih kembali setelah seharian beraktivitas?',
    ],
    guidingSynthesis:
      'Membandingkan definisi dasar tiap kerangka mencegah kesalahpahaman bahwa dua sistem yang memakai kata serupa ("introvert") sedang mengukur hal yang persis sama.',
    linkedConcepts: ['Introversi Kognitif vs Sosial', 'Jungian vs Big Five', 'LII (Ti-Ne)'],
  },
  {
    id: 'cs-06',
    title: 'Sintesis Multi-Kerangka: Profil "Hana" — Antara Perfeksionisme, Kepekaan Emosi & Cita-Cita Bioteknologi',
    category: 'Multi-framework cases',
    categoryIndo: 'Kasus Multi-Kerangka',
    difficulty: 'lanjutan',
    frameworksRelevant: ['Socionics', 'Enneagram', 'Psikosofi', 'SLOAN'],
    narrative:
      'Hana dikenal teliti menyusun laporan praktikum (O tinggi pada SLOAN), memiliki dorongan kuat menjaga standar mutu moral dan kerapian (indikasi Enneagram 1 atau sayap 1), namun di saat bersamaan ia sangat ekspresif saat membahas isu lingkungan bersama sahabatnya dan cepat merasa tertekan bila suasana kelompok sedang tidak harmonis. Dalam Psikosofi ia masih menandai kode ELVF sebagai dugaan provisional.',
    evidenceItems: [
      { id: 'ev-1', text: 'Ketelitian tinggi & standar mutu jelas (Organized + tema Enneagram 1).', type: 'observed' },
      { id: 'ev-2', text: 'Ekspresivitas emosional hangat pada isu bermakna (kemungkinan 1E/2E atau Fe valued).', type: 'observed' },
      { id: 'ev-3', text: 'Kode ELVF berstatus provisional karena belum yakin antara posisi 1E vs 2E dan 2L vs 1L.', type: 'ambiguous' },
    ],
    interpretations: [
      {
        id: 'int-1',
        framework: 'Multi-Kerangka Terpisah',
        label: 'Setiap kerangka memotret lapisan berbeda: keteraturan kerja (SLOAN O), motivasi integritas (Enneagram 1), dan sikap ekspresi (Provisional Psikosofi)',
        plausibility: 'Didukung Bukti',
        analysis: 'Tidak ada kontradiksi antara menjadi teliti secara ilmiah sekaligus hangat secara emosional; masing-masing sistem memberi bahasa refleksi yang saling melengkapi tanpa harus dipaksa seragam.',
      },
      {
        id: 'int-2',
        framework: 'Reduksionisme Akademik',
        label: 'Menyimpulkan bahwa karena ia ekspresif secara emosional maka ia kurang cocok di bidang Bioteknologi laboratorium',
        plausibility: 'Kurang Didukung',
        analysis: 'Sesuai filosofi DYNAMAP, ekspresivitas emosional justru dapat menjadi kekuatan komunikasi sains, advokasi lingkungan, maupun kerja tim riset Bioteknologi.',
      },
    ],
    missingInfoNotes: [
      'Bagaimana Hana mengevaluasi kritik atas argumen logis vs kritik atas cara penyampaian emosional?',
      'Apakah rasa tertekan saat konflik berasal dari rasa tanggung jawab berlebih atau takut relasi retak?',
    ],
    guidingSynthesis:
      'Kasus multi-kerangka yang sehat menghormati status provisional, memisahkan dimensi psikometrik (keteraturan/O) dari motivasi nilai (Enneagram) serta dinamika komunikasi, sambil tetap membuka eksplorasi lintas karier sains.',
    linkedConcepts: ['Status Provisional', 'Integrasi Multi-Kerangka', 'Non-Pembatasan Karier'],
  },
  {
    id: 'cs-07',
    title: 'Perbandingan Model MBTI: Mengapa Siswa P-Dominant Sering Salah Dikira Tipe "J" di Sekolah?',
    category: 'Theory comparison cases',
    categoryIndo: 'Kasus Perbandingan Teori',
    difficulty: 'menengah',
    frameworksRelevant: ['MBTI / Jungian', 'SLOAN', 'Etika & Konteks Situasional'],
    narrative:
      'Kevin tercatat menyukai ketepatan agenda di kalender belajarnya dan mengumpulkan tugas Fisika selalu dua hari sebelum tenggat. Banyak teman menganggapnya pasti J (Judging) dan berotak kiri kaku. Namun ketika berdiskusi mendalam mengenai pilihan karier dan makna hidup, Kevin mengaku bahwa jadwal ketat itu hanyalah "jaring pengaman kebiasaan dari rumah", sementara cara berpikir alaminya lebih suka menampung informasi terbuka dulu sebelum mengambil keputusan besar (Ti/Fi + Ne eksploratif).',
    evidenceItems: [
      { id: 'ev-1', text: 'Kebiasaan mengumpulkan tugas cepat dan memakai kalender rapi (= perilaku teramati / Conscientiousness atau O pada SLOAN).', type: 'observed' },
      { id: 'ev-2', text: 'Preferensi memproses pilihan hidup secara terbuka sebelum mengunci kesimpulan (= indikasi poros Persepsi/Judging kognitif yang perlu digali).', type: 'observed' },
      { id: 'ev-3', text: 'Pengaruh pola asuh disiplin keluarga yang membentuk kebiasaan kerja terstruktur terlepas dari preferensi kognitif.', type: 'ambiguous' },
    ],
    interpretations: [
      {
        id: 'int-1',
        framework: 'MBTI / Jungian',
        label: 'Membedakan kebiasaan perilaku eksternal (terorganisasi) dari arsitektur fungsi kognitif (Grant/Beebe stack vs dikotomi resmi)',
        plausibility: 'Didukung Bukti',
        analysis: 'Dalam teori Myers-Briggs resmi, poros J/P menandai gaya orientasi ke dunia luar, sedangkan dalam model fungsi Grant/Beebe seorang tipe INTP atau INFP dengan kebiasaan kerja rapi (termasuk lewat Si tersier atau trait SLOAN Organized) tetap bisa tampak sangat tepat waktu.',
      },
      {
        id: 'int-2',
        framework: 'SLOAN',
        label: 'Memotret dimensi Organized (O) secara terpisah dari gaya fungsi kognitif MBTI',
        plausibility: 'Didukung Bukti',
        analysis: 'Big Five memisahkan secara bersih perilaku tekun-rapi (Conscientiousness / O) dari rasa ingin tahu (Openness / I), sehingga tidak terjadi tumpang tindih stereotip.',
      },
    ],
    missingInfoNotes: [
      'Apa yang terasa paling melelahkan bagi Kevin: terus-menerus mengikuti jadwal kaku di waktu luang, atau ketidakpastian tanpa daftar kerja?',
    ],
    guidingSynthesis:
      'Kebiasaan kerja rapi di sekolah tidak otomatis berarti kode J pada MBTI; menggunakan SLOAN (O vs U) secara terpisah membantu memetakan kebiasaan organisasi tanpa memelintir definisi fungsi kognitif.',
    linkedConcepts: ['MBTI Dikotomi vs Stack', 'SLOAN Conscientiousness (O)', 'Bias Stereotip Sekolah'],
  },
  {
    id: 'cs-08',
    title: 'Membaca Notasi SLOAN Lanjutan: Mengurai Profil "[R]CoA/i" Milik Ketua Klub Astronomi',
    category: 'Hypothetical personality cases',
    categoryIndo: 'Kasus Kepribadian Hipotetis',
    difficulty: 'lanjutan',
    frameworksRelevant: ['SLOAN', 'Etika & Konteks Situasional'],
    narrative:
      'Dalam forum daring komunitas kepribadian, seorang kakak kelas menulis profil SLOAN-nya sebagai "[R]CoA/i". Adik kelasnya mengira kakak kelas tersebut "anti-sains dan dingin" karena melihat huruf kecil pada "i" (Inquisitive) dan huruf kapital "R" (Reserved). Padahal kakak kelas tersebut adalah perancang proyek observasi gerhana yang sangat tenang membimbing pemula.',
    evidenceItems: [
      { id: 'ev-1', text: 'Kode "[R]" menandai introversi sosial yang sangat kuat/utama (membutuhkan waktu sunyi untuk memulihkan energi).', type: 'observed' },
      { id: 'ev-2', text: 'Kode "/i" (garis miring + huruf kecil) berarti kecenderungan rasa ingin tahu abstrak bersifat ringan atau mendekati garis tengah N/I—bukan tidak mampu berpikir.', type: 'observed' },
      { id: 'ev-3', text: 'Huruf "C" (Calm) dan "A" (Accommodating) konsisten dengan sikap tenang dan sabar membimbing adik kelas.', type: 'observed' },
    ],
    interpretations: [
      {
        id: 'int-1',
        framework: 'SLOAN',
        label: 'Memahami aturan simbol komunitas [X] (paling kuat) vs /x (lemah/netral) dan memisahkan trait sosial dari kompetensi ilmiah',
        plausibility: 'Didukung Bukti',
        analysis: 'Notasi komunitas [R]CoA/i hanya meringkas intensitas relatif 5 faktor Big Five versi penulisnya secara informal. Reserved (R) bukan berarti dingin/tidak ramah (karena A = Accommodating tinggi), dan /i tidak meniadakan ketelitian teknis ("o") dalam riset observasi.',
      },
      {
        id: 'int-2',
        framework: 'Miskonsepsi Psikometrik',
        label: 'Menjadikan notasi huruf komunitas sebagai skor psikologi klinis resmi',
        plausibility: 'Kurang Didukung',
        analysis: 'Notasi bertanda kurung/miring merupakan alat ekspresi komunitas internet, bukan instrumen tes baku seperti NEO PI-R.',
      },
    ],
    missingInfoNotes: [
      'Apakah kakak kelas tersebut mengisi tes BFI/IPIP resmi atau menyusun sendiri notasi simbolnya?',
    ],
    guidingSynthesis:
      'Pembacaan notasi SLOAN lanjutan menuntut literasi dua lapis: memahami kode posisi simbol ([X], huruf besar/kecil, /x) sekaligus menyadari batas ilmiahnya dibanding skala kontinum Big Five asli.',
    linkedConcepts: ['SLOAN Extended Notation [X]xx/X', 'Reserved vs Accommodating', 'Literasi Psikometrik'],
  },
  {
    id: 'cs-09',
    title: 'Temperamen Campuran: Menyeimbangkan Sifat Melankolis-Koleris pada Koordinator Karya Tulis',
    category: 'Multi-framework cases',
    categoryIndo: 'Kasus Multi-Kerangka',
    difficulty: 'menengah',
    frameworksRelevant: ['Temperament', 'Enneagram', 'SLOAN'],
    narrative:
      'Rendra digambarkan teman-temannya sebagai sosok yang sangat teliti menganalisis detail catatan kaki (Melankolis), namun saat diskusi buntu ia tiba-tiba mengambil kendali menentukan target tegas dan menuntut progres cepat (Koleris). Kadang ia merasa bersalah sendiri setelah nada suaranya terlalu keras di rapat.',
    evidenceItems: [
      { id: 'ev-1', text: 'Kecenderungan perfeksionis, analitis mendalam, dan peka pada kesalahan detail (nuansa Melankolis).', type: 'observed' },
      { id: 'ev-2', text: 'Dorongan mengambil keputusan cepat dan mengarahkan hasil saat terjadi kebuntuan (nuansa Koleris sekunder).', type: 'observed' },
      { id: 'ev-3', text: 'Rasa bersalah pasca-rapat menunjukkan kepedulian moral, bisa terkait Enneagram 1/6 atau tanggung jawab peran koordinator.', type: 'ambiguous' },
    ],
    interpretations: [
      {
        id: 'int-1',
        framework: 'Temperament',
        label: 'Model Temperamen Campuran (Melankolis-Koleris): ketelitian analisis berpadu dorongan eksekusi tegas',
        plausibility: 'Didukung Bukti',
        analysis: 'Dalam teori campuran modern, kombinasi Melankolis (utama) + Koleris (sekunder) umum tampil pada siswa yang standar mutunya tinggi sekaligus berani mendorong penyelesaian—sebaiknya dijelaskan sebagai regulasi energi & stres, bukan "penyakit cairan empedu".',
      },
      {
        id: 'int-2',
        framework: 'Enneagram',
        label: 'Kemungkinan resonansi tema Tipe 1 atau Tipe 6 counter-phobic dalam situasi tanggung jawab tinggi',
        plausibility: 'Kemungkinan Alternatif',
        analysis: 'Perlu digali motivasi di balik ketegasan dan rasa bersalahnya—apakah mengejar integritas benar-salah atau mencegah kegagalan kelompok.',
      },
    ],
    missingInfoNotes: [
      'Bagaimana gaya kerja Rendra ketika ia bukan koordinator melainkan anggota biasa tanpa beban tenggat?',
    ],
    guidingSynthesis:
      'Model temperamen campuran membantu menjelaskan dua sisi gaya kerja yang tampak kontras (halus-analitis namun tegas saat darurat), dan harus selalu dibarengi perspektif psikobiologis modern tentang regulasi stres.',
    linkedConcepts: ['Temperamen Melankolis-Koleris', 'Klasik vs Empiris Modern', 'Regulasi Emosi Tim'],
  },
];
