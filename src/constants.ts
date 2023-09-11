import {Lang, TextSizes, Theme} from './models';

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
};

export const ERROR_CODES = {
    ACCESS_DENIED: 403,
    NOT_FOUND: 404,
    SERVER_ERROR: 500,
};
