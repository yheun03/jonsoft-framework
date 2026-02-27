declare module '#app' {
  interface NuxtApp {
    $agGridLocale: Record<string, string>
  }
}

declare module 'vue' {
  interface ComponentCustomProperties {
    $agGridLocale: Record<string, string>
  }
}

export {}
