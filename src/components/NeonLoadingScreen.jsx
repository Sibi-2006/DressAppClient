import React from 'react';

const NeonLoadingScreen = ({ text }) => {
    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: '#0a0a0a',
            zIndex: 10000,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
        }}>
            <div style={{ marginBottom: '40px' }} className="logo-neon">
                <span className="neon-part" style={{ fontSize: '3rem' }}>NEON</span>
                <span style={{ fontSize: '3rem', margin: '0 15px' }}></span>
                <span className="threads-part" style={{ fontSize: '3rem' }}>THREADS</span>
            </div>

            <div style={{
                width: '300px',
                height: '8px',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '4px',
                overflow: 'hidden',
                marginBottom: '20px',
                border: '1px solid rgba(0, 255, 255, 0.1)'
            }}>
                <div className="loading-bar" style={{ height: '100%', width: '100%' }}></div>
            </div>

            <p style={{
                color: '#666',
                fontFamily: 'var(--font-orbitron)',
                fontSize: '0.9rem',
                letterSpacing: '2px',
                textTransform: 'uppercase'
            }}>
                {text}
            </p>
        </div>
    );
};

export default NeonLoadingScreen;
