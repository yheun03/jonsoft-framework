/**
 * 유저별 구매이력 API
 * GET /api/users/:id/purchases
 */
import { PURCHASES } from '../../../utils/purchase-data'

export default defineEventHandler((event) => {
    const id = getRouterParam(event, 'id')
    if (!id) {
        throw createError({ statusCode: 400, message: '유저 ID가 필요합니다.' })
    }

    const purchases = PURCHASES[id] ?? []
    return { purchases }
})
