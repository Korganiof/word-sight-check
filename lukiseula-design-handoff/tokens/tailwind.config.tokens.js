// LukiSeula design tokens for Tailwind v3 (tailwind.config.js).
// Merge into your config:  theme: { extend: require('./design/handoff/tokens/tailwind.config.tokens.js') }
// If you are on Tailwind v4, use tailwind.theme.css instead.

module.exports = {
  colors: {
    paper: '#FAF6F0',
    surface: '#FFFFFF',
    recessed: '#F5EEE4',
    well: '#ECE2D4',
    line: { DEFAULT: '#E5D9C9', strong: '#CDBBA4' },
    control: '#A08A72',
    ink: { DEFAULT: '#241A11', 2: '#64503F' },
    brown: { DEFAULT: '#4A3728', deep: '#2F241B' },
    time: '#8C7660',
    gold: {
      DEFAULT: '#C69A2B',
      hover: '#B68B1F',
      press: '#AC841B',
      ink: '#785A00',
      'ink-deep': '#5C4500',
      wash: '#F2DA93',
      tint: '#FAF0D2',
    },
    level: {
      good: { DEFAULT: '#35612A', bg: '#E3EDD8' },
      some: { DEFAULT: '#6E5200', bg: '#F8EBC4' },
      clear: { DEFAULT: '#8A3B22', bg: '#F6E2D9' },
      none: { DEFAULT: '#64503F', bg: '#EFE8DD' },
    },
  },

  fontFamily: {
    ui: ['Manrope', 'Atkinson Hyperlegible Next', 'system-ui', 'sans-serif'],
    text: ['Atkinson Hyperlegible Next', 'Manrope', 'system-ui', 'sans-serif'],
    mono: ['Atkinson Hyperlegible Mono', 'ui-monospace', 'SF Mono', 'Menlo', 'Consolas', 'monospace'],
  },

  // [size, { lineHeight, letterSpacing, fontWeight }] — Manrope for headings/labels/numbers, Atkinson for reading.
  fontSize: {
    display: ['84px', { lineHeight: '84px', letterSpacing: '-0.04em', fontWeight: '800' }],
    'display-sm': ['50px', { lineHeight: '52px', letterSpacing: '-0.04em', fontWeight: '800' }], // 390
    title: ['56px', { lineHeight: '60px', letterSpacing: '-0.035em', fontWeight: '800' }],      // ready / results titles
    'title-sm': ['34px', { lineHeight: '40px', letterSpacing: '-0.035em', fontWeight: '800' }],
    h1: ['48px', { lineHeight: '54px', letterSpacing: '-0.03em', fontWeight: '800' }],
    'h1-sm': ['32px', { lineHeight: '38px', letterSpacing: '-0.03em', fontWeight: '800' }],
    h2: ['32px', { lineHeight: '38px', letterSpacing: '-0.025em', fontWeight: '800' }],
    'h2-sm': ['24px', { lineHeight: '30px', letterSpacing: '-0.025em', fontWeight: '800' }],
    h3: ['22px', { lineHeight: '28px', letterSpacing: '-0.02em', fontWeight: '800' }],
    h4: ['19px', { lineHeight: '26px', letterSpacing: '-0.015em', fontWeight: '800' }],
    lead: ['19px', { lineHeight: '32px' }],
    body: ['17px', { lineHeight: '28px' }],
    reading: ['20px', { lineHeight: '40px' }],
    'reading-sm': ['19px', { lineHeight: '40px' }],
    caption: ['15px', { lineHeight: '22px' }],
    label: ['12px', { lineHeight: '16px', letterSpacing: '0.12em', fontWeight: '800' }],
    button: ['17px', { lineHeight: '1', fontWeight: '700' }],
    counter: ['26px', { lineHeight: '1', fontWeight: '800' }],
    tape: ['48px', { lineHeight: '1', fontWeight: '600' }],
    'tape-sm': ['36px', { lineHeight: '1', fontWeight: '600' }],
  },

  borderRadius: {
    mark: '6px',
    chip: '8px',
    key: '12px',
    btn: '14px',
    tile: '16px',
    'answer': '18px',
    'sheet-sm': '20px',
    sheet: '24px',
    'sheet-lg': '28px',
    hero: '32px',
    pill: '999px',
  },

  boxShadow: {
    sheet: '0 1px 2px rgba(47, 36, 27, 0.04), 0 8px 24px rgba(47, 36, 27, 0.05)',
    float: '0 2px 4px rgba(47, 36, 27, 0.04), 0 24px 64px rgba(47, 36, 27, 0.08)',
    up: '0 -8px 24px rgba(47, 36, 27, 0.05)',
    mark: 'inset 0 -3px 0 #785A00',
    keycap: 'none',
  },

  transitionDuration: { fast: '120ms', base: '180ms' },
  transitionTimingFunction: { ls: 'cubic-bezier(0.2, 0, 0, 1)' },

  spacing: {
    appbar: '64px',
    'appbar-sm': '56px',
    dock: '84px',
    'dock-sm': '76px',
    gutter: '16px',
  },

  maxWidth: {
    shell: '1160px',   // results, consent
    work: '960px',     // Osa 3, Osa 4 work column
    'work-wide': '1080px', // Osa 2, Osa 5 (aside + sheet)
    read: '680px',
    measure: '640px',  // longest paragraph in the report
  },

  outlineWidth: { focus: '3px' },
  outlineOffset: { focus: '2px' },
};
