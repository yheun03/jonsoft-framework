/**
 * AG Grid 플러그인
 * - 모듈 등록 (앱 전체 1회)
 * - 스타일 로드
 * - 한국어 로케일을 기본값으로 provide
 */
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community'
import { AG_GRID_LOCALE_KR } from '@ag-grid-community/locale'
import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-quartz.css'

ModuleRegistry.registerModules([AllCommunityModule])

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.provide('agGridLocale', AG_GRID_LOCALE_KR)
})
