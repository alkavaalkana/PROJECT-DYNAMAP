import test from 'node:test';
import assert from 'node:assert/strict';
import { computeKnowledgeMastery } from './masteryEngine';
import type { UserExplorationData } from '../types/dynamap';

test('computeKnowledgeMastery tracks reading vs demonstrated quiz/case mastery accurately', () => {
  const sampleExploration: UserExplorationData = {
    ownerAccountId: 'acc-1',
    conceptStatuses: {},
    unresolvedQuestions: [],
    savedComparisons: [],
    completedLearningSteps: [],
    bookmarkedLearningSteps: [],
    scenarioReflections: [],
    userSubjects: [],
    specializationLabel: 'Umum',
    interestTopics: [],
    problemSolvingPreference: 'Seimbang',
    theoryVsPracticePreference: 'Seimbang',
    workMotivationTags: [],
    preferredMapLayout: {},
    roadmaps: [],
    readTheoryTopics: [
      'theory-mbti-history',
      'theory-mbti-dichotomies',
      'theory-mbti-positions',
      'theory-mbti-stacks',
      'theory-sloan-bigfive',
    ],
    arcadeHistory: [
      {
        id: 'arc-1',
        gameId: 'blitz',
        mode: 'free-play',
        frameworks: ['MBTI'],
        difficulty: 'menengah',
        score: 90,
        maxScore: 100,
        correctCount: 9,
        totalQuestions: 10,
        durationSeconds: 45,
        completed: true,
        playedAt: '2026-11-20T10:00:00Z',
      },
      {
        id: 'arc-2',
        gameId: 'mistype-hunter',
        mode: 'free-play',
        frameworks: ['MBTI'],
        difficulty: 'lanjutan',
        score: 85,
        maxScore: 100,
        correctCount: 8,
        totalQuestions: 10,
        durationSeconds: 60,
        completed: true,
        playedAt: '2026-11-21T10:00:00Z',
      },
    ],
    savedCaseStudies: [],
    updatedAt: '2026-11-21T10:00:00Z',
  };

  const result = computeKnowledgeMastery(sampleExploration, []);
  const mbtiSummary = result.summaries.find((s) => s.framework === 'MBTI')!;
  const sloanSummary = result.summaries.find((s) => s.framework === 'SLOAN')!;
  const psySummary = result.summaries.find((s) => s.framework === 'Psychosophy')!;

  assert.equal(mbtiSummary.readingProgressPct, 100);
  assert.equal(mbtiSummary.quizAccuracy, 85);
  assert.equal(mbtiSummary.masteryLevel, 'Penguasaan Lanjut');

  // Read some SLOAN theory, 0 quizzes -> demonstrated mastery remains 0
  assert.ok(sloanSummary.readingProgressPct > 0);
  assert.equal(sloanSummary.demonstratedMasteryPct, 0);
  assert.equal(sloanSummary.masteryLevel, 'Pengenalan');

  assert.equal(psySummary.masteryLevel, 'Belum Mulai');
  assert.equal(result.timeline.length, 2);
});
