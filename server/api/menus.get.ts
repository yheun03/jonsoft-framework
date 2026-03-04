import { MENUS } from '../utils/menu-data'

export default defineEventHandler(() => {
    return { menus: MENUS }
})
