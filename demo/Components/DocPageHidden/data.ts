import {createGetContent} from '../shared/get-content';

import en from './page-en.json';
import he from './page-he.json';
import ru from './page-ru.json';
import singleEn from './single-page-en.json';
import singleRu from './single-page-ru.json';

export const getContent = createGetContent({en, he, ru, singleEn, singleRu});
