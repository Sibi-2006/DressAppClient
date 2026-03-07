import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { AuthContext } from '../context/AuthContext';
import { TrendingUp, Package, DollarSign, XCircle, Clock, ShoppingCart, Filter, CreditCard, AlertTriangle, Calendar } from 'lucide-react';

const AdminDashboardPage = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const [activeFilter, setActiveFilter] = useState('ALL');
    const [loading, setLoading] = useState(true);
    const [analytics, setAnalytics] = useState(null);

    useEffect(() => {
        if (!user || user.role !== 'admin') {
            navigate('/');
            return;
        }

        const fetchAnalytics = async () => {
            setLoading(true);
            try {
                const { data } = await api.get(`/admin/analytics?fit_type=${activeFilter}`);
                setAnalytics(data);
            } catch (error) {
                console.error('Error fetching analytics:', error);
                toast.error('Failed to load dashboard data');
            } finally {
                setLoading(false);
            }
        };

        fetchAnalytics();
    }, [activeFilter, user, navigate]);

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(amount);
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Pending': return 'var(--neon-purple)';
            case 'Processing': return '#3b82f6';
            case 'Shipped': return 'var(--neon-cyan)';
            case 'Delivered': return 'var(--neon-green)';
            case 'Cancelled': return '#ff5555';
            default: return 'white';
        }
    };

    if (loading) {
        return (
            <div className="container" style={{ padding: '80px', textAlign: 'center' }}>
                <p style={{ color: 'var(--neon-cyan)', fontFamily: 'Orbitron', fontSize: '1.2rem' }} className="pulse-bg">
                    Extracting Analytics Data...
                </p>
            </div>
        );
    }

    if (!analytics) return null;

    return (
        <div className="container" style={{ padding: '40px 15px' }}>
            <h1 className="font-orbitron neon-cyan" style={{ fontSize: 'clamp(1.4rem, 5vw, 2.2rem)', marginBottom: '8px', fontWeight: 'bold' }}>
                SYSTEM <span className="neon-pink">ANALYTICS</span>
            </h1>
            <p style={{ color: '#666', marginBottom: '32px', fontSize: '0.9rem' }}>Comprehensive overview and financial metrics.</p>

            {/* Filters */}
            <div style={{ display: 'flex', gap: '12px', marginBottom: '32px', flexWrap: 'wrap', alignItems: 'center' }}>
                <Filter size={18} style={{ color: '#999' }} />
                {[
                    { id: 'ALL', label: 'All Fits' },
                    { id: 'NORMAL_FIT', label: 'Normal Fit' },
                    { id: 'OVERSIZED_FIT', label: 'Oversized Fit' }
                ].map(f => (
                    <button
                        key={f.id}
                        onClick={() => setActiveFilter(f.id)}
                        style={{
                            padding: '8px 20px', borderRadius: '25px', cursor: 'pointer', fontWeight: 'bold',
                            fontSize: '0.8rem', fontFamily: 'Orbitron, sans-serif', letterSpacing: '1px',
                            background: activeFilter === f.id ? 'var(--neon-cyan)' : 'rgba(255,255,255,0.03)',
                            color: activeFilter === f.id ? 'var(--dark-bg)' : '#ccc',
                            border: `1px solid ${activeFilter === f.id ? 'var(--neon-cyan)' : 'rgba(255,255,255,0.1)'}`,
                            transition: 'all 0.3s',
                            boxShadow: activeFilter === f.id ? 'var(--shadow-cyan)' : 'none'
                        }}
                    >
                        {f.label}
                    </button>
                ))}
            </div>

            {/* KPI Cards */}
            <div className="grid-kpi-cards" style={{ marginBottom: '40px' }}>

                <div className="glassmorphism" style={{ padding: '24px', borderTop: '3px solid var(--neon-purple)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                        <h3 style={{ color: '#999', fontSize: '0.85rem', fontWeight: 'bold', textTransform: 'uppercase' }}>Total Orders</h3>
                        <ShoppingCart size={20} style={{ color: 'var(--neon-purple)' }} />
                    </div>
                    <span className="font-orbitron" style={{ fontSize: '2rem', fontWeight: 'bold', color: 'white' }}>{analytics.totalOrders}</span>
                </div>

                <div className="glassmorphism" style={{ padding: '24px', borderTop: '3px solid var(--neon-green)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                        <h3 style={{ color: '#999', fontSize: '0.85rem', fontWeight: 'bold', textTransform: 'uppercase' }}>Total Revenue</h3>
                        <DollarSign size={20} style={{ color: 'var(--neon-green)' }} />
                    </div>
                    <span className="font-orbitron neon-pink" style={{ fontSize: '2rem', fontWeight: 'bold' }}>
                        {formatCurrency(analytics.totalRevenue)}
                    </span>
                    <p style={{ color: '#666', fontSize: '0.7rem', marginTop: '8px' }}>From delivered orders</p>
                </div>

                <div className="glassmorphism" style={{ padding: '24px', borderTop: '3px solid var(--neon-cyan)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                        <h3 style={{ color: '#999', fontSize: '0.85rem', fontWeight: 'bold', textTransform: 'uppercase' }}>Pending Revenue</h3>
                        <TrendingUp size={20} style={{ color: 'var(--neon-cyan)' }} />
                    </div>
                    <span className="font-orbitron neon-cyan" style={{ fontSize: '2rem', fontWeight: 'bold' }}>
                        {formatCurrency(analytics.pendingRevenue)}
                    </span>
                    <p style={{ color: '#666', fontSize: '0.7rem', marginTop: '8px' }}>Pipeline & expected</p>
                </div>

                <div className="glassmorphism" style={{ padding: '24px', borderTop: '3px solid var(--neon-pink)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                        <h3 style={{ color: '#999', fontSize: '0.85rem', fontWeight: 'bold', textTransform: 'uppercase' }}>T-Shirts Sold</h3>
                        <Package size={20} style={{ color: 'var(--neon-pink)' }} />
                    </div>
                    <span className="font-orbitron" style={{ fontSize: '2rem', fontWeight: 'bold', color: 'white' }}>{analytics.totalTshirtsSold}</span>
                    <p style={{ color: '#666', fontSize: '0.7rem', marginTop: '8px' }}>Units delivered</p>
                </div>

                <div className="glassmorphism" style={{ padding: '24px', borderTop: '3px solid #ff5555' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                        <h3 style={{ color: '#999', fontSize: '0.85rem', fontWeight: 'bold', textTransform: 'uppercase' }}>Cancelled</h3>
                        <XCircle size={20} style={{ color: '#ff5555' }} />
                    </div>
                    <span className="font-orbitron" style={{ fontSize: '2rem', fontWeight: 'bold', color: 'white' }}>{analytics.cancelledOrders}</span>
                    <p style={{ color: '#ff5555', fontSize: '0.7rem', marginTop: '8px' }}>Rate: {analytics.cancellationRate}</p>
                </div>

            </div>

            {/* Payment KPI Cards */}
            <h3 className="font-orbitron neon-pink" style={{ fontSize: '1.2rem', marginBottom: '16px' }}>PAYMENT METRICS</h3>
            <div className="grid-kpi-cards" style={{ marginBottom: '40px', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
                <div className="glassmorphism" style={{ padding: '24px', borderTop: '3px solid var(--neon-green)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                        <h3 style={{ color: '#999', fontSize: '0.85rem', fontWeight: 'bold', textTransform: 'uppercase' }}>Total Collected</h3>
                        <CreditCard size={20} style={{ color: 'var(--neon-green)' }} />
                    </div>
                    <span className="font-orbitron neon-pink" style={{ fontSize: '2rem', fontWeight: 'bold' }}>
                        {formatCurrency(analytics.paymentStats?.totalCollected || 0)}
                    </span>
                    <p style={{ color: '#666', fontSize: '0.7rem', marginTop: '8px' }}>From paid orders</p>
                </div>

                <div className="glassmorphism" style={{ padding: '24px', borderTop: '3px solid var(--neon-cyan)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                        <h3 style={{ color: '#999', fontSize: '0.85rem', fontWeight: 'bold', textTransform: 'uppercase' }}>Today's Drop</h3>
                        <Calendar size={20} style={{ color: 'var(--neon-cyan)' }} />
                    </div>
                    <span className="font-orbitron neon-cyan" style={{ fontSize: '2rem', fontWeight: 'bold' }}>
                        {formatCurrency(analytics.paymentStats?.todaysCollection || 0)}
                    </span>
                    <p style={{ color: '#666', fontSize: '0.7rem', marginTop: '8px' }}>Collected today</p>
                </div>

                <div className="glassmorphism" style={{ padding: '24px', borderTop: '3px solid yellow' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                        <h3 style={{ color: '#999', fontSize: '0.85rem', fontWeight: 'bold', textTransform: 'uppercase' }}>Pending Payments</h3>
                        <TrendingUp size={20} style={{ color: 'yellow' }} />
                    </div>
                    <span className="font-orbitron" style={{ fontSize: '2rem', fontWeight: 'bold', color: 'yellow' }}>
                        {formatCurrency(analytics.paymentStats?.pendingPaymentsAmount || 0)}
                    </span>
                    <p style={{ color: '#666', fontSize: '0.7rem', marginTop: '8px' }}>Awaiting callback</p>
                </div>

                <div className="glassmorphism" style={{ padding: '24px', borderTop: '3px solid #ff5555' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                        <h3 style={{ color: '#999', fontSize: '0.85rem', fontWeight: 'bold', textTransform: 'uppercase' }}>Failed Payments</h3>
                        <AlertTriangle size={20} style={{ color: '#ff5555' }} />
                    </div>
                    <span className="font-orbitron" style={{ fontSize: '2rem', fontWeight: 'bold', color: '#ff5555' }}>
                        {analytics.paymentStats?.failedCount || 0}
                    </span>
                    <p style={{ color: '#666', fontSize: '0.7rem', marginTop: '8px' }}>Unsuccessful transactions</p>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px', marginBottom: '40px' }} className="flex-mobile-col">

                {/* Status Breakdown Row */}
                <div className="glassmorphism" style={{ padding: '24px' }}>
                    <h3 className="font-orbitron" style={{ fontSize: '1.1rem', marginBottom: '24px', color: '#ccc' }}>PIPELINE BREAKDOWN</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {[
                            { label: 'Pending', count: analytics.statusBreakdown.pending, color: 'var(--neon-purple)' },
                            { label: 'Processing', count: analytics.statusBreakdown.processing, color: '#3b82f6' },
                            { label: 'Shipped', count: analytics.statusBreakdown.shipped, color: 'var(--neon-cyan)' },
                            { label: 'Delivered', count: analytics.statusBreakdown.delivered, color: 'var(--neon-green)' },
                            { label: 'Cancelled', count: analytics.statusBreakdown.cancelled, color: '#ff5555' },
                        ].map(stat => (
                            <div key={stat.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: stat.color, boxShadow: `0 0 10px ${stat.color}` }}></div>
                                    <span style={{ color: '#999', fontWeight: 'bold', fontSize: '0.9rem' }}>{stat.label}</span>
                                </div>
                                <span className="font-orbitron" style={{ color: 'white', fontWeight: 'bold', fontSize: '1.2rem' }}>{stat.count}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Revenue Summary Table */}
                <div className="glassmorphism" style={{ padding: '24px', overflowX: 'auto' }}>
                    <h3 className="font-orbitron" style={{ fontSize: '1.1rem', marginBottom: '24px', color: '#ccc' }}>FINANCIAL SUMMARY</h3>
                    <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '350px' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', color: '#666', fontSize: '0.8rem', textAlign: 'left' }}>
                                <th style={{ padding: '12px 0' }}>STATUS</th>
                                <th>ORDERS</th>
                                <th>UNITS</th>
                                <th style={{ textAlign: 'right' }}>REVENUE</th>
                            </tr>
                        </thead>
                        <tbody>
                            {analytics.revenueByStatus.map(row => (
                                <tr key={row.status} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', fontSize: '0.9rem' }}>
                                    <td style={{ padding: '16px 0', color: getStatusColor(row.status), fontWeight: 'bold' }}>{row.status}</td>
                                    <td style={{ color: '#ccc' }}>{row.orderCount}</td>
                                    <td style={{ color: '#ccc' }}>{row.quantity}</td>
                                    <td style={{ textAlign: 'right', fontWeight: 'bold', color: row.status === 'Delivered' ? 'var(--neon-green)' : 'white' }}>
                                        {formatCurrency(row.revenue)}
                                    </td>
                                </tr>
                            ))}
                            <tr style={{ fontSize: '1rem', background: 'rgba(255,255,255,0.02)' }}>
                                <td style={{ padding: '16px 8px', fontWeight: 'bold', color: 'white', borderRadius: '8px 0 0 8px' }}>TOTAL</td>
                                <td style={{ fontWeight: 'bold', color: 'var(--neon-cyan)' }}>{analytics.totalOrders}</td>
                                <td style={{ fontWeight: 'bold', color: 'var(--neon-pink)' }}>
                                    {analytics.revenueByStatus.reduce((acc, curr) => acc + curr.quantity, 0)}
                                </td>
                                <td style={{ textAlign: 'right', fontWeight: 'bold', color: 'var(--neon-green)', borderRadius: '0 8px 8px 0', paddingRight: '8px' }}>
                                    {formatCurrency(analytics.totalRevenue + analytics.pendingRevenue)}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

            </div>

            {/* Recent Orders Table */}
            <div className="glassmorphism admin-table-cards" style={{ padding: '24px', overflowX: 'auto' }}>
                <h3 className="font-orbitron" style={{ fontSize: '1.1rem', marginBottom: '24px', color: '#ccc' }}>RECENT DATALOG (LAST 10)</h3>
                {analytics.recentOrders.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>No records logic in this criteria.</div>
                ) : (
                    <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '100%' }}>
                        <thead>
                            <tr style={{ background: 'rgba(255,255,255,0.05)', color: '#999', fontSize: '0.8rem', textAlign: 'left', textTransform: 'uppercase' }}>
                                <th style={{ padding: '16px', borderRadius: '8px 0 0 8px' }}>Order ID</th>
                                <th>Client</th>
                                <th>Fit Type</th>
                                <th>Units</th>
                                <th>Amount</th>
                                <th>Date</th>
                                <th>Status</th>
                                <th style={{ borderRadius: '0 8px 8px 0', textAlign: 'right', paddingRight: '16px' }}>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {analytics.recentOrders.map(order => (
                                <tr key={order.orderId} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', fontSize: '0.85rem' }}>
                                    <td style={{ padding: '16px', color: '#666', fontFamily: 'monospace' }}>...{order.orderId.substring(order.orderId.length - 8)}</td>
                                    <td style={{ color: 'white', fontWeight: 'bold' }}>{order.clientName}</td>
                                    <td style={{ color: order.fitType === 'OVERSIZED_FIT' ? 'var(--neon-pink)' : 'var(--neon-cyan)' }}>
                                        {order.fitType === 'OVERSIZED_FIT' ? 'Oversized' : 'Normal'}
                                    </td>
                                    <td style={{ color: '#ccc' }}>{order.quantity}</td>
                                    <td style={{ color: 'white', fontWeight: 'bold' }}>{formatCurrency(order.amount)}</td>
                                    <td style={{ color: '#888' }}>{new Date(order.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                                    <td>
                                        <span style={{
                                            padding: '4px 10px', borderRadius: '20px', fontSize: '0.7rem', fontWeight: 'bold',
                                            background: `${getStatusColor(order.status)}20`,
                                            border: `1px solid ${getStatusColor(order.status)}50`,
                                            color: getStatusColor(order.status)
                                        }}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td style={{ textAlign: 'right', paddingRight: '16px' }}>
                                        <button
                                            onClick={() => navigate('/admin/orders')}
                                            style={{
                                                background: 'transparent', border: '1px solid rgba(255,255,255,0.2)',
                                                color: '#ccc', padding: '6px 14px', borderRadius: '6px', cursor: 'pointer',
                                                fontSize: '0.75rem', transition: 'all 0.3s'
                                            }}
                                            onMouseOver={(e) => Object.assign(e.target.style, { background: 'white', color: 'black' })}
                                            onMouseOut={(e) => Object.assign(e.target.style, { background: 'transparent', color: '#ccc' })}
                                        >
                                            View
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

        </div>
    );
};

export default AdminDashboardPage;
