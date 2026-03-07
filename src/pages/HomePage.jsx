import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Shirt, Zap, Shield, Truck, ChevronRight } from 'lucide-react';
import WelcomeToast from '../components/WelcomeToast';
import api from '../utils/api';

let toastDismissedInSession = false;

const HomePage = () => {
    const [toastSettings, setToastSettings] = useState(null);
    const [showToast, setShowToast] = useState(!toastDismissedInSession);
    const [toastLoading, setToastLoading] = useState(true);

    useEffect(() => {
        if (toastDismissedInSession) {
            setShowToast(false);
            setToastLoading(false);
            return;
        }

        const fetchToast = async () => {
            try {
                const { data } = await api.get('/toast-message');
                if (data && data.active) {
                    setToastSettings(data);
                    setShowToast(true);
                } else {
                    setShowToast(false);
                }
            } catch (err) {
                setShowToast(false);
            } finally {
                setToastLoading(false);
            }
        };

        fetchToast();
    }, []);

    const handleCloseToast = () => {
        setShowToast(false);
        toastDismissedInSession = true;
    };

    return (
        <>
            {showToast && (
                <WelcomeToast
                    settings={toastSettings}
                    onClose={handleCloseToast}
                    loading={toastLoading}
                />
            )}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                {/* Hero Section */}
                <section style={{ position: 'relative', width: '100%', padding: '80px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>


                    <h1 className="font-orbitron neon-cyan" style={{ fontSize: 'clamp(2rem, 10vw, 6rem)', fontWeight: '900', textAlign: 'center', marginBottom: '16px', letterSpacing: '-0.02em', lineHeight: '1.1' }}>
                        DESIGN YOUR <br />
                        <span>IDENTITY</span>
                    </h1>

                    <p style={{ color: '#999', fontSize: 'clamp(0.9rem, 3vw, 1.2rem)', textAlign: 'center', maxWidth: '640px', marginBottom: '32px', fontWeight: '300', letterSpacing: '0.05em', padding: '0 10px' }}>
                        Premium streetwear meets neon aesthetics. Custom-print your vision on high-quality threads.
                        Stand out in the dark.
                    </p>

                    <div className="flex flex-mobile-col" style={{ gap: '24px', width: '100%', justifyContent: 'center', alignItems: 'center' }}>
                        <Link to="/customize" className="btn btn-cyan" style={{ minWidth: '220px' }}>Start Designing <ChevronRight size={20} /></Link>
                        <Link to="/shop" className="btn btn-outline-purple" style={{ minWidth: '220px' }}>Explore Shop</Link>
                    </div>
                </section>

                {/* Feature Section */}
                <section className="container" style={{ padding: '40px 15px', width: '100%' }}>
                    <div className="grid grid-cols-4" style={{ gap: '16px' }}>
                        {[
                            { icon: <Zap size={40} />, color: 'var(--neon-cyan)', title: 'Fast Production', text: 'Your custom design printed and ready within 48 hours.' },
                            { icon: <Shirt size={40} />, color: 'var(--neon-pink)', title: 'Premium Quality', text: '100% Organic cotton with vibrant, durable prints.' },
                            { icon: <Shield size={40} />, color: 'var(--neon-purple)', title: 'Secure Payments', text: 'Encrypted transactions and buyer protection guaranteed.' },
                            { icon: <Truck size={40} />, color: 'var(--neon-green)', title: 'Global Shipping', text: 'Free international shipping on orders over $50.' }
                        ].map((f, i) => (
                            <div key={i} className="glassmorphism" style={{ padding: '32px', borderLeft: `4px solid ${f.color}`, transition: 'var(--transition)' }}>
                                <div style={{ color: f.color, marginBottom: '24px' }}>{f.icon}</div>
                                <h3 className="font-orbitron neon-cyan" style={{ fontWeight: 'bold', fontSize: '1.1rem', marginBottom: '8px' }}>{f.title}</h3>
                                <p style={{ color: '#999', fontSize: '0.9rem' }}>{f.text}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Color Preview Section */}
                <section style={{ width: '100%', padding: '60px 20px', background: 'rgba(255,255,255,0.02)', borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <div className="container">
                        <h2 className="font-orbitron neon-pink" style={{ fontSize: 'clamp(1.2rem, 4vw, 2rem)', fontWeight: 'bold', marginBottom: '40px', textAlign: 'center' }}>AVAILABLE <span style={{ color: 'inherit' }}>COLORS</span></h2>
                        <div className="grid grid-cols-4" style={{ gap: '16px' }}>
                            {['Black', 'White', 'Blue', 'Purple'].map((color) => {
                                const colorName = color === 'Blue' ? 'Skyblue' : color;
                                return (
                                    <Link key={color} to={`/customize?color=${color}`} style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                        <div className="glassmorphism" style={{ padding: '16px', borderRadius: '16px', width: '100%', aspectRatio: '1', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'var(--transition)' }}>
                                            <img
                                                src={`/assets/NORMAL_FIT/Normal_fit_${colorName}_frontside.png`}
                                                alt={`${color} T-Shirt`}
                                                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                                            />
                                        </div>
                                        <span className="font-orbitron" style={{ fontSize: '0.8rem', letterSpacing: '2px', textTransform: 'uppercase', marginTop: '12px', color: '#ccc' }}>{color}</span>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                </section>

                {/* Fit Type Section */}
                <section style={{ width: '100%', padding: '60px 20px' }}>
                    <div className="container">
                        <h2 className="font-orbitron neon-cyan" style={{ fontSize: 'clamp(1.2rem, 4vw, 2rem)', fontWeight: 'bold', marginBottom: '40px', textAlign: 'center' }}>CHOOSE YOUR <span style={{ color: 'inherit' }}>FIT</span></h2>
                        <div className="grid grid-cols-2" style={{ gap: '24px', maxWidth: '800px', margin: '0 auto' }}>
                            {[
                                { label: 'Normal Fit', fit: 'NORMAL_FIT', price: '$29.99', color: 'var(--neon-cyan)', shadow: 'var(--shadow-cyan)' },
                                { label: 'Oversized Fit', fit: 'OVERSIZED_FIT', price: '$34.99', color: 'var(--neon-pink)', shadow: 'var(--shadow-pink)' }
                            ].map(({ label, fit, price, color, shadow }) => (
                                <Link key={fit} to={`/customize?color=Black&fit=${fit}`} style={{ textDecoration: 'none' }}>
                                    <div className="glassmorphism" style={{ padding: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', border: `1px solid ${color}`, transition: 'var(--transition)', cursor: 'pointer' }}>
                                        <img
                                            src={`/assets/${fit}/${fit === 'OVERSIZED_FIT' ? 'Oversized_fit' : 'Normal_fit'}_Black_frontside.png`}
                                            alt={label}
                                            style={{ width: '60%', aspectRatio: '1', objectFit: 'contain' }}
                                        />
                                        <div style={{ textAlign: 'center' }}>
                                            <h3 className="font-orbitron neon-pink" style={{ fontSize: '1.1rem', marginBottom: '4px' }}>{label}</h3>
                                            <span style={{ color: '#ccc', fontSize: '0.9rem' }}>Starting at {price}</span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            </div>
        </>
    );
};

export default HomePage;
