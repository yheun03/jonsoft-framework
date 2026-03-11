const GLOBAL_CSS_DEV_ID = 'main.scss'

function removeDuplicateGlobalStyles() {
    // Vue/Nuxt 업데이트 타이밍과 충돌하지 않도록 "head 내부"만 대상으로,
    // 실제로 중복이 생겼을 때(2개 이상)만 제거합니다.
    const styles = Array.from(
        document.head?.querySelectorAll<HTMLStyleElement>(`style[data-vite-dev-id*="${GLOBAL_CSS_DEV_ID}"]`) ?? [],
    )
    if (styles.length <= 1) return
    for (const el of styles) el.remove()
}

/**
 * 전역 CSS(main.scss)가 <link>와 <style> 두 번 주입되는 것을 방지합니다.
 * Vite dev가 주입한 인라인 <style>만 제거해 <link>만 남깁니다.
 */
export default defineNuxtPlugin(() => {
    if (import.meta.server) return

    // 라우트 전환/업데이트와의 충돌을 피하기 위해 "초기 1회"만 실행합니다.
    // (Dev HMR 중 간헐적으로 생기는 이슈를 막기 위한 최보수 전략)
    const runOnce = () => {
        try {
            removeDuplicateGlobalStyles()
        } catch {
            // no-op
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', runOnce, { once: true })
    } else {
        runOnce()
    }
})
