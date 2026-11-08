'use client';

import React, { useState, useRef, useEffect } from 'react';

export interface CropRect {
    x: number; // percentage 0 - 100
    y: number; // percentage 0 - 100
    width: number; // percentage 0 - 100
    height: number; // percentage 0 - 100
}

interface CropOverlayProps {
    cropRect: CropRect;
    onChangeCropRect: (rect: CropRect) => void;
    aspectRatio: number | null; // width / height or null for free
}

export const CropOverlay: React.FC<CropOverlayProps> = ({
    cropRect,
    onChangeCropRect,
    aspectRatio,
}) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [isResizing, setIsResizing] = useState<string | null>(null);
    const [startPos, setStartPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
    const [startRect, setStartRect] = useState<CropRect>(cropRect);

    const getContainerDimensions = () => {
        if (!containerRef.current) return { width: 1, height: 1 };
        const rect = containerRef.current.getBoundingClientRect();
        return { width: rect.width, height: rect.height };
    };

    const handleMouseDown = (e: React.MouseEvent, handle?: string) => {
        e.preventDefault();
        e.stopPropagation();
        const container = getContainerDimensions();
        setStartPos({ x: e.clientX, y: e.clientY });
        setStartRect({ ...cropRect });

        if (handle) {
            setIsResizing(handle);
        } else {
            setIsDragging(true);
        }
    };

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!isDragging && !isResizing) return;
            const container = getContainerDimensions();

            const dxPct = ((e.clientX - startPos.x) / container.width) * 100;
            const dyPct = ((e.clientY - startPos.y) / container.height) * 100;

            if (isDragging) {
                let newX = Math.max(0, Math.min(100 - startRect.width, startRect.x + dxPct));
                let newY = Math.max(0, Math.min(100 - startRect.height, startRect.y + dyPct));
                onChangeCropRect({ ...startRect, x: newX, y: newY });
            } else if (isResizing) {
                let { x, y, width, height } = startRect;

                if (isResizing.includes('r')) {
                    width = Math.min(100 - x, Math.max(5, startRect.width + dxPct));
                }
                if (isResizing.includes('b')) {
                    height = Math.min(100 - y, Math.max(5, startRect.height + dyPct));
                }
                if (isResizing.includes('l')) {
                    const possibleWidth = Math.max(5, startRect.width - dxPct);
                    x = Math.max(0, startRect.x + (startRect.width - possibleWidth));
                    width = possibleWidth;
                }
                if (isResizing.includes('t')) {
                    const possibleHeight = Math.max(5, startRect.height - dyPct);
                    y = Math.max(0, startRect.y + (startRect.height - possibleHeight));
                    height = possibleHeight;
                }

                if (aspectRatio) {
                    const containerRatio = container.width / container.height;
                    const currentPixelWidth = (width / 100) * container.width;
                    const targetPixelHeight = currentPixelWidth / aspectRatio;
                    height = (targetPixelHeight / container.height) * 100;
                }

                onChangeCropRect({ x, y, width, height });
            }
        };

        const handleMouseUp = () => {
            setIsDragging(false);
            setIsResizing(null);
        };

        if (isDragging || isResizing) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
        }

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging, isResizing, startPos, startRect, onChangeCropRect, aspectRatio]);

    return (
        <div
            ref={containerRef}
            className="absolute inset-0 cursor-crosshair select-none z-30"
        >
            {/* Darkened backdrop overlay around selection */}
            <div
                className="absolute inset-0 bg-black/60"
                style={{
                    clipPath: `polygon(
            0% 0%, 100% 0%, 100% 100%, 0% 100%,
            0% ${cropRect.y}%,
            ${cropRect.x}% ${cropRect.y}%,
            ${cropRect.x}% ${cropRect.y + cropRect.height}%,
            ${cropRect.x + cropRect.width}% ${cropRect.y + cropRect.height}%,
            ${cropRect.x + cropRect.width}% ${cropRect.y}%,
            0% ${cropRect.y}%
          )`,
                }}
            />

            {/* Interactive Crop Selection Box */}
            <div
                onMouseDown={(e) => handleMouseDown(e)}
                style={{
                    left: `${cropRect.x}%`,
                    top: `${cropRect.y}%`,
                    width: `${cropRect.width}%`,
                    height: `${cropRect.height}%`,
                }}
                className="absolute border-2 border-indigo-400 bg-indigo-500/10 cursor-move shadow-2xl"
            >
                {/* Rule-of-thirds grid lines */}
                <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 pointer-events-none opacity-40">
                    <div className="border-r border-b border-indigo-200" />
                    <div className="border-r border-b border-indigo-200" />
                    <div className="border-b border-indigo-200" />
                    <div className="border-r border-b border-indigo-200" />
                    <div className="border-r border-b border-indigo-200" />
                    <div className="border-b border-indigo-200" />
                </div>

                {/* Corner Drag Handles */}
                <div
                    onMouseDown={(e) => handleMouseDown(e, 'tl')}
                    className="absolute -top-1.5 -left-1.5 w-3.5 h-3.5 bg-white border-2 border-indigo-600 rounded-sm cursor-nwse-resize"
                />
                <div
                    onMouseDown={(e) => handleMouseDown(e, 'tr')}
                    className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 bg-white border-2 border-indigo-600 rounded-sm cursor-nesw-resize"
                />
                <div
                    onMouseDown={(e) => handleMouseDown(e, 'bl')}
                    className="absolute -bottom-1.5 -left-1.5 w-3.5 h-3.5 bg-white border-2 border-indigo-600 rounded-sm cursor-nesw-resize"
                />
                <div
                    onMouseDown={(e) => handleMouseDown(e, 'br')}
                    className="absolute -bottom-1.5 -right-1.5 w-3.5 h-3.5 bg-white border-2 border-indigo-600 rounded-sm cursor-nwse-resize"
                />
            </div>
        </div>
    );
};