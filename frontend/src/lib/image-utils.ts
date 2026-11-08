import { AdjustmentValues, FILTER_PRESETS } from './constants';

/**
 * Builds extended CSS filter string for real-time preview including advanced tone and color controls
 */
export function getCssFilterString(
    adjustments: AdjustmentValues,
    activeFilter: string
): string {
    // Tone & Exposure calculations
    const totalBrightness = 100 + adjustments.brightness + adjustments.exposure * 0.8 + adjustments.highlights * 0.3 + adjustments.shadows * 0.2;
    const totalContrast = 100 + adjustments.contrast + adjustments.whitePoint * 0.4 - adjustments.blackPoint * 0.4;
    const totalSaturation = 100 + adjustments.saturation + adjustments.skinTone * 0.2;
    const blur = adjustments.blur;

    // Temperature & Tint Hue rotation mapping
    // Warmth shifts towards amber/orange (+hue), Blue tone shifts towards cool blue (-hue)
    const netHueShift = (adjustments.warmth * 0.3) - (adjustments.blueTone * 0.4) + (adjustments.tint * 0.25);
    const sepiaTone = Math.max(0, adjustments.warmth * 0.4 + adjustments.skinTone * 0.2);

    let filterStr = `brightness(${Math.max(0, totalBrightness)}%) contrast(${Math.max(0, totalContrast)}%) saturate(${Math.max(0, totalSaturation)}%) blur(${blur}px)`;

    if (sepiaTone > 0) {
        filterStr += ` sepia(${Math.min(100, sepiaTone)}%)`;
    }

    if (Math.abs(netHueShift) > 0.1) {
        filterStr += ` hue-rotate(${netHueShift}deg)`;
    }

    if (activeFilter && activeFilter !== 'original') {
        const preset = FILTER_PRESETS.find((f) => f.id === activeFilter);
        if (preset && preset.cssFilter !== 'none') {
            filterStr += ` ${preset.cssFilter}`;
        }
    }

    return filterStr;
}

/**
 * Renders adjustments & transforms onto an HTML Canvas for export download
 */
export function renderProcessedImageCanvas(
    imageSrc: string,
    adjustments: AdjustmentValues,
    activeFilter: string,
    rotation: number,
    flipH: boolean,
    flipV: boolean
): Promise<string> {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            if (!ctx) {
                reject(new Error('Failed to get canvas 2D context'));
                return;
            }

            const isRotated90 = Math.abs(rotation) % 180 === 90;
            canvas.width = isRotated90 ? img.height : img.width;
            canvas.height = isRotated90 ? img.width : img.height;

            ctx.save();
            ctx.translate(canvas.width / 2, canvas.height / 2);
            ctx.rotate((rotation * Math.PI) / 180);
            ctx.scale(flipH ? -1 : 1, flipV ? -1 : 1);

            ctx.filter = getCssFilterString(adjustments, activeFilter);

            const drawWidth = img.width;
            const drawHeight = img.height;
            ctx.drawImage(img, -drawWidth / 2, -drawHeight / 2, drawWidth, drawHeight);

            ctx.restore();

            resolve(canvas.toDataURL('image/png'));
        };
        img.onerror = () => reject(new Error('Failed to load image for rendering'));
        img.src = imageSrc;
    });
}