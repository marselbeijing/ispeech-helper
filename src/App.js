import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, Box } from '@mui/material';
import { AnimatePresence } from 'framer-motion';
import baseTheme from './theme';
import { getUserSettings } from './services/storage';
import { telegramColors } from './styles/TelegramStyles';
import WebApp from '@twa-dev/sdk';

// Components
import NavigationBar from './components/NavigationBar';
import Home from './pages/Home';
import Functions from './pages/Functions';
import Account from './pages/Account';
import Progress from './pages/Progress';
import SmoothReader from './components/SmoothReader';
import DAFMAF from './components/DAFMAF';
import BreathingExercises from './components/BreathingExercises';
import TongueTwisters from './components/TongueTwisters';
import MetronomeReader from './components/MetronomeReader';
import EmotionsTrainer from './components/EmotionsTrainer';

// Animated Routes component
const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/functions" element={<Functions />} />
        <Route path="/account" element={<Account />} />
        <Route path="/progress" element={<Progress />} />
        <Route path="/smooth-reader" element={<SmoothReader />} />
        <Route path="/dafmaf" element={<DAFMAF />} />
        <Route path="/breathing" element={<BreathingExercises />} />
        <Route path="/tongue-twisters" element={<TongueTwisters />} />
        <Route path="/metronome" element={<MetronomeReader />} />
        <Route path="/emotions" element={<EmotionsTrainer />} />
      </Routes>
    </AnimatePresence>
  );
};

// Функция для проверки доступности функций Telegram WebApp
const isTelegramFeatureSupported = (feature) => {
  try {
    if (!WebApp.isExpanded) return false;
    
    // Получение версии WebApp
    const versionStr = WebApp.version || '';
    const versionParts = versionStr.split('.');
    const majorVersion = parseInt(versionParts[0], 10) || 0;
    
    // Проверка функций по версии
    switch (feature) {
      case 'headerColor':
      case 'backgroundColor':
        return majorVersion >= 7; // Эти функции поддерживаются с версии 7.0
      default:
        return false;
    }
  } catch (e) {
    console.warn(`Error checking Telegram feature support: ${e.message}`);
    return false;
  }
};

// Main App component
const App = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [themeMode, setThemeMode] = useState('light');
  
  useEffect(() => {
    // Определение режима темы из Telegram WebApp
    try {
      if (WebApp.isExpanded) {
        // Если используем Telegram Mini App
        const colorScheme = WebApp.colorScheme;
        setThemeMode(colorScheme);
        setDarkMode(colorScheme === 'dark');
        
        // Настраиваем общие стили для Telegram Mini App (только если поддерживается)
        if (isTelegramFeatureSupported('headerColor')) {
          WebApp.setHeaderColor(colorScheme === 'dark' ? '#17212B' : '#FFFFFF');
        }
        
        if (isTelegramFeatureSupported('backgroundColor')) {
          WebApp.setBackgroundColor(colorScheme === 'dark' ? '#1F2936' : '#F0F2F5');
        }
        
        // Подписываемся на изменения темы в Telegram
        WebApp.onEvent('themeChanged', () => {
          const newColorScheme = WebApp.colorScheme;
          setThemeMode(newColorScheme);
          setDarkMode(newColorScheme === 'dark');
          
          if (isTelegramFeatureSupported('headerColor')) {
            WebApp.setHeaderColor(newColorScheme === 'dark' ? '#17212B' : '#FFFFFF');
          }
          
          if (isTelegramFeatureSupported('backgroundColor')) {
            WebApp.setBackgroundColor(newColorScheme === 'dark' ? '#1F2936' : '#F0F2F5');
          }
        });
      } else {
        // Загружаем настройки пользователя для обычного веб-режима
        const settings = getUserSettings();
        if (settings && typeof settings.darkMode === 'boolean') {
          setDarkMode(settings.darkMode);
          setThemeMode(settings.darkMode ? 'dark' : 'light');
        }
      }
    } catch (error) {
      console.warn('Telegram WebApp not available, using system settings:', error);
      
      // Загружаем настройки пользователя при монтировании
      const settings = getUserSettings();
      if (settings && typeof settings.darkMode === 'boolean') {
        setDarkMode(settings.darkMode);
        setThemeMode(settings.darkMode ? 'dark' : 'light');
      }
    }
    
    // Добавляем слушатель для изменения настроек хранилища
    const handleStorageChange = () => {
      const updatedSettings = getUserSettings();
      if (updatedSettings && typeof updatedSettings.darkMode === 'boolean') {
        setDarkMode(updatedSettings.darkMode);
        setThemeMode(updatedSettings.darkMode ? 'dark' : 'light');
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    // Пользовательское событие для обновления темы
    const handleCustomThemeChange = (event) => {
      if (event.detail && typeof event.detail.darkMode === 'boolean') {
        setDarkMode(event.detail.darkMode);
        setThemeMode(event.detail.darkMode ? 'dark' : 'light');
      }
    };
    
    window.addEventListener('themeChanged', handleCustomThemeChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('themeChanged', handleCustomThemeChange);
    };
  }, []);
  
  // Создаем тему на основе настроек
  const theme = createTheme({
    ...baseTheme,
    palette: {
      ...baseTheme.palette,
      mode: themeMode,
      primary: {
        ...baseTheme.palette.primary,
        main: themeMode === 'dark' ? telegramColors.dark.primary : telegramColors.light.primary,
        light: themeMode === 'dark' ? telegramColors.dark.secondary : telegramColors.light.secondary,
      },
      background: {
        default: themeMode === 'dark' ? telegramColors.dark.background : telegramColors.light.background,
        paper: themeMode === 'dark' ? telegramColors.dark.paper : telegramColors.light.paper,
      },
      text: {
        primary: themeMode === 'dark' ? telegramColors.dark.text : telegramColors.light.text,
        secondary: themeMode === 'dark' ? telegramColors.dark.textSecondary : telegramColors.light.textSecondary,
      },
      divider: themeMode === 'dark' ? telegramColors.dark.divider : telegramColors.light.divider,
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          background: theme.palette.background.default,
          transition: 'background 0.3s ease',
          // Убедимся, что контент не перекрывается с навбаром
          paddingBottom: '62px',
        }}
      >
        <Box
          component="main"
          sx={{
            flex: 1,
          }}
        >
          <AnimatedRoutes />
        </Box>
        <NavigationBar />
      </Box>
    </ThemeProvider>
  );
};

export default App; 