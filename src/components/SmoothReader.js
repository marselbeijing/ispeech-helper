import React, { useState, useRef, useEffect } from 'react';
import { Container, Typography, Box, Button, Slider, useTheme } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import { motion } from 'framer-motion';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { updateProgress } from '../services/storage';

const STORIES = [
  // 25 историй по ~600 символов каждая (примерные тексты, можно заменить на ваши)
  `С раннего детства речь сопровождает человека на каждом шагу. Именно через слова мы выражаем свои мысли, чувства, строим отношения с окружающими. Однажды мальчик по имени Артём, который был очень застенчивым, решил выступить на школьном празднике. Он долго готовился, учил текст, тренировался перед зеркалом. Когда настал день выступления, его голос дрожал, но он всё же смог донести до слушателей свои мысли. После выступления к нему подошли одноклассники и похвалили за смелость. С этого момента Артём понял, что речь — это не только средство общения, но и инструмент для достижения целей, преодоления страхов и раскрытия своего потенциала.`,
  `В жизни каждого человека бывают моменты, когда важно уметь говорить уверенно. Анна всегда мечтала стать учителем, но боялась выступать перед аудиторией. Она записалась на курсы ораторского мастерства, где училась правильно дышать, строить фразы и управлять голосом. Со временем её речь стала выразительной и убедительной. На первом уроке в школе Анна смогла заинтересовать учеников, и они слушали её с вниманием. Так речь помогла Анне осуществить мечту и стать вдохновляющим педагогом.`,
  `Когда Марк начал работать менеджером, он понял, что успех во многом зависит от умения договариваться и убеждать. Он стал читать книги по коммуникации, посещать тренинги и практиковаться в публичных выступлениях. Благодаря этому Марк научился слушать собеседника, грамотно излагать свои мысли и находить общий язык даже с самыми сложными клиентами. Его речь стала его главным профессиональным инструментом.`,
  `В детстве Оля часто заикалась и стеснялась говорить на людях. Родители поддерживали её, водили к логопеду и вместе занимались упражнениями для развития речи. Со временем Оля научилась контролировать дыхание, говорить медленно и чётко. В старших классах она даже стала ведущей школьных мероприятий. Её история доказывает, что упорство и поддержка близких помогают преодолеть любые трудности с речью.`,
  `Речь — это не только слова, но и эмоции, которые мы вкладываем в них. Однажды Иван, работая врачом, заметил, что пациенты лучше идут на контакт, если он говорит спокойно и доброжелательно. Он стал уделять больше внимания интонации и тону голоса. В результате пациенты стали доверять ему больше, а лечение проходило эффективнее. Так Иван убедился, что речь способна исцелять не только словом, но и настроением.`,
  `В университете Лиза боялась отвечать на семинарах, хотя знала материал. Однажды преподаватель предложил ей выступить с докладом. Лиза подготовилась, записала речь и несколько раз проговорила её вслух. На выступлении она немного волновалась, но смогла донести свои мысли до аудитории. После этого случая Лиза стала увереннее, а её речь — выразительнее.`,
  `Когда Даниил переехал в другой город, ему было сложно заводить новых друзей. Он решил посещать клуб дебатов, чтобы научиться лучше выражать свои мысли. Постепенно Даниил стал увереннее, научился слушать других и аргументированно отстаивать свою точку зрения. Благодаря этому у него появилось много друзей, а речь стала его сильной стороной.`,
  `В детстве Катя часто читала вслух сказки младшему брату. Со временем она заметила, что её речь стала более плавной и выразительной. Позже, выступая на школьных олимпиадах, Катя легко справлялась с волнением и чётко излагала свои мысли. Так простое чтение вслух помогло ей развить навыки публичных выступлений.`,
  `Алексей работал экскурсоводом и знал, как важно уметь удерживать внимание слушателей. Он учился делать паузы, менять интонацию, использовать жесты. Его экскурсии всегда были интересными, а туристы часто благодарили за увлекательный рассказ. Речь помогла Алексею стать профессионалом своего дела.`,
  `Когда Светлана стала руководителем, ей пришлось часто выступать перед коллективом. Она поняла, что важно не только что говорить, но и как. Светлана стала работать над дикцией, училась говорить чётко и уверенно. Благодаря этому её команда стала лучше понимать задачи, а рабочие процессы — эффективнее.`,
  `В детстве Игорь был очень молчаливым, но однажды он решил принять участие в театральном кружке. На репетициях он учился говорить громко, чётко и выразительно. Со временем Игорь стал одним из лучших актёров в школе, а его речь помогла ему раскрыться и найти новых друзей.`,
  `Речь играет огромную роль в профессии юриста. Марина всегда мечтала защищать людей в суде, поэтому с юности занималась риторикой. Она училась строить аргументы, говорить убедительно и спокойно. Благодаря этим навыкам Марина стала успешным адвокатом и помогла многим людям добиться справедливости.`,
  `Когда Андрей начал работать журналистом, он понял, что важно не только писать, но и уметь говорить. Он стал брать интервью, учился задавать вопросы и внимательно слушать собеседников. Со временем Андрей стал ведущим радиопрограммы, а его речь стала образцом для подражания.`,
  `В детстве Настя часто выступала на школьных концертах. Она училась говорить громко, чётко и с выражением. Эти навыки пригодились ей во взрослой жизни, когда она стала преподавателем. Настя легко находила общий язык с учениками, а её уроки были интересными и запоминающимися.`,
  `Речь помогает строить отношения. Однажды Павел поссорился с другом, но смог объяснить свои чувства и попросить прощения. Благодаря открытому разговору они сохранили дружбу. Так Павел понял, что умение говорить о своих эмоциях важно для гармонии в отношениях.`,
  `Когда Оксана переехала в другую страну, ей пришлось учить новый язык. Она много читала, слушала аудиокниги и общалась с местными жителями. Постепенно её речь стала беглой, а новые друзья появились благодаря открытому и доброжелательному общению.`,
  `В детстве Саша мечтал стать актёром. Он участвовал в школьных спектаклях, учился говорить выразительно и уверенно. Эти навыки помогли ему поступить в театральный институт и реализовать свою мечту.`,
  `Речь — это ключ к успеху в бизнесе. Олег, открыв своё дело, понял, что важно уметь презентовать идеи и договариваться с партнёрами. Он посещал тренинги по коммуникации, учился слушать и убеждать. Благодаря этому его бизнес стал успешным.`,
  `Когда Татьяна стала мамой, она много разговаривала с ребёнком, читала ему книги, рассказывала истории. Это помогло малышу быстро развить речь и стать общительным. Так Татьяна убедилась, что речь формируется с раннего возраста и зависит от общения в семье.`,
  `В университете Максим участвовал в научных конференциях. Он учился строить доклады, говорить чётко и по существу. Эти навыки помогли ему стать востребованным специалистом и уверенно выступать на международных форумах.`,
  `Речь помогает вдохновлять. Однажды учительница Мария произнесла на выпускном трогательную речь, которая запомнилась ученикам на всю жизнь. Слова поддержки и веры в успех помогли многим ребятам поверить в себя.`,
  `Когда Костя начал работать врачом, он понял, что важно уметь объяснять сложные вещи простыми словами. Он учился говорить понятно, избегать терминов и слушать пациентов. Благодаря этому его пациенты чувствовали себя увереннее и спокойнее.`,
  `В детстве Лена любила рассказывать сказки младшей сестре. Со временем она научилась говорить выразительно, использовать разные интонации и жесты. Эти навыки пригодились ей в профессии воспитателя.`,
  `Речь помогает преодолевать трудности. Однажды Дима попал в новую школу, где никого не знал. Он начал общаться с одноклассниками, рассказывать о себе, и вскоре нашёл друзей. Так Дима понял, что открытость и умение говорить помогают адаптироваться в любой ситуации.`,
  `Когда Валерия стала руководителем проекта, ей пришлось много общаться с командой. Она училась слушать, давать обратную связь и мотивировать коллег. Благодаря этому проект был успешно завершён, а команда стала сплочённой и эффективной.`
];

const MIN_SPEED = 1;
const MAX_SPEED = 100;
const DEFAULT_SPEED = 50;

// Кастомный шарик для Slider (как в Чтении с метрономом)
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

const SmoothReader = () => {
  const theme = useTheme();
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(DEFAULT_SPEED);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [storyIndex, setStoryIndex] = useState(0);
  const intervalRef = useRef(null);
  const textBoxRef = useRef(null);
  const lastActiveRef = useRef(null);
  const navigate = useNavigate();
  // Разбиваем на слова и пробелы, чтобы подсвечивать только буквы, а пробелы не подсвечивать
  const wordsArr = STORIES[storyIndex].split(/(\s+)/).filter(Boolean);
  const totalLetters = wordsArr.reduce((acc, part) => acc + (part.trim() ? part.length : 0), 0);

  const getInterval = (speed) => Math.max(30, 1200 - speed * 11.5);

  useEffect(() => {
    if (isPlaying) {
      if (currentIndex >= totalLetters) {
        setIsPlaying(false);
        // Прокрутка вверх после завершения
        setTimeout(() => {
          if (textBoxRef.current) {
            textBoxRef.current.scrollTo({ top: 0, behavior: 'smooth' });
          }
        }, 350);
        return;
      }
      let timeout = setTimeout(() => {
        setCurrentIndex((prev) => prev + 1);
      }, getInterval(speed));
      return () => clearTimeout(timeout);
    }
    // eslint-disable-next-line
  }, [isPlaying, speed, currentIndex, totalLetters]);

  // Прокрутка к текущей букве, если она выходит за пределы окна
  useEffect(() => {
    if (lastActiveRef.current && textBoxRef.current) {
      const el = lastActiveRef.current;
      const box = textBoxRef.current;
      const elRect = el.getBoundingClientRect();
      const boxRect = box.getBoundingClientRect();
      if (elRect.bottom > boxRect.bottom - 8) {
        el.scrollIntoView({ block: 'end', behavior: 'smooth' });
      }
    }
  }, [currentIndex]);

  const handlePlayPause = () => {
    if (isPlaying) {
      setIsPlaying(false);
      if (currentIndex >= totalLetters) {
        handleExerciseComplete();
      }
    } else {
      if (currentIndex >= totalLetters) {
        setCurrentIndex(0);
      }
      setIsPlaying(true);
    }
  };

  const handleSliderChange = (_, value) => {
    setSpeed(value);
  };

  const handleRandomStory = () => {
    let nextIndex = Math.floor(Math.random() * STORIES.length);
    // Исключаем повтор текущей истории
    if (nextIndex === storyIndex) {
      nextIndex = (nextIndex + 1) % STORIES.length;
    }
    setStoryIndex(nextIndex);
    setCurrentIndex(0);
    setIsPlaying(false);
  };

  const handleExerciseComplete = () => {
    updateProgress('smoothReader');
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
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'flex-start',
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
                Плавное чтение
              </Typography>
            </Box>
            <Typography
              variant="body2"
              align="center"
              sx={{ mb: 2, color: 'text.primary' }}
            >
              Читайте текст медленно и плавно, следуя за подсветкой.
            </Typography>

            <Box sx={{ mb: 0.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="caption" color="text.secondary"></Typography>
              <Typography variant="caption" sx={{ fontWeight: 500 }}>Скорость:</Typography>
              <Typography variant="caption" color="text.secondary"></Typography>
            </Box>
            <Slider
              value={speed}
              min={MIN_SPEED}
              max={MAX_SPEED}
              onChange={handleSliderChange}
              sx={{
                mb: 2,
                mx: 'auto',
                width: '90%',
                py: 2,
                '& .MuiSlider-rail': {
                  height: 6,
                  borderRadius: 3,
                },
                '& .MuiSlider-track': {
                  height: 6,
                  borderRadius: 3,
                },
              }}
              slots={{ thumb: CustomThumb }}
            />

            <Box
              sx={{
                p: 1.5,
                mb: 3,
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
                maxHeight: 180,
                overflowY: 'auto',
                display: 'flex',
                flexWrap: 'wrap',
                gap: 0.5,
                justifyContent: 'center',
                alignItems: 'center',
                lineHeight: 1.5,
                userSelect: 'none',
                letterSpacing: '-0.01em',
                wordBreak: 'break-word',
              }}
              ref={textBoxRef}
            >
              {(() => {
                let letterCount = 0;
                return wordsArr.map((part, i) => {
                  if (part.trim() === '') {
                    // Пробел между словами
                    return <span key={i}>&nbsp;</span>;
                  } else {
                    return (
                      <span key={i} style={{ display: 'inline-block', margin: '0 0.5px', padding: '1px 4px' }}>
                        {Array.from(part).map((char, j) => {
                          const isActive = letterCount < currentIndex;
                          const isLastActive = letterCount === currentIndex - 1;
                          const style = {
                            background: isActive ? 'rgba(33,150,243,0.18)' : 'transparent',
                            color: isActive ? '#1976d2' : theme.palette.text.primary,
                            borderRadius: isActive ? 3 : 0,
                            fontWeight: 500,
                            transition: 'background 0.4s cubic-bezier(0.4,0,0.2,1), color 0.4s cubic-bezier(0.4,0,0.2,1)',
                            fontSize: 15,
                            wordBreak: 'break-word',
                            whiteSpace: 'pre-line',
                          };
                          letterCount++;
                          return (
                            <span
                              key={j}
                              style={style}
                              ref={isLastActive ? lastActiveRef : null}
                            >
                              {char}
                            </span>
                          );
                        })}
                      </span>
                    );
                  }
                });
              })()}
            </Box>

            <Typography
              variant="caption"
              align="center"
              sx={{ mb: 2, display: 'block', color: theme.palette.text.primary, fontWeight: 500 }}
            >
              Повторите 3–5 раз, стараясь сохранять ритм.
            </Typography>

            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                my: 2,
              }}
            >
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  onClick={handlePlayPause}
                  sx={{
                    width: 80,
                    height: 80,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #ff3366 0%, #ff5e62 100%)',
                    color: '#fff',
                    boxShadow: '0 8px 32px 0 rgba(255, 74, 110, 0.3)',
                    fontSize: 40,
                    minWidth: 0,
                    p: 0,
                    '&:hover': { background: 'linear-gradient(135deg, #ff5e62 0%, #ff3366 100%)' },
                  }}
                >
                  {isPlaying ? <PauseIcon sx={{ fontSize: 48 }} /> : <PlayArrowIcon sx={{ fontSize: 48 }} />}
                </Button>
              </motion.div>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, width: '100%', mt: 1 }}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleRandomStory}
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
                Случайный текст
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={() => navigate(-1)}
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

export default SmoothReader; 