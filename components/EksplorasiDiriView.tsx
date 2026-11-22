import React, { useMemo, useState } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  Compass,
  GitBranch,
  HelpCircle,
  Layers,
  Lock,
  Plus,
  Save,
  SearchCheck,
  Trash2,
} from 'lucide-react';
import { EVIDENCE_EXERCISES } from '../data/conceptsAndPathsData';
import { MBTI_STACK_DYNAMICS_16 } from '../data/extendedTheoryData';
import { SOCIONICS_TYPES } from '../data/socionicsData';
import {
  analyzeTypologyConsistency,
  buildPersonalKnowledgeGraph,
  evaluateScenarioResponse,
} from '../lib/explorationEngine';
import { buildMultiLayerPersonalInterpretation } from '../lib/interpretationEngine';
import type {
  AcademicReflectionRecord,
  Account,
  EnneagramCore,
  ExplorationScenario,
  PersonalConceptStatus,
  Profile,
  QuadraName,
  ReflectionRecord,
  SocionicsCode,
  UserExplorationData,
} from '../types/dynamap';
import type { NavModuleId } from './BerandaView';
import { KnowledgeGraphCanvas } from './KnowledgeGraphCanvas';

interface EksplorasiDiriViewProps {
  account: Account | null;
  myProfile: Profile | null;
  exploration: UserExplorationData | null;
  scenarios: ExplorationScenario[];
  interpersonalReflections: ReflectionRecord[];
  academicReflections: AcademicReflectionRecord[];
  onSaveExploration: (next: Partial<UserExplorationData>) => Promise<void>;
  onNavigate: (moduleId: NavModuleId) => void;
  onOpenAuth: () => void;
}

const STATUS_OPTIONS: PersonalConceptStatus[] = [
  'Terkonfirmasi',
  'Hipotesis Provisional',
  'Alternatif Lain',
  'Belum Dijelajahi',
];

export const EksplorasiDiriView: React.FC<EksplorasiDiriViewProps> = ({
  account,
  myProfile,
  exploration,
  scenarios,
  interpersonalReflections,
  academicReflections,
  onSaveExploration,
  onNavigate,
  onOpenAuth,
}) => {
  const [tab, setTab] = useState<'peta' | 'ringkasan' | 'skenario' | 'konsistensi' | 'bukti'>('peta');
  const [statusFeedback, setStatusFeedback] = useState('');

  // Personal Map UI state
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>('pm-root');
  const [selectedEdgeId, setSelectedEdgeId] = useState<string | null>(null);
  const [focusMode, setFocusMode] = useState(false);
  const [frameworkFilter, setFrameworkFilter] = useState<string>('ALL');
  const [localLayout, setLocalLayout] = useState<Record<string, { x: number; y: number }>>(
    exploration?.preferredMapLayout || {}
  );
  const [newQuestionText, setNewQuestionText] = useState('');

  // Scenario C1 UI state
  const [activeScenarioId, setActiveScenarioId] = useState(scenarios[0]?.id || '');
  const [selectedOptionId, setSelectedOptionId] = useState('');
  const [useCustomResponse, setUseCustomResponse] = useState(false);
  const [customResponseText, setCustomResponseText] = useState('');
  const [scenarioReasoning, setScenarioReasoning] = useState('');
  const [simEnabled, setSimEnabled] = useState(false);
  const [simConfig, setSimConfig] = useState<{
    socionics: string;
    mbti: string;
    enneagramCore: string;
    temperament: string;
  }>({
    socionics: 'LII',
    mbti: 'INTP',
    enneagramCore: '5',
    temperament: 'Melancholic',
  });

  // Consistency C2 UI state
  const [hypInput, setHypInput] = useState({
    socionics: myProfile?.typology.socionics || '',
    quadra: (myProfile?.typology.quadra || '') as QuadraName | '',
    jungian: myProfile?.typology.jungian || '',
    enneagramCore: myProfile?.typology.enneagramCore ? String(myProfile.typology.enneagramCore) : '',
    instinct: myProfile?.typology.instinctVariant || '',
    tritype: myProfile?.typology.tritype || '',
    psychosophy: myProfile?.typology.psychosophyCode || '',
  });

  // Evidence Explorer C3 UI state
  const [activeExerciseId, setActiveExerciseId] = useState(EVIDENCE_EXERCISES[0]?.id || '');
  const [showPracticeAnswer, setShowPracticeAnswer] = useState<Record<string, boolean>>({});
  const [customEvidenceDraft, setCustomEvidenceDraft] = useState({
    observed: '',
    interpretation: '',
    alternative: '',
  });

  const mergedExploration = useMemo<UserExplorationData | null>(
    () =>
      exploration
        ? { ...exploration, preferredMapLayout: localLayout }
        : {
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
            preferredMapLayout: localLayout,
            roadmaps: [],
            updatedAt: '',
          },
    [exploration, localLayout]
  );

  const personalGraph = useMemo(
    () =>
      buildPersonalKnowledgeGraph({
        profile: myProfile,
        exploration: mergedExploration,
        interpersonalReflectionsCount: interpersonalReflections.length,
        academicReflectionsCount: academicReflections.length,
        isOwnerViewingPrivate: Boolean(account),
      }),
    [myProfile, mergedExploration, interpersonalReflections.length, academicReflections.length, account]
  );

  const filteredGraphNodes = useMemo(() => {
    if (frameworkFilter === 'ALL') return personalGraph.nodes;
    return personalGraph.nodes.filter(
      (n) => n.id === 'pm-root' || n.category === frameworkFilter
    );
  }, [personalGraph.nodes, frameworkFilter]);

  const filteredNodeIds = useMemo(
    () => new Set(filteredGraphNodes.map((n) => n.id)),
    [filteredGraphNodes]
  );

  const filteredGraphEdges = useMemo(
    () =>
      personalGraph.edges.filter(
        (e) => filteredNodeIds.has(e.sourceId) && filteredNodeIds.has(e.targetId)
      ),
    [personalGraph.edges, filteredNodeIds]
  );

  const selectedPersonalNode =
    personalGraph.nodes.find((n) => n.id === selectedNodeId) || null;
  const selectedPersonalEdge =
    personalGraph.edges.find((e) => e.id === selectedEdgeId) || null;

  const activeScenario = scenarios.find((s) => s.id === activeScenarioId) || scenarios[0];
  const scenarioEvaluation = useMemo(
    () =>
      activeScenario && !useCustomResponse && selectedOptionId
        ? evaluateScenarioResponse(activeScenario, selectedOptionId, scenarioReasoning)
        : null,
    [activeScenario, useCustomResponse, selectedOptionId, scenarioReasoning]
  );

  const myProfileInterpretation = useMemo(
    () => (myProfile ? buildMultiLayerPersonalInterpretation(myProfile) : null),
    [myProfile]
  );

  const simulatedProfileInterpretation = useMemo(() => {
    if (!simEnabled) return null;
    const socSpec = simConfig.socionics ? SOCIONICS_TYPES[simConfig.socionics as SocionicsCode] : undefined;
    const dummyProfile: Profile = {
      id: 'sim-preview',
      displayName: 'Profil Simulasi Alternatif',
      fullName: 'Konfigurasi Simulasi Alternatif',
      category: 'Siswa',
      affiliation: '',
      datasetOrigin: 'added',
      archived: false,
      visibility: 'private',
      exposeFullName: false,
      photoUrl: null,
      bio: '',
      academicInterests: [],
      collaborationPreferences: '',
      claimedByAccountId: null,
      typology: {
        socionics: (simConfig.socionics || '') as SocionicsCode | '',
        quadra: socSpec?.quadra || '',
        enneagramCore: simConfig.enneagramCore ? (Number(simConfig.enneagramCore) as EnneagramCore) : null,
        enneagramRaw: simConfig.enneagramCore || '',
        enneagramWing: '',
        instinctVariant: '',
        instinctStacking: '',
        threeFix: '',
        trifix: '',
        tritype: '',
        tritypeHeart: null,
        tritypeHead: null,
        tritypeGut: null,
        tritypeConvention: 'core-first',
        jungian: '',
        psychosophyCode: '',
        mbti: simConfig.mbti || undefined,
        temperament: simConfig.temperament || undefined,
        customPrefixes: [],
        status: 'Initial Typing',
        sourceNote: 'Self-reported information',
      },
      learningPreferences: {
        studySetting: '',
        explanationStyle: '',
        structureStyle: '',
        workMode: '',
        examplePreference: '',
        feedbackStyle: '',
        sessionLength: '',
        notes: '',
      },
      privacySettings: {
        displayName: 'private',
        fullName: 'private',
        avatar: 'private',
        typology: 'private',
        bio: 'private',
        reflections: 'private',
        idCard: 'private',
      },
      updatedAt: '',
    };
    return buildMultiLayerPersonalInterpretation(dummyProfile);
  }, [simEnabled, simConfig]);

  const consistencyResult = useMemo(
    () => analyzeTypologyConsistency(hypInput),
    [hypInput]
  );

  const activeExercise =
    EVIDENCE_EXERCISES.find((e) => e.id === activeExerciseId) || EVIDENCE_EXERCISES[0];

  async function handleSaveLayout() {
    if (!account) {
      onOpenAuth();
      return;
    }
    await onSaveExploration({ preferredMapLayout: localLayout });
    setStatusFeedback('Tata letak peta pemahaman diri berhasil disimpan.');
  }

  async function handleUpdateNodeStatus(nodeId: string, status: PersonalConceptStatus) {
    if (!account) {
      onOpenAuth();
      return;
    }
    const nextStatuses = {
      ...(exploration?.conceptStatuses || {}),
      [nodeId]: status,
    };
    await onSaveExploration({ conceptStatuses: nextStatuses });
    setStatusFeedback(`Status simpul diperbarui menjadi "${status}".`);
  }

  async function handleAddQuestion(e: React.FormEvent) {
    e.preventDefault();
    if (!newQuestionText.trim()) return;
    if (!account) {
      onOpenAuth();
      return;
    }
    const next = [newQuestionText.trim(), ...(exploration?.unresolvedQuestions || [])];
    await onSaveExploration({ unresolvedQuestions: next });
    setNewQuestionText('');
    setStatusFeedback('Pertanyaan terbuka baru ditambahkan ke daftar eksplorasi Anda.');
  }

  async function handleRemoveQuestion(idx: number) {
    if (!account || !exploration) return;
    const next = exploration.unresolvedQuestions.filter((_, i) => i !== idx);
    await onSaveExploration({ unresolvedQuestions: next });
  }

  async function handleSaveScenarioReflection() {
    if (!activeScenario) return;
    const hasCustom = useCustomResponse && customResponseText.trim().length > 0;
    if (!hasCustom && !scenarioEvaluation) return;
    if (!account) {
      onOpenAuth();
      return;
    }
    const next = [
      {
        id: `screfl-${Date.now()}`,
        scenarioId: activeScenario.id,
        scenarioTitle: activeScenario.title,
        selectedOptionId: hasCustom ? 'custom-response' : selectedOptionId,
        selectedOptionLabel: hasCustom
          ? `Respons Kustom: ${customResponseText.trim()}`
          : scenarioEvaluation!.optionLabel,
        userExplanation: scenarioReasoning.trim(),
        savedAt: new Date().toISOString(),
      },
      ...(exploration?.scenarioReflections || []),
    ];
    await onSaveExploration({ scenarioReflections: next });
    setStatusFeedback('Catatan skenario disimpan ke ruang eksplorasi privat Anda.');
  }

  return (
    <div className="space-y-6">
      {/* Header & Tabs */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-display font-bold text-slate-900">
              Eksplorasi Diri Lanjutan, Peta Pribadi &amp; Uji Konsistensi
            </h1>
            <p className="text-sm text-slate-600 mt-1 max-w-3xl">
              Hubungkan profil tipologi, preferensi belajar, minat akademik, serta refleksi nyata Anda dalam satu peta pengetahuan tanpa menetapkan label secara kaku.
            </p>
          </div>
          {!account && (
            <button
              type="button"
              onClick={onOpenAuth}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-white bg-indigo-700 hover:bg-indigo-800 rounded-lg whitespace-nowrap shrink-0"
            >
              <Lock className="w-3.5 h-3.5" />
              Masuk untuk Simpan Progres Pribadi
            </button>
          )}
        </div>

        <div className="flex flex-wrap gap-1.5 bg-slate-100 p-1 rounded-lg w-fit">
          {[
            { id: 'peta' as const, label: 'Peta Pemahaman Diri (A1)' },
            { id: 'ringkasan' as const, label: 'Dasbor Eksplorasi Pribadi (A2)' },
            { id: 'skenario' as const, label: 'Eksplorasi Skenario (C1)' },
            { id: 'konsistensi' as const, label: 'Uji Konsistensi & Kontradiksi (C2)' },
            { id: 'bukti' as const, label: 'Fakta vs Interpretasi (C3)' },
          ].map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setTab(item.id)}
              className={`px-3.5 py-2 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                tab === item.id ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {statusFeedback && (
        <div className="p-3.5 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-900">
          {statusFeedback}
        </div>
      )}

      {/* TAB A1: PERSONAL KNOWLEDGE GRAPH */}
      {tab === 'peta' && (
        <div className="space-y-4">
          <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-semibold text-slate-700">Saring Kategori:</span>
              <select
                aria-label="Saring kategori peta pribadi"
                value={frameworkFilter}
                onChange={(e) => setFrameworkFilter(e.target.value)}
                className="px-3 py-1.5 border border-slate-300 rounded-lg bg-white"
              >
                <option value="ALL">Seluruh Simpul Pribadi</option>
                <option value="Socionics">Socionics</option>
                <option value="Enneagram">Enneagram</option>
                <option value="Psikosofi">Psikosofi</option>
                <option value="Tipologi Jung">Tipologi Jung</option>
                <option value="Preferensi Belajar">Preferensi Belajar</option>
                <option value="Minat Akademik">Minat Akademik</option>
                <option value="Refleksi Pribadi">Refleksi Pribadi</option>
                <option value="Arah Eksplorasi">Arah Eksplorasi</option>
              </select>
            </div>
            <button
              type="button"
              onClick={handleSaveLayout}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 font-medium text-indigo-800 bg-indigo-50 hover:bg-indigo-100 rounded-lg whitespace-nowrap"
            >
              <Save className="w-3.5 h-3.5" />
              Simpan Tata Letak Peta
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-8">
              <KnowledgeGraphCanvas
                nodes={filteredGraphNodes.map((n) => ({
                  id: n.id,
                  label: n.label,
                  shortCode: n.shortCode,
                  group: n.category,
                  badgeText: n.status,
                  summary: n.summary,
                  x: n.x,
                  y: n.y,
                }))}
                edges={filteredGraphEdges}
                selectedNodeId={selectedNodeId}
                selectedEdgeId={selectedEdgeId}
                focusMode={focusMode}
                onToggleFocusMode={() => setFocusMode((f) => !f)}
                onSelectNode={(id) => {
                  setSelectedNodeId(id);
                  setSelectedEdgeId(null);
                }}
                onSelectEdge={(id) => {
                  setSelectedEdgeId(id);
                  setSelectedNodeId(null);
                }}
                onMoveNode={(nodeId, x, y) =>
                  setLocalLayout((prev) => ({ ...prev, [nodeId]: { x, y } }))
                }
              />
            </div>

            <div className="lg:col-span-4 bg-white border border-slate-200 rounded-xl p-5 space-y-4 text-xs">
              {selectedPersonalEdge ? (
                <>
                  <div className="font-semibold text-indigo-700">
                    Hubungan: {selectedPersonalEdge.relationshipType}
                  </div>
                  <h2 className="text-base font-display font-bold text-slate-900">
                    {selectedPersonalEdge.label}
                  </h2>
                  <p className="text-sm text-slate-700 leading-relaxed">
                    {selectedPersonalEdge.explanation}
                  </p>
                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-slate-600">
                    Hubungan lintas kerangka tidak berarti satu tipe memvalidasi atau menentukan tipe pada sistem lain.
                  </div>
                </>
              ) : selectedPersonalNode ? (
                <>
                  <div className="text-slate-500">
                    {selectedPersonalNode.frameworkOrSource} ·{' '}
                    <strong className="text-indigo-700">{selectedPersonalNode.status}</strong>
                  </div>
                  <h2 className="text-base font-display font-bold text-slate-900">
                    {selectedPersonalNode.label}
                  </h2>
                  <p className="text-sm text-slate-700 leading-relaxed">
                    {selectedPersonalNode.summary}
                  </p>

                  {selectedPersonalNode.id !== 'pm-root' && (
                    <div className="pt-3 border-t border-slate-200 space-y-2">
                      <label className="block font-semibold text-slate-800">
                        Status Eksplorasi Pribadi Anda:
                      </label>
                      <div className="grid grid-cols-2 gap-1.5">
                        {STATUS_OPTIONS.map((st) => (
                          <button
                            key={st}
                            type="button"
                            onClick={() => handleUpdateNodeStatus(selectedPersonalNode.id, st)}
                            className={`px-2.5 py-1.5 rounded-md border text-left font-medium transition-colors ${
                              selectedPersonalNode.status === st
                                ? 'bg-indigo-700 text-white border-indigo-700'
                                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                            }`}
                          >
                            {st}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedPersonalNode.targetModule && (
                    <button
                      type="button"
                      onClick={() => onNavigate(selectedPersonalNode.targetModule as NavModuleId)}
                      className="w-full py-2.5 px-3 font-medium text-indigo-800 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors"
                    >
                      Buka Modul Terkait
                    </button>
                  )}
                </>
              ) : (
                <p className="text-slate-500">
                  Klik salah satu simpul atau garis relasi pada peta untuk melihat penjelasan lengkapnya.
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB A2: CONSOLIDATED OVERVIEW */}
      {tab === 'ringkasan' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
              <h2 className="text-lg font-display font-semibold text-slate-900 flex items-center gap-2">
                <Compass className="w-5 h-5 text-indigo-700" />
                Ringkasan Profil &amp; Status Keyakinan Konsep
              </h2>
              <p className="text-xs text-slate-600">
                Sistem tidak pernah mengunci hipotesis Anda sebagai kebenaran tetap. Anda bebas menandai mana yang sedang dipakai, masih dugaan awal, atau alternatif yang ingin diuji lagi.
              </p>
              <div className="divide-y divide-slate-200 text-xs">
                {personalGraph.nodes
                  .filter((n) => n.id !== 'pm-root')
                  .map((n) => (
                    <div key={n.id} className="py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <div>
                        <div className="font-semibold text-slate-900">{n.label}</div>
                        <div className="text-slate-500 mt-0.5">{n.summary}</div>
                      </div>
                      <select
                        aria-label={`Ubah status ${n.label}`}
                        value={n.status}
                        onChange={(e) =>
                          handleUpdateNodeStatus(n.id, e.target.value as PersonalConceptStatus)
                        }
                        className="px-2.5 py-1.5 border border-slate-300 rounded-lg bg-white shrink-0"
                      >
                        {STATUS_OPTIONS.map((st) => (
                          <option key={st} value={st}>
                            {st}
                          </option>
                        ))}
                      </select>
                    </div>
                  ))}
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
              <h2 className="text-lg font-display font-semibold text-slate-900 flex items-center gap-2">
                <Layers className="w-5 h-5 text-indigo-700" />
                Sorotan Refleksi &amp; Skenario Privat
              </h2>
              {!account ? (
                <p className="text-xs text-slate-600">
                  Masuk terlebih dahulu untuk melihat riwayat refleksi interpersonal, akademik, serta catatan skenario milik Anda sendiri.
                </p>
              ) : (
                <div className="space-y-3 text-xs">
                  <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200">
                    <div className="font-semibold text-slate-900">
                      Refleksi Pengalaman: {interpersonalReflections.length} catatan interpersonal · {academicReflections.length} catatan akademik
                    </div>
                    <p className="text-slate-600 mt-1">
                      Seluruh refleksi bersifat privat bagi pemilik akun dan tidak dibagikan ke galeri publik maupun administrator.
                    </p>
                  </div>
                  {(exploration?.scenarioReflections || []).slice(0, 4).map((sr) => (
                    <div key={sr.id} className="p-3.5 rounded-lg border border-slate-200">
                      <div className="font-semibold text-slate-900">{sr.scenarioTitle}</div>
                      <div className="text-indigo-700 mt-0.5">{sr.selectedOptionLabel}</div>
                      {sr.userExplanation && (
                        <p className="text-slate-600 mt-1">Catatan: {sr.userExplanation}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
              <h2 className="text-lg font-display font-semibold text-slate-900 flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-indigo-700" />
                Pertanyaan Terbuka yang Belum Terjawab
              </h2>
              <form onSubmit={handleAddQuestion} className="flex gap-2 text-xs">
                <input
                  type="text"
                  value={newQuestionText}
                  onChange={(e) => setNewQuestionText(e.target.value)}
                  placeholder="Tulis pertanyaan refleksi untuk diuji lebih lanjut..."
                  className="flex-1 px-3 py-2 border border-slate-300 rounded-lg"
                />
                <button
                  type="submit"
                  className="inline-flex items-center gap-1 px-3 py-2 font-medium text-white bg-indigo-700 hover:bg-indigo-800 rounded-lg whitespace-nowrap"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Tambah
                </button>
              </form>
              <div className="divide-y divide-slate-200 text-xs">
                {(exploration?.unresolvedQuestions || []).length === 0 ? (
                  <p className="py-3 text-slate-500">
                    Belum ada pertanyaan terbuka tersimpan. Catat hal yang masih membingungkan agar eksplorasi Anda tetap terarah.
                  </p>
                ) : (
                  exploration!.unresolvedQuestions.map((q, idx) => (
                    <div key={idx} className="py-2.5 flex items-start justify-between gap-2">
                      <span className="text-slate-800 leading-relaxed">{q}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveQuestion(idx)}
                        aria-label="Hapus pertanyaan"
                        className="p-1 text-slate-400 hover:text-red-700 shrink-0"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-3 text-xs">
              <h3 className="text-base font-display font-semibold text-slate-900">
                Perbandingan Konsep Tersimpan ({exploration?.savedComparisons.length || 0})
              </h3>
              {(exploration?.savedComparisons || []).length === 0 ? (
                <p className="text-slate-500">
                  Simpan pasangan konsep dari modul Peta &amp; Perbandingan Konsep untuk ditinjau kapan saja dari sini.
                </p>
              ) : (
                <ul className="space-y-2">
                  {exploration!.savedComparisons.map((cmp) => (
                    <li key={cmp.id} className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                      <div className="font-semibold text-slate-900">{cmp.title}</div>
                      {cmp.note && <div className="text-slate-600 mt-0.5">{cmp.note}</div>}
                    </li>
                  ))}
                </ul>
              )}
              <button
                type="button"
                onClick={() => onNavigate('peta-konsep')}
                className="w-full py-2 font-medium text-indigo-800 bg-indigo-50 hover:bg-indigo-100 rounded-lg"
              >
                Buka Modul Perbandingan Konsep
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB C1: MULTI-FRAMEWORK SCENARIO SIMULATOR */}
      {tab === 'skenario' && activeScenario && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-4 space-y-2">
            {scenarios.map((sc) => (
              <button
                key={sc.id}
                type="button"
                onClick={() => {
                  setActiveScenarioId(sc.id);
                  setSelectedOptionId('');
                  setUseCustomResponse(false);
                  setCustomResponseText('');
                  setScenarioReasoning('');
                }}
                className={`w-full text-left p-4 rounded-xl border transition-colors ${
                  sc.id === activeScenario.id
                    ? 'bg-indigo-50 border-indigo-400'
                    : 'bg-white border-slate-200 hover:border-indigo-200'
                }`}
              >
                <div className="text-[11px] font-medium text-indigo-700">{sc.category}</div>
                <div className="text-sm font-display font-semibold text-slate-900 mt-1">
                  {sc.title}
                </div>
              </button>
            ))}
          </div>

          <div className="lg:col-span-8 bg-white border border-slate-200 rounded-xl p-6 space-y-5">
            <div>
              <div className="text-xs font-medium text-indigo-700">{activeScenario.category}</div>
              <h2 className="text-xl font-display font-bold text-slate-900 mt-1">
                {activeScenario.title}
              </h2>
              <p className="text-sm text-slate-700 leading-relaxed mt-2">
                {activeScenario.context}
              </p>
            </div>

            <div className="space-y-2.5">
              <div className="text-xs font-semibold text-slate-900">
                {activeScenario.dilemmaPrompt}
              </div>
              {activeScenario.options.map((opt) => (
                <label
                  key={opt.id}
                  className={`block p-3.5 rounded-lg border cursor-pointer transition-colors text-xs ${
                    !useCustomResponse && selectedOptionId === opt.id
                      ? 'bg-indigo-50 border-indigo-400 text-slate-900'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    <input
                      type="radio"
                      name="scenario-choice"
                      checked={!useCustomResponse && selectedOptionId === opt.id}
                      onChange={() => {
                        setUseCustomResponse(false);
                        setSelectedOptionId(opt.id);
                      }}
                      className="mt-0.5"
                    />
                    <div>
                      <div className="font-medium leading-relaxed">{opt.label}</div>
                      <div className="text-[11px] text-indigo-700 mt-1">
                        {opt.tag} · Sifat respons: {opt.contextualNature}
                      </div>
                    </div>
                  </div>
                </label>
              ))}

              {/* Custom free-text response composer */}
              <div
                className={`p-3.5 rounded-lg border text-xs space-y-2 transition-colors ${
                  useCustomResponse
                    ? 'bg-indigo-50 border-indigo-400 text-slate-900'
                    : 'bg-slate-50 border-slate-200 text-slate-700'
                }`}
              >
                <label className="flex items-center gap-2 font-semibold cursor-pointer">
                  <input
                    type="radio"
                    name="scenario-choice"
                    checked={useCustomResponse}
                    onChange={() => setUseCustomResponse(true)}
                  />
                  <span>Atau Tulis Respons Kustom Anda Sendiri</span>
                </label>
                {useCustomResponse && (
                  <textarea
                    rows={2}
                    value={customResponseText}
                    onChange={(e) => setCustomResponseText(e.target.value)}
                    placeholder="Contoh: Saya akan mengajak tim berhenti 10 menit untuk menyepakati batas waktu tiap bagian sebelum membagi ulang tugas..."
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg"
                  />
                )}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1">
                Jelaskan Alasan di Balik Pilihan Anda (Opsional tetapi sangat membantu refleksi):
              </label>
              <textarea
                rows={2}
                value={scenarioReasoning}
                onChange={(e) => setScenarioReasoning(e.target.value)}
                placeholder="Misalnya: Saya memilih respons itu karena sebelumnya kelompok kami pernah gagal tepat waktu..."
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
              />
            </div>

            {/* Multi-framework evaluation for preset OR custom response */}
            {(scenarioEvaluation || (useCustomResponse && customResponseText.trim().length > 0)) && (
              <div className="pt-4 border-t border-slate-200 space-y-4 text-xs">
                {scenarioEvaluation ? (
                  <>
                    <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-2">
                      <div className="font-semibold text-slate-900">1. Indikasi Awal yang Teramati</div>
                      <ul className="list-disc pl-4 space-y-1 text-slate-700">
                        {scenarioEvaluation.indications.map((ind, i) => (
                          <li key={i}>{ind}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="p-4 rounded-lg border border-slate-200 space-y-2">
                        <div className="font-semibold text-slate-900">2. Konsep Teori Terkait</div>
                        <div className="space-y-1.5">
                          {scenarioEvaluation.relevantConcepts.map((rc) => (
                            <button
                              key={rc.conceptId}
                              type="button"
                              onClick={() => onNavigate(rc.targetModule as NavModuleId)}
                              className="block w-full text-left p-2 rounded bg-indigo-50 hover:bg-indigo-100 text-indigo-900"
                            >
                              <strong>{rc.label}</strong> ({rc.framework}) → Baca penjelasan
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="p-4 rounded-lg border border-slate-200 space-y-2">
                        <div className="font-semibold text-slate-900">3. Penjelasan Alternatif Non-Tipologi</div>
                        <ul className="list-disc pl-4 space-y-1 text-slate-700">
                          {scenarioEvaluation.alternativeExplanations.map((alt, i) => (
                            <li key={i}>{alt}</li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="p-4 rounded-lg border border-slate-200 space-y-2">
                      <div className="font-semibold text-slate-900">4. Pertanyaan Refleksi Lanjutan</div>
                      <ul className="list-disc pl-4 space-y-1 text-slate-700">
                        {scenarioEvaluation.followUpQuestions.map((fq, i) => (
                          <li key={i}>{fq}</li>
                        ))}
                      </ul>
                      <p className="pt-2 border-t border-slate-200 text-slate-500">
                        <strong>Batasan Penilaian:</strong> {scenarioEvaluation.limitations}
                      </p>
                    </div>
                  </>
                ) : (
                  <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-2">
                    <div className="font-semibold text-slate-900">
                      1. Tinjauan Respons Kustom Anda
                    </div>
                    <p className="text-slate-700 leading-relaxed">
                      Anda merumuskan tindakan: <em>&ldquo;{customResponseText.trim()}&rdquo;</em>. Gunakan lensa multi-kerangka di bawah untuk mengecek apakah dorongan di balik kalimat Anda lebih berakar pada kejelasan struktur logika, keteraturan eksekusi, perlindungan atmosfer kelompok, atau kebutuhan otonomi pribadi.
                    </p>
                  </div>
                )}

                {/* Comparison against myProfile multi-framework interpretation */}
                <div className="p-4 rounded-lg bg-indigo-50/70 border border-indigo-200 space-y-2.5">
                  <div className="font-semibold text-indigo-950">
                    2. Perbandingan dengan Profil Tipologi Anda Saat Ini
                  </div>
                  {myProfile && myProfileInterpretation ? (
                    <div className="space-y-2 text-slate-800">
                      <p className="text-slate-600">
                        Berdasarkan profil <strong>{myProfile.displayName}</strong> ({myProfileInterpretation.completenessRatio}% kelengkapan data · {myProfileInterpretation.filledFrameworks.length} kerangka terisi):
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {myProfileInterpretation.overviewStatements
                          .filter((st) =>
                            ['Gaya Komunikasi', 'Pengambilan Keputusan', 'Tensi Internal & Keseimbangan'].includes(st.topic)
                          )
                          .map((st) => (
                            <div key={st.topic} className="p-2.5 rounded bg-white border border-indigo-100">
                              <div className="font-semibold text-indigo-900">{st.topic}</div>
                              <p className="text-[11px] text-slate-700 mt-1 leading-relaxed">{st.statement}</p>
                            </div>
                          ))}
                      </div>
                    </div>
                  ) : (
                    <p className="text-slate-700">
                      Klaim atau masuk ke profil siswa Anda untuk melihat perbandingan langsung antara respons ini dan sintesis multi-kerangka pribadi Anda.
                    </p>
                  )}
                </div>

                {/* Alternative Typology Simulation Toggle */}
                <div className="p-4 rounded-lg border border-slate-200 space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <div className="font-semibold text-slate-900">
                        3. Simulasi Konfigurasi Tipologi Alternatif &amp; Konsekuensi Komunikasi
                      </div>
                      <p className="text-[11px] text-slate-500">
                        Bandingkan bagaimana konfigurasi tipologi lain mungkin menafsirkan respons Anda pada skenario ini.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSimEnabled((v) => !v)}
                      className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap border ${
                        simEnabled
                          ? 'bg-indigo-700 text-white border-indigo-700'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {simEnabled ? 'Tutup Simulasi Alternatif' : 'Aktifkan Simulasi Alternatif'}
                    </button>
                  </div>

                  {simEnabled && (
                    <div className="space-y-3 pt-2 border-t border-slate-200">
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        <div>
                          <label className="block text-[11px] font-medium text-slate-600 mb-1">Socionics</label>
                          <select
                            value={simConfig.socionics}
                            onChange={(e) => setSimConfig((c) => ({ ...c, socionics: e.target.value }))}
                            className="w-full px-2 py-1.5 border border-slate-300 rounded-md bg-white"
                          >
                            {(Object.keys(SOCIONICS_TYPES) as SocionicsCode[]).map((code) => (
                              <option key={code} value={code}>
                                {code} ({SOCIONICS_TYPES[code].quadra})
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-[11px] font-medium text-slate-600 mb-1">MBTI</label>
                          <select
                            value={simConfig.mbti}
                            onChange={(e) => setSimConfig((c) => ({ ...c, mbti: e.target.value }))}
                            className="w-full px-2 py-1.5 border border-slate-300 rounded-md bg-white"
                          >
                            {Object.keys(MBTI_STACK_DYNAMICS_16).map((code) => (
                              <option key={code} value={code}>
                                {code}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-[11px] font-medium text-slate-600 mb-1">Enneagram</label>
                          <select
                            value={simConfig.enneagramCore}
                            onChange={(e) => setSimConfig((c) => ({ ...c, enneagramCore: e.target.value }))}
                            className="w-full px-2 py-1.5 border border-slate-300 rounded-md bg-white"
                          >
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
                              <option key={n} value={n}>
                                Tipe {n}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-[11px] font-medium text-slate-600 mb-1">Temperamen</label>
                          <select
                            value={simConfig.temperament}
                            onChange={(e) => setSimConfig((c) => ({ ...c, temperament: e.target.value }))}
                            className="w-full px-2 py-1.5 border border-slate-300 rounded-md bg-white"
                          >
                            <option value="Choleric">Choleric</option>
                            <option value="Sanguine">Sanguine</option>
                            <option value="Melancholic">Melancholic</option>
                            <option value="Phlegmatic">Phlegmatic</option>
                          </select>
                        </div>
                      </div>

                      {simulatedProfileInterpretation && (
                        <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 space-y-2">
                          <div className="font-semibold text-slate-900">
                            Bagaimana konfigurasi {simConfig.socionics} · {simConfig.mbti} · Ennea {simConfig.enneagramCore} · {simConfig.temperament} membaca skenario ini:
                          </div>
                          {simulatedProfileInterpretation.overviewStatements
                            .filter((st) =>
                              ['Gaya Komunikasi', 'Potensi Kesalahpahaman', 'Kebutuhan Interpersonal'].includes(st.topic)
                            )
                            .map((st) => (
                              <div key={st.topic} className="text-slate-700 leading-relaxed">
                                <strong className="text-slate-900">{st.topic}:</strong> {st.statement}
                              </div>
                            ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  onClick={handleSaveScenarioReflection}
                  className="inline-flex items-center gap-1.5 px-4 py-2 font-medium text-white bg-indigo-700 hover:bg-indigo-800 rounded-lg whitespace-nowrap"
                >
                  <Save className="w-3.5 h-3.5" />
                  Simpan Respons ke Refleksi Skenario Pribadi
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB C2: CONSISTENCY & CONTRADICTION ANALYZER */}
      {tab === 'konsistensi' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-6 space-y-4 text-xs">
            <div className="flex items-center justify-between gap-2">
              <h2 className="text-lg font-display font-semibold text-slate-900">
                Uji Kombinasi Hipotesis Anda
              </h2>
              {myProfile && (
                <button
                  type="button"
                  onClick={() =>
                    setHypInput({
                      socionics: myProfile.typology.socionics || '',
                      quadra: myProfile.typology.quadra || '',
                      jungian: myProfile.typology.jungian || '',
                      enneagramCore: myProfile.typology.enneagramCore
                        ? String(myProfile.typology.enneagramCore)
                        : '',
                      instinct: myProfile.typology.instinctVariant || '',
                      tritype: myProfile.typology.tritype || '',
                      psychosophy: myProfile.typology.psychosophyCode || '',
                    })
                  }
                  className="text-indigo-700 hover:underline font-medium"
                >
                  Muat dari Profil Saya
                </button>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-medium text-slate-700 mb-1">Socionics</label>
                <select
                  value={hypInput.socionics}
                  onChange={(e) => setHypInput({ ...hypInput, socionics: e.target.value })}
                  className="w-full px-2.5 py-2 border border-slate-300 rounded-lg bg-white"
                >
                  <option value="">Kosong</option>
                  {(Object.keys(SOCIONICS_TYPES) as SocionicsCode[]).map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block font-medium text-slate-700 mb-1">Quadra</label>
                <select
                  value={hypInput.quadra}
                  onChange={(e) =>
                    setHypInput({ ...hypInput, quadra: e.target.value as QuadraName | '' })
                  }
                  className="w-full px-2.5 py-2 border border-slate-300 rounded-lg bg-white"
                >
                  <option value="">Kosong</option>
                  <option value="Alpha">Alpha</option>
                  <option value="Beta">Beta</option>
                  <option value="Gamma">Gamma</option>
                  <option value="Delta">Delta</option>
                </select>
              </div>
              <div>
                <label className="block font-medium text-slate-700 mb-1">Enneagram Inti</label>
                <select
                  value={hypInput.enneagramCore}
                  onChange={(e) => setHypInput({ ...hypInput, enneagramCore: e.target.value })}
                  className="w-full px-2.5 py-2 border border-slate-300 rounded-lg bg-white"
                >
                  <option value="">Kosong</option>
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
                    <option key={n} value={n}>
                      Tipe {n}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block font-medium text-slate-700 mb-1">Insting Dominan</label>
                <select
                  value={hypInput.instinct}
                  onChange={(e) => setHypInput({ ...hypInput, instinct: e.target.value })}
                  className="w-full px-2.5 py-2 border border-slate-300 rounded-lg bg-white"
                >
                  <option value="">Kosong</option>
                  <option value="SP">SP</option>
                  <option value="SO">SO</option>
                  <option value="SX">SX</option>
                </select>
              </div>
              <div>
                <label className="block font-medium text-slate-700 mb-1">Tritype (3 angka)</label>
                <input
                  type="text"
                  placeholder="Mis. 351"
                  value={hypInput.tritype}
                  onChange={(e) => setHypInput({ ...hypInput, tritype: e.target.value })}
                  className="w-full px-2.5 py-2 border border-slate-300 rounded-lg font-mono"
                />
              </div>
              <div>
                <label className="block font-medium text-slate-700 mb-1">Psikosofi (L·V·E·F)</label>
                <input
                  type="text"
                  maxLength={4}
                  placeholder="Mis. LVEF"
                  value={hypInput.psychosophy}
                  onChange={(e) =>
                    setHypInput({ ...hypInput, psychosophy: e.target.value.toUpperCase() })
                  }
                  className="w-full px-2.5 py-2 border border-slate-300 rounded-lg font-mono uppercase"
                />
              </div>
              <div className="col-span-2">
                <label className="block font-medium text-slate-700 mb-1">Notasi Jungian</label>
                <input
                  type="text"
                  placeholder="Mis. ET(N)"
                  value={hypInput.jungian}
                  onChange={(e) => setHypInput({ ...hypInput, jungian: e.target.value })}
                  className="w-full px-2.5 py-2 border border-slate-300 rounded-lg font-mono"
                />
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-6 space-y-4 text-xs">
            <h2 className="text-lg font-display font-semibold text-slate-900 flex items-center gap-2">
              <GitBranch className="w-5 h-5 text-indigo-700" />
              Laporan 6 Bagian — Konsistensi &amp; Independensi Kerangka
            </h2>

            <div className="space-y-2">
              <div className="font-semibold text-slate-900">1. Validasi Notasi Kode</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {consistencyResult.notationValidations.map((nv) => (
                  <div
                    key={nv.framework}
                    className={`p-3 rounded-lg border ${
                      nv.status === 'Tidak Valid'
                        ? 'bg-red-50 border-red-200 text-red-900'
                        : nv.status === 'Valid'
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                        : 'bg-slate-50 border-slate-200 text-slate-600'
                    }`}
                  >
                    <div className="font-semibold flex items-center justify-between">
                      <span>{nv.framework}: {nv.input}</span>
                      <span>{nv.status}</span>
                    </div>
                    <p className="mt-1 opacity-90">{nv.message}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 space-y-1.5">
              <div className="font-semibold text-slate-900">2. Konsistensi Internal Masing-Masing Sistem</div>
              {consistencyResult.internalConsistencyNotes.map((n, i) => (
                <p key={i} className="text-slate-700 leading-relaxed">{n}</p>
              ))}
            </div>

            <div className="p-3.5 rounded-lg border border-slate-200 space-y-1.5">
              <div className="font-semibold text-slate-900">3. Pembedaan Konsep yang Sering Tertukar</div>
              {consistencyResult.conceptualDistinctions.map((n, i) => (
                <p key={i} className="text-slate-700 leading-relaxed">{n}</p>
              ))}
            </div>

            <div className="p-3.5 rounded-lg bg-amber-50 border border-amber-200 space-y-1.5 text-amber-950">
              <div className="font-semibold flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4" />
                4. Prinsip Independensi Lintas Kerangka (Tidak Ada "Kombinasi Mustahil")
              </div>
              <ul className="list-disc pl-4 space-y-1">
                {consistencyResult.crossFrameworkIndependence.map((n, i) => (
                  <li key={i}>{n}</li>
                ))}
              </ul>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3.5 rounded-lg border border-slate-200 space-y-1">
                <div className="font-semibold text-slate-900">5. Hipotesis Alternatif</div>
                <ul className="list-disc pl-4 space-y-1 text-slate-700">
                  {consistencyResult.alternativeHypotheses.map((h, i) => (
                    <li key={i}>{h}</li>
                  ))}
                </ul>
              </div>
              <div className="p-3.5 rounded-lg border border-slate-200 space-y-1">
                <div className="font-semibold text-slate-900">6. Pertanyaan Eksplorasi Lanjutan</div>
                <ul className="list-disc pl-4 space-y-1 text-slate-700">
                  {consistencyResult.furtherExplorationQuestions.map((q, i) => (
                    <li key={i}>{q}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB C3: EVIDENCE & INTERPRETATION EXPLORER */}
      {tab === 'bukti' && activeExercise && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-4 space-y-2">
              {EVIDENCE_EXERCISES.map((ex) => (
                <button
                  key={ex.id}
                  type="button"
                  onClick={() => setActiveExerciseId(ex.id)}
                  className={`w-full text-left p-4 rounded-xl border transition-colors ${
                    ex.id === activeExercise.id
                      ? 'bg-indigo-50 border-indigo-400'
                      : 'bg-white border-slate-200 hover:border-indigo-200'
                  }`}
                >
                  <div className="text-sm font-display font-semibold text-slate-900">
                    {ex.title}
                  </div>
                </button>
              ))}
            </div>

            <div className="lg:col-span-8 bg-white border border-slate-200 rounded-xl p-6 space-y-4 text-xs">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-lg font-display font-bold text-slate-900">
                    {activeExercise.title}
                  </h2>
                  <p className="text-sm text-slate-700 mt-2 leading-relaxed">
                    {activeExercise.scenarioText}
                  </p>
                </div>
                <SearchCheck className="w-6 h-6 text-indigo-700 shrink-0" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3.5 rounded-lg bg-emerald-50 border border-emerald-200 space-y-1.5">
                  <div className="font-semibold text-emerald-950">
                    1. Perilaku yang Benar-Benar Teramati (Fakta)
                  </div>
                  <ul className="list-disc pl-4 space-y-1 text-emerald-900">
                    {activeExercise.observedBehaviors.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>

                <div className="p-3.5 rounded-lg bg-amber-50 border border-amber-200 space-y-1.5">
                  <div className="font-semibold text-amber-950">
                    2. Interpretasi Spontan yang Perlu Diwaspadai
                  </div>
                  <ul className="list-disc pl-4 space-y-1 text-amber-900">
                    {activeExercise.possibleInterpretations.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <button
                type="button"
                onClick={() =>
                  setShowPracticeAnswer((prev) => ({
                    ...prev,
                    [activeExercise.id]: !prev[activeExercise.id],
                  }))
                }
                className="inline-flex items-center gap-1.5 px-4 py-2 font-medium text-white bg-indigo-700 hover:bg-indigo-800 rounded-lg"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                {showPracticeAnswer[activeExercise.id]
                  ? 'Sembunyikan Bedah Lanjutan'
                  : 'Tampilkan Hipotesis Tipologi, Alternatif Non-Tipologi & Bukti Tambahan'}
              </button>

              {showPracticeAnswer[activeExercise.id] && (
                <div className="space-y-3 pt-2 border-t border-slate-200">
                  <div className="p-3.5 rounded-lg border border-slate-200 space-y-1">
                    <div className="font-semibold text-slate-900">3. Hipotesis Tipologis (Sementara)</div>
                    <ul className="list-disc pl-4 space-y-1 text-slate-700">
                      {activeExercise.typologicalHypotheses.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="p-3.5 rounded-lg border border-slate-200 space-y-1">
                    <div className="font-semibold text-slate-900">4. Penjelasan Alternatif di Luar Tipologi</div>
                    <ul className="list-disc pl-4 space-y-1 text-slate-700">
                      {activeExercise.alternativeNonTypologicalExplanations.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="p-3.5 rounded-lg bg-indigo-50 border border-indigo-200 space-y-1">
                    <div className="font-semibold text-indigo-950">5. Bukti Tambahan yang Wajib Dikumpulkan</div>
                    <ul className="list-disc pl-4 space-y-1 text-indigo-900">
                      {activeExercise.requiredAdditionalEvidence.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {/* Mini practice form */}
              <div className="pt-4 border-t border-slate-200 space-y-2">
                <div className="font-semibold text-slate-900">
                  Latih Membedah Kejadian Nyata Anda Sendiri:
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <input
                    type="text"
                    placeholder="Fakta teramati (apa yang persis diucap/dilakukan)"
                    value={customEvidenceDraft.observed}
                    onChange={(e) =>
                      setCustomEvidenceDraft({ ...customEvidenceDraft, observed: e.target.value })
                    }
                    className="px-3 py-2 border border-slate-300 rounded-lg"
                  />
                  <input
                    type="text"
                    placeholder="Interpretasi awal saya"
                    value={customEvidenceDraft.interpretation}
                    onChange={(e) =>
                      setCustomEvidenceDraft({
                        ...customEvidenceDraft,
                        interpretation: e.target.value,
                      })
                    }
                    className="px-3 py-2 border border-slate-300 rounded-lg"
                  />
                  <input
                    type="text"
                    placeholder="Alternatif non-tipologi (lelah, salah paham, jadwal)"
                    value={customEvidenceDraft.alternative}
                    onChange={(e) =>
                      setCustomEvidenceDraft({
                        ...customEvidenceDraft,
                        alternative: e.target.value,
                      })
                    }
                    className="px-3 py-2 border border-slate-300 rounded-lg"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
