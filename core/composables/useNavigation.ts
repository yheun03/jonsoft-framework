import { storeToRefs } from 'pinia';
import { NAVIGATION_HEADER_ACTIONS } from '~/core/constants/navigation';
import { useNavigationStore } from '~/core/stores/navigation';

export function useNavigation() {
    const store = useNavigationStore();
    const { menuTree, isLoading } = storeToRefs(store);

    callOnce('navigation:menus', () => store.fetchMenus());

    function getIconSvg(_icon?: string) {
        return null;
    }

    return {
        headerActions: NAVIGATION_HEADER_ACTIONS,
        menuTree,
        isLoading,
        getIconSvg,
    };
}
