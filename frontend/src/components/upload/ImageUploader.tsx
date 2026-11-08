'use client';

import React, { useRef } from 'react';
import { UploadCloud, FileImage, AlertTriangle, RefreshCw } from 'lucide-react';

interface ImageUploaderProps {
    onFileSelected: (file: File) => void;
    onDrop: (e: React.DragEvent<HTMLDivElement>) => void;
    error?: string | null;
    currentImageName?: string;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
    onFileSelected,
    onDrop,
    error,
    currentImageName,
}) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            onFileSelected(e.target.files[0]);
        }
    };

    return (
        <div className="space-y-4">
            {error && (
                <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg flex items-start gap-2 text-xs text-red-400">
                    <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                    <span>{error}</span>
                </div>
            )}

            {currentImageName && (
                <div className="p-3 bg-zinc-800/80 rounded-lg border border-zinc-700/60 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 truncate max-w-[180px]">
                        <FileImage className="w-4 h-4 text-indigo-400 shrink-0" />
                        <span className="text-zinc-200 truncate">{currentImageName}</span>
                    </div>
                    <span className="text-[10px] text-emerald-400 font-medium px-2 py-0.5 bg-emerald-500/10 rounded">
                        Loaded
                    </span>
                </div>
            )}

            <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={onDrop}
                onClick={() => fileInputRef.current?.click()}
                className="p-6 border-2 border-dashed border-zinc-700 hover:border-indigo-500/60 rounded-xl bg-zinc-800/30 flex flex-col items-center justify-center text-center gap-3 cursor-pointer transition group"
            >
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleInputChange}
                    accept="image/jpeg,image/png,image/webp"
                    className="hidden"
                />

                <div className="w-12 h-12 rounded-full bg-zinc-800 group-hover:bg-indigo-600/20 flex items-center justify-center text-zinc-400 group-hover:text-indigo-400 border border-zinc-700 transition">
                    {currentImageName ? (
                        <RefreshCw className="w-6 h-6" />
                    ) : (
                        <UploadCloud className="w-6 h-6" />
                    )}
                </div>

                <div>
                    <p className="text-xs font-semibold text-zinc-200">
                        {currentImageName ? 'Replace Current Image' : 'Drop your image file here'}
                    </p>
                    <p className="text-[11px] text-zinc-400 mt-1">
                        or browse local directory (JPG, PNG, WebP)
                    </p>
                </div>
            </div>
        </div>
    );
};