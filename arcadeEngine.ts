import { ALL_24_PSYCHOSOPHY_TYPES, PSYCHOSOPHY_ASPECTS, PSYCHOSOPHY_POSITIONS } from '../data/psychosophyData';
import { ENNEAGRAM_TYPES, INSTINCT_STACKINGS, INSTINCT_VARIANTS } from '../data/enneagramData';
import { INFORMATION_ELEMENTS, QUADRAS, SOCIONICS_TYPES } from '../data/socionicsData';
import {
  ALL_16_MBTI_PROFILES,
  CLASSICAL_4_TEMPERAMENTS,
  MIXED_6_TEMPERAMENTS,
} from '../data/extendedTheoryData';
import {
  ARCADE_GAME_CATALOG,
  CIPHER_PUZZLES,
  CURATED_BLITZ_QUESTIONS,
  DETECTIVE_MYSTERIES,
  MBTI_TYPE_STACKS,
  MISTYPE_CHALLENGES,
  SCENARIO_LENS_ITEMS,
  SLOAN_DIMENSIONS,
  type BlitzQuestion,
} from '../data/arcadeAndCaseData';
import type {
  ArcadeDifficulty,
  ArcadeFramework,
  ArcadeGameId,
  ArcadeSessionRecord,
  QuadraName,
  SocionicsCode,
} from '../types/dynamap';

export interface AchievementDefinition {
  id: string;
  title: string;
  description: string;
  category: 'Permainan' | 'Penguasaan' | 'Konsistensi' | 'Eksplorasi';
  target: number;
  evaluate: (
    history: ArcadeSessionRecord[],
    dailyCompletions: Record<string, { score: number; completedAt: string }>
  ) => number;
}

export interface EvaluatedAchievement extends AchievementDefinition {
  progress: number;
  unlocked: boolean;
  percent: number;
}

export const ARCADE_ACHIEVEMENTS: AchievementDefinition[] = [
  {
    id: 'ach-first-game',
    title: 'Langkah Pertama',
    description: 'Menyelesaikan sesi mini-game pertama Anda di Typology Arcade.',
    category: 'Permainan',
    target: 1,
    evaluate: (history) => history.filter((h) => h.completed).length,
  },
  {
    id: 'ach-10-challenges',
    title: 'Penjelajah Tekun (10 Sesi)',
    description: 'Menyelesaikan minimal 10 tantangan mini-game tercatat.',
    category: 'Permainan',
    target: 10,
    evaluate: (history) => history.filter((h) => h.completed).length,
  },
  {
    id: 'ach-perfect-round',
    title: 'Akurasi Penuh',
    description: 'Menyelesaikan satu ronde penuh dengan 100% jawaban tepat (minimal 3 soal).',
    category: 'Penguasaan',
    target: 1,
    evaluate: (history) =>
      history.filter(
        (h) => h.completed && h.totalQuestions >= 3 && h.correctCount === h.totalQuestions
      ).length,
  },
  {
    id: 'ach-function-master',
    title: 'Ahli Susun Fungsi',
    description: 'Menyelesaikan minimal 2 tantangan Function Builder dengan skor minimal 75%.',
    category: 'Penguasaan',
    target: 2,
    evaluate: (history) =>
      history.filter(
        (h) =>
          h.completed &&
          h.gameId === 'function-builder' &&
          h.totalQuestions > 0 &&
          h.correctCount / h.totalQuestions >= 0.75
      ).length,
  },
  {
    id: 'ach-detective',
    title: 'Detektif Bukti',
    description: 'Menyelesaikan 2 kasus pada mini-game Typology Detective.',
    category: 'Penguasaan',
    target: 2,
    evaluate: (history) =>
      history.filter((h) => h.completed && h.gameId === 'detective').length,
  },
  {
    id: 'ach-puzzle-solver',
    title: 'Pemecah Sandi & Rekonstruksi',
    description: 'Menyelesaikan total 3 ronde Type Cipher, Type Reconstruction, atau Memory.',
    category: 'Permainan',
    target: 3,
    evaluate: (history) =>
      history.filter(
        (h) =>
          h.completed &&
          (h.gameId === 'type-cipher' ||
            h.gameId === 'reconstruction' ||
            h.gameId === 'memory')
      ).length,
  },
  {
    id: 'ach-framework-explorer',
    title: 'Penjelajah 4 Kerangka',
    description: 'Memainkan mini-game dengan minimal 4 kerangka teori berbeda.',
    category: 'Eksplorasi',
    target: 4,
    evaluate: (history) => {
      const set = new Set<string>();
      for (const h of history) {
        for (const fw of h.frameworks) {
          if (fw !== 'Campuran') set.add(fw);
        }
      }
      return set.size;
    },
  },
  {
    id: 'ach-multi-framework',
    title: 'Lintas Semua Kerangka',
    description: 'Menyelesaikan tantangan mode Campuran Lintas Kerangka sebanyak 2 kali.',
    category: 'Eksplorasi',
    target: 2,
    evaluate: (history) =>
      history.filter((h) => h.completed && h.frameworks.includes('Campuran')).length,
  },
  {
    id: 'ach-daily-streak',
    title: 'Jejak Harian (3 Hari)',
    description: 'Mencapai rekor beruntun Tantangan Harian selama 3 hari.',
    category: 'Konsistensi',
    target: 3,
    evaluate: (_history, dailyCompletions) => computeDailyStreaks(dailyCompletions).longest,
  },
  {
    id: 'ach-escape-room',
    title: 'Penakluk Observatorium',
    description: 'Menyelesaikan seluruh 5 ruang dalam Typology Escape Room.',
    category: 'Penguasaan',
    target: 1,
    evaluate: (history) =>
      history.filter((h) => h.completed && h.gameId === 'escape-room').length,
  },
  {
    id: 'ach-consecutive-wins',
    title: 'Rangkaian Kemenangan (3× Beruntun)',
    description: 'Mencapai 3 sesi selesai berturut-turut dengan akurasi minimal 70%.',
    category: 'Konsistensi',
    target: 3,
    evaluate: (history) => {
      const sorted = [...history]
        .filter((h) => h.completed)
        .sort((a, b) => a.playedAt.localeCompare(b.playedAt));
      let best = 0;
      let run = 0;
      for (const s of sorted) {
        const acc = s.totalQuestions > 0 ? s.correctCount / s.totalQuestions : 0;
        if (acc >= 0.7) {
          run++;
          best = Math.max(best, run);
        } else {
          run = 0;
        }
      }
      return best;
    },
  },
  {
    id: 'ach-theory-trifecta',
    title: 'Penjelajah MBTI, SLOAN & Temperamen',
    description: 'Menyelesaikan minimal satu sesi untuk masing-masing MBTI, SLOAN, dan Temperamen.',
    category: 'Eksplorasi',
    target: 3,
    evaluate: (history) => {
      const targets = ['MBTI', 'SLOAN', 'Temperament'];
      return targets.filter((fw) =>
        history.some((h) => h.completed && h.frameworks.includes(fw as ArcadeFramework))
      ).length;
    },
  },
  {
    id: 'ach-theory-master',
    title: 'Master Teori (Mode Lanjutan ≥ 80%)',
    description: 'Menyelesaikan 2 sesi tingkat kesulitan Lanjutan dengan akurasi minimal 80%.',
    category: 'Penguasaan',
    target: 2,
    evaluate: (history) =>
      history.filter(
        (h) =>
          h.completed &&
          h.difficulty === 'lanjutan' &&
          h.totalQuestions > 0 &&
          h.correctCount / h.totalQuestions >= 0.8
      ).length,
  },
];

export function evaluateAchievements(
  history: ArcadeSessionRecord[],
  dailyCompletions: Record<string, { score: number; completedAt: string }>
): EvaluatedAchievement[] {
  return ARCADE_ACHIEVEMENTS.map((ach) => {
    const raw = ach.evaluate(history, dailyCompletions);
    const progress = Math.min(raw, ach.target);
    const unlocked = raw >= ach.target;
    const percent = Math.round((progress / ach.target) * 100);
    return {
      ...ach,
      progress,
      unlocked,
      percent,
    };
  });
}

export function getTodayDateKey(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function computeDailyStreaks(
  dailyCompletions: Record<string, { score: number; completedAt: string }>
): { current: number; longest: number } {
  const keys = Object.keys(dailyCompletions).sort();
  if (keys.length === 0) return { current: 0, longest: 0 };

  const toDayNum = (dateStr: string) => {
    const [y, m, d] = dateStr.split('-').map(Number);
    return Math.floor(Date.UTC(y, m - 1, d) / 86400000);
  };

  let longest = 1;
  let run = 1;
  for (let i = 1; i < keys.length; i++) {
    if (toDayNum(keys[i]) - toDayNum(keys[i - 1]) === 1) {
      run++;
      longest = Math.max(longest, run);
    } else if (toDayNum(keys[i]) !== toDayNum(keys[i - 1])) {
      run = 1;
    }
  }

  const today = toDayNum(getTodayDateKey());
  const lastDay = toDayNum(keys[keys.length - 1]);
  let current = 0;
  if (today - lastDay <= 1) {
    current = 1;
    for (let i = keys.length - 2; i >= 0; i--) {
      if (toDayNum(keys[i + 1]) - toDayNum(keys[i]) === 1) {
        current++;
      } else {
        break;
      }
    }
  }

  return { current, longest };
}

export interface DailyChallengeSpec {
  dateKey: string;
  gameId: ArcadeGameId;
  framework: ArcadeFramework;
  difficulty: ArcadeDifficulty;
  title: string;
  subtitle: string;
}

export function getDailyArcadeChallenge(dateKey = getTodayDateKey()): DailyChallengeSpec {
  const hash = dateKey.split('').reduce((acc, ch) => acc * 31 + ch.charCodeAt(0), 7);
  const eligibleGames: ArcadeGameId[] = [
    'blitz',
    'match-up',
    'function-builder',
    'quadra-sort',
    'type-cipher',
    'reconstruction',
    'mistype-hunter',
    'scenario-lens',
  ];
  const frameworks: ArcadeFramework[] = [
    'Socionics',
    'Enneagram',
    'Psychosophy',
    'MBTI',
    'InstinctualStacking',
    'SLOAN',
    'Temperament',
    'Campuran',
  ];
  const gameId = eligibleGames[Math.abs(hash) % eligibleGames.length];
  const framework = frameworks[Math.abs(hash >> 2) % frameworks.length];
  const gameMeta = ARCADE_GAME_CATALOG.find((g) => g.id === gameId);
  return {
    dateKey,
    gameId,
    framework,
    difficulty: 'menengah',
    title: `Tantangan Harian · ${gameMeta?.title || 'Typology Arcade'}`,
    subtitle: `Fokus Kerangka: ${framework} · Kesulitan Menengah`,
  };
}

export interface ArcadeStatsFilters {
  dateRange: 'all' | '7d' | '30d';
  framework: 'all' | ArcadeFramework;
  gameId: 'all' | ArcadeGameId;
  difficulty: 'all' | ArcadeDifficulty;
}

export interface ComputedArcadeStats {
  totalGamesPlayed: number;
  gamesCompleted: number;
  totalQuestionsAnswered: number;
  totalCorrectAnswers: number;
  overallAccuracy: number;
  averageScore: number;
  bestScore: number;
  bestCompletionTimeSeconds: number | null;
  currentStreak: number;
  longestStreak: number;
  totalPlaytimeSeconds: number;
  activityTimeline: { dateLabel: string; count: number; avgScore: number }[];
  accuracyByFramework: { framework: string; accuracy: number; attempts: number }[];
  performanceByGame: { gameTitle: string; gameId: string; avgScore: number; completionRate: number; count: number }[];
  progressOverTime: { index: number; label: string; scorePercent: number; accuracy: number }[];
  frameworkExploration: { framework: string; count: number }[];
  difficultyBreakdown: {
    difficulty: ArcadeDifficulty;
    label: string;
    attempts: number;
    accuracy: number;
    avgScore: number;
  }[];
}

export function computeArcadeStats(
  history: ArcadeSessionRecord[],
  dailyCompletions: Record<string, { score: number; completedAt: string }>,
  filters: ArcadeStatsFilters
): ComputedArcadeStats {
  const now = Date.now();
  const cutoffMs =
    filters.dateRange === '7d'
      ? now - 7 * 86400000
      : filters.dateRange === '30d'
      ? now - 30 * 86400000
      : 0;

  const filtered = history.filter((item) => {
    if (cutoffMs > 0 && new Date(item.playedAt).getTime() < cutoffMs) return false;
    if (filters.framework !== 'all' && !item.frameworks.includes(filters.framework)) return false;
    if (filters.gameId !== 'all' && item.gameId !== filters.gameId) return false;
    if (filters.difficulty !== 'all' && item.difficulty !== filters.difficulty) return false;
    return true;
  });

  const totalGamesPlayed = filtered.length;
  const completedList = filtered.filter((h) => h.completed);
  const gamesCompleted = completedList.length;
  const totalQuestionsAnswered = filtered.reduce((sum, h) => sum + (h.totalQuestions || 0), 0);
  const totalCorrectAnswers = filtered.reduce((sum, h) => sum + (h.correctCount || 0), 0);
  const overallAccuracy =
    totalQuestionsAnswered > 0
      ? Math.round((totalCorrectAnswers / totalQuestionsAnswered) * 100)
      : 0;

  const averageScore =
    totalGamesPlayed > 0
      ? Math.round(filtered.reduce((sum, h) => sum + h.score, 0) / totalGamesPlayed)
      : 0;
  const bestScore =
    totalGamesPlayed > 0 ? Math.max(...filtered.map((h) => h.score)) : 0;

  const completedWithTime = completedList.filter((h) => h.durationSeconds > 0);
  const bestCompletionTimeSeconds =
    completedWithTime.length > 0
      ? Math.min(...completedWithTime.map((h) => h.durationSeconds))
      : null;

  const totalPlaytimeSeconds = filtered.reduce((sum, h) => sum + (h.durationSeconds || 0), 0);
  const streaks = computeDailyStreaks(dailyCompletions);

  // 1. Gameplay activity timeline by date
  const dayMap = new Map<string, { count: number; totalScore: number }>();
  for (const h of filtered) {
    const dayKey = h.playedAt.slice(0, 10);
    const cur = dayMap.get(dayKey) || { count: 0, totalScore: 0 };
    cur.count += 1;
    cur.totalScore += h.score;
    dayMap.set(dayKey, cur);
  }
  const activityTimeline = Array.from(dayMap.entries())
    .sort((a, b) => a[0].localeCompare(b[0]))
    .slice(-14)
    .map(([day, val]) => ({
      dateLabel: day.slice(5),
      count: val.count,
      avgScore: Math.round(val.totalScore / val.count),
    }));

  // 2. Accuracy & Exploration by framework
  const fwMap = new Map<string, { correct: number; total: number; count: number }>();
  for (const h of filtered) {
    for (const fw of h.frameworks) {
      const cur = fwMap.get(fw) || { correct: 0, total: 0, count: 0 };
      cur.correct += h.correctCount;
      cur.total += h.totalQuestions;
      cur.count += 1;
      fwMap.set(fw, cur);
    }
  }
  const accuracyByFramework = Array.from(fwMap.entries())
    .map(([framework, v]) => ({
      framework,
      accuracy: v.total > 0 ? Math.round((v.correct / v.total) * 100) : 0,
      attempts: v.count,
    }))
    .sort((a, b) => b.accuracy - a.accuracy);

  const frameworkExploration = Array.from(fwMap.entries())
    .map(([framework, v]) => ({ framework, count: v.count }))
    .sort((a, b) => b.count - a.count);

  // 3. Performance by game
  const gameMap = new Map<string, { totalScore: number; completed: number; count: number }>();
  for (const h of filtered) {
    const cur = gameMap.get(h.gameId) || { totalScore: 0, completed: 0, count: 0 };
    cur.totalScore += h.score;
    cur.completed += h.completed ? 1 : 0;
    cur.count += 1;
    gameMap.set(h.gameId, cur);
  }
  const performanceByGame = Array.from(gameMap.entries())
    .map(([gameId, v]) => {
      const meta = ARCADE_GAME_CATALOG.find((g) => g.id === gameId);
      return {
        gameId,
        gameTitle: meta?.title || gameId,
        avgScore: Math.round(v.totalScore / v.count),
        completionRate: Math.round((v.completed / v.count) * 100),
        count: v.count,
      };
    })
    .sort((a, b) => b.avgScore - a.avgScore);

  // 4. Progress over time (last 12 chronological sessions)
  const chronological = [...filtered]
    .sort((a, b) => a.playedAt.localeCompare(b.playedAt))
    .slice(-12);
  const progressOverTime = chronological.map((h, i) => ({
    index: i + 1,
    label: `#${i + 1}`,
    scorePercent: h.maxScore > 0 ? Math.min(100, Math.round((h.score / h.maxScore) * 100)) : 0,
    accuracy: h.totalQuestions > 0 ? Math.round((h.correctCount / h.totalQuestions) * 100) : 0,
  }));

  const diffLabels: Record<ArcadeDifficulty, string> = {
    dasar: 'Pemula (Dasar)',
    menengah: 'Menengah',
    lanjutan: 'Lanjutan',
  };
  const difficultyBreakdown = (['dasar', 'menengah', 'lanjutan'] as ArcadeDifficulty[]).map((diff) => {
    const subset = filtered.filter((h) => h.difficulty === diff);
    const qTot = subset.reduce((s, h) => s + (h.totalQuestions || 0), 0);
    const cTot = subset.reduce((s, h) => s + (h.correctCount || 0), 0);
    const scTot = subset.reduce((s, h) => s + (h.score || 0), 0);
    return {
      difficulty: diff,
      label: diffLabels[diff],
      attempts: subset.length,
      accuracy: qTot > 0 ? Math.round((cTot / qTot) * 100) : 0,
      avgScore: subset.length > 0 ? Math.round(scTot / subset.length) : 0,
    };
  });

  return {
    totalGamesPlayed,
    gamesCompleted,
    totalQuestionsAnswered,
    totalCorrectAnswers,
    overallAccuracy,
    averageScore,
    bestScore,
    bestCompletionTimeSeconds,
    currentStreak: streaks.current,
    longestStreak: streaks.longest,
    totalPlaytimeSeconds,
    activityTimeline,
    accuracyByFramework,
    performanceByGame,
    progressOverTime,
    frameworkExploration,
    difficultyBreakdown,
  };
}

/**
 * Dynamic challenge generators reading directly from DYNAMAP's existing datasets.
 */
export function buildDynamicBlitzPool(
  selectedFrameworks: ArcadeFramework[],
  difficulty: ArcadeDifficulty | 'all'
): BlitzQuestion[] {
  const dynamicQuestions: BlitzQuestion[] = [];

  // Auto-generate from SOCIONICS_TYPES
  (Object.keys(SOCIONICS_TYPES) as SocionicsCode[]).slice(0, 8).forEach((code) => {
    const spec = SOCIONICS_TYPES[code];
    const quadraOptions: QuadraName[] = ['Alpha', 'Beta', 'Gamma', 'Delta'];
    dynamicQuestions.push({
      id: `dyn-soc-q-${code}`,
      framework: 'Socionics',
      difficulty: 'dasar',
      question: `Tipe Socionics ${code} (${spec.indonesianTitle}) termasuk ke dalam Quadra manakah?`,
      options: quadraOptions,
      correctIndex: quadraOptions.indexOf(spec.quadra),
      explanation: `${code} memiliki Blok Ego ${spec.modelA[0]} + ${spec.modelA[1]} dan berada di Quadra ${spec.quadra}.`,
    });
  });

  // Auto-generate from PSYCHOSOPHY types
  ALL_24_PSYCHOSOPHY_TYPES.slice(0, 6).forEach((pt) => {
    const aspect1 = pt.order[0];
    const aspect3 = pt.order[2];
    const opts = [
      `1${aspect1} (Confident) & 3${aspect3} (Insecure)`,
      `1${pt.order[3]} (Confident) & 3${aspect1} (Insecure)`,
      `2${aspect1} (Flexible) & 4${aspect3} (Unbothered)`,
      `1${aspect3} (Confident) & 2${pt.order[1]} (Flexible)`,
    ];
    dynamicQuestions.push({
      id: `dyn-psy-${pt.code}`,
      framework: 'Psychosophy',
      difficulty: 'menengah',
      question: `Pada kode Psikosofi ${pt.code} (“${pt.afanasyevNickname}”), pasangan posisi 1 dan posisi 3-nya adalah:`,
      options: opts,
      correctIndex: 0,
      explanation: `Dalam urutan ${pt.code}, posisi ke-1 adalah ${PSYCHOSOPHY_ASPECTS[aspect1].englishName} (1${aspect1}) dan posisi ke-3 adalah ${PSYCHOSOPHY_ASPECTS[aspect3].englishName} (3${aspect3}).`,
    });
  });

  // Auto-generate from MBTI_TYPE_STACKS
  Object.values(MBTI_TYPE_STACKS).slice(0, 6).forEach((m) => {
    const wrong1 = `${m.stack[2]} – ${m.stack[3]} – ${m.stack[0]} – ${m.stack[1]}`;
    const wrong2 = `${m.shadow[0]} – ${m.shadow[1]} – ${m.shadow[2]} – ${m.shadow[3]}`;
    const wrong3 = `${m.stack[1]} – ${m.stack[0]} – ${m.stack[3]} – ${m.stack[2]}`;
    const right = m.stack.join(' – ');
    dynamicQuestions.push({
      id: `dyn-mbti-${m.code}`,
      framework: 'MBTI',
      difficulty: 'menengah',
      question: `Manakah urutan 4 fungsi sadar (Dominan–Inferior) untuk tipe MBTI ${m.code}?`,
      options: [right, wrong1, wrong2, wrong3],
      correctIndex: 0,
      explanation: `${m.code}: ${m.summary}`,
    });
  });

  // Auto-generate from ENNEAGRAM_TYPES
  ([1, 2, 3, 4, 5, 6, 7, 8, 9] as const).forEach((num) => {
    const spec = ENNEAGRAM_TYPES[num];
    const centers: ('Heart' | 'Head' | 'Gut')[] = ['Heart', 'Head', 'Gut'];
    dynamicQuestions.push({
      id: `dyn-enn-${num}`,
      framework: 'Enneagram',
      difficulty: 'dasar',
      question: `Enneagram Tipe ${num} (${spec.name.split('—')[1]?.trim() || ''}) berada pada pusat kecerdasan (Center) mana?`,
      options: centers,
      correctIndex: centers.indexOf(spec.center),
      explanation: `Tipe ${num} berada pada ${spec.center} Center dengan arah pertumbuhan ke Tipe ${spec.growthDirection.target}.`,
    });
  });

  // Auto-generate from CLASSICAL_4_TEMPERAMENTS & MIXED_6_TEMPERAMENTS
  CLASSICAL_4_TEMPERAMENTS.forEach((tp) => {
    const names = CLASSICAL_4_TEMPERAMENTS.map((x) => x.indoName);
    dynamicQuestions.push({
      id: `dyn-temp-${tp.id}`,
      framework: 'Temperament',
      difficulty: 'dasar',
      question: `Temperamen klasik mana yang dalam pemetaan Eysenck & ciri perilaku bercirikan "${tp.eysenckMapping}" serta "${tp.coreTraits[0]}"?`,
      options: names,
      correctIndex: names.indexOf(tp.indoName),
      explanation: `${tp.indoName} (${tp.name}): ${tp.learningCommunicationStyle}`,
    });
  });

  MIXED_6_TEMPERAMENTS.slice(0, 4).forEach((mix) => {
    const wrong1 = MIXED_6_TEMPERAMENTS.find((m) => m.id !== mix.id)?.title || 'Melankolis-Plegmatis';
    const wrong2 = 'Hanya berlaku di zaman Yunani Kuno';
    const wrong3 = 'Tidak mengenal sifat primer dan sekunder';
    dynamicQuestions.push({
      id: `dyn-tmix-${mix.id}`,
      framework: 'Temperament',
      difficulty: 'menengah',
      question: `Campuran temperamen mana yang tepat menggambarkan kombinasi utama "${mix.primary}" dengan penunjang "${mix.secondary}" (${mix.dynamicBalance.slice(0, 70)}...)?`,
      options: [mix.title, wrong1, wrong2, wrong3],
      correctIndex: 0,
      explanation: `${mix.title}: ${mix.dynamicBalance}`,
    });
  });

  // Auto-generate extra MBTI full-16 dichotomy-vs-stack questions
  ALL_16_MBTI_PROFILES.slice(0, 4).forEach((mp) => {
    dynamicQuestions.push({
      id: `dyn-mbti-role-${mp.code}`,
      framework: 'MBTI',
      difficulty: 'lanjutan',
      question: `Dalam model fungsi MBTI tipe ${mp.code} (${mp.roleTitle}), fungsi Inferior (ke-4) yang berfungsi sebagai area pertumbuhan bertahap adalah:`,
      options: [mp.grantStack[3], mp.grantStack[0], mp.grantStack[1], mp.grantStack[2]],
      correctIndex: 0,
      explanation: `${mp.code} memiliki susunan Dominan–Inferior: ${mp.grantStack.join(' – ')}. Fungsi ke-4 (${mp.grantStack[3]}) merupakan Inferior.`,
    });
  });

  const combined = [...CURATED_BLITZ_QUESTIONS, ...dynamicQuestions];
  const isMixed = selectedFrameworks.length === 0 || selectedFrameworks.includes('Campuran');

  const byFw = isMixed
    ? combined
    : combined.filter((q) => selectedFrameworks.includes(q.framework));

  const byDiff =
    difficulty === 'all' ? byFw : byFw.filter((q) => q.difficulty === difficulty);

  const pool = byDiff.length >= 3 ? byDiff : byFw.length > 0 ? byFw : combined;
  return [...pool].sort(() => Math.random() - 0.5);
}

export interface MatchPairItem {
  id: string;
  left: string;
  right: string;
  framework: ArcadeFramework;
}

export function buildMatchUpPairs(selectedFrameworks: ArcadeFramework[]): MatchPairItem[] {
  const allPairs: MatchPairItem[] = [
    ...(['Te', 'Ti', 'Fe', 'Fi', 'Se', 'Si', 'Ne', 'Ni'] as const).map((el) => ({
      id: `el-${el}`,
      left: `${el} (${INFORMATION_ELEMENTS[el].name})`,
      right: INFORMATION_ELEMENTS[el].dichotomy,
      framework: 'Socionics' as ArcadeFramework,
    })),
    { id: 'q-alpha', left: 'Quadra Alpha', right: 'Ne · Ti · Fe · Si', framework: 'Socionics' },
    { id: 'q-beta', left: 'Quadra Beta', right: 'Se · Ti · Fe · Ni', framework: 'Socionics' },
    { id: 'q-gamma', left: 'Quadra Gamma', right: 'Se · Fi · Te · Ni', framework: 'Socionics' },
    { id: 'q-delta', left: 'Quadra Delta', right: 'Ne · Fi · Te · Si', framework: 'Socionics' },
    { id: 'ins-sp', left: 'SP (Self-Preservation)', right: INSTINCT_VARIANTS.SP.themes[0], framework: 'Instincts' },
    { id: 'ins-so', left: 'SO (Social)', right: INSTINCT_VARIANTS.SO.themes[0], framework: 'Instincts' },
    { id: 'ins-sx', left: 'SX (One-to-One)', right: INSTINCT_VARIANTS.SX.themes[1], framework: 'Instincts' },
    { id: 'psy-1', left: 'Posisi 1 (Psikosofi)', right: PSYCHOSOPHY_POSITIONS[1].orientationDichotomies, framework: 'Psychosophy' },
    { id: 'psy-2', left: 'Posisi 2 (Psikosofi)', right: PSYCHOSOPHY_POSITIONS[2].orientationDichotomies, framework: 'Psychosophy' },
    { id: 'psy-3', left: 'Posisi 3 (Psikosofi)', right: PSYCHOSOPHY_POSITIONS[3].orientationDichotomies, framework: 'Psychosophy' },
    { id: 'psy-4', left: 'Posisi 4 (Psikosofi)', right: PSYCHOSOPHY_POSITIONS[4].orientationDichotomies, framework: 'Psychosophy' },
    ...SLOAN_DIMENSIONS.map((s) => ({
      id: `sloan-${s.id}`,
      left: `${s.highCode} vs ${s.lowCode} (SLOAN)`,
      right: s.bigFiveDimension,
      framework: 'SLOAN' as ArcadeFramework,
    })),
    {
      id: 'sloan-ext-bracket',
      left: 'Notasi [X] pada SLOAN Lanjutan',
      right: 'Trait paling dominan/utama dalam konvensi komunitas',
      framework: 'SLOAN',
    },
    { id: 'mbti-intj', left: 'MBTI INTJ', right: 'Ni – Te – Fi – Se', framework: 'MBTI' },
    { id: 'mbti-entp', left: 'MBTI ENTP', right: 'Ne – Ti – Fe – Si', framework: 'MBTI' },
    { id: 'mbti-infp', left: 'MBTI INFP', right: 'Fi – Ne – Si – Te', framework: 'MBTI' },
    { id: 'mbti-esfj', left: 'MBTI ESFJ', right: 'Fe – Si – Ne – Ti', framework: 'MBTI' },
    { id: 'enn-3', left: 'Enneagram Tipe 3', right: ENNEAGRAM_TYPES[3].indonesianTitle, framework: 'Enneagram' },
    { id: 'enn-5', left: 'Enneagram Tipe 5', right: ENNEAGRAM_TYPES[5].indonesianTitle, framework: 'Enneagram' },
    { id: 'enn-9', left: 'Enneagram Tipe 9', right: ENNEAGRAM_TYPES[9].indonesianTitle, framework: 'Enneagram' },
    ...CLASSICAL_4_TEMPERAMENTS.map((tp) => ({
      id: `temp-${tp.id}`,
      left: `Temperamen ${tp.indoName}`,
      right: tp.eysenckMapping,
      framework: 'Temperament' as ArcadeFramework,
    })),
    {
      id: 'temp-goodness',
      left: 'Goodness of Fit (Thomas & Chess)',
      right: 'Keselarasan temperamen anak dengan dukungan lingkungan',
      framework: 'Temperament',
    },
  ];

  const isMixed = selectedFrameworks.length === 0 || selectedFrameworks.includes('Campuran');
  const filtered = isMixed
    ? allPairs
    : allPairs.filter((p) => selectedFrameworks.includes(p.framework));
  const pool = filtered.length >= 5 ? filtered : allPairs;
  return [...pool].sort(() => Math.random() - 0.5).slice(0, 6);
}

export function playArcadeTone(kind: 'success' | 'error' | 'unlock', muted: boolean) {
  if (muted || typeof window === 'undefined') return;
  try {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const now = ctx.currentTime;
    const notes =
      kind === 'unlock'
        ? [523.25, 659.25, 783.99]
        : kind === 'success'
        ? [587.33, 783.99]
        : [261.63, 220];

    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.08);
      gain.gain.setValueAtTime(0.06, now + idx * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.16);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + idx * 0.08);
      osc.stop(now + idx * 0.08 + 0.17);
    });
  } catch {
    // Ignore audio context blocks
  }
}

export {
  CIPHER_PUZZLES,
  DETECTIVE_MYSTERIES,
  INSTINCT_STACKINGS,
  MISTYPE_CHALLENGES,
  QUADRAS,
  SCENARIO_LENS_ITEMS,
};
