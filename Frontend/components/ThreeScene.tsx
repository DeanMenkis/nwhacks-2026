import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Grid } from '@react-three/drei';
import { useCardStore } from '../store';

const Card = () => {
  const color = useCardStore((state) => state.color);

  // Dimensions: 85mm x 54mm x 2mm
  // Scaled to fit scene: roughly 1 unit = 20mm
  // Flat on ground (y-up thickness = 0.1, positioned at y=-1.95 to sit on grid at -2)
  return (
    <mesh position={[0, -1.95, 0]}>
      <boxGeometry args={[4.25, 0.1, 2.7]} />
      <meshStandardMaterial
        color={color}
        roughness={0.3}
        metalness={0.1}
      />
    </mesh>
  );
};

export const ThreeScene: React.FC = () => {
  return (
    <div className="w-full h-full absolute inset-0">
      <Canvas>
        <PerspectiveCamera makeDefault position={[0, 2, 6]} fov={50} />
        <OrbitControls enablePan={false} maxPolarAngle={Math.PI / 1.5} target={[0, -2, 0]} />

        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-10, -10, -5]} intensity={0.5} color="#8FD9D9" />

        <Card />

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
