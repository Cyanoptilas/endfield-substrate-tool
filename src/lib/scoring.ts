import type { Weapon, Area, Effect, AreaScore } from '../types';

export function calcAreaScores(
  selectedWeapons: Weapon[],
  areas: Area[],
  effects: Effect[],
): AreaScore[] {
  if (selectedWeapons.length === 0) return [];

  const skillEffectMap = new Map(
    effects.filter((e) => e.category === 'skill').map((e) => [e.id, e]),
  );

  const desiredSkillIds = new Set(selectedWeapons.map((w) => w.skillEffect));

  return areas
    .map((area) => {
      const matchedSkillEffectIds = area.skillEffects.filter((id) =>
        desiredSkillIds.has(id),
      );
      const matchedSkillEffects = matchedSkillEffectIds
        .map((id) => skillEffectMap.get(id))
        .filter((e): e is Effect => e !== undefined);

      const matchedWeapons = selectedWeapons.filter((w) =>
        area.skillEffects.includes(w.skillEffect),
      );

      const score = matchedWeapons.length;

      return { area, matchedSkillEffects, matchedWeapons, score };
    })
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score);
}
