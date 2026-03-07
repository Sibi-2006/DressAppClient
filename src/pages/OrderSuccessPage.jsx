import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, Truck, PackageCheck, ArrowRight } from 'lucide-react';

const OrderSuccessPage = () => {
    return (
        <div className="container" style={{ padding: '80px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
            <div style={{ position: 'relative', marginBottom: '48px' }}>
                <CheckCircle size={100} style={{ color: 'var(--neon-cyan)' }} />
                <div style={{ position: 'absolute', top: '-10px', right: '-10px', width: '24px', height: '24px', background: 'var(--neon-pink)', borderRadius: '50%' }}></div>
            </div>

            <h1 className="font-orbitron neon-cyan" style={{ fontSize: '3rem', fontWeight: '900', marginBottom: '16px' }}>ORDER <span className="neon-pink">SUCCESSFUL</span></h1>
            <p style={{ color: '#999', fontSize: '1.2rem', maxWidth: '600px', marginBottom: '48px' }}>
                Your order has been transmitted through the neon grid. Our artisans are now crafting your unique threads.
            </p>

            <div className="grid grid-cols-2" style={{ gap: '24px', width: '100%', maxWidth: '600px', marginBottom: '64px' }}>
                <div className="glassmorphism" style={{ padding: '24px', textAlign: 'left' }}>
                    <div className="flex items-center" style={{ gap: '12px', marginBottom: '12px' }}>
                        <Truck size={20} />
                        <h4 className="font-orbitron" style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>TRACKING</h4>
                    </div>
                    <p style={{ color: '#666', fontSize: '0.8rem' }}>Check your email for real-time tracking updates as your item moves through the matrix.</p>
                </div>
                <div className="glassmorphism" style={{ padding: '24px', textAlign: 'left' }}>
                    <div className="flex items-center" style={{ gap: '12px', marginBottom: '12px' }}>
                        <PackageCheck size={20} />
                        <h4 className="font-orbitron" style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>STAY READY</h4>
                    </div>
                    <p style={{ color: '#666', fontSize: '0.8rem' }}>Estimated arrival: 3-5 days. Prepare your space for its arrival.</p>
                </div>
            </div>

            <div className="flex" style={{ gap: '24px' }}>
                <Link to="/my-orders" className="btn btn-cyan">View History <ArrowRight size={18} style={{ marginLeft: '12px' }} /></Link>
                <Link to="/" className="btn btn-outline-purple">Return to Hub</Link>
            </div>
        </div>
    );
};

export default OrderSuccessPage;
