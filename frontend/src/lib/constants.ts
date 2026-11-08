export const MAX_FILE_SIZE_BYTES = 25 * 1024 * 1024; // 25 MB
export const SUPPORTED_MIME_TYPES = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
];

export interface AdjustmentValues {
    // Exposure & Tone
    brightness: number;  // -100 to 100
    contrast: number;    // -100 to 100
    exposure: number;    // -100 to 100
    highlights: number;  // -100 to 100
    shadows: number;     // -100 to 100
    whitePoint: number;  // -100 to 100
    blackPoint: number;  // -100 to 100

    // Color & Saturation
    saturation: number;  // -100 to 100
    warmth: number;      // -100 to 100
    tint: number;        // -100 to 100
    skinTone: number;    // -100 to 100
    blueTone: number;    // -100 to 100

    // Details
    sharpness: number;   // 0 to 100
    blur: number;        // 0 to 20 px
}

export const DEFAULT_ADJUSTMENTS: AdjustmentValues = {
    brightness: 0,
    contrast: 0,
    exposure: 0,
    highlights: 0,
    shadows: 0,
    whitePoint: 0,
    blackPoint: 0,
    saturation: 0,
    warmth: 0,
    tint: 0,
    skinTone: 0,
    blueTone: 0,
    sharpness: 0,
    blur: 0,
};

export interface TransformValues {
    rotation: number;
    flipH: boolean;
    flipV: boolean;
}

export const DEFAULT_TRANSFORMS: TransformValues = {
    rotation: 0,
    flipH: false,
    flipV: false,
};

export type FilterType =
    | 'original'
    | 'grayscale'
    | 'sepia'
    | 'vintage'
    | 'warm'
    | 'cool'
    | 'high-contrast'
    | 'black-white';

export interface FilterPreset {
    id: FilterType;
    label: string;
    cssFilter: string;
}

export const FILTER_PRESETS: FilterPreset[] = [
    { id: 'original', label: 'Original', cssFilter: 'none' },
    { id: 'grayscale', label: 'Grayscale', cssFilter: 'grayscale(100%)' },
    { id: 'sepia', label: 'Sepia', cssFilter: 'sepia(100%)' },
    { id: 'vintage', label: 'Vintage', cssFilter: 'sepia(50%) hue-rotate(-30deg) contrast(110%)' },
    { id: 'warm', label: 'Warm', cssFilter: 'sepia(30%) saturate(140%)' },
    { id: 'cool', label: 'Cool', cssFilter: 'hue-rotate(30deg) saturate(110%)' },
    { id: 'high-contrast', label: 'High Contrast', cssFilter: 'contrast(160%) brightness(105%)' },
    { id: 'black-white', label: 'B & W', cssFilter: 'grayscale(100%) contrast(150%)' },
];