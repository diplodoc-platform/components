import type {Lang} from '../contexts/LangContext';

import LangContext from '../contexts/LangContext';

import withPropContext from './_withContext';

export interface WithLangProps {
    lang: Lang;
}

export default withPropContext<WithLangProps>('lang', LangContext);
