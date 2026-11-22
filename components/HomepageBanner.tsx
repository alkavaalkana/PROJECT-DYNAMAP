import React, { useEffect, useState } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight, Compass } from 'lucide-react';
import type { HomepageBannerPayload, HomepageBannerSlide } from '../types/dynamap';
import type { NavModuleId } from './BerandaView';
import { CelestialCornerFiligree } from './CelestialDecorations';

interface HomepageBannerProps {
  banner: HomepageBannerPayload;
  onNavigate?: (moduleId: NavModuleId) => void;
  previewDevice?: 'desktop' | 'mobile';
}

const VALID_MODULES = new Set<string>([
  'beranda',
  'analisis-kepribadian',
  'psikosofi',
  'eksplorasi-quadra',
  'perbandingan-interpersonal',
  'dinamika-komunikasi',
  'analisis-kasus',
  'dinamika-kelas',
  'pembelajaran-akademik',
  'refleksi-interpersonal',
  'galeri-profil',
  'profil-saya',
  'eksplorasi-diri',
  'peta-konsep',
  'pendidikan-karier',
  'admin',
]);

function parseHexLuminance(hex: string | undefined): number | null {
  if (!hex) return null;
  const cleaned = hex.trim().replace('#', '');
  const full =
    cleaned.length === 3
      ? cleaned
          .split('')
          .map((c) => c + c)
          .join('')
      : cleaned;
  if (!/^[0-9a-fA-F]{6}$/.test(full)) return null;
  const r = parseInt(full.slice(0, 2), 16) / 255;
  const g = parseInt(full.slice(2, 4), 16) / 255;
  const b = parseInt(full.slice(4, 6), 16) / 255;
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function isLightColor(hex: string | undefined): boolean {
  const lum = parseHexLuminance(hex);
  return lum === null ? true : lum > 0.62;
}

function isWhiteOrNearWhite(hex: string | undefined): boolean {
  const lum = parseHexLuminance(hex);
  return lum !== null && lum > 0.92;
}

export const HomepageBanner: React.FC<HomepageBannerProps> = ({
  banner,
  onNavigate,
  previewDevice,
}) => {
  const { slides, display } = banner;
  const [activeIndex, setActiveIndex] = useState(0);
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});

  const isMultiCarousel = display.mode === 'carousel' && slides.length > 1;
  const safeIndex = activeIndex < slides.length ? activeIndex : 0;
  const activeSlide: HomepageBannerSlide | undefined = slides[safeIndex] || slides[0];

  useEffect(() => {
    if (!isMultiCarousel || !display.autoAdvance) return;
    const intervalMs = Math.max(3, display.autoAdvanceSeconds || 6) * 1000;
    const timer = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % slides.length);
    }, intervalMs);
    return () => window.clearInterval(timer);
  }, [isMultiCarousel, display.autoAdvance, display.autoAdvanceSeconds, slides.length]);

  if (!display.enabled || !activeSlide) {
    return null;
  }

  function handleActionTarget(target: string) {
    if (!target) return;
    if (target.startsWith('http://') || target.startsWith('https://')) {
      window.location.href = target;
      return;
    }
    if (VALID_MODULES.has(target) && onNavigate) {
      onNavigate(target as NavModuleId);
    }
  }

  const radiusClass =
    display.borderRadius === 'none'
      ? 'rounded-none'
      : display.borderRadius === 'md'
      ? 'rounded-md'
      : display.borderRadius === 'xl'
      ? 'rounded-2xl'
      : 'rounded-2xl';

  const minHeightClass =
    display.heightPreset === 'compact'
      ? 'min-h-[250px]'
      : display.heightPreset === 'tall'
      ? 'min-h-[410px]'
      : 'min-h-[330px]';

  const alignClass =
    activeSlide.textAlign === 'center'
      ? 'text-center items-center'
      : activeSlide.textAlign === 'right'
      ? 'text-right items-end'
      : 'text-left items-start';

  const objectPositionClass =
    activeSlide.imageFocus === 'top'
      ? 'object-top'
      : activeSlide.imageFocus === 'bottom'
      ? 'object-bottom'
      : activeSlide.imageFocus === 'left'
      ? 'object-left'
      : activeSlide.imageFocus === 'right'
      ? 'object-right'
      : 'object-center';

  const overlayClass =
    activeSlide.overlayIntensity === 'strong'
      ? 'bg-[#0B0F22]/72'
      : activeSlide.overlayIntensity === 'medium'
      ? 'bg-[#0B0F22]/45'
      : activeSlide.overlayIntensity === 'light'
      ? 'bg-[#0B0F22]/20'
      : 'bg-transparent';

  const isOverlayLayout =
    display.textPosition === 'overlay-bottom' || display.textPosition === 'overlay-center';
  const isTopBanner = display.textPosition === 'top-banner';

  const surfaceIsLight = isLightColor(activeSlide.backgroundColor);
  const accentIsLight = isLightColor(activeSlide.accentColor);

  const renderPrimaryBtn = () => {
    if (!activeSlide.primaryButtonText.trim()) return null;
    const style =
      display.buttonVariant === 'outline'
        ? {
            backgroundColor: 'transparent',
            color: isOverlayLayout ? '#FFFFFF' : activeSlide.accentColor,
            borderColor: isOverlayLayout ? 'rgba(255,255,255,0.65)' : activeSlide.accentColor,
          }
        : display.buttonVariant === 'soft'
        ? {
            backgroundColor: '#E0E5F9',
            color: '#111738',
            borderColor: '#C6D0F4',
          }
        : {
            backgroundColor: activeSlide.accentColor,
            color: accentIsLight ? '#111731' : '#FFFFFF',
            borderColor: activeSlide.accentColor,
          };

    return (
      <button
        type="button"
        onClick={() => handleActionTarget(activeSlide.primaryButtonTarget)}
        style={style}
        className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium border rounded-lg transition-all hover:opacity-92 shadow-xs whitespace-nowrap"
      >
        {activeSlide.primaryButtonText}
        <ArrowRight className="w-4 h-4" />
      </button>
    );
  };

  const renderSecondaryBtn = () => {
    if (!activeSlide.secondaryButtonText.trim()) return null;
    return (
      <button
        type="button"
        onClick={() => handleActionTarget(activeSlide.secondaryButtonTarget)}
        className={`inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${
          isOverlayLayout
            ? 'bg-white/92 text-slate-900 hover:bg-white'
            : surfaceIsLight
            ? 'bg-white/80 text-slate-800 hover:bg-slate-100 border border-slate-300/80'
            : 'bg-white/10 text-[#F4F6FD] hover:bg-white/18 border border-white/20'
        }`}
      >
        {activeSlide.secondaryButtonText}
      </button>
    );
  };

  const showImg = Boolean(activeSlide.imageUrl && !failedImages[activeSlide.id]);

  const carouselControls = isMultiCarousel ? (
    <>
      {display.showArrows && (
        <>
          <button
            type="button"
            aria-label="Slide spanduk sebelumnya"
            onClick={() => setActiveIndex((prev) => (prev - 1 + slides.length) % slides.length)}
            className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-[#101733]/75 backdrop-blur-sm border border-white/20 text-white flex items-center justify-center shadow-sm hover:bg-[#101733]"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            aria-label="Slide spanduk berikutnya"
            onClick={() => setActiveIndex((prev) => (prev + 1) % slides.length)}
            className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-[#101733]/75 backdrop-blur-sm border border-white/20 text-white flex items-center justify-center shadow-sm hover:bg-[#101733]"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </>
      )}
      {display.showIndicators && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 bg-[#101733]/75 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/15">
          {slides.map((sl, i) => (
            <button
              key={sl.id}
              type="button"
              aria-label={`Pilih slide ${i + 1}`}
              onClick={() => setActiveIndex(i)}
              className={`h-1.5 rounded-full transition-all ${
                i === safeIndex ? 'w-5 bg-[#DFBE74]' : 'w-1.5 bg-white/45 hover:bg-white/75'
              }`}
            />
          ))}
        </div>
      )}
    </>
  ) : null;

  if (isOverlayLayout) {
    return (
      <section
        className={`relative overflow-hidden border border-slate-200/90 shadow-[0_22px_56px_-28px_rgba(16,23,51,0.28)] ${radiusClass} ${minHeightClass} flex ${
          display.textPosition === 'overlay-center' ? 'items-center' : 'items-end'
        }`}
        style={{ backgroundColor: activeSlide.backgroundColor || '#121938' }}
      >
        {showImg && (
          <img
            src={activeSlide.imageUrl!}
            alt={activeSlide.imageAlt || activeSlide.heading}
            referrerPolicy="no-referrer"
            onError={() => setFailedImages((prev) => ({ ...prev, [activeSlide.id]: true }))}
            className={`absolute inset-0 w-full h-full ${
              activeSlide.imageFit === 'contain' ? 'object-contain' : 'object-cover'
            } ${objectPositionClass}`}
          />
        )}
        <div className={`absolute inset-0 ${overlayClass}`} aria-hidden="true" />
        <div
          className={`relative z-10 w-full p-7 sm:p-11 flex flex-col ${alignClass} max-w-4xl`}
          style={{ color: activeSlide.textColor }}
        >
          {activeSlide.badgeText.trim() && (
            <div className="flex items-center gap-2.5 text-xs font-medium tracking-wide opacity-90">
              <span className="w-6 h-px bg-[#DFBE74]" aria-hidden="true" />
              <span>{activeSlide.badgeText}</span>
            </div>
          )}
          <h1
            className={`mt-3 font-display font-semibold leading-[1.12] text-balance ${
              previewDevice === 'mobile' ? 'text-2xl' : 'text-3xl sm:text-[2.5rem]'
            }`}
          >
            {activeSlide.heading}
          </h1>
          {activeSlide.subtitle.trim() && (
            <p className="mt-3.5 text-sm sm:text-base opacity-90 leading-relaxed max-w-2xl">
              {activeSlide.subtitle}
            </p>
          )}
          {(activeSlide.primaryButtonText.trim() || activeSlide.secondaryButtonText.trim()) && (
            <div className="mt-6 flex flex-wrap items-center gap-3">
              {renderPrimaryBtn()}
              {renderSecondaryBtn()}
            </div>
          )}
        </div>
        {carouselControls}
      </section>
    );
  }

  const textPaneBgStyle = isWhiteOrNearWhite(activeSlide.backgroundColor)
    ? {
        backgroundImage:
          'radial-gradient(circle at 12% 18%, rgba(223,190,116,0.16), transparent 44%), radial-gradient(circle at 86% 82%, rgba(112,134,222,0.14), transparent 52%), linear-gradient(135deg, #FFFFFF 0%, #F7F8FE 54%, #EAEFFA 100%)',
        color: activeSlide.textColor,
      }
    : {
        backgroundColor: activeSlide.backgroundColor,
        color: activeSlide.textColor,
      };

  const footerDividerClass = surfaceIsLight ? 'border-slate-200/85' : 'border-white/12';

  return (
    <section
      className={`relative overflow-hidden border ${
        surfaceIsLight ? 'border-slate-200/90' : 'border-[#253161]'
      } shadow-[0_22px_56px_-28px_rgba(16,23,51,0.24)] ${radiusClass} grid ${
        isTopBanner || previewDevice === 'mobile' ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-12'
      } items-stretch`}
      style={textPaneBgStyle}
    >
      {/* Text Panel */}
      <div
        className={`relative ${
          isTopBanner || previewDevice === 'mobile'
            ? 'col-span-1 order-2'
            : 'lg:col-span-7 lg:order-1'
        } p-7 sm:p-9 lg:p-10 flex flex-col justify-between ${minHeightClass}`}
      >
        <CelestialCornerFiligree position="top-right" tone={surfaceIsLight ? 'light' : 'dark'} />
        <div className={`flex flex-col ${alignClass}`}>
          {activeSlide.badgeText.trim() && (
            <div
              className="flex items-center gap-2.5 text-xs font-medium tracking-wide"
              style={{
                color:
                  !surfaceIsLight && !accentIsLight
                    ? '#E6C77E'
                    : activeSlide.accentColor,
              }}
            >
              <span
                className="w-6 h-px shrink-0"
                style={{ backgroundColor: surfaceIsLight ? '#C9A65B' : '#DFBE74' }}
                aria-hidden="true"
              />
              <span>{activeSlide.badgeText}</span>
            </div>
          )}
          <h1
            className={`mt-4 font-display font-semibold leading-[1.13] text-balance ${
              previewDevice === 'mobile' ? 'text-2xl' : 'text-3xl sm:text-[2.35rem]'
            }`}
          >
            {activeSlide.heading}
          </h1>
          {activeSlide.subtitle.trim() && (
            <p className="mt-4 text-sm sm:text-[15px] opacity-85 leading-relaxed max-w-2xl">
              {activeSlide.subtitle}
            </p>
          )}
        </div>

        {(activeSlide.primaryButtonText.trim() || activeSlide.secondaryButtonText.trim()) && (
          <div className={`mt-7 pt-6 border-t ${footerDividerClass} flex flex-wrap items-center gap-3`}>
            {renderPrimaryBtn()}
            {renderSecondaryBtn()}
          </div>
        )}
      </div>

      {/* Seamless Artwork / Illustration Panel */}
      <div
        className={`${
          isTopBanner || previewDevice === 'mobile'
            ? 'col-span-1 order-1 border-b border-slate-200/70'
            : 'lg:col-span-5 lg:order-2 border-t lg:border-t-0 lg:border-l border-slate-200/60'
        } relative overflow-hidden flex flex-col`}
      >
        {showImg ? (
          <div
            className={`relative w-full ${
              isTopBanner ? 'h-60 sm:h-72' : 'h-60 sm:h-72 lg:h-full'
            }`}
          >
            <img
              src={activeSlide.imageUrl!}
              alt={activeSlide.imageAlt || activeSlide.heading}
              referrerPolicy="no-referrer"
              onError={() => setFailedImages((prev) => ({ ...prev, [activeSlide.id]: true }))}
              className={`w-full h-full ${
                activeSlide.imageFit === 'contain' ? 'object-contain bg-slate-50/70' : 'object-cover'
              } ${objectPositionClass}`}
            />
            {activeSlide.overlayIntensity !== 'none' && (
              <div className={`absolute inset-0 ${overlayClass}`} aria-hidden="true" />
            )}
            {/* Subtle atmospheric twilight edge vignette so image blends gracefully */}
            {!isTopBanner && previewDevice !== 'mobile' && (
              <div
                aria-hidden="true"
                className={`hidden lg:block pointer-events-none absolute inset-y-0 w-10 left-0 bg-gradient-to-r ${
                  surfaceIsLight
                    ? 'from-[#EFF2FC]/55 to-transparent'
                    : 'from-[#121938]/45 to-transparent'
                }`}
              />
            )}
          </div>
        ) : (
          <div className="w-full h-56 lg:h-full bg-[#151D40] text-[#EEF1FC] flex flex-col items-center justify-center p-6 text-center">
            <Compass className="w-10 h-10 text-[#DFBE74] mb-2" />
            <p className="text-sm font-medium text-[#E2E8FA]">
              Pemetaan Dinamika Interpersonal DYNAMAP
            </p>
          </div>
        )}
      </div>

      {carouselControls}
    </section>
  );
};
