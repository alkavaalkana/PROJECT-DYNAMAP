import { ENNEAGRAM_TYPES, INSTINCT_STACKINGS, INSTINCT_VARIANTS } from '../data/enneagramData';
import {
  PSYCHOSOPHY_16_PLACEMENTS,
  PSYCHOSOPHY_ASPECTS,
  PSYCHOSOPHY_CONFLICT_PRINCIPLES,
  PSYCHOSOPHY_MAP,
  PSYCHOSOPHY_POSITIONS,
  type PsychosophyPairwiseConflictPrinciple,
  type PsychosophyPlacementGuide,
  type PsychosophyTypeSpec,
} from '../data/psychosophyData';
import { SOCIONICS_TYPES, parseJungianNotation } from '../data/socionicsData';
import type {
  Profile,
  PsychosophyAspect,
  PsychosophyPositionNumber,
} from '../types/dynamap';

export interface PsychosophyValidationResult {
  valid: boolean;
  normalizedCode: string;
  isEmpty: boolean;
  error?: string;
}

const VALID_ASPECTS = new Set<PsychosophyAspect>(['L', 'V', 'E', 'F']);

export function validatePsychosophyCode(raw: string | null | undefined): PsychosophyValidationResult {
  const cleaned = (raw ?? '').trim().toUpperCase();
  if (!cleaned) {
    return { valid: true, normalizedCode: '', isEmpty: true };
  }

  if (cleaned.length !== 4) {
    return {
      valid: false,
      normalizedCode: cleaned,
      isEmpty: false,
      error:
        'Notasi Psikosofi harus terdiri atas tepat 4 huruf (atau dikosongkan jika belum ditentukan), misalnya LVEF atau ELVF.',
    };
  }

  const chars = cleaned.split('');
  for (const ch of chars) {
    if (!VALID_ASPECTS.has(ch as PsychosophyAspect)) {
      return {
        valid: false,
        normalizedCode: cleaned,
        isEmpty: false,
        error: `Huruf "${ch}" tidak valid. Psikosofi hanya menggunakan empat aspek: L (Logika), V (Kehendak/Volition), E (Emosi), dan F (Fisika/Physics).`,
      };
    }
  }

  const unique = new Set(chars);
  if (unique.size !== 4) {
    return {
      valid: false,
      normalizedCode: cleaned,
      isEmpty: false,
      error:
        'Setiap huruf L, V, E, dan F harus muncul tepat satu kali tanpa pengulangan (contoh valid: LVEF, VLEF, ELVF).',
    };
  }

  return {
    valid: true,
    normalizedCode: cleaned,
    isEmpty: false,
  };
}

export interface ParsedPsychosophyPlacement {
  position: PsychosophyPositionNumber;
  aspect: PsychosophyAspect;
  code: string; // e.g. "1L"
  aspectName: string;
  positionLabel: string;
  guide: PsychosophyPlacementGuide;
}

export interface ParsedPsychosophyProfile {
  valid: boolean;
  code: string;
  typeSpec: PsychosophyTypeSpec | null;
  placements: ParsedPsychosophyPlacement[];
  interactionSynthesis: string;
  positionMap: Record<PsychosophyAspect, PsychosophyPositionNumber> | null;
}

export function parsePsychosophyPositions(rawCode: string | null | undefined): ParsedPsychosophyProfile {
  const validation = validatePsychosophyCode(rawCode);
  if (!validation.valid || validation.isEmpty) {
    return {
      valid: false,
      code: validation.normalizedCode,
      typeSpec: null,
      placements: [],
      interactionSynthesis: '',
      positionMap: null,
    };
  }

  const code = validation.normalizedCode;
  const typeSpec = PSYCHOSOPHY_MAP[code] ?? null;
  const chars = code.split('') as PsychosophyAspect[];
  const positionMap = {} as Record<PsychosophyAspect, PsychosophyPositionNumber>;

  const placements: ParsedPsychosophyPlacement[] = chars.map((aspect, idx) => {
    const position = (idx + 1) as PsychosophyPositionNumber;
    positionMap[aspect] = position;
    const placementCode = `${position}${aspect}`;
    return {
      position,
      aspect,
      code: placementCode,
      aspectName: PSYCHOSOPHY_ASPECTS[aspect].indonesianName,
      positionLabel: PSYCHOSOPHY_POSITIONS[position].labelIndonesian,
      guide: PSYCHOSOPHY_16_PLACEMENTS[placementCode],
    };
  });

  const p1 = placements[0];
  const p2 = placements[1];
  const p3 = placements[2];
  const p4 = placements[3];

  const interactionSynthesis = typeSpec
    ? `${typeSpec.positionalSynthesis} Secara keseluruhan, kombinasi ${p1.code} + ${p2.code} menjadi pendorong kepercayaan diri utama (monologis pada ${p1.aspect}, dialogis pada ${p2.aspect}), sementara ${p3.code} membutuhkan penyampaian yang menghargai martabat diri agar tidak memicu kewaspadaan, dan ${p4.code} ditempatkan sebagai ranah ringan yang menghemat energi.`
    : `Posisi ${p1.code} menjadi jangkar keyakinan mandiri yang ditopang keluwesan dialogis pada ${p2.code}, dengan kepekaan khusus di ${p3.code} dan sikap ringan di ${p4.code}.`;

  return {
    valid: true,
    code,
    typeSpec,
    placements,
    interactionSynthesis,
    positionMap,
  };
}

export interface CombinedTypologyLens {
  framework: string;
  code: string;
  lensDescription: string;
  statusNote: string;
}

export interface CombinedTypologySynthesis {
  displayName: string;
  lenses: CombinedTypologyLens[];
  integrationHypotheses: string[];
  possibleInternalTensions: string[];
  frameworkBoundaryDisclaimer: string;
}

export function generateCombinedTypologyProfile(profile: Profile): CombinedTypologySynthesis {
  const { typology } = profile;
  const lenses: CombinedTypologyLens[] = [];
  const integrationHypotheses: string[] = [];
  const possibleInternalTensions: string[] = [];

  const socSpec = typology.socionics ? SOCIONICS_TYPES[typology.socionics] : null;
  if (socSpec) {
    lenses.push({
      framework: 'Socionics (Model A)',
      code: `${socSpec.code} · Quadra ${socSpec.quadra}`,
      lensDescription: `Memetakan cara memproses informasi melalui Leading ${socSpec.modelA[0]} dan Creative ${socSpec.modelA[1]} (Blok Ego), dengan area sensitif pada PoLR ${socSpec.modelA[3]} serta kebutuhan dukungan di Suggestive ${socSpec.modelA[4]}.`,
      statusNote: `Status: ${typology.status}`,
    });
  }

  const ennSpec = typology.enneagramCore ? ENNEAGRAM_TYPES[typology.enneagramCore] : null;
  if (ennSpec) {
    const stSpec = typology.instinctStacking ? INSTINCT_STACKINGS[typology.instinctStacking] : null;
    const varSpec = typology.instinctVariant ? INSTINCT_VARIANTS[typology.instinctVariant] : null;
    const inst = stSpec
      ? `${stSpec.stacking} (blind ${stSpec.blind})`
      : varSpec
      ? varSpec.indonesianName
      : 'Insting belum dirinci';
    lenses.push({
      framework: 'Enneagram, Insting & Tritype',
      code: `${typology.enneagramRaw || `Tipe ${ennSpec.number}`}${typology.enneagramWing ? ` (${typology.enneagramWing})` : ''}${typology.tritype ? ` · Tritype ${typology.tritype}` : ''}`,
      lensDescription: `Memetakan motivasi inti ("${ennSpec.coreDesire}") dan ketakutan inti (${ennSpec.coreFear.toLowerCase()}) pada Pusat ${ennSpec.center} (${ennSpec.harmonic} / ${ennSpec.hornevian}), dipadukan dengan orientasi insting: ${inst}.`,
      statusNote: typology.threeFix ? `Three Fix: ${typology.threeFix}` : 'Three Fix opsional',
    });
  }

  if (typology.jungian) {
    const jung = parseJungianNotation(typology.jungian);
    lenses.push({
      framework: 'Tipologi Jung (Notasi Proyek)',
      code: typology.jungian,
      lensDescription: jung.valid
        ? `Menunjukkan sikap dominan ${jung.dominantFunction} (${jung.dominantOrientation}) dengan pendamping ${jung.accompanyingFunction} sesuai konvensi pencatatan proyek.`
        : `Notasi proyek: ${typology.jungian}.`,
      statusNote: 'Tidak dikonversi otomatis ke MBTI',
    });
  }

  const psyParsed = parsePsychosophyPositions(typology.psychosophyCode);
  if (psyParsed.valid) {
    lenses.push({
      framework: 'Psikosofi (Psychosophy / AP)',
      code: `${psyParsed.code}${psyParsed.typeSpec ? ` (“${psyParsed.typeSpec.afanasyevNickname}” — Afanasyev)` : ''}`,
      lensDescription: psyParsed.interactionSynthesis,
      statusNote: `${typology.psychosophyConfidence || 'Provisional'}${typology.psychosophyProvisional ? ' · Provisional' : ''}`,
    });
  } else {
    lenses.push({
      framework: 'Psikosofi (Psychosophy / AP)',
      code: 'Belum Ditentukan',
      lensDescription:
        'Belum ada kode Psikosofi 4 huruf yang ditetapkan untuk profil ini. Eksplorasi posisi L, V, E, dan F dapat dilakukan secara mandiri melalui modul Psikosofi atau Profil Saya.',
      statusNote: typology.psychosophyConfidence || 'Belum Dipastikan',
    });
  }

  // Multi-lens cross-framework hypotheses (strictly separated, never merged!)
  if (socSpec && psyParsed.valid && psyParsed.positionMap) {
    const vPos = psyParsed.positionMap.V;
    const lPos = psyParsed.positionMap.L;
    const ePos = psyParsed.positionMap.E;
    const fPos = psyParsed.positionMap.F;

    integrationHypotheses.push(
      `Dari lensa pemrosesan informasi (Socionics ${socSpec.code}), perhatian alami tertuju pada ${socSpec.modelA[0]}/${socSpec.modelA[1]}; sementara dari lensa sikap prioritas (Psikosofi ${psyParsed.code}), kepastian mandiri dipegang pada aspek ${psyParsed.placements[0].code} dan kepekaan terhadap evaluasi berada di ${psyParsed.placements[2].code}.`
    );

    if (['Te', 'Ti'].includes(socSpec.modelA[0]) && lPos >= 3) {
      possibleInternalTensions.push(
        `Menarik diperhatikan (hipotesis): meskipun Socionics ${socSpec.code} mengutamakan elemen logika (${socSpec.modelA[0]}), Psikosofi menempatkan Logika di posisi ${lPos}L—ini menunjukkan bahwa preferensi memproses informasi logis tidak selalu berarti merasa paling santai atau tak tersentuh saat berdebat intelektual.`
      );
    }
    if (['Fe', 'Fi'].includes(socSpec.modelA[0]) && ePos >= 3) {
      possibleInternalTensions.push(
        `Perbedaan antar-kerangka: kepekaan etika/perasaan pada Socionics (${socSpec.modelA[0]}) dapat berjalan bersamaan dengan kehati-hatian menampakkan emosi secara publik pada ${ePos}E—membuktikan bahwa kepekaan batin ≠ ekspresivitas emosional luar.`
      );
    }
    if (vPos === 1 && socSpec.modelA[3] === 'Se') {
      possibleInternalTensions.push(
        `Kombinasi menarik: arah kehendak pribadi yang tegas (1V) namun kepekaan pada tekanan konfrontasi fisik langsung (PoLR Se) menunjukkan ketegasan prinsip dapat diekspresikan lewat otonomi tenang daripada agresi konfrontatif.`
      );
    }
    if (fPos === 4 && ['Si', 'Se'].includes(socSpec.modelA[0])) {
      possibleInternalTensions.push(
        `Fokus penginderaan konkret di Socionics (${socSpec.modelA[0]}) dengan 4F menunjukkan persepsi situasional yang tajam dapat tetap hadir meski individu tidak berinvestasi ego besar dalam detail kenyamanan material pribadi.`
      );
    }
  }

  if (ennSpec && psyParsed.valid && psyParsed.positionMap) {
    integrationHypotheses.push(
      `Motivasi emosional inti Enneagram Tipe ${ennSpec.number} ("${ennSpec.coreDesire}") dapat memengaruhi cara ${psyParsed.placements[0].code} (posisi 1) dan ${psyParsed.placements[2].code} (posisi 3) bekerja dalam interaksi harian—misalnya saat melindungi harga diri atau mencari rasa aman.`
    );
    if (
      (ennSpec.hornevian === 'Compliant' || ennSpec.number === 9) &&
      psyParsed.positionMap.V === 1
    ) {
      possibleInternalTensions.push(
        `Potensi ketegangan internal: dorongan menjaga harmoni atau tanggung jawab sosial (Enneagram Tipe ${ennSpec.number}) berhadapan dengan keinginan kuat menjaga arah keputusan sendiri (1V).`
      );
    }
    if (ennSpec.number === 8 && psyParsed.positionMap.V === 3) {
      possibleInternalTensions.push(
        `Jika Tipe 8 bertemu 3V, kewaspadaan agar tidak dikendalikan oleh orang lain (Tipe 8) bisa tampil bersamaan dengan kepekaan tinggi terhadap wibawa dan keadilan posisi (3V).`
      );
    }
  }

  if (integrationHypotheses.length === 0) {
    integrationHypotheses.push(
      'Setiap kerangka di atas mengukur dimensi berbeda: Socionics membaca pertukaran elemen informasi, Enneagram membaca motivasi dan ketakutan inti, Jung memetakan sikap fungsi sadar, dan Psikosofi memetakan prioritas serta sensitivitas terhadap L, V, E, dan F.'
    );
  }

  if (possibleInternalTensions.length === 0) {
    possibleInternalTensions.push(
      'Perbedaan antara kemampuan nyata di sekolah, kebutuhan emosional, dan kebiasaan komunikasi sering jauh lebih kompleks daripada satu kode tunggal; gunakan perbandingan antar-kerangka ini hanya sebagai pemantik refleksi diri.'
    );
  }

  return {
    displayName: profile.displayName,
    lenses,
    integrationHypotheses,
    possibleInternalTensions,
    frameworkBoundaryDisclaimer:
      'Catatan Metodologis DYNAMAP: Socionics, Enneagram, Tipologi Jung, dan Psikosofi TIDAK saling membuktikan, mengonversi otomatis, ataupun digabung menjadi satu sistem tunggal. Masing-masing dipertahankan sebagai lensa terpisah yang bersifat hipotesis teoretis.',
  };
}

export interface PsychosophyAspectComparison {
  aspect: PsychosophyAspect;
  aspectTitle: string;
  p1Placement: string;
  p2Placement: string;
  interactionSummary: string;
}

export interface PsychosophyPairComparison {
  available: boolean;
  summary: string;
  aspectComparisons: PsychosophyAspectComparison[];
  activeConflictPrinciples: PsychosophyPairwiseConflictPrinciple[];
}

export function comparePsychosophyProfiles(p1: Profile, p2: Profile): PsychosophyPairComparison {
  const parsed1 = parsePsychosophyPositions(p1.typology.psychosophyCode);
  const parsed2 = parsePsychosophyPositions(p2.typology.psychosophyCode);

  if (!parsed1.valid || !parsed2.valid || !parsed1.positionMap || !parsed2.positionMap) {
    const missingNames = [
      !parsed1.valid ? p1.displayName : null,
      !parsed2.valid ? p2.displayName : null,
    ].filter(Boolean);

    return {
      available: false,
      summary: `Data Psikosofi belum lengkap untuk ${missingNames.join(' dan ')}. Karena kode 4 huruf Psikosofi bersifat opsional hingga diisi/dikonfirmasi, perbandingan di aspek L/V/E/F baru berupa panduan umum tanpa menempatkan individu ke posisi spesifik secara sepihak.`,
      aspectComparisons: [],
      activeConflictPrinciples: [],
    };
  }

  const aspects: PsychosophyAspect[] = ['L', 'V', 'E', 'F'];
  const aspectComparisons: PsychosophyAspectComparison[] = aspects.map((asp) => {
    const pos1 = parsed1.positionMap![asp];
    const pos2 = parsed2.positionMap![asp];
    const code1 = `${pos1}${asp}`;
    const code2 = `${pos2}${asp}`;
    const aspTitle = PSYCHOSOPHY_ASPECTS[asp].indonesianName;

    let interactionSummary = '';
    if (pos1 === pos2) {
      if (pos1 === 1) {
        interactionSummary = `Keduanya sama-sama memiliki ${code1} (Posisi 1 Dominan). Jika pandangan awal sama, sinerginya sangat tegas; namun jika berbeda, masing-masing bisa bersikeras pada keyakinan pribadinya karena sama-sama berorientasi hasil mandiri.`;
      } else if (pos1 === 2) {
        interactionSummary = `Keduanya sama-sama menempatkan ${asp} di Posisi 2 (${code1}). Ini memberi ruang diskusi yang sehat, dialogis, dan saling terbuka—namun perlu disepakati batas waktu agar eksplorasi tidak berlarut.`;
      } else if (pos1 === 3) {
        interactionSummary = `Keduanya sama-sama sensitif pada ${code1} (Posisi 3). Keduanya dapat saling memahami rasa rentan di bidang ini, tetapi juga berisiko saling menghindar atau mudah tersinggung bila nada kritik terasa tajam.`;
      } else {
        interactionSummary = `Keduanya menempatkan ${asp} di Posisi 4 (${code1}). Urusan di aspek ini cenderung dibuat praktis dan ringan, meski keduanya perlu sepakat agar aspek praktis tersebut tidak terabaikan seluruhnya.`;
      }
    } else if ((pos1 === 1 && pos2 === 3) || (pos1 === 3 && pos2 === 1)) {
      const pFirst = pos1 === 1 ? p1.displayName : p2.displayName;
      const pThird = pos1 === 3 ? p1.displayName : p2.displayName;
      interactionSummary = `Titik sensitif utama: ${pFirst} (1${asp}) berbicara dengan kepastian mandiri tanpa berbelit, sedangkan ${pThird} (3${asp}) sangat peka terhadap nada koreksi atau dominasi di bidang ${asp}. Gaya langsung 1${asp} mudah terbaca sebagai tekanan oleh 3${asp}.`;
    } else if ((pos1 === 2 && pos2 === 3) || (pos1 === 3 && pos2 === 2)) {
      const pSecond = pos1 === 2 ? p1.displayName : p2.displayName;
      const pThird = pos1 === 3 ? p1.displayName : p2.displayName;
      interactionSummary = `Berpotensi saling melengkapi: ${pSecond} (2${asp}) dapat berdialog secara tenang dan suportif untuk membantu ${pThird} (3${asp}) merasa lebih aman—asalkan tidak memaksa proses pembahasan berulang saat ${pThird} sedang lelah.`;
    } else if ((pos1 === 1 && pos2 === 4) || (pos1 === 4 && pos2 === 1)) {
      const pFirst = pos1 === 1 ? p1.displayName : p2.displayName;
      const pFourth = pos1 === 4 ? p1.displayName : p2.displayName;
      interactionSummary = `Asimetri prioritas: ${pFirst} (1${asp}) sangat memegang standar pribadi pada ${asp}, sedangkan ${pFourth} (4${asp}) bersikap ringan dan siap mengikuti kesepakatan yang efisien selama dijelaskan secara jelas dan tidak meremehkan batasnya.`;
    } else if ((pos1 === 2 && pos2 === 4) || (pos1 === 4 && pos2 === 2)) {
      const pSecond = pos1 === 2 ? p1.displayName : p2.displayName;
      const pFourth = pos1 === 4 ? p1.displayName : p2.displayName;
      interactionSummary = `${pSecond} (2${asp}) suka mengeksplorasi dan mendiskusikan aspek ${asp} secara aktif, sedangkan ${pFourth} (4${asp}) cepat merasa cukup pada hasil ringkas—sehingga ${pSecond} perlu menghindari pembahasan berlebihan yang membuat ${pFourth} jenuh.`;
    } else {
      interactionSummary = `Perbedaan ritme: ${p1.displayName} (${code1}) dan ${p2.displayName} (${code2}) berinteraksi lintas posisi Result/Process sehingga perlu menyepakati seberapa dalam aspek ${asp} perlu dibahas bersama.`;
    }

    return {
      aspect: asp,
      aspectTitle: aspTitle,
      p1Placement: code1,
      p2Placement: code2,
      interactionSummary,
    };
  });

  const activeConflictPrinciples: PsychosophyPairwiseConflictPrinciple[] = [];
  const pm1 = parsed1.positionMap;
  const pm2 = parsed2.positionMap;

  if ((pm1.V === 1 && pm2.V === 3) || (pm1.V === 3 && pm2.V === 1)) {
    const p = PSYCHOSOPHY_CONFLICT_PRINCIPLES.find((x) => x.id === '1v-3v');
    if (p) activeConflictPrinciples.push(p);
  }
  if ((pm1.L === 1 && pm2.L === 3) || (pm1.L === 3 && pm2.L === 1)) {
    const p = PSYCHOSOPHY_CONFLICT_PRINCIPLES.find((x) => x.id === '1l-3l');
    if (p) activeConflictPrinciples.push(p);
  }
  if ((pm1.E <= 2 && pm2.E >= 3) || (pm2.E <= 2 && pm1.E >= 3)) {
    const p = PSYCHOSOPHY_CONFLICT_PRINCIPLES.find((x) => x.id === '1e2e-3e4e');
    if (p) activeConflictPrinciples.push(p);
  }
  if ((pm1.F <= 2 && pm2.F >= 3) || (pm2.F <= 2 && pm1.F >= 3)) {
    const p = PSYCHOSOPHY_CONFLICT_PRINCIPLES.find((x) => x.id === '1f2f-3f4f');
    if (p) activeConflictPrinciples.push(p);
  }
  const hasResultProcessMismatch = aspects.some((asp) => {
    const r1 = pm1[asp] === 1 || pm1[asp] === 4;
    const r2 = pm2[asp] === 1 || pm2[asp] === 4;
    return r1 !== r2;
  });
  if (hasResultProcessMismatch) {
    const p = PSYCHOSOPHY_CONFLICT_PRINCIPLES.find((x) => x.id === 'result-vs-process');
    if (p) activeConflictPrinciples.push(p);
  }

  return {
    available: true,
    summary: `${p1.displayName} (${parsed1.code}${parsed1.typeSpec ? ` · “${parsed1.typeSpec.afanasyevNickname}”` : ''}) dan ${p2.displayName} (${parsed2.code}${parsed2.typeSpec ? ` · “${parsed2.typeSpec.afanasyevNickname}”` : ''}) dibandingkan pada keempat aspek L, V, E, dan F untuk memetakan perbedaan tingkat kepastian, sensitivitas, dan prioritas energi.`,
    aspectComparisons,
    activeConflictPrinciples,
  };
}
