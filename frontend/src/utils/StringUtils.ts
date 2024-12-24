import i18n, { i18nPromise } from '../i18n.ts';

const { t } = i18n;
await i18nPromise;

export default class StringUtils {
    static day: { [key: number]: string } = {
        0: t('sunday'),
        1: t('monday'),
        2: t('tuesday'),
        3: t('wednesday'),
        4: t('thursday'),
        5: t('friday'),
        6: t('saturday'),
    };
}