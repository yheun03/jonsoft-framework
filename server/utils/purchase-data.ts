/**
 * 유저·구매 공통 데이터 (API 간 일관성 유지)
 */
export const USERS = [
  { id: 'user1', name: '김철수', email: 'kim@example.com', role: '관리자', department: '개발팀', status: '활성', createdAt: '2024-01-15' },
  { id: 'user2', name: '이영희', email: 'lee@example.com', role: '개발자', department: '개발팀', status: '활성', createdAt: '2024-02-20' },
  { id: 'user3', name: '박민수', email: 'park@example.com', role: '디자이너', department: '디자인팀', status: '활성', createdAt: '2024-03-10' },
  { id: 'user4', name: '최지현', email: 'choi@example.com', role: '개발자', department: '개발팀', status: '비활성', createdAt: '2024-01-08' },
  { id: 'user5', name: '정수진', email: 'jung@example.com', role: 'PM', department: '기획팀', status: '활성', createdAt: '2024-04-01' },
] as const

export const PURCHASES: Record<string, Array<{
  id: string
  productName: string
  quantity: number
  amount: number
  status: string
  purchasedAt: string
}>> = {
  'user1': [
    { id: 'p1', productName: '노트북', quantity: 1, amount: 1500000, status: '완료', purchasedAt: '2024-01-20' },
    { id: 'p2', productName: '마우스', quantity: 2, amount: 120000, status: '완료', purchasedAt: '2024-02-10' },
    { id: 'p3', productName: '키보드', quantity: 1, amount: 180000, status: '배송중', purchasedAt: '2024-04-15' },
  ],
  'user2': [
    { id: 'p4', productName: '모니터', quantity: 1, amount: 450000, status: '완료', purchasedAt: '2024-02-25' },
    { id: 'p5', productName: 'USB 허브', quantity: 1, amount: 35000, status: '완료', purchasedAt: '2024-03-05' },
  ],
  'user3': [
    { id: 'p6', productName: '태블릿', quantity: 1, amount: 890000, status: '완료', purchasedAt: '2024-03-15' },
    { id: 'p7', productName: '스타일러스', quantity: 1, amount: 150000, status: '취소', purchasedAt: '2024-04-01' },
  ],
  'user4': [
    { id: 'p8', productName: '헤드폰', quantity: 1, amount: 280000, status: '완료', purchasedAt: '2024-01-12' },
  ],
  'user5': [
    { id: 'p9', productName: '웹캠', quantity: 1, amount: 95000, status: '완료', purchasedAt: '2024-04-05' },
    { id: 'p10', productName: '마이크', quantity: 1, amount: 120000, status: '배송중', purchasedAt: '2024-04-18' },
  ],
}
