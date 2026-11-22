import type {
  Profile,
  TypologyIdCardConfig,
  TypologyIdCardFieldKey,
  TypologyIdCardFont,
  TypologyIdCardTheme,
} from '../types/dynamap';

export interface CardThemePalette {
  id: TypologyIdCardTheme;
  name: string;
  description: string;
  bgStart: string;
  bgMid: string;
  bgEnd: string;
  textPrimary: string;
  textSecondary: string;
  surfaceBg: string;
  surfaceBorder: string;
  defaultAccent: string;
  isDark: boolean;
}

export const ID_CARD_THEMES: Record<TypologyIdCardTheme, CardThemePalette> = {
  minimal: {
    id: 'minimal',
    name: 'Minimal',
    description: 'Putih lunar bersih dengan garis arsitektural halus.',
    bgStart: '#FFFFFF',
    bgMid: '#FAFBFD',
    bgEnd: '#F1F4FB',
    textPrimary: '#111731',
    textSecondary: '#59648C',
    surfaceBg: 'rgba(255, 255, 255, 0.85)',
    surfaceBorder: 'rgba(195, 203, 229, 0.85)',
    defaultAccent: '#2C3C8C',
    isDark: false,
  },
  modern: {
    id: 'modern',
    name: 'Modern Twilight',
    description: 'Nuansa senja periwinkle & cahaya bulan bernuansa lembut.',
    bgStart: '#F3F5FE',
    bgMid: '#E6EBFC',
    bgEnd: '#DCE4FA',
    textPrimary: '#111738',
    textSecondary: '#414B70',
    surfaceBg: 'rgba(255, 255, 255, 0.72)',
    surfaceBorder: 'rgba(112, 134, 222, 0.35)',
    defaultAccent: '#2C3C8C',
    isDark: false,
  },
  futuristic: {
    id: 'futuristic',
    name: 'Futuristic Orbit',
    description: 'Kobalt malam presisi dengan grid orbital bercahaya.',
    bgStart: '#0D1330',
    bgMid: '#15204D',
    bgEnd: '#1E2D6B',
    textPrimary: '#F4F6FD',
    textSecondary: '#B6C3EC',
    surfaceBg: 'rgba(255, 255, 255, 0.08)',
    surfaceBorder: 'rgba(155, 174, 237, 0.32)',
    defaultAccent: '#70C4E8',
    isDark: true,
  },
  academic: {
    id: 'academic',
    name: 'Academic Archival',
    description: 'Kertas arsip gading klasik berpadu tinta biru akademis.',
    bgStart: '#FAF7EF',
    bgMid: '#F4EFE2',
    bgEnd: '#ECE5D5',
    textPrimary: '#19213C',
    textSecondary: '#5D5648',
    surfaceBg: 'rgba(255, 255, 255, 0.65)',
    surfaceBorder: 'rgba(181, 152, 92, 0.42)',
    defaultAccent: '#9E7B34',
    isDark: false,
  },
  dark: {
    id: 'dark',
    name: 'Dark Nocturnal',
    description: 'Biru malam pekat dengan aksen emas sampanye.',
    bgStart: '#0B0F22',
    bgMid: '#111738',
    bgEnd: '#1A2352',
    textPrimary: '#F7F8FD',
    textSecondary: '#C2CCEE',
    surfaceBg: 'rgba(255, 255, 255, 0.06)',
    surfaceBorder: 'rgba(223, 190, 116, 0.32)',
    defaultAccent: '#DFBE74',
    isDark: true,
  },
  pastel: {
    id: 'pastel',
    name: 'Soft / Pastel Dream',
    description: 'Gradasi lavender senja, awan lembut, dan cahaya bintang.',
    bgStart: '#F2EEFD',
    bgMid: '#F8ECF6',
    bgEnd: '#E8F0FD',
    textPrimary: '#1D2242',
    textSecondary: '#5A5C84',
    surfaceBg: 'rgba(255, 255, 255, 0.72)',
    surfaceBorder: 'rgba(182, 162, 224, 0.45)',
    defaultAccent: '#6D5CAE',
    isDark: false,
  },
};

export const ID_CARD_ACCENT_PRESETS = [
  { label: 'Kobalt Senja', value: '#2C3C8C' },
  { label: 'Emas Sampanye', value: '#C9A65B' },
  { label: 'Lavender Bintang', value: '#6D5CAE' },
  { label: 'Sian Orbital', value: '#2B8EAD' },
  { label: 'Mawar Senja', value: '#B55884' },
  { label: 'Zamrud Tenang', value: '#2C8B74' },
];

export interface CardFieldEntry {
  key: TypologyIdCardFieldKey;
  label: string;
  value: string;
}

export interface ExtractedCardData {
  profileId: string;
  displayName: string;
  subtitle: string;
  primaryCode: string;
  primaryLabel: string;
  fields: CardFieldEntry[];
  updatedDateLabel: string;
  academicInterests: string[];
  workFocus: string;
}

export function formatIndoDate(iso: string | undefined): string {
  if (!iso) return 'Terbaru';
  const dt = new Date(iso);
  if (Number.isNaN(dt.getTime())) return iso.slice(0, 10);
  return dt.toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export function extractCardProfileData(
  profile: Profile,
  config: TypologyIdCardConfig
): ExtractedCardData {
  const t = profile.typology;
  const customMap = t.customPrefixes || [];

  const findCustom = (pattern: RegExp) =>
    customMap.find((c) => pattern.test(c.label) && c.value.trim())?.value.trim() || '';

  const hiddenSet = new Set(profile.hiddenFieldsForViewer || []);
  const hideTypology = hiddenSet.has('typology');

  const mbtiVal = hideTypology ? '' : (t.mbti || findCustom(/\bmbti\b/i)).trim();
  const mbtiStackVal = hideTypology ? '' : (t.mbtiCognitiveStack || '').trim();
  const mbtiDisplay = mbtiVal ? (mbtiStackVal ? `${mbtiVal} (${mbtiStackVal})` : mbtiVal) : '';
  const temperamentMain = hideTypology ? '' : (t.temperament || findCustom(/temperamen/i)).trim();
  const temperamentVal = hideTypology
    ? ''
    : [temperamentMain, t.temperamentSecondary?.trim()].filter(Boolean).join('–');
  const sloanVal = hideTypology ? '' : (t.sloanCode || findCustom(/^(sloan|big\s*five)$/i)).trim();
  const sloanExtVal = hideTypology ? '' : (t.sloanExtended || findCustom(/sloan.*(ext|lanjutan|notasi)/i)).trim();

  const extraCustom = hideTypology
    ? ''
    : customMap
        .filter(
          (c) =>
            c.label.trim() &&
            c.value.trim() &&
            !/\bmbti\b|temperamen|sloan|big\s*five/i.test(c.label)
        )
        .map((c) => `${c.label}: ${c.value}`)
        .join(' · ');

  const enneagramDisplay = hideTypology
    ? ''
    : [
        t.enneagramWing || (t.enneagramCore ? `Tipe ${t.enneagramCore}` : ''),
        t.enneagramRaw && t.enneagramRaw !== t.enneagramWing ? t.enneagramRaw : '',
      ]
        .filter(Boolean)
        .join(' · ');

  const instinctDisplay = hideTypology
    ? ''
    : [t.instinctStacking, !t.instinctStacking ? t.instinctVariant : '']
        .filter(Boolean)
        .join('');

  const jungianCombined = hideTypology
    ? ''
    : [t.jungian, !mbtiVal ? '' : !config.visibleFields.includes('mbti') ? mbtiVal : '']
        .filter(Boolean)
        .join(' / ');

  let primaryCode = hideTypology
    ? 'TERBATAS'
    : t.socionics || mbtiVal || t.jungian || enneagramDisplay || t.psychosophyCode || sloanVal || temperamentVal || 'DYNAMAP';
  let primaryLabel = hideTypology
    ? 'Privasi'
    : t.socionics
    ? 'Socionics'
    : mbtiVal
    ? 'MBTI'
    : t.jungian
    ? 'Tipologi Jung'
    : enneagramDisplay
    ? 'Enneagram'
    : t.psychosophyCode
    ? 'Psikosofi'
    : sloanVal
    ? 'SLOAN / Big 5'
    : temperamentVal
    ? 'Temperamen'
    : 'Profil Aktif';

  if (!hideTypology) {
    if (config.primarySpotlight === 'socionics' && t.socionics) {
      primaryCode = t.socionics;
      primaryLabel = t.quadra ? `Socionics · ${t.quadra}` : 'Socionics';
    } else if (config.primarySpotlight === 'mbti' && mbtiVal) {
      primaryCode = mbtiVal;
      primaryLabel = 'MBTI';
    } else if (config.primarySpotlight === 'enneagram' && (t.enneagramWing || t.enneagramCore || t.enneagramRaw)) {
      primaryCode = t.enneagramWing || t.enneagramRaw || `Tipe ${t.enneagramCore}`;
      primaryLabel = 'Enneagram';
    } else if (config.primarySpotlight === 'jungian' && (t.jungian || mbtiVal)) {
      primaryCode = t.jungian || mbtiVal;
      primaryLabel = 'Tipologi Jung';
    } else if (config.primarySpotlight === 'psychosophy' && t.psychosophyCode) {
      primaryCode = t.psychosophyCode;
      primaryLabel = 'Psikosofi (L·V·E·F)';
    } else if (config.primarySpotlight === 'sloan' && (sloanExtVal || sloanVal)) {
      primaryCode = sloanExtVal || sloanVal;
      primaryLabel = 'Big Five / SLOAN';
    } else if (config.primarySpotlight === 'temperament' && temperamentVal) {
      primaryCode = temperamentVal;
      primaryLabel = 'Temperamen';
    }
  }

  const allCandidates: Record<TypologyIdCardFieldKey, CardFieldEntry | null> = hideTypology
    ? {
        socionics: null,
        quadra: null,
        jungian: null,
        mbti: null,
        enneagram: null,
        instincts: null,
        tritype: null,
        psychosophy: null,
        temperament: null,
        sloan: null,
        sloanExtended: null,
        custom: null,
        updatedAt: { key: 'updatedAt', label: 'Pembaruan', value: formatIndoDate(profile.updatedAt) },
      }
    : {
        socionics: t.socionics ? { key: 'socionics', label: 'Socionics', value: t.socionics } : null,
        quadra: t.quadra ? { key: 'quadra', label: 'Quadra', value: t.quadra } : null,
        jungian: jungianCombined ? { key: 'jungian', label: 'Tipologi Jung', value: jungianCombined } : null,
        mbti: mbtiDisplay ? { key: 'mbti', label: 'MBTI', value: mbtiDisplay } : null,
        enneagram: enneagramDisplay ? { key: 'enneagram', label: 'Enneagram', value: enneagramDisplay } : null,
        instincts: instinctDisplay ? { key: 'instincts', label: 'Insting', value: instinctDisplay } : null,
        tritype: t.tritype || t.threeFix ? { key: 'tritype', label: 'Tritype / Fix', value: t.tritype || t.threeFix } : null,
        psychosophy: t.psychosophyCode ? { key: 'psychosophy', label: 'Psikosofi', value: t.psychosophyCode } : null,
        temperament: temperamentVal ? { key: 'temperament', label: 'Temperamen', value: temperamentVal } : null,
        sloan: sloanVal ? { key: 'sloan', label: 'SLOAN', value: sloanVal } : null,
        sloanExtended: sloanExtVal ? { key: 'sloanExtended', label: 'Notasi SLOAN', value: sloanExtVal } : null,
        custom: extraCustom ? { key: 'custom', label: 'Catatan Kerangka', value: extraCustom } : null,
        updatedAt: { key: 'updatedAt', label: 'Pembaruan', value: formatIndoDate(profile.updatedAt) },
      };

  const overrides = config.fieldOverrides || {};

  // Respect exact visibleFields ordering + allow user inline overrides even if base profile field is blank
  const fields: CardFieldEntry[] = config.visibleFields
    .map((key) => {
      const ov = overrides[key];
      const base = allCandidates[key];
      if (!base && !ov?.value?.trim()) return null;
      const defaultEntry = base || { key, label: key.toUpperCase(), value: '-' };
      return {
        key,
        label: ov?.label?.trim() ? ov.label.trim() : defaultEntry.label,
        value: ov?.value?.trim() ? ov.value.trim() : defaultEntry.value,
      };
    })
    .filter((entry): entry is CardFieldEntry => Boolean(entry));

  return {
    profileId: profile.id.toUpperCase(),
    displayName: profile.exposeFullName && profile.fullName ? profile.fullName : profile.displayName,
    subtitle: `${profile.category}${profile.affiliation ? ` · ${profile.affiliation}` : ''}`,
    primaryCode,
    primaryLabel,
    fields,
    updatedDateLabel: formatIndoDate(profile.updatedAt),
    academicInterests: profile.academicInterests || [],
    workFocus: profile.collaborationPreferences || 'Kolaborasi terbuka dan komunikatif',
  };
}

export function getCardFontFamilies(fontStyle: TypologyIdCardFont | undefined): {
  display: string;
  body: string;
  mono: string;
} {
  switch (fontStyle) {
    case 'modern-sans':
      return {
        display: 'Manrope, system-ui, sans-serif',
        body: 'Manrope, system-ui, sans-serif',
        mono: '"JetBrains Mono", monospace',
      };
    case 'classic-serif':
      return {
        display: 'Fraunces, Georgia, serif',
        body: 'Fraunces, Georgia, serif',
        mono: 'Fraunces, Georgia, serif',
      };
    case 'technical-mono':
      return {
        display: '"JetBrains Mono", monospace',
        body: 'Manrope, system-ui, sans-serif',
        mono: '"JetBrains Mono", monospace',
      };
    case 'editorial-mix':
    default:
      return {
        display: 'Fraunces, Georgia, serif',
        body: 'Manrope, system-ui, sans-serif',
        mono: '"JetBrains Mono", monospace',
      };
  }
}

function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function drawFourPointStar(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  outerR: number,
  color: string,
  alpha: number
) {
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.fillStyle = color;
  ctx.beginPath();
  const inner = outerR * 0.28;
  ctx.moveTo(cx, cy - outerR);
  ctx.lineTo(cx + inner, cy - inner);
  ctx.lineTo(cx + outerR, cy);
  ctx.lineTo(cx + inner, cy + inner);
  ctx.lineTo(cx, cy + outerR);
  ctx.lineTo(cx - inner, cy + inner);
  ctx.lineTo(cx - outerR, cy);
  ctx.lineTo(cx - inner, cy - inner);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function drawTextureOverlay(
  ctx: CanvasRenderingContext2D,
  W: number,
  H: number,
  texture: TypologyIdCardConfig['texture'],
  color: string,
  isDark: boolean
) {
  if (!texture || texture === 'none') return;
  ctx.save();
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.globalAlpha = isDark ? 0.14 : 0.1;

  if (texture === 'dots') {
    for (let x = 36; x < W; x += 42) {
      for (let y = 36; y < H; y += 42) {
        ctx.beginPath();
        ctx.arc(x, y, 1.5, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  } else if (texture === 'grid') {
    ctx.lineWidth = 1;
    for (let x = 0; x <= W; x += 64) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, H);
      ctx.stroke();
    }
    for (let y = 0; y <= H; y += 64) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(W, y);
      ctx.stroke();
    }
  } else if (texture === 'linen') {
    ctx.lineWidth = 1;
    ctx.globalAlpha = isDark ? 0.08 : 0.06;
    for (let i = -H; i < W + H; i += 18) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i + H * 0.4, H);
      ctx.stroke();
    }
  } else if (texture === 'constellation') {
    const pts = [
      [180, 200],
      [340, 140],
      [520, 230],
      [760, 110],
      [1080, 210],
      [1350, 150],
      [1420, 390],
      [1260, 740],
      [910, 820],
      [250, 780],
    ];
    ctx.lineWidth = 1;
    ctx.beginPath();
    pts.forEach(([px, py], i) => {
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    });
    ctx.stroke();
    pts.forEach(([px, py]) => {
      ctx.beginPath();
      ctx.arc(px, py, 3.2, 0, Math.PI * 2);
      ctx.fill();
    });
  }
  ctx.restore();
}

function loadSafeImage(url: string): Promise<HTMLImageElement | null> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = url;
  });
}

function drawWrappedText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
  maxLines = 2
): number {
  const words = text.split(/\s+/);
  let line = '';
  let linesDrawn = 0;
  let curY = y;
  for (let i = 0; i < words.length; i++) {
    const testLine = line ? `${line} ${words[i]}` : words[i];
    if (ctx.measureText(testLine).width > maxWidth && line) {
      linesDrawn++;
      if (linesDrawn >= maxLines) {
        ctx.fillText(line.slice(0, Math.max(0, line.length - 1)) + '…', x, curY);
        return curY;
      }
      ctx.fillText(line, x, curY);
      line = words[i];
      curY += lineHeight;
    } else {
      line = testLine;
    }
  }
  if (line) {
    ctx.fillText(line, x, curY);
  }
  return curY;
}

export async function exportTypologyIdCardPng(
  profile: Profile,
  config: TypologyIdCardConfig,
  side: 'front' | 'back' = 'front'
): Promise<void> {
  if (typeof document === 'undefined') return;
  if (document.fonts?.ready) {
    await document.fonts.ready;
  }

  const W = 1600;
  const H = 1000; // Exact 1.6:1 landscape ratio
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Kanvas 2D tidak didukung oleh peramban ini.');

  const palette = ID_CARD_THEMES[config.theme] || ID_CARD_THEMES.modern;
  const accent = config.accentColor || palette.defaultAccent;
  const textPrimary = config.customTextPrimary || palette.textPrimary;
  const borderCol = config.customBorderColor || palette.surfaceBorder;
  const decorCol = config.customDecorativeColor || accent;
  const fonts = getCardFontFamilies(config.fontStyle);
  const scale = config.textScale || 1;
  const padScale = config.cardPaddingScale || 1;
  const extracted = extractCardProfileData(profile, config);

  // Outer card background with rounded mask
  drawRoundedRect(ctx, 0, 0, W, H, 48);
  ctx.clip();

  if (config.customGradient?.enabled && config.customGradient.stops.length >= 2) {
    const angleRad = ((config.customGradient.angle ?? 135) * Math.PI) / 180;
    const x1 = W / 2 - (Math.cos(angleRad) * W) / 2;
    const y1 = H / 2 - (Math.sin(angleRad) * H) / 2;
    const x2 = W / 2 + (Math.cos(angleRad) * W) / 2;
    const y2 = H / 2 + (Math.sin(angleRad) * H) / 2;
    const g = ctx.createLinearGradient(x1, y1, x2, y2);
    const ordered = [...config.customGradient.stops].sort((a, b) => a.position - b.position);
    ordered.forEach((st) => g.addColorStop(Math.min(1, Math.max(0, st.position / 100)), st.color));
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);
  } else if (config.customCardBg) {
    ctx.fillStyle = config.customCardBg;
    ctx.fillRect(0, 0, W, H);
  } else {
    const grad = ctx.createLinearGradient(0, 0, W, H);
    grad.addColorStop(0, palette.bgStart);
    grad.addColorStop(0.55, palette.bgMid);
    grad.addColorStop(1, palette.bgEnd);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);
  }

  // Texture pattern overlay
  drawTextureOverlay(ctx, W, H, config.texture, decorCol, palette.isDark);

  // Ambient glow & dreamy celestial rings when decorations enabled
  if (config.showDecorations !== false) {
    ctx.save();
    const halo = ctx.createRadialGradient(W * 0.84, H * 0.2, 20, W * 0.84, H * 0.2, 520);
    halo.addColorStop(0, decorCol);
    halo.addColorStop(1, 'transparent');
    ctx.globalAlpha = palette.isDark ? 0.24 : 0.14;
    ctx.fillStyle = halo;
    ctx.fillRect(0, 0, W, H);

    const halo2 = ctx.createRadialGradient(W * 0.16, H * 0.85, 10, W * 0.16, H * 0.85, 420);
    halo2.addColorStop(0, palette.isDark ? '#7086DE' : '#DFBE74');
    halo2.addColorStop(1, 'transparent');
    ctx.globalAlpha = palette.isDark ? 0.18 : 0.12;
    ctx.fillStyle = halo2;
    ctx.fillRect(0, 0, W, H);
    ctx.restore();

    ctx.save();
    ctx.strokeStyle = decorCol;
    ctx.globalAlpha = palette.isDark ? 0.26 : 0.2;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(W - 220, 170, 260, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([8, 12]);
    ctx.beginPath();
    ctx.arc(W - 220, 170, 340, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.beginPath();
    ctx.arc(W - 220, 170, 180, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();

    drawFourPointStar(ctx, 1340, 130, 16, decorCol, 0.55);
    drawFourPointStar(ctx, 1465, 250, 11, palette.textSecondary, 0.4);
    drawFourPointStar(ctx, 1210, 270, 9, decorCol, 0.45);
    drawFourPointStar(ctx, 138, 845, 12, decorCol, 0.35);
  }

  // Border framing
  if (config.borderStyle !== 'none') {
    ctx.save();
    ctx.strokeStyle = borderCol;
    ctx.lineWidth = config.borderStyle === 'glow' ? 3 : 2;
    drawRoundedRect(ctx, 28, 28, W - 56, H - 56, 36);
    ctx.stroke();
    if (config.borderStyle === 'double') {
      ctx.globalAlpha = 0.55;
      ctx.lineWidth = 1.5;
      drawRoundedRect(ctx, 40, 40, W - 80, H - 80, 28);
      ctx.stroke();
    }
    ctx.restore();
  }

  const padX = Math.round(88 * padScale);

  if (side === 'back') {
    // BACK SIDE LAYOUT EXPORT
    const topY = 90;
    ctx.fillStyle = textPrimary;
    ctx.font = `700 ${Math.round(32 * scale)}px ${fonts.display}`;
    ctx.fillText('DYNAMAP · CATATAN IDENTITAS BELAJAR', padX, topY + 24);

    ctx.fillStyle = palette.textSecondary;
    ctx.font = `500 ${Math.round(18 * scale)}px ${fonts.body}`;
    ctx.fillText(extracted.displayName + (config.showProfileId ? ` · ID ${extracted.profileId}` : ''), padX, topY + 56);

    ctx.save();
    ctx.strokeStyle = borderCol;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(padX, 178);
    ctx.lineTo(W - padX, 178);
    ctx.stroke();
    ctx.restore();

    // Summary Box
    ctx.save();
    drawRoundedRect(ctx, padX, 224, W - padX * 2, 260, 24);
    ctx.fillStyle = palette.surfaceBg;
    ctx.fill();
    ctx.strokeStyle = borderCol;
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.restore();

    ctx.fillStyle = accent;
    ctx.font = `700 ${Math.round(18 * scale)}px ${fonts.body}`;
    ctx.fillText((config.backSummaryTitle || 'RINGKASAN EKSPLORASI PRIBADI').toUpperCase(), padX + 36, 278);

    ctx.fillStyle = textPrimary;
    ctx.font = `500 ${Math.round(25 * scale)}px ${fonts.body}`;
    const summaryText =
      config.backSummaryNotes?.trim() ||
      profile.bio?.trim() ||
      'Kerangka kepribadian adalah peta awal untuk memperkaya dialog interpersonal dan pilihan belajar mandiri.';
    drawWrappedText(ctx, summaryText, padX + 36, 332, W - padX * 2 - 72, 36, 3);

    // Lower 2 Columns on Back Card
    const colW = (W - padX * 2 - 32) / 2;
    const boxY = 524;
    const boxH = 310;

    // Left Box: Academic Interests
    ctx.save();
    drawRoundedRect(ctx, padX, boxY, colW, boxH, 22);
    ctx.fillStyle = palette.surfaceBg;
    ctx.fill();
    ctx.strokeStyle = borderCol;
    ctx.stroke();
    ctx.restore();

    ctx.fillStyle = palette.textSecondary;
    ctx.font = `700 17px ${fonts.body}`;
    ctx.fillText('MINAT AKADEMIK & TOPIK', padX + 28, boxY + 46);
    ctx.fillStyle = textPrimary;
    ctx.font = `600 ${Math.round(24 * scale)}px ${fonts.body}`;
    const intText =
      config.showAcademicInterestsOnBack !== false && extracted.academicInterests.length > 0
        ? extracted.academicInterests.join(' · ')
        : 'Terbuka mengeksplorasi beragam bidang lintas disiplin.';
    drawWrappedText(ctx, intText, padX + 28, boxY + 98, colW - 56, 36, 4);

    // Right Box: Work Focus & Stack Summary
    ctx.save();
    drawRoundedRect(ctx, padX + colW + 32, boxY, colW, boxH, 22);
    ctx.fillStyle = palette.surfaceBg;
    ctx.fill();
    ctx.strokeStyle = borderCol;
    ctx.stroke();
    ctx.restore();

    ctx.fillStyle = palette.textSecondary;
    ctx.font = `700 17px ${fonts.body}`;
    ctx.fillText('GAYA KOLABORASI & NILAI', padX + colW + 60, boxY + 46);
    ctx.fillStyle = textPrimary;
    ctx.font = `600 ${Math.round(24 * scale)}px ${fonts.body}`;
    const workText =
      config.showValuesOnBack !== false
        ? extracted.workFocus
        : `Sorotan Kerangka: ${extracted.primaryLabel} (${extracted.primaryCode})`;
    drawWrappedText(ctx, workText, padX + colW + 60, boxY + 98, colW - 56, 36, 4);
  } else {
    // FRONT SIDE LAYOUT EXPORT
    const topY = 82;

    // Crescent emblem
    ctx.save();
    ctx.strokeStyle = accent;
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.arc(padX + 24, topY + 24, 24, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = accent;
    ctx.globalAlpha = 0.22;
    ctx.fill();
    ctx.globalAlpha = 1;
    ctx.beginPath();
    ctx.arc(padX + 24, topY + 24, 12, 0.4, Math.PI * 1.85);
    ctx.stroke();
    ctx.restore();

    ctx.fillStyle = textPrimary;
    ctx.font = `700 ${Math.round(32 * scale)}px ${fonts.display}`;
    ctx.fillText('DYNAMAP', padX + 66, topY + 24);
    ctx.fillStyle = palette.textSecondary;
    ctx.font = `500 ${Math.round(18 * scale)}px ${fonts.body}`;
    ctx.fillText('KARTU IDENTITAS TIPOLOGI', padX + 66, topY + 50);

    if (config.showProfileId) {
      ctx.fillStyle = palette.textSecondary;
      ctx.textAlign = 'right';
      ctx.font = `600 22px ${fonts.mono}`;
      ctx.fillText(`ID · ${extracted.profileId}`, W - padX, topY + 34);
      ctx.textAlign = 'left';
    }

    // Divider line under header
    ctx.save();
    ctx.strokeStyle = borderCol;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(padX, 168);
    ctx.lineTo(W - padX, 168);
    ctx.stroke();
    ctx.restore();

    // Identity block (Avatar + Name + Spotlight Typology)
    let textStartX = padX;
    const identityY = 218;
    const avatarSource = config.customImageUrl || profile.photoUrl || '';

    if (config.showAvatar) {
      const avatarSize = 152;
      const avatarCx = padX + avatarSize / 2;
      const avatarCy = identityY + avatarSize / 2;
      const img = avatarSource ? await loadSafeImage(avatarSource) : null;

      ctx.save();
      ctx.beginPath();
      ctx.arc(avatarCx, avatarCy, avatarSize / 2, 0, Math.PI * 2);
      ctx.closePath();
      ctx.clip();

      if (img) {
        const zoom = Math.max(1, config.avatarZoom || 1);
        const posX = ((config.avatarPositionX ?? 50) - 50) / 100;
        const posY = ((config.avatarPositionY ?? 50) - 50) / 100;
        const baseScale = Math.max(avatarSize / img.width, avatarSize / img.height) * zoom;
        const dw = img.width * baseScale;
        const dh = img.height * baseScale;
        ctx.drawImage(
          img,
          avatarCx - dw / 2 - posX * (dw - avatarSize),
          avatarCy - dh / 2 - posY * (dh - avatarSize),
          dw,
          dh
        );
      } else {
        ctx.fillStyle = palette.surfaceBg;
        ctx.fillRect(padX, identityY, avatarSize, avatarSize);
        const initials = extracted.displayName
          .split(/\s+/)
          .slice(0, 2)
          .map((w) => w[0]?.toUpperCase() || '')
          .join('');
        ctx.fillStyle = accent;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.font = `700 54px ${fonts.display}`;
        ctx.fillText(initials || '?', avatarCx, avatarCy + 2);
        ctx.textAlign = 'left';
        ctx.textBaseline = 'alphabetic';
      }
      ctx.restore();

      ctx.save();
      ctx.strokeStyle = accent;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(avatarCx, avatarCy, avatarSize / 2 + 4, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();

      textStartX = padX + avatarSize + 36;
    }

    // Name & Affiliation
    const spotW = 340;
    const spotH = 152;
    const spotX = W - padX - spotW;
    const spotY = identityY;
    const nameMaxWidth = spotX - textStartX - 32;
    const align = config.textAlign || 'left';
    const nameAnchorX =
      align === 'center'
        ? textStartX + nameMaxWidth / 2
        : align === 'right'
        ? textStartX + nameMaxWidth
        : textStartX;

    ctx.textAlign = align;
    ctx.fillStyle = textPrimary;
    ctx.font = `700 ${Math.round(44 * scale)}px ${fonts.display}`;
    drawWrappedText(ctx, extracted.displayName, nameAnchorX, identityY + 48, nameMaxWidth, 50, 2);

    ctx.fillStyle = palette.textSecondary;
    ctx.font = `500 ${Math.round(21 * scale)}px ${fonts.body}`;
    ctx.fillText(extracted.subtitle, nameAnchorX, identityY + 114);

    if (config.tagline.trim()) {
      ctx.fillStyle = textPrimary;
      ctx.font = `italic 500 ${Math.round(20 * scale)}px ${fonts.display}`;
      drawWrappedText(ctx, `“${config.tagline.trim()}”`, nameAnchorX, identityY + 150, nameMaxWidth, 28, 1);
    }
    ctx.textAlign = 'left';

    // Primary Typology Spotlight Box
    ctx.save();
    drawRoundedRect(ctx, spotX, spotY, spotW, spotH, 24);
    ctx.fillStyle = palette.surfaceBg;
    ctx.fill();
    ctx.strokeStyle = accent;
    ctx.lineWidth = 2.5;
    ctx.stroke();
    ctx.restore();

    ctx.fillStyle = accent;
    ctx.font = `700 ${Math.round(17 * scale)}px ${fonts.body}`;
    ctx.fillText(extracted.primaryLabel.toUpperCase(), spotX + 26, spotY + 44);

    ctx.fillStyle = textPrimary;
    const codeLen = extracted.primaryCode.length;
    const spotFontSize = codeLen > 9 ? 34 : codeLen > 6 ? 42 : 52;
    ctx.font = `700 ${Math.round(spotFontSize * scale)}px ${fonts.mono}`;
    ctx.fillText(extracted.primaryCode.slice(0, 15), spotX + 26, spotY + 110);

    // Fields Matrix
    const matrixTop = 434;
    const matrixBottom = 868;
    const fieldsToShow = extracted.fields.slice(0, 8);
    const cols = config.layout === 'crest' ? 2 : 4;
    const gapX = 24;
    const gapY = 22;
    const gridW = W - padX * 2;
    const cellW = (gridW - gapX * (cols - 1)) / cols;
    const rows = Math.max(1, Math.ceil(fieldsToShow.length / cols));
    const cellH = Math.min(184, (matrixBottom - matrixTop - gapY * (rows - 1)) / Math.max(2, rows));

    fieldsToShow.forEach((field, idx) => {
      const col = idx % cols;
      const row = Math.floor(idx / cols);
      const cx = padX + col * (cellW + gapX);
      const cy = matrixTop + row * (cellH + gapY);

      ctx.save();
      drawRoundedRect(ctx, cx, cy, cellW, cellH, 20);
      ctx.fillStyle = palette.surfaceBg;
      ctx.fill();
      ctx.strokeStyle = borderCol;
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.restore();

      ctx.textAlign = align;
      const cellTextX =
        align === 'center' ? cx + cellW / 2 : align === 'right' ? cx + cellW - 22 : cx + 22;

      ctx.fillStyle = palette.textSecondary;
      ctx.font = `600 ${Math.round(16 * scale)}px ${fonts.body}`;
      ctx.fillText(field.label.toUpperCase(), cellTextX, cy + 40);

      ctx.fillStyle = textPrimary;
      ctx.font = `700 ${Math.round(25 * scale)}px ${fonts.mono}`;
      drawWrappedText(ctx, field.value, cellTextX, cy + 88, cellW - 44, 32, 2);
      ctx.textAlign = 'left';
    });
  }

  // Footer Bar (shared front/back)
  ctx.save();
  ctx.strokeStyle = borderCol;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(padX, 898);
  ctx.lineTo(W - padX, 898);
  ctx.stroke();
  ctx.restore();

  ctx.fillStyle = palette.textSecondary;
  ctx.font = `500 18px ${fonts.body}`;
  ctx.fillText('DYNAMAP · Understanding Differences, Mapping Connections', padX, 940);

  ctx.textAlign = 'right';
  ctx.font = `500 18px ${fonts.mono}`;
  ctx.fillText(
    `${side === 'back' ? 'SISI BELAKANG · ' : ''}Diperbarui ${extracted.updatedDateLabel}`,
    W - padX,
    940
  );
  ctx.textAlign = 'left';

  // Trigger download
  await new Promise<void>((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error('Gagal membuat file gambar PNG.'));
        return;
      }
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      const safeName = extracted.displayName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
      link.download = `dynamap-id-${safeName || 'profil'}-${side}.png`;
      link.href = url;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      resolve();
    }, 'image/png');
  });
}
