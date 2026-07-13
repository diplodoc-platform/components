import type {VcsType} from '@diplodoc/components';

import {useEffect} from 'react';

import {updateBodyClassName} from '../utils';

import {
    useBookmarks,
    useFeedback,
    useFullscreen,
    useLangs,
    useNotification,
    usePdf,
    useSearchResults,
    useSettings,
    useSinglepage,
    useSubscribe,
} from './hooks';

type LangOption = string | {lang: string; tld?: string; href?: string};

export type StoryArgs = Record<string, unknown> & {
    Pdf: string;
    Search: string;
    VCS: VcsType;
};

export interface UsePagePropsOptions {
    langs?: LangOption[];
    withConsent?: boolean;
}

const ROUTER = {pathname: '/docs/overview/security-and-compliance/'};

export function usePageProps(args: StoryArgs, options: UsePagePropsOptions = {}) {
    const settings = useSettings();
    const langs = useLangs(options.langs);
    const fullscreen = useFullscreen();
    const singlepage = useSinglepage();
    const feedback = useFeedback();
    const subscribe = useSubscribe(options.withConsent);
    const bookmarks = useBookmarks();
    const notification = useNotification();
    const search = useSearchResults(args.Search || '');
    const pdf = usePdf(args.Pdf || '');

    const {theme} = settings;
    useEffect(() => {
        updateBodyClassName(theme);
    }, [theme]);

    const {lang} = langs;
    const {wideFormat, showMiniToc, textSize} = settings;
    const {fullScreen} = fullscreen;
    const {singlePage} = singlepage;
    const mobileView = Boolean(args['Mobile']);

    const base = {
        vcsType: args.VCS,
        router: ROUTER,
        fullScreen,
        wideFormat,
        showMiniToc,
        theme,
        textSize,
        singlePage,
        isMobile: mobileView,
    };

    const overrides = [
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
    ].filter(Boolean);

    return {lang, singlePage, mobileView, base, overrides};
}

export function convertPathToOriginalArticle(path: string) {
    return `prefix/${path.replace(/^\//, '')}`;
}

export function createGeneratePathToVcs(lang: string) {
    return (path: string) => {
        return `https://github.com/yandex-cloud/docs/blob/master/${lang}/${path.replace(/^\//, '')}`;
    };
}

export function renderLoader() {
    return 'Loading...';
}
