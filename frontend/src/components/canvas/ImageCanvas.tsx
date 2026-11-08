'use client';

import React from 'react';
import { ImageMetadata } from '@/types/editor';
import { AdjustmentValues, TransformValues } from '@/lib/constants';
import { getCssFilterString } from '@/lib/image-utils';
import { EmptyCanvas } from './EmptyCanvas';
import { CropOverlay, CropRect } from '../tools/crop/CropOverlay';

export interface ImageCanvasProps {
    image: ImageMetadata | null;
    zoom: number;
    adjustments: AdjustmentValues;
    transforms: TransformValues;
    activeFilter: string;
    isCropActive: boolean;
    cropRect: CropRect;
    onChangeCropRect: (rect: CropRect) => void;
    aspectRatio: number | null;
    isProcessing?: boolean;
    onUploadClick: () => void;
}

export const ImageCanvas: React.FC<ImageCanvasProps> = ({
    image,
    zoom,
    adjustments,
    transforms,
    activeFilter,
    isCropActive,
    cropRect,
    onChangeCropRect,
    aspectRatio,
    isProcessing = false,
    onUploadClick,
}) => {
    if (!image) {
        return (
            <main className="flex-1 bg-zinc-950 flex items-center justify-center relative overflow-hidden">
                <EmptyCanvas onUploadClick={onUploadClick} />
            </main>
        );
    }

    const cssFilter = getCssFilterString(adjustments, activeFilter);
    const transformCss = `scale(${zoom}) rotate(${transforms.rotation}deg) scaleX(${transforms.flipH ? -1 : 1}) scaleY(${transforms.flipV ? -1 : 1})`;

    return (
        <main className="flex-1 bg-zinc-950 flex items-center justify-center relative overflow-hidden p-6 select-none">
            <div className="relative max-w-full max-h-full overflow-auto flex items-center justify-center rounded-lg shadow-2xl bg-checkerboard border border-zinc-800">
                {/* Render Base Image */}
                {/* eslint-disable-next-html-element-suppression */}
                <img
                    src={image.url}
                    alt={image.name}
                    style={{
                        filter: cssFilter,
                        transform: transformCss,
                        transformOrigin: 'center center',
                        transition: 'transform 0.15s ease-out, filter 0.05s linear',
                    }}
                    className="max-h-[70vh] w-auto object-contain block"
                />

                {/* Interactive Mouse Drag Crop Overlay */}
                {isCropActive && (
                    <CropOverlay
                        cropRect={cropRect}
                        onChangeCropRect={onChangeCropRect}
                        aspectRatio={aspectRatio}
                    />
                )}

                {/* Backend AI Loading Overlay */}
                {isProcessing && (
                    <div className="absolute inset-0 bg-zinc-950/70 backdrop-blur-sm flex flex-col items-center justify-center gap-3 z-40">
                        <div className="w-9 h-9 border-3 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                        <span className="text-xs font-semibold text-zinc-200">
                            Processing image via OpenCV Backend...
                        </span>
                    </div>
                )}
            </div>
        </main>
    );
};