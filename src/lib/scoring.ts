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

/**
 * 未選択の各武器が、現在の結果エリアのどこで同時厳選できるかを返す。
 * Map<weaponId, Area[]>
 */
export function calcCoFarmable(
  results: AreaScore[],
  allWeapons: Weapon[],
  selectedWeaponIds: Set<string>,
): Map<string, Area[]> {
  const map = new Map<string, Area[]>();
  for (const { area } of results) {
    for (const weapon of allWeapons) {
      if (selectedWeaponIds.has(weapon.id)) continue;
      if (
        area.additionalEffects.includes(weapon.additionalEffect) &&
        area.skillEffects.includes(weapon.skillEffect)
      ) {
        const existing = map.get(weapon.id) ?? [];
        map.set(weapon.id, [...existing, area]);
      }
    }
  }
  return map;
}
