import type {
  ArcadeFramework,
  FrameworkMasterySummary,
  LearningPathDefinition,
  LearningTimelineItem,
  MasteryLevel,
  UserExplorationData,
} from '../types/dynamap';

export interface MasteryFrameworkMeta {
  framework: ArcadeFramework | 'Komunikasi & Kasus';
  topicIds: string[];
  pathId?: string;
}

export const MASTERY_FRAMEWORK_CATALOG: MasteryFrameworkMeta[] = [
  {
    framework: 'Socionics',
    topicIds: ['theory-socionics-elements', 'theory-socionics-modela', 'theory-socionics-quadra', 'theory-socionics-intertype'],
    pathId: 'path-socionics',
  },
  {
    framework: 'MBTI',
    topicIds: ['theory-mbti-history', 'theory-mbti-dichotomies', 'theory-mbti-positions', 'theory-mbti-stacks'],
  },
  {
    framework: 'Jungian',
    topicIds: ['theory-jungian-attitudes', 'theory-jungian-functions', 'theory-jungian-notation'],
  },
  {
    framework: 'Enneagram',
    topicIds: ['theory-enneagram-centers', 'theory-enneagram-types', 'theory-enneagram-wings-arrows'],
    pathId: 'path-enneagram',
  },
  {
    framework: 'Instincts',
    topicIds: ['theory-instinct-sp-so-sx', 'theory-instinct-stacking'],
  },
  {
    framework: 'Tritype',
    topicIds: ['theory-tritype-threefix', 'theory-tritype-conventions'],
  },
  {
    framework: 'Psychosophy',
    topicIds: ['theory-psy-aspects', 'theory-psy-positions', 'theory-psy-24types'],
    pathId: 'path-psikosofi',
  },
  {
    framework: 'SLOAN',
    topicIds: ['theory-sloan-bigfive', 'theory-sloan-32types', 'theory-sloan-extended'],
  },
  {
    framework: 'Temperament',
    topicIds: ['theory-temp-classical4', 'theory-temp-12blends', 'theory-temp-modern-models'],
  },
];

function computeMasteryLevel(readingPct: number, quizPct: number, attempts: number, caseCount: number): MasteryLevel {
  if (readingPct === 0 && attempts === 0 && caseCount === 0) return 'Belum Mulai';
  const combined = readingPct * 0.35 + quizPct * 0.55 + Math.min(100, caseCount * 25) * 0.1;
  if (attempts === 0 && readingPct < 40) return 'Pengenalan';
  if (combined >= 80 && attempts >= 2) return 'Penguasaan Lanjut';
  if (combined >= 60 && attempts >= 1) return 'Terampil';
  if (combined >= 30 || attempts >= 1 || readingPct >= 40) return 'Berkembang';
  return 'Pengenalan';
}

export function computeKnowledgeMastery(
  exploration: UserExplorationData | null | undefined,
  learningPaths: LearningPathDefinition[] = []
): {
  summaries: FrameworkMasterySummary[];
  timeline: LearningTimelineItem[];
  overallReadingPct: number;
  overallDemonstratedPct: number;
} {
  const readSet = new Set(exploration?.readTheoryTopics || []);
  const completedStepsSet = new Set(exploration?.completedLearningSteps || []);
  const arcadeHistory = exploration?.arcadeHistory || [];
  const caseStudies = exploration?.savedCaseStudies || [];
  const scenarioReflections = exploration?.scenarioReflections || [];

  const summaries: FrameworkMasterySummary[] = MASTERY_FRAMEWORK_CATALOG.map((meta) => {
    const topicsReadCount = meta.topicIds.filter((id) => readSet.has(id)).length;
    const topicsTotalCount = meta.topicIds.length;

    const pathObj = meta.pathId ? learningPaths.find((p) => p.id === meta.pathId) : undefined;
    const stepsTotalCount = pathObj ? pathObj.steps.length : 0;
    const stepsCompletedCount = pathObj
      ? pathObj.steps.filter((s) => completedStepsSet.has(s.id)).length
      : 0;

    const totalReadUnits = topicsTotalCount + stepsTotalCount;
    const doneReadUnits = topicsReadCount + stepsCompletedCount;
    const readingProgressPct = totalReadUnits > 0 ? Math.round((doneReadUnits / totalReadUnits) * 100) : 0;

    const relevantSessions = arcadeHistory.filter((s) =>
      s.frameworks.some((f) => {
        if (meta.framework === 'Instincts') return f === 'Instincts' || f === 'InstinctualStacking';
        return f === meta.framework || f === 'Campuran';
      })
    );

    const quizAttemptsCount = relevantSessions.length;
    const totalQ = relevantSessions.reduce((acc, s) => acc + (s.totalQuestions || 0), 0);
    const totalC = relevantSessions.reduce((acc, s) => acc + (s.correctCount || 0), 0);
    const quizAccuracy = totalQ > 0 ? Math.round((totalC / totalQ) * 100) : 0;

    const caseAttemptsCount = caseStudies.filter((cs) =>
      cs.selectedFrameworks.some((sf) => sf.toLowerCase().includes(meta.framework.toLowerCase()))
    ).length;

    const demonstratedMasteryPct =
      quizAttemptsCount === 0 && caseAttemptsCount === 0
        ? 0
        : Math.min(100, Math.round(quizAccuracy * 0.8 + Math.min(20, (quizAttemptsCount + caseAttemptsCount) * 5)));

    const masteryLevel = computeMasteryLevel(
      readingProgressPct,
      quizAccuracy,
      quizAttemptsCount,
      caseAttemptsCount
    );

    let reviewSuggestion = 'Mulai dengan membaca ringkasan teori dasar lalu coba 1 sesi latihan singkat.';
    if (masteryLevel === 'Penguasaan Lanjut') {
      reviewSuggestion = 'Pemahaman sudah sangat kuat; pertahankan ketelitian lewat studi kasus silang antar-kerangka.';
    } else if (masteryLevel === 'Terampil') {
      reviewSuggestion = 'Coba mode Pemburu Salah Tipe (Mistype Hunter) atau tingkat kesulitan Lanjutan untuk menajamkan batas konsep.';
    } else if (readingProgressPct >= 60 && quizAttemptsCount === 0) {
      reviewSuggestion = 'Materi teori sudah banyak dibaca—uji pemahaman nyata lewat kuis Typology Arcade agar tidak berhenti pada hafalan.';
    } else if (quizAttemptsCount > 0 && quizAccuracy < 65) {
      reviewSuggestion = 'Akurasi latihan masih di bawah 65%; tinjau kembali miskonsepsi umum kerangka ini sebelum lanjut.';
    } else if (masteryLevel !== 'Belum Mulai') {
      reviewSuggestion = 'Lanjutkan membaca topik yang tersisa lalu praktikkan dalam simulasi skenario kelas.';
    }

    return {
      framework: meta.framework,
      topicsReadCount,
      topicsTotalCount,
      stepsCompletedCount,
      stepsTotalCount,
      quizAttemptsCount,
      quizAccuracy,
      caseAttemptsCount,
      readingProgressPct,
      demonstratedMasteryPct,
      masteryLevel,
      reviewSuggestion,
    };
  });

  const timeline: LearningTimelineItem[] = [];
  for (const s of arcadeHistory) {
    timeline.push({
      id: `tl-arc-${s.id}`,
      kind: 'arcade',
      title: `Latihan ${s.gameId} (${s.difficulty})`,
      framework: s.frameworks.join(', '),
      detail: `Ketepatan ${s.correctCount}/${s.totalQuestions} (${s.totalQuestions > 0 ? Math.round((s.correctCount / s.totalQuestions) * 100) : 0}%)`,
      timestamp: s.playedAt,
    });
  }
  for (const cs of caseStudies) {
    timeline.push({
      id: `tl-case-${cs.id}`,
      kind: 'studi-kasus',
      title: cs.caseTitle,
      framework: cs.selectedFrameworks.join(', ') || 'Analisis Kasus',
      detail: `${cs.checkedEvidenceIds.length} bukti dipilih · ${cs.selectedInterpretationIds.length} hipotesis`,
      timestamp: cs.savedAt,
    });
  }
  for (const sr of scenarioReflections) {
    timeline.push({
      id: `tl-scen-${sr.id}`,
      kind: 'skenario',
      title: sr.scenarioTitle,
      framework: 'Simulasi Situasi',
      detail: `Pilihan: ${sr.selectedOptionLabel}`,
      timestamp: sr.savedAt,
    });
  }

  timeline.sort((a, b) => b.timestamp.localeCompare(a.timestamp));

  const overallReadingPct =
    summaries.length > 0
      ? Math.round(summaries.reduce((acc, s) => acc + s.readingProgressPct, 0) / summaries.length)
      : 0;
  const overallDemonstratedPct =
    summaries.length > 0
      ? Math.round(summaries.reduce((acc, s) => acc + s.demonstratedMasteryPct, 0) / summaries.length)
      : 0;

  return {
    summaries,
    timeline: timeline.slice(0, 30),
    overallReadingPct,
    overallDemonstratedPct,
  };
}
