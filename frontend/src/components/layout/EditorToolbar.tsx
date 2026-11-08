'use client';

import React from 'react';
import {
    FolderOpen,
    Undo2,
    Redo2,
    RotateCcw,
    ZoomIn,
    ZoomOut,
    Maximize2,
    Download,
} from 'lucide-react';

interface EditorToolbarProps {
    canUndo: boolean;
    canRedo: boolean;
    zoom: number;
    hasImage: boolean;
    onOpenImage: () => void;
    onUndo: () => void;
    onRedo: () => void;
    onReset: () => void;
    onZoomIn: () => void;
    onZoomOut: () => void;
    onFitScreen: () => void;
    onExport: () => void;
}

export const EditorToolbar: React.FC<EditorToolbarProps> = ({
    canUndo,
    canRedo,
    zoom,
    hasImage,
    onOpenImage,
    onUndo,
    onRedo,
    onReset,
    onZoomIn,
    onZoomOut,
    onFitScreen,
    onExport,
}) => {
    return (
        <div className="h-12 bg-zinc-900/90 border-b border-zinc-800 px-4 flex items-center justify-between text-zinc-300">
            <div className="flex items-center gap-1">
                <button
                    onClick={onOpenImage}
                    className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 transition cursor-pointer"
                    title="Open Image file"
                >
                    <FolderOpen className="w-4 h-4 text-indigo-400" />
                    <span>Open Image</span>
                </button>

                <div className="h-4 w-[1px] bg-zinc-800 mx-2" />

                <button
                    onClick={onUndo}
                    disabled={!canUndo}
                    className="p-1.5 rounded-md hover:bg-zinc-800 disabled:opacity-30 disabled:hover:bg-transparent transition cursor-pointer"
                    title="Undo (Ctrl+Z)"
                >
                    <Undo2 className="w-4 h-4" />
                </button>
                <button
                    onClick={onRedo}
                    disabled={!canRedo}
                    className="p-1.5 rounded-md hover:bg-zinc-800 disabled:opacity-30 disabled:hover:bg-transparent transition cursor-pointer"
                    title="Redo (Ctrl+Y)"
                >
                    <Redo2 className="w-4 h-4" />
                </button>
                <button
                    onClick={onReset}
                    disabled={!hasImage}
                    className="p-1.5 rounded-md hover:bg-zinc-800 disabled:opacity-30 disabled:hover:bg-transparent transition text-amber-400 cursor-pointer"
                    title="Reset All Edits"
                >
                    <RotateCcw className="w-4 h-4" />
                </button>
            </div>

            <div className="flex items-center gap-1">
                <button
                    onClick={onZoomOut}
                    disabled={!hasImage}
                    className="p-1.5 rounded-md hover:bg-zinc-800 disabled:opacity-30 disabled:hover:bg-transparent transition cursor-pointer"
                    title="Zoom Out"
                >
                    <ZoomOut className="w-4 h-4" />
                </button>
                <span className="text-xs font-mono px-2 py-0.5 bg-zinc-800 rounded text-zinc-400 border border-zinc-700 min-w-[50px] text-center">
                    {Math.round(zoom * 100)}%
                </span>
                <button
                    onClick={onZoomIn}
                    disabled={!hasImage}
                    className="p-1.5 rounded-md hover:bg-zinc-800 disabled:opacity-30 disabled:hover:bg-transparent transition cursor-pointer"
                    title="Zoom In"
                >
                    <ZoomIn className="w-4 h-4" />
                </button>
                <button
                    onClick={onFitScreen}
                    disabled={!hasImage}
                    className="p-1.5 rounded-md hover:bg-zinc-800 disabled:opacity-30 disabled:hover:bg-transparent transition cursor-pointer"
                    title="Fit to Canvas"
                >
                    <Maximize2 className="w-4 h-4" />
                </button>
            </div>

            <div>
                <button
                    onClick={onExport}
                    disabled={!hasImage}
                    className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white transition shadow-sm cursor-pointer"
                >
                    <Download className="w-4 h-4" />
                    <span>Export</span>
                </button>
            </div>
        </div>
    );
};