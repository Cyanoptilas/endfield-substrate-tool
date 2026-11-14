import Box from '@mui/material/Box';
import ButtonBase from '@mui/material/ButtonBase';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import type { Weapon, Effect, Area } from '../types';
import { raritySx, tones, tokenSx } from '../theme';
import { Tag } from './ui';

interface Props {
  weapon: Weapon;
  effectMap: Map<string, Effect>;
  selected: boolean;
  coFarmableAreas?: Area[]; // エリア一覧（未選択かつ同時厳選可能な場合に渡される）
  onToggle: () => void;
}

export function WeaponCard({ weapon, effectMap, selected, coFarmableAreas, onToggle }: Props) {
  const base       = effectMap.get(weapon.baseEffect);
  const additional = effectMap.get(weapon.additionalEffect);
  const skill      = effectMap.get(weapon.skillEffect);

  const isCoFarmable = !selected && coFarmableAreas && coFarmableAreas.length > 0;

  return (
    <ButtonBase
      onClick={onToggle}
      aria-pressed={selected}
      sx={[
        (theme) => ({
          display: 'block',
          width: '100%',
          textAlign: 'left',
          p: 1.5,
          borderRadius: 2,
          border: '2px solid',
          borderColor: 'divider',
          bgcolor: 'background.paper',
          transition: theme.transitions.create('border-color', { duration: theme.transitions.duration.shorter }),
          '&:hover': { borderColor: 'text.disabled' },
        }),
        isCoFarmable
          ? (theme) => ({
              borderColor: tones.cofarm.light.line,
              ...theme.applyStyles('dark', { borderColor: tones.cofarm.dark.line }),
            })
          : {},
        selected ? tokenSx((t) => ({ borderColor: t.accentInk, backgroundColor: t.accentSoft })) : {},
      ]}
    >
      <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'flex-start', gap: 1 }}>
        <Box sx={{ minWidth: 0 }}>
          <Typography
            component="p"
            sx={[{ fontSize: '0.75rem', fontWeight: 700, lineHeight: 1, mb: 0.5 }, raritySx(weapon.rarity)]}
          >
            {'★'.repeat(weapon.rarity)}
          </Typography>
          <Typography component="p" noWrap sx={{ fontWeight: 600 }}>{weapon.name}</Typography>
          <Typography component="p" variant="caption" color="text.secondary">{weapon.category}</Typography>
        </Box>
        {selected && (
          <Typography component="span" sx={[{ fontWeight: 700, lineHeight: 1 }, tokenSx((t) => ({ color: t.accentInk }))]}>
            ✓
          </Typography>
        )}
      </Stack>

      <Stack direction="row" useFlexGap sx={{ flexWrap: 'wrap', gap: 0.5, mt: 1 }}>
        <Tag tone="neutral">{base?.name ?? weapon.baseEffect}</Tag>
        <Tag tone="additional">{additional?.name ?? weapon.additionalEffect}</Tag>
        <Tag tone="skill">{skill?.name ?? weapon.skillEffect}</Tag>
      </Stack>

      {isCoFarmable && (
        <Stack direction="row" useFlexGap sx={{ flexWrap: 'wrap', gap: 0.5, mt: 1 }}>
          {coFarmableAreas.map((area) => (
            <Tag key={area.id} tone="cofarm">✓ {area.name}</Tag>
          ))}
        </Stack>
      )}
    </ButtonBase>
  );
}
