import { alpha } from '@mui/material/styles';

// Цвета Telegram
const telegramColors = {
  light: {
    primary: '#2AABEE', // Основной цвет Telegram
    secondary: '#64BEFF',
    background: '#F0F2F5',
    paper: '#FFFFFF',
    text: '#222222',
    textSecondary: '#657786',
    divider: '#E1E8ED',
    buttonPrimary: '#2AABEE',
  },
  dark: {
    primary: '#2AABEE',
    secondary: '#64BEFF',
    background: '#1F2936',
    paper: '#17212B',
    text: '#FFFFFF',
    textSecondary: '#AAB8C2',
    divider: '#38444D',
    buttonPrimary: '#2AABEE',
  }
};

// Общие стили компонентов
const commonStyles = {
  // Стили контейнера страницы
  pageContainer: {
    py: 3,
    px: 2,
    display: 'flex',
    flexDirection: 'column',
    minHeight: 'calc(100vh - 56px)',
    width: '100%',
    maxWidth: '100%',
    mx: 'auto',
  },
  
  // Стили для заголовков страниц
  pageTitle: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: '1.5rem',
    mb: 2,
  },
  
  // Стили для информационных блоков
  infoBox: (theme) => ({
    p: 3, 
    mb: 3, 
    borderRadius: 3,
    background: theme.palette.mode === 'dark' 
      ? alpha(theme.palette.primary.main, 0.08)
      : alpha(theme.palette.primary.main, 0.04),
    border: '1px solid',
    borderColor: theme.palette.mode === 'dark' 
      ? alpha(theme.palette.primary.main, 0.12)
      : alpha(theme.palette.primary.main, 0.12),
  }),
  
  // Стили основной кнопки
  primaryButton: (theme) => ({
    fontWeight: '500',
    borderRadius: 8,
    py: 1.5,
    boxShadow: 'none',
    textTransform: 'none',
    '&:hover': {
      boxShadow: '0 4px 12px rgba(42, 171, 238, 0.2)',
    },
  }),
  
  // Стили для круглой кнопки
  roundButton: (theme, colorName = 'primary.main') => {
    // Получаем актуальный цвет из темы, если передан ключ типа 'primary.main'
    const getActualColor = (colorKey) => {
      if (typeof colorKey === 'string' && colorKey.includes('.')) {
        const [palette, variant] = colorKey.split('.');
        if (theme.palette[palette] && theme.palette[palette][variant]) {
          return theme.palette[palette][variant];
        }
      }
      return colorKey;
    };
    
    const actualColor = getActualColor(colorName);
    
    return {
      width: 56,
      height: 56,
      borderRadius: '50%',
      backgroundColor: actualColor,
      color: 'white',
      '&:hover': {
        backgroundColor: alpha(actualColor, 0.9),
      },
      boxShadow: `0 4px 10px ${alpha(actualColor, 0.2)}`,
    };
  },
  
  // Стили для слайдеров
  slider: (theme, color = 'primary.main') => {
    // Получаем актуальный цвет из темы, если передан ключ типа 'primary.main'
    const getActualColor = (colorKey) => {
      if (typeof colorKey === 'string' && colorKey.includes('.')) {
        const [palette, variant] = colorKey.split('.');
        if (theme.palette[palette] && theme.palette[palette][variant]) {
          return theme.palette[palette][variant];
        }
      }
      return colorKey;
    };
    
    const actualColor = getActualColor(color);
    
    return {
      '& .MuiSlider-thumb': {
        width: 16, 
        height: 16,
        backgroundColor: actualColor,
      },
      '& .MuiSlider-track': {
        backgroundColor: actualColor,
        height: 4,
      },
      '& .MuiSlider-rail': {
        height: 4,
        backgroundColor: theme.palette.mode === 'dark' 
          ? alpha(actualColor, 0.3) 
          : alpha(actualColor, 0.2),
      },
    };
  },
  
  // Стили для карточек меню
  menuCard: (theme, color) => ({
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    p: 2,
    transition: 'all 0.2s ease',
    color: theme.palette.text.primary,
  }),
  
  // Стили для иконок в меню
  menuIcon: (color) => ({
    width: 56,
    height: 56,
    borderRadius: '50%',
    background: color,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: `0 4px 12px ${alpha(color, 0.3)}`,
    mb: 1.5,
    transition: 'all 0.2s',
  }),
};

export { telegramColors, commonStyles }; 