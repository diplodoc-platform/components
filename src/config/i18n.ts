// @ts-nocheck
import type {TFunction} from 'i18next';

import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';

import locales from '../i18n';
import {Lang} from '../models';

export type Loc = Record<string, typeof locales.en>;

export interface I18NConfig {
    lang?: string;
    loc?: Loc;
}

let initializePromise: Promise<TFunction> | null = null;

export const configureI18N = ({lang, loc}: I18NConfig) => {
    if (initializePromise === null) {
        lang = lang || Lang.En;
        loc =
            loc ||
            Object.keys(locales).reduce(
                (acc, lng) => ({...acc, [lng]: JSON.parse(locales[lng] as unknown as string)}),
                {},
            );

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
