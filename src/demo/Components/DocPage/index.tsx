import React, {useCallback, useState} from 'react';
import cn from 'bem-cn-lite';
import {
    DocPage,
    FeedbackSendData,
    FeedbackType,
    Theme,
} from '../../../index';
import Header from '../Header/Header';
import {DEFAULT_SETTINGS} from '../../../constants';
import {getIsMobile} from '../../controls/settings';
import getLangControl from '../../controls/lang';
import getVcsControl from '../../controls/vcs';
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
    const router = {pathname: '/docs/overview/concepts/quotas-limits'};

    const [fullScreen, onChangeFullScreen] = useState(DEFAULT_SETTINGS.fullScreen);
    const [wideFormat, onChangeWideFormat] = useState(DEFAULT_SETTINGS.wideFormat);
    const [showMiniToc, onChangeShowMiniToc] = useState(DEFAULT_SETTINGS.showMiniToc);
    const [theme, onChangeTheme] = useState(DEFAULT_SETTINGS.theme);
    const [textSize, onChangeTextSize] = useState(DEFAULT_SETTINGS.textSize);
    const [singlePage, onChangeSinglePage] = useState(DEFAULT_SETTINGS.singlePage);
    const [isLiked, setIsLiked] = useState(DEFAULT_SETTINGS.isLiked);
    const [isDisliked, setIsDisliked] = useState(DEFAULT_SETTINGS.isDisliked);
    const [lang, onChangeLang] = useState(langValue);

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

    updateBodyClassName(theme);

    const props = {
        ...getContent(lang, singlePage),
        vcsType,
        lang,
        onChangeLang,
        router,
        headerHeight: fullScreen ? 0 : 64,
        fullScreen,
        onChangeFullScreen,
        wideFormat,
        onChangeWideFormat,
        showMiniToc,
        onChangeShowMiniToc,
        theme,
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
    };


    const tocTitleIcon = (
        <svg width="14" height="12" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* eslint-disable-next-line max-len */}
            <path d="M14 1.714C14 .771 13.213 0 12.25 0c-.962 0-1.75.771-1.75 1.714 0 .6.35 1.2.875 1.457v1.972h-3.5V3.17c.525-.342.875-.857.875-1.457C8.75.771 7.963 0 7 0c-.962 0-1.75.771-1.75 1.714 0 .6.35 1.2.875 1.457v1.972h-3.5V3.17c.525-.342.875-.857.875-1.457C3.5.771 2.713 0 1.75 0 .788 0 0 .771 0 1.714c0 .6.35 1.2.875 1.457v1.972c0 .943.788 1.714 1.75 1.714H3.5V8.83c-.525.342-.875.857-.875 1.457 0 .943.788 1.714 1.75 1.714.963 0 1.75-.771 1.75-1.714 0-.6-.35-1.2-.875-1.457V6.857h3.5V8.83c-.525.342-.875.857-.875 1.457 0 .943.788 1.714 1.75 1.714.963 0 1.75-.771 1.75-1.714 0-.6-.35-1.2-.875-1.457V6.857h.875c.963 0 1.75-.771 1.75-1.714V3.17c.525-.257.875-.857.875-1.457z" fill="#027BF3"/>
        </svg>
    );
    const convertPathToOriginalArticle = (path: string) => join('prefix', path);
    const generatePathToVcs = (path: string) => join(
        `https://github.com/yandex-cloud/docs/blob/master/${props.lang}`,
        path,
    );
    const renderLoader = () => 'Loading...';

    return (
        <div className={isMobile === 'true' ? 'mobile' : 'desktop'}>
            {props.fullScreen ? null :
                <Header
                    lang={lang}
                    fullScreen={fullScreen}
                    onChangeFullScreen={onChangeFullScreen}
                    onChangeLang={onChangeLang}
                />
            }
            <div className={layoutBlock('content')}>
                <DocPage
                    {...props}
                    tocTitleIcon={tocTitleIcon}
                    convertPathToOriginalArticle={convertPathToOriginalArticle}
                    generatePathToVcs={generatePathToVcs}
                    renderLoader={renderLoader}
                />
            </div>
        </div>
    );
};

export default DocPageDemo;
