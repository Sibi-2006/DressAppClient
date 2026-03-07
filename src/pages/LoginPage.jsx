import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { LogIn, Mail, Lock, User as UserIcon } from 'lucide-react';
import toast from 'react-hot-toast';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const success = await login(email, password);
        if (success) {
            navigate('/');
        }
    };

    return (
        <div className="container" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
            <div className="glassmorphism auth-card">
                <LogIn size={48} style={{ marginBottom: '32px', color: '#ccc' }} />
                <h1 className="font-orbitron neon-cyan" style={{ fontSize: '1.8rem', fontWeight: 'bold', marginBottom: '8px', textAlign: 'center' }}>WELCOME BACK</h1>
                <p style={{ color: '#666', marginBottom: '40px', textAlign: 'center' }}>Enter your credentials to access your stash.</p>

                <form onSubmit={handleSubmit} style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    <div style={{ position: 'relative' }}>
                        <Mail size={18} style={{ position: 'absolute', top: '50%', left: '16px', transform: 'translateY(-50%)', color: '#666' }} />
                        <input
                            type="email"
                            placeholder="Email Address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            style={{
                                width: '100%', padding: '16px 16px 16px 48px', background: 'rgba(255,255,255,0.05)',
                                border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'white',
                                fontSize: '1rem', outline: 'none', transition: 'var(--transition)'
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
                            style={{
                                width: '100%', padding: '16px 16px 16px 48px', background: 'rgba(255,255,255,0.05)',
                                border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'white',
                                fontSize: '1rem', outline: 'none', transition: 'var(--transition)'
                            }}
                        />
                    </div>

                    <button className="btn btn-cyan" style={{ width: '100%', marginTop: '16px' }}>Sign In</button>

                    <p style={{ textAlign: 'center', color: '#666', marginTop: '24px' }}>
                        Don't have an account? <Link to="/signup" className="text-neon-pink" style={{ fontWeight: 'bold', textDecoration: 'none' }}>Join the tribe</Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;
