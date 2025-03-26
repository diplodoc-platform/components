import LangContext from '../contexts/LangContext';
import {Lang as ModelsLang} from '../models';

import withPropContext from './_withContext';

export interface WithLangProps {
    lang: ModelsLang;
}

export default withPropContext<WithLangProps>('lang', LangContext);
