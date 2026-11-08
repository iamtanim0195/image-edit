'use client';

import React from 'react';
import { RotateCcw, Sun, Palette, Sparkles, Sliders } from 'lucide-react';
import { AdjustmentValues, DEFAULT_ADJUSTMENTS } from '@/lib/constants';
import { SliderControl } from '@/components/ui/SliderControl';

interface AdjustmentsPanelProps {
    values: AdjustmentValues;
    onChange: (newValues: AdjustmentValues) => void;
    onReset: () => void;
}

export const AdjustmentsPanel: React.FC<AdjustmentsPanelProps> = ({
    values,
    onChange,
    onReset,
}) => {
    const updateSingle = (key: keyof AdjustmentValues, val: number) => {
        onChange({ ...values, [key]: val });
    };

    return (
        <div className="space-y-5 select-none pb-4">
            {/* Panel Header with Reset Action */}
            <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
                <span className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
                    <Sliders className="w-4 h-4 text-indigo-400" />
                    <span>Image Adjustments</span>
                </span>
                <button
                    onClick={onReset}
                    className="flex items-center gap-1 text-[11px] text-amber-400 hover:text-amber-300 transition cursor-pointer"
                >
                    <RotateCcw className="w-3 h-3" />
                    <span>Reset All</span>
                </button>
            </div>

            {/* SECTION 1: LIGHT & TONE */}
            <div className="space-y-3">
                <h3 className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Sun className="w-3.5 h-3.5 text-amber-400" />
                    <span>Light & Tone</span>
                </h3>

                <SliderControl
                    label="Brightness"
                    value={values.brightness}
                    min={-100}
                    max={100}
                    defaultValue={DEFAULT_ADJUSTMENTS.brightness}
                    onChange={(v) => updateSingle('brightness', v)}
                />
                <SliderControl
                    label="Contrast"
                    value={values.contrast}
                    min={-100}
                    max={100}
                    defaultValue={DEFAULT_ADJUSTMENTS.contrast}
                    onChange={(v) => updateSingle('contrast', v)}
                />
                <SliderControl
                    label="Exposure"
                    value={values.exposure}
                    min={-100}
                    max={100}
                    defaultValue={DEFAULT_ADJUSTMENTS.exposure}
                    onChange={(v) => updateSingle('exposure', v)}
                />
                <SliderControl
                    label="Highlights"
                    value={values.highlights}
                    min={-100}
                    max={100}
                    defaultValue={DEFAULT_ADJUSTMENTS.highlights}
                    onChange={(v) => updateSingle('highlights', v)}
                />
                <SliderControl
                    label="Shadows"
                    value={values.shadows}
                    min={-100}
                    max={100}
                    defaultValue={DEFAULT_ADJUSTMENTS.shadows}
                    onChange={(v) => updateSingle('shadows', v)}
                />
                <SliderControl
                    label="White Point"
                    value={values.whitePoint}
                    min={-100}
                    max={100}
                    defaultValue={DEFAULT_ADJUSTMENTS.whitePoint}
                    onChange={(v) => updateSingle('whitePoint', v)}
                />
                <SliderControl
                    label="Black Point"
                    value={values.blackPoint}
                    min={-100}
                    max={100}
                    defaultValue={DEFAULT_ADJUSTMENTS.blackPoint}
                    onChange={(v) => updateSingle('blackPoint', v)}
                />
            </div>

            {/* SECTION 2: COLOR & TEMPERATURE */}
            <div className="space-y-3 pt-2">
                <h3 className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Palette className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Color & Balance</span>
                </h3>

                <SliderControl
                    label="Saturation"
                    value={values.saturation}
                    min={-100}
                    max={100}
                    defaultValue={DEFAULT_ADJUSTMENTS.saturation}
                    onChange={(v) => updateSingle('saturation', v)}
                />
                <SliderControl
                    label="Warmth"
                    value={values.warmth}
                    min={-100}
                    max={100}
                    defaultValue={DEFAULT_ADJUSTMENTS.warmth}
                    onChange={(v) => updateSingle('warmth', v)}
                />
                <SliderControl
                    label="Tint"
                    value={values.tint}
                    min={-100}
                    max={100}
                    defaultValue={DEFAULT_ADJUSTMENTS.tint}
                    onChange={(v) => updateSingle('tint', v)}
                />
                <SliderControl
                    label="Skin Tone"
                    value={values.skinTone}
                    min={-100}
                    max={100}
                    defaultValue={DEFAULT_ADJUSTMENTS.skinTone}
                    onChange={(v) => updateSingle('skinTone', v)}
                />
                <SliderControl
                    label="Blue Tone"
                    value={values.blueTone}
                    min={-100}
                    max={100}
                    defaultValue={DEFAULT_ADJUSTMENTS.blueTone}
                    onChange={(v) => updateSingle('blueTone', v)}
                />
            </div>

            {/* SECTION 3: DETAILS & BLUR */}
            <div className="space-y-3 pt-2">
                <h3 className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Details & Softness</span>
                </h3>

                <SliderControl
                    label="Blur"
                    value={values.blur}
                    min={0}
                    max={20}
                    unit="px"
                    defaultValue={DEFAULT_ADJUSTMENTS.blur}
                    onChange={(v) => updateSingle('blur', v)}
                />
            </div>
        </div>
    );
};