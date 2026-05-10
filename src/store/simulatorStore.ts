import { create } from 'zustand';
import type { Weapon } from '../types';

interface SimulatorState {
  selectedWeaponIds: Set<string>;
  toggleWeapon: (weapon: Weapon) => void;
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
  clearAll: () => set({ selectedWeaponIds: new Set() }),
}));
