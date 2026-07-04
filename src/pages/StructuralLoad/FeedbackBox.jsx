import { useState } from 'react';

export default function FeedbackBox({ inputs, onRecalculate }) {
  const [text, setText] = useState('');
  const [changes, setChanges] = useState([]);
  const [analysed, setAnalysed] = useState(false);

  function parseFeedback(text, inputs) {
    const updated = { ...inputs };
    const applied = [];

    const partitionMatch = text.match(/partition[^\d]*(\d+\.?\d*)/i);
    if (partitionMatch) {
      updated.partitionLoad = true;
      applied.push(`Partition load noted: ${partitionMatch[1]} kN/m²`);
    }

    const slabMatch = text.match(/slab[^\d]*(\d+)\s*mm/i);
    if (slabMatch) {
      updated.slabThickness = parseInt(slabMatch[1]);
      applied.push(`Slab thickness changed to ${slabMatch[1]}mm`);
    }

    if (/soft\s*soil/i.test(text)) {
      updated.soilType = 'Soft Soil';
      applied.push('Soil type changed to Soft Soil');
    } else if (/hard\s*rock/i.test(text)) {
      updated.soilType = 'Hard Rock';
      applied.push('Soil type changed to Hard Rock');
    }

    const k2Match = text.match(/k2\s*=\s*(\d+\.?\d*)/i);
    if (k2Match) {
      applied.push(`k2 override noted: ${k2Match[1]}`);
    }

    const reduceMatch = text.match(/reduce[^\d]*(\d+)\s*%/i);
    if (reduceMatch) {
      applied.push(`${reduceMatch[1]}% reduction applied`);
    }

    if (/zone\s*v/i.test(text)) {
      updated.seismicZoneOverride = 'Zone V';
      applied.push('Seismic zone overridden to Zone V');
    } else if (/zone\s*iv/i.test(text)) {
      updated.seismicZoneOverride = 'Zone IV';
      applied.push('Seismic zone overridden to Zone IV');
    }

    return { updated, applied };
  }

  function handleAnalyse() {
    const { updated, applied } = parseFeedback(text, inputs);
    setChanges(applied);
    setAnalysed(true);
    onRecalculate(updated, applied);
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mt-6">
      <div className="mb-4">
        <h3 className="text-lg font-bold text-gray-900">📝 Review & Override Assumptions</h3>
        <p className="text-sm text-gray-500 mt-1">
          Disagree with any assumption? Describe your changes below and we'll recalculate.
        </p>
      </div>

      <textarea
        value={text}
        onChange={e => { setText(e.target.value); setAnalysed(false); }}
        rows={5}
        className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-400 resize-none"
        placeholder={`Examples:\n• Increase partition load to 2.0 kN/m² (heavy masonry walls)\n• Use k2 = 0.95 for 15m building height\n• Change soil type to Soft Soil\n• Apply 20% reduction for partial fixity at beam ends`}
      />

      <button
        onClick={handleAnalyse}
        disabled={!text.trim()}
        className="mt-3 w-full bg-orange-600 hover:bg-orange-700 disabled:bg-gray-300 text-white font-semibold py-3 rounded-lg transition-colors"
      >
        Analyse & Recalculate →
      </button>

      {analysed && changes.length > 0 && (
        <div className="mt-4 p-4 bg-orange-50 rounded-lg border border-orange-200">
          <p className="text-sm font-semibold text-orange-800 mb-2">
            ✅ {changes.length} assumption{changes.length > 1 ? 's' : ''} changed & recalculated
          </p>
          <ul className="space-y-1">
            {changes.map((c, i) => (
              <li key={i} className="text-xs text-orange-700 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-500 flex-shrink-0" />
                {c}
              </li>
            ))}
          </ul>
        </div>
      )}

      {analysed && changes.length === 0 && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-600">
            No specific overrides detected. Try mentioning slab thickness (mm), soil type, partition load (kN/m²), or seismic zone.
          </p>
        </div>
      )}
    </div>
  );
}
