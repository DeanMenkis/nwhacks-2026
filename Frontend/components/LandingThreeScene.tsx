import React, { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { CardModel } from './CardModel';

// Predefined states for the dynamic rotation
// Predefined states for the dynamic rotation
const DEMO_STATES = [
    {
        name: "Dean David Menkis",
        jobTitle: "Electrical Engineering",
        school: "@ BCIT",
        email: "deanmenkis@gmail.com",
        phoneNumber: "(236) 982 1553",
        github: "",
        linkedin: "",
        color: "#2DD4BF", // Teal
    },
    {
        name: "Ilia Moroz",
        jobTitle: "Firmware/Hardware Engineer",
        school: "@ BCIT",
        email: "iliamorozim@gmail.com",
        phoneNumber: "(778) 868 5019",
        github: "github.com/frosterilia",
        linkedin: "",
        color: "#F472B6", // Pink
    },
    {
        name: "Nina Lu",
        jobTitle: "Electrical Power",
        school: "@ BCIT",
        email: "nlu26@my.bcit.ca",
        phoneNumber: "(778)) 892-2083",
        github: "",
        linkedin: "linkedin.com/in/ninaplaystime/",
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
        showGithub: !!currentData.github,
        showLinkedin: !!currentData.linkedin,
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
