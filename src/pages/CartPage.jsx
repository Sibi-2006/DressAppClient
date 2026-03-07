import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { CartContext } from '../context/CartContext';

const TShirtMini = ({ color, artwork, images, fit_type, side }) => {
    const colorName = color === 'Blue' ? 'Skyblue' : color;
    const fitPrefix = fit_type === 'OVERSIZED_FIT' ? 'Oversized_fit' : 'Normal_fit';
    const sideName = (side || 'front').toLowerCase() === 'front' ? 'frontside' : 'backside';
    const imagePath = `/assets/${fit_type || 'NORMAL_FIT'}/${fitPrefix}_${colorName}_${sideName}.png`;

    return (
        <div style={{ position: 'relative', width: '60px', height: '80px' }}>
            <img
                src={imagePath}
                alt="shirt"
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                onError={(e) => { e.target.src = '/vite.svg'; }}
            />
            {/* Render Multiple Images */}
            {images && images.length > 0 ? (
                images.map(img => (
                    <img
                        key={img.id}
                        src={img.url}
                        alt="design"
                        style={{
                            position: 'absolute',
                            left: `${img.position.x}%`,
                            top: `${img.position.y}%`,
                            width: `${img.size.w}%`,
                            height: `${img.size.h}%`,
                            transform: 'translate(-50%, -50%)',
                            objectFit: 'contain', pointerEvents: 'none'
                        }}
                    />
                ))
            ) : (
                artwork && artwork !== '/tshirt-fallback.png' && (
                    <img
                        src={artwork}
                        alt="design"
                        style={{
                            position: 'absolute', top: '55%', left: '50%', transform: 'translate(-50%, -50%)',
                            width: '24px', height: '32px', objectFit: 'contain', pointerEvents: 'none'
                        }}
                    />
                )
            )}
        </div>
    );
};

const CartPage = () => {
    const { cartItems, removeFromCart, updateQuantity, getCartTotal } = useContext(CartContext);
    const navigate = useNavigate();

    if (cartItems.length === 0) {
        return (
            <div className="container" style={{ padding: '80px 20px', textAlign: 'center' }}>
                <ShoppingBag size={80} style={{ color: 'var(--neon-pink)', marginBottom: '32px', opacity: 0.5 }} />
                <h1 className="font-orbitron neon-pink" style={{ fontSize: '2rem', marginBottom: '24px' }}>YOUR CART IS EMPTY</h1>
                <p style={{ color: '#999', marginBottom: '48px' }}>Start designing your unique threads to see them here.</p>
                <Link to="/customize" className="btn btn-cyan">Go To Editor</Link>
            </div>
        );
    }

    return (
        <div className="container" style={{ padding: '64px 20px' }}>
            <h1 className="font-orbitron neon-cyan" style={{ fontSize: '2.5rem', marginBottom: '48px' }}>SHOPPING <span className="neon-pink">CART</span></h1>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '32px' }} className="flex-mobile-col">
                {/* Items List */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {cartItems.map(item => (
                        <div key={item._id} className="glassmorphism flex-mobile-col" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '24px' }}>
                            <div style={{ width: '100px', height: '120px', background: '#1a1a1a', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                <TShirtMini color={item.color} artwork={item.image} images={item.side === 'front' ? item.front_images : item.back_images} fit_type={item.fit_type} side={item.side} />
                            </div>

                            <div style={{ flex: 1, width: '100%' }}>
                                <h3 className="font-orbitron" style={{ fontSize: '1.1rem', marginBottom: '8px' }}>{item.name}</h3>
                                <div className="flex" style={{ gap: '16px', color: '#666', fontSize: '0.8rem', textTransform: 'uppercase', flexWrap: 'wrap' }}>
                                    <span>Color: <span className="text-neon-cyan">{item.color}</span></span>
                                    <span>Fit: <span className="text-neon-green">{item.fit_type === 'OVERSIZED_FIT' ? 'Oversized' : 'Normal'}</span></span>
                                    <span>Size: <span className="text-neon-pink">{item.size}</span></span>
                                    <span>Side: <span className="text-neon-purple">{item.side}</span></span>
                                </div>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', justifyContent: 'space-between', width: '100%', maxWidth: '200px' }}>
                                <div style={{ display: 'flex', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '4px' }}>
                                    <button
                                        onClick={() => updateQuantity(item._id, item.quantity - 1)}
                                        style={{ padding: '4px 12px', background: 'transparent', border: 'none', color: 'white', cursor: 'pointer' }}
                                    >-</button>
                                    <span style={{ padding: '4px 12px', borderLeft: '1px solid rgba(255,255,255,0.1)', borderRight: '1px solid rgba(255,255,255,0.1)' }}>{item.quantity}</span>
                                    <button
                                        onClick={() => updateQuantity(item._id, item.quantity + 1)}
                                        style={{ padding: '4px 12px', background: 'transparent', border: 'none', color: 'white', cursor: 'pointer' }}
                                    >+</button>
                                </div>
                                <Trash2
                                    className="text-neon-pink"
                                    style={{ cursor: 'pointer', transition: 'var(--transition)' }}
                                    size={20}
                                    onClick={() => removeFromCart(item._id)}
                                />
                            </div>

                            <div style={{ width: '80px', textAlign: 'right', fontWeight: 'bold' }} className="text-neon-cyan hide-mobile">
                                ${(item.price * item.quantity).toFixed(2)}
                            </div>
                            <div className="show-mobile" style={{ width: '100%', justifyContent: 'flex-end', fontWeight: 'bold', fontSize: '1.2rem' }}>
                                <span className="text-neon-cyan">${(item.price * item.quantity).toFixed(2)}</span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Summary */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    <div className="glassmorphism" style={{ padding: '32px' }}>
                        <h3 className="font-orbitron" style={{ marginBottom: '24px', fontSize: '1.2rem' }}>SUMMARY</h3>

                        <div className="flex justify-between" style={{ marginBottom: '12px' }}>
                            <span style={{ color: '#999' }}>Subtotal</span>
                            <span>${getCartTotal().toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between" style={{ marginBottom: '12px' }}>
                            <span style={{ color: '#999' }}>Shipping</span>
                            <span className="text-neon-green">FREE</span>
                        </div>

                        <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', margin: '20px 0', paddingTop: '20px' }} className="flex justify-between">
                            <span className="font-orbitron" style={{ fontSize: '1.2rem' }}>TOTAL</span>
                            <span className="neon-cyan" style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>${getCartTotal().toFixed(2)}</span>
                        </div>

                        <button
                            className="btn btn-cyan"
                            style={{ width: '100%', marginTop: '24px' }}
                            onClick={() => navigate('/checkout')}
                        >
                            Checkout <ArrowRight size={20} style={{ marginLeft: '12px' }} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartPage;
