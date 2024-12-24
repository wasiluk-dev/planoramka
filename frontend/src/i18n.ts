import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import I18NextHttpBackend from 'i18next-http-backend';

const i18nPromise = i18n
    .use(initReactI18next)
    .use(I18NextHttpBackend)
    .init({
        lng: 'pl',
        fallbackLng: false,
        debug: import.meta.env.VITE_DEBUG === 'true',
        interpolation: {
            escapeValue: false,
        },
        react: {
            useSuspense: false,
        }
    });

export { i18nPromise };
export default i18n;
