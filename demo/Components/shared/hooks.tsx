/* eslint-disable no-console */
import type {FeedbackSendData, Lang, Theme} from '@diplodoc/components';

import {useCallback, useEffect, useState} from 'react';
import {configure as configureUikit} from '@gravity-ui/uikit';
import {DEFAULT_SETTINGS, FeedbackType, configure as configureDocs} from '@diplodoc/components';

import {updateBodyClassName} from '../utils';

type LangOption = string | {lang: string; tld?: string; href?: string};

const DEFAULT_LANGS: LangOption[] = ['ru', 'en', 'cs', 'he'];

export function useSettings() {
    const [wideFormat, setWideFormat] = useState(DEFAULT_SETTINGS.wideFormat);
    const [showMiniToc, setShowMiniToc] = useState(DEFAULT_SETTINGS.showMiniToc);
    const [theme, setTheme] = useState(DEFAULT_SETTINGS.theme);
    const [textSize, setTextSize] = useState(DEFAULT_SETTINGS.textSize);

    return {
        wideFormat,
        onChangeWideFormat: setWideFormat,
        theme,
        onChangeTheme: (themeValue: Theme) => {
            updateBodyClassName(themeValue);
            setTheme(themeValue);
        },
        showMiniToc,
        onChangeShowMiniToc: setShowMiniToc,
        textSize,
        onChangeTextSize: setTextSize,
        onMiniTocItemClick: (event: MouseEvent) => {
            console.log((event.target as HTMLAnchorElement).hash);
        },
    };
}

export function useLangs(langs: LangOption[] = DEFAULT_LANGS) {
    const [lang, setLang] = useState(DEFAULT_SETTINGS.lang);

    useEffect(() => {
        if (lang === 'he') {
            document.dir = 'rtl';
        } else {
            document.dir = 'ltr';
        }
    }, [lang]);

    return {
        lang,
        langs,
        onChangeLang(value: Lang) {
            setLang(value);
            configureUikit({lang: value as 'en'});
            configureDocs({lang: value});
        },
    };
}

export function useFullscreen() {
    const [fullScreen, setFullScreen] = useState(DEFAULT_SETTINGS.fullScreen);

    return {
        fullScreen,
        onChangeFullScreen: setFullScreen,
    };
}

export function useSinglepage() {
    const [singlePage, setSinglePage] = useState(DEFAULT_SETTINGS.singlePage);

    return {
        singlePage,
        onChangeSinglePage: setSinglePage,
    };
}

export function useFeedback() {
    const [isLiked, setIsLiked] = useState(DEFAULT_SETTINGS.isLiked);
    const [isDisliked, setIsDisliked] = useState(DEFAULT_SETTINGS.isDisliked);

    const onSendFeedback = useCallback((data: FeedbackSendData) => {
        const {type} = data;

        if (type === FeedbackType.like) {
            setIsLiked(true);
            setIsDisliked(false);
        } else if (type === FeedbackType.dislike) {
            setIsLiked(false);
            setIsDisliked(true);
        } else if (type === FeedbackType.indeterminate) {
            setIsLiked(false);
            setIsDisliked(false);
        }
        // FeedbackType.comment leaves the rating untouched

        console.log('Feedback:', data);
    }, []);

    return {
        isLiked,
        isDisliked,
        onSendFeedback,
    };
}

const CONSENT_CONTENT = (
    <span>
        {'I agree to the processing of my personal data under the '}
        <a href="https://example.com/policy" target="_blank" rel="noopener noreferrer">
            Privacy Policy
        </a>
        {'.'}
    </span>
);

export function useSubscribe(withConsent = false) {
    if (!withConsent) {
        return {onSubscribe: () => {}};
    }

    return {
        onSubscribe: () => {},
        consentContent: CONSENT_CONTENT,
    };
}

export function usePdf(link: string) {
    return {
        pdfLink: link,
    };
}

export function useSearchResults(searchQuery: string) {
    const [showSearchBar, setShowSearchBar] = useState(Boolean(searchQuery.length));
    const [searchWords, setSearchWords] = useState<string[]>([]);

    useEffect(() => {
        const newSearchWords = searchQuery.split(' ').filter((word) => {
            if (!word) {
                return false;
            }

            if (searchQuery.length > 10) {
                return word.length > 3;
            }

            return true;
        });

        setSearchWords(newSearchWords);
    }, [searchQuery]);

    const onNotFoundWords = useCallback(() => {
        console.log(`Not found words for the query: ${searchQuery}`);
    }, [searchQuery]);

    const onCloseSearchBar = useCallback(() => {
        setShowSearchBar(false);
    }, [setShowSearchBar]);

    return {
        searchWords,
        searchQuery,
        showSearchBar,
        onCloseSearchBar,
        onNotFoundWords,
    };
}

export function useBookmarks() {
    const [isPinned, setIsPinned] = useState(DEFAULT_SETTINGS.isPinned as boolean);

    const onChangeBookmarkPage = useCallback((data: boolean) => {
        setIsPinned(data);
        console.log(`This page pinned: ${data}`);
    }, []);

    return {
        bookmarkedPage: isPinned,
        onChangeBookmarkPage,
    };
}

export function useNotification() {
    const notificationCb = useCallback(() => {
        console.log('Notification closed.');
    }, []);

    return {
        notification: {title: 'Notification', content: 'Notification content'},
        notificationCb,
    };
}
