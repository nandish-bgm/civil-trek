export const DEAD_LOAD_DEFAULTS = {
  rc_slab_150mm: 3.75,
  rc_slab_125mm: 3.125,
  rc_slab_100mm: 2.5,
  brick_wall_230mm: 4.6,
  brick_wall_115mm: 2.3,
  floor_finish: 1.0,
  false_ceiling: 0.25,
  waterproofing: 0.5,
  partition_load: 1.0,
};

export const LIVE_LOADS = {
  residential: 2.0,
  office: 3.0,
  retail: 4.0,
  assembly: 5.0,
  warehouse: 7.5,
  hospital: 3.0,
  school: 3.0,
  parking: 4.0,
  roof_accessible: 1.5,
  roof_non_accessible: 0.75,
};

export const WIND_ZONES = {
  'Jammu': 33, 'Srinagar': 33, 'Leh': 33,
  'Delhi': 47, 'Mumbai': 44, 'Bangalore': 33, 'Chennai': 50,
  'Kolkata': 50, 'Hyderabad': 44, 'Pune': 39, 'Ahmedabad': 44,
  'Jaipur': 47, 'Lucknow': 47, 'Patna': 47, 'Bhopal': 39,
  'Nagpur': 44, 'Surat': 44, 'Vadodara': 44, 'Indore': 39,
  'Bhubaneswar': 50, 'Visakhapatnam': 50, 'Kochi': 39,
  'Coimbatore': 39, 'Chandigarh': 47, 'Dehradun': 47,
  'Custom': null,
};

export const SEISMIC_ZONES = {
  'Zone II':  { factor: 0.10, description: 'Low seismic hazard' },
  'Zone III': { factor: 0.16, description: 'Moderate seismic hazard' },
  'Zone IV':  { factor: 0.24, description: 'High seismic hazard' },
  'Zone V':   { factor: 0.36, description: 'Very high seismic hazard (Himalayan belt)' },
};

export const CITY_SEISMIC_ZONE = {
  'Delhi': 'Zone IV', 'Mumbai': 'Zone III', 'Bangalore': 'Zone II',
  'Chennai': 'Zone III', 'Kolkata': 'Zone III', 'Hyderabad': 'Zone II',
  'Pune': 'Zone III', 'Ahmedabad': 'Zone III', 'Jaipur': 'Zone II',
  'Lucknow': 'Zone III', 'Patna': 'Zone IV', 'Bhopal': 'Zone II',
  'Nagpur': 'Zone II', 'Surat': 'Zone III', 'Vadodara': 'Zone III',
  'Bhubaneswar': 'Zone III', 'Visakhapatnam': 'Zone III', 'Kochi': 'Zone III',
  'Chandigarh': 'Zone IV', 'Dehradun': 'Zone IV',
  'Jammu': 'Zone IV', 'Srinagar': 'Zone V', 'Leh': 'Zone V',
  'Custom': 'Zone III',
};

export const IMPORTANCE_FACTOR = {
  residential: 1.0,
  office: 1.0,
  retail: 1.0,
  hospital: 1.5,
  school: 1.5,
  emergency: 1.5,
  warehouse: 1.0,
};

export const RESPONSE_REDUCTION = {
  'SMRF': 5,
  'OMRF': 3,
  'Shear Wall': 4,
  'Braced Frame': 4,
};

export const TERRAIN_K2 = {
  'Category 1 (Open sea, flat open)': 1.05,
  'Category 2 (Open terrain, scattered obstructions)': 1.00,
  'Category 3 (Towns, suburbs, wooded areas)': 0.91,
  'Category 4 (Large city centres)': 0.80,
};

export const TOPOGRAPHY_K3 = {
  'Flat (slope < 3°)': 1.00,
  'Upwind slope 3°–17°': 1.07,
  'Upwind slope > 17° (cliff/escarpment)': 1.12,
};

export const SNOW_LOAD_ZONES = {
  'No Snow': 0,
  'Light Snow (500–1000m altitude)': 0.5,
  'Moderate Snow (1000–2000m)': 1.5,
  'Heavy Snow (>2000m / Himalayan)': 3.0,
};

export const LOAD_FACTORS = {
  DL: 1.5, LL: 1.5, WL: 1.5, SL: 1.5,
  combo_DL_LL: { DL: 1.5, LL: 1.5 },
  combo_DL_WL: { DL: 0.9, WL: 1.5 },
  combo_DL_LL_WL: { DL: 1.2, LL: 1.2, WL: 1.2 },
  combo_DL_LL_EQ: { DL: 1.2, LL: 1.2, EQ: 1.2 },
};

export const STRUCTURAL_SYSTEMS = ['SMRF', 'OMRF', 'Shear Wall', 'Braced Frame'];
export const SOIL_TYPES = ['Hard Rock', 'Medium Soil', 'Soft Soil'];

export const SA_G_BY_SOIL = {
  'Hard Rock': 2.5,
  'Medium Soil': 2.5,
  'Soft Soil': 2.5,
};
