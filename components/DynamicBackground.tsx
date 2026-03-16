'use client';

import { useEffect, useState, useMemo } from 'react';
import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion';

interface DynamicBackgroundProps {
  darkMode: boolean;
}

export function DynamicBackground({ darkMode }: DynamicBackgroundProps) {
  const { scrollYProgress } = useScroll();
  const [mounted, setMounted] = useState(false);

  // Use motion values directly to avoid React re-renders on mouse move
  const mouseX = useMotionValue(50);
  const mouseY = useMotionValue(50);
  const smoothX = useSpring(mouseX, { stiffness: 50, damping: 30 });
  const smoothY = useSpring(mouseY, { stiffness: 50, damping: 30 });

  useEffect(() => {
    setMounted(true);

    let rafId: number;
    let pendingX = 50;
    let pendingY = 50;

    const handleMouseMove = (e: MouseEvent) => {
      pendingX = (e.clientX / window.innerWidth) * 100;
      pendingY = (e.clientY / window.innerHeight) * 100;
    };

    const tick = () => {
      mouseX.set(pendingX);
      mouseY.set(pendingY);
      rafId = requestAnimationFrame(tick);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    rafId = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(rafId);
    };
  }, [mouseX, mouseY]);

  // Transform scroll progress to background colors
  const backgroundColor = useTransform(
    scrollYProgress,
    [0, 0.25, 0.5, 0.75, 1],
    darkMode
      ? [
          'rgb(3, 7, 18)',
          'rgb(10, 15, 30)',
          'rgb(5, 10, 25)',
          'rgb(10, 15, 30)',
          'rgb(3, 7, 18)',
        ]
      : [
          'rgb(248, 250, 252)',
          'rgb(241, 245, 249)',
          'rgb(248, 250, 252)',
          'rgb(241, 245, 249)',
          'rgb(248, 250, 252)',
        ]
  );

  // Parallax effect for gradient overlays
  const y1 = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  const y2 = useTransform(scrollYProgress, [0, 1], ['0%', '-50%']);
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.4, 0.7, 0.4]);

  // Derived motion values for the mouse-following gradient (no re-renders)
  const gradientX = useTransform(smoothX, (v) => `${v * 0.5}%`);
  const gradientY = useTransform(smoothY, (v) => `${v * 0.5}%`);

  // Reduced to 8 particles (from 30)
  const particles = useMemo(() =>
    [...Array(8)].map((_, i) => ({
      id: i,
      size: Math.random() * 3 + 1,
      x: Math.random() * 100,
      y: Math.random() * 100,
      duration: Math.random() * 15 + 25,
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
      {/* Interactive gradient that follows mouse - no React re-renders */}
      <motion.div
        className="absolute w-[600px] h-[600px] rounded-full blur-[100px] opacity-25"
        style={{
          x: gradientX,
          y: gradientY,
          background: darkMode
            ? 'radial-gradient(circle, rgba(59, 130, 246, 0.3) 0%, rgba(139, 92, 246, 0.2) 50%, transparent 70%)'
            : 'radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, rgba(139, 92, 246, 0.1) 50%, transparent 70%)',
          translateX: '-50%',
          translateY: '-50%',
        }}
      />

      {/* Gradient Overlay 1 - Top */}
      <motion.div
        className="absolute inset-0"
        style={{
          y: y1,
          opacity,
          background: darkMode
            ? 'radial-gradient(ellipse 80% 50% at 50% 0%, rgba(59, 130, 246, 0.12) 0%, transparent 50%)'
            : 'radial-gradient(ellipse 80% 50% at 50% 0%, rgba(59, 130, 246, 0.08) 0%, transparent 50%)',
        }}
      />

      {/* Gradient Overlay 2 - Bottom */}
      <motion.div
        className="absolute inset-0"
        style={{
          y: y2,
          opacity,
          background: darkMode
            ? 'radial-gradient(ellipse 80% 50% at 50% 100%, rgba(139, 92, 246, 0.12) 0%, transparent 50%)'
            : 'radial-gradient(ellipse 80% 50% at 50% 100%, rgba(139, 92, 246, 0.08) 0%, transparent 50%)',
        }}
      />

      {/* Animated Orbs - reduced to 3, slower, CSS-only animation */}
      <div
        className="absolute top-[10%] left-[10%] w-[400px] h-[400px] rounded-full blur-[80px]"
        style={{
          background: darkMode
            ? 'radial-gradient(circle, rgba(59, 130, 246, 0.2) 0%, transparent 70%)'
            : 'radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, transparent 70%)',
          animation: 'orbFloat1 35s ease-in-out infinite',
          willChange: 'transform',
        }}
      />

      <div
        className="absolute bottom-[10%] right-[10%] w-[450px] h-[450px] rounded-full blur-[90px]"
        style={{
          background: darkMode
            ? 'radial-gradient(circle, rgba(139, 92, 246, 0.2) 0%, transparent 70%)'
            : 'radial-gradient(circle, rgba(139, 92, 246, 0.1) 0%, transparent 70%)',
          animation: 'orbFloat2 40s ease-in-out infinite',
          willChange: 'transform',
        }}
      />

      <div
        className="absolute top-[40%] right-[20%] w-[300px] h-[300px] rounded-full blur-[70px]"
        style={{
          background: darkMode
            ? 'radial-gradient(circle, rgba(236, 72, 153, 0.15) 0%, transparent 70%)'
            : 'radial-gradient(circle, rgba(236, 72, 153, 0.08) 0%, transparent 70%)',
          animation: 'orbFloat3 30s ease-in-out infinite',
          willChange: 'transform',
        }}
      />

      {/* Reduced particles (8 instead of 30) */}
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
              y: [0, -80, 0],
              opacity: [0, 0.8, 0],
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
    </motion.div>
  );
}
