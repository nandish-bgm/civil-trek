# BuildCalc — Adding New Tools & Deploying to Vercel

> **Stack:** React 19 + Vite · Tailwind CSS v4 · React Router v7 · Supabase · Vercel  
> **Repo linked to Vercel** — every push to `main` auto-deploys.

---

## The Flow (One Line)

```
Claude Code writes files → test locally → git push → Vercel auto-deploys in ~90s
```

---

## Step 1 — Get Your Project Running Locally

### If you already have it cloned:
```bash
cd path/to/civil-eng
npm install
```

### If you only have it on GitHub (not locally):
```bash
git clone https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
cd YOUR_REPO_NAME
npm install
```

---

## Step 2 — Install Claude Code (if not already)

```bash
npm install -g @anthropic-ai/claude-code
```

Verify it works:
```bash
claude --version
```

---

## Step 3 — Run Claude Code Inside Your Project

```bash
# Make sure you are inside your project folder first
cd civil-eng

# Open Claude Code
claude
```

Then **paste the full tool prompt** (e.g. the Structural Load Calculator prompt).  
Claude Code will automatically create and modify all required files.

---

## Step 4 — Files Claude Code Will Create / Modify

### For the Structural Load Calculator, new files created:

```
src/
└── pages/
    └── StructuralLoad/
        ├── index.jsx          ← Main page component
        ├── InputPanel.jsx     ← Left panel: all inputs
        ├── ResultsPanel.jsx   ← Right panel: results + breakdown
        ├── CalcBreakdown.jsx  ← Step-by-step math display
        ├── FeedbackBox.jsx    ← User override + recalculate
        ├── calcEngine.js      ← Pure calculation functions
        └── constants.js       ← IS code tables, zone maps
```

### Existing files that will be modified:

```
src/App.jsx                  ← New route added
src/components/Navbar.jsx    ← New nav link added
```

---

## Step 5 — Test Locally Before Pushing

```bash
npm run dev
```

Open in browser: `http://localhost:5173/structural-load`

**Check these things:**
- [ ] Page loads without a blank screen
- [ ] Inputs update results live
- [ ] Navbar shows the new link
- [ ] No red errors in browser console (`F12 → Console`)
- [ ] Mobile view looks correct (resize browser)

---

## Step 6 — Commit and Push to GitHub

```bash
# See what files changed
git status

# Stage all new and modified files
git add .

# Commit with a descriptive message
git commit -m "feat: add Structural Load Calculator (IS 875, IS 1893, IS 456)"

# Push to main — this triggers Vercel deployment automatically
git push origin main
```

---

## Step 7 — Watch Vercel Deploy

1. Go to **[vercel.com/dashboard](https://vercel.com/dashboard)**
2. Click your **BuildCalc project**
3. You will see a new deployment triggered — status: **Building**
4. Wait **60–90 seconds**
5. Status changes to **Ready** ✅
6. Click **Visit** to open your live site

Your new page is now live at:  
`https://your-project.vercel.app/structural-load`

---

## Step 8 — Environment Variables (Nothing New Needed)

Your `.env.local` is **not in GitHub** (gitignored). Vercel uses its own copy.  
Since you set these up in Phase 1, they are already there — no changes needed.

**To confirm, check:**  
Vercel Dashboard → Your Project → **Settings** → **Environment Variables**

| Variable | Should Exist |
|---|---|
| `VITE_SUPABASE_URL` | ✅ Yes |
| `VITE_SUPABASE_ANON_KEY` | ✅ Yes |

The Structural Load Calculator is **100% client-side** — no new env vars needed.

---

## Step 9 — Supabase (Nothing to Change)

The Structural Load Calculator does **not** save anything to the database.  
It is a pure calculation tool — no schema changes required.

Your existing auth (sign in / sign out) still works across the whole app automatically.

> **When you WILL need Supabase changes:**  
> Only if a future tool needs to save user data (e.g. saving a load calculation report to Dashboard). At that point, add a new table in the Supabase SQL Editor and update `src/hooks/useProjects.js`.

---

## Common Issues & Fixes

### ❌ Build fails on Vercel with "Cannot find module"
```bash
# Check: does the import path in the file exactly match the filename?
# Linux (Vercel) is CASE-SENSITIVE. Windows is not.
# Wrong:  import InputPanel from './inputPanel'
# Right:  import InputPanel from './InputPanel'
```

### ❌ Page shows 404 on Vercel but works locally
```bash
# Check src/App.jsx — is the new route actually there?
# <Route path="/structural-load" element={<StructuralLoad />} />
# Also check: did you import the component at the top of App.jsx?
```

### ❌ White screen / no content
```bash
# Open browser console (F12) and look for the red error
# Most common cause: a missing import or a typo in a variable name
```

### ❌ Tailwind styles not showing
```bash
# Tailwind v4 auto-scans files — no config needed
# Make sure you are using standard Tailwind utility class names
# Custom values like bg-[#D85A30] need the brackets syntax exactly
```

### ❌ Pushed but Vercel not deploying
```bash
# Confirm your push went through
git log --oneline -3

# Check Vercel is watching the right branch (should be 'main')
# Vercel Dashboard → Project → Settings → Git → Production Branch
```

---

## Your Standard Workflow for Every New Tool

```
Step 1   cd civil-eng
Step 2   claude                          ← open Claude Code
Step 3   paste the tool prompt           ← Claude Code writes all files
Step 4   npm run dev                     ← test at localhost:5173
Step 5   git add .
Step 6   git commit -m "feat: toolname"
Step 7   git push origin main
Step 8   Vercel deploys automatically    ← done in ~90 seconds
```

Repeat this for every tool in your roadmap. No Vercel reconfiguration ever needed.

---

## Roadmap — Deployment Checklist

| Phase | Tool | Route | Needs Supabase? | Status |
|---|---|---|---|---|
| 1 | Cost Calculator | `/calculator` | ✅ Yes (already done) | ✅ Live |
| 2 | Unit Converter | `/unit-converter` | ❌ No | ⬜ Next |
| 2 | Structural Load Calculator | `/structural-load` | ❌ No | ⬜ Next |
| 3 | Concrete Mix Design | `/mix-design` | ❌ No | ⬜ Planned |
| 3 | Soil Classification | `/soil-classification` | ❌ No | ⬜ Planned |
| 3 | Beam Analysis | `/beam-analysis` | ❌ No | ⬜ Planned |
| 4 | Road Design Portal | `/road-design` | ❌ No | ⬜ Planned |
| 4 | Gantt Planner | `/timeline` | ⬜ Maybe | ⬜ Planned |
| 4 | IoT Dashboard | `/site-dashboard` | ❌ No (mock data) | ⬜ Planned |
| 5 | Flood Risk Map | `/flood-risk` | ❌ No (Vercel fn) | ⬜ Planned |
| 5 | Water Network Sim | `/water-network` | ❌ No (Vercel fn) | ⬜ Planned |

---

## Quick Reference — Key Links

| Resource | URL |
|---|---|
| Vercel Dashboard | https://vercel.com/dashboard |
| Supabase Dashboard | https://supabase.com/dashboard/project/mexjrnaiumwdlqxeziil |
| Your Live Site | https://your-project.vercel.app |
| Tailwind v4 Docs | https://tailwindcss.com/docs |

---

*BuildCalc · Last updated: July 2026*
