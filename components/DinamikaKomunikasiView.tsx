import React, { useState } from 'react';
import { COMMUNICATION_SCENARIOS } from '../data/communicationAndAcademicData';

export const DinamikaKomunikasiView: React.FC = () => {
  const [selectedId, setSelectedId] = useState<string>(COMMUNICATION_SCENARIOS[0].id);
  const [chosenResponseId, setChosenResponseId] = useState<string | null>(null);

  const scenario =
    COMMUNICATION_SCENARIOS.find((s) => s.id === selectedId) || COMMUNICATION_SCENARIOS[0];
  const chosenOption = scenario.responseChoices.find((o) => o.id === chosenResponseId) || null;

  function handleSelectScenario(id: string) {
    setSelectedId(id);
    setChosenResponseId(null);
  }

  return (
    <div className="space-y-6">
      <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-3">
        <h1 className="text-2xl font-display font-bold text-slate-900">
          Dinamika Komunikasi: Pembelajaran Berbasis Skenario
        </h1>
        <p className="text-sm text-slate-600 max-w-3xl">
          Eksplorasi 12 situasi nyata di lingkungan SMA untuk memahami perspektif dua pihak,
          mengenali sumber salah paham, menguji pilihan respons, serta melatih dialog yang konstruktif.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Scenario Topic List */}
        <div className="lg:col-span-4 bg-white border border-slate-200 rounded-xl p-3 space-y-1">
          <div className="px-3 py-2 text-xs font-semibold text-slate-500">
            12 Topik Situasi Komunikasi
          </div>
          {COMMUNICATION_SCENARIOS.map((item, idx) => {
            const active = item.id === scenario.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleSelectScenario(item.id)}
                className={`w-full text-left px-3 py-2.5 rounded-lg text-xs font-medium transition-colors flex items-start gap-2 ${
                  active
                    ? 'bg-indigo-700 text-white'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <span className="font-mono tabular-nums shrink-0 opacity-80">
                  {String(idx + 1).padStart(2, '0')}.
                </span>
                <span>{item.topic}</span>
              </button>
            );
          })}
        </div>

        {/* Active Scenario Detail */}
        <div className="lg:col-span-8 bg-white border border-slate-200 rounded-xl p-6 space-y-6">
          <div className="pb-4 border-b border-slate-200">
            <span className="text-xs font-medium text-indigo-700">Skenario Komunikasi</span>
            <h2 className="mt-1 text-xl font-display font-bold text-slate-900">{scenario.topic}</h2>
            <p className="mt-2 text-sm text-slate-700 leading-relaxed">{scenario.situation}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm">
            <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
              <strong className="text-slate-900 block">Perspektif Pihak A</strong>
              <p className="text-slate-700 leading-relaxed">{scenario.personAPerspective}</p>
            </div>
            <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
              <strong className="text-slate-900 block">Perspektif Pihak B</strong>
              <p className="text-slate-700 leading-relaxed">{scenario.personBPerspective}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm text-slate-700">
            <div className="space-y-2">
              <p>
                <strong className="text-slate-900">Perbedaan Gaya Komunikasi:</strong>{' '}
                {scenario.communicationDifferences}
              </p>
              <p>
                <strong className="text-slate-900">Potensi Kesalahpahaman:</strong>{' '}
                {scenario.potentialMisunderstanding}
              </p>
              <div>
                <strong className="text-slate-900 block mb-1">Interpretasi Alternatif:</strong>
                <ul className="list-disc pl-5 space-y-1">
                  {scenario.alternativeInterpretations.map((alt, i) => (
                    <li key={i}>{alt}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="space-y-2">
              <div>
                <strong className="text-slate-900 block mb-1">Pertanyaan Klarifikasi:</strong>
                <ul className="list-disc pl-5 space-y-1">
                  {scenario.clarifyingQuestions.map((q, i) => (
                    <li key={i}>{q}</li>
                  ))}
                </ul>
              </div>
              <div>
                <strong className="text-slate-900 block mb-1">Strategi Praktis:</strong>
                <ul className="list-disc pl-5 space-y-1">
                  {scenario.practicalStrategies.map((st, i) => (
                    <li key={i}>{st}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Interactive Response Simulator */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
            <h3 className="text-sm font-display font-semibold text-slate-900">
              Simulasi Pilihan Respons: Uji Konsekuensinya
            </h3>
            <div className="space-y-2">
              {scenario.responseChoices.map((opt) => {
                const selected = chosenResponseId === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setChosenResponseId(opt.id)}
                    className={`w-full text-left p-3 rounded-lg border text-xs transition-colors ${
                      selected
                        ? 'bg-indigo-50 border-indigo-400 text-indigo-950'
                        : 'bg-white border-slate-200 hover:border-slate-300 text-slate-800'
                    }`}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
            {chosenOption && (
              <div className="p-3.5 rounded-lg bg-white border border-slate-200 text-xs space-y-1.5">
                <div className="font-semibold text-slate-900">
                  Pola Respons: {chosenOption.tone}
                </div>
                <p className="text-slate-700">
                  <strong>Dampak Kemungkinan:</strong> {chosenOption.implication}
                </p>
                <p className="text-indigo-800">
                  <strong>Penyesuaian yang Disarankan:</strong> {chosenOption.recommendedAdjustment}
                </p>
              </div>
            )}
          </div>

          {/* Suggested Dialogue & Reflection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-red-900">
              <strong className="block mb-1">Hindari Kalimat:</strong>“{scenario.suggestedDialogue.avoid}”
            </div>
            <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-950">
              <strong className="block mb-1">Saran Dialog Konstruktif:</strong>“
              {scenario.suggestedDialogue.trySaying}”
            </div>
          </div>

          <div className="pt-3 border-t border-slate-200 text-xs text-slate-600">
            <strong className="text-slate-900 block mb-1">Pertanyaan Refleksi Lanjutan:</strong>
            <ul className="list-disc pl-5 space-y-1">
              {scenario.followUpReflection.map((ref, i) => (
                <li key={i}>{ref}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
