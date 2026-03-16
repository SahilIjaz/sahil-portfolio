'use client';

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function ThreeScene() {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const meshesRef = useRef<THREE.Mesh[]>([]);
  const mousePos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0a0a);
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(
      75,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 8;
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: false,
      powerPreference: 'high-performance',
    });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Create multiple 3D objects
    const meshes: THREE.Mesh[] = [];

    // Central rotating cube
    const cubeGeometry = new THREE.BoxGeometry(2, 2, 2);
    const cubeMaterial = new THREE.MeshPhongMaterial({
      color: 0x3b82f6,
      emissive: 0x1e40af,
      shininess: 100,
      wireframe: false,
    });
    const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    cube.position.set(0, 0, 0);
    cube.castShadow = true;
    cube.receiveShadow = true;
    scene.add(cube);
    meshes.push(cube);

    // Orbiting spheres
    const sphereGeometry = new THREE.SphereGeometry(0.6, 32, 32);
    const sphereMaterials = [
      new THREE.MeshPhongMaterial({ color: 0x8b5cf6, emissive: 0x6d28d9, shininess: 100 }),
      new THREE.MeshPhongMaterial({ color: 0xec4899, emissive: 0xbe185d, shininess: 100 }),
      new THREE.MeshPhongMaterial({ color: 0x06b6d4, emissive: 0x0891b2, shininess: 100 }),
    ];

    const orbitingSpheres: THREE.Mesh[] = [];
    sphereMaterials.forEach((material, idx) => {
      const sphere = new THREE.Mesh(sphereGeometry, material);
      const angle = (idx / sphereMaterials.length) * Math.PI * 2;
      sphere.position.set(Math.cos(angle) * 4, Math.sin(angle) * 4, 0);
      sphere.castShadow = true;
      sphere.receiveShadow = true;
      scene.add(sphere);
      meshes.push(sphere);
      orbitingSpheres.push(sphere);
    });

    // Rotating torus
    const torusGeometry = new THREE.TorusGeometry(3, 0.4, 32, 100);
    const torusMaterial = new THREE.MeshPhongMaterial({
      color: 0xfbbf24,
      emissive: 0xb45309,
      shininess: 80,
    });
    const torus = new THREE.Mesh(torusGeometry, torusMaterial);
    torus.rotation.x = 0.5;
    torus.castShadow = true;
    torus.receiveShadow = true;
    scene.add(torus);
    meshes.push(torus);

    // Floating octahedron
    const octahedronGeometry = new THREE.OctahedronGeometry(1);
    const octahedronMaterial = new THREE.MeshPhongMaterial({
      color: 0x10b981,
      emissive: 0x047857,
      shininess: 100,
    });
    const octahedron = new THREE.Mesh(octahedronGeometry, octahedronMaterial);
    octahedron.position.set(-2.5, 2.5, 0);
    octahedron.castShadow = true;
    octahedron.receiveShadow = true;
    scene.add(octahedron);
    meshes.push(octahedron);

    // Dodecahedron
    const dodecahedronGeometry = new THREE.DodecahedronGeometry(0.8);
    const dodecahedronMaterial = new THREE.MeshPhongMaterial({
      color: 0xf59e0b,
      emissive: 0xd97706,
      shininess: 100,
    });
    const dodecahedron = new THREE.Mesh(dodecahedronGeometry, dodecahedronMaterial);
    dodecahedron.position.set(2.5, -2, 0);
    dodecahedron.castShadow = true;
    dodecahedron.receiveShadow = true;
    scene.add(dodecahedron);
    meshes.push(dodecahedron);

    meshesRef.current = meshes;

    // Advanced lighting setup
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 10, 5);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    directionalLight.shadow.camera.far = 30;
    scene.add(directionalLight);

    // Blue point light
    const pointLight1 = new THREE.PointLight(0x3b82f6, 0.6, 100);
    pointLight1.position.set(5, 5, 5);
    pointLight1.castShadow = true;
    scene.add(pointLight1);

    // Purple point light
    const pointLight2 = new THREE.PointLight(0x8b5cf6, 0.6, 100);
    pointLight2.position.set(-5, -5, 5);
    pointLight2.castShadow = true;
    scene.add(pointLight2);

    // Cyan point light
    const pointLight3 = new THREE.PointLight(0x06b6d4, 0.4, 100);
    pointLight3.position.set(0, 0, -5);
    scene.add(pointLight3);

    // Ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
    scene.add(ambientLight);

    // Particles for visual depth
    const particlesGeometry = new THREE.BufferGeometry();
    const particleCount = 100;
    const positions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 20;
      positions[i + 1] = (Math.random() - 0.5) * 20;
      positions[i + 2] = (Math.random() - 0.5) * 20;
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particlesMaterial = new THREE.PointsMaterial({
      color: 0x3b82f6,
      size: 0.1,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.5,
    });
    const particles = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particles);

    // Handle window resize
    const handleResize = () => {
      if (!containerRef.current) return;

      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;

      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    // Mouse tracking
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      mousePos.current.x = (e.clientX - rect.left) / rect.width - 0.5;
      mousePos.current.y = -(e.clientY - rect.top) / rect.height + 0.5;
    };

    containerRef.current.addEventListener('mousemove', handleMouseMove);

    // GSAP scroll animation - rotate entire scene
    gsap.to(cube.rotation, {
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top center',
        end: 'bottom center',
        scrub: 1,
      },
      x: Math.PI * 2,
      y: Math.PI * 1.5,
      duration: 1,
    });

    // Animation loop
    let animationId: number;
    const animate = () => {
      animationId = requestAnimationFrame(animate);

      // Cube auto-rotation
      cube.rotation.x += 0.003;
      cube.rotation.y += 0.005;

      // Torus rotation
      torus.rotation.y += 0.003;
      torus.rotation.z += 0.002;

      // Octahedron floating animation
      octahedron.position.y += Math.sin(Date.now() * 0.001) * 0.01;
      octahedron.rotation.x += 0.004;
      octahedron.rotation.z += 0.004;

      // Dodecahedron rotation
      dodecahedron.rotation.x += 0.003;
      dodecahedron.rotation.y += 0.004;

      // Orbiting spheres
      orbitingSpheres.forEach((sphere, idx) => {
        const angle = (idx / orbitingSpheres.length) * Math.PI * 2 + Date.now() * 0.0005;
        sphere.position.x = Math.cos(angle) * 4;
        sphere.position.y = Math.sin(angle) * 4;
        sphere.position.z = Math.sin(Date.now() * 0.0003) * 2;
        sphere.rotation.x += 0.005;
        sphere.rotation.y += 0.008;
      });

      // Mouse-influenced camera
      camera.position.x += (mousePos.current.x * 2 - camera.position.x) * 0.05;
      camera.position.y += (mousePos.current.y * 2 - camera.position.y) * 0.05;
      camera.lookAt(scene.position);

      // Particle animation
      particles.rotation.x += 0.0001;
      particles.rotation.y += 0.0002;

      renderer.render(scene, camera);
    };

    animate();

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      containerRef.current?.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationId);
      renderer.dispose();
      cubeGeometry.dispose();
      cubeMaterial.dispose();
      sphereGeometry.dispose();
      torusGeometry.dispose();
      torusMaterial.dispose();
      octahedronGeometry.dispose();
      octahedronMaterial.dispose();
      dodecahedronGeometry.dispose();
      dodecahedronMaterial.dispose();
      particlesGeometry.dispose();
      particlesMaterial.dispose();
      containerRef.current?.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="w-full h-[500px] rounded-2xl border border-white/10 dark:border-gray-700/50 overflow-hidden bg-gradient-to-br from-slate-950 to-slate-900 shadow-2xl"
    />
  );
}
