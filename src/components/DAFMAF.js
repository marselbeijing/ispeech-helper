import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Container,
  Box,
  Typography,
  Slider,
  Button,
  useTheme,
} from '@mui/material';
import { PlayArrow, StopCircle, ArrowBack, Headphones } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { playSound } from '../services/sound';
import { vibrate } from '../services/vibration';
import { commonStyles } from '../styles/TelegramStyles';
import { styled } from '@mui/material/styles';
import { updateProgress } from '../services/storage';

const CustomThumb = styled('span')(({ theme }) => ({
  width: 24,
  height: 24,
  backgroundColor: '#29b6f6',
  borderRadius: '50%',
  boxShadow: '0 2px 8px 0 #2196f355',
  border: '3px solid #fff',
  display: 'block',
  position: 'absolute',
  top: '50%',
  left: 0,
  transform: 'translateY(-50%)',
}));

const DAFMAF = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [isPlaying, setIsPlaying] = useState(false);
  const [delay, setDelay] = useState(150);
  const [volume, setVolume] = useState(1.0);
  const [noiseVolume, setNoiseVolume] = useState(0.5);
  const [isMAFEnabled, setIsMAFEnabled] = useState(false);
  const [micPermissionError, setMicPermissionError] = useState(false);
  
  const audioContextRef = useRef(null);
  const mediaStreamRef = useRef(null);
  const sourceRef = useRef(null);
  const delayNodeRef = useRef(null);
  const gainNodeRef = useRef(null);
  const noiseSourceRef = useRef(null);
  const noiseGainRef = useRef(null);

  // Генерация буфера белого шума
  const createWhiteNoiseBuffer = (audioCtx) => {
    const bufferSize = audioCtx.sampleRate * 2;
    const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    return buffer;
  };

  // Очистка всех аудио-ресурсов
  const cleanupAudio = useCallback(() => {
    // Остановка шума
    if (noiseSourceRef.current) {
      try { noiseSourceRef.current.stop(); } catch {}
      try { noiseSourceRef.current.disconnect(); } catch {}
      noiseSourceRef.current = null;
    }
    if (noiseGainRef.current) {
      try { noiseGainRef.current.disconnect(); } catch {}
      noiseGainRef.current = null;
    }
    
    // Отключение DAF цепочки
    if (gainNodeRef.current) {
      try { gainNodeRef.current.disconnect(); } catch {}
      gainNodeRef.current = null;
    }
    if (delayNodeRef.current) {
      try { delayNodeRef.current.disconnect(); } catch {}
      delayNodeRef.current = null;
    }
    if (sourceRef.current) {
      try { sourceRef.current.disconnect(); } catch {}
      sourceRef.current = null;
    }
    
    // Остановка микрофона
    if (mediaStreamRef.current) {
      try {
        mediaStreamRef.current.getTracks().forEach(track => track.stop());
      } catch {}
      mediaStreamRef.current = null;
    }
    
    // Закрытие аудио-контекста
    if (audioContextRef.current) {
      try { audioContextRef.current.close(); } catch {}
      audioContextRef.current = null;
    }
  }, []);

  // Запуск DAF
  const startDAF = async () => {
    try {
      // Очистка предыдущих ресурсов
      cleanupAudio();
      
      // Запрос доступа к микрофону
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;
      
      // Создание нового аудио-контекста
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      
      // Создание цепочки DAF
      sourceRef.current = audioContextRef.current.createMediaStreamSource(stream);
      delayNodeRef.current = audioContextRef.current.createDelay(2.0);
      gainNodeRef.current = audioContextRef.current.createGain();
      
      delayNodeRef.current.delayTime.value = delay / 1000;
      gainNodeRef.current.gain.value = volume;
      
      sourceRef.current.connect(delayNodeRef.current);
      delayNodeRef.current.connect(gainNodeRef.current);
      gainNodeRef.current.connect(audioContextRef.current.destination);
      
      // Если MAF включен, добавляем шум
      if (isMAFEnabled) {
        startMAF();
      }
      
      setMicPermissionError(false);
      setIsPlaying(true);
    } catch (error) {
      console.error('Error starting DAF:', error);
      setMicPermissionError(true);
      setIsPlaying(false);
    }
  };

  // Запуск MAF (белый шум)
  const startMAF = () => {
    if (!audioContextRef.current || !isPlaying) return;
    
    try {
      // Создание и настройка узла шума
      noiseGainRef.current = audioContextRef.current.createGain();
      noiseGainRef.current.gain.value = noiseVolume;
      
      noiseSourceRef.current = audioContextRef.current.createBufferSource();
      noiseSourceRef.current.buffer = createWhiteNoiseBuffer(audioContextRef.current);
      noiseSourceRef.current.loop = true;
      
      noiseSourceRef.current.connect(noiseGainRef.current);
      noiseGainRef.current.connect(audioContextRef.current.destination);
      noiseSourceRef.current.start();
    } catch (error) {
      console.error('Error starting MAF:', error);
    }
  };

  // Остановка MAF
  const stopMAF = () => {
    if (noiseSourceRef.current) {
      try { noiseSourceRef.current.stop(); } catch {}
      try { noiseSourceRef.current.disconnect(); } catch {}
      noiseSourceRef.current = null;
    }
    if (noiseGainRef.current) {
      try { noiseGainRef.current.disconnect(); } catch {}
      noiseGainRef.current = null;
    }
  };

  // Обработчик нажатия на кнопку DAF (старт/стоп)
  const handleDAFToggle = () => {
    playSound('click');
    vibrate('click');
    
    if (!isPlaying) {
      startDAF();
    } else {
      setIsPlaying(false);
      cleanupAudio();
      handleExerciseComplete();
    }
  };

  // Обработчик нажатия на кнопку MAF
  const handleMAFToggle = () => {
    playSound('click');
    vibrate('click');
    
    const newMAFState = !isMAFEnabled;
    setIsMAFEnabled(newMAFState);
    
    if (isPlaying) {
      if (newMAFState) {
        startMAF();
      } else {
        stopMAF();
      }
    }
  };

  // Обработчик изменения задержки
  const handleDelayChange = (_, newValue) => {
    setDelay(newValue);
    if (delayNodeRef.current) {
      delayNodeRef.current.delayTime.value = newValue / 1000;
    }
  };

  // Обработчик изменения громкости DAF
  const handleVolumeChange = (_, newValue) => {
    setVolume(newValue);
    if (gainNodeRef.current) {
      gainNodeRef.current.gain.value = newValue;
    }
  };

  // Обработчик изменения громкости шума
  const handleNoiseVolumeChange = (_, newValue) => {
    setNoiseVolume(newValue);
    if (noiseGainRef.current) {
      noiseGainRef.current.gain.value = newValue;
    }
  };

  // Обработчик кнопки Назад
  const handleBackClick = () => {
    if (isPlaying) {
      cleanupAudio();
    }
    playSound('click');
    vibrate('click');
    navigate('/');
  };

  const handleExerciseComplete = () => {
    updateProgress('dafmaf');
  };

  // Очистка при размонтировании компонента
  useEffect(() => {
    return () => {
      if (isPlaying) {
        cleanupAudio();
      }
    };
  }, [isPlaying, cleanupAudio]);

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
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{ width: '100%', height: '100%', overflow: 'hidden' }}
        >
          <Box
            sx={{
              p: { xs: 1.5, sm: 2 },
              borderRadius: 3,
              background: theme.palette.mode === 'dark' 
                ? 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)' 
                : 'linear-gradient(135deg, #fffefb 0%, #fffde4 100%)',
              border: `1px solid ${theme.palette.divider}`,
              mb: 3,
              width: '90%',
              maxWidth: '100%',
              minWidth: '280px',
              minHeight: '540px',
              maxHeight: '700px',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'flex-start',
              mx: 'auto',
            }}
          >
            {/* Синий заголовок */}
            <Box
              sx={{
                width: '100%',
                background: 'linear-gradient(90deg, #2196f3 0%, #1e88e5 100%)',
                borderRadius: 2,
                mb: 2,
                py: 2,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                boxShadow: '0 2px 8px 0 rgba(0,0,0,0.08)',
              }}
            >
              <Typography 
                variant="h5" 
                align="center" 
                sx={{ 
                  color: '#fff',
                  fontWeight: 'bold',
                  textShadow: '0 2px 8px rgba(0,0,0,0.15)',
                  m: 0,
                }}
              >
                DAF/MAF
              </Typography>
            </Box>

            {/* Информация */}
            <Box sx={{ width: '100%', mb: 2 }}>
              <Typography variant="body2" sx={{ 
                textAlign: 'center', 
                color: theme.palette.mode === 'dark' ? '#fff' : '#222', 
                fontSize: 13, 
                mb: 1, 
                fontWeight: 700 
              }}>
                Используйте наушники. Настройте параметры и нажмите старт.
              </Typography>
              <Typography variant="body2" sx={{ 
                textAlign: 'center', 
                color: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.7)' : '#222', 
                fontSize: 13, 
                mb: 1 
              }}>
                1. Наденьте наушники.<br/>
                2. Говорите в микрофон — вы услышите свой голос с задержкой (DAF) или с наложением шума (MAF).<br/>
                3. Меняйте параметры для подбора комфортного режима.
              </Typography>
            </Box>

            {/* Ошибка микрофона */}
            {micPermissionError && (
              <Box 
                sx={{ 
                  p: 2, 
                  mb: 2, 
                  borderRadius: 2, 
                  bgcolor: 'error.light',
                  color: 'error.contrastText',
                  textAlign: 'center',
                  width: '100%',
                }}
              >
                <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                  Требуется доступ к микрофону. Разрешите доступ в настройках браузера.
                </Typography>
              </Box>
            )}

            {/* Слайдеры */}
            <Box sx={{ width: '60%', mb: 2, mx: 'auto' }}>
              <Typography variant="subtitle1" sx={{ 
                mb: 1, 
                fontWeight: 'medium', 
                textAlign: 'center', 
                fontSize: 13,
                color: theme.palette.mode === 'dark' ? '#fff' : 'inherit'
              }}>
                Задержка (мс): {delay}
              </Typography>
              <Slider
                value={delay}
                onChange={handleDelayChange}
                min={50}
                max={300}
                valueLabelDisplay="auto"
                sx={{ ...commonStyles.slider(theme, theme.palette.primary.main), mb: 2 }}
                slots={{ thumb: CustomThumb }}
              />
              <Typography variant="subtitle1" sx={{ 
                mb: 1, 
                fontWeight: 'medium', 
                textAlign: 'center', 
                fontSize: 13,
                color: theme.palette.mode === 'dark' ? '#fff' : 'inherit'
              }}>
                Громкость: {volume.toFixed(1)}
              </Typography>
              <Slider
                value={volume}
                onChange={handleVolumeChange}
                min={0}
                max={2}
                step={0.1}
                valueLabelDisplay="auto"
                sx={{ ...commonStyles.slider(theme, theme.palette.primary.main), mb: 2 }}
                slots={{ thumb: CustomThumb }}
              />
              <Typography variant="subtitle1" sx={{ 
                mb: 1, 
                fontWeight: 'medium', 
                textAlign: 'center', 
                fontSize: 13,
                color: theme.palette.mode === 'dark' ? '#fff' : 'inherit'
              }}>
                Громкость шума: {noiseVolume.toFixed(1)}
              </Typography>
              <Slider
                value={noiseVolume}
                onChange={handleNoiseVolumeChange}
                min={0}
                max={1}
                step={0.1}
                valueLabelDisplay="auto"
                sx={{
                  ...commonStyles.slider(theme, isMAFEnabled ? theme.palette.success.main : theme.palette.primary.main),
                  mb: 2,
                  opacity: isPlaying && isMAFEnabled ? 1 : 0.6,
                }}
                disabled={!(isPlaying && isMAFEnabled)}
                slots={{ thumb: CustomThumb }}
              />
            </Box>

            {/* Кнопки старт/стоп и MAF в одной строке с подписями */}
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-end', gap: 2, mb: 1 }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    onClick={handleDAFToggle}
                    sx={{
                      width: 72,
                      height: 72,
                      minWidth: 0,
                      p: 0,
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #ff3366 0%, #ff5e62 100%)',
                      color: '#fff',
                      boxShadow: '0 4px 16px rgba(255, 51, 102, 0.4)',
                      fontSize: 32,
                      mb: 0.5,
                      '&:hover': {
                        background: 'linear-gradient(135deg, #ff5e62 0%, #ff3366 100%)',
                      },
                    }}
                  >
                    {isPlaying ? <StopCircle sx={{ fontSize: 36 }} /> : <PlayArrow sx={{ fontSize: 36 }} />}
                  </Button>
                </motion.div>
                <Typography variant="caption" sx={{ 
                  mt: 0.5, 
                  fontSize: 11, 
                  color: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.7)' : '#888', 
                  textAlign: 'center' 
                }}>DAF</Typography>
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    onClick={handleMAFToggle}
                    sx={{
                      width: 72,
                      height: 72,
                      minWidth: 0,
                      p: 0,
                      borderRadius: '50%',
                      background: isMAFEnabled
                        ? 'linear-gradient(135deg, #32b768 0%, #43e97b 100%)'
                        : 'linear-gradient(135deg, #ff3366 0%, #ff5e62 100%)',
                      color: '#fff',
                      boxShadow: isMAFEnabled
                        ? '0 4px 16px 0 #32b76840'
                        : '0 4px 16px 0 #ff336640',
                      fontSize: 32,
                      mb: 0.5,
                      transition: 'all 0.2s',
                      '&:hover': {
                        background: isMAFEnabled
                          ? 'linear-gradient(135deg, #43e97b 0%, #32b768 100%)'
                          : 'linear-gradient(135deg, #ff5e62 0%, #ff3366 100%)',
                        boxShadow: isMAFEnabled
                          ? '0 8px 32px 0 #32b76860'
                          : '0 8px 32px 0 #ff336660',
                      },
                    }}
                  >
                    <Headphones sx={{ fontSize: 36 }} />
                  </Button>
                </motion.div>
                <Typography variant="caption" sx={{ 
                  mt: 0.5, 
                  fontSize: 11, 
                  color: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.7)' : '#888', 
                  textAlign: 'center' 
                }}>MAF</Typography>
              </Box>
            </Box>

            {/* Кнопка назад */}
            <Button
              variant="contained"
              startIcon={<ArrowBack />}
              onClick={handleBackClick}
              sx={{
                ...commonStyles.primaryButton(theme),
                backgroundColor: '#ff3366',
                color: '#fff',
                borderRadius: 30,
                fontWeight: 500,
                fontSize: '0.95rem',
                minWidth: 0,
                width: 'auto',
                alignSelf: 'center',
                mt: 1,
                px: 3,
                py: 1.2,
                '&:hover': {
                  backgroundColor: '#e0294d',
                },
              }}
            >
              Назад
            </Button>
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
};

export default DAFMAF; 