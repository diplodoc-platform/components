import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';

import en from './en.json';
import ru from './ru.json';

i18n
    .use(initReactI18next)
    .init({
        lng: 'ru',
        resources: {
            ru: {translation: ru},
            en: {translation: en},
        },
        interpolation: {
            escapeValue: false,
        },
    });

export default i18n;
