import React from 'react';
import {
  Container,
  Typography,
  Box,
  useTheme,
  Button,
  Paper,
} from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { playSound } from '../services/sound';
import { vibrate } from '../services/vibration';
import ProgressCounter from '../components/ProgressCounter';
import { getUserStats } from '../services/storage';

const Progress = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const progressData = getUserStats();
  
  const handleBack = () => {
    playSound('click');
    vibrate('click');
    navigate('/');
  };

  return (
    <Container maxWidth="md" sx={{ py: 4, minHeight: '100vh' }}>
      {/* Основной контейнер */}
      <Paper
        elevation={0}
        sx={{
          borderRadius: '24px',
          padding: '24px',
          backgroundColor: theme.palette.background.paper,
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          marginBottom: '20px',
          width: '100%',
          maxWidth: '500px',
          mx: 'auto',
        }}
      >
        {/* Заголовок внутри основного блока */}
        {/* Удаляю кнопку 'Назад' и синие заголовки 'Статистика' и 'Достижения' */}
        {/* <Typography 
          variant="h5" 
          component="h1" 
          fontWeight="bold" 
          textAlign="center"
          color="primary"
          mb={3}
        >
          Ваш прогресс
        </Typography> */}
        
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <ProgressCounter showDetails={true} />
          <Box sx={{ mt: 4, width: '100%' }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', textAlign: 'center', mb: 2 }}>
              Статистика
            </Typography>
            <Box sx={{ 
              display: 'grid', 
              gridTemplateColumns: '1fr 1fr', 
              gap: 2,
              marginBottom: 3 
            }}>
              <Paper 
                elevation={0} 
                sx={{ 
                  p: 2, 
                  textAlign: 'center', 
                  borderRadius: 3,
                  bgcolor: `${theme.palette.primary.main}10`
                }}
              >
                <Typography variant="h4" color="primary">
                  {progressData.totalExercises}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Упражнений
                </Typography>
              </Paper>
              
              <Paper 
                elevation={0} 
                sx={{ 
                  p: 2, 
                  textAlign: 'center', 
                  borderRadius: 3,
                  bgcolor: `${theme.palette.secondary.main}10`
                }}
              >
                <Typography variant="h4" color="secondary">
                  {Math.floor(progressData.totalExercises * 4.5)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Минут практики
                </Typography>
              </Paper>
              
              <Paper 
                elevation={0} 
                sx={{ 
                  p: 2, 
                  textAlign: 'center', 
                  borderRadius: 3,
                  bgcolor: `${theme.palette.warning.main}10`
                }}
              >
                <Typography variant="h4" color="warning.main">
                  {progressData.currentStreak}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Дней подряд
                </Typography>
              </Paper>
              
              <Paper 
                elevation={0} 
                sx={{ 
                  p: 2, 
                  textAlign: 'center', 
                  borderRadius: 3,
                  bgcolor: `${theme.palette.info.main}10`
                }}
              >
                <Typography variant="h4" color="info.main">
                  {progressData.bestStreak}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Лучшая серия
                </Typography>
              </Paper>
            </Box>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', mt: 3, textAlign: 'center', mb: 2 }}>
              Достижения
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {progressData.achievements.map((achievement) => (
                <Paper
                  key={achievement.name}
                  elevation={0}
                  sx={{
                    p: 2,
                    borderRadius: 3,
                    bgcolor: achievement.completed
                      ? (theme.palette.mode === 'dark' ? `${theme.palette.success.main}22` : `${theme.palette.success.main}10`)
                      : (theme.palette.mode === 'dark' ? '#222' : `${theme.palette.grey[100]}`),
                    border: `1px solid ${
                      achievement.completed
                        ? theme.palette.success.main
                        : theme.palette.divider
                    }`,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                  }}
                >
                  <Box
                    sx={{
                      width: 36,
                      height: 36,
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      bgcolor: achievement.completed
                        ? theme.palette.success.main
                        : (theme.palette.mode === 'dark' ? theme.palette.grey[800] : theme.palette.grey[300]),
                      color: 'white',
                    }}
                  >
                    {achievement.completed ? '✓' : '★'}
                  </Box>
                  <Box>
                    <Typography
                      variant="subtitle2"
                      sx={{
                        fontWeight: 'bold',
                        color: achievement.completed
                          ? theme.palette.success.main
                          : (theme.palette.mode === 'dark' ? theme.palette.grey[100] : theme.palette.text.primary),
                      }}
                    >
                      {achievement.name}
                    </Typography>
                    <Typography variant="body2" sx={{ color: theme.palette.mode === 'dark' ? theme.palette.grey[300] : 'text.secondary' }}>
                      {achievement.description}
                    </Typography>
                  </Box>
                </Paper>
              ))}
            </Box>
          </Box>
        </Box>

        {/* Кнопка назад внутри основного блока */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Button
            variant="contained"
            startIcon={<ArrowBack />}
            onClick={handleBack}
            sx={{
              py: 1.2,
              px: 4,
              borderRadius: 30,
              textTransform: 'none',
              fontWeight: 500,
              fontSize: '1rem',
              background: 'linear-gradient(135deg, #ff3366 0%, #ff5e62 100%)',
              color: '#fff',
              boxShadow: '0 8px 32px 0 rgba(255, 74, 110, 0.3)',
              '&:hover': {
                background: 'linear-gradient(135deg, #ff5e62 0%, #ff3366 100%)',
              },
            }}
          >
            Назад
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default Progress; 