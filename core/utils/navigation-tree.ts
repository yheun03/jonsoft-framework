import type { NavigationMenu } from '~/core/types/navigation';

type MutableNavigationMenu = Omit<NavigationMenu, 'children'> & {
    children?: MutableNavigationMenu[];
};

export function buildNavigationTree(items: readonly NavigationMenu[]): NavigationMenu[] {
    const root: MutableNavigationMenu[] = [];
    const stack: MutableNavigationMenu[] = [];

    for (const item of items) {
        const node: MutableNavigationMenu = {
            ...item,
            children: item.children ? buildNavigationTree(item.children) : undefined,
        };

        while (stack.length && stack[stack.length - 1].depth >= node.depth) {
            stack.pop();
        }

        const parent = stack[stack.length - 1];
        if (parent) {
            (parent.children ||= []).push(node);
        } else {
            root.push(node);
        }

        stack.push(node);
    }

    return sortNavigationTree(root);
}

function sortNavigationTree(nodes: MutableNavigationMenu[]): NavigationMenu[] {
    return [...nodes]
        .sort((a, b) => a.order - b.order)
        .map((node) => ({
            ...node,
            children: node.children ? sortNavigationTree(node.children) : undefined,
        }));
}
