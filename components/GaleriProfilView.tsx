import React, { useMemo, useState } from 'react';
import { LayoutGrid, List, Search, X } from 'lucide-react';
import { generateCombinedTypologyProfile, parsePsychosophyPositions } from '../lib/psychosophy';
import type { Profile, ProfileCategory, QuadraName } from '../types/dynamap';
import { ProfileAvatar, getQuadraTheme } from './QuadraUI';

interface GaleriProfilViewProps {
  profiles: Profile[];
  onCompareProfile: (profileId: string) => void;
}

export const GaleriProfilView: React.FC<GaleriProfilViewProps> = ({
  profiles,
  onCompareProfile,
}) => {
  const [search, setSearch] = useState('');
  const [quadraFilter, setQuadraFilter] = useState<QuadraName | 'ALL'>('ALL');
  const [socionicsFilter, setSocionicsFilter] = useState<string>('ALL');
  const [enneagramFilter, setEnneagramFilter] = useState<string>('ALL');
  const [jungianFilter, setJungianFilter] = useState<string>('ALL');
  const [mbtiFilter, setMbtiFilter] = useState<string>('ALL');
  const [sloanFilter, setSloanFilter] = useState<string>('ALL');
  const [temperamentFilter, setTemperamentFilter] = useState<string>('ALL');
  const [categoryFilter, setCategoryFilter] = useState<ProfileCategory | 'ALL'>('ALL');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);

  const activeProfiles = useMemo(() => profiles.filter((p) => !p.archived), [profiles]);

  const socionicsOptions = useMemo(
    () =>
      Array.from(new Set(activeProfiles.map((p) => p.typology.socionics).filter(Boolean))).sort(),
    [activeProfiles]
  );
  const enneagramOptions = useMemo(
    () =>
      Array.from(new Set(activeProfiles.map((p) => p.typology.enneagramRaw).filter(Boolean))).sort(),
    [activeProfiles]
  );
  const jungianOptions = useMemo(
    () =>
      Array.from(new Set(activeProfiles.map((p) => p.typology.jungian).filter(Boolean))).sort(),
    [activeProfiles]
  );
  const mbtiOptions = useMemo(
    () =>
      Array.from(
        new Set(activeProfiles.map((p) => p.typology.mbti).filter((v): v is string => Boolean(v)))
      ).sort(),
    [activeProfiles]
  );
  const sloanOptions = useMemo(
    () =>
      Array.from(
        new Set(activeProfiles.map((p) => p.typology.sloanCode).filter((v): v is string => Boolean(v)))
      ).sort(),
    [activeProfiles]
  );
  const temperamentOptions = useMemo(
    () =>
      Array.from(
        new Set(activeProfiles.map((p) => p.typology.temperament).filter((v): v is NonNullable<typeof v> => Boolean(v)))
      ).sort(),
    [activeProfiles]
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return activeProfiles
      .filter((p) => {
        const hiddenTypology = p.hiddenFieldsForViewer?.includes('typology');
        if (q) {
          const hay = hiddenTypology
            ? `${p.displayName} ${p.category} ${p.affiliation}`.toLowerCase()
            : `${p.displayName} ${p.category} ${p.affiliation} ${p.typology.socionics} ${p.typology.enneagramRaw} ${p.typology.jungian} ${p.typology.mbti || ''} ${p.typology.mbtiCognitiveStack || ''} ${p.typology.sloanCode || ''} ${p.typology.sloanExtended || ''} ${p.typology.temperament || ''} ${p.typology.temperamentSecondary || ''}`.toLowerCase();
          if (!hay.includes(q)) return false;
        }
        if (quadraFilter !== 'ALL' && (hiddenTypology || p.typology.quadra !== quadraFilter)) return false;
        if (socionicsFilter !== 'ALL' && (hiddenTypology || p.typology.socionics !== socionicsFilter)) return false;
        if (enneagramFilter !== 'ALL' && (hiddenTypology || p.typology.enneagramRaw !== enneagramFilter)) return false;
        if (jungianFilter !== 'ALL' && (hiddenTypology || p.typology.jungian !== jungianFilter)) return false;
        if (mbtiFilter !== 'ALL' && (hiddenTypology || p.typology.mbti !== mbtiFilter)) return false;
        if (sloanFilter !== 'ALL' && (hiddenTypology || p.typology.sloanCode !== sloanFilter)) return false;
        if (temperamentFilter !== 'ALL' && (hiddenTypology || p.typology.temperament !== temperamentFilter)) return false;
        if (categoryFilter !== 'ALL' && p.category !== categoryFilter) return false;
        return true;
      })
      .sort((a, b) =>
        sortOrder === 'asc'
          ? a.displayName.localeCompare(b.displayName, 'id')
          : b.displayName.localeCompare(a.displayName, 'id')
      );
  }, [
    activeProfiles,
    search,
    quadraFilter,
    socionicsFilter,
    enneagramFilter,
    jungianFilter,
    mbtiFilter,
    sloanFilter,
    temperamentFilter,
    categoryFilter,
    sortOrder,
  ]);

  return (
    <div className="space-y-6">
      <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-display font-bold text-slate-900">
              Galeri Profil Partisipan ({filtered.length})
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              Menampilkan nama tampilan publik sesuai pengaturan privasi. Nama lengkap internal
              dilindungi dan hanya terlihat oleh Administrator, pemilik akun, atau bila diizinkan secara eksplisit.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                aria-label="Tampilan kisi"
                className={`p-1.5 rounded-md ${
                  viewMode === 'grid' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'
                }`}
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode('list')}
                aria-label="Tampilan daftar"
                className={`p-1.5 rounded-md ${
                  viewMode === 'list' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3">
          <div className="lg:col-span-3 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="search"
              aria-label="Cari nama tampilan atau tipe"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari nama tampilan, tipe, atau peran..."
              className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg"
            />
          </div>

          <select
            aria-label="Filter kategori peran"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value as ProfileCategory | 'ALL')}
            className="lg:col-span-2 px-2.5 py-2 text-xs border border-slate-300 rounded-lg bg-white"
          >
            <option value="ALL">Semua Kategori</option>
            <option value="Siswa">Siswa</option>
            <option value="Guru">Guru</option>
            <option value="Wali Kelas">Wali Kelas</option>
            <option value="Staf Sekolah">Staf Sekolah</option>
            <option value="Partisipan Lainnya">Partisipan Lainnya</option>
          </select>

          <select
            aria-label="Filter Quadra"
            value={quadraFilter}
            onChange={(e) => setQuadraFilter(e.target.value as QuadraName | 'ALL')}
            className="lg:col-span-2 px-2.5 py-2 text-xs border border-slate-300 rounded-lg bg-white"
          >
            <option value="ALL">Semua Quadra</option>
            <option value="Alpha">Alpha (Kuning)</option>
            <option value="Beta">Beta (Merah Muda)</option>
            <option value="Gamma">Gamma (Hijau)</option>
            <option value="Delta">Delta (Biru)</option>
          </select>

          <select
            aria-label="Filter Socionics"
            value={socionicsFilter}
            onChange={(e) => setSocionicsFilter(e.target.value)}
            className="lg:col-span-2 px-2.5 py-2 text-xs border border-slate-300 rounded-lg bg-white"
          >
            <option value="ALL">Semua Socionics</option>
            {socionicsOptions.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>

          <select
            aria-label="Filter Enneagram"
            value={enneagramFilter}
            onChange={(e) => setEnneagramFilter(e.target.value)}
            className="lg:col-span-2 px-2.5 py-2 text-xs border border-slate-300 rounded-lg bg-white"
          >
            <option value="ALL">Semua Enneagram</option>
            {enneagramOptions.map((en) => (
              <option key={en} value={en}>
                {en}
              </option>
            ))}
          </select>

          <select
            aria-label="Urutan abjad"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
            className="lg:col-span-1 px-2 py-2 text-xs border border-slate-300 rounded-lg bg-white"
          >
            <option value="asc">A–Z</option>
            <option value="desc">Z–A</option>
          </select>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <span>Jungian:</span>
            <select
              aria-label="Filter notasi Jung"
              value={jungianFilter}
              onChange={(e) => setJungianFilter(e.target.value)}
              className="px-2 py-1 border border-slate-300 rounded bg-white text-slate-700"
            >
              <option value="ALL">Semua</option>
              {jungianOptions.map((j) => (
                <option key={j} value={j}>
                  {j}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-1.5">
            <span>MBTI:</span>
            <select
              aria-label="Filter MBTI"
              value={mbtiFilter}
              onChange={(e) => setMbtiFilter(e.target.value)}
              className="px-2 py-1 border border-slate-300 rounded bg-white text-slate-700"
            >
              <option value="ALL">Semua</option>
              {mbtiOptions.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-1.5">
            <span>SLOAN:</span>
            <select
              aria-label="Filter SLOAN"
              value={sloanFilter}
              onChange={(e) => setSloanFilter(e.target.value)}
              className="px-2 py-1 border border-slate-300 rounded bg-white text-slate-700"
            >
              <option value="ALL">Semua</option>
              {sloanOptions.map((sl) => (
                <option key={sl} value={sl}>
                  {sl}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-1.5">
            <span>Temperamen:</span>
            <select
              aria-label="Filter Temperamen"
              value={temperamentFilter}
              onChange={(e) => setTemperamentFilter(e.target.value)}
              className="px-2 py-1 border border-slate-300 rounded bg-white text-slate-700"
            >
              <option value="ALL">Semua</option>
              {temperamentOptions.map((tp) => (
                <option key={tp} value={tp}>
                  {tp}
                </option>
              ))}
            </select>
          </div>
          {(search ||
            quadraFilter !== 'ALL' ||
            socionicsFilter !== 'ALL' ||
            enneagramFilter !== 'ALL' ||
            jungianFilter !== 'ALL' ||
            mbtiFilter !== 'ALL' ||
            sloanFilter !== 'ALL' ||
            temperamentFilter !== 'ALL' ||
            categoryFilter !== 'ALL') && (
            <button
              type="button"
              onClick={() => {
                setSearch('');
                setQuadraFilter('ALL');
                setSocionicsFilter('ALL');
                setEnneagramFilter('ALL');
                setJungianFilter('ALL');
                setMbtiFilter('ALL');
                setSloanFilter('ALL');
                setTemperamentFilter('ALL');
                setCategoryFilter('ALL');
              }}
              className="text-indigo-700 hover:underline whitespace-nowrap"
            >
              Reset semua filter
            </button>
          )}
        </div>
      </div>

      {/* Empty State */}
      {filtered.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-xl p-10 text-center space-y-2">
          <h2 className="text-base font-display font-semibold text-slate-900">
            Tidak Ada Profil yang Cocok
          </h2>
          <p className="text-sm text-slate-500">
            Ubah kata kunci pencarian atau setel ulang filter tipe untuk menampilkan daftar partisipan.
          </p>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((p) => {
            const qt = getQuadraTheme(p.typology.quadra);
            const hideTypology = p.hiddenFieldsForViewer?.includes('typology');
            return (
              <div
                key={p.id}
                className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col justify-between space-y-3"
              >
                <div className="flex items-start gap-3">
                  <ProfileAvatar profile={p} size="md" />
                  <div className="min-w-0">
                    <h2 className="text-base font-display font-semibold text-slate-900 truncate">
                      {p.displayName}
                    </h2>
                    <div className="text-xs text-slate-500 truncate">
                      {p.category} ·{' '}
                      {hideTypology ? (
                        <span className="text-slate-500">Tipologi Dibatasi Privasi</span>
                      ) : (
                        <span className={qt.text}>{p.typology.quadra || 'Belum diisi'}</span>
                      )}
                    </div>
                  </div>
                </div>

                {hideTypology ? (
                  <div className="text-xs text-slate-500 bg-slate-50 border border-slate-200/80 rounded-lg px-2.5 py-2">
                    Dibatasi oleh Privasi Pemilik Profil
                  </div>
                ) : (
                  <div className="text-xs font-mono text-slate-700 bg-slate-50 border border-slate-200/80 rounded-lg px-2.5 py-2 space-y-0.5">
                    <div>
                      {p.typology.socionics || '-'} · {p.typology.enneagramRaw || '-'} ·{' '}
                      {p.typology.jungian || '-'}
                      {p.typology.psychosophyCode ? ` · ${p.typology.psychosophyCode}` : ''}
                    </div>
                    {(p.typology.tritype || p.typology.instinctStacking) && (
                      <div className="text-[11px] text-indigo-700">
                        {p.typology.instinctStacking || ''} {p.typology.tritype ? `· ${p.typology.tritype}` : ''}
                      </div>
                    )}
                    {(p.typology.mbti || p.typology.sloanExtended || p.typology.sloanCode || p.typology.temperament) && (
                      <div className="text-[11px] text-slate-600 truncate">
                        {[
                          p.typology.mbti,
                          p.typology.sloanExtended || p.typology.sloanCode,
                          p.typology.temperament
                            ? p.typology.temperamentSecondary
                              ? `${p.typology.temperament}-${p.typology.temperamentSecondary}`
                              : p.typology.temperament
                            : '',
                        ]
                          .filter(Boolean)
                          .join(' · ')}
                      </div>
                    )}
                  </div>
                )}

                <div className="flex items-center justify-between gap-2 pt-1 text-xs">
                  <span className="text-slate-500 truncate">{p.typology.status}</span>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      aria-label={`Detail profil ${p.displayName}`}
                      onClick={() => setSelectedProfile(p)}
                      className="font-medium text-slate-700 hover:text-slate-900 hover:underline"
                    >
                      Detail
                    </button>
                    <button
                      type="button"
                      aria-label={`Bandingkan ${p.displayName}`}
                      onClick={() => onCompareProfile(p.id)}
                      className="font-medium text-indigo-700 hover:underline"
                    >
                      Bandingkan
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-xl overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs text-slate-600">
                <th className="py-2.5 px-4 font-semibold">Nama Tampilan</th>
                <th className="py-2.5 px-4 font-semibold">Kategori</th>
                <th className="py-2.5 px-4 font-semibold">Quadra</th>
                <th className="py-2.5 px-4 font-semibold">Socionics</th>
                <th className="py-2.5 px-4 font-semibold">Enneagram</th>
                <th className="py-2.5 px-4 font-semibold">Jung</th>
                <th className="py-2.5 px-4 font-semibold">Psikosofi</th>
                <th className="py-2.5 px-4 font-semibold">MBTI / SLOAN / Temp.</th>
                <th className="py-2.5 px-4 font-semibold text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filtered.map((p) => {
                const hideTypology = p.hiddenFieldsForViewer?.includes('typology');
                return (
                  <tr key={p.id} className="hover:bg-slate-50/80">
                    <td className="py-2.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <ProfileAvatar profile={p} size="sm" />
                        <span className="font-medium text-slate-900">{p.displayName}</span>
                      </div>
                    </td>
                    <td className="py-2.5 px-4 text-xs text-slate-600">{p.category}</td>
                    <td className={`py-2.5 px-4 text-xs font-medium ${getQuadraTheme(p.typology.quadra).text}`}>
                      {hideTypology ? 'Privasi' : p.typology.quadra || '-'}
                    </td>
                    <td className="py-2.5 px-4 font-mono text-xs">
                      {hideTypology ? '-' : p.typology.socionics || '-'}
                    </td>
                    <td className="py-2.5 px-4 font-mono text-xs">
                      {hideTypology ? '-' : p.typology.enneagramRaw || '-'}
                    </td>
                    <td className="py-2.5 px-4 font-mono text-xs">
                      {hideTypology ? '-' : p.typology.jungian || '-'}
                    </td>
                    <td className="py-2.5 px-4 font-mono text-xs text-indigo-700">
                      {hideTypology ? '-' : p.typology.psychosophyCode || '-'}
                    </td>
                    <td className="py-2.5 px-4 font-mono text-xs text-slate-600">
                      {hideTypology
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
                            .join(' · ') || '-'}
                    </td>
                    <td className="py-2.5 px-4 text-right text-xs space-x-3 whitespace-nowrap">
                      <button
                        type="button"
                        aria-label={`Detail profil ${p.displayName}`}
                        onClick={() => setSelectedProfile(p)}
                        className="text-slate-700 hover:underline"
                      >
                        Detail
                      </button>
                      <button
                        type="button"
                        aria-label={`Bandingkan ${p.displayName}`}
                        onClick={() => onCompareProfile(p.id)}
                        className="text-indigo-700 font-medium hover:underline"
                      >
                        Bandingkan
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Detail Modal */}
      {selectedProfile && (() => {
        const psyParsed = parsePsychosophyPositions(selectedProfile.typology.psychosophyCode);
        const combined = generateCombinedTypologyProfile(selectedProfile);
        return (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 overflow-y-auto"
            role="dialog"
            aria-modal="true"
            aria-labelledby="profile-detail-title"
          >
            <div className="w-full max-w-2xl bg-white border border-slate-200 rounded-xl shadow-xl p-6 space-y-4 my-6 max-h-[90vh] overflow-y-auto">
              <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-200">
                <div className="flex items-center gap-3.5">
                  <ProfileAvatar profile={selectedProfile} size="lg" />
                  <div>
                    <h2 id="profile-detail-title" className="text-xl font-display font-bold text-slate-900">
                      {selectedProfile.displayName}
                    </h2>
                    {selectedProfile.fullName && (
                      <p className="text-xs text-slate-600">{selectedProfile.fullName}</p>
                    )}
                    <p className="text-xs text-slate-500 mt-0.5">
                      {selectedProfile.category} · {selectedProfile.affiliation}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedProfile(null)}
                  aria-label="Tutup detail profil"
                  className="p-2 text-slate-500 hover:text-slate-900 rounded-lg hover:bg-slate-100"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {selectedProfile.hiddenFieldsForViewer?.includes('typology') ? (
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600">
                  <strong>Konfigurasi Tipologi Dibatasi oleh Privasi:</strong> Pemilik profil membatasi visibilitas data tipologinya bagi kategori pemirsa Anda.
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                    <span className="text-slate-500 block">Socionics &amp; Quadra</span>
                    <strong className="font-mono text-slate-900">
                      {selectedProfile.typology.socionics || '-'} ({selectedProfile.typology.quadra || '-'})
                    </strong>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                    <span className="text-slate-500 block">Enneagram &amp; Sayap</span>
                    <strong className="font-mono text-slate-900">
                      {selectedProfile.typology.enneagramRaw || '-'}{' '}
                      {selectedProfile.typology.enneagramWing ? `(${selectedProfile.typology.enneagramWing})` : ''}
                    </strong>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                    <span className="text-slate-500 block">Notasi Jung &amp; Stacking</span>
                    <strong className="font-mono text-slate-900">
                      {selectedProfile.typology.jungian || '-'}{' '}
                      {selectedProfile.typology.instinctStacking
                        ? `· ${selectedProfile.typology.instinctStacking}`
                        : ''}
                    </strong>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                    <span className="text-slate-500 block">Three Fix / Tritype</span>
                    <strong className="font-mono text-slate-900">
                      {selectedProfile.typology.tritype || selectedProfile.typology.threeFix || 'Belum diisi'}
                    </strong>
                  </div>
                  <div className="p-3 rounded-lg bg-indigo-50 border border-indigo-200 col-span-2">
                    <span className="text-indigo-800 block">Psikosofi (Psychosophy / AP)</span>
                    <strong className="font-mono text-indigo-950">
                      {psyParsed.valid
                        ? `${psyParsed.code}${psyParsed.typeSpec ? ` · “${psyParsed.typeSpec.afanasyevNickname}” (Afanasyev)` : ''}`
                        : 'Belum diisi'}
                    </strong>
                    <span className="block text-[11px] text-indigo-700 mt-0.5">
                      Keyakinan: {selectedProfile.typology.psychosophyConfidence || 'Belum Dipastikan'}
                      {selectedProfile.typology.psychosophyProvisional ? ' · Provisional' : ''}
                    </span>
                  </div>
                  {(selectedProfile.typology.mbti ||
                    selectedProfile.typology.mbtiCognitiveStack ||
                    selectedProfile.typology.sloanCode ||
                    selectedProfile.typology.sloanExtended ||
                    selectedProfile.typology.temperament) && (
                    <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 col-span-2 sm:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <div>
                        <span className="text-slate-500 block">MBTI &amp; Stack</span>
                        <strong className="font-mono text-slate-900">
                          {selectedProfile.typology.mbti || 'Belum diisi'}
                          {selectedProfile.typology.mbtiCognitiveStack
                            ? ` (${selectedProfile.typology.mbtiCognitiveStack})`
                            : ''}
                        </strong>
                      </div>
                      <div>
                        <span className="text-slate-500 block">SLOAN / Notasi Lanjutan</span>
                        <strong className="font-mono text-slate-900">
                          {selectedProfile.typology.sloanExtended ||
                            selectedProfile.typology.sloanCode ||
                            'Belum diisi'}
                        </strong>
                      </div>
                      <div>
                        <span className="text-slate-500 block">Temperamen</span>
                        <strong className="text-slate-900">
                          {selectedProfile.typology.temperament
                            ? selectedProfile.typology.temperamentSecondary
                              ? `${selectedProfile.typology.temperament}-${selectedProfile.typology.temperamentSecondary}`
                              : selectedProfile.typology.temperament
                            : 'Belum diisi'}
                        </strong>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Psychosophy Breakdown */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5 text-xs">
                <strong className="text-slate-900 block">
                  Bagian Psikosofi &amp; Sintesis Posisi
                </strong>
                {psyParsed.valid ? (
                  <>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono">
                      {psyParsed.placements.map((pl) => (
                        <div key={pl.code} className="p-2 rounded-lg bg-white border border-slate-200">
                          <div className="font-bold text-indigo-800">{pl.code}</div>
                          <div className="text-[11px] text-slate-600 font-sans">
                            {pl.aspectName.split('(')[0].trim()}
                          </div>
                        </div>
                      ))}
                    </div>
                    <p className="text-slate-700 leading-relaxed">{psyParsed.interactionSynthesis}</p>
                    {selectedProfile.typology.psychosophyNotes && (
                      <p className="text-slate-600 italic">
                        Catatan: {selectedProfile.typology.psychosophyNotes}
                      </p>
                    )}
                  </>
                ) : (
                  <p className="text-slate-600">
                    Profil ini belum mengisi kode Psikosofi 4 huruf (L, V, E, F). Pemilik akun atau Administrator dapat mengisinya secara opsional.
                  </p>
                )}
              </div>

              {/* Combined Multi-Lens Synthesis */}
              <div className="p-4 rounded-xl bg-indigo-50/60 border border-indigo-200 space-y-2 text-xs">
                <strong className="text-indigo-950 block">
                  Interpretasi Gabungan Lintas Kerangka (Lensa Terpisah)
                </strong>
                <ul className="list-disc pl-4 space-y-1 text-indigo-900">
                  {combined.integrationHypotheses.map((h, i) => (
                    <li key={i}>{h}</li>
                  ))}
                </ul>
                <p className="text-[11px] text-indigo-800 pt-1 border-t border-indigo-200/70">
                  {combined.frameworkBoundaryDisclaimer}
                </p>
              </div>

              <div className="text-xs text-slate-600 space-y-1.5">
                <p>
                  <strong>Status Data:</strong> {selectedProfile.typology.status} ({selectedProfile.typology.sourceNote})
                </p>
                {selectedProfile.bio && (
                  <p>
                    <strong>Deskripsi:</strong> {selectedProfile.bio}
                  </p>
                )}
                {selectedProfile.academicInterests.length > 0 && (
                  <p>
                    <strong>Minat Akademik:</strong> {selectedProfile.academicInterests.join(', ')}
                  </p>
                )}
                {selectedProfile.collaborationPreferences && (
                  <p>
                    <strong>Preferensi Kolaborasi:</strong> {selectedProfile.collaborationPreferences}
                  </p>
                )}
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    onCompareProfile(selectedProfile.id);
                    setSelectedProfile(null);
                  }}
                  className="px-4 py-2 text-xs font-medium text-white bg-indigo-700 hover:bg-indigo-800 rounded-lg"
                >
                  Bandingkan di Analisis Interpersonal
                </button>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
};
