import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Grid, Float } from '@react-three/drei';
import * as THREE from 'three';
import { useCardStore } from '../store';

const RotatingCube = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  const color = useCardStore((state) => state.color);

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.1;
      meshRef.current.rotation.y += delta * 0.2;
    }
  });

  // Dimensions: 85mm x 54mm x 2mm
  // Scaled to fit scene: roughly 1 unit = 20mm
  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
      <mesh ref={meshRef}>
        <boxGeometry args={[4.25, 2.7, 0.1]} />
        <meshStandardMaterial
          color={color}
          roughness={0.3}
          metalness={0.1}
        />
      </mesh>
    </Float>
  );
};

export const ThreeScene: React.FC = () => {
  return (
    <div className="w-full h-full absolute inset-0">
      <Canvas>
        <PerspectiveCamera makeDefault position={[0, 2, 6]} fov={50} />
        <OrbitControls enablePan={false} maxPolarAngle={Math.PI / 1.5} />

        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-10, -10, -5]} intensity={0.5} color="#8FD9D9" />

        <RotatingCube />

        <Grid
          position={[0, -2, 0]}
          args={[20, 20]}
          cellColor="#8FD9D9"
          sectionColor="#8FD9D9"
          fadeDistance={15}
          fadeStrength={1}
          cellThickness={0.5}
          sectionThickness={1}
        />
      </Canvas>
    </div>
  );
};
