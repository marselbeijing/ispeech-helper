import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Grid,
  Box,
  useTheme,
  Paper,
} from '@mui/material';
import {
  Spa as BreathingIcon,
  Timer as MetronomeIcon,
  MenuBook as ReaderIcon,
  RecordVoiceOver as TongueTwisterIcon,
  Headphones as DAFIcon,
  EmojiEmotions as EmotionsIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { playSound } from '../services/sound';
import { vibrate } from '../services/vibration';
import { commonStyles } from '../styles/TelegramStyles';
import BackgroundAnimation from '../components/BackgroundAnimation';

const Home = () => {
  const navigate = useNavigate();
  const theme = useTheme();

  // Блокировка прокрутки на странице
  React.useEffect(() => {
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    
    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, []);

  const menuItems = [
    {
      title: 'Дыхание',
      icon: <BreathingIcon sx={{ fontSize: 48, color: '#fff' }} />,
      path: '/breathing',
      color: '#FF4A6E',
    },
    {
      title: 'Метроном',
      icon: <MetronomeIcon sx={{ fontSize: 48, color: '#fff' }} />,
      path: '/metronome',
      color: '#5B7CFF',
    },
    {
      title: 'Плавное чтение',
      icon: <ReaderIcon sx={{ fontSize: 48, color: '#fff' }} />,
      path: '/smooth-reader',
      color: '#32B768',
    },
    {
      title: 'Скороговорка',
      icon: <TongueTwisterIcon sx={{ fontSize: 48, color: '#fff' }} />,
      path: '/tongue-twisters',
      color: '#FFB84A',
    },
    {
      title: 'DAF/MAF',
      icon: <DAFIcon sx={{ fontSize: 48, color: '#fff' }} />,
      path: '/dafmaf',
      color: '#8B5CF6',
    },
    {
      title: 'Эмоции',
      icon: <EmotionsIcon sx={{ fontSize: 48, color: '#fff' }} />,
      path: '/emotions',
      color: '#FF6B6B',
    },
  ];

  const handleClick = (path) => {
    playSound('click');
    vibrate('click');
    navigate(path);
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: 'easeOut',
      },
    }),
  };

  return (
    <Box sx={{
      height: '100vh',
      maxHeight: '100vh',
      background: theme.palette.background.default,
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      pb: 7,
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
    }}>
      {/* Фоновая анимация (zIndex 1) */}
      <Box sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 1,
        pointerEvents: 'none',
      }}>
        <BackgroundAnimation />
      </Box>

      {/* Основной контент (zIndex 2) */}
      <Box sx={{
        position: 'relative',
        zIndex: 2,
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}>
        <Container maxWidth="sm" sx={{
          ...commonStyles.pageContainer,
          py: 2,
          flex: 1,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          height: 'calc(100vh - 56px)',
          background: 'transparent',
        }}>
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Paper
              elevation={0}
              sx={{
                background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                borderRadius: 3,
                py: 1.8,
                px: { xs: 2, sm: 3 },
                mb: 2,
                textAlign: 'center',
                maxWidth: '100%',
                mx: 0,
                border: '1px solid',
                borderColor: theme.palette.mode === 'dark' 
                  ? `rgba(255, 255, 255, 0.1)` 
                  : `rgba(0, 0, 0, 0.05)`,
              }}
            >
              <Typography
                variant="h4"
                component="h1"
                gutterBottom
                sx={{
                  color: '#fff',
                  fontWeight: 'bold',
                  mb: 1,
                  fontFamily: 'Roboto, sans-serif',
                }}
              >
                iSpeech Helper
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: 'rgba(255, 255, 255, 0.9)',
                  fontWeight: 400,
                  fontSize: '0.81rem',
                  lineHeight: 1.4,
                }}
              >
                Ваш помощник для улучшения речи и дикции
              </Typography>
            </Paper>
          </motion.div>
          <Grid container spacing={2} justifyContent="center" alignItems="center" sx={{ overflow: 'hidden', flex: 1, textAlign: 'center' }}>
            {menuItems.map((item, index) => (
              <Grid item xs={6} key={item.path} sx={{ display: 'flex', justifyContent: 'center' }}>
                <motion.div
                  custom={index}
                  initial="hidden"
                  animate="visible"
                  variants={cardVariants}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  style={{ width: '100%', display: 'flex', justifyContent: 'center' }}
                >
                  <Box
                    onClick={() => handleClick(item.path)}
                    sx={{
                      ...commonStyles.menuCard(theme, item.color),
                      width: 126,
                      height: 126,
                      borderRadius: 2,
                      background: item.color,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      pt: 3,
                      pb: 2,
                      boxShadow: '0 2px 8px 0 rgba(60,60,120,0.10)',
                      mx: 'auto',
                    }}
                  >
                    {item.icon}
                    <Typography
                      variant="caption"
                      sx={{
                        fontWeight: 500,
                        color: '#fff',
                        textAlign: 'center',
                        fontSize: '0.75rem',
                      }}
                    >
                      {item.title}
                    </Typography>
                  </Box>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

export default Home; 