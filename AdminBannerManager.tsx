import React, { useState } from 'react';
import {
  ArrowDown,
  ArrowUp,
  Eye,
  Image as ImageIcon,
  Monitor,
  Plus,
  RotateCcw,
  Save,
  Send,
  Smartphone,
  Trash2,
  Upload,
} from 'lucide-react';
import type {
  BannerButtonVariant,
  BannerHeightPreset,
  BannerImageFit,
  BannerImageFocus,
  BannerOverlayIntensity,
  BannerRadiusPreset,
  BannerTextAlignment,
  BannerTextPosition,
  HomepageBannerPayload,
  HomepageBannerSlide,
  HomepageBannerState,
} from '../types/dynamap';
import { HomepageBanner } from './HomepageBanner';

interface AdminBannerManagerProps {
  bannerConfig: HomepageBannerState;
  onUpdated: (nextConfig: HomepageBannerState, msg: string) => void;
}

const DESTINATION_OPTIONS = [
  { value: 'analisis-kepribadian', label: 'Modul Analisis Kepribadian' },
  { value: 'psikosofi', label: 'Modul Psikosofi (L·V·E·F)' },
  { value: 'eksplorasi-diri', label: 'Modul Eksplorasi Diri & Peta Pribadi' },
  { value: 'peta-konsep', label: 'Modul Perbandingan & Peta Konsep' },
  { value: 'pendidikan-karier', label: 'Modul Pendidikan Tinggi & Karier' },
  { value: 'perbandingan-interpersonal', label: 'Modul Perbandingan Interpersonal' },
  { value: 'analisis-kasus', label: 'Modul Analisis Kasus' },
  { value: 'pembelajaran-akademik', label: 'Modul Pembelajaran & Akademik' },
  { value: 'galeri-profil', label: 'Galeri Profil Kelas' },
];

export const AdminBannerManager: React.FC<AdminBannerManagerProps> = ({
  bannerConfig,
  onUpdated,
}) => {
  const [draft, setDraft] = useState<HomepageBannerPayload>(() =>
    JSON.parse(JSON.stringify(bannerConfig.draft || bannerConfig.published))
  );
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop');
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [confirmResetOpen, setConfirmResetOpen] = useState(false);

  const safeIdx = activeSlideIndex < draft.slides.length ? activeSlideIndex : 0;
  const activeSlide = draft.slides[safeIdx] || draft.slides[0];

  const hasUnpublishedChanges =
    JSON.stringify({ slides: draft.slides, display: draft.display }) !==
    JSON.stringify({
      slides: bannerConfig.published.slides,
      display: bannerConfig.published.display,
    });

  function updateSlide(patch: Partial<HomepageBannerSlide>) {
    setDraft((prev) => ({
      ...prev,
      slides: prev.slides.map((s, idx) => (idx === safeIdx ? { ...s, ...patch } : s)),
    }));
  }

  function updateDisplay(patch: Partial<HomepageBannerPayload['display']>) {
    setDraft((prev) => ({
      ...prev,
      display: { ...prev.display, ...patch },
    }));
  }

  function handleAddSlide() {
    const newSlide: HomepageBannerSlide = {
      ...activeSlide,
      id: `slide-${Date.now()}`,
      badgeText: 'Sorotan Baru DYNAMAP',
      heading: `Slide ${draft.slides.length + 1} — Eksplorasi Potensi & Komunikasi`,
      subtitle: 'Tambahkan ringkasan pesan edukatif untuk pengunjung beranda.',
    };
    setDraft((prev) => ({ ...prev, slides: [...prev.slides, newSlide] }));
    setActiveSlideIndex(draft.slides.length);
  }

  function handleRemoveSlide(idx: number) {
    if (draft.slides.length <= 1) return;
    setDraft((prev) => ({
      ...prev,
      slides: prev.slides.filter((_, i) => i !== idx),
    }));
    setActiveSlideIndex(Math.max(0, idx - 1));
  }

  function handleMoveSlide(idx: number, dir: -1 | 1) {
    const nextIdx = idx + dir;
    if (nextIdx < 0 || nextIdx >= draft.slides.length) return;
    setDraft((prev) => {
      const copy = [...prev.slides];
      const [item] = copy.splice(idx, 1);
      copy.splice(nextIdx, 0, item);
      return { ...prev, slides: copy };
    });
    setActiveSlideIndex(nextIdx);
  }

  async function handleImageFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setErrorMsg('');

    const allowed = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
    if (!allowed.includes(file.type)) {
      setErrorMsg('Format berkas tidak didukung. Gunakan JPG, JPEG, PNG, atau WEBP.');
      return;
    }
    if (file.size > 4 * 1024 * 1024) {
      setErrorMsg('Ukuran gambar melebihi batas 4 MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = async () => {
      try {
        setSaving(true);
        const token = localStorage.getItem('dynamap_token');
        const res = await fetch('/api/admin/banner/upload', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({ dataUrl: reader.result }),
        });
        const data = await res.json();
        if (!res.ok) {
          setErrorMsg(data.error || 'Gagal mengunggah gambar spanduk.');
          return;
        }
        updateSlide({ imageUrl: data.url });
        onUpdated(
          { ...bannerConfig, uploadedAssets: data.uploadedAssets },
          'Gambar spanduk berhasil diunggah ke pustaka aset.'
        );
      } catch {
        setErrorMsg('Kesalahan jaringan saat mengunggah gambar.');
      } finally {
        setSaving(false);
      }
    };
    reader.readAsDataURL(file);
  }

  async function handleDeleteAsset(filename: string) {
    const token = localStorage.getItem('dynamap_token');
    const res = await fetch(`/api/admin/banner/asset/${encodeURIComponent(filename)}`, {
      method: 'DELETE',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    const data = await res.json();
    if (res.ok) {
      onUpdated(
        { ...bannerConfig, uploadedAssets: data.uploadedAssets },
        `Aset ${filename} dihapus.`
      );
    }
  }

  async function submitBanner(action: 'save_draft' | 'publish') {
    setSaving(true);
    setErrorMsg('');
    try {
      const token = localStorage.getItem('dynamap_token');
      const res = await fetch('/api/admin/banner', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ action, payload: draft }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error || 'Gagal menyimpan konfigurasi spanduk.');
        return;
      }
      setDraft(JSON.parse(JSON.stringify(data.bannerConfig.draft)));
      onUpdated(
        data.bannerConfig,
        action === 'publish'
          ? 'Spanduk beranda berhasil dipublikasikan ke halaman utama publik.'
          : 'Perubahan spanduk disimpan sebagai Draf (belum dipublikasikan).'
      );
    } catch {
      setErrorMsg('Gagal menghubungi server.');
    } finally {
      setSaving(false);
    }
  }

  async function handleResetDefault(publishImmediately: boolean) {
    setSaving(true);
    setErrorMsg('');
    try {
      const token = localStorage.getItem('dynamap_token');
      const res = await fetch('/api/admin/banner/reset', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ publishImmediately }),
      });
      const data = await res.json();
      if (res.ok) {
        setDraft(JSON.parse(JSON.stringify(data.bannerConfig.draft)));
        setActiveSlideIndex(0);
        setConfirmResetOpen(false);
        onUpdated(
          data.bannerConfig,
          publishImmediately
            ? 'Spanduk dikembalikan ke pengaturan bawaan dan dipublikasikan.'
            : 'Draf spanduk dikembalikan ke pengaturan bawaan.'
        );
      }
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Workflow Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h2 className="text-xl font-display font-bold text-slate-900">
            Studio Pengaturan Spanduk Beranda
          </h2>
          <p className="text-xs text-slate-600 mt-1">
            Unggah gambar baru, atur tata letak tunggal atau multi-slide, tinjau pratinjau desktop &amp; seluler, lalu simpan draf atau publikasikan.
          </p>
          <p className="text-[11px] text-slate-500 mt-1.5">
            Status saat ini:{' '}
            <strong className={hasUnpublishedChanges ? 'text-amber-700' : 'text-emerald-700'}>
              {hasUnpublishedChanges
                ? 'Ada perubahan Draf yang belum dipublikasikan'
                : 'Seluruh perubahan sudah dipublikasikan'}
            </strong>{' '}
            · Terakhir diperbarui oleh {bannerConfig.published.updatedBy}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            disabled={saving}
            onClick={() => setConfirmResetOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg whitespace-nowrap"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Atur Ulang Bawaan
          </button>
          <button
            type="button"
            disabled={saving}
            onClick={() => submitBanner('save_draft')}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-indigo-800 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-lg whitespace-nowrap"
          >
            <Save className="w-3.5 h-3.5" />
            Simpan Draf
          </button>
          <button
            type="button"
            disabled={saving}
            onClick={() => submitBanner('publish')}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-white bg-indigo-700 hover:bg-indigo-800 rounded-lg whitespace-nowrap"
          >
            <Send className="w-3.5 h-3.5" />
            Publikasikan ke Beranda
          </button>
        </div>
      </div>

      {errorMsg && (
        <div className="p-3.5 rounded-lg bg-red-50 border border-red-200 text-xs text-red-900">
          {errorMsg}
        </div>
      )}

      {/* Live Preview Panel */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-sm font-display font-semibold text-slate-900">
            <Eye className="w-4 h-4 text-indigo-700" />
            Pratinjau Langsung Draf Spanduk
          </div>
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
            <button
              type="button"
              onClick={() => setPreviewDevice('desktop')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md ${
                previewDevice === 'desktop' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'
              }`}
            >
              <Monitor className="w-3.5 h-3.5" />
              Desktop
            </button>
            <button
              type="button"
              onClick={() => setPreviewDevice('mobile')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md ${
                previewDevice === 'mobile' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              Seluler
            </button>
          </div>
        </div>

        <div
          className={`mx-auto transition-all border border-dashed border-slate-300 rounded-xl p-3 bg-slate-50 ${
            previewDevice === 'mobile' ? 'max-w-[390px]' : 'w-full'
          }`}
        >
          {draft.display.enabled ? (
            <HomepageBanner banner={draft} previewDevice={previewDevice} />
          ) : (
            <div className="py-10 text-center text-xs text-slate-500">
              Spanduk sedang dinonaktifkan. Beranda publik akan langsung menampilkan bagian tujuan &amp; komposisi kelas secara rapi.
            </div>
          )}
        </div>
      </div>

      {/* Display & Slide Controls Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Global Display Settings + Slide Manager */}
        <div className="lg:col-span-4 space-y-5">
          <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4 text-xs">
            <h3 className="text-sm font-display font-semibold text-slate-900">
              Pengaturan Tampilan Global
            </h3>

            <label className="flex items-center justify-between gap-2 cursor-pointer py-1">
              <span className="font-medium text-slate-700">Tampilkan Spanduk di Beranda</span>
              <input
                type="checkbox"
                checked={draft.display.enabled}
                onChange={(e) => updateDisplay({ enabled: e.target.checked })}
              />
            </label>

            <div>
              <label className="block font-medium text-slate-700 mb-1">Mode Tampilan</label>
              <select
                value={draft.display.mode}
                onChange={(e) =>
                  updateDisplay({ mode: e.target.value as 'single' | 'carousel' })
                }
                className="w-full px-2.5 py-2 border border-slate-300 rounded-lg bg-white"
              >
                <option value="single">Spanduk Statis Tunggal</option>
                <option value="carousel">Karosel Multi-Slide</option>
              </select>
            </div>

            {draft.display.mode === 'carousel' && (
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-2.5">
                <label className="flex items-center justify-between gap-2 cursor-pointer">
                  <span>Putar Otomatis</span>
                  <input
                    type="checkbox"
                    checked={draft.display.autoAdvance}
                    onChange={(e) => updateDisplay({ autoAdvance: e.target.checked })}
                  />
                </label>
                {draft.display.autoAdvance && (
                  <div>
                    <label className="block text-[11px] text-slate-600 mb-1">
                      Durasi Ganti Slide (detik)
                    </label>
                    <input
                      type="number"
                      min={3}
                      max={20}
                      value={draft.display.autoAdvanceSeconds}
                      onChange={(e) =>
                        updateDisplay({ autoAdvanceSeconds: Number(e.target.value) || 6 })
                      }
                      className="w-full px-2.5 py-1.5 border border-slate-300 rounded-md bg-white"
                    />
                  </div>
                )}
                <label className="flex items-center justify-between gap-2 cursor-pointer">
                  <span>Tampilkan Panah Navigasi</span>
                  <input
                    type="checkbox"
                    checked={draft.display.showArrows}
                    onChange={(e) => updateDisplay({ showArrows: e.target.checked })}
                  />
                </label>
                <label className="flex items-center justify-between gap-2 cursor-pointer">
                  <span>Tampilkan Indikator Slide</span>
                  <input
                    type="checkbox"
                    checked={draft.display.showIndicators}
                    onChange={(e) => updateDisplay({ showIndicators: e.target.checked })}
                  />
                </label>
              </div>
            )}

            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="block font-medium text-slate-700 mb-1">Tinggi Spanduk</label>
                <select
                  value={draft.display.heightPreset}
                  onChange={(e) =>
                    updateDisplay({ heightPreset: e.target.value as BannerHeightPreset })
                  }
                  className="w-full px-2 py-2 border border-slate-300 rounded-lg bg-white"
                >
                  <option value="compact">Ringkas</option>
                  <option value="standard">Standar</option>
                  <option value="tall">Tinggi</option>
                </select>
              </div>
              <div>
                <label className="block font-medium text-slate-700 mb-1">Tata Letak Teks</label>
                <select
                  value={draft.display.textPosition}
                  onChange={(e) =>
                    updateDisplay({ textPosition: e.target.value as BannerTextPosition })
                  }
                  className="w-full px-2 py-2 border border-slate-300 rounded-lg bg-white"
                >
                  <option value="split-left">Belah Kiri-Kanan</option>
                  <option value="top-banner">Bertumpuk Atas-Bawah</option>
                  <option value="overlay-bottom">Tumpuk Gambar (Bawah)</option>
                  <option value="overlay-center">Tumpuk Gambar (Tengah)</option>
                </select>
              </div>
              <div>
                <label className="block font-medium text-slate-700 mb-1">Gaya Tombol</label>
                <select
                  value={draft.display.buttonVariant}
                  onChange={(e) =>
                    updateDisplay({ buttonVariant: e.target.value as BannerButtonVariant })
                  }
                  className="w-full px-2 py-2 border border-slate-300 rounded-lg bg-white"
                >
                  <option value="solid">Solid Penuh</option>
                  <option value="outline">Garis Tepi</option>
                  <option value="soft">Lembut</option>
                </select>
              </div>
              <div>
                <label className="block font-medium text-slate-700 mb-1">Kelengkungan Sudut</label>
                <select
                  value={draft.display.borderRadius}
                  onChange={(e) =>
                    updateDisplay({ borderRadius: e.target.value as BannerRadiusPreset })
                  }
                  className="w-full px-2 py-2 border border-slate-300 rounded-lg bg-white"
                >
                  <option value="none">Tajam (0px)</option>
                  <option value="md">Sedang</option>
                  <option value="xl">Standar</option>
                  <option value="2xl">Membulat Lebar</option>
                </select>
              </div>
            </div>
          </div>

          {/* Slide List */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-3 text-xs">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-display font-semibold text-slate-900">
                Daftar Slide ({draft.slides.length})
              </h3>
              <button
                type="button"
                onClick={handleAddSlide}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-md font-medium"
              >
                <Plus className="w-3.5 h-3.5" />
                Tambah Slide
              </button>
            </div>

            <div className="space-y-2">
              {draft.slides.map((sl, idx) => (
                <div
                  key={sl.id}
                  className={`p-2.5 rounded-lg border flex items-center justify-between gap-2 ${
                    idx === safeIdx
                      ? 'bg-indigo-50 border-indigo-300'
                      : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setActiveSlideIndex(idx)}
                    className="text-left flex-1 min-w-0"
                  >
                    <div className="font-semibold text-slate-900 truncate">
                      {idx + 1}. {sl.heading || 'Slide tanpa judul'}
                    </div>
                  </button>
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => handleMoveSlide(idx, -1)}
                      aria-label={`Geser slide ${idx + 1} ke atas`}
                      className="p-1 text-slate-500 hover:text-slate-900 disabled:opacity-30"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      disabled={idx === draft.slides.length - 1}
                      onClick={() => handleMoveSlide(idx, 1)}
                      aria-label={`Geser slide ${idx + 1} ke bawah`}
                      className="p-1 text-slate-500 hover:text-slate-900 disabled:opacity-30"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                    {draft.slides.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveSlide(idx)}
                        aria-label={`Hapus slide ${idx + 1}`}
                        className="p-1 text-slate-400 hover:text-red-700"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Active Slide Content & Image Editor */}
        <div className="lg:col-span-8 bg-white border border-slate-200 rounded-xl p-6 space-y-5 text-xs">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <h3 className="text-base font-display font-semibold text-slate-900">
              Sunting Konten &amp; Visual — Slide {safeIdx + 1}
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block font-medium text-slate-700 mb-1">
                Label / Keterangan Atas (Opsional)
              </label>
              <input
                type="text"
                value={activeSlide.badgeText}
                onChange={(e) => updateSlide({ badgeText: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-medium text-slate-700 mb-1">
                Judul Utama Spanduk *
              </label>
              <input
                type="text"
                value={activeSlide.heading}
                onChange={(e) => updateSlide({ heading: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-semibold"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-medium text-slate-700 mb-1">
                Subjudul / Deskripsi Singkat
              </label>
              <textarea
                rows={3}
                value={activeSlide.subtitle}
                onChange={(e) => updateSlide({ subtitle: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
              />
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">
                Teks Tombol Utama
              </label>
              <input
                type="text"
                value={activeSlide.primaryButtonText}
                onChange={(e) => updateSlide({ primaryButtonText: e.target.value })}
                placeholder="Kosongkan untuk menyembunyikan tombol"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="block font-medium text-slate-700 mb-1">
                Tujuan Tombol Utama (Modul atau URL https://)
              </label>
              <select
                value={
                  DESTINATION_OPTIONS.some((d) => d.value === activeSlide.primaryButtonTarget)
                    ? activeSlide.primaryButtonTarget
                    : '__custom__'
                }
                onChange={(e) => {
                  if (e.target.value !== '__custom__') {
                    updateSlide({ primaryButtonTarget: e.target.value });
                  }
                }}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white text-sm mb-1.5"
              >
                {DESTINATION_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
                <option value="__custom__">Tautan Kustom / URL Eksternal</option>
              </select>
              <input
                type="text"
                value={activeSlide.primaryButtonTarget}
                onChange={(e) => updateSlide({ primaryButtonTarget: e.target.value })}
                placeholder="ID modul atau https://..."
                className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs font-mono"
              />
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">
                Teks Tombol Sekunder (Opsional)
              </label>
              <input
                type="text"
                value={activeSlide.secondaryButtonText}
                onChange={(e) => updateSlide({ secondaryButtonText: e.target.value })}
                placeholder="Kosongkan jika tidak perlu"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="block font-medium text-slate-700 mb-1">
                Tujuan Tombol Sekunder
              </label>
              <select
                value={activeSlide.secondaryButtonTarget}
                onChange={(e) => updateSlide({ secondaryButtonTarget: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white text-sm"
              >
                <option value="">Tidak ada</option>
                {DESTINATION_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Image Upload & Asset Library */}
          <div className="pt-4 border-t border-slate-200 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="font-semibold text-slate-900 text-sm flex items-center gap-1.5">
                <ImageIcon className="w-4 h-4 text-indigo-700" />
                Gambar Spanduk (JPG, PNG, WEBP · Maks 4 MB)
              </div>
              <div className="flex items-center gap-2">
                <label className="inline-flex items-center gap-1.5 px-3 py-1.5 font-medium text-indigo-800 bg-indigo-50 hover:bg-indigo-100 rounded-lg cursor-pointer">
                  <Upload className="w-3.5 h-3.5" />
                  <span>{activeSlide.imageUrl ? 'Ganti Gambar' : 'Unggah Gambar'}</span>
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    onChange={handleImageFileUpload}
                    className="hidden"
                  />
                </label>
                {activeSlide.imageUrl && (
                  <button
                    type="button"
                    onClick={() => updateSlide({ imageUrl: null })}
                    className="px-3 py-1.5 font-medium text-red-700 bg-red-50 hover:bg-red-100 rounded-lg"
                  >
                    Hapus dari Slide
                  </button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  Teks Alternatif Gambar (Aksesibilitas Alt Text)
                </label>
                <input
                  type="text"
                  value={activeSlide.imageAlt}
                  onChange={(e) => updateSlide({ imageAlt: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Skala Gambar</label>
                  <select
                    value={activeSlide.imageFit}
                    onChange={(e) =>
                      updateSlide({ imageFit: e.target.value as BannerImageFit })
                    }
                    className="w-full px-2 py-2 border border-slate-300 rounded-lg bg-white"
                  >
                    <option value="cover">Penuh (Cover)</option>
                    <option value="contain">Utuh (Contain)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Fokus Posisi</label>
                  <select
                    value={activeSlide.imageFocus}
                    onChange={(e) =>
                      updateSlide({ imageFocus: e.target.value as BannerImageFocus })
                    }
                    className="w-full px-2 py-2 border border-slate-300 rounded-lg bg-white"
                  >
                    <option value="center">Tengah</option>
                    <option value="top">Atas</option>
                    <option value="bottom">Bawah</option>
                    <option value="left">Kiri</option>
                    <option value="right">Kanan</option>
                  </select>
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Lapisan Gelap</label>
                  <select
                    value={activeSlide.overlayIntensity}
                    onChange={(e) =>
                      updateSlide({ overlayIntensity: e.target.value as BannerOverlayIntensity })
                    }
                    className="w-full px-2 py-2 border border-slate-300 rounded-lg bg-white"
                  >
                    <option value="none">Tanpa Lapisan</option>
                    <option value="light">Ringan</option>
                    <option value="medium">Sedang</option>
                    <option value="strong">Pekat</option>
                  </select>
                </div>
              </div>
            </div>

            {bannerConfig.uploadedAssets.length > 0 && (
              <div>
                <div className="text-[11px] font-medium text-slate-600 mb-2">
                  Pilih dari Pustaka Gambar Tersimpan:
                </div>
                <div className="flex flex-wrap gap-2">
                  {bannerConfig.uploadedAssets.map((asset) => {
                    const isUsed = activeSlide.imageUrl === asset.url;
                    return (
                      <div
                        key={asset.filename}
                        className={`flex items-center gap-2 p-1.5 rounded-lg border ${
                          isUsed ? 'border-indigo-500 bg-indigo-50' : 'border-slate-200 bg-slate-50'
                        }`}
                      >
                        <button
                          type="button"
                          onClick={() => updateSlide({ imageUrl: asset.url })}
                          className="flex items-center gap-2 text-left"
                        >
                          <img
                            src={asset.url}
                            alt={asset.filename}
                            className="w-10 h-10 rounded object-cover border border-slate-200"
                          />
                          <span className="max-w-[130px] truncate text-[11px] text-slate-700">
                            {asset.filename}
                          </span>
                        </button>
                        {asset.filename !== 'hero_dynamap_research_1794747705329.jpg' && (
                          <button
                            type="button"
                            onClick={() => handleDeleteAsset(asset.filename)}
                            aria-label={`Hapus aset ${asset.filename}`}
                            className="p-1 text-slate-400 hover:text-red-700"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Colors & Text Align */}
          <div className="pt-4 border-t border-slate-200 grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="block font-medium text-slate-700 mb-1">Warna Latar</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  aria-label="Warna latar spanduk"
                  value={activeSlide.backgroundColor}
                  onChange={(e) => updateSlide({ backgroundColor: e.target.value })}
                  className="w-8 h-8 rounded border border-slate-300 cursor-pointer"
                />
                <input
                  type="text"
                  value={activeSlide.backgroundColor}
                  onChange={(e) => updateSlide({ backgroundColor: e.target.value })}
                  className="w-full px-2 py-1.5 border border-slate-300 rounded font-mono"
                />
              </div>
            </div>
            <div>
              <label className="block font-medium text-slate-700 mb-1">Warna Teks</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  aria-label="Warna teks spanduk"
                  value={activeSlide.textColor}
                  onChange={(e) => updateSlide({ textColor: e.target.value })}
                  className="w-8 h-8 rounded border border-slate-300 cursor-pointer"
                />
                <input
                  type="text"
                  value={activeSlide.textColor}
                  onChange={(e) => updateSlide({ textColor: e.target.value })}
                  className="w-full px-2 py-1.5 border border-slate-300 rounded font-mono"
                />
              </div>
            </div>
            <div>
              <label className="block font-medium text-slate-700 mb-1">Warna Aksen / Tombol</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  aria-label="Warna aksen spanduk"
                  value={activeSlide.accentColor}
                  onChange={(e) => updateSlide({ accentColor: e.target.value })}
                  className="w-8 h-8 rounded border border-slate-300 cursor-pointer"
                />
                <input
                  type="text"
                  value={activeSlide.accentColor}
                  onChange={(e) => updateSlide({ accentColor: e.target.value })}
                  className="w-full px-2 py-1.5 border border-slate-300 rounded font-mono"
                />
              </div>
            </div>
            <div>
              <label className="block font-medium text-slate-700 mb-1">Perataan Teks</label>
              <select
                value={activeSlide.textAlign}
                onChange={(e) =>
                  updateSlide({ textAlign: e.target.value as BannerTextAlignment })
                }
                className="w-full px-2.5 py-2 border border-slate-300 rounded-lg bg-white"
              >
                <option value="left">Rata Kiri</option>
                <option value="center">Rata Tengah</option>
                <option value="right">Rata Kanan</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Dialog for Reset */}
      {confirmResetOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-md bg-white border border-slate-200 rounded-xl shadow-xl p-6 space-y-4">
            <h3 className="text-lg font-display font-bold text-slate-900">
              Kembalikan Spanduk ke Pengaturan Bawaan?
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Seluruh judul, warna, dan susunan slide pada Draf akan dikembalikan ke spanduk asli DYNAMAP. Pilih apakah ingin mengganti draf saja atau langsung mempublikasikannya ke beranda.
            </p>
            <div className="flex flex-wrap justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setConfirmResetOpen(false)}
                className="px-3.5 py-2 text-xs font-medium text-slate-700 bg-slate-100 rounded-lg"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => handleResetDefault(false)}
                className="px-3.5 py-2 text-xs font-medium text-indigo-800 bg-indigo-50 rounded-lg"
              >
                Kembalikan Draf Saja
              </button>
              <button
                type="button"
                onClick={() => handleResetDefault(true)}
                className="px-4 py-2 text-xs font-medium text-white bg-indigo-700 hover:bg-indigo-800 rounded-lg"
              >
                Reset &amp; Publikasikan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
