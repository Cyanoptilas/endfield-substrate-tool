import type { Weapon, Area, Effect, AreaScore } from '../types';

export function calcAreaScores(
  selectedWeapons: Weapon[],
  areas: Area[],
  effects: Effect[],
): AreaScore[] {
  if (selectedWeapons.length === 0) return [];

  const effectMap = new Map(effects.map((e) => [e.id, e]));

  // Union of all desired effects across selected weapons
  const desiredEffectIds = new Set(
    selectedWeapons.flatMap((w) => w.desiredEffects),
  );

  return areas
    .map((area) => {
      const matchedEffectIds = area.possibleEffects.filter((id) =>
        desiredEffectIds.has(id),
      );
      const matchedEffects = matchedEffectIds
        .map((id) => effectMap.get(id))
        .filter((e): e is Effect => e !== undefined);

      const matchedWeapons = selectedWeapons.filter((w) =>
        w.desiredEffects.some((id) => area.possibleEffects.includes(id)),
      );

      // Score = matched effects count, bonus for covering more weapons
      const score = matchedEffectIds.length + matchedWeapons.length * 0.1;

      return { area, matchedEffects, score, matchedWeapons };
    })
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score);
}
