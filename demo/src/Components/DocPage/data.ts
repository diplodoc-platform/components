import {Lang} from '../../../../src';

import pageContentEn from './page-en.json';
import pageContentRu from './page-ru.json';
import singlePageContentEn from './single-page-en.json';
import singlePageContentRu from './single-page-ru.json';

export const getContent = (lang: Lang, singlePage: boolean) => {
    if (singlePage && lang === 'ru') {
        return singlePageContentRu;
    } else if (singlePage) {
        return singlePageContentEn;
    }

    if (lang === 'ru') {
        return pageContentRu;
    }

    return pageContentEn;
};
