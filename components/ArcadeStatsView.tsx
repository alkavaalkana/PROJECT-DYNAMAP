import React, { useMemo, useState } from 'react';
import {
  Award,
  BarChart3,
  Calendar,
  CheckCircle2,
  Clock,
  Compass,
  Filter,
  Flame,
  Gamepad2,
  Lock,
  Target,
  TrendingUp,
  Trophy,
} from 'lucide-react';
import { ARCADE_FRAMEWORK_META, ARCADE_GAME_CATALOG } from '../data/arcadeAndCaseData';
import { GUIDED_LEARNING_PATHS } from '../data/conceptsAndPathsData';
import {
  computeArcadeStats,
  evaluateAchievements,
  type ArcadeStatsFilters,
} from '../lib/arcadeEngine';
import { computeKnowledgeMastery } from '../lib/masteryEngine';
import { useCountUp } from '../hooks/useUiEnhancements';
import type {
  ArcadeDifficulty,
  ArcadeFramework,
  ArcadeGameId,
  ArcadeSessionRecord,
  LearningPathDefinition,
  UserExplorationData,
} from '../types/dynamap';

interface ArcadeStatsViewProps {
  history: ArcadeSessionRecord[];
  dailyCompletions: Record<string, { score: number; completedAt: string }>;
  exploration?: UserExplorationData | null;
  learningPaths?: LearningPathDefinition[];
  onResetLocalStats?: () => void;
}

const AnimatedCount: React.FC<{ value: number; suffix?: string }> = ({ value, suffix = '' }) => {
  const animated = useCountUp(value, 550);
  return (
    <>
      {animated}
      {suffix}
    </>
  );
};

function formatDuration(sec: number | null): string {
  if (sec === null || sec <= 0) return '-';
  if (sec < 60) return `${sec} dtk`;
  const mins = Math.floor(sec / 60);
  const rem = sec % 60;
  return `${mins}m ${rem}d`;
}

export const ArcadeStatsView: React.FC<ArcadeStatsViewProps> = ({
  history,
  dailyCompletions,
  exploration,
  learningPaths,
}) => {
  const [filters, setFilters] = useState<ArcadeStatsFilters>({
    dateRange: 'all',
    framework: 'all',
    gameId: 'all',
    difficulty: 'all',
  });

  const stats = useMemo(
    () => computeArcadeStats(history, dailyCompletions, filters),
    [history, dailyCompletions, filters]
  );

  const achievements = useMemo(
    () => evaluateAchievements(history, dailyCompletions),
    [history, dailyCompletions]
  );

  const effectiveExploration = useMemo<UserExplorationData | null>(() => {
    if (exploration) {
      return {
        ...exploration,
        arcadeHistory:
          exploration.arcadeHistory && exploration.arcadeHistory.length > 0
            ? exploration.arcadeHistory
            : history,
      };
    }
    if (history.length === 0) return null;
    return {
      ownerAccountId: 'guest',
      conceptStatuses: {},
      unresolvedQuestions: [],
      savedComparisons: [],
      completedLearningSteps: [],
      bookmarkedLearningSteps: [],
      scenarioReflections: [],
      userSubjects: [],
      specializationLabel: 'FISKIM MATONOMI',
      interestTopics: [],
      problemSolvingPreference: 'Seimbang',
      theoryVsPracticePreference: 'Seimbang',
      workMotivationTags: [],
      preferredMapLayout: {},
      roadmaps: [],
      arcadeHistory: history,
      updatedAt: '',
    };
  }, [exploration, history]);

  const mastery = useMemo(
    () => computeKnowledgeMastery(effectiveExploration, learningPaths || GUIDED_LEARNING_PATHS),
    [effectiveExploration, learningPaths]
  );

  const unlockedCount = achievements.filter((a) => a.unlocked).length;

  return (
    <div className="space-y-8">
      {/* Knowledge Mastery & Learning Progress Section */}
      <section className="atlas-sheet rounded-2xl p-6 space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 border-b border-slate-200 pb-4">
          <div>
            <div className="atlas-kicker">Kurikulum &amp; Penguasaan</div>
            <h2 className="text-xl font-display font-bold text-slate-900 mt-0.5">
              Progres Belajar &amp; Penguasaan Pengetahuan Lintas Kerangka
            </h2>
            <p className="text-xs text-slate-600 mt-1 max-w-3xl">
              DYNAMAP memisahkan <strong>progres bacaan materi</strong> dari <strong>penguasaan teruji lewat kuis &amp; studi kasus</strong> agar pemahaman konseptual tidak tertukar dengan sekadar membuka halaman.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3 shrink-0">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 min-w-[140px]">
              <div className="text-[11px] font-medium text-slate-500">Progres Bacaan</div>
              <div className="text-lg font-display font-bold text-slate-900 tabular-nums mt-0.5">
                {mastery.overallReadingPct}%
              </div>
              <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden mt-1.5">
                <div
                  className="h-full bg-indigo-600 rounded-full"
                  style={{ width: `${Math.max(3, mastery.overallReadingPct)}%` }}
                />
              </div>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 min-w-[140px]">
              <div className="text-[11px] font-medium text-slate-500">Penguasaan Teruji</div>
              <div className="text-lg font-display font-bold text-emerald-800 tabular-nums mt-0.5">
                {mastery.overallDemonstratedPct}%
              </div>
              <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden mt-1.5">
                <div
                  className="h-full bg-emerald-600 rounded-full"
                  style={{ width: `${Math.max(3, mastery.overallDemonstratedPct)}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-600">
                <th className="py-2.5 pr-3 font-semibold">Kerangka</th>
                <th className="py-2.5 px-3 font-semibold">Bacaan &amp; Jalur</th>
                <th className="py-2.5 px-3 font-semibold">Kuis Arcade</th>
                <th className="py-2.5 px-3 font-semibold">Studi Kasus</th>
                <th className="py-2.5 px-3 font-semibold">Level Penguasaan</th>
                <th className="py-2.5 pl-3 font-semibold">Rekomendasi Tindak Lanjut</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {mastery.summaries.map((item) => (
                <tr key={item.framework} className="align-top hover:bg-slate-50/70">
                  <td className="py-3 pr-3 font-semibold text-slate-900 whitespace-nowrap">
                    {item.framework}
                  </td>
                  <td className="py-3 px-3 tabular-nums text-slate-700 whitespace-nowrap">
                    <div>
                      Topik: {item.topicsReadCount}/{item.topicsTotalCount}
                    </div>
                    {item.stepsTotalCount > 0 && (
                      <div className="text-[11px] text-slate-500">
                        Jalur: {item.stepsCompletedCount}/{item.stepsTotalCount} langkah
                      </div>
                    )}
                  </td>
                  <td className="py-3 px-3 tabular-nums text-slate-700 whitespace-nowrap">
                    {item.quizAttemptsCount > 0
                      ? `${item.quizAccuracy}% (${item.quizAttemptsCount} sesi)`
                      : 'Belum ada sesi'}
                  </td>
                  <td className="py-3 px-3 tabular-nums text-slate-700 whitespace-nowrap">
                    {item.caseAttemptsCount} kasus
                  </td>
                  <td className="py-3 px-3 whitespace-nowrap">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[11px] font-semibold border ${
                        item.masteryLevel === 'Penguasaan Lanjut'
                          ? 'bg-emerald-50 text-emerald-900 border-emerald-200'
                          : item.masteryLevel === 'Terampil'
                          ? 'bg-indigo-50 text-indigo-900 border-indigo-200'
                          : item.masteryLevel === 'Berkembang'
                          ? 'bg-amber-50 text-amber-900 border-amber-200'
                          : 'bg-slate-50 text-slate-600 border-slate-200'
                      }`}
                    >
                      {item.masteryLevel}
                    </span>
                  </td>
                  <td className="py-3 pl-3 text-slate-600 leading-relaxed min-w-[220px]">
                    {item.reviewSuggestion}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {mastery.timeline.length > 0 && (
          <div className="pt-4 border-t border-slate-200 space-y-2.5">
            <div className="text-xs font-semibold text-slate-800">
              Linimasa Aktivitas Belajar Kronologis ({mastery.timeline.length} terbaru)
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5">
              {mastery.timeline.slice(0, 6).map((tl) => (
                <div
                  key={tl.id}
                  className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs space-y-1"
                >
                  <div className="flex items-center justify-between gap-2 text-[11px] text-indigo-700 font-medium">
                    <span className="uppercase">{tl.kind}</span>
                    <span className="font-mono text-slate-500">
                      {new Date(tl.timestamp).toLocaleDateString('id-ID')}
                    </span>
                  </div>
                  <div className="font-semibold text-slate-900 truncate">{tl.title}</div>
                  <div className="text-slate-600">
                    {tl.framework} · {tl.detail}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Filters Bar */}
      <section className="dreamy-surface border border-slate-200/90 rounded-2xl p-5 sm:p-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-indigo-700" />
            <h2 className="text-lg font-display font-semibold text-slate-900">
              Statistik Aktivitas &amp; Progres Belajar
            </h2>
          </div>
          <span className="text-xs text-slate-500">
            Menampilkan {stats.totalGamesPlayed} dari {history.length} sesi tercatat
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div>
            <label htmlFor="stat-date" className="block text-[11px] font-medium text-slate-600 mb-1">
              Rentang Waktu
            </label>
            <select
              id="stat-date"
              value={filters.dateRange}
              onChange={(e) =>
                setFilters((f) => ({ ...f, dateRange: e.target.value as ArcadeStatsFilters['dateRange'] }))
              }
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white text-slate-800"
            >
              <option value="all">Semua Waktu</option>
              <option value="7d">7 Hari Terakhir</option>
              <option value="30d">30 Hari Terakhir</option>
            </select>
          </div>

          <div>
            <label htmlFor="stat-fw" className="block text-[11px] font-medium text-slate-600 mb-1">
              Kerangka Teori
            </label>
            <select
              id="stat-fw"
              value={filters.framework}
              onChange={(e) =>
                setFilters((f) => ({
                  ...f,
                  framework: e.target.value as 'all' | ArcadeFramework,
                }))
              }
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white text-slate-800"
            >
              <option value="all">Semua Kerangka</option>
              {ARCADE_FRAMEWORK_META.map((fw) => (
                <option key={fw.id} value={fw.id}>
                  {fw.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="stat-game" className="block text-[11px] font-medium text-slate-600 mb-1">
              Mini-Game
            </label>
            <select
              id="stat-game"
              value={filters.gameId}
              onChange={(e) =>
                setFilters((f) => ({ ...f, gameId: e.target.value as 'all' | ArcadeGameId }))
              }
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white text-slate-800"
            >
              <option value="all">Semua Mini-Game</option>
              {ARCADE_GAME_CATALOG.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.title}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="stat-diff" className="block text-[11px] font-medium text-slate-600 mb-1">
              Tingkat Kesulitan
            </label>
            <select
              id="stat-diff"
              value={filters.difficulty}
              onChange={(e) =>
                setFilters((f) => ({
                  ...f,
                  difficulty: e.target.value as 'all' | ArcadeDifficulty,
                }))
              }
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white text-slate-800"
            >
              <option value="all">Semua Tingkat</option>
              <option value="dasar">Pemula (Dasar)</option>
              <option value="menengah">Menengah</option>
              <option value="lanjutan">Lanjutan</option>
            </select>
          </div>
        </div>

        <p className="text-xs text-slate-500 border-t border-slate-200/80 pt-3">
          Catatan etika data: Seluruh metrik dihitung murni dari riwayat permainan Anda yang tercatat—tidak ada data buatan dan akurasi latihan tidak pernah menafsirkan kecerdasan ataupun tipe kepribadian seseorang.
        </p>
      </section>

      {/* Metrics Cards or Empty Notice */}
      {stats.totalGamesPlayed === 0 ? (
        <div className="dreamy-surface border border-slate-200/90 rounded-2xl p-8 text-center space-y-2.5">
          <Gamepad2 className="w-8 h-8 text-indigo-700 mx-auto" />
          <h3 className="text-base font-display font-semibold text-slate-900">
            Data Permainan Belum Tersedia
          </h3>
          <p className="text-sm text-slate-600 max-w-lg mx-auto">
            {history.length === 0
              ? 'Mainkan minimal satu ronde mini-game di Typology Arcade untuk mulai merekam akurasi, streak harian, dan grafik progres Anda.'
              : 'Tidak ada sesi permainan yang cocok dengan kombinasi filter yang dipilih. Ubah filter di atas untuk melihat data tercatat.'}
          </p>
        </div>
      ) : (
        <>
          <section className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
            {[
              { label: 'Total Permainan', content: <AnimatedCount value={stats.totalGamesPlayed} />, icon: Gamepad2 },
              { label: 'Sesi Tuntas', content: <AnimatedCount value={stats.gamesCompleted} />, icon: CheckCircle2 },
              {
                label: 'Jawaban Tepat',
                content: (
                  <>
                    <AnimatedCount value={stats.totalCorrectAnswers} />/{stats.totalQuestionsAnswered}
                  </>
                ),
                icon: Target,
              },
              { label: 'Akurasi Total', content: <AnimatedCount value={stats.overallAccuracy} suffix="%" />, icon: TrendingUp },
              { label: 'Skor Rata-Rata', content: <AnimatedCount value={stats.averageScore} />, icon: BarChart3 },
              { label: 'Skor Terbaik', content: <AnimatedCount value={stats.bestScore} />, icon: Trophy },
              {
                label: 'Waktu Tercepat',
                content: formatDuration(stats.bestCompletionTimeSeconds),
                icon: Clock,
              },
              { label: 'Streak Harian', content: <AnimatedCount value={stats.currentStreak} suffix=" hari" />, icon: Flame },
              { label: 'Streak Terpanjang', content: <AnimatedCount value={stats.longestStreak} suffix=" hari" />, icon: Calendar },
              {
                label: 'Total Durasi Main',
                content: formatDuration(stats.totalPlaytimeSeconds),
                icon: Clock,
              },
            ].map((kpi) => {
              const Icon = kpi.icon;
              return (
                <div
                  key={kpi.label}
                  className="dreamy-surface border border-slate-200/90 rounded-xl p-4 space-y-1.5 dm-interactive-card"
                >
                  <div className="flex items-center justify-between text-[11px] text-slate-500">
                    <span>{kpi.label}</span>
                    <Icon className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                  </div>
                  <div className="text-xl font-display font-bold text-slate-900 tabular-nums">
                    {kpi.content}
                  </div>
                </div>
              );
            })}
          </section>

          {/* 5 Interactive Visualizations */}
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* 1. Gameplay Activity Timeline */}
            <div className="lg:col-span-6 dreamy-surface border border-slate-200/90 rounded-2xl p-6 space-y-4">
              <div>
                <h3 className="text-base font-display font-semibold text-slate-900">
                  1. Aktivitas Bermain Harian
                </h3>
                <p className="text-xs text-slate-500">
                  Jumlah sesi yang diselesaikan per hari (maks. 14 hari aktif terakhir).
                </p>
              </div>
              {stats.activityTimeline.length === 0 ? (
                <p className="text-xs text-slate-500">Belum cukup titik data harian.</p>
              ) : (
                <div className="flex items-end gap-2 h-36 pt-4 border-b border-slate-200">
                  {stats.activityTimeline.map((day) => {
                    const maxCount = Math.max(...stats.activityTimeline.map((d) => d.count), 1);
                    const pct = Math.max(12, Math.round((day.count / maxCount) * 100));
                    return (
                      <div key={day.dateLabel} className="flex-1 flex flex-col items-center gap-1 min-w-0">
                        <span className="text-[10px] font-mono text-slate-600 tabular-nums">
                          {day.count}
                        </span>
                        <div className="w-full max-w-[32px] bg-indigo-100 rounded-t-md h-24 flex items-end overflow-hidden">
                          <div
                            className="w-full bg-indigo-700 rounded-t-md transition-all"
                            style={{ height: `${pct}%` }}
                            title={`${day.dateLabel}: ${day.count} sesi (rata-rata skor ${day.avgScore})`}
                          />
                        </div>
                        <span className="text-[10px] font-mono text-slate-500 truncate w-full text-center">
                          {day.dateLabel}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* 2. Accuracy by Framework */}
            <div className="lg:col-span-6 dreamy-surface border border-slate-200/90 rounded-2xl p-6 space-y-4">
              <div>
                <h3 className="text-base font-display font-semibold text-slate-900">
                  2. Akurasi per Kerangka Tipologi
                </h3>
                <p className="text-xs text-slate-500">
                  Perbandingan persentase ketepatan jawaban antar kerangka yang pernah dilatih.
                </p>
              </div>
              <div className="space-y-3">
                {stats.accuracyByFramework.map((fw) => (
                  <div key={fw.framework} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-slate-800">{fw.framework}</span>
                      <span className="font-mono text-slate-600 tabular-nums">
                        {fw.accuracy}% · {fw.attempts} sesi
                      </span>
                    </div>
                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-indigo-700 rounded-full transition-all"
                        style={{ width: `${Math.max(4, fw.accuracy)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 3. Performance by Game */}
            <div className="lg:col-span-6 dreamy-surface border border-slate-200/90 rounded-2xl p-6 space-y-4">
              <div>
                <h3 className="text-base font-display font-semibold text-slate-900">
                  3. Performa per Mini-Game
                </h3>
                <p className="text-xs text-slate-500">
                  Rata-rata skor dan tingkat ketuntasan di setiap jenis permainan.
                </p>
              </div>
              <div className="space-y-3">
                {stats.performanceByGame.map((g) => (
                  <div key={g.gameId} className="space-y-1">
                    <div className="flex items-center justify-between text-xs gap-2">
                      <span className="font-medium text-slate-800 truncate">{g.gameTitle}</span>
                      <span className="font-mono text-slate-600 tabular-nums shrink-0">
                        Skor {g.avgScore} · Tuntas {g.completionRate}% ({g.count}×)
                      </span>
                    </div>
                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#C9A65B] rounded-full transition-all"
                        style={{ width: `${Math.max(5, Math.min(100, g.completionRate))}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 4. Progress Over Time (SVG Trend Chart) */}
            <div className="lg:col-span-6 dreamy-surface border border-slate-200/90 rounded-2xl p-6 space-y-4">
              <div>
                <h3 className="text-base font-display font-semibold text-slate-900">
                  4. Tren Progres Akurasi Sesi
                </h3>
                <p className="text-xs text-slate-500">
                  Perkembangan akurasi pada 12 sesi terakhir secara kronologis.
                </p>
              </div>
              {stats.progressOverTime.length < 2 ? (
                <p className="text-xs text-slate-500 py-8 text-center">
                  Mainkan minimal 2 sesi untuk menampilkan grafik tren perkembangan.
                </p>
              ) : (
                <div className="w-full">
                  <svg viewBox="0 0 420 150" className="w-full h-36 overflow-visible" role="img" aria-label="Grafik tren progres akurasi">
                    <line x1="20" y1="20" x2="400" y2="20" stroke="#DBE0F1" strokeDasharray="3 3" />
                    <line x1="20" y1="70" x2="400" y2="70" stroke="#DBE0F1" strokeDasharray="3 3" />
                    <line x1="20" y1="120" x2="400" y2="120" stroke="#DBE0F1" />
                    {(() => {
                      const pts = stats.progressOverTime;
                      const coords = pts.map((p, i) => {
                        const x = 28 + (i / (pts.length - 1)) * 364;
                        const y = 120 - (p.accuracy / 100) * 95;
                        return { x, y, ...p };
                      });
                      const polyline = coords.map((c) => `${c.x},${c.y}`).join(' ');
                      return (
                        <>
                          <polyline
                            fill="none"
                            stroke="#2C3C8C"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            points={polyline}
                          />
                          {coords.map((c) => (
                            <g key={c.index}>
                              <circle cx={c.x} cy={c.y} r="4.5" fill="#DFBE74" stroke="#151D40" strokeWidth="1.5" />
                              <text
                                x={c.x}
                                y="138"
                                textAnchor="middle"
                                fontSize="9"
                                fill="#59648C"
                                fontFamily="JetBrains Mono, monospace"
                              >
                                {c.label}
                              </text>
                            </g>
                          ))}
                        </>
                      );
                    })()}
                  </svg>
                </div>
              )}
            </div>

            {/* 5. Framework Exploration Frequency */}
            <div className="lg:col-span-12 dreamy-surface border border-slate-200/90 rounded-2xl p-6 space-y-4">
              <div className="flex items-center gap-2">
                <Compass className="w-4 h-4 text-indigo-700" />
                <div>
                  <h3 className="text-base font-display font-semibold text-slate-900">
                    5. Frekuensi Eksplorasi Kerangka
                  </h3>
                  <p className="text-xs text-slate-500">
                    Kerangka teori mana yang paling sering Anda latih sejauh ini.
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                {stats.frameworkExploration.map((item) => (
                  <div
                    key={item.framework}
                    className="p-3.5 rounded-xl bg-white/80 border border-slate-200 flex flex-col justify-between"
                  >
                    <span className="text-xs font-medium text-slate-700">{item.framework}</span>
                    <span className="font-mono text-lg font-bold text-indigo-800 mt-1 tabular-nums">
                      {item.count}×
                    </span>
                  </div>
                ))}
              </div>
              <div className="pt-3 border-t border-slate-200/80 grid grid-cols-1 sm:grid-cols-3 gap-3">
                {stats.difficultyBreakdown.map((db) => (
                  <div
                    key={db.difficulty}
                    className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-2 text-xs"
                  >
                    <div>
                      <div className="font-semibold text-slate-900">{db.label}</div>
                      <div className="text-[11px] text-slate-500 tabular-nums">
                        {db.attempts} sesi · Rata-rata skor {db.avgScore}
                      </div>
                    </div>
                    <div className="font-mono text-sm font-bold text-indigo-800 tabular-nums">
                      {db.accuracy}%
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </>
      )}

      {/* 6. Achievement Overview */}
      <section className="dreamy-surface border border-slate-200/90 rounded-2xl p-6 space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-4">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-[#C9A65B]" />
            <div>
              <h3 className="text-lg font-display font-semibold text-slate-900">
                6. Lencana &amp; Pencapaian Eksplorasi
              </h3>
              <p className="text-xs text-slate-500">
                Terbuka otomatis berdasarkan aktivitas bermain nyata Anda.
              </p>
            </div>
          </div>
          <div className="font-mono text-xs font-semibold text-indigo-800 tabular-nums">
            {unlockedCount} / {achievements.length} Terbuka
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {achievements.map((ach) => (
            <div
              key={ach.id}
              className={`rounded-xl p-4 border transition-colors flex flex-col justify-between gap-3 ${
                ach.unlocked
                  ? 'bg-[#121938] text-[#EEF1FC] border-[#2C3B75]'
                  : 'bg-white/75 text-slate-800 border-slate-200'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div
                    className={`text-[10px] font-semibold uppercase tracking-wider ${
                      ach.unlocked ? 'text-[#E6C77E]' : 'text-slate-500'
                    }`}
                  >
                    {ach.category}
                  </div>
                  <h4
                    className={`mt-1 text-sm font-display font-semibold ${
                      ach.unlocked ? 'text-white' : 'text-slate-900'
                    }`}
                  >
                    {ach.title}
                  </h4>
                  <p
                    className={`mt-1 text-xs leading-relaxed ${
                      ach.unlocked ? 'text-[#C6D0EE]' : 'text-slate-600'
                    }`}
                  >
                    {ach.description}
                  </p>
                </div>
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border ${
                    ach.unlocked
                      ? 'bg-[#DFBE74]/15 border-[#DFBE74]/60 text-[#E6C77E]'
                      : 'bg-slate-100 border-slate-200 text-slate-400'
                  }`}
                >
                  {ach.unlocked ? <Trophy className="w-4 h-4" /> : <Lock className="w-3.5 h-3.5" />}
                </div>
              </div>

              <div className="space-y-1">
                <div
                  className={`flex items-center justify-between text-[11px] font-mono tabular-nums ${
                    ach.unlocked ? 'text-[#E6C77E]' : 'text-slate-500'
                  }`}
                >
                  <span>{ach.unlocked ? 'Tercapai' : 'Progres'}</span>
                  <span>
                    {ach.progress} / {ach.target}
                  </span>
                </div>
                <div
                  className={`h-1.5 w-full rounded-full overflow-hidden ${
                    ach.unlocked ? 'bg-white/15' : 'bg-slate-100'
                  }`}
                >
                  <div
                    className={`h-full rounded-full transition-all ${
                      ach.unlocked ? 'bg-[#DFBE74]' : 'bg-indigo-600'
                    }`}
                    style={{ width: `${ach.percent}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
