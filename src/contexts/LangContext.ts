import namedContext from './_namedContext';

export enum Lang {
    Ru = 'ru',
    En = 'en',
}

export default namedContext<Lang>('Lang', (process.env.DEFAULT_LANG as Lang) || Lang.En);
