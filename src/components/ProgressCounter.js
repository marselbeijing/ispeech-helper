import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  CircularProgress, 
  useTheme,
  Badge,
  Button
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { getUserStats, updateProgress } from '../services/storage';
import { ArrowBack } from '@mui/icons-material';

const ProgressCounter = ({ showDetails = false }) => {
  const theme = useTheme();
  const [stats, setStats] = useState(null);
  const [animateCount, setAnimateCount] = useState(false);
  
  useEffect(() => {
    // Загрузка статистики при монтировании
    const userStats = getUserStats();
    setStats(userStats);
    
    // Анимация счетчика
    setTimeout(() => {
      setAnimateCount(true);
    }, 300);
    
  }, []);
  
  if (!stats) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
        <CircularProgress size={24} color="primary" />
      </Box>
    );
  }
  
  // Расчет процента прогресса для текущего уровня
  const progress = (stats.experience / stats.nextLevelExp) * 100;
  
  // Посчитаем количество выполненных достижений
  const completedAchievements = stats.achievements.filter(a => a.completed).length;
  
  const handleBackClick = () => {
    // Implementation of handleBackClick function
  };

  return (
    <AnimatePresence>
      <Box sx={{ position: 'relative', textAlign: 'center' }}>
        {/* Круговой прогресс */}
        <Box sx={{ position: 'relative', display: 'inline-flex' }}>
          <CircularProgress
            variant="determinate"
            value={animateCount ? progress : 0}
            size={showDetails ? 120 : 60}
            thickness={3.6}
            sx={{
              color: theme.palette.primary.main,
              transition: 'all 1.5s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          />
          <CircularProgress
            variant="determinate"
            value={100}
            size={showDetails ? 120 : 60}
            thickness={3.6}
            sx={{
              color: theme.palette.mode === 'dark' 
                ? 'rgba(255, 255, 255, 0.1)' 
                : 'rgba(0, 0, 0, 0.1)',
              position: 'absolute',
              top: 0,
              left: 0,
            }}
          />
          <Box
            sx={{
              top: 0,
              left: 0,
              bottom: 0,
              right: 0,
              position: 'absolute',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ 
                scale: animateCount ? 1 : 0.8, 
                opacity: animateCount ? 1 : 0 
              }}
              transition={{ 
                type: 'spring', 
                stiffness: 300, 
                damping: 20, 
                delay: 0.2 
              }}
            >
              <Typography
                variant={showDetails ? "h4" : "body1"}
                component="div"
                color="primary"
                sx={{ 
                  fontWeight: 'bold',
                  textShadow: '0px 1px 2px rgba(0,0,0,0.1)'
                }}
              >
                {stats.level}
              </Typography>
            </motion.div>
          </Box>
        </Box>
        
        {/* Бейдж с количеством упражнений */}
        <Badge
          badgeContent={stats.totalExercises}
          color="secondary"
          overlap="circular"
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          sx={{
            position: 'absolute',
            bottom: showDetails ? 5 : 0,
            right: showDetails ? 5 : 0,
            '& .MuiBadge-badge': {
              fontSize: showDetails ? '0.9rem' : '0.7rem',
              padding: showDetails ? '8px 12px' : '6px 10px',
              borderRadius: '20px',
            },
          }}
        />
        
        {/* Дополнительная информация, если showDetails = true */}
        {showDetails && (
          <Box sx={{ mt: 2 }}>
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <Typography variant="subtitle1">
                {stats.experience} / {stats.nextLevelExp} XP
              </Typography>
              
              <Box 
                sx={{ 
                  display: 'flex', 
                  justifyContent: 'center', 
                  gap: 3, 
                  mt: 2,
                  flexWrap: 'wrap' 
                }}
              >
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Упражнений
                  </Typography>
                  <Typography variant="h6" color="primary.main">
                    {stats.totalExercises}
                  </Typography>
                </Box>
                
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Серия дней
                  </Typography>
                  <Typography variant="h6" color="secondary.main">
                    {stats.currentStreak}
                  </Typography>
                </Box>
                
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Достижения
                  </Typography>
                  <Typography variant="h6" color="success.main">
                    {completedAchievements}/{stats.achievements.length}
                  </Typography>
                </Box>
              </Box>
            </motion.div>
          </Box>
        )}
      </Box>
    </AnimatePresence>
  );
};

export default React.memo(ProgressCounter); 