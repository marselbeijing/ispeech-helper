import { sendData } from '../config/telegram';

// Ключи для localStorage
const STORAGE_KEYS = {
  USER_STATS: 'ispeech_user_stats',
  SETTINGS: 'ispeech_settings',
  EXERCISES: 'ispeech_exercises',
};

// Начальные настройки
const DEFAULT_SETTINGS = {
  darkMode: false,
  soundEnabled: true,
  vibrationEnabled: true,
  fontSize: 16,
  animationSpeed: 1,
};

// Начальная статистика
const DEFAULT_STATS = {
  totalExercises: 0,
  currentStreak: 0,
  bestStreak: 0,
  level: 1,
  experience: 0,
  nextLevelExp: 100,
  lastExerciseDate: null,
  achievements: [
    { name: 'Первые шаги', description: 'Выполнено 10 упражнений', completed: false },
    { name: 'Неделя практики', description: '7 дней подряд', completed: false },
    { name: 'Мастер слова', description: 'Выполнено 100 упражнений', completed: false },
  ],
};

// Получение данных из localStorage
export const getLocalData = (key) => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error(`Error getting data from localStorage (${key}):`, error);
    return null;
  }
};

// Сохранение данных в localStorage
export const setLocalData = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error(`Error saving data to localStorage (${key}):`, error);
    return false;
  }
};

// Получение настроек пользователя
export const getUserSettings = () => {
  const settings = getLocalData(STORAGE_KEYS.SETTINGS);
  return settings || DEFAULT_SETTINGS;
};

// Сохранение настроек пользователя
export const saveUserSettings = (settings) => {
  return setLocalData(STORAGE_KEYS.SETTINGS, settings);
};

// Получение статистики пользователя
export const getUserStats = () => {
  const stats = getLocalData(STORAGE_KEYS.USER_STATS);
  return stats || DEFAULT_STATS;
};

// Сохранение статистики пользователя
export const saveUserStats = (stats) => {
  return setLocalData(STORAGE_KEYS.USER_STATS, stats);
};

// Обновление прогресса после выполнения упражнения
export const updateProgress = (exerciseType) => {
  const stats = getUserStats();
  const today = new Date().toISOString().split('T')[0];
  
  // Обновление общего количества упражнений
  stats.totalExercises += 1;
  
  // Обновление опыта и уровня
  const expGain = 10; // Базовый опыт за упражнение
  stats.experience += expGain;
  
  // Проверка повышения уровня
  if (stats.experience >= stats.nextLevelExp) {
    stats.level += 1;
    stats.nextLevelExp = Math.floor(stats.nextLevelExp * 1.5); // Увеличение опыта для следующего уровня
  }
  
  // Обновление серии упражнений
  if (stats.lastExerciseDate === today) {
    // Уже выполнили упражнение сегодня
  } else if (stats.lastExerciseDate === new Date(Date.now() - 86400000).toISOString().split('T')[0]) {
    // Вчера выполняли упражнение - увеличиваем серию
    stats.currentStreak += 1;
    if (stats.currentStreak > stats.bestStreak) {
      stats.bestStreak = stats.currentStreak;
    }
  } else {
    // Сброс серии
    stats.currentStreak = 1;
  }
  
  stats.lastExerciseDate = today;
  
  // Проверка достижений
  checkAchievements(stats);
  
  // Сохранение обновленной статистики
  saveUserStats(stats);
  
  // Синхронизация с сервером
  syncWithServer(stats);
  
  return stats;
};

// Проверка достижений
const checkAchievements = (stats) => {
  // Первые шаги
  if (stats.totalExercises >= 10) {
    stats.achievements[0].completed = true;
  }
  
  // Неделя практики
  if (stats.currentStreak >= 7) {
    stats.achievements[1].completed = true;
  }
  
  // Мастер слова
  if (stats.totalExercises >= 100) {
    stats.achievements[2].completed = true;
  }
};

// Синхронизация с сервером
const syncWithServer = (data) => {
  if (window.Telegram?.WebApp) {
    sendData({
      type: 'sync',
      data: data
    });
  }
}; 