'use client';

import React, { useState } from 'react';
import { Type, Stamp, Check } from 'lucide-react';
import { ColorPicker } from '@/components/ui/ColorPicker';
import { SliderControl } from '@/components/ui/SliderControl';

interface TextWatermarkPanelProps {
    onApplyWatermark: (text: string, fontSize: number, color: string, opacity: number, position: string) => void;
    isProcessing: boolean;
}

export const TextWatermarkPanel: React.FC<TextWatermarkPanelProps> = ({
    onApplyWatermark,
    isProcessing,
}) => {
    const [text, setText] = useState<string>('© Pixel Studio 2026');
    const [fontSize, setFontSize] = useState<number>(36);
    const [color, setColor] = useState<string>('#FFFFFF');
    const [opacity, setOpacity] = useState<number>(0.8);
    const [position, setPosition] = useState<string>('bottom-right');

    return (
        <div className="space-y-4 select-none">
            <div>
                <label className="text-xs font-semibold text-zinc-300 block mb-1.5 flex items-center gap-1.5">
                    <Type className="w-4 h-4 text-indigo-400" />
                    <span>Watermark Text</span>
                </label>
                <input
                    type="text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-xs text-zinc-200 focus:outline-none focus:border-indigo-500"
                    placeholder="Enter text..."
                />
            </div>

            <SliderControl label="Font Size" value={fontSize} min={12} max={120} defaultValue={36} unit="px" onChange={setFontSize} />
            <ColorPicker label="Text Color" color={color} onChange={setColor} />
            <SliderControl label="Opacity" value={Math.round(opacity * 100)} min={10} max={100} defaultValue={80} unit="%" onChange={(v) => setOpacity(v / 100)} />

            <div>
                <label className="text-xs font-semibold text-zinc-300 block mb-2">Position</label>
                <div className="grid grid-cols-3 gap-1.5 text-[10px]">
                    {['top-left', 'center', 'top-right', 'bottom-left', 'bottom-right'].map((pos) => (
                        <button
                            key={pos}
                            onClick={() => setPosition(pos)}
                            className={`py-1.5 rounded border transition cursor-pointer uppercase ${position === pos ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300 font-bold' : 'bg-zinc-800 border-zinc-700 text-zinc-400'
                                }`}
                        >
                            {pos.replace('-', ' ')}
                        </button>
                    ))}
                </div>
            </div>

            <button
                onClick={() => onApplyWatermark(text, fontSize, color, opacity, position)}
                disabled={isProcessing || !text.trim()}
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-2 shadow-md transition cursor-pointer disabled:opacity-50"
            >
                <Stamp className="w-4 h-4" />
                <span>Apply Watermark</span>
            </button>
        </div>
    );
};