export interface NavigationMenu {
    id: string;
    parentId?: string | null;
    label: string;
    labelKey?: string;
    to: string;
    order: number;
    icon?: string;
    newTab?: boolean;
    depth: number;
    children?: NavigationMenu[];
}

export type NavigationAction = {
    label: string;
    icon: string;
};
