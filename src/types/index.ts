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
