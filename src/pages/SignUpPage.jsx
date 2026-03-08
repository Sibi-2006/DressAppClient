import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { UserPlus, Mail, Lock, User as UserIcon, Phone, MessageCircle } from 'lucide-react';
import toast from 'react-hot-toast';

import NeonLoader from '../components/NeonLoader';

const SignUpPage = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [whatsappNumber, setWhatsappNumber] = useState('');
    const [sameAsPhone, setSameAsPhone] = useState(true);
    const [isLoading, setIsLoading] = useState(false);

    const { register } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate Phone (10 digits)
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
                navigate('/');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
            <div className="glassmorphism auth-card">
                <UserPlus size={48} style={{ marginBottom: '32px', color: '#ccc' }} />
                <h1 className="font-orbitron neon-pink" style={{ fontSize: '1.8rem', fontWeight: 'bold', marginBottom: '8px', textAlign: 'center' }}>JOIN THE TRIBE</h1>
                <p style={{ color: '#666', marginBottom: '40px', textAlign: 'center' }}>Create your identity in the neon world.</p>

                <form onSubmit={handleSubmit} style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div style={{ position: 'relative' }}>
                        <UserIcon size={18} style={{ position: 'absolute', top: '50%', left: '16px', transform: 'translateY(-50%)', color: '#666' }} />
                        <input
                            type="text"
                            placeholder="Full Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            disabled={isLoading}
                            style={{
                                width: '100%', padding: '16px 16px 16px 48px', background: 'rgba(255,255,255,0.05)',
                                border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'white',
                                fontSize: '1rem', outline: 'none', opacity: isLoading ? 0.7 : 1
                            }}
                        />
                    </div>

                    <div style={{ position: 'relative' }}>
                        <Mail size={18} style={{ position: 'absolute', top: '50%', left: '16px', transform: 'translateY(-50%)', color: '#666' }} />
                        <input
                            type="email"
                            placeholder="Email Address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            disabled={isLoading}
                            style={{
                                width: '100%', padding: '16px 16px 16px 48px', background: 'rgba(255,255,255,0.05)',
                                border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'white',
                                fontSize: '1rem', outline: 'none', opacity: isLoading ? 0.7 : 1
                            }}
                        />
                    </div>

                    <div style={{ position: 'relative' }}>
                        <Lock size={18} style={{ position: 'absolute', top: '50%', left: '16px', transform: 'translateY(-50%)', color: '#666' }} />
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            disabled={isLoading}
                            style={{
                                width: '100%', padding: '16px 16px 16px 48px', background: 'rgba(255,255,255,0.05)',
                                border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'white',
                                fontSize: '1rem', outline: 'none', opacity: isLoading ? 0.7 : 1
                            }}
                        />
                    </div>

                    <div style={{ position: 'relative' }}>
                        <Phone size={18} style={{ position: 'absolute', top: '50%', left: '16px', transform: 'translateY(-50%)', color: '#666' }} />
                        <span style={{ position: 'absolute', top: '50%', left: '46px', transform: 'translateY(-50%)', color: '#ccc', fontSize: '1rem' }}>+91</span>
                        <input
                            type="tel"
                            placeholder="Phone Number (10 digits)"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, '').substring(0, 10))}
                            required
                            disabled={isLoading}
                            style={{
                                width: '100%', padding: '16px 16px 16px 85px', background: 'rgba(255,255,255,0.05)',
                                border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'white',
                                fontSize: '1rem', outline: 'none', opacity: isLoading ? 0.7 : 1
                            }}
                        />
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <input
                            type="checkbox"
                            id="samePhone"
                            checked={sameAsPhone}
                            disabled={isLoading}
                            onChange={(e) => setSameAsPhone(e.target.checked)}
                            style={{ width: '18px', height: '18px', accentColor: 'var(--neon-pink)', cursor: 'pointer' }}
                        />
                        <label htmlFor="samePhone" style={{ color: '#ccc', fontSize: '0.9rem', cursor: 'pointer' }}>
                            My WhatsApp number is same as phone number
                        </label>
                    </div>

                    {!sameAsPhone && (
                        <div style={{ position: 'relative' }}>
                            <MessageCircle size={18} style={{ position: 'absolute', top: '50%', left: '16px', transform: 'translateY(-50%)', color: '#25D366' }} />
                            <span style={{ position: 'absolute', top: '50%', left: '46px', transform: 'translateY(-50%)', color: '#ccc', fontSize: '1rem' }}>+91</span>
                            <input
                                type="tel"
                                placeholder="WhatsApp Number"
                                value={whatsappNumber}
                                onChange={(e) => setWhatsappNumber(e.target.value.replace(/\D/g, '').substring(0, 10))}
                                required={!sameAsPhone}
                                disabled={isLoading}
                                style={{
                                    width: '100%', padding: '16px 16px 16px 85px', background: 'rgba(255,255,255,0.05)',
                                    border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'white',
                                    fontSize: '1rem', outline: 'none', opacity: isLoading ? 0.7 : 1
                                }}
                            />
                        </div>
                    )}

                    <button
                        type="submit"
                        className="btn btn-pink"
                        disabled={isLoading}
                        style={{
                            width: '100%',
                            marginTop: '16px',
                            opacity: isLoading ? 0.7 : 1,
                            cursor: isLoading ? 'not-allowed' : 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '10px'
                        }}
                    >
                        {isLoading ? <NeonLoader variant="spinner" /> : null}
                        {isLoading ? 'JOINING...' : 'Sign Up'}
                    </button>

                    <p style={{ textAlign: 'center', color: '#666', marginTop: '24px' }}>
                        Already have an account? <Link to="/login" className="text-neon-cyan" style={{ fontWeight: 'bold', textDecoration: 'none' }}>Log in here</Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default SignUpPage;
