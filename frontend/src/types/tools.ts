export type ToolCategory =
    | 'upload'
    | 'crop'
    | 'adjustments'
    | 'filters'
    | 'enhancement'
    | 'restoration'
    | 'background'
    | 'text'
    | 'export';

export interface ToolConfig {
    id: ToolCategory;
    label: string;
    iconName: string;
    description: string;
    badge?: string;
}