import type { Profile, QuadraName, SocionicsCode } from '../types/dynamap';

export interface DuplicateGroup {
  normalizedKey: string;
  reason: string;
  profiles: { id: string; displayName: string; fullName: string; category: string }[];
}

export interface AdminDataQualityReport {
  totalActive: number;
  incompleteProfilesCount: number;
  missingFieldCounts: {
    fieldKey: string;
    label: string;
    missingCount: number;
    profileIds: string[];
  }[];
  duplicateGroups: DuplicateGroup[];
}

export function analyzeAdminDataQuality(profiles: Profile[]): AdminDataQualityReport {
  const active = profiles.filter((p) => !p.archived);
  const fields: { key: string; label: string; test: (p: Profile) => boolean }[] = [
    { key: 'socionics', label: 'Socionics', test: (p) => Boolean(p.typology.socionics) },
    { key: 'quadra', label: 'Quadra', test: (p) => Boolean(p.typology.quadra) },
    { key: 'enneagram', label: 'Enneagram Inti', test: (p) => Boolean(p.typology.enneagramCore) },
    { key: 'instinct', label: 'Varian Insting', test: (p) => Boolean(p.typology.instinctVariant || p.typology.instinctStacking) },
    { key: 'tritype', label: 'Tritype / Three Fix', test: (p) => Boolean(p.typology.tritype || p.typology.threeFix) },
    { key: 'psychosophy', label: 'Psikosofi', test: (p) => Boolean(p.typology.psychosophyCode) },
    { key: 'mbti', label: 'MBTI', test: (p) => Boolean(p.typology.mbti) },
    { key: 'sloan', label: 'SLOAN', test: (p) => Boolean(p.typology.sloanCode || p.typology.sloanExtended) },
    { key: 'temperament', label: 'Temperamen', test: (p) => Boolean(p.typology.temperament) },
  ];

  const missingFieldCounts = fields.map((f) => {
    const missing = active.filter((p) => !f.test(p)).map((p) => p.id);
    return {
      fieldKey: f.key,
      label: f.label,
      missingCount: missing.length,
      profileIds: missing,
    };
  });

  const incompleteProfilesCount = active.filter((p) => fields.some((f) => !f.test(p))).length;

  // Duplicate detection by normalized displayName or fullName
  const byName = new Map<string, Profile[]>();
  for (const p of active) {
    const norm = p.displayName.trim().toLowerCase().replace(/\s+/g, ' ');
    if (!norm) continue;
    const arr = byName.get(norm) || [];
    arr.push(p);
    byName.set(norm, arr);
  }

  const duplicateGroups: DuplicateGroup[] = [];
  for (const [key, list] of byName.entries()) {
    if (list.length > 1) {
      duplicateGroups.push({
        normalizedKey: key,
        reason: 'Nama panggilan / tampilan sama persis',
        profiles: list.map((p) => ({
          id: p.id,
          displayName: p.displayName,
          fullName: p.fullName,
          category: p.category,
        })),
      });
    }
  }

  return {
    totalActive: active.length,
    incompleteProfilesCount,
    missingFieldCounts,
    duplicateGroups,
  };
}

const CSV_HEADERS = [
  'id',
  'displayName',
  'fullName',
  'category',
  'affiliation',
  'quadra',
  'socionics',
  'enneagramCore',
  'enneagramWing',
  'instinctVariant',
  'instinctStacking',
  'tritype',
  'jungian',
  'psychosophyCode',
  'mbti',
  'mbtiCognitiveStack',
  'sloanCode',
  'sloanExtended',
  'temperament',
  'temperamentSecondary',
  'status',
  'visibility',
] as const;

function escapeCsvCell(val: unknown): string {
  const s = val === null || val === undefined ? '' : String(val);
  if (/[",\n\r]/.test(s)) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

export function exportProfilesToCsv(profiles: Profile[]): string {
  const rows = [CSV_HEADERS.join(',')];
  for (const p of profiles) {
    const row = [
      p.id,
      p.displayName,
      p.fullName,
      p.category,
      p.affiliation,
      p.typology.quadra,
      p.typology.socionics,
      p.typology.enneagramCore ?? '',
      p.typology.enneagramWing,
      p.typology.instinctVariant,
      p.typology.instinctStacking,
      p.typology.tritype,
      p.typology.jungian,
      p.typology.psychosophyCode,
      p.typology.mbti || '',
      p.typology.mbtiCognitiveStack || '',
      p.typology.sloanCode || '',
      p.typology.sloanExtended || '',
      p.typology.temperament || '',
      p.typology.temperamentSecondary || '',
      p.typology.status,
      p.visibility,
    ].map(escapeCsvCell);
    rows.push(row.join(','));
  }
  return rows.join('\n');
}

function parseCsvRows(csvText: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = '';
  let inQuotes = false;

  for (let i = 0; i < csvText.length; i++) {
    const ch = csvText[i];
    if (inQuotes) {
      if (ch === '"' && csvText[i + 1] === '"') {
        cell += '"';
        i++;
      } else if (ch === '"') {
        inQuotes = false;
      } else {
        cell += ch;
      }
    } else if (ch === '"') {
      inQuotes = true;
    } else if (ch === ',') {
      row.push(cell);
      cell = '';
    } else if (ch === '\n' || ch === '\r') {
      if (ch === '\r' && csvText[i + 1] === '\n') i++;
      row.push(cell);
      if (row.some((c) => c.trim() !== '')) rows.push(row);
      row = [];
      cell = '';
    } else {
      cell += ch;
    }
  }
  row.push(cell);
  if (row.some((c) => c.trim() !== '')) rows.push(row);
  return rows;
}

export interface CsvImportRowDiff {
  rowIndex: number;
  profileId: string;
  displayName: string;
  action: 'update' | 'create' | 'error';
  errors: string[];
  changes: { field: string; from: string; to: string }[];
  patch: Record<string, string | number | null>;
}

const VALID_SOCIONICS = new Set<string>([
  'ILE', 'SEI', 'ESE', 'LII', 'EIE', 'LSI', 'SLE', 'IEI',
  'SEE', 'ILI', 'LIE', 'ESI', 'LSE', 'EII', 'IEE', 'SLI',
]);
const VALID_QUADRAS = new Set<string>(['Alpha', 'Beta', 'Gamma', 'Delta']);

export function parseAndValidateProfilesCsv(
  csvText: string,
  existingProfiles: Profile[]
): {
  valid: boolean;
  headerError?: string;
  rows: CsvImportRowDiff[];
} {
  const parsed = parseCsvRows(csvText.trim());
  if (parsed.length < 2) {
    return { valid: false, headerError: 'File CSV harus memuat baris header dan minimal 1 baris data.', rows: [] };
  }

  const headers = parsed[0].map((h) => h.trim());
  if (!headers.includes('displayName')) {
    return { valid: false, headerError: 'Kolom wajib "displayName" tidak ditemukan pada header CSV.', rows: [] };
  }

  const existingById = new Map(existingProfiles.map((p) => [p.id, p]));
  const existingByName = new Map(existingProfiles.map((p) => [p.displayName.trim().toLowerCase(), p]));

  const rows: CsvImportRowDiff[] = [];

  for (let r = 1; r < parsed.length; r++) {
    const rawCells = parsed[r];
    const obj: Record<string, string> = {};
    headers.forEach((h, idx) => {
      obj[h] = (rawCells[idx] ?? '').trim();
    });

    const errors: string[] = [];
    const matched =
      (obj.id ? existingById.get(obj.id) : undefined) ||
      (obj.displayName ? existingByName.get(obj.displayName.toLowerCase()) : undefined);

    if (!obj.displayName && !matched) {
      errors.push('Nama tampilan wajib diisi untuk profil baru.');
    }
    if (obj.socionics && !VALID_SOCIONICS.has(obj.socionics.toUpperCase())) {
      errors.push(`Kode Socionics "${obj.socionics}" tidak valid.`);
    }
    if (obj.quadra && !VALID_QUADRAS.has(obj.quadra)) {
      errors.push(`Quadra "${obj.quadra}" harus Alpha/Beta/Gamma/Delta.`);
    }
    if (obj.enneagramCore && !/^[1-9]$/.test(obj.enneagramCore)) {
      errors.push(`Enneagram Inti "${obj.enneagramCore}" harus angka 1–9.`);
    }
    if (obj.mbti && !/^[EI][SN][TF][JP]$/i.test(obj.mbti)) {
      errors.push(`Kode MBTI "${obj.mbti}" harus 4 huruf valid (mis. INTJ).`);
    }
    if (obj.sloanCode && !/^[SR][LC][OU][AE][IN]$/i.test(obj.sloanCode)) {
      errors.push(`Kode SLOAN "${obj.sloanCode}" harus 5 huruf standar (S/R, L/C, O/U, A/E, I/N).`);
    }

    const changes: { field: string; from: string; to: string }[] = [];
    const patch: Record<string, string | number | null> = {};

    const checkChange = (field: string, currentVal: string, nextVal: string | undefined) => {
      if (nextVal === undefined || nextVal === '') return;
      patch[field] = nextVal;
      if (currentVal !== nextVal) {
        changes.push({ field, from: currentVal || '-', to: nextVal });
      }
    };

    if (matched) {
      checkChange('displayName', matched.displayName, obj.displayName);
      checkChange('fullName', matched.fullName, obj.fullName);
      checkChange('affiliation', matched.affiliation, obj.affiliation);
      checkChange('quadra', matched.typology.quadra, obj.quadra as QuadraName);
      checkChange('socionics', matched.typology.socionics, obj.socionics?.toUpperCase() as SocionicsCode);
      if (obj.enneagramCore) {
        patch.enneagramCore = Number(obj.enneagramCore);
        if (String(matched.typology.enneagramCore ?? '') !== obj.enneagramCore) {
          changes.push({ field: 'enneagramCore', from: String(matched.typology.enneagramCore ?? '-'), to: obj.enneagramCore });
        }
      }
      checkChange('enneagramWing', matched.typology.enneagramWing, obj.enneagramWing);
      checkChange('instinctVariant', matched.typology.instinctVariant, obj.instinctVariant?.toUpperCase());
      checkChange('instinctStacking', matched.typology.instinctStacking, obj.instinctStacking?.toUpperCase());
      checkChange('tritype', matched.typology.tritype, obj.tritype);
      checkChange('jungian', matched.typology.jungian, obj.jungian);
      checkChange('psychosophyCode', matched.typology.psychosophyCode, obj.psychosophyCode?.toUpperCase());
      checkChange('mbti', matched.typology.mbti || '', obj.mbti?.toUpperCase());
      checkChange('mbtiCognitiveStack', matched.typology.mbtiCognitiveStack || '', obj.mbtiCognitiveStack);
      checkChange('sloanCode', matched.typology.sloanCode || '', obj.sloanCode?.toUpperCase());
      checkChange('sloanExtended', matched.typology.sloanExtended || '', obj.sloanExtended);
      checkChange('temperament', matched.typology.temperament || '', obj.temperament);
      checkChange('temperamentSecondary', matched.typology.temperamentSecondary || '', obj.temperamentSecondary);
    } else {
      Object.entries(obj).forEach(([k, v]) => {
        if (v) {
          patch[k] = k === 'enneagramCore' ? Number(v) : v;
          changes.push({ field: k, from: '-', to: v });
        }
      });
    }

    rows.push({
      rowIndex: r,
      profileId: matched?.id || obj.id || `csv-new-${r}`,
      displayName: obj.displayName || matched?.displayName || `Baris ${r}`,
      action: errors.length > 0 ? 'error' : matched ? 'update' : 'create',
      errors,
      changes,
      patch,
    });
  }

  return {
    valid: rows.every((row) => row.action !== 'error'),
    rows,
  };
}
