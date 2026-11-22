import React, { useState } from 'react';
import { BookOpen, CheckSquare, Plus, Trash2, Users } from 'lucide-react';
import {
  ACADEMIC_COLLABORATION_CHALLENGES,
  SMA_SUBJECT_GUIDES,
} from '../data/communicationAndAcademicData';
import { ENNEAGRAM_TYPES } from '../data/enneagramData';
import { JUNGIAN_NOTATIONS, SOCIONICS_TYPES } from '../data/socionicsData';
import type {
  AcademicReflectionRecord,
  Account,
  LearningPreferences,
  Profile,
  SocionicsCode,
  StudyGroup,
  StudyGroupRole,
  StudyGroupTask,
} from '../types/dynamap';

interface PembelajaranAkademikViewProps {
  profiles: Profile[];
  account: Account | null;
  myProfile: Profile | null;
  studyGroups: StudyGroup[];
  academicReflections: AcademicReflectionRecord[];
  onSaveLearningPreferences: (prefs: LearningPreferences) => Promise<void>;
  onStudyGroupCreated: (group: StudyGroup) => void;
  onStudyGroupUpdated: (group: StudyGroup) => void;
  onAcademicReflectionCreated: (rec: AcademicReflectionRecord) => void;
  onAcademicReflectionDeleted: (id: string) => void;
}

const STUDY_ROLES: StudyGroupRole[] = [
  'Koordinator',
  'Peneliti',
  'Analis Data',
  'Penulis Laporan',
  'Presenter',
  'Desainer Visual',
  'Evaluator',
  'Dokumentator',
];

export const PembelajaranAkademikView: React.FC<PembelajaranAkademikViewProps> = ({
  profiles,
  account,
  myProfile,
  studyGroups,
  academicReflections,
  onSaveLearningPreferences,
  onStudyGroupCreated,
  onStudyGroupUpdated,
  onAcademicReflectionCreated,
  onAcademicReflectionDeleted,
}) => {
  const [tab, setTab] = useState<'preferences' | 'typology' | 'subjects' | 'groups'>('preferences');
  const [prefs, setPrefs] = useState<LearningPreferences>(
    myProfile?.learningPreferences || {
      studySetting: '',
      explanationStyle: '',
      structureStyle: '',
      workMode: '',
      examplePreference: '',
      feedbackStyle: '',
      sessionLength: '',
      notes: '',
    }
  );
  const [prefSavedMsg, setPrefSavedMsg] = useState('');

  // Typology study explorer state
  const [exploreSoc, setExploreSoc] = useState<SocionicsCode>(
    myProfile?.typology.socionics || 'LIE'
  );
  const [exploreEnn, setExploreEnn] = useState<number>(
    myProfile?.typology.enneagramCore || 3
  );
  const [exploreJung, setExploreJung] = useState<string>(
    myProfile?.typology.jungian || 'ET(N)'
  );

  // Study group planner state
  const [groupName, setGroupName] = useState('');
  const [groupSubject, setGroupSubject] = useState('Matematika');
  const [groupTopic, setGroupTopic] = useState('');
  const [groupGoals, setGroupGoals] = useState('');
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);

  // New task on selected study group
  const [activeGroupId, setActiveGroupId] = useState<string>(studyGroups[0]?.id || '');
  const [taskTitle, setTaskTitle] = useState('');
  const [taskAssigneeId, setTaskAssigneeId] = useState('');
  const [taskRole, setTaskRole] = useState<StudyGroupRole>('Peneliti');
  const [taskDeadline, setTaskDeadline] = useState('');

  // Academic reflection state
  const [reflSubject, setReflSubject] = useState('Matematika');
  const [reflContribution, setReflContribution] = useState('');
  const [reflApproach, setReflApproach] = useState('');
  const [reflDiff, setReflDiff] = useState('');
  const [reflFeedback, setReflFeedback] = useState('');
  const [reflEffective, setReflEffective] = useState('');
  const [reflImprove, setReflImprove] = useState('');

  const activeProfiles = profiles.filter((p) => !p.archived);
  const activeGroup = studyGroups.find((g) => g.id === activeGroupId) || studyGroups[0] || null;

  async function handleSavePrefs(e: React.FormEvent) {
    e.preventDefault();
    setPrefSavedMsg('');
    await onSaveLearningPreferences(prefs);
    setPrefSavedMsg('Preferensi belajar mandiri berhasil disimpan ke profil Anda.');
  }

  async function handleCreateGroup(e: React.FormEvent) {
    e.preventDefault();
    if (!groupName.trim()) return;
    const token = localStorage.getItem('dynamap_token');
    const res = await fetch('/api/study-groups', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({
        name: groupName,
        subject: groupSubject,
        topic: groupTopic,
        learningGoals: groupGoals,
        memberProfileIds: selectedMembers,
        tasks: [],
      }),
    });
    const data = await res.json();
    if (res.ok) {
      onStudyGroupCreated(data.group);
      setActiveGroupId(data.group.id);
      setGroupName('');
      setGroupTopic('');
      setGroupGoals('');
      setSelectedMembers([]);
    }
  }

  async function handleAddTask(e: React.FormEvent) {
    e.preventDefault();
    if (!activeGroup || !taskTitle.trim()) return;
    const assignee = activeProfiles.find((p) => p.id === taskAssigneeId);
    const newTask: StudyGroupTask = {
      id: `task-${Date.now()}`,
      title: taskTitle.trim(),
      assigneeProfileId: assignee?.id || '',
      assigneeName: assignee?.displayName || 'Belum ditentukan',
      role: taskRole,
      deadline: taskDeadline || '-',
      status: 'Belum Mulai',
      contributionNote: '',
    };
    const res = await fetch(`/api/study-groups/${activeGroup.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tasks: [...activeGroup.tasks, newTask] }),
    });
    const data = await res.json();
    if (res.ok) {
      onStudyGroupUpdated(data.group);
      setTaskTitle('');
      setTaskDeadline('');
    }
  }

  async function handleUpdateTaskStatus(taskId: string, status: StudyGroupTask['status']) {
    if (!activeGroup) return;
    const updatedTasks = activeGroup.tasks.map((t) =>
      t.id === taskId ? { ...t, status } : t
    );
    const res = await fetch(`/api/study-groups/${activeGroup.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tasks: updatedTasks }),
    });
    const data = await res.json();
    if (res.ok) onStudyGroupUpdated(data.group);
  }

  async function handleCreateAcademicReflection(e: React.FormEvent) {
    e.preventDefault();
    const token = localStorage.getItem('dynamap_token');
    if (!token) return;
    const res = await fetch('/api/reflections/academic', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        subject: reflSubject,
        contribution: reflContribution,
        studyApproach: reflApproach,
        collaborationDifficulty: reflDiff,
        feedbackReceived: reflFeedback,
        effectiveStrategies: reflEffective,
        improvementAreas: reflImprove,
      }),
    });
    const data = await res.json();
    if (res.ok) {
      onAcademicReflectionCreated(data.record);
      setReflContribution('');
      setReflApproach('');
      setReflDiff('');
      setReflFeedback('');
      setReflEffective('');
      setReflImprove('');
    }
  }

  async function handleDeleteAcademicReflection(id: string) {
    const token = localStorage.getItem('dynamap_token');
    if (!token) return;
    const res = await fetch(`/api/reflections/academic/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) onAcademicReflectionDeleted(id);
  }

  const socLearning = SOCIONICS_TYPES[exploreSoc].learningApproaches;
  const ennSpec = ENNEAGRAM_TYPES[exploreEnn as keyof typeof ENNEAGRAM_TYPES];
  const jungSpec = JUNGIAN_NOTATIONS[exploreJung];

  return (
    <div className="space-y-8">
      <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-slate-900">
            Pembelajaran &amp; Kolaborasi Akademik SMA
          </h1>
          <p className="text-sm text-slate-600 mt-1 max-w-3xl">
            Eksplorasi strategi belajar berbasis bukti pendidikan dan hipotesis tipologi—tanpa
            mengotak-ngotakkan kecerdasan, nilai akademik, atau kemampuan belajar siswa berdasarkan tipe kepribadian.
          </p>
        </div>

        <div className="flex flex-wrap gap-1 p-1 bg-slate-100 rounded-lg w-fit">
          {[
            { id: 'preferences' as const, label: 'Preferensi Belajar Saya' },
            { id: 'typology' as const, label: 'Eksplorasi Belajar (Hipotesis Tipologi)' },
            { id: 'subjects' as const, label: 'Panduan Mata Pelajaran SMA' },
            { id: 'groups' as const, label: 'Kelompok Belajar & Refleksi Akademik' },
          ].map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={`px-3.5 py-2 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                tab === t.id ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* TAB 1: LEARNING PREFERENCES */}
      {tab === 'preferences' && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-5">
          <div>
            <h2 className="text-lg font-display font-semibold text-slate-900">
              Catatan Preferensi Belajar Mandiri (Bukan Gaya Belajar Tetap)
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Preferensi dapat berubah mengikuti mata pelajaran dan pengalaman nyata. DYNAMAP tidak menyimpulkan preferensi belajar atau kemampuan akademik dari kode tipe kepribadian.
            </p>
          </div>

          <form onSubmit={handleSavePrefs} className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <label htmlFor="pref-setting" className="block text-xs font-medium text-slate-700 mb-1">
                Suasana Belajar
              </label>
              <select
                id="pref-setting"
                value={prefs.studySetting}
                onChange={(e) => setPrefs({ ...prefs, studySetting: e.target.value as LearningPreferences['studySetting'] })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white text-sm"
              >
                <option value="">-- Belum dipilih --</option>
                <option value="Mandiri">Belajar Mandiri</option>
                <option value="Kelompok">Belajar Kelompok</option>
                <option value="Fleksibel">Fleksibel Sesuai Materi</option>
              </select>
            </div>

            <div>
              <label htmlFor="pref-exp" className="block text-xs font-medium text-slate-700 mb-1">
                Format Penjelasan
              </label>
              <select
                id="pref-exp"
                value={prefs.explanationStyle}
                onChange={(e) => setPrefs({ ...prefs, explanationStyle: e.target.value as LearningPreferences['explanationStyle'] })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white text-sm"
              >
                <option value="">-- Belum dipilih --</option>
                <option value="Verbal / Naratif">Verbal / Naratif</option>
                <option value="Visual / Diagram">Visual / Diagram</option>
                <option value="Campuran">Campuran Verbal &amp; Visual</option>
              </select>
            </div>

            <div>
              <label htmlFor="pref-struct" className="block text-xs font-medium text-slate-700 mb-1">
                Struktur Jadwal
              </label>
              <select
                id="pref-struct"
                value={prefs.structureStyle}
                onChange={(e) => setPrefs({ ...prefs, structureStyle: e.target.value as LearningPreferences['structureStyle'] })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white text-sm"
              >
                <option value="">-- Belum dipilih --</option>
                <option value="Terstruktur & Terjadwal">Terstruktur &amp; Terjadwal</option>
                <option value="Fleksibel & Eksploratif">Fleksibel &amp; Eksploratif</option>
                <option value="Campuran">Campuran</option>
              </select>
            </div>

            <div>
              <label htmlFor="pref-work" className="block text-xs font-medium text-slate-700 mb-1">
                Mode Pemrosesan Tugas
              </label>
              <select
                id="pref-work"
                value={prefs.workMode}
                onChange={(e) => setPrefs({ ...prefs, workMode: e.target.value as LearningPreferences['workMode'] })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white text-sm"
              >
                <option value="">-- Belum dipilih --</option>
                <option value="Diskusi Aktif">Diskusi Aktif</option>
                <option value="Kerja Mandiri Mendalam">Kerja Mandiri Mendalam</option>
                <option value="Kombinasi">Kombinasi Diskusi + Mandiri</option>
              </select>
            </div>

            <div>
              <label htmlFor="pref-ex" className="block text-xs font-medium text-slate-700 mb-1">
                Urutan Pemahaman Materi
              </label>
              <select
                id="pref-ex"
                value={prefs.examplePreference}
                onChange={(e) => setPrefs({ ...prefs, examplePreference: e.target.value as LearningPreferences['examplePreference'] })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white text-sm"
              >
                <option value="">-- Belum dipilih --</option>
                <option value="Contoh Konkret Terlebih Dahulu">Contoh Konkret Terlebih Dahulu</option>
                <option value="Konsep Abstrak Terlebih Dahulu">Konsep Abstrak Terlebih Dahulu</option>
                <option value="Seimbang">Seimbang Keduanya</option>
              </select>
            </div>

            <div>
              <label htmlFor="pref-fb" className="block text-xs font-medium text-slate-700 mb-1">
                Preferensi Umpan Balik
              </label>
              <select
                id="pref-fb"
                value={prefs.feedbackStyle}
                onChange={(e) => setPrefs({ ...prefs, feedbackStyle: e.target.value as LearningPreferences['feedbackStyle'] })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white text-sm"
              >
                <option value="">-- Belum dipilih --</option>
                <option value="Umpan Balik Langsung & Lugas">Umpan Balik Langsung &amp; Lugas</option>
                <option value="Umpan Balik Bertahap & Halus">Umpan Balik Bertahap &amp; Halus</option>
                <option value="Diskusi Dua Arah">Diskusi Dua Arah</option>
              </select>
            </div>

            <div>
              <label htmlFor="pref-len" className="block text-xs font-medium text-slate-700 mb-1">
                Durasi Sesi Fokus
              </label>
              <select
                id="pref-len"
                value={prefs.sessionLength}
                onChange={(e) => setPrefs({ ...prefs, sessionLength: e.target.value as LearningPreferences['sessionLength'] })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white text-sm"
              >
                <option value="">-- Belum dipilih --</option>
                <option value="Sesi Singkat Terfokus (25-30 menit)">Sesi Singkat Terfokus (25-30 menit)</option>
                <option value="Sesi Panjang Mendalam (60+ menit)">Sesi Panjang Mendalam (60+ menit)</option>
                <option value="Bervariasi">Bervariasi</option>
              </select>
            </div>

            <div>
              <label htmlFor="pref-notes" className="block text-xs font-medium text-slate-700 mb-1">
                Catatan Tambahan Pribadi
              </label>
              <input
                id="pref-notes"
                type="text"
                value={prefs.notes}
                onChange={(e) => setPrefs({ ...prefs, notes: e.target.value })}
                placeholder="Mis. lebih fokus belajar pagi sebelum sekolah"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
              />
            </div>

            <div className="md:col-span-2 flex flex-wrap items-center gap-3 pt-2">
              {account?.linkedProfileId ? (
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-medium text-white bg-indigo-700 hover:bg-indigo-800 rounded-lg transition-colors"
                >
                  Simpan Preferensi Belajar ke Profil Saya
                </button>
              ) : (
                <span className="text-xs text-slate-500">
                  Masuk dengan akun yang tertaut ke profil untuk menyimpan preferensi ini secara permanen.
                </span>
              )}
              {prefSavedMsg && (
                <span className="text-xs font-medium text-emerald-700">{prefSavedMsg}</span>
              )}
            </div>
          </form>
        </div>
      )}

      {/* TAB 2: PERSONALITY-BASED LEARNING HYPOTHESES */}
      {tab === 'typology' && (
        <div className="space-y-6">
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs text-amber-950">
            <strong>Hipotesis Eksperimental (Bukan Aturan Kaku):</strong> Seluruh saran di bawah ini
            hanyalah ide awal untuk diuji coba oleh siswa. Tidak ada satu tipe pun yang wajib belajar
            dengan satu cara tertentu—evaluasi sendiri mana metode yang paling efektif dalam praktik nyata.
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label htmlFor="learn-soc" className="block text-xs font-medium text-slate-700 mb-1">
                  Tipe Socionics
                </label>
                <select
                  id="learn-soc"
                  value={exploreSoc}
                  onChange={(e) => setExploreSoc(e.target.value as SocionicsCode)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg bg-white"
                >
                  {(Object.keys(SOCIONICS_TYPES) as SocionicsCode[]).map((c) => (
                    <option key={c} value={c}>
                      {c} — {SOCIONICS_TYPES[c].indonesianTitle}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="learn-enn" className="block text-xs font-medium text-slate-700 mb-1">
                  Enneagram Inti (Motivasi &amp; Emosi Belajar)
                </label>
                <select
                  id="learn-enn"
                  value={exploreEnn}
                  onChange={(e) => setExploreEnn(Number(e.target.value))}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg bg-white"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
                    <option key={n} value={n}>
                      Tipe {n}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="learn-jung" className="block text-xs font-medium text-slate-700 mb-1">
                  Notasi Tipologi Jung
                </label>
                <select
                  id="learn-jung"
                  value={exploreJung}
                  onChange={(e) => setExploreJung(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg bg-white"
                >
                  {Object.keys(JUNGIAN_NOTATIONS).map((j) => (
                    <option key={j} value={j}>
                      {j}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-700 pt-2">
              <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-1.5">
                <strong className="text-slate-900 block">Memahami Materi Abstrak</strong>
                <p>{socLearning.abstractMaterial}</p>
              </div>
              <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-1.5">
                <strong className="text-slate-900 block">Mengorganisasi Informasi</strong>
                <p>{socLearning.organizingInfo}</p>
              </div>
              <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-1.5">
                <strong className="text-slate-900 block">Belajar lewat Contoh Praktis</strong>
                <p>{socLearning.practicalExamples}</p>
              </div>
              <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-1.5">
                <strong className="text-slate-900 block">Memecahkan Masalah</strong>
                <p>{socLearning.problemSolving}</p>
              </div>
              <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-1.5">
                <strong className="text-slate-900 block">Mengulas Materi (Review)</strong>
                <p>{socLearning.reviewing}</p>
              </div>
              <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-1.5">
                <strong className="text-slate-900 block">Mengelola Tugas &amp; Tenggat</strong>
                <p>{socLearning.managingAssignments}</p>
              </div>
              <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-1.5">
                <strong className="text-slate-900 block">Berpartisipasi dalam Diskusi</strong>
                <p>{socLearning.discussions}</p>
              </div>
              <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-1.5">
                <strong className="text-slate-900 block">Menyiapkan Presentasi</strong>
                <p>{socLearning.presentations}</p>
              </div>
              <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-1.5">
                <strong className="text-slate-900 block">Bekerja dalam Kelompok</strong>
                <p>{socLearning.groupWork}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-slate-200 text-xs sm:text-sm text-slate-700">
              {ennSpec && (
                <div className="p-4 rounded-lg bg-indigo-50/70 border border-indigo-200">
                  <strong className="text-indigo-950 block mb-1">
                    Pertimbangan Motivasi &amp; Emosi Belajar (Enneagram Tipe {exploreEnn})
                  </strong>
                  <p>{ennSpec.learningConsiderations}</p>
                </div>
              )}
              {jungSpec && (
                <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
                  <strong className="text-slate-900 block mb-1">
                    Hipotesis Pemrosesan Informasi (Notasi {exploreJung})
                  </strong>
                  <p>{jungSpec.learningHypothesis}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: SUBJECT-BASED STUDY SUGGESTIONS */}
      {tab === 'subjects' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {SMA_SUBJECT_GUIDES.map((subj) => (
            <div key={subj.subject} className="bg-white border border-slate-200 rounded-xl p-5 space-y-3">
              <div className="flex items-center justify-between gap-2">
                <h2 className="text-lg font-display font-bold text-slate-900">{subj.subject}</h2>
                <BookOpen className="w-4 h-4 text-indigo-600 shrink-0" />
              </div>
              <div className="text-xs text-slate-600">
                <strong>Tantangan Umum:</strong> {subj.coreChallenges.join(' · ')}
              </div>
              <div className="space-y-2.5">
                {subj.recommendedMethods.map((m, idx) => (
                  <div key={idx} className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs space-y-1">
                    <div className="font-semibold text-slate-900">{m.method}</div>
                    <p className="text-slate-600">{m.whyItWorks}</p>
                    <p className="text-indigo-900">
                      <strong>Praktik:</strong> {m.howToApply}
                    </p>
                  </div>
                ))}
              </div>
              <div className="text-xs text-slate-700 pt-1">
                <strong>Ide Kolaborasi Kelompok:</strong> {subj.groupCollaborationIdea}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 4: STUDY GROUP PLANNER & COLLABORATION + ACADEMIC REFLECTION */}
      {tab === 'groups' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Create Study Group */}
            <form
              onSubmit={handleCreateGroup}
              className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-5 space-y-4"
            >
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-indigo-700" />
                <h2 className="text-base font-display font-semibold text-slate-900">
                  Buat Kelompok Belajar Baru
                </h2>
              </div>
              <p className="text-xs text-slate-500">
                Pembagian peran didasarkan pada kompetensi, minat, beban kerja, dan persetujuan anggota—bukan tipe kepribadian.
              </p>

              <div>
                <label htmlFor="sg-name" className="block text-xs font-medium text-slate-700 mb-1">
                  Nama Kelompok *
                </label>
                <input
                  id="sg-name"
                  type="text"
                  required
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  placeholder="Contoh: Kelompok Praktikum Fisika Gelombang"
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="sg-subj" className="block text-xs font-medium text-slate-700 mb-1">
                    Mata Pelajaran
                  </label>
                  <input
                    id="sg-subj"
                    type="text"
                    required
                    value={groupSubject}
                    onChange={(e) => setGroupSubject(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label htmlFor="sg-topic" className="block text-xs font-medium text-slate-700 mb-1">
                    Topik
                  </label>
                  <input
                    id="sg-topic"
                    type="text"
                    value={groupTopic}
                    onChange={(e) => setGroupTopic(e.target.value)}
                    placeholder="Mis. Difraksi Cahaya"
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="sg-goals" className="block text-xs font-medium text-slate-700 mb-1">
                  Tujuan Belajar Bersama
                </label>
                <input
                  id="sg-goals"
                  type="text"
                  value={groupGoals}
                  onChange={(e) => setGroupGoals(e.target.value)}
                  placeholder="Target capaian materi dan laporan"
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <span className="block text-xs font-medium text-slate-700 mb-1.5">
                  Pilih Anggota dari Database ({selectedMembers.length} dipilih)
                </span>
                <div className="max-h-36 overflow-y-auto border border-slate-200 rounded-lg p-2 grid grid-cols-2 gap-1 text-xs">
                  {activeProfiles.map((p) => {
                    const checked = selectedMembers.includes(p.id);
                    return (
                      <label key={p.id} className="flex items-center gap-1.5 px-1.5 py-1 hover:bg-slate-50 rounded cursor-pointer">
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={(e) =>
                            setSelectedMembers((prev) =>
                              e.target.checked ? [...prev, p.id] : prev.filter((id) => id !== p.id)
                            )
                          }
                        />
                        <span className="truncate">{p.displayName}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 text-xs font-medium text-white bg-indigo-700 hover:bg-indigo-800 rounded-lg transition-colors"
              >
                Buat Kelompok Belajar
              </button>
            </form>

            {/* Active Study Group & Task Tracker */}
            <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-6 space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h2 className="text-lg font-display font-semibold text-slate-900">
                  Perencana Tugas &amp; Pelacakan Progres
                </h2>
                {studyGroups.length > 0 && (
                  <select
                    aria-label="Pilih kelompok belajar aktif"
                    value={activeGroup?.id || ''}
                    onChange={(e) => setActiveGroupId(e.target.value)}
                    className="px-3 py-1.5 text-xs border border-slate-300 rounded-lg bg-white"
                  >
                    {studyGroups.map((g) => (
                      <option key={g.id} value={g.id}>
                        {g.name} ({g.subject})
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {activeGroup ? (
                <div className="space-y-4">
                  <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 text-xs space-y-1">
                    <div className="text-sm font-semibold text-slate-900">
                      {activeGroup.name} · {activeGroup.subject}
                    </div>
                    {activeGroup.topic && <p className="text-slate-700">Topik: {activeGroup.topic}</p>}
                    {activeGroup.learningGoals && (
                      <p className="text-slate-600">Tujuan: {activeGroup.learningGoals}</p>
                    )}
                    <p className="text-slate-600 pt-1">
                      Anggota:{' '}
                      {activeGroup.memberProfileIds.length > 0
                        ? activeGroup.memberProfileIds
                            .map((id) => activeProfiles.find((p) => p.id === id)?.displayName || id)
                            .join(', ')
                        : 'Belum ada anggota dipilih'}
                    </p>
                  </div>

                  {/* Add Task Form */}
                  <form onSubmit={handleAddTask} className="grid grid-cols-1 sm:grid-cols-12 gap-2 items-end">
                    <div className="sm:col-span-4">
                      <label htmlFor="task-title" className="block text-[11px] text-slate-600 mb-1">
                        Tugas / Tanggung Jawab
                      </label>
                      <input
                        id="task-title"
                        type="text"
                        required
                        value={taskTitle}
                        onChange={(e) => setTaskTitle(e.target.value)}
                        placeholder="Mis. Analisis tabel data"
                        className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg"
                      />
                    </div>
                    <div className="sm:col-span-3">
                      <label htmlFor="task-assignee" className="block text-[11px] text-slate-600 mb-1">
                        Penanggung Jawab
                      </label>
                      <select
                        id="task-assignee"
                        value={taskAssigneeId}
                        onChange={(e) => setTaskAssigneeId(e.target.value)}
                        className="w-full px-2 py-1.5 text-xs border border-slate-300 rounded-lg bg-white"
                      >
                        <option value="">Pilih anggota</option>
                        {(activeGroup.memberProfileIds.length > 0
                          ? activeProfiles.filter((p) => activeGroup.memberProfileIds.includes(p.id))
                          : activeProfiles
                        ).map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.displayName}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="sm:col-span-2">
                      <label htmlFor="task-role" className="block text-[11px] text-slate-600 mb-1">
                        Peran
                      </label>
                      <select
                        id="task-role"
                        value={taskRole}
                        onChange={(e) => setTaskRole(e.target.value as StudyGroupRole)}
                        className="w-full px-2 py-1.5 text-xs border border-slate-300 rounded-lg bg-white"
                      >
                        {STUDY_ROLES.map((r) => (
                          <option key={r} value={r}>
                            {r}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="sm:col-span-2">
                      <label htmlFor="task-dl" className="block text-[11px] text-slate-600 mb-1">
                        Tenggat
                      </label>
                      <input
                        id="task-dl"
                        type="date"
                        value={taskDeadline}
                        onChange={(e) => setTaskDeadline(e.target.value)}
                        className="w-full px-2 py-1.5 text-xs border border-slate-300 rounded-lg"
                      />
                    </div>
                    <div className="sm:col-span-1">
                      <button
                        type="submit"
                        aria-label="Tambah tugas kelompok"
                        className="w-full py-1.5 px-2.5 bg-indigo-700 hover:bg-indigo-800 text-white rounded-lg flex items-center justify-center"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </form>

                  {/* Tasks List */}
                  <div className="divide-y divide-slate-200 border border-slate-200 rounded-lg">
                    {activeGroup.tasks.length === 0 ? (
                      <div className="p-4 text-xs text-slate-500 text-center">
                        Belum ada tugas tercatat. Tambahkan tugas di atas.
                      </div>
                    ) : (
                      activeGroup.tasks.map((t) => (
                        <div key={t.id} className="p-3 flex flex-wrap items-center justify-between gap-2 text-xs">
                          <div>
                            <div className="font-semibold text-slate-900">{t.title}</div>
                            <div className="text-slate-600 mt-0.5">
                              {t.assigneeName} · Peran: {t.role} · Tenggat:{' '}
                              <span className="font-mono tabular-nums">{t.deadline}</span>
                            </div>
                          </div>
                          <select
                            aria-label={`Status tugas ${t.title}`}
                            value={t.status}
                            onChange={(e) =>
                              handleUpdateTaskStatus(t.id, e.target.value as StudyGroupTask['status'])
                            }
                            className="px-2.5 py-1 text-xs border border-slate-300 rounded-md bg-white"
                          >
                            <option value="Belum Mulai">Belum Mulai</option>
                            <option value="Sedang Dikerjakan">Sedang Dikerjakan</option>
                            <option value="Selesai">Selesai</option>
                          </select>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              ) : (
                <p className="text-sm text-slate-500">Buat kelompok belajar pertama di formulir kiri.</p>
              )}
            </div>
          </div>

          {/* Academic Collaboration Analysis */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
            <h2 className="text-lg font-display font-semibold text-slate-900">
              Analisis Tantangan Kolaborasi Akademik &amp; Strategi Mengatasinya
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {ACADEMIC_COLLABORATION_CHALLENGES.map((item) => (
                <div key={item.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2">
                  <h3 className="text-sm font-display font-semibold text-slate-900">
                    {item.challenge}
                  </h3>
                  <p className="text-slate-600">
                    <strong>Akar Umum:</strong> {item.rootCauses.join(' ')}
                  </p>
                  <ul className="list-disc pl-4 space-y-1 text-slate-700">
                    {item.practicalStrategies.map((st, i) => (
                      <li key={i}>{st}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Private Academic Reflection */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-5">
            <div className="flex items-center justify-between gap-2">
              <div>
                <h2 className="text-lg font-display font-semibold text-slate-900">
                  Refleksi Akademik Pribadi (Privat Secara Default)
                </h2>
                <p className="text-xs text-slate-500">
                  Evaluasi kontribusi, pendekatan belajar, umpan balik yang diterima, dan hal yang ingin diperbaiki pada proyek berikutnya.
                </p>
              </div>
              <CheckSquare className="w-5 h-5 text-indigo-700 shrink-0" />
            </div>

            {account ? (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <form onSubmit={handleCreateAcademicReflection} className="lg:col-span-5 space-y-3 text-xs">
                  <div>
                    <label htmlFor="ar-subj" className="block font-medium text-slate-700 mb-1">
                      Mata Pelajaran / Proyek *
                    </label>
                    <input
                      id="ar-subj"
                      type="text"
                      required
                      value={reflSubject}
                      onChange={(e) => setReflSubject(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                    />
                  </div>
                  <div>
                    <label htmlFor="ar-contrib" className="block font-medium text-slate-700 mb-1">
                      Kontribusi Nyata Saya *
                    </label>
                    <textarea
                      id="ar-contrib"
                      required
                      rows={2}
                      value={reflContribution}
                      onChange={(e) => setReflContribution(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="Pendekatan belajar yang dipakai"
                      value={reflApproach}
                      onChange={(e) => setReflApproach(e.target.value)}
                      className="px-3 py-2 border border-slate-300 rounded-lg text-xs"
                    />
                    <input
                      type="text"
                      placeholder="Kesulitan kolaborasi"
                      value={reflDiff}
                      onChange={(e) => setReflDiff(e.target.value)}
                      className="px-3 py-2 border border-slate-300 rounded-lg text-xs"
                    />
                  </div>
                  <input
                    type="text"
                    placeholder="Umpan balik yang diterima dari teman/guru"
                    value={reflFeedback}
                    onChange={(e) => setReflFeedback(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="Strategi yang berhasil"
                      value={reflEffective}
                      onChange={(e) => setReflEffective(e.target.value)}
                      className="px-3 py-2 border border-slate-300 rounded-lg text-xs"
                    />
                    <input
                      type="text"
                      placeholder="Area perbaikan berikutnya"
                      value={reflImprove}
                      onChange={(e) => setReflImprove(e.target.value)}
                      className="px-3 py-2 border border-slate-300 rounded-lg text-xs"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-2 px-4 text-xs font-medium text-white bg-indigo-700 hover:bg-indigo-800 rounded-lg"
                  >
                    Simpan Refleksi Akademik Privat
                  </button>
                </form>

                <div className="lg:col-span-7 space-y-3">
                  {academicReflections.length === 0 ? (
                    <p className="text-xs text-slate-500 p-4 rounded-lg bg-slate-50 border border-slate-200">
                      Belum ada catatan refleksi akademik pribadi.
                    </p>
                  ) : (
                    academicReflections.map((rec) => (
                      <div key={rec.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1.5">
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-semibold text-slate-900">
                            {rec.subject} · <span className="font-mono">{rec.date}</span>
                          </span>
                          <button
                            type="button"
                            onClick={() => handleDeleteAcademicReflection(rec.id)}
                            aria-label={`Hapus refleksi ${rec.subject}`}
                            className="text-slate-400 hover:text-red-600"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <p className="text-slate-700">
                          <strong>Kontribusi:</strong> {rec.contribution}
                        </p>
                        {rec.effectiveStrategies && (
                          <p className="text-emerald-900">
                            <strong>Strategi berhasil:</strong> {rec.effectiveStrategies}
                          </p>
                        )}
                        {rec.improvementAreas && (
                          <p className="text-indigo-900">
                            <strong>Area perbaikan:</strong> {rec.improvementAreas}
                          </p>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-500">
                Silakan masuk ke akun Anda untuk mencatat dan melihat refleksi akademik pribadi yang tersimpan secara privat.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
