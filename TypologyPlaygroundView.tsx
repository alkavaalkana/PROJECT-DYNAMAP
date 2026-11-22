import React, { useMemo, useState } from 'react';
import {
  BookmarkPlus,
  Compass,
  Layers,
  RotateCcw,
  SlidersHorizontal,
  Trash2,
  UserCheck,
} from 'lucide-react';
import { ENNEAGRAM_TYPES, INSTINCT_STACKINGS, INSTINCT_VARIANTS } from '../data/enneagramData';
import {
  ALL_24_PSYCHOSOPHY_TYPES,
  PSYCHOSOPHY_ASPECTS,
  PSYCHOSOPHY_POSITIONS,
} from '../data/psychosophyData';
import { INFORMATION_ELEMENTS, SOCIONICS_TYPES } from '../data/socionicsData';
import { MBTI_TYPE_STACKS, SLOAN_DIMENSIONS } from '../data/arcadeAndCaseData';
import { parsePsychosophyPositions } from '../lib/psychosophy';
import { validateAndBuildTritype } from '../lib/typology';
import {
  ALL_16_MBTI_PROFILES,
  CLASSICAL_4_TEMPERAMENTS,
  MIXED_6_TEMPERAMENTS,
  TEMPERAMENT_HISTORY_AND_MODELS,
} from '../data/extendedTheoryData';
import {
  buildExtendedSloanNotation,
  parseExtendedSloanNotation,
  type ExtendedSloanBuilderItem,
  type SloanLetter,
} from '../lib/sloanNotation';
import type { NavModuleId } from './BerandaView';
import type { TheoryLibraryTab } from './AnalisisKepribadianView';
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
  PsychosophyAspect,
  SavedPlaygroundConfig,
  SocionicsCode,
  TritypeConvention,
  UserExplorationData,
} from '../types/dynamap';
import { CelestialCornerFiligree } from './CelestialDecorations';

interface TypologyPlaygroundViewProps {
  account: Account | null;
  myProfile: Profile | null;
  exploration: UserExplorationData | null;
  onSaveExploration: (next: Partial<UserExplorationData>) => Promise<void>;
  onOpenAuth: () => void;
  onNavigate?: (moduleId: NavModuleId, options?: { theoryTab?: TheoryLibraryTab }) => void;
}

const GUEST_PLAYGROUND_KEY = 'dynamap_guest_playground_v1';

const ALL_ELEMENTS: InformationElement[] = ['Ne', 'Ni', 'Se', 'Si', 'Te', 'Ti', 'Fe', 'Fi'];

const MODEL_A_SLOTS: { pos: number; name: string; block: string; role: string }[] = [
  { pos: 1, name: 'Leading', block: 'Ego (Sadar & Kuat)', role: 'Lensa utama membaca realitas dan bertindak alami.' },
  { pos: 2, name: 'Creative', block: 'Ego (Sadar & Kuat)', role: 'Alat kreatif fleksibel mendukung fungsi Leading.' },
  { pos: 3, name: 'Role', block: 'Super-Ego (Sosial)', role: 'Adaptasi norma awal ketika bertemu situasi asing.' },
  { pos: 4, name: 'Vulnerable (PoLR)', block: 'Super-Ego (Peka)', role: 'Titik paling peka terhadap tekanan kritik terbuka.' },
  { pos: 5, name: 'Suggestive', block: 'Super-Id (Kebutuhan)', role: 'Area yang butuh dukungan hangat & membangkitkan motivasi.' },
  { pos: 6, name: 'Mobilizing', block: 'Super-Id (Kebutuhan)', role: 'Area yang diapresiasi dan memacu semangat belajar.' },
  { pos: 7, name: 'Ignoring', block: 'Id (Latar Kuat)', role: 'Kapasitas kuat tetapi dianggap kurang relevan diutamakan.' },
  { pos: 8, name: 'Demonstrative', block: 'Id (Latar Kuat)', role: 'Dijalankan otomatis secara alami tanpa mencari pujian.' },
];

export const TypologyPlaygroundView: React.FC<TypologyPlaygroundViewProps> = ({
  account,
  myProfile,
  exploration,
  onSaveExploration,
  onOpenAuth,
  onNavigate,
}) => {
  const [guestConfigs, setGuestConfigs] = useState<SavedPlaygroundConfig[]>(() => {
    try {
      const raw = localStorage.getItem(GUEST_PLAYGROUND_KEY);
      if (raw) return JSON.parse(raw) as SavedPlaygroundConfig[];
    } catch {
      // Ignore parse error
    }
    return [];
  });

  const savedConfigs = useMemo(() => {
    if (account && exploration) return exploration.playgroundConfigs || [];
    return guestConfigs;
  }, [account, exploration, guestConfigs]);

  const [activeTab, setActiveTab] = useState<
    'function-builder' | 'dichotomy' | 'enneagram' | 'psychosophy' | 'sloan' | 'temperament' | 'comparison'
  >('function-builder');
  const [saveNotice, setSaveNotice] = useState('');

  // ==================== 1. FUNCTION BUILDER STATE ====================
  const [fbSystem, setFbSystem] = useState<'socionics' | 'mbti'>('socionics');
  const [socModelSlots, setSocModelSlots] = useState<InformationElement[]>([
    ...SOCIONICS_TYPES.ILE.modelA,
  ]);
  const [mbtiSlots, setMbtiSlots] = useState<InformationElement[]>([
    ...MBTI_TYPE_STACKS.INTJ.stack,
  ]);
  const [selectedFbSlot, setSelectedFbSlot] = useState<number>(0);

  const matchedSocCode = useMemo(() => {
    const entries = Object.values(SOCIONICS_TYPES);
    const exact = entries.find((t) => t.modelA.every((el, idx) => el === socModelSlots[idx]));
    return exact || null;
  }, [socModelSlots]);

  const matchedMbtiCode = useMemo(() => {
    const entries = Object.values(MBTI_TYPE_STACKS);
    const exact = entries.find((t) => t.stack.every((el, idx) => el === mbtiSlots[idx]));
    return exact || null;
  }, [mbtiSlots]);

  // ==================== 2. DICHOTOMY EXPLORER STATE ====================
  const [poleE, setPoleE] = useState<'E' | 'I'>('I');
  const [poleN, setPoleN] = useState<'N' | 'S'>('N');
  const [poleT, setPoleT] = useState<'T' | 'F'>('T');
  const [poleJ, setPoleJ] = useState<'J' | 'P'>('J');
  const [socRational, setSocRational] = useState<'Rasional (j)' | 'Irasional (p)'>('Rasional (j)');

  const computedMbtiCode = `${poleE}${poleN}${poleT}${poleJ}`;
  const computedMbtiSpec = MBTI_TYPE_STACKS[computedMbtiCode];

  // ==================== 3. ENNEAGRAM LAB STATE ====================
  const [ennCore, setEnnCore] = useState<EnneagramCore>(5);
  const [ennWingIdx, setEnnWingIdx] = useState<0 | 1>(0);
  const [ennInstinct, setEnnInstinct] = useState<InstinctCode>('SP');
  const [ennStacking, setEnnStacking] = useState<InstinctualStacking>('SP/SO');
  const [triHeart, setTriHeart] = useState<HeartFix>(4);
  const [triHead, setTriHead] = useState<HeadFix>(5);
  const [triGut, setTriGut] = useState<GutFix>(1);
  const [triConv, setTriConv] = useState<TritypeConvention>('core-first');

  const ennSpec = ENNEAGRAM_TYPES[ennCore];
  const activeWing = ennSpec.wings[ennWingIdx];
  const tritypeResult = useMemo(
    () =>
      validateAndBuildTritype({
        core: ennCore,
        heartFix: ennSpec.center === 'Heart' ? (ennCore as HeartFix) : triHeart,
        headFix: ennSpec.center === 'Head' ? (ennCore as HeadFix) : triHead,
        gutFix: ennSpec.center === 'Gut' ? (ennCore as GutFix) : triGut,
        convention: triConv,
      }),
    [ennCore, ennSpec.center, triHeart, triHead, triGut, triConv]
  );

  // ==================== 4. PSYCHOSOPHY / AP BUILDER STATE ====================
  const [psyOrder, setPsyOrder] = useState<PsychosophyAspect[]>(['L', 'V', 'E', 'F']);
  const [psySwapIdx, setPsySwapIdx] = useState<number | null>(null);
  const psyCode = psyOrder.join('');
  const psyParsed = useMemo(() => parsePsychosophyPositions(psyCode), [psyCode]);

  // ==================== 5. SLOAN EXPLORER & EXTENDED NOTATION STATE ====================
  const [sloanScores, setSloanScores] = useState<Record<string, number>>({
    social: 42,
    limbic: 38,
    organized: 72,
    accommodating: 65,
    inquisitive: 84,
  });

  const [sloanTiers, setSloanTiers] = useState<Record<string, ExtendedSloanBuilderItem['prominence']>>({
    social: 'primary',
    limbic: 'moderate',
    organized: 'primary',
    accommodating: 'trailing',
    inquisitive: 'dominant',
  });

  const sloanCode = useMemo(
    () =>
      SLOAN_DIMENSIONS.map((d) =>
        (sloanScores[d.id] ?? 50) >= 50 ? d.highCode : d.lowCode
      ).join(''),
    [sloanScores]
  );

  const extendedSloanBuilt = useMemo(() => {
    const items: ExtendedSloanBuilderItem[] = SLOAN_DIMENSIONS.map((d) => {
      const letter = ((sloanScores[d.id] ?? 50) >= 50 ? d.highCode : d.lowCode) as SloanLetter;
      return {
        letter,
        prominence: sloanTiers[d.id] || 'primary',
      };
    });
    return buildExtendedSloanNotation(items);
  }, [sloanScores, sloanTiers]);

  const extendedSloanParsed = useMemo(
    () => parseExtendedSloanNotation(extendedSloanBuilt),
    [extendedSloanBuilt]
  );

  // ==================== 6. TEMPERAMENT LAB STATE ====================
  const [primaryTempId, setPrimaryTempId] = useState<'sanguine' | 'choleric' | 'melancholic' | 'phlegmatic'>('melancholic');
  const [secondaryTempId, setSecondaryTempId] = useState<'none' | 'sanguine' | 'choleric' | 'melancholic' | 'phlegmatic'>('phlegmatic');

  const primaryTempSpec = useMemo(
    () => CLASSICAL_4_TEMPERAMENTS.find((t) => t.id === primaryTempId) || CLASSICAL_4_TEMPERAMENTS[0],
    [primaryTempId]
  );

  const matchedMixedBlend = useMemo(() => {
    if (secondaryTempId === 'none' || secondaryTempId === primaryTempId) return null;
    const pName = primaryTempSpec.name;
    const sName = CLASSICAL_4_TEMPERAMENTS.find((t) => t.id === secondaryTempId)?.name || '';
    return (
      MIXED_6_TEMPERAMENTS.find(
        (m) =>
          (m.primary === pName && m.secondary === sName) ||
          (m.primary === sName && m.secondary === pName)
      ) || null
    );
  }, [primaryTempId, secondaryTempId, primaryTempSpec.name]);

  // ==================== 7. FRAMEWORK COMPARISON STATE ====================
  const [cmpFocusArea, setCmpFocusArea] = useState<'all' | 'cognitive' | 'behavioral'>('all');

  function handleLoadFromMyProfile() {
    if (!myProfile) return;
    if (myProfile.typology.socionics && SOCIONICS_TYPES[myProfile.typology.socionics]) {
      setSocModelSlots([...SOCIONICS_TYPES[myProfile.typology.socionics].modelA]);
    }
    if (myProfile.typology.enneagramCore) {
      setEnnCore(myProfile.typology.enneagramCore);
    }
    if (myProfile.typology.instinctVariant) {
      setEnnInstinct(myProfile.typology.instinctVariant);
    }
    if (myProfile.typology.instinctStacking) {
      setEnnStacking(myProfile.typology.instinctStacking);
    }
    if (myProfile.typology.tritypeHeart) setTriHeart(myProfile.typology.tritypeHeart);
    if (myProfile.typology.tritypeHead) setTriHead(myProfile.typology.tritypeHead);
    if (myProfile.typology.tritypeGut) setTriGut(myProfile.typology.tritypeGut);
    if (myProfile.typology.psychosophyCode && myProfile.typology.psychosophyCode.length === 4) {
      const chars = myProfile.typology.psychosophyCode.split('') as PsychosophyAspect[];
      if (chars.every((c) => ['L', 'V', 'E', 'F'].includes(c))) {
        setPsyOrder(chars);
      }
    }
    if (myProfile.typology.temperament) {
      const low = myProfile.typology.temperament.toLowerCase();
      if (low.includes('sang')) setPrimaryTempId('sanguine');
      else if (low.includes('chol') || low.includes('kol')) setPrimaryTempId('choleric');
      else if (low.includes('mel')) setPrimaryTempId('melancholic');
      else if (low.includes('phleg') || low.includes('pleg')) setPrimaryTempId('phlegmatic');
    }
    setSaveNotice(`Konfigurasi sandbox diselaraskan dengan profil "${myProfile.displayName}".`);
  }

  function handleResetCurrentTab() {
    if (activeTab === 'function-builder') {
      setSocModelSlots([...SOCIONICS_TYPES.ILE.modelA]);
      setMbtiSlots([...MBTI_TYPE_STACKS.INTJ.stack]);
      setSelectedFbSlot(0);
    } else if (activeTab === 'dichotomy') {
      setPoleE('I');
      setPoleN('N');
      setPoleT('T');
      setPoleJ('J');
    } else if (activeTab === 'enneagram') {
      setEnnCore(5);
      setEnnWingIdx(0);
      setEnnInstinct('SP');
      setEnnStacking('SP/SO');
      setTriHeart(4);
      setTriHead(5);
      setTriGut(1);
    } else if (activeTab === 'psychosophy') {
      setPsyOrder(['L', 'V', 'E', 'F']);
      setPsySwapIdx(null);
    } else if (activeTab === 'sloan') {
      setSloanScores({
        social: 50,
        limbic: 50,
        organized: 50,
        accommodating: 50,
        inquisitive: 50,
      });
      setSloanTiers({
        social: 'primary',
        limbic: 'primary',
        organized: 'primary',
        accommodating: 'primary',
        inquisitive: 'primary',
      });
    } else if (activeTab === 'temperament') {
      setPrimaryTempId('melancholic');
      setSecondaryTempId('phlegmatic');
    } else {
      setCmpFocusArea('all');
    }
    setSaveNotice('Sandbox dikembalikan ke setelan awal.');
  }

  async function persistConfigs(nextConfigs: SavedPlaygroundConfig[]) {
    if (account) {
      await onSaveExploration({ playgroundConfigs: nextConfigs });
    } else {
      setGuestConfigs(nextConfigs);
      try {
        localStorage.setItem(GUEST_PLAYGROUND_KEY, JSON.stringify(nextConfigs));
      } catch {
        // Ignore storage error
      }
    }
  }

  async function handleSaveSnapshot() {
    let title = '';
    let summary = '';
    let payload: Record<string, unknown> = {};

    if (activeTab === 'function-builder') {
      title =
        fbSystem === 'socionics'
          ? `Model A: ${socModelSlots.slice(0, 4).join('-')} (${matchedSocCode?.code || 'Kustom'})`
          : `Tumpukan MBTI: ${mbtiSlots.join('-')} (${matchedMbtiCode?.code || 'Kustom'})`;
      summary =
        fbSystem === 'socionics'
          ? `8 Fungsi: ${socModelSlots.join(' · ')}`
          : `4 Fungsi Sadar: ${mbtiSlots.join(' → ')}`;
      payload = { fbSystem, socModelSlots, mbtiSlots };
    } else if (activeTab === 'dichotomy') {
      title = `Dikotomi ${computedMbtiCode} · ${socRational}`;
      summary = computedMbtiSpec?.summary || 'Eksplorasi 4 poros dikotomi';
      payload = { poleE, poleN, poleT, poleJ, socRational };
    } else if (activeTab === 'enneagram') {
      title = `Enneagram ${activeWing.code} · ${ennStacking} · Tritype ${tritypeResult.tritypeDisplay || '-'}`;
      summary = `Pusat ${ennSpec.center} · Integrasi ke ${ennSpec.growthDirection.target}`;
      payload = { ennCore, ennWingIdx, ennInstinct, ennStacking, triHeart, triHead, triGut, triConv };
    } else if (activeTab === 'psychosophy') {
      title = `Psikosofi ${psyCode}${psyParsed.typeSpec ? ` (“${psyParsed.typeSpec.afanasyevNickname}”)` : ''}`;
      summary = `1${psyOrder[0]} · 2${psyOrder[1]} · 3${psyOrder[2]} · 4${psyOrder[3]}`;
      payload = { psyOrder };
    } else if (activeTab === 'sloan') {
      title = `SLOAN ${sloanCode} · Notasi: ${extendedSloanBuilt}`;
      summary = `S/R:${sloanScores.social} · L/C:${sloanScores.limbic} · O/U:${sloanScores.organized} · A/E:${sloanScores.accommodating} · I/N:${sloanScores.inquisitive}`;
      payload = { sloanScores, sloanTiers, extendedSloanBuilt };
    } else if (activeTab === 'temperament') {
      const secName =
        secondaryTempId === 'none' || secondaryTempId === primaryTempId
          ? 'Murni'
          : CLASSICAL_4_TEMPERAMENTS.find((t) => t.id === secondaryTempId)?.indoName || '';
      title = `Temperamen ${primaryTempSpec.indoName}${secName === 'Murni' ? '' : `–${secName}`}`;
      summary = matchedMixedBlend
        ? matchedMixedBlend.dynamicBalance
        : primaryTempSpec.learningCommunicationStyle;
      payload = { primaryTempId, secondaryTempId };
    } else {
      title = `Matriks Perbandingan Kerangka (${cmpFocusArea})`;
      summary = 'Rangkuman perbedaan metodologis 7 kerangka kepribadian & temperamen';
      payload = { cmpFocusArea };
    }

    const item: SavedPlaygroundConfig = {
      id: `pg-${Date.now()}`,
      title,
      module: activeTab,
      summary,
      payload,
      createdAt: new Date().toISOString(),
    };

    const next = [item, ...savedConfigs].slice(0, 20);
    await persistConfigs(next);
    setSaveNotice(`Konfigurasi "${title}" disimpan ke riwayat Playground.`);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <section className="relative overflow-hidden dreamy-surface border border-slate-200/80 rounded-2xl p-6 sm:p-7 space-y-4">
        <CelestialCornerFiligree tone="dark" className="w-24 h-24 opacity-40" />
        <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="space-y-2 max-w-3xl">
            <div className="text-xs font-medium text-indigo-700">
              Laboratorium Eksperimental Interaktif · Sandbox Teori
            </div>
            <h1 className="text-2xl font-display font-bold text-slate-900">
              Playground Tipologi
            </h1>
            <p className="text-sm text-slate-600 leading-relaxed">
              Uji dan amati bagaimana blok fungsi kognitif, dikotomi, motivasi Enneagram, posisi sikap
              Psikosofi (L·V·E·F), serta kontinum Big Five / SLOAN berinteraksi secara langsung.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            {myProfile && (
              <button
                type="button"
                onClick={handleLoadFromMyProfile}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-indigo-800 bg-indigo-50 border border-indigo-200 hover:bg-indigo-100 rounded-xl whitespace-nowrap"
              >
                <UserCheck className="w-3.5 h-3.5" />
                Muat dari Profil Saya
              </button>
            )}
            <button
              type="button"
              onClick={handleResetCurrentTab}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl whitespace-nowrap"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset
            </button>
            <button
              type="button"
              onClick={handleSaveSnapshot}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#151D40] hover:bg-[#233070] rounded-xl whitespace-nowrap"
            >
              <BookmarkPlus className="w-3.5 h-3.5 text-[#E6C77E]" />
              Simpan Konfigurasi
            </button>
          </div>
        </div>

        {/* Scientific vs Theoretical Methodological Note */}
        <div className="p-3.5 rounded-xl bg-amber-50/80 border border-amber-200/80 text-xs text-amber-950 leading-relaxed">
          <strong>Distingsi Metodologis:</strong> Modul Socionics, MBTI, Jungian, Enneagram, dan Psikosofi
          merupakan <em>model kerangka teoretis</em> untuk refleksi diri & dialog, sedangkan Big Five / SLOAN
          berakar pada penelitian psikometri faktor empiris. Playground ini bersifat edukatif—bukan tes diagnosis klinis.
        </div>

        {saveNotice && (
          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900">
            {saveNotice}
          </div>
        )}
      </section>

      {/* 7 Sandbox Module Tabs */}
      <div className="flex flex-wrap gap-2">
        {[
          { id: 'function-builder', label: '1. Function Builder (Model A & MBTI)', icon: Layers },
          { id: 'dichotomy', label: '2. Dichotomy Explorer', icon: Compass },
          { id: 'enneagram', label: '3. Enneagram & Tritype Lab', icon: SlidersHorizontal },
          { id: 'psychosophy', label: '4. Psikosofi / AP Builder', icon: SlidersHorizontal },
          { id: 'sloan', label: '5. SLOAN & Notasi Lanjutan', icon: SlidersHorizontal },
          { id: 'temperament', label: '6. Laboratorium Temperamen', icon: Layers },
          { id: 'comparison', label: '7. Matriks Perbandingan Kerangka', icon: Compass },
        ].map((tab) => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl border transition-colors whitespace-nowrap ${
                active
                  ? 'bg-[#151D40] text-white border-[#151D40]'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* MODULE 1: FUNCTION BUILDER */}
      {activeTab === 'function-builder' && (
        <section className="dreamy-surface border border-slate-200/80 rounded-2xl p-6 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setFbSystem('socionics');
                  setSelectedFbSlot(0);
                }}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg border ${
                  fbSystem === 'socionics'
                    ? 'bg-indigo-700 text-white border-indigo-700'
                    : 'bg-white text-slate-700 border-slate-200'
                }`}
              >
                Socionics Model A (8 Posisi)
              </button>
              <button
                type="button"
                onClick={() => {
                  setFbSystem('mbti');
                  setSelectedFbSlot(0);
                }}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg border ${
                  fbSystem === 'mbti'
                    ? 'bg-indigo-700 text-white border-indigo-700'
                    : 'bg-white text-slate-700 border-slate-200'
                }`}
              >
                MBTI Cognitive Stack (4 Posisi)
              </button>
            </div>

            {fbSystem === 'socionics' ? (
              <select
                value={matchedSocCode?.code || ''}
                onChange={(e) => {
                  const code = e.target.value as SocionicsCode;
                  if (SOCIONICS_TYPES[code]) setSocModelSlots([...SOCIONICS_TYPES[code].modelA]);
                }}
                className="px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg"
              >
                <option value="">-- Muat Preset 16 Tipe Socionics --</option>
                {(Object.keys(SOCIONICS_TYPES) as SocionicsCode[]).map((code) => (
                  <option key={code} value={code}>
                    {code} — {SOCIONICS_TYPES[code].indonesianTitle}
                  </option>
                ))}
              </select>
            ) : (
              <select
                value={matchedMbtiCode?.code || ''}
                onChange={(e) => {
                  const code = e.target.value;
                  if (MBTI_TYPE_STACKS[code]) setMbtiSlots([...MBTI_TYPE_STACKS[code].stack]);
                }}
                className="px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg"
              >
                <option value="">-- Muat Preset 16 Tipe MBTI --</option>
                {Object.keys(MBTI_TYPE_STACKS).map((code) => (
                  <option key={code} value={code}>
                    {code} — {MBTI_TYPE_STACKS[code].title}
                  </option>
                ))}
              </select>
            )}
          </div>

          {fbSystem === 'socionics' ? (
            <>
              <div className="p-4 rounded-xl bg-slate-900 text-white flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div className="text-[11px] text-[#E6C77E]">Kecocokan Struktur Model A</div>
                  <div className="text-lg font-display font-bold">
                    {matchedSocCode
                      ? `${matchedSocCode.code} · Quadra ${matchedSocCode.quadra} (${matchedSocCode.indonesianTitle})`
                      : `Konfigurasi Eksperimental Kustom (${socModelSlots.slice(0, 4).join('–')})`}
                  </div>
                </div>
                <div className="text-xs text-slate-300">
                  Klik slot di bawah lalu tukar elemen dari palet untuk mengamati pergeseran blok.
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {MODEL_A_SLOTS.map((slot, idx) => {
                  const el = socModelSlots[idx];
                  const info = INFORMATION_ELEMENTS[el];
                  const selected = selectedFbSlot === idx;
                  return (
                    <button
                      key={slot.pos}
                      type="button"
                      onClick={() => setSelectedFbSlot(idx)}
                      className={`p-3.5 rounded-xl border text-left transition-all ${
                        selected
                          ? 'bg-indigo-50 border-indigo-600 ring-2 ring-indigo-200'
                          : 'bg-white border-slate-200 hover:border-indigo-300'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium">
                        <span>{slot.pos}. {slot.name}</span>
                        <span>{slot.block.split(' ')[0]}</span>
                      </div>
                      <div className="mt-1 flex items-baseline gap-2">
                        <span className="text-xl font-display font-bold text-slate-900">{el}</span>
                        <span className="text-xs text-indigo-800 font-medium truncate">
                          {info.indonesianName.split('(')[0].trim()}
                        </span>
                      </div>
                      <p className="mt-1.5 text-[11px] text-slate-600 leading-relaxed">{slot.role}</p>
                    </button>
                  );
                })}
              </div>
            </>
          ) : (
            <>
              <div className="p-4 rounded-xl bg-slate-900 text-white flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div className="text-[11px] text-[#E6C77E]">Kecocokan Tumpukan Sadar MBTI</div>
                  <div className="text-lg font-display font-bold">
                    {matchedMbtiCode
                      ? `${matchedMbtiCode.code} — ${matchedMbtiCode.title}`
                      : `Kombinasi Kustom (${mbtiSlots.join(' – ')})`}
                  </div>
                </div>
                {matchedMbtiCode && (
                  <div className="text-xs text-indigo-200 max-w-md">{matchedMbtiCode.summary}</div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {['1. Dominant', '2. Auxiliary', '3. Tertiary', '4. Inferior'].map((label, idx) => {
                  const el = mbtiSlots[idx];
                  const selected = selectedFbSlot === idx;
                  return (
                    <button
                      key={label}
                      type="button"
                      onClick={() => setSelectedFbSlot(idx)}
                      className={`p-4 rounded-xl border text-left ${
                        selected
                          ? 'bg-indigo-50 border-indigo-600 ring-2 ring-indigo-200'
                          : 'bg-white border-slate-200 hover:border-indigo-300'
                      }`}
                    >
                      <div className="text-[11px] text-slate-500 font-medium">{label}</div>
                      <div className="text-xl font-display font-bold text-slate-900 mt-1">{el}</div>
                      <div className="text-xs text-slate-600 mt-1">
                        {INFORMATION_ELEMENTS[el].name}
                      </div>
                    </button>
                  );
                })}
              </div>
            </>
          )}

          {/* Shared Element Picker */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="text-xs font-semibold text-slate-800">
              Ubah Elemen pada Slot #{selectedFbSlot + 1} (Otomatis menukar posisi agar tidak duplikat):
            </div>
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
              {ALL_ELEMENTS.map((el) => (
                <button
                  key={el}
                  type="button"
                  onClick={() => {
                    if (fbSystem === 'socionics') {
                      const next = [...socModelSlots];
                      const prevIdx = next.indexOf(el);
                      if (prevIdx >= 0) {
                        next[prevIdx] = next[selectedFbSlot];
                      }
                      next[selectedFbSlot] = el;
                      setSocModelSlots(next);
                    } else {
                      const next = [...mbtiSlots];
                      const prevIdx = next.indexOf(el);
                      if (prevIdx >= 0) {
                        next[prevIdx] = next[selectedFbSlot];
                      }
                      next[selectedFbSlot] = el;
                      setMbtiSlots(next);
                    }
                  }}
                  className="py-2 px-3 rounded-lg bg-white border border-slate-200 hover:border-indigo-500 text-xs font-bold text-slate-900"
                >
                  {el}
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* MODULE 2: DICHOTOMY EXPLORER */}
      {activeTab === 'dichotomy' && (
        <section className="dreamy-surface border border-slate-200/80 rounded-2xl p-6 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-6 space-y-3">
              <h2 className="text-sm font-display font-bold text-slate-900">
                Eksplorasi 4 Pasang Dikotomi & Orientasi Rasionalitas
              </h2>
              {[
                {
                  title: 'Arah Energi Kognitif (Jungian/MBTI)',
                  a: 'E' as const,
                  b: 'I' as const,
                  aLabel: 'E — Ekstravert (Fokus Dunia Objek Luar)',
                  bLabel: 'I — Introvert (Fokus Struktur Subjektif Internal)',
                  val: poleE,
                  set: (v: 'E' | 'I') => setPoleE(v),
                },
                {
                  title: 'Persepsi Informasi',
                  a: 'N' as const,
                  b: 'S' as const,
                  aLabel: 'N — Intuition (Pola, Kemungkinan & Makna Abstrak)',
                  bLabel: 'S — Sensing (Fakta Konkret, Detail & Pengalaman Langsung)',
                  val: poleN,
                  set: (v: 'N' | 'S') => setPoleN(v),
                },
                {
                  title: 'Kriteria Evaluasi / Penilaian',
                  a: 'T' as const,
                  b: 'F' as const,
                  aLabel: 'T — Thinking (Koherensi Logis & Efisiensi Objektif)',
                  bLabel: 'F — Feeling (Nilai Personal, Etika & Resonansi Relasi)',
                  val: poleT,
                  set: (v: 'T' | 'F') => setPoleT(v),
                },
                {
                  title: 'Orientasi Eksternal MBTI',
                  a: 'J' as const,
                  b: 'P' as const,
                  aLabel: 'J — Judging (Menampilkan fungsi penilaian ke luar)',
                  bLabel: 'P — Perceiving (Menampilkan fungsi persepsi ke luar)',
                  val: poleJ,
                  set: (v: 'J' | 'P') => setPoleJ(v),
                },
              ].map((row) => (
                <div key={row.title} className="p-3.5 rounded-xl bg-white border border-slate-200 space-y-2">
                  <div className="text-xs font-semibold text-slate-700">{row.title}</div>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => row.set(row.a as never)}
                      className={`p-2 rounded-lg border text-xs text-left ${
                        row.val === row.a
                          ? 'bg-indigo-700 text-white border-indigo-700 font-semibold'
                          : 'bg-slate-50 text-slate-700 border-slate-200'
                      }`}
                    >
                      {row.aLabel}
                    </button>
                    <button
                      type="button"
                      onClick={() => row.set(row.b as never)}
                      className={`p-2 rounded-lg border text-xs text-left ${
                        row.val === row.b
                          ? 'bg-indigo-700 text-white border-indigo-700 font-semibold'
                          : 'bg-slate-50 text-slate-700 border-slate-200'
                      }`}
                    >
                      {row.bLabel}
                    </button>
                  </div>
                </div>
              ))}

              <div className="p-3.5 rounded-xl bg-white border border-slate-200 space-y-2">
                <div className="text-xs font-semibold text-slate-700">
                  Pembanding Notasi Socionics (Rasional vs Irasional):
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {(['Rasional (j)', 'Irasional (p)'] as const).map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setSocRational(r)}
                      className={`p-2 rounded-lg border text-xs font-medium ${
                        socRational === r
                          ? 'bg-[#151D40] text-white border-[#151D40]'
                          : 'bg-slate-50 text-slate-700 border-slate-200'
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="lg:col-span-6 space-y-4">
              <div className="p-6 rounded-2xl bg-[#101733] text-white space-y-3 border border-[#DFBE74]/35">
                <div className="text-xs text-[#E6C77E] font-medium">Sintesis Dikotomi MBTI</div>
                <div className="text-3xl font-display font-bold tracking-wide">{computedMbtiCode}</div>
                <div className="text-sm font-medium text-indigo-100">{computedMbtiSpec?.title}</div>
                <p className="text-xs text-[#C7D0EE] leading-relaxed">{computedMbtiSpec?.summary}</p>
                <div className="pt-3 border-t border-white/10 grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <div className="text-[11px] text-[#9AA6CE]">4 Fungsi Sadar</div>
                    <div className="font-semibold text-white mt-0.5">
                      {computedMbtiSpec?.stack.join(' → ')}
                    </div>
                  </div>
                  <div>
                    <div className="text-[11px] text-[#9AA6CE]">4 Fungsi Bayangan</div>
                    <div className="font-semibold text-slate-300 mt-0.5">
                      {computedMbtiSpec?.shadow.join(' · ')}
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-950 space-y-1.5">
                <div className="font-semibold">Peringatan Konversi MBTI vs Socionics ({socRational}):</div>
                <p className="leading-relaxed">
                  Dalam MBTI, huruf J/P menentukan fungsi <em>ekstrovert</em> terkuat; sedangkan dalam Socionics,
                  huruf kecil j/p menentukan apakah fungsi <em>Leading (pertama)</em> termasuk Rasional (T/F) atau
                  Irasional (N/S). Karena itu, tipe Introvert seperti INTJ (Ni–Te) di MBTI sering memetakan posisi
                  dominan berbeda dari INTj / LII (Ti–Ne) di Socionics!
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* MODULE 3: ENNEAGRAM LAB */}
      {activeTab === 'enneagram' && (
        <section className="dreamy-surface border border-slate-200/80 rounded-2xl p-6 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-5 space-y-4">
              <div>
                <div className="text-xs font-semibold text-slate-800 mb-2">1. Pilih Tipe Inti (1–9)</div>
                <div className="grid grid-cols-3 gap-2">
                  {([1, 2, 3, 4, 5, 6, 7, 8, 9] as EnneagramCore[]).map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => {
                        setEnnCore(num);
                        setEnnWingIdx(0);
                      }}
                      className={`p-2.5 rounded-xl border text-left transition-colors ${
                        ennCore === num
                          ? 'bg-[#151D40] text-white border-[#151D40]'
                          : 'bg-white text-slate-800 border-slate-200 hover:border-indigo-300'
                      }`}
                    >
                      <div className="text-sm font-display font-bold">Tipe {num}</div>
                      <div className="text-[10px] opacity-80 truncate">{ENNEAGRAM_TYPES[num].center}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="text-xs font-semibold text-slate-800 mb-2">2. Sayap (Wing) Bersebelahan</div>
                <div className="grid grid-cols-2 gap-2">
                  {ennSpec.wings.map((w, idx) => (
                    <button
                      key={w.code}
                      type="button"
                      onClick={() => setEnnWingIdx(idx as 0 | 1)}
                      className={`p-2.5 rounded-xl border text-left text-xs ${
                        ennWingIdx === idx
                          ? 'bg-indigo-700 text-white border-indigo-700 font-semibold'
                          : 'bg-white text-slate-700 border-slate-200'
                      }`}
                    >
                      {w.title}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-800 mb-1">
                    3. Insting Dominan
                  </label>
                  <select
                    value={ennInstinct}
                    onChange={(e) => setEnnInstinct(e.target.value as InstinctCode)}
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg"
                  >
                    <option value="SP">SP (Self-Preservation)</option>
                    <option value="SO">SO (Social)</option>
                    <option value="SX">SX (Sexual / One-to-One)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-800 mb-1">
                    4. Stacking Insting
                  </label>
                  <select
                    value={ennStacking}
                    onChange={(e) => setEnnStacking(e.target.value as InstinctualStacking)}
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg"
                  >
                    {(Object.keys(INSTINCT_STACKINGS) as InstinctualStacking[]).map((st) => (
                      <option key={st} value={st}>
                        {st} (blind {INSTINCT_STACKINGS[st].blind})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5">
                <div className="text-xs font-semibold text-slate-800">5. Konfigurator Tritype / Trifix</div>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <div className="text-[11px] text-slate-500 mb-1">Heart (2/3/4)</div>
                    <select
                      disabled={ennSpec.center === 'Heart'}
                      value={ennSpec.center === 'Heart' ? ennCore : triHeart}
                      onChange={(e) => setTriHeart(Number(e.target.value) as HeartFix)}
                      className="w-full px-2 py-1.5 text-xs bg-white border border-slate-300 rounded-lg disabled:bg-slate-100"
                    >
                      <option value={2}>2</option>
                      <option value={3}>3</option>
                      <option value={4}>4</option>
                    </select>
                  </div>
                  <div>
                    <div className="text-[11px] text-slate-500 mb-1">Head (5/6/7)</div>
                    <select
                      disabled={ennSpec.center === 'Head'}
                      value={ennSpec.center === 'Head' ? ennCore : triHead}
                      onChange={(e) => setTriHead(Number(e.target.value) as HeadFix)}
                      className="w-full px-2 py-1.5 text-xs bg-white border border-slate-300 rounded-lg disabled:bg-slate-100"
                    >
                      <option value={5}>5</option>
                      <option value={6}>6</option>
                      <option value={7}>7</option>
                    </select>
                  </div>
                  <div>
                    <div className="text-[11px] text-slate-500 mb-1">Gut (8/9/1)</div>
                    <select
                      disabled={ennSpec.center === 'Gut'}
                      value={ennSpec.center === 'Gut' ? ennCore : triGut}
                      onChange={(e) => setTriGut(Number(e.target.value) as GutFix)}
                      className="w-full px-2 py-1.5 text-xs bg-white border border-slate-300 rounded-lg disabled:bg-slate-100"
                    >
                      <option value={8}>8</option>
                      <option value={9}>9</option>
                      <option value={1}>1</option>
                    </select>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs pt-1">
                  <button
                    type="button"
                    onClick={() => setTriConv('core-first')}
                    className={`px-2.5 py-1 rounded border ${
                      triConv === 'core-first' ? 'bg-indigo-700 text-white border-indigo-700' : 'bg-white border-slate-200'
                    }`}
                  >
                    Inti Pertama
                  </button>
                  <button
                    type="button"
                    onClick={() => setTriConv('center-order')}
                    className={`px-2.5 py-1 rounded border ${
                      triConv === 'center-order' ? 'bg-indigo-700 text-white border-indigo-700' : 'bg-white border-slate-200'
                    }`}
                  >
                    Urutan Heart-Head-Gut
                  </button>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 space-y-4">
              <div className="p-5 rounded-2xl bg-[#101733] text-white space-y-3 border border-[#DFBE74]/35">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-xs text-[#E6C77E] font-medium">
                    Pusat {ennSpec.center} · {ennSpec.harmonic} · {ennSpec.hornevian}
                  </span>
                  <span className="text-xs text-indigo-200 tabular-nums">
                    {ennInstinct}{ennCore} · {activeWing.code} · {ennStacking} · Tritype {tritypeResult.tritypeDisplay}
                  </span>
                </div>
                <h2 className="text-xl font-display font-bold">{ennSpec.name}</h2>
                <p className="text-xs text-[#C7D0EE] leading-relaxed">{ennSpec.coreMotivation}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-white/10 text-xs">
                  <div>
                    <div className="text-[#E6C77E] font-semibold">Pengaruh Sayap ({activeWing.code})</div>
                    <p className="text-slate-200 mt-1">{activeWing.influence}</p>
                  </div>
                  <div>
                    <div className="text-[#E6C77E] font-semibold">Fokus Insting ({ennInstinct})</div>
                    <p className="text-slate-200 mt-1">{INSTINCT_VARIANTS[ennInstinct].summary}</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 space-y-1">
                  <div className="font-semibold text-emerald-950">
                    Garis Pertumbuhan → Tipe {ennSpec.growthDirection.target}
                  </div>
                  <p className="text-emerald-900 leading-relaxed">{ennSpec.growthDirection.description}</p>
                </div>
                <div className="p-4 rounded-xl bg-rose-50/70 border border-rose-200 space-y-1">
                  <div className="font-semibold text-rose-950">
                    Garis Stres → Tipe {ennSpec.stressDirection.target}
                  </div>
                  <p className="text-rose-900 leading-relaxed">{ennSpec.stressDirection.description}</p>
                </div>
              </div>

              {tritypeResult.valid && tritypeResult.interactionAnalysis && (
                <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-2 text-xs">
                  <div className="font-semibold text-slate-900">
                    Dinamika Tritype {tritypeResult.threeFix} ({tritypeResult.tritypeDisplay})
                  </div>
                  <p className="text-slate-700 leading-relaxed">{tritypeResult.interactionAnalysis.synergy}</p>
                  <p className="text-slate-600 leading-relaxed">
                    <strong>Ketegangan Internal:</strong> {tritypeResult.interactionAnalysis.internalTension}
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* MODULE 4: PSYCHOSOPHY BUILDER */}
      {activeTab === 'psychosophy' && (
        <section className="dreamy-surface border border-slate-200/80 rounded-2xl p-6 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-display font-bold text-slate-900">
                Susun 4 Posisi Sikap (Klik dua aspek untuk menukar posisi)
              </h2>
              <p className="text-xs text-slate-600">
                Memetakan orientasi Self (+/-) dan Others (+/-) pada Logika (L), Kehendak (V), Emosi (E), dan Fisika (F).
              </p>
            </div>
            <select
              value={psyCode}
              onChange={(e) => {
                const chars = e.target.value.split('') as PsychosophyAspect[];
                setPsyOrder(chars);
                setPsySwapIdx(null);
              }}
              className="px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg"
            >
              {ALL_24_PSYCHOSOPHY_TYPES.map((t) => (
                <option key={t.code} value={t.code}>
                  {t.code} — “{t.afanasyevNickname}”
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {psyOrder.map((asp, idx) => {
              const posNum = (idx + 1) as 1 | 2 | 3 | 4;
              const posMeta = PSYCHOSOPHY_POSITIONS[posNum];
              const aspMeta = PSYCHOSOPHY_ASPECTS[asp];
              const selected = psySwapIdx === idx;
              return (
                <button
                  key={`${asp}-${idx}`}
                  type="button"
                  onClick={() => {
                    if (psySwapIdx === null) {
                      setPsySwapIdx(idx);
                    } else if (psySwapIdx === idx) {
                      setPsySwapIdx(null);
                    } else {
                      const next = [...psyOrder];
                      const tmp = next[psySwapIdx];
                      next[psySwapIdx] = next[idx];
                      next[idx] = tmp;
                      setPsyOrder(next);
                      setPsySwapIdx(null);
                    }
                  }}
                  className={`p-4 rounded-xl border text-left transition-all ${
                    selected
                      ? 'bg-indigo-700 text-white border-indigo-700 ring-2 ring-indigo-300'
                      : 'bg-white text-slate-900 border-slate-200 hover:border-indigo-400'
                  }`}
                >
                  <div className={`text-[11px] font-semibold ${selected ? 'text-indigo-100' : 'text-indigo-700'}`}>
                    {posNum}{asp} · {posMeta.attitudinalPsycheTerms[0]}
                  </div>
                  <div className="text-lg font-display font-bold mt-1">
                    {aspMeta.indonesianName.split('(')[0].trim()}
                  </div>
                  <div className={`text-[11px] mt-1 ${selected ? 'text-indigo-100' : 'text-slate-600'}`}>
                    {posMeta.orientationDichotomies}
                  </div>
                </button>
              );
            })}
          </div>

          {psyParsed.valid && (
            <div className="p-5 rounded-2xl bg-[#101733] text-white space-y-2 border border-[#DFBE74]/35">
              <div className="text-xs text-[#E6C77E] font-medium">
                Sintesis Konfigurasi {psyParsed.code}
                {psyParsed.typeSpec ? ` · Julukan Afanasyev: “${psyParsed.typeSpec.afanasyevNickname}”` : ''}
              </div>
              <p className="text-xs text-[#D5DCF4] leading-relaxed">{psyParsed.interactionSynthesis}</p>
            </div>
          )}
        </section>
      )}

      {/* MODULE 5: SLOAN / BIG FIVE EXPLORER + EXTENDED NOTATION */}
      {activeTab === 'sloan' && (
        <section className="dreamy-surface border border-slate-200/80 rounded-2xl p-6 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 p-5 rounded-2xl bg-[#101733] text-white border border-[#DFBE74]/35">
            <div className="space-y-1">
              <div className="text-xs text-[#E6C77E] font-medium">
                Kode Standar Global 5 &amp; Sintesis Notasi Lanjutan
              </div>
              <div className="flex flex-wrap items-baseline gap-4">
                <span className="text-3xl font-display font-bold tracking-widest">{sloanCode}</span>
                <span className="font-mono text-lg text-indigo-200 border-l border-white/20 pl-4">
                  Notasi Lanjutan: <strong className="text-white">{extendedSloanBuilt}</strong>
                </span>
              </div>
            </div>
            <div className="space-y-2 max-w-md">
              <p className="text-xs text-[#C7D0EE] leading-relaxed">
                Geser skor tiap sumbu Big Five, lalu atur hierarki prominensi untuk menyusun notasi lanjutan komunitas
                (<code className="text-[#E6C77E]">[X]</code> utama, <code className="text-[#E6C77E]">X</code> kuat,{' '}
                <code className="text-[#E6C77E]">x</code> moderat, <code className="text-[#E6C77E]">/X</code> paling lemah).
              </p>
              {onNavigate && (
                <button
                  type="button"
                  onClick={() => onNavigate('analisis-kepribadian', { theoryTab: 'sloan' })}
                  className="text-xs font-semibold text-[#E6C77E] hover:underline"
                >
                  Pelajari Teori Big Five &amp; Notasi SLOAN →
                </button>
              )}
            </div>
          </div>

          <div className="space-y-4">
            {SLOAN_DIMENSIONS.map((dim) => {
              const val = sloanScores[dim.id] ?? 50;
              const isHigh = val >= 50;
              const activeTier = sloanTiers[dim.id] || 'primary';
              return (
                <div key={dim.id} className="p-4 rounded-xl bg-white border border-slate-200 space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <div className="text-xs font-bold text-slate-900">{dim.traitName}</div>
                      <div className="text-[11px] text-slate-500">Big Five: {dim.bigFiveDimension}</div>
                    </div>
                    <div className="text-xs font-semibold text-indigo-800 tabular-nums">
                      {isHigh ? dim.highLabel : dim.lowLabel} ({val}%)
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[11px] font-bold text-slate-600 w-6">{dim.lowCode}</span>
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={val}
                      onChange={(e) =>
                        setSloanScores((prev) => ({ ...prev, [dim.id]: Number(e.target.value) }))
                      }
                      className="flex-1 accent-indigo-700"
                    />
                    <span className="text-[11px] font-bold text-slate-600 w-6 text-right">{dim.highCode}</span>
                  </div>
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-100">
                    <p className="text-[11px] text-slate-600 flex-1 min-w-[200px]">
                      {isHigh ? dim.highDesc : dim.lowDesc}
                    </p>
                    <div className="flex flex-wrap items-center gap-1">
                      {(
                        [
                          { id: 'dominant', label: 'Utama [X]' },
                          { id: 'primary', label: 'Kuat X' },
                          { id: 'moderate', label: 'Sedang x' },
                          { id: 'trailing', label: 'Minimal /X' },
                        ] as const
                      ).map((tier) => (
                        <button
                          key={tier.id}
                          type="button"
                          onClick={() =>
                            setSloanTiers((prev) => ({ ...prev, [dim.id]: tier.id }))
                          }
                          className={`px-2 py-1 text-[10px] font-semibold rounded border ${
                            activeTier === tier.id
                              ? 'bg-indigo-700 text-white border-indigo-700'
                              : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          {tier.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {extendedSloanParsed.isValid && (
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
              <div className="font-semibold text-slate-900">
                Pembacaan Peringkat Notasi Lanjutan ({extendedSloanBuilt}):
              </div>
              <ul className="space-y-1 text-slate-700">
                {extendedSloanParsed.summaryLines.map((line, i) => (
                  <li key={i} className="tabular-nums">
                    {i + 1}. {line}
                  </li>
                ))}
              </ul>
              <p className="text-[11px] text-slate-500 pt-1">{extendedSloanParsed.academicBoundaryNote}</p>
            </div>
          )}
        </section>
      )}

      {/* MODULE 6: TEMPERAMENT LAB */}
      {activeTab === 'temperament' && (
        <section className="dreamy-surface border border-slate-200/80 rounded-2xl p-6 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-display font-bold text-slate-900">
                Laboratorium Temperamen Klasik &amp; Campuran (4 Murni + 6 Kombinasi)
              </h2>
              <p className="text-xs text-slate-600">
                Uji keseimbangan temperamen Primer dan Sekunder serta bandingkan posisi biologis Eysenck &amp; Keirsey.
              </p>
            </div>
            {onNavigate && (
              <button
                type="button"
                onClick={() => onNavigate('analisis-kepribadian', { theoryTab: 'temperament' })}
                className="px-3.5 py-2 text-xs font-semibold text-indigo-800 bg-indigo-50 border border-indigo-200 hover:bg-indigo-100 rounded-xl whitespace-nowrap"
              >
                Buka Perpustakaan Temperamen →
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            <div className="lg:col-span-5 space-y-4">
              <div className="space-y-2">
                <div className="text-xs font-semibold text-slate-800">1. Pilih Temperamen Primer</div>
                <div className="grid grid-cols-2 gap-2">
                  {CLASSICAL_4_TEMPERAMENTS.map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setPrimaryTempId(t.id)}
                      className={`p-3 rounded-xl border text-left transition-colors ${
                        primaryTempId === t.id
                          ? 'bg-[#151D40] text-white border-[#151D40]'
                          : 'bg-white text-slate-800 border-slate-200 hover:border-indigo-300'
                      }`}
                    >
                      <div className="text-sm font-display font-bold">{t.indoName}</div>
                      <div className="text-[10px] opacity-80">{t.name}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-xs font-semibold text-slate-800">2. Pilih Temperamen Sekunder (Opsional)</div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setSecondaryTempId('none')}
                    className={`p-2.5 rounded-xl border text-xs font-semibold ${
                      secondaryTempId === 'none' || secondaryTempId === primaryTempId
                        ? 'bg-indigo-700 text-white border-indigo-700'
                        : 'bg-white text-slate-700 border-slate-200'
                    }`}
                  >
                    Tunggal / Murni
                  </button>
                  {CLASSICAL_4_TEMPERAMENTS.filter((t) => t.id !== primaryTempId).map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setSecondaryTempId(t.id)}
                      className={`p-2.5 rounded-xl border text-xs font-semibold ${
                        secondaryTempId === t.id
                          ? 'bg-indigo-700 text-white border-indigo-700'
                          : 'bg-white text-slate-700 border-slate-200 hover:border-indigo-300'
                      }`}
                    >
                      + {t.indoName}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-[11px] text-amber-950 leading-relaxed">
                {TEMPERAMENT_HISTORY_AND_MODELS.medicalDisclaimer}
              </div>
            </div>

            <div className="lg:col-span-7 space-y-4">
              <div className="p-5 rounded-2xl bg-[#101733] text-white space-y-2.5 border border-[#DFBE74]/35">
                <div className="text-xs text-[#E6C77E] font-medium">
                  {matchedMixedBlend ? 'Sintesis Campuran Primer–Sekunder' : 'Profil Temperamen Klasik'}
                </div>
                <h3 className="text-xl font-display font-bold">
                  {matchedMixedBlend ? matchedMixedBlend.title : `${primaryTempSpec.indoName} (${primaryTempSpec.name})`}
                </h3>
                <p className="text-xs text-[#D5DCF4] leading-relaxed">
                  {matchedMixedBlend ? matchedMixedBlend.dynamicBalance : primaryTempSpec.learningCommunicationStyle}
                </p>
                <div className="pt-2 border-t border-white/10 text-[11px] text-indigo-200">
                  <strong>Pemetaan Empiris Eysenck (1967):</strong> {primaryTempSpec.eysenckMapping}
                </div>
              </div>

              {matchedMixedBlend ? (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-3.5 rounded-xl bg-white border border-slate-200 space-y-1">
                    <div className="font-bold text-indigo-900">Kekuatan Akademik</div>
                    <p className="text-slate-600 leading-relaxed">{matchedMixedBlend.academicStrength}</p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-white border border-slate-200 space-y-1">
                    <div className="font-bold text-amber-900">Ketegangan Internal</div>
                    <p className="text-slate-600 leading-relaxed">{matchedMixedBlend.internalTension}</p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-white border border-slate-200 space-y-1">
                    <div className="font-bold text-rose-900">Hal yang Perlu Dijaga</div>
                    <p className="text-slate-600 leading-relaxed">{matchedMixedBlend.watchOut}</p>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3.5 rounded-xl bg-white border border-slate-200 space-y-1">
                    <div className="font-bold text-emerald-900">Kekuatan Kolaborasi</div>
                    <ul className="list-disc list-inside text-slate-600 space-y-1">
                      {primaryTempSpec.teamStrengths.map((s, i) => (
                        <li key={i}>{s}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="p-3.5 rounded-xl bg-white border border-slate-200 space-y-1">
                    <div className="font-bold text-amber-900">Tantangan &amp; Dukungan</div>
                    <p className="text-slate-600 leading-relaxed">{primaryTempSpec.helpfulSupport}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* MODULE 7: FRAMEWORK COMPARISON MATRIX */}
      {activeTab === 'comparison' && (
        <section className="dreamy-surface border border-slate-200/80 rounded-2xl p-6 space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-display font-bold text-slate-900">
                Matriks Perbandingan 7 Kerangka Kepribadian &amp; Temperamen
              </h2>
              <p className="text-xs text-slate-600">
                Setiap sistem menjawab pertanyaan berbeda—hindari konversi otomatis 1-ke-1 antartipe.
              </p>
            </div>
            <div className="flex items-center gap-1.5">
              {[
                { id: 'all', label: 'Semua Kerangka (7)' },
                { id: 'cognitive', label: 'Kognitif & Persepsi' },
                { id: 'behavioral', label: 'Sifat, Motif & Energi' },
              ].map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setCmpFocusArea(opt.id as typeof cmpFocusArea)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg border ${
                    cmpFocusArea === opt.id
                      ? 'bg-indigo-700 text-white border-indigo-700'
                      : 'bg-white text-slate-700 border-slate-200'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto border border-slate-200 rounded-xl bg-white">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-700">
                  <th className="p-3 font-semibold">Kerangka</th>
                  <th className="p-3 font-semibold">Pertanyaan Utama</th>
                  <th className="p-3 font-semibold">Jenis Skala</th>
                  <th className="p-3 font-semibold">Status Metodologis</th>
                  <th className="p-3 font-semibold">Batasan Penting</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {[
                  {
                    group: 'cognitive',
                    fw: 'Tipologi Jung & MBTI',
                    tab: 'mbti' as TheoryLibraryTab,
                    question: 'Bagaimana arah energi (E/I), persepsi (S/N), penilaian (T/F), dan sikap luar (J/P)?',
                    scale: '16 Tipe Dikotomi / Tumpukan Grant-Beebe',
                    status: 'Model reflektif populer; instrumen resmi diukur melalui Form M',
                    limit: 'Tidak mengukur stabilitas emosional (Neuroticism) maupun motif dasar.',
                  },
                  {
                    group: 'cognitive',
                    fw: 'Socionics Model A',
                    tab: 'socionics' as TheoryLibraryTab,
                    question: 'Bagaimana 8 elemen informasi diproses di blok Ego, Super-Ego, Super-Id, dan Id?',
                    scale: '16 Tipe · 4 Quadra · 16 Relasi Intertipe',
                    status: 'Model struktural informasi teoretis',
                    limit: 'Huruf j/p berbeda makna dari J/P MBTI; dilarang konversi huruf secara langsung.',
                  },
                  {
                    group: 'behavioral',
                    fw: 'Big Five / Global 5 SLOAN',
                    tab: 'sloan' as TheoryLibraryTab,
                    question: 'Seberapa tinggi kecenderungan sifat teramati pada 5 spektrum independen?',
                    scale: 'Kontinum Persentil (FFM) + Kode 32 Biner / Notasi [X]/x/',
                    status: 'Didukung luas psikologi psikometri empiris (Goldberg, 1990; Costa & McCrae, 1992)',
                    limit: 'Binerisasi 5 huruf memampatkan skor tengah; notasi [X]/x/ bersifat konvensi komunitas.',
                  },
                  {
                    group: 'behavioral',
                    fw: 'Enneagram, Insting & Tritype',
                    tab: 'enneagram' as TheoryLibraryTab,
                    question: 'Apa ketakutan inti, motivasi emosional, dan strategi pertahanan diri (SP/SO/SX)?',
                    scale: '9 Tipe Inti · Sayap · 6 Stacking · Trifix 27 Variasi',
                    status: 'Kerangka psikodinamika & refleksi motivasi',
                    limit: 'Bukan ukuran kecerdasan atau kebiasaan terstruktur harian.',
                  },
                  {
                    group: 'cognitive',
                    fw: 'Psikosofi (L·V·E·F)',
                    tab: null,
                    question: 'Bagaimana posisi keyakinan Diri (+/-) & Orang Lain (+/-) pada Logika, Kehendak, Emosi, Fisika?',
                    scale: '24 Tipe Urutan Sikap (1–4)',
                    status: 'Kerangka relasional-filosofis A. Afanasyev',
                    limit: 'Huruf F = Physics (bukan Feeling MBTI); E = Emotion (bukan Extraversion).',
                  },
                  {
                    group: 'behavioral',
                    fw: 'Temperamen Klasik & Modern',
                    tab: 'temperament' as TheoryLibraryTab,
                    question: 'Bagaimana kecepatan respons, regulasi emosi, dan gaya kolaborasi alami seseorang?',
                    scale: '4 Klasik + 6 Campuran + Kontinum Eysenck / Keirsey SP-SJ-NF-NT',
                    status: 'Teori humor kuno bersifat historis; Eysenck & Thomas-Chess berdasar empiris',
                    limit: '4 humor cairan tubuh bukan ilmu kedokteran modern; label Keirsey berbeda dari Galen.',
                  },
                ]
                  .filter((row) => cmpFocusArea === 'all' || row.group === cmpFocusArea)
                  .map((row) => (
                    <tr key={row.fw} className="hover:bg-slate-50/70">
                      <td className="p-3 font-bold text-slate-900 whitespace-nowrap">
                        <div>{row.fw}</div>
                        {onNavigate && row.tab && (
                          <button
                            type="button"
                            onClick={() => onNavigate('analisis-kepribadian', { theoryTab: row.tab! })}
                            className="text-[11px] font-medium text-indigo-700 hover:underline mt-0.5"
                          >
                            Buka Teori →
                          </button>
                        )}
                      </td>
                      <td className="p-3">{row.question}</td>
                      <td className="p-3">{row.scale}</td>
                      <td className="p-3">{row.status}</td>
                      <td className="p-3 text-slate-600">{row.limit}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700">
            Catatan Tambahan: Koleksi 16 profil MBTI lengkap ({ALL_16_MBTI_PROFILES.length} entri) juga dapat dijelajahi
            secara terstruktur beserta daftar pustaka terverifikasi di modul <strong>Analisis Kepribadian</strong>.
          </div>
        </section>
      )}

      {/* SAVED CONFIGURATIONS DRAWER */}
      {savedConfigs.length > 0 && (
        <section className="dreamy-surface border border-slate-200/80 rounded-2xl p-5 space-y-3">
          <h2 className="text-sm font-display font-bold text-slate-900">
            Konfigurasi Sandbox Tersimpan ({savedConfigs.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {savedConfigs.map((cfg) => (
              <div
                key={cfg.id}
                className="p-3.5 rounded-xl bg-white border border-slate-200 flex items-start justify-between gap-2"
              >
                <div className="min-w-0">
                  <div className="text-xs font-bold text-slate-900 truncate">{cfg.title}</div>
                  <div className="text-[11px] text-slate-600 line-clamp-2 mt-0.5">{cfg.summary}</div>
                </div>
                <button
                  type="button"
                  aria-label="Hapus konfigurasi tersimpan"
                  onClick={() => persistConfigs(savedConfigs.filter((c) => c.id !== cfg.id))}
                  className="p-1 text-slate-400 hover:text-rose-600 shrink-0"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      {!account && (
        <div className="text-xs text-slate-500 flex items-center justify-between px-2">
          <span>Konfigurasi Playground tamu tersimpan di browser ini.</span>
          <button type="button" onClick={onOpenAuth} className="text-indigo-700 font-semibold hover:underline">
            Masuk untuk Sinkronisasi Akun
          </button>
        </div>
      )}
    </div>
  );
};
