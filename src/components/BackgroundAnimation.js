import React, { useEffect, useRef } from 'react';
import { useTheme } from '@mui/material';

const BackgroundAnimation = () => {
  const canvasRef = useRef(null);
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let particles = [];
    
    // Устанавливаем размер канваса на полный экран
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles(); // Пересоздаем частицы при изменении размера
    };
    
    window.addEventListener('resize', handleResize);
    handleResize();
    
    // Создаем частицы
    function initParticles() {
      particles = [];
      // Увеличим количество и размер частиц для большей заметности
      const particleCount = Math.min(Math.floor(window.innerWidth / 28), 32); 
      
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          radius: Math.random() * 2.2 + 1.1, // Увеличенный размер
          color: isDark 
            ? `rgba(255, 255, 255, ${Math.random() * 0.10 + 0.07})` // Более заметные в темном режиме
            : `rgba(${60 + Math.floor(Math.random()*40)}, ${180 + Math.floor(Math.random()*40)}, 255, ${Math.random() * 0.18 + 0.13})`, // Ярко-голубые и бирюзовые, более насыщенные и прозрачные
          initialX: Math.random() * canvas.width,
          initialY: Math.random() * canvas.height,
          amplitude: Math.random() * 30 + 10,
          frequency: Math.random() * 0.003 + 0.001,
          phase: Math.random() * Math.PI * 2,
        });
      }
    }
    
    // Анимируем частицы
    let angle = 0;
    const animate = () => {
      angle += 0.0012;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach((particle, index) => {
        const xOffset = Math.sin(angle + particle.phase) * particle.amplitude;
        const yOffset = Math.cos(angle + particle.phase) * particle.amplitude;
        const x = particle.initialX + xOffset;
        const y = particle.initialY + yOffset;
        
        ctx.beginPath();
        ctx.arc(x, y, particle.radius, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.shadowColor = particle.color;
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.shadowBlur = 0;
        
        if (index % 2 === 0) {
          const maxConnections = 4;
          let connections = 0;
          for (let j = 0; j < particles.length && connections < maxConnections; j++) {
            if (index !== j) {
              const otherParticle = particles[j];
              const otherX = otherParticle.initialX + Math.sin(angle + otherParticle.phase) * otherParticle.amplitude;
              const otherY = otherParticle.initialY + Math.cos(angle + otherParticle.phase) * otherParticle.amplitude;
              const dx = x - otherX;
              const dy = y - otherY;
              const distance = Math.sqrt(dx * dx + dy * dy);
              if (distance < 100) {
                ctx.beginPath();
                ctx.moveTo(x, y);
                ctx.lineTo(otherX, otherY);
                ctx.strokeStyle = isDark 
                  ? `rgba(255, 255, 255, ${0.045 * (1 - distance / 100)})` 
                  : `rgba(0, 180, 255, ${0.09 * (1 - distance / 100)})`;
                ctx.lineWidth = 0.7;
                ctx.stroke();
                connections++;
              }
            }
          }
        }
      });
      
      animationFrameId = window.requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      window.cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [isDark]);
  
  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0,
      }}
    />
  );
};

export default BackgroundAnimation; 