import React, { useRef, useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { BASE_URL } from '../utils/api';

const DraggableImage = ({
    id, url, initPos, initSize, initRotation, isEditable, onUpdateLayer, onDelete, isSelected, onSelect
}) => {
    const layerRef = useRef(null);
    const [pos, setPos] = useState(initPos);
    const [size, setSize] = useState(initSize);
    const [rotation, setRotation] = useState(initRotation || 0);

    // Keep state in sync if prop changes and not dragging
    useEffect(() => { setPos(initPos); }, [initPos?.x, initPos?.y]);
    useEffect(() => { setSize(initSize); }, [initSize?.w, initSize?.h]);
    useEffect(() => { setRotation(initRotation || 0); }, [initRotation]);

    const handlePointerDown = (e, handleType) => {
        if (!isEditable) return;
        e.stopPropagation();
        onSelect && onSelect();

        const target = e.target;
        if (target.setPointerCapture) {
            target.setPointerCapture(e.pointerId);
        }

        // Prevent default to disable native browser drag/drop ghosting
        if (e.pointerType === 'mouse') e.preventDefault();

        let startX = e.clientX;
        let startY = e.clientY;

        let currentX = pos.x;
        let currentY = pos.y;
        let currentW = size.w;
        let currentH = size.h;
        let currentRot = rotation;

        const aspect = currentH / currentW;
        const container = layerRef.current.parentElement;
        const cRect = container.getBoundingClientRect();

        const handlePointerMove = (moveEvent) => {
            const dx = moveEvent.clientX - startX;
            const dy = moveEvent.clientY - startY;

            if (handleType === 'drag') {
                const dxPercent = (dx / cRect.width) * 100;
                const dyPercent = (dy / cRect.height) * 100;
                currentX = Math.max(0, Math.min(100, currentX + dxPercent));
                currentY = Math.max(0, Math.min(100, currentY + dyPercent));
                setPos({ x: currentX, y: currentY });
                startX = moveEvent.clientX;
                startY = moveEvent.clientY;
            } else if (handleType === 'rotate') {
                const rect = layerRef.current.getBoundingClientRect();
                const centerX = rect.left + rect.width / 2;
                const centerY = rect.top + rect.height / 2;
                const angle = Math.atan2(moveEvent.clientY - centerY, moveEvent.clientX - centerX);
                const degrees = (angle * (180 / Math.PI)) + 90; // +90 because our handle is at top
                currentRot = degrees;
                setRotation(degrees);
            } else {
                // Resize logic (scales from center, so we multiply dx/dy by 2)
                const dxPercent = (dx / cRect.width) * 100;
                let newW = currentW;

                if (handleType === 'se' || handleType === 'ne') {
                    newW += dxPercent * 2;
                } else if (handleType === 'sw' || handleType === 'nw') {
                    newW -= dxPercent * 2;
                }

                newW = Math.max(10, Math.min(100, newW)); // restrict width
                const newH = newW * aspect;

                currentW = newW;
                currentH = newH;
                setSize({ w: currentW, h: currentH });
                startX = moveEvent.clientX;
                startY = moveEvent.clientY;
            }
        };

        const handlePointerUp = (upEvent) => {
            if (target.releasePointerCapture) {
                target.releasePointerCapture(upEvent.pointerId);
            }
            window.removeEventListener('pointermove', handlePointerMove);
            window.removeEventListener('pointerup', handlePointerUp);
            // After interaction, commit the state up to parent
            setPos((finalPos) => {
                setSize((finalSize) => {
                    setRotation((finalRot) => {
                        onUpdateLayer(id, { position: finalPos, size: finalSize, rotation: finalRot });
                        return finalRot;
                    });
                    return finalSize;
                });
                return finalPos;
            });
        };

        window.addEventListener('pointermove', handlePointerMove);
        window.addEventListener('pointerup', handlePointerUp);
    };

    const handleStyle = {
        position: 'absolute',
        width: '12px', height: '12px', background: 'white',
        border: '2px solid var(--neon-cyan)',
        zIndex: 11
    };

    return (
        <div
            ref={layerRef}
            onPointerDown={(e) => handlePointerDown(e, 'drag')}
            draggable={false}
            style={{
                position: 'absolute',
                left: `${pos.x}%`,
                top: `${pos.y}%`,
                width: `${size.w}%`,
                height: `${size.h}%`,
                transform: `translate(-50%, -50%) rotate(${rotation}deg)`,
                cursor: isEditable ? 'move' : 'default',
                userSelect: 'none',
                touchAction: 'none',
                border: isSelected && isEditable ? '2px dashed #fff' : 'transparent',
                boxShadow: isSelected && isEditable ? '0 0 15px rgba(0, 255, 249, 0.4)' : 'none',
                zIndex: isSelected ? 10 : 1,
                transformOrigin: 'center center'
            }}
        >
            <img
                src={url?.startsWith('http') || url?.startsWith('data:') ? url : `${BASE_URL}${url}`}
                alt="design layer"
                draggable={false}
                style={{ width: '100%', height: '100%', objectFit: 'contain', pointerEvents: 'none' }}
            />

            {/* Controls overlay visible only when selected & editable */}
            {isSelected && isEditable && (
                <>
                    {/* Delete button top right */}
                    <button
                        onPointerDown={(e) => { e.stopPropagation(); onDelete(id); }}
                        style={{
                            position: 'absolute', top: '-15px', right: '-15px',
                            background: '#ff5555', color: 'white', border: 'none',
                            borderRadius: '50%', width: '26px', height: '26px',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            cursor: 'pointer', zIndex: 12,
                            boxShadow: '0 2px 5px rgba(0,0,0,0.5)'
                        }}
                    >
                        <X size={14} />
                    </button>

                    {/* Rotation Handle Top Center */}
                    <div style={{
                        position: 'absolute', top: '-30px', left: '50%', transform: 'translateX(-50%)',
                        display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 12
                    }}>
                        <div
                            onPointerDown={(e) => { e.stopPropagation(); handlePointerDown(e, 'rotate'); }}
                            style={{
                                width: '20px', height: '20px', borderRadius: '50%', background: 'var(--neon-cyan)',
                                cursor: 'grab', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                border: '2px solid white', boxShadow: '0 0 8px var(--neon-cyan)'
                            }}
                        >
                            <span style={{ fontSize: '12px', color: 'black' }}>↺</span>
                        </div>
                        <div style={{ width: '2px', height: '10px', background: 'var(--neon-cyan)' }} />
                    </div>

                    {/* 4 Corner Resize Handles */}
                    <div onPointerDown={(e) => { e.stopPropagation(); handlePointerDown(e, 'nw'); }} style={{ ...handleStyle, top: '-6px', left: '-6px', cursor: 'nwse-resize' }} />
                    <div onPointerDown={(e) => { e.stopPropagation(); handlePointerDown(e, 'ne'); }} style={{ ...handleStyle, top: '-6px', right: '-6px', cursor: 'nesw-resize' }} />
                    <div onPointerDown={(e) => { e.stopPropagation(); handlePointerDown(e, 'sw'); }} style={{ ...handleStyle, bottom: '-6px', left: '-6px', cursor: 'nesw-resize' }} />
                    <div onPointerDown={(e) => { e.stopPropagation(); handlePointerDown(e, 'se'); }} style={{ ...handleStyle, bottom: '-6px', right: '-6px', cursor: 'nwse-resize' }} />
                </>
            )}
        </div>
    );
};

export default DraggableImage;
