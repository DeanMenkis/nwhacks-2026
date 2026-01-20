import React, { useMemo, useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Grid, Text as DreiText } from '@react-three/drei';
import * as THREE from 'three';
import { useCardStore } from '../store';

import { CardModel } from './CardModel';

const Card = () => {
  const store = useCardStore();

  const cardProps = {
    name: store.name,
    email: store.email,
    jobTitle: store.jobTitle,
    school: store.school,
    phoneNumber: store.phoneNumber,
    github: store.github,
    linkedin: store.linkedin,
    showQrCode: store.showQrCode,
    showGithub: store.showGithub,
    showLinkedin: store.showLinkedin,
    qrCodeLink: store.qrCodeLink,
    color: store.color,
    fontColor: store.fontColor,
    font: store.font,
    fontBold: store.fontBold,
    filletRadius: store.filletRadius,
  };

  return <CardModel {...cardProps} />;
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
