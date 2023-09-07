import i18n, {TFunction} from 'i18next';
import {initReactI18next} from 'react-i18next';

import en from '../i18n/en.json';
import ru from '../i18n/ru.json';
import {Lang} from '../models';

export type Loc = Record<string, typeof en>;

export interface I18NConfig {
    lang?: string;
    loc?: Loc;
}

let initializePromise: Promise<TFunction> | null = null;

export const configureI18N = ({lang, loc}: I18NConfig) => {
    if (initializePromise === null) {
        lang = lang || Lang.En;
        loc = loc || {ru, en};

        initializePromise = i18n.use(initReactI18next).init({
            lng: lang,
            fallbackLng: lang,
            ns: Object.keys(loc[lang as Lang]),
            resources: loc,
            interpolation: {
                escapeValue: false,
            },
        });
    } else {
        if (lang && lang !== i18n.language) {
            i18n.changeLanguage(lang);
        }

        if (loc) {
            for (const [lng, namespaces] of Object.entries(loc)) {
                for (const [ns, resources] of Object.entries(namespaces as Loc[Lang])) {
                    i18n.addResources(lng, ns, resources);
                }
            }
        }
    }
};
