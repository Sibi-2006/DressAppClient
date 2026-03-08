import React, { useState, useEffect, useContext } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
    Upload, X, CheckCircle, Eye, ShoppingCart, Layers,
    RotateCw, RotateCcw, FileText, ArrowUp, ArrowDown, ArrowLeft, ArrowRight,
    Maximize, Minus, Plus, Trash2, Move
} from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import api from '../utils/api';
import toast from 'react-hot-toast';
import TShirtPreview from '../components/TShirtPreview';
import NeonLoader from '../components/NeonLoader';

const useWindowWidth = () => {
    const [width, setWidth] = useState(window.innerWidth);
    useEffect(() => {
        const handleResize = () => setWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);
    return width;
};

const COLORS = ['Black', 'White', 'Blue', 'Purple'];
const SIZES = ['S', 'M', 'L', 'XL', '2XL'];

/* ────────────── Upload Zone ────────────── */
const UploadZone = ({ label, count, loading, progress, onUpload, onClearAll }) => (
    <div style={{
        border: `2px dashed ${count > 0 ? 'var(--neon-cyan)' : 'rgba(255,255,255,0.1)'}`,
        borderRadius: '12px', padding: '16px', textAlign: 'center',
        background: count > 0 ? 'rgba(0,255,249,0.04)' : 'rgba(255,255,255,0.02)',
        transition: 'all 0.3s', position: 'relative'
    }}>
        <p style={{ color: '#999', fontSize: '0.75rem', marginBottom: '10px', fontFamily: 'Orbitron, sans-serif', letterSpacing: '1px' }}>
            {label} ({count} LAYERS)
        </p>
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
            <button
                onClick={onUpload}
                disabled={loading}
                style={{
                    padding: '8px 16px', borderRadius: '8px', cursor: 'pointer',
                    background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                    color: 'white', display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem'
                }}
            >
                {loading ? <NeonLoader variant="spinner" /> : <Upload size={14} />}
                {loading ? 'Uploading...' : 'Add Image'}
            </button>
            {count > 0 && (
                <button
                    onClick={onClearAll}
                    style={{
                        padding: '8px 16px', borderRadius: '8px', cursor: 'pointer',
                        background: 'rgba(255,85,85,0.1)', border: '1px solid rgba(255,85,85,0.5)',
                        color: '#ff5555', display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem'
                    }}
                >
                    <X size={14} /> Clear All
                </button>
            )}
        </div>
        {loading && (
            <div style={{ marginTop: '12px', width: '100%', height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${progress}%`, background: 'var(--neon-cyan)', boxShadow: '0 0 8px var(--neon-cyan)', transition: 'width 0.3s' }} />
                <p style={{ fontSize: '0.65rem', color: 'var(--neon-cyan)', marginTop: '4px' }}>{progress}% Uploading...</p>
            </div>
        )}
    </div>
);

/* ─────────── Image Controls Toolbar ─────────── */
const ImageControlsToolbar = ({ selectedImage, onUpdate, onDelete, onMove, onCenter, onRotate }) => {
    if (!selectedImage) return null;

    const SIZE_PRESETS = {
        S: { w: 20, h: 20 },
        M: { w: 40, h: 40 },
        L: { w: 60, h: 60 },
        XL: { w: 80, h: 80 }
    };

    const sizePercent = Math.round(selectedImage.size.w);

    return (
        <div className="image-controls-toolbar glassmorphism" style={{
            width: '100%', padding: '16px', borderTop: '2px solid var(--neon-cyan)', borderRadius: '12px',
            marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '16px'
        }}>
            <style>{`
                .toolbar-section { display: flex; flex-direction: column; gap: 8px; }
                .toolbar-label { color: #888; font-size: 10px; letter-spacing: 2px; text-transform: uppercase; }
                .size-slider { -webkit-appearance: none; width: 100%; height: 4px; background: #333; border-radius: 2px; outline: none; margin: 10px 0; }
                .size-slider::-webkit-slider-thumb { -webkit-appearance: none; width: 18px; height: 18px; background: var(--neon-cyan); border-radius: 50%; cursor: pointer; border: 2px solid white; box-shadow: 0 0 6px var(--neon-cyan); }
                .preset-btn { background: #1a1a1a; border: 1px solid #333; color: white; padding: 6px 0; border-radius: 6px; cursor: pointer; font-size: 13px; flex: 1; transition: all 0.3s; font-family: 'Orbitron', sans-serif; }
                .preset-btn.active { border-color: var(--neon-cyan); color: var(--neon-cyan); box-shadow: 0 0 6px rgba(0,255,249,0.3); }
                .control-row { display: flex; gap: 8px; align-items: center; }
                .d-pad { display: grid; grid-template-columns: repeat(3, 1fr); gap: 4px; width: fit-content; margin: 0 auto; }
                @media (max-width: 768px) {
                    .size-slider::-webkit-slider-thumb { width: 24px; height: 24px; }
                    .preset-btn { padding: 12px 0; font-size: 14px; }
                }
            `}</style>

            {/* SIZE SECTION */}
            <div className="toolbar-section">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span className="toolbar-label">Size: <span style={{ color: 'var(--neon-cyan)' }}>{sizePercent}%</span></span>
                </div>
                <div className="control-row">
                    <button className="btn-icon" onClick={() => onUpdate(selectedImage.id, { size: { w: Math.max(10, selectedImage.size.w - 5), h: Math.max(10, selectedImage.size.h - 5) } })}><Minus size={14} /></button>
                    <input
                        type="range" className="size-slider" min="10" max="100" step="1"
                        value={selectedImage.size.w}
                        onChange={(e) => {
                            const val = parseFloat(e.target.value);
                            onUpdate(selectedImage.id, { size: { w: val, h: val } });
                        }}
                    />
                    <button className="btn-icon" onClick={() => onUpdate(selectedImage.id, { size: { w: Math.min(100, selectedImage.size.w + 5), h: Math.min(100, selectedImage.size.h + 5) } })}><Plus size={14} /></button>
                </div>
                <div className="control-row" style={{ marginTop: '4px' }}>
                    {Object.entries(SIZE_PRESETS).map(([key, value]) => (
                        <button
                            key={key}
                            className={`preset-btn ${Math.round(selectedImage.size.w) === value.w ? 'active' : ''}`}
                            onClick={() => onUpdate(selectedImage.id, { size: value })}
                        >
                            {key}
                        </button>
                    ))}
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }} className="tablet-col">
                {/* ROTATION SECTION */}
                <div className="toolbar-section">
                    <span className="toolbar-label">Rotation</span>
                    <div className="control-row" style={{ flexWrap: 'wrap' }}>
                        <button className="btn-icon" style={{ flex: 1 }} onClick={() => onRotate(-15)}>-15°</button>
                        <button className="btn-icon" style={{ flex: 1 }} onClick={() => onRotate(-5)}>-5°</button>
                        <button className="btn-icon" style={{ flex: 1 }} onClick={() => onRotate(5)}>+5°</button>
                        <button className="btn-icon" style={{ flex: 1 }} onClick={() => onRotate(15)}>+15°</button>
                    </div>
                </div>

                {/* POSITION SECTION */}
                <div className="toolbar-section">
                    <span className="toolbar-label">Position</span>
                    <div className="d-pad">
                        <div />
                        <button className="btn-icon" onClick={() => onMove('up')}><ArrowUp size={14} /></button>
                        <div />
                        <button className="btn-icon" onClick={() => onMove('left')}><ArrowLeft size={14} /></button>
                        <button className="btn-icon" onClick={onCenter} style={{ fontSize: '10px' }}>CNT</button>
                        <button className="btn-icon" onClick={() => onMove('right')}><ArrowRight size={14} /></button>
                        <div />
                        <button className="btn-icon" onClick={() => onMove('down')}><ArrowDown size={14} /></button>
                        <div />
                    </div>
                </div>
            </div>

            {/* REMOVE ACTION */}
            <button
                onClick={() => onDelete(selectedImage.id)}
                style={{
                    background: 'rgba(255, 51, 51, 0.1)', border: '1px solid #ff3333', color: '#ff3333',
                    padding: '12px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', gap: '8px', fontSize: '0.85rem', fontWeight: 'bold', width: '100%',
                    fontFamily: 'Orbitron, sans-serif'
                }}
            >
                <Trash2 size={16} /> REMOVE IMAGE
            </button>
        </div>
    );
};

/* ─────────── Preview Modal ─────────── */
const OrderPreviewModal = ({ item, onConfirm, onClose, clientNote, setClientNote }) => (
    <div style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 1000, padding: '16px', backdropFilter: 'blur(8px)'
    }}>
        <div className="glassmorphism" style={{
            maxWidth: '520px', width: '100%', padding: '24px', position: 'relative',
            maxHeight: '90vh', overflowY: 'auto'
        }}>
            <button
                onClick={onClose}
                style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', color: '#999', cursor: 'pointer' }}
            >
                <X size={20} />
            </button>

            <h2 className="font-orbitron neon-cyan" style={{ fontSize: '1.4rem', marginBottom: '4px' }}>
                ORDER <span style={{ color: 'inherit' }}>PREVIEW</span>
            </h2>
            <p style={{ color: '#666', fontSize: '0.8rem', marginBottom: '24px' }}>Review your custom design before confirming.</p>

            {/* T-Shirt Preview */}
            <TShirtPreview
                color={item.color}
                fitType={item.fit_type}
                frontImages={item.front_images || []}
                backImages={item.back_images || []}
                defaultSide="front"
                showToggle={true}
                style={{ marginBottom: '20px', maxWidth: '280px', margin: '0 auto 20px auto' }}
            />

            {/* Order details */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '10px', marginBottom: '24px' }}>
                {[
                    ['Color', item.color],
                    ['Size', item.size],
                    ['Fit', item.fit_type === 'OVERSIZED_FIT' ? 'Oversized' : 'Normal'],
                    ['Qty', item.quantity],
                    ['Price', `$${item.price.toFixed(2)}`]
                ].map(([k, v]) => (
                    <div key={k} style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '8px', padding: '10px' }}>
                        <span style={{ color: '#666', fontSize: '0.7rem', fontFamily: 'Orbitron, sans-serif' }}>{k}</span>
                        <p style={{ color: 'white', fontWeight: 'bold', marginTop: '2px' }}>{v}</p>
                    </div>
                ))}
            </div>

            {/* Client Note Section */}
            <div style={{ marginBottom: '24px' }}>
                <h4 className="font-orbitron" style={{ fontSize: '0.8rem', color: '#ccc', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <FileText size={16} /> 📝 Add a note for your order (Optional)
                </h4>
                <textarea
                    placeholder="e.g. Print only on front side, center the logo..."
                    maxLength={300}
                    value={clientNote}
                    onChange={(e) => setClientNote(e.target.value)}
                    style={{
                        width: '100%', height: '80px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '8px', color: 'white', padding: '12px', fontSize: '0.85rem', outline: 'none', resize: 'none',
                        fontFamily: 'inherit'
                    }}
                />
                <div style={{ textAlign: 'right', color: '#666', fontSize: '0.7rem', marginTop: '4px' }}>
                    {clientNote.length} / 300 characters
                </div>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
                <button onClick={onClose} className="btn" style={{ flex: 1, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#ccc' }}>
                    ← Edit Design
                </button>
                <button onClick={onConfirm} className="btn btn-cyan" style={{ flex: 1 }}>
                    <CheckCircle size={16} /> &nbsp; Add to Cart
                </button>
            </div>
        </div>
    </div>
);

const CustomizePage = () => {
    const [searchParams] = useSearchParams();
    const initialColor = searchParams.get('color') || 'Black';
    const initialFit = searchParams.get('fit') || 'NORMAL_FIT';

    const [color, setColor] = useState(initialColor);
    const [size, setSize] = useState('M');
    const [fitType, setFitType] = useState(initialFit);
    const [quantity, setQuantity] = useState(1);
    const [activeSide, setActiveSide] = useState('front');
    const [clientNote, setClientNote] = useState('');

    // Dual-side multi-image layers
    const [images, setImages] = useState({ front: [], back: [] });
    const [selectedImageId, setSelectedImageId] = useState(null);

    const [uploading, setUploading] = useState({ front: false, back: false });
    const [uploadProgress, setUploadProgress] = useState({ front: 0, back: 0 });
    const [showPreview, setShowPreview] = useState(false);
    const [pageLoading, setPageLoading] = useState(true);

    const frontInputRef = React.useRef(null);
    const backInputRef = React.useRef(null);

    const { user } = useContext(AuthContext);
    const { addToCart } = useContext(CartContext);
    const navigate = useNavigate();

    // Preload T-Shirt Images for performance
    useEffect(() => {
        const colors = COLORS;
        const fits = ['NORMAL_FIT', 'OVERSIZED_FIT'];
        const sides = ['frontside', 'backside'];

        fits.forEach(fit => {
            const fitPrefix = fit === 'OVERSIZED_FIT' ? 'Oversized_fit' : 'Normal_fit';
            colors.forEach(color => {
                const colorName = color === 'Blue' ? 'Skyblue' : color;
                sides.forEach(side => {
                    const img = new Image();
                    img.src = `/assets/${fit}/${fitPrefix}_${colorName}_${side}.png`;
                });
            });
        });
    }, []);

    useEffect(() => {
        // Simulate base assets loading
        const timer = setTimeout(() => setPageLoading(false), 1000);
        return () => clearTimeout(timer);
    }, []);

    const uploadImage = async (file, side) => {
        if (!file) return;

        // File size limit: 10MB
        if (file.size > 10 * 1024 * 1024) {
            toast.error('File too large. Max size is 10MB.');
            return;
        }

        setUploading(u => ({ ...u, [side]: true }));
        setUploadProgress(p => ({ ...p, [side]: 0 }));

        const formData = new FormData();
        formData.append('image', file);

        try {
            const { data } = await api.post('/upload', formData, {
                onUploadProgress: (progressEvent) => {
                    const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    setUploadProgress(p => ({ ...p, [side]: percent }));
                }
            });

            console.log('Upload success, URL:', data.url);

            const newLayer = {
                id: Date.now().toString(),
                url: data.url,
                public_id: data.public_id,
                position: { x: 50, y: 50 },
                size: { w: 40, h: 40 },
                rotation: 0
            };
            setImages(prev => ({ ...prev, [side]: [...prev[side], newLayer] }));
            setSelectedImageId(newLayer.id);
            setActiveSide(side);
            toast.success(`${side === 'front' ? 'Front' : 'Back'} design uploaded!`);
        } catch (error) {
            console.error('Upload Error:', error);
            toast.error('Upload failed. Check connection & try again.');
        } finally {
            setUploading(u => ({ ...u, [side]: false }));
            setUploadProgress(p => ({ ...p, [side]: 0 }));
        }
    };

    const handleUpdateImage = (id, newProps) => {
        setImages(prev => ({
            ...prev,
            [activeSide]: prev[activeSide].map(img => img.id === id ? { ...img, ...newProps } : img)
        }));
    };

    const handleRotationAdjust = (deg) => {
        if (!selectedImageId) return;
        const currentLayer = images[activeSide].find(img => img.id === selectedImageId);
        if (currentLayer) {
            handleUpdateImage(selectedImageId, { rotation: (currentLayer.rotation || 0) + deg });
        }
    };

    const handleDeleteImage = (id) => {
        setImages(prev => ({
            ...prev,
            [activeSide]: prev[activeSide].filter(img => img.id !== id)
        }));
        setSelectedImageId(null);
    };

    const handleMoveImage = (direction) => {
        if (!selectedImageId) return;
        const currentLayer = images[activeSide].find(img => img.id === selectedImageId);
        if (currentLayer) {
            const step = 5;
            const moves = {
                up: { x: 0, y: -step },
                down: { x: 0, y: step },
                left: { x: -step, y: 0 },
                right: { x: step, y: 0 }
            };
            handleUpdateImage(selectedImageId, {
                position: {
                    x: Math.max(0, Math.min(100, currentLayer.position.x + moves[direction].x)),
                    y: Math.max(0, Math.min(100, currentLayer.position.y + moves[direction].y))
                }
            });
        }
    };

    const handleCenterImage = () => {
        if (!selectedImageId) return;
        handleUpdateImage(selectedImageId, { position: { x: 50, y: 50 } });
    };

    const handleFileChange = (e, side) => {
        const file = e.target.files[0];
        if (!file) return;
        if (!file.type.startsWith('image/')) { toast.error('Please upload an image file.'); return; }
        uploadImage(file, side);
    };

    const buildCartItem = () => ({
        id: Date.now(),
        name: `${fitType === 'OVERSIZED_FIT' ? 'Oversized' : 'Normal'} Custom T-Shirt (${color})`,
        color,
        size,
        fit_type: fitType,
        side: activeSide,
        price: fitType === 'OVERSIZED_FIT' ? 34.99 : 29.99,
        quantity,
        client_note: clientNote,
        // Dual-side Multiple images
        front_images: images.front,
        back_images: images.back,
        // Legacy single image fallbacks - ensure strict side separation
        front_image: images.front[0]?.url || '',
        back_image: images.back[0]?.url || '',
        image: images.front[0]?.url || images.back[0]?.url || '', // Still used for cart thumbnail
    });

    const handlePreview = () => {
        if (!user) { toast.error('Please login first'); navigate('/login'); return; }
        setShowPreview(true);
    };

    const handleAddToCart = () => {
        addToCart(buildCartItem());
        setShowPreview(false);
        navigate('/cart');
    };

    const windowWidth = useWindowWidth();
    const colorHexMap = { Black: '#000', White: '#eee', Blue: '#00ddec', Purple: '#ac00e6' };

    if (pageLoading) return <NeonLoader variant="fullscreen" text="Engaging Creative Tools..." />;

    return (
        <div className="container" style={{ padding: '40px 15px' }}>
            <h1 className="font-orbitron neon-cyan" style={{ fontSize: 'clamp(1.4rem, 5vw, 2.2rem)', fontWeight: 'bold', marginBottom: '28px', textAlign: 'center' }}>
                CUSTOMIZE YOUR <span className="neon-pink">THREADS</span>
            </h1>

            <div className="grid grid-cols-2 tablet-col" style={{ gap: '28px' }}>

                {/* ── LEFT: T-Shirt Preview ── */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                    <div style={{ position: 'relative', width: '100%' }}>
                        <TShirtPreview
                            color={color}
                            fitType={fitType}
                            frontImages={images.front}
                            backImages={images.back}
                            isEditable={true}
                            onUpdateImage={handleUpdateImage}
                            onDeleteImage={handleDeleteImage}
                            selectedImageId={selectedImageId}
                            onSelectImage={setSelectedImageId}
                            controlledSide={activeSide}
                            showToggle={false}
                            onSideChange={setActiveSide}
                            style={{ width: '100%', maxWidth: '100%', minHeight: '350px' }}
                        />
                    </div>
                    {/* Manual side toggle under the preview */}
                    <div style={{ display: 'flex', gap: '8px' }}>
                        {['front', 'back'].map(s => (
                            <button key={s} onClick={() => { setActiveSide(s); setSelectedImageId(null); }} style={{
                                padding: '7px 22px', borderRadius: '20px', cursor: 'pointer',
                                background: activeSide === s ? 'var(--neon-purple)' : 'rgba(255,255,255,0.03)',
                                border: `1px solid ${activeSide === s ? 'var(--neon-purple)' : 'rgba(255,255,255,0.1)'}`,
                                color: 'white', fontFamily: 'Orbitron, sans-serif',
                                fontWeight: 'bold', textTransform: 'uppercase', fontSize: '0.75rem',
                                transition: 'all 0.3s'
                            }}>
                                {s}
                            </button>
                        ))}
                    </div>

                    {/* Easy Resize & Controls Toolbar */}
                    <ImageControlsToolbar
                        selectedImage={images[activeSide].find(img => img.id === selectedImageId)}
                        onUpdate={handleUpdateImage}
                        onDelete={handleDeleteImage}
                        onMove={handleMoveImage}
                        onCenter={handleCenterImage}
                        onRotate={handleRotationAdjust}
                    />
                </div>

                {/* ── RIGHT: Controls ── */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

                    {/* Configure */}
                    <div className="glassmorphism" style={{ padding: '24px' }}>
                        <h3 className="font-orbitron" style={{ fontSize: '1rem', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <Layers size={18} /> Configure Shirt
                        </h3>

                        {/* Fit Toggle */}
                        <div style={{ marginBottom: '18px' }}>
                            <label style={{ color: '#999', fontSize: '0.8rem', marginBottom: '8px', display: 'block' }}>Choose Fit</label>
                            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                {[{ id: 'NORMAL_FIT', label: 'Normal  $29.99' }, { id: 'OVERSIZED_FIT', label: 'Oversized  $34.99' }].map(f => (
                                    <button key={f.id} onClick={() => setFitType(f.id)} style={{
                                        padding: '8px 12px', borderRadius: '6px', cursor: 'pointer', flex: '1 1 auto', minWidth: '130px',
                                        background: fitType === f.id ? 'var(--neon-cyan)' : 'rgba(255,255,255,0.05)',
                                        color: fitType === f.id ? 'var(--dark-bg)' : 'white',
                                        border: 'none', fontWeight: 'bold', fontSize: '0.75rem', transition: 'all 0.3s'
                                    }}>
                                        {f.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Color */}
                        <div style={{ marginBottom: '18px' }}>
                            <label style={{ color: '#999', fontSize: '0.8rem', marginBottom: '8px', display: 'block' }}>Pick Color</label>
                            <div style={{ display: 'flex', gap: '10px' }}>
                                {COLORS.map(c => (
                                    <button key={c} onClick={() => setColor(c)} title={c} style={{
                                        width: '36px', height: '36px', borderRadius: '50%',
                                        background: colorHexMap[c] || c.toLowerCase(),
                                        border: color === c ? '3px solid var(--neon-cyan)' : '2px solid transparent',
                                        cursor: 'pointer', transition: 'all 0.2s'
                                    }} />
                                ))}
                            </div>
                        </div>

                        {/* Size */}
                        <div style={{ marginBottom: '18px' }}>
                            <label style={{ color: '#999', fontSize: '0.8rem', marginBottom: '8px', display: 'block' }}>Choose Size</label>
                            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                                {SIZES.map(s => (
                                    <button key={s} onClick={() => setSize(s)} style={{
                                        padding: '7px 14px', borderRadius: '4px',
                                        background: size === s ? 'var(--neon-pink)' : 'rgba(255,255,255,0.05)',
                                        color: size === s ? 'var(--dark-bg)' : '#ccc',
                                        border: 'none', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.85rem'
                                    }}>
                                        {s}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Quantity */}
                        <div>
                            <label style={{ color: '#999', fontSize: '0.8rem', marginBottom: '8px', display: 'block' }}>Quantity</label>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <button onClick={() => setQuantity(q => Math.max(1, q - 1))} style={{ padding: '6px 14px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>−</button>
                                <span style={{ fontSize: '1.1rem', fontWeight: 'bold', minWidth: '24px', textAlign: 'center' }}>{quantity}</span>
                                <button onClick={() => setQuantity(q => q + 1)} style={{ padding: '6px 14px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>+</button>
                            </div>
                        </div>
                    </div>

                    {/* Upload Design */}
                    <div className="glassmorphism" style={{ padding: '24px' }}>
                        <h3 className="font-orbitron" style={{ fontSize: '1rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <Upload size={18} /> Upload Design
                        </h3>
                        <p style={{ color: '#999', fontSize: '0.8rem', marginBottom: '16px' }}>
                            Upload designs for Front and Back. Supported: JPG, PNG, WEBP, SVG, GIF, BMP, TIFF.
                            Transparent PNG/SVG recommended.
                        </p>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <UploadZone
                                label="FRONT SIDE"
                                count={images.front.length}
                                loading={uploading.front}
                                progress={uploadProgress.front}
                                onUpload={() => frontInputRef.current.click()}
                                onClearAll={() => { setImages(prev => ({ ...prev, front: [] })); setSelectedImageId(null); }}
                            />
                            <UploadZone
                                label="BACK SIDE"
                                count={images.back.length}
                                loading={uploading.back}
                                progress={uploadProgress.back}
                                onUpload={() => backInputRef.current.click()}
                                onClearAll={() => { setImages(prev => ({ ...prev, back: [] })); setSelectedImageId(null); }}
                            />
                        </div>

                        {/* Hidden file inputs */}
                        <input ref={frontInputRef} type="file" accept=".jpg,.jpeg,.png,.webp,.svg,.gif,.bmp,.tiff" style={{ display: 'none' }} onChange={e => handleFileChange(e, 'front')} />
                        <input ref={backInputRef} type="file" accept=".jpg,.jpeg,.png,.webp,.svg,.gif,.bmp,.tiff" style={{ display: 'none' }} onChange={e => handleFileChange(e, 'back')} />
                    </div>

                    {/* Action Buttons */}
                    <button className="btn btn-outline-purple" style={{ width: '100%', padding: '14px', fontSize: '0.9rem' }} onClick={handlePreview}>
                        <Eye size={18} /> &nbsp; Preview Order
                    </button>
                    <button className="btn btn-pink" style={{ width: '100%', padding: '14px', fontSize: '0.9rem' }} onClick={handlePreview}>
                        <ShoppingCart size={18} /> &nbsp; Add to Cart — ${(fitType === 'OVERSIZED_FIT' ? 34.99 : 29.99).toFixed(2)}
                    </button>
                </div>
            </div>

            {/* Preview Modal */}
            {showPreview && (
                <OrderPreviewModal
                    item={buildCartItem()}
                    clientNote={clientNote}
                    setClientNote={setClientNote}
                    onConfirm={handleAddToCart}
                    onClose={() => setShowPreview(false)}
                />
            )}
        </div>
    );
};

export default CustomizePage;
