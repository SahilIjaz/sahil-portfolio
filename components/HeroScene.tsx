'use client';

import React, { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';

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

// Orbiting elements around the hero
function OrbitingElements() {
  const groupRef = useRef<THREE.Group>(null);

  const elements = useMemo(() => [
    { radius: 4, speed: 0.3, size: 0.3, color: '#8b5cf6', offset: 0, yOsc: 0.5 },
    { radius: 4, speed: 0.3, size: 0.25, color: '#ec4899', offset: Math.PI * 0.66, yOsc: 0.3 },
    { radius: 4, speed: 0.3, size: 0.35, color: '#06b6d4', offset: Math.PI * 1.33, yOsc: 0.4 },
    { radius: 5.5, speed: -0.2, size: 0.2, color: '#3b82f6', offset: 0, yOsc: 0.8 },
    { radius: 5.5, speed: -0.2, size: 0.2, color: '#8b5cf6', offset: Math.PI, yOsc: 0.6 },
    { radius: 3, speed: 0.5, size: 0.15, color: '#ec4899', offset: Math.PI * 0.5, yOsc: 0.3 },
    { radius: 3, speed: 0.5, size: 0.15, color: '#06b6d4', offset: Math.PI * 1.5, yOsc: 0.2 },
  ], []);

  useFrame((state) => {
    if (!groupRef.current) return;
    groupRef.current.children.forEach((child, i) => {
      const el = elements[i];
      const angle = state.clock.elapsedTime * el.speed + el.offset;
      child.position.x = Math.cos(angle) * el.radius;
      child.position.z = Math.sin(angle) * el.radius;
      child.position.y = Math.sin(state.clock.elapsedTime * 0.5 + el.offset) * el.yOsc;
      child.rotation.x += 0.01;
      child.rotation.y += 0.015;
    });
  });

  return (
    <group ref={groupRef}>
      {elements.map((el, i) => (
        <mesh key={i}>
          <octahedronGeometry args={[el.size]} />
          <meshStandardMaterial
            color={el.color}
            emissive={el.color}
            emissiveIntensity={0.5}
            transparent
            opacity={0.6}
          />
        </mesh>
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
