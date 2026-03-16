'use client';

import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface AnimatedTextProps {
  text: string;
  className?: string;
  delay?: number;
  triggerOnScroll?: boolean;
  staggerDelay?: number;
}

export function AnimatedText({
  text,
  className = '',
  delay = 0,
  triggerOnScroll = false,
  staggerDelay = 0.02,
}: AnimatedTextProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const chars = containerRef.current.querySelectorAll('.char');

    if (triggerOnScroll) {
      // Scroll-triggered animation
      gsap.fromTo(
        chars,
        { opacity: 0, y: 20, filter: 'blur(4px)' },
        {
          opacity: 1,
          y: 0,
          filter: 'blur(0px)',
          duration: 0.6,
          stagger: staggerDelay,
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 80%',
            toggleActions: 'play pause resume reverse',
          },
        }
      );
    } else {
      // Immediate animation
      gsap.fromTo(
        chars,
        { opacity: 0, y: 20, filter: 'blur(4px)' },
        {
          opacity: 1,
          y: 0,
          filter: 'blur(0px)',
          duration: 0.6,
          stagger: staggerDelay,
          delay: delay,
        }
      );
    }

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => {
        if (trigger.vars.trigger === containerRef.current) {
          trigger.kill();
        }
      });
    };
  }, [text, delay, triggerOnScroll, staggerDelay]);

  return (
    <div ref={containerRef} className={className}>
      {text.split('').map((char, idx) => (
        <span key={idx} className="char inline-block">
          {char === ' ' ? '\u00A0' : char}
        </span>
      ))}
    </div>
  );
}

// Paragraph reveal component
interface AnimatedParagraphProps {
  text: string;
  className?: string;
}

export function AnimatedParagraph({ text, className = '' }: AnimatedParagraphProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const words = containerRef.current.querySelectorAll('.word');

    gsap.fromTo(
      words,
      { opacity: 0, y: 10 },
      {
        opacity: 1,
        y: 0,
        duration: 0.5,
        stagger: 0.05,
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 85%',
          toggleActions: 'play pause resume reverse',
        },
      }
    );

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => {
        if (trigger.vars.trigger === containerRef.current) {
          trigger.kill();
        }
      });
    };
  }, [text]);

  return (
    <div ref={containerRef} className={className}>
      {text.split(' ').map((word, idx) => (
        <span key={idx} className="word inline-block mr-1">
          {word}
        </span>
      ))}
    </div>
  );
}
