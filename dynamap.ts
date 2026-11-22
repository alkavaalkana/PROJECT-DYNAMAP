export type ProfileCategory =
  | 'Siswa'
  | 'Guru'
  | 'Wali Kelas'
  | 'Staf Sekolah'
  | 'Partisipan Lainnya';

export type DatasetOrigin = 'initial_37' | 'added';

export type TypologyStatus =
  | 'Initial Typing'
  | 'Self-Reviewed'
  | 'Revised'
  | 'Undetermined';

export type QuadraName = 'Alpha' | 'Beta' | 'Gamma' | 'Delta';

export type SocionicsCode =
  | 'ILE'
  | 'SEI'
  | 'ESE'
  | 'LII'
  | 'EIE'
  | 'LSI'
  | 'SLE'
  | 'IEI'
  | 'SEE'
  | 'ILI'
  | 'LIE'
  | 'ESI'
  | 'LSE'
  | 'EII'
  | 'IEE'
  | 'SLI';

export type InformationElement =
  | 'Te'
  | 'Ti'
  | 'Fe'
  | 'Fi'
  | 'Se'
  | 'Si'
  | 'Ne'
  | 'Ni';

export type InstinctCode = 'SP' | 'SO' | 'SX';

export type InstinctualStacking =
  | 'SP/SO'
  | 'SP/SX'
  | 'SO/SP'
  | 'SO/SX'
  | 'SX/SP'
  | 'SX/SO';

export type EnneagramCore = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
export type HeartFix = 2 | 3 | 4;
export type HeadFix = 5 | 6 | 7;
export type GutFix = 8 | 9 | 1;

export type TritypeConvention = 'core-first' | 'center-order';

export type PsychosophyAspect = 'L' | 'V' | 'E' | 'F';
export type PsychosophyPositionNumber = 1 | 2 | 3 | 4;
export type PsychosophyConfidence =
  | 'Belum Dipastikan'
  | 'Provisional / Dugaan Awal'
  | 'Cukup Yakin'
  | 'Terkonfirmasi Mandiri';

export interface CustomTypologyField {
  label: string;
  value: string;
}

export interface LearningPreferences {
  studySetting: 'Mandiri' | 'Kelompok' | 'Fleksibel' | '';
  explanationStyle: 'Verbal / Naratif' | 'Visual / Diagram' | 'Campuran' | '';
  structureStyle: 'Terstruktur & Terjadwal' | 'Fleksibel & Eksploratif' | 'Campuran' | '';
  workMode: 'Diskusi Aktif' | 'Kerja Mandiri Mendalam' | 'Kombinasi' | '';
  examplePreference: 'Contoh Konkret Terlebih Dahulu' | 'Konsep Abstrak Terlebih Dahulu' | 'Seimbang' | '';
  feedbackStyle: 'Umpan Balik Langsung & Lugas' | 'Umpan Balik Bertahap & Halus' | 'Diskusi Dua Arah' | '';
  sessionLength: 'Sesi Singkat Terfokus (25-30 menit)' | 'Sesi Panjang Mendalam (60+ menit)' | 'Bervariasi' | '';
  notes: string;
}

export interface ProfileTypology {
  quadra: QuadraName | '';
  socionics: SocionicsCode | '';
  enneagramCore: EnneagramCore | null;
  enneagramRaw: string; // e.g. "SO3", "SP4", "SX6", or ""
  enneagramWing: string; // e.g. "3w2", ""
  instinctVariant: InstinctCode | '';
  instinctStacking: InstinctualStacking | '';
  threeFix: string; // e.g. "2-5-8"
  trifix: string; // e.g. "258 (Trifix)"
  tritype: string; // e.g. "258"
  tritypeHeart: HeartFix | null;
  tritypeHead: HeadFix | null;
  tritypeGut: GutFix | null;
  tritypeConvention: TritypeConvention;
  jungian: string; // e.g. "ET(N)", "IF(S)"
  psychosophyCode: string; // e.g. "LVEF" or ""
  psychosophySelfReported?: string; // optional self-reported type if different from assigned/initial
  psychosophyConfidence?: PsychosophyConfidence;
  psychosophyProvisional?: boolean;
  psychosophyNotes?: string;
  mbti?: string; // optional explicit MBTI 4-letter code (e.g. "INTJ")
  mbtiCognitiveStack?: string; // optional explicit/editable cognitive stack (e.g. "Ni – Te – Fi – Se")
  sloanCode?: string; // optional standard 5-letter SLOAN (e.g. "RCOAI")
  sloanExtended?: string; // optional community extended notation (e.g. "[R]cO/A/I")
  temperament?: string; // primary temperament (e.g. "Melankolis", "Sanguinis", etc.)
  temperamentSecondary?: string; // optional mixed/secondary temperament
  customPrefixes: CustomTypologyField[];
  status: TypologyStatus;
  sourceNote: 'Administrator-entered initial data' | 'Self-reported information' | 'Revised collaboratively';
}

export type GranularVisibilityLevel =
  | 'public'
  | 'classmates'
  | 'group_members'
  | 'admins'
  | 'private';

export interface ProfilePrivacySettings {
  displayName: GranularVisibilityLevel;
  fullName: GranularVisibilityLevel;
  avatar: GranularVisibilityLevel;
  typology: GranularVisibilityLevel;
  bio: GranularVisibilityLevel;
  reflections: GranularVisibilityLevel;
  idCard: GranularVisibilityLevel;
}

export interface Profile {
  id: string;
  displayName: string;
  fullName: string;
  category: ProfileCategory;
  affiliation: string;
  datasetOrigin: DatasetOrigin;
  archived: boolean;
  visibility: 'public' | 'limited' | 'private';
  exposeFullName: boolean;
  privacySettings?: ProfilePrivacySettings;
  hiddenFieldsForViewer?: (keyof ProfilePrivacySettings)[];
  photoUrl: string | null;
  bio: string;
  academicInterests: string[];
  learningPreferences: LearningPreferences;
  collaborationPreferences: string;
  typology: ProfileTypology;
  claimedByAccountId: string | null;
  claimCode?: string;
  updatedAt: string;
}

export type AccountRole = 'admin' | 'student' | 'teacher' | 'participant';

export interface Account {
  id: string;
  username: string;
  role: AccountRole;
  linkedProfileId: string | null;
  displayName: string;
  createdAt: string;
}

export interface ChangeLogEntry {
  id: string;
  profileId: string;
  profileDisplayName: string;
  field: string;
  previousValue: string;
  newValue: string;
  changedBy: string;
  changedByRole: AccountRole | 'system';
  category:
    | 'Identitas'
    | 'Tipologi'
    | 'Foto'
    | 'Preferensi'
    | 'Privasi'
    | 'Status'
    | 'Administrasi';
  timestamp: string;
  snapshotBefore?: Partial<Profile>;
}

export interface ReflectionRecord {
  id: string;
  ownerAccountId: string;
  ownerProfileId: string | null;
  title: string;
  date: string;
  whatHappened: string;
  myInterpretation: string;
  otherPerspective: string;
  supportingEvidence: string;
  possibleAssumptions: string;
  whatToCommunicateDifferently: string;
  nextStepAction: string;
  createdAt: string;
  updatedAt: string;
}

export interface AcademicReflectionRecord {
  id: string;
  ownerAccountId: string;
  subject: string;
  date: string;
  contribution: string;
  studyApproach: string;
  collaborationDifficulty: string;
  feedbackReceived: string;
  effectiveStrategies: string;
  improvementAreas: string;
  createdAt: string;
}

export type StudyGroupRole =
  | 'Koordinator'
  | 'Peneliti'
  | 'Analis Data'
  | 'Penulis Laporan'
  | 'Presenter'
  | 'Desainer Visual'
  | 'Evaluator'
  | 'Dokumentator';

export interface StudyGroupTask {
  id: string;
  title: string;
  assigneeProfileId: string;
  assigneeName: string;
  role: StudyGroupRole;
  deadline: string;
  status: 'Belum Mulai' | 'Sedang Dikerjakan' | 'Selesai';
  contributionNote: string;
}

export interface StudyGroup {
  id: string;
  name: string;
  subject: string;
  topic: string;
  learningGoals: string;
  memberProfileIds: string[];
  tasks: StudyGroupTask[];
  collaborationReview: string;
  outcomeEvaluation: string;
  createdByAccountId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CaseAnalysisInput {
  title: string;
  situationDescription: string;
  peopleInvolved: string;
  perspectives: string;
  chronology: string;
  expectations: string;
  mainProblem: string;
  desiredOutcome: string;
  optionalPersonalityInfo: string;
  relationshipContext: string;
  isPrivate: boolean;
}

export interface StructuredCaseAnalysis {
  source: 'gemini-ai' | 'structured-workflow';
  disclaimer: string;
  problemIdentification: string;
  perspectiveMapping: string[];
  factsVsAssumptions: {
    facts: string[];
    assumptions: string[];
  };
  situationalFactors: string[];
  communicationBarriers: string[];
  personalityHypotheses: string[];
  nonTypologyExplanations: string[];
  conflictResolutionStrategies: string[];
  practicalRecommendations: string[];
  suggestedDialogue: {
    situation: string;
    avoid: string;
    trySaying: string;
  }[];
  followUpQuestions: string[];
  reflectionPrompts: string[];
}

export interface CaseRecord {
  id: string;
  ownerAccountId: string | null;
  input: CaseAnalysisInput;
  analysis: StructuredCaseAnalysis;
  createdAt: string;
}

export interface TheoryArticle {
  id: string;
  title: string;
  category: 'Socionics' | 'Enneagram' | 'Tipologi Jung' | 'Psikosofi' | 'Komunikasi' | 'Akademik';
  summary: string;
  content: string;
  references: string[];
  published: boolean;
  updatedAt: string;
  updatedBy: string;
}

export interface ReferenceCitation {
  id: string;
  author: string;
  year: string;
  title: string;
  framework: 'Socionics' | 'Enneagram' | 'Tipologi Jung' | 'Psikosofi' | 'Pendidikan & Psikologi Belajar';
  note: string;
}

export type SystemMode = 'development' | 'student_access';

export interface SystemSettings {
  mode: SystemMode;
  requireAdminApprovalForTypology: boolean;
  allowPublicGallery: boolean;
  schoolName: string;
  classLabel: string;
}

// ==================== HOMEPAGE BANNER (ADMIN-CUSTOMIZABLE) ====================
export type BannerHeightPreset = 'compact' | 'standard' | 'tall';
export type BannerImageFit = 'cover' | 'contain';
export type BannerImageFocus = 'center' | 'top' | 'bottom' | 'left' | 'right';
export type BannerTextAlignment = 'left' | 'center' | 'right';
export type BannerTextPosition = 'split-left' | 'overlay-bottom' | 'overlay-center' | 'top-banner';
export type BannerButtonVariant = 'solid' | 'outline' | 'soft';
export type BannerRadiusPreset = 'none' | 'md' | 'xl' | '2xl';
export type BannerOverlayIntensity = 'none' | 'light' | 'medium' | 'strong';

export interface HomepageBannerSlide {
  id: string;
  badgeText: string;
  heading: string;
  subtitle: string;
  imageUrl: string | null;
  imageAlt: string;
  primaryButtonText: string;
  primaryButtonTarget: string; // NavModuleId or https:// URL
  secondaryButtonText: string;
  secondaryButtonTarget: string;
  backgroundColor: string;
  textColor: string;
  accentColor: string;
  overlayIntensity: BannerOverlayIntensity;
  imageFit: BannerImageFit;
  imageFocus: BannerImageFocus;
  textAlign: BannerTextAlignment;
}

export interface HomepageBannerDisplaySettings {
  enabled: boolean;
  mode: 'single' | 'carousel';
  autoAdvance: boolean;
  autoAdvanceSeconds: number;
  showIndicators: boolean;
  showArrows: boolean;
  heightPreset: BannerHeightPreset;
  textPosition: BannerTextPosition;
  buttonVariant: BannerButtonVariant;
  borderRadius: BannerRadiusPreset;
}

export interface HomepageBannerPayload {
  slides: HomepageBannerSlide[];
  display: HomepageBannerDisplaySettings;
  updatedAt: string;
  updatedBy: string;
}

export interface HomepageBannerState {
  published: HomepageBannerPayload;
  draft: HomepageBannerPayload;
  uploadedAssets: {
    filename: string;
    url: string;
    uploadedAt: string;
    sizeBytes: number;
  }[];
}

// ==================== PROVENANCE & CATALOG METADATA ====================
export type ProvenanceStatus =
  | 'Terverifikasi Resmi'
  | 'Sekunder'
  | 'Input Pengguna'
  | 'Perlu Konfirmasi';

export interface ProvenanceInfo {
  sourceTitle: string;
  officialUrl: string;
  institution: string;
  academicYear: string;
  lastVerified: string;
  verificationStatus: ProvenanceStatus;
  notes?: string;
}

// ==================== MODULE B: CONCEPTS, COMPARISONS & LEARNING PATHS ====================
export type ConceptFrameworkCategory =
  | 'Socionics'
  | 'Enneagram'
  | 'Psikosofi'
  | 'Tipologi Jung'
  | 'Lintas Kerangka'
  | 'Belajar & Kolaborasi';

export type ConceptRelationshipType =
  | 'Same Framework'
  | 'Structural Relationship'
  | 'Conceptual Similarity'
  | 'Analogy'
  | 'Cross-Framework Association'
  | 'Independent Concepts';

export interface ConceptNode {
  id: string;
  label: string;
  shortCode: string;
  framework: ConceptFrameworkCategory;
  subGroup: string;
  summary: string;
  definition: string;
  keyMechanism: string;
  misconception: string;
  targetModule: string; // NavModuleId
  x: number;
  y: number;
}

export interface ConceptEdge {
  id: string;
  sourceId: string;
  targetId: string;
  relationshipType: ConceptRelationshipType;
  label: string;
  explanation: string;
  cautionNote: string;
}

export interface ConceptComparisonResult {
  id: string;
  conceptIds: [string, string];
  title: string;
  definitions: { code: string; name: string; framework: string; definition: string }[];
  sharedCharacteristics: string[];
  fundamentalDifferences: string[];
  theoreticalAssumptions: string[];
  coreMechanisms: string[];
  everydayExamples: string[];
  commonMisconceptions: string[];
  whenTheyLookSimilar: string[];
  distinguishingQuestions: string[];
  analyticalLimitations: string[];
  crossFrameworkCaution: string;
}

export interface LearningPathStep {
  id: string;
  stepNumber: number;
  title: string;
  summary: string;
  prerequisiteIds: string[];
  estimatedMinutes: number;
  targetModule: string; // NavModuleId
  keyTakeaways: string[];
  selfCheckPrompt: string;
}

export interface LearningPathDefinition {
  id: string;
  framework: 'Socionics' | 'Psikosofi' | 'Enneagram';
  title: string;
  description: string;
  steps: LearningPathStep[];
}

// ==================== MODULE C: SCENARIOS & EVIDENCE EXPLORATION ====================
export interface ScenarioOption {
  id: string;
  label: string;
  tag: string;
  contextualNature: 'Kontekstual' | 'Struktural' | 'Komunikatif' | 'Adaptif';
  indications: string[];
  relevantConcepts: { conceptId: string; label: string; framework: string; targetModule: string }[];
  alternativeExplanations: string[];
  followUpQuestions: string[];
}

export interface ExplorationScenario {
  id: string;
  title: string;
  category: 'Kolaborasi Kelas' | 'Konflik Interpersonal' | 'Pengambilan Keputusan' | 'Gaya Belajar' | 'Kepemimpinan Kelompok';
  context: string;
  dilemmaPrompt: string;
  options: ScenarioOption[];
  limitationsNote: string;
}

export interface EvidenceExercise {
  id: string;
  title: string;
  scenarioText: string;
  observedBehaviors: string[];
  possibleInterpretations: string[];
  typologicalHypotheses: string[];
  alternativeNonTypologicalExplanations: string[];
  requiredAdditionalEvidence: string[];
}

// ==================== MODULE A: PERSONAL EXPLORATION & MAPPING ====================
export type PersonalConceptStatus =
  | 'Terkonfirmasi'
  | 'Hipotesis Provisional'
  | 'Alternatif Lain'
  | 'Belum Dijelajahi';

export interface PersonalKnowledgeNode {
  id: string;
  category:
    | 'Identitas'
    | 'Socionics'
    | 'Enneagram'
    | 'Psikosofi'
    | 'Tipologi Jung'
    | 'Preferensi Belajar'
    | 'Minat Akademik'
    | 'Kekuatan & Pengembangan'
    | 'Refleksi Pribadi'
    | 'Arah Eksplorasi';
  label: string;
  shortCode: string;
  status: PersonalConceptStatus;
  summary: string;
  frameworkOrSource: string;
  targetModule?: string;
  x: number;
  y: number;
}

export interface PersonalKnowledgeEdge {
  id: string;
  sourceId: string;
  targetId: string;
  relationshipType: ConceptRelationshipType;
  label: string;
  explanation: string;
}

// ==================== MODULE D & E: SCHOOL SUBJECTS, UNIVERSITIES & PROGRAMS ====================
export type SubjectGroupCategory = 'Peminatan / Spesialisasi' | 'Mata Pelajaran Wajib / Umum';

export interface SchoolSubjectTemplate {
  id: string;
  name: string;
  shortCode: string;
  category: SubjectGroupCategory;
  specializationPack: string; // e.g. "FISKIM MATONOMI" | "Umum SMA"
  coreTopics: string[];
  academicSkills: string[];
  description: string;
}

export interface UserSubjectEntry {
  subjectId: string;
  subjectName: string;
  category: SubjectGroupCategory;
  taken: boolean;
  interestLevel: 'Rendah' | 'Sedang' | 'Tinggi';
  proficiencyLevel: 'Dasar' | 'Cukup Baik' | 'Kuat' | 'Sangat Kuat';
  recentGradeRange: 'Belum Diisi' | '< 75' | '75 - 84' | '85 - 92' | '93 - 100';
  enjoyedTopics: string;
  challengingTopics: string;
  projectsOrCompetitions: string;
}

export interface UniversityInstitution {
  id: string;
  name: string;
  shortName: string;
  city: string;
  province: string;
  type: 'PTN-BH' | 'PTN-BLU' | 'PTN Satker' | 'PTS';
  officialWebsite: string;
  admissionPortalUrl: string;
  admissionRoutes: string[];
  overview: string;
  provenance: ProvenanceInfo;
}

export interface UniversityProgram {
  id: string;
  universityId: string;
  name: string;
  degree: 'S1' | 'D4' | 'D3';
  faculty: string;
  disciplineCluster: string; // Flexible taxonomy (10+ standard disciplines & admin-extensible)
  concentrations?: string[];
  description: string;
  curriculumFocus: string[];
  coreCourses?: string[];
  practicalVsTheory?: string;
  researchOpportunities?: string[];
  competencyRequirements?: {
    analytical: string;
    technical: string;
    communication: string;
    research: string;
    creativity: string;
    quantitative: string;
  };
  keyHighSchoolSubjects: string[];
  importantSupportingSubjects: string[];
  thinkingPatterns: string[];
  studyEnvironment: string;
  admissionNotes: string;
  availableRoutes?: string[];
  formalEligibilityNote?: string;
  tuitionInfo?: string;
  accreditation?: string;
  careerPathIds: string[];
  provenance: ProvenanceInfo;
}

export interface AcademicGapReport {
  program: UniversityProgram;
  university: UniversityInstitution | null;
  studiedRelevantSubjects: { subjectName: string; matchRole: 'Utama' | 'Pendukung'; proficiency: string }[];
  relevantExistingKnowledge: string[];
  strengthAreas: string[];
  missingOrUnstudiedSubjects: string[];
  additionalTopicsToLearn: string[];
  prerequisiteNotes: string[];
  competenciesDevelopedAtUni: string[];
  officialAdmissionRequirements: string[];
  formalEligibilityStatus: 'Terbuka Lintas Jurusan (Verifikasi Tahunan)' | 'Memerlukan Mapel Pendukung Khusus' | 'Perlu Verifikasi Resmi PTN';
  prepActionPlan: string[];
  encouragementNote: string;
}

export type AcademicRecommendationCategory =
  | 'Kesesuaian Minat & Akademik Kuat'
  | 'Potensi Keselarasan Minat'
  | 'Eksplorasi Lintas Disiplin'
  | 'Eksplorasi Bidang Baru'
  | 'Perlu Persiapan Tambahan';

export interface AcademicRecommendationResult {
  program: UniversityProgram;
  university: UniversityInstitution;
  category: AcademicRecommendationCategory;
  academicReasons: string[];
  interestAlignment: string[];
  learningStyleConnection: string[];
  typologyReflectionNote: string;
  preparationNeeds: string[];
  explorationQuestions: string[];
  limitationsDisclaimer: string;
}

export type ThreeLayerCategory =
  | 'Eksplorasi Direkomendasikan'
  | 'Eksplorasi Alternatif'
  | 'Kemungkinan Tak Terduga';

export interface RecommendationReasoningTrail {
  directUserEvidence: string[];
  academicEvidence: string[];
  typologyInterpretation: string[];
  inferredRelationship: string[];
  uncertainAssumptions: string[];
  additionalInfoNeeded: string[];
}

export interface ThreeLayerMajorRecommendation {
  program: UniversityProgram;
  university: UniversityInstitution;
  layer: ThreeLayerCategory;
  whyIncluded: string;
  relevantInterests: string[];
  relevantAcademicExperiences: string[];
  typologicalPerspectives: string;
  importantCompetencies: string[];
  potentialChallenges: string[];
  whatToInvestigate: string[];
  unexpectedWhyNotObvious?: string;
  unexpectedConnectionPoints?: string[];
  unexpectedNewKnowledgeNeeded?: string[];
  unexpectedWhyWorthExploring?: string;
  reasoningTrail: RecommendationReasoningTrail;
  explorationNote: string;
}

export interface ThreeLayerRecommendationBundle {
  recommended: ThreeLayerMajorRecommendation[];
  alternative: ThreeLayerMajorRecommendation[];
  unexpected: ThreeLayerMajorRecommendation[];
  explanatoryNote: string;
}

// ==================== MODULE F & G: CAREERS & ROADMAPS ====================
export type CareerDomainCluster = string;

export interface CareerRecord {
  id: string;
  title: string;
  cluster: CareerDomainCluster;
  summary: string;
  dailyWorkAndProblemSolving: string;
  responsibilities?: string[];
  workEnvironment: string;
  collaborationAndInteraction: string;
  relevantSubjects: string[];
  relatedProgramIds: string[];
  coreSkills: string[];
  workMotivations: string[];
  entryPathways: string[];
  educationPathway?: string;
  certificationOrLicensing?: string;
  growthOpportunities: string[];
  commonMisconceptions: string[];
  workPreferenceTags?: string[];
  provenance: ProvenanceInfo;
}

export interface RoadmapMilestone {
  id: string;
  stageNumber: number;
  stageTitle: string;
  goal: string;
  actionItems: string[];
  status: 'Belum Dimulai' | 'Sedang Berjalan' | 'Selesai';
  notes: string;
}

export interface AcademicCareerRoadmap {
  id: string;
  title: string;
  pathwayType:
    | 'Jalur Utama'
    | 'Jalur Alternatif'
    | 'Jalur Lintas Disiplin'
    | 'Jalur Eksplorasi Bidang Baru';
  targetProgramIds: string[];
  targetCareerIds: string[];
  openQuestions: string;
  milestones: RoadmapMilestone[];
  updatedAt: string;
}

export interface SavedComparisonItem {
  id: string;
  conceptIds: [string, string];
  title: string;
  note: string;
  savedAt: string;
}

export interface SavedScenarioReflection {
  id: string;
  scenarioId: string;
  scenarioTitle: string;
  selectedOptionId: string;
  selectedOptionLabel: string;
  userExplanation: string;
  savedAt: string;
}

export interface WorkEnvironmentPreferences {
  collaboration: 'Mandiri' | 'Kolaboratif' | 'Campuran';
  setting: 'Kantor / Lab' | 'Lapangan / Dinamis' | 'Fleksibel';
  focus: 'Riset & Analisis' | 'Aplikasi Praktis' | 'Seimbang';
  structure: 'Terstruktur Jelas' | 'Fleksibel Eksploratif' | 'Seimbang';
  responsibility: 'Fokus Teknis' | 'Fokus Interpersonal' | 'Seimbang';
  decisionStyle: 'Keputusan Mandiri' | 'Koordinasi Tim' | 'Seimbang';
  pace: 'Ritme Terprediksi' | 'Ritme Dinamis' | 'Bervariasi';
  visibility: 'Di Balik Layar' | 'Berhadapan Publik' | 'Seimbang';
}

export interface IntrapersonalExplorationInput {
  // 4.1 Academic Interests
  enjoyedSubjects: string[];
  curiosityTopics: string[];
  interestingProblems: string;
  voluntaryTopics: string;
  disciplinesToDeepen: string[];
  dislikedDespiteHighScore: string[];
  enjoyedDespiteDifficulty: string[];
  academicInterestNotes: string;
  // 4.2 Cognitive Preferences
  cognitivePreferences: string[];
  // 4.3 Learning Preferences
  learningPreferencesSelected: string[];
  learningPreferenceNotes: string;
  // 4.4 Personal Motivations
  personalMotivationsRanked: string[];
  personalValuesNotes: string;
  // 4.5 Meaningful Activities & Academic Experience
  meaningfulActivities: string[];
  extracurricularExperiences: string;
  // 4.6 Career & Work Preferences
  workPreferences: WorkEnvironmentPreferences;
  careerAspirationsNotes: string;
}

export type TypologyFrameworkKey = 'socionics' | 'enneagram' | 'instinct' | 'psychosophy' | 'jungian';

export interface IndependentTypologySection {
  framework: string;
  codeOrStatus: string;
  isProvisional: boolean;
  available: boolean;
  highlights: string[];
  theoreticalFocus: string;
  boundaryDisclaimer: string;
}

export interface HybridPersonalAnalysis {
  layerOneTypologies: IndependentTypologySection[];
  layerTwoPreferences: {
    summaryPoints: string[];
    highlightInterests: string[];
    paradoxNotes: string[];
  };
  layerThreeAcademicBackground: {
    studiedSummary: string;
    strengthHighlights: string[];
    prepAreas: string[];
    extracurricularNote: string;
  };
  layerFourSynthesis: {
    convergences: string[];
    academicSupportingInterests: string[];
    meaningfulDivergences: string[];
    multiDimensionalFields: string[];
    lowOverlapWorthExploring: string[];
    informationGaps: string[];
  };
}

export interface ExplorationCatalogConfig {
  disciplineClusters: string[];
  academicInterestCategories: string[];
  cognitivePreferenceOptions: string[];
  learningPreferenceOptions: string[];
  motivationOptions: string[];
  activityOptions: string[];
  reflectionPrompts: string[];
}

export interface ColorGradientStop {
  id: string;
  color: string;
  position: number; // 0-100
}

export interface CustomGradientSpec {
  enabled: boolean;
  angle: number; // 0-360
  stops: ColorGradientStop[];
}

export interface SavedCustomColorPalette {
  id: string;
  name: string;
  pageBg: string;
  cardBg: string;
  accent: string;
  textPrimary: string;
  borderColor: string;
  buttonBg: string;
  decorativeColor: string;
  chartPrimary: string;
  chartSecondary: string;
  gradient?: CustomGradientSpec;
  createdAt: string;
}

export interface AdvancedColorPaletteConfig {
  mode: 'basic' | 'advanced';
  pageBg: string;
  pageGradient: CustomGradientSpec;
  cardBg: string;
  accent: string;
  textPrimary: string;
  borderColor: string;
  buttonBg: string;
  decorativeColor: string;
  chartPrimary: string;
  chartSecondary: string;
  sectionOverrides: {
    sidebarBg?: string;
    headerBg?: string;
    heroCardBg?: string;
  };
  savedPalettes: SavedCustomColorPalette[];
  updatedAt: string;
}

export type TypologyIdCardTheme =
  | 'minimal'
  | 'modern'
  | 'futuristic'
  | 'academic'
  | 'dark'
  | 'pastel';

export type TypologyIdCardLayout = 'editorial' | 'passport' | 'crest';
export type TypologyIdCardFont = 'editorial-mix' | 'modern-sans' | 'classic-serif' | 'technical-mono';
export type TypologyIdCardTexture = 'none' | 'dots' | 'grid' | 'constellation' | 'linen';

export type TypologyIdCardFieldKey =
  | 'socionics'
  | 'quadra'
  | 'jungian'
  | 'mbti'
  | 'enneagram'
  | 'instincts'
  | 'tritype'
  | 'psychosophy'
  | 'temperament'
  | 'sloan'
  | 'sloanExtended'
  | 'custom'
  | 'updatedAt';

export interface TypologyIdCardFieldOverride {
  label?: string;
  value?: string;
}

export interface TypologyIdCardConfig {
  theme: TypologyIdCardTheme;
  accentColor: string;
  layout: TypologyIdCardLayout;
  primarySpotlight: 'auto' | 'socionics' | 'mbti' | 'enneagram' | 'jungian' | 'psychosophy' | 'sloan' | 'temperament';
  showAvatar: boolean;
  showProfileId: boolean;
  tagline: string;
  visibleFields: TypologyIdCardFieldKey[];
  // Expanded customization controls (all optional for full backwards-compatibility)
  fontStyle?: TypologyIdCardFont;
  textScale?: number; // 0.85 to 1.25
  textAlign?: 'left' | 'center' | 'right';
  cardPaddingScale?: number; // 0.85 to 1.2
  texture?: TypologyIdCardTexture;
  borderStyle?: 'hairline' | 'double' | 'glow' | 'none';
  shadowDepth?: 'soft' | 'deep' | 'flat';
  showDecorations?: boolean;
  customGradient?: CustomGradientSpec;
  customCardBg?: string;
  customTextPrimary?: string;
  customBorderColor?: string;
  customDecorativeColor?: string;
  customImageUrl?: string;
  avatarPositionX?: number; // 0-100 (%)
  avatarPositionY?: number; // 0-100 (%)
  avatarZoom?: number; // 1.0 - 2.0
  backSummaryTitle?: string;
  backSummaryNotes?: string;
  showAcademicInterestsOnBack?: boolean;
  showValuesOnBack?: boolean;
  fieldOverrides?: Partial<Record<TypologyIdCardFieldKey, TypologyIdCardFieldOverride>>;
  skipRevealAnimation?: boolean;
  updatedAt: string;
}

export interface TypologyIdCardTemplatePreset {
  id: string;
  name: string;
  config: TypologyIdCardConfig;
  createdAt: string;
}

export interface SavedPlaygroundConfig {
  id: string;
  title: string;
  module: 'function-builder' | 'dichotomy' | 'enneagram' | 'psychosophy' | 'sloan' | 'temperament' | 'comparison';
  summary: string;
  payload: Record<string, unknown>;
  createdAt: string;
}

export type ArcadeFramework =
  | 'Socionics'
  | 'MBTI'
  | 'Jungian'
  | 'Enneagram'
  | 'Wings'
  | 'Instincts'
  | 'InstinctualStacking'
  | 'Tritype'
  | 'Psychosophy'
  | 'SLOAN'
  | 'Temperament'
  | 'Campuran';

export type ArcadeGameId =
  | 'match-up'
  | 'function-builder'
  | 'detective'
  | 'quadra-sort'
  | 'type-cipher'
  | 'memory'
  | 'blitz'
  | 'reconstruction'
  | 'mistype-hunter'
  | 'scenario-lens'
  | 'wheel'
  | 'escape-room';

export type ArcadeMode = 'free-play' | 'daily' | 'campaign' | 'random';
export type ArcadeDifficulty = 'dasar' | 'menengah' | 'lanjutan';

export interface ArcadeSessionRecord {
  id: string;
  gameId: ArcadeGameId;
  mode: ArcadeMode;
  frameworks: ArcadeFramework[];
  difficulty: ArcadeDifficulty;
  score: number;
  maxScore: number;
  correctCount: number;
  totalQuestions: number;
  durationSeconds: number;
  completed: boolean;
  campaignLevel?: number;
  dailyDateKey?: string;
  playedAt: string;
}

export interface SavedCaseStudyAttempt {
  id: string;
  caseId: string;
  caseTitle: string;
  selectedFrameworks: string[];
  checkedEvidenceIds: string[];
  selectedInterpretationIds: string[];
  reasoningNote: string;
  savedAt: string;
}

export type RealityCheckRating =
  | 'Sangat sesuai'
  | 'Sebagian besar sesuai'
  | 'Sebagian sesuai'
  | 'Kurang sesuai'
  | 'Masih ragu';

export interface InterpretationRealityCheck {
  id: string;
  statementId: string;
  statementTitle: string;
  layer: 'overview' | 'framework' | 'composite' | 'contradiction';
  rating: RealityCheckRating;
  note: string;
  realLifeExample: string;
  updatedAt: string;
  history: {
    rating: RealityCheckRating;
    note: string;
    recordedAt: string;
  }[];
}

export interface InterpretationProvenance {
  supportingProfileData: string[];
  frameworksInvolved: string[];
  theoreticalExplanation: string;
  theoryReferences: string[];
  synthesisKind: 'direct-framework' | 'cross-synthesis';
  epistemicLabel: 'Pengetahuan Teoretis Terkurasi' | 'Interpretasi Tipologis Terstruktur' | 'Penjelasan Berbantuan AI' | 'Refleksi Pribadi Pengguna';
  limitationsAndAlternatives: string[];
}

export interface InterpretedStatement {
  id: string;
  topic: string;
  statement: string;
  available: boolean;
  missingReason?: string;
  provenance: InterpretationProvenance;
}

export type ContradictionCategory =
  | 'Inkonsistensi Data'
  | 'Perbedaan Antar-Kerangka'
  | 'Kecenderungan Kontekstual'
  | 'Motivasi Berlawanan'
  | 'Kognitif vs Perilaku'
  | 'Ketidakcocokan Interpretasi Populer'
  | 'Informasi Belum Lengkap';

export interface ContradictionItem {
  id: string;
  category: ContradictionCategory;
  severity: 'perhatian' | 'nuansa' | 'info';
  title: string;
  frameworksOrFields: string[];
  explanation: string;
  coexistenceGuidance: string;
  reflectionQuestion: string;
}

export interface FrameworkBreakdownItem {
  frameworkKey: string;
  frameworkName: string;
  available: boolean;
  codeDisplay: string;
  summary: string;
  coreMechanisms: string[];
  unavailableAspects: string[];
  provenance: InterpretationProvenance;
}

export interface MultiLayerPersonalInterpretation {
  completenessRatio: number;
  filledFrameworks: string[];
  missingFrameworks: string[];
  interpretableAspects: string[];
  unavailableAspects: string[];
  overviewStatements: InterpretedStatement[];
  frameworkBreakdowns: FrameworkBreakdownItem[];
  compositeDynamics: InterpretedStatement[];
  contradictions: ContradictionItem[];
  overallEpistemicNote: string;
}

export interface DirectionalInteractionFlow {
  direction: 'A_TO_B' | 'B_TO_A';
  fromName: string;
  toName: string;
  intendedCommunication: string;
  receiverInterpretation: string;
  misunderstandingRisk: string;
  complementarySynergy: string;
  frictionPoint: string;
  typologyEvidence: string[];
  adjustmentSuggestion: string;
}

export interface DirectionalDynamicsMap {
  personAName: string;
  personBName: string;
  personACodeSummary: string;
  personBCodeSummary: string;
  aToB: DirectionalInteractionFlow;
  bToA: DirectionalInteractionFlow;
  sharedGround: string[];
  keyDivergences: string[];
  collaborationStrategy: string;
}

export type MasteryLevel =
  | 'Belum Mulai'
  | 'Pengenalan'
  | 'Berkembang'
  | 'Terampil'
  | 'Penguasaan Lanjut';

export interface FrameworkMasterySummary {
  framework: string;
  topicsReadCount: number;
  topicsTotalCount: number;
  stepsCompletedCount: number;
  stepsTotalCount: number;
  quizAttemptsCount: number;
  quizAccuracy: number;
  caseAttemptsCount: number;
  readingProgressPct: number;
  demonstratedMasteryPct: number;
  masteryLevel: MasteryLevel;
  reviewSuggestion: string;
}

export interface LearningTimelineItem {
  id: string;
  kind: 'baca-teori' | 'arcade' | 'studi-kasus' | 'skenario' | 'jalur-belajar';
  title: string;
  framework: string;
  detail: string;
  timestamp: string;
}

export interface UserExplorationData {
  ownerAccountId: string;
  conceptStatuses: Record<string, PersonalConceptStatus>;
  unresolvedQuestions: string[];
  savedComparisons: SavedComparisonItem[];
  completedLearningSteps: string[];
  bookmarkedLearningSteps: string[];
  scenarioReflections: SavedScenarioReflection[];
  userSubjects: UserSubjectEntry[];
  specializationLabel: string;
  interestTopics: string[];
  problemSolvingPreference: 'Terstruktur & Analitis' | 'Eksperimental & Kreatif' | 'Kolaboratif & Sosial' | 'Seimbang';
  theoryVsPracticePreference: 'Teoretis & Konseptual' | 'Terapan & Praktis' | 'Seimbang';
  workMotivationTags: string[];
  preferredMapLayout: Record<string, { x: number; y: number }>;
  roadmaps: AcademicCareerRoadmap[];
  provisionalTypologies?: Partial<Record<TypologyFrameworkKey, boolean>>;
  intrapersonal?: IntrapersonalExplorationInput;
  bookmarkedProgramIds?: string[];
  bookmarkedCareerIds?: string[];
  personalReflectionAnswers?: Record<string, string>;
  idCardConfig?: TypologyIdCardConfig;
  customIdCardTemplates?: TypologyIdCardTemplatePreset[];
  themePaletteConfig?: AdvancedColorPaletteConfig;
  playgroundConfigs?: SavedPlaygroundConfig[];
  arcadeHistory?: ArcadeSessionRecord[];
  arcadeDailyCompletions?: Record<string, { score: number; completedAt: string }>;
  savedCaseStudies?: SavedCaseStudyAttempt[];
  interpretationRealityChecks?: Record<string, InterpretationRealityCheck>;
  readTheoryTopics?: string[];
  updatedAt: string;
}
