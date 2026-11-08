'use client';

import { useState, useCallback } from 'react';
import { ImageMetadata } from '@/types/editor';
import { validateImageFile } from '@/lib/validators';

export function useImageUpload(onImageLoaded?: (meta: ImageMetadata) => void) {
    const [image, setImage] = useState<ImageMetadata | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const processFile = useCallback(
        (file: File) => {
            setError(null);
            const validation = validateImageFile(file);

            if (!validation.valid) {
                setError(validation.error || 'Invalid file');
                return;
            }

            setIsLoading(true);
            const objectUrl = URL.createObjectURL(file);
            const img = new Image();

            img.onload = () => {
                const metadata: ImageMetadata = {
                    name: file.name,
                    width: img.naturalWidth,
                    height: img.naturalHeight,
                    sizeBytes: file.size,
                    type: file.type,
                    url: objectUrl,
                };

                setImage(metadata);
                setIsLoading(false);
                if (onImageLoaded) onImageLoaded(metadata);
            };

            img.onerror = () => {
                setError('Failed to read pixel dimensions from selected file.');
                setIsLoading(false);
            };

            img.src = objectUrl;
        },
        [onImageLoaded]
    );

    const handleDrop = useCallback(
        (e: React.DragEvent<HTMLDivElement>) => {
            e.preventDefault();
            e.stopPropagation();

            if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                const droppedFile = e.dataTransfer.files[0];
                processFile(droppedFile);
            }
        },
        [processFile]
    );

    const clearImage = useCallback(() => {
        if (image?.url) {
            URL.revokeObjectURL(image.url);
        }
        setImage(null);
        setError(null);
    }, [image]);

    return {
        image,
        error,
        isLoading,
        processFile,
        handleDrop,
        clearImage,
        setError,
    };
}