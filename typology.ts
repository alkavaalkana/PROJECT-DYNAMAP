import { ENNEAGRAM_TYPES, INSTINCT_STACKINGS, INSTINCT_VARIANTS } from '../data/enneagramData';
import { ALL_16_MBTI_PROFILES, CLASSICAL_4_TEMPERAMENTS, MIXED_12_TEMPERAMENTS } from '../data/extendedTheoryData';
import { INFORMATION_ELEMENTS, SOCIONICS_TYPES, parseJungianNotation } from '../data/socionicsData';
import { comparePsychosophyProfiles, parsePsychosophyPositions, type PsychosophyPairComparison } from './psychosophy';
import { parseExtendedSloanNotation } from './sloanNotation';
import type {
  CaseAnalysisInput,
  DirectionalDynamicsMap,
  DirectionalInteractionFlow,
  EnneagramCore,
  GutFix,
  HeadFix,
  HeartFix,
  InformationElement,
  Profile,
  QuadraName,
  SocionicsCode,
  StructuredCaseAnalysis,
  TritypeConvention,
} from '../types/dynamap';

export interface DistributionItem {
  label: string;
  count: number;
  percentage: number;
}

export interface ClassStatistics {
  totalActive: number;
  totalArchived: number;
  initialStudentsCount: number;
  addedStudentsCount: number;
  teachersAndStaffCount: number;
  byCategory: DistributionItem[];
  byQuadra: DistributionItem[];
  bySocionics: DistributionItem[];
  byEnneagram: DistributionItem[];
  byEnneagramCore: DistributionItem[];
  byJungian: DistributionItem[];
  byPsychosophy: DistributionItem[];
  byMbti: DistributionItem[];
  bySloan: DistributionItem[];
  byTemperament: DistributionItem[];
  byStatus: DistributionItem[];
}

function toDistribution(counts: Record<string, number>, total: number, orderedKeys?: string[]): DistributionItem[] {
  const keys = orderedKeys ?? Object.keys(counts).sort((a, b) => counts[b] - counts[a] || a.localeCompare(b));
  return keys.map((label) => {
    const count = counts[label] ?? 0;
    const percentage = total > 0 ? Number(((count / total) * 100).toFixed(2)) : 0;
    return { label, count, percentage };
  });
}

export function computeClassStatistics(profiles: Profile[]): ClassStatistics {
  const active = profiles.filter((p) => !p.archived);
  const archived = profiles.filter((p) => p.archived);

  const initialStudentsCount = active.filter((p) => p.datasetOrigin === 'initial_37').length;
  const addedStudentsCount = active.filter(
    (p) => p.datasetOrigin === 'added' && p.category === 'Siswa'
  ).length;
  const teachersAndStaffCount = active.filter((p) => p.category !== 'Siswa').length;

  const categoryCounts: Record<string, number> = {};
  const quadraCounts: Record<string, number> = {
    Gamma: 0,
    Alpha: 0,
    Delta: 0,
    Beta: 0,
  };
  const socionicsCounts: Record<string, number> = {};
  const enneagramCounts: Record<string, number> = {};
  const enneagramCoreCounts: Record<string, number> = {};
  const jungianCounts: Record<string, number> = {};
  const psychosophyCounts: Record<string, number> = {};
  const mbtiCounts: Record<string, number> = {};
  const sloanCounts: Record<string, number> = {};
  const temperamentCounts: Record<string, number> = {};
  const statusCounts: Record<string, number> = {};

  for (const p of active) {
    categoryCounts[p.category] = (categoryCounts[p.category] ?? 0) + 1;

    if (p.typology.quadra) {
      quadraCounts[p.typology.quadra] = (quadraCounts[p.typology.quadra] ?? 0) + 1;
    } else {
      quadraCounts['Belum Ditentukan'] = (quadraCounts['Belum Ditentukan'] ?? 0) + 1;
    }

    const soc = p.typology.socionics || 'Belum Ditentukan';
    socionicsCounts[soc] = (socionicsCounts[soc] ?? 0) + 1;

    const ennRaw =
      p.typology.enneagramRaw ||
      (p.typology.enneagramCore
        ? `${p.typology.instinctVariant || ''}${p.typology.enneagramCore}`
        : 'Belum Ditentukan');
    enneagramCounts[ennRaw] = (enneagramCounts[ennRaw] ?? 0) + 1;

    const coreLabel = p.typology.enneagramCore ? `Tipe ${p.typology.enneagramCore}` : 'Belum Ditentukan';
    enneagramCoreCounts[coreLabel] = (enneagramCoreCounts[coreLabel] ?? 0) + 1;

    const jung = p.typology.jungian || 'Belum Ditentukan';
    jungianCounts[jung] = (jungianCounts[jung] ?? 0) + 1;

    const psy = p.typology.psychosophyCode || 'Belum Ditentukan';
    psychosophyCounts[psy] = (psychosophyCounts[psy] ?? 0) + 1;

    const mbtiVal = (p.typology.mbti || '').trim().toUpperCase() || 'Belum Ditentukan';
    mbtiCounts[mbtiVal] = (mbtiCounts[mbtiVal] ?? 0) + 1;

    const sloanVal = (p.typology.sloanCode || '').trim().toUpperCase() || (p.typology.sloanExtended || '').trim() || 'Belum Ditentukan';
    sloanCounts[sloanVal] = (sloanCounts[sloanVal] ?? 0) + 1;

    const tempVal = p.typology.temperament
      ? [p.typology.temperament, p.typology.temperamentSecondary].filter(Boolean).join('–')
      : 'Belum Ditentukan';
    temperamentCounts[tempVal] = (temperamentCounts[tempVal] ?? 0) + 1;

    const st = p.typology.status || 'Undetermined';
    statusCounts[st] = (statusCounts[st] ?? 0) + 1;
  }

  const total = active.length;
  const quadraKeys = ['Gamma', 'Alpha', 'Delta', 'Beta'];
  if (quadraCounts['Belum Ditentukan'] > 0) {
    quadraKeys.push('Belum Ditentukan');
  }

  return {
    totalActive: total,
    totalArchived: archived.length,
    initialStudentsCount,
    addedStudentsCount,
    teachersAndStaffCount,
    byCategory: toDistribution(categoryCounts, total),
    byQuadra: toDistribution(quadraCounts, total, quadraKeys),
    bySocionics: toDistribution(socionicsCounts, total),
    byEnneagram: toDistribution(enneagramCounts, total),
    byEnneagramCore: toDistribution(enneagramCoreCounts, total),
    byJungian: toDistribution(jungianCounts, total),
    byPsychosophy: toDistribution(psychosophyCounts, total),
    byMbti: toDistribution(mbtiCounts, total),
    bySloan: toDistribution(sloanCounts, total),
    byTemperament: toDistribution(temperamentCounts, total),
    byStatus: toDistribution(statusCounts, total),
  };
}

export interface TritypeConfigurationInput {
  core: EnneagramCore | null;
  heartFix: HeartFix | null;
  headFix: HeadFix | null;
  gutFix: GutFix | null;
  secondaryPriority?: 'heart' | 'head' | 'gut' | null;
  convention: TritypeConvention;
}

export interface TritypeConfigurationResult {
  valid: boolean;
  error?: string;
  core: EnneagramCore | null;
  threeFix: string;
  trifixDisplay: string;
  tritypeDisplay: string;
  orderedFixes: [EnneagramCore, EnneagramCore, EnneagramCore] | null;
  orderingExplanation: string;
  interactionAnalysis: {
    coreRole: string;
    heartContribution: string;
    headContribution: string;
    gutContribution: string;
    synergy: string;
    internalTension: string;
    unhealthyLoop: string;
    potentialStrengths: string[];
    developmentStrategies: string[];
  } | null;
}

const HEART_SET = new Set<number>([2, 3, 4]);
const HEAD_SET = new Set<number>([5, 6, 7]);
const GUT_SET = new Set<number>([8, 9, 1]);

function getCenterOfType(n: EnneagramCore): 'Heart' | 'Head' | 'Gut' {
  if (HEART_SET.has(n)) return 'Heart';
  if (HEAD_SET.has(n)) return 'Head';
  return 'Gut';
}

const SPECIFIC_TRITYPE_NOTES: Record<
  string,
  {
    archetypeTitle: string;
    synergy: string;
    internalTension: string;
    unhealthyLoop: string;
    strategies: string[];
  }
> = {
  '258': {
    archetypeTitle: 'Kombinasi 2-5-8 (Tiga Tipe Rejection Triad)',
    synergy:
      'Ketiga fix berasal dari Rejection Triad (2, 5, 8). Tipe 2 sebagai inti menggerakkan kepedulian aktif dan pembangunan hubungan, Tipe 5 memberi kedalaman pengamatan analitis agar bantuan tetap tepat guna dan cerdas, sedangkan Tipe 8 memberi ketegasan batas, keberanian melindungi, serta daya eksekusi saat menghadapi konflik.',
    internalTension:
      'Tarikan antara dorongan Tipe 2 untuk terlibat hangat membantu orang lain, dorongan Tipe 5 untuk menjaga jarak dan menghemat energi, serta keengganan Tipe 8 menunjukkan kerentanan atau ketergantungan.',
    unhealthyLoop:
      'Saat tertekan, dapat muncul pola memberi sambil memendam rasa harus selalu kuat (2+8), lalu mendadak menarik diri dingin secara mental ketika merasa usahanya tidak dihargai atau energinya habis (5).',
    strategies: [
      'Berlatih mengakui kebutuhan bantuan secara terbuka tanpa menunggu kelelahan.',
      'Membedakan antara kepedulian tulus dan keinginan memegang kendali atas masalah orang lain.',
      'Menjadwalkan ruang jeda tenang (sisi 5) secara sadar sebelum memberi komitmen baru.',
    ],
  },
};

const HEART_IN_TRITYPE: Record<HeartFix, string> = {
  2: 'Fix Jantung 2 membawa orientasi empati relasional, kepekaan terhadap kebutuhan emosional orang sekitar, dan dorongan untuk hadir sebagai figur yang membantu serta menghubungkan.',
  3: 'Fix Jantung 3 membawa kesadaran akan efektivitas hasil, keluwesan beradaptasi di hadapan audiens, serta dorongan mewujudkan kontribusi yang terlihat nyata.',
  4: 'Fix Jantung 4 membawa pencarian keaslian batin, kepekaan terhadap nuansa makna pribadi, dan penolakan terhadap respons emosional yang terasa dangkal.',
};

const HEAD_IN_TRITYPE: Record<HeadFix, string> = {
  5: 'Fix Pikiran 5 memengaruhi cara memproses informasi dengan menuntut pemahaman mendalam terlebih dahulu, pengamatan objektif berjarak, dan pemecahan masalah berbasis analisis akar persoalan.',
  6: 'Fix Pikiran 6 memengaruhi pendekatan informasi dengan menimbang kemungkinan risiko, menguji keandalan argumen atau komitmen, dan memastikan kesiapan rencana cadangan.',
  7: 'Fix Pikiran 7 memengaruhi pemrosesan informasi melalui pencarian alternatif kreatif, optimisme terhadap peluang baru, dan kecepatan menghubungkan berbagai ide.',
};

const GUT_IN_TRITYPE: Record<GutFix, string> = {
  8: 'Fix Insting 8 memengaruhi ketegasan sikap, perlindungan batas diri, keberanian menghadapi konflik secara langsung, dan penolakan terhadap manipulasi.',
  9: 'Fix Insting 9 memengaruhi pengelolaan konflik dengan mengutamakan ketenangan suasana, kemampuan melihat berbagai sudut pandang, dan meredakan ketegangan yang tidak perlu.',
  1: 'Fix Insting 1 memengaruhi penetapan batas dan konflik melalui acuan prinsip etis, ketertiban standar kualitas, dan dorongan mengoreksi ketidakadilan secara terukur.',
};

export function validateAndBuildTritype(input: TritypeConfigurationInput): TritypeConfigurationResult {
  const { core, heartFix, headFix, gutFix, secondaryPriority, convention } = input;

  if (!heartFix || !headFix || !gutFix) {
    return {
      valid: false,
      error: 'Konfigurasi Three Fix memerlukan tepat satu fix dari Pusat Jantung (2/3/4), Pusat Pikiran (5/6/7), dan Pusat Insting (8/9/1).',
      core,
      threeFix: '',
      trifixDisplay: '',
      tritypeDisplay: '',
      orderedFixes: null,
      orderingExplanation: '',
      interactionAnalysis: null,
    };
  }

  if (!HEART_SET.has(heartFix) || !HEAD_SET.has(headFix) || !GUT_SET.has(gutFix)) {
    return {
      valid: false,
      error: 'Pilihan fix tidak sesuai pusat kecerdasannya masing-masing.',
      core,
      threeFix: '',
      trifixDisplay: '',
      tritypeDisplay: '',
      orderedFixes: null,
      orderingExplanation: '',
      interactionAnalysis: null,
    };
  }

  const effectiveCore: EnneagramCore = core ?? heartFix;
  const coreCenter = getCenterOfType(effectiveCore);

  // Enforce core consistency with its own center fix
  if (
    (coreCenter === 'Heart' && effectiveCore !== heartFix) ||
    (coreCenter === 'Head' && effectiveCore !== headFix) ||
    (coreCenter === 'Gut' && effectiveCore !== gutFix)
  ) {
    return {
      valid: false,
      error: `Tipe inti (${effectiveCore}) berasal dari pusat ${coreCenter}, sehingga fix pusat ${coreCenter} harus sama dengan tipe inti (${effectiveCore}).`,
      core: effectiveCore,
      threeFix: '',
      trifixDisplay: '',
      tritypeDisplay: '',
      orderedFixes: null,
      orderingExplanation: '',
      interactionAnalysis: null,
    };
  }

  // Three Fix neutral notation (center grouping without claiming hierarchy)
  const threeFix = `${heartFix}-${headFix}-${gutFix}`;

  // Order remaining two fixes cleanly
  const remaining: { center: 'heart' | 'head' | 'gut'; value: EnneagramCore }[] = [];
  if (coreCenter !== 'Heart') remaining.push({ center: 'heart', value: heartFix });
  if (coreCenter !== 'Head') remaining.push({ center: 'head', value: headFix });
  if (coreCenter !== 'Gut') remaining.push({ center: 'gut', value: gutFix });

  if (secondaryPriority && remaining.length === 2 && remaining[1].center === secondaryPriority) {
    remaining.reverse();
  }

  const orderedFixes: [EnneagramCore, EnneagramCore, EnneagramCore] =
    convention === 'core-first'
      ? [effectiveCore, remaining[0].value, remaining[1].value]
      : [heartFix, headFix, gutFix];

  const tritypeCode = orderedFixes.join('');
  const trifixDisplay = `${tritypeCode} (Trifix / Tiga Fiksasi)`;
  const tritypeDisplay =
    convention === 'core-first'
      ? tritypeCode
      : `${tritypeCode} (Urutan Pusat Heart-Head-Gut)`;

  const orderingExplanation =
    convention === 'core-first'
      ? `Menggunakan konvensi Tritype inti-pertama (core-first): Tipe ${effectiveCore} berada di posisi pertama sebagai motivasi inti (${coreCenter} Center), diikuti fix kedua (${orderedFixes[1]}) dan ketiga (${orderedFixes[2]}). Angka tidak diurutkan berdasarkan besar-kecil secara mekanis, melainkan berdasarkan peran tipe inti.`
      : `Menggunakan konvensi urutan pusat standar Heart-Head-Gut (${heartFix}-${headFix}-${gutFix}) untuk menampilkan konfigurasi Three Fix/Trifix tanpa mengklaim hierarki pengaruh antardua fix non-inti.`;

  const coreSpec = ENNEAGRAM_TYPES[effectiveCore];
  const sortedKey = [heartFix, headFix, gutFix].sort((a, b) => a - b).join('');
  const specific = SPECIFIC_TRITYPE_NOTES[sortedKey];

  const synergy = specific
    ? specific.synergy
    : `Dengan Tipe ${effectiveCore} (${coreSpec.center} Center) sebagai inti, motivasi utama diarahkan pada "${coreSpec.coreDesire}". Ketiga fix berinteraksi sebagai satu pola dinamis: ${HEART_IN_TRITYPE[heartFix].replace('Fix Jantung', 'aspek Jantung')} Sementara itu, ${HEAD_IN_TRITYPE[headFix].replace('Fix Pikiran', 'aspek Pikiran')} Di saat bersamaan, ${GUT_IN_TRITYPE[gutFix].replace('Fix Insting', 'aspek Insting')}`;

  const internalTension = specific
    ? specific.internalTension
    : `Ketegangan internal dapat muncul ketika strategi pusat ${coreSpec.center} (Tipe ${effectiveCore}) berhadapan dengan kecenderungan dari dua pusat lainnya—misalnya antara kebutuhan menjaga standar atau kedekatan (Jantung ${heartFix}), kehati-hatian atau eksplorasi mental (Pikiran ${headFix}), dan cara merespons batas atau konflik (Insting ${gutFix}).`;

  const unhealthyLoop = specific
    ? specific.unhealthyLoop
    : `Dalam tekanan berat, pola pertahanan tipe inti (${coreSpec.defenseMechanism.split(':')[0]}) dapat diperkuat oleh sisi reaktif atau penghindaran dari fix pendamping sehingga individu mengulang respons yang kurang fleksibel.`;

  const strategies = specific
    ? specific.strategies
    : [
        `Kenali pemicu utama Tipe ${effectiveCore} terlebih dahulu sebelum mengurai pengaruh fix ${orderedFixes[1]} dan ${orderedFixes[2]}.`,
        'Periksa apakah respons yang muncul berasal dari kebutuhan nyata situasi atau kebiasaan mekanisme pertahanan lama.',
        'Jadikan kombinasi tiga pusat ini sebagai bahan refleksi pribadi, bukan kotak kaku yang menyeragamkan setiap orang dengan kode serupa.',
      ];

  return {
    valid: true,
    core: effectiveCore,
    threeFix,
    trifixDisplay,
    tritypeDisplay,
    orderedFixes,
    orderingExplanation,
    interactionAnalysis: {
      coreRole: `Tipe ${effectiveCore} berfungsi sebagai inti motivasi dan pengarah utama keseluruhan konfigurasi (${coreSpec.name}).`,
      heartContribution: HEART_IN_TRITYPE[heartFix],
      headContribution: HEAD_IN_TRITYPE[headFix],
      gutContribution: GUT_IN_TRITYPE[gutFix],
      synergy,
      internalTension,
      unhealthyLoop,
      potentialStrengths: [
        specific ? specific.archetypeTitle : `Integrasi seimbang antar-pusat (${threeFix})`,
        ...coreSpec.potentialStrengths,
      ],
      developmentStrategies: strategies,
    },
  };
}

export type RelationshipContext =
  | 'Teman sekelas'
  | 'Teman dekat'
  | 'Anggota kelompok'
  | 'Guru dan siswa'
  | 'Koordinator dan anggota'
  | 'Konteks interpersonal lainnya';

export type ConflictMechanismId =
  | 'pursuer-withdrawer'
  | 'emotional-invalidation'
  | 'circular-logical-debate'
  | 'power-control-struggle'
  | 'unspoken-resentment'
  | 'over-accommodation'
  | 'mutual-defensiveness';

export interface ComparisonSituationInput {
  reportedBehavior?: string;
  observedTrigger?: string;
  communicationGoal?: string;
}

export interface StageOutcomeOption {
  outcomeLabel: string;
  whyPlausible: string;
  personAExperience: string;
  personBExperience: string;
  whatRemainsUnresolved: string;
  longTermConsequence: string;
}

export interface DynamicConflictStage {
  stage: 1 | 2 | 3 | 4 | 5;
  stageTitle: string;
  interactionDescription: string;
  underlyingMechanism: string;
  personAPerspective: string;
  personBPerspective: string;
  relevantTypologyDifferences: string[];
  concreteExample: string;
  transitionToNext: string;
  alternativeOutcomes?: StageOutcomeOption[];
}

export interface IndividualDefenseBreakdown {
  personName: string;
  immediateReaction: string;
  protectingWhat: string;
  fearOfLosing: string;
  underlyingNeed: string;
  howMisinterpreted: string;
}

export interface MechanismMatchedResolution {
  mechanismId: ConflictMechanismId;
  mechanismName: string;
  mechanismSummary: string;
  addressesOriginalMisunderstanding: string;
  aInterpretationVsBInterpretation: string;
  personANeeds: string;
  personBNeeds: string;
  maintainingBehaviors: string[];
  cycleInterruptingActions: string[];
  concreteBehaviorShifts: string[];
}

export interface PersonalizedDialogueSet {
  personA: {
    name: string;
    explainPerspective: string;
    avoidSaying: string;
    constructiveAlternative: string;
    clarificationQuestion: string;
  };
  personB: {
    name: string;
    explainPerspective: string;
    avoidSaying: string;
    constructiveAlternative: string;
    clarificationQuestion: string;
  };
  mutualRepair: {
    repairStatement: string;
    constructiveMiniDialogue: { speaker: string; line: string }[];
    practicalAgreement: string;
  };
}

export interface InterpersonalComparisonResult {
  context: RelationshipContext;
  contextGuidance: string;
  hasBehavioralDetails: boolean;
  clarifyingQuestions: string[];
  profilesCompared: {
    id: string;
    displayName: string;
    category: string;
    socionics: SocionicsCode | '';
    quadra: QuadraName | '';
    enneagram: string;
    jungian: string;
    tritype: string;
    psychosophy: string;
    mbti: string;
    sloan: string;
    temperament: string;
  }[];
  socionicsDifferences: string[];
  modelADifferences: string[];
  informationElementClashes: string[];
  jungianDifferences: string[];
  enneagramDifferences: string[];
  coreMotivationDifferences: string[];
  instinctDifferences: string[];
  tritypeDifferences: string[];
  mbtiDifferences: string[];
  sloanDifferences: string[];
  temperamentDifferences: string[];
  psychosophyComparison: PsychosophyPairComparison;
  directionalMap: DirectionalDynamicsMap;
  informationProcessingDifferences: string[];
  communicationPreferences: string[];
  decisionMakingDifferences: string[];
  potentialStrengths: string[];
  potentialMisunderstandings: string[];
  potentialConflictPatterns: string[];
  conflictMechanismId: ConflictMechanismId;
  conflictMechanismTitle: string;
  conflictStages: DynamicConflictStage[];
  stage3DefenseDetails: {
    personA: IndividualDefenseBreakdown;
    personB: IndividualDefenseBreakdown;
  };
  stage4CycleDetails: {
    trigger: string;
    reinforcementLoop: string;
    personAContribution: string;
    personBContribution: string;
    interruptionPoint: string;
  };
  stage5OutcomeSummary: {
    primaryOutcome: StageOutcomeOption;
    contributingStagesSummary: string;
  };
  detailedResolution: MechanismMatchedResolution;
  personalizedDialogues: PersonalizedDialogueSet;
  evidenceClassification: {
    reportedFacts: string[];
    typologyInterpretations: string[];
    hypotheticalScenarios: string[];
    nonTypologyExplanations: string[];
  };
  badTurnSequence: {
    step: number;
    title: string;
    description: string;
  }[];
  practicalRecommendations: string[];
  howToCommunicateScripts: {
    situation: string;
    avoid: string;
    trySaying: string;
  }[];
  disclaimer: string;
}

const CONTEXT_GUIDANCE_MAP: Record<RelationshipContext, string> = {
  'Teman sekelas':
    'Dalam konteks teman sekelas, kebutuhan utama biasanya berkisar pada kenyamanan interaksi harian, saling menghormati batas ruang, dan kejelasan sikap tanpa tuntutan kedekatan emosional berlebih.',
  'Teman dekat':
    'Dalam konteks teman dekat, kepekaan terhadap perbedaan kebutuhan ruang pribadi, ekspresi kepedulian, dan kerentanan emosional menjadi jauh lebih menentukan daripada sekadar pembagian tugas.',
  'Anggota kelompok':
    'Dalam kerja kelompok SMA, keselarasan ekspektasi mutu, kejelasan tenggat, distribusi peran yang adil, dan cara memberi koreksi draf merupakan titik paling krusial.',
  'Guru dan siswa':
    'Dalam relasi guru dan siswa, terdapat perbedaan peran otoritas dan tanggung jawab pembinaan; rekomendasi difokuskan pada kejelasan instruksi, rasa aman bertanya, dan umpan balik akademik yang membangun.',
  'Koordinator dan anggota':
    'Dalam relasi koordinator dan anggota (misalnya ketua kelas/OSIS atau ketua kelompok), keseimbangan antara ketegasan koordinasi jadwal dengan mendengarkan kendala anggota menjadi kunci.',
  'Konteks interpersonal lainnya':
    'Analisis ditempatkan pada prinsip keterbukaan komunikasi lintas konteks dengan tetap memeriksa kesepakatan harapan masing-masing pihak.',
};

interface PairElementClash {
  title: string;
  detail: string;
}

function detectInformationElementClashes(
  p1Name: string,
  p2Name: string,
  m1: InformationElement[],
  m2: InformationElement[]
): PairElementClash[] {
  const clashes: PairElementClash[] = [];
  const p1Ego = new Set([m1[0], m1[1]]);
  const p2Ego = new Set([m2[0], m2[1]]);

  const pairs: {
    elA: InformationElement;
    elB: InformationElement;
    title: string;
    explanation: string;
  }[] = [
    {
      elA: 'Te',
      elB: 'Ti',
      title: 'Benturan Te vs Ti (Efisiensi Praktis vs Konsistensi Sistem)',
      explanation:
        'Pihak Te mendahulukan bukti terukur, langkah cepat, dan hasil yang langsung berjalan; pihak Ti mendahulukan ketepatan definisi, struktur prinsip, dan konsistensi logika internal sebelum bergerak.',
    },
    {
      elA: 'Fe',
      elB: 'Fi',
      title: 'Benturan Fe vs Fi (Atmosfer Ekspresif vs Nilai & Jarak Personal)',
      explanation:
        'Pihak Fe membaca kehangatan lewat ekspresi emosional yang terlihat dan keterlibatan suasana kelompok; pihak Fi menilai ketulusan secara batin dalam relasi personal dan dapat terganggu jika ekspresi terasa dipaksakan.',
    },
    {
      elA: 'Se',
      elB: 'Si',
      title: 'Benturan Se vs Si (Dorongan Tekanan Cepat vs Kenyamanan & Ritme Stabil)',
      explanation:
        'Pihak Se menanggapi situasi dengan inisiatif langsung dan tuntutan keputusan tegas saat ini juga; pihak Si menjaga kenyamanan fisik, ritme bertahap, dan ketenangan suasana tanpa paksaan mendadak.',
    },
    {
      elA: 'Ne',
      elB: 'Ni',
      title: 'Benturan Ne vs Ni (Eksplorasi Banyak Kemungkinan vs Fokus Arah Tunggal)',
      explanation:
        'Pihak Ne terus membuka berbagai opsi baru dan sudut pandang alternatif; pihak Ni ingin menyaring makna inti dan melihat ke mana satu jalur utama akan bermuara.',
    },
  ];

  for (const pair of pairs) {
    if (
      (p1Ego.has(pair.elA) && p2Ego.has(pair.elB)) ||
      (p1Ego.has(pair.elB) && p2Ego.has(pair.elA))
    ) {
      const aHolder = p1Ego.has(pair.elA) ? p1Name : p2Name;
      const bHolder = p1Ego.has(pair.elB) ? p1Name : p2Name;
      clashes.push({
        title: pair.title,
        detail: `${pair.title}: ${aHolder} mengutamakan ${pair.elA} sementara ${bHolder} mengutamakan ${pair.elB}. ${pair.explanation}`,
      });
    }
  }

  // Ego -> PoLR intersections
  if (p1Ego.has(m2[3])) {
    clashes.push({
      title: `Ego ${p1Name} (${m1[0]}/${m1[1]}) menyentuh PoLR ${p2Name} (${m2[3]})`,
      detail: `Kekuatan alami ${p1Name} di elemen ${m2[3]} berhadapan langsung dengan titik paling peka ${p2Name} (PoLR posisi 4: ${INFORMATION_ELEMENTS[m2[3]].indonesianName}). Tuntutan terbuka di ranah ${m2[3]} mudah terasa menekan bagi ${p2Name}.`,
    });
  }
  if (p2Ego.has(m1[3])) {
    clashes.push({
      title: `Ego ${p2Name} (${m2[0]}/${m2[1]}) menyentuh PoLR ${p1Name} (${m1[3]})`,
      detail: `Kekuatan alami ${p2Name} di elemen ${m1[3]} berhadapan langsung dengan titik paling peka ${p1Name} (PoLR posisi 4: ${INFORMATION_ELEMENTS[m1[3]].indonesianName}). Penyampaian di ranah ${m1[3]} perlu dijelaskan bertahap agar ${p1Name} tidak merasa diserang.`,
    });
  }

  // Different rational/irrational tempo if nothing else caught
  if (clashes.length === 0 && m1[0] !== m2[0]) {
    clashes.push({
      title: `Perbedaan Leading ${m1[0]} vs ${m2[0]}`,
      detail: `${p1Name} memfilter informasi pertama kali lewat ${m1[0]} (${INFORMATION_ELEMENTS[m1[0]].indonesianName}), sedangkan ${p2Name} lewat ${m2[0]} (${INFORMATION_ELEMENTS[m2[0]].indonesianName}).`,
    });
  }

  return clashes;
}

function classifyConflictMechanism(
  p1: Profile,
  p2: Profile,
  context: RelationshipContext,
  situationText: string
): ConflictMechanismId {
  const s1 = p1.typology.socionics ? SOCIONICS_TYPES[p1.typology.socionics] : null;
  const s2 = p2.typology.socionics ? SOCIONICS_TYPES[p2.typology.socionics] : null;
  const e1 = p1.typology.enneagramCore ? ENNEAGRAM_TYPES[p1.typology.enneagramCore] : null;
  const e2 = p2.typology.enneagramCore ? ENNEAGRAM_TYPES[p2.typology.enneagramCore] : null;
  const psy1 = parsePsychosophyPositions(p1.typology.psychosophyCode).positionMap;
  const psy2 = parsePsychosophyPositions(p2.typology.psychosophyCode).positionMap;

  const textLower = situationText.toLowerCase();
  if (textLower.includes('diam') && (textLower.includes('kejar') || textLower.includes('desak') || textLower.includes('chat'))) {
    return 'pursuer-withdrawer';
  }
  if (textLower.includes('debat') || textLower.includes('definisi') || textLower.includes('logika')) {
    return 'circular-logical-debate';
  }
  if (textLower.includes('perintah') || textLower.includes('kontrol') || textLower.includes('dominan') || textLower.includes('otoritas')) {
    return 'power-control-struggle';
  }
  if (textLower.includes('dingin') || textLower.includes('perasaan') || textLower.includes('validasi')) {
    return 'emotional-invalidation';
  }
  if (textLower.includes('mengalah') || textLower.includes('pendam') || textLower.includes('sungkan')) {
    return 'unspoken-resentment';
  }

  // Typology-driven dynamic selection (also respects MBTI, SLOAN, Temperament, Psychosophy)
  const p1Mbti = (p1.typology.mbti || '').trim().toUpperCase();
  const p2Mbti = (p2.typology.mbti || '').trim().toUpperCase();
  const p1Sloan = (p1.typology.sloanCode || '').trim().toUpperCase();
  const p2Sloan = (p2.typology.sloanCode || '').trim().toUpperCase();
  const p1Temp = (p1.typology.temperament || '').trim().toLowerCase();
  const p2Temp = (p2.typology.temperament || '').trim().toLowerCase();

  const p1Logical = s1
    ? ['Te', 'Ti'].includes(s1.modelA[0]) || ['Te', 'Ti'].includes(s1.modelA[1])
    : p1Mbti.includes('T');
  const p2Logical = s2
    ? ['Te', 'Ti'].includes(s2.modelA[0]) || ['Te', 'Ti'].includes(s2.modelA[1])
    : p2Mbti.includes('T');
  const p1Ethical = s1 ? ['Fe', 'Fi'].includes(s1.modelA[0]) : p1Mbti.includes('F');
  const p2Ethical = s2 ? ['Fe', 'Fi'].includes(s2.modelA[0]) : p2Mbti.includes('F');

  // Temperament or SLOAN dynamic overrides when core types match or complement strongly
  const isChol1 = p1Temp.startsWith('kol') || p1Temp.startsWith('chol');
  const isChol2 = p2Temp.startsWith('kol') || p2Temp.startsWith('chol');
  const isPhleg1 = p1Temp.startsWith('pleg') || p1Temp.startsWith('phleg');
  const isPhleg2 = p2Temp.startsWith('pleg') || p2Temp.startsWith('phleg');
  const isMel1 = p1Temp.startsWith('mel');
  const isMel2 = p2Temp.startsWith('mel');

  if (
    (psy1 && psy2 && ((psy1.V === 1 && psy2.V === 3) || (psy2.V === 1 && psy1.V === 3))) ||
    ((s1?.modelA[0] === 'Se' || e1?.number === 8 || e1?.number === 1 || isChol1) &&
      (s2?.modelA[3] === 'Se' || e2?.number === 8 || e2?.number === 6 || isChol2)) ||
    ((s2?.modelA[0] === 'Se' || e2?.number === 8 || e2?.number === 1 || isChol2) &&
      (s1?.modelA[3] === 'Se' || e1?.number === 8 || e1?.number === 6 || isChol1))
  ) {
    if (
      context === 'Koordinator dan anggota' ||
      context === 'Guru dan siswa' ||
      e1?.number === 8 ||
      e2?.number === 8 ||
      (isChol1 && isChol2) ||
      (psy1?.V === 1 && psy2?.V === 3) ||
      (psy2?.V === 1 && psy1?.V === 3)
    ) {
      return 'power-control-struggle';
    }
  }

  // Emotional invalidation: Logical/Calm/E-SLOAN vs Ethical/Heart/Limbic/1E-2E
  if (
    ((p1Logical && !p1Ethical && (p2Ethical || e2?.center === 'Heart' || (psy2 && psy2.E <= 2) || p2Sloan[1] === 'L')) ||
      (p2Logical && !p2Ethical && (p1Ethical || e1?.center === 'Heart' || (psy1 && psy1.E <= 2) || p1Sloan[1] === 'L'))) &&
    (e1?.number === 4 || e2?.number === 4 || psy1?.E === 1 || psy2?.E === 1 || p1Mbti.includes('F') !== p2Mbti.includes('F'))
  ) {
    return 'emotional-invalidation';
  }

  // Pursuer-Withdrawer: Assertive/S/Choleric vs Withdrawn/R/Phlegmatic-Melancholic
  if (
    (e1?.hornevian === 'Assertive' && e2?.hornevian === 'Withdrawn') ||
    (e2?.hornevian === 'Assertive' && e1?.hornevian === 'Withdrawn') ||
    (p1Sloan[0] === 'S' && p2Sloan[0] === 'R' && (isChol1 || p1Sloan[1] === 'L') && (isPhleg2 || isMel2)) ||
    (p2Sloan[0] === 'S' && p1Sloan[0] === 'R' && (isChol2 || p2Sloan[1] === 'L') && (isPhleg1 || isMel1))
  ) {
    return 'pursuer-withdrawer';
  }

  // Circular logical debate: Both Logical (Te vs Ti or 1L/2L or both MBTI T)
  if ((p1Logical && p2Logical) || (psy1 && psy2 && psy1.L <= 2 && psy2.L <= 2)) {
    return 'circular-logical-debate';
  }

  // Over-accommodation vs directness: Type 2/9 + 4V/Phlegmatic vs Assertive/1V/Choleric
  if (
    ((e1?.number === 2 || e1?.number === 9 || isPhleg1) && (e2?.hornevian === 'Assertive' || psy2?.V === 1 || isChol2)) ||
    ((e2?.number === 2 || e2?.number === 9 || isPhleg2) && (e1?.hornevian === 'Assertive' || psy1?.V === 1 || isChol1))
  ) {
    return 'over-accommodation';
  }

  if (e1?.hornevian !== 'Assertive' && e2?.hornevian !== 'Assertive') {
    return 'unspoken-resentment';
  }

  return 'mutual-defensiveness';
}

function getSecondaryFixFlavors(p: Profile): string {
  const core = p.typology.enneagramCore;
  const fixes = [p.typology.tritypeHeart, p.typology.tritypeHead, p.typology.tritypeGut].filter(
    (x): x is NonNullable<typeof x> => Boolean(x) && x !== core
  );
  if (fixes.length === 0) {
    return p.typology.tritype
      ? `Konfigurasi Tritype ${p.typology.tritype} ikut mewarnai gaya respons tambahan di luar motivasi inti.`
      : 'Three Fix / Tritype belum diisi sehingga analisis Enneagram bertumpu pada tipe inti dan varian insting.';
  }
  const labels = fixes.map((f) => {
    const spec = ENNEAGRAM_TYPES[f];
    return `fix sekunder ${f} (${spec.center}: ${spec.harmonic})`;
  });
  return `Sebagai pendamping sekunder (bukan inti kedua), ${labels.join(' dan ')} dapat mewarnai cara ia merumuskan perlindungan diri saat tertekan.`;
}

function buildIndividualDefense(p: Profile, other: Profile, context: RelationshipContext): IndividualDefenseBreakdown {
  const s = p.typology.socionics ? SOCIONICS_TYPES[p.typology.socionics] : null;
  const e = p.typology.enneagramCore ? ENNEAGRAM_TYPES[p.typology.enneagramCore] : null;
  const psy = parsePsychosophyPositions(p.typology.psychosophyCode);
  const pos3 = psy.valid ? psy.placements[2] : null;

  const socReaction = s
    ? `mengaktifkan fungsi ${s.modelA[2]} (Role) secara kaku atau menarik diri saat titik PoLR ${s.modelA[3]} tersentuh`
    : 'berjaga-jaga dan mengurangi keterbukaan spontan';

  const ennProtect = e
    ? `${e.coreDesire.toLowerCase()} serta menghindari ${e.coreFear.toLowerCase().replace(/^takut /, '')}`
    : 'martabat pribadi dan rasa aman dalam interaksi';

  const psyNote = pos3
    ? ` Pada Psikosofi, posisi sensitif ${pos3.code} (${pos3.aspectName.split('(')[0].trim()}) membuatnya ekstra waspada bila merasa dievaluasi atau didesak di aspek tersebut.`
    : '';

  const immediateReaction =
    e?.hornevian === 'Assertive'
      ? `Cepat mengambil inisiatif bicara lebih tegas atau mendesak kejelasan langsung dalam konteks ${context}, sambil ${socReaction}.`
      : e?.hornevian === 'Withdrawn'
      ? `Mengurangi respons verbal, menjaga jarak emosional untuk memproses di dalam diri, dan ${socReaction}.`
      : `Mencoba merujuk pada aturan/tanggung jawab bersama atau mencari kepastian sikap dari pihak lain, sambil ${socReaction}.`;

  const howMisinterpreted =
    e?.hornevian === 'Assertive'
      ? `${other.displayName} dapat menafsirkan ketegasan cepat ini sebagai sikap menyerang atau tidak mau mendengarkan.`
      : e?.hornevian === 'Withdrawn'
      ? `${other.displayName} dapat menafsirkan jeda diam ini sebagai sikap dingin, tidak peduli, atau menolak bekerja sama.`
      : `${other.displayName} dapat menafsirkan penekanan pada aturan atau kekhawatiran ini sebagai kecurigaan atau ketidakpuasan pribadi.`;

  return {
    personName: p.displayName,
    immediateReaction: `${immediateReaction}${psyNote}`,
    protectingWhat: `Melindungi ${ennProtect} serta menjaga kendali di area kekuatannya (${s ? `${s.modelA[0]}/${s.modelA[1]}` : 'preferensi personal'}).`,
    fearOfLosing: e
      ? e.coreFear
      : 'Takut usahanya diremehkan, disalahpahami, atau kehilangan rasa hormat di kelompok.',
    underlyingNeed: `${e ? `Merasa aman bahwa ${e.coreDesire.toLowerCase()}` : 'Dihargai secara adil'}${s ? ` serta menerima informasi ${s.modelA[4]} (Suggestive) secara suportif tanpa kritik keras di ${s.modelA[3]}` : ''}. ${getSecondaryFixFlavors(p)}`,
    howMisinterpreted,
  };
}

export function analyzeInterpersonalComparison(
  selectedProfiles: Profile[],
  context: RelationshipContext,
  situationInput?: ComparisonSituationInput
): InterpersonalComparisonResult | null {
  if (selectedProfiles.length < 2) return null;

  const p1 = selectedProfiles[0];
  const p2 = selectedProfiles[1];
  const extraCount = selectedProfiles.length - 2;

  const reportedBehavior = situationInput?.reportedBehavior?.trim() || '';
  const observedTrigger = situationInput?.observedTrigger?.trim() || '';
  const communicationGoal = situationInput?.communicationGoal?.trim() || '';
  const hasBehavioralDetails = Boolean(reportedBehavior || observedTrigger);
  const combinedSituationText = `${reportedBehavior} ${observedTrigger} ${communicationGoal}`.trim();

  const profilesCompared = selectedProfiles.map((p) => ({
    id: p.id,
    displayName: p.displayName,
    category: p.category,
    socionics: p.typology.socionics,
    quadra: p.typology.quadra,
    enneagram:
      p.typology.enneagramRaw ||
      (p.typology.enneagramCore ? `${p.typology.instinctVariant || ''}${p.typology.enneagramCore}` : 'Belum ditentukan'),
    jungian: p.typology.jungian || 'Belum ditentukan',
    tritype: p.typology.tritype || p.typology.threeFix || 'Belum diisi',
    psychosophy: p.typology.psychosophyCode || 'Belum diisi',
    mbti: p.typology.mbti || 'Belum diisi',
    sloan: p.typology.sloanExtended || p.typology.sloanCode || 'Belum diisi',
    temperament:
      [p.typology.temperament, p.typology.temperamentSecondary].filter(Boolean).join('–') || 'Belum diisi',
  }));

  const s1 = p1.typology.socionics ? SOCIONICS_TYPES[p1.typology.socionics] : null;
  const s2 = p2.typology.socionics ? SOCIONICS_TYPES[p2.typology.socionics] : null;
  const e1 = p1.typology.enneagramCore ? ENNEAGRAM_TYPES[p1.typology.enneagramCore] : null;
  const e2 = p2.typology.enneagramCore ? ENNEAGRAM_TYPES[p2.typology.enneagramCore] : null;
  const psy1 = parsePsychosophyPositions(p1.typology.psychosophyCode);
  const psy2 = parsePsychosophyPositions(p2.typology.psychosophyCode);
  const psychosophyComparison = comparePsychosophyProfiles(p1, p2);

  const socionicsDifferences: string[] = [];
  const modelADifferences: string[] = [];
  const informationElementClashes: string[] = [];
  const infoProcDiffs: string[] = [];
  const commPrefs: string[] = [];
  const decisionDiffs: string[] = [];
  const strengths: string[] = [];
  const misunderstandings: string[] = [];

  if (s1 && s2) {
    if (s1.code === s2.code) {
      socionicsDifferences.push(
        `${p1.displayName} dan ${p2.displayName} sama-sama tercatat bertipe ${s1.code} (${s1.quadra}). Kesamaan Model A membantu ritme berpikir awal, namun keduanya tetap dapat berbeda melalui Enneagram, insting, Psikosofi, serta pengalaman pribadi.`
      );
    } else if (s1.quadra === s2.quadra) {
      socionicsDifferences.push(
        `${p1.displayName} (${s1.code}) dan ${p2.displayName} (${s2.code}) berada di Quadra yang sama (${s1.quadra}), tetapi menempatkan elemen bernilai di posisi Model A yang berbeda. Kesamaan Quadra tidak otomatis mencegah kesalahpahaman.`
      );
    } else {
      socionicsDifferences.push(
        `${p1.displayName} (${s1.code}, Quadra ${s1.quadra}) dan ${p2.displayName} (${s2.code}, Quadra ${s2.quadra}) memprioritaskan pasangan Elemen Informasi bernilai yang berbeda.`
      );
    }

    modelADifferences.push(
      `Blok Ego & Titik Peka: ${p1.displayName} memimpin lewat ${s1.modelA[0]}/${s1.modelA[1]} (kuat & bernilai), menjaga citra sosial lewat Role ${s1.modelA[2]}, peka di PoLR ${s1.modelA[3]}, dan butuh bantuan suportif di Suggestive ${s1.modelA[4]}; sementara ${p2.displayName} memimpin lewat ${s2.modelA[0]}/${s2.modelA[1]}, menjaga Role ${s2.modelA[2]}, peka di PoLR ${s2.modelA[3]}, dan butuh dukungan di Suggestive ${s2.modelA[4]}.`
    );

    const detectedClashes = detectInformationElementClashes(p1.displayName, p2.displayName, s1.modelA, s2.modelA);
    for (const cl of detectedClashes) {
      informationElementClashes.push(cl.detail);
    }

    if (s1.modelA[0] === s2.modelA[4] || s2.modelA[0] === s1.modelA[4]) {
      modelADifferences.push(
        `Titik Saling Dukung (Suggestive): Kekuatan utama satu pihak selaras dengan kebutuhan informasi posisi ke-5 (Suggestive) pihak lainnya bila disampaikan dengan hormat tanpa menggurui.`
      );
    }

    const s1El = INFORMATION_ELEMENTS[s1.modelA[0]];
    const s2El = INFORMATION_ELEMENTS[s2.modelA[0]];
    infoProcDiffs.push(
      `${p1.displayName} cenderung memfilter situasi melalui ${s1El.code} (${s1El.indonesianName}), sementara ${p2.displayName} memprioritaskan ${s2El.code} (${s2El.indonesianName}).`
    );

    commPrefs.push(
      `${p1.displayName} (${s1.code}): ${s1.communicationPreferences.join(' ')}`,
      `${p2.displayName} (${s2.code}): ${s2.communicationPreferences.join(' ')}`
    );

    const p1Rational = ['Te', 'Ti', 'Fe', 'Fi'].includes(s1.modelA[0]);
    const p2Rational = ['Te', 'Ti', 'Fe', 'Fi'].includes(s2.modelA[0]);
    if (p1Rational !== p2Rational) {
      decisionDiffs.push(
        `Perbedaan tempo keputusan: tipe Rasional (${p1Rational ? p1.displayName : p2.displayName}) biasanya ingin keputusan terkunci konsisten lebih awal, sedangkan tipe Irasional (${!p1Rational ? p1.displayName : p2.displayName}) lebih nyaman menjaga keluwesan mengikuti perkembangan situasi.`
      );
    } else {
      decisionDiffs.push(
        `Keduanya memiliki orientasi Rasional/Irasional sejenis, namun berbeda pada kriteria inti yang diutamakan (${s1.modelA[0]} vs ${s2.modelA[0]}).`
      );
    }

    strengths.push(
      `Kombinasi sudut pandang: ${p1.displayName} membawa kekuatan ${s1.theoreticalStrengths[0].toLowerCase()}, sedangkan ${p2.displayName} melengkapi lewat ${s2.theoreticalStrengths[0].toLowerCase()}.`
    );
    misunderstandings.push(s1El.potentialMisunderstanding, s2El.potentialMisunderstanding);
  } else {
    socionicsDifferences.push(
      'Salah satu atau lebih profil belum memiliki klasifikasi Socionics yang lengkap. Analisis tetap disusun berdasarkan data yang tersedia dan konteks komunikasi.'
    );
    modelADifferences.push('Pemetaan Model A belum dapat dibandingkan lengkap karena data Socionics belum terisi penuh.');
    informationElementClashes.push('Benturan Elemen Informasi spesifik belum dapat dipetakan karena data Socionics belum lengkap.');
  }

  if (extraCount > 0) {
    socionicsDifferences.push(
      `Perbandingan mencakup ${selectedProfiles.length} individu (termasuk ${extraCount} profil tambahan: ${selectedProfiles
        .slice(2)
        .map((p) => `${p.displayName}${p.typology.socionics ? ` [${p.typology.socionics}]` : ''}`)
        .join(', ')}). Dalam dinamika kelompok besar, cegah koalisi mayoritas mendominasi anggota minoritas.`
    );
  }

  const jungianDifferences: string[] = selectedProfiles.map((p) => {
    if (p.typology.jungian) {
      const parsed = parseJungianNotation(p.typology.jungian);
      return `${p.displayName} (${p.typology.jungian}): ${parsed.valid ? `Dominan ${parsed.dominantFunction} (${parsed.dominantOrientation}) dengan pendamping ${parsed.accompanyingFunction}.` : p.typology.jungian}`;
    }
    return `${p.displayName}: Notasi Tipologi Jung belum ditetapkan.`;
  });

  const enneagramDifferences: string[] = [];
  const coreMotivationDifferences: string[] = [];
  const instinctDifferences: string[] = [];
  const tritypeDifferences: string[] = [];

  if (e1 && e2) {
    enneagramDifferences.push(
      `${p1.displayName} (Tipe ${e1.number}, Pusat ${e1.center}, Harmonik ${e1.harmonic} · Hornevian ${e1.hornevian}) dibandingkan dengan ${p2.displayName} (Tipe ${e2.number}, Pusat ${e2.center}, Harmonik ${e2.harmonic} · Hornevian ${e2.hornevian}).`
    );
    coreMotivationDifferences.push(
      `${p1.displayName} (Inti ${e1.number}): ${e1.coreMotivation} Sensitif terhadap ketakutan inti: ${e1.coreFear.toLowerCase()}. Mekanisme pertahanan khas: ${e1.defenseMechanism}`,
      `${p2.displayName} (Inti ${e2.number}): ${e2.coreMotivation} Sensitif terhadap ketakutan inti: ${e2.coreFear.toLowerCase()}. Mekanisme pertahanan khas: ${e2.defenseMechanism}`
    );
    if (e1.harmonic !== e2.harmonic) {
      decisionDiffs.push(
        `Saat stres/konflik: ${p1.displayName} (${e1.harmonic}) dan ${p2.displayName} (${e2.harmonic}) menggunakan strategi regulasi emosi yang berbeda.`
      );
    }
    strengths.push(
      `Sinergi Enneagram potensial: menggabungkan ${e1.potentialStrengths[0].toLowerCase()} dan ${e2.potentialStrengths[0].toLowerCase()}.`
    );
  } else {
    enneagramDifferences.push(
      'Data Enneagram inti belum tersedia lengkap untuk seluruh profil yang dipilih; konfirmasikan motivasi utama secara langsung.'
    );
  }

  for (const p of selectedProfiles) {
    const inst = p.typology.instinctVariant;
    const stacking = p.typology.instinctStacking;
    if (stacking && INSTINCT_STACKINGS[stacking]) {
      const stSpec = INSTINCT_STACKINGS[stacking];
      instinctDifferences.push(`${p.displayName} (${stacking}, blind ${stSpec.blind}): ${stSpec.everydayTendencies}`);
    } else if (inst && INSTINCT_VARIANTS[inst]) {
      instinctDifferences.push(`${p.displayName} (Varian dominan ${inst}): ${INSTINCT_VARIANTS[inst].summary}`);
    } else {
      instinctDifferences.push(`${p.displayName}: Varian insting belum diisi.`);
    }
  }

  for (const p of selectedProfiles) {
    if (p.typology.tritype || p.typology.threeFix) {
      tritypeDifferences.push(
        `${p.displayName} (${p.typology.tritype || p.typology.threeFix}): ${getSecondaryFixFlavors(p)}`
      );
    } else {
      tritypeDifferences.push(`${p.displayName}: Three Fix / Tritype belum dikonfigurasi.`);
    }
  }

  // ==================== MBTI, SLOAN & TEMPERAMENT INTEGRATION ====================
  const mbtiDifferences: string[] = [];
  const sloanDifferences: string[] = [];
  const temperamentDifferences: string[] = [];

  const m1 = ALL_16_MBTI_PROFILES.find((m) => m.code === (p1.typology.mbti || '').trim().toUpperCase()) || null;
  const m2 = ALL_16_MBTI_PROFILES.find((m) => m.code === (p2.typology.mbti || '').trim().toUpperCase()) || null;

  if (m1 && m2) {
    if (m1.code === m2.code) {
      mbtiDifferences.push(
        `${p1.displayName} dan ${p2.displayName} sama-sama berpreferensi MBTI ${m1.code} (${m1.grantStack.join('–')}). Keduanya berbagi arah persepsi–keputusan serupa, namun tetap bisa bertolak belakang di temperamen, SLOAN, atau Psikosofi.`
      );
    } else {
      const diffAxes: string[] = [];
      if (m1.dichotomyBreakdown.EorI !== m2.dichotomyBreakdown.EorI) diffAxes.push(`Energi (${m1.dichotomyBreakdown.EorI} vs ${m2.dichotomyBreakdown.EorI})`);
      if (m1.dichotomyBreakdown.SorN !== m2.dichotomyBreakdown.SorN) diffAxes.push(`Informasi (${m1.dichotomyBreakdown.SorN} vs ${m2.dichotomyBreakdown.SorN})`);
      if (m1.dichotomyBreakdown.TorF !== m2.dichotomyBreakdown.TorF) diffAxes.push(`Keputusan (${m1.dichotomyBreakdown.TorF} vs ${m2.dichotomyBreakdown.TorF})`);
      if (m1.dichotomyBreakdown.JorP !== m2.dichotomyBreakdown.JorP) diffAxes.push(`Struktur Luar (${m1.dichotomyBreakdown.JorP} vs ${m2.dichotomyBreakdown.JorP})`);
      mbtiDifferences.push(
        `${p1.displayName} (${m1.code}: ${p1.typology.mbtiCognitiveStack || m1.grantStack.join('–')}) berbeda dengan ${p2.displayName} (${m2.code}: ${p2.typology.mbtiCognitiveStack || m2.grantStack.join('–')}) pada sumbu ${diffAxes.join(', ')}.`
      );
      if (m1.dichotomyBreakdown.SorN !== m2.dichotomyBreakdown.SorN) {
        infoProcDiffs.push(
          `Perbedaan MBTI S vs N: ${m1.dichotomyBreakdown.SorN === 'S' ? p1.displayName : p2.displayName} membutuhkan contoh faktual langkah demi langkah, sementara ${m1.dichotomyBreakdown.SorN === 'N' ? p1.displayName : p2.displayName} langsung menangkap pola gambaran besar.`
        );
      }
      if (m1.dichotomyBreakdown.TorF !== m2.dichotomyBreakdown.TorF) {
        decisionDiffs.push(
          `Perbedaan kriteria MBTI T vs F: ${m1.dichotomyBreakdown.TorF === 'T' ? p1.displayName : p2.displayName} menguji konsistensi logis terlebih dulu, sedangkan ${m1.dichotomyBreakdown.TorF === 'F' ? p1.displayName : p2.displayName} memprioritaskan dampak kemanusiaan dan keselarasan nilai.`
        );
      }
    }
  } else {
    mbtiDifferences.push(
      `${p1.displayName}: ${p1.typology.mbti || 'Belum diisi'} · ${p2.displayName}: ${p2.typology.mbti || 'Belum diisi'}. Lengkapi kedua kode MBTI untuk analisis irisan dikotomi & tumpukan.`
    );
  }

  const sl1Raw = (p1.typology.sloanExtended || p1.typology.sloanCode || '').trim();
  const sl2Raw = (p2.typology.sloanExtended || p2.typology.sloanCode || '').trim();
  const sl1Parsed = sl1Raw ? parseExtendedSloanNotation(sl1Raw) : null;
  const sl2Parsed = sl2Raw ? parseExtendedSloanNotation(sl2Raw) : null;
  const sl1Five = sl1Parsed?.canonicalFiveLetter || '';
  const sl2Five = sl2Parsed?.canonicalFiveLetter || '';

  if (sl1Five && sl2Five) {
    const contrastLabels: string[] = [];
    if (sl1Five[0] !== sl2Five[0]) contrastLabels.push(`Sosial (${sl1Five[0]} vs ${sl2Five[0]})`);
    if (sl1Five[1] !== sl2Five[1]) contrastLabels.push(`Reaktivitas Stres (${sl1Five[1]} vs ${sl2Five[1]})`);
    if (sl1Five[2] !== sl2Five[2]) contrastLabels.push(`Keteraturan (${sl1Five[2]} vs ${sl2Five[2]})`);
    if (sl1Five[3] !== sl2Five[3]) contrastLabels.push(`Kompromi (${sl1Five[3]} vs ${sl2Five[3]})`);
    if (sl1Five[4] !== sl2Five[4]) contrastLabels.push(`Keterbukaan Ide (${sl1Five[4]} vs ${sl2Five[4]})`);

    if (contrastLabels.length === 0) {
      sloanDifferences.push(
        `Keduanya berbagi kode dasar SLOAN ${sl1Five}${sl1Raw !== sl2Raw ? ` (variasi penekanan ${sl1Raw} vs ${sl2Raw})` : ''}, sehingga ritme kebiasaan teramati sehari-hari relatif selaras.`
      );
    } else {
      sloanDifferences.push(
        `Perbandingan Big Five / SLOAN (${sl1Raw} vs ${sl2Raw}) berbeda di dimensi: ${contrastLabels.join(', ')}.`
      );
      if (sl1Five[2] !== sl2Five[2]) {
        commPrefs.push(
          `Perbedaan keteraturan SLOAN (O vs U): ${sl1Five[2] === 'O' ? p1.displayName : p2.displayName} nyaman dengan jadwal ketat & daftar tugas jelas, sementara ${sl1Five[2] === 'U' ? p1.displayName : p2.displayName} lebih luwes mengikuti momentum.`
        );
        misunderstandings.push(
          `Pihak Organized (O) berisiko menganggap rekan Unstructured (U) kurang serius, sementara pihak U merasa terlalu dikekang jadwal mikro.`
        );
      }
      if (sl1Five[3] !== sl2Five[3]) {
        commPrefs.push(
          `Perbedaan kompromi SLOAN (A vs E): ${sl1Five[3] === 'E' ? p1.displayName : p2.displayName} berbicara lugas langsung ke inti persoalan, sedangkan ${sl1Five[3] === 'A' ? p1.displayName : p2.displayName} menjaga nada lembut agar hubungan tetap hangat.`
        );
      }
      if (sl1Five[1] !== sl2Five[1]) {
        strengths.push(
          `Keseimbangan emosi SLOAN (L vs C): pihak Calm (${sl1Five[1] === 'C' ? p1.displayName : p2.displayName}) memberi jangkar tenang saat krisis, sementara pihak Limbic (${sl1Five[1] === 'L' ? p1.displayName : p2.displayName}) cepat mendeteksi risiko yang perlu diantisipasi.`
        );
      }
    }
  } else {
    sloanDifferences.push(
      `${p1.displayName}: ${sl1Raw || 'Belum diisi'} · ${p2.displayName}: ${sl2Raw || 'Belum diisi'}. Tambahkan kode SLOAN untuk melihat kontras kebiasaan perilaku Big Five.`
    );
  }

  const normTemp = (val?: string) => {
    const low = (val || '').trim().toLowerCase();
    if (low.startsWith('sang')) return 'Sanguine';
    if (low.startsWith('chol') || low.startsWith('kol')) return 'Choleric';
    if (low.startsWith('mel')) return 'Melancholic';
    if (low.startsWith('phleg') || low.startsWith('pleg')) return 'Phlegmatic';
    return '';
  };
  const t1P = normTemp(p1.typology.temperament);
  const t1S = normTemp(p1.typology.temperamentSecondary);
  const t2P = normTemp(p2.typology.temperament);
  const t2S = normTemp(p2.typology.temperamentSecondary);
  const t1Label = [p1.typology.temperament, p1.typology.temperamentSecondary].filter(Boolean).join('–') || 'Belum diisi';
  const t2Label = [p2.typology.temperament, p2.typology.temperamentSecondary].filter(Boolean).join('–') || 'Belum diisi';

  if (t1P && t2P) {
    const blend1 = MIXED_12_TEMPERAMENTS.find((m) => m.primary === t1P && m.secondary === t1S);
    const blend2 = MIXED_12_TEMPERAMENTS.find((m) => m.primary === t2P && m.secondary === t2S);
    const class1 = CLASSICAL_4_TEMPERAMENTS.find((c) => c.name === t1P);
    const class2 = CLASSICAL_4_TEMPERAMENTS.find((c) => c.name === t2P);

    if (t1P === t2P && t1S === t2S) {
      temperamentDifferences.push(
        `${p1.displayName} dan ${p2.displayName} memiliki kombinasi temperamen sama (${t1Label}), sehingga kecepatan reaksi emosional dan kebutuhan energi suasana cenderung serupa.`
      );
    } else if (t1P === t2S && t1S === t2P && t1S && t2S) {
      temperamentDifferences.push(
        `Pasangan Temperamen Terbalik (${t1Label} vs ${t2Label}): keduanya berbagi dua unsur temperamen yang sama namun dengan urutan dominan berbeda. ${blend1?.contrastWithReversed || `${p1.displayName} memulai interaksi dari ${t1P}, sedangkan ${p2.displayName} memulai dari ${t2P}.`}`
      );
      strengths.push(`Pasangan ${t1Label} dan ${t2Label} cepat saling memahami karena sama-sama mengenal kedua unsur sifat tersebut dalam urutan prioritas berbeda.`);
    } else {
      temperamentDifferences.push(
        `${p1.displayName} (${t1Label}: ${class1?.eysenckMapping.split(':')[1]?.trim() || t1P}) bertemu ${p2.displayName} (${t2Label}: ${class2?.eysenckMapping.split(':')[1]?.trim() || t2P}).`
      );
      if ((t1P === 'Choleric' && t2P === 'Phlegmatic') || (t2P === 'Choleric' && t1P === 'Phlegmatic')) {
        commPrefs.push(`Tempo Koleris–Plegmatis: pihak Koleris ingin keputusan segera berjalan, sedangkan pihak Plegmatis menjaga suasana tetap tenang tanpa tekanan agresif.`);
      } else if ((t1P === 'Sanguine' && t2P === 'Melancholic') || (t2P === 'Sanguine' && t1P === 'Melancholic')) {
        commPrefs.push(`Tempo Sanguinis–Melankolis: pihak Sanguin cepat melempar gagasan spontan, sedangkan pihak Melankolis perlu waktu sunyi mengecek ketelitian risiko.`);
      }
    }
    if (blend2 && !strengths.some((s) => s.includes(blend2.title))) {
      strengths.push(`Kekuatan komplementer dari ${p2.displayName} (${blend2.indoTitle.split(' (')[0]}): ${blend2.strengths[0]}`);
    }
  } else {
    temperamentDifferences.push(`${p1.displayName}: ${t1Label} · ${p2.displayName}: ${t2Label}.`);
  }

  // ==================== DYNAMIC 5-STAGE PROGRESSION ====================
  const mechanismId = classifyConflictMechanism(p1, p2, context, combinedSituationText);

  const p1LeadDesc = s1 ? `${s1.modelA[0]} (${INFORMATION_ELEMENTS[s1.modelA[0]].indonesianName.split('(')[0].trim()})` : 'fokus langkah langsung';
  const p2LeadDesc = s2 ? `${s2.modelA[0]} (${INFORMATION_ELEMENTS[s2.modelA[0]].indonesianName.split('(')[0].trim()})` : 'prioritas sudut pandang berbeda';

  const instinctPairNote =
    p1.typology.instinctVariant && p2.typology.instinctVariant && p1.typology.instinctVariant !== p2.typology.instinctVariant
      ? `Perbedaan insting dominan (${p1.displayName}: ${p1.typology.instinctVariant} vs ${p2.displayName}: ${p2.typology.instinctVariant}) mengarahkan fokus kecemasan awal ke area prioritas yang berlainan.`
      : `Prioritas instingtual (${p1.typology.instinctVariant || 'umum'} & ${p2.typology.instinctVariant || 'umum'}) memengaruhi seberapa cepat isu terasa mendesak secara pribadi atau sosial.`;

  const psyFrictionNote = psychosophyComparison.available
    ? `Dari Psikosofi (${psy1.code} vs ${psy2.code}), terdapat ketegangan potensial di ${psychosophyComparison.activeConflictPrinciples[0]?.title || 'perbedaan posisi L/V/E/F antara keduanya'}.`
    : 'Data Psikosofi belum diisi lengkap sehingga perbedaan posisi L/V/E/F bersifat eksploratif umum.';

  const userTriggerNote = observedTrigger
    ? ` Berdasarkan catatan pengguna ("${observedTrigger}"), pemicu konkret berpusat pada situasi tersebut.`
    : '';

  const stage1: DynamicConflictStage = {
    stage: 1,
    stageTitle: 'Sumber Gesekan Awal & Perbedaan Titik Fokus',
    interactionDescription: `Dalam konteks ${context}, ${p1.displayName} dan ${p2.displayName} menghadapi situasi yang sama dengan filter informasi, prioritas motivasi, dan kepekaan psikologis yang berlainan.${userTriggerNote}`,
    underlyingMechanism:
      'Gesekan awal bukan lahir dari niat buruk, melainkan karena dua individu menyaring realitas yang sama melalui kriteria prioritas kognitif, kebutuhan instingtual, dan posisi sikap yang berbeda.',
    personAPerspective: `${p1.displayName} menganggap hal paling masuk akal dan mendesak dimulai dari ${p1LeadDesc}${e1 ? ` sesuai dorongan Tipe ${e1.number} (${e1.coreDesire.toLowerCase()})` : ''}${psy1.valid ? ` dengan keyakinan tinggi di ${psy1.placements[0].code}` : ''}.`,
    personBPerspective: `${p2.displayName} menilai situasi seharusnya mempertimbangkan ${p2LeadDesc}${e2 ? ` sesuai dorongan Tipe ${e2.number} (${e2.coreDesire.toLowerCase()})` : ''}${psy2.valid ? ` dan menjaga standar di ${psy2.placements[0].code}` : ''}.`,
    relevantTypologyDifferences: [
      ...informationElementClashes.slice(0, 2),
      instinctPairNote,
      psyFrictionNote,
    ],
    concreteExample:
      observedTrigger
        ? `Situasi awal (${context}): "${observedTrigger}" — ${p1.displayName} langsung merespons sesuai prioritas ${s1?.modelA[0] || 'utamanya'}, sedangkan ${p2.displayName} merasa aspek penting menurut ${s2?.modelA[0] || 'sudut pandangnya'} terlewat.`
        : `Dalam rapat atau percakapan ${context}, ${p1.displayName} langsung membahas inti masalah dengan gaya ${s1?.modelA[0] || 'lugas'}, sementara ${p2.displayName} ingin memastikan aspek ${s2?.modelA[0] || 'konteks atau nilai'} ikut diperhitungkan sebelum memutuskan.`,
    transitionToNext:
      'Karena kedua pihak tidak menjelaskan niat di balik penekanan masing-masing, nada bicara mulai dibaca sebagai sinyal ketidaksetujuan atau kurangnya kepedulian—menggeser interaksi ke Tahap 2.',
  };

  const p1Intended = s1?.modelA[0] === 'Te' || s1?.modelA[0] === 'Ti'
    ? 'membantu penyelesaian masalah agar jelas dan efektif'
    : s1?.modelA[0] === 'Se' || e1?.number === 8
    ? 'bergerak tegas agar situasi tidak berlarut-larut'
    : 'menjaga kualitas makna, keselarasan nilai, atau kenyamanan bersama';
  const p2ReadAs = s2?.modelA[3] === 'Te' || s2?.modelA[3] === 'Se' || psy2.positionMap?.V === 3 || psy2.positionMap?.L === 3
    ? 'terasa menekan, menyalahkan, atau meremehkan kapasitas dirinya'
    : 'terasa terlalu terburu-buru, kaku, atau kurang peka terhadap konteks batin';

  const p2Intended = s2?.modelA[0] === 'Fi' || s2?.modelA[0] === 'Fe' || e2?.center === 'Heart'
    ? 'memastikan semua pihak merasa nyaman, tulus, dan tidak ada yang dirugikan secara emosional'
    : s2?.modelA[0] === 'Ti' || s2?.modelA[0] === 'Ni'
    ? 'memastikan kerangka konsepnya benar dan tidak ada celah kesalahan di belakang hari'
    : 'menjaga ketenangan ritme kerja dan kejelasan batas tanggung jawab';
  const p1ReadAs = s1?.modelA[0] === 'Te' || s1?.modelA[0] === 'Se' || e1?.hornevian === 'Assertive'
    ? 'terasa memperlambat, kurang kooperatif, berputar-putar, atau menghindari tanggung jawab'
    : 'terasa menjaga jarak dingin atau meragukan niat baiknya';

  const stage2: DynamicConflictStage = {
    stage: 2,
    stageTitle: 'Salah Tafsir & Pemaknaan Berbeda atas Interaksi yang Sama',
    interactionDescription: reportedBehavior
      ? `Berdasarkan perilaku yang diamati ("${reportedBehavior}"), kedua pihak mulai menempelkan makna batin yang berbeda pada ucapan atau sikap yang sama tanpa mengonfirmasi maksud sebenarnya.`
      : `Ucapan, jeda diam, atau pesan singkat yang sama dibaca oleh ${p1.displayName} dan ${p2.displayName} dengan kerangka penafsiran bertolak belakang karena konteks niatnya tidak terucap.`,
    underlyingMechanism:
      'Mind-reading bias & gap informasi antar-kerangka: apa yang diniatkan seseorang sesuai kekuatannya (Blok Ego / Posisi 1–2) justru menyentuh titik kewaspadaan pihak lain (PoLR / Posisi 3 / Ketakutan Inti Enneagram).',
    personAPerspective: `${p1.displayName} bermaksud ${p1Intended}, namun menafsirkan respons ${p2.displayName} ${p1ReadAs}.`,
    personBPerspective: `${p2.displayName} bermaksud ${p2Intended}, namun menafsirkan sikap ${p1.displayName} ${p2ReadAs}.`,
    relevantTypologyDifferences: [
      `Niat vs Dampak Komunikasi: ${s1 ? `${p1.displayName} (${s1.code})` : p1.displayName} menganggap gaya komunikasinya wajar, padahal dapat memicu sensitivitas ${s2 ? `PoLR ${s2.modelA[3]} milik ${p2.displayName}` : p2.displayName}.`,
      e1 && e2
        ? `Filter Motivasi: Tipe ${e1.number} (${e1.objectRelations}) dan Tipe ${e2.number} (${e2.objectRelations}) memiliki asumsi dasar berbeda tentang apakah orang lain dapat diandalkan atau akan menuntut/menolak.`
        : 'Asumsi dasar tentang harapan hubungan belum disamakan secara eksplisit.',
      psy1.valid && psy2.valid
        ? `Asimetri Psikosofi: Posisi kuat (1/2) salah satu pihak terdengar terlalu mendominasi atau berisik di aspek yang bagi pihak lain berada di posisi rentan (3) atau ringan (4).`
        : 'Perbedaan keterusterangan dan ekspresi emosional mudah disalahartikan dalam komunikasi cepat/chat.',
    ],
    concreteExample: `${p1.displayName}: "Bisa langsung kirim bagianmu jam 7 biar cepat kelar?" (bermaksud menjaga target). ${p2.displayName} membaca pesan singkat tanpa konteks sebagai nada memerintah dan menganggap usahanya diragukan, lalu membalas singkat atau menunda jawaban.`,
    transitionToNext:
      'Begitu penafsiran negatif dianggap fakta, kedua pihak tidak lagi fokus pada topik awal—melainkan beralih ke mode perlindungan diri pada Tahap 3.',
  };

  const p1Def = buildIndividualDefense(p1, p2, context);
  const p2Def = buildIndividualDefense(p2, p1, context);

  const stage3: DynamicConflictStage = {
    stage: 3,
    stageTitle: 'Respons Defensif Individual Kedua Pihak',
    interactionDescription: `Untuk melindungi harga diri, otonomi, atau rasa aman batin dari ancaman yang dirasakan di Tahap 2, ${p1.displayName} dan ${p2.displayName} mengaktifkan pola pertahanan diri masing-masing.`,
    underlyingMechanism:
      'Aktivasi mekanisme pertahanan Enneagram inti (yang diberi nuansa oleh fix sekunder Tritype bila ada), tekanan posisi lemah/PoLR Model A, dan sensitivitas posisi ke-3 Psikosofi.',
    personAPerspective: `${p1.displayName}: ${p1Def.immediateReaction} Ia berusaha melindungi: ${p1Def.protectingWhat}`,
    personBPerspective: `${p2.displayName}: ${p2Def.immediateReaction} Ia berusaha melindungi: ${p2Def.protectingWhat}`,
    relevantTypologyDifferences: [
      `${p1.displayName}: ${e1 ? `Pertahanan Tipe ${e1.number} (${e1.defenseMechanism.split(':')[0]})` : 'Pertahanan diri personal'} + ${getSecondaryFixFlavors(p1)}`,
      `${p2.displayName}: ${e2 ? `Pertahanan Tipe ${e2.number} (${e2.defenseMechanism.split(':')[0]})` : 'Pertahanan diri personal'} + ${getSecondaryFixFlavors(p2)}`,
      s1 && s2
        ? `Dinamika Model A saat tertekan: kecenderungan mengandalkan fungsi kuat Blok Ego (${s1.modelA[0]} vs ${s2.modelA[0]}) sambil menutup kerentanan di PoLR (${s1.modelA[3]} vs ${s2.modelA[3]}).`
        : 'Kedua pihak mempertahankan gaya nyaman masing-masing ketika merasa tidak aman.',
    ],
    concreteExample: `${p1.displayName} mulai berbicara lebih kaku/menekan argumen (${e1?.hornevian || 'defensif'}), sementara ${p2.displayName} merespons dengan ${e2?.hornevian === 'Withdrawn' ? 'menarik diri dari percakapan dan hanya membalas seperlunya' : 'mempertahankan posisinya atau mempertanyakan balik sikap lawan bicara'}.`,
    transitionToNext:
      'Respons defensif satu pihak justru membuktikan ketakutan pihak lainnya ("Tuh kan, dia memang begitu!"), sehingga keduanya terkunci dalam siklus eskalasi berulang pada Tahap 4.',
  };

  // Mechanism-specific Stage 4 & Stage 5 + Resolution templates grounded in actual names & profiles!
  const mechanismConfigs: Record<
    ConflictMechanismId,
    {
      title: string;
      stage4Desc: string;
      stage4Mech: string;
      stage4Trigger: string;
      stage4Loop: string;
      stage4AContrib: string;
      stage4BContrib: string;
      stage4Example: string;
      stage4Interrupt: string;
      stage5Title: string;
      primaryOutcome: StageOutcomeOption;
      alternatives: StageOutcomeOption[];
      resSummary: string;
      maintaining: string[];
      interrupting: string[];
      shifts: string[];
    }
  > = {
    'pursuer-withdrawer': {
      title: 'Siklus Pengejar–Penghindar (Pursuer–Withdrawer Loop)',
      stage4Desc: `Satu pihak semakin mengejar kejelasan, jawaban cepat, atau kepastian emosional, sementara pihak lain semakin mundur mencari ruang aman karena merasa terpojok—semakin dikejar semakin menghindar, semakin dihindari semakin mengejar.`,
      stage4Mech:
        'Umpan balik asimetris: kecemasan kehilangan koneksi/kendali (pengejar) berbenturan dengan kecemasan kewalahan/dihakimi (penghindar).',
      stage4Trigger: `Respons lambat atau jawaban singkat yang dibaca sebagai penolakan, diikuti pesan tindak lanjut berulang untuk menuntut kejelasan segera.`,
      stage4Loop: `Tuntutan klarifikasi cepat membuat pihak yang menarik diri makin kewalahan dan menutup akses komunikasi; penarikan diri itu lalu memicu pengejar mengirim pesan lebih mendesak atau tajam.`,
      stage4AContrib: `${p1.displayName} ${e1?.hornevian === 'Withdrawn' ? 'menunda respons atau memberi jawaban pendek agar konflik mereda, tanpa menyatakan kapan siap lanjut bicara' : 'terus menindaklanjuti atau mendesak kejelasan segera karena keheningan terasa menggantung dan menghambat'}.`,
      stage4BContrib: `${p2.displayName} ${e2?.hornevian === 'Withdrawn' ? 'mengurangi keterlibatan dan memilih diam karena merasa diskusi tidak memberi ruang aman' : 'meningkatkan intensitas pertanyaan atau kritik karena mengira diamnya rekan berarti tidak peduli'}.`,
      stage4Example: `Pihak pengejar: "Kenapa dari tadi cuma dibaca? Kita harus beresin ini sekarang juga." Pihak penghindar (dalam hati tertekan): membalas singkat "Nanti aja" lalu mematikan notifikasi—membuat pengejar makin frustrasi.`,
      stage4Interrupt:
        'Menyepakati aturan jeda terstruktur: pihak yang butuh waktu menyatakan durasi jeda dan waktu kembali pasti ("Aku butuh 30 menit menenangkan pikiran, jam 16.30 aku hubungi lagi"), sehingga pengejar tidak merasa ditinggal dan penghindar tidak merasa terpojok.',
      stage5Title: 'Titik Pecah: Kesenjangan Pengejar–Penghindar (Jarak Komunikasi Memadat)',
      primaryOutcome: {
        outcomeLabel: 'Kesenjangan Pengejar–Penghindar (Pursuer–Withdrawer Gap)',
        whyPlausible: `Kombinasi kecenderungan menuntut kejelasan cepat di satu sisi dengan kecenderungan menarik diri melindungi ruang di sisi lain sangat sering berhenti bukan pada pertengkaran terbuka, melainkan jarak beku antara pihak yang kelelahan mengejar dan pihak yang menutup pintu.`,
        personAExperience: `${p1.displayName} merasa berjuang sendirian atau frustrasi karena isu dianggap digantung tanpa penyelesaian tuntas.`,
        personBExperience: `${p2.displayName} merasa kewalahan, ditekan terus-menerus, dan menyimpulkan bahwa berbicara pun tidak akan didengar dengan tenang.`,
        whatRemainsUnresolved: 'Topik awal belum selesai; keduanya hanya berhenti berinteraksi tanpa menyepakati cara aman membicarakannya.',
        longTermConsequence: `Dalam konteks ${context}, kolaborasi berikutnya menjadi canggung dan penuh kewaspadaan setiap kali ada tenggat mendesak.`,
      },
      alternatives: [
        {
          outcomeLabel: 'Ledakan Mendadak Setelah Lama Menarik Diri',
          whyPlausible: 'Jika pihak penghindar terus didesak melampaui batas toleransinya, penarikan diri bisa berbalik menjadi luapan kemarahan singkat untuk menghentikan tekanan.',
          personAExperience: 'Terkejut karena menganggap masalahnya baru saja dibahas.',
          personBExperience: 'Merasa sudah memberi sinyal batas berkali-kali tetapi tidak digubris.',
          whatRemainsUnresolved: 'Kepercayaan untuk berdiskusi tanpa tekanan.',
          longTermConsequence: 'Muncul ketakutan untuk saling menegur di masa depan.',
        },
        {
          outcomeLabel: 'Klarifikasi Terjadwal Sebelum Jarak Membeku',
          whyPlausible: 'Bila salah satu pihak berhenti mendesak sejenak dan menetapkan jadwal bicara yang tenang.',
          personAExperience: 'Merasa kepastian waktu memberi rasa aman bahwa masalah tetap ditangani.',
          personBExperience: 'Merasa memiliki ruang bernapas untuk menyusun pikiran tanpa diserbu.',
          whatRemainsUnresolved: 'Tetap perlu penyesuaian tempo di proyek berikutnya.',
          longTermConsequence: 'Kepercayaan justru menguat karena batas masing-masing terbukti dihormati.',
        },
      ],
      resSummary:
        'Resolusi siklus Pengejar–Penghindar tidak cukup dengan "saling mengerti"; kedua pihak harus mengganti desakan mendadak dan menghilang diam-diam dengan kontrak jeda yang memiliki waktu kembali pasti.',
      maintaining: [
        'Mengirim pesan susulan bertubi-tubi saat rekan sedang butuh jeda.',
        'Menghilang atau menunda jawaban tanpa memberi tahu kapan siap berdiskusi lagi.',
      ],
      interrupting: [
        'Hentikan pesan beruntun; kirim satu kalimat tenang berisi poin utama + usulan waktu bicara.',
        'Jika butuh waktu berpikir, wajib sebutkan jam kembali ("Aku balas tuntas pukul 19.00").',
      ],
      shifts: [
        'Terapkan aturan "Jeda dengan Janji Kembali" (maksimal 2–24 jam tergantung urgensi tugas sekolah).',
        'Saat kembali berdiskusi, bahas kesepakatan prosedur komunikasi 5 menit sebelum masuk ke isi masalah.',
      ],
    },

    'emotional-invalidation': {
      title: 'Siklus Invalidasi Emosi vs Solusi Logis Sepihak',
      stage4Desc: `Satu pihak berusaha didengar perasaan dan pengalaman batinnya, tetapi pihak lain terus menanggapi hanya dengan analisis logis dingin atau daftar kesalahan faktual—membuat pihak pertama merasa tidak diakui dan makin emosional/tertutup, yang lalu dianggap pihak kedua semakin "tidak rasional".`,
      stage4Mech:
        'Ketidaksesuaian urutan komunikasi: satu pihak butuh validasi afektif terlebih dahulu agar bisa berpikir jernih, sementara pihak lain langsung melompat ke pemecahan masalah objektif.',
      stage4Trigger:
        'Keluhan atau kekecewaan emosional dijawab langsung dengan koreksi logis ("Kan salahmu sendiri...", "Harusnya secara logika...").',
      stage4Loop:
        'Semakin perasaan tidak divalidasi, semakin tinggi intensitas atau kekecewaan emosional yang disampaikan; semakin tinggi emosi muncul, semakin pihak logis menutup diri atau memotong pembicaraan dengan fakta dingin.',
      stage4AContrib: `${p1.displayName} ${s1 && ['Te', 'Ti'].includes(s1.modelA[0]) ? 'langsung membedah fakta dan solusi praktis dengan mengira itu membantu, tanpa mengakui beban emosi yang dirasakan lawan bicara' : 'menyampaikan kekecewaan batin dengan harapan dimengerti terlebih dahulu sebelum diberi arahan solusi'}.`,
      stage4BContrib: `${p2.displayName} ${s2 && ['Te', 'Ti'].includes(s2.modelA[0]) ? 'berusaha menenangkan situasi dengan argumen objektif, tetapi terdengar meremehkan rasa kecewa lawan bicara' : 'merasa suara hatinya diabaikan sehingga terus mengulang keluhan atau menarik kepercayaan emosional'}.`,
      stage4Example: `Pihak A: "Aku capek banget ngerasa bagianku nggak dihargai di kelompok." Pihak B: "Lho, secara objektif pembagian halaman makalahmu kan sudah paling sedikit, kenapa harus dipermasalahkan?"`,
      stage4Interrupt:
        'Menerapkan urutan dua langkah sadar: validasi pengalaman & niat lawan bicara dalam 2 kalimat terlebih dahulu ("Aku dengar kamu merasa kelelahan dan kurang didengar..."), baru tawarkan pembahasan solusi logis.',
      stage5Title: 'Titik Pecah: Jarak Emosional & Label "Terlalu Dingin vs Terlalu Sensitif"',
      primaryOutcome: {
        outcomeLabel: 'Putus Kepercayaan Emosional Meski Tugas Tetap Selesai',
        whyPlausible: `Dalam pasangan berorientasi fakta/logika vs perasaan/nilai, masalah teknis mungkin tetap dikerjakan, tetapi kedua pihak menyimpan stereotip bahwa pihak lain "tidak punya empati" atau "terlalu baper".`,
        personAExperience: 'Merasa lelah karena niat baik memperbaiki masalah atau perasaan tulusnya dianggap keliru.',
        personBExperience: 'Merasa sendirian secara emosional dan ragu apakah aman berbicara terbuka lagi di masa depan.',
        whatRemainsUnresolved: 'Rasa dihargai sebagai manusia di luar sekadar hasil kerja atau ketepatan fakta.',
        longTermConsequence: 'Komunikasi berikutnya menyempit hanya pada hal administratif dangkal.',
      },
      alternatives: [
        {
          outcomeLabel: 'Ketegangan Tersimpan & Sindiran Halus',
          whyPlausible: 'Jika pihak yang merasa terinvalidasi memilih berhenti bercerita tetapi masih menyimpan rasa tidak adil.',
          personAExperience: 'Mengira masalah sudah beres karena tidak ada perdebatan lagi.',
          personBExperience: 'Menarik diri secara emosional sambil menahan kekecewaan.',
          whatRemainsUnresolved: 'Kesalahpahaman bahwa solusi cepat tanpa pengakuan perasaan tidak menyembuhkan luka relasi.',
          longTermConsequence: 'Jarak pertemanan atau kolaborasi memudar diam-diam.',
        },
        {
          outcomeLabel: 'Jembatan Dua Jalur (Validasi Dulu, Solusi Kemudian)',
          whyPlausible: 'Jika pihak analitis memberi pengakuan singkat terhadap perasaan lawan bicara sebelum menyusun langkah perbaikan.',
          personAExperience: 'Melihat bahwa empati singkat justru mempercepat penerimaan solusi praktis.',
          personBExperience: 'Merasa didengar sehingga jauh lebih siap membahas langkah objektif.',
          whatRemainsUnresolved: 'Menjaga konsistensi dua jalur ini saat lelah.',
          longTermConsequence: 'Kedua pihak saling melengkapi antara ketajaman nalar dan kepekaan kemanusiaan.',
        },
      ],
      resSummary:
        'Resolusi konflik Invalidasi Emosi membutuhkan pembagian peran percakapan menjadi dua fase yang tidak boleh ditukar urutannya: pengakuan pengalaman batin lebih dulu, baru penyusunan fakta dan solusi.',
      maintaining: [
        'Langsung memberi saran atau koreksi fakta ketika lawan bicara masih berada pada fase meluapkan rasa tidak nyaman.',
        'Mengharapkan lawan bicara menebak kebutuhan emosi tanpa menyebutkannya secara konkret.',
      ],
      interrupting: [
        'Tanyakan secara eksplisit: "Sekarang kamu lebih butuh didengar dulu atau kita langsung cari solusi bareng?"',
        'Gunakan kalimat validasi singkat tanpa langsung menyetujui semua asumsi faktual ("Aku paham situasinya bikin kamu tertekan...").',
      ],
      shifts: [
        'Gunakan teknik "Validasi Sebelum Fakta" untuk pihak analitis/4E.',
        'Gunakan teknik "Sampaikan Kebutuhan Konkret Setelah Perasaan" untuk pihak ekspresif/1E-2E agar lawan bicara tahu tindakan apa yang membantu.',
      ],
    },

    'circular-logical-debate': {
      title: 'Siklus Debat Logis Berulang Tanpa Titik Temu',
      stage4Desc: `Kedua pihak terus mengulang argumen, membantah definisi, atau mengadu bukti teknis dari kerangka pikir masing-masing (misalnya efisiensi Te vs konsistensi Ti, atau visi Ni vs opsi Ne) tanpa menyadari mereka sebenarnya memakai tolok ukur yang berbeda.`,
      stage4Mech:
        'Perdebatan di level isi argumen ketika ketidaksepakatan sebenarnya berada pada kriteria keputusan (apa yang dianggap "berhasil" atau "benar").',
      stage4Trigger:
        'Pernyataan absolut atau koreksi logika yang memicu lawan bicara membalas dengan kontra-argumen untuk membuktikan posisinya tidak salah.',
      stage4Loop:
        'Setiap bantahan logis direspons dengan penjelasan yang lebih panjang atau lebih tajam; alih-alih mendekat ke keputusan, diskusi berubah menjadi ajang pembuktian siapa yang paling masuk akal.',
      stage4AContrib: `${p1.displayName} terus mempertahankan kerangka argumennya (${s1?.modelA[0] || 'logis'}) dan menganggap diskusi belum boleh selesai sebelum poinnya diterima.`,
      stage4BContrib: `${p2.displayName} terus membedah celah argumen pihak pertama dari sudut pandang ${s2?.modelA[0] || 'berbeda'} karena merasa kesimpulan itu belum lengkap.`,
      stage4Example: `Pihak A: "Yang penting metode ini cepat selesai dan sesuai rubrik." Pihak B: "Tapi dasar teorinya belum konsisten, kalau nggak diluruskan dari definisi awal nanti berantakan." (Berulang 30 menit tanpa keputusan).`,
      stage4Interrupt:
        'Menghentikan adu argumen dan naik satu tingkat ke pertanyaan kriteria: "Sebelum lanjut berdebat, tujuan utama kita di tugas ini apa dan batas waktunya kapan?"',
      stage5Title: 'Titik Pecah: Kebuntuan Debat Berulang (Analysis Paralysis / Adu Benar)',
      primaryOutcome: {
        outcomeLabel: 'Debat Berulang Tanpa Keputusan Bersama (Circular Stalemate)',
        whyPlausible: `Ketika dua individu sama-sama menaruh keyakinan tinggi pada nalarnya (mis. Te vs Ti atau 1L/2L), konflik kerap berakhir dengan kelelahan mental karena pembahasan terus berputar di tempat sementara tenggat makin dekat.`,
        personAExperience: 'Frustrasi menganggap lawan bicara keras kepala dan menghambat kemajuan.',
        personBExperience: 'Merasa logikanya tidak dihargai atau dipaksa menerima metode yang dianggap cacat.',
        whatRemainsUnresolved: 'Kriteria prioritas bersama: mana yang harus didahulukan antara kecepatan eksekusi dan kelengkapan konsep.',
        longTermConsequence: 'Kerja kelompok tersendat menjelang tenggat dan masing-masing enggan berdiskusi panjang lagi.',
      },
      alternatives: [
        {
          outcomeLabel: 'Pemisahan Kerja Tanpa Koordinasi Utuh',
          whyPlausible: 'Salah satu atau kedua pihak menyerah berdebat lalu mengerjakan bagiannya sendiri secara terpisah, sehingga hasil akhir kelompok tidak menyatu.',
          personAExperience: 'Lega bisa bekerja cepat sendiri meski kecewa tim tidak solid.',
          personBExperience: 'Merasa lebih aman menjaga standar di bagiannya sendiri.',
          whatRemainsUnresolved: 'Koherensi antarbagian laporan atau kesepakatan tim.',
          longTermConsequence: 'Kualitas integrasi kelompok menurun.',
        },
        {
          outcomeLabel: 'Uji Coba Terbatas Berbasis Kriteria (Timeboxed Trial)',
          whyPlausible: 'Jika kedua pihak sepakat membatasi debat maksimal 10 menit lalu menguji salah satu metode secara terukur.',
          personAExperience: 'Kebutuhan progres nyata terpenuhi.',
          personBExperience: 'Keberatan konseptualnya tetap dicatat sebagai bahan evaluasi.',
          whatRemainsUnresolved: 'Evaluasi pasca-uji coba.',
          longTermConsequence: 'Kolaborasi menjadi jauh lebih produktif dan objektif.',
        },
      ],
      resSummary:
        'Resolusi Debat Berulang mensyaratkan perubahan dari "siapa paling benar" menjadi "kriteria apa yang kita pakai dan berapa lama kita membahas sebelum uji coba".',
      maintaining: [
        'Mengulang premis yang sama dengan kalimat berbeda berharap lawan bicara akhirnya sadar.',
        'Menganggap kompromi teknis sebagai kekalahan intelektual.',
      ],
      interrupting: [
        'Tulis dua pilihan solusi di kertas/chat bersama syarat keberhasilan masing-masing, bukan memperpanjang debat lisan.',
        'Tetapkan batas waktu diskusi 10 menit sebelum memilih opsi awal.',
      ],
      shifts: [
        'Pisahkan fase "menguji keakuratan konsep (Ti/L)" dan fase "memutuskan langkah praktis (Te/F)" secara berurutan.',
        'Hargai kontribusi koreksi logis dengan menyimpannya sebagai catatan risiko yang bisa dievaluasi setelah draf pertama jadi.',
      ],
    },

    'power-control-struggle': {
      title: 'Siklus Tarik-Ulur Kendali, Otonomi & Wewenang',
      stage4Desc: `Konflik bergeser dari isi masalah menjadi pertanyaan "siapa yang berhak menentukan dan siapa yang tidak boleh didikte". Tekanan tegas dari satu pihak dibalas perlawanan keras atau penolakan otonomi dari pihak lain.`,
      stage4Mech:
        'Ancaman terhadap kedaulatan kehendak dan martabat posisi (misalnya benturan 1V vs 3V, Se vs Se/PoLR Se, atau Tipe 8/1 yang merasa batas kendalinya dilanggar).',
      stage4Trigger:
        'Nada instruksi sepihak tanpa penjelasan alasan atau keputusan kelompok yang diambil tanpa persetujuan pihak terdampak.',
      stage4Loop:
        'Pihak koordinator/tegas memperkeras ketetapan aturan agar tim tetap terkendali; pihak lain melihat ketetapan itu sebagai dominasi tidak adil dan membalas dengan penolakan terbuka atau boikot diam-diam.',
      stage4AContrib: `${p1.displayName} menekan lebih keras pada kewajiban, aturan, atau keputusan akhir agar tidak kehilangan kendali situasi.`,
      stage4BContrib: `${p2.displayName} menolak tunduk secara sepihak karena merasa harga diri dan hak suaranya diabaikan.`,
      stage4Example: `Pihak A: "Sebagai penanggung jawab, aku putuskan kita pakai jadwal ini dan semuanya wajib ikut." Pihak B: "Kamu nggak bisa mutusin sepihak gitu dong, kami juga punya jadwal dan pendapat."`,
      stage4Interrupt:
        'Menggeser bahasa perintah sepihak menjadi penetapan tujuan bersama dengan pilihan peran otonom ("Target kita selesai Kamis; kamu mau pegang bagian A atau bagian B?").',
      stage5Title: 'Titik Pecah: Kebuntuan Otoritas & Polarisasi Posisi',
      primaryOutcome: {
        outcomeLabel: 'Konfrontasi Langsung yang Mengunci Kedua Posisi',
        whyPlausible: `Ketika kedua pihak memandang mundur sebagai kekalahan martabat atau hilangnya kendali, konflik memuncak pada adu tegas yang membuat masing-masing mengunci sikapnya dan menolak bekerja sama di bawah arahan pihak lain.`,
        personAExperience: 'Merasa wewenang atau tanggung jawabnya dijegal dan anggotanya tidak kooperatif.',
        personBExperience: 'Merasa otonominya dilanggar dan diperlakukan tidak setara.',
        whatRemainsUnresolved: 'Kesepakatan batas wewenang: apa yang perlu diputuskan bersama vs apa yang menjadi hak koordinator.',
        longTermConsequence: 'Terbentuk kubu di dalam kelompok atau perlu mediasi pihak ketiga (misalnya wali kelas/guru pembimbing).',
      },
      alternatives: [
        {
          outcomeLabel: 'Kepatuhan Permukaan Disertai Penarikan Keterlibatan',
          whyPlausible: 'Bila salah satu pihak memiliki posisi struktural lebih tinggi (mis. koordinator/guru), pihak lain mungkin menurut di luar tetapi kehilangan inisiatif dan hanya bekerja seadanya.',
          personAExperience: 'Mengira instruksi berjalan lancar meski kualitas kontribusi menurun.',
          personBExperience: 'Merasa terpaksa dan menyimpan ketidakpuasan.',
          whatRemainsUnresolved: 'Rasa memiliki bersama terhadap tugas.',
          longTermConsequence: 'Motivasi kerja kelompok merosot drastis.',
        },
        {
          outcomeLabel: 'Negosiasi Ulang Batas & Pembagian Otonomi',
          whyPlausible: 'Jika pihak yang memegang kendali mau mengakui keterbatasan konsultasinya dan membuka ruang pilihan peran yang jelas.',
          personAExperience: 'Tujuan kelompok tetap tercapai tanpa perlawanan pasif.',
          personBExperience: 'Merasa martabat dan hak pilihnya dipulihkan.',
          whatRemainsUnresolved: 'Evaluasi mekanisme pengambilan keputusan ke depan.',
          longTermConsequence: 'Kerja sama pulih dengan pembagian wewenang yang lebih sehat.',
        },
      ],
      resSummary:
        'Resolusi konflik tarik-ulur kendali membutuhkan pemisahan jelas antara "tujuan bersama yang tidak bisa ditawar (mis. tenggat sekolah)" dan "cara serta peran eksekusi yang memberi otonomi setara".',
      maintaining: [
        'Menyampaikan keputusan kelompok sebagai perintah satu arah tanpa ruang bertanya.',
        'Menolak seluruh usulan hanya karena tidak suka dengan cara penyampaiannya.',
      ],
      interrupting: [
        'Akui secara terbuka: "Tadi aku terlalu cepat memutuskan tanpa menanyakan kondisimu terlebih dahulu."',
        'Tawarkan dua opsi pembagian tanggung jawab yang sama-sama adil.',
      ],
      shifts: [
        'Ganti "Kamu harus..." dengan "Tujuan kita X; pendekatan mana yang menurutmu paling realistis untuk porsimu?"',
        'Sepakati aturan pengambilan keputusan kelompok sejak awal proyek (mana yang diputuskan musyawarah, mana yang diputuskan koordinator jika darurat).',
      ],
    },

    'unspoken-resentment': {
      title: 'Siklus Ketegangan Tersimpan & Sindiran Tak Terucap',
      stage4Desc: `Demi menghindari keributan terbuka, kedua pihak menahan keluhan asli mereka dan tetap bersikap sopan di permukaan, namun kekesalan menumpuk dalam bentuk sindiran halus, berkurangnya kehangatan, dan asumsi negatif yang tidak pernah dikonfirmasi.`,
      stage4Mech:
        'Penghindaran konfrontasi langsung yang membuat ketidakpuasan kecil terus terakumulasi tanpa saluran perbaikan.',
      stage4Trigger:
        'Ketidakadilan kecil atau perkataan yang menyinggung tetapi tidak langsung ditegur saat itu juga karena sungkan atau takut merusak suasana.',
      stage4Loop:
        'Keluhan yang tidak dibicarakan menurunkan kualitas keterbukaan; penurunan kehangatan itu dibaca lawan bicara sebagai sikap pasif-agresif, sehingga keduanya makin berhati-hati dan menjauh tanpa pernah menyebut inti masalahnya.',
      stage4AContrib: `${p1.displayName} memilih diam atau menjawab "tidak apa-apa" padahal masih terganggu oleh kejadian sebelumnya.`,
      stage4BContrib: `${p2.displayName} merasakan perubahan nada namun enggan bertanya langsung karena takut memperkeruh suasana.`,
      stage4Example: `Pihak A berkata datar: "Ya terserah kamu aja, aku ikut kok" dengan wajah tegang. Pihak B bingung dan ikut menjaga jarak tanpa berani mengklarifikasi.`,
      stage4Interrupt:
        'Mengungkapkan ketidaknyamanan kecil dengan bahasa observasi lembut sebelum menumpuk ("Kemarin waktu pembagian tugas aku sempat kurang nyaman di bagian X, boleh kita obrolin sebentar?").',
      stage5Title: 'Titik Pecah: Jarak Dingin & Ketegangan Tersimpan (Unspoken Resentment)',
      primaryOutcome: {
        outcomeLabel: 'Ketegangan Tersimpan dengan Interaksi Minimal Formal',
        whyPlausible: `Pada tipe yang menghindari konflik terbuka, pertengkaran jarang meledak hebat—tetapi hubungan berubah menjadi sangat formal, penuh kehati-hatian berlebih, dan masing-masing mencari kelompok lain pada kesempatan berikutnya.`,
        personAExperience: 'Merasa sudah bersabar banyak namun kecewa karena lawan bicara tidak peka.',
        personBExperience: 'Merasa ada ketegangan yang tidak jelas sumbernya dan serba salah saat berinteraksi.',
        whatRemainsUnresolved: 'Keluhan asli yang tidak pernah diucapkan secara lugas dan spesifik.',
        longTermConsequence: 'Kepercayaan relasional terkikis pelan tanpa pernah ada kesempatan perbaikan.',
      },
      alternatives: [
        {
          outcomeLabel: 'Klarifikasi Personal Empat Mata yang Melegakan',
          whyPlausible: 'Jika salah satu pihak berani membuka percakapan empat mata secara tenang (bukan di grup chat ramai).',
          personAExperience: 'Lega beban batinnya bisa diutarakan tanpa mempermalukan siapa pun.',
          personBExperience: 'Akhirnya memahami penyebab jarak dan mendapat kesempatan meluruskan niat.',
          whatRemainsUnresolved: 'Membiasakan penyampaian keberatan lebih awal di masa depan.',
          longTermConsequence: 'Kedekatan atau kerja sama kembali pulih dengan batas lebih jujur.',
        },
      ],
      resSummary:
        'Resolusi ketegangan tersimpan menuntut keberanian mengganti "diam demi damai semu" menjadi "keterbukaan lembut satu-lawan-satu" sebelum kekesalan membusuk.',
      maintaining: [
        'Mengatakan "nggak apa-apa" saat sebenarnya ada hal penting yang mengganjal.',
        'Menceritakan kekesalan kepada teman lain alih-alih mengklarifikasi langsung kepada pihak bersangkutan.',
      ],
      interrupting: [
        'Ajak bicara berdua di waktu tenang selama 10 menit, hindari membahas di grup chat kelas.',
        'Gunakan rumus: Fakta Teramati + Dampak ke Diri + Permintaan Jelas.',
      ],
      shifts: [
        'Normalisasi memberi masukan kecil lebih awal agar tidak menumpuk menjadi gunung kekesalan.',
        'Sambut keberatan teman dengan rasa terima kasih atas kejujurannya, bukan dengan defensif.',
      ],
    },

    'over-accommodation': {
      title: 'Siklus Akomodasi Berlebihan & Kelelahan Mendadak',
      stage4Desc: `Satu pihak terus menyetujui permintaan demi menjaga kerja sama atau meringankan beban orang lain, sementara pihak lain terbiasa mengandalkan kesediaan itu sampai pihak pertama kehabisan energi dan tiba-tiba menarik diri atau merasa dimanfaatkan.`,
      stage4Mech:
        'Ketidakseimbangan batas tanggung jawab: pihak akomodatif sulit berkata "tidak" sejak awal, sedangkan pihak lugas mengira "iya" berarti benar-benar sanggup tanpa beban.',
      stage4Trigger:
        'Penambahan tugas mendadak atau ekspektasi sepihak yang diterima dengan senyum/iyakan padahal kapasitas sudah penuh.',
      stage4Loop:
        'Semakin sering pihak pertama menutupi kekurangan, semakin pihak kedua menganggap porsi itu wajar; beban tersembunyi menumpuk sampai muncul keluhan tajam atau putus tenaga.',
      stage4AContrib: `${p1.displayName} terlalu cepat menyanggupi atau menuntut standar tinggi tanpa memeriksa kapasitas nyata lawan bicara.`,
      stage4BContrib: `${p2.displayName} menunda menyatakan batas kemampuan yang sebenarnya hingga pekerjaan menumpuk.`,
      stage4Example: `Pihak A: "Bisa sekalian rapihin slide sebelum besok pagi ya?" Pihak B (sudah kelelahan): "Iya coba aku kerjain..." lalu esoknya kecewa merasa pekerjaannya paling berat.`,
      stage4Interrupt:
        'Melatih penolakan sopan dengan alternatif realistis sejak awal ("Bagian A bisa kuselesaikan malam ini, tapi bagian B baru bisa besok siang atau perlu dibantu teman lain").',
      stage5Title: 'Titik Pecah: Kelelahan & Rasa Tidak Adil Setelah Terlalu Mengalah',
      primaryOutcome: {
        outcomeLabel: 'Kepatuhan Permukaan Diikuti Kelelahan & Rasa Tidak Adil',
        whyPlausible: `Pihak yang terlalu banyak mengakomodasi akhirnya mengalami kelelahan emosional/fisik dan mulai menyalahkan pihak lain karena dianggap egois, sementara pihak lain bingung karena sebelumnya tidak pernah ada penolakan.`,
        personAExperience: 'Merasa sudah menyepakati kerja sesuai kesediaan awal dan kaget oleh perubahan sikap tiba-tiba.',
        personBExperience: 'Merasa pengorbanannya selama ini dianggap remeh dan tidak seimbang.',
        whatRemainsUnresolved: 'Transparansi kapasitas kerja dan hak berkata tidak tanpa rasa bersalah.',
        longTermConsequence: 'Enggan kembali berada dalam satu tim atau muncul ketimpangan komitmen.',
      },
      alternatives: [
        {
          outcomeLabel: 'Rebalancing Porsi Tugas Secara Transparan',
          whyPlausible: 'Jika beban yang sebenarnya diungkapkan sebelum tenggat lewat.',
          personAExperience: 'Memahami kapasitas nyata rekan dan dapat membantu menata ulang beban.',
          personBExperience: 'Merasa usahanya diakui dan bebannya kembali masuk akal.',
          whatRemainsUnresolved: 'Kebiasaan mengecek kapasitas sejak hari pertama.',
          longTermConsequence: 'Terbentuk kontrak kerja kelompok yang jauh lebih sehat.',
        },
      ],
      resSummary:
        'Resolusi siklus ini menuntut kejujuran kapasitas sejak awal: pihak yang cepat mengalah perlu menyatakan batas nyata, dan pihak yang dominan perlu menanyakan beban rekan sebelum menambah tugas.',
      maintaining: [
        'Mengiyakan permintaan tambahan padahal tugas lain belum selesai.',
        'Menganggap diamnya rekan sebagai tanda "tidak keberatan".',
      ],
      interrupting: [
        'Lakukan cek beban berkala di tengah proyek ("Apakah porsimu masih aman atau ada yang perlu kita bagi ulang?").',
        'Latih kalimat negosiasi kapasitas tanpa merasa menjadi teman yang buruk.',
      ],
      shifts: [
        'Setiap pembagian tugas wajib mencantumkan estimasi waktu pengerjaan agar beban terlihat objektif.',
        'Sepakati bahwa berkata "belum sanggup" lebih dihargai daripada mengiyakan lalu kewalahan.',
      ],
    },

    'mutual-defensiveness': {
      title: 'Siklus Defensif Timbal Balik & Saling Menyalahkan',
      stage4Desc: `Kedua pihak sama-sama merasa diserang atau diperlakukan tidak adil, sehingga setiap ucapan balasan diarahkan untuk membela diri dan menunjuk kesalahan pihak lawan—membuat konflik melebar keluar dari topik awal.`,
      stage4Mech:
        'Aktivasi pertahanan simetris: serangan persepsi dibalas serangan balik atau pembenaran diri yang mengabaikan porsi kontribusi masing-masing.',
      stage4Trigger:
        'Kalimat generalisasi ("Kamu selalu...", "Dari awal kamu memang nggak mau...") yang menyentuh kepekaan kedua pihak bersamaan.',
      stage4Loop:
        'Nada keras atau tuduhan memicu pembenaran balik beserta ungkitan kesalahan lama; ruang mendengarkan tertutup total karena kedua pihak sibuk menyiapkan pembelaan.',
      stage4AContrib: `${p1.displayName} menuntut pengakuan kesalahan pihak lain lebih dulu sebelum mau mengevaluasi cara penyampaiannya sendiri.`,
      stage4BContrib: `${p2.displayName} membalas dengan menunjuk inkonsistensi atau sikap ${p1.displayName} sehingga tidak ada pihak yang mau melunak.`,
      stage4Example: `Pihak A: "Kamu selalu telat ngirim bahan, bikin kacau semuanya!" Pihak B: "Kamu juga nggak pernah jelasin formatnya dengan benar dari awal, nyalahin terus!"`,
      stage4Interrupt:
        'Salah satu pihak secara sadar menurunkan nada dan menyebut porsi kekurangannya sendiri lebih dulu ("Aku sadar caraku menegur tadi terlalu tajam; aku ingin dengar bagian mana yang paling bikin kamu terhambat").',
      stage5Title: 'Titik Pecah: Polarisasi Saling Menyalahkan atau Pembubaran Kerja Sama',
      primaryOutcome: {
        outcomeLabel: 'Eskalasi Saling Menyalahkan & Ketegangan Terbuka',
        whyPlausible: `Jika kedua pihak sama-sama reaktif atau sama-sama melindungi titik sensitifnya tanpa ada yang memberi jeda, konflik membeku dalam posisi saling menganggap pihak lawan sepenuhnya bersalah.`,
        personAExperience: 'Merasa sudah berusaha benar namun dihadapkan pada pihak yang tidak mau mengakui kesalahan.',
        personBExperience: 'Merasa diserang habis-habisan dan dipaksa memikul semua kesalahan sendirian.',
        whatRemainsUnresolved: 'Pemisahan antara fakta peristiwa yang bisa diperbaiki dan penilaian karakter pribadi.',
        longTermConsequence: 'Hubungan retak cukup lama hingga ada jeda pendinginan dan pengakuan porsi tanggung jawab masing-masing.',
      },
      alternatives: [
        {
          outcomeLabel: 'Penetapan Batas Tegas & Pendinginan Terencana',
          whyPlausible: 'Jika salah satu pihak menolak melanjutkan adu argumen saat emosi memuncak dan meminta waktu pendinginan sebelum bicara ulang.',
          personAExperience: 'Emosi berangsur turun sehingga masalah teknis dapat dilihat lebih jernih.',
          personBExperience: 'Terhindar dari ucapan menyakitkan yang disesali kemudian hari.',
          whatRemainsUnresolved: 'Masih perlu percakapan perbaikan setelah suasana tenang.',
          longTermConsequence: 'Menyelamatkan hubungan dari kerusakan permanen.',
        },
      ],
      resSummary:
        'Resolusi Defensif Timbal Balik membutuhkan de-eskalasi berurutan: hentikan "siapa salah duluan", akui 1 bagian tanggung jawab diri secara spesifik, lalu bahas langkah ke depan berbasis fakta.',
      maintaining: [
        'Memakai kata "selalu" atau "tidak pernah" serta mengungkit kesalahan di luar masalah sekarang.',
        'Menunggu pihak lain meminta maaf lebih dulu sebelum mau mendengarkan.',
      ],
      interrupting: [
        'Ambil jeda 15–30 menit bila nada suara mulai meninggi atau chat mulai memanas.',
        'Mulai perbaikan dengan mengakui 1 hal konkret dari sisi sendiri tanpa kata "tapi".',
      ],
      shifts: [
        'Ganti kalimat tuduhan ("Kamu bikin kacau") menjadi kalimat dampak spesifik ("Saat bahan masuk lewat tenggat, aku bingung menyusun bagian akhir").',
        'Fokus pada 1 masalah saat ini dan 1 langkah perbaikan untuk besok.',
      ],
    },
  };

  const cfg = mechanismConfigs[mechanismId];

  const stage4: DynamicConflictStage = {
    stage: 4,
    stageTitle: `Eskalasi Interaktif: ${cfg.title}`,
    interactionDescription: cfg.stage4Desc,
    underlyingMechanism: cfg.stage4Mech,
    personAPerspective: cfg.stage4AContrib,
    personBPerspective: cfg.stage4BContrib,
    relevantTypologyDifferences: [
      `Mekanisme aktif teridentifikasi: ${cfg.title}`,
      e1 && e2
        ? `Interaksi Harmonik & Hornevian: ${p1.displayName} (${e1.harmonic} / ${e1.hornevian}) bertemu ${p2.displayName} (${e2.harmonic} / ${e2.hornevian}).`
        : 'Perbedaan pola regulasi stres antarindividu mendorong siklus berulang.',
      psychosophyComparison.available && psychosophyComparison.activeConflictPrinciples.length > 0
        ? `Pemicu Psikosofi: ${psychosophyComparison.activeConflictPrinciples[0].defensiveTrigger}`
        : 'Pemicu situasional dan keterbatasan waktu mempercepat pengulangan siklus.',
    ],
    concreteExample: cfg.stage4Example,
    transitionToNext: `Jika tidak diputus melalui interupsi sadar (${cfg.stage4Interrupt}), siklus pada Tahap 4 akan berujung pada titik pecah atau pola stabil tidak sehat di Tahap 5.`,
  };

  const stage5: DynamicConflictStage = {
    stage: 5,
    stageTitle: cfg.stage5Title,
    interactionDescription: `${cfg.primaryOutcome.whyPlausible} Catatan penting: hasil ini BUKAN satu-satunya akhir yang pasti terjadi; respons pilihan kedua individu tetap dapat mengarahkan situasi ke hasil alternatif lain.`,
    underlyingMechanism:
      'Konvergensi dari kesalahpahaman awal (Tahap 1–2), pertahanan diri individual (Tahap 3), dan pengulangan siklus interaktif (Tahap 4).',
    personAPerspective: cfg.primaryOutcome.personAExperience,
    personBPerspective: cfg.primaryOutcome.personBExperience,
    relevantTypologyDifferences: [
      `Hasil utama dipengaruhi pola ketahanan stres ${s1 ? `${s1.code}` : p1.displayName} vs ${s2 ? `${s2.code}` : p2.displayName} dalam konteks ${context}.`,
      `Yang masih belum terselesaikan: ${cfg.primaryOutcome.whatRemainsUnresolved}`,
      `Dampak jangka panjang bila dibiarkan: ${cfg.primaryOutcome.longTermConsequence}`,
    ],
    concreteExample: `Setelah siklus Tahap 4 berulang beberapa hari dalam konteks ${context}, interaksi berhenti pada pola "${cfg.primaryOutcome.outcomeLabel}".`,
    transitionToNext:
      'Titik ini dapat diputar balik kapan saja ketika minimal satu pihak memulai langkah resolusi berbasis mekanisme yang sesuai di bawah ini.',
    alternativeOutcomes: cfg.alternatives,
  };

  const conflictStages = [stage1, stage2, stage3, stage4, stage5];

  const detailedResolution: MechanismMatchedResolution = {
    mechanismId,
    mechanismName: cfg.title,
    mechanismSummary: cfg.resSummary,
    addressesOriginalMisunderstanding: `Meluruskan kesalahpahaman Tahap 1–2 bahwa perbedaan cara kerja (${s1?.modelA[0] || p1.displayName} vs ${s2?.modelA[0] || p2.displayName}) bukanlah penolakan pribadi ataupun ketidakseriusan.`,
    aInterpretationVsBInterpretation: `${p1.displayName} perlu memahami bahwa sikap ${p2.displayName} berangkat dari ${p2Intended}; sebaliknya ${p2.displayName} perlu memahami bahwa sikap ${p1.displayName} berangkat dari ${p1Intended}.`,
    personANeeds: `${p1Def.underlyingNeed}`,
    personBNeeds: `${p2Def.underlyingNeed}`,
    maintainingBehaviors: cfg.maintaining,
    cycleInterruptingActions: cfg.interrupting,
    concreteBehaviorShifts: cfg.shifts,
  };

  // Personalized Indonesian Dialogues tailored to A, B, and active mechanism
  const personalizedDialogues: PersonalizedDialogueSet = {
    personA: {
      name: p1.displayName,
      explainPerspective: `Menjelaskan maksud positif di balik gaya ${s1?.modelA[0] || 'utamanya'} (${p1Intended}) tanpa menyalahkan niat ${p2.displayName}.`,
      avoidSaying:
        mechanismId === 'pursuer-withdrawer'
          ? `Kamu selalu menghilang dan nggak peduli kalau ada masalah!`
          : mechanismId === 'power-control-struggle'
          ? `Pokoknya ikut aturan ini saja, nggak usah banyak alasan!`
          : `Harusnya dari awal kamu langsung ngerti maksudku, ribet banget sih.`,
      constructiveAlternative:
        mechanismId === 'emotional-invalidation'
          ? `Maaf tadi aku langsung bahas teknis sebelum benar-benar mendengarkan perasaanmu. Boleh cerita dulu bagian mana yang paling bikin kamu terbebani?`
          : mechanismId === 'pursuer-withdrawer'
          ? `Aku agak cemas kalau masalah ini menggantung, tapi aku juga nggak mau mendesakmu saat lagi capek. Jam berapa kamu nyaman kita bahas santai 10 menit?`
          : `Dari sisiku aku sempat fokus banget ke ${s1 ? INFORMATION_ELEMENTS[s1.modelA[0]].indonesianName.split('(')[0].toLowerCase() : 'target utama'}, dan aku baru sadar penjelasanku belum tentu nyaman buatmu.`,
      clarificationQuestion: `Bagian mana dari cara penyampaianku tadi yang paling terasa kurang pas atau bikin kamu ragu?`,
    },
    personB: {
      name: p2.displayName,
      explainPerspective: `Menjelaskan kebutuhan dan pertimbangannya (${p2Intended}) secara terbuka tanpa menutup diri atau menyerang balik.`,
      avoidSaying:
        mechanismId === 'unspoken-resentment' || mechanismId === 'over-accommodation'
          ? `Ya sudah terserah kamu saja, capek ngomong sama kamu.`
          : mechanismId === 'circular-logical-debate'
          ? `Logikamu itu cacat dari awal, nggak masuk akal!`
          : `Kamu memang selalu seenaknya sendiri dan nggak mau dengar orang lain.`,
      constructiveAlternative:
        mechanismId === 'pursuer-withdrawer'
          ? `Aku nggak bermaksud menghindar atau mengabaikanmu. Kepalaku sempat penuh tadi; kasih aku waktu sampai jam 19.00 untuk merangkum pikiranku lalu kita bahas tuntas ya.`
          : mechanismId === 'power-control-struggle'
          ? `Aku mendukung tujuan kita selesai tepat waktu, tapi aku butuh kita menyepakati pembagian porsinya bareng supaya aku bisa mengerjakannya dengan optimal.`
          : `Sebenarnya aku ingin kerja sama ini tetap berjalan baik, cuma tadi aku merasa ${s2 ? `perlu kejelasan di aspek ${s2.modelA[0]}` : 'belum sempat menyampaikan kendalaku'}.`,
      clarificationQuestion: `Supaya kita sama-sama enak, hasil spesifik apa yang paling kamu butuhkan dariku untuk langkah berikutnya?`,
    },
    mutualRepair: {
      repairStatement: `Kita berdua sama-sama ingin situasi di konteks ${context} ini berjalan baik, hanya saja cara kita memproses dan menyampaikannya kemarin sempat bertabrakan.`,
      constructiveMiniDialogue: [
        {
          speaker: p1.displayName,
          line: `Aku hargai kita mau meluruskan ini. Tadi niatku sebenarnya cuma ${p1Intended}, tapi aku sadar nadaku bisa terasa menekan.`,
        },
        {
          speaker: p2.displayName,
          line: `Terima kasih sudah bilang begitu. Aku juga sebenarnya ${p2Intended}, bukan bermaksud menghambat. Ke depan kalau butuh sesuatu yang mendesak, beri tahu ekspektasinya di awal ya.`,
        },
        {
          speaker: p1.displayName,
          line: `Setuju. ${communicationGoal ? `Biar target "${communicationGoal}" tercapai, ` : ''}ayo kita sepakati satu langkah praktis hari ini dan cek progresnya bareng besok.`,
        },
      ],
      practicalAgreement:
        communicationGoal
          ? `Kesepakatan praktis menuju tujuan "${communicationGoal}": sepakat pada satu kriteria hasil, satu jadwal cek progres, dan aturan berhenti sejenak jika nada diskusi mulai tegang.`
          : `Kesepakatan praktis (${context}): nyatakan ekspektasi secara tertulis/singkat, hargai perbedaan tempo memproses informasi, dan gunakan percakapan empat mata bila ada keberatan.`,
    },
  };

  // Clarifying questions when user didn't supply behavioral observations
  const clarifyingQuestions = hasBehavioralDetails
    ? []
    : [
        'Apa kejadian atau kalimat spesifik terakhir yang memicu ketegangan di antara mereka?',
        'Bagaimana reaksi langsung masing-masing pihak (apakah berbicara lebih keras, membantah logika, diam menghindar, atau mengiyakan sambil terlihat tegang)?',
        'Apakah masalah ini terjadi di chat teks singkat atau tatap muka, dan apakah sedang berdekatan dengan tenggat tugas/kelelahan?',
      ];

  const evidenceClassification = {
    reportedFacts: hasBehavioralDetails
      ? [
          ...(observedTrigger ? [`Pemicu yang dilaporkan pengguna: "${observedTrigger}"`] : []),
          ...(reportedBehavior ? [`Perilaku/kejadian yang dilaporkan pengguna: "${reportedBehavior}"`] : []),
          ...(communicationGoal ? [`Tujuan komunikasi yang diharapkan: "${communicationGoal}"`] : []),
        ]
      : [
          'Belum ada fakta perilaku atau kronologi spesifik yang diinputkan pengguna. Seluruh alur konflik di bawah ini merupakan pemodelan teoretis berbasis profil tipologi dan konteks.',
        ],
    typologyInterpretations: [
      `Hipotesis berbasis Socionics (${s1?.code || '-'} vs ${s2?.code || '-'}), Enneagram (${e1 ? `Tipe ${e1.number}` : '-'} vs ${e2 ? `Tipe ${e2.number}` : '-'}), dan Psikosofi (${psy1.valid ? psy1.code : '-'} vs ${psy2.valid ? psy2.code : '-'}).`,
      `Klasifikasi mekanisme paling mungkin: ${cfg.title}. Ini BUKAN vonis perilaku atau label permanen.`,
    ],
    hypotheticalScenarios: [
      'Tahap 1 hingga Tahap 5 adalah skenario hipotetis mengenai bagaimana perbedaan dapat berkembang bila tidak diklarifikasi—bukan ramalan pasti yang harus terjadi.',
      'Hasil Tahap 5 mencakup beberapa alternatif berbeda karena keputusan bebas kedua individu dapat mengubah jalannya interaksi.',
    ],
    nonTypologyExplanations: [
      'Kelelahan fisik, kurang tidur, tekanan jadwal ujian/tugas lintas mata pelajaran, atau stres di luar sekolah.',
      'Hilangnya intonasi suara dan ekspresi wajah saat berkomunikasi lewat pesan teks singkat.',
      'Ketidakjelasan instruksi tugas, rubrik penilaian, atau pembagian tanggung jawab sejak awal proyek.',
    ],
  };

  const badTurnSequence = [
    ...conflictStages.map((st) => ({
      step: st.stage,
      title: st.stageTitle,
      description: st.interactionDescription,
    })),
    {
      step: 6,
      title: `Resolusi: ${cfg.title}`,
      description: cfg.resSummary,
    },
  ];

  const howToCommunicateScripts = [
    {
      situation: `Pendekatan oleh ${p1.displayName} kepada ${p2.displayName}`,
      avoid: personalizedDialogues.personA.avoidSaying,
      trySaying: `${personalizedDialogues.personA.constructiveAlternative} ${personalizedDialogues.personA.clarificationQuestion}`,
    },
    {
      situation: `Pendekatan oleh ${p2.displayName} kepada ${p1.displayName}`,
      avoid: personalizedDialogues.personB.avoidSaying,
      trySaying: `${personalizedDialogues.personB.constructiveAlternative} ${personalizedDialogues.personB.clarificationQuestion}`,
    },
    {
      situation: `Kesepakatan Perbaikan Bersama (${context})`,
      avoid: 'Sudah lupakan saja, nggak usah dibahas lagi daripada ribut.',
      trySaying: personalizedDialogues.mutualRepair.repairStatement,
    },
  ];

  // ==================== INTERPERSONAL DIRECTIONAL MAP (A <-> B) ====================
  const buildFlow = (
    direction: 'A_TO_B' | 'B_TO_A',
    fromP: Profile,
    toP: Profile,
    intended: string,
    readAs: string,
    fromSoc: typeof s1,
    toSoc: typeof s2,
    fromEnn: typeof e1,
    toEnn: typeof e2,
    fromSloan: string,
    toSloan: string,
    fromTemp: string,
    toTemp: string
  ): DirectionalInteractionFlow => {
    const evidence: string[] = [];
    if (fromSoc) evidence.push(`Socionics ${fromP.displayName}: ${fromSoc.code} (Ego ${fromSoc.modelA[0]}/${fromSoc.modelA[1]})`);
    if (toSoc) evidence.push(`Titik Peka ${toP.displayName}: PoLR ${toSoc.modelA[3]}`);
    if (fromP.typology.mbti) evidence.push(`MBTI ${fromP.displayName}: ${fromP.typology.mbti}`);
    if (fromSloan) evidence.push(`SLOAN ${fromP.displayName}: ${fromSloan}`);
    if (fromTemp) evidence.push(`Temperamen ${fromP.displayName}: ${fromTemp}`);
    if (fromEnn) evidence.push(`Enneagram ${fromP.displayName}: Tipe ${fromEnn.number}`);

    return {
      direction,
      fromName: fromP.displayName,
      toName: toP.displayName,
      intendedCommunication: `${fromP.displayName} mengirimkan pesan dengan niat ${intended}${fromTemp ? ` dalam tempo ${fromTemp}` : ''}.`,
      receiverInterpretation: `${toP.displayName}${toEnn ? ` (Tipe ${toEnn.number})` : ''}${toSloan ? ` [${toSloan}]` : ''} dapat menangkap penyampaian tersebut sebagai hal yang ${readAs}.`,
      misunderstandingRisk:
        toSoc && fromSoc && (fromSoc.modelA[0] === toSoc.modelA[3] || fromSoc.modelA[1] === toSoc.modelA[3])
          ? `Tinggi pada elemen ${toSoc.modelA[3]}: keunggulan ${fromP.displayName} tepat menyentuh posisi PoLR ${toP.displayName}.`
          : `Risiko salah tafsir muncul saat ekspektasi tempo (${fromTemp || fromP.typology.mbti || 'pengirim'}) tidak diklarifikasi kepada penerima (${toTemp || toP.typology.mbti || 'penerima'}).`,
      complementarySynergy:
        fromSoc && toSoc && fromSoc.modelA[0] === toSoc.modelA[4]
          ? `Kekuatan ${fromSoc.modelA[0]} ${fromP.displayName} menyuplai kebutuhan Suggestive ${toP.displayName} bila disampaikan lembut.`
          : `Kombinasi sudut pandang ${fromP.typology.mbti || fromSoc?.code || fromTemp || 'pengirim'} memperkaya proses berpikir ${toP.displayName}.`,
      frictionPoint:
        direction === 'A_TO_B' ? cfg.stage4AContrib : cfg.stage4BContrib,
      typologyEvidence: evidence.length > 0 ? evidence : ['Data tipologi parsial — berdasar konteks peran.'],
      adjustmentSuggestion:
        direction === 'A_TO_B'
          ? personalizedDialogues.personA.constructiveAlternative
          : personalizedDialogues.personB.constructiveAlternative,
    };
  };

  const formatCodeLine = (p: Profile) =>
    [p.typology.socionics, p.typology.mbti, p.typology.enneagramWing || (p.typology.enneagramCore ? `Tipe ${p.typology.enneagramCore}` : ''), p.typology.sloanCode || p.typology.sloanExtended, p.typology.temperament]
      .filter(Boolean)
      .join(' · ') || 'Profil Parsial';

  const directionalMap: DirectionalDynamicsMap = {
    personAName: p1.displayName,
    personBName: p2.displayName,
    personACodeSummary: formatCodeLine(p1),
    personBCodeSummary: formatCodeLine(p2),
    aToB: buildFlow(
      'A_TO_B',
      p1,
      p2,
      p1Intended,
      p2ReadAs,
      s1,
      s2,
      e1,
      e2,
      sl1Raw,
      sl2Raw,
      t1Label !== 'Belum diisi' ? t1Label : '',
      t2Label !== 'Belum diisi' ? t2Label : ''
    ),
    bToA: buildFlow(
      'B_TO_A',
      p2,
      p1,
      p2Intended,
      p1ReadAs,
      s2,
      s1,
      e2,
      e1,
      sl2Raw,
      sl1Raw,
      t2Label !== 'Belum diisi' ? t2Label : '',
      t1Label !== 'Belum diisi' ? t1Label : ''
    ),
    sharedGround: strengths.slice(0, 3),
    keyDivergences: [
      ...informationElementClashes.slice(0, 1),
      ...mbtiDifferences.slice(0, 1),
      ...sloanDifferences.slice(0, 1),
      ...temperamentDifferences.slice(0, 1),
    ].filter(Boolean),
    collaborationStrategy: personalizedDialogues.mutualRepair.practicalAgreement,
  };

  return {
    context,
    contextGuidance: CONTEXT_GUIDANCE_MAP[context],
    hasBehavioralDetails,
    clarifyingQuestions,
    profilesCompared,
    socionicsDifferences,
    modelADifferences,
    informationElementClashes,
    jungianDifferences,
    enneagramDifferences,
    coreMotivationDifferences,
    instinctDifferences,
    tritypeDifferences,
    mbtiDifferences,
    sloanDifferences,
    temperamentDifferences,
    psychosophyComparison,
    directionalMap,
    informationProcessingDifferences:
      infoProcDiffs.length > 0
        ? infoProcDiffs
        : ['Gunakan percakapan langsung untuk mengenali preferensi masing-masing dalam mencerna informasi baru.'],
    communicationPreferences:
      commPrefs.length > 0
        ? commPrefs
        : ['Klarifikasikan apakah rekan lebih menyukai penjelasan ringkas langsung atau konteks menyeluruh.'],
    decisionMakingDifferences:
      decisionDiffs.length > 0
        ? decisionDiffs
        : ['Sepakati kriteria keputusan bersama sebelum memilih langkah akhir.'],
    potentialStrengths:
      strengths.length > 0
        ? strengths
        : ['Perbedaan pengalaman dan perspektif berpotensi memperkaya hasil kerja apabila dibahas terbuka.'],
    potentialMisunderstandings:
      misunderstandings.length > 0
        ? misunderstandings
        : ['Perbedaan nada bicara dan kecepatan merespons dapat disalahartikan bila tidak diklarifikasi.'],
    potentialConflictPatterns: [
      `Pola risiko utama yang terdeteksi: ${cfg.title}.`,
      'Menebak motif batin lawan bicara dari nada singkat tanpa memisahkan fakta teramati vs asumsi.',
    ],
    conflictMechanismId: mechanismId,
    conflictMechanismTitle: cfg.title,
    conflictStages,
    stage3DefenseDetails: {
      personA: p1Def,
      personB: p2Def,
    },
    stage4CycleDetails: {
      trigger: cfg.stage4Trigger,
      reinforcementLoop: cfg.stage4Loop,
      personAContribution: cfg.stage4AContrib,
      personBContribution: cfg.stage4BContrib,
      interruptionPoint: cfg.stage4Interrupt,
    },
    stage5OutcomeSummary: {
      primaryOutcome: cfg.primaryOutcome,
      contributingStagesSummary: `Hasil "${cfg.primaryOutcome.outcomeLabel}" terbentuk ketika perbedaan titik fokus Tahap 1, salah tafsir niat Tahap 2, pertahanan diri (${e1 ? `Tipe ${e1.number}` : p1.displayName} & ${e2 ? `Tipe ${e2.number}` : p2.displayName}) pada Tahap 3, dan siklus "${cfg.title}" pada Tahap 4 dibiarkan berjalan tanpa interupsi sadar.`,
    },
    detailedResolution,
    personalizedDialogues,
    evidenceClassification,
    badTurnSequence,
    practicalRecommendations: [
      ...cfg.interrupting,
      ...cfg.shifts,
    ],
    howToCommunicateScripts,
    disclaimer:
      'Catatan Etis DYNAMAP: Seluruh poin perbandingan, tahapan konflik, dan mekanisme resolusi di atas adalah hipotesis analitis teoretis (bukan skor kecocokan, vonis sifat, ataupun penyalahan sepihak). Pemahaman sejati tetap harus diverifikasi melalui komunikasi langsung dan interaksi nyata.',
  };
}

export function buildStructuredCaseAnalysis(input: CaseAnalysisInput): StructuredCaseAnalysis {
  const title = input.title.trim() || 'Situasi Interpersonal';
  const context = input.relationshipContext || 'Lingkungan Sekolah';

  return {
    source: 'structured-workflow',
    disclaimer:
      'Analisis ini disusun menggunakan kerangka pemecahan masalah terstruktur DYNAMAP (mode non-AI / tanpa panggilan model AI eksternal aktif). Gunakan hasil ini sebagai panduan refleksi dan verifikasi fakta bersama pihak terkait.',
    problemIdentification: `Masalah utama pada kasus "${title}" (${context}): ${input.mainProblem.trim() || 'Perbedaan persepsi, ekspektasi, dan gaya komunikasi antara pihak yang terlibat.'}`,
    perspectiveMapping: [
      `Sudut pandang yang teridentifikasi: ${input.perspectives.trim() || 'Masing-masing pihak kemungkinan menafsirkan situasi berdasarkan kebutuhan serta kekhawatiran pribadinya.'}`,
      `Harapan yang belum terselaraskan: ${input.expectations.trim() || 'Ekspektasi peran, nada komunikasi, dan hasil akhir perlu dinyatakan secara eksplisit.'}`,
    ],
    factsVsAssumptions: {
      facts: [
        `Kronologi yang tercatat: ${input.chronology.trim() || 'Peristiwa spesifik perlu dipisahkan dari penilaian niat.'}`,
        `Situasi teramati: ${input.situationDescription.trim() || 'Belum dirinci.'}`,
      ],
      assumptions: [
        'Asumsi yang perlu diuji: menyimpulkan motif batin orang lain ("dia sengaja mengabaikan / menyerang") hanya dari respons luar atau pesan singkat.',
        'Periksa kembali apakah hambatan bersumber dari kurangnya kejelasan instruksi, kelelahan, atau tekanan jadwal.',
      ],
    },
    situationalFactors: [
      `Konteks hubungan: ${context}.`,
      'Faktor lingkungan sekolah seperti kepadatan tenggat tugas, kelelahan kegiatan, dan medium komunikasi (chat teks vs tatap muka).',
    ],
    communicationBarriers: [
      'Tidak adanya klarifikasi langsung sebelum emosi defensif terbentuk.',
      'Perbedaan kebutuhan antara penyelesaian masalah cepat vs validasi perasaan dan ruang proses.',
    ],
    personalityHypotheses: input.optionalPersonalityInfo.trim()
      ? [
          `Berdasarkan informasi tipologi opsional (${input.optionalPersonalityInfo.trim()}), perbedaan cara memproses informasi (misalnya fokus fakta cepat vs kehati-hatian nilai/harmoni) mungkin memengaruhi cara kedua pihak membaca nada bicara. Namun, ini hanya hipotesis sementara, bukan fakta pasti.`,
        ]
      : [
          'Informasi tipologi tidak disertakan atau bersifat opsional. Fokuskan analisis terlebih dahulu pada komunikasi konkret dan kesepakatan situasi.',
        ],
    nonTypologyExplanations: [
      'Beban tugas dari mata pelajaran lain atau masalah di luar sekolah yang memengaruhi energi dan kesabaran.',
      'Ketidakjelasan pembagian tanggung jawab sejak awal atau hilangnya intonasi dalam komunikasi pesan teks.',
    ],
    conflictResolutionStrategies: [
      'Pisahkan pembahasan fakta peristiwa dari penafsiran niat pribadi.',
      'Gunakan pernyataan berbasis pengalaman diri ("Saya merasa..." / "Saya memahami...") alih-alih tuduhan ("Kamu selalu...").',
      `Arahkan pembicaraan menuju hasil yang diharapkan: ${input.desiredOutcome.trim() || 'kesepakatan kerja yang adil dan saling menghormati.'}`,
    ],
    practicalRecommendations: [
      'Pilih waktu tenang (bukan tepat di tengah emosi tinggi) untuk berbicara secara personal.',
      'Ajukan minimal dua pertanyaan klarifikasi terbuka sebelum menyampaikan keberatan.',
      'Tuliskan kesepakatan langkah perbaikan konkret beserta waktu evaluasinya.',
    ],
    suggestedDialogue: [
      {
        situation: 'Membuka percakapan klarifikasi tanpa memicu defensif',
        avoid: 'Kenapa sih kamu selalu bersikap begitu dan nggak mau ngerti?',
        trySaying:
          'Aku ingin meluruskan situasi kemarin supaya kerja sama kita tetap nyaman. Dari sudut pandangku sempat terjadi kesalahpahaman soal bagian X—boleh dengar bagaimana situasinya terlihat dari sisimu?',
      },
      {
        situation: 'Menyepakati langkah perbaikan ke depan',
        avoid: 'Ya sudah terserah, pokoknya besok harus beres.',
        trySaying: `Supaya target "${input.desiredOutcome.trim() || 'penyelesaian bersama'}" bisa tercapai dengan adil, langkah spesifik apa yang realistis kita sepakati mulai hari ini?`,
      },
    ],
    followUpQuestions: [
      'Fakta baru apa yang mungkin terungkap jika pihak lain diajak menjelaskan perspektifnya?',
      'Apakah tujuan utamaku dalam percakapan nanti memenangkan argumen atau menyelesaikan masalah dengan tetap menjaga martabat bersama?',
    ],
    reflectionPrompts: [
      'Bagian mana dari reaksiku kemarin yang dipicu oleh asumsi pribadi?',
      'Kebiasaan komunikasi apa yang ingin kulatih jika situasi serupa muncul lagi di kelas?',
    ],
  };
}
