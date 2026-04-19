'use client';

import React, { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Html } from '@react-three/drei';
import * as THREE from 'three';
import { Terminal, Globe, Code2, Database, Cloud, Zap } from 'lucide-react';

// Central morphing sphere
function CentralSphere() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.y = state.clock.elapsedTime * 0.2;
    meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.2;
    const scale = 1 + Math.sin(state.clock.elapsedTime * 0.5) * 0.05;
    meshRef.current.scale.setScalar(scale);
  });

  return (
    <Float speed={2} rotationIntensity={0.4} floatIntensity={0.6}>
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[2.2, 1]} />
        <meshStandardMaterial
          color="#3b82f6"
          emissive="#1e40af"
          emissiveIntensity={0.4}
          wireframe
          transparent
          opacity={0.3}
        />
      </mesh>
    </Float>
  );
}

// Skill badge component
function SkillBadge({ skill }: { skill: { name: string; icon: React.ComponentType<any>; color: string } }) {
  const Icon = skill.icon;
  const [hovered, setHovered] = React.useState(false);

  return (
    <div
      className="flex flex-col items-center gap-1 cursor-pointer transition-all"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        className={`relative p-3 rounded-lg backdrop-blur-sm transition-all duration-300 ${
          hovered
            ? 'bg-white/30 shadow-lg scale-110'
            : 'bg-white/10 shadow-md'
        }`}
        style={{
          boxShadow: hovered ? `0 0 20px ${skill.color}80` : 'none',
        }}
      >
        <Icon size={20} style={{ color: skill.color }} className="drop-shadow-lg" />
      </div>
      {hovered && (
        <span
          className="text-xs font-semibold px-2 py-1 rounded bg-black/70 text-white whitespace-nowrap transition-opacity"
        >
          {skill.name}
        </span>
      )}
    </div>
  );
}

// Orbiting elements around the hero (now skill-based)
function OrbitingElements() {
  const groupRef = useRef<THREE.Group>(null);

  const skills = useMemo(() => [
    { name: 'Node.js', icon: Terminal, color: '#22c55e', radius: 4, speed: 0.3, offset: 0, yOsc: 0.5 },
    { name: 'Next.js', icon: Globe, color: '#ffffff', radius: 4, speed: 0.3, offset: Math.PI * 0.66, yOsc: 0.3 },
    { name: 'React', icon: Code2, color: '#61dafb', radius: 4, speed: 0.3, offset: Math.PI * 1.33, yOsc: 0.4 },
    { name: 'MongoDB', icon: Database, color: '#13aa52', radius: 5.5, speed: -0.2, offset: 0, yOsc: 0.8 },
    { name: 'PostgreSQL', icon: Database, color: '#336791', radius: 5.5, speed: -0.2, offset: Math.PI, yOsc: 0.6 },
    { name: 'AWS', icon: Cloud, color: '#ff9900', radius: 3, speed: 0.5, offset: Math.PI * 0.5, yOsc: 0.3 },
    { name: 'Socket.io', icon: Zap, color: '#010101', radius: 3, speed: 0.5, offset: Math.PI * 1.5, yOsc: 0.2 },
  ], []);

  const positions = useRef<Array<{ x: number; y: number; z: number }>>(
    skills.map(() => ({ x: 0, y: 0, z: 0 }))
  );

  useFrame((state) => {
    skills.forEach((skill, i) => {
      const angle = state.clock.elapsedTime * skill.speed + skill.offset;
      positions.current[i] = {
        x: Math.cos(angle) * skill.radius,
        z: Math.sin(angle) * skill.radius,
        y: Math.sin(state.clock.elapsedTime * 0.5 + skill.offset) * skill.yOsc,
      };
    });
  });

  return (
    <group ref={groupRef}>
      {skills.map((skill, i) => (
        <Html key={i} position={[positions.current[i].x, positions.current[i].y, positions.current[i].z]} scale={1}>
          <SkillBadge skill={skill} />
        </Html>
      ))}
    </group>
  );
}

// Orbital rings around the sphere
function OrbitalRings() {
  const ring1Ref = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);
  const ring3Ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (ring1Ref.current) {
      ring1Ref.current.rotation.x = Math.PI / 3 + Math.sin(t * 0.2) * 0.1;
      ring1Ref.current.rotation.y = t * 0.15;
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.x = Math.PI / 2.5 + Math.cos(t * 0.15) * 0.1;
      ring2Ref.current.rotation.y = -t * 0.1;
      ring2Ref.current.rotation.z = Math.PI / 4;
    }
    if (ring3Ref.current) {
      ring3Ref.current.rotation.x = Math.PI / 1.8;
      ring3Ref.current.rotation.y = t * 0.08;
      ring3Ref.current.rotation.z = Math.sin(t * 0.1) * 0.2;
    }
  });

  return (
    <>
      <mesh ref={ring1Ref}>
        <torusGeometry args={[3.5, 0.015, 16, 100]} />
        <meshBasicMaterial color="#3b82f6" transparent opacity={0.3} />
      </mesh>
      <mesh ref={ring2Ref}>
        <torusGeometry args={[4.2, 0.012, 16, 100]} />
        <meshBasicMaterial color="#8b5cf6" transparent opacity={0.2} />
      </mesh>
      <mesh ref={ring3Ref}>
        <torusGeometry args={[5, 0.01, 16, 100]} />
        <meshBasicMaterial color="#ec4899" transparent opacity={0.15} />
      </mesh>
    </>
  );
}

// Energy particles emanating from center
function EnergyParticles({ count = 200 }: { count?: number }) {
  const pointsRef = useRef<THREE.Points>(null);

  const [positions, speeds] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const spd = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      const r = 2 + Math.random() * 4;
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);
      spd[i] = 0.5 + Math.random() * 1.5;
    }
    return [pos, spd];
  }, [count]);

  const colors = useMemo(() => {
    const cols = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const t = Math.random();
      // Blue to purple gradient
      cols[i * 3] = 0.23 + t * 0.32;
      cols[i * 3 + 1] = 0.51 - t * 0.15;
      cols[i * 3 + 2] = 0.96;
    }
    return cols;
  }, [count]);

  useFrame((state) => {
    if (!pointsRef.current) return;
    const posArray = pointsRef.current.geometry.attributes.position.array as Float32Array;

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const x = posArray[i3];
      const y = posArray[i3 + 1];
      const z = posArray[i3 + 2];

      // Spiral outward slowly
      const dist = Math.sqrt(x * x + y * y + z * z);
      const angle = Math.atan2(y, x) + 0.002 * speeds[i];
      const newDist = dist + Math.sin(state.clock.elapsedTime * speeds[i]) * 0.01;

      posArray[i3] = Math.cos(angle) * newDist * Math.sin(Math.acos(z / dist));
      posArray[i3 + 1] = Math.sin(angle) * newDist * Math.sin(Math.acos(z / dist));
      posArray[i3 + 2] = z + Math.sin(state.clock.elapsedTime * 0.5 + i) * 0.005;

      // Reset if too far
      if (dist > 7) {
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(Math.random() * 2 - 1);
        const r = 2;
        posArray[i3] = r * Math.sin(phi) * Math.cos(theta);
        posArray[i3 + 1] = r * Math.sin(phi) * Math.sin(theta);
        posArray[i3 + 2] = r * Math.cos(phi);
      }
    }

    pointsRef.current.geometry.attributes.position.needsUpdate = true;
    pointsRef.current.rotation.y = state.clock.elapsedTime * 0.05;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[colors, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.04}
        vertexColors
        transparent
        opacity={0.8}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

// Camera responds to mouse
function HeroCamera() {
  useFrame((state) => {
    state.camera.position.x += (state.pointer.x * 1.5 - state.camera.position.x) * 0.03;
    state.camera.position.y += (state.pointer.y * 0.8 - state.camera.position.y) * 0.03;
    state.camera.lookAt(0, 0, 0);
  });

  return null;
}

export function HeroScene() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  return (
    <div className="absolute inset-0 -z-5">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 55 }}
        dpr={isMobile ? [1, 1] : [1, 2]}
        gl={{
          antialias: !isMobile,
          alpha: true,
          powerPreference: isMobile ? 'low-power' : 'high-performance',
        }}
        style={{ background: 'transparent' }}
        frameloop={isMobile ? 'demand' : 'always'}
      >
        {!isMobile && <HeroCamera />}

        <ambientLight intensity={0.2} />
        <directionalLight position={[5, 5, 5]} color="#ffffff" intensity={0.5} />
        <pointLight position={[3, 3, 3]} color="#3b82f6" intensity={1} />
        <pointLight position={[-3, -2, 2]} color="#8b5cf6" intensity={0.8} />

        <CentralSphere />
        {!isMobile && <OrbitalRings />}
        {!isMobile && <OrbitingElements />}
        <EnergyParticles count={isMobile ? 40 : 150} />
      </Canvas>
    </div>
  );
}
