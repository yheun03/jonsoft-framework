import { storeToRefs } from 'pinia';
import { I18N_MESSAGES } from '~/core/constants/i18n';
import { usePreferencesStore } from '~/core/stores/preferences';

export function useI18nText() {
    const preferences = usePreferencesStore();
    const { locale } = storeToRefs(preferences);

    function t(key: string, fallback?: string) {
        return I18N_MESSAGES[locale.value][key] ?? fallback ?? key;
    }

    return {
        locale,
        t,
    };
}
