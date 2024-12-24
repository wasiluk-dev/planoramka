import { resources, defaultNS } from '../i18n.ts';

declare module "i18next" {
    interface CustomTypeOptions {
        defaultNS: typeof defaultNS;
        resources: typeof resources['pl'];
    }
}
