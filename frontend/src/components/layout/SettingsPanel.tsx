'use client';

import React from 'react';
import { X } from 'lucide-react';
import { ToolCategory } from '@/types/tools';
import { EDITOR_TOOLS } from '@/config/editor-tools';

interface SettingsPanelProps {
    activeTool: ToolCategory | null;
    onClose: () => void;
    children?: React.ReactNode;
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({ activeTool, onClose, children }) => {
    if (!activeTool) return null;

    const currentConfig = EDITOR_TOOLS.find((t) => t.id === activeTool);

    return (
        <aside className="w-80 bg-zinc-900 border-l border-zinc-800 flex flex-col h-full z-10 shadow-xl transition-all">
            <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
                <div>
                    <h2 className="text-sm font-semibold text-zinc-100 flex items-center gap-2">
                        {currentConfig?.label || 'Tool Settings'}
                    </h2>
                    {currentConfig?.description && (
                        <p className="text-xs text-zinc-400 mt-0.5">{currentConfig.description}</p>
                    )}
                </div>
                <button
                    onClick={onClose}
                    className="p-1 rounded-md text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition cursor-pointer"
                >
                    <X className="w-4 h-4" />
                </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {children}
            </div>
        </aside>
    );
};