import {Lang, TextSizes, Theme} from './models';
import langs from './i18n';

export const DEFAULT_SETTINGS = {
    fullScreen: false,
    singlePage: false,
    wideFormat: false,
    showMiniToc: true,
    bookmarkedPage: false,
    lang: Lang.En,
    theme: Theme.Dark,
    textSize: TextSizes.M,
    isLiked: false,
    isDisliked: false,
    isPinned: false,
    notification: false,
};

export const ERROR_CODES = {
    ACCESS_DENIED: 403,
    NOT_FOUND: 404,
    SERVER_ERROR: 500,
};

export const DEFAULT_LANGS = ['en', 'ru', 'he'];
export const LEGACY_LANG_ITEMS = [
    {value: Lang.Ru, text: 'Русский'},
    {value: Lang.En, text: 'English'},
    {value: Lang.He, text: 'Hebrew'},
];
export const SUPPORTED_LANGS = Object.keys(langs);
