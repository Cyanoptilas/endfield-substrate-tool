import type { Weapon, Effect, Area } from '../types';

interface Props {
  weapon: Weapon;
  effectMap: Map<string, Effect>;
  selected: boolean;
  coFarmableAreas?: Area[]; // エリア一覧（未選択かつ同時厳選可能な場合に渡される）
  onToggle: () => void;
}

const RARITY_COLOR: Record<number, string> = {
  6: 'text-amber-500',
  5: 'text-purple-500',
  4: 'text-blue-400',
  3: 'text-gray-400',
};

export function WeaponCard({ weapon, effectMap, selected, coFarmableAreas, onToggle }: Props) {
  const base       = effectMap.get(weapon.baseEffect);
  const additional = effectMap.get(weapon.additionalEffect);
  const skill      = effectMap.get(weapon.skillEffect);

  const isCoFarmable = !selected && coFarmableAreas && coFarmableAreas.length > 0;

  return (
    <button
      onClick={onToggle}
      className={`w-full text-left rounded-xl border-2 p-3 transition-all cursor-pointer ${
        selected
          ? 'border-blue-500 bg-blue-50 dark:bg-blue-950'
          : isCoFarmable
            ? 'border-green-400 dark:border-green-600 bg-white dark:bg-gray-800 hover:border-green-500'
            : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600'
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className={`text-xs font-bold leading-none mb-0.5 ${RARITY_COLOR[weapon.rarity] ?? 'text-gray-400'}`}>
            {'★'.repeat(weapon.rarity)}
          </p>
          <p className="font-semibold text-gray-900 dark:text-gray-100 truncate">{weapon.name}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">{weapon.category}</p>
        </div>
        {selected && <span className="shrink-0 text-blue-500 text-lg leading-none">✓</span>}
      </div>

      <div className="flex flex-wrap gap-1 mt-2">
        <span className="text-xs px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400">
          {base?.name ?? weapon.baseEffect}
        </span>
        <span className="text-xs px-1.5 py-0.5 rounded bg-orange-100 dark:bg-orange-900/40 text-orange-700 dark:text-orange-300">
          {additional?.name ?? weapon.additionalEffect}
        </span>
        <span className="text-xs px-1.5 py-0.5 rounded bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300">
          {skill?.name ?? weapon.skillEffect}
        </span>
      </div>

      {isCoFarmable && (
        <div className="mt-2 flex flex-wrap gap-1">
          {coFarmableAreas.map((area) => (
            <span
              key={area.id}
              className="text-xs px-1.5 py-0.5 rounded-full bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300"
            >
              ✓ {area.name}
            </span>
          ))}
        </div>
      )}
    </button>
  );
}
