import 'dotenv/config';
import express, { type NextFunction, type Request, type Response } from 'express';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, ThinkingLevel, Type } from '@google/genai';
import {
  DEFAULT_LEARNING_PREFERENCES,
  INITIAL_REFERENCES,
  INITIAL_THEORY_ARTICLES,
  createInitial37Profiles,
} from './src/data/initialDataset';
import { createDefaultBannerState } from './src/data/bannerDefaults';
import {
  GUIDED_LEARNING_PATHS,
  INITIAL_CONCEPT_EDGES,
  INITIAL_CONCEPT_NODES,
  INITIAL_SCENARIOS,
} from './src/data/conceptsAndPathsData';
import {
  DEFAULT_EXPLORATION_CATALOG_CONFIG,
  INITIAL_CAREERS,
  INITIAL_PROGRAMS,
  INITIAL_SCHOOL_SUBJECT_TEMPLATES,
  INITIAL_UNIVERSITIES,
  createDefaultIntrapersonalInput,
  createDefaultUserSubjects,
  createSampleRoadmap,
} from './src/data/higherEdAndCareerData';
import { buildStructuredCaseAnalysis } from './src/lib/typology';
import type {
  AcademicReflectionRecord,
  Account,
  AccountRole,
  CareerRecord,
  CaseAnalysisInput,
  CaseRecord,
  ChangeLogEntry,
  ConceptEdge,
  ConceptNode,
  ExplorationCatalogConfig,
  ExplorationScenario,
  GranularVisibilityLevel,
  HomepageBannerPayload,
  HomepageBannerState,
  LearningPathDefinition,
  Profile,
  ProfileCategory,
  ProfilePrivacySettings,
  ReferenceCitation,
  ReflectionRecord,
  SchoolSubjectTemplate,
  StructuredCaseAnalysis,
  StudyGroup,
  SystemSettings,
  TheoryArticle,
  UniversityInstitution,
  UniversityProgram,
  UserExplorationData,
} from './src/types/dynamap';

interface StoredAccount extends Account {
  passwordHash: string;
  salt: string;
}

interface DynamapDatabase {
  accounts: StoredAccount[];
  profiles: Profile[];
  changeLogs: ChangeLogEntry[];
  reflections: ReflectionRecord[];
  academicReflections: AcademicReflectionRecord[];
  studyGroups: StudyGroup[];
  cases: CaseRecord[];
  theoryArticles: TheoryArticle[];
  references: ReferenceCitation[];
  settings: SystemSettings;
  bannerConfig: HomepageBannerState;
  subjectTemplates: SchoolSubjectTemplate[];
  universities: UniversityInstitution[];
  programs: UniversityProgram[];
  careers: CareerRecord[];
  concepts: ConceptNode[];
  conceptEdges: ConceptEdge[];
  learningPaths: LearningPathDefinition[];
  scenarios: ExplorationScenario[];
  explorationConfig: ExplorationCatalogConfig;
  catalogSeedVersion?: number;
  userExplorations: Record<string, UserExplorationData>;
}

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_PATH = path.join(DATA_DIR, 'dynamap-db.json');
const UPLOADS_DIR = path.resolve(process.cwd(), 'uploads');
const SESSION_SECRET = process.env.SESSION_SECRET || 'dynamap-local-session-secret-2026';

function ensureDirs() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

function hashPassword(password: string, salt?: string): { hash: string; salt: string } {
  const actualSalt = salt || crypto.randomBytes(16).toString('hex');
  const derived = crypto.scryptSync(password, actualSalt, 64).toString('hex');
  return { hash: derived, salt: actualSalt };
}

function verifyPassword(password: string, hash: string, salt: string): boolean {
  const derived = crypto.scryptSync(password, salt, 64);
  const stored = Buffer.from(hash, 'hex');
  if (derived.length !== stored.length) return false;
  return crypto.timingSafeEqual(derived, stored);
}

function signToken(payload: { accountId: string; role: AccountRole; exp: number }): string {
  const encoded = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const sig = crypto.createHmac('sha256', SESSION_SECRET).update(encoded).digest('base64url');
  return `${encoded}.${sig}`;
}

function verifyToken(token: string): { accountId: string; role: AccountRole; exp: number } | null {
  const parts = token.split('.');
  if (parts.length !== 2) return null;
  const [encoded, sig] = parts;
  const expectedSig = crypto.createHmac('sha256', SESSION_SECRET).update(encoded).digest('base64url');
  const a = Buffer.from(sig);
  const b = Buffer.from(expectedSig);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;
  try {
    const data = JSON.parse(Buffer.from(encoded, 'base64url').toString('utf8'));
    if (!data.accountId || !data.exp || Date.now() > data.exp) return null;
    return data;
  } catch {
    return null;
  }
}

function createSeedDatabase(): DynamapDatabase {
  const adminCred = hashPassword('admin123');
  const adminAccount: StoredAccount = {
    id: 'acc-admin-01',
    username: 'admin',
    role: 'admin',
    linkedProfileId: null,
    displayName: 'Administrator DYNAMAP',
    createdAt: '2026-01-15T08:00:00.000Z',
    passwordHash: adminCred.hash,
    salt: adminCred.salt,
  };

  return {
    accounts: [adminAccount],
    profiles: createInitial37Profiles(),
    changeLogs: [],
    reflections: [],
    academicReflections: [],
    studyGroups: [
      {
        id: 'sg-demo-01',
        name: 'Kelompok Riset Dinamika Kelas XII',
        subject: 'Sosiologi & Kolaborasi',
        topic: 'Pemetaan Komunikasi Kelompok Lintas Preferensi',
        learningGoals: 'Memahami perbedaan pendekatan diskusi dan pembagian peran yang adil berdasarkan kompetensi.',
        memberProfileIds: ['std-01', 'std-17', 'std-09'],
        tasks: [
          {
            id: 'task-01',
            title: 'Menyusun instrumen wawancara komunikasi kelompok',
            assigneeProfileId: 'std-17',
            assigneeName: 'Reva',
            role: 'Peneliti',
            deadline: '2026-11-22',
            status: 'Sedang Dikerjakan',
            contributionNote: 'Draft 5 pertanyaan klarifikasi sudah disiapkan.',
          },
          {
            id: 'task-02',
            title: 'Merangkum jadwal & integrasi laporan akhir',
            assigneeProfileId: 'std-01',
            assigneeName: 'Rizqy',
            role: 'Koordinator',
            deadline: '2026-11-25',
            status: 'Belum Mulai',
            contributionNote: 'Menunggu hasil pengumpulan catatan anggota.',
          },
        ],
        collaborationReview: 'Diskusi awal berjalan baik setelah pembagian porsi spesifik disepakati.',
        outcomeEvaluation: '',
        createdByAccountId: null,
        createdAt: '2026-01-20T08:00:00.000Z',
        updatedAt: '2026-01-20T08:00:00.000Z',
      },
    ],
    cases: [],
    theoryArticles: INITIAL_THEORY_ARTICLES,
    references: INITIAL_REFERENCES,
    settings: {
      mode: 'student_access',
      requireAdminApprovalForTypology: false,
      allowPublicGallery: true,
      schoolName: 'SMA Laboratorium Riset DYNAMAP',
      classLabel: 'Kelas Penelitian (37 Siswa Awal)',
    },
    bannerConfig: createDefaultBannerState(),
    subjectTemplates: INITIAL_SCHOOL_SUBJECT_TEMPLATES,
    universities: INITIAL_UNIVERSITIES,
    programs: INITIAL_PROGRAMS,
    careers: INITIAL_CAREERS,
    concepts: INITIAL_CONCEPT_NODES,
    conceptEdges: INITIAL_CONCEPT_EDGES,
    learningPaths: GUIDED_LEARNING_PATHS,
    scenarios: INITIAL_SCENARIOS,
    explorationConfig: DEFAULT_EXPLORATION_CATALOG_CONFIG,
    catalogSeedVersion: 2,
    userExplorations: {},
  };
}

function createEmptyExploration(ownerAccountId: string): UserExplorationData {
  return {
    ownerAccountId,
    conceptStatuses: {},
    unresolvedQuestions: [],
    savedComparisons: [],
    completedLearningSteps: [],
    bookmarkedLearningSteps: [],
    scenarioReflections: [],
    userSubjects: createDefaultUserSubjects(),
    specializationLabel: 'FISKIM MATONOMI',
    interestTopics: [],
    problemSolvingPreference: 'Seimbang',
    theoryVsPracticePreference: 'Seimbang',
    workMotivationTags: [],
    preferredMapLayout: {},
    roadmaps: [createSampleRoadmap()],
    provisionalTypologies: {},
    intrapersonal: createDefaultIntrapersonalInput(),
    bookmarkedProgramIds: [],
    bookmarkedCareerIds: [],
    personalReflectionAnswers: {},
    interpretationRealityChecks: {},
    readTheoryTopics: [],
    updatedAt: new Date().toISOString(),
  };
}

function buildDefaultPrivacySettings(profile: Partial<Profile>): ProfilePrivacySettings {
  const baseVis: GranularVisibilityLevel =
    profile.visibility === 'private'
      ? 'private'
      : profile.visibility === 'limited'
      ? 'classmates'
      : 'public';
  return {
    displayName: 'public',
    fullName: profile.exposeFullName ? 'public' : 'admins',
    avatar: baseVis,
    typology: baseVis,
    bio: baseVis,
    reflections: 'private',
    idCard: profile.visibility === 'private' ? 'private' : 'public',
  };
}

function mergeById<T extends { id: string }>(existing: T[], additions: T[]): T[] {
  const existingMap = new Map(existing.map((item) => [item.id, item]));
  const result = existing.map((item) => {
    const fresh = additions.find((a) => a.id === item.id);
    return fresh ? { ...fresh, ...item } : item;
  });
  for (const item of additions) {
    if (!existingMap.has(item.id)) {
      result.push(item);
    }
  }
  return result;
}

function normalizeDatabase(rawDb: DynamapDatabase): DynamapDatabase {
  rawDb.profiles = (rawDb.profiles || []).map((p) => ({
    ...p,
    privacySettings: {
      ...buildDefaultPrivacySettings(p),
      ...(p.privacySettings || {}),
    },
    typology: {
      ...p.typology,
      psychosophyCode: p.typology?.psychosophyCode ?? '',
      psychosophySelfReported: p.typology?.psychosophySelfReported ?? '',
      psychosophyConfidence: p.typology?.psychosophyConfidence ?? 'Belum Dipastikan',
      psychosophyProvisional: p.typology?.psychosophyProvisional ?? true,
      psychosophyNotes: p.typology?.psychosophyNotes ?? '',
      mbti: p.typology?.mbti ?? '',
      mbtiCognitiveStack: p.typology?.mbtiCognitiveStack ?? '',
      sloanCode: p.typology?.sloanCode ?? '',
      sloanExtended: p.typology?.sloanExtended ?? '',
      temperament: p.typology?.temperament ?? '',
      temperamentSecondary: p.typology?.temperamentSecondary ?? '',
    },
  }));
  if (!rawDb.bannerConfig || !rawDb.bannerConfig.published?.slides?.length) {
    rawDb.bannerConfig = createDefaultBannerState();
  }
  if (!Array.isArray(rawDb.subjectTemplates) || rawDb.subjectTemplates.length === 0) {
    rawDb.subjectTemplates = INITIAL_SCHOOL_SUBJECT_TEMPLATES;
  }
  if (!Array.isArray(rawDb.universities) || rawDb.universities.length === 0) {
    rawDb.universities = INITIAL_UNIVERSITIES;
  }
  if (!Array.isArray(rawDb.programs) || rawDb.programs.length === 0) {
    rawDb.programs = INITIAL_PROGRAMS;
  }
  if (!Array.isArray(rawDb.careers) || rawDb.careers.length === 0) {
    rawDb.careers = INITIAL_CAREERS;
  }
  if ((rawDb.catalogSeedVersion ?? 1) < 2) {
    rawDb.subjectTemplates = mergeById(rawDb.subjectTemplates, INITIAL_SCHOOL_SUBJECT_TEMPLATES);
    rawDb.universities = mergeById(rawDb.universities, INITIAL_UNIVERSITIES);
    // For initial seed v1->v2 upgrade, refresh disciplineCluster on built-in seed programs while preserving user edits & custom items
    const seedProgMap = new Map(INITIAL_PROGRAMS.map((p) => [p.id, p]));
    rawDb.programs = mergeById(rawDb.programs, INITIAL_PROGRAMS).map((p) => {
      const seed = seedProgMap.get(p.id);
      return seed ? { ...p, disciplineCluster: seed.disciplineCluster } : p;
    });
    const seedCareerMap = new Map(INITIAL_CAREERS.map((c) => [c.id, c]));
    rawDb.careers = mergeById(rawDb.careers, INITIAL_CAREERS).map((c) => {
      const seed = seedCareerMap.get(c.id);
      return seed ? { ...seed, ...c } : c;
    });
    rawDb.catalogSeedVersion = 2;
  }
  if (!rawDb.explorationConfig) {
    rawDb.explorationConfig = DEFAULT_EXPLORATION_CATALOG_CONFIG;
  } else {
    rawDb.explorationConfig = {
      ...DEFAULT_EXPLORATION_CATALOG_CONFIG,
      ...rawDb.explorationConfig,
    };
  }
  if (!Array.isArray(rawDb.concepts) || rawDb.concepts.length === 0) {
    rawDb.concepts = INITIAL_CONCEPT_NODES;
  }
  if (!Array.isArray(rawDb.conceptEdges) || rawDb.conceptEdges.length === 0) {
    rawDb.conceptEdges = INITIAL_CONCEPT_EDGES;
  }
  if (!Array.isArray(rawDb.learningPaths) || rawDb.learningPaths.length === 0) {
    rawDb.learningPaths = GUIDED_LEARNING_PATHS;
  }
  if (!Array.isArray(rawDb.scenarios) || rawDb.scenarios.length === 0) {
    rawDb.scenarios = INITIAL_SCENARIOS;
  }
  if (!rawDb.userExplorations || typeof rawDb.userExplorations !== 'object') {
    rawDb.userExplorations = {};
  } else {
    for (const [accId, exp] of Object.entries(rawDb.userExplorations)) {
      const baseIntra = createDefaultIntrapersonalInput();
      rawDb.userExplorations[accId] = {
        ...createEmptyExploration(accId),
        ...exp,
        provisionalTypologies: exp.provisionalTypologies || {},
        bookmarkedProgramIds: exp.bookmarkedProgramIds || [],
        bookmarkedCareerIds: exp.bookmarkedCareerIds || [],
        personalReflectionAnswers: exp.personalReflectionAnswers || {},
        interpretationRealityChecks: exp.interpretationRealityChecks || {},
        readTheoryTopics: Array.isArray(exp.readTheoryTopics) ? exp.readTheoryTopics : [],
        intrapersonal: {
          ...baseIntra,
          ...(exp.intrapersonal || {}),
          workPreferences: {
            ...baseIntra.workPreferences,
            ...(exp.intrapersonal?.workPreferences || {}),
          },
        },
      };
    }
  }
  return rawDb;
}

function loadDatabase(): DynamapDatabase {
  ensureDirs();
  if (!fs.existsSync(DB_PATH)) {
    const seed = createSeedDatabase();
    saveDatabase(seed);
    return seed;
  }
  try {
    const raw = fs.readFileSync(DB_PATH, 'utf8');
    return normalizeDatabase(JSON.parse(raw) as DynamapDatabase);
  } catch {
    const seed = createSeedDatabase();
    saveDatabase(seed);
    return seed;
  }
}

function saveDatabase(db: DynamapDatabase) {
  ensureDirs();
  const tmpPath = `${DB_PATH}.tmp`;
  fs.writeFileSync(tmpPath, JSON.stringify(db, null, 2), 'utf8');
  fs.renameSync(tmpPath, DB_PATH);
}

let db = loadDatabase();

function sanitizeAccount(acc: StoredAccount): Account {
  return {
    id: acc.id,
    username: acc.username,
    role: acc.role,
    linkedProfileId: acc.linkedProfileId,
    displayName: acc.displayName,
    createdAt: acc.createdAt,
  };
}

function sanitizeProfileForViewer(profile: Profile, viewer: Account | null): Profile {
  const isAdmin = viewer?.role === 'admin';
  const isOwner = viewer?.linkedProfileId === profile.id;
  const privacy: ProfilePrivacySettings = {
    ...buildDefaultPrivacySettings(profile),
    ...(profile.privacySettings || {}),
  };

  if (isAdmin) {
    return {
      ...profile,
      privacySettings: privacy,
      hiddenFieldsForViewer: [],
    };
  }

  if (isOwner) {
    return {
      ...profile,
      privacySettings: privacy,
      hiddenFieldsForViewer: [],
      claimCode: undefined,
    };
  }

  const isGroupMember = Boolean(
    viewer?.linkedProfileId &&
      db.studyGroups.some(
        (g) =>
          g.memberProfileIds.includes(profile.id) &&
          g.memberProfileIds.includes(viewer.linkedProfileId!)
      )
  );
  const isClassmate = Boolean(viewer);

  const canView = (level: GranularVisibilityLevel): boolean => {
    if (level === 'public') return true;
    if (level === 'classmates') return isClassmate;
    if (level === 'group_members') return isGroupMember;
    return false; // 'admins' or 'private'
  };

  const hidden: (keyof ProfilePrivacySettings)[] = [];
  if (!canView(privacy.displayName)) hidden.push('displayName');
  if (!canView(privacy.fullName)) hidden.push('fullName');
  if (!canView(privacy.avatar)) hidden.push('avatar');
  if (!canView(privacy.typology)) hidden.push('typology');
  if (!canView(privacy.bio)) hidden.push('bio');
  if (!canView(privacy.reflections)) hidden.push('reflections');
  if (!canView(privacy.idCard)) hidden.push('idCard');

  const hideTypology = hidden.includes('typology');
  const hideBio = hidden.includes('bio');

  return {
    ...profile,
    displayName: hidden.includes('displayName') ? 'Partisipan Privat' : profile.displayName,
    fullName: hidden.includes('fullName') ? '' : profile.fullName,
    photoUrl: hidden.includes('avatar') ? null : profile.photoUrl,
    bio: hideBio ? '' : profile.bio,
    academicInterests: hideBio ? [] : profile.academicInterests,
    collaborationPreferences: hideBio ? '' : profile.collaborationPreferences,
    typology: hideTypology
      ? {
          quadra: '',
          socionics: '',
          enneagramCore: null,
          enneagramRaw: '',
          enneagramWing: '',
          instinctVariant: '',
          instinctStacking: '',
          threeFix: '',
          trifix: '',
          tritype: '',
          tritypeHeart: null,
          tritypeHead: null,
          tritypeGut: null,
          tritypeConvention: 'core-first',
          jungian: '',
          psychosophyCode: '',
          psychosophySelfReported: '',
          psychosophyConfidence: 'Belum Dipastikan',
          psychosophyProvisional: false,
          psychosophyNotes: '',
          mbti: '',
          mbtiCognitiveStack: '',
          sloanCode: '',
          sloanExtended: '',
          temperament: '',
          temperamentSecondary: '',
          customPrefixes: [],
          status: 'Undetermined',
          sourceNote: profile.typology.sourceNote,
        }
      : profile.typology,
    privacySettings: privacy,
    hiddenFieldsForViewer: hidden,
    claimCode: undefined,
  };
}

interface AuthedRequest extends Request {
  userAccount?: StoredAccount | null;
}

function parseCookies(cookieHeader: string | undefined): Record<string, string> {
  if (!cookieHeader) return {};
  const result: Record<string, string> = {};
  for (const part of cookieHeader.split(';')) {
    const idx = part.indexOf('=');
    if (idx > 0) {
      result[part.slice(0, idx).trim()] = decodeURIComponent(part.slice(idx + 1).trim());
    }
  }
  return result;
}

function attachUser(req: AuthedRequest, _res: Response, next: NextFunction) {
  let token: string | undefined;
  const authHeader = req.headers.authorization;
  if (authHeader?.startsWith('Bearer ')) {
    token = authHeader.slice(7).trim();
  } else {
    const cookies = parseCookies(req.headers.cookie);
    token = cookies.dynamap_session;
  }

  if (token) {
    const verified = verifyToken(token);
    if (verified) {
      const found = db.accounts.find((a) => a.id === verified.accountId) || null;
      req.userAccount = found;
    } else {
      req.userAccount = null;
    }
  } else {
    req.userAccount = null;
  }
  next();
}

function requireAuth(req: AuthedRequest, res: Response, next: NextFunction) {
  if (!req.userAccount) {
    res.status(401).json({ error: 'Silakan masuk ke akun terlebih dahulu untuk mengakses fitur ini.' });
    return;
  }
  if (db.settings.mode === 'development' && req.userAccount.role !== 'admin') {
    res.status(403).json({
      error:
        'Mode Pengembangan aktif: akses akun siswa dan partisipan sedang dinonaktifkan sementara oleh Administrator.',
    });
    return;
  }
  next();
}

function requireAdmin(req: AuthedRequest, res: Response, next: NextFunction) {
  if (!req.userAccount || req.userAccount.role !== 'admin') {
    res.status(403).json({ error: 'Akses ditolak. Fitur ini khusus untuk Administrator.' });
    return;
  }
  next();
}

function recordChangeLog(
  profile: Profile,
  field: string,
  previousValue: string,
  newValue: string,
  account: StoredAccount,
  category: ChangeLogEntry['category'],
  snapshotBefore: Partial<Profile>
) {
  const entry: ChangeLogEntry = {
    id: `chg-${Date.now()}-${crypto.randomBytes(3).toString('hex')}`,
    profileId: profile.id,
    profileDisplayName: profile.displayName,
    field,
    previousValue,
    newValue,
    changedBy: account.displayName,
    changedByRole: account.role,
    category,
    timestamp: new Date().toISOString(),
    snapshotBefore,
  };
  db.changeLogs.unshift(entry);
  if (db.changeLogs.length > 500) {
    db.changeLogs = db.changeLogs.slice(0, 500);
  }
}

async function generateGeminiCaseAnalysis(input: CaseAnalysisInput): Promise<StructuredCaseAnalysis> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    return buildStructuredCaseAnalysis(input);
  }

  const ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });

  const prompt = `Anda adalah analis dinamika interpersonal dan pendidikan SMA untuk platform DYNAMAP (Bahasa Indonesia).
Analisis kasus interpersonal berikut secara mendalam, objektif, empatik, dan non-deterministik.
JANGAN memberi skor kecocokan, JANGAN melabeli individu sebagai "toxic" atau "bermasalah", dan JANGAN menganggap tipologi sebagai fakta psikologis mutlak. Bedakan fakta teramati vs asumsi serta sertakan penjelasan non-tipologi.

Data Kasus:
- Judul: ${input.title}
- Konteks Hubungan: ${input.relationshipContext}
- Deskripsi Situasi: ${input.situationDescription}
- Pihak Terlibat: ${input.peopleInvolved}
- Perspektif Masing-Masing: ${input.perspectives}
- Kronologi: ${input.chronology}
- Ekspektasi: ${input.expectations}
- Masalah Utama: ${input.mainProblem}
- Hasil yang Diharapkan: ${input.desiredOutcome}
- Informasi Kepribadian Opsional: ${input.optionalPersonalityInfo || 'Tidak disertakan'}`;

  const response = await Promise.race([
    ai.models.generateContent({
      model: 'gemini-4-hydrogen',
      contents: prompt,
      config: {
        thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
        systemInstruction:
          'Berikan analisis dalam Bahasa Indonesia yang jelas, praktis, mendidik untuk siswa/guru SMA, dan menghindari nasihat klise tanpa langkah konkret.',
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            problemIdentification: { type: Type.STRING },
            perspectiveMapping: { type: Type.ARRAY, items: { type: Type.STRING } },
            facts: { type: Type.ARRAY, items: { type: Type.STRING } },
            assumptions: { type: Type.ARRAY, items: { type: Type.STRING } },
            situationalFactors: { type: Type.ARRAY, items: { type: Type.STRING } },
            communicationBarriers: { type: Type.ARRAY, items: { type: Type.STRING } },
            personalityHypotheses: { type: Type.ARRAY, items: { type: Type.STRING } },
            nonTypologyExplanations: { type: Type.ARRAY, items: { type: Type.STRING } },
            conflictResolutionStrategies: { type: Type.ARRAY, items: { type: Type.STRING } },
            practicalRecommendations: { type: Type.ARRAY, items: { type: Type.STRING } },
            suggestedDialogue: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  situation: { type: Type.STRING },
                  avoid: { type: Type.STRING },
                  trySaying: { type: Type.STRING },
                },
              },
            },
            followUpQuestions: { type: Type.ARRAY, items: { type: Type.STRING } },
            reflectionPrompts: { type: Type.ARRAY, items: { type: Type.STRING } },
          },
        },
      },
    }),
    new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('Gemini request timed out')), 10000)
    ),
  ]);

  const parsed = JSON.parse((response.text ?? '{}').trim());
  return {
    source: 'gemini-ai',
    disclaimer:
      'Hipotesis Kontekstual Berbantuan AI: Analisis ini dihasilkan sebagai bahan eksplorasi dan refleksi. Tetap verifikasi fakta melalui komunikasi langsung dengan pihak terkait.',
    problemIdentification: parsed.problemIdentification || 'Identifikasi masalah belum tersedia.',
    perspectiveMapping: parsed.perspectiveMapping || [],
    factsVsAssumptions: {
      facts: parsed.facts || [],
      assumptions: parsed.assumptions || [],
    },
    situationalFactors: parsed.situationalFactors || [],
    communicationBarriers: parsed.communicationBarriers || [],
    personalityHypotheses: parsed.personalityHypotheses || [],
    nonTypologyExplanations: parsed.nonTypologyExplanations || [],
    conflictResolutionStrategies: parsed.conflictResolutionStrategies || [],
    practicalRecommendations: parsed.practicalRecommendations || [],
    suggestedDialogue: parsed.suggestedDialogue || [],
    followUpQuestions: parsed.followUpQuestions || [],
    reflectionPrompts: parsed.reflectionPrompts || [],
  };
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '6mb' }));
  app.use(attachUser);

  // Serve uploaded profile photos securely
  app.use('/api/uploads', express.static(UPLOADS_DIR));

  // ==================== SYSTEM & BOOTSTRAP ====================
  app.get('/api/bootstrap', (req: AuthedRequest, res: Response) => {
    const viewer = req.userAccount ? sanitizeAccount(req.userAccount) : null;
    const isAdmin = viewer?.role === 'admin';
    const visibleProfiles = db.profiles
      .filter((p) => {
        if (isAdmin) return true;
        if (p.archived) return false;
        if (viewer?.linkedProfileId === p.id) return true;
        const priv = p.privacySettings;
        if (p.visibility === 'private') {
          const allPrivate =
            !priv ||
            (priv.displayName === 'private' &&
              priv.typology === 'private' &&
              priv.bio === 'private' &&
              priv.idCard === 'private');
          if (allPrivate) return false;
        }
        return true;
      })
      .map((p) => sanitizeProfileForViewer(p, viewer));

    const visibleTheory = isAdmin
      ? db.theoryArticles
      : db.theoryArticles.filter((t) => t.published);

    const visibleCases = db.cases.filter(
      (c) => !c.input.isPrivate || (viewer && c.ownerAccountId === viewer.id)
    );

    const aiConfigured = Boolean(
      process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY'
    );

    const userExploration = viewer
      ? db.userExplorations[viewer.id] || createEmptyExploration(viewer.id)
      : null;

    res.json({
      account: viewer,
      settings: db.settings,
      aiConfigured,
      profiles: visibleProfiles,
      studyGroups: db.studyGroups,
      theoryArticles: visibleTheory,
      references: db.references,
      cases: visibleCases,
      publicActivityCount: db.changeLogs.length,
      publishedBanner: db.bannerConfig.published,
      subjectTemplates: db.subjectTemplates,
      universities: db.universities,
      programs: db.programs,
      careers: db.careers,
      concepts: db.concepts,
      conceptEdges: db.conceptEdges,
      learningPaths: db.learningPaths,
      scenarios: db.scenarios,
      explorationConfig: db.explorationConfig,
      userExploration,
    });
  });

  // ==================== AUTH & PROFILE CLAIMING ====================
  app.post('/api/auth/login', (req: Request, res: Response) => {
    const { username, password } = req.body as { username?: string; password?: string };
    if (!username?.trim() || !password) {
      res.status(400).json({ error: 'Nama pengguna dan kata sandi wajib diisi.' });
      return;
    }

    const account = db.accounts.find(
      (a) => a.username.toLowerCase() === username.trim().toLowerCase()
    );
    if (!account || !verifyPassword(password, account.passwordHash, account.salt)) {
      res.status(401).json({ error: 'Nama pengguna atau kata sandi tidak sesuai.' });
      return;
    }

    if (db.settings.mode === 'development' && account.role !== 'admin') {
      res.status(403).json({
        error:
          'Mode Pengembangan aktif: akses akun siswa dan partisipan sedang dinonaktifkan sementara oleh Administrator.',
      });
      return;
    }

    const token = signToken({
      accountId: account.id,
      role: account.role,
      exp: Date.now() + 7 * 24 * 60 * 60 * 1000,
    });

    res.cookie('dynamap_session', token, {
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({ token, account: sanitizeAccount(account) });
  });

  app.post('/api/auth/register-claim', (req: Request, res: Response) => {
    if (db.settings.mode === 'development') {
      res.status(403).json({
        error:
          'Mode Pengembangan aktif: pendaftaran akun dan klaim profil belum dibuka oleh Administrator.',
      });
      return;
    }

    const { username, password, profileId, claimCode } = req.body as {
      username?: string;
      password?: string;
      profileId?: string;
      claimCode?: string;
    };

    if (!username?.trim() || !password || password.length < 6 || !profileId || !claimCode?.trim()) {
      res.status(400).json({
        error:
          'Nama pengguna, kata sandi (minimal 6 karakter), pilihan profil, dan kode verifikasi klaim wajib diisi.',
      });
      return;
    }

    if (db.accounts.some((a) => a.username.toLowerCase() === username.trim().toLowerCase())) {
      res.status(409).json({ error: 'Nama pengguna sudah digunakan. Silakan pilih nama lain.' });
      return;
    }

    const targetProfile = db.profiles.find((p) => p.id === profileId && !p.archived);
    if (!targetProfile) {
      res.status(404).json({ error: 'Profil yang dipilih tidak ditemukan atau telah diarsipkan.' });
      return;
    }

    if (targetProfile.claimedByAccountId) {
      res.status(409).json({
        error:
          'Profil ini sudah tertaut dengan akun lain. Hubungi Administrator bila membutuhkan bantuan pemulihan.',
      });
      return;
    }

    if (
      !targetProfile.claimCode ||
      targetProfile.claimCode.trim().toUpperCase() !== claimCode.trim().toUpperCase()
    ) {
      res.status(403).json({
        error:
          'Kode verifikasi klaim tidak cocok. Anda tidak dapat menautkan akun ke profil hanya dengan mengetikkan nama.',
      });
      return;
    }

    const cred = hashPassword(password);
    const role: AccountRole =
      targetProfile.category === 'Guru' || targetProfile.category === 'Wali Kelas'
        ? 'teacher'
        : targetProfile.category === 'Siswa'
        ? 'student'
        : 'participant';

    const newAccount: StoredAccount = {
      id: `acc-${Date.now()}-${crypto.randomBytes(3).toString('hex')}`,
      username: username.trim(),
      role,
      linkedProfileId: targetProfile.id,
      displayName: targetProfile.displayName,
      createdAt: new Date().toISOString(),
      passwordHash: cred.hash,
      salt: cred.salt,
    };

    targetProfile.claimedByAccountId = newAccount.id;
    targetProfile.updatedAt = new Date().toISOString();
    db.accounts.push(newAccount);

    recordChangeLog(
      targetProfile,
      'Penautan Akun',
      'Belum ditautkan',
      `Ditautkan ke akun ${newAccount.username}`,
      newAccount,
      'Administrasi',
      { claimedByAccountId: null }
    );

    saveDatabase(db);

    const token = signToken({
      accountId: newAccount.id,
      role: newAccount.role,
      exp: Date.now() + 7 * 24 * 60 * 60 * 1000,
    });

    res.cookie('dynamap_session', token, {
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(201).json({
      token,
      account: sanitizeAccount(newAccount),
      profile: sanitizeProfileForViewer(targetProfile, sanitizeAccount(newAccount)),
    });
  });

  app.post('/api/auth/logout', (_req: Request, res: Response) => {
    res.clearCookie('dynamap_session');
    res.json({ ok: true });
  });

  // ==================== PROFILE UPDATES & PHOTO UPLOAD ====================
  app.patch('/api/profiles/:id', requireAuth, (req: AuthedRequest, res: Response) => {
    const account = req.userAccount!;
    const target = db.profiles.find((p) => p.id === req.params.id);
    if (!target) {
      res.status(404).json({ error: 'Profil tidak ditemukan.' });
      return;
    }

    const isAdmin = account.role === 'admin';
    const isOwner = account.linkedProfileId === target.id;
    if (!isAdmin && !isOwner) {
      res.status(403).json({
        error: 'Anda hanya dapat memperbarui profil milik Anda sendiri.',
      });
      return;
    }

    const body = req.body as Partial<Profile>;
    const snapshotBefore: Partial<Profile> = JSON.parse(
      JSON.stringify({
        displayName: target.displayName,
        fullName: target.fullName,
        category: target.category,
        affiliation: target.affiliation,
        visibility: target.visibility,
        exposeFullName: target.exposeFullName,
        privacySettings: target.privacySettings,
        bio: target.bio,
        academicInterests: target.academicInterests,
        learningPreferences: target.learningPreferences,
        collaborationPreferences: target.collaborationPreferences,
        typology: target.typology,
      })
    );

    if (typeof body.displayName === 'string' && body.displayName.trim()) {
      if (body.displayName.trim() !== target.displayName) {
        recordChangeLog(
          target,
          'Nama Tampilan',
          target.displayName,
          body.displayName.trim(),
          account,
          'Identitas',
          snapshotBefore
        );
        target.displayName = body.displayName.trim();
      }
    }

    if (typeof body.fullName === 'string' && body.fullName.trim()) {
      if (isAdmin || isOwner) {
        if (body.fullName.trim() !== target.fullName) {
          recordChangeLog(
            target,
            'Nama Lengkap Internal',
            isAdmin ? target.fullName : '[Dilindungi]',
            isAdmin ? body.fullName.trim() : '[Diperbarui Pemilik]',
            account,
            'Identitas',
            snapshotBefore
          );
          target.fullName = body.fullName.trim();
        }
      }
    }

    if (isAdmin) {
      if (body.category && body.category !== target.category) {
        recordChangeLog(
          target,
          'Kategori Peran',
          target.category,
          body.category,
          account,
          'Administrasi',
          snapshotBefore
        );
        target.category = body.category;
      }
      if (typeof body.affiliation === 'string' && body.affiliation !== target.affiliation) {
        recordChangeLog(
          target,
          'Afiliasi / Kelas',
          target.affiliation,
          body.affiliation,
          account,
          'Administrasi',
          snapshotBefore
        );
        target.affiliation = body.affiliation;
      }
      if (typeof body.archived === 'boolean' && body.archived !== target.archived) {
        recordChangeLog(
          target,
          'Status Arsip',
          target.archived ? 'Diarsipkan' : 'Aktif',
          body.archived ? 'Diarsipkan' : 'Aktif',
          account,
          'Administrasi',
          snapshotBefore
        );
        target.archived = body.archived;
      }
    }

    if (body.visibility && body.visibility !== target.visibility) {
      recordChangeLog(
        target,
        'Visibilitas Profil',
        target.visibility,
        body.visibility,
        account,
        'Privasi',
        snapshotBefore
      );
      target.visibility = body.visibility;
    }

    if (typeof body.exposeFullName === 'boolean' && body.exposeFullName !== target.exposeFullName) {
      recordChangeLog(
        target,
        'Tampilkan Nama Lengkap ke Publik',
        String(target.exposeFullName),
        String(body.exposeFullName),
        account,
        'Privasi',
        snapshotBefore
      );
      target.exposeFullName = body.exposeFullName;
      target.privacySettings = {
        ...buildDefaultPrivacySettings(target),
        ...(target.privacySettings || {}),
        fullName: body.exposeFullName ? 'public' : 'admins',
      };
    }

    if (body.privacySettings) {
      const prevPrivacy = JSON.stringify(target.privacySettings || buildDefaultPrivacySettings(target));
      const mergedPrivacy: ProfilePrivacySettings = {
        ...buildDefaultPrivacySettings(target),
        ...(target.privacySettings || {}),
        ...body.privacySettings,
      };
      const nextPrivacy = JSON.stringify(mergedPrivacy);
      if (prevPrivacy !== nextPrivacy) {
        recordChangeLog(
          target,
          'Pengaturan Privasi Granular',
          prevPrivacy,
          nextPrivacy,
          account,
          'Privasi',
          snapshotBefore
        );
        target.privacySettings = mergedPrivacy;
        target.exposeFullName = mergedPrivacy.fullName === 'public';
      }
    }

    if (typeof body.bio === 'string' && body.bio !== target.bio) {
      recordChangeLog(target, 'Deskripsi Diri', target.bio || '-', body.bio || '-', account, 'Identitas', snapshotBefore);
      target.bio = body.bio;
    }

    if (Array.isArray(body.academicInterests)) {
      target.academicInterests = body.academicInterests.filter((x) => typeof x === 'string' && x.trim());
    }

    if (body.learningPreferences) {
      target.learningPreferences = {
        ...target.learningPreferences,
        ...body.learningPreferences,
      };
    }

    if (typeof body.collaborationPreferences === 'string') {
      target.collaborationPreferences = body.collaborationPreferences;
    }

    if (body.typology) {
      const incomingPsy = body.typology.psychosophyCode;
      if (typeof incomingPsy === 'string' && incomingPsy.trim() !== '') {
        const cleanedPsy = incomingPsy.trim().toUpperCase();
        const validSet = new Set(['L', 'V', 'E', 'F']);
        const chars = cleanedPsy.split('');
        if (
          cleanedPsy.length !== 4 ||
          chars.some((c) => !validSet.has(c)) ||
          new Set(chars).size !== 4
        ) {
          res.status(400).json({
            error:
              'Notasi Psikosofi tidak valid: harus kosong atau tepat 4 huruf unik dari L, V, E, F (misalnya LVEF atau ELVF).',
          });
          return;
        }
        body.typology.psychosophyCode = cleanedPsy;
      }

      const prevTypo = JSON.stringify({
        quadra: target.typology.quadra,
        socionics: target.typology.socionics,
        enneagramRaw: target.typology.enneagramRaw,
        enneagramWing: target.typology.enneagramWing,
        instinctStacking: target.typology.instinctStacking,
        tritype: target.typology.tritype,
        jungian: target.typology.jungian,
        psychosophyCode: target.typology.psychosophyCode || '',
        psychosophyConfidence: target.typology.psychosophyConfidence || 'Belum Dipastikan',
        mbti: target.typology.mbti || '',
        mbtiCognitiveStack: target.typology.mbtiCognitiveStack || '',
        sloanCode: target.typology.sloanCode || '',
        sloanExtended: target.typology.sloanExtended || '',
        temperament: target.typology.temperament || '',
        temperamentSecondary: target.typology.temperamentSecondary || '',
        status: target.typology.status,
      });

      target.typology = {
        ...target.typology,
        ...body.typology,
      };

      if (!isAdmin && isOwner) {
        if (target.typology.status === 'Initial Typing') {
          target.typology.status = 'Self-Reviewed';
        }
        target.typology.sourceNote = 'Self-reported information';
      }

      const nextTypo = JSON.stringify({
        quadra: target.typology.quadra,
        socionics: target.typology.socionics,
        enneagramRaw: target.typology.enneagramRaw,
        enneagramWing: target.typology.enneagramWing,
        instinctStacking: target.typology.instinctStacking,
        tritype: target.typology.tritype,
        jungian: target.typology.jungian,
        psychosophyCode: target.typology.psychosophyCode || '',
        psychosophyConfidence: target.typology.psychosophyConfidence || 'Belum Dipastikan',
        mbti: target.typology.mbti || '',
        mbtiCognitiveStack: target.typology.mbtiCognitiveStack || '',
        sloanCode: target.typology.sloanCode || '',
        sloanExtended: target.typology.sloanExtended || '',
        temperament: target.typology.temperament || '',
        temperamentSecondary: target.typology.temperamentSecondary || '',
        status: target.typology.status,
      });

      if (prevTypo !== nextTypo) {
        recordChangeLog(target, 'Klasifikasi Tipologi', prevTypo, nextTypo, account, 'Tipologi', snapshotBefore);
      }
    }

    target.updatedAt = new Date().toISOString();
    saveDatabase(db);

    res.json({ profile: sanitizeProfileForViewer(target, sanitizeAccount(account)) });
  });

  app.post('/api/profiles/:id/photo', requireAuth, (req: AuthedRequest, res: Response) => {
    const account = req.userAccount!;
    const target = db.profiles.find((p) => p.id === req.params.id);
    if (!target) {
      res.status(404).json({ error: 'Profil tidak ditemukan.' });
      return;
    }
    if (account.role !== 'admin' && account.linkedProfileId !== target.id) {
      res.status(403).json({ error: 'Tidak memiliki izin mengubah foto profil ini.' });
      return;
    }

    const { dataUrl } = req.body as { dataUrl?: string };
    if (!dataUrl || typeof dataUrl !== 'string') {
      res.status(400).json({ error: 'Data gambar tidak valid.' });
      return;
    }

    const match = dataUrl.match(/^data:image\/(png|jpeg|jpg|webp);base64,([A-Za-z0-9+/=]+)$/);
    if (!match) {
      res.status(400).json({ error: 'Format gambar harus PNG, JPG/JPEG, atau WEBP.' });
      return;
    }

    const ext = match[1] === 'jpeg' ? 'jpg' : match[1];
    const buffer = Buffer.from(match[2], 'base64');
    if (buffer.length > 3 * 1024 * 1024) {
      res.status(400).json({ error: 'Ukuran foto maksimal 3 MB.' });
      return;
    }

    ensureDirs();
    if (target.photoUrl?.startsWith('/api/uploads/')) {
      const oldFile = path.join(UPLOADS_DIR, path.basename(target.photoUrl));
      if (fs.existsSync(oldFile)) fs.unlinkSync(oldFile);
    }

    const filename = `${target.id}-${Date.now()}.${ext}`;
    fs.writeFileSync(path.join(UPLOADS_DIR, filename), buffer);

    const prevPhoto = target.photoUrl || 'Tidak ada foto';
    const snapshotBefore: Partial<Profile> = { photoUrl: target.photoUrl };
    target.photoUrl = `/api/uploads/${filename}`;
    target.updatedAt = new Date().toISOString();

    recordChangeLog(target, 'Foto Profil', prevPhoto, target.photoUrl, account, 'Foto', snapshotBefore);
    saveDatabase(db);

    res.json({ profile: sanitizeProfileForViewer(target, sanitizeAccount(account)) });
  });

  app.delete('/api/profiles/:id/photo', requireAuth, (req: AuthedRequest, res: Response) => {
    const account = req.userAccount!;
    const target = db.profiles.find((p) => p.id === req.params.id);
    if (!target) {
      res.status(404).json({ error: 'Profil tidak ditemukan.' });
      return;
    }
    if (account.role !== 'admin' && account.linkedProfileId !== target.id) {
      res.status(403).json({ error: 'Tidak memiliki izin menghapus foto profil ini.' });
      return;
    }

    if (target.photoUrl?.startsWith('/api/uploads/')) {
      const oldFile = path.join(UPLOADS_DIR, path.basename(target.photoUrl));
      if (fs.existsSync(oldFile)) fs.unlinkSync(oldFile);
    }

    const prevPhoto = target.photoUrl || 'Tidak ada foto';
    const snapshotBefore: Partial<Profile> = { photoUrl: target.photoUrl };
    target.photoUrl = null;
    target.updatedAt = new Date().toISOString();

    recordChangeLog(target, 'Foto Profil', prevPhoto, 'Dihapus', account, 'Foto', snapshotBefore);
    saveDatabase(db);

    res.json({ profile: sanitizeProfileForViewer(target, sanitizeAccount(account)) });
  });

  // ==================== ADMIN MANAGEMENT ====================
  app.get('/api/admin/overview', requireAdmin, (_req: AuthedRequest, res: Response) => {
    res.json({
      profiles: db.profiles,
      accounts: db.accounts.map(sanitizeAccount),
      changeLogs: db.changeLogs.slice(0, 150),
      settings: db.settings,
      theoryArticles: db.theoryArticles,
      references: db.references,
      bannerConfig: db.bannerConfig,
      subjectTemplates: db.subjectTemplates,
      universities: db.universities,
      programs: db.programs,
      careers: db.careers,
      concepts: db.concepts,
      conceptEdges: db.conceptEdges,
      learningPaths: db.learningPaths,
      scenarios: db.scenarios,
      explorationConfig: db.explorationConfig,
    });
  });

  // ==================== USER PERSONAL EXPLORATION STATE (PRIVATE) ====================
  app.get('/api/exploration', requireAuth, (req: AuthedRequest, res: Response) => {
    const account = req.userAccount!;
    const current = db.userExplorations[account.id] || createEmptyExploration(account.id);
    res.json({ exploration: current });
  });

  app.put('/api/exploration', requireAuth, (req: AuthedRequest, res: Response) => {
    const account = req.userAccount!;
    const existing = db.userExplorations[account.id] || createEmptyExploration(account.id);
    const body = req.body as Partial<UserExplorationData>;
    const defaultIntra = createDefaultIntrapersonalInput();
    const mergedIntrapersonal =
      body.intrapersonal || existing.intrapersonal
        ? {
            ...defaultIntra,
            ...(existing.intrapersonal || {}),
            ...(body.intrapersonal || {}),
            workPreferences: {
              ...defaultIntra.workPreferences,
              ...(existing.intrapersonal?.workPreferences || {}),
              ...(body.intrapersonal?.workPreferences || {}),
            },
          }
        : undefined;

    const updated: UserExplorationData = {
      ...existing,
      ...body,
      ...(mergedIntrapersonal ? { intrapersonal: mergedIntrapersonal } : {}),
      provisionalTypologies: {
        ...(existing.provisionalTypologies || {}),
        ...(body.provisionalTypologies || {}),
      },
      personalReflectionAnswers: {
        ...(existing.personalReflectionAnswers || {}),
        ...(body.personalReflectionAnswers || {}),
      },
      interpretationRealityChecks: {
        ...(existing.interpretationRealityChecks || {}),
        ...(body.interpretationRealityChecks || {}),
      },
      readTheoryTopics: Array.isArray(body.readTheoryTopics)
        ? Array.from(new Set(body.readTheoryTopics))
        : existing.readTheoryTopics || [],
      ownerAccountId: account.id,
      updatedAt: new Date().toISOString(),
    };
    db.userExplorations[account.id] = updated;
    saveDatabase(db);
    res.json({ exploration: updated });
  });

  // ==================== ADMIN HOMEPAGE BANNER STUDIO ====================
  app.post('/api/admin/banner/upload', requireAdmin, (req: AuthedRequest, res: Response) => {
    const { dataUrl } = req.body as { dataUrl?: string };
    if (!dataUrl || typeof dataUrl !== 'string') {
      res.status(400).json({ error: 'Data gambar spanduk wajib disertakan.' });
      return;
    }
    const match = /^data:image\/(png|jpeg|jpg|webp);base64,([A-Za-z0-9+/=]+)$/.exec(dataUrl);
    if (!match) {
      res.status(400).json({ error: 'Format gambar harus JPG, JPEG, PNG, atau WEBP.' });
      return;
    }
    const ext = match[1] === 'jpeg' ? 'jpg' : match[1];
    const buffer = Buffer.from(match[2], 'base64');
    if (buffer.length > 4 * 1024 * 1024) {
      res.status(400).json({ error: 'Ukuran gambar maksimal 4 MB agar performa halaman tetap cepat.' });
      return;
    }

    ensureDirs();
    const filename = `banner-${Date.now()}-${crypto.randomBytes(2).toString('hex')}.${ext}`;
    fs.writeFileSync(path.join(UPLOADS_DIR, filename), buffer);
    const url = `/api/uploads/${filename}`;
    db.bannerConfig.uploadedAssets.unshift({
      filename,
      url,
      uploadedAt: new Date().toISOString(),
      sizeBytes: buffer.length,
    });
    saveDatabase(db);
    res.status(201).json({ url, filename, uploadedAssets: db.bannerConfig.uploadedAssets });
  });

  app.delete('/api/admin/banner/asset/:filename', requireAdmin, (req: AuthedRequest, res: Response) => {
    const safeName = path.basename(String(req.params.filename || ''));
    if (!safeName || safeName === 'hero_dynamap_research_1794747705329.jpg') {
      res.status(400).json({ error: 'Aset bawaan sistem tidak dapat dihapus.' });
      return;
    }
    const filePath = path.join(UPLOADS_DIR, safeName);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    db.bannerConfig.uploadedAssets = db.bannerConfig.uploadedAssets.filter(
      (a) => a.filename !== safeName
    );
    saveDatabase(db);
    res.json({ uploadedAssets: db.bannerConfig.uploadedAssets });
  });

  app.patch('/api/admin/banner', requireAdmin, (req: AuthedRequest, res: Response) => {
    const account = req.userAccount!;
    const { action, payload } = req.body as {
      action?: 'save_draft' | 'publish';
      payload?: Partial<HomepageBannerPayload>;
    };

    if (!payload || !Array.isArray(payload.slides) || payload.slides.length === 0 || !payload.display) {
      res.status(400).json({ error: 'Minimal satu slide spanduk dan pengaturan tampilan wajib valid.' });
      return;
    }

    const sanitizedPayload: HomepageBannerPayload = {
      slides: payload.slides.map((s, idx) => ({
        id: s.id || `slide-${Date.now()}-${idx}`,
        badgeText: s.badgeText ?? '',
        heading: (s.heading || '').trim() || 'DYNAMAP — Pemetaan Dinamika Interpersonal',
        subtitle: s.subtitle ?? '',
        imageUrl: s.imageUrl ?? null,
        imageAlt: s.imageAlt ?? 'Spanduk utama DYNAMAP',
        primaryButtonText: s.primaryButtonText ?? '',
        primaryButtonTarget: s.primaryButtonTarget || 'analisis-kepribadian',
        secondaryButtonText: s.secondaryButtonText ?? '',
        secondaryButtonTarget: s.secondaryButtonTarget || '',
        backgroundColor: s.backgroundColor || '#FFFFFF',
        textColor: s.textColor || '#0F172A',
        accentColor: s.accentColor || '#4338CA',
        overlayIntensity: s.overlayIntensity || 'none',
        imageFit: s.imageFit || 'cover',
        imageFocus: s.imageFocus || 'center',
        textAlign: s.textAlign || 'left',
      })),
      display: payload.display,
      updatedAt: new Date().toISOString(),
      updatedBy: account.displayName,
    };

    db.bannerConfig.draft = JSON.parse(JSON.stringify(sanitizedPayload)) as HomepageBannerPayload;
    if (action === 'publish') {
      db.bannerConfig.published = JSON.parse(JSON.stringify(sanitizedPayload)) as HomepageBannerPayload;
    }
    saveDatabase(db);
    res.json({ bannerConfig: db.bannerConfig });
  });

  app.post('/api/admin/banner/reset', requireAdmin, (req: AuthedRequest, res: Response) => {
    const { publishImmediately } = (req.body || {}) as { publishImmediately?: boolean };
    const fresh = createDefaultBannerState();
    db.bannerConfig.draft = JSON.parse(JSON.stringify(fresh.draft)) as HomepageBannerPayload;
    if (publishImmediately) {
      db.bannerConfig.published = JSON.parse(JSON.stringify(fresh.published)) as HomepageBannerPayload;
    }
    saveDatabase(db);
    res.json({ bannerConfig: db.bannerConfig });
  });

  // ==================== ADMIN CATALOG & PROVENANCE CRUD ====================
  const ALLOWED_CATALOGS = new Set([
    'subjectTemplates',
    'universities',
    'programs',
    'careers',
    'concepts',
    'conceptEdges',
    'learningPaths',
    'scenarios',
  ]);

  app.post('/api/admin/catalog/:collection', requireAdmin, (req: AuthedRequest, res: Response) => {
    const col = String(req.params.collection);
    if (!ALLOWED_CATALOGS.has(col)) {
      res.status(400).json({ error: 'Koleksi katalog tidak dikenal.' });
      return;
    }
    const item = { ...(req.body as Record<string, unknown>) };
    if (!item.id || typeof item.id !== 'string') {
      item.id = `${col.slice(0, 4)}-${Date.now()}-${crypto.randomBytes(2).toString('hex')}`;
    }
    (db as unknown as Record<string, Record<string, unknown>[]>)[col].unshift(item);
    saveDatabase(db);
    res.status(201).json({ item, list: (db as unknown as Record<string, unknown[]>)[col] });
  });

  app.patch('/api/admin/catalog/:collection/:id', requireAdmin, (req: AuthedRequest, res: Response) => {
    const col = String(req.params.collection);
    if (!ALLOWED_CATALOGS.has(col)) {
      res.status(400).json({ error: 'Koleksi katalog tidak dikenal.' });
      return;
    }
    const arr = (db as unknown as Record<string, Record<string, unknown>[]>)[col];
    const target = arr.find((x) => x.id === req.params.id);
    if (!target) {
      res.status(404).json({ error: 'Entri katalog tidak ditemukan.' });
      return;
    }
    Object.assign(target, req.body);
    saveDatabase(db);
    res.json({ item: target, list: arr });
  });

  app.delete('/api/admin/catalog/:collection/:id', requireAdmin, (req: AuthedRequest, res: Response) => {
    const col = String(req.params.collection);
    if (!ALLOWED_CATALOGS.has(col)) {
      res.status(400).json({ error: 'Koleksi katalog tidak dikenal.' });
      return;
    }
    const arr = (db as unknown as Record<string, Record<string, unknown>[]>)[col];
    const idx = arr.findIndex((x) => x.id === req.params.id);
    if (idx === -1) {
      res.status(404).json({ error: 'Entri katalog tidak ditemukan.' });
      return;
    }
    arr.splice(idx, 1);
    saveDatabase(db);
    res.json({ ok: true, list: arr });
  });

  app.put('/api/admin/exploration-config', requireAdmin, (req: AuthedRequest, res: Response) => {
    const incoming = req.body as Partial<ExplorationCatalogConfig>;
    db.explorationConfig = {
      ...db.explorationConfig,
      ...incoming,
    };
    saveDatabase(db);
    res.json({ explorationConfig: db.explorationConfig });
  });

  app.post('/api/admin/profiles', requireAdmin, (req: AuthedRequest, res: Response) => {
    const account = req.userAccount!;
    const {
      displayName,
      fullName,
      category,
      affiliation,
      bio,
      visibility,
      exposeFullName,
      academicInterests,
      collaborationPreferences,
      typology: incomingTypology,
      privacySettings: incomingPrivacy,
    } = req.body as {
      displayName?: string;
      fullName?: string;
      category?: ProfileCategory;
      affiliation?: string;
      bio?: string;
      visibility?: 'public' | 'limited' | 'private';
      exposeFullName?: boolean;
      academicInterests?: string[];
      collaborationPreferences?: string;
      typology?: Partial<Profile['typology']>;
      privacySettings?: Partial<ProfilePrivacySettings>;
    };

    if (!displayName?.trim() || !fullName?.trim() || !category) {
      res.status(400).json({ error: 'Nama tampilan, nama lengkap, dan kategori peran wajib diisi.' });
      return;
    }

    const id = `usr-${Date.now()}-${crypto.randomBytes(2).toString('hex')}`;
    const randomCode = `DYN-${crypto.randomBytes(3).toString('hex').toUpperCase()}`;

    const newProfile: Profile = {
      id,
      displayName: displayName.trim(),
      fullName: fullName.trim(),
      category,
      affiliation: affiliation?.trim() || category,
      datasetOrigin: 'added',
      archived: false,
      visibility: visibility || 'public',
      exposeFullName: Boolean(exposeFullName),
      privacySettings: {
        ...buildDefaultPrivacySettings({ visibility: visibility || 'public', exposeFullName: Boolean(exposeFullName) }),
        ...(incomingPrivacy || {}),
      },
      photoUrl: null,
      bio: bio?.trim() || '',
      academicInterests: Array.isArray(academicInterests) ? academicInterests : [],
      learningPreferences: { ...DEFAULT_LEARNING_PREFERENCES },
      collaborationPreferences: collaborationPreferences?.trim() || '',
      typology: {
        quadra: incomingTypology?.quadra ?? '',
        socionics: incomingTypology?.socionics ?? '',
        enneagramCore: incomingTypology?.enneagramCore ?? null,
        enneagramRaw: incomingTypology?.enneagramRaw ?? '',
        enneagramWing: incomingTypology?.enneagramWing ?? '',
        instinctVariant: incomingTypology?.instinctVariant ?? '',
        instinctStacking: incomingTypology?.instinctStacking ?? '',
        threeFix: incomingTypology?.threeFix ?? '',
        trifix: incomingTypology?.trifix ?? '',
        tritype: incomingTypology?.tritype ?? '',
        tritypeHeart: incomingTypology?.tritypeHeart ?? null,
        tritypeHead: incomingTypology?.tritypeHead ?? null,
        tritypeGut: incomingTypology?.tritypeGut ?? null,
        tritypeConvention: incomingTypology?.tritypeConvention ?? 'core-first',
        jungian: incomingTypology?.jungian ?? '',
        psychosophyCode: incomingTypology?.psychosophyCode ?? '',
        psychosophySelfReported: incomingTypology?.psychosophySelfReported ?? '',
        psychosophyConfidence: incomingTypology?.psychosophyConfidence ?? 'Belum Dipastikan',
        psychosophyProvisional: incomingTypology?.psychosophyProvisional ?? true,
        psychosophyNotes: incomingTypology?.psychosophyNotes ?? '',
        mbti: incomingTypology?.mbti ?? '',
        mbtiCognitiveStack: incomingTypology?.mbtiCognitiveStack ?? '',
        sloanCode: incomingTypology?.sloanCode ?? '',
        sloanExtended: incomingTypology?.sloanExtended ?? '',
        temperament: incomingTypology?.temperament ?? '',
        temperamentSecondary: incomingTypology?.temperamentSecondary ?? '',
        customPrefixes: incomingTypology?.customPrefixes ?? [],
        status: incomingTypology?.status ?? 'Undetermined',
        sourceNote: 'Administrator-entered initial data',
      },
      claimedByAccountId: null,
      claimCode: randomCode,
      updatedAt: new Date().toISOString(),
    };

    db.profiles.push(newProfile);
    recordChangeLog(
      newProfile,
      'Profil Baru',
      'Tidak ada',
      `${newProfile.displayName} (${newProfile.category})`,
      account,
      'Administrasi',
      {}
    );
    saveDatabase(db);

    res.status(201).json({ profile: newProfile });
  });

  app.delete('/api/admin/profiles/:id', requireAdmin, (req: AuthedRequest, res: Response) => {
    const account = req.userAccount!;
    const idx = db.profiles.findIndex((p) => p.id === req.params.id);
    if (idx === -1) {
      res.status(404).json({ error: 'Profil tidak ditemukan.' });
      return;
    }
    const target = db.profiles[idx];
    const mode = req.query.permanent === 'true' ? 'permanent' : 'archive';

    if (mode === 'permanent') {
      if (target.photoUrl?.startsWith('/api/uploads/')) {
        const oldFile = path.join(UPLOADS_DIR, path.basename(target.photoUrl));
        if (fs.existsSync(oldFile)) fs.unlinkSync(oldFile);
      }
      db.profiles.splice(idx, 1);
      recordChangeLog(target, 'Hapus Permanen', target.displayName, 'Dihapus', account, 'Administrasi', target);
    } else {
      target.archived = true;
      target.updatedAt = new Date().toISOString();
      recordChangeLog(target, 'Arsip Profil', 'Aktif', 'Diarsipkan', account, 'Administrasi', { archived: false });
    }

    saveDatabase(db);
    res.json({ ok: true });
  });

  app.post('/api/admin/profiles/:id/restore/:logId', requireAdmin, (req: AuthedRequest, res: Response) => {
    const account = req.userAccount!;
    const target = db.profiles.find((p) => p.id === req.params.id);
    const log = db.changeLogs.find((c) => c.id === req.params.logId && c.profileId === req.params.id);
    if (!target || !log || !log.snapshotBefore) {
      res.status(404).json({ error: 'Riwayat versi tidak ditemukan atau tidak memiliki snapshot pemulihan.' });
      return;
    }

    const currentSnapshot: Partial<Profile> = JSON.parse(
      JSON.stringify({
        displayName: target.displayName,
        fullName: target.fullName,
        category: target.category,
        affiliation: target.affiliation,
        visibility: target.visibility,
        exposeFullName: target.exposeFullName,
        privacySettings: target.privacySettings,
        bio: target.bio,
        typology: target.typology,
      })
    );

    Object.assign(target, log.snapshotBefore);
    target.updatedAt = new Date().toISOString();

    recordChangeLog(
      target,
      `Pulihkan Versi (${log.field})`,
      log.newValue,
      log.previousValue,
      account,
      'Administrasi',
      currentSnapshot
    );
    saveDatabase(db);

    res.json({ profile: target });
  });

  app.post('/api/admin/profiles/bulk-update', requireAdmin, (req: AuthedRequest, res: Response) => {
    const account = req.userAccount!;
    const { profileIds, patch } = req.body as {
      profileIds?: string[];
      patch?: {
        affiliation?: string;
        category?: ProfileCategory;
        visibility?: 'public' | 'limited' | 'private';
        status?: Profile['typology']['status'];
        quadra?: Profile['typology']['quadra'];
        socionics?: Profile['typology']['socionics'];
        mbti?: string;
        sloanCode?: string;
        temperament?: string;
      };
    };

    if (!Array.isArray(profileIds) || profileIds.length === 0 || !patch) {
      res.status(400).json({ error: 'Pilih minimal satu profil dan parameter pembaruan massal.' });
      return;
    }

    const updatedProfiles: Profile[] = [];
    for (const id of profileIds) {
      const target = db.profiles.find((p) => p.id === id);
      if (!target) continue;
      const snapshotBefore: Partial<Profile> = JSON.parse(
        JSON.stringify({
          category: target.category,
          affiliation: target.affiliation,
          visibility: target.visibility,
          typology: target.typology,
        })
      );

      const changes: string[] = [];
      if (patch.affiliation && patch.affiliation.trim() !== target.affiliation) {
        target.affiliation = patch.affiliation.trim();
        changes.push(`Afiliasi=${target.affiliation}`);
      }
      if (patch.category && patch.category !== target.category) {
        target.category = patch.category;
        changes.push(`Kategori=${target.category}`);
      }
      if (patch.visibility && patch.visibility !== target.visibility) {
        target.visibility = patch.visibility;
        changes.push(`Visibilitas=${target.visibility}`);
      }
      if (patch.status && patch.status !== target.typology.status) {
        target.typology.status = patch.status;
        changes.push(`Status=${target.typology.status}`);
      }
      if (patch.quadra !== undefined && patch.quadra !== target.typology.quadra) {
        target.typology.quadra = patch.quadra;
        changes.push(`Quadra=${patch.quadra || '-'}`);
      }
      if (patch.socionics !== undefined && patch.socionics !== target.typology.socionics) {
        target.typology.socionics = patch.socionics;
        changes.push(`Socionics=${patch.socionics || '-'}`);
      }
      if (typeof patch.mbti === 'string' && patch.mbti !== (target.typology.mbti || '')) {
        target.typology.mbti = patch.mbti.toUpperCase();
        changes.push(`MBTI=${target.typology.mbti || '-'}`);
      }
      if (typeof patch.sloanCode === 'string' && patch.sloanCode !== (target.typology.sloanCode || '')) {
        target.typology.sloanCode = patch.sloanCode.toUpperCase();
        changes.push(`SLOAN=${target.typology.sloanCode || '-'}`);
      }
      if (typeof patch.temperament === 'string' && patch.temperament !== (target.typology.temperament || '')) {
        target.typology.temperament = patch.temperament;
        changes.push(`Temperamen=${target.typology.temperament || '-'}`);
      }

      if (changes.length > 0) {
        target.updatedAt = new Date().toISOString();
        recordChangeLog(
          target,
          'Pembaruan Massal Admin',
          'Multi-kolom sebelumnya',
          changes.join(', '),
          account,
          'Administrasi',
          snapshotBefore
        );
        updatedProfiles.push(target);
      }
    }

    saveDatabase(db);
    res.json({ updatedCount: updatedProfiles.length, profiles: updatedProfiles });
  });

  app.post('/api/admin/profiles/import-csv', requireAdmin, (req: AuthedRequest, res: Response) => {
    const account = req.userAccount!;
    const { rows } = req.body as {
      rows?: Array<{
        id?: string;
        displayName: string;
        fullName?: string;
        category?: ProfileCategory;
        affiliation?: string;
        socionics?: Profile['typology']['socionics'];
        quadra?: Profile['typology']['quadra'];
        enneagramRaw?: string;
        enneagramWing?: string;
        instinctStacking?: Profile['typology']['instinctStacking'];
        tritype?: string;
        jungian?: string;
        psychosophyCode?: string;
        mbti?: string;
        mbtiCognitiveStack?: string;
        sloanCode?: string;
        sloanExtended?: string;
        temperament?: string;
        temperamentSecondary?: string;
        status?: Profile['typology']['status'];
      }>;
    };

    if (!Array.isArray(rows) || rows.length === 0) {
      res.status(400).json({ error: 'Tidak ada baris CSV valid yang dikirim.' });
      return;
    }

    let updatedCount = 0;
    let createdCount = 0;

    for (const row of rows) {
      if (!row.displayName?.trim()) continue;
      if (row.psychosophyCode && row.psychosophyCode.trim()) {
        const cleaned = row.psychosophyCode.trim().toUpperCase();
        const validSet = new Set(['L', 'V', 'E', 'F']);
        if (cleaned.length !== 4 || cleaned.split('').some((c) => !validSet.has(c)) || new Set(cleaned.split('')).size !== 4) {
          res.status(400).json({ error: `Notasi Psikosofi tidak valid pada baris "${row.displayName}": ${row.psychosophyCode}` });
          return;
        }
      }

      const existing = row.id ? db.profiles.find((p) => p.id === row.id) : undefined;
      if (existing) {
        const snapshotBefore: Partial<Profile> = JSON.parse(
          JSON.stringify({
            displayName: existing.displayName,
            fullName: existing.fullName,
            category: existing.category,
            affiliation: existing.affiliation,
            typology: existing.typology,
          })
        );
        existing.displayName = row.displayName.trim();
        if (row.fullName !== undefined) existing.fullName = row.fullName.trim();
        if (row.category) existing.category = row.category;
        if (row.affiliation !== undefined) existing.affiliation = row.affiliation.trim();
        existing.typology = {
          ...existing.typology,
          ...(row.socionics !== undefined ? { socionics: row.socionics } : {}),
          ...(row.quadra !== undefined ? { quadra: row.quadra } : {}),
          ...(row.enneagramRaw !== undefined ? { enneagramRaw: row.enneagramRaw } : {}),
          ...(row.enneagramWing !== undefined ? { enneagramWing: row.enneagramWing } : {}),
          ...(row.instinctStacking !== undefined ? { instinctStacking: row.instinctStacking } : {}),
          ...(row.tritype !== undefined ? { tritype: row.tritype, trifix: row.tritype ? `${row.tritype} (Trifix)` : '' } : {}),
          ...(row.jungian !== undefined ? { jungian: row.jungian } : {}),
          ...(row.psychosophyCode !== undefined ? { psychosophyCode: row.psychosophyCode.toUpperCase() } : {}),
          ...(row.mbti !== undefined ? { mbti: row.mbti.toUpperCase() } : {}),
          ...(row.mbtiCognitiveStack !== undefined ? { mbtiCognitiveStack: row.mbtiCognitiveStack } : {}),
          ...(row.sloanCode !== undefined ? { sloanCode: row.sloanCode.toUpperCase() } : {}),
          ...(row.sloanExtended !== undefined ? { sloanExtended: row.sloanExtended } : {}),
          ...(row.temperament !== undefined ? { temperament: row.temperament } : {}),
          ...(row.temperamentSecondary !== undefined ? { temperamentSecondary: row.temperamentSecondary } : {}),
          ...(row.status ? { status: row.status } : {}),
        };
        existing.updatedAt = new Date().toISOString();
        recordChangeLog(existing, 'Impor CSV Admin', 'Data sebelum impor', 'Diperbarui via CSV', account, 'Administrasi', snapshotBefore);
        updatedCount += 1;
      } else {
        const newId = row.id?.trim() || `usr-${Date.now()}-${crypto.randomBytes(2).toString('hex')}`;
        const randomCode = `DYN-${crypto.randomBytes(3).toString('hex').toUpperCase()}`;
        const created: Profile = {
          id: newId,
          displayName: row.displayName.trim(),
          fullName: (row.fullName || row.displayName).trim(),
          category: row.category || 'Siswa',
          affiliation: row.affiliation?.trim() || 'Siswa Kelas XII',
          datasetOrigin: 'added',
          archived: false,
          visibility: 'public',
          exposeFullName: false,
          privacySettings: buildDefaultPrivacySettings({ visibility: 'public', exposeFullName: false }),
          photoUrl: null,
          bio: '',
          academicInterests: [],
          learningPreferences: { ...DEFAULT_LEARNING_PREFERENCES },
          collaborationPreferences: '',
          typology: {
            quadra: row.quadra || '',
            socionics: row.socionics || '',
            enneagramCore: null,
            enneagramRaw: row.enneagramRaw || '',
            enneagramWing: row.enneagramWing || '',
            instinctVariant: '',
            instinctStacking: row.instinctStacking || '',
            threeFix: '',
            trifix: row.tritype ? `${row.tritype} (Trifix)` : '',
            tritype: row.tritype || '',
            tritypeHeart: null,
            tritypeHead: null,
            tritypeGut: null,
            tritypeConvention: 'core-first',
            jungian: row.jungian || '',
            psychosophyCode: (row.psychosophyCode || '').toUpperCase(),
            psychosophySelfReported: '',
            psychosophyConfidence: 'Belum Dipastikan',
            psychosophyProvisional: true,
            psychosophyNotes: '',
            mbti: (row.mbti || '').toUpperCase(),
            mbtiCognitiveStack: row.mbtiCognitiveStack || '',
            sloanCode: (row.sloanCode || '').toUpperCase(),
            sloanExtended: row.sloanExtended || '',
            temperament: row.temperament || '',
            temperamentSecondary: row.temperamentSecondary || '',
            customPrefixes: [],
            status: row.status || 'Undetermined',
            sourceNote: 'Administrator-entered initial data',
          },
          claimedByAccountId: null,
          claimCode: randomCode,
          updatedAt: new Date().toISOString(),
        };
        db.profiles.push(created);
        recordChangeLog(created, 'Impor CSV Admin (Baru)', 'Tidak ada', `${created.displayName}`, account, 'Administrasi', {});
        createdCount += 1;
      }
    }

    saveDatabase(db);
    res.json({ updatedCount, createdCount, profiles: db.profiles });
  });

  app.post('/api/admin/profiles/:id/regenerate-claim-code', requireAdmin, (req: AuthedRequest, res: Response) => {
    const target = db.profiles.find((p) => p.id === req.params.id);
    if (!target) {
      res.status(404).json({ error: 'Profil tidak ditemukan.' });
      return;
    }
    target.claimCode = `DYN-${crypto.randomBytes(3).toString('hex').toUpperCase()}`;
    target.updatedAt = new Date().toISOString();
    saveDatabase(db);
    res.json({ claimCode: target.claimCode, profile: target });
  });

  app.patch('/api/admin/settings', requireAdmin, (req: AuthedRequest, res: Response) => {
    db.settings = {
      ...db.settings,
      ...(req.body as Partial<SystemSettings>),
    };
    saveDatabase(db);
    res.json({ settings: db.settings });
  });

  app.get('/api/admin/export', requireAdmin, (_req: AuthedRequest, res: Response) => {
    res.setHeader('Content-Disposition', 'attachment; filename="dynamap-backup.json"');
    res.json({
      exportedAt: new Date().toISOString(),
      settings: db.settings,
      profiles: db.profiles,
      changeLogs: db.changeLogs,
      theoryArticles: db.theoryArticles,
      references: db.references,
      studyGroups: db.studyGroups,
    });
  });

  // Admin Content Management (Module M)
  app.post('/api/admin/theory', requireAdmin, (req: AuthedRequest, res: Response) => {
    const account = req.userAccount!;
    const body = req.body as Partial<TheoryArticle>;
    if (!body.title?.trim() || !body.content?.trim() || !body.category) {
      res.status(400).json({ error: 'Judul, kategori, dan isi artikel teori wajib diisi.' });
      return;
    }
    const article: TheoryArticle = {
      id: `art-${Date.now()}`,
      title: body.title.trim(),
      category: body.category,
      summary: body.summary?.trim() || '',
      content: body.content.trim(),
      references: Array.isArray(body.references) ? body.references : [],
      published: body.published !== false,
      updatedAt: new Date().toISOString(),
      updatedBy: account.displayName,
    };
    db.theoryArticles.unshift(article);
    saveDatabase(db);
    res.status(201).json({ article });
  });

  app.patch('/api/admin/theory/:id', requireAdmin, (req: AuthedRequest, res: Response) => {
    const account = req.userAccount!;
    const target = db.theoryArticles.find((t) => t.id === req.params.id);
    if (!target) {
      res.status(404).json({ error: 'Artikel teori tidak ditemukan.' });
      return;
    }
    Object.assign(target, req.body, {
      updatedAt: new Date().toISOString(),
      updatedBy: account.displayName,
    });
    saveDatabase(db);
    res.json({ article: target });
  });

  app.post('/api/admin/references', requireAdmin, (req: AuthedRequest, res: Response) => {
    const body = req.body as Partial<ReferenceCitation>;
    if (!body.author?.trim() || !body.title?.trim() || !body.framework) {
      res.status(400).json({ error: 'Penulis, judul referensi, dan kerangka teori wajib diisi.' });
      return;
    }
    const ref: ReferenceCitation = {
      id: `ref-${Date.now()}`,
      author: body.author.trim(),
      year: body.year?.trim() || '-',
      title: body.title.trim(),
      framework: body.framework,
      note: body.note?.trim() || '',
    };
    db.references.push(ref);
    saveDatabase(db);
    res.status(201).json({ reference: ref });
  });

  // ==================== PRIVATE REFLECTIONS (MODULE J & I.6) ====================
  // Strictly owned by req.userAccount — administrators do NOT automatically access other users' private reflections.
  app.get('/api/reflections', requireAuth, (req: AuthedRequest, res: Response) => {
    const account = req.userAccount!;
    res.json({
      interpersonal: db.reflections.filter((r) => r.ownerAccountId === account.id),
      academic: db.academicReflections.filter((r) => r.ownerAccountId === account.id),
    });
  });

  app.post('/api/reflections/interpersonal', requireAuth, (req: AuthedRequest, res: Response) => {
    const account = req.userAccount!;
    const body = req.body as Partial<ReflectionRecord>;
    if (!body.title?.trim() || !body.whatHappened?.trim()) {
      res.status(400).json({ error: 'Judul refleksi dan deskripsi kejadian wajib diisi.' });
      return;
    }
    const now = new Date().toISOString();
    const record: ReflectionRecord = {
      id: `refl-${Date.now()}`,
      ownerAccountId: account.id,
      ownerProfileId: account.linkedProfileId,
      title: body.title.trim(),
      date: body.date || now.slice(0, 10),
      whatHappened: body.whatHappened.trim(),
      myInterpretation: body.myInterpretation?.trim() || '',
      otherPerspective: body.otherPerspective?.trim() || '',
      supportingEvidence: body.supportingEvidence?.trim() || '',
      possibleAssumptions: body.possibleAssumptions?.trim() || '',
      whatToCommunicateDifferently: body.whatToCommunicateDifferently?.trim() || '',
      nextStepAction: body.nextStepAction?.trim() || '',
      createdAt: now,
      updatedAt: now,
    };
    db.reflections.unshift(record);
    saveDatabase(db);
    res.status(201).json({ record });
  });

  app.patch('/api/reflections/interpersonal/:id', requireAuth, (req: AuthedRequest, res: Response) => {
    const account = req.userAccount!;
    const target = db.reflections.find(
      (r) => r.id === req.params.id && r.ownerAccountId === account.id
    );
    if (!target) {
      res.status(404).json({ error: 'Catatan refleksi tidak ditemukan atau bukan milik Anda.' });
      return;
    }
    Object.assign(target, req.body, { updatedAt: new Date().toISOString() });
    saveDatabase(db);
    res.json({ record: target });
  });

  app.delete('/api/reflections/interpersonal/:id', requireAuth, (req: AuthedRequest, res: Response) => {
    const account = req.userAccount!;
    const idx = db.reflections.findIndex(
      (r) => r.id === req.params.id && r.ownerAccountId === account.id
    );
    if (idx === -1) {
      res.status(404).json({ error: 'Catatan refleksi tidak ditemukan atau bukan milik Anda.' });
      return;
    }
    db.reflections.splice(idx, 1);
    saveDatabase(db);
    res.json({ ok: true });
  });

  app.post('/api/reflections/academic', requireAuth, (req: AuthedRequest, res: Response) => {
    const account = req.userAccount!;
    const body = req.body as Partial<AcademicReflectionRecord>;
    if (!body.subject?.trim() || !body.contribution?.trim()) {
      res.status(400).json({ error: 'Mata pelajaran dan catatan kontribusi wajib diisi.' });
      return;
    }
    const now = new Date().toISOString();
    const record: AcademicReflectionRecord = {
      id: `acrefl-${Date.now()}`,
      ownerAccountId: account.id,
      subject: body.subject.trim(),
      date: body.date || now.slice(0, 10),
      contribution: body.contribution.trim(),
      studyApproach: body.studyApproach?.trim() || '',
      collaborationDifficulty: body.collaborationDifficulty?.trim() || '',
      feedbackReceived: body.feedbackReceived?.trim() || '',
      effectiveStrategies: body.effectiveStrategies?.trim() || '',
      improvementAreas: body.improvementAreas?.trim() || '',
      createdAt: now,
    };
    db.academicReflections.unshift(record);
    saveDatabase(db);
    res.status(201).json({ record });
  });

  app.delete('/api/reflections/academic/:id', requireAuth, (req: AuthedRequest, res: Response) => {
    const account = req.userAccount!;
    const idx = db.academicReflections.findIndex(
      (r) => r.id === req.params.id && r.ownerAccountId === account.id
    );
    if (idx === -1) {
      res.status(404).json({ error: 'Catatan refleksi akademik tidak ditemukan.' });
      return;
    }
    db.academicReflections.splice(idx, 1);
    saveDatabase(db);
    res.json({ ok: true });
  });

  // ==================== STUDY GROUPS (MODULE I.4) ====================
  app.post('/api/study-groups', (req: AuthedRequest, res: Response) => {
    const body = req.body as Partial<StudyGroup>;
    if (!body.name?.trim() || !body.subject?.trim()) {
      res.status(400).json({ error: 'Nama kelompok belajar dan mata pelajaran wajib diisi.' });
      return;
    }
    const now = new Date().toISOString();
    const group: StudyGroup = {
      id: `sg-${Date.now()}`,
      name: body.name.trim(),
      subject: body.subject.trim(),
      topic: body.topic?.trim() || '',
      learningGoals: body.learningGoals?.trim() || '',
      memberProfileIds: Array.isArray(body.memberProfileIds) ? body.memberProfileIds : [],
      tasks: Array.isArray(body.tasks) ? body.tasks : [],
      collaborationReview: body.collaborationReview?.trim() || '',
      outcomeEvaluation: body.outcomeEvaluation?.trim() || '',
      createdByAccountId: req.userAccount?.id || null,
      createdAt: now,
      updatedAt: now,
    };
    db.studyGroups.unshift(group);
    saveDatabase(db);
    res.status(201).json({ group });
  });

  app.patch('/api/study-groups/:id', (req: AuthedRequest, res: Response) => {
    const group = db.studyGroups.find((g) => g.id === req.params.id);
    if (!group) {
      res.status(404).json({ error: 'Kelompok belajar tidak ditemukan.' });
      return;
    }
    Object.assign(group, req.body, { updatedAt: new Date().toISOString() });
    saveDatabase(db);
    res.json({ group });
  });

  // ==================== CASE ANALYSIS (MODULE G) ====================
  app.post('/api/cases/analyze', async (req: AuthedRequest, res: Response) => {
    const input = req.body as CaseAnalysisInput;
    if (!input.title?.trim() || !input.situationDescription?.trim() || !input.mainProblem?.trim()) {
      res.status(400).json({
        error: 'Judul kasus, deskripsi situasi, dan masalah utama wajib diisi sebelum dianalisis.',
      });
      return;
    }

    let analysis: StructuredCaseAnalysis;
    try {
      analysis = await generateGeminiCaseAnalysis(input);
    } catch {
      analysis = buildStructuredCaseAnalysis(input);
      analysis.disclaimer =
        'Layanan analisis AI eksternal sedang tidak tersedia atau mengalami kendala jaringan; hasil disusun menggunakan kerangka analisis terstruktur lokal DYNAMAP.';
    }

    const record: CaseRecord = {
      id: `case-${Date.now()}`,
      ownerAccountId: req.userAccount?.id || null,
      input: {
        ...input,
        isPrivate: input.isPrivate !== false, // Private by default!
      },
      analysis,
      createdAt: new Date().toISOString(),
    };

    if (req.userAccount || !record.input.isPrivate) {
      db.cases.unshift(record);
      saveDatabase(db);
    }

    res.json({ caseRecord: record });
  });

  // ==================== VITE / STATIC SERVING ====================
  const isProd = process.env.NODE_ENV === 'production' && fs.existsSync(path.resolve(process.cwd(), 'dist'));
  if (isProd) {
    const distDir = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distDir));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distDir, 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  const PORT = 3000;
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`DYNAMAP server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start DYNAMAP server:', err);
  process.exit(1);
});
