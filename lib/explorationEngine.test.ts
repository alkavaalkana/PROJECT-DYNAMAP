import assert from 'node:assert/strict';
import test from 'node:test';
import {
  CURATED_COMPARISONS,
  INITIAL_CONCEPT_NODES,
  INITIAL_SCENARIOS,
} from '../data/conceptsAndPathsData';
import {
  INITIAL_CAREERS,
  INITIAL_PROGRAMS,
  INITIAL_UNIVERSITIES,
  createDefaultIntrapersonalInput,
  createDefaultUserSubjects,
} from '../data/higherEdAndCareerData';
import { createInitial37Profiles } from '../data/initialDataset';
import {
  analyzeAcademicGap,
  analyzeTypologyConsistency,
  buildAcademicRecommendations,
  buildPersonalKnowledgeGraph,
  compareConceptsStructured,
  evaluateScenarioResponse,
} from './explorationEngine';
import {
  analyzeHybridPersonalProfile,
  buildThreeLayerRecommendations,
  rankCareersByPreferences,
} from './hybridExplorationEngine';
import type { Profile, UserExplorationData } from '../types/dynamap';

test('buildPersonalKnowledgeGraph respects private reflections flag and produces typed edges', () => {
  const guestGraph = buildPersonalKnowledgeGraph({
    profile: null,
    exploration: null,
    interpersonalReflectionsCount: 5,
    academicReflectionsCount: 2,
    isOwnerViewingPrivate: false,
  });

  const reflNodeGuest = guestGraph.nodes.find((n) => n.id === 'pm-reflections');
  assert.ok(reflNodeGuest);
  assert.equal(reflNodeGuest.label, 'Refleksi Pribadi (Privat)');
  assert.ok(guestGraph.edges.some((e) => e.relationshipType === 'Cross-Framework Association'));

  const ownerGraph = buildPersonalKnowledgeGraph({
    profile: null,
    exploration: null,
    interpersonalReflectionsCount: 3,
    academicReflectionsCount: 2,
    isOwnerViewingPrivate: true,
  });
  const reflNodeOwner = ownerGraph.nodes.find((n) => n.id === 'pm-reflections');
  assert.ok(reflNodeOwner?.label.includes('5 catatan'));
});

test('compareConceptsStructured returns curated 10-part comparison and generates cross-framework caution dynamically', () => {
  const curated = compareConceptsStructured('soc-te', 'soc-ti', INITIAL_CONCEPT_NODES, CURATED_COMPARISONS);
  assert.ok(curated);
  assert.equal(curated.definitions.length, 2);
  assert.ok(curated.distinguishingQuestions.length >= 1);

  const dynamicCross = compareConceptsStructured(
    'soc-fe',
    'psy-1v',
    INITIAL_CONCEPT_NODES,
    CURATED_COMPARISONS
  );
  assert.ok(dynamicCross);
  assert.ok(dynamicCross.crossFrameworkCaution.includes('PERINGATAN LINTAS KERANGKA'));
  assert.ok(dynamicCross.whenTheyLookSimilar.length >= 1);
});

test('evaluateScenarioResponse evaluates contextual choice without deterministic typing', () => {
  const scen = INITIAL_SCENARIOS[0];
  const contextualOpt = scen.options.find((o) => o.contextualNature === 'Kontekstual');
  assert.ok(contextualOpt);

  const output = evaluateScenarioResponse(
    scen,
    contextualOpt.id,
    'Karena energi tim perlu dijaga sebelum mengejar ide baru.'
  );
  assert.ok(output);
  assert.ok(output.limitations.includes('tidak menetapkan tipe kepribadian'));
  assert.ok(output.alternativeExplanations.length >= 1);
});

test('analyzeTypologyConsistency catches Quadra mismatch and invalid Psychosophy while keeping cross-framework independence', () => {
  const res = analyzeTypologyConsistency({
    socionics: 'LIE',
    quadra: 'Alpha', // mismatch! LIE is Gamma
    jungian: 'ET(N)',
    enneagramCore: '3',
    instinct: 'SO',
    tritype: '351',
    psychosophy: 'LLVE', // invalid duplicate L
  });

  const socVal = res.notationValidations.find((v) => v.framework === 'Socionics');
  const psyVal = res.notationValidations.find((v) => v.framework === 'Psikosofi');
  assert.equal(socVal?.status, 'Valid');
  assert.equal(psyVal?.status, 'Tidak Valid');
  assert.ok(res.internalConsistencyNotes.some((n) => n.includes('Gamma')));
  assert.ok(res.crossFrameworkIndependence.some((n) => n.includes('mustahil')));
});

test('analyzeAcademicGap identifies FISKIM MATONOMI strengths and 6-part bridge without disqualification for Bioteknologi & Psikologi', () => {
  const subjects = createDefaultUserSubjects().map((s) =>
    s.subjectName === 'Kimia' || s.subjectName === 'Fisika' || s.subjectName === 'Matematika Lanjut'
      ? { ...s, proficiencyLevel: 'Kuat' as const, interestLevel: 'Tinggi' as const }
      : s
  );
  const biotek = INITIAL_PROGRAMS.find((p) => p.id === 'prog-unpad-biotek');
  assert.ok(biotek);
  const uni = INITIAL_UNIVERSITIES.find((u) => u.id === biotek.universityId) || null;

  const report = analyzeAcademicGap(subjects, biotek, uni);
  assert.ok(report.studiedRelevantSubjects.some((s) => s.subjectName === 'Kimia'));
  assert.ok(report.missingOrUnstudiedSubjects.includes('Biologi'));
  assert.ok(report.encouragementNote.includes('BUKAN berarti Anda tidak cocok'));
  assert.ok(report.relevantExistingKnowledge.length >= 1);
  assert.ok(report.additionalTopicsToLearn.length >= 1);
  assert.ok(report.prerequisiteNotes.length >= 1);
  assert.ok(report.competenciesDevelopedAtUni.length >= 1);
  assert.ok(report.officialAdmissionRequirements.length >= 1);
  assert.ok(report.formalEligibilityStatus);

  const psiko = INITIAL_PROGRAMS.find((p) => p.id === 'prog-ui-psikologi');
  assert.ok(psiko);
  const psikoGap = analyzeAcademicGap(subjects, psiko, INITIAL_UNIVERSITIES.find((u) => u.id === psiko.universityId) || null);
  assert.ok(psikoGap.encouragementNote.includes('BUKAN berarti'));
  assert.ok(psikoGap.additionalTopicsToLearn.some((t) => t.includes('metode riset') || t.includes('Biologi') || t.includes('Sosiologi')));
});

test('buildAcademicRecommendations categorizes programs without fake match percentages', () => {
  const subjects = createDefaultUserSubjects().map((s) =>
    s.subjectName === 'Kimia' || s.subjectName === 'Fisika' || s.subjectName === 'Matematika Lanjut'
      ? { ...s, proficiencyLevel: 'Sangat Kuat' as const, interestLevel: 'Tinggi' as const }
      : s
  );
  const recs = buildAcademicRecommendations({
    userSubjects: subjects,
    interestTopics: ['Sistem Industri & Rantai Pasok', 'Rekayasa Kimia & Material'],
    learningPreferences: null,
    profile: null,
    programs: INITIAL_PROGRAMS,
    universities: INITIAL_UNIVERSITIES,
  });

  assert.equal(recs.length, INITIAL_PROGRAMS.length);
  const top = recs[0];
  assert.ok(
    top.category === 'Kesesuaian Minat & Akademik Kuat' ||
      top.category === 'Potensi Keselarasan Minat'
  );
  assert.ok(top.limitationsDisclaimer.includes('tidak pernah') || top.limitationsDisclaimer.includes('tidak menggunakan skor persentase'));
});

test('analyzeHybridPersonalProfile isolates frameworks, applies boundary disclaimers, and retains diverging stated interests', () => {
  const baseProfile = createInitial37Profiles()[0];
  const mockProfile: Profile = {
    ...baseProfile,
    typology: {
      ...baseProfile.typology,
      socionics: 'LIE',
      quadra: 'Gamma',
      enneagramCore: 3,
      enneagramRaw: 'SO3',
      psychosophyCode: 'VLFE',
      jungian: 'ET(N)',
    },
  };
  const subjects = createDefaultUserSubjects();
  const intra = createDefaultIntrapersonalInput();
  intra.curiosityTopics = ['Psikologi & Perilaku Manusia', 'Filsafat, Sejarah & Pemikiran Kritis'];
  intra.cognitivePreferences = [
    'Menyelidiki perilaku, emosi & motivasi manusia',
    'Menyusun argumen logis & membela posisi secara kritis',
  ];
  intra.dislikedDespiteHighScore = ['Kimia'];
  intra.enjoyedDespiteDifficulty = ['Psikologi'];

  const exploration: UserExplorationData = {
    ownerAccountId: 'acc-test',
    conceptStatuses: {},
    unresolvedQuestions: [],
    savedComparisons: [],
    completedLearningSteps: [],
    bookmarkedLearningSteps: [],
    scenarioReflections: [],
    userSubjects: subjects,
    specializationLabel: 'FISKIM MATONOMI',
    interestTopics: intra.curiosityTopics,
    problemSolvingPreference: 'Seimbang',
    theoryVsPracticePreference: 'Seimbang',
    workMotivationTags: ['Memahami manusia, budaya & dinamika sosial'],
    preferredMapLayout: {},
    roadmaps: [],
    intrapersonal: intra,
    provisionalTypologies: { socionics: true, psychosophy: true },
    updatedAt: new Date().toISOString(),
  };

  const hybrid = analyzeHybridPersonalProfile({
    profile: mockProfile,
    exploration,
    userSubjects: subjects,
  });

  assert.equal(hybrid.layerOneTypologies.length, 5);
  assert.ok(hybrid.layerOneTypologies[0].boundaryDisclaimer.includes('TIDAK identik'));
  assert.ok(hybrid.layerTwoPreferences.paradoxNotes.some((p) => p.includes('Kimia')));
  assert.ok(hybrid.layerTwoPreferences.paradoxNotes.some((p) => p.includes('Psikologi')));
  assert.ok(hybrid.layerFourSynthesis.meaningfulDivergences.some((d) => d.includes('mempertahankan kedua jalur') || d.includes('Lintas Peminatan')));
});

test('buildThreeLayerRecommendations differentiates identical typologies by stated interests, includes Unexpected Possibilities, and shows zero match percentages', () => {
  const baseProfile = createInitial37Profiles()[0];
  const identicalTypologyProfile: Profile = {
    ...baseProfile,
    typology: {
      ...baseProfile.typology,
      socionics: 'LIE',
      quadra: 'Gamma',
      enneagramCore: 3,
      enneagramRaw: 'SO3',
      psychosophyCode: 'VLFE',
      jungian: 'ET(N)',
    },
  };
  const subjects = createDefaultUserSubjects().map((s) =>
    s.subjectName === 'Fisika' || s.subjectName === 'Kimia' || s.subjectName === 'Ekonomi'
      ? { ...s, proficiencyLevel: 'Kuat' as const, interestLevel: 'Tinggi' as const }
      : s
  );

  // Student A: identical typology, STEM/Chem engineering interests
  const intraA = createDefaultIntrapersonalInput();
  intraA.curiosityTopics = ['Rekayasa Kimia, Material & Energi', 'Sistem Industri, Logistik & Optimasi'];
  intraA.cognitivePreferences = ['Merancang sistem teknis atau alur kerja terstruktur', 'Melakukan eksperimen & pengujian empiris'];
  const expA: UserExplorationData = {
    ownerAccountId: 'a',
    conceptStatuses: {},
    unresolvedQuestions: [],
    savedComparisons: [],
    completedLearningSteps: [],
    bookmarkedLearningSteps: [],
    scenarioReflections: [],
    userSubjects: subjects,
    specializationLabel: 'FISKIM MATONOMI',
    interestTopics: intraA.curiosityTopics,
    problemSolvingPreference: 'Terstruktur & Analitis',
    theoryVsPracticePreference: 'Terapan & Praktis',
    workMotivationTags: ['Inovasi produk, sistem, atau solusi baru'],
    preferredMapLayout: {},
    roadmaps: [],
    intrapersonal: intraA,
    updatedAt: new Date().toISOString(),
  };

  // Student B: IDENTICAL typology, Psychology/Philosophy/Law interests
  const intraB = createDefaultIntrapersonalInput();
  intraB.curiosityTopics = ['Psikologi & Perilaku Manusia', 'Hukum, Konstitusi & Kebijakan Publik', 'Filsafat, Sejarah & Pemikiran Kritis'];
  intraB.cognitivePreferences = ['Menyelidiki perilaku, emosi & motivasi manusia', 'Menyusun argumen logis & membela posisi secara kritis'];
  intraB.meaningfulActivities = ['Berdiskusi, berdebat & membedah argumen', 'Mendengarkan & membantu teman menyelesaikan masalah'];
  const expB: UserExplorationData = {
    ...expA,
    ownerAccountId: 'b',
    interestTopics: intraB.curiosityTopics,
    intrapersonal: intraB,
  };

  const bundleA = buildThreeLayerRecommendations({
    profile: identicalTypologyProfile,
    exploration: expA,
    userSubjects: subjects,
    programs: INITIAL_PROGRAMS,
    universities: INITIAL_UNIVERSITIES,
  });

  const bundleB = buildThreeLayerRecommendations({
    profile: identicalTypologyProfile,
    exploration: expB,
    userSubjects: subjects,
    programs: INITIAL_PROGRAMS,
    universities: INITIAL_UNIVERSITIES,
  });

  assert.ok(bundleA.recommended.length >= 4);
  assert.ok(bundleA.alternative.length >= 4);
  assert.ok(bundleA.unexpected.length >= 4);

  // Two identical-typology students must NOT get identical top recommendations!
  const topIdsA = bundleA.recommended.map((r) => r.program.id);
  const topIdsB = bundleB.recommended.map((r) => r.program.id);
  assert.notDeepEqual(topIdsA, topIdsB);

  // Student B's top recommendations must reflect Psychology/Law/Philosophy despite FISKIM MATONOMI background!
  assert.ok(
    bundleB.recommended.some((r) => /Psikologi|Hukum|Filsafat|Sosiologi|Komunikasi/i.test(r.program.name))
  );

  // Student A's Unexpected layer must introduce non-FISKIM fields with full 5 unexpected parts + reasoning trail
  const firstUnexpected = bundleA.unexpected[0];
  assert.ok(firstUnexpected.unexpectedWhyNotObvious);
  assert.ok(firstUnexpected.unexpectedWhyWorthExploring);
  assert.ok(firstUnexpected.reasoningTrail.uncertainAssumptions.length >= 1);
  assert.ok(bundleA.explanatoryNote.includes('TANPA skor persentase'));

  // Zero fake percentage scores anywhere in recommended titles/descriptions
  assert.equal(/\b\d{1,3}%/.test(bundleA.recommended.map((r) => r.whyIncluded).join(' ')), false);

  // Career ranking connects preferences & recommended majors cleanly
  const rankedCareers = rankCareersByPreferences({
    careers: INITIAL_CAREERS,
    exploration: expB,
    profile: identicalTypologyProfile,
    recommendedProgramIds: topIdsB,
  });
  assert.ok(rankedCareers.length >= 20);
  assert.ok(rankedCareers[0].connectionReasons.length >= 1);
});

test('analyzeHybridPersonalProfile integrates profile academicInterests, learningPreferences, customPrefixes, disciplinesToDeepen, and personalValuesNotes automatically', () => {
  const baseProfile = createInitial37Profiles()[0];
  const enrichedProfile: Profile = {
    ...baseProfile,
    academicInterests: ['Psikologi Sosial', 'Kriminologi'],
    learningPreferences: {
      studySetting: 'Kelompok',
      explanationStyle: 'Visual / Diagram',
      structureStyle: 'Terstruktur & Terjadwal',
      workMode: 'Diskusi Aktif',
      examplePreference: 'Contoh Konkret Terlebih Dahulu',
      feedbackStyle: 'Diskusi Dua Arah',
      sessionLength: 'Sesi Panjang Mendalam (60+ menit)',
      notes: 'Lebih cepat menangkap lewat studi kasus nyata.',
    },
    typology: {
      ...baseProfile.typology,
      customPrefixes: [{ label: 'Tempo', value: '3/4' }],
    },
  };

  const intra = createDefaultIntrapersonalInput();
  intra.disciplinesToDeepen = ['Hukum & Tata Kelola', 'Humaniora & Filsafat'];
  intra.personalValuesNotes = 'Mengutamakan keadilan sosial dan otonomi berpikir.';

  const exploration: UserExplorationData = {
    ownerAccountId: 'acc-enrich',
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
    roadmaps: [],
    intrapersonal: intra,
    updatedAt: new Date().toISOString(),
  };

  const hybrid = analyzeHybridPersonalProfile({
    profile: enrichedProfile,
    exploration,
    userSubjects: createDefaultUserSubjects(),
  });

  assert.ok(hybrid.layerOneTypologies.some((s) => s.framework.includes('Awalan Kustom') && s.codeOrStatus.includes('Tempo: 3/4')));
  assert.ok(hybrid.layerTwoPreferences.summaryPoints.some((p) => p.includes('Psikologi Sosial')));
  assert.ok(hybrid.layerTwoPreferences.summaryPoints.some((p) => p.includes('ditarik otomatis dari Profil Saya')));
  assert.ok(hybrid.layerTwoPreferences.summaryPoints.some((p) => p.includes('Hukum & Tata Kelola')));
  assert.ok(hybrid.layerTwoPreferences.summaryPoints.some((p) => p.includes('keadilan sosial')));
  assert.ok(hybrid.layerTwoPreferences.highlightInterests.includes('Hukum & Tata Kelola'));
});

test('buildThreeLayerRecommendations responds to disciplinesToDeepen and keeps zero percentage scores across all 3 layers for FISKIM MATONOMI students', () => {
  const subjects = createDefaultUserSubjects().map((s) =>
    s.subjectName === 'Fisika' || s.subjectName === 'Kimia' || s.subjectName === 'Ekonomi' || s.subjectName === 'Matematika Lanjut'
      ? { ...s, proficiencyLevel: 'Kuat' as const, interestLevel: 'Tinggi' as const }
      : s
  );
  const intra = createDefaultIntrapersonalInput();
  intra.disciplinesToDeepen = ['Ilmu Sosial & Perilaku', 'Hukum & Tata Kelola'];
  intra.curiosityTopics = ['Psikologi & Perilaku Manusia'];

  const exploration: UserExplorationData = {
    ownerAccountId: 'acc-deepen',
    conceptStatuses: {},
    unresolvedQuestions: [],
    savedComparisons: [],
    completedLearningSteps: [],
    bookmarkedLearningSteps: [],
    scenarioReflections: [],
    userSubjects: subjects,
    specializationLabel: 'FISKIM MATONOMI',
    interestTopics: intra.curiosityTopics,
    problemSolvingPreference: 'Seimbang',
    theoryVsPracticePreference: 'Seimbang',
    workMotivationTags: [],
    preferredMapLayout: {},
    roadmaps: [],
    intrapersonal: intra,
    updatedAt: new Date().toISOString(),
  };

  const bundle = buildThreeLayerRecommendations({
    profile: null,
    exploration,
    userSubjects: subjects,
    programs: INITIAL_PROGRAMS,
    universities: INITIAL_UNIVERSITIES,
  });

  const combined = [...bundle.recommended, ...bundle.alternative, ...bundle.unexpected];
  assert.ok(
    bundle.recommended.some(
      (r) =>
        r.program.disciplineCluster === 'Ilmu Sosial & Perilaku' ||
        r.program.disciplineCluster === 'Hukum & Tata Kelola' ||
        /Psikologi|Hukum|Sosiologi/i.test(r.program.name)
    )
  );
  assert.equal(
    combined.some((r) => /\b\d{1,3}%/.test(`${r.whyIncluded} ${r.explorationNote}`)),
    false
  );
});

test('rankCareersByPreferences actively responds to all 8 workPreferences dimensions', () => {
  const subjects = createDefaultUserSubjects();
  const baseExploration: UserExplorationData = {
    ownerAccountId: 'acc-wp',
    conceptStatuses: {},
    unresolvedQuestions: [],
    savedComparisons: [],
    completedLearningSteps: [],
    bookmarkedLearningSteps: [],
    scenarioReflections: [],
    userSubjects: subjects,
    specializationLabel: 'FISKIM MATONOMI',
    interestTopics: [],
    problemSolvingPreference: 'Seimbang',
    theoryVsPracticePreference: 'Seimbang',
    workMotivationTags: [],
    preferredMapLayout: {},
    roadmaps: [],
    intrapersonal: {
      ...createDefaultIntrapersonalInput(),
      workPreferences: {
        collaboration: 'Mandiri',
        setting: 'Kantor / Lab',
        focus: 'Riset & Analisis',
        structure: 'Terstruktur Jelas',
        responsibility: 'Fokus Teknis',
        decisionStyle: 'Keputusan Mandiri',
        pace: 'Ritme Terprediksi',
        visibility: 'Di Balik Layar',
      },
    },
    updatedAt: new Date().toISOString(),
  };

  const dynamicPublicExploration: UserExplorationData = {
    ...baseExploration,
    intrapersonal: {
      ...createDefaultIntrapersonalInput(),
      workPreferences: {
        collaboration: 'Kolaboratif',
        setting: 'Lapangan / Dinamis',
        focus: 'Aplikasi Praktis',
        structure: 'Fleksibel Eksploratif',
        responsibility: 'Fokus Interpersonal',
        decisionStyle: 'Koordinasi Tim',
        pace: 'Ritme Dinamis',
        visibility: 'Berhadapan Publik',
      },
    },
  };

  const rankedIndependent = rankCareersByPreferences({
    careers: INITIAL_CAREERS,
    exploration: baseExploration,
    profile: null,
    recommendedProgramIds: [],
  });
  const rankedPublic = rankCareersByPreferences({
    careers: INITIAL_CAREERS,
    exploration: dynamicPublicExploration,
    profile: null,
    recommendedProgramIds: [],
  });

  assert.notEqual(rankedIndependent[0].career.id, rankedPublic[0].career.id);
  const allIndependentReasons = rankedIndependent.flatMap((c) => c.connectionReasons).join(' | ');
  const allPublicReasons = rankedPublic.flatMap((c) => c.connectionReasons).join(' | ');
  assert.ok(allIndependentReasons.includes('pola kerja mandiri'));
  assert.ok(allIndependentReasons.includes('di balik layar'));
  assert.ok(allIndependentReasons.includes('ritme kerja yang relatif terukur'));
  assert.ok(allPublicReasons.includes('berhadapan dengan publik'));
  assert.ok(allPublicReasons.includes('ritme kerja dinamis'));
  assert.ok(allPublicReasons.includes('koordinasi keputusan bersama tim'));
});

test('Indonesian Ilmu Hukum programs preserve legal concentrations inside one S1 degree', () => {
  const lawPrograms = INITIAL_PROGRAMS.filter(
    (p) => p.disciplineCluster === 'Hukum & Tata Kelola' && /hukum/i.test(p.name)
  );
  assert.ok(lawPrograms.length >= 1);
  assert.equal(lawPrograms.every((p) => p.name === 'Ilmu Hukum' && p.degree === 'S1'), true);
  assert.ok(
    lawPrograms.some(
      (p) =>
        p.concentrations?.includes('Hukum Tata Negara') &&
        p.concentrations?.includes('Hukum Internasional') &&
        p.concentrations?.includes('Hukum Ekonomi & Bisnis')
    )
  );
});

test('Layer 1 Instinctual Variant highlights never contain undefined and career reasons avoid stopwords', () => {
  const subjects = createDefaultUserSubjects();
  const baseProfile = createInitial37Profiles()[0];
  const profileWithInstinct: Profile = {
    ...baseProfile,
    id: 'p-inst',
    displayName: 'Rizqy',
    typology: {
      ...baseProfile.typology,
      quadra: 'Gamma',
      socionics: 'LIE',
      enneagramRaw: '3w4',
      enneagramCore: 3,
      enneagramWing: '3w4',
      tritype: '358',
      instinctVariant: 'SO',
      instinctStacking: 'SO/SX',
      psychosophyCode: 'VLFE',
      jungian: 'ENTJ',
    },
  };

  const exploration: UserExplorationData = {
    ownerAccountId: 'acc-inst',
    conceptStatuses: {},
    unresolvedQuestions: [],
    savedComparisons: [],
    completedLearningSteps: [],
    bookmarkedLearningSteps: [],
    scenarioReflections: [],
    userSubjects: subjects,
    specializationLabel: 'FISKIM MATONOMI',
    interestTopics: [],
    problemSolvingPreference: 'Seimbang',
    theoryVsPracticePreference: 'Seimbang',
    workMotivationTags: [],
    preferredMapLayout: {},
    roadmaps: [],
    intrapersonal: {
      ...createDefaultIntrapersonalInput(),
      curiosityTopics: ['Rasa ingin tahu pada tata kelola dan kebijakan publik'],
      personalValuesNotes: 'Ingin memberi kontribusi nyata dari hasil riset.',
    },
    updatedAt: new Date().toISOString(),
  };

  const analysis = analyzeHybridPersonalProfile({
    profile: profileWithInstinct,
    exploration,
    userSubjects: subjects,
  });

  const allLayer1Text = analysis.layerOneTypologies
    .flatMap((t) => [t.codeOrStatus, t.theoreticalFocus, t.boundaryDisclaimer, ...t.highlights])
    .join(' ');
  assert.equal(/\bundefined\b/i.test(allLayer1Text), false);
  assert.ok(allLayer1Text.includes('Insting Dominan (SO):'));

  const ranked = rankCareersByPreferences({
    careers: INITIAL_CAREERS,
    exploration,
    profile: profileWithInstinct,
    recommendedProgramIds: [],
  });
  const allCareerReasons = ranked.flatMap((r) => r.connectionReasons).join(' | ');
  assert.equal(/\(pada\)|,\s*pada\s*[,)]|\(rasa\)|\(ingin\)/i.test(allCareerReasons), false);
});
