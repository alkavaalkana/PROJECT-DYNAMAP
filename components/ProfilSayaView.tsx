import React, { useMemo, useState } from 'react';
import { AlertTriangle, Camera, IdCard, Plus, ShieldCheck, Sparkles, Trash2, UserCheck } from 'lucide-react';
import { SOCIONICS_TYPES } from '../data/socionicsData';
import { ALL_16_MBTI_PROFILES, CLASSICAL_4_TEMPERAMENTS } from '../data/extendedTheoryData';
import { resolveMbtiCognitiveStack } from '../lib/interpretationEngine';
import { parsePsychosophyPositions, validatePsychosophyCode } from '../lib/psychosophy';
import { parseExtendedSloanNotation } from '../lib/sloanNotation';
import type {
  Account,
  EnneagramCore,
  GranularVisibilityLevel,
  InstinctCode,
  InstinctualStacking,
  Profile,
  ProfilePrivacySettings,
  PsychosophyConfidence,
  QuadraName,
  SocionicsCode,
  TypologyStatus,
  UserExplorationData,
} from '../types/dynamap';
import type { NavModuleId } from './BerandaView';
import { PersonalInterpretationPanel } from './PersonalInterpretationPanel';
import { ProfileAvatar } from './QuadraUI';

interface ProfilSayaViewProps {
  account: Account | null;
  myProfile: Profile | null;
  exploration?: UserExplorationData | null;
  onSaveExploration?: (next: Partial<UserExplorationData>) => Promise<void>;
  onNavigate?: (moduleId: NavModuleId) => void;
  onOpenAuth: () => void;
  onOpenIdCard?: () => void;
  onProfileUpdated: (profile: Profile) => void;
}

const DEFAULT_PRIVACY_SETTINGS: ProfilePrivacySettings = {
  displayName: 'public',
  fullName: 'admins',
  avatar: 'public',
  typology: 'public',
  bio: 'public',
  reflections: 'private',
  idCard: 'public',
};

const PRIVACY_LEVEL_LABELS: { value: GranularVisibilityLevel; label: string }[] = [
  { value: 'public', label: 'Publik (Semua Pengunjung)' },
  { value: 'classmates', label: 'Teman Kelas (Akun Terhubung)' },
  { value: 'group_members', label: 'Anggota Kelompok Belajar' },
  { value: 'admins', label: 'Hanya Administrator' },
  { value: 'private', label: 'Privat (Hanya Saya)' },
];

const PRIVACY_COMPONENTS: { key: keyof ProfilePrivacySettings; label: string; hint: string }[] = [
  { key: 'displayName', label: 'Nama Tampilan', hint: 'Nama panggilan di galeri & perbandingan' },
  { key: 'fullName', label: 'Nama Lengkap', hint: 'Identitas resmi sekolah' },
  { key: 'avatar', label: 'Foto / Avatar Profil', hint: 'Gambar profil di kartu & daftar' },
  { key: 'typology', label: 'Data Tipologi Lengkap', hint: 'Socionics, MBTI, Enneagram, SLOAN, Temperamen' },
  { key: 'bio', label: 'Bio, Minat & Preferensi', hint: 'Deskripsi singkat & preferensi kerja' },
  { key: 'reflections', label: 'Ringkasan Refleksi Pribadi', hint: 'Catatan refleksi yang bersifat pribadi' },
  { key: 'idCard', label: 'Kartu ID Tipologi', hint: 'Pratinjau & ekspor kartu identitas' },
];

export const ProfilSayaView: React.FC<ProfilSayaViewProps> = ({
  account,
  myProfile,
  exploration = null,
  onSaveExploration,
  onNavigate,
  onOpenAuth,
  onOpenIdCard,
  onProfileUpdated,
}) => {
  const [subTab, setSubTab] = useState<'editor' | 'interpretation' | 'contradictions'>('editor');

  const [displayName, setDisplayName] = useState(myProfile?.displayName || '');
  const [fullName, setFullName] = useState(myProfile?.fullName || '');
  const [bio, setBio] = useState(myProfile?.bio || '');
  const [interestsText, setInterestsText] = useState(
    myProfile?.academicInterests.join(', ') || ''
  );
  const [collabPref, setCollabPref] = useState(myProfile?.collaborationPreferences || '');
  const [visibility, setVisibility] = useState<'public' | 'limited' | 'private'>(
    myProfile?.visibility || 'public'
  );
  const [exposeFullName, setExposeFullName] = useState(myProfile?.exposeFullName || false);
  const [privacySettings, setPrivacySettings] = useState<ProfilePrivacySettings>(
    myProfile?.privacySettings || {
      ...DEFAULT_PRIVACY_SETTINGS,
      fullName: myProfile?.exposeFullName ? 'public' : 'admins',
    }
  );

  const [socionics, setSocionics] = useState<SocionicsCode | ''>(
    myProfile?.typology.socionics || ''
  );
  const [quadra, setQuadra] = useState<QuadraName | ''>(myProfile?.typology.quadra || '');
  const [enneagramCore, setEnneagramCore] = useState<string>(
    myProfile?.typology.enneagramCore ? String(myProfile.typology.enneagramCore) : ''
  );
  const [instinctVariant, setInstinctVariant] = useState<InstinctCode | ''>(
    myProfile?.typology.instinctVariant || ''
  );
  const [enneagramWing, setEnneagramWing] = useState(myProfile?.typology.enneagramWing || '');
  const [instinctStacking, setInstinctStacking] = useState<InstinctualStacking | ''>(
    myProfile?.typology.instinctStacking || ''
  );
  const [threeFix, setThreeFix] = useState(myProfile?.typology.threeFix || '');
  const [trifix, setTrifix] = useState(myProfile?.typology.trifix || '');
  const [tritype, setTritype] = useState(myProfile?.typology.tritype || '');
  const [jungian, setJungian] = useState(myProfile?.typology.jungian || '');
  const [psychosophyCode, setPsychosophyCode] = useState(myProfile?.typology.psychosophyCode || '');
  const [psychosophyConfidence, setPsychosophyConfidence] = useState<PsychosophyConfidence>(
    myProfile?.typology.psychosophyConfidence || 'Belum Dipastikan'
  );
  const [psychosophyProvisional, setPsychosophyProvisional] = useState<boolean>(
    myProfile?.typology.psychosophyProvisional ?? true
  );
  const [psychosophyNotes, setPsychosophyNotes] = useState(myProfile?.typology.psychosophyNotes || '');
  const [mbti, setMbti] = useState(myProfile?.typology.mbti || '');
  const [mbtiCognitiveStack, setMbtiCognitiveStack] = useState(
    myProfile?.typology.mbtiCognitiveStack || ''
  );
  const [sloanCode, setSloanCode] = useState(myProfile?.typology.sloanCode || '');
  const [sloanExtended, setSloanExtended] = useState(myProfile?.typology.sloanExtended || '');
  const [temperament, setTemperament] = useState(myProfile?.typology.temperament || '');
  const [temperamentSecondary, setTemperamentSecondary] = useState(
    myProfile?.typology.temperamentSecondary || ''
  );
  const [status, setStatus] = useState<TypologyStatus>(
    myProfile?.typology.status || 'Self-Reviewed'
  );
  const [customPrefixes, setCustomPrefixes] = useState(
    myProfile?.typology.customPrefixes || []
  );

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const psyValidation = useMemo(() => validatePsychosophyCode(psychosophyCode), [psychosophyCode]);
  const psyParsed = useMemo(() => parsePsychosophyPositions(psychosophyCode), [psychosophyCode]);
  const sloanParsed = useMemo(
    () => parseExtendedSloanNotation(sloanExtended || sloanCode),
    [sloanExtended, sloanCode]
  );
  const resolvedMbtiStack = useMemo(
    () => resolveMbtiCognitiveStack(mbti, mbtiCognitiveStack),
    [mbti, mbtiCognitiveStack]
  );

  React.useEffect(() => {
    if (!myProfile) return;
    setDisplayName(myProfile.displayName);
    setFullName(myProfile.fullName);
    setBio(myProfile.bio);
    setInterestsText(myProfile.academicInterests.join(', '));
    setCollabPref(myProfile.collaborationPreferences);
    setVisibility(myProfile.visibility);
    setExposeFullName(myProfile.exposeFullName);
    setPrivacySettings(
      myProfile.privacySettings || {
        ...DEFAULT_PRIVACY_SETTINGS,
        fullName: myProfile.exposeFullName ? 'public' : 'admins',
      }
    );
    setSocionics(myProfile.typology.socionics);
    setQuadra(myProfile.typology.quadra);
    setEnneagramCore(myProfile.typology.enneagramCore ? String(myProfile.typology.enneagramCore) : '');
    setInstinctVariant(myProfile.typology.instinctVariant);
    setEnneagramWing(myProfile.typology.enneagramWing);
    setInstinctStacking(myProfile.typology.instinctStacking);
    setThreeFix(myProfile.typology.threeFix);
    setTrifix(myProfile.typology.trifix);
    setTritype(myProfile.typology.tritype);
    setJungian(myProfile.typology.jungian);
    setPsychosophyCode(myProfile.typology.psychosophyCode || '');
    setPsychosophyConfidence(myProfile.typology.psychosophyConfidence || 'Belum Dipastikan');
    setPsychosophyProvisional(myProfile.typology.psychosophyProvisional ?? true);
    setPsychosophyNotes(myProfile.typology.psychosophyNotes || '');
    setMbti(myProfile.typology.mbti || '');
    setMbtiCognitiveStack(myProfile.typology.mbtiCognitiveStack || '');
    setSloanCode(myProfile.typology.sloanCode || '');
    setSloanExtended(myProfile.typology.sloanExtended || '');
    setTemperament(myProfile.typology.temperament || '');
    setTemperamentSecondary(myProfile.typology.temperamentSecondary || '');
    setStatus(myProfile.typology.status);
    setCustomPrefixes(myProfile.typology.customPrefixes);
  }, [myProfile]);

  const draftProfileForPreview = useMemo<Profile | null>(() => {
    if (!myProfile) return null;
    const coreNum = enneagramCore ? (Number(enneagramCore) as EnneagramCore) : null;
    const derivedQuadra = socionics ? SOCIONICS_TYPES[socionics].quadra : quadra;
    return {
      ...myProfile,
      displayName,
      fullName,
      bio,
      typology: {
        ...myProfile.typology,
        socionics,
        quadra: derivedQuadra,
        enneagramCore: coreNum,
        instinctVariant,
        enneagramWing,
        instinctStacking,
        threeFix,
        trifix,
        tritype,
        jungian,
        psychosophyCode: psyValidation.normalizedCode,
        psychosophyConfidence,
        psychosophyProvisional,
        psychosophyNotes,
        mbti: mbti.trim().toUpperCase(),
        mbtiCognitiveStack: mbtiCognitiveStack.trim(),
        sloanCode: sloanCode.trim().toUpperCase() || sloanParsed.canonicalFiveLetter || '',
        sloanExtended: sloanExtended.trim(),
        temperament: temperament.trim(),
        temperamentSecondary: temperamentSecondary.trim(),
        status,
      },
    };
  }, [
    myProfile,
    displayName,
    fullName,
    bio,
    socionics,
    quadra,
    enneagramCore,
    instinctVariant,
    enneagramWing,
    instinctStacking,
    threeFix,
    trifix,
    tritype,
    jungian,
    psyValidation.normalizedCode,
    psychosophyConfidence,
    psychosophyProvisional,
    psychosophyNotes,
    mbti,
    mbtiCognitiveStack,
    sloanCode,
    sloanParsed.canonicalFiveLetter,
    sloanExtended,
    temperament,
    temperamentSecondary,
    status,
  ]);

  if (!account || !myProfile) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl p-8 text-center space-y-4 max-w-2xl mx-auto">
        <UserCheck className="w-8 h-8 text-indigo-700 mx-auto" />
        <h1 className="text-2xl font-display font-bold text-slate-900">Profil &amp; Interpretasi Diri</h1>
        <p className="text-sm text-slate-600 leading-relaxed">
          {account?.role === 'admin'
            ? 'Anda sedang masuk sebagai Administrator. Gunakan menu Dasbor Admin untuk mengelola seluruh profil siswa, guru, dan konten teori.'
            : 'Masuk atau tautkan akun Anda ke profil kelas menggunakan kode verifikasi dari Administrator untuk membaca sintesis multi-kerangka pribadi, memeriksa kontradiksi, serta mengatur foto dan privasi granular.'}
        </p>
        {!account && (
          <button
            type="button"
            onClick={onOpenAuth}
            className="px-5 py-2.5 text-sm font-medium text-white bg-indigo-700 hover:bg-indigo-800 rounded-lg transition-colors"
          >
            Masuk atau Klaim Profil Saya
          </button>
        )}
      </div>
    );
  }

  async function handlePhotoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !myProfile) return;
    setError('');
    const reader = new FileReader();
    reader.onload = async () => {
      const dataUrl = reader.result as string;
      const token = localStorage.getItem('dynamap_token');
      const res = await fetch(`/api/profiles/${myProfile.id}/photo`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ dataUrl }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Gagal mengunggah foto.');
      } else {
        onProfileUpdated(data.profile);
        setMessage('Foto profil berhasil diperbarui.');
      }
    };
    reader.readAsDataURL(file);
  }

  async function handleRemovePhoto() {
    if (!myProfile) return;
    const token = localStorage.getItem('dynamap_token');
    const res = await fetch(`/api/profiles/${myProfile.id}/photo`, {
      method: 'DELETE',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    const data = await res.json();
    if (res.ok) {
      onProfileUpdated(data.profile);
      setMessage('Foto profil dihapus.');
    }
  }

  async function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault();
    if (!myProfile) return;
    if (!psyValidation.valid) {
      setError(psyValidation.error || 'Notasi Psikosofi tidak valid.');
      return;
    }
    setSaving(true);
    setError('');
    setMessage('');

    const coreNum = enneagramCore ? (Number(enneagramCore) as EnneagramCore) : null;
    const enneagramRaw = coreNum ? `${instinctVariant || ''}${coreNum}` : '';
    const derivedQuadra = socionics ? SOCIONICS_TYPES[socionics].quadra : quadra;
    const effectiveExposeFullName = privacySettings.fullName === 'public' || exposeFullName;

    try {
      const token = localStorage.getItem('dynamap_token');
      const res = await fetch(`/api/profiles/${myProfile.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          displayName,
          fullName,
          bio,
          academicInterests: interestsText
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean),
          collaborationPreferences: collabPref,
          visibility,
          exposeFullName: effectiveExposeFullName,
          privacySettings,
          typology: {
            ...myProfile.typology,
            socionics,
            quadra: derivedQuadra,
            enneagramCore: coreNum,
            enneagramRaw,
            instinctVariant,
            enneagramWing,
            instinctStacking,
            threeFix,
            trifix,
            tritype,
            jungian,
            psychosophyCode: psyValidation.normalizedCode,
            psychosophySelfReported: psyValidation.normalizedCode,
            psychosophyConfidence,
            psychosophyProvisional,
            psychosophyNotes,
            mbti: mbti.trim().toUpperCase(),
            mbtiCognitiveStack: mbtiCognitiveStack.trim(),
            sloanCode: sloanCode.trim().toUpperCase() || sloanParsed.canonicalFiveLetter || '',
            sloanExtended: sloanExtended.trim(),
            temperament: temperament.trim(),
            temperamentSecondary: temperamentSecondary.trim(),
            customPrefixes,
            status,
          },
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Gagal menyimpan profil.');
      } else {
        onProfileUpdated(data.profile);
        setMessage('Perubahan profil & interpretasi diri berhasil disimpan dan disinkronkan.');
      }
    } catch {
      setError('Gagal menghubungi server.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header Banner */}
      <div className="dreamy-surface border border-slate-200 rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <ProfileAvatar profile={myProfile} size="lg" />
          <div>
            <span className="atlas-kicker">Profil &amp; Sintesis Personal</span>
            <h1 className="mt-1 text-2xl font-display font-bold text-slate-900">
              {myProfile.displayName}
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              {myProfile.category} · Status Klasifikasi: {myProfile.typology.status} (
              {myProfile.typology.sourceNote})
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {onOpenIdCard && (
            <button
              type="button"
              onClick={onOpenIdCard}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-white bg-[#151D40] hover:bg-[#233070] rounded-lg transition-colors whitespace-nowrap"
            >
              <IdCard className="w-3.5 h-3.5 text-[#E6C77E]" />
              <span>Buat Kartu ID Tipologi</span>
            </button>
          )}
          <label className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-lg cursor-pointer whitespace-nowrap">
            <Camera className="w-3.5 h-3.5" />
            <span>{myProfile.photoUrl ? 'Ganti Foto' : 'Unggah Foto'}</span>
            <input
              type="file"
              accept="image/png,image/jpeg,image/webp"
              onChange={handlePhotoUpload}
              className="hidden"
            />
          </label>
          {myProfile.photoUrl && (
            <button
              type="button"
              onClick={handleRemovePhoto}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-red-700 bg-red-50 hover:bg-red-100 rounded-lg whitespace-nowrap"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Hapus Foto
            </button>
          )}
        </div>
      </div>

      {/* Module Sub-Navigation */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-3">
        <button
          type="button"
          onClick={() => setSubTab('editor')}
          className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold border transition-colors whitespace-nowrap ${
            subTab === 'editor'
              ? 'bg-[#151D40] text-white border-[#151D40]'
              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
          }`}
        >
          <UserCheck className="w-3.5 h-3.5" />
          <span>1. Editor Profil, Tipologi &amp; Privasi</span>
        </button>
        <button
          type="button"
          onClick={() => setSubTab('interpretation')}
          className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold border transition-colors whitespace-nowrap ${
            subTab === 'interpretation'
              ? 'bg-[#151D40] text-white border-[#151D40]'
              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-[#E6C77E]" />
          <span>2. Interpretasi Diri Multi-Lapis</span>
        </button>
        <button
          type="button"
          onClick={() => setSubTab('contradictions')}
          className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold border transition-colors whitespace-nowrap ${
            subTab === 'contradictions'
              ? 'bg-[#151D40] text-white border-[#151D40]'
              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
          }`}
        >
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>3. Kontradiksi &amp; Kompleksitas</span>
        </button>
      </div>

      {error && (
        <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-800">{error}</div>
      )}
      {message && (
        <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-900">
          {message}
        </div>
      )}

      {subTab === 'interpretation' && draftProfileForPreview && (
        <PersonalInterpretationPanel
          profile={draftProfileForPreview}
          exploration={exploration}
          mode="interpretation"
          onSaveExploration={onSaveExploration}
          onNavigate={onNavigate}
        />
      )}

      {subTab === 'contradictions' && draftProfileForPreview && (
        <PersonalInterpretationPanel
          profile={draftProfileForPreview}
          exploration={exploration}
          mode="contradictions"
          onSaveExploration={onSaveExploration}
          onNavigate={onNavigate}
        />
      )}

      {subTab === 'editor' && (
        <form onSubmit={handleSaveProfile} className="bg-white border border-slate-200 rounded-2xl p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <label htmlFor="my-disp" className="block text-xs font-medium text-slate-700 mb-1">
                Nama Tampilan Publik
              </label>
              <input
                id="my-disp"
                type="text"
                required
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg"
              />
            </div>
            <div>
              <label htmlFor="my-full" className="block text-xs font-medium text-slate-700 mb-1">
                Nama Lengkap Internal
              </label>
              <input
                id="my-full"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg"
              />
            </div>
            <div className="md:col-span-2">
              <label htmlFor="my-bio" className="block text-xs font-medium text-slate-700 mb-1">
                Deskripsi Diri Singkat (Opsional)
              </label>
              <textarea
                id="my-bio"
                rows={2}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg"
              />
            </div>
            <div>
              <label htmlFor="my-int" className="block text-xs font-medium text-slate-700 mb-1">
                Minat Akademik (pisahkan dengan koma)
              </label>
              <input
                id="my-int"
                type="text"
                value={interestsText}
                onChange={(e) => setInterestsText(e.target.value)}
                placeholder="Mis. Fisika, Karya Ilmiah, Debat"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg"
              />
            </div>
            <div>
              <label htmlFor="my-col" className="block text-xs font-medium text-slate-700 mb-1">
                Preferensi Kolaborasi
              </label>
              <input
                id="my-col"
                type="text"
                value={collabPref}
                onChange={(e) => setCollabPref(e.target.value)}
                placeholder="Mis. Pembagian sub-tugas jelas sejak awal"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h2 className="text-base font-display font-semibold text-slate-900">
                  Tinjauan &amp; Koreksi Tipologi Mandiri
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Biarkan kosong bagian yang belum dipastikan. Perubahan di sini langsung memperbarui Interpretasi Diri Anda.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSubTab('interpretation')}
                className="text-xs font-semibold text-indigo-700 hover:underline whitespace-nowrap"
              >
                Lihat Hasil Interpretasi Diri
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
              <div>
                <label htmlFor="my-status" className="block text-xs font-medium text-slate-700 mb-1">
                  Status Tinjauan
                </label>
                <select
                  id="my-status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value as TypologyStatus)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
                >
                  <option value="Self-Reviewed">Self-Reviewed (Ditinjau Sendiri)</option>
                  <option value="Revised">Revised (Dikoreksi)</option>
                  <option value="Undetermined">Undetermined (Belum Dipastikan)</option>
                  <option value="Initial Typing">Initial Typing</option>
                </select>
              </div>

              <div>
                <label htmlFor="my-soc" className="block text-xs font-medium text-slate-700 mb-1">
                  Socionics
                </label>
                <select
                  id="my-soc"
                  value={socionics}
                  onChange={(e) => {
                    const val = e.target.value as SocionicsCode | '';
                    setSocionics(val);
                    if (val) setQuadra(SOCIONICS_TYPES[val].quadra);
                  }}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
                >
                  <option value="">-- Belum ditentukan --</option>
                  {(Object.keys(SOCIONICS_TYPES) as SocionicsCode[]).map((c) => (
                    <option key={c} value={c}>
                      {c} ({SOCIONICS_TYPES[c].quadra})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="my-jung" className="block text-xs font-medium text-slate-700 mb-1">
                  Notasi Tipologi Jung
                </label>
                <input
                  id="my-jung"
                  type="text"
                  value={jungian}
                  onChange={(e) => setJungian(e.target.value)}
                  placeholder="Mis. IT(S) atau kosongkan"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono"
                />
              </div>

              <div>
                <label htmlFor="my-enn-core" className="block text-xs font-medium text-slate-700 mb-1">
                  Enneagram Inti (1–9)
                </label>
                <select
                  id="my-enn-core"
                  value={enneagramCore}
                  onChange={(e) => setEnneagramCore(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
                >
                  <option value="">-- Belum ditentukan --</option>
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
                    <option key={n} value={n}>
                      Tipe {n}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="my-wing" className="block text-xs font-medium text-slate-700 mb-1">
                  Sayap (Wing)
                </label>
                <input
                  id="my-wing"
                  type="text"
                  value={enneagramWing}
                  onChange={(e) => setEnneagramWing(e.target.value)}
                  placeholder="Mis. 6w5"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono"
                />
              </div>

              <div>
                <label htmlFor="my-inst" className="block text-xs font-medium text-slate-700 mb-1">
                  Insting Dominan &amp; Stacking
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <select
                    aria-label="Insting Dominan"
                    value={instinctVariant}
                    onChange={(e) => setInstinctVariant(e.target.value as InstinctCode | '')}
                    className="px-2 py-2 border border-slate-300 rounded-lg bg-white text-xs"
                  >
                    <option value="">Insting</option>
                    <option value="SP">SP</option>
                    <option value="SO">SO</option>
                    <option value="SX">SX</option>
                  </select>
                  <select
                    aria-label="Instinctual Stacking"
                    value={instinctStacking}
                    onChange={(e) => setInstinctStacking(e.target.value as InstinctualStacking | '')}
                    className="px-2 py-2 border border-slate-300 rounded-lg bg-white text-xs"
                  >
                    <option value="">Stacking</option>
                    <option value="SP/SO">SP/SO</option>
                    <option value="SP/SX">SP/SX</option>
                    <option value="SO/SP">SO/SP</option>
                    <option value="SO/SX">SO/SX</option>
                    <option value="SX/SP">SX/SP</option>
                    <option value="SX/SO">SX/SO</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="my-threefix" className="block text-xs font-medium text-slate-700 mb-1">
                  Three Fix
                </label>
                <input
                  id="my-threefix"
                  type="text"
                  value={threeFix}
                  onChange={(e) => setThreeFix(e.target.value)}
                  placeholder="Mis. 2-5-8"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono"
                />
              </div>

              <div>
                <label htmlFor="my-trifix" className="block text-xs font-medium text-slate-700 mb-1">
                  Trifix
                </label>
                <input
                  id="my-trifix"
                  type="text"
                  value={trifix}
                  onChange={(e) => setTrifix(e.target.value)}
                  placeholder="Mis. 258 (Trifix)"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono"
                />
              </div>

              <div>
                <label htmlFor="my-tritype" className="block text-xs font-medium text-slate-700 mb-1">
                  Tritype (Core-First)
                </label>
                <input
                  id="my-tritype"
                  type="text"
                  value={tritype}
                  onChange={(e) => setTritype(e.target.value)}
                  placeholder="Mis. 258"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono"
                />
              </div>
            </div>

            {/* Psychosophy Section */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-xs font-semibold text-slate-900">
                  Psikosofi (Psychosophy / Attitudinal Psyche — L, V, E, F)
                </h3>
                <span className="text-[11px] text-slate-500">
                  F = Physics (Fisika), bukan Feeling
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <label htmlFor="my-psy-code" className="block font-medium text-slate-700 mb-1">
                    Kode 4 Huruf (mis. LVEF)
                  </label>
                  <input
                    id="my-psy-code"
                    type="text"
                    maxLength={4}
                    value={psychosophyCode}
                    onChange={(e) => setPsychosophyCode(e.target.value.toUpperCase())}
                    placeholder="Kosong atau LVEF"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono uppercase bg-white"
                  />
                  {!psyValidation.valid && (
                    <p className="text-red-700 mt-1">{psyValidation.error}</p>
                  )}
                </div>
                <div>
                  <label htmlFor="my-psy-conf" className="block font-medium text-slate-700 mb-1">
                    Tingkat Keyakinan
                  </label>
                  <select
                    id="my-psy-conf"
                    value={psychosophyConfidence}
                    onChange={(e) => setPsychosophyConfidence(e.target.value as PsychosophyConfidence)}
                    className="w-full px-2.5 py-2 border border-slate-300 rounded-lg bg-white"
                  >
                    <option value="Belum Dipastikan">Belum Dipastikan</option>
                    <option value="Provisional / Dugaan Awal">Provisional / Dugaan Awal</option>
                    <option value="Cukup Yakin">Cukup Yakin</option>
                    <option value="Terkonfirmasi Mandiri">Terkonfirmasi Mandiri</option>
                  </select>
                </div>
                <div className="flex items-end pb-2">
                  <label className="flex items-center gap-2 cursor-pointer text-slate-700">
                    <input
                      type="checkbox"
                      checked={psychosophyProvisional}
                      onChange={(e) => setPsychosophyProvisional(e.target.checked)}
                    />
                    <span>Tandai masih provisional</span>
                  </label>
                </div>
              </div>
              <div>
                <label htmlFor="my-psy-notes" className="block text-xs font-medium text-slate-700 mb-1">
                  Catatan Eksplorasi Psikosofi (Opsional)
                </label>
                <input
                  id="my-psy-notes"
                  type="text"
                  value={psychosophyNotes}
                  onChange={(e) => setPsychosophyNotes(e.target.value)}
                  placeholder="Mis. Masih menimbang posisi V dan E saat bekerja kelompok..."
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white"
                />
              </div>
              {psyParsed.valid && (
                <div className="p-3 rounded-lg bg-white border border-slate-200 text-xs space-y-1">
                  <div className="font-mono font-semibold text-indigo-800">
                    {psyParsed.code}
                    {psyParsed.typeSpec ? ` (“${psyParsed.typeSpec.afanasyevNickname}” — Afanasyev)` : ''} ·{' '}
                    {psyParsed.placements.map((pl) => pl.code).join(' · ')}
                  </div>
                  <p className="text-slate-600 leading-relaxed">{psyParsed.interactionSynthesis}</p>
                </div>
              )}
            </div>

            {/* MBTI, Stack, SLOAN & Temperament Optional Section */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-xs font-semibold text-slate-900">
                  MBTI &amp; Stack Fungsi Kognitif, Big Five / SLOAN &amp; Temperamen
                </h3>
                <span className="text-[11px] text-slate-500">
                  Opsional · terintegrasi ke Interpretasi Diri, Galeri, Kartu ID &amp; Perbandingan
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
                <div>
                  <label htmlFor="my-mbti" className="block font-medium text-slate-700 mb-1">
                    MBTI (16 Tipe)
                  </label>
                  <select
                    id="my-mbti"
                    value={mbti}
                    onChange={(e) => {
                      const next = e.target.value;
                      setMbti(next);
                      const entry = ALL_16_MBTI_PROFILES.find((m) => m.code === next);
                      if (entry && !mbtiCognitiveStack.trim()) {
                        setMbtiCognitiveStack(entry.grantStack.join(' – '));
                      }
                    }}
                    className="w-full px-2.5 py-2 border border-slate-300 rounded-lg bg-white font-mono"
                  >
                    <option value="">-- Opsional --</option>
                    {ALL_16_MBTI_PROFILES.map((m) => (
                      <option key={m.code} value={m.code}>
                        {m.code} — {m.roleTitle}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="lg:col-span-2">
                  <div className="flex items-center justify-between mb-1">
                    <label htmlFor="my-mbti-stack" className="font-medium text-slate-700">
                      Tumpukan Fungsi Kognitif MBTI (Opsional / Kustom)
                    </label>
                    {resolvedMbtiStack.entry && (
                      <button
                        type="button"
                        onClick={() => setMbtiCognitiveStack(resolvedMbtiStack.entry!.grantStack.join(' – '))}
                        className="text-[11px] font-medium text-indigo-700 hover:underline"
                      >
                        Isi Standar {resolvedMbtiStack.entry.code}
                      </button>
                    )}
                  </div>
                  <input
                    id="my-mbti-stack"
                    type="text"
                    value={mbtiCognitiveStack}
                    onChange={(e) => setMbtiCognitiveStack(e.target.value)}
                    placeholder={
                      resolvedMbtiStack.entry
                        ? `Bawaan ${resolvedMbtiStack.entry.code}: ${resolvedMbtiStack.entry.grantStack.join(' – ')}`
                        : 'Mis. Ni – Te – Fi – Se'
                    }
                    className="w-full px-2.5 py-2 border border-slate-300 rounded-lg bg-white font-mono"
                  />
                  {resolvedMbtiStack.isManualOverride && (
                    <p className="text-[11px] text-indigo-700 mt-1">
                      Menggunakan susunan kustom (berbeda dari standar Grant {resolvedMbtiStack.entry?.grantStack.join('–')}).
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                <div>
                  <label htmlFor="my-sloan-std" className="block font-medium text-slate-700 mb-1">
                    SLOAN Standar (5 Huruf)
                  </label>
                  <input
                    id="my-sloan-std"
                    type="text"
                    maxLength={5}
                    value={sloanCode}
                    onChange={(e) => setSloanCode(e.target.value.toUpperCase())}
                    placeholder="Mis. RCOAI"
                    className="w-full px-2.5 py-2 border border-slate-300 rounded-lg bg-white font-mono uppercase"
                  />
                </div>
                <div>
                  <label htmlFor="my-sloan-ext" className="block font-medium text-slate-700 mb-1">
                    Notasi Lanjutan ([S]lo/E/I)
                  </label>
                  <input
                    id="my-sloan-ext"
                    type="text"
                    value={sloanExtended}
                    onChange={(e) => setSloanExtended(e.target.value)}
                    placeholder="Mis. [R]CoA/I/"
                    className="w-full px-2.5 py-2 border border-slate-300 rounded-lg bg-white font-mono"
                  />
                </div>
                <div>
                  <label htmlFor="my-temp-primary" className="block font-medium text-slate-700 mb-1">
                    Temperamen Utama
                  </label>
                  <select
                    id="my-temp-primary"
                    value={temperament}
                    onChange={(e) => {
                      const val = e.target.value;
                      setTemperament(val);
                      if (val === temperamentSecondary) setTemperamentSecondary('');
                    }}
                    className="w-full px-2.5 py-2 border border-slate-300 rounded-lg bg-white"
                  >
                    <option value="">-- Opsional --</option>
                    {CLASSICAL_4_TEMPERAMENTS.map((t) => (
                      <option key={t.id} value={t.name}>
                        {t.indoName} ({t.name})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="my-temp-sec" className="block font-medium text-slate-700 mb-1">
                    Temperamen Sekunder
                  </label>
                  <select
                    id="my-temp-sec"
                    value={temperamentSecondary}
                    onChange={(e) => setTemperamentSecondary(e.target.value)}
                    disabled={!temperament}
                    className="w-full px-2.5 py-2 border border-slate-300 rounded-lg bg-white disabled:bg-slate-100"
                  >
                    <option value="">Tunggal (Tanpa Campuran)</option>
                    {CLASSICAL_4_TEMPERAMENTS.filter((t) => t.name !== temperament).map((t) => (
                      <option key={t.id} value={t.name}>
                        {t.indoName} ({t.name})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {(sloanExtended.trim() || sloanCode.trim()) && (
                <div className="p-2.5 rounded-lg bg-white border border-slate-200 text-[11px] text-slate-700">
                  {sloanParsed.isValid ? (
                    <span>
                      <strong className="text-indigo-800 font-mono">
                        {sloanParsed.rawInput} → Standar: {sloanParsed.canonicalFiveLetter}
                      </strong>
                      {sloanParsed.summaryLines[0] ? ` · ${sloanParsed.summaryLines[0]}` : ''}
                    </span>
                  ) : (
                    <span className="text-red-700">{sloanParsed.error}</span>
                  )}
                </div>
              )}
            </div>

            {/* Custom prefixes */}
            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-700">
                  Bidang Tipologi Tambahan / Prefiks Kustom
                </span>
                <button
                  type="button"
                  onClick={() => setCustomPrefixes([...customPrefixes, { label: '', value: '' }])}
                  className="inline-flex items-center gap-1 text-xs font-medium text-indigo-700 hover:underline"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Tambah Bidang
                </button>
              </div>
              {customPrefixes.map((cp, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Nama bidang"
                    value={cp.label}
                    onChange={(e) => {
                      const next = [...customPrefixes];
                      next[idx] = { ...next[idx], label: e.target.value };
                      setCustomPrefixes(next);
                    }}
                    className="flex-1 px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg"
                  />
                  <input
                    type="text"
                    placeholder="Nilai"
                    value={cp.value}
                    onChange={(e) => {
                      const next = [...customPrefixes];
                      next[idx] = { ...next[idx], value: e.target.value };
                      setCustomPrefixes(next);
                    }}
                    className="flex-1 px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => setCustomPrefixes(customPrefixes.filter((_, i) => i !== idx))}
                    aria-label="Hapus bidang kustom"
                    className="p-1.5 text-slate-400 hover:text-red-600"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Granular Privacy Matrix */}
          <div className="pt-4 border-t border-slate-200 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-indigo-700" />
                <h2 className="text-base font-display font-semibold text-slate-900">
                  Pengaturan Privasi Granular (7 Komponen)
                </h2>
              </div>
              <select
                aria-label="Visibilitas Profil Umum"
                value={visibility}
                onChange={(e) => setVisibility(e.target.value as 'public' | 'limited' | 'private')}
                className="px-3 py-1.5 text-xs border border-slate-300 rounded-lg bg-white"
              >
                <option value="public">Profil Umum: Publik</option>
                <option value="limited">Profil Umum: Terbatas</option>
                <option value="private">Profil Umum: Privat</option>
              </select>
            </div>

            <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-200 text-xs">
              {PRIVACY_COMPONENTS.map((comp) => (
                <div
                  key={comp.key}
                  className="px-4 py-3 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                >
                  <div>
                    <div className="font-semibold text-slate-900">{comp.label}</div>
                    <div className="text-[11px] text-slate-500">{comp.hint}</div>
                  </div>
                  <select
                    aria-label={`Privasi ${comp.label}`}
                    value={privacySettings[comp.key]}
                    onChange={(e) => {
                      const val = e.target.value as GranularVisibilityLevel;
                      setPrivacySettings((prev) => ({ ...prev, [comp.key]: val }));
                      if (comp.key === 'fullName') {
                        setExposeFullName(val === 'public');
                      }
                    }}
                    className="px-3 py-1.5 border border-slate-300 rounded-lg bg-white text-xs sm:w-64"
                  >
                    {PRIVACY_LEVEL_LABELS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2.5 text-sm font-medium text-white bg-[#151D40] hover:bg-[#233070] rounded-lg transition-colors disabled:opacity-50"
            >
              {saving ? 'Menyimpan...' : 'Simpan Perubahan Profil Saya'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
