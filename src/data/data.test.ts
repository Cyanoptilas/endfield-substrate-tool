import { describe, it, expect } from 'vitest';
import type { Weapon, Area, Effect, EffectCategory } from '../types';

import weaponsData from './weapons.json';
import areasData from './areas.json';
import effectsData from './effects.json';

const weapons = weaponsData as Weapon[];
const areas = areasData as Area[];
const effects = effectsData as Effect[];

/** 効果ID → カテゴリ。未知のIDは undefined になる */
const effectCategory = new Map<string, EffectCategory>(
  effects.map((e) => [e.id, e.category]),
);

/** 各エリアで出現する基質の枠数（ゲーム内の超域活性点の仕様） */
const SLOTS = { base: 5, additional: 8, skill: 8 } as const;

const WEAPON_CATEGORIES = ['片手剣', '大剣', '長柄武器', '拳銃', 'アーツ'];

const duplicates = (values: string[]): string[] =>
  values.filter((v, i) => values.indexOf(v) !== i);

describe('effects.json', () => {
  it('IDが重複していない', () => {
    expect(duplicates(effects.map((e) => e.id))).toEqual([]);
  });

  it('カテゴリが base / additional / skill のいずれか', () => {
    const invalid = effects.filter(
      (e) => !['base', 'additional', 'skill'].includes(e.category),
    );
    expect(invalid.map((e) => e.id)).toEqual([]);
  });

  it('名称が空でない', () => {
    const blank = effects.filter((e) => !e.name || !e.nameEn);
    expect(blank.map((e) => e.id)).toEqual([]);
  });
});

describe('weapons.json', () => {
  it('IDが重複していない', () => {
    expect(duplicates(weapons.map((w) => w.id))).toEqual([]);
  });

  it('名称が重複していない', () => {
    expect(duplicates(weapons.map((w) => w.name))).toEqual([]);
  });

  it('レアリティが4〜6', () => {
    const invalid = weapons.filter((w) => w.rarity < 4 || w.rarity > 6);
    expect(invalid.map((w) => `${w.name}(${w.rarity})`)).toEqual([]);
  });

  it('武器種が既知のもののみ', () => {
    const invalid = weapons.filter((w) => !WEAPON_CATEGORIES.includes(w.category));
    expect(invalid.map((w) => `${w.name}: ${w.category}`)).toEqual([]);
  });

  it.each([
    ['baseEffect', 'base'],
    ['additionalEffect', 'additional'],
    ['skillEffect', 'skill'],
  ] as const)('%s が effects.json の %s カテゴリの効果を指している', (field, category) => {
    const invalid = weapons.filter((w) => effectCategory.get(w[field]) !== category);
    expect(invalid.map((w) => `${w.name}: ${field}=${w[field]}`)).toEqual([]);
  });
});

describe('areas.json', () => {
  it('IDが重複していない', () => {
    expect(duplicates(areas.map((a) => a.id))).toEqual([]);
  });

  it('名称が空でない', () => {
    const blank = areas.filter((a) => !a.name || !a.nameEn);
    expect(blank.map((a) => a.id)).toEqual([]);
  });

  it.each([
    ['baseEffects', 'base'],
    ['additionalEffects', 'additional'],
    ['skillEffects', 'skill'],
  ] as const)('%s が effects.json の %s カテゴリの効果のみを含む', (field, category) => {
    const invalid = areas.flatMap((a) =>
      a[field]
        .filter((id) => effectCategory.get(id) !== category)
        .map((id) => `${a.name}: ${field} に ${id}`),
    );
    expect(invalid).toEqual([]);
  });

  it.each([
    ['baseEffects', SLOTS.base],
    ['additionalEffects', SLOTS.additional],
    ['skillEffects', SLOTS.skill],
  ] as const)('%s の件数が %i', (field, count) => {
    const invalid = areas
      .filter((a) => a[field].length !== count)
      .map((a) => `${a.name}: ${a[field].length}件`);
    expect(invalid).toEqual([]);
  });

  it.each(['baseEffects', 'additionalEffects', 'skillEffects'] as const)(
    '%s 内で効果IDが重複していない',
    (field) => {
      const invalid = areas
        .filter((a) => duplicates(a[field]).length > 0)
        .map((a) => `${a.name}: ${duplicates(a[field]).join(', ')}`);
      expect(invalid).toEqual([]);
    },
  );
});

describe('weapons と areas の整合', () => {
  it('どの武器も厳選できるエリアが1つ以上ある', () => {
    const orphans = weapons.filter(
      (w) =>
        !areas.some(
          (a) =>
            a.additionalEffects.includes(w.additionalEffect) &&
            a.skillEffects.includes(w.skillEffect),
        ),
    );
    expect(orphans.map((w) => w.name)).toEqual([]);
  });
});
