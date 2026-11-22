import React, { useEffect, useState } from 'react';
import {
  INFORMATION_ELEMENTS,
  JUNGIAN_NOTATIONS,
  MODEL_A_BLOCKS,
  MODEL_A_POSITIONS,
  QUADRAS,
  SOCIONICS_TYPES,
  getTypeModelADetails,
  parseJungianNotation,
} from '../data/socionicsData';
import {
  ENNEAGRAM_CENTERS,
  ENNEAGRAM_TRIADS,
  ENNEAGRAM_TYPES,
  INSTINCT_STACKINGS,
  INSTINCT_VARIANTS,
  TRITYPE_TERMINOLOGY_GUIDE,
} from '../data/enneagramData';
import { validateAndBuildTritype } from '../lib/typology';
import type {
  Account,
  EnneagramCore,
  GutFix,
  HeadFix,
  HeartFix,
  InformationElement,
  InstinctCode,
  InstinctualStacking,
  Profile,
  ReferenceCitation,
  SocionicsCode,
  TritypeConvention,
} from '../types/dynamap';
import { getQuadraTheme } from './QuadraUI';
import {
  MbtiTheorySection,
  SloanTheorySection,
  TemperamentTheorySection,
} from './TheoryLibrarySections';
import type { NavModuleId } from './BerandaView';

export type TheoryLibraryTab =
  | 'socionics'
  | 'enneagram'
  | 'jungian'
  | 'mbti'
  | 'sloan'
  | 'temperament';

interface AnalisisKepribadianViewProps {
  profiles: Profile[];
  references: ReferenceCitation[];
  account: Account | null;
  initialTab?: TheoryLibraryTab;
  readTopics?: string[];
  onMarkTopicRead?: (topicId: string) => void;
  onNavigate?: (moduleId: NavModuleId) => void;
  onSaveProfileTritype?: (payload: {
    enneagramCore: EnneagramCore;
    tritypeHeart: HeartFix;
    tritypeHead: HeadFix;
    tritypeGut: GutFix;
    threeFix: string;
    trifix: string;
    tritype: string;
    tritypeConvention: TritypeConvention;
  }) => Promise<void>;
  onSaveProfileStacking?: (stacking: InstinctualStacking, wing?: string) => Promise<void>;
}

const ALL_SOCIONICS_CODES = Object.keys(SOCIONICS_TYPES) as SocionicsCode[];
const ALL_IE_CODES = Object.keys(INFORMATION_ELEMENTS) as InformationElement[];
const ALL_ENN_CORES: EnneagramCore[] = [1, 2, 3, 4, 5, 6, 7, 8, 9];
const ALL_STACKINGS: InstinctualStacking[] = ['SP/SO', 'SP/SX', 'SO/SP', 'SO/SX', 'SX/SP', 'SX/SO'];

export const AnalisisKepribadianView: React.FC<AnalisisKepribadianViewProps> = ({
  profiles,
  references,
  account,
  initialTab,
  readTopics = [],
  onMarkTopicRead,
  onNavigate,
  onSaveProfileTritype,
  onSaveProfileStacking,
}) => {
  const [activeTab, setActiveTab] = useState<TheoryLibraryTab>(initialTab || 'socionics');
  const [selectedProfileId, setSelectedProfileId] = useState<string>('');

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  // Socionics explorer state
  const [selectedSocionics, setSelectedSocionics] = useState<SocionicsCode>('LIE');
  const [selectedIE, setSelectedIE] = useState<InformationElement>('Te');
  const [socionicsSection, setSocionicsSection] = useState<'type' | 'elements' | 'model-a'>('type');

  // Enneagram explorer state
  const [enneagramTab, setEnneagramTab] = useState<
    'types' | 'instincts' | 'triads' | 'tritype'
  >('types');
  const [selectedEnn, setSelectedEnn] = useState<EnneagramCore>(2);
  const [selectedInstinct, setSelectedInstinct] = useState<InstinctCode>('SP');
  const [selectedStacking, setSelectedStacking] = useState<InstinctualStacking>('SP/SX');
  const [selectedWingInput, setSelectedWingInput] = useState<string>('2w1');

  // Interactive Tritype configurator state
  const [tritypeCore, setTritypeCore] = useState<EnneagramCore>(2);
  const [heartFix, setHeartFix] = useState<HeartFix>(2);
  const [headFix, setHeadFix] = useState<HeadFix>(5);
  const [gutFix, setGutFix] = useState<GutFix>(8);
  const [secondaryPriority, setSecondaryPriority] = useState<'heart' | 'head' | 'gut' | null>('head');
  const [tritypeConvention, setTritypeConvention] = useState<TritypeConvention>('core-first');
  const [saveMessage, setSaveMessage] = useState<string>('');

  // Jungian explorer state
  const [customJungian, setCustomJungian] = useState<string>('ET(N)');

  function handleLoadFromProfile(profileId: string) {
    setSelectedProfileId(profileId);
    const found = profiles.find((p) => p.id === profileId);
    if (!found) return;
    if (found.typology.socionics) setSelectedSocionics(found.typology.socionics);
    if (found.typology.enneagramCore) {
      setSelectedEnn(found.typology.enneagramCore);
      setTritypeCore(found.typology.enneagramCore);
      if ([2, 3, 4].includes(found.typology.enneagramCore)) setHeartFix(found.typology.enneagramCore as HeartFix);
      if ([5, 6, 7].includes(found.typology.enneagramCore)) setHeadFix(found.typology.enneagramCore as HeadFix);
      if ([8, 9, 1].includes(found.typology.enneagramCore)) setGutFix(found.typology.enneagramCore as GutFix);
    }
    if (found.typology.tritypeHeart) setHeartFix(found.typology.tritypeHeart);
    if (found.typology.tritypeHead) setHeadFix(found.typology.tritypeHead);
    if (found.typology.tritypeGut) setGutFix(found.typology.tritypeGut);
    if (found.typology.instinctStacking) setSelectedStacking(found.typology.instinctStacking);
    if (found.typology.jungian) setCustomJungian(found.typology.jungian);
  }

  function handleCoreChange(newCore: EnneagramCore) {
    setTritypeCore(newCore);
    if ([2, 3, 4].includes(newCore)) setHeartFix(newCore as HeartFix);
    if ([5, 6, 7].includes(newCore)) setHeadFix(newCore as HeadFix);
    if ([8, 9, 1].includes(newCore)) setGutFix(newCore as GutFix);
    setSecondaryPriority(null);
  }

  const tritypeResult = validateAndBuildTritype({
    core: tritypeCore,
    heartFix,
    headFix,
    gutFix,
    secondaryPriority,
    convention: tritypeConvention,
  });

  const socSpec = SOCIONICS_TYPES[selectedSocionics];
  const socQuadraTheme = getQuadraTheme(socSpec.quadra);
  const modelADetails = getTypeModelADetails(selectedSocionics);
  const ennSpec = ENNEAGRAM_TYPES[selectedEnn];
  const jungParsed = parseJungianNotation(customJungian);
  const jungKnown = JUNGIAN_NOTATIONS[customJungian.trim().toUpperCase()];

  async function handleSaveTritypeToProfile() {
    if (!onSaveProfileTritype || !tritypeResult.valid || !tritypeResult.core) return;
    setSaveMessage('');
    await onSaveProfileTritype({
      enneagramCore: tritypeResult.core,
      tritypeHeart: heartFix,
      tritypeHead: headFix,
      tritypeGut: gutFix,
      threeFix: tritypeResult.threeFix,
      trifix: tritypeResult.trifixDisplay,
      tritype: tritypeResult.orderedFixes ? tritypeResult.orderedFixes.join('') : tritypeResult.tritypeDisplay,
      tritypeConvention,
    });
    setSaveMessage('Konfigurasi Three Fix / Tritype berhasil disimpan ke profil Anda.');
  }

  return (
    <div className="space-y-8">
      {/* Header & Profile Loader */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-display font-bold text-slate-900">
              Analisis &amp; Eksplorasi Kerangka Kepribadian
            </h1>
            <p className="text-sm text-slate-600 mt-1 max-w-2xl">
              Pelajari Socionics (Model A), Enneagram (Tipe, Sayap, Insting, Triad, Tritype), Tipologi Jung,
              MBTI (16 Tipe &amp; Model Kognitif), Big Five / SLOAN (32 Tipe &amp; Notasi Lanjutan), dan Temperamen Klasik vs Empiris.
            </p>
          </div>

          <div className="w-full lg:w-80 shrink-0">
            <label htmlFor="explorer-profile-select" className="block text-xs font-medium text-slate-700 mb-1">
              Muat Data dari Profil (Opsional)
            </label>
            <select
              id="explorer-profile-select"
              value={selectedProfileId}
              onChange={(e) => handleLoadFromProfile(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">-- Eksplorasi Bebas / Pilih Profil --</option>
              {profiles.filter((p) => !p.archived).map((p) => (
                <option key={p.id} value={p.id}>
                  {p.displayName} ({p.typology.socionics || 'Belum ada Socionics'} ·{' '}
                  {p.typology.enneagramRaw || 'Belum ada Enneagram'})
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100">
          <div className="flex flex-wrap items-center gap-1 p-1 bg-slate-100 rounded-lg">
            {[
              { id: 'socionics' as const, label: 'Socionics & Model A' },
              { id: 'enneagram' as const, label: 'Enneagram & Tritype' },
              { id: 'jungian' as const, label: 'Tipologi Jung' },
              { id: 'mbti' as const, label: 'MBTI (16 Tipe)' },
              { id: 'sloan' as const, label: 'SLOAN / Big Five (32 Tipe)' },
              { id: 'temperament' as const, label: 'Temperamen Klasik & Modern' },
            ].map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setActiveTab(t.id)}
                className={`px-3 py-2 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                  activeTab === t.id
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
          {onNavigate && (
            <div className="flex items-center gap-2 text-xs">
              <button
                type="button"
                onClick={() => onNavigate('playground-tipologi')}
                className="px-3 py-1.5 font-medium text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-lg whitespace-nowrap"
              >
                Buka Playground Lab
              </button>
              <button
                type="button"
                onClick={() => onNavigate('arcade-tipologi')}
                className="px-3 py-1.5 font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg whitespace-nowrap"
              >
                Latih di Arcade
              </button>
            </div>
          )}
        </div>

        {onMarkTopicRead && ['socionics', 'enneagram', 'jungian'].includes(activeTab) && (
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 text-xs">
            <span className="font-mono text-[11px] text-slate-500 uppercase tracking-wider">Tandai Topik Selesai:</span>
            {(activeTab === 'socionics'
              ? [
                  { id: 'theory-socionics-elements', label: '8 Elemen Informasi' },
                  { id: 'theory-socionics-modela', label: 'Model A (16 Tipe)' },
                  { id: 'theory-socionics-quadra', label: 'Nilai Quadra' },
                  { id: 'theory-socionics-intertype', label: 'Dinamika Intertipe' },
                ]
              : activeTab === 'enneagram'
              ? [
                  { id: 'theory-enneagram-centers', label: '3 Pusat Kecerdasan' },
                  { id: 'theory-enneagram-types', label: '9 Tipe Inti' },
                  { id: 'theory-enneagram-wings-arrows', label: 'Sayap & Panah' },
                  { id: 'theory-instinct-sp-so-sx', label: 'Insting SP/SO/SX' },
                  { id: 'theory-instinct-stacking', label: 'Stacking Instingtual' },
                  { id: 'theory-tritype-threefix', label: 'Three Fix / Tritype' },
                  { id: 'theory-tritype-conventions', label: 'Konvensi Penulisan Tritype' },
                ]
              : [
                  { id: 'theory-jungian-attitudes', label: 'Sikap E / I' },
                  { id: 'theory-jungian-functions', label: '4 Fungsi Jungian' },
                  { id: 'theory-jungian-notation', label: 'Notasi Konvensi Proyek' },
                ]
            ).map((tp) => {
              const done = readTopics.includes(tp.id);
              return (
                <button
                  key={tp.id}
                  type="button"
                  onClick={() => onMarkTopicRead(tp.id)}
                  className={`px-2.5 py-1 rounded-lg border text-[11px] font-medium transition-colors ${
                    done
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-indigo-50'
                  }`}
                >
                  {done ? '✓ ' : '+ '}
                  {tp.label}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* ================= SOCIONICS TAB ================= */}
      {activeTab === 'socionics' && (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
              {[
                { id: 'type' as const, label: 'Eksplorasi 16 Tipe & Model A' },
                { id: 'elements' as const, label: '8 Elemen Informasi' },
                { id: 'model-a' as const, label: 'Struktur 4 Blok & 8 Posisi' },
              ].map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setSocionicsSection(s.id)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                    socionicsSection === s.id
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
            <p className="text-xs text-slate-500">
              Model A Socionics tidak identik dengan urutan 8-fungsi shadow stack MBTI/Beebe.
            </p>
          </div>

          {socionicsSection === 'type' && (
            <div className="space-y-6">
              {/* 16 Type Selector Grid */}
              <div className="bg-white border border-slate-200 rounded-xl p-5">
                <h2 className="text-sm font-display font-semibold text-slate-900 mb-3">
                  Pilih Salah Satu dari 16 Tipe Socionics
                </h2>
                <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                  {ALL_SOCIONICS_CODES.map((code) => {
                    const t = SOCIONICS_TYPES[code];
                    const theme = getQuadraTheme(t.quadra);
                    const active = selectedSocionics === code;
                    return (
                      <button
                        key={code}
                        type="button"
                        onClick={() => setSelectedSocionics(code)}
                        className={`px-2.5 py-2 rounded-lg border text-left transition-colors ${
                          active
                            ? 'bg-indigo-700 text-white border-indigo-700'
                            : 'bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200'
                        }`}
                      >
                        <div className="font-mono text-xs font-bold">{code}</div>
                        <div
                          className={`text-[11px] truncate ${
                            active ? 'text-indigo-100' : theme.text
                          }`}
                        >
                          {t.quadra}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Type Overview + Model A 8-Position Map */}
              <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-6">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 pb-5 border-b border-slate-200">
                  <div>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                      <span className={`font-semibold ${socQuadraTheme.text}`}>
                        {socQuadraTheme.label}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span>{socSpec.club}</span>
                      <span aria-hidden="true">·</span>
                      <span>{socSpec.temperament}</span>
                    </div>
                    <h2 className="mt-1.5 text-2xl font-display font-bold text-slate-900">
                      {socSpec.code} — {socSpec.indonesianTitle}
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">{socSpec.fullName}</p>
                    <p className="mt-3 text-sm text-slate-700 leading-relaxed max-w-3xl">
                      {socSpec.summary}
                    </p>
                  </div>
                  <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-600 shrink-0 max-w-xs">
                    <strong className="text-slate-900 block mb-1">Nilai Elemen Quadra {socSpec.quadra}</strong>
                    <span>
                      Dihargai (Valued): {QUADRAS[socSpec.quadra].valuedElements.join(', ')}
                    </span>
                    <span className="block mt-1">
                      Latar (Subdued): {QUADRAS[socSpec.quadra].subduedElements.join(', ')}
                    </span>
                  </div>
                </div>

                {/* Model A 4 Blocks Grid */}
                <div>
                  <h3 className="text-base font-display font-semibold text-slate-900 mb-3">
                    Pemetaan Lengkap 8 Posisi Model A untuk {socSpec.code}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {MODEL_A_BLOCKS.map((block) => {
                      const posItems = modelADetails.filter((d) => d.block === block.id);
                      return (
                        <div
                          key={block.id}
                          className="border border-slate-200 rounded-xl p-4 bg-slate-50/60 space-y-3"
                        >
                          <div className="flex items-center justify-between gap-2 pb-2 border-b border-slate-200">
                            <div>
                              <h4 className="text-sm font-display font-semibold text-slate-900">
                                {block.indonesianLabel}
                              </h4>
                              <p className="text-[11px] text-slate-500">{block.nature}</p>
                            </div>
                          </div>

                          <div className="space-y-3">
                            {posItems.map((item) => {
                              const el = INFORMATION_ELEMENTS[item.element];
                              return (
                                <div key={item.position} className="bg-white border border-slate-200 rounded-lg p-3.5 space-y-1.5">
                                  <div className="flex items-center justify-between gap-2">
                                    <span className="text-xs font-semibold text-slate-900">
                                      Posisi {item.position} · {item.positionName}
                                    </span>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setSelectedIE(item.element);
                                        setSocionicsSection('elements');
                                      }}
                                      className="font-mono text-xs font-bold text-indigo-700 hover:underline"
                                    >
                                      {item.element} ({el.name})
                                    </button>
                                  </div>
                                  <p className="text-xs text-slate-700 leading-relaxed">
                                    {item.explanation}
                                  </p>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Strengths, Limitations, Communication, Interpersonal */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                  <div className="space-y-2">
                    <h4 className="text-sm font-display font-semibold text-slate-900">
                      Potensi Kekuatan Teoretis
                    </h4>
                    <ul className="list-disc pl-5 space-y-1.5 text-sm text-slate-700">
                      {socSpec.theoreticalStrengths.map((s, i) => (
                        <li key={i}>{s}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-sm font-display font-semibold text-slate-900">
                      Potensi Batasan &amp; Titik Rentan
                    </h4>
                    <ul className="list-disc pl-5 space-y-1.5 text-sm text-slate-700">
                      {socSpec.theoreticalLimitations.map((s, i) => (
                        <li key={i}>{s}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-sm font-display font-semibold text-slate-900">
                      Preferensi Komunikasi Potensial
                    </h4>
                    <ul className="list-disc pl-5 space-y-1.5 text-sm text-slate-700">
                      {socSpec.communicationPreferences.map((s, i) => (
                        <li key={i}>{s}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-sm font-display font-semibold text-slate-900">
                      Implikasi Interpersonal (Bersifat Kondisional)
                    </h4>
                    <ul className="list-disc pl-5 space-y-1.5 text-sm text-slate-700">
                      {socSpec.interpersonalImplications.map((s, i) => (
                        <li key={i}>{s}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Variation Note */}
                <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-600 leading-relaxed">
                  <strong>Catatan Variasi Aliran &amp; Referensi:</strong> Struktur 8 posisi di atas
                  mengikuti Model A klasik Aušra Augustinavičiūtė (1978/1998) sebagaimana digunakan di
                  komunitas Socionics arus utama dan konsisten dengan pemetaan acuan proyek untuk{' '}
                  <code className="font-mono">LIE</code> (Te-Ni-Fe-Si-Fi-Se-Ti-Ne) serta{' '}
                  <code className="font-mono">EIE</code> (Fe-Ni-Te-Si-Ti-Se-Fi-Ne). Aliran tertentu seperti
                  Humanitarian Socionics (Gulenko) memberi penekanan tambahan pada sub-tipe energi dan
                  dikotomi temperamen, namun posisi elemen inti Model A tetap sama.
                </div>
              </div>
            </div>
          )}

          {socionicsSection === 'elements' && (
            <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-6">
              <div className="flex flex-wrap gap-2">
                {ALL_IE_CODES.map((code) => (
                  <button
                    key={code}
                    type="button"
                    onClick={() => setSelectedIE(code)}
                    className={`px-3.5 py-2 rounded-lg text-xs font-mono font-semibold border transition-colors ${
                      selectedIE === code
                        ? 'bg-indigo-700 text-white border-indigo-700'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {code} · {INFORMATION_ELEMENTS[code].name}
                  </button>
                ))}
              </div>

              {(() => {
                const el = INFORMATION_ELEMENTS[selectedIE];
                return (
                  <div className="space-y-4">
                    <div className="pb-4 border-b border-slate-200">
                      <p className="text-xs text-slate-500">{el.dichotomy}</p>
                      <h2 className="text-xl font-display font-bold text-slate-900 mt-1">
                        {el.code} — {el.name} / {el.indonesianName}
                      </h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-sm text-slate-700">
                      <div>
                        <h3 className="font-semibold text-slate-900 mb-1">1. Definisi Teoretis</h3>
                        <p className="leading-relaxed">{el.theoreticalDefinition}</p>
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-900 mb-1">2. Fokus Informasi Utama</h3>
                        <p className="leading-relaxed">{el.mainFocus}</p>
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-900 mb-1">
                          3. Manifestasi dalam Pemrosesan Informasi
                        </h3>
                        <p className="leading-relaxed">{el.processingManifestation}</p>
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-900 mb-1">
                          4. Penerapan dalam Komunikasi
                        </h3>
                        <p className="leading-relaxed">{el.communicationApplication}</p>
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-900 mb-1">5. Potensi Kesalahpahaman</h3>
                        <p className="leading-relaxed">{el.potentialMisunderstanding}</p>
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-900 mb-1">6. Contoh Sehari-hari di SMA</h3>
                        <ul className="list-disc pl-5 space-y-1">
                          {el.everydayExamples.map((ex, i) => (
                            <li key={i}>{ex}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    <div className="p-4 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-900">
                      <strong>7. Batasan Interpretasi:</strong> {el.interpretationLimitations}
                    </div>
                  </div>
                );
              })()}
            </div>
          )}

          {socionicsSection === 'model-a' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {MODEL_A_BLOCKS.map((b) => (
                  <div key={b.id} className="bg-white border border-slate-200 rounded-xl p-5 space-y-2">
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span>Posisi {b.positions.join(' & ')}</span>
                      <span>{b.nature}</span>
                    </div>
                    <h3 className="text-base font-display font-semibold text-slate-900">
                      {b.indonesianLabel}
                    </h3>
                    <p className="text-sm text-slate-600 leading-relaxed">{b.description}</p>
                  </div>
                ))}
              </div>

              <div className="bg-white border border-slate-200 rounded-xl divide-y divide-slate-200">
                {MODEL_A_POSITIONS.map((p) => (
                  <div key={p.position} className="p-5 space-y-2">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h3 className="text-base font-display font-semibold text-slate-900">
                        {p.indonesianName}
                      </h3>
                      <span className="font-mono text-xs text-slate-500">
                        Blok {p.block} · {p.dimensionality}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-slate-700 leading-relaxed">
                      <p>
                        <strong className="text-slate-900">Peran Teoretis:</strong> {p.theoreticalRole}
                      </p>
                      <p>
                        <strong className="text-slate-900">Pemrosesan Informasi:</strong>{' '}
                        {p.informationProcessingFunction}
                      </p>
                      <p>
                        <strong className="text-slate-900">Posisi Struktural &amp; Implikasi:</strong>{' '}
                        {p.relativeStructurePosition} {p.interpersonalImplications}
                      </p>
                      <p>
                        <strong className="text-slate-900">Perbedaan dengan Posisi Lain:</strong>{' '}
                        {p.distinctionFromOthers}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ================= ENNEAGRAM TAB ================= */}
      {activeTab === 'enneagram' && (
        <div className="space-y-6">
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg w-fit flex-wrap">
            {[
              { id: 'types' as const, label: '9 Tipe & Sayap (Wings)' },
              { id: 'instincts' as const, label: 'Varian & Stacking Insting' },
              { id: 'triads' as const, label: 'Pusat & Triad' },
              { id: 'tritype' as const, label: 'Konfigurator Three Fix / Tritype' },
            ].map((et) => (
              <button
                key={et.id}
                type="button"
                onClick={() => setEnneagramTab(et.id)}
                className={`px-3.5 py-2 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                  enneagramTab === et.id
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {et.label}
              </button>
            ))}
          </div>

          {enneagramTab === 'types' && (
            <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-6">
              <div className="flex flex-wrap gap-2">
                {ALL_ENN_CORES.map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setSelectedEnn(num)}
                    className={`px-4 py-2 rounded-lg text-xs font-semibold border transition-colors ${
                      selectedEnn === num
                        ? 'bg-indigo-700 text-white border-indigo-700'
                        : 'bg-slate-50 text-slate-800 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    Tipe {num}
                  </button>
                ))}
              </div>

              <div className="space-y-4">
                <div className="pb-4 border-b border-slate-200">
                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                    <span>Pusat {ennSpec.center}</span>
                    <span aria-hidden="true">·</span>
                    <span>Object Relations: {ennSpec.objectRelations}</span>
                    <span aria-hidden="true">·</span>
                    <span>Harmonic: {ennSpec.harmonic}</span>
                    <span aria-hidden="true">·</span>
                    <span>Hornevian: {ennSpec.hornevian}</span>
                  </div>
                  <h2 className="mt-1 text-2xl font-display font-bold text-slate-900">
                    {ennSpec.name}
                  </h2>
                  <p className="text-sm text-indigo-700 font-medium">{ennSpec.indonesianTitle}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
                    <h3 className="font-semibold text-slate-900 mb-1">Motivasi Inti</h3>
                    <p className="text-slate-700 text-xs leading-relaxed">{ennSpec.coreMotivation}</p>
                  </div>
                  <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
                    <h3 className="font-semibold text-slate-900 mb-1">Ketakutan Inti</h3>
                    <p className="text-slate-700 text-xs leading-relaxed">{ennSpec.coreFear}</p>
                  </div>
                  <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
                    <h3 className="font-semibold text-slate-900 mb-1">Keinginan Inti</h3>
                    <p className="text-slate-700 text-xs leading-relaxed">{ennSpec.coreDesire}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-sm text-slate-700">
                  <div className="space-y-2">
                    <h3 className="font-semibold text-slate-900">Mekanisme Pertahanan (Teoretis)</h3>
                    <p className="leading-relaxed text-xs sm:text-sm">{ennSpec.defenseMechanism}</p>
                    <h3 className="font-semibold text-slate-900 pt-2">Perhatian Khas</h3>
                    <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm">
                      {ennSpec.typicalConcerns.map((c, i) => (
                        <li key={i}>{c}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-semibold text-slate-900">
                      Arah Stres (Tipe {ennSpec.stressDirection.target}) &amp; Pertumbuhan (Tipe{' '}
                      {ennSpec.growthDirection.target})
                    </h3>
                    <p className="text-xs sm:text-sm leading-relaxed">
                      <strong>Saat Stres:</strong> {ennSpec.stressDirection.description}
                    </p>
                    <p className="text-xs sm:text-sm leading-relaxed">
                      <strong>Saat Bertumbuh:</strong> {ennSpec.growthDirection.description}
                    </p>
                    <h3 className="font-semibold text-slate-900 pt-2">Pola Interpersonal &amp; Komunikasi</h3>
                    <p className="text-xs sm:text-sm leading-relaxed">
                      {ennSpec.interpersonalPatterns} {ennSpec.communicationConsiderations}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-sm text-slate-700 pt-2 border-t border-slate-200">
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-1.5">Contoh Sehari-hari &amp; di Sekolah</h3>
                    <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm">
                      {ennSpec.everydayExamples.map((ex, i) => (
                        <li key={`ev-${i}`}>{ex}</li>
                      ))}
                      {ennSpec.schoolExamples.map((ex, i) => (
                        <li key={`sc-${i}`}>{ex}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-2">Sayap Berdekatan (Adjacent Wings)</h3>
                    <div className="space-y-3">
                      {ennSpec.wings.map((w) => (
                        <div key={w.code} className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs space-y-1">
                          <div className="font-semibold text-slate-900">{w.title}</div>
                          <p className="text-slate-700">{w.influence}</p>
                          <p className="text-slate-600">{w.similaritiesAndDifferences}</p>
                          <p className="text-slate-500 italic">{w.interpretationVariation}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {enneagramTab === 'instincts' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {(['SP', 'SO', 'SX'] as InstinctCode[]).map((code) => {
                  const inst = INSTINCT_VARIANTS[code];
                  const active = selectedInstinct === code;
                  return (
                    <button
                      key={code}
                      type="button"
                      onClick={() => setSelectedInstinct(code)}
                      className={`text-left p-5 rounded-xl border transition-colors ${
                        active
                          ? 'bg-indigo-50 border-indigo-400'
                          : 'bg-white border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="font-mono text-xs font-bold text-indigo-700">{inst.code}</div>
                      <h3 className="mt-1 text-base font-display font-semibold text-slate-900">
                        {inst.indonesianName}
                      </h3>
                      <p className="mt-2 text-xs text-slate-600 leading-relaxed">{inst.summary}</p>
                    </button>
                  );
                })}
              </div>

              <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
                <h3 className="text-lg font-display font-semibold text-slate-900">
                  Detail Domain Insting {INSTINCT_VARIANTS[selectedInstinct].indonesianName}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-slate-700">
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-1">Tema Teoretis Utama</h4>
                    <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm">
                      {INSTINCT_VARIANTS[selectedInstinct].themes.map((t, i) => (
                        <li key={i}>{t}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="space-y-2 text-xs sm:text-sm">
                    <p>
                      <strong className="text-slate-900">Manifestasi di Kelas:</strong>{' '}
                      {INSTINCT_VARIANTS[selectedInstinct].classroomManifestation}
                    </p>
                    <p>
                      <strong className="text-slate-900">Potensi Kesalahpahaman:</strong>{' '}
                      {INSTINCT_VARIANTS[selectedInstinct].potentialMisunderstanding}
                    </p>
                  </div>
                </div>
              </div>

              {/* 6 Instinctual Stackings Explorer */}
              <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-display font-semibold text-slate-900">
                      Eksplorasi 6 Urutan Insting (Dominan, Sekunder &amp; Blind Spot)
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Insting ketiga (blind spot) menerima perhatian lebih sedikit secara relatif—bukan berarti seseorang tidak peduli atau tidak mampu dalam ranah tersebut.
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {ALL_STACKINGS.map((st) => (
                      <button
                        key={st}
                        type="button"
                        onClick={() => setSelectedStacking(st)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold border transition-colors ${
                          selectedStacking === st
                            ? 'bg-indigo-700 text-white border-indigo-700'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                </div>

                {(() => {
                  const st = INSTINCT_STACKINGS[selectedStacking];
                  return (
                    <div className="space-y-4 border-t border-slate-200 pt-4">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                        <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                          <span className="text-slate-500 block">1. Insting Dominan</span>
                          <strong className="text-sm font-mono text-slate-900">
                            {st.dominant} ({INSTINCT_VARIANTS[st.dominant].name})
                          </strong>
                        </div>
                        <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                          <span className="text-slate-500 block">2. Insting Sekunder</span>
                          <strong className="text-sm font-mono text-slate-900">
                            {st.secondary} ({INSTINCT_VARIANTS[st.secondary].name})
                          </strong>
                        </div>
                        <div className="p-3 rounded-lg bg-amber-50 border border-amber-200">
                          <span className="text-amber-800 block">3. Blind Spot (Relatif Terabaikan)</span>
                          <strong className="text-sm font-mono text-amber-950">
                            {st.blind}-blind ({INSTINCT_VARIANTS[st.blind].name})
                          </strong>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-slate-700">
                        <div className="space-y-2 text-xs sm:text-sm">
                          <p>
                            <strong className="text-slate-900">Kecenderungan Sehari-hari:</strong>{' '}
                            {st.everydayTendencies}
                          </p>
                          <p>
                            <strong className="text-slate-900">Implikasi Interpersonal:</strong>{' '}
                            {st.interpersonalImplications}
                          </p>
                          <p>
                            <strong className="text-slate-900">Contoh Situasi Sekolah:</strong>{' '}
                            {st.schoolExample}
                          </p>
                        </div>
                        <div className="space-y-2 text-xs sm:text-sm">
                          <p>
                            <strong className="text-slate-900">Potensi Blind Spot:</strong>{' '}
                            {st.possibleBlindSpots}
                          </p>
                          <strong className="text-slate-900 block pt-1">Saran Pengembangan Praktis:</strong>
                          <ul className="list-disc pl-5 space-y-1">
                            {st.developmentSuggestions.map((sg, i) => (
                              <li key={i}>{sg}</li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {account?.linkedProfileId && onSaveProfileStacking && (
                        <div className="pt-3 border-t border-slate-200 flex flex-wrap items-center gap-3">
                          <input
                            type="text"
                            value={selectedWingInput}
                            onChange={(e) => setSelectedWingInput(e.target.value)}
                            placeholder="Sayap opsional, mis. 2w1"
                            aria-label="Sayap Enneagram opsional"
                            className="px-3 py-1.5 text-xs border border-slate-300 rounded-lg w-40"
                          />
                          <button
                            type="button"
                            onClick={() => onSaveProfileStacking(selectedStacking, selectedWingInput)}
                            className="px-4 py-2 text-xs font-medium text-white bg-indigo-700 hover:bg-indigo-800 rounded-lg transition-colors"
                          >
                            Simpan Stacking ({selectedStacking}) ke Profil Saya
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })()}
              </div>
            </div>
          )}

          {enneagramTab === 'triads' && (
            <div className="space-y-6">
              {/* Three Centers */}
              <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
                <h2 className="text-lg font-display font-semibold text-slate-900">
                  Tiga Pusat Kecerdasan (Three Centers of Intelligence)
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {ENNEAGRAM_CENTERS.map((c) => (
                    <div key={c.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                      <div className="font-mono text-xs text-indigo-700 font-semibold">
                        Tipe {c.types.join(', ')} · {c.coreEmotion}
                      </div>
                      <h3 className="text-sm font-display font-semibold text-slate-900">{c.name}</h3>
                      <p className="text-xs text-slate-700 leading-relaxed">{c.theoreticalExplanation}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Object Relations, Harmonic, Hornevian */}
              {(['Object Relations', 'Harmonic', 'Hornevian'] as const).map((family) => (
                <div key={family} className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
                  <h2 className="text-lg font-display font-semibold text-slate-900">
                    Triad {family}
                  </h2>
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    {ENNEAGRAM_TRIADS.filter((tr) => tr.family === family).map((tr) => (
                      <div key={tr.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-2.5 text-xs text-slate-700">
                        <h3 className="text-sm font-display font-semibold text-slate-900">
                          {tr.groupName}
                        </h3>
                        <p>
                          <strong className="text-slate-900">Konsep Teoretis:</strong> {tr.theoreticalConcept}
                        </p>
                        <p>
                          <strong className="text-slate-900">Alasan Pengelompokan:</strong> {tr.groupingReason}
                        </p>
                        <p>
                          <strong className="text-slate-900">Perbedaan Ketiga Tipe:</strong>{' '}
                          {tr.differencesAmongThree}
                        </p>
                        <p>
                          <strong className="text-slate-900">Tema Relasional:</strong> {tr.relationalThemes}
                        </p>
                        <p>
                          <strong className="text-slate-900">Contoh Sehari-hari:</strong> {tr.everydayExamples}
                        </p>
                        <p className="text-slate-600 italic">
                          <strong>Miskonsepsi Umum:</strong> {tr.misconceptions}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {enneagramTab === 'tritype' && (
            <div className="space-y-6">
              {/* Theoretical Distinction */}
              <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
                <h2 className="text-lg font-display font-semibold text-slate-900">
                  Perbedaan Core Enneagram, Three Fix, Trifix, dan Tritype
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm text-slate-700">
                  <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
                    <strong className="text-slate-900 block mb-1">Core Enneagram</strong>
                    {TRITYPE_TERMINOLOGY_GUIDE.coreEnneagram}
                  </div>
                  <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
                    <strong className="text-slate-900 block mb-1">Three Fix</strong>
                    {TRITYPE_TERMINOLOGY_GUIDE.threeFix}
                  </div>
                  <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
                    <strong className="text-slate-900 block mb-1">Trifix</strong>
                    {TRITYPE_TERMINOLOGY_GUIDE.trifix}
                  </div>
                  <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
                    <strong className="text-slate-900 block mb-1">Tritype® (Core-First)</strong>
                    {TRITYPE_TERMINOLOGY_GUIDE.tritype}
                  </div>
                </div>
                <p className="text-xs text-slate-600">{TRITYPE_TERMINOLOGY_GUIDE.cautionNote}</p>
              </div>

              {/* Interactive Tritype Configurator */}
              <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-6">
                <div>
                  <h2 className="text-xl font-display font-bold text-slate-900">
                    Konfigurator Interaktif Three Fix, Trifix &amp; Tritype
                  </h2>
                  <p className="text-sm text-slate-600 mt-1">
                    Pilih tipe inti Anda dan satu fix dari masing-masing pusat kecerdasan. Sistem menempatkan tipe inti di posisi pertama sesuai konvensi Tritype (tidak mengurutkan angka secara mekanis).
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label htmlFor="tri-core" className="block text-xs font-medium text-slate-700 mb-1">
                      1. Tipe Inti (Core Enneagram)
                    </label>
                    <select
                      id="tri-core"
                      value={tritypeCore}
                      onChange={(e) => handleCoreChange(Number(e.target.value) as EnneagramCore)}
                      className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg bg-white"
                    >
                      {ALL_ENN_CORES.map((n) => (
                        <option key={n} value={n}>
                          Tipe {n} ({ENNEAGRAM_TYPES[n].center} Center)
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="tri-heart" className="block text-xs font-medium text-slate-700 mb-1">
                      2. Heart Fix (2, 3, atau 4)
                    </label>
                    <select
                      id="tri-heart"
                      value={heartFix}
                      onChange={(e) => setHeartFix(Number(e.target.value) as HeartFix)}
                      disabled={[2, 3, 4].includes(tritypeCore)}
                      className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg bg-white disabled:bg-slate-100"
                    >
                      {[2, 3, 4].map((n) => (
                        <option key={n} value={n}>
                          Heart Fix {n}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="tri-head" className="block text-xs font-medium text-slate-700 mb-1">
                      3. Head Fix (5, 6, atau 7)
                    </label>
                    <select
                      id="tri-head"
                      value={headFix}
                      onChange={(e) => setHeadFix(Number(e.target.value) as HeadFix)}
                      disabled={[5, 6, 7].includes(tritypeCore)}
                      className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg bg-white disabled:bg-slate-100"
                    >
                      {[5, 6, 7].map((n) => (
                        <option key={n} value={n}>
                          Head Fix {n}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="tri-gut" className="block text-xs font-medium text-slate-700 mb-1">
                      4. Gut Fix (8, 9, atau 1)
                    </label>
                    <select
                      id="tri-gut"
                      value={gutFix}
                      onChange={(e) => setGutFix(Number(e.target.value) as GutFix)}
                      disabled={[8, 9, 1].includes(tritypeCore)}
                      className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg bg-white disabled:bg-slate-100"
                    >
                      {[8, 9, 1].map((n) => (
                        <option key={n} value={n}>
                          Gut Fix {n}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-4 pt-2">
                  <div>
                    <label htmlFor="tri-conv" className="block text-xs font-medium text-slate-700 mb-1">
                      Konvensi Pengurutan
                    </label>
                    <select
                      id="tri-conv"
                      value={tritypeConvention}
                      onChange={(e) => setTritypeConvention(e.target.value as TritypeConvention)}
                      className="px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white"
                    >
                      <option value="core-first">Tritype Core-First (Tipe Inti di Depan)</option>
                      <option value="center-order">Urutan Pusat (Heart-Head-Gut)</option>
                    </select>
                  </div>

                  {tritypeConvention === 'core-first' && (
                    <div>
                      <label htmlFor="tri-sec" className="block text-xs font-medium text-slate-700 mb-1">
                        Fix ke-2 (Pengaruh Sekunder Terkuat)
                      </label>
                      <select
                        id="tri-sec"
                        value={secondaryPriority || ''}
                        onChange={(e) =>
                          setSecondaryPriority(
                            (e.target.value || null) as 'heart' | 'head' | 'gut' | null
                          )
                        }
                        className="px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white"
                      >
                        <option value="">Otomatis</option>
                        {![2, 3, 4].includes(tritypeCore) && (
                          <option value="heart">Heart Fix ({heartFix}) lebih kuat</option>
                        )}
                        {![5, 6, 7].includes(tritypeCore) && (
                          <option value="head">Head Fix ({headFix}) lebih kuat</option>
                        )}
                        {![8, 9, 1].includes(tritypeCore) && (
                          <option value="gut">Gut Fix ({gutFix}) lebih kuat</option>
                        )}
                      </select>
                    </div>
                  )}
                </div>

                {tritypeResult.valid && tritypeResult.interactionAnalysis ? (
                  <div className="border-t border-slate-200 pt-5 space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="p-4 rounded-lg bg-indigo-50 border border-indigo-200">
                        <span className="text-xs text-indigo-800 block">Representasi Tritype</span>
                        <span className="text-2xl font-mono font-bold text-indigo-950 tabular-nums">
                          {tritypeResult.tritypeDisplay}
                        </span>
                      </div>
                      <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
                        <span className="text-xs text-slate-600 block">Three Fix (Tiga Pusat)</span>
                        <span className="text-xl font-mono font-semibold text-slate-900 tabular-nums">
                          {tritypeResult.threeFix}
                        </span>
                      </div>
                      <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
                        <span className="text-xs text-slate-600 block">Label Trifix</span>
                        <span className="text-sm font-mono font-semibold text-slate-900">
                          {tritypeResult.trifixDisplay}
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed">
                      <strong>Penjelasan Pengurutan:</strong> {tritypeResult.orderingExplanation}
                    </p>

                    <div className="space-y-3">
                      <h3 className="text-base font-display font-semibold text-slate-900">
                        Interaksi Antar-Fix dalam Konfigurasi {tritypeResult.orderedFixes?.join('')}
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs text-slate-700">
                        <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200">
                          <strong className="text-slate-900 block mb-1">Peran Jantung (Fix {heartFix})</strong>
                          {tritypeResult.interactionAnalysis.heartContribution}
                        </div>
                        <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200">
                          <strong className="text-slate-900 block mb-1">Peran Pikiran (Fix {headFix})</strong>
                          {tritypeResult.interactionAnalysis.headContribution}
                        </div>
                        <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200">
                          <strong className="text-slate-900 block mb-1">Peran Insting (Fix {gutFix})</strong>
                          {tritypeResult.interactionAnalysis.gutContribution}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm text-slate-700">
                        <div className="space-y-2">
                          <p>
                            <strong className="text-slate-900">Sinergi &amp; Peran Inti:</strong>{' '}
                            {tritypeResult.interactionAnalysis.coreRole}{' '}
                            {tritypeResult.interactionAnalysis.synergy}
                          </p>
                          <p>
                            <strong className="text-slate-900">Ketegangan Internal Potensial:</strong>{' '}
                            {tritypeResult.interactionAnalysis.internalTension}
                          </p>
                        </div>
                        <div className="space-y-2">
                          <p>
                            <strong className="text-slate-900">Pola Tidak Sehat Saat Tertekan:</strong>{' '}
                            {tritypeResult.interactionAnalysis.unhealthyLoop}
                          </p>
                          <div>
                            <strong className="text-slate-900 block mb-1">Strategi Pengembangan:</strong>
                            <ul className="list-disc pl-5 space-y-1">
                              {tritypeResult.interactionAnalysis.developmentStrategies.map((st, idx) => (
                                <li key={idx}>{st}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>

                    {account?.linkedProfileId && onSaveProfileTritype ? (
                      <div className="pt-3 border-t border-slate-200 flex flex-wrap items-center gap-3">
                        <button
                          type="button"
                          onClick={handleSaveTritypeToProfile}
                          className="px-4 py-2 text-xs font-medium text-white bg-indigo-700 hover:bg-indigo-800 rounded-lg transition-colors"
                        >
                          Simpan Konfigurasi ke Profil Saya
                        </button>
                        {saveMessage && (
                          <span className="text-xs font-medium text-emerald-700">{saveMessage}</span>
                        )}
                      </div>
                    ) : (
                      <p className="text-xs text-slate-500 pt-2 border-t border-slate-100">
                        Masuk ke akun siswa Anda untuk menyimpan hasil konfigurasi Three Fix / Tritype langsung ke profil Anda.
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-800">
                    {tritypeResult.error}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ================= JUNGIAN TAB ================= */}
      {activeTab === 'jungian' && (
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-5">
            <div>
              <h2 className="text-xl font-display font-bold text-slate-900">
                Tipologi Jung &amp; Konvensi Notasi Proyek DYNAMAP
              </h2>
              <p className="text-sm text-slate-600 mt-1 max-w-3xl">
                DYNAMAP mempertahankan notasi klasifikasi yang digunakan dalam proyek (seperti{' '}
                <code className="font-mono">ET(N)</code>, <code className="font-mono">IF(S)</code>,{' '}
                <code className="font-mono">ES(F)</code>). Notasi ini merupakan konvensi pencatatan
                proyek—bukan konvensi universal atau kode MBTI 4-huruf.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
              <div>
                <label htmlFor="jung-select" className="block text-xs font-medium text-slate-700 mb-1">
                  Pilih atau Ketik Notasi Konvensi Proyek
                </label>
                <div className="flex gap-2">
                  <input
                    id="jung-select"
                    type="text"
                    value={customJungian}
                    onChange={(e) => setCustomJungian(e.target.value)}
                    placeholder="Contoh: ET(N) atau IF(S)"
                    className="flex-1 px-3 py-2 text-sm font-mono border border-slate-300 rounded-lg"
                  />
                </div>
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {Object.keys(JUNGIAN_NOTATIONS).map((code) => (
                    <button
                      key={code}
                      type="button"
                      onClick={() => setCustomJungian(code)}
                      className={`px-2.5 py-1 rounded text-xs font-mono border transition-colors ${
                        customJungian.toUpperCase() === code
                          ? 'bg-indigo-700 text-white border-indigo-700'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {code}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-3 text-sm">
                {jungParsed.valid ? (
                  <>
                    <div className="font-mono text-lg font-bold text-indigo-800">
                      {customJungian.toUpperCase()}
                    </div>
                    <p className="text-xs text-slate-700 leading-relaxed">
                      <strong>Fungsi Dominan &amp; Orientasi:</strong> {jungParsed.dominantFunction} (
                      {jungParsed.dominantOrientation})
                    </p>
                    <p className="text-xs text-slate-700 leading-relaxed">
                      <strong>Fungsi Pendamping (dalam tanda kurung):</strong>{' '}
                      {jungParsed.accompanyingFunction}
                    </p>
                    {jungKnown && (
                      <>
                        <p className="text-xs text-slate-700 leading-relaxed">
                          <strong>Preferensi Pemrosesan:</strong> {jungKnown.processingPreferences}
                        </p>
                        <p className="text-xs text-slate-700 leading-relaxed">
                          <strong>Implikasi Komunikasi:</strong> {jungKnown.communicationImplications}
                        </p>
                      </>
                    )}
                    <p className="text-xs text-slate-500 pt-2 border-t border-slate-200">
                      {jungParsed.explanation}
                    </p>
                  </>
                ) : (
                  <p className="text-xs text-red-700">{jungParsed.explanation}</p>
                )}
              </div>
            </div>

            <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-1.5">
              <strong className="text-slate-900 block">
                Perbedaan Teori Fungsi Jungian Klasik vs Socionics
              </strong>
              <p>
                1. Teori Jung (1921) berfokus pada sikap sadar (Ekstrovert/Introvert) dan fungsi dominan serta pendamping secara dinamis dalam psikologi individu.
              </p>
              <p>
                2. Socionics memetakan pertukaran 8 Elemen Informasi (metabolisme informasi) secara eksplisit ke dalam 8 posisi Model A dan relasi antar-tipe.
              </p>
              <p>
                3. Oleh karena itu, DYNAMAP tidak mengonversi otomatis notasi seperti <code className="font-mono">IF(N)</code> atau <code className="font-mono">ET(N)</code> menjadi kode MBTI ataupun menyamakannya secara mekanis.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ================= MBTI TAB ================= */}
      {activeTab === 'mbti' && (
        <MbtiTheorySection
          onNavigate={onNavigate}
          readTopics={readTopics}
          onMarkTopicRead={onMarkTopicRead}
        />
      )}

      {/* ================= SLOAN TAB ================= */}
      {activeTab === 'sloan' && (
        <SloanTheorySection
          onNavigate={onNavigate}
          readTopics={readTopics}
          onMarkTopicRead={onMarkTopicRead}
        />
      )}

      {/* ================= TEMPERAMENT TAB ================= */}
      {activeTab === 'temperament' && (
        <TemperamentTheorySection
          onNavigate={onNavigate}
          readTopics={readTopics}
          onMarkTopicRead={onMarkTopicRead}
        />
      )}

      {/* Citations Footer */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-2">
        <h3 className="text-sm font-display font-semibold text-slate-900">
          Referensi Teoretis Terkait
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 text-xs text-slate-600">
          {references.map((r) => (
            <div key={r.id} className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
              <span className="font-semibold text-slate-800">{r.author}</span> ({r.year}) ·{' '}
              <em>{r.title}</em> — <span className="text-indigo-700">{r.framework}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
