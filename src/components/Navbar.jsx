import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Menu, X, User as UserIcon } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const { cartItems } = useContext(CartContext);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <nav className="glassmorphism" style={{
            position: 'sticky', top: 0, zIndex: 1000,
            height: '80px', display: 'flex', alignItems: 'center',
            borderBottom: '1px solid rgba(255,255,255,0.05)',
            boxShadow: '0 4px 30px rgba(0,0,0,0.5)'
        }}>
            <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                <Link to="/" style={{ textDecoration: 'none' }} onClick={() => setIsMenuOpen(false)}>
                    <div className="logo-neon">
                        <span className="neon-part">NEON</span>
                        <span className="threads-part">THREADS</span>
                    </div>
                </Link>

                {/* Desktop Menu */}
                <div className="flex hide-mobile" style={{ gap: '32px' }}>
                    <Link to="/shop" style={{ color: '#ccc', textDecoration: 'none', fontWeight: 'bold', textTransform: 'uppercase', fontSize: '0.9rem' }}>Shop</Link>
                    <Link to="/customize" style={{ color: '#ccc', textDecoration: 'none', fontWeight: 'bold', textTransform: 'uppercase', fontSize: '0.9rem' }}>Customize</Link>
                    {user && <Link to="/my-orders" style={{ color: '#ccc', textDecoration: 'none', fontWeight: 'bold', textTransform: 'uppercase', fontSize: '0.9rem' }}>My Orders</Link>}
                    {user && user.role === 'admin' && (
                        <>
                            <Link to="/admin/dashboard" style={{ color: 'var(--neon-pink)', textDecoration: 'none', fontWeight: 'bold', textTransform: 'uppercase', fontSize: '0.9rem' }}>Dashboard</Link>
                            <Link to="/admin/orders" style={{ color: 'var(--neon-pink)', textDecoration: 'none', fontWeight: 'bold', textTransform: 'uppercase', fontSize: '0.9rem' }}>Orders</Link>
                            <Link to="/admin/settings/notifications" style={{ color: 'var(--neon-pink)', textDecoration: 'none', fontWeight: 'bold', textTransform: 'uppercase', fontSize: '0.9rem' }}>Config</Link>
                        </>
                    )}
                </div>

                <div className="flex items-center" style={{ gap: '24px' }}>
                    <Link to="/cart" style={{ position: 'relative', color: '#ccc' }} onClick={() => setIsMenuOpen(false)}>
                        <ShoppingCart size={24} />
                        {cartItems.length > 0 && (
                            <span style={{
                                position: 'absolute', top: '-8px', right: '-8px',
                                background: 'var(--neon-pink)', color: 'var(--dark-bg)',
                                borderRadius: '50%', width: '18px', height: '18px',
                                fontSize: '0.7rem', display: 'flex', alignItems: 'center',
                                justifyContent: 'center', fontWeight: 'bold',
                                boxShadow: 'var(--shadow-pink)'
                            }}>
                                {cartItems.length}
                            </span>
                        )}
                    </Link>

                    {/* Desktop Auth */}
                    <div className="hide-mobile">
                        {user ? (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <UserIcon size={24} />
                                <span style={{ fontWeight: 'bold' }}>{user.name}</span>
                                <button onClick={handleLogout} className="btn-outline-purple" style={{ padding: '10px 26px', fontSize: '0.9rem', borderRadius: '50px', fontWeight: 'bold' }}>Logout</button>
                            </div>
                        ) : (
                            <div style={{ display: 'flex', gap: '12px' }}>
                                <Link to="/login?tab=signin" style={{
                                    border: '1px solid #00ffff',
                                    color: '#00ffff',
                                    background: 'transparent',
                                    padding: '8px 20px',
                                    borderRadius: '8px',
                                    textDecoration: 'none',
                                    fontWeight: 'bold',
                                    fontSize: '0.85rem'
                                }}>Sign In</Link>
                                <Link to="/login?tab=signup" style={{
                                    background: '#00ffff',
                                    color: '#0a0a0a',
                                    padding: '8px 20px',
                                    borderRadius: '8px',
                                    textDecoration: 'none',
                                    fontWeight: '700',
                                    fontSize: '0.85rem'
                                }}>Sign Up</Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile Menu Toggle */}
                    <button
                        className="show-mobile"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        style={{ background: 'transparent', border: 'none', color: 'white', cursor: 'pointer' }}
                    >
                        {isMenuOpen ? <X size={32} /> : <Menu size={32} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu Content */}
            {/* Mobile Menu Overlay / Sidebar */}
            {isMenuOpen && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
                    background: 'rgba(0,0,0,0.8)', zIndex: 1001,
                    display: 'flex', justifyContent: 'flex-end',
                    backdropFilter: 'blur(5px)', transition: 'all 0.3s ease'
                }} onClick={() => setIsMenuOpen(false)}>

                    <div style={{
                        width: '80%', maxWidth: '350px', height: '100%',
                        background: 'var(--dark-bg)', borderLeft: '1px solid rgba(255,255,255,0.1)',
                        display: 'flex', flexDirection: 'column', padding: '30px 20px', gap: '25px',
                        boxShadow: '-10px 0 30px rgba(0,0,0,0.5)',
                        animation: 'slideInRight 0.3s forwards', position: 'relative'
                    }} onClick={e => e.stopPropagation()}>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                            <div className="logo-neon" style={{ fontSize: '1.2rem' }}>
                                <span className="neon-part">NEON</span>
                                <span className="threads-part">THREADS</span>
                            </div>
                            <button onClick={() => setIsMenuOpen(false)} style={{ background: 'none', border: 'none', color: '#ccc' }}>
                                <X size={28} />
                            </button>
                        </div>

                        <Link to="/shop" onClick={() => setIsMenuOpen(false)} style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold', fontSize: '1.2rem', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>SHOP</Link>
                        <Link to="/customize" onClick={() => setIsMenuOpen(false)} style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold', fontSize: '1.2rem', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>CUSTOMIZE</Link>
                        {user && <Link to="/my-orders" onClick={() => setIsMenuOpen(false)} style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold', fontSize: '1.2rem', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>MY ORDERS</Link>}
                        {user && user.role === 'admin' && (
                            <>
                                <Link to="/admin/dashboard" onClick={() => setIsMenuOpen(false)} style={{ color: 'var(--neon-pink)', textDecoration: 'none', fontWeight: 'bold', fontSize: '1.2rem', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>DASHBOARD</Link>
                                <Link to="/admin/orders" onClick={() => setIsMenuOpen(false)} style={{ color: 'var(--neon-pink)', textDecoration: 'none', fontWeight: 'bold', fontSize: '1.2rem', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>ORDERS</Link>
                                <Link to="/admin/settings/notifications" onClick={() => setIsMenuOpen(false)} style={{ color: 'var(--neon-pink)', textDecoration: 'none', fontWeight: 'bold', fontSize: '1.2rem', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>CONFIG</Link>
                            </>
                        )}

                        <div style={{ marginTop: 'auto', paddingTop: '20px' }}>
                            {user ? (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#ccc' }}>
                                        <UserIcon size={24} />
                                        <span style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{user.name}</span>
                                    </div>
                                    <button onClick={handleLogout} className="btn-outline-purple btn-mobile-full" style={{ padding: '12px', borderRadius: '50px' }}>LOGOUT</button>
                                </div>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                    <Link to="/login?tab=signin" onClick={() => setIsMenuOpen(false)} style={{
                                        textAlign: 'center',
                                        width: '100%',
                                        border: '1px solid #00ffff',
                                        color: '#00ffff',
                                        background: 'transparent',
                                        padding: '12px',
                                        borderRadius: '8px',
                                        textDecoration: 'none',
                                        fontWeight: 'bold',
                                        fontSize: '0.9rem'
                                    }}>Sign In</Link>
                                    <Link to="/login?tab=signup" onClick={() => setIsMenuOpen(false)} style={{
                                        textAlign: 'center',
                                        width: '100%',
                                        background: '#00ffff',
                                        color: '#0a0a0a',
                                        padding: '12px',
                                        borderRadius: '8px',
                                        textDecoration: 'none',
                                        fontWeight: '700',
                                        fontSize: '0.9rem'
                                    }}>Sign Up</Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
