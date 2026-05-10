import type { AreaScore, Effect, Weapon } from '../types';

interface Props {
  result: AreaScore;
  rank: number;
  total: number;
  effectMap: Map<string, Effect>;
  allWeapons: Weapon[];
  selectedWeaponIds: Set<string>;
  onAddWeapon: (weapon: Weapon) => void;
}

const RANK_STYLE = ['text-yellow-500', 'text-gray-400', 'text-amber-600'];

export function AreaResult({
  result, rank, total, effectMap,
  allWeapons, selectedWeaponIds, onAddWeapon,
}: Props) {
  const { area, matchedWeapons, score } = result;
  const pct = Math.round((score / total) * 100);

  const additionalSet = new Set(matchedWeapons.map((w) => w.additionalEffect));
  const skillSet      = new Set(matchedWeapons.map((w) => w.skillEffect));

  // 未選択だがこのエリアで同時厳選できる武器
  const coFarmableWeapons = allWeapons.filter(
    (w) =>
      !selectedWeaponIds.has(w.id) &&
      area.additionalEffects.includes(w.additionalEffect) &&
      area.skillEffects.includes(w.skillEffect),
  );

  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
      <div className="flex items-start gap-3">
        <span className={`text-2xl font-bold w-8 text-center shrink-0 ${RANK_STYLE[rank - 1] ?? 'text-gray-500'}`}>
          {rank}
        </span>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="font-semibold text-gray-900 dark:text-gray-100">{area.name}</p>
            <span className="text-xs text-gray-400">{area.nameEn}</span>
          </div>

          {/* 一致した付加効果・スキル効果 */}
          <div className="flex flex-wrap gap-1 mt-2">
            {[...additionalSet].map((id) => (
              <span key={id} className="text-xs px-1.5 py-0.5 rounded bg-orange-100 dark:bg-orange-900/40 text-orange-700 dark:text-orange-300">
                {effectMap.get(id)?.name ?? id}
              </span>
            ))}
            {[...skillSet].map((id) => (
              <span key={id} className="text-xs px-1.5 py-0.5 rounded bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300">
                {effectMap.get(id)?.name ?? id}
              </span>
            ))}
          </div>

          {/* 選択中の対応武器 */}
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 truncate">
            {matchedWeapons.map((w) => w.name).join(' / ')}
          </p>

          {/* 同時厳選できる未選択武器 */}
          {coFarmableWeapons.length > 0 && (
            <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
              <p className="text-xs text-green-600 dark:text-green-400 font-medium mb-1.5">
                同時厳選できる武器
              </p>
              <div className="flex flex-wrap gap-1.5">
                {coFarmableWeapons.map((w) => (
                  <button
                    key={w.id}
                    onClick={() => onAddWeapon(w)}
                    className="text-xs px-2 py-1 rounded-full border border-green-400 dark:border-green-600 text-green-700 dark:text-green-300 hover:bg-green-50 dark:hover:bg-green-900/30 transition-colors"
                  >
                    + {w.name}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="text-right shrink-0">
          <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{score}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">/{total} 武器</p>
          <p className="text-xs text-gray-400">{pct}%</p>
        </div>
      </div>
    </div>
  );
}
