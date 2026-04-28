import type { NavigationMenu } from '~/core/domain/navigation/types';

type MutableNavigationMenu = Omit<NavigationMenu, 'children'> & {
    children?: MutableNavigationMenu[];
};

export function translateNavigationMenus(items: readonly NavigationMenu[], t?: (key: string, fallback?: string) => string): NavigationMenu[] {
    if (!t) return [...items];
    return items.map((item) => ({
        ...item,
        label: item.labelKey ? t(item.labelKey, item.label) : item.label,
        children: item.children ? translateNavigationMenus(item.children, t) : undefined,
    }));
}

export function buildNavigationTree(items: readonly NavigationMenu[]): NavigationMenu[] {
    const nodeMap = new Map<string, MutableNavigationMenu>();
    const roots: MutableNavigationMenu[] = [];

    for (const item of items) {
        nodeMap.set(item.id, {
            ...item,
            children: undefined,
        });
    }

    for (const item of items) {
        const node = nodeMap.get(item.id);
        if (!node) continue;

        const parentId = item.parentId ?? null;
        if (!parentId) {
            roots.push(node);
            continue;
        }

        const parent = nodeMap.get(parentId);
        if (!parent) {
            roots.push(node);
            continue;
        }

        (parent.children ||= []).push(node);
    }

    return sortNavigationTree(roots);
}

function sortNavigationTree(nodes: MutableNavigationMenu[]): NavigationMenu[] {
    return [...nodes]
        .sort((a, b) => a.order - b.order)
        .map((node) => ({
            ...node,
            children: node.children ? sortNavigationTree(node.children) : undefined,
        }));
}
