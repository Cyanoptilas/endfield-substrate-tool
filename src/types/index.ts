export type EffectCategory =
  | 'atk'
  | 'def'
  | 'hp'
  | 'spd'
  | 'skill_dmg'
  | 'crit_rate'
  | 'crit_dmg'
  | 'elem_dmg'
  | 'resistance'
  | 'other';

export interface Effect {
  id: string;
  name: string;
  category: EffectCategory;
  description?: string;
}

export interface Weapon {
  id: string;
  name: string;
  type: string;
  desiredEffects: string[]; // Effect IDs
}

export interface Area {
  id: string;
  name: string;
  chapter: string;
  difficulty?: string;
  possibleEffects: string[]; // Effect IDs
}

export interface AreaScore {
  area: Area;
  matchedEffects: Effect[];
  score: number;
  matchedWeapons: Weapon[];
}
