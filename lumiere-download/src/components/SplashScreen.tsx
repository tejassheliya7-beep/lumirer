import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const PARTICLE_COUNT = 30;
const SPARKLE_COUNT = 20;

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
  type: 'diamond' | 'gold';
}

interface Sparkle {
  id: number;
  x: number;
  y: number;
  size: number;
  delay: number;
}

const generateParticles = (): Particle[] =>
  Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 3 + 1,
    duration: Math.random() * 4 + 3,
    delay: Math.random() * 2,
    type: Math.random() > 0.5 ? 'diamond' : 'gold',
  }));

const generateSparkles = (): Sparkle[] =>
  Array.from({ length: SPARKLE_COUNT }, (_, i) => ({
    id: i,
    x: 30 + Math.random() * 40,
    y: 35 + Math.random() * 30,
    size: Math.random() * 4 + 2,
    delay: 3.2 + Math.random() * 1.2,
  }));

const easeOutExpo = [0.16, 1, 0.3, 1] as const;
const easeInOutQuart = [0.76, 0, 0.24, 1] as const;

const SplashScreen = ({ onComplete }: { onComplete: () => void }) => {
  const [particles] = useState(generateParticles);
  const [sparkles] = useState(generateSparkles);
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 400),    // spotlight
      setTimeout(() => setPhase(2), 1200),   // logo reveal
      setTimeout(() => setPhase(3), 2400),   // JEWEL text
      setTimeout(() => setPhase(4), 3600),   // sparkle finale
      setTimeout(() => setPhase(5), 4400),   // exit
      setTimeout(onComplete, 5000),
    ];
    return () => timers.forEach(clearTimeout);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {phase < 5 && (
        <motion.div
          className="fixed inset-0 z-[9999] overflow-hidden"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: [...easeOutExpo] }}
        >
          {/* Background: dark to warm beige */}
          <motion.div
            className="absolute inset-0"
            initial={{ background: 'linear-gradient(180deg, hsl(0 0% 4%) 0%, hsl(0 0% 8%) 100%)' }}
            animate={{
              background: phase >= 1
                ? 'linear-gradient(180deg, hsl(40 20% 8%) 0%, hsl(40 30% 12%) 100%)'
                : 'linear-gradient(180deg, hsl(0 0% 4%) 0%, hsl(0 0% 8%) 100%)',
            }}
            transition={{ duration: 2, ease: [...easeInOutQuart] }}
          />

          {/* Center spotlight */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: phase >= 1 ? 1 : 0 }}
            transition={{ duration: 1.5, ease: [...easeOutExpo] }}
          >
            <motion.div
              className="w-[280px] h-[280px] sm:w-[400px] sm:h-[400px] md:w-[600px] md:h-[600px] rounded-full"
              style={{
                background: 'radial-gradient(circle, hsla(43,72%,52%,0.08) 0%, hsla(43,60%,50%,0.03) 40%, transparent 70%)',
              }}
              animate={{
                scale: phase >= 2 ? 1.8 : 1,
                opacity: phase >= 4 ? 0.3 : 1,
              }}
              transition={{ duration: 2, ease: [...easeOutExpo] }}
            />
          </motion.div>

          {/* Diamond particles & golden sparkles */}
          {particles.map((p) => (
            <motion.div
              key={p.id}
              className="absolute rounded-full"
              style={{
                left: `${p.x}%`,
                top: `${p.y}%`,
                width: p.size,
                height: p.size,
                background: p.type === 'diamond'
                  ? 'radial-gradient(circle, hsla(0,0%,100%,0.9), hsla(0,0%,100%,0.1))'
                  : 'radial-gradient(circle, hsla(43,72%,60%,0.9), hsla(43,72%,52%,0.1))',
                boxShadow: p.type === 'diamond'
                  ? '0 0 4px hsla(0,0%,100%,0.4)'
                  : '0 0 6px hsla(43,72%,52%,0.5)',
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{
                opacity: [0, 0.8, 0.3, 0.8, 0],
                y: [20, -30, -10, -40, -60],
                x: [0, p.type === 'diamond' ? 10 : -10, 5, -5, 0],
              }}
              transition={{
                duration: p.duration,
                delay: p.delay,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          ))}

          {/* Diamond light burst in center */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: phase >= 2 ? 1 : 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              className="relative"
              initial={{ scale: 0, opacity: 0 }}
              animate={{
                scale: phase >= 2 ? [0, 1.5, 1] : 0,
                opacity: phase >= 2 ? [0, 1, 0.6] : 0,
              }}
              transition={{ duration: 1, ease: [...easeOutExpo] }}
            >
              {/* Diamond shape */}
              <div
                className="w-3 h-3 rotate-45"
                style={{
                  background: 'linear-gradient(135deg, hsla(0,0%,100%,0.95), hsla(43,72%,70%,0.8))',
                  boxShadow: '0 0 40px 15px hsla(43,72%,52%,0.3), 0 0 80px 30px hsla(43,72%,52%,0.15)',
                }}
              />
              {/* Light rays */}
              {[0, 45, 90, 135].map((angle) => (
                <motion.div
                  key={angle}
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 origin-center"
                  style={{
                    width: 1,
                    height: 60,
                    background: 'linear-gradient(180deg, hsla(43,72%,60%,0.6), transparent)',
                    rotate: `${angle}deg`,
                  }}
                  initial={{ scaleY: 0, opacity: 0 }}
                  animate={{
                    scaleY: phase >= 2 ? [0, 1, 0.4] : 0,
                    opacity: phase >= 2 ? [0, 0.8, 0.2] : 0,
                  }}
                  transition={{ duration: 1.2, delay: 0.2, ease: [...easeOutExpo] }}
                />
              ))}
            </motion.div>
          </motion.div>

          {/* LUMIÈRE text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <motion.div
              className="relative"
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{
                opacity: phase >= 2 ? 1 : 0,
                scale: phase >= 2 ? 1 : 0.85,
              }}
              transition={{ duration: 1.2, delay: 0.3, ease: [...easeOutExpo] }}
            >
              {/* Main text */}
              <h1
                className="font-serif text-4xl sm:text-5xl md:text-7xl lg:text-8xl tracking-[0.1em] sm:tracking-[0.15em] font-medium"
                style={{
                  color: 'hsl(43, 72%, 60%)',
                  textShadow: '0 0 40px hsla(43,72%,52%,0.3), 0 2px 10px hsla(0,0%,0%,0.5)',
                }}
              >
                LUMIÈRE
              </h1>

              {/* Gold shine sweep */}
              <motion.div
                className="absolute inset-0 overflow-hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: phase >= 2 ? 1 : 0 }}
              >
                <motion.div
                  className="absolute inset-y-0 w-24 -skew-x-12"
                  style={{
                    background: 'linear-gradient(90deg, transparent, hsla(43,80%,75%,0.5), hsla(0,0%,100%,0.3), hsla(43,80%,75%,0.5), transparent)',
                  }}
                  initial={{ left: '-30%' }}
                  animate={{ left: phase >= 2 ? ['- 30%', '130%'] : '-30%' }}
                  transition={{ duration: 1.5, delay: 0.8, ease: [...easeInOutQuart] }}
                />
              </motion.div>

              {/* Second shine sweep */}
              <motion.div
                className="absolute inset-0 overflow-hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: phase >= 3 ? 1 : 0 }}
              >
                <motion.div
                  className="absolute inset-y-0 w-16 -skew-x-12"
                  style={{
                    background: 'linear-gradient(90deg, transparent, hsla(43,80%,80%,0.3), hsla(0,0%,100%,0.2), transparent)',
                  }}
                  initial={{ left: '-20%' }}
                  animate={{ left: phase >= 3 ? ['-20%', '130%'] : '-20%' }}
                  transition={{ duration: 1.2, delay: 0.3, ease: [...easeInOutQuart] }}
                />
              </motion.div>
            </motion.div>

            {/* Thin gold line separator */}
            <motion.div
              className="mt-4 h-px bg-gradient-to-r from-transparent via-primary to-transparent"
              initial={{ width: 0, opacity: 0 }}
              animate={{
                width: phase >= 3 ? 120 : 0,
                opacity: phase >= 3 ? 0.6 : 0,
              }}
              transition={{ duration: 0.8, ease: [...easeOutExpo] }}
            />

            {/* JEWEL text */}
            <motion.div
              className="mt-4 relative"
              initial={{ opacity: 0, y: 10 }}
              animate={{
                opacity: phase >= 3 ? 1 : 0,
                y: phase >= 3 ? 0 : 10,
              }}
              transition={{ duration: 0.8, delay: 0.2, ease: [...easeOutExpo] }}
            >
              <p
                className="text-sm sm:text-base md:text-lg uppercase tracking-[0.5em] font-light"
                style={{
                  color: 'hsl(40, 20%, 70%)',
                  textShadow: '0 0 20px hsla(43,72%,52%,0.2)',
                }}
              >
                Jewel
              </p>
              {/* Soft glow behind JEWEL */}
              <motion.div
                className="absolute -inset-4 -z-10 rounded-full"
                style={{
                  background: 'radial-gradient(ellipse, hsla(43,72%,52%,0.1), transparent 70%)',
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: phase >= 3 ? 1 : 0 }}
                transition={{ duration: 1 }}
              />
            </motion.div>
          </div>

          {/* Finale sparkles around logo */}
          {phase >= 4 &&
            sparkles.map((s) => (
              <motion.div
                key={s.id}
                className="absolute"
                style={{ left: `${s.x}%`, top: `${s.y}%` }}
                initial={{ opacity: 0, scale: 0 }}
                animate={{
                  opacity: [0, 1, 0],
                  scale: [0, 1, 0],
                }}
                transition={{
                  duration: 0.8,
                  delay: s.delay - 3.2,
                  ease: 'easeOut',
                }}
              >
                {/* 4-point star sparkle */}
                <svg width={s.size * 2} height={s.size * 2} viewBox="0 0 20 20">
                  <path
                    d="M10 0 L11 8 L20 10 L11 12 L10 20 L9 12 L0 10 L9 8 Z"
                    fill="hsla(43,72%,70%,0.9)"
                    filter="drop-shadow(0 0 3px hsla(43,72%,52%,0.6))"
                  />
                </svg>
              </motion.div>
            ))}

          {/* Vignette overlay for cinematic feel */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse at center, transparent 50%, hsla(0,0%,0%,0.4) 100%)',
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SplashScreen;
