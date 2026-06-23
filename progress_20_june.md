# BuildCalc — Project Progress
**Date:** 20 June 2026  
**Version:** 2.0 — Enhanced Indian Standard Calculator

---

## 🏗️ Project Overview

**BuildCalc** is a multi-tool civil engineering web platform. Phase 1 delivers a fully functional Construction Material Cost Calculator for the Indian market, INR-only, following IS code standards with detailed material breakdowns.

**Live URL (after deploy):** `https://your-project-name.vercel.app`  
**Supabase Project ID:** `mexjrnaiumwdlqxeziil`  
**Supabase URL:** `https://mexjrnaiumwdlqxeziil.supabase.co`

---

## ✅ Phase 1 — Complete (Enhanced)

### What's Built

| Feature | Status |
|---|---|
| Material Cost Calculator (IS code based) | ✅ Done |
| Currency: INR only | ✅ Done |
| Live recalculation (no submit button) | ✅ Done |
| 4 project types: slab, wall, foundation, column | ✅ Done |
| 3 concrete grades: M15, M20, M25 | ✅ Done |
| Concrete mix ratios (cement:sand:aggregate) | ✅ Done |
| Coarse aggregate quantity auto-calculated | ✅ Done |
| Fine aggregate (sand) quantity auto-calculated | ✅ Done |
| Cement bags auto-calculated | ✅ Done |
| Steel rebar with standard dia: 8/10/12/16/20mm | ✅ Done |
| Brick dimensions: Standard IS 190×90×90mm | ✅ Done |
| Mortar ratio for brickwork (1:6 IS standard) | ✅ Done |
| Door sizes (IS standard) with deduction from wall | ✅ Done |
| Window sizes (IS standard) with deduction from wall | ✅ Done |
| Floor tiles quantity + wastage calculation | ✅ Done |
| Supabase auth (sign up / sign in / sign out) | ✅ Done |
| Save / load / delete projects (Dashboard) | ✅ Done |
| PDF export via jsPDF | ✅ Done |
| Copy estimate to clipboard | ✅ Done |
| Mobile responsive layout | ✅ Done |
| Home page with hero + features section | ✅ Done |

---

## 🧰 Tech Stack

| Layer | Choice |
|---|---|
| Frontend | React 19 + Vite 8 |
| Styling | Tailwind CSS v4 |
| Routing | React Router v7 |
| Auth + Database | Supabase |
| PDF Export | jsPDF v4 |
| Hosting | Vercel |

---

## 📁 File Structure

```
civil-eng/
├── .env.local                          # Supabase keys (gitignored)
├── .gitignore
├── index.html
├── vite.config.js
├── package.json
├── supabase/
│   └── schema.sql                      # DB schema + RLS policies
└── src/
    ├── main.jsx
    ├── App.jsx                         # Router + AuthProvider wrapper
    ├── index.css                       # Tailwind import
    ├── components/
    │   ├── Calculator.jsx              # Main calculator component
    │   ├── CostSummary.jsx             # Results panel
    │   ├── MaterialCard.jsx            # Per-material breakdown card
    │   ├── OpeningsSection.jsx         # Doors + windows inputs
    │   ├── TilesSection.jsx            # Floor tile inputs
    │   ├── Navbar.jsx                  # Nav with auth state
    │   └── AuthModal.jsx               # Sign in / sign up modal
    ├── pages/
    │   ├── Home.jsx                    # Landing page
    │   ├── CalculatorPage.jsx          # /calculator route
    │   └── Dashboard.jsx              # /dashboard route (auth-protected)
    ├── data/
    │   └── materials.js               # IS-code constants, prices, mix ratios
    ├── utils/
    │   ├── calculations.js            # Pure IS-code calculation functions
    │   └── pdfExport.js               # jsPDF export logic
    ├── hooks/
    │   ├── useAuth.jsx                # Supabase auth context + hook
    │   └── useProjects.js             # save / get / delete projects
    └── lib/
        └── supabase.js                # Supabase client init
```

---

## 📐 Indian Standard Code References

| Topic | Code Used | Clause / Table |
|---|---|---|
| Concrete mix design proportions | **IS 10262:2019** | Table 5 — Approximate water content & mix ratio |
| Concrete dry volume factor | **IS 10262:2019** | Clause 7 — 1.54 dry volume multiplier |
| Cement bag weight | **IS 1489:1991** | 50 kg per bag |
| Brick dimensions (standard) | **IS 1077:1992** | 190×90×90 mm nominal, 190×90×90 with 10mm mortar |
| Brickwork mortar ratio | **IS 2212:1991** | 1:6 (cement:sand) for general masonry |
| Bricks per m² | **IS 2212:1991** | 50 bricks per m² for 190×90×90 (one brick thick wall) |
| Steel rebar standard diameters | **IS 1786:2008** | 8, 10, 12, 16, 20, 25, 32 mm |
| Reinforcement ratio limits | **IS 456:2000** | Clause 26.5 — min 0.85/fy, max 4% of Ag |
| Steel density | **IS 1786:2008** | 7850 kg/m³ |
| Door standard sizes | **IS 4021:1995** | See table below |
| Window standard sizes | **IS 1003:1991** | See table below |
| Floor tile coverage | **IS 13630:2006** | Area-based, 5% wastage standard |
| Concrete grade designation | **IS 456:2000** | Table 2 — M15, M20, M25, M30 |
| Coarse aggregate size | **IS 383:2016** | 20mm nominal max size (standard for slabs/beams) |

> ⚠️ **Non-IS fallback used for:**  
> Tile grout/adhesive quantities use **ANSI A108/A118** since IS 13630 does not specify adhesive coverage rates. This is noted in PDF exports.

---

## 🔢 Complete Calculation Logic (IS Code Based)

### 1. Concrete (IS 10262:2019 + IS 456:2000)

#### Mix Ratios by Grade
| Grade | Designation | Cement:FA:CA | Water-Cement Ratio |
|---|---|---|---|
| M15 | Standard | 1 : 2 : 4 | 0.60 |
| M20 | Medium | 1 : 1.5 : 3 | 0.55 |
| M25 | Premium | 1 : 1 : 2 | 0.50 |

#### Formula
```
wetVolume     = length × width × thickness
dryVolume     = wetVolume × 1.54          // IS 10262:2019 — bulking + shrinkage factor
wasteFactor   = 1.02                       // 2% formwork + handling waste

totalDryVol   = dryVolume × wasteFactor

// For M20 (1:1.5:3), sum of parts = 1+1.5+3 = 5.5
cementVolume  = totalDryVol × (1 / 5.5)
sandVolume    = totalDryVol × (1.5 / 5.5)
aggregateVol  = totalDryVol × (3 / 5.5)

// Cement: density = 1440 kg/m³, bag = 50 kg
cementBags    = ceil((cementVolume × 1440) / 50)

// Fine Aggregate (Sand): density = 1600 kg/m³
sandKg        = sandVolume × 1600
sandTonnes    = sandKg / 1000

// Coarse Aggregate: density = 1550 kg/m³ (20mm nominal, IS 383:2016)
aggregateKg   = aggregateVol × 1550
aggregateTonnes = aggregateKg / 1000

// Cost (INR)
cementCost    = cementBags × pricePerBag       // ₹380/bag (50kg, OPC 53 grade)
sandCost      = sandTonnes × pricePerTonne     // ₹1200/tonne
aggregateCost = aggregateTonnes × pricePerTonne // ₹1400/tonne (20mm CA)
```

---

### 2. Steel Rebar (IS 1786:2008 + IS 456:2000)

#### Reinforcement % by Project Type (IS 456:2000 Cl.26.5)
| Project Type | Min Steel % | Design % Used | Max Allowed |
|---|---|---|---|
| Floor Slab | 0.12% (temp) | 0.80% | 4.00% |
| Column | 0.80% | 2.50% | 6.00% |
| Foundation | 0.12% | 0.80% | 4.00% |
| Beam/Wall | 0.85/fy | 1.00% | 4.00% |

#### Standard Bar Diameters (IS 1786:2008)
```
Available: 8mm, 10mm, 12mm, 16mm, 20mm, 25mm, 32mm

Unit weight (kg/m) = D² / 162
  8mm  → 0.395 kg/m
  10mm → 0.617 kg/m
  12mm → 0.888 kg/m
  16mm → 1.578 kg/m
  20mm → 2.469 kg/m
```

#### Formula
```
steelVolume   = concreteVolume × (reinPct / 100)
steelWeight   = steelVolume × 7850             // density kg/m³ (IS 1786)
wasteFactor   = 1.05                           // 5% for laps, cuts, bends
totalSteelKg  = steelWeight × wasteFactor
totalSteelTon = totalSteelKg / 1000

// Cost (INR)
steelCost     = totalSteelKg × pricePerKg      // ₹65/kg (Fe 500 TMT bars)
```

---

### 3. Bricks + Mortar (IS 1077:1992 + IS 2212:1991)

#### Brick Dimensions (IS 1077:1992)
| Type | Nominal Size (with mortar) | Actual Size |
|---|---|---|
| Standard Modular | 200×100×100 mm | 190×90×90 mm |
| Non-modular (old) | 230×115×75 mm | 220×105×65 mm |

**Default used: IS 1077 Standard Modular 190×90×90 mm**

#### Bricks per m² (IS 2212:1991)
```
For 190×90×90mm brick with 10mm mortar joint:
  One brick thick wall (230mm) → 50 bricks/m² of wall face
  Half brick wall (115mm)      → 50 bricks/m² of wall face
  (same face count, different depth = different volume)
```

#### Net Wall Area (after deducting openings)
```
grossWallArea = length × height
doorArea      = Σ(doorWidth × doorHeight) for each door
windowArea    = Σ(windowWidth × windowHeight) for each window
netWallArea   = grossWallArea - doorArea - windowArea

bricksNeeded  = ceil(netWallArea × 50 × 1.10)   // 10% waste (IS 2212)
```

#### Mortar for Brickwork (IS 2212:1991 — 1:6 mix)
```
mortarVolume    = netWallArea × wallThickness × 0.30   // 30% of wall volume is mortar joints
dryMortarVol    = mortarVolume × 1.33                  // 33% dry bulking

// 1:6 mix (cement:sand), parts = 7
cementInMortar  = dryMortarVol × (1/7)
sandInMortar    = dryMortarVol × (6/7)

mortarCementBags = ceil((cementInMortar × 1440) / 50)
mortarSandCft    = sandInMortar × 35.31                // convert m³ to CFT
```

---

### 4. Doors (IS 4021:1995)

#### Standard Door Sizes (IS 4021:1995)
| Type | Width × Height | Common Use |
|---|---|---|
| Single Leaf — Small | 0.75m × 2.00m | Bathroom / WC |
| Single Leaf — Standard | 0.90m × 2.10m | Bedroom / typical |
| Single Leaf — Large | 1.00m × 2.10m | Main door |
| Double Leaf | 1.20m × 2.10m | Hall / drawing room |
| Double Leaf — Wide | 1.50m × 2.10m | Entrance / garage |

```
// User selects count of each type OR enters custom W×H
doorTotalArea = Σ(width × height × count) for all door types
// This area is DEDUCTED from gross wall area before brick calculation
```

---

### 5. Windows (IS 1003:1991)

#### Standard Window Sizes (IS 1003:1991)
| Type | Width × Height | Common Use |
|---|---|---|
| Small | 0.60m × 0.90m | Bathroom / toilet |
| Standard | 0.90m × 1.20m | Bedroom |
| Medium | 1.20m × 1.20m | Living room |
| Large | 1.50m × 1.50m | Drawing room / hall |
| Sliding — Wide | 1.80m × 1.50m | Balcony / large room |

```
windowTotalArea = Σ(width × height × count) for all window types
// Deducted from gross wall area before brick calculation
```

---

### 6. Floor Tiles (IS 13630:2006)

#### Standard Tile Sizes Available
| Size | Common Use |
|---|---|
| 300×300 mm | Bathroom / small rooms |
| 300×600 mm | Bedroom / corridor |
| 600×600 mm | Living room / hall (most common) |
| 800×800 mm | Large hall / lobby |
| 600×1200 mm | Premium / modern |

#### Formula (IS 13630:2006 with 5% standard wastage)
```
roomArea         = length × width
wasteFactor      = 1.05                        // 5% per IS 13630
tilesAreaNeeded  = roomArea × wasteFactor
tilesPerBox      = (boxCoverage in m²)         // user inputs or default by size

tileSize_m²      = tileW × tileH              // e.g. 0.6 × 0.6 = 0.36 m²
tilesCount       = ceil(tilesAreaNeeded / tileSize_m²)
boxesNeeded      = ceil(tilesAreaNeeded / boxCoverage)

// Grout (approx, based on ANSI A108 — IS does not specify)
// ⚠️ NOTE: Grout quantity uses ANSI A108 reference, not IS code
groutKg          = tilesAreaNeeded × 0.5      // ~0.5 kg/m² for 2–3mm joints
adhesiveKg       = tilesAreaNeeded × 4.5      // ~4.5 kg/m² tile adhesive

// Cost (INR)
tileCost         = tilesAreaNeeded × pricePerM2   // user enters price/m²
groutCost        = groutKg × 45               // ₹45/kg approx
adhesiveCost     = adhesiveKg × 35            // ₹35/kg approx
```

---

## 💰 INR Base Prices (Market Reference 2024)

| Material | Unit | Price (INR) | Notes |
|---|---|---|---|
| Cement OPC 53 | per 50kg bag | ₹380 | IS 12269:2013 |
| River Sand (Fine Agg.) | per tonne | ₹1,200 | Zone II sand |
| Coarse Aggregate 20mm | per tonne | ₹1,400 | IS 383:2016 |
| Steel Fe500 TMT | per kg | ₹65 | IS 1786:2008 |
| Standard Brick IS | per 1000 bricks | ₹8,000 | IS 1077:1992 |
| Tiles (basic) | per m² | ₹350 | User overrideable |
| Tiles (premium) | per m² | ₹900 | User overrideable |
| Tile Adhesive | per kg | ₹35 | ANSI reference |
| Tile Grout | per kg | ₹45 | ANSI reference |

> All prices are editable by user in the calculator.

---

## 🗄️ Updated Supabase Schema

```sql
create table projects (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid references auth.users(id) on delete cascade,
  name          text not null,
  project_type  text,
  
  -- Dimensions
  dimensions    jsonb,
  -- {
  --   length: number, width: number, thickness: number,
  --   wallHeight: number
  -- }

  -- Concrete
  concrete_grade  text,   -- 'M15' | 'M20' | 'M25'
  
  -- Openings
  doors         jsonb,
  -- [{ type: 'standard', width: 0.9, height: 2.1, count: 2 }, ...]
  
  windows       jsonb,
  -- [{ type: 'medium', width: 1.2, height: 1.2, count: 3 }, ...]
  
  -- Tiles
  tiles         jsonb,
  -- { size: '600x600', pricePerM2: 450, includeAdhesive: true }

  -- Steel
  steel_bar_dia   integer,  -- mm: 8, 10, 12, 16, 20
  
  materials     jsonb,
  -- { concrete: bool, steel: bool, bricks: bool, tiles: bool }
  
  results       jsonb,
  -- {
  --   concrete: { wetVol, dryVol, cementBags, sandTonnes, aggregateTonnes, cost },
  --   steel: { weightKg, weightTon, cost },
  --   bricks: { netArea, count, mortarCementBags, mortarSandCft, cost },
  --   tiles: { area, count, boxes, groutKg, adhesiveKg, cost },
  --   total: number
  -- }

  currency      text default 'INR',
  created_at    timestamptz default now()
);

alter table projects enable row level security;

create policy "Users can only access their own projects"
  on projects for all
  using (auth.uid() = user_id);
```

---

## 📋 Updated Claude Code Prompt

```
Upgrade the existing BuildCalc Construction Material Cost Calculator at src/ with the following enhanced specification. This is an UPDATE to existing files — do not break existing routing, auth, Supabase hooks, or PDF export structure.

## Key Changes from v1
1. Currency: INR ONLY (remove multi-currency selector)
2. Concrete: IS 10262:2019 mix design (not simple unit price)
3. New: Coarse Aggregate + Fine Aggregate auto quantities
4. New: Brick dimension selector (IS 1077:1992 standard)
5. New: Door openings (IS 4021:1995 standard sizes)
6. New: Window openings (IS 1003:1991 standard sizes)
7. New: Floor tiles section (IS 13630:2006)
8. New: Steel bar diameter selector (IS 1786:2008)
9. Prices all in INR

## Updated data/materials.js

Replace entire file with:

```js
// ============================================================
// BuildCalc — IS Code Material Data (INR only)
// ============================================================

// IS 10262:2019 — Concrete Mix Design
export const CONCRETE_GRADES = {
  M15: { label: 'M15', ratio: { cement: 1, sand: 2, aggregate: 4 }, wc: 0.60, use: 'PCC / lean concrete' },
  M20: { label: 'M20', ratio: { cement: 1, sand: 1.5, aggregate: 3 }, wc: 0.55, use: 'RCC slabs, beams, columns' },
  M25: { label: 'M25', ratio: { cement: 1, sand: 1, aggregate: 2 }, wc: 0.50, use: 'High-strength RCC' },
};

// IS 383:2016 — Aggregate densities
export const MATERIAL_DENSITIES = {
  cement: 1440,       // kg/m³
  sand: 1600,         // kg/m³ (fine aggregate)
  aggregate: 1550,    // kg/m³ (coarse aggregate 20mm)
  steel: 7850,        // kg/m³ (IS 1786:2008)
};

// IS 10262:2019 Clause 7 — Dry volume factor
export const DRY_VOLUME_FACTOR = 1.54;

// IS 2212:1991 — Waste factors
export const WASTE_FACTORS = {
  concrete: 1.02,   // 2%
  steel: 1.05,      // 5%
  bricks: 1.10,     // 10%
  tiles: 1.05,      // 5% (IS 13630:2006)
};

// IS 1077:1992 — Brick sizes
export const BRICK_TYPES = {
  standard_modular: {
    label: 'Standard Modular (IS 1077)',
    nominal: { l: 200, w: 100, h: 100 },
    actual: { l: 190, w: 90, h: 90 },
    mortarJoint: 10,
    bricksPerM2: 50,
    code: 'IS 1077:1992',
  },
  non_modular: {
    label: 'Non-Modular / Traditional',
    nominal: { l: 230, w: 115, h: 75 },
    actual: { l: 220, w: 105, h: 65 },
    mortarJoint: 10,
    bricksPerM2: 60,
    code: 'IS 1077:1992 (legacy)',
  },
};

// IS 4021:1995 — Standard Door Sizes
export const DOOR_SIZES = [
  { id: 'D1', label: 'Bathroom/WC — 0.75×2.0m', w: 0.75, h: 2.00 },
  { id: 'D2', label: 'Bedroom Standard — 0.90×2.1m', w: 0.90, h: 2.10 },
  { id: 'D3', label: 'Main Door — 1.0×2.1m', w: 1.00, h: 2.10 },
  { id: 'D4', label: 'Double Leaf — 1.2×2.1m', w: 1.20, h: 2.10 },
  { id: 'D5', label: 'Double Wide — 1.5×2.1m', w: 1.50, h: 2.10 },
  { id: 'D6', label: 'Custom', w: null, h: null },
];

// IS 1003:1991 — Standard Window Sizes
export const WINDOW_SIZES = [
  { id: 'W1', label: 'Bathroom — 0.6×0.9m', w: 0.60, h: 0.90 },
  { id: 'W2', label: 'Bedroom — 0.9×1.2m', w: 0.90, h: 1.20 },
  { id: 'W3', label: 'Living Room — 1.2×1.2m', w: 1.20, h: 1.20 },
  { id: 'W4', label: 'Drawing Room — 1.5×1.5m', w: 1.50, h: 1.50 },
  { id: 'W5', label: 'Sliding Wide — 1.8×1.5m', w: 1.80, h: 1.50 },
  { id: 'W6', label: 'Custom', w: null, h: null },
];

// IS 13630:2006 — Tile Sizes
export const TILE_SIZES = [
  { id: 'T1', label: '300×300mm', w: 0.30, h: 0.30, area: 0.09 },
  { id: 'T2', label: '300×600mm', w: 0.30, h: 0.60, area: 0.18 },
  { id: 'T3', label: '600×600mm', w: 0.60, h: 0.60, area: 0.36 },
  { id: 'T4', label: '800×800mm', w: 0.80, h: 0.80, area: 0.64 },
  { id: 'T5', label: '600×1200mm', w: 0.60, h: 1.20, area: 0.72 },
];

// IS 1786:2008 — Steel bar diameters
export const STEEL_DIAMETERS = [8, 10, 12, 16, 20, 25, 32]; // mm

// Unit weight kg/m = D²/162
export function steelUnitWeight(dia) {
  return (dia * dia) / 162;
}

// IS 456:2000 Cl.26.5 — Reinforcement ratios
export const REINFORCEMENT_PCT = {
  slab:       0.80,
  column:     2.50,
  foundation: 0.80,
  wall:       1.00,
};

// INR Base Prices (2024 market reference)
export const BASE_PRICES_INR = {
  cement:       380,    // ₹/bag (50kg, OPC 53, IS 12269)
  sand:         1200,   // ₹/tonne (river sand, Zone II)
  aggregate:    1400,   // ₹/tonne (20mm CA, IS 383:2016)
  steel:        65,     // ₹/kg (Fe500 TMT, IS 1786:2008)
  bricks:       8,      // ₹/brick (IS 1077 standard)
  tileBasic:    350,    // ₹/m² (user overrideable)
  tilePremium:  900,    // ₹/m² (user overrideable)
  tileAdhesive: 35,     // ₹/kg (ANSI A108 ref)
  tileGrout:    45,     // ₹/kg (ANSI A108 ref)
};

export const PROJECT_TYPES = [
  { value: 'slab',       label: 'Floor Slab' },
  { value: 'wall',       label: 'Wall' },
  { value: 'foundation', label: 'Foundation' },
  { value: 'column',     label: 'Column' },
];
```

## Updated utils/calculations.js

Replace entire file with:

```js
import {
  CONCRETE_GRADES,
  MATERIAL_DENSITIES,
  DRY_VOLUME_FACTOR,
  WASTE_FACTORS,
  BRICK_TYPES,
  REINFORCEMENT_PCT,
  BASE_PRICES_INR,
  steelUnitWeight,
} from '../data/materials.js';

// ── Concrete (IS 10262:2019 + IS 456:2000) ──────────────────
export function calcConcrete(length, width, thickness, grade) {
  const l = parseFloat(length) || 0;
  const w = parseFloat(width) || 0;
  const t = parseFloat(thickness) || 0;
  const wetVol = l * w * t;
  if (!wetVol) return null;

  const gradeData = CONCRETE_GRADES[grade] || CONCRETE_GRADES.M20;
  const { cement: cr, sand: sr, aggregate: ar } = gradeData.ratio;
  const totalParts = cr + sr + ar;

  const dryVol    = wetVol * DRY_VOLUME_FACTOR * WASTE_FACTORS.concrete;
  const cVol      = dryVol * (cr / totalParts);
  const sVol      = dryVol * (sr / totalParts);
  const aVol      = dryVol * (ar / totalParts);

  const cementKg       = cVol * MATERIAL_DENSITIES.cement;
  const cementBags     = Math.ceil(cementKg / 50);
  const sandKg         = sVol * MATERIAL_DENSITIES.sand;
  const sandTonnes     = sandKg / 1000;
  const aggregateKg    = aVol * MATERIAL_DENSITIES.aggregate;
  const aggregateTonnes = aggregateKg / 1000;

  const cementCost    = cementBags * BASE_PRICES_INR.cement;
  const sandCost      = sandTonnes * BASE_PRICES_INR.sand;
  const aggregateCost = aggregateTonnes * BASE_PRICES_INR.aggregate;
  const cost          = cementCost + sandCost + aggregateCost;

  return {
    wetVol, dryVol, grade: gradeData.label,
    ratio: gradeData.ratio,
    cementBags, cementKg,
    sandTonnes, sandKg,
    aggregateTonnes, aggregateKg,
    cementCost, sandCost, aggregateCost,
    cost,
    code: 'IS 10262:2019, IS 456:2000',
  };
}

// ── Steel (IS 1786:2008 + IS 456:2000) ──────────────────────
export function calcSteel(length, width, thickness, projectType, barDia) {
  const l = parseFloat(length) || 0;
  const w = parseFloat(width) || 0;
  const t = parseFloat(thickness) || 0;
  const vol = l * w * t;
  if (!vol) return null;

  const reinPct   = REINFORCEMENT_PCT[projectType] || 1.0;
  const steelVol  = vol * (reinPct / 100);
  const rawKg     = steelVol * MATERIAL_DENSITIES.steel;
  const totalKg   = rawKg * WASTE_FACTORS.steel;
  const totalTon  = totalKg / 1000;
  const unitWt    = steelUnitWeight(barDia || 12);
  const cost      = totalKg * BASE_PRICES_INR.steel;

  return {
    vol, reinPct, barDia: barDia || 12,
    unitWeight: unitWt,
    totalKg, totalTon, cost,
    code: 'IS 1786:2008, IS 456:2000 Cl.26.5',
  };
}

// ── Bricks + Mortar (IS 1077:1992 + IS 2212:1991) ───────────
export function calcBricks(wallLength, wallHeight, wallThickness, brickType, doors, windows) {
  const l = parseFloat(wallLength) || 0;
  const h = parseFloat(wallHeight) || 0;
  if (!l || !h) return null;

  const brick      = BRICK_TYPES[brickType] || BRICK_TYPES.standard_modular;
  const grossArea  = l * h;

  // Deduct doors
  const doorArea   = (doors || []).reduce((sum, d) => {
    return sum + (parseFloat(d.w) || 0) * (parseFloat(d.h) || 0) * (parseInt(d.count) || 0);
  }, 0);

  // Deduct windows
  const winArea    = (windows || []).reduce((sum, w) => {
    return sum + (parseFloat(w.w) || 0) * (parseFloat(w.h) || 0) * (parseInt(w.count) || 0);
  }, 0);

  const netArea    = Math.max(grossArea - doorArea - winArea, 0);
  const rawBricks  = netArea * brick.bricksPerM2;
  const brickCount = Math.ceil(rawBricks * WASTE_FACTORS.bricks);
  const brickCost  = brickCount * BASE_PRICES_INR.bricks;

  // Mortar (IS 2212:1991 — 1:6 cement:sand)
  const wt         = parseFloat(wallThickness) || 0.23;
  const mortarVol  = netArea * wt * 0.30;                   // 30% joints
  const dryMortar  = mortarVol * 1.33;
  const mCemVol    = dryMortar * (1 / 7);
  const mSandVol   = dryMortar * (6 / 7);
  const mortarCementBags = Math.ceil((mCemVol * MATERIAL_DENSITIES.cement) / 50);
  const mortarSandCft    = mSandVol * 35.31;
  const mortarSandTonnes = (mSandVol * MATERIAL_DENSITIES.sand) / 1000;
  const mortarCost = (mortarCementBags * BASE_PRICES_INR.cement) +
                     (mortarSandTonnes * BASE_PRICES_INR.sand);

  return {
    grossArea, doorArea, winArea, netArea,
    brick: brick.label,
    bricksPerM2: brick.bricksPerM2,
    brickCount, brickCost,
    mortarCementBags, mortarSandCft, mortarSandTonnes, mortarCost,
    cost: brickCost + mortarCost,
    code: 'IS 1077:1992, IS 2212:1991',
  };
}

// ── Tiles (IS 13630:2006) ────────────────────────────────────
export function calcTiles(length, width, tileSize, pricePerM2) {
  const l = parseFloat(length) || 0;
  const w = parseFloat(width) || 0;
  const roomArea  = l * w;
  if (!roomArea) return null;

  const tilesArea = roomArea * WASTE_FACTORS.tiles;
  const tileArea  = (tileSize?.area) || 0.36;
  const tilesCount = Math.ceil(tilesArea / tileArea);
  const priceM2   = parseFloat(pricePerM2) || BASE_PRICES_INR.tileBasic;

  // Adhesive + Grout (ANSI A108 — noted as non-IS reference)
  const groutKg     = tilesArea * 0.5;
  const adhesiveKg  = tilesArea * 4.5;
  const tileCost    = tilesArea * priceM2;
  const groutCost   = groutKg * BASE_PRICES_INR.tileGrout;
  const adhesiveCost = adhesiveKg * BASE_PRICES_INR.tileAdhesive;

  return {
    roomArea, tilesArea, tilesCount,
    tileSize: tileSize?.label || '600×600mm',
    priceM2, tileCost,
    groutKg, groutCost,
    adhesiveKg, adhesiveCost,
    cost: tileCost + groutCost + adhesiveCost,
    code: 'IS 13630:2006 (tiles); ANSI A108 (adhesive/grout — IS code does not specify)',
  };
}

// ── Master calc ──────────────────────────────────────────────
export function calcAll(state) {
  const results = {};

  if (state.materials.concrete) {
    results.concrete = calcConcrete(
      state.length, state.width, state.thickness, state.concreteGrade || 'M20'
    );
  }
  if (state.materials.steel) {
    results.steel = calcSteel(
      state.length, state.width, state.thickness,
      state.projectType, state.barDia || 12
    );
  }
  if (state.materials.bricks) {
    results.bricks = calcBricks(
      state.wallLength || state.length,
      state.wallHeight || 3.0,
      state.wallThickness || 0.23,
      state.brickType || 'standard_modular',
      state.doors || [],
      state.windows || []
    );
  }
  if (state.materials.tiles) {
    results.tiles = calcTiles(
      state.tileRoomLength || state.length,
      state.tileRoomWidth || state.width,
      state.tileSize,
      state.tilePriceM2
    );
  }

  results.total =
    (results.concrete?.cost || 0) +
    (results.steel?.cost || 0) +
    (results.bricks?.cost || 0) +
    (results.tiles?.cost || 0);

  return results;
}
```

## Calculator.jsx Changes

Update DEFAULT_STATE to:
```js
const DEFAULT_STATE = {
  projectName: 'My Project',
  projectType: 'slab',
  length: '',
  width: '',
  thickness: '',
  wallHeight: '3.0',
  wallThickness: '0.23',
  concreteGrade: 'M20',
  brickType: 'standard_modular',
  barDia: 12,
  materials: { concrete: true, steel: true, bricks: false, tiles: false },
  doors: [],
  windows: [],
  tileRoomLength: '',
  tileRoomWidth: '',
  tileSize: { id: 'T3', label: '600×600mm', w: 0.60, h: 0.60, area: 0.36 },
  tilePriceM2: '',
};
```

Add these new input sections in Calculator.jsx:

1. **Concrete Grade selector** (M15 / M20 / M25) — replaces "Quality Grade"
2. **Steel bar diameter** selector (8/10/12/16/20mm)
3. **Brick type** selector (IS 1077 Standard / Non-modular)
4. **Wall height + thickness** inputs (when wall/foundation selected)
5. **Doors section** — dropdown of IS 4021 sizes + count + custom option
6. **Windows section** — dropdown of IS 1003 sizes + count + custom option
7. **Tiles section** — tile size selector, room dimensions, price/m² input

## CostSummary.jsx Changes

Update result display to show for each material:

**Concrete:**
- Mix ratio used (e.g. 1:1.5:3 for M20)
- Wet volume / Dry volume
- Cement bags needed
- Fine aggregate (sand) in kg and tonnes
- Coarse aggregate in kg and tonnes
- Itemised cost (cement + sand + aggregate)
- Code reference shown: "IS 10262:2019"

**Steel:**
- Bar diameter selected
- Reinforcement % used
- Total weight in kg and tonnes
- Unit weight of selected bar (D²/162)
- Code: "IS 1786:2008, IS 456:2000"

**Bricks:**
- Gross area, door deduction, window deduction, net area
- Brick count (with 10% wastage)
- Mortar cement bags + sand in CFT
- Code: "IS 1077:1992, IS 2212:1991"

**Tiles:**
- Room area + area with wastage
- Tile count
- Grout kg + adhesive kg
- NOTE displayed: "Adhesive/grout per ANSI A108 — IS 13630 does not specify quantities"
- Code: "IS 13630:2006"

## PDF Export Changes (pdfExport.js)

Add to PDF output:
- Concrete: show grade, ratio, dry volume, cement bags, sand, aggregate separately
- Steel: show bar dia, reinf%, weight
- Bricks: show gross/net area, door & window deductions, brick count, mortar
- Tiles: show tile size, count, grout, adhesive
- Footer note: "Calculations per IS 10262:2019, IS 456:2000, IS 1077:1992, IS 2212:1991, IS 1786:2008, IS 4021:1995, IS 1003:1991, IS 13630:2006. Tile adhesive/grout per ANSI A108 (IS equivalent not available). Verify with a licensed engineer before construction."

## Supabase Schema Addition

Run this migration in Supabase SQL editor:
```sql
alter table projects
  add column if not exists concrete_grade  text default 'M20',
  add column if not exists steel_bar_dia   integer default 12,
  add column if not exists brick_type      text default 'standard_modular',
  add column if not exists wall_height     numeric,
  add column if not exists wall_thickness  numeric,
  add column if not exists doors           jsonb default '[]',
  add column if not exists windows         jsonb default '[]',
  add column if not exists tile_room_dims  jsonb,
  add column if not exists tile_size       jsonb,
  add column if not exists tile_price_m2   numeric;

-- Remove currency column (now INR only)
alter table projects drop column if exists currency;
```

## Acceptance / Spot-Check Values

After building, verify these calculations manually:

### Test 1 — M20 Concrete Slab 5m×4m×0.15m
- Wet volume = 3.000 m³
- Dry volume = 3.000 × 1.54 × 1.02 = **4.712 m³**
- Ratio 1:1.5:3, parts=5.5
- Cement vol = 4.712/5.5 = 0.857 m³
- Cement kg = 0.857 × 1440 = **1233 kg → 25 bags**
- Sand kg = (4.712 × 1.5/5.5) × 1600 = **2060 kg ≈ 2.06 T**
- Aggregate kg = (4.712 × 3/5.5) × 1550 = **3975 kg ≈ 3.97 T**

### Test 2 — Wall 6m×3m, 2 doors (0.9×2.1), 3 windows (1.2×1.2)
- Gross area = 18.00 m²
- Door area = 2 × 0.9 × 2.1 = 3.78 m²
- Window area = 3 × 1.2 × 1.2 = 4.32 m²
- Net area = 18.00 - 3.78 - 4.32 = **9.90 m²**
- Bricks = ceil(9.90 × 50 × 1.10) = **545 bricks**

### Test 3 — 600×600mm Tiles for 4m×3m room
- Room area = 12.00 m²
- With 5% waste = 12.60 m²
- Tile area = 0.36 m²
- Tiles needed = ceil(12.60/0.36) = **35 tiles**
```

---

## 🗺️ Roadmap (Updated)

### Phase 1 — ✅ Complete (20 June 2026)
- INR-only Cost Calculator (IS code based)
- Concrete with coarse + fine aggregate
- Steel with bar diameter selection
- Bricks with IS 1077 dimensions
- Doors (IS 4021) + Windows (IS 1003) deduction
- Floor tiles (IS 13630)
- User auth + saved projects

### Phase 2 — Next Up
- Unit Converter for Civil Engineering
- Concrete Mix Design Calculator (detailed IS 10262)

### Phase 3 — Intermediate
- Structural Load Calculator (IS 875)
- Soil Classification Tool (IS 1498 / USCS)
- Bridge/Beam Analysis Tool (IS 800/456)

### Phase 4 — Advanced UI
- Road/Highway Design Info Portal (IRC codes)
- Construction Project Timeline (Gantt)
- Smart Construction Site Dashboard (mock IoT)

### Phase 5 — Server Required
- Flood Risk Assessment Map (GIS APIs)
- Water Distribution Network Simulator

---

## 📦 Key Dependencies (Unchanged)

```json
{
  "dependencies": {
    "@supabase/supabase-js": "^2.108.2",
    "@tailwindcss/vite": "^4.3.1",
    "jspdf": "^4.2.1",
    "react": "^19.2.6",
    "react-dom": "^19.2.6",
    "react-router-dom": "^7.18.0",
    "tailwindcss": "^4.3.1"
  }
}
```

---

## 🎨 Design & Branding (Unchanged)

| Token | Value |
|---|---|
| App name | BuildCalc |
| Logo | 🪖 hard hat |
| Primary | `#D85A30` |
| Primary dark | `#993C1D` |
| Border radius | `rounded-xl` cards, `rounded-lg` inputs |

---

## 🔗 Useful Links

- Supabase Dashboard: https://supabase.com/dashboard/project/mexjrnaiumwdlqxeziil
- IS 10262:2019 — Concrete Mix Design
- IS 456:2000 — Plain & Reinforced Concrete Code of Practice
- IS 1077:1992 — Common Burnt Clay Building Bricks
- IS 2212:1991 — Code of Practice for Brickwork
- IS 1786:2008 — High Strength Deformed Steel Bars
- IS 4021:1995 — Timber Door, Window & Ventilator Frames
- IS 1003:1991 — Timber Panelled & Glazed Windows
- IS 13630:2006 — Ceramic Tiles (Test Methods)
- IS 383:2016 — Coarse and Fine Aggregates for Concrete

---

*Last updated: 20 June 2026 — v2.0 IS Code Enhanced*
