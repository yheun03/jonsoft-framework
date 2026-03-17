# Jonsoft Framework - 프로젝트 노트

Nuxt 3, Vite, SCSS, Axios, Pinia, AG Grid, Chart.js, Toast UI Editor 등을 사용하는 **워크스페이스 + UI 데모** 프로젝트입니다.  
이 문서는 **우리 코드 기준**으로 폴더/파일 의미, 컴포넌트 사용법, 플러그인/라이브러리 사용 이유와 API 개발 패턴을 정리합니다.

---

## 목차

1. 프로젝트 개요 및 스택
2. 폴더 구조와 역할
3. 주요 플러그인 & 라이브러리
4. 핵심 컴포넌트와 사용 방법
5. 화면 구성 흐름
6. API 개발 가이드 (Pinia, Axios, Vite 관점)
7. 개발/빌드 스크립트

---

## 1. 프로젝트 개요 및 스택

### 1.1 package.json 기준 주요 의존성

`package.json` 기준:

| 패키지 | 버전 (범위) | 역할 / 비고 |
|--------|-------------|-------------|
| **nuxt** | `^3.14.1593` | 앱 전체 프레임워크 (라우팅, 서버, 번들링, Vite 내장) |
| **vue** | `^3.5.12` | UI 레이어, Composition API, `<script setup>` |
| **vue-router** | `^4.4.5` | 라우터 (Nuxt 내부에서 사용, `useRoute`, `useRouter`) |
| **pinia** | `^2.2.4` | 상태 관리 라이브러리 |
| **@pinia/nuxt** | `^0.5.4` | Nuxt에서 Pinia 모듈 자동 등록 |
| **axios** | `^1.7.7` | HTTP 클라이언트 (`plugins/axios.ts`에서 `$api`로 제공) |
| **ag-grid-community** | `^33.3.2` | AG Grid 코어 |
| **ag-grid-vue3** | `^33.3.2` | Vue 3용 AG Grid 래퍼 |
| **@ag-grid-community/locale** | `^33.3.2` | AG Grid 로케일 (한국어 등) |
| **chart.js** | `^4.5.1` | 캔버스 기반 차트 엔진 |
| **vue-chartjs** | `^5.3.3` | Chart.js Vue 래퍼 |
| **flatpickr** | `^4.6.13` | 날짜/시간 선택기 (AppDatePicker) |
| **nouislider** | `^15.8.1` | 슬라이더 UI (AppProgress 범위 모드) |
| **@toast-ui/editor** | `^3.2.2` | Toast UI Markdown/WYSIWYG 에디터 |
| **xlsx** | `^0.18.5` | 서버에서 엑셀 파일 생성 (`server/api/export/excel.post.ts`) |
| **sass** | `^1.80.4` | SCSS 전처리기 (devDependency) |

**Node 버전**

- `.nvmrc` + `package.json` `engines.node` 기준: `>=20 <23` 권장  
- nvm 사용 시:

```bash
nvm use
```

---

## 2. 폴더 구조와 역할

### 2.1 최상위 구조

```
jonsoft-framework/
├─ app.vue
├─ nuxt.config.ts
├─ package.json
├─ package-lock.json
├─ tsconfig.json
├─ project_note.md
├─ .env.example
├─ .gitignore
├─ assets/
├─ components/
├─ core/
├─ layouts/
├─ pages/
├─ plugins/
├─ server/
├─ dist/
└─ node_modules/
```

### 2.2 app.vue

- **역할**: Nuxt 앱 루트 컴포넌트.
- 구현 요약:
  - `<NuxtLayout>` 안에 `<NuxtPage :key="route.fullPath" />` 렌더링.
  - `useRoute()`로 현재 경로를 가져와 `key` 로 사용 → **라우트 전환 시 페이지 전체 리마운트**.

### 2.3 nuxt.config.ts

- **핵심 설정**:
  - `devtools: { enabled: true }`
  - `experimental: { appManifest: false }`
  - `features: { inlineStyles: false }`
  - `app.baseURL = '/jonsoft-framework/'` → GitHub Pages 등 서브 디렉터리 배포 대응.
  - `modules = ['@pinia/nuxt']` → Pinia 자동 등록.
  - `css = ['~/assets/scss/main.scss']` → 전역 SCSS 진입점.
  - `components = [{ path: '~/components', pathPrefix: false }]`
    - `components/` 하위 `.vue` 는 **자동 전역 등록** (폴더 이름 prefix 없이 파일명 기준).
  - `vite.css.preprocessorOptions.scss`:
    - `loadPaths: ['assets/scss']`
    - `additionalData: '@use "abstract/index" as *;'`
    - → 모든 SCSS에서 `abstract/_index.scss` 를 전역처럼 사용.
  - `runtimeConfig.public.apiBase = '/api'`
    - `plugins/axios.ts` 의 `baseURL` 로 사용.

---

### 2.4 assets/

#### 2.4.1 assets/scss

- `assets/scss/main.scss`
  - 전역 스타일 진입점.
  - abstract → base → layout → components → pages 순으로 include.
- `assets/scss/abstract/_index.scss`
  - 각종 변수/타이포그래피 등을 forward (`_variables.scss`, `_typography.scss` 등).
  - Vite `additionalData` 설정으로 모든 SCSS 파일 상단에 자동 include 됨.
- `assets/scss/base/*`
  - `_reset.scss`: Reset 스타일.
  - `_fonts.scss`: Pretendard 폰트 face 정의.
  - `_scrollbar.scss`: 스크롤바 커스텀.
- `assets/scss/layout/*`
  - `_nav.scss`: 좌측 네비게이션 레이아웃 스타일.
- `assets/scss/components/base/*`
  - `_button.scss`, `_input.scss`, `_select.scss`, `_date-picker.scss`, `_progress.scss`, `_radio.scss`, `_checkbox.scss`, `_workspace-pane.scss`, `_chart.scss`, `_tabs-page.scss` 등.
  - `components/base` 컴포넌트들의 스타일을 전역으로 관리.
- `assets/scss/pages/*`
  - `_home.scss`, `_index.scss` 등 페이지 전용 스타일.

#### 2.4.2 assets/icons

- `assets/icons/logo.svg`, `assets/icons/temp.svg` 등:
  - `?raw` 로 import 후 `v-html` 로 인라인 렌더링.
  - 예: `layouts/nav.vue`, `pages/demos/button-demo.vue`, `RouteTabsBar.vue`.
- `assets/icons/12`, `16`, `20` 폴더:
  - 닫기 아이콘(`ic-xmark`), 검색(`ic-search`), 필터(`ic-filter`), 폴더(`ic-folder-plus`), 테마(`ic-moon`) 등.

#### 2.4.3 assets/fonts

- Pretendard 폰트 woff 파일 모음.
  - `_fonts.scss` 에서 `@font-face`로 불러와 전체 앱 기본 폰트로 사용.

---

### 2.5 layouts/

#### 2.5.1 layouts/default.vue

- **역할**: 전체 공통 레이아웃.
- 구조:
  - 좌측: `LayoutNav`
  - 상단: `RouteTabsBar`
  - 중앙: 실제 페이지 콘텐츠 `slot`

```vue
<div class="layout">
  <LayoutNav class="layout__nav" />
  <main class="layout__main">
    <RouteTabsBar class="layout__tabs" />
    <div class="layout__content">
      <slot />
    </div>
  </main>
</div>
```

#### 2.5.2 layouts/nav.vue

- **역할**: 좌측 사이드바 네비게이션.
- 사용 데이터/컴포넌트:
  - `MENUS` (`server/utils/menu-data.ts`) → 메뉴 정의.
  - `PatternNavItem` (`components/PatternNavItem.vue`) → 트리/폴더 구조 재귀 렌더링.
  - 여러 SVG 아이콘 (`logo`, `edit`, `folder-plus`, `filter`, `target`, `search`, `moon`).
- 핵심 로직:
  - `MENUS` 는 depth 기반 flat 리스트 → `buildMenuTreeAndSort` 함수로 트리 변환.
  - 스택(`stack`)을 사용해 depth 에 따른 부모/자식 계층 계산.
  - 형제(children) 수준에서만 `order` 기준 정렬.
  - `ICON_SVGS` 맵으로 `icon` 문자열 → SVG string 매핑.

---

### 2.6 pages/

#### 2.6.1 pages/index.vue

- **역할**: 워크스페이스 메인 페이지.
- 구성:
  - `workspace` 영역 안에 **Toast UI Editor** 를 직접 마운트.
  - `useWorkspaceStore` 와 연동해 markdown 을 저장/로드.
- 동작:
  - `onMounted` 시점에 `@toast-ui/editor` 와 CSS를 동적 import.
  - 에디터 `change` 이벤트에서 현재 left pane 탭의 내용을 store에 반영.
  - store에서 `leftTab.content` 가 바뀌면 watcher 로 에디터 내용도 동기화.

#### 2.6.2 pages/demos/*

각 데모 페이지는 base/data 컴포넌트들의 **사용 예시 + 상태 표시**를 보여줍니다.

- `pages/demos/button-demo.vue` → `AppButton` 데모.
- `pages/demos/input-demo.vue` → `AppInput` 데모.
- `pages/demos/ag-grid-demo.vue` → `AppAgGrid` + `useAgGridExcelExport`.
- `pages/demos/chart-demo.vue` → `AppChart` + Chart.js.
- `pages/demos/progress-demo.vue` → `AppProgress`.
- `pages/demos/datepicker-demo.vue` → `AppDatePicker`.
- `pages/demos/select-demo.vue` → `AppSelect`.
- `pages/demos/choice-demo.vue` → `AppChoice` (checkbox/radio/chip).

실제 컴포넌트 사용 시 **데모 페이지의 `<script setup>` 부분을 그대로 참고하면 패턴 이해가 빠릅니다.**

---

### 2.7 components/

> `nuxt.config.ts` 의 `components` 설정으로, `components/` 하위 모든 `.vue` 파일은 **자동 전역 컴포넌트**입니다.

#### 2.7.1 components/RouteTabsBar.vue

- **역할**: 상단 “최근 방문 페이지 탭” 바.
- 사용 스토어:
  - `useRouteTabsStore` (`stores/route-tabs.ts`).
- 동작 흐름:
  - `plugins/route-tabs.client.ts` 가 `router.afterEach` 에서 라우트 변경을 감지하고 `store.visit` 호출.
  - 이 컴포넌트는 `tabs` / `activeKey` 를 읽어 탭 목록 렌더링 + 닫기/클릭 이벤트만 처리.
- 주요 로직:
  - `currentKey = activeKey ?? route.fullPath`.
  - 탭 클릭 → `store.activate(key)` + `<NuxtLink :to="t.path">`.
  - 탭 닫기 → `store.close(key)` + 닫힌 탭이 active 였다면 이전/다음 탭으로 fallback 후 `router.push(fallback.path)`.

#### 2.7.2 그 외 base/data 컴포넌트

실제 구현은 `components/base/*.vue`, `components/data/*.vue` 에 있으며, 아래 **4. 핵심 컴포넌트와 사용 방법**에서 사용 관점으로 정리합니다.

---

### 2.8 core/composables/

#### 2.8.1 core/composables/useApi.ts

- **역할**: `$api` (Axios 인스턴스) 래퍼.
- 구현:

```ts
export const useApi = () => {
  const { $api } = useNuxtApp()

  return {
    get:   <T>(url: string, config?: object)           => $api.get<T>(url, config),
    post:  <T>(url: string, data?: object, config?: object) => $api.post<T>(url, data, config),
    put:   <T>(url: string, data?: object, config?: object) => $api.put<T>(url, data, config),
    delete:<T>(url: string, config?: object)           => $api.delete<T>(url, config),
  }
}
```

- 사용 예:

```ts
const { get, post } = useApi()
const { data } = await get<User[]>('/users')   // 결국 /api/users 호출
await post('/users', payload)
```

#### 2.8.2 core/composables/useAgGridExcelExport.ts

- **역할**: AG Grid 현재 표시 데이터(필터/정렬 반영)를 서버에 보내 엑셀 파일 다운로드.
- 주요 함수:
  - `exportDisplayed(gridId: string, api: GridApi<T>)`
  - `exportDisplayedSelected(gridId: string, api: GridApi<T>)`
- 동작:
  - `getColumns` / `getDisplayedRows` / `getDisplayedSelectedRows` 로 컬럼/행 추출.
  - `$fetch<Blob>('/api/export/excel', { method: 'POST', responseType: 'blob', body: {...} })`.
  - 응답 blob 을 `<a download>` 로 브라우저 다운로드.
- 사용처:
  - `pages/demos/ag-grid-demo.vue` 의 `onExportAll`, `onExportSelected`.

---

### 2.9 plugins/

#### 2.9.1 plugins/axios.ts

- **역할**: Axios 인스턴스 생성 후 `$api` 로 Nuxt 앱에 주입.
- 설정:
  - `baseURL = useRuntimeConfig().public.apiBase` (기본 `/api`).
  - `timeout = 10000ms`.
  - `Content-Type: application/json`.
  - request/response 인터셉터에서 인증 토큰, 공통 에러 처리 등을 추가 가능.
- 타입 확장:
  - `declare module '#app' { interface NuxtApp { $api: AxiosInstance } }`

#### 2.9.2 plugins/route-tabs.client.ts

- **역할**: 라우트 이동을 상단 탭(`RouteTabsBar`)과 동기화.
- 구현 요약:
  - `MENUS` 기준으로 `MENU_TITLE_BY_PATH` 맵 생성 (`path → label`).
  - `router.afterEach` 에서:
    - `to.path` 기반으로 title 결정:
      - 메뉴 타이틀 → `meta.title` → route name → path 순.
    - `store.visit({ key: to.fullPath, path: to.fullPath, title })`.
  - 앱 초기 진입 시에도 현재 라우트를 한 번 `track`.

#### 2.9.3 plugins/ag-grid.client.ts

- **역할**: AG Grid 모듈 등록 + 한국어 로케일 제공.
- 구현:
  - `ModuleRegistry.registerModules([AllCommunityModule])`.
  - `nuxtApp.provide('agGridLocale', AG_GRID_LOCALE_KR)`.

#### 2.9.4 plugins/global-css-no-inline.client.ts

- **역할**: dev 환경에서 `main.scss` 가 `<link>` + `<style>` 로 중복 주입되는 버그 방지.
- 방식:
  - `document.head` 에서 `style[data-vite-dev-id*="main.scss"]` 를 모은 뒤, 2개 이상이면 여분을 제거.
  - `DOMContentLoaded` 시 1회 실행.

---

### 2.10 core/stores/

#### 2.10.1 core/stores/route-tabs.ts

- **역할**: 상단 경로 탭 상태 관리.
- 상태:
  - `tabs: RouteTab[]` (`{ key, path, title }`).
  - `activeKey: string | null`.
  - `activeTab: RouteTab | null` (computed, `activeKey` 기준).
- 액션:
  - `visit(tab, opts?)`:
    - `key` 기준으로 기존 탭 있으면 path/title 업데이트, 없으면 push.
    - `opts?.activate ?? true` 에 따라 자동 활성화.
  - `activate(key)`:
    - 해당 key가 존재하는 경우에만 `activeKey` 변경.
  - `close(key)`:
    - 탭 제거 후, 닫은 탭이 active 였다면 이전/첫 번째 탭으로 fallback.
  - `reset()`:
    - 모든 탭과 activeKey 초기화.
- 사용처:
  - `plugins/route-tabs.client.ts` (방문 기록).
  - `components/RouteTabsBar.vue` (탭 UI).

#### 2.10.2 core/stores/workspace.ts

- **역할**: 옵시디언 스타일 워크스페이스 탭/분할 상태 관리.
- 상태:
  - `tabs: WorkspaceTab[]` (`{ id, title, content }`).
    - 초기 탭: `welcome` (간단한 markdown 안내).
  - `activeTabId: string`.
  - `split: boolean` (좌/우 분할 여부).
  - `activeTabIdByPane: { left: string; right: string }`.
  - `leftTab`, `rightTab`, `activeTab`: computed.
- 액션:
  - `ensureTab(id)`, `openTab(id, title?)`, `closeTab(id)`.
  - `setActiveTab(id)`, `setActiveTabForPane(pane, id)`.
  - `updateTabContent(id, content)`.
  - `toggleSplit()` → split off 시 오른쪽 pane 을 left 와 동일 탭으로 동기화.
- 사용처:
  - `pages/index.vue` 의 Toast UI Editor (left pane 기준).

---

### 2.11 server/

#### 2.11.1 server/utils/menu-data.ts

- **역할**: 사이드바 메뉴 공통 데이터.
- 구조:
  - `MENUS = [{ id, depth, order, label, to, newTab }, ...] as const`.
  - depth 기반 flat 구조 (부모 메뉴 바로 뒤에 자식 메뉴가 위치한다는 전제).
- 사용처:
  - `layouts/nav.vue` → `buildMenuTreeAndSort` 로 트리 변환 후 렌더링.
  - `plugins/route-tabs.client.ts` → `MENU_TITLE_BY_PATH` 생성.
  - `server/api/menus.get.ts` → `/api/menus` 응답.

#### 2.11.2 server/api/menus.get.ts

- **역할**: `GET /api/menus` → `{ menus: MENUS }`.
- 사용:
  - 현재 레이아웃은 `MENUS` 를 바로 import 해서 사용 중이고, 이 API는 향후 분리 또는 외부 소비용 예제로 활용 가능.

#### 2.11.3 server/api/export/excel.post.ts

- **역할**: 클라이언트 그리드에서 보낸 데이터를 엑셀 파일로 변환해 내려주는 API.
- 입력(body):
  - `gridId`, `columns[{ field, headerName }]`, `rows[]`, `fileName?`, `sheetName?`, `origin?`.
- 처리:
  - `XLSX.utils.aoa_to_sheet` 로 시트 생성.
  - `sheet_add_aoa` 로 header + row 데이터 쓰기.
  - `book_new` / `book_append_sheet` / `write` 로 xlsx 버퍼 생성.
  - Content-Disposition / Content-Type 헤더 세팅 후 버퍼 반환.
- 사용처:
  - `useAgGridExcelExport.ts` → `$fetch('/api/export/excel', { responseType: 'blob' })`.

---

### 2.12 core/types/

- `core/types/api/menu.ts`, `core/types/api/user.ts`
  - 메뉴/사용자 API용 타입 정의 (예제/확장용).
- `core/types/global/axios.d.ts`
  - `$api` 등 Axios 관련 전역 타입 보완.
- `core/types/global/ag-grid.d.ts`
  - AG Grid 타입 정의 보완.
- `core/types/toast-ui-editor.d.ts`
  - Toast UI Editor 타입 보완.

---

## 3. 주요 플러그인 & 라이브러리 (이유/사용처/방법)

### 3.1 Nuxt 3

- **이유**:
  - Vite + 서버(Nitro) + 파일기반 라우팅 + 자동 임포트를 한 번에 제공.
  - SSR/CSR/SSG 모두 지원.
- **사용처**:
  - `pages/`, `layouts/`, `plugins/`, `server/api` 구조 전체.
  - `useRoute`, `useRouter`, `useRuntimeConfig`, `$fetch` 등 Composition API 헬퍼.

### 3.2 Vite (Nuxt 내부)

- **이유**:
  - 빠른 dev 서버, HMR, 간단한 CSS/SCSS 설정.
- **사용 방식**:
  - `nuxt.config.ts` 의 `vite.css.preprocessorOptions.scss` 로 SCSS 전역 토큰 주입.
  - dev 환경에서 발생하는 CSS 중복 이슈를 `plugins/global-css-no-inline.client.ts` 로 보완.

### 3.3 Pinia / @pinia/nuxt

- **이유**:
  - Vue 공식 상태관리, 타입스크립트 친화, 모듈 구조 간단.
- **사용처**:
  - `stores/route-tabs.ts` (경로 탭).
  - `stores/workspace.ts` (워크스페이스 탭/분할).
  - Nuxt 모듈 형태로 자동 설치돼, 어디서든 `useXxxStore` import 후 사용 가능.

### 3.4 Axios (+ useApi)

- **이유**:
  - 익숙한 API, 인터셉터 기반 공통 처리(인증/에러 로깅) 용이.
- **구성**:
  - `plugins/axios.ts` → `$api` 인스턴스 제공.
  - `composables/useApi.ts` → `get/post/put/delete` 래퍼 제공.
- **사용 패턴**:
  - 컴포넌트/스토어에서 `const { get } = useApi()` 식으로 호출.

### 3.5 AG Grid

- **패키지**:
  - `ag-grid-community`, `ag-grid-vue3`, `@ag-grid-community/locale`.
- **이유**:
  - 대용량/복합 그리드 (정렬/필터/그룹/가상 스크롤 등) 구현.
- **사용처**:
  - `plugins/ag-grid.client.ts` → 모듈 등록 + 한국어 로케일 제공.
  - `components/data/AppAgGrid.vue` → Vue 래퍼.
  - `pages/demos/ag-grid-demo.vue` → 실제 데모, 엑셀 내보내기 등.

### 3.6 Chart.js + vue-chartjs

- **이유**:
  - 다양한 차트 타입과 잘 정의된 옵션/플러그인 구조.
- **사용처**:
  - `components/data/AppChart.vue`.
  - `pages/demos/chart-demo.vue` 에서 라인/바/도넛/파이 차트 예시.

### 3.7 flatpickr

- **이유**:
  - 가벼운 날짜/시간 선택기, single/range/multiple 등 모드 지원.
- **사용처**:
  - `components/base/AppDatePicker.vue`.
  - `pages/demos/datepicker-demo.vue` (min/max, 필수 검증 등).

### 3.8 nouislider

- **이유**:
  - 터치/마우스 지원, range 핸들 제공.
- **사용처**:
  - `components/base/AppProgress.vue` (범위 선택 모드).
  - `pages/demos/progress-demo.vue`.

### 3.9 Toast UI Editor

- **이유**:
  - Markdown/WYSIWYG 겸용 에디터, 툴바/프리뷰 등 UX 좋음.
- **사용처**:
  - `pages/index.vue` 에서 워크스페이스 메인 에디터.
  - `useWorkspaceStore` 의 탭 내용과 markdown 연동.

---

## 4. 핵심 컴포넌트와 사용 방법 (데모 기준)

> 실제 구현은 `components/base`, `components/data` 에 있으며, 여기는 **어떻게 사용하는지** 관점으로 정리합니다.

### 4.1 AppButton (`components/base/AppButton.vue`)

- **주요 props (추론)**:
  - `variant`: `'fill' | 'text' | 'underline' | 'outline'` 등.
  - `size`: `'sm' | 'md' | 'lg' | 'custom'`.
  - `customSize`: `{ width?: number; height?: number }`.
  - `to`: 내부 라우팅 (`<NuxtLink>`).
  - `href`: 외부 링크.
  - `newTab`: 새 탭 열기 여부.
  - `disabled`, `loading`, `block`.
  - `ariaLabel`: 아이콘 전용 버튼 접근성용.
- **슬롯**:
  - `default`: 텍스트.
  - `#iconLeft`, `#iconRight`: 좌/우 아이콘.
- **데모 사용 예** (`pages/demos/button-demo.vue`):
  - variant/size/icon/link/state 케이스를 한눈에 볼 수 있음.

### 4.2 AppInput (`components/base/AppInput.vue`)

- **주요 props (추론)**:
  - `v-model`: string.
  - `label`, `placeholder`, `helper`, `error`.
  - `type`: `'text' | 'email' | 'search' | 'password' | 'number'`.
  - `size`: `'sm' | 'md' | 'lg'`.
  - `readonly`, `disabled`, `clearable`, `maxlength`, `min`, `max`.
  - `inputModeOverride`: 모바일 키보드 타입 (`numeric` 등).
- **데모 사용 예** (`pages/demos/input-demo.vue`):
  - 기본/사이즈/상태/간단 검증(필수/숫자 범위) 패턴 제공.

### 4.3 AppSelect (`components/base/AppSelect.vue`)

- **주요 props (추론)**:
  - `v-model`: `string | null`.
  - `options`: `{ value: string; label: string; disabled?: boolean }[]`.
  - `label`, `placeholder`, `helper`, `error`, `disabled`.
  - `searchable`: 옵션 label 기준 substring 검색.
- **데모 사용 예** (`pages/demos/select-demo.vue`):
  - 기본/플레이스홀더/필수/검색형/disabled 케이스.

### 4.4 AppDatePicker (`components/base/AppDatePicker.vue`)

- **v-model 타입**:
  - `mode="single"`: `string | null` (`YYYY-MM-DD`).
  - `mode="range"`: `{ start: string | null; end: string | null } | null`.
  - `mode="multiple"`: `string[]`.
- **주요 props (추론)**:
  - `mode`, `label`, `helper`, `min`, `max`, `error`.
- **데모 사용 예** (`pages/demos/datepicker-demo.vue`):
  - 단일/범위/다중, min/max, 필수 검증.

### 4.5 AppProgress (`components/base/AppProgress.vue`)

- **모드**:
  - 단일 값 (linear).
  - 범위 선택 (`rangeSelectable` + `@update:range`).
  - 원형/반원형 (SCSS/옵션으로 지원).
- **데모 사용 예** (`pages/demos/progress-demo.vue`):
  - `v-model:value` 로 컨트롤.
  - range 모드에서 드래그로 시작/끝 퍼센트 조정.

### 4.6 AppChoice (`components/base/AppChoice.vue`)

- **역할**: 체크박스/라디오/칩 스타일 선택.
- **주요 props (추론)**:
  - `type`: `'checkbox' | 'radio'`.
  - `variant`: `'chip' | 'chip-outline' | 'fill' | 'ghost'` 등.
  - `v-model`: boolean(checkbox), string(radio).
  - `name`, `value` (radio 그룹 구분).
  - `label`, `helper`, `disabled`.
- **데모 사용 예** (`pages/demos/choice-demo.vue`):
  - 체크박스 + 라디오 + 여러 칩 변형을 한 번에 확인 가능.

### 4.7 AppAgGrid (`components/data/AppAgGrid.vue`)

- **역할**: `ag-grid-vue3` 의 래퍼.
- **props (데모 기준)**:
  - `grid-id`, `row-data`, `column-defs`, `default-col-def`.
  - `row-selection`, `animate-rows`, `style`.
- **이벤트**:
  - `@grid-ready="onGridReady"` → `api.getGridId()` 기반으로 `GridApi` 저장.
  - `@selection-changed="onSelectionChanged"` → 선택 행 목록 업데이트.
- **데모 사용 예** (`pages/demos/ag-grid-demo.vue`):
  - 두 개의 서로 다른 grid ID 를 가진 그리드를 렌더링.
  - `exportDisplayed` / `exportDisplayedSelected` 로 엑셀 내보내기.

### 4.8 AppChart (`components/data/AppChart.vue`)

- **역할**: Chart.js + vue-chartjs 래퍼.
- **props (데모 기준)**:
  - `type`: `'line' | 'bar' | 'doughnut' | 'pie'`.
  - `data`: `ChartData`.
  - `options`: `ChartOptions`.
  - `height`: number.
- **데모 사용 예** (`pages/demos/chart-demo.vue`):
  - 포인트 수 슬라이더 조작.
  - 라인/스텝/다중라인, 바, 도넛/반도넛, 파이 차트.

---

## 5. 화면 구성 흐름

1. **라우팅 & 레이아웃**
   - URL → `pages/*` → `layouts/default.vue` 의 `slot` 으로 렌더링.
2. **좌측 네비게이션**
   - `layouts/nav.vue` → `MENUS` → `PatternNavItem` 재귀 렌더링.
   - 필요 시 `/api/menus` 로 동일 데이터 제공 가능.
3. **상단 최근 방문 탭**
   - `plugins/route-tabs.client.ts` 가 `router.afterEach` 로 방문 기록을 `useRouteTabsStore` 에 저장.
   - `layouts/default.vue` 의 `RouteTabsBar` 가 이를 UI 로 표시, 탭 클릭/닫기 제공.
4. **콘텐츠**
   - `/` → `pages/index.vue` (워크스페이스 + Toast UI Editor).
   - `/demos/*` → 각 UI 컴포넌트 데모.

---

## 6. API 개발 가이드 (Pinia, Axios, Vite 관점)

### 6.1 Axios + useApi 패턴

1. **Axios 인스턴스 생성 (플러그인)**  
   - `plugins/axios.ts`:
     - `baseURL = runtimeConfig.public.apiBase` (기본 `/api`).
     - 인터셉터에서 토큰/공통 헤더/에러 로깅 등 처리 가능.

2. **Composable 래퍼 (useApi)**
   - `composables/useApi.ts`:
     - `get/post/put/delete` 제네릭 형태 제공.

3. **사용 예 (컴포넌트/스토어 공통)**

```ts
const { get, post } = useApi()

const fetchUsers = async () => {
  const { data } = await get<User[]>('/users')
  return data
}

await post('/users', { name: '홍길동' })
```

> **Tip**: API 경로를 문자열로 직접 쓰기보다는, 추후 `constants/api.ts` 같은 곳에 상수로 모으는 구조로 확장하는 것을 권장합니다.

### 6.2 Pinia + Axios 조합

1. **스토어에서 API 호출 책임을 가짐**

```ts
export const useUserStore = defineStore('user', () => {
  const list = ref<User[]>([])
  const loading = ref(false)
  const { get } = useApi()

  const fetchUsers = async () => {
    loading.value = true
    try {
      const { data } = await get<User[]>('/users')
      list.value = data
    } finally {
      loading.value = false
    }
  }

  return { list, loading, fetchUsers }
})
```

2. **컴포넌트는 스토어만 사용**

```ts
const userStore = useUserStore()
onMounted(() => userStore.fetchUsers())
```

- 장점:
  - 컴포넌트는 “데이터를 어디에서 가져오는지” 몰라도 됨.
  - API 교체/에러 처리/로딩 상태 관리 등을 스토어/서비스 레이어에 모아둘 수 있음.

### 6.3 Vite 관점 (API, SCSS)

- **API**
  - 개발 환경에서는 `/api/*` 요청이 Nuxt Nitro 서버로 바로 라우팅.
  - 별도의 Vite proxy 설정 없이 `server/api/*.ts` 파일을 만들면 자동으로 API 엔드포인트 생성.
- **SCSS**
  - `additionalData` 로 모든 SCSS 에 `@use "abstract/index" as *;` 자동 삽입.
  - → 개별 파일에서 굳이 `@use` 를 매번 쓰지 않아도 토큰 사용 가능.

### 6.4 서버 API 추가 패턴

1. **엔드포인트 파일 생성**

```ts
// server/api/users.get.ts
export default defineEventHandler(async () => {
  return { users: [] } // 실제 구현에서는 DB/외부 API 연동
})
```

2. **클라이언트에서 호출**
   - `useApi().get('/users')` → `/api/users`.
   - 또는 `$fetch('/api/users')`.

3. **파일 다운로드 (엑셀 등)**
   - 이 프로젝트처럼 서버에서 `xlsx` 로 버퍼 작성.
   - 클라이언트는 `responseType: 'blob'` 으로 받아 `<a download>` 로 저장.

---

## 7. 개발/빌드 스크립트

`package.json` `scripts`:

- `dev`: `nuxt dev`
  - Vite 기반 개발 서버 (`http://localhost:3000` 기본).
- `build`: `nuxt build`
  - 프로덕션 빌드.
- `generate`: `nuxt generate`
  - 정적 사이트 생성 (필요할 때 사용).
- `preview`: `nuxt preview`
  - 빌드 결과 미리보기 서버.
- `clean`: `rm -rf .nuxt .output node_modules/.vite`
  - Nuxt/Vite 캐시 삭제 (이상한 에러 발생 시 사용).
- `deploy`: `gh-pages -d .output/public`
  - GitHub Pages 배포용 (baseURL `/jonsoft-framework/` 와 연계).

---

이 문서는 **실제 코드 기준**으로 계속 업데이트해야 합니다.  
새 컴포넌트/스토어/서버 API를 추가할 때, 이 파일에 “어디에 무엇을 추가했고, 어느 화면에서 어떻게 쓰는지”를 한 줄이라도 남겨두면, 나중에 구조를 이해하거나 API 를 설계할 때 큰 도움이 됩니다.
