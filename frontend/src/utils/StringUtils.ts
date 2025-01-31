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
    static dayShort: { [key: number]: string } = {
        0: t('sunday_short'),
        1: t('monday_short'),
        2: t('tuesday_short'),
        3: t('wednesday_short'),
        4: t('thursday_short'),
        5: t('friday_short'),
        6: t('saturday_short'),
    }

    static cycles: { [key: number]: string } = {
        0: t('timetables_details_cycle_Long'),
        1: t('timetables_details_cycle_First'),
        2: t('timetables_details_cycle_Second'),
        3: t('timetables_details_cycle_Third'),
        4: t('timetables_details_cycle_Postgraduate'),
    }
    static modes: { [key: number]: string } = {
        0: t('timetables_details_mode_FullTime'),
        1: t('timetables_details_mode_PartTime'),
        2: t('timetables_details_mode_Online'),
    }
}