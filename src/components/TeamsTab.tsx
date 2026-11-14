import { Fragment, useMemo, useState } from 'react';
import Box from '@mui/material/Box';
import ButtonBase from '@mui/material/ButtonBase';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import type { MainCharacter, Element, Weapon, Effect, CharacterGear, GearSet } from '../types';
import { agreementOf } from '../lib/teams';
import { tokenSx, type ToneName } from '../theme';
import { CharacterTeams } from './TeamDetail';
import { Chevron } from './Chevron';
import { ChipRow, FilterChip, Tag } from './ui';

interface Props {
  characters: MainCharacter[];
  weaponMap: Map<string, Weapon>;
  effectMap: Map<string, Effect>;
  gearMap: Map<string, CharacterGear>;
  gearSetMap: Map<string, GearSet>;
  onUseTeamWeapons: (weaponIds: string[]) => void;
}

const ELEMENTS: Element[] = ['物理', '灼熱', '寒冷', '電磁', '自然'];

// short はスマホ幅で使う短い表記
const AGREEMENT: Record<ReturnType<typeof agreementOf>, { label: string; short: string; tone: ToneName }> = {
  agree: { label: '2サイト一致', short: '一致', tone: 'agree' },
  split: { label: 'サイトで分かれる', short: '分かれる', tone: 'split' },
  single: { label: '1サイトのみ', short: '1サイト', tone: 'neutral' },
};

const SOURCES = [
  { label: 'Game8 最強編成とおすすめパーティ', url: 'https://game8.jp/arknights-endfield/757495' },
  { label: 'Game8 物理属性のおすすめ編成', url: 'https://game8.jp/arknights-endfield/768083' },
  { label: 'Game8 灼熱属性のおすすめ編成', url: 'https://game8.jp/arknights-endfield/767311' },
  { label: 'Game8 寒冷属性のおすすめ編成', url: 'https://game8.jp/arknights-endfield/767239' },
  { label: 'Game8 電磁属性のおすすめ編成', url: 'https://game8.jp/arknights-endfield/768039' },
  { label: 'Game8 自然属性のおすすめ編成', url: 'https://game8.jp/arknights-endfield/802410' },
  { label: 'Game8 装備のキャラ別おすすめ一覧', url: 'https://game8.jp/arknights-endfield/771063' },
  { label: 'Game8 装備のセット効果一覧', url: 'https://game8.jp/arknights-endfield/758648' },
  { label: 'Game8 ダパンのおすすめ装備と武器・編成', url: 'https://game8.jp/arknights-endfield/687527' },
  { label: 'Game8 プチエナのおすすめ装備と編成・武器', url: 'https://game8.jp/arknights-endfield/811012' },
  { label: 'AppMedia 最強パーティとおすすめ編成', url: 'https://appmedia.jp/arknights_endfield/79682426' },
];

// スマホ幅では詳細を開けば分かる列を隠し、表を画面内に収める
const wideOnly = { display: { xs: 'none', sm: 'table-cell' } } as const;

export function TeamsTab({ characters, weaponMap, effectMap, gearMap, gearSetMap, onUseTeamWeapons }: Props) {
  const [elementFilter, setElementFilter] = useState<Element | 'all'>('all');
  const [openId, setOpenId] = useState<string | null>(null);

  const visible = useMemo(
    () => characters.filter((c) => elementFilter === 'all' || c.elements.includes(elementFilter)),
    [characters, elementFilter],
  );

  return (
    <Stack spacing={2}>
      <Box>
        <Typography variant="body1">
          主要アタッカー別のおすすめ編成。キャラを選ぶと編成が開き、メンバーを選ぶと武器と装備が見られます。
        </Typography>
        <Typography variant="caption" color="text.secondary" component="p">
          複数の攻略サイトで一致した内容を優先し、推奨が分かれる箇所は「/」区切りで併記しています（先頭ほど一致が多い）。
        </Typography>
      </Box>

      <ChipRow>
        <FilterChip label="すべて" selected={elementFilter === 'all'} onClick={() => setElementFilter('all')} />
        {ELEMENTS.map((el) => (
          <FilterChip key={el} label={el} selected={elementFilter === el} onClick={() => setElementFilter(el)} />
        ))}
      </ChipRow>

      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>メインキャラ</TableCell>
              <TableCell>属性</TableCell>
              <TableCell sx={wideOnly}>代表編成</TableCell>
              <TableCell sx={{ whiteSpace: 'nowrap' }}>掲載</TableCell>
              <TableCell sx={[wideOnly, { whiteSpace: 'nowrap' }]}>編成数</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {visible.map((c) => {
              const isOpen = openId === c.id;
              const agreement = AGREEMENT[agreementOf(c)];
              const toggle = () => setOpenId(isOpen ? null : c.id);
              return (
                <Fragment key={c.id}>
                  <TableRow
                    hover
                    onClick={toggle}
                    sx={[
                      { cursor: 'pointer', '& > td': { borderBottom: isOpen ? 0 : undefined } },
                      isOpen ? tokenSx((t) => ({ backgroundColor: t.accentSoft })) : {},
                    ]}
                  >
                    <TableCell sx={{ whiteSpace: 'nowrap' }}>
                      <ButtonBase
                        aria-expanded={isOpen}
                        onClick={(e) => { e.stopPropagation(); toggle(); }}
                        sx={{ gap: 1, fontWeight: 700, fontSize: '0.875rem' }}
                      >
                        <Chevron open={isOpen} />
                        {c.name}
                      </ButtonBase>
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" useFlexGap sx={{ flexWrap: 'wrap', gap: 0.5 }}>
                        {c.elements.map((el) => <Tag key={el} tone={el}>{el}</Tag>)}
                      </Stack>
                    </TableCell>
                    <TableCell sx={wideOnly}>
                      <Stack direction="row" useFlexGap sx={{ flexWrap: 'wrap', gap: 0.5 }}>
                        {c.teams[0].members.map((m) =>
                          m.name === c.name ? (
                            <Box
                              key={m.name}
                              component="span"
                              sx={[
                                { fontSize: '0.75rem', lineHeight: 1.5, fontWeight: 700, px: 1, borderRadius: 1, whiteSpace: 'nowrap' },
                                tokenSx((t) => ({ backgroundColor: t.accent, color: t.onAccent })),
                              ]}
                            >
                              {m.name}
                            </Box>
                          ) : (
                            <Tag key={m.name} tone="neutral">{m.name}</Tag>
                          ),
                        )}
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Tag tone={agreement.tone}>
                        <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>{agreement.label}</Box>
                        <Box component="span" sx={{ display: { sm: 'none' } }}>{agreement.short}</Box>
                      </Tag>
                    </TableCell>
                    <TableCell sx={[wideOnly, { whiteSpace: 'nowrap', color: 'text.secondary', fontVariantNumeric: 'tabular-nums' }]}>
                      {c.teams.length}案
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell colSpan={5} sx={{ p: 0, borderBottom: isOpen ? 1 : 0, borderColor: 'divider' }}>
                      {isOpen && (
                        // width:0 + min-width:100% で、詳細の中身が表の列幅を押し広げないようにする
                        <Box sx={{ width: 0, minWidth: '100%', px: { xs: 2, sm: 3 }, py: 3 }}>
                          <CharacterTeams
                            character={c}
                            weaponMap={weaponMap}
                            effectMap={effectMap}
                            gearMap={gearMap}
                            gearSetMap={gearSetMap}
                            onUseTeamWeapons={onUseTeamWeapons}
                          />
                        </Box>
                      )}
                    </TableCell>
                  </TableRow>
                </Fragment>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      <Box component="footer">
        <Typography variant="caption" color="text.secondary" component="p" sx={{ fontWeight: 600 }}>
          情報元（2026-11-14 取得）
        </Typography>
        <Box component="ul" sx={{ m: 0, pl: 3, typography: 'caption' }}>
          {SOURCES.map((s) => (
            <li key={s.url}>
              <Link href={s.url} target="_blank" rel="noopener noreferrer" color="text.secondary">
                {s.label}
              </Link>
            </li>
          ))}
        </Box>
        <Typography variant="caption" color="text.secondary" component="p">
          YouTube の解説動画は、どのキャラをメインに据えるかの裏取りに使用しています。
        </Typography>
      </Box>
    </Stack>
  );
}
