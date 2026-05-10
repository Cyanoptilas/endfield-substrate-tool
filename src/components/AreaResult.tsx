import type { AreaScore } from '../types';

interface Props {
  result: AreaScore;
  rank: number;
}

export function AreaResult({ result, rank }: Props) {
  const { area, matchedEffects, matchedWeapons } = result;

  const rankColor =
    rank === 1
      ? 'text-yellow-500'
      : rank === 2
        ? 'text-gray-400'
        : rank === 3
          ? 'text-amber-600'
          : 'text-gray-500';

  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
      <div className="flex items-center gap-3">
        <span className={`text-2xl font-bold w-8 text-center ${rankColor}`}>
          {rank}
        </span>
        <div className="flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="font-semibold text-gray-900 dark:text-gray-100">
              {area.name}
            </p>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {area.chapter}
              {area.difficulty ? ` / ${area.difficulty}` : ''}
            </span>
          </div>
          <div className="flex flex-wrap gap-1 mt-2">
            {matchedEffects.map((e) => (
              <span
                key={e.id}
                className="text-xs px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300"
              >
                {e.name}
              </span>
            ))}
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            対応武器: {matchedWeapons.map((w) => w.name).join(', ')}
          </p>
        </div>
        <div className="text-right shrink-0">
          <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {matchedEffects.length}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">効果一致</p>
        </div>
      </div>
    </div>
  );
}
