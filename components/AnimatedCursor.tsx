'use client';

import React, { useEffect, useRef, useState } from 'react';

export function AnimatedCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const mousePos = useRef({ x: 0, y: 0 });
  const cursorPos = useRef({ x: 0, y: 0 });
  const dotPos = useRef({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Disable custom cursor on mobile/touch devices
    const checkMobile = () => {
      setIsMobile(window.matchMedia('(pointer: coarse)').matches || window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);

    if (isMobile) return;

    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
    };

    const animate = () => {
      if (!cursorRef.current || !dotRef.current) {
        requestAnimationFrame(animate);
        return;
      }

      // Outer ring follows with smooth lerp
      const ringSpeed = 0.12;
      cursorPos.current.x += (mousePos.current.x - cursorPos.current.x) * ringSpeed;
      cursorPos.current.y += (mousePos.current.y - cursorPos.current.y) * ringSpeed;

      // Inner dot follows faster
      const dotSpeed = 0.25;
      dotPos.current.x += (mousePos.current.x - dotPos.current.x) * dotSpeed;
      dotPos.current.y += (mousePos.current.y - dotPos.current.y) * dotSpeed;

      cursorRef.current.style.transform = `translate(${cursorPos.current.x}px, ${cursorPos.current.y}px) translate(-50%, -50%)`;
      dotRef.current.style.transform = `translate(${dotPos.current.x}px, ${dotPos.current.y}px) translate(-50%, -50%)`;

      requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    const frameId = requestAnimationFrame(animate);

    // Hover detection for interactive elements
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('a, button, [role="button"], input, textarea, select, .cursor-hover')) {
        setIsHovering(true);
      }
    };

    const handleMouseOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('a, button, [role="button"], input, textarea, select, .cursor-hover')) {
        setIsHovering(false);
      }
    };

    document.addEventListener('mouseover', handleMouseOver, { passive: true });
    document.addEventListener('mouseout', handleMouseOut, { passive: true });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', checkMobile);
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseout', handleMouseOut);
      cancelAnimationFrame(frameId);
    };
  }, [isMobile]);

  if (isMobile) return null;

  return (
    <>
      {/* Outer ring */}
      <div
        ref={cursorRef}
        className="pointer-events-none fixed top-0 left-0 z-[9999] will-change-transform"
        style={{
          width: isHovering ? '40px' : '24px',
          height: isHovering ? '40px' : '24px',
          borderRadius: '50%',
          border: `2px solid ${isHovering ? 'rgba(139, 92, 246, 0.8)' : 'rgba(59, 130, 246, 0.6)'}`,
          boxShadow: isHovering
            ? '0 0 30px rgba(139, 92, 246, 0.5)'
            : '0 0 15px rgba(59, 130, 246, 0.3)',
          transition: 'width 0.3s ease, height 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease',
          mixBlendMode: 'difference',
        }}
      />

      {/* Inner dot */}
      <div
        ref={dotRef}
        className="pointer-events-none fixed top-0 left-0 z-[9999] will-change-transform"
        style={{
          width: isHovering ? '6px' : '4px',
          height: isHovering ? '6px' : '4px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
          transition: 'width 0.2s ease, height 0.2s ease',
        }}
      />
    </>
  );
}
