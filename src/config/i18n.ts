import i18n, {TFunction} from 'i18next';
import {initReactI18next} from 'react-i18next';

import {Lang} from '../models';

import ar from '../i18n/ar.json';
import cs from '../i18n/cs.json';
import en from '../i18n/en.json';
import es from '../i18n/es.json';
import fr from '../i18n/fr.json';
import he from '../i18n/he.json';
import ru from '../i18n/ru.json';

export type Loc = Record<string, typeof en>;

export interface I18NConfig {
    lang?: string;
    loc?: Loc;
}

let initializePromise: Promise<TFunction> | null = null;

export const configureI18N = ({lang, loc}: I18NConfig) => {
    if (initializePromise === null) {
        lang = lang || Lang.En;
        loc = loc || {
            ru: JSON.parse(ru as unknown as string),
            en: JSON.parse(en as unknown as string),
            es: JSON.parse(es as unknown as string),
            fr: JSON.parse(fr as unknown as string),
            cs: JSON.parse(cs as unknown as string),
            he: JSON.parse(he as unknown as string),
            ar: JSON.parse(ar as unknown as string),
        };

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
