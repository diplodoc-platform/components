import {Lang as ModelsLang} from '../models';

import namedContext from './_namedContext';

//TODO: remove when there is a new major.
export enum Lang {
    Ru = 'ru',
    En = 'en',
}

export default namedContext<ModelsLang>('Lang', (process.env.DEFAULT_LANG as Lang) || Lang.En);
