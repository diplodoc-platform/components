import {Lang, TextSizes, Theme} from './models';

export const DISLIKE_VARIANTS = {
    [Lang.Ru]: [
        'Нет ответа на мой вопрос',
        'Рекомендации не помогли',
        'Содержание не соответствует заголовку',
        'Другое',
    ],
    [Lang.En]: [
        'No answer to my question',
        'Recommendations didn\'t help',
        'The content doesn\'t match the title',
        'Other',
    ],
};

export const DEFAULT_SETTINGS = {
    fullScreen: false,
    singlePage: false,
    wideFormat: false,
    showMiniToc: true,
    theme: Theme.Dark,
    textSize: TextSizes.m,
    isLiked: false,
    isDisliked: false,
    dislikeVariants: DISLIKE_VARIANTS[Lang.Ru],
};
