import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import { CreditCard, Truck, MapPin, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import api, { BASE_URL } from '../utils/api';
import { QRCodeSVG } from 'qrcode.react';
import NeonLoader from '../components/NeonLoader';

const TShirtMini = ({ color, images, fit_type, side }) => {
    const colorName = color === 'Blue' ? 'Skyblue' : color;
    const fitPrefix = fit_type === 'OVERSIZED_FIT' ? 'Oversized_fit' : 'Normal_fit';
    const sideName = (side || 'front').toLowerCase() === 'front' ? 'frontside' : 'backside';
    const imagePath = `/assets/${fit_type || 'NORMAL_FIT'}/${fitPrefix}_${colorName}_${sideName}.png`;

    return (
        <div style={{ position: 'relative', width: '30px', height: '40px' }}>
            <img
                src={imagePath}
                alt="shirt"
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                onError={(e) => { e.target.src = '/vite.svg'; }}
            />
            {/* Render Multiple Images - Strictly based on 'images' prop which is already filtered by side */}
            {images && images.length > 0 && images.map(img => (
                <img
                    key={img.id}
                    src={img.url?.startsWith('http') || img.url?.startsWith('data:') ? img.url : `${BASE_URL}${img.url}`}
                    alt="design"
                    style={{
                        position: 'absolute',
                        left: `${img.position.x}%`,
                        top: `${img.position.y}%`,
                        width: `${img.size.w}%`,
                        height: `${img.size.h}%`,
                        transform: `translate(-50%, -50%) rotate(${img.rotation || 0}deg)`,
                        objectFit: 'contain', pointerEvents: 'none'
                    }}
                />
            ))}
        </div>
    );
};

const formatINR = (amount) => {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0
    }).format(amount);
};

const CheckoutPage = () => {
    const { cartItems, getCartTotal, clearCart } = useContext(CartContext);
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const [address, setAddress] = useState({
        street: '', city: '', state: '', zipCode: '', country: ''
    });

    const [step, setStep] = useState(1);
    const [orderInfo, setOrderInfo] = useState(null);
    const [loadingOrder, setLoadingOrder] = useState(false);

    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    const handleCreateOrder = async (e) => {
        if (e) e.preventDefault();
        setLoadingOrder(true);
        try {
            const orderData = {
                items: cartItems.map(item => ({
                    name: item.name,
                    quantity: item.quantity,
                    price: item.price,
                    color: item.color,
                    size: item.size,
                    side: item.side,
                    fit_type: item.fit_type,
                    front_images: item.front_images || [],
                    back_images: item.back_images || [],
                })),
                shippingAddress: address,
                totalPrice: getCartTotal(),
                client_note: cartItems[0]?.client_note || '' // Assuming note applies to the whole order
            };

            const { data } = await api.post('/orders', orderData);
            setOrderInfo({
                orderId: data.orderId,
                customOrderId: data.customOrderId,
                amount: data.amount,
                upiLink: data.upiLink
            });
            clearCart();
            setStep(3);
            toast.success('Order initialized!');

            if (isMobile) {
                window.location.href = data.upiLink;
            }
        } catch (error) {
            toast.error('Failed to initialize payment');
        } finally {
            setLoadingOrder(false);
        }
    };

    const [utrNumber, setUtrNumber] = useState('');
    const [verifying, setVerifying] = useState(false);
    const [showCancelConfirm, setShowCancelConfirm] = useState(false);

    const submitUTR = async () => {
        if (!/^\d{12}$/.test(utrNumber)) {
            return toast.error("UTR must be exactly 12 digits");
        }
        setVerifying(true);
        try {
            await api.patch(`/orders/${orderInfo.orderId}/payment`, {
                status: 'VERIFICATION_PENDING',
                utr_number: utrNumber
            });
            toast.success("UTR Submitted! Admin will verify soon.");
            navigate('/my-orders');
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to submit UTR");
        } finally {
            setVerifying(false);
        }
    };

    const handleCancelOrder = async () => {
        try {
            await api.patch(`/orders/${orderInfo.orderId}/payment`, { status: 'CANCELLED' });
            toast.success("Order Cancelled");
            navigate('/cart');
        } catch (error) {
            toast.error("Failed to cancel order");
        }
    };

    if (cartItems.length === 0 && !orderInfo) return navigate('/cart');

    return (
        <div className="container" style={{ padding: '64px 20px' }}>
            <h1 className="font-orbitron neon-cyan" style={{ fontSize: '2.5rem', marginBottom: '48px' }}>
                FINALIZING <span className="neon-pink">ORDER</span>
            </h1>

            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '48px' }} className="flex-mobile-col">
                <form onSubmit={(e) => e.preventDefault()} style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                    <div className="glassmorphism" style={{ padding: '32px' }}>
                        <h3 className="font-orbitron" style={{ fontSize: '1.2rem', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <Truck size={20} style={{ color: 'var(--neon-cyan)' }} /> Shipping Details
                        </h3>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }} className="flex-mobile-col">
                            <div style={{ gridColumn: 'span 2' }}>
                                <label style={{ color: '#666', fontSize: '0.8rem', display: 'block', marginBottom: '8px' }}>Street Address</label>
                                <input
                                    type="text" value={address.street}
                                    onChange={e => setAddress({ ...address, street: e.target.value })} required
                                    style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', color: 'white' }}
                                />
                            </div>
                            <div>
                                <label style={{ color: '#666', fontSize: '0.8rem', display: 'block', marginBottom: '8px' }}>City</label>
                                <input
                                    type="text" value={address.city}
                                    onChange={e => setAddress({ ...address, city: e.target.value })} required
                                    style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', color: 'white' }}
                                />
                            </div>
                            <div>
                                <label style={{ color: '#666', fontSize: '0.8rem', display: 'block', marginBottom: '8px' }}>State</label>
                                <input
                                    type="text" value={address.state}
                                    onChange={e => setAddress({ ...address, state: e.target.value })} required
                                    style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', color: 'white' }}
                                />
                            </div>
                            <div>
                                <label style={{ color: '#666', fontSize: '0.8rem', display: 'block', marginBottom: '8px' }}>Zip Code</label>
                                <input
                                    type="text" value={address.zipCode}
                                    onChange={e => setAddress({ ...address, zipCode: e.target.value })} required
                                    style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', color: 'white' }}
                                />
                            </div>
                            <div style={{ gridColumn: 'span 2' }}>
                                <label style={{ color: '#666', fontSize: '0.8rem', display: 'block', marginBottom: '8px' }}>Country</label>
                                <input
                                    type="text" value={address.country}
                                    onChange={e => setAddress({ ...address, country: e.target.value })} required
                                    style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', color: 'white' }}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="glassmorphism" style={{ padding: '32px', gridColumn: 'span 2' }}>
                        {step === 1 ? (
                            <>
                                <h3 className="font-orbitron" style={{ fontSize: '1.2rem', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <CreditCard size={20} style={{ color: 'var(--neon-pink)' }} /> Proceed to Checkout
                                </h3>
                                <button type="button" className="btn btn-cyan" style={{ width: '100%', padding: '16px' }} onClick={(e) => {
                                    if (address.street && address.city && address.zipCode) {
                                        setStep(2);
                                    } else {
                                        toast.error("Please fill address complete");
                                    }
                                }}>Proceed to Payment Mode</button>
                            </>
                        ) : step === 2 ? (
                            <div style={{ padding: '20px', border: '1px solid var(--neon-cyan)', borderRadius: '12px', background: 'rgba(0, 255, 249, 0.05)', textAlign: 'center' }}>
                                <h3 className="font-orbitron neon-cyan" style={{ marginBottom: '16px', fontSize: '1.4rem' }}>💳 Pay with UPI</h3>
                                <p style={{ color: '#ccc', marginBottom: '24px' }}>GPay • PhonePe • Paytm<br />Any UPI App</p>

                                <button type="button" className="btn btn-cyan" disabled={loadingOrder} onClick={handleCreateOrder} style={{ width: '100%', padding: '16px', fontSize: '1.1rem' }}>
                                    {loadingOrder ? 'Initializing...' : `Pay ${formatINR(getCartTotal())} →`}
                                </button>
                                <button type="button" style={{ background: 'transparent', border: 'none', color: '#999', marginTop: '16px', cursor: 'pointer', textDecoration: 'underline' }} onClick={() => setStep(1)}>
                                    Back to Address
                                </button>
                            </div>
                        ) : (
                            orderInfo && (
                                <div style={{ textAlign: 'center' }}>
                                    <h3 className="font-orbitron neon-pink" style={{ marginBottom: '16px', fontSize: '1.4rem' }}>Awaiting Payment</h3>
                                    <p style={{ color: 'white', marginBottom: '8px', fontSize: '1.1rem' }}>Amount: <span className="text-neon-cyan" style={{ fontWeight: 'bold' }}>{formatINR(orderInfo.amount)}</span></p>
                                    <p style={{ color: '#999', marginBottom: '16px', fontSize: '0.9rem' }}>{isMobile ? 'Please complete payment in the app.' : 'Scan with any UPI app to pay'}</p>

                                    {!isMobile && (
                                        <div style={{ background: 'white', padding: '12px', display: 'inline-block', borderRadius: '12px', marginBottom: '20px' }}>
                                            <QRCodeSVG value={orderInfo.upiLink} size={180} />
                                        </div>
                                    )}

                                    <div style={{ marginTop: '10px', padding: '20px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)' }}>
                                        <p style={{ color: '#ccc', fontSize: '0.85rem', marginBottom: '12px' }}>Enter 12-digit UPI Transaction ID / UTR:</p>
                                        <input
                                            type="text"
                                            maxLength="12"
                                            placeholder="e.g. 123456789012"
                                            value={utrNumber}
                                            onChange={(e) => setUtrNumber(e.target.value.replace(/\D/g, ''))}
                                            style={{ width: '100%', padding: '12px', background: '#000', border: '1px solid var(--neon-cyan)', borderRadius: '6px', color: 'white', textAlign: 'center', fontSize: '1.1rem', letterSpacing: '2px', marginBottom: '15px' }}
                                        />
                                        <button
                                            type="button"
                                            className="btn btn-cyan"
                                            disabled={verifying || utrNumber.length !== 12}
                                            onClick={submitUTR}
                                            style={{ width: '100%', padding: '12px' }}
                                        >
                                            {verifying ? 'Submitting...' : 'Submit for Verification'}
                                        </button>
                                    </div>

                                    <div style={{ marginTop: '20px' }}>
                                        {showCancelConfirm ? (
                                            <div style={{ padding: '15px', background: 'rgba(255,85,85,0.1)', border: '1px solid #ff5555', borderRadius: '8px' }}>
                                                <p style={{ color: '#ff5555', fontSize: '0.85rem', marginBottom: '10px' }}>Cancel this order?</p>
                                                <div style={{ display: 'flex', gap: '10px' }}>
                                                    <button type="button" onClick={handleCancelOrder} style={{ flex: 1, padding: '8px', background: '#ff5555', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Yes, Cancel</button>
                                                    <button type="button" onClick={() => setShowCancelConfirm(false)} style={{ flex: 1, padding: '8px', background: 'transparent', border: '1px solid #666', color: '#ccc', borderRadius: '4px', cursor: 'pointer' }}>No</button>
                                                </div>
                                            </div>
                                        ) : (
                                            <button type="button" onClick={() => setShowCancelConfirm(true)} style={{ background: 'transparent', border: 'none', color: '#666', fontSize: '0.85rem', cursor: 'pointer', textDecoration: 'underline' }}>
                                                Cancel Order
                                            </button>
                                        )}
                                    </div>
                                </div>
                            )
                        )}
                    </div>
                </form>

                <div className="glassmorphism" style={{ padding: '24px', height: 'fit-content' }}>
                    <h3 className="font-orbitron" style={{ fontSize: '1.2rem', marginBottom: '24px' }}>ORDER SUMMARY</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '32px' }}>
                        {cartItems.map(item => (
                            <div key={item.id} className="flex justify-between" style={{ fontSize: '0.85rem', alignItems: 'center', gap: '10px' }}>
                                <div className="flex" style={{ gap: '10px', alignItems: 'center', flexShrink: 1 }}>
                                    <TShirtMini color={item.color} artwork={item.image} images={item.side === 'front' ? item.front_images : item.back_images} fit_type={item.fit_type} side={item.side} />
                                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                                        <span style={{ color: '#999', wordBreak: 'break-word' }}>{item.quantity}x {item.name}</span>
                                        <span style={{ fontSize: '0.7rem', color: '#666' }}>{item.size} • {item.fit_type === 'OVERSIZED_FIT' ? 'Oversized' : 'Normal'}</span>
                                    </div>
                                </div>
                                <span style={{ fontWeight: 'bold' }}>${(item.price * item.quantity).toFixed(2)}</span>
                            </div>
                        ))}
                    </div>
                    <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '16px' }} className="flex justify-between font-orbitron">
                        <span style={{ fontWeight: 'bold' }}>TOTAL</span>
                        <span className="text-neon-cyan" style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{formatINR(getCartTotal())}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;
