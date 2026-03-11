import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Shirt, Zap, Shield, Truck, ChevronRight, ArrowRight } from 'lucide-react';
import WelcomeToast from '../components/WelcomeToast';
import api from '../utils/api';

let toastDismissedInSession = false;

/* ── custom scrollbar style injected once ── */
const SCROLLBAR_CSS = `
.gallery-scroll::-webkit-scrollbar { width: 4px; }
.gallery-scroll::-webkit-scrollbar-track { background: #0a0a0a; }
.gallery-scroll::-webkit-scrollbar-thumb { background: #00ffff33; border-radius: 2px; }
.gallery-scroll::-webkit-scrollbar-thumb:hover { background: #00ffff88; }
`;

function injectScrollbarCSS() {
    if (document.getElementById('gallery-scrollbar-css')) return;
    const style = document.createElement('style');
    style.id = 'gallery-scrollbar-css';
    style.textContent = SCROLLBAR_CSS;
    document.head.appendChild(style);
}

const getImagePath = (product) => {
    if (product.images && product.colors?.length > 0) {
        const colorData = product.images[product.colors[0]];
        if (colorData?.front) return colorData.front;
    }
    const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
    let c = product.color || product.colors?.[0] || 'Black';
    if (c.toLowerCase() === 'blue' || c.toLowerCase() === 'skyblue') c = 'Skyblue';
    else c = cap(c);
    const prefix = product.fit_type === 'OVERSIZED_FIT' ? 'Oversized_fit' : 'Normal_fit';
    return `/assets/${product.fit_type}/${prefix}_${c}_frontside.png`;
};

const HomePage = () => {
    const [toastSettings, setToastSettings] = useState(null);
    const [showToast, setShowToast] = useState(!toastDismissedInSession);
    const [toastLoading, setToastLoading] = useState(true);
    const [products, setProducts] = useState([]);
    const [prodLoading, setProdLoading] = useState(true);

    useEffect(() => {
        injectScrollbarCSS();
        if (toastDismissedInSession) { setShowToast(false); setToastLoading(false); return; }
        const fetchToast = async () => {
            try {
                const { data } = await api.get('/toast-message');
                if (data?.active) { setToastSettings(data); setShowToast(true); }
                else setShowToast(false);
            } catch { setShowToast(false); }
            finally { setToastLoading(false); }
        };
        fetchToast();
    }, []);

    useEffect(() => {
        const fetchProducts = async () => {
            try { const { data } = await api.get('/products'); setProducts(data); }
            catch (e) { console.error('products fetch error', e); }
            finally { setProdLoading(false); }
        };
        fetchProducts();
    }, []);

    const handleCloseToast = () => { setShowToast(false); toastDismissedInSession = true; };

    return (
        <>
            {showToast && <WelcomeToast settings={toastSettings} onClose={handleCloseToast} loading={toastLoading} />}

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

                {/* ── HERO ── */}
                <section style={{ position: 'relative', width: '100%', padding: '80px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                    <h1 className="font-orbitron neon-cyan" style={{ fontSize: 'clamp(2rem, 10vw, 6rem)', fontWeight: '900', textAlign: 'center', marginBottom: '16px', letterSpacing: '-0.02em', lineHeight: '1.1' }}>
                        DESIGN YOUR <br /><span>IDENTITY</span>
                    </h1>
                    <p style={{ color: '#999', fontSize: 'clamp(0.9rem, 3vw, 1.2rem)', textAlign: 'center', maxWidth: '640px', marginBottom: '32px', fontWeight: '300', letterSpacing: '0.05em', padding: '0 10px' }}>
                        Premium streetwear meets neon aesthetics. Custom-print your vision on high-quality threads. Stand out in the dark.
                    </p>
                    <div className="flex flex-mobile-col" style={{ gap: '24px', width: '100%', justifyContent: 'center', alignItems: 'center' }}>
                        <Link to="/customize" className="btn btn-cyan" style={{ minWidth: '220px' }}>Start Designing <ChevronRight size={20} /></Link>
                        <Link to="/shop" className="btn btn-outline-purple" style={{ minWidth: '220px' }}>Explore Shop</Link>
                    </div>
                </section>

                {/* ── FEATURES ── */}
                <section className="container" style={{ padding: '40px 15px', width: '100%' }}>
                    <div className="grid grid-cols-4" style={{ gap: '16px' }}>
                        {[
                            { icon: <Zap size={40} />, color: 'var(--neon-cyan)', title: 'Fast Production', text: 'Your custom design printed and ready within 48 hours.' },
                            { icon: <Shirt size={40} />, color: 'var(--neon-pink)', title: 'Premium Quality', text: '100% Organic cotton with vibrant, durable prints.' },
                            { icon: <Shield size={40} />, color: 'var(--neon-purple)', title: 'Secure Payments', text: 'Encrypted transactions and buyer protection guaranteed.' },
                            { icon: <Truck size={40} />, color: 'var(--neon-green)', title: 'Fast Shipping', text: 'Pan-India delivery straight to your door.' }
                        ].map((f, i) => (
                            <div key={i} className="glassmorphism" style={{ padding: '32px', borderLeft: `4px solid ${f.color}`, transition: 'var(--transition)' }}>
                                <div style={{ color: f.color, marginBottom: '24px' }}>{f.icon}</div>
                                <h3 className="font-orbitron neon-cyan" style={{ fontWeight: 'bold', fontSize: '1.1rem', marginBottom: '8px' }}>{f.title}</h3>
                                <p style={{ color: '#999', fontSize: '0.9rem' }}>{f.text}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* ── SCROLLABLE PRODUCT GALLERY ── */}
                <section style={{ width: '100%', padding: '60px 20px' }}>
                    <div className="container">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', flexWrap: 'wrap', gap: '12px' }}>
                            <h2 className="font-orbitron neon-cyan" style={{ fontSize: 'clamp(1.2rem, 4vw, 2rem)', fontWeight: 'bold', margin: 0 }}>
                                FEATURED <span style={{ color: 'inherit' }}>COLLECTION</span>
                            </h2>
                            <Link to="/shop" style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#00ffff', textDecoration: 'none', fontWeight: '700', fontSize: '0.85rem', fontFamily: 'Orbitron, sans-serif', letterSpacing: '1px' }}>
                                VIEW ALL <ArrowRight size={16} />
                            </Link>
                        </div>

                        {/* scrollable container */}
                        <div
                            className="gallery-scroll"
                            style={{
                                maxHeight: '70vh',
                                overflowY: 'auto',
                                overflowX: 'hidden',
                                paddingRight: '8px',
                                scrollBehavior: 'smooth',
                            }}
                        >
                            {prodLoading ? (
                                <div style={{ padding: '60px', textAlign: 'center', color: '#555' }}>
                                    <div style={{ fontSize: '2rem', marginBottom: '12px' }}>⏳</div>
                                    <p className="font-orbitron" style={{ fontSize: '0.85rem', letterSpacing: '2px' }}>LOADING COLLECTION...</p>
                                </div>
                            ) : products.length === 0 ? (
                                <div style={{ padding: '60px', textAlign: 'center', color: '#555' }}>
                                    <p className="font-orbitron" style={{ fontSize: '0.85rem' }}>No products found.</p>
                                </div>
                            ) : (
                                <div style={{
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(2, 1fr)',
                                    gap: '20px',
                                }}>
                                    {products.slice(0, 8).map((p, idx) => (
                                        <Link
                                            key={p._id || idx}
                                            to={`/customize?color=${p.color || p.colors?.[0] || 'Black'}&fit=${p.fit_type}`}
                                            className="glassmorphism"
                                            style={{ padding: '16px', textDecoration: 'none', color: 'white', transition: 'var(--transition)', display: 'flex', flexDirection: 'column' }}
                                        >
                                            <div style={{ width: '100%', aspectRatio: '3/4', background: '#0f0f0f', borderRadius: '10px', overflow: 'hidden', position: 'relative', marginBottom: '12px' }}>
                                                <img
                                                    src={getImagePath(p)}
                                                    alt={p.name}
                                                    style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                                                    onError={(e) => { e.target.onerror = null; e.target.src = '/assets/placeholder.png'; e.target.style.opacity = '0.4'; }}
                                                />
                                                <div style={{
                                                    position: 'absolute', top: '8px', right: '8px',
                                                    background: p.fit_type === 'OVERSIZED_FIT' ? '#ff00aa' : '#00ffff',
                                                    color: '#0a0a0a', fontSize: '0.55rem', fontWeight: '900',
                                                    padding: '2px 7px', borderRadius: '4px', fontFamily: 'Orbitron,sans-serif'
                                                }}>
                                                    {p.fit_type === 'OVERSIZED_FIT' ? 'OS' : 'NF'}
                                                </div>
                                            </div>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                                                <div>
                                                    <h3 className="font-orbitron neon-pink" style={{ fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '2px' }}>{p.name}</h3>
                                                    <p style={{ color: '#555', fontSize: '0.7rem' }}>{p.fit_type === 'OVERSIZED_FIT' ? 'Oversized' : 'Normal'} Fit</p>
                                                </div>
                                                <span className="neon-cyan" style={{ fontWeight: '900', fontSize: '0.95rem' }}>₹{p.price}</span>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </section>

                {/* ── COLOR PREVIEW ── */}
                <section style={{ width: '100%', padding: '60px 20px', background: 'rgba(255,255,255,0.02)', borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <div className="container">
                        <h2 className="font-orbitron neon-pink" style={{ fontSize: 'clamp(1.2rem, 4vw, 2rem)', fontWeight: 'bold', marginBottom: '40px', textAlign: 'center' }}>AVAILABLE <span style={{ color: 'inherit' }}>COLORS</span></h2>
                        <div className="grid grid-cols-4" style={{ gap: '16px' }}>
                            {['Black', 'White', 'Blue', 'Purple'].map((color) => {
                                const colorName = color === 'Blue' ? 'Skyblue' : color;
                                return (
                                    <Link key={color} to={`/customize?color=${color}`} style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                        <div className="glassmorphism" style={{ padding: '16px', borderRadius: '16px', width: '100%', aspectRatio: '1', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'var(--transition)' }}>
                                            <img src={`/assets/NORMAL_FIT/Normal_fit_${colorName}_frontside.png`} alt={`${color} T-Shirt`} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                                        </div>
                                        <span className="font-orbitron" style={{ fontSize: '0.8rem', letterSpacing: '2px', textTransform: 'uppercase', marginTop: '12px', color: '#ccc' }}>{color}</span>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                </section>

                {/* ── FIT TYPE ── */}
                <section style={{ width: '100%', padding: '60px 20px' }}>
                    <div className="container">
                        <h2 className="font-orbitron neon-cyan" style={{ fontSize: 'clamp(1.2rem, 4vw, 2rem)', fontWeight: 'bold', marginBottom: '40px', textAlign: 'center' }}>CHOOSE YOUR <span style={{ color: 'inherit' }}>FIT</span></h2>
                        <div className="grid grid-cols-2" style={{ gap: '24px', maxWidth: '800px', margin: '0 auto' }}>
                            {[
                                { label: 'Normal Fit', fit: 'NORMAL_FIT', price: '₹799', color: 'var(--neon-cyan)' },
                                { label: 'Oversized Fit', fit: 'OVERSIZED_FIT', price: '₹999', color: 'var(--neon-pink)' }
                            ].map(({ label, fit, price, color }) => (
                                <Link key={fit} to={`/customize?color=Black&fit=${fit}`} style={{ textDecoration: 'none' }}>
                                    <div className="glassmorphism" style={{ padding: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', border: `1px solid ${color}`, transition: 'var(--transition)', cursor: 'pointer' }}>
                                        <img src={`/assets/${fit}/${fit === 'OVERSIZED_FIT' ? 'Oversized_fit' : 'Normal_fit'}_Black_frontside.png`} alt={label} style={{ width: '60%', aspectRatio: '1', objectFit: 'contain' }} />
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

                {/* ── HOW TO USE CTA ── */}
                <section style={{ width: '100%', padding: '40px 20px 80px', textAlign: 'center' }}>
                    <div style={{
                        display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: '16px',
                        background: 'rgba(0,255,255,0.04)', border: '1px solid rgba(0,255,255,0.15)',
                        borderRadius: '20px', padding: '36px 48px',
                    }}>
                        <span style={{ fontSize: '2rem' }}>🧵</span>
                        <h3 className="font-orbitron" style={{ color: '#00ffff', fontSize: '1.1rem', fontWeight: '700', letterSpacing: '1px' }}>First time here?</h3>
                        <p style={{ color: '#666', fontSize: '0.9rem', maxWidth: '360px', lineHeight: 1.6 }}>
                            Follow our step-by-step guide to customize and order your first tee.
                        </p>
                        <Link to="/how-to-use" className="btn btn-cyan" style={{ padding: '12px 28px', fontSize: '0.8rem' }}>
                            HOW TO USE →
                        </Link>
                    </div>
                </section>

            </div>
        </>
    );
};

export default HomePage;

