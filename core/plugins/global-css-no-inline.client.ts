/**
 * Vite dev가 주입하는 인라인 <style data-vite-dev-id="..."> 중,
 * 동일한 CSS가 <link rel="stylesheet">로도 로드되는 경우 인라인을 제거합니다.
 */
function removeInlineStylesWhenLinkPresent() {
    const head = document.head
    if (!head) return

    const inlineStyles = Array.from(head.querySelectorAll<HTMLStyleElement>('style[data-vite-dev-id]'))
    if (!inlineStyles.length) return

    const byDevId = new Map<string, HTMLStyleElement[]>()
    for (const el of inlineStyles) {
        const id = el.getAttribute('data-vite-dev-id')
        if (!id) continue
        const arr = byDevId.get(id) ?? []
        arr.push(el)
        byDevId.set(id, arr)
    }

    for (const [devId, els] of byDevId) {
        const hasLink = !!head.querySelector<HTMLLinkElement>(`link[rel="stylesheet"][href*="${CSS.escape(devId)}"]`)
        if (!hasLink) continue
        for (const el of els) el.remove()
    }
}

export default defineNuxtPlugin(() => {
    if (import.meta.server) return

    const run = () => {
        try {
            removeInlineStylesWhenLinkPresent()
        } catch {
            // no-op
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', run, { once: true })
    } else {
        run()
    }

    if (import.meta.dev && document.head) {
        const obs = new MutationObserver(() => run())
        obs.observe(document.head, { childList: true, subtree: true })
    }
})
