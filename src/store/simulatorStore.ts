import { create } from 'zustand';
import type { Weapon } from '../types';

interface SimulatorState {
  selectedWeaponIds: Set<string>;
  toggleWeapon: (weapon: Weapon) => void;
  selectWeapons: (ids: string[]) => void;
  clearAll: () => void;
}

export const useSimulatorStore = create<SimulatorState>((set) => ({
  selectedWeaponIds: new Set(),
  toggleWeapon: (weapon) =>
    set((state) => {
      const next = new Set(state.selectedWeaponIds);
      if (next.has(weapon.id)) {
        next.delete(weapon.id);
      } else {
        next.add(weapon.id);
      }
      return { selectedWeaponIds: next };
    }),
  selectWeapons: (ids) => set({ selectedWeaponIds: new Set(ids) }),
  clearAll: () => set({ selectedWeaponIds: new Set() }),
}));
