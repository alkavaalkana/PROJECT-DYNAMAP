import React, { useEffect, useState } from 'react';
import {
  Archive,
  Camera,
  CheckSquare,
  Download,
  Edit3,
  FileSpreadsheet,
  History,
  Plus,
  RefreshCw,
  RotateCcw,
  Shield,
  Trash2,
  Upload,
  X,
} from 'lucide-react';
import { MBTI_STACK_DYNAMICS_16 } from '../data/extendedTheoryData';
import { SOCIONICS_TYPES } from '../data/socionicsData';
import {
  analyzeAdminDataQuality,
  exportProfilesToCsv,
  parseAndValidateProfilesCsv,
} from '../lib/adminDataQuality';
import { resolveMbtiCognitiveStack } from '../lib/interpretationEngine';
import { validatePsychosophyCode } from '../lib/psychosophy';
import type {
  Account,
  CareerRecord,
  ChangeLogEntry,
  ConceptNode,
  EnneagramCore,
  ExplorationCatalogConfig,
  GranularVisibilityLevel,
  HomepageBannerState,
  InstinctCode,
  InstinctualStacking,
  Profile,
  ProfileCategory,
  ProfilePrivacySettings,
  PsychosophyConfidence,
  QuadraName,
  ReferenceCitation,
  SchoolSubjectTemplate,
  SocionicsCode,
  SystemSettings,
  TheoryArticle,
  TypologyStatus,
  UniversityInstitution,
  UniversityProgram,
} from '../types/dynamap';
import { AdminBannerManager } from './AdminBannerManager';
import { AdminCatalogManager } from './AdminCatalogManager';
import { ProfileAvatar, getQuadraTheme } from './QuadraUI';

type TemperamentName = 'Choleric' | 'Sanguine' | 'Melancholic' | 'Phlegmatic';

interface AdminDashboardViewProps {
  account: Account | null;
  onDataMutated: () => Promise<void>;
}

interface AdminOverviewData {
  profiles: Profile[];
  accounts: Account[];
  changeLogs: ChangeLogEntry[];
  settings: SystemSettings;
  theoryArticles: TheoryArticle[];
  references: ReferenceCitation[];
  bannerConfig: HomepageBannerState;
  subjectTemplates: SchoolSubjectTemplate[];
  universities: UniversityInstitution[];
  programs: UniversityProgram[];
  careers: CareerRecord[];
  concepts: ConceptNode[];
  explorationConfig?: ExplorationCatalogConfig;
}

export const AdminDashboardView: React.FC<AdminDashboardViewProps> = ({
  account,
  onDataMutated,
}) => {
  const [tab, setTab] = useState<'profiles' | 'quality' | 'banner' | 'catalog' | 'history' | 'content' | 'system'>('profiles');
  const [overview, setOverview] = useState<AdminOverviewData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusMsg, setStatusMsg] = useState('');
  const [search, setSearch] = useState('');
  const [showArchived, setShowArchived] = useState(false);
  const [missingFieldFilter, setMissingFieldFilter] = useState<string>('ALL');

  // Multi-select Bulk Edit state
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [bulkPatch, setBulkPatch] = useState<{
    category: ProfileCategory | '';
    status: TypologyStatus | '';
    quadra: QuadraName | '';
    mbti: string;
    sloanCode: string;
    temperament: TemperamentName | '';
  }>({
    category: '',
    status: '',
    quadra: '',
    mbti: '',
    sloanCode: '',
    temperament: '',
  });
  const [bulkSaving, setBulkSaving] = useState(false);

  // CSV Import state
  const [csvInput, setCsvInput] = useState('');
  const [csvImporting, setCsvImporting] = useState(false);

  // Add New Person Modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [newPerson, setNewPerson] = useState({
    displayName: '',
    fullName: '',
    category: 'Wali Kelas' as ProfileCategory,
    affiliation: '',
    bio: '',
    visibility: 'public' as 'public' | 'limited' | 'private',
    exposeFullName: false,
  });

  // Profile Editor Drawer
  const [editingProfile, setEditingProfile] = useState<Profile | null>(null);
  const [editDraft, setEditDraft] = useState<Profile | null>(null);

  // Content Management forms
  const [newArticle, setNewArticle] = useState({
    title: '',
    category: 'Socionics' as TheoryArticle['category'],
    summary: '',
    content: '',
  });
  const [newRef, setNewRef] = useState({
    author: '',
    year: '',
    title: '',
    framework: 'Socionics' as ReferenceCitation['framework'],
    note: '',
  });

  async function fetchOverview() {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('dynamap_token');
      const res = await fetch('/api/admin/overview', {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Gagal memuat data administrator.');
      } else {
        setOverview(data);
      }
    } catch {
      setError('Gagal terhubung ke server.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (account?.role === 'admin') {
      fetchOverview();
    }
  }, [account]);

  if (!account || account.role !== 'admin') {
    return (
      <div className="bg-white border border-slate-200 rounded-xl p-8 text-center space-y-3 max-w-xl mx-auto">
        <Shield className="w-8 h-8 text-indigo-700 mx-auto" />
        <h1 className="text-xl font-display font-bold text-slate-900">
          Akses Terbatas Administrator
        </h1>
        <p className="text-sm text-slate-600">
          Silakan masuk menggunakan akun Administrator untuk mengelola basis data 37 siswa,
          menambahkan guru/wali kelas/siswa baru, menyunting tipologi, dan meninjau riwayat perubahan.
        </p>
      </div>
    );
  }

  function openEditor(profile: Profile) {
    const clone: Profile = JSON.parse(JSON.stringify(profile));
    if (!clone.privacySettings) {
      clone.privacySettings = {
        displayName: 'public',
        fullName: clone.exposeFullName ? 'public' : 'admins',
        avatar: 'public',
        typology: clone.visibility === 'private' ? 'private' : 'public',
        bio: 'public',
        reflections: 'private',
        idCard: clone.visibility === 'private' ? 'private' : 'public',
      };
    }
    setEditingProfile(profile);
    setEditDraft(clone);
  }

  async function handleSaveEdit(e: React.FormEvent) {
    e.preventDefault();
    if (!editDraft) return;
    setStatusMsg('');
    const token = localStorage.getItem('dynamap_token');
    const res = await fetch(`/api/profiles/${editDraft.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(editDraft),
    });
    if (res.ok) {
      setEditingProfile(null);
      setEditDraft(null);
      setStatusMsg(`Profil ${editDraft.displayName} berhasil diperbarui dan disinkronkan.`);
      await fetchOverview();
      await onDataMutated();
    }
  }

  async function handlePhotoUpload(profileId: string, e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async () => {
      const token = localStorage.getItem('dynamap_token');
      const res = await fetch(`/api/profiles/${profileId}/photo`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ dataUrl: reader.result }),
      });
      const data = await res.json();
      if (res.ok) {
        setEditDraft((prev) => (prev ? { ...prev, photoUrl: data.profile.photoUrl } : prev));
        setStatusMsg('Foto profil berhasil diunggah.');
        await fetchOverview();
        await onDataMutated();
      }
    };
    reader.readAsDataURL(file);
  }

  async function handleRemovePhoto(profileId: string) {
    const token = localStorage.getItem('dynamap_token');
    const res = await fetch(`/api/profiles/${profileId}/photo`, {
      method: 'DELETE',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    if (res.ok) {
      setEditDraft((prev) => (prev ? { ...prev, photoUrl: null } : prev));
      setStatusMsg('Foto profil dihapus.');
      await fetchOverview();
      await onDataMutated();
    }
  }

  async function handleCreatePerson(e: React.FormEvent) {
    e.preventDefault();
    const token = localStorage.getItem('dynamap_token');
    const res = await fetch('/api/admin/profiles', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(newPerson),
    });
    const data = await res.json();
    if (res.ok) {
      setShowAddModal(false);
      setNewPerson({
        displayName: '',
        fullName: '',
        category: 'Wali Kelas',
        affiliation: '',
        bio: '',
        visibility: 'public',
        exposeFullName: false,
      });
      setStatusMsg(
        `Profil baru "${data.profile.displayName}" (${data.profile.category}) ditambahkan tanpa mengisi tipologi otomatis.`
      );
      await fetchOverview();
      await onDataMutated();
    }
  }

  async function handleArchiveOrDelete(profile: Profile, permanent: boolean) {
    const token = localStorage.getItem('dynamap_token');
    const res = await fetch(
      `/api/admin/profiles/${profile.id}${permanent ? '?permanent=true' : ''}`,
      {
        method: 'DELETE',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      }
    );
    if (res.ok) {
      setStatusMsg(
        permanent
          ? `Profil ${profile.displayName} dihapus permanen.`
          : `Profil ${profile.displayName} diarsipkan.`
      );
      await fetchOverview();
      await onDataMutated();
    }
  }

  async function handleRestoreLog(log: ChangeLogEntry) {
    const token = localStorage.getItem('dynamap_token');
    const res = await fetch(`/api/admin/profiles/${log.profileId}/restore/${log.id}`, {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    if (res.ok) {
      setStatusMsg(`Versi sebelumnya untuk ${log.profileDisplayName} (${log.field}) dipulihkan.`);
      await fetchOverview();
      await onDataMutated();
    }
  }

  async function handleRegenerateClaimCode(profileId: string) {
    const token = localStorage.getItem('dynamap_token');
    const res = await fetch(`/api/admin/profiles/${profileId}/regenerate-claim-code`, {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    if (res.ok) {
      await fetchOverview();
      setStatusMsg('Kode klaim baru berhasil dibuat.');
    }
  }

  async function handleToggleMode(mode: 'development' | 'student_access') {
    const token = localStorage.getItem('dynamap_token');
    const res = await fetch('/api/admin/settings', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ mode }),
    });
    if (res.ok) {
      setStatusMsg(
        mode === 'development'
          ? 'Mode Pengembangan diaktifkan: akses siswa sementara dinonaktifkan.'
          : 'Mode Akses Siswa diaktifkan: pendaftaran dan login siswa terbuka.'
      );
      await fetchOverview();
      await onDataMutated();
    }
  }

  async function handleExportBackup() {
    const token = localStorage.getItem('dynamap_token');
    const res = await fetch('/api/admin/export', {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    if (!res.ok) return;
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dynamap-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function handleExportCsv() {
    const csv = exportProfilesToCsv(overview?.profiles || []);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dynamap-profiles-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    setStatusMsg('Data seluruh profil berhasil diekspor ke file CSV.');
  }

  async function handleBulkUpdate(e: React.FormEvent) {
    e.preventDefault();
    if (selectedIds.length === 0) return;
    const patchPayload: Record<string, string> = {};
    if (bulkPatch.category) patchPayload.category = bulkPatch.category;
    if (bulkPatch.status) patchPayload.status = bulkPatch.status;
    if (bulkPatch.quadra) patchPayload.quadra = bulkPatch.quadra;
    if (bulkPatch.mbti) patchPayload.mbti = bulkPatch.mbti.toUpperCase();
    if (bulkPatch.sloanCode) patchPayload.sloanCode = bulkPatch.sloanCode.toUpperCase();
    if (bulkPatch.temperament) patchPayload.temperament = bulkPatch.temperament;
    if (Object.keys(patchPayload).length === 0) {
      setError('Pilih minimal satu bidang yang ingin diperbarui secara massal.');
      return;
    }

    setBulkSaving(true);
    setError('');
    try {
      const token = localStorage.getItem('dynamap_token');
      const res = await fetch('/api/admin/profiles/bulk-update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ profileIds: selectedIds, patch: patchPayload }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Gagal memperbarui profil secara massal.');
      } else {
        setStatusMsg(
          `Pembaruan massal berhasil diterapkan ke ${data.updatedCount || selectedIds.length} profil. Anda dapat memulihkan versi sebelumnya dari tab Riwayat.`
        );
        setSelectedIds([]);
        setBulkPatch({
          category: '',
          status: '',
          quadra: '',
          mbti: '',
          sloanCode: '',
          temperament: '',
        });
        await fetchOverview();
        await onDataMutated();
      }
    } finally {
      setBulkSaving(false);
    }
  }

  async function handleCsvFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const text = await file.text();
    setCsvInput(text);
  }

  async function handleApplyCsvImport() {
    const parsed = parseAndValidateProfilesCsv(csvInput, overview?.profiles || []);
    if (!parsed.valid || parsed.rows.length === 0) return;

    setCsvImporting(true);
    setError('');
    try {
      const token = localStorage.getItem('dynamap_token');
      const rowsToSubmit = parsed.rows.map((row) => {
        const p = row.patch;
        return {
          ...(row.action === 'update' ? { id: row.profileId } : {}),
          displayName: String(p.displayName || row.displayName),
          ...(p.fullName !== undefined ? { fullName: String(p.fullName) } : {}),
          ...(p.category !== undefined ? { category: String(p.category) } : {}),
          ...(p.affiliation !== undefined ? { affiliation: String(p.affiliation) } : {}),
          ...(p.socionics !== undefined ? { socionics: String(p.socionics) } : {}),
          ...(p.quadra !== undefined ? { quadra: String(p.quadra) } : {}),
          ...(p.enneagramCore !== undefined ? { enneagramRaw: `${p.instinctVariant || ''}${p.enneagramCore}` } : {}),
          ...(p.enneagramWing !== undefined ? { enneagramWing: String(p.enneagramWing) } : {}),
          ...(p.instinctStacking !== undefined ? { instinctStacking: String(p.instinctStacking) } : {}),
          ...(p.tritype !== undefined ? { tritype: String(p.tritype) } : {}),
          ...(p.jungian !== undefined ? { jungian: String(p.jungian) } : {}),
          ...(p.psychosophyCode !== undefined ? { psychosophyCode: String(p.psychosophyCode) } : {}),
          ...(p.mbti !== undefined ? { mbti: String(p.mbti) } : {}),
          ...(p.mbtiCognitiveStack !== undefined ? { mbtiCognitiveStack: String(p.mbtiCognitiveStack) } : {}),
          ...(p.sloanCode !== undefined ? { sloanCode: String(p.sloanCode) } : {}),
          ...(p.sloanExtended !== undefined ? { sloanExtended: String(p.sloanExtended) } : {}),
          ...(p.temperament !== undefined ? { temperament: String(p.temperament) } : {}),
          ...(p.temperamentSecondary !== undefined ? { temperamentSecondary: String(p.temperamentSecondary) } : {}),
        };
      });
      const res = await fetch('/api/admin/profiles/import-csv', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ rows: rowsToSubmit }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Impor CSV gagal diterapkan.');
      } else {
        setStatusMsg(
          `Impor CSV selesai: ${data.updatedCount || 0} profil diperbarui, ${data.createdCount || 0} profil baru ditambahkan.`
        );
        setCsvInput('');
        await fetchOverview();
        await onDataMutated();
      }
    } finally {
      setCsvImporting(false);
    }
  }

  async function handleAddArticle(e: React.FormEvent) {
    e.preventDefault();
    const token = localStorage.getItem('dynamap_token');
    const res = await fetch('/api/admin/theory', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(newArticle),
    });
    if (res.ok) {
      setNewArticle({ title: '', category: 'Socionics', summary: '', content: '' });
      setStatusMsg('Artikel teori baru berhasil ditambahkan.');
      await fetchOverview();
      await onDataMutated();
    }
  }

  async function handleTogglePublishArticle(article: TheoryArticle) {
    const token = localStorage.getItem('dynamap_token');
    const res = await fetch(`/api/admin/theory/${article.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ published: !article.published }),
    });
    if (res.ok) {
      await fetchOverview();
      await onDataMutated();
    }
  }

  async function handleAddReference(e: React.FormEvent) {
    e.preventDefault();
    const token = localStorage.getItem('dynamap_token');
    const res = await fetch('/api/admin/references', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(newRef),
    });
    if (res.ok) {
      setNewRef({ author: '', year: '', title: '', framework: 'Socionics', note: '' });
      setStatusMsg('Referensi akademik baru ditambahkan.');
      await fetchOverview();
      await onDataMutated();
    }
  }

  if (loading && !overview) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl p-8 text-sm text-slate-600">
        Memuat panel kendali Administrator...
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-sm text-red-800">
        {error}
      </div>
    );
  }

  const qualityReport = analyzeAdminDataQuality(overview?.profiles || []);
  const activeMissingBucket =
    missingFieldFilter !== 'ALL'
      ? qualityReport.missingFieldCounts.find((m) => m.fieldKey === missingFieldFilter)
      : null;

  const parsedCsvPreview = csvInput.trim()
    ? parseAndValidateProfilesCsv(csvInput, overview?.profiles || [])
    : null;

  const profilesList = (overview?.profiles || []).filter((p) => {
    if (!showArchived && p.archived) return false;
    if (activeMissingBucket && !activeMissingBucket.profileIds.includes(p.id)) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        p.displayName.toLowerCase().includes(q) ||
        p.fullName.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        (p.typology.socionics || '').toLowerCase().includes(q) ||
        (p.typology.mbti || '').toLowerCase().includes(q) ||
        (p.typology.sloanCode || '').toLowerCase().includes(q) ||
        (p.typology.temperament || '').toLowerCase().includes(q)
      );
    }
    return true;
  });

  function toggleSelectProfile(id: string) {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  }

  function toggleSelectAllFiltered() {
    const filteredIds = profilesList.map((p) => p.id);
    const allSelected = filteredIds.length > 0 && filteredIds.every((id) => selectedIds.includes(id));
    if (allSelected) {
      setSelectedIds((prev) => prev.filter((id) => !filteredIds.includes(id)));
    } else {
      setSelectedIds(Array.from(new Set([...selectedIds, ...filteredIds])));
    }
  }

  return (
    <div className="space-y-6">
      <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-display font-bold text-slate-900">
              Dasbor Administrator &amp; Manajemen Basis Data
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              Kelola profil 37 siswa awal, tambahkan guru/wali kelas/siswa baru, sunting seluruh bidang tipologi (termasuk MBTI, SLOAN &amp; Temperamen), lakukan pembaruan massal, impor/ekspor CSV tervalidasi, dan pulihkan riwayat versi.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleExportCsv}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg whitespace-nowrap"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              Ekspor CSV
            </button>
            <button
              type="button"
              onClick={handleExportBackup}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg whitespace-nowrap"
            >
              <Download className="w-3.5 h-3.5" />
              Cadangan JSON
            </button>
            <button
              type="button"
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-white bg-indigo-700 hover:bg-indigo-800 rounded-lg whitespace-nowrap"
            >
              <Plus className="w-3.5 h-3.5" />
              Tambah Orang Baru
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-1 p-1 bg-slate-100 rounded-lg w-fit">
          {[
            { id: 'profiles' as const, label: `Kelola Profil (${overview?.profiles.length || 0})` },
            { id: 'quality' as const, label: `Kualitas Data, Bulk & CSV` },
            { id: 'banner' as const, label: 'Spanduk Beranda' },
            { id: 'catalog' as const, label: 'Katalog PTN, Karier & Mapel' },
            { id: 'history' as const, label: `Riwayat & Pemulihan (${overview?.changeLogs.length || 0})` },
            { id: 'content' as const, label: 'Konten Teori & Referensi' },
            { id: 'system' as const, label: 'Mode Akses & Akun' },
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

      {statusMsg && (
        <div className="p-3.5 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-900">
          {statusMsg}
        </div>
      )}

      {/* TAB 1: PROFILES CRUD */}
      {tab === 'profiles' && (
        <div className="space-y-4">
          {/* Missing-field Quick Chips & Bulk Action Toolbar */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-3 text-xs">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="font-semibold text-slate-700 mr-1">Saring Bidang Kosong:</span>
              <button
                type="button"
                onClick={() => setMissingFieldFilter('ALL')}
                className={`px-2.5 py-1 rounded border font-medium whitespace-nowrap ${
                  missingFieldFilter === 'ALL'
                    ? 'bg-indigo-700 text-white border-indigo-700'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                Semua ({overview?.profiles.filter((p) => showArchived || !p.archived).length || 0})
              </button>
              {qualityReport.missingFieldCounts.map((m) => (
                <button
                  key={m.fieldKey}
                  type="button"
                  onClick={() => setMissingFieldFilter(m.fieldKey)}
                  className={`px-2.5 py-1 rounded border font-medium whitespace-nowrap tabular-nums ${
                    missingFieldFilter === m.fieldKey
                      ? 'bg-amber-700 text-white border-amber-700'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  Tanpa {m.label} ({m.missingCount})
                </button>
              ))}
            </div>

            {selectedIds.length > 0 && (
              <form
                onSubmit={handleBulkUpdate}
                className="p-3 rounded-lg bg-indigo-50 border border-indigo-200 space-y-2.5"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="font-semibold text-indigo-950 flex items-center gap-1.5">
                    <CheckSquare className="w-4 h-4" />
                    Pembaruan Massal ({selectedIds.length} profil dipilih)
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedIds([])}
                    className="text-indigo-800 hover:underline"
                  >
                    Batalkan Pilihan
                  </button>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
                  <select
                    aria-label="Kategori massal"
                    value={bulkPatch.category}
                    onChange={(e) => setBulkPatch((b) => ({ ...b, category: e.target.value as ProfileCategory | '' }))}
                    className="px-2 py-1.5 border border-indigo-200 rounded bg-white"
                  >
                    <option value="">Kategori (tidak ubah)</option>
                    <option value="Siswa">Siswa</option>
                    <option value="Guru">Guru</option>
                    <option value="Wali Kelas">Wali Kelas</option>
                    <option value="Staf Sekolah">Staf Sekolah</option>
                  </select>
                  <select
                    aria-label="Status massal"
                    value={bulkPatch.status}
                    onChange={(e) => setBulkPatch((b) => ({ ...b, status: e.target.value as TypologyStatus | '' }))}
                    className="px-2 py-1.5 border border-indigo-200 rounded bg-white"
                  >
                    <option value="">Status (tidak ubah)</option>
                    <option value="Initial Typing">Initial Typing</option>
                    <option value="Self-Reviewed">Self-Reviewed</option>
                    <option value="Revised">Revised</option>
                    <option value="Undetermined">Undetermined</option>
                  </select>
                  <select
                    aria-label="Quadra massal"
                    value={bulkPatch.quadra}
                    onChange={(e) => setBulkPatch((b) => ({ ...b, quadra: e.target.value as QuadraName | '' }))}
                    className="px-2 py-1.5 border border-indigo-200 rounded bg-white"
                  >
                    <option value="">Quadra (tidak ubah)</option>
                    <option value="Alpha">Alpha</option>
                    <option value="Beta">Beta</option>
                    <option value="Gamma">Gamma</option>
                    <option value="Delta">Delta</option>
                  </select>
                  <select
                    aria-label="MBTI massal"
                    value={bulkPatch.mbti}
                    onChange={(e) => setBulkPatch((b) => ({ ...b, mbti: e.target.value }))}
                    className="px-2 py-1.5 border border-indigo-200 rounded bg-white"
                  >
                    <option value="">MBTI (tidak ubah)</option>
                    {Object.keys(MBTI_STACK_DYNAMICS_16).map((code) => (
                      <option key={code} value={code}>
                        {code}
                      </option>
                    ))}
                  </select>
                  <input
                    type="text"
                    maxLength={5}
                    placeholder="SLOAN (mis. RLOEI)"
                    value={bulkPatch.sloanCode}
                    onChange={(e) => setBulkPatch((b) => ({ ...b, sloanCode: e.target.value.toUpperCase() }))}
                    className="px-2 py-1.5 border border-indigo-200 rounded bg-white font-mono uppercase"
                  />
                  <select
                    aria-label="Temperamen massal"
                    value={bulkPatch.temperament}
                    onChange={(e) => setBulkPatch((b) => ({ ...b, temperament: e.target.value as TemperamentName | '' }))}
                    className="px-2 py-1.5 border border-indigo-200 rounded bg-white"
                  >
                    <option value="">Temperamen (tidak ubah)</option>
                    <option value="Choleric">Choleric</option>
                    <option value="Sanguine">Sanguine</option>
                    <option value="Melancholic">Melancholic</option>
                    <option value="Phlegmatic">Phlegmatic</option>
                  </select>
                </div>
                <button
                  type="submit"
                  disabled={bulkSaving}
                  className="px-3.5 py-1.5 font-semibold text-white bg-indigo-700 hover:bg-indigo-800 rounded-md disabled:opacity-50 whitespace-nowrap"
                >
                  {bulkSaving ? 'Menerapkan...' : 'Terapkan Pembaruan Massal'}
                </button>
              </form>
            )}
          </div>

          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
            <div className="p-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
              <input
                type="search"
                aria-label="Cari profil di dasbor admin"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari nama tampilan, nama lengkap, kategori, atau tipe (Socionics/MBTI/SLOAN/Temperamen)..."
                className="w-full sm:w-96 px-3 py-2 text-xs border border-slate-300 rounded-lg"
              />
              <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showArchived}
                  onChange={(e) => setShowArchived(e.target.checked)}
                />
                <span>Tampilkan profil terarsip</span>
              </label>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-600">
                    <th className="py-2.5 px-3 w-8">
                      <input
                        type="checkbox"
                        aria-label="Pilih semua profil yang tampil"
                        checked={
                          profilesList.length > 0 &&
                          profilesList.every((p) => selectedIds.includes(p.id))
                        }
                        onChange={toggleSelectAllFiltered}
                      />
                    </th>
                    <th className="py-2.5 px-4 font-semibold">Profil (Tampilan &amp; Lengkap)</th>
                    <th className="py-2.5 px-4 font-semibold">Kategori</th>
                    <th className="py-2.5 px-4 font-semibold">Tipologi Multi-Kerangka</th>
                    <th className="py-2.5 px-4 font-semibold">Kode Klaim</th>
                    <th className="py-2.5 px-4 font-semibold">Status</th>
                    <th className="py-2.5 px-4 font-semibold text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {profilesList.map((p) => (
                    <tr key={p.id} className={p.archived ? 'bg-slate-50 opacity-70' : 'hover:bg-slate-50/70'}>
                      <td className="py-2.5 px-3">
                        <input
                          type="checkbox"
                          aria-label={`Pilih ${p.displayName}`}
                          checked={selectedIds.includes(p.id)}
                          onChange={() => toggleSelectProfile(p.id)}
                        />
                      </td>
                      <td className="py-2.5 px-4">
                        <div className="flex items-center gap-2.5">
                          <ProfileAvatar profile={p} size="sm" />
                          <div>
                            <div className="font-semibold text-slate-900">{p.displayName}</div>
                            <div className="text-[11px] text-slate-500">{p.fullName}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-2.5 px-4 text-slate-700">
                        <div>{p.category}</div>
                        <div className="text-[11px] text-slate-500">{p.affiliation}</div>
                      </td>
                      <td className="py-2.5 px-4 font-mono space-y-0.5">
                        <div>
                          <span className={getQuadraTheme(p.typology.quadra).text}>
                            {p.typology.quadra || '-'}
                          </span>{' '}
                          · {p.typology.socionics || '-'} · {p.typology.enneagramRaw || '-'} ·{' '}
                          {p.typology.jungian || '-'}
                          {p.typology.psychosophyCode ? ` · ${p.typology.psychosophyCode}` : ''}
                        </div>
                        {(p.typology.mbti || p.typology.sloanCode || p.typology.temperament) && (
                          <div className="text-[11px] text-slate-500">
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
                      </td>
                      <td className="py-2.5 px-4 font-mono">
                        <div className="flex items-center gap-1.5">
                          <span>{p.claimCode || '-'}</span>
                          <button
                            type="button"
                            onClick={() => handleRegenerateClaimCode(p.id)}
                            title="Buat kode klaim baru"
                            aria-label={`Buat ulang kode klaim ${p.displayName}`}
                            className="text-slate-400 hover:text-indigo-700"
                          >
                            <RefreshCw className="w-3 h-3" />
                          </button>
                        </div>
                        <div className="text-[10px] text-slate-500">
                          {p.claimedByAccountId ? 'Sudah diklaim' : 'Belum diklaim'}
                        </div>
                      </td>
                      <td className="py-2.5 px-4 text-slate-600">{p.typology.status}</td>
                      <td className="py-2.5 px-4 text-right whitespace-nowrap space-x-2">
                        <button
                          type="button"
                          onClick={() => openEditor(p)}
                          aria-label={`Sunting ${p.displayName}`}
                          className="inline-flex items-center gap-1 px-2.5 py-1 text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded font-medium"
                        >
                          <Edit3 className="w-3 h-3" />
                          Sunting
                        </button>
                        {!p.archived && (
                          <button
                            type="button"
                            onClick={() => handleArchiveOrDelete(p, false)}
                            aria-label={`Arsipkan ${p.displayName}`}
                            className="inline-flex items-center gap-1 px-2 py-1 text-slate-600 hover:text-amber-800 hover:bg-amber-50 rounded"
                          >
                            <Archive className="w-3 h-3" />
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => handleArchiveOrDelete(p, true)}
                          aria-label={`Hapus permanen ${p.displayName}`}
                          className="inline-flex items-center gap-1 px-2 py-1 text-slate-500 hover:text-red-700 hover:bg-red-50 rounded"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB: DATA QUALITY, DUPLICATES & VALIDATED CSV */}
      {tab === 'quality' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white border border-slate-200 rounded-xl p-5">
              <div className="text-xs text-slate-500">Total Profil Aktif</div>
              <div className="text-2xl font-display font-bold text-slate-900 tabular-nums mt-1">
                {qualityReport.totalActive}
              </div>
            </div>
            <div className="bg-white border border-slate-200 rounded-xl p-5">
              <div className="text-xs text-slate-500">Profil Belum Terisi Penuh</div>
              <div className="text-2xl font-display font-bold text-amber-800 tabular-nums mt-1">
                {qualityReport.incompleteProfilesCount}
              </div>
              <div className="text-[11px] text-slate-500 mt-1">
                Profil tidak lengkap diperbolehkan dalam sistem.
              </div>
            </div>
            <div className="bg-white border border-slate-200 rounded-xl p-5">
              <div className="text-xs text-slate-500">Potensi Duplikat Nama</div>
              <div className="text-2xl font-display font-bold text-indigo-800 tabular-nums mt-1">
                {qualityReport.duplicateGroups.length} kelompok
              </div>
            </div>
          </div>

          {/* Missing field breakdown */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
            <h2 className="text-lg font-display font-semibold text-slate-900">
              Audit Kelengkapan Bidang Tipologi
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 text-xs">
              {qualityReport.missingFieldCounts.map((item) => (
                <button
                  key={item.fieldKey}
                  type="button"
                  onClick={() => {
                    setMissingFieldFilter(item.fieldKey);
                    setTab('profiles');
                  }}
                  className="p-3 rounded-lg border border-slate-200 bg-slate-50 hover:border-indigo-300 text-left space-y-1 transition-colors"
                >
                  <div className="font-semibold text-slate-900">{item.label}</div>
                  <div className="font-mono text-amber-800 tabular-nums">
                    {item.missingCount} belum terisi
                  </div>
                  <div className="text-[11px] text-indigo-700">Lihat daftar →</div>
                </button>
              ))}
            </div>
          </div>

          {/* Duplicate Groups */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-3">
            <h2 className="text-lg font-display font-semibold text-slate-900">
              Detektor Duplikat Profil
            </h2>
            {qualityReport.duplicateGroups.length === 0 ? (
              <p className="text-xs text-slate-600">
                Tidak ditemukan nama tampilan ganda pada profil aktif saat ini.
              </p>
            ) : (
              <div className="space-y-3 text-xs">
                {qualityReport.duplicateGroups.map((grp) => (
                  <div key={grp.normalizedKey} className="p-3.5 rounded-lg bg-amber-50 border border-amber-200 space-y-2">
                    <div className="font-semibold text-amber-950">
                      Duplikat Terdeteksi: &ldquo;{grp.normalizedKey}&rdquo; ({grp.reason})
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {grp.profiles.map((gp) => (
                        <span key={gp.id} className="px-2.5 py-1 rounded bg-white border border-amber-200 text-slate-800">
                          {gp.displayName} ({gp.fullName} · {gp.category})
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* CSV Export & Validated Import */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-4">
              <div>
                <h2 className="text-lg font-display font-semibold text-slate-900">
                  Ekspor &amp; Impor CSV Tervalidasi (Dengan Pratinjau Diff)
                </h2>
                <p className="text-xs text-slate-600 mt-0.5">
                  Unduh template CSV saat ini, sunting di spreadsheet (termasuk kolom <code>mbti</code>, <code>mbtiCognitiveStack</code>, <code>sloanCode</code>, <code>sloanExtended</code>, <code>temperament</code>, <code>temperamentSecondary</code>), lalu unggah untuk meninjau selisih sebelum diterapkan.
                </p>
              </div>
              <button
                type="button"
                onClick={handleExportCsv}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-indigo-800 bg-indigo-50 hover:bg-indigo-100 rounded-lg whitespace-nowrap"
              >
                <FileSpreadsheet className="w-3.5 h-3.5" />
                Unduh CSV Profil Aktif
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-3 text-xs">
              <label className="inline-flex items-center gap-1.5 px-3.5 py-2 font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg cursor-pointer whitespace-nowrap">
                <Upload className="w-3.5 h-3.5" />
                <span>Unggah File .CSV</span>
                <input type="file" accept=".csv,text/csv" onChange={handleCsvFileUpload} className="hidden" />
              </label>
              {csvInput && (
                <button
                  type="button"
                  onClick={() => setCsvInput('')}
                  className="text-slate-500 hover:underline"
                >
                  Bersihkan pratinjau CSV
                </button>
              )}
            </div>

            <textarea
              rows={5}
              value={csvInput}
              onChange={(e) => setCsvInput(e.target.value)}
              placeholder="Atau tempelkan isi CSV di sini (baris pertama wajib header kolom, minimal memuat displayName)..."
              className="w-full px-3 py-2 text-xs font-mono border border-slate-300 rounded-lg"
            />

            {parsedCsvPreview && (
              <div className="space-y-3 text-xs">
                {parsedCsvPreview.headerError ? (
                  <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-900">
                    {parsedCsvPreview.headerError}
                  </div>
                ) : (
                  <>
                    <div className="overflow-x-auto border border-slate-200 rounded-lg">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-slate-50 border-b border-slate-200 text-slate-600">
                            <th className="py-2 px-3">Baris</th>
                            <th className="py-2 px-3">Nama</th>
                            <th className="py-2 px-3">Aksi</th>
                            <th className="py-2 px-3">Selisih Perubahan / Kesalahan</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                          {parsedCsvPreview.rows.map((row) => (
                            <tr key={row.rowIndex}>
                              <td className="py-2 px-3 font-mono">{row.rowIndex}</td>
                              <td className="py-2 px-3 font-medium text-slate-900">{row.displayName}</td>
                              <td className="py-2 px-3 whitespace-nowrap">
                                <span
                                  className={`px-2 py-0.5 rounded font-semibold ${
                                    row.action === 'error'
                                      ? 'bg-red-50 text-red-800'
                                      : row.action === 'create'
                                      ? 'bg-emerald-50 text-emerald-800'
                                      : 'bg-indigo-50 text-indigo-800'
                                  }`}
                                >
                                  {row.action === 'error'
                                    ? 'Error'
                                    : row.action === 'create'
                                    ? 'Profil Baru'
                                    : 'Perbarui'}
                                </span>
                              </td>
                              <td className="py-2 px-3">
                                {row.errors.length > 0 ? (
                                  <span className="text-red-700">{row.errors.join('; ')}</span>
                                ) : row.changes.length === 0 ? (
                                  <span className="text-slate-400">Tidak ada perubahan field</span>
                                ) : (
                                  <div className="flex flex-wrap gap-1.5">
                                    {row.changes.map((c, idx) => (
                                      <span key={idx} className="px-2 py-0.5 rounded bg-slate-100 font-mono text-[11px]">
                                        {c.field}: {c.from} → {c.to}
                                      </span>
                                    ))}
                                  </div>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    <button
                      type="button"
                      disabled={!parsedCsvPreview.valid || parsedCsvPreview.rows.length === 0 || csvImporting}
                      onClick={handleApplyCsvImport}
                      className="px-4 py-2 font-semibold text-white bg-indigo-700 hover:bg-indigo-800 rounded-lg disabled:opacity-50 whitespace-nowrap"
                    >
                      {csvImporting
                        ? 'Menerapkan Impor...'
                        : `Terapkan Impor CSV (${parsedCsvPreview.rows.length} baris)`}
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: CHANGE HISTORY & RESTORE */}
      {tab === 'history' && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-indigo-700" />
            <h2 className="text-lg font-display font-semibold text-slate-900">
              Log Perubahan Profil &amp; Pemulihan Versi
            </h2>
          </div>
          {overview?.changeLogs.length === 0 ? (
            <p className="text-sm text-slate-500">
              Belum ada perubahan yang tercatat sejak database diinisialisasi.
            </p>
          ) : (
            <div className="divide-y divide-slate-200">
              {overview?.changeLogs.map((log) => (
                <div key={log.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="space-y-1">
                    <div className="font-semibold text-slate-900">
                      {log.profileDisplayName} · {log.field}{' '}
                      <span className="font-normal text-slate-500">({log.category})</span>
                    </div>
                    <div className="text-slate-600 font-mono">
                      Sebelum: {log.previousValue} → Sesudah: {log.newValue}
                    </div>
                    <div className="text-[11px] text-slate-500">
                      Oleh {log.changedBy} ({log.changedByRole}) ·{' '}
                      <span className="tabular-nums">
                        {new Date(log.timestamp).toLocaleString('id-ID')}
                      </span>
                    </div>
                  </div>
                  {log.snapshotBefore && Object.keys(log.snapshotBefore).length > 0 && (
                    <button
                      type="button"
                      onClick={() => handleRestoreLog(log)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-lg shrink-0"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      Pulihkan Versi Ini
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: MODULE M — ADMIN CONTENT MANAGEMENT */}
      {tab === 'content' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-6 bg-white border border-slate-200 rounded-xl p-6 space-y-5">
            <h2 className="text-lg font-display font-semibold text-slate-900">
              Manajemen Artikel Teori (Terpisah dari Data Siswa)
            </h2>
            <form onSubmit={handleAddArticle} className="space-y-3 text-xs">
              <input
                type="text"
                required
                placeholder="Judul artikel teori..."
                value={newArticle.title}
                onChange={(e) => setNewArticle({ ...newArticle, title: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
              />
              <select
                value={newArticle.category}
                onChange={(e) =>
                  setNewArticle({ ...newArticle, category: e.target.value as TheoryArticle['category'] })
                }
                className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white text-sm"
              >
                <option value="Socionics">Socionics</option>
                <option value="Enneagram">Enneagram</option>
                <option value="Tipologi Jung">Tipologi Jung</option>
                <option value="Psikosofi">Psikosofi</option>
                <option value="Komunikasi">Komunikasi</option>
                <option value="Akademik">Akademik</option>
              </select>
              <textarea
                required
                rows={3}
                placeholder="Penjelasan teoretis lengkap..."
                value={newArticle.content}
                onChange={(e) => setNewArticle({ ...newArticle, content: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
              />
              <button
                type="submit"
                className="px-4 py-2 text-xs font-medium text-white bg-indigo-700 hover:bg-indigo-800 rounded-lg"
              >
                Terbitkan Artikel Teori
              </button>
            </form>

            <div className="divide-y divide-slate-200 pt-2">
              {overview?.theoryArticles.map((art) => (
                <div key={art.id} className="py-3 flex items-start justify-between gap-3 text-xs">
                  <div>
                    <div className="font-semibold text-slate-900">{art.title}</div>
                    <div className="text-slate-500">
                      {art.category} · {art.published ? 'Diterbitkan' : 'Draf / Disembunyikan'}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleTogglePublishArticle(art)}
                    className="px-2.5 py-1 rounded border border-slate-300 hover:bg-slate-100 shrink-0"
                  >
                    {art.published ? 'Tarik Publikasi' : 'Terbitkan'}
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-6 bg-white border border-slate-200 rounded-xl p-6 space-y-5">
            <h2 className="text-lg font-display font-semibold text-slate-900">
              Referensi &amp; Sitasi Ilmiah
            </h2>
            <form onSubmit={handleAddReference} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  required
                  placeholder="Penulis"
                  value={newRef.author}
                  onChange={(e) => setNewRef({ ...newRef, author: e.target.value })}
                  className="px-3 py-2 border border-slate-300 rounded-lg text-sm"
                />
                <input
                  type="text"
                  required
                  placeholder="Tahun"
                  value={newRef.year}
                  onChange={(e) => setNewRef({ ...newRef, year: e.target.value })}
                  className="px-3 py-2 border border-slate-300 rounded-lg text-sm"
                />
              </div>
              <input
                type="text"
                required
                placeholder="Judul buku / makalah referensi"
                value={newRef.title}
                onChange={(e) => setNewRef({ ...newRef, title: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
              />
              <select
                value={newRef.framework}
                onChange={(e) =>
                  setNewRef({ ...newRef, framework: e.target.value as ReferenceCitation['framework'] })
                }
                className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white text-sm"
              >
                <option value="Socionics">Socionics</option>
                <option value="Enneagram">Enneagram</option>
                <option value="Tipologi Jung">Tipologi Jung</option>
                <option value="Psikosofi">Psikosofi</option>
                <option value="Pendidikan & Psikologi Belajar">Pendidikan &amp; Psikologi Belajar</option>
              </select>
              <button
                type="submit"
                className="px-4 py-2 text-xs font-medium text-white bg-indigo-700 hover:bg-indigo-800 rounded-lg"
              >
                Tambah Referensi
              </button>
            </form>

            <div className="space-y-2 text-xs">
              {overview?.references.map((r) => (
                <div key={r.id} className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                  <strong className="text-slate-900">
                    {r.author} ({r.year})
                  </strong>{' '}
                  · <em>{r.title}</em>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: DEVELOPMENT MODE / STUDENT ACCESS MODE & ACCOUNTS */}
      {tab === 'system' && overview && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
            <h2 className="text-lg font-display font-semibold text-slate-900">
              Mode Operasional Sistem
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              Gunakan <strong>Mode Pengembangan</strong> saat Administrator masih melengkapi foto,
              memperbaiki data awal, atau menguji modul sebelum siswa masuk. Aktifkan{' '}
              <strong>Mode Akses Siswa</strong> saat situs siap dibuka untuk pendaftaran dan klaim profil.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleToggleMode('development')}
                className={`p-4 rounded-xl border text-left transition-colors ${
                  overview.settings.mode === 'development'
                    ? 'bg-amber-50 border-amber-400 text-amber-950'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div className="text-sm font-semibold">Mode Pengembangan</div>
                <p className="text-xs mt-1">
                  Hanya Administrator yang bisa masuk; pendaftaran dan login siswa dinonaktifkan.
                </p>
              </button>
              <button
                type="button"
                onClick={() => handleToggleMode('student_access')}
                className={`p-4 rounded-xl border text-left transition-colors ${
                  overview.settings.mode === 'student_access'
                    ? 'bg-emerald-50 border-emerald-400 text-emerald-950'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div className="text-sm font-semibold">Mode Akses Siswa</div>
                <p className="text-xs mt-1">
                  Siswa &amp; guru dapat mendaftar, menautkan profil via kode klaim, dan menyunting profil sendiri.
                </p>
              </button>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
            <h2 className="text-lg font-display font-semibold text-slate-900">
              Akun Terdaftar ({overview.accounts.length})
            </h2>
            <div className="divide-y divide-slate-200 text-xs">
              {overview.accounts.map((acc) => (
                <div key={acc.id} className="py-2.5 flex items-center justify-between gap-2">
                  <div>
                    <div className="font-semibold text-slate-900">
                      {acc.displayName} (@{acc.username})
                    </div>
                    <div className="text-slate-500">
                      Peran: {acc.role} · Profil tertaut: {acc.linkedProfileId || 'Tidak ada'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {tab === 'banner' && overview?.bannerConfig && (
        <AdminBannerManager
          bannerConfig={overview.bannerConfig}
          onUpdated={async (nextConfig, msg) => {
            setOverview((prev) => (prev ? { ...prev, bannerConfig: nextConfig } : prev));
            setStatusMsg(msg);
            await onDataMutated();
          }}
        />
      )}

      {tab === 'catalog' && overview && (
        <AdminCatalogManager
          universities={overview.universities || []}
          programs={overview.programs || []}
          careers={overview.careers || []}
          subjectTemplates={overview.subjectTemplates || []}
          concepts={overview.concepts || []}
          explorationConfig={overview.explorationConfig}
          onMutated={async (msg) => {
            setStatusMsg(msg);
            await fetchOverview();
            await onDataMutated();
          }}
        />
      )}

      {/* ADD NEW PERSON MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4" role="dialog" aria-modal="true">
          <form
            onSubmit={handleCreatePerson}
            className="w-full max-w-lg bg-white border border-slate-200 rounded-xl shadow-xl p-6 space-y-4"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h2 className="text-lg font-display font-bold text-slate-900">
                Tambah Profil Baru (Siswa / Guru / Wali Kelas / Staf)
              </h2>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                aria-label="Tutup modal tambah profil"
                className="p-1.5 text-slate-500 hover:text-slate-900"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-slate-500">
              Klasifikasi tipologi tidak diisi otomatis—seluruh kolom tipe akan dibiarkan kosong/Undetermined sampai diisi atau dikonfirmasi.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Nama Tampilan Publik *
                </label>
                <input
                  type="text"
                  required
                  value={newPerson.displayName}
                  onChange={(e) => setNewPerson({ ...newPerson, displayName: e.target.value })}
                  placeholder="Mis. Bu Ratna"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Nama Lengkap Internal *
                </label>
                <input
                  type="text"
                  required
                  value={newPerson.fullName}
                  onChange={(e) => setNewPerson({ ...newPerson, fullName: e.target.value })}
                  placeholder="Mis. Ratna Kusumawati, S.Pd."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Kategori Peran *
                </label>
                <select
                  value={newPerson.category}
                  onChange={(e) =>
                    setNewPerson({ ...newPerson, category: e.target.value as ProfileCategory })
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
                >
                  <option value="Siswa">Siswa</option>
                  <option value="Wali Kelas">Wali Kelas</option>
                  <option value="Guru">Guru</option>
                  <option value="Staf Sekolah">Staf Sekolah</option>
                  <option value="Partisipan Lainnya">Partisipan Lainnya</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Afiliasi / Kelas / Bidang
                </label>
                <input
                  type="text"
                  value={newPerson.affiliation}
                  onChange={(e) => setNewPerson({ ...newPerson, affiliation: e.target.value })}
                  placeholder="Mis. Wali Kelas XII"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>
            </div>
            <textarea
              rows={2}
              placeholder="Biografi atau catatan peran (opsional)"
              value={newPerson.bio}
              onChange={(e) => setNewPerson({ ...newPerson, bio: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg"
            />
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 text-xs font-medium text-slate-700 bg-slate-100 rounded-lg"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-xs font-medium text-white bg-indigo-700 hover:bg-indigo-800 rounded-lg"
              >
                Simpan Profil Baru
              </button>
            </div>
          </form>
        </div>
      )}

      {/* PROFILE EDITOR MODAL */}
      {editingProfile && editDraft && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 overflow-y-auto" role="dialog" aria-modal="true">
          <form
            onSubmit={handleSaveEdit}
            className="w-full max-w-3xl bg-white border border-slate-200 rounded-xl shadow-xl p-6 space-y-5 my-8 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-3">
                <ProfileAvatar profile={editDraft} size="md" />
                <div>
                  <h2 className="text-lg font-display font-bold text-slate-900">
                    Editor Profil — {editDraft.displayName}
                  </h2>
                  <p className="text-xs text-slate-500">
                    Ubah satu bidang atau seluruh profil; statistik kelas akan otomatis diperbarui.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setEditingProfile(null);
                  setEditDraft(null);
                }}
                aria-label="Tutup editor profil"
                className="p-1.5 text-slate-500 hover:text-slate-900"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <label className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-lg cursor-pointer">
                <Camera className="w-3.5 h-3.5" />
                <span>{editDraft.photoUrl ? 'Ganti Foto Profil' : 'Unggah Foto Profil'}</span>
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  onChange={(e) => handlePhotoUpload(editDraft.id, e)}
                  className="hidden"
                />
              </label>
              {editDraft.photoUrl && (
                <button
                  type="button"
                  onClick={() => handleRemovePhoto(editDraft.id)}
                  className="px-3 py-1.5 text-xs font-medium text-red-700 bg-red-50 rounded-lg"
                >
                  Hapus Foto
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block font-medium text-slate-700 mb-1">Nama Tampilan Publik</label>
                <input
                  type="text"
                  required
                  value={editDraft.displayName}
                  onChange={(e) => setEditDraft({ ...editDraft, displayName: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="block font-medium text-slate-700 mb-1">Nama Lengkap Internal</label>
                <input
                  type="text"
                  required
                  value={editDraft.fullName}
                  onChange={(e) => setEditDraft({ ...editDraft, fullName: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="block font-medium text-slate-700 mb-1">Kategori Peran</label>
                <select
                  value={editDraft.category}
                  onChange={(e) =>
                    setEditDraft({ ...editDraft, category: e.target.value as ProfileCategory })
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white text-sm"
                >
                  <option value="Siswa">Siswa</option>
                  <option value="Guru">Guru</option>
                  <option value="Wali Kelas">Wali Kelas</option>
                  <option value="Staf Sekolah">Staf Sekolah</option>
                  <option value="Partisipan Lainnya">Partisipan Lainnya</option>
                </select>
              </div>
              <div>
                <label className="block font-medium text-slate-700 mb-1">Afiliasi / Kelas</label>
                <input
                  type="text"
                  value={editDraft.affiliation}
                  onChange={(e) => setEditDraft({ ...editDraft, affiliation: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs pt-2 border-t border-slate-200">
              <div>
                <label className="block font-medium text-slate-700 mb-1">Socionics</label>
                <select
                  value={editDraft.typology.socionics}
                  onChange={(e) => {
                    const soc = e.target.value as SocionicsCode | '';
                    setEditDraft({
                      ...editDraft,
                      typology: {
                        ...editDraft.typology,
                        socionics: soc,
                        quadra: soc ? SOCIONICS_TYPES[soc].quadra : editDraft.typology.quadra,
                      },
                    });
                  }}
                  className="w-full px-2.5 py-2 border border-slate-300 rounded-lg bg-white"
                >
                  <option value="">Kosong</option>
                  {(Object.keys(SOCIONICS_TYPES) as SocionicsCode[]).map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block font-medium text-slate-700 mb-1">Quadra</label>
                <select
                  value={editDraft.typology.quadra}
                  onChange={(e) =>
                    setEditDraft({
                      ...editDraft,
                      typology: { ...editDraft.typology, quadra: e.target.value as QuadraName | '' },
                    })
                  }
                  className="w-full px-2.5 py-2 border border-slate-300 rounded-lg bg-white"
                >
                  <option value="">Kosong</option>
                  <option value="Alpha">Alpha</option>
                  <option value="Beta">Beta</option>
                  <option value="Gamma">Gamma</option>
                  <option value="Delta">Delta</option>
                </select>
              </div>
              <div>
                <label className="block font-medium text-slate-700 mb-1">Notasi Jung</label>
                <input
                  type="text"
                  value={editDraft.typology.jungian}
                  onChange={(e) =>
                    setEditDraft({
                      ...editDraft,
                      typology: { ...editDraft.typology, jungian: e.target.value },
                    })
                  }
                  className="w-full px-2.5 py-2 border border-slate-300 rounded-lg font-mono"
                />
              </div>
              <div>
                <label className="block font-medium text-slate-700 mb-1">Status</label>
                <select
                  value={editDraft.typology.status}
                  onChange={(e) =>
                    setEditDraft({
                      ...editDraft,
                      typology: { ...editDraft.typology, status: e.target.value as TypologyStatus },
                    })
                  }
                  className="w-full px-2.5 py-2 border border-slate-300 rounded-lg bg-white"
                >
                  <option value="Initial Typing">Initial Typing</option>
                  <option value="Self-Reviewed">Self-Reviewed</option>
                  <option value="Revised">Revised</option>
                  <option value="Undetermined">Undetermined</option>
                </select>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Enneagram Inti</label>
                <select
                  value={editDraft.typology.enneagramCore ?? ''}
                  onChange={(e) => {
                    const core = e.target.value ? (Number(e.target.value) as EnneagramCore) : null;
                    setEditDraft({
                      ...editDraft,
                      typology: {
                        ...editDraft.typology,
                        enneagramCore: core,
                        enneagramRaw: core
                          ? `${editDraft.typology.instinctVariant || ''}${core}`
                          : '',
                      },
                    });
                  }}
                  className="w-full px-2.5 py-2 border border-slate-300 rounded-lg bg-white"
                >
                  <option value="">Kosong</option>
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block font-medium text-slate-700 mb-1">Insting Dominan</label>
                <select
                  value={editDraft.typology.instinctVariant}
                  onChange={(e) => {
                    const inst = e.target.value as InstinctCode | '';
                    setEditDraft({
                      ...editDraft,
                      typology: {
                        ...editDraft.typology,
                        instinctVariant: inst,
                        enneagramRaw: editDraft.typology.enneagramCore
                          ? `${inst}${editDraft.typology.enneagramCore}`
                          : '',
                      },
                    });
                  }}
                  className="w-full px-2.5 py-2 border border-slate-300 rounded-lg bg-white"
                >
                  <option value="">Kosong</option>
                  <option value="SP">SP</option>
                  <option value="SO">SO</option>
                  <option value="SX">SX</option>
                </select>
              </div>
              <div>
                <label className="block font-medium text-slate-700 mb-1">Sayap &amp; Stacking</label>
                <div className="grid grid-cols-2 gap-1">
                  <input
                    type="text"
                    placeholder="Sayap"
                    value={editDraft.typology.enneagramWing}
                    onChange={(e) =>
                      setEditDraft({
                        ...editDraft,
                        typology: { ...editDraft.typology, enneagramWing: e.target.value },
                      })
                    }
                    className="px-2 py-2 border border-slate-300 rounded-lg font-mono"
                  />
                  <select
                    value={editDraft.typology.instinctStacking}
                    onChange={(e) =>
                      setEditDraft({
                        ...editDraft,
                        typology: {
                          ...editDraft.typology,
                          instinctStacking: e.target.value as InstinctualStacking | '',
                        },
                      })
                    }
                    className="px-1 py-2 border border-slate-300 rounded-lg bg-white"
                  >
                    <option value="">Stack</option>
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
                <label className="block font-medium text-slate-700 mb-1">Tritype / Three Fix</label>
                <input
                  type="text"
                  placeholder="Mis. 258"
                  value={editDraft.typology.tritype}
                  onChange={(e) =>
                    setEditDraft({
                      ...editDraft,
                      typology: { ...editDraft.typology, tritype: e.target.value },
                    })
                  }
                  className="w-full px-2.5 py-2 border border-slate-300 rounded-lg font-mono"
                />
              </div>
              <div>
                <label className="block font-medium text-slate-700 mb-1">Psikosofi (L·V·E·F)</label>
                <input
                  type="text"
                  maxLength={4}
                  placeholder="Mis. LVEF"
                  value={editDraft.typology.psychosophyCode || ''}
                  onChange={(e) =>
                    setEditDraft({
                      ...editDraft,
                      typology: {
                        ...editDraft.typology,
                        psychosophyCode: e.target.value.toUpperCase(),
                      },
                    })
                  }
                  className="w-full px-2.5 py-2 border border-slate-300 rounded-lg font-mono uppercase"
                />
                {!validatePsychosophyCode(editDraft.typology.psychosophyCode || '').valid && (
                  <span className="text-[11px] text-red-700 block mt-0.5">
                    Harus 4 huruf unik L, V, E, F
                  </span>
                )}
              </div>
              <div>
                <label className="block font-medium text-slate-700 mb-1">Keyakinan Psikosofi</label>
                <select
                  value={editDraft.typology.psychosophyConfidence || 'Belum Dipastikan'}
                  onChange={(e) =>
                    setEditDraft({
                      ...editDraft,
                      typology: {
                        ...editDraft.typology,
                        psychosophyConfidence: e.target.value as PsychosophyConfidence,
                      },
                    })
                  }
                  className="w-full px-2 py-2 border border-slate-300 rounded-lg bg-white"
                >
                  <option value="Belum Dipastikan">Belum Dipastikan</option>
                  <option value="Provisional / Dugaan Awal">Provisional</option>
                  <option value="Cukup Yakin">Cukup Yakin</option>
                  <option value="Terkonfirmasi Mandiri">Terkonfirmasi</option>
                </select>
              </div>
              <div>
                <label className="block font-medium text-slate-700 mb-1">MBTI</label>
                <select
                  value={editDraft.typology.mbti || ''}
                  onChange={(e) => {
                    const nextMbti = e.target.value;
                    const resolved = nextMbti ? resolveMbtiCognitiveStack(nextMbti).stackText : '';
                    setEditDraft({
                      ...editDraft,
                      typology: {
                        ...editDraft.typology,
                        mbti: nextMbti,
                        mbtiCognitiveStack: resolved || editDraft.typology.mbtiCognitiveStack || '',
                      },
                    });
                  }}
                  className="w-full px-2.5 py-2 border border-slate-300 rounded-lg bg-white"
                >
                  <option value="">Kosong</option>
                  {Object.keys(MBTI_STACK_DYNAMICS_16).map((code) => (
                    <option key={code} value={code}>
                      {code}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <div className="flex items-center justify-between gap-1 mb-1">
                  <label className="block font-medium text-slate-700">Stack Kognitif MBTI</label>
                  {editDraft.typology.mbti && (
                    <button
                      type="button"
                      onClick={() => {
                        const stack = resolveMbtiCognitiveStack(editDraft.typology.mbti).stackText;
                        if (stack) {
                          setEditDraft({
                            ...editDraft,
                            typology: { ...editDraft.typology, mbtiCognitiveStack: stack },
                          });
                        }
                      }}
                      className="text-[10px] text-indigo-700 hover:underline whitespace-nowrap"
                    >
                      Isi Standar
                    </button>
                  )}
                </div>
                <input
                  type="text"
                  placeholder="Mis. Ni-Te-Fi-Se"
                  value={editDraft.typology.mbtiCognitiveStack || ''}
                  onChange={(e) =>
                    setEditDraft({
                      ...editDraft,
                      typology: { ...editDraft.typology, mbtiCognitiveStack: e.target.value },
                    })
                  }
                  className="w-full px-2.5 py-2 border border-slate-300 rounded-lg font-mono"
                />
              </div>
              <div>
                <label className="block font-medium text-slate-700 mb-1">SLOAN (5 Huruf)</label>
                <input
                  type="text"
                  maxLength={5}
                  placeholder="Mis. RLOEI"
                  value={editDraft.typology.sloanCode || ''}
                  onChange={(e) =>
                    setEditDraft({
                      ...editDraft,
                      typology: { ...editDraft.typology, sloanCode: e.target.value.toUpperCase() },
                    })
                  }
                  className="w-full px-2.5 py-2 border border-slate-300 rounded-lg font-mono uppercase"
                />
              </div>
              <div>
                <label className="block font-medium text-slate-700 mb-1">Notasi SLOAN Lanjutan</label>
                <input
                  type="text"
                  placeholder="Mis. R[L]O/E/I"
                  value={editDraft.typology.sloanExtended || ''}
                  onChange={(e) =>
                    setEditDraft({
                      ...editDraft,
                      typology: { ...editDraft.typology, sloanExtended: e.target.value },
                    })
                  }
                  className="w-full px-2.5 py-2 border border-slate-300 rounded-lg font-mono"
                />
              </div>
              <div>
                <label className="block font-medium text-slate-700 mb-1">Temperamen Utama</label>
                <select
                  value={editDraft.typology.temperament || ''}
                  onChange={(e) =>
                    setEditDraft({
                      ...editDraft,
                      typology: {
                        ...editDraft.typology,
                        temperament: e.target.value as TemperamentName | '',
                      },
                    })
                  }
                  className="w-full px-2.5 py-2 border border-slate-300 rounded-lg bg-white"
                >
                  <option value="">Kosong</option>
                  <option value="Choleric">Choleric</option>
                  <option value="Sanguine">Sanguine</option>
                  <option value="Melancholic">Melancholic</option>
                  <option value="Phlegmatic">Phlegmatic</option>
                </select>
              </div>
              <div>
                <label className="block font-medium text-slate-700 mb-1">Temperamen Sekunder</label>
                <select
                  value={editDraft.typology.temperamentSecondary || ''}
                  onChange={(e) =>
                    setEditDraft({
                      ...editDraft,
                      typology: {
                        ...editDraft.typology,
                        temperamentSecondary: e.target.value as TemperamentName | '',
                      },
                    })
                  }
                  className="w-full px-2.5 py-2 border border-slate-300 rounded-lg bg-white"
                >
                  <option value="">Tidak ada (Murni)</option>
                  <option value="Choleric">Choleric</option>
                  <option value="Sanguine">Sanguine</option>
                  <option value="Melancholic">Melancholic</option>
                  <option value="Phlegmatic">Phlegmatic</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Deskripsi Profil
              </label>
              <textarea
                rows={2}
                value={editDraft.bio}
                onChange={(e) => setEditDraft({ ...editDraft, bio: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg"
              />
            </div>

            {editDraft.privacySettings && (
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5 text-xs">
                <div className="font-semibold text-slate-900">
                  Kontrol Privasi Granular (7 Komponen)
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                  {(
                    [
                      { key: 'displayName', label: 'Nama Tampilan' },
                      { key: 'fullName', label: 'Nama Lengkap' },
                      { key: 'avatar', label: 'Foto Profil' },
                      { key: 'typology', label: 'Bidang Tipologi' },
                      { key: 'bio', label: 'Bio & Minat' },
                      { key: 'reflections', label: 'Refleksi Pribadi' },
                      { key: 'idCard', label: 'Kartu ID Tipologi' },
                    ] as { key: keyof ProfilePrivacySettings; label: string }[]
                  ).map((item) => (
                    <div key={item.key}>
                      <label className="block text-[11px] font-medium text-slate-600 mb-0.5">
                        {item.label}
                      </label>
                      <select
                        value={editDraft.privacySettings?.[item.key] || 'public'}
                        onChange={(e) =>
                          setEditDraft({
                            ...editDraft,
                            privacySettings: {
                              ...editDraft.privacySettings!,
                              [item.key]: e.target.value as GranularVisibilityLevel,
                            },
                          })
                        }
                        className="w-full px-2 py-1.5 border border-slate-300 rounded bg-white"
                      >
                        <option value="public">Publik</option>
                        <option value="classmates">Teman Sekelas</option>
                        <option value="group_members">Anggota Kelompok</option>
                        <option value="admins">Hanya Admin</option>
                        <option value="private">Privat</option>
                      </select>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-200 text-xs">
              <div className="flex items-center gap-4">
                <select
                  value={editDraft.visibility}
                  onChange={(e) =>
                    setEditDraft({
                      ...editDraft,
                      visibility: e.target.value as 'public' | 'limited' | 'private',
                    })
                  }
                  className="px-2.5 py-1.5 border border-slate-300 rounded-lg bg-white"
                >
                  <option value="public">Visibilitas: Publik</option>
                  <option value="limited">Visibilitas: Terbatas</option>
                  <option value="private">Visibilitas: Privat</option>
                </select>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editDraft.exposeFullName}
                    onChange={(e) =>
                      setEditDraft({ ...editDraft, exposeFullName: e.target.checked })
                    }
                  />
                  <span>Tampilkan nama lengkap ke publik</span>
                </label>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setEditingProfile(null);
                    setEditDraft(null);
                  }}
                  className="px-4 py-2 font-medium text-slate-700 bg-slate-100 rounded-lg"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 font-medium text-white bg-indigo-700 hover:bg-indigo-800 rounded-lg"
                >
                  Simpan Perubahan
                </button>
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
