/* Hallmark · redesign (app) · genre: modern-minimal · tone: utilitarian
 * theme: custom — paper warm-neutral (light) / warm-charcoal (dark) · accent: Endfield yellow
 * fonts: IBM Plex Sans JP (UI) + IBM Plex Mono (numerals)
 * pre-emit critique: P4 H4 E5 S4 R5 V4 · slop test: contrast (40–41) computed, 320–768px checked
 */
import { createTheme, type Theme } from '@mui/material/styles';
import type { SystemStyleObject } from '@mui/system';

/** sx 配列の要素としてそのまま使える、テーマを受け取るスタイル関数 */
export type SxFn = (theme: Theme) => SystemStyleObject<Theme>;

/** 色トークン。色はすべてここで定義し、コンポーネントからは名前で参照する */
const light = {
  paper: 'oklch(97.2% 0.006 85)',
  surface: 'oklch(99.2% 0.004 85)',
  surfaceSunk: 'oklch(94.6% 0.007 85)',
  ink: 'oklch(24% 0.012 80)',
  ink2: 'oklch(47% 0.012 80)',
  ink3: 'oklch(52% 0.01 80)',
  rule: 'oklch(88.5% 0.009 85)',
  accent: 'oklch(86% 0.165 95)',
  accentSoft: 'oklch(95% 0.06 95)',
  accentInk: 'oklch(46% 0.1 75)',
  onAccent: 'oklch(22% 0.03 85)',
  focus: 'oklch(52% 0.14 250)',
  danger: 'oklch(53% 0.19 27)',
};

const dark: typeof light = {
  paper: 'oklch(18.5% 0.008 80)',
  surface: 'oklch(22.5% 0.009 80)',
  surfaceSunk: 'oklch(26.5% 0.01 80)',
  ink: 'oklch(93% 0.008 85)',
  ink2: 'oklch(74% 0.01 85)',
  ink3: 'oklch(63% 0.01 85)',
  rule: 'oklch(33% 0.01 80)',
  accent: 'oklch(86% 0.165 95)',
  accentSoft: 'oklch(32% 0.06 95)',
  accentInk: 'oklch(85% 0.14 92)',
  onAccent: 'oklch(22% 0.03 85)',
  focus: 'oklch(75% 0.12 250)',
  danger: 'oklch(70% 0.16 27)',
};

/** タグ（効果・属性・一致度など）の配色。bg/fg/line をライト・ダークで持つ */
type Tone = { bg: string; fg: string; line: string };
const tone = (h: number, c: number): { light: Tone; dark: Tone } => ({
  light: { bg: `oklch(94.5% ${c * 0.3} ${h})`, fg: `oklch(43% ${c} ${h})`, line: `oklch(72% ${c} ${h})` },
  dark: { bg: `oklch(30% ${c * 0.45} ${h})`, fg: `oklch(84% ${c * 0.8} ${h})`, line: `oklch(55% ${c} ${h})` },
});

export const tones = {
  neutral: tone(80, 0.012),
  additional: tone(50, 0.12),
  skill: tone(280, 0.13),
  cofarm: tone(150, 0.11),
  agree: tone(150, 0.11),
  split: tone(70, 0.12),
  物理: tone(250, 0.03),
  灼熱: tone(28, 0.15),
  寒冷: tone(230, 0.11),
  電磁: tone(300, 0.14),
  自然: tone(145, 0.12),
} as const;

export type ToneName = keyof typeof tones;

/** レア度・順位の色（ライト・ダークそれぞれ地の色とのコントラスト 4.5:1 以上） */
const rarity: Record<number, { light: string; dark: string }> = {
  6: { light: 'oklch(56% 0.13 65)', dark: 'oklch(80% 0.14 75)' },
  5: { light: 'oklch(50% 0.17 300)', dark: 'oklch(75% 0.13 300)' },
  4: { light: 'oklch(50% 0.12 240)', dark: 'oklch(75% 0.1 240)' },
};
const rank = [
  { light: 'oklch(56% 0.12 80)', dark: 'oklch(82% 0.14 88)' },
  { light: 'oklch(52% 0.012 250)', dark: 'oklch(74% 0.012 250)' },
  { light: 'oklch(52% 0.1 55)', dark: 'oklch(72% 0.1 55)' },
];

export const fonts = {
  ui: '"IBM Plex Sans JP", system-ui, sans-serif',
  mono: '"IBM Plex Mono", ui-monospace, monospace',
};

/** タグの配色を当てる sx。ダークモードは OS 設定に追従する */
export const toneSx = (name: ToneName, withLine = false): SxFn => (theme) => ({
  bgcolor: tones[name].light.bg,
  color: tones[name].light.fg,
  ...(withLine && { borderColor: tones[name].light.line }),
  ...theme.applyStyles('dark', {
    bgcolor: tones[name].dark.bg,
    color: tones[name].dark.fg,
    ...(withLine && { borderColor: tones[name].dark.line }),
  }),
});

/** レア度（★）の文字色 */
export const raritySx = (r: number): SxFn => (theme) => ({
  color: rarity[r]?.light,
  ...theme.applyStyles('dark', { color: rarity[r]?.dark }),
});

/** 順位の文字色（1〜3位） */
export const rankSx = (n: number): SxFn => (theme) =>
  rank[n - 1]
    ? { color: rank[n - 1].light, ...theme.applyStyles('dark', { color: rank[n - 1].dark }) }
    : { color: theme.palette.text.secondary };

/** タグの文字色だけを当てる sx */
export const toneTextSx = (name: ToneName): SxFn => (theme) => ({
  color: tones[name].light.fg,
  ...theme.applyStyles('dark', { color: tones[name].dark.fg }),
});

/** ライト・ダークで値が違うトークンを当てる sx */
export const tokenSx = (
  pick: (t: typeof light) => Record<string, string>,
): SxFn => (theme) => ({
  ...pick(light),
  ...theme.applyStyles('dark', pick(dark)),
});

const palette = (t: typeof light) => ({
  background: { default: t.paper, paper: t.surface },
  text: { primary: t.ink, secondary: t.ink2, disabled: t.ink3 },
  divider: t.rule,
  primary: { main: t.accent, contrastText: t.onAccent },
  error: { main: t.danger, contrastText: t.surface },
});

export const theme = createTheme({
  cssVariables: { colorSchemeSelector: 'media', nativeColor: true },
  colorSchemes: {
    light: { palette: palette(light) },
    dark: { palette: palette(dark) },
  },
  shape: { borderRadius: 6 },
  typography: {
    fontFamily: fonts.ui,
    fontSize: 14,
    h1: { fontSize: '1.25rem', fontWeight: 700, lineHeight: 1.35 },
    h2: { fontSize: '1.0625rem', fontWeight: 700, lineHeight: 1.4 },
    h3: { fontSize: '0.9375rem', fontWeight: 700, lineHeight: 1.4 },
    body1: { fontSize: '0.875rem', lineHeight: 1.7 },
    body2: { fontSize: '0.8125rem', lineHeight: 1.65 },
    caption: { fontSize: '0.75rem', lineHeight: 1.55 },
    button: { textTransform: 'none', fontWeight: 600 },
  },
  transitions: {
    easing: {
      easeOut: 'cubic-bezier(0.22, 1, 0.36, 1)',
      easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
      easeInOut: 'cubic-bezier(0.65, 0, 0.35, 1)',
      sharp: 'cubic-bezier(0.22, 1, 0.36, 1)',
    },
    duration: { shortest: 120, shorter: 150, short: 180, standard: 200, complex: 240 },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        'html, body': { overflowX: 'clip' },
        // 日本語を文節で改行する（対応ブラウザのみ。html の lang="ja" が前提）
        body: { fontFeatureSettings: '"palt" 1', wordBreak: 'auto-phrase' },
        'h1, h2, h3': { textWrap: 'balance', overflowWrap: 'anywhere', minWidth: 0 },
        '@media (prefers-reduced-motion: reduce)': {
          '*, *::before, *::after': { transitionDuration: '0.01ms !important', animationDuration: '0.01ms !important' },
        },
      },
    },
    // 波紋エフェクトは使わず、フォーカスはリングで示す
    MuiButtonBase: {
      defaultProps: { disableRipple: true },
      styleOverrides: {
        root: ({ theme }) => ({
          '&.Mui-focusVisible': { outline: `2px solid ${light.focus}`, outlineOffset: 2 },
          ...theme.applyStyles('dark', { '&.Mui-focusVisible': { outline: `2px solid ${dark.focus}` } }),
        }),
      },
    },
    MuiPaper: {
      defaultProps: { variant: 'outlined' },
    },
    MuiButton: {
      defaultProps: { disableElevation: true },
    },
    MuiChip: {
      styleOverrides: {
        root: { fontWeight: 500, borderRadius: 999 },
        sizeSmall: { height: 22, fontSize: '0.75rem' },
      },
    },
    MuiTab: {
      styleOverrides: {
        // 非選択タブは不透明度ではなく色で弱め、コントラストを保つ
        root: ({ theme }) => ({
          textTransform: 'none',
          fontWeight: 600,
          minHeight: 44,
          fontSize: '0.875rem',
          opacity: 1,
          color: theme.vars.palette.text.secondary,
          '&.Mui-selected': { color: theme.vars.palette.text.primary },
        }),
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: ({ theme }) => ({
          paddingBlock: 12,
          [theme.breakpoints.down('sm')]: { paddingInline: 8 },
        }),
        head: ({ theme }) => ({ fontSize: '0.75rem', fontWeight: 600, color: theme.vars.palette.text.secondary }),
      },
    },
  },
});
