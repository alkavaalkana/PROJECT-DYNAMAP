import React, { useMemo, useState } from 'react';
import {
  AlertTriangle,
  ArrowRight,
  Bookmark,
  CheckCircle2,
  GitCompare,
  GraduationCap,
  Layers,
  Network,
  Save,
  Search,
} from 'lucide-react';
import { CURATED_COMPARISONS } from '../data/conceptsAndPathsData';
import { CROSS_FRAMEWORK_COMPARISONS } from '../data/extendedTheoryData';
import { compareConceptsStructured } from '../lib/explorationEngine';
import type {
  Account,
  ConceptEdge,
  ConceptNode,
  LearningPathDefinition,
  UserExplorationData,
} from '../types/dynamap';
import type { NavModuleId } from './BerandaView';
import { KnowledgeGraphCanvas } from './KnowledgeGraphCanvas';

interface PetaKonsepViewProps {
  account: Account | null;
  concepts: ConceptNode[];
  conceptEdges: ConceptEdge[];
  learningPaths: LearningPathDefinition[];
  exploration: UserExplorationData | null;
  readTopics?: string[];
  onMarkTopicRead?: (topicId: string) => void;
  onSaveExploration: (next: Partial<UserExplorationData>) => Promise<void>;
  onNavigate: (moduleId: NavModuleId) => void;
  onOpenAuth: () => void;
}

export const PetaKonsepView: React.FC<PetaKonsepViewProps> = ({
  account,
  concepts,
  conceptEdges,
  learningPaths,
  exploration,
  readTopics = [],
  onMarkTopicRead,
  onSaveExploration,
  onNavigate,
  onOpenAuth,
}) => {
  const [tab, setTab] = useState<'perbandingan' | 'lintas-kerangka' | 'peta-hubungan' | 'jalur-belajar'>('perbandingan');
  const [selectedPairId, setSelectedPairId] = useState<string>(CROSS_FRAMEWORK_COMPARISONS[0].id);
  const [statusMsg, setStatusMsg] = useState('');

  // B1 Concept Comparison state
  const [conceptA, setConceptA] = useState(concepts[0]?.id || 'soc-te');
  const [conceptB, setConceptB] = useState(concepts[1]?.id || 'soc-ti');
  const [comparisonSearch, setComparisonSearch] = useState('');
  const [comparisonNote, setComparisonNote] = useState('');

  // B2 Concept Graph state
  const [graphFrameworkFilter, setGraphFrameworkFilter] = useState<string>('ALL');
  const [graphSearch, setGraphSearch] = useState('');
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(concepts[0]?.id || null);
  const [selectedEdgeId, setSelectedEdgeId] = useState<string | null>(null);
  const [focusMode, setFocusMode] = useState(false);

  // B3 Guided Learning Path state
  const [activePathId, setActivePathId] = useState(learningPaths[0]?.id || 'lp-socionics');

  const comparisonResult = useMemo(
    () => compareConceptsStructured(conceptA, conceptB, concepts, CURATED_COMPARISONS),
    [conceptA, conceptB, concepts]
  );

  const filteredConceptOptions = useMemo(() => {
    const q = comparisonSearch.trim().toLowerCase();
    if (!q) return concepts;
    return concepts.filter(
      (c) =>
        c.label.toLowerCase().includes(q) ||
        c.shortCode.toLowerCase().includes(q) ||
        c.framework.toLowerCase().includes(q)
    );
  }, [concepts, comparisonSearch]);

  const filteredMapNodes = useMemo(() => {
    const q = graphSearch.trim().toLowerCase();
    return concepts.filter((c) => {
      if (graphFrameworkFilter !== 'ALL' && c.framework !== graphFrameworkFilter) return false;
      if (q) {
        return (
          c.label.toLowerCase().includes(q) ||
          c.shortCode.toLowerCase().includes(q) ||
          c.summary.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [concepts, graphFrameworkFilter, graphSearch]);

  const mapNodeIdSet = useMemo(() => new Set(filteredMapNodes.map((n) => n.id)), [filteredMapNodes]);
  const filteredMapEdges = useMemo(
    () =>
      conceptEdges.filter((e) => mapNodeIdSet.has(e.sourceId) && mapNodeIdSet.has(e.targetId)),
    [conceptEdges, mapNodeIdSet]
  );

  const selectedMapNode = concepts.find((c) => c.id === selectedNodeId) || null;
  const selectedMapEdge = conceptEdges.find((e) => e.id === selectedEdgeId) || null;

  const activePath = learningPaths.find((lp) => lp.id === activePathId) || learningPaths[0];
  const completedSteps = new Set(exploration?.completedLearningSteps || []);
  const bookmarkedSteps = new Set(exploration?.bookmarkedLearningSteps || []);

  async function handleSaveComparison() {
    if (!comparisonResult) return;
    if (!account) {
      onOpenAuth();
      return;
    }
    const next = [
      {
        id: `scmp-${Date.now()}`,
        conceptIds: comparisonResult.conceptIds,
        title: comparisonResult.title,
        note: comparisonNote.trim(),
        savedAt: new Date().toISOString(),
      },
      ...(exploration?.savedComparisons || []),
    ];
    await onSaveExploration({ savedComparisons: next });
    setComparisonNote('');
    setStatusMsg(`Perbandingan "${comparisonResult.title}" tersimpan di Dasbor Eksplorasi Pribadi.`);
  }

  async function toggleLearningStepDone(stepId: string) {
    if (!account) {
      onOpenAuth();
      return;
    }
    const current = new Set(exploration?.completedLearningSteps || []);
    if (current.has(stepId)) current.delete(stepId);
    else current.add(stepId);
    await onSaveExploration({ completedLearningSteps: Array.from(current) });
  }

  async function toggleLearningStepBookmark(stepId: string) {
    if (!account) {
      onOpenAuth();
      return;
    }
    const current = new Set(exploration?.bookmarkedLearningSteps || []);
    if (current.has(stepId)) current.delete(stepId);
    else current.add(stepId);
    await onSaveExploration({ bookmarkedLearningSteps: Array.from(current) });
  }

  function launchPairComparison(id1: string, id2: string) {
    setConceptA(id1);
    setConceptB(id2);
    setTab('perbandingan');
  }

  return (
    <div className="space-y-6">
      <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-slate-900">
            Perbandingan Konsep, Peta Hubungan &amp; Jalur Belajar Terpandu
          </h1>
          <p className="text-sm text-slate-600 mt-1 max-w-3xl">
            Bandingkan konsep di dalam maupun lintas kerangka dengan memisahkan kemiripan permukaan dari mekanisme teori, telusuri peta relasi konseptual, atau ikuti jalur belajar bertahap.
          </p>
        </div>

        <div className="flex flex-wrap gap-1.5 bg-slate-100 p-1 rounded-lg w-fit">
          {[
            { id: 'perbandingan' as const, label: 'Perbandingan Konsep (B1)', icon: GitCompare },
            { id: 'lintas-kerangka' as const, label: 'Komparasi Lintas Kerangka (6 Pasangan)', icon: Layers },
            { id: 'peta-hubungan' as const, label: 'Peta Hubungan Konsep (B2)', icon: Network },
            { id: 'jalur-belajar' as const, label: 'Jalur Belajar Terpandu (B3)', icon: GraduationCap },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setTab(item.id)}
                className={`inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                  tab === item.id ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
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

      {/* TAB B1: CONCEPT COMPARISON */}
      {tab === 'perbandingan' && (
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4 text-xs">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="font-semibold text-slate-900 text-sm">
                Pilih Dua Konsep untuk Dibandingkan
              </div>
              <div className="relative w-full sm:w-64">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="search"
                  value={comparisonSearch}
                  onChange={(e) => setComparisonSearch(e.target.value)}
                  placeholder="Cari kode atau istilah konsep..."
                  className="w-full pl-8 pr-3 py-1.5 border border-slate-300 rounded-lg"
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <span className="text-slate-500 self-center">Pintasan Populer:</span>
              {CURATED_COMPARISONS.map((cc) => (
                <button
                  key={cc.id}
                  type="button"
                  onClick={() => {
                    setConceptA(cc.conceptIds[0]);
                    setConceptB(cc.conceptIds[1]);
                  }}
                  className={`px-2.5 py-1.5 rounded-lg border font-medium transition-colors ${
                    (conceptA === cc.conceptIds[0] && conceptB === cc.conceptIds[1]) ||
                    (conceptA === cc.conceptIds[1] && conceptB === cc.conceptIds[0])
                      ? 'bg-indigo-700 text-white border-indigo-700'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {cc.title.split('—')[0].trim()}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-medium text-slate-700 mb-1">Konsep Pertama</label>
                <select
                  value={conceptA}
                  onChange={(e) => setConceptA(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white text-sm"
                >
                  {filteredConceptOptions.map((c) => (
                    <option key={c.id} value={c.id}>
                      [{c.framework}] {c.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block font-medium text-slate-700 mb-1">Konsep Kedua</label>
                <select
                  value={conceptB}
                  onChange={(e) => setConceptB(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white text-sm"
                >
                  {filteredConceptOptions.map((c) => (
                    <option key={c.id} value={c.id}>
                      [{c.framework}] {c.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {conceptA === conceptB ? (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 text-xs text-amber-950">
              Pilih dua konsep yang berbeda untuk melihat analisis perbandingan 10 bagian.
            </div>
          ) : (
            comparisonResult && (
              <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-5 text-xs">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 border-b border-slate-200 pb-4">
                  <h2 className="text-xl font-display font-bold text-slate-900">
                    {comparisonResult.title}
                  </h2>
                  <div className="flex flex-wrap items-center gap-2">
                    <input
                      type="text"
                      placeholder="Catatan pribadi opsional..."
                      value={comparisonNote}
                      onChange={(e) => setComparisonNote(e.target.value)}
                      className="px-3 py-1.5 border border-slate-300 rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={handleSaveComparison}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 font-medium text-white bg-indigo-700 hover:bg-indigo-800 rounded-lg whitespace-nowrap"
                    >
                      <Save className="w-3.5 h-3.5" />
                      Simpan Perbandingan
                    </button>
                  </div>
                </div>

                {/* 1. Definitions */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {comparisonResult.definitions.map((d) => (
                    <div key={d.code} className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-1.5">
                      <div className="text-[11px] font-semibold text-indigo-700">{d.framework}</div>
                      <div className="text-sm font-display font-bold text-slate-900">{d.name}</div>
                      <p className="text-slate-700 leading-relaxed">{d.definition}</p>
                    </div>
                  ))}
                </div>

                {/* 2-9 Structured Analytical Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { title: '2. Karakteristik yang Serupa', items: comparisonResult.sharedCharacteristics },
                    { title: '3. Perbedaan Fundamental & Unit Analisis', items: comparisonResult.fundamentalDifferences },
                    { title: '4. Asumsi Teoretis di Baliknya', items: comparisonResult.theoreticalAssumptions },
                    { title: '5. Mekanisme Inti Cara Kerja', items: comparisonResult.coreMechanisms },
                    { title: '6. Contoh Perilaku Sehari-hari di SMA', items: comparisonResult.everydayExamples },
                    { title: '7. Kesalahpahaman Umum', items: comparisonResult.commonMisconceptions },
                    { title: '8. Kapan Keduanya Tampak Mirip dari Luar', items: comparisonResult.whenTheyLookSimilar },
                    { title: '9. Pertanyaan Pembeda untuk Refleksi', items: comparisonResult.distinguishingQuestions },
                  ].map((sec) => (
                    <div key={sec.title} className="p-4 rounded-lg border border-slate-200 space-y-1.5">
                      <h3 className="font-semibold text-slate-900">{sec.title}</h3>
                      <ul className="list-disc pl-4 space-y-1 text-slate-700 leading-relaxed">
                        {sec.items.map((it, idx) => (
                          <li key={idx}>{it}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>

                {/* 10. Limitations & Cross-Framework Caution */}
                <div className="p-4 rounded-lg bg-amber-50 border border-amber-200 text-amber-950 space-y-1">
                  <div className="font-semibold">10. Batasan Analisis &amp; Peringatan Lintas Kerangka</div>
                  <p>{comparisonResult.crossFrameworkCaution}</p>
                  {comparisonResult.analyticalLimitations.map((lim, i) => (
                    <p key={i} className="opacity-90">
                      • {lim}
                    </p>
                  ))}
                </div>
              </div>
            )
          )}
        </div>
      )}

      {/* TAB B2: CONCEPT RELATIONSHIPS MAP */}
      {tab === 'peta-hubungan' && (
        <div className="space-y-4">
          <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex flex-wrap items-center gap-2">
              <select
                aria-label="Saring kerangka peta konsep"
                value={graphFrameworkFilter}
                onChange={(e) => setGraphFrameworkFilter(e.target.value)}
                className="px-3 py-1.5 border border-slate-300 rounded-lg bg-white"
              >
                <option value="ALL">Seluruh Kerangka Teori</option>
                <option value="Socionics">Socionics</option>
                <option value="Psikosofi">Psikosofi</option>
                <option value="Enneagram">Enneagram</option>
                <option value="Tipologi Jung">Tipologi Jung</option>
              </select>
              <input
                type="search"
                value={graphSearch}
                onChange={(e) => setGraphSearch(e.target.value)}
                placeholder="Cari simpul konsep (mis. Ti, 1L, PoLR)..."
                className="px-3 py-1.5 border border-slate-300 rounded-lg w-64"
              />
            </div>
            <span className="text-slate-500">
              Menampilkan {filteredMapNodes.length} simpul · {filteredMapEdges.length} relasi teoretis eksplisit
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-8">
              <KnowledgeGraphCanvas
                nodes={filteredMapNodes.map((n) => ({
                  id: n.id,
                  label: n.label,
                  shortCode: n.shortCode,
                  group: n.framework,
                  badgeText: n.subGroup,
                  summary: n.summary,
                  x: n.x,
                  y: n.y,
                }))}
                edges={filteredMapEdges}
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
              />
            </div>

            <div className="lg:col-span-4 bg-white border border-slate-200 rounded-xl p-5 space-y-4 text-xs">
              {selectedMapEdge ? (
                <>
                  <div className="text-indigo-700 font-semibold">
                    Jenis Relasi: {selectedMapEdge.relationshipType}
                  </div>
                  <h2 className="text-base font-display font-bold text-slate-900">
                    {selectedMapEdge.label}
                  </h2>
                  <p className="text-sm text-slate-700 leading-relaxed">
                    {selectedMapEdge.explanation}
                  </p>
                  <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-amber-950">
                    <strong>Catatan Kehati-hatian:</strong> {selectedMapEdge.cautionNote}
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      launchPairComparison(selectedMapEdge.sourceId, selectedMapEdge.targetId)
                    }
                    className="w-full py-2.5 px-3 font-medium text-white bg-indigo-700 hover:bg-indigo-800 rounded-lg inline-flex items-center justify-center gap-1.5"
                  >
                    <GitCompare className="w-3.5 h-3.5" />
                    Bandingkan Kedua Konsep Ini (10 Bagian)
                  </button>
                </>
              ) : selectedMapNode ? (
                <>
                  <div className="text-slate-500">
                    {selectedMapNode.framework} · {selectedMapNode.subGroup}
                  </div>
                  <h2 className="text-base font-display font-bold text-slate-900">
                    {selectedMapNode.label}
                  </h2>
                  <p className="text-sm text-slate-700 leading-relaxed">
                    {selectedMapNode.definition}
                  </p>
                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
                    <div className="font-semibold text-slate-900">Mekanisme Inti:</div>
                    <p className="text-slate-700">{selectedMapNode.keyMechanism}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-amber-950 space-y-1">
                    <div className="font-semibold">Kesalahpahaman Umum:</div>
                    <p>{selectedMapNode.misconception}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => onNavigate(selectedMapNode.targetModule as NavModuleId)}
                    className="w-full py-2.5 px-3 font-medium text-indigo-800 bg-indigo-50 hover:bg-indigo-100 rounded-lg inline-flex items-center justify-center gap-1.5"
                  >
                    Buka Penjelasan Lengkap di Modul Teori
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </>
              ) : (
                <p className="text-slate-500">
                  Klik simpul konsep atau garis hubungan pada peta untuk melihat definisi, mekanisme, dan perbandingan cepat.
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB B3: GUIDED LEARNING PATHS */}
      {tab === 'jalur-belajar' && activePath && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {learningPaths.map((lp) => {
              const doneInPath = lp.steps.filter((st) => completedSteps.has(st.id)).length;
              return (
                <button
                  key={lp.id}
                  type="button"
                  onClick={() => setActivePathId(lp.id)}
                  className={`text-left p-5 rounded-xl border transition-colors ${
                    lp.id === activePath.id
                      ? 'bg-indigo-50 border-indigo-400'
                      : 'bg-white border-slate-200 hover:border-indigo-200'
                  }`}
                >
                  <div className="text-xs font-semibold text-indigo-700">{lp.framework}</div>
                  <div className="text-base font-display font-bold text-slate-900 mt-1">
                    {lp.title}
                  </div>
                  <p className="text-xs text-slate-600 mt-2">{lp.description}</p>
                  <div className="mt-3 text-xs font-medium text-slate-700 tabular-nums">
                    Progres: {doneInPath}/{lp.steps.length} tahap dipelajari
                  </div>
                </button>
              );
            })}
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-4">
              <div>
                <h2 className="text-lg font-display font-bold text-slate-900">
                  {activePath.title}
                </h2>
                <p className="text-xs text-slate-600 mt-0.5">
                  Tandai langkah yang sudah Anda kuasai atau lewati, dan tandai topik sulit untuk diulang kembali.
                </p>
              </div>
              {(() => {
                const nextUnfinished = activePath.steps.find((s) => !completedSteps.has(s.id));
                return nextUnfinished ? (
                  <button
                    type="button"
                    onClick={() => onNavigate(nextUnfinished.targetModule as NavModuleId)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-white bg-indigo-700 hover:bg-indigo-800 rounded-lg whitespace-nowrap"
                  >
                    Lanjutkan ke Tahap {nextUnfinished.stepNumber}
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                ) : null;
              })()}
            </div>

            <div className="space-y-3">
              {activePath.steps.map((step) => {
                const isDone = completedSteps.has(step.id);
                const isBookmarked = bookmarkedSteps.has(step.id);
                return (
                  <div
                    key={step.id}
                    className={`p-4 rounded-xl border transition-colors text-xs ${
                      isDone ? 'bg-emerald-50/60 border-emerald-200' : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                      <div className="space-y-1.5">
                        <div className="text-[11px] font-mono font-semibold text-indigo-700">
                          TAHAP 0{step.stepNumber} · Estimasi {step.estimatedMinutes} menit
                          {step.prerequisiteIds.length > 0 && ' · Ada prasyarat sebelumnya'}
                        </div>
                        <h3 className="text-base font-display font-semibold text-slate-900">
                          {step.title}
                        </h3>
                        <p className="text-slate-700 leading-relaxed">{step.summary}</p>
                        <ul className="list-disc pl-4 text-slate-600 space-y-0.5 pt-1">
                          {step.keyTakeaways.map((kt, idx) => (
                            <li key={idx}>{kt}</li>
                          ))}
                        </ul>
                        <p className="text-slate-800 pt-1">
                          <strong>Cek Pemahaman:</strong> {step.selfCheckPrompt}
                        </p>
                      </div>

                      <div className="flex sm:flex-col items-end gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => toggleLearningStepDone(step.id)}
                          className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg font-medium border whitespace-nowrap ${
                            isDone
                              ? 'bg-emerald-700 text-white border-emerald-700'
                              : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                          }`}
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          {isDone ? 'Selesai / Dilewati' : 'Tandai Selesai'}
                        </button>
                        <button
                          type="button"
                          onClick={() => toggleLearningStepBookmark(step.id)}
                          className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg font-medium border whitespace-nowrap ${
                            isBookmarked
                              ? 'bg-amber-100 text-amber-900 border-amber-300'
                              : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          <Bookmark className="w-3.5 h-3.5" />
                          {isBookmarked ? 'Ditandai Sulit' : 'Tandai Perlu Ulang'}
                        </button>
                        <button
                          type="button"
                          onClick={() => onNavigate(step.targetModule as NavModuleId)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 text-indigo-700 hover:underline font-medium whitespace-nowrap"
                        >
                          Buka Materi
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
      {/* TAB: CROSS-FRAMEWORK PAIR COMPARISONS */}
      {tab === 'lintas-kerangka' && (() => {
        const pair =
          CROSS_FRAMEWORK_COMPARISONS.find((p) => p.id === selectedPairId) ||
          CROSS_FRAMEWORK_COMPARISONS[0];
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
              {CROSS_FRAMEWORK_COMPARISONS.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setSelectedPairId(item.id)}
                  className={`p-4 rounded-xl border text-left transition-colors ${
                    item.id === pair.id
                      ? 'bg-[#151D40] text-white border-[#151D40]'
                      : 'bg-white text-slate-800 border-slate-200 hover:border-indigo-300'
                  }`}
                >
                  <div className="font-display font-bold text-sm">{item.title}</div>
                  <div
                    className={`text-[11px] mt-1 line-clamp-2 ${
                      item.id === pair.id ? 'text-indigo-200' : 'text-slate-500'
                    }`}
                  >
                    {item.tagline}
                  </div>
                </button>
              ))}
            </div>

            <article className="bg-white border border-slate-200 rounded-2xl p-6 space-y-5 text-xs">
              <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-200 pb-4">
                <div>
                  <span className="atlas-kicker">Matriks Komparasi Antar-Sistem</span>
                  <h2 className="mt-1 text-xl font-display font-bold text-slate-900">{pair.title}</h2>
                  <p className="text-slate-600 mt-1">{pair.tagline}</p>
                </div>
                {onMarkTopicRead && (
                  <button
                    type="button"
                    onClick={() => onMarkTopicRead('theory-socionics-intertype')}
                    className={`px-3 py-1.5 rounded-lg border text-xs font-medium whitespace-nowrap ${
                      readTopics.includes('theory-socionics-intertype')
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        : 'bg-slate-50 text-slate-700 border-slate-300 hover:bg-indigo-50'
                    }`}
                  >
                    {readTopics.includes('theory-socionics-intertype')
                      ? '✓ Lintas Kerangka Selesai'
                      : '+ Tandai Selesai Dibaca'}
                  </button>
                )}
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                <div className="font-semibold text-slate-900">Konsep yang Dibagi Bersama</div>
                <ul className="list-disc pl-4 space-y-1 text-slate-700">
                  {pair.sharedConcepts.map((s, idx) => (
                    <li key={idx}>{s}</li>
                  ))}
                </ul>
              </div>

              {/* False Friends Alert Matrix */}
              <div className="space-y-2.5">
                <div className="flex items-center gap-1.5 font-semibold text-amber-950 text-sm">
                  <AlertTriangle className="w-4 h-4 text-amber-700" />
                  <span>Waspadai Istilah Serupa Bermakna Beda (False Friends)</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {pair.falseFriends.map((ff, idx) => (
                    <div key={idx} className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 space-y-1.5">
                      <div className="font-mono font-bold text-amber-950">{ff.term}</div>
                      <p className="text-slate-800"><strong>Di {pair.frameworkA}:</strong> {ff.meaningInA}</p>
                      <p className="text-slate-800"><strong>Di {pair.frameworkB}:</strong> {ff.meaningInB}</p>
                      <p className="text-amber-900 pt-1 border-t border-amber-200/80">
                        <strong>Klarifikasi:</strong> {ff.clarification}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Core Structural Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50 text-slate-700">
                      <th className="p-3 font-semibold">Dimensi</th>
                      <th className="p-3 font-semibold">{pair.frameworkA}</th>
                      <th className="p-3 font-semibold">{pair.frameworkB}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {pair.coreDifferences.map((row) => (
                      <tr key={row.dimension} className="align-top">
                        <td className="p-3 font-semibold text-slate-900">{row.dimension}</td>
                        <td className="p-3 text-slate-700 leading-relaxed">{row.inA}</td>
                        <td className="p-3 text-slate-700 leading-relaxed">{row.inB}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <div className="font-semibold text-slate-900">Struktur Klasifikasi &amp; Pembentukan Tipe</div>
                  <p className="text-slate-700 leading-relaxed">{pair.classificationStructure}</p>
                  <p className="text-slate-600 leading-relaxed pt-1">{pair.typeConstruction}</p>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <div className="font-semibold text-slate-900">Akar Sejarah &amp; Metode Interpretasi</div>
                  <p className="text-slate-700 leading-relaxed">{pair.historicalRoots}</p>
                  <p className="text-slate-600 leading-relaxed pt-1">{pair.interpretationMethods}</p>
                </div>
              </div>

              {/* Same Situation Dual Reading */}
              <div className="p-4 rounded-xl bg-indigo-50/50 border border-indigo-200 space-y-2.5">
                <div className="font-semibold text-indigo-950 text-sm">
                  Situasi Sama, Dua Lensa: “{pair.sameSituationExample.situation}”
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="p-3 rounded-lg bg-white border border-indigo-200/70">
                    <div className="font-semibold text-indigo-900 mb-1">Bacaan {pair.frameworkA}</div>
                    <p className="text-slate-700 leading-relaxed">{pair.sameSituationExample.interpretationA}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-white border border-indigo-200/70">
                    <div className="font-semibold text-indigo-900 mb-1">Bacaan {pair.frameworkB}</div>
                    <p className="text-slate-700 leading-relaxed">{pair.sameSituationExample.interpretationB}</p>
                  </div>
                </div>
                <p className="text-indigo-950 font-medium">
                  Sintesis Praktis: {pair.sameSituationExample.synthesisTakeaway}
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-200 text-[11px] text-slate-500">
                <span>Miskonsepsi umum: {pair.misconceptions.join(' · ')}</span>
                <span className="font-mono">Rujukan: {pair.references.join('; ')}</span>
              </div>
            </article>
          </div>
        );
      })()}
    </div>
  );
};
