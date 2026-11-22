import React, { useMemo, useState } from 'react';
import {
  AlertTriangle,
  BookOpen,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  ClipboardCheck,
  Clock,
  HelpCircle,
  Layers,
  Sparkles,
} from 'lucide-react';
import { buildMultiLayerPersonalInterpretation } from '../lib/interpretationEngine';
import type {
  ContradictionItem,
  InterpretedStatement,
  InterpretationProvenance,
  InterpretationRealityCheck,
  Profile,
  RealityCheckRating,
  UserExplorationData,
} from '../types/dynamap';
import type { NavModuleId } from './BerandaView';

interface PersonalInterpretationPanelProps {
  profile: Profile;
  exploration: UserExplorationData | null;
  mode: 'interpretation' | 'contradictions';
  onSaveExploration?: (next: Partial<UserExplorationData>) => Promise<void>;
  onNavigate?: (moduleId: NavModuleId) => void;
}

const REALITY_RATINGS: RealityCheckRating[] = [
  'Sangat sesuai',
  'Sebagian besar sesuai',
  'Sebagian sesuai',
  'Kurang sesuai',
  'Masih ragu',
];

const SEVERITY_STYLES: Record<ContradictionItem['severity'], string> = {
  perhatian: 'border-amber-300 bg-amber-50/75 text-amber-950',
  nuansa: 'border-indigo-200 bg-indigo-50/60 text-indigo-950',
  info: 'border-slate-200 bg-slate-50/80 text-slate-800',
};

const ProvenanceDrawer: React.FC<{ provenance: InterpretationProvenance }> = ({ provenance }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="pt-2">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-1.5 text-xs font-medium text-indigo-700 hover:text-indigo-900"
      >
        <HelpCircle className="w-3.5 h-3.5" />
        <span>Mengapa Interpretasi Ini?</span>
        {open ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
      </button>

      {open && (
        <div className="mt-2.5 p-3.5 rounded-xl bg-slate-50/90 border border-slate-200 text-xs space-y-2.5 text-slate-700">
          <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-200">
            <span className="font-mono font-semibold text-indigo-800">
              {provenance.epistemicLabel}
            </span>
            <span className="text-[11px] font-mono text-slate-500">
              {provenance.synthesisKind === 'cross-synthesis'
                ? 'Sintesis Lintas Kerangka'
                : 'Penjelasan Kerangka Langsung'}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <div className="font-semibold text-slate-900 mb-1">Data Profil Pendukung:</div>
              <ul className="list-disc pl-4 space-y-0.5 font-mono text-[11px] text-slate-700">
                {provenance.supportingProfileData.map((d, i) => (
                  <li key={i}>{d}</li>
                ))}
              </ul>
            </div>
            <div>
              <div className="font-semibold text-slate-900 mb-1">Kerangka Terlibat:</div>
              <p className="text-slate-700">{provenance.frameworksInvolved.join(' · ') || 'Umum'}</p>
            </div>
          </div>

          <div>
            <div className="font-semibold text-slate-900 mb-0.5">Penalaran Teoretis:</div>
            <p className="leading-relaxed">{provenance.theoreticalExplanation}</p>
          </div>

          {provenance.theoryReferences.length > 0 && (
            <div>
              <div className="font-semibold text-slate-900 mb-0.5">Rujukan Literatur:</div>
              <p className="text-slate-600">{provenance.theoryReferences.join('; ')}</p>
            </div>
          )}

          {provenance.limitationsAndAlternatives.length > 0 && (
            <div className="pt-2 border-t border-slate-200 text-slate-600">
              <strong className="text-slate-800">Batasan &amp; Alternatif:</strong>{' '}
              {provenance.limitationsAndAlternatives.join(' ')}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const RealityCheckWidget: React.FC<{
  statementId: string;
  statementTitle: string;
  layer: InterpretationRealityCheck['layer'];
  existing?: InterpretationRealityCheck;
  onSave?: (check: InterpretationRealityCheck) => Promise<void>;
}> = ({ statementId, statementTitle, layer, existing, onSave }) => {
  const [expanded, setExpanded] = useState(false);
  const [rating, setRating] = useState<RealityCheckRating>(existing?.rating || 'Sebagian sesuai');
  const [note, setNote] = useState(existing?.note || '');
  const [realLifeExample, setRealLifeExample] = useState(existing?.realLifeExample || '');
  const [saving, setSaving] = useState(false);
  const [savedNotice, setSavedNotice] = useState('');

  async function handleSaveCheck(e: React.FormEvent) {
    e.preventDefault();
    if (!onSave) return;
    setSaving(true);
    setSavedNotice('');
    try {
      const now = new Date().toISOString();
      const prevHistory = existing?.history || [];
      const nextCheck: InterpretationRealityCheck = {
        id: existing?.id || `rc-${statementId}`,
        statementId,
        statementTitle,
        layer,
        rating,
        note: note.trim(),
        realLifeExample: realLifeExample.trim(),
        updatedAt: now,
        history: [
          { rating, note: note.trim(), recordedAt: now },
          ...prevHistory,
        ].slice(0, 12),
      };
      await onSave(nextCheck);
      setSavedNotice('Catatan pemeriksaan realitas disimpan (label tipologi tidak diubah).');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="pt-2 border-t border-slate-100">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-xs">
          <ClipboardCheck className="w-3.5 h-3.5 text-emerald-700" />
          <span className="font-medium text-slate-700">Pemeriksaan Realitas &amp; Refleksi</span>
          {existing && (
            <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
              {existing.rating}
            </span>
          )}
        </div>
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="text-xs font-medium text-indigo-700 hover:underline whitespace-nowrap"
        >
          {expanded ? 'Tutup Refleksi' : existing ? 'Perbarui Refleksi' : 'Nilai Kesesuaian Nyata'}
        </button>
      </div>

      {expanded && (
        <form onSubmit={handleSaveCheck} className="mt-3 p-3.5 rounded-xl bg-emerald-50/40 border border-emerald-200/80 space-y-3 text-xs">
          <p className="text-slate-600 leading-relaxed">
            Seberapa cocok pernyataan ini dengan pengalaman hidup Anda yang sesungguhnya? Penilaian ini bersifat reflektif dan{' '}
            <strong className="text-slate-800">tidak mengubah kode tipologi secara otomatis</strong>.
          </p>

          <div className="flex flex-wrap gap-1.5">
            {REALITY_RATINGS.map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRating(r)}
                className={`px-2.5 py-1.5 rounded-lg border text-xs font-medium transition-colors ${
                  rating === r
                    ? 'bg-[#151D40] text-white border-[#151D40]'
                    : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                }`}
              >
                {r}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-slate-700 mb-1">
                Catatan Refleksi Pribadi
              </label>
              <textarea
                rows={2}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Mis. Di kelompok belajar memang terasa, tapi saat di rumah lebih santai..."
                className="w-full px-2.5 py-2 border border-slate-300 rounded-lg bg-white text-xs"
              />
            </div>
            <div>
              <label className="block font-medium text-slate-700 mb-1">
                Contoh Kejadian Nyata (Opsional)
              </label>
              <textarea
                rows={2}
                value={realLifeExample}
                onChange={(e) => setRealLifeExample(e.target.value)}
                placeholder="Mis. Saat diskusi tugas Biologi minggu lalu..."
                className="w-full px-2.5 py-2 border border-slate-300 rounded-lg bg-white text-xs"
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2">
            {savedNotice ? (
              <span className="text-emerald-800 font-medium">{savedNotice}</span>
            ) : (
              <span className="text-slate-500">Riwayat tinjauan tersimpan kronologis.</span>
            )}
            <button
              type="submit"
              disabled={saving || !onSave}
              className="px-3.5 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-medium disabled:opacity-50"
            >
              {saving ? 'Menyimpan...' : 'Simpan Pemeriksaan Realitas'}
            </button>
          </div>

          {existing?.history && existing.history.length > 0 && (
            <div className="pt-2 border-t border-emerald-200/70 space-y-1">
              <div className="flex items-center gap-1.5 font-semibold text-slate-700">
                <Clock className="w-3 h-3" />
                <span>Riwayat Peninjauan ({existing.history.length})</span>
              </div>
              <ul className="space-y-1 text-[11px] text-slate-600">
                {existing.history.slice(0, 4).map((h, i) => (
                  <li key={i} className="flex flex-wrap items-baseline gap-2">
                    <span className="font-mono text-slate-500">
                      {new Date(h.recordedAt).toLocaleDateString('id-ID')}
                    </span>
                    <span className="font-semibold text-slate-800">{h.rating}</span>
                    {h.note && <span>— {h.note}</span>}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </form>
      )}
    </div>
  );
};

export const PersonalInterpretationPanel: React.FC<PersonalInterpretationPanelProps> = ({
  profile,
  exploration,
  mode,
  onSaveExploration,
  onNavigate,
}) => {
  const interpretation = useMemo(
    () => buildMultiLayerPersonalInterpretation(profile),
    [profile]
  );
  const [activeLayerTab, setActiveLayerTab] = useState<'overview' | 'frameworks' | 'composite'>('overview');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');

  const realityChecksMap = exploration?.interpretationRealityChecks || {};

  async function handleSaveRealityCheck(check: InterpretationRealityCheck) {
    if (!onSaveExploration) return;
    await onSaveExploration({
      interpretationRealityChecks: {
        ...realityChecksMap,
        [check.statementId]: check,
      },
    });
  }

  const savedCheckCount = Object.keys(realityChecksMap).length;

  if (mode === 'contradictions') {
    const categories = Array.from(new Set(interpretation.contradictions.map((c) => c.category)));
    const filteredContradictions =
      categoryFilter === 'ALL'
        ? interpretation.contradictions
        : interpretation.contradictions.filter((c) => c.category === categoryFilter);

    return (
      <div className="space-y-6">
        <div className="atlas-sheet rounded-2xl p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="atlas-kicker">Audit Konsistensi &amp; Nuansa Lintas Lapis</span>
              <h2 className="mt-1 text-xl font-display font-semibold text-slate-900">
                Analisis Kontradiksi &amp; Kompleksitas Profil
              </h2>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed max-w-2xl">
                Mengidentifikasi ketidakcocokan antar-bidang, ketegangan produktif antara kognisi vs motivasi vs perilaku,
                dan celah informasi yang masih terbuka—agar profil tidak dipaksa seragam.
              </p>
            </div>
            <div className="font-mono text-xs bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 shrink-0 tabular-nums">
              Terdeteksi: <strong>{interpretation.contradictions.length}</strong> catatan
            </div>
          </div>

          <div className="flex flex-wrap gap-2 pt-1">
            <button
              type="button"
              onClick={() => setCategoryFilter('ALL')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                categoryFilter === 'ALL'
                  ? 'bg-[#151D40] text-white border-[#151D40]'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              Semua ({interpretation.contradictions.length})
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategoryFilter(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                  categoryFilter === cat
                    ? 'bg-[#151D40] text-white border-[#151D40]'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          {filteredContradictions.map((item) => (
            <article
              key={item.id}
              className={`rounded-2xl border p-5 sm:p-6 space-y-3 ${SEVERITY_STYLES[item.severity]}`}
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span className="font-mono text-[11px] font-semibold uppercase tracking-wider">
                    {item.category}
                  </span>
                </div>
                <span className="font-mono text-[11px] opacity-80">
                  {item.frameworksOrFields.join(' × ')}
                </span>
              </div>

              <h3 className="text-base sm:text-lg font-display font-semibold">{item.title}</h3>
              <p className="text-sm leading-relaxed">{item.explanation}</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 text-xs">
                <div className="p-3.5 rounded-xl bg-white/85 border border-slate-200/80 text-slate-700">
                  <div className="font-semibold text-slate-900 mb-1">Mengapa Keduanya Bisa Hidup Bersama:</div>
                  <p className="leading-relaxed">{item.coexistenceGuidance}</p>
                </div>
                <div className="p-3.5 rounded-xl bg-white/85 border border-slate-200/80 text-slate-700">
                  <div className="font-semibold text-slate-900 mb-1">Pertanyaan Refleksi Diri:</div>
                  <p className="leading-relaxed italic">{item.reflectionQuestion}</p>
                </div>
              </div>

              <div className="bg-white/90 rounded-xl p-3 border border-slate-200/70">
                <RealityCheckWidget
                  statementId={item.id}
                  statementTitle={item.title}
                  layer="contradiction"
                  existing={realityChecksMap[item.id]}
                  onSave={onSaveExploration ? handleSaveRealityCheck : undefined}
                />
              </div>
            </article>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary & Completeness Ledger */}
      <section className="dreamy-surface border border-slate-200 rounded-2xl p-6 space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-200 pb-4">
          <div>
            <span className="atlas-kicker">Sintesis Multi-Kerangka Otomatis</span>
            <h2 className="mt-1 text-xl sm:text-2xl font-display font-semibold text-slate-900">
              Interpretasi Pribadi Terpadu — {profile.displayName}
            </h2>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed max-w-2xl">
              {interpretation.overallEpistemicNote}
            </p>
          </div>

          <div className="flex items-center gap-4 shrink-0">
            <div className="text-right">
              <div className="text-[11px] font-mono uppercase text-slate-500">Kelengkapan Data</div>
              <div className="text-2xl font-display font-bold text-indigo-800 tabular-nums">
                {interpretation.completenessRatio}%
              </div>
            </div>
            <div className="text-right border-l border-slate-200 pl-4">
              <div className="text-[11px] font-mono uppercase text-slate-500">Realitas Teruji</div>
              <div className="text-2xl font-display font-bold text-emerald-700 tabular-nums">
                {savedCheckCount}
              </div>
            </div>
          </div>
        </div>

        <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
          <div
            className="h-full bg-[#2C3C8C] transition-all duration-300"
            style={{ width: `${interpretation.completenessRatio}%` }}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-200/70 space-y-1.5">
            <div className="font-semibold text-emerald-950 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-700" />
              <span>Aspek yang Dapat Diinterpretasikan ({interpretation.interpretableAspects.length})</span>
            </div>
            <p className="text-slate-700 leading-relaxed">
              Kerangka terisi: <strong>{interpretation.filledFrameworks.join(', ') || 'Belum ada'}</strong>.
            </p>
            <p className="text-[11px] text-slate-600">
              {interpretation.interpretableAspects.slice(0, 6).join(' · ')}
              {interpretation.interpretableAspects.length > 6 ? ` (+${interpretation.interpretableAspects.length - 6} lainnya)` : ''}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
            <div className="font-semibold text-slate-900 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-slate-500" />
              <span>Aspek Belum Tersedia ({interpretation.unavailableAspects.length})</span>
            </div>
            <p className="text-slate-600 leading-relaxed">
              {interpretation.missingFrameworks.length > 0
                ? `Belum diisi: ${interpretation.missingFrameworks.join(', ')}. Sistem tidak menebak tipe yang kosong.`
                : 'Seluruh 8 kerangka terisi—interpretasi menggunakan data profil terkini.'}
            </p>
            {interpretation.unavailableAspects.length > 0 && (
              <p className="text-[11px] text-slate-500">
                Topik terbuka: {interpretation.unavailableAspects.join(', ')}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Layer Switcher Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setActiveLayerTab('overview')}
            className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold border transition-colors ${
              activeLayerTab === 'overview'
                ? 'bg-[#151D40] text-white border-[#151D40]'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Lapis 1: Ringkasan Terpadu (13 Topik)</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveLayerTab('frameworks')}
            className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold border transition-colors ${
              activeLayerTab === 'frameworks'
                ? 'bg-[#151D40] text-white border-[#151D40]'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Lapis 2: Rincian 8 Kerangka</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveLayerTab('composite')}
            className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold border transition-colors ${
              activeLayerTab === 'composite'
                ? 'bg-[#151D40] text-white border-[#151D40]'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Lapis 3: Dinamika Sintesis Lintas Kerangka ({interpretation.compositeDynamics.length})</span>
          </button>
        </div>

        {onNavigate && (
          <button
            type="button"
            onClick={() => onNavigate('eksplorasi-diri')}
            className="text-xs font-medium text-indigo-700 hover:underline whitespace-nowrap"
          >
            Uji di Simulator Skenario
          </button>
        )}
      </div>

      {/* Layer 1: Integrated Overview (13 Topics) */}
      {activeLayerTab === 'overview' && (
        <div className="divide-y divide-slate-200 bg-white border border-slate-200 rounded-2xl overflow-hidden">
          {interpretation.overviewStatements.map((stmt: InterpretedStatement, idx: number) => (
            <article key={stmt.id} className="p-5 sm:p-6 space-y-2.5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-baseline gap-2.5">
                  <span className="atlas-index text-xs font-semibold text-indigo-700">
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                  <h3 className="text-base font-display font-semibold text-slate-900">{stmt.topic}</h3>
                </div>
                <span
                  className={`font-mono text-[11px] px-2 py-0.5 rounded border ${
                    stmt.available
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                      : 'bg-slate-50 text-slate-600 border-slate-200'
                  }`}
                >
                  {stmt.available ? 'Tersintesis' : 'Data Belum Lengkap'}
                </span>
              </div>

              <p className={`text-sm leading-relaxed ${stmt.available ? 'text-slate-700' : 'text-slate-500 italic'}`}>
                {stmt.statement}
              </p>

              {stmt.missingReason && (
                <p className="text-xs text-amber-800 bg-amber-50/70 border border-amber-200 rounded-lg px-3 py-1.5">
                  {stmt.missingReason}
                </p>
              )}

              <ProvenanceDrawer provenance={stmt.provenance} />

              {stmt.available && (
                <RealityCheckWidget
                  statementId={stmt.id}
                  statementTitle={stmt.topic}
                  layer="overview"
                  existing={realityChecksMap[stmt.id]}
                  onSave={onSaveExploration ? handleSaveRealityCheck : undefined}
                />
              )}
            </article>
          ))}
        </div>
      )}

      {/* Layer 2: Framework-by-Framework Breakdown (8 Frameworks) */}
      {activeLayerTab === 'frameworks' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {interpretation.frameworkBreakdowns.map((fw) => (
            <article
              key={fw.frameworkKey}
              className="bg-white border border-slate-200 rounded-2xl p-5 space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2.5">
                <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-2.5">
                  <div>
                    <div className="text-xs font-medium text-slate-500">{fw.frameworkName}</div>
                    <div className="text-lg font-display font-bold text-slate-900 font-mono">
                      {fw.codeDisplay}
                    </div>
                  </div>
                  <span
                    className={`font-mono text-[11px] px-2 py-0.5 rounded border shrink-0 ${
                      fw.available
                        ? 'bg-indigo-50 text-indigo-800 border-indigo-200'
                        : 'bg-slate-50 text-slate-500 border-slate-200'
                    }`}
                  >
                    {fw.available ? 'Aktif' : 'Kosong'}
                  </span>
                </div>

                <p className="text-sm text-slate-700 leading-relaxed">{fw.summary}</p>

                {fw.coreMechanisms.length > 0 && (
                  <ul className="space-y-1 text-xs text-slate-600 list-disc pl-4">
                    {fw.coreMechanisms.map((m, idx) => (
                      <li key={idx}>{m}</li>
                    ))}
                  </ul>
                )}

                {fw.unavailableAspects.length > 0 && (
                  <div className="text-[11px] text-amber-800 bg-amber-50/70 border border-amber-200 rounded-lg p-2.5">
                    <strong>Bagian belum terisi:</strong> {fw.unavailableAspects.join('; ')}
                  </div>
                )}

                <ProvenanceDrawer provenance={fw.provenance} />
              </div>

              {fw.available && (
                <RealityCheckWidget
                  statementId={`fw-${fw.frameworkKey}`}
                  statementTitle={`${fw.frameworkName}: ${fw.codeDisplay}`}
                  layer="framework"
                  existing={realityChecksMap[`fw-${fw.frameworkKey}`]}
                  onSave={onSaveExploration ? handleSaveRealityCheck : undefined}
                />
              )}
            </article>
          ))}
        </div>
      )}

      {/* Layer 3: Composite Cross-Framework Dynamics */}
      {activeLayerTab === 'composite' && (
        <div className="space-y-4">
          {interpretation.compositeDynamics.map((comp) => (
            <article
              key={comp.id}
              className="dreamy-surface border border-slate-200 rounded-2xl p-5 sm:p-6 space-y-3"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-base sm:text-lg font-display font-semibold text-slate-900">
                  {comp.topic}
                </h3>
                <span className="font-mono text-[11px] text-indigo-700">
                  {comp.provenance.frameworksInvolved.join(' × ')}
                </span>
              </div>
              <p className="text-sm text-slate-700 leading-relaxed">{comp.statement}</p>
              <ProvenanceDrawer provenance={comp.provenance} />
              {comp.available && (
                <RealityCheckWidget
                  statementId={comp.id}
                  statementTitle={comp.topic}
                  layer="composite"
                  existing={realityChecksMap[comp.id]}
                  onSave={onSaveExploration ? handleSaveRealityCheck : undefined}
                />
              )}
            </article>
          ))}
        </div>
      )}
    </div>
  );
};
