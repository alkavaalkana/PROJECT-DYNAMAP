import React, { useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  BookmarkCheck,
  BookOpen,
  Briefcase,
  CheckCircle2,
  Compass,
  Lightbulb,
  Save,
  SlidersHorizontal,
  UserCheck,
} from 'lucide-react';
import { ENNEAGRAM_TYPES } from '../data/enneagramData';
import { INFORMATION_ELEMENTS, SOCIONICS_TYPES } from '../data/socionicsData';
import { parsePsychosophyPositions } from '../lib/psychosophy';
import type {
  Account,
  ExplorationCatalogConfig,
  IntrapersonalExplorationInput,
  Profile,
  SchoolSubjectTemplate,
  SocionicsCode,
  TypologyFrameworkKey,
  UserExplorationData,
  UserSubjectEntry,
  WorkEnvironmentPreferences,
} from '../types/dynamap';

interface IntrapersonalExplorationWizardProps {
  account: Account | null;
  activeProfile: Profile | null;
  allProfiles: Profile[];
  sandboxProfileId: string;
  onSelectSandboxProfile: (profileId: string) => void;
  explorationConfig: ExplorationCatalogConfig;
  subjectTemplates: SchoolSubjectTemplate[];
  specLabel: string;
  onSpecLabelChange: (val: string) => void;
  userSubjects: UserSubjectEntry[];
  onUpdateSubject: (subjectId: string, patch: Partial<UserSubjectEntry>) => void;
  intrapersonal: IntrapersonalExplorationInput;
  onChangeIntrapersonal: (next: IntrapersonalExplorationInput) => void;
  provisionalTypologies: Partial<Record<TypologyFrameworkKey, boolean>>;
  onToggleProvisional: (key: TypologyFrameworkKey) => void;
  onApplyFiskimPreset?: () => void;
  onSaveAndViewResults: () => Promise<void>;
  onSaveDraftOnly: () => Promise<void>;
  onOpenAuth: () => void;
}

const STEP_LABELS = [
  { num: 1, title: '1. Profil Tipologi Otomatis', icon: UserCheck },
  { num: 2, title: '2. Minat & Latar SMA', icon: BookOpen },
  { num: 3, title: '3. Kognitif, Belajar & Motivasi', icon: Lightbulb },
  { num: 4, title: '4. Aktivitas & Lingkungan Kerja', icon: Briefcase },
];

export const IntrapersonalExplorationWizard: React.FC<IntrapersonalExplorationWizardProps> = ({
  account,
  activeProfile,
  allProfiles,
  sandboxProfileId,
  onSelectSandboxProfile,
  explorationConfig,
  subjectTemplates,
  specLabel,
  onSpecLabelChange,
  userSubjects,
  onUpdateSubject,
  intrapersonal,
  onChangeIntrapersonal,
  provisionalTypologies,
  onToggleProvisional,
  onApplyFiskimPreset,
  onSaveAndViewResults,
  onSaveDraftOnly,
  onOpenAuth,
}) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [saving, setSaving] = useState(false);

  const typ = activeProfile?.typology;
  const socSpec = typ?.socionics ? SOCIONICS_TYPES[typ.socionics as SocionicsCode] : null;
  const ennSpec = typ?.enneagramCore ? ENNEAGRAM_TYPES[typ.enneagramCore] : null;
  const psyParsed = parsePsychosophyPositions(
    typ?.psychosophyCode || typ?.psychosophySelfReported || ''
  );

  function toggleListItem(
    key:
      | 'enjoyedSubjects'
      | 'curiosityTopics'
      | 'disciplinesToDeepen'
      | 'dislikedDespiteHighScore'
      | 'enjoyedDespiteDifficulty'
      | 'cognitivePreferences'
      | 'learningPreferencesSelected'
      | 'personalMotivationsRanked'
      | 'meaningfulActivities',
    value: string
  ) {
    const current = intrapersonal[key];
    const next = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    onChangeIntrapersonal({ ...intrapersonal, [key]: next });
  }

  function moveMotivation(index: number, direction: -1 | 1) {
    const list = [...intrapersonal.personalMotivationsRanked];
    const target = index + direction;
    if (target < 0 || target >= list.length) return;
    [list[index], list[target]] = [list[target], list[index]];
    onChangeIntrapersonal({ ...intrapersonal, personalMotivationsRanked: list });
  }

  function setWorkPref<K extends keyof WorkEnvironmentPreferences>(
    field: K,
    value: WorkEnvironmentPreferences[K]
  ) {
    onChangeIntrapersonal({
      ...intrapersonal,
      workPreferences: {
        ...intrapersonal.workPreferences,
        [field]: value,
      },
    });
  }

  const takenSubjectNames = userSubjects.filter((s) => s.taken).map((s) => s.subjectName);

  async function handleFinish() {
    setSaving(true);
    try {
      await onSaveAndViewResults();
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Stepper Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <h2 className="text-lg font-display font-bold text-slate-900">
              Alur Eksplorasi Intrapersonal, Minat &amp; Latar Akademik (4 Tahap)
            </h2>
            <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
              Isi secara bertahap sesuai keadaan nyata Anda. Data tipologi profil Anda ditarik otomatis tanpa harus mengetik ulang, dan Anda tetap dapat mengubah seluruh jawaban kapan saja.
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={onSaveDraftOnly}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg"
            >
              <Save className="w-3.5 h-3.5" />
              Simpan Draf
            </button>
            <button
              type="button"
              disabled={saving}
              onClick={handleFinish}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-white bg-indigo-700 hover:bg-indigo-800 rounded-lg disabled:opacity-60"
            >
              <Compass className="w-3.5 h-3.5" />
              Lihat Hasil Analisis (A–I)
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
          {STEP_LABELS.map((item) => {
            const Icon = item.icon;
            const active = step === item.num;
            const done = step > item.num;
            return (
              <button
                key={item.num}
                type="button"
                onClick={() => setStep(item.num as 1 | 2 | 3 | 4)}
                className={`p-3 rounded-lg border text-left transition-colors flex items-center gap-2.5 text-xs font-medium ${
                  active
                    ? 'bg-indigo-50 border-indigo-500 text-indigo-950'
                    : done
                    ? 'bg-emerald-50/70 border-emerald-300 text-emerald-950'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span className="leading-snug">{item.title}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* STEP 1: AUTOMATIC EXISTING PROFILE RETRIEVAL */}
      {step === 1 && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-5 text-xs">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 border-b border-slate-200 pb-4">
            <div>
              <h3 className="text-base font-display font-bold text-slate-900">
                Penarikan Otomatis Profil Tipologi Tersimpan
              </h3>
              <p className="text-slate-600 mt-1">
                Sistem mengambil otomatis catatan Socionics, Enneagram, Varian Insting, Psikosofi, dan Tipologi Jung dari profil Anda. Anda dapat menandai kerangka tertentu sebagai <strong>provisional / sedang dieksplorasi</strong> tanpa menimpa data profil utama.
              </p>
            </div>
            {(!account || !account.linkedProfileId) && (
              <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 shrink-0">
                <select
                  aria-label="Pratinjau profil siswa untuk simulasi"
                  value={sandboxProfileId}
                  onChange={(e) => onSelectSandboxProfile(e.target.value)}
                  className="px-3 py-2 border border-slate-300 rounded-lg bg-white max-w-full sm:max-w-[260px]"
                >
                  <option value="">-- Mode Pratinjau Tanpa Profil --</option>
                  {allProfiles.slice(0, 40).map((p) => (
                    <option key={p.id} value={p.id}>
                      Simulasi: {p.displayName} ({p.typology.socionics || 'Belum Dipetakan'})
                    </option>
                  ))}
                </select>
                {!account && (
                  <button
                    type="button"
                    onClick={onOpenAuth}
                    className="px-3 py-2 font-medium text-white bg-indigo-700 hover:bg-indigo-800 rounded-lg whitespace-nowrap shrink-0"
                  >
                    Masuk Akun Pribadi
                  </button>
                )}
              </div>
            )}
          </div>

          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 text-slate-700 leading-relaxed">
            <strong>Prinsip Pemisahan DYNAMAP:</strong> Kekurangan atau kekosongan kode tipologi tidak pernah menghalangi analisis. Kerangka kepribadian membantu membaca gaya proses belajar &amp; refleksi motivasi, sementara minat pribadi, nilai, aktivitas nyata, dan pilihan akademik tetap menjadi penentu utama arah eksplorasi Anda.
          </div>

          {activeProfile ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Socionics card */}
              <div className="p-4 rounded-xl border border-slate-200 space-y-2.5">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="text-[11px] font-semibold text-indigo-700">SOCIONICS (MODEL A)</div>
                    <div className="text-sm font-bold text-slate-900">
                      {socSpec ? `${socSpec.code} · Quadra ${socSpec.quadra}` : 'Belum Dipetakan'}
                    </div>
                  </div>
                  <label className="inline-flex items-center gap-1.5 text-[11px] text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={
                        provisionalTypologies.socionics ??
                        (typ?.status === 'Initial Typing' || typ?.status === 'Undetermined')
                      }
                      onChange={() => onToggleProvisional('socionics')}
                    />
                    <span>Tandai Provisional</span>
                  </label>
                </div>
                {socSpec ? (
                  <div className="space-y-1 text-slate-700">
                    <div>
                      <strong>Blok Ego (Kuat &amp; Bernilai):</strong> Leading {socSpec.modelA[0]} (
                      {INFORMATION_ELEMENTS[socSpec.modelA[0]].indonesianName}), Creative{' '}
                      {socSpec.modelA[1]} ({INFORMATION_ELEMENTS[socSpec.modelA[1]].indonesianName})
                    </div>
                    <div>
                      <strong>Elemen Bernilai:</strong>{' '}
                      {[socSpec.modelA[0], socSpec.modelA[1], socSpec.modelA[4], socSpec.modelA[5]].join(', ')}{' '}
                      · <strong>Kurang Bernilai:</strong>{' '}
                      {[socSpec.modelA[2], socSpec.modelA[3], socSpec.modelA[6], socSpec.modelA[7]].join(', ')}
                    </div>
                  </div>
                ) : (
                  <p className="text-slate-500">
                    Tidak ada kode Socionics; sistem tetap menganalisis Anda berbasis preferensi langsung.
                  </p>
                )}
              </div>

              {/* Enneagram + Instincts */}
              <div className="p-4 rounded-xl border border-slate-200 space-y-2.5">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="text-[11px] font-semibold text-indigo-700">
                      ENNEAGRAM &amp; VARIAN INSTING
                    </div>
                    <div className="text-sm font-bold text-slate-900">
                      {ennSpec
                        ? `${typ?.enneagramRaw || `Tipe ${ennSpec.number}`}${typ?.enneagramWing ? ` (${typ.enneagramWing})` : ''}${typ?.tritype ? ` · Tritype ${typ.tritype}` : ''}`
                        : 'Belum Dipetakan'}
                    </div>
                  </div>
                  <label className="inline-flex items-center gap-1.5 text-[11px] text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={
                        provisionalTypologies.enneagram ??
                        (typ?.status === 'Initial Typing' || typ?.status === 'Undetermined')
                      }
                      onChange={() => onToggleProvisional('enneagram')}
                    />
                    <span>Tandai Provisional</span>
                  </label>
                </div>
                {ennSpec ? (
                  <div className="space-y-1 text-slate-700">
                    <div>
                      <strong>Keinginan Inti:</strong> {ennSpec.coreDesire}
                    </div>
                    <div>
                      <strong>Ketakutan Inti:</strong> {ennSpec.coreFear}
                    </div>
                    <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                      <span>
                        <strong>Insting Stacking:</strong> {typ?.instinctStacking || typ?.instinctVariant || '-'}
                      </span>
                      <label className="inline-flex items-center gap-1 text-[11px] cursor-pointer">
                        <input
                          type="checkbox"
                          checked={provisionalTypologies.instinct ?? false}
                          onChange={() => onToggleProvisional('instinct')}
                        />
                        <span>Insting Provisional</span>
                      </label>
                    </div>
                  </div>
                ) : (
                  <p className="text-slate-500">Kode Enneagram belum terisi dan bersifat opsional.</p>
                )}
              </div>

              {/* Psychosophy */}
              <div className="p-4 rounded-xl border border-slate-200 space-y-2.5">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="text-[11px] font-semibold text-indigo-700">
                      PSIKOSOFI / ATTITUDINAL PSYCHE
                    </div>
                    <div className="text-sm font-bold text-slate-900">
                      {psyParsed.valid
                        ? `${psyParsed.code}${psyParsed.typeSpec ? ` (“${psyParsed.typeSpec.afanasyevNickname}”)` : ''}`
                        : 'Belum Dipetakan'}
                    </div>
                  </div>
                  <label className="inline-flex items-center gap-1.5 text-[11px] text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={provisionalTypologies.psychosophy ?? (typ?.psychosophyProvisional ?? true)}
                      onChange={() => onToggleProvisional('psychosophy')}
                    />
                    <span>Tandai Provisional</span>
                  </label>
                </div>
                {psyParsed.valid ? (
                  <div className="space-y-1 text-slate-700">
                    {psyParsed.placements.map((pl) => (
                      <div key={pl.code}>
                        <strong>{pl.code}</strong> ({pl.aspectName}): {pl.positionLabel}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-500">
                    Anda tetap dapat melanjutkan eksplorasi meskipun susunan L·V·E·F belum diisi.
                  </p>
                )}
              </div>

              {/* Jungian */}
              <div className="p-4 rounded-xl border border-slate-200 space-y-2.5">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="text-[11px] font-semibold text-indigo-700">
                      TIPOLOGI JUNG (NOTASI PROYEK)
                    </div>
                    <div className="text-sm font-bold text-slate-900">
                      {typ?.jungian || 'Belum Dipetakan'}
                    </div>
                  </div>
                  <label className="inline-flex items-center gap-1.5 text-[11px] text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={provisionalTypologies.jungian ?? false}
                      onChange={() => onToggleProvisional('jungian')}
                    />
                    <span>Tandai Provisional</span>
                  </label>
                </div>
                <p className="text-slate-600">
                  Disajikan terpisah dari Socionics Model A dan tidak dikonversi otomatis menjadi tipe empat-huruf MBTI.
                </p>
              </div>
            </div>
          ) : (
            <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 text-slate-700">
              Anda sedang berada dalam <strong>Mode Eksplorasi Bebas Tipologi</strong>. Anda dapat langsung melanjutkan ke Langkah 2–4 berdasarkan minat akademik, preferensi belajar, aktivitas bermakna, dan pilihan lingkungan kerja Anda—atau memilih profil simulasi di pojok kanan atas panel ini.
            </div>
          )}

          {activeProfile && (
            <div className="p-4 rounded-xl bg-indigo-50/50 border border-indigo-200 space-y-2">
              <div className="text-[11px] font-semibold text-indigo-800">
                DATA NON-TIPOLOGI TERSINKRONISASI OTOMATIS DARI PROFIL SAYA ({activeProfile.displayName})
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-slate-700">
                <div>
                  <strong>Minat Akademik Tersimpan:</strong>{' '}
                  {activeProfile.academicInterests.length > 0
                    ? activeProfile.academicInterests.join(', ')
                    : 'Belum diisi di Profil Saya (Anda bebas memilih di Langkah 2).'}
                </div>
                <div>
                  <strong>Preferensi Belajar &amp; Kolaborasi Profil:</strong>{' '}
                  {[
                    activeProfile.learningPreferences.studySetting,
                    activeProfile.learningPreferences.explanationStyle,
                    activeProfile.learningPreferences.structureStyle,
                    activeProfile.learningPreferences.workMode,
                    activeProfile.collaborationPreferences,
                  ]
                    .filter(Boolean)
                    .join(' · ') || 'Belum diatur di Profil Saya.'}
                </div>
              </div>
              {typ?.customPrefixes && typ.customPrefixes.length > 0 && (
                <div className="pt-1 border-t border-indigo-200/70 text-slate-700">
                  <strong>Catatan Kustom Tipologi:</strong>{' '}
                  {typ.customPrefixes.map((c) => `${c.label}: ${c.value}`).join(' · ')}
                </div>
              )}
            </div>
          )}

          <div className="flex justify-end pt-2">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="inline-flex items-center gap-1.5 px-4 py-2 font-medium text-white bg-indigo-700 hover:bg-indigo-800 rounded-lg"
            >
              Lanjut ke Langkah 2: Minat &amp; Latar SMA
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: ACADEMIC INTERESTS (4.1) & SMA SUBJECTS */}
      {step === 2 && (
        <div className="space-y-6 text-xs">
          <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-5">
            <div className="border-b border-slate-200 pb-3">
              <h3 className="text-base font-display font-bold text-slate-900">
                Bagian A — Minat Akademik &amp; Ketertarikan Sejati (Bukan Hanya Nilai Rapor)
              </h3>
              <p className="text-slate-600 mt-1">
                Rasa ingin tahu alami sering jauh lebih jujur daripada sekadar angka ujian. Tandai topik yang ingin Anda pahami, termasuk mapel yang nilainya bagus tetapi tidak Anda nikmati—dan sebaliknya!
              </p>
            </div>

            <div>
              <label className="block font-semibold text-slate-800 mb-2">
                1. Rumpun &amp; Topik yang Memancing Rasa Ingin Tahu Anda (boleh pilih lintas bidang):
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                {explorationConfig.academicInterestCategories.map((topic) => {
                  const active = intrapersonal.curiosityTopics.includes(topic);
                  return (
                    <button
                      key={topic}
                      type="button"
                      onClick={() => toggleListItem('curiosityTopics', topic)}
                      className={`p-2.5 rounded-lg border text-left font-medium transition-colors ${
                        active
                          ? 'bg-indigo-50 border-indigo-500 text-indigo-950'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {topic}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-800 mb-2">
                2. Rumpun Disiplin Ilmu yang Ingin Anda Pahami Lebih Dalam (Bebas Lintas Peminatan SMA):
              </label>
              <div className="flex flex-wrap gap-2">
                {explorationConfig.disciplineClusters.map((cluster) => {
                  const active = intrapersonal.disciplinesToDeepen.includes(cluster);
                  return (
                    <button
                      key={cluster}
                      type="button"
                      onClick={() => toggleListItem('disciplinesToDeepen', cluster)}
                      className={`px-3 py-1.5 rounded-lg border font-medium transition-colors ${
                        active
                          ? 'bg-sky-700 text-white border-sky-700'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {cluster}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-amber-50/50 border border-amber-200 space-y-2">
                <div className="font-semibold text-slate-900">
                  3. Mata Pelajaran yang Nilainya Baik, Namun Kurang Anda Nikmati:
                </div>
                <p className="text-[11px] text-slate-600">
                  Mencegah Anda terjebak memilih jurusan hanya karena kebetulan mendapat angka baik di sekolah.
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {takenSubjectNames.map((name) => {
                    const active = intrapersonal.dislikedDespiteHighScore.includes(name);
                    return (
                      <button
                        key={name}
                        type="button"
                        onClick={() => toggleListItem('dislikedDespiteHighScore', name)}
                        className={`px-2.5 py-1 rounded border font-medium ${
                          active
                            ? 'bg-amber-700 text-white border-amber-700'
                            : 'bg-white text-slate-700 border-slate-300'
                        }`}
                      >
                        {name}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-200 space-y-2">
                <div className="font-semibold text-slate-900">
                  4. Mata Pelajaran/Bidang yang Tetap Dinikmati Meski Terasa Sulit:
                </div>
                <p className="text-[11px] text-slate-600">
                  Sinyal ketertarikan jangka panjang yang layak dipertahankan meski butuh proses belajar bertahap.
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {[...takenSubjectNames, 'Psikologi', 'Filsafat', 'Hukum', 'Sosiologi', 'Desain'].map(
                    (name) => {
                      const active = intrapersonal.enjoyedDespiteDifficulty.includes(name);
                      return (
                        <button
                          key={name}
                          type="button"
                          onClick={() => toggleListItem('enjoyedDespiteDifficulty', name)}
                          className={`px-2.5 py-1 rounded border font-medium ${
                            active
                              ? 'bg-emerald-700 text-white border-emerald-700'
                              : 'bg-white text-slate-700 border-slate-300'
                          }`}
                        >
                          {name}
                        </button>
                      );
                    }
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-800 mb-1">
                  5. Masalah atau Pertanyaan Nyata yang Menarik untuk Anda Selidiki:
                </label>
                <input
                  type="text"
                  placeholder="Mis. Bagaimana kebijakan ekonomi memengaruhi perilaku masyarakat atau kesehatan mental siswa?"
                  value={intrapersonal.interestingProblems}
                  onChange={(e) =>
                    onChangeIntrapersonal({ ...intrapersonal, interestingProblems: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-800 mb-1">
                  6. Topik yang Sering Anda Baca/Tonton Secara Sukarela (di Luar Tugas Sekolah):
                </label>
                <input
                  type="text"
                  placeholder="Mis. Filsafat etika, video kasus hukum, riset AI, sejarah peradaban, atau biologi sel"
                  value={intrapersonal.voluntaryTopics}
                  onChange={(e) =>
                    onChangeIntrapersonal({ ...intrapersonal, voluntaryTopics: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-800 mb-1">
                7. Catatan Bebas Minat Akademik &amp; Disiplin Ilmu yang Ingin Didalami:
              </label>
              <textarea
                rows={2}
                placeholder="Ceritakan bidang apa saja yang ingin Anda ketahui lebih dalam tanpa takut keterbatasan mapel SMA..."
                value={intrapersonal.academicInterestNotes}
                onChange={(e) =>
                  onChangeIntrapersonal({ ...intrapersonal, academicInterestNotes: e.target.value })
                }
                className="w-full px-3 py-2 border border-slate-300 rounded-lg"
              />
            </div>
          </div>

          {/* SMA Subjects Table (FISKIM MATONOMI + Umum + Tambahan) */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-200 pb-3">
              <div>
                <h3 className="text-base font-display font-bold text-slate-900">
                  Bagian B — Latar Mata Pelajaran SMA ({specLabel})
                </h3>
                <p className="text-slate-600 mt-0.5">
                  Tersedia paket <strong>FISKIM MATONOMI</strong>, 10 mapel umum, dan opsi mapel lintas peminatan (seperti Biologi, Sosiologi, Geografi, Informatika) bila pernah Anda ambil. Mapel yang tidak dicentang <strong>tidak akan mendiskualifikasi</strong> Anda dari prodi terkait!
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2 shrink-0">
                {onApplyFiskimPreset && (
                  <button
                    type="button"
                    onClick={onApplyFiskimPreset}
                    className="px-3 py-1.5 font-medium text-indigo-800 bg-indigo-50 hover:bg-indigo-100 rounded-lg border border-indigo-200"
                  >
                    Terapkan Paket FISKIM MATONOMI
                  </button>
                )}
                <input
                  type="text"
                  aria-label="Label paket peminatan SMA"
                  value={specLabel}
                  onChange={(e) => onSpecLabelChange(e.target.value)}
                  className="px-3 py-1.5 border border-slate-300 rounded-lg font-medium w-44"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-600">
                    <th className="py-2 px-3 font-semibold">Diambil</th>
                    <th className="py-2 px-3 font-semibold">Mata Pelajaran</th>
                    <th className="py-2 px-3 font-semibold">Minat</th>
                    <th className="py-2 px-3 font-semibold">Penguasaan</th>
                    <th className="py-2 px-3 font-semibold">Kisaran Nilai</th>
                    <th className="py-2 px-3 font-semibold">Topik yang Disukai</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {userSubjects.map((subj) => {
                    const tpl = subjectTemplates.find((t) => t.id === subj.subjectId);
                    return (
                      <tr key={subj.subjectId} className={subj.taken ? '' : 'opacity-60 bg-slate-50'}>
                        <td className="py-2 px-3">
                          <input
                            type="checkbox"
                            aria-label={`Ambil ${subj.subjectName}`}
                            checked={subj.taken}
                            onChange={(e) =>
                              onUpdateSubject(subj.subjectId, { taken: e.target.checked })
                            }
                          />
                        </td>
                        <td className="py-2 px-3">
                          <div className="font-semibold text-slate-900">{subj.subjectName}</div>
                          <div className="text-[11px] text-slate-500">
                            {tpl?.specializationPack || subj.category}
                          </div>
                        </td>
                        <td className="py-2 px-3">
                          <select
                            aria-label={`Minat ${subj.subjectName}`}
                            value={subj.interestLevel}
                            onChange={(e) =>
                              onUpdateSubject(subj.subjectId, {
                                interestLevel: e.target.value as UserSubjectEntry['interestLevel'],
                              })
                            }
                            className="px-2 py-1 border border-slate-300 rounded bg-white"
                          >
                            <option value="Rendah">Rendah</option>
                            <option value="Sedang">Sedang</option>
                            <option value="Tinggi">Tinggi</option>
                          </select>
                        </td>
                        <td className="py-2 px-3">
                          <select
                            aria-label={`Penguasaan ${subj.subjectName}`}
                            value={subj.proficiencyLevel}
                            onChange={(e) =>
                              onUpdateSubject(subj.subjectId, {
                                proficiencyLevel: e.target.value as UserSubjectEntry['proficiencyLevel'],
                              })
                            }
                            className="px-2 py-1 border border-slate-300 rounded bg-white"
                          >
                            <option value="Dasar">Dasar</option>
                            <option value="Cukup Baik">Cukup Baik</option>
                            <option value="Kuat">Kuat</option>
                            <option value="Sangat Kuat">Sangat Kuat</option>
                          </select>
                        </td>
                        <td className="py-2 px-3">
                          <select
                            aria-label={`Nilai ${subj.subjectName}`}
                            value={subj.recentGradeRange}
                            onChange={(e) =>
                              onUpdateSubject(subj.subjectId, {
                                recentGradeRange: e.target.value as UserSubjectEntry['recentGradeRange'],
                              })
                            }
                            className="px-2 py-1 border border-slate-300 rounded bg-white"
                          >
                            <option value="Belum Diisi">Belum Diisi</option>
                            <option value="< 75">&lt; 75</option>
                            <option value="75 - 84">75 - 84</option>
                            <option value="85 - 92">85 - 92</option>
                            <option value="93 - 100">93 - 100</option>
                          </select>
                        </td>
                        <td className="py-2 px-3">
                          <input
                            type="text"
                            placeholder="Topik disukai..."
                            value={subj.enjoyedTopics}
                            onChange={(e) =>
                              onUpdateSubject(subj.subjectId, { enjoyedTopics: e.target.value })
                            }
                            className="w-full min-w-[160px] px-2 py-1 border border-slate-300 rounded"
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Kembali ke Profil Tipologi
              </button>
              <button
                type="button"
                onClick={() => setStep(3)}
                className="inline-flex items-center gap-1.5 px-4 py-2 font-medium text-white bg-indigo-700 hover:bg-indigo-800 rounded-lg"
              >
                Lanjut ke Langkah 3: Gaya Kognitif &amp; Motivasi
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* STEP 3: COGNITIVE (4.2), LEARNING PREFERENCES (4.3), & MOTIVATIONS (4.4) */}
      {step === 3 && (
        <div className="space-y-6 text-xs">
          <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-5">
            <div className="border-b border-slate-200 pb-3">
              <h3 className="text-base font-display font-bold text-slate-900">
                4.2 Preferensi Kognitif (Jenis Aktivitas Berpikir yang Dinikmati)
              </h3>
              <p className="text-slate-600 mt-1">
                Pilihan bersifat <strong>tidak saling meniadakan</strong>—Anda dapat menyukai penalaran kuantitatif sekaligus penyelidikan perilaku manusia atau seni visual.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {explorationConfig.cognitivePreferenceOptions.map((opt) => {
                const active = intrapersonal.cognitivePreferences.includes(opt);
                return (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => toggleListItem('cognitivePreferences', opt)}
                    className={`p-3 rounded-lg border text-left font-medium transition-colors ${
                      active
                        ? 'bg-indigo-50 border-indigo-500 text-indigo-950'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
            <div className="border-b border-slate-200 pb-3">
              <h3 className="text-base font-display font-bold text-slate-900">
                4.3 Preferensi Cara Belajar (Preferensi, BUKAN Batas Kemampuan Tetap)
              </h3>
              <p className="text-slate-600 mt-1">
                Mengetahui cara belajar yang paling membuat Anda nyaman membantu merancang strategi kuliah, bukan membatasi potensi akademik Anda.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {explorationConfig.learningPreferenceOptions.map((opt) => {
                const active = intrapersonal.learningPreferencesSelected.includes(opt);
                return (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => toggleListItem('learningPreferencesSelected', opt)}
                    className={`p-3 rounded-lg border text-left font-medium transition-colors ${
                      active
                        ? 'bg-sky-50 border-sky-500 text-sky-950'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
            <input
              type="text"
              placeholder="Catatan tambahan gaya belajar atau kondisi diskusi yang Anda sukai..."
              value={intrapersonal.learningPreferenceNotes}
              onChange={(e) =>
                onChangeIntrapersonal({ ...intrapersonal, learningPreferenceNotes: e.target.value })
              }
              className="w-full px-3 py-2 border border-slate-300 rounded-lg"
            />
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
            <div className="border-b border-slate-200 pb-3">
              <h3 className="text-base font-display font-bold text-slate-900">
                4.4 Motivasi &amp; Nilai Pribadi (Pilih lalu Atur Prioritas)
              </h3>
              <p className="text-slate-600 mt-1">
                Klik nilai yang bermakna bagi masa depan Anda, lalu atur urutan prioritasnya di panel sebelah kanan.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              <div className="lg:col-span-7 flex flex-wrap gap-2 content-start">
                {explorationConfig.motivationOptions.map((mot) => {
                  const active = intrapersonal.personalMotivationsRanked.includes(mot);
                  return (
                    <button
                      key={mot}
                      type="button"
                      onClick={() => toggleListItem('personalMotivationsRanked', mot)}
                      className={`px-3 py-2 rounded-lg border font-medium text-left ${
                        active
                          ? 'bg-indigo-700 text-white border-indigo-700'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {mot}
                    </button>
                  );
                })}
              </div>

              <div className="lg:col-span-5 p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="font-semibold text-slate-900">Urutan Prioritas Anda:</div>
                {intrapersonal.personalMotivationsRanked.length === 0 ? (
                  <p className="text-slate-500">Pilih minimal 2 motivasi di sebelah kiri.</p>
                ) : (
                  <div className="space-y-1.5">
                    {intrapersonal.personalMotivationsRanked.map((mot, idx) => (
                      <div
                        key={mot}
                        className="flex items-center justify-between gap-2 bg-white px-2.5 py-1.5 rounded border border-slate-200"
                      >
                        <span className="truncate">
                          <strong className="text-indigo-700 mr-1.5">#{idx + 1}</strong>
                          {mot}
                        </span>
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            type="button"
                            onClick={() => moveMotivation(idx, -1)}
                            disabled={idx === 0}
                            className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 disabled:opacity-40"
                            aria-label={`Naikkan prioritas ${mot}`}
                          >
                            ↑
                          </button>
                          <button
                            type="button"
                            onClick={() => moveMotivation(idx, 1)}
                            disabled={idx === intrapersonal.personalMotivationsRanked.length - 1}
                            className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 disabled:opacity-40"
                            aria-label={`Turunkan prioritas ${mot}`}
                          >
                            ↓
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-800 mb-1">
                Catatan Nilai Pribadi, Prinsip Hidup, atau Pertimbangan Konteks Masa Depan (opsional):
              </label>
              <textarea
                rows={2}
                placeholder="Mis. Ingin karier yang tetap memberi waktu riset mendalam, dekat keluarga, atau berdampak di bidang pendidikan/kebijakan publik..."
                value={intrapersonal.personalValuesNotes}
                onChange={(e) =>
                  onChangeIntrapersonal({ ...intrapersonal, personalValuesNotes: e.target.value })
                }
                className="w-full px-3 py-2 border border-slate-300 rounded-lg"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Kembali ke Minat &amp; Mapel
              </button>
              <button
                type="button"
                onClick={() => setStep(4)}
                className="inline-flex items-center gap-1.5 px-4 py-2 font-medium text-white bg-indigo-700 hover:bg-indigo-800 rounded-lg"
              >
                Lanjut ke Langkah 4: Aktivitas &amp; Lingkungan Kerja
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* STEP 4: MEANINGFUL ACTIVITIES (4.5) & WORK PREFERENCES (4.6) */}
      {step === 4 && (
        <div className="space-y-6 text-xs">
          <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
            <div className="border-b border-slate-200 pb-3">
              <h3 className="text-base font-display font-bold text-slate-900">
                4.5 Aktivitas Bermakna &amp; Pengalaman di Luar Nilai Ujian
              </h3>
              <p className="text-slate-600 mt-1">
                Pilih kegiatan yang membuat Anda bersemangat atau merasa berkontribusi nyata—termasuk kegiatan organisasi, menulis, merancang visual, membantu teman, atau bereksperimen.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {explorationConfig.activityOptions.map((act) => {
                const active = intrapersonal.meaningfulActivities.includes(act);
                return (
                  <button
                    key={act}
                    type="button"
                    onClick={() => toggleListItem('meaningfulActivities', act)}
                    className={`p-3 rounded-lg border text-left font-medium transition-colors ${
                      active
                        ? 'bg-indigo-50 border-indigo-500 text-indigo-950'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {act}
                  </button>
                );
              })}
            </div>
            <div>
              <label className="block font-semibold text-slate-800 mb-1">
                Pengalaman Ekstrakurikuler, Lomba, Organisasi, atau Proyek Pribadi (opsional):
              </label>
              <textarea
                rows={2}
                placeholder="Mis. Panitia acara sekolah, lomba karya ilmiah, pengelola media sosial OSIS, tutor teman sebaya..."
                value={intrapersonal.extracurricularExperiences}
                onChange={(e) =>
                  onChangeIntrapersonal({
                    ...intrapersonal,
                    extracurricularExperiences: e.target.value,
                  })
                }
                className="w-full px-3 py-2 border border-slate-300 rounded-lg"
              />
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-5">
            <div className="border-b border-slate-200 pb-3 flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-indigo-700" />
              <div>
                <h3 className="text-base font-display font-bold text-slate-900">
                  4.6 Preferensi Karier &amp; Lingkungan Kerja (Dapat Diubah Kapan Saja)
                </h3>
                <p className="text-slate-600 mt-0.5">
                  Membantu memetakan jenis suasana kerja dan tanggung jawab yang ingin Anda rasakan di dunia profesional.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Pola Kolaborasi</label>
                <select
                  aria-label="Pola kolaborasi kerja"
                  value={intrapersonal.workPreferences.collaboration}
                  onChange={(e) =>
                    setWorkPref(
                      'collaboration',
                      e.target.value as WorkEnvironmentPreferences['collaboration']
                    )
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
                >
                  <option value="Mandiri">Mandiri</option>
                  <option value="Campuran">Campuran</option>
                  <option value="Kolaboratif">Kolaboratif</option>
                </select>
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Lokasi &amp; Suasana</label>
                <select
                  aria-label="Lokasi kerja pilihan"
                  value={intrapersonal.workPreferences.setting}
                  onChange={(e) =>
                    setWorkPref('setting', e.target.value as WorkEnvironmentPreferences['setting'])
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
                >
                  <option value="Kantor / Lab">Kantor / Lab</option>
                  <option value="Fleksibel">Fleksibel</option>
                  <option value="Lapangan / Dinamis">Lapangan / Dinamis</option>
                </select>
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Orientasi Masalah</label>
                <select
                  aria-label="Fokus riset atau praktik"
                  value={intrapersonal.workPreferences.focus}
                  onChange={(e) =>
                    setWorkPref('focus', e.target.value as WorkEnvironmentPreferences['focus'])
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
                >
                  <option value="Riset & Analisis">Riset &amp; Analisis</option>
                  <option value="Seimbang">Seimbang</option>
                  <option value="Aplikasi Praktis">Aplikasi Praktis</option>
                </select>
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Struktur Kerja</label>
                <select
                  aria-label="Struktur kerja pilihan"
                  value={intrapersonal.workPreferences.structure}
                  onChange={(e) =>
                    setWorkPref(
                      'structure',
                      e.target.value as WorkEnvironmentPreferences['structure']
                    )
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
                >
                  <option value="Terstruktur Jelas">Terstruktur Jelas</option>
                  <option value="Seimbang">Seimbang</option>
                  <option value="Fleksibel Eksploratif">Fleksibel Eksploratif</option>
                </select>
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Tanggung Jawab</label>
                <select
                  aria-label="Fokus tanggung jawab"
                  value={intrapersonal.workPreferences.responsibility}
                  onChange={(e) =>
                    setWorkPref(
                      'responsibility',
                      e.target.value as WorkEnvironmentPreferences['responsibility']
                    )
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
                >
                  <option value="Fokus Teknis">Fokus Teknis</option>
                  <option value="Seimbang">Seimbang</option>
                  <option value="Fokus Interpersonal">Fokus Interpersonal</option>
                </select>
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Pengambilan Keputusan</label>
                <select
                  aria-label="Gaya pengambilan keputusan"
                  value={intrapersonal.workPreferences.decisionStyle}
                  onChange={(e) =>
                    setWorkPref(
                      'decisionStyle',
                      e.target.value as WorkEnvironmentPreferences['decisionStyle']
                    )
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
                >
                  <option value="Keputusan Mandiri">Keputusan Mandiri</option>
                  <option value="Seimbang">Seimbang</option>
                  <option value="Koordinasi Tim">Koordinasi Tim</option>
                </select>
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Ritme Kerja</label>
                <select
                  aria-label="Ritme kerja"
                  value={intrapersonal.workPreferences.pace}
                  onChange={(e) =>
                    setWorkPref('pace', e.target.value as WorkEnvironmentPreferences['pace'])
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
                >
                  <option value="Ritme Terprediksi">Ritme Terprediksi</option>
                  <option value="Bervariasi">Bervariasi</option>
                  <option value="Ritme Dinamis">Ritme Dinamis</option>
                </select>
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Visibilitas Publik</label>
                <select
                  aria-label="Visibilitas kerja"
                  value={intrapersonal.workPreferences.visibility}
                  onChange={(e) =>
                    setWorkPref(
                      'visibility',
                      e.target.value as WorkEnvironmentPreferences['visibility']
                    )
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
                >
                  <option value="Di Balik Layar">Di Balik Layar</option>
                  <option value="Seimbang">Seimbang</option>
                  <option value="Berhadapan Publik">Berhadapan Publik</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-800 mb-1">
                Aspirasi atau Bidang Profesi yang Sedang Terbayang (opsional):
              </label>
              <input
                type="text"
                placeholder="Mis. Peneliti, konsultan, psikolog, analis kebijakan, pengacara bisnis, product manager, atau belum tahu sama sekali"
                value={intrapersonal.careerAspirationsNotes}
                onChange={(e) =>
                  onChangeIntrapersonal({
                    ...intrapersonal,
                    careerAspirationsNotes: e.target.value,
                  })
                }
                className="w-full px-3 py-2 border border-slate-300 rounded-lg"
              />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setStep(3)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Kembali ke Kognitif &amp; Motivasi
              </button>
              <button
                type="button"
                disabled={saving}
                onClick={handleFinish}
                className="inline-flex items-center gap-2 px-5 py-2.5 font-semibold text-white bg-indigo-700 hover:bg-indigo-800 rounded-lg disabled:opacity-60"
              >
                <CheckCircle2 className="w-4 h-4" />
                {saving
                  ? 'Menyimpan...'
                  : account
                  ? 'Simpan & Buka Hasil Analisis Terpadu (A–I)'
                  : 'Tampilkan Hasil Analisis Terpadu (A–I)'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
