import React, { useEffect, useMemo, useState } from 'react';
import { AlertCircle, BookOpen, CheckCircle2, Compass, Layers, Search, ShieldAlert } from 'lucide-react';
import {
  ALL_24_PSYCHOSOPHY_TYPES,
  PSYCHOSOPHY_16_PLACEMENTS,
  PSYCHOSOPHY_ASPECTS,
  PSYCHOSOPHY_CONFLICT_PRINCIPLES,
  PSYCHOSOPHY_INTRO,
  PSYCHOSOPHY_POSITIONS,
} from '../data/psychosophyData';
import {
  generateCombinedTypologyProfile,
  parsePsychosophyPositions,
  validatePsychosophyCode,
} from '../lib/psychosophy';
import type {
  Account,
  Profile,
  PsychosophyAspect,
  PsychosophyConfidence,
  PsychosophyPositionNumber,
} from '../types/dynamap';

interface PsikosofiViewProps {
  profiles: Profile[];
  account: Account | null;
  myProfile: Profile | null;
  readTopics?: string[];
  onMarkTopicRead?: (topicId: string) => void;
  onSaveProfilePsychosophy?: (payload: {
    psychosophyCode: string;
    psychosophySelfReported?: string;
    psychosophyConfidence: PsychosophyConfidence;
    psychosophyProvisional: boolean;
    psychosophyNotes: string;
  }) => Promise<void>;
}

type PsyTab = 'intro-aspects' | 'positions' | 'identify-16' | 'directory-24' | 'validator-combined';

const ASPECT_ORDER: PsychosophyAspect[] = ['L', 'V', 'E', 'F'];
const POSITION_ORDER: PsychosophyPositionNumber[] = [1, 2, 3, 4];

export const PsikosofiView: React.FC<PsikosofiViewProps> = ({
  profiles,
  account,
  myProfile,
  readTopics = [],
  onMarkTopicRead,
  onSaveProfilePsychosophy,
}) => {
  const [activeTab, setActiveTab] = useState<PsyTab>('intro-aspects');
  const [selectedAspect, setSelectedAspect] = useState<PsychosophyAspect>('L');
  const [selectedIdentifyAspect, setSelectedIdentifyAspect] = useState<PsychosophyAspect>('L');
  const [selectedIdentifyPos, setSelectedIdentifyPos] = useState<PsychosophyPositionNumber>(1);
  const [dirSearch, setDirSearch] = useState('');
  const [dirFirstFilter, setDirFirstFilter] = useState<PsychosophyAspect | 'ALL'>('ALL');
  const [selectedDirCode, setSelectedDirCode] = useState<string>('LVEF');

  // Validator & Combined synthesis state
  const [codeInput, setCodeInput] = useState<string>(myProfile?.typology.psychosophyCode || 'LVEF');
  const [confidenceInput, setConfidenceInput] = useState<PsychosophyConfidence>(
    myProfile?.typology.psychosophyConfidence || 'Provisional / Dugaan Awal'
  );
  const [provisionalInput, setProvisionalInput] = useState<boolean>(
    myProfile?.typology.psychosophyProvisional ?? true
  );
  const [notesInput, setNotesInput] = useState<string>(myProfile?.typology.psychosophyNotes || '');
  const [selectedTargetProfileId, setSelectedTargetProfileId] = useState<string>(
    myProfile?.id || profiles[0]?.id || ''
  );
  const [saving, setSaving] = useState(false);
  const [saveFeedback, setSaveFeedback] = useState('');

  useEffect(() => {
    if (myProfile?.id) {
      setSelectedTargetProfileId(myProfile.id);
      if (myProfile.typology.psychosophyCode) {
        setCodeInput(myProfile.typology.psychosophyCode);
      }
      if (myProfile.typology.psychosophyConfidence) {
        setConfidenceInput(myProfile.typology.psychosophyConfidence);
      }
      if (myProfile.typology.psychosophyProvisional !== undefined) {
        setProvisionalInput(myProfile.typology.psychosophyProvisional);
      }
      if (myProfile.typology.psychosophyNotes !== undefined) {
        setNotesInput(myProfile.typology.psychosophyNotes);
      }
    }
  }, [myProfile]);

  const activePlacementKey = `${selectedIdentifyPos}${selectedIdentifyAspect}`;
  const activePlacement = PSYCHOSOPHY_16_PLACEMENTS[activePlacementKey];

  const filtered24 = useMemo(() => {
    const q = dirSearch.trim().toLowerCase();
    return ALL_24_PSYCHOSOPHY_TYPES.filter((t) => {
      if (dirFirstFilter !== 'ALL' && t.order[0] !== dirFirstFilter) return false;
      if (!q) return true;
      return (
        t.code.toLowerCase().includes(q) ||
        t.afanasyevNickname.toLowerCase().includes(q) ||
        t.overview.toLowerCase().includes(q) ||
        t.attitudinalPsycheClub.toLowerCase().includes(q)
      );
    });
  }, [dirSearch, dirFirstFilter]);

  const selectedDirSpec = useMemo(
    () => ALL_24_PSYCHOSOPHY_TYPES.find((t) => t.code === selectedDirCode) || ALL_24_PSYCHOSOPHY_TYPES[0],
    [selectedDirCode]
  );

  const validation = useMemo(() => validatePsychosophyCode(codeInput), [codeInput]);
  const parsedInput = useMemo(() => parsePsychosophyPositions(codeInput), [codeInput]);

  const previewProfile = useMemo(() => {
    const base = profiles.find((p) => p.id === selectedTargetProfileId) || myProfile || profiles[0];
    if (!base) return null;
    if (validation.valid && !validation.isEmpty) {
      return {
        ...base,
        typology: {
          ...base.typology,
          psychosophyCode: validation.normalizedCode,
          psychosophyConfidence: confidenceInput,
          psychosophyProvisional: provisionalInput,
        },
      };
    }
    return base;
  }, [profiles, selectedTargetProfileId, myProfile, validation, confidenceInput, provisionalInput]);

  const combinedSynthesis = useMemo(
    () => (previewProfile ? generateCombinedTypologyProfile(previewProfile) : null),
    [previewProfile]
  );

  async function handleSaveToProfile() {
    if (!onSaveProfilePsychosophy || !validation.valid) return;
    setSaving(true);
    setSaveFeedback('');
    try {
      await onSaveProfilePsychosophy({
        psychosophyCode: validation.normalizedCode,
        psychosophySelfReported: validation.normalizedCode,
        psychosophyConfidence: confidenceInput,
        psychosophyProvisional: provisionalInput,
        psychosophyNotes: notesInput,
      });
      setSaveFeedback(
        validation.isEmpty
          ? 'Notasi Psikosofi dikosongkan dan disimpan ke profil Anda.'
          : `Notasi ${validation.normalizedCode} berhasil disimpan ke profil Anda.`
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-8">
      {/* Header & Tabs */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
          <div className="space-y-1.5">
            <p className="text-xs font-medium text-indigo-700">
              Kerangka Tambahan DYNAMAP · Psychosophy (Afanasyev) &amp; Attitudinal Psyche
            </p>
            <h1 className="text-2xl font-display font-bold text-slate-900">
              Modul Psikosofi: Empat Aspek (L, V, E, F) &amp; Hierarki Posisi
            </h1>
            <p className="text-sm text-slate-600 max-w-3xl leading-relaxed">
              {PSYCHOSOPHY_INTRO.definition}
            </p>
          </div>
          <div className="shrink-0 p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-950 max-w-xs space-y-1">
            <div className="font-semibold flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0" />
              Batasan Ilmiah &amp; Etis
            </div>
            <p className="leading-relaxed">
              Kerangka teoretis non-klinis untuk refleksi komunikasi. <strong>F = Physics</strong> (materi/fisik), BUKAN Feeling. Posisi tidak mengukur IQ, kepemimpinan, empati, maupun kesehatan.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-200">
          {[
            { id: 'intro-aspects' as PsyTab, label: '1. Pengantar & 4 Aspek' },
            { id: 'positions' as PsyTab, label: '2. 4 Posisi & Tabel' },
            { id: 'identify-16' as PsyTab, label: '3. Identifikasi 16 Posisi' },
            { id: 'directory-24' as PsyTab, label: '4. Direktori 24 Tipe' },
            { id: 'validator-combined' as PsyTab, label: '5. Validator & Sintesis' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-indigo-700 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {onMarkTopicRead && (
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 text-xs">
            <span className="font-medium text-slate-600">Tandai Progres Bacaan Psikosofi:</span>
            {[
              { id: 'theory-psy-aspects', label: '4 Aspek (L·V·E·F)' },
              { id: 'theory-psy-positions', label: '4 Posisi & 16 Penempatan' },
              { id: 'theory-psy-24types', label: 'Direktori 24 Tipe' },
            ].map((topic) => {
              const done = readTopics.includes(topic.id);
              return (
                <button
                  key={topic.id}
                  type="button"
                  onClick={() => onMarkTopicRead(topic.id)}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded border text-[11px] font-medium whitespace-nowrap transition-colors ${
                    done
                      ? 'bg-emerald-50 text-emerald-900 border-emerald-200'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <CheckCircle2 className={`w-3.5 h-3.5 ${done ? 'text-emerald-700' : 'text-slate-400'}`} />
                  {done ? `Selesai: ${topic.label}` : `Tandai Dibaca: ${topic.label}`}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* TAB 1: INTRO & 4 ASPECTS */}
      {activeTab === 'intro-aspects' && (
        <div className="space-y-6">
          {/* School differences */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
            <h2 className="text-lg font-display font-semibold text-slate-900">
              Perbedaan Tradisi: Psikosofi (Afanasyev) vs Attitudinal Psyche (AP)
            </h2>
            <p className="text-xs text-slate-600">
              Meski berakar dari struktur 4 aspek yang serumpun, kedua sekolah memiliki istilah dan penekanan berbeda—DYNAMAP tidak menyamakan istilahnya secara otomatis tanpa penjelasan.
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs sm:text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-700">
                    <th className="py-2.5 px-3 font-semibold w-1/5">Dimensi</th>
                    <th className="py-2.5 px-3 font-semibold w-2/5">Psikosofi (Aleksandr Afanasyev)</th>
                    <th className="py-2.5 px-3 font-semibold w-2/5">Attitudinal Psyche (Rob Zuber)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-slate-700">
                  {PSYCHOSOPHY_INTRO.psychosophyVsAttitudinalPsyche.map((row) => (
                    <tr key={row.aspect} className="align-top">
                      <td className="py-3 px-3 font-semibold text-slate-900">{row.aspect}</td>
                      <td className="py-3 px-3 leading-relaxed">{row.psychosophyAfanasyev}</td>
                      <td className="py-3 px-3 leading-relaxed">{row.attitudinalPsyche}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Interactive 4 Aspects Explorer */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <h2 className="text-lg font-display font-semibold text-slate-900">
                  Empat Aspek Psikosofi: L · V · E · F
                </h2>
                <p className="text-xs text-slate-500">
                  Pilih salah satu aspek untuk memahami ruang lingkup sikap, variasi posisi 1–4, dan batas interpretasinya.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {ASPECT_ORDER.map((asp) => (
                  <button
                    key={asp}
                    type="button"
                    onClick={() => setSelectedAspect(asp)}
                    className={`px-3.5 py-2 rounded-lg text-xs font-mono font-semibold transition-colors whitespace-nowrap ${
                      selectedAspect === asp
                        ? 'bg-indigo-700 text-white'
                        : 'bg-slate-100 text-slate-800 hover:bg-slate-200'
                    }`}
                  >
                    {asp} — {PSYCHOSOPHY_ASPECTS[asp].englishName}
                  </button>
                ))}
              </div>
            </div>

            {(() => {
              const spec = PSYCHOSOPHY_ASPECTS[selectedAspect];
              return (
                <div className="space-y-4 pt-2 border-t border-slate-200">
                  {spec.criticalNote && (
                    <div className="p-3.5 rounded-lg bg-amber-50 border border-amber-200 text-xs font-medium text-amber-950">
                      {spec.criticalNote}
                    </div>
                  )}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                    <div className="lg:col-span-5 space-y-3">
                      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                        <div className="font-mono text-xs text-indigo-700 font-semibold">
                          Aspek {spec.code} ({spec.englishName})
                        </div>
                        <h3 className="text-base font-display font-semibold text-slate-900">
                          {spec.indonesianName}
                        </h3>
                        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                          {spec.overview}
                        </p>
                      </div>
                      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                        <h4 className="text-xs font-semibold text-slate-900">
                          Domain yang Dicakup Aspek {spec.code}:
                        </h4>
                        <ul className="list-disc pl-4 space-y-1 text-xs text-slate-700">
                          {spec.domainItems.map((item) => (
                            <li key={item}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="lg:col-span-7 space-y-3">
                      <h4 className="text-sm font-display font-semibold text-slate-900">
                        Gambaran Singkat Aspek {spec.code} di Posisi 1–4
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {spec.acrossPositionsSummary.map((item) => (
                          <div
                            key={item.position}
                            className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1"
                          >
                            <div className="font-mono text-xs font-semibold text-indigo-700">
                              {item.position}{spec.code} · Posisi {item.position}
                            </div>
                            <p className="text-xs text-slate-700 leading-relaxed">{item.summary}</p>
                          </div>
                        ))}
                      </div>
                      <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-xs text-red-950 space-y-1">
                        <strong className="block">Larangan Penyamanaan (Non-Equivalency):</strong>
                        <p className="leading-relaxed">{spec.notEquatedWith}</p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>

          {/* Non-equivalency & ethical limits */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
            <h2 className="text-lg font-display font-semibold text-slate-900">
              Klarifikasi Kesalahpahaman Umum &amp; Batasan Ilmiah
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              {PSYCHOSOPHY_INTRO.nonEquivalencyRules.map((rule) => (
                <div key={rule.placementOrAspect} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                  <div className="font-mono font-semibold text-slate-900">{rule.placementOrAspect}</div>
                  <p className="text-red-800">
                    <strong>Mitos Keliru:</strong> {rule.misconception}
                  </p>
                  <p className="text-slate-700 leading-relaxed">
                    <strong>Klarifikasi:</strong> {rule.clarification}
                  </p>
                </div>
              ))}
            </div>
            <ul className="list-disc pl-5 space-y-1 text-xs text-slate-600 pt-2 border-t border-slate-200">
              {PSYCHOSOPHY_INTRO.scientificAndEthicalLimitations.map((lim) => (
                <li key={lim}>{lim}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* TAB 2: 4 POSITIONS & COMPARISON MATRIX */}
      {activeTab === 'positions' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {POSITION_ORDER.map((posNum) => {
              const pos = PSYCHOSOPHY_POSITIONS[posNum];
              return (
                <div key={posNum} className="bg-white border border-slate-200 rounded-xl p-5 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="font-mono text-xs font-semibold text-indigo-700">
                        Posisi ke-{posNum} · {pos.orientationDichotomies}
                      </span>
                      <h2 className="text-base font-display font-semibold text-slate-900 mt-0.5">
                        {pos.labelIndonesian}
                      </h2>
                    </div>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                    {pos.coreCharacteristics}
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                    <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                      <span className="font-semibold text-slate-800 block mb-0.5">Istilah Afanasyev:</span>
                      <span className="text-slate-600">{pos.afanasyevTerms.join(' · ')}</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                      <span className="font-semibold text-slate-800 block mb-0.5">Istilah Attitudinal Psyche:</span>
                      <span className="text-slate-600">{pos.attitudinalPsycheTerms.join(' · ')}</span>
                    </div>
                  </div>
                  <p className="text-xs text-indigo-950 bg-indigo-50 border border-indigo-200 rounded-lg p-3 leading-relaxed">
                    <strong>Catatan Penting:</strong> {pos.schoolNuanceNote}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
            <h2 className="text-lg font-display font-semibold text-slate-900">
              Tabel Perbandingan 4 Posisi Psikosofi
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-700">
                    <th className="py-2.5 px-3 font-semibold">Dimensi Pembanding</th>
                    <th className="py-2.5 px-3 font-semibold">Posisi 1 (Dominan / Confident)</th>
                    <th className="py-2.5 px-3 font-semibold">Posisi 2 (Kreatif / Flexible)</th>
                    <th className="py-2.5 px-3 font-semibold">Posisi 3 (Rentan / Insecure)</th>
                    <th className="py-2.5 px-3 font-semibold">Posisi 4 (Ringan / Unbothered)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-slate-700 align-top">
                  <tr>
                    <td className="py-3 px-3 font-semibold text-slate-900">Sikap Dasar</td>
                    {POSITION_ORDER.map((n) => (
                      <td key={n} className="py-3 px-3 leading-relaxed">
                        {PSYCHOSOPHY_POSITIONS[n].comparisonRow.basicAttitude}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-3 px-3 font-semibold text-slate-900">Keyakinan vs Sensitivitas</td>
                    {POSITION_ORDER.map((n) => (
                      <td key={n} className="py-3 px-3 leading-relaxed">
                        {PSYCHOSOPHY_POSITIONS[n].comparisonRow.confidenceVsSensitivity}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-3 px-3 font-semibold text-slate-900">Respons thd Masukan</td>
                    {POSITION_ORDER.map((n) => (
                      <td key={n} className="py-3 px-3 leading-relaxed">
                        {PSYCHOSOPHY_POSITIONS[n].comparisonRow.responseToOthersInput}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-3 px-3 font-semibold text-slate-900">Proses vs Hasil</td>
                    {POSITION_ORDER.map((n) => (
                      <td key={n} className="py-3 px-3 leading-relaxed">
                        {PSYCHOSOPHY_POSITIONS[n].comparisonRow.processVsResult}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-3 px-3 font-semibold text-slate-900">Risiko Salah Ketik</td>
                    {POSITION_ORDER.map((n) => (
                      <td key={n} className="py-3 px-3 leading-relaxed">
                        {PSYCHOSOPHY_POSITIONS[n].comparisonRow.mistypingRisk}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
            <h2 className="text-lg font-display font-semibold text-slate-900">
              Pola Interaksi Konflik Khas Antar-Posisi Psikosofi
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              {PSYCHOSOPHY_CONFLICT_PRINCIPLES.map((cp) => (
                <div key={cp.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                  <h3 className="text-sm font-display font-semibold text-slate-900">{cp.title}</h3>
                  <p className="text-slate-500">{cp.appliesWhen}</p>
                  <p className="text-slate-700 leading-relaxed">
                    <strong>Salah tafsir umum:</strong> {cp.howMisunderstood}
                  </p>
                  <p className="text-emerald-950 bg-emerald-50 border border-emerald-200 rounded-lg p-2.5 leading-relaxed">
                    <strong>Jembatan komunikasi:</strong> {cp.communicationBridge}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: HOW TO IDENTIFY ALL 16 PLACEMENTS */}
      {activeTab === 'identify-16' && (
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <h2 className="text-lg font-display font-semibold text-slate-900">
                  Panduan Mengidentifikasi Posisi: Seluruh 16 Penempatan (1L–4F)
                </h2>
                <p className="text-xs text-slate-600 mt-1 max-w-2xl">
                  Jangan menyimpulkan posisi hanya dari satu perilaku tunggal (misalnya sekali gugup presentasi lalu langsung merasa 3L). Amati pola sikap berulang lintas situasi rumah, kelas, dan kerja kelompok.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
                  {ASPECT_ORDER.map((asp) => (
                    <button
                      key={asp}
                      type="button"
                      onClick={() => setSelectedIdentifyAspect(asp)}
                      className={`px-3 py-1.5 rounded-md text-xs font-mono font-semibold transition-colors ${
                        selectedIdentifyAspect === asp
                          ? 'bg-white text-indigo-700 shadow-sm'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {asp}
                    </button>
                  ))}
                </div>
                <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
                  {POSITION_ORDER.map((pos) => (
                    <button
                      key={pos}
                      type="button"
                      onClick={() => setSelectedIdentifyPos(pos)}
                      className={`px-3 py-1.5 rounded-md text-xs font-mono font-semibold transition-colors ${
                        selectedIdentifyPos === pos
                          ? 'bg-indigo-700 text-white shadow-sm'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Posisi {pos}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {activePlacement && (
              <div className="pt-4 border-t border-slate-200 space-y-5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="text-xl font-display font-bold text-slate-900">
                    {activePlacement.title}
                  </h3>
                  <span className="font-mono text-xs font-semibold text-indigo-700">
                    Kode Penempatan: {activePlacement.code}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm">
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                    <strong className="text-slate-900 block">1. Sikap Inti (Core Attitude)</strong>
                    <p className="text-slate-700 leading-relaxed">{activePlacement.coreAttitude}</p>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                    <strong className="text-slate-900 block">2. Pengalaman Subjektif Khas</strong>
                    <p className="text-slate-700 leading-relaxed">
                      {activePlacement.typicalSubjectiveExperience}
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 space-y-1.5">
                    <strong className="text-emerald-950 block">3. Potensi Kekuatan</strong>
                    <ul className="list-disc pl-4 space-y-1 text-emerald-900">
                      {activePlacement.potentialStrengths.map((s) => (
                        <li key={s}>{s}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 space-y-1.5">
                    <strong className="text-amber-950 block">4. Potensi Kesulitan</strong>
                    <ul className="list-disc pl-4 space-y-1 text-amber-900">
                      {activePlacement.potentialDifficulties.map((d) => (
                        <li key={d}>{d}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm">
                  <div className="p-4 rounded-xl bg-indigo-50 border border-indigo-200 space-y-2">
                    <strong className="text-indigo-950 block">
                      5. Pertanyaan Refleksi untuk Menguji {activePlacement.code}
                    </strong>
                    <ul className="list-disc pl-4 space-y-1.5 text-indigo-900">
                      {activePlacement.reflectiveQuestions.map((q) => (
                        <li key={q}>{q}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                    <strong className="text-slate-900 block">6. Contoh Sehari-hari &amp; Situasi SMA</strong>
                    <ul className="list-disc pl-4 space-y-1.5 text-slate-700">
                      {activePlacement.everydayExamples.map((ex) => (
                        <li key={ex}>{ex}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm">
                  <div className="p-4 rounded-xl bg-red-50 border border-red-200 space-y-1.5">
                    <strong className="text-red-950 block">
                      7. Kemungkinan Salah Tafsir &amp; Penjelasan Non-Tipologi
                    </strong>
                    <p className="text-red-900 leading-relaxed">
                      {activePlacement.possibleMisinterpretations}
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                    <strong className="text-slate-900 block">
                      8. Perbedaan Tegas dari Posisi Berdekatan
                    </strong>
                    <p className="text-slate-700 leading-relaxed">
                      {activePlacement.differencesFromAdjacentPositions}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 4: FULL 24 PERMUTATION DIRECTORY */}
      {activeTab === 'directory-24' && (
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <h2 className="text-lg font-display font-semibold text-slate-900">
                  Direktori Lengkap 24 Permutasi Tipe Psikosofi ({filtered24.length}/24)
                </h2>
                <p className="text-xs text-slate-600 mt-1 max-w-3xl">
                  Pengenal utama adalah kode 4 huruf (misalnya <code className="font-mono">LVEF</code>). Julukan tokoh historis di bawah bersumber dari tradisi <em>Sintaks Lyubvi</em> karya Aleksandr Afanasyev, sedangkan Attitudinal Psyche lebih mengutamakan kode huruf &amp; pengelompokan Sextet.
                </p>
              </div>
              <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 shrink-0">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="search"
                    value={dirSearch}
                    onChange={(e) => setDirSearch(e.target.value)}
                    placeholder="Cari kode (LVEF) atau julukan..."
                    className="pl-8 pr-3 py-1.5 text-xs border border-slate-300 rounded-lg bg-white"
                  />
                </div>
                <select
                  aria-label="Filter aspek posisi pertama"
                  value={dirFirstFilter}
                  onChange={(e) => setDirFirstFilter(e.target.value as PsychosophyAspect | 'ALL')}
                  className="px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg bg-white"
                >
                  <option value="ALL">Semua Posisi ke-1</option>
                  <option value="L">1L (Logika Pertama)</option>
                  <option value="V">1V (Kehendak Pertama)</option>
                  <option value="E">1E (Emosi Pertama)</option>
                  <option value="F">1F (Fisika Pertama)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start pt-2">
              <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-3">
                {filtered24.map((t) => {
                  const active = selectedDirSpec.code === t.code;
                  return (
                    <button
                      key={t.code}
                      type="button"
                      onClick={() => setSelectedDirCode(t.code)}
                      className={`text-left p-3.5 rounded-xl border transition-colors space-y-1 ${
                        active
                          ? 'bg-indigo-50 border-indigo-400'
                          : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-mono text-sm font-bold text-slate-900">{t.code}</span>
                        <span className="text-[11px] font-medium text-indigo-700">
                          “{t.afanasyevNickname}”
                        </span>
                      </div>
                      <div className="font-mono text-[11px] text-slate-500">
                        1{t.order[0]} · 2{t.order[1]} · 3{t.order[2]} · 4{t.order[3]}
                      </div>
                      <p className="text-xs text-slate-700 line-clamp-2 leading-relaxed">
                        {t.overview}
                      </p>
                    </button>
                  );
                })}
              </div>

              <div className="lg:col-span-5 bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-3 lg:sticky lg:top-20">
                <div className="flex items-center justify-between gap-2 pb-2 border-b border-slate-200">
                  <div>
                    <div className="font-mono text-2xl font-bold text-indigo-800">
                      {selectedDirSpec.code}
                    </div>
                    <div className="text-xs text-slate-600">
                      Julukan Afanasyev (<em>Sintaks Lyubvi</em>):{' '}
                      <strong className="text-slate-900">“{selectedDirSpec.afanasyevNickname}”</strong>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setCodeInput(selectedDirSpec.code);
                      setActiveTab('validator-combined');
                    }}
                    className="px-3 py-1.5 text-xs font-medium text-indigo-700 bg-white border border-indigo-200 hover:bg-indigo-50 rounded-lg whitespace-nowrap"
                  >
                    Uji di Validator
                  </button>
                </div>

                {selectedDirSpec.alternateHistoricalNotes && (
                  <p className="text-[11px] text-amber-900 bg-amber-50 border border-amber-200 rounded-lg p-2.5">
                    <strong>Catatan variasi label:</strong> {selectedDirSpec.alternateHistoricalNotes}
                  </p>
                )}

                <div className="text-xs text-slate-600">
                  <strong>Kelompok AP:</strong> {selectedDirSpec.attitudinalPsycheClub}
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                  {selectedDirSpec.order.map((asp, idx) => (
                    <div key={asp} className="p-2 rounded-lg bg-white border border-slate-200">
                      <span className="text-indigo-700 font-semibold">
                        {idx + 1}
                        {asp}
                      </span>{' '}
                      <span className="text-slate-600">
                        · {PSYCHOSOPHY_ASPECTS[asp].englishName}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="space-y-1.5 text-xs text-slate-700 leading-relaxed">
                  <strong className="text-slate-900 block">Gambaran Tipe:</strong>
                  <p>{selectedDirSpec.overview}</p>
                </div>

                <div className="space-y-1.5 text-xs text-slate-700 leading-relaxed pt-2 border-t border-slate-200">
                  <strong className="text-slate-900 block">
                    Sintesis Interaksi Posisi (1st–4th):
                  </strong>
                  <p>{selectedDirSpec.positionalSynthesis}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: VALIDATOR & COMBINED MULTI-LENS SYNTHESIS */}
      {activeTab === 'validator-combined' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Input & Validator */}
            <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-6 space-y-4">
              <div className="flex items-center gap-2">
                <Compass className="w-5 h-5 text-indigo-700" />
                <h2 className="text-lg font-display font-semibold text-slate-900">
                  Input &amp; Validator Notasi Psikosofi
                </h2>
              </div>
              <p className="text-xs text-slate-600">
                Masukkan kombinasi 4 huruf unik dari <code className="font-mono">L</code>,{' '}
                <code className="font-mono">V</code>, <code className="font-mono">E</code>, dan{' '}
                <code className="font-mono">F</code> (atau kosongkan jika belum ditentukan).
              </p>

              <div className="space-y-3 text-xs">
                <div>
                  <label htmlFor="psy-code-input" className="block font-medium text-slate-700 mb-1">
                    Kode Tipe Psikosofi (4 Huruf)
                  </label>
                  <input
                    id="psy-code-input"
                    type="text"
                    maxLength={4}
                    value={codeInput}
                    onChange={(e) => setCodeInput(e.target.value.toUpperCase())}
                    placeholder="Contoh: LVEF, ELVF, atau kosong"
                    className="w-full px-3 py-2 text-sm font-mono uppercase border border-slate-300 rounded-lg"
                  />
                  {!validation.valid && (
                    <div className="mt-1.5 p-2.5 rounded-lg bg-red-50 border border-red-200 text-red-800 flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                      <span>{validation.error}</span>
                    </div>
                  )}
                  {validation.valid && !validation.isEmpty && (
                    <div className="mt-1.5 p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                      <span>
                        Notasi valid: <strong className="font-mono">{validation.normalizedCode}</strong>
                        {parsedInput.typeSpec
                          ? ` (“${parsedInput.typeSpec.afanasyevNickname}” — tradisi Afanasyev)`
                          : ''}
                      </span>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="psy-conf-select" className="block font-medium text-slate-700 mb-1">
                      Tingkat Keyakinan
                    </label>
                    <select
                      id="psy-conf-select"
                      value={confidenceInput}
                      onChange={(e) => setConfidenceInput(e.target.value as PsychosophyConfidence)}
                      className="w-full px-2.5 py-2 border border-slate-300 rounded-lg bg-white"
                    >
                      <option value="Belum Dipastikan">Belum Dipastikan</option>
                      <option value="Provisional / Dugaan Awal">Provisional / Dugaan Awal</option>
                      <option value="Cukup Yakin">Cukup Yakin</option>
                      <option value="Terkonfirmasi Mandiri">Terkonfirmasi Mandiri</option>
                    </select>
                  </div>

                  <div className="flex items-end pb-2">
                    <label className="flex items-center gap-2 cursor-pointer text-slate-700">
                      <input
                        type="checkbox"
                        checked={provisionalInput}
                        onChange={(e) => setProvisionalInput(e.target.checked)}
                      />
                      <span>Tandai sebagai provisional</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label htmlFor="psy-notes-input" className="block font-medium text-slate-700 mb-1">
                    Catatan Refleksi Pribadi (Opsional)
                  </label>
                  <textarea
                    id="psy-notes-input"
                    rows={2}
                    value={notesInput}
                    onChange={(e) => setNotesInput(e.target.value)}
                    placeholder="Contoh: Masih mempertimbangkan apakah 2V atau 3V dalam situasi rapat kelompok..."
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  />
                </div>

                {account?.linkedProfileId && onSaveProfilePsychosophy ? (
                  <div className="pt-2 space-y-2">
                    <button
                      type="button"
                      disabled={!validation.valid || saving}
                      onClick={handleSaveToProfile}
                      className="w-full px-4 py-2 text-xs font-medium text-white bg-indigo-700 hover:bg-indigo-800 rounded-lg disabled:opacity-50"
                    >
                      {saving ? 'Menyimpan...' : 'Simpan Kode Psikosofi ke Profil Saya'}
                    </button>
                    {saveFeedback && (
                      <p className="text-xs font-medium text-emerald-700">{saveFeedback}</p>
                    )}
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 pt-2 border-t border-slate-100">
                    Masuk ke akun siswa/guru yang tertaut untuk menyimpan kode Psikosofi langsung ke profil Anda.
                  </p>
                )}
              </div>
            </div>

            {/* Automatic Breakdown & Combined Typology Synthesis */}
            <div className="lg:col-span-7 space-y-5">
              {parsedInput.valid && (
                <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
                  <h2 className="text-lg font-display font-semibold text-slate-900">
                    Uraian Otomatis Posisi 1–4 ({parsedInput.code})
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    {parsedInput.placements.map((pl) => (
                      <div key={pl.code} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                        <div className="font-mono font-bold text-indigo-800">{pl.guide.title}</div>
                        <p className="text-slate-700 leading-relaxed">{pl.guide.coreAttitude}</p>
                      </div>
                    ))}
                  </div>
                  <div className="p-4 rounded-xl bg-indigo-50 border border-indigo-200 text-xs text-indigo-950 leading-relaxed">
                    <strong className="block mb-1">Sintesis Interaksi 4 Posisi:</strong>
                    {parsedInput.interactionSynthesis}
                  </div>
                </div>
              )}

              <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-display font-semibold text-slate-900 flex items-center gap-2">
                      <Layers className="w-4 h-4 text-indigo-700" />
                      Interpretasi Gabungan Lintas Kerangka
                    </h2>
                    <p className="text-xs text-slate-500">
                      Menghubungkan Socionics, Enneagram, Tipologi Jung, dan Psikosofi sebagai lensa terpisah tanpa menggabungkannya secara paksa.
                    </p>
                  </div>
                  <select
                    aria-label="Pilih profil untuk simulasi gabungan"
                    value={selectedTargetProfileId}
                    onChange={(e) => setSelectedTargetProfileId(e.target.value)}
                    className="px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg bg-white"
                  >
                    {profiles
                      .filter((p) => !p.archived)
                      .map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.displayName} ({p.typology.socionics || '-'} · {p.typology.enneagramRaw || '-'})
                        </option>
                      ))}
                  </select>
                </div>

                {combinedSynthesis && (
                  <div className="space-y-4 text-xs">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {combinedSynthesis.lenses.map((lens) => (
                        <div key={lens.framework} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-semibold text-slate-900">{lens.framework}</span>
                            <span className="font-mono text-indigo-700 font-semibold">{lens.code}</span>
                          </div>
                          <p className="text-slate-700 leading-relaxed">{lens.lensDescription}</p>
                          <div className="text-[11px] text-slate-500">{lens.statusNote}</div>
                        </div>
                      ))}
                    </div>

                    <div className="space-y-2">
                      <strong className="text-slate-900 block">
                        Hipotesis Interaksi Lintas Lensa untuk {combinedSynthesis.displayName}:
                      </strong>
                      <ul className="list-disc pl-4 space-y-1 text-slate-700 leading-relaxed">
                        {combinedSynthesis.integrationHypotheses.map((h, i) => (
                          <li key={i}>{h}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="space-y-2">
                      <strong className="text-slate-900 block">
                        Nuansa &amp; Potensi Ketegangan Internal Antar-Dimensi:
                      </strong>
                      <ul className="list-disc pl-4 space-y-1 text-slate-700 leading-relaxed">
                        {combinedSynthesis.possibleInternalTensions.map((t, i) => (
                          <li key={i}>{t}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-amber-950 flex items-start gap-2">
                      <BookOpen className="w-4 h-4 shrink-0 mt-0.5 text-amber-700" />
                      <span className="leading-relaxed">
                        {combinedSynthesis.frameworkBoundaryDisclaimer}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
