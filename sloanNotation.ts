export type SloanAxisKey = 'social' | 'limbic' | 'organized' | 'accommodating' | 'inquisitive';
export type SloanLetter = 'S' | 'R' | 'L' | 'C' | 'O' | 'U' | 'A' | 'E' | 'I' | 'N';

export interface SloanPoleDetail {
  axis: SloanAxisKey;
  axisIndex: 0 | 1 | 2 | 3 | 4;
  letter: SloanLetter;
  opposite: SloanLetter;
  name: string;
  bigFiveFactor: string;
  poleDirection: 'Tinggi (High)' | 'Rendah (Low)';
  tendencySummary: string;
  studyOrWorkStyle: string;
  interpersonalStyle: string;
  misconception: string;
}

export const SLOAN_POLE_MAP: Record<SloanLetter, SloanPoleDetail> = {
  S: {
    axis: 'social',
    axisIndex: 0,
    letter: 'S',
    opposite: 'R',
    name: 'Social (Ekstraversi Tinggi)',
    bigFiveFactor: 'Extraversion (+)',
    poleDirection: 'Tinggi (High)',
    tendencySummary: 'Cenderung mencari stimulasi sosial, mudah berinisiatif dalam percakapan, dan berenergi lewat kolaborasi aktif.',
    studyOrWorkStyle: 'Menyukai diskusi kelompok, curah gagasan lisan, dan presentasi interaktif.',
    interpersonalStyle: 'Terbuka secara ekspresif, proaktif menyapa, dan nyaman berada di lingkungan ramai.',
    misconception: 'Social tidak otomatis berarti ramah kepada semua orang (itu ranah Accommodating) atau tidak butuh waktu sendiri.',
  },
  R: {
    axis: 'social',
    axisIndex: 0,
    letter: 'R',
    opposite: 'S',
    name: 'Reserved (Ekstraversi Rendah)',
    bigFiveFactor: 'Extraversion (−)',
    poleDirection: 'Rendah (Low)',
    tendencySummary: 'Menghemat energi sosial, nyaman dengan aktivitas tenang/mandiri, dan berbicara lebih selektif sesuai kebutuhan.',
    studyOrWorkStyle: 'Lebih fokus saat membaca atau menganalisis secara privat sebelum memaparkan kesimpulan tertulis.',
    interpersonalStyle: 'Menyukai percakapan mendalam 1-on-1 atau kelompok kecil dibanding interaksi massa.',
    misconception: 'Reserved bukan berarti pemalu atau cemas sosial; kecemasan emosional diukur pada sumbu Limbic (L).',
  },
  L: {
    axis: 'limbic',
    axisIndex: 1,
    letter: 'L',
    opposite: 'C',
    name: 'Limbic (Reaktivitas Emosional Tinggi)',
    bigFiveFactor: 'Neuroticism (+)',
    poleDirection: 'Tinggi (High)',
    tendencySummary: 'Memiliki kepekaan tinggi terhadap perubahan suasana, stresor, kekhawatiran tenggat, dan dinamika ancaman.',
    studyOrWorkStyle: 'Sering terdorong memeriksa detail ulang karena antisipasi risiko, namun butuh strategi regulasi stres saat tekanan tinggi.',
    interpersonalStyle: 'Cepat menangkap nada suara dan perubahan emosional, serta mudah terdampak suasana kelompok.',
    misconception: 'Limbic dalam Big Five bukan diagnosis gangguan jiwa; ini menggambarkan sensitivitas respons stres normal pada kontinum.',
  },
  C: {
    axis: 'limbic',
    axisIndex: 1,
    letter: 'C',
    opposite: 'L',
    name: 'Calm (Stabilitas Emosional Tinggi)',
    bigFiveFactor: 'Neuroticism (− / Emotional Stability)',
    poleDirection: 'Rendah (Low)',
    tendencySummary: 'Relatif stabil di bawah tekanan, tidak mudah terpancing reaksi panik, dan cepat kembali ke kondisi netral.',
    studyOrWorkStyle: 'Tetap tenang ketika menghadapi ujian mendadak atau revisi proyek mendekati tenggat.',
    interpersonalStyle: 'Memberi efek menenangkan dalam diskusi tegang, meski kadang dianggap kurang peka jika tidak verbal.',
    misconception: 'Calm tidak berarti tidak punya perasaan atau dingin; hanya ambang reaktivitas emosionalnya lebih tinggi.',
  },
  O: {
    axis: 'organized',
    axisIndex: 2,
    letter: 'O',
    opposite: 'U',
    name: 'Organized (Ketelitian & Ketertiban Tinggi)',
    bigFiveFactor: 'Conscientiousness (+)',
    poleDirection: 'Tinggi (High)',
    tendencySummary: 'Menyukai struktur jadwal, kejelasan target, tindak lanjut konsisten, serta kerapian dokumentasi.',
    studyOrWorkStyle: 'Membuat daftar prioritas, mencicil tugas jauh hari, dan mengikuti rubrik penilaian secara disiplin.',
    interpersonalStyle: 'Dapat diandalkan menjaga komitmen waktu, namun bisa merasa terganggu oleh perubahan mendadak tanpa alasan.',
    misconception: 'Organized berbeda dengan fungsi Te/Si atau J di MBTI; ini tentang kedisiplinan perilaku sehari-hari.',
  },
  U: {
    axis: 'organized',
    axisIndex: 2,
    letter: 'U',
    opposite: 'O',
    name: 'Unstructured (Spontanitas & Fleksibilitas Tinggi)',
    bigFiveFactor: 'Conscientiousness (−)',
    poleDirection: 'Rendah (Low)',
    tendencySummary: 'Lebih adaptif terhadap perubahan mendadak, nyaman bekerja berbasis momentum minat, dan kurang terikat prosedur kaku.',
    studyOrWorkStyle: 'Unggul dalam eksplorasi ide cepat atau improvisasi kreatif, namun memerlukan pengingat eksternal untuk jadwal panjang.',
    interpersonalStyle: 'Santai soal aturan formal, fleksibel mengubah rencana, tetapi berisiko salah paham dengan rekan bertipe O.',
    misconception: 'Unstructured tidak berarti malas atau kurang cerdas; banyak pemecah masalah spontan sangat produktif dalam ruang terbuka.',
  },
  A: {
    axis: 'accommodating',
    axisIndex: 3,
    letter: 'A',
    opposite: 'E',
    name: 'Accommodating (Kerja Sama Tinggi)',
    bigFiveFactor: 'Agreeableness (+)',
    poleDirection: 'Tinggi (High)',
    tendencySummary: 'Mengutamakan harmoni sosial, empati, kompromi, dan kepedulian terhadap kepentingan anggota tim lain.',
    studyOrWorkStyle: 'Berperan sebagai mediator kelompok, memastikan suara teman yang pendiam tetap didengar.',
    interpersonalStyle: 'Hangat, mudah memaafkan, dan menghindari konfrontasi kasar bila dapat diselesaikan lewat dialog.',
    misconception: 'Accommodating tidak sama dengan lemah atau Fe-dominant; orang bisa analitis logis namun tetap memilih bersikap kooperatif.',
  },
  E: {
    axis: 'accommodating',
    axisIndex: 3,
    letter: 'E',
    opposite: 'A',
    name: 'Egocentric / Direct (Keselarasan Sosial Rendah)',
    bigFiveFactor: 'Agreeableness (−)',
    poleDirection: 'Rendah (Low)',
    tendencySummary: 'Lebih lugas, skeptis, berorientasi pada target atau argumen mandiri dibanding menjaga kesepakatan kelompok semata.',
    studyOrWorkStyle: 'Cepat mengkritisi asumsi lemah, berani mengambil posisi minoritas, dan kompetitif dalam pencapaian.',
    interpersonalStyle: 'Langsung ke inti persoalan tanpa basa-basi panjang; bisa terkesan tajam bila tidak dilengkapi klarifikasi empatik.',
    misconception: 'Dalam istilah Global 5/SLOAN, "Egocentric" adalah label teknis untuk Agreeableness rendah—bukan penghinaan moral atau narsisme klinis.',
  },
  I: {
    axis: 'inquisitive',
    axisIndex: 4,
    letter: 'I',
    opposite: 'N',
    name: 'Inquisitive (Keterbukaan Intelektual & Estetika Tinggi)',
    bigFiveFactor: 'Openness to Experience (+)',
    poleDirection: 'Tinggi (High)',
    tendencySummary: 'Haus akan ide baru, konsep abstrak, pola lintas disiplin, dan eksplorasi imajinatif maupun filosofis.',
    studyOrWorkStyle: 'Tertarik menghubungkan teori lintas pelajaran dan menanyakan "mengapa" di balik aturan baku.',
    interpersonalStyle: 'Menikmati diskusi konseptual terbuka dan sudut pandang unik yang belum populer.',
    misconception: 'Inquisitive bukan ukuran IQ; melainkan preferensi ketertarikan terhadap kebaruan, abstraksi, dan variasi pengalaman.',
  },
  N: {
    axis: 'inquisitive',
    axisIndex: 4,
    letter: 'N',
    opposite: 'I',
    name: 'Non-Curious / Pragmatic (Keterbukaan Tradisional / Praktis)',
    bigFiveFactor: 'Openness to Experience (−)',
    poleDirection: 'Rendah (Low)',
    tendencySummary: 'Berfokus pada fakta nyata, kegunaan langsung sehari-hari, tradisi yang teruji, dan solusi konkret tanpa abstraksi berlebihan.',
    studyOrWorkStyle: 'Cepat menguasai prosedur praktis, contoh soal terapan, dan panduan langkah demi langkah yang jelas.',
    interpersonalStyle: 'Membumi, langsung pada aplikasi nyata, dan tidak mudah teralihkan oleh spekulasi teoretis panjang.',
    misconception: 'Label "Non-Curious" dari istilah internet awal tidak berarti anti-belajar—lebih akurat dipahami sebagai orientasi pragmatis-konkret.',
  },
};

export const STANDARD_SLOAN_AXES: {
  axis: SloanAxisKey;
  index: 0 | 1 | 2 | 3 | 4;
  title: string;
  bigFiveName: string;
  high: SloanLetter;
  low: SloanLetter;
}[] = [
  { axis: 'social', index: 0, title: 'Extraversion Sosial', bigFiveName: 'Extraversion', high: 'S', low: 'R' },
  { axis: 'limbic', index: 1, title: 'Reaktivitas Emosional', bigFiveName: 'Neuroticism', high: 'L', low: 'C' },
  { axis: 'organized', index: 2, title: 'Ketertiban & Ketelitian', bigFiveName: 'Conscientiousness', high: 'O', low: 'U' },
  { axis: 'accommodating', index: 3, title: 'Keselarasan Interpersonal', bigFiveName: 'Agreeableness', high: 'A', low: 'E' },
  { axis: 'inquisitive', index: 4, title: 'Keterbukaan Ide & Pengalaman', bigFiveName: 'Openness to Experience', high: 'I', low: 'N' },
];

export interface SloanTypeCombination {
  code: string;
  headline: string;
  summary: string;
  learningHighlight: string;
  teamDynamic: string;
  frictionPoint: string;
}

function describeSloanCombo(code: string): SloanTypeCombination {
  const [s, l, o, a, i] = code.split('') as SloanLetter[];
  const isS = s === 'S';
  const isL = l === 'L';
  const isO = o === 'O';
  const isA = a === 'A';
  const isI = i === 'I';

  const energyTitle = isS ? 'Komunikator Terbuka' : 'Pengamat Reflektif';
  const moodTitle = isL ? 'Peka & Responsif' : 'Stabil & Tenang';
  const workTitle = isO ? 'Terstruktur' : 'Spontan';
  const relTitle = isA ? 'Kooperatif' : 'Lugas Mandiri';
  const mindTitle = isI ? 'Eksploratif' : 'Pragmatis';

  return {
    code,
    headline: `${energyTitle} · ${moodTitle} · ${workTitle}`,
    summary: `Menggabungkan orientasi ${isS ? 'sosial aktif (S)' : 'reflektif mandiri (R)'}, respons emosional ${
      isL ? 'peka terhadap tekanan (L)' : 'tenang stabil (C)'
    }, pola kerja ${isO ? 'terjadwal teratur (O)' : 'fleksibel adaptif (U)'}, gaya relasi ${
      isA ? 'mengutamakan keselarasan (A)' : 'tegas langsung pada sasaran (E)'
    }, serta minat ide ${isI ? 'terbuka konseptual (I)' : 'konkret praktis (N)'}.`,
    learningHighlight: `${
      isO ? 'Membuat jadwal belajar terukur' : 'Belajar paling efektif lewat fleksibilitas topik'
    } dan ${isI ? 'mengaitkan materi ke konsep abstrak atau lintas disiplin' : 'berfokus pada contoh konkret dan aplikasi langsung'}.`,
    teamDynamic: `${relTitle} dan ${mindTitle}: ${
      isS
        ? 'mudah menyuarakan gagasan di forum kelompok'
        : 'cenderung memberi masukan tajam secara ringkas atau tertulis'
    }${isA ? ' sembari menjaga keharmonisan tim' : ' tanpa sungkan mengoreksi celah argumen'}.`,
    frictionPoint: `${
      isL
        ? 'Perlu ruang regulasi stres saat tenggat bertumpuk'
        : 'Kadang tampak kurang menunjukkan urgensi emosional saat rekan panik'
    }; ${
      isO
        ? 'mudah frustrasi jika alur kerja tim terus berubah mendadak'
        : 'berisiko menunda tugas rutin yang kurang menantang secara konseptual'
    }.`,
  };
}

export const ALL_32_SLOAN_COMBINATIONS: SloanTypeCombination[] = (() => {
  const results: SloanTypeCombination[] = [];
  for (const s of ['S', 'R']) {
    for (const l of ['L', 'C']) {
      for (const o of ['O', 'U']) {
        for (const a of ['A', 'E']) {
          for (const i of ['I', 'N']) {
            results.push(describeSloanCombo(`${s}${l}${o}${a}${i}`));
          }
        }
      }
    }
  }
  return results;
})();

export type ExtendedSloanTier =
  | 'Utama / Paling Menonjol ([Kurung Siku])'
  | 'Tinggi / Primer (Huruf Kapital)'
  | 'Sedang / Sekunder (Huruf Kecil)'
  | 'Moderat / Paling Lemah (Setelah /)';

export interface ParsedSloanToken {
  letter: SloanLetter;
  rawToken: string;
  tier: ExtendedSloanTier;
  rankOrder: number;
  detail: SloanPoleDetail;
}

export interface ExtendedSloanParseResult {
  rawInput: string;
  normalizedNotation: string;
  isValid: boolean;
  isExtendedSyntax: boolean;
  error?: string;
  canonicalFiveLetter: string | null;
  axisSelections: Partial<Record<SloanAxisKey, ParsedSloanToken>>;
  rankedTraits: ParsedSloanToken[];
  summaryLines: string[];
  academicBoundaryNote: string;
}

const VALID_SLOAN_SET = new Set<string>(['S', 'R', 'L', 'C', 'O', 'U', 'A', 'E', 'I', 'N']);

/**
 * Parses both standard 5-letter SLOAN (e.g. "SCOAI") and community extended notation
 * (e.g. "[S]lo/E/I", "R[c]o/A/i", "xCOAI" -> rejects invalid letters gracefully).
 *
 * Conventions supported:
 * - `[X]` : Trait paling dominan / jangkar utama.
 * - `X` (Uppercase) : Trait menonjol / primer.
 * - `x` (Lowercase) : Trait condong moderat / tidak ekstrem.
 * - `/X` (Slash segments) : Urutan penekanan eksplisit atau sifat di belakang prioritas awal.
 */
export function parseExtendedSloanNotation(raw: string): ExtendedSloanParseResult {
  const trimmed = raw.trim();
  const academicBoundaryNote =
    'Catatan Model: Notasi lanjutan (tanda kurung siku [X], huruf kecil, atau pemisah garis miring /) adalah konvensi komunitas daring (mis. SimilarMinds/forum Big Five) untuk menggambarkan kekuatan relatif dimensi, BUKAN standar psikometrik klinis seperti skor persentil NEO-PI-R.';

  if (!trimmed) {
    return {
      rawInput: raw,
      normalizedNotation: '',
      isValid: false,
      isExtendedSyntax: false,
      error: 'Masukkan kode SLOAN standar (mis. SCOAI) atau notasi lanjutan (mis. [S]lo/E/I).',
      canonicalFiveLetter: null,
      axisSelections: {},
      rankedTraits: [],
      summaryLines: [],
      academicBoundaryNote,
    };
  }

  // Detect standard 5-letter first
  const upperPlain = trimmed.toUpperCase();
  if (/^[SR][LC][OU][AE][IN]$/.test(upperPlain) && !/[[\]/a-z]/.test(trimmed)) {
    const tokens: ParsedSloanToken[] = upperPlain.split('').map((ch, idx) => {
      const letter = ch as SloanLetter;
      return {
        letter,
        rawToken: letter,
        tier: 'Tinggi / Primer (Huruf Kapital)',
        rankOrder: idx + 1,
        detail: SLOAN_POLE_MAP[letter],
      };
    });
    const axisSelections: Partial<Record<SloanAxisKey, ParsedSloanToken>> = {};
    tokens.forEach((tk) => {
      axisSelections[tk.detail.axis] = tk;
    });
    return {
      rawInput: raw,
      normalizedNotation: upperPlain,
      isValid: true,
      isExtendedSyntax: false,
      canonicalFiveLetter: upperPlain,
      axisSelections,
      rankedTraits: tokens,
      summaryLines: tokens.map((t) => `${t.letter} (${t.detail.name}): menonjol sebagai kutub utama sumbu ${t.detail.bigFiveFactor}.`),
      academicBoundaryNote,
    };
  }

  // Extended parsing: tokenize brackets [X] vs plain letters separated optionally by /
  const tokens: ParsedSloanToken[] = [];
  const usedAxes = new Set<SloanAxisKey>();
  let slashCount = 0;
  let i = 0;
  let rank = 1;

  while (i < trimmed.length) {
    const ch = trimmed[i];
    if (ch === ' ' || ch === '-') {
      i++;
      continue;
    }
    if (ch === '/') {
      slashCount++;
      i++;
      continue;
    }
    if (ch === '[') {
      const closeIdx = trimmed.indexOf(']', i + 1);
      if (closeIdx === -1 || closeIdx === i + 1) {
        return {
          rawInput: raw,
          normalizedNotation: trimmed,
          isValid: false,
          isExtendedSyntax: true,
          error: 'Tanda kurung siku [...] harus berisi satu huruf kutub SLOAN, misalnya [S] atau [I].',
          canonicalFiveLetter: null,
          axisSelections: {},
          rankedTraits: [],
          summaryLines: [],
          academicBoundaryNote,
        };
      }
      const inside = trimmed.slice(i + 1, closeIdx).trim();
      for (const subCh of inside) {
        const up = subCh.toUpperCase() as SloanLetter;
        if (!VALID_SLOAN_SET.has(up)) {
          return {
            rawInput: raw,
            normalizedNotation: trimmed,
            isValid: false,
            isExtendedSyntax: true,
            error: `Huruf '${subCh}' di dalam kurung tidak termasuk 10 kutub SLOAN (S/R, L/C, O/U, A/E, I/N).`,
            canonicalFiveLetter: null,
            axisSelections: {},
            rankedTraits: [],
            summaryLines: [],
            academicBoundaryNote,
          };
        }
        const detail = SLOAN_POLE_MAP[up];
        if (usedAxes.has(detail.axis)) {
          return {
            rawInput: raw,
            normalizedNotation: trimmed,
            isValid: false,
            isExtendedSyntax: true,
            error: `Dimensi ${detail.bigFiveFactor} muncul lebih dari satu kali dalam satu notasi.`,
            canonicalFiveLetter: null,
            axisSelections: {},
            rankedTraits: [],
            summaryLines: [],
            academicBoundaryNote,
          };
        }
        usedAxes.add(detail.axis);
        tokens.push({
          letter: up,
          rawToken: `[${subCh}]`,
          tier: 'Utama / Paling Menonjol ([Kurung Siku])',
          rankOrder: rank++,
          detail,
        });
      }
      i = closeIdx + 1;
      continue;
    }

    const up = ch.toUpperCase() as SloanLetter;
    if (!VALID_SLOAN_SET.has(up)) {
      return {
        rawInput: raw,
        normalizedNotation: trimmed,
        isValid: false,
        isExtendedSyntax: true,
        error: `Karakter '${ch}' tidak dikenali. Gunakan huruf S/R, L/C, O/U, A/E, I/N dengan opsional [...] dan /.`,
        canonicalFiveLetter: null,
        axisSelections: {},
        rankedTraits: [],
        summaryLines: [],
        academicBoundaryNote,
      };
    }

    const detail = SLOAN_POLE_MAP[up];
    if (usedAxes.has(detail.axis)) {
      return {
        rawInput: raw,
        normalizedNotation: trimmed,
        isValid: false,
        isExtendedSyntax: true,
        error: `Dimensi ${detail.bigFiveFactor} ganda (${ch}). Pilih satu kutub saja per dimensi.`,
        canonicalFiveLetter: null,
        axisSelections: {},
        rankedTraits: [],
        summaryLines: [],
        academicBoundaryNote,
      };
    }
    usedAxes.add(detail.axis);

    const isLower = ch !== up;
    const tier: ExtendedSloanTier = isLower
      ? 'Sedang / Sekunder (Huruf Kecil)'
      : slashCount > 0
      ? 'Moderat / Paling Lemah (Setelah /)'
      : 'Tinggi / Primer (Huruf Kapital)';

    tokens.push({
      letter: up,
      rawToken: ch,
      tier,
      rankOrder: rank++,
      detail,
    });
    i++;
  }

  if (tokens.length === 0) {
    return {
      rawInput: raw,
      normalizedNotation: trimmed,
      isValid: false,
      isExtendedSyntax: true,
      error: 'Belum ada huruf kutub SLOAN yang terbaca.',
      canonicalFiveLetter: null,
      axisSelections: {},
      rankedTraits: [],
      summaryLines: [],
      academicBoundaryNote,
    };
  }

  const axisSelections: Partial<Record<SloanAxisKey, ParsedSloanToken>> = {};
  tokens.forEach((tk) => {
    axisSelections[tk.detail.axis] = tk;
  });

  // Sort by prominence tier first so Dominant ([X]) leads, then Uppercase before /, Lowercase, Post-slash
  const tierPriority: Record<ExtendedSloanTier, number> = {
    'Utama / Paling Menonjol ([Kurung Siku])': 1,
    'Tinggi / Primer (Huruf Kapital)': 2,
    'Sedang / Sekunder (Huruf Kecil)': 3,
    'Moderat / Paling Lemah (Setelah /)': 4,
  };

  const rankedTraits = [...tokens].sort(
    (a, b) => tierPriority[a.tier] - tierPriority[b.tier] || a.rankOrder - b.rankOrder
  );

  let canonicalFiveLetter: string | null = null;
  if (
    axisSelections.social &&
    axisSelections.limbic &&
    axisSelections.organized &&
    axisSelections.accommodating &&
    axisSelections.inquisitive
  ) {
    canonicalFiveLetter = [
      axisSelections.social.letter,
      axisSelections.limbic.letter,
      axisSelections.organized.letter,
      axisSelections.accommodating.letter,
      axisSelections.inquisitive.letter,
    ].join('');
  }

  const summaryLines = rankedTraits.map(
    (tk) => `${tk.rawToken} → ${tk.detail.name} [${tk.tier}]`
  );

  return {
    rawInput: raw,
    normalizedNotation: trimmed,
    isValid: true,
    isExtendedSyntax: /[[\]/a-z]/.test(trimmed) || tokens.length !== 5,
    canonicalFiveLetter,
    axisSelections,
    rankedTraits,
    summaryLines,
    academicBoundaryNote,
  };
}

export interface ExtendedSloanBuilderItem {
  letter: SloanLetter;
  prominence: 'dominant' | 'primary' | 'moderate' | 'trailing';
}

export function buildExtendedSloanNotation(items: ExtendedSloanBuilderItem[]): string {
  const preSlash = items
    .filter((it) => it.prominence !== 'trailing')
    .sort((a, b) => {
      const order = { dominant: 0, primary: 1, moderate: 2, trailing: 3 };
      return order[a.prominence] - order[b.prominence];
    })
    .map((it) => {
      if (it.prominence === 'dominant') return `[${it.letter}]`;
      if (it.prominence === 'moderate') return it.letter.toLowerCase();
      return it.letter;
    })
    .join('');

  const trailing = items
    .filter((it) => it.prominence === 'trailing')
    .map((it) => `/${it.letter}`)
    .join('');

  return `${preSlash}${trailing}`;
}
