import type { MainCharacter, Team } from '../types';

export type Agreement = 'agree' | 'split' | 'single';

/**
 * 掲載元の一致度。
 * - agree:  2サイトが同じメンバー構成を推している編成がある
 * - split:  両サイトに編成はあるがメンバー構成が違う
 * - single: 1サイトにしか編成が無い
 */
export function agreementOf(character: MainCharacter): Agreement {
  if (character.teams.some((t) => t.sources.length >= 2)) return 'agree';
  const sources = new Set(character.teams.flatMap((t) => t.sources));
  return sources.size >= 2 ? 'split' : 'single';
}

/** 編成メンバーの第一候補の武器ID（重複なし）。基質シミュレーターに渡す用 */
export function primaryWeaponIds(team: Team): string[] {
  return [...new Set(team.members.map((m) => m.weaponIds[0]))];
}
