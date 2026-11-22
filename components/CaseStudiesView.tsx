import React, { useMemo, useState } from 'react';
import {
  AlertCircle,
  BookmarkCheck,
  BookOpenCheck,
  CheckCircle2,
  Compass,
  FileSearch,
  Layers,
  Trash2,
} from 'lucide-react';
import {
  CASE_STUDIES_CATALOG,
  type CaseStudyCategory,
  type CaseStudyDefinition,
} from '../data/arcadeAndCaseData';
import type {
  Account,
  ArcadeDifficulty,
  SavedCaseStudyAttempt,
  UserExplorationData,
} from '../types/dynamap';
import { CelestialCornerFiligree } from './CelestialDecorations';
import type { NavModuleId } from './BerandaView';
import type { TheoryLibraryTab } from './AnalisisKepribadianView';

interface CaseStudiesViewProps {
  account: Account | null;
  exploration: UserExplorationData | null;
  onSaveExploration: (next: Partial<UserExplorationData>) => Promise<void>;
  onOpenAuth: () => void;
  onNavigate?: (moduleId: NavModuleId, options?: { theoryTab?: TheoryLibraryTab }) => void;
}

const GUEST_CASE_KEY = 'dynamap_guest_casestudies_v1';

const ALL_CATEGORIES: { id: 'all' | CaseStudyCategory; label: string }[] = [
  { id: 'all', label: 'Semua Kategori (6 Jenis)' },
  { id: 'Fictional character analysis', label: 'Analisis Tokoh Fiktif' },
  { id: 'Hypothetical personality cases', label: 'Kasus Kepribadian Hipotetis' },
  { id: 'Decision-making scenarios', label: 'Skenario Pengambilan Keputusan' },
  { id: 'Communication scenarios', label: 'Skenario Komunikasi' },
  { id: 'Theory comparison cases', label: 'Kasus Perbandingan Teori' },
  { id: 'Multi-framework cases', label: 'Kasus Multi-Kerangka' },
];

const FRAMEWORK_OPTIONS = [
  'Socionics',
  'MBTI / Jungian',
  'Enneagram',
  'Instincts',
  'Psikosofi',
  'SLOAN',
  'Temperament',
  'Etika & Konteks Situasional',
];

export const CaseStudiesView: React.FC<CaseStudiesViewProps> = ({
  account,
  exploration,
  onSaveExploration,
  onOpenAuth,
  onNavigate,
}) => {
  const [guestSaved, setGuestSaved] = useState<SavedCaseStudyAttempt[]>(() => {
    try {
      const raw = localStorage.getItem(GUEST_CASE_KEY);
      if (raw) return JSON.parse(raw) as SavedCaseStudyAttempt[];
    } catch {
      // Ignore invalid JSON
    }
    return [];
  });

  const savedAttempts = useMemo(() => {
    if (account && exploration) return exploration.savedCaseStudies || [];
    return guestSaved;
  }, [account, exploration, guestSaved]);

  const [categoryFilter, setCategoryFilter] = useState<'all' | CaseStudyCategory>('all');
  const [difficultyFilter, setDifficultyFilter] = useState<'all' | ArcadeDifficulty>('all');
  const [selectedCaseId, setSelectedCaseId] = useState<string>(CASE_STUDIES_CATALOG[0].id);

  // Interactive Multi-Step Analysis State
  const [selectedFrameworks, setSelectedFrameworks] = useState<string[]>([]);
  const [checkedEvidenceIds, setCheckedEvidenceIds] = useState<string[]>([]);
  const [selectedInterpretationIds, setSelectedInterpretationIds] = useState<string[]>([]);
  const [reasoningNote, setReasoningNote] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [saveFeedback, setSaveFeedback] = useState('');

  const filteredCases = useMemo(
    () =>
      CASE_STUDIES_CATALOG.filter((c) => {
        if (categoryFilter !== 'all' && c.category !== categoryFilter) return false;
        if (difficultyFilter !== 'all' && c.difficulty !== difficultyFilter) return false;
        return true;
      }),
    [categoryFilter, difficultyFilter]
  );

  const activeCase: CaseStudyDefinition = useMemo(
    () =>
      CASE_STUDIES_CATALOG.find((c) => c.id === selectedCaseId) ||
      filteredCases[0] ||
      CASE_STUDIES_CATALOG[0],
    [selectedCaseId, filteredCases]
  );

  function loadCase(caseId: string, preset?: SavedCaseStudyAttempt) {
    setSelectedCaseId(caseId);
    setSelectedFrameworks(preset?.selectedFrameworks || []);
    setCheckedEvidenceIds(preset?.checkedEvidenceIds || []);
    setSelectedInterpretationIds(preset?.selectedInterpretationIds || []);
    setReasoningNote(preset?.reasoningNote || '');
    setSubmitted(Boolean(preset));
    setSaveFeedback('');
  }

  async function persistAttempts(next: SavedCaseStudyAttempt[]) {
    if (account) {
      await onSaveExploration({ savedCaseStudies: next });
    } else {
      setGuestSaved(next);
      try {
        localStorage.setItem(GUEST_CASE_KEY, JSON.stringify(next));
      } catch {
        // Ignore storage error
      }
    }
  }

  async function handleSaveAttempt() {
    const attempt: SavedCaseStudyAttempt = {
      id: `csa-${Date.now()}`,
      caseId: activeCase.id,
      caseTitle: activeCase.title,
      selectedFrameworks,
      checkedEvidenceIds,
      selectedInterpretationIds,
      reasoningNote: reasoningNote.trim(),
      savedAt: new Date().toISOString(),
    };
    const next = [attempt, ...savedAttempts.filter((a) => a.caseId !== activeCase.id)].slice(0, 25);
    await persistAttempts(next);
    setSaveFeedback('Analisis kasus berhasil disimpan ke daftar tinjauan Anda.');
  }

  function toggleValue(list: string[], val: string, setter: React.Dispatch<React.SetStateAction<string[]>>) {
    setter(list.includes(val) ? list.filter((x) => x !== val) : [...list, val]);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <section className="relative overflow-hidden dreamy-surface border border-slate-200/80 rounded-2xl p-6 sm:p-7 space-y-3">
        <CelestialCornerFiligree tone="dark" className="w-24 h-24 opacity-40" />
        <div className="relative max-w-3xl space-y-2">
          <div className="text-xs font-medium text-indigo-700">
            Eksplorasi Analitis Multi-Langkah · Bukti, Ambiguitas & Alternatif
          </div>
          <h1 className="text-2xl font-display font-bold text-slate-900">
            Studi Kasus Lanjutan
          </h1>
          <p className="text-sm text-slate-600 leading-relaxed">
            Latih penalaran kritis tanpa terjebak stereotip: pisahkan fakta terobservasi dari bagian yang masih
            ambigu, bandingkan hipotesis antar-kerangka, lalu tinjau interpretasi terstruktur.
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="dreamy-surface border border-slate-200/80 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-1.5">
          {ALL_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setCategoryFilter(cat.id)}
              className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors ${
                categoryFilter === cat.id
                  ? 'bg-[#151D40] text-white border-[#151D40]'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <select
          value={difficultyFilter}
          onChange={(e) => setDifficultyFilter(e.target.value as 'all' | ArcadeDifficulty)}
          className="px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg"
        >
          <option value="all">Semua Tingkat Kesulitan</option>
          <option value="dasar">Pemula (Dasar)</option>
          <option value="menengah">Menengah</option>
          <option value="lanjutan">Lanjutan</option>
        </select>
      </section>

      {/* Main Split Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Case List Sidebar */}
        <aside className="lg:col-span-4 space-y-3">
          <div className="text-xs font-semibold text-slate-700 px-1">
            Daftar Studi Kasus ({filteredCases.length})
          </div>
          {filteredCases.map((c) => {
            const active = c.id === activeCase.id;
            const isSaved = savedAttempts.some((a) => a.caseId === c.id);
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => loadCase(c.id)}
                className={`w-full text-left p-4 rounded-xl border transition-all space-y-1.5 ${
                  active
                    ? 'bg-[#151D40] border-[#151D40] text-white shadow-sm'
                    : 'dreamy-surface border-slate-200/80 text-slate-900 hover:border-indigo-300'
                }`}
              >
                <div className="flex items-center justify-between gap-2 text-[11px]">
                  <span className={active ? 'text-[#E6C77E] font-medium' : 'text-indigo-700 font-medium'}>
                    {c.categoryIndo}
                  </span>
                  <span className="capitalize opacity-80">{c.difficulty}</span>
                </div>
                <div className="text-xs font-display font-bold leading-snug">{c.title}</div>
                <div className={`text-[11px] flex items-center justify-between ${active ? 'text-indigo-200' : 'text-slate-500'}`}>
                  <span>{c.frameworksRelevant.join(' · ')}</span>
                  {isSaved && <BookmarkCheck className="w-3.5 h-3.5 shrink-0" />}
                </div>
              </button>
            );
          })}

          {savedAttempts.length > 0 && (
            <div className="dreamy-surface border border-slate-200/80 rounded-xl p-4 space-y-2.5">
              <div className="text-xs font-bold text-slate-900">
                Riwayat Analisis Tersimpan ({savedAttempts.length})
              </div>
              {savedAttempts.map((att) => (
                <div
                  key={att.id}
                  className="p-2.5 rounded-lg bg-white border border-slate-200 flex items-center justify-between gap-2 text-xs"
                >
                  <button
                    type="button"
                    onClick={() => loadCase(att.caseId, att)}
                    className="text-left min-w-0 flex-1 hover:text-indigo-700 font-medium truncate"
                  >
                    {att.caseTitle}
                  </button>
                  <button
                    type="button"
                    aria-label="Hapus riwayat kasus"
                    onClick={() => persistAttempts(savedAttempts.filter((x) => x.id !== att.id))}
                    className="p-1 text-slate-400 hover:text-rose-600"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </aside>

        {/* Active Multi-Step Case Workspace */}
        <div className="lg:col-span-8 space-y-5">
          {/* Step 1: Narrative */}
          <section className="dreamy-surface border border-slate-200/80 rounded-2xl p-6 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
              <span className="font-semibold text-indigo-700">
                Langkah 1 · Narasi Kasus ({activeCase.categoryIndo})
              </span>
              <span className="text-slate-500 capitalize">
                Tingkat: {activeCase.difficulty} · Fokus: {activeCase.frameworksRelevant.join(', ')}
              </span>
            </div>
            <h2 className="text-lg font-display font-bold text-slate-900">{activeCase.title}</h2>
            <p className="text-sm text-slate-700 leading-relaxed bg-white/80 p-4 rounded-xl border border-slate-200/80">
              {activeCase.narrative}
            </p>
          </section>

          {/* Step 2: Select Frameworks */}
          <section className="dreamy-surface border border-slate-200/80 rounded-2xl p-6 space-y-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-indigo-700">
              <Layers className="w-4 h-4" />
              Langkah 2 · Pilih Lensa Kerangka yang Relevan untuk Menganalisis Kasus Ini
            </div>
            <div className="flex flex-wrap gap-2">
              {FRAMEWORK_OPTIONS.map((fw) => {
                const picked = selectedFrameworks.includes(fw);
                return (
                  <button
                    key={fw}
                    type="button"
                    onClick={() => toggleValue(selectedFrameworks, fw, setSelectedFrameworks)}
                    className={`px-3 py-1.5 rounded-lg border text-xs font-medium ${
                      picked
                        ? 'bg-indigo-700 text-white border-indigo-700'
                        : 'bg-white text-slate-700 border-slate-200 hover:border-indigo-300'
                    }`}
                  >
                    {fw}
                  </button>
                );
              })}
            </div>
          </section>

          {/* Step 3: Observed Evidence vs Ambiguity */}
          <section className="dreamy-surface border border-slate-200/80 rounded-2xl p-6 space-y-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-indigo-700">
              <FileSearch className="w-4 h-4" />
              Langkah 3 · Tandai Butir Bukti Terobservasi & Celah Ambiguitas yang Perlu Diwaspadai
            </div>
            <div className="space-y-2">
              {activeCase.evidenceItems.map((ev) => {
                const checked = checkedEvidenceIds.includes(ev.id);
                return (
                  <button
                    key={ev.id}
                    type="button"
                    onClick={() => toggleValue(checkedEvidenceIds, ev.id, setCheckedEvidenceIds)}
                    className={`w-full text-left p-3.5 rounded-xl border text-xs flex items-start justify-between gap-3 transition-colors ${
                      checked
                        ? 'bg-indigo-50/90 border-indigo-400 text-slate-900'
                        : 'bg-white border-slate-200 text-slate-700 hover:border-indigo-300'
                    }`}
                  >
                    <span>{ev.text}</span>
                    {submitted && (
                      <span
                        className={`shrink-0 font-semibold ${
                          ev.type === 'observed' ? 'text-emerald-700' : 'text-amber-700'
                        }`}
                      >
                        {ev.type === 'observed' ? 'Fakta Teramati' : 'Bagian Ambigu'}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </section>

          {/* Step 4: Evaluate Interpretations & Write Reasoning */}
          <section className="dreamy-surface border border-slate-200/80 rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-2 text-xs font-semibold text-indigo-700">
              <Compass className="w-4 h-4" />
              Langkah 4 · Pilih Interpretasi yang Menurut Anda Paling Beralasan & Tuliskan Alasan
            </div>

            <div className="space-y-2.5">
              {activeCase.interpretations.map((interp) => {
                const picked = selectedInterpretationIds.includes(interp.id);
                return (
                  <div
                    key={interp.id}
                    className={`p-4 rounded-xl border space-y-2 ${
                      picked
                        ? 'bg-indigo-50/80 border-indigo-400'
                        : 'bg-white border-slate-200'
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() =>
                        toggleValue(selectedInterpretationIds, interp.id, setSelectedInterpretationIds)
                      }
                      className="w-full text-left flex items-start justify-between gap-3"
                    >
                      <div className="space-y-0.5">
                        <div className="text-[11px] font-semibold text-indigo-700">{interp.framework}</div>
                        <div className="text-xs font-semibold text-slate-900">{interp.label}</div>
                      </div>
                      <span
                        className={`w-4 h-4 rounded border shrink-0 mt-0.5 ${
                          picked ? 'bg-indigo-700 border-indigo-700' : 'border-slate-300'
                        }`}
                      />
                    </button>

                    {submitted && (
                      <div className="pt-2 border-t border-slate-200 text-xs space-y-1">
                        <div
                          className={`font-semibold ${
                            interp.plausibility === 'Didukung Bukti'
                              ? 'text-emerald-800'
                              : interp.plausibility === 'Kemungkinan Alternatif'
                              ? 'text-amber-800'
                              : 'text-rose-800'
                          }`}
                        >
                          Evaluasi Bukti: {interp.plausibility}
                        </div>
                        <p className="text-slate-700 leading-relaxed">{interp.analysis}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1.5">
                Catatan Penalaran Pribadi Anda (Opsional):
              </label>
              <textarea
                rows={3}
                value={reasoningNote}
                onChange={(e) => setReasoningNote(e.target.value)}
                placeholder="Tuliskan mengapa Anda mendukung atau meragukan hipotesis tertentu..."
                className="w-full px-3.5 py-2.5 text-xs bg-white border border-slate-300 rounded-xl"
              />
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => setSubmitted(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-indigo-700 hover:bg-indigo-800 rounded-lg"
              >
                <BookOpenCheck className="w-4 h-4" />
                {submitted ? 'Evaluasi Terbuka' : 'Periksa Analisis Terstruktur'}
              </button>
              <button
                type="button"
                onClick={handleSaveAttempt}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-800 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg"
              >
                <BookmarkCheck className="w-4 h-4 text-indigo-700" />
                Simpan Analisis Kasus
              </button>
            </div>

            {saveFeedback && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900">
                {saveFeedback}
              </div>
            )}
          </section>

          {/* Post-Submission Structured Synthesis */}
          {submitted && (
            <section className="bg-[#101733] text-white border border-[#DFBE74]/40 rounded-2xl p-6 space-y-4">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#E6C77E]">
                <CheckCircle2 className="w-4 h-4" />
                Sintesis Pembimbing & Catatan Ketidakpastian
              </div>
              <p className="text-xs text-[#E2E8F8] leading-relaxed">{activeCase.guidingSynthesis}</p>

              <div className="p-3.5 rounded-xl bg-white/[0.06] border border-white/10 space-y-1.5">
                <div className="text-xs font-semibold text-amber-200 flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5" />
                  Informasi yang Masih Hilang / Perlu Klarifikasi:
                </div>
                <ul className="list-disc list-inside text-xs text-slate-200 space-y-1">
                  {activeCase.missingInfoNotes.map((n, i) => (
                    <li key={i}>{n}</li>
                  ))}
                </ul>
              </div>

              <div className="text-xs text-[#9AA6CE]">
                <strong className="text-white">Konsep Terkait:</strong> {activeCase.linkedConcepts.join(' · ')}
              </div>

              {onNavigate && (
                <div className="pt-3 border-t border-white/10 flex flex-wrap items-center gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => {
                      const fw = activeCase.frameworksRelevant.join(' ').toLowerCase();
                      const theoryTab: TheoryLibraryTab = fw.includes('temperament')
                        ? 'temperament'
                        : fw.includes('sloan')
                        ? 'sloan'
                        : fw.includes('mbti')
                        ? 'mbti'
                        : fw.includes('enneagram')
                        ? 'enneagram'
                        : 'socionics';
                      onNavigate('analisis-kepribadian', { theoryTab });
                    }}
                    className="px-3 py-1.5 rounded-lg bg-[#E6C77E] text-[#101733] font-semibold hover:bg-[#F0D694]"
                  >
                    Pelajari Teori Terkait
                  </button>
                  <button
                    type="button"
                    onClick={() => onNavigate('playground-tipologi')}
                    className="px-3 py-1.5 rounded-lg bg-white/10 text-white hover:bg-white/20"
                  >
                    Uji di Playground
                  </button>
                  <button
                    type="button"
                    onClick={() => onNavigate('arcade-tipologi')}
                    className="px-3 py-1.5 rounded-lg bg-white/10 text-white hover:bg-white/20"
                  >
                    Latih di Arcade
                  </button>
                </div>
              )}
            </section>
          )}

          {!account && (
            <div className="text-xs text-slate-500 flex items-center justify-between px-2">
              <span>Analisis tersimpan lokal untuk mode tamu. Masuk agar tersinkronisasi ke akun DYNAMAP.</span>
              <button type="button" onClick={onOpenAuth} className="text-indigo-700 font-semibold hover:underline">
                Masuk / Klaim Akun
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
