import React, { useState } from 'react';
import {
  Bookmark,
  BookmarkCheck,
  Briefcase,
  ChevronDown,
  ChevronUp,
  Compass,
  ExternalLink,
  GitCompare,
  GraduationCap,
  HelpCircle,
  Layers,
  Save,
} from 'lucide-react';
import type {
  Account,
  CareerRecord,
  ExplorationCatalogConfig,
  HybridPersonalAnalysis,
  Profile,
  ThreeLayerMajorRecommendation,
  ThreeLayerRecommendationBundle,
  UniversityProgram,
  UserExplorationData,
} from '../types/dynamap';

interface PersonalizedResultsViewProps {
  account: Account | null;
  activeProfile: Profile | null;
  explorationConfig: ExplorationCatalogConfig;
  specLabel: string;
  analysis: HybridPersonalAnalysis;
  bundle: ThreeLayerRecommendationBundle;
  rankedCareers: { career: CareerRecord; connectionReasons: string[] }[];
  bookmarkedProgramIds: string[];
  bookmarkedCareerIds: string[];
  reflectionAnswers: Record<string, string>;
  onToggleBookmarkProgram: (programId: string) => void;
  onToggleBookmarkCareer: (careerId: string) => void;
  onChangeReflectionAnswer: (promptIdx: number, answer: string) => void;
  onSaveReflections: () => Promise<void>;
  onInspectMajor: (program: UniversityProgram) => void;
  onCompareProgram: (programId: string) => void;
  onInspectCareer?: (careerId: string) => void;
  onEditExploration: () => void;
}

const RecommendationCard: React.FC<{
  rec: ThreeLayerMajorRecommendation;
  isBookmarked: boolean;
  onToggleBookmark: (id: string) => void;
  onInspectMajor: (prog: UniversityProgram) => void;
  onCompareProgram: (id: string) => void;
}> = ({ rec, isBookmarked, onToggleBookmark, onInspectMajor, onCompareProgram }) => {
  const [showTrail, setShowTrail] = useState(false);

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-3 text-xs">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-[11px] font-semibold text-indigo-700">
            {rec.university.shortName} · {rec.program.disciplineCluster}
          </div>
          <h4 className="text-base font-display font-bold text-slate-900 mt-0.5">
            {rec.program.degree} {rec.program.name}
          </h4>
          <div className="text-[11px] text-slate-500 mt-0.5">
            {rec.program.faculty} · Akreditasi: {rec.program.accreditation || 'Terverifikasi PTN'}
          </div>
        </div>
        <button
          type="button"
          onClick={() => onToggleBookmark(rec.program.id)}
          aria-label={`Simpan prodi ${rec.program.name}`}
          className={`p-2 rounded-lg border shrink-0 transition-colors ${
            isBookmarked
              ? 'bg-indigo-700 text-white border-indigo-700'
              : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
          }`}
        >
          {isBookmarked ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
        </button>
      </div>

      {/* Standard 7 items or Unexpected 5-part explanation */}
      <div className="space-y-2 text-slate-700 leading-relaxed">
        <div>
          <strong>1. Mengapa Masuk Daftar Ini:</strong> {rec.whyIncluded}
        </div>

        {rec.layer === 'Kemungkinan Tak Terduga' && rec.unexpectedWhyNotObvious && (
          <div className="p-3 rounded-lg bg-amber-50/70 border border-amber-200 space-y-1.5 text-slate-800">
            <div>
              <strong>Mengapa Belum Terpikirkan Awalnya:</strong> {rec.unexpectedWhyNotObvious}
            </div>
            {rec.unexpectedConnectionPoints && rec.unexpectedConnectionPoints.length > 0 && (
              <div>
                <strong>Titik Sambung dengan Pola Diri Anda:</strong>{' '}
                {rec.unexpectedConnectionPoints.join(' ')}
              </div>
            )}
            {rec.unexpectedNewKnowledgeNeeded && rec.unexpectedNewKnowledgeNeeded.length > 0 && (
              <div>
                <strong>Pengetahuan Baru yang Perlu Dijembatani:</strong>{' '}
                {rec.unexpectedNewKnowledgeNeeded.join(' · ')}
              </div>
            )}
            {rec.unexpectedWhyWorthExploring && (
              <div>
                <strong>Alasan Tetap Layak Dieksplorasi:</strong> {rec.unexpectedWhyWorthExploring}
              </div>
            )}
          </div>
        )}

        <div>
          <strong>2. Minat &amp; Aktivitas Terkait:</strong> {rec.relevantInterests.join(' · ')}
        </div>
        <div>
          <strong>3. Bekal Akademik Relevan:</strong> {rec.relevantAcademicExperiences.join(' ')}
        </div>
        <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
          <strong>4. Perspektif Tipologi (Interpretatif):</strong> {rec.typologicalPerspectives}
        </div>
        <div>
          <strong>5. Kompetensi Utama Kuliah:</strong> {rec.importantCompetencies.join(' · ')}
        </div>
        <div>
          <strong>6. Tantangan Potensial &amp; Penyiapan:</strong> {rec.potentialChallenges.join(' ')}
        </div>
        <div>
          <strong>7. Pertanyaan untuk Diselidiki Lebih Lanjut:</strong>{' '}
          {rec.whatToInvestigate.join(' · ')}
        </div>
      </div>

      {/* Collapsible Reasoning Trail (Section 13) */}
      <div className="pt-2 border-t border-slate-100">
        <button
          type="button"
          onClick={() => setShowTrail((v) => !v)}
          className="inline-flex items-center gap-1.5 text-indigo-700 font-semibold hover:underline"
        >
          <HelpCircle className="w-3.5 h-3.5" />
          {showTrail ? 'Tutup Jejak Penalaran (Reasoning Trail)' : 'Lihat Jejak Penalaran & Ketidakpastian'}
          {showTrail ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>

        {showTrail && (
          <div className="mt-2.5 p-3.5 rounded-lg bg-slate-50 border border-slate-200 space-y-2 text-[11px] text-slate-700">
            <div>
              <strong className="text-slate-900">Bukti Langsung Pengguna:</strong>{' '}
              {rec.reasoningTrail.directUserEvidence.join(' ')}
            </div>
            <div>
              <strong className="text-slate-900">Bukti Latar Akademik:</strong>{' '}
              {rec.reasoningTrail.academicEvidence.join(' ')}
            </div>
            <div>
              <strong className="text-slate-900">Interpretasi Tipologi:</strong>{' '}
              {rec.reasoningTrail.typologyInterpretation.join(' ')}
            </div>
            <div>
              <strong className="text-slate-900">Relasi yang Disimpulkan:</strong>{' '}
              {rec.reasoningTrail.inferredRelationship.join(' ')}
            </div>
            <div>
              <strong className="text-amber-900">Asumsi yang Masih Perlu Diuji:</strong>{' '}
              {rec.reasoningTrail.uncertainAssumptions.join(' ')}
            </div>
            <div>
              <strong className="text-indigo-900">Informasi Tambahan yang Dibutuhkan:</strong>{' '}
              {rec.reasoningTrail.additionalInfoNeeded.join(' ')}
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100">
        <button
          type="button"
          onClick={() => onInspectMajor(rec.program)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 font-medium text-white bg-indigo-700 hover:bg-indigo-800 rounded-lg"
        >
          <GraduationCap className="w-3.5 h-3.5" />
          Detail Prodi &amp; Analisis Gap 6 Bagian
        </button>
        <button
          type="button"
          onClick={() => onCompareProgram(rec.program.id)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg"
        >
          <GitCompare className="w-3.5 h-3.5" />
          Bandingkan Prodi
        </button>
      </div>
    </div>
  );
};

export const PersonalizedResultsView: React.FC<PersonalizedResultsViewProps> = ({
  account,
  activeProfile,
  explorationConfig,
  specLabel,
  analysis,
  bundle,
  rankedCareers,
  bookmarkedProgramIds,
  bookmarkedCareerIds,
  reflectionAnswers,
  onToggleBookmarkProgram,
  onToggleBookmarkCareer,
  onChangeReflectionAnswer,
  onSaveReflections,
  onInspectMajor,
  onCompareProgram,
  onInspectCareer,
  onEditExploration,
}) => {
  const [savedNotice, setSavedNotice] = useState('');

  async function handleSaveReflectionsClick() {
    await onSaveReflections();
    setSavedNotice('Jawaban refleksi pribadi berhasil disimpan.');
  }

  return (
    <div className="space-y-6 text-xs">
      {/* SECTION A: PERSONAL EXPLORATION SUMMARY */}
      <section className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 border-b border-slate-200 pb-4">
          <div>
            <div className="text-[11px] font-semibold text-indigo-700">
              BAGIAN A — RINGKASAN EKSPLORASI PRIBADI
            </div>
            <h2 className="text-xl font-display font-bold text-slate-900 mt-0.5">
              Laporan Analisis Terpadu: {activeProfile?.displayName || 'Penjelajah DYNAMAP'}
            </h2>
            <p className="text-slate-600 mt-1 leading-relaxed max-w-3xl">
              {bundle.explanatoryNote}
            </p>
          </div>
          <button
            type="button"
            onClick={onEditExploration}
            className="px-3.5 py-2 font-medium text-indigo-800 bg-indigo-50 hover:bg-indigo-100 rounded-lg shrink-0"
          >
            Sunting Input Eksplorasi
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
            <div className="font-semibold text-slate-900">Latar Akademik SMA</div>
            <p className="text-slate-700">{analysis.layerThreeAcademicBackground.studiedSummary}</p>
            <p className="text-slate-600">
              <strong>Peminatan:</strong> {specLabel}
            </p>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
            <div className="font-semibold text-slate-900">Sorotan Minat &amp; Rumpun Pilihan</div>
            <p className="text-slate-700">
              {analysis.layerTwoPreferences.highlightInterests.length > 0
                ? analysis.layerTwoPreferences.highlightInterests.slice(0, 4).join(' · ')
                : 'Belum ada minat spesifik terpilih; melengkapi Langkah 2 akan mempertajam hasil.'}
            </p>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
            <div className="font-semibold text-slate-900">Kognitif, Belajar &amp; Kerja</div>
            <p className="text-slate-700 line-clamp-4">
              {analysis.layerTwoPreferences.summaryPoints.slice(0, 3).join(' ')}
            </p>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
            <div className="font-semibold text-slate-900">Tipologi &amp; Daftar Tersimpan</div>
            <p className="text-slate-700">
              {analysis.layerOneTypologies
                .filter((t) => t.available)
                .map((t) => t.codeOrStatus.split('·')[0].trim())
                .slice(0, 3)
                .join(' · ') || 'Mode Bebas Tipologi'}
            </p>
            <p className="text-slate-600">
              {bookmarkedProgramIds.length} Prodi PTN · {bookmarkedCareerIds.length} Jalur Karier tersimpan
            </p>
          </div>
        </div>
      </section>

      {/* SECTION B: INTEGRATED ANALYSIS (LAYERS 1 TO 4) */}
      <section className="bg-white border border-slate-200 rounded-xl p-6 space-y-5">
        <div className="border-b border-slate-200 pb-3">
          <div className="text-[11px] font-semibold text-indigo-700">
            BAGIAN B — ANALISIS TERPADU (HYBRID PERSONAL ANALYSIS ENGINE)
          </div>
          <h3 className="text-lg font-display font-bold text-slate-900 mt-0.5">
            Lapisan 1: Analisis Kerangka Tipologi Secara Independen
          </h3>
          <p className="text-slate-600 mt-0.5">
            Setiap sistem kepribadian dianalisis menurut teori aslinya secara terpisah agar tidak mencampuradukkan istilah lintas kerangka.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {analysis.layerOneTypologies.map((sec) => (
            <div
              key={sec.framework}
              className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <div className="font-bold text-slate-900">{sec.framework}</div>
                  {sec.isProvisional && (
                    <span className="text-[10px] font-semibold text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
                      Provisional
                    </span>
                  )}
                </div>
                <div className="text-indigo-700 font-semibold">{sec.codeOrStatus}</div>
                <ul className="list-disc pl-4 space-y-1 text-slate-700">
                  {sec.highlights.map((h, idx) => (
                    <li key={idx}>{h}</li>
                  ))}
                </ul>
              </div>
              <div className="pt-2 border-t border-slate-200 text-[11px] text-slate-500">
                {sec.boundaryDisclaimer}
              </div>
            </div>
          ))}
        </div>

        {/* Layer 2 & Layer 4 Synthesis */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 pt-2">
          <div className="p-5 rounded-xl border border-slate-200 space-y-3">
            <h4 className="font-display font-bold text-sm text-slate-900">
              Lapisan 2: Pola Preferensi Individu &amp; Paradoks Nilai vs Minat
            </h4>
            <ul className="list-disc pl-4 space-y-1.5 text-slate-700">
              {analysis.layerTwoPreferences.summaryPoints.map((pt, i) => (
                <li key={i}>{pt}</li>
              ))}
            </ul>
            {analysis.layerTwoPreferences.paradoxNotes.length > 0 && (
              <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 space-y-1 text-amber-950">
                {analysis.layerTwoPreferences.paradoxNotes.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            )}
          </div>

          <div className="p-5 rounded-xl border border-slate-200 space-y-3">
            <h4 className="font-display font-bold text-sm text-slate-900">
              Lapisan 4: Sintesis Hibrida (Konvergensi, Perbedaan &amp; Peluang)
            </h4>
            <div className="space-y-2 text-slate-700">
              <div>
                <strong className="text-slate-900">1. Titik Temu Utama:</strong>{' '}
                {analysis.layerFourSynthesis.convergences.join(' ')}
              </div>
              <div>
                <strong className="text-slate-900">2. Dukungan Latar Akademik:</strong>{' '}
                {analysis.layerFourSynthesis.academicSupportingInterests.join(' ')}
              </div>
              <div>
                <strong className="text-indigo-900">3. Perbedaan Bermakna (Dipertahankan Keduanya):</strong>{' '}
                {analysis.layerFourSynthesis.meaningfulDivergences.join(' ')}
              </div>
              <div>
                <strong className="text-slate-900">4. Bidang Multi-Dimensi:</strong>{' '}
                {analysis.layerFourSynthesis.multiDimensionalFields.join(' ')}
              </div>
              <div>
                <strong className="text-slate-900">5. Bidang Beririsan Rendah yang Tetap Layak Dijajaki:</strong>{' '}
                {analysis.layerFourSynthesis.lowOverlapWorthExploring.join(' ')}
              </div>
              <div>
                <strong className="text-amber-900">6. Informasi Tambahan yang Masih Perlu Diperjelas:</strong>{' '}
                {analysis.layerFourSynthesis.informationGaps.join(' ')}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION C: RECOMMENDED EXPLORATION */}
      <section className="space-y-3">
        <div className="bg-white border border-slate-200 rounded-xl p-5 flex items-center justify-between gap-3">
          <div>
            <div className="text-[11px] font-semibold text-indigo-700">
              BAGIAN C — LAPISAN 1: EKSPLORASI DIREKOMENDASIKAN
            </div>
            <h3 className="text-lg font-display font-bold text-slate-900">
              Program Studi dengan Pertemuan Sinyal Terkuat Saat Ini ({bundle.recommended.length})
            </h3>
          </div>
          <Compass className="w-5 h-5 text-indigo-700 shrink-0" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {bundle.recommended.map((rec) => (
            <RecommendationCard
              key={rec.program.id}
              rec={rec}
              isBookmarked={bookmarkedProgramIds.includes(rec.program.id)}
              onToggleBookmark={onToggleBookmarkProgram}
              onInspectMajor={onInspectMajor}
              onCompareProgram={onCompareProgram}
            />
          ))}
        </div>
      </section>

      {/* SECTION D: ALTERNATIVE EXPLORATION */}
      <section className="space-y-3">
        <div className="bg-white border border-slate-200 rounded-xl p-5 flex items-center justify-between gap-3">
          <div>
            <div className="text-[11px] font-semibold text-sky-700">
              BAGIAN D — LAPISAN 2: EKSPLORASI ALTERNATIF
            </div>
            <h3 className="text-lg font-display font-bold text-slate-900">
              Pendekatan Interdisipliner &amp; Jalur Penerapan Berbeda ({bundle.alternative.length})
            </h3>
          </div>
          <Layers className="w-5 h-5 text-sky-700 shrink-0" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {bundle.alternative.map((rec) => (
            <RecommendationCard
              key={rec.program.id}
              rec={rec}
              isBookmarked={bookmarkedProgramIds.includes(rec.program.id)}
              onToggleBookmark={onToggleBookmarkProgram}
              onInspectMajor={onInspectMajor}
              onCompareProgram={onCompareProgram}
            />
          ))}
        </div>
      </section>

      {/* SECTION E: UNEXPECTED POSSIBILITIES */}
      <section className="space-y-3">
        <div className="bg-white border border-slate-200 rounded-xl p-5 flex items-center justify-between gap-3">
          <div>
            <div className="text-[11px] font-semibold text-amber-800">
              BAGIAN E — LAPISAN 3: KEMUNGKINAN TAK TERDUGA (LINTAS PEMINATAN SMA)
            </div>
            <h3 className="text-lg font-display font-bold text-slate-900">
              Disiplin Bermakna di Luar Paket Mapel Utama Anda ({bundle.unexpected.length})
            </h3>
            <p className="text-slate-600 mt-0.5">
              Mengenalkan bidang ilmu (seperti Psikologi, Hukum, Filsafat, Sosiologi, Komunikasi, Bioteknologi, atau Desain) yang tetap layak dijajaki meski beberapa mapel pengantar belum diambil di SMA.
            </p>
          </div>
          <Compass className="w-5 h-5 text-amber-700 shrink-0" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {bundle.unexpected.map((rec) => (
            <RecommendationCard
              key={rec.program.id}
              rec={rec}
              isBookmarked={bookmarkedProgramIds.includes(rec.program.id)}
              onToggleBookmark={onToggleBookmarkProgram}
              onInspectMajor={onInspectMajor}
              onCompareProgram={onCompareProgram}
            />
          ))}
        </div>
      </section>

      {/* SECTION F & G: ACADEMIC PREPARATION & PTN PATHWAYS */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-3">
          <div className="text-[11px] font-semibold text-indigo-700">
            BAGIAN F — PERSIAPAN AKADEMIK &amp; JEMBATAN MATERI
          </div>
          <h3 className="text-base font-display font-bold text-slate-900">
            Kekuatan &amp; Area Pendampingan Lintas Disiplin
          </h3>
          <div className="space-y-2 text-slate-700">
            <div>
              <strong>Kekuatan Akademik Saat Ini:</strong>
              <ul className="list-disc pl-4 mt-1 space-y-1">
                {(analysis.layerThreeAcademicBackground.strengthHighlights.length > 0
                  ? analysis.layerThreeAcademicBackground.strengthHighlights
                  : ['Penalaran umum dan literasi lintas mata pelajaran SMA tetap dapat dimanfaatkan.']
                ).map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>
            <div>
              <strong>Area yang Perlu Disiapkan Bertahap:</strong>
              <ul className="list-disc pl-4 mt-1 space-y-1">
                {analysis.layerThreeAcademicBackground.prepAreas.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
          <div className="text-[11px] font-semibold text-indigo-700">
            BAGIAN G — PELUANG UNIVERSITAS &amp; JALUR MASUK PTN
          </div>
          <h3 className="text-base font-display font-bold text-slate-900">
            Membedakan Minat Eksplorasi dengan Syarat Seleksi Formal
          </h3>
          <p className="text-slate-700 leading-relaxed">
            Setiap PTN menetapkan ketentuan mapel pendukung SNBP, komposisi tes UTBK-SNBT (TPS &amp; Literasi yang terbuka lintas rumpun), serta ujian mandiri masing-masing. Di bawah ini ringkasan jalur resmi dari peluang PTN teratas pada hasil Anda:
          </p>

          <div className="space-y-2.5">
            {[
              ...bundle.recommended.slice(0, 2),
              ...bundle.alternative.slice(0, 2),
              ...bundle.unexpected.slice(0, 2),
            ].map((rec) => {
              const routes = rec.program.availableRoutes ||
                rec.university.admissionRoutes || ['SNBP', 'SNBT', 'Seleksi Mandiri'];
              return (
                <div
                  key={`ptn-opp-${rec.program.id}`}
                  className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5"
                >
                  <div className="space-y-0.5 min-w-0">
                    <div className="font-semibold text-slate-900">
                      {rec.university.shortName} — {rec.program.degree} {rec.program.name}
                    </div>
                    <div className="text-[11px] text-slate-600">
                      {rec.program.faculty} · Jalur: {routes.join(' / ')} ·{' '}
                      {rec.program.provenance.verificationStatus} ({rec.program.provenance.academicYear})
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => onInspectMajor(rec.program)}
                      className="px-2.5 py-1.5 text-[11px] font-medium text-indigo-800 bg-indigo-50 hover:bg-indigo-100 rounded-lg border border-indigo-200"
                    >
                      Cek Gap &amp; Syarat
                    </button>
                    <a
                      href={rec.program.provenance.officialUrl || rec.university.admissionPortalUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 text-[11px] font-medium text-slate-700 bg-white hover:bg-slate-100 rounded-lg border border-slate-200"
                    >
                      Portal
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-slate-700">
            <strong>Kaidah Verifikasi:</strong> Bila suatu prodi mensyaratkan mapel pendukung tertentu pada jalur SNBP, jalur <strong>UTBK-SNBT</strong> dan <strong>Seleksi Mandiri</strong> tetap sering memberi ruang lintas peminatan—periksa selalu aturan tahun ajaran berjalan di portal resmi SNPMB/PTN tujuan.
          </div>
        </div>
      </section>

      {/* SECTION H: CAREER POSSIBILITIES */}
      <section className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
        <div className="flex items-center justify-between gap-3 border-b border-slate-200 pb-3">
          <div>
            <div className="text-[11px] font-semibold text-indigo-700">
              BAGIAN H — KEMUNGKINAN KARIER TERINTEGRASI (MULTI-JALUR)
            </div>
            <h3 className="text-lg font-display font-bold text-slate-900">
              Profesi Selaras dengan Preferensi Kerja &amp; Rekomendasi Studi ({rankedCareers.slice(0, 6).length} Pilihan Awal)
            </h3>
          </div>
          <Briefcase className="w-5 h-5 text-indigo-700 shrink-0" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {rankedCareers.slice(0, 6).map(({ career, connectionReasons }) => {
            const saved = bookmarkedCareerIds.includes(career.id);
            return (
              <div key={career.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-2.5 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="text-[11px] font-semibold text-indigo-700">{career.cluster}</div>
                      <h4 className="text-sm font-display font-bold text-slate-900">{career.title}</h4>
                    </div>
                    <button
                      type="button"
                      onClick={() => onToggleBookmarkCareer(career.id)}
                      aria-label={`Simpan karier ${career.title}`}
                      className={`p-1.5 rounded-lg border shrink-0 ${
                        saved
                          ? 'bg-indigo-700 text-white border-indigo-700'
                          : 'bg-white text-slate-600 border-slate-200'
                      }`}
                    >
                      {saved ? <BookmarkCheck className="w-3.5 h-3.5" /> : <Bookmark className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                  <p className="text-slate-700 line-clamp-3">{career.summary}</p>
                  <div className="text-[11px] text-slate-600">
                    <strong>Koneksi Profil Anda:</strong> {connectionReasons.join(' ')}
                  </div>
                  {career.certificationOrLicensing && (
                    <div className="text-[11px] text-slate-700">
                      <strong>Sertifikasi / Profesi:</strong> {career.certificationOrLicensing}
                    </div>
                  )}
                </div>
                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-200/80">
                  {onInspectCareer && (
                    <button
                      type="button"
                      onClick={() => onInspectCareer(career.id)}
                      className="text-[11px] font-semibold text-indigo-700 hover:underline"
                    >
                      Buka Detail di Penjelajah Karier →
                    </button>
                  )}
                  <a
                    href={career.provenance.officialUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-600 hover:text-indigo-700 hover:underline"
                  >
                    Rujukan Standar Profesi
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* SECTION I: PERSONAL REFLECTION & SAVED LIST */}
      <section className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-200 pb-3">
          <div>
            <div className="text-[11px] font-semibold text-indigo-700">
              BAGIAN I — REFLEKSI PRIBADI &amp; TINDAK LANJUT EKSPLORASI
            </div>
            <h3 className="text-lg font-display font-bold text-slate-900">
              Ruang Refleksi Terbuka (Tanpa Keharusan Memilih Satu Jurusan Tunggal)
            </h3>
          </div>
          <button
            type="button"
            onClick={handleSaveReflectionsClick}
            className="inline-flex items-center gap-1.5 px-4 py-2 font-medium text-white bg-indigo-700 hover:bg-indigo-800 rounded-lg shrink-0"
          >
            <Save className="w-3.5 h-3.5" />
            {account ? 'Simpan Refleksi Pribadi' : 'Masuk untuk Menyimpan Permanen'}
          </button>
        </div>

        {savedNotice && (
          <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900">
            {savedNotice}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {explorationConfig.reflectionPrompts.map((prompt, idx) => (
            <div key={idx} className="space-y-1.5">
              <label className="block font-semibold text-slate-800 leading-snug">
                {idx + 1}. {prompt}
              </label>
              <textarea
                rows={3}
                value={reflectionAnswers[String(idx)] || ''}
                onChange={(e) => onChangeReflectionAnswer(idx, e.target.value)}
                placeholder="Tuliskan pemikiran jujur Anda di sini..."
                className="w-full px-3 py-2 border border-slate-300 rounded-lg"
              />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
