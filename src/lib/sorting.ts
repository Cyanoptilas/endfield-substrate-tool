import type { Weapon } from '../types';

export type SortOrder = 'default' | 'rarity-desc' | 'rarity-asc';

export function sortWeapons(list: Weapon[], order: SortOrder): Weapon[] {
  if (order === 'default') return list;
  return [...list].sort((a, b) =>
    order === 'rarity-desc' ? b.rarity - a.rarity : a.rarity - b.rarity,
  );
}
