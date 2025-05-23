// Telegram Bot API configuration
const TELEGRAM_BOT_NAME = 'iSpeechHelperBot';
const TELEGRAM_BOT_TOKEN = '7743960366:AAEwZM2KhTJYiQpnSuyZVr9dEkM7WGacMi0';

// Telegram Login Widget configuration
export const telegramLoginConfig = {
  botName: TELEGRAM_BOT_NAME,
  cornerRadius: 8,
  requestAccess: true,
  buttonSize: 'large',
  showUserPhoto: true,
  lang: 'ru',
};

// Function to verify Telegram authentication
export const verifyTelegramAuth = async (authData) => {
  try {
    // В реальном приложении здесь должна быть проверка данных на сервере
    // Для демонстрации просто сохраняем данные в localStorage
    const userData = {
      id: authData.id,
      firstName: authData.first_name,
      lastName: authData.last_name,
      username: authData.username,
      photoUrl: authData.photo_url,
      authDate: authData.auth_date,
    };

    localStorage.setItem('telegramUser', JSON.stringify(userData));
    return userData;
  } catch (error) {
    console.error('Error verifying Telegram auth:', error);
    throw error;
  }
};

// Function to get current user
export const getCurrentUser = () => {
  const userData = localStorage.getItem('telegramUser');
  return userData ? JSON.parse(userData) : null;
};

// Function to logout
export const logout = () => {
  localStorage.removeItem('telegramUser');
};

// Function to check if user is authenticated
export const isAuthenticated = () => {
  return !!getCurrentUser();
}; 