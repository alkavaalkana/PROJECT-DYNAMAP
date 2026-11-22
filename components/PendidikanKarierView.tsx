import React, { useEffect, useMemo, useState } from 'react';
import {
  AlertCircle,
  Bookmark,
  BookmarkCheck,
  BookOpen,
  Briefcase,
  Building2,
  CheckCircle2,
  Compass,
  ExternalLink,
  GitCompare,
  GraduationCap,
  Map as MapIcon,
  Plus,
  Search,
  Trash2,
} from 'lucide-react';
import {
  DEFAULT_EXPLORATION_CATALOG_CONFIG,
  DEFAULT_ROADMAP_STAGE_TITLES,
  createDefaultIntrapersonalInput,
  createDefaultUserSubjects,
} from '../data/higherEdAndCareerData';
import { analyzeAcademicGap } from '../lib/explorationEngine';
import {
  analyzeHybridPersonalProfile,
  buildThreeLayerRecommendations,
  rankCareersByPreferences,
} from '../lib/hybridExplorationEngine';
import type {
  AcademicCareerRoadmap,
  Account,
  CareerRecord,
  ExplorationCatalogConfig,
  IntrapersonalExplorationInput,
  Profile,
  SchoolSubjectTemplate,
  TypologyFrameworkKey,
  UniversityInstitution,
  UniversityProgram,
  UserExplorationData,
  UserSubjectEntry,
} from '../types/dynamap';
import { IntrapersonalExplorationWizard } from './IntrapersonalExplorationWizard';
import { MajorDetailModal } from './MajorDetailModal';
import { PersonalizedResultsView } from './PersonalizedResultsView';

interface PendidikanKarierViewProps {
  account: Account | null;
  myProfile: Profile | null;
  profiles?: Profile[];
  exploration: UserExplorationData | null;
  explorationConfig?: ExplorationCatalogConfig;
  subjectTemplates: SchoolSubjectTemplate[];
  universities: UniversityInstitution[];
  programs: UniversityProgram[];
  careers: CareerRecord[];
  onSaveExploration: (next: Partial<UserExplorationData>) => Promise<void>;
  onOpenAuth: () => void;
}

export const PendidikanKarierView: React.FC<PendidikanKarierViewProps> = ({
  account,
  myProfile,
  profiles = [],
  exploration,
  explorationConfig = DEFAULT_EXPLORATION_CATALOG_CONFIG,
  subjectTemplates,
  universities,
  programs,
  careers,
  onSaveExploration,
  onOpenAuth,
}) => {
  const [tab, setTab] = useState<'eksplorasi' | 'hasil' | 'ptn' | 'karier' | 'roadmap'>('eksplorasi');
  const [statusMsg, setStatusMsg] = useState('');
  const [sandboxProfileId, setSandboxProfileId] = useState('');

  const activeProfile = useMemo(() => {
    if (myProfile) return myProfile;
    if (sandboxProfileId) return profiles.find((p) => p.id === sandboxProfileId) || null;
    return null;
  }, [myProfile, sandboxProfileId, profiles]);

  // Exploration interactive state
  const [specLabel, setSpecLabel] = useState(exploration?.specializationLabel || 'FISKIM MATONOMI');
  const [userSubjects, setUserSubjects] = useState<UserSubjectEntry[]>(
    exploration?.userSubjects && exploration.userSubjects.length > 0
      ? exploration.userSubjects
      : createDefaultUserSubjects()
  );
  const [intrapersonal, setIntrapersonal] = useState<IntrapersonalExplorationInput>(() => ({
    ...createDefaultIntrapersonalInput(),
    ...(exploration?.intrapersonal || {}),
    curiosityTopics:
      exploration?.intrapersonal?.curiosityTopics &&
      exploration.intrapersonal.curiosityTopics.length > 0
        ? exploration.intrapersonal.curiosityTopics
        : exploration?.interestTopics || [],
    personalMotivationsRanked:
      exploration?.intrapersonal?.personalMotivationsRanked &&
      exploration.intrapersonal.personalMotivationsRanked.length > 0
        ? exploration.intrapersonal.personalMotivationsRanked
        : exploration?.workMotivationTags || [],
  }));
  const [provisionalTypologies, setProvisionalTypologies] = useState<
    Partial<Record<TypologyFrameworkKey, boolean>>
  >(exploration?.provisionalTypologies || {});
  const [bookmarkedProgramIds, setBookmarkedProgramIds] = useState<string[]>(
    exploration?.bookmarkedProgramIds || []
  );
  const [bookmarkedCareerIds, setBookmarkedCareerIds] = useState<string[]>(
    exploration?.bookmarkedCareerIds || []
  );
  const [reflectionAnswers, setReflectionAnswers] = useState<Record<string, string>>(
    exploration?.personalReflectionAnswers || {}
  );

  // PTN & Comparator state (supports 2–3 programs side-by-side)
  const [ptnSearch, setPtnSearch] = useState('');
  const [uniFilter, setUniFilter] = useState('ALL');
  const [clusterFilter, setClusterFilter] = useState('ALL');
  const [onlyBookmarkedPrograms, setOnlyBookmarkedPrograms] = useState(false);
  const [selectedProgramId, setSelectedProgramId] = useState(programs[0]?.id || '');
  const [modalProgram, setModalProgram] = useState<UniversityProgram | null>(null);
  const [compareIds, setCompareIds] = useState<[string, string, string]>([
    programs[0]?.id || '',
    programs[1]?.id || programs[0]?.id || '',
    '',
  ]);

  // Career Explorer state
  const [careerCluster, setCareerCluster] = useState<string>('ALL');
  const [careerSearch, setCareerSearch] = useState('');
  const [onlyBookmarkedCareers, setOnlyBookmarkedCareers] = useState(false);
  const [selectedCareerId, setSelectedCareerId] = useState('');

  // Roadmap state
  const [roadmaps, setRoadmaps] = useState<AcademicCareerRoadmap[]>(exploration?.roadmaps || []);
  const [activeRoadmapIdx, setActiveRoadmapIdx] = useState(0);
  const [newRoadmapTitle, setNewRoadmapTitle] = useState('');
  const [newRoadmapType, setNewRoadmapType] =
    useState<AcademicCareerRoadmap['pathwayType']>('Jalur Alternatif');
  const [roadmapProgramPick, setRoadmapProgramPick] = useState(programs[0]?.id || '');
  const [roadmapCareerPick, setRoadmapCareerPick] = useState(careers[0]?.id || '');
  const [newActionItemText, setNewActionItemText] = useState<Record<string, string>>({});

  // Sync local exploration state whenever account login/claim/logout or saved exploration changes
  useEffect(() => {
    const base = createDefaultIntrapersonalInput();
    const profileInterests = activeProfile?.academicInterests?.filter(Boolean) || [];
    const incomingIntra = exploration?.intrapersonal;
    const syncedCuriosity =
      incomingIntra?.curiosityTopics && incomingIntra.curiosityTopics.length > 0
        ? incomingIntra.curiosityTopics
        : exploration?.interestTopics && exploration.interestTopics.length > 0
        ? exploration.interestTopics
        : profileInterests;
    const syncedLearningNotes =
      incomingIntra?.learningPreferenceNotes ||
      activeProfile?.learningPreferences?.notes ||
      '';

    setSpecLabel(exploration?.specializationLabel || 'FISKIM MATONOMI');
    setUserSubjects(
      exploration?.userSubjects && exploration.userSubjects.length > 0
        ? exploration.userSubjects
        : createDefaultUserSubjects()
    );
    setIntrapersonal({
      ...base,
      ...(incomingIntra || {}),
      workPreferences: {
        ...base.workPreferences,
        ...(incomingIntra?.workPreferences || {}),
      },
      curiosityTopics: syncedCuriosity,
      learningPreferenceNotes: syncedLearningNotes,
      personalMotivationsRanked:
        incomingIntra?.personalMotivationsRanked && incomingIntra.personalMotivationsRanked.length > 0
          ? incomingIntra.personalMotivationsRanked
          : exploration?.workMotivationTags || [],
    });
    setProvisionalTypologies(exploration?.provisionalTypologies || {});
    setBookmarkedProgramIds(exploration?.bookmarkedProgramIds || []);
    setBookmarkedCareerIds(exploration?.bookmarkedCareerIds || []);
    setReflectionAnswers(exploration?.personalReflectionAnswers || {});
    setRoadmaps(exploration?.roadmaps || []);
  }, [account?.id, myProfile?.id, exploration?.updatedAt]);

  const uniMap = useMemo(() => new Map(universities.map((u) => [u.id, u])), [universities]);

  const liveExplorationDraft = useMemo<UserExplorationData>(
    () => ({
      ownerAccountId: account?.id || 'guest',
      conceptStatuses: exploration?.conceptStatuses || {},
      unresolvedQuestions: exploration?.unresolvedQuestions || [],
      savedComparisons: exploration?.savedComparisons || [],
      completedLearningSteps: exploration?.completedLearningSteps || [],
      bookmarkedLearningSteps: exploration?.bookmarkedLearningSteps || [],
      scenarioReflections: exploration?.scenarioReflections || [],
      userSubjects,
      specializationLabel: specLabel,
      interestTopics: intrapersonal.curiosityTopics,
      problemSolvingPreference: exploration?.problemSolvingPreference || 'Seimbang',
      theoryVsPracticePreference: exploration?.theoryVsPracticePreference || 'Seimbang',
      workMotivationTags: intrapersonal.personalMotivationsRanked,
      preferredMapLayout: exploration?.preferredMapLayout || {},
      roadmaps,
      provisionalTypologies,
      intrapersonal,
      bookmarkedProgramIds,
      bookmarkedCareerIds,
      personalReflectionAnswers: reflectionAnswers,
      updatedAt: new Date().toISOString(),
    }),
    [
      account?.id,
      exploration,
      userSubjects,
      specLabel,
      intrapersonal,
      roadmaps,
      provisionalTypologies,
      bookmarkedProgramIds,
      bookmarkedCareerIds,
      reflectionAnswers,
    ]
  );

  // Hybrid Analysis + Three-Layer Recommendations
  const hybridAnalysis = useMemo(
    () =>
      analyzeHybridPersonalProfile({
        profile: activeProfile,
        exploration: liveExplorationDraft,
        userSubjects,
      }),
    [activeProfile, liveExplorationDraft, userSubjects]
  );

  const threeLayerBundle = useMemo(
    () =>
      buildThreeLayerRecommendations({
        profile: activeProfile,
        exploration: liveExplorationDraft,
        userSubjects,
        programs,
        universities,
      }),
    [activeProfile, liveExplorationDraft, userSubjects, programs, universities]
  );

  const recommendedProgramIds = useMemo(
    () => [
      ...threeLayerBundle.recommended.map((r) => r.program.id),
      ...threeLayerBundle.alternative.map((r) => r.program.id),
    ],
    [threeLayerBundle]
  );

  const rankedCareers = useMemo(
    () =>
      rankCareersByPreferences({
        careers,
        exploration: liveExplorationDraft,
        profile: activeProfile,
        recommendedProgramIds,
      }),
    [careers, liveExplorationDraft, activeProfile, recommendedProgramIds]
  );

  const allDisciplineClusters = useMemo(() => {
    const combined = new Set<string>([
      ...explorationConfig.disciplineClusters,
      ...programs.map((p) => p.disciplineCluster),
    ]);
    return Array.from(combined);
  }, [explorationConfig.disciplineClusters, programs]);

  const allCareerClusters = useMemo(
    () => Array.from(new Set(careers.map((c) => c.cluster))),
    [careers]
  );

  const filteredPrograms = useMemo(() => {
    const q = ptnSearch.trim().toLowerCase();
    return programs.filter((p) => {
      if (uniFilter !== 'ALL' && p.universityId !== uniFilter) return false;
      if (clusterFilter !== 'ALL' && p.disciplineCluster !== clusterFilter) return false;
      if (onlyBookmarkedPrograms && !bookmarkedProgramIds.includes(p.id)) return false;
      if (q) {
        const uni = uniMap.get(p.universityId);
        return (
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.disciplineCluster.toLowerCase().includes(q) ||
          (p.concentrations?.some((c) => c.toLowerCase().includes(q)) ?? false) ||
          (uni?.name.toLowerCase().includes(q) ?? false) ||
          (uni?.shortName.toLowerCase().includes(q) ?? false)
        );
      }
      return true;
    });
  }, [programs, uniFilter, clusterFilter, onlyBookmarkedPrograms, bookmarkedProgramIds, ptnSearch, uniMap]);

  const selectedProgram =
    programs.find((p) => p.id === selectedProgramId) || filteredPrograms[0] || programs[0];

  const gapReport = useMemo(
    () =>
      selectedProgram
        ? analyzeAcademicGap(userSubjects, selectedProgram, uniMap.get(selectedProgram.universityId) || null)
        : null,
    [userSubjects, selectedProgram, uniMap]
  );

  const modalGapReport = useMemo(
    () =>
      modalProgram
        ? analyzeAcademicGap(userSubjects, modalProgram, uniMap.get(modalProgram.universityId) || null)
        : null,
    [userSubjects, modalProgram, uniMap]
  );

  const filteredCareers = useMemo(() => {
    const q = careerSearch.trim().toLowerCase();
    return rankedCareers.filter(({ career: c }) => {
      if (careerCluster !== 'ALL' && c.cluster !== careerCluster) return false;
      if (onlyBookmarkedCareers && !bookmarkedCareerIds.includes(c.id)) return false;
      if (q) {
        return (
          c.title.toLowerCase().includes(q) ||
          c.summary.toLowerCase().includes(q) ||
          c.relevantSubjects.some((s) => s.toLowerCase().includes(q)) ||
          c.coreSkills.some((s) => s.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [rankedCareers, careerCluster, onlyBookmarkedCareers, bookmarkedCareerIds, careerSearch]);

  const selectedCareerEntry =
    filteredCareers.find(({ career }) => career.id === selectedCareerId) ||
    filteredCareers[0] ||
    rankedCareers.find(({ career }) => career.id === selectedCareerId) ||
    rankedCareers[0];

  async function persistExplorationState(patch: Partial<UserExplorationData>, msg?: string) {
    if (!account) {
      if (msg) setStatusMsg(`${msg} (Mode pratinjau: masuk ke akun untuk menyimpan permanen ke server.)`);
      return;
    }
    await onSaveExploration(patch);
    if (msg) setStatusMsg(msg);
  }

  function updateSubjectField(subjectId: string, patch: Partial<UserSubjectEntry>) {
    setUserSubjects((prev) => prev.map((s) => (s.subjectId === subjectId ? { ...s, ...patch } : s)));
  }

  function toggleProvisional(key: TypologyFrameworkKey) {
    setProvisionalTypologies((prev) => ({
      ...prev,
      [key]: !(prev[key] ?? false),
    }));
  }

  async function toggleBookmarkProgram(programId: string) {
    const next = bookmarkedProgramIds.includes(programId)
      ? bookmarkedProgramIds.filter((id) => id !== programId)
      : [...bookmarkedProgramIds, programId];
    setBookmarkedProgramIds(next);
    if (account) {
      await onSaveExploration({ bookmarkedProgramIds: next });
    }
  }

  async function toggleBookmarkCareer(careerId: string) {
    const next = bookmarkedCareerIds.includes(careerId)
      ? bookmarkedCareerIds.filter((id) => id !== careerId)
      : [...bookmarkedCareerIds, careerId];
    setBookmarkedCareerIds(next);
    if (account) {
      await onSaveExploration({ bookmarkedCareerIds: next });
    }
  }

  function addProgramToCompare(programId: string) {
    setCompareIds((prev) => {
      if (prev.includes(programId)) return prev;
      if (!prev[2]) return [prev[0], prev[1], programId];
      return [prev[0], prev[1], programId];
    });
    setTab('ptn');
  }

  async function saveRoadmapsToServer(nextRoadmaps: AcademicCareerRoadmap[], msg: string) {
    setRoadmaps(nextRoadmaps);
    if (!account) {
      setStatusMsg(`${msg} (Mode pratinjau: masuk ke akun untuk menyimpan permanen ke server.)`);
      return;
    }
    await onSaveExploration({ roadmaps: nextRoadmaps });
    setStatusMsg(msg);
  }

  function handleCreateRoadmap(e: React.FormEvent) {
    e.preventDefault();
    if (!newRoadmapTitle.trim()) return;
    const created: AcademicCareerRoadmap = {
      id: `rm-${Date.now()}`,
      title: newRoadmapTitle.trim(),
      pathwayType: newRoadmapType,
      targetProgramIds: bookmarkedProgramIds.length > 0
        ? bookmarkedProgramIds.slice(0, 3)
        : selectedProgram
        ? [selectedProgram.id]
        : [],
      targetCareerIds: bookmarkedCareerIds.length > 0
        ? bookmarkedCareerIds.slice(0, 2)
        : selectedCareerEntry
        ? [selectedCareerEntry.career.id]
        : [],
      openQuestions: '',
      milestones: DEFAULT_ROADMAP_STAGE_TITLES.map((stageTitle, idx) => ({
        id: `ms-${Date.now()}-${idx}`,
        stageNumber: idx + 1,
        stageTitle,
        goal: 'Tuliskan target spesifik yang realistis untuk tahap ini.',
        actionItems: ['Langkah konkret pertama'],
        status: 'Belum Dimulai',
        notes: '',
      })),
      updatedAt: new Date().toISOString(),
    };
    const next = [...roadmaps, created];
    setNewRoadmapTitle('');
    setActiveRoadmapIdx(next.length - 1);
    saveRoadmapsToServer(next, `Peta jalan "${created.title}" ditambahkan.`);
  }

  const activeRoadmap = roadmaps[activeRoadmapIdx] || roadmaps[0];

  return (
    <div className="space-y-6">
      {/* Header & Navigation */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-slate-900">
            Sistem Eksplorasi Intrapersonal, Studi Lanjut PTN &amp; Karier Multi-Jalur
          </h1>
          <p className="text-sm text-slate-600 mt-1 max-w-4xl leading-relaxed">
            Memadukan profil tipologi Anda secara otomatis dengan minat sejati, preferensi kognitif, gaya belajar, motivasi, dan latar SMA ({specLabel})—tanpa membatasi Anda hanya pada mata pelajaran sekolah saat ini.
          </p>
        </div>

        <div className="flex flex-wrap gap-1.5 bg-slate-100 p-1 rounded-lg w-full sm:w-fit max-w-full">
          {[
            { id: 'eksplorasi' as const, label: '1. Profil & Eksplorasi Diri (4 Tahap)', icon: BookOpen },
            { id: 'hasil' as const, label: '2. Hasil Analisis Terpadu (A–I)', icon: Compass },
            {
              id: 'ptn' as const,
              label: `3. PTN (${universities.length}), Prodi (${programs.length}) & Gap`,
              icon: Building2,
            },
            { id: 'karier' as const, label: `4. Penjelajah Karier (${careers.length})`, icon: Briefcase },
            { id: 'roadmap' as const, label: '5. Peta Jalan Multi-Jalur', icon: MapIcon },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setTab(item.id)}
                className={`inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                  tab === item.id
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {item.label}
              </button>
            );
          })}
        </div>
      </div>

      {statusMsg && (
        <div className="p-3.5 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-900">
          {statusMsg}
        </div>
      )}

      {/* TAB 1: PROGRESSIVE INTRAPERSONAL & ACADEMIC EXPLORATION */}
      {tab === 'eksplorasi' && (
        <IntrapersonalExplorationWizard
          account={account}
          activeProfile={activeProfile}
          allProfiles={profiles}
          sandboxProfileId={sandboxProfileId}
          onSelectSandboxProfile={setSandboxProfileId}
          explorationConfig={explorationConfig}
          subjectTemplates={subjectTemplates}
          specLabel={specLabel}
          onSpecLabelChange={setSpecLabel}
          userSubjects={userSubjects}
          onUpdateSubject={updateSubjectField}
          intrapersonal={intrapersonal}
          onChangeIntrapersonal={setIntrapersonal}
          provisionalTypologies={provisionalTypologies}
          onToggleProvisional={toggleProvisional}
          onApplyFiskimPreset={() => {
            setSpecLabel('FISKIM MATONOMI');
            setUserSubjects(createDefaultUserSubjects());
            setStatusMsg('Paket mata pelajaran FISKIM MATONOMI + mapel umum SMA diterapkan kembali.');
          }}
          onSaveDraftOnly={() =>
            persistExplorationState(
              {
                specializationLabel: specLabel,
                userSubjects,
                interestTopics: intrapersonal.curiosityTopics,
                workMotivationTags: intrapersonal.personalMotivationsRanked,
                provisionalTypologies,
                intrapersonal,
              },
              'Draf eksplorasi pribadi dan latar akademik berhasil disimpan.'
            )
          }
          onSaveAndViewResults={async () => {
            await persistExplorationState(
              {
                specializationLabel: specLabel,
                userSubjects,
                interestTopics: intrapersonal.curiosityTopics,
                workMotivationTags: intrapersonal.personalMotivationsRanked,
                provisionalTypologies,
                intrapersonal,
              },
              'Eksplorasi disimpan dan hasil analisis terpadu A–I diperbarui.'
            );
            setTab('hasil');
          }}
          onOpenAuth={onOpenAuth}
        />
      )}

      {/* TAB 2: PERSONALIZED RESULTS PAGE (SECTIONS A-I & 3 LAYERS) */}
      {tab === 'hasil' && (
        <PersonalizedResultsView
          account={account}
          activeProfile={activeProfile}
          explorationConfig={explorationConfig}
          specLabel={specLabel}
          analysis={hybridAnalysis}
          bundle={threeLayerBundle}
          rankedCareers={rankedCareers}
          bookmarkedProgramIds={bookmarkedProgramIds}
          bookmarkedCareerIds={bookmarkedCareerIds}
          reflectionAnswers={reflectionAnswers}
          onToggleBookmarkProgram={toggleBookmarkProgram}
          onToggleBookmarkCareer={toggleBookmarkCareer}
          onChangeReflectionAnswer={(idx, val) =>
            setReflectionAnswers((prev) => ({ ...prev, [String(idx)]: val }))
          }
          onSaveReflections={async () => {
            if (!account) {
              onOpenAuth();
              return;
            }
            await persistExplorationState(
              { personalReflectionAnswers: reflectionAnswers },
              'Refleksi pribadi tersimpan.'
            );
          }}
          onInspectMajor={(prog) => setModalProgram(prog)}
          onCompareProgram={addProgramToCompare}
          onInspectCareer={(careerId) => {
            setSelectedCareerId(careerId);
            setTab('karier');
          }}
          onEditExploration={() => setTab('eksplorasi')}
        />
      )}

      {/* TAB 3: PTN DATABASE (10+ CLUSTERS), 6-PART GAP ANALYZER & 3-WAY PROGRAM COMPARATOR */}
      {tab === 'ptn' && (
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl p-5 flex flex-wrap items-center gap-3 text-xs min-w-0">
            <div className="relative flex-1 min-w-[200px] w-full sm:w-auto">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="search"
                value={ptnSearch}
                onChange={(e) => setPtnSearch(e.target.value)}
                placeholder="Cari prodi, konsentrasi, atau PTN (mis. Psikologi, Hukum, Filsafat, Teknik Kimia, UI, ITB)..."
                className="w-full pl-8 pr-3 py-2 border border-slate-300 rounded-lg"
              />
            </div>
            <select
              aria-label="Filter PTN"
              value={uniFilter}
              onChange={(e) => setUniFilter(e.target.value)}
              className="w-full sm:w-auto min-w-0 max-w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
            >
              <option value="ALL">Semua PTN ({universities.length})</option>
              {universities.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.shortName} — {u.city}
                </option>
              ))}
            </select>
            <select
              aria-label="Filter rumpun ilmu"
              value={clusterFilter}
              onChange={(e) => setClusterFilter(e.target.value)}
              className="w-full sm:w-auto min-w-0 max-w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
            >
              <option value="ALL">Semua Rumpun Ilmu ({allDisciplineClusters.length})</option>
              {allDisciplineClusters.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <label className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-300 cursor-pointer bg-slate-50">
              <input
                type="checkbox"
                checked={onlyBookmarkedPrograms}
                onChange={(e) => setOnlyBookmarkedPrograms(e.target.checked)}
              />
              <span>Tersimpan ({bookmarkedProgramIds.length})</span>
            </label>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start min-w-0">
            {/* Program List */}
            <div className="lg:col-span-5 space-y-2.5 max-h-[720px] overflow-y-auto pr-1 min-w-0">
              {filteredPrograms.length === 0 ? (
                <div className="bg-white border border-slate-200 rounded-xl p-6 text-xs text-slate-600">
                  Tidak ada program studi yang sesuai filter saat ini. Coba ubah kata kunci atau pilih &quot;Semua Rumpun Ilmu&quot;.
                </div>
              ) : (
                filteredPrograms.map((prog) => {
                  const uni = uniMap.get(prog.universityId);
                  const selected = selectedProgram?.id === prog.id;
                  const saved = bookmarkedProgramIds.includes(prog.id);
                  return (
                    <button
                      key={prog.id}
                      type="button"
                      onClick={() => setSelectedProgramId(prog.id)}
                      className={`w-full text-left p-4 rounded-xl border transition-colors ${
                        selected
                          ? 'bg-indigo-50 border-indigo-500'
                          : 'bg-white border-slate-200 hover:border-indigo-200'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2 text-[11px] font-medium text-indigo-700">
                        <span>
                          {uni?.shortName} · {prog.disciplineCluster}
                        </span>
                        {saved && <BookmarkCheck className="w-3.5 h-3.5 text-indigo-700 shrink-0" />}
                      </div>
                      <div className="text-sm font-display font-bold text-slate-900 mt-0.5">
                        {prog.degree} {prog.name}
                      </div>
                      <p className="text-xs text-slate-600 mt-1 line-clamp-2">{prog.description}</p>
                    </button>
                  );
                })
              )}
            </div>

            {/* Selected Program Detail + 6-Part Academic Gap + 3-Way Comparison */}
            <div className="lg:col-span-7 space-y-5">
              {selectedProgram && gapReport && (
                <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-5 text-xs">
                  <div className="border-b border-slate-200 pb-4 flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div className="space-y-1.5">
                      <div className="text-indigo-700 font-semibold">
                        {gapReport.university?.name} ({gapReport.university?.city}) ·{' '}
                        {selectedProgram.faculty}
                      </div>
                      <h2 className="text-xl font-display font-bold text-slate-900">
                        {selectedProgram.degree} {selectedProgram.name}
                      </h2>
                      <p className="text-sm text-slate-700 leading-relaxed">
                        {selectedProgram.description}
                      </p>
                      <div className="pt-1 flex flex-wrap items-center gap-3 text-[11px] text-slate-500">
                        <span>
                          Status Data: <strong>{selectedProgram.provenance.verificationStatus}</strong>
                        </span>
                        <span>Tahun {selectedProgram.provenance.academicYear}</span>
                        {selectedProgram.accreditation && (
                          <span>Akreditasi {selectedProgram.accreditation}</span>
                        )}
                        <a
                          href={selectedProgram.provenance.officialUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-indigo-700 hover:underline font-medium"
                        >
                          Portal Resmi PTN
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>

                    <div className="flex sm:flex-col items-end gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => toggleBookmarkProgram(selectedProgram.id)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 font-medium rounded-lg border ${
                          bookmarkedProgramIds.includes(selectedProgram.id)
                            ? 'bg-indigo-700 text-white border-indigo-700'
                            : 'bg-slate-50 text-slate-700 border-slate-300'
                        }`}
                      >
                        {bookmarkedProgramIds.includes(selectedProgram.id) ? (
                          <BookmarkCheck className="w-3.5 h-3.5" />
                        ) : (
                          <Bookmark className="w-3.5 h-3.5" />
                        )}
                        {bookmarkedProgramIds.includes(selectedProgram.id) ? 'Tersimpan' : 'Simpan'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setModalProgram(selectedProgram)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 font-medium text-indigo-800 bg-indigo-50 hover:bg-indigo-100 rounded-lg"
                      >
                        <GraduationCap className="w-3.5 h-3.5" />
                        Buka Detail Lengkap
                      </button>
                    </div>
                  </div>

                  {/* 6-Part Academic Gap Summary */}
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h3 className="text-sm font-display font-semibold text-slate-900">
                        Analisis Kesenjangan 6 Bagian ({specLabel} vs {selectedProgram.name})
                      </h3>
                      <span className="text-[11px] font-semibold text-indigo-800 bg-indigo-100 px-2 py-0.5 rounded">
                        {gapReport.formalEligibilityStatus}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="p-3 rounded-lg bg-white border border-slate-200 space-y-1.5">
                        <div className="font-semibold text-emerald-800 flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Pengetahuan SMA yang Sudah Mendukung
                        </div>
                        {gapReport.relevantExistingKnowledge.length > 0 ? (
                          <ul className="list-disc pl-4 space-y-1 text-slate-700">
                            {gapReport.relevantExistingKnowledge.map((k, i) => (
                              <li key={i}>{k}</li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-slate-600">
                            Bekal penalaran logis &amp; penulisan umum SMA tetap dapat ditransfer.
                          </p>
                        )}
                      </div>

                      <div className="p-3 rounded-lg bg-white border border-slate-200 space-y-1.5">
                        <div className="font-semibold text-amber-800 flex items-center gap-1.5">
                          <AlertCircle className="w-3.5 h-3.5" />
                          Topik Tambahan untuk Dijembatani
                        </div>
                        {gapReport.additionalTopicsToLearn.length === 0 ? (
                          <p className="text-emerald-800">
                            Seluruh mapel utama &amp; pendukung sudah ada pada daftar mapel Anda.
                          </p>
                        ) : (
                          <ul className="list-disc pl-4 space-y-1 text-amber-950">
                            {gapReport.additionalTopicsToLearn.map((m, i) => (
                              <li key={i}>{m}</li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </div>

                    <div className="p-3 rounded-lg bg-white border border-slate-200 space-y-1 text-slate-700">
                      <div className="font-semibold text-slate-900">
                        Persyaratan Masuk Resmi vs Potensi Pribadi:
                      </div>
                      <ul className="list-disc pl-4 space-y-0.5">
                        {gapReport.officialAdmissionRequirements.map((r, i) => (
                          <li key={i}>{r}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-3 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-950 space-y-1">
                      <div className="font-semibold">Rencana Jembatan Persiapan:</div>
                      <ul className="list-disc pl-4 space-y-1">
                        {gapReport.prepActionPlan.map((step, i) => (
                          <li key={i}>{step}</li>
                        ))}
                      </ul>
                      <p className="pt-1 font-medium">{gapReport.encouragementNote}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* 2–3 Program Comparison Tool */}
              <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4 text-xs">
                <div className="flex items-center gap-2 text-base font-display font-semibold text-slate-900">
                  <GitCompare className="w-4 h-4 text-indigo-700" />
                  Bandingkan 2–3 Program Studi PTN Berdampingan
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {[0, 1, 2].map((slotIdx) => (
                    <select
                      key={slotIdx}
                      aria-label={`Program studi pembanding ${slotIdx + 1}`}
                      value={compareIds[slotIdx]}
                      onChange={(e) => {
                        const val = e.target.value;
                        setCompareIds((prev) => {
                          const next: [string, string, string] = [...prev] as [string, string, string];
                          next[slotIdx] = val;
                          return next;
                        });
                      }}
                      className="w-full min-w-0 max-w-full px-2.5 py-2 border border-slate-300 rounded-lg bg-white"
                    >
                      {slotIdx === 2 && <option value="">+ Tambah Prodi ke-3 (Opsional)</option>}
                      {programs.map((p) => (
                        <option key={p.id} value={p.id}>
                          {uniMap.get(p.universityId)?.shortName} · {p.name}
                        </option>
                      ))}
                    </select>
                  ))}
                </div>

                <div
                  className={`grid grid-cols-1 gap-4 ${
                    compareIds[2] ? 'md:grid-cols-3' : 'md:grid-cols-2'
                  }`}
                >
                  {compareIds
                    .filter(Boolean)
                    .map((id) => programs.find((p) => p.id === id))
                    .filter((p): p is UniversityProgram => Boolean(p))
                    .map((p) => {
                      const uni = uniMap.get(p.universityId);
                      const g = analyzeAcademicGap(userSubjects, p, uni || null);
                      return (
                        <div
                          key={p.id}
                          className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-2"
                        >
                          <div className="font-bold text-slate-900 text-sm">
                            {uni?.shortName} — {p.name}
                          </div>
                          <div className="text-[11px] font-semibold text-indigo-700">
                            {p.disciplineCluster} · {g.formalEligibilityStatus}
                          </div>
                          <div>
                            <strong>Fokus Kurikulum:</strong> {p.curriculumFocus.join(', ')}
                          </div>
                          <div>
                            <strong>Mapel Utama SMA:</strong> {p.keyHighSchoolSubjects.join(', ')}
                          </div>
                          <div>
                            <strong>Area Persiapan Anda:</strong>{' '}
                            {g.missingOrUnstudiedSubjects.length > 0
                              ? g.missingOrUnstudiedSubjects.join(', ')
                              : 'Sudah dipelajari di SMA'}
                          </div>
                          <div>
                            <strong>Jalur Admisi:</strong>{' '}
                            {(p.availableRoutes || uni?.admissionRoutes || ['SNBP', 'SNBT', 'Mandiri']).join(', ')}
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: CAREER EXPLORER & PREFERENCE ALIGNMENT */}
      {tab === 'karier' && (
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl p-5 flex flex-wrap items-center gap-3 text-xs min-w-0">
            <input
              type="search"
              value={careerSearch}
              onChange={(e) => setCareerSearch(e.target.value)}
              placeholder="Cari profesi, keterampilan, atau sertifikasi (mis. Psikolog, Advokat, Kebijakan, Arsitek)..."
              className="flex-1 min-w-[200px] w-full sm:w-auto px-3 py-2 border border-slate-300 rounded-lg"
            />
            <select
              aria-label="Filter klaster karier"
              value={careerCluster}
              onChange={(e) => setCareerCluster(e.target.value)}
              className="w-full sm:w-auto min-w-0 max-w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
            >
              <option value="ALL">Seluruh Klaster Karier ({careers.length})</option>
              {allCareerClusters.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <label className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-300 cursor-pointer bg-slate-50">
              <input
                type="checkbox"
                checked={onlyBookmarkedCareers}
                onChange={(e) => setOnlyBookmarkedCareers(e.target.checked)}
              />
              <span>Tersimpan ({bookmarkedCareerIds.length})</span>
            </label>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start min-w-0">
            <div className="lg:col-span-5 space-y-2.5 max-h-[680px] overflow-y-auto pr-1 min-w-0">
              {filteredCareers.length === 0 ? (
                <div className="bg-white border border-slate-200 rounded-xl p-6 text-xs text-slate-600">
                  Belum ada jalur karier yang sesuai filter ini. Ubah kata kunci atau matikan filter &quot;Tersimpan&quot;.
                </div>
              ) : (
                filteredCareers.map(({ career: c, connectionReasons }) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setSelectedCareerId(c.id)}
                    className={`w-full text-left p-4 rounded-xl border transition-colors ${
                      selectedCareerEntry?.career.id === c.id
                        ? 'bg-indigo-50 border-indigo-500'
                        : 'bg-white border-slate-200 hover:border-indigo-200'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 text-[11px] font-medium text-indigo-700">
                      <span>{c.cluster}</span>
                      {bookmarkedCareerIds.includes(c.id) && (
                        <BookmarkCheck className="w-3.5 h-3.5 text-indigo-700 shrink-0" />
                      )}
                    </div>
                    <div className="text-sm font-display font-bold text-slate-900 mt-0.5">
                      {c.title}
                    </div>
                    <p className="text-xs text-slate-600 mt-1 line-clamp-2">{c.summary}</p>
                    <div className="text-[11px] text-indigo-800 mt-1.5 font-medium">
                      {connectionReasons[0]}
                    </div>
                  </button>
                ))
              )}
            </div>

            {selectedCareerEntry && (
              <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-6 space-y-4 text-xs">
                <div className="border-b border-slate-200 pb-3 flex items-start justify-between gap-3">
                  <div>
                    <div className="text-indigo-700 font-semibold">
                      {selectedCareerEntry.career.cluster}
                    </div>
                    <h2 className="text-xl font-display font-bold text-slate-900 mt-0.5">
                      {selectedCareerEntry.career.title}
                    </h2>
                    <p className="text-sm text-slate-700 mt-2 leading-relaxed">
                      {selectedCareerEntry.career.summary}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => toggleBookmarkCareer(selectedCareerEntry.career.id)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 font-medium rounded-lg border shrink-0 ${
                      bookmarkedCareerIds.includes(selectedCareerEntry.career.id)
                        ? 'bg-indigo-700 text-white border-indigo-700'
                        : 'bg-slate-50 text-slate-700 border-slate-300'
                    }`}
                  >
                    {bookmarkedCareerIds.includes(selectedCareerEntry.career.id) ? (
                      <BookmarkCheck className="w-3.5 h-3.5" />
                    ) : (
                      <Bookmark className="w-3.5 h-3.5" />
                    )}
                    {bookmarkedCareerIds.includes(selectedCareerEntry.career.id)
                      ? 'Tersimpan'
                      : 'Simpan Karier'}
                  </button>
                </div>

                <div className="p-3.5 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-950">
                  <strong>Keterhubungan dengan Preferensi &amp; Eksplorasi Anda:</strong>{' '}
                  {selectedCareerEntry.connectionReasons.join(' ')}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    {
                      title: 'Aktivitas & Pemecahan Masalah Harian',
                      text: selectedCareerEntry.career.dailyWorkAndProblemSolving,
                    },
                    {
                      title: 'Tanggung Jawab Inti Profesi',
                      text:
                        selectedCareerEntry.career.responsibilities?.join(' · ') ||
                        selectedCareerEntry.career.dailyWorkAndProblemSolving,
                    },
                    {
                      title: 'Jalur Pendidikan & Lintas Latar',
                      text:
                        selectedCareerEntry.career.educationPathway ||
                        selectedCareerEntry.career.entryPathways.join(' · '),
                    },
                    {
                      title: 'Sertifikasi & Lisensi Resmi (Jika Ada)',
                      text:
                        selectedCareerEntry.career.certificationOrLicensing ||
                        'Tidak membutuhkan izin praktik tersertifikasi khusus; portfolio & kompetensi proyek utama.',
                    },
                    {
                      title: 'Lingkungan Kerja & Kolaborasi',
                      text: `${selectedCareerEntry.career.workEnvironment.replace(/\.+$/, '')}. ${selectedCareerEntry.career.collaborationAndInteraction}`,
                    },
                    {
                      title: 'Keterampilan Inti & Mapel Terkait',
                      text: `${selectedCareerEntry.career.coreSkills.join(' · ')} (Mapel SMA terkait: ${selectedCareerEntry.career.relevantSubjects.join(', ')})`,
                    },
                    {
                      title: 'Peluang Perkembangan Karier',
                      text: selectedCareerEntry.career.growthOpportunities.join(' → '),
                    },
                    {
                      title: 'Kesalahpahaman Umum & Realitas Kerja',
                      text: selectedCareerEntry.career.commonMisconceptions.join(' '),
                    },
                  ].map((box) => (
                    <div
                      key={box.title}
                      className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 space-y-1"
                    >
                      <div className="font-semibold text-slate-900">{box.title}</div>
                      <p className="text-slate-700 leading-relaxed">{box.text}</p>
                    </div>
                  ))}
                </div>

                <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 space-y-2">
                  <div className="font-semibold text-slate-900">
                    Program Studi PTN Terkait (Klik untuk Cek Gap 6 Bagian):
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {selectedCareerEntry.career.relatedProgramIds
                      .map((pid) => programs.find((p) => p.id === pid))
                      .filter((p): p is UniversityProgram => Boolean(p))
                      .map((prog) => {
                        const uni = uniMap.get(prog.universityId);
                        return (
                          <button
                            key={prog.id}
                            type="button"
                            onClick={() => setModalProgram(prog)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-indigo-200 text-indigo-800 hover:bg-indigo-50 font-medium"
                          >
                            <GraduationCap className="w-3.5 h-3.5" />
                            {uni?.shortName} — {prog.name}
                          </button>
                        );
                      })}
                  </div>
                </div>

                <div className="text-[11px] text-slate-500 pt-2 border-t border-slate-200 flex items-center justify-between">
                  <span>
                    Sumber: {selectedCareerEntry.career.provenance.sourceTitle} (
                    {selectedCareerEntry.career.provenance.verificationStatus})
                  </span>
                  <a
                    href={selectedCareerEntry.career.provenance.officialUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-indigo-700 hover:underline inline-flex items-center gap-1"
                  >
                    Tautan Rujukan
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 5: MULTI-PATHWAY ROADMAP BUILDER */}
      {tab === 'roadmap' && (
        <div className="space-y-6 min-w-0 max-w-full overflow-x-hidden">
          <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-6 space-y-4 text-xs min-w-0">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 min-w-0">
              <div className="min-w-0">
                <h2 className="text-lg font-display font-semibold text-slate-900">
                  Pembangun Peta Jalan Pribadi (Multi-Jalur)
                </h2>
                <p className="text-slate-600 mt-0.5">
                  Rencanakan lebih dari satu skenario—jalur utama, alternatif, lintas disiplin, maupun bidang eksplorasi baru—tanpa takut berubah di tengah jalan.
                </p>
              </div>
              <form
                onSubmit={handleCreateRoadmap}
                className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-2 w-full lg:w-auto min-w-0"
              >
                <input
                  type="text"
                  required
                  placeholder="Nama jalur baru..."
                  value={newRoadmapTitle}
                  onChange={(e) => setNewRoadmapTitle(e.target.value)}
                  className="w-full sm:w-auto min-w-0 px-3 py-1.5 border border-slate-300 rounded-lg"
                />
                <select
                  aria-label="Jenis jalur peta jalan"
                  value={newRoadmapType}
                  onChange={(e) =>
                    setNewRoadmapType(e.target.value as AcademicCareerRoadmap['pathwayType'])
                  }
                  className="w-full sm:w-auto min-w-0 max-w-full px-2.5 py-1.5 border border-slate-300 rounded-lg bg-white"
                >
                  <option value="Jalur Utama">Jalur Utama</option>
                  <option value="Jalur Alternatif">Jalur Alternatif</option>
                  <option value="Jalur Lintas Disiplin">Jalur Lintas Disiplin</option>
                  <option value="Jalur Eksplorasi Bidang Baru">Jalur Eksplorasi Bidang Baru</option>
                </select>
                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-1 px-3 py-1.5 font-medium text-white bg-indigo-700 hover:bg-indigo-800 rounded-lg shrink-0"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Tambah Jalur
                </button>
              </form>
            </div>

            <div className="flex flex-wrap gap-2 min-w-0">
              {roadmaps.map((rm, idx) => (
                <button
                  key={rm.id}
                  type="button"
                  onClick={() => setActiveRoadmapIdx(idx)}
                  className={`px-3 py-2 rounded-lg border font-medium transition-colors text-left break-words max-w-full ${
                    idx === activeRoadmapIdx
                      ? 'bg-indigo-700 text-white border-indigo-700'
                      : 'bg-slate-50 text-slate-700 border-slate-200'
                  }`}
                >
                  {rm.title} ({rm.pathwayType})
                </button>
              ))}
            </div>
          </div>

          {activeRoadmap && (
            <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-6 space-y-5 text-xs min-w-0">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-4">
                <div className="min-w-0">
                  <div className="text-indigo-700 font-semibold">{activeRoadmap.pathwayType}</div>
                  <h3 className="text-xl font-display font-bold text-slate-900 break-words">
                    {activeRoadmap.title}
                  </h3>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => {
                      if (!account) {
                        onOpenAuth();
                        return;
                      }
                      saveRoadmapsToServer(roadmaps, 'Perubahan peta jalan disimpan.');
                    }}
                    className="inline-flex items-center gap-1.5 px-4 py-2 font-medium text-white bg-indigo-700 hover:bg-indigo-800 rounded-lg"
                  >
                    Simpan Peta Jalan
                  </button>
                  {roadmaps.length > 1 && (
                    <button
                      type="button"
                      onClick={() => {
                        const next = roadmaps.filter((_, i) => i !== activeRoadmapIdx);
                        setActiveRoadmapIdx(0);
                        saveRoadmapsToServer(next, 'Jalur peta jalan dihapus.');
                      }}
                      className="p-2 text-slate-500 hover:text-red-700 rounded-lg border border-slate-200"
                      aria-label="Hapus peta jalan ini"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 min-w-0">
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2 min-w-0">
                  <div className="font-semibold text-slate-900">Target Program Studi Jalur Ini:</div>
                  <div className="flex flex-wrap gap-1.5">
                    {activeRoadmap.targetProgramIds.map((pid) => {
                      const prog = programs.find((p) => p.id === pid);
                      const uni = prog ? uniMap.get(prog.universityId) : null;
                      return (
                        <span
                          key={pid}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-white border border-slate-200 text-slate-800"
                        >
                          <span>{prog ? `${uni?.shortName} — ${prog.name}` : pid}</span>
                          <button
                            type="button"
                            aria-label={`Hapus target prodi ${prog?.name || pid}`}
                            onClick={() =>
                              setRoadmaps((prev) =>
                                prev.map((rm, idx) =>
                                  idx === activeRoadmapIdx
                                    ? {
                                        ...rm,
                                        targetProgramIds: rm.targetProgramIds.filter((x) => x !== pid),
                                      }
                                    : rm
                                )
                              )
                            }
                            className="text-slate-400 hover:text-red-700 font-bold"
                          >
                            ×
                          </button>
                        </span>
                      );
                    })}
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2 min-w-0">
                    <select
                      aria-label="Pilih program studi untuk ditambahkan ke peta jalan"
                      value={roadmapProgramPick}
                      onChange={(e) => setRoadmapProgramPick(e.target.value)}
                      className="w-full sm:flex-1 min-w-0 max-w-full truncate px-2.5 py-1.5 border border-slate-300 rounded-lg bg-white"
                    >
                      {programs.map((p) => (
                        <option key={p.id} value={p.id}>
                          {uniMap.get(p.universityId)?.shortName} — {p.name}
                        </option>
                      ))}
                    </select>
                    <button
                      type="button"
                      onClick={() => {
                        if (!roadmapProgramPick) return;
                        setRoadmaps((prev) =>
                          prev.map((rm, idx) =>
                            idx === activeRoadmapIdx && !rm.targetProgramIds.includes(roadmapProgramPick)
                              ? { ...rm, targetProgramIds: [...rm.targetProgramIds, roadmapProgramPick] }
                              : rm
                          )
                        );
                      }}
                      className="px-3 py-1.5 font-medium text-indigo-800 bg-indigo-50 hover:bg-indigo-100 rounded-lg border border-indigo-200 shrink-0"
                    >
                      + Tambah Prodi
                    </button>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2 min-w-0">
                  <div className="font-semibold text-slate-900">Target Jalur Karier Jalur Ini:</div>
                  <div className="flex flex-wrap gap-1.5">
                    {activeRoadmap.targetCareerIds.map((cid) => {
                      const car = careers.find((c) => c.id === cid);
                      return (
                        <span
                          key={cid}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-white border border-slate-200 text-slate-800"
                        >
                          <span>{car ? car.title : cid}</span>
                          <button
                            type="button"
                            aria-label={`Hapus target karier ${car?.title || cid}`}
                            onClick={() =>
                              setRoadmaps((prev) =>
                                prev.map((rm, idx) =>
                                  idx === activeRoadmapIdx
                                    ? {
                                        ...rm,
                                        targetCareerIds: rm.targetCareerIds.filter((x) => x !== cid),
                                      }
                                    : rm
                                )
                              )
                            }
                            className="text-slate-400 hover:text-red-700 font-bold"
                          >
                            ×
                          </button>
                        </span>
                      );
                    })}
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2 min-w-0">
                    <select
                      aria-label="Pilih karier untuk ditambahkan ke peta jalan"
                      value={roadmapCareerPick}
                      onChange={(e) => setRoadmapCareerPick(e.target.value)}
                      className="w-full sm:flex-1 min-w-0 max-w-full truncate px-2.5 py-1.5 border border-slate-300 rounded-lg bg-white"
                    >
                      {careers.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.title}
                        </option>
                      ))}
                    </select>
                    <button
                      type="button"
                      onClick={() => {
                        if (!roadmapCareerPick) return;
                        setRoadmaps((prev) =>
                          prev.map((rm, idx) =>
                            idx === activeRoadmapIdx && !rm.targetCareerIds.includes(roadmapCareerPick)
                              ? { ...rm, targetCareerIds: [...rm.targetCareerIds, roadmapCareerPick] }
                              : rm
                          )
                        );
                      }}
                      className="px-3 py-1.5 font-medium text-indigo-800 bg-indigo-50 hover:bg-indigo-100 rounded-lg border border-indigo-200 shrink-0"
                    >
                      + Tambah Karier
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-800 mb-1">
                  Pertanyaan Terbuka &amp; Catatan Eksplorasi Jalur Ini:
                </label>
                <textarea
                  rows={2}
                  value={activeRoadmap.openQuestions}
                  onChange={(e) => {
                    const val = e.target.value;
                    setRoadmaps((prev) =>
                      prev.map((rm, idx) =>
                        idx === activeRoadmapIdx ? { ...rm, openQuestions: val } : rm
                      )
                    );
                  }}
                  placeholder="Hal yang masih ingin dicari tahu lewat diskusi guru BK, senior kampus, atau magang singkat..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div className="space-y-3">
                {activeRoadmap.milestones.map((ms, mIdx) => (
                  <div
                    key={ms.id}
                    className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="font-semibold text-slate-900">{ms.stageTitle}</div>
                      <select
                        aria-label={`Status tahap ${ms.stageNumber}`}
                        value={ms.status}
                        onChange={(e) => {
                          const status = e.target.value as typeof ms.status;
                          setRoadmaps((prev) =>
                            prev.map((rm, idx) =>
                              idx === activeRoadmapIdx
                                ? {
                                    ...rm,
                                    milestones: rm.milestones.map((m, j) =>
                                      j === mIdx ? { ...m, status } : m
                                    ),
                                  }
                                : rm
                            )
                          );
                        }}
                        className="px-2.5 py-1 border border-slate-300 rounded bg-white"
                      >
                        <option value="Belum Dimulai">Belum Dimulai</option>
                        <option value="Sedang Berjalan">Sedang Berjalan</option>
                        <option value="Selesai">Selesai</option>
                      </select>
                    </div>
                    <input
                      type="text"
                      aria-label={`Target tahap ${ms.stageNumber}`}
                      value={ms.goal}
                      onChange={(e) => {
                        const goal = e.target.value;
                        setRoadmaps((prev) =>
                          prev.map((rm, idx) =>
                            idx === activeRoadmapIdx
                              ? {
                                  ...rm,
                                  milestones: rm.milestones.map((m, j) =>
                                    j === mIdx ? { ...m, goal } : m
                                  ),
                                }
                              : rm
                          )
                        );
                      }}
                      className="w-full px-3 py-1.5 border border-slate-300 rounded-lg bg-white"
                    />
                    <div className="space-y-1.5">
                      <div className="text-[11px] font-semibold text-slate-700">
                        Langkah Konkret ({ms.actionItems.length}):
                      </div>
                      {ms.actionItems.map((act, aIdx) => (
                        <div key={aIdx} className="flex items-center gap-2 min-w-0">
                          <input
                            type="text"
                            aria-label={`Langkah konkret ${aIdx + 1} tahap ${ms.stageNumber}`}
                            value={act}
                            onChange={(e) => {
                              const nextVal = e.target.value;
                              setRoadmaps((prev) =>
                                prev.map((rm, idx) =>
                                  idx === activeRoadmapIdx
                                    ? {
                                        ...rm,
                                        milestones: rm.milestones.map((m, j) =>
                                          j === mIdx
                                            ? {
                                                ...m,
                                                actionItems: m.actionItems.map((it, k) =>
                                                  k === aIdx ? nextVal : it
                                                ),
                                              }
                                            : m
                                        ),
                                      }
                                    : rm
                                )
                              );
                            }}
                            className="flex-1 min-w-0 px-2.5 py-1 border border-slate-300 rounded bg-white"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setRoadmaps((prev) =>
                                prev.map((rm, idx) =>
                                  idx === activeRoadmapIdx
                                    ? {
                                        ...rm,
                                        milestones: rm.milestones.map((m, j) =>
                                          j === mIdx
                                            ? {
                                                ...m,
                                                actionItems: m.actionItems.filter((_, k) => k !== aIdx),
                                              }
                                            : m
                                        ),
                                      }
                                    : rm
                                )
                              )
                            }
                            aria-label={`Hapus langkah ${aIdx + 1}`}
                            className="text-slate-400 hover:text-red-700 px-1.5 shrink-0"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                      <div className="flex flex-col sm:flex-row gap-2 min-w-0">
                        <input
                          type="text"
                          placeholder="Tambah langkah konkret baru..."
                          value={newActionItemText[ms.id] || ''}
                          onChange={(e) =>
                            setNewActionItemText((prev) => ({ ...prev, [ms.id]: e.target.value }))
                          }
                          className="w-full sm:flex-1 min-w-0 px-2.5 py-1 border border-slate-300 rounded bg-white"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const txt = (newActionItemText[ms.id] || '').trim();
                            if (!txt) return;
                            setRoadmaps((prev) =>
                              prev.map((rm, idx) =>
                                idx === activeRoadmapIdx
                                  ? {
                                      ...rm,
                                      milestones: rm.milestones.map((m, j) =>
                                        j === mIdx
                                          ? { ...m, actionItems: [...m.actionItems, txt] }
                                          : m
                                      ),
                                    }
                                  : rm
                              )
                            );
                            setNewActionItemText((prev) => ({ ...prev, [ms.id]: '' }));
                          }}
                          className="px-2.5 py-1 font-medium text-indigo-800 bg-indigo-50 hover:bg-indigo-100 rounded border border-indigo-200 shrink-0"
                        >
                          + Tambah Aksi
                        </button>
                      </div>
                    </div>
                    <input
                      type="text"
                      placeholder="Catatan kemajuan atau kendala..."
                      value={ms.notes}
                      onChange={(e) => {
                        const notes = e.target.value;
                        setRoadmaps((prev) =>
                          prev.map((rm, idx) =>
                            idx === activeRoadmapIdx
                              ? {
                                  ...rm,
                                  milestones: rm.milestones.map((m, j) =>
                                    j === mIdx ? { ...m, notes } : m
                                  ),
                                }
                              : rm
                          )
                        );
                      }}
                      className="w-full px-3 py-1.5 border border-slate-300 rounded-lg bg-white"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* MAJOR DETAIL MODAL (SECTION 8 & 9) */}
      {modalProgram && modalGapReport && (
        <MajorDetailModal
          program={modalProgram}
          university={uniMap.get(modalProgram.universityId) || null}
          gapReport={modalGapReport}
          relatedCareers={careers.filter((c) => c.relatedProgramIds.includes(modalProgram.id))}
          isBookmarked={bookmarkedProgramIds.includes(modalProgram.id)}
          onToggleBookmark={toggleBookmarkProgram}
          onAddToCompare={addProgramToCompare}
          onClose={() => setModalProgram(null)}
        />
      )}
    </div>
  );
};
