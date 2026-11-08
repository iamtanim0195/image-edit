'use client';

import React from 'react';

interface ColorPickerProps {
    label: string;
    color: string;
    onChange: (hex: string) => void;
}

const PRESET_COLORS = [
    '#FFFFFF', '#000000', '#F87171', '#4ADE80',
    '#60A5FA', '#FACC15', '#C084FC', '#FB923C'
];

export const ColorPicker: React.FC<ColorPickerProps> = ({ label, color, onChange }) => {
    return (
        <div className="space-y-1.5 bg-zinc-800/40 p-2.5 rounded-lg border border-zinc-800 select-none">
            <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-zinc-300">{label}</span>
                <div className="flex items-center gap-2">
                    <input
                        type="color"
                        value={color}
                        onChange={(e) => onChange(e.target.value)}
                        className="w-5 h-5 rounded cursor-pointer border-0 bg-transparent"
                    />
                    <span className="font-mono text-zinc-400 text-[11px] uppercase">{color}</span>
                </div>
            </div>
            <div className="flex items-center gap-1.5 pt-1">
                {PRESET_COLORS.map((c) => (
                    <button
                        key={c}
                        onClick={() => onChange(c)}
                        style={{ backgroundColor: c }}
                        className={`w-5 h-5 rounded-full border transition cursor-pointer ${color.toUpperCase() === c ? 'ring-2 ring-indigo-400 scale-110 border-white' : 'border-zinc-700'
                            }`}
                    />
                ))}
            </div>
        </div>
    );
};