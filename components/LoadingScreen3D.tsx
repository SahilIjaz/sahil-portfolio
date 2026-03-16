'use client';

import React, { useRef, useEffect, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'framer-motion';

// Morphing geometry at center of loading screen
function LoadingSphere() {
  const meshRef = useRef<THREE.Mesh>(null);
  const wireRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current || !wireRef.current) return;
    const t = state.clock.elapsedTime;
    meshRef.current.rotation.y = t * 0.5;
    meshRef.current.rotation.x = Math.sin(t * 0.3) * 0.5;
    wireRef.current.rotation.y = -t * 0.3;
    wireRef.current.rotation.z = t * 0.2;

    const scale = 1 + Math.sin(t * 2) * 0.1;
    meshRef.current.scale.setScalar(scale);
    wireRef.current.scale.setScalar(scale * 1.3);
  });

  return (
    <group>
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[1.5, 2]} />
        <meshStandardMaterial
          color="#3b82f6"
          emissive="#1e40af"
          emissiveIntensity={0.6}
          transparent
          opacity={0.4}
        />
      </mesh>
      <mesh ref={wireRef}>
        <icosahedronGeometry args={[2, 1]} />
        <meshBasicMaterial
          color="#8b5cf6"
          wireframe
          transparent
          opacity={0.2}
        />
      </mesh>
    </group>
  );
}

// Orbiting dots
function OrbitDots({ count = 40 }: { count?: number }) {
  const groupRef = useRef<THREE.Group>(null);

  const dots = useMemo(() => {
    return Array.from({ length: count }, (_, i) => {
      const angle = (i / count) * Math.PI * 2;
      const radius = 3 + Math.random() * 1.5;
      return {
        x: Math.cos(angle) * radius,
        y: Math.sin(angle) * radius,
        z: (Math.random() - 0.5) * 2,
        size: 0.03 + Math.random() * 0.05,
        speed: 0.5 + Math.random(),
        color: ['#3b82f6', '#8b5cf6', '#ec4899', '#06b6d4'][Math.floor(Math.random() * 4)],
      };
    });
  }, [count]);

  useFrame((state) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.z = state.clock.elapsedTime * 0.1;
    groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.3;
  });

  return (
    <group ref={groupRef}>
      {dots.map((dot, i) => (
        <Float key={i} speed={dot.speed} rotationIntensity={0} floatIntensity={0.5}>
          <mesh position={[dot.x, dot.y, dot.z]}>
            <sphereGeometry args={[dot.size, 8, 8]} />
            <meshBasicMaterial color={dot.color} transparent opacity={0.7} />
          </mesh>
        </Float>
      ))}
    </group>
  );
}

// Loading progress ring
function ProgressRing({ progress }: { progress: number }) {
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!ringRef.current) return;
    ringRef.current.rotation.z = state.clock.elapsedTime * 0.5;
  });

  return (
    <mesh ref={ringRef} rotation={[0, 0, 0]}>
      <torusGeometry args={[2.5, 0.02, 8, 64, Math.PI * 2 * (progress / 100)]} />
      <meshBasicMaterial color="#3b82f6" transparent opacity={0.8} />
    </mesh>
  );
}

interface LoadingScreen3DProps {
  onLoadingComplete: () => void;
}

export function LoadingScreen3D({ onLoadingComplete }: LoadingScreen3DProps) {
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsComplete(true);
            setTimeout(onLoadingComplete, 800);
          }, 300);
          return 100;
        }
        return prev + 2;
      });
    }, 50);

    return () => clearInterval(interval);
  }, [onLoadingComplete]);

  return (
    <AnimatePresence>
      {!isComplete && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.1 }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
          style={{ background: '#030712' }}
        >
          {/* 3D Canvas */}
          <div className="absolute inset-0">
            <Canvas
              camera={{ position: [0, 0, 8], fov: 50 }}
              dpr={[1, 1.5]}
              gl={{ antialias: true, alpha: false }}
            >
              <color attach="background" args={['#030712']} />
              <ambientLight intensity={0.2} />
              <pointLight position={[3, 3, 5]} color="#3b82f6" intensity={1} />
              <pointLight position={[-3, -2, 3]} color="#8b5cf6" intensity={0.6} />

              <LoadingSphere />
              <OrbitDots count={30} />
              <ProgressRing progress={progress} />
            </Canvas>
          </div>

          {/* Overlay text */}
          <div className="relative z-10 flex flex-col items-center pointer-events-none">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="flex items-center gap-2 sm:gap-4 mb-6"
            >
              {['S', 'A', 'H', 'I', 'L'].map((letter, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, y: 50, rotateX: -90 }}
                  animate={{ opacity: 1, y: 0, rotateX: 0 }}
                  transition={{
                    delay: 0.4 + i * 0.15,
                    type: 'spring',
                    stiffness: 100,
                    damping: 12,
                  }}
                  className="text-5xl sm:text-7xl md:text-8xl font-black bg-gradient-to-b from-white via-blue-200 to-purple-400 bg-clip-text text-transparent"
                  style={{
                    textShadow: '0 0 30px rgba(59, 130, 246, 0.5)',
                  }}
                >
                  {letter}
                </motion.span>
              ))}
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5 }}
              className="text-sm text-blue-300/60 tracking-[0.3em] uppercase mb-8"
            >
              Full Stack Developer
            </motion.p>

            {/* Progress bar */}
            <motion.div
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: '200px' }}
              transition={{ delay: 1 }}
              className="relative h-0.5 bg-gray-800 rounded-full overflow-hidden"
              style={{ width: '200px' }}
            >
              <motion.div
                className="absolute inset-y-0 left-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full"
                style={{ width: `${progress}%` }}
              />
            </motion.div>

            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
              className="text-xs text-gray-500 mt-3 font-mono"
            >
              {progress}%
            </motion.span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
