'use client';

import React, { useState } from 'react';
import { Scissors, Palette, Aperture, Sparkles } from 'lucide-react';
import { ColorPicker } from '@/components/ui/ColorPicker';
import { SliderControl } from '@/components/ui/SliderControl';

interface BackgroundPanelProps {
    onRemoveBackground: () => void;
    onReplaceBackground: (newColor: string) => void;
    onBlurBackground: (blurStrength: number) => void;
    isProcessing: boolean;
}

export const BackgroundPanel: React.FC<BackgroundPanelProps> = ({
    onRemoveBackground,
    onReplaceBackground,
    onBlurBackground,
    isProcessing,
}) => {
    const [newColor, setNewColor] = useState<string>('#4F46E5');
    const [blurStrength, setBlurStrength] = useState<number>(25);

    return (
        <div className="space-y-5 select-none">
            {/* 1. AI Transparent Background Removal */}
            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-zinc-300">AI Subject Cutout</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-500/15 text-indigo-400 border border-indigo-500/30 font-medium flex items-center gap-1">
                        <Sparkles className="w-2.5 h-2.5" /> U2-Net AI
                    </span>
                </div>
                <button
                    onClick={onRemoveBackground}
                    disabled={isProcessing}
                    className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-2 shadow-md transition cursor-pointer disabled:opacity-50"
                >
                    <Scissors className="w-4 h-4" />
                    <span>Remove Background (Transparent)</span>
                </button>
            </div>

            {/* 2. Portrait Background Blur (Bokeh) */}
            <div className="pt-3 border-t border-zinc-800 space-y-3">
                <span className="text-xs font-semibold text-zinc-300 block">
                    Portrait Background Blur
                </span>
                <SliderControl
                    label="Blur Intensity"
                    value={blurStrength}
                    min={5}
                    max={75}
                    step={2}
                    unit="px"
                    defaultValue={25}
                    onChange={setBlurStrength}
                />
                <button
                    onClick={() => onBlurBackground(blurStrength)}
                    disabled={isProcessing}
                    className="w-full py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition cursor-pointer disabled:opacity-50"
                >
                    <Aperture className="w-4 h-4 text-sky-400" />
                    <span>Blur Background</span>
                </button>
            </div>

            {/* 3. Solid Color Replacement */}
            <div className="pt-3 border-t border-zinc-800 space-y-3">
                <ColorPicker
                    label="Replace Background Color"
                    color={newColor}
                    onChange={setNewColor}
                />
                <button
                    onClick={() => onReplaceBackground(newColor)}
                    disabled={isProcessing}
                    className="w-full py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition cursor-pointer disabled:opacity-50"
                >
                    <Palette className="w-4 h-4 text-emerald-400" />
                    <span>Apply Solid Background</span>
                </button>
            </div>
        </div>
    );
};