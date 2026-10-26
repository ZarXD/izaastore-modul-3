export const colors = {
  bg: '#FDF6EC',
  surface: '#FFFFFF',
  surfaceMuted: '#F7EEE2',
  ink: '#201A17',
  inkMuted: '#6B5D52',
  border: '#EADFD1',
  accent: '#C2410C',
  accentBright: '#EA5B2A',
  accentSoft: '#FBE3D6',
  teal: '#0F5F58',
  tealSoft: '#DCEFEA',
  yellow: '#F5C451',
  yellowSoft: '#FDF0CE',
  danger: '#B42318',
  dangerSoft: '#FBE4E1',
  white: '#FFFFFF',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 28,
  xxxl: 36,
};

export const radius = {
  sm: 10,
  md: 14,
  lg: 20,
  xl: 26,
  pill: 999,
};

export const type = {
  display: {
    fontSize: 31,
    lineHeight: 36,
    fontWeight: '900',
    letterSpacing: -1.1,
    color: colors.ink,
  },
  title: {
    fontSize: 21,
    lineHeight: 27,
    fontWeight: '800',
    letterSpacing: -0.6,
    color: colors.ink,
  },
  section: {
    fontSize: 15.5,
    lineHeight: 21,
    fontWeight: '800',
    letterSpacing: -0.2,
    color: colors.ink,
  },
  body: {
    fontSize: 14,
    lineHeight: 21,
    color: colors.inkMuted,
  },
  caption: {
    fontSize: 12,
    lineHeight: 17,
    fontWeight: '600',
    color: colors.inkMuted,
  },
  overline: {
    fontSize: 11,
    lineHeight: 15,
    fontWeight: '800',
    letterSpacing: 1.1,
    color: colors.inkMuted,
    textTransform: 'uppercase',
  },
};

export const shadow = {
  card: {
    shadowColor: colors.ink,
    shadowOpacity: 0.06,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 2,
  },
  lifted: {
    shadowColor: colors.ink,
    shadowOpacity: 0.12,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 5,
  },
  bar: {
    shadowColor: colors.ink,
    shadowOpacity: 0.1,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: -4 },
    elevation: 8,
  },
};
