import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import type { AreaScore, Effect, Weapon } from '../types';
import { fonts, rankSx, toneSx, toneTextSx, tokenSx } from '../theme';
import { Tag } from './ui';

interface Props {
  result: AreaScore;
  rank: number;
  total: number;
  effectMap: Map<string, Effect>;
  allWeapons: Weapon[];
  selectedWeaponIds: Set<string>;
  onAddWeapon: (weapon: Weapon) => void;
}

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
    <Paper sx={{ p: 2 }}>
      <Stack direction="row" sx={{ alignItems: 'flex-start', gap: 1.5 }}>
        <Typography
          component="span"
          sx={[
            { fontFamily: fonts.mono, fontSize: '1.5rem', fontWeight: 500, width: 32, textAlign: 'center', flexShrink: 0, lineHeight: 1.2 },
            rankSx(rank),
          ]}
        >
          {rank}
        </Typography>

        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Stack direction="row" useFlexGap sx={{ alignItems: 'baseline', flexWrap: 'wrap', columnGap: 1 }}>
            <Typography component="p" sx={{ fontWeight: 600 }}>{area.name}</Typography>
            <Typography component="span" variant="caption" color="text.disabled">{area.nameEn}</Typography>
          </Stack>

          {/* 一致した付加効果・スキル効果 */}
          <Stack direction="row" useFlexGap sx={{ flexWrap: 'wrap', gap: 0.5, mt: 1 }}>
            {[...additionalSet].map((id) => (
              <Tag key={id} tone="additional">{effectMap.get(id)?.name ?? id}</Tag>
            ))}
            {[...skillSet].map((id) => (
              <Tag key={id} tone="skill">{effectMap.get(id)?.name ?? id}</Tag>
            ))}
          </Stack>

          {/* 選択中の対応武器 */}
          <Typography component="p" variant="caption" color="text.secondary" noWrap sx={{ mt: 1 }}>
            {matchedWeapons.map((w) => w.name).join(' / ')}
          </Typography>

          {/* 同時厳選できる未選択武器 */}
          {coFarmableWeapons.length > 0 && (
            <Box sx={{ mt: 1.5, pt: 1.5, borderTop: 1, borderColor: 'divider' }}>
              <Typography component="p" variant="caption" sx={[{ fontWeight: 600, mb: 1 }, toneTextSx('cofarm')]}>
                同時厳選できる武器
              </Typography>
              <Stack direction="row" useFlexGap sx={{ flexWrap: 'wrap', gap: 1 }}>
                {coFarmableWeapons.map((w) => (
                  <Chip
                    key={w.id}
                    size="small"
                    variant="outlined"
                    label={`+ ${w.name}`}
                    onClick={() => onAddWeapon(w)}
                    sx={[toneSx('cofarm', true), { bgcolor: 'transparent' }]}
                  />
                ))}
              </Stack>
            </Box>
          )}
        </Box>

        <Box sx={{ textAlign: 'right', flexShrink: 0 }}>
          <Typography
            component="p"
            sx={[{ fontFamily: fonts.mono, fontSize: '1.5rem', fontWeight: 500, lineHeight: 1.2 }, tokenSx((t) => ({ color: t.accentInk }))]}
          >
            {score}
          </Typography>
          <Typography component="p" variant="caption" color="text.secondary" sx={{ fontVariantNumeric: 'tabular-nums' }}>
            /{total} 武器
          </Typography>
          <Typography component="p" variant="caption" color="text.disabled" sx={{ fontVariantNumeric: 'tabular-nums' }}>
            {pct}%
          </Typography>
        </Box>
      </Stack>
    </Paper>
  );
}
