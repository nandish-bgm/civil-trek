import {
  DEAD_LOAD_DEFAULTS, LIVE_LOADS, WIND_ZONES, SEISMIC_ZONES,
  CITY_SEISMIC_ZONE, IMPORTANCE_FACTOR, RESPONSE_REDUCTION,
  TERRAIN_K2, TOPOGRAPHY_K3, SNOW_LOAD_ZONES, SA_G_BY_SOIL
} from './constants';

export function calcDeadLoad(inputs) {
  const slabSelfWeight = 25 * (inputs.slabThickness / 1000);
  const floorFinish = inputs.floorFinish ? DEAD_LOAD_DEFAULTS.floor_finish : 0;
  const partition = inputs.partitionLoad ? DEAD_LOAD_DEFAULTS.partition_load : 0;
  const ceiling = inputs.includeCeiling ? DEAD_LOAD_DEFAULTS.false_ceiling : 0;
  const waterproof = inputs.includeWaterproofing ? DEAD_LOAD_DEFAULTS.waterproofing : 0;
  const total = slabSelfWeight + floorFinish + partition + ceiling + waterproof;
  return {
    total,
    components: [
      { name: 'Slab Self Weight', formula: `25 kN/m³ × ${inputs.slabThickness}mm / 1000`, value: slabSelfWeight, unit: 'kN/m²', ref: 'IS 875 Part 1, Table 1' },
      { name: 'Floor Finish', formula: 'Standard screed 50mm', value: floorFinish, unit: 'kN/m²', ref: 'IS 875 Part 1, Cl. 3.1' },
      { name: 'Partition (equiv. UDL)', formula: 'Fixed allowance per IS 875', value: partition, unit: 'kN/m²', ref: 'IS 875 Part 1, Cl. 3.3' },
      { name: 'False Ceiling', formula: 'Light suspended ceiling', value: ceiling, unit: 'kN/m²', ref: 'IS 875 Part 1, Table 2' },
      { name: 'Waterproofing', formula: '50mm avg screed + membrane', value: waterproof, unit: 'kN/m²', ref: 'IS 875 Part 1' },
    ],
    steps: [
      `Slab self-weight = 25 kN/m³ × ${inputs.slabThickness}/1000 m = ${slabSelfWeight.toFixed(3)} kN/m²`,
      `Floor finish = ${floorFinish} kN/m² (IS 875 Part 1, standard screed allowance)`,
      `Partition equivalent UDL = ${partition} kN/m² (IS 875 Part 1, Cl. 3.3)`,
      `False ceiling = ${ceiling} kN/m²`,
      `Waterproofing layer = ${waterproof} kN/m²`,
      `Total Dead Load (DL) = ${slabSelfWeight.toFixed(3)} + ${floorFinish} + ${partition} + ${ceiling} + ${waterproof} = ${total.toFixed(3)} kN/m²`,
    ]
  };
}

export function calcLiveLoad(inputs) {
  const ll = inputs.isRoof
    ? (inputs.roofAccessible ? LIVE_LOADS.roof_accessible : LIVE_LOADS.roof_non_accessible)
    : (LIVE_LOADS[inputs.occupancyType] || 2.0);
  return {
    total: ll,
    steps: [
      `Occupancy type: ${inputs.occupancyType}`,
      `Live load from IS 875 Part 2 Table 1 = ${ll} kN/m²`,
      `No reduction applied (span < 40m, standard case)`,
    ]
  };
}

export function calcWindLoad(inputs) {
  const Vb = inputs.city === 'Custom' ? inputs.customWindSpeed : (WIND_ZONES[inputs.city] || 44);
  const k1 = inputs.riskCoeff || 1.0;
  const k2 = TERRAIN_K2[inputs.terrainCategory] || 1.0;
  const k3 = TOPOGRAPHY_K3[inputs.topography] || 1.0;
  const Vz = Vb * k1 * k2 * k3;
  const pz = 0.6 * Vz * Vz / 1000;
  const Cpe = 1.2;
  const Cpi = 0.2;
  const Cp = Cpe + Cpi;
  const windLoad = Cp * pz;
  return {
    Vb, k1, k2, k3, Vz, pz, Cp, total: windLoad,
    steps: [
      `Basic Wind Speed (Vb) = ${Vb} m/s for ${inputs.city} (IS 875 Part 3, Annex A)`,
      `Risk Coefficient k1 = ${k1} (50-year return period, IS 875 Part 3, Table 1)`,
      `Terrain/Height Factor k2 = ${k2} (${inputs.terrainCategory}, IS 875 Part 3, Table 2)`,
      `Topography Factor k3 = ${k3} (${inputs.topography}, IS 875 Part 3, Cl. 5.3.3)`,
      `Design Wind Speed Vz = Vb × k1 × k2 × k3 = ${Vb} × ${k1} × ${k2} × ${k3} = ${Vz.toFixed(2)} m/s`,
      `Design Wind Pressure pz = 0.6 × Vz² / 1000 = 0.6 × ${Vz.toFixed(2)}² / 1000 = ${pz.toFixed(3)} kN/m²`,
      `Net Pressure Coefficient Cp = Cpe + Cpi = ${Cpe} + ${Cpi} = ${Cp} (IS 875 Part 3, Table 4)`,
      `Wind Load = Cp × pz = ${Cp} × ${pz.toFixed(3)} = ${windLoad.toFixed(3)} kN/m²`,
    ]
  };
}

export function calcSeismicLoad(inputs) {
  const zone = inputs.seismicZoneOverride || CITY_SEISMIC_ZONE[inputs.city] || 'Zone III';
  const Z = SEISMIC_ZONES[zone].factor;
  const I = IMPORTANCE_FACTOR[inputs.occupancyType] || 1.0;
  const R = RESPONSE_REDUCTION[inputs.structuralSystem] || 5;
  const SaG = SA_G_BY_SOIL[inputs.soilType] || 2.5;
  const Ah = (Z / 2) * SaG / (R / I);
  const VB = Ah * inputs.buildingWeight;
  return {
    zone, Z, I, R, SaG, Ah, VB, total: Ah,
    steps: [
      `Seismic Zone: ${zone} → Zone Factor Z = ${Z} (IS 1893 Table 3)`,
      `Importance Factor I = ${I} for ${inputs.occupancyType} (IS 1893 Table 6)`,
      `Response Reduction Factor R = ${R} for ${inputs.structuralSystem} (IS 1893 Table 7)`,
      `Soil Type: ${inputs.soilType} → Average Sa/g = ${SaG} (IS 1893 Figure 2)`,
      `Ah = (Z/2) × (Sa/g) / (R/I)`,
      `Ah = (${Z}/2) × ${SaG} / (${R}/${I}) = ${(Z/2).toFixed(3)} × ${SaG} / ${(R/I).toFixed(2)} = ${Ah.toFixed(4)}`,
      `Base Shear VB = Ah × W = ${Ah.toFixed(4)} × ${inputs.buildingWeight} kN = ${VB.toFixed(2)} kN`,
    ]
  };
}

export function calcSnowLoad(inputs) {
  const s0 = SNOW_LOAD_ZONES[inputs.snowZone] || 0;
  const mu = inputs.roofSlope <= 30 ? 0.8 : Math.max(0, 0.8 - (inputs.roofSlope - 30) * 0.02);
  const s = mu * s0;
  return {
    total: s,
    steps: [
      `Snow Zone: ${inputs.snowZone} → Ground Snow Load s0 = ${s0} kN/m²`,
      `Roof slope = ${inputs.roofSlope}°`,
      `Shape coefficient μ = ${mu.toFixed(2)} (IS 875 Part 4, Cl. 4.3)`,
      `Design Snow Load s = μ × s0 = ${mu.toFixed(2)} × ${s0} = ${s.toFixed(3)} kN/m²`,
    ]
  };
}

export function calcBendingMoment(inputs) {
  const L = inputs.beamSpan;
  const w = inputs.totalUDL;
  let Mmax = 0, Vmax = 0, steps = [];

  if (inputs.supportCondition === 'Simply Supported') {
    if (inputs.loadType === 'PointLoad') {
      const P = inputs.pointLoad;
      Mmax = (P * L) / 4;
      Vmax = P / 2;
      steps = [
        `Beam: Simply supported, span L = ${L} m`,
        `Central Point Load P = ${P} kN (factored)`,
        `Mmax = PL/4 = ${P} × ${L} / 4 = ${Mmax.toFixed(3)} kN·m`,
        `Vmax = P/2 = ${P} / 2 = ${Vmax.toFixed(3)} kN`,
      ];
    } else {
      Mmax = (w * L * L) / 8;
      Vmax = (w * L) / 2;
      steps = [
        `Beam: Simply supported, span L = ${L} m`,
        `Total UDL w = ${w.toFixed(3)} kN/m (factored)`,
        `Mmax = wL²/8 = ${w.toFixed(3)} × ${L}² / 8 = ${Mmax.toFixed(3)} kN·m`,
        `Vmax = wL/2 = ${w.toFixed(3)} × ${L} / 2 = ${Vmax.toFixed(3)} kN`,
        `Point of zero shear = L/2 = ${(L/2).toFixed(2)} m from support`,
        `Reference: IS 456:2000 Annex D`,
      ];
    }
  } else if (inputs.supportCondition === 'Cantilever') {
    Mmax = (w * L * L) / 2;
    Vmax = w * L;
    steps = [
      `Beam: Cantilever, span L = ${L} m`,
      `UDL w = ${w.toFixed(3)} kN/m (factored)`,
      `Mmax = wL²/2 = ${w.toFixed(3)} × ${L}² / 2 = ${Mmax.toFixed(3)} kN·m`,
      `Vmax = wL = ${w.toFixed(3)} × ${L} = ${Vmax.toFixed(3)} kN`,
      `Reference: IS 456:2000 Annex D`,
    ];
  } else if (inputs.supportCondition === 'Fixed Both') {
    Mmax = (w * L * L) / 12;
    const Mmid = (w * L * L) / 24;
    Vmax = (w * L) / 2;
    steps = [
      `Beam: Fixed at both ends, span L = ${L} m`,
      `UDL w = ${w.toFixed(3)} kN/m (factored)`,
      `Fixed-End Moment = wL²/12 = ${w.toFixed(3)} × ${L}² / 12 = ${Mmax.toFixed(3)} kN·m`,
      `Midspan Moment = wL²/24 = ${w.toFixed(3)} × ${L}² / 24 = ${Mmid.toFixed(3)} kN·m`,
      `Maximum Shear = wL/2 = ${Vmax.toFixed(3)} kN`,
      `Reference: IS 456:2000 Annex D`,
    ];
  } else if (inputs.supportCondition === 'Fixed-Pinned') {
    Mmax = (w * L * L) / 8;
    Vmax = (5 * w * L) / 8;
    steps = [
      `Beam: Fixed-pinned (propped cantilever), span L = ${L} m`,
      `UDL w = ${w.toFixed(3)} kN/m (factored)`,
      `Fixed-End Moment = wL²/8 = ${w.toFixed(3)} × ${L}² / 8 = ${Mmax.toFixed(3)} kN·m`,
      `Max Shear at fixed end = 5wL/8 = ${Vmax.toFixed(3)} kN`,
    ];
  }
  return { Mmax, Vmax, steps };
}

export function calcLoadCombinations(DL, LL, WL, EQ, SL) {
  return [
    { label: '1.5 DL + 1.5 LL', value: 1.5 * DL + 1.5 * LL, code: 'IS 456 Table 18, Case 1' },
    { label: '1.5 DL + 1.5 WL', value: 1.5 * DL + 1.5 * WL, code: 'IS 456 Table 18, Case 3' },
    { label: '0.9 DL + 1.5 WL', value: 0.9 * DL + 1.5 * WL, code: 'IS 456 Table 18, uplift check' },
    { label: '1.2 DL + 1.2 LL + 1.2 WL', value: 1.2 * (DL + LL + WL), code: 'IS 456 Table 18, Case 4' },
    { label: '1.2 DL + 1.2 LL + 1.2 EQ', value: 1.2 * (DL + LL + EQ), code: 'IS 1893 Cl. 6.3.1.2' },
    { label: '1.5 DL + 1.5 EQ', value: 1.5 * DL + 1.5 * EQ, code: 'IS 1893, seismic dominant' },
    { label: '1.5 DL + 1.5 SL', value: 1.5 * DL + 1.5 * SL, code: 'IS 875 Part 4, snow case' },
  ];
}
