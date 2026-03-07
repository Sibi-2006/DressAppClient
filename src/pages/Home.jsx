import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Zap, Target, Palette } from 'lucide-react';

const homeProductPreviews = [
    { color: 'Black', hex: '#000000', labelColor: 'neonPink' },
    { color: 'White', hex: '#ffffff', labelColor: 'neonCyan' },
    { color: 'Blue', hex: '#0000ff', labelColor: 'neonPurple' },
    { color: 'Purple', hex: '#800080', labelColor: 'neonGreen' },
];

const Home = () => {
    return (
        <div className="flex flex-col items-center">
            {/* Hero Section */}
            <section className="relative w-full py-20 px-4 flex flex-col items-center justify-center text-center">


                <h1 className="font-orbitron neon-cyan text-5xl md:text-7xl font-black mb-6 tracking-tighter">
                    DESIGN YOUR <br />
                    <span>IDENTITY</span>
                </h1>
                <p className="max-w-xl text-gray-400 text-lg md:text-xl mb-10 font-medium">
                    Premium streetwear for those who dare to be different. Upload your art, customize your fit, and glow in the dark.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                    <Link to="/customize" className="btn-neon-cyan flex items-center justify-center gap-2 group">
                        Start Designing <ChevronRight className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                    <Link to="/shop" className="btn-neon-purple flex items-center justify-center gap-2 group">
                        Browse Shop
                    </Link>
                </div>
            </section>

            {/* Features */}
            <section className="w-full max-w-7xl mx-auto py-20 px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="glassmorphism p-8 rounded-2xl border-l-4 border-neonPink flex flex-col items-center text-center">
                    <div className="bg-neonPink/10 p-4 rounded-full mb-6">
                        <Palette className="h-8 w-8 text-neonPink" />
                    </div>
                    <h3 className="font-orbitron neon-pink font-bold text-xl mb-4">Full Customization</h3>
                    <p className="text-gray-400">Drag, resize, and rotate your designs on the front or back of our premium T-shirts.</p>
                </div>
                <div className="glassmorphism p-8 rounded-2xl border-l-4 border-neonCyan flex flex-col items-center text-center">
                    <div className="bg-neonCyan/10 p-4 rounded-full mb-6">
                        <Zap className="h-8 w-8 text-neonCyan" />
                    </div>
                    <h3 className="font-orbitron neon-cyan font-bold text-xl mb-4">Neon Aesthetic</h3>
                    <p className="text-gray-400">Experience a shopping environment built for the future with dark neon visuals.</p>
                </div>
                <div className="glassmorphism p-8 rounded-2xl border-l-4 border-neonPurple flex flex-col items-center text-center">
                    <div className="bg-neonPurple/10 p-4 rounded-full mb-6">
                        <Target className="h-8 w-8 text-neonPurple" />
                    </div>
                    <h3 className="font-orbitron neon-pink font-bold text-xl mb-4">Premium Quality</h3>
                    <p className="text-gray-400">Heavyweight cotton T-shirts available in curated colors for maximum impact.</p>
                </div>
            </section>

            {/* Preview Section */}
            <section className="w-full py-20 bg-darkSurface/30 border-y border-white/5">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="font-orbitron neon-cyan text-3xl font-bold mb-4">AVAILABLE SHADES</h2>
                        <p className="text-gray-400">Select your canvas from our signature collection</p>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {homeProductPreviews.map((p) => (
                            <Link
                                key={p.color}
                                to={`/customize?color=${p.color}`}
                                className="group relative h-80 glassmorphism rounded-2xl overflow-hidden border border-white/10 hover:border-white/30 transition-all duration-500"
                            >
                                <div
                                    className="absolute inset-x-0 bottom-0 h-2 group-hover:h-full transition-all duration-500 opacity-20 pointer-events-none"
                                    style={{ backgroundColor: p.hex }}
                                ></div>
                                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-10">
                                    <div
                                        className="w-32 h-32 rounded-lg mb-6 shadow-2xl transition-transform duration-500 group-hover:scale-110"
                                        style={{ backgroundColor: p.hex, border: p.color === 'Black' ? '1px solid #333' : 'none' }}
                                    ></div>
                                    <h3 className="font-orbitron font-bold text-white text-xl uppercase tracking-widest">{p.color}</h3>
                                    <span className="text-neonCyan text-sm font-bold mt-2 opacity-0 group-hover:opacity-100 transition-opacity">CUSTOMIZE NOW</span>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="w-full max-w-5xl mx-auto py-24 px-4 text-center">
                <div className="glassmorphism p-12 rounded-[2rem] border border-white/10 relative overflow-hidden group">
                    <h2 className="font-orbitron neon-pink text-4xl font-black mb-6 relative z-10">READY TO MAKE YOUR MARK?</h2>
                    <p className="text-gray-400 text-lg mb-10 relative z-10">Join thousands of creators building their unique brand with NeonThreads.</p>
                    <Link to="/signup" className="btn-neon-pink text-lg px-8 relative z-10">Create Your Account</Link>
                </div>
            </section>
        </div>
    );
};

export default Home;
