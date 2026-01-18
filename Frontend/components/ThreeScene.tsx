import React, { useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Grid, Text as DreiText } from '@react-three/drei';
import * as THREE from 'three';
import { useCardStore } from '../store';

// Dimensions in Millimeters
const CARD_WIDTH = 85;
const CARD_HEIGHT = 54;
const CARD_THICKNESS = 1.6; // 1.6mm thickness (standard PCB/Credit card)

// Layout Constants
const EDGE_PADDING = 6;
const TEXT_COLOR = '#FFFFFF';

const Card = () => {
  const { color, name, email, jobTitle, phoneNumber, filletRadius } = useCardStore();

  const shape = useMemo(() => {
    const s = new THREE.Shape();
    const w = CARD_WIDTH;
    const h = CARD_HEIGHT;
    const r = Math.min(Math.max(0, filletRadius), Math.min(w, h) / 2); // Clamp radius safe

    const x = -w / 2;
    const y = -h / 2;

    if (r <= 0) {
      s.moveTo(x, y);
      s.lineTo(x + w, y);
      s.lineTo(x + w, y + h);
      s.lineTo(x, y + h);
      s.lineTo(x, y);
    } else {
      s.moveTo(x + r, y);
      s.lineTo(x + w - r, y);
      s.quadraticCurveTo(x + w, y, x + w, y + r);
      s.lineTo(x + w, y + h - r);
      s.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
      s.lineTo(x + r, y + h);
      s.quadraticCurveTo(x, y + h, x, y + h - r);
      s.lineTo(x, y + r);
      s.quadraticCurveTo(x, y, x + r, y);
    }

    return s;
  }, [filletRadius]);

  const extrudeSettings = useMemo(() => ({
    depth: CARD_THICKNESS,
    bevelEnabled: false,
    steps: 1,
    curveSegments: 32 // Smooth corners
  }), []);

  return (
    <mesh
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, -CARD_THICKNESS / 2, 0]}
    >
      <extrudeGeometry args={[shape, extrudeSettings]} />
      <meshStandardMaterial
        color={color}
        roughness={0.3}
        metalness={0.1}
      />

      {/* Content Group - On top of the extruded surface (z = THICKNESS) */}
      <group position={[0, 0, CARD_THICKNESS + 0.05]}>
        {/* Helper Group to fix text orientation relative to the XY shape plane */}
        {/* Text defaults to XY plane. Our shape is XY. So text aligns naturally. */}

        {/* Name - Top Left */}
        <DreiText
          position={[-CARD_WIDTH / 2 + EDGE_PADDING, CARD_HEIGHT / 2 - EDGE_PADDING, 0]}
          fontSize={5}
          color={TEXT_COLOR}
          anchorX="left"
          anchorY="top"
          maxWidth={CARD_WIDTH - (EDGE_PADDING * 2)}
        >
          {name || 'Your Name'}
        </DreiText>

        {/* Job Title - Below Name */}
        <DreiText
          position={[-CARD_WIDTH / 2 + EDGE_PADDING, CARD_HEIGHT / 2 - EDGE_PADDING - 7, 0]}
          fontSize={3}
          color={TEXT_COLOR}
          anchorX="left"
          anchorY="top"
          maxWidth={CARD_WIDTH - (EDGE_PADDING * 2)}
          fillOpacity={0.8}
        >
          {jobTitle || 'Job Title'}
        </DreiText>

        {/* Contact Info Group - Bottom Left */}
        <group position={[-CARD_WIDTH / 2 + EDGE_PADDING, -CARD_HEIGHT / 2 + EDGE_PADDING, 0]}>
          <DreiText
            position={[0, 0, 0]} // Phone at bottom
            fontSize={2.5}
            color={TEXT_COLOR}
            anchorX="left"
            anchorY="bottom"
          >
            {phoneNumber || '(123) 456-7890'}
          </DreiText>
          <DreiText
            position={[0, 4, 0]} // Email slightly above
            fontSize={2.5}
            color={TEXT_COLOR}
            anchorX="left"
            anchorY="bottom"
          >
            {email || 'email@example.com'}
          </DreiText>
        </group>
      </group>
    </mesh>
  );
};

export const ThreeScene: React.FC = () => {
  return (
    <div className="w-full h-full absolute inset-0">
      <Canvas>
        <PerspectiveCamera makeDefault position={[0, 45, 120]} fov={45} />
        <OrbitControls
          enablePan={false}
          maxPolarAngle={Math.PI / 2.2}
          minPolarAngle={0}
          target={[0, 0, 0]}
        />

        <ambientLight intensity={0.5} />
        <pointLight position={[200, 200, 200]} intensity={1} />
        <pointLight position={[-200, -200, -100]} intensity={0.5} color="#8FD9D9" />

        <Card />

        <Grid
          position={[0, -20, 0]}
          args={[500, 500]}
          cellColor="#8FD9D9"
          sectionColor="#8FD9D9"
          fadeDistance={250}
          fadeStrength={1}
          cellThickness={0.5}
          sectionThickness={1}
          infiniteGrid
        />
      </Canvas>
    </div>
  );
};
