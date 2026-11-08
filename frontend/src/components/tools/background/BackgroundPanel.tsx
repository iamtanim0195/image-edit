'use client';

import React, { useState } from 'react';
import { Layers, Scissors, Palette } from 'lucide-react';
import { ColorPicker } from '@/components/ui/ColorPicker';
import { SliderControl } from '@/components/ui/SliderControl';

interface BackgroundPanelProps {
    onRemoveBackground: (targetColor: string, tolerance: number) => void;
    onReplaceBackground: (targetColor: string, newColor: string, tolerance: number) => void;
    isProcessing: boolean;
}

export const BackgroundPanel: React.FC<BackgroundPanelProps> = ({
    onRemoveBackground,
    onReplaceBackground,
    isProcessing,
}) => {
    const [targetColor, setTargetColor] = useState<string>('#FFFFFF');
    const [newColor, setNewColor] = useState<string>('#4F46E5');
    const [tolerance, setTolerance] = useState<number>(35);

    return (
        <div className="space-y-4 select-none">
            <ColorPicker label="Target Background Color" color={targetColor} onChange={setTargetColor} />
            <SliderControl
                label="Color Tolerance"
                value={tolerance}
                min={10}
                max={100}
                defaultValue={35}
                onChange={setTolerance}
            />

            <div className="pt-2 space-y-2">
                <button
                    onClick={() => onRemoveBackground(targetColor, tolerance)}
                    disabled={isProcessing}
                    className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-2 shadow-md transition cursor-pointer disabled:opacity-50"
                >
                    <Scissors className="w-4 h-4" />
                    <span>Remove Background (Transparent)</span>
                </button>

                <div className="pt-3 border-t border-zinc-800 space-y-3">
                    <ColorPicker label="New Solid Background" color={newColor} onChange={setNewColor} />
                    <button
                        onClick={() => onReplaceBackground(targetColor, newColor, tolerance)}
                        disabled={isProcessing}
                        className="w-full py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition cursor-pointer disabled:opacity-50"
                    >
                        <Palette className="w-4 h-4 text-emerald-400" />
                        <span>Replace Background Color</span>
                    </button>
                </div>
            </div>
        </div>
    );
};