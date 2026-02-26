# Jonsoft Framework - 프로젝트 노트

Vite, SCSS, Axios, Pinia, Nuxt 기반의 풀스택 프레임워크 개발 가이드입니다.

---

## 목차

1. [프로젝트 개요](#1-프로젝트-개요)
2. [Vite](#2-vite)
3. [SCSS](#3-scss)
4. [Axios](#4-axios)
5. [Pinia](#5-pinia)
6. [Nuxt](#6-nuxt)
7. [프로젝트 구조](#7-프로젝트-구조)
8. [개발 가이드](#8-개발-가이드)

---

## 1. 프로젝트 개요

이 프레임워크는 다음 기술 스택으로 구성됩니다:

| 기술 | 버전 | 역할 |
|------|------|------|
| **Nuxt** | 3.x | Vue 기반 풀스택 프레임워크, SSR/SSG 지원 |
| **Vite** | (Nuxt 내장) | 빠른 개발 서버 및 빌드 도구 |
| **SCSS** | - | CSS 전처리기, 변수/믹스인 지원 |
| **Axios** | 1.x | HTTP 클라이언트 |
| **Pinia** | 2.x | Vue 상태 관리 |

> **참고**: Nuxt 3는 기본적으로 Vite를 번들러로 사용합니다.

---

## 2. Vite

### 설명

**Vite**는 프론트엔드 빌드 도구로, ES 모듈 기반의 네이티브 ESM을 활용해 개발 서버를 매우 빠르게 실행합니다. Nuxt 3는 내부적으로 Vite를 사용합니다.

### 특징

- **HMR(Hot Module Replacement)**: 코드 변경 시 즉시 반영, 페이지 새로고침 없음
- **빠른 Cold Start**: 개발 서버 시작 시간 단축
- **최적화된 프로덕션 빌드**: Rollup 기반 번들링

### 사용법

Vite 설정은 `nuxt.config.ts`의 `vite` 옵션으로 커스터마이징합니다. SCSS는 각 파일에서 필요한 것만 `@use`로 임포트하는 방식을 권장합니다.

### 관련 명령어

```bash
npm run dev    # Vite 개발 서버 실행 (Nuxt dev)
npm run build  # 프로덕션 빌드
npm run preview # 빌드 결과 미리보기
```

---

## 3. SCSS

### 설명

**SCSS(Sassy CSS)**는 CSS의 확장으로, 변수, 중첩, 믹스인, 함수 등을 지원하는 전처리기입니다.

### 프로젝트 구조

```
assets/
└── scss/
    ├── abstract/
    │   └── _variables.scss   # 변수 (색상, 간격, 폰트 등)
    └── main.scss             # 메인 스타일 시트 (진입점)
```

### 변수 사용

각 파일에서 필요한 SCSS를 `@use`로 임포트합니다. `nuxt.config` 수정 없이 새 파일 추가가 가능합니다:

```scss
// 변수가 필요한 파일 상단에
@use "~/assets/scss/abstract/variables" as *;

.my-component {
  color: $color-primary;
  padding: $spacing-md;
  font-size: $font-size-base;
}
```

### 주요 변수 (assets/scss/abstract/_variables.scss)

| 변수 | 설명 |
|------|------|
| `$color-primary`, `$color-secondary` | 주요 색상 |
| `$spacing-xs` ~ `$spacing-xl` | 간격 단위 |
| `$breakpoint-sm` ~ `$breakpoint-xl` | 반응형 브레이크포인트 |
| `$font-family-base` | 기본 폰트 |

### 컴포넌트에서 SCSS 사용

```vue
<template>
  <div class="card">...</div>
</template>

<style scoped lang="scss">
@use "~/assets/scss/abstract/variables" as *;

.card {
  padding: $spacing-md;
  border-radius: 8px;
  background: $color-primary;

  &:hover {
    opacity: 0.9;
  }
}
</style>
```

---

## 4. Axios

### 설명

**Axios**는 Promise 기반의 HTTP 클라이언트로, 브라우저와 Node.js에서 동작합니다. 인터셉터, 요청/응답 변환, 자동 JSON 변환 등을 지원합니다.

### 설정

`plugins/axios.ts`에서 Nuxt 플러그인으로 등록되어 `$axios`로 전역 사용 가능합니다.

- **baseURL**: `runtimeConfig.public.apiBase` (환경변수 `NUXT_PUBLIC_API_BASE`)
- **타임아웃**: 10초
- **인터셉터**: 요청/응답 시 공통 로직 추가 가능 (인증 토큰, 에러 핸들링 등)

### 사용법

#### 1. 컴포넌트에서 직접 사용

```vue
<script setup lang="ts">
const { $axios } = useNuxtApp()

const fetchData = async () => {
  const { data } = await $axios.get('/users')
  return data
}
</script>
```

#### 2. useApi Composable 사용 (권장)

```ts
// composables/useApi.ts 활용
const { get, post } = useApi()

const users = await get<User[]>('/users')
await post('/users', { name: 'John' })
```

#### 3. API Base URL 설정

`.env` 파일:

```
# 상대경로(기본): IP/포트 변경에 영향 없음
NUXT_PUBLIC_API_BASE=/api
# 외부 API 사용 시에만 절대경로
# NUXT_PUBLIC_API_BASE=https://api.example.com
```

### 인터셉터 확장

`plugins/axios.ts`에서 인증 토큰 추가 예시:

```ts
axiosInstance.interceptors.request.use((config) => {
  const token = useCookie('auth-token')
  if (token.value) {
    config.headers.Authorization = `Bearer ${token.value}`
  }
  return config
})
```

---

## 5. Pinia

### 설명

**Pinia**는 Vue 공식 상태 관리 라이브러리로, Vuex의 후속입니다. 타입스크립트 지원, 모듈화, DevTools 연동이 뛰어납니다.

### 스토어 정의

`stores/` 폴더에 스토어를 정의합니다. Nuxt는 `@pinia/nuxt` 모듈로 자동 임포트합니다.

```ts
// stores/example.ts
import { defineStore } from 'pinia'

export const useExampleStore = defineStore('example', {
  state: () => ({
    count: 0,
    message: '',
  }),
  getters: {
    doubleCount: (state) => state.count * 2,
  },
  actions: {
    increment() {
      this.count++
    },
  },
})
```

### 사용법

#### Options API 스타일

```ts
export const useUserStore = defineStore('user', {
  state: () => ({ name: '' }),
  actions: {
    async fetchUser() {
      const { $axios } = useNuxtApp()
      const { data } = await $axios.get('/me')
      this.name = data.name
    },
  },
})
```

#### Composition API 스타일 (setup)

```ts
export const useUserStore = defineStore('user', () => {
  const name = ref('')
  const fetchUser = async () => {
    const { $axios } = useNuxtApp()
    const { data } = await $axios.get('/me')
    name.value = data.name
  }
  return { name, fetchUser }
})
```

#### 컴포넌트에서 사용

```vue
<script setup lang="ts">
const exampleStore = useExampleStore()

// state
console.log(exampleStore.count)

// getters
console.log(exampleStore.doubleCount)

// actions
exampleStore.increment()
</script>
```

---

## 6. Nuxt

### 설명

**Nuxt**는 Vue 기반의 풀스택 프레임워크로, SSR(서버 사이드 렌더링), 파일 기반 라우팅, 자동 임포트, 레이아웃 등을 제공합니다.

### 핵심 개념

| 개념 | 설명 |
|------|------|
| **pages/** | 파일 기반 라우팅. `pages/about.vue` → `/about` |
| **layouts/** | 공통 레이아웃. `default.vue`, `admin.vue` 등 |
| **components/** | 자동 임포트되는 Vue 컴포넌트 |
| **composables/** | 재사용 가능한 로직 (자동 임포트) |
| **plugins/** | Nuxt 앱 초기화 시 실행되는 플러그인 |
| **middleware/** | 라우트 전/후 실행되는 미들웨어 |

### 라우팅

```
pages/
├── index.vue      → /
├── about.vue      → /about
└── users/
    ├── index.vue  → /users
    └── [id].vue   → /users/:id
```

### 레이아웃 사용

```vue
<!-- pages/about.vue -->
<script setup lang="ts">
definePageMeta({
  layout: 'default', // layouts/default.vue
})
</script>
```

### Nuxt 내장 기능

- `useFetch` / `$fetch`: 데이터 페칭 (Nuxt 권장, Axios 대안)
- `useAsyncData`: 비동기 데이터 + 캐싱
- `useRuntimeConfig`: 환경 설정
- `useRoute`, `useRouter`: 라우팅

---

## 7. 프로젝트 구조

```
jonsoft-framework/
├── app.vue              # 루트 컴포넌트
├── nuxt.config.ts       # Nuxt 설정
├── package.json
├── tsconfig.json
├── app/
│   └── router.options.ts
├── assets/
│   └── scss/
│       ├── abstract/
│       │   └── _variables.scss
│       └── main.scss
├── components/          # Vue 컴포넌트 (자동 임포트)
│   ├── AppButton.vue
│   ├── AppButton.vue
│   ├── AppUserTable.vue
│   └── AppUserPurchasesTable.vue # 유저·구매이력 조인 테이블
├── composables/         # useApi 등
│   └── useApi.ts
├── layouts/
│   └── default.vue
├── data/
│   └── users.json       # 유저 예제 데이터 (참고용)
├── pages/
│   ├── index.vue
│   ├── button-demo.vue
│   ├── users.vue        # 유저 목록 (AG Grid)
│   └── purchases.vue    # 유저별 구매이력 (조인)
├── plugins/
│   └── axios.ts
├── stores/
│   └── example.ts
├── types/
│   └── axios.d.ts
├── .env.example
├── .gitignore
└── project_note.md      # 본 문서
```

---

## 8. 개발 가이드

### 설치 및 실행

```bash
# 의존성 설치
npm install

# 개발 서버 실행 (기본 http://localhost:3000, 포트 충돌 시 자동 변경)
npm run dev

# 프로덕션 빌드
npm run build

# 빌드 결과 미리보기
npm run preview

# 캐시 삭제 (오류 발생 시)
npm run clean
```

### 오류 해결 (Troubleshooting)

다음 오류가 발생하면 개발 서버를 **완전히 종료**한 뒤 캐시를 삭제하고 재시작하세요:

- `#internal/nuxt/paths` is not defined
- `ENOENT: no such file or directory, open './assets/scss/_variables.scss'`

> **참고**: `#app-manifest` 오류는 `nuxt.config`의 `experimental: { appManifest: false }`로 비활성화됨

```bash
# 1. 개발 서버 중지 (Ctrl+C)
# 2. 캐시 삭제 후 재시작
npm run clean && npm run dev
```

### 환경 변수

`.env` 파일을 생성하고 `.env.example`을 참고하여 설정합니다.

```
NUXT_PUBLIC_API_BASE=/api
```

### 새 페이지 추가

`pages/` 폴더에 `.vue` 파일을 추가하면 자동으로 라우트가 생성됩니다.

### 새 스토어 추가

`stores/` 폴더에 `defineStore`로 스토어를 정의합니다. `useXxxStore`로 사용합니다.

### API 호출

- **Axios**: `useApi()` 또는 `useNuxtApp().$axios`
- **Nuxt 내장**: `useFetch()`, `$fetch()` (SSR 친화적)

### API 엔드포인트

| 경로 | 설명 |
|------|------|
| `GET /api/links` | 링크 목록 |
| `GET /api/users` | 유저 목록 (예제) |
| `GET /api/users/:id/purchases` | 유저별 구매이력 |
| `GET /api/users-with-purchases` | 유저·구매이력 조인 (전체) |

---

## 참고 링크

- [Nuxt 3 문서](https://nuxt.com/docs)
- [Vite 문서](https://vitejs.dev/)
- [Pinia 문서](https://pinia.vuejs.org/)
- [Axios 문서](https://axios-http.com/)
- [Sass 문서](https://sass-lang.com/)
- [AG Grid 문서](https://www.ag-grid.com/vue-data-grid/)
