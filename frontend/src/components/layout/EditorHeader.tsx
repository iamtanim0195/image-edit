'use client';

import React from 'react';
import { Image as ImageIcon, Sparkles } from 'lucide-react';

interface EditorHeaderProps {
    imageName?: string;
}

export const EditorHeader: React.FC<EditorHeaderProps> = ({ imageName }) => {
    return (
        <header className="h-13 bg-zinc-900 border-b border-zinc-800 px-4 flex items-center justify-between select-none z-20">
            <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 text-indigo-500 font-bold text-lg tracking-wide">
                    <div className="p-1.5 bg-indigo-500/10 rounded-lg border border-indigo-500/20">
                        <ImageIcon className="w-5 h-5 text-indigo-400" />
                    </div>
                    <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                        Pixel Studio
                    </span>
                </div>
                <span className="text-xs bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded border border-zinc-700">
                    v1.0 Pro
                </span>
            </div>

            <div className="flex items-center gap-2">
                <span className="text-xs text-zinc-400">Project:</span>
                <span className="text-xs font-medium text-zinc-200 truncate max-w-xs">
                    {imageName || 'Untitled Project'}
                </span>
            </div>

            <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>System Ready</span>
                </div>
            </div>
        </header>
    );
};