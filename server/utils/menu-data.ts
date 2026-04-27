/**
 * 메뉴 공통 데이터 (네비게이션 등)
 * - Nuxt pages 기준으로 실제 존재하는 페이지만 등록
 * - depth는 "부모 다음에 자식" 순서를 전제로 트리로 변환됨
 */

export const MENUS = [
    // 메인
    { id: 'MENU_010000', depth: 1, order: 1, label: '메인', to: '/', newTab: false },
    { id: 'MENU_010100', depth: 1, order: 2, label: '워크스페이스', to: '/workspace', newTab: false },

    // 데모
    { id: 'MENU_020000', depth: 1, order: 3, label: '데모', to: '', newTab: false },
    { id: 'MENU_020100', depth: 2, order: 1, label: '버튼 데모', to: '/demos/demo-button', newTab: false },
    { id: 'MENU_020200', depth: 2, order: 2, label: '인풋 데모', to: '/demos/demo-input', newTab: false },
    { id: 'MENU_020300', depth: 2, order: 3, label: 'AG Grid 데모', to: '/demos/demo-grid', newTab: false },
    { id: 'MENU_020400', depth: 2, order: 4, label: '차트 데모', to: '/demos/demo-chart', newTab: false },
    { id: 'MENU_020500', depth: 2, order: 5, label: '프로그레스 데모', to: '/demos/demo-progress', newTab: false },
    { id: 'MENU_020600', depth: 2, order: 6, label: '데이트피커 데모', to: '/demos/demo-datepicker', newTab: false },
    { id: 'MENU_020700', depth: 2, order: 7, label: '셀렉트 데모', to: '/demos/demo-select', newTab: false },
    { id: 'MENU_020800', depth: 2, order: 8, label: '선택 컴포넌트 데모', to: '/demos/demo-choice', newTab: false },
    { id: 'MENU_020900', depth: 2, order: 9, label: '이미지 업로드 데모', to: '/demos/demo-upload-image', newTab: false },
    { id: 'MENU_021000', depth: 2, order: 10, label: '모달 데모', to: '/demos/demo-modal', newTab: false },
] as const;
