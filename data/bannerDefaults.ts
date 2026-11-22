import type { HomepageBannerPayload, HomepageBannerState } from '../types/dynamap';

export const DEFAULT_BANNER_IMAGE_URL = '/src/assets/images/hero_dynamap_research_1794747705329.jpg';

export function createDefaultBannerPayload(): HomepageBannerPayload {
  return {
    slides: [
      {
        id: 'slide-default-01',
        badgeText: 'Platform Edukasi & Dinamika Interpersonal SMA · Understanding Differences, Mapping Connections',
        heading: 'Memahami Perbedaan Cara Berpikir dan Membangun Komunikasi yang Lebih Sehat',
        subtitle:
          'DYNAMAP adalah ruang eksplorasi teoretis, analisis kasus interpersonal, dan kolaborasi akademik untuk lingkungan SMA. Kerangka kepribadian membantu kita memetakan perbedaan sudut pandang, namun pemahaman sejati tetap hadir melalui komunikasi dan interaksi nyata.',
        imageUrl: DEFAULT_BANNER_IMAGE_URL,
        imageAlt: 'Ilustrasi siswa SMA berkolaborasi dan memetakan dinamika interpersonal di ruang belajar',
        primaryButtonText: 'Jelajahi Kerangka Teori',
        primaryButtonTarget: 'analisis-kepribadian',
        secondaryButtonText: 'Bandingkan Dinamika Komunikasi',
        secondaryButtonTarget: 'perbandingan-interpersonal',
        backgroundColor: '#121938',
        textColor: '#F4F6FD',
        accentColor: '#DFBE74',
        overlayIntensity: 'none',
        imageFit: 'cover',
        imageFocus: 'center',
        textAlign: 'left',
      },
    ],
    display: {
      enabled: true,
      mode: 'single',
      autoAdvance: false,
      autoAdvanceSeconds: 6,
      showIndicators: true,
      showArrows: true,
      heightPreset: 'standard',
      textPosition: 'split-left',
      buttonVariant: 'solid',
      borderRadius: 'xl',
    },
    updatedAt: '2026-01-20T08:00:00.000Z',
    updatedBy: 'Administrator DYNAMAP',
  };
}

export function createDefaultBannerState(): HomepageBannerState {
  const initial = createDefaultBannerPayload();
  return {
    published: JSON.parse(JSON.stringify(initial)) as HomepageBannerPayload,
    draft: JSON.parse(JSON.stringify(initial)) as HomepageBannerPayload,
    uploadedAssets: [
      {
        filename: 'hero_dynamap_research_1794747705329.jpg',
        url: DEFAULT_BANNER_IMAGE_URL,
        uploadedAt: '2026-01-20T08:00:00.000Z',
        sizeBytes: 0,
      },
    ],
  };
}
