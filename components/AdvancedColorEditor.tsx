import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  BookmarkPlus,
  Check,
  Palette,
  Plus,
  RotateCcw,
  SlidersHorizontal,
  Trash2,
  X,
} from 'lucide-react';
import {
  CURATED_THEME_PRESETS,
  DEFAULT_PALETTE_CONFIG,
  buildCssGradient,
  clamp,
  getContrastRatio,
  hslToRgba,
  hsvToRgba,
  parseColorToRgba,
  rgbToHsl,
  rgbToHsv,
  rgbaToCss,
  rgbaToHex,
} from '../lib/colorUtils';
import type {
  AdvancedColorPaletteConfig,
  ColorGradientStop,
  CustomGradientSpec,
  SavedCustomColorPalette,
} from '../types/dynamap';

// ============================================================================
// CORE INTERACTIVE HSV / HEX / RGB / HSL / OPACITY COLOR PICKER
// ============================================================================

interface InteractiveColorPickerProps {
  value: string;
  onChange: (nextColor: string) => void;
  label?: string;
  allowOpacity?: boolean;
  compact?: boolean;
  quickSwatches?: string[];
}

const DEFAULT_SWATCHES = [
  '#2C3C8C',
  '#151D40',
  '#C9A65B',
  '#6D5CAE',
  '#2B8EAD',
  '#1E6F64',
  '#B55884',
  '#FFFFFF',
  '#EEF1FB',
  '#111731',
];

export const InteractiveColorPicker: React.FC<InteractiveColorPickerProps> = ({
  value,
  onChange,
  label,
  allowOpacity = true,
  compact = false,
  quickSwatches = DEFAULT_SWATCHES,
}) => {
  const rgba = useMemo(() => parseColorToRgba(value), [value]);
  const hsv = useMemo(() => rgbToHsv(rgba), [rgba]);
  const hsl = useMemo(() => rgbToHsl(rgba), [rgba]);
  const hexDisplay = useMemo(() => rgbaToHex(rgba, false), [rgba]);

  const [hexDraft, setHexDraft] = useState(hexDisplay);
  const [detailedInputs, setDetailedInputs] = useState(!compact);
  const svPlaneRef = useRef<HTMLDivElement | null>(null);
  const isDraggingRef = useRef(false);

  useEffect(() => {
    setHexDraft(hexDisplay);
  }, [hexDisplay]);

  const emitHsv = useCallback(
    (nextH: number, nextS: number, nextV: number, nextA: number) => {
      const nextRgb = hsvToRgba({ h: nextH, s: nextS, v: nextV, a: nextA });
      onChange(rgbaToCss(nextRgb));
    },
    [onChange]
  );

  const updateSvFromPointer = useCallback(
    (clientX: number, clientY: number) => {
      const el = svPlaneRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const s = clamp(((clientX - rect.left) / Math.max(1, rect.width)) * 100, 0, 100);
      const v = clamp((1 - (clientY - rect.top) / Math.max(1, rect.height)) * 100, 0, 100);
      emitHsv(hsv.h, Math.round(s), Math.round(v), rgba.a);
    },
    [emitHsv, hsv.h, rgba.a]
  );

  useEffect(() => {
    const handleMove = (e: PointerEvent) => {
      if (!isDraggingRef.current) return;
      updateSvFromPointer(e.clientX, e.clientY);
    };
    const handleUp = () => {
      isDraggingRef.current = false;
    };
    window.addEventListener('pointermove', handleMove);
    window.addEventListener('pointerup', handleUp);
    return () => {
      window.removeEventListener('pointermove', handleMove);
      window.removeEventListener('pointerup', handleUp);
    };
  }, [updateSvFromPointer]);

  function handleHexBlurOrEnter(raw: string) {
    const cleaned = raw.trim().startsWith('#') ? raw.trim() : `#${raw.trim()}`;
    if (/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6}|[0-9A-Fa-f]{8})$/.test(cleaned)) {
      const parsed = parseColorToRgba(cleaned);
      onChange(rgbaToCss({ ...parsed, a: allowOpacity ? (cleaned.length === 9 ? parsed.a : rgba.a) : 1 }));
    } else {
      setHexDraft(hexDisplay);
    }
  }

  return (
    <div className="space-y-3">
      {label && (
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs font-semibold text-slate-800">{label}</span>
          <div className="flex items-center gap-2">
            <span
              className="w-5 h-5 rounded-md border border-slate-300 shadow-2xs"
              style={{ backgroundColor: value }}
              aria-hidden="true"
            />
            <span className="font-mono text-[11px] text-slate-600 tabular-nums">{value}</span>
          </div>
        </div>
      )}

      {/* 2D Saturation & Value / Brightness Plane */}
      <div
        ref={svPlaneRef}
        role="slider"
        tabIndex={0}
        aria-label={label ? `Spektrum saturasi dan kecerahan untuk ${label}` : 'Spektrum warna'}
        aria-valuetext={`Saturasi ${hsv.s}%, Kecerahan ${hsv.v}%`}
        onPointerDown={(e) => {
          isDraggingRef.current = true;
          updateSvFromPointer(e.clientX, e.clientY);
        }}
        onKeyDown={(e) => {
          if (e.key === 'ArrowRight') emitHsv(hsv.h, clamp(hsv.s + 4, 0, 100), hsv.v, rgba.a);
          if (e.key === 'ArrowLeft') emitHsv(hsv.h, clamp(hsv.s - 4, 0, 100), hsv.v, rgba.a);
          if (e.key === 'ArrowUp') emitHsv(hsv.h, hsv.s, clamp(hsv.v + 4, 0, 100), rgba.a);
          if (e.key === 'ArrowDown') emitHsv(hsv.h, hsv.s, clamp(hsv.v - 4, 0, 100), rgba.a);
        }}
        className={`relative w-full ${
          compact ? 'h-28' : 'h-36'
        } rounded-xl overflow-hidden cursor-crosshair border border-slate-200 select-none touch-none`}
        style={{ backgroundColor: `hsl(${hsv.h}, 100%, 50%)` }}
      >
        <div
          className="absolute inset-0"
          style={{ backgroundImage: 'linear-gradient(to right, #ffffff, rgba(255,255,255,0))' }}
        />
        <div
          className="absolute inset-0"
          style={{ backgroundImage: 'linear-gradient(to top, #000000, rgba(0,0,0,0))' }}
        />
        <div
          className="absolute w-4 h-4 -ml-2 -mt-2 rounded-full border-2 border-white shadow-[0_0_0_1px_rgba(0,0,0,0.45)] pointer-events-none"
          style={{
            left: `${hsv.s}%`,
            top: `${100 - hsv.v}%`,
            backgroundColor: hexDisplay,
          }}
        />
      </div>

      {/* Hue Slider */}
      <div className="space-y-1">
        <div className="flex items-center justify-between text-[11px] text-slate-600">
          <span>Rona (Hue)</span>
          <span className="font-mono tabular-nums">{hsv.h}°</span>
        </div>
        <input
          type="range"
          min={0}
          max={360}
          value={hsv.h}
          aria-label="Rona Warna"
          onChange={(e) => emitHsv(Number(e.target.value), hsv.s, hsv.v, rgba.a)}
          className="w-full h-2.5 rounded-full appearance-none cursor-pointer border border-slate-200"
          style={{
            backgroundImage:
              'linear-gradient(to right, #ff0000 0%, #ffff00 17%, #00ff00 33%, #00ffff 50%, #0000ff 67%, #ff00ff 83%, #ff0000 100%)',
          }}
        />
      </div>

      {/* Brightness & Opacity Sliders */}
      <div className={`grid ${allowOpacity ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1'} gap-2.5`}>
        <div className="space-y-1">
          <div className="flex items-center justify-between text-[11px] text-slate-600">
            <span>Kecerahan</span>
            <span className="font-mono tabular-nums">{hsv.v}%</span>
          </div>
          <input
            type="range"
            min={0}
            max={100}
            value={hsv.v}
            aria-label="Kecerahan Warna"
            onChange={(e) => emitHsv(hsv.h, hsv.s, Number(e.target.value), rgba.a)}
            className="w-full accent-indigo-700 cursor-pointer"
          />
        </div>

        {allowOpacity && (
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[11px] text-slate-600">
              <span>Opasitas (Alpha)</span>
              <span className="font-mono tabular-nums">{Math.round(rgba.a * 100)}%</span>
            </div>
            <input
              type="range"
              min={5}
              max={100}
              value={Math.round(rgba.a * 100)}
              aria-label="Opasitas Warna"
              onChange={(e) => emitHsv(hsv.h, hsv.s, hsv.v, Number(e.target.value) / 100)}
              className="w-full accent-indigo-700 cursor-pointer"
            />
          </div>
        )}
      </div>

      {/* HEX + Detailed RGB/HSL toggle */}
      <div className="flex items-center gap-2">
        <div className="flex-1 flex items-center gap-1.5 border border-slate-300 rounded-lg bg-white px-2.5 py-1.5">
          <span className="text-[11px] font-mono text-slate-400">HEX</span>
          <input
            type="text"
            value={hexDraft}
            aria-label="Kode HEX Warna"
            onChange={(e) => setHexDraft(e.target.value)}
            onBlur={() => handleHexBlurOrEnter(hexDraft)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleHexBlurOrEnter(hexDraft);
            }}
            className="w-full font-mono text-xs text-slate-900 bg-transparent focus:outline-none uppercase"
          />
        </div>

        <button
          type="button"
          onClick={() => setDetailedInputs((p) => !p)}
          className="px-2.5 py-1.5 text-[11px] font-medium border border-slate-300 rounded-lg bg-white text-slate-700 hover:bg-slate-50 whitespace-nowrap"
        >
          {detailedInputs ? 'Tutup RGB/HSL' : 'RGB / HSL'}
        </button>
      </div>

      {detailedInputs && (
        <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
          <div className="p-2 rounded-lg bg-slate-50 border border-slate-200 space-y-1.5">
            <div className="font-mono font-semibold text-slate-500">RGB</div>
            <div className="grid grid-cols-3 gap-1">
              {(['r', 'g', 'b'] as const).map((ch) => (
                <label key={ch} className="block">
                  <span className="sr-only">{ch.toUpperCase()}</span>
                  <input
                    type="number"
                    min={0}
                    max={255}
                    value={rgba[ch]}
                    onChange={(e) => {
                      const next = { ...rgba, [ch]: clamp(Number(e.target.value) || 0, 0, 255) };
                      onChange(rgbaToCss(next));
                    }}
                    className="w-full px-1.5 py-1 border border-slate-300 rounded bg-white font-mono text-[11px] tabular-nums"
                  />
                </label>
              ))}
            </div>
          </div>

          <div className="p-2 rounded-lg bg-slate-50 border border-slate-200 space-y-1.5">
            <div className="font-mono font-semibold text-slate-500">HSL (° / % / %)</div>
            <div className="grid grid-cols-3 gap-1">
              <input
                type="number"
                min={0}
                max={360}
                value={hsl.h}
                aria-label="HSL Hue"
                onChange={(e) =>
                  onChange(rgbaToCss(hslToRgba({ ...hsl, h: clamp(Number(e.target.value) || 0, 0, 360) })))
                }
                className="w-full px-1.5 py-1 border border-slate-300 rounded bg-white font-mono text-[11px] tabular-nums"
              />
              <input
                type="number"
                min={0}
                max={100}
                value={hsl.s}
                aria-label="HSL Saturation"
                onChange={(e) =>
                  onChange(rgbaToCss(hslToRgba({ ...hsl, s: clamp(Number(e.target.value) || 0, 0, 100) })))
                }
                className="w-full px-1.5 py-1 border border-slate-300 rounded bg-white font-mono text-[11px] tabular-nums"
              />
              <input
                type="number"
                min={0}
                max={100}
                value={hsl.l}
                aria-label="HSL Lightness"
                onChange={(e) =>
                  onChange(rgbaToCss(hslToRgba({ ...hsl, l: clamp(Number(e.target.value) || 0, 0, 100) })))
                }
                className="w-full px-1.5 py-1 border border-slate-300 rounded bg-white font-mono text-[11px] tabular-nums"
              />
            </div>
          </div>
        </div>
      )}

      {/* Quick Swatches */}
      <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
        {quickSwatches.map((sw) => {
          const active = hexDisplay.toUpperCase() === sw.toUpperCase();
          return (
            <button
              key={sw}
              type="button"
              aria-label={`Pilih warna cepat ${sw}`}
              onClick={() => onChange(sw)}
              className={`w-6 h-6 rounded-md border flex items-center justify-center transition-transform ${
                active ? 'scale-110 border-slate-900 ring-1 ring-slate-900' : 'border-slate-300'
              }`}
              style={{ backgroundColor: sw }}
            >
              {active && <Check className="w-3 h-3 text-white drop-shadow" />}
            </button>
          );
        })}
      </div>
    </div>
  );
};

// ============================================================================
// MULTI-STOP GRADIENT EDITOR
// ============================================================================

interface MultiStopGradientEditorProps {
  gradient: CustomGradientSpec;
  onChange: (next: CustomGradientSpec) => void;
  title?: string;
}

export const MultiStopGradientEditor: React.FC<MultiStopGradientEditorProps> = ({
  gradient,
  onChange,
  title = 'Editor Gradien Multi-Titik',
}) => {
  const [selectedStopId, setSelectedStopId] = useState<string>(gradient.stops[0]?.id || '');

  const activeStop =
    gradient.stops.find((s) => s.id === selectedStopId) || gradient.stops[0] || null;
  const cssGradient = buildCssGradient({ ...gradient, enabled: true });

  function addStop() {
    if (gradient.stops.length >= 6) return;
    const newStop: ColorGradientStop = {
      id: `stop-${Date.now()}`,
      color: '#9BAFED',
      position: 50,
    };
    const nextStops = [...gradient.stops, newStop];
    setSelectedStopId(newStop.id);
    onChange({ ...gradient, enabled: true, stops: nextStops });
  }

  function removeStop(id: string) {
    if (gradient.stops.length <= 2) return;
    const nextStops = gradient.stops.filter((s) => s.id !== id);
    if (selectedStopId === id && nextStops[0]) setSelectedStopId(nextStops[0].id);
    onChange({ ...gradient, stops: nextStops });
  }

  return (
    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-semibold text-slate-900">{title}</span>
        <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
          <input
            type="checkbox"
            checked={gradient.enabled}
            onChange={(e) => onChange({ ...gradient, enabled: e.target.checked })}
            className="rounded border-slate-300 text-indigo-700"
          />
          <span>Aktifkan Gradien</span>
        </label>
      </div>

      {/* Preview Strip */}
      <div
        className="h-8 w-full rounded-lg border border-slate-300 shadow-inner"
        style={{ background: cssGradient || '#EEF1FB' }}
      />

      {/* Direction Slider */}
      <div className="space-y-1">
        <div className="flex items-center justify-between text-[11px] text-slate-600">
          <span>Arah Gradien (Sudut)</span>
          <span className="font-mono tabular-nums">{gradient.angle}°</span>
        </div>
        <input
          type="range"
          min={0}
          max={360}
          value={gradient.angle}
          onChange={(e) => onChange({ ...gradient, angle: Number(e.target.value) })}
          className="w-full accent-indigo-700 cursor-pointer"
        />
      </div>

      {/* Stops List */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-medium text-slate-700">
            Titik Warna ({gradient.stops.length}/6)
          </span>
          {gradient.stops.length < 6 && (
            <button
              type="button"
              onClick={addStop}
              className="inline-flex items-center gap-1 text-[11px] font-medium text-indigo-700 hover:underline"
            >
              <Plus className="w-3 h-3" />
              Tambah Titik
            </button>
          )}
        </div>

        <div className="flex flex-wrap gap-1.5">
          {gradient.stops.map((st, idx) => {
            const active = activeStop?.id === st.id;
            return (
              <div
                key={st.id}
                className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-lg border text-[11px] ${
                  active
                    ? 'bg-indigo-50 border-indigo-400 text-indigo-950 font-semibold'
                    : 'bg-white border-slate-200 text-slate-700'
                }`}
              >
                <button
                  type="button"
                  onClick={() => setSelectedStopId(st.id)}
                  className="inline-flex items-center gap-1.5"
                >
                  <span
                    className="w-3.5 h-3.5 rounded border border-black/15"
                    style={{ backgroundColor: st.color }}
                  />
                  <span className="font-mono tabular-nums">#{idx + 1} · {st.position}%</span>
                </button>
                {gradient.stops.length > 2 && (
                  <button
                    type="button"
                    aria-label={`Hapus titik ${idx + 1}`}
                    onClick={() => removeStop(st.id)}
                    className="text-slate-400 hover:text-red-600"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {activeStop && (
          <div className="p-3 rounded-lg bg-white border border-slate-200 space-y-3">
            <div className="space-y-1">
              <div className="flex items-center justify-between text-[11px] text-slate-600">
                <span>Posisi Titik Aktif</span>
                <span className="font-mono tabular-nums">{activeStop.position}%</span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                value={activeStop.position}
                onChange={(e) => {
                  const pos = Number(e.target.value);
                  onChange({
                    ...gradient,
                    stops: gradient.stops.map((s) =>
                      s.id === activeStop.id ? { ...s, position: pos } : s
                    ),
                  });
                }}
                className="w-full accent-indigo-700 cursor-pointer"
              />
            </div>

            <InteractiveColorPicker
              compact
              value={activeStop.color}
              onChange={(nextCol) =>
                onChange({
                  ...gradient,
                  stops: gradient.stops.map((s) =>
                    s.id === activeStop.id ? { ...s, color: nextCol } : s
                  ),
                })
              }
            />
          </div>
        )}
      </div>
    </div>
  );
};

// ============================================================================
// GLOBAL WORKSPACE COLOR STUDIO MODAL
// ============================================================================

type TargetFieldKey =
  | 'pageBg'
  | 'cardBg'
  | 'accent'
  | 'textPrimary'
  | 'borderColor'
  | 'buttonBg'
  | 'decorativeColor'
  | 'chartPrimary'
  | 'chartSecondary'
  | 'sidebarBg'
  | 'headerBg'
  | 'heroCardBg';

const COLOR_TARGETS: { key: TargetFieldKey; label: string; group: 'Dasar' | 'Lanjutan' | 'Bagian UI' }[] = [
  { key: 'pageBg', label: 'Latar Halaman Utama', group: 'Dasar' },
  { key: 'cardBg', label: 'Permukaan Kartu / Panel', group: 'Dasar' },
  { key: 'accent', label: 'Warna Aksen Utama', group: 'Dasar' },
  { key: 'textPrimary', label: 'Warna Teks Utama', group: 'Lanjutan' },
  { key: 'borderColor', label: 'Garis Batas (Border)', group: 'Lanjutan' },
  { key: 'buttonBg', label: 'Tombol Aksi Utama', group: 'Lanjutan' },
  { key: 'decorativeColor', label: 'Elemen Dekoratif / Aksen Emas', group: 'Lanjutan' },
  { key: 'chartPrimary', label: 'Grafik Statistik Utama', group: 'Lanjutan' },
  { key: 'chartSecondary', label: 'Grafik Statistik Sekunder', group: 'Lanjutan' },
  { key: 'sidebarBg', label: 'Navigasi Samping (Sidebar)', group: 'Bagian UI' },
  { key: 'headerBg', label: 'Header Bar Atas', group: 'Bagian UI' },
  { key: 'heroCardBg', label: 'Kartu Hero Beranda', group: 'Bagian UI' },
];

interface WorkspaceColorStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
  palette: AdvancedColorPaletteConfig;
  onChangePalette: (next: AdvancedColorPaletteConfig) => void;
  onPersistPalette: (next: AdvancedColorPaletteConfig) => Promise<void>;
}

export const WorkspaceColorStudioModal: React.FC<WorkspaceColorStudioModalProps> = ({
  isOpen,
  onClose,
  palette,
  onChangePalette,
  onPersistPalette,
}) => {
  const [activeTarget, setActiveTarget] = useState<TargetFieldKey>('accent');
  const [newPaletteName, setNewPaletteName] = useState('');
  const [saving, setSaving] = useState(false);
  const [statusNotice, setStatusNotice] = useState('');

  if (!isOpen) return null;

  function getTargetValue(key: TargetFieldKey): string {
    if (key === 'sidebarBg') return palette.sectionOverrides?.sidebarBg || '#101733';
    if (key === 'headerBg') return palette.sectionOverrides?.headerBg || '#F5F6FC';
    if (key === 'heroCardBg') return palette.sectionOverrides?.heroCardBg || palette.cardBg;
    return palette[key];
  }

  function updateTargetValue(key: TargetFieldKey, val: string) {
    if (key === 'sidebarBg' || key === 'headerBg' || key === 'heroCardBg') {
      onChangePalette({
        ...palette,
        sectionOverrides: {
          ...palette.sectionOverrides,
          [key]: val,
        },
        updatedAt: new Date().toISOString(),
      });
      return;
    }
    onChangePalette({
      ...palette,
      [key]: val,
      updatedAt: new Date().toISOString(),
    });
  }

  const contrastScore = getContrastRatio(palette.cardBg, palette.textPrimary);

  async function handleSaveCustomPalette() {
    const cleanName = newPaletteName.trim() || `Palet Kustom ${palette.savedPalettes.length + 1}`;
    const saved: SavedCustomColorPalette = {
      id: `pal-${Date.now()}`,
      name: cleanName,
      pageBg: palette.pageBg,
      cardBg: palette.cardBg,
      accent: palette.accent,
      textPrimary: palette.textPrimary,
      borderColor: palette.borderColor,
      buttonBg: palette.buttonBg,
      decorativeColor: palette.decorativeColor,
      chartPrimary: palette.chartPrimary,
      chartSecondary: palette.chartSecondary,
      gradient: palette.pageGradient,
      createdAt: new Date().toISOString(),
    };
    const next: AdvancedColorPaletteConfig = {
      ...palette,
      savedPalettes: [saved, ...palette.savedPalettes].slice(0, 12),
      updatedAt: new Date().toISOString(),
    };
    onChangePalette(next);
    setNewPaletteName('');
    setSaving(true);
    await onPersistPalette(next);
    setSaving(false);
    setStatusNotice(`Palet "${cleanName}" disimpan & diterapkan.`);
  }

  async function handleSaveCurrentChanges() {
    setSaving(true);
    await onPersistPalette({ ...palette, updatedAt: new Date().toISOString() });
    setSaving(false);
    setStatusNotice('Konfigurasi warna tema DYNAMAP berhasil disimpan.');
  }

  const visibleTargets =
    palette.mode === 'basic'
      ? COLOR_TARGETS.filter((t) => t.group === 'Dasar')
      : COLOR_TARGETS;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-[#0B0F22]/65 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-labelledby="color-studio-title"
    >
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 bg-slate-50">
          <div className="flex items-center gap-2.5">
            <Palette className="w-5 h-5 text-indigo-700" />
            <div>
              <h2 id="color-studio-title" className="text-base font-display font-bold text-slate-900">
                Studio Warna &amp; Tampilan Antarmuka DYNAMAP
              </h2>
              <p className="text-[11px] text-slate-500">
                Ubah warna global, gradien latar, atau bagian UI secara terpisah dengan pratinjau langsung.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Basic vs Advanced Mode */}
            <div className="inline-flex rounded-lg border border-slate-200 bg-white p-0.5 text-xs">
              <button
                type="button"
                onClick={() => onChangePalette({ ...palette, mode: 'basic' })}
                className={`px-3 py-1 rounded-md font-medium transition-colors whitespace-nowrap ${
                  palette.mode === 'basic'
                    ? 'bg-indigo-700 text-white'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Mode Dasar
              </button>
              <button
                type="button"
                onClick={() => onChangePalette({ ...palette, mode: 'advanced' })}
                className={`px-3 py-1 rounded-md font-medium transition-colors whitespace-nowrap ${
                  palette.mode === 'advanced'
                    ? 'bg-indigo-700 text-white'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Mode Lanjutan
              </button>
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="Tutup studio warna"
              className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-200/70"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {statusNotice && (
            <div className="px-4 py-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900">
              {statusNotice}
            </div>
          )}

          {/* Curated Presets */}
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-semibold text-slate-800">Preset Nuansa Kurasi</span>
              <button
                type="button"
                onClick={() => {
                  const resetConfig: AdvancedColorPaletteConfig = {
                    ...DEFAULT_PALETTE_CONFIG,
                    mode: palette.mode,
                    savedPalettes: palette.savedPalettes,
                    updatedAt: new Date().toISOString(),
                  };
                  onChangePalette(resetConfig);
                  setStatusNotice('Warna dikembalikan ke tema Senja Periwinkle bawaan.');
                }}
                className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-indigo-700"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset Bawaan
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {CURATED_THEME_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() =>
                    onChangePalette({
                      ...palette,
                      ...preset.config,
                      updatedAt: new Date().toISOString(),
                    })
                  }
                  className="p-2.5 rounded-xl border border-slate-200 bg-white hover:border-indigo-400 text-left space-y-2 transition-colors"
                >
                  <div className="flex items-center gap-1.5">
                    <span
                      className="w-4 h-4 rounded-full border border-black/10"
                      style={{ backgroundColor: preset.config.pageBg }}
                    />
                    <span
                      className="w-4 h-4 rounded-full border border-black/10"
                      style={{ backgroundColor: preset.config.accent }}
                    />
                    <span
                      className="w-4 h-4 rounded-full border border-black/10"
                      style={{ backgroundColor: preset.config.decorativeColor }}
                    />
                  </div>
                  <div className="text-xs font-medium text-slate-900 truncate">{preset.label}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left: Targets & Contrast Readout */}
            <div className="lg:col-span-5 space-y-4">
              <div className="space-y-1.5">
                <div className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
                  <SlidersHorizontal className="w-3.5 h-3.5 text-indigo-700" />
                  <span>Pilih Bagian Warna ({visibleTargets.length} Target)</span>
                </div>
                <div className="grid grid-cols-1 gap-1.5 max-h-64 overflow-y-auto pr-1">
                  {visibleTargets.map((t) => {
                    const currentCol = getTargetValue(t.key);
                    const active = activeTarget === t.key;
                    return (
                      <button
                        key={t.key}
                        type="button"
                        onClick={() => setActiveTarget(t.key)}
                        className={`flex items-center justify-between gap-2 px-3 py-2 rounded-xl border text-left text-xs transition-colors ${
                          active
                            ? 'bg-indigo-50 border-indigo-400 text-indigo-950 font-semibold'
                            : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <span className="truncate">{t.label}</span>
                        <span className="flex items-center gap-2 shrink-0">
                          <span className="font-mono text-[10px] text-slate-500">{currentCol}</span>
                          <span
                            className="w-4 h-4 rounded border border-slate-300"
                            style={{ backgroundColor: currentCol }}
                          />
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Contrast Helper */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-800">Rasio Kontras Teks / Kartu</span>
                  <span
                    className={`font-mono font-bold tabular-nums ${
                      contrastScore >= 4.5 ? 'text-emerald-700' : 'text-amber-700'
                    }`}
                  >
                    {contrastScore}:1 ({contrastScore >= 4.5 ? 'AA Aman' : 'Rendah'})
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Pastikan rasio minimal 4.5:1 agar teks pada kartu tetap nyaman dibaca seluruh siswa.
                </p>
              </div>

              {/* Save Palette Box */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <label htmlFor="save-pal-name" className="block text-xs font-semibold text-slate-800">
                  Simpan Sebagai Palet Kustom
                </label>
                <div className="flex gap-2">
                  <input
                    id="save-pal-name"
                    type="text"
                    value={newPaletteName}
                    onChange={(e) => setNewPaletteName(e.target.value)}
                    placeholder="Nama palet Anda..."
                    className="flex-1 px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg bg-white"
                  />
                  <button
                    type="button"
                    onClick={handleSaveCustomPalette}
                    className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-white bg-indigo-700 hover:bg-indigo-800 rounded-lg whitespace-nowrap"
                  >
                    <BookmarkPlus className="w-3.5 h-3.5" />
                    Simpan
                  </button>
                </div>

                {palette.savedPalettes.length > 0 && (
                  <div className="pt-2 space-y-1.5">
                    <div className="text-[11px] font-medium text-slate-600">Palet Tersimpan</div>
                    <div className="flex flex-wrap gap-1.5">
                      {palette.savedPalettes.map((sp) => (
                        <div
                          key={sp.id}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-xs"
                        >
                          <button
                            type="button"
                            onClick={() => {
                              onChangePalette({
                                ...palette,
                                pageBg: sp.pageBg,
                                cardBg: sp.cardBg,
                                accent: sp.accent,
                                textPrimary: sp.textPrimary,
                                borderColor: sp.borderColor,
                                buttonBg: sp.buttonBg,
                                decorativeColor: sp.decorativeColor,
                                chartPrimary: sp.chartPrimary,
                                chartSecondary: sp.chartSecondary,
                                pageGradient: sp.gradient || palette.pageGradient,
                                updatedAt: new Date().toISOString(),
                              });
                              setStatusNotice(`Palet "${sp.name}" diterapkan.`);
                            }}
                            className="inline-flex items-center gap-1.5 font-medium text-slate-800 hover:text-indigo-700"
                          >
                            <span
                              className="w-3 h-3 rounded-full border border-black/15"
                              style={{ backgroundColor: sp.accent }}
                            />
                            <span>{sp.name}</span>
                          </button>
                          <button
                            type="button"
                            aria-label={`Hapus palet ${sp.name}`}
                            onClick={() =>
                              onChangePalette({
                                ...palette,
                                savedPalettes: palette.savedPalettes.filter((p) => p.id !== sp.id),
                              })
                            }
                            className="text-slate-400 hover:text-red-600"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right: Active HSV Color Studio & Gradient */}
            <div className="lg:col-span-7 space-y-4">
              <div className="p-4 rounded-xl border border-slate-200 bg-white">
                <InteractiveColorPicker
                  label={
                    COLOR_TARGETS.find((t) => t.key === activeTarget)?.label || 'Warna Terpilih'
                  }
                  value={getTargetValue(activeTarget)}
                  onChange={(val) => updateTargetValue(activeTarget, val)}
                />
              </div>

              {palette.mode === 'advanced' && (
                <MultiStopGradientEditor
                  title="Gradien Latar Halaman Utama (Opsional)"
                  gradient={palette.pageGradient}
                  onChange={(nextGrad) =>
                    onChangePalette({
                      ...palette,
                      pageGradient: nextGrad,
                      updatedAt: new Date().toISOString(),
                    })
                  }
                />
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex flex-wrap items-center justify-between gap-3">
          <span className="text-xs text-slate-500">
            Perubahan terlihat langsung di seluruh halaman sebelum Anda menekan tombol simpan.
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-100"
            >
              Tutup
            </button>
            <button
              type="button"
              onClick={handleSaveCurrentChanges}
              disabled={saving}
              className="px-5 py-2 text-xs font-medium text-white bg-indigo-700 hover:bg-indigo-800 rounded-lg disabled:opacity-50"
            >
              {saving ? 'Menyimpan...' : 'Simpan Pengaturan Warna'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
