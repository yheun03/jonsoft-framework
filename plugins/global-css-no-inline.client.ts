/**
 * Vite dev가 주입하는 인라인 <style data-vite-dev-id="..."> 중,
 * 동일한 CSS가 <link rel="stylesheet">로도 로드되는 경우 인라인을 제거합니다.
 *
 * - 목표: "link + inline" 중복을 없애 DOM을 깔끔하게 유지
 * - 제약: link가 없는 CSS까지 지우면 스타일이 사라질 수 있어, link 존재 여부를 기준으로만 제거
 */
function removeInlineStylesWhenLinkPresent() {
    const head = document.head
    if (!head) return

    const inlineStyles = Array.from(head.querySelectorAll<HTMLStyleElement>('style[data-vite-dev-id]'))
    if (!inlineStyles.length) return

    // dev-id 별로 묶어서, link가 있으면 해당 inline은 모두 제거
    const byDevId = new Map<string, HTMLStyleElement[]>()
    for (const el of inlineStyles) {
        const id = el.getAttribute('data-vite-dev-id')
        if (!id) continue
        const arr = byDevId.get(id) ?? []
        arr.push(el)
        byDevId.set(id, arr)
    }

    for (const [devId, els] of byDevId) {
        const hasLink = !!head.querySelector<HTMLLinkElement>(
            `link[rel="stylesheet"][href*="${CSS.escape(devId)}"]`,
        )
        if (!hasLink) continue
        for (const el of els) el.remove()
    }
}

/**
 * 전역 CSS(main.scss)가 <link>와 <style> 두 번 주입되는 것을 방지합니다.
 * Vite dev가 주입한 인라인 <style>만 제거해 <link>만 남깁니다.
 */
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

    // dev에서 head가 다시 갱신되며 인라인이 재주입되는 케이스를 방지
    if (import.meta.dev && document.head) {
        const obs = new MutationObserver(() => run())
        obs.observe(document.head, { childList: true, subtree: true })
    }
})
