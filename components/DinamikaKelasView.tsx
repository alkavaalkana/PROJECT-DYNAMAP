import React, { useMemo, useState } from 'react';
import { computeClassStatistics } from '../lib/typology';
import type { Profile, ProfileCategory, QuadraName } from '../types/dynamap';
import { HorizontalBarChart, ProfileAvatar, QuadraDonutChart, getQuadraTheme } from './QuadraUI';

interface DinamikaKelasViewProps {
  profiles: Profile[];
}

const RESEARCH_QUESTIONS = [
  'Bagaimana siswa dengan preferensi komunikasi berbeda mengalami tugas kerja kelompok di kelas?',
  'Kesulitan komunikasi apa yang paling sering dilaporkan siswa saat menentukan pembagian peran dan tenggat?',
  'Apakah terdapat perbedaan antara preferensi komunikasi yang diperkirakan secara teoretis dengan pengalaman nyata di kelas?',
  'Faktor apa saja di luar tipologi (misalnya beban jadwal, kejelasan rubrik, kelelahan) yang memengaruhi interaksi kelas?',
  'Bagaimana siswa mengevaluasi efektivitas metode kolaborasi yang berbeda setelah proyek selesai?',
];

export const DinamikaKelasView: React.FC<DinamikaKelasViewProps> = ({ profiles }) => {
  const [originFilter, setOriginFilter] = useState<'all' | 'initial_37' | 'added_students' | 'staff'>('all');
  const [quadraFilter, setQuadraFilter] = useState<QuadraName | 'ALL'>('ALL');

  const activeProfiles = useMemo(() => profiles.filter((p) => !p.archived), [profiles]);
  const fullStats = useMemo(() => computeClassStatistics(activeProfiles), [activeProfiles]);

  const filteredProfiles = useMemo(() => {
    return activeProfiles.filter((p) => {
      if (originFilter === 'initial_37' && p.datasetOrigin !== 'initial_37') return false;
      if (originFilter === 'added_students' && !(p.datasetOrigin === 'added' && p.category === 'Siswa'))
        return false;
      if (originFilter === 'staff' && p.category === 'Siswa') return false;
      if (quadraFilter !== 'ALL' && p.typology.quadra !== quadraFilter) return false;
      return true;
    });
  }, [activeProfiles, originFilter, quadraFilter]);

  const filteredStats = useMemo(() => computeClassStatistics(filteredProfiles), [filteredProfiles]);

  return (
    <div className="space-y-8">
      {/* Top Overview */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-display font-bold text-slate-900">
              Dinamika Kelas &amp; Statistik Komposisi Otomatis
            </h1>
            <p className="text-sm text-slate-600 mt-1 max-w-3xl">
              Seluruh grafik dan tabel frekuensi dihitung secara dinamis dari basis data aktif.
              Perubahan tipe, penambahan siswa baru, guru, atau wali kelas langsung memperbarui seluruh statistik.
            </p>
          </div>

          <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 shrink-0">
            <select
              aria-label="Filter kelompok asal data"
              value={originFilter}
              onChange={(e) => setOriginFilter(e.target.value as typeof originFilter)}
              className="px-3 py-2 text-xs font-medium border border-slate-300 rounded-lg bg-white"
            >
              <option value="all">Semua Partisipan Aktif ({fullStats.totalActive})</option>
              <option value="initial_37">
                Dataset Awal 37 Siswa ({fullStats.initialStudentsCount})
              </option>
              <option value="added_students">
                Siswa Baru Ditambahkan ({fullStats.addedStudentsCount})
              </option>
              <option value="staff">
                Guru, Wali Kelas &amp; Staf ({fullStats.teachersAndStaffCount})
              </option>
            </select>

            <select
              aria-label="Filter Quadra"
              value={quadraFilter}
              onChange={(e) => setQuadraFilter(e.target.value as QuadraName | 'ALL')}
              className="px-3 py-2 text-xs font-medium border border-slate-300 rounded-lg bg-white"
            >
              <option value="ALL">Semua Quadra</option>
              <option value="Alpha">Alpha (Kuning)</option>
              <option value="Beta">Beta (Merah Muda)</option>
              <option value="Gamma">Gamma (Hijau)</option>
              <option value="Delta">Delta (Biru)</option>
            </select>
          </div>
        </div>

        {/* Summary KPI Strip */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-xs text-slate-500 block">Total Profil Ditampilkan</span>
            <span className="text-2xl font-display font-bold text-slate-900 tabular-nums">
              {filteredStats.totalActive}
            </span>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-xs text-slate-500 block">Dataset Awal Siswa</span>
            <span className="text-2xl font-display font-bold text-slate-900 tabular-nums">
              {fullStats.initialStudentsCount}
            </span>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-xs text-slate-500 block">Siswa Tambahan</span>
            <span className="text-2xl font-display font-bold text-slate-900 tabular-nums">
              {fullStats.addedStudentsCount}
            </span>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-xs text-slate-500 block">Guru, Wali Kelas &amp; Staf</span>
            <span className="text-2xl font-display font-bold text-slate-900 tabular-nums">
              {fullStats.teachersAndStaffCount}
            </span>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
          <h2 className="text-lg font-display font-semibold text-slate-900">
            Distribusi Quadra
          </h2>
          <QuadraDonutChart items={filteredStats.byQuadra} total={filteredStats.totalActive} />
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
          <h2 className="text-lg font-display font-semibold text-slate-900">
            Distribusi Tipe Socionics
          </h2>
          <HorizontalBarChart items={filteredStats.bySocionics} barColor="bg-indigo-600" />
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
          <h2 className="text-lg font-display font-semibold text-slate-900">
            Distribusi Enneagram (Varian + Inti)
          </h2>
          <HorizontalBarChart items={filteredStats.byEnneagram} barColor="bg-emerald-600" />
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
          <h2 className="text-lg font-display font-semibold text-slate-900">
            Distribusi Notasi Tipologi Jung (Konvensi Proyek)
          </h2>
          <HorizontalBarChart items={filteredStats.byJungian} barColor="bg-amber-600" />
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
          <h2 className="text-lg font-display font-semibold text-slate-900">
            Distribusi Psikosofi (L·V·E·F)
          </h2>
          <HorizontalBarChart items={filteredStats.byPsychosophy} barColor="bg-violet-600" />
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
          <h2 className="text-lg font-display font-semibold text-slate-900">
            Distribusi MBTI
          </h2>
          {filteredStats.byMbti.length > 0 ? (
            <HorizontalBarChart items={filteredStats.byMbti} barColor="bg-sky-600" />
          ) : (
            <p className="text-xs text-slate-500">
              Belum ada profil dalam irisan ini yang mengisi field MBTI.
            </p>
          )}
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
          <h2 className="text-lg font-display font-semibold text-slate-900">
            Distribusi Big Five / SLOAN
          </h2>
          {filteredStats.bySloan.length > 0 ? (
            <HorizontalBarChart items={filteredStats.bySloan} barColor="bg-teal-600" />
          ) : (
            <p className="text-xs text-slate-500">
              Belum ada profil dalam irisan ini yang mengisi kode SLOAN.
            </p>
          )}
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
          <h2 className="text-lg font-display font-semibold text-slate-900">
            Distribusi Temperamen
          </h2>
          {filteredStats.byTemperament.length > 0 ? (
            <HorizontalBarChart items={filteredStats.byTemperament} barColor="bg-rose-600" />
          ) : (
            <p className="text-xs text-slate-500">
              Belum ada profil dalam irisan ini yang mengisi Temperamen klasik/kombinasi.
            </p>
          )}
        </div>
      </div>

      {/* Member List Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="text-lg font-display font-semibold text-slate-900">
              Daftar Anggota dalam Tampilan ({filteredProfiles.length})
            </h2>
            <p className="text-xs text-slate-500">
              Membedakan data awal 37 siswa, siswa baru, dan guru/wali kelas secara transparan.
            </p>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs text-slate-600">
                <th className="py-2.5 px-4 font-semibold">Nama Tampilan</th>
                <th className="py-2.5 px-4 font-semibold">Kategori / Asal</th>
                <th className="py-2.5 px-4 font-semibold">Quadra</th>
                <th className="py-2.5 px-4 font-semibold">Socionics</th>
                <th className="py-2.5 px-4 font-semibold">Enneagram</th>
                <th className="py-2.5 px-4 font-semibold">Jung</th>
                <th className="py-2.5 px-4 font-semibold">Psikosofi</th>
                <th className="py-2.5 px-4 font-semibold">MBTI / SLOAN / Temp.</th>
                <th className="py-2.5 px-4 font-semibold">Status Data</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredProfiles.map((p) => {
                const qt = getQuadraTheme(p.typology.quadra);
                const typologyRestricted = p.hiddenFieldsForViewer?.includes('typology');
                const extraSummary = typologyRestricted
                  ? 'Dibatasi privasi'
                  : [
                      p.typology.mbti,
                      p.typology.sloanExtended || p.typology.sloanCode,
                      p.typology.temperament
                        ? p.typology.temperamentSecondary
                          ? `${p.typology.temperament}-${p.typology.temperamentSecondary}`
                          : p.typology.temperament
                        : '',
                    ]
                      .filter(Boolean)
                      .join(' · ') || '-';
                return (
                  <tr key={p.id} className="hover:bg-slate-50/80">
                    <td className="py-2.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <ProfileAvatar profile={p} size="sm" />
                        <span className="font-medium text-slate-900">{p.displayName}</span>
                      </div>
                    </td>
                    <td className="py-2.5 px-4 text-xs text-slate-600">
                      {p.category} ·{' '}
                      {p.datasetOrigin === 'initial_37' ? 'Dataset Awal' : 'Ditambahkan'}
                    </td>
                    <td className={`py-2.5 px-4 text-xs font-medium ${qt.text}`}>
                      {typologyRestricted ? 'Privat' : p.typology.quadra || '-'}
                    </td>
                    <td className="py-2.5 px-4 font-mono text-xs text-slate-800">
                      {typologyRestricted ? '-' : p.typology.socionics || '-'}
                    </td>
                    <td className="py-2.5 px-4 font-mono text-xs text-slate-800">
                      {typologyRestricted ? '-' : p.typology.enneagramRaw || '-'}
                    </td>
                    <td className="py-2.5 px-4 font-mono text-xs text-slate-800">
                      {typologyRestricted ? '-' : p.typology.jungian || '-'}
                    </td>
                    <td className="py-2.5 px-4 font-mono text-xs text-indigo-700">
                      {typologyRestricted ? '-' : p.typology.psychosophyCode || '-'}
                    </td>
                    <td className="py-2.5 px-4 font-mono text-xs text-slate-700">
                      {extraSummary}
                    </td>
                    <td className="py-2.5 px-4 text-xs text-slate-600">{p.typology.status}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Research Interpretation Distinction */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
        <div>
          <h2 className="text-lg font-display font-semibold text-slate-900">
            Statistik Deskriptif vs Temuan Empiris Kelas
          </h2>
          <p className="text-sm text-slate-600 mt-1">
            Grafik di atas adalah <strong>statistik deskriptif komposisi klasifikasi awal</strong>,
            bukan hasil survei perilaku yang sudah terjadi. Untuk meneliti dinamika nyata di kelas SMA,
            gunakan pertanyaan penelitian berikut bersama observasi dan refleksi siswa:
          </p>
        </div>
        <ol className="list-decimal pl-5 space-y-2 text-sm text-slate-700">
          {RESEARCH_QUESTIONS.map((q, i) => (
            <li key={i}>{q}</li>
          ))}
        </ol>
      </div>
    </div>
  );
};
