'use client';

import React, { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

interface Card3DProps {
  children: React.ReactNode;
  className?: string;
}

export function Card3D({ children, className = '' }: Card3DProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 400, damping: 35 });
  const mouseYSpring = useSpring(y, { stiffness: 400, damping: 35 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["5deg", "-5deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-5deg", "5deg"]);

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

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      className={`relative ${className}`}
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 500, damping: 28 }}
    >
      <motion.div
        style={{
          transform: "translateZ(75px)",
          transformStyle: "preserve-3d",
        }}
        className="relative"
      >
        {children}
      </motion.div>

      {/* Glossy reflection effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent rounded-xl pointer-events-none"
        style={{
          opacity: isHovered ? 0.3 : 0,
          transform: "translateZ(80px)",
        }}
        transition={{ duration: 0.2 }}
      />

      {/* Glow effect */}
      <motion.div
        className="absolute -inset-1 bg-gradient-to-r from-blue-500/50 via-purple-500/50 to-pink-500/50 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity -z-10"
        style={{
          opacity: isHovered ? 0.5 : 0,
        }}
        transition={{ duration: 0.2 }}
      />
    </motion.div>
  );
}
