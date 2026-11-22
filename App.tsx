import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  BarChart3,
  BookOpen,
  Briefcase,
  Compass,
  FileSearch,
  Gamepad2,
  GitCompare,
  GraduationCap,
  Home,
  IdCard,
  Layers,
  LogIn,
  LogOut,
  Menu,
  MessageSquare,
  Network,
  NotebookPen,
  Orbit,
  Palette,
  Scale,
  Shield,
  SlidersHorizontal,
  UserCheck,
  Users,
  X,
} from 'lucide-react';
import { AdminDashboardView } from './components/AdminDashboardView';
import { WorkspaceColorStudioModal } from './components/AdvancedColorEditor';
import { AnalisisKasusView } from './components/AnalisisKasusView';
import { AnalisisKepribadianView, type TheoryLibraryTab } from './components/AnalisisKepribadianView';
import { AuthModal } from './components/AuthModal';
import { BerandaView, type NavModuleId } from './components/BerandaView';
import { CaseStudiesView } from './components/CaseStudiesView';
import { CelestialBackdrop } from './components/CelestialDecorations';
import { DinamikaKelasView } from './components/DinamikaKelasView';
import { DinamikaKomunikasiView } from './components/DinamikaKomunikasiView';
import { EksplorasiDiriView } from './components/EksplorasiDiriView';
import { EksplorasiQuadraView } from './components/EksplorasiQuadraView';
import { GaleriProfilView } from './components/GaleriProfilView';
import { PembelajaranAkademikView } from './components/PembelajaranAkademikView';
import { PendidikanKarierView } from './components/PendidikanKarierView';
import { PerbandinganInterpersonalView } from './components/PerbandinganInterpersonalView';
import { PetaKonsepView } from './components/PetaKonsepView';
import { ProfilSayaView } from './components/ProfilSayaView';
import { PsikosofiView } from './components/PsikosofiView';
import { RefleksiInterpersonalView } from './components/RefleksiInterpersonalView';
import { TypologyArcadeView } from './components/TypologyArcadeView';
import { TypologyIdCardView } from './components/TypologyIdCardView';
import { TypologyPlaygroundView } from './components/TypologyPlaygroundView';
import { createDefaultBannerPayload } from './data/bannerDefaults';
import { DEFAULT_EXPLORATION_CATALOG_CONFIG } from './data/higherEdAndCareerData';
import { buildCssGradient, DEFAULT_PALETTE_CONFIG } from './lib/colorUtils';
import { computeClassStatistics } from './lib/typology';
import type {
  AcademicReflectionRecord,
  Account,
  AdvancedColorPaletteConfig,
  CareerRecord,
  CaseRecord,
  ConceptEdge,
  ConceptNode,
  EnneagramCore,
  ExplorationCatalogConfig,
  ExplorationScenario,
  GutFix,
  HeadFix,
  HeartFix,
  HomepageBannerPayload,
  InstinctualStacking,
  LearningPathDefinition,
  LearningPreferences,
  Profile,
  PsychosophyConfidence,
  ReferenceCitation,
  ReflectionRecord,
  SchoolSubjectTemplate,
  StudyGroup,
  SystemSettings,
  TheoryArticle,
  TritypeConvention,
  UniversityInstitution,
  UniversityProgram,
  UserExplorationData,
} from './types/dynamap';

interface NavItem {
  id: NavModuleId;
  label: string;
  subtitle: string;
  section: string;
  icon: React.ComponentType<{ className?: string }>;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'beranda', label: 'Beranda', subtitle: 'Ringkasan Platform & Komposisi Kelas', section: 'Ringkasan', icon: Home },
  {
    id: 'analisis-kepribadian',
    label: 'Analisis Kepribadian',
    subtitle: 'Socionics Model A, Enneagram & Tipologi Jung',
    section: 'Kerangka Teori',
    icon: BookOpen,
  },
  {
    id: 'psikosofi',
    label: 'Psikosofi (L·V·E·F)',
    subtitle: '4 Aspek, 16 Penempatan, 24 Tipe & Sintesis',
    section: 'Kerangka Teori',
    icon: SlidersHorizontal,
  },
  {
    id: 'eksplorasi-quadra',
    label: 'Eksplorasi Quadra',
    subtitle: 'Alpha, Beta, Gamma & Delta Kelas',
    section: 'Kerangka Teori',
    icon: Layers,
  },
  {
    id: 'peta-konsep',
    label: 'Peta & Banding Konsep',
    subtitle: 'Komparasi Konsep 10 Bagian, Peta Relasi & Jalur Belajar',
    section: 'Kerangka Teori',
    icon: Network,
  },
  {
    id: 'playground-tipologi',
    label: 'Playground Tipologi',
    subtitle: 'Sandbox Model A, Dikotomi, Enneagram, L·V·E·F & SLOAN',
    section: 'Kerangka Teori',
    icon: Compass,
  },
  {
    id: 'perbandingan-interpersonal',
    label: 'Perbandingan Interpersonal',
    subtitle: 'Analisis 5 Tahap Konflik, Mekanisme & Dialog',
    section: 'Dinamika & Kelas',
    icon: GitCompare,
  },
  {
    id: 'dinamika-komunikasi',
    label: 'Dinamika Komunikasi',
    subtitle: '12 Skenario & Simulasi Dialog Sekolah',
    section: 'Dinamika & Kelas',
    icon: MessageSquare,
  },
  {
    id: 'analisis-kasus',
    label: 'Analisis Kasus',
    subtitle: 'Investigasi Situasi Nyata 12 Langkah',
    section: 'Dinamika & Kelas',
    icon: Scale,
  },
  {
    id: 'studi-kasus',
    label: 'Studi Kasus Lanjutan',
    subtitle: 'Kasus Multi-Langkah: Tokoh Fiktif, Bukti & Ambiguitas',
    section: 'Dinamika & Kelas',
    icon: FileSearch,
  },
  {
    id: 'dinamika-kelas',
    label: 'Dinamika Kelas',
    subtitle: 'Statistik Otomatis & Pertanyaan Empiris',
    section: 'Dinamika & Kelas',
    icon: BarChart3,
  },
  {
    id: 'pembelajaran-akademik',
    label: 'Pembelajaran & Akademik',
    subtitle: 'Preferensi Belajar, Mapel SMA & Kelompok Studi',
    section: 'Eksplorasi & Diri',
    icon: GraduationCap,
  },
  {
    id: 'eksplorasi-diri',
    label: 'Eksplorasi Diri & Peta',
    subtitle: 'Peta Pemahaman Diri, Skenario & Uji Konsistensi',
    section: 'Eksplorasi & Diri',
    icon: Orbit,
  },
  {
    id: 'arcade-tipologi',
    label: 'Typology Arcade',
    subtitle: '12 Mini-Game Interaktif, Pencapaian & Statistik Real',
    section: 'Eksplorasi & Diri',
    icon: Gamepad2,
  },
  {
    id: 'pendidikan-karier',
    label: 'Studi Lanjut & Karier',
    subtitle: 'PTN Indonesia, Gap FISKIM MATONOMI & Peta Jalan',
    section: 'Eksplorasi & Diri',
    icon: Briefcase,
  },
  {
    id: 'refleksi-interpersonal',
    label: 'Refleksi Interpersonal',
    subtitle: 'Catatan Pengalaman Pribadi (Privat)',
    section: 'Eksplorasi & Diri',
    icon: NotebookPen,
  },
  {
    id: 'galeri-profil',
    label: 'Galeri Profil',
    subtitle: 'Direktori Partisipan Sekolah',
    section: 'Direktori & Akun',
    icon: Users,
  },
  {
    id: 'profil-saya',
    label: 'Profil & Interpretasi Diri',
    subtitle: 'Foto, Tipologi, Interpretasi Multi-Lapis & Privasi',
    section: 'Direktori & Akun',
    icon: UserCheck,
  },
  {
    id: 'kartu-identitas',
    label: 'Kartu ID Tipologi',
    subtitle: 'Kartu Identitas Digital Lanskap & Ekspor PNG',
    section: 'Direktori & Akun',
    icon: IdCard,
  },
];

const NAV_SECTION_ORDER = [
  'Ringkasan',
  'Kerangka Teori',
  'Dinamika & Kelas',
  'Eksplorasi & Diri',
  'Direktori & Akun',
];

const DEFAULT_SETTINGS: SystemSettings = {
  mode: 'student_access',
  requireAdminApprovalForTypology: false,
  allowPublicGallery: true,
  schoolName: 'SMA DYNAMAP',
  classLabel: 'Kelas Penelitian (37 Siswa Awal)',
};

export default function App() {
  const [activeModule, setActiveModule] = useState<NavModuleId>('beranda');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  const [account, setAccount] = useState<Account | null>(null);
  const [settings, setSettings] = useState<SystemSettings>(DEFAULT_SETTINGS);
  const [aiConfigured, setAiConfigured] = useState(false);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [studyGroups, setStudyGroups] = useState<StudyGroup[]>([]);
  const [theoryArticles, setTheoryArticles] = useState<TheoryArticle[]>([]);
  const [references, setReferences] = useState<ReferenceCitation[]>([]);
  const [cases, setCases] = useState<CaseRecord[]>([]);
  const [publicActivityCount, setPublicActivityCount] = useState(0);

  const [interpersonalReflections, setInterpersonalReflections] = useState<ReflectionRecord[]>([]);
  const [academicReflections, setAcademicReflections] = useState<AcademicReflectionRecord[]>([]);

  const [publishedBanner, setPublishedBanner] = useState<HomepageBannerPayload>(
    createDefaultBannerPayload
  );
  const [subjectTemplates, setSubjectTemplates] = useState<SchoolSubjectTemplate[]>([]);
  const [universities, setUniversities] = useState<UniversityInstitution[]>([]);
  const [programs, setPrograms] = useState<UniversityProgram[]>([]);
  const [careers, setCareers] = useState<CareerRecord[]>([]);
  const [concepts, setConcepts] = useState<ConceptNode[]>([]);
  const [conceptEdges, setConceptEdges] = useState<ConceptEdge[]>([]);
  const [learningPaths, setLearningPaths] = useState<LearningPathDefinition[]>([]);
  const [scenarios, setScenarios] = useState<ExplorationScenario[]>([]);
  const [explorationConfig, setExplorationConfig] = useState<ExplorationCatalogConfig>(
    DEFAULT_EXPLORATION_CATALOG_CONFIG
  );
  const [userExploration, setUserExploration] = useState<UserExplorationData | null>(null);

  const [compareInitialIds, setCompareInitialIds] = useState<string[]>([]);
  const [theoryInitialTab, setTheoryInitialTab] = useState<TheoryLibraryTab | undefined>(undefined);
  const [sessionReadTopics, setSessionReadTopics] = useState<string[]>([]);
  const [paletteStudioOpen, setPaletteStudioOpen] = useState(false);
  const [paletteConfig, setPaletteConfig] = useState<AdvancedColorPaletteConfig>(() => {
    try {
      const saved = localStorage.getItem('dynamap_palette_config');
      if (saved) return { ...DEFAULT_PALETTE_CONFIG, ...JSON.parse(saved) };
    } catch {
      // ignore invalid storage
    }
    return DEFAULT_PALETTE_CONFIG;
  });

  useEffect(() => {
    if (userExploration?.themePaletteConfig) {
      setPaletteConfig({ ...DEFAULT_PALETTE_CONFIG, ...userExploration.themePaletteConfig });
    }
  }, [userExploration?.themePaletteConfig]);

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--dm-page-bg', paletteConfig.pageBg || '#EEF1FB');
    const grad = buildCssGradient(paletteConfig.pageGradient);
    root.style.setProperty(
      '--dm-page-gradient',
      grad || 'linear-gradient(180deg, transparent 0%, transparent 100%)'
    );
    root.style.setProperty('--dm-card-bg', paletteConfig.cardBg || '#FFFFFF');
    root.style.setProperty('--dm-accent', paletteConfig.accent || '#2C3C8C');
    root.style.setProperty('--dm-text-primary', paletteConfig.textPrimary || '#111731');
    root.style.setProperty('--dm-border-color', paletteConfig.borderColor || '#D5DCF2');
    root.style.setProperty('--dm-button-bg', paletteConfig.buttonBg || '#151D40');
    root.style.setProperty('--dm-decor-color', paletteConfig.decorativeColor || '#DFBE74');
    root.style.setProperty('--dm-chart-primary', paletteConfig.chartPrimary || '#3A4DA8');
    root.style.setProperty('--dm-chart-secondary', paletteConfig.chartSecondary || '#C9A65B');
    root.style.setProperty(
      '--dm-sidebar-bg',
      paletteConfig.sectionOverrides?.sidebarBg || '#101733'
    );
    root.style.setProperty(
      '--dm-header-bg',
      paletteConfig.sectionOverrides?.headerBg || 'rgba(245, 246, 252, 0.85)'
    );
    try {
      localStorage.setItem('dynamap_palette_config', JSON.stringify(paletteConfig));
    } catch {
      // Ignore quota errors
    }
  }, [paletteConfig]);

  const fetchReflections = useCallback(async (tokenOverride?: string) => {
    const token = tokenOverride ?? localStorage.getItem('dynamap_token');
    if (!token) {
      setInterpersonalReflections([]);
      setAcademicReflections([]);
      return;
    }
    try {
      const res = await fetch('/api/reflections', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setInterpersonalReflections(data.interpersonal || []);
        setAcademicReflections(data.academic || []);
      } else {
        setInterpersonalReflections([]);
        setAcademicReflections([]);
      }
    } catch {
      setInterpersonalReflections([]);
      setAcademicReflections([]);
    }
  }, []);

  const fetchBootstrap = useCallback(
    async (tokenOverride?: string | null) => {
      try {
        setLoadError('');
        const token =
          tokenOverride === null ? null : tokenOverride ?? localStorage.getItem('dynamap_token');
        const res = await fetch('/api/bootstrap', {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        if (!res.ok) {
          throw new Error('Gagal memuat basis data DYNAMAP.');
        }
        const data = await res.json();
        setAccount(data.account || null);
        setSettings(data.settings || DEFAULT_SETTINGS);
        setAiConfigured(Boolean(data.aiConfigured));
        setProfiles(data.profiles || []);
        setStudyGroups(data.studyGroups || []);
        setTheoryArticles(data.theoryArticles || []);
        setReferences(data.references || []);
        setCases(data.cases || []);
        setPublicActivityCount(data.publicActivityCount || 0);
        if (data.publishedBanner) setPublishedBanner(data.publishedBanner);
        setSubjectTemplates(data.subjectTemplates || []);
        setUniversities(data.universities || []);
        setPrograms(data.programs || []);
        setCareers(data.careers || []);
        setConcepts(data.concepts || []);
        setConceptEdges(data.conceptEdges || []);
        setLearningPaths(data.learningPaths || []);
        setScenarios(data.scenarios || []);
        if (data.explorationConfig) setExplorationConfig(data.explorationConfig);
        setUserExploration(data.userExploration || null);

        if (data.account && token) {
          await fetchReflections(token);
        } else {
          setInterpersonalReflections([]);
          setAcademicReflections([]);
        }
      } catch (err) {
        setLoadError(err instanceof Error ? err.message : 'Terjadi kesalahan saat memuat sistem.');
      } finally {
        setLoading(false);
      }
    },
    [fetchReflections]
  );

  useEffect(() => {
    fetchBootstrap();
  }, [fetchBootstrap]);

  const stats = useMemo(() => computeClassStatistics(profiles), [profiles]);

  const myProfile = useMemo(() => {
    if (!account?.linkedProfileId) return null;
    return profiles.find((p) => p.id === account.linkedProfileId) || null;
  }, [account, profiles]);

  async function handleAuthSuccess(token: string, loggedAccount: Account) {
    localStorage.setItem('dynamap_token', token);
    setAccount(loggedAccount);
    await fetchBootstrap(token);
  }

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    localStorage.removeItem('dynamap_token');
    setAccount(null);
    setInterpersonalReflections([]);
    setAcademicReflections([]);
    if (activeModule === 'admin') {
      setActiveModule('beranda');
    }
    await fetchBootstrap(null);
  }

  function handleNavigate(moduleId: NavModuleId, options?: { theoryTab?: TheoryLibraryTab }) {
    if (options?.theoryTab) {
      setTheoryInitialTab(options.theoryTab);
    } else if (moduleId !== 'analisis-kepribadian') {
      setTheoryInitialTab(undefined);
    }
    setActiveModule(moduleId);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function handleCompareMembers(profileIds: string[]) {
    setCompareInitialIds(profileIds);
    handleNavigate('perbandingan-interpersonal');
  }

  function handleCompareSingleProfile(profileId: string) {
    setCompareInitialIds([profileId]);
    handleNavigate('perbandingan-interpersonal');
  }

  async function patchMyProfile(payload: Record<string, unknown>) {
    if (!account?.linkedProfileId) return;
    const token = localStorage.getItem('dynamap_token');
    const res = await fetch(`/api/profiles/${account.linkedProfileId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      const data = await res.json();
      setProfiles((prev) => prev.map((p) => (p.id === data.profile.id ? data.profile : p)));
    }
  }

  async function handleSaveProfileTritype(payload: {
    enneagramCore: EnneagramCore;
    tritypeHeart: HeartFix;
    tritypeHead: HeadFix;
    tritypeGut: GutFix;
    threeFix: string;
    trifix: string;
    tritype: string;
    tritypeConvention: TritypeConvention;
  }) {
    if (!myProfile) return;
    await patchMyProfile({
      typology: {
        ...myProfile.typology,
        ...payload,
      },
    });
  }

  async function handleSaveProfileStacking(stacking: InstinctualStacking, wing?: string) {
    if (!myProfile) return;
    await patchMyProfile({
      typology: {
        ...myProfile.typology,
        instinctStacking: stacking,
        ...(wing !== undefined ? { enneagramWing: wing } : {}),
      },
    });
  }

  async function handleSaveProfilePsychosophy(payload: {
    psychosophyCode: string;
    psychosophySelfReported?: string;
    psychosophyConfidence: PsychosophyConfidence;
    psychosophyProvisional: boolean;
    psychosophyNotes: string;
  }) {
    if (!myProfile) return;
    await patchMyProfile({
      typology: {
        ...myProfile.typology,
        ...payload,
      },
    });
  }

  async function handleSaveLearningPreferences(prefs: LearningPreferences) {
    await patchMyProfile({ learningPreferences: prefs });
  }

  async function handleSaveExploration(next: Partial<UserExplorationData>) {
    const token = localStorage.getItem('dynamap_token');
    if (!token) return;
    const res = await fetch('/api/exploration', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(next),
    });
    if (res.ok) {
      const data = await res.json();
      setUserExploration(data.exploration);
    }
  }

  const combinedReadTopics = useMemo(() => {
    const set = new Set<string>([
      ...(userExploration?.readTheoryTopics || []),
      ...sessionReadTopics,
    ]);
    return Array.from(set);
  }, [userExploration?.readTheoryTopics, sessionReadTopics]);

  async function handleMarkTopicRead(topicId: string) {
    if (!topicId) return;
    setSessionReadTopics((prev) => (prev.includes(topicId) ? prev : [...prev, topicId]));
    if (!account) return;
    const current = userExploration?.readTheoryTopics || [];
    if (current.includes(topicId)) return;
    await handleSaveExploration({ readTheoryTopics: [...current, topicId] });
  }

  const activeNavMeta =
    activeModule === 'admin'
      ? {
          label: 'Dasbor Administrator',
          subtitle: 'Manajemen Basis Data, Riwayat Perubahan & Mode Sistem',
        }
      : NAV_ITEMS.find((item) => item.id === activeModule) || NAV_ITEMS[0];

  const roleLabel =
    account?.role === 'admin'
      ? 'Administrator'
      : account?.role === 'teacher'
      ? 'Guru / Wali Kelas'
      : account?.role === 'student'
      ? 'Siswa'
      : 'Partisipan';

  const sidebarNav = (
    <div
      className="flex flex-col h-full text-[#E9EDFB] bg-[radial-gradient(ellipse_at_top_left,rgba(115,136,221,0.16),transparent_60%)]"
      style={{ backgroundColor: 'var(--dm-sidebar-bg, #101733)' }}
    >
      <div className="px-5 py-5 border-b border-white/10 flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={() => handleNavigate('beranda')}
          className="text-left flex items-center gap-3 min-w-0 group"
        >
          <div className="w-9 h-9 rounded-full border border-[#DFBE74]/45 bg-white/[0.04] flex items-center justify-center shrink-0 transition-colors group-hover:border-[#DFBE74]/80">
            <svg viewBox="0 0 24 24" className="w-4 h-4 text-[#E6C77E]" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
              <circle cx="12" cy="12" r="8.5" strokeOpacity="0.45" />
              <path d="M14.5 5.5a6.5 6.5 0 1 0 4 11.5 5.5 5.5 0 0 1-4-11.5Z" />
            </svg>
          </div>
          <div className="min-w-0">
            <div className="font-display font-semibold text-base text-white tracking-tight truncate">
              DYNAMAP
            </div>
            <div className="text-[11px] text-[#9BA7D1] truncate">Pemetaan Dinamika SMA</div>
          </div>
        </button>
        <button
          type="button"
          onClick={() => setMobileMenuOpen(false)}
          aria-label="Tutup menu navigasi"
          className="lg:hidden p-1.5 rounded-lg text-[#B8C3E6] hover:bg-white/10"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <nav aria-label="Navigasi utama" className="flex-1 overflow-y-auto px-3 py-4 space-y-5">
        {NAV_SECTION_ORDER.map((section) => {
          const items = NAV_ITEMS.filter((i) => i.section === section);
          return (
            <div key={section} className="space-y-1">
              <div className="px-3 pb-1 text-[11px] font-medium text-[#8C99C7]">
                {section}
              </div>
              {items.map((item) => {
                const Icon = item.icon;
                const active = activeModule === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleNavigate(item.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-150 text-left ${
                      active
                        ? 'bg-white/[0.11] text-white ring-1 ring-[#DFBE74]/40'
                        : 'text-[#C5CEEB] hover:bg-white/[0.05] hover:text-white'
                    }`}
                  >
                    <Icon
                      className={`w-4 h-4 shrink-0 transition-colors ${
                        active ? 'text-[#E6C77E]' : 'text-[#8492C2]'
                      }`}
                    />
                    <span className="truncate">{item.label}</span>
                  </button>
                );
              })}
            </div>
          );
        })}

        {account?.role === 'admin' && (
          <div className="pt-3 mt-3 border-t border-white/10">
            <button
              type="button"
              onClick={() => handleNavigate('admin')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-all duration-150 text-left ${
                activeModule === 'admin'
                  ? 'bg-[#E6C77E]/15 text-[#F6E4B4] ring-1 ring-[#E6C77E]/50'
                  : 'text-[#E6C77E] hover:bg-white/[0.06]'
              }`}
            >
              <Shield className="w-4 h-4 shrink-0" />
              <span className="truncate">Dasbor Admin</span>
            </button>
          </div>
        )}
      </nav>

      <div className="p-4 border-t border-white/10 bg-[#0C1229]/70 text-[11px] text-[#9AA6CE] space-y-1">
        <div className="font-medium text-[#E5EAFB]">{settings.schoolName}</div>
        <div className="tabular-nums">
          {stats.totalActive} partisipan aktif · {stats.byQuadra.filter((q) => q.count > 0 && ['Alpha', 'Beta', 'Gamma', 'Delta'].includes(q.label)).length} Quadra terisi
        </div>
      </div>
    </div>
  );

  return (
    <div className="relative min-h-screen dreamy-canvas text-slate-900 flex font-sans">
      <CelestialBackdrop />
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-64 shrink-0 border-r border-[#202A54] sticky top-0 h-screen z-20">
        {sidebarNav}
      </aside>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-[#0B0F22]/60 backdrop-blur-xs"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />
          <aside className="relative z-10 w-72 max-w-[85vw] h-full border-r border-[#202A54] shadow-2xl">
            {sidebarNav}
          </aside>
        </div>
      )}

      {/* Main Content Area */}
      <div className="relative z-10 flex-1 min-w-0 flex flex-col">
        <header
          className="sticky top-0 z-30 h-16 backdrop-blur-md border-b border-slate-200 px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4"
          style={{ backgroundColor: 'var(--dm-header-bg, rgba(245, 246, 252, 0.85))' }}
        >
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Buka menu navigasi"
              className="lg:hidden p-2 -ml-1 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="min-w-0">
              <div className="text-sm sm:text-base font-display font-semibold text-slate-900 truncate">
                {activeNavMeta.label}
              </div>
              <div className="text-[11px] text-slate-500 truncate hidden sm:block">
                {activeNavMeta.subtitle}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setPaletteStudioOpen(true)}
              title="Ubah Palet Warna & Gradien Antarmuka"
              className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-medium text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors whitespace-nowrap"
            >
              <Palette className="w-3.5 h-3.5 text-indigo-700" />
              <span className="hidden md:inline">Tema &amp; Warna</span>
            </button>
            {account ? (
              <div className="flex items-center gap-2.5">
                <div className="hidden sm:block text-right">
                  <div className="text-xs font-semibold text-slate-900">{account.displayName}</div>
                  <div className="text-[11px] text-slate-500">{roleLabel}</div>
                </div>
                {account.role === 'admin' && activeModule !== 'admin' && (
                  <button
                    type="button"
                    onClick={() => handleNavigate('admin')}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-indigo-800 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200/70 rounded-lg transition-colors whitespace-nowrap"
                  >
                    <Shield className="w-3.5 h-3.5" />
                    <span className="hidden md:inline">Panel Admin</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={handleLogout}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors whitespace-nowrap"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Keluar
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setAuthModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-white bg-[#151D40] hover:bg-[#233070] ring-1 ring-[#DFBE74]/35 rounded-lg transition-colors whitespace-nowrap"
              >
                <LogIn className="w-3.5 h-3.5 text-[#E6C77E]" />
                Masuk / Klaim Profil
              </button>
            )}
          </div>
        </header>

        {settings.mode === 'development' && (
          <div className="bg-amber-50/90 border-b border-amber-200 px-4 sm:px-6 lg:px-8 py-2.5 text-xs text-amber-950">
            <strong>Mode Pengembangan Aktif:</strong> Administrator sedang menyiapkan basis data
            sekolah. Login dan klaim profil akun siswa sementara dinonaktifkan, namun materi
            edukasi terbuka untuk dieksplorasi.
          </div>
        )}

        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6 sm:py-8 max-w-7xl w-full mx-auto">
          {loading ? (
            <div className="bg-white border border-slate-200 rounded-xl p-8 text-sm text-slate-600">
              Memuat basis data DYNAMAP dan kerangka teori...
            </div>
          ) : loadError ? (
            <div className="bg-red-50 border border-red-200 rounded-xl p-6 space-y-3 text-sm text-red-900">
              <p>{loadError}</p>
              <button
                type="button"
                onClick={() => fetchBootstrap()}
                className="px-4 py-2 text-xs font-medium text-white bg-red-700 hover:bg-red-800 rounded-lg"
              >
                Coba Muat Ulang
              </button>
            </div>
          ) : (
            <div key={activeModule} className="dm-view-enter">
              {activeModule === 'beranda' && (
                <BerandaView
                  profiles={profiles}
                  stats={stats}
                  theoryArticles={theoryArticles}
                  studyGroups={studyGroups}
                  publicActivityCount={publicActivityCount}
                  publishedBanner={publishedBanner}
                  onNavigate={handleNavigate}
                />
              )}

              {activeModule === 'analisis-kepribadian' && (
                <AnalisisKepribadianView
                  profiles={profiles}
                  references={references}
                  account={account}
                  initialTab={theoryInitialTab}
                  readTopics={combinedReadTopics}
                  onMarkTopicRead={handleMarkTopicRead}
                  onNavigate={handleNavigate}
                  onSaveProfileTritype={account?.linkedProfileId ? handleSaveProfileTritype : undefined}
                  onSaveProfileStacking={
                    account?.linkedProfileId ? handleSaveProfileStacking : undefined
                  }
                />
              )}

              {activeModule === 'psikosofi' && (
                <PsikosofiView
                  profiles={profiles}
                  account={account}
                  myProfile={myProfile}
                  readTopics={combinedReadTopics}
                  onMarkTopicRead={handleMarkTopicRead}
                  onSaveProfilePsychosophy={
                    account?.linkedProfileId ? handleSaveProfilePsychosophy : undefined
                  }
                />
              )}

              {activeModule === 'eksplorasi-quadra' && (
                <EksplorasiQuadraView
                  profiles={profiles}
                  stats={stats}
                  onCompareMembers={handleCompareMembers}
                />
              )}

              {activeModule === 'perbandingan-interpersonal' && (
                <PerbandinganInterpersonalView
                  key={compareInitialIds.join(',') || 'default-cmp'}
                  profiles={profiles}
                  initialSelectedIds={compareInitialIds}
                />
              )}

              {activeModule === 'dinamika-komunikasi' && <DinamikaKomunikasiView />}

              {activeModule === 'analisis-kasus' && (
                <AnalisisKasusView
                  cases={cases}
                  aiConfigured={aiConfigured}
                  onCaseCreated={(record) => setCases((prev) => [record, ...prev])}
                />
              )}

              {activeModule === 'dinamika-kelas' && <DinamikaKelasView profiles={profiles} />}

              {activeModule === 'pembelajaran-akademik' && (
                <PembelajaranAkademikView
                  profiles={profiles}
                  account={account}
                  myProfile={myProfile}
                  studyGroups={studyGroups}
                  academicReflections={academicReflections}
                  onSaveLearningPreferences={handleSaveLearningPreferences}
                  onStudyGroupCreated={(group) => setStudyGroups((prev) => [group, ...prev])}
                  onStudyGroupUpdated={(group) =>
                    setStudyGroups((prev) => prev.map((g) => (g.id === group.id ? group : g)))
                  }
                  onAcademicReflectionCreated={(rec) =>
                    setAcademicReflections((prev) => [rec, ...prev])
                  }
                  onAcademicReflectionDeleted={(id) =>
                    setAcademicReflections((prev) => prev.filter((r) => r.id !== id))
                  }
                />
              )}

              {activeModule === 'refleksi-interpersonal' && (
                <RefleksiInterpersonalView
                  account={account}
                  reflections={interpersonalReflections}
                  onOpenAuth={() => setAuthModalOpen(true)}
                  onCreated={(rec) => setInterpersonalReflections((prev) => [rec, ...prev])}
                  onUpdated={(rec) =>
                    setInterpersonalReflections((prev) =>
                      prev.map((r) => (r.id === rec.id ? rec : r))
                    )
                  }
                  onDeleted={(id) =>
                    setInterpersonalReflections((prev) => prev.filter((r) => r.id !== id))
                  }
                />
              )}

              {activeModule === 'galeri-profil' && (
                <GaleriProfilView
                  profiles={profiles}
                  onCompareProfile={handleCompareSingleProfile}
                />
              )}

              {activeModule === 'eksplorasi-diri' && (
                <EksplorasiDiriView
                  account={account}
                  myProfile={myProfile}
                  exploration={userExploration}
                  scenarios={scenarios}
                  interpersonalReflections={interpersonalReflections}
                  academicReflections={academicReflections}
                  onSaveExploration={handleSaveExploration}
                  onNavigate={handleNavigate}
                  onOpenAuth={() => setAuthModalOpen(true)}
                />
              )}

              {activeModule === 'peta-konsep' && (
                <PetaKonsepView
                  account={account}
                  concepts={concepts}
                  conceptEdges={conceptEdges}
                  learningPaths={learningPaths}
                  exploration={userExploration}
                  readTopics={combinedReadTopics}
                  onMarkTopicRead={handleMarkTopicRead}
                  onSaveExploration={handleSaveExploration}
                  onNavigate={handleNavigate}
                  onOpenAuth={() => setAuthModalOpen(true)}
                />
              )}

              {activeModule === 'pendidikan-karier' && (
                <PendidikanKarierView
                  account={account}
                  myProfile={myProfile}
                  profiles={profiles}
                  exploration={userExploration}
                  explorationConfig={explorationConfig}
                  subjectTemplates={subjectTemplates}
                  universities={universities}
                  programs={programs}
                  careers={careers}
                  onSaveExploration={handleSaveExploration}
                  onOpenAuth={() => setAuthModalOpen(true)}
                />
              )}

              {activeModule === 'profil-saya' && (
                <ProfilSayaView
                  account={account}
                  myProfile={myProfile}
                  exploration={userExploration}
                  onSaveExploration={handleSaveExploration}
                  onNavigate={handleNavigate}
                  onOpenAuth={() => setAuthModalOpen(true)}
                  onOpenIdCard={() => handleNavigate('kartu-identitas')}
                  onProfileUpdated={(updated) => {
                    setProfiles((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
                    fetchBootstrap();
                  }}
                />
              )}

              {activeModule === 'kartu-identitas' && (
                <TypologyIdCardView
                  account={account}
                  myProfile={myProfile}
                  profiles={profiles}
                  exploration={userExploration}
                  onSaveExploration={handleSaveExploration}
                  onNavigate={handleNavigate}
                  onOpenAuth={() => setAuthModalOpen(true)}
                />
              )}

              {activeModule === 'playground-tipologi' && (
                <TypologyPlaygroundView
                  account={account}
                  myProfile={myProfile}
                  exploration={userExploration}
                  onSaveExploration={handleSaveExploration}
                  onOpenAuth={() => setAuthModalOpen(true)}
                  onNavigate={handleNavigate}
                />
              )}

              {activeModule === 'arcade-tipologi' && (
                <TypologyArcadeView
                  account={account}
                  exploration={userExploration}
                  learningPaths={learningPaths}
                  onSaveExploration={handleSaveExploration}
                  onOpenAuth={() => setAuthModalOpen(true)}
                  onNavigate={handleNavigate}
                />
              )}

              {activeModule === 'studi-kasus' && (
                <CaseStudiesView
                  account={account}
                  exploration={userExploration}
                  onSaveExploration={handleSaveExploration}
                  onOpenAuth={() => setAuthModalOpen(true)}
                  onNavigate={handleNavigate}
                />
              )}

              {activeModule === 'admin' && (
                <AdminDashboardView
                  account={account}
                  onDataMutated={async () => {
                    await fetchBootstrap();
                  }}
                />
              )}
            </div>
          )}
        </main>

        <footer className="border-t border-slate-200 bg-white/75 backdrop-blur-sm px-4 sm:px-6 lg:px-8 py-4 text-xs text-slate-500 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <span>
            DYNAMAP — Understanding Differences, Mapping Connections · Bahasa Indonesia
          </span>
          <span>
            Kerangka kepribadian membantu memetakan perbedaan; pemahaman sejati hadir lewat komunikasi nyata.
          </span>
        </footer>
      </div>

      <WorkspaceColorStudioModal
        isOpen={paletteStudioOpen}
        onClose={() => setPaletteStudioOpen(false)}
        palette={paletteConfig}
        onChangePalette={setPaletteConfig}
        onPersistPalette={async (nextPalette) => {
          setPaletteConfig(nextPalette);
          if (account) {
            await handleSaveExploration({ themePaletteConfig: nextPalette });
          }
        }}
      />

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        profiles={profiles}
        settings={settings}
        onSuccess={handleAuthSuccess}
      />
    </div>
  );
}
