import React, { useState } from 'react';
import {
  ArrowRight,
  BookOpen,
  Briefcase,
  Compass,
  Gamepad2,
  GitCompare,
  GraduationCap,
  IdCard,
  Layers,
  MessageSquare,
  Network,
  Orbit,
  Scale,
  SlidersHorizontal,
  UserCheck,
  Users,
} from 'lucide-react';
import type { HomepageBannerPayload, Profile, StudyGroup, TheoryArticle } from '../types/dynamap';
import type { ClassStatistics } from '../lib/typology';
import { QuadraDonutChart } from './QuadraUI';
import { HomepageBanner } from './HomepageBanner';
import { CelestialCornerFiligree } from './CelestialDecorations';

export type NavModuleId =
  | 'beranda'
  | 'analisis-kepribadian'
  | 'psikosofi'
  | 'eksplorasi-quadra'
  | 'playground-tipologi'
  | 'perbandingan-interpersonal'
  | 'dinamika-komunikasi'
  | 'analisis-kasus'
  | 'studi-kasus'
  | 'dinamika-kelas'
  | 'pembelajaran-akademik'
  | 'eksplorasi-diri'
  | 'arcade-tipologi'
  | 'pendidikan-karier'
  | 'refleksi-interpersonal'
  | 'galeri-profil'
  | 'profil-saya'
  | 'kartu-identitas'
  | 'peta-konsep'
  | 'admin';

interface BerandaViewProps {
  profiles: Profile[];
  stats: ClassStatistics;
  theoryArticles: TheoryArticle[];
  studyGroups: StudyGroup[];
  publicActivityCount: number;
  publishedBanner: HomepageBannerPayload;
  onNavigate: (moduleId: NavModuleId) => void;
}

const OBJECTIVES = [
  {
    code: '01',
    domain: 'Arsitektur Teori',
    text: 'Mempelajari Socionics Model A, MBTI 8 Posisi & 16 Stack, Enneagram (Sayap, Insting, Tritype), Psikosofi (L·V·E·F), SLOAN Big Five, dan 12 Kombinasi Temperamen.',
  },
  {
    code: '02',
    domain: 'Kognisi & Komunikasi',
    text: 'Memahami bagaimana perbedaan filter informasi, motivasi batin, dan tempo temperamental memengaruhi gaya bicara serta pengambilan keputusan.',
  },
  {
    code: '03',
    domain: 'Pemetaan Non-Deterministik',
    text: 'Membandingkan dua atau lebih individu melalui peta dinamika dua arah tanpa mereduksi relasi menjadi angka skor kecocokan palsu.',
  },
  {
    code: '04',
    domain: 'Pemisahan Fakta & Hipotesis',
    text: 'Menginvestigasi kesalahpahaman interpersonal nyata melalui audit bukti teramati, asumsi, dan penjelasan non-tipologis.',
  },
  {
    code: '05',
    domain: 'Simulasi & Resolusi',
    text: 'Melatih strategi komunikasi praktis, dialog perbaikan, dan simulasi skenario keputusan sehari-hari di lingkungan SMA.',
  },
  {
    code: '06',
    domain: 'Kolaborasi Akademik',
    text: 'Menyelaraskan preferensi belajar mandiri, kelompok studi, dan eksplorasi jurusan PTN lintas siswa, guru, serta wali kelas.',
  },
];

const SYNTHESIS_LAYERS = [
  {
    id: 'kognitif',
    label: 'Lapisan Kognitif',
    frameworks: 'Socionics Model A · MBTI Stack · Tipologi Jung',
    question: 'Bagaimana seseorang menyerap informasi & menguji argumen?',
    accent: '#2C3C8C',
    cx: 155,
    cy: 64,
  },
  {
    id: 'motivasi',
    label: 'Lapisan Motivasi & Kepekaan',
    frameworks: 'Enneagram · Varian Insting · Tritype · Psikosofi LVEF',
    question: 'Apa yang ingin dilindungi batin & area mana yang paling sensitif?',
    accent: '#9A6E24',
    cx: 415,
    cy: 64,
  },
  {
    id: 'perilaku',
    label: 'Lapisan Perilaku & Tempo',
    frameworks: 'SLOAN Big Five · 4 & 12 Temperamen Klasik–Campuran',
    question: 'Seberapa cepat reaksi emosional, keteraturan kerja & keterbukaan sosial?',
    accent: '#236B5E',
    cx: 155,
    cy: 196,
  },
  {
    id: 'relasional',
    label: 'Lapisan Relasional & Refleksi',
    frameworks: 'Peta Dinamika A ↔ B · Pemeriksaan Realitas · Konteks Kelas',
    question: 'Bagaimana dua konfigurasi saling membaca niat di situasi nyata?',
    accent: '#7A3E65',
    cx: 415,
    cy: 196,
  },
];

const MODULE_GROUPS: {
  groupCode: string;
  groupTitle: string;
  groupSummary: string;
  items: {
    id: NavModuleId;
    icon: React.ComponentType<{ className?: string }>;
    kicker: string;
    title: string;
    desc: string;
  }[];
}[] = [
  {
    groupCode: 'A',
    groupTitle: 'Korpus Teori & Pemetaan Konsep',
    groupSummary: 'Rujukan mendalam lintas 8 kerangka kepribadian, perbandingan antar-pasangan teori, dan laboratorium interaktif.',
    items: [
      {
        id: 'analisis-kepribadian',
        icon: BookOpen,
        kicker: 'Socionics · MBTI · Enneagram · Temperamen',
        title: 'Arsip Teori Kepribadian Lengkap',
        desc: '16 tipe Model A, 8 Posisi Fungsi & 16 Dinamika Stack MBTI, 9 tipe Enneagram, SLOAN, serta 4 + 12 kombinasi Temperamen.',
      },
      {
        id: 'psikosofi',
        icon: Compass,
        kicker: 'L · V · E · F (Afanasiev & AP)',
        title: 'Psikosofi & 24 Tipe Prioritas Sikap',
        desc: 'Eksplorasi 4 aspek, 16 panduan identifikasi posisi, direktori 24 tipe, serta sintesis gesekan psikologis.',
      },
      {
        id: 'peta-konsep',
        icon: Network,
        kicker: '6 Pasangan Lintas Kerangka',
        title: 'Peta Relasi & Komparasi Konsep',
        desc: 'Bandingkan Socionics vs MBTI, Jung vs MBTI, Big Five vs Temperamen, dan telusuri jalur belajar terstruktur.',
      },
      {
        id: 'eksplorasi-quadra',
        icon: Layers,
        kicker: 'Alpha · Beta · Gamma · Delta',
        title: 'Eksplorasi 4 Quadra Kelas',
        desc: 'Telusuri nilai informasi kelompok, perbedaan internal anggota dalam satu Quadra, serta batasan interpretasinya.',
      },
      {
        id: 'playground-tipologi',
        icon: SlidersHorizontal,
        kicker: 'Laboratorium Konfigurasi',
        title: 'Playground Tipologi Interaktif',
        desc: 'Eksperimen langsung menyusun Model A, Dikotomi MBTI, Tritype Enneagram, Psikosofi LVEF, dan SLOAN.',
      },
    ],
  },
  {
    groupCode: 'B',
    groupTitle: 'Dinamika Interpersonal, Diri & Studi',
    groupSummary: 'Terjemahan kerangka teori ke dalam sintesis profil pribadi, simulasi konflik dua arah, refleksi nyata, dan perencanaan studi.',
    items: [
      {
        id: 'profil-saya',
        icon: UserCheck,
        kicker: 'Sintesis 13 Topik & 7 Kategori Kontradiksi',
        title: 'Profil & Interpretasi Diri Multi-Lapis',
        desc: 'Baca interpretasi terpadu lintas kerangka, lihat sumber alasan tiap klaim, uji kesesuaian nyata, dan atur privasi granular.',
      },
      {
        id: 'perbandingan-interpersonal',
        icon: GitCompare,
        kicker: 'Peta Arah A → B & B → A + 5 Tahap',
        title: 'Perbandingan Interpersonal & Dinamika',
        desc: 'Bandingkan 2+ profil lintas Socionics, MBTI, SLOAN, Temperamen, Enneagram & Psikosofi dengan diagram alir niat vs tafsir.',
      },
      {
        id: 'eksplorasi-diri',
        icon: Orbit,
        kicker: 'Simulator Skenario & Uji Konsistensi',
        title: 'Peta Pemahaman Diri & Simulator',
        desc: 'Simulasikan skenario komunikasi dengan profil Anda atau bandingkan respons konfigurasi tipe alternatif.',
      },
      {
        id: 'dinamika-komunikasi',
        icon: MessageSquare,
        kicker: '12 Skenario Konteks Sekolah',
        title: 'Dinamika & Dialog Komunikasi',
        desc: 'Latih respons terhadap kritik, ekspektasi berbeda, ketimpangan kontribusi, hingga cara menetapkan batasan sehat.',
      },
      {
        id: 'analisis-kasus',
        icon: Scale,
        kicker: 'Investigasi Situasi Nyata',
        title: 'Analisis Kasus 12 Langkah',
        desc: 'Pisahkan fakta teramati dari asumsi niat, faktor stres lingkungan, serta alternatif penjelasan di luar tipologi.',
      },
      {
        id: 'studi-kasus',
        icon: BookOpen,
        kicker: 'Narasi & Pembuktian Bukti',
        title: 'Studi Kasus Lanjutan',
        desc: 'Bedah kasus tokoh fiktif multi-kerangka yang melatih kepekaan membedakan indikasi kognitif dari bias stereotip.',
      },
      {
        id: 'dinamika-kelas',
        icon: Users,
        kicker: 'Distribusi Komposisi Kelas',
        title: 'Statistik Dinamika Kelas',
        desc: 'Pantau sebaran Quadra, Enneagram, MBTI, SLOAN, dan Temperamen kelas tanpa mereduksi keragaman individu.',
      },
      {
        id: 'pembelajaran-akademik',
        icon: GraduationCap,
        kicker: 'Preferensi Belajar & Kelompok',
        title: 'Pembelajaran & Kelompok Studi',
        desc: 'Catat strategi belajar mandiri, sesuaikan umpan balik per mata pelajaran SMA, dan kelola peran kelompok belajar.',
      },
      {
        id: 'pendidikan-karier',
        icon: Briefcase,
        kicker: 'PTN & Gap FISKIM MATONOMI',
        title: 'Studi Lanjut PTN & Peta Jalan',
        desc: 'Evaluasi kesenjangan mata pelajaran terhadap program studi PTN Indonesia dan susun rencana persiapan bertahap.',
      },
      {
        id: 'arcade-tipologi',
        icon: Gamepad2,
        kicker: '12 Mini-Game & Penguasaan Belajar',
        title: 'Typology Arcade & Progres Pengetahuan',
        desc: 'Latih akurasi pengenalan elemen lintas kerangka lewat kuis harian, detektif tipe, serta grafik penguasaan nyata.',
      },
      {
        id: 'kartu-identitas',
        icon: IdCard,
        kicker: 'Ekspor PNG Lanskap',
        title: 'Kartu ID Tipologi Digital',
        desc: 'Hasilkan kartu identitas tipologi beresolusi tinggi termasuk MBTI stack, SLOAN, dan temperamen dengan kendali privasi.',
      },
    ],
  },
];

export const BerandaView: React.FC<BerandaViewProps> = ({
  stats,
  theoryArticles,
  studyGroups,
  publicActivityCount,
  publishedBanner,
  onNavigate,
}) => {
  const [activeLayerId, setActiveLayerId] = useState<string>('kognitif');
  const activeLayer = SYNTHESIS_LAYERS.find((l) => l.id === activeLayerId) || SYNTHESIS_LAYERS[0];

  return (
    <div className="space-y-12">
      {/* Dynamic Admin-Customizable Homepage Hero Banner */}
      <HomepageBanner banner={publishedBanner} onNavigate={onNavigate} />

      {/* Atlas Band 1: Multi-Layer Synthesis Cartography + Live Class Telemetry */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-7 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-slate-200 pb-4">
            <div>
              <span className="atlas-kicker">Peta Arsitektur Atlas</span>
              <h2 className="mt-1.5 text-2xl sm:text-[26px] font-display font-semibold text-slate-900">
                Bagaimana DYNAMAP Mensintesis Manusia
              </h2>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('profil-saya')}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-white bg-[#151D40] hover:bg-[#233070] rounded-lg transition-colors whitespace-nowrap shrink-0"
            >
              Buka Interpretasi Diri
              <ArrowRight className="w-3.5 h-3.5 text-[#E6C77E]" />
            </button>
          </div>

          <p className="text-sm text-slate-600 leading-relaxed">
            Alih-alih meringkas kepribadian menjadi satu label tunggal, DYNAMAP memisahkan cara berpikir, pendorong batin,
            kebiasaan teramati, dan dinamika relasional ke dalam empat lapisan analisis yang saling menjelaskan.
          </p>

          {/* Interactive SVG Multi-Layer Synthesis Map */}
          <div className="atlas-grid-bg border border-slate-200/90 rounded-2xl bg-white/85 p-4 sm:p-5 space-y-4">
            <svg
              viewBox="0 0 570 258"
              className="w-full h-auto"
              role="img"
              aria-label="Diagram interaktif empat lapisan sintesis DYNAMAP"
            >
              {/* Coordinate hairlines & central nexus */}
              <line x1="155" y1="64" x2="415" y2="64" stroke="#CBD5E1" strokeWidth="1" strokeDasharray="4 4" />
              <line x1="155" y1="196" x2="415" y2="196" stroke="#CBD5E1" strokeWidth="1" strokeDasharray="4 4" />
              <line x1="155" y1="64" x2="155" y2="196" stroke="#CBD5E1" strokeWidth="1" strokeDasharray="4 4" />
              <line x1="415" y1="64" x2="415" y2="196" stroke="#CBD5E1" strokeWidth="1" strokeDasharray="4 4" />
              <line x1="155" y1="64" x2="415" y2="196" stroke="#D4AE60" strokeWidth="1.2" strokeOpacity="0.55" />
              <line x1="415" y1="64" x2="155" y2="196" stroke="#D4AE60" strokeWidth="1.2" strokeOpacity="0.55" />

              {/* Center Synthesis Node */}
              <g transform="translate(285, 130)">
                <circle r="34" fill="#121938" stroke="#DFBE74" strokeWidth="1.5" />
                <text y="-4" textAnchor="middle" fill="#E6C77E" fontSize="9.5" fontFamily="JetBrains Mono, monospace" fontWeight="600">
                  SINTESIS
                </text>
                <text y="10" textAnchor="middle" fill="#FFFFFF" fontSize="9" fontFamily="Manrope, sans-serif">
                  Profil Utuh
                </text>
              </g>

              {SYNTHESIS_LAYERS.map((layer) => {
                const isSelected = layer.id === activeLayerId;
                return (
                  <g
                    key={layer.id}
                    transform={`translate(${layer.cx}, ${layer.cy})`}
                    onClick={() => setActiveLayerId(layer.id)}
                    className="cursor-pointer"
                  >
                    <rect
                      x="-135"
                      y="-38"
                      width="270"
                      height="76"
                      rx="10"
                      fill={isSelected ? '#121938' : '#FFFFFF'}
                      stroke={isSelected ? '#DFBE74' : '#CBD5E1'}
                      strokeWidth={isSelected ? '1.8' : '1'}
                    />
                    <circle cx="-114" cy="-14" r="4.5" fill={layer.accent} />
                    <text
                      x="-102"
                      y="-10"
                      fill={isSelected ? '#E6C77E' : '#111731'}
                      fontSize="11.5"
                      fontWeight="700"
                      fontFamily="Fraunces, Georgia, serif"
                    >
                      {layer.label}
                    </text>
                    <text
                      x="-122"
                      y="10"
                      fill={isSelected ? '#CBD5E1' : '#475569'}
                      fontSize="9.5"
                      fontFamily="JetBrains Mono, monospace"
                    >
                      {layer.frameworks}
                    </text>
                    <text
                      x="-122"
                      y="26"
                      fill={isSelected ? '#94A3B8' : '#64748B'}
                      fontSize="9"
                      fontFamily="Manrope, sans-serif"
                    >
                      Klik untuk melihat fokus analisis
                    </text>
                  </g>
                );
              })}
            </svg>

            <div className="pt-3 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div>
                <div className="font-mono text-[11px] uppercase tracking-wider text-indigo-700">
                  Fokus Aktif · {activeLayer.label}
                </div>
                <p className="mt-0.5 text-sm font-medium text-slate-900">{activeLayer.question}</p>
                <p className="text-slate-600 mt-0.5">Kerangka terkait: {activeLayer.frameworks}</p>
              </div>
              <button
                type="button"
                onClick={() => onNavigate(activeLayerId === 'relasional' ? 'perbandingan-interpersonal' : 'analisis-kepribadian')}
                className="text-xs font-semibold text-indigo-700 hover:text-indigo-900 whitespace-nowrap shrink-0 underline"
              >
                Buka modul terkait
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Live Class Telemetry Ledger */}
        <aside className="lg:col-span-5 dreamy-surface border border-slate-200/90 rounded-2xl p-6 sm:p-7 space-y-6">
          <div className="flex items-start justify-between gap-2 border-b border-slate-200 pb-4">
            <div>
              <span className="atlas-kicker">Statistik Kelas Aktif</span>
              <h2 className="mt-1.5 text-xl font-display font-semibold text-slate-900">
                Komposisi Basis Data Saat Ini
              </h2>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('dinamika-kelas')}
              className="text-xs font-medium text-indigo-700 hover:text-indigo-900 hover:underline whitespace-nowrap shrink-0"
            >
              Statistik Lengkap
            </button>
          </div>

          <QuadraDonutChart items={stats.byQuadra} total={stats.totalActive} />

          <dl className="grid grid-cols-2 gap-x-4 gap-y-3 pt-4 border-t border-slate-200/90 text-xs tabular-nums">
            <div>
              <dt className="text-slate-500">Siswa Awal Terkurasi</dt>
              <dd className="text-base font-display font-semibold text-slate-900">{stats.initialStudentsCount}</dd>
            </div>
            <div>
              <dt className="text-slate-500">Partisipan Tambahan</dt>
              <dd className="text-base font-display font-semibold text-slate-900">
                {stats.addedStudentsCount + stats.teachersAndStaffCount}
              </dd>
            </div>
            <div>
              <dt className="text-slate-500">Kelompok Belajar</dt>
              <dd className="text-base font-display font-semibold text-slate-900">{studyGroups.length}</dd>
            </div>
            <div>
              <dt className="text-slate-500">Riwayat Pembaruan</dt>
              <dd className="text-base font-display font-semibold text-slate-900">{publicActivityCount}</dd>
            </div>
          </dl>
        </aside>
      </section>

      {/* Atlas Band 2: Editorial Objectives Ledger (non-card open layout) */}
      <section className="atlas-sheet py-8 px-5 sm:px-8 rounded-2xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <span className="atlas-kicker">Mandat Riset &amp; Edukasi</span>
            <h2 className="mt-1.5 text-xl sm:text-2xl font-display font-semibold text-slate-900">
              Enam Prinsip Kerja Platform
            </h2>
          </div>
          <p className="text-xs text-slate-500 max-w-md leading-relaxed">
            Seluruh modul bacaan, peta perbandingan, dan simulasi dapat dijelajahi bebas tanpa keharusan masuk akun.
          </p>
        </div>

        <ol className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-6">
          {OBJECTIVES.map((obj) => (
            <li key={obj.code} className="pt-4 border-t border-slate-200/90 space-y-1.5">
              <div className="flex items-center justify-between text-[11px]">
                <span className="atlas-index font-semibold text-indigo-700">{obj.code}</span>
                <span className="font-mono text-slate-500 uppercase tracking-wider">{obj.domain}</span>
              </div>
              <p className="text-sm text-slate-700 leading-relaxed">{obj.text}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* Atlas Band 3: Two-Track Module Catalogue */}
      <section className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-slate-200 pb-4">
          <div>
            <span className="atlas-kicker">Indeks Modul DYNAMAP</span>
            <h2 className="mt-1.5 text-xl sm:text-2xl font-display font-semibold text-slate-900">
              Direktori Eksplorasi Teori, Diri &amp; Kolaborasi
            </h2>
          </div>
          <p className="text-xs text-slate-500">
            Terbagi ke dalam jalur rujukan konseptual (Bagian A) dan jalur praktik &amp; refleksi (Bagian B).
          </p>
        </div>

        <div className="space-y-10">
          {MODULE_GROUPS.map((group) => (
            <div key={group.groupCode} className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
                <div className="flex items-baseline gap-3">
                  <span className="atlas-index text-xs font-bold px-2 py-0.5 rounded border border-indigo-200 bg-indigo-50 text-indigo-800">
                    BAGIAN {group.groupCode}
                  </span>
                  <h3 className="text-lg font-display font-semibold text-slate-900">{group.groupTitle}</h3>
                </div>
                <p className="text-xs text-slate-500">{group.groupSummary}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-slate-200/85 border border-slate-200/90 rounded-2xl overflow-hidden shadow-[0_18px_46px_-28px_rgba(16,23,51,0.18)]">
                {group.items.map((card, index) => {
                  const Icon = card.icon;
                  const rem = group.items.length % 3;
                  const isLastSingle = rem === 1 && index === group.items.length - 1;
                  const isLastPair = rem === 2 && index === group.items.length - 1;
                  const spanClass = isLastSingle
                    ? 'lg:col-span-3 lg:flex-row lg:items-center lg:gap-8'
                    : isLastPair
                    ? 'lg:col-span-2'
                    : '';
                  return (
                    <button
                      key={card.id}
                      type="button"
                      onClick={() => onNavigate(card.id)}
                      className={`text-left bg-white/95 hover:bg-[#EFF2FD] p-5 sm:p-6 transition-colors flex flex-col justify-between group ${spanClass}`}
                    >
                      <div className={isLastSingle ? 'lg:max-w-3xl' : ''}>
                        <div className="flex items-center justify-between gap-3 text-[11px] font-mono text-slate-500">
                          <span className="truncate">{card.kicker}</span>
                          <Icon className="w-4 h-4 text-indigo-600/85 group-hover:text-indigo-800 shrink-0 transition-colors" />
                        </div>
                        <h4 className="mt-2 text-base font-display font-semibold text-slate-900 group-hover:text-indigo-800 transition-colors">
                          {card.title}
                        </h4>
                        <p className="mt-1.5 text-sm text-slate-600 leading-relaxed">{card.desc}</p>
                      </div>
                      <span
                        className={`inline-flex items-center gap-1.5 text-xs font-medium text-indigo-700 group-hover:text-indigo-900 shrink-0 ${
                          isLastSingle ? 'mt-4 lg:mt-0' : 'mt-4'
                        }`}
                      >
                        Buka modul <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Atlas Band 4: Curated Reading Archive & Epistemic Notice */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <div className="lg:col-span-8 dreamy-surface border border-slate-200/90 rounded-2xl p-6 sm:p-7 space-y-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <span className="atlas-kicker">Arsip Artikel Terkurasi</span>
              <h2 className="mt-1 text-xl font-display font-semibold text-slate-900">
                Bacaan Teoretis &amp; Etika Penggunaan
              </h2>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('galeri-profil')}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-indigo-700 hover:text-indigo-900 hover:underline whitespace-nowrap"
            >
              <Users className="w-3.5 h-3.5" />
              Galeri Profil
            </button>
          </div>
          <div className="divide-y divide-slate-200/80">
            {theoryArticles.slice(0, 4).map((article) => (
              <article key={article.id} className="py-4 first:pt-1 last:pb-1 space-y-1.5">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <span className="font-mono font-medium text-indigo-700">{article.category}</span>
                  <span aria-hidden="true">·</span>
                  <span>Diperbarui oleh {article.updatedBy}</span>
                </div>
                <h3 className="text-base font-display font-semibold text-slate-900">
                  {article.title}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">{article.content}</p>
              </article>
            ))}
          </div>
        </div>

        <div className="relative overflow-hidden lg:col-span-4 bg-[#121938] text-[#EEF1FC] border border-[#242F5C] rounded-2xl p-6 sm:p-7 space-y-5 shadow-[0_18px_46px_-26px_rgba(12,18,43,0.45)]">
          <CelestialCornerFiligree position="top-right" tone="dark" />
          <div>
            <div className="flex items-center gap-2 text-[11px] font-mono font-medium uppercase tracking-wider text-[#E6C77E]">
              <span className="w-4 h-px bg-[#DFBE74]" aria-hidden="true" />
              <span>Disiplin Epistemik</span>
            </div>
            <h2 className="mt-1.5 text-lg font-display font-semibold text-white">
              Pemisahan Sumber Informasi
            </h2>
            <p className="text-xs text-[#B9C3E6] mt-1 leading-relaxed">
              Setiap pernyataan di DYNAMAP menandai asalnya secara jujur agar hipotesis tidak disamakan dengan vonis mutlak:
            </p>
          </div>
          <ul className="space-y-3.5 text-xs text-[#CFD7F3] leading-relaxed">
            <li className="pb-3 border-b border-white/10">
              <strong className="text-[#E6C77E] block mb-0.5 font-medium">Pengetahuan Teoretis Terkurasi</strong>
              Pernyataan yang diturunkan langsung dari literatur Socionics, MBTI, Jung, Enneagram, Psikosofi, Big Five, dan Temperamen.
            </li>
            <li className="pb-3 border-b border-white/10">
              <strong className="text-[#E6C77E] block mb-0.5 font-medium">Data Awal &amp; Suntingan Mandiri</strong>
              Klasifikasi profil kelas yang selalu dapat ditinjau ulang, dilengkapi sebagian, atau diperbaiki oleh pemilik profil.
            </li>
            <li className="pb-3 border-b border-white/10">
              <strong className="text-[#E6C77E] block mb-0.5 font-medium">Interpretasi Tipologis Terstruktur</strong>
              Sintesis otomatis lintas kerangka dengan panel alasan yang selalu menyebut data pendukung dan batasannya.
            </li>
            <li>
              <strong className="text-[#E6C77E] block mb-0.5 font-medium">Pemeriksaan Realitas Pengguna</strong>
              Refleksi dan peninjauan kesesuaian nyata oleh siswa tanpa pernah memaksa perubahan label secara otomatis.
            </li>
          </ul>
        </div>
      </section>
    </div>
  );
};
