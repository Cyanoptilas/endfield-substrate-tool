import type { AreaScore } from '../types';

interface Props {
  result: AreaScore;
  rank: number;
  total: number;
}

const RANK_STYLE = ['text-yellow-500', 'text-gray-400', 'text-amber-600'];

export function AreaResult({ result, rank, total }: Props) {
  const { area, matchedSkillEffects, matchedWeapons, score } = result;
  const pct = Math.round((score / total) * 100);

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

          <div className="flex flex-wrap gap-1 mt-2">
            {matchedSkillEffects.map((e) => (
              <span
                key={e.id}
                className="text-xs px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300"
              >
                {e.name}
              </span>
            ))}
          </div>

          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 truncate">
            対応: {matchedWeapons.map((w) => w.name).join(' / ')}
          </p>
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
