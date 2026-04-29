import { usePreferencesStore } from '~/core/store/preferences';

export default defineNuxtPlugin(() => {
    const preferences = usePreferencesStore();
    preferences.hydrate();
});
