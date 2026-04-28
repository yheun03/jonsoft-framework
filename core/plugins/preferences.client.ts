import { usePreferencesStore } from '~/core/stores/preferences';

export default defineNuxtPlugin(() => {
    const preferences = usePreferencesStore();
    preferences.hydrate();
});
