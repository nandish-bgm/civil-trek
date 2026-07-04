// Highway design reference data (IRC) — educational reference.

export const ROAD_CLASSES = [
  { id: 'nh', name: 'National / State Highway', ref: 'IRC:73, IRC:SP:73',
    designSpeed: '80–100 km/h (plain), 40–60 (hilly)', laneWidth: '3.5 m',
    carriageway: '7.0 m (2-lane), 14.0 m (4-lane divided)', shoulder: '1.5–2.5 m paved + earthen',
    notes: 'Highest geometric standards; access control on expressways.' },
  { id: 'mdr', name: 'Major District Road (MDR)', ref: 'IRC:73',
    designSpeed: '50–80 km/h (plain)', laneWidth: '3.5 m', carriageway: '7.0 m (2-lane)',
    shoulder: '1.0–2.5 m', notes: 'Connects district HQs and production areas to highways.' },
  { id: 'odr', name: 'Other District Road (ODR)', ref: 'IRC:73',
    designSpeed: '35–65 km/h', laneWidth: '3.75 m (single) / 3.5 m',
    carriageway: '3.75 m (single-lane), 7.0 m (2-lane)', shoulder: '0.9–2.0 m',
    notes: 'Serves rural areas, connects to MDR/village roads.' },
  { id: 'vr', name: 'Village Road', ref: 'IRC:SP:20',
    designSpeed: '25–50 km/h', laneWidth: '3.0–3.75 m', carriageway: '3.0–3.75 m (single-lane)',
    shoulder: '0.5–1.5 m', notes: 'Rural connectivity (PMGSY); often single-lane.' },
];

export const CAMBER = [
  { surface: 'Cement concrete / bituminous (high type)', value: '1.7–2.0 %  (1 in 60 to 1 in 50)' },
  { surface: 'Thin bituminous surface', value: '2.0–2.5 %  (1 in 50 to 1 in 40)' },
  { surface: 'Water-bound macadam / gravel', value: '2.5–3.0 %  (1 in 40 to 1 in 33)' },
  { surface: 'Earth road', value: '3.0–4.0 %  (1 in 33 to 1 in 25)' },
];

export const GRADIENTS = [
  { terrain: 'Plain / rolling', ruling: '3.3 % (1 in 30)', limiting: '5.0 % (1 in 20)', exceptional: '6.7 % (1 in 15)' },
  { terrain: 'Mountainous (>3000 m)', ruling: '5.0 % (1 in 20)', limiting: '6.0 % (1 in 16.7)', exceptional: '7.0 % (1 in 14.3)' },
  { terrain: 'Steep (>3000 m)', ruling: '6.0 % (1 in 16.7)', limiting: '7.0 % (1 in 14.3)', exceptional: '8.0 % (1 in 12.5)' },
];

export const CROSS_SECTION = [
  { key: 'median', label: 'Median / Central verge', desc: 'Separates opposing traffic on divided highways (min 1.5 m, desirable 5 m).' },
  { key: 'carriageway', label: 'Carriageway (lanes)', desc: 'The paved travel surface. Standard lane width 3.5 m.' },
  { key: 'shoulder', label: 'Shoulder', desc: 'Lateral support + emergency stopping. Paved and/or earthen.' },
  { key: 'camber', label: 'Camber / cross-slope', desc: 'Transverse slope for surface drainage, from crown to edge.' },
  { key: 'drain', label: 'Side drain', desc: 'Longitudinal drainage channel at the toe of the embankment/cut.' },
  { key: 'row', label: 'Right of Way (RoW)', desc: 'Total land width acquired for the road and its future widening.' },
];

export const SUPERELEVATION = {
  max: '7 % (plain/rolling), 10 % (hilly, snow-free)',
  formula: 'e + f = V² / (127 R)',
  note: 'e = superelevation, f = lateral friction (≈0.15), V in km/h, R in m.',
};
