/**
 * 유저·구매이력 조인 API
 * GET /api/users-with-purchases
 * 각 유저가 구매한 상품 목록을 함께 반환
 */
import { USERS, PURCHASES } from '../utils/purchase-data'

export default defineEventHandler(() => {
  const data = USERS.map((user) => ({
    ...user,
    purchases: PURCHASES[user.id] ?? [],
  }))
  return { data }
})
