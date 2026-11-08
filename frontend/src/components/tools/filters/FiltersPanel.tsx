'use client';

import React from 'react';
import { FILTER_PRESETS, FilterType } from '@/lib/constants';

interface FiltersPanelProps {
    activeFilter: FilterType | string;
    onSelectFilter: (filterId: FilterType) => void;
    sampleImageUrl?: string;
}

export const FiltersPanel: React.FC<FiltersPanelProps> = ({
    activeFilter,
    onSelectFilter,
    sampleImageUrl,
}) => {
    return (
        <div className="grid grid-cols-2 gap-3 select-none">
            {FILTER_PRESETS.map((filter) => {
                const isActive = activeFilter === filter.id;

                return (
                    <button
                        key={filter.id}
                        onClick={() => onSelectFilter(filter.id)}
                        className={`p-2 rounded-xl border flex flex-col items-center gap-2 transition cursor-pointer ${isActive
                                ? 'bg-indigo-600/20 border-indigo-500 ring-1 ring-indigo-500'
                                : 'bg-zinc-800/60 hover:bg-zinc-800 border-zinc-700/60 text-zinc-400'
                            }`}
                    >
                        <div className="w-full h-16 rounded-lg bg-zinc-900 overflow-hidden relative border border-zinc-700/50">
                            {sampleImageUrl ? (
                                /* eslint-disable-next-html-element-suppression */
                                <img
                                    src={sampleImageUrl}
                                    alt={filter.label}
                                    style={{ filter: filter.cssFilter }}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div
                                    style={{ filter: filter.cssFilter }}
                                    className="w-full h-full bg-gradient-to-tr from-amber-500 via-indigo-500 to-emerald-400"
                                />
                            )}
                        </div>

                        <span className={`text-[11px] font-medium ${isActive ? 'text-indigo-300' : 'text-zinc-300'}`}>
                            {filter.label}
                        </span>
                    </button>
                );
            })}
        </div>
    );
};