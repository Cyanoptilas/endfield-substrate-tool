import Box from '@mui/material/Box';

/** 開閉状態を示す小さな三角。開くと90°回る */
export function Chevron({ open }: { open: boolean }) {
  return (
    <Box
      component="svg"
      viewBox="0 0 10 10"
      aria-hidden
      sx={(theme) => ({
        width: 10,
        height: 10,
        flexShrink: 0,
        fill: 'currentColor',
        transform: open ? 'rotate(90deg)' : 'none',
        transition: theme.transitions.create('transform', { duration: theme.transitions.duration.shorter }),
      })}
    >
      <path d="M3 1.5 7.5 5 3 8.5z" />
    </Box>
  );
}
