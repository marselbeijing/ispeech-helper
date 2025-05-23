import WebApp from '@twa-dev/sdk';

// Инициализация Telegram WebApp
export const initTelegramApp = () => {
  try {
    if (isTelegramWebApp()) {
      WebApp.ready();
      WebApp.expand();
    }
  } catch (error) {
    console.error('Error initializing Telegram WebApp:', error);
  }
};

// Получение данных пользователя
export const getUserData = () => {
  try {
    if (isTelegramWebApp()) {
      return {
        id: WebApp.initDataUnsafe?.user?.id,
        username: WebApp.initDataUnsafe?.user?.username,
        firstName: WebApp.initDataUnsafe?.user?.first_name,
        lastName: WebApp.initDataUnsafe?.user?.last_name,
        languageCode: WebApp.initDataUnsafe?.user?.language_code,
        photoUrl: WebApp.initDataUnsafe?.user?.photo_url,
      };
    }
    return null;
  } catch (error) {
    console.error('Error getting user data:', error);
    return null;
  }
};

// Проверка, запущено ли приложение в Telegram
export const isTelegramWebApp = () => {
  try {
    return window.Telegram?.WebApp !== undefined;
  } catch (error) {
    console.error('Error checking Telegram WebApp:', error);
    return false;
  }
};

// Отправка данных на сервер
export const sendData = (data) => {
  try {
    if (isTelegramWebApp()) {
      WebApp.sendData(JSON.stringify(data));
    }
  } catch (error) {
    console.error('Error sending data:', error);
  }
};

// Показать всплывающее окно
export const showPopup = (params) => {
  try {
    if (isTelegramWebApp()) {
      WebApp.showPopup(params);
    }
  } catch (error) {
    console.error('Error showing popup:', error);
  }
};

// Показать уведомление
export const showAlert = (message) => {
  try {
    if (isTelegramWebApp()) {
      WebApp.showAlert(message);
    }
  } catch (error) {
    console.error('Error showing alert:', error);
  }
}; 