import { getUserSettings } from './storage';

// Проверка поддержки вибрации
const isVibrationSupported = () => {
  return 'vibrate' in navigator;
};

// Паттерны вибрации для разных событий
const patterns = {
  click: 50,
  success: [50, 50, 50],
  error: [100, 50, 100],
};

// Функция для вибрации
export const vibrate = (type) => {
  if (!isVibrationSupported()) {
    return;
  }

  const pattern = patterns[type];
  if (pattern) {
    navigator.vibrate(pattern);
  }
};

// Функция для отключения вибрации
export const stopVibration = () => {
  if (isVibrationSupported()) {
    navigator.vibrate(0);
  }
}; 