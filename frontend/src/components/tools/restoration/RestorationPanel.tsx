'use client';

import React from 'react';
import { History, ShieldAlert, Cpu, EyeOff } from 'lucide-react';

interface RestorationPanelProps {
    onApplyRestore: (mode: 'blur' | 'artifacts' | 'noise' | 'negative') => void;
    isProcessing: boolean;
}

export const RestorationPanel: React.FC<RestorationPanelProps> = ({
    onApplyRestore,
    isProcessing,
}) => {
    return (
        <div className="space-y-3 select-none">
            <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg flex items-start gap-2 text-[11px] text-amber-400">
                <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>Restoration filter pipeline runs on the Python OpenCV backend engine.</span>
            </div>

            <button
                onClick={() => onApplyRestore('negative')}
                disabled={isProcessing}
                className="w-full py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-lg text-xs font-medium flex items-center justify-between px-3 border border-zinc-700 transition cursor-pointer disabled:opacity-50"
            >
                <span className="flex items-center gap-2">
                    <EyeOff className="w-4 h-4 text-rose-400" />
                    <span>Invert / Color Negative</span>
                </span>
                <span className="text-[10px] text-zinc-400">cv2.bitwise_not</span>
            </button>

            <button
                onClick={() => onApplyRestore('blur')}
                disabled={isProcessing}
                className="w-full py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-lg text-xs font-medium flex items-center justify-between px-3 border border-zinc-700 transition cursor-pointer disabled:opacity-50"
            >
                <span className="flex items-center gap-2">
                    <History className="w-4 h-4 text-indigo-400" />
                    <span>Blur Reduction</span>
                </span>
                <span className="text-[10px] text-zinc-400">Laplacian</span>
            </button>

            <button
                onClick={() => onApplyRestore('artifacts')}
                disabled={isProcessing}
                className="w-full py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-lg text-xs font-medium flex items-center justify-between px-3 border border-zinc-700 transition cursor-pointer disabled:opacity-50"
            >
                <span className="flex items-center gap-2">
                    <Cpu className="w-4 h-4 text-purple-400" />
                    <span>Artifact Reduction</span>
                </span>
                <span className="text-[10px] text-zinc-400">Bilateral</span>
            </button>
        </div>
    );
};