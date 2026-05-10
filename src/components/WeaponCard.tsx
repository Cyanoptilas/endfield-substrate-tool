import type { Weapon, Effect } from '../types';

interface Props {
  weapon: Weapon;
  skillEffectMap: Map<string, Effect>;
  selected: boolean;
  onToggle: () => void;
}

const RARITY_COLOR: Record<number, string> = {
  6: 'text-amber-500',
  5: 'text-purple-500',
  4: 'text-blue-500',
};

export function WeaponCard({ weapon, skillEffectMap, selected, onToggle }: Props) {
  const effect = skillEffectMap.get(weapon.skillEffect);

  return (
    <button
      onClick={onToggle}
      className={`w-full text-left rounded-xl border-2 p-3 transition-all cursor-pointer ${
        selected
          ? 'border-blue-500 bg-blue-50 dark:bg-blue-950'
          : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600'
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className={`text-xs font-bold ${RARITY_COLOR[weapon.rarity] ?? 'text-gray-400'}`}>
            {'★'.repeat(weapon.rarity)}
          </p>
          <p className="font-semibold text-gray-900 dark:text-gray-100 truncate">
            {weapon.name}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">{weapon.category}</p>
        </div>
        {selected && <span className="shrink-0 text-blue-500 text-lg">✓</span>}
      </div>
      {effect && (
        <span className="inline-block mt-2 text-xs px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300">
          {effect.name}
        </span>
      )}
    </button>
  );
}
