# Jonsoft Framework 프로젝트 노트

Nuxt 3 + Pinia + Axios 기반의 워크스페이스/컴포넌트 데모 프로젝트입니다.  
이 문서는 유지보수에 필요한 핵심만 짧게 정리합니다.

---

## 1) 기술 스택

- 프레임워크: `Nuxt 3` (Vite/Nitro 포함)
- 상태관리: `Pinia`
- HTTP: `Axios` (`$api` 주입 + `useApi()` 사용)
- UI/기능: AG Grid, Chart.js, Toast UI Editor, SCSS

---

## 2) 실행 명령어

- 개발: `npm run dev`
- 빌드: `npm run build`
- 미리보기: `npm run preview`
- 정적 생성: `npm run generate`

---

## 3) 핵심 디렉터리

```text
core/
├─ app/
│  ├─ plugins/          # Nuxt 직접 연결 플러그인
│  └─ router/           # 라우트 메타/정책
├─ infrastructure/      # 외부 연동(HTTP 등)
├─ domain/              # 도메인 타입/순수 로직
├─ stores/              # Pinia store
├─ composables/         # 화면/컴포넌트 조합 로직
├─ server/              # Nitro API
├─ constants/           # 상수
├─ plugins/             # 앱 보조 플러그인
└─ types/               # 전역 타입 보완
```

기타 주요 루트:

- `components/`: 공통 UI 컴포넌트
- `pages/`: 화면
- `layouts/`: 앱 레이아웃
- `assets/`: SCSS, 아이콘, 폰트

---

## 4) API 호출 규칙

- 공통 규칙: **직접 Axios 인스턴스 사용 금지**, `useApi()` 사용
- 엔드포인트 표기: `/api/*`
- 서버/클라이언트 환경 차이는 `core/infrastructure/http/useApiClient.ts`에서 처리

예시:

```ts
const api = useApi();
const data = await api.get<MyType>('/api/menus');
```

---

## 5) 상태관리 규칙(Pinia)

- Store는 상태/로딩/캐시/액션 중심으로 유지
- 도메인 가공 로직(트리 변환, 번역 적용 등)은 `domain`으로 분리
- 컴포넌트는 가능하면 store/composable만 사용

---

## 6) Navigation/Route 규칙

- 메뉴 타입 단일 소스: `core/domain/navigation/types.ts`
- 메뉴 트리/번역 처리: `core/domain/navigation/services.ts`
- 라우트 제목/가시성 규칙: `core/app/router/route-meta.ts`
- 탭 동기화: `core/app/plugins/route-tabs.client.ts`

---

## 7) 서버 API

- `GET /api/menus`: 메뉴 목록 반환
- `POST /api/export/excel`: 그리드 데이터 엑셀 변환/다운로드

---

## 8) 개발 원칙(요약)

- 중복 타입/로직 생성 금지(단일 소스 유지)
- 임시 호환 레이어(re-export) 남기지 않기
- 새 기능 추가 위치
    - 라우트/플러그인 연동: `core/app`
    - 외부 연동: `core/infrastructure`
    - 도메인 규칙: `core/domain`
    - 상태 관리: `core/stores`

---

필요 시 이 문서에 “어디에 무엇을 추가했고 왜 그렇게 했는지”만 1~2줄로 누적 기록합니다.

- 2026-04-28: `core/types/modal.ts`에 모달 공통 props/event reason 타입을 모아 모달 컴포넌트들의 중복 선언을 줄였습니다.
- 2026-04-28: `core/stores/modal.ts`와 `components/modals/AppModalHost.vue`를 공통 경로로 정리해 분기 수를 줄이면서 기존 Alert/Confirm/Custom 동작은 유지했습니다.
- 2026-04-28: `useModalViewer()`와 PDF/이미지 뷰어 콘텐츠를 추가해 `AppUploadFile`의 PDF 미리보기와 `AppUploadImage`의 이미지 미리보기 모달을 연결했습니다.
- 2026-04-28: `pages/demos/demo-modal.vue`에 이미지/PDF 뷰어 예제를 추가해 업로드 컴포넌트 밖에서도 뷰어 모달 사용 방식을 바로 확인할 수 있게 했습니다.
- 2026-04-28: `AppTable` 기본 stacked 컬럼 폭과 `AppTableField`의 select/email 처리 로직을 보정해 빈 값 placeholder와 이메일 입력 레이아웃이 의도대로 동작하게 했습니다.
- 2026-04-28: 메뉴 seed를 `core/domain/navigation/menu-source.ts`로 분리하고 SSR/prerender에서는 `navigation` 스토어가 이를 직접 사용하게 바꿔 static 빌드 중 `/api/menus` 404 경고를 줄였습니다.
