import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Star, ArrowRight, Filter } from 'lucide-react';
import api from '../utils/api';

const ShopPage = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeFit, setActiveFit] = useState('ALL');

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const { data } = await api.get('/products');
                setProducts(data);
            } catch (error) {
                console.error('Error fetching products', error);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    const getImagePath = (product) => {
        // New structure support
        if (product.images && product.colors && product.colors.length > 0) {
            const firstColor = product.colors[0];
            const colorData = product.images[firstColor];
            if (colorData && colorData.front) return colorData.front;
        }

        // Fallback or old structure support
        const colorToUse = product.color || (product.colors && product.colors[0]) || 'Black';
        const colorName = colorToUse === 'Blue' ? 'Skyblue' : colorToUse;
        const fitPrefix = product.fit_type === 'OVERSIZED_FIT' ? 'Oversized_fit' : 'Normal_fit';
        return `/assets/${product.fit_type}/${fitPrefix}_${colorName}_frontside.png`;
    };

    const filteredProducts = activeFit === 'ALL'
        ? products
        : products.filter(p => p.fit_type === activeFit);

    if (loading) return <div className="container" style={{ padding: '80px', textAlign: 'center' }}>Loading Shop...</div>;

    return (
        <div className="container" style={{ padding: '40px 15px' }}>
            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                <h1 className="font-orbitron neon-cyan" style={{ fontSize: 'clamp(1.5rem, 6vw, 3rem)', fontWeight: 'bold' }}>
                    CURATED <span style={{ color: 'inherit' }}>CANVAS</span>
                </h1>
                <p style={{ color: '#666', marginTop: '12px', fontSize: '1rem' }}>Pick your base and enter the neon dimension.</p>
            </div>

            {/* Fit Type Filter */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginBottom: '40px', flexWrap: 'wrap' }}>
                {[
                    { id: 'ALL', label: 'All Styles' },
                    { id: 'NORMAL_FIT', label: 'Normal Fit' },
                    { id: 'OVERSIZED_FIT', label: 'Oversized Fit' }
                ].map(f => (
                    <button
                        key={f.id}
                        onClick={() => setActiveFit(f.id)}
                        style={{
                            padding: '10px 24px', borderRadius: '25px', cursor: 'pointer', fontWeight: 'bold',
                            fontSize: '0.85rem', fontFamily: 'Orbitron, sans-serif', letterSpacing: '1px',
                            background: activeFit === f.id ? 'var(--neon-cyan)' : 'transparent',
                            color: activeFit === f.id ? 'var(--dark-bg)' : 'white',
                            border: `1px solid ${activeFit === f.id ? 'var(--neon-cyan)' : 'rgba(255,255,255,0.2)'}`,
                            transition: 'all 0.3s'
                        }}
                    >
                        {f.label}
                    </button>
                ))}
            </div>

            {filteredProducts.length === 0 ? (
                <div className="glassmorphism" style={{ padding: '60px', textAlign: 'center' }}>
                    <h3 className="font-orbitron" style={{ color: '#666' }}>No products found.</h3>
                </div>
            ) : (
                <div className="grid grid-cols-4 tablet-col" style={{ gap: '20px' }}>
                    {filteredProducts.map((p, idx) => (
                        <Link
                            key={`${p._id || idx}`}
                            to={`/customize?color=${p.color || (p.colors && p.colors[0]) || 'black'}&fit=${p.fit_type}`}
                            className="glassmorphism"
                            style={{
                                padding: '20px', textDecoration: 'none', color: 'white',
                                transition: 'var(--transition)', display: 'flex', flexDirection: 'column'
                            }}
                        >
                            <div style={{
                                width: '100%', aspectRatio: '3/4', background: '#0f0f0f', borderRadius: '12px',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px',
                                position: 'relative', overflow: 'hidden', padding: '12px'
                            }}>
                                <img
                                    src={getImagePath(p)}
                                    alt={p.name}
                                    style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                                    onError={(e) => { e.target.style.opacity = '0.3'; }}
                                />
                                <div style={{
                                    position: 'absolute', top: '10px', right: '10px',
                                    background: p.fit_type === 'OVERSIZED_FIT' ? 'var(--neon-pink)' : 'var(--neon-cyan)',
                                    color: 'var(--dark-bg)', fontSize: '0.6rem', fontWeight: 'bold',
                                    padding: '3px 8px', borderRadius: '4px', fontFamily: 'Orbitron, sans-serif'
                                }}>
                                    {p.fit_type === 'OVERSIZED_FIT' ? 'OVERSIZED' : 'NORMAL'}
                                </div>
                                {p.in_stock !== false && (
                                    <div style={{
                                        position: 'absolute', bottom: '10px', left: '10px',
                                        background: 'var(--neon-green)', color: 'var(--dark-bg)',
                                        fontSize: '0.6rem', fontWeight: 'bold', padding: '3px 8px', borderRadius: '4px'
                                    }}>
                                        IN STOCK
                                    </div>
                                )}
                            </div>

                            <div className="flex justify-between" style={{ alignItems: 'flex-start', marginBottom: '8px' }}>
                                <div>
                                    <h3 className="font-orbitron neon-pink" style={{ fontSize: '0.95rem', fontWeight: 'bold' }}>
                                        {p.name}
                                    </h3>
                                    <p style={{ fontSize: '0.75rem', color: '#666', marginTop: '2px' }}>
                                        {p.fit_type === 'OVERSIZED_FIT' ? 'Oversized Fit' : 'Normal Fit'}
                                    </p>
                                    <div style={{ display: 'flex', gap: '2px', marginTop: '4px' }}>
                                        {[1, 2, 3, 4, 5].map(i => <Star key={i} size={10} style={{ fill: 'var(--neon-cyan)', color: 'var(--neon-cyan)' }} />)}
                                    </div>
                                </div>
                                <span className="text-neon-cyan" style={{ fontWeight: 'bold', fontSize: '1rem' }}>
                                    ₹{p.price}
                                </span>
                            </div>
                            <button className="btn btn-cyan" style={{ marginTop: 'auto', width: '100%', padding: '10px', fontSize: '0.8rem' }}>
                                Customize <ArrowRight size={14} style={{ marginLeft: '6px' }} />
                            </button>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ShopPage;
