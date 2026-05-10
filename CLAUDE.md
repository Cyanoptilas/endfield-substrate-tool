# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
bun run dev       # Start dev server (Vite HMR)
bun run build     # Type-check (tsc -b) then Vite build
bun run lint      # ESLint
bun run preview   # Serve production build locally
```

No test suite is configured.

## Architecture

This is a fan-made farming simulator for *Arknights: Endfield* (アークナイツ：エンドフィールド). Users select weapons they want to farm substrates for, and the tool ranks game areas by how many desired effects overlap.

**Data layer** (`src/data/`) — Static JSON files (`weapons.json`, `areas.json`, `effects.json`) imported directly into `App.tsx` and cast to typed interfaces. Updating game content means editing these files.

**Type system** (`src/types/index.ts`) — Four core interfaces: `Effect`, `Weapon`, `Area`, `AreaScore`. Weapons reference effects by ID via `desiredEffects: string[]`; Areas expose available effects via `possibleEffects: string[]`.

**Scoring** (`src/lib/scoring.ts`) — `calcAreaScores()` is a pure function: it unions desired effect IDs across all selected weapons, intersects with each area's possible effects, and ranks by `matchedEffects.length + matchedWeapons.length * 0.1`. No side effects.

**State** (`src/store/simulatorStore.ts`) — Single Zustand store holding `selectedWeaponIds: Set<string>`. The store is the only shared state; everything else is derived via `useMemo` in `App.tsx`.

**UI** (`src/App.tsx`, `src/components/`) — `App` computes `selectedWeapons` and `results` from the store + static data, then passes them down to `WeaponCard` (selection grid) and `AreaResult` (ranked results list). No routing; single-page layout.

Styling is Tailwind v4 (integrated via `@tailwindcss/vite` plugin, no `tailwind.config.js` needed).
