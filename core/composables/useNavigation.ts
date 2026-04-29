import { storeToRefs } from 'pinia';
import { NAVIGATION_HEADER_ACTIONS } from '~/core/type/navigation';
import { useNavigationStore } from '~/core/store/navigation';

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
