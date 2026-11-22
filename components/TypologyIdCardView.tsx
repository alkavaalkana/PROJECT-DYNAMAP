import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowDown,
  ArrowUp,
  BookmarkPlus,
  Check,
  Download,
  Eye,
  EyeOff,
  FlipHorizontal2,
  IdCard,
  ImagePlus,
  Layers,
  Palette,
  RefreshCw,
  RotateCcw,
  Save,
  Trash2,
  Type,
  UserCheck,
} from 'lucide-react';
import { prefersReducedMotion } from '../hooks/useUiEnhancements';
import { buildCssGradient } from '../lib/colorUtils';
import {
  ID_CARD_ACCENT_PRESETS,
  ID_CARD_THEMES,
  exportTypologyIdCardPng,
  extractCardProfileData,
  getCardFontFamilies,
} from '../lib/idCardExport';
import type {
  Account,
  Profile,
  TypologyIdCardConfig,
  TypologyIdCardFieldKey,
  TypologyIdCardFont,
  TypologyIdCardLayout,
  TypologyIdCardTemplatePreset,
  TypologyIdCardTexture,
  TypologyIdCardTheme,
  UserExplorationData,
} from '../types/dynamap';
import { InteractiveColorPicker, MultiStopGradientEditor } from './AdvancedColorEditor';
import type { NavModuleId } from './BerandaView';

interface TypologyIdCardViewProps {
  account: Account | null;
  myProfile: Profile | null;
  profiles: Profile[];
  exploration: UserExplorationData | null;
  onSaveExploration: (next: Partial<UserExplorationData>) => Promise<void>;
  onNavigate: (moduleId: NavModuleId) => void;
  onOpenAuth: () => void;
}

const ALL_FIELD_TOGGLES: { key: TypologyIdCardFieldKey; label: string }[] = [
  { key: 'socionics', label: 'Socionics' },
  { key: 'quadra', label: 'Quadra' },
  { key: 'mbti', label: 'MBTI & Stack Kognitif' },
  { key: 'jungian', label: 'Tipologi Jung' },
  { key: 'enneagram', label: 'Enneagram & Sayap' },
  { key: 'instincts', label: 'Insting & Stacking' },
  { key: 'tritype', label: 'Tritype / Trifix' },
  { key: 'psychosophy', label: 'Psikosofi (L·V·E·F)' },
  { key: 'temperament', label: 'Temperamen' },
  { key: 'sloan', label: 'Big Five / SLOAN Standar' },
  { key: 'sloanExtended', label: 'Notasi SLOAN Lanjutan ([X]xx/X)' },
  { key: 'custom', label: 'Catatan Kerangka Lain' },
  { key: 'updatedAt', label: 'Tanggal Pembaruan' },
];

const DEFAULT_CARD_CONFIG: TypologyIdCardConfig = {
  theme: 'modern',
  accentColor: '#2C3C8C',
  layout: 'editorial',
  primarySpotlight: 'auto',
  showAvatar: true,
  showProfileId: true,
  tagline: 'Memahami perbedaan, memetakan koneksi.',
  visibleFields: ['socionics', 'mbti', 'quadra', 'enneagram', 'instincts', 'psychosophy', 'sloan', 'temperament'],
  fontStyle: 'editorial-mix',
  textScale: 1,
  textAlign: 'left',
  cardPaddingScale: 1,
  texture: 'constellation',
  borderStyle: 'hairline',
  shadowDepth: 'deep',
  showDecorations: true,
  customGradient: {
    enabled: false,
    angle: 135,
    stops: [
      { id: 'c1', color: '#EEF1FB', position: 0 },
      { id: 'c2', color: '#DCE4FA', position: 100 },
    ],
  },
  avatarPositionX: 50,
  avatarPositionY: 50,
  avatarZoom: 1,
  backSummaryTitle: 'Ringkasan Eksplorasi Belajar & Interpersonal',
  backSummaryNotes: '',
  showAcademicInterestsOnBack: true,
  showValuesOnBack: true,
  fieldOverrides: {},
  skipRevealAnimation: false,
  updatedAt: '2026-01-01T00:00:00.000Z',
};

const GUEST_CARD_TEMPLATES_KEY = 'dynamap_guest_card_templates_v1';

export const TypologyIdCardView: React.FC<TypologyIdCardViewProps> = ({
  account,
  myProfile,
  profiles,
  exploration,
  onSaveExploration,
  onNavigate,
  onOpenAuth,
}) => {
  const publicProfiles = useMemo(() => profiles.filter((p) => !p.archived), [profiles]);

  const [selectedProfileId, setSelectedProfileId] = useState<string>(
    myProfile?.id || publicProfiles[0]?.id || ''
  );

  useEffect(() => {
    if (myProfile?.id) {
      setSelectedProfileId(myProfile.id);
    } else if (!selectedProfileId && publicProfiles[0]?.id) {
      setSelectedProfileId(publicProfiles[0].id);
    }
  }, [myProfile?.id, publicProfiles, selectedProfileId]);

  const activeProfile = useMemo(
    () =>
      (myProfile && selectedProfileId === myProfile.id
        ? myProfile
        : publicProfiles.find((p) => p.id === selectedProfileId)) ||
      myProfile ||
      publicProfiles[0] ||
      null,
    [myProfile, publicProfiles, selectedProfileId]
  );

  const [config, setConfig] = useState<TypologyIdCardConfig>(() => {
    if (exploration?.idCardConfig) return { ...DEFAULT_CARD_CONFIG, ...exploration.idCardConfig };
    try {
      const local = localStorage.getItem('dynamap_id_card_config');
      if (local) return { ...DEFAULT_CARD_CONFIG, ...JSON.parse(local) };
    } catch {
      // ignore invalid storage
    }
    return DEFAULT_CARD_CONFIG;
  });

  useEffect(() => {
    if (exploration?.idCardConfig) {
      setConfig({ ...DEFAULT_CARD_CONFIG, ...exploration.idCardConfig });
    }
  }, [exploration?.idCardConfig]);

  const [guestTemplates, setGuestTemplates] = useState<TypologyIdCardTemplatePreset[]>(() => {
    try {
      const raw = localStorage.getItem(GUEST_CARD_TEMPLATES_KEY);
      if (raw) return JSON.parse(raw) as TypologyIdCardTemplatePreset[];
    } catch {
      // Ignore parse error
    }
    return [];
  });

  const savedTemplates = useMemo(
    () =>
      account && exploration?.customIdCardTemplates
        ? exploration.customIdCardTemplates
        : guestTemplates,
    [account, exploration?.customIdCardTemplates, guestTemplates]
  );

  // 3D Reveal & Front/Back State
  const [revealed, setRevealed] = useState<boolean>(() =>
    Boolean(config.skipRevealAnimation || prefersReducedMotion())
  );
  const [cardSide, setCardSide] = useState<'front' | 'back'>('front');
  const [studioTab, setStudioTab] = useState<'style' | 'typography' | 'fields' | 'back-templates'>('style');
  const [colorEditTarget, setColorEditTarget] = useState<'accent' | 'card' | 'text' | 'border' | 'decor'>('accent');
  const [newTemplateName, setNewTemplateName] = useState('');

  const [exporting, setExporting] = useState(false);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const stageContainerRef = useRef<HTMLDivElement | null>(null);
  const [stageWidth, setStageWidth] = useState<number>(600);

  useEffect(() => {
    const el = stageContainerRef.current;
    if (!el) return;
    const updateWidth = () => {
      const next = el.clientWidth;
      if (next > 0) setStageWidth(next);
    };
    updateWidth();
    if (typeof ResizeObserver !== 'undefined') {
      const ro = new ResizeObserver(updateWidth);
      ro.observe(el);
      return () => ro.disconnect();
    }
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  const mobileLogicalWidth = 560;
  const mobileScale = stageWidth > 0 && stageWidth < mobileLogicalWidth ? stageWidth / mobileLogicalWidth : 1;
  const isScaledMobile = mobileScale < 1;
  const scaledHeightPx = Math.round((mobileLogicalWidth / 1.6) * mobileScale);

  const theme = ID_CARD_THEMES[config.theme] || ID_CARD_THEMES.modern;
  const accent = config.accentColor || theme.defaultAccent;
  const textPrimary = config.customTextPrimary || theme.textPrimary;
  const borderCol = config.customBorderColor || theme.surfaceBorder;
  const decorCol = config.customDecorativeColor || accent;
  const fonts = getCardFontFamilies(config.fontStyle);
  const textScale = config.textScale || 1;
  const padScale = config.cardPaddingScale || 1;

  const extracted = useMemo(() => {
    if (!activeProfile) return null;
    return extractCardProfileData(activeProfile, config);
  }, [activeProfile, config]);

  function toggleField(key: TypologyIdCardFieldKey) {
    setConfig((prev) => {
      const exists = prev.visibleFields.includes(key);
      const nextFields = exists
        ? prev.visibleFields.filter((f) => f !== key)
        : [...prev.visibleFields, key];
      return { ...prev, visibleFields: nextFields };
    });
  }

  function moveField(key: TypologyIdCardFieldKey, dir: -1 | 1) {
    setConfig((prev) => {
      const idx = prev.visibleFields.indexOf(key);
      if (idx === -1) return prev;
      const targetIdx = idx + dir;
      if (targetIdx < 0 || targetIdx >= prev.visibleFields.length) return prev;
      const copy = [...prev.visibleFields];
      const [item] = copy.splice(idx, 1);
      copy.splice(targetIdx, 0, item);
      return { ...prev, visibleFields: copy };
    });
  }

  function handleThemeChange(themeId: TypologyIdCardTheme) {
    const pal = ID_CARD_THEMES[themeId];
    setConfig((prev) => ({
      ...prev,
      theme: themeId,
      accentColor: pal.defaultAccent,
      customCardBg: undefined,
      customTextPrimary: undefined,
      customBorderColor: undefined,
      customDecorativeColor: undefined,
      customGradient: {
        enabled: false,
        angle: 135,
        stops: [
          { id: 'c1', color: pal.bgStart, position: 0 },
          { id: 'c2', color: pal.bgEnd, position: 100 },
        ],
      },
    }));
  }

  function handleCustomImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      setErrorMsg('Ukuran gambar kustom maksimal 2 MB.');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setConfig((prev) => ({
        ...prev,
        showAvatar: true,
        customImageUrl: reader.result as string,
      }));
      setFeedback('Foto / gambar kustom diterapkan pada pratinjau kartu.');
    };
    reader.readAsDataURL(file);
  }

  async function handleSavePreferences() {
    setSaving(true);
    setFeedback('');
    setErrorMsg('');
    const nextConfig: TypologyIdCardConfig = {
      ...config,
      updatedAt: new Date().toISOString(),
    };
    try {
      localStorage.setItem('dynamap_id_card_config', JSON.stringify(nextConfig));
      if (account) {
        await onSaveExploration({ idCardConfig: nextConfig });
        setFeedback('Preferensi Kartu ID berhasil disimpan ke akun Anda.');
      } else {
        setFeedback('Preferensi Kartu ID disimpan di peramban ini.');
      }
    } catch {
      setErrorMsg('Gagal menyimpan preferensi kartu.');
    } finally {
      setSaving(false);
    }
  }

  async function handleSaveCustomTemplate() {
    const title = newTemplateName.trim() || `Templat Kartu ${savedTemplates.length + 1}`;
    const preset: TypologyIdCardTemplatePreset = {
      id: `tpl-${Date.now()}`,
      name: title,
      config: { ...config, updatedAt: new Date().toISOString() },
      createdAt: new Date().toISOString(),
    };
    const nextList = [preset, ...savedTemplates].slice(0, 12);
    setNewTemplateName('');
    if (account) {
      await onSaveExploration({ customIdCardTemplates: nextList });
    } else {
      setGuestTemplates(nextList);
      try {
        localStorage.setItem(GUEST_CARD_TEMPLATES_KEY, JSON.stringify(nextList));
      } catch {
        // Ignore storage error
      }
    }
    setFeedback(`Templat "${title}" disimpan ke koleksi Anda.`);
  }

  async function handleDeleteTemplate(id: string) {
    const nextList = savedTemplates.filter((t) => t.id !== id);
    if (account) {
      await onSaveExploration({ customIdCardTemplates: nextList });
    } else {
      setGuestTemplates(nextList);
      try {
        localStorage.setItem(GUEST_CARD_TEMPLATES_KEY, JSON.stringify(nextList));
      } catch {
        // Ignore storage error
      }
    }
  }

  async function handleExportPng(sideToExport: 'front' | 'back') {
    if (!activeProfile) return;
    setExporting(true);
    setErrorMsg('');
    setFeedback('');
    try {
      await exportTypologyIdCardPng(activeProfile, config, sideToExport);
      setFeedback(
        `Kartu ID Tipologi sisi ${sideToExport === 'front' ? 'depan' : 'belakang'} (1600×1000 PNG) berhasil diunduh.`
      );
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Gagal mengekspor gambar PNG.');
    } finally {
      setExporting(false);
    }
  }

  function handleRevealCard() {
    setCardSide('front');
    setRevealed(true);
  }

  if (!activeProfile || !extracted) {
    return (
      <div className="dreamy-surface border border-slate-200 rounded-2xl p-8 text-center space-y-4">
        <IdCard className="w-8 h-8 text-indigo-700 mx-auto" />
        <h1 className="text-2xl font-display font-bold text-slate-900">Kartu ID Tipologi</h1>
        <p className="text-sm text-slate-600 max-w-md mx-auto">
          Belum ada data profil yang tersedia untuk membuat Kartu Identitas Tipologi.
        </p>
      </div>
    );
  }

  const visibleFieldsRendered = extracted.fields.slice(0, 8);
  const gridColsClass =
    config.layout === 'crest' && visibleFieldsRendered.length <= 4 ? 'grid-cols-2' : 'grid-cols-4';
  const initials = extracted.displayName
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() || '')
    .join('');

  const customGradientCss = buildCssGradient(config.customGradient);
  const cardSurfaceStyle: React.CSSProperties = {
    backgroundImage:
      customGradientCss ||
      (!config.customCardBg
        ? `linear-gradient(135deg, ${theme.bgStart} 0%, ${theme.bgMid} 55%, ${theme.bgEnd} 100%)`
        : undefined),
    backgroundColor: config.customCardBg || undefined,
    color: textPrimary,
    fontFamily: fonts.body,
    padding: `${Math.round(28 * padScale)}px`,
  };

  const cardShadowClass =
    config.shadowDepth === 'flat'
      ? 'shadow-sm'
      : config.shadowDepth === 'soft'
      ? 'shadow-[0_14px_34px_-18px_rgba(16,23,51,0.28)]'
      : 'shadow-[0_26px_64px_-22px_rgba(16,23,51,0.42)]';

  const avatarImageSrc = config.customImageUrl || activeProfile.photoUrl || '';

  return (
    <div className="space-y-8 dm-view-enter">
      {/* Header Banner */}
      <section className="dreamy-surface border border-slate-200/90 rounded-2xl p-6 sm:p-7 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-wider text-indigo-700">
            <span className="w-5 h-px bg-[#C9A65B]" aria-hidden="true" />
            <span>Identitas Digital Lanskap · Rasio 1.6 : 1 · Depan &amp; Belakang</span>
          </div>
          <h1 className="mt-1.5 text-2xl sm:text-3xl font-display font-bold text-slate-900">
            Generator Kartu ID Tipologi
          </h1>
          <p className="text-sm text-slate-600 mt-1 max-w-2xl">
            Tarik profil terbaru secara otomatis (termasuk MBTI, SLOAN Standar/Lanjutan, dan Temperamen),
            susun ulang bidang, sesuaikan warna &amp; tipografi, lalu balik kartu 3D sebelum mengunduh PNG.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          {myProfile ? (
            <button
              type="button"
              onClick={() => onNavigate('profil-saya')}
              className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors whitespace-nowrap"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Perbarui Profil Saya
            </button>
          ) : (
            <button
              type="button"
              onClick={onOpenAuth}
              className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors whitespace-nowrap"
            >
              <UserCheck className="w-3.5 h-3.5" />
              Masuk Kartu Pribadi
            </button>
          )}
          <button
            type="button"
            onClick={() => handleExportPng('front')}
            disabled={exporting || Boolean(activeProfile.hiddenFieldsForViewer?.includes('idCard'))}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-medium text-white bg-[#151D40] hover:bg-[#233070] rounded-lg transition-colors shadow-xs disabled:opacity-50 whitespace-nowrap"
          >
            <Download className="w-4 h-4 text-[#DFBE74]" />
            {exporting ? 'Menyiapkan PNG...' : 'Unduh Sisi Depan (PNG)'}
          </button>
          <button
            type="button"
            onClick={() => handleExportPng('back')}
            disabled={exporting || Boolean(activeProfile.hiddenFieldsForViewer?.includes('idCard'))}
            className="inline-flex items-center gap-2 px-3.5 py-2.5 text-xs font-medium text-indigo-900 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-lg transition-colors disabled:opacity-50 whitespace-nowrap"
          >
            <Download className="w-3.5 h-3.5" />
            Unduh Sisi Belakang
          </button>
        </div>
      </section>

      {(feedback || errorMsg) && (
        <div
          className={`rounded-xl px-4 py-3 text-xs border ${
            errorMsg
              ? 'bg-red-50 border-red-200 text-red-900'
              : 'bg-emerald-50 border-emerald-200 text-emerald-950'
          }`}
        >
          {errorMsg || feedback}
        </div>
      )}

      {(activeProfile.hiddenFieldsForViewer?.includes('idCard') ||
        activeProfile.hiddenFieldsForViewer?.includes('typology')) && (
        <div className="rounded-xl px-4 py-3 text-xs bg-amber-50 border border-amber-200 text-amber-950">
          <strong>Perlindungan Privasi Pemilik Profil:</strong>{' '}
          {activeProfile.hiddenFieldsForViewer?.includes('idCard')
            ? 'Pemilik profil membatasi akses Kartu ID Tipologi untuk audiens Anda; ekspor PNG dinonaktifkan dan konten kartu disamarkan.'
            : 'Pemilik profil membatasi visibilitas tipe kepribadiannya sehingga kolom tipologi pada kartu ditampilkan terbatas.'}
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-7 items-start">
        {/* LIVE 3D LANDSCAPE ID CARD PREVIEW (Left/Top 7 Cols) */}
        <div className="xl:col-span-7 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              {!revealed ? (
                <button
                  type="button"
                  onClick={handleRevealCard}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold text-white bg-indigo-700 hover:bg-indigo-800 shadow-xs transition-colors whitespace-nowrap"
                >
                  <FlipHorizontal2 className="w-3.5 h-3.5" />
                  Buat &amp; Balik Kartu (3D Reveal)
                </button>
              ) : (
                <>
                  <div className="inline-flex rounded-lg border border-slate-200 bg-white p-0.5 text-xs">
                    <button
                      type="button"
                      onClick={() => setCardSide('front')}
                      className={`px-3 py-1.5 rounded-md font-medium transition-colors whitespace-nowrap ${
                        cardSide === 'front'
                          ? 'bg-[#151D40] text-white'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Sisi Depan
                    </button>
                    <button
                      type="button"
                      onClick={() => setCardSide('back')}
                      className={`px-3 py-1.5 rounded-md font-medium transition-colors whitespace-nowrap ${
                        cardSide === 'back'
                          ? 'bg-[#151D40] text-white'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Sisi Belakang
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => setRevealed(false)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 whitespace-nowrap"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    Tutup Kembali
                  </button>
                </>
              )}

              <label className="inline-flex items-center gap-1.5 text-xs text-slate-600 cursor-pointer ml-1">
                <input
                  type="checkbox"
                  checked={Boolean(config.skipRevealAnimation)}
                  onChange={(e) => {
                    const skip = e.target.checked;
                    setConfig((prev) => ({ ...prev, skipRevealAnimation: skip }));
                    if (skip) setRevealed(true);
                  }}
                  className="rounded border-slate-300 text-indigo-700"
                />
                <span>Lewati Animasi</span>
              </label>
            </div>

            <div className="flex items-center gap-2">
              <label htmlFor="idcard-profile-select" className="text-xs text-slate-500">
                Profil:
              </label>
              <select
                id="idcard-profile-select"
                value={activeProfile.id}
                onChange={(e) => setSelectedProfileId(e.target.value)}
                className="text-xs px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white text-slate-800 max-w-[200px]"
              >
                {myProfile && (
                  <option value={myProfile.id}>Profil Saya — {myProfile.displayName}</option>
                )}
                {publicProfiles
                  .filter((p) => p.id !== myProfile?.id)
                  .map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.displayName} ({p.category})
                    </option>
                  ))}
              </select>
            </div>
          </div>

          {/* 3D Perspective Stage */}
          <div
            ref={stageContainerRef}
            className="w-full"
            style={isScaledMobile ? { height: `${scaledHeightPx + 10}px` } : undefined}
          >
            <div
              className={isScaledMobile ? 'card-3d-scene' : 'w-full pb-2 card-3d-scene'}
              style={
                isScaledMobile
                  ? {
                      width: `${mobileLogicalWidth}px`,
                      transform: `scale(${mobileScale})`,
                      transformOrigin: 'top left',
                    }
                  : undefined
              }
            >
              <div
                className={`card-3d-inner relative w-full min-w-[540px] aspect-[1.6/1] ${
                  revealed ? 'is-flipped' : ''
                }`}
              >
              {/* FACE 0: INITIAL CONCEALED CELESTIAL COVER (Pre-Reveal) */}
              <div
                onClick={handleRevealCard}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') handleRevealCard();
                }}
                aria-label="Klik untuk membuka dan membalik Kartu ID Tipologi"
                className={`card-3d-face absolute inset-0 rounded-3xl overflow-hidden ${cardShadowClass} flex flex-col items-center justify-center p-8 cursor-pointer select-none bg-[#101733] text-[#F4F6FD] border border-[#DFBE74]/40`}
                style={{
                  backgroundImage:
                    'radial-gradient(circle at 75% 25%, rgba(112, 134, 222, 0.25), transparent 55%), linear-gradient(135deg, #0D1330 0%, #17214F 60%, #1F2D6B 100%)',
                }}
              >
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-4 rounded-2xl border border-[#DFBE74]/35"
                />
                <div className="w-16 h-16 rounded-full border-2 border-[#DFBE74]/70 bg-white/5 flex items-center justify-center mb-4">
                  <svg
                    viewBox="0 0 24 24"
                    className="w-7 h-7 text-[#E6C77E]"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    aria-hidden="true"
                  >
                    <circle cx="12" cy="12" r="8.5" strokeOpacity="0.45" />
                    <path d="M14.5 5.5a6.5 6.5 0 1 0 4 11.5 5.5 5.5 0 0 1-4-11.5Z" />
                  </svg>
                </div>
                <div className="font-display font-bold text-2xl tracking-tight text-white">
                  DYNAMAP IDENTITY CARD
                </div>
                <p className="text-xs text-[#C2CCEE] mt-1.5 text-center max-w-md">
                  Profil siap untuk {extracted.displayName}. Klik di sini atau tekan tombol Buat &amp; Balik Kartu untuk membuka pratinjau penuh.
                </p>
                <div className="mt-5 px-4 py-2 rounded-lg bg-white/10 border border-[#DFBE74]/45 text-xs font-medium text-[#F6E4B4]">
                  Klik untuk Membalik Kartu 180°
                </div>
              </div>

              {/* FACE 1: ACTIVE CUSTOMIZED FRONT OR BACK CARD */}
              <div
                className={`card-3d-face card-3d-face-front absolute inset-0 rounded-3xl overflow-hidden ${cardShadowClass} select-none flex flex-col justify-between`}
                style={cardSurfaceStyle}
              >
                {/* Texture Overlay */}
                {config.texture === 'dots' && (
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 opacity-20"
                    style={{
                      backgroundImage: `radial-gradient(${decorCol} 1.3px, transparent 1.3px)`,
                      backgroundSize: '20px 20px',
                    }}
                  />
                )}
                {config.texture === 'grid' && (
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 opacity-15"
                    style={{
                      backgroundImage: `linear-gradient(to right, ${decorCol} 1px, transparent 1px), linear-gradient(to bottom, ${decorCol} 1px, transparent 1px)`,
                      backgroundSize: '28px 28px',
                    }}
                  />
                )}
                {config.texture === 'linen' && (
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 opacity-15"
                    style={{
                      backgroundImage: `repeating-linear-gradient(45deg, ${decorCol} 0px, ${decorCol} 1px, transparent 1px, transparent 10px)`,
                    }}
                  />
                )}

                {/* Celestial Ambient Glow & Orbital SVG Filigree */}
                {config.showDecorations !== false && (
                  <>
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute -top-16 -right-16 w-72 h-72 rounded-full blur-2xl"
                      style={{ backgroundColor: decorCol, opacity: theme.isDark ? 0.22 : 0.14 }}
                    />
                    <svg
                      viewBox="0 0 360 360"
                      className="pointer-events-none absolute -top-10 -right-10 w-64 h-64 opacity-30"
                      fill="none"
                      aria-hidden="true"
                    >
                      <circle cx="200" cy="150" r="110" stroke={decorCol} strokeWidth="1.2" />
                      <circle cx="200" cy="150" r="145" stroke={decorCol} strokeWidth="1" strokeDasharray="4 6" />
                      <circle cx="200" cy="150" r="76" stroke={decorCol} strokeWidth="0.9" />
                    </svg>
                  </>
                )}

                {/* Border Style Frame */}
                {config.borderStyle !== 'none' && (
                  <div
                    aria-hidden="true"
                    className={`pointer-events-none absolute inset-3 rounded-[20px] ${
                      config.borderStyle === 'double'
                        ? 'border-2 outline outline-1 outline-offset-4'
                        : config.borderStyle === 'glow'
                        ? 'border-2'
                        : 'border'
                    }`}
                    style={{
                      borderColor: borderCol,
                      outlineColor: config.borderStyle === 'double' ? borderCol : undefined,
                      boxShadow:
                        config.borderStyle === 'glow' ? `0 0 18px -4px ${decorCol}` : undefined,
                    }}
                  />
                )}

                {cardSide === 'front' ? (
                  <>
                    {/* FRONT: Top Card Header */}
                    <div
                      className="relative z-10 flex items-center justify-between pb-3 border-b"
                      style={{ borderColor: borderCol }}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-9 h-9 rounded-full border flex items-center justify-center shrink-0"
                          style={{ borderColor: accent, backgroundColor: theme.surfaceBg }}
                        >
                          <svg
                            viewBox="0 0 24 24"
                            className="w-4 h-4"
                            fill="none"
                            stroke={accent}
                            strokeWidth="1.7"
                            aria-hidden="true"
                          >
                            <circle cx="12" cy="12" r="8.5" strokeOpacity="0.55" />
                            <path d="M14.5 5.5a6.5 6.5 0 1 0 4 11.5 5.5 5.5 0 0 1-4-11.5Z" />
                          </svg>
                        </div>
                        <div>
                          <div
                            className="font-bold leading-none tracking-tight"
                            style={{ fontFamily: fonts.display, fontSize: `${Math.round(18 * textScale)}px` }}
                          >
                            DYNAMAP
                          </div>
                          <div
                            className="text-[10px] font-medium tracking-wider mt-0.5"
                            style={{ color: theme.textSecondary }}
                          >
                            KARTU IDENTITAS TIPOLOGI
                          </div>
                        </div>
                      </div>
                      {config.showProfileId && (
                        <div
                          className="text-xs font-semibold tabular-nums"
                          style={{ color: theme.textSecondary, fontFamily: fonts.mono }}
                        >
                          ID · {extracted.profileId}
                        </div>
                      )}
                    </div>

                    {/* FRONT: Identity + Primary Spotlight */}
                    <div className="relative z-10 flex items-center justify-between gap-4 my-auto py-3">
                      <div className="flex items-center gap-4 min-w-0 flex-1">
                        {config.showAvatar && (
                          avatarImageSrc ? (
                            <div
                              className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden shrink-0 border-2"
                              style={{ borderColor: accent }}
                            >
                              <img
                                src={avatarImageSrc}
                                alt={extracted.displayName}
                                referrerPolicy="no-referrer"
                                className="w-full h-full object-cover"
                                style={{
                                  objectPosition: `${config.avatarPositionX ?? 50}% ${
                                    config.avatarPositionY ?? 50
                                  }%`,
                                  transform: `scale(${config.avatarZoom ?? 1})`,
                                }}
                              />
                            </div>
                          ) : (
                            <div
                              className="w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center font-bold text-2xl shrink-0 border-2"
                              style={{
                                borderColor: accent,
                                backgroundColor: theme.surfaceBg,
                                color: accent,
                                fontFamily: fonts.display,
                              }}
                            >
                              {initials || '?'}
                            </div>
                          )
                        )}

                        <div
                          className="min-w-0 flex-1"
                          style={{ textAlign: config.textAlign || 'left' }}
                        >
                          <h2
                            className="font-bold leading-tight truncate"
                            style={{
                              fontFamily: fonts.display,
                              fontSize: `${Math.round(23 * textScale)}px`,
                            }}
                          >
                            {extracted.displayName}
                          </h2>
                          <div
                            className="text-xs font-medium truncate mt-0.5"
                            style={{ color: theme.textSecondary }}
                          >
                            {extracted.subtitle}
                          </div>
                          {config.tagline.trim() && (
                            <p
                              className="italic text-xs sm:text-sm mt-1.5 opacity-90 truncate"
                              style={{ fontFamily: fonts.display }}
                            >
                              “{config.tagline.trim()}”
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Primary Spotlight */}
                      <div
                        className="shrink-0 rounded-2xl px-4 py-3 border min-w-[136px] sm:min-w-[162px]"
                        style={{
                          backgroundColor: theme.surfaceBg,
                          borderColor: accent,
                        }}
                      >
                        <div
                          className="text-[10px] font-bold uppercase tracking-wider"
                          style={{ color: accent }}
                        >
                          {extracted.primaryLabel}
                        </div>
                        <div
                          className="font-bold leading-tight mt-0.5 tabular-nums truncate"
                          style={{
                            fontFamily: fonts.mono,
                            fontSize: `${Math.round(
                              (extracted.primaryCode.length > 8 ? 20 : 26) * textScale
                            )}px`,
                          }}
                        >
                          {extracted.primaryCode}
                        </div>
                      </div>
                    </div>

                    {/* FRONT: Fields Matrix */}
                    <div className={`relative z-10 grid ${gridColsClass} gap-2.5`}>
                      {visibleFieldsRendered.map((field) => (
                        <div
                          key={field.key}
                          className="rounded-xl px-3 py-2 border backdrop-blur-xs"
                          style={{
                            backgroundColor: theme.surfaceBg,
                            borderColor: borderCol,
                            textAlign: config.textAlign || 'left',
                          }}
                        >
                          <div
                            className="text-[10px] font-semibold uppercase tracking-wide truncate"
                            style={{ color: theme.textSecondary }}
                          >
                            {field.label}
                          </div>
                          <div
                            className="font-bold mt-0.5 truncate tabular-nums"
                            style={{
                              fontFamily: fonts.mono,
                              fontSize: `${Math.round(13 * textScale)}px`,
                            }}
                          >
                            {field.value}
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  /* BACK SIDE PREVIEW */
                  <div className="relative z-10 flex flex-col justify-between h-full">
                    <div
                      className="flex items-center justify-between pb-3 border-b"
                      style={{ borderColor: borderCol }}
                    >
                      <div>
                        <div
                          className="font-bold text-base tracking-tight"
                          style={{ fontFamily: fonts.display }}
                        >
                          DYNAMAP · RINGKASAN BELAJAR &amp; REFLEKSI
                        </div>
                        <div className="text-[11px]" style={{ color: theme.textSecondary }}>
                          {extracted.displayName}
                          {config.showProfileId ? ` · ID ${extracted.profileId}` : ''}
                        </div>
                      </div>
                      <span
                        className="text-[11px] font-semibold uppercase"
                        style={{ color: accent }}
                      >
                        Sisi Belakang
                      </span>
                    </div>

                    <div
                      className="rounded-2xl p-4 border my-auto space-y-1.5"
                      style={{ backgroundColor: theme.surfaceBg, borderColor: borderCol }}
                    >
                      <div className="text-[10px] font-bold uppercase tracking-wider" style={{ color: accent }}>
                        {config.backSummaryTitle || 'Ringkasan Eksplorasi'}
                      </div>
                      <p className="text-xs sm:text-sm leading-relaxed line-clamp-3">
                        {config.backSummaryNotes?.trim() ||
                          activeProfile.bio?.trim() ||
                          'Kerangka kepribadian adalah peta awal untuk memperkaya dialog interpersonal dan pilihan belajar mandiri.'}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3 my-auto">
                      <div
                        className="rounded-xl p-3 border"
                        style={{ backgroundColor: theme.surfaceBg, borderColor: borderCol }}
                      >
                        <div className="text-[10px] font-semibold uppercase" style={{ color: theme.textSecondary }}>
                          Minat Akademik
                        </div>
                        <div className="text-xs font-medium mt-1 line-clamp-2">
                          {config.showAcademicInterestsOnBack !== false && extracted.academicInterests.length > 0
                            ? extracted.academicInterests.join(' · ')
                            : 'Eksplorasi lintas disiplin terbuka'}
                        </div>
                      </div>
                      <div
                        className="rounded-xl p-3 border"
                        style={{ backgroundColor: theme.surfaceBg, borderColor: borderCol }}
                      >
                        <div className="text-[10px] font-semibold uppercase" style={{ color: theme.textSecondary }}>
                          Gaya Kolaborasi
                        </div>
                        <div className="text-xs font-medium mt-1 line-clamp-2">
                          {config.showValuesOnBack !== false
                            ? extracted.workFocus
                            : `${extracted.primaryLabel}: ${extracted.primaryCode}`}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Card Footer */}
                <div
                  className="relative z-10 flex items-center justify-between pt-2.5 mt-2 border-t text-[10px]"
                  style={{ borderColor: borderCol, color: theme.textSecondary }}
                >
                  <span>DYNAMAP · Understanding Differences, Mapping Connections</span>
                  <span className="tabular-nums" style={{ fontFamily: fonts.mono }}>
                    {cardSide === 'back' ? 'BELAKANG · ' : ''}Diperbarui {extracted.updatedDateLabel}
                  </span>
                </div>
              </div>
            </div>
            </div>
          </div>

          <p className="text-xs text-slate-500 leading-relaxed">
            Kartu diekspor ke PNG statis 1600×1000 tanpa efek animasi atau panel kontrol editor. Anda dapat
            mengunduh sisi depan maupun sisi belakang secara terpisah.
          </p>
        </div>

        {/* CUSTOMIZATION STUDIO (Right 5 Cols) */}
        <div className="xl:col-span-5 dreamy-surface border border-slate-200/90 rounded-2xl p-5 sm:p-6 space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-3.5">
            <div className="flex items-center gap-2">
              <Palette className="w-4 h-4 text-indigo-700" />
              <h2 className="text-base font-display font-semibold text-slate-900">
                Studio Kustomisasi Kartu
              </h2>
            </div>
            <button
              type="button"
              onClick={handleSavePreferences}
              disabled={saving}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-indigo-800 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200/80 rounded-lg transition-colors whitespace-nowrap"
            >
              <Save className="w-3.5 h-3.5" />
              {saving ? 'Menyimpan...' : 'Simpan Tema'}
            </button>
          </div>

          {/* Studio Tab Selector */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-1 p-1 rounded-xl bg-slate-100 text-[11px] font-medium">
            {[
              { id: 'style', label: 'Tema & Warna', icon: Palette },
              { id: 'typography', label: 'Font & Foto', icon: Type },
              { id: 'fields', label: 'Bidang & Urutan', icon: Layers },
              { id: 'back-templates', label: 'Belakang & Templat', icon: BookmarkPlus },
            ].map((tb) => {
              const Icon = tb.icon;
              const active = studioTab === tb.id;
              return (
                <button
                  key={tb.id}
                  type="button"
                  onClick={() => setStudioTab(tb.id as typeof studioTab)}
                  className={`flex items-center justify-center gap-1 px-2 py-2 rounded-lg transition-colors whitespace-nowrap ${
                    active
                      ? 'bg-white text-indigo-900 shadow-2xs font-semibold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">{tb.label}</span>
                </button>
              );
            })}
          </div>

          {/* TAB 1: THEME, TEXTURE, BORDERS & ADVANCED COLOR / GRADIENT */}
          {studioTab === 'style' && (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-slate-700">
                  Preset Dasar (6 Nuansa)
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {Object.values(ID_CARD_THEMES).map((t) => {
                    const active = config.theme === t.id;
                    return (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => handleThemeChange(t.id)}
                        className={`p-2 rounded-xl border text-left transition-all ${
                          active
                            ? 'border-indigo-700 ring-1 ring-indigo-600 bg-indigo-50/70'
                            : 'border-slate-200 bg-white hover:border-indigo-300'
                        }`}
                      >
                        <div
                          className="h-4 w-full rounded border border-black/10 mb-1"
                          style={{
                            backgroundImage: `linear-gradient(135deg, ${t.bgStart}, ${t.bgEnd})`,
                          }}
                        />
                        <div className="text-[11px] font-semibold text-slate-900 truncate">{t.name}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Independent Color Editor Target Picker */}
              <div className="space-y-2.5 pt-2 border-t border-slate-200">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-xs font-semibold text-slate-700">Editor Warna Kartu</span>
                  <div className="flex flex-wrap gap-1 text-[11px]">
                    {(
                      [
                        { id: 'accent', label: 'Aksen' },
                        { id: 'card', label: 'Latar' },
                        { id: 'text', label: 'Teks' },
                        { id: 'border', label: 'Batas' },
                        { id: 'decor', label: 'Ornamen' },
                      ] as const
                    ).map((tgt) => (
                      <button
                        key={tgt.id}
                        type="button"
                        onClick={() => setColorEditTarget(tgt.id)}
                        className={`px-2 py-1 rounded-md border ${
                          colorEditTarget === tgt.id
                            ? 'bg-indigo-700 text-white border-indigo-700'
                            : 'bg-white text-slate-700 border-slate-200'
                        }`}
                      >
                        {tgt.label}
                      </button>
                    ))}
                  </div>
                </div>

                <InteractiveColorPicker
                  compact
                  quickSwatches={ID_CARD_ACCENT_PRESETS.map((p) => p.value)}
                  value={
                    colorEditTarget === 'accent'
                      ? accent
                      : colorEditTarget === 'card'
                      ? config.customCardBg || theme.bgMid
                      : colorEditTarget === 'text'
                      ? textPrimary
                      : colorEditTarget === 'border'
                      ? borderCol
                      : decorCol
                  }
                  onChange={(col) => {
                    setConfig((prev) => ({
                      ...prev,
                      ...(colorEditTarget === 'accent'
                        ? { accentColor: col }
                        : colorEditTarget === 'card'
                        ? { customCardBg: col }
                        : colorEditTarget === 'text'
                        ? { customTextPrimary: col }
                        : colorEditTarget === 'border'
                        ? { customBorderColor: col }
                        : { customDecorativeColor: col }),
                    }));
                  }}
                />
              </div>

              {/* Multi-stop Card Background Gradient */}
              <MultiStopGradientEditor
                title="Gradien Kustom Latar Kartu"
                gradient={
                  config.customGradient || {
                    enabled: false,
                    angle: 135,
                    stops: [
                      { id: 'cg1', color: theme.bgStart, position: 0 },
                      { id: 'cg2', color: theme.bgEnd, position: 100 },
                    ],
                  }
                }
                onChange={(nextGrad) => setConfig((prev) => ({ ...prev, customGradient: nextGrad }))}
              />

              {/* Texture, Border & Shadow */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs pt-1">
                <div>
                  <label htmlFor="card-texture-sel" className="block font-semibold text-slate-700 mb-1">
                    Tekstur Latar
                  </label>
                  <select
                    id="card-texture-sel"
                    value={config.texture || 'constellation'}
                    onChange={(e) =>
                      setConfig((prev) => ({ ...prev, texture: e.target.value as TypologyIdCardTexture }))
                    }
                    className="w-full px-2.5 py-2 border border-slate-300 rounded-lg bg-white"
                  >
                    <option value="none">Polos Bersih</option>
                    <option value="dots">Bintik Halus</option>
                    <option value="grid">Kisi Presisi</option>
                    <option value="constellation">Rasi Bintang</option>
                    <option value="linen">Garis Linen</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="card-border-sel" className="block font-semibold text-slate-700 mb-1">
                    Gaya Bingkai
                  </label>
                  <select
                    id="card-border-sel"
                    value={config.borderStyle || 'hairline'}
                    onChange={(e) =>
                      setConfig((prev) => ({
                        ...prev,
                        borderStyle: e.target.value as TypologyIdCardConfig['borderStyle'],
                      }))
                    }
                    className="w-full px-2.5 py-2 border border-slate-300 rounded-lg bg-white"
                  >
                    <option value="hairline">Garis Tunggal</option>
                    <option value="double">Garis Ganda</option>
                    <option value="glow">Cahaya Aksen</option>
                    <option value="none">Tanpa Bingkai</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="card-shadow-sel" className="block font-semibold text-slate-700 mb-1">
                    Kedalaman Bayangan
                  </label>
                  <select
                    id="card-shadow-sel"
                    value={config.shadowDepth || 'deep'}
                    onChange={(e) =>
                      setConfig((prev) => ({
                        ...prev,
                        shadowDepth: e.target.value as TypologyIdCardConfig['shadowDepth'],
                      }))
                    }
                    className="w-full px-2.5 py-2 border border-slate-300 rounded-lg bg-white"
                  >
                    <option value="deep">Tegas Dalam</option>
                    <option value="soft">Halus Lembut</option>
                    <option value="flat">Datar Minimal</option>
                  </select>
                </div>
              </div>

              <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.showDecorations !== false}
                  onChange={(e) =>
                    setConfig((prev) => ({ ...prev, showDecorations: e.target.checked }))
                  }
                  className="rounded border-slate-300 text-indigo-700"
                />
                <span>Tampilkan ornamen cincin orbital &amp; cahaya latar</span>
              </label>
            </div>
          )}

          {/* TAB 2: TYPOGRAPHY, LAYOUT & AVATAR POSITIONING */}
          {studioTab === 'typography' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label htmlFor="card-font-sel" className="block font-semibold text-slate-700 mb-1">
                    Pilihan Font Kartu
                  </label>
                  <select
                    id="card-font-sel"
                    value={config.fontStyle || 'editorial-mix'}
                    onChange={(e) =>
                      setConfig((prev) => ({ ...prev, fontStyle: e.target.value as TypologyIdCardFont }))
                    }
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
                  >
                    <option value="editorial-mix">Editorial Mix (Fraunces + Manrope)</option>
                    <option value="modern-sans">Modern Sans (Manrope)</option>
                    <option value="classic-serif">Classic Serif (Fraunces)</option>
                    <option value="technical-mono">Technical Mono (JetBrains Mono)</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="card-layout-select" className="block font-semibold text-slate-700 mb-1">
                    Tata Letak Matriks
                  </label>
                  <select
                    id="card-layout-select"
                    value={config.layout}
                    onChange={(e) =>
                      setConfig((prev) => ({
                        ...prev,
                        layout: e.target.value as TypologyIdCardLayout,
                      }))
                    }
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
                  >
                    <option value="editorial">Editorial 4-Kolom Ringkas</option>
                    <option value="passport">Paspor Klasik 4-Kolom</option>
                    <option value="crest">Crest 2-Kolom Lebar</option>
                  </select>
                </div>
              </div>

              {/* Alignment + Text Scale + Spacing */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <span className="block font-semibold text-slate-700 mb-1">Perataan Teks</span>
                  <div className="grid grid-cols-3 gap-1">
                    {(['left', 'center', 'right'] as const).map((al) => (
                      <button
                        key={al}
                        type="button"
                        onClick={() => setConfig((prev) => ({ ...prev, textAlign: al }))}
                        className={`py-1.5 rounded border text-center ${
                          (config.textAlign || 'left') === al
                            ? 'bg-indigo-700 text-white border-indigo-700'
                            : 'bg-white text-slate-700 border-slate-200'
                        }`}
                      >
                        {al === 'left' ? 'Kiri' : al === 'center' ? 'Tengah' : 'Kanan'}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex justify-between font-semibold text-slate-700 mb-1">
                    <span>Ukuran Teks</span>
                    <span className="font-mono tabular-nums">{Math.round(textScale * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min={85}
                    max={120}
                    value={Math.round(textScale * 100)}
                    onChange={(e) =>
                      setConfig((prev) => ({ ...prev, textScale: Number(e.target.value) / 100 }))
                    }
                    className="w-full accent-indigo-700 cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between font-semibold text-slate-700 mb-1">
                    <span>Spasi Tepi</span>
                    <span className="font-mono tabular-nums">{Math.round(padScale * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min={80}
                    max={120}
                    value={Math.round(padScale * 100)}
                    onChange={(e) =>
                      setConfig((prev) => ({
                        ...prev,
                        cardPaddingScale: Number(e.target.value) / 100,
                      }))
                    }
                    className="w-full accent-indigo-700 cursor-pointer"
                  />
                </div>
              </div>

              {/* Primary Spotlight & Tagline */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-2 border-t border-slate-200">
                <div>
                  <label htmlFor="card-spotlight-select" className="block font-semibold text-slate-700 mb-1">
                    Sorotan Tipologi Utama
                  </label>
                  <select
                    id="card-spotlight-select"
                    value={config.primarySpotlight}
                    onChange={(e) =>
                      setConfig((prev) => ({
                        ...prev,
                        primarySpotlight: e.target.value as TypologyIdCardConfig['primarySpotlight'],
                      }))
                    }
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
                  >
                    <option value="auto">Otomatis (Prioritas Profil)</option>
                    <option value="socionics">Socionics</option>
                    <option value="mbti">MBTI</option>
                    <option value="enneagram">Enneagram</option>
                    <option value="jungian">Tipologi Jung</option>
                    <option value="psychosophy">Psikosofi (L·V·E·F)</option>
                    <option value="sloan">SLOAN / Big Five</option>
                    <option value="temperament">Temperamen</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="card-tagline-input" className="block font-semibold text-slate-700 mb-1">
                    Moto / Deskripsi Pribadi
                  </label>
                  <input
                    id="card-tagline-input"
                    type="text"
                    maxLength={70}
                    value={config.tagline}
                    onChange={(e) => setConfig((prev) => ({ ...prev, tagline: e.target.value }))}
                    placeholder="Mis. Tetap bertumbuh lewat dialog."
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
                  />
                </div>
              </div>

              {/* Avatar Controls & Custom Photo Upload */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-3 text-xs">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-semibold text-slate-800">Foto / Gambar Kartu &amp; Posisi</span>
                  <div className="flex items-center gap-2">
                    <label className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 cursor-pointer">
                      <ImagePlus className="w-3.5 h-3.5 text-indigo-700" />
                      <span>Unggah Gambar Kustom</span>
                      <input
                        type="file"
                        accept="image/png,image/jpeg,image/webp"
                        onChange={handleCustomImageUpload}
                        className="hidden"
                      />
                    </label>
                    {config.customImageUrl && (
                      <button
                        type="button"
                        onClick={() => setConfig((prev) => ({ ...prev, customImageUrl: undefined }))}
                        className="text-red-600 hover:underline"
                      >
                        Pakai Foto Profil
                      </button>
                    )}
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => setConfig((prev) => ({ ...prev, showAvatar: !prev.showAvatar }))}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border ${
                      config.showAvatar
                        ? 'bg-indigo-50 border-indigo-200 text-indigo-900 font-medium'
                        : 'bg-white border-slate-200 text-slate-600'
                    }`}
                  >
                    {config.showAvatar ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                    Avatar
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setConfig((prev) => ({ ...prev, showProfileId: !prev.showProfileId }))
                    }
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border ${
                      config.showProfileId
                        ? 'bg-indigo-50 border-indigo-200 text-indigo-900 font-medium'
                        : 'bg-white border-slate-200 text-slate-600'
                    }`}
                  >
                    ID Profil
                  </button>
                </div>

                {avatarImageSrc && (
                  <div className="grid grid-cols-3 gap-2 pt-1">
                    <div>
                      <span className="block text-[11px] text-slate-600 mb-0.5">
                        Posisi X ({config.avatarPositionX ?? 50}%)
                      </span>
                      <input
                        type="range"
                        min={0}
                        max={100}
                        value={config.avatarPositionX ?? 50}
                        onChange={(e) =>
                          setConfig((prev) => ({
                            ...prev,
                            avatarPositionX: Number(e.target.value),
                          }))
                        }
                        className="w-full accent-indigo-700"
                      />
                    </div>
                    <div>
                      <span className="block text-[11px] text-slate-600 mb-0.5">
                        Posisi Y ({config.avatarPositionY ?? 50}%)
                      </span>
                      <input
                        type="range"
                        min={0}
                        max={100}
                        value={config.avatarPositionY ?? 50}
                        onChange={(e) =>
                          setConfig((prev) => ({
                            ...prev,
                            avatarPositionY: Number(e.target.value),
                          }))
                        }
                        className="w-full accent-indigo-700"
                      />
                    </div>
                    <div>
                      <span className="block text-[11px] text-slate-600 mb-0.5">
                        Perbesaran ({(config.avatarZoom ?? 1).toFixed(1)}x)
                      </span>
                      <input
                        type="range"
                        min={10}
                        max={20}
                        value={Math.round((config.avatarZoom ?? 1) * 10)}
                        onChange={(e) =>
                          setConfig((prev) => ({
                            ...prev,
                            avatarZoom: Number(e.target.value) / 10,
                          }))
                        }
                        className="w-full accent-indigo-700"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: SELECT, REORDER & INLINE EDIT FIELDS */}
          {studioTab === 'fields' && (
            <div className="space-y-4 text-xs">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-slate-800">
                    Pilih Bidang yang Ditampilkan (Maks. 8 kotak terlihat)
                  </span>
                  <span className="font-mono text-slate-500 tabular-nums">
                    {config.visibleFields.length} dipilih
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-1.5">
                  {ALL_FIELD_TOGGLES.map((item) => {
                    const checked = config.visibleFields.includes(item.key);
                    return (
                      <label
                        key={item.key}
                        className="flex items-center gap-2 text-slate-700 cursor-pointer py-1"
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleField(item.key)}
                          className="rounded border-slate-300 text-indigo-700"
                        />
                        <span className="truncate">{item.label}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Active Ordering & Inline Overrides */}
              <div className="pt-3 border-t border-slate-200 space-y-2">
                <div className="font-semibold text-slate-800">
                  Urutkan &amp; Sesuaikan Teks Bidang Aktif
                </div>
                <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                  {config.visibleFields.map((fk, idx) => {
                    const meta = ALL_FIELD_TOGGLES.find((t) => t.key === fk);
                    const ov = config.fieldOverrides?.[fk] || {};
                    const currentShown = extracted.fields.find((f) => f.key === fk);
                    return (
                      <div
                        key={fk}
                        className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-semibold text-slate-800">
                            {idx + 1}. {meta?.label || fk}
                          </span>
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              aria-label={`Naikkan ${meta?.label}`}
                              disabled={idx === 0}
                              onClick={() => moveField(fk, -1)}
                              className="p-1 rounded border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 disabled:opacity-35"
                            >
                              <ArrowUp className="w-3 h-3" />
                            </button>
                            <button
                              type="button"
                              aria-label={`Turunkan ${meta?.label}`}
                              disabled={idx === config.visibleFields.length - 1}
                              onClick={() => moveField(fk, 1)}
                              className="p-1 rounded border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 disabled:opacity-35"
                            >
                              <ArrowDown className="w-3 h-3" />
                            </button>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-1.5">
                          <input
                            type="text"
                            placeholder={`Label (${currentShown?.label || meta?.label || fk})`}
                            value={ov.label || ''}
                            onChange={(e) =>
                              setConfig((prev) => ({
                                ...prev,
                                fieldOverrides: {
                                  ...prev.fieldOverrides,
                                  [fk]: { ...prev.fieldOverrides?.[fk], label: e.target.value },
                                },
                              }))
                            }
                            className="px-2 py-1 border border-slate-300 rounded bg-white text-[11px]"
                          />
                          <input
                            type="text"
                            placeholder={`Nilai (${currentShown?.value || 'Isi nilai kustom'})`}
                            value={ov.value || ''}
                            onChange={(e) =>
                              setConfig((prev) => ({
                                ...prev,
                                fieldOverrides: {
                                  ...prev.fieldOverrides,
                                  [fk]: { ...prev.fieldOverrides?.[fk], value: e.target.value },
                                },
                              }))
                            }
                            className="px-2 py-1 border border-slate-300 rounded bg-white text-[11px] font-mono"
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: BACK CARD & CUSTOM TEMPLATES */}
          {studioTab === 'back-templates' && (
            <div className="space-y-4 text-xs">
              <div className="space-y-2.5">
                <div className="font-semibold text-slate-800">Isi Sisi Belakang Kartu</div>
                <div>
                  <label htmlFor="card-back-title" className="block text-slate-600 mb-1">
                    Judul Ringkasan Sisi Belakang
                  </label>
                  <input
                    id="card-back-title"
                    type="text"
                    value={config.backSummaryTitle || ''}
                    onChange={(e) =>
                      setConfig((prev) => ({ ...prev, backSummaryTitle: e.target.value }))
                    }
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
                  />
                </div>
                <div>
                  <label htmlFor="card-back-notes" className="block text-slate-600 mb-1">
                    Catatan Refleksi Pribadi (Opsional — fallback ke Bio Profil)
                  </label>
                  <textarea
                    id="card-back-notes"
                    rows={3}
                    value={config.backSummaryNotes || ''}
                    onChange={(e) =>
                      setConfig((prev) => ({ ...prev, backSummaryNotes: e.target.value }))
                    }
                    placeholder="Tulis pengingat gaya belajar, visi akademik, atau prinsip kolaborasi..."
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
                  />
                </div>
                <div className="flex flex-wrap gap-4">
                  <label className="flex items-center gap-2 cursor-pointer text-slate-700">
                    <input
                      type="checkbox"
                      checked={config.showAcademicInterestsOnBack !== false}
                      onChange={(e) =>
                        setConfig((prev) => ({
                          ...prev,
                          showAcademicInterestsOnBack: e.target.checked,
                        }))
                      }
                    />
                    <span>Tampilkan Minat Akademik</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer text-slate-700">
                    <input
                      type="checkbox"
                      checked={config.showValuesOnBack !== false}
                      onChange={(e) =>
                        setConfig((prev) => ({ ...prev, showValuesOnBack: e.target.checked }))
                      }
                    />
                    <span>Tampilkan Gaya Kolaborasi</span>
                  </label>
                </div>
              </div>

              {/* Save / Load Custom Templates */}
              <div className="pt-3 border-t border-slate-200 space-y-2.5">
                <div className="font-semibold text-slate-800">Simpan Sebagai Templat Kustom</div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newTemplateName}
                    onChange={(e) => setNewTemplateName(e.target.value)}
                    placeholder="Nama templat kartu..."
                    className="flex-1 px-3 py-1.5 border border-slate-300 rounded-lg bg-white"
                  />
                  <button
                    type="button"
                    onClick={handleSaveCustomTemplate}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 font-medium text-white bg-indigo-700 hover:bg-indigo-800 rounded-lg whitespace-nowrap"
                  >
                    <BookmarkPlus className="w-3.5 h-3.5" />
                    Simpan Templat
                  </button>
                </div>

                {savedTemplates.length > 0 && (
                  <div className="space-y-1.5 pt-1">
                    {savedTemplates.map((tpl) => (
                      <div
                        key={tpl.id}
                        className="flex items-center justify-between gap-2 px-3 py-2 rounded-lg bg-slate-50 border border-slate-200"
                      >
                        <button
                          type="button"
                          onClick={() => {
                            setConfig({ ...DEFAULT_CARD_CONFIG, ...tpl.config });
                            setFeedback(`Templat "${tpl.name}" diterapkan.`);
                          }}
                          className="font-medium text-slate-800 hover:text-indigo-700 truncate text-left"
                        >
                          {tpl.name} · {ID_CARD_THEMES[tpl.config.theme]?.name || tpl.config.theme}
                        </button>
                        <button
                          type="button"
                          aria-label={`Hapus templat ${tpl.name}`}
                          onClick={() => handleDeleteTemplate(tpl.id)}
                          className="text-slate-400 hover:text-red-600 p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
