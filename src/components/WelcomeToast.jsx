import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';

const WelcomeToast = ({ settings, onClose, loading = false }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [timeLeft, setTimeLeft] = useState(8);
    const [isClosing, setIsClosing] = useState(false);

    useEffect(() => {
        const showTimeout = setTimeout(() => {
            setIsVisible(true);
        }, 500);

        if (!loading) {
            const timer = setInterval(() => {
                setTimeLeft(prev => {
                    if (prev <= 1) {
                        handleClose();
                        clearInterval(timer);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);

            return () => {
                clearTimeout(showTimeout);
                clearInterval(timer);
            };
        }
        return () => clearTimeout(showTimeout);
    }, [loading]);

    const handleClose = () => {
        setIsClosing(true);
        setTimeout(onClose, 300);
    };

    if (!isVisible) return null;

    return (
        <div
            className={`toast-bar ${isClosing ? 'toast-bar-closing' : ''}`}
            style={{
                height: '60px',
                background: loading ? '#1a1a1a' : (settings?.bg_color || '#1a1a1a'),
                borderLeft: `4px solid ${loading ? '#333' : (settings?.accent_color || '#00ffff')}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0 24px',
                zIndex: 9999,
                color: 'white',
                boxShadow: loading ? 'none' : `0 4px 20px rgba(0,0,0,0.5), -2px 0 8px ${settings?.accent_color}33`
            }}
        >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
                {loading ? (
                    <div className="loading-bar" style={{ width: '60%', height: '14px', borderRadius: '4px' }}></div>
                ) : (
                    <>
                        <span className="hide-mobile" style={{ fontSize: '1.2rem' }}>👋</span>
                        <p style={{ fontSize: 'clamp(0.75rem, 2.5vw, 0.9rem)', fontWeight: '500', margin: 0 }}>{settings?.message}</p>
                    </>
                )}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexShrink: 0 }}>
                {!loading && (
                    <>
                        <span style={{ fontSize: '0.7rem', color: '#666', fontFamily: 'Orbitron' }} className="hide-mobile">
                            Closing in {timeLeft}...
                        </span>
                        <button
                            onClick={handleClose}
                            style={{ background: 'none', border: 'none', color: '#999', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '5px' }}
                        >
                            <span style={{ marginRight: '8px', fontSize: '0.7rem', fontWeight: 'bold' }}>[×] Close</span>
                            <X size={16} />
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default WelcomeToast;
