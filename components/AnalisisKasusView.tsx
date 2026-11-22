import React, { useState } from 'react';
import { Lock, Workflow } from 'lucide-react';
import type { CaseAnalysisInput, CaseRecord } from '../types/dynamap';

interface AnalisisKasusViewProps {
  cases: CaseRecord[];
  aiConfigured: boolean;
  onCaseCreated: (record: CaseRecord) => void;
}

const EMPTY_INPUT: CaseAnalysisInput = {
  title: '',
  situationDescription: '',
  peopleInvolved: '',
  perspectives: '',
  chronology: '',
  expectations: '',
  mainProblem: '',
  desiredOutcome: '',
  optionalPersonalityInfo: '',
  relationshipContext: 'Anggota kelompok',
  isPrivate: true,
};

export const AnalisisKasusView: React.FC<AnalisisKasusViewProps> = ({
  cases,
  onCaseCreated,
}) => {
  const [form, setForm] = useState<CaseAnalysisInput>(EMPTY_INPUT);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [activeCase, setActiveCase] = useState<CaseRecord | null>(cases[0] || null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const token = localStorage.getItem('dynamap_token');
      const res = await fetch('/api/cases/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Gagal menganalisis kasus.');
      } else {
        setActiveCase(data.caseRecord);
        onCaseCreated(data.caseRecord);
      }
    } catch {
      setError('Gagal terhubung ke server untuk memproses analisis kasus.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-8">
      <div className="bg-white/95 border border-slate-200 rounded-2xl p-6 sm:p-7 space-y-2.5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wider text-indigo-700 mb-1">
              <Workflow className="w-3.5 h-3.5 text-[#C9A65B]" />
              <span>Panduan Investigasi 12 Langkah</span>
            </div>
            <h1 className="text-2xl font-display font-bold text-slate-900">
              Analisis Kasus Interpersonal
            </h1>
            <p className="text-sm text-slate-600 mt-1 max-w-3xl">
              Urai situasi interpersonal nyata secara terstruktur: memisahkan fakta dan asumsi, meninjau
              faktor situasional di luar tipologi, serta merumuskan dialog langkah demi langkah.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Submission Form */}
        <form
          onSubmit={handleSubmit}
          className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-6 space-y-4"
        >
          <h2 className="text-lg font-display font-semibold text-slate-900">
            Ajukan Situasi untuk Dianalisis
          </h2>

          {error && (
            <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-800">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="case-title" className="block text-xs font-medium text-slate-700 mb-1">
              Judul Kasus *
            </label>
            <input
              id="case-title"
              type="text"
              required
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="Contoh: Perbedaan tempo kerja di kelompok penelitian"
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor="case-ctx" className="block text-xs font-medium text-slate-700 mb-1">
                Konteks Hubungan
              </label>
              <select
                id="case-ctx"
                value={form.relationshipContext}
                onChange={(e) => setForm({ ...form, relationshipContext: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg bg-white"
              >
                <option value="Anggota kelompok">Anggota kelompok</option>
                <option value="Teman sekelas">Teman sekelas</option>
                <option value="Teman dekat">Teman dekat</option>
                <option value="Guru dan siswa">Guru dan siswa</option>
                <option value="Koordinator dan anggota">Koordinator dan anggota</option>
                <option value="Lainnya">Lainnya</option>
              </select>
            </div>
            <div>
              <label htmlFor="case-people" className="block text-xs font-medium text-slate-700 mb-1">
                Pihak Terlibat
              </label>
              <input
                id="case-people"
                type="text"
                value={form.peopleInvolved}
                onChange={(e) => setForm({ ...form, peopleInvolved: e.target.value })}
                placeholder="Mis. Saya dan ketua kelompok"
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg"
              />
            </div>
          </div>

          <div>
            <label htmlFor="case-sit" className="block text-xs font-medium text-slate-700 mb-1">
              Deskripsi Situasi *
            </label>
            <textarea
              id="case-sit"
              required
              rows={3}
              value={form.situationDescription}
              onChange={(e) => setForm({ ...form, situationDescription: e.target.value })}
              placeholder="Jelaskan apa yang terjadi secara konkret..."
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg"
            />
          </div>

          <div>
            <label htmlFor="case-persp" className="block text-xs font-medium text-slate-700 mb-1">
              Perspektif Masing-Masing Pihak
            </label>
            <textarea
              id="case-persp"
              rows={2}
              value={form.perspectives}
              onChange={(e) => setForm({ ...form, perspectives: e.target.value })}
              placeholder="Bagaimana situasi ini terlihat dari sisi Anda dan pihak lain?"
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor="case-chrono" className="block text-xs font-medium text-slate-700 mb-1">
                Kronologi Singkat
              </label>
              <input
                id="case-chrono"
                type="text"
                value={form.chronology}
                onChange={(e) => setForm({ ...form, chronology: e.target.value })}
                placeholder="Urutan waktu kejadian"
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg"
              />
            </div>
            <div>
              <label htmlFor="case-exp" className="block text-xs font-medium text-slate-700 mb-1">
                Ekspektasi Awal
              </label>
              <input
                id="case-exp"
                type="text"
                value={form.expectations}
                onChange={(e) => setForm({ ...form, expectations: e.target.value })}
                placeholder="Apa yang awalnya diharapkan?"
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg"
              />
            </div>
          </div>

          <div>
            <label htmlFor="case-prob" className="block text-xs font-medium text-slate-700 mb-1">
              Masalah Utama *
            </label>
            <input
              id="case-prob"
              type="text"
              required
              value={form.mainProblem}
              onChange={(e) => setForm({ ...form, mainProblem: e.target.value })}
              placeholder="Inti hambatan atau ketegangan yang ingin diselesaikan"
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor="case-out" className="block text-xs font-medium text-slate-700 mb-1">
                Hasil yang Diharapkan
              </label>
              <input
                id="case-out"
                type="text"
                value={form.desiredOutcome}
                onChange={(e) => setForm({ ...form, desiredOutcome: e.target.value })}
                placeholder="Kondisi perbaikan yang diinginkan"
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg"
              />
            </div>
            <div>
              <label htmlFor="case-typo" className="block text-xs font-medium text-slate-700 mb-1">
                Info Tipologi (Opsional)
              </label>
              <input
                id="case-typo"
                type="text"
                value={form.optionalPersonalityInfo}
                onChange={(e) => setForm({ ...form, optionalPersonalityInfo: e.target.value })}
                placeholder="Mis. LIE dan EII (boleh dikosongkan)"
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg"
              />
            </div>
          </div>

          <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer pt-1">
            <input
              type="checkbox"
              checked={form.isPrivate}
              onChange={(e) => setForm({ ...form, isPrivate: e.target.checked })}
              className="rounded border-slate-300 text-indigo-700"
            />
            <Lock className="w-3.5 h-3.5 text-slate-500" />
            <span>Simpan sebagai kasus privat (tidak dipublikasikan ke pengguna lain)</span>
          </label>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-2.5 px-4 text-sm font-medium text-white bg-indigo-700 hover:bg-indigo-800 rounded-lg transition-colors disabled:opacity-50"
          >
            {submitting ? 'Menyusun Analisis 12 Bagian...' : 'Analisis Kasus Sekarang'}
          </button>
        </form>

        {/* Structured 12-Part Analysis Output */}
        <div className="lg:col-span-7 space-y-4">
          {activeCase ? (
            <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-5">
              <div className="pb-4 border-b border-slate-200">
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
                  <span>
                    Sumber:{' '}
                    <strong className="text-slate-800">
                      {activeCase.analysis.source === 'gemini-ai'
                        ? 'Hipotesis AI Kontekstual'
                        : 'Alur Analisis Terstruktur Lokal'}
                    </strong>
                  </span>
                  <span>{activeCase.input.isPrivate ? 'Privat' : 'Tersimpan'}</span>
                </div>
                <h2 className="mt-1 text-xl font-display font-bold text-slate-900">
                  {activeCase.input.title}
                </h2>
                <p className="mt-2 text-xs text-amber-900 bg-amber-50 border border-amber-200 rounded-lg p-2.5">
                  {activeCase.analysis.disclaimer}
                </p>
              </div>

              <div className="space-y-4 text-xs sm:text-sm text-slate-700">
                <div>
                  <h3 className="font-semibold text-slate-900">1. Identifikasi Masalah</h3>
                  <p className="mt-1 leading-relaxed">{activeCase.analysis.problemIdentification}</p>
                </div>

                <div>
                  <h3 className="font-semibold text-slate-900">2. Pemetaan Perspektif</h3>
                  <ul className="list-disc pl-5 mt-1 space-y-1">
                    {activeCase.analysis.perspectiveMapping.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200">
                    <h3 className="font-semibold text-slate-900 mb-1">3a. Fakta Teramati</h3>
                    <ul className="list-disc pl-4 space-y-1 text-xs">
                      {activeCase.analysis.factsVsAssumptions.facts.map((f, i) => (
                        <li key={i}>{f}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200">
                    <h3 className="font-semibold text-slate-900 mb-1">3b. Asumsi yang Perlu Diuji</h3>
                    <ul className="list-disc pl-4 space-y-1 text-xs">
                      {activeCase.analysis.factsVsAssumptions.assumptions.map((a, i) => (
                        <li key={i}>{a}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-semibold text-slate-900">4. Faktor Situasional</h3>
                    <ul className="list-disc pl-5 mt-1 space-y-1 text-xs">
                      {activeCase.analysis.situationalFactors.map((s, i) => (
                        <li key={i}>{s}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">5. Hambatan Komunikasi</h3>
                    <ul className="list-disc pl-5 mt-1 space-y-1 text-xs">
                      {activeCase.analysis.communicationBarriers.map((b, i) => (
                        <li key={i}>{b}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">6. Hipotesis Berbasis Kepribadian</h3>
                    <ul className="list-disc pl-5 mt-1 space-y-1 text-xs">
                      {activeCase.analysis.personalityHypotheses.map((h, i) => (
                        <li key={i}>{h}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">7. Penjelasan Non-Tipologi</h3>
                    <ul className="list-disc pl-5 mt-1 space-y-1 text-xs">
                      {activeCase.analysis.nonTypologyExplanations.map((n, i) => (
                        <li key={i}>{n}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-semibold text-slate-900">8. Strategi Resolusi Konflik</h3>
                    <ul className="list-disc pl-5 mt-1 space-y-1 text-xs">
                      {activeCase.analysis.conflictResolutionStrategies.map((st, i) => (
                        <li key={i}>{st}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">9. Rekomendasi Komunikasi Praktis</h3>
                    <ul className="list-disc pl-5 mt-1 space-y-1 text-xs">
                      {activeCase.analysis.practicalRecommendations.map((r, i) => (
                        <li key={i}>{r}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-slate-900 mb-2">10. Contoh Dialog yang Disarankan</h3>
                  <div className="space-y-2.5">
                    {activeCase.analysis.suggestedDialogue.map((d, i) => (
                      <div key={i} className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs space-y-1">
                        <div className="font-semibold text-slate-900">{d.situation}</div>
                        <div className="text-red-800">Hindari: “{d.avoid}”</div>
                        <div className="text-emerald-900">Coba katakan: “{d.trySaying}”</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-200 text-xs">
                  <div>
                    <h3 className="font-semibold text-slate-900">11. Pertanyaan Lanjutan</h3>
                    <ul className="list-disc pl-5 mt-1 space-y-1">
                      {activeCase.analysis.followUpQuestions.map((q, i) => (
                        <li key={i}>{q}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">12. Refleksi Pribadi</h3>
                    <ul className="list-disc pl-5 mt-1 space-y-1">
                      {activeCase.analysis.reflectionPrompts.map((p, i) => (
                        <li key={i}>{p}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white border border-slate-200 rounded-xl p-10 text-center space-y-2">
              <h3 className="text-base font-display font-semibold text-slate-900">
                Belum Ada Kasus yang Dianalisis
              </h3>
              <p className="text-sm text-slate-500 max-w-md mx-auto">
                Isi formulir di sebelah kiri untuk memetakan masalah komunikasi nyata menjadi 12 bagian
                analisis terstruktur, pemisahan fakta vs asumsi, dan saran dialog konkret.
              </p>
            </div>
          )}

          {cases.length > 0 && (
            <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-3">
              <h3 className="text-sm font-display font-semibold text-slate-900">
                Riwayat Analisis yang Dapat Anda Akses ({cases.length})
              </h3>
              <div className="flex flex-wrap gap-2">
                {cases.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setActiveCase(c)}
                    className={`px-3 py-1.5 rounded-lg text-xs border transition-colors ${
                      activeCase?.id === c.id
                        ? 'bg-indigo-700 text-white border-indigo-700'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {c.input.title}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
