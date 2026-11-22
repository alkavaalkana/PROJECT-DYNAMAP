import React from 'react';
import {
  AlertCircle,
  Bookmark,
  BookmarkCheck,
  Building2,
  CheckCircle2,
  ExternalLink,
  GitCompare,
  GraduationCap,
  ShieldAlert,
  X,
} from 'lucide-react';
import type {
  AcademicGapReport,
  CareerRecord,
  UniversityInstitution,
  UniversityProgram,
} from '../types/dynamap';

interface MajorDetailModalProps {
  program: UniversityProgram;
  university: UniversityInstitution | null;
  gapReport: AcademicGapReport;
  relatedCareers: CareerRecord[];
  isBookmarked: boolean;
  onToggleBookmark: (programId: string) => void;
  onAddToCompare: (programId: string) => void;
  onClose: () => void;
}

export const MajorDetailModal: React.FC<MajorDetailModalProps> = ({
  program,
  university,
  gapReport,
  relatedCareers,
  isBookmarked,
  onToggleBookmark,
  onAddToCompare,
  onClose,
}) => {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-label={`Detail Program Studi ${program.name}`}
    >
      <div className="w-full max-w-4xl bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden my-6 max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-slate-200 flex items-start justify-between gap-4 bg-slate-50/70">
          <div className="space-y-1">
            <div className="text-xs font-semibold text-indigo-700">
              {university?.name || program.universityId} · {program.faculty} · {program.disciplineCluster}
            </div>
            <h2 className="text-xl font-display font-bold text-slate-900">
              {program.degree} {program.name}
            </h2>
            <div className="text-[11px] text-slate-600 flex flex-wrap items-center gap-x-3 gap-y-1">
              <span>Akreditasi: {program.accreditation || 'Unggul / Terakreditasi Resmi PTN'}</span>
              <span>·</span>
              <span>Tahun Data: {program.provenance.academicYear}</span>
              <span>·</span>
              <span>Status: {program.provenance.verificationStatus}</span>
              {program.tuitionInfo && (
                <>
                  <span>·</span>
                  <span>UKT: {program.tuitionInfo}</span>
                </>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => onToggleBookmark(program.id)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
                isBookmarked
                  ? 'bg-indigo-700 text-white border-indigo-700'
                  : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
              }`}
            >
              {isBookmarked ? <BookmarkCheck className="w-3.5 h-3.5" /> : <Bookmark className="w-3.5 h-3.5" />}
              {isBookmarked ? 'Tersimpan' : 'Simpan Prodi'}
            </button>
            <button
              type="button"
              onClick={onClose}
              aria-label="Tutup detail program studi"
              className="p-2 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-200/70"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs">
          {/* 1. Academic Identity & Concentrations */}
          <div className="space-y-3">
            <p className="text-sm text-slate-800 leading-relaxed">{program.description}</p>
            {program.concentrations && program.concentrations.length > 0 && (
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <strong className="text-slate-900 block mb-1">
                  Peminatan / Konsentrasi Internal yang Tersedia:
                </strong>
                <p className="text-slate-700">{program.concentrations.join(' · ')}</p>
              </div>
            )}
          </div>

          {/* 2. Curriculum & Core Courses */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-slate-200 space-y-2">
              <div className="font-display font-semibold text-sm text-slate-900">
                Fokus Kurikulum &amp; Mata Kuliah Inti
              </div>
              <ul className="list-disc pl-4 space-y-1 text-slate-700">
                {(program.coreCourses || program.curriculumFocus).map((c) => (
                  <li key={c}>{c}</li>
                ))}
              </ul>
              {program.practicalVsTheory && (
                <div className="pt-2 border-t border-slate-100 text-slate-600">
                  <strong>Keseimbangan Teori vs Praktik:</strong> {program.practicalVsTheory}
                </div>
              )}
            </div>

            <div className="p-4 rounded-xl border border-slate-200 space-y-2">
              <div className="font-display font-semibold text-sm text-slate-900">
                Kompetensi yang Dikembangkan &amp; Lingkungan Riset
              </div>
              {program.competencyRequirements ? (
                <div className="space-y-1 text-slate-700">
                  <div>
                    <strong>Analitis:</strong> {program.competencyRequirements.analytical}
                  </div>
                  <div>
                    <strong>Teknis:</strong> {program.competencyRequirements.technical}
                  </div>
                  <div>
                    <strong>Komunikasi:</strong> {program.competencyRequirements.communication}
                  </div>
                  <div>
                    <strong>Riset:</strong> {program.competencyRequirements.research}
                  </div>
                  <div>
                    <strong>Kreativitas:</strong> {program.competencyRequirements.creativity}
                  </div>
                  <div>
                    <strong>Kuantitatif:</strong> {program.competencyRequirements.quantitative}
                  </div>
                </div>
              ) : (
                <p className="text-slate-700">
                  Mengembangkan penalaran {program.thinkingPatterns.join(', ')} dalam lingkungan{' '}
                  {program.studyEnvironment}.
                </p>
              )}
              {program.researchOpportunities && program.researchOpportunities.length > 0 && (
                <div className="pt-2 border-t border-slate-100 text-slate-600">
                  <strong>Peluang Riset/Proyek:</strong> {program.researchOpportunities.join(' · ')}
                </div>
              )}
            </div>
          </div>

          {/* 3. Separation of Formal Eligibility vs Personal Gap & Bridging */}
          <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-200 pb-3">
              <div className="font-display font-bold text-sm text-slate-900">
                Analisis Kesenjangan 6 Bagian &amp; Pemisahan Syarat Admisi Formal
              </div>
              <span className="text-[11px] font-semibold text-indigo-800 bg-indigo-100 px-2.5 py-1 rounded">
                Status Kelayakan Jalur Formal: {gapReport.formalEligibilityStatus}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="p-3.5 rounded-lg bg-white border border-slate-200 space-y-1.5">
                <div className="font-semibold text-emerald-800 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  1. Pengetahuan &amp; Mapel SMA yang Sudah Mendukung
                </div>
                {gapReport.relevantExistingKnowledge.length > 0 ? (
                  <ul className="list-disc pl-4 space-y-1 text-slate-700">
                    {gapReport.relevantExistingKnowledge.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-slate-600">
                    Bekal penalaran logis, komunikasi tulisan, dan kedisiplinan belajar dari SMA tetap relevan menjadi pondasi awal.
                  </p>
                )}
              </div>

              <div className="p-3.5 rounded-lg bg-white border border-slate-200 space-y-1.5">
                <div className="font-semibold text-amber-900 flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5" />
                  2. Topik Tambahan yang Perlu Dipelajari (Bukan Larangan!)
                </div>
                {gapReport.additionalTopicsToLearn.length > 0 ? (
                  <ul className="list-disc pl-4 space-y-1 text-slate-700">
                    {gapReport.additionalTopicsToLearn.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-emerald-800">
                    Seluruh mapel utama sudah Anda tempuh di SMA; tinggal memperdalam aplikasinya.
                  </p>
                )}
              </div>

              <div className="p-3.5 rounded-lg bg-white border border-slate-200 space-y-1.5">
                <div className="font-semibold text-slate-900">
                  3. Catatan Prasyarat Akademik (Kuliah Awal)
                </div>
                <ul className="list-disc pl-4 space-y-1 text-slate-700">
                  {gapReport.prerequisiteNotes.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>

              <div className="p-3.5 rounded-lg bg-white border border-slate-200 space-y-1.5">
                <div className="font-semibold text-slate-900">
                  4. Kompetensi yang Akan Dibentuk Selama Kuliah
                </div>
                <ul className="list-disc pl-4 space-y-1 text-slate-700">
                  {gapReport.competenciesDevelopedAtUni.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="p-3.5 rounded-lg bg-white border border-slate-200 space-y-1.5">
              <div className="font-semibold text-indigo-900 flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5" />
                5. Persyaratan Masuk Universitas Resmi (SNBP · SNBT · Seleksi Mandiri)
              </div>
              <ul className="list-disc pl-4 space-y-1 text-slate-700">
                {gapReport.officialAdmissionRequirements.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="p-3.5 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-950 space-y-1">
              <div className="font-semibold">6. Rencana Jembatan Persiapan &amp; Perspektif Keterbukaan:</div>
              <ul className="list-disc pl-4 space-y-1">
                {gapReport.prepActionPlan.map((step, i) => (
                  <li key={i}>{step}</li>
                ))}
              </ul>
              <p className="pt-1 font-medium">{gapReport.encouragementNote}</p>
            </div>
          </div>

          {/* 4. Connected Careers */}
          {relatedCareers.length > 0 && (
            <div className="space-y-2">
              <div className="font-display font-semibold text-sm text-slate-900">
                Kemungkinan Karier Terkait ({relatedCareers.length})
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {relatedCareers.map((c) => (
                  <div key={c.id} className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                    <div className="font-semibold text-slate-900">{c.title}</div>
                    <p className="text-slate-600 mt-0.5 line-clamp-2">{c.summary}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex flex-wrap items-center justify-between gap-3 text-xs">
          <a
            href={program.provenance.officialUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 text-indigo-700 hover:underline font-medium"
          >
            <Building2 className="w-3.5 h-3.5" />
            Buka Sumber Resmi PTN ({program.provenance.sourceTitle})
            <ExternalLink className="w-3 h-3" />
          </a>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                onAddToCompare(program.id);
                onClose();
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 font-medium text-indigo-800 bg-indigo-50 hover:bg-indigo-100 rounded-lg"
            >
              <GitCompare className="w-3.5 h-3.5" />
              Masukkan ke Tabel Perbandingan
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 font-medium text-white bg-slate-900 hover:bg-slate-800 rounded-lg"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
