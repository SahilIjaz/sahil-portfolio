'use client';

import React, { useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

interface DynamicBackgroundProps {
  darkMode: boolean;
}

export function DynamicBackground({ darkMode }: DynamicBackgroundProps) {
  const { scrollYProgress } = useScroll();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Transform scroll progress to background colors
  const backgroundColor = useTransform(
    scrollYProgress,
    [0, 0.25, 0.5, 0.75, 1],
    darkMode
      ? [
          'rgb(17, 24, 39)',     // gray-900 - Hero
          'rgb(31, 41, 55)',     // gray-800 - About
          'rgb(17, 24, 39)',     // gray-900 - Projects
          'rgb(31, 41, 55)',     // gray-800 - Services
          'rgb(17, 24, 39)',     // gray-900 - Contact
        ]
      : [
          'rgb(255, 255, 255)',  // white - Hero
          'rgb(249, 250, 251)',  // gray-50 - About
          'rgb(255, 255, 255)',  // white - Projects
          'rgb(249, 250, 251)',  // gray-50 - Services
          'rgb(255, 255, 255)',  // white - Contact
        ]
  );

  // Parallax effect for gradient overlays
  const y1 = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);
  const y2 = useTransform(scrollYProgress, [0, 1], ['0%', '-100%']);
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.3, 0.6, 0.3]);

  if (!mounted) return null;

  return (
    <motion.div
      className="fixed inset-0 -z-10"
      style={{ backgroundColor }}
    >
      {/* Gradient Overlay 1 */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 dark:from-blue-500/5 dark:via-purple-500/5 dark:to-pink-500/5"
        style={{ y: y1, opacity }}
      />

      {/* Gradient Overlay 2 */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-tl from-cyan-500/10 via-indigo-500/10 to-violet-500/10 dark:from-cyan-500/5 dark:via-indigo-500/5 dark:to-violet-500/5"
        style={{ y: y2, opacity }}
      />

      {/* Animated Orbs */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 90, 0],
          x: [0, 100, 0],
          y: [0, 50, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 dark:bg-blue-500/10 rounded-full blur-3xl"
      />

      <motion.div
        animate={{
          scale: [1.2, 1, 1.2],
          rotate: [90, 0, 90],
          x: [0, -100, 0],
          y: [0, -50, 0],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-purple-500/20 dark:bg-purple-500/10 rounded-full blur-3xl"
      />

      <motion.div
        animate={{
          scale: [1, 1.3, 1],
          rotate: [0, -90, 0],
          x: [0, -50, 0],
          y: [0, 100, 0],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-1/2 right-1/3 w-72 h-72 bg-pink-500/20 dark:bg-pink-500/10 rounded-full blur-3xl"
      />
    </motion.div>
  );
}
