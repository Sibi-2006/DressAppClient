import React, { useEffect, useState } from 'react';
import { Package, Truck, CheckCircle, Clock, XCircle, AlertTriangle, FileText } from 'lucide-react';
import api from '../utils/api';
import TShirtPreview from '../components/TShirtPreview';
import toast from 'react-hot-toast';
import NeonLoader from '../components/NeonLoader';
import { QRCodeSVG } from 'qrcode.react';

const formatINR = (amount) => {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0
    }).format(amount);
};

const MyOrdersPage = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [cancelConfirm, setCancelConfirm] = useState(null);
    const [payingOrder, setPayingOrder] = useState(null);
    const [utrNumber, setUtrNumber] = useState('');
    const [verifying, setVerifying] = useState(false);

    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    const fetchOrders = async () => {
        try {
            const { data } = await api.get('/orders/myorders');
            setOrders(data);
        } catch (error) {
            toast.error('Failed to fetch orders');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const getStatusIcon = (status) => {
        switch (status) {
            case 'Delivered': return <CheckCircle size={18} className="text-neon-green" />;
            case 'Shipped': return <Truck size={18} className="text-neon-cyan" />;
            case 'Processing': return <Package size={18} className="text-neon-pink" />;
            case 'Cancelled': return <XCircle size={18} style={{ color: '#ff5555' }} />;
            default: return <Clock size={18} className="text-neon-purple" />;
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Delivered': return 'var(--neon-green)';
            case 'Shipped': return 'var(--neon-cyan)';
            case 'Processing': return 'var(--neon-pink)';
            case 'Cancelled': return '#ff5555';
            default: return 'var(--neon-purple)';
        }
    };

    const [isCancelling, setIsCancelling] = useState(false);

    const handleCancel = async (orderId) => {
        setIsCancelling(true);
        try {
            await api.put(`/orders/${orderId}/cancel`);
            setOrders(prev => prev.map(o => o._id === orderId ? { ...o, status: 'Cancelled' } : o));
            toast.success('Order cancelled successfully.');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Cancellation failed.');
        } finally {
            setIsCancelling(false);
            setCancelConfirm(null);
        }
    };

    const submitUTR = async () => {
        if (!/^\d{12}$/.test(utrNumber)) {
            return toast.error("UTR must be exactly 12 digits");
        }
        setVerifying(true);
        try {
            await api.patch(`/orders/${payingOrder._id}/payment`, {
                status: 'VERIFICATION_PENDING',
                utr_number: utrNumber
            });
            toast.success("UTR Submitted for Verification!");
            setPayingOrder(null);
            setUtrNumber('');
            fetchOrders();
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to submit UTR");
        } finally {
            setVerifying(false);
        }
    };

    if (loading) return (
        <div className="container" style={{ padding: '40px 15px' }}>
            <h1 className="font-orbitron glow-cyan" style={{ fontSize: 'clamp(1.4rem, 5vw, 2.2rem)', marginBottom: '32px' }}>
                MY <span className="text-neon-pink">ORDERS</span>
            </h1>
            <div className="grid grid-cols-2 tablet-col" style={{ gap: '28px' }}>
                <div className="glassmorphism" style={{ padding: '24px' }}><NeonLoader variant="skeleton" rows={10} /></div>
                <div className="glassmorphism" style={{ padding: '24px' }}><NeonLoader variant="skeleton" rows={10} /></div>
            </div>
        </div>
    );

    return (
        <div className="container" style={{ padding: '40px 15px' }}>
            <h1 className="font-orbitron neon-cyan" style={{ fontSize: 'clamp(1.4rem, 5vw, 2.2rem)', marginBottom: '32px' }}>
                MY <span className="neon-pink">ORDERS</span>
            </h1>

            {orders.length === 0 ? (
                <div style={{ padding: '80px', textAlign: 'center' }} className="glassmorphism">
                    <h3 className="font-orbitron" style={{ fontSize: '1.2rem', color: '#666' }}>NO ORDERS IN THE MATRIX</h3>
                </div>
            ) : (
                <div className="grid grid-cols-2 tablet-col" style={{ gap: '28px' }}>
                    {orders.map(order => (
                        <div key={order._id} className="glassmorphism" style={{ padding: '24px', display: 'flex', flexDirection: 'column' }}>

                            {/* Order Header */}
                            <div style={{
                                display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
                                marginBottom: '20px', paddingBottom: '16px',
                                borderBottom: '1px solid rgba(255,255,255,0.05)',
                                flexWrap: 'wrap', gap: '12px'
                            }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                    <span style={{ color: '#666', fontSize: '0.75rem' }}>
                                        ORDER ID: <span className="text-neon-cyan" style={{ fontSize: '0.7rem' }}>{order._id}</span>
                                    </span>
                                    <span style={{ color: '#999', fontSize: '0.85rem' }}>
                                        {new Date(order.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}
                                    </span>
                                </div>

                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <div style={{
                                        display: 'flex', alignItems: 'center', gap: '6px',
                                        background: `${getStatusColor(order.status)}18`,
                                        border: `1px solid ${getStatusColor(order.status)}40`,
                                        padding: '5px 12px', borderRadius: '20px'
                                    }}>
                                        {getStatusIcon(order.status)}
                                        <span className="font-orbitron" style={{ fontSize: '0.75rem', fontWeight: 'bold', color: getStatusColor(order.status) }}>
                                            {order.status.toUpperCase()}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Payment Display */}
                            <div style={{ marginBottom: '20px', padding: '12px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
                                <div style={{ fontSize: '0.75rem', color: '#999' }}>Status:
                                    {order.payment?.status === 'SUCCESS' ? <span style={{ color: 'var(--neon-green)', fontWeight: 'bold', marginLeft: '5px' }}>Paid</span> :
                                        order.payment?.status === 'VERIFICATION_PENDING' ? <span style={{ color: 'var(--neon-cyan)', fontWeight: 'bold', marginLeft: '5px' }}>Verifying...</span> :
                                            <span style={{ color: 'yellow', fontWeight: 'bold', marginLeft: '5px' }}>Pending</span>}
                                </div>
                                <div style={{ fontSize: '0.75rem', color: '#999' }}>Total: <span style={{ color: 'white', fontWeight: 'bold' }}>{formatINR(order.totalPrice)}</span></div>

                                {order.payment?.status === 'PENDING' && (
                                    <button onClick={() => setPayingOrder(order)} className="btn btn-cyan" style={{ padding: '4px 10px', fontSize: '0.7rem' }}>Pay Now</button>
                                )}
                            </div>

                            {/* Order Items */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', flex: 1 }}>
                                {order.items.map((item, i) => (
                                    <div key={i} style={{ display: 'grid', gridTemplateColumns: 'minmax(120px, 150px) 1fr', gap: '16px' }}>
                                        <TShirtPreview
                                            color={item.color}
                                            fitType={item.fit_type || 'NORMAL_FIT'}
                                            frontImages={item.front_images || []}
                                            backImages={item.back_images || []}
                                            showToggle={true}
                                            style={{ width: '100%' }}
                                        />
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                            <h4 className="font-orbitron" style={{ fontSize: '0.85rem', color: 'white' }}>{item.name}</h4>
                                            <p style={{ fontSize: '0.75rem', color: '#666' }}>Size: {item.size} | Qty: {item.quantity}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Client Note */}
                            {order.client_note && (
                                <div style={{ marginTop: '20px', padding: '12px', background: 'rgba(0, 255, 249, 0.05)', border: '1px solid rgba(0, 255, 249, 0.1)', borderRadius: '8px' }}>
                                    <p style={{ fontSize: '0.7rem', color: 'var(--neon-cyan)', marginBottom: '4px', fontFamily: 'Orbitron' }}>MY NOTE:</p>
                                    <p style={{ fontSize: '0.8rem', color: '#ccc', fontStyle: 'italic' }}>"{order.client_note}"</p>
                                </div>
                            )}

                            {/* Actions */}
                            {order.status === 'Pending' && !cancelConfirm && (
                                <button onClick={() => setCancelConfirm(order._id)} className="btn btn-outline-red" style={{ marginTop: '20px', width: '100%', padding: '10px', fontSize: '0.8rem' }}>
                                    Cancel Order
                                </button>
                            )}
                            {cancelConfirm === order._id && (
                                <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
                                    <button
                                        onClick={() => handleCancel(order._id)}
                                        disabled={isCancelling}
                                        className="btn btn-pink"
                                        style={{ flex: 1, padding: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                                    >
                                        {isCancelling ? <NeonLoader variant="spinner" /> : null}
                                        {isCancelling ? 'CANCELING...' : 'Confirm Cancel'}
                                    </button>
                                    <button onClick={() => setCancelConfirm(null)} disabled={isCancelling} className="btn" style={{ flex: 1, padding: '10px', background: 'rgba(255,255,255,0.05)' }}>Keep Order</button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Payment Modal */}
            {payingOrder && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
                    <div className="glassmorphism" style={{ padding: '30px', maxWidth: '400px', width: '100%', textAlign: 'center' }}>
                        <h3 className="font-orbitron neon-pink" style={{ marginBottom: '16px' }}>Complete Payment</h3>
                        <p style={{ marginBottom: '20px' }}>Scan & Pay <span className="text-neon-cyan">{formatINR(payingOrder.totalPrice)}</span></p>

                        <div style={{ background: 'white', padding: '12px', borderRadius: '12px', display: 'inline-block', marginBottom: '20px' }}>
                            <QRCodeSVG value={payingOrder.upiLink || ''} size={180} />
                        </div>

                        <input
                            type="text" maxLength="12" placeholder="Enter 12-digit UTR"
                            value={utrNumber} onChange={(e) => setUtrNumber(e.target.value.replace(/\D/g, ''))}
                            style={{ width: '100%', padding: '12px', background: '#000', border: '1px solid var(--neon-cyan)', borderRadius: '6px', color: 'white', marginBottom: '15px' }}
                        />

                        <button
                            onClick={submitUTR}
                            disabled={verifying || utrNumber.length !== 12}
                            className="btn btn-cyan"
                            style={{ width: '100%', marginBottom: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                        >
                            {verifying ? <NeonLoader variant="spinner" /> : null}
                            {verifying ? 'VERIFYING...' : 'Submit UTR'}
                        </button>
                        <button onClick={() => setPayingOrder(null)} style={{ background: 'none', border: 'none', color: '#666', cursor: 'pointer', textDecoration: 'underline' }}>Close</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyOrdersPage;
