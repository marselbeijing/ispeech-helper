import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Button,
  Avatar,
  useTheme,
  CircularProgress,
  Modal,
  Fade,
  IconButton,
} from '@mui/material';
import {
  Telegram as TelegramIcon,
  Logout as LogoutIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { verifyTelegramAuth, getCurrentUser, logout } from '../services/telegram';
import { playSound } from '../services/sound';
import { vibrate } from '../services/vibration';
import TelegramLogin from '../components/TelegramLogin';

const Account = () => {
  const theme = useTheme();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isInfoOpen, setIsInfoOpen] = useState(false);

  useEffect(() => {
    try {
      const currentUser = getCurrentUser();
      setUser(currentUser);
      setLoading(false);

      if (!currentUser) {
        const script = document.createElement('script');
        script.src = 'https://telegram.org/js/telegram-widget.js?22';
        script.setAttribute('data-telegram-login', 'iSpeechHelperBot');
        script.setAttribute('data-size', 'large');
        script.setAttribute('data-radius', '8');
        script.setAttribute('data-request-access', 'write');
        script.setAttribute('data-userpic', 'true');
        script.setAttribute('data-lang', 'ru');
        script.setAttribute('data-onauth', 'onTelegramAuth(user)');
        script.async = true;
        
        const widgetDiv = document.getElementById('telegram-login-widget');
        if (widgetDiv) {
          widgetDiv.innerHTML = '';
          widgetDiv.appendChild(script);
        }

        window.onTelegramAuth = async (user) => {
          try {
            const userData = await verifyTelegramAuth(user);
            setUser(userData);
            playSound('success');
            vibrate('success');
          } catch (error) {
            console.error('Ошибка авторизации:', error);
            playSound('error');
            vibrate('error');
          }
        };

        return () => {
          if (widgetDiv) widgetDiv.innerHTML = '';
          delete window.onTelegramAuth;
        };
      }
    } catch (error) {
      console.error('Ошибка инициализации:', error);
      setLoading(false);
    }
  }, []);

  const handleLogout = () => {
    try {
      playSound('click');
      vibrate('click');
      logout();
      setUser(null);
    } catch (error) {
      console.error('Ошибка выхода:', error);
    }
  };

  if (loading) {
    return (
      <Box sx={{ 
        height: '100vh', 
        width: '100%', 
        overflow: 'hidden',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: theme.palette.background.default
      }}>
        <Container maxWidth="sm" sx={{ 
          height: '100%', 
          display: 'flex', 
          flexDirection: 'column',
          overflow: 'hidden',
          position: 'relative'
        }}>
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
            <CircularProgress color="primary" />
          </Box>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      height: '100vh', 
      width: '100%', 
      overflow: 'hidden',
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: theme.palette.background.default
    }}>
      <Container maxWidth="sm" sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        overflow: 'hidden',
        position: 'relative'
      }}>
        <Paper
          elevation={0}
          sx={{
            p: 3,
            borderRadius: 3,
            background: theme.palette.background.paper,
            border: '1px solid',
            borderColor: theme.palette.mode === 'dark' 
              ? 'rgba(255, 255, 255, 0.1)' 
              : 'rgba(0, 0, 0, 0.05)',
          }}
        >
          {user ? (
            <>
              <Avatar
                src={user.photoUrl}
                alt={user.firstName}
                sx={{
                  width: 96,
                  height: 96,
                  mx: 'auto',
                  mb: 2,
                  boxShadow: '0 2px 8px rgba(60,60,120,0.10)',
                }}
              />
              <Typography variant="h6" fontWeight={600} mb={0.5}>
                {user.firstName} {user.lastName}
              </Typography>
              <Typography variant="body2" color="text.secondary" mb={2}>
                @{user.username}
              </Typography>
              <Box sx={{ mt: 2, mb: 3 }}>
                <Typography variant="subtitle2" color="text.secondary" mb={0.5}>
                  Статистика
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3 }}>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Упражнений
                    </Typography>
                    <Typography variant="h6" color="primary.main">
                      0
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Минут практики
                    </Typography>
                    <Typography variant="h6" color="secondary.main">
                      0
                    </Typography>
                  </Box>
                </Box>
              </Box>
              <Button
                variant="contained"
                color="error"
                startIcon={<LogoutIcon />}
                onClick={handleLogout}
                sx={{
                  borderRadius: 30,
                  px: 4,
                  py: 1.2,
                  fontWeight: 500,
                  fontSize: '1rem',
                  mt: 2,
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.10)',
                }}
              >
                Выйти
              </Button>
            </>
          ) : (
            <>
              <TelegramLogin onInfoClick={() => setIsInfoOpen(true)} />
            </>
          )}
        </Paper>

        <Modal
          open={isInfoOpen}
          onClose={() => setIsInfoOpen(false)}
          closeAfterTransition
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Fade in={isInfoOpen}>
            <Paper
              sx={{
                position: 'relative',
                width: '90%',
                maxWidth: 400,
                maxHeight: '80vh',
                overflow: 'auto',
                p: 3,
                borderRadius: 2,
                bgcolor: 'background.paper',
              }}
            >
              <IconButton
                onClick={() => setIsInfoOpen(false)}
                sx={{
                  position: 'absolute',
                  right: 8,
                  top: 8,
                }}
              >
                <CloseIcon />
              </IconButton>
              <Typography variant="h6" gutterBottom>
                О входе через Telegram
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Для использования приложения необходимо войти через Telegram. Это обеспечивает безопасность и удобство использования.
              </Typography>
            </Paper>
          </Fade>
        </Modal>
      </Container>
    </Box>
  );
};

export default Account; 