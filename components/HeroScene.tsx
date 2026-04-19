'use client';

import React, { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Html } from '@react-three/drei';
import * as THREE from 'three';
import { Terminal, Globe, Code2, Database, Cloud, Zap } from 'lucide-react';



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

// Solar System with concentric orbital rings
function OrbitingElements() {
  const groupRef = useRef<THREE.Group>(null);

  // Skills organized into rings: Inner (2), Middle (3), Outer (2)
  const skills = useMemo(() => [
    // Inner ring (radius 3) - fastest speeds
    { name: 'Node.js', icon: Terminal, color: '#22c55e', ring: 'inner', orbitRadius: 3, speed: 1.2 },
    { name: 'React', icon: Code2, color: '#61dafb', ring: 'inner', orbitRadius: 3, speed: 1.0 },
    
    // Middle ring (radius 5) - medium speeds
    { name: 'Next.js', icon: Globe, color: '#ffffff', ring: 'middle', orbitRadius: 5, speed: 0.7 },
    { name: 'MongoDB', icon: Database, color: '#13aa52', ring: 'middle', orbitRadius: 5, speed: 0.6 },
    { name: 'PostgreSQL', icon: Database, color: '#336791', ring: 'middle', orbitRadius: 5, speed: 0.5 },
    
    // Outer ring (radius 7.5) - slowest speeds
    { name: 'AWS', icon: Cloud, color: '#ff9900', ring: 'outer', orbitRadius: 7.5, speed: 0.35 },
    { name: 'Socket.io', icon: Zap, color: '#010101', ring: 'outer', orbitRadius: 7.5, speed: 0.25 },
  ], []);

  const positions = useRef<Array<{ x: number; y: number; z: number }>>(
    skills.map(() => ({ x: 0, y: 0, z: 0 }))
  );

  useFrame((state) => {
    skills.forEach((skill, i) => {
      // Each skill moves independently at its own speed, all clockwise
      const angle = state.clock.elapsedTime * skill.speed;
      
      positions.current[i] = {
        x: Math.cos(angle) * skill.orbitRadius,
        z: Math.sin(angle) * skill.orbitRadius,
        y: 0, // Fixed Y, no bobbing
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

// Glowing orbital rings
function SolarSystemRings() {
  const ring1Ref = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);
  const ring3Ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    // Inner ring
    if (ring1Ref.current) {
      ring1Ref.current.rotation.x = Math.PI / 2.5;
    }
    // Middle ring
    if (ring2Ref.current) {
      ring2Ref.current.rotation.x = Math.PI / 2.5;
    }
    // Outer ring
    if (ring3Ref.current) {
      ring3Ref.current.rotation.x = Math.PI / 2.5;
    }
  });

  return (
    <>
      {/* Inner ring */}
      <mesh ref={ring1Ref}>
        <torusGeometry args={[3, 0.02, 32, 100]} />
        <meshBasicMaterial color="#3b82f6" transparent opacity={0.25} />
      </mesh>
      {/* Middle ring */}
      <mesh ref={ring2Ref}>
        <torusGeometry args={[5, 0.015, 32, 100]} />
        <meshBasicMaterial color="#8b5cf6" transparent opacity={0.2} />
      </mesh>
      {/* Outer ring */}
      <mesh ref={ring3Ref}>
        <torusGeometry args={[7.5, 0.01, 32, 100]} />
        <meshBasicMaterial color="#ec4899" transparent opacity={0.15} />
      </mesh>
    </>
  );
}

// Central sun (name glow)
function CentralSun() {
  const sunRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!sunRef.current) return;
    // Subtle pulse effect
    const scale = 1 + Math.sin(state.clock.elapsedTime * 1.5) * 0.1;
    sunRef.current.scale.setScalar(scale);
  });

  return (
    <>
      {/* Outer glow sphere */}
      <mesh ref={sunRef}>
        <sphereGeometry args={[1.5, 32, 32]} />
        <meshStandardMaterial
          color="#fbbf24"
          transparent
          opacity={0.15}
          emissive="#fbbf24"
          emissiveIntensity={0.5}
        />
      </mesh>
      {/* Core sphere */}
      <mesh>
        <sphereGeometry args={[0.8, 32, 32]} />
        <meshStandardMaterial
          color="#fbbf24"
          emissive="#f59e0b"
          emissiveIntensity={0.8}
          transparent
          opacity={0.6}
        />
      </mesh>
    </>
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
        frameloop='always'
      >
        {!isMobile && <HeroCamera />}

        <ambientLight intensity={0.2} />
        <directionalLight position={[5, 5, 5]} color="#ffffff" intensity={0.5} />
        <pointLight position={[3, 3, 3]} color="#3b82f6" intensity={1} />
        <pointLight position={[-3, -2, 2]} color="#8b5cf6" intensity={0.8} />

        <CentralSun />
        {!isMobile && <SolarSystemRings />}
        <OrbitingElements />
        <EnergyParticles count={isMobile ? 40 : 150} />
      </Canvas>
    </div>
  );
}
