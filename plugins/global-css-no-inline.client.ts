const GLOBAL_CSS_DEV_ID = 'main.scss'

function removeDuplicateGlobalStyles() {
    document
        .querySelectorAll<HTMLStyleElement>(
            `style[data-vite-dev-id*="${GLOBAL_CSS_DEV_ID}"]`,
        )
        .forEach((el) => el.remove())
}

/**
 * 전역 CSS(main.scss)가 <link>와 <style> 두 번 주입되는 것을 방지합니다.
 * Vite dev가 주입한 인라인 <style>만 제거해 <link>만 남깁니다.
 */
export default defineNuxtPlugin(() => {
    if (import.meta.server) return

    removeDuplicateGlobalStyles()
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', removeDuplicateGlobalStyles)
    }
    setTimeout(removeDuplicateGlobalStyles, 50)

    const observer = new MutationObserver(() => {
        removeDuplicateGlobalStyles()
    })
    observer.observe(document.documentElement, {
        childList: true,
        subtree: true,
    })
    setTimeout(() => observer.disconnect(), 3000)
})
