import { createNavigationMenus } from '~/core/domain/navigation/menu-source';

export default defineEventHandler(() => {
    return { menus: createNavigationMenus() };
});
