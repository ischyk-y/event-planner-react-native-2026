export const theme = {
  colors: {
    primary: '#4facfe',
    secondary: '#00f2fe',
    background: '#f4f6f8',
    card: '#ffffff',
    text: '#212529',
    textSecondary: '#6c757d',
    border: '#e9ecef',
    danger: '#ff4d4f',
    success: '#52c41a',
  },
  spacing: {
    xs: 4,
    s: 8,
    m: 16,
    l: 24,
    xl: 32,
  },
  borderRadius: {
    s: 8,
    m: 12,
    l: 16,
    xl: 24,
    round: 9999,
  },
  typography: {
    h1: { fontSize: 28, fontWeight: '700' as const },
    h2: { fontSize: 22, fontWeight: '600' as const },
    h3: { fontSize: 18, fontWeight: '600' as const },
    body: { fontSize: 16, fontWeight: '400' as const },
    caption: { fontSize: 14, fontWeight: '400' as const },
  }
};
