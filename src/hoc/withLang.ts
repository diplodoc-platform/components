import LangContext, {ContextLang} from '../contexts/LangContext';

import withPropContext from './_withContext';

export interface WithLangProps {
    lang: ContextLang;
}

export default withPropContext<WithLangProps>('lang', LangContext);
