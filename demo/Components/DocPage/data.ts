import type {DocPageProps, DocSettings, Lang} from '@diplodoc/components';

import pageContentEn from './page-en.json';
import pageContentHe from './page-he.json';
import pageContentRu from './page-ru.json';
import singlePageContentEn from './single-page-en.json';
import singlePageContentRu from './single-page-ru.json';

type Props = Omit<DocPageProps, keyof DocSettings> &
    Required<Pick<DocPageProps, keyof DocSettings>>;

export const getContent = (lang: Lang, singlePage: boolean): Props => {
    if (singlePage && lang === 'ru') {
        return singlePageContentRu as unknown as Props;
    } else if (singlePage) {
        return singlePageContentEn as unknown as Props;
    }

    if (lang === 'ru') {
        return pageContentRu as unknown as Props;
    } else if (lang === 'he') {
        return pageContentHe as unknown as Props;
    }

    return pageContentEn as unknown as Props;
};
