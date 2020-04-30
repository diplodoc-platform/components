import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';

import ru from './ru.json';
import en from './en.json';

i18n
    .use(initReactI18next)
    .init({
        fallbackLng: 'ru',
        preload: ['ru', 'en'],
        ns: ['toc', 'docPage'],
        resources: {ru, en},
        interpolation: {
            escapeValue: false,
        },
    });
