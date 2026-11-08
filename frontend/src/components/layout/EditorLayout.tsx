'use client';

import React, { useState } from 'react';
import { ToolCategory } from '@/types/tools';
import { ImageMetadata } from '@/types/editor';
import { DEFAULT_ADJUSTMENTS, DEFAULT_TRANSFORMS, FilterType } from '@/lib/constants';
import { useImageUpload } from '@/hooks/useImageUpload';
import { useEditorHistory } from '@/hooks/useEditorHistory';
import { renderProcessedImageCanvas } from '@/lib/image-utils';

import {
    processEnhancementApi,
    processRestorationApi,
    processBackgroundApi,
    processWatermarkApi,
} from '@/lib/api';

import { EditorHeader } from './EditorHeader';
import { EditorToolbar } from './EditorToolbar';
import { ToolSidebar } from './ToolSidebar';
import { SettingsPanel } from './SettingsPanel';
import { StatusBar } from './StatusBar';

import { ImageCanvas } from '../canvas/ImageCanvas';
import { ImageUploader } from '../upload/ImageUploader';
import { AdjustmentsPanel } from '../tools/adjustments/AdjustmentsPanel';
import { CropPanel } from '../tools/crop/CropPanel';
import { CropRect } from '../tools/crop/CropOverlay';
import { FiltersPanel } from '../tools/filters/FiltersPanel';
import { EnhancementPanel } from '../tools/enhancement/EnhancementPanel';
import { RestorationPanel } from '../tools/restoration/RestorationPanel';
import { BackgroundPanel } from '../tools/background/BackgroundPanel';
import { TextWatermarkPanel } from '../tools/text/TextWatermarkPanel';
import { ExportDialog } from '../tools/export/ExportDialog';

const DEFAULT_CROP_RECT: CropRect = { x: 10, y: 10, width: 80, height: 80 };

export const EditorLayout: React.FC = () => {
    const [activeTool, setActiveTool] = useState<ToolCategory | null>('upload');
    const [zoom, setZoom] = useState<number>(1.0);
    const [showExportModal, setShowExportModal] = useState<boolean>(false);
    const [isBackendProcessing, setIsBackendProcessing] = useState<boolean>(false);

    // Mouse Crop State
    const [cropRect, setCropRect] = useState<CropRect>(DEFAULT_CROP_RECT);
    const [selectedRatio, setSelectedRatio] = useState<string>('free');

    const getNumericRatio = (): number | null => {
        if (selectedRatio === '1:1') return 1.0;
        if (selectedRatio === '4:3') return 4 / 3;
        if (selectedRatio === '16:9') return 16 / 9;
        if (selectedRatio === '3:2') return 3 / 2;
        return null;
    };

    const { currentState, canUndo, canRedo, pushState, undo, redo, resetAll, resetWithNewImage } =
        useEditorHistory(null);

    const handleImageLoaded = (meta: ImageMetadata) => {
        resetWithNewImage(meta.url);
        setActiveTool('adjustments');
    };

    const { image, error, processFile, handleDrop } = useImageUpload(handleImageLoaded);

    const activeImageUrl = currentState.processedUrl || image?.url;

    const handleSelectTool = (tool: ToolCategory) => {
        if (tool === 'export') {
            setShowExportModal(true);
            return;
        }
        setActiveTool((prev) => (prev === tool ? null : tool));
    };

    // --- BACKEND API HANDLERS ---
    const handleEnhance = async (mode: 'auto' | 'denoise' | 'detail', strength?: number) => {
        if (!activeImageUrl) return;
        setIsBackendProcessing(true);
        try {
            const resultUrl = await processEnhancementApi(activeImageUrl, mode, strength);
            pushState({ processedUrl: resultUrl });
        } catch (e) {
            console.error('Enhancement error:', e);
        } finally {
            setIsBackendProcessing(false);
        }
    };

    const handleRestore = async (mode: 'blur' | 'artifacts' | 'noise' | 'negative') => {
        if (!activeImageUrl) return;
        setIsBackendProcessing(true);
        try {
            const resultUrl = await processRestorationApi(activeImageUrl, mode);
            pushState({ processedUrl: resultUrl });
        } catch (e) {
            console.error('Restoration error:', e);
        } finally {
            setIsBackendProcessing(false);
        }
    };

    const handleRemoveBg = async (targetColor: string, tolerance: number) => {
        if (!activeImageUrl) return;
        setIsBackendProcessing(true);
        try {
            const resultUrl = await processBackgroundApi(activeImageUrl, 'remove', targetColor, '#000000', tolerance);
            pushState({ processedUrl: resultUrl });
        } catch (e) {
            console.error('Background removal error:', e);
        } finally {
            setIsBackendProcessing(false);
        }
    };

    const handleReplaceBg = async (targetColor: string, newColor: string, tolerance: number) => {
        if (!activeImageUrl) return;
        setIsBackendProcessing(true);
        try {
            const resultUrl = await processBackgroundApi(activeImageUrl, 'replace', targetColor, newColor, tolerance);
            pushState({ processedUrl: resultUrl });
        } catch (e) {
            console.error('Background replace error:', e);
        } finally {
            setIsBackendProcessing(false);
        }
    };

    const handleWatermark = async (text: string, fontSize: number, color: string, opacity: number, position: string) => {
        if (!activeImageUrl) return;
        setIsBackendProcessing(true);
        try {
            const resultUrl = await processWatermarkApi(activeImageUrl, text, fontSize, color, opacity, position);
            pushState({ processedUrl: resultUrl });
        } catch (e) {
            console.error('Watermark error:', e);
        } finally {
            setIsBackendProcessing(false);
        }
    };

    const handleApplyCrop = async () => {
        if (!image || !activeImageUrl) return;

        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.src = activeImageUrl;
        await new Promise((res) => (img.onload = res));

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const cropX = (cropRect.x / 100) * img.naturalWidth;
        const cropY = (cropRect.y / 100) * img.naturalHeight;
        const cropW = (cropRect.width / 100) * img.naturalWidth;
        const cropH = (cropRect.height / 100) * img.naturalHeight;

        canvas.width = cropW;
        canvas.height = cropH;
        ctx.drawImage(img, cropX, cropY, cropW, cropH, 0, 0, cropW, cropH);

        const croppedUrl = canvas.toDataURL(image.type || 'image/png');
        pushState({ processedUrl: croppedUrl });
        setCropRect(DEFAULT_CROP_RECT);
        setActiveTool('adjustments');
    };

    const handleExportDownload = async (format: string, quality: number) => {
        if (!image || !activeImageUrl) return;

        try {
            const dataUrl = await renderProcessedImageCanvas(
                activeImageUrl,
                currentState.adjustments,
                currentState.activeFilter,
                currentState.transforms.rotation,
                currentState.transforms.flipH,
                currentState.transforms.flipV
            );

            const link = document.createElement('a');
            link.download = `edited_${image.name.split('.')[0]}.${format}`;
            link.href = dataUrl;
            link.click();
            setShowExportModal(false);
        } catch (err) {
            console.error('Export failed:', err);
        }
    };

    return (
        <div className="h-screen w-screen flex flex-col bg-zinc-950 overflow-hidden font-sans">
            <EditorHeader imageName={image?.name} />
            <EditorToolbar
                canUndo={canUndo}
                canRedo={canRedo}
                zoom={zoom}
                hasImage={!!image}
                onOpenImage={() => setActiveTool('upload')}
                onUndo={undo}
                onRedo={redo}
                onReset={resetAll}
                onZoomIn={() => setZoom((z) => Math.min(z + 0.1, 3.0))}
                onZoomOut={() => setZoom((z) => Math.max(z - 0.1, 0.2))}
                onFitScreen={() => setZoom(1.0)}
                onExport={() => setShowExportModal(true)}
            />

            <div className="flex-1 flex overflow-hidden relative">
                <ToolSidebar activeTool={activeTool} onSelectTool={handleSelectTool} />

                <ImageCanvas
                    image={image ? { ...image, url: activeImageUrl } : null}
                    zoom={zoom}
                    adjustments={currentState.adjustments}
                    transforms={currentState.transforms}
                    activeFilter={currentState.activeFilter}
                    isCropActive={activeTool === 'crop'}
                    cropRect={cropRect}
                    onChangeCropRect={setCropRect}
                    aspectRatio={getNumericRatio()}
                    isProcessing={isBackendProcessing}
                    onUploadClick={() => setActiveTool('upload')}
                />

                <SettingsPanel activeTool={activeTool} onClose={() => setActiveTool(null)}>
                    {activeTool === 'upload' && (
                        <ImageUploader
                            onFileSelected={processFile}
                            onDrop={handleDrop}
                            error={error}
                            currentImageName={image?.name}
                        />
                    )}

                    {activeTool === 'adjustments' && (
                        <AdjustmentsPanel
                            values={currentState.adjustments}
                            onChange={(adj) => pushState({ adjustments: adj })}
                            onReset={() => pushState({ adjustments: DEFAULT_ADJUSTMENTS })}
                        />
                    )}

                    {activeTool === 'crop' && (
                        <CropPanel
                            transforms={currentState.transforms}
                            onChangeTransforms={(tr) => pushState({ transforms: tr })}
                            cropRect={cropRect}
                            onChangeCropRect={setCropRect}
                            selectedRatio={selectedRatio}
                            onSelectRatio={setSelectedRatio}
                            onApplyCrop={handleApplyCrop}
                            onResetCrop={() => setCropRect(DEFAULT_CROP_RECT)}
                        />
                    )}

                    {activeTool === 'filters' && (
                        <FiltersPanel
                            activeFilter={currentState.activeFilter}
                            onSelectFilter={(fId: FilterType) => pushState({ activeFilter: fId })}
                            sampleImageUrl={activeImageUrl}
                        />
                    )}

                    {activeTool === 'enhancement' && (
                        <EnhancementPanel onApplyEnhance={handleEnhance} isProcessing={isBackendProcessing} />
                    )}

                    {activeTool === 'restoration' && (
                        <RestorationPanel onApplyRestore={handleRestore} isProcessing={isBackendProcessing} />
                    )}

                    {activeTool === 'background' && (
                        <BackgroundPanel
                            onRemoveBackground={handleRemoveBg}
                            onReplaceBackground={handleReplaceBg}
                            isProcessing={isBackendProcessing}
                        />
                    )}

                    {activeTool === 'text' && (
                        <TextWatermarkPanel onApplyWatermark={handleWatermark} isProcessing={isBackendProcessing} />
                    )}
                </SettingsPanel>
            </div>

            <StatusBar image={image} zoom={zoom} />

            {showExportModal && (
                <ExportDialog
                    image={image}
                    onClose={() => setShowExportModal(false)}
                    onExportDownload={handleExportDownload}
                />
            )}
        </div>
    );
};