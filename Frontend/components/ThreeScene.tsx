import React, { useMemo, useState, useEffect } from 'react';
import QRCode from 'qrcode';
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
// const TEXT_COLOR = '#FFFFFF'; // Removed in favor of store state

const QRCodePlane = ({ link, size = 25 }: { link: string; size?: number }) => {
  const [textureUrl, setTextureUrl] = useState<string>('');
  const [texture, setTexture] = useState<THREE.Texture | null>(null);

  useEffect(() => {
    if (link) {
      QRCode.toDataURL(link, {
        width: 512,
        margin: 1,
        color: {
          dark: '#000000',
          light: '#FFFFFF',
        },
      })
        .then(setTextureUrl)
        .catch(console.error);
    }
  }, [link]);

  useEffect(() => {
    if (!textureUrl) return;
    const loader = new THREE.TextureLoader();
    const tex = loader.load(textureUrl);
    setTexture(tex);

    return () => {
      tex.dispose();
    };
  }, [textureUrl]);

  if (!texture) return null;

  return (
    <mesh rotation={[0, Math.PI, 0]} scale={[-1, 1, 1]}>
      <planeGeometry args={[size, size]} />
      <meshBasicMaterial map={texture} transparent />
    </mesh>
  );
};

const Card = () => {
  const { color, name, email, jobTitle, phoneNumber, github, linkedin, filletRadius, showQrCode, showGithub, showLinkedin, qrCodeLink, fontColor } = useCardStore();

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
          color={fontColor}
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
          color={fontColor}
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
            color={fontColor}
            anchorX="left"
            anchorY="bottom"
          >
            {phoneNumber || '(123) 456-7890'}
          </DreiText>
          <DreiText
            position={[0, 4, 0]} // Email
            fontSize={2.5}
            color={fontColor}
            anchorX="left"
            anchorY="bottom"
          >
            {email || 'email@example.com'}
          </DreiText>
          {showGithub && (
            <DreiText
              position={[0, 8, 0]} // Github
              fontSize={2.5}
              color={fontColor}
              anchorX="left"
              anchorY="bottom"
            >
              {github || 'github.com/username'}
            </DreiText>
          )}
          {showLinkedin && (
            <DreiText
              position={[0, 12, 0]} // Linkedin
              fontSize={2.5}
              color={fontColor}
              anchorX="left"
              anchorY="bottom"
            >
              {linkedin || 'linkedin.com/in/username'}
            </DreiText>
          )}
        </group>
      </group>

      {/* Back of Card Content - QR Code */}
      <group position={[0, 0, -0.05]}>
        {showQrCode && qrCodeLink && (
          <QRCodePlane link={qrCodeLink} size={30} />
        )}
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
          enablePan={true}
          maxPolarAngle={Math.PI}
          minPolarAngle={0}
          target={[0, 0, 0]}
        />

        <ambientLight intensity={0.8} />
        <pointLight position={[200, 200, 200]} intensity={1.5} />
        <pointLight position={[-200, -200, -100]} intensity={0.8} color="#FFFFFF" />

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
