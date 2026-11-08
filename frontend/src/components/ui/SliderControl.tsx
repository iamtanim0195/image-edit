'use client';

import React from 'react';
import { RotateCcw } from 'lucide-react';

interface SliderControlProps {
    label: string;
    value: number;
    min: number;
    max: number;
    step?: number;
    defaultValue: number;
    unit?: string;
    onChange: (val: number) => void;
}

export const SliderControl: React.FC<SliderControlProps> = ({
    label,
    value,
    min,
    max,
    step = 1,
    defaultValue,
    unit = '',
    onChange,
}) => {
    const isModified = value !== defaultValue;

    return (
        <div className="space-y-1.5 bg-zinc-800/40 p-2.5 rounded-lg border border-zinc-800">
            <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-zinc-300">{label}</span>
                <div className="flex items-center gap-2">
                    <span className="font-mono text-indigo-400 font-semibold text-[11px]">
                        {value > 0 ? `+${value}` : value}
                        {unit}
                    </span>
                    {isModified && (
                        <button
                            onClick={() => onChange(defaultValue)}
                            className="text-zinc-500 hover:text-amber-400 transition cursor-pointer"
                            title="Reset slider value"
                        >
                            <RotateCcw className="w-3 h-3" />
                        </button>
                    )}
                </div>
            </div>

            <input
                type="range"
                min={min}
                max={max}
                step={step}
                value={value}
                onChange={(e) => onChange(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
            />
        </div>
    );
};