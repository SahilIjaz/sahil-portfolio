'use client';

import React, { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, Stars, Html } from '@react-three/drei';
import * as THREE from 'three';

// Floating geometric shapes throughout the scene
function FloatingGeometry({ position, geometry, color, speed = 1 }: {
  position: [number, number, number];
  geometry: 'box' | 'octahedron' | 'tetrahedron' | 'icosahedron' | 'dodecahedron' | 'torus';
  color: string;
  speed?: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.x += 0.003 * speed;
    meshRef.current.rotation.y += 0.005 * speed;
    meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.5 * speed) * 0.3;
  });

  const geo = useMemo(() => {
    switch (geometry) {
      case 'box': return new THREE.BoxGeometry(1, 1, 1);
      case 'octahedron': return new THREE.OctahedronGeometry(0.7);
      case 'tetrahedron': return new THREE.TetrahedronGeometry(0.8);
      case 'icosahedron': return new THREE.IcosahedronGeometry(0.6);
      case 'dodecahedron': return new THREE.DodecahedronGeometry(0.5);
      case 'torus': return new THREE.TorusGeometry(0.6, 0.2, 16, 32);
    }
  }, [geometry]);

  return (
    <Float speed={1.5} rotationIntensity={0.5} floatIntensity={0.5}>
      <mesh ref={meshRef} position={position} geometry={geo}>
        <meshStandardMaterial
          color={color}
          transparent
          opacity={0.15}
          wireframe
          emissive={color}
          emissiveIntensity={0.3}
        />
      </mesh>
    </Float>
  );
}

// Particle field that reacts to mouse
function ParticleField({ count = 500 }: { count?: number }) {
  const pointsRef = useRef<THREE.Points>(null);
  const mousePos = useRef({ x: 0, y: 0 });

  const { viewport } = useThree();

  const [positions, velocities] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const vel = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 30;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 30;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 15;
      vel[i * 3] = (Math.random() - 0.5) * 0.01;
      vel[i * 3 + 1] = (Math.random() - 0.5) * 0.01;
      vel[i * 3 + 2] = (Math.random() - 0.5) * 0.01;
    }
    return [pos, vel];
  }, [count]);

  const colors = useMemo(() => {
    const cols = new Float32Array(count * 3);
    const palette = [
      [0.23, 0.51, 0.96],  // blue
      [0.55, 0.36, 0.96],  // purple
      [0.93, 0.28, 0.60],  // pink
      [0.02, 0.71, 0.83],  // cyan
    ];
    for (let i = 0; i < count; i++) {
      const c = palette[Math.floor(Math.random() * palette.length)];
      cols[i * 3] = c[0];
      cols[i * 3 + 1] = c[1];
      cols[i * 3 + 2] = c[2];
    }
    return cols;
  }, [count]);

  useFrame((state) => {
    if (!pointsRef.current) return;

    const posArray = pointsRef.current.geometry.attributes.position.array as Float32Array;

    // Get mouse in world coords
    const mx = (state.pointer.x * viewport.width) / 2;
    const my = (state.pointer.y * viewport.height) / 2;
    mousePos.current.x += (mx - mousePos.current.x) * 0.05;
    mousePos.current.y += (my - mousePos.current.y) * 0.05;

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;

      // Apply velocity
      posArray[i3] += velocities[i3];
      posArray[i3 + 1] += velocities[i3 + 1];
      posArray[i3 + 2] += velocities[i3 + 2];

      // Mouse repulsion
      const dx = posArray[i3] - mousePos.current.x;
      const dy = posArray[i3 + 1] - mousePos.current.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 3) {
        const force = (3 - dist) * 0.003;
        posArray[i3] += dx * force;
        posArray[i3 + 1] += dy * force;
      }

      // Boundary wrap
      if (Math.abs(posArray[i3]) > 15) posArray[i3] *= -0.99;
      if (Math.abs(posArray[i3 + 1]) > 15) posArray[i3 + 1] *= -0.99;
      if (Math.abs(posArray[i3 + 2]) > 7.5) posArray[i3 + 2] *= -0.99;
    }

    pointsRef.current.geometry.attributes.position.needsUpdate = true;
    pointsRef.current.rotation.y = state.clock.elapsedTime * 0.02;
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
        size={0.05}
        vertexColors
        transparent
        opacity={0.7}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

// Connecting lines between nearby particles
function ConnectionLines({ count = 150 }: { count?: number }) {
  const linesRef = useRef<THREE.LineSegments>(null);

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }
    return pos;
  }, [count]);

  useFrame((state) => {
    if (!linesRef.current) return;
    linesRef.current.rotation.y = state.clock.elapsedTime * 0.01;
    linesRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.05) * 0.1;
  });

  const linePositions = useMemo(() => {
    const lines: number[] = [];
    for (let i = 0; i < count; i++) {
      for (let j = i + 1; j < count; j++) {
        const dx = positions[i * 3] - positions[j * 3];
        const dy = positions[i * 3 + 1] - positions[j * 3 + 1];
        const dz = positions[i * 3 + 2] - positions[j * 3 + 2];
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
        if (dist < 3) {
          lines.push(
            positions[i * 3], positions[i * 3 + 1], positions[i * 3 + 2],
            positions[j * 3], positions[j * 3 + 1], positions[j * 3 + 2]
          );
        }
      }
    }
    return new Float32Array(lines);
  }, [count, positions]);

  return (
    <lineSegments ref={linesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[linePositions, 3]}
        />
      </bufferGeometry>
      <lineBasicMaterial
        color="#3b82f6"
        transparent
        opacity={0.06}
        blending={THREE.AdditiveBlending}
      />
    </lineSegments>
  );
}

// Orbiting circles on rings - styled like SkillOrbs
function RingOrbiters({
  radius = 5,
  color = '#8b5cf6',
  count = 5,
  labels = ['Node.js', 'React', 'MongoDB', 'Express', 'AWS']
}: {
  radius?: number;
  color?: string;
  count?: number;
  labels?: string[];
}) {
  const groupRef = useRef<THREE.Group>(null);
  const orbRefs = useRef<(THREE.Mesh | null)[]>([]);
  const glowRefs = useRef<(THREE.Mesh | null)[]>([]);

  useFrame((state) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.3 + 1.2;
    groupRef.current.rotation.z = state.clock.elapsedTime * 0.1;

    // Animate individual orbs
    orbRefs.current.forEach((mesh, i) => {
      if (!mesh) return;
      mesh.rotation.y = state.clock.elapsedTime * 0.3 + i;
      mesh.rotation.x = Math.sin(state.clock.elapsedTime * 0.2 + i) * 0.3;
    });

    // Pulse glow effect
    glowRefs.current.forEach((mesh, i) => {
      if (!mesh) return;
      const scale = 1 + Math.sin(state.clock.elapsedTime * 2 + i * 0.5) * 0.1;
      mesh.scale.setScalar(scale);
    });
  });

  const orbSize = 0.15;

  return (
    <group ref={groupRef} position={[0, 0, -3]}>
      {Array.from({ length: count }).map((_, i) => {
        const angle = (i / count) * Math.PI * 2;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        return (
          <group key={i} position={[x, 0, z]}>
            {/* Glow sphere */}
            <mesh
              ref={(el) => {
                glowRefs.current[i] = el;
              }}
            >
              <sphereGeometry args={[orbSize * 1.5, 16, 16]} />
              <meshBasicMaterial
                color={color}
                transparent
                opacity={0.08}
                side={THREE.BackSide}
              />
            </mesh>

            {/* Main icosahedron orb */}
            <mesh
              ref={(el) => {
                orbRefs.current[i] = el;
              }}
            >
              <icosahedronGeometry args={[orbSize, 1]} />
              <meshStandardMaterial
                color={color}
                emissive={color}
                emissiveIntensity={0.4}
                wireframe
                transparent
                opacity={0.6}
              />
            </mesh>

            {/* Inner solid core */}
            <mesh>
              <sphereGeometry args={[orbSize * 0.4, 16, 16]} />
              <meshStandardMaterial
                color={color}
                emissive={color}
                emissiveIntensity={0.8}
                transparent
                opacity={0.8}
              />
            </mesh>

            {/* Orbit ring */}
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <torusGeometry args={[orbSize * 1.3, 0.008, 8, 64]} />
              <meshBasicMaterial color={color} transparent opacity={0.3} />
            </mesh>

            {/* Label */}
            <Html position={[0, 0.4, 0]} scale={4} distanceFactor={0.5}>
              <div
                className="font-bold px-4 py-2 rounded-xl whitespace-nowrap pointer-events-none"
                style={{
                  color: '#ffffff',
                  background: color,
                  fontSize: '14px',
                  textShadow: `0 2px 4px rgba(0,0,0,0.8)`,
                  boxShadow: `0 0 20px ${color}`,
                  fontWeight: 'bold',
                }}
              >
                {labels[i % labels.length]}
              </div>
            </Html>
          </group>
        );
      })}
    </group>
  );
}

// Glowing ring
function GlowRing({ radius = 5, color = '#8b5cf6' }: { radius?: number; color?: string }) {
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!ringRef.current) return;
    ringRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.3 + 1.2;
    ringRef.current.rotation.z = state.clock.elapsedTime * 0.1;
  });

  return (
    <mesh ref={ringRef} position={[0, 0, -3]}>
      <torusGeometry args={[radius, 0.03, 16, 100]} />
      <meshBasicMaterial color={color} transparent opacity={0.15} />
    </mesh>
  );
}

// Camera that follows scroll
function ScrollCamera() {
  useFrame((state) => {
    state.camera.position.x += (state.pointer.x * 0.5 - state.camera.position.x) * 0.05;
    state.camera.position.y += (state.pointer.y * 0.3 - state.camera.position.y) * 0.05;
    state.camera.lookAt(0, 0, 0);
  });

  return null;
}

// Lightweight mobile scene - just stars and minimal particles
function MobileScene() {
  return (
    <>
      <Stars
        radius={50}
        depth={50}
        count={500}
        factor={3}
        saturation={0}
        fade
        speed={0.3}
      />
      <ParticleField count={80} />
      <ambientLight intensity={0.15} />
      <pointLight position={[10, 10, 10]} color="#3b82f6" intensity={0.3} />
    </>
  );
}

// Full desktop scene
function DesktopScene() {
  return (
    <>
      <ScrollCamera />

      <ambientLight intensity={0.15} />
      <pointLight position={[10, 10, 10]} color="#3b82f6" intensity={0.5} />
      <pointLight position={[-10, -10, 5]} color="#8b5cf6" intensity={0.3} />
      <pointLight position={[0, 10, -10]} color="#ec4899" intensity={0.2} />

      <Stars
        radius={50}
        depth={50}
        count={2000}
        factor={4}
        saturation={0}
        fade
        speed={0.5}
      />

      <ParticleField count={400} />
      <ConnectionLines count={120} />

      <FloatingGeometry position={[-6, 3, -4]} geometry="octahedron" color="#3b82f6" speed={0.8} />
      <FloatingGeometry position={[7, -2, -3]} geometry="icosahedron" color="#8b5cf6" speed={1.2} />
      <FloatingGeometry position={[-4, -4, -5]} geometry="dodecahedron" color="#ec4899" speed={0.6} />
      <FloatingGeometry position={[5, 4, -6]} geometry="tetrahedron" color="#06b6d4" speed={1} />
      <FloatingGeometry position={[0, -6, -4]} geometry="torus" color="#3b82f6" speed={0.7} />
      <FloatingGeometry position={[-7, 0, -7]} geometry="box" color="#8b5cf6" speed={0.9} />
      <FloatingGeometry position={[8, 2, -8]} geometry="octahedron" color="#ec4899" speed={0.5} />

      <GlowRing radius={6} color="#3b82f6" />
      <RingOrbiters
        radius={6}
        color="#3b82f6"
        count={5}
        labels={['Node.js', 'React', 'Next.js', 'Socket.io', 'TypeScript']}
      />
      <GlowRing radius={8} color="#8b5cf6" />
      <RingOrbiters
        radius={8}
        color="#8b5cf6"
        count={4}
        labels={['MongoDB', 'PostgreSQL', 'AWS', 'Express.js']}
      />
    </>
  );
}

export function ThreeBackground() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  return (
    <div className="fixed inset-0 -z-10" style={{ background: '#030712' }}>
      <Canvas
        camera={{ position: [0, 0, 10], fov: 60 }}
        dpr={isMobile ? [1, 1] : [1, 1.5]}
        gl={{
          antialias: !isMobile,
          alpha: false,
          powerPreference: isMobile ? 'low-power' : 'high-performance',
        }}
        style={{ background: 'transparent' }}
        frameloop={isMobile ? 'demand' : 'always'}
      >
        <color attach="background" args={['#030712']} />
        <fog attach="fog" args={['#030712', 8, 30]} />

        {isMobile ? <MobileScene /> : <DesktopScene />}
      </Canvas>
    </div>
  );
}
