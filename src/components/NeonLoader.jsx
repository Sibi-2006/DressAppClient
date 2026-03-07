import React from 'react';

const NeonLoader = ({ variant = 'spinner', text = 'Loading...', rows = 3, height = '20px' }) => {
    if (variant === 'fullscreen') {
        return (
            <div style={{
                position: 'fixed', inset: 0, background: '#0a0a0a', zIndex: 9999,
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'
            }} className="fade-in">
                <div style={{ position: 'relative', width: '100px', height: '100px' }}>
                    <div className="neon-ring" style={{
                        position: 'absolute', inset: 0, border: '4px solid rgba(0, 255, 249, 0.1)',
                        borderTopColor: 'var(--neon-cyan)', borderRadius: '50%',
                        animation: 'spin 1s linear infinite', boxShadow: '0 0 15px var(--neon-cyan)'
                    }} />
                    <div style={{
                        position: 'absolute', inset: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontFamily: 'Orbitron', fontSize: '0.8rem', color: 'var(--neon-pink)', fontWeight: 'bold'
                    }}> NT </div>
                </div>
                {text && <p className="font-orbitron glow-cyan" style={{ marginTop: '24px', letterSpacing: '2px', fontSize: '1rem' }}>{text}</p>}
                <style>{`
                    @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
                    .fade-in { animation: fadeIn 0.5s ease-out forwards; }
                    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                `}</style>
            </div>
        );
    }

    if (variant === 'skeleton') {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%' }}>
                {Array.from({ length: rows }).map((_, i) => (
                    <div key={i} className="skeleton-line" style={{
                        width: '100%', height: height, background: 'rgba(255,255,255,0.05)',
                        borderRadius: '4px', overflow: 'hidden', position: 'relative'
                    }}>
                        <div className="shimmer" style={{
                            position: 'absolute', inset: 0,
                            background: 'linear-gradient(90deg, transparent, rgba(0, 255, 249, 0.1), transparent)',
                            animation: 'shimmer 1.5s infinite'
                        }} />
                    </div>
                ))}
                <style>{`
                    @keyframes shimmer {
                        0% { transform: translateX(-100%); }
                        100% { transform: translateX(100%); }
                    }
                `}</style>
            </div>
        );
    }

    return (
        <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className="neon-spinner" style={{
                width: '24px', height: '24px', border: '3px solid rgba(0, 255, 249, 0.1)',
                borderTopColor: 'var(--neon-cyan)', borderRadius: '50%',
                animation: 'spin 1s linear infinite'
            }} />
            <style>{`
                @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
            `}</style>
        </div>
    );
};

export default NeonLoader;
