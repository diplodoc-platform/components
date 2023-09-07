import {useTranslation as useTranslationI18N} from 'react-i18next';

import {configure} from '../config';

export function useTranslation(...args: Parameters<typeof useTranslationI18N>) {
    configure();
    return useTranslationI18N(...args);
}
