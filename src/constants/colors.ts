export const lightColors = {
  background: '#F9FAFB', // Молочно-білий
  card: '#FFFFFF',
  text: '#111827',
  textSecondary: '#6B7280',
  border: '#E5E7EB',
  primary: '#3B82F6', // М'який синій акцент
  primaryLight: 'rgba(59, 130, 246, 0.1)',
  danger: '#EF4444',
  dangerLight: 'rgba(239, 68, 68, 0.1)',
  success: '#10B981',
};

export const darkColors = {
  background: '#121212', // Глибокий графіт
  card: '#1E1E1E', // Трохи світліший за фон
  text: '#F9FAFB',
  textSecondary: '#9CA3AF',
  border: '#2D2D2D',
  primary: '#60A5FA', // Трохи приглушений синій для темної теми
  primaryLight: 'rgba(96, 165, 250, 0.15)',
  danger: '#F87171',
  dangerLight: 'rgba(248, 113, 113, 0.15)',
  success: '#34D399',
};

export type ThemeColors = typeof lightColors;
