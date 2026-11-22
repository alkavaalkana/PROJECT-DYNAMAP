import test from 'node:test';
import assert from 'node:assert/strict';
import { createInitial37Profiles } from '../data/initialDataset';
import { MIXED_12_TEMPERAMENTS, MBTI_FUNCTION_POSITIONS, MBTI_STACK_DYNAMICS_16 } from '../data/extendedTheoryData';
import {
  analyzeProfileContradictionsAndComplexity,
  buildMultiLayerPersonalInterpretation,
  resolveMbtiCognitiveStack,
} from './interpretationEngine';

test('MIXED_12_TEMPERAMENTS covers all 12 directional combinations and MBTI covers 8 positions + 16 stacks', () => {
  assert.equal(MIXED_12_TEMPERAMENTS.length, 12);
  const titles = new Set(MIXED_12_TEMPERAMENTS.map((m) => `${m.primary}-${m.secondary}`));
  assert.equal(titles.size, 12);
  assert.ok(titles.has('Sanguine-Choleric'));
  assert.ok(titles.has('Choleric-Sanguine'));
  assert.equal(MBTI_FUNCTION_POSITIONS.length, 8);
  assert.equal(Object.keys(MBTI_STACK_DYNAMICS_16).length, 16);
});

test('resolveMbtiCognitiveStack derives standard Grant stack and honors manual overrides', () => {
  const auto = resolveMbtiCognitiveStack('intj');
  assert.equal(auto.stackText, 'Ni – Te – Fi – Se');
  assert.equal(auto.isManualOverride, false);

  const manual = resolveMbtiCognitiveStack('INTJ', 'Ni – Ti – Fe – Se');
  assert.equal(manual.stackText, 'Ni – Ti – Fe – Se');
  assert.equal(manual.isManualOverride, true);
});

test('buildMultiLayerPersonalInterpretation handles partial profiles without inventing missing frameworks', () => {
  const base = createInitial37Profiles()[0];
  const partialProfile = {
    ...base,
    typology: {
      ...base.typology,
      quadra: '' as const,
      socionics: '' as const,
      enneagramCore: null,
      enneagramRaw: '',
      enneagramWing: '',
      instinctVariant: '' as const,
      instinctStacking: '' as const,
      tritype: '',
      threeFix: '',
      psychosophyCode: '',
      mbti: 'INFJ',
      sloanCode: '',
      temperament: 'Melancholic',
      temperamentSecondary: 'Phlegmatic',
    },
  };

  const interp = buildMultiLayerPersonalInterpretation(partialProfile);
  assert.equal(interp.filledFrameworks.length, 2);
  assert.equal(interp.completenessRatio, 25);
  assert.ok(interp.missingFrameworks.includes('Socionics'));
  assert.ok(interp.missingFrameworks.includes('Enneagram'));
  assert.ok(interp.unavailableAspects.length >= 1);
  // Motivations topic must mark available=false instead of inventing Enneagram type
  const motStmt = interp.overviewStatements.find((s) => s.id === 'ov-motivations');
  assert.equal(motStmt?.available, false);
  // Strengths & Communication should still synthesize cleanly from MBTI + Temperament
  const commStmt = interp.overviewStatements.find((s) => s.id === 'ov-communication');
  assert.equal(commStmt?.available, true);
  assert.ok(commStmt?.provenance.frameworksInvolved.includes('Temperament'));
});

test('analyzeProfileContradictionsAndComplexity categorizes data mismatch vs cross-framework contrast', () => {
  const base = createInitial37Profiles()[0];
  const complexProfile = {
    ...base,
    typology: {
      ...base.typology,
      socionics: 'ILE' as const, // Alpha
      quadra: 'Gamma' as const, // Inconsistency with ILE!
      enneagramCore: 5 as const,
      tritype: '468', // Core 5 missing from tritype!
      mbti: 'ENTP',
      sloanCode: 'RCUAI', // E in MBTI + R in SLOAN (cross-framework difference)
      temperament: 'Melancholic',
    },
  };

  const contradictions = analyzeProfileContradictionsAndComplexity(complexProfile);
  const categories = new Set(contradictions.map((c) => c.category));
  assert.ok(categories.has('Inkonsistensi Data'));
  assert.ok(categories.has('Perbedaan Antar-Kerangka'));
  assert.ok(categories.has('Kecenderungan Kontekstual'));
  assert.ok(categories.has('Informasi Belum Lengkap'));
});
