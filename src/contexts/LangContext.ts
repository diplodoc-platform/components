import namedContext from './_namedContext';

//TODO: Similar type Lang (from models) already exists. Replace ContextLang when there is a new major.
export enum ContextLang {
    Ru = 'ru',
    En = 'en',
}

export default namedContext<ContextLang>(
    'Lang',
    (process.env.DEFAULT_LANG as ContextLang) || ContextLang.En,
);
