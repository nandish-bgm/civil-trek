import { useState } from 'react';
import CalcBreakdown from './CalcBreakdown';

const TABS = ['Dead Load', 'Live Load', 'Wind', 'Seismic', 'Snow', 'Bending Moment'];

function SummaryCard({ label, value, unit, color, icon }) {
  return (
    <div className="rounded-xl p-4 border" style={{ background: color + '18', borderColor: color + '55' }}>
      <div className="text-2xl mb-1">{icon}</div>
      <div className="text-xs font-semibold uppercase tracking-wide mb-1" style={{ color }}>{label}</div>
      <div className="text-2xl font-bold text-gray-900">{typeof value === 'number' ? value.toFixed(3) : value}</div>
      <div className="text-xs text-gray-500">{unit}</div>
    </div>
  );
}

export default function ResultsPanel({ results, inputs }) {
  const [activeTab, setActiveTab] = useState('Dead Load');
  if (!results) return (
    <div className="flex flex-col items-center justify-center h-64 text-gray-400">
      <div className="text-5xl mb-4">🧮</div>
      <p className="text-lg font-medium">Fill in the inputs to see results</p>
      <p className="text-sm mt-1">Results update live as you type</p>
    </div>
  );

  const { dl, ll, wl, sl, snow, bm, combos } = results;
  const maxCombo = Math.max(...combos.map(c => c.value));

  const warnings = [];
  if (inputs.numFloors > 10) warnings.push('⚠ Building > 10 floors — consider dynamic wind analysis (IS 875 Part 3, Cl. 7)');
  if ((inputs.seismicZoneOverride || '') === 'Zone V' || (!inputs.seismicZoneOverride && inputs.city === 'Srinagar')) warnings.push('⚠ Seismic Zone V — ductile detailing mandatory per IS 13920');
  if (inputs.city === 'Chennai' || inputs.city === 'Kolkata') warnings.push('⚠ Cyclone-prone region — verify wind load with IS 875 Part 3 dynamic method');

  const tabContent = {
    'Dead Load': { steps: dl.steps, components: dl.components, color: '#6366f1' },
    'Live Load': { steps: ll.steps, components: [], color: '#f59e0b' },
    'Wind': { steps: wl.steps, components: [], color: '#06b6d4' },
    'Seismic': { steps: sl.steps, components: [], color: '#ef4444' },
    'Snow': { steps: snow.steps, components: [], color: '#8b5cf6' },
    'Bending Moment': { steps: bm.steps, components: [], color: '#10b981' },
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <SummaryCard label="Dead Load" value={dl.total} unit="kN/m²" color="#6366f1" icon="🔴" />
        <SummaryCard label="Live Load" value={ll.total} unit="kN/m²" color="#f59e0b" icon="🟡" />
        <SummaryCard label="Wind Load" value={wl.total} unit="kN/m²" color="#06b6d4" icon="🌬️" />
        <SummaryCard label="Seismic Ah" value={sl.Ah} unit="coefficient" color="#ef4444" icon="🌊" />
      </div>

      {/* BM Summary */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
        <h3 className="font-bold text-gray-800 mb-3">📐 Bending Moment & Shear</h3>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-green-700">{bm.Mmax.toFixed(2)}</div>
            <div className="text-xs text-gray-500 mt-1">Max BM (kN·m)</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-blue-700">{bm.Vmax.toFixed(2)}</div>
            <div className="text-xs text-gray-500 mt-1">Max Shear (kN)</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-orange-600">{maxCombo.toFixed(2)}</div>
            <div className="text-xs text-gray-500 mt-1">Governing Combo (kN/m²)</div>
          </div>
        </div>
      </div>

      {/* Load Combinations */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
        <h3 className="font-bold text-gray-800 mb-3">⚖️ Load Combinations (IS 456 / IS 1893)</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50">
                <th className="text-left px-3 py-2 font-medium text-gray-600">Combination</th>
                <th className="text-right px-3 py-2 font-medium text-gray-600">Value (kN/m²)</th>
                <th className="text-left px-3 py-2 font-medium text-gray-600">Code Ref</th>
                <th className="text-center px-3 py-2 font-medium text-gray-600">Governs?</th>
              </tr>
            </thead>
            <tbody>
              {combos.map((c, i) => {
                const isMax = c.value === maxCombo;
                return (
                  <tr key={i} className={isMax ? 'bg-orange-50' : i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className={`px-3 py-2 font-medium ${isMax ? 'text-orange-700' : 'text-gray-700'}`}>{c.label}</td>
                    <td className={`px-3 py-2 text-right font-bold ${isMax ? 'text-orange-700' : 'text-gray-800'}`}>{c.value.toFixed(3)}</td>
                    <td className="px-3 py-2">
                      <span className="text-xs px-2 py-0.5 rounded-full bg-orange-50 text-orange-700 border border-orange-200">{c.code}</span>
                    </td>
                    <td className="px-3 py-2 text-center">{isMax ? '✅' : ''}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Tabbed Breakdown */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="border-b border-gray-200 overflow-x-auto">
          <div className="flex min-w-max">
            {TABS.map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={`px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors border-b-2 ${activeTab === tab ? 'border-orange-600 text-orange-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
                {tab}
              </button>
            ))}
          </div>
        </div>
        <div className="p-5">
          <CalcBreakdown
            steps={tabContent[activeTab].steps}
            components={tabContent[activeTab].components}
            color={tabContent[activeTab].color}
          />
        </div>
      </div>

      {/* Warnings */}
      {warnings.length > 0 && (
        <div className="bg-white rounded-xl border border-amber-200 shadow-sm p-5">
          <h3 className="font-bold text-amber-800 mb-3">⚠️ Engineering Notices</h3>
          <div className="space-y-2">
            {warnings.map((w, i) => (
              <div key={i} className="flex items-start gap-2 text-sm text-amber-700 bg-amber-50 rounded-lg px-3 py-2">
                <span className="flex-shrink-0 mt-0.5">•</span>
                <span>{w}</span>
              </div>
            ))}
            <div className="text-xs text-gray-400 mt-2">ℹ Natural period estimated; time-history analysis recommended for irregular structures per IS 1893 Cl. 7.8</div>
          </div>
        </div>
      )}
    </div>
  );
}
