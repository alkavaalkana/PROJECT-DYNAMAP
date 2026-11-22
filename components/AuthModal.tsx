import React, { useState } from 'react';
import { X, KeyRound, UserPlus, ShieldCheck } from 'lucide-react';
import type { Account, Profile, SystemSettings } from '../types/dynamap';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  profiles: Profile[];
  settings: SystemSettings;
  onSuccess: (token: string, account: Account) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  profiles,
  settings,
  onSuccess,
}) => {
  const [tab, setTab] = useState<'login' | 'claim'>('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [selectedProfileId, setSelectedProfileId] = useState('');
  const [claimCode, setClaimCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const unclaimedProfiles = profiles.filter((p) => !p.archived && !p.claimedByAccountId);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Gagal masuk.');
      } else {
        onSuccess(data.token, data.account);
        onClose();
      }
    } catch {
      setError('Gagal terhubung ke server.');
    } finally {
      setLoading(false);
    }
  }

  async function handleClaim(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/auth/register-claim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username,
          password,
          profileId: selectedProfileId,
          claimCode,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Gagal menautkan profil.');
      } else {
        onSuccess(data.token, data.account);
        onClose();
      }
    } catch {
      setError('Gagal terhubung ke server.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#0B0F22]/60 backdrop-blur-sm p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
    >
      <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl shadow-[0_24px_60px_-20px_rgba(11,15,34,0.45)] overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-gradient-to-r from-[#FFFFFF] to-[#F5F6FC]">
          <div>
            <h2 id="auth-modal-title" className="text-lg font-display font-semibold text-slate-900">
              Akses Akun DYNAMAP
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Masuk atau tautkan akun baru ke profil resmi melalui kode verifikasi.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup jendela akun"
            className="p-2 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="px-6 pt-4">
          <div className="grid grid-cols-2 gap-1 p-1 bg-slate-100 rounded-lg">
            <button
              type="button"
              onClick={() => {
                setTab('login');
                setError('');
              }}
              className={`flex items-center justify-center gap-2 py-2 px-3 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                tab === 'login' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <KeyRound className="w-3.5 h-3.5" />
              Masuk Akun
            </button>
            <button
              type="button"
              onClick={() => {
                setTab('claim');
                setError('');
              }}
              className={`flex items-center justify-center gap-2 py-2 px-3 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                tab === 'claim' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <UserPlus className="w-3.5 h-3.5" />
              Daftar & Klaim Profil
            </button>
          </div>
        </div>

        {settings.mode === 'development' && (
          <div className="mx-6 mt-4 p-3 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-900">
            <strong>Mode Pengembangan Aktif:</strong> Pendaftaran dan login akun siswa sementara ditutup
            oleh Administrator. Hanya Administrator yang dapat masuk untuk menyiapkan data.
          </div>
        )}

        {error && (
          <div className="mx-6 mt-4 p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-800">
            {error}
          </div>
        )}

        {tab === 'login' ? (
          <form onSubmit={handleLogin} className="p-6 space-y-4">
            <div>
              <label htmlFor="login-username" className="block text-xs font-medium text-slate-700 mb-1">
                Nama Pengguna
              </label>
              <input
                id="login-username"
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Contoh: admin atau alano.lsi"
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label htmlFor="login-password" className="block text-xs font-medium text-slate-700 mb-1">
                Kata Sandi
              </label>
              <input
                id="login-password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Masukkan kata sandi"
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-1">
              <div className="flex items-center gap-1.5 font-medium text-slate-800">
                <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
                Akses Administrator Awal
              </div>
              <p>
                Nama pengguna: <code className="font-mono text-slate-900">admin</code> · Kata sandi:{' '}
                <code className="font-mono text-slate-900">admin123</code>
              </p>
              <p>Siswa atau guru yang belum memiliki akun dapat mendaftar di tab Daftar & Klaim Profil menggunakan kode verifikasi dari Administrator.</p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 text-sm font-medium text-white bg-[#151D40] hover:bg-[#233070] rounded-lg transition-colors disabled:opacity-50"
            >
              {loading ? 'Memverifikasi...' : 'Masuk ke DYNAMAP'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleClaim} className="p-6 space-y-4">
            <div>
              <label htmlFor="claim-profile" className="block text-xs font-medium text-slate-700 mb-1">
                Pilih Profil Anda di Database Sekolah
              </label>
              <select
                id="claim-profile"
                required
                value={selectedProfileId}
                onChange={(e) => setSelectedProfileId(e.target.value)}
                disabled={settings.mode === 'development'}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
              >
                <option value="">-- Pilih profil yang belum ditautkan --</option>
                {unclaimedProfiles.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.displayName} ({p.category})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="claim-code" className="block text-xs font-medium text-slate-700 mb-1">
                Kode Verifikasi Klaim (dari Administrator)
              </label>
              <input
                id="claim-code"
                type="text"
                required
                disabled={settings.mode === 'development'}
                value={claimCode}
                onChange={(e) => setClaimCode(e.target.value)}
                placeholder="Contoh: DYN-34-ALANO"
                className="w-full px-3 py-2 text-sm font-mono border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <p className="text-[11px] text-slate-500 mt-1">
                Sistem menolak klaim profil hanya berdasarkan pengetikan nama demi melindungi privasi data siswa.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="claim-username" className="block text-xs font-medium text-slate-700 mb-1">
                  Nama Pengguna Baru
                </label>
                <input
                  id="claim-username"
                  type="text"
                  required
                  disabled={settings.mode === 'development'}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="mis. alano"
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label htmlFor="claim-password" className="block text-xs font-medium text-slate-700 mb-1">
                  Kata Sandi (min. 6)
                </label>
                <input
                  id="claim-password"
                  type="password"
                  required
                  minLength={6}
                  disabled={settings.mode === 'development'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••"
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || settings.mode === 'development'}
              className="w-full py-2.5 px-4 text-sm font-medium text-white bg-[#151D40] hover:bg-[#233070] rounded-lg transition-colors disabled:opacity-50"
            >
              {loading ? 'Memverifikasi & Menautkan...' : 'Verifikasi & Tautkan Profil'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
