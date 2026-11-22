import React, { useState } from 'react';
import { Edit3, Lock, Plus, Trash2 } from 'lucide-react';
import type { Account, ReflectionRecord } from '../types/dynamap';

interface RefleksiInterpersonalViewProps {
  account: Account | null;
  reflections: ReflectionRecord[];
  onOpenAuth: () => void;
  onCreated: (rec: ReflectionRecord) => void;
  onUpdated: (rec: ReflectionRecord) => void;
  onDeleted: (id: string) => void;
}

const EMPTY_FORM = {
  title: '',
  date: new Date().toISOString().slice(0, 10),
  whatHappened: '',
  myInterpretation: '',
  otherPerspective: '',
  supportingEvidence: '',
  possibleAssumptions: '',
  whatToCommunicateDifferently: '',
  nextStepAction: '',
};

export const RefleksiInterpersonalView: React.FC<RefleksiInterpersonalViewProps> = ({
  account,
  reflections,
  onOpenAuth,
  onCreated,
  onUpdated,
  onDeleted,
}) => {
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  if (!account) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl p-8 text-center space-y-4 max-w-2xl mx-auto">
        <Lock className="w-8 h-8 text-indigo-700 mx-auto" />
        <h1 className="text-2xl font-display font-bold text-slate-900">
          Refleksi Interpersonal Pribadi
        </h1>
        <p className="text-sm text-slate-600 leading-relaxed">
          Modul ini menyimpan catatan pengalaman interaksi pribadi secara privat. Administrator sekalipun
          tidak dapat membaca isi refleksi pribadi akun pengguna lain. Silakan masuk terlebih dahulu untuk
          mencatat, meninjau, atau menyunting refleksi Anda.
        </p>
        <button
          type="button"
          onClick={onOpenAuth}
          className="px-5 py-2.5 text-sm font-medium text-white bg-indigo-700 hover:bg-indigo-800 rounded-lg transition-colors"
        >
          Masuk atau Klaim Profil
        </button>
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      const token = localStorage.getItem('dynamap_token');
      const url = editingId
        ? `/api/reflections/interpersonal/${editingId}`
        : '/api/reflections/interpersonal';
      const res = await fetch(url, {
        method: editingId ? 'PATCH' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Gagal menyimpan catatan refleksi.');
      } else {
        if (editingId) {
          onUpdated(data.record);
        } else {
          onCreated(data.record);
        }
        setForm(EMPTY_FORM);
        setEditingId(null);
      }
    } catch {
      setError('Gagal terhubung ke server.');
    } finally {
      setSaving(false);
    }
  }

  function startEdit(rec: ReflectionRecord) {
    setEditingId(rec.id);
    setForm({
      title: rec.title,
      date: rec.date,
      whatHappened: rec.whatHappened,
      myInterpretation: rec.myInterpretation,
      otherPerspective: rec.otherPerspective,
      supportingEvidence: rec.supportingEvidence,
      possibleAssumptions: rec.possibleAssumptions,
      whatToCommunicateDifferently: rec.whatToCommunicateDifferently,
      nextStepAction: rec.nextStepAction,
    });
  }

  async function handleDelete(id: string) {
    const token = localStorage.getItem('dynamap_token');
    const res = await fetch(`/api/reflections/interpersonal/${id}`, {
      method: 'DELETE',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    if (res.ok) {
      onDeleted(id);
      if (editingId === id) {
        setEditingId(null);
        setForm(EMPTY_FORM);
      }
    }
  }

  return (
    <div className="space-y-8">
      <div className="bg-white border border-slate-200 rounded-xl p-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-slate-900">
            Refleksi Interpersonal Terstruktur
          </h1>
          <p className="text-sm text-slate-600 mt-1 max-w-3xl">
            Dokumentasikan pengalaman komunikasi nyata untuk membedakan fakta peristiwa dari asumsi
            pribadi. Seluruh catatan bersifat privat secara default dan hanya terlihat oleh akun pemiliknya.
          </p>
        </div>
        <div className="inline-flex items-center gap-1.5 text-xs text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg">
          <Lock className="w-3.5 h-3.5" />
          Privat Milik {account.displayName}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <form
          onSubmit={handleSubmit}
          className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-6 space-y-3.5 text-sm"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-display font-semibold text-slate-900">
              {editingId ? 'Sunting Catatan Refleksi' : 'Tulis Refleksi Baru'}
            </h2>
            {editingId && (
              <button
                type="button"
                onClick={() => {
                  setEditingId(null);
                  setForm(EMPTY_FORM);
                }}
                className="text-xs text-slate-500 hover:text-slate-900"
              >
                Batal Sunting
              </button>
            )}
          </div>

          {error && (
            <div className="p-2.5 rounded-lg bg-red-50 border border-red-200 text-xs text-red-800">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label htmlFor="rf-title" className="block text-xs font-medium text-slate-700 mb-1">
                Judul Pengalaman *
              </label>
              <input
                id="rf-title"
                type="text"
                required
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="Mis. Diskusi kelompok sejarah hari ini"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
              />
            </div>
            <div>
              <label htmlFor="rf-date" className="block text-xs font-medium text-slate-700 mb-1">
                Tanggal
              </label>
              <input
                id="rf-date"
                type="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono"
              />
            </div>
          </div>

          <div>
            <label htmlFor="rf-1" className="block text-xs font-medium text-slate-700 mb-1">
              1. Apa yang terjadi? (Fakta peristiwa) *
            </label>
            <textarea
              id="rf-1"
              required
              rows={2}
              value={form.whatHappened}
              onChange={(e) => setForm({ ...form, whatHappened: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
            />
          </div>

          <div>
            <label htmlFor="rf-2" className="block text-xs font-medium text-slate-700 mb-1">
              2. Apa yang saya tafsirkan saat itu?
            </label>
            <textarea
              id="rf-2"
              rows={2}
              value={form.myInterpretation}
              onChange={(e) => setForm({ ...form, myInterpretation: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
            />
          </div>

          <div>
            <label htmlFor="rf-3" className="block text-xs font-medium text-slate-700 mb-1">
              3. Apa yang mungkin dialami atau dirasakan orang lain?
            </label>
            <textarea
              id="rf-3"
              rows={2}
              value={form.otherPerspective}
              onChange={(e) => setForm({ ...form, otherPerspective: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
            />
          </div>

          <div>
            <label htmlFor="rf-4" className="block text-xs font-medium text-slate-700 mb-1">
              4. Bukti apa yang mendukung penafsiranku?
            </label>
            <input
              id="rf-4"
              type="text"
              value={form.supportingEvidence}
              onChange={(e) => setForm({ ...form, supportingEvidence: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
            />
          </div>

          <div>
            <label htmlFor="rf-5" className="block text-xs font-medium text-slate-700 mb-1">
              5. Asumsi apa yang mungkin kubuat tanpa verifikasi?
            </label>
            <input
              id="rf-5"
              type="text"
              value={form.possibleAssumptions}
              onChange={(e) => setForm({ ...form, possibleAssumptions: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
            />
          </div>

          <div>
            <label htmlFor="rf-6" className="block text-xs font-medium text-slate-700 mb-1">
              6. Apa yang bisa kukomunikasikan secara berbeda?
            </label>
            <input
              id="rf-6"
              type="text"
              value={form.whatToCommunicateDifferently}
              onChange={(e) => setForm({ ...form, whatToCommunicateDifferently: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
            />
          </div>

          <div>
            <label htmlFor="rf-7" className="block text-xs font-medium text-slate-700 mb-1">
              7. Apa yang akan kulakukan lain kali?
            </label>
            <input
              id="rf-7"
              type="text"
              value={form.nextStepAction}
              onChange={(e) => setForm({ ...form, nextStepAction: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full py-2.5 px-4 text-sm font-medium text-white bg-indigo-700 hover:bg-indigo-800 rounded-lg transition-colors inline-flex items-center justify-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            {saving
              ? 'Menyimpan...'
              : editingId
              ? 'Perbarui Catatan Refleksi'
              : 'Simpan Catatan Refleksi'}
          </button>
        </form>

        <div className="lg:col-span-7 space-y-4">
          {reflections.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-xl p-10 text-center space-y-2">
              <h3 className="text-base font-display font-semibold text-slate-900">
                Belum Ada Catatan Refleksi Tersimpan
              </h3>
              <p className="text-sm text-slate-500">
                Mulai dokumentasikan pengalaman interaksi nyata Anda melalui formulir 7 pertanyaan di sebelah kiri.
              </p>
            </div>
          ) : (
            reflections.map((rec) => (
              <div key={rec.id} className="bg-white border border-slate-200 rounded-xl p-5 space-y-3 text-xs sm:text-sm">
                <div className="flex items-start justify-between gap-3 pb-2 border-b border-slate-100">
                  <div>
                    <span className="font-mono text-xs text-slate-500 tabular-nums">{rec.date}</span>
                    <h3 className="text-base font-display font-semibold text-slate-900">
                      {rec.title}
                    </h3>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => startEdit(rec)}
                      aria-label={`Sunting refleksi ${rec.title}`}
                      className="p-1.5 text-slate-500 hover:text-indigo-700 rounded-lg hover:bg-slate-100"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(rec.id)}
                      aria-label={`Hapus refleksi ${rec.title}`}
                      className="p-1.5 text-slate-500 hover:text-red-600 rounded-lg hover:bg-slate-100"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="space-y-2 text-xs text-slate-700 leading-relaxed">
                  <p>
                    <strong className="text-slate-900">Kejadian:</strong> {rec.whatHappened}
                  </p>
                  {rec.myInterpretation && (
                    <p>
                      <strong className="text-slate-900">Tafsiran Awal:</strong> {rec.myInterpretation}
                    </p>
                  )}
                  {rec.otherPerspective && (
                    <p>
                      <strong className="text-slate-900">Perspektif Pihak Lain:</strong>{' '}
                      {rec.otherPerspective}
                    </p>
                  )}
                  {rec.supportingEvidence && (
                    <p>
                      <strong className="text-slate-900">Bukti Pendukung:</strong>{' '}
                      {rec.supportingEvidence}
                    </p>
                  )}
                  {rec.possibleAssumptions && (
                    <p>
                      <strong className="text-slate-900">Asumsi yang Teridentifikasi:</strong>{' '}
                      {rec.possibleAssumptions}
                    </p>
                  )}
                  {rec.whatToCommunicateDifferently && (
                    <p>
                      <strong className="text-slate-900">Alternatif Komunikasi:</strong>{' '}
                      {rec.whatToCommunicateDifferently}
                    </p>
                  )}
                  {rec.nextStepAction && (
                    <p className="text-indigo-900">
                      <strong>Rencana Tindak Lanjut:</strong> {rec.nextStepAction}
                    </p>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
