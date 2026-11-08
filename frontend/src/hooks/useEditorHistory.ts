'use client';

import { useState, useCallback } from 'react';
import { AdjustmentValues, DEFAULT_ADJUSTMENTS, DEFAULT_TRANSFORMS, TransformValues } from '@/lib/constants';

export interface HistoryState {
    adjustments: AdjustmentValues;
    transforms: TransformValues;
    activeFilter: string;
    processedUrl: string | null;
}

export function useEditorHistory(initialImageUrl: string | null) {
    const [history, setHistory] = useState<HistoryState[]>([
        {
            adjustments: DEFAULT_ADJUSTMENTS,
            transforms: DEFAULT_TRANSFORMS,
            activeFilter: 'original',
            processedUrl: initialImageUrl,
        },
    ]);
    const [currentIndex, setCurrentIndex] = useState<number>(0);

    const currentState = history[currentIndex] || {
        adjustments: DEFAULT_ADJUSTMENTS,
        transforms: DEFAULT_TRANSFORMS,
        activeFilter: 'original',
        processedUrl: initialImageUrl,
    };

    const pushState = useCallback((newState: Partial<HistoryState>) => {
        setHistory((prev) => {
            const truncated = prev.slice(0, currentIndex + 1);
            const latest = truncated[truncated.length - 1] || {
                adjustments: DEFAULT_ADJUSTMENTS,
                transforms: DEFAULT_TRANSFORMS,
                activeFilter: 'original',
                processedUrl: null,
            };
            const merged: HistoryState = {
                adjustments: newState.adjustments || latest.adjustments,
                transforms: newState.transforms || latest.transforms,
                activeFilter: newState.activeFilter !== undefined ? newState.activeFilter : latest.activeFilter,
                processedUrl: newState.processedUrl !== undefined ? newState.processedUrl : latest.processedUrl,
            };
            return [...truncated, merged];
        });
        setCurrentIndex((prev) => prev + 1);
    }, [currentIndex]);

    const undo = useCallback(() => {
        if (currentIndex > 0) {
            setCurrentIndex((prev) => prev - 1);
        }
    }, [currentIndex]);

    const redo = useCallback(() => {
        if (currentIndex < history.length - 1) {
            setCurrentIndex((prev) => prev + 1);
        }
    }, [currentIndex, history.length]);

    const resetAll = useCallback(() => {
        if (history.length > 0) {
            setHistory([history[0]]);
            setCurrentIndex(0);
        }
    }, [history]);

    const resetWithNewImage = useCallback((newUrl: string) => {
        setHistory([
            {
                adjustments: DEFAULT_ADJUSTMENTS,
                transforms: DEFAULT_TRANSFORMS,
                activeFilter: 'original',
                processedUrl: newUrl,
            },
        ]);
        setCurrentIndex(0);
    }, []);

    return {
        currentState,
        canUndo: currentIndex > 0,
        canRedo: currentIndex < history.length - 1,
        pushState,
        undo,
        redo,
        resetAll,
        resetWithNewImage,
    };
}