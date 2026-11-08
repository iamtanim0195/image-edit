'use client';

import React from 'react';
import { EDITOR_TOOLS } from '@/config/editor-tools';
import { ToolCategory } from '@/types/tools';
import {
    Upload,
    Crop,
    Sliders,
    Wand2,
    Sparkles,
    History,
    Layers,
    Type,
    Download,
} from 'lucide-react';

const ICON_MAP: Record<string, React.ElementType> = {
    Upload,
    Crop,
    Sliders,
    Wand2,
    Sparkles,
    History,
    Layers,
    Type,
    Download,
};

interface ToolSidebarProps {
    activeTool: ToolCategory | null;
    onSelectTool: (tool: ToolCategory) => void;
}

export const ToolSidebar: React.FC<ToolSidebarProps> = ({ activeTool, onSelectTool }) => {
    return (
        <aside className="w-20 bg-zinc-900 border-r border-zinc-800 flex flex-col items-center py-3 gap-1 select-none z-10">
            {EDITOR_TOOLS.map((tool) => {
                const IconComponent = ICON_MAP[tool.iconName] || Sliders;
                const isActive = activeTool === tool.id;

                return (
                    <button
                        key={tool.id}
                        onClick={() => onSelectTool(tool.id)}
                        className={`w-16 h-15 rounded-xl flex flex-col items-center justify-center gap-1 transition relative group cursor-pointer ${isActive
                            ? 'bg-indigo-600/15 text-indigo-400 border border-indigo-500/30 font-medium'
                            : 'text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200 border border-transparent'
                            }`}
                    >
                        {tool.badge && (
                            <span className="absolute top-1 right-1 text-[9px] font-extrabold px-1 rounded bg-gradient-to-r from-purple-500 to-indigo-500 text-white leading-tight">
                                {tool.badge}
                            </span>
                        )}
                        <IconComponent className={`w-5 h-5 ${isActive ? 'text-indigo-400' : 'text-zinc-400 group-hover:text-zinc-200'}`} />
                        <span className="text-[10px] text-center tracking-tight truncate max-w-[56px]">
                            {tool.label}
                        </span>
                    </button>
                );
            })}
        </aside>
    );
};