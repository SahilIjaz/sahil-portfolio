'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

interface DynamicBackgroundProps {
  darkMode: boolean;
}

export function DynamicBackground({ darkMode }: DynamicBackgroundProps) {
  const { scrollYProgress } = useScroll();
  const [mounted, setMounted] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    setMounted(true);

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Transform scroll progress to background colors
  const backgroundColor = useTransform(
    scrollYProgress,
    [0, 0.25, 0.5, 0.75, 1],
    darkMode
      ? [
          'rgb(3, 7, 18)',      // Darker navy - Hero
          'rgb(10, 15, 30)',    // Dark blue - About
          'rgb(5, 10, 25)',     // Deep navy - Projects
          'rgb(10, 15, 30)',    // Dark blue - Services
          'rgb(3, 7, 18)',      // Darker navy - Contact
        ]
      : [
          'rgb(248, 250, 252)', // Slate-50 - Hero
          'rgb(241, 245, 249)', // Slate-100 - About
          'rgb(248, 250, 252)', // Slate-50 - Projects
          'rgb(241, 245, 249)', // Slate-100 - Services
          'rgb(248, 250, 252)', // Slate-50 - Contact
        ]
  );

  // Parallax effect for gradient overlays
  const y1 = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  const y2 = useTransform(scrollYProgress, [0, 1], ['0%', '-50%']);
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.4, 0.7, 0.4]);

  // Memoize particles for performance
  const particles = useMemo(() =>
    [...Array(30)].map((_, i) => ({
      id: i,
      size: Math.random() * 4 + 1,
      x: Math.random() * 100,
      y: Math.random() * 100,
      duration: Math.random() * 20 + 20,
      delay: Math.random() * 10,
    })),
    []
  );

  if (!mounted) return null;

  return (
    <motion.div
      className="fixed inset-0 -z-10 overflow-hidden"
      style={{ backgroundColor }}
    >
      {/* Main gradient mesh */}
      <div className="absolute inset-0">
        {/* Interactive gradient that follows mouse */}
        <motion.div
          className="absolute w-[800px] h-[800px] rounded-full blur-[120px] opacity-30"
          animate={{
            x: mousePosition.x * 0.5 + '%',
            y: mousePosition.y * 0.5 + '%',
          }}
          transition={{ type: 'spring', stiffness: 50, damping: 30 }}
          style={{
            background: darkMode
              ? 'radial-gradient(circle, rgba(59, 130, 246, 0.3) 0%, rgba(139, 92, 246, 0.2) 50%, transparent 70%)'
              : 'radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, rgba(139, 92, 246, 0.1) 50%, transparent 70%)',
            transform: 'translate(-50%, -50%)',
          }}
        />
      </div>

      {/* Gradient Overlay 1 - Top */}
      <motion.div
        className="absolute inset-0"
        style={{
          y: y1,
          opacity,
          background: darkMode
            ? 'radial-gradient(ellipse 80% 50% at 50% 0%, rgba(59, 130, 246, 0.15) 0%, transparent 50%)'
            : 'radial-gradient(ellipse 80% 50% at 50% 0%, rgba(59, 130, 246, 0.1) 0%, transparent 50%)',
        }}
      />

      {/* Gradient Overlay 2 - Bottom */}
      <motion.div
        className="absolute inset-0"
        style={{
          y: y2,
          opacity,
          background: darkMode
            ? 'radial-gradient(ellipse 80% 50% at 50% 100%, rgba(139, 92, 246, 0.15) 0%, transparent 50%)'
            : 'radial-gradient(ellipse 80% 50% at 50% 100%, rgba(139, 92, 246, 0.1) 0%, transparent 50%)',
        }}
      />

      {/* Animated Orbs with 3D depth */}
      <motion.div
        animate={{
          scale: [1, 1.3, 1],
          rotate: [0, 180, 360],
          x: [0, 100, 0],
          y: [0, -50, 0],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute top-[10%] left-[10%] w-[500px] h-[500px] rounded-full blur-[100px]"
        style={{
          background: darkMode
            ? 'radial-gradient(circle, rgba(59, 130, 246, 0.25) 0%, rgba(59, 130, 246, 0.1) 50%, transparent 70%)'
            : 'radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, rgba(59, 130, 246, 0.05) 50%, transparent 70%)',
        }}
      />

      <motion.div
        animate={{
          scale: [1.2, 1, 1.2],
          rotate: [180, 0, 180],
          x: [0, -80, 0],
          y: [0, 80, 0],
        }}
        transition={{
          duration: 35,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute bottom-[10%] right-[10%] w-[600px] h-[600px] rounded-full blur-[120px]"
        style={{
          background: darkMode
            ? 'radial-gradient(circle, rgba(139, 92, 246, 0.25) 0%, rgba(139, 92, 246, 0.1) 50%, transparent 70%)'
            : 'radial-gradient(circle, rgba(139, 92, 246, 0.15) 0%, rgba(139, 92, 246, 0.05) 50%, transparent 70%)',
        }}
      />

      <motion.div
        animate={{
          scale: [1, 1.4, 1],
          rotate: [0, -180, -360],
          x: [0, 50, 0],
          y: [0, 100, 0],
        }}
        transition={{
          duration: 40,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute top-[40%] right-[20%] w-[400px] h-[400px] rounded-full blur-[80px]"
        style={{
          background: darkMode
            ? 'radial-gradient(circle, rgba(236, 72, 153, 0.2) 0%, rgba(236, 72, 153, 0.05) 50%, transparent 70%)'
            : 'radial-gradient(circle, rgba(236, 72, 153, 0.1) 0%, rgba(236, 72, 153, 0.03) 50%, transparent 70%)',
        }}
      />

      {/* Cyan accent orb */}
      <motion.div
        animate={{
          scale: [1.1, 0.9, 1.1],
          x: [-30, 30, -30],
          y: [20, -20, 20],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute top-[60%] left-[30%] w-[300px] h-[300px] rounded-full blur-[60px]"
        style={{
          background: darkMode
            ? 'radial-gradient(circle, rgba(34, 211, 238, 0.15) 0%, transparent 60%)'
            : 'radial-gradient(circle, rgba(34, 211, 238, 0.1) 0%, transparent 60%)',
        }}
      />

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden">
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute rounded-full"
            style={{
              width: particle.size,
              height: particle.size,
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              background: darkMode
                ? 'rgba(255, 255, 255, 0.3)'
                : 'rgba(59, 130, 246, 0.4)',
            }}
            animate={{
              y: [0, -100, 0],
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              delay: particle.delay,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: darkMode
            ? `linear-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 1px),
               linear-gradient(90deg, rgba(255, 255, 255, 0.02) 1px, transparent 1px)`
            : `linear-gradient(rgba(0, 0, 0, 0.03) 1px, transparent 1px),
               linear-gradient(90deg, rgba(0, 0, 0, 0.03) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />

      {/* Radial gradient vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: darkMode
            ? 'radial-gradient(ellipse at center, transparent 0%, rgba(0, 0, 0, 0.3) 100%)'
            : 'radial-gradient(ellipse at center, transparent 0%, rgba(0, 0, 0, 0.05) 100%)',
        }}
      />

      {/* Noise texture overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.015]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />
    </motion.div>
  );
}
