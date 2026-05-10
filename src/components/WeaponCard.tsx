import type { Weapon, Effect } from '../types';

interface Props {
  weapon: Weapon;
  effects: Effect[];
  selected: boolean;
  onToggle: () => void;
}

export function WeaponCard({ weapon, effects, selected, onToggle }: Props) {
  const effectMap = new Map(effects.map((e) => [e.id, e]));

  return (
    <button
      onClick={onToggle}
      className={`w-full text-left rounded-xl border-2 p-4 transition-all cursor-pointer ${
        selected
          ? 'border-blue-500 bg-blue-50 dark:bg-blue-950'
          : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600'
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="font-semibold text-gray-900 dark:text-gray-100">
            {weapon.name}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            {weapon.type}
          </p>
        </div>
        {selected && (
          <span className="shrink-0 text-blue-500 text-lg">✓</span>
        )}
      </div>
      <div className="flex flex-wrap gap-1 mt-3">
        {weapon.desiredEffects.map((id) => {
          const effect = effectMap.get(id);
          return (
            <span
              key={id}
              className="text-xs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
            >
              {effect?.name ?? id}
            </span>
          );
        })}
      </div>
    </button>
  );
}
