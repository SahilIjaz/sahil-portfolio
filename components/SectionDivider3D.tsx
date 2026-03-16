'use client';

import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function WaveGrid({ color = '#3b82f6' }: { color?: string }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const geoRef = useRef<THREE.PlaneGeometry>(null);

  const segments = 60;

  useFrame((state) => {
    if (!geoRef.current) return;
    const pos = geoRef.current.attributes.position;
    const t = state.clock.elapsedTime;

    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      pos.setZ(i, Math.sin(x * 2 + t) * 0.15 + Math.sin(y * 3 + t * 0.5) * 0.1);
    }
    pos.needsUpdate = true;
  });

  return (
    <mesh ref={meshRef} rotation={[-Math.PI / 3, 0, 0]} position={[0, 0, 0]}>
      <planeGeometry ref={geoRef} args={[15, 4, segments, segments / 3]} />
      <meshBasicMaterial
        color={color}
        wireframe
        transparent
        opacity={0.12}
      />
    </mesh>
  );
}

export function SectionDivider3D({ color = '#3b82f6' }: { color?: string }) {
  return (
    <div className="w-full h-[120px] -my-10 relative z-0">
      <Canvas
        camera={{ position: [0, 2, 5], fov: 40 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <WaveGrid color={color} />
      </Canvas>
    </div>
  );
}
