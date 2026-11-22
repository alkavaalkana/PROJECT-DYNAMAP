import { ENNEAGRAM_TYPES, INSTINCT_STACKINGS, INSTINCT_VARIANTS } from '../data/enneagramData';
import { INFORMATION_ELEMENTS, SOCIONICS_TYPES, parseJungianNotation } from '../data/socionicsData';
import { createDefaultIntrapersonalInput } from '../data/higherEdAndCareerData';
import { analyzeAcademicGap } from './explorationEngine';
import { parsePsychosophyPositions } from './psychosophy';
import type {
  CareerRecord,
  HybridPersonalAnalysis,
  IndependentTypologySection,
  IntrapersonalExplorationInput,
  Profile,
  RecommendationReasoningTrail,
  SocionicsCode,
  ThreeLayerMajorRecommendation,
  ThreeLayerRecommendationBundle,
  TypologyFrameworkKey,
  UniversityInstitution,
  UniversityProgram,
  UserExplorationData,
  UserSubjectEntry,
} from '../types/dynamap';

function norm(s: string): string {
  return s.trim().toLowerCase();
}

function getEffectiveIntrapersonal(
  exploration: UserExplorationData | null,
  profile: Profile | null = null
): IntrapersonalExplorationInput {
  const base = createDefaultIntrapersonalInput();
  const profileInterests = profile?.academicInterests?.filter(Boolean) || [];
  const intra = exploration?.intrapersonal;
  const resolvedCuriosity =
    intra?.curiosityTopics && intra.curiosityTopics.length > 0
      ? intra.curiosityTopics
      : exploration?.interestTopics && exploration.interestTopics.length > 0
      ? exploration.interestTopics
      : profileInterests;

  return {
    ...base,
    ...(intra || {}),
    workPreferences: {
      ...base.workPreferences,
      ...(intra?.workPreferences || {}),
    },
    curiosityTopics: resolvedCuriosity,
    personalMotivationsRanked:
      intra?.personalMotivationsRanked && intra.personalMotivationsRanked.length > 0
        ? intra.personalMotivationsRanked
        : exploration?.workMotivationTags || [],
  };
}

function resolveTypologyFlags(profile: Profile | null, exploration: UserExplorationData | null) {
  const prov = exploration?.provisionalTypologies || {};
  const t = profile?.typology;
  return {
    socionics: prov.socionics ?? (t?.status === 'Initial Typing' || t?.status === 'Undetermined'),
    enneagram: prov.enneagram ?? (t?.status === 'Initial Typing' || t?.status === 'Undetermined'),
    instinct: prov.instinct ?? (t?.status === 'Initial Typing' || t?.status === 'Undetermined'),
    psychosophy: prov.psychosophy ?? (t?.psychosophyProvisional ?? true),
    jungian: prov.jungian ?? (t?.status === 'Initial Typing' || t?.status === 'Undetermined'),
  };
}

// ==================== SECTION 5: HYBRID PERSONAL ANALYSIS ENGINE ====================
export function analyzeHybridPersonalProfile(params: {
  profile: Profile | null;
  exploration: UserExplorationData | null;
  userSubjects: UserSubjectEntry[];
}): HybridPersonalAnalysis {
  const { profile, exploration, userSubjects } = params;
  const intra = getEffectiveIntrapersonal(exploration, profile);
  const provFlags = resolveTypologyFlags(profile, exploration);
  const typ = profile?.typology;

  // --- LAYER ONE: INDEPENDENT TYPOLOGY ANALYSIS ---
  const layerOneTypologies: IndependentTypologySection[] = [];

  // 1.1 Socionics
  const socCode = typ?.socionics ? (typ.socionics as SocionicsCode) : '';
  const socSpec = socCode ? SOCIONICS_TYPES[socCode] : null;
  if (socSpec) {
    const leadingSpec = INFORMATION_ELEMENTS[socSpec.modelA[0]];
    const creativeSpec = INFORMATION_ELEMENTS[socSpec.modelA[1]];
    const polrSpec = INFORMATION_ELEMENTS[socSpec.modelA[3]];
    const suggestiveSpec = INFORMATION_ELEMENTS[socSpec.modelA[4]];
    const valued = [socSpec.modelA[0], socSpec.modelA[1], socSpec.modelA[4], socSpec.modelA[5]];
    const unvalued = [socSpec.modelA[2], socSpec.modelA[3], socSpec.modelA[6], socSpec.modelA[7]];

    layerOneTypologies.push({
      framework: 'Socionics (Model A)',
      codeOrStatus: `${socSpec.code} · Quadra ${socSpec.quadra}`,
      isProvisional: provFlags.socionics,
      available: true,
      highlights: [
        `Blok Ego (Kuat & Bernilai): Leading ${socSpec.modelA[0]} (${leadingSpec.indonesianName}) dan Creative ${socSpec.modelA[1]} (${creativeSpec.indonesianName}).`,
        `Elemen Dihargai (Valued): ${valued.join(', ')} · Kurang Dihargai (Unvalued): ${unvalued.join(', ')}.`,
        `Area Peka / Rentan (PoLR ${socSpec.modelA[3]}): ${polrSpec.mainFocus.replace(/\.+$/, '')} — butuh kejelasan kontekstual tanpa tekanan berlebih.`,
        `Area Dukungan / Tertarik Belajar (Suggestive ${socSpec.modelA[4]}): ${suggestiveSpec.indonesianName}.`,
      ],
      theoreticalFocus:
        'Memotret kecenderungan perhatian kognitif, cara memproses fakta vs struktur, serta dinamika pertukaran informasi dalam tim.',
      boundaryDisclaimer:
        'Batasan Kerangka: Elemen informasi Socionics (mis. Te atau Ti) TIDAK identik dengan aspek Logika Psikosofi dan tidak mengukur kecerdasan akademik maupun prestasi belajar.',
    });
  } else {
    layerOneTypologies.push({
      framework: 'Socionics (Model A)',
      codeOrStatus: 'Belum Dipetakan',
      isProvisional: true,
      available: false,
      highlights: [
        'Belum ada tipe Socionics tersimpan di profil. Eksplorasi tetap dapat dilanjutkan sepenuhnya menggunakan minat, aktivitas, dan latar SMA Anda.',
      ],
      theoreticalFocus: 'Pemrosesan informasi kognitif melalui 8 elemen dan 4 Quadra.',
      boundaryDisclaimer:
        'Socionics bersifat opsional dan dapat ditandai sebagai provisional kapan saja.',
    });
  }

  // 1.2 Enneagram
  const ennSpec = typ?.enneagramCore ? ENNEAGRAM_TYPES[typ.enneagramCore] : null;
  if (ennSpec) {
    layerOneTypologies.push({
      framework: 'Enneagram Inti & Tritype',
      codeOrStatus: `${typ?.enneagramRaw || `Tipe ${ennSpec.number}`}${typ?.enneagramWing && typ.enneagramWing !== typ?.enneagramRaw ? ` (${typ.enneagramWing})` : ''}${typ?.tritype ? ` · Tritype ${typ.tritype}` : ''}`,
      isProvisional: provFlags.enneagram,
      available: true,
      highlights: [
        `Motivasi & Keinginan Inti: ${ennSpec.coreDesire}`,
        `Ketakutan Inti yang Diwaspadai: ${ennSpec.coreFear}`,
        `Pusat & Gaya Triad: Pusat ${ennSpec.center} · Harmonik ${ennSpec.harmonic} · Hornevian ${ennSpec.hornevian}.`,
        `Fokus perhatian ini menggambarkan apa yang sering dicari untuk merasa aman atau bermakna—bukan penentu pilihan jurusan.`,
      ],
      theoreticalFocus:
        'Memahami dorongan motivasional batin, reaksi pertahanan saat tertekan, dan sumber makna pribadi.',
      boundaryDisclaimer:
        'Batasan Kerangka: Tipe Enneagram (mis. Tipe 5 atau Tipe 3) TIDAK memaksa seseorang masuk jurusan tertentu dan tidak memiliki korespondensi 1:1 dengan tipe Socionics.',
    });
  } else {
    layerOneTypologies.push({
      framework: 'Enneagram Inti & Tritype',
      codeOrStatus: 'Belum Dipetakan',
      isProvisional: true,
      available: false,
      highlights: ['Belum terisi. Anda tetap bebas meninjau seluruh rekomendasi eksplorasi tanpa kode Enneagram.'],
      theoreticalFocus: 'Motivasi batin, ketakutan dasar, dan pola perhatian emosional.',
      boundaryDisclaimer: 'Enneagram merupakan alat refleksi motivasi, bukan instrumen bakat karier.',
    });
  }

  // 1.3 Instinctual Variants
  const stackSpec = typ?.instinctStacking ? INSTINCT_STACKINGS[typ.instinctStacking] : null;
  const domInst = typ?.instinctVariant ? INSTINCT_VARIANTS[typ.instinctVariant] : null;
  if (stackSpec || domInst) {
    layerOneTypologies.push({
      framework: 'Varian Insting (Instinctual Variants)',
      codeOrStatus: stackSpec ? `${stackSpec.stacking} (Blind ${stackSpec.blind})` : `${domInst?.code} Dominan`,
      isProvisional: provFlags.instinct,
      available: true,
      highlights: [
        domInst
          ? `Insting Dominan (${domInst.code}): ${domInst.indonesianName} — ${domInst.summary}`
          : `Urutan Prioritas Insting: ${stackSpec?.stacking}.`,
        stackSpec
          ? `Insting Sekunder & Area Kurang Disadari: Kedua ${stackSpec.secondary}, Blind ${stackSpec.blind} (${stackSpec.developmentSuggestions?.[0] || stackSpec.possibleBlindSpots}).`
          : 'Memetakan prioritas energi harian (kelestarian diri, koneksi kelompok, atau intensitas satu-lawan-satu).',
      ],
      theoreticalFocus: 'Menjelaskan area kehidupan apa yang terasa paling mendesak membutuhkan perhatian energi.',
      boundaryDisclaimer:
        'Batasan Kerangka: Varian insting SP/SO/SX TIDAK menentukan bidang profesi (mis. SO bukan berarti wajib jurusan sosial; SP bukan berarti hanya teknik/keuangan).',
    });
  } else {
    layerOneTypologies.push({
      framework: 'Varian Insting (SP · SO · SX)',
      codeOrStatus: 'Belum Dipetakan',
      isProvisional: true,
      available: false,
      highlights: ['Belum terinci di profil. Opsional untuk dilengkapi di Profil Saya atau tetap dilangkahi.'],
      theoreticalFocus: 'Orientasi energi terhadap kelestarian praktis (SP), komunitas sosial (SO), dan kedalaman intens (SX).',
      boundaryDisclaimer: 'Insting tidak membatasi kecocokan profesi.',
    });
  }

  // 1.4 Psychosophy
  const psyCode = typ?.psychosophyCode || typ?.psychosophySelfReported || '';
  const parsedPsy = parsePsychosophyPositions(psyCode);
  if (parsedPsy.valid) {
    layerOneTypologies.push({
      framework: 'Psikosofi / Attitudinal Psyche',
      codeOrStatus: `${parsedPsy.code}${parsedPsy.typeSpec ? ` (“${parsedPsy.typeSpec.afanasyevNickname}”)` : ''}`,
      isProvisional: provFlags.psychosophy,
      available: true,
      highlights: [
        ...parsedPsy.placements.map(
          (pl) => `${pl.code} (${pl.aspectName} — ${pl.positionLabel}): ${pl.guide.coreAttitude}`
        ),
      ],
      theoreticalFocus:
        'Menguraikan sikap yakin vs ragu dan dialogis vs monologis pada aspek Logika (L), Kehendak (V), Emosi (E), dan Fisika (F).',
      boundaryDisclaimer:
        'Batasan Kerangka: Posisi 1L TIDAK mengukur IQ atau kemampuan akademik; 3L/4L tetap mampu unggul di sains, teknik, hukum, maupun riset.',
    });
  } else {
    layerOneTypologies.push({
      framework: 'Psikosofi / Attitudinal Psyche',
      codeOrStatus: 'Belum Dipetakan',
      isProvisional: true,
      available: false,
      highlights: ['Belum terisi. Anda dapat mengeksplorasi susunan L·V·E·F di modul Psikosofi kapan saja.'],
      theoreticalFocus: 'Hierarki sikap terhadap Logika, Kehendak, Emosi, dan Fisika.',
      boundaryDisclaimer: 'Psikosofi berfokus pada sikap subjektif, bukan kapabilitas kognitif.',
    });
  }

  // 1.5 Jungian
  const jungRaw = typ?.jungian || '';
  const parsedJung = parseJungianNotation(jungRaw);
  layerOneTypologies.push({
    framework: 'Tipologi Jung (Notasi Proyek)',
    codeOrStatus: jungRaw || 'Belum Dipetakan',
    isProvisional: provFlags.jungian,
    available: Boolean(jungRaw),
    highlights: jungRaw
      ? [
          parsedJung.valid
            ? `${parsedJung.explanation}`
            : `Notasi tercatat: ${jungRaw} (dipertahankan sesuai konvensi proyek tanpa konversi otomatis ke MBTI).`,
        ]
      : ['Belum terisi. Notasi Jungian bersifat pelengkap historis yang terpisah dari Socionics Model A.'],
    theoreticalFocus: 'Sikap orientasi kesadaran dasar (ekstraversi/introversi dan fungsi dominan-bantu klasik).',
    boundaryDisclaimer:
      'Batasan Kerangka: Notasi proyek tidak dikonversi paksa ke MBTI empat-huruf dan tetap dipandang terpisah dari struktur 8-posisi Socionics.',
  });

  if (typ?.customPrefixes && typ.customPrefixes.length > 0) {
    layerOneTypologies.push({
      framework: 'Catatan / Awalan Kustom Profil',
      codeOrStatus: typ.customPrefixes.map((c) => `${c.label}: ${c.value}`).join(' · '),
      isProvisional: true,
      available: true,
      highlights: typ.customPrefixes.map((c) => `${c.label}: ${c.value}`),
      theoreticalFocus:
        'Penanda tambahan dari profil pribadi yang diperlakukan sebagai hipotesis kontekstual tanpa mengikat jurusan.',
      boundaryDisclaimer:
        'Metadata kustom bersifat pelengkap reflektif dan tidak pernah membatasi pilihan program studi.',
    });
  }

  // --- LAYER TWO: INDIVIDUAL PREFERENCE ANALYSIS ---
  const summaryPoints: string[] = [];
  if (intra.curiosityTopics.length > 0) {
    summaryPoints.push(`Rasa ingin tahu utama mengarah pada: ${intra.curiosityTopics.join(', ')}.`);
  }
  if (intra.disciplinesToDeepen.length > 0) {
    summaryPoints.push(
      `Rumpun disiplin ilmu yang ingin didalami lebih jauh: ${intra.disciplinesToDeepen.join(', ')}.`
    );
  }
  if (profile?.academicInterests && profile.academicInterests.length > 0) {
    summaryPoints.push(
      `Tercatat pada Profil Saya (DYNAMAP): ${profile.academicInterests.join(', ')}.`
    );
  }
  if (intra.cognitivePreferences.length > 0) {
    summaryPoints.push(`Aktivitas intelektual yang paling memberi semangat: ${intra.cognitivePreferences.join(', ')}.`);
  }
  const profileLearningParts = profile?.learningPreferences
    ? [
        profile.learningPreferences.studySetting ? `Pengaturan: ${profile.learningPreferences.studySetting}` : '',
        profile.learningPreferences.explanationStyle ? `Penjelasan: ${profile.learningPreferences.explanationStyle}` : '',
        profile.learningPreferences.structureStyle ? `Struktur: ${profile.learningPreferences.structureStyle}` : '',
        profile.learningPreferences.workMode ? `Mode: ${profile.learningPreferences.workMode}` : '',
        profile.learningPreferences.examplePreference ? `Urutan contoh: ${profile.learningPreferences.examplePreference}` : '',
        profile.learningPreferences.feedbackStyle ? `Umpan balik: ${profile.learningPreferences.feedbackStyle}` : '',
      ].filter(Boolean)
    : [];
  if (intra.learningPreferencesSelected.length > 0) {
    summaryPoints.push(
      `Preferensi cara belajar pilihan (bukan batas kemampuan): ${intra.learningPreferencesSelected.join(', ')}.`
    );
  } else if (profileLearningParts.length > 0) {
    summaryPoints.push(
      `Preferensi cara belajar ditarik otomatis dari Profil Saya (bukan batas kemampuan): ${profileLearningParts.join(' · ')}.`
    );
  }
  if (intra.learningPreferenceNotes.trim()) {
    summaryPoints.push(`Catatan cara belajar pribadi: "${intra.learningPreferenceNotes.trim()}".`);
  }
  if (intra.personalMotivationsRanked.length > 0) {
    summaryPoints.push(`Prioritas motivasi studi lanjut: ${intra.personalMotivationsRanked.join(' → ')}.`);
  }
  if (intra.personalValuesNotes.trim()) {
    summaryPoints.push(`Nilai pribadi & pertimbangan penting: "${intra.personalValuesNotes.trim()}".`);
  }
  if (intra.meaningfulActivities.length > 0) {
    summaryPoints.push(`Aktivitas bermakna yang dinikmati: ${intra.meaningfulActivities.join(', ')}.`);
  }
  if (intra.careerAspirationsNotes.trim()) {
    summaryPoints.push(`Gambaran/aspirasi profesi saat ini: "${intra.careerAspirationsNotes.trim()}".`);
  }
  summaryPoints.push(
    `Preferensi lingkungan kerja (8 dimensi): Kolaborasi ${intra.workPreferences.collaboration}, Lokasi ${intra.workPreferences.setting}, Fokus ${intra.workPreferences.focus}, Struktur ${intra.workPreferences.structure}, Tanggung Jawab ${intra.workPreferences.responsibility}, Keputusan ${intra.workPreferences.decisionStyle}, Ritme ${intra.workPreferences.pace}, Visibilitas ${intra.workPreferences.visibility}.`
  );

  const paradoxNotes: string[] = [];
  if (intra.dislikedDespiteHighScore.length > 0) {
    paradoxNotes.push(
      `Penting dicatat — Mapel dengan nilai baik tetapi kurang dinikmati (${intra.dislikedDespiteHighScore.join(', ')}): nilai rapor tinggi TIDAK boleh menjebak Anda memilih jurusan yang membuat Anda cepat jenuh.`
    );
  }
  if (intra.enjoyedDespiteDifficulty.length > 0) {
    paradoxNotes.push(
      `Sinyal ketertarikan otentik — Bidang yang tetap dinikmati meski terasa sulit (${intra.enjoyedDespiteDifficulty.join(', ')}): rasa ingin tahu tahan uji sering menjadi bekal bertumbuh yang kuat di perkuliahan.`
    );
  }
  if (intra.voluntaryTopics.trim()) {
    paradoxNotes.push(`Topik yang diselidiki secara sukarela di luar tugas sekolah: "${intra.voluntaryTopics.trim()}".`);
  }
  if (intra.academicInterestNotes.trim()) {
    paradoxNotes.push(`Catatan minat bebas siswa: "${intra.academicInterestNotes.trim()}".`);
  }

  // --- LAYER THREE: ACADEMIC BACKGROUND ANALYSIS ---
  const takenSubjects = userSubjects.filter((s) => s.taken);
  const strongSubjects = takenSubjects.filter(
    (s) => s.proficiencyLevel === 'Sangat Kuat' || s.proficiencyLevel === 'Kuat'
  );
  const interestedSubjects = takenSubjects.filter((s) => s.interestLevel === 'Tinggi');
  const prepSubjects = takenSubjects.filter(
    (s) => s.proficiencyLevel === 'Dasar' && s.interestLevel === 'Tinggi'
  );

  const studiedSummary = `Terdata ${takenSubjects.length} mata pelajaran SMA aktif (${exploration?.specializationLabel || 'FISKIM MATONOMI'} + mapel umum).`;
  const strengthHighlights = strongSubjects.map(
    (s) => `${s.subjectName} (${s.proficiencyLevel}, Minat ${s.interestLevel}${s.enjoyedTopics ? ` · Topik disukai: ${s.enjoyedTopics}` : ''})`
  );
  if (strengthHighlights.length === 0 && interestedSubjects.length > 0) {
    strengthHighlights.push(
      `Minat tinggi teramati pada: ${interestedSubjects.map((s) => s.subjectName).join(', ')} (terus dapat diasah bertahap tanpa harus menunggu sempurna).`
    );
  }

  const prepAreas = prepSubjects.map(
    (s) => `${s.subjectName}: diminati tinggi tetapi penguasaan masih tahap dasar—perlu pendampingan konsep bertahap.`
  );
  if (prepAreas.length === 0) {
    prepAreas.push('Tidak ada sinyal kontradiksi tajam pada mapel aktif saat ini; tetap perlu mengecek konsep pengantar bila melirik jurusan di luar mapel SMA.');
  }

  // --- LAYER FOUR: HYBRID SYNTHESIS ---
  const convergences: string[] = [];
  const academicSupportingInterests: string[] = [];
  const meaningfulDivergences: string[] = [];
  const multiDimensionalFields: string[] = [];
  const lowOverlapWorthExploring: string[] = [];
  const informationGaps: string[] = [];

  const interestSearchPool = [
    ...intra.curiosityTopics,
    ...intra.disciplinesToDeepen,
    ...(profile?.academicInterests || []),
    intra.voluntaryTopics,
    intra.interestingProblems,
  ].join(' ');

  const hasHumanSocialInterests =
    intra.cognitivePreferences.some((c) => c.includes('perilaku') || c.includes('sosial') || c.includes('argumen') || c.includes('teks')) ||
    /psikologi|sosiologi|hukum|filsafat|komunikasi|bahasa|pendidikan|humaniora|kesehatan/i.test(interestSearchPool);

  const hasCreativeInterests =
    intra.cognitivePreferences.some((c) => c.includes('visual') || c.includes('artistik')) ||
    intra.meaningfulActivities.some((a) => /desain|visual|menulis/i.test(a)) ||
    /desain|seni|arsitektur|kreatif/i.test(interestSearchPool);

  const hasQuantAnalyticalInterests =
    intra.cognitivePreferences.some((c) => c.includes('kuantitatif') || c.includes('pola') || c.includes('sistem')) ||
    /data|rekayasa|kimia|fisika|ekonomi|industri|komputasi|teknik/i.test(interestSearchPool);

  if (socSpec && hasQuantAnalyticalInterests && ['Ti', 'Te', 'Ni', 'Ne'].includes(socSpec.modelA[0])) {
    convergences.push(
      `Konvergensi Kognitif-Minat: Preferensi pemrosesan informasi ${socSpec.code} (${socSpec.modelA[0]}/${socSpec.modelA[1]}) selaras dengan minat Anda pada pemecahan masalah sistemik, pola, dan analisis.`
    );
  }
  if (socSpec && hasHumanSocialInterests && ['Fe', 'Fi', 'Ne', 'Ni'].includes(socSpec.modelA[0])) {
    convergences.push(
      `Konvergensi Kognitif-Sosial: Fokus elemen ${socSpec.modelA[0]} pada relasi/makna manusia sejalan dengan ketertarikan Anda menyelidiki perilaku atau dinamika masyarakat.`
    );
  }
  if (ennSpec && (ennSpec.number === 5 || ennSpec.number === 1 || ennSpec.number === 3) && intra.personalMotivationsRanked.some((m) => /riset|intelektual|profesional/i.test(m))) {
    convergences.push(
      `Konvergensi Motivasi: Dorongan batin Tipe ${ennSpec.number} bertemu dengan prioritas studi lanjut Anda (${intra.personalMotivationsRanked.slice(0, 2).join(' & ')}).`
    );
  }
  if (convergences.length === 0) {
    convergences.push(
      'Titik temu utama saat ini muncul dari gabungan aktivitas bermakna, topik rasa ingin tahu, dan preferensi cara kerja yang Anda laporkan sendiri.'
    );
  }

  // Academic supporting interests
  if (interestedSubjects.length > 0) {
    academicSupportingInterests.push(
      `Pengalaman belajar di ${interestedSubjects.map((s) => s.subjectName).slice(0, 4).join(', ')} menopang langsung minat eksplorasi Anda saat ini.`
    );
  } else {
    academicSupportingInterests.push(
      'Keterampilan umum menulis (Bahasa Indonesia/Inggris) dan bernalar logis (Matematika) menjadi modal dasar yang mendukung hampir semua cabang keilmuan.'
    );
  }

  // Meaningful divergences (CRITICAL requirement 5.4: never dismiss stated interests!)
  if (socSpec && ['Ti', 'Te'].includes(socSpec.modelA[0]) && (hasCreativeInterests || hasHumanSocialInterests)) {
    meaningfulDivergences.push(
      `Perbedaan Bermakna: Profil Socionics ${socSpec.code} menyoroti pemrosesan logika analitis, NAMUN minat langsung Anda juga kuat mengarah ke bidang manusia/komunikasi/kreatif. DYNAMAP mempertahankan kedua jalur ini—minat nyata Anda tidak pernah disingkirkan oleh stereotip tipologi.`
    );
  }
  if (intra.dislikedDespiteHighScore.length > 0) {
    meaningfulDivergences.push(
      `Divergensi Nilai vs Minat: Anda meraih hasil baik di ${intra.dislikedDespiteHighScore.join(', ')}, tetapi tidak menikmatinya. Jangan memaksakan jurusan semata-mata karena angka rapor jika tidak selaras dengan rasa ingin tahu.`
    );
  }
  if (takenSubjects.some((s) => /fisika|kimia/i.test(s.subjectName)) && hasHumanSocialInterests) {
    meaningfulDivergences.push(
      `Jembatan Lintas Peminatan: Latar SMA Anda bercorak sains/ekonomi (${exploration?.specializationLabel || 'FISKIM MATONOMI'}), sementara rasa ingin tahu Anda juga menyentuh ilmu sosial/perilaku/humaniora. Ini adalah peluang eksplorasi lintas disiplin yang sangat bernilai, bukan ketidakkonsistenan.`
    );
  }
  if (meaningfulDivergences.length === 0) {
    meaningfulDivergences.push(
      'Belum tampak pertentangan tajam antara latar akademik, minat yang dilaporkan, dan perspektif tipologi; tetap uji asumsi dengan menengok bidang tak terduga.'
    );
  }

  // Multi-dimensional fields
  if (hasQuantAnalyticalInterests && hasHumanSocialInterests) {
    multiDimensionalFields.push('Ilmu Ekonomi / Kebijakan Publik, Sistem Informasi, Teknik Industri, Psikologi Kuantitatif, dan Hukum Ekonomi-Teknologi (memadukan logika analitik & pemahaman manusia).');
  }
  if (hasQuantAnalyticalInterests && hasCreativeInterests) {
    multiDimensionalFields.push('Arsitektur, Desain Produk Industri, Desain UI/UX, dan Teknologi Pendidikan.');
  }
  if (multiDimensionalFields.length === 0) {
    multiDimensionalFields.push('Bidang interdisipliner seperti Sistem Informasi, Teknik Industri, Psikologi, Ekonomi Pembangunan, atau Teknologi Pendidikan.');
  }

  // Low-overlap worthwhile fields
  lowOverlapWorthExploring.push(
    'Psikologi, Ilmu Hukum, Ilmu Filsafat, Sosiologi, Ilmu Komunikasi, dan Desain Produk tidak selalu diajarkan sebagai mapel khusus di semua peminatan SMA, namun tetap terbuka dieksplorasi.'
  );

  // Information gaps
  if (intra.curiosityTopics.length === 0) {
    informationGaps.push('Topik rasa ingin tahu spesifik (Langkah 2) masih kosong—mengisinya akan menajamkan alasan rekomendasi.');
  }
  if (intra.cognitivePreferences.length === 0) {
    informationGaps.push('Preferensi aktivitas kognitif (Langkah 3) belum dipilih.');
  }
  if (intra.meaningfulActivities.length === 0) {
    informationGaps.push('Aktivitas bermakna di luar nilai rapor (Langkah 4) belum dilengkapi.');
  }
  if (!profile) {
    informationGaps.push('Masuk menggunakan akun DYNAMAP pribadi agar data Socionics, Enneagram, Psikosofi, dan riwayat refleksi Anda tersinkronisasi otomatis.');
  }
  if (informationGaps.length === 0) {
    informationGaps.push('Cobalah menguji asumsi jurusan favorit dengan membaca daftar mata kuliah riil semester 1–4 pada tab PTN.');
  }

  return {
    layerOneTypologies,
    layerTwoPreferences: {
      summaryPoints,
      highlightInterests: [
        ...intra.curiosityTopics,
        ...intra.disciplinesToDeepen,
        ...intra.enjoyedDespiteDifficulty,
      ],
      paradoxNotes,
    },
    layerThreeAcademicBackground: {
      studiedSummary,
      strengthHighlights,
      prepAreas,
      extracurricularNote:
        intra.extracurricularExperiences.trim() ||
        'Belum ada catatan proyek/ekstrakurikuler tambahan yang diisi.',
    },
    layerFourSynthesis: {
      convergences,
      academicSupportingInterests,
      meaningfulDivergences,
      multiDimensionalFields,
      lowOverlapWorthExploring,
      informationGaps,
    },
  };
}

// ==================== SECTION 7 & 13: THREE-LAYER RECOMMENDATION SYSTEM ====================
interface ProgramMatchContext {
  program: UniversityProgram;
  university: UniversityInstitution;
  interestHits: string[];
  cognitiveHits: string[];
  activityHits: string[];
  motivationHits: string[];
  workMatchNotes: string[];
  academicStrengthHits: string[];
  dislikedPenaltySubjects: string[];
  enjoyedDifficultHits: string[];
  missingKeySubjects: string[];
  typologyNote: string;
  typologySignalScore: number;
  hasDirectPreferenceSignal: boolean;
  totalExploratoryWeight: number;
  isOutsideSchoolSpec: boolean;
}

const CLUSTER_SIGNALS: Record<
  string,
  { cognitiveKeys: string[]; activityKeys: string[]; motivationKeys: string[]; interestKeys: string[] }
> = {
  'Teknik & Rekayasa': {
    cognitiveKeys: ['kuantitatif', 'merancang sistem', 'eksperimen', 'pola'],
    activityKeys: ['bereksperimen', 'merakit', 'mengelola proyek', 'menganalisis'],
    motivationKeys: ['inovasi', 'profesional', 'riset'],
    interestKeys: ['rekayasa', 'industri', 'fisika', 'kimia', 'arsitektur', 'material'],
  },
  'Komputasi & Data': {
    cognitiveKeys: ['pola', 'kuantitatif', 'merancang sistem', 'abstrak'],
    activityKeys: ['program komputer', 'menganalisis data', 'merancang'],
    motivationKeys: ['inovasi', 'otonomi', 'intelektual'],
    interestKeys: ['data', 'komputasi', 'algoritma', 'digital', 'sistem'],
  },
  'Sains Alam & Hayati': {
    cognitiveKeys: ['eksperimen', 'abstrak', 'biologis', 'pola', 'kuantitatif'],
    activityKeys: ['riset', 'bereksperimen', 'menganalisis'],
    motivationKeys: ['riset', 'intelektual'],
    interestKeys: ['fisika', 'kimia', 'biologi', 'bioteknologi', 'kebumian', 'lingkungan'],
  },
  'Kedokteran & Ilmu Kesehatan': {
    cognitiveKeys: ['biologis', 'perilaku', 'eksperimen'],
    activityKeys: ['membantu teman', 'riset', 'bereksperimen'],
    motivationKeys: ['kontribusi sosial', 'profesional', 'stabilitas'],
    interestKeys: ['kesehatan', 'biologi', 'bioteknologi', 'manusia'],
  },
  'Ekonomi, Bisnis & Manajemen': {
    cognitiveKeys: ['ekonomi', 'kuantitatif', 'pola', 'merancang sistem'],
    activityKeys: ['mengorganisasi', 'mengelola proyek', 'menganalisis data', 'berdiskusi'],
    motivationKeys: ['kemandirian finansial', 'kepemimpinan', 'profesional', 'inovasi'],
    interestKeys: ['ekonomi', 'bisnis', 'keuangan', 'industri', 'manajemen'],
  },
  'Ilmu Sosial & Perilaku': {
    cognitiveKeys: ['perilaku', 'struktur sosial', 'argumen', 'menafsirkan teks'],
    activityKeys: ['membantu teman', 'riset', 'berdiskusi', 'menulis', 'mengorganisasi'],
    motivationKeys: ['memahami manusia', 'kontribusi sosial', 'eksplorasi intelektual'],
    interestKeys: ['psikologi', 'sosiologi', 'komunikasi', 'manusia', 'kebijakan', 'budaya'],
  },
  'Humaniora & Filsafat': {
    cognitiveKeys: ['abstrak', 'menafsirkan teks', 'argumen', 'struktur sosial'],
    activityKeys: ['menulis', 'berdiskusi', 'riset'],
    motivationKeys: ['eksplorasi intelektual', 'memahami manusia', 'kreativitas', 'otonomi'],
    interestKeys: ['filsafat', 'sejarah', 'bahasa', 'linguistik', 'sastra', 'pemikiran'],
  },
  'Hukum & Tata Kelola': {
    cognitiveKeys: ['argumen', 'ekonomi, hukum', 'struktur sosial', 'menafsirkan teks'],
    activityKeys: ['berdiskusi', 'menulis', 'menganalisis', 'riset'],
    motivationKeys: ['kontribusi sosial', 'kepemimpinan', 'stabilitas', 'intelektual'],
    interestKeys: ['hukum', 'konstitusi', 'kebijakan', 'ekonomi'],
  },
  'Seni & Disiplin Kreatif': {
    cognitiveKeys: ['visual', 'artistik', 'menafsirkan teks'],
    activityKeys: ['merancang desain', 'konten visual', 'menulis', 'merakit'],
    motivationKeys: ['kreativitas', 'otonomi', 'inovasi'],
    interestKeys: ['desain', 'seni', 'arsitektur', 'media', 'visual'],
  },
  Pendidikan: {
    cognitiveKeys: ['perilaku', 'menafsirkan teks', 'abstrak'],
    activityKeys: ['mengajar', 'membantu teman', 'menulis', 'konten visual'],
    motivationKeys: ['kontribusi sosial', 'memahami manusia', 'eksplorasi intelektual'],
    interestKeys: ['pendidikan', 'pedagogi', 'teknologi belajar', 'psikologi'],
  },
  'Pertanian, Lingkungan & SDA': {
    cognitiveKeys: ['biologis', 'eksperimen', 'ekonomi', 'pola'],
    activityKeys: ['bereksperimen', 'riset', 'merakit'],
    motivationKeys: ['kontribusi sosial', 'riset', 'inovasi'],
    interestKeys: ['pertanian', 'pangan', 'lingkungan', 'bioteknologi', 'ekologi'],
  },
};

const INDONESIAN_STOPWORDS = new Set([
  'dan',
  'atau',
  'untuk',
  'dalam',
  'yang',
  'serta',
  'pada',
  'dari',
  'dengan',
  'sebagai',
  'secara',
  'lebih',
  'jauh',
  'ingin',
  'rasa',
  'bukan',
  'saat',
  'oleh',
  'akan',
  'bisa',
  'dapat',
  'agar',
  'tentang',
  'karena',
  'antara',
  'melalui',
  'maupun',
  'terhadap',
  'mengapa',
  'bagaimana',
  'apakah',
  'paling',
  'sering',
  'sangat',
  'tetap',
  'terus',
  'tanpa',
  'belum',
  'sudah',
  'masih',
  'hanya',
  'juga',
  'lain',
  'lainnya',
  'sendiri',
  'bersama',
  'memahami',
  'mengetahui',
  'mencari',
  'membangun',
  'membuat',
  'menjadi',
  'bekerja',
  'belajar',
  'nyata',
  'cara',
  'baru',
  'hal',
]);

const SHORT_DOMAIN_TOKENS = new Set(['seni', 'data', 'kode', 'gizi', 'film', 'kota', 'bank', 'alam']);

function tokenizeWords(phrases: string[]): string[] {
  return Array.from(
    new Set(
      phrases
        .flatMap((p) => norm(p).split(/[\s&,/().;:–-]+/))
        .map((w) => w.trim())
        .filter(
          (w) =>
            !INDONESIAN_STOPWORDS.has(w) &&
            (w.length >= 5 || SHORT_DOMAIN_TOKENS.has(w))
        )
    )
  );
}

export function buildThreeLayerRecommendations(params: {
  profile: Profile | null;
  exploration: UserExplorationData | null;
  userSubjects: UserSubjectEntry[];
  programs: UniversityProgram[];
  universities: UniversityInstitution[];
}): ThreeLayerRecommendationBundle {
  const { profile, exploration, userSubjects, programs, universities } = params;
  const uniMap = new Map(universities.map((u) => [u.id, u]));
  const intra = getEffectiveIntrapersonal(exploration, profile);

  const takenSubjectNames = new Set(userSubjects.filter((s) => s.taken).map((s) => norm(s.subjectName)));
  const dislikedSet = new Set(intra.dislikedDespiteHighScore.map(norm));
  const enjoyedDiffSet = new Set(intra.enjoyedDespiteDifficulty.map(norm));

  const allInterestPhrases = Array.from(
    new Set(
      [
        ...intra.curiosityTopics,
        ...intra.disciplinesToDeepen,
        ...intra.enjoyedSubjects,
        ...(profile?.academicInterests || []),
        ...(exploration?.interestTopics || []),
        intra.interestingProblems,
        intra.voluntaryTopics,
        intra.academicInterestNotes,
        intra.careerAspirationsNotes,
      ].filter(Boolean)
    )
  );
  const interestKeywords = tokenizeWords(allInterestPhrases);

  const socCode = profile?.typology.socionics || '';
  const socSpec = socCode ? SOCIONICS_TYPES[socCode as SocionicsCode] : null;
  const ennCore = profile?.typology.enneagramCore || null;
  const psyParsed = parsePsychosophyPositions(profile?.typology.psychosophyCode || '');

  const contexts: ProgramMatchContext[] = [];

  for (const program of programs) {
    const uni = uniMap.get(program.universityId);
    if (!uni) continue;

    const gap = analyzeAcademicGap(userSubjects, program, uni);
    const missingKeySubjects = gap.missingOrUnstudiedSubjects.filter((m) => !m.includes('(pendukung)'));
    const clusterSig = CLUSTER_SIGNALS[program.disciplineCluster] || {
      cognitiveKeys: [],
      activityKeys: [],
      motivationKeys: [],
      interestKeys: [],
    };

    const programCorpus = norm(
      [
        program.name,
        program.disciplineCluster,
        program.description,
        program.studyEnvironment,
        ...program.curriculumFocus,
        ...program.thinkingPatterns,
        ...(program.concentrations || []),
      ].join(' ')
    );

    // 1. Direct interest hits (including exact cluster deepening matches)
    const interestHits: string[] = [];
    if (intra.disciplinesToDeepen.some((d) => norm(d) === norm(program.disciplineCluster))) {
      interestHits.push(`Rumpun pilihan: ${program.disciplineCluster}`);
    }
    for (const phrase of allInterestPhrases) {
      const pTokens = tokenizeWords([phrase]);
      if (pTokens.some((tok) => programCorpus.includes(tok)) && !interestHits.includes(phrase)) {
        interestHits.push(phrase);
      }
    }
    for (const kw of clusterSig.interestKeys) {
      if (interestKeywords.some((ik) => ik.includes(kw) || kw.includes(ik)) && !interestHits.includes(kw)) {
        interestHits.push(`Topik selaras (${kw})`);
      }
    }

    // 2. Cognitive preferences
    const cognitiveHits = intra.cognitivePreferences.filter((cp) => {
      const lower = norm(cp);
      return clusterSig.cognitiveKeys.some((ck) => lower.includes(ck)) || tokenizeWords([cp]).some((w) => programCorpus.includes(w));
    });

    // 3. Meaningful activities
    const activityHits = intra.meaningfulActivities.filter((act) => {
      const lower = norm(act);
      return clusterSig.activityKeys.some((ak) => lower.includes(ak)) || tokenizeWords([act]).some((w) => programCorpus.includes(w));
    });

    // 4. Motivations
    const motivationHits = intra.personalMotivationsRanked.filter((m) => {
      const lower = norm(m);
      return clusterSig.motivationKeys.some((mk) => lower.includes(mk));
    });

    // 5. Work environment connections across all 8 dimensions
    const workMatchNotes: string[] = [];
    const wp = intra.workPreferences;
    if (wp.focus === 'Riset & Analisis' && /riset|penelitian|analitik|teori|ilmu|filsafat|sosiologi|kimia|fisika|aktuaria|ekonomi/i.test(programCorpus)) {
      workMatchNotes.push('Cocok dengan preferensi kerja berfokus Riset & Analisis.');
    }
    if (wp.focus === 'Aplikasi Praktis' && /teknik|desain|bisnis|terapan|manufaktur|klinis|pendidikan|sistem informasi|arsitektur/i.test(programCorpus)) {
      workMatchNotes.push('Selaras dengan preferensi Aplikasi Praktis di dunia nyata.');
    }
    if (wp.setting === 'Lapangan / Dinamis' && /geologi|kelautan|kehutanan|antropologi|sosiologi|film|lingkungan|kesehatan masyarakat|sipil|agroteknologi/i.test(programCorpus)) {
      workMatchNotes.push('Menawarkan porsi aktivitas lapangan/dinamis di luar ruang meja semata.');
    }
    if (wp.setting === 'Kantor / Lab' && /laboratorium|riset|aktuaria|akuntansi|komputer|data|kimia|farmasi|biokimia/i.test(programCorpus)) {
      workMatchNotes.push('Selaras dengan lingkungan kerja terpusat di laboratorium atau kantor analitik.');
    }
    if (wp.responsibility === 'Fokus Interpersonal' && /psikologi|komunikasi|konseling|pendidikan|kedokteran|keperawatan|sosial|manajemen|hukum/i.test(programCorpus)) {
      workMatchNotes.push('Banyak melibatkan interaksi dan tanggung jawab antarmanusia.');
    }
    if (wp.responsibility === 'Fokus Teknis' && /teknik|informatika|komputer|fisika|kimia|aktuaria|statistika|geofisika/i.test(programCorpus)) {
      workMatchNotes.push('Menonjolkan penguasaan keahlian teknis dan rekayasa terukur.');
    }
    if (wp.collaboration === 'Mandiri' && /filsafat|sastra|fisika|matematika|aktuaria|ilmu komputer|kimia/i.test(programCorpus)) {
      workMatchNotes.push('Memberi ruang kerja mandiri mendalam dan eksplorasi individual.');
    }
    if (wp.collaboration === 'Kolaboratif' && /manajemen|teknik industri|sistem informasi|kedokteran|komunikasi|pendidikan|arsitektur/i.test(programCorpus)) {
      workMatchNotes.push('Kuat pada proyek kelompok dan kolaborasi lintas peran.');
    }
    if (wp.structure === 'Terstruktur Jelas' && /akuntansi|aktuaria|hukum|kedokteran|teknik sipil|farmasi/i.test(programCorpus)) {
      workMatchNotes.push('Memiliki alur kurikulum, protokol, atau standar profesi yang terstruktur jelas.');
    }
    if (wp.structure === 'Fleksibel Eksploratif' && /filsafat|desain|sosiologi|antropologi|komunikasi|arsitektur|bioteknologi/i.test(programCorpus)) {
      workMatchNotes.push('Memberi kebebasan eksplorasi gagasan dan pendekatan kreatif/interdisipliner.');
    }
    if (wp.decisionStyle === 'Keputusan Mandiri' && /riset|filsafat|sastra|matematika|ilmu komputer|desain/i.test(programCorpus)) {
      workMatchNotes.push('Mendukung otonomi penarikan kesimpulan & analisis mandiri.');
    }
    if (wp.decisionStyle === 'Koordinasi Tim' && /manajemen|bisnis|sistem informasi|teknik industri|kesehatan masyarakat|kebijakan/i.test(programCorpus)) {
      workMatchNotes.push('Terbiasa dengan pengambilan keputusan bersama pemangku kepentingan.');
    }
    if (wp.pace === 'Ritme Dinamis' && /komunikasi|bisnis|kewirausahaan|manajemen|produk|kedokteran/i.test(programCorpus)) {
      workMatchNotes.push('Menyajikan dinamika kasus yang cepat berubah dan adaptif.');
    }
    if (wp.pace === 'Ritme Terprediksi' && /aktuaria|akuntansi|biokimia|kimia|perpustakaan|farmasi/i.test(programCorpus)) {
      workMatchNotes.push('Ritme studi/kerja bertahap dengan metodologi yang terprediksi.');
    }
    if (wp.visibility === 'Berhadapan Publik' && /hukum|komunikasi|pendidikan|psikologi|kedokteran|manajemen|sosial/i.test(programCorpus)) {
      workMatchNotes.push('Banyak melatih komunikasi publik, advokasi, atau pelayanan langsung.');
    }
    if (wp.visibility === 'Di Balik Layar' && /data|ilmu komputer|informatika|statistika|aktuaria|kimia|biokimia|fisika/i.test(programCorpus)) {
      workMatchNotes.push('Berperan kuat di balik layar dalam perancangan model, sistem, atau riset.');
    }

    // 6. Academic strengths & paradoxes
    const academicStrengthHits = gap.strengthAreas;
    const dislikedPenaltySubjects = program.keyHighSchoolSubjects.filter((s) => dislikedSet.has(norm(s)));
    const enjoyedDifficultHits = program.keyHighSchoolSubjects.filter((s) => enjoyedDiffSet.has(norm(s)));

    // 7. Interpretive typology notes (STRICTLY interpretive, NEVER determines eligibility!)
    let typologyNote =
      'Perspektif tipologi bersifat suplemen refleksi: siswa dari profil mana pun dapat menimbang kesesuaian ritme belajar program ini.';
    let typologySignalScore = 0;

    if (socSpec) {
      const lead = socSpec.modelA[0];
      const crea = socSpec.modelA[1];
      if ((lead === 'Ti' || crea === 'Ti') && /filsafat|hukum|ilmu komputer|informatika|matematika|fisika|aktuaria|ekonomi/i.test(programCorpus)) {
        typologySignalScore += 1.5;
        typologyNote = `Perspektif Socionics ${socSpec.code} (${socSpec.modelA[0]}/${socSpec.modelA[1]}): kepekaan pada konsistensi definisi dan struktur logis Ti dapat memberi sudut pandang menarik saat membedah sistem argumen atau model konseptual di prodi ini.`;
      } else if ((lead === 'Te' || crea === 'Te') && /industri|ekonomi|manajemen|akuntansi|data|teknik|kebijakan/i.test(programCorpus)) {
        typologySignalScore += 1.5;
        typologyNote = `Perspektif Socionics ${socSpec.code} (${socSpec.modelA[0]}/${socSpec.modelA[1]}): perhatian Te pada efisiensi bukti empiris dan mekanisme nyata dapat memperkaya penelaahan proses kerja program ini.`;
      } else if ((lead === 'Fi' || lead === 'Fe' || crea === 'Fi' || crea === 'Fe') && /psikologi|sosiologi|komunikasi|konseling|pendidikan|sastra|antropologi|hukum|kesehatan/i.test(programCorpus)) {
        typologySignalScore += 1.5;
        typologyNote = `Perspektif Socionics ${socSpec.code} (${socSpec.modelA[0]}/${socSpec.modelA[1]}): kepekaan terhadap relasi personal dan atmosfer sosial memberi perspektif bermakna ketika mempelajari manusia dan komunikasi.`;
      } else if ((lead === 'Ne' || lead === 'Ni' || crea === 'Ne' || crea === 'Ni') && /desain|arsitektur|filsafat|komunikasi|bioteknologi|strategi|inovasi|film|animasi/i.test(programCorpus)) {
        typologySignalScore += 1.5;
        typologyNote = `Perspektif Socionics ${socSpec.code} (${socSpec.modelA[0]}/${socSpec.modelA[1]}): perhatian intuitif pada pola kemungkinan atau arah jangka panjang dapat menumbuhkan rasa ingin tahu lintas ide.`;
      }
    }
    if (ennCore) {
      if ((ennCore === 4 || ennCore === 9 || ennCore === 2) && /psikologi|konseling|seni|desain|sastra|kesehatan|pendidikan/i.test(programCorpus)) {
        typologySignalScore += 0.8;
      } else if ((ennCore === 5 || ennCore === 1 || ennCore === 6) && /riset|filsafat|hukum|aktuaria|fisika|kimia|data|biokimia/i.test(programCorpus)) {
        typologySignalScore += 0.8;
      } else if ((ennCore === 3 || ennCore === 7 || ennCore === 8) && /manajemen|kewirausahaan|bisnis|hukum|komunikasi|industri|kebijakan/i.test(programCorpus)) {
        typologySignalScore += 0.8;
      }
    }
    if (psyParsed.valid) {
      const p1 = psyParsed.placements[0].aspect;
      if (p1 === 'E' && /seni|desain|film|musik|sastra|komunikasi|psikologi/i.test(programCorpus)) {
        typologySignalScore += 0.5;
      }
      if (p1 === 'L' && /filsafat|hukum|matematika|fisika|komputer|ekonomi/i.test(programCorpus)) {
        typologySignalScore += 0.5;
      }
    }

    const isOutsideSchoolSpec =
      missingKeySubjects.length > 0 ||
      program.keyHighSchoolSubjects.every((ks) => !takenSubjectNames.has(norm(ks)) || ['Bahasa Indonesia', 'Bahasa Inggris', 'Matematika Wajib', 'PPKn', 'Sejarah', 'Seni Budaya'].includes(ks));

    const hasDirectPreferenceSignal =
      interestHits.length > 0 || cognitiveHits.length > 0 || activityHits.length > 0 || enjoyedDifficultHits.length > 0;

    // Exploratory affinity weight (purely internal ordering, NEVER shown as %)
    let weight = 0;
    weight += interestHits.length * 4.5;
    weight += cognitiveHits.length * 2.8;
    weight += activityHits.length * 2.4;
    weight += motivationHits.length * 1.8;
    weight += workMatchNotes.length * 1.4;
    weight += enjoyedDifficultHits.length * 3.0;
    weight += gap.studiedRelevantSubjects.filter((s) => s.matchRole === 'Utama').length * 2.0;
    weight += academicStrengthHits.length * 1.5;
    weight += typologySignalScore;
    weight -= dislikedPenaltySubjects.length * 4.0; // Respect dislike even if high score!

    contexts.push({
      program,
      university: uni,
      interestHits,
      cognitiveHits,
      activityHits,
      motivationHits,
      workMatchNotes,
      academicStrengthHits,
      dislikedPenaltySubjects,
      enjoyedDifficultHits,
      missingKeySubjects,
      typologyNote,
      typologySignalScore,
      hasDirectPreferenceSignal,
      totalExploratoryWeight: weight,
      isOutsideSchoolSpec,
    });
  }

  // Build Category 1: Recommended Exploration (strongest convergence across direct interests + preferences + background)
  const sortedAll = [...contexts].sort((a, b) => b.totalExploratoryWeight - a.totalExploratoryWeight);
  const recommendedPool: ProgramMatchContext[] = [];
  const usedIds = new Set<string>();
  const usedNames = new Set<string>();

  for (const ctx of sortedAll) {
    if (recommendedPool.length >= 6) break;
    const baseName = norm(ctx.program.name.split('(')[0]);
    if (usedNames.has(baseName)) continue;
    // Prefer programs where there isn't a disliked penalty overriding everything, and either direct interest or solid multi-dimensional match
    if (ctx.dislikedPenaltySubjects.length === 0 || ctx.hasDirectPreferenceSignal) {
      recommendedPool.push(ctx);
      usedIds.add(ctx.program.id);
      usedNames.add(baseName);
    }
  }

  // Build Category 2: Alternative Exploration (meaningful interdisciplinary/secondary connections, varied clusters)
  const alternativePool: ProgramMatchContext[] = [];
  const recClusters = new Set(recommendedPool.map((r) => r.program.disciplineCluster));
  const altCandidates = sortedAll.filter((c) => !usedIds.has(c.program.id));
  // First pick diverse clusters with preference alignment
  for (const ctx of altCandidates) {
    if (alternativePool.length >= 6) break;
    const baseName = norm(ctx.program.name.split('(')[0]);
    if (usedNames.has(baseName)) continue;
    const addsDiversity = !recClusters.has(ctx.program.disciplineCluster) || alternativePool.length >= 3;
    if (addsDiversity && (ctx.hasDirectPreferenceSignal || ctx.motivationHits.length > 0 || ctx.workMatchNotes.length > 0 || ctx.program.thinkingPatterns.length > 0)) {
      alternativePool.push(ctx);
      usedIds.add(ctx.program.id);
      usedNames.add(baseName);
    }
  }

  // Build Category 3: UNEXPECTED POSSIBILITIES (CRITICAL! Actively introduce non-obvious fields outside school specialization)
  const nonObviousClusters = new Set([
    'Ilmu Sosial & Perilaku',
    'Humaniora & Filsafat',
    'Hukum & Tata Kelola',
    'Seni & Disiplin Kreatif',
    'Pendidikan',
    'Kedokteran & Ilmu Kesehatan',
    'Pertanian, Lingkungan & SDA',
  ]);

  const unexpectedCandidates = sortedAll
    .filter((c) => !usedIds.has(c.program.id))
    .map((ctx) => {
      // Prioritize fields outside the student's current specialization / missing a traditional SMA subject, YET traceable to cognitive/motivational/typological/activity patterns!
      let surpriseValue = 0;
      if (nonObviousClusters.has(ctx.program.disciplineCluster)) surpriseValue += 5;
      if (ctx.missingKeySubjects.length > 0) surpriseValue += 4;
      if (ctx.cognitiveHits.length > 0 || ctx.activityHits.length > 0 || ctx.motivationHits.length > 0) surpriseValue += 4;
      if (ctx.typologySignalScore > 0) surpriseValue += 3;
      if (ctx.interestHits.length > 0) surpriseValue += 2.5;
      // Ensure classic high-value unexpected fields (Filsafat, Psikologi, Hukum, Sosiologi, Komunikasi, DKV/Desain) appear strongly when traceable
      if (/psikologi|hukum|filsafat|sosiologi|komunikasi|desain|kriminologi|antropologi|bioteknologi|kebijakan/i.test(ctx.program.name)) {
        surpriseValue += 2;
      }
      return { ctx, surpriseValue };
    })
    .sort((a, b) => b.surpriseValue - a.surpriseValue);

  const unexpectedPool: ProgramMatchContext[] = [];
  const unexpectedClustersUsed = new Set<string>();
  for (const { ctx } of unexpectedCandidates) {
    if (unexpectedPool.length >= 6) break;
    const baseName = norm(ctx.program.name.split('(')[0]);
    if (usedNames.has(baseName)) continue;
    // Encourage cross-cluster diversity in unexpected possibilities
    if (!unexpectedClustersUsed.has(ctx.program.disciplineCluster) || unexpectedPool.length >= 4) {
      unexpectedPool.push(ctx);
      usedIds.add(ctx.program.id);
      usedNames.add(baseName);
      unexpectedClustersUsed.add(ctx.program.disciplineCluster);
    }
  }

  const toCard = (
    ctx: ProgramMatchContext,
    layer: ThreeLayerMajorRecommendation['layer']
  ): ThreeLayerMajorRecommendation => {
    const gap = analyzeAcademicGap(userSubjects, ctx.program, ctx.university);

    const directEvidence: string[] = [
      ...(ctx.interestHits.length > 0
        ? [`Topik minat/rasa ingin tahu terkait: ${ctx.interestHits.slice(0, 3).join(', ')}.`]
        : []),
      ...(ctx.cognitiveHits.length > 0
        ? [`Preferensi aktivitas kognitif: ${ctx.cognitiveHits.slice(0, 2).join('; ')}.`]
        : []),
      ...(ctx.activityHits.length > 0
        ? [`Aktivitas bermakna pilihan: ${ctx.activityHits.slice(0, 2).join(', ')}.`]
        : []),
      ...(ctx.enjoyedDifficultHits.length > 0
        ? [`Tetap menikmati ${ctx.enjoyedDifficultHits.join(', ')} meski menantang.`]
        : []),
    ];
    if (directEvidence.length === 0) {
      directEvidence.push(
        `Belum banyak minat langsung tercentang ke klaster ini; terhubung melalui motivasi (${ctx.motivationHits[0] || intra.workPreferences.focus}) atau perluasan wawasan lintas disiplin.`
      );
    }

    const academicEvidence =
      gap.studiedRelevantSubjects.length > 0
        ? gap.studiedRelevantSubjects.map(
            (s) => `${s.subjectName} (${s.matchRole}) — penguasaan ${s.proficiency}.`
          )
        : [
            `Tidak membutuhkan mapel peminatan spesifik yang sama persis di SMA; bekal literasi dan penalaran umum tetap relevan.`,
          ];

    const trail: RecommendationReasoningTrail = {
      directUserEvidence: directEvidence,
      academicEvidence,
      typologyInterpretation: [ctx.typologyNote],
      inferredRelationship: [
        `Pola pikir prodi (${ctx.program.thinkingPatterns.join(', ')}) terhubung dengan fokus eksplorasi Anda pada ${ctx.cognitiveHits[0] || ctx.motivationHits[0] || ctx.program.disciplineCluster}.`,
      ],
      uncertainAssumptions: [
        ctx.missingKeySubjects.length > 0
          ? `Anda belum mengambil ${ctx.missingKeySubjects.join(', ')} di SMA; diasumsikan Anda bersedia mempelajari pengantarnya bila tertarik melanjutkan ke program ini.`
          : 'Kesenangan pada topik pengantar SMA diasumsikan berlanjut pada beban tugas proyek/riset tingkat universitas—perlu diuji lewat silabus riil.',
        'Tipologi bukan pengukur kemampuan: dua siswa bertipe sama akan memiliki kecocokan berbeda jika minat dan nilai pribadinya berbeda.',
      ],
      additionalInfoNeeded: [
        `Silabus mata kuliah semester 1–4 resmi ${ctx.university.shortName} serta syarat mapel pendukung SNBP/SNBT tahun ajaran terbaru.`,
        `Bagaimana kesan mahasiswa/alumni ${ctx.program.name} mengenai porsi teori vs praktik harian.`,
      ],
    };

    const whyIncluded =
      layer === 'Eksplorasi Direkomendasikan'
        ? `Menunjukkan irisan terkuat di berbagai dimensi profil Anda: ${[
            ctx.interestHits.length > 0 ? 'minat langsung' : '',
            ctx.cognitiveHits.length > 0 ? 'preferensi aktivitas kognitif' : '',
            gap.studiedRelevantSubjects.length > 0 ? 'fondasi mapel SMA relevan' : '',
            ctx.motivationHits.length > 0 ? 'keselarasan motivasi pribadi' : '',
          ]
            .filter(Boolean)
            .join(', ') || 'potensi eksplorasi seimbang'}.`
        : layer === 'Eksplorasi Alternatif'
        ? `Jalur alternatif bermakna di rumpun ${ctx.program.disciplineCluster} yang memadukan ${ctx.cognitiveHits[0] || ctx.workMatchNotes[0] || ctx.program.thinkingPatterns[0]} dengan sudut penerapan profesional yang berbeda.`
        : `Disiplin lintas bidang (${ctx.program.disciplineCluster}) yang mungkin belum terpikirkan dari label peminatan SMA Anda, namun memiliki keterhubungan rasional dengan profil Anda.`;

    const importantCompetencies = ctx.program.competencyRequirements
      ? [
          ctx.program.competencyRequirements.analytical,
          ctx.program.competencyRequirements.communication,
          ctx.program.competencyRequirements.research,
        ]
      : [
          `Pola berpikir: ${ctx.program.thinkingPatterns.join(', ')}`,
          `Fokus kurikulum: ${ctx.program.curriculumFocus.slice(0, 3).join(', ')}`,
        ];

    const potentialChallenges = [
      ...(ctx.missingKeySubjects.length > 0
        ? [
            `Kesenjangan materi pengantar pada ${ctx.missingKeySubjects.join(', ')} (dapat dijembatani sebelum perkuliahan, bukan larangan memilih).`,
          ]
        : []),
      ...(ctx.dislikedPenaltySubjects.length > 0
        ? [
            `Catatan hati-hati: Anda menandai kurang menyukai ${ctx.dislikedPenaltySubjects.join(', ')} meski nilainya baik—periksa bobot mata pelajaran tersebut dalam kurikulum prodi ini.`,
          ]
        : []),
      `Ritme belajar di prodi ini: ${ctx.program.studyEnvironment}`,
    ];

    const whatToInvestigate = [
      `Buka daftar mata kuliah inti (${(ctx.program.coreCourses || ctx.program.curriculumFocus).slice(0, 3).join(', ')}) di situs resmi ${ctx.university.shortName}.`,
      `Konfirmasi syarat jalur SNBP/SNBT/Mandiri terbaru di ${ctx.program.provenance.officialUrl}.`,
      `Coba satu bacaan pengantar atau proyek mini terkait untuk menguji apakah ketertarikan bertahan.`,
    ];

    const baseCard: ThreeLayerMajorRecommendation = {
      program: ctx.program,
      university: ctx.university,
      layer,
      whyIncluded,
      relevantInterests:
        ctx.interestHits.length > 0
          ? ctx.interestHits
          : [`Pola minat terbuka pada: ${ctx.program.thinkingPatterns.join(', ')}`],
      relevantAcademicExperiences: academicEvidence,
      typologicalPerspectives: ctx.typologyNote,
      importantCompetencies,
      potentialChallenges,
      whatToInvestigate,
      reasoningTrail: trail,
      explorationNote:
        'Disajikan sebagai opsi eksplorasi berbasis bukti yang dapat dibandingkan dan disimpan—bukan prediksi kepastian kelulusan atau karier tunggal.',
    };

    if (layer === 'Kemungkinan Tak Terduga') {
      baseCard.unexpectedWhyNotObvious =
        ctx.missingKeySubjects.length > 0
          ? `Tersembunyi dari pandangan pertama karena program ini berada di rumpun ${ctx.program.disciplineCluster} dan biasanya dikaitkan dengan mapel ${ctx.missingKeySubjects.join(', ')} yang belum Anda ambil di SMA.`
          : `Berada di rumpun ${ctx.program.disciplineCluster} yang sering tidak otomatis dipetakan oleh siswa berlatar peminatan ${exploration?.specializationLabel || 'FISKIM MATONOMI'}.`;

      baseCard.unexpectedConnectionPoints = [
        ...(ctx.cognitiveHits.length > 0
          ? [`Preferensi kognitif Anda (${ctx.cognitiveHits.slice(0, 2).join(', ')}) terpakai langsung dalam ${ctx.program.thinkingPatterns[0]}.`]
          : []),
        ...(ctx.activityHits.length > 0
          ? [`Aktivitas bermakna Anda (${ctx.activityHits.slice(0, 2).join(', ')}) relevan dengan keseharian belajar prodi ini.`]
          : []),
        ...(ctx.motivationHits.length > 0
          ? [`Sejalan dengan prioritas motivasi Anda: ${ctx.motivationHits.slice(0, 2).join(', ')}.`]
          : []),
        ctx.typologyNote,
      ];

      baseCard.unexpectedNewKnowledgeNeeded =
        gap.additionalTopicsToLearn.length > 0
          ? gap.additionalTopicsToLearn
          : [`Dasar keilmuan pengantar ${ctx.program.disciplineCluster} dan literasi bacaan ilmiah bidang ini.`];

      baseCard.unexpectedWhyWorthExploring = `Ketidakhadiran mata pelajaran tertentu di SMA tidak berarti Anda tidak mampu berkembang di ${ctx.program.name}. Latar analitis/ekonomi/literasi Anda justru sering membawa perspektif segar yang langka di bidang ini.`;
    }

    return baseCard;
  };

  return {
    recommended: recommendedPool.map((c) => toCard(c, 'Eksplorasi Direkomendasikan')),
    alternative: alternativePool.map((c) => toCard(c, 'Eksplorasi Alternatif')),
    unexpected: unexpectedPool.map((c) => toCard(c, 'Kemungkinan Tak Terduga')),
    explanatoryNote:
      'Pengurutan bersifat relevansi eksploratif berdasarkan informasi yang tersedia saat ini—BUKAN probabilitas keberhasilan akademik dan TANPA skor persentase kecocokan palsu. Dua siswa dengan tipologi sama dapat menerima hasil berbeda ketika minat, nilai, dan pengalaman belajarnya berbeda.',
  };
}

// ==================== SECTION 11: CAREER PREFERENCE MATCHING ====================
export function rankCareersByPreferences(params: {
  careers: CareerRecord[];
  exploration: UserExplorationData | null;
  profile: Profile | null;
  recommendedProgramIds: string[];
}): { career: CareerRecord; connectionReasons: string[] }[] {
  const { careers, exploration, profile, recommendedProgramIds } = params;
  const intra = getEffectiveIntrapersonal(exploration, profile);
  const recProgSet = new Set(recommendedProgramIds);
  const wp = intra.workPreferences;
  const keywords = tokenizeWords([
    ...intra.curiosityTopics,
    ...intra.disciplinesToDeepen,
    ...intra.meaningfulActivities,
    ...intra.personalMotivationsRanked,
    ...(profile?.academicInterests || []),
    intra.careerAspirationsNotes,
    intra.personalValuesNotes,
  ]);

  return careers
    .map((career) => {
      const reasons: string[] = [];
      let score = 0;

      const linkedRecs = career.relatedProgramIds.filter((pid) => recProgSet.has(pid));
      if (linkedRecs.length > 0) {
        score += 3.5 * linkedRecs.length;
        reasons.push('Terhubung langsung dengan program studi pada hasil eksplorasi Anda.');
      }

      const corpus = norm(
        [
          career.title,
          career.cluster,
          career.summary,
          career.dailyWorkAndProblemSolving,
          career.workEnvironment,
          career.collaborationAndInteraction,
          career.educationPathway || '',
          ...career.coreSkills,
          ...career.workMotivations,
          ...(career.workPreferenceTags || []),
        ].join(' ')
      );

      const corpusTokens = new Set(corpus.split(/[\s&,/().;:–-]+/).filter(Boolean));
      const kwHits = keywords.filter((k) => corpusTokens.has(k));
      if (kwHits.length > 0) {
        score += kwHits.length * 1.5;
        reasons.push(`Menyentuh minat/aktivitas Anda (${kwHits.slice(0, 3).join(', ')}).`);
      }

      if (wp.focus === 'Riset & Analisis' && /riset|peneliti|analisis|analis|data|ekonom|sosiolog|psikolog|filsafat/i.test(corpus)) {
        score += 2;
        reasons.push('Cocok dengan preferensi fokus Riset & Analisis.');
      }
      if (wp.focus === 'Aplikasi Praktis' && /engineer|desainer|arsitek|manajer|praktik|produk|medis|advokat|akuntan/i.test(corpus)) {
        score += 2;
        reasons.push('Cocok dengan preferensi Aplikasi Praktis.');
      }
      if (wp.setting === 'Lapangan / Dinamis' && /lapangan|survei|pabrik|ekspedisi|produksi|komunitas|geoscientist|ekologi/i.test(corpus)) {
        score += 1.8;
        reasons.push('Melibatkan kerja lapangan/dinamis.');
      }
      if (wp.setting === 'Kantor / Lab' && /laboratorium|kantor|bank|analis|akuntan|aktuaris|software/i.test(corpus)) {
        score += 1.5;
        reasons.push('Berbasis ruang kerja kantor analitik atau laboratorium.');
      }
      if (wp.collaboration === 'Mandiri' && /mandiri|riset|peneliti|penulis|arsitek informasi|software|aktuaris|laboratorium/i.test(corpus)) {
        score += 1.6;
        reasons.push('Mendukung pola kerja mandiri terfokus.');
      }
      if (wp.collaboration === 'Kolaboratif' && /kolaboratif|lintas tim|lintas fungsi|komunikasi|manajer|fasilitator|koordinator/i.test(corpus)) {
        score += 1.6;
        reasons.push('Mengutamakan kerja kolaboratif antartim.');
      }
      if (wp.structure === 'Terstruktur Jelas' && /standar|regulasi|audit|protokol|kepatuhan|aktuaria|akuntan|hukum/i.test(corpus)) {
        score += 1.5;
        reasons.push('Bekerja dengan standar & kerangka aturan yang terstruktur.');
      }
      if (wp.structure === 'Fleksibel Eksploratif' && /fleksibel|eksploratif|inovasi|desain|kreatif|riset|kebijakan/i.test(corpus)) {
        score += 1.5;
        reasons.push('Memberi keleluasaan eksplorasi gagasan & metode baru.');
      }
      if (wp.responsibility === 'Fokus Interpersonal' && /psikolog|pendidik|komunikasi|dokter|perawat|product manager|wawancara|konselor|advokat/i.test(corpus)) {
        score += 1.8;
        reasons.push('Menekankan tanggung jawab & kolaborasi antarmanusia.');
      }
      if (wp.responsibility === 'Fokus Teknis' && /engineer|data|software|material|analis|teknis|kimia|fisika|geologi/i.test(corpus)) {
        score += 1.8;
        reasons.push('Menekankan pemecahan masalah teknis & metodologis.');
      }
      if (wp.decisionStyle === 'Keputusan Mandiri' && /independen|auditor|peneliti|arsitek|desainer|dokter/i.test(corpus)) {
        score += 1.3;
        reasons.push('Membutuhkan ketajaman penilaian & keputusan mandiri.');
      }
      if (wp.decisionStyle === 'Koordinasi Tim' && /koordinasi|pemangku kepentingan|manajer|kebijakan|konsultan|product/i.test(corpus)) {
        score += 1.3;
        reasons.push('Berjalan lewat koordinasi keputusan bersama tim.');
      }
      if (wp.pace === 'Ritme Dinamis' && /dinamis|cepat|krisis|produk|media|bisnis|operasional|negosiasi/i.test(corpus)) {
        score += 1.4;
        reasons.push('Berjalan pada ritme kerja dinamis & responsif.');
      }
      if (wp.pace === 'Ritme Terprediksi' && /terstruktur|protokol|aktuaria|akuntansi|laboratorium|arsip|kurikulum/i.test(corpus)) {
        score += 1.4;
        reasons.push('Menawarkan ritme kerja yang relatif terukur & konsisten.');
      }
      if (wp.visibility === 'Berhadapan Publik' && /publik|advokasi|pendidik|komunikasi|dokter|psikolog|diplomat|klien/i.test(corpus)) {
        score += 1.5;
        reasons.push('Berperan langsung berhadapan dengan publik atau klien.');
      }
      if (wp.visibility === 'Di Balik Layar' && /data|software|riset|laboratorium|analis|aktuaria|perancangan sistem/i.test(corpus)) {
        score += 1.5;
        reasons.push('Berkontribusi strategis di balik layar lewat analisis/sistem.');
      }

      if (reasons.length === 0) {
        reasons.push(`Alternatif profesi di klaster ${career.cluster} untuk memperluas wawasan lingkungan kerja.`);
      }

      return { career, connectionReasons: reasons, score };
    })
    .sort((a, b) => b.score - a.score)
    .map(({ career, connectionReasons }) => ({ career, connectionReasons }));
}
