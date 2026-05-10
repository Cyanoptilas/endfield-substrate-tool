import type { Weapon, Area, AreaScore } from '../types';

export function calcAreaScores(
  selectedWeapons: Weapon[],
  areas: Area[],
): AreaScore[] {
  if (selectedWeapons.length === 0) return [];

  return areas
    .map((area) => {
      const matchedWeapons = selectedWeapons.filter(
        (w) =>
          area.additionalEffects.includes(w.additionalEffect) &&
          area.skillEffects.includes(w.skillEffect),
      );
      return { area, matchedWeapons, score: matchedWeapons.length };
    })
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score);
}
