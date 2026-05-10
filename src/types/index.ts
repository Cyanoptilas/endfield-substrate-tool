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
  skillEffect: string; // skill effect ID this weapon needs
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
  matchedSkillEffects: Effect[];
  matchedWeapons: Weapon[];
  score: number;
}
