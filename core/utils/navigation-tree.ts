import type { NavigationMenu } from '~/core/types/navigation';

type MutableNavigationMenu = Omit<NavigationMenu, 'children'> & {
    children?: MutableNavigationMenu[];
};

export function buildNavigationTree(items: readonly NavigationMenu[]): NavigationMenu[] {
    const nodeMap = new Map<string, MutableNavigationMenu>();
    const roots: MutableNavigationMenu[] = [];

    // 1) 노드 생성: API 원본 순서와 관계없이 먼저 전체 노드를 준비
    for (const item of items) {
        nodeMap.set(item.id, {
            ...item,
            children: undefined,
        });
    }

    // 2) parentId 기준으로 트리 연결
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
            // 부모 누락 데이터는 루트로 강등해 화면 유실을 방지
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
