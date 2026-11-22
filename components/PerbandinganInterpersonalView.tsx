import React, { useMemo, useState } from 'react';
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  FileSearch,
  HelpCircle,
  Layers,
  MessageSquareQuote,
  Plus,
  ShieldCheck,
  Trash2,
} from 'lucide-react';
import {
  analyzeInterpersonalComparison,
  type RelationshipContext,
} from '../lib/typology';
import type { Profile } from '../types/dynamap';
import { ProfileAvatar, getQuadraTheme } from './QuadraUI';

interface PerbandinganInterpersonalViewProps {
  profiles: Profile[];
  initialSelectedIds?: string[];
}

const CONTEXT_OPTIONS: RelationshipContext[] = [
  'Anggota kelompok',
  'Teman sekelas',
  'Teman dekat',
  'Guru dan siswa',
  'Koordinator dan anggota',
  'Konteks interpersonal lainnya',
];

export const PerbandinganInterpersonalView: React.FC<PerbandinganInterpersonalViewProps> = ({
  profiles,
  initialSelectedIds,
}) => {
  const activeProfiles = useMemo(() => profiles.filter((p) => !p.archived), [profiles]);

  const [selectedIds, setSelectedIds] = useState<string[]>(() => {
    if (initialSelectedIds && initialSelectedIds.length >= 2) return initialSelectedIds;
    if (initialSelectedIds && initialSelectedIds.length === 1) {
      const other = activeProfiles.find((p) => p.id !== initialSelectedIds[0]);
      return other ? [initialSelectedIds[0], other.id] : initialSelectedIds;
    }
    if (activeProfiles.length >= 2) {
      return [activeProfiles[0].id, activeProfiles[16]?.id || activeProfiles[1].id];
    }
    return [];
  });

  const [context, setContext] = useState<RelationshipContext>('Anggota kelompok');
  const [observedTrigger, setObservedTrigger] = useState('');
  const [reportedBehavior, setReportedBehavior] = useState('');
  const [communicationGoal, setCommunicationGoal] = useState('');
  const [activeStage, setActiveStage] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [expandAllStages, setExpandAllStages] = useState(false);
  const [activeDirection, setActiveDirection] = useState<'A_TO_B' | 'B_TO_A'>('A_TO_B');

  const selectedProfiles = selectedIds
    .map((id) => activeProfiles.find((p) => p.id === id))
    .filter((p): p is Profile => Boolean(p));

  const maskedProfiles = selectedProfiles.filter((p) => p.hiddenFieldsForViewer?.includes('typology'));

  const analysis = useMemo(
    () =>
      analyzeInterpersonalComparison(selectedProfiles, context, {
        observedTrigger,
        reportedBehavior,
        communicationGoal,
      }),
    [selectedProfiles, context, observedTrigger, reportedBehavior, communicationGoal]
  );

  function handleChangeSlot(slotIdx: number, profileId: string) {
    setSelectedIds((prev) => {
      const next = [...prev];
      next[slotIdx] = profileId;
      return next;
    });
  }

  function handleAddSlot() {
    const unused = activeProfiles.find((p) => !selectedIds.includes(p.id));
    if (unused) {
      setSelectedIds((prev) => [...prev, unused.id]);
    }
  }

  function handleRemoveSlot(slotIdx: number) {
    if (selectedIds.length <= 2) return;
    setSelectedIds((prev) => prev.filter((_, i) => i !== slotIdx));
  }

  return (
    <div className="space-y-8">
      {/* Selection & Reported Situation Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-display font-bold text-slate-900">
              Perbandingan Interpersonal &amp; Progresi Konflik 5 Tahap
            </h1>
            <p className="text-sm text-slate-600 mt-1 max-w-3xl">
              Bandingkan dua atau lebih individu lintas Socionics (Model A), Enneagram (Inti, Insting, Tritype), Tipologi Jung, dan Psikosofi (L·V·E·F). Analisis ini menyusun dinamika secara kontekstual tanpa skor kecocokan deterministik.
            </p>
          </div>

          <div className="w-full lg:w-72">
            <label htmlFor="rel-context" className="block text-xs font-medium text-slate-700 mb-1">
              Konteks Hubungan
            </label>
            <select
              id="rel-context"
              value={context}
              onChange={(e) => setContext(e.target.value as RelationshipContext)}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg bg-white"
            >
              {CONTEXT_OPTIONS.map((ctx) => (
                <option key={ctx} value={ctx}>
                  {ctx}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {selectedIds.map((pid, idx) => (
            <div key={idx} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center justify-between gap-2">
                <label htmlFor={`cmp-slot-${idx}`} className="text-xs font-semibold text-slate-700">
                  Individu {idx === 0 ? 'A' : idx === 1 ? 'B' : idx + 1}
                </label>
                {selectedIds.length > 2 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveSlot(idx)}
                    aria-label={`Hapus Individu ${idx + 1}`}
                    className="text-slate-400 hover:text-red-600 p-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
              <select
                id={`cmp-slot-${idx}`}
                value={pid}
                onChange={(e) => handleChangeSlot(idx, e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg bg-white"
              >
                {activeProfiles.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.displayName} ({p.category} · {p.typology.socionics || 'Belum diisi'}
                    {p.typology.psychosophyCode ? ` · ${p.typology.psychosophyCode}` : ''})
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>

        {selectedIds.length < 5 && activeProfiles.length > selectedIds.length && (
          <button
            type="button"
            onClick={handleAddSlot}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            Tambah Individu Lain untuk Perbandingan Kelompok
          </button>
        )}

        {/* Optional User-Supplied Situational / Behavioral Context */}
        <div className="pt-4 border-t border-slate-200 space-y-3">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-semibold text-slate-900">
              Catatan Situasi &amp; Perilaku Teramati (Opsional — Memperkuat Ketepatan Analisis)
            </span>
            {(observedTrigger || reportedBehavior || communicationGoal) && (
              <button
                type="button"
                onClick={() => {
                  setObservedTrigger('');
                  setReportedBehavior('');
                  setCommunicationGoal('');
                }}
                className="text-xs text-indigo-700 hover:underline"
              >
                Kosongkan catatan situasi
              </button>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            <div>
              <label htmlFor="cmp-trigger" className="block font-medium text-slate-700 mb-1">
                Pemicu atau Kejadian Awal
              </label>
              <input
                id="cmp-trigger"
                type="text"
                value={observedTrigger}
                onChange={(e) => setObservedTrigger(e.target.value)}
                placeholder="Mis. Debat definisi metode makalah di grup chat"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg"
              />
            </div>
            <div>
              <label htmlFor="cmp-behavior" className="block font-medium text-slate-700 mb-1">
                Perilaku / Respons yang Teramati
              </label>
              <input
                id="cmp-behavior"
                type="text"
                value={reportedBehavior}
                onChange={(e) => setReportedBehavior(e.target.value)}
                placeholder="Mis. Satu terus mengejar balasan, satu lagi diam menghindar"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg"
              />
            </div>
            <div>
              <label htmlFor="cmp-goal" className="block font-medium text-slate-700 mb-1">
                Target Perbaikan Komunikasi
              </label>
              <input
                id="cmp-goal"
                type="text"
                value={communicationGoal}
                onChange={(e) => setCommunicationGoal(e.target.value)}
                placeholder="Mis. Menyelesaikan pembagian slide tepat waktu"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg"
              />
            </div>
          </div>
        </div>
      </div>

      {analysis && (
        <>
          {/* Profiles Snapshot Strip */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {selectedProfiles.map((p, idx) => {
              const qt = getQuadraTheme(p.typology.quadra);
              return (
                <div key={p.id} className="bg-white border border-slate-200 rounded-xl p-4 flex items-start gap-3.5">
                  <ProfileAvatar profile={p} size="md" />
                  <div className="min-w-0 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[11px] font-semibold text-indigo-700">
                        Individu {idx === 0 ? 'A' : idx === 1 ? 'B' : idx + 1}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span className="text-base font-display font-semibold text-slate-900 truncate">
                        {p.displayName}
                      </span>
                    </div>
                    <div className="text-xs text-slate-500">
                      {p.category} · <span className={qt.text}>{p.typology.quadra || 'Tanpa Quadra'}</span>
                    </div>
                    <div className="font-mono text-xs text-slate-700">
                      {p.typology.socionics || '-'} · {p.typology.enneagramRaw || '-'} ·{' '}
                      {p.typology.jungian || '-'}
                      {p.typology.psychosophyCode ? ` · ${p.typology.psychosophyCode}` : ''}
                    </div>
                    {(p.typology.tritype || p.typology.instinctStacking) && (
                      <div className="font-mono text-[11px] text-indigo-700">
                        {p.typology.instinctStacking ? `Stacking: ${p.typology.instinctStacking}` : ''}{' '}
                        {p.typology.tritype ? `· Tritype: ${p.typology.tritype}` : ''}
                      </div>
                    )}
                    {(p.typology.mbti ||
                      p.typology.sloanExtended ||
                      p.typology.sloanCode ||
                      p.typology.temperament) && (
                      <div className="font-mono text-[11px] text-slate-600">
                        {[
                          p.typology.mbti,
                          p.typology.sloanExtended || p.typology.sloanCode,
                          p.typology.temperament
                            ? p.typology.temperamentSecondary
                              ? `${p.typology.temperament}-${p.typology.temperamentSecondary}`
                              : p.typology.temperament
                            : '',
                        ]
                          .filter(Boolean)
                          .join(' · ')}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Evidence Sufficiency Prompt & Category Marker */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            <div className="lg:col-span-7 p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-950 space-y-1.5">
              <p className="font-semibold">
                Konteks Hubungan: {analysis.context} · Mekanisme Terdeteksi: {analysis.conflictMechanismTitle}
              </p>
              <p className="leading-relaxed">{analysis.contextGuidance}</p>
              <p className="pt-1 text-amber-900 leading-relaxed">{analysis.disclaimer}</p>
            </div>

            <div className="lg:col-span-5 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2">
              <div className="font-semibold text-slate-900 flex items-center gap-1.5">
                {analysis.hasBehavioralDetails ? (
                  <>
                    <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
                    Fakta Perilaku Dilaporkan Disertakan
                  </>
                ) : (
                  <>
                    <HelpCircle className="w-4 h-4 text-indigo-700 shrink-0" />
                    Belum Ada Fakta Perilaku Spesifik (Mode Skenario Hipotetis)
                  </>
                )}
              </div>
              {!analysis.hasBehavioralDetails ? (
                <div className="space-y-1 text-slate-600">
                  <p>Untuk hasil lebih akurat, pertimbangkan menjawab pertanyaan klarifikasi berikut di kolom situasi di atas:</p>
                  <ul className="list-disc pl-4 space-y-0.5">
                    {analysis.clarifyingQuestions.map((q) => (
                      <li key={q}>{q}</li>
                    ))}
                  </ul>
                </div>
              ) : (
                <ul className="list-disc pl-4 space-y-0.5 text-slate-700">
                  {analysis.evidenceClassification.reportedFacts.map((rf, i) => (
                    <li key={i}>{rf}</li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Visual Distinction of Information Categories */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-3">
            <h2 className="text-sm font-display font-semibold text-slate-900 flex items-center gap-2">
              <FileSearch className="w-4 h-4 text-indigo-700" />
              Pemisahan Kategori Informasi &amp; Penjelasan Non-Tipologi
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
              <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 space-y-1">
                <strong className="text-emerald-950 block">1. Informasi Dilaporkan</strong>
                {analysis.evidenceClassification.reportedFacts.map((item, i) => (
                  <p key={i} className="text-emerald-900 leading-relaxed">{item}</p>
                ))}
              </div>
              <div className="p-3 rounded-lg bg-indigo-50 border border-indigo-200 space-y-1">
                <strong className="text-indigo-950 block">2. Interpretasi Tipologi</strong>
                {analysis.evidenceClassification.typologyInterpretations.map((item, i) => (
                  <p key={i} className="text-indigo-900 leading-relaxed">{item}</p>
                ))}
              </div>
              <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 space-y-1">
                <strong className="text-amber-950 block">3. Skenario Hipotetis</strong>
                {analysis.evidenceClassification.hypotheticalScenarios.map((item, i) => (
                  <p key={i} className="text-amber-900 leading-relaxed">{item}</p>
                ))}
              </div>
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
                <strong className="text-slate-900 block">4. Penjelasan Non-Tipologi</strong>
                <ul className="list-disc pl-4 space-y-0.5 text-slate-700">
                  {analysis.evidenceClassification.nonTypologyExplanations.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* DYNAMIC 5-STAGE CONFLICT PROGRESSION */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <h2 className="text-xl font-display font-semibold text-slate-900">
                    Progresi Konflik Dinamis 5 Tahap ({analysis.conflictMechanismTitle})
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Rangkaian kausal bagaimana gesekan awal dapat berkembang dari Tahap 1 hingga Tahap 5 jika tidak diklarifikasi—disesuaikan dengan profil aktual dan konteks {analysis.context}.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setExpandAllStages((v) => !v)}
                className="px-3 py-1.5 text-xs font-medium text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-lg whitespace-nowrap shrink-0"
              >
                {expandAllStages ? 'Mode Tahap Per Langkah' : 'Tampilkan Semua 5 Tahap'}
              </button>
            </div>

            {/* Interactive 5-Stage Stepper */}
            {!expandAllStages && (
              <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
                {analysis.conflictStages.map((st) => {
                  const isCurrent = activeStage === st.stage;
                  return (
                    <button
                      key={st.stage}
                      type="button"
                      aria-pressed={isCurrent}
                      onClick={() => setActiveStage(st.stage)}
                      className={`text-left p-3 rounded-xl border ${
                        isCurrent
                          ? 'bg-indigo-700 text-white border-indigo-700 shadow-sm'
                          : 'bg-slate-50 text-slate-800 border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/40'
                      }`}
                    >
                      <div className={`font-mono text-[11px] font-semibold ${isCurrent ? 'text-indigo-100' : 'text-indigo-700'}`}>
                        Tahap {st.stage}
                      </div>
                      <div className="text-xs font-semibold mt-0.5 line-clamp-2">{st.stageTitle}</div>
                    </button>
                  );
                })}
              </div>
            )}

            {/* Rendered Stages */}
            <div className="space-y-6">
              {analysis.conflictStages
                .filter((st) => expandAllStages || st.stage === activeStage)
                .map((st) => (
                  <div
                    key={st.stage}
                    className="rounded-xl border border-slate-200 bg-slate-50/70 p-5 space-y-4"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-200">
                      <div>
                        <span className="font-mono text-xs font-semibold text-indigo-700">
                          TAHAP {st.stage} DARI 5 · {st.stage === 5 ? 'TITIK PECAH / HASIL KONFLIK' : 'ESKALASI KAUSAL'}
                        </span>
                        <h3 className="text-lg font-display font-bold text-slate-900 mt-0.5">
                          {st.stageTitle}
                        </h3>
                      </div>
                      {!expandAllStages && st.stage < 5 && (
                        <button
                          type="button"
                          onClick={() => setActiveStage((st.stage + 1) as 1 | 2 | 3 | 4 | 5)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-white bg-indigo-700 hover:bg-indigo-800 rounded-lg"
                        >
                          Lanjut ke Tahap {st.stage + 1}
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 text-xs sm:text-sm">
                      <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-1.5">
                        <strong className="text-slate-900 block">Deskripsi Interaksi:</strong>
                        <p className="text-slate-700 leading-relaxed">{st.interactionDescription}</p>
                      </div>
                      <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-1.5">
                        <strong className="text-slate-900 block">Mekanisme Psikologis Dasar:</strong>
                        <p className="text-slate-700 leading-relaxed">{st.underlyingMechanism}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 text-xs sm:text-sm">
                      <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-1.5">
                        <strong className="text-indigo-800 block">
                          Kemungkinan Sudut Pandang {selectedProfiles[0]?.displayName} (Individu A):
                        </strong>
                        <p className="text-slate-700 leading-relaxed">{st.personAPerspective}</p>
                      </div>
                      <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-1.5">
                        <strong className="text-indigo-800 block">
                          Kemungkinan Sudut Pandang {selectedProfiles[1]?.displayName} (Individu B):
                        </strong>
                        <p className="text-slate-700 leading-relaxed">{st.personBPerspective}</p>
                      </div>
                    </div>

                    {/* Specific Stage 3 Defense Breakdown */}
                    {st.stage === 3 && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                        {[analysis.stage3DefenseDetails.personA, analysis.stage3DefenseDetails.personB].map(
                          (def) => (
                            <div key={def.personName} className="p-4 rounded-xl bg-white border border-indigo-200 space-y-1.5">
                              <div className="font-display font-semibold text-sm text-slate-900">
                                Profil Pertahanan Individual: {def.personName}
                              </div>
                              <p className="text-slate-700"><strong>Reaksi Langsung:</strong> {def.immediateReaction}</p>
                              <p className="text-slate-700"><strong>Yang Dilindungi:</strong> {def.protectingWhat}</p>
                              <p className="text-slate-700"><strong>Ketakutan Kehilangan:</strong> {def.fearOfLosing}</p>
                              <p className="text-slate-700"><strong>Kebutuhan Tersembunyi:</strong> {def.underlyingNeed}</p>
                              <p className="text-amber-900"><strong>Risiko Salah Tafsir Lawan:</strong> {def.howMisinterpreted}</p>
                            </div>
                          )
                        )}
                      </div>
                    )}

                    {/* Specific Stage 4 Interactive Escalation Cycle */}
                    {st.stage === 4 && (
                      <div className="p-4 rounded-xl bg-white border border-amber-200 space-y-2 text-xs">
                        <div className="font-display font-semibold text-sm text-amber-950">
                          Anatomi Siklus Eskalasi ({analysis.conflictMechanismTitle})
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-slate-700">
                          <p><strong>Pemicu Berulang:</strong> {analysis.stage4CycleDetails.trigger}</p>
                          <p><strong>Lingkaran Penguat:</strong> {analysis.stage4CycleDetails.reinforcementLoop}</p>
                          <p><strong>Kontribusi {selectedProfiles[0]?.displayName}:</strong> {analysis.stage4CycleDetails.personAContribution}</p>
                          <p><strong>Kontribusi {selectedProfiles[1]?.displayName}:</strong> {analysis.stage4CycleDetails.personBContribution}</p>
                        </div>
                        <p className="text-emerald-950 bg-emerald-50 border border-emerald-200 rounded-lg p-2.5">
                          <strong>Titik Putus Siklus:</strong> {analysis.stage4CycleDetails.interruptionPoint}
                        </p>
                      </div>
                    )}

                    {/* Specific Stage 5 Primary + Alternative Plausible Outcomes */}
                    {st.stage === 5 && (
                      <div className="space-y-4">
                        <div className="p-4 rounded-xl bg-white border border-slate-300 space-y-2 text-xs">
                          <div className="font-display font-semibold text-sm text-slate-900">
                            Hasil Utama yang Paling Mungkin: {analysis.stage5OutcomeSummary.primaryOutcome.outcomeLabel}
                          </div>
                          <p className="text-slate-700 leading-relaxed">
                            <strong>Mengapa Masuk Akal:</strong> {analysis.stage5OutcomeSummary.contributingStagesSummary}
                          </p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                            <p className="text-slate-700"><strong>Yang Belum Terselesaikan:</strong> {analysis.stage5OutcomeSummary.primaryOutcome.whatRemainsUnresolved}</p>
                            <p className="text-slate-700"><strong>Konsekuensi Jangka Panjang:</strong> {analysis.stage5OutcomeSummary.primaryOutcome.longTermConsequence}</p>
                          </div>
                        </div>

                        {st.alternativeOutcomes && st.alternativeOutcomes.length > 0 && (
                          <div className="space-y-2">
                            <div className="text-xs font-semibold text-slate-900">
                              Hasil Alternatif yang Juga Mungkin Terjadi (Tergantung Pilihan Kedua Pihak):
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                              {st.alternativeOutcomes.map((alt) => (
                                <div key={alt.outcomeLabel} className="p-3.5 rounded-xl bg-white border border-slate-200 space-y-1">
                                  <div className="font-semibold text-indigo-800">{alt.outcomeLabel}</div>
                                  <p className="text-slate-700 leading-relaxed">{alt.whyPlausible}</p>
                                  <p className="text-slate-500">
                                    Dampak: {alt.longTermConsequence}
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 text-xs">
                      <div className="p-3.5 rounded-xl bg-white border border-slate-200 space-y-1.5">
                        <strong className="text-slate-900 block">Perbedaan Tipologi Spesifik yang Berperan:</strong>
                        <ul className="list-disc pl-4 space-y-1 text-slate-700">
                          {st.relevantTypologyDifferences.map((diff, i) => (
                            <li key={i}>{diff}</li>
                          ))}
                        </ul>
                      </div>
                      <div className="p-3.5 rounded-xl bg-white border border-slate-200 space-y-2">
                        <div>
                          <strong className="text-slate-900 block">Contoh Interaksi Konkret:</strong>
                          <p className="text-slate-700 leading-relaxed mt-0.5">{st.concreteExample}</p>
                        </div>
                        <div className="pt-2 border-t border-slate-100">
                          <strong className="text-indigo-800 flex items-center gap-1">
                            <ArrowRight className="w-3.5 h-3.5" />
                            Transisi Kausal:
                          </strong>
                          <p className="text-slate-600 leading-relaxed mt-0.5">{st.transitionToNext}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* VISUALLY CONNECTED MECHANISM-MATCHED DETAILED RESOLUTION */}
          <div className="bg-emerald-50/50 border border-emerald-200 rounded-xl p-6 space-y-5">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-6 h-6 text-emerald-700 shrink-0 mt-0.5" />
              <div>
                <span className="font-mono text-xs font-semibold text-emerald-800">
                  RESOLUSI TERHUBUNG LANGSUNG KE TAHAP 4 &amp; 5
                </span>
                <h2 className="text-xl font-display font-bold text-slate-900 mt-0.5">
                  Strategi Resolusi Sesuai Mekanisme: {analysis.detailedResolution.mechanismName}
                </h2>
                <p className="text-sm text-slate-700 mt-1 leading-relaxed">
                  {analysis.detailedResolution.mechanismSummary}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm">
              <div className="p-4 rounded-xl bg-white border border-emerald-200 space-y-2">
                <strong className="text-slate-900 block">Meluruskan Kesalahpahaman Awal:</strong>
                <p className="text-slate-700 leading-relaxed">
                  {analysis.detailedResolution.addressesOriginalMisunderstanding}
                </p>
                <p className="text-slate-700 leading-relaxed pt-1 border-t border-slate-100">
                  {analysis.detailedResolution.aInterpretationVsBInterpretation}
                </p>
              </div>
              <div className="p-4 rounded-xl bg-white border border-emerald-200 space-y-2">
                <strong className="text-slate-900 block">Kebutuhan Dasar yang Perlu Terpenuhi:</strong>
                <p className="text-slate-700 leading-relaxed">
                  <strong>{selectedProfiles[0]?.displayName}:</strong> {analysis.detailedResolution.personANeeds}
                </p>
                <p className="text-slate-700 leading-relaxed pt-1 border-t border-slate-100">
                  <strong>{selectedProfiles[1]?.displayName}:</strong> {analysis.detailedResolution.personBNeeds}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-white border border-red-200 space-y-1.5">
                <strong className="text-red-950 block">Perilaku yang Mempertahankan Siklus (Hentikan):</strong>
                <ul className="list-disc pl-4 space-y-1 text-red-900">
                  {analysis.detailedResolution.maintainingBehaviors.map((m, i) => (
                    <li key={i}>{m}</li>
                  ))}
                </ul>
              </div>
              <div className="p-4 rounded-xl bg-white border border-indigo-200 space-y-1.5">
                <strong className="text-indigo-950 block">Tindakan Pemutus Siklus:</strong>
                <ul className="list-disc pl-4 space-y-1 text-indigo-900">
                  {analysis.detailedResolution.cycleInterruptingActions.map((c, i) => (
                    <li key={i}>{c}</li>
                  ))}
                </ul>
              </div>
              <div className="p-4 rounded-xl bg-white border border-emerald-200 space-y-1.5">
                <strong className="text-emerald-950 block">Pergeseran Perilaku Konkret:</strong>
                <ul className="list-disc pl-4 space-y-1 text-emerald-900">
                  {analysis.detailedResolution.concreteBehaviorShifts.map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* PERSONALIZED INDONESIAN COMMUNICATION DIALOGUES */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-5">
            <div className="flex items-start gap-3">
              <MessageSquareQuote className="w-5 h-5 text-indigo-700 shrink-0 mt-0.5" />
              <div>
                <h2 className="text-xl font-display font-semibold text-slate-900">
                  Contoh Komunikasi Bahasa Indonesia yang Dipersonalisasi
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Disesuaikan dengan karakter masing-masing pihak dan mekanisme konflik aktif untuk membuka klarifikasi tanpa menyalahkan.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 text-xs">
              {[analysis.personalizedDialogues.personA, analysis.personalizedDialogues.personB].map(
                (pd) => (
                  <div key={pd.name} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5">
                    <div className="font-display font-semibold text-sm text-slate-900">
                      Panduan Kalimat untuk {pd.name}
                    </div>
                    <p className="text-slate-600">
                      <strong>Fokus penjelasan:</strong> {pd.explainPerspective}
                    </p>
                    <div className="p-2.5 rounded-lg bg-red-50 border border-red-200 text-red-900">
                      <strong className="block mb-0.5">Hindari kalimat ini:</strong>
                      “{pd.avoidSaying}”
                    </div>
                    <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-950">
                      <strong className="block mb-0.5">Alternatif konstruktif:</strong>
                      “{pd.constructiveAlternative}”
                    </div>
                    <div className="p-2.5 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-950">
                      <strong className="block mb-0.5">Pertanyaan klarifikasi:</strong>
                      “{pd.clarificationQuestion}”
                    </div>
                  </div>
                )
              )}
            </div>

            {/* Mutual Repair Mini-Dialogue */}
            <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-3 text-xs">
              <div className="flex items-center gap-2 font-display font-semibold text-sm text-slate-900">
                <MessageSquareQuote className="w-4 h-4 text-indigo-700" />
                Simulasi Dialog Perbaikan Bersama (Mutual Repair)
              </div>
              <p className="text-slate-700">
                <strong>Pernyataan pembuka bersama:</strong> “{analysis.personalizedDialogues.mutualRepair.repairStatement}”
              </p>
              <div className="space-y-2">
                {analysis.personalizedDialogues.mutualRepair.constructiveMiniDialogue.map((turn, idx) => (
                  <div key={idx} className="p-3 rounded-lg bg-white border border-slate-200">
                    <span className="font-semibold text-indigo-800">{turn.speaker}:</span>{' '}
                    <span className="text-slate-800">“{turn.line}”</span>
                  </div>
                ))}
              </div>
              <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-950">
                <strong>Kesepakatan Praktis:</strong> {analysis.personalizedDialogues.mutualRepair.practicalAgreement}
              </div>
            </div>
          </div>

          {/* DEEP TYPOLOGY DIFFERENCES ACROSS ALL FRAMEWORKS (INCLUDING PSYCHOSOPHY) */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-5">
            <h2 className="text-xl font-display font-semibold text-slate-900 flex items-center gap-2">
              <Layers className="w-5 h-5 text-indigo-700" />
              Pemetaan Mendalam Lintas Seluruh Kerangka Tipologi
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs sm:text-sm text-slate-700">
              <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-2">
                <h3 className="font-semibold text-slate-900">1. Socionics, Model A &amp; Benturan Elemen Informasi</h3>
                {analysis.socionicsDifferences.map((item, i) => (
                  <p key={i} className="leading-relaxed">{item}</p>
                ))}
                {analysis.modelADifferences.map((item, i) => (
                  <p key={`ma-${i}`} className="leading-relaxed pt-1.5 border-t border-slate-200/70">
                    {item}
                  </p>
                ))}
                {analysis.informationElementClashes.map((cl, i) => (
                  <p key={`cl-${i}`} className="leading-relaxed pt-1.5 border-t border-slate-200/70 text-indigo-950">
                    {cl}
                  </p>
                ))}
              </div>

              <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-2">
                <h3 className="font-semibold text-slate-900">2. Enneagram, Insting, Tritype &amp; Notasi Jung</h3>
                {analysis.enneagramDifferences.map((item, i) => (
                  <p key={i} className="leading-relaxed">{item}</p>
                ))}
                {analysis.coreMotivationDifferences.map((item, i) => (
                  <p key={`cm-${i}`} className="leading-relaxed pt-1.5 border-t border-slate-200/70">
                    {item}
                  </p>
                ))}
                {analysis.instinctDifferences.map((item, i) => (
                  <p key={`ins-${i}`} className="leading-relaxed pt-1.5 border-t border-slate-200/70">
                    {item}
                  </p>
                ))}
                {analysis.tritypeDifferences.map((item, i) => (
                  <p key={`tri-${i}`} className="leading-relaxed pt-1.5 border-t border-slate-200/70">
                    {item}
                  </p>
                ))}
                {analysis.jungianDifferences.map((item, i) => (
                  <p key={`jg-${i}`} className="leading-relaxed pt-1.5 border-t border-slate-200/70">
                    {item}
                  </p>
                ))}
              </div>
            </div>

            {/* Psychosophy Comparison Section */}
            <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-4">
              <div>
                <h3 className="text-base font-display font-semibold text-slate-900">
                  3. Perbandingan Psikosofi (Logika · Kehendak/Volition · Emosi · Fisika/Physics)
                </h3>
                <p className="text-xs text-slate-600 mt-1">{analysis.psychosophyComparison.summary}</p>
              </div>

              {analysis.psychosophyComparison.available && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                    {analysis.psychosophyComparison.aspectComparisons.map((ac) => (
                      <div key={ac.aspect} className="p-3.5 rounded-xl bg-white border border-slate-200 space-y-1">
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-semibold text-slate-900">{ac.aspectTitle}</span>
                          <span className="font-mono font-semibold text-indigo-700">
                            {ac.p1Placement} vs {ac.p2Placement}
                          </span>
                        </div>
                        <p className="text-slate-700 leading-relaxed">{ac.interactionSummary}</p>
                      </div>
                    ))}
                  </div>

                  {analysis.psychosophyComparison.activeConflictPrinciples.length > 0 && (
                    <div className="space-y-3 pt-2">
                      <h4 className="text-xs font-semibold text-slate-900">
                        Dinamika Interaksi Konflik Psikosofi yang Terdeteksi:
                      </h4>
                      {analysis.psychosophyComparison.activeConflictPrinciples.map((cp) => (
                        <div key={cp.id} className="p-4 rounded-xl bg-white border border-indigo-200 space-y-1.5 text-xs">
                          <div className="font-semibold text-indigo-900">{cp.title}</div>
                          <p className="text-slate-700"><strong>Anggapan wajar masing-masing:</strong> {cp.whatEachTakesForGranted}</p>
                          <p className="text-slate-700"><strong>Nada tak disengaja:</strong> {cp.unintendedTone}</p>
                          <p className="text-slate-700"><strong>Salah tafsir:</strong> {cp.howMisunderstood}</p>
                          <p className="text-slate-700"><strong>Kebutuhan masing-masing:</strong> {cp.whatEachNeeds}</p>
                          <p className="text-emerald-950 bg-emerald-50 border border-emerald-200 rounded-lg p-2">
                            <strong>Jembatan:</strong> {cp.communicationBridge}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Directional Interpersonal Dynamics SVG Map (A <-> B) */}
            {analysis.directionalMap && (
              <div className="p-5 sm:p-6 rounded-2xl atlas-grid-bg bg-slate-50/80 border border-slate-200 space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
                  <div>
                    <span className="atlas-kicker">Peta Dinamika Dua Arah</span>
                    <h3 className="mt-1 text-base sm:text-lg font-display font-bold text-slate-900">
                      Diagram Aliran Niat vs Penafsiran ({analysis.directionalMap.personAName} ↔{' '}
                      {analysis.directionalMap.personBName})
                    </h3>
                  </div>
                  <div className="flex gap-1.5 text-xs shrink-0">
                    <button
                      type="button"
                      onClick={() => setActiveDirection('A_TO_B')}
                      className={`px-3 py-1.5 rounded-lg font-medium border transition-colors ${
                        activeDirection === 'A_TO_B'
                          ? 'bg-[#151D40] text-white border-[#151D40]'
                          : 'bg-white text-slate-700 border-slate-300'
                      }`}
                    >
                      {analysis.directionalMap.personAName} → {analysis.directionalMap.personBName}
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveDirection('B_TO_A')}
                      className={`px-3 py-1.5 rounded-lg font-medium border transition-colors ${
                        activeDirection === 'B_TO_A'
                          ? 'bg-[#151D40] text-white border-[#151D40]'
                          : 'bg-white text-slate-700 border-slate-300'
                      }`}
                    >
                      {analysis.directionalMap.personBName} → {analysis.directionalMap.personAName}
                    </button>
                  </div>
                </div>

                {maskedProfiles.length > 0 && (
                  <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-950">
                    <strong>Catatan Privasi:</strong> Sebagian data tipologi milik{' '}
                    {maskedProfiles.map((p) => p.displayName).join(', ')} dibatasi oleh pengaturan privasi pemilik profil. Analisis tetap berjalan pada informasi yang diizinkan.
                  </div>
                )}

                <svg
                  viewBox="0 0 720 185"
                  className="w-full h-auto bg-white/95 rounded-xl border border-slate-200 p-2"
                  role="img"
                  aria-label="Diagram interaksi dua arah antara dua profil"
                >
                  <defs>
                    <marker id="arrowBlue" markerWidth="8" markerHeight="8" refX="7" refY="3.5" orient="auto">
                      <polygon points="0 0, 8 3.5, 0 7" fill="#2C3C8C" />
                    </marker>
                    <marker id="arrowGold" markerWidth="8" markerHeight="8" refX="7" refY="3.5" orient="auto">
                      <polygon points="0 0, 8 3.5, 0 7" fill="#9A6E24" />
                    </marker>
                  </defs>

                  {/* Node A */}
                  <rect x="20" y="34" width="210" height="118" rx="12" fill="#121938" />
                  <text x="36" y="62" fill="#E6C77E" fontSize="10" fontFamily="JetBrains Mono, monospace" fontWeight="600">
                    INDIVIDU A
                  </text>
                  <text x="36" y="84" fill="#FFFFFF" fontSize="14" fontFamily="Fraunces, Georgia, serif" fontWeight="700">
                    {analysis.directionalMap.personAName.slice(0, 22)}
                  </text>
                  <text x="36" y="106" fill="#CBD5E1" fontSize="9.5" fontFamily="JetBrains Mono, monospace">
                    {analysis.directionalMap.personACodeSummary.slice(0, 32)}
                  </text>
                  <text x="36" y="132" fill="#94A3B8" fontSize="9" fontFamily="Manrope, sans-serif">
                    {activeDirection === 'A_TO_B' ? 'Sumber pesan aktif (Pengirim)' : 'Penerima & penafsir pesan'}
                  </text>

                  {/* Node B */}
                  <rect x="490" y="34" width="210" height="118" rx="12" fill="#121938" />
                  <text x="506" y="62" fill="#E6C77E" fontSize="10" fontFamily="JetBrains Mono, monospace" fontWeight="600">
                    INDIVIDU B
                  </text>
                  <text x="506" y="84" fill="#FFFFFF" fontSize="14" fontFamily="Fraunces, Georgia, serif" fontWeight="700">
                    {analysis.directionalMap.personBName.slice(0, 22)}
                  </text>
                  <text x="506" y="106" fill="#CBD5E1" fontSize="9.5" fontFamily="JetBrains Mono, monospace">
                    {analysis.directionalMap.personBCodeSummary.slice(0, 32)}
                  </text>
                  <text x="506" y="132" fill="#94A3B8" fontSize="9" fontFamily="Manrope, sans-serif">
                    {activeDirection === 'B_TO_A' ? 'Sumber pesan aktif (Pengirim)' : 'Penerima & penafsir pesan'}
                  </text>

                  {/* Upper Arrow A -> B */}
                  <g onClick={() => setActiveDirection('A_TO_B')} className="cursor-pointer">
                    <path
                      d="M 235 66 Q 360 32 482 66"
                      fill="none"
                      stroke="#2C3C8C"
                      strokeWidth={activeDirection === 'A_TO_B' ? '3' : '1.5'}
                      strokeOpacity={activeDirection === 'A_TO_B' ? '1' : '0.4'}
                      markerEnd="url(#arrowBlue)"
                    />
                    <rect
                      x="284"
                      y="24"
                      width="152"
                      height="24"
                      rx="6"
                      fill={activeDirection === 'A_TO_B' ? '#2C3C8C' : '#EFF2FD'}
                    />
                    <text
                      x="360"
                      y="40"
                      textAnchor="middle"
                      fontSize="10"
                      fontWeight="700"
                      fontFamily="Manrope, sans-serif"
                      fill={activeDirection === 'A_TO_B' ? '#FFFFFF' : '#2C3C8C'}
                    >
                      Arah A → B (Klik Fokus)
                    </text>
                  </g>

                  {/* Lower Arrow B -> A */}
                  <g onClick={() => setActiveDirection('B_TO_A')} className="cursor-pointer">
                    <path
                      d="M 485 124 Q 360 158 238 124"
                      fill="none"
                      stroke="#9A6E24"
                      strokeWidth={activeDirection === 'B_TO_A' ? '3' : '1.5'}
                      strokeOpacity={activeDirection === 'B_TO_A' ? '1' : '0.4'}
                      markerEnd="url(#arrowGold)"
                    />
                    <rect
                      x="284"
                      y="138"
                      width="152"
                      height="24"
                      rx="6"
                      fill={activeDirection === 'B_TO_A' ? '#9A6E24' : '#FEF3C7'}
                    />
                    <text
                      x="360"
                      y="154"
                      textAnchor="middle"
                      fontSize="10"
                      fontWeight="700"
                      fontFamily="Manrope, sans-serif"
                      fill={activeDirection === 'B_TO_A' ? '#FFFFFF' : '#78350F'}
                    >
                      Arah B → A (Klik Fokus)
                    </text>
                  </g>
                </svg>

                {(() => {
                  const flow =
                    activeDirection === 'A_TO_B'
                      ? analysis.directionalMap.aToB
                      : analysis.directionalMap.bToA;
                  return (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                      <div className="p-3.5 rounded-xl bg-white border border-slate-200 space-y-1">
                        <div className="font-semibold text-indigo-900">
                          Niat Komunikasi ({flow.fromName} → {flow.toName})
                        </div>
                        <p className="text-slate-700 leading-relaxed">{flow.intendedCommunication}</p>
                      </div>
                      <div className="p-3.5 rounded-xl bg-white border border-slate-200 space-y-1">
                        <div className="font-semibold text-amber-900">
                          Cara Pesan Tertangkap oleh {flow.toName}
                        </div>
                        <p className="text-slate-700 leading-relaxed">{flow.receiverInterpretation}</p>
                      </div>
                      <div className="p-3.5 rounded-xl bg-rose-50/50 border border-rose-200/80 space-y-1">
                        <div className="font-semibold text-rose-950">Risiko Salah Paham &amp; Titik Gesekan</div>
                        <p className="text-rose-900 leading-relaxed">{flow.misunderstandingRisk}</p>
                        <p className="text-rose-800/90 text-[11px]">{flow.frictionPoint}</p>
                      </div>
                      <div className="p-3.5 rounded-xl bg-emerald-50/50 border border-emerald-200/80 space-y-1">
                        <div className="font-semibold text-emerald-950">Sinergi &amp; Penyesuaian Praktis</div>
                        <p className="text-emerald-900 leading-relaxed">{flow.complementarySynergy}</p>
                        <p className="text-emerald-800 text-[11px] pt-1">
                          <strong>Saran:</strong> “{flow.adjustmentSuggestion}”
                        </p>
                      </div>
                      <div className="md:col-span-2 flex flex-wrap items-center gap-2 text-[11px] text-slate-500 pt-1">
                        <span className="font-semibold text-slate-700">Dasar Tipologi Arah Ini:</span>
                        {flow.typologyEvidence.map((ev, i) => (
                          <span key={i} className="font-mono bg-white border border-slate-200 rounded px-2 py-0.5">
                            {ev}
                          </span>
                        ))}
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}

            {/* MBTI, SLOAN & Temperament Complementary Lens */}
            <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-4 text-xs">
              <div>
                <h3 className="text-base font-display font-semibold text-slate-900">
                  4. Lensa Tambahan: MBTI, Big Five / SLOAN &amp; Temperamen
                </h3>
                <p className="text-slate-600 mt-0.5">
                  Analisis perbedaan preferensi kognitif MBTI, sifat kebiasaan teramati SLOAN, dan tempo reaksi temperamen.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {selectedProfiles.map((p) => (
                  <div key={`ext-${p.id}`} className="p-3 rounded-lg bg-white border border-slate-200 space-y-1">
                    <div className="font-semibold text-slate-900">{p.displayName}</div>
                    <p className="text-slate-600">
                      MBTI: <strong className="font-mono">{p.typology.mbti || 'Belum diisi'}</strong>
                      {p.typology.mbtiCognitiveStack ? ` (${p.typology.mbtiCognitiveStack})` : ''}
                    </p>
                    <p className="text-slate-600">
                      SLOAN:{' '}
                      <strong className="font-mono">
                        {p.typology.sloanExtended || p.typology.sloanCode || 'Belum diisi'}
                      </strong>
                    </p>
                    <p className="text-slate-600">
                      Temperamen:{' '}
                      <strong>
                        {p.typology.temperament
                          ? p.typology.temperamentSecondary
                            ? `${p.typology.temperament}–${p.typology.temperamentSecondary}`
                            : p.typology.temperament
                          : 'Belum diisi'}
                      </strong>
                    </p>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-xl bg-white border border-slate-200 space-y-1">
                  <div className="font-semibold text-indigo-900">Dinamika MBTI</div>
                  {analysis.mbtiDifferences.map((d, i) => (
                    <p key={i} className="text-slate-700 leading-relaxed">{d}</p>
                  ))}
                </div>
                <div className="p-3.5 rounded-xl bg-white border border-slate-200 space-y-1">
                  <div className="font-semibold text-indigo-900">Dinamika SLOAN / Big Five</div>
                  {analysis.sloanDifferences.map((d, i) => (
                    <p key={i} className="text-slate-700 leading-relaxed">{d}</p>
                  ))}
                </div>
                <div className="p-3.5 rounded-xl bg-white border border-slate-200 space-y-1">
                  <div className="font-semibold text-indigo-900">Dinamika Temperamen</div>
                  {analysis.temperamentDifferences.map((d, i) => (
                    <p key={i} className="text-slate-700 leading-relaxed">{d}</p>
                  ))}
                </div>
              </div>

              <p className="text-slate-600 leading-relaxed">
                Catatan metodologis: Perbedaan temperamen (tempo reaktivitas) maupun trait SLOAN (misalnya keteraturan O vs U atau keterbukaan A vs E) menjelaskan gaya eksekusi harian, namun tidak otomatis menentukan kompatibilitas antarindividu.
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
