'use client';

import React from 'react';
import { RotateCcw, RotateCw, FlipHorizontal, FlipVertical, Check, RefreshCw } from 'lucide-react';
import { TransformValues } from '@/lib/constants';
import { CropRect } from './CropOverlay';

interface CropPanelProps {
    transforms: TransformValues;
    onChangeTransforms: (newTransforms: TransformValues) => void;
    cropRect: CropRect;
    onChangeCropRect: (rect: CropRect) => void;
    selectedRatio: string;
    onSelectRatio: (ratioKey: string) => void;
    onApplyCrop: () => void;
    onResetCrop: () => void;
}

const PRESETS = [
    { label: 'Free', key: 'free' },
    { label: '1:1', key: '1:1' },
    { label: '4:3', key: '4:3' },
    { label: '16:9', key: '16:9' },
    { label: '3:2', key: '3:2' },
];

export const CropPanel: React.FC<CropPanelProps> = ({
    transforms,
    onChangeTransforms,
    cropRect,
    onChangeCropRect,
    selectedRatio,
    onSelectRatio,
    onApplyCrop,
    onResetCrop,
}) => {
    return (
        <div className="space-y-5 select-none">
            <div>
                <label className="text-xs font-semibold text-zinc-300 block mb-2">
                    Orientation & Flip
                </label>
                <div className="grid grid-cols-4 gap-2">
                    <button
                        onClick={() =>
                            onChangeTransforms({
                                ...transforms,
                                rotation: (transforms.rotation - 90 + 360) % 360,
                            })
                        }
                        className="p-2.5 bg-zinc-800 hover:bg-zinc-700 rounded-lg flex flex-col items-center justify-center gap-1 text-zinc-300 text-[10px] transition cursor-pointer border border-zinc-700"
                    >
                        <RotateCcw className="w-4 h-4 text-indigo-400" />
                        <span>-90°</span>
                    </button>
                    <button
                        onClick={() =>
                            onChangeTransforms({
                                ...transforms,
                                rotation: (transforms.rotation + 90) % 360,
                            })
                        }
                        className="p-2.5 bg-zinc-800 hover:bg-zinc-700 rounded-lg flex flex-col items-center justify-center gap-1 text-zinc-300 text-[10px] transition cursor-pointer border border-zinc-700"
                    >
                        <RotateCw className="w-4 h-4 text-indigo-400" />
                        <span>+90°</span>
                    </button>
                    <button
                        onClick={() =>
                            onChangeTransforms({ ...transforms, flipH: !transforms.flipH })
                        }
                        className={`p-2.5 rounded-lg flex flex-col items-center justify-center gap-1 text-[10px] transition cursor-pointer border ${transforms.flipH
                                ? 'bg-indigo-600/20 border-indigo-500 text-indigo-400'
                                : 'bg-zinc-800 hover:bg-zinc-700 border-zinc-700 text-zinc-300'
                            }`}
                    >
                        <FlipHorizontal className="w-4 h-4" />
                        <span>Flip H</span>
                    </button>
                    <button
                        onClick={() =>
                            onChangeTransforms({ ...transforms, flipV: !transforms.flipV })
                        }
                        className={`p-2.5 rounded-lg flex flex-col items-center justify-center gap-1 text-[10px] transition cursor-pointer border ${transforms.flipV
                                ? 'bg-indigo-600/20 border-indigo-500 text-indigo-400'
                                : 'bg-zinc-800 hover:bg-zinc-700 border-zinc-700 text-zinc-300'
                            }`}
                    >
                        <FlipVertical className="w-4 h-4" />
                        <span>Flip V</span>
                    </button>
                </div>
            </div>

            <div>
                <label className="text-xs font-semibold text-zinc-300 block mb-2">
                    Interactive Aspect Presets
                </label>
                <div className="grid grid-cols-3 gap-2">
                    {PRESETS.map((p) => (
                        <button
                            key={p.key}
                            onClick={() => onSelectRatio(p.key)}
                            className={`py-2 px-3 text-xs rounded-lg border font-mono transition cursor-pointer ${selectedRatio === p.key
                                    ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300 font-bold'
                                    : 'bg-zinc-800 hover:bg-zinc-700 border-zinc-700 text-zinc-400'
                                }`}
                        >
                            {p.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex items-center gap-2">
                <button
                    onClick={onResetCrop}
                    className="flex-1 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 transition cursor-pointer border border-zinc-700"
                >
                    <RefreshCw className="w-3.5 h-3.5 text-zinc-400" />
                    <span>Reset Box</span>
                </button>
                <button
                    onClick={onApplyCrop}
                    className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 shadow-md transition cursor-pointer"
                >
                    <Check className="w-4 h-4" />
                    <span>Crop Selected Area</span>
                </button>
            </div>
        </div>
    );
};