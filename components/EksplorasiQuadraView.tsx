import React, { useState } from 'react';
import { INFORMATION_ELEMENTS, QUADRAS, SOCIONICS_TYPES } from '../data/socionicsData';
import type { ClassStatistics } from '../lib/typology';
import type { Profile, QuadraName, SocionicsCode } from '../types/dynamap';
import { ProfileAvatar, QuadraDonutChart, getQuadraTheme } from './QuadraUI';

interface EksplorasiQuadraViewProps {
  profiles: Profile[];
  stats: ClassStatistics;
  onCompareMembers?: (profileIds: string[]) => void;
}

const QUADRA_ORDER: QuadraName[] = ['Alpha', 'Beta', 'Gamma', 'Delta'];

export const EksplorasiQuadraView: React.FC<EksplorasiQuadraViewProps> = ({
  profiles,
  stats,
  onCompareMembers,
}) => {
  const [selectedQuadra, setSelectedQuadra] = useState<QuadraName>('Gamma');
  const [compareQuadra, setCompareQuadra] = useState<QuadraName>('Delta');
  const [typeFilter, setTypeFilter] = useState<SocionicsCode | 'ALL'>('ALL');

  const qSpec = QUADRAS[selectedQuadra];
  const theme = getQuadraTheme(selectedQuadra);
  const compSpec = QUADRAS[compareQuadra];
  const compTheme = getQuadraTheme(compareQuadra);

  const quadraMembers = profiles.filter(
    (p) =>
      !p.archived &&
      p.typology.quadra === selectedQuadra &&
      (typeFilter === 'ALL' || p.typology.socionics === typeFilter)
  );

  function handleSelectQuadra(q: QuadraName) {
    setSelectedQuadra(q);
    setTypeFilter('ALL');
  }

  return (
    <div className="space-y-8">
      {/* Header + Distribution Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-6 space-y-4">
          <div>
            <h1 className="text-2xl font-display font-bold text-slate-900">
              Eksplorasi Quadra Socionics
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              Quadra mengelompokkan empat tipe Socionics yang menghargai empat Elemen Informasi yang sama.
              Identitas warna DYNAMAP: Alpha (Kuning), Beta (Merah Muda), Gamma (Hijau), dan Delta (Biru).
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
            {QUADRA_ORDER.map((q) => {
              const spec = QUADRAS[q];
              const qt = getQuadraTheme(q);
              const qStat = stats.byQuadra.find((item) => item.label === q);
              const active = selectedQuadra === q;
              return (
                <button
                  key={q}
                  type="button"
                  onClick={() => handleSelectQuadra(q)}
                  className={`p-3.5 rounded-xl border text-left transition-all ${
                    active
                      ? `${qt.bgSoft} ${qt.border} ring-2 ring-indigo-500/30`
                      : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className={`text-sm font-display font-bold ${qt.text}`}>{q}</span>
                    <span
                      className="w-3 h-3 rounded-sm border border-black/10"
                      style={{ backgroundColor: qt.hex }}
                      aria-hidden="true"
                    />
                  </div>
                  <div className="text-[11px] text-slate-600 mt-0.5">{spec.colorName}</div>
                  <div className="mt-2 font-mono text-xs font-semibold text-slate-900 tabular-nums">
                    {qStat?.count ?? 0} anggota ({(qStat?.percentage ?? 0).toFixed(1)}%)
                  </div>
                </button>
              );
            })}
          </div>

          <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-600">
            <strong>Prinsip Penting:</strong> Satu Quadra yang sama tidak menjamin individu otomatis saling memahami, dan Quadra berbeda tidak berarti tidak cocok. Perbedaan dalam satu Quadra tetap muncul dari posisi Model A, Enneagram, insting, dan pengalaman pribadi.
          </div>
        </div>

        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-6 flex flex-col justify-center">
          <h2 className="text-base font-display font-semibold text-slate-900 mb-3">
            Distribusi Quadra Kelas Saat Ini
          </h2>
          <QuadraDonutChart items={stats.byQuadra} total={stats.totalActive} />
        </div>
      </div>

      {/* Selected Quadra Detailed Exploration */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-6">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 pb-5 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2 text-xs">
              <span
                className="w-3 h-3 rounded-sm border border-black/10"
                style={{ backgroundColor: theme.hex }}
                aria-hidden="true"
              />
              <span className={`font-semibold ${theme.text}`}>{qSpec.indonesianTitle}</span>
              <span aria-hidden="true" className="text-slate-400">·</span>
              <span className="font-mono text-slate-600">
                Tipe Terkait: {qSpec.types.join(', ')}
              </span>
            </div>
            <h2 className="mt-1.5 text-2xl font-display font-bold text-slate-900">
              Dinamika &amp; Nilai Quadra {qSpec.name}
            </h2>
            <p className="mt-2 text-sm text-slate-700 leading-relaxed max-w-3xl">{qSpec.summary}</p>
          </div>

          <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 text-xs space-y-1 shrink-0">
            <div className="font-semibold text-slate-900">Elemen Informasi Terkait</div>
            <div className="text-slate-700">
              Dihargai (Valued):{' '}
              <span className="font-mono font-semibold text-indigo-700">
                {qSpec.valuedElements.join(' · ')}
              </span>
            </div>
            <div className="text-slate-500">
              Tidak Diprioritaskan: <span className="font-mono">{qSpec.subduedElements.join(' · ')}</span>
            </div>
          </div>
        </div>

        {/* Valued Elements breakdown */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {qSpec.valuedElements.map((code) => {
            const el = INFORMATION_ELEMENTS[code];
            return (
              <div key={code} className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 text-xs space-y-1">
                <div className="font-mono font-bold text-indigo-700">
                  {el.code} · {el.name}
                </div>
                <p className="text-slate-600 leading-relaxed">{el.mainFocus}</p>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-slate-700">
          <div className="space-y-3">
            <div>
              <h3 className="font-semibold text-slate-900 mb-1">Nilai Inti menurut Teori Socionics</h3>
              <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm">
                {qSpec.coreValues.map((v, i) => (
                  <li key={i}>{v}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 mb-1">Kecenderungan Komunikasi Teoretis</h3>
              <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm">
                {qSpec.communicationTendencies.map((c, i) => (
                  <li key={i}>{c}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 mb-1">Perbedaan Antaranggota dalam Quadra</h3>
              <p className="text-xs sm:text-sm leading-relaxed">{qSpec.internalDifferences}</p>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <h3 className="font-semibold text-slate-900 mb-1">Potensi Kesalahpahaman</h3>
              <p className="text-xs sm:text-sm leading-relaxed">{qSpec.potentialMisunderstandings}</p>
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 mb-1">Miskonsepsi yang Sering Muncul</h3>
              <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm">
                {qSpec.commonMisconceptions.map((m, i) => (
                  <li key={i}>{m}</li>
                ))}
              </ul>
            </div>
            <div className="p-3.5 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-950">
              <strong>Batasan Interpretasi Berbasis Quadra:</strong> {qSpec.limitations}
            </div>
          </div>
        </div>

        {/* Member List with Type Filter */}
        <div className="pt-5 border-t border-slate-200 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h3 className="text-base font-display font-semibold text-slate-900">
                Daftar Anggota Quadra {qSpec.name} ({quadraMembers.length})
              </h3>
              <p className="text-xs text-slate-500">
                Filter berdasarkan salah satu dari 4 tipe Socionics di Quadra {qSpec.name}.
              </p>
            </div>
            <div className="flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() => setTypeFilter('ALL')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border ${
                  typeFilter === 'ALL'
                    ? 'bg-indigo-700 text-white border-indigo-700'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                Semua Tipe
              </button>
              {qSpec.types.map((tCode) => {
                const count = profiles.filter(
                  (p) => !p.archived && p.typology.quadra === selectedQuadra && p.typology.socionics === tCode
                ).length;
                return (
                  <button
                    key={tCode}
                    type="button"
                    onClick={() => setTypeFilter(tCode)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold border tabular-nums ${
                      typeFilter === tCode
                        ? 'bg-indigo-700 text-white border-indigo-700'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {tCode} ({count})
                  </button>
                );
              })}
            </div>
          </div>

          {quadraMembers.length === 0 ? (
            <div className="p-6 rounded-xl bg-slate-50 border border-slate-200 text-center text-sm text-slate-500">
              Belum ada anggota yang tercatat pada tipe {typeFilter === 'ALL' ? selectedQuadra : typeFilter} saat ini.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {quadraMembers.map((member) => (
                <div
                  key={member.id}
                  className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <ProfileAvatar profile={member} size="sm" />
                    <div className="min-w-0">
                      <div className="text-sm font-semibold text-slate-900 truncate">
                        {member.displayName}
                      </div>
                      <div className="text-xs font-mono text-slate-600 truncate">
                        {member.typology.socionics || '-'} · {member.typology.enneagramRaw || '-'} ·{' '}
                        {member.typology.jungian || '-'}
                      </div>
                    </div>
                  </div>
                  {onCompareMembers && (
                    <button
                      type="button"
                      onClick={() => onCompareMembers([member.id])}
                      className="text-xs font-medium text-indigo-700 hover:underline shrink-0 whitespace-nowrap"
                    >
                      Bandingkan
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Interactive Side-by-Side Quadra Comparison */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h2 className="text-lg font-display font-semibold text-slate-900">
              Perbandingan Edukatif Antar-Quadra
            </h2>
            <p className="text-xs text-slate-500">
              Bandingkan titik fokus informasi antar-Quadra tanpa menilai Quadra mana yang lebih baik.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-600">Bandingkan {selectedQuadra} dengan:</span>
            <select
              aria-label="Pilih Quadra pembanding"
              value={compareQuadra}
              onChange={(e) => setCompareQuadra(e.target.value as QuadraName)}
              className="px-3 py-1.5 text-xs font-medium border border-slate-300 rounded-lg bg-white"
            >
              {QUADRA_ORDER.map((q) => (
                <option key={q} value={q}>
                  Quadra {q} ({QUADRAS[q].colorName})
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {[
            { spec: qSpec, t: theme },
            { spec: compSpec, t: compTheme },
          ].map(({ spec, t }, index) => (
            <div key={`${spec.name}-${index}`} className={`p-5 rounded-xl border ${t.border} ${t.bgSoft} space-y-3`}>
              <div className="flex items-center justify-between">
                <h3 className={`text-base font-display font-bold ${t.text}`}>{spec.indonesianTitle}</h3>
                <span className="font-mono text-xs text-slate-700">{spec.valuedElements.join(', ')}</span>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed">{spec.summary}</p>
              <div className="text-xs text-slate-700">
                <strong>4 Tipe:</strong>{' '}
                {spec.types.map((tc) => `${tc} (${SOCIONICS_TYPES[tc].modelA[0]}/${SOCIONICS_TYPES[tc].modelA[1]})`).join(' · ')}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
