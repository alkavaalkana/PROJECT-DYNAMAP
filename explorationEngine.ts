import { SOCIONICS_TYPES, parseJungianNotation } from '../data/socionicsData';
import { validatePsychosophyCode } from './psychosophy';
import type {
  AcademicGapReport,
  AcademicRecommendationCategory,
  AcademicRecommendationResult,
  AcademicReflectionRecord,
  ConceptComparisonResult,
  ConceptNode,
  ExplorationScenario,
  LearningPreferences,
  PersonalConceptStatus,
  PersonalKnowledgeEdge,
  PersonalKnowledgeNode,
  Profile,
  QuadraName,
  ReflectionRecord,
  SocionicsCode,
  UniversityInstitution,
  UniversityProgram,
  UserExplorationData,
  UserSubjectEntry,
} from '../types/dynamap';

function normalizeStr(v: string): string {
  return v.trim().toLowerCase();
}

export function buildPersonalKnowledgeGraph(params: {
  profile: Profile | null;
  exploration: UserExplorationData | null;
  interpersonalReflectionsCount: number;
  academicReflectionsCount: number;
  isOwnerViewingPrivate: boolean;
}): { nodes: PersonalKnowledgeNode[]; edges: PersonalKnowledgeEdge[] } {
  const {
    profile,
    exploration,
    interpersonalReflectionsCount,
    academicReflectionsCount,
    isOwnerViewingPrivate,
  } = params;

  const statuses = exploration?.conceptStatuses || {};
  const layout = exploration?.preferredMapLayout || {};
  const getPos = (id: string, fallbackX: number, fallbackY: number) => ({
    x: layout[id]?.x ?? fallbackX,
    y: layout[id]?.y ?? fallbackY,
  });

  const getStatus = (id: string, defaultStatus: PersonalConceptStatus): PersonalConceptStatus =>
    statuses[id] || defaultStatus;

  const displayName = profile?.displayName || 'Penjelajah DYNAMAP (Mode Simulasi)';
  const soc = profile?.typology.socionics || '';
  const quadra = profile?.typology.quadra || '';
  const enn = profile?.typology.enneagramRaw || (profile?.typology.enneagramCore ? String(profile.typology.enneagramCore) : '');
  const psy = profile?.typology.psychosophyCode || profile?.typology.psychosophySelfReported || '';
  const jung = profile?.typology.jungian || '';

  const nodes: PersonalKnowledgeNode[] = [];
  const edges: PersonalKnowledgeEdge[] = [];

  const rootPos = getPos('pm-root', 460, 260);
  nodes.push({
    id: 'pm-root',
    category: 'Identitas',
    label: displayName,
    shortCode: profile ? profile.category : 'Eksplorasi',
    status: 'Terkonfirmasi',
    summary:
      profile?.bio ||
      'Pusat peta pemahaman diri pribadi. Seluruh kerangka di sekitar simpul ini merupakan alat refleksi, bukan definisi tetap atas potensi diri Anda.',
    frameworkOrSource: profile ? 'Profil Partisipan' : 'Pratinjau Eksplorasi',
    targetModule: 'profil-saya',
    ...rootPos,
  });

  // Socionics Node
  const socInfo = soc ? SOCIONICS_TYPES[soc as SocionicsCode] : null;
  nodes.push({
    id: 'pm-socionics',
    category: 'Socionics',
    label: soc ? `Socionics: ${soc}${quadra ? ` (${quadra})` : ''}` : 'Socionics: Belum Dipetakan',
    shortCode: soc || 'SOC',
    status: getStatus('pm-socionics', soc ? 'Hipotesis Provisional' : 'Belum Dijelajahi'),
    summary: socInfo
      ? `Leading ${socInfo.modelA[0]} · Creative ${socInfo.modelA[1]} · PoLR ${socInfo.modelA[3]}. Menggambarkan kecenderungan pemrosesan informasi, bukan batas kemampuan.`
      : 'Belum ada hipotesis Socionics tersimpan. Jelajahi 8 Elemen Informasi sebelum menetapkan dugaan awal.',
    frameworkOrSource: 'Socionics (Model A)',
    targetModule: 'analisis-kepribadian',
    ...getPos('pm-socionics', 180, 120),
  });
  edges.push({
    id: 'pe-root-soc',
    sourceId: 'pm-root',
    targetId: 'pm-socionics',
    relationshipType: 'Same Framework',
    label: 'Kerangka Pemrosesan Informasi',
    explanation: 'Socionics memetakan cara Anda menangkap dan mengolah informasi (Te/Ti, Fe/Fi, Ne/Ni, Se/Si).',
  });

  // Enneagram Node
  nodes.push({
    id: 'pm-enneagram',
    category: 'Enneagram',
    label: enn ? `Enneagram: ${enn}${profile?.typology.enneagramWing ? ` (${profile.typology.enneagramWing})` : ''}` : 'Enneagram: Belum Dipetakan',
    shortCode: enn || 'ENN',
    status: getStatus('pm-enneagram', enn ? 'Hipotesis Provisional' : 'Belum Dijelajahi'),
    summary: enn
      ? `Fokus motivasi batin${profile?.typology.instinctStacking ? ` · Stacking ${profile.typology.instinctStacking}` : ''}${profile?.typology.tritype ? ` · Tritype ${profile.typology.tritype}` : ''}.`
      : 'Belum ada kode Enneagram. Pelajari 3 Triad & 9 motivasi inti sebagai bahan refleksi.',
    frameworkOrSource: 'Enneagram',
    targetModule: 'analisis-kepribadian',
    ...getPos('pm-enneagram', 740, 120),
  });
  edges.push({
    id: 'pe-root-enn',
    sourceId: 'pm-root',
    targetId: 'pm-enneagram',
    relationshipType: 'Independent Concepts',
    label: 'Kerangka Motivasi & Insting',
    explanation: 'Enneagram berdiri independen dari Socionics—memetakan fokus perhatian instingtual dan ketakutan/kebutuhan batin.',
  });

  // Psychosophy Node
  nodes.push({
    id: 'pm-psychosophy',
    category: 'Psikosofi',
    label: psy ? `Psikosofi: ${psy}` : 'Psikosofi: Belum Dipetakan',
    shortCode: psy || 'LVEF',
    status: getStatus(
      'pm-psychosophy',
      profile?.typology.psychosophyConfidence === 'Terkonfirmasi Mandiri'
        ? 'Terkonfirmasi'
        : psy
        ? 'Hipotesis Provisional'
        : 'Belum Dijelajahi'
    ),
    summary: psy
      ? `Prioritas sikap atas Logika (L), Kehendak (V), Emosi (E), dan Fisika (F) [${profile?.typology.psychosophyConfidence || 'Provisional'}].`
      : 'Belum ditentukan. Telusuri 16 panduan posisi di modul Psikosofi.',
    frameworkOrSource: 'Psikosofi / Attitudinal Psyche',
    targetModule: 'psikosofi',
    ...getPos('pm-psychosophy', 180, 410),
  });
  edges.push({
    id: 'pe-root-psy',
    sourceId: 'pm-root',
    targetId: 'pm-psychosophy',
    relationshipType: 'Independent Concepts',
    label: 'Hierarki Sikap L·V·E·F',
    explanation: 'Psikosofi memetakan bagaimana Anda menyikapi otoritas vs dialog di ranah Logika, Kehendak, Emosi, dan Fisika.',
  });
  edges.push({
    id: 'pe-soc-psy-note',
    sourceId: 'pm-socionics',
    targetId: 'pm-psychosophy',
    relationshipType: 'Cross-Framework Association',
    label: 'Kaitan Lintas Kerangka (Tidak Otomatis)',
    explanation: 'Socionics dan Psikosofi hanya memperkaya sudut pandang komunikasi; satu tipe Socionics dapat memiliki beragam susunan Psikosofi.',
  });

  // Jungian Node
  const parsedJung = parseJungianNotation(jung);
  nodes.push({
    id: 'pm-jung',
    category: 'Tipologi Jung',
    label: jung ? `Tipologi Jung: ${jung}` : 'Tipologi Jung: Belum Dipetakan',
    shortCode: jung || 'JUNG',
    status: getStatus('pm-jung', jung ? 'Hipotesis Provisional' : 'Belum Dijelajahi'),
    summary: parsedJung.valid
      ? `${parsedJung.explanation} Kerangka historis C.G. Jung sebagai pembanding konseptual.`
      : 'Notasi fungsi dominan dan bantu menurut psikologi analitik Jung.',
    frameworkOrSource: 'Tipologi Jung Klasik',
    targetModule: 'analisis-kepribadian',
    ...getPos('pm-jung', 460, 70),
  });
  edges.push({
    id: 'pe-soc-jung',
    sourceId: 'pm-socionics',
    targetId: 'pm-jung',
    relationshipType: 'Cross-Framework Association',
    label: 'Akar Konsep Sejarah',
    explanation: 'Socionics mengembangkan konsep fungsi kesadaran C.G. Jung dengan definisi struktural Model A tersendiri.',
  });

  // Learning Preferences Node
  const prefs = profile?.learningPreferences;
  const prefSummaryParts = [
    prefs?.studySetting,
    prefs?.explanationStyle,
    prefs?.structureStyle,
  ].filter(Boolean);
  nodes.push({
    id: 'pm-learning',
    category: 'Preferensi Belajar',
    label: 'Preferensi Belajar & Komunikasi',
    shortCode: 'BELAJAR',
    status: getStatus('pm-learning', prefSummaryParts.length > 0 ? 'Terkonfirmasi' : 'Belum Dijelajahi'),
    summary:
      prefSummaryParts.length > 0
        ? `Gaya pilihan: ${prefSummaryParts.join(' · ')}. Dapat diperbarui kapan saja.`
        : 'Belum diisi rinci. Lengkapi preferensi gaya belajar di modul Pembelajaran & Akademik.',
    frameworkOrSource: 'Pelaporan Mandiri Akademik',
    targetModule: 'pembelajaran-akademik',
    ...getPos('pm-learning', 740, 410),
  });
  edges.push({
    id: 'pe-root-learn',
    sourceId: 'pm-root',
    targetId: 'pm-learning',
    relationshipType: 'Structural Relationship',
    label: 'Strategi Belajar Nyata',
    explanation: 'Mengaitkan kenyamanan metode belajar (visual vs naratif, mandiri vs diskusi) dengan kebutuhan mata pelajaran SMA.',
  });

  // Academic & Specialization Node
  const takenSubjects = (exploration?.userSubjects || []).filter((s) => s.taken);
  const strongSubjects = takenSubjects
    .filter((s) => s.proficiencyLevel === 'Kuat' || s.proficiencyLevel === 'Sangat Kuat' || s.interestLevel === 'Tinggi')
    .map((s) => s.subjectName)
    .slice(0, 4);
  const specLabel = exploration?.specializationLabel || 'FISKIM MATONOMI';
  nodes.push({
    id: 'pm-academic',
    category: 'Minat Akademik',
    label: `Akademik: ${specLabel}`,
    shortCode: 'AKAD',
    status: getStatus('pm-academic', takenSubjects.length > 0 ? 'Terkonfirmasi' : 'Hipotesis Provisional'),
    summary:
      strongSubjects.length > 0
        ? `Fokus kuat/diminati: ${strongSubjects.join(', ')}. Terhubung dengan penjelajah Prodi PTN & kesenjangan prasyarat.`
        : 'Peminatan FISKIM MATONOMI (Fisika, Kimia, Matematika Lanjut, Ekonomi) + 10 mata pelajaran umum SMA.',
    frameworkOrSource: 'Rekam Akademik & Minat',
    targetModule: 'pendidikan-karier',
    ...getPos('pm-academic', 460, 450),
  });
  edges.push({
    id: 'pe-root-acad',
    sourceId: 'pm-root',
    targetId: 'pm-academic',
    relationshipType: 'Structural Relationship',
    label: 'Fondasi Studi Lanjut',
    explanation: 'Pemetaan minat dan kekuatan mata pelajaran menjadi dasar utama eksplorasi program studi universitas.',
  });
  edges.push({
    id: 'pe-learn-acad',
    sourceId: 'pm-learning',
    targetId: 'pm-academic',
    relationshipType: 'Analogy',
    label: 'Pendukung Cara Menguasai Materi',
    explanation: 'Preferensi belajar memengaruhi *bagaimana* Anda menyiapkan diri menghadapi materi kuliah yang diminati.',
  });

  // Private Reflections Node (strictly respects privacy!)
  nodes.push({
    id: 'pm-reflections',
    category: 'Refleksi Pribadi',
    label: isOwnerViewingPrivate
      ? `Refleksi Pribadi (${interpersonalReflectionsCount + academicReflectionsCount} catatan)`
      : 'Refleksi Pribadi (Privat)',
    shortCode: 'REFLEKSI',
    status: isOwnerViewingPrivate ? 'Terkonfirmasi' : 'Belum Dijelajahi',
    summary: isOwnerViewingPrivate
      ? `Anda memiliki ${interpersonalReflectionsCount} catatan interpersonal, ${academicReflectionsCount} refleksi akademik, dan ${(exploration?.scenarioReflections || []).length} refleksi skenario privat.`
      : 'Masuk dengan akun pribadi untuk menyinkronkan catatan refleksi dan pertanyaan terbuka secara privat.',
    frameworkOrSource: 'Ruang Privat Pemilik Akun',
    targetModule: 'refleksi-interpersonal',
    ...getPos('pm-reflections', 280, 520),
  });
  edges.push({
    id: 'pe-root-refl',
    sourceId: 'pm-root',
    targetId: 'pm-reflections',
    relationshipType: 'Structural Relationship',
    label: 'Verifikasi Pengalaman Nyata',
    explanation: 'Catatan kejadian nyata menjaga teori tetap membumi dan memisahkan fakta dari asumsi.',
  });

  // Career & Roadmap Node
  const roadmapCount = exploration?.roadmaps.length || 0;
  nodes.push({
    id: 'pm-roadmap',
    category: 'Arah Eksplorasi',
    label: roadmapCount > 0 ? `Peta Jalan & Karier (${roadmapCount} jalur)` : 'Eksplorasi Karier & Peta Jalan',
    shortCode: 'KARIER',
    status: roadmapCount > 0 ? 'Hipotesis Provisional' : 'Belum Dijelajahi',
    summary:
      roadmapCount > 0
        ? `Jalur tersimpan: ${exploration!.roadmaps.map((r) => r.title).slice(0, 2).join('; ')}.`
        : 'Jelajahi bidang karier dan susun jalur utama, alternatif, serta lintas disiplin tanpa stereotip tipe.',
    frameworkOrSource: 'Eksplorasi Karier & Roadmap',
    targetModule: 'pendidikan-karier',
    ...getPos('pm-roadmap', 650, 520),
  });
  edges.push({
    id: 'pe-acad-roadmap',
    sourceId: 'pm-academic',
    targetId: 'pm-roadmap',
    relationshipType: 'Structural Relationship',
    label: 'Jembatan Prodi ke Bidang Kerja',
    explanation: 'Menghubungkan persiapan mata pelajaran dan pilihan jurusan kuliah dengan gambaran nyata dunia kerja.',
  });

  return { nodes, edges };
}

export function compareConceptsStructured(
  idA: string,
  idB: string,
  nodes: ConceptNode[],
  curated: ConceptComparisonResult[]
): ConceptComparisonResult | null {
  if (!idA || !idB || idA === idB) return null;

  const exact = curated.find(
    (c) =>
      (c.conceptIds[0] === idA && c.conceptIds[1] === idB) ||
      (c.conceptIds[0] === idB && c.conceptIds[1] === idA)
  );
  if (exact) return exact;

  const nodeA = nodes.find((n) => n.id === idA);
  const nodeB = nodes.find((n) => n.id === idB);
  if (!nodeA || !nodeB) return null;

  const sameFramework = nodeA.framework === nodeB.framework;

  return {
    id: `cmp-${nodeA.id}-${nodeB.id}`,
    conceptIds: [nodeA.id, nodeB.id],
    title: `${nodeA.shortCode} (${nodeA.framework}) vs ${nodeB.shortCode} (${nodeB.framework})`,
    definitions: [
      {
        code: nodeA.shortCode,
        name: nodeA.label,
        framework: nodeA.framework,
        definition: nodeA.definition,
      },
      {
        code: nodeB.shortCode,
        name: nodeB.label,
        framework: nodeB.framework,
        definition: nodeB.definition,
      },
    ],
    sharedCharacteristics: sameFramework
      ? [
          `Keduanya berada dalam kerangka ${nodeA.framework} dan sama-sama membantu menjelaskan variasi cara individu merespons situasi nyata.`,
          'Keduanya tidak dapat diukur hanya dari satu kejadian tunggal; perlu pola lintas konteks.',
        ]
      : [
          `Walau berasal dari kerangka berbeda (${nodeA.framework} vs ${nodeB.framework}), keduanya sering muncul berdekatan saat membahas dinamika komunikasi atau pengambilan keputusan di kelas.`,
        ],
    fundamentalDifferences: [
      `${nodeA.shortCode} (${nodeA.subGroup}) berfokus pada: ${nodeA.summary}`,
      `${nodeB.shortCode} (${nodeB.subGroup}) berfokus pada: ${nodeB.summary}`,
      sameFramework
        ? `Perbedaan utamanya terletak pada fokus pemrosesan/posisi spesifik di dalam arsitektur ${nodeA.framework}.`
        : `Perbedaan paling mendasar adalah unit analisis teorinya: ${nodeA.framework} dan ${nodeB.framework} menanyakan pertanyaan yang berbeda tentang psikologi manusia.`,
    ],
    theoreticalAssumptions: [
      `${nodeA.framework} dan ${nodeB.framework} menggunakan definisi operasional tersendiri yang tidak boleh dicampur secara sembarangan tanpa mengecek konteks teori masing-masing.`,
    ],
    coreMechanisms: [
      `${nodeA.shortCode}: ${nodeA.keyMechanism}`,
      `${nodeB.shortCode}: ${nodeB.keyMechanism}`,
    ],
    everydayExamples: [
      `Dalam kerja tim SMA: aspek ${nodeA.shortCode} tampak pada cara anggota menyoroti "${nodeA.subGroup.toLowerCase()}", sedangkan ${nodeB.shortCode} tampak saat fokus bergeser ke "${nodeB.subGroup.toLowerCase()}".`,
    ],
    commonMisconceptions: [
      `${nodeA.shortCode}: ${nodeA.misconception}`,
      `${nodeB.shortCode}: ${nodeB.misconception}`,
    ],
    whenTheyLookSimilar: [
      'Kedua konsep dapat tampak serupa di permukaan ketika situasi kelas memicu perilaku yang sama (misalnya sama-sama bersikap tegas atau sama-sama menahan diri), padahal alasan batin dan jenis informasi yang diperhatikan berbeda.',
    ],
    distinguishingQuestions: [
      `Ketika kondisi sedang menekan, manakah yang lebih utama memicu reaksi Anda: isu terkait ${nodeA.label} atau isu terkait ${nodeB.label}?`,
      `Jika memisahkan kemampuan teknis yang dilatih sekolah dari kecenderungan alami jangka panjang, manakah deskripsi yang lebih konsisten sejak lama?`,
    ],
    analyticalLimitations: [
      'Perilaku manusia nyata dipengaruhi kelelahan fisik, hubungan interpersonal spesifik, dan tuntutan tugas sekolah.',
    ],
    crossFrameworkCaution: sameFramework
      ? `Perbandingan ini berada di dalam ${nodeA.framework}; pastikan tetap melihat profil keseluruhan, bukan satu bagian terisolasi.`
      : `PERINGATAN LINTAS KERANGKA: ${nodeA.shortCode} (${nodeA.framework}) dan ${nodeB.shortCode} (${nodeB.framework}) adalah konsep independen. Kemiripan bunyi atau istilah tidak berarti validasi silang maupun padanan wajib.`,
  };
}

export interface ScenarioEvaluationOutput {
  optionLabel: string;
  contextualNature: string;
  indications: string[];
  relevantConcepts: { conceptId: string; label: string; framework: string; targetModule: string }[];
  alternativeExplanations: string[];
  followUpQuestions: string[];
  limitations: string;
  userReasoningNote: string;
}

export function evaluateScenarioResponse(
  scenario: ExplorationScenario,
  optionId: string,
  userReasoning: string
): ScenarioEvaluationOutput | null {
  const opt = scenario.options.find((o) => o.id === optionId);
  if (!opt) return null;

  return {
    optionLabel: opt.label,
    contextualNature: opt.contextualNature,
    indications: opt.indications,
    relevantConcepts: opt.relevantConcepts,
    alternativeExplanations: [
      ...opt.alternativeExplanations,
      'Norma komunikasi keluarga atau kebiasaan kerja kelompok yang sudah terbentuk sebelumnya.',
    ],
    followUpQuestions: [
      ...opt.followUpQuestions,
      userReasoning.trim()
        ? 'Dari alasan yang baru Anda tulis, manakah bagian yang merupakan nilai pribadi menetap vs tuntutan situasi sesaat?'
        : 'Coba tuliskan alasan pribadi di balik pilihan Anda untuk melihat apakah motifnya selaras dengan deskripsi konsep.',
    ],
    limitations: `${scenario.limitationsNote} DYNAMAP tidak menetapkan tipe kepribadian dari satu skenario singkat.`,
    userReasoningNote: userReasoning.trim(),
  };
}

export interface ConsistencyAnalysisInput {
  socionics: string;
  quadra: QuadraName | '';
  jungian: string;
  enneagramCore: string;
  instinct: string;
  tritype: string;
  psychosophy: string;
}

export interface ConsistencyAnalysisOutput {
  notationValidations: { framework: string; input: string; status: 'Valid' | 'Kosong' | 'Tidak Valid'; message: string }[];
  internalConsistencyNotes: string[];
  conceptualDistinctions: string[];
  crossFrameworkIndependence: string[];
  alternativeHypotheses: string[];
  furtherExplorationQuestions: string[];
}

export function analyzeTypologyConsistency(input: ConsistencyAnalysisInput): ConsistencyAnalysisOutput {
  const notations: ConsistencyAnalysisOutput['notationValidations'] = [];
  const internalConsistencyNotes: string[] = [];
  const conceptualDistinctions: string[] = [];
  const alternativeHypotheses: string[] = [];
  const furtherExplorationQuestions: string[] = [];

  // 1. Validate Socionics & Quadra
  const socNorm = input.socionics.trim().toUpperCase();
  if (!socNorm) {
    notations.push({ framework: 'Socionics', input: '-', status: 'Kosong', message: 'Belum diisi; bersifat opsional.' });
  } else if (socNorm in SOCIONICS_TYPES) {
    const spec = SOCIONICS_TYPES[socNorm as SocionicsCode];
    notations.push({
      framework: 'Socionics',
      input: socNorm,
      status: 'Valid',
      message: `Kode tipe sah (${spec.quadra} · Leading ${spec.modelA[0]} / Creative ${spec.modelA[1]}).`,
    });
    if (input.quadra && input.quadra !== spec.quadra) {
      internalConsistencyNotes.push(
        `Ketidaksesuaian internal Socionics: tipe ${socNorm} menurut struktur Model A termasuk Quadra ${spec.quadra}, bukan ${input.quadra}. Perlu diperiksa kembali mana yang sebenarnya sesuai—apakah kode tipenya atau Quadra yang dirasakan lebih cocok.`
      );
    } else if (input.quadra) {
      internalConsistencyNotes.push(
        `Konsistensi internal Socionics terjaga: ${socNorm} selaras dengan Quadra ${spec.quadra}.`
      );
    }
  } else {
    notations.push({
      framework: 'Socionics',
      input: socNorm,
      status: 'Tidak Valid',
      message: `Kode "${socNorm}" tidak termasuk 16 kode standar Socionics (mis. ILE, LII, EIE, ESI, LIE, SEE, SEI, SLI).`,
    });
  }

  // 2. Validate Jungian
  const jungNorm = input.jungian.trim();
  if (!jungNorm) {
    notations.push({ framework: 'Tipologi Jung', input: '-', status: 'Kosong', message: 'Belum diisi.' });
  } else {
    const parsed = parseJungianNotation(jungNorm);
    notations.push({
      framework: 'Tipologi Jung',
      input: jungNorm,
      status: parsed.valid ? 'Valid' : 'Tidak Valid',
      message: parsed.valid ? parsed.explanation : 'Format tidak standar (contoh sah: ET(N), IF(S), IN(T)).',
    });
  }

  // 3. Validate Enneagram
  const coreNum = Number(input.enneagramCore.trim());
  if (!input.enneagramCore.trim()) {
    notations.push({ framework: 'Enneagram Inti', input: '-', status: 'Kosong', message: 'Belum diisi.' });
  } else if (Number.isInteger(coreNum) && coreNum >= 1 && coreNum <= 9) {
    notations.push({
      framework: 'Enneagram Inti',
      input: `${input.instinct || ''}${coreNum}`,
      status: 'Valid',
      message: `Tipe inti ${coreNum}${input.instinct ? ` dengan insting ${input.instinct}` : ''} valid dalam sistem Enneagram.`,
    });
    if (input.tritype.trim()) {
      const cleanTri = input.tritype.replace(/\D/g, '');
      if (cleanTri.length === 3) {
        const digits = cleanTri.split('').map(Number);
        const hasHeart = digits.some((d) => [2, 3, 4].includes(d));
        const hasHead = digits.some((d) => [5, 6, 7].includes(d));
        const hasGut = digits.some((d) => [8, 9, 1].includes(d));
        if (!hasHeart || !hasHead || !hasGut || !digits.includes(coreNum)) {
          internalConsistencyNotes.push(
            `Periksa Tritype "${input.tritype}": Tritype/Trifix yang sah harus memuat satu tipe dari tiap pusat (Hati 2/3/4, Kepala 5/6/7, Gut 8/9/1) dan menyertakan tipe inti ${coreNum}.`
          );
        } else {
          internalConsistencyNotes.push(`Susunan Tritype ${cleanTri} konsisten mencakup 3 pusat Triad dan tipe inti ${coreNum}.`);
        }
      } else {
        internalConsistencyNotes.push(`Format Tritype "${input.tritype}" belum lengkap 3 angka.`);
      }
    }
  } else {
    notations.push({
      framework: 'Enneagram Inti',
      input: input.enneagramCore,
      status: 'Tidak Valid',
      message: 'Tipe inti Enneagram harus berupa angka 1 sampai 9.',
    });
  }

  // 4. Validate Psychosophy
  const psyCheck = validatePsychosophyCode(input.psychosophy);
  if (psyCheck.isEmpty) {
    notations.push({ framework: 'Psikosofi', input: '-', status: 'Kosong', message: 'Belum diisi.' });
  } else if (psyCheck.valid) {
    notations.push({
      framework: 'Psikosofi',
      input: psyCheck.normalizedCode,
      status: 'Valid',
      message: `Notasi ${psyCheck.normalizedCode} sah (1${psyCheck.normalizedCode[0]}-2${psyCheck.normalizedCode[1]}-3${psyCheck.normalizedCode[2]}-4${psyCheck.normalizedCode[3]}).`,
    });
  } else {
    notations.push({
      framework: 'Psikosofi',
      input: input.psychosophy,
      status: 'Tidak Valid',
      message: psyCheck.error || 'Format Psikosofi harus 4 huruf unik L, V, E, F.',
    });
  }

  // 5. Conceptual Distinctions (specific combinations & common confusions)
  if (psyCheck.valid && !psyCheck.isEmpty) {
    const first = psyCheck.normalizedCode[0];
    if (first === 'L' && (socNorm === 'ESE' || socNorm === 'EIE' || socNorm === 'SEE')) {
      conceptualDistinctions.push(
        `Kombinasi ${socNorm} + ${psyCheck.normalizedCode} (1L): Secara teoretis mungkin terjadi, namun pastikan Anda tidak mencampur kepercayaan diri berargumentasi sosial dengan posisi 1L, atau menyamakan ketegasan fakta dengan elemen Ti/Te.`
      );
      furtherExplorationQuestions.push(
        'Apakah keyakinan logis Anda tetap terasa kuat dan tertutup untuk debat berlarut (ciri 1L), atau lebih merupakan alat membujuk suasana emosional kelompok?'
      );
    }
    if (psyCheck.normalizedCode[2] === 'V' && (coreNum === 8 || socNorm === 'SLE' || socNorm === 'SEE')) {
      conceptualDistinctions.push(
        `Kombinasi Se bernilai / Tipe 8 dengan 3V: Sering dianggap janggal di stereotip populer, padahal 3V berfokus pada sensitivitas otonomi & negosiasi harga diri sedangkan Se berfokus pada dinamika pengaruh konkret.`
      );
    }
  }

  if ((socNorm === 'LIE' || socNorm === 'EIE') && coreNum === 3) {
    conceptualDistinctions.push(
      `Distingsi Konseptual (Enneagram 3 vs Socionics ${socNorm}): Motivasi penghargaan/pencapaian Tipe 3 (khususnya SO3) sering tampak mirip dengan efisiensi Te (LIE) atau ekspresivitas peran sosial Fe (EIE). Pastikan Anda membedakan motivasi batin (takut tidak bernilai) dari cara mengolah informasi.`
    );
  }

  if (conceptualDistinctions.length === 0) {
    conceptualDistinctions.push(
      'Setiap kerangka memotret lapisan berbeda: Socionics mengukur pemrosesan informasi kognitif; Enneagram memetakan kecemasan & motivasi inti; Psikosofi memetakan prioritas sikap atas L·V·E·F; Tipologi Jung memetakan sikap kesadaran dasar.'
    );
  }

  if (internalConsistencyNotes.length === 0) {
    internalConsistencyNotes.push(
      'Tidak ditemukan kontradiksi struktural internal pada kode kerangka yang Anda masukkan. Langkah selanjutnya adalah menguji kesesuaiannya terhadap pengalaman harian lintas konteks.'
    );
  }

  const crossFrameworkIndependence = [
    'Socionics, Enneagram, Psikosofi, dan Tipologi Jung berasal dari tradisi sejarah yang berbeda dan tidak memiliki pemetaan 1-banding-1 yang kaku.',
    'DYNAMAP tidak menyatakan kombinasi lintas kerangka mana pun sebagai "mustahil" dan tidak menggunakan skor persentase kecocokan palsu.',
    'Kombinasi yang tampak "jarang" di diskusi daring tetap sah apabila masing-masing kerangka terverifikasi secara independen dari indikator aslinya.',
  ];

  alternativeHypotheses.push(
    'Perilaku yang terlihat saat mengerjakan tugas sekolah bisa berasal dari peran kepemimpinan yang diminta guru, bukan preferensi pribadi jangka panjang.',
    'Jika dua kerangka terasa bertentangan pada diri Anda, periksa apakah salah satunya hanya menggambarkan kondisi saat Anda sedang stres atau berada di lingkungan sosial tertentu.'
  );

  furtherExplorationQuestions.push(
    'Jika seluruh istilah teknis dihapus sementara, deskripsi kebutuhan batin dan strategi menghadapi masalah mana yang paling bertahan selama 3 tahun terakhir?',
    'Apakah ada perubahan sikap signifikan antara saat Anda sendirian belajar vs saat berada di kelompok kelas yang ramai?'
  );

  return {
    notationValidations: notations,
    internalConsistencyNotes,
    conceptualDistinctions,
    crossFrameworkIndependence,
    alternativeHypotheses,
    furtherExplorationQuestions,
  };
}

export function analyzeAcademicGap(
  userSubjects: UserSubjectEntry[],
  program: UniversityProgram,
  university: UniversityInstitution | null
): AcademicGapReport {
  const takenMap = new Map<string, UserSubjectEntry>();
  for (const entry of userSubjects) {
    if (entry.taken) {
      takenMap.set(normalizeStr(entry.subjectName), entry);
    }
  }

  const findTaken = (requiredName: string): UserSubjectEntry | undefined => {
    const req = normalizeStr(requiredName);
    for (const [key, entry] of takenMap.entries()) {
      if (key === req || key.includes(req) || req.includes(key)) {
        return entry;
      }
    }
    return undefined;
  };

  const studiedRelevantSubjects: AcademicGapReport['studiedRelevantSubjects'] = [];
  const relevantExistingKnowledge: string[] = [];
  const strengthAreas: string[] = [];
  const missingOrUnstudiedSubjects: string[] = [];
  const additionalTopicsToLearn: string[] = [];

  for (const keySubj of program.keyHighSchoolSubjects) {
    const match = findTaken(keySubj);
    if (match) {
      studiedRelevantSubjects.push({
        subjectName: keySubj,
        matchRole: 'Utama',
        proficiency: `${match.proficiencyLevel} (Minat ${match.interestLevel})`,
      });
      relevantExistingKnowledge.push(
        `Fondasi ${keySubj}${match.enjoyedTopics ? ` (khususnya topik: ${match.enjoyedTopics})` : ''} sudah tersedia untuk mendukung materi awal perkuliahan.`
      );
      if (
        match.proficiencyLevel === 'Kuat' ||
        match.proficiencyLevel === 'Sangat Kuat' ||
        match.interestLevel === 'Tinggi'
      ) {
        strengthAreas.push(
          `${keySubj} sudah dipelajari dengan modal minat ${match.interestLevel.toLowerCase()} & kesiapan ${match.proficiencyLevel.toLowerCase()}.`
        );
      }
    } else {
      missingOrUnstudiedSubjects.push(keySubj);
      additionalTopicsToLearn.push(
        `Konsep pengantar ${keySubj} tingkat SMA/pra-kuliah agar adaptasi di semester 1 terasa nyaman.`
      );
    }
  }

  for (const supSubj of program.importantSupportingSubjects) {
    const match = findTaken(supSubj);
    if (match) {
      studiedRelevantSubjects.push({
        subjectName: supSubj,
        matchRole: 'Pendukung',
        proficiency: `${match.proficiencyLevel} (Minat ${match.interestLevel})`,
      });
      relevantExistingKnowledge.push(
        `Mapel pendukung ${supSubj} memberi bekal kontekstual lintas disiplin.`
      );
    } else {
      missingOrUnstudiedSubjects.push(`${supSubj} (pendukung)`);
      additionalTopicsToLearn.push(
        `Pengenalan dasar ${supSubj} sebagai materi pelengkap perspektif program studi.`
      );
    }
  }

  // Cross-disciplinary transferable knowledge (e.g., Math/Econ/Indonesian critical writing)
  if (studiedRelevantSubjects.length === 0) {
    const mathTaken = findTaken('Matematika Wajib') || findTaken('Matematika Lanjut');
    const indoTaken = findTaken('Bahasa Indonesia');
    const engTaken = findTaken('Bahasa Inggris');
    if (mathTaken) {
      relevantExistingKnowledge.push(
        `Penalaran kuantitatif & logika dari ${mathTaken.subjectName} tetap dapat ditransfer ke riset, analisis data, atau argumen terstruktur di program ini.`
      );
    }
    if (indoTaken || engTaken) {
      relevantExistingKnowledge.push(
        'Kemampuan membaca kritis dan menyusun argumen dari Bahasa Indonesia/Inggris menjadi jembatan utama lintas disiplin.'
      );
    }
  }

  // Helpful cross-disciplinary topic suggestions for non-obvious clusters
  if (program.disciplineCluster.includes('Sosial') || program.name.includes('Psikologi')) {
    if (!findTaken('Sosiologi')) {
      additionalTopicsToLearn.push('Pengantar metode riset sosial/perilaku, statistika deskriptif, dan observasi tanpa bias.');
    }
  }
  if (program.disciplineCluster.includes('Hukum')) {
    additionalTopicsToLearn.push('Penalaran hukum dasar, membaca teks perundang-undangan, serta menyusun argumen deduktif berbasis bukti.');
  }
  if (program.name.includes('Bioteknologi') || program.name.includes('Biologi') || program.disciplineCluster.includes('Kedokteran')) {
    if (!findTaken('Biologi')) {
      additionalTopicsToLearn.push('Konsep dasar biologi sel, genetika molekuler, dan metabolisme tingkat pengantar.');
    }
  }

  const prerequisiteNotes: string[] = [
    `Fokus kurikulum kuliah mencakup: ${program.curriculumFocus.join(', ')}.`,
    `Pola berpikir yang dilatih di program ini: ${program.thinkingPatterns.join(', ')}.`,
  ];

  const competenciesDevelopedAtUni: string[] = [
    ...program.curriculumFocus.map((c) => `Penguasaan bertahap pada ${c}`),
    ...(program.competencyRequirements
      ? [
          `Penalaran analitis: ${program.competencyRequirements.analytical}`,
          `Komunikasi ilmiah/profesional: ${program.competencyRequirements.communication}`,
        ]
      : ['Kemampuan riset, pemecahan masalah nyata, dan kerja kolaboratif profesional di tingkat sarjana']),
  ];

  const officialAdmissionRequirements: string[] = [
    program.admissionNotes,
    program.formalEligibilityNote ||
      `Jalur seleksi yang umum tersedia: ${(program.availableRoutes || university?.admissionRoutes || ['SNBP', 'SNBT', 'Mandiri']).join(', ')}.`,
    `Verifikasi syarat terbaru (${program.provenance.academicYear}) melalui: ${program.provenance.officialUrl} (Status: ${program.provenance.verificationStatus}).`,
  ];

  const hasMissingKey = missingOrUnstudiedSubjects.some((m) => !m.includes('(pendukung)'));
  const formalEligibilityStatus: AcademicGapReport['formalEligibilityStatus'] =
    program.provenance.verificationStatus === 'Perlu Konfirmasi'
      ? 'Perlu Verifikasi Resmi PTN'
      : hasMissingKey
      ? 'Memerlukan Mapel Pendukung Khusus'
      : 'Terbuka Lintas Jurusan (Verifikasi Tahunan)';

  const prepActionPlan: string[] = [];
  if (missingOrUnstudiedSubjects.length > 0) {
    prepActionPlan.push(
      `Petakan kesenjangan topik pada: ${missingOrUnstudiedSubjects.join(', ')}. Pelajari modul pengantar atau buku dasar sebelum perkuliahan atau tes seleksi.`
    );
  } else {
    prepActionPlan.push(
      'Seluruh mata pelajaran utama & pendukung prodi ini sudah pernah Anda tempuh; fokus pada pendalaman konsep aplikasi & soal penalaran.'
    );
  }
  prepActionPlan.push(
    'Bedakan antara kesiapan materi pribadi dengan aturan administratif: cek syarat mapel pendukung SNBP, subtes SNBT, maupun seleksi mandiri di portal resmi PTN.'
  );
  prepActionPlan.push(
    'Bandingkan silabus semester 1–2 di prodi tujuan untuk mengecek bobot praktikum, matematika, atau penulisan ilmiahnya.'
  );

  const encouragementNote =
    missingOrUnstudiedSubjects.length > 0
      ? 'Adanya mata pelajaran yang belum diambil di SMA BUKAN berarti Anda tidak cocok atau tidak mampu mengambil program ini. Itu hanyalah penanda area persiapan tambahan agar transisi belajar lebih nyaman.'
      : 'Kombinasi mata pelajaran Anda memberi fondasi relevan; tetap lengkapi eksplorasi dengan memahami keseharian tugas dan ritme kuliah program ini.';

  return {
    program,
    university,
    studiedRelevantSubjects,
    relevantExistingKnowledge,
    strengthAreas,
    missingOrUnstudiedSubjects,
    additionalTopicsToLearn,
    prerequisiteNotes,
    competenciesDevelopedAtUni,
    officialAdmissionRequirements,
    formalEligibilityStatus,
    prepActionPlan,
    encouragementNote,
  };
}

export function buildAcademicRecommendations(params: {
  userSubjects: UserSubjectEntry[];
  interestTopics: string[];
  learningPreferences: LearningPreferences | null;
  profile: Profile | null;
  programs: UniversityProgram[];
  universities: UniversityInstitution[];
}): AcademicRecommendationResult[] {
  const { userSubjects, interestTopics, learningPreferences, profile, programs, universities } = params;
  const uniMap = new Map(universities.map((u) => [u.id, u]));
  const interestsLower = interestTopics.map(normalizeStr);

  const interestKeywords = Array.from(
    new Set(
      interestsLower
        .flatMap((phrase) => phrase.split(/[\s&,/()-]+/))
        .map((w) => w.trim())
        .filter((w) => w.length >= 4 && !['dan', 'atau', 'untuk', 'dalam'].includes(w))
    )
  );

  const results: AcademicRecommendationResult[] = [];

  for (const program of programs) {
    const uni = uniMap.get(program.universityId);
    if (!uni) continue;

    const gap = analyzeAcademicGap(userSubjects, program, uni);
    const keyMatchedCount = gap.studiedRelevantSubjects.filter((s) => s.matchRole === 'Utama').length;
    const totalKey = Math.max(1, program.keyHighSchoolSubjects.length);
    const hasMissingKey = gap.missingOrUnstudiedSubjects.some((m) => !m.includes('(pendukung)'));

    const strongCount = gap.strengthAreas.length;
    const interestHits = [
      ...program.curriculumFocus,
      ...program.thinkingPatterns,
      program.disciplineCluster,
      program.name,
    ].filter((token) => {
      const lower = normalizeStr(token);
      return (
        interestsLower.some((i) => lower.includes(i) || i.includes(lower)) ||
        interestKeywords.some((kw) => lower.includes(kw))
      );
    });

    let category: AcademicRecommendationCategory;
    if (hasMissingKey) {
      category = interestHits.length > 0 ? 'Perlu Persiapan Tambahan' : 'Eksplorasi Bidang Baru';
    } else if (keyMatchedCount === totalKey && strongCount >= 2 && interestHits.length >= 1) {
      category = 'Kesesuaian Minat & Akademik Kuat';
    } else if (interestHits.length >= 1) {
      category = 'Potensi Keselarasan Minat';
    } else if (program.keyHighSchoolSubjects.length >= 2 && keyMatchedCount >= 1) {
      category = 'Eksplorasi Lintas Disiplin';
    } else {
      category = 'Eksplorasi Bidang Baru';
    }

    const academicReasons: string[] = [];
    if (gap.studiedRelevantSubjects.length > 0) {
      academicReasons.push(
        `Relevan dengan mata pelajaran yang ditempuh: ${gap.studiedRelevantSubjects.map((s) => s.subjectName).join(', ')}.`
      );
    }
    if (gap.strengthAreas.length > 0) {
      academicReasons.push(...gap.strengthAreas.slice(0, 2));
    }
    if (academicReasons.length === 0) {
      academicReasons.push('Program ini membuka ruang pengembangan kompetensi baru di luar peminatan inti Anda.');
    }

    const interestAlignment =
      interestHits.length > 0
        ? [`Menyentuh topik minat Anda: ${interestHits.slice(0, 3).join(', ')}.`]
        : [`Pendekatan prodi menekankan: ${program.thinkingPatterns.slice(0, 2).join(', ')}.`];

    const learningStyleConnection: string[] = [];
    if (learningPreferences?.explanationStyle) {
      learningStyleConnection.push(
        `Preferensi penyajian materi Anda (${learningPreferences.explanationStyle}) relevan ditimbang terhadap karakter perkuliahan (${program.studyEnvironment}).`
      );
    } else {
      learningStyleConnection.push(`Lingkungan belajar kuliah: ${program.studyEnvironment}`);
    }

    const soc = profile?.typology.socionics;
    const psy = profile?.typology.psychosophyCode;
    const enn = profile?.typology.enneagramRaw;
    const typologyReflectionNote =
      soc || psy || enn
        ? `Catatan refleksi (bukan penentu kelayakan): Dengan konteks profil (${[soc, enn, psy].filter(Boolean).join(' · ')}), amati apakah pola pikir "${program.thinkingPatterns[0]}" terasa alami atau memerlukan strategi adaptasi suasana tim.`
        : 'Tipologi bersifat suplemen refleksi: semua tipe kepribadian dapat berhasil di program studi ini dengan metode belajar yang tepat.';

    const preparationNeeds =
      gap.missingOrUnstudiedSubjects.length > 0
        ? [`Perlu jembatan penguasaan konsep dasar pada: ${gap.missingOrUnstudiedSubjects.join(', ')}.`, program.admissionNotes]
        : [program.admissionNotes];

    const explorationQuestions = [
      `Dari daftar mata kuliah seperti ${program.curriculumFocus.slice(0, 2).join(' dan ')}, mana yang membuat Anda penasaran untuk dipelajari 4 tahun ke depan?`,
      `Apakah ritme belajar "${program.studyEnvironment}" sesuai dengan energi belajar Anda saat ini?`,
    ];

    results.push({
      program,
      university: uni,
      category,
      academicReasons,
      interestAlignment,
      learningStyleConnection,
      typologyReflectionNote,
      preparationNeeds,
      explorationQuestions,
      limitationsDisclaimer:
        'Rekomendasi ini tidak menggunakan skor persentase kecocokan dan tidak menyimpulkan masa depan secara deterministik. Selalu verifikasi aturan seleksi terbaru ke portal resmi PTN.',
    });
  }

  const order: Record<AcademicRecommendationCategory, number> = {
    'Kesesuaian Minat & Akademik Kuat': 0,
    'Potensi Keselarasan Minat': 1,
    'Eksplorasi Lintas Disiplin': 2,
    'Perlu Persiapan Tambahan': 3,
    'Eksplorasi Bidang Baru': 4,
  };

  return results.sort((a, b) => order[a.category] - order[b.category]);
}

export const INTEREST_TOPIC_OPTIONS = [
  'Analisis Data & Statistika',
  'Rekayasa Kimia & Material',
  'Sistem Industri & Rantai Pasok',
  'Perangkat Lunak & Algoritma',
  'Ekonomi & Kebijakan Publik',
  'Keuangan & Aktuaria',
  'Bioteknologi & Keberlanjutan Lingkungan',
  'Fisika Murni & Instrumentasi',
  'Pendidikan Sains & Desain Pembelajaran',
  'Manajemen Produk & Kewirausahaan',
];

export const WORK_MOTIVATION_OPTIONS = [
  'Efisiensi sistem nyata',
  'Rasa ingin tahu riset mendalam',
  'Membantu manusia belajar & bertumbuh',
  'Kejelasan kalkulasi & mitigasi risiko',
  'Membangun solusi digital terpakai',
  'Dampak keberlanjutan lingkungan & sosial',
];
