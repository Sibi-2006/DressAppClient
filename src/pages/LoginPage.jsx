import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { LogIn, UserPlus, Mail, Lock, User as UserIcon, Phone, MessageCircle, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import NeonLoader from '../components/NeonLoader';

const LoginPage = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { login, register } = useContext(AuthContext);

    // Tab Logic
    const initialTab = searchParams.get('tab') || 'signin';
    const [activeTab, setActiveTab] = useState(initialTab);
    const [isLoading, setIsLoading] = useState(false);

    // Redirect Logic
    const redirectPath = sessionStorage.getItem('redirectAfterLogin');

    // Sign In State
    const [loginEmail, setLoginEmail] = useState('');
    const [loginPassword, setLoginPassword] = useState('');

    // Sign Up State
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [whatsappNumber, setWhatsappNumber] = useState('');
    const [sameAsPhone, setSameAsPhone] = useState(true);

    useEffect(() => {
        const tab = searchParams.get('tab');
        if (tab === 'signin' || tab === 'signup') {
            setActiveTab(tab);
        }
    }, [searchParams]);

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const success = await login(loginEmail, loginPassword);
            if (success) {
                const redirectTo = sessionStorage.getItem('redirectAfterLogin') || '/';
                sessionStorage.removeItem('redirectAfterLogin');
                navigate(redirectTo);
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleRegisterSubmit = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }

        const phoneRegex = /^[0-9]{10}$/;
        if (!phoneRegex.test(phoneNumber)) {
            toast.error('Invalid Phone Number. Must be 10 digits.');
            return;
        }

        const finalWhatsapp = sameAsPhone ? phoneNumber : whatsappNumber;
        if (!sameAsPhone && !phoneRegex.test(finalWhatsapp)) {
            toast.error('Invalid WhatsApp Number. Must be 10 digits.');
            return;
        }

        setIsLoading(true);
        try {
            const success = await register(name, email, password, phoneNumber, finalWhatsapp);
            if (success) {
                const redirectTo = sessionStorage.getItem('redirectAfterLogin') || '/';
                sessionStorage.removeItem('redirectAfterLogin');
                navigate(redirectTo);
            }
        } finally {
            setIsLoading(false);
        }
    };

    const tabButtonStyle = (tabName) => ({
        flex: 1,
        padding: '12px',
        background: 'transparent',
        border: 'none',
        color: activeTab === tabName ? '#00ffff' : '#888',
        borderBottom: activeTab === tabName ? '2px solid #00ffff' : '2px solid transparent',
        fontSize: '14px',
        fontWeight: '700',
        letterSpacing: '2px',
        cursor: 'pointer',
        transition: 'all-color 0.2s ease',
        fontFamily: 'Orbitron, sans-serif'
    });

    return (
        <div className="container" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>
            <div className="glassmorphism auth-card" style={{ width: '100%', maxWidth: '450px', padding: '30px' }}>

                {/* Info Message for Redirects */}
                {redirectPath === '/customize' && activeTab === 'signin' && (
                    <div style={{
                        background: 'rgba(0, 255, 245, 0.05)',
                        border: '1px solid rgba(0, 255, 245, 0.2)',
                        padding: '12px',
                        borderRadius: '8px',
                        color: 'var(--neon-cyan)',
                        fontSize: '0.85rem',
                        marginBottom: '20px',
                        textAlign: 'center',
                        fontWeight: 'bold'
                    }}>
                        Please sign in to customize your t-shirt 👕
                    </div>
                )}

                {/* Tabs */}
                <div style={{ display: 'flex', borderBottom: '1px solid rgba(255,255,255,0.05)', marginBottom: '32px' }}>
                    <button onClick={() => setActiveTab('signin')} style={tabButtonStyle('signin')}>SIGN IN</button>
                    <button onClick={() => setActiveTab('signup')} style={tabButtonStyle('signup')}>SIGN UP</button>
                </div>

                {activeTab === 'signin' ? (
                    <div style={{ animation: 'fadeIn 0.3s ease-in' }}>
                        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                            <LogIn size={40} style={{ color: '#00ffff', marginBottom: '16px' }} />
                            <h2 className="font-orbitron neon-cyan" style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>ACCESS GRANTED</h2>
                            <p style={{ color: '#666', fontSize: '0.85rem', marginTop: '4px' }}>Welcome back to the neon dimension.</p>
                        </div>

                        <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <div style={{ position: 'relative' }}>
                                <Mail size={18} style={{ position: 'absolute', top: '50%', left: '16px', transform: 'translateY(-50%)', color: '#666' }} />
                                <input
                                    type="email" placeholder="Email Address" value={loginEmail}
                                    onChange={(e) => setLoginEmail(e.target.value)} required disabled={isLoading}
                                    className="auth-input-field"
                                    style={{
                                        width: '100%', padding: '16px 16px 16px 48px', background: 'rgba(255,255,255,0.05)',
                                        border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'white',
                                        fontSize: '1rem', outline: 'none'
                                    }}
                                />
                            </div>

                            <div style={{ position: 'relative' }}>
                                <Lock size={18} style={{ position: 'absolute', top: '50%', left: '16px', transform: 'translateY(-50%)', color: '#666' }} />
                                <input
                                    type="password" placeholder="Password" value={loginPassword}
                                    onChange={(e) => setLoginPassword(e.target.value)} required disabled={isLoading}
                                    style={{
                                        width: '100%', padding: '16px 16px 16px 48px', background: 'rgba(255,255,255,0.05)',
                                        border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'white',
                                        fontSize: '1rem', outline: 'none'
                                    }}
                                />
                            </div>

                            <div style={{ textAlign: 'right', marginTop: '-10px' }}>
                                <span style={{ color: '#666', fontSize: '0.8rem', cursor: 'pointer', fontWeight: 'bold' }}>Forgot Password?</span>
                            </div>

                            <button type="submit" className="btn btn-cyan" disabled={isLoading} style={{ width: '100%', padding: '14px', marginTop: '10px' }}>
                                {isLoading ? <NeonLoader variant="spinner" /> : null}
                                {isLoading ? 'AUTHORIZING...' : 'SIGN IN'}
                            </button>

                            <p style={{ textAlign: 'center', color: '#666', marginTop: '16px', fontSize: '0.9rem' }}>
                                New to the grid? <span onClick={() => setActiveTab('signup')} style={{ color: 'var(--neon-pink)', fontWeight: 'bold', cursor: 'pointer' }}>Create Profile</span>
                            </p>
                        </form>
                    </div>
                ) : (
                    <div style={{ animation: 'fadeIn 0.3s ease-in' }}>
                        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                            <UserPlus size={40} style={{ color: 'var(--neon-pink)', marginBottom: '16px' }} />
                            <h2 className="font-orbitron neon-pink" style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>JOIN THE TRIBE</h2>
                            <p style={{ color: '#666', fontSize: '0.85rem', marginTop: '4px' }}>Establish your digital presence.</p>
                        </div>

                        <form onSubmit={handleRegisterSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div style={{ position: 'relative' }}>
                                <UserIcon size={18} style={{ position: 'absolute', top: '50%', left: '16px', transform: 'translateY(-50%)', color: '#666' }} />
                                <input
                                    type="text" placeholder="Full Name" value={name}
                                    onChange={(e) => setName(e.target.value)} required disabled={isLoading}
                                    style={{
                                        width: '100%', padding: '12px 12px 12px 48px', background: 'rgba(255,255,255,0.05)',
                                        border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'white',
                                        fontSize: '0.95rem', outline: 'none'
                                    }}
                                />
                            </div>

                            <div style={{ position: 'relative' }}>
                                <Mail size={18} style={{ position: 'absolute', top: '50%', left: '16px', transform: 'translateY(-50%)', color: '#666' }} />
                                <input
                                    type="email" placeholder="Email Address" value={email}
                                    onChange={(e) => setEmail(e.target.value)} required disabled={isLoading}
                                    style={{
                                        width: '100%', padding: '12px 12px 12px 48px', background: 'rgba(255,255,255,0.05)',
                                        border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'white',
                                        fontSize: '0.95rem', outline: 'none'
                                    }}
                                />
                            </div>

                            <div style={{ position: 'relative' }}>
                                <Phone size={18} style={{ position: 'absolute', top: '50%', left: '16px', transform: 'translateY(-50%)', color: '#666' }} />
                                <span style={{ position: 'absolute', top: '50%', left: '46px', transform: 'translateY(-50%)', color: '#999', fontSize: '0.9rem' }}>+91</span>
                                <input
                                    type="tel" placeholder="Phone (10 digits)" value={phoneNumber}
                                    onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, '').substring(0, 10))}
                                    required disabled={isLoading}
                                    style={{
                                        width: '100%', padding: '12px 12px 12px 85px', background: 'rgba(255,255,255,0.05)',
                                        border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'white',
                                        fontSize: '0.95rem', outline: 'none'
                                    }}
                                />
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <input
                                    type="checkbox" id="samePhone" checked={sameAsPhone}
                                    onChange={(e) => setSameAsPhone(e.target.checked)} disabled={isLoading}
                                    style={{ width: '16px', height: '16px', accentColor: 'var(--neon-pink)', cursor: 'pointer' }}
                                />
                                <label htmlFor="samePhone" style={{ color: '#999', fontSize: '0.75rem', cursor: 'pointer' }}>WhatsApp same as phone</label>
                            </div>

                            {!sameAsPhone && (
                                <div style={{ position: 'relative' }}>
                                    <MessageCircle size={18} style={{ position: 'absolute', top: '50%', left: '16px', transform: 'translateY(-50%)', color: '#25D366' }} />
                                    <span style={{ position: 'absolute', top: '50%', left: '46px', transform: 'translateY(-50%)', color: '#999', fontSize: '0.9rem' }}>+91</span>
                                    <input
                                        type="tel" placeholder="WhatsApp (10 digits)" value={whatsappNumber}
                                        onChange={(e) => setWhatsappNumber(e.target.value.replace(/\D/g, '').substring(0, 10))}
                                        required={!sameAsPhone} disabled={isLoading}
                                        style={{
                                            width: '100%', padding: '12px 12px 12px 85px', background: 'rgba(255,255,255,0.05)',
                                            border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'white',
                                            fontSize: '0.95rem', outline: 'none'
                                        }}
                                    />
                                </div>
                            )}

                            <div style={{ position: 'relative' }}>
                                <Lock size={18} style={{ position: 'absolute', top: '50%', left: '16px', transform: 'translateY(-50%)', color: '#666' }} />
                                <input
                                    type="password" placeholder="Password" value={password}
                                    onChange={(e) => setPassword(e.target.value)} required disabled={isLoading}
                                    style={{
                                        width: '100%', padding: '12px 12px 12px 48px', background: 'rgba(255,255,255,0.05)',
                                        border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'white',
                                        fontSize: '0.95rem', outline: 'none'
                                    }}
                                />
                            </div>

                            <div style={{ position: 'relative' }}>
                                <Lock size={18} style={{ position: 'absolute', top: '50%', left: '16px', transform: 'translateY(-50%)', color: '#666' }} />
                                <input
                                    type="password" placeholder="Confirm Password" value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)} required disabled={isLoading}
                                    style={{
                                        width: '100%', padding: '12px 12px 12px 48px', background: 'rgba(255,255,255,0.05)',
                                        border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'white',
                                        fontSize: '0.95rem', outline: 'none'
                                    }}
                                />
                            </div>

                            <button type="submit" className="btn btn-pink" disabled={isLoading} style={{ width: '100%', padding: '14px', marginTop: '10px' }}>
                                {isLoading ? <NeonLoader variant="spinner" /> : null}
                                {isLoading ? 'INITIALIZING...' : 'SIGN UP'}
                            </button>

                            <p style={{ textAlign: 'center', color: '#666', marginTop: '16px', fontSize: '0.9rem' }}>
                                Already encoded? <span onClick={() => setActiveTab('signin')} style={{ color: '#00ffff', fontWeight: 'bold', cursor: 'pointer' }}>Sign In here</span>
                            </p>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
};

export default LoginPage;
