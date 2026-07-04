import { useState, useEffect } from 'react';
import InputPanel from './InputPanel';
import ResultsPanel from './ResultsPanel';
import FeedbackBox from './FeedbackBox';
import { calcDeadLoad, calcLiveLoad, calcWindLoad, calcSeismicLoad, calcSnowLoad, calcBendingMoment, calcLoadCombinations } from './calcEngine';

const INITIAL_INPUTS = {
  projectName: '',
  city: 'Mumbai',
  customWindSpeed: 44,
  projectType: 'residential',
  structureType: 'Building',
  beamSpan: 5,
  numFloors: 3,
  floorHeight: 3,
  buildingLength: 15,
  buildingWidth: 10,
  slabThickness: 150,
  floorFinish: true,
  partitionLoad: true,
  includeCeiling: false,
  includeWaterproofing: false,
  supportCondition: 'Simply Supported',
  loadType: 'UDL',
  pointLoad: 50,
  occupancyType: 'residential',
  isRoof: false,
  roofAccessible: false,
  terrainCategory: 'Category 3 (Towns, suburbs, wooded areas)',
  topography: 'Flat (slope < 3°)',
  riskCoeff: 1.0,
  soilType: 'Medium Soil',
  structuralSystem: 'SMRF',
  seismicZoneOverride: '',
  naturalPeriod: 0.3,
  snowZone: 'No Snow',
  roofSlope: 0,
  buildingWeight: 3000,
};

function runCalc(inputs) {
  const dl = calcDeadLoad(inputs);
  const ll = calcLiveLoad(inputs);
  const wl = calcWindLoad(inputs);
  const sl = calcSeismicLoad(inputs);
  const snow = calcSnowLoad(inputs);

  const totalUDL = (dl.total + ll.total) * 1.5;
  const bm = calcBendingMoment({ ...inputs, totalUDL });

  const combos = calcLoadCombinations(dl.total, ll.total, wl.total, sl.Ah * 10, snow.total);

  return { dl, ll, wl, sl, snow, bm, combos };
}

export default function StructuralLoad() {
  const [inputs, setInputs] = useState(INITIAL_INPUTS);
  const [results, setResults] = useState(null);
  const [feedbackResults, setFeedbackResults] = useState(null);

  useEffect(() => {
    try {
      setResults(runCalc(inputs));
    } catch (e) {
      console.error('Calc error:', e);
    }
  }, [inputs]);

  function handleChange(key, value) {
    setInputs(prev => ({ ...prev, [key]: value }));
    setFeedbackResults(null);
  }

  function handleRecalculate(updatedInputs, changes) {
    try {
      const newResults = runCalc(updatedInputs);
      setFeedbackResults({ results: newResults, inputs: updatedInputs, changes });
    } catch (e) {
      console.error('Recalc error:', e);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-slate-900 to-orange-900 py-10 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-2">Structural Load Calculator</h1>
          <p className="text-orange-200 mb-4">IS 875 • IS 1893 • IS 456 — Dead, Live, Wind, Seismic & Snow</p>
          <div className="flex flex-wrap gap-2">
            {['📍 Location-aware', '🌦 Weather-adjusted', '🧮 IS Code referenced'].map(badge => (
              <span key={badge} className="px-3 py-1 rounded-full bg-white/10 text-white text-xs font-medium border border-white/20">
                {badge}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Main Layout */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* LEFT — Inputs */}
          <div className="lg:sticky lg:top-4 lg:self-start lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-2 h-6 rounded-full bg-orange-600 inline-block" />
                Project Inputs
              </h2>
              <InputPanel inputs={inputs} onChange={handleChange} />
            </div>
          </div>

          {/* RIGHT — Results */}
          <div>
            <ResultsPanel results={results} inputs={inputs} />

            {/* Feedback Box */}
            <FeedbackBox inputs={inputs} onRecalculate={handleRecalculate} />

            {/* Recalculated Results */}
            {feedbackResults && (
              <div className="mt-6 border-2 border-orange-400 rounded-xl overflow-hidden">
                <div className="bg-orange-600 px-5 py-3 flex items-center justify-between">
                  <span className="text-white font-bold">🔄 Recalculated Results</span>
                  <div className="flex gap-2">
                    {results && feedbackResults.results && (() => {
                      const dlDiff = feedbackResults.results.dl.total - results.dl.total;
                      const bmDiff = feedbackResults.results.bm.Mmax - results.bm.Mmax;
                      return (
                        <>
                          <span className={`text-xs px-2 py-1 rounded-full font-semibold ${dlDiff >= 0 ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                            DL: {dlDiff >= 0 ? '↑' : '↓'} {Math.abs(dlDiff).toFixed(3)} kN/m²
                          </span>
                          <span className={`text-xs px-2 py-1 rounded-full font-semibold ${bmDiff >= 0 ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                            BM: {bmDiff >= 0 ? '↑' : '↓'} {Math.abs(bmDiff).toFixed(2)} kN·m
                          </span>
                        </>
                      );
                    })()}
                  </div>
                </div>
                <div className="p-5 bg-orange-50">
                  <ResultsPanel results={feedbackResults.results} inputs={feedbackResults.inputs} />
                  <div className="mt-4 flex gap-3">
                    <button
                      onClick={() => { setInputs(feedbackResults.inputs); setFeedbackResults(null); }}
                      className="flex-1 bg-orange-600 text-white font-semibold py-2 rounded-lg hover:bg-orange-700 transition-colors"
                    >
                      ✅ Accept Changes
                    </button>
                    <button
                      onClick={() => setFeedbackResults(null)}
                      className="flex-1 bg-white text-gray-700 font-semibold py-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                    >
                      ✕ Discard
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
