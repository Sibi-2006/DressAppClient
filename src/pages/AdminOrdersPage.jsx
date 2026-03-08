import React, { useEffect, useState } from 'react';
import { Truck, CheckCircle, Package, Clock, XCircle, MessageCircle, X, Download, Eye, Layers, Search } from 'lucide-react';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import api, { BASE_URL } from '../utils/api';
import toast from 'react-hot-toast';
import TShirtPreview from '../components/TShirtPreview';
import { Phone, MessageSquare, Copy, ExternalLink } from 'lucide-react';

const formatINR = (amount) => {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0
    }).format(amount);
};

const AdminOrdersPage = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expanded, setExpanded] = useState(null);
    const [settings, setSettings] = useState(null);
    const [waModal, setWaModal] = useState({ isOpen: false, order: null, text: '' });
    const [filter, setFilter] = useState('ALL'); // ALL, VERIFY, PENDING, PROCESSING, SHIPPED, DELIVERED, CANCELLED
    const [lightbox, setLightbox] = useState({ isOpen: false, url: '', side: '' });

    const downloadImage = async (url, filename) => {
        try {
            // Use proxy to bypass Cloudinary CORS
            const proxyUrl = `${BASE_URL}/api/admin/download?url=${encodeURIComponent(url)}&filename=${filename}`;
            const response = await fetch(proxyUrl);
            if (!response.ok) throw new Error('Proxy download failed');
            const blob = await response.blob();
            saveAs(blob, filename);
        } catch (error) {
            console.error(error);
            toast.error("Download failed. Try again.");
        }
    };

    const downloadAllDesigns = async (order) => {
        const zip = new JSZip();
        const promises = [];

        toast.loading("Preparing designs...", { id: 'zip' });

        order.items.forEach((item, itemIdx) => {
            if (item.front_images) {
                item.front_images.forEach((img, imgIdx) => {
                    promises.push((async () => {
                        const proxyUrl = `${BASE_URL}/api/admin/download?url=${encodeURIComponent(img.url)}`;
                        const res = await fetch(proxyUrl);
                        const blob = await res.blob();
                        const ext = img.url.split('.').pop().split('?')[0] || 'png';
                        zip.file(`Item${itemIdx + 1}_Front_Design_${imgIdx + 1}.${ext}`, blob);
                    })());
                });
            }
            if (item.back_images) {
                item.back_images.forEach((img, imgIdx) => {
                    promises.push((async () => {
                        const proxyUrl = `${BASE_URL}/api/admin/download?url=${encodeURIComponent(img.url)}`;
                        const res = await fetch(proxyUrl);
                        const blob = await res.blob();
                        const ext = img.url.split('.').pop().split('?')[0] || 'png';
                        zip.file(`Item${itemIdx + 1}_Back_Design_${imgIdx + 1}.${ext}`, blob);
                    })());
                });
            }
        });

        if (promises.length === 0) {
            toast.error("No design files to download", { id: 'zip' });
            return;
        }

        try {
            await Promise.all(promises);
            const content = await zip.generateAsync({ type: 'blob' });
            saveAs(content, `NEONTHREADS_${order._id}_Designs.zip`);
            toast.success("Design ZIP Ready!", { id: 'zip' });
        } catch (error) {
            toast.error("Failed to create ZIP", { id: 'zip' });
        }
    };

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const [ordersRes, settingsRes] = await Promise.all([
                    api.get('/orders'),
                    api.get('/admin/settings')
                ]);
                setOrders(ordersRes.data);
                setSettings(settingsRes.data);
            } catch (error) {
                console.error('Error fetching orders', error);
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    const updateStatus = async (id, status) => {
        try {
            await api.put(`/orders/${id}/status`, { status });
            setOrders(prev => prev.map(o => o._id === id ? { ...o, status } : o));
            toast.success(`Status → ${status}`);
        } catch {
            toast.error('Status update failed');
        }
    };

    const handlePaymentAction = async (id, status) => {
        try {
            await api.patch(`/orders/${id}/payment`, { status });
            setOrders(prev => prev.map(o => o._id === id ? { ...o, payment: { ...o.payment, status } } : o));
            toast.success(`Payment ${status === 'SUCCESS' ? 'Verified' : 'Rejected'}`);
        } catch {
            toast.error('Payment action failed');
        }
    };

    const openWaModal = (order) => {
        let msg = '';
        if (settings && settings.templates && settings.templates[order.status]) {
            msg = settings.templates[order.status]
                .replace('[Client Name]', order.userId?.name || 'Customer')
                .replace('[Order ID]', order._id);
        } else {
            msg = `Hello ${order.userId?.name || 'Customer'}, your order #${order._id} is currently ${order.status}.`;
        }
        setWaModal({ isOpen: true, order, text: msg });
    };

    const sendManualWaMessage = async () => {
        try {
            await api.post(`/admin/orders/${waModal.order._id}/whatsapp`, { message: waModal.text });
            toast.success("Message dispatched!");
            setWaModal({ isOpen: false, order: null, text: '' });
        } catch (error) {
            toast.error("Failed to send message: " + (error.response?.data?.message || 'Server error'));
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'Delivered': return <CheckCircle size={16} className="text-neon-green" />;
            case 'Shipped': return <Truck size={16} className="text-neon-cyan" />;
            case 'Processing': return <Package size={16} className="text-neon-pink" />;
            case 'Cancelled': return <XCircle size={16} style={{ color: '#ff5555' }} />;
            default: return <Clock size={16} className="text-neon-purple" />;
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

    const filteredOrders = orders.filter(o => {
        if (filter === 'ALL') return true;
        if (filter === 'VERIFY') return o.payment?.status === 'VERIFICATION_PENDING';
        return o.status.toUpperCase() === filter;
    });

    if (loading) return (
        <div className="container" style={{ padding: '80px', textAlign: 'center' }}>
            <p style={{ color: 'var(--neon-cyan)', fontFamily: 'Orbitron' }}>Synchronizing Master Database...</p>
        </div>
    );

    return (
        <div className="container" style={{ padding: '40px 15px' }}>
            <h1 className="font-orbitron neon-cyan" style={{ fontSize: 'clamp(1.4rem, 5vw, 2.2rem)', marginBottom: '32px' }}>
                ADMINISTRATIVE <span className="neon-pink">CONTROLS</span>
            </h1>

            <div style={{ display: 'flex', gap: '15px', marginBottom: '30px', flexWrap: 'wrap' }}>
                {[
                    { id: 'ALL', label: 'All Orders' },
                    { id: 'VERIFY', label: '⏳ Awaiting Verification', color: 'var(--neon-cyan)' },
                    { id: 'PENDING', label: 'Pending' },
                    { id: 'PROCESSING', label: 'Processing' },
                    { id: 'SHIPPED', label: 'Shipped' },
                    { id: 'DELIVERED', label: 'Delivered' }
                ].map(f => (
                    <button
                        key={f.id}
                        onClick={() => setFilter(f.id)}
                        style={{
                            padding: '10px 20px', borderRadius: '30px', border: '1px solid rgba(255,255,255,0.1)',
                            background: filter === f.id ? (f.color || 'var(--neon-purple)') : 'rgba(255,255,255,0.05)',
                            color: filter === f.id ? 'black' : '#999', cursor: 'pointer', fontFamily: 'Orbitron', fontSize: '0.75rem', fontWeight: 'bold', transition: '0.3s'
                        }}
                    >
                        {f.label} {f.id === 'VERIFY' && orders.filter(o => o.payment?.status === 'VERIFICATION_PENDING').length > 0 &&
                            <span style={{ marginLeft: '8px', background: '#ff5555', color: 'white', padding: '1px 7px', borderRadius: '10px', fontSize: '0.6rem' }}>
                                {orders.filter(o => o.payment?.status === 'VERIFICATION_PENDING').length}
                            </span>
                        }
                    </button>
                ))}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {filteredOrders.length === 0 ? (
                    <div className="glassmorphism" style={{ padding: '80px', textAlign: 'center' }}>
                        <h3 className="font-orbitron" style={{ color: '#666' }}>NO ORDERS FOUND IN THIS SECTOR</h3>
                    </div>
                ) : (
                    filteredOrders.map(order => (
                        <div key={order._id} className="glassmorphism" style={{ padding: '24px' }}>

                            {/* Order Header Row */}
                            <div style={{
                                display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
                                marginBottom: expanded === order._id ? '20px' : '0',
                                flexWrap: 'wrap', gap: '12px'
                            }}>
                                {/* Left: T-Shirt Thumbnail */}
                                <div style={{ width: '60px', height: '60px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)', flexShrink: 0 }}>
                                    {order.items[0]?.front_images?.length > 0 ? (
                                        <img src={order.items[0].front_images[0].url} alt="thumb" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    ) : (
                                        <Layers size={24} style={{ opacity: 0.2 }} />
                                    )}
                                </div>

                                {/* Mid: Order info */}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 }}>
                                    <span style={{ color: '#666', fontSize: '0.72rem' }}>
                                        ID: <span className="text-neon-cyan">{order._id}</span>
                                    </span>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <span style={{ color: '#ccc', fontWeight: 'bold', fontSize: '0.9rem' }}>
                                            {order.userId?.name || 'Unknown Customer'}
                                        </span>
                                        <div style={{ display: 'flex', gap: '6px' }}>
                                            <a href={`tel:${order.userId?.phone_number}`} title="Call Customer" style={{ color: 'var(--neon-cyan)', opacity: 0.6 }} onClick={e => e.stopPropagation()}><Phone size={14} /></a>
                                            <a href={`https://wa.me/91${order.userId?.whatsapp_number || order.userId?.phone_number}`} target="_blank" rel="noreferrer" title="WhatsApp Customer" style={{ color: '#25D366', opacity: 0.6 }} onClick={e => e.stopPropagation()}><MessageSquare size={14} /></a>
                                        </div>
                                    </div>
                                    <span style={{ color: '#666', fontSize: '0.75rem' }}>
                                        {new Date(order.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}
                                        &nbsp;•&nbsp; {order.items.length} item(s)
                                        &nbsp;•&nbsp; <span className="text-neon-cyan" style={{ fontWeight: 'bold' }}>${order.totalPrice.toFixed(2)}</span>
                                    </span>
                                </div>

                                {/* Right: Status badge + dropdown + expand */}
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                                    <div style={{
                                        display: 'flex', alignItems: 'center', gap: '6px',
                                        background: `${getStatusColor(order.status)}18`,
                                        border: `1px solid ${getStatusColor(order.status)}40`,
                                        padding: '5px 12px', borderRadius: '20px'
                                    }}>
                                        {getStatusIcon(order.status)}
                                        <span style={{ fontSize: '0.72rem', fontWeight: 'bold', fontFamily: 'Orbitron, sans-serif', color: getStatusColor(order.status) }}>
                                            {order.status.toUpperCase()}
                                        </span>
                                    </div>

                                    {order.payment && (
                                        <div style={{
                                            display: 'flex', alignItems: 'center', gap: '6px',
                                            background: order.payment.status === 'SUCCESS' ? '#25D36620' : order.payment.status === 'FAILED' ? '#ff555520' : order.payment.status === 'VERIFICATION_PENDING' ? '#00fff920' : '#ffff0020',
                                            border: `1px solid ${order.payment.status === 'SUCCESS' ? '#25D36640' : order.payment.status === 'FAILED' ? '#ff555540' : order.payment.status === 'VERIFICATION_PENDING' ? '#00fff940' : '#ffff0040'}`,
                                            padding: '5px 12px', borderRadius: '20px'
                                        }}>
                                            <span style={{ fontSize: '0.72rem', fontWeight: 'bold', fontFamily: 'Orbitron, sans-serif', color: order.payment.status === 'SUCCESS' ? '#25D366' : order.payment.status === 'FAILED' ? '#ff5555' : order.payment.status === 'VERIFICATION_PENDING' ? 'var(--neon-cyan)' : 'yellow' }}>
                                                {order.payment.status === 'SUCCESS' ? '💰 PAID' : order.payment.status === 'FAILED' ? '❌ FAILED' : order.payment.status === 'VERIFICATION_PENDING' ? '⏳ VERIFY' : '⏳ PENDING'}
                                            </span>
                                        </div>
                                    )}

                                    {order.status !== 'Cancelled' && (
                                        <select
                                            value={order.status}
                                            onChange={e => updateStatus(order._id, e.target.value)}
                                            style={{
                                                background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.15)',
                                                color: 'white', padding: '6px 12px', borderRadius: '6px',
                                                cursor: 'pointer', fontSize: '0.78rem', fontWeight: 'bold'
                                            }}
                                        >
                                            <option value="Pending">Pending</option>
                                            <option value="Processing">Processing</option>
                                            <option value="Shipped">Shipped</option>
                                            <option value="Delivered">Delivered</option>
                                        </select>
                                    )}

                                    <button
                                        onClick={() => setExpanded(expanded === order._id ? null : order._id)}
                                        style={{
                                            padding: '6px 14px', background: 'transparent',
                                            border: '1px solid rgba(255,255,255,0.2)', color: '#ccc',
                                            borderRadius: '6px', cursor: 'pointer', fontSize: '0.75rem',
                                            transition: 'all 0.3s'
                                        }}
                                    >
                                        {expanded === order._id ? 'Hide Details ▲' : 'View Details ▼'}
                                    </button>
                                </div>
                            </div>

                            {/* Expanded Detail View */}
                            {expanded === order._id && (
                                <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '20px' }}>
                                    {/* Order Items */}
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                                        {order.items.map((item, i) => (
                                            <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }} className="flex-mobile-col">

                                                {/* Left: Front View */}
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                                    <p style={{ color: 'var(--neon-cyan)', fontSize: '0.65rem', fontFamily: 'Orbitron', textAlign: 'center' }}>FRONT DESIGN</p>
                                                    <TShirtPreview
                                                        color={item.color}
                                                        fitType={item.fit_type || 'NORMAL_FIT'}
                                                        frontImages={item.front_images || []}
                                                        backImages={[]}
                                                        controlledSide="front"
                                                        showToggle={false}
                                                        style={{ width: '100%' }}
                                                    />
                                                </div>

                                                {/* Right: Back View */}
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                                    <p style={{ color: 'var(--neon-pink)', fontSize: '0.65rem', fontFamily: 'Orbitron', textAlign: 'center' }}>BACK DESIGN</p>
                                                    <TShirtPreview
                                                        color={item.color}
                                                        fitType={item.fit_type || 'NORMAL_FIT'}
                                                        frontImages={[]}
                                                        backImages={item.back_images || []}
                                                        controlledSide="back"
                                                        showToggle={false}
                                                        style={{ width: '100%' }}
                                                    />
                                                </div>

                                                {/* Item Details - Spans full width below previews */}
                                                <div style={{ gridColumn: 'span 2', display: 'flex', flexWrap: 'wrap', gap: '20px', background: 'rgba(255,255,255,0.02)', padding: '15px', borderRadius: '8px' }} className="flex-mobile-col">
                                                    <div><span style={{ color: '#666', fontSize: '0.75rem' }}>Size: </span><span style={{ color: 'white', fontWeight: 'bold' }}>{item.size}</span></div>
                                                    <div><span style={{ color: '#666', fontSize: '0.75rem' }}>Qty: </span><span style={{ color: 'white', fontWeight: 'bold' }}>{item.quantity}</span></div>
                                                    <div><span style={{ color: '#666', fontSize: '0.75rem' }}>Fit: </span><span style={{ color: 'white', fontWeight: 'bold' }}>{item.fit_type}</span></div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Client Note - Prominent */}
                                    {order.client_note && (
                                        <div style={{ marginTop: '24px', padding: '16px', background: 'rgba(255, 230, 0, 0.08)', border: '2px solid rgba(255, 230, 0, 0.3)', borderRadius: '10px', boxShadow: '0 0 15px rgba(255, 230, 0, 0.1)' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                                                <span style={{ color: '#ffe600', padding: '4px 8px', borderRadius: '4px', background: 'rgba(255, 230, 0, 0.2)', fontSize: '0.65rem', fontWeight: 'bold', fontFamily: 'Orbitron' }}>CLIENT INSTRUCTION / NOTE</span>
                                            </div>
                                            <p style={{ color: 'white', fontSize: '0.95rem', fontStyle: 'italic', lineHeight: '1.4' }}>"{order.client_note}"</p>
                                        </div>
                                    )}

                                    {/* Design Files Section */}
                                    <div style={{ marginTop: '24px', padding: '24px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                                            <h3 className="font-orbitron" style={{ fontSize: '0.9rem', color: 'var(--neon-cyan)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <Layers size={18} /> CLIENT DESIGN FILES
                                            </h3>
                                            <button
                                                onClick={() => downloadAllDesigns(order)}
                                                style={{
                                                    padding: '8px 16px', background: 'rgba(0, 255, 249, 0.1)', border: '1px dashed var(--neon-cyan)',
                                                    color: 'var(--neon-cyan)', borderRadius: '6px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 'bold'
                                                }}
                                            >
                                                <Download size={14} /> Download All (ZIP)
                                            </button>
                                        </div>

                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }} className="flex-mobile-col">
                                            {/* Front Side Designs */}
                                            <div style={{ background: 'rgba(0,0,0,0.3)', padding: '15px', borderRadius: '10px' }}>
                                                <p style={{ color: '#999', fontSize: '0.65rem', fontFamily: 'Orbitron', marginBottom: '12px', borderBottom: '1px solid rgba(255,255,255,0.05)', pb: '8px' }}>FRONT SIDE</p>
                                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                                                    {order.items.flatMap(item => item.front_images || []).length > 0 ? (
                                                        order.items.flatMap(item => item.front_images || []).map((img, idx) => (
                                                            <div key={idx} style={{ position: 'relative', width: '80px' }}>
                                                                <img src={img.url} alt="front" style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '6px', background: '#111' }} />
                                                                <div style={{ display: 'flex', gap: '4px', marginTop: '6px' }}>
                                                                    <button onClick={() => setLightbox({ isOpen: true, url: img.url, side: 'FRONT' })} className="btn-icon" style={{ flex: 1, padding: '4px' }} title="View"><Eye size={12} /></button>
                                                                    <button onClick={() => downloadImage(img.url, `NEONTHREADS_${order._id}_Front_${idx + 1}`)} className="btn-icon" style={{ flex: 1, padding: '4px' }} title="Download"><Download size={12} /></button>
                                                                </div>
                                                            </div>
                                                        ))
                                                    ) : <p style={{ color: '#444', fontSize: '0.75rem' }}>No front designs</p>}
                                                </div>
                                            </div>

                                            {/* Back Side Designs */}
                                            <div style={{ background: 'rgba(0,0,0,0.3)', padding: '15px', borderRadius: '10px' }}>
                                                <p style={{ color: '#999', fontSize: '0.65rem', fontFamily: 'Orbitron', marginBottom: '12px', borderBottom: '1px solid rgba(255,255,255,0.05)', pb: '8px' }}>BACK SIDE</p>
                                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                                                    {order.items.flatMap(item => item.back_images || []).length > 0 ? (
                                                        order.items.flatMap(item => item.back_images || []).map((img, idx) => (
                                                            <div key={idx} style={{ position: 'relative', width: '80px' }}>
                                                                <img src={img.url} alt="back" style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '6px', background: '#111' }} />
                                                                <div style={{ display: 'flex', gap: '4px', marginTop: '6px' }}>
                                                                    <button onClick={() => setLightbox({ isOpen: true, url: img.url, side: 'BACK' })} className="btn-icon" style={{ flex: 1, padding: '4px' }} title="View"><Eye size={12} /></button>
                                                                    <button onClick={() => downloadImage(img.url, `NEONTHREADS_${order._id}_Back_${idx + 1}`)} className="btn-icon" style={{ flex: 1, padding: '4px' }} title="Download"><Download size={12} /></button>
                                                                </div>
                                                            </div>
                                                        ))
                                                    ) : <p style={{ color: '#444', fontSize: '0.75rem' }}>No back designs</p>}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Shipping Address */}
                                    <div style={{ marginTop: '24px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }} className="flex-mobile-col">
                                        {/* Contact Section */}
                                        <div style={{ padding: '16px', background: 'rgba(255,255,255,0.03)', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.06)' }}>
                                            <p style={{ color: '#666', fontSize: '0.72rem', fontFamily: 'Orbitron', marginBottom: '12px' }}>👤 CLIENT CONTACT</p>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                                <div>
                                                    <span style={{ color: '#777', fontSize: '0.7rem' }}>NAME</span>
                                                    <p style={{ color: 'white', fontWeight: 'bold' }}>{order.userId?.name || 'N/A'}</p>
                                                </div>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                    <div>
                                                        <span style={{ color: '#777', fontSize: '0.7rem' }}>📱 PHONE</span>
                                                        <p style={{ color: 'white' }}>{order.userId?.phone_number || 'N/A'}</p>
                                                    </div>
                                                    <div style={{ display: 'flex', gap: '8px' }}>
                                                        <button onClick={() => { navigator.clipboard.writeText(order.userId?.phone_number); toast.success("Copied!"); }} className="btn-icon" title="Copy"><Copy size={12} /></button>
                                                        <a href={`tel:${order.userId?.phone_number}`} className="btn-icon" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }} title="Call"><Phone size={12} /></a>
                                                    </div>
                                                </div>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                    <div>
                                                        <span style={{ color: '#777', fontSize: '0.7rem' }}>💬 WHATSAPP</span>
                                                        <p style={{ color: '#25D366', fontWeight: 'bold' }}>{order.userId?.whatsapp_number || order.userId?.phone_number || 'N/A'}</p>
                                                    </div>
                                                    <a
                                                        href={`https://wa.me/91${order.userId?.whatsapp_number || order.userId?.phone_number}?text=${encodeURIComponent(`Hello ${order.userId?.name || 'Customer'},\n\nRegarding your NEONTHREADS order #${order._id}...`)}`}
                                                        target="_blank" rel="noreferrer" className="btn-icon" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#25D36620', border: '1px solid #25D36640' }} title="Chat"
                                                    >
                                                        <MessageSquare size={12} style={{ color: '#25D366' }} />
                                                    </a>
                                                </div>
                                            </div>
                                        </div>

                                        <div style={{ padding: '16px', background: 'rgba(255,255,255,0.03)', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.06)' }}>
                                            <p style={{ color: '#666', fontSize: '0.72rem', fontFamily: 'Orbitron', marginBottom: '8px' }}>SHIPPING ADDRESS</p>
                                            <p style={{ color: '#ccc', fontSize: '0.85rem' }}>
                                                {order.shippingAddress?.street}, {order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.zipCode}, {order.shippingAddress?.country}
                                            </p>
                                        </div>

                                        {/* Payment Section */}
                                        {order.payment && (
                                            <div style={{ padding: '16px', background: 'rgba(255,255,255,0.03)', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.06)' }}>
                                                <p style={{ color: '#666', fontSize: '0.72rem', fontFamily: 'Orbitron', marginBottom: '12px' }}>PAYMENT DETAILS</p>
                                                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(100px, 1fr) minmax(100px, 1fr)', gap: '10px' }}>
                                                    <div><span style={{ color: '#999', fontSize: '0.7rem' }}>Status</span><br /><span style={{ color: 'white', fontWeight: 'bold', fontSize: '0.85rem' }}>{order.payment.status}</span></div>
                                                    <div><span style={{ color: '#999', fontSize: '0.7rem' }}>Amount</span><br /><span style={{ color: 'white', fontWeight: 'bold', fontSize: '0.85rem' }}>{formatINR(order.payment.amount || order.totalPrice)}</span></div>
                                                    {order.payment.utr_number && (
                                                        <div style={{ gridColumn: 'span 2', marginTop: '5px' }}>
                                                            <span style={{ color: '#999', fontSize: '0.7rem' }}>UTR Number</span><br />
                                                            <span style={{ color: 'var(--neon-cyan)', fontWeight: 'bold', fontSize: '1.1rem', letterSpacing: '1px' }}>{order.payment.utr_number}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Action row */}
                                    <div style={{ marginTop: '20px', display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                                        {order.payment?.status === 'VERIFICATION_PENDING' && (
                                            <>
                                                <button
                                                    onClick={() => handlePaymentAction(order._id, 'SUCCESS')}
                                                    style={{
                                                        padding: '10px 20px', background: 'var(--neon-green)', border: 'none',
                                                        color: 'black', borderRadius: '8px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 'bold'
                                                    }}
                                                >
                                                    ✅ Confirm Payment
                                                </button>
                                                <button
                                                    onClick={() => handlePaymentAction(order._id, 'FAILED')}
                                                    style={{
                                                        padding: '10px 20px', background: '#ff5555', border: 'none',
                                                        color: 'white', borderRadius: '8px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 'bold'
                                                    }}
                                                >
                                                    ❌ Reject Payment
                                                </button>
                                            </>
                                        )}
                                        <button
                                            onClick={() => openWaModal(order)}
                                            className="btn-mobile-full"
                                            style={{
                                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                                                padding: '10px 16px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.2)',
                                                color: '#ccc', borderRadius: '8px', cursor: 'pointer', fontSize: '0.85rem'
                                            }}
                                        >
                                            <MessageCircle size={16} /> Send WhatsApp Update
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>

            {/* WA Modal */}
            {waModal.isOpen && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
                    background: 'rgba(0,0,0,0.8)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                    <div className="glassmorphism" style={{ padding: '30px', width: '100%', maxWidth: '500px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h2 className="neon-cyan" style={{ fontSize: '1.2rem', fontFamily: 'Orbitron' }}>Send Manual Update</h2>
                            <button onClick={() => setWaModal({ isOpen: false, order: null, text: '' })} style={{ background: 'none', border: 'none', color: '#ff5555', cursor: 'pointer' }}>
                                <X size={24} />
                            </button>
                        </div>
                        <p style={{ color: '#ccc', fontSize: '0.85rem' }}>
                            To: {waModal.order?.userId?.name} ({waModal.order?.userId?.whatsapp_number || waModal.order?.userId?.phone_number || 'Unknown'})
                        </p>
                        <textarea
                            value={waModal.text}
                            onChange={(e) => setWaModal({ ...waModal, text: e.target.value })}
                            rows={5}
                            style={{
                                width: '100%', padding: '12px', background: 'rgba(0,0,0,0.4)',
                                border: '1px solid #25D366', borderRadius: '8px', color: 'white', outline: 'none', resize: 'vertical'
                            }}
                        />
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                            <button onClick={() => setWaModal({ isOpen: false, order: null, text: '' })} style={{ padding: '8px 16px', background: 'transparent', border: '1px solid #666', color: '#ccc', borderRadius: '6px', cursor: 'pointer' }}>
                                Cancel
                            </button>
                            <button onClick={sendManualWaMessage} style={{ padding: '8px 16px', background: '#25D366', border: 'none', color: '#000', fontWeight: 'bold', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <MessageCircle size={16} /> Send
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {/* Lightbox Modal */}
            {lightbox.isOpen && (
                <div
                    onClick={() => setLightbox({ isOpen: false, url: '', side: '' })}
                    style={{
                        position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
                        background: 'rgba(0,0,0,0.95)', zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center',
                        flexDirection: 'column', gap: '20px', padding: '40px'
                    }}
                >
                    <div style={{ position: 'relative', maxWidth: '90vw', maxHeight: '80vh' }}>
                        <img src={lightbox.url} alt="enlarged" style={{ maxWidth: '100%', maxHeight: '80vh', objectFit: 'contain', border: '2px solid var(--neon-cyan)' }} />
                        <button
                            onClick={() => setLightbox({ isOpen: false, url: '', side: '' })}
                            style={{ position: 'absolute', top: '-40px', right: '0', background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}
                        >
                            <X size={32} />
                        </button>
                    </div>
                    <div className="font-orbitron neon-cyan" style={{ fontSize: '1.2rem' }}>
                        {lightbox.side} SIDE DESIGN
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminOrdersPage;
