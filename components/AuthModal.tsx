import React, { useState } from 'react';
import { Lock, Shield, UserCheck, X } from 'lucide-react';
import type { Account, Profile, SystemSettings } from '../types/dynamap';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  profiles: Profile[];
  settings: SystemSettings;
  onSuccess: (token: string, account: Account) => void;
}

export function AuthModal({ isOpen, onClose, profiles, onSuccess }: AuthModalProps) {
  const [tab, setTab] = useState<'student' | 'admin'>('student');
  const [selectedProfileId, setSelectedProfileId] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  function handleAdminLogin(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (username.trim().toLowerCase() === 'admin' && password === 'joijo123') {
      const adminAccount: Account = {
        id: 'acc-admin-local',
        username: 'admin',
        displayName: 'Administrator DYNAMAP',
        role: 'admin',
      };
      onSuccess('local-admin-token', adminAccount);
      setUsername('');
      setPassword('');
      onClose();
      return;
    }
    setError('Username atau kata sandi administrator tidak sesuai.');
  }

  function handleStudentClaim(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    const target = profiles.find((p) => p.id === selectedProfileId);
    if (!target) {
      setError('Silakan pilih nama partisipan terlebih dahulu.');
      return;
    }
    const studentAccount: Account = {
      id: `acc-${target.id}`,
      username: target.id,
      displayName: target.fullName,
      role: 'student',
      linkedProfileId: target.id,
    };
    onSuccess(`local-token-${target.id}`, studentAccount);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-5">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h2 className="font-display font-semibold text-base text-slate-900">
            Masuk / Klaim Profil DYNAMAP
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl text-xs font-medium">
          <button
            type="button"
            onClick={() => {
              setTab('student');
              setError('');
            }}
            className={`py-2 rounded-lg flex items-center justify-center gap-1.5 transition-colors ${
              tab === 'student' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            Klaim Siswa
          </button>
          <button
            type="button"
            onClick={() => {
              setTab('admin');
              setError('');
            }}
            className={`py-2 rounded-lg flex items-center justify-center gap-1.5 transition-colors ${
              tab === 'admin' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            Login Admin
          </button>
        </div>

        {error && (
          <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-800">
            {error}
          </div>
        )}

        {tab === 'admin' ? (
          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Masukkan username"
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Kata Sandi
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Masukkan kata sandi"
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full py-2.5 px-4 bg-[#151D40] hover:bg-[#233070] text-white text-xs font-medium rounded-lg flex items-center justify-center gap-1.5"
            >
              <Lock className="w-3.5 h-3.5" />
              Masuk sebagai Administrator
            </button>
          </form>
        ) : (
          <form onSubmit={handleStudentClaim} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Pilih Nama Partisipan (37 Siswa)
              </label>
              <select
                value={selectedProfileId}
                onChange={(e) => setSelectedProfileId(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              >
                <option value="">-- Pilih namamu di daftar kelas --</option>
                {profiles.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.fullName} ({p.typology?.sociotype || '-'})
                  </option>
                ))}
              </select>
            </div>
            <button
              type="submit"
              className="w-full py-2.5 px-4 bg-[#151D40] hover:bg-[#233070] text-white text-xs font-medium rounded-lg flex items-center justify-center gap-1.5"
            >
              <UserCheck className="w-3.5 h-3.5" />
              Masuk & Klaim Profil Ini
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
