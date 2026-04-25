'use client';

import React, { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function useScrollAnimation(
  triggerSelector: string,
  callback: (progress: number) => void,
  options?: {
    start?: string;
    end?: string;
    scrub?: boolean | number;
    markers?: boolean;
  }
) {
  useEffect(() => {
    const trigger = document.querySelector(triggerSelector);
    if (!trigger) return;

    const scrollTrigger = ScrollTrigger.create({
      trigger,
      start: options?.start || 'top center',
      end: options?.end || 'bottom center',
      scrub: options?.scrub ?? true,
      markers: options?.markers || false,
      onUpdate: (self) => {
        callback(self.progress);
      },
    });

    return () => {
      scrollTrigger.kill();
    };
  }, [triggerSelector, callback, options]);
}

// Scroll-linked rotation animation
export function ScrollRotationAnimation({
  targetSelector,
  rotationAxis = 'y',
  maxRotation = Math.PI / 2,
  triggerSelector,
  startTrigger = 'top center',
  endTrigger = 'bottom center',
}: {
  targetSelector: string;
  rotationAxis?: 'x' | 'y' | 'z';
  maxRotation?: number;
  triggerSelector: string;
  startTrigger?: string;
  endTrigger?: string;
}) {
  useEffect(() => {
    const target = document.querySelector(targetSelector) as HTMLElement;
    const trigger = document.querySelector(triggerSelector);

    if (!target || !trigger) return;

    const scrollTrigger = ScrollTrigger.create({
      trigger,
      start: startTrigger,
      end: endTrigger,
      scrub: 1,
      onUpdate: (self) => {
        const rotation = maxRotation * self.progress;
        const transform =
          rotationAxis === 'x'
            ? `rotateX(${rotation}rad)`
            : rotationAxis === 'y'
              ? `rotateY(${rotation}rad)`
              : `rotateZ(${rotation}rad)`;

        gsap.to(target, {
          rotation: rotation,
          duration: 0.1,
          overwrite: 'auto',
        });
      },
    });

    return () => {
      scrollTrigger.kill();
    };
  }, [targetSelector, rotationAxis, maxRotation, triggerSelector, startTrigger, endTrigger]);

  return null;
}

// Scroll-linked scale animation
export function ScrollScaleAnimation({
  targetSelector,
  startScale = 0.8,
  endScale = 1.2,
  triggerSelector,
  startTrigger = 'top center',
  endTrigger = 'bottom center',
}: {
  targetSelector: string;
  startScale?: number;
  endScale?: number;
  triggerSelector: string;
  startTrigger?: string;
  endTrigger?: string;
}) {
  useEffect(() => {
    const target = document.querySelector(targetSelector) as HTMLElement;
    const trigger = document.querySelector(triggerSelector);

    if (!target || !trigger) return;

    const scrollTrigger = ScrollTrigger.create({
      trigger,
      start: startTrigger,
      end: endTrigger,
      scrub: 1,
      onUpdate: (self) => {
        const scale = startScale + (endScale - startScale) * self.progress;

        gsap.to(target, {
          scale,
          duration: 0.1,
          overwrite: 'auto',
        });
      },
    });

    return () => {
      scrollTrigger.kill();
    };
  }, [targetSelector, startScale, endScale, triggerSelector, startTrigger, endTrigger]);

  return null;
}

// Scroll-linked opacity animation
export function ScrollOpacityAnimation({
  targetSelector,
  startOpacity = 0,
  endOpacity = 1,
  triggerSelector,
  startTrigger = 'top center',
  endTrigger = 'bottom center',
}: {
  targetSelector: string;
  startOpacity?: number;
  endOpacity?: number;
  triggerSelector: string;
  startTrigger?: string;
  endTrigger?: string;
}) {
  useEffect(() => {
    const target = document.querySelector(targetSelector) as HTMLElement;
    const trigger = document.querySelector(triggerSelector);

    if (!target || !trigger) return;

    const scrollTrigger = ScrollTrigger.create({
      trigger,
      start: startTrigger,
      end: endTrigger,
      scrub: 1,
      onUpdate: (self) => {
        const opacity = startOpacity + (endOpacity - startOpacity) * self.progress;

        gsap.to(target, {
          opacity,
          duration: 0.1,
          overwrite: 'auto',
        });
      },
    });

    return () => {
      scrollTrigger.kill();
    };
  }, [targetSelector, startOpacity, endOpacity, triggerSelector, startTrigger, endTrigger]);

  return null;
}
