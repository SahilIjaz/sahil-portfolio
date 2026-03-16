'use client';

import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Html } from '@react-three/drei';
import * as THREE from 'three';

interface Project3DData {
  name: string;
  description: string;
  gradient: string;
  color: string;
}

function ProjectCard3D({ project, position, index }: {
  project: Project3DData;
  position: [number, number, number];
  index: number;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!groupRef.current) return;
    // Gentle floating
    groupRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.5 + index) * 0.15;
    groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.2 + index * 0.5) * 0.05;
  });

  return (
    <Float speed={1} rotationIntensity={0.1} floatIntensity={0.2}>
      <group ref={groupRef} position={position}>
        {/* Glowing backdrop shape */}
        <mesh ref={meshRef}>
          <planeGeometry args={[3.5, 2.2]} />
          <meshStandardMaterial
            color={project.color}
            emissive={project.color}
            emissiveIntensity={0.15}
            transparent
            opacity={0.08}
            side={THREE.DoubleSide}
          />
        </mesh>

        {/* Border wireframe */}
        <mesh>
          <boxGeometry args={[3.6, 2.3, 0.05]} />
          <meshBasicMaterial
            color={project.color}
            wireframe
            transparent
            opacity={0.15}
          />
        </mesh>

        {/* Corner accents */}
        {[[-1.7, 1.05], [1.7, 1.05], [-1.7, -1.05], [1.7, -1.05]].map(([x, y], i) => (
          <mesh key={i} position={[x, y, 0.03]}>
            <sphereGeometry args={[0.04, 8, 8]} />
            <meshBasicMaterial color={project.color} />
          </mesh>
        ))}

        {/* HTML overlay */}
        <Html
          center
          distanceFactor={6}
          style={{
            pointerEvents: 'none',
            userSelect: 'none',
            width: '250px',
          }}
        >
          <div className="text-center">
            <h3
              className="text-lg font-bold mb-1"
              style={{ color: project.color, textShadow: `0 0 20px ${project.color}40` }}
            >
              {project.name}
            </h3>
            <p className="text-xs text-gray-400 leading-relaxed line-clamp-2">
              {project.description}
            </p>
          </div>
        </Html>
      </group>
    </Float>
  );
}

// Floating tech particles around projects
function TechParticles({ count = 100 }: { count?: number }) {
  const pointsRef = useRef<THREE.Points>(null);

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 15;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 8 - 2;
    }
    return pos;
  }, [count]);

  useFrame((state) => {
    if (!pointsRef.current) return;
    pointsRef.current.rotation.y = state.clock.elapsedTime * 0.02;
    pointsRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.05) * 0.05;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.03}
        color="#3b82f6"
        transparent
        opacity={0.4}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

function ProjectCamera() {
  useFrame((state) => {
    state.camera.position.x += (state.pointer.x * 1.5 - state.camera.position.x) * 0.02;
    state.camera.position.y += (state.pointer.y * 0.8 - state.camera.position.y) * 0.02;
    state.camera.lookAt(0, 0, 0);
  });
  return null;
}

const projectsFor3D: Project3DData[] = [
  { name: 'Anaya', description: 'Social media platform for story sharing and messaging', gradient: 'from-violet-600 to-fuchsia-600', color: '#8b5cf6' },
  { name: 'Connect Hub', description: 'Full-stack social media with real-time chat', gradient: 'from-blue-600 to-cyan-600', color: '#3b82f6' },
  { name: 'MulberryTree', description: 'Community platform for chefs and farmers', gradient: 'from-emerald-600 to-lime-600', color: '#10b981' },
  { name: 'FishScout', description: 'Real-time fishing community with weather', gradient: 'from-indigo-600 to-violet-600', color: '#6366f1' },
  { name: 'CoachMaster', description: 'Sports analytics and team management', gradient: 'from-orange-600 to-yellow-600', color: '#f97316' },
  { name: 'MundoSalud', description: 'Telehealth platform with real-time consultations', gradient: 'from-teal-600 to-sky-600', color: '#14b8a6' },
];

export function ProjectShowcase3D() {
  const cardPositions: [number, number, number][] = useMemo(() => [
    [-4, 1.5, 0],
    [0, 2, -1],
    [4, 1.5, 0.5],
    [-4, -1.5, 0.5],
    [0, -1.8, -0.5],
    [4, -1.5, 0],
  ], []);

  return (
    <div className="w-full h-[500px] md:h-[600px] rounded-2xl overflow-hidden">
      <Canvas
        camera={{ position: [0, 0, 10], fov: 50 }}
        dpr={[1, 1.5]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
        }}
        style={{ background: 'transparent' }}
      >
        <ProjectCamera />

        <ambientLight intensity={0.2} />
        <pointLight position={[5, 5, 5]} color="#3b82f6" intensity={0.5} />
        <pointLight position={[-5, -5, 3]} color="#8b5cf6" intensity={0.3} />
        <pointLight position={[0, 0, 8]} color="#ec4899" intensity={0.2} />

        {projectsFor3D.map((project, index) => (
          <ProjectCard3D
            key={project.name}
            project={project}
            position={cardPositions[index]}
            index={index}
          />
        ))}

        <TechParticles count={80} />
      </Canvas>
    </div>
  );
}
