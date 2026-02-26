/**
 * 유저 목록 API
 * data/users.json 기반 예제 데이터 반환
 */
import usersData from '../../data/users.json'

export default defineEventHandler(() => {
  return usersData
})
