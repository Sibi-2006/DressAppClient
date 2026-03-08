import React, { useState, useEffect } from 'react';
import DraggableImage from './DraggableImage';

/**
 * Reusable TShirtPreview component
 * Props:
 *   color:       string ('Black', 'White', 'Blue', 'Purple')
 *   fitType:     'NORMAL_FIT' | 'OVERSIZED_FIT'
 *   frontImage:  dataURL or URL string for the front custom design (fallback)
 *   backImage:   dataURL or URL string for the back custom design (fallback)
 *   frontImages: Array of layer objects {id, url, position, size}
 *   backImages:  Array of layer objects {id, url, position, size}
 *   isEditable:  Boolean indicating if drag/resize/select is enabled
 *   onUpdateImage: Callback to update position/size of a layer
 *   onDeleteImage: Callback to delete a layer
 *   selectedImageId: Which layer is currently selected
 *   onSelectImage: Callback to set the selected layer
 *   frontPos:    { x, y } percent 
 *   frontSize:   { w, h } percent
 *   backPos:     { x, y }
 *   backSize:    { w, h }
 *   defaultSide: 'front' | 'back'
 *   controlledSide: string - overrides internal state
 *   showToggle:  bool
 *   style:       optional top-level style override
 *   onSideChange: optional callback when side changes internally
 */
const TShirtPreview = ({
    color = 'Black',
    fitType = 'NORMAL_FIT',
    frontImage,
    backImage,
    frontImages = [],
    backImages = [],
    isEditable = false,
    onUpdateImage,
    onDeleteImage,
    selectedImageId,
    onSelectImage = () => { },
    frontPos = { x: 50, y: 50 },
    frontSize = { w: 40, h: 40 },
    backPos = { x: 50, y: 50 },
    backSize = { w: 40, h: 40 },
    defaultSide = 'front',
    controlledSide,
    showToggle = true,
    style = {},
    onSideChange
}) => {
    const [internalSide, setInternalSide] = useState(defaultSide);

    // If controlledSide changes externally, sync it
    useEffect(() => {
        if (controlledSide !== undefined) {
            setInternalSide(controlledSide);
        }
    }, [controlledSide]);

    const side = controlledSide !== undefined ? controlledSide : internalSide;

    const handleToggle = (s) => {
        setInternalSide(s);
        if (onSideChange) onSideChange(s);
        onSelectImage(null); // Deselect on side toggle
    };

    const colorName = color === 'Blue' ? 'Skyblue' : color;
    const fitPrefix = fitType === 'OVERSIZED_FIT' ? 'Oversized_fit' : 'Normal_fit';
    const baseImage = `/assets/${fitType}/${fitPrefix}_${colorName}_${side === 'front' ? 'frontside' : 'backside'}.png`;

    // Strictly separated layers - NO mixing fallback
    const layers = side === 'front' ? frontImages : backImages;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', ...style }}>
            {/* Side Label */}
            <div style={{
                background: side === 'front' ? 'var(--neon-cyan)' : 'var(--neon-pink)',
                color: 'black', padding: '4px 12px', borderRadius: '4px',
                fontSize: '0.6rem', fontWeight: 'bold', fontFamily: 'Orbitron',
                letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '4px'
            }}>
                {side} SIDE DESIGN
            </div>

            {/* Base shirt + overlay */}
            <div
                style={{
                    position: 'relative', width: '100%', aspectRatio: '3/4',
                    background: '#0a0a0a', borderRadius: '16px', overflow: 'hidden',
                    border: '1px solid rgba(255,255,255,0.06)',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.7)'
                }}
                onPointerDown={() => isEditable && onSelectImage(null)} // Deselect when clicking empty space
            >
                {/* Base T-Shirt image stacking to avoid flash/dimming */}
                {['Black', 'White', 'Skyblue', 'Purple'].map(c => {
                    const isActive = colorName === c;
                    const imgUrl = `/assets/${fitType}/${fitPrefix}_${c}_${side === 'front' ? 'frontside' : 'backside'}.png`;
                    return (
                        <img
                            key={c}
                            src={imgUrl}
                            alt={`${c} ${fitType} ${side}`}
                            style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'contain',
                                pointerEvents: 'none',
                                position: isActive ? 'relative' : 'absolute',
                                top: 0,
                                left: 0,
                                opacity: isActive ? 1 : 0,
                                transition: 'opacity 0.2s ease',
                                zIndex: isActive ? 1 : 0
                            }}
                            onError={(e) => {
                                if (isActive) {
                                    e.target.onerror = null;
                                    e.target.src = '/assets/placeholder.png';
                                    e.target.style.opacity = '0.5';
                                }
                            }}
                        />
                    );
                })}

                {/* Custom Design Overlay Layers */}
                {layers.map((layer) => (
                    <DraggableImage
                        key={layer.id}
                        id={layer.id}
                        url={layer.url}
                        initPos={layer.position}
                        initSize={layer.size}
                        initRotation={layer.rotation}
                        isEditable={isEditable}
                        isSelected={selectedImageId === layer.id}
                        onSelect={() => onSelectImage(layer.id)}
                        onUpdateLayer={onUpdateImage}
                        onDelete={onDeleteImage}
                    />
                ))}

                {layers.length === 0 && (
                    <div style={{
                        position: 'absolute', top: '75%', left: '50%', transform: 'translate(-50%, -50%)',
                        color: 'rgba(255,255,255,0.2)', fontSize: '0.65rem',
                        fontFamily: 'Orbitron, sans-serif', textAlign: 'center', pointerEvents: 'none',
                        letterSpacing: '1px', width: '80%'
                    }}>
                        NO DESIGN ON THIS SIDE
                    </div>
                )}
            </div>

            {/* Internal Toggle (only if showToggle=true AND not externally controlled) */}
            {showToggle && controlledSide === undefined && (
                <div style={{ display: 'flex', gap: '8px' }}>
                    {['front', 'back'].map(s => (
                        <button
                            key={s}
                            onClick={() => handleToggle(s)}
                            style={{
                                padding: '6px 20px', borderRadius: '20px', cursor: 'pointer',
                                background: internalSide === s ? 'var(--neon-purple)' : 'transparent',
                                border: `1px solid ${internalSide === s ? 'var(--neon-purple)' : 'rgba(255,255,255,0.15)'}`,
                                color: 'white', fontFamily: 'Orbitron, sans-serif',
                                fontWeight: 'bold', textTransform: 'uppercase', fontSize: '0.75rem',
                                transition: 'all 0.3s'
                            }}
                        >
                            {s}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default TShirtPreview;
