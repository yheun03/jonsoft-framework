export type AppRoute = {
    path: string;
    name?: string | symbol | null;
    meta?: Record<string, unknown>;
};

export const ROUTE_HIDDEN_PATHS = ['/auth/sign-in', '/auth/sign-up', '/auth/find-pw', '/demos'] as const;

export function getRouteLabel(path: string, route?: AppRoute): string {
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
