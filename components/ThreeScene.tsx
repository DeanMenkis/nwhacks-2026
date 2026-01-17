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
      meshRef.current.rotation.x += delta * 0.2;
      meshRef.current.rotation.y += delta * 0.3;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
      <mesh ref={meshRef} scale={1.5}>
        <boxGeometry args={[1.5, 1.5, 1.5]} />
        <meshStandardMaterial 
            color={color} 
            wireframe 
            emissive={color}
            emissiveIntensity={0.5}
            transparent
            opacity={0.8}
        />
      </mesh>
      {/* Inner solid cube for better visibility */}
      <mesh scale={1.45} rotation={[0.5, 0.5, 0]}>
         <boxGeometry args={[1.5, 1.5, 1.5]} />
         <meshStandardMaterial color={color} opacity={0.1} transparent />
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
