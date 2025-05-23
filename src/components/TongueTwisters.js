import React, { useState, useEffect, useRef } from 'react';
import {
  Container,
  Typography,
  Box,
  Button,
  useTheme,
  Tabs,
  Tab,
} from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { playSound } from '../services/sound';
import { vibrate } from '../services/vibration';
import { updateProgress } from '../services/storage';

const tongueTwisters = {
  beginner: [
    'Шла Саша по шоссе и сосала сушку.',
    'Карл у Клары украл кораллы, а Клара у Карла украла кларнет.',
    'На дворе трава, на траве дрова.',
    'От топота копыт пыль по полю летит.',
    'У четырёх черепах четыре черепашонка.',
    'Повар Пётр пёк пироги.',
    'Кукушка кукушонку купила капюшон.',
    'Тридцать три корабля лавировали, лавировали, да не вылавировали.',
    'Сшит колпак не по-колпаковски, вылит колокол не по-колоколовски.',
    'Петя пел, пел, да не допел.',
    'У ежа ежата, у ужа ужата.',
    'У перепёлки перепёлята.',
    'Везёт Сенька Соньку на санках.',
    'Сеня с Соней везут Саню на санках.',
    'Саша шёл по шоссе и сосал сушку.'
  ],
  advanced: [
    'В недрах тундры выдры в гетрах тырят в вёдра ядра кедров.',
    'Шестнадцать шестёрок шестерили, шестерили, да не вышестерили.',
    'Ушёл косой козёл с козой, козой косой козёл косой.',
    'Шесть мышат в камышах шуршат, а шустрый шмель над шиповником шумно жужжит.',
    'Цапля чахла, цапля сохла, цапля сдохла.',
    'Ткет ткач ткани на платки Тане.',
    'Расскажите про покупки. Про какие про покупки? Про покупки, про покупки, про покупочки свои.',
    'Яшма в замше замшела, замша в яшме заушмела.',
    'Чукча в чуме чистит чуни. Чистота у чукчи в чуме.',
    'На дворе растёт трава, на траве стоят дрова.',
    'Брейте бороду бобру - будет браво бобр бодаться.',
    'Пастух пасёт пастбище, пастбище пастух пасёт.',
    'Плотник Павел плотит плот, плотит плот, да не выплотит.',
    'Пирожки у Петра, пироги у Павла.',
    'Лиса Лариса ловко ловила лягушек.'
  ],
  master: [
    `В четверг четвёртого числа в четыре с четвертью часа четыре чёрненьких чумазеньких чертёнка чертили чёрными чернилами чертёж. Чертёж был чересчур черноват, чернила чернели, чертёнок чертыхался, чертил чертёж до черноты в глазах.`,
    `В недрах тундры выдры в гетрах тырят в вёдра ядра кедров. Выдрав с выдры в тундре гетры, вытру выдрой ядра кедров, вытру гетрой выдре морду — ядра в вёдра, выдра в тундру. Всё это происходило в тёмных недрах тундры, где выдры в гетрах не ведают бедра.`,
    `Протокол про протокол протоколом запротоколировали. Регулировщик лигуриец регулировал в Лигурии. Деидеологизировали-деидеологизировали, и додеидеологизировались. Всё это происходило на лигурийском вокзале, где лигурийский регулировщик регулировал лигурийский поезд.`,
    `Шестнадцать шестёрок шестерили, шестерили, да не вышестерили. Шестнадцать шестёрок шестерёнок шуршали, шуршали, да не вышуршали. Шестнадцать шестёрок шестерёнок шуршали в шестнадцати шестерёнчатых часах.`,
    `Сшит колпак не по-колпаковски, вылит колокол не по-колоколовски. Надо колпак переколпаковать, перевыколпаковать, надо колокол переколоколовать, перевыколоколовать. Колпаковский колпак переколпакован, колоколовский колокол переколоколован.`,
    `У перепела и перепелки пять перепелят в перелеске прелом прыгали и пели. Перепел перепелке, перепелка перепелу, перепелята перепелу и перепелке - перепел, перепелка, перепелята - перепелиное семейство. Перепел перепелку перепел, перепелка перепела перепела.`,
    `Тридцать три корабля лавировали, лавировали, да не вылавировали. Все храбрые хорваты хотят в хоровод. Тридцать три корабля лавировали по волнам, да не вылавировали, а хорваты в хороводе хорохорились.`,
    `Четыре чёрненьких чумазеньких чертёнка чертили чёрными чернилами чертёж. Чернила были чересчур чернильные, чертёж был чересчур черноват, чертёнок чертыхался, чертил чертёж до черноты в глазах.`,
    `Семьсот семьдесят семь всех скороговорок перескороговорили, перевыскороговорили. Семьсот семьдесят семь скороговорщиков перескороговорили, перевыскороговорили скороговорки.`,
    `Сорок сорок сороковок совали сорокам в сороковые сорочки. Сорок сорок сороковок совали сорокам в сороковые сорочки сорок раз.`,
    `Десять девочек-девчонок делили дыню на двоих. Девять девочек-девчонок делили дыню на девятерых. Дыня делилась, да не поделилась.`,
    `Пастух пасёт пастбище, пастбище пастух пасёт. Пастух пасёт пастбище, пастбище пастух пасёт, пастух пастбище не выпасёт, пока пастбище пастух пасёт.`,
    `Плотник Павел плотит плот, плотит плот, да не выплотит. Плотник Павел плотит плот, плотит плот, да не выплотит, пока плот не выплотит.`,
    `Пирожки у Петра, пироги у Павла. Пирожки у Петра, пироги у Павла, пирожки у Петра, пироги у Павла, пирожки у Петра, пироги у Павла.`,
    `Лиса Лариса ловко ловила лягушек. Лиса Лариса ловко ловила лягушек, ловко ловила лягушек, ловко ловила лягушек, ловко ловила лягушек.`
  ]
};

const levels = [
  { label: 'Новичок', value: 'beginner' },
  { label: 'Продвинутый', value: 'advanced' },
  { label: 'Мастер', value: 'master' },
];

const TongueTwisters = () => {
  const theme = useTheme();
  const [level, setLevel] = useState('beginner');
  const [currentTwister, setCurrentTwister] = useState('');
  const [isVisible, setIsVisible] = useState(true);
  const textBoxRef = useRef(null);

  useEffect(() => {
    getRandomTwister(level);
  }, [level]);

  const getRandomTwister = (lvl = level) => {
    setIsVisible(false);
    setTimeout(() => {
      const arr = tongueTwisters[lvl];
      const randomIndex = Math.floor(Math.random() * arr.length);
      setCurrentTwister(arr[randomIndex]);
      setIsVisible(true);
      playSound('click');
      vibrate('click');
      handleExerciseComplete();
      setTimeout(() => {
        if (textBoxRef.current) {
          textBoxRef.current.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }, 350);
    }, 300);
  };

  const handleBackClick = () => {
    playSound('click');
    vibrate('click');
    window.history.back();
  };

  const handleExerciseComplete = () => {
    updateProgress('tongueTwister');
  };

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
          style={{ width: '100%', display: 'flex', justifyContent: 'center' }}
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
              height: 'auto',
              minHeight: '540px',
              maxHeight: '700px',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'flex-start',
              position: 'relative',
            }}
          >
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
                Скороговорки
              </Typography>
            </Box>
            <Tabs
              value={level}
              onChange={(_, v) => setLevel(v)}
              variant="fullWidth"
              sx={{ mb: 2, width: '100%' }}
            >
              {levels.map(l => (
                <Tab key={l.value} value={l.value} label={l.label} sx={{ fontWeight: 600 }} />
              ))}
            </Tabs>
            
            <Box sx={{ flex: 1, width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: 0 }}>
              <Box
                sx={{
                  p: 1.5,
                  borderRadius: 4,
                  background: theme.palette.mode === 'dark' ? '#2d2d2d' : '#fff',
                  boxShadow: theme.palette.mode === 'dark' 
                    ? '0 4px 24px 0 rgba(0,0,0,0.3)' 
                    : '0 4px 24px 0 rgba(60,60,120,0.10)',
                  fontSize: 15,
                  color: theme.palette.text.primary,
                  fontWeight: 500,
                  textAlign: 'center',
                  minHeight: 40,
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: 0.5,
                  justifyContent: 'center',
                  alignItems: 'center',
                  lineHeight: 1.5,
                  maxHeight: 180,
                  overflowY: 'auto',
                  width: '100%',
                  margin: '0 auto',
                  maxWidth: 520,
                  userSelect: 'none',
                  letterSpacing: '-0.01em',
                  wordBreak: 'break-word',
                }}
                ref={textBoxRef}
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: isVisible ? 1 : 0, scale: isVisible ? 1 : 0.97 }}
                  transition={{ duration: 0.3 }}
                  style={{ width: '100%' }}
                >
                  <Typography
                    variant="h6"
                    sx={{
                      color: theme.palette.text.primary,
                      textAlign: 'center',
                      fontWeight: 500,
                      fontSize: '1.1rem',
                      lineHeight: 1.6,
                      wordBreak: 'break-word',
                      whiteSpace: 'pre-line',
                      m: 0,
                    }}
                  >
                    {currentTwister}
                  </Typography>
                </motion.div>
              </Box>
            </Box>

            <Typography
              variant="caption"
              align="center"
              sx={{ mb: 2, mt: 2, display: 'block', color: theme.palette.text.primary, fontWeight: 500 }}
            >
              Тренируйте дикцию и артикуляцию, повторяя скороговорки вслух.
              <br /><br />
              Повторите 3–5 раз, стараясь не сбиваться с ритма.
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, width: '100%', mb: 1 }}>
              <Button
                variant="contained"
                color="primary"
                onClick={() => getRandomTwister()}
                sx={{
                  py: 1,
                  px: 2.5,
                  borderRadius: 30,
                  fontWeight: 500,
                  fontSize: '0.95rem',
                  minWidth: 0,
                  width: 'auto',
                  alignSelf: 'center',
                  backgroundColor: '#ff3366',
                  '&:hover': {
                    backgroundColor: '#e0294d',
                  },
                }}
              >
                Случайная скороговорка
              </Button>
              <Button
                variant="contained"
                color="primary"
                startIcon={<ArrowBack />}
                onClick={handleBackClick}
                sx={{
                  py: 1,
                  px: 2.5,
                  borderRadius: 30,
                  fontWeight: 500,
                  fontSize: '0.95rem',
                  minWidth: 0,
                  width: 'auto',
                  alignSelf: 'center',
                  backgroundColor: '#ff3366',
                  '&:hover': {
                    backgroundColor: '#e0294d',
                  },
                }}
              >
                Назад
              </Button>
            </Box>
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
};

export default TongueTwisters; 