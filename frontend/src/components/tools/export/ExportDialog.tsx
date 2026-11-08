'use client';

import React, { useState } from 'react';
import { X, Download, FileCheck } from 'lucide-react';
import { ImageMetadata } from '@/types/editor';

interface ExportDialogProps {
    image: ImageMetadata | null;
    onClose: () => void;
    onExportDownload: (format: string, quality: number) => void;
}

export const ExportDialog: React.FC<ExportDialogProps> = ({
    image,
    onClose,
    onExportDownload,
}) => {
    const [format, setFormat] = useState<string>('png');
    const [quality, setQuality] = useState<number>(90);

    if (!image) return null;

    return (
        <div className="fixed inset-0 bg-zinc-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-zinc-900 border border-zinc-800 w-full max-w-md rounded-2xl shadow-2xl p-6 space-y-6">
                <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
                    <div>
                        <h3 className="text-base font-semibold text-zinc-100 flex items-center gap-2">
                            <FileCheck className="w-5 h-5 text-indigo-400" />
                            <span>Export Processed Image</span>
                        </h3>
                        <p className="text-xs text-zinc-400 mt-1">
                            Select output parameters for download
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1 rounded-md text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition cursor-pointer"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="text-xs font-semibold text-zinc-300 block mb-2">
                            File Format
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                            {['png', 'jpeg', 'webp'].map((fmt) => (
                                <button
                                    key={fmt}
                                    onClick={() => setFormat(fmt)}
                                    className={`py-2 text-xs font-mono uppercase rounded-lg border transition cursor-pointer ${format === fmt
                                            ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300 font-bold'
                                            : 'bg-zinc-800 border-zinc-700 text-zinc-400 hover:bg-zinc-700'
                                        }`}
                                >
                                    {fmt}
                                </button>
                            ))}
                        </div>
                    </div>

                    {format !== 'png' && (
                        <div className="space-y-1.5">
                            <div className="flex items-center justify-between text-xs">
                                <span className="text-zinc-300">Quality</span>
                                <span className="font-mono text-indigo-400 font-semibold">{quality}%</span>
                            </div>
                            <input
                                type="range"
                                min={10}
                                max={100}
                                value={quality}
                                onChange={(e) => setQuality(parseInt(e.target.value))}
                                className="w-full h-1.5 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                            />
                        </div>
                    )}

                    <div className="p-3 bg-zinc-800/50 rounded-lg text-xs space-y-1 text-zinc-400 font-mono">
                        <div>Original Dimensions: {image.width} × {image.height} px</div>
                        <div>Output Extension: .{format}</div>
                    </div>
                </div>

                <div className="flex items-center gap-3 pt-2">
                    <button
                        onClick={onClose}
                        className="flex-1 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg text-xs font-medium transition cursor-pointer"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => onExportDownload(format, quality / 100)}
                        className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition shadow-lg cursor-pointer"
                    >
                        <Download className="w-4 h-4" />
                        <span>Download</span>
                    </button>
                </div>
            </div>
        </div>
    );
};