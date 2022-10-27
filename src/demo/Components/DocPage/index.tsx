import React, {useCallback, useEffect, useState} from 'react';
import cn from 'bem-cn-lite';
import {configure as configureUikit} from '@gravity-ui/uikit';

import {DocPage, FeedbackSendData, FeedbackType, Theme} from '../../../index';
import Header from '../Header/Header';
import {DEFAULT_SETTINGS, DISLIKE_VARIANTS} from '../../../constants';
import {getIsMobile} from '../../controls/settings';
import getLangControl from '../../controls/lang';
import getVcsControl from '../../controls/vcs';
import {getHasBookmark} from '../../decorators/bookmark';
import {getHasSubscribe} from '../../decorators/subscribe';
import {getContent} from './data';

import {join} from 'path';

const layoutBlock = cn('Layout');

function updateBodyClassName(theme: Theme) {
    const bodyEl = document.body;

    if (!bodyEl.classList.contains('yc-root')) {
        bodyEl.classList.add('yc-root');
    }

    bodyEl.classList.toggle('yc-root_theme_light', theme === 'light');
    bodyEl.classList.toggle('yc-root_theme_dark', theme === 'dark');
}

const DocPageDemo = () => {
    const langValue = getLangControl();
    const vcsType = getVcsControl();
    const isMobile = getIsMobile();
    const hasBookmark = getHasBookmark();
    const hasSubscribe = getHasSubscribe();
    const router = {pathname: '/docs/overview/concepts/quotas-limits'};
    const langs = ['ru', 'en', 'cs'];

    const [fullScreen, onChangeFullScreen] = useState(DEFAULT_SETTINGS.fullScreen);
    const [wideFormat, onChangeWideFormat] = useState(DEFAULT_SETTINGS.wideFormat);
    const [showMiniToc, onChangeShowMiniToc] = useState(DEFAULT_SETTINGS.showMiniToc);
    const [theme, onChangeTheme] = useState(DEFAULT_SETTINGS.theme);
    const [textSize, onChangeTextSize] = useState(DEFAULT_SETTINGS.textSize);
    const [singlePage, onChangeSinglePage] = useState(DEFAULT_SETTINGS.singlePage);
    const [isLiked, setIsLiked] = useState(DEFAULT_SETTINGS.isLiked);
    const [isDisliked, setIsDisliked] = useState(DEFAULT_SETTINGS.isDisliked);
    const [isPinned, setIsPinned] = useState(DEFAULT_SETTINGS.isPinned as boolean);
    const [lang, onChangeLang] = useState(langValue);
    const [showSearchBar, setShowSearchBar] = useState(true);
    const onCloseSearchBar = () => setShowSearchBar(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchWords, setSearchWords] = useState<string[]>([]);

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

    const onChangeBookmarkPage = useCallback((data: boolean) => {
        setIsPinned(data);
        console.log(`This page pinned: ${data}`);
    }, []);

    updateBodyClassName(theme);

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
    const onContentMutation = useCallback(() => {
        console.log('onContentMutation');
    }, []);
    const onContentLoaded = useCallback(() => {
        console.log('onContentLoaded');
    }, []);

    const onChangeLangWrapper = useCallback(
        (lang) => {
            onChangeLang(lang);
            configureUikit({lang});
        },
        [lang],
    );

    const props = {
        ...getContent(lang, singlePage),
        vcsType,
        lang,
        onChangeLang: onChangeLangWrapper,
        langs,
        router,
        headerHeight: fullScreen ? 0 : 64,
        fullScreen,
        onChangeFullScreen,
        wideFormat,
        onChangeWideFormat,
        showMiniToc,
        onChangeShowMiniToc,
        onSubscribe: hasSubscribe === 'true' ? () => {} : undefined,
        theme,
        onNotFoundWords,
        onChangeTheme: (themeValue: Theme) => {
            updateBodyClassName(themeValue);
            onChangeTheme(themeValue);
        },
        textSize,
        onChangeTextSize,
        singlePage,
        onChangeSinglePage,
        isLiked,
        isDisliked,
        onSendFeedback,
        showSearchBar,
        searchWords,
        searchQuery,
        onCloseSearchBar,
        useSearchBar: true,
        bookmarkedPage: hasBookmark === 'true' && isPinned,
        onChangeBookmarkPage: hasBookmark === 'true' ? onChangeBookmarkPage : undefined,
    };

    const tocTitleIcon = (
        <svg width="14" height="12" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* eslint-disable-next-line max-len */}
            <path
                d="M14 1.714C14 .771 13.213 0 12.25 0c-.962 0-1.75.771-1.75 1.714 0 .6.35 1.2.875 1.457v1.972h-3.5V3.17c.525-.342.875-.857.875-1.457C8.75.771 7.963 0 7 0c-.962 0-1.75.771-1.75 1.714 0 .6.35 1.2.875 1.457v1.972h-3.5V3.17c.525-.342.875-.857.875-1.457C3.5.771 2.713 0 1.75 0 .788 0 0 .771 0 1.714c0 .6.35 1.2.875 1.457v1.972c0 .943.788 1.714 1.75 1.714H3.5V8.83c-.525.342-.875.857-.875 1.457 0 .943.788 1.714 1.75 1.714.963 0 1.75-.771 1.75-1.714 0-.6-.35-1.2-.875-1.457V6.857h3.5V8.83c-.525.342-.875.857-.875 1.457 0 .943.788 1.714 1.75 1.714.963 0 1.75-.771 1.75-1.714 0-.6-.35-1.2-.875-1.457V6.857h.875c.963 0 1.75-.771 1.75-1.714V3.17c.525-.257.875-.857.875-1.457z"
                fill="#027BF3"
            />
        </svg>
    );
    const convertPathToOriginalArticle = (path: string) => join('prefix', path);
    const generatePathToVcs = (path: string) =>
        join(`https://github.com/yandex-cloud/docs/blob/master/${props.lang}`, path);
    const renderLoader = () => 'Loading...';
    const onChangeSearch = (value: string) => {
        setShowSearchBar(true);
        setSearchQuery(value);
    };

    return (
        <div className={isMobile === 'true' ? 'mobile' : 'desktop'}>
            {props.fullScreen ? null : (
                <Header
                    lang={lang}
                    fullScreen={fullScreen}
                    searchText={searchQuery}
                    onChangeFullScreen={onChangeFullScreen}
                    onChangeLang={onChangeLang}
                    onChangeSearch={onChangeSearch}
                />
            )}
            <div className={layoutBlock('content')}>
                <DocPage
                    {...props}
                    tocTitleIcon={tocTitleIcon}
                    convertPathToOriginalArticle={convertPathToOriginalArticle}
                    generatePathToVcs={generatePathToVcs}
                    renderLoader={renderLoader}
                    onNotFoundWords={onNotFoundWords}
                    onContentMutation={onContentMutation}
                    onContentLoaded={onContentLoaded}
                    dislikeVariants={DISLIKE_VARIANTS[lang]}
                />
            </div>
        </div>
    );
};

export default DocPageDemo;
