import React, { useMemo, useState } from 'react';
import {
  AlertCircle,
  BookOpen,
  CheckCircle2,
  Compass,
  ExternalLink,
  Gamepad2,
  GitCompare,
  Layers,
  Search,
} from 'lucide-react';
import {
  ALL_16_MBTI_PROFILES,
  CLASSICAL_4_TEMPERAMENTS,
  MBTI_DICHOTOMIES,
  MBTI_FUNCTION_POSITIONS,
  MBTI_HISTORY_TIMELINE,
  MBTI_MODEL_COMPARISON,
  MBTI_STACK_DYNAMICS_16,
  MIXED_12_TEMPERAMENTS,
  SLOAN_THEORY_OVERVIEW,
  TEMPERAMENT_HISTORY_AND_MODELS,
  VERIFIED_EXTENDED_REFERENCES,
} from '../data/extendedTheoryData';
import {
  ALL_32_SLOAN_COMBINATIONS,
  SLOAN_POLE_MAP,
  STANDARD_SLOAN_AXES,
  parseExtendedSloanNotation,
  type SloanLetter,
} from '../lib/sloanNotation';
import type { NavModuleId } from './BerandaView';

interface TheorySectionProps {
  onNavigate?: (moduleId: NavModuleId) => void;
  readTopics?: string[];
  onMarkTopicRead?: (topicId: string) => void;
}

const TopicReadStrip: React.FC<{
  topics: { id: string; label: string }[];
  readTopics?: string[];
  onMarkTopicRead?: (topicId: string) => void;
}> = ({ topics, readTopics = [], onMarkTopicRead }) => {
  if (!onMarkTopicRead) return null;
  return (
    <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-200/80 text-xs">
      <span className="font-mono text-[11px] text-slate-500 uppercase tracking-wider">Tandai Bacaan Selesai:</span>
      {topics.map((t) => {
        const done = readTopics.includes(t.id);
        return (
          <button
            key={t.id}
            type="button"
            onClick={() => onMarkTopicRead(t.id)}
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border text-[11px] font-medium transition-colors ${
              done
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                : 'bg-white text-slate-700 border-slate-300 hover:bg-indigo-50 hover:border-indigo-300'
            }`}
          >
            <CheckCircle2 className={`w-3 h-3 ${done ? 'text-emerald-600' : 'text-slate-400'}`} />
            <span>{t.label}</span>
          </button>
        );
      })}
    </div>
  );
};

const ReferenceListBlock: React.FC<{ framework: 'MBTI' | 'SLOAN' | 'Temperament' }> = ({
  framework,
}) => {
  const refs = VERIFIED_EXTENDED_REFERENCES.filter((r) => r.framework === framework);
  return (
    <section className="bg-slate-50 border border-slate-200 rounded-2xl p-6 space-y-3">
      <div className="flex items-center gap-2">
        <BookOpen className="w-4 h-4 text-indigo-700" />
        <h3 className="text-base font-display font-bold text-slate-900">
          Daftar Pustaka &amp; Sumber Terverifikasi ({framework})
        </h3>
      </div>
      <div className="space-y-2.5 text-xs">
        {refs.map((ref) => (
          <div key={ref.id} className="p-3 rounded-xl bg-white border border-slate-200 space-y-1">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="font-mono text-[11px] font-semibold text-indigo-800">
                {ref.sourceType}
              </span>
              {ref.url && (
                <a
                  href={ref.url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-indigo-700 hover:underline font-medium"
                >
                  <span>Tautan Sumber</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
            <p className="text-slate-800 leading-relaxed">{ref.apaCitation}</p>
            <p className="text-slate-500">{ref.note}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

// ============================================================================
// 10A. MBTI COMPREHENSIVE THEORY LIBRARY VIEW
// ============================================================================

export const MbtiTheorySection: React.FC<TheorySectionProps> = ({
  onNavigate,
  readTopics = [],
  onMarkTopicRead,
}) => {
  const [selectedCode, setSelectedCode] = useState<string>('INTJ');
  const [typeSearch, setTypeSearch] = useState('');
  const [eFilter, setEFilter] = useState<'ALL' | 'E' | 'I'>('ALL');
  const [subView, setSubView] = useState<'overview' | 'positions-dynamics' | '16-types' | 'models'>('overview');

  const filteredTypes = useMemo(
    () =>
      ALL_16_MBTI_PROFILES.filter((t) => {
        if (eFilter !== 'ALL' && t.dichotomyBreakdown.EorI !== eFilter) return false;
        if (!typeSearch.trim()) return true;
        const q = typeSearch.trim().toLowerCase();
        return (
          t.code.toLowerCase().includes(q) ||
          t.roleTitle.toLowerCase().includes(q) ||
          t.overview.toLowerCase().includes(q) ||
          t.grantStack.join(' ').toLowerCase().includes(q)
        );
      }),
    [eFilter, typeSearch]
  );

  const activeProfile =
    ALL_16_MBTI_PROFILES.find((t) => t.code === selectedCode) || ALL_16_MBTI_PROFILES[0];
  const activeStackDynamic = MBTI_STACK_DYNAMICS_16[activeProfile.code];

  return (
    <div className="space-y-6 dm-view-enter">
      {/* Intro & Subtabs */}
      <section className="dreamy-surface border border-slate-200 rounded-2xl p-6 space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-3xl">
            <div className="text-xs font-medium text-indigo-700">
              Pustaka Teori Lengkap · Jung (1921) · Myers-Briggs (1980) · Model Tumpukan Grant/Beebe
            </div>
            <h2 className="text-2xl font-display font-bold text-slate-900">
              MBTI (Myers-Briggs Type Indicator) &amp; Dinamika Kognitif
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              MBTI memetakan preferensi sadar cara individu memfokuskan perhatian (E/I), menghimpun informasi
              (S/N), mengevaluasi keputusan (T/F), dan menata interaksi dengan lingkungan luar (J/P).
              Pelajari pula 8 posisi fungsi (Ego &amp; Bayangan) dan interaksi tumpukan terpadu untuk seluruh 16 tipe.
            </p>
          </div>

          <div className="flex flex-wrap gap-2 shrink-0">
            {onNavigate && (
              <>
                <button
                  type="button"
                  onClick={() => onNavigate('playground-tipologi')}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-indigo-800 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-lg whitespace-nowrap"
                >
                  <Compass className="w-3.5 h-3.5" />
                  Uji di Playground
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate('arcade-tipologi')}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-white bg-[#151D40] hover:bg-[#233070] rounded-lg whitespace-nowrap"
                >
                  <Gamepad2 className="w-3.5 h-3.5 text-[#DFBE74]" />
                  Latihan di Arcade
                </button>
              </>
            )}
          </div>
        </div>

        <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-200">
          {[
            { id: 'overview', label: 'Sejarah & 4 Dikotomi' },
            { id: 'positions-dynamics', label: '8 Posisi Fungsi & Dinamika Stack (16 Tipe)' },
            { id: '16-types', label: 'Ensiklopedia 16 Tipe MBTI' },
            { id: 'models', label: 'Perbandingan Model (Jung vs Resmi vs Stack)' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setSubView(tab.id as typeof subView)}
              className={`px-4 py-2 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
                subView === tab.id
                  ? 'bg-[#151D40] text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <TopicReadStrip
          topics={[
            { id: 'theory-mbti-history', label: 'Sejarah MBTI' },
            { id: 'theory-mbti-dichotomies', label: '4 Dikotomi' },
            { id: 'theory-mbti-positions', label: '8 Posisi Fungsi' },
            { id: 'theory-mbti-stacks', label: 'Dinamika Stack 16 Tipe' },
          ]}
          readTopics={readTopics}
          onMarkTopicRead={onMarkTopicRead}
        />
      </section>

      {subView === 'positions-dynamics' && (
        <div className="space-y-6">
          {/* 8 Function Positions (Grant 1-4 + Beebe 5-8) */}
          <section className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
            <div className="border-b border-slate-200 pb-3">
              <span className="atlas-kicker">Arsitektur Tumpukan Grant &amp; Beebe</span>
              <h3 className="mt-1 text-lg font-display font-bold text-slate-900">
                Delapan Posisi Fungsi Kognitif (Posisi 1–4 Sadar &amp; Posisi 5–8 Bayangan)
              </h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Menjelaskan peran masing-masing slot dalam sistem kognitif: bagaimana fungsi Dominan bekerja bersama
                Auxiliary, kerentanan Loop di Tersier, reaksi stres Grip di Inferior, hingga dinamika Bayangan (Posisi 5–8).
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              {MBTI_FUNCTION_POSITIONS.map((pos) => (
                <article
                  key={pos.position}
                  className={`p-4 rounded-xl border space-y-2 ${
                    pos.position <= 4
                      ? 'bg-slate-50/80 border-slate-200'
                      : 'bg-indigo-50/35 border-indigo-200/70'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono font-bold text-indigo-800">
                      Posisi {pos.position} · {pos.group}
                    </span>
                  </div>
                  <h4 className="text-sm font-display font-bold text-slate-900">{pos.title}</h4>
                  <div className="text-[11px] font-medium text-indigo-700">{pos.archetypeLabel}</div>
                  <p className="text-slate-700 leading-relaxed">{pos.roleSummary}</p>
                  <div className="space-y-1 pt-1 text-[11px] text-slate-600">
                    <div><strong className="text-emerald-900">Ekspresi Sehat:</strong> {pos.healthyExpression}</div>
                    <div><strong className="text-amber-900">Ketidakseimbangan / Stres:</strong> {pos.imbalanceOrStress}</div>
                    <div><strong className="text-slate-900">Arah Pengembangan:</strong> {pos.developmentDirection}</div>
                    <div className="text-slate-500 pt-1 border-t border-slate-200/80">{pos.modelNuance}</div>
                  </div>
                </article>
              ))}
            </div>
          </section>

          {/* Integrated 16-Type Stack Dynamics Explorer */}
          <section className="bg-white border border-slate-200 rounded-2xl p-6 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-slate-200 pb-3">
              <div>
                <span className="atlas-kicker">Sintesis Tumpukan 16 Tipe</span>
                <h3 className="mt-1 text-lg font-display font-bold text-slate-900">
                  Dinamika Tumpukan Fungsi Terintegrasi (Semua 16 Tipe)
                </h3>
                <p className="text-xs text-slate-600 mt-0.5">
                  Pilih tipe MBTI untuk membedah pasangan Dom–Aux, Dom–Ter Loop, poros Dom–Inf (Grip &amp; Aspirasi),
                  serta contoh belajar nyata.
                </p>
              </div>
              <div className="font-mono text-xs font-semibold text-indigo-800">
                Aktif: {activeStackDynamic?.code} ({activeStackDynamic?.stackLabel})
              </div>
            </div>

            <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
              {ALL_16_MBTI_PROFILES.map((t) => (
                <button
                  key={t.code}
                  type="button"
                  onClick={() => setSelectedCode(t.code)}
                  className={`py-2 px-2 rounded-lg border font-mono text-xs font-bold transition-colors ${
                    selectedCode === t.code
                      ? 'bg-[#151D40] text-white border-[#151D40]'
                      : 'bg-slate-50 text-slate-800 border-slate-200 hover:border-indigo-300'
                  }`}
                >
                  {t.code}
                </button>
              ))}
            </div>

            {activeStackDynamic && (
              <div className="space-y-4 text-xs">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="font-mono font-bold text-base text-indigo-900">
                    {activeStackDynamic.code} · Stack: {activeStackDynamic.stackLabel}
                  </div>
                  <p className="mt-1.5 text-slate-700 leading-relaxed">
                    <strong>Perilaku Sistem Terpadu:</strong> {activeStackDynamic.integratedSystemBehavior}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="p-3.5 rounded-xl bg-white border border-slate-200 space-y-1">
                    <div className="font-semibold text-indigo-900">Pasangan Dominan–Bantu (Dom–Aux)</div>
                    <p className="text-slate-700 leading-relaxed">{activeStackDynamic.domAuxDynamic}</p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-white border border-slate-200 space-y-1">
                    <div className="font-semibold text-amber-900">Risiko Loop (Dom–Ter)</div>
                    <p className="text-slate-700 leading-relaxed">{activeStackDynamic.domTerDynamic}</p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-white border border-slate-200 space-y-1">
                    <div className="font-semibold text-rose-900">Poros Dominan–Inferior (Dom–Inf &amp; Grip)</div>
                    <p className="text-slate-700 leading-relaxed">{activeStackDynamic.domInfDynamic}</p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-white border border-slate-200 space-y-1">
                    <div className="font-semibold text-emerald-900">Keseimbangan Bantu–Tersier (Aux–Ter)</div>
                    <p className="text-slate-700 leading-relaxed">{activeStackDynamic.auxTerDynamic}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="p-3.5 rounded-xl bg-emerald-50/50 border border-emerald-200 space-y-1">
                    <div className="font-semibold text-emerald-950">Arah Pertumbuhan Sehat</div>
                    <p className="text-emerald-900 leading-relaxed">{activeStackDynamic.growthDevelopment}</p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-amber-50/50 border border-amber-200 space-y-1">
                    <div className="font-semibold text-amber-950">Ketegangan Internal</div>
                    <p className="text-amber-900 leading-relaxed">{activeStackDynamic.internalTensions}</p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-rose-50/50 border border-rose-200 space-y-1">
                    <div className="font-semibold text-rose-950">Pola Loop &amp; In the Grip</div>
                    <p className="text-rose-900 leading-relaxed">{activeStackDynamic.stressLoopsAndGrip}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                    <div className="font-semibold text-slate-900">Contoh Situasi Belajar Nyata</div>
                    <ul className="list-disc pl-4 space-y-1 text-slate-700">
                      {activeStackDynamic.realLifeExamples.map((ex, i) => (
                        <li key={i}>{ex}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                    <div className="font-semibold text-slate-900">Kesalahpahaman &amp; Penjelasan Alternatif</div>
                    <p className="text-slate-700 leading-relaxed">{activeStackDynamic.misconceptionsAndAlternatives}</p>
                    <p className="text-[11px] text-slate-500 pt-1">
                      Rujukan: {activeStackDynamic.references.join(' · ')}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </section>
        </div>
      )}

      {subView === 'overview' && (
        <div className="space-y-6">
          {/* History Timeline */}
          <section className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
            <h3 className="text-lg font-display font-bold text-slate-900">
              Sejarah &amp; Evolusi Konseptual MBTI (1921–2016)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {MBTI_HISTORY_TIMELINE.map((item) => (
                <div key={item.era} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                  <div className="text-[11px] font-mono font-semibold text-indigo-700">{item.era}</div>
                  <div className="font-display font-bold text-slate-900">{item.title}</div>
                  <p className="text-xs text-slate-600 leading-relaxed">{item.detail}</p>
                </div>
              ))}
            </div>
          </section>

          {/* 4 Dichotomies Detailed */}
          <section className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
            <h3 className="text-lg font-display font-bold text-slate-900">
              Empat Dikotomi Preferensi Inti (E/I · S/N · T/F · J/P)
            </h3>
            <div className="space-y-4">
              {MBTI_DICHOTOMIES.map((d) => (
                <div key={d.axis} className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-3">
                  <div className="font-display font-bold text-sm text-slate-900">{d.axis}</div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                    <div className="p-3 rounded-lg bg-white border border-slate-200 space-y-1">
                      <div className="font-mono font-bold text-indigo-800">
                        {d.leftCode} — {d.leftTitle}
                      </div>
                      <p className="text-slate-700 leading-relaxed">{d.leftDesc}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-white border border-slate-200 space-y-1">
                      <div className="font-mono font-bold text-indigo-800">
                        {d.rightCode} — {d.rightTitle}
                      </div>
                      <p className="text-slate-700 leading-relaxed">{d.rightDesc}</p>
                    </div>
                  </div>
                  <p className="text-xs text-slate-600 bg-indigo-50/60 border border-indigo-200/70 rounded-lg px-3 py-2">
                    <strong>Klarifikasi Penting:</strong> {d.clarification}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}

      {subView === '16-types' && (
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Selector Sidebar */}
          <div className="lg:col-span-4 bg-white border border-slate-200 rounded-2xl p-4 space-y-3">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={typeSearch}
                onChange={(e) => setTypeSearch(e.target.value)}
                placeholder="Cari 16 tipe (mis. INFP, Ni)..."
                className="w-full pl-8 pr-3 py-2 text-xs border border-slate-300 rounded-lg"
              />
            </div>

            <div className="flex gap-1.5 text-xs">
              {(['ALL', 'E', 'I'] as const).map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setEFilter(f)}
                  className={`flex-1 py-1.5 rounded-lg border font-medium ${
                    eFilter === f
                      ? 'bg-indigo-700 text-white border-indigo-700'
                      : 'bg-slate-50 text-slate-700 border-slate-200'
                  }`}
                >
                  {f === 'ALL' ? 'Semua (16)' : f === 'E' ? 'Ekstrovert (E)' : 'Introvert (I)'}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-2 max-h-[520px] overflow-y-auto pr-1">
              {filteredTypes.map((t) => {
                const active = activeProfile.code === t.code;
                return (
                  <button
                    key={t.code}
                    type="button"
                    onClick={() => setSelectedCode(t.code)}
                    className={`p-2.5 rounded-xl border text-left transition-colors ${
                      active
                        ? 'bg-[#151D40] text-white border-[#151D40]'
                        : 'bg-slate-50 text-slate-800 border-slate-200 hover:border-indigo-300'
                    }`}
                  >
                    <div className="font-mono font-bold text-sm">{t.code}</div>
                    <div
                      className={`text-[11px] truncate ${
                        active ? 'text-indigo-200' : 'text-slate-500'
                      }`}
                    >
                      {t.grantStack.join('·')}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Detail Panel */}
          <div className="lg:col-span-8 bg-white border border-slate-200 rounded-2xl p-6 space-y-5">
            <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-200 pb-4">
              <div>
                <div className="font-mono text-2xl font-bold text-indigo-800">
                  {activeProfile.code}
                </div>
                <h3 className="text-xl font-display font-bold text-slate-900">
                  {activeProfile.roleTitle}
                </h3>
              </div>
              <div className="text-right text-xs">
                <div className="text-slate-500">Tumpukan 4 Fungsi Sadar (Model Grant)</div>
                <div className="font-mono font-bold text-slate-900 mt-0.5">
                  {activeProfile.grantStack.join(' → ')}
                </div>
                <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                  Shadow (Beebe): {activeProfile.shadowStack.join(' · ')}
                </div>
              </div>
            </div>

            <div className="space-y-4 text-xs sm:text-sm">
              <div>
                <h4 className="font-display font-bold text-slate-900 mb-1">Gambaran Umum</h4>
                <p className="text-slate-700 leading-relaxed">{activeProfile.overview}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <div className="font-semibold text-slate-900">Interpretasi Dikotomi Resmi</div>
                  <p className="text-slate-600 leading-relaxed">
                    {activeProfile.dichotomyInterpretation}
                  </p>
                </div>
                <div className="p-3.5 rounded-xl bg-indigo-50/50 border border-indigo-200/80 space-y-1">
                  <div className="font-semibold text-indigo-950">Interpretasi Fungsi Kognitif</div>
                  <p className="text-indigo-900/90 leading-relaxed">
                    {activeProfile.cognitiveStackInterpretation}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 rounded-xl border border-slate-200 space-y-1.5">
                  <div className="font-semibold text-emerald-900">Kecenderungan Kekuatan</div>
                  <ul className="list-disc pl-4 space-y-1 text-slate-700">
                    {activeProfile.tendenciesStrengths.map((s) => (
                      <li key={s}>{s}</li>
                    ))}
                  </ul>
                </div>
                <div className="p-3.5 rounded-xl border border-slate-200 space-y-1.5">
                  <div className="font-semibold text-amber-900">Area Tantangan &amp; Stres</div>
                  <ul className="list-disc pl-4 space-y-1 text-slate-700">
                    {activeProfile.potentialChallenges.map((c) => (
                      <li key={c}>{c}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                <div className="font-semibold text-slate-900">Kesalahpahaman Umum</div>
                {activeProfile.commonMisunderstandings.map((m) => (
                  <p key={m} className="text-slate-600">
                    {m}
                  </p>
                ))}
              </div>

              <div className="p-3.5 rounded-xl bg-emerald-50/50 border border-emerald-200 text-xs space-y-1">
                <div className="font-semibold text-emerald-950">Contoh Konteks Belajar SMA</div>
                <p className="text-emerald-900">{activeProfile.concreteExample}</p>
              </div>
            </div>
          </div>
        </section>
      )}

      {subView === 'models' && (
        <section className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-2">
            <GitCompare className="w-4 h-4 text-indigo-700" />
            <h3 className="text-lg font-display font-bold text-slate-900">
              Membedakan Empat Pendekatan MBTI Tanpa Mencampuradukkan Istilah
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-700">
                  <th className="p-3 font-semibold">Aspek</th>
                  <th className="p-3 font-semibold">Jung Asli (1921)</th>
                  <th className="p-3 font-semibold">MBTI Resmi (Myers-Briggs)</th>
                  <th className="p-3 font-semibold">Stack Grant / Beebe</th>
                  <th className="p-3 font-semibold">Komunitas Daring (Mitos)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {MBTI_MODEL_COMPARISON.map((row) => (
                  <tr key={row.aspect} className="align-top">
                    <td className="p-3 font-semibold text-slate-900">{row.aspect}</td>
                    <td className="p-3 text-slate-700 leading-relaxed">{row.jungOriginal}</td>
                    <td className="p-3 text-slate-700 leading-relaxed">{row.officialMbti}</td>
                    <td className="p-3 text-slate-700 leading-relaxed">{row.grantStack}</td>
                    <td className="p-3 text-slate-600 leading-relaxed">{row.communityOnline}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      <ReferenceListBlock framework="MBTI" />
    </div>
  );
};

// ============================================================================
// 10B. SLOAN / GLOBAL 5 & EXTENDED NOTATION LIBRARY VIEW
// ============================================================================

export const SloanTheorySection: React.FC<TheorySectionProps> = ({
  onNavigate,
  readTopics = [],
  onMarkTopicRead,
}) => {
  const [subView, setSubView] = useState<'dimensions' | '32-types' | 'extended' | 'compare'>('dimensions');
  const [selectedPole, setSelectedPole] = useState<SloanLetter>('S');
  const [comboSearch, setComboSearch] = useState('');
  const [extTestInput, setExtTestInput] = useState('[S]lo/E/I');

  const filtered32 = useMemo(() => {
    const q = comboSearch.trim().toLowerCase();
    if (!q) return ALL_32_SLOAN_COMBINATIONS;
    return ALL_32_SLOAN_COMBINATIONS.filter(
      (c) =>
        c.code.toLowerCase().includes(q) ||
        c.headline.toLowerCase().includes(q) ||
        c.summary.toLowerCase().includes(q)
    );
  }, [comboSearch]);

  const parsedExt = useMemo(() => parseExtendedSloanNotation(extTestInput), [extTestInput]);

  return (
    <div className="space-y-6 dm-view-enter">
      <section className="dreamy-surface border border-slate-200 rounded-2xl p-6 space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-3xl">
            <div className="text-xs font-medium text-indigo-700">
              Big Five (OCEAN · Goldberg &amp; Costa/McCrae) · Global 5 / SLOAN (32 Tipe &amp; Notasi Lanjutan)
            </div>
            <h2 className="text-2xl font-display font-bold text-slate-900">
              SLOAN &amp; Big Five: Dari Kontinum Empiris ke Kode 5 Huruf
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              DYNAMAP membedakan <strong>Big Five / Five-Factor Model (FFM)</strong> yang berbasis skala
              kontinum psikometrik ilmiah dari adaptasi <strong>Global 5 / SLOAN</strong> (SimilarMinds) yang
              meringkas skor menjadi 32 kode huruf serta notasi lanjutan komunitas <code className="font-mono">[S]lo/E/I</code>.
            </p>
          </div>

          {onNavigate && (
            <div className="flex flex-wrap gap-2 shrink-0">
              <button
                type="button"
                onClick={() => onNavigate('playground-tipologi')}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-indigo-800 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-lg whitespace-nowrap"
              >
                <Compass className="w-3.5 h-3.5" />
                Builder SLOAN Lanjutan
              </button>
              <button
                type="button"
                onClick={() => onNavigate('arcade-tipologi')}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-white bg-[#151D40] hover:bg-[#233070] rounded-lg whitespace-nowrap"
              >
                <Gamepad2 className="w-3.5 h-3.5 text-[#DFBE74]" />
                Kuis &amp; Sandi SLOAN
              </button>
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-200">
          {[
            { id: 'dimensions', label: 'Sejarah & 5 Dimensi (S/R·L/C·O/U·A/E·I/N)' },
            { id: '32-types', label: 'Basis Data 32 Kombinasi SLOAN' },
            { id: 'extended', label: 'Notasi Lanjutan ([S]lo/E/I)' },
            { id: 'compare', label: 'Komparasi OCEAN, MBTI & Miskonsepsi' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setSubView(tab.id as typeof subView)}
              className={`px-4 py-2 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
                subView === tab.id
                  ? 'bg-[#151D40] text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <TopicReadStrip
          topics={[
            { id: 'theory-sloan-bigfive', label: '5 Dimensi Big Five' },
            { id: 'theory-sloan-32types', label: '32 Kombinasi SLOAN' },
            { id: 'theory-sloan-extended', label: 'Notasi Lanjutan' },
          ]}
          readTopics={readTopics}
          onMarkTopicRead={onMarkTopicRead}
        />
      </section>

      {subView === 'dimensions' && (
        <div className="space-y-6">
          <section className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
            <h3 className="text-lg font-display font-bold text-slate-900">
              Sejarah Big Five hingga Global 5 / SLOAN
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {SLOAN_THEORY_OVERVIEW.historyTimeline.map((item) => (
                <div key={item.era} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                  <div className="text-[11px] font-mono font-semibold text-indigo-700">{item.era}</div>
                  <div className="font-display font-bold text-slate-900">{item.title}</div>
                  <p className="text-xs text-slate-600 leading-relaxed">{item.detail}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="text-lg font-display font-bold text-slate-900">
                Eksplorasi 5 Sumbu &amp; 10 Kutub SLOAN
              </h3>
              <span className="text-xs text-slate-500">
                Konvensi sumbu ke-5 di DYNAMAP: I = Inquisitive vs N = Non-Curious / Pragmatic
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {STANDARD_SLOAN_AXES.map((ax) => (
                <div key={ax.axis} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                  <div className="text-[11px] font-semibold text-slate-700 truncate">{ax.title}</div>
                  <div className="grid grid-cols-2 gap-1.5">
                    {[ax.high, ax.low].map((ltr) => (
                      <button
                        key={ltr}
                        type="button"
                        onClick={() => setSelectedPole(ltr)}
                        className={`py-1.5 rounded-lg font-mono text-xs font-bold border transition-colors ${
                          selectedPole === ltr
                            ? 'bg-indigo-700 text-white border-indigo-700'
                            : 'bg-white text-slate-800 border-slate-300 hover:border-indigo-400'
                        }`}
                      >
                        {ltr}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {(() => {
              const p = SLOAN_POLE_MAP[selectedPole];
              return (
                <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-3 text-xs">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="font-display font-bold text-base text-slate-900">
                      Kutub {p.letter} — {p.name}
                    </div>
                    <span className="font-mono text-indigo-800 font-semibold">
                      {p.bigFiveFactor} · Lawan Kutub: {p.opposite}
                    </span>
                  </div>
                  <p className="text-slate-700 leading-relaxed">{p.tendencySummary}</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="p-3 rounded-lg bg-white border border-slate-200">
                      <div className="font-semibold text-slate-900 mb-1">Gaya Belajar &amp; Tugas</div>
                      <p className="text-slate-600 leading-relaxed">{p.studyOrWorkStyle}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-white border border-slate-200">
                      <div className="font-semibold text-slate-900 mb-1">Gaya Interpersonal</div>
                      <p className="text-slate-600 leading-relaxed">{p.interpersonalStyle}</p>
                    </div>
                  </div>
                  <div className="p-3 rounded-lg bg-amber-50/70 border border-amber-200 text-amber-950">
                    <strong>Miskonsepsi Umum:</strong> {p.misconception}
                  </div>
                </div>
              );
            })()}
          </section>
        </div>
      )}

      {subView === '32-types' && (
        <section className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-lg font-display font-bold text-slate-900">
                Basis Data 32 Kombinasi Kode SLOAN Standar
              </h3>
              <p className="text-xs text-slate-500">
                Cari kode (mis. RCOAI, SCOAI, SLUEN) atau kata kunci sifat perilaku.
              </p>
            </div>
            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={comboSearch}
                onChange={(e) => setComboSearch(e.target.value)}
                placeholder="Cari kode dari 32 tipe..."
                className="w-full pl-8 pr-3 py-2 text-xs border border-slate-300 rounded-lg"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[600px] overflow-y-auto pr-1">
            {filtered32.map((item) => (
              <div
                key={item.code}
                className="p-4 rounded-xl border border-slate-200 bg-slate-50/80 space-y-2 text-xs"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-base font-bold text-indigo-800">{item.code}</span>
                  <span className="text-[11px] text-slate-500 font-medium">{item.headline}</span>
                </div>
                <p className="text-slate-700 leading-relaxed">{item.summary}</p>
                <div className="text-slate-600">
                  <strong>Belajar:</strong> {item.learningHighlight}
                </div>
                <div className="text-slate-600">
                  <strong>Dinamika Tim:</strong> {item.teamDynamic}
                </div>
                <div className="text-amber-900 bg-amber-50/70 rounded-lg px-2.5 py-1.5 border border-amber-200/70">
                  <strong>Catatan Keseimbangan:</strong> {item.frictionPoint}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {subView === 'extended' && (
        <section className="bg-white border border-slate-200 rounded-2xl p-6 space-y-5">
          <div className="space-y-1.5">
            <h3 className="text-lg font-display font-bold text-slate-900">
              Notasi Lanjutan / Komunitas SLOAN (mis. <code className="font-mono">[S]lo/E/I</code>)
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed max-w-3xl">
              Di forum tipologi daring, pengguna sering menulis notasi lanjutan untuk mengekspresikan kekuatan
              relatif tiap dimensi (bukan sekadar biner rata). DYNAMAP memisahkan konvensi ini secara tegas
              dari skor persentil Big Five akademik agar siswa memahami artinya tanpa menyalahartikan sebagai
              standar psikometrik klinis.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
            {[
              {
                syntax: '[X] Kurung Siku',
                meaning: 'Dimensi paling dominan atau jangkar karakter utama yang paling konsisten tampak.',
              },
              {
                syntax: 'X Huruf Kapital',
                meaning: 'Kecenderungan primer/jelas di atas rata-rata pada dimensi tersebut.',
              },
              {
                syntax: 'x Huruf Kecil',
                meaning: 'Kecenderungan sedang/moderat—dekat tengah spektrum atau situasional.',
              },
              {
                syntax: '/X Setelah Garis Miring',
                meaning: 'Dimensi berurutan lebih lemah atau faktor latar belakang dibanding ciri depan.',
              },
            ].map((rule) => (
              <div key={rule.syntax} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <div className="font-mono font-bold text-indigo-800">{rule.syntax}</div>
                <p className="text-slate-600 leading-relaxed">{rule.meaning}</p>
              </div>
            ))}
          </div>

          {/* Interactive Decoder Tester */}
          <div className="p-5 rounded-xl bg-indigo-50/40 border border-indigo-200/80 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <label htmlFor="sloan-ext-tester" className="text-xs font-semibold text-slate-900">
                Uji Dekode Notasi Lanjutan Secara Langsung
              </label>
              <div className="flex flex-wrap gap-1.5 text-[11px]">
                {['[S]lo/E/I', '[R]cO/A/I', 'S[c]U/a/i', 'RLOAI'].map((sample) => (
                  <button
                    key={sample}
                    type="button"
                    onClick={() => setExtTestInput(sample)}
                    className="px-2 py-1 rounded border border-indigo-200 bg-white font-mono text-indigo-800 hover:bg-indigo-50"
                  >
                    {sample}
                  </button>
                ))}
              </div>
            </div>

            <input
              id="sloan-ext-tester"
              type="text"
              value={extTestInput}
              onChange={(e) => setExtTestInput(e.target.value)}
              placeholder="Ketik kode mis. [S]lo/E/I atau [R]cO/a/i..."
              className="w-full px-3.5 py-2.5 text-sm font-mono border border-slate-300 rounded-lg bg-white"
            />

            {!parsedExt.isValid ? (
              <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-900">
                {parsedExt.error}
              </div>
            ) : (
              <div className="space-y-3 text-xs">
                <div className="flex flex-wrap items-center gap-3">
                  <span>
                    Mode Pembacaan:{' '}
                    <strong>
                      {parsedExt.isExtendedSyntax
                        ? 'Notasi Lanjutan Komunitas'
                        : 'SLOAN Standar 5-Huruf'}
                    </strong>
                  </span>
                  {parsedExt.canonicalFiveLetter && (
                    <span className="font-mono font-bold text-indigo-800">
                      Kode 5-Huruf Setara: {parsedExt.canonicalFiveLetter}
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2">
                  {parsedExt.rankedTraits.map((rt, idx) => (
                    <div
                      key={`${rt.letter}-${idx}`}
                      className="p-2.5 rounded-lg bg-white border border-slate-200 space-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-bold text-sm text-indigo-900">
                          #{idx + 1} · {rt.rawToken}
                        </span>
                        <span className="text-[10px] text-slate-500">{rt.letter}</span>
                      </div>
                      <div className="font-medium text-slate-800">{rt.detail.name}</div>
                      <div className="text-[11px] text-indigo-700">{rt.tier}</div>
                    </div>
                  ))}
                </div>

                <p className="text-[11px] text-slate-600">{parsedExt.academicBoundaryNote}</p>
              </div>
            )}
          </div>
        </section>
      )}

      {subView === 'compare' && (
        <div className="space-y-5">
          <section className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
            <h3 className="text-lg font-display font-bold text-slate-900">
              Perbandingan SLOAN vs Big Five Akademik, MBTI, Socionics &amp; Enneagram
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-slate-700">
                    <th className="p-3 font-semibold">Kerangka</th>
                    <th className="p-3 font-semibold">Skala Pengukuran</th>
                    <th className="p-3 font-semibold">Perbedaan Utama</th>
                    <th className="p-3 font-semibold">Posisi Ilmiah / Metodologis</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {SLOAN_THEORY_OVERVIEW.comparisons.map((row) => (
                    <tr key={row.framework} className="align-top">
                      <td className="p-3 font-semibold text-slate-900">{row.framework}</td>
                      <td className="p-3 text-slate-700">{row.scaleType}</td>
                      <td className="p-3 text-slate-700 leading-relaxed">{row.keyDifference}</td>
                      <td className="p-3 text-slate-600 leading-relaxed">{row.scientificStanding}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="bg-white border border-slate-200 rounded-2xl p-6 space-y-3">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-700" />
              <h3 className="text-base font-display font-bold text-slate-900">
                Miskonsepsi yang Sering Terjadi
              </h3>
            </div>
            <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-700">
              {SLOAN_THEORY_OVERVIEW.misconceptions.map((m) => (
                <li key={m}>{m}</li>
              ))}
            </ul>
          </section>
        </div>
      )}

      <ReferenceListBlock framework="SLOAN" />
    </div>
  );
};

// ============================================================================
// 10C. TEMPERAMENT COMPLETE THEORY LIBRARY VIEW
// ============================================================================

export const TemperamentTheorySection: React.FC<TheorySectionProps> = ({
  onNavigate,
  readTopics = [],
  onMarkTopicRead,
}) => {
  const [subView, setSubView] = useState<'classical' | 'mixed' | 'models'>('classical');
  const [selectedBlendId, setSelectedBlendId] = useState<string>(MIXED_12_TEMPERAMENTS[0].id);

  const activeBlend =
    MIXED_12_TEMPERAMENTS.find((b) => b.id === selectedBlendId) || MIXED_12_TEMPERAMENTS[0];
  const reversedBlend = MIXED_12_TEMPERAMENTS.find(
    (b) => b.pairKey === activeBlend.pairKey && b.id !== activeBlend.id
  );

  return (
    <div className="space-y-6 dm-view-enter">
      <section className="dreamy-surface border border-slate-200 rounded-2xl p-6 space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-3xl">
            <div className="text-xs font-medium text-indigo-700">
              Sejarah Klasik Galen · Riset Modern Chess &amp; Thomas / Kagan · Eysenck · Keirsey
            </div>
            <h2 className="text-2xl font-display font-bold text-slate-900">
              Teori Temperamen: Dari Akar Historis ke Psikologi Modern
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              Memahami 4 Temperamen klasik (Sanguinis, Koleris, Melankolis, Plegmatis), seluruh{' '}
              <strong>12 kombinasi campuran terarah primer–sekunder</strong>, serta batas ilmiahnya terhadap
              psikologi perkembangan modern dan 4 Temperamen Keirsey.
            </p>
          </div>

          {onNavigate && (
            <div className="flex flex-wrap gap-2 shrink-0">
              <button
                type="button"
                onClick={() => onNavigate('playground-tipologi')}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-indigo-800 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-lg whitespace-nowrap"
              >
                <Layers className="w-3.5 h-3.5" />
                Lab Temperamen
              </button>
              <button
                type="button"
                onClick={() => onNavigate('arcade-tipologi')}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-white bg-[#151D40] hover:bg-[#233070] rounded-lg whitespace-nowrap"
              >
                <Gamepad2 className="w-3.5 h-3.5 text-[#DFBE74]" />
                Tantangan Temperamen
              </button>
            </div>
          )}
        </div>

        <div className="p-3.5 rounded-xl bg-amber-50/80 border border-amber-200 text-xs text-amber-950 leading-relaxed">
          {TEMPERAMENT_HISTORY_AND_MODELS.medicalDisclaimer}
        </div>

        <div className="flex flex-wrap gap-2 pt-1">
          {[
            { id: 'classical', label: 'Sejarah & 4 Temperamen Klasik' },
            { id: 'mixed', label: '12 Kombinasi Campuran Primer–Sekunder' },
            { id: 'models', label: 'Klasik vs Riset Modern vs Keirsey' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setSubView(tab.id as typeof subView)}
              className={`px-4 py-2 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
                subView === tab.id
                  ? 'bg-[#151D40] text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <TopicReadStrip
          topics={[
            { id: 'theory-temp-classical4', label: '4 Temperamen Klasik' },
            { id: 'theory-temp-12blends', label: '12 Kombinasi Terarah' },
            { id: 'theory-temp-modern-models', label: 'Riset Modern & Keirsey' },
          ]}
          readTopics={readTopics}
          onMarkTopicRead={onMarkTopicRead}
        />
      </section>

      {subView === 'classical' && (
        <div className="space-y-6">
          <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {CLASSICAL_4_TEMPERAMENTS.map((tp) => (
              <div
                key={tp.id}
                className="bg-white border border-slate-200 rounded-2xl p-5 space-y-3 text-xs"
              >
                <div className="flex items-start justify-between gap-2 border-b border-slate-200 pb-3">
                  <div>
                    <h3 className="text-lg font-display font-bold text-slate-900">
                      {tp.indoName} ({tp.name})
                    </h3>
                    <div className="text-[11px] text-indigo-700 font-medium">
                      {tp.historicalElement}
                    </div>
                  </div>
                </div>
                <p className="text-slate-600">{tp.eysenckMapping}</p>

                <div>
                  <div className="font-semibold text-slate-900 mb-1">Ciri Inti</div>
                  <ul className="list-disc pl-4 space-y-0.5 text-slate-700">
                    {tp.coreTraits.map((c) => (
                      <li key={c}>{c}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <div className="font-semibold text-slate-900 mb-1">Gaya Belajar &amp; Komunikasi</div>
                  <p className="text-slate-700 leading-relaxed">{tp.learningCommunicationStyle}</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div className="p-2.5 rounded-lg bg-emerald-50/50 border border-emerald-200/70">
                    <div className="font-semibold text-emerald-950 mb-1">Kekuatan di Tim</div>
                    <ul className="list-disc pl-4 space-y-0.5 text-emerald-900">
                      {tp.teamStrengths.map((st) => (
                        <li key={st}>{st}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="p-2.5 rounded-lg bg-amber-50/50 border border-amber-200/70">
                    <div className="font-semibold text-amber-950 mb-1">Area Tantangan</div>
                    <ul className="list-disc pl-4 space-y-0.5 text-amber-900">
                      {tp.challengesUnderStress.map((ch) => (
                        <li key={ch}>{ch}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-700">
                  <strong>Contoh Nyata &amp; Dukungan:</strong> {tp.exampleScenario} — {tp.helpfulSupport}
                </div>
              </div>
            ))}
          </section>

          {/* Historical Timeline */}
          <section className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
            <h3 className="text-base font-display font-bold text-slate-900">
              Garis Sejarah Evolusi Konsep Temperamen
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {TEMPERAMENT_HISTORY_AND_MODELS.historyTimeline.map((h) => (
                <div key={h.era} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <div className="text-[11px] font-mono font-semibold text-indigo-700">{h.era}</div>
                  <div className="font-display font-bold text-sm text-slate-900">{h.title}</div>
                  <p className="text-xs text-slate-600 leading-relaxed">{h.detail}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}

      {subView === 'mixed' && (
        <section className="bg-white border border-slate-200 rounded-2xl p-6 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
            <div className="space-y-1">
              <span className="atlas-kicker">Permutasi Terarah Primer–Sekunder</span>
              <h3 className="text-lg font-display font-bold text-slate-900">
                12 Kombinasi Temperamen Campuran (Primer–Sekunder)
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed max-w-2xl">
                Urutan sangat memengaruhi dinamika: misalnya <strong>Sanguinis–Melankolis</strong> berbeda dari{' '}
                <strong>Melankolis–Sanguinis</strong> karena sifat Primer menentukan titik berangkat awal, sementara
                sifat Sekunder berperan sebagai pelengkap dan penyeimbang.
              </p>
            </div>
            {reversedBlend && (
              <button
                type="button"
                onClick={() => setSelectedBlendId(reversedBlend.id)}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-indigo-800 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-lg whitespace-nowrap shrink-0"
              >
                <GitCompare className="w-3.5 h-3.5" />
                Bandingkan Urutan Terbalik ({reversedBlend.indoTitle.split(' (')[0]})
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5">
            {MIXED_12_TEMPERAMENTS.map((blend) => (
              <button
                key={blend.id}
                type="button"
                onClick={() => setSelectedBlendId(blend.id)}
                className={`p-3 rounded-xl border text-left text-xs transition-colors ${
                  activeBlend.id === blend.id
                    ? 'bg-[#151D40] text-white border-[#151D40]'
                    : 'bg-slate-50 text-slate-800 border-slate-200 hover:border-indigo-300'
                }`}
              >
                <div className="font-display font-bold">{blend.indoTitle.split(' (')[0]}</div>
                <div
                  className={`text-[11px] mt-0.5 truncate ${
                    activeBlend.id === blend.id ? 'text-indigo-200' : 'text-slate-500'
                  }`}
                >
                  {blend.indoTitle.split('(')[1]?.replace(')', '')}
                </div>
              </button>
            ))}
          </div>

          <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-4 text-xs">
            <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-slate-200 pb-3">
              <div>
                <div className="font-mono text-[11px] text-indigo-700">
                  Primer: {activeBlend.primary} · Sekunder: {activeBlend.secondary}
                </div>
                <h4 className="text-lg font-display font-bold text-slate-900">{activeBlend.indoTitle}</h4>
              </div>
              <span className="font-mono text-[11px] text-slate-500">{activeBlend.title}</span>
            </div>

            <p className="text-slate-700 leading-relaxed">{activeBlend.generalCharacteristics}</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="p-3.5 rounded-lg bg-white border border-slate-200 space-y-1">
                <div className="font-semibold text-indigo-900">Peran Primer vs Sekunder</div>
                <p className="text-slate-600 leading-relaxed">{activeBlend.dominantVsSecondary}</p>
              </div>
              <div className="p-3.5 rounded-lg bg-white border border-slate-200 space-y-1">
                <div className="font-semibold text-indigo-900">Dinamika Interaksi Internal</div>
                <p className="text-slate-600 leading-relaxed">{activeBlend.interactionDynamics}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="p-3 rounded-lg bg-white border border-slate-200">
                <div className="font-semibold text-slate-900 mb-1">Tegangan Batin</div>
                <p className="text-slate-600 leading-relaxed">{activeBlend.internalTension}</p>
              </div>
              <div className="p-3 rounded-lg bg-white border border-slate-200">
                <div className="font-semibold text-emerald-900 mb-1">Potensi Akademik</div>
                <p className="text-slate-600 leading-relaxed">{activeBlend.academicStrength}</p>
              </div>
              <div className="p-3 rounded-lg bg-white border border-slate-200">
                <div className="font-semibold text-amber-900 mb-1">Hal yang Perlu Dijaga</div>
                <p className="text-slate-600 leading-relaxed">{activeBlend.watchOut}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="p-3.5 rounded-lg bg-emerald-50/50 border border-emerald-200/70 space-y-1">
                <div className="font-semibold text-emerald-950">Kekuatan Utama</div>
                <ul className="list-disc pl-4 space-y-1 text-emerald-900">
                  {activeBlend.strengths.map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ul>
              </div>
              <div className="p-3.5 rounded-lg bg-amber-50/50 border border-amber-200/70 space-y-1">
                <div className="font-semibold text-amber-950">Tantangan &amp; Risiko</div>
                <ul className="list-disc pl-4 space-y-1 text-amber-900">
                  {activeBlend.challenges.map((c) => (
                    <li key={c}>{c}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="p-3.5 rounded-lg bg-white border border-slate-200 space-y-1">
                <div className="font-semibold text-slate-900">Pola Komunikasi &amp; Contoh Perilaku</div>
                <p className="text-slate-700 leading-relaxed mb-1.5">{activeBlend.communicationPatterns}</p>
                <ul className="list-disc pl-4 space-y-1 text-slate-600">
                  {activeBlend.behavioralExamples.map((ex, idx) => (
                    <li key={idx}>{ex}</li>
                  ))}
                </ul>
              </div>
              <div className="p-3.5 rounded-lg bg-indigo-50/50 border border-indigo-200/80 space-y-1.5">
                <div className="font-semibold text-indigo-950">Perbandingan dengan Urutan Terbalik</div>
                <p className="text-indigo-950/90 leading-relaxed">{activeBlend.contrastWithReversed}</p>
                <div className="pt-1 border-t border-indigo-200/70 text-[11px] text-slate-600">
                  <strong>Miskonsepsi:</strong> {activeBlend.misconceptions.join(' ')}
                </div>
                <div className="text-[11px] text-slate-500">
                  Rujukan: {activeBlend.references.join(' · ')}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {subView === 'models' && (
        <section className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
          <h3 className="text-lg font-display font-bold text-slate-900">
            Perbedaan Model Klasik, Psikobiologi Modern, Eysenck &amp; Temperamen Keirsey
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-700">
                  <th className="p-3 font-semibold">Dimensi Pembanding</th>
                  <th className="p-3 font-semibold">4 Temperamen Klasik</th>
                  <th className="p-3 font-semibold">Psikobiologi (Chess &amp; Thomas / Kagan)</th>
                  <th className="p-3 font-semibold">Model Biologis Eysenck</th>
                  <th className="p-3 font-semibold">Keirsey (SP/SJ/NF/NT)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {TEMPERAMENT_HISTORY_AND_MODELS.modelComparisons.map((row) => (
                  <tr key={row.dimension} className="align-top">
                    <td className="p-3 font-semibold text-slate-900">{row.dimension}</td>
                    <td className="p-3 text-slate-700 leading-relaxed">{row.classical}</td>
                    <td className="p-3 text-slate-700 leading-relaxed">{row.psychobiological}</td>
                    <td className="p-3 text-slate-700 leading-relaxed">{row.eysenck}</td>
                    <td className="p-3 text-slate-700 leading-relaxed">{row.keirsey}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      <ReferenceListBlock framework="Temperament" />
    </div>
  );
};
