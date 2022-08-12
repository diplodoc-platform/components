import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import {Lang} from '../models';

import ru from './ru.json';
import en from './en.json';

export default i18n.use(initReactI18next).init({
    fallbackLng: Lang.En,
    ns: ['controls', 'mini-toc', 'toc-nav-panel', 'authors'],
    resources: {ru, en},
    interpolation: {
        escapeValue: false,
    },
});
