import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const STEPS = [
    {
        num: '01',
        icon: '👤',
        title: 'Sign Up / Login',
        desc: 'Create your NEONTHREADS account or sign in. Your designs, cart, and orders are all saved to your profile.',
        cta: 'Get Started',
        ctaLink: '/login?tab=signup',
        color: '#00ffff',
    },
    {
        num: '02',
        icon: '👕',
        title: 'Browse T-Shirt Designs',
        desc: 'Explore our curated catalog of Normal Fit and Oversized Fit base t-shirts. Filter by style to find your perfect canvas.',
        cta: 'Browse Shop',
        ctaLink: '/shop',
        color: '#bf00ff',
    },
    {
        num: '03',
        icon: '🎯',
        title: 'Select a T-Shirt',
        desc: 'Pick a base t-shirt by clicking on it. Choose from Black, White, Blue, or Purple — each available in Normal and Oversized fit.',
        cta: 'View Shop',
        ctaLink: '/shop',
        color: '#00ffff',
    },
    {
        num: '04',
        icon: '🎨',
        title: 'Customize Your Design',
        desc: 'Upload your design image for the front and/or back of the shirt. Drag, scale, and rotate it to perfect placement. Switch between FRONT and BACK tabs.',
        cta: 'Start Designing',
        ctaLink: '/customize',
        color: '#ff00aa',
    },
    {
        num: '05',
        icon: '🔍',
        title: 'Preview Your Design',
        desc: 'See a live preview of your custom t-shirt with your uploaded design layers composited on the shirt canvas. Both sides are shown.',
        cta: 'Try Customize',
        ctaLink: '/customize',
        color: '#00ff88',
    },
    {
        num: '06',
        icon: '🛒',
        title: 'Add to Cart',
        desc: 'Happy with your design? Select your size (S, M, L, XL, 2XL), quantity, and tap Add to Cart. All customization details are saved.',
        cta: 'View Cart',
        ctaLink: '/cart',
        color: '#ff00aa',
    },
    {
        num: '07',
        icon: '💳',
        title: 'Checkout & UPI Payment',
        desc: 'Enter your delivery address, tap Pay with UPI. Your UPI app opens automatically. Complete payment and enter your UTR/Transaction ID to confirm.',
        cta: 'Checkout',
        ctaLink: '/cart',
        color: '#ffaa00',
    },
    {
        num: '08',
        icon: '🎉',
        title: 'Order Confirmed!',
        desc: 'Your order is placed! Track it anytime from My Orders. You\'ll receive updates as it moves from Processing → Printing → Shipped → Delivered.',
        cta: 'My Orders',
        ctaLink: '/my-orders',
        color: '#00ff88',
    },
];

const HowToUse = () => {
    const [hovered, setHovered] = useState(null);

    return (
        <div style={{ background: '#0a0a0a', minHeight: '100vh', padding: '60px 20px 80px' }}>
            <div className="container">

                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: '60px' }}>
                    <div style={{
                        display: 'inline-flex', alignItems: 'center', gap: '8px',
                        background: 'rgba(0,255,255,0.05)', border: '1px solid rgba(0,255,255,0.2)',
                        borderRadius: '50px', padding: '6px 16px', marginBottom: '20px'
                    }}>
                        <span style={{ color: '#00ffff', fontSize: '0.75rem', fontWeight: '700', letterSpacing: '2px' }}>
                            STEP BY STEP GUIDE
                        </span>
                    </div>
                    <h1 className="font-orbitron" style={{
                        fontSize: 'clamp(1.8rem, 5vw, 3.5rem)', fontWeight: '900',
                        background: 'linear-gradient(135deg, #00ffff, #bf00ff)',
                        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                        marginBottom: '16px', lineHeight: 1.2
                    }}>
                        HOW TO USE
                    </h1>
                    <p style={{ color: '#666', fontSize: '1.05rem', maxWidth: '520px', margin: '0 auto', lineHeight: 1.6 }}>
                        From blank canvas to custom wearable art — here's your complete guide to ordering your first NEONTHREADS tee.
                    </p>
                </div>

                {/* Steps Grid */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 340px), 1fr))',
                    gap: '20px',
                    maxWidth: '1100px',
                    margin: '0 auto'
                }}>
                    {STEPS.map((step, idx) => (
                        <div
                            key={step.num}
                            onMouseEnter={() => setHovered(idx)}
                            onMouseLeave={() => setHovered(null)}
                            style={{
                                background: hovered === idx
                                    ? `linear-gradient(135deg, rgba(${step.color === '#00ffff' ? '0,255,255' : step.color === '#bf00ff' ? '191,0,255' : step.color === '#ff00aa' ? '255,0,170' : step.color === '#00ff88' ? '0,255,136' : step.color === '#ffaa00' ? '255,170,0' : '0,255,255'},0.08), rgba(0,0,0,0.3))`
                                    : '#111',
                                border: `1px solid ${hovered === idx ? step.color + '44' : '#1a1a1a'}`,
                                borderRadius: '16px',
                                padding: '28px 24px',
                                transition: 'all 0.3s ease',
                                transform: hovered === idx ? 'translateY(-4px)' : 'none',
                                boxShadow: hovered === idx ? `0 8px 32px ${step.color}22` : 'none',
                                position: 'relative',
                                overflow: 'hidden',
                            }}
                        >
                            {/* Step number badge */}
                            <div style={{
                                position: 'absolute', top: '20px', right: '20px',
                                fontFamily: 'Orbitron, sans-serif', fontSize: '2.5rem',
                                fontWeight: '900', color: '#1a1a1a',
                                lineHeight: 1, userSelect: 'none',
                                transition: 'color 0.3s',
                                color: hovered === idx ? step.color + '33' : '#1a1a1a'
                            }}>
                                {step.num}
                            </div>

                            {/* Icon */}
                            <div style={{
                                width: '56px', height: '56px', borderRadius: '14px',
                                background: step.color + '15',
                                border: `1px solid ${step.color}33`,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: '1.6rem', marginBottom: '18px',
                                transition: 'all 0.3s',
                                boxShadow: hovered === idx ? `0 0 20px ${step.color}44` : 'none',
                            }}>
                                {step.icon}
                            </div>

                            {/* Content */}
                            <h3 style={{
                                color: hovered === idx ? step.color : '#fff',
                                fontFamily: 'Orbitron, sans-serif', fontSize: '0.95rem',
                                fontWeight: '700', marginBottom: '10px',
                                letterSpacing: '0.5px', transition: 'color 0.3s'
                            }}>
                                {step.title}
                            </h3>
                            <p style={{
                                color: '#777', fontSize: '0.875rem', lineHeight: 1.65,
                                marginBottom: '20px'
                            }}>
                                {step.desc}
                            </p>

                            {/* CTA */}
                            <Link
                                to={step.ctaLink}
                                style={{
                                    display: 'inline-flex', alignItems: 'center', gap: '6px',
                                    color: step.color, textDecoration: 'none',
                                    fontSize: '0.78rem', fontWeight: '700',
                                    fontFamily: 'Orbitron, sans-serif', letterSpacing: '1px',
                                    opacity: hovered === idx ? 1 : 0.5,
                                    transition: 'opacity 0.3s',
                                }}
                            >
                                {step.cta} →
                            </Link>
                        </div>
                    ))}
                </div>

                {/* Bottom CTA */}
                <div style={{ textAlign: 'center', marginTop: '60px' }}>
                    <p style={{ color: '#555', marginBottom: '20px', fontSize: '0.9rem' }}>
                        Ready to create your first custom tee?
                    </p>
                    <Link to="/shop" style={{
                        display: 'inline-block',
                        background: 'linear-gradient(135deg, #00ffff, #bf00ff)',
                        color: '#0a0a0a', textDecoration: 'none',
                        padding: '14px 36px', borderRadius: '50px',
                        fontWeight: '900', fontFamily: 'Orbitron, sans-serif',
                        fontSize: '0.9rem', letterSpacing: '1px',
                        transition: 'transform 0.2s, box-shadow 0.2s',
                        boxShadow: '0 0 30px rgba(0,255,255,0.3)',
                    }}>
                        START DESIGNING →
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default HowToUse;
