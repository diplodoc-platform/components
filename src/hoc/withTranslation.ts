import {withTranslation as withTranslationReacti18n} from 'react-i18next';

import {configure} from '../config';

export function withTranslation(namespace: string) {
    configure();

    return withTranslationReacti18n(namespace);
}
