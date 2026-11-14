import { useMemo, useState } from 'react';
import { useSimulatorStore } from './store/simulatorStore';
import { calcAreaScores, calcCoFarmable } from './lib/scoring';
import { sortWeapons } from './lib/sorting';
import type { SortOrder } from './lib/sorting';
import { WeaponCard } from './components/WeaponCard';
import { AreaResult } from './components/AreaResult';
import { TeamsTab } from './components/TeamsTab';
import { ChipRow, FilterChip, Tag } from './components/ui';
import { Chevron } from './components/Chevron';
import { tokenSx } from './theme';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import ButtonBase from '@mui/material/ButtonBase';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Typography from '@mui/material/Typography';
import type { Weapon, Area, Effect, MainCharacter, CharacterGear, GearSet } from './types';

import weaponsData from './data/weapons.json';
import areasData from './data/areas.json';
import effectsData from './data/effects.json';
import teamsData from './data/teams.json';
import gearBuildsData from './data/gearBuilds.json';
import gearSetsData from './data/gearSets.json';

const weapons = weaponsData as Weapon[];
const areas = areasData as Area[];
const effects = effectsData as Effect[];
const characters = teamsData as MainCharacter[];

const weaponMap = new Map(weapons.map((w) => [w.id, w]));
const gearMap = new Map((gearBuildsData as CharacterGear[]).map((g) => [g.character, g]));
const gearSetMap = new Map((gearSetsData as GearSet[]).map((s) => [s.name, s]));

type TabValue = 'simulator' | 'teams';

const TABS: { value: TabValue; label: string; description: string }[] = [
  { value: 'simulator', label: '基質シミュレーター', description: '武器を複数選択 → 同時厳選に最適なエリアをスコア順で表示' },
  { value: 'teams',     label: 'おすすめ編成',       description: 'メインキャラ別のおすすめ編成と装備（攻略サイトの比較）' },
];

const tabFromHash = (): TabValue => (window.location.hash === '#teams' ? 'teams' : 'simulator');

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
  const { selectedWeaponIds, toggleWeapon, selectWeapons, clearAll } = useSimulatorStore();
  const [tab, setTab] = useState<TabValue>(tabFromHash);
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
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });

  const isFilterActive =
    categoryFilter !== 'すべて' ||
    rarityFilter !== 'all' ||
    baseFilter !== 'all' ||
    additionalFilter !== 'all' ||
    skillFilter !== 'all';

  const resetFilters = () => {
    setCategoryFilter('すべて');
    setRarityFilter('all');
    setBaseFilter('all');
    setAdditionalFilter('all');
    setSkillFilter('all');
  };

  const changeTab = (next: TabValue) => {
    setTab(next);
    const url = window.location.pathname + window.location.search + (next === 'teams' ? '#teams' : '');
    window.history.replaceState(null, '', url);
  };

  // 編成タブの武器をまとめて選択し、シミュレーターに切り替える。
  // 武器フィルターが掛かっていると選んだ武器が一覧に出ないので解除しておく
  const applyTeamWeapons = (weaponIds: string[]) => {
    selectWeapons(weaponIds);
    resetFilters();
    changeTab('simulator');
    window.scrollTo({ top: 0 });
  };

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
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', color: 'text.primary' }}>
      <Box component="header" sx={{ borderBottom: 1, borderColor: 'divider', bgcolor: 'background.paper' }}>
        <Container maxWidth="md" sx={{ pt: 3 }}>
          <Typography variant="h1">エンドフィールド 基質厳選シミュレーター</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            {TABS.find((t) => t.value === tab)?.description}
          </Typography>
          <Tabs
            value={tab}
            onChange={(_, v: TabValue) => changeTab(v)}
            textColor="inherit"
            sx={[{ mt: 1.5, minHeight: 44 }, tokenSx((t) => ({ '--Tabs-indicator': t.accentInk }))]}
            slotProps={{ indicator: { sx: { height: 3, bgcolor: 'var(--Tabs-indicator)' } } }}
          >
            {TABS.map((t) => (
              <Tab key={t.value} value={t.value} label={t.label} disableRipple />
            ))}
          </Tabs>
        </Container>
      </Box>

      <Container component="main" maxWidth="md" sx={{ py: 3 }} hidden={tab !== 'teams'}>
        <TeamsTab
          characters={characters}
          weaponMap={weaponMap}
          effectMap={effectMap}
          gearMap={gearMap}
          gearSetMap={gearSetMap}
          onUseTeamWeapons={applyTeamWeapons}
        />
      </Container>

      <Container component="main" maxWidth="md" sx={{ py: 3 }} hidden={tab !== 'simulator'}>
        <Stack spacing={4}>
          {/* Weapon selection */}
          <Box component="section">
            <Stack direction="row" sx={{ alignItems: 'baseline', gap: 1.5, mb: 1.5 }}>
              <Typography variant="h2">
                武器を選択
                <Typography component="span" variant="body2" color="text.secondary" sx={{ ml: 1, fontVariantNumeric: 'tabular-nums' }}>
                  ({selectedWeaponIds.size} 選択中)
                </Typography>
              </Typography>
              {selectedWeaponIds.size > 0 && (
                <Button size="small" color="error" onClick={clearAll} sx={{ minWidth: 0, px: 1 }}>
                  武器選択を解除
                </Button>
              )}
            </Stack>

            <Stack spacing={1}>
              {/* Category filter + sort */}
              <Stack direction="row" useFlexGap sx={{ flexWrap: 'wrap', alignItems: 'center', gap: 1 }}>
                {CATEGORIES.map((cat) => (
                  <FilterChip key={cat} label={cat} selected={categoryFilter === cat} onClick={() => setCategoryFilter(cat)} />
                ))}
                <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />
                {SORT_OPTIONS.map((opt) => (
                  <FilterChip key={opt.value} label={opt.label} selected={sortOrder === opt.value} onClick={() => setSortOrder(opt.value)} />
                ))}
                {isFilterActive && (
                  <Button size="small" color="error" onClick={resetFilters} sx={{ ml: 'auto', minWidth: 0, px: 1 }}>
                    フィルターをリセット
                  </Button>
                )}
              </Stack>

              {/* Rarity filter */}
              <ChipRow>
                <FilterChip label="すべて" selected={rarityFilter === 'all'} onClick={() => setRarityFilter('all')} />
                {RARITIES.map((r) => (
                  <FilterChip key={r} label={'★'.repeat(r)} selected={rarityFilter === r} onClick={() => setRarityFilter(r)} />
                ))}
              </ChipRow>
            </Stack>

            <Divider sx={{ my: 1.5 }} />

            {/* Effect accordions */}
            <Stack sx={{ mb: 2 }}>
              {EFFECT_ACCORDIONS.map(({ key, label, list }) => {
                const currentValue = effectValues[key];
                const setter = effectSetters[key];
                const isOpen = openAccordions.has(key);
                const activeEffect = effectMap.get(currentValue as string);
                return (
                  <Box key={key}>
                    <ButtonBase
                      onClick={() => toggleAccordion(key)}
                      aria-expanded={isOpen}
                      sx={{ gap: 1, py: 1, color: 'text.secondary', '&:hover': { color: 'text.primary' }, typography: 'body2' }}
                    >
                      <Chevron open={isOpen} />
                      <span>{label}</span>
                      {currentValue !== 'all' && <Tag tone="neutral" outlined>{activeEffect?.name ?? currentValue}</Tag>}
                    </ButtonBase>
                    {isOpen && (
                      <Box sx={{ pl: 3, pb: 1 }}>
                        <ChipRow>
                          <FilterChip label="すべて" selected={currentValue === 'all'} onClick={() => setter('all')} />
                          {list.map((e) => (
                            <FilterChip key={e.id} label={e.name} selected={currentValue === e.id} onClick={() => setter(e.id)} />
                          ))}
                        </ChipRow>
                      </Box>
                    )}
                  </Box>
                );
              })}
            </Stack>

            <Box
              sx={{
                display: 'grid',
                gap: 1.5,
                gridTemplateColumns: { xs: 'minmax(0, 1fr)', sm: 'repeat(2, minmax(0, 1fr))', md: 'repeat(3, minmax(0, 1fr))' },
              }}
            >
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
            </Box>
          </Box>

          {/* Results */}
          {selectedWeapons.length > 0 && (
            <Box component="section">
              <Typography variant="h2" sx={{ mb: 2 }}>
                おすすめ厳選エリア
                <Typography component="span" variant="body2" color="text.secondary" sx={{ ml: 1, fontVariantNumeric: 'tabular-nums' }}>
                  ({selectedWeapons.length} 武器 / スコア順)
                </Typography>
              </Typography>
              {results.length === 0 ? (
                <Typography color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
                  一致するエリアが見つかりません
                </Typography>
              ) : (
                <Stack spacing={1.5}>
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
                </Stack>
              )}
            </Box>
          )}

          {selectedWeapons.length === 0 && (
            <Box sx={{ textAlign: 'center', py: 6, color: 'text.disabled' }}>
              <Typography sx={{ fontSize: '1.0625rem', fontWeight: 600 }}>厳選したい武器を選択してください</Typography>
              <Typography variant="body2" sx={{ mt: 0.5 }}>複数選択で同時厳選の最適エリアを計算します</Typography>
            </Box>
          )}
        </Stack>
      </Container>

      <Box component="footer" sx={{ borderTop: 1, borderColor: 'divider', mt: 6, py: 2, px: 2, textAlign: 'center' }}>
        <Typography variant="caption" color="text.disabled">
          ※ このツールはファンメイドです。Hypergryph・Studio Montagne とは無関係です。
        </Typography>
      </Box>
    </Box>
  );
}
