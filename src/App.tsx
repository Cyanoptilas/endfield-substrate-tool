import { useMemo } from 'react';
import { useSimulatorStore } from './store/simulatorStore';
import { calcAreaScores } from './lib/scoring';
import { WeaponCard } from './components/WeaponCard';
import { AreaResult } from './components/AreaResult';
import type { Weapon, Area, Effect } from './types';

import weaponsData from './data/weapons.json';
import areasData from './data/areas.json';
import effectsData from './data/effects.json';

const weapons = weaponsData as Weapon[];
const areas = areasData as Area[];
const effects = effectsData as Effect[];

export default function App() {
  const { selectedWeaponIds, toggleWeapon, clearAll } = useSimulatorStore();

  const selectedWeapons = useMemo(
    () => weapons.filter((w) => selectedWeaponIds.has(w.id)),
    [selectedWeaponIds],
  );

  const results = useMemo(
    () => calcAreaScores(selectedWeapons, areas, effects),
    [selectedWeapons],
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <header className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-xl font-bold">エンドフィールド 基質厳選シミュレーター</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            武器を選択すると、同時厳選に最適なエリアを表示します
          </p>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6 space-y-8">
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">
              武器を選択{' '}
              <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
                ({selectedWeaponIds.size} 選択中)
              </span>
            </h2>
            {selectedWeaponIds.size > 0 && (
              <button
                onClick={clearAll}
                className="text-sm text-red-500 hover:text-red-700 dark:hover:text-red-400 transition-colors"
              >
                すべて解除
              </button>
            )}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {weapons.map((weapon) => (
              <WeaponCard
                key={weapon.id}
                weapon={weapon}
                effects={effects}
                selected={selectedWeaponIds.has(weapon.id)}
                onToggle={() => toggleWeapon(weapon)}
              />
            ))}
          </div>
        </section>

        {selectedWeapons.length > 0 && (
          <section>
            <h2 className="text-lg font-semibold mb-4">
              おすすめ厳選エリア
              <span className="text-sm font-normal text-gray-500 dark:text-gray-400 ml-2">
                (スコア順)
              </span>
            </h2>
            {results.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                一致するエリアが見つかりません
              </p>
            ) : (
              <div className="space-y-3">
                {results.map((result, i) => (
                  <AreaResult key={result.area.id} result={result} rank={i + 1} />
                ))}
              </div>
            )}
          </section>
        )}

        {selectedWeapons.length === 0 && (
          <div className="text-center py-16 text-gray-400 dark:text-gray-600">
            <p className="text-4xl mb-3">⚔️</p>
            <p className="text-lg">武器を選択してください</p>
          </div>
        )}
      </main>

      <footer className="border-t border-gray-200 dark:border-gray-700 mt-12 py-4 text-center text-xs text-gray-400 dark:text-gray-600">
        ※ このツールはファンメイドです。Hypergryph・Studio Montagne とは無関係です。
      </footer>
    </div>
  );
}
