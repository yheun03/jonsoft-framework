/**
 * 메뉴 공통 데이터 (네비게이션 등)
 * - Nuxt pages 기준으로 실제 존재하는 페이지만 등록
 * - depth는 "부모 다음에 자식" 순서를 전제로 트리로 변환됨
 */

export const MENUS = [
    // 워크스페이스(에디터)
    { id: 'MENU_010000', depth: 1, order: 1, label: '워크스페이스', to: '/', newTab: false },

    // 데모
    { id: 'MENU_020000', depth: 1, order: 2, label: '데모', to: '', newTab: false },
    { id: 'MENU_020100', depth: 2, order: 1, label: '버튼 데모', to: '/demos/button-demo', newTab: false },
    { id: 'MENU_020200', depth: 2, order: 2, label: '인풋 데모', to: '/demos/input-demo', newTab: false },
] as const

/**
 * 기존 임시 메뉴 데이터(예제/외부 링크)는 아래에 주석으로 보관
 */
// export const MENUS = [
//     { id: 'MENU_010000', depth: 1, order: 1, label: 'Home', to: '/', newTab: false },
//     { id: 'MENU_010100', depth: 2, order: 1, label: 'Dashboard', to: '/', icon: 'temp', newTab: false },
//     { id: 'MENU_010200', depth: 2, order: 2, label: 'Google', to: 'https://www.google.com', icon: 'temp', newTab: true },
//     { id: 'MENU_010201', depth: 3, order: 1, label: 'Gmail', to: 'https://mail.google.com', icon: 'temp', newTab: true },
//     { id: 'MENU_010202', depth: 3, order: 2, label: 'Google Maps', to: 'https://maps.google.com', icon: 'temp', newTab: true },
//     { id: 'MENU_020000', depth: 1, order: 2, label: 'About', to: '/about', icon: 'temp', newTab: false },
//     { id: 'MENU_020100', depth: 2, order: 1, label: 'Company', to: '/about/company', icon: 'temp', newTab: false },
//     { id: 'MENU_020200', depth: 2, order: 2, label: 'Team', to: '/about/team', icon: 'temp', newTab: false },
//     { id: 'MENU_020300', depth: 2, order: 3, label: 'GitHub', to: 'https://github.com', icon: 'temp', newTab: true },
//     { id: 'MENU_020101', depth: 3, order: 1, label: 'History', to: '/about/history', icon: 'temp', newTab: false },
//     { id: 'MENU_020102', depth: 3, order: 2, label: 'Vision', to: '/about/vision', icon: 'temp', newTab: false },
//     { id: 'MENU_020201', depth: 3, order: 1, label: 'Developers', to: '/about/team/dev', icon: 'temp', newTab: false },
//     { id: 'MENU_020202', depth: 3, order: 2, label: 'Designers', to: '/about/team/design', icon: 'temp', newTab: false },
//     { id: 'MENU_030000', depth: 1, order: 3, label: 'Services', to: '/services', icon: 'temp', newTab: false },
//     { id: 'MENU_030100', depth: 2, order: 1, label: 'Web Development', to: '/services/web', icon: 'temp', newTab: false },
//     { id: 'MENU_030200', depth: 2, order: 2, label: 'Framework Docs', to: 'https://nuxt.com/docs', icon: 'temp', newTab: true },
//     { id: 'MENU_030101', depth: 3, order: 1, label: 'Frontend', to: '/services/web/frontend', icon: 'temp', newTab: false },
//     { id: 'MENU_030102', depth: 3, order: 2, label: 'Backend', to: '/services/web/backend', icon: 'temp', newTab: false },
//     { id: 'MENU_030201', depth: 3, order: 1, label: 'Vue Docs', to: 'https://vuejs.org', icon: 'temp', newTab: true },
//     { id: 'MENU_030202', depth: 3, order: 2, label: 'Vite', to: 'https://vitejs.dev', icon: 'temp', newTab: true },
//     { id: 'MENU_040000', depth: 1, order: 4, label: 'Contact', to: '/contact', icon: 'temp', newTab: false },
//     { id: 'MENU_040100', depth: 2, order: 1, label: 'Support', to: '/contact/support', icon: 'temp', newTab: false },
//     { id: 'MENU_040200', depth: 2, order: 2, label: 'Naver', to: 'https://www.naver.com', icon: 'temp', newTab: true },
//     { id: 'MENU_040201', depth: 3, order: 1, label: 'Naver News', to: 'https://news.naver.com', icon: 'temp', newTab: true },
//     { id: 'MENU_040202', depth: 3, order: 2, label: 'Naver Mail', to: 'https://mail.naver.com', icon: 'temp', newTab: true },
// ] as const