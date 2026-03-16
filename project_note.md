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
├─ project_note.md
├─ .nvmrc, .env.example, .gitignore, tsconfig.json
├─ assets/
├─ components/
├─ composables/
├─ layouts/
├─ pages/
├─ plugins/
├─ server/
├─ stores/
└─ types/
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

### 2.8 composables/

#### 2.8.1 composables/useApi.ts

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

#### 2.8.2 composables/useAgGridExcelExport.ts

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

### 2.10 stores/

#### 2.10.1 stores/route-tabs.ts

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

#### 2.10.2 stores/workspace.ts

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

### 2.12 types/

- `types/api/menu.ts`, `types/api/user.ts`
  - 메뉴/사용자 API용 타입 정의 (예제/확장용).
- `types/global/axios.d.ts`
  - `$api` 등 Axios 관련 전역 타입 보완.
- `types/global/ag-grid.d.ts`
  - AG Grid 타입 정의 보완.
- `types/toast-ui-editor.d.ts`
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
├── components/         # 전역 컴포넌트/데모 스타일
│   ├── base/           # AppButton, AppProgress 등 기본 UI
│   │   ├── _button.scss
│   │   ├── _icon.scss
│   │   ├── _progress.scss
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
│     ├─ components/
│     │  ├─ base/                # AppButton, AppProgress 등 전역 UI 스타일
│     │  │  ├─ _button.scss
│     │  │  ├─ _icon.scss
│     │  │  ├─ _progress.scss
│     │  │  └─ _index.scss
│     │  └─ _index.scss
│     └─ main.scss               # 진입점 (base, layout, components 순)

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
  - 렌더링 컴포넌트: `components/PatternNavItem.vue` (재귀)
- **API**: `server/api/menus.get.ts`에서 `GET /api/menus`로 반환합니다.

#### 그룹(폴더) 메뉴 규칙 (`to` 유무)

- `MENUS`의 아이템에서 `to` 값이 **없거나**, **빈 문자열이거나**, **공백만 있는 값**이면 해당 아이템은 “이동 링크”가 아니라 **그룹(폴더) 항목**으로 처리합니다.
- 그룹 항목은 `components/PatternNavItem.vue`에서 링크 대신 버튼으로 렌더링되며, **행 클릭 시 서브메뉴가 펼침/접힘 토글**됩니다.

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
  - **SCSS**: `assets/scss/components/base/_button.scss` (`<style scoped>` 미사용, 전역 번들에서 관리)
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
  - **SCSS**: `assets/scss/components/base/_progress.scss`
    - 리니어/원형/반원형 공통 두께 토큰 `--app-progress-track-h`를 사용하며, 전체 사이즈와 관계없이 절대 두께를 유지.
    - 컴포넌트 내부 `<style scoped>`는 사용하지 않고, 전역 SCSS에서 `.app-progress` 네임스페이스 기반으로 관리.

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
