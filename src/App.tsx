import { useMemo, useState } from 'react';
import { useSimulatorStore } from './store/simulatorStore';
import { calcAreaScores, calcCoFarmable } from './lib/scoring';
import { sortWeapons } from './lib/sorting';
import type { SortOrder } from './lib/sorting';
import { WeaponCard } from './components/WeaponCard';
import { AreaResult } from './components/AreaResult';
import type { Weapon, Area, Effect } from './types';

import weaponsData from './data/weapons.json';
import areasData from './data/areas.json';
import effectsData from './data/effects.json';

const weapons = weaponsData as Weapon[];
const areas = areasData as Area[];
const effects = effectsData as Effect[];

const CATEGORIES = ['すべて', ...Array.from(new Set(weapons.map((w) => w.category)))];
const RARITIES = [6, 5, 4];

const SORT_OPTIONS: { value: SortOrder; label: string }[] = [
  { value: 'default',      label: 'デフォルト' },
  { value: 'rarity-desc',  label: 'レア度↓' },
  { value: 'rarity-asc',   label: 'レア度↑' },
];

const EFFECT_ACCORDIONS = [
  { key: 'base',       label: '基礎効果',   list: effects.filter((e) => e.category === 'base') },
  { key: 'additional', label: '付加効果',   list: effects.filter((e) => e.category === 'additional') },
  { key: 'skill',      label: 'スキル効果', list: effects.filter((e) => e.category === 'skill') },
] as const;

export default function App() {
  const { selectedWeaponIds, toggleWeapon, clearAll } = useSimulatorStore();
  const [categoryFilter, setCategoryFilter] = useState('すべて');
  const [rarityFilter, setRarityFilter] = useState<number | 'all'>('all');
  const [sortOrder, setSortOrder] = useState<SortOrder>('default');
  const [openAccordions, setOpenAccordions] = useState<Set<string>>(new Set());
  const [baseFilter, setBaseFilter] = useState<string | 'all'>('all');
  const [additionalFilter, setAdditionalFilter] = useState<string | 'all'>('all');
  const [skillFilter, setSkillFilter] = useState<string | 'all'>('all');

  const toggleAccordion = (key: string) =>
    setOpenAccordions((prev) => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });

  const effectSetters: Record<string, (v: string | 'all') => void> = {
    base: setBaseFilter,
    additional: setAdditionalFilter,
    skill: setSkillFilter,
  };
  const effectValues: Record<string, string | 'all'> = {
    base: baseFilter,
    additional: additionalFilter,
    skill: skillFilter,
  };

  const effectMap = useMemo(
    () => new Map(effects.map((e) => [e.id, e])),
    [],
  );

  const filteredWeapons = useMemo(() => {
    const filtered = weapons.filter(
      (w) =>
        (categoryFilter === 'すべて'  || w.category === categoryFilter) &&
        (rarityFilter === 'all'       || w.rarity === rarityFilter) &&
        (baseFilter === 'all'         || w.baseEffect === baseFilter) &&
        (additionalFilter === 'all'   || w.additionalEffect === additionalFilter) &&
        (skillFilter === 'all'        || w.skillEffect === skillFilter),
    );
    return sortWeapons(filtered, sortOrder);
  }, [categoryFilter, rarityFilter, baseFilter, additionalFilter, skillFilter, sortOrder]);

  const selectedWeapons = useMemo(
    () => weapons.filter((w) => selectedWeaponIds.has(w.id)),
    [selectedWeaponIds],
  );

  const results = useMemo(
    () => calcAreaScores(selectedWeapons, areas),
    [selectedWeapons],
  );

  // 未選択の武器が同時厳選できるエリアのマップ
  const coFarmableMap = useMemo(
    () => calcCoFarmable(results, weapons, selectedWeaponIds),
    [results, selectedWeaponIds],
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <header className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-xl font-bold">エンドフィールド 基質厳選シミュレーター</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            武器を複数選択 → 同時厳選に最適なエリアをスコア順で表示
          </p>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6 space-y-8">
        {/* Weapon selection */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold">
              武器を選択
              <span className="text-sm font-normal text-gray-500 dark:text-gray-400 ml-2">
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

          {/* Category filter */}
          <div className="flex flex-wrap items-center gap-2 mb-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`text-sm px-3 py-1 rounded-full border transition-colors ${
                  categoryFilter === cat
                    ? 'bg-blue-500 border-blue-500 text-white'
                    : 'border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:border-gray-400'
                }`}
              >
                {cat}
              </button>
            ))}

            {/* Separator */}
            <span className="text-gray-300 dark:text-gray-600 select-none">|</span>

            {/* Sort */}
            {SORT_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setSortOrder(opt.value)}
                className={`text-sm px-3 py-1 rounded-full border transition-colors ${
                  sortOrder === opt.value
                    ? 'bg-amber-500 border-amber-500 text-white'
                    : 'border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:border-gray-400'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {/* Rarity filter */}
          <div className="flex flex-wrap gap-2 mb-2">
            <button
              onClick={() => setRarityFilter('all')}
              className={`text-sm px-3 py-1 rounded-full border transition-colors ${
                rarityFilter === 'all'
                  ? 'bg-blue-500 border-blue-500 text-white'
                  : 'border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:border-gray-400'
              }`}
            >
              すべて
            </button>
            {RARITIES.map((r) => (
              <button
                key={r}
                onClick={() => setRarityFilter(r)}
                className={`text-sm px-3 py-1 rounded-full border transition-colors ${
                  rarityFilter === r
                    ? 'bg-blue-500 border-blue-500 text-white'
                    : 'border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:border-gray-400'
                }`}
              >
                {'★'.repeat(r)}
              </button>
            ))}
          </div>

          {/* Divider */}
          <hr className="border-gray-200 dark:border-gray-700 my-2" />

          {/* Effect accordions */}
          <div className="space-y-1 mb-4">
            {EFFECT_ACCORDIONS.map(({ key, label, list }) => {
              const currentValue = effectValues[key];
              const setter = effectSetters[key];
              const isOpen = openAccordions.has(key);
              const activeEffect = effectMap.get(currentValue as string);
              return (
                <div key={key}>
                  <button
                    onClick={() => toggleAccordion(key)}
                    className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors w-full text-left py-1"
                  >
                    <span className={`inline-block transition-transform text-xs ${isOpen ? 'rotate-90' : ''}`}>▶</span>
                    <span>{label}</span>
                    {currentValue !== 'all' && (
                      <span className="text-xs px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300">
                        {activeEffect?.name ?? currentValue}
                      </span>
                    )}
                  </button>
                  {isOpen && (
                    <div className="flex flex-wrap gap-2 pl-5 pb-2">
                      <button
                        onClick={() => setter('all')}
                        className={`text-sm px-3 py-1 rounded-full border transition-colors ${
                          currentValue === 'all'
                            ? 'bg-blue-500 border-blue-500 text-white'
                            : 'border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:border-gray-400'
                        }`}
                      >
                        すべて
                      </button>
                      {list.map((e) => (
                        <button
                          key={e.id}
                          onClick={() => setter(e.id)}
                          className={`text-sm px-3 py-1 rounded-full border transition-colors ${
                            currentValue === e.id
                              ? 'bg-blue-500 border-blue-500 text-white'
                              : 'border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:border-gray-400'
                          }`}
                        >
                          {e.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {filteredWeapons.map((weapon) => (
              <WeaponCard
                key={weapon.id}
                weapon={weapon}
                effectMap={effectMap}
                selected={selectedWeaponIds.has(weapon.id)}
                coFarmableAreas={coFarmableMap.get(weapon.id)}
                onToggle={() => toggleWeapon(weapon)}
              />
            ))}
          </div>
        </section>

        {/* Results */}
        {selectedWeapons.length > 0 && (
          <section>
            <h2 className="text-lg font-semibold mb-4">
              おすすめ厳選エリア
              <span className="text-sm font-normal text-gray-500 dark:text-gray-400 ml-2">
                ({selectedWeapons.length} 武器 / スコア順)
              </span>
            </h2>
            {results.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                一致するエリアが見つかりません
              </p>
            ) : (
              <div className="space-y-3">
                {results.map((result, i) => (
                  <AreaResult
                    key={result.area.id}
                    result={result}
                    rank={i + 1}
                    total={selectedWeapons.length}
                    effectMap={effectMap}
                    allWeapons={weapons}
                    selectedWeaponIds={selectedWeaponIds}
                    onAddWeapon={(w) => toggleWeapon(w)}
                  />
                ))}
              </div>
            )}
          </section>
        )}

        {selectedWeapons.length === 0 && (
          <div className="text-center py-16 text-gray-400 dark:text-gray-600">
            <p className="text-4xl mb-3">⚔️</p>
            <p className="text-lg">厳選したい武器を選択してください</p>
            <p className="text-sm mt-1">複数選択で同時厳選の最適エリアを計算します</p>
          </div>
        )}
      </main>

      <footer className="border-t border-gray-200 dark:border-gray-700 mt-12 py-4 text-center text-xs text-gray-400 dark:text-gray-600">
        ※ このツールはファンメイドです。Hypergryph・Studio Montagne とは無関係です。
      </footer>
    </div>
  );
}
