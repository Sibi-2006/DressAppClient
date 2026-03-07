import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Save, Send, Settings as SettingsIcon, MessageCircle } from 'lucide-react';
import api from '../utils/api';
import toast from 'react-hot-toast';

const AdminSettingsNotificationsPage = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const [settings, setSettings] = useState({
        whatsappSender: '+917598382584',
        twilioSid: '',
        twilioAuthToken: '',
        templates: {
            Pending: '', Processing: '', Shipped: '', Delivered: '', Cancelled: ''
        }
    });

    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [testNumber, setTestNumber] = useState('');
    const [toastConfig, setToastConfig] = useState({
        active: true,
        message: '',
        type: 'info',
        accent_color: '#00ffff'
    });
    const [savingToast, setSavingToast] = useState(false);

    useEffect(() => {
        if (!user || user.role !== 'admin') {
            navigate('/');
            return;
        }

        const loadSettings = async () => {
            try {
                const { data } = await api.get('/admin/settings');
                if (data) {
                    setSettings({
                        whatsappSender: data.whatsappSender || '+917598382584',
                        twilioSid: data.twilioSid || '',
                        twilioAuthToken: data.twilioAuthToken || '',
                        templates: data.templates || {
                            Pending: '', Processing: '', Shipped: '', Delivered: '', Cancelled: ''
                        }
                    });
                }
                const [logsRes, toastRes] = await Promise.all([
                    api.get('/admin/settings/notifications'),
                    api.get('/admin/toast-message')
                ]);
                setLogs(logsRes.data || []);
                if (toastRes.data) setToastConfig(toastRes.data);
            } catch (error) {
                toast.error('Failed to load settings');
            } finally {
                setLoading(false);
            }
        };

        loadSettings();
    }, [user, navigate]);

    const handleSave = async () => {
        setSaving(true);
        try {
            await api.put('/admin/settings', settings);
            toast.success('Settings saved successfully');
        } catch (error) {
            toast.error('Failed to save settings');
        } finally {
            setSaving(false);
        }
    };

    const handleTemplateChange = (status, val) => {
        setSettings(prev => ({
            ...prev,
            templates: { ...prev.templates, [status]: val }
        }));
    };

    const handleTestMessage = async () => {
        if (!testNumber) {
            toast.error('Enter a valid phone number for testing');
            return;
        }
        try {
            const res = await toast.promise(
                api.post('/admin/settings/test-whatsapp', { testNumber }),
                { loading: 'Sending test...', success: 'Test sent!', error: 'Test failed!' }
            );
        } catch (error) {
            console.error(error);
        }
    };

    const handleSaveToast = async () => {
        setSavingToast(true);
        try {
            await api.patch('/admin/toast-message', toastConfig);
            toast.success('Toast settings updated!');
        } catch (error) {
            toast.error('Failed to update toast');
        } finally {
            setSavingToast(false);
        }
    };

    if (loading) return <div className="container" style={{ padding: '80px', textAlign: 'center' }}>Loading Settings...</div>;

    return (
        <div className="container" style={{ padding: '40px 15px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '30px' }}>
                <SettingsIcon size={32} />
                <h1 className="font-orbitron neon-cyan" style={{ fontSize: 'clamp(1.5rem, 4vw, 2.2rem)', fontWeight: 'bold' }}>
                    NOTIFICATIONS <span className="neon-pink">CONFIG</span>
                </h1>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '30px' }}>

                {/* Section 1: WhatsApp API Config */}
                <div className="glassmorphism" style={{ padding: '24px' }}>
                    <h3 className="font-orbitron" style={{ color: '#ccc', marginBottom: '20px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '10px' }}>WhatsApp API Config</h3>

                    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(250px, 1fr) minmax(250px, 1fr)', gap: '20px', marginBottom: '20px' }}>
                        <div>
                            <label style={{ color: '#999', fontSize: '0.85rem', marginBottom: '8px', display: 'block' }}>Sender WhatsApp Number</label>
                            <input
                                type="text"
                                value={settings.whatsappSender}
                                onChange={(e) => setSettings({ ...settings, whatsappSender: e.target.value })}
                                style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '6px', color: 'white', outline: 'none' }}
                            />
                        </div>
                        <div>
                            <label style={{ color: '#999', fontSize: '0.85rem', marginBottom: '8px', display: 'block' }}>Twilio Account SID</label>
                            <input
                                type="text"
                                value={settings.twilioSid}
                                onChange={(e) => setSettings({ ...settings, twilioSid: e.target.value })}
                                style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '6px', color: 'white', outline: 'none' }}
                            />
                        </div>
                        <div>
                            <label style={{ color: '#999', fontSize: '0.85rem', marginBottom: '8px', display: 'block' }}>Twilio Auth Token</label>
                            <input
                                type="password"
                                value={settings.twilioAuthToken}
                                onChange={(e) => setSettings({ ...settings, twilioAuthToken: e.target.value })}
                                style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '6px', color: 'white', outline: 'none' }}
                            />
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '15px', marginTop: '20px', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '20px', flexWrap: 'wrap' }}>
                        <button onClick={handleSave} disabled={saving} className="btn btn-cyan" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Save size={18} /> {saving ? 'Saving...' : 'Save Settings'}
                        </button>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(255,255,255,0.03)', padding: '5px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)' }}>
                            <input
                                type="text"
                                placeholder="Test mobile No. (e.g. 9876543210)"
                                value={testNumber}
                                onChange={(e) => setTestNumber(e.target.value)}
                                style={{ padding: '8px', background: 'transparent', border: 'none', color: 'white', outline: 'none', width: '220px' }}
                            />
                            <button onClick={handleTestMessage} className="btn-outline-purple" style={{ padding: '8px 16px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <MessageCircle size={16} /> Test API
                            </button>
                        </div>
                    </div>
                </div>

                {/* Section 2: Message Templates */}
                <div className="glassmorphism" style={{ padding: '24px' }}>
                    <h3 className="font-orbitron" style={{ color: '#ccc', marginBottom: '10px' }}>Message Templates</h3>
                    <p style={{ color: '#999', fontSize: '0.8rem', marginBottom: '20px' }}>
                        Use placeholders <code style={{ background: '#333', padding: '2px 6px', borderRadius: '4px', color: 'var(--neon-cyan)' }}>[Client Name]</code> and <code style={{ background: '#333', padding: '2px 6px', borderRadius: '4px', color: 'var(--neon-pink)' }}>[Order ID]</code> for dynamic text injection.
                    </p>

                    <div style={{ display: 'grid', gap: '20px' }}>
                        {['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map(status => (
                            <div key={status}>
                                <label style={{ color: 'white', fontSize: '0.9rem', marginBottom: '8px', display: 'block', fontWeight: 'bold' }}>{status} Stage Template:</label>
                                <textarea
                                    value={settings.templates[status]}
                                    onChange={(e) => handleTemplateChange(status, e.target.value)}
                                    rows={3}
                                    style={{ width: '100%', padding: '12px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '6px', color: '#ccc', outline: 'none', fontFamily: 'monospace', resize: 'vertical' }}
                                />
                            </div>
                        ))}
                    </div>
                    <button onClick={handleSave} disabled={saving} className="btn btn-cyan" style={{ marginTop: '24px', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                        <Save size={18} /> Update Templates
                    </button>
                </div>

                {/* Section 3: Homepage Toast Config */}
                <div className="glassmorphism" style={{ padding: '24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                        <MessageCircle size={20} className="text-neon-pink" />
                        <h3 className="font-orbitron" style={{ color: '#ccc' }}>HOMEPAGE TOAST BAR</h3>
                    </div>

                    <div style={{ display: 'grid', gap: '20px' }}>
                        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                            <span style={{ color: '#999', fontSize: '0.9rem' }}>Status:</span>
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <button
                                    onClick={() => setToastConfig({ ...toastConfig, active: true })}
                                    style={{
                                        padding: '6px 15px', borderRadius: '4px', border: '1px solid #333',
                                        background: toastConfig.active ? 'var(--neon-green)' : 'transparent',
                                        color: toastConfig.active ? 'black' : '#666', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 'bold'
                                    }}
                                >
                                    ● ON
                                </button>
                                <button
                                    onClick={() => setToastConfig({ ...toastConfig, active: false })}
                                    style={{
                                        padding: '6px 15px', borderRadius: '4px', border: '1px solid #333',
                                        background: !toastConfig.active ? '#ff555520' : 'transparent',
                                        color: !toastConfig.active ? '#ff5555' : '#666', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 'bold'
                                    }}
                                >
                                    ○ OFF
                                </button>
                            </div>
                        </div>

                        <div>
                            <label style={{ color: '#999', fontSize: '0.85rem', marginBottom: '8px', display: 'flex', justifyContent: 'space-between' }}>
                                Message Text
                                <span style={{ color: toastConfig.message.length > 150 ? '#ff5555' : '#666' }}>{toastConfig.message.length} / 150</span>
                            </label>
                            <textarea
                                value={toastConfig.message}
                                onChange={(e) => setToastConfig({ ...toastConfig, message: e.target.value.substring(0, 150) })}
                                rows={2}
                                style={{
                                    width: '100%', padding: '12px', background: 'rgba(0,0,0,0.3)',
                                    border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', color: 'white', outline: 'none'
                                }}
                                placeholder="Enter welcome message..."
                            />
                        </div>

                        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                            <span style={{ color: '#999', fontSize: '0.9rem' }}>Accent Color:</span>
                            <div style={{ display: 'flex', gap: '10px' }}>
                                {[
                                    { label: 'Cyan', color: '#00ffff' },
                                    { label: 'Pink', color: '#ff00aa' }
                                ].map(c => (
                                    <button
                                        key={c.label}
                                        onClick={() => setToastConfig({ ...toastConfig, accent_color: c.color })}
                                        style={{
                                            padding: '6px 15px', borderRadius: '4px', border: `1px solid ${c.color}44`,
                                            background: toastConfig.accent_color === c.color ? c.color : 'transparent',
                                            color: toastConfig.accent_color === c.color ? 'black' : c.color,
                                            cursor: 'pointer', fontSize: '0.75rem', fontWeight: 'bold'
                                        }}
                                    >
                                        {c.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div style={{ marginTop: '10px' }}>
                            <label style={{ color: '#666', fontSize: '0.75rem', marginBottom: '10px', display: 'block' }}>Preview:</label>
                            <div style={{
                                padding: '15px', background: '#1a1a1a', borderRadius: '8px', borderLeft: `4px solid ${toastConfig.accent_color}`,
                                display: 'flex', justifyContent: 'space-between', alignItems: 'center', opacity: toastConfig.active ? 1 : 0.5
                            }}>
                                <span style={{ fontSize: '0.85rem', color: 'white' }}>👋 {toastConfig.message || 'Your message here...'}</span>
                                <span style={{ color: '#444', fontSize: '0.75rem' }}>[×] Close</span>
                            </div>
                        </div>

                        <button
                            onClick={handleSaveToast}
                            disabled={savingToast}
                            className="btn btn-pink"
                            style={{ marginTop: '10px', width: '100%' }}
                        >
                            <Save size={18} style={{ marginRight: '10px' }} />
                            {savingToast ? 'Saving...' : 'Save Toast Settings'}
                        </button>
                    </div>
                </div>

                {/* Section 4: Notification Logs */}
                <div className="glassmorphism" style={{ padding: '24px', overflowX: 'auto' }}>
                    <h3 className="font-orbitron" style={{ color: '#ccc', marginBottom: '20px' }}>Notification Log</h3>
                    {logs.length === 0 ? (
                        <p style={{ color: '#666', textAlign: 'center', padding: '20px' }}>No logs yet.</p>
                    ) : (
                        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '600px' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', color: '#999', fontSize: '0.8rem', textAlign: 'left' }}>
                                    <th style={{ padding: '12px' }}>Time</th>
                                    <th>Client</th>
                                    <th>Phone #</th>
                                    <th>Status Triggered</th>
                                    <th style={{ textAlign: 'right', paddingRight: '12px' }}>Result</th>
                                </tr>
                            </thead>
                            <tbody>
                                {logs.map(log => (
                                    <tr key={log._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', fontSize: '0.85rem' }}>
                                        <td style={{ padding: '12px', color: '#666' }}>{new Date(log.createdAt).toLocaleString()}</td>
                                        <td style={{ color: 'white', fontWeight: 'bold' }}>{log.clientName}</td>
                                        <td style={{ color: '#ccc' }}>+91 {log.phone}</td>
                                        <td style={{ color: 'var(--neon-cyan)' }}>{log.statusSent}</td>
                                        <td style={{ textAlign: 'right', paddingRight: '12px', color: log.result === 'Sent' ? 'var(--neon-green)' : '#ff5555', fontWeight: 'bold' }}>
                                            {log.result === 'Sent' ? '✅ Sent' : '❌ Failed'}
                                            {log.result === 'Failed' && <div style={{ fontSize: '0.6rem', color: '#999' }}>{log.errorMessage?.substring(0, 30)}...</div>}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>

            </div>
        </div>
    );
};

export default AdminSettingsNotificationsPage;
