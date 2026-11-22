import type { AdvancedColorPaletteConfig, CustomGradientSpec } from '../types/dynamap';

export interface RgbaColor {
  r: number; // 0..255
  g: number; // 0..255
  b: number; // 0..255
  a: number; // 0..1
}

export interface HsvColor {
  h: number; // 0..360
  s: number; // 0..100
  v: number; // 0..100
  a: number; // 0..1
}

export interface HslColor {
  h: number; // 0..360
  s: number; // 0..100
  l: number; // 0..100
  a: number; // 0..1
}

export function clamp(val: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, val));
}

export function parseColorToRgba(input: string, fallback = '#2C3C8C'): RgbaColor {
  const str = (input || '').trim();
  // Hex #RGB, #RRGGBB, #RRGGBBAA
  if (str.startsWith('#')) {
    const raw = str.slice(1);
    if (raw.length === 3) {
      const r = parseInt(raw[0] + raw[0], 16);
      const g = parseInt(raw[1] + raw[1], 16);
      const b = parseInt(raw[2] + raw[2], 16);
      if (!Number.isNaN(r) && !Number.isNaN(g) && !Number.isNaN(b)) {
        return { r, g, b, a: 1 };
      }
    } else if (raw.length === 6 || raw.length === 8) {
      const r = parseInt(raw.slice(0, 2), 16);
      const g = parseInt(raw.slice(2, 4), 16);
      const b = parseInt(raw.slice(4, 6), 16);
      const a = raw.length === 8 ? parseInt(raw.slice(6, 8), 16) / 255 : 1;
      if (!Number.isNaN(r) && !Number.isNaN(g) && !Number.isNaN(b) && !Number.isNaN(a)) {
        return { r, g, b, a: clamp(a, 0, 1) };
      }
    }
  }
  const rgbaMatch = str.match(/^rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)(?:\s*,\s*([\d.]+))?\s*\)$/i);
  if (rgbaMatch) {
    return {
      r: clamp(Math.round(Number(rgbaMatch[1])), 0, 255),
      g: clamp(Math.round(Number(rgbaMatch[2])), 0, 255),
      b: clamp(Math.round(Number(rgbaMatch[3])), 0, 255),
      a: rgbaMatch[4] !== undefined ? clamp(Number(rgbaMatch[4]), 0, 1) : 1,
    };
  }
  if (str !== fallback) return parseColorToRgba(fallback, '#2C3C8C');
  return { r: 44, g: 60, b: 140, a: 1 };
}

export function rgbaToHex(c: RgbaColor, includeAlpha = false): string {
  const toHex = (n: number) => clamp(Math.round(n), 0, 255).toString(16).padStart(2, '0').toUpperCase();
  const base = `#${toHex(c.r)}${toHex(c.g)}${toHex(c.b)}`;
  if (includeAlpha && c.a < 0.999) {
    return `${base}${toHex(c.a * 255)}`;
  }
  return base;
}

export function rgbaToCss(c: RgbaColor): string {
  if (c.a >= 0.995) return rgbaToHex(c, false);
  return `rgba(${clamp(Math.round(c.r), 0, 255)}, ${clamp(Math.round(c.g), 0, 255)}, ${clamp(
    Math.round(c.b),
    0,
    255
  )}, ${Number(clamp(c.a, 0, 1).toFixed(2))})`;
}

export function rgbToHsv(c: RgbaColor): HsvColor {
  const r = c.r / 255;
  const g = c.g / 255;
  const b = c.b / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const d = max - min;
  let h = 0;
  if (d !== 0) {
    if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) * 60;
    else if (max === g) h = ((b - r) / d + 2) * 60;
    else h = ((r - g) / d + 4) * 60;
  }
  const s = max === 0 ? 0 : (d / max) * 100;
  const v = max * 100;
  return { h: Math.round(h), s: Math.round(s), v: Math.round(v), a: c.a };
}

export function hsvToRgba(hsv: HsvColor): RgbaColor {
  const h = ((hsv.h % 360) + 360) % 360;
  const s = clamp(hsv.s, 0, 100) / 100;
  const v = clamp(hsv.v, 0, 100) / 100;
  const c = v * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = v - c;
  let rp = 0;
  let gp = 0;
  let bp = 0;
  if (h < 60) {
    rp = c; gp = x;
  } else if (h < 120) {
    rp = x; gp = c;
  } else if (h < 180) {
    gp = c; bp = x;
  } else if (h < 240) {
    gp = x; bp = c;
  } else if (h < 300) {
    rp = x; bp = c;
  } else {
    rp = c; bp = x;
  }
  return {
    r: Math.round((rp + m) * 255),
    g: Math.round((gp + m) * 255),
    b: Math.round((bp + m) * 255),
    a: clamp(hsv.a, 0, 1),
  };
}

export function rgbToHsl(c: RgbaColor): HslColor {
  const r = c.r / 255;
  const g = c.g / 255;
  const b = c.b / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  let h = 0;
  let s = 0;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) * 60;
    else if (max === g) h = ((b - r) / d + 2) * 60;
    else h = ((r - g) / d + 4) * 60;
  }
  return {
    h: Math.round(h),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
    a: c.a,
  };
}

export function hslToRgba(hsl: HslColor): RgbaColor {
  const h = ((hsl.h % 360) + 360) % 360 / 360;
  const s = clamp(hsl.s, 0, 100) / 100;
  const l = clamp(hsl.l, 0, 100) / 100;
  if (s === 0) {
    const val = Math.round(l * 255);
    return { r: val, g: val, b: val, a: hsl.a };
  }
  const hue2rgb = (p: number, q: number, t: number) => {
    let tt = t;
    if (tt < 0) tt += 1;
    if (tt > 1) tt -= 1;
    if (tt < 1 / 6) return p + (q - p) * 6 * tt;
    if (tt < 1 / 2) return q;
    if (tt < 2 / 3) return p + (q - p) * (2 / 3 - tt) * 6;
    return p;
  };
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  return {
    r: Math.round(hue2rgb(p, q, h + 1 / 3) * 255),
    g: Math.round(hue2rgb(p, q, h) * 255),
    b: Math.round(hue2rgb(p, q, h - 1 / 3) * 255),
    a: clamp(hsl.a, 0, 1),
  };
}

export function getRelativeLuminance(color: string): number {
  const { r, g, b } = parseColorToRgba(color);
  const channel = (v: number) => {
    const srgb = v / 255;
    return srgb <= 0.03928 ? srgb / 12.92 : Math.pow((srgb + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

export function getContrastRatio(c1: string, c2: string): number {
  const l1 = getRelativeLuminance(c1);
  const l2 = getRelativeLuminance(c2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return Number(((lighter + 0.05) / (darker + 0.05)).toFixed(2));
}

export function buildCssGradient(spec: CustomGradientSpec | undefined): string | null {
  if (!spec || !spec.enabled || !spec.stops || spec.stops.length === 0) return null;
  const ordered = [...spec.stops].sort((a, b) => a.position - b.position);
  if (ordered.length === 1) return ordered[0].color;
  const stopsStr = ordered.map((s) => `${s.color} ${clamp(s.position, 0, 100)}%`).join(', ');
  return `linear-gradient(${spec.angle ?? 135}deg, ${stopsStr})`;
}

export const DEFAULT_PALETTE_CONFIG: AdvancedColorPaletteConfig = {
  mode: 'basic',
  pageBg: '#EEF1FB',
  pageGradient: {
    enabled: false,
    angle: 165,
    stops: [
      { id: 'st-1', color: '#F5F6FD', position: 0 },
      { id: 'st-2', color: '#EDF0FB', position: 55 },
      { id: 'st-3', color: '#F3F1FB', position: 100 },
    ],
  },
  cardBg: '#FFFFFF',
  accent: '#2C3C8C',
  textPrimary: '#111731',
  borderColor: '#D5DCF2',
  buttonBg: '#151D40',
  decorativeColor: '#DFBE74',
  chartPrimary: '#3A4DA8',
  chartSecondary: '#C9A65B',
  sectionOverrides: {
    sidebarBg: '#101733',
    headerBg: '#F5F6FC',
    heroCardBg: '',
  },
  savedPalettes: [],
  updatedAt: '2026-01-01T00:00:00.000Z',
};

export const CURATED_THEME_PRESETS: {
  id: string;
  label: string;
  config: Partial<AdvancedColorPaletteConfig>;
}[] = [
  {
    id: 'twilight',
    label: 'Senja Periwinkle (Bawaan)',
    config: {
      pageBg: '#EEF1FB',
      cardBg: '#FFFFFF',
      accent: '#2C3C8C',
      textPrimary: '#111731',
      borderColor: '#D5DCF2',
      buttonBg: '#151D40',
      decorativeColor: '#DFBE74',
      chartPrimary: '#3A4DA8',
      chartSecondary: '#C9A65B',
      pageGradient: {
        enabled: false,
        angle: 165,
        stops: [
          { id: 'p1', color: '#F5F6FD', position: 0 },
          { id: 'p2', color: '#EDF0FB', position: 55 },
          { id: 'p3', color: '#F3F1FB', position: 100 },
        ],
      },
      sectionOverrides: { sidebarBg: '#101733', headerBg: '#F5F6FC', heroCardBg: '' },
    },
  },
  {
    id: 'sakura-dawn',
    label: 'Fajar Lavender Lembut',
    config: {
      pageBg: '#F4EFFA',
      cardBg: '#FFFFFF',
      accent: '#6D4BA6',
      textPrimary: '#1D1836',
      borderColor: '#DDD2F0',
      buttonBg: '#462F73',
      decorativeColor: '#D99CB8',
      chartPrimary: '#6D4BA6',
      chartSecondary: '#C77FA0',
      pageGradient: {
        enabled: true,
        angle: 150,
        stops: [
          { id: 's1', color: '#F7F3FC', position: 0 },
          { id: 's2', color: '#F2EBF9', position: 50 },
          { id: 's3', color: '#ECEFF9', position: 100 },
        ],
      },
      sectionOverrides: { sidebarBg: '#241842', headerBg: '#F8F5FD', heroCardBg: '' },
    },
  },
  {
    id: 'celadon-sage',
    label: 'Botani Langit & Sage',
    config: {
      pageBg: '#EFF6F4',
      cardBg: '#FFFFFF',
      accent: '#1E6F64',
      textPrimary: '#102422',
      borderColor: '#CAE1DC',
      buttonBg: '#144D46',
      decorativeColor: '#D4AF63',
      chartPrimary: '#1E6F64',
      chartSecondary: '#3C8DAD',
      pageGradient: {
        enabled: true,
        angle: 160,
        stops: [
          { id: 'c1', color: '#F4FAF8', position: 0 },
          { id: 'c2', color: '#EAF3F1', position: 100 },
        ],
      },
      sectionOverrides: { sidebarBg: '#112A27', headerBg: '#F4F9F7', heroCardBg: '' },
    },
  },
  {
    id: 'archival-cream',
    label: 'Arsip Akademik Hangat',
    config: {
      pageBg: '#F6F2E9',
      cardBg: '#FFFDF8',
      accent: '#8C6226',
      textPrimary: '#241C14',
      borderColor: '#E3D7C3',
      buttonBg: '#2C2217',
      decorativeColor: '#C49A4A',
      chartPrimary: '#8C6226',
      chartSecondary: '#3B5875',
      pageGradient: {
        enabled: false,
        angle: 135,
        stops: [
          { id: 'a1', color: '#FAF7EF', position: 0 },
          { id: 'a2', color: '#EFE9DC', position: 100 },
        ],
      },
      sectionOverrides: { sidebarBg: '#201B16', headerBg: '#FAF6EE', heroCardBg: '' },
    },
  },
];
