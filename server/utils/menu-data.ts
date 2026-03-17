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
    { id: 'MENU_020300', depth: 2, order: 3, label: 'AG Grid 데모', to: '/demos/ag-grid-demo', newTab: false },
    { id: 'MENU_020400', depth: 2, order: 4, label: '차트 데모', to: '/demos/chart-demo', newTab: false },
    { id: 'MENU_020500', depth: 2, order: 5, label: '프로그레스 데모', to: '/demos/progress-demo', newTab: false },
    { id: 'MENU_020600', depth: 2, order: 6, label: '데이트피커 데모', to: '/demos/datepicker-demo', newTab: false },
    { id: 'MENU_020700', depth: 2, order: 7, label: '셀렉트 데모', to: '/demos/select-demo', newTab: false },
    { id: 'MENU_020800', depth: 2, order: 8, label: '선택 컴포넌트 데모', to: '/demos/choice-demo', newTab: false },
    { id: 'MENU_020900', depth: 2, order: 9, label: '이미지 필드 데모', to: '/demos/image-field-demo', newTab: false },
] as const