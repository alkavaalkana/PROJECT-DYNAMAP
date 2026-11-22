import assert from 'node:assert/strict';
import test from 'node:test';
import {
  ALL_32_SLOAN_COMBINATIONS,
  buildExtendedSloanNotation,
  parseExtendedSloanNotation,
} from './sloanNotation';

test('ALL_32_SLOAN_COMBINATIONS covers all 32 standard Global 5 codes uniquely', () => {
  assert.equal(ALL_32_SLOAN_COMBINATIONS.length, 32);
  const unique = new Set(ALL_32_SLOAN_COMBINATIONS.map((c) => c.code));
  assert.equal(unique.size, 32);
  assert.ok(unique.has('SCOAI'));
  assert.ok(unique.has('RLUEN'));
});

test('parseExtendedSloanNotation parses canonical 5-letter code', () => {
  const res = parseExtendedSloanNotation('RCOAI');
  assert.equal(res.isValid, true);
  assert.equal(res.isExtendedSyntax, false);
  assert.equal(res.canonicalFiveLetter, 'RCOAI');
  assert.equal(res.rankedTraits.length, 5);
  assert.equal(res.axisSelections.organized?.letter, 'O');
});

test('parseExtendedSloanNotation parses extended [S]lo/E/I notation and ranks hierarchy', () => {
  const res = parseExtendedSloanNotation('[S]lo/E/I');
  assert.equal(res.isValid, true);
  assert.equal(res.isExtendedSyntax, true);
  assert.equal(res.canonicalFiveLetter, 'SLOEI');
  assert.equal(res.rankedTraits[0].letter, 'S');
  assert.equal(res.rankedTraits[0].tier, 'Utama / Paling Menonjol ([Kurung Siku])');
  assert.equal(res.rankedTraits[res.rankedTraits.length - 1].tier, 'Moderat / Paling Lemah (Setelah /)');
});

test('parseExtendedSloanNotation rejects duplicate axes or unknown characters gracefully', () => {
  const dup = parseExtendedSloanNotation('[S]Ro/E/I');
  assert.equal(dup.isValid, false);
  assert.ok(dup.error && dup.error.length > 5);

  const badChar = parseExtendedSloanNotation('SXOAI');
  assert.equal(badChar.isValid, false);
  assert.ok(badChar.error);
});

test('buildExtendedSloanNotation generates valid round-trip syntax', () => {
  const built = buildExtendedSloanNotation([
    { letter: 'R', prominence: 'dominant' },
    { letter: 'C', prominence: 'moderate' },
    { letter: 'O', prominence: 'primary' },
    { letter: 'A', prominence: 'trailing' },
    { letter: 'I', prominence: 'primary' },
  ]);
  assert.equal(built, '[R]OIc/A');
  const parsed = parseExtendedSloanNotation(built);
  assert.equal(parsed.isValid, true);
  assert.equal(parsed.canonicalFiveLetter, 'RCOAI');
});
