'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface LoadingScreenProps {
  onLoadingComplete: () => void;
}

export function LoadingScreen({ onLoadingComplete }: LoadingScreenProps) {
  const [isComplete, setIsComplete] = useState(false);

  const letters = ['S', 'A', 'H', 'I', 'L'];

  // Generate orb properties once on mount to avoid hydration mismatch
  const orbs = useMemo(() => {
    return [...Array(20)].map((_, i) => ({
      width: Math.random() * 300 + 50,
      height: Math.random() * 300 + 50,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      color: ['rgba(59, 130, 246, 0.15)', 'rgba(147, 51, 234, 0.15)', 'rgba(236, 72, 153, 0.15)'][i % 3],
      xMovement: Math.random() * 100 - 50,
      yMovement: Math.random() * 100 - 50,
      duration: Math.random() * 5 + 5,
    }));
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsComplete(true);
      setTimeout(onLoadingComplete, 800);
    }, 2500);

    return () => clearTimeout(timer);
  }, [onLoadingComplete]);

  const containerVariants = {
    hidden: { opacity: 1 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.3,
      },
    },
    exit: {
      opacity: 0,
      scale: 1.5,
      filter: 'blur(20px)',
      transition: {
        duration: 0.8,
        ease: [0.43, 0.13, 0.23, 0.96],
      },
    },
  };

  const letterVariants = {
    hidden: {
      opacity: 0,
      y: 100,
      rotateX: -90,
      scale: 0.5,
    },
    visible: {
      opacity: 1,
      y: 0,
      rotateX: 0,
      scale: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 12,
        duration: 0.8,
      },
    },
  };

  const glowVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: [0, 1, 0.5],
      scale: [0.8, 1.2, 1],
      transition: {
        duration: 2,
        repeat: Infinity,
        repeatType: 'reverse' as const,
      },
    },
  };

  const lineVariants = {
    hidden: { scaleX: 0, opacity: 0 },
    visible: {
      scaleX: 1,
      opacity: 1,
      transition: {
        delay: 1.5,
        duration: 0.8,
        ease: [0.43, 0.13, 0.23, 0.96],
      },
    },
  };

  return (
    <AnimatePresence>
      {!isComplete && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Animated gradient background */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950"
            animate={{
              background: [
                'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
                'linear-gradient(135deg, #1e293b 0%, #0f172a 50%, #1e293b 100%)',
                'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
              ],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />

          {/* Animated particles/orbs */}
          <div className="absolute inset-0 overflow-hidden">
            {orbs.map((orb, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full"
                style={{
                  width: orb.width,
                  height: orb.height,
                  left: orb.left,
                  top: orb.top,
                  background: `radial-gradient(circle, ${orb.color} 0%, transparent 70%)`,
                }}
                animate={{
                  x: [0, orb.xMovement, 0],
                  y: [0, orb.yMovement, 0],
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.6, 0.3],
                }}
                transition={{
                  duration: orb.duration,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />
            ))}
          </div>

          {/* Grid pattern overlay */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                               linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
              backgroundSize: '50px 50px',
            }}
          />

          {/* Main content container */}
          <div className="relative z-10 flex flex-col items-center">
            {/* Glow effect behind letters */}
            <motion.div
              variants={glowVariants}
              initial="hidden"
              animate="visible"
              className="absolute inset-0 blur-3xl"
              style={{
                background: 'radial-gradient(ellipse at center, rgba(59, 130, 246, 0.4) 0%, rgba(147, 51, 234, 0.3) 30%, transparent 70%)',
                transform: 'scale(2)',
              }}
            />

            {/* Letters container */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="flex items-center justify-center gap-2 sm:gap-4 md:gap-6 lg:gap-8 perspective-1000"
              style={{ perspective: '1000px' }}
            >
              {letters.map((letter, index) => (
                <motion.div
                  key={index}
                  variants={letterVariants}
                  className="relative"
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  {/* Letter shadow/depth */}
                  <motion.span
                    className="absolute inset-0 text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black text-transparent"
                    style={{
                      WebkitTextStroke: '2px rgba(59, 130, 246, 0.3)',
                      transform: 'translateZ(-20px) translateY(5px)',
                    }}
                  >
                    {letter}
                  </motion.span>

                  {/* Main letter */}
                  <motion.span
                    className="relative text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black bg-gradient-to-br from-white via-blue-100 to-purple-200 bg-clip-text text-transparent"
                    animate={{
                      textShadow: [
                        '0 0 20px rgba(59, 130, 246, 0.5)',
                        '0 0 40px rgba(147, 51, 234, 0.5)',
                        '0 0 20px rgba(59, 130, 246, 0.5)',
                      ],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: index * 0.2,
                    }}
                    style={{
                      textShadow: '0 0 30px rgba(59, 130, 246, 0.5), 0 0 60px rgba(147, 51, 234, 0.3)',
                    }}
                  >
                    {letter}
                  </motion.span>

                  {/* Letter reflection */}
                  <motion.span
                    className="absolute top-full left-0 text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black bg-gradient-to-b from-blue-500/20 to-transparent bg-clip-text text-transparent"
                    style={{
                      transform: 'scaleY(-1) translateY(-20%)',
                      filter: 'blur(2px)',
                      opacity: 0.3,
                    }}
                  >
                    {letter}
                  </motion.span>
                </motion.div>
              ))}
            </motion.div>

            {/* Animated underline */}
            <motion.div
              variants={lineVariants}
              initial="hidden"
              animate="visible"
              className="mt-8 h-1 w-48 sm:w-64 md:w-80 lg:w-96 rounded-full bg-gradient-to-r from-transparent via-blue-500 to-transparent origin-center"
            />

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.8, duration: 0.5 }}
              className="mt-6 text-sm sm:text-base md:text-lg text-blue-200/60 tracking-[0.3em] uppercase"
            >
              Full Stack Developer
            </motion.p>

            {/* Loading indicator */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2 }}
              className="mt-8 flex items-center gap-2"
            >
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-2 h-2 rounded-full bg-blue-400"
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.5, 1, 0.5],
                  }}
                  transition={{
                    duration: 0.8,
                    repeat: Infinity,
                    delay: i * 0.2,
                  }}
                />
              ))}
            </motion.div>
          </div>

          {/* Corner decorations */}
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="absolute top-8 left-8 w-16 h-16 border-l-2 border-t-2 border-blue-500/30"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="absolute top-8 right-8 w-16 h-16 border-r-2 border-t-2 border-purple-500/30"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.7, duration: 0.5 }}
            className="absolute bottom-8 left-8 w-16 h-16 border-l-2 border-b-2 border-purple-500/30"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            className="absolute bottom-8 right-8 w-16 h-16 border-r-2 border-b-2 border-blue-500/30"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
