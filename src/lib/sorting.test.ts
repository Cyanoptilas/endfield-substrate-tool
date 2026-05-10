import { describe, it, expect } from 'vitest';
import { sortWeapons } from './sorting';
import type { Weapon } from '../types';

const make = (id: string, rarity: number): Weapon => ({
  id,
  name: id,
  category: 'test',
  rarity,
  baseEffect: 'b',
  additionalEffect: 'a',
  skillEffect: 's',
});

const weapons: Weapon[] = [
  make('w4', 4),
  make('w6', 6),
  make('w3', 3),
  make('w5', 5),
];

describe('sortWeapons', () => {
  it('default: preserves original order', () => {
    const result = sortWeapons(weapons, 'default');
    expect(result.map((w) => w.id)).toEqual(['w4', 'w6', 'w3', 'w5']);
  });

  it('rarity-desc: 6→5→4→3', () => {
    const result = sortWeapons(weapons, 'rarity-desc');
    expect(result.map((w) => w.rarity)).toEqual([6, 5, 4, 3]);
  });

  it('rarity-asc: 3→4→5→6', () => {
    const result = sortWeapons(weapons, 'rarity-asc');
    expect(result.map((w) => w.rarity)).toEqual([3, 4, 5, 6]);
  });

  it('does not mutate the original array', () => {
    const original = [...weapons];
    sortWeapons(weapons, 'rarity-desc');
    expect(weapons.map((w) => w.id)).toEqual(original.map((w) => w.id));
  });

  it('handles empty list', () => {
    expect(sortWeapons([], 'rarity-desc')).toEqual([]);
  });

  it('stable: same-rarity weapons keep relative order', () => {
    const same = [make('a', 5), make('b', 5), make('c', 5)];
    const result = sortWeapons(same, 'rarity-desc');
    expect(result.map((w) => w.id)).toEqual(['a', 'b', 'c']);
  });
});
