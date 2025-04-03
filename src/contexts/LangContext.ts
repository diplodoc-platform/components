import namedContext from './_namedContext';

//TODO: replace it with type Lang from models when there is a new major
export enum Lang {
    Ru = 'ru',
    En = 'en',
}

export default namedContext<Lang>('Lang', (process.env.DEFAULT_LANG as Lang) || Lang.En);
