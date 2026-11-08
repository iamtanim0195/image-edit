import { ToolConfig } from '@/types/tools';

export const EDITOR_TOOLS: ToolConfig[] = [
    {
        id: 'upload',
        label: 'Upload',
        iconName: 'Upload',
        description: 'Open or replace image',
    },
    {
        id: 'crop',
        label: 'Crop & Rotate',
        iconName: 'Crop',
        description: 'Crop, flip, and rotate image orientation',
    },
    {
        id: 'adjustments',
        label: 'Adjustments',
        iconName: 'Sliders',
        description: 'Tweak brightness, contrast, exposure, and color balance',
    },
    {
        id: 'filters',
        label: 'Filters',
        iconName: 'Wand2',
        description: 'Apply aesthetic filter presets',
    },
    {
        id: 'enhancement',
        label: 'Enhancement',
        iconName: 'Sparkles',
        description: 'Auto-tune image quality, sharpness, and denoise',
    },
    {
        id: 'restoration',
        label: 'Restoration',
        iconName: 'History',
        description: 'Repair scratches, noise, and artifacts (Backend AI)',
        badge: 'AI',
    },
    {
        id: 'background',
        label: 'Background',
        iconName: 'Layers',
        description: 'Remove background or change colors (Backend AI)',
        badge: 'AI',
    },
    {
        id: 'text',
        label: 'Text & Watermark',
        iconName: 'Type',
        description: 'Add custom text overlays and copyright watermarks',
    },
];