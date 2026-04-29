import En from './En';
import Ko from './Ko';

export type Locale = 'ko' | 'en';
type Dictionary = Record<string, string>;

export const I18N_MESSAGES: Record<Locale, Dictionary> = {
    ko: Ko,
    en: En,
};
