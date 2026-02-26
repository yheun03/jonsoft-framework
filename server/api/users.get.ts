/**
 * 유저 목록 API
 */
import { USERS } from '../utils/purchase-data'

export default defineEventHandler(() => {
    return { users: [...USERS] }
})
