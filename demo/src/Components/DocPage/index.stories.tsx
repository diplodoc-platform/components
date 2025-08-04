/* eslint-disable no-console */
import type {FeedbackSendData, Lang, Theme} from '@diplodoc/components';

import {join} from 'path';
import React, {useCallback, useEffect, useState} from 'react';
import {
    DEFAULT_SETTINGS,
    DocPage,
    FeedbackType,
    VcsType,
    configure as configureDocs,
} from '@diplodoc/components';
import {Icon, configure as configureUikit} from '@gravity-ui/uikit';
import cn from 'bem-cn-lite';
import {SquareListUl} from '@gravity-ui/icons';

import {updateBodyClassName} from '../utils';

import {ServiceLink} from './components/ServiceLink';
import {getContent} from './data';
import './index.scss';

const layoutBlock = cn('Layout');

configureUikit({lang: 'en'});
configureDocs({lang: 'en'});

let tocTitleIcon = (
    <svg width="14" height="12" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* eslint-disable-next-line max-len */}
        <path
            d="M14 1.714C14 .771 13.213 0 12.25 0c-.962 0-1.75.771-1.75 1.714 0 .6.35 1.2.875 1.457v1.972h-3.5V3.17c.525-.342.875-.857.875-1.457C8.75.771 7.963 0 7 0c-.962 0-1.75.771-1.75 1.714 0 .6.35 1.2.875 1.457v1.972h-3.5V3.17c.525-.342.875-.857.875-1.457C3.5.771 2.713 0 1.75 0 .788 0 0 .771 0 1.714c0 .6.35 1.2.875 1.457v1.972c0 .943.788 1.714 1.75 1.714H3.5V8.83c-.525.342-.875.857-.875 1.457 0 .943.788 1.714 1.75 1.714.963 0 1.75-.771 1.75-1.714 0-.6-.35-1.2-.875-1.457V6.857h3.5V8.83c-.525.342-.875.857-.875 1.457 0 .943.788 1.714 1.75 1.714.963 0 1.75-.771 1.75-1.714 0-.6-.35-1.2-.875-1.457V6.857h.875c.963 0 1.75-.771 1.75-1.714V3.17c.525-.257.875-.857.875-1.457z"
            fill="#027BF3"
        />
    </svg>
);

const useSettings = () => {
    const [wideFormat, onChangeWideFormat] = useState(DEFAULT_SETTINGS.wideFormat);
    const [showMiniToc, onChangeShowMiniToc] = useState(DEFAULT_SETTINGS.showMiniToc);
    const [theme, onChangeTheme] = useState(DEFAULT_SETTINGS.theme);
    const [textSize, onChangeTextSize] = useState(DEFAULT_SETTINGS.textSize);

    return {
        wideFormat,
        onChangeWideFormat,
        theme,
        onChangeTheme: (themeValue: Theme) => {
            updateBodyClassName(themeValue);
            onChangeTheme(themeValue);
        },
        showMiniToc,
        onChangeShowMiniToc,
        textSize,
        onChangeTextSize,
        onMiniTocItemClick: (event: MouseEvent) => {
            console.log((event.target as HTMLAnchorElement).hash);
        },
    };
};

const useDirection = (lang: string) => {
    const [dir, onChangeDir] = useState('ltr');

    useEffect(() => {
        if (lang === 'he') {
            onChangeDir('rtl');
        } else {
            onChangeDir('ltr');
        }

        document.dir = dir;
    }, [lang, dir]);
};

const useLangs = () => {
    const langs = ['ru', 'en', 'cs', 'he'];
    const [lang, onChangeLang] = useState(DEFAULT_SETTINGS.lang);
    useDirection(lang);

    return {
        lang,
        langs,
        onChangeLang(value: Lang) {
            onChangeLang(value);
            configureUikit({lang: value as 'en'});
            configureDocs({lang: value});
        },
    };
};

const useFullscreen = () => {
    const [fullScreen, onChangeFullScreen] = useState(DEFAULT_SETTINGS.fullScreen);

    return {
        fullScreen,
        onChangeFullScreen,
    };
};

const useSinglepage = () => {
    const [singlePage, onChangeSinglePage] = useState(DEFAULT_SETTINGS.singlePage);

    return {
        singlePage,
        onChangeSinglePage,
    };
};

const useFeedback = () => {
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
        } else {
            setIsLiked(false);
            setIsDisliked(false);
        }

        console.log('Feedback:', data);
    }, []);

    return {
        isLiked,
        isDisliked,
        onSendFeedback,
    };
};

const useSubscribe = () => {
    return {
        onSubscribe: () => {},
    };
};

const usePdf = (link: string) => {
    return {
        pdfLink: link,
    };
};

const useSearchResults = (searchQuery: string) => {
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
};

const useBookmarks = () => {
    const [isPinned, setIsPinned] = useState(DEFAULT_SETTINGS.isPinned as boolean);
    const onChangeBookmarkPage = useCallback((data: boolean) => {
        setIsPinned(data);
        console.log(`This page pinned: ${data}`);
    }, []);

    return {
        bookmarkedPage: isPinned,
        onChangeBookmarkPage,
    };
};

const useNotification = () => {
    const [showNotification, _setShowNotification] = useState(true);
    const notificationCb = useCallback(() => {
        console.log('Notification closed.');
    }, []);

    if (!showNotification) {
        return false;
    }
    return {
        notification: {title: 'Notification', content: 'Notification content'},
        notificationCb,
    };
};

const DocPageDemo = (
    args: Record<string, boolean> & {Pdf: string; Search: string; VCS: VcsType},
) => {
    const vcsType = args['VCS'];
    const router = {pathname: '/docs/overview/security-and-compliance/'};

    const settings = useSettings();
    const langs = useLangs();
    const fullscreen = useFullscreen();
    const singlepage = useSinglepage();
    const feedback = useFeedback();
    const subscribe = useSubscribe();
    const bookmarks = useBookmarks();
    const notification = useNotification();
    const search = useSearchResults(args['Search'] || '');
    const pdf = usePdf(args['Pdf'] || '');
    const mobileView = Boolean(args['Mobile']);

    const {lang} = langs;
    const {wideFormat, showMiniToc, theme, textSize} = settings;
    const {fullScreen} = fullscreen;
    const {singlePage} = singlepage;
    const content = getContent(lang, singlePage);

    if (content.toc.extraHeader) {
        content.toc.extraHeader = <ServiceLink />;
        tocTitleIcon = <Icon data={SquareListUl} size={16} />;
    }

    useEffect(() => {
        updateBodyClassName(theme);
    }, [theme]);

    const props = {
        ...content,
        vcsType,
        router,
        fullScreen,
        wideFormat,
        showMiniToc,
        theme,
        textSize,
        singlePage,
        isMobile: mobileView,
    };
    Object.assign(
        props,
        ...[
            args['Search'] && search,
            args['Settings'] && settings,
            args['Langs'] && langs,
            args['Fullscreen'] && fullscreen,
            args['Singlepage'] && singlepage,
            args['Feedback'] && feedback,
            args['Subscribe'] && subscribe,
            args['Bookmarks'] && bookmarks,
            args['Notification'] && notification,
            args['Pdf'] && pdf,
        ].filter(Boolean),
    );

    const convertPathToOriginalArticle = (path: string) => join('prefix', path);
    const generatePathToVcs = (path: string) =>
        join(`https://github.com/yandex-cloud/docs/blob/master/${lang}`, path);
    const renderLoader = () => 'Loading...';

    const hideTocHeader = args['HideTocHeader'];
    const hideFeedback = args['HideFeedback'];

    return (
        <div className={layoutBlock('content')}>
            <DocPage
                {...props}
                tocTitleIcon={tocTitleIcon}
                convertPathToOriginalArticle={convertPathToOriginalArticle}
                generatePathToVcs={generatePathToVcs}
                renderLoader={renderLoader}
                hideTocHeader={hideTocHeader}
                hideFeedback={hideFeedback}
                // TODO: return highlight examples
                // onContentMutation={onContentMutation}
                // onContentLoaded={onContentLoaded}
            />
        </div>
    );
};

export default {
    title: 'Pages/Document',
    component: DocPageDemo,
    argTypes: {
        HideTocHeader: {
            control: 'boolean',
        },
        HideFeedback: {
            control: 'boolean',
        },
        Mobile: {
            control: 'boolean',
        },
        Settings: {
            control: 'boolean',
        },
        Langs: {
            control: 'boolean',
        },
        Fullscreen: {
            control: 'boolean',
        },
        Singlepage: {
            control: 'boolean',
        },
        Feedback: {
            control: 'boolean',
        },
        Subscribe: {
            control: 'boolean',
        },
        Bookmarks: {
            control: 'boolean',
        },
        Notification: {
            control: 'boolean',
        },
        VCS: {
            control: 'select',
            options: {
                none: null,
                github: VcsType.Github,
                arcanum: VcsType.Arcanum,
            },
        },
        Search: {
            control: 'text',
        },
        Pdf: {
            control: 'text',
        },
    },
};

export const Document = {
    args: {
        HideTocHeader: false,
        HideFeedback: false,
        Settings: true,
        Langs: true,
        Fullscreen: true,
        Singlepage: true,
        Feedback: true,
        Subscribe: true,
        Bookmarks: true,
        Notification: true,
        VCS: null,
        Search: '',
        Pdf: 'https://doc.yandex-team.ru/help/diy/diy-guide.pdf',
    },
};
