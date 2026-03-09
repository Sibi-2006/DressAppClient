import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Twitter, Facebook, Mail } from 'lucide-react';

const Footer = () => {
    return (
        <footer style={{
            background: 'rgba(5,5,5,0.8)', padding: '64px 20px',
            borderTop: '1px solid rgba(255,255,255,0.05)', marginTop: '64px'
        }}>
            <div className="container footer-mobile-center">
                <div className="grid grid-cols-3 footer-mobile-center" style={{ gap: '64px' }}>
                    <div>
                        <span className="logo-neon" style={{ fontSize: '1.5rem' }}>
                            <span className="neon-part">NEON</span><span className="threads-part">THREADS</span>
                        </span>
                        <p style={{ color: '#666', marginTop: '24px', fontSize: '0.9rem' }}>
                            Redefining streetwear with custom neon aesthetics. Every piece is a unique expression of your identity.
                        </p>
                    </div>

                    <div>
                        <h4 className="font-orbitron neon-cyan" style={{ fontSize: '1rem', fontWeight: 'bold', marginBottom: '24px', letterSpacing: '2px' }}>QUICK LINKS</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <Link to="/shop" style={{ color: '#999', textDecoration: 'none', fontSize: '0.9rem' }}>Shop Collection</Link>
                            <Link to="/customize" style={{ color: '#999', textDecoration: 'none', fontSize: '0.9rem' }}>Custom Editor</Link>
                            <Link to="/login?tab=signup" style={{ color: '#999', textDecoration: 'none', fontSize: '0.9rem' }}>Join the Tribe</Link>
                        </div>
                    </div>

                    <div>
                        <h4 className="font-orbitron neon-pink" style={{ fontSize: '1rem', fontWeight: 'bold', marginBottom: '24px', letterSpacing: '2px' }}>STAY CONNECTED</h4>
                        <div className="flex" style={{ gap: '20px', marginBottom: '32px', color: '#ccc' }}>
                            <Instagram size={20} style={{ cursor: 'pointer' }} />
                            <Twitter size={20} style={{ cursor: 'pointer' }} />
                            <Facebook size={20} style={{ cursor: 'pointer' }} />
                            <Mail size={20} style={{ cursor: 'pointer' }} />
                        </div>
                        <p style={{ color: '#555', fontSize: '0.8rem' }}>© 2026 NeonThreads. All rights reserved.</p>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
