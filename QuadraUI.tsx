import React from 'react';
import { QUADRAS } from '../data/socionicsData';
import type { Profile, QuadraName } from '../types/dynamap';
import type { DistributionItem } from '../lib/typology';

export function getQuadraTheme(quadra: QuadraName | '' | undefined) {
  switch (quadra) {
    case 'Alpha':
      return {
        label: 'Alpha (Kuning)',
        bgSoft: 'bg-amber-50',
        border: 'border-amber-300',
        text: 'text-amber-950',
        bar: 'bg-amber-500',
        hex: '#D49B2A',
      };
    case 'Beta':
      return {
        label: 'Beta (Merah Muda)',
        bgSoft: 'bg-rose-50',
        border: 'border-rose-300',
        text: 'text-rose-950',
        bar: 'bg-rose-500',
        hex: '#C76492',
      };
    case 'Gamma':
      return {
        label: 'Gamma (Hijau)',
        bgSoft: 'bg-emerald-50',
        border: 'border-emerald-300',
        text: 'text-emerald-950',
        bar: 'bg-emerald-600',
        hex: '#2C8B74',
      };
    case 'Delta':
      return {
        label: 'Delta (Biru)',
        bgSoft: 'bg-indigo-50',
        border: 'border-indigo-300',
        text: 'text-indigo-950',
        bar: 'bg-indigo-600',
        hex: '#3B5FC0',
      };
    default:
      return {
        label: 'Belum Ditentukan',
        bgSoft: 'bg-slate-100',
        border: 'border-slate-200',
        text: 'text-slate-700',
        bar: 'bg-slate-400',
        hex: '#8994B8',
      };
  }
}

export const ProfileAvatar: React.FC<{
  profile: Pick<Profile, 'displayName' | 'photoUrl' | 'typology'>;
  size?: 'sm' | 'md' | 'lg';
}> = ({ profile, size = 'md' }) => {
  const [imgError, setImgError] = React.useState(false);
  const theme = getQuadraTheme(profile.typology.quadra);

  const dims =
    size === 'sm'
      ? 'w-9 h-9 text-xs'
      : size === 'lg'
      ? 'w-16 h-16 text-lg'
      : 'w-11 h-11 text-sm';

  const initials = profile.displayName
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() || '')
    .join('');

  if (profile.photoUrl && !imgError) {
    return (
      <img
        src={profile.photoUrl}
        alt={`Foto profil ${profile.displayName}`}
        referrerPolicy="no-referrer"
        onError={() => setImgError(true)}
        className={`${dims} rounded-full object-cover border border-slate-200 shrink-0 bg-slate-100`}
      />
    );
  }

  return (
    <div
      className={`${dims} ${theme.bgSoft} ${theme.text} ${theme.border} border rounded-full font-display font-semibold flex items-center justify-center shrink-0 select-none`}
      aria-hidden="true"
    >
      {initials || '?'}
    </div>
  );
};

export const QuadraDonutChart: React.FC<{
  items: DistributionItem[];
  total: number;
}> = ({ items, total }) => {
  const radius = 58;
  const circumference = 2 * Math.PI * radius;
  let accumulated = 0;

  return (
    <div className="flex flex-col sm:flex-row items-center gap-4">
      <div className="relative w-32 h-32 shrink-0">
        <svg viewBox="0 0 160 160" className="w-full h-full -rotate-90" role="img" aria-label="Diagram distribusi Quadra">
          <circle
            cx="80"
            cy="80"
            r={radius}
            fill="none"
            stroke="#E6EAF8"
            strokeWidth="20"
          />
          {items.map((item) => {
            if (item.count === 0 || total === 0) return null;
            const fraction = item.count / total;
            const dash = fraction * circumference;
            const offset = -accumulated * circumference;
            accumulated += fraction;
            const theme = getQuadraTheme(item.label as QuadraName);
            return (
              <circle
                key={item.label}
                cx="80"
                cy="80"
                r={radius}
                fill="none"
                stroke={theme.hex}
                strokeWidth="20"
                strokeDasharray={`${dash} ${circumference - dash}`}
                strokeDashoffset={offset}
              />
            );
          })}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
          <span className="text-2xl font-display font-bold text-slate-900 tabular-nums">{total}</span>
          <span className="text-[11px] text-slate-500">Profil Aktif</span>
        </div>
      </div>

      <div className="flex-1 min-w-0 w-full space-y-2.5">
        {items.map((item) => {
          const theme = getQuadraTheme(item.label as QuadraName);
          const qSpec = QUADRAS[item.label as QuadraName];
          return (
            <div key={item.label} className="flex items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-1.5 min-w-0">
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0 border border-black/10"
                  style={{ backgroundColor: theme.hex }}
                  aria-hidden="true"
                />
                <span className="font-medium text-slate-800 whitespace-nowrap">
                  {qSpec ? `Quadra ${qSpec.name} (${qSpec.colorName})` : item.label}
                </span>
              </div>
              <div className="font-mono text-[11px] text-slate-600 tabular-nums shrink-0">
                {item.count} ({item.percentage.toFixed(1)}%)
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const HorizontalBarChart: React.FC<{
  items: DistributionItem[];
  barColor?: string;
  emptyText?: string;
}> = ({ items, barColor = 'bg-indigo-600', emptyText = 'Belum ada data distribusi.' }) => {
  if (items.length === 0) {
    return <p className="text-sm text-slate-500">{emptyText}</p>;
  }
  const maxCount = Math.max(...items.map((i) => i.count), 1);

  return (
    <div className="space-y-2.5">
      {items.map((item) => {
        const widthPct = Math.max((item.count / maxCount) * 100, 3);
        return (
          <div key={item.label} className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-slate-800 truncate pr-2">{item.label}</span>
              <span className="font-mono text-slate-600 tabular-nums shrink-0">
                {item.count} · {item.percentage.toFixed(1)}%
              </span>
            </div>
            <div className="h-2 w-full bg-slate-100 rounded-sm overflow-hidden">
              <div
                className={`h-full ${barColor} rounded-sm transition-all duration-300`}
                style={{ width: `${widthPct}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};
