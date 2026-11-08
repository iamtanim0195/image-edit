'use client';

import React from 'react';
import { Sparkles, Wand2, Zap } from 'lucide-react';

interface EnhancementPanelProps {
    onApplyEnhance: (mode: 'auto' | 'denoise' | 'detail', strength?: number) => void;
    isProcessing: boolean;
}

export const EnhancementPanel: React.FC<EnhancementPanelProps> = ({
    onApplyEnhance,
    isProcessing,
}) => {
    return (
        <div className="space-y-4 select-none">
            <button
                onClick={() => onApplyEnhance('auto')}
                disabled={isProcessing}
                className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 shadow-lg transition cursor-pointer disabled:opacity-50"
            >
                <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
                <span>One-Click Auto Enhance</span>
            </button>

            <div className="space-y-2 pt-2">
                <button
                    onClick={() => onApplyEnhance('denoise', 12)}
                    disabled={isProcessing}
                    className="w-full py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-lg text-xs font-medium flex items-center justify-between px-3 border border-zinc-700 transition cursor-pointer disabled:opacity-50"
                >
                    <span className="flex items-center gap-2">
                        <Wand2 className="w-4 h-4 text-indigo-400" />
                        <span>Smart Denoise</span>
                    </span>
                    <span className="text-[10px] text-zinc-400">OpenCV</span>
                </button>

                <button
                    onClick={() => onApplyEnhance('detail', 15)}
                    disabled={isProcessing}
                    className="w-full py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-lg text-xs font-medium flex items-center justify-between px-3 border border-zinc-700 transition cursor-pointer disabled:opacity-50"
                >
                    <span className="flex items-center gap-2">
                        <Zap className="w-4 h-4 text-emerald-400" />
                        <span>Detail Sharpness</span>
                    </span>
                    <span className="text-[10px] text-zinc-400">Unsharp Mask</span>
                </button>
            </div>
        </div>
    );
};