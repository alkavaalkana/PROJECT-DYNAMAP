import React, { useEffect, useState } from 'react';
import {
  BookOpen,
  Briefcase,
  Building2,
  CheckCircle2,
  GraduationCap,
  Pencil,
  Plus,
  Save,
  SlidersHorizontal,
  Trash2,
} from 'lucide-react';
import { DEFAULT_EXPLORATION_CATALOG_CONFIG } from '../data/higherEdAndCareerData';
import type {
  CareerDomainCluster,
  CareerRecord,
  ConceptNode,
  ExplorationCatalogConfig,
  ProvenanceStatus,
  SchoolSubjectTemplate,
  UniversityInstitution,
  UniversityProgram,
} from '../types/dynamap';

interface AdminCatalogManagerProps {
  universities: UniversityInstitution[];
  programs: UniversityProgram[];
  careers: CareerRecord[];
  subjectTemplates: SchoolSubjectTemplate[];
  concepts: ConceptNode[];
  explorationConfig?: ExplorationCatalogConfig;
  onMutated: (msg: string) => Promise<void>;
}

export const AdminCatalogManager: React.FC<AdminCatalogManagerProps> = ({
  universities,
  programs,
  careers,
  subjectTemplates,
  concepts,
  explorationConfig = DEFAULT_EXPLORATION_CATALOG_CONFIG,
  onMutated,
}) => {
  const [subTab, setSubTab] = useState<
    'universities' | 'programs' | 'careers' | 'subjects' | 'concepts' | 'config'
  >('universities');

  const [configDraft, setConfigDraft] = useState<ExplorationCatalogConfig>(explorationConfig);
  useEffect(() => {
    setConfigDraft(explorationConfig);
  }, [explorationConfig]);

  const [newClusterInput, setNewClusterInput] = useState('');
  const [newInterestInput, setNewInterestInput] = useState('');
  const [newCognitiveInput, setNewCognitiveInput] = useState('');
  const [newLearningInput, setNewLearningInput] = useState('');
  const [newMotivationInput, setNewMotivationInput] = useState('');
  const [newActivityInput, setNewActivityInput] = useState('');
  const [newPromptInput, setNewPromptInput] = useState('');

  const [editingUniId, setEditingUniId] = useState<string | null>(null);
  const [newUni, setNewUni] = useState({
    name: '',
    shortName: '',
    city: '',
    province: '',
    officialWebsite: '',
    admissionPortalUrl: '',
    overview: '',
    verificationStatus: 'Terverifikasi Resmi' as ProvenanceStatus,
    academicYear: '2025/2026',
  });

  const [editingProgramId, setEditingProgramId] = useState<string | null>(null);
  const [newProgram, setNewProgram] = useState({
    universityId: universities[0]?.id || '',
    name: '',
    faculty: '',
    disciplineCluster: explorationConfig.disciplineClusters[0] || 'Teknik & Rekayasa',
    concentrations: '',
    description: '',
    keyHighSchoolSubjects: 'Fisika, Kimia, Matematika Lanjut',
    importantSupportingSubjects: 'Bahasa Indonesia, Bahasa Inggris',
    availableRoutes: 'SNBP, SNBT (UTBK), Seleksi Mandiri',
    admissionNotes: '',
    accreditation: 'Unggul (BAN-PT)',
    tuitionInfo: '',
    officialUrl: '',
    verificationStatus: 'Terverifikasi Resmi' as ProvenanceStatus,
  });

  const [editingCareerId, setEditingCareerId] = useState<string | null>(null);
  const [newCareer, setNewCareer] = useState({
    title: '',
    cluster: explorationConfig.disciplineClusters[0] || 'Teknik & Rekayasa',
    summary: '',
    workEnvironment: '',
    educationPathway: '',
    certificationOrLicensing: '',
    relevantSubjects: 'Fisika, Matematika Lanjut',
    verificationStatus: 'Sekunder' as ProvenanceStatus,
  });

  const [editingSubjectId, setEditingSubjectId] = useState<string | null>(null);
  const [newSubject, setNewSubject] = useState({
    name: '',
    shortCode: '',
    category: 'Peminatan / Spesialisasi' as SchoolSubjectTemplate['category'],
    specializationPack: 'FISKIM MATONOMI',
    coreTopics: '',
    description: '',
  });

  const [editingConceptId, setEditingConceptId] = useState<string | null>(null);
  const [newConcept, setNewConcept] = useState({
    shortCode: '',
    label: '',
    framework: 'Socionics' as ConceptNode['framework'],
    subGroup: 'Elemen Informasi',
    summary: '',
    definition: '',
    keyMechanism: '',
    misconception: '',
  });

  async function apiCreate(collection: string, payload: Record<string, unknown>, msg: string) {
    const token = localStorage.getItem('dynamap_token');
    const res = await fetch(`/api/admin/catalog/${collection}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      await onMutated(msg);
    }
  }

  async function apiPatch(
    collection: string,
    id: string,
    payload: Record<string, unknown>,
    msg: string
  ) {
    const token = localStorage.getItem('dynamap_token');
    const res = await fetch(`/api/admin/catalog/${collection}/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      await onMutated(msg);
    }
  }

  async function apiDelete(collection: string, id: string, msg: string) {
    const token = localStorage.getItem('dynamap_token');
    const res = await fetch(`/api/admin/catalog/${collection}/${id}`, {
      method: 'DELETE',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    if (res.ok) {
      await onMutated(msg);
    }
  }

  async function saveExplorationConfig(nextConfig: ExplorationCatalogConfig, msg: string) {
    setConfigDraft(nextConfig);
    const token = localStorage.getItem('dynamap_token');
    const res = await fetch('/api/admin/exploration-config', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(nextConfig),
    });
    if (res.ok) {
      await onMutated(msg);
    }
  }

  return (
    <div className="space-y-6">
      <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-3">
        <h2 className="text-lg font-display font-semibold text-slate-900">
          Manajemen Katalog Pendidikan, Karier, Mapel, Taksonomi &amp; Eksplorasi
        </h2>
        <p className="text-xs text-slate-600">
          Seluruh entri PTN, program studi, karier, templat mata pelajaran, dan konfigurasi pertanyaan/opsi eksplorasi menyimpan metadata sumber serta status verifikasi.
        </p>
        <div className="flex flex-wrap gap-1.5 bg-slate-100 p-1 rounded-lg w-fit">
          {[
            { id: 'universities' as const, label: `PTN (${universities.length})`, icon: Building2 },
            { id: 'programs' as const, label: `Program Studi (${programs.length})`, icon: GraduationCap },
            { id: 'careers' as const, label: `Karier (${careers.length})`, icon: Briefcase },
            { id: 'subjects' as const, label: `Mapel SMA (${subjectTemplates.length})`, icon: BookOpen },
            { id: 'concepts' as const, label: `Konsep (${concepts.length})`, icon: CheckCircle2 },
            { id: 'config' as const, label: 'Konfigurasi Eksplorasi & Rumpun', icon: SlidersHorizontal },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setSubTab(item.id)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap ${
                  subTab === item.id ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {item.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* UNIVERSITIES */}
      {subTab === 'universities' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              const existingUni = editingUniId
                ? universities.find((u) => u.id === editingUniId)
                : null;
              const payload = {
                name: newUni.name.trim(),
                shortName: newUni.shortName.trim().toUpperCase(),
                city: newUni.city.trim(),
                province: newUni.province.trim() || existingUni?.province || '',
                type: existingUni?.type || 'PTN-BH',
                officialWebsite: newUni.officialWebsite.trim() || existingUni?.officialWebsite || '',
                admissionPortalUrl: newUni.admissionPortalUrl.trim(),
                admissionRoutes: existingUni?.admissionRoutes || ['SNBP', 'SNBT (UTBK)', 'Seleksi Mandiri'],
                overview: newUni.overview.trim(),
                provenance: {
                  sourceTitle: existingUni?.provenance.sourceTitle || `Portal Resmi ${newUni.shortName || newUni.name}`,
                  officialUrl: newUni.admissionPortalUrl.trim() || newUni.officialWebsite.trim(),
                  institution: newUni.name.trim(),
                  academicYear: newUni.academicYear,
                  lastVerified: new Date().toISOString().slice(0, 10),
                  verificationStatus: newUni.verificationStatus,
                },
              };
              if (editingUniId) {
                await apiPatch(
                  'universities',
                  editingUniId,
                  payload,
                  `Universitas "${newUni.shortName || newUni.name}" berhasil diperbarui.`
                );
                setEditingUniId(null);
              } else {
                await apiCreate(
                  'universities',
                  payload,
                  `Universitas "${newUni.shortName || newUni.name}" berhasil ditambahkan.`
                );
              }
              setNewUni({
                name: '',
                shortName: '',
                city: '',
                province: '',
                officialWebsite: '',
                admissionPortalUrl: '',
                overview: '',
                verificationStatus: 'Terverifikasi Resmi',
                academicYear: '2025/2026',
              });
            }}
            className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-5 space-y-3 text-xs h-fit"
          >
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-sm font-display font-semibold text-slate-900">
                {editingUniId ? 'Sunting Perguruan Tinggi' : 'Tambah Perguruan Tinggi'}
              </h3>
              {editingUniId && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingUniId(null);
                    setNewUni({
                      name: '',
                      shortName: '',
                      city: '',
                      province: '',
                      officialWebsite: '',
                      admissionPortalUrl: '',
                      overview: '',
                      verificationStatus: 'Terverifikasi Resmi',
                      academicYear: '2025/2026',
                    });
                  }}
                  className="text-[11px] font-medium text-slate-600 hover:text-slate-900 underline"
                >
                  Batal Sunting
                </button>
              )}
            </div>
            <input
              type="text"
              required
              placeholder="Nama lengkap PTN/PTS *"
              value={newUni.name}
              onChange={(e) => setNewUni({ ...newUni, name: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg"
            />
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                required
                placeholder="Singkatan (mis. ITS) *"
                value={newUni.shortName}
                onChange={(e) => setNewUni({ ...newUni, shortName: e.target.value })}
                className="px-3 py-2 border border-slate-300 rounded-lg"
              />
              <input
                type="text"
                required
                placeholder="Kota *"
                value={newUni.city}
                onChange={(e) => setNewUni({ ...newUni, city: e.target.value })}
                className="px-3 py-2 border border-slate-300 rounded-lg"
              />
            </div>
            <input
              type="url"
              required
              placeholder="URL Portal Admisi Resmi (https://...) *"
              value={newUni.admissionPortalUrl}
              onChange={(e) => setNewUni({ ...newUni, admissionPortalUrl: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg"
            />
            <textarea
              rows={2}
              placeholder="Ringkasan profil kampus"
              value={newUni.overview}
              onChange={(e) => setNewUni({ ...newUni, overview: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg"
            />
            <select
              value={newUni.verificationStatus}
              onChange={(e) =>
                setNewUni({ ...newUni, verificationStatus: e.target.value as ProvenanceStatus })
              }
              className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
            >
              <option value="Terverifikasi Resmi">Terverifikasi Resmi</option>
              <option value="Sekunder">Sekunder</option>
              <option value="Perlu Konfirmasi">Perlu Konfirmasi</option>
            </select>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-4 py-2 font-medium text-white bg-indigo-700 hover:bg-indigo-800 rounded-lg"
            >
              {editingUniId ? <Save className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
              {editingUniId ? 'Simpan Perubahan PTN' : 'Simpan PTN'}
            </button>
          </form>

          <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl divide-y divide-slate-200 text-xs">
            {universities.map((u) => (
              <div key={u.id} className="p-4 flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="font-semibold text-slate-900">
                    {u.shortName} — {u.name} ({u.city})
                  </div>
                  <div className="text-slate-500">
                    {u.provenance.verificationStatus} · Tahun {u.provenance.academicYear} · Verifikasi{' '}
                    {u.provenance.lastVerified}
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <select
                    aria-label={`Status verifikasi ${u.shortName}`}
                    value={u.provenance.verificationStatus}
                    onChange={(e) =>
                      apiPatch(
                        'universities',
                        u.id,
                        {
                          provenance: {
                            ...u.provenance,
                            verificationStatus: e.target.value,
                            lastVerified: new Date().toISOString().slice(0, 10),
                          },
                        },
                        `Status verifikasi ${u.shortName} diperbarui.`
                      )
                    }
                    className="px-2 py-1 border border-slate-300 rounded bg-white text-[11px]"
                  >
                    <option value="Terverifikasi Resmi">Terverifikasi Resmi</option>
                    <option value="Sekunder">Sekunder</option>
                    <option value="Perlu Konfirmasi">Perlu Konfirmasi</option>
                  </select>
                  <button
                    type="button"
                    onClick={() => {
                      setEditingUniId(u.id);
                      setNewUni({
                        name: u.name,
                        shortName: u.shortName,
                        city: u.city,
                        province: u.province,
                        officialWebsite: u.officialWebsite,
                        admissionPortalUrl: u.admissionPortalUrl,
                        overview: u.overview,
                        verificationStatus: u.provenance.verificationStatus,
                        academicYear: u.provenance.academicYear,
                      });
                    }}
                    aria-label={`Sunting ${u.shortName}`}
                    className="p-1.5 text-slate-500 hover:text-indigo-700"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => apiDelete('universities', u.id, `${u.shortName} dihapus.`)}
                    aria-label={`Hapus ${u.shortName}`}
                    className="p-1.5 text-slate-400 hover:text-red-700"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* PROGRAMS */}
      {subTab === 'programs' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              const existingProg = editingProgramId
                ? programs.find((p) => p.id === editingProgramId)
                : null;
              const payload = {
                universityId: newProgram.universityId || universities[0]?.id,
                name: newProgram.name.trim(),
                degree: existingProg?.degree || 'S1',
                faculty: newProgram.faculty.trim() || 'Fakultas Terkait',
                disciplineCluster: newProgram.disciplineCluster,
                concentrations: newProgram.concentrations
                  .split(',')
                  .map((s) => s.trim())
                  .filter(Boolean),
                description: newProgram.description.trim(),
                curriculumFocus: existingProg?.curriculumFocus || ['Fondasi Konseptual', 'Proyek Terapan'],
                keyHighSchoolSubjects: newProgram.keyHighSchoolSubjects
                  .split(',')
                  .map((s) => s.trim())
                  .filter(Boolean),
                importantSupportingSubjects: newProgram.importantSupportingSubjects
                  .split(',')
                  .map((s) => s.trim())
                  .filter(Boolean),
                thinkingPatterns: existingProg?.thinkingPatterns || ['Analisis terstruktur'],
                studyEnvironment:
                  existingProg?.studyEnvironment || 'Kuliah teori, diskusi studi kasus, dan praktik.',
                admissionNotes:
                  newProgram.admissionNotes.trim() ||
                  'Periksa aturan mapel pendukung SNBP terbaru pada portal resmi PTN.',
                availableRoutes: newProgram.availableRoutes
                  .split(',')
                  .map((s) => s.trim())
                  .filter(Boolean),
                accreditation: newProgram.accreditation.trim() || 'Terakreditasi Resmi',
                tuitionInfo: newProgram.tuitionInfo.trim(),
                careerPathIds: existingProg?.careerPathIds || [],
                provenance: {
                  sourceTitle:
                    existingProg?.provenance.sourceTitle || 'Input Kurasi Administrator DYNAMAP',
                  officialUrl:
                    newProgram.officialUrl.trim() ||
                    existingProg?.provenance.officialUrl ||
                    'https://snpmb.bppp.kemdikbud.go.id',
                  institution:
                    universities.find((u) => u.id === newProgram.universityId)?.shortName || 'PTN',
                  academicYear: existingProg?.provenance.academicYear || '2025/2026',
                  lastVerified: new Date().toISOString().slice(0, 10),
                  verificationStatus: newProgram.verificationStatus,
                },
              };
              if (editingProgramId) {
                await apiPatch(
                  'programs',
                  editingProgramId,
                  payload,
                  `Program studi "${newProgram.name}" berhasil diperbarui.`
                );
                setEditingProgramId(null);
              } else {
                await apiCreate(
                  'programs',
                  payload,
                  `Program studi "${newProgram.name}" berhasil ditambahkan.`
                );
              }
              setNewProgram({
                ...newProgram,
                name: '',
                faculty: '',
                concentrations: '',
                description: '',
                admissionNotes: '',
                tuitionInfo: '',
                officialUrl: '',
              });
            }}
            className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-5 space-y-3 text-xs h-fit"
          >
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-sm font-display font-semibold text-slate-900">
                {editingProgramId ? 'Sunting Program Studi PTN' : 'Tambah Program Studi PTN'}
              </h3>
              {editingProgramId && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingProgramId(null);
                    setNewProgram({
                      ...newProgram,
                      name: '',
                      faculty: '',
                      concentrations: '',
                      description: '',
                      admissionNotes: '',
                      tuitionInfo: '',
                      officialUrl: '',
                    });
                  }}
                  className="text-[11px] font-medium text-slate-600 hover:text-slate-900 underline"
                >
                  Batal Sunting
                </button>
              )}
            </div>
            <select
              aria-label="Pilih PTN penyelenggara"
              value={newProgram.universityId}
              onChange={(e) => setNewProgram({ ...newProgram, universityId: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
            >
              {universities.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.shortName} — {u.name}
                </option>
              ))}
            </select>
            <select
              aria-label="Rumpun disiplin program studi"
              value={newProgram.disciplineCluster}
              onChange={(e) => setNewProgram({ ...newProgram, disciplineCluster: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
            >
              {configDraft.disciplineClusters.map((c) => (
                <option key={c} value={c}>
                  Rumpun: {c}
                </option>
              ))}
            </select>
            <input
              type="text"
              required
              placeholder="Nama Program Studi (mis. Psikologi) *"
              value={newProgram.name}
              onChange={(e) => setNewProgram({ ...newProgram, name: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg"
            />
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                placeholder="Fakultas / Sekolah"
                value={newProgram.faculty}
                onChange={(e) => setNewProgram({ ...newProgram, faculty: e.target.value })}
                className="px-3 py-2 border border-slate-300 rounded-lg"
              />
              <input
                type="text"
                placeholder="Akreditasi (mis. Unggul)"
                value={newProgram.accreditation}
                onChange={(e) => setNewProgram({ ...newProgram, accreditation: e.target.value })}
                className="px-3 py-2 border border-slate-300 rounded-lg"
              />
            </div>
            <input
              type="text"
              placeholder="Konsentrasi / Peminatan (pisahkan koma, opsional)"
              value={newProgram.concentrations}
              onChange={(e) => setNewProgram({ ...newProgram, concentrations: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg"
            />
            <input
              type="text"
              placeholder="Mapel SMA Utama (pisahkan koma)"
              value={newProgram.keyHighSchoolSubjects}
              onChange={(e) =>
                setNewProgram({ ...newProgram, keyHighSchoolSubjects: e.target.value })
              }
              className="w-full px-3 py-2 border border-slate-300 rounded-lg"
            />
            <input
              type="text"
              placeholder="Mapel Pendukung (pisahkan koma)"
              value={newProgram.importantSupportingSubjects}
              onChange={(e) =>
                setNewProgram({ ...newProgram, importantSupportingSubjects: e.target.value })
              }
              className="w-full px-3 py-2 border border-slate-300 rounded-lg"
            />
            <input
              type="text"
              placeholder="Jalur Admisi (mis. SNBP, SNBT, SIMAK UI)"
              value={newProgram.availableRoutes}
              onChange={(e) => setNewProgram({ ...newProgram, availableRoutes: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg"
            />
            <div className="grid grid-cols-2 gap-2">
              <input
                type="url"
                placeholder="URL Portal Resmi Prodi (https://...)"
                value={newProgram.officialUrl}
                onChange={(e) => setNewProgram({ ...newProgram, officialUrl: e.target.value })}
                className="px-3 py-2 border border-slate-300 rounded-lg"
              />
              <select
                aria-label="Status verifikasi program studi"
                value={newProgram.verificationStatus}
                onChange={(e) =>
                  setNewProgram({
                    ...newProgram,
                    verificationStatus: e.target.value as ProvenanceStatus,
                  })
                }
                className="px-3 py-2 border border-slate-300 rounded-lg bg-white"
              >
                <option value="Terverifikasi Resmi">Terverifikasi Resmi</option>
                <option value="Sekunder">Sekunder</option>
                <option value="Perlu Konfirmasi">Perlu Konfirmasi</option>
              </select>
            </div>
            <input
              type="text"
              placeholder="Catatan persyaratan / admisi prodi"
              value={newProgram.admissionNotes}
              onChange={(e) => setNewProgram({ ...newProgram, admissionNotes: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg"
            />
            <textarea
              rows={2}
              required
              placeholder="Deskripsi fokus program studi *"
              value={newProgram.description}
              onChange={(e) => setNewProgram({ ...newProgram, description: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg"
            />
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-4 py-2 font-medium text-white bg-indigo-700 hover:bg-indigo-800 rounded-lg"
            >
              {editingProgramId ? <Save className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
              {editingProgramId ? 'Simpan Perubahan Prodi' : 'Simpan Program Studi'}
            </button>
          </form>

          <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl divide-y divide-slate-200 text-xs max-h-[620px] overflow-y-auto">
            {programs.map((p) => {
              const uni = universities.find((u) => u.id === p.universityId);
              return (
                <div key={p.id} className="p-4 flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="font-semibold text-slate-900">
                      {uni?.shortName || p.universityId} · {p.degree} {p.name}
                    </div>
                    <div className="text-slate-500">
                      {p.disciplineCluster} · Mapel kunci: {p.keyHighSchoolSubjects.join(', ')} ·{' '}
                      {p.provenance.verificationStatus}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingProgramId(p.id);
                        setNewProgram({
                          universityId: p.universityId,
                          name: p.name,
                          faculty: p.faculty,
                          disciplineCluster: p.disciplineCluster,
                          concentrations: (p.concentrations || []).join(', '),
                          description: p.description,
                          keyHighSchoolSubjects: p.keyHighSchoolSubjects.join(', '),
                          importantSupportingSubjects: p.importantSupportingSubjects.join(', '),
                          availableRoutes: (p.availableRoutes || ['SNBP', 'SNBT', 'Seleksi Mandiri']).join(', '),
                          admissionNotes: p.admissionNotes,
                          accreditation: p.accreditation || 'Unggul (BAN-PT)',
                          tuitionInfo: p.tuitionInfo || '',
                          officialUrl: p.provenance.officialUrl,
                          verificationStatus: p.provenance.verificationStatus,
                        });
                      }}
                      aria-label={`Sunting ${p.name}`}
                      className="p-1.5 text-slate-500 hover:text-indigo-700"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => apiDelete('programs', p.id, `Prodi ${p.name} dihapus.`)}
                      aria-label={`Hapus ${p.name}`}
                      className="p-1.5 text-slate-400 hover:text-red-700"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* CAREERS */}
      {subTab === 'careers' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              const existingCar = editingCareerId
                ? careers.find((c) => c.id === editingCareerId)
                : null;
              const payload = {
                title: newCareer.title.trim(),
                cluster: newCareer.cluster,
                summary: newCareer.summary.trim(),
                dailyWorkAndProblemSolving:
                  existingCar?.dailyWorkAndProblemSolving || newCareer.summary.trim(),
                workEnvironment: newCareer.workEnvironment.trim() || 'Kolaborasi tim lintas fungsi',
                collaborationAndInteraction:
                  existingCar?.collaborationAndInteraction ||
                  'Komunikasi terstruktur dengan pemangku kepentingan.',
                relevantSubjects: newCareer.relevantSubjects
                  .split(',')
                  .map((s) => s.trim())
                  .filter(Boolean),
                relatedProgramIds: existingCar?.relatedProgramIds || [],
                coreSkills: existingCar?.coreSkills || [
                  'Pemecahan masalah analitis',
                  'Komunikasi profesional',
                ],
                workMotivations: existingCar?.workMotivations || ['Dampak nyata berkelanjutan'],
                entryPathways: existingCar?.entryPathways || ['Magang mahasiswa & proyek terapan'],
                educationPathway:
                  newCareer.educationPathway.trim() || 'S1 bidang terkait atau jalur lintas disiplin',
                certificationOrLicensing: newCareer.certificationOrLicensing.trim(),
                growthOpportunities: existingCar?.growthOpportunities || [
                  'Spesialis Senior hingga Manajer Bidang',
                ],
                commonMisconceptions: existingCar?.commonMisconceptions || [
                  'Tidak bergantung pada satu tipe kepribadian semata.',
                ],
                provenance: {
                  sourceTitle: existingCar?.provenance.sourceTitle || 'Kurasi Karier DYNAMAP',
                  officialUrl: existingCar?.provenance.officialUrl || 'https://skkni.kemnaker.go.id',
                  institution: existingCar?.provenance.institution || 'Administrator DYNAMAP',
                  academicYear: existingCar?.provenance.academicYear || '2025/2026',
                  lastVerified: new Date().toISOString().slice(0, 10),
                  verificationStatus: newCareer.verificationStatus,
                },
              };
              if (editingCareerId) {
                await apiPatch(
                  'careers',
                  editingCareerId,
                  payload,
                  `Karier "${newCareer.title}" berhasil diperbarui.`
                );
                setEditingCareerId(null);
              } else {
                await apiCreate('careers', payload, `Karier "${newCareer.title}" ditambahkan.`);
              }
              setNewCareer({
                ...newCareer,
                title: '',
                summary: '',
                workEnvironment: '',
                educationPathway: '',
                certificationOrLicensing: '',
              });
            }}
            className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-5 space-y-3 text-xs h-fit"
          >
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-sm font-display font-semibold text-slate-900">
                {editingCareerId ? 'Sunting Profesi & Karier' : 'Tambah Karier'}
              </h3>
              {editingCareerId && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingCareerId(null);
                    setNewCareer({
                      ...newCareer,
                      title: '',
                      summary: '',
                      workEnvironment: '',
                      educationPathway: '',
                      certificationOrLicensing: '',
                    });
                  }}
                  className="text-[11px] font-medium text-slate-600 hover:text-slate-900 underline"
                >
                  Batal Sunting
                </button>
              )}
            </div>
            <input
              type="text"
              required
              placeholder="Judul Profesi *"
              value={newCareer.title}
              onChange={(e) => setNewCareer({ ...newCareer, title: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg"
            />
            <div className="grid grid-cols-2 gap-2">
              <select
                aria-label="Klaster profesi karier"
                value={newCareer.cluster}
                onChange={(e) =>
                  setNewCareer({ ...newCareer, cluster: e.target.value as CareerDomainCluster })
                }
                className="px-3 py-2 border border-slate-300 rounded-lg bg-white"
              >
                {configDraft.disciplineClusters.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              <select
                aria-label="Status verifikasi karier"
                value={newCareer.verificationStatus}
                onChange={(e) =>
                  setNewCareer({
                    ...newCareer,
                    verificationStatus: e.target.value as ProvenanceStatus,
                  })
                }
                className="px-3 py-2 border border-slate-300 rounded-lg bg-white"
              >
                <option value="Terverifikasi Resmi">Terverifikasi Resmi</option>
                <option value="Sekunder">Sekunder</option>
                <option value="Perlu Konfirmasi">Perlu Konfirmasi</option>
              </select>
            </div>
            <input
              type="text"
              placeholder="Jalur Pendidikan (mis. S1 Hukum / Lintas Disiplin)"
              value={newCareer.educationPathway}
              onChange={(e) => setNewCareer({ ...newCareer, educationPathway: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg"
            />
            <input
              type="text"
              placeholder="Lingkungan Kerja (mis. Kantor, Lab, Lapangan)"
              value={newCareer.workEnvironment}
              onChange={(e) => setNewCareer({ ...newCareer, workEnvironment: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg"
            />
            <input
              type="text"
              placeholder="Sertifikasi / Lisensi Profesi (jika ada)"
              value={newCareer.certificationOrLicensing}
              onChange={(e) =>
                setNewCareer({ ...newCareer, certificationOrLicensing: e.target.value })
              }
              className="w-full px-3 py-2 border border-slate-300 rounded-lg"
            />
            <textarea
              rows={2}
              required
              placeholder="Ringkasan pekerjaan harian & pemecahan masalah *"
              value={newCareer.summary}
              onChange={(e) => setNewCareer({ ...newCareer, summary: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg"
            />
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-4 py-2 font-medium text-white bg-indigo-700 hover:bg-indigo-800 rounded-lg"
            >
              {editingCareerId ? <Save className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
              {editingCareerId ? 'Simpan Perubahan Karier' : 'Simpan Karier'}
            </button>
          </form>

          <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl divide-y divide-slate-200 text-xs max-h-[540px] overflow-y-auto">
            {careers.map((c) => (
              <div key={c.id} className="p-4 flex items-start justify-between gap-3">
                <div>
                  <div className="font-semibold text-slate-900">{c.title}</div>
                  <div className="text-slate-500 mt-0.5">
                    {c.cluster} · {c.provenance.verificationStatus}
                  </div>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingCareerId(c.id);
                      setNewCareer({
                        title: c.title,
                        cluster: c.cluster,
                        summary: c.summary,
                        workEnvironment: c.workEnvironment,
                        educationPathway: c.educationPathway || c.entryPathways.join(', '),
                        certificationOrLicensing: c.certificationOrLicensing || '',
                        relevantSubjects: c.relevantSubjects.join(', '),
                        verificationStatus: c.provenance.verificationStatus,
                      });
                    }}
                    aria-label={`Sunting ${c.title}`}
                    className="p-1.5 text-slate-500 hover:text-indigo-700"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => apiDelete('careers', c.id, `Karier ${c.title} dihapus.`)}
                    aria-label={`Hapus ${c.title}`}
                    className="p-1.5 text-slate-400 hover:text-red-700"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUBJECTS */}
      {subTab === 'subjects' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              const payload = {
                name: newSubject.name.trim(),
                shortCode: newSubject.shortCode.trim().toUpperCase() || 'MAPEL',
                category: newSubject.category,
                specializationPack: newSubject.specializationPack.trim() || 'Umum SMA',
                coreTopics: newSubject.coreTopics
                  .split(',')
                  .map((s) => s.trim())
                  .filter(Boolean),
                academicSkills: ['Penalaran konseptual'],
                description: newSubject.description.trim(),
              };
              if (editingSubjectId) {
                await apiPatch(
                  'subjectTemplates',
                  editingSubjectId,
                  payload,
                  `Templat mata pelajaran "${newSubject.name}" diperbarui.`
                );
                setEditingSubjectId(null);
              } else {
                await apiCreate(
                  'subjectTemplates',
                  payload,
                  `Templat mata pelajaran "${newSubject.name}" ditambahkan.`
                );
              }
              setNewSubject({ ...newSubject, name: '', shortCode: '', coreTopics: '', description: '' });
            }}
            className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-5 space-y-3 text-xs h-fit"
          >
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-sm font-display font-semibold text-slate-900">
                {editingSubjectId ? 'Sunting Mata Pelajaran SMA' : 'Tambah Templat Mata Pelajaran SMA'}
              </h3>
              {editingSubjectId && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingSubjectId(null);
                    setNewSubject({
                      ...newSubject,
                      name: '',
                      shortCode: '',
                      coreTopics: '',
                      description: '',
                    });
                  }}
                  className="text-[11px] font-medium text-slate-600 hover:text-slate-900 underline"
                >
                  Batal Sunting
                </button>
              )}
            </div>
            <input
              type="text"
              required
              placeholder="Nama Mata Pelajaran *"
              value={newSubject.name}
              onChange={(e) => setNewSubject({ ...newSubject, name: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg"
            />
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                placeholder="Kode (mis. BIO)"
                value={newSubject.shortCode}
                onChange={(e) => setNewSubject({ ...newSubject, shortCode: e.target.value })}
                className="px-3 py-2 border border-slate-300 rounded-lg"
              />
              <input
                type="text"
                placeholder="Paket (mis. FISKIM MATONOMI)"
                value={newSubject.specializationPack}
                onChange={(e) => setNewSubject({ ...newSubject, specializationPack: e.target.value })}
                className="px-3 py-2 border border-slate-300 rounded-lg"
              />
            </div>
            <input
              type="text"
              placeholder="Topik Inti (pisahkan koma)"
              value={newSubject.coreTopics}
              onChange={(e) => setNewSubject({ ...newSubject, coreTopics: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg"
            />
            <textarea
              rows={2}
              placeholder="Deskripsi singkat"
              value={newSubject.description}
              onChange={(e) => setNewSubject({ ...newSubject, description: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg"
            />
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-4 py-2 font-medium text-white bg-indigo-700 hover:bg-indigo-800 rounded-lg"
            >
              {editingSubjectId ? <Save className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
              {editingSubjectId ? 'Simpan Perubahan Mapel' : 'Simpan Mata Pelajaran'}
            </button>
          </form>

          <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl divide-y divide-slate-200 text-xs max-h-[540px] overflow-y-auto">
            {subjectTemplates.map((s) => (
              <div key={s.id} className="p-4 flex items-start justify-between gap-3">
                <div>
                  <div className="font-semibold text-slate-900">
                    {s.shortCode} — {s.name}
                  </div>
                  <div className="text-slate-500 mt-0.5">
                    {s.specializationPack} · {s.category}
                  </div>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingSubjectId(s.id);
                      setNewSubject({
                        name: s.name,
                        shortCode: s.shortCode,
                        category: s.category,
                        specializationPack: s.specializationPack,
                        coreTopics: s.coreTopics.join(', '),
                        description: s.description,
                      });
                    }}
                    aria-label={`Sunting ${s.name}`}
                    className="p-1.5 text-slate-500 hover:text-indigo-700"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => apiDelete('subjectTemplates', s.id, `${s.name} dihapus.`)}
                    aria-label={`Hapus ${s.name}`}
                    className="p-1.5 text-slate-400 hover:text-red-700"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CONCEPTS */}
      {subTab === 'concepts' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              const existingCon = editingConceptId
                ? concepts.find((c) => c.id === editingConceptId)
                : null;
              const payload = {
                shortCode: newConcept.shortCode.trim(),
                label: newConcept.label.trim(),
                framework: newConcept.framework,
                subGroup: newConcept.subGroup,
                summary: newConcept.summary.trim(),
                definition: newConcept.definition.trim() || newConcept.summary.trim(),
                keyMechanism:
                  newConcept.keyMechanism.trim() || existingCon?.keyMechanism || 'Mekanisme konseptual.',
                misconception:
                  newConcept.misconception.trim() ||
                  existingCon?.misconception ||
                  'Perlu verifikasi konteks.',
                targetModule: existingCon?.targetModule || 'analisis-kepribadian',
                x: existingCon?.x ?? 480,
                y: existingCon?.y ?? 300,
              };
              if (editingConceptId) {
                await apiPatch(
                  'concepts',
                  editingConceptId,
                  payload,
                  `Simpul konsep "${newConcept.shortCode}" diperbarui.`
                );
                setEditingConceptId(null);
              } else {
                await apiCreate(
                  'concepts',
                  payload,
                  `Simpul konsep "${newConcept.shortCode}" ditambahkan.`
                );
              }
              setNewConcept({ ...newConcept, shortCode: '', label: '', summary: '', definition: '' });
            }}
            className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-5 space-y-3 text-xs h-fit"
          >
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-sm font-display font-semibold text-slate-900">
                {editingConceptId ? 'Sunting Simpul Konsep Peta Teori' : 'Tambah Simpul Konsep Peta Teori'}
              </h3>
              {editingConceptId && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingConceptId(null);
                    setNewConcept({
                      ...newConcept,
                      shortCode: '',
                      label: '',
                      summary: '',
                      definition: '',
                    });
                  }}
                  className="text-[11px] font-medium text-slate-600 hover:text-slate-900 underline"
                >
                  Batal Sunting
                </button>
              )}
            </div>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                required
                placeholder="Kode Singkat (mis. 4E) *"
                value={newConcept.shortCode}
                onChange={(e) => setNewConcept({ ...newConcept, shortCode: e.target.value })}
                className="px-3 py-2 border border-slate-300 rounded-lg"
              />
              <select
                value={newConcept.framework}
                onChange={(e) =>
                  setNewConcept({ ...newConcept, framework: e.target.value as ConceptNode['framework'] })
                }
                className="px-3 py-2 border border-slate-300 rounded-lg bg-white"
              >
                <option value="Socionics">Socionics</option>
                <option value="Psikosofi">Psikosofi</option>
                <option value="Enneagram">Enneagram</option>
                <option value="Tipologi Jung">Tipologi Jung</option>
                <option value="Lintas Kerangka">Lintas Kerangka</option>
              </select>
            </div>
            <input
              type="text"
              required
              placeholder="Nama Lengkap Konsep *"
              value={newConcept.label}
              onChange={(e) => setNewConcept({ ...newConcept, label: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg"
            />
            <textarea
              rows={2}
              required
              placeholder="Ringkasan definisi *"
              value={newConcept.summary}
              onChange={(e) => setNewConcept({ ...newConcept, summary: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg"
            />
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-4 py-2 font-medium text-white bg-indigo-700 hover:bg-indigo-800 rounded-lg"
            >
              {editingConceptId ? <Save className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
              {editingConceptId ? 'Simpan Perubahan Konsep' : 'Simpan Simpul Konsep'}
            </button>
          </form>

          <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl divide-y divide-slate-200 text-xs max-h-[540px] overflow-y-auto">
            {concepts.map((c) => (
              <div key={c.id} className="p-4 flex items-start justify-between gap-3">
                <div>
                  <div className="font-semibold text-slate-900">
                    {c.shortCode} — {c.label}
                  </div>
                  <div className="text-slate-500 mt-0.5">
                    {c.framework} · {c.subGroup}
                  </div>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingConceptId(c.id);
                      setNewConcept({
                        shortCode: c.shortCode,
                        label: c.label,
                        framework: c.framework,
                        subGroup: c.subGroup,
                        summary: c.summary,
                        definition: c.definition,
                        keyMechanism: c.keyMechanism,
                        misconception: c.misconception,
                      });
                    }}
                    aria-label={`Sunting ${c.shortCode}`}
                    className="p-1.5 text-slate-500 hover:text-indigo-700"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => apiDelete('concepts', c.id, `Konsep ${c.shortCode} dihapus.`)}
                    aria-label={`Hapus ${c.shortCode}`}
                    className="p-1.5 text-slate-400 hover:text-red-700"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* EXPLORATION TAXONOMY & OPTIONS CONFIG (SECTION 14) */}
      {subTab === 'config' && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-6 text-xs">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-4">
            <div>
              <h3 className="text-base font-display font-bold text-slate-900">
                Taksonomi Rumpun Ilmu &amp; Opsi Pertanyaan Eksplorasi
              </h3>
              <p className="text-slate-600 mt-0.5">
                Administrator dapat menambah atau menyusun kategori rumpun ilmu, kategori minat akademik, preferensi kognitif, motivasi, serta pertanyaan refleksi siswa secara fleksibel.
              </p>
            </div>
            <button
              type="button"
              onClick={() =>
                saveExplorationConfig(configDraft, 'Konfigurasi eksplorasi dan taksonomi berhasil disimpan.')
              }
              className="inline-flex items-center gap-1.5 px-4 py-2 font-medium text-white bg-indigo-700 hover:bg-indigo-800 rounded-lg"
            >
              <Save className="w-3.5 h-3.5" />
              Simpan Konfigurasi
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {(
              [
                {
                  key: 'disciplineClusters' as const,
                  title: 'Taksonomi Rumpun Disiplin Ilmu PTN & Karier',
                  input: newClusterInput,
                  setInput: setNewClusterInput,
                  placeholder: 'Tambah rumpun baru (mis. Kebijakan Publik & Maritim)...',
                },
                {
                  key: 'academicInterestCategories' as const,
                  title: 'Kategori Topik Minat Akademik (Langkah 2)',
                  input: newInterestInput,
                  setInput: setNewInterestInput,
                  placeholder: 'Tambah topik minat baru...',
                },
                {
                  key: 'cognitivePreferenceOptions' as const,
                  title: 'Opsi Aktivitas Kognitif (Langkah 3)',
                  input: newCognitiveInput,
                  setInput: setNewCognitiveInput,
                  placeholder: 'Tambah opsi aktivitas kognitif...',
                },
                {
                  key: 'learningPreferenceOptions' as const,
                  title: 'Opsi Preferensi Belajar (Langkah 3)',
                  input: newLearningInput,
                  setInput: setNewLearningInput,
                  placeholder: 'Tambah opsi gaya belajar...',
                },
                {
                  key: 'motivationOptions' as const,
                  title: 'Opsi Motivasi & Nilai Pribadi (Langkah 3)',
                  input: newMotivationInput,
                  setInput: setNewMotivationInput,
                  placeholder: 'Tambah motivasi baru...',
                },
                {
                  key: 'activityOptions' as const,
                  title: 'Opsi Aktivitas Bermakna & Pengalaman (Langkah 4)',
                  input: newActivityInput,
                  setInput: setNewActivityInput,
                  placeholder: 'Tambah aktivitas bermakna baru...',
                },
                {
                  key: 'reflectionPrompts' as const,
                  title: 'Pertanyaan Refleksi Halaman Hasil (Bagian I)',
                  input: newPromptInput,
                  setInput: setNewPromptInput,
                  placeholder: 'Tambah pertanyaan refleksi baru...',
                },
              ] as const
            ).map((section) => (
              <div key={section.key} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="font-semibold text-slate-900">
                  {section.title} ({configDraft[section.key].length})
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder={section.placeholder}
                    value={section.input}
                    onChange={(e) => section.setInput(e.target.value)}
                    className="flex-1 px-2.5 py-1.5 border border-slate-300 rounded-lg bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const val = section.input.trim();
                      if (!val) return;
                      const next = {
                        ...configDraft,
                        [section.key]: [...configDraft[section.key], val],
                      };
                      section.setInput('');
                      saveExplorationConfig(next, `Entri "${val}" ditambahkan ke konfigurasi.`);
                    }}
                    className="px-3 py-1.5 font-medium text-white bg-indigo-700 hover:bg-indigo-800 rounded-lg"
                  >
                    Tambah
                  </button>
                </div>
                <div className="space-y-1 max-h-48 overflow-y-auto">
                  {configDraft[section.key].map((item, idx) => (
                    <div
                      key={`${section.key}-${idx}`}
                      className="flex items-center justify-between gap-2 bg-white px-2.5 py-1.5 rounded border border-slate-200"
                    >
                      <span className="text-slate-800">{item}</span>
                      <button
                        type="button"
                        onClick={() => {
                          const next = {
                            ...configDraft,
                            [section.key]: configDraft[section.key].filter((_, i) => i !== idx),
                          };
                          saveExplorationConfig(next, 'Entri konfigurasi dihapus.');
                        }}
                        aria-label={`Hapus ${item}`}
                        className="text-slate-400 hover:text-red-700 shrink-0"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
