// types/api/menu.ts
export interface Menu {
    id: string;
    parentId?: string | null;
    label: string;
    labelKey?: string;
    to: string;
    order: number;
    icon?: string;
    newTab?: boolean;
    depth: number;
    children?: Menu[];
}
