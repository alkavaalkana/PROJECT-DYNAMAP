import test from 'node:test';
import assert from 'node:assert/strict';
import { createInitial37Profiles } from '../data/initialDataset';
import {
  ALL_24_PSYCHOSOPHY_TYPES,
  PSYCHOSOPHY_16_PLACEMENTS,
  PSYCHOSOPHY_ASPECTS,
} from '../data/psychosophyData';
import { SOCIONICS_TYPES, parseJungianNotation } from '../data/socionicsData';
import {
  comparePsychosophyProfiles,
  generateCombinedTypologyProfile,
  parsePsychosophyPositions,
  validatePsychosophyCode,
} from './psychosophy';
import {
  analyzeInterpersonalComparison,
  buildStructuredCaseAnalysis,
  computeClassStatistics,
  validateAndBuildTritype,
} from './typology';
import type { PsychosophyAspect, PsychosophyPositionNumber, SocionicsCode } from '../types/dynamap';

test('Initial dataset contains exact 37 students with exact Quadra distribution', () => {
  const profiles = createInitial37Profiles();
  assert.equal(profiles.length, 37);

  const stats = computeClassStatistics(profiles);
  assert.equal(stats.totalActive, 37);
  assert.equal(stats.initialStudentsCount, 37);

  const quadraMap = Object.fromEntries(stats.byQuadra.map((q) => [q.label, q]));
  assert.equal(quadraMap.Gamma.count, 8);
  assert.equal(quadraMap.Gamma.percentage, 21.62);
  assert.equal(quadraMap.Alpha.count, 7);
  assert.equal(quadraMap.Alpha.percentage, 18.92);
  assert.equal(quadraMap.Delta.count, 11);
  assert.equal(quadraMap.Delta.percentage, 29.73);
  assert.equal(quadraMap.Beta.count, 11);
  assert.equal(quadraMap.Beta.percentage, 29.73);

  // Verify corrected Annisaa & Alifia Jungian notations
  const annisaa = profiles.find((p) => p.displayName === 'Annisaa');
  const alifia = profiles.find((p) => p.displayName === 'Alifia');
  assert.equal(annisaa?.typology.jungian, 'ES(F)');
  assert.equal(annisaa?.typology.enneagramRaw, 'SX2');
  assert.equal(alifia?.typology.jungian, 'ES(F)');
  assert.equal(alifia?.typology.enneagramRaw, 'SX8');

  // Verify ILI has 0 members initially
  const iliStat = stats.bySocionics.find((s) => s.label === 'ILI');
  assert.equal(iliStat, undefined);
});

test('Model A mappings preserve exact LIE, EIE, and structural invariants for all 16 Socionics types', () => {
  assert.deepEqual(SOCIONICS_TYPES.LIE.modelA, ['Te', 'Ni', 'Fe', 'Si', 'Fi', 'Se', 'Ti', 'Ne']);
  assert.deepEqual(SOCIONICS_TYPES.EIE.modelA, ['Fe', 'Ni', 'Te', 'Si', 'Ti', 'Se', 'Fi', 'Ne']);

  const allCodes = Object.keys(SOCIONICS_TYPES) as SocionicsCode[];
  assert.equal(allCodes.length, 16);

  for (const code of allCodes) {
    const modelA = SOCIONICS_TYPES[code].modelA;
    // Must have all 8 unique Information Elements
    assert.equal(new Set(modelA).size, 8, `${code} must have 8 unique elements`);
    // Leading (idx 0) and Ignoring (idx 6) must share same letter with opposite E/I
    assert.equal(modelA[0][0], modelA[6][0], `${code} Leading & Ignoring letter mismatch`);
    assert.notEqual(modelA[0][1], modelA[6][1], `${code} Leading & Ignoring orientation mismatch`);
    // Creative (idx 1) and Demonstrative (idx 7) must share same letter with opposite E/I
    assert.equal(modelA[1][0], modelA[7][0], `${code} Creative & Demonstrative letter mismatch`);
    assert.notEqual(modelA[1][1], modelA[7][1], `${code} Creative & Demonstrative orientation mismatch`);
    // Specifically, Role (2) shares orientation with Leading (0), PoLR (3) shares orientation with Creative (1)
    assert.equal(modelA[2][1], modelA[0][1], `${code} Role orientation must match Leading`);
    assert.equal(modelA[3][1], modelA[1][1], `${code} PoLR orientation must match Creative`);
    // Suggestive (4) is dual of Leading (0): opposite orientation
    assert.notEqual(modelA[4][1], modelA[0][1], `${code} Suggestive must oppose Leading orientation`);
  }
});

test('Jungian notation parser preserves project convention without auto-converting to MBTI', () => {
  const parsed = parseJungianNotation('ET(N)');
  assert.equal(parsed.valid, true);
  assert.equal(parsed.dominantOrientation, 'Ekstrovert');
  assert.ok(parsed.dominantFunction.includes('Extraverted Thinking'));
  assert.ok(parsed.accompanyingFunction.includes('Intuition'));
  assert.ok(!parsed.explanation.includes('ENTJ'));
});

test('Tritype configurator validates 1 Heart, 1 Head, 1 Gut and preserves core-first ordering', () => {
  // Valid 258 with core 2
  const res258 = validateAndBuildTritype({
    core: 2,
    heartFix: 2,
    headFix: 5,
    gutFix: 8,
    convention: 'core-first',
  });
  assert.equal(res258.valid, true);
  assert.equal(res258.tritypeDisplay, '258');
  assert.equal(res258.threeFix, '2-5-8');
  assert.ok(res258.interactionAnalysis?.synergy.includes('Rejection Triad'));

  // Core-first ordering when core is 8 (should NOT sort numerically to 258)
  const res825 = validateAndBuildTritype({
    core: 8,
    heartFix: 2,
    headFix: 5,
    gutFix: 8,
    secondaryPriority: 'heart',
    convention: 'core-first',
  });
  assert.equal(res825.valid, true);
  assert.equal(res825.tritypeDisplay, '825');

  // Invalid missing fix
  const invalidMissing = validateAndBuildTritype({
    core: 4,
    heartFix: 4,
    headFix: null,
    gutFix: 9,
    convention: 'core-first',
  });
  assert.equal(invalidMissing.valid, false);
});

test('Dynamic statistics update automatically when profiles are added or edited', () => {
  const profiles = createInitial37Profiles();
  profiles.push({
    ...profiles[0],
    id: 'usr-teacher-1',
    displayName: 'Bu Sari',
    fullName: 'Sari Wulandari',
    category: 'Wali Kelas',
    datasetOrigin: 'added',
    typology: {
      ...profiles[0].typology,
      quadra: '',
      socionics: '',
      enneagramCore: null,
      enneagramRaw: '',
      jungian: '',
      status: 'Undetermined',
    },
  });
  const stats = computeClassStatistics(profiles);
  assert.equal(stats.totalActive, 38);
  assert.equal(stats.initialStudentsCount, 37);
  assert.equal(stats.teachersAndStaffCount, 1);
  assert.ok(stats.byPsychosophy.some((item) => item.label === 'Belum Ditentukan'));
});

test('Interpersonal comparison and structured case analysis generate contextual Indonesian outputs', () => {
  const profiles = createInitial37Profiles();
  const rizqy = profiles.find((p) => p.displayName === 'Rizqy')!;
  const reva = profiles.find((p) => p.displayName === 'Reva')!;

  const comparison = analyzeInterpersonalComparison([rizqy, reva], 'Anggota kelompok');
  assert.ok(comparison);
  assert.equal(comparison.badTurnSequence.length, 6);
  assert.ok(comparison.howToCommunicateScripts.length >= 2);
  assert.ok(comparison.disclaimer.includes('hipotesis'));

  const caseResult = buildStructuredCaseAnalysis({
    title: 'Konflik pembagian tugas makalah',
    situationDescription: 'Salah satu anggota belum mengirim draf.',
    peopleInvolved: 'Rizqy, Reva',
    perspectives: 'Rizqy ingin cepat selesai; Reva butuh instruksi lebih jelas.',
    chronology: 'Hari Senin dibagi, Rabu belum terkumpul.',
    expectations: 'Selesai tepat waktu.',
    mainProblem: 'Miskomunikasi target porsi.',
    desiredOutcome: 'Pembagian adil dan selesai Jumat.',
    optionalPersonalityInfo: '',
    relationshipContext: 'Anggota kelompok',
    isPrivate: true,
  });
  assert.equal(caseResult.source, 'structured-workflow');
  assert.ok(caseResult.suggestedDialogue.length >= 1);
});

test('Psychosophy validator enforces unique 4-letter L/V/E/F permutation or empty code', () => {
  const validLower = validatePsychosophyCode(' elvf ');
  assert.equal(validLower.valid, true);
  assert.equal(validLower.normalizedCode, 'ELVF');
  assert.equal(validLower.isEmpty, false);

  const empty = validatePsychosophyCode('   ');
  assert.equal(empty.valid, true);
  assert.equal(empty.isEmpty, true);
  assert.equal(empty.normalizedCode, '');

  const dup = validatePsychosophyCode('LLVE');
  assert.equal(dup.valid, false);
  assert.ok(dup.error && dup.error.includes('tepat satu kali'));

  const short = validatePsychosophyCode('LVE');
  assert.equal(short.valid, false);

  const invalidChar = validatePsychosophyCode('LVAB');
  assert.equal(invalidChar.valid, false);
});

test('Psychosophy dataset covers exact 24 unique permutations and all 16 aspect-position guides', () => {
  assert.equal(ALL_24_PSYCHOSOPHY_TYPES.length, 24);
  const uniqueCodes = new Set(ALL_24_PSYCHOSOPHY_TYPES.map((t) => t.code));
  assert.equal(uniqueCodes.size, 24);

  for (const t of ALL_24_PSYCHOSOPHY_TYPES) {
    assert.equal(validatePsychosophyCode(t.code).valid, true, `${t.code} should be valid`);
    assert.ok(t.afanasyevNickname.length > 0, `${t.code} missing nickname`);
    assert.ok(t.attitudinalPsycheClub.length > 0, `${t.code} missing AP club`);
    assert.ok(t.positionalSynthesis.length > 20, `${t.code} missing synthesis`);
  }

  assert.ok(PSYCHOSOPHY_ASPECTS.F.criticalNote?.toLowerCase().includes('bukan feeling'));
  assert.ok(PSYCHOSOPHY_ASPECTS.F.notEquatedWith.toLowerCase().includes('atletik'));

  const aspects: PsychosophyAspect[] = ['L', 'V', 'E', 'F'];
  const positions: PsychosophyPositionNumber[] = [1, 2, 3, 4];
  assert.equal(Object.keys(PSYCHOSOPHY_16_PLACEMENTS).length, 16);

  for (const pos of positions) {
    for (const asp of aspects) {
      const key = `${pos}${asp}`;
      const guide = PSYCHOSOPHY_16_PLACEMENTS[key];
      assert.ok(guide, `Missing placement guide ${key}`);
      assert.ok(guide.coreAttitude.length > 10);
      assert.ok(guide.typicalSubjectiveExperience.length > 10);
      assert.ok(guide.potentialStrengths.length >= 2);
      assert.ok(guide.potentialDifficulties.length >= 2);
      assert.ok(guide.reflectiveQuestions.length >= 2);
      assert.ok(guide.everydayExamples.length >= 2);
      assert.ok(guide.possibleMisinterpretations.length > 10);
      assert.ok(guide.differencesFromAdjacentPositions.length > 10);
    }
  }
});

test('Psychosophy position parser and combined multi-lens synthesis preserve framework boundaries', () => {
  const parsed = parsePsychosophyPositions('VLEF');
  assert.equal(parsed.valid, true);
  assert.equal(parsed.placements.length, 4);
  assert.equal(parsed.placements[0].code, '1V');
  assert.equal(parsed.placements[1].code, '2L');
  assert.equal(parsed.placements[2].code, '3E');
  assert.equal(parsed.placements[3].code, '4F');

  const profiles = createInitial37Profiles();
  const baseProfile = profiles.find((p) => p.displayName === 'Rizqy')!;
  const enrichedProfile = {
    ...baseProfile,
    typology: {
      ...baseProfile.typology,
      psychosophyCode: 'VLEF',
      psychosophyConfidence: 'Terkonfirmasi Mandiri' as const,
      psychosophyProvisional: false,
    },
  };

  const combined = generateCombinedTypologyProfile(enrichedProfile);
  assert.equal(combined.lenses.length, 4);
  assert.ok(combined.lenses.some((l) => l.framework.includes('Socionics')));
  assert.ok(combined.lenses.some((l) => l.framework.includes('Enneagram')));
  assert.ok(combined.lenses.some((l) => l.framework.includes('Psikosofi') && l.code.includes('VLEF')));
  assert.ok(combined.frameworkBoundaryDisclaimer.includes('TIDAK saling membuktikan'));
});

test('Dynamic 5-stage interpersonal comparison adapts to different pairs, Psychosophy codes, and user behavior inputs', () => {
  const profiles = createInitial37Profiles();
  const rizqy = {
    ...profiles.find((p) => p.displayName === 'Rizqy')!, // LIE SO3
    typology: {
      ...profiles.find((p) => p.displayName === 'Rizqy')!.typology,
      psychosophyCode: 'LVFE', // 1L
    },
  };
  const reva = {
    ...profiles.find((p) => p.displayName === 'Reva')!, // IEI SP4
    typology: {
      ...profiles.find((p) => p.displayName === 'Reva')!.typology,
      psychosophyCode: 'EVLF', // 3L -> triggers 1L vs 3L principle
    },
  };
  const clarice = {
    ...profiles.find((p) => p.displayName === 'Clarice')!, // SEE SX8
    typology: {
      ...profiles.find((p) => p.displayName === 'Clarice')!.typology,
      psychosophyCode: 'VFEL',
    },
  };
  const yusha = {
    ...profiles.find((p) => p.displayName === 'Yusha')!, // LII SP5
    typology: {
      ...profiles.find((p) => p.displayName === 'Yusha')!.typology,
      psychosophyCode: 'LVEF',
    },
  };

  // Case 1: Without behavioral input -> hasBehavioralDetails=false + clarifyingQuestions populated
  const cmp1 = analyzeInterpersonalComparison([rizqy, reva], 'Anggota kelompok');
  assert.ok(cmp1);
  assert.equal(cmp1.hasBehavioralDetails, false);
  assert.ok(cmp1.clarifyingQuestions.length >= 2);
  assert.equal(cmp1.conflictStages.length, 5);
  assert.equal(cmp1.psychosophyComparison.available, true);
  assert.equal(cmp1.psychosophyComparison.aspectComparisons.length, 4);
  assert.ok(cmp1.psychosophyComparison.activeConflictPrinciples.some((p) => p.id === '1l-3l'));

  // Verify all 5 stages have required 9 fields + Stage 5 alternative outcomes
  for (const st of cmp1.conflictStages) {
    assert.ok(st.stageTitle.length > 0);
    assert.ok(st.interactionDescription.length > 10);
    assert.ok(st.underlyingMechanism.length > 10);
    assert.ok(st.personAPerspective.length > 10);
    assert.ok(st.personBPerspective.length > 10);
    assert.ok(st.relevantTypologyDifferences.length >= 1);
    assert.ok(st.concreteExample.length > 10);
    assert.ok(st.transitionToNext.length > 10);
  }
  const stage5 = cmp1.conflictStages[4];
  assert.ok(stage5.alternativeOutcomes && stage5.alternativeOutcomes.length >= 1);

  // Case 2: Different pair + behavioral details -> different mechanism/Stage 5 outcome & hasBehavioralDetails=true
  const cmp2 = analyzeInterpersonalComparison([clarice, yusha], 'Koordinator dan anggota', {
    observedTrigger: 'Pembagian deadline presentasi di grup chat',
    reportedBehavior: 'Clarice langsung menentukan tenggat sedangkan Yusha diam tidak membalas 2 hari',
    communicationGoal: 'Menyepakati tenggat tanpa merasa dipaksa atau diabaikan',
  });
  assert.ok(cmp2);
  assert.equal(cmp2.hasBehavioralDetails, true);
  assert.equal(cmp2.clarifyingQuestions.length, 0);
  assert.ok(cmp2.evidenceClassification.reportedFacts.some((f) => f.includes('Clarice langsung menentukan tenggat')));
  assert.notEqual(
    cmp1.conflictMechanismId,
    cmp2.conflictMechanismId,
    'Different profile pairs should activate distinct dynamic conflict mechanisms'
  );
  assert.equal(cmp2.detailedResolution.mechanismId, cmp2.conflictMechanismId);
  assert.ok(cmp2.personalizedDialogues.mutualRepair.practicalAgreement.includes('Menyepakati tenggat'));

  // Also test direct comparePsychosophyProfiles with missing code
  const satya = profiles.find((p) => p.displayName === 'Satya')!;
  const missingPsy = comparePsychosophyProfiles(satya, clarice);
  assert.equal(missingPsy.available, false);
  assert.ok(missingPsy.summary.includes('Satya'));
});

test('Class statistics include MBTI, SLOAN, and Temperament distributions', () => {
  const profiles = createInitial37Profiles();
  profiles[0].typology.mbti = 'ENTJ';
  profiles[0].typology.sloanCode = 'SCOEI';
  profiles[0].typology.temperament = 'Koleris';
  profiles[0].typology.temperamentSecondary = 'Melankolis';

  const stats = computeClassStatistics(profiles);
  assert.ok(stats.byMbti.some((item) => item.label === 'ENTJ' && item.count === 1));
  assert.ok(stats.bySloan.some((item) => item.label === 'SCOEI' && item.count === 1));
  assert.ok(stats.byTemperament.some((item) => item.label === 'Koleris–Melankolis' && item.count === 1));
});

test('Pairs sharing Socionics, Enneagram, and Instinct produce meaningfully different dynamics when MBTI/SLOAN/Temperament differ', () => {
  const base = createInitial37Profiles()[0];
  const personA1 = {
    ...base,
    id: 'a1',
    displayName: 'Dimas',
    typology: {
      ...base.typology,
      socionics: 'LII' as const,
      quadra: 'Alpha' as const,
      enneagramCore: 5 as const,
      instinctVariant: 'SP' as const,
      mbti: 'INTJ',
      sloanCode: 'RCOEI',
      temperament: 'Koleris',
      temperamentSecondary: 'Melankolis',
    },
  };
  const personB1 = {
    ...base,
    id: 'b1',
    displayName: 'Nadia',
    typology: {
      ...base.typology,
      socionics: 'LII' as const,
      quadra: 'Alpha' as const,
      enneagramCore: 5 as const,
      instinctVariant: 'SP' as const,
      mbti: 'INTP',
      sloanCode: 'RLUAI',
      temperament: 'Plegmatis',
      temperamentSecondary: 'Melankolis',
    },
  };

  const res1 = analyzeInterpersonalComparison([personA1, personB1], 'Anggota kelompok');
  assert.ok(res1);
  assert.ok(res1.mbtiDifferences.some((d) => d.includes('INTJ') && d.includes('INTP')));
  assert.ok(res1.sloanDifferences.some((d) => d.includes('RCOEI') && d.includes('RLUAI')));
  assert.ok(res1.temperamentDifferences.some((d) => d.includes('Koleris–Melankolis') && d.includes('Plegmatis–Melankolis')));
  assert.equal(res1.directionalMap.aToB.direction, 'A_TO_B');
  assert.equal(res1.directionalMap.bToA.direction, 'B_TO_A');
  assert.ok(res1.directionalMap.aToB.typologyEvidence.some((e) => e.includes('RCOEI')));
});


