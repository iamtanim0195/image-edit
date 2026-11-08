import { MAX_FILE_SIZE_BYTES, SUPPORTED_MIME_TYPES } from './constants';

export interface ValidationResult {
    valid: boolean;
    error?: string;
}

export function validateImageFile(file: File): ValidationResult {
    if (!SUPPORTED_MIME_TYPES.includes(file.type)) {
        return {
            valid: false,
            error: `Unsupported file format (${file.type || 'unknown'}). Please upload a JPG, PNG, or WebP image.`,
        };
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
        const sizeMB = (file.size / (1024 * 1024)).toFixed(1);
        return {
            valid: false,
            error: `File size (${sizeMB} MB) exceeds the maximum allowed limit of 25 MB.`,
        };
    }

    return { valid: true };
}