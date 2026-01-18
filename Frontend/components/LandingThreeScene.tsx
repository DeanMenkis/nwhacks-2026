import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { CardModel } from './CardModel';

export const LandingThreeScene: React.FC = () => {
    const demoCardData = {
        name: "Alex Chen",
        jobTitle: "Product Designer",
        school: "Design University",
        email: "alex@example.com",
        phoneNumber: "(555) 123-4567",
        github: "github.com/alex",
        linkedin: "linkedin.com/in/alex",
        showQrCode: true,
        showGithub: true,
        showLinkedin: true,
        qrCodeLink: "https://printmycard.com",
        color: "#784e97", // Primary Project Purple
        fontColor: "#FFFFFF",
        font: "/fonts/Monocraft-ttf/Monocraft.ttf",
        fontBold: true,
        filletRadius: 3,
    };

    return (
        <div className="w-full h-full"> {/* Parent container handles size */}
            <Canvas>
                <PerspectiveCamera makeDefault position={[0, 50, 130]} fov={40} />
                <OrbitControls
                    enablePan={false}
                    enableZoom={false}
                    autoRotate
                    autoRotateSpeed={2.0}
                    maxPolarAngle={Math.PI / 2 + 0.5} // Allow seeing a bit of bottom
                    minPolarAngle={Math.PI / 4}
                />

                <ambientLight intensity={1.0} />
                <pointLight position={[200, 200, 200]} intensity={1.5} />
                <pointLight position={[-200, -200, -100]} intensity={1.0} color="#FFFFFF" />
                <spotLight position={[0, 100, 0]} intensity={0.5} angle={0.5} penumbra={1} />

                <CardModel {...demoCardData} />
            </Canvas>
        </div>
    );
};
