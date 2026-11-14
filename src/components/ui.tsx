import type { ReactNode } from 'react';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import { toneSx, type ToneName } from '../theme';

/** 絞り込み用の選択チップ。選択中はアクセント色で塗る */
export function FilterChip({ label, selected, onClick }: { label: ReactNode; selected: boolean; onClick: () => void }) {
  return (
    <Chip
      label={label}
      onClick={onClick}
      aria-pressed={selected}
      color={selected ? 'primary' : 'default'}
      variant={selected ? 'filled' : 'outlined'}
    />
  );
}

/** 横並びのチップ行（折り返しあり） */
export function ChipRow({ children }: { children: ReactNode }) {
  return (
    <Stack direction="row" useFlexGap sx={{ flexWrap: 'wrap', gap: 1 }}>
      {children}
    </Stack>
  );
}

/** 小さなラベル（効果名・属性・一致度など） */
export function Tag({ tone, children, outlined = false }: { tone: ToneName; children: ReactNode; outlined?: boolean }) {
  return (
    <Box
      component="span"
      sx={[
        {
          display: 'inline-flex',
          alignItems: 'center',
          fontSize: '0.75rem',
          lineHeight: 1.5,
          px: 1,
          borderRadius: 1,
          whiteSpace: 'nowrap',
          border: '1px solid transparent',
        },
        toneSx(tone, outlined),
      ]}
    >
      {children}
    </Box>
  );
}
