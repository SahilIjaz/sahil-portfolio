'use client';

import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

export function AnimatedCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const trailRef = useRef<HTMLDivElement>(null);
  const mousePos = useRef({ x: 0, y: 0 });
  const cursorPos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
    };

    // Smooth cursor following with animation frame
    const animate = () => {
      if (!cursorRef.current) return;

      // Lerp toward mouse position
      const speed = 0.15;
      cursorPos.current.x += (mousePos.current.x - cursorPos.current.x) * speed;
      cursorPos.current.y += (mousePos.current.y - cursorPos.current.y) * speed;

      cursorRef.current.style.left = `${cursorPos.current.x}px`;
      cursorRef.current.style.top = `${cursorPos.current.y}px`;

      requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    const frameId = requestAnimationFrame(animate);

    // Add hover effects for interactive elements
    const handleMouseEnter = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'A' ||
        target.tagName === 'BUTTON' ||
        target.className.includes('cursor-hover')
      ) {
        if (cursorRef.current) {
          cursorRef.current.classList.add('cursor-active');
        }
      }
    };

    const handleMouseLeave = () => {
      if (cursorRef.current) {
        cursorRef.current.classList.remove('cursor-active');
      }
    };

    document.addEventListener('mouseenter', handleMouseEnter, true);
    document.addEventListener('mouseleave', handleMouseLeave, true);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseenter', handleMouseEnter, true);
      document.removeEventListener('mouseleave', handleMouseLeave, true);
      cancelAnimationFrame(frameId);
    };
  }, []);

  return (
    <>
      {/* Cursor trail */}
      <div
        ref={trailRef}
        className="pointer-events-none fixed w-1 h-1 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 shadow-lg opacity-0 z-[9999]"
        style={{
          filter: 'blur(1px)',
        }}
      />

      {/* Main cursor */}
      <div
        ref={cursorRef}
        className="pointer-events-none fixed w-5 h-5 rounded-full border-2 border-blue-500 z-[9999] transition-all duration-200"
        style={{
          transform: 'translate(-50%, -50%)',
          boxShadow: '0 0 20px rgba(59, 130, 246, 0.5)',
        }}
      >
        {/* Inner dot */}
        <div className="absolute inset-1 rounded-full bg-gradient-to-r from-blue-500 to-purple-500" />
      </div>

      {/* Cursor glow (expands on hover) */}
      <style jsx>{`
        .cursor-active {
          width: 2rem;
          height: 2rem;
          border-color: rgb(139, 92, 246);
          box-shadow: 0 0 40px rgba(139, 92, 246, 0.8);
        }
      `}</style>
    </>
  );
}
