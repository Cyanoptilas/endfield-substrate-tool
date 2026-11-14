import { describe, it, expect } from 'vitest';
import type { Weapon, MainCharacter, CharacterGear, GearSet } from '../types';

import weaponsData from './weapons.json';
import teamsData from './teams.json';
import gearBuildsData from './gearBuilds.json';
import gearSetsData from './gearSets.json';

const weapons = new Map((weaponsData as Weapon[]).map((w) => [w.id, w]));
const characters = teamsData as MainCharacter[];
const gearBuilds = gearBuildsData as CharacterGear[];
const gearSets = new Set((gearSetsData as GearSet[]).map((s) => s.name));

const teams = characters.flatMap((c) => c.teams.map((t) => ({ character: c, team: t })));
const members = teams.flatMap(({ team }) => team.members.map((m) => ({ team, member: m })));

const duplicates = (values: string[]): string[] =>
  values.filter((v, i) => values.indexOf(v) !== i);

describe('teams.json', () => {
  it('キャラID・編成IDが重複していない', () => {
    expect(duplicates(characters.map((c) => c.id))).toEqual([]);
    expect(duplicates(teams.map(({ team }) => team.id))).toEqual([]);
  });

  it('どのキャラにも編成が1つ以上ある', () => {
    expect(characters.filter((c) => c.teams.length === 0).map((c) => c.name)).toEqual([]);
  });

  it('編成は4人で、同じキャラが重複していない', () => {
    const invalid = teams
      .filter(({ team }) => team.members.length !== 4 || duplicates(team.members.map((m) => m.name)).length > 0)
      .map(({ team }) => team.id);
    expect(invalid).toEqual([]);
  });

  it('メインキャラ本人がメイン火力として編成に入っている', () => {
    const invalid = teams
      .filter(({ character, team }) =>
        !team.members.some((m) => m.name === character.name && m.role === 'メイン火力'),
      )
      .map(({ team }) => team.id);
    expect(invalid).toEqual([]);
  });

  it('掲載元が1つ以上あり、重複していない', () => {
    const invalid = teams
      .filter(({ team }) => team.sources.length === 0 || duplicates(team.sources).length > 0)
      .map(({ team }) => team.id);
    expect(invalid).toEqual([]);
  });

  it('武器IDが weapons.json に存在する', () => {
    const invalid = members.flatMap(({ team, member }) =>
      member.weaponIds.filter((id) => !weapons.has(id)).map((id) => `${team.id}: ${member.name} ${id}`),
    );
    expect(invalid).toEqual([]);
  });

  // 攻略サイトの表で武器の割り当てがずれていると、ここで武器種の食い違いとして出る
  it('同じキャラの推奨武器はすべて同じ武器種', () => {
    const categories = new Map<string, Set<string>>();
    for (const { member } of members) {
      const set = categories.get(member.name) ?? new Set<string>();
      for (const id of member.weaponIds) {
        const w = weapons.get(id);
        if (w) set.add(w.category);
      }
      categories.set(member.name, set);
    }
    const invalid = [...categories]
      .filter(([, cats]) => cats.size > 1)
      .map(([name, cats]) => `${name}: ${[...cats].join(', ')}`);
    expect(invalid).toEqual([]);
  });

  it('装備セットが gearSets.json に存在する', () => {
    const invalid = members.flatMap(({ team, member }) =>
      member.gearSets.filter((s) => !gearSets.has(s)).map((s) => `${team.id}: ${member.name} ${s}`),
    );
    expect(invalid).toEqual([]);
  });

  it('編成メンバー全員に装備ビルドのデータがある', () => {
    const withGear = new Set(gearBuilds.map((g) => g.character));
    const invalid = [...new Set(members.map(({ member }) => member.name))].filter((n) => !withGear.has(n));
    expect(invalid).toEqual([]);
  });
});

describe('gearBuilds.json', () => {
  it('キャラが重複していない', () => {
    expect(duplicates(gearBuilds.map((g) => g.character))).toEqual([]);
  });

  it('ビルドのセットが gearSets.json に存在する（セット混合は null）', () => {
    const invalid = gearBuilds.flatMap((g) =>
      g.builds.filter((b) => b.set !== null && !gearSets.has(b.set)).map((b) => `${g.character}: ${b.set}`),
    );
    expect(invalid).toEqual([]);
  });

  it('ビルドは4部位', () => {
    const invalid = gearBuilds.flatMap((g) =>
      g.builds.filter((b) => b.pieces.length !== 4).map((b) => `${g.character}: ${b.type}`),
    );
    expect(invalid).toEqual([]);
  });
});
