/**
 * 유저 목록 API
 * data/users.json과 동일한 구조의 예제 데이터 반환
 */
export default defineEventHandler(() => {
    return {
        users: [
            { id: '1', name: '김철수', email: 'kim@example.com', role: '관리자', department: '개발팀', status: '활성', createdAt: '2024-01-15' },
            { id: '2', name: '이영희', email: 'lee@example.com', role: '개발자', department: '개발팀', status: '활성', createdAt: '2024-02-20' },
            { id: '3', name: '박민수', email: 'park@example.com', role: '디자이너', department: '디자인팀', status: '활성', createdAt: '2024-03-10' },
            { id: '4', name: '최지현', email: 'choi@example.com', role: '개발자', department: '개발팀', status: '비활성', createdAt: '2024-01-08' },
            { id: '5', name: '정수진', email: 'jung@example.com', role: 'PM', department: '기획팀', status: '활성', createdAt: '2024-04-01' },
        ],
    }
})
