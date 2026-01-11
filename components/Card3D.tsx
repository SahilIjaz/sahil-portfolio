'use client';

import React, { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

interface Card3DProps {
  children: React.ReactNode;
  className?: string;
  intensity?: number;
  glowColor?: string;
}

export function Card3D({
  children,
  className = '',
  intensity = 10,
  glowColor = 'blue'
}: Card3DProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], [`${intensity}deg`, `-${intensity}deg`]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], [`-${intensity}deg`, `${intensity}deg`]);

  // Shine effect position
  const shineX = useTransform(mouseXSpring, [-0.5, 0.5], ['0%', '100%']);
  const shineY = useTransform(mouseYSpring, [-0.5, 0.5], ['0%', '100%']);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;

    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    x.set(0);
    y.set(0);
  };

  const glowColors: Record<string, string> = {
    blue: 'rgba(59, 130, 246, 0.5)',
    purple: 'rgba(139, 92, 246, 0.5)',
    pink: 'rgba(236, 72, 153, 0.5)',
    cyan: 'rgba(34, 211, 238, 0.5)',
    green: 'rgba(34, 197, 94, 0.5)',
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
      }}
      className={`relative ${className}`}
      whileHover={{ scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
    >
      {/* Main content with 3D depth */}
      <motion.div
        style={{
          transform: 'translateZ(50px)',
          transformStyle: 'preserve-3d',
        }}
        className="relative"
      >
        {children}
      </motion.div>

      {/* Dynamic shine effect */}
      <motion.div
        className="absolute inset-0 rounded-xl pointer-events-none overflow-hidden"
        style={{
          opacity: isHovered ? 1 : 0,
          transform: 'translateZ(60px)',
        }}
      >
        <motion.div
          className="absolute w-full h-full"
          style={{
            background: `radial-gradient(circle at ${shineX} ${shineY}, rgba(255, 255, 255, 0.15) 0%, transparent 50%)`,
          }}
        />
      </motion.div>

      {/* Glossy top reflection */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-transparent rounded-xl pointer-events-none"
        style={{
          opacity: isHovered ? 0.5 : 0.2,
          transform: 'translateZ(55px)',
        }}
        transition={{ duration: 0.3 }}
      />

      {/* Edge highlight */}
      <motion.div
        className="absolute inset-0 rounded-xl pointer-events-none"
        style={{
          opacity: isHovered ? 1 : 0,
          boxShadow: `inset 0 1px 1px rgba(255, 255, 255, 0.1), inset 0 -1px 1px rgba(0, 0, 0, 0.1)`,
          transform: 'translateZ(45px)',
        }}
        transition={{ duration: 0.3 }}
      />

      {/* Glow effect */}
      <motion.div
        className="absolute -inset-2 rounded-2xl blur-xl -z-10"
        style={{
          background: `radial-gradient(ellipse at center, ${glowColors[glowColor] || glowColors.blue} 0%, transparent 70%)`,
          opacity: isHovered ? 0.6 : 0,
        }}
        transition={{ duration: 0.3 }}
      />

      {/* Shadow */}
      <motion.div
        className="absolute inset-0 rounded-xl -z-20"
        style={{
          boxShadow: isHovered
            ? `0 25px 50px -12px rgba(0, 0, 0, 0.4), 0 0 50px -15px ${glowColors[glowColor] || glowColors.blue}`
            : '0 10px 30px -10px rgba(0, 0, 0, 0.3)',
          transform: 'translateZ(-10px)',
        }}
        transition={{ duration: 0.3 }}
      />
    </motion.div>
  );
}

// Enhanced floating card with continuous animation
interface FloatingCardProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export function FloatingCard({ children, className = '', delay = 0 }: FloatingCardProps) {
  return (
    <motion.div
      initial={{ y: 0 }}
      animate={{
        y: [-10, 10, -10],
        rotateX: [2, -2, 2],
        rotateY: [-2, 2, -2],
      }}
      transition={{
        duration: 6,
        repeat: Infinity,
        ease: 'easeInOut',
        delay,
      }}
      style={{ transformStyle: 'preserve-3d' }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Magnetic button effect
interface MagneticButtonProps {
  children: React.ReactNode;
  className?: string;
}

export function MagneticButton({ children, className = '' }: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    x.set((e.clientX - centerX) * 0.3);
    y.set((e.clientY - centerY) * 0.3);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const springConfig = { stiffness: 300, damping: 20 };
  const xSpring = useSpring(x, springConfig);
  const ySpring = useSpring(y, springConfig);

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x: xSpring, y: ySpring }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Tilt card with perspective
interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
}

export function TiltCard({ children, className = '' }: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const percentX = (e.clientX - centerX) / (rect.width / 2);
    const percentY = (e.clientY - centerY) / (rect.height / 2);

    rotateY.set(percentX * 15);
    rotateX.set(-percentY * 15);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    rotateX.set(0);
    rotateY.set(0);
  };

  const springConfig = { stiffness: 400, damping: 30 };
  const rotateXSpring = useSpring(rotateX, springConfig);
  const rotateYSpring = useSpring(rotateY, springConfig);

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX: rotateXSpring,
        rotateY: rotateYSpring,
        transformStyle: 'preserve-3d',
        transformPerspective: 1000,
      }}
      whileHover={{ scale: 1.05 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className={`relative ${className}`}
    >
      <motion.div
        style={{ transform: 'translateZ(30px)' }}
      >
        {children}
      </motion.div>

      {/* Reflection */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/10 rounded-xl pointer-events-none"
        style={{
          opacity: isHovered ? 1 : 0,
          transform: 'translateZ(35px)',
        }}
      />
    </motion.div>
  );
}
