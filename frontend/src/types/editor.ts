import { ToolCategory } from './tools';

export interface ImageMetadata {
    name: string;
    width: number;
    height: number;
    sizeBytes: number;
    type: string;
    url: string;
}

export interface CanvasState {
    zoom: number;
    panX: number;
    panY: number;
    isProcessing: boolean;
    statusMessage?: string;
}

export interface EditorState {
    activeTool: ToolCategory | null;
    image: ImageMetadata | null;
    canUndo: boolean;
    canRedo: boolean;
}