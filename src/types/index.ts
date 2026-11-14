export type EffectCategory = 'base' | 'additional' | 'skill';

export interface Effect {
  id: string;
  name: string;
  nameEn: string;
  category: EffectCategory;
}

export interface Weapon {
  id: string;
  name: string;
  category: string;
  rarity: number;
  baseEffect: string;
  additionalEffect: string;
  skillEffect: string;
}

export interface Area {
  id: string;
  name: string;
  nameEn: string;
  baseEffects: string[];
  additionalEffects: string[];
  skillEffects: string[];
}

export interface AreaScore {
  area: Area;
  matchedWeapons: Weapon[];
  score: number;
}

export type Element = '物理' | '灼熱' | '寒冷' | '電磁' | '自然';

export type TeamSource = 'game8' | 'appmedia';

export interface TeamMember {
  name: string;
  role: string;
  form?: string;
  /** 先頭ほど掲載元の一致が多い。2件以上はサイトで推奨が分かれている */
  weaponIds: string[];
  gearSets: string[];
}

export interface Substitute {
  out: string;
  candidates: string[];
}

export interface Team {
  id: string;
  label: string;
  sources: TeamSource[];
  summary: string;
  note?: string;
  members: TeamMember[];
  substitutes: Substitute[];
}

export interface MainCharacter {
  id: string;
  name: string;
  elements: Element[];
  note?: string;
  teams: Team[];
}

export interface GearBuild {
  type: string;
  set: string | null;
  pieces: string[];
}

export interface CharacterGear {
  character: string;
  builds: GearBuild[];
}

export interface GearSet {
  name: string;
  effect: string;
}
