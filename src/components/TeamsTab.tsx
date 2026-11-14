import { Fragment, useMemo, useState } from 'react';
import type { MainCharacter, Element, Weapon, Effect, CharacterGear, GearSet } from '../types';
import { CharacterTeams, ElementBadge } from './TeamDetail';
import { agreementOf } from '../lib/teams';

interface Props {
  characters: MainCharacter[];
  weaponMap: Map<string, Weapon>;
  effectMap: Map<string, Effect>;
  gearMap: Map<string, CharacterGear>;
  gearSetMap: Map<string, GearSet>;
  onUseTeamWeapons: (weaponIds: string[]) => void;
}

const ELEMENTS: Element[] = ['物理', '灼熱', '寒冷', '電磁', '自然'];

const AGREEMENT_STYLE = {
  agree: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300',
  split: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
  single: 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300',
} as const;

const AGREEMENT_LABEL = {
  agree: '2サイト一致',
  split: 'サイトで分かれる',
  single: '1サイトのみ',
} as const;

const SOURCES = [
  { label: 'Game8 最強編成とおすすめパーティ', url: 'https://game8.jp/arknights-endfield/757495' },
  { label: 'Game8 装備のキャラ別おすすめ一覧', url: 'https://game8.jp/arknights-endfield/771063' },
  { label: 'Game8 装備のセット効果一覧', url: 'https://game8.jp/arknights-endfield/758648' },
  { label: 'AppMedia 最強パーティとおすすめ編成', url: 'https://appmedia.jp/arknights_endfield/79682426' },
];

export function TeamsTab({ characters, weaponMap, effectMap, gearMap, gearSetMap, onUseTeamWeapons }: Props) {
  const [elementFilter, setElementFilter] = useState<Element | 'all'>('all');
  const [openId, setOpenId] = useState<string | null>(null);

  const visible = useMemo(
    () => characters.filter((c) => elementFilter === 'all' || c.elements.includes(elementFilter)),
    [characters, elementFilter],
  );

  return (
    <div className="space-y-4">
      <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
        <p>
          主要アタッカー別のおすすめ編成です。行をクリックすると編成の詳細が開き、メンバーをクリックするとおすすめ武器・装備が見られます。
        </p>
        <p className="text-xs">
          複数の攻略サイトで一致した内容を優先し、意見が分かれる箇所は「/」区切りで併記しています（先頭ほど一致が多い）。
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {(['all', ...ELEMENTS] as const).map((el) => (
          <button
            key={el}
            onClick={() => setElementFilter(el)}
            className={`text-sm px-3 py-1 rounded-full border transition-colors ${
              elementFilter === el
                ? 'bg-blue-500 border-blue-500 text-white'
                : 'border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:border-gray-400'
            }`}
          >
            {el === 'all' ? 'すべて' : el}
          </button>
        ))}
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
              <th className="px-2 sm:px-3 py-2 font-medium">メインキャラ</th>
              <th className="px-2 sm:px-3 py-2 font-medium">属性</th>
              <th className="px-2 sm:px-3 py-2 font-medium hidden sm:table-cell">代表編成</th>
              <th className="px-2 sm:px-3 py-2 font-medium whitespace-nowrap">掲載</th>
              <th className="px-2 sm:px-3 py-2 font-medium whitespace-nowrap hidden sm:table-cell">編成数</th>
            </tr>
          </thead>
          <tbody>
            {visible.map((c) => {
              const isOpen = openId === c.id;
              const agreement = agreementOf(c);
              return (
                <Fragment key={c.id}>
                  <tr
                    onClick={() => setOpenId(isOpen ? null : c.id)}
                    className={`border-b border-gray-100 dark:border-gray-700/60 cursor-pointer transition-colors ${
                      isOpen ? 'bg-blue-50 dark:bg-blue-950/40' : 'hover:bg-gray-50 dark:hover:bg-gray-700/40'
                    }`}
                  >
                    <td className="px-2 sm:px-3 py-2 font-semibold whitespace-nowrap">
                      <button
                        type="button"
                        aria-expanded={isOpen}
                        className="flex items-center gap-2 text-left"
                      >
                        <span className={`inline-block transition-transform text-xs text-gray-400 ${isOpen ? 'rotate-90' : ''}`}>▶</span>
                        {c.name}
                      </button>
                    </td>
                    <td className="px-2 sm:px-3 py-2">
                      <div className="flex flex-wrap gap-1">
                        {c.elements.map((el) => <ElementBadge key={el} element={el} />)}
                      </div>
                    </td>
                    <td className="px-2 sm:px-3 py-2 hidden sm:table-cell">
                      <div className="flex flex-wrap gap-1">
                        {c.teams[0].members.map((m) => (
                          <span
                            key={m.name}
                            className={`text-xs px-1.5 py-0.5 rounded whitespace-nowrap ${
                              m.name === c.name
                                ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300 font-semibold'
                                : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                            }`}
                          >
                            {m.name}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-2 sm:px-3 py-2">
                      <span className={`text-xs px-1.5 py-0.5 rounded whitespace-nowrap ${AGREEMENT_STYLE[agreement]}`}>
                        {AGREEMENT_LABEL[agreement]}
                      </span>
                    </td>
                    <td className="px-2 sm:px-3 py-2 text-gray-500 dark:text-gray-400 whitespace-nowrap hidden sm:table-cell">{c.teams.length}案</td>
                  </tr>
                  {isOpen && (
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <td colSpan={5} className="px-2 sm:px-3 py-4 bg-gray-50 dark:bg-gray-900/40">
                        {/* w-0 min-w-full: 詳細の中身で表の列幅が変わらないようにする */}
                        <div className="w-0 min-w-full">
                        <CharacterTeams
                          character={c}
                          weaponMap={weaponMap}
                          effectMap={effectMap}
                          gearMap={gearMap}
                          gearSetMap={gearSetMap}
                          onUseTeamWeapons={onUseTeamWeapons}
                        />
                        </div>
                      </td>
                    </tr>
                  )}
                </Fragment>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
        <p className="font-medium">情報元（2026-11-14 取得）</p>
        <ul className="list-disc pl-5 space-y-0.5">
          {SOURCES.map((s) => (
            <li key={s.url}>
              <a href={s.url} target="_blank" rel="noopener noreferrer" className="underline hover:text-gray-700 dark:hover:text-gray-200">
                {s.label}
              </a>
            </li>
          ))}
        </ul>
        <p>
          YouTube の解説動画は、どのキャラをメインに据えるかの裏取りに使用しています（スー・ミンホのメイン運用など）。
        </p>
      </div>
    </div>
  );
}
