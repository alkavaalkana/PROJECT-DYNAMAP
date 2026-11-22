import { ENNEAGRAM_TYPES, INSTINCT_STACKINGS, INSTINCT_VARIANTS } from '../data/enneagramData';
import {
  ALL_16_MBTI_PROFILES,
  CLASSICAL_4_TEMPERAMENTS,
  MBTI_STACK_DYNAMICS_16,
  MIXED_12_TEMPERAMENTS,
} from '../data/extendedTheoryData';
import { INFORMATION_ELEMENTS, QUADRAS, SOCIONICS_TYPES } from '../data/socionicsData';
import type {
  ContradictionItem,
  FrameworkBreakdownItem,
  InterpretedStatement,
  MultiLayerPersonalInterpretation,
  Profile,
  UserExplorationData,
} from '../types/dynamap';
import { parsePsychosophyPositions } from './psychosophy';
import { parseExtendedSloanNotation } from './sloanNotation';

export function resolveMbtiCognitiveStack(mbti?: string, manualStack?: string): {
  stackText: string;
  isManualOverride: boolean;
  entry: (typeof ALL_16_MBTI_PROFILES)[number] | null;
} {
  const cleanMbti = (mbti || '').trim().toUpperCase();
  const entry = ALL_16_MBTI_PROFILES.find((m) => m.code === cleanMbti) || null;
  const cleanManual = (manualStack || '').trim();
  if (cleanManual) {
    return {
      stackText: cleanManual,
      isManualOverride: Boolean(entry && cleanManual.replace(/\s+/g, '') !== entry.grantStack.join('–').replace(/\s+/g, '')),
      entry,
    };
  }
  if (entry) {
    return {
      stackText: entry.grantStack.join(' – '),
      isManualOverride: false,
      entry,
    };
  }
  return { stackText: '', isManualOverride: false, entry: null };
}

function findTemperamentEntry(primary?: string, secondary?: string) {
  const p = (primary || '').trim().toLowerCase();
  const s = (secondary || '').trim().toLowerCase();
  const norm = (val: string) => {
    if (val.startsWith('sang')) return 'Sanguine';
    if (val.startsWith('chol') || val.startsWith('kol')) return 'Choleric';
    if (val.startsWith('mel')) return 'Melancholic';
    if (val.startsWith('phleg') || val.startsWith('pleg')) return 'Phlegmatic';
    return '';
  };
  const np = norm(p);
  const ns = norm(s);
  const classical = CLASSICAL_4_TEMPERAMENTS.find((c) => c.name === np) || null;
  const mixed =
    np && ns && np !== ns
      ? MIXED_12_TEMPERAMENTS.find((m) => m.primary === np && m.secondary === ns) || null
      : null;
  return { np, ns, classical, mixed };
}

export function analyzeProfileContradictionsAndComplexity(profile: Profile): ContradictionItem[] {
  const t = profile.typology;
  const items: ContradictionItem[] = [];

  const soc = t.socionics ? SOCIONICS_TYPES[t.socionics] : null;
  const enn = t.enneagramCore ? ENNEAGRAM_TYPES[t.enneagramCore] : null;
  const psy = parsePsychosophyPositions(t.psychosophyCode);
  const mbtiCode = (t.mbti || '').trim().toUpperCase();
  const mbtiEntry = ALL_16_MBTI_PROFILES.find((m) => m.code === mbtiCode) || null;
  const sloanParsed = t.sloanExtended
    ? parseExtendedSloanNotation(t.sloanExtended)
    : t.sloanCode
    ? parseExtendedSloanNotation(t.sloanCode)
    : null;
  const sloan5 = sloanParsed?.canonicalFiveLetter || (t.sloanCode || '').trim().toUpperCase();
  const tempInfo = findTemperamentEntry(t.temperament, t.temperamentSecondary);

  // 1. Data Inconsistencies
  if (soc && t.quadra && soc.quadra !== t.quadra) {
    items.push({
      id: 'inc-quadra-socionics',
      category: 'Inkonsistensi Data',
      severity: 'perhatian',
      title: `Quadra (${t.quadra}) tidak cocok dengan Socionics (${soc.code})`,
      frameworksOrFields: ['Quadra', 'Socionics'],
      explanation: `Dalam teori Socionics Model A, tipe ${soc.code} tergabung dalam Quadra ${soc.quadra} (${QUADRAS[soc.quadra].valuedElements.join(', ')}), bukan ${t.quadra}.`,
      coexistenceGuidance: 'Periksa kembali apakah salah satu kolom terlewat diperbarui saat revisi tipe di Admin atau Editor Profil.',
      reflectionQuestion: 'Apakah elemen yang Anda hargai lebih dekat ke nilai Quadra ' + soc.quadra + ' atau ' + t.quadra + '?',
    });
  }

  if (t.enneagramCore && t.tritype && !t.tritype.includes(String(t.enneagramCore))) {
    items.push({
      id: 'inc-enneagram-tritype',
      category: 'Inkonsistensi Data',
      severity: 'perhatian',
      title: `Enneagram Inti (${t.enneagramCore}) tidak tercantum di Tritype (${t.tritype})`,
      frameworksOrFields: ['Enneagram Inti', 'Tritype'],
      explanation: `Secara struktural, Tritype/Trifix memuat satu tipe dari masing-masing pusat dan harus menyertakan tipe inti (${t.enneagramCore}) di dalamnya.`,
      coexistenceGuidance: 'Jika Anda masih menimbang ulang tipe inti antara dua kandidat (misalnya antara inti lama dan salah satu angka Tritype), tandai salah satunya sebagai hipotesis provisional.',
      reflectionQuestion: `Dorongan batin mana yang paling terasa sebagai ketakutan inti sehari-hari: Tipe ${t.enneagramCore} atau salah satu angka di ${t.tritype}?`,
    });
  }

  if (t.instinctVariant && t.instinctStacking && !t.instinctStacking.startsWith(t.instinctVariant)) {
    items.push({
      id: 'inc-instinct-stacking',
      category: 'Inkonsistensi Data',
      severity: 'perhatian',
      title: `Varian Insting (${t.instinctVariant}) berbeda dari awal Stacking (${t.instinctStacking})`,
      frameworksOrFields: ['Instinct Variant', 'Instinctual Stacking'],
      explanation: `Stacking ${t.instinctStacking} menempatkan ${t.instinctStacking.slice(0, 2)} sebagai insting dominan pertama, sedangkan kolom varian tercatat ${t.instinctVariant}.`,
      coexistenceGuidance: 'Selaraskan varian utama dengan urutan stacking pertama setelah mengamati area prioritas hidup mana yang paling otomatis memicu kewaspadaan Anda.',
      reflectionQuestion: 'Antara rasa aman pribadi (SP), dinamika sosial/kelompok (SO), dan intensitas relasi/minat (SX), mana yang paling cepat menyita perhatian Anda?',
    });
  }

  if (t.mbtiCognitiveStack && mbtiEntry) {
    const manualHead = t.mbtiCognitiveStack.split(/[-–>,\s]+/)[0]?.trim();
    if (manualHead && manualHead.toLowerCase() !== mbtiEntry.grantStack[0].toLowerCase()) {
      items.push({
        id: 'inc-mbti-stack-override',
        category: 'Ketidakcocokan Interpretasi Populer',
        severity: 'nuansa',
        title: `Tumpukan fungsi manual (${t.mbtiCognitiveStack}) berbeda dari standar Grant untuk ${mbtiEntry.code}`,
        frameworksOrFields: ['MBTI', 'Tumpukan Fungsi Kognitif'],
        explanation: `Model populer Grant memetakan ${mbtiEntry.code} sebagai ${mbtiEntry.grantStack.join('–')}, sedangkan profil Anda mencatat ${t.mbtiCognitiveStack}. Perbedaan ini bisa sah menurut model non-Grant (seperti sebagian penafsiran Jung klasik IIEE/EEII) atau menandakan kandidat tipe MBTI lain.`,
        coexistenceGuidance: 'Pertahankan catatan khusus ini jika memang dipilih secara sadar sebagai variasi teori Jungian, atau gunakan refleksi harian untuk memeriksa fungsi dominan sebenarnya.',
        reflectionQuestion: 'Apakah fungsi pertama dalam catatan manual Anda lebih akurat mencerminkan cara berpikir alami dibanding kode 4 huruf MBTI?',
      });
    }
  }

  // 2. Cross-Framework Contrasts
  if (mbtiEntry && sloan5.length === 5) {
    if (mbtiEntry.dichotomyBreakdown.EorI === 'E' && sloan5[0] === 'R') {
      items.push({
        id: 'diff-mbtiE-sloanR',
        category: 'Perbedaan Antar-Kerangka',
        severity: 'nuansa',
        title: `Ekstraversi Kognitif (${mbtiEntry.code}) beriringan dengan Reserved Sosial (${sloan5})`,
        frameworksOrFields: ['MBTI', 'SLOAN / Big Five'],
        explanation: `MBTI mengukur arah fokus energi kognitif (${mbtiEntry.grantStack[0]} terarah ke dunia luar ide/objek), sedangkan kutub R pada SLOAN mengukur tingkat keramahan sosial & kebutuhan stimulasi keramaian. Seorang ENTP/ENFJ/ENTJ bisa tetap selektif dan tenang dalam pergaulan (R).`,
        coexistenceGuidance: 'Kedua label ini tidak bertentangan: Anda mungkin aktif mengeksplorasi gagasan atau proyek bersama dunia luar tanpa selalu menyukai pesta ramai atau obrolan ringan berkepanjangan.',
        reflectionQuestion: 'Dalam situasi apa Anda berenergi berdiskusi aktif, dan dalam situasi apa Anda justru memilih diam menghemat energi?',
      });
    }
    if (mbtiEntry.dichotomyBreakdown.JorP === 'J' && sloan5[2] === 'U') {
      items.push({
        id: 'diff-mbtiJ-sloanU',
        category: 'Perbedaan Antar-Kerangka',
        severity: 'nuansa',
        title: `Preferensi Judging (${mbtiEntry.code}) vs Kebiasaan Unstructured (${sloan5})`,
        frameworksOrFields: ['MBTI', 'SLOAN / Big Five'],
        explanation: `Huruf J pada MBTI menandai preferensi fungsi penilai yang terarah keluar (${mbtiEntry.grantStack[0]}/${mbtiEntry.grantStack[1]}), sedangkan U pada Big Five/SLOAN mencerminkan keteraturan jadwal dan kerapian praktis yang lebih longgar.`,
        coexistenceGuidance: 'Individu dengan visi konseptual terarah (mis. Ni-dom atau Fe-dom) sangat wajar merasa fleksibel atau kurang ketat dalam urusan berkas harian ketika motivasinya belum tersentuh.',
        reflectionQuestion: 'Apakah keinginan Anda terhadap "kejelasan arah" lebih kuat pada level gagasan besar dibanding kerapian jadwal mikro?',
      });
    }
    if (mbtiEntry.dichotomyBreakdown.TorF === 'F' && sloan5[3] === 'E') {
      items.push({
        id: 'diff-mbtiF-sloanE',
        category: 'Perbedaan Antar-Kerangka',
        severity: 'nuansa',
        title: `Kriteria Nilai Feeling (${mbtiEntry.code}) vs Lugas Kompetitif (${sloan5})`,
        frameworksOrFields: ['MBTI', 'SLOAN'],
        explanation: `Feeling (terutama Fi) menilai keputusan berdasar nilai etis dan ketulusan personal—yang kadang membuat seseorang bersikap sangat tegas dan enggan berkompromi semu (tampak sebagai E/Agreeableness rendah di Big Five).`,
        coexistenceGuidance: 'Keteguhan prinsip batin tidak harus selalu tampil serba mengiyakan.',
        reflectionQuestion: 'Kapan ketegasan Anda muncul untuk membela nilai personal alih-alih mengalah demi suasana?',
      });
    }
  }

  // 3. Cognitive vs Behavioral Splits (Socionics/MBTI vs Temperament/Psychosophy)
  if (soc && tempInfo.np) {
    const isIntroSoc = ['SEI', 'LII', 'LSI', 'IEI', 'ILI', 'ESI', 'EII', 'SLI'].includes(soc.code);
    if (isIntroSoc && (tempInfo.np === 'Choleric' || tempInfo.np === 'Sanguine')) {
      items.push({
        id: 'cog-beh-intro-active',
        category: 'Kognitif vs Perilaku',
        severity: 'nuansa',
        title: `Metabolisme Kognitif Introvert (${soc.code}) dengan Energi Perilaku ${tempInfo.classical?.indoName || tempInfo.np}`,
        frameworksOrFields: ['Socionics', 'Temperamen'],
        explanation: `Socionics memetakan urutan pengolahan informasi batin (${soc.modelA[0]} sebagai Leading), sedangkan temperamen menyorot laju respons dan ekspresivitas energi. Seseorang bertipe kognitif introvert tetap bisa tampil tegas menggerakkan tim (Koleris) atau hangat menghidupkan suasana (Sanguinis) saat konteksnya cocok.`,
        coexistenceGuidance: 'Pisahkan "dari mana pikiran Anda memulai analisis" (kognitif) dari "seberapa cepat suara dan tindakan Anda bereaksi di ruangan" (temperamen).',
        reflectionQuestion: 'Apakah sikap aktif/tegas Anda lebih sering muncul di topik atau kelompok tertentu saja?',
      });
    }
  }

  if (psy.valid && soc) {
    const isEthical = ['Fe', 'Fi'].includes(soc.modelA[0]) || ['Fe', 'Fi'].includes(soc.modelA[1]);
    const logicPos = psy.positionMap?.L;
    if (isEthical && logicPos === 1) {
      items.push({
        id: 'cog-beh-ethical-1l',
        category: 'Kognitif vs Perilaku',
        severity: 'nuansa',
        title: `Blok Ego Etika (${soc.code}) dengan Sikap 1L Psikosofi (${psy.code})`,
        frameworksOrFields: ['Socionics', 'Psikosofi'],
        explanation: `Blok Ego Etika (${soc.modelA[0]}/${soc.modelA[1]}) memberi kepekaan alami pada nuansa nilai atau dinamika emosi manusia, sedangkan 1L menunjukkan keyakinan tinggi pada kesimpulan intelektual pribadi tanpa merasa perlu berdebat panjang.`,
        coexistenceGuidance: 'Anda dapat bersikap empatik sekaligus sangat yakin pada prinsip nalar Anda sendiri.',
        reflectionQuestion: 'Bagaimana Anda menyeimbangkan kepastian argumen pribadi dengan ruang dialog bagi teman yang berpikir berbeda?',
      });
    }
  }

  // 4. Conflicting Motivations (Enneagram + Tritype + Instinct)
  if (enn && t.tritype && t.tritype.length >= 3) {
    const heartConflict = enn.hornevian === 'Withdrawn' && /[387]/.test(t.tritype);
    const assertiveSoft = enn.hornevian === 'Assertive' && /[926]/.test(t.tritype);
    if (heartConflict || assertiveSoft) {
      items.push({
        id: 'mot-enn-trifix',
        category: 'Motivasi Berlawanan',
        severity: 'nuansa',
        title: `Dinamika Inti Tipe ${enn.number} (${enn.hornevian}) bersama Fix Sekunder (${t.tritype})`,
        frameworksOrFields: ['Enneagram', 'Tritype'],
        explanation: heartConflict
          ? `Sebagai inti ${enn.number} yang cenderung menarik diri memproses di dalam (${enn.hornevian}), keberadaan fix asertif (3/7/8) di Tritype memunculkan dorongan ganda: ingin menjaga jarak tenang, namun pada situasi tertentu ikut terdorong bertindak tegas atau mengejar target tinggi.`
          : `Sebagai inti ${enn.number} yang tegas mengambil inisiatif (${enn.hornevian}), keberadaan fix penyesuai/penenang (2/6/9) menciptakan tarik-ulur antara dorongan langsung bergerak dan kepekaan menjaga penerimaan serta harmoni kelompok.`,
        coexistenceGuidance: 'Ingat bahwa tipe inti tetap memayungi arah utama motivasi Anda, sedangkan dua angka lain memperkaya strategi cadangan di pusat kecerdasan berbeda.',
        reflectionQuestion: 'Situasi sekolah seperti apa yang membuat sisi paling tegas dan sisi paling hati-hati Anda muncul bersamaan?',
      });
    }
  }

  // 5. Contextual Tendencies (always insightful contextual reality reminder)
  items.push({
    id: 'ctx-adaptation-vs-trait',
    category: 'Kecenderungan Kontekstual',
    severity: 'info',
    title: 'Variasi Respon antara Konteks Kelas Terstruktur vs Pergaulan Informal',
    frameworksOrFields: ['Preferensi Belajar', 'Konteks Sekolah'],
    explanation: `Siswa kerap menampilkan kedisiplinan atau keterbukaan berbeda saat berada di depan guru/penilaian resmi dibanding saat berdiskusi santai bersama teman akrab (${profile.learningPreferences.studySetting || 'berbagai situasi belajar'}).`,
    coexistenceGuidance: 'Perbedaan sikap antar-konteks bukan tanda kepribadian yang tidak konsisten, melainkan keluwesan adaptasi manusia terhadap tuntutan peran.',
    reflectionQuestion: 'Perbedaan terbesar apa yang Anda rasakan antara cara kerja Anda saat tugas individu vs kerja kelompok?',
  });

  // 6. Popular Interpretation Mismatches (Socionics J/P vs MBTI J/P caution)
  if (soc && mbtiEntry) {
    const isIntroSoc = ['SEI', 'LII', 'LSI', 'IEI', 'ILI', 'ESI', 'EII', 'SLI'].includes(soc.code);
    const socLastUpper = soc.modelA[0] === 'Te' || soc.modelA[0] === 'Ti' || soc.modelA[0] === 'Fe' || soc.modelA[0] === 'Fi' ? 'J' : 'P';
    if (isIntroSoc && mbtiEntry.dichotomyBreakdown.JorP !== socLastUpper) {
      items.push({
        id: 'pop-soc-mbti-jp',
        category: 'Ketidakcocokan Interpretasi Populer',
        severity: 'info',
        title: `Perbedaan Konvensi J/P pada Tipe Introvert: MBTI ${mbtiEntry.code} & Socionics ${soc.code}`,
        frameworksOrFields: ['MBTI', 'Socionics'],
        explanation: `Di komunitas daring, banyak orang keliru mengonversi huruf J/P MBTI mentah-mentah ke j/p Socionics. Pada kenyataannya untuk tipe introvert, huruf terakhir sering terbalik secara struktural (mis. INTJ MBTI sejajar struktur dengan ILI/INTp, bukan LII/INTj)—kecuali bila memang memiliki preferensi terpisah di kedua sistem.`,
        coexistenceGuidance: 'Pahami definisi fungsi dominan tiap sistem secara terpisah (Model A Socionics vs Dikotomi/Grant MBTI) alih-alih memaksakan konversi huruf.',
        reflectionQuestion: 'Dalam kedua sistem tersebut, fungsi atau elemen mana yang paling sesuai menjelaskan kebiasaan Anda sehari-hari?',
      });
    }
  }

  // 7. Insufficient Information Check
  const missingList: string[] = [];
  if (!soc) missingList.push('Socionics');
  if (!enn) missingList.push('Enneagram Inti');
  if (!t.instinctVariant && !t.instinctStacking) missingList.push('Insting');
  if (!t.tritype && !t.threeFix) missingList.push('Tritype/Three Fix');
  if (!psy.valid) missingList.push('Psikosofi');
  if (!mbtiEntry) missingList.push('MBTI');
  if (!sloan5) missingList.push('SLOAN / Big Five');
  if (!tempInfo.np) missingList.push('Temperamen');

  if (missingList.length > 0) {
    items.push({
      id: 'insufficient-info',
      category: 'Informasi Belum Lengkap',
      severity: 'info',
      title: `${missingList.length} Kerangka Belum Terisi Lengkap (${missingList.slice(0, 4).join(', ')}${missingList.length > 4 ? ', ...' : ''})`,
      frameworksOrFields: missingList,
      explanation: `Sebagian lapisan analisis belum dapat ditriangulasi penuh karena data ${missingList.join(', ')} belum dicantumkan. DYNAMAP sengaja tidak menebak atau mengisi otomatis kerangka yang belum terkonfirmasi.`,
      coexistenceGuidance: 'Anda tetap dapat membaca interpretasi berbasis data yang sudah ada dan melengkapi kerangka lain secara bertahap seiring proses eksplorasi.',
      reflectionQuestion: 'Kerangka mana yang saat ini paling ingin Anda pelajari lebih dulu di Perpustakaan Kerangka Teori?',
    });
  }

  return items;
}

export function buildMultiLayerPersonalInterpretation(
  profile: Profile,
  _exploration?: UserExplorationData | null
): MultiLayerPersonalInterpretation {
  const t = profile.typology;
  const lp = profile.learningPreferences;
  const soc = t.socionics ? SOCIONICS_TYPES[t.socionics] : null;
  const enn = t.enneagramCore ? ENNEAGRAM_TYPES[t.enneagramCore] : null;
  const instMain = t.instinctStacking
    ? (t.instinctStacking.slice(0, 2) as 'SP' | 'SO' | 'SX')
    : t.instinctVariant || '';
  const instSpec = instMain ? INSTINCT_VARIANTS[instMain] : null;
  const stackingSpec = t.instinctStacking ? INSTINCT_STACKINGS[t.instinctStacking] : null;
  const psy = parsePsychosophyPositions(t.psychosophyCode);
  const mbtiResolved = resolveMbtiCognitiveStack(t.mbti, t.mbtiCognitiveStack);
  const mbtiEntry = mbtiResolved.entry;
  const mbtiDynamics = mbtiEntry ? MBTI_STACK_DYNAMICS_16[mbtiEntry.code] || null : null;
  const sloanSource = (t.sloanExtended || t.sloanCode || '').trim();
  const sloanParsed = sloanSource ? parseExtendedSloanNotation(sloanSource) : null;
  const sloan5 = sloanParsed?.canonicalFiveLetter || (t.sloanCode || '').trim().toUpperCase();
  const tempInfo = findTemperamentEntry(t.temperament, t.temperamentSecondary);

  const filledFrameworks: string[] = [];
  const missingFrameworks: string[] = [];

  if (soc) filledFrameworks.push(`Socionics (${soc.code})`);
  else missingFrameworks.push('Socionics');

  if (enn) filledFrameworks.push(`Enneagram (Tipe ${enn.number}${t.enneagramWing ? ` · ${t.enneagramWing}` : ''})`);
  else missingFrameworks.push('Enneagram');

  if (instSpec || stackingSpec) filledFrameworks.push(`Insting (${t.instinctStacking || t.instinctVariant})`);
  else missingFrameworks.push('Instinctual Variants');

  if (t.tritype || t.threeFix) filledFrameworks.push(`Tritype/Trifix (${t.tritype || t.threeFix})`);
  else missingFrameworks.push('Tritype / Trifix');

  if (psy.valid) filledFrameworks.push(`Psikosofi (${psy.code})`);
  else missingFrameworks.push('Psikosofi');

  if (mbtiEntry) filledFrameworks.push(`MBTI (${mbtiEntry.code})`);
  else missingFrameworks.push('MBTI');

  if (sloanSource && sloanParsed?.isValid) filledFrameworks.push(`SLOAN (${sloanSource})`);
  else missingFrameworks.push('SLOAN');

  if (tempInfo.np) {
    const tLabel = tempInfo.mixed
      ? tempInfo.mixed.indoTitle.split(' (')[0]
      : tempInfo.classical?.indoName || t.temperament || '';
    filledFrameworks.push(`Temperamen (${tLabel})`);
  } else {
    missingFrameworks.push('Temperamen');
  }

  const completenessRatio = Math.round((filledFrameworks.length / 8) * 100);

  // ==================== LAYER B: FRAMEWORK BREAKDOWNS ====================
  const frameworkBreakdowns: FrameworkBreakdownItem[] = [
    {
      frameworkKey: 'socionics',
      frameworkName: 'Socionics Model A',
      available: Boolean(soc),
      codeDisplay: soc ? `${soc.code} · Quadra ${soc.quadra}` : 'Belum Diisi',
      summary: soc
        ? `${soc.indonesianTitle} (${soc.fullName}) — memprioritaskan pasangan Blok Ego ${soc.modelA[0]} (${INFORMATION_ELEMENTS[soc.modelA[0]].indonesianName.split('(')[0].trim()}) dan ${soc.modelA[1]} dalam Quadra ${soc.quadra}.`
        : 'Data Socionics belum tercatat pada profil ini.',
      coreMechanisms: soc
        ? [
            `Leading ${soc.modelA[0]} & Creative ${soc.modelA[1]} membentuk lensa pengolahan informasi utama.`,
            `Titik peka PoLR berada pada ${soc.modelA[3]}, sedangkan dukungan paling nyaman diterima di Suggestive ${soc.modelA[4]}.`,
          ]
        : [],
      unavailableAspects: soc ? [] : ['Gaya metabolisme informasi Model A & dinamika Quadra belum dapat dipetakan.'],
      provenance: {
        supportingProfileData: soc ? [`socionics: ${soc.code}`, `quadra: ${t.quadra || soc.quadra}`] : [],
        frameworksInvolved: ['Socionics Model A'],
        theoreticalExplanation: soc
          ? `Blok Ego (${soc.modelA[0]}/${soc.modelA[1]}) menjelaskan elemen yang paling bernilai dan produktif, sementara PoLR (${soc.modelA[3]}) menandai titik sensitif terhadap kritik langsung.`
          : 'Menunggu pengisian kode Socionics.',
        theoryReferences: ['Augustinavichiute (1970s/1998); Panduan Model A DYNAMAP.'],
        synthesisKind: 'direct-framework',
        epistemicLabel: 'Interpretasi Tipologis Terstruktur',
        limitationsAndAlternatives: ['Socionics bersifat model konseptual-observasional, bukan tes psikometrik klinis.'],
      },
    },
    {
      frameworkKey: 'enneagram',
      frameworkName: 'Enneagram Inti & Sayap',
      available: Boolean(enn),
      codeDisplay: enn ? `${t.enneagramWing || `Tipe ${enn.number}`}${t.enneagramRaw ? ` (${t.enneagramRaw})` : ''}` : 'Belum Diisi',
      summary: enn
        ? `${enn.name} (${enn.center} Center · Harmonik ${enn.harmonic} · Hornevian ${enn.hornevian}). Fokus batin berpusat pada ${enn.coreDesire.toLowerCase()}.`
        : 'Tipe Enneagram inti belum diisi.',
      coreMechanisms: enn
        ? [
            `Motivasi inti: ${enn.coreMotivation}`,
            `Ketakutan dasar: ${enn.coreFear} · Mekanisme pertahanan: ${enn.defenseMechanism}`,
          ]
        : [],
      unavailableAspects: enn ? [] : ['Motivasi emosional terdalam dan pola pertahanan stres Enneagram belum tersedia.'],
      provenance: {
        supportingProfileData: enn ? [`enneagramCore: ${enn.number}`, ...(t.enneagramWing ? [`wing: ${t.enneagramWing}`] : [])] : [],
        frameworksInvolved: ['Enneagram'],
        theoreticalExplanation: enn
          ? `Pusat ${enn.center} dan kelompok Hornevian (${enn.hornevian}) menentukan bagaimana individu bergerak mengejar rasa aman atau nilai diri saat berhadapan dengan masalah.`
          : 'Menunggu pengisian Enneagram inti.',
        theoryReferences: ['Riso, D. R., & Hudson, R. (1999). The Wisdom of the Enneagram.', 'Naranjo, C. (1994). Character and Neurosis.'],
        synthesisKind: 'direct-framework',
        epistemicLabel: 'Interpretasi Tipologis Terstruktur',
        limitationsAndAlternatives: ['Dua siswa bertipe Enneagram sama bisa berpenampilan luar berbeda tergantung insting, Psikosofi, dan kebiasaan belajar.'],
      },
    },
    {
      frameworkKey: 'instinct',
      frameworkName: 'Varian & Stacking Insting',
      available: Boolean(instSpec || stackingSpec),
      codeDisplay: t.instinctStacking || t.instinctVariant || 'Belum Diisi',
      summary: stackingSpec
        ? `Stacking ${t.instinctStacking} (prioritas utama ${instMain}, zona buta/terbelakang ${stackingSpec.blind}): ${stackingSpec.everydayTendencies}`
        : instSpec
        ? `Varian dominan ${instSpec.code} (${instSpec.name}): ${instSpec.summary}`
        : 'Varian atau urutan insting belum diisi.',
      coreMechanisms: instSpec ? [instSpec.classroomManifestation, ...(stackingSpec ? [`Area blind (${stackingSpec.blind}) kerap kurang disadari kecuali diingatkan konteks.`] : [])] : [],
      unavailableAspects: instSpec ? [] : ['Arah kecemasan & fokus energi sehari-hari (SP/SO/SX) belum teridentifikasi.'],
      provenance: {
        supportingProfileData: instSpec ? [`instinctVariant: ${t.instinctVariant || instMain}`, ...(t.instinctStacking ? [`instinctStacking: ${t.instinctStacking}`] : [])] : [],
        frameworksInvolved: ['Instinctual Variants'],
        theoreticalExplanation: 'Insting menunjukkan di ranah kehidupan mana dorongan Enneagram paling dulu menyala: kelestarian pribadi (SP), posisi/peran sosial (SO), atau ketertarikan intensitas khusus (SX).',
        theoryReferences: ['Riso & Hudson (1999); Dokumentasi Subtipe Instingtual Enneagram.'],
        synthesisKind: 'direct-framework',
        epistemicLabel: 'Interpretasi Tipologis Terstruktur',
        limitationsAndAlternatives: ['Prioritas insting dapat tampak bergeser sementara ketika menghadapi tekanan ujian atau tuntutan keluarga.'],
      },
    },
    {
      frameworkKey: 'tritype',
      frameworkName: 'Trifix / Tritype (3 Pusat)',
      available: Boolean(t.tritype || t.threeFix),
      codeDisplay: t.tritype || t.threeFix || 'Belum Diisi',
      summary:
        t.tritype || t.threeFix
          ? `Konfigurasi ${t.tritype || t.threeFix} memadukan strategi sekunder dari pusat Jantung (${t.tritypeHeart || '-'}), Pikiran (${t.tritypeHead || '-'}), dan Insting (${t.tritypeGut || '-'}) di bawah naungan tipe inti.`
          : 'Konfigurasi Three Fix / Tritype belum diisi.',
      coreMechanisms:
        t.tritype || t.threeFix
          ? [
              'Tipe inti tetap memegang kendali motivasi utama, sementara dua fix lain mewarnai gaya berpikir serta cara menegakkan batas.',
            ]
          : [],
      unavailableAspects: t.tritype || t.threeFix ? [] : ['Nuansa gaya respon lintas pusat non-inti belum dapat dirinci.'],
      provenance: {
        supportingProfileData: t.tritype || t.threeFix ? [`tritype: ${t.tritype || t.threeFix}`] : [],
        frameworksInvolved: ['Trifix / Tritype'],
        theoreticalExplanation: 'Menjelaskan variasi warna perilaku di luar tipe inti tanpa mengubah fakta bahwa hanya ada satu motivasi inti.',
        theoryReferences: ['Ichazo, O. (Trifix); Fauvre, K. C. (Tritype Theory).'],
        synthesisKind: 'direct-framework',
        epistemicLabel: 'Interpretasi Tipologis Terstruktur',
        limitationsAndAlternatives: ['Tritype adalah kerangka pelengkap; pemahaman tipe inti harus tetap didahulukan.'],
      },
    },
    {
      frameworkKey: 'psychosophy',
      frameworkName: 'Psikosofi (L · V · E · F)',
      available: psy.valid,
      codeDisplay: psy.valid ? psy.code : 'Belum Diisi',
      summary: psy.valid
        ? `Urutan ${psy.code}: percaya diri kuat di ${psy.placements[0].code} (${psy.placements[0].aspectName.split('(')[0].trim()}), dialog sehat di ${psy.placements[1].code}, kepekaan kritis di ${psy.placements[2].code}, dan sikap ringan fleksibel di ${psy.placements[3].code}.`
        : 'Kode 4 posisi Psikosofi belum diisi.',
      coreMechanisms: psy.valid
        ? [
            `Posisi Proses (2 & 3: ${psy.placements[1].code} & ${psy.placements[2].code}) menjadi ruang diskusi sekaligus titik sensitivitas.`,
            `Posisi Result (1 & 4: ${psy.placements[0].code} & ${psy.placements[3].code}) cenderung langsung mengunci sikap atau bersikap santai.`,
          ]
        : [],
      unavailableAspects: psy.valid ? [] : ['Prioritas kehendak, logika, emosi, dan kenyamanan fisik dalam konflik interpersonal belum tersedia.'],
      provenance: {
        supportingProfileData: psy.valid ? [`psychosophyCode: ${psy.code}`] : [],
        frameworksInvolved: ['Psikosofi / Attitudinal Psyche'],
        theoreticalExplanation: 'Psikosofi memetakan perbedaan antara apa yang Anda yakini tanpa ragu (1), apa yang senang Anda bahas bersama (2), apa yang paling rentan tersinggung (3), dan apa yang Anda ikuti dengan santai (4).',
        theoryReferences: ['Afanasiev, A. (1993/2000). Syntax of Love (Psikosofi).'],
        synthesisKind: 'direct-framework',
        epistemicLabel: 'Interpretasi Tipologis Terstruktur',
        limitationsAndAlternatives: ['Tidak boleh disetarakan 1:1 dengan posisi fungsi Socionics atau MBTI.'],
      },
    },
    {
      frameworkKey: 'mbti',
      frameworkName: 'MBTI & Tumpukan Kognitif',
      available: Boolean(mbtiEntry),
      codeDisplay: mbtiEntry
        ? `${mbtiEntry.code}${mbtiResolved.stackText ? ` (${mbtiResolved.stackText})` : ''}`
        : 'Belum Diisi',
      summary: mbtiEntry
        ? `${mbtiEntry.roleTitle}. ${mbtiEntry.overview}`
        : 'Kode 4 huruf MBTI belum dicantumkan.',
      coreMechanisms: mbtiDynamics
        ? [
            `Poros Dominan–Bantu: ${mbtiDynamics.domAuxDynamic}`,
            `Dinamika Inferior: ${mbtiDynamics.domInfDynamic}`,
          ]
        : [],
      unavailableAspects: mbtiEntry ? [] : ['Preferensi dikotomi Myers-Briggs dan pola keseimbangan fungsi Dom–Aux–Ter–Inf belum tersedia.'],
      provenance: {
        supportingProfileData: mbtiEntry
          ? [`mbti: ${mbtiEntry.code}`, ...(mbtiResolved.stackText ? [`stack: ${mbtiResolved.stackText}`] : [])]
          : [],
        frameworksInvolved: ['MBTI', 'Jungian / Grant Stack'],
        theoreticalExplanation: mbtiDynamics
          ? mbtiDynamics.integratedSystemBehavior
          : 'Menunggu pengisian kode MBTI.',
        theoryReferences: ['Jung, C. G. (1921/1971); Myers, I. B., & Myers, P. B. (1995); Grant et al. (1983); Beebe (2016).'],
        synthesisKind: 'direct-framework',
        epistemicLabel: 'Interpretasi Tipologis Terstruktur',
        limitationsAndAlternatives: ['Dikotomi resmi MBTI berbeda cakupan teoretis dari model 8 fungsi Beebe dan tidak identik dengan Socionics Model A.'],
      },
    },
    {
      frameworkKey: 'sloan',
      frameworkName: 'Big Five / SLOAN',
      available: Boolean(sloanSource && sloanParsed?.isValid),
      codeDisplay: sloanSource || 'Belum Diisi',
      summary:
        sloanParsed?.isValid && sloanParsed.rankedTraits.length > 0
          ? `Kecenderungan sifat teramati dipimpin oleh ${sloanParsed.rankedTraits
              .slice(0, 3)
              .map((tk) => `${tk.rawToken} (${tk.detail.name.split('(')[0].trim()})`)
              .join(', ')}.`
          : 'Kode SLOAN standar atau notasi lanjutan belum diisi.',
      coreMechanisms:
        sloanParsed?.isValid
          ? sloanParsed.summaryLines.slice(0, 3)
          : [],
      unavailableAspects: sloanParsed?.isValid ? [] : ['Kecenderungan perilaku Big Five (energi sosial, kestabilan emosi, keteraturan, kompromi, keterbukaan ide) belum tercatat.'],
      provenance: {
        supportingProfileData: sloanParsed?.isValid ? [`sloan: ${sloanSource}`] : [],
        frameworksInvolved: ['Big Five / SLOAN'],
        theoreticalExplanation: 'Memetakan seberapa sering perilaku tertentu muncul di permukaan sebagai spektrum sifat normal, bukan tipe kognitif.',
        theoryReferences: ['Goldberg (1990); Costa & McCrae (1992); John & Srivastava (1999).'],
        synthesisKind: 'direct-framework',
        epistemicLabel: 'Interpretasi Tipologis Terstruktur',
        limitationsAndAlternatives: ['Kode 5 huruf atau [X]/x/ menyederhanakan skor kontinum persentil menjadi kategori ringkas.'],
      },
    },
    {
      frameworkKey: 'temperament',
      frameworkName: 'Temperamen Klasik & Campuran',
      available: Boolean(tempInfo.np),
      codeDisplay: tempInfo.mixed
        ? tempInfo.mixed.indoTitle.split(' (')[0]
        : tempInfo.classical?.indoName || t.temperament || 'Belum Diisi',
      summary: tempInfo.mixed
        ? `${tempInfo.mixed.generalCharacteristics}`
        : tempInfo.classical
        ? `${tempInfo.classical.indoName} (${tempInfo.classical.eysenckMapping}): ${tempInfo.classical.coreTraits.join(', ')}.`
        : 'Data temperamen belum diisi.',
      coreMechanisms: tempInfo.mixed
        ? [tempInfo.mixed.dominantVsSecondary, tempInfo.mixed.interactionDynamics]
        : tempInfo.classical
        ? tempInfo.classical.cognitiveEmotionalTendencies
        : [],
      unavailableAspects: tempInfo.np ? [] : ['Ritme kecepatan respons emosional dan gaya stabilitas energi harian belum tercatat.'],
      provenance: {
        supportingProfileData: tempInfo.np
          ? [`temperament: ${t.temperament}`, ...(t.temperamentSecondary ? [`temperamentSecondary: ${t.temperamentSecondary}`] : [])]
          : [],
        frameworksInvolved: ['Temperament'],
        theoreticalExplanation: 'Temperamen menggambarkan tempo energi, ketahanan terhadap kegaduhan/tekanan, dan cara emosi diekspresikan dalam interaksi harian.',
        theoryReferences: ['Eysenck (1967); Thomas & Chess (1977); Kagan (1994).'],
        synthesisKind: 'direct-framework',
        epistemicLabel: 'Interpretasi Tipologis Terstruktur',
        limitationsAndAlternatives: ['Model empat humor klasik bukan diagnosis medis; makna ilmiah modern berfokus pada reaktivitas & regulasi diri.'],
      },
    },
  ];

  // ==================== HELPERS FOR LAYER A: 13 INTEGRATED TOPICS ====================
  const hasAny = filledFrameworks.length > 0;
  const cogAvailable = Boolean(soc || mbtiEntry || sloan5[4]);
  const motAvailable = Boolean(enn || t.tritype || instSpec);
  const commAvailable = Boolean(soc || mbtiEntry || sloanParsed?.isValid || tempInfo.np || psy.valid);
  const decAvailable = Boolean(soc || mbtiEntry || enn || psy.valid);
  const emoAvailable = Boolean(enn || tempInfo.np || sloan5[1] || psy.valid);
  const behavAvailable = Boolean(sloanParsed?.isValid || tempInfo.np || soc || mbtiEntry);
  const tensionAvailable = filledFrameworks.length >= 2 || Boolean(enn || psy.valid || tempInfo.mixed);
  const learnAvailable = Boolean(
    soc || mbtiEntry || sloan5[2] || sloan5[4] || tempInfo.np || lp.studySetting || lp.explanationStyle
  );

  const infoProcPieces: string[] = [];
  if (soc) {
    infoProcPieces.push(
      `Secara Socionics (${soc.code}), informasi disaring paling tajam melalui ${soc.modelA[0]} (${INFORMATION_ELEMENTS[soc.modelA[0]].indonesianName.split('(')[0].trim()}) dan dipadukan dengan ${soc.modelA[1]} di Blok Ego.`
    );
  }
  if (mbtiEntry && mbtiDynamics) {
    infoProcPieces.push(
      `Dari lensa MBTI (${mbtiEntry.code}: ${mbtiResolved.stackText}), proses ini berjalan lewat ${mbtiDynamics.domAuxDynamic.charAt(0).toLowerCase() + mbtiDynamics.domAuxDynamic.slice(1)}`
    );
  }
  if (sloan5.length === 5) {
    infoProcPieces.push(
      `Keterbukaan sifat Big Five (${sloan5[4] === 'I' ? 'Inquisitive / I' : 'Non-Curious Pragmatic / N'}) mengarahkan perhatian ${
        sloan5[4] === 'I'
          ? 'ke pola abstrak, gagasan lintas bidang, dan eksplorasi konsep baru'
          : 'ke kegunaan nyata, fakta teruji, serta langkah konkret yang langsung dapat dipakai'
      }.`
    );
  }

  const cogTendPieces: string[] = [];
  if (mbtiEntry) {
    cogTendPieces.push(
      `Preferensi ${mbtiEntry.dichotomyBreakdown.SorN === 'N' ? 'Intuition (N)' : 'Sensing (S)'} dan ${mbtiEntry.dichotomyBreakdown.TorF === 'T' ? 'Thinking (T)' : 'Feeling (F)'} membentuk kecenderungan menarik makna sebelum menyimpulkan.`
    );
  }
  if (soc) {
    cogTendPieces.push(
      `Fungsi kritis PoLR (${soc.modelA[3]}) membuat individu lebih waspada bila dipaksa memproses aspek ${INFORMATION_ELEMENTS[soc.modelA[3]].indonesianName.split('(')[0].toLowerCase()} secara mendadak tanpa konteks.`
    );
  }
  if (psy.valid) {
    const lPos = psy.positionMap?.L;
    cogTendPieces.push(
      `Pada Psikosofi (${psy.code}), aspek Logika berada di posisi ${lPos} (${lPos === 1 ? 'teguh dan mandiri merumuskan kesimpulan' : lPos === 2 ? 'senang bertukar argumen secara dialogis' : lPos === 3 ? 'kritis namun peka terhadap keraguan intelektual' : 'praktis menerima argumen yang langsung teruji'}).`
    );
  }

  const motPieces: string[] = [];
  if (enn) {
    motPieces.push(
      `Penggerak motivasi utama berakar pada Tipe ${enn.number}: dorongan untuk ${enn.coreDesire.toLowerCase()} sembari menghindari situasi yang memicu rasa ${enn.coreFear.toLowerCase().replace(/^takut /, '')}.`
    );
  }
  if (instSpec) {
    motPieces.push(
      `Energi instingtual ${t.instinctStacking || instMain} memfokuskan prioritas harian pada ${(instSpec.themes[0] || instSpec.summary).replace(/\.$/, '').toLowerCase()}.`
    );
  }
  if (t.tritype || t.threeFix) {
    motPieces.push(
      `Konfigurasi ${t.tritype || t.threeFix} menambahkan strategi pelengkap dari ketiga pusat kecerdasan (Jantung, Pikiran, Insting) ketika menghadapi tantangan berlapis.`
    );
  }

  const commPieces: string[] = [];
  if (tempInfo.mixed) {
    commPieces.push(`Dalam percakapan sehari-hari (${tempInfo.mixed.indoTitle.split(' (')[0]}), ${tempInfo.mixed.communicationPatterns.charAt(0).toLowerCase() + tempInfo.mixed.communicationPatterns.slice(1)}`);
  } else if (tempInfo.classical) {
    commPieces.push(`Ritme temperamen ${tempInfo.classical.indoName} memengaruhi gaya penyampaian: ${tempInfo.classical.learningCommunicationStyle}`);
  }
  if (sloan5.length === 5) {
    commPieces.push(
      `Spektrum SLOAN menunjukkan orientasi interaksi ${sloan5[0] === 'S' ? 'terbuka ekspresif (S)' : 'selektif reflektif (R)'} dengan nada penyampaian ${sloan5[3] === 'A' ? 'kooperatif menjaga harmoni (A)' : 'lugas berterus terang pada inti (E)'}.`
    );
  }
  if (soc) {
    commPieces.push(`Socionics ${soc.code} memperjelas kecenderungan ${soc.communicationPreferences[0].toLowerCase()}`);
  }

  const decPieces: string[] = [];
  if (mbtiEntry) {
    decPieces.push(
      `Keputusan diwarnai poros ${mbtiEntry.dichotomyBreakdown.TorF === 'T' ? 'kriteria objektivitas & konsistensi sebab-akibat (T)' : 'dampak terhadap manusia & keselarasan nilai (F)'} serta sikap penutupan ${mbtiEntry.dichotomyBreakdown.JorP === 'J' ? 'terjadwal lebih awal (J)' : 'terbuka fleksibel mengumpulkan data baru (P)'}.`
    );
  }
  if (soc) {
    decPieces.push(`Blok Ego ${soc.modelA[0]}/${soc.modelA[1]} menentukan standar bukti apa yang terasa paling meyakinkan.`);
  }
  if (enn) {
    decPieces.push(`Saat bimbang atau terdesak, gaya Harmonik ${enn.harmonic} turut menentukan apakah keputusan diambil dengan menekan emosi demi solusi, mencari dukungan positif, atau memproses intensitas reaksi batin terlebih dahulu.`);
  }
  if (psy.valid && psy.positionMap?.V) {
    const vPos = psy.positionMap.V;
    decPieces.push(`Posisi Kehendak ${vPos}V di Psikosofi memengaruhi ketegasan mengunci pilihan (${vPos === 1 ? 'mantap memutuskan sendiri' : vPos === 2 ? 'bermusyawarah fleksibel tanpa kehilangan arah' : vPos === 3 ? 'hati-hati menimbang risiko otonomi' : 'nyaman mengikuti kesepakatan bila tujuan besar jelas'}).`);
  }

  const emoPieces: string[] = [];
  if (sloan5.length === 5) {
    emoPieces.push(
      `Pada dimensi kestabilan emosi Big Five (${sloan5[1] === 'L' ? 'Limbic / L' : 'Calm / C'}), respons batin terhadap stresor cenderung ${
        sloan5[1] === 'L'
          ? 'cepat menangkap perubahan nada atau tekanan sehingga perlu saluran regulasi yang tenang'
          : 'stabil dan tidak mudah tersulut kepanikan mendadak di situasi ramai'
      }.`
    );
  }
  if (tempInfo.np) {
    emoPieces.push(
      `Temperamen ${tempInfo.classical?.indoName || tempInfo.np}${tempInfo.mixed ? `–${tempInfo.ns}` : ''} ikut mengatur seberapa cepat emosi memuncak atau mereda.`
    );
  }
  if (psy.valid && psy.positionMap?.E) {
    const ePos = psy.positionMap.E;
    emoPieces.push(`Aspek Emosi di posisi ${ePos}E membuat ekspresi rasa tampil ${ePos === 1 ? 'langsung kuat dan autentik' : ePos === 2 ? 'hangat komunikatif menyesuaikan lawan bicara' : ePos === 3 ? 'halus namun mudah terluka oleh nada kasar' : 'tenang dan hemat ekspresi dramatis'}.`);
  }

  const behavPieces: string[] = [];
  if (sloan5.length === 5) {
    behavPieces.push(
      `Pola kerja teramati memadukan keteraturan ${sloan5[2] === 'O' ? 'terstruktur disiplin (O)' : 'fleksibel spontan (U)'} dengan energi ${sloan5[0] === 'S' ? 'kolaboratif aktif (S)' : 'reflektif fokus (R)'}.`
    );
  }
  if (tempInfo.mixed) {
    behavPieces.push(tempInfo.mixed.behavioralExamples[0]);
  } else if (tempInfo.classical) {
    behavPieces.push(tempInfo.classical.exampleScenario);
  }
  if (mbtiEntry) {
    behavPieces.push(mbtiEntry.concreteExample);
  }

  const strengthPieces: string[] = [];
  if (soc) strengthPieces.push(soc.theoreticalStrengths[0]);
  if (enn) strengthPieces.push(enn.potentialStrengths[0]);
  if (tempInfo.mixed) strengthPieces.push(tempInfo.mixed.strengths[0]);
  else if (tempInfo.classical) strengthPieces.push(tempInfo.classical.teamStrengths[0]);
  if (mbtiEntry) strengthPieces.push(mbtiEntry.tendenciesStrengths[0]);

  const tensionPieces: string[] = [];
  if (tempInfo.mixed) tensionPieces.push(`Tarik-ulur temperamen: ${tempInfo.mixed.internalTension}`);
  if (mbtiDynamics) tensionPieces.push(`Dinamika tumpukan MBTI: ${mbtiDynamics.internalTensions}`);
  if (enn) tensionPieces.push(`Ketegangan Enneagram Tipe ${enn.number}: antara dorongan "${enn.coreDesire.toLowerCase()}" dan mekanisme pertahanan "${enn.defenseMechanism.split(':')[0].toLowerCase()}".`);
  if (psy.valid) tensionPieces.push(`Sensitivitas Psikosofi posisi ${psy.placements[2].code} menuntut pengakuan tanpa tekanan merendahkan.`);

  const needPieces: string[] = [];
  if (soc) needPieces.push(`Membutuhkan umpan balik yang menghargai Blok Ego (${soc.modelA[0]}/${soc.modelA[1]}) dan memberi dukungan sabar di Suggestive (${soc.modelA[4]}).`);
  if (instSpec) needPieces.push(`Sebagai insting dominan ${instSpec.code}, keterhubungan terbaik tumbuh saat fokus pada ${(instSpec.themes[0] || instSpec.indonesianName).replace(/\.$/, '').toLowerCase()} ikut dihormati.`);
  if (enn) needPieces.push(`Merasa paling aman bekerja sama ketika lawan bicara tidak memicu ${enn.coreFear.toLowerCase().replace(/^takut /, '')}.`);

  const misPieces: string[] = [];
  if (soc) misPieces.push(INFORMATION_ELEMENTS[soc.modelA[0]].potentialMisunderstanding);
  if (mbtiEntry) misPieces.push(mbtiEntry.commonMisunderstandings[0]);
  if (tempInfo.mixed) misPieces.push(tempInfo.mixed.misconceptions[0]);
  if (sloan5.length === 5 && (sloan5[3] === 'E' || sloan5[0] === 'R')) {
    misPieces.push('Sikap tenang-selektif (R) atau langsung ke inti masalah (E) kerap salah dibaca sebagai sikap dingin, padahal itu sekadar efisiensi komunikasi.');
  }

  const sitPieces: string[] = [];
  if (mbtiDynamics) sitPieces.push(`Di bawah tekanan berkepanjangan: ${mbtiDynamics.stressLoopsAndGrip}`);
  if (enn) sitPieces.push(`Respon khas saat stres (Harmonik ${enn.harmonic} / Hornevian ${enn.hornevian}) dapat memunculkan pola ${enn.defenseMechanism.split(':')[0].toLowerCase()}.`);
  if (tempInfo.classical) sitPieces.push(`Dari sisi temperamen ${tempInfo.classical.indoName}: ${tempInfo.classical.challengesUnderStress[0]}`);

  const learnPieces: string[] = [];
  if (lp.studySetting || lp.explanationStyle || lp.structureStyle) {
    learnPieces.push(
      `Preferensi belajar pribadi mencatat pengaturan ${lp.studySetting || 'fleksibel'}, gaya penjelasan ${lp.explanationStyle || 'campuran'}, serta alur ${lp.structureStyle || 'adaptif'}.`
    );
  }
  if (tempInfo.classical) learnPieces.push(tempInfo.classical.learningCommunicationStyle);
  if (sloan5.length === 5) {
    learnPieces.push(
      `Faktor Big Five menyarankan kombinasi ${sloan5[2] === 'O' ? 'jadwal bertahap terukur (O)' : 'fleksibilitas eksplorasi bertarget singkat (U)'} dan materi ${sloan5[4] === 'I' ? 'konseptual mendalam (I)' : 'aplikasi nyata langsung (N)'}.`
    );
  }
  if (soc) learnPieces.push(`Secara Socionics (${soc.code}), pemahaman paling cepat terbentuk saat materi membuka elemen ${soc.modelA[0]} dan ${soc.modelA[1]} lebih dulu.`);

  const makeStmt = (
    id: string,
    topic: string,
    pieces: string[],
    available: boolean,
    missingReason: string,
    frameworks: string[],
    refs: string[],
    limitations: string[]
  ): InterpretedStatement => ({
    id,
    topic,
    statement: available && pieces.length > 0 ? pieces.join(' ') : missingReason,
    available: available && pieces.length > 0,
    missingReason: available && pieces.length > 0 ? undefined : missingReason,
    provenance: {
      supportingProfileData: filledFrameworks,
      frameworksInvolved: frameworks,
      theoreticalExplanation:
        available && pieces.length > 0
          ? `Disintesis dari irisan aktif antara ${frameworks.join(', ')} pada profil ${profile.displayName} tanpa menebak bagian yang belum terisi.`
          : missingReason,
      theoryReferences: refs,
      synthesisKind: frameworks.length > 1 ? 'cross-synthesis' : 'direct-framework',
      epistemicLabel: 'Interpretasi Tipologis Terstruktur',
      limitationsAndAlternatives: limitations,
    },
  });

  const overviewStatements: InterpretedStatement[] = [
    makeStmt(
      'ov-info-processing',
      'Preferensi Pemrosesan Informasi',
      infoProcPieces,
      cogAvailable && infoProcPieces.length > 0,
      'Belum cukup data Socionics, MBTI, atau SLOAN (kutub I/N) untuk menafsirkan alur pemrosesan informasi.',
      ['Socionics', 'MBTI', 'SLOAN'],
      ['Jung (1921/1971); Myers et al. (1998); Augustinavichiute (1998).'],
      ['Cara memproses informasi dapat berubah sesuai mata pelajaran atau kebiasaan latihan di kelas.']
    ),
    makeStmt(
      'ov-cognitive-tendencies',
      'Kecenderungan Kognitif & Pengujian Argumen',
      cogTendPieces,
      cogTendPieces.length > 0,
      'Diperlukan minimal data MBTI, Socionics, atau Psikosofi (posisi L) untuk memetakan kecenderungan kognitif.',
      ['MBTI', 'Socionics', 'Psikosofi'],
      ['Grant et al. (1983); Afanasiev (1993).'],
      ['Ketajaman berpikir kritis tidak diukur oleh tipe kepribadian, melainkan oleh latihan penalaran.']
    ),
    makeStmt(
      'ov-motivations',
      'Motivasi & Prioritas Batin',
      motPieces,
      motAvailable && motPieces.length > 0,
      'Belum tersedia data Enneagram inti, Insting, atau Tritype untuk membaca motivasi emosional inti.',
      ['Enneagram', 'Instinctual Variants', 'Tritype'],
      ['Riso & Hudson (1999); Naranjo (1994).'],
      ['Prioritas motivasi dapat berubah tergantung kebutuhan fase hidup SMA dan dukungan lingkungan.']
    ),
    makeStmt(
      'ov-communication',
      'Gaya Komunikasi Interpersonal',
      commPieces,
      commAvailable && commPieces.length > 0,
      'Belum tersedia data Temperamen, SLOAN, Socionics, atau Psikosofi untuk menafsirkan gaya komunikasi.',
      ['Temperament', 'SLOAN', 'Socionics'],
      ['Eysenck (1967); Costa & McCrae (1992).'],
      ['Gaya bicara di chat teks sering terdengar lebih singkat atau tegas daripada percakapan tatap muka.']
    ),
    makeStmt(
      'ov-decision-making',
      'Kecenderungan Pengambilan Keputusan',
      decPieces,
      decAvailable && decPieces.length > 0,
      'Tambahkan data MBTI, Socionics, Enneagram, atau Psikosofi untuk melihat pola pengambilan keputusan.',
      ['MBTI', 'Socionics', 'Enneagram', 'Psikosofi'],
      ['Myers & Myers (1995); Riso & Hudson (1999).'],
      ['Keputusan penting tetap dipengaruhi pengalaman belajar dan konsultasi dengan guru/orang tua.']
    ),
    makeStmt(
      'ov-emotional-expression',
      'Ekspresi & Regulasi Emosional',
      emoPieces,
      emoAvailable && emoPieces.length > 0,
      'Tambahkan data SLOAN (sumbu L/C), Temperamen, atau Psikosofi (posisi E) untuk membaca ekspresi emosional.',
      ['SLOAN / Big Five', 'Temperament', 'Psikosofi'],
      ['Goldberg (1990); Kagan (1994); Eysenck (1967).'],
      ['Ekspresi luar yang tenang tidak otomatis berarti ketiadaan pergulatan emosi di dalam batin.']
    ),
    makeStmt(
      'ov-behavioral-patterns',
      'Pola Perilaku Teramati Sehari-hari',
      behavPieces,
      behavAvailable && behavPieces.length > 0,
      'Data perilaku teramati (SLOAN, Temperamen, atau contoh kerangka) belum memadai.',
      ['SLOAN / Big Five', 'Temperament', 'MBTI'],
      ['Costa & McCrae (1992); Thomas & Chess (1977).'],
      ['Perilaku di permukaan selalu dibentuk oleh kebiasaan kelas dan tuntutan proyek, bukan tipe semata.']
    ),
    makeStmt(
      'ov-strengths',
      'Potensi Kekuatan Utama',
      strengthPieces,
      strengthPieces.length > 0,
      'Lengkapi minimal satu kerangka untuk merangkum potensi kekuatan sintesis.',
      ['Sintesis Multi-Kerangka'],
      ['Thomas & Chess (1977); Myers et al. (1998).'],
      ['Setiap kekuatan berpotensi menjadi titik kelelahan apabila dipakai berlebihan tanpa jeda.']
    ),
    makeStmt(
      'ov-internal-tensions',
      'Ketegangan Internal & Sisi Kontras',
      tensionPieces,
      tensionAvailable && tensionPieces.length > 0,
      'Tambahkan minimal dua kerangka atau campuran temperamen untuk melihat interaksi ketegangan internal.',
      ['Temperament', 'MBTI Stack', 'Enneagram', 'Psikosofi'],
      ['Beebe (2016); Riso & Hudson (1999).'],
      ['Ketegangan antar-kecenderungan merupakan kondisi normal yang justru memperkaya kedewasaan refleksi.']
    ),
    makeStmt(
      'ov-interpersonal-needs',
      'Kebutuhan Interpersonal dalam Kerja Sama',
      needPieces,
      needPieces.length > 0,
      'Diperlukan data Socionics, Insting, atau Enneagram untuk merangkum kebutuhan relasional spesifik.',
      ['Socionics', 'Instinctual Variants', 'Enneagram'],
      ['Augustinavichiute (1998); Riso & Hudson (1999).'],
      ['Komunikasikan kebutuhan Anda secara eksplisit karena teman sekelas tidak bisa menebaknya otomatis.']
    ),
    makeStmt(
      'ov-misunderstandings',
      'Potensi Kesalahpahaman oleh Orang Lain',
      misPieces,
      misPieces.length > 0,
      'Diperlukan data Socionics, MBTI, Temperamen, atau SLOAN untuk mengidentifikasi risiko salah tafsir.',
      ['Socionics', 'MBTI', 'Temperament', 'SLOAN'],
      ['Myers et al. (1998); John & Srivastava (1999).'],
      ['Salah paham biasanya bersumber dari perbedaan harapan yang belum diucapkan, bukan niat buruk.']
    ),
    makeStmt(
      'ov-situational-responses',
      'Respons Situasional & Pola Saat Tertekan',
      sitPieces,
      sitPieces.length > 0,
      'Data MBTI, Enneagram, atau Temperamen diperlukan untuk menjelaskan dinamika respons di bawah tekanan.',
      ['MBTI Grip/Loop', 'Enneagram', 'Temperament'],
      ['Jung (1921/1971); Beebe (2016); Eysenck (1967).'],
      ['Kelelahan fisik, kurang tidur, dan tenggat menumpuk sering lebih menentukan reaksi sesaat dibanding tipe apa pun.']
    ),
    makeStmt(
      'ov-learning-preferences',
      'Preferensi Belajar & Kondisi Belajar Optimal',
      learnPieces,
      learnAvailable && learnPieces.length > 0,
      'Isi Preferensi Belajar atau data MBTI/SLOAN/Temperamen untuk mendapatkan panduan strategi belajar personal.',
      ['Preferensi Belajar', 'Temperament', 'SLOAN', 'Socionics'],
      ['Thomas & Chess (1977); Myers et al. (1998).'],
      ['Strategi belajar paling efektif tetap perlu diuji coba langsung pada tiap mata pelajaran berbeda.']
    ),
  ];

  // ==================== LAYER C: COMPOSITE DYNAMICS ====================
  const compositeDynamics: InterpretedStatement[] = [];

  if ((soc || mbtiEntry) && enn) {
    compositeDynamics.push({
      id: 'comp-cog-motivation',
      topic: 'Perpaduan Cara Berpikir × Motivasi Batin',
      statement: `Kerangka kognitif (${soc ? `${soc.code}: ${soc.modelA[0]}/${soc.modelA[1]}` : ''}${soc && mbtiEntry ? ' & ' : ''}${mbtiEntry ? `MBTI ${mbtiEntry.code}` : ''}) berfungsi sebagai "alat baca dan perancang solusi", sementara Enneagram Tipe ${enn.number} menjadi "kompas alasan mengapa isu itu terasa penting". Akibatnya, energi analisis Anda paling kuat menyala saat menyentuh kebutuhan untuk ${enn.coreDesire.toLowerCase()}.`,
      available: true,
      provenance: {
        supportingProfileData: [...(soc ? [`socionics: ${soc.code}`] : []), ...(mbtiEntry ? [`mbti: ${mbtiEntry.code}`] : []), `enneagram: ${enn.number}`],
        frameworksInvolved: ['Socionics / MBTI', 'Enneagram'],
        theoreticalExplanation: 'Memisahkan "bagaimana pikiran memproses informasi" dari "apa tujuan emosional yang mendorong tindakan" mencegah stereotip kaku antar-sistem.',
        theoryReferences: ['Jung (1921/1971); Riso & Hudson (1999).'],
        synthesisKind: 'cross-synthesis',
        epistemicLabel: 'Interpretasi Tipologis Terstruktur',
        limitationsAndAlternatives: ['Dua orang dengan alat kognitif sama dapat mengambil karier sangat berbeda akibat perbedaan motif batin.'],
      },
    });
  }

  if (sloanParsed?.isValid && tempInfo.np) {
    compositeDynamics.push({
      id: 'comp-sloan-temp',
      topic: 'Interaksi Sifat Big Five (SLOAN) × Tempo Temperamen',
      statement: `Sifat perilaku ${sloanSource} bertemu dengan tempo energi ${tempInfo.mixed ? tempInfo.mixed.indoTitle.split(' (')[0] : tempInfo.classical?.indoName}. Hal ini menggambarkan bagaimana tingkat keteraturan, keterbukaan sosial, dan kestabilan emosi Anda terwujud dalam kecepatan bicara, inisiatif diskusi, serta ketahanan terhadap suasana gaduh di kelas.`,
      available: true,
      provenance: {
        supportingProfileData: [`sloan: ${sloanSource}`, `temperament: ${t.temperament}`],
        frameworksInvolved: ['SLOAN / Big Five', 'Temperament'],
        theoreticalExplanation: 'Eysenck (1967) mengaitkan dimensi Ekstraversi dan Neurotisisme dengan kuadran temperamen klasik, yang kemudian diperluas oleh faset keteraturan (O/U), kompromi (A/E), dan keterbukaan ide (I/N) Big Five.',
        theoryReferences: ['Eysenck (1967); Goldberg (1990); Costa & McCrae (1992).'],
        synthesisKind: 'cross-synthesis',
        epistemicLabel: 'Interpretasi Tipologis Terstruktur',
        limitationsAndAlternatives: ['Notasi SLOAN hanya merangkum kecenderungan dominan, bukan skor persentil klinis.'],
      },
    });
  }

  if (psy.valid && (enn || instSpec)) {
    compositeDynamics.push({
      id: 'comp-psy-sensitivity',
      topic: 'Sensitivitas Psikosofi × Pemicu Insting / Enneagram',
      statement: `Posisi rentan Psikosofi ${psy.placements[2].code} (${psy.placements[2].aspectName.split('(')[0].trim()}) bertindak sebagai "radar kepekaan harga diri", yang berinteraksi dengan ${instSpec ? `fokus instingtual ${instSpec.code}` : `ketakutan inti Tipe ${enn?.number}`}. Kritik atau tekanan yang tepat mengenai dua area ini cenderung memicu respon defensif lebih cepat dibanding isu di posisi ringan ${psy.placements[3].code}.`,
      available: true,
      provenance: {
        supportingProfileData: [`psychosophy: ${psy.code}`, ...(instSpec ? [`instinct: ${instSpec.code}`] : []), ...(enn ? [`enneagram: ${enn.number}`] : [])],
        frameworksInvolved: ['Psikosofi', 'Enneagram / Insting'],
        theoreticalExplanation: 'Posisi 3 Psikosofi sensitif terhadap penilaian luar di aspek bersangkutan; ketika bertepatan dengan area kewaspadaan instingtual/Enneagram, perlindungan diri mudah aktif.',
        theoryReferences: ['Afanasiev (1993); Riso & Hudson (1999).'],
        synthesisKind: 'cross-synthesis',
        epistemicLabel: 'Interpretasi Tipologis Terstruktur',
        limitationsAndAlternatives: ['Dalam suasana kelompok suportif, posisi ke-3 justru bisa berkembang menjadi ruang belajar paling bijak.'],
      },
    });
  }

  if (compositeDynamics.length === 0) {
    compositeDynamics.push({
      id: 'comp-insufficient',
      topic: 'Dinamika Sintesis Lintas Kerangka',
      statement: hasAny
        ? `Saat ini baru tersedia ${filledFrameworks.join(', ')}. Lengkapi minimal satu kerangka pelengkap lainnya (misalnya memadukan Socionics/MBTI dengan Enneagram, SLOAN, atau Temperamen) untuk melihat interaksi sintesis lintas lapisan secara utuh.`
        : 'Belum ada kerangka tipologi yang diisi pada profil ini. Lengkapi beberapa data awal di tab Editor Profil untuk mengaktifkan sintesis lintas kerangka.',
      available: false,
      missingReason: 'Memerlukan kombinasi dua atau lebih kerangka berbeda untuk memetakan interaksi sintesis.',
      provenance: {
        supportingProfileData: filledFrameworks,
        frameworksInvolved: filledFrameworks,
        theoreticalExplanation: 'DYNAMAP menolak menciptakan klaim interaksi buatan ketika data kerangka pendukung masih kosong.',
        theoryReferences: ['Prinsip Epistemik & Etika Interpretasi DYNAMAP.'],
        synthesisKind: 'cross-synthesis',
        epistemicLabel: 'Pengetahuan Teoretis Terkurasi',
        limitationsAndAlternatives: ['Anda dapat mengisi kerangka secara bertahap tanpa tekanan harus menyelesaikan semuanya sekaligus.'],
      },
    });
  }

  const interpretableAspects = overviewStatements.filter((s) => s.available).map((s) => s.topic);
  const unavailableAspects = overviewStatements.filter((s) => !s.available).map((s) => s.topic);
  const contradictions = analyzeProfileContradictionsAndComplexity(profile);

  return {
    completenessRatio,
    filledFrameworks,
    missingFrameworks,
    interpretableAspects,
    unavailableAspects,
    overviewStatements,
    frameworkBreakdowns,
    compositeDynamics,
    contradictions,
    overallEpistemicNote:
      completenessRatio === 100
        ? 'Seluruh 8 lapisan kerangka terisi. Gunakan sintesis ini sebagai peta refleksi diri yang hidup—tetap uji kesesuaiannya melalui Pemeriksaan Realitas di bawah tanpa menjadikannya label permanen.'
        : `Interpretasi disusun secara jujur hanya dari ${filledFrameworks.length} dari 8 kerangka yang terisi (${completenessRatio}%). Aspek yang datanya belum diisi dibiarkan terbuka dan tidak ditebak.`,
  };
}
