import test from 'node:test';
import assert from 'node:assert/strict';
import { createInitial37Profiles } from '../data/initialDataset';
import {
  analyzeAdminDataQuality,
  exportProfilesToCsv,
  parseAndValidateProfilesCsv,
} from './adminDataQuality';

test('analyzeAdminDataQuality detects incomplete fields and duplicate display names', () => {
  const profiles = createInitial37Profiles();
  const dup = {
    ...profiles[0],
    id: 'usr-dup-test',
  };
  const report = analyzeAdminDataQuality([...profiles, dup]);
  assert.equal(report.totalActive, 38);
  assert.ok(report.duplicateGroups.some((g) => g.normalizedKey === profiles[0].displayName.toLowerCase()));
  assert.ok(report.missingFieldCounts.some((f) => f.fieldKey === 'mbti' && f.missingCount > 0));
});

test('exportProfilesToCsv and parseAndValidateProfilesCsv validate bad rows and preview valid diffs', () => {
  const profiles = createInitial37Profiles().slice(0, 3);
  const csv = exportProfilesToCsv(profiles);
  assert.ok(csv.includes('mbtiCognitiveStack'));
  assert.ok(csv.includes(profiles[0].displayName));

  const validPatchCsv = [
    'id,displayName,mbti,sloanCode,temperament,temperamentSecondary',
    `${profiles[0].id},${profiles[0].displayName},INTJ,RCOEI,Melankolis,Koleris`,
  ].join('\n');

  const parsedOk = parseAndValidateProfilesCsv(validPatchCsv, profiles);
  assert.equal(parsedOk.valid, true);
  assert.equal(parsedOk.rows.length, 1);
  assert.equal(parsedOk.rows[0].action, 'update');
  assert.ok(parsedOk.rows[0].changes.some((c) => c.field === 'mbti' && c.to === 'INTJ'));

  const invalidCsv = [
    'id,displayName,mbti,sloanCode',
    `${profiles[0].id},${profiles[0].displayName},XXXX,INVALID`,
  ].join('\n');
  const parsedErr = parseAndValidateProfilesCsv(invalidCsv, profiles);
  assert.equal(parsedErr.valid, false);
  assert.equal(parsedErr.rows[0].action, 'error');
  assert.equal(parsedErr.rows[0].errors.length, 2);
});
