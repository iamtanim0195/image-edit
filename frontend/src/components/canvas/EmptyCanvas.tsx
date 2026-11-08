'use client';

import React from 'react';
import { UploadCloud, Image as ImageIcon } from 'lucide-react';

interface EmptyCanvasProps {
    onUploadClick: () => void;
}

export const EmptyCanvas: React.FC<EmptyCanvasProps> = ({ onUploadClick }) => {
    return (
        <div className="flex-1 flex flex-col items-center justify-center p-8 border-2 border-dashed border-zinc-800 rounded-2xl bg-zinc-900/40 m-6 transition hover:border-indigo-500/40">
            <div className="w-16 h-16 rounded-full bg-red-600 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-4">
                <UploadCloud className="w-8 h-8" />
            </div>

            <h3 className="text-lg font-semibold text-zinc-200 mb-1">No Image Loaded</h3>
            <p className="text-xs text-zinc-400 mb-6 text-center max-w-sm">
                Drag and drop your JPG, PNG, or WebP photo here, or select a file from your computer to start editing.
            </p>

            <button
                onClick={onUploadClick}
                className="flex items-center gap-2 px-5 py-2.5 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition shadow-lg shadow-indigo-600/20 cursor-pointer"
            >
                <ImageIcon className="w-4 h-4" />
                <span>Select Image File</span>
            </button>

            <div className="mt-8 flex items-center gap-4 text-[11px] text-zinc-500">
                <span>Supported: JPG, PNG, WebP</span>
                <span>•</span>
                <span>Max: 25 MB</span>
            </div>
        </div>
    );
};