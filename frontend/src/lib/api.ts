const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1:8000';

async function fetchBlobFromDataUrl(dataUrl: string): Promise<Blob> {
    const res = await fetch(dataUrl);
    return await res.blob();
}

export async function processEnhancementApi(
    imageUrl: string,
    mode: 'auto' | 'denoise' | 'detail',
    strength: number = 10
): Promise<string> {
    const blob = await fetchBlobFromDataUrl(imageUrl);
    const formData = new FormData();
    formData.append('file', blob, 'image.png');
    formData.append('mode', mode);
    formData.append('strength', strength.toString());

    const response = await fetch(`${API_BASE_URL}/api/enhance`, {
        method: 'POST',
        body: formData,
    });

    if (!response.ok) throw new Error('Enhancement processing failed');
    const resultBlob = await response.blob();
    return URL.createObjectURL(resultBlob);
}

export async function processRestorationApi(
    imageUrl: string,
    mode: 'blur' | 'artifacts' | 'noise' | 'negative'
): Promise<string> {
    const blob = await fetchBlobFromDataUrl(imageUrl);
    const formData = new FormData();
    formData.append('file', blob, 'image.png');
    formData.append('mode', mode);

    const response = await fetch(`${API_BASE_URL}/api/restore`, {
        method: 'POST',
        body: formData,
    });

    if (!response.ok) throw new Error('Restoration processing failed');
    const resultBlob = await response.blob();
    return URL.createObjectURL(resultBlob);
}

export async function processBackgroundApi(
    imageUrl: string,
    action: 'remove' | 'replace',
    targetColor: string,
    newColor: string = '#000000',
    tolerance: number = 30
): Promise<string> {
    const blob = await fetchBlobFromDataUrl(imageUrl);
    const formData = new FormData();
    formData.append('file', blob, 'image.png');
    formData.append('action', action);
    formData.append('target_color', targetColor);
    formData.append('new_color', newColor);
    formData.append('tolerance', tolerance.toString());

    const response = await fetch(`${API_BASE_URL}/api/background`, {
        method: 'POST',
        body: formData,
    });

    if (!response.ok) throw new Error('Background operation failed');
    const resultBlob = await response.blob();
    return URL.createObjectURL(resultBlob);
}

export async function processWatermarkApi(
    imageUrl: string,
    text: string,
    fontSize: number,
    color: string,
    opacity: number,
    position: string
): Promise<string> {
    const blob = await fetchBlobFromDataUrl(imageUrl);
    const formData = new FormData();
    formData.append('file', blob, 'image.png');
    formData.append('text', text);
    formData.append('font_size', fontSize.toString());
    formData.append('color', color);
    formData.append('opacity', opacity.toString());
    formData.append('position', position);

    const response = await fetch(`${API_BASE_URL}/api/watermark`, {
        method: 'POST',
        body: formData,
    });

    if (!response.ok) throw new Error('Watermark processing failed');
    const resultBlob = await response.blob();
    return URL.createObjectURL(resultBlob);
}