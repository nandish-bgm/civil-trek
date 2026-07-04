import { useState } from 'react';
import { WIND_ZONES, TERRAIN_K2, TOPOGRAPHY_K3, SNOW_LOAD_ZONES, STRUCTURAL_SYSTEMS, SOIL_TYPES, SEISMIC_ZONES, CITY_SEISMIC_ZONE } from './constants';

function Section({ title, color, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden mb-3">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors"
      >
        <span className="font-semibold text-gray-800 text-sm uppercase tracking-wide flex items-center gap-2">
          <span className="w-1 h-4 rounded-full" style={{ background: color }} />
          {title}
        </span>
        <span className="text-gray-400 text-xs">{open ? '▼' : '▶'}</span>
      </button>
      {open && <div className="p-4 space-y-3 bg-white">{children}</div>}
    </div>
  );
}

function Label({ children, hint }) {
  return (
    <div className="mb-1">
      <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">{children}</label>
      {hint && <p className="text-xs text-gray-400">{hint}</p>}
    </div>
  );
}

const inputCls = "w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400";
const selectCls = "w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white";

export default function InputPanel({ inputs, onChange }) {
  const cities = Object.keys(WIND_ZONES);
  const autoZone = CITY_SEISMIC_ZONE[inputs.city] || 'Zone III';

  return (
    <div className="space-y-1">

      <Section title="Project Info" color="#D85A30">
        <div>
          <Label>Project Name</Label>
          <input className={inputCls} placeholder="e.g. G+3 Residential Building" value={inputs.projectName} onChange={e => onChange('projectName', e.target.value)} />
        </div>
        <div>
          <Label>Structure Type</Label>
          <div className="flex flex-wrap gap-2">
            {['Building', 'Industrial Shed', 'Bridge', 'Water Tank'].map(t => (
              <button key={t} onClick={() => onChange('structureType', t)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${inputs.structureType === t ? 'bg-orange-600 text-white border-orange-600' : 'bg-white text-gray-600 border-gray-200 hover:border-orange-400'}`}>
                {t}
              </button>
            ))}
          </div>
        </div>
        <div>
          <Label>Occupancy Type</Label>
          <select className={selectCls} value={inputs.occupancyType} onChange={e => onChange('occupancyType', e.target.value)}>
            {['residential','office','retail','warehouse','hospital','school','parking'].map(o => (
              <option key={o} value={o}>{o.charAt(0).toUpperCase() + o.slice(1)}</option>
            ))}
          </select>
        </div>
        <div>
          <Label>City</Label>
          <select className={selectCls} value={inputs.city} onChange={e => onChange('city', e.target.value)}>
            {cities.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        {inputs.city === 'Custom' && (
          <div>
            <Label hint="m/s">Custom Wind Speed</Label>
            <input type="number" className={inputCls} value={inputs.customWindSpeed} onChange={e => onChange('customWindSpeed', parseFloat(e.target.value))} />
          </div>
        )}
      </Section>

      <Section title="Geometry" color="#6366f1" defaultOpen={true}>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label hint="metres">Beam Span (L)</Label>
            <input type="number" className={inputCls} value={inputs.beamSpan} onChange={e => onChange('beamSpan', parseFloat(e.target.value))} />
          </div>
          <div>
            <Label>No. of Floors</Label>
            <input type="number" min="1" max="20" className={inputCls} value={inputs.numFloors} onChange={e => onChange('numFloors', parseInt(e.target.value))} />
          </div>
          <div>
            <Label hint="metres">Floor Height</Label>
            <input type="number" className={inputCls} value={inputs.floorHeight} onChange={e => onChange('floorHeight', parseFloat(e.target.value))} />
          </div>
          <div>
            <Label hint="metres">Building Length</Label>
            <input type="number" className={inputCls} value={inputs.buildingLength} onChange={e => onChange('buildingLength', parseFloat(e.target.value))} />
          </div>
          <div>
            <Label hint="metres">Building Width</Label>
            <input type="number" className={inputCls} value={inputs.buildingWidth} onChange={e => onChange('buildingWidth', parseFloat(e.target.value))} />
          </div>
        </div>
        <div className="text-xs text-gray-500 bg-gray-50 rounded-lg px-3 py-2">
          Building Height = {(inputs.numFloors * inputs.floorHeight).toFixed(1)} m &nbsp;|&nbsp; Floor Area = {(inputs.buildingLength * inputs.buildingWidth).toFixed(1)} m²
        </div>
      </Section>

      <Section title="Dead Load" color="#6366f1">
        <div>
          <Label hint="mm (100–300)">Slab Thickness</Label>
          <div className="flex items-center gap-3">
            <input type="range" min="100" max="300" step="25" value={inputs.slabThickness}
              onChange={e => onChange('slabThickness', parseInt(e.target.value))}
              className="flex-1 accent-orange-600" />
            <span className="text-sm font-bold text-orange-600 w-16 text-right">{inputs.slabThickness} mm</span>
          </div>
        </div>
        <div className="space-y-2">
          {[
            { key: 'floorFinish', label: 'Floor Finish', val: '1.0 kN/m²' },
            { key: 'partitionLoad', label: 'Partition Load', val: '1.0 kN/m²' },
            { key: 'includeCeiling', label: 'False Ceiling', val: '0.25 kN/m²' },
            { key: 'includeWaterproofing', label: 'Waterproofing', val: '0.5 kN/m²' },
          ].map(({ key, label, val }) => (
            <label key={key} className="flex items-center justify-between cursor-pointer group">
              <span className="flex items-center gap-2">
                <input type="checkbox" checked={inputs[key]} onChange={e => onChange(key, e.target.checked)}
                  className="w-4 h-4 accent-orange-600" />
                <span className="text-sm text-gray-700">{label}</span>
              </span>
              <span className="text-xs text-gray-400">{val}</span>
            </label>
          ))}
        </div>
      </Section>

      <Section title="Live Load" color="#f59e0b">
        <div className="flex items-center gap-3 bg-amber-50 rounded-lg px-3 py-2 border border-amber-200">
          <span className="text-xs text-amber-700">Occupancy:</span>
          <span className="text-sm font-semibold text-amber-800 capitalize">{inputs.occupancyType}</span>
        </div>
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={inputs.isRoof} onChange={e => onChange('isRoof', e.target.checked)} className="w-4 h-4 accent-orange-600" />
          <span className="text-sm text-gray-700">This is a roof slab</span>
        </label>
        {inputs.isRoof && (
          <div className="flex gap-3 ml-6">
            {['Accessible', 'Non-accessible'].map(r => (
              <label key={r} className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="roofAccess" checked={inputs.roofAccessible === (r === 'Accessible')}
                  onChange={() => onChange('roofAccessible', r === 'Accessible')} className="accent-orange-600" />
                <span className="text-sm text-gray-600">{r}</span>
              </label>
            ))}
          </div>
        )}
      </Section>

      <Section title="Wind Load" color="#06b6d4">
        <div>
          <Label>Terrain Category</Label>
          <select className={selectCls} value={inputs.terrainCategory} onChange={e => onChange('terrainCategory', e.target.value)}>
            {Object.keys(TERRAIN_K2).map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div>
          <Label>Topography</Label>
          <select className={selectCls} value={inputs.topography} onChange={e => onChange('topography', e.target.value)}>
            {Object.keys(TOPOGRAPHY_K3).map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div>
          <Label hint="k1: 0.8 (5yr) to 1.08 (100yr), default 1.0 = 50yr return">Risk Coefficient (k1)</Label>
          <input type="number" step="0.01" min="0.8" max="1.08" className={inputCls} value={inputs.riskCoeff} onChange={e => onChange('riskCoeff', parseFloat(e.target.value))} />
        </div>
        <div className="text-xs text-gray-500 bg-gray-50 rounded-lg px-3 py-2">
          Building Height = {(inputs.numFloors * inputs.floorHeight).toFixed(1)} m (auto from geometry)
        </div>
        {(inputs.city === 'Chennai' || inputs.city === 'Bhubaneswar' || inputs.city === 'Kolkata') && (
          <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
            <span className="text-red-600">⚠</span>
            <span className="text-xs text-red-700">{inputs.city}: Cyclone zone — Vb = {WIND_ZONES[inputs.city]} m/s. Higher wind loads apply.</span>
          </div>
        )}
      </Section>

      <Section title="Seismic" color="#ef4444">
        <div className="flex items-center gap-3 bg-red-50 rounded-lg px-3 py-2 border border-red-200">
          <span className="text-xs text-red-700">Auto-detected zone:</span>
          <span className="text-sm font-bold text-red-800">{autoZone}</span>
        </div>
        <div>
          <Label>Override Seismic Zone</Label>
          <select className={selectCls} value={inputs.seismicZoneOverride} onChange={e => onChange('seismicZoneOverride', e.target.value)}>
            <option value="">Auto (from city)</option>
            {Object.keys(SEISMIC_ZONES).map(z => <option key={z} value={z}>{z} — Z={SEISMIC_ZONES[z].factor}</option>)}
          </select>
        </div>
        <div>
          <Label>Soil Type</Label>
          <select className={selectCls} value={inputs.soilType} onChange={e => onChange('soilType', e.target.value)}>
            {SOIL_TYPES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <Label>Structural System</Label>
          <select className={selectCls} value={inputs.structuralSystem} onChange={e => onChange('structuralSystem', e.target.value)}>
            {STRUCTURAL_SYSTEMS.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <Label hint="kN — auto-estimated, you can edit">Building Self-Weight (W)</Label>
          <input type="number" className={inputCls} value={inputs.buildingWeight} onChange={e => onChange('buildingWeight', parseFloat(e.target.value))} />
        </div>
      </Section>

      <Section title="Snow & Weather" color="#8b5cf6">
        <div>
          <Label>Snow Zone</Label>
          <select className={selectCls} value={inputs.snowZone} onChange={e => onChange('snowZone', e.target.value)}>
            {Object.keys(SNOW_LOAD_ZONES).map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <Label hint="degrees (0–60)">Roof Slope</Label>
          <input type="number" min="0" max="60" className={inputCls} value={inputs.roofSlope} onChange={e => onChange('roofSlope', parseFloat(e.target.value))} />
        </div>
      </Section>

      <Section title="Beam Analysis" color="#10b981">
        <div>
          <Label>Support Condition</Label>
          <select className={selectCls} value={inputs.supportCondition} onChange={e => onChange('supportCondition', e.target.value)}>
            {['Simply Supported', 'Cantilever', 'Fixed Both', 'Fixed-Pinned'].map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <Label>Load Type</Label>
          <select className={selectCls} value={inputs.loadType} onChange={e => onChange('loadType', e.target.value)}>
            {['UDL', 'PointLoad', 'Combined'].map(l => <option key={l} value={l}>{l}</option>)}
          </select>
        </div>
        {inputs.loadType === 'PointLoad' && (
          <div>
            <Label hint="kN">Point Load at Centre</Label>
            <input type="number" className={inputCls} value={inputs.pointLoad} onChange={e => onChange('pointLoad', parseFloat(e.target.value))} />
          </div>
        )}
      </Section>

    </div>
  );
}
