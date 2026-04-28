export type AppRoute = {
    path: string;
    name?: string | symbol | null;
    meta?: Record<string, unknown>;
};

export const ROUTE_LABEL_MAP: Record<string, string> = {
    '/': '메인',
    '/workspace': '워크스페이스',
    '/settings': '설정',
    '/demos/demo-button': '버튼 데모',
    '/demos/demo-input': '인풋 데모',
    '/demos/demo-grid': 'AG Grid 데모',
    '/demos/demo-chart': '차트 데모',
    '/demos/demo-progress': '프로그레스 데모',
    '/demos/demo-datepicker': '데이트피커 데모',
    '/demos/demo-select': '셀렉트 데모',
    '/demos/demo-choice': '선택 컴포넌트 데모',
    '/demos/demo-upload-image': '이미지 업로드 데모',
    '/demos/demo-modal': '모달 데모',
};

export const ROUTE_HIDDEN_PATHS = ['/auth/sign-in', '/auth/sign-up', '/auth/find-pw', '/demos'] as const;

export function getRouteLabel(path: string, route?: AppRoute): string {
    if (ROUTE_LABEL_MAP[path]) return ROUTE_LABEL_MAP[path];

    const metaTitle = route?.meta?.title;
    if (typeof metaTitle === 'string' && metaTitle.trim()) return metaTitle;

    const segment = path.split('/').filter(Boolean).at(-1) ?? 'page';
    return segment
        .replace(/^demo-/, '')
        .replace(/-/g, ' ')
        .replace(/\b\w/g, (char) => char.toUpperCase());
}

export function isVisibleRoute(path: string): boolean {
    if (!path) return false;
    if (path.includes(':')) return false;
    if (ROUTE_HIDDEN_PATHS.includes(path as (typeof ROUTE_HIDDEN_PATHS)[number])) return false;

    return path === '/' || path === '/workspace' || path === '/settings' || path.startsWith('/demos/');
}
