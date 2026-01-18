import React, { useMemo, useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { Text as DreiText } from '@react-three/drei';
import * as THREE from 'three';

// Dimensions in Millimeters
const CARD_WIDTH = 85;
const CARD_HEIGHT = 54;
const CARD_THICKNESS = 1.6; // 1.6mm thickness (standard PCB/Credit card)

// Layout Constants
const EDGE_PADDING = 6;

interface CardProps {
    name: string;
    email: string;
    jobTitle: string;
    school: string;
    phoneNumber: string;
    github: string;
    linkedin: string;
    showQrCode: boolean;
    showGithub: boolean;
    showLinkedin: boolean;
    qrCodeLink: string;
    color: string;
    fontColor: string;
    font: string;
    fontBold: boolean;
    filletRadius: number;
}

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

export const CardModel: React.FC<CardProps> = ({
    color,
    name,
    email,
    jobTitle,
    school,
    phoneNumber,
    github,
    linkedin,
    filletRadius,
    showQrCode,
    showGithub,
    showLinkedin,
    qrCodeLink,
    fontColor,
    font,
    fontBold,
}) => {
    const activeFont = fontBold
        ? '/fonts/Monocraft-ttf/weights/Monocraft-Bold.ttf'
        : font;

    const shape = useMemo(() => {
        const s = new THREE.Shape();
        const w = CARD_WIDTH;
        const h = CARD_HEIGHT;
        const r = Math.min(Math.max(0, filletRadius), Math.min(w, h) / 2);

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

    const extrudeSettings = useMemo(
        () => ({
            depth: CARD_THICKNESS,
            bevelEnabled: false,
            steps: 1,
            curveSegments: 32,
        }),
        []
    );

    return (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -CARD_THICKNESS / 2, 0]}>
            <extrudeGeometry args={[shape, extrudeSettings]} />
            <meshStandardMaterial color={color} roughness={0.3} metalness={0.1} />

            {/* Content Group - On top of the extruded surface (z = THICKNESS) */}
            <group position={[0, 0, CARD_THICKNESS + 0.05]} key={activeFont}>
                {/* Name - Top Left */}
                <DreiText
                    position={[
                        -CARD_WIDTH / 2 + EDGE_PADDING,
                        CARD_HEIGHT / 2 - EDGE_PADDING,
                        0,
                    ]}
                    fontSize={5}
                    color={fontColor}
                    font={activeFont}
                    anchorX="left"
                    anchorY="top"
                    maxWidth={CARD_WIDTH - EDGE_PADDING * 2}
                >
                    {name || 'Your Name'}
                </DreiText>

                {/* Job Title - Below Name */}
                <DreiText
                    position={[
                        -CARD_WIDTH / 2 + EDGE_PADDING,
                        CARD_HEIGHT / 2 - EDGE_PADDING - 8,
                        0,
                    ]}
                    fontSize={4}
                    color={fontColor}
                    font={activeFont}
                    anchorX="left"
                    anchorY="top"
                    maxWidth={CARD_WIDTH - EDGE_PADDING * 2}
                    fillOpacity={0.8}
                >
                    {jobTitle || 'Job Title'}
                </DreiText>

                {/* School - Below Job Title */}
                <DreiText
                    position={[
                        -CARD_WIDTH / 2 + EDGE_PADDING,
                        CARD_HEIGHT / 2 - EDGE_PADDING - 14,
                        0,
                    ]}
                    fontSize={4}
                    color={fontColor}
                    font={activeFont}
                    anchorX="left"
                    anchorY="top"
                    maxWidth={CARD_WIDTH - EDGE_PADDING * 2}
                    fillOpacity={0.8}
                >
                    {school || 'School / University'}
                </DreiText>

                {/* Contact Info Group - Bottom Left */}
                <group
                    position={[
                        -CARD_WIDTH / 2 + EDGE_PADDING,
                        -CARD_HEIGHT / 2 + EDGE_PADDING,
                        0,
                    ]}
                >
                    <DreiText
                        position={[0, 0, 0]} // Phone at bottom
                        fontSize={4}
                        color={fontColor}
                        font={activeFont}
                        anchorX="left"
                        anchorY="bottom"
                    >
                        {phoneNumber || '(123) 456-7890'}
                    </DreiText>
                    <DreiText
                        position={[0, 6, 0]} // Email
                        fontSize={4}
                        color={fontColor}
                        font={activeFont}
                        anchorX="left"
                        anchorY="bottom"
                    >
                        {email || 'email@example.com'}
                    </DreiText>
                    {showGithub && (
                        <DreiText
                            position={[0, 12, 0]} // Github
                            fontSize={4}
                            color={fontColor}
                            font={activeFont}
                            anchorX="left"
                            anchorY="bottom"
                        >
                            {github || 'github.com/username'}
                        </DreiText>
                    )}
                    {showLinkedin && (
                        <DreiText
                            position={[0, 18, 0]} // Linkedin
                            fontSize={4}
                            color={fontColor}
                            font={activeFont}
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
                {showQrCode && qrCodeLink && <QRCodePlane link={qrCodeLink} size={30} />}
            </group>
        </mesh>
    );
};
