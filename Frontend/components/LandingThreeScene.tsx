import React, { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { CardModel } from './CardModel';

// Predefined states for the dynamic rotation
// Predefined states for the dynamic rotation
const DEMO_STATES = [
    {
        name: "Sarah Smith",
        jobTitle: "Software Engineer",
        school: "MIT",
        email: "sarah@tech.edu",
        phoneNumber: "(555) 987-6543",
        github: "github.com/sarah",
        linkedin: "linkedin.com/in/sarah",
        color: "#2DD4BF", // Teal
    },
    {
        name: "Jordan Lee",
        jobTitle: "Founder",
        school: "Stanford",
        email: "jordan@startup.io",
        phoneNumber: "(555) 456-7890",
        github: "github.com/jordan",
        linkedin: "linkedin.com/in/jordan",
        color: "#F472B6", // Pink
    },
    {
        name: "Mike Ross",
        jobTitle: "Data Scientist",
        school: "Berkeley",
        email: "mike@data.ai",
        phoneNumber: "(555) 234-5678",
        github: "github.com/mike",
        linkedin: "linkedin.com/in/mike",
        color: "#60A5FA", // Blue
    }
];

export const LandingThreeScene: React.FC = () => {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % DEMO_STATES.length);
        }, 3000); // Change every 3 seconds

        return () => clearInterval(interval);
    }, []);

    const currentData = DEMO_STATES[currentIndex];

    // Merge current demo state with static defaults
    const cardData = {
        ...currentData,
        showQrCode: true,
        showGithub: true,
        showLinkedin: true,
        qrCodeLink: "https://printmycard.com",
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

                <CardModel {...cardData} />
            </Canvas>
        </div>
    );
};
