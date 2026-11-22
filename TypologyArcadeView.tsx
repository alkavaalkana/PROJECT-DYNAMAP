import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Award,
  BarChart3,
  CheckCircle2,
  Compass,
  Flame,
  HelpCircle,
  KeyRound,
  Layers,
  Lock,
  Play,
  RefreshCw,
  RotateCcw,
  Shuffle,
  Target,
  Timer,
  Trophy,
  Volume2,
  VolumeX,
  Zap,
} from 'lucide-react';
import { INFORMATION_ELEMENTS, SOCIONICS_TYPES } from '../data/socionicsData';
import {
  ARCADE_GAME_EDUCATION,
  type ArcadeEducationalGuide,
} from '../data/extendedTheoryData';
import {
  ARCADE_FRAMEWORK_META,
  ARCADE_GAME_CATALOG,
  CIPHER_PUZZLES,
  CURATED_BLITZ_QUESTIONS,
  DETECTIVE_MYSTERIES,
  ESCAPE_ROOM_STAGES,
  MBTI_TYPE_STACKS,
  MISTYPE_CHALLENGES,
  SCENARIO_LENS_ITEMS,
  type BlitzQuestion,
  type CipherPuzzle,
  type DetectiveMystery,
  type MistypeChallenge,
  type ScenarioLensItem,
} from '../data/arcadeAndCaseData';
import {
  buildDynamicBlitzPool,
  buildMatchUpPairs,
  computeDailyStreaks,
  evaluateAchievements,
  getDailyArcadeChallenge,
  getTodayDateKey,
  playArcadeTone,
  type EvaluatedAchievement,
  type MatchPairItem,
} from '../lib/arcadeEngine';
import type { NavModuleId } from './BerandaView';
import type { TheoryLibraryTab } from './AnalisisKepribadianView';
import type {
  Account,
  ArcadeDifficulty,
  ArcadeFramework,
  ArcadeGameId,
  ArcadeMode,
  ArcadeSessionRecord,
  InformationElement,
  LearningPathDefinition,
  SocionicsCode,
  UserExplorationData,
} from '../types/dynamap';
import { ArcadeStatsView } from './ArcadeStatsView';
import { CelestialCornerFiligree } from './CelestialDecorations';

interface TypologyArcadeViewProps {
  account: Account | null;
  exploration: UserExplorationData | null;
  learningPaths?: LearningPathDefinition[];
  onSaveExploration: (next: Partial<UserExplorationData>) => Promise<void>;
  onOpenAuth: () => void;
  onNavigate?: (moduleId: NavModuleId, options?: { theoryTab?: TheoryLibraryTab }) => void;
}

const GUEST_ARCADE_STORAGE_KEY = 'dynamap_guest_arcade_v1';

interface GuestArcadeStore {
  history: ArcadeSessionRecord[];
  dailyCompletions: Record<string, { score: number; completedAt: string }>;
}

const CAMPAIGN_LEVELS: {
  level: number;
  title: string;
  subtitle: string;
  gameId: ArcadeGameId;
  frameworks: ArcadeFramework[];
  difficulty: ArcadeDifficulty;
}[] = [
  {
    level: 1,
    title: 'Level 1 · Fondasi Elemen & Quadra',
    subtitle: 'Cocokkan 8 elemen informasi dan 4 Quadra Socionics.',
    gameId: 'match-up',
    frameworks: ['Socionics'],
    difficulty: 'dasar',
  },
  {
    level: 2,
    title: 'Level 2 · Klasifikasi Pusat & Sikap',
    subtitle: 'Kelompokkan item ke Quadra, Pusat Triad, atau posisi LVEF.',
    gameId: 'quadra-sort',
    frameworks: ['Socionics', 'Enneagram'],
    difficulty: 'dasar',
  },
  {
    level: 3,
    title: 'Level 3 · Rakit Tumpukan Fungsi',
    subtitle: 'Susun Blok Ego Model A & fungsi sadar MBTI.',
    gameId: 'function-builder',
    frameworks: ['Socionics', 'MBTI'],
    difficulty: 'menengah',
  },
  {
    level: 4,
    title: 'Level 4 · Rekonstruksi Sayap, Tritype & LVEF',
    subtitle: 'Pulihkan struktur tipe lintas Enneagram, Psikosofi, dan SLOAN.',
    gameId: 'reconstruction',
    frameworks: ['Campuran'],
    difficulty: 'menengah',
  },
  {
    level: 5,
    title: 'Level 5 · Pemburu Miskonsepsi & Kasus Bukti',
    subtitle: 'Tangkap kekeliruan konversi silang dan interpretasi terlalu pasti.',
    gameId: 'mistype-hunter',
    frameworks: ['Campuran'],
    difficulty: 'lanjutan',
  },
  {
    level: 6,
    title: 'Level 6 · Observatorium Bintang (Final)',
    subtitle: 'Taklukkan 5 ruangan berantai Typology Escape Room.',
    gameId: 'escape-room',
    frameworks: ['Campuran'],
    difficulty: 'lanjutan',
  },
];

const ALL_INFO_ELEMENTS: InformationElement[] = ['Ne', 'Ni', 'Se', 'Si', 'Te', 'Ti', 'Fe', 'Fi'];

interface SortItem {
  id: string;
  label: string;
  targetCategory: string;
  explanation: string;
}

interface ReconstructChallenge {
  id: string;
  framework: ArcadeFramework;
  prompt: string;
  targetDescription: string;
  pieces: string[];
  correctOrder: string[];
  explanation: string;
}

const RECONSTRUCT_CHALLENGES: ReconstructChallenge[] = [
  {
    id: 'rec-1',
    framework: 'Psychosophy',
    prompt: 'Susun urutan 4 aspek Psikosofi (Posisi 1 → 2 → 3 → 4):',
    targetDescription: '1 Logika yakin, 2 Emosi dialogis, 3 Kehendak sensitif kritik, 4 Fisika santai (LEVF — "Pascal").',
    pieces: ['F', 'V', 'L', 'E'],
    correctOrder: ['L', 'E', 'V', 'F'],
    explanation: 'LEVF menempatkan Logika (1), Emosi (2), Kehendak/Volition (3), dan Fisika (4).',
  },
  {
    id: 'rec-2',
    framework: 'Psychosophy',
    prompt: 'Susun urutan 4 aspek Psikosofi (Posisi 1 → 2 → 3 → 4):',
    targetDescription: '1 Volition mantap, 2 Logika luwes berdiskusi, 3 Fisika sensitif kenyamanan, 4 Emosi tenang (VLFE — "Lenin").',
    pieces: ['E', 'L', 'F', 'V'],
    correctOrder: ['V', 'L', 'F', 'E'],
    explanation: 'VLFE menempatkan 1V (Confident Volition), 2L (Flexible Logic), 3F (Insecure Physics), dan 4E (Unbothered Emotion).',
  },
  {
    id: 'rec-3',
    framework: 'InstinctualStacking',
    prompt: 'Susun urutan Stacking Insting (Dominan → Sekunder):',
    targetDescription: 'Fokus utama: koneksi komunitas & peran kelompok; Sekunder: pemeliharaan kesehatan & jadwal pribadi; Blind spot: intensitas 1-on-1.',
    pieces: ['SX', 'SP', 'SO'],
    correctOrder: ['SO', 'SP', 'SX'],
    explanation: 'Urutannya adalah SO/SP (dengan SX di posisi ketiga / blind spot).',
  },
  {
    id: 'rec-4',
    framework: 'Tritype',
    prompt: 'Susun Tritype Core-First (Inti → Fix Kedua → Fix Ketiga):',
    targetDescription: 'Inti Head: Tipe 5 (Analitis), Fix Heart sekunder: Tipe 4 (Autentik), Fix Gut terakhir: Tipe 1 (Prinsipil).',
    pieces: ['1', '5', '4'],
    correctOrder: ['5', '4', '1'],
    explanation: 'Konvensi core-first menempatkan tipe inti 5 di awal menjadi 541.',
  },
  {
    id: 'rec-5',
    framework: 'SLOAN',
    prompt: 'Susun kode 5-huruf SLOAN secara berurutan (S/R · L/C · O/U · A/E · I/N):',
    targetDescription: 'Reserved (tenang) · Calm (stabil) · Organized (teratur) · Accommodating (kooperatif) · Inquisitive (ingin tahu tinggi).',
    pieces: ['I', 'O', 'R', 'A', 'C'],
    correctOrder: ['R', 'C', 'O', 'A', 'I'],
    explanation: 'Urutan dimensi Global 5 selalu: Social/Reserved → Limbic/Calm → Organized/Unstructured → Accommodating/Egocentric → Inquisitive/Non-curious.',
  },
  {
    id: 'rec-6',
    framework: 'Wings',
    prompt: 'Susun formula Sayap yang tepat untuk Tipe Inti 6 berorientasi hangat & membantu:',
    targetDescription: 'Pilih [Angka Inti] + ["w"] + [Sayap Bersebelahan Heart/Gut terdekat yang peduli sesama].',
    pieces: ['7', 'w', '6'],
    correctOrder: ['6', 'w', '7'],
    explanation: 'Catatan: Di antara tetangga 6 (5 dan 7), 6w7 memberi warna lebih optimis/ekspresif dan hangat secara sosial dibanding 6w5; penulisan sayap selalu Inti-w-Sayap.',
  },
  {
    id: 'rec-7',
    framework: 'Temperament',
    prompt: 'Susun urutan Temperamen Campuran (Primer Dominan → Sekunder):',
    targetDescription: 'Sisi analitis teliti & standar kualitas tinggi memimpin, diimbangi dorongan tegas & orientasi eksekusi hasil.',
    pieces: ['Choleric', 'Melancholic'],
    correctOrder: ['Melancholic', 'Choleric'],
    explanation: 'Melancholic–Choleric (Melankolis–Koleris) mendahulukan refleksi standar presisi lalu menggerakkannya dengan ketegasan.',
  },
  {
    id: 'rec-8',
    framework: 'SLOAN',
    prompt: 'Susun notasi SLOAN lanjutan [S]lo/E/I (Dari paling dominan → trailing):',
    targetDescription: 'Social jangkar utama [S] · Limbic moderat l · Organized moderat o · Egocentric lemah /E · Inquisitive lemah /I.',
    pieces: ['/I', 'l', '[S]', '/E', 'o'],
    correctOrder: ['[S]', 'l', 'o', '/E', '/I'],
    explanation: 'Konvensi notasi lanjutan menempatkan kurung siku [S] sebagai jangkar dominan diikuti huruf kecil moderat dan segmen setelah garis miring.',
  },
];

function buildQuadraSortPool(frameworks: ArcadeFramework[]): {
  categories: string[];
  items: SortItem[];
  title: string;
} {
  if (frameworks.length === 1 && frameworks[0] === 'Temperament') {
    return {
      title: 'Klasifikasi 4 Temperamen Klasik & Kuadran Perilaku',
      categories: ['Sanguine', 'Choleric', 'Melancholic', 'Phlegmatic'],
      items: [
        { id: 'qs-t1', label: 'Antusias, ekspresif, cepat membangun keakraban & dinamis', targetCategory: 'Sanguine', explanation: 'Ciri klasik Sanguine (Ekstrovert-Stabil dalam peta Eysenck).' },
        { id: 'qs-t2', label: 'Berorientasi target tegas, cepat mengambil keputusan & kompetitif', targetCategory: 'Choleric', explanation: 'Choleric menonjol dalam inisiatif cepat dan dorongan hasil.' },
        { id: 'qs-t3', label: 'Teliti terhadap kualitas, mendalam, terencana & reflektif', targetCategory: 'Melancholic', explanation: 'Melancholic berfokus pada kedalaman analitis dan kesesuaian standar.' },
        { id: 'qs-t4', label: 'Kalem, sabar mendengarkan, diplomatis & menjaga kedamaian ritme', targetCategory: 'Phlegmatic', explanation: 'Phlegmatic memiliki stabilitas tenang dan menghindari gesekan tak perlu.' },
      ],
    };
  }

  if (frameworks.length === 1 && frameworks[0] === 'Enneagram') {
    return {
      title: 'Klasifikasi Pusat Kecerdasan Enneagram (Center)',
      categories: ['Gut (Insting: 8, 9, 1)', 'Heart (Perasaan: 2, 3, 4)', 'Head (Pikiran: 5, 6, 7)'],
      items: [
        { id: 'qs-e1', label: 'Tipe 1 — Dorongan Integritas & Koreksi Standar', targetCategory: 'Gut (Insting: 8, 9, 1)', explanation: 'Tipe 1 berada di Gut Center bersama 8 dan 9.' },
        { id: 'qs-e3', label: 'Tipe 3 — Fokus Kompetensi & Citra Capaian', targetCategory: 'Heart (Perasaan: 2, 3, 4)', explanation: 'Tipe 3 berada di Heart Center bersama 2 dan 4.' },
        { id: 'qs-e5', label: 'Tipe 5 — Pengamatan Mandiri & Penguasaan Pengetahuan', targetCategory: 'Head (Pikiran: 5, 6, 7)', explanation: 'Tipe 5 berada di Head Center bersama 6 dan 7.' },
        { id: 'qs-e4', label: 'Tipe 4 — Kedalaman Identitas & Keaslian Emosi', targetCategory: 'Heart (Perasaan: 2, 3, 4)', explanation: 'Tipe 4 adalah tipe Heart yang mencari keunikan batin.' },
        { id: 'qs-e9', label: 'Tipe 9 — Harmoni & Penghindaran Konflik', targetCategory: 'Gut (Insting: 8, 9, 1)', explanation: 'Tipe 9 adalah bagian dari Gut / Body Center.' },
        { id: 'qs-e6', label: 'Tipe 6 — Kewaspadaan Risiko & Pencarian Kepastian', targetCategory: 'Head (Pikiran: 5, 6, 7)', explanation: 'Tipe 6 berada di pusat pikiran (Head Center).' },
      ],
    };
  }

  return {
    title: 'Klasifikasi Quadra Socionics (Alpha · Beta · Gamma · Delta)',
    categories: ['Alpha', 'Beta', 'Gamma', 'Delta'],
    items: [
      { id: 'qs-1', label: 'Tipe ILE & LII (Ne + Ti)', targetCategory: 'Alpha', explanation: 'ILE, SEI, ESE, dan LII berada di Quadra Alpha.' },
      { id: 'qs-2', label: 'Nilai: Se + Ni + Fe + Ti (Ekspresi Ideologis & Momentum)', targetCategory: 'Beta', explanation: 'Quadra Beta menghargai Se, Ni, Fe, dan Ti (EIE, LSI, SLE, IEI).' },
      { id: 'qs-3', label: 'Tipe LIE & ILI (Te + Ni)', targetCategory: 'Gamma', explanation: 'LIE, ESI, SEE, dan ILI tergabung dalam Quadra Gamma.' },
      { id: 'qs-4', label: 'Nilai: Te + Fi + Ne + Si (Kemandirian Praktis & Ketulusan)', targetCategory: 'Delta', explanation: 'Quadra Delta menghargai Te, Fi, Ne, dan Si (LSE, EII, IEE, SLI).' },
      { id: 'qs-5', label: 'Tipe ESE & SEI (Fe + Si)', targetCategory: 'Alpha', explanation: 'ESE dan SEI berbagi nilai Alpha bersama ILE dan LII.' },
      { id: 'qs-6', label: 'Tipe SEE & ESI (Se + Fi)', targetCategory: 'Gamma', explanation: 'SEE dan ESI merupakan pasangan poros Gamma bersama LIE dan ILI.' },
    ],
  };
}

export const TypologyArcadeView: React.FC<TypologyArcadeViewProps> = ({
  account,
  exploration,
  learningPaths = [],
  onSaveExploration,
  onOpenAuth,
  onNavigate,
}) => {
  const [guestStore, setGuestStore] = useState<GuestArcadeStore>(() => {
    try {
      const raw = localStorage.getItem(GUEST_ARCADE_STORAGE_KEY);
      if (raw) return JSON.parse(raw) as GuestArcadeStore;
    } catch {
      // Ignore invalid JSON
    }
    return { history: [], dailyCompletions: {} };
  });

  const history = useMemo(() => {
    if (account && exploration) {
      return exploration.arcadeHistory || [];
    }
    return guestStore.history;
  }, [account, exploration, guestStore.history]);

  const dailyCompletions = useMemo(() => {
    if (account && exploration) {
      return exploration.arcadeDailyCompletions || {};
    }
    return guestStore.dailyCompletions;
  }, [account, exploration, guestStore.dailyCompletions]);

  const streaks = useMemo(() => computeDailyStreaks(dailyCompletions), [dailyCompletions]);
  const achievements = useMemo(
    () => evaluateAchievements(history, dailyCompletions),
    [history, dailyCompletions]
  );

  const [activeTab, setActiveTab] = useState<'arena' | 'daily' | 'campaign' | 'random' | 'stats'>('arena');
  const [selectedFrameworks, setSelectedFrameworks] = useState<ArcadeFramework[]>(['Campuran']);
  const [difficulty, setDifficulty] = useState<ArcadeDifficulty>('menengah');
  const [muted, setMuted] = useState(false);
  const [showEduDrawer, setShowEduDrawer] = useState(false);
  const [toastAchievements, setToastAchievements] = useState<EvaluatedAchievement[]>([]);

  // Active Game Session Shell
  const [activeGame, setActiveGame] = useState<{
    gameId: ArcadeGameId;
    mode: ArcadeMode;
    frameworks: ArcadeFramework[];
    difficulty: ArcadeDifficulty;
    campaignLevel?: number;
    dailyDateKey?: string;
    startedAt: number;
  } | null>(null);

  const [sessionSummary, setSessionSummary] = useState<{
    record: ArcadeSessionRecord;
    newlyUnlocked: EvaluatedAchievement[];
  } | null>(null);

  // ==================== SHARED GAME ROUND STATES ====================
  // 1. Match-Up
  const [matchPairs, setMatchPairs] = useState<MatchPairItem[]>([]);
  const [matchShuffledRight, setMatchShuffledRight] = useState<MatchPairItem[]>([]);
  const [selectedLeftId, setSelectedLeftId] = useState<string | null>(null);
  const [matchedIds, setMatchedIds] = useState<string[]>([]);
  const [matchMistakes, setMatchMistakes] = useState(0);
  const [matchFeedback, setMatchFeedback] = useState('');

  // 2. Function Builder
  const [fbRounds, setFbRounds] = useState<
    { label: string; kind: 'socionics' | 'mbti'; targetCode: string; expected: InformationElement[]; hint: string }[]
  >([]);
  const [fbIndex, setFbIndex] = useState(0);
  const [fbSlots, setFbSlots] = useState<(InformationElement | null)[]>([null, null, null, null]);
  const [fbActiveSlot, setFbActiveSlot] = useState<number>(0);
  const [fbCorrectCount, setFbCorrectCount] = useState(0);
  const [fbChecked, setFbChecked] = useState(false);

  // 3. Detective
  const [detList, setDetList] = useState<DetectiveMystery[]>(DETECTIVE_MYSTERIES);
  const [detIndex, setDetIndex] = useState(0);
  const [detSelectedOptId, setDetSelectedOptId] = useState<string | null>(null);
  const [detCorrectCount, setDetCorrectCount] = useState(0);

  // 4. Quadra Sort
  const [qsPool, setQsPool] = useState<{ title: string; categories: string[]; items: SortItem[] }>({
    title: '',
    categories: [],
    items: [],
  });
  const [qsAnswers, setQsAnswers] = useState<Record<string, string>>({});
  const [qsSubmitted, setQsSubmitted] = useState(false);

  // 5. Type Cipher
  const [cipherList, setCipherList] = useState<CipherPuzzle[]>(CIPHER_PUZZLES);
  const [cipherIndex, setCipherIndex] = useState(0);
  const [cipherCluesShown, setCipherCluesShown] = useState(1);
  const [cipherInput, setCipherInput] = useState('');
  const [cipherSolved, setCipherSolved] = useState(false);
  const [cipherScoreAccum, setCipherScoreAccum] = useState(0);
  const [cipherCorrectCount, setCipherCorrectCount] = useState(0);
  const [cipherFeedback, setCipherFeedback] = useState('');

  // 6. Memory
  const [memoryCards, setMemoryCards] = useState<
    { uid: string; pairId: string; text: string; side: 'L' | 'R' }[]
  >([]);
  const [memoryFlipped, setMemoryFlipped] = useState<string[]>([]);
  const [memoryMatchedPairs, setMemoryMatchedPairs] = useState<string[]>([]);
  const [memoryMoves, setMemoryMoves] = useState(0);

  // 7. Blitz
  const [blitzPool, setBlitzPool] = useState<BlitzQuestion[]>([]);
  const [blitzIdx, setBlitzIdx] = useState(0);
  const [blitzSelectedOpt, setBlitzSelectedOpt] = useState<number | null>(null);
  const [blitzCorrect, setBlitzCorrect] = useState(0);
  const [blitzStreak, setBlitzStreak] = useState(0);
  const [blitzSecondsLeft, setBlitzSecondsLeft] = useState(60);

  // 8. Reconstruction
  const [recList, setRecList] = useState<ReconstructChallenge[]>([]);
  const [recIdx, setRecIdx] = useState(0);
  const [recPicked, setRecPicked] = useState<string[]>([]);
  const [recChecked, setRecChecked] = useState(false);
  const [recCorrect, setRecCorrect] = useState(0);

  // 9. Mistype Hunter
  const [misList, setMisList] = useState<MistypeChallenge[]>(MISTYPE_CHALLENGES);
  const [misIdx, setMisIdx] = useState(0);
  const [misPickedId, setMisPickedId] = useState<string | null>(null);
  const [misCorrect, setMisCorrect] = useState(0);

  // 10. Scenario Lens
  const [slList, setSlList] = useState<ScenarioLensItem[]>(SCENARIO_LENS_ITEMS);
  const [slIdx, setSlIdx] = useState(0);
  const [slPickedId, setSlPickedId] = useState<string | null>(null);
  const [slCorrect, setSlCorrect] = useState(0);

  // 11. Wheel
  const [wheelSpinning, setWheelSpinning] = useState(false);
  const [wheelRotation, setWheelRotation] = useState(0);
  const [wheelLandedFramework, setWheelLandedFramework] = useState<ArcadeFramework | null>(null);
  const [wheelQuestion, setWheelQuestion] = useState<BlitzQuestion | null>(null);
  const [wheelSelectedOpt, setWheelSelectedOpt] = useState<number | null>(null);

  // 12. Escape Room
  const [escStageIdx, setEscStageIdx] = useState(0);
  const [escAnswer, setEscAnswer] = useState('');
  const [escSeqPicked, setEscSeqPicked] = useState<string[]>([]);
  const [escShowHint, setEscShowHint] = useState(false);
  const [escUnlockedMsg, setEscUnlockedMsg] = useState('');
  const [escErrorMsg, setEscErrorMsg] = useState('');
  const [escCorrectStages, setEscCorrectStages] = useState(0);

  const sessionEndGuardRef = useRef(false);

  // Persist record + compute newly unlocked achievements
  async function commitSessionRecord(params: {
    score: number;
    maxScore: number;
    correctCount: number;
    totalQuestions: number;
    completed: boolean;
  }) {
    if (!activeGame || sessionEndGuardRef.current) return;
    sessionEndGuardRef.current = true;

    const durationSeconds = Math.max(3, Math.round((Date.now() - activeGame.startedAt) / 1000));
    const record: ArcadeSessionRecord = {
      id: `arc-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      gameId: activeGame.gameId,
      mode: activeGame.mode,
      frameworks: activeGame.frameworks,
      difficulty: activeGame.difficulty,
      score: Math.max(0, Math.round(params.score)),
      maxScore: Math.max(10, Math.round(params.maxScore)),
      correctCount: params.correctCount,
      totalQuestions: params.totalQuestions,
      durationSeconds,
      completed: params.completed,
      campaignLevel: activeGame.campaignLevel,
      dailyDateKey: activeGame.dailyDateKey,
      playedAt: new Date().toISOString(),
    };

    const prevAchievements = evaluateAchievements(history, dailyCompletions);
    const nextHistory = [record, ...history];
    const nextDaily = { ...dailyCompletions };
    if (activeGame.mode === 'daily' && activeGame.dailyDateKey && params.completed) {
      const existingDaily = nextDaily[activeGame.dailyDateKey];
      nextDaily[activeGame.dailyDateKey] = {
        score: Math.max(existingDaily?.score || 0, record.score),
        completedAt: record.playedAt,
      };
    }

    const nextAchievements = evaluateAchievements(nextHistory, nextDaily);
    const newlyUnlocked = nextAchievements.filter(
      (na) => na.unlocked && !prevAchievements.find((pa) => pa.id === na.id)?.unlocked
    );

    if (newlyUnlocked.length > 0) {
      playArcadeTone('unlock', muted);
      setToastAchievements(newlyUnlocked);
    } else if (params.completed) {
      playArcadeTone('success', muted);
    }

    if (account) {
      await onSaveExploration({
        arcadeHistory: nextHistory.slice(0, 200),
        arcadeDailyCompletions: nextDaily,
      });
    } else {
      const updatedGuest: GuestArcadeStore = {
        history: nextHistory.slice(0, 200),
        dailyCompletions: nextDaily,
      };
      setGuestStore(updatedGuest);
      try {
        localStorage.setItem(GUEST_ARCADE_STORAGE_KEY, JSON.stringify(updatedGuest));
      } catch {
        // Ignore storage quota
      }
    }

    setSessionSummary({ record, newlyUnlocked });
    setActiveGame(null);
  }

  // Blitz timer effect
  useEffect(() => {
    if (!activeGame || activeGame.gameId !== 'blitz' || sessionSummary) return;
    if (blitzSecondsLeft <= 0) {
      void commitSessionRecord({
        score: blitzCorrect * 15,
        maxScore: Math.max(1, blitzPool.length) * 15,
        correctCount: blitzCorrect,
        totalQuestions: Math.max(1, blitzPool.length),
        completed: true,
      });
      return;
    }
    const timer = window.setInterval(() => {
      setBlitzSecondsLeft((s) => s - 1);
    }, 1000);
    return () => window.clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeGame, blitzSecondsLeft, sessionSummary]);

  function toggleFrameworkSelection(fw: ArcadeFramework) {
    if (fw === 'Campuran') {
      setSelectedFrameworks(['Campuran']);
      return;
    }
    setSelectedFrameworks((prev) => {
      const cleaned = prev.filter((x) => x !== 'Campuran');
      if (cleaned.includes(fw)) {
        const next = cleaned.filter((x) => x !== fw);
        return next.length === 0 ? ['Campuran'] : next;
      }
      return [...cleaned, fw];
    });
  }

  function startMiniGame(
    gameId: ArcadeGameId,
    options?: {
      mode?: ArcadeMode;
      frameworks?: ArcadeFramework[];
      difficulty?: ArcadeDifficulty;
      campaignLevel?: number;
      dailyDateKey?: string;
    }
  ) {
    sessionEndGuardRef.current = false;
    setSessionSummary(null);
    const mode = options?.mode || 'free-play';
    const frameworks = options?.frameworks || selectedFrameworks;
    const diff = options?.difficulty || difficulty;

    setActiveGame({
      gameId,
      mode,
      frameworks,
      difficulty: diff,
      campaignLevel: options?.campaignLevel,
      dailyDateKey: options?.dailyDateKey,
      startedAt: Date.now(),
    });

    // Initialize specific mini-game state
    if (gameId === 'match-up') {
      const pairs = buildMatchUpPairs(frameworks);
      setMatchPairs(pairs);
      setMatchShuffledRight([...pairs].sort(() => Math.random() - 0.5));
      setSelectedLeftId(null);
      setMatchedIds([]);
      setMatchMistakes(0);
      setMatchFeedback('');
    } else if (gameId === 'function-builder') {
      const socCodes = (['ILE', 'EIE', 'LIE', 'LII', 'EII', 'SLE'] as SocionicsCode[])
        .sort(() => Math.random() - 0.5)
        .slice(0, 2);
      const mbtiCodes = (['INTJ', 'ENFP', 'ISTP', 'INFJ'])
        .sort(() => Math.random() - 0.5)
        .slice(0, 2);
      const preferMbti = frameworks.includes('MBTI') && !frameworks.includes('Socionics');
      const rounds = preferMbti
        ? mbtiCodes.map((mc) => ({
            label: `MBTI ${mc} (${MBTI_TYPE_STACKS[mc].title})`,
            kind: 'mbti' as const,
            targetCode: mc,
            expected: [...MBTI_TYPE_STACKS[mc].stack],
            hint: `Susun 4 fungsi sadar: Dominan → Auxiliary → Tertiary → Inferior.`,
          }))
        : [
            ...socCodes.map((sc) => ({
              label: `Socionics ${sc} (${SOCIONICS_TYPES[sc].indonesianTitle})`,
              kind: 'socionics' as const,
              targetCode: sc,
              expected: SOCIONICS_TYPES[sc].modelA.slice(0, 4) as InformationElement[],
              hint: `Susun 4 fungsi sadar Model A: Leading (1), Creative (2), Role (3), PoLR (4).`,
            })),
            {
              label: `MBTI ${mbtiCodes[0]} (${MBTI_TYPE_STACKS[mbtiCodes[0]].title})`,
              kind: 'mbti' as const,
              targetCode: mbtiCodes[0],
              expected: [...MBTI_TYPE_STACKS[mbtiCodes[0]].stack],
              hint: `Susun 4 fungsi sadar MBTI: Dominan → Inferior.`,
            },
          ];
      setFbRounds(rounds);
      setFbIndex(0);
      setFbSlots([null, null, null, null]);
      setFbActiveSlot(0);
      setFbCorrectCount(0);
      setFbChecked(false);
    } else if (gameId === 'detective') {
      const isMixed = frameworks.includes('Campuran');
      const filtered = isMixed
        ? DETECTIVE_MYSTERIES
        : DETECTIVE_MYSTERIES.filter((d) => frameworks.includes(d.framework));
      setDetList(filtered.length > 0 ? filtered : DETECTIVE_MYSTERIES);
      setDetIndex(0);
      setDetSelectedOptId(null);
      setDetCorrectCount(0);
    } else if (gameId === 'quadra-sort') {
      setQsPool(buildQuadraSortPool(frameworks));
      setQsAnswers({});
      setQsSubmitted(false);
    } else if (gameId === 'type-cipher') {
      const isMixed = frameworks.includes('Campuran');
      const filtered = isMixed
        ? CIPHER_PUZZLES
        : CIPHER_PUZZLES.filter((c) => frameworks.includes(c.framework));
      setCipherList(filtered.length > 0 ? filtered : CIPHER_PUZZLES);
      setCipherIndex(0);
      setCipherCluesShown(1);
      setCipherInput('');
      setCipherSolved(false);
      setCipherScoreAccum(0);
      setCipherCorrectCount(0);
      setCipherFeedback('');
    } else if (gameId === 'memory') {
      const pairs = buildMatchUpPairs(frameworks).slice(0, 6);
      const cards = pairs.flatMap((p) => [
        { uid: `${p.id}-L`, pairId: p.id, text: p.left, side: 'L' as const },
        { uid: `${p.id}-R`, pairId: p.id, text: p.right, side: 'R' as const },
      ]);
      setMemoryCards(cards.sort(() => Math.random() - 0.5));
      setMemoryFlipped([]);
      setMemoryMatchedPairs([]);
      setMemoryMoves(0);
    } else if (gameId === 'blitz') {
      const pool = buildDynamicBlitzPool(frameworks, diff).slice(0, 6);
      setBlitzPool(pool);
      setBlitzIdx(0);
      setBlitzSelectedOpt(null);
      setBlitzCorrect(0);
      setBlitzStreak(0);
      setBlitzSecondsLeft(diff === 'lanjutan' ? 45 : 65);
    } else if (gameId === 'reconstruction') {
      const isMixed = frameworks.includes('Campuran');
      const filtered = isMixed
        ? RECONSTRUCT_CHALLENGES
        : RECONSTRUCT_CHALLENGES.filter((c) => frameworks.includes(c.framework));
      setRecList((filtered.length > 0 ? filtered : RECONSTRUCT_CHALLENGES).slice(0, 4));
      setRecIdx(0);
      setRecPicked([]);
      setRecChecked(false);
      setRecCorrect(0);
    } else if (gameId === 'mistype-hunter') {
      const isMixed = frameworks.includes('Campuran');
      const filtered = isMixed
        ? MISTYPE_CHALLENGES
        : MISTYPE_CHALLENGES.filter((m) => frameworks.includes(m.framework));
      setMisList(filtered.length > 0 ? filtered : MISTYPE_CHALLENGES);
      setMisIdx(0);
      setMisPickedId(null);
      setMisCorrect(0);
    } else if (gameId === 'scenario-lens') {
      const isMixed = frameworks.includes('Campuran');
      const filtered = isMixed
        ? SCENARIO_LENS_ITEMS
        : SCENARIO_LENS_ITEMS.filter((s) => frameworks.includes(s.framework));
      setSlList(filtered.length > 0 ? filtered : SCENARIO_LENS_ITEMS);
      setSlIdx(0);
      setSlPickedId(null);
      setSlCorrect(0);
    } else if (gameId === 'wheel') {
      setWheelSpinning(false);
      setWheelLandedFramework(null);
      setWheelQuestion(null);
      setWheelSelectedOpt(null);
    } else if (gameId === 'escape-room') {
      setEscStageIdx(0);
      setEscAnswer('');
      setEscSeqPicked([]);
      setEscShowHint(false);
      setEscUnlockedMsg('');
      setEscErrorMsg('');
      setEscCorrectStages(0);
    }
  }

  const dailyChallenge = useMemo(() => getDailyArcadeChallenge(), []);
  const todayKey = getTodayDateKey();
  const isDailyDoneToday = Boolean(dailyCompletions[todayKey]);

  // ==================== MINI-GAME PLAY RENDERERS ====================
  function renderActiveGame() {
    if (!activeGame) return null;
    const gameMeta = ARCADE_GAME_CATALOG.find((g) => g.id === activeGame.gameId);
    const eduGuide: ArcadeEducationalGuide | undefined = ARCADE_GAME_EDUCATION[activeGame.gameId];

    return (
      <section className="dreamy-surface border border-indigo-200/80 rounded-2xl p-5 sm:p-7 space-y-6 shadow-sm">
        {/* Top Game Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-200/80">
          <div>
            <div className="flex items-center gap-2 text-xs font-medium text-indigo-700">
              <span>{gameMeta?.mechanicLabel || 'Mini-Game'}</span>
              <span>·</span>
              <span>Kerangka: {activeGame.frameworks.join(', ')}</span>
              <span>·</span>
              <span>
                Level: {activeGame.difficulty === 'dasar' ? 'Pemula (Dasar)' : activeGame.difficulty === 'menengah' ? 'Menengah' : 'Lanjutan'}
              </span>
            </div>
            <h2 className="text-xl font-display font-bold text-slate-900 mt-0.5">
              {gameMeta?.title}
            </h2>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {eduGuide && (
              <button
                type="button"
                onClick={() => setShowEduDrawer((s) => !s)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border whitespace-nowrap ${
                  showEduDrawer
                    ? 'bg-indigo-700 text-white border-indigo-700'
                    : 'bg-indigo-50 text-indigo-900 border-indigo-200 hover:bg-indigo-100'
                }`}
              >
                <HelpCircle className="w-3.5 h-3.5" />
                {showEduDrawer ? 'Tutup Panduan Teori' : 'Panduan & Teori Game'}
              </button>
            )}
            <button
              type="button"
              onClick={() => startMiniGame(activeGame.gameId, activeGame)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 whitespace-nowrap"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Ulangi
            </button>
            <button
              type="button"
              onClick={() => setActiveGame(null)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg whitespace-nowrap"
            >
              Keluar Sesi
            </button>
          </div>
        </div>

        {/* Collapsible Structured Educational Integration Drawer */}
        {eduGuide && showEduDrawer && (
          <div className="dm-view-enter p-5 rounded-xl bg-slate-50 border border-indigo-200/80 space-y-4 text-xs">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="font-display font-bold text-sm text-indigo-950">
                Panduan Edukatif &amp; Kerangka Teori — {gameMeta?.title}
              </div>
              {onNavigate && (
                <button
                  type="button"
                  onClick={() =>
                    onNavigate(eduGuide.learnMoreSection, {
                      theoryTab: eduGuide.recommendedTheoryTab,
                    })
                  }
                  className="px-3 py-1.5 text-xs font-semibold text-white bg-[#151D40] hover:bg-[#233070] rounded-lg whitespace-nowrap"
                >
                  {eduGuide.learnMoreLabel} →
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-3.5 rounded-lg bg-white border border-slate-200 space-y-1.5">
                <div className="font-bold text-slate-900">1. Instruksi Bermain</div>
                <ul className="list-disc list-inside text-slate-700 space-y-1">
                  {eduGuide.instructions.map((ins, i) => (
                    <li key={i}>{ins}</li>
                  ))}
                </ul>
              </div>
              <div className="p-3.5 rounded-lg bg-white border border-slate-200 space-y-1.5">
                <div className="font-bold text-slate-900">2. Ringkasan Teori</div>
                <p className="text-slate-700 leading-relaxed">{eduGuide.theoryOverview}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-3.5 rounded-lg bg-white border border-slate-200 space-y-1.5">
                <div className="font-bold text-slate-900">3. Definisi Kunci</div>
                <ul className="space-y-1 text-slate-700">
                  {eduGuide.keyDefinitions.map((kd, i) => (
                    <li key={i}>
                      <strong>{kd.term}:</strong> {kd.meaning}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="p-3.5 rounded-lg bg-white border border-slate-200 space-y-1.5">
                <div className="font-bold text-slate-900">4. Contoh Kerja (Worked Example)</div>
                <p className="text-slate-700 leading-relaxed">{eduGuide.workedExample}</p>
                <div className="pt-1.5 border-t border-slate-100 text-[11px] text-slate-500">
                  <strong>Referensi:</strong> {eduGuide.references.join(' ')}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 1. MATCH-UP */}
        {activeGame.gameId === 'match-up' && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-600">
              <span>Klik istilah di kolom kiri, lalu klik pasangannya di kolom kanan.</span>
              <span className="tabular-nums font-semibold text-slate-800">
                Tercocokkan: {matchedIds.length}/{matchPairs.length} · Salah klik: {matchMistakes}
              </span>
            </div>

            {matchFeedback && (
              <div className="text-xs px-3 py-2 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-900">
                {matchFeedback}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                {matchPairs.map((pair) => {
                  const done = matchedIds.includes(pair.id);
                  const selected = selectedLeftId === pair.id;
                  return (
                    <button
                      key={pair.id}
                      type="button"
                      disabled={done}
                      onClick={() => {
                        setSelectedLeftId(pair.id);
                        setMatchFeedback(`Memilih "${pair.left}" — silakan klik pasangannya di kanan.`);
                      }}
                      className={`w-full text-left px-4 py-3 rounded-xl border text-xs font-medium transition-all ${
                        done
                          ? 'bg-emerald-50 border-emerald-200 text-emerald-800 opacity-70'
                          : selected
                          ? 'bg-indigo-700 border-indigo-700 text-white shadow-sm'
                          : 'bg-white border-slate-200 text-slate-800 hover:border-indigo-300'
                      }`}
                    >
                      {pair.left}
                    </button>
                  );
                })}
              </div>

              <div className="space-y-2">
                {matchShuffledRight.map((pair) => {
                  const done = matchedIds.includes(pair.id);
                  return (
                    <button
                      key={pair.id}
                      type="button"
                      disabled={done || !selectedLeftId}
                      onClick={() => {
                        if (!selectedLeftId) return;
                        if (selectedLeftId === pair.id) {
                          const nextMatched = [...matchedIds, pair.id];
                          setMatchedIds(nextMatched);
                          setSelectedLeftId(null);
                          setMatchFeedback(`Tepat! "${pair.left}" dipasangkan dengan benar.`);
                          playArcadeTone('success', muted);
                          if (nextMatched.length === matchPairs.length) {
                            const score = Math.max(20, matchPairs.length * 15 - matchMistakes * 5);
                            void commitSessionRecord({
                              score,
                              maxScore: matchPairs.length * 15,
                              correctCount: Math.max(1, matchPairs.length - Math.min(matchPairs.length - 1, matchMistakes)),
                              totalQuestions: matchPairs.length,
                              completed: true,
                            });
                          }
                        } else {
                          setMatchMistakes((m) => m + 1);
                          setMatchFeedback('Belum cocok — periksa lagi definisi atau kerangkanya.');
                          playArcadeTone('error', muted);
                        }
                      }}
                      className={`w-full text-left px-4 py-3 rounded-xl border text-xs transition-all ${
                        done
                          ? 'bg-emerald-50 border-emerald-200 text-emerald-800 opacity-70'
                          : !selectedLeftId
                          ? 'bg-slate-50 border-slate-200 text-slate-500 cursor-not-allowed'
                          : 'bg-white border-slate-200 text-slate-700 hover:border-indigo-400 hover:bg-indigo-50/40'
                      }`}
                    >
                      {pair.right}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* 2. FUNCTION BUILDER */}
        {activeGame.gameId === 'function-builder' && fbRounds[fbIndex] && (() => {
          const cur = fbRounds[fbIndex];
          const slotLabels =
            cur.kind === 'socionics'
              ? ['1 · Leading', '2 · Creative', '3 · Role', '4 · PoLR']
              : ['1 · Dominant', '2 · Auxiliary', '3 · Tertiary', '4 · Inferior'];
          const allFilled = fbSlots.every(Boolean);

          return (
            <div className="space-y-5">
              <div className="flex items-center justify-between text-xs text-slate-600">
                <span className="tabular-nums font-semibold">
                  Tantangan {fbIndex + 1} dari {fbRounds.length}
                </span>
                <span>{cur.hint}</span>
              </div>

              <div className="bg-slate-900 text-white rounded-xl p-4 flex flex-wrap items-center justify-between gap-2">
                <div>
                  <div className="text-[11px] text-indigo-200">Target Konstruksi</div>
                  <div className="text-base font-display font-bold">{cur.label}</div>
                </div>
                <div className="text-xs text-amber-200 tabular-nums">
                  Skor benar sementara: {fbCorrectCount}/{fbRounds.length}
                </div>
              </div>

              {/* 4 Slots */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {slotLabels.map((lbl, idx) => {
                  const chosen = fbSlots[idx];
                  const isCorrect = fbChecked && chosen === cur.expected[idx];
                  const isWrong = fbChecked && chosen !== cur.expected[idx];
                  return (
                    <button
                      key={lbl}
                      type="button"
                      disabled={fbChecked}
                      onClick={() => setFbActiveSlot(idx)}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        isCorrect
                          ? 'bg-emerald-50 border-emerald-400 text-emerald-900'
                          : isWrong
                          ? 'bg-rose-50 border-rose-400 text-rose-900'
                          : fbActiveSlot === idx
                          ? 'bg-indigo-50 border-indigo-600 ring-2 ring-indigo-200'
                          : 'bg-white border-slate-200 hover:border-indigo-300'
                      }`}
                    >
                      <div className="text-[11px] text-slate-500 font-medium">{lbl}</div>
                      <div className="mt-1 text-lg font-display font-bold text-slate-900">
                        {chosen || '—'}
                      </div>
                      {fbChecked && (
                        <div className="text-[11px] mt-1 font-medium text-slate-600">
                          {isCorrect ? 'Tepat' : `Seharusnya: ${cur.expected[idx]}`}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* 8 Elements Palette */}
              {!fbChecked && (
                <div className="space-y-2">
                  <div className="text-xs font-medium text-slate-700">
                    Pilih Elemen untuk Slot ke-{fbActiveSlot + 1}:
                  </div>
                  <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                    {ALL_INFO_ELEMENTS.map((el) => {
                      const alreadyUsed = fbSlots.includes(el);
                      return (
                        <button
                          key={el}
                          type="button"
                          onClick={() => {
                            const next = [...fbSlots];
                            const existingAt = next.indexOf(el);
                            if (existingAt >= 0) next[existingAt] = null;
                            next[fbActiveSlot] = el;
                            setFbSlots(next);
                            const nextEmpty = next.findIndex((v) => v === null);
                            if (nextEmpty >= 0) setFbActiveSlot(nextEmpty);
                          }}
                          className={`py-2 px-3 rounded-lg border text-xs font-bold transition-colors ${
                            alreadyUsed
                              ? 'bg-indigo-100 border-indigo-300 text-indigo-900'
                              : 'bg-white border-slate-200 text-slate-800 hover:bg-indigo-50'
                          }`}
                        >
                          {el}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="flex flex-wrap items-center gap-3">
                {!fbChecked ? (
                  <button
                    type="button"
                    disabled={!allFilled}
                    onClick={() => {
                      const perfect = fbSlots.every((val, i) => val === cur.expected[i]);
                      if (perfect) {
                        setFbCorrectCount((c) => c + 1);
                        playArcadeTone('success', muted);
                      } else {
                        playArcadeTone('error', muted);
                      }
                      setFbChecked(true);
                    }}
                    className="px-4 py-2 text-xs font-semibold text-white bg-indigo-700 hover:bg-indigo-800 disabled:opacity-40 rounded-lg"
                  >
                    Periksa Susunan
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      if (fbIndex + 1 < fbRounds.length) {
                        setFbIndex((i) => i + 1);
                        setFbSlots([null, null, null, null]);
                        setFbActiveSlot(0);
                        setFbChecked(false);
                      } else {
                        void commitSessionRecord({
                          score: fbCorrectCount * 25,
                          maxScore: fbRounds.length * 25,
                          correctCount: fbCorrectCount,
                          totalQuestions: fbRounds.length,
                          completed: true,
                        });
                      }
                    }}
                    className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg"
                  >
                    {fbIndex + 1 < fbRounds.length ? 'Tantangan Berikutnya' : 'Selesaikan Ronde'}
                  </button>
                )}
              </div>
            </div>
          );
        })()}

        {/* 3. DETECTIVE */}
        {activeGame.gameId === 'detective' && detList[detIndex] && (() => {
          const mystery = detList[detIndex];
          const chosen = mystery.options.find((o) => o.id === detSelectedOptId);
          return (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-slate-600 tabular-nums">
                <span>Kasus {detIndex + 1} / {detList.length}</span>
                <span>Kerangka Utama: {mystery.framework}</span>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
                <h3 className="font-display font-bold text-slate-900 text-base">{mystery.title}</h3>
                <p className="text-sm text-slate-700 leading-relaxed">{mystery.narrative}</p>
                <div className="pt-2 border-t border-slate-200 space-y-1">
                  <div className="text-xs font-semibold text-slate-800">Petunjuk Terobservasi:</div>
                  <ul className="list-disc list-inside text-xs text-slate-600 space-y-1">
                    {mystery.clues.map((c, idx) => (
                      <li key={idx}>{c}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="text-xs font-semibold text-slate-900">{mystery.question}</div>

              <div className="space-y-2">
                {mystery.options.map((opt) => {
                  const isPicked = detSelectedOptId === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      disabled={Boolean(detSelectedOptId)}
                      onClick={() => {
                        setDetSelectedOptId(opt.id);
                        if (opt.supported) {
                          setDetCorrectCount((c) => c + 1);
                          playArcadeTone('success', muted);
                        } else {
                          playArcadeTone('error', muted);
                        }
                      }}
                      className={`w-full text-left p-3.5 rounded-xl border text-xs leading-relaxed transition-all ${
                        !detSelectedOptId
                          ? 'bg-white border-slate-200 hover:border-indigo-400 text-slate-800'
                          : isPicked && opt.supported
                          ? 'bg-emerald-50 border-emerald-400 text-emerald-950'
                          : isPicked && !opt.supported
                          ? 'bg-rose-50 border-rose-400 text-rose-950'
                          : opt.supported
                          ? 'bg-emerald-50/50 border-emerald-300 text-emerald-900'
                          : 'bg-slate-50 border-slate-200 text-slate-500'
                      }`}
                    >
                      {opt.label}
                    </button>
                  );
                })}
              </div>

              {chosen && (
                <div className="space-y-3">
                  <div
                    className={`p-3.5 rounded-xl border text-xs ${
                      chosen.supported
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                        : 'bg-amber-50 border-amber-200 text-amber-900'
                    }`}
                  >
                    {chosen.feedback}
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      if (detIndex + 1 < detList.length) {
                        setDetIndex((i) => i + 1);
                        setDetSelectedOptId(null);
                      } else {
                        void commitSessionRecord({
                          score: detCorrectCount * 25,
                          maxScore: detList.length * 25,
                          correctCount: detCorrectCount,
                          totalQuestions: detList.length,
                          completed: true,
                        });
                      }
                    }}
                    className="px-4 py-2 text-xs font-semibold text-white bg-indigo-700 hover:bg-indigo-800 rounded-lg"
                  >
                    {detIndex + 1 < detList.length ? 'Kasus Berikutnya' : 'Selesaikan Investigasi'}
                  </button>
                </div>
              )}
            </div>
          );
        })()}

        {/* 4. QUADRA & CATEGORY SORT */}
        {activeGame.gameId === 'quadra-sort' && (
          <div className="space-y-4">
            <div className="text-xs font-semibold text-slate-700">{qsPool.title}</div>
            <div className="space-y-3">
              {qsPool.items.map((item) => {
                const selectedCat = qsAnswers[item.id];
                const isRight = qsSubmitted && selectedCat === item.targetCategory;
                return (
                  <div
                    key={item.id}
                    className={`p-4 rounded-xl border space-y-2.5 ${
                      qsSubmitted
                        ? isRight
                          ? 'bg-emerald-50/70 border-emerald-300'
                          : 'bg-rose-50/70 border-rose-300'
                        : 'bg-white border-slate-200'
                    }`}
                  >
                    <div className="text-xs font-semibold text-slate-900">{item.label}</div>
                    <div className="flex flex-wrap gap-2">
                      {qsPool.categories.map((cat) => (
                        <button
                          key={cat}
                          type="button"
                          disabled={qsSubmitted}
                          onClick={() => setQsAnswers((prev) => ({ ...prev, [item.id]: cat }))}
                          className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors ${
                            selectedCat === cat
                              ? 'bg-indigo-700 border-indigo-700 text-white'
                              : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-indigo-50'
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                    {qsSubmitted && (
                      <div className="text-[11px] text-slate-700">
                        Jawaban benar: <strong>{item.targetCategory}</strong> — {item.explanation}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            <div>
              {!qsSubmitted ? (
                <button
                  type="button"
                  disabled={Object.keys(qsAnswers).length < qsPool.items.length}
                  onClick={() => {
                    setQsSubmitted(true);
                    const right = qsPool.items.filter((it) => qsAnswers[it.id] === it.targetCategory).length;
                    playArcadeTone(right >= Math.ceil(qsPool.items.length / 2) ? 'success' : 'error', muted);
                  }}
                  className="px-4 py-2 text-xs font-semibold text-white bg-indigo-700 hover:bg-indigo-800 disabled:opacity-40 rounded-lg"
                >
                  Periksa Klasifikasi ({Object.keys(qsAnswers).length}/{qsPool.items.length})
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    const right = qsPool.items.filter((it) => qsAnswers[it.id] === it.targetCategory).length;
                    void commitSessionRecord({
                      score: right * 15,
                      maxScore: qsPool.items.length * 15,
                      correctCount: right,
                      totalQuestions: qsPool.items.length,
                      completed: true,
                    });
                  }}
                  className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg"
                >
                  Simpan Skor Klasifikasi
                </button>
              )}
            </div>
          </div>
        )}

        {/* 5. TYPE CIPHER */}
        {activeGame.gameId === 'type-cipher' && cipherList[cipherIndex] && (() => {
          const puzzle = cipherList[cipherIndex];
          const pointsAvailable = Math.max(10, 35 - (cipherCluesShown - 1) * 5);

          const submitCipher = () => {
            const norm = cipherInput.trim().toLowerCase();
            if (!norm) return;
            if (puzzle.acceptedAliases.includes(norm) || norm === puzzle.answer.toLowerCase()) {
              setCipherSolved(true);
              setCipherScoreAccum((s) => s + pointsAvailable);
              setCipherCorrectCount((c) => c + 1);
              setCipherFeedback(`Tepat! Kode adalah ${puzzle.answer} (+${pointsAvailable} poin). ${puzzle.explanation}`);
              playArcadeTone('success', muted);
            } else {
              setCipherFeedback('Belum tepat — Anda bisa membuka petunjuk tambahan atau coba lagi.');
              playArcadeTone('error', muted);
            }
          };

          return (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-600 tabular-nums">
                <span>Sandi {cipherIndex + 1} / {cipherList.length} · Kerangka: {puzzle.framework}</span>
                <span className="font-semibold text-indigo-800">Nilai saat ini: {pointsAvailable} poin</span>
              </div>

              <div className="space-y-2">
                {puzzle.clues.slice(0, cipherCluesShown).map((clue, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800">
                    <span className="font-semibold text-indigo-700 mr-1.5">Petunjuk #{idx + 1}:</span>
                    {clue}
                  </div>
                ))}
              </div>

              {!cipherSolved && (
                <div className="flex flex-wrap items-center gap-2">
                  <input
                    type="text"
                    value={cipherInput}
                    onChange={(e) => setCipherInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && submitCipher()}
                    placeholder="Ketik kode jawaban (mis. LIE, LVEF, SANGUINE, INFJ)..."
                    className="flex-1 min-w-[200px] px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={submitCipher}
                    className="px-4 py-2 text-xs font-semibold text-white bg-indigo-700 hover:bg-indigo-800 rounded-lg"
                  >
                    Tebak Sandi
                  </button>
                  {cipherCluesShown < 5 && (
                    <button
                      type="button"
                      onClick={() => setCipherCluesShown((c) => Math.min(5, c + 1))}
                      className="px-3 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg"
                    >
                      Buka Petunjuk ({cipherCluesShown}/5)
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      setCipherSolved(true);
                      setCipherFeedback(`Dilewati. Jawaban sebenarnya: ${puzzle.answer}. ${puzzle.explanation}`);
                    }}
                    className="px-3 py-2 text-xs text-slate-500 hover:text-slate-800"
                  >
                    Lewati
                  </button>
                </div>
              )}

              {cipherFeedback && (
                <div className="p-3 rounded-xl bg-indigo-50 border border-indigo-200 text-xs text-indigo-950">
                  {cipherFeedback}
                </div>
              )}

              {cipherSolved && (
                <button
                  type="button"
                  onClick={() => {
                    if (cipherIndex + 1 < cipherList.length) {
                      setCipherIndex((i) => i + 1);
                      setCipherCluesShown(1);
                      setCipherInput('');
                      setCipherSolved(false);
                      setCipherFeedback('');
                    } else {
                      void commitSessionRecord({
                        score: cipherScoreAccum,
                        maxScore: cipherList.length * 35,
                        correctCount: cipherCorrectCount,
                        totalQuestions: cipherList.length,
                        completed: true,
                      });
                    }
                  }}
                  className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg"
                >
                  {cipherIndex + 1 < cipherList.length ? 'Sandi Berikutnya' : 'Selesaikan Type Cipher'}
                </button>
              )}
            </div>
          );
        })()}

        {/* 6. MEMORY */}
        {activeGame.gameId === 'memory' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs text-slate-600 tabular-nums">
              <span>Temukan 6 pasangan konsep & makna yang cocok.</span>
              <span className="font-semibold">Pasangan: {memoryMatchedPairs.length}/6 · Langkah: {memoryMoves}</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {memoryCards.map((card) => {
                const isMatched = memoryMatchedPairs.includes(card.pairId);
                const isFlipped = isMatched || memoryFlipped.includes(card.uid);
                return (
                  <button
                    key={card.uid}
                    type="button"
                    disabled={isMatched || memoryFlipped.includes(card.uid) || memoryFlipped.length >= 2}
                    onClick={() => {
                      const nextFlip = [...memoryFlipped, card.uid];
                      setMemoryFlipped(nextFlip);
                      if (nextFlip.length === 2) {
                        setMemoryMoves((m) => m + 1);
                        const first = memoryCards.find((c) => c.uid === nextFlip[0]);
                        const second = memoryCards.find((c) => c.uid === nextFlip[1]);
                        if (first && second && first.pairId === second.pairId) {
                          const nextPairs = [...memoryMatchedPairs, first.pairId];
                          setMemoryMatchedPairs(nextPairs);
                          setMemoryFlipped([]);
                          playArcadeTone('success', muted);
                          if (nextPairs.length === 6) {
                            const score = Math.max(30, 120 - Math.max(0, memoryMoves + 1 - 6) * 5);
                            void commitSessionRecord({
                              score,
                              maxScore: 120,
                              correctCount: 6,
                              totalQuestions: 6,
                              completed: true,
                            });
                          }
                        } else {
                          playArcadeTone('error', muted);
                          window.setTimeout(() => setMemoryFlipped([]), 800);
                        }
                      }
                    }}
                    className={`min-h-[88px] p-3 rounded-xl border text-xs font-medium transition-all flex items-center justify-center text-center ${
                      isMatched
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                        : isFlipped
                        ? 'bg-white border-indigo-500 text-slate-900 shadow-sm'
                        : 'bg-[#151D40] border-[#293568] text-[#E6C77E] hover:bg-[#1E2958]'
                    }`}
                  >
                    {isFlipped ? card.text : '✦ DYNAMAP'}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* 7. BLITZ */}
        {activeGame.gameId === 'blitz' && blitzPool[blitzIdx] && (() => {
          const q = blitzPool[blitzIdx];
          return (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs tabular-nums">
                <span className="font-semibold text-slate-700">
                  Soal {blitzIdx + 1} / {blitzPool.length} · Kerangka: {q.framework}
                </span>
                <div className="flex items-center gap-3">
                  <span className="inline-flex items-center gap-1 font-semibold text-amber-700">
                    <Flame className="w-3.5 h-3.5" /> Streak: {blitzStreak}
                  </span>
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md border font-semibold ${
                      blitzSecondsLeft <= 12
                        ? 'bg-rose-50 border-rose-300 text-rose-800'
                        : 'bg-slate-50 border-slate-200 text-slate-800'
                    }`}
                  >
                    <Timer className="w-3.5 h-3.5" /> {blitzSecondsLeft}d
                  </span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-white border border-slate-200 text-sm font-semibold text-slate-900 leading-relaxed">
                {q.question}
              </div>

              <div className="space-y-2">
                {q.options.map((opt, idx) => {
                  const picked = blitzSelectedOpt === idx;
                  const right = idx === q.correctIndex;
                  return (
                    <button
                      key={idx}
                      type="button"
                      disabled={blitzSelectedOpt !== null}
                      onClick={() => {
                        setBlitzSelectedOpt(idx);
                        if (right) {
                          setBlitzCorrect((c) => c + 1);
                          setBlitzStreak((s) => s + 1);
                          playArcadeTone('success', muted);
                        } else {
                          setBlitzStreak(0);
                          playArcadeTone('error', muted);
                        }
                      }}
                      className={`w-full text-left p-3.5 rounded-xl border text-xs leading-relaxed transition-all ${
                        blitzSelectedOpt === null
                          ? 'bg-white border-slate-200 hover:border-indigo-400 text-slate-800'
                          : right
                          ? 'bg-emerald-50 border-emerald-400 text-emerald-950 font-medium'
                          : picked
                          ? 'bg-rose-50 border-rose-400 text-rose-950'
                          : 'bg-slate-50 border-slate-200 text-slate-500'
                      }`}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>

              {blitzSelectedOpt !== null && (
                <div className="space-y-3">
                  <div className="p-3 rounded-xl bg-indigo-50 border border-indigo-200 text-xs text-indigo-950">
                    {q.explanation}
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      if (blitzIdx + 1 < blitzPool.length) {
                        setBlitzIdx((i) => i + 1);
                        setBlitzSelectedOpt(null);
                      } else {
                        void commitSessionRecord({
                          score: blitzCorrect * 15,
                          maxScore: blitzPool.length * 15,
                          correctCount: blitzCorrect,
                          totalQuestions: blitzPool.length,
                          completed: true,
                        });
                      }
                    }}
                    className="px-4 py-2 text-xs font-semibold text-white bg-indigo-700 hover:bg-indigo-800 rounded-lg"
                  >
                    {blitzIdx + 1 < blitzPool.length ? 'Soal Berikutnya' : 'Lihat Hasil Blitz'}
                  </button>
                </div>
              )}
            </div>
          );
        })()}

        {/* 8. RECONSTRUCTION */}
        {activeGame.gameId === 'reconstruction' && recList[recIdx] && (() => {
          const item = recList[recIdx];
          const remaining = item.pieces.filter((p) => !recPicked.includes(p));
          const isMatch = recPicked.join('') === item.correctOrder.join('');
          return (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-slate-600 tabular-nums">
                <span>Rekonstruksi {recIdx + 1} / {recList.length} · {item.framework}</span>
                <span>Skor Benar: {recCorrect}</span>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                <div className="text-xs font-semibold text-indigo-800">{item.prompt}</div>
                <p className="text-sm text-slate-900 font-medium">{item.targetDescription}</p>
              </div>

              <div className="p-4 rounded-xl bg-white border border-slate-200 min-h-[64px] flex flex-wrap items-center gap-2">
                {recPicked.length === 0 ? (
                  <span className="text-xs text-slate-400">Klik kepingan di bawah secara berurutan...</span>
                ) : (
                  recPicked.map((piece, i) => (
                    <span
                      key={i}
                      className="px-3.5 py-2 rounded-lg bg-indigo-700 text-white text-sm font-display font-bold"
                    >
                      {piece}
                    </span>
                  ))
                )}
              </div>

              {!recChecked && (
                <div className="flex flex-wrap items-center gap-2">
                  {remaining.map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setRecPicked((prev) => [...prev, p])}
                      className="px-4 py-2 rounded-lg bg-white border border-slate-300 hover:border-indigo-500 text-sm font-bold text-slate-800"
                    >
                      {p}
                    </button>
                  ))}
                  {recPicked.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setRecPicked([])}
                      className="px-3 py-2 text-xs text-slate-600 hover:text-slate-900"
                    >
                      Bersihkan
                    </button>
                  )}
                </div>
              )}

              {recChecked && (
                <div
                  className={`p-3.5 rounded-xl border text-xs ${
                    isMatch
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                      : 'bg-rose-50 border-rose-200 text-rose-950'
                  }`}
                >
                  <strong>{isMatch ? 'Konfigurasi Tepat!' : `Urutan Benar: ${item.correctOrder.join('')}`}</strong> —{' '}
                  {item.explanation}
                </div>
              )}

              <div>
                {!recChecked ? (
                  <button
                    type="button"
                    disabled={recPicked.length < item.correctOrder.length}
                    onClick={() => {
                      setRecChecked(true);
                      if (isMatch) {
                        setRecCorrect((c) => c + 1);
                        playArcadeTone('success', muted);
                      } else {
                        playArcadeTone('error', muted);
                      }
                    }}
                    className="px-4 py-2 text-xs font-semibold text-white bg-indigo-700 hover:bg-indigo-800 disabled:opacity-40 rounded-lg"
                  >
                    Periksa Konfigurasi
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      if (recIdx + 1 < recList.length) {
                        setRecIdx((i) => i + 1);
                        setRecPicked([]);
                        setRecChecked(false);
                      } else {
                        void commitSessionRecord({
                          score: recCorrect * 25,
                          maxScore: recList.length * 25,
                          correctCount: recCorrect,
                          totalQuestions: recList.length,
                          completed: true,
                        });
                      }
                    }}
                    className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg"
                  >
                    {recIdx + 1 < recList.length ? 'Soal Berikutnya' : 'Selesaikan Rekonstruksi'}
                  </button>
                )}
              </div>
            </div>
          );
        })()}

        {/* 9. MISTYPE HUNTER */}
        {activeGame.gameId === 'mistype-hunter' && misList[misIdx] && (() => {
          const item = misList[misIdx];
          const picked = item.statements.find((s) => s.id === misPickedId);
          return (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-slate-600 tabular-nums">
                <span>Misi {misIdx + 1} / {misList.length} · {item.framework}</span>
                <span>Ketepatan: {misCorrect}</span>
              </div>
              <div className="text-sm font-semibold text-slate-900">{item.prompt}</div>
              <div className="space-y-2">
                {item.statements.map((st) => {
                  const isSelected = misPickedId === st.id;
                  return (
                    <button
                      key={st.id}
                      type="button"
                      disabled={Boolean(misPickedId)}
                      onClick={() => {
                        setMisPickedId(st.id);
                        if (st.isError) {
                          setMisCorrect((c) => c + 1);
                          playArcadeTone('success', muted);
                        } else {
                          playArcadeTone('error', muted);
                        }
                      }}
                      className={`w-full text-left p-3.5 rounded-xl border text-xs leading-relaxed ${
                        !misPickedId
                          ? 'bg-white border-slate-200 hover:border-indigo-400 text-slate-800'
                          : st.isError
                          ? 'bg-emerald-50 border-emerald-400 text-emerald-950 font-medium'
                          : isSelected
                          ? 'bg-rose-50 border-rose-400 text-rose-950'
                          : 'bg-slate-50 border-slate-200 text-slate-500'
                      }`}
                    >
                      {st.text}
                    </button>
                  );
                })}
              </div>
              {picked && (
                <div className="space-y-3">
                  <div className="p-3 rounded-xl bg-indigo-50 border border-indigo-200 text-xs text-indigo-950">
                    {picked.explanation}
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      if (misIdx + 1 < misList.length) {
                        setMisIdx((i) => i + 1);
                        setMisPickedId(null);
                      } else {
                        void commitSessionRecord({
                          score: misCorrect * 25,
                          maxScore: misList.length * 25,
                          correctCount: misCorrect,
                          totalQuestions: misList.length,
                          completed: true,
                        });
                      }
                    }}
                    className="px-4 py-2 text-xs font-semibold text-white bg-indigo-700 hover:bg-indigo-800 rounded-lg"
                  >
                    {misIdx + 1 < misList.length ? 'Lanjut Berikutnya' : 'Selesaikan Mistype Hunter'}
                  </button>
                </div>
              )}
            </div>
          );
        })()}

        {/* 10. SCENARIO LENS */}
        {activeGame.gameId === 'scenario-lens' && slList[slIdx] && (() => {
          const item = slList[slIdx];
          const picked = item.options.find((o) => o.id === slPickedId);
          return (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-slate-600 tabular-nums">
                <span>Skenario {slIdx + 1} / {slList.length} · {item.framework}</span>
                <span>Skor Benar: {slCorrect}</span>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-800 leading-relaxed">
                {item.situation}
              </div>
              <div className="text-xs font-semibold text-slate-900">{item.question}</div>
              <div className="space-y-2">
                {item.options.map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    disabled={Boolean(slPickedId)}
                    onClick={() => {
                      setSlPickedId(opt.id);
                      if (opt.correct) {
                        setSlCorrect((c) => c + 1);
                        playArcadeTone('success', muted);
                      } else {
                        playArcadeTone('error', muted);
                      }
                    }}
                    className={`w-full text-left p-3.5 rounded-xl border text-xs leading-relaxed ${
                      !slPickedId
                        ? 'bg-white border-slate-200 hover:border-indigo-400 text-slate-800'
                        : opt.correct
                        ? 'bg-emerald-50 border-emerald-400 text-emerald-950 font-medium'
                        : slPickedId === opt.id
                        ? 'bg-rose-50 border-rose-400 text-rose-950'
                        : 'bg-slate-50 border-slate-200 text-slate-500'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
              {picked && (
                <div className="space-y-3">
                  <div className="p-3 rounded-xl bg-indigo-50 border border-indigo-200 text-xs text-indigo-950">
                    {picked.explanation}
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      if (slIdx + 1 < slList.length) {
                        setSlIdx((i) => i + 1);
                        setSlPickedId(null);
                      } else {
                        void commitSessionRecord({
                          score: slCorrect * 25,
                          maxScore: slList.length * 25,
                          correctCount: slCorrect,
                          totalQuestions: slList.length,
                          completed: true,
                        });
                      }
                    }}
                    className="px-4 py-2 text-xs font-semibold text-white bg-indigo-700 hover:bg-indigo-800 rounded-lg"
                  >
                    {slIdx + 1 < slList.length ? 'Skenario Berikutnya' : 'Selesaikan Scenario Lens'}
                  </button>
                </div>
              )}
            </div>
          );
        })()}

        {/* 11. TYPOLOGY WHEEL */}
        {activeGame.gameId === 'wheel' && (() => {
          const wheelFws: ArcadeFramework[] = [
            'Socionics',
            'MBTI',
            'Enneagram',
            'Psychosophy',
            'SLOAN',
            'Instincts',
            'Temperament',
          ];
          const sliceDeg = 360 / wheelFws.length;
          const spinWheel = () => {
            if (wheelSpinning) return;
            setWheelSpinning(true);
            setWheelLandedFramework(null);
            setWheelQuestion(null);
            setWheelSelectedOpt(null);
            const sliceIdx = Math.floor(Math.random() * wheelFws.length);
            const targetDeg = wheelRotation + 720 + sliceIdx * sliceDeg + 20;
            setWheelRotation(targetDeg);
            window.setTimeout(() => {
              const chosenFw = wheelFws[sliceIdx];
              const qPool = buildDynamicBlitzPool([chosenFw], 'all');
              setWheelSpinning(false);
              setWheelLandedFramework(chosenFw);
              setWheelQuestion(qPool[0] || CURATED_BLITZ_QUESTIONS[0]);
            }, 900);
          };

          return (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              <div className="md:col-span-5 flex flex-col items-center gap-4">
                <div className="relative w-56 h-56">
                  <div
                    className="w-full h-full transition-transform duration-700 ease-out"
                    style={{ transform: `rotate(${wheelRotation}deg)` }}
                  >
                    <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-md">
                      {wheelFws.map((fw, idx) => {
                        const a0 = (idx * sliceDeg - 90) * (Math.PI / 180);
                        const a1 = ((idx + 1) * sliceDeg - 90) * (Math.PI / 180);
                        const x0 = 100 + 92 * Math.cos(a0);
                        const y0 = 100 + 92 * Math.sin(a0);
                        const x1 = 100 + 92 * Math.cos(a1);
                        const y1 = 100 + 92 * Math.sin(a1);
                        const mid = ((idx + 0.5) * sliceDeg - 90) * (Math.PI / 180);
                        const tx = 100 + 58 * Math.cos(mid);
                        const ty = 100 + 58 * Math.sin(mid);
                        const fills = ['#1e2a5a', '#2b3e7e', '#374c99', '#25356e', '#1a244f', '#31448c', '#4559a8'];
                        return (
                          <g key={fw}>
                            <path
                              d={`M100,100 L${x0},${y0} A92,92 0 0,1 ${x1},${y1} Z`}
                              fill={fills[idx]}
                              stroke="#E6C77E"
                              strokeWidth="1.2"
                            />
                            <text
                              x={tx}
                              y={ty}
                              fill="#F8FAFC"
                              fontSize="8"
                              fontWeight="600"
                              textAnchor="middle"
                              dominantBaseline="middle"
                            >
                              {fw.slice(0, 10)}
                            </text>
                          </g>
                        );
                      })}
                      <circle cx="100" cy="100" r="16" fill="#0F1733" stroke="#E6C77E" strokeWidth="2" />
                    </svg>
                  </div>
                </div>
                <button
                  type="button"
                  disabled={wheelSpinning || Boolean(wheelQuestion)}
                  onClick={spinWheel}
                  className="px-5 py-2.5 text-xs font-semibold text-white bg-indigo-700 hover:bg-indigo-800 disabled:opacity-40 rounded-lg"
                >
                  {wheelSpinning ? 'Memutar Roda...' : 'Putar Roda Tantangan'}
                </button>
              </div>

              <div className="md:col-span-7 space-y-3">
                {!wheelQuestion ? (
                  <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600">
                    Tekan tombol <strong>Putar Roda Tantangan</strong> untuk memilih kerangka acak dan memunculkan misi mini-challenge Anda.
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="text-xs font-semibold text-indigo-700">
                      Sektor Terpilih: {wheelLandedFramework}
                    </div>
                    <div className="p-4 rounded-xl bg-white border border-slate-200 text-sm font-semibold text-slate-900">
                      {wheelQuestion.question}
                    </div>
                    <div className="space-y-2">
                      {wheelQuestion.options.map((opt, idx) => (
                        <button
                          key={idx}
                          type="button"
                          disabled={wheelSelectedOpt !== null}
                          onClick={() => {
                            setWheelSelectedOpt(idx);
                            const ok = idx === wheelQuestion.correctIndex;
                            playArcadeTone(ok ? 'success' : 'error', muted);
                          }}
                          className={`w-full text-left p-3 rounded-xl border text-xs ${
                            wheelSelectedOpt === null
                              ? 'bg-white border-slate-200 hover:border-indigo-400'
                              : idx === wheelQuestion.correctIndex
                              ? 'bg-emerald-50 border-emerald-400 text-emerald-950 font-semibold'
                              : wheelSelectedOpt === idx
                              ? 'bg-rose-50 border-rose-400 text-rose-950'
                              : 'bg-slate-50 border-slate-200 text-slate-500'
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                    {wheelSelectedOpt !== null && (
                      <div className="space-y-2">
                        <div className="p-3 rounded-xl bg-indigo-50 border border-indigo-200 text-xs text-indigo-950">
                          {wheelQuestion.explanation}
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            const ok = wheelSelectedOpt === wheelQuestion.correctIndex;
                            void commitSessionRecord({
                              score: ok ? 30 : 10,
                              maxScore: 30,
                              correctCount: ok ? 1 : 0,
                              totalQuestions: 1,
                              completed: true,
                            });
                          }}
                          className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg"
                        >
                          Catat Hasil Putaran
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })()}

        {/* 12. ESCAPE ROOM (5 STAGES) */}
        {activeGame.gameId === 'escape-room' && ESCAPE_ROOM_STAGES[escStageIdx] && (() => {
          const st = ESCAPE_ROOM_STAGES[escStageIdx];
          const verifyStage = (submittedVal: string) => {
            const norm = submittedVal.trim().toLowerCase();
            const target = st.correctAnswer.trim().toLowerCase();
            const match =
              norm === target ||
              (st.options && st.options.some((o) => o.toLowerCase() === norm && norm.includes(target)));

            if (match || (st.puzzleType === 'sequence' && submittedVal === st.correctAnswer)) {
              setEscUnlockedMsg(st.unlockMessage);
              setEscErrorMsg('');
              setEscCorrectStages((c) => c + 1);
              playArcadeTone('unlock', muted);
            } else {
              setEscErrorMsg('Segel belum terbuka. Periksa kembali petunjuk ruang atau aktifkan Bantuan.');
              playArcadeTone('error', muted);
            }
          };

          return (
            <div className="space-y-5">
              {/* 5-chamber progress bar */}
              <div className="grid grid-cols-5 gap-2">
                {ESCAPE_ROOM_STAGES.map((stage, i) => {
                  const passed = i < escStageIdx || (i === escStageIdx && Boolean(escUnlockedMsg));
                  const current = i === escStageIdx && !escUnlockedMsg;
                  return (
                    <div
                      key={stage.stageNumber}
                      className={`p-2 rounded-lg border text-center text-[11px] font-medium ${
                        passed
                          ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                          : current
                          ? 'bg-indigo-700 border-indigo-700 text-white'
                          : 'bg-slate-50 border-slate-200 text-slate-400'
                      }`}
                    >
                      Ruang {stage.stageNumber}
                    </div>
                  );
                })}
              </div>

              <div className="p-5 rounded-xl bg-[#101733] text-[#F1F4FF] space-y-2 border border-[#DFBE74]/30">
                <div className="text-[11px] text-[#E6C77E] font-medium">
                  {st.mechanicLabel}
                </div>
                <h3 className="text-lg font-display font-bold">{st.chamberTitle}</h3>
                <p className="text-xs text-[#C7D0EE] leading-relaxed">{st.storyPrompt}</p>
              </div>

              <div className="text-sm font-semibold text-slate-900">{st.question}</div>

              {st.puzzleType === 'choice' && st.options && !escUnlockedMsg && (
                <div className="space-y-2">
                  {st.options.map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => verifyStage(opt)}
                      className="w-full text-left p-3.5 rounded-xl bg-white border border-slate-200 hover:border-indigo-400 text-xs text-slate-800"
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              )}

              {st.puzzleType === 'cipher' && !escUnlockedMsg && (
                <div className="flex flex-wrap gap-2">
                  <input
                    type="text"
                    value={escAnswer}
                    onChange={(e) => setEscAnswer(e.target.value)}
                    placeholder="Masukkan kode 3 digit (mis. 146)..."
                    className="flex-1 min-w-[180px] px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => verifyStage(escAnswer)}
                    className="px-4 py-2 text-xs font-semibold text-white bg-indigo-700 hover:bg-indigo-800 rounded-lg"
                  >
                    Buka Kunci Ruang
                  </button>
                </div>
              )}

              {st.puzzleType === 'sequence' && st.sequenceItems && !escUnlockedMsg && (
                <div className="space-y-3">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-2 min-h-[52px]">
                    {escSeqPicked.length === 0 ? (
                      <span className="text-xs text-slate-400">Urutan terpilih muncul di sini...</span>
                    ) : (
                      escSeqPicked.map((x, idx) => (
                        <span key={idx} className="px-3 py-1 rounded-lg bg-indigo-700 text-white text-sm font-bold">
                          {x}
                        </span>
                      ))
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {st.sequenceItems
                      .filter((it) => !escSeqPicked.includes(it))
                      .map((it) => (
                        <button
                          key={it}
                          type="button"
                          onClick={() => {
                            const next = [...escSeqPicked, it];
                            setEscSeqPicked(next);
                            if (next.length === st.sequenceItems!.length) {
                              verifyStage(next.join(''));
                            }
                          }}
                          className="px-4 py-2 rounded-lg bg-white border border-slate-300 hover:border-indigo-500 text-sm font-bold"
                        >
                          {it}
                        </button>
                      ))}
                    {escSeqPicked.length > 0 && (
                      <button
                        type="button"
                        onClick={() => setEscSeqPicked([])}
                        className="px-3 py-2 text-xs text-slate-600"
                      >
                        Reset Urutan
                      </button>
                    )}
                  </div>
                </div>
              )}

              {escErrorMsg && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-900">
                  {escErrorMsg}
                </div>
              )}

              {escShowHint && !escUnlockedMsg && (
                <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-950">
                  <strong>Petunjuk:</strong> {st.hint}
                </div>
              )}

              <div className="flex flex-wrap items-center justify-between gap-2">
                {!escUnlockedMsg ? (
                  <button
                    type="button"
                    onClick={() => setEscShowHint((h) => !h)}
                    className="inline-flex items-center gap-1.5 text-xs text-indigo-700 hover:underline"
                  >
                    <HelpCircle className="w-3.5 h-3.5" />
                    {escShowHint ? 'Sembunyikan Petunjuk' : 'Butuh Petunjuk Ruang?'}
                  </button>
                ) : (
                  <div className="w-full space-y-3">
                    <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-950">
                      <KeyRound className="w-4 h-4 inline mr-1.5" />
                      {escUnlockedMsg}
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        if (escStageIdx + 1 < ESCAPE_ROOM_STAGES.length) {
                          setEscStageIdx((i) => i + 1);
                          setEscAnswer('');
                          setEscSeqPicked([]);
                          setEscShowHint(false);
                          setEscUnlockedMsg('');
                          setEscErrorMsg('');
                        } else {
                          void commitSessionRecord({
                            score: escCorrectStages * 30,
                            maxScore: ESCAPE_ROOM_STAGES.length * 30,
                            correctCount: escCorrectStages,
                            totalQuestions: ESCAPE_ROOM_STAGES.length,
                            completed: true,
                          });
                        }
                      }}
                      className="px-4 py-2 text-xs font-semibold text-white bg-indigo-700 hover:bg-indigo-800 rounded-lg"
                    >
                      {escStageIdx + 1 < ESCAPE_ROOM_STAGES.length
                        ? `Masuk ke Ruang ${escStageIdx + 2}`
                        : 'Selesaikan Observatorium'}
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })()}
      </section>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <section className="relative overflow-hidden dreamy-surface border border-slate-200/80 rounded-2xl p-6 sm:p-7">
        <CelestialCornerFiligree tone="dark" className="w-24 h-24 opacity-40" />
        <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="space-y-2 max-w-3xl">
            <div className="text-xs font-medium text-indigo-700">
              Zona Tantangan Edukatif · 12 Mini-Game Multi-Kerangka
            </div>
            <h1 className="text-2xl font-display font-bold text-slate-900">
              Typology Arcade
            </h1>
            <p className="text-sm text-slate-600 leading-relaxed">
              Latih ketajaman konsep Socionics, MBTI, Tipologi Jung, Enneagram (Sayap, Insting, Stacking, Tritype),
              Psikosofi (L·V·E·F), dan Big Five / SLOAN melalui simulasi teka-teki interaktif—seluruh riwayat &
              pencapaian dihitung murni dari permainan nyata Anda.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <div className="px-3.5 py-2 rounded-xl bg-amber-50/90 border border-amber-200/80 text-xs text-amber-950 tabular-nums">
              <Flame className="w-3.5 h-3.5 inline mr-1 text-amber-700" />
              Streak Harian: <strong>{streaks.current} hari</strong>
            </div>
            <button
              type="button"
              onClick={() => setMuted((m) => !m)}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium bg-white border border-slate-200 rounded-xl text-slate-700 hover:bg-slate-50"
            >
              {muted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
              {muted ? 'Suara Mati' : 'Suara Aktif'}
            </button>
          </div>
        </div>

        {!account && (
          <div className="mt-4 pt-3 border-t border-slate-200/70 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-600">
            <span>
              Anda sedang bermain sebagai tamu (progres tersimpan di browser ini). Masuk untuk sinkronisasi ke akun DYNAMAP Anda.
            </span>
            <button
              type="button"
              onClick={onOpenAuth}
              className="font-semibold text-indigo-700 hover:underline whitespace-nowrap"
            >
              Masuk / Klaim Akun
            </button>
          </div>
        )}
      </section>

      {/* Top Mode Tabs */}
      <div className="flex flex-wrap items-center gap-2">
        {[
          { id: 'arena', label: 'Free Play (12 Mini-Game)', icon: Play },
          { id: 'daily', label: 'Tantangan Harian', icon: Flame },
          { id: 'campaign', label: 'Campaign Progresif', icon: Layers },
          { id: 'random', label: 'Tantangan Acak', icon: Shuffle },
          { id: 'stats', label: 'Statistik & Pencapaian', icon: BarChart3 },
        ].map((tab) => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                setActiveTab(tab.id as typeof activeTab);
                setActiveGame(null);
              }}
              className={`inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl border transition-colors whitespace-nowrap ${
                active
                  ? 'bg-[#151D40] text-white border-[#151D40]'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Achievement Unlock Celebration Toast */}
      {toastAchievements.length > 0 && (
        <div
          role="status"
          className="fixed bottom-5 right-5 z-50 max-w-sm bg-[#101733] text-white border border-[#DFBE74]/60 rounded-2xl p-4 shadow-2xl dm-view-enter space-y-2"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2 text-xs font-bold text-[#E6C77E]">
              <Trophy className="w-4 h-4 shrink-0" />
              <span>Lencana Pencapaian Terbuka!</span>
            </div>
            <button
              type="button"
              onClick={() => setToastAchievements([])}
              className="text-[11px] text-slate-300 hover:text-white"
            >
              Tutup
            </button>
          </div>
          <div className="space-y-1">
            {toastAchievements.map((ach) => (
              <div key={ach.id} className="text-xs text-[#E5EAFB]">
                <strong className="text-white">{ach.title}</strong> — {ach.description}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Session Summary Banner */}
      {sessionSummary && (
        <section className="bg-white border-2 border-[#DFBE74]/70 rounded-2xl p-5 space-y-4 shadow-sm dm-view-enter">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center">
                <Trophy className="w-5 h-5 text-amber-700" />
              </div>
              <div>
                <h2 className="text-base font-display font-bold text-slate-900">
                  Sesi Tercatat! Skor {sessionSummary.record.score}/{sessionSummary.record.maxScore}
                </h2>
                <p className="text-xs text-slate-600 tabular-nums">
                  Tepat {sessionSummary.record.correctCount}/{sessionSummary.record.totalQuestions} · Durasi{' '}
                  {sessionSummary.record.durationSeconds} detik
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() =>
                  startMiniGame(sessionSummary.record.gameId, {
                    mode: sessionSummary.record.mode,
                    frameworks: sessionSummary.record.frameworks,
                    difficulty: sessionSummary.record.difficulty,
                  })
                }
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-indigo-700 hover:bg-indigo-800 rounded-lg whitespace-nowrap"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Main Lagi
              </button>
              <button
                type="button"
                onClick={() => {
                  setSessionSummary(null);
                  setActiveTab('stats');
                }}
                className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg whitespace-nowrap"
              >
                Lihat Statistik
              </button>
            </div>
          </div>

          {sessionSummary.newlyUnlocked.length > 0 && (
            <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 space-y-1.5">
              <div className="text-xs font-bold text-amber-950 flex items-center gap-1.5">
                <Award className="w-4 h-4 text-amber-700" />
                Pencapaian Baru Terbuka!
              </div>
              {sessionSummary.newlyUnlocked.map((ach) => (
                <div key={ach.id} className="text-xs text-amber-900">
                  <strong>{ach.title}</strong> — {ach.description}
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* Active Game Container */}
      {activeGame && renderActiveGame()}

      {/* TAB: STATS */}
      {!activeGame && activeTab === 'stats' && (
        <ArcadeStatsView
          history={history}
          dailyCompletions={dailyCompletions}
          exploration={exploration}
          learningPaths={learningPaths}
        />
      )}

      {/* TAB: ARENA (FREE PLAY) */}
      {!activeGame && activeTab === 'arena' && (
        <div className="space-y-6">
          {/* Framework & Difficulty Selector */}
          <section className="dreamy-surface border border-slate-200/80 rounded-2xl p-5 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-sm font-display font-bold text-slate-900">
                  1. Pilih Kerangka & Tingkat Kesulitan
                </h2>
                <p className="text-xs text-slate-600">
                  Pilih satu kerangka fokus (termasuk MBTI, SLOAN &amp; Temperamen), kombinasikan beberapa kerangka, atau gunakan mode Campuran.
                </p>
              </div>
              <div className="flex items-center gap-1.5">
                {(
                  [
                    { id: 'dasar', label: 'Pemula (Dasar)' },
                    { id: 'menengah', label: 'Menengah' },
                    { id: 'lanjutan', label: 'Lanjutan' },
                  ] as { id: ArcadeDifficulty; label: string }[]
                ).map((d) => (
                  <button
                    key={d.id}
                    type="button"
                    onClick={() => setDifficulty(d.id)}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg border whitespace-nowrap ${
                      difficulty === d.id
                        ? 'bg-indigo-700 text-white border-indigo-700'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {d.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {ARCADE_FRAMEWORK_META.map((fw) => {
                const active = selectedFrameworks.includes(fw.id);
                return (
                  <button
                    key={fw.id}
                    type="button"
                    onClick={() => toggleFrameworkSelection(fw.id)}
                    title={fw.shortDesc}
                    className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors ${
                      active
                        ? 'bg-[#151D40] text-white border-[#151D40]'
                        : 'bg-white text-slate-700 border-slate-200 hover:border-indigo-300'
                    }`}
                  >
                    {fw.label}
                  </button>
                );
              })}
            </div>
          </section>

          {/* 12 Mini-Games Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 dm-stagger">
            {ARCADE_GAME_CATALOG.map((game) => {
              const edu = ARCADE_GAME_EDUCATION[game.id];
              return (
                <div
                  key={game.id}
                  className="dreamy-surface dm-interactive-card border border-slate-200/80 rounded-2xl p-5 flex flex-col justify-between gap-4 hover:border-indigo-300/80 transition-colors"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-[11px] font-medium text-indigo-700">
                      <span>{game.mechanicLabel}</span>
                      <span>{game.supportedFrameworks.includes('Campuran') ? 'Multi-Kerangka' : `${game.supportedFrameworks.length} Kerangka`}</span>
                    </div>
                    <h3 className="text-base font-display font-bold text-slate-900">
                      {game.title}
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed">{game.description}</p>
                  </div>

                  <div className="pt-3 border-t border-slate-200/70 flex items-center justify-between gap-2">
                    {onNavigate && edu ? (
                      <button
                        type="button"
                        onClick={() =>
                          onNavigate(edu.learnMoreSection, { theoryTab: edu.recommendedTheoryTab })
                        }
                        className="text-[11px] font-semibold text-indigo-700 hover:underline truncate"
                      >
                        Pelajari Teori →
                      </button>
                    ) : (
                      <span className="text-[11px] text-slate-500 truncate">
                        {game.supportedFrameworks.slice(0, 3).join(' · ')}
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => startMiniGame(game.id)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-indigo-700 hover:bg-indigo-800 rounded-lg shrink-0"
                    >
                      <Play className="w-3.5 h-3.5" />
                      Mainkan
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB: DAILY CHALLENGE */}
      {!activeGame && activeTab === 'daily' && (
        <section className="dreamy-surface border border-slate-200/80 rounded-2xl p-6 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="space-y-1.5">
              <div className="text-xs font-semibold text-indigo-700">
                Tanggal Rotasi: {dailyChallenge.dateKey}
              </div>
              <h2 className="text-xl font-display font-bold text-slate-900">
                {dailyChallenge.title}
              </h2>
              <p className="text-xs text-slate-600">{dailyChallenge.subtitle}</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="px-4 py-2.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-950 tabular-nums">
                Rekor Terpanjang: <strong>{streaks.longest} hari</strong>
              </div>
              <button
                type="button"
                onClick={() =>
                  startMiniGame(dailyChallenge.gameId, {
                    mode: 'daily',
                    frameworks: [dailyChallenge.framework],
                    difficulty: dailyChallenge.difficulty,
                    dailyDateKey: dailyChallenge.dateKey,
                  })
                }
                className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-[#151D40] hover:bg-[#233070] rounded-xl whitespace-nowrap"
              >
                <Zap className="w-4 h-4 text-[#E6C77E]" />
                {isDailyDoneToday ? 'Main Ulang Tantangan Hari Ini' : 'Mulai Tantangan Harian'}
              </button>
            </div>
          </div>

          {isDailyDoneToday && (
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-700" />
              Tantangan harian hari ini sudah diselesaikan dengan skor{' '}
              <strong className="tabular-nums">{dailyCompletions[todayKey].score}</strong>! Anda tetap bisa bermain ulang untuk berlatih.
            </div>
          )}
        </section>
      )}

      {/* TAB: CAMPAIGN */}
      {!activeGame && activeTab === 'campaign' && (
        <section className="space-y-4">
          <div className="dreamy-surface border border-slate-200/80 rounded-2xl p-5">
            <h2 className="text-base font-display font-bold text-slate-900">
              Campaign Progresif 6 Tingkat
            </h2>
            <p className="text-xs text-slate-600 mt-1">
              Selesaikan tiap tingkat untuk membuka tingkat berikutnya—mulai dari dasar Socionics hingga Observatorium Escape Room.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {CAMPAIGN_LEVELS.map((lvl, idx) => {
              const completedLvl = history.some((h) => h.completed && h.campaignLevel === lvl.level);
              const prevDone =
                idx === 0 || history.some((h) => h.completed && h.campaignLevel === CAMPAIGN_LEVELS[idx - 1].level);
              return (
                <div
                  key={lvl.level}
                  className={`dreamy-surface border rounded-2xl p-5 flex items-center justify-between gap-4 ${
                    completedLvl
                      ? 'border-emerald-300 bg-emerald-50/30'
                      : prevDone
                      ? 'border-slate-200/80'
                      : 'border-slate-200/60 opacity-75'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="text-[11px] font-semibold text-indigo-700 capitalize">
                      Kesulitan {lvl.difficulty} · {lvl.frameworks.join(', ')}
                    </div>
                    <h3 className="text-sm font-display font-bold text-slate-900">{lvl.title}</h3>
                    <p className="text-xs text-slate-600">{lvl.subtitle}</p>
                  </div>
                  <button
                    type="button"
                    disabled={!prevDone}
                    onClick={() =>
                      startMiniGame(lvl.gameId, {
                        mode: 'campaign',
                        frameworks: lvl.frameworks,
                        difficulty: lvl.difficulty,
                        campaignLevel: lvl.level,
                      })
                    }
                    className={`inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg shrink-0 ${
                      !prevDone
                        ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                        : completedLvl
                        ? 'bg-emerald-700 text-white hover:bg-emerald-800'
                        : 'bg-indigo-700 text-white hover:bg-indigo-800'
                    }`}
                  >
                    {!prevDone ? <Lock className="w-3.5 h-3.5" /> : <Target className="w-3.5 h-3.5" />}
                    {completedLvl ? 'Ulangi' : prevDone ? 'Mulai' : 'Terkunci'}
                  </button>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* TAB: RANDOM CHALLENGE */}
      {!activeGame && activeTab === 'random' && (
        <section className="dreamy-surface border border-slate-200/80 rounded-2xl p-6 text-center space-y-4">
          <Compass className="w-9 h-9 text-indigo-700 mx-auto" />
          <h2 className="text-lg font-display font-bold text-slate-900">
            Generator Tantangan Acak Lintas Kerangka
          </h2>
          <p className="text-xs text-slate-600 max-w-lg mx-auto">
            Biarkan sistem memilih mini-game dan kombinasi kerangka secara spontan untuk menguji kelenturan pemahaman Anda.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <button
              type="button"
              onClick={() => {
                const pick = ARCADE_GAME_CATALOG[Math.floor(Math.random() * ARCADE_GAME_CATALOG.length)];
                startMiniGame(pick.id, {
                  mode: 'random',
                  frameworks: ['Campuran'],
                  difficulty,
                });
              }}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-indigo-700 hover:bg-indigo-800 rounded-xl"
            >
              <Shuffle className="w-4 h-4" />
              Luncurkan Mini-Game Acak
            </button>
            <button
              type="button"
              onClick={() =>
                startMiniGame('wheel', {
                  mode: 'random',
                  frameworks: ['Campuran'],
                  difficulty,
                })
              }
              className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-slate-800 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl"
            >
              Putar Typology Wheel
            </button>
          </div>
        </section>
      )}
    </div>
  );
};
