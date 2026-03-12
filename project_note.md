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
9. [UI 컴포넌트 & 사용 라이브러리](#9-ui-컴포넌트--사용-라이브러리)

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
assets/scss/
├── abstract/           # 디자인 토큰/함수/믹스인
│   ├── _variables.scss
│   ├── _mixins.scss
│   ├── _functions.scss
│   ├── _typography.scss
│   └── _index.scss
├── base/               # reset, fonts, 유틸 클래스
│   ├── _reset.scss
│   ├── _fonts.scss
│   ├── _utilities.scss
│   ├── _scrollbar.scss
│   └── _index.scss
├── layout/             # 레이아웃(그리드, 헤더, 푸터, 네비)
│   ├── _grid.scss
│   ├── _header.scss
│   ├── _footer.scss
│   ├── _nav.scss
│   └── _index.scss
├── components/         # 전역 컴포넌트 스타일(필요 시)
│   ├── base/
│   │   ├── _button.scss
│   │   ├── _icon.scss
│   │   └── _index.scss
│   └── _index.scss
└── main.scss           # 진입점 (base, layout, components 순)
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

> 아래는 **현재 코드베이스 기준** 디렉터리/파일 구성입니다. `nuxt.config`의 `components`는 `base`, `data`, `modules`를 자동 등록합니다.

```
jonsoft-framework/
├─ app/
│  └─ router.options.ts

├─ assets/
│  └─ scss/
│     ├─ abstract/               # 디자인 토큰/함수/믹스인
│     │  ├─ _variables.scss      # color, spacing, typography, z-index...
│     │  ├─ _mixins.scss         # media, ellipsis, safe-area...
│     │  ├─ _functions.scss      # rem(), color-get()...
│     │  └─ _index.scss          # abstract 진입점(모아서 forward)
│     ├─ base/                   # reset, fonts, 유틸 클래스
│     │  ├─ _reset.scss
│     │  ├─ _fonts.scss
│     │  ├─ _utilities.scss
│     │  ├─ _scrollbar.scss
│     │  └─ _index.scss
│     ├─ layout/
│     │  ├─ _grid.scss
│     │  ├─ _header.scss
│     │  ├─ _footer.scss
│     │  ├─ _nav.scss
│     │  └─ _index.scss
│     ├─ components/             # “전역 공통 UI” 스타일(필요시)
│     │  ├─ _button.scss
│     │  ├─ _icon.scss
│     │  └─ _index.scss
│     ├─ components/_index.scss
│     └─ main.scss

├─ components/
│  ├─ base/                      # 디자인 시스템 기본 (자동 임포트)
│  │  ├─ AppButton.vue
│  │  ├─ AppInput.vue
│  │  ├─ AppSelect.vue
│  │  ├─ AppDatePicker.vue
│  │  ├─ AppProgress.vue
│  │  ├─ AppCheckbox.vue
│  │  ├─ AppRadio.vue
│  │  └─ AppChoice.vue
│  ├─ data/
│  │  ├─ AppAgGrid.vue
│  │  └─ AppChart.vue
│  ├─ patterns/
│  │  └─ PatternNavItem.vue
│  └─ modules/
│     ├─ route-tabs/RouteTabsBar.vue
│     ├─ user/UserTable.vue, UserPurchasesTable.vue
│     └─ workspace/WorkspacePane.vue, WorkspaceToastEditor.vue

├─ composables/                  # UI/상태/유틸성 훅
│  ├─ useApi.ts                  # 공통 fetch wrapper(또는 axios wrapper)
│  ├─ useToast.ts
│  └─ useModal.ts

├─ plugins/
│  ├─ axios.ts
│  ├─ ag-grid.client.ts
│  ├─ global-css-no-inline.client.ts
│  └─ route-tabs.client.ts

├─ services/                     # API “도메인 레이어”
│  ├─ user.service.ts
│  ├─ purchase.service.ts
│  └─ link.service.ts

├─ repositories/                 # (선택) data access 계층(서비스보다 더 하위)
│  └─ user.repository.ts

├─ stores/
│  ├─ auth.ts
│  └─ user.ts                    # (선택) Pinia store

├─ utils/
│  ├─ format.ts                  # number/date/string format
│  ├─ guard.ts                   # type guard, assert
│  └─ dom.ts                     # scroll lock 등

├─ constants/
│  ├─ api.ts                     # endpoint 상수
│  ├─ routes.ts
│  └─ ui.ts

├─ types/
│  ├─ api/                       # API DTO/Response 타입
│  │  ├─ user.ts
│  │  └─ purchase.ts
│  ├─ ui/                        # 컴포넌트/토큰 타입
│  │  └─ theme.ts
│  └─ global/                    # global .d.ts
│     ├─ axios.d.ts
│     └─ ag-grid.d.ts

├─ pages/
│  ├─ index.vue
│  └─ demos/
│     ├─ button-demo.vue
│     ├─ input-demo.vue
│     ├─ ag-grid-demo.vue
│     ├─ chart-demo.vue
│     ├─ progress-demo.vue
│     ├─ datepicker-demo.vue
│     ├─ select-demo.vue
│     └─ choice-demo.vue

├─ layouts/
│  ├─ default.vue
│  └─ nav.vue

├─ server/
│  ├─ api/                       # mock/bff
│  │  ├─ menus.get.ts
│  │  └─ users.get.ts
│  └─ utils/
│     └─ menu-data.ts

├─ app.vue
├─ nuxt.config.ts
├─ package.json
└─ project_note.md
```

> **참고**: 실제 프로젝트에 없는 디렉터리(services, repositories, stores, utils, constants, types 등)는 확장 시 추가하는 구조로, 위 트리에는 현재 사용 중인 핵심 경로만 표기했습니다.

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
| `GET /api/menus` | 사이드바 메뉴 목록 (`server/utils/menu-data.ts` 기반) |
| `GET /api/users` | 유저 목록 (예제) |

### 사이드바 메뉴 + SVG 아이콘 렌더링

- **메뉴 데이터(Flat + depth)**: `server/utils/menu-data.ts`에서 `depth` 기반 Flat 목록을 관리하고, `layouts/nav.vue`에서 트리로 변환하여 렌더링합니다.
  - 렌더링 컴포넌트: `components/patterns/PatternNavItem.vue` (재귀)
- **API**: `server/api/menus.get.ts`에서 `GET /api/menus`로 반환합니다.

#### 그룹(폴더) 메뉴 규칙 (`to` 유무)

- `MENUS`의 아이템에서 `to` 값이 **없거나**, **빈 문자열이거나**, **공백만 있는 값**이면 해당 아이템은 “이동 링크”가 아니라 **그룹(폴더) 항목**으로 처리합니다.
- 그룹 항목은 `components/patterns/PatternNavItem.vue`에서 링크 대신 버튼으로 렌더링되며, **행 클릭 시 서브메뉴가 펼침/접힘 토글**됩니다.

#### SVG 아이콘 렌더링 방식 (`?raw` + `v-html`)

- **아이콘 자산 위치**:
  - 로고: `assets/icons/logo.svg`
  - 메뉴 아이콘 예시: `assets/icons/temp.svg`

- **SVG 문자열로 import**:

```ts
import TempIconSvg from '~/assets/icons/temp.svg?raw'
import LogoIconSvg from '~/assets/icons/logo.svg?raw'

const ICON_SVGS = {
  temp: TempIconSvg,
  logo: LogoIconSvg,
}
```

- **레이아웃에서 로고 렌더링 (`layouts/nav.vue`)**:

```vue
<div class="layout-nav-header">
  <div class="nav-logo" aria-hidden="true" v-html="logoSvg" />
</div>
```

- **메뉴 아이콘 렌더링 (`PatternNavItem.vue`)**:

```vue
<span
  v-if="getIconSvg(item.icon)"
  class="nav-icon"
  aria-hidden="true"
  v-html="getIconSvg(item.icon)"
/>
```

> **매핑 규칙**: 메뉴 데이터의 `icon` 값(예: `"temp"`, `"logo"`)을 키로 사용해, 코드에서 `ICON_SVGS[icon]`으로 SVG 문자열을 찾아 `v-html`로 인라인 렌더링합니다.

UI 컴포넌트(버튼, 인풋, 차트 등) 상세는 **[§9. UI 컴포넌트 & 사용 라이브러리](#9-ui-컴포넌트--사용-라이브러리)**를 참고하세요.

---

## 9. UI 컴포넌트 & 사용 라이브러리

### 데모 페이지 ↔ 컴포넌트

| 데모 경로 | 주요 컴포넌트 |
|-----------|----------------|
| `/demos/button-demo` | AppButton |
| `/demos/input-demo` | AppInput |
| `/demos/ag-grid-demo` | AppAgGrid |
| `/demos/chart-demo` | AppChart |
| `/demos/progress-demo` | AppProgress |
| `/demos/datepicker-demo` | AppDatePicker |
| `/demos/select-demo` | AppSelect |
| `/demos/choice-demo` | AppCheckbox, AppRadio, AppChoice |

메뉴 데이터: `server/utils/menu-data.ts` → `GET /api/menus`로 제공.

---

### 9.1 Base 컴포넌트

- **AppButton**
  - **파일**: `components/base/AppButton.vue`
  - **역할**: 버튼/링크 통합. variant `fill`(면), `text`(글자), `underline`(밑줄). 슬롯 `#iconLeft`, `#iconRight`. 아이콘만 사용 시 `ariaLabel` 권장. `to`(Nuxt 링크), `href`(외부 링크), `newTab`, `disabled`, `loading`, `block` 지원.
  - **SCSS**: `assets/scss/components/base/_button.scss` (전역 번들 포함)
  - **라이브러리 의존성**: 없음.

- **AppInput**
  - **파일**: `components/base/AppInput.vue`
  - **역할**: 레이블/헬퍼/에러/플레이스홀더/사이즈/clear 버튼 등을 포함한 공통 인풋 컴포넌트.
  - **라이브러리 의존성**: 없음 (순수 Vue + SCSS).

- **AppSelect**
  - **파일**: `components/base/AppSelect.vue`
  - **역할**: 기본 `<select>`를 감싼 공통 셀렉트. 라벨/헬퍼/에러/필수, 옵션 비활성화, 간단 검색(옵션 label 기준 substring 검색) 지원.
  - **라이브러리 의존성**: 없음 (순수 Vue + SCSS).

- **AppDatePicker**
  - **파일**: `components/base/AppDatePicker.vue`
  - **역할**: 단일 / 범위 / 다중 날짜 선택을 지원하는 공통 데이트 피커.
    - `mode="single"`: 단일 날짜 (`string \| null`, `YYYY-MM-DD`).
    - `mode="range"`: `{ start: string \| null; end: string \| null } \| null`.
    - `mode="multiple"`: `string[]`.
  - **사용 라이브러리**: `flatpickr`
    - **경로**: `node_modules/flatpickr`
    - **목적**: 가벼운 범용 날짜/시간 선택 위젯. 이 프로젝트에서는 **입력 필드를 유지한 채 팝업 캘린더와 포맷/범위/다중 선택**을 처리하는 용도로 사용.

- **AppProgress**
  - **파일**: `components/base/AppProgress.vue`
  - **역할**:
    - `variant="linear"`: 선형 프로그래스바, 단일 값 또는 `rangeSelectable` 사용 시 범위 선택(두 개의 핸들).
    - `variant="circular"`: SVG 기반 원형 프로그래스 + 퍼센트 라벨.
  - **사용 라이브러리**: `nouislider`
    - **경로**: `node_modules/nouislider`
    - **목적**: 터치/마우스를 모두 지원하는 2핸들 슬라이더. 이 프로젝트에서는 **하나의 프로그래스 트랙 안에서 시작/종료 퍼센트 범위를 드래그로 선택**하는 용도로 사용.

- **AppCheckbox**
  - **파일**: `components/base/AppCheckbox.vue`
  - **역할**: 레이블/헬퍼/에러를 포함한 체크박스. `v-model`로 boolean 값을 토글.
  - **라이브러리 의존성**: 없음.

- **AppRadio**
  - **파일**: `components/base/AppRadio.vue`
  - **역할**: 공통 라디오 버튼. 동일한 `name`을 공유하는 여러 인스턴스와 `v-model`(string/number)을 함께 사용해 단일 선택 그룹 구현.
  - **라이브러리 의존성**: 없음.

- **AppChoice** (칩/면/아이콘 선택 컴포넌트)
  - **파일**: `components/base/AppChoice.vue`
  - **역할**: 칩/면 기반 선택 UI. `v-model` boolean 토글로 상태를 관리하며, 조합에 따라 다음 패턴을 지원:
    - `variant="chip"`: 칩 스타일(태그/필터 느낌).
    - `variant="fill"`: 면(버튼형) 스타일.
    - `icon-position="left"`: 왼쪽 아이콘 + 텍스트.
    - `icon-position="right"`: 텍스트 + 오른쪽 아이콘.
    - `icon-position="only"`: 아이콘만 있는 선택(원형/정사각형 버튼 느낌).
  - **라디오처럼 사용하기**:
    - 기본은 체크박스(토글) 구조이지만, 부모에서 **단일 값 + `computed` boolean**을 조합하면 라디오 그룹처럼 사용할 수 있음.
  - **라이브러리 의존성**: 없음.

### 9.2 Data 컴포넌트

- **AppAgGrid**
  - **파일**: `components/data/AppAgGrid.vue`
  - **역할**: AG Grid(Vue 래퍼)를 감싼 데이터 그리드 래퍼. 컬럼 정의, 로컬 데이터, 페이징/정렬/필터 등의 데모를 위해 사용.
  - **사용 라이브러리**:
    - `ag-grid-community`, `ag-grid-vue3`
      - **목적**: 대용량 테이블/그리드 렌더링, 무한 스크롤, 정렬/필터/그룹핑 등 복합 기능 제공.
    - `@ag-grid-community/locale`
      - **목적**: 그리드 내 텍스트/라벨의 다국어(로케일) 지원. 한국어 등 특정 언어 번역을 적용할 때 사용.

- **AppChart**
  - **파일**: `components/data/AppChart.vue`
  - **역할**: Chart.js + vue-chartjs 래퍼.
    - `type` 프롭으로 `line`, `bar`, `doughnut`, `pie` 지원.
    - `height` 프롭으로 고정 높이 제어(레이아웃 폭주 방지).
    - 공통 옵션(`responsive`, `maintainAspectRatio: false`, `animation: false`)을 병합하여 데모 전반에서 동일한 동작 유지.
  - **사용 라이브러리**:
    - `chart.js`
      - **목적**: 캔버스 기반 차트 엔진 (스케일, 컨트롤러, 플러그인 등 코어 기능 제공).
    - `vue-chartjs`
      - **목적**: Chart.js를 Vue 컴포넌트(`Line`, `Bar`, `Doughnut`, `Pie` 등)로 감싸는 래퍼. `props`로 `data/options`를 넘기고, Vue 리액티브 시스템과 통합.

### 9.3 에디터/텍스트 컴포넌트

- **Toast UI Editor**
  - **사용 라이브러리**:
    - `@toast-ui/editor`
    - `@toast-ui/editor-plugin-color-syntax`
  - **목적**: 마크다운/WYSIWYG 모드 전환이 가능한 리치 텍스트 에디터. 색상 문법 플러그인으로 코드 하이라이트/컬러 텍스트를 함께 지원.

### 9.4 전역/인프라 라이브러리 정리

- **Nuxt 3 (`nuxt`)**
  - 역할: 전체 애플리케이션 프레임워크 (라우팅, SSR/CSR, 파일 기반 구성, Nitro 서버).
- **Vue 3 (`vue`)**
  - 역할: 뷰 레이어 및 반응형 시스템 (`ref`, `computed`, `<script setup>` 등).
- **Vue Router (`vue-router`)**
  - 역할: 라우터. Nuxt 내부에서 관리하지만, 명시적으로 사용 시 `useRouter`, `useRoute`로 페이지 네비게이션 제어.
- **Pinia (`pinia`, `@pinia/nuxt`)**
  - 역할: 상태 관리 라이브러리. `stores/`에서 전역 상태를 정의하고, 컴포넌트에서 가져다 사용.
- **Axios**
  - 역할: HTTP 클라이언트. `useApi()` 헬퍼와 함께 사용해 백엔드/Mock API 호출.
- **Sass (`sass`, `sass-loader`)**
  - 역할: SCSS 전처리기. `assets/scss` 구조를 통해 컴포넌트/페이지별 스타일을 모듈화.

## 참고 링크

- [Nuxt 3 문서](https://nuxt.com/docs)
- [Vite 문서](https://vitejs.dev/)
- [Pinia 문서](https://pinia.vuejs.org/)
- [Axios 문서](https://axios-http.com/)
- [Sass 문서](https://sass-lang.com/)
- [AG Grid 문서](https://www.ag-grid.com/vue-data-grid/)
- [Flatpickr](https://flatpickr.js.org/)
- [noUiSlider](https://refreshless.com/nouislider/)
- [Chart.js](https://www.chartjs.org/)
- [vue-chartjs](https://vue-chartjs.org/)
