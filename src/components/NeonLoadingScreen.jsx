import React from 'react';

const NeonLoadingScreen = ({ text }) => {
    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: '#0a0a0a',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '20px',
            boxSizing: 'border-box',
            overflow: 'hidden'
        }}>

            {/* Logo */}
            <div style={{
                fontSize: 'clamp(28px, 8vw, 56px)',
                fontWeight: '900',
                letterSpacing: 'clamp(2px, 1vw, 6px)',
                marginBottom: 'clamp(24px, 5vw, 48px)',
                textAlign: 'center',
                whiteSpace: 'nowrap',
                fontFamily: 'Orbitron, sans-serif'
            }}>
                <span style={{
                    color: '#00ffff',
                    textShadow:
                        '0 0 4px rgba(0,255,255,0.4),' +
                        '0 0 8px rgba(0,255,255,0.2)'
                }}>NEON</span>
                <span style={{
                    color: '#ff00aa',
                    textShadow:
                        '0 0 4px rgba(255,0,170,0.4),' +
                        '0 0 8px rgba(255,0,170,0.2)'
                }}> THREADS</span>
            </div>

            {/* Progress Bar Container */}
            <div style={{
                width: 'min(320px, 80vw)',
                height: '4px',
                backgroundColor: '#1a1a1a',
                borderRadius: '2px',
                overflow: 'hidden',
                marginBottom: 'clamp(12px, 3vw, 20px)'
            }}>
                {/* Animated Bar */}
                <div style={{
                    height: '100%',
                    borderRadius: '2px',
                    background:
                        'linear-gradient(90deg,' +
                        '#00ffff 0%, #ff00aa 100%)',
                    animation: 'loadingBar 2s ease infinite',
                    boxShadow: '0 0 8px rgba(0,255,255,0.4)'
                }} />
            </div>

            {/* Loading Text */}
            <p style={{
                color: '#888',
                fontSize: 'clamp(11px, 3vw, 14px)',
                letterSpacing: '1px',
                textTransform: 'uppercase',
                textAlign: 'center',
                margin: 0,
                padding: '0 20px',
                fontFamily: 'Orbitron, sans-serif'
            }}>
                {text}
            </p>

            {/* CSS Animation */}
            <style>{`
        @keyframes loadingBar {
          0%   { width: 0%; opacity: 1; }
          70%  { width: 85%; opacity: 1; }
          90%  { width: 95%; opacity: 0.7; }
          100% { width: 100%; opacity: 0; }
        }

        @media (max-width: 480px) {
          /* Extra small phones */
        }
      `}</style>
        </div>
    )
}

export default NeonLoadingScreen;
