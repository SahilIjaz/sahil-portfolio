'use client';

import React, { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Html, Billboard } from '@react-three/drei';
import * as THREE from 'three';

interface SkillOrbData {
  name: string;
  level: number;
  color: string;
}

function SkillOrb({ skill, position, index }: {
  skill: SkillOrbData;
  position: [number, number, number];
  index: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.y = state.clock.elapsedTime * 0.3 + index;
    meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2 + index) * 0.3;

    // Pulse glow
    if (glowRef.current) {
      const scale = 1 + Math.sin(state.clock.elapsedTime * 2 + index * 0.5) * 0.1;
      glowRef.current.scale.setScalar(scale);
    }
  });

  const size = 0.3 + (skill.level / 100) * 0.4;

  return (
    <Float speed={1.5 + index * 0.2} rotationIntensity={0.3} floatIntensity={0.5}>
      <group position={position}>
        {/* Glow sphere */}
        <mesh ref={glowRef}>
          <sphereGeometry args={[size * 1.5, 16, 16]} />
          <meshBasicMaterial
            color={skill.color}
            transparent
            opacity={0.08}
            side={THREE.BackSide}
          />
        </mesh>

        {/* Main orb */}
        <mesh ref={meshRef}>
          <icosahedronGeometry args={[size, 1]} />
          <meshStandardMaterial
            color={skill.color}
            emissive={skill.color}
            emissiveIntensity={0.4}
            wireframe
            transparent
            opacity={0.6}
          />
        </mesh>

        {/* Inner solid core */}
        <mesh>
          <sphereGeometry args={[size * 0.4, 16, 16]} />
          <meshStandardMaterial
            color={skill.color}
            emissive={skill.color}
            emissiveIntensity={0.8}
            transparent
            opacity={0.8}
          />
        </mesh>

        {/* Label */}
        <Billboard follow lockX={false} lockY={false} lockZ={false}>
          <Html
            center
            distanceFactor={8}
            style={{
              pointerEvents: 'none',
              userSelect: 'none',
            }}
          >
            <div className="flex flex-col items-center gap-1 whitespace-nowrap">
              <span
                className="text-xs font-bold px-2 py-0.5 rounded-full backdrop-blur-sm"
                style={{
                  color: skill.color,
                  background: 'rgba(0,0,0,0.5)',
                  border: `1px solid ${skill.color}40`,
                  textShadow: `0 0 10px ${skill.color}`,
                }}
              >
                {skill.name}
              </span>
              <span
                className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full"
                style={{
                  color: '#fff',
                  background: `${skill.color}60`,
                }}
              >
                {skill.level}%
              </span>
            </div>
          </Html>
        </Billboard>

        {/* Orbit ring */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[size * 1.3, 0.008, 8, 64]} />
          <meshBasicMaterial color={skill.color} transparent opacity={0.3} />
        </mesh>
      </group>
    </Float>
  );
}

// Connecting lines between orbs
function OrbConnections({ positions, color = '#3b82f6' }: {
  positions: [number, number, number][];
  color?: string;
}) {
  const linesRef = useRef<THREE.LineSegments>(null);

  const linePositions = useMemo(() => {
    const lines: number[] = [];
    for (let i = 0; i < positions.length; i++) {
      for (let j = i + 1; j < positions.length; j++) {
        const dx = positions[i][0] - positions[j][0];
        const dy = positions[i][1] - positions[j][1];
        const dz = positions[i][2] - positions[j][2];
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
        if (dist < 5) {
          lines.push(
            ...positions[i],
            ...positions[j]
          );
        }
      }
    }
    return new Float32Array(lines);
  }, [positions]);

  useFrame((state) => {
    if (!linesRef.current) return;
    const mat = linesRef.current.material as THREE.LineBasicMaterial;
    mat.opacity = 0.08 + Math.sin(state.clock.elapsedTime) * 0.04;
  });

  return (
    <lineSegments ref={linesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[linePositions, 3]}
        />
      </bufferGeometry>
      <lineBasicMaterial
        color={color}
        transparent
        opacity={0.1}
        blending={THREE.AdditiveBlending}
      />
    </lineSegments>
  );
}

function OrbCamera() {
  useFrame((state) => {
    state.camera.position.x += (state.pointer.x * 2 - state.camera.position.x) * 0.02;
    state.camera.position.y += (state.pointer.y * 1 - state.camera.position.y) * 0.02;
    state.camera.lookAt(0, 0, 0);
  });
  return null;
}

const skillsData: SkillOrbData[] = [
  { name: 'Node.js', level: 95, color: '#22c55e' },
  { name: 'Next.js', level: 90, color: '#ffffff' },
  { name: 'React.js', level: 92, color: '#22d3ee' },
  { name: 'Nest.js', level: 85, color: '#ef4444' },
  { name: 'MongoDB', level: 90, color: '#16a34a' },
  { name: 'PostgreSQL', level: 85, color: '#3b82f6' },
  { name: 'AWS', level: 80, color: '#f97316' },
  { name: 'Socket.io', level: 88, color: '#a855f7' },
];

export function SkillOrbs() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const orbPositions: [number, number, number][] = useMemo(() => [
    [-3.5, 2, 0],
    [-1.2, 3, -1],
    [1.5, 2.5, 0.5],
    [3.8, 1.5, -0.5],
    [-3, -1.5, 0.5],
    [-0.5, -2.5, -0.5],
    [2, -2, 0],
    [4, -1, -1],
  ], []);

  return (
    <div className="w-full h-[400px] md:h-[600px] rounded-2xl overflow-hidden">
      <Canvas
        camera={{ position: [0, 0, 10], fov: 50 }}
        dpr={isMobile ? [1, 1] : [1, 1.5]}
        gl={{
          antialias: !isMobile,
          alpha: true,
          powerPreference: isMobile ? 'low-power' : 'high-performance',
        }}
        style={{ background: 'transparent' }}
        frameloop={isMobile ? 'demand' : 'always'}
      >
        {!isMobile && <OrbCamera />}

        <ambientLight intensity={0.3} />
        <pointLight position={[5, 5, 5]} color="#3b82f6" intensity={0.5} />

        {skillsData.map((skill, index) => (
          <SkillOrb
            key={skill.name}
            skill={skill}
            position={orbPositions[index]}
            index={index}
          />
        ))}

        {!isMobile && <OrbConnections positions={orbPositions} />}
      </Canvas>
    </div>
  );
}
