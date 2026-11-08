'use client';

import React from 'react';
import { ImageMetadata } from '@/types/editor';

interface StatusBarProps {
    image: ImageMetadata | null;
    zoom: number;
}

export const StatusBar: React.FC<StatusBarProps> = ({ image, zoom }) => {
    const formatBytes = (bytes: number) => {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    return (
        <footer className="h-7 bg-zinc-900 border-t border-zinc-800 px-4 flex items-center justify-between text-[11px] text-zinc-400 select-none z-20">
            <div className="flex items-center gap-4">
                <span>
                    Status: <span className="text-zinc-200">{image ? 'Editing' : 'Idle'}</span>
                </span>
                {image && (
                    <>
                        <span>|</span>
                        <span>
                            Dimensions:{' '}
                            <span className="text-zinc-200 font-mono">
                                {image.width} × {image.height} px
                            </span>
                        </span>
                        <span>|</span>
                        <span>
                            Size: <span className="text-zinc-200 font-mono">{formatBytes(image.sizeBytes)}</span>
                        </span>
                        <span>|</span>
                        <span>
                            Format: <span className="text-zinc-200 font-mono uppercase">{image.type.split('/')[1] || 'Image'}</span>
                        </span>
                    </>
                )}
            </div>

            <div className="flex items-center gap-3 font-mono">
                <span>Zoom: {Math.round(zoom * 100)}%</span>
            </div>
        </footer>
    );
};