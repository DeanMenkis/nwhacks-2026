import React from 'react';
import { Link } from 'react-router-dom';
import {
    Box,
    ArrowRight,
    PlayCircle,
    CheckCircle,
    Package,
    Sliders,
    Settings2
} from 'lucide-react';
import { LandingThreeScene } from './LandingThreeScene';

const LandingPage: React.FC = () => {
    return (
        <div className="bg-background-dark text-white font-display overflow-x-hidden min-h-screen">
            {/* Navigation */}
            <nav className="fixed top-0 w-full z-50 bg-background-dark/80 backdrop-blur-lg border-b border-white/5">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="size-10 bg-primary rounded-xl flex items-center justify-center shadow-glow">
                            <Box className="text-white w-6 h-6" />
                        </div>
                        <h1 className="text-xl font-extrabold tracking-tight">PrintMyCard</h1>
                    </div>
                    <div className="flex items-center gap-4">
                    </div>
                </div>
            </nav>

            {/* Hero Header */}
            <header className="relative pt-24 pb-20 lg:pt-32 lg:pb-32 overflow-hidden">
                {/* Background Gradients */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full z-0 pointer-events-none">
                    <div className="absolute top-[-10%] left-[10%] w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px] animate-pulse"></div>
                    <div className="absolute bottom-[10%] right-[10%] w-[500px] h-[500px] bg-accent-teal/10 rounded-full blur-[100px]"></div>
                </div>

                <div className="max-w-7xl mx-auto px-6 relative z-10 grid lg:grid-cols-2 gap-12 items-center">
                    {/* Hero Content */}
                    <div className="text-center lg:text-left flex flex-col items-center lg:items-start">

                        <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight leading-[1.1] mb-6">
                            Bring Your <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-primary-hover to-accent-teal drop-shadow-sm">
                                Business Card
                            </span>{' '}
                            to Life
                        </h1>
                        <p className="text-lg lg:text-xl text-white/60 mb-10 max-w-lg leading-relaxed">
                            A modern dashboard to quickly design, create, and export 3D printed cards.
                            Customizable, easy to use, and completely free.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
                            <Link
                                to="/design"
                                className="w-full sm:w-auto bg-primary hover:bg-primary-hover active:scale-95 text-white px-8 py-4 rounded-2xl text-base font-bold transition-all shadow-glow hover:shadow-xl hover:-translate-y-1 flex items-center justify-center gap-2 group"
                            >
                                Create Your Card
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </Link>

                        </div>


                    </div>

                    {/* Hero Visual (3D Card Scene) */}
                    <div className="relative h-[400px] lg:h-[600px] flex items-center justify-center w-full cursor-move">
                        <div className="absolute inset-0 grid-floor pointer-events-none opacity-50"></div>
                        <LandingThreeScene />
                    </div>
                </div>
            </header>

            {/* Features Section */}
            <section className="py-24 bg-surface-dark/30 relative">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h2 className="text-3xl lg:text-4xl font-extrabold mb-6">Everything you need to design your Card</h2>
                        <p className="text-lg text-white/50">
                            Design your cards with ease using our intuitive dashboard.
                            Designed by you. Created by us.
                        </p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Feature 1 */}
                        <div className="group bg-surface-dark border border-white/5 p-8 rounded-3xl hover:border-primary/50 transition-all duration-300 hover:shadow-glow hover:-translate-y-1">
                            <div className="size-14 bg-gradient-to-br from-primary/20 to-transparent rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 border border-primary/20">
                                <Settings2 className="text-primary w-8 h-8" />
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-white group-hover:text-primary transition-colors">
                                Easy Configuration
                            </h3>
                            <p className="text-white/50 leading-relaxed">
                                Effortlessly design your cards. Customize colors, titles, text fields, fonts and other
                                parameters with our playful UI. Or choose from a selection of pre-made templates.
                            </p>
                        </div>

                        {/* Feature 2 */}
                        <div className="group bg-surface-dark border border-white/5 p-8 rounded-3xl hover:border-accent-teal/50 transition-all duration-300 hover:shadow-glow-teal hover:-translate-y-1">
                            <div className="size-14 bg-gradient-to-br from-accent-teal/20 to-transparent rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 border border-accent-teal/20">
                                <Box className="text-accent-teal w-8 h-8" />
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-white group-hover:text-accent-teal transition-colors">
                                Live 3D Preview
                            </h3>
                            <p className="text-white/50 leading-relaxed">
                                Visualize before you materialize. Our WebGL powered engine gives you a real-time,
                                interactive preview of your card.
                            </p>
                        </div>

                        {/* Feature 3 */}
                        <div className="group bg-surface-dark border border-white/5 p-8 rounded-3xl hover:border-accent-pink/50 transition-all duration-300 hover:shadow-[0_0_20px_rgba(255,117,151,0.3)] hover:-translate-y-1">
                            <div className="size-14 bg-gradient-to-br from-accent-pink/20 to-transparent rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 border border-accent-pink/20">
                                <Package className="text-accent-pink w-8 h-8" />
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-white group-hover:text-accent-pink transition-colors">
                                One-click 3MF Export
                            </h3>
                            <p className="text-white/50 leading-relaxed">
                                From screen to file in a single click. Generate production-ready 3MF files
                                optimized for printing.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 relative overflow-hidden">
                <div className="absolute inset-0 bg-primary/5"></div>
                <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
                    <h2 className="text-4xl lg:text-5xl font-extrabold mb-8">Ready to start designing?</h2>
                    <p className="text-xl text-white/60 mb-10">
                        Create your card today!
                    </p>
                    <Link
                        to="/design"
                        className="w-full sm:w-auto bg-primary hover:bg-primary-hover active:scale-95 text-white px-8 py-4 rounded-2xl text-base font-bold transition-all shadow-glow hover:shadow-xl hover:-translate-y-1 inline-flex items-center justify-center gap-2 group"
                    >
                        Get Started
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                    <p className="mt-6 text-sm text-white/30">Completely free, no account required</p>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-white/5 bg-surface-dark py-12">
                <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-2 opacity-50 hover:opacity-100 transition-opacity">
                        <Box className="w-5 h-5" />
                        <span className="font-bold">PrintMyCard</span>
                    </div>
                    <div className="flex gap-8 text-sm text-white/40">
                        {/* Footer links removed as requested */}
                    </div>
                    <div className="text-sm text-white/20">© 2026 PrintMyCard Inc.</div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;