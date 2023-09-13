import block from 'bem-cn-lite';
import React from 'react';
import ReactDOMServer from 'react-dom/server';

import {DEFAULT_SETTINGS} from '../../constants';
import {
    DocPageData,
    DocSettings,
    FeedbackSendData,
    Lang,
    Router,
    SubscribeData,
    TextSizes,
    Theme,
    Vcs,
} from '../../models';
import {
    InnerProps,
    callSafe,
    createElementFromHTML,
    getHeaderTag,
    getRandomKey,
    getStateKey,
    isContributor,
} from '../../utils';
import {BookmarkButton} from '../BookmarkButton';
import {Breadcrumbs} from '../Breadcrumbs';
import Contributors from '../Contributors/Contributors';
import {Controls, ControlsLayout, EditControl} from '../Controls';
import {DocLayout} from '../DocLayout';
import {DocPageTitle} from '../DocPageTitle';
import {Feedback, FeedbackView} from '../Feedback';
import {HTML} from '../HTML';
import {MiniToc} from '../MiniToc';
import {SearchBar, withHighlightedSearchWords} from '../SearchBar';
import {TocNavPanel} from '../TocNavPanel';

// TODO(V3): replace with gravity-ui
const LinkIcon = `
    <svg width="14" height="14" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M13.294 2.214 11.767.684c-.911-.912-2.499-.912-3.41 0L6.83 2.214a2.412 2.412 0 0 0-.147 3.233L7.936 4.19a.66.66 0 0 1 .132-.738l1.527-1.53a.658.658 0 0 1 .934 0l1.527 1.53a.664.664 0 0 1 0 .936l-1.527 1.53a.68.68 0 0 1-.734.129L8.54 7.306c.43.356.958.559 1.523.559.644 0 1.249-.251 1.705-.707l1.527-1.53a2.42 2.42 0 0 0 0-3.414zM9.532 5.69a.876.876 0 0 0-1.237-1.239l-.082.082-1.238 1.24-1.189 1.19-1.237 1.24-.082.082a.876.876 0 0 0 1.237 1.24l.082-.083 1.238-1.239 1.189-1.191 1.237-1.24.082-.082zm-3.601 4.833c.2-.2.24-.494.131-.738L7.316 8.53a2.412 2.412 0 0 1-.148 3.233l-1.527 1.529A2.392 2.392 0 0 1 3.937 14c-.645 0-1.25-.25-1.705-.707l-1.527-1.53a2.421 2.421 0 0 1 0-3.415L2.232 6.82c.854-.856 2.299-.898 3.227-.146L4.207 7.927a.65.65 0 0 0-.737.131l-1.528 1.53a.664.664 0 0 0 0 .936l1.527 1.53a.68.68 0 0 0 .935 0l1.527-1.53z" fill="currentColor"/>
    </svg>
`;

import './DocPage.scss';

const b = block('dc-doc-page');

export interface DocPageProps extends DocPageData, DocSettings {
    lang: Lang;
    langs?: string[];
    router: Router;
    headerHeight?: number;
    tocTitleIcon?: React.ReactNode;
    hideToc?: boolean;

    showSearchBar?: boolean;
    searchQuery?: string;
    onClickPrevSearch?: () => void;
    onClickNextSearch?: () => void;
    onCloseSearchBar?: () => void;
    searchCurrentIndex?: number;
    searchCountResults?: number;

    hideTocHeader?: boolean;
    hideControls?: boolean;
    hideEditControl?: boolean;
    hideFeedbackControls?: boolean;
    hideContributors?: boolean;
    renderLoader?: () => React.ReactNode;
    convertPathToOriginalArticle?: (path: string) => string;
    generatePathToVcs?: (path: string) => string;
    onChangeLang?: (lang: Lang) => void;
    onChangeFullScreen?: (value: boolean) => void;
    onChangeSinglePage?: (value: boolean) => void;
    onChangeWideFormat?: (value: boolean) => void;
    onChangeShowMiniToc?: (value: boolean) => void;
    onChangeBookmarkPage?: (value: boolean) => void;
    onChangeTheme?: (theme: Theme) => void;
    onChangeTextSize?: (textSize: TextSizes) => void;
    onSendFeedback?: (data: FeedbackSendData) => void;
    onContentMutation?: () => void;
    onContentLoaded?: () => void;
    onSubscribe?: (data: SubscribeData) => void;
    pdfLink?: string;
}

type DocPageInnerProps = InnerProps<DocPageProps, DocSettings>;
type DocPageState = {
    loading: boolean;
    keyDOM: number;
};

class DocPage extends React.Component<DocPageInnerProps, DocPageState> {
    static defaultProps: DocSettings = DEFAULT_SETTINGS;

    state: DocPageState = {
        loading: true,
        keyDOM: getRandomKey(),
    };

    bodyRef: HTMLDivElement | null = null;
    bodyObserver: MutationObserver | null = null;

    componentDidMount(): void {
        const {singlePage} = this.props;

        if (singlePage) {
            this.addLinksToOriginalArticle();
        }

        this.setState({loading: false});

        this.addBodyObserver();
    }

    componentDidUpdate(prevProps: DocPageInnerProps): void {
        if (prevProps.singlePage !== this.props.singlePage) {
            this.setState({loading: true});
        }

        if (prevProps.html !== this.props.html) {
            this.setState({keyDOM: getRandomKey()});
        }
    }

    componentWillUnmount(): void {
        if (this.bodyObserver) {
            this.bodyObserver.disconnect();
        }
    }

    render() {
        const {
            toc,
            router,
            headerHeight,
            wideFormat,
            fullScreen,
            singlePage,
            tocTitleIcon,
            hideTocHeader,
            hideToc,
            footer,
            onChangeSinglePage,
            pdfLink,
        } = this.props;

        const hideMiniToc = !this.showMiniToc;
        const modes = {
            'regular-page-width': !wideFormat,
            'full-screen': fullScreen,
            'hidden-mini-toc': hideMiniToc,
            'single-page': singlePage,
        };

        return (
            <DocLayout
                toc={toc}
                router={router}
                headerHeight={headerHeight}
                className={b(modes)}
                fullScreen={fullScreen}
                hideRight={hideMiniToc}
                tocTitleIcon={tocTitleIcon}
                wideFormat={wideFormat}
                hideTocHeader={hideTocHeader}
                hideToc={hideToc}
                loading={this.state.loading}
                footer={footer}
                singlePage={singlePage}
                onChangeSinglePage={onChangeSinglePage}
                pdfLink={pdfLink}
            >
                <DocLayout.Center>
                    {this.renderSearchBar()}
                    {this.renderBreadcrumbs()}
                    {this.renderControls()}
                    <div className={b('main')}>
                        <main className={b('content')}>
                            {this.renderTitle()}
                            {this.renderPageContributors()}
                            {hideMiniToc ? null : this.renderContentMiniToc()}
                            {this.renderBody()}
                            {this.renderFeedback()}
                        </main>
                        {this.renderTocNavPanel()}
                    </div>
                    {this.renderLoader()}
                </DocLayout.Center>
                <DocLayout.Right>
                    {/* This key allows recalculating the offset for the mini-toc for Safari */}
                    <div
                        className={b('aside')}
                        key={getStateKey(this.showMiniToc, wideFormat, singlePage)}
                    >
                        {hideMiniToc ? null : this.renderAsideMiniToc()}
                    </div>
                </DocLayout.Right>
            </DocLayout>
        );
    }

    private handleBodyMutation = (mutationsList: MutationRecord[]) => {
        const {onContentMutation, onContentLoaded} = this.props;

        if (this.props.singlePage && this.bodyObserver && this.bodyRef) {
            this.bodyObserver.disconnect();
            this.addLinksToOriginalArticle();
            this.bodyObserver.observe(this.bodyRef, {
                childList: true,
                subtree: true,
            });
        }

        if (onContentMutation) {
            setTimeout(onContentMutation, 0);
        }

        this.setState({loading: false});

        if (!onContentLoaded) {
            return;
        }

        setTimeout(() => {
            mutationsList
                .filter(({type}) => type === 'childList')
                .forEach((mutation) => {
                    const yfmRoot = mutation.target as HTMLElement;
                    const yfmImages = [...yfmRoot.querySelectorAll('img')];

                    yfmImages.forEach((img) => {
                        img.addEventListener('load', onContentLoaded, false);
                    });
                });
        }, 0);
    };

    private addBodyObserver() {
        if (!this.bodyObserver) {
            this.bodyObserver = new MutationObserver(this.handleBodyMutation);
        }

        if (this.bodyRef) {
            this.bodyObserver.observe(this.bodyRef, {
                childList: true,
                subtree: true,
            });
        }
    }

    private setBodyRef = (ref: HTMLDivElement) => {
        this.bodyRef = ref;
    };

    private renderLoader() {
        const {renderLoader} = this.props;
        const {loading} = this.state;

        if (!renderLoader || !loading) {
            return null;
        }

        return <div className={b('loader-wrapper')}>{renderLoader()}</div>;
    }

    private addLinksToOriginalArticle = () => {
        const {singlePage, convertPathToOriginalArticle, generatePathToVcs, vcsType} = this.props;

        if (singlePage) {
            const elements = document.querySelectorAll('[data-original-article]');
            for (const el of elements) {
                const href = el.getAttribute('data-original-article') || '';
                const linkWrapperEl = getHeaderTag(el as HTMLElement);

                if (linkWrapperEl) {
                    /* Hide anchors */
                    const anchors = linkWrapperEl.querySelectorAll('.yfm-anchor');
                    for (const anchor of anchors) {
                        anchor.classList.add('yfm-anchor_hidden');
                    }

                    /* Create the link to the original article */
                    const linkToOriginal = document.createElement('a');
                    linkToOriginal.href = callSafe(convertPathToOriginalArticle, href);
                    linkToOriginal.className = 'yfm-anchor yfm-original-link';
                    linkToOriginal.innerHTML = LinkIcon;
                    linkWrapperEl.append(linkToOriginal);

                    /* Create the link to the vcs */
                    if (typeof generatePathToVcs === 'function') {
                        const vcsHref = callSafe(generatePathToVcs, href);
                        const linkToVcs = createElementFromHTML(
                            ReactDOMServer.renderToStaticMarkup(
                                <EditControl
                                    vcsUrl={vcsHref}
                                    vcsType={vcsType}
                                    view={'wide'}
                                    className={b('edit-button')}
                                />,
                            ),
                        );
                        linkWrapperEl.append(linkToVcs);
                        linkWrapperEl.classList.add(b('header-container'));
                    }
                }
            }
        }
    };

    get showMiniToc() {
        const {showMiniToc, singlePage, headings, toc} = this.props;

        if (singlePage) {
            return false;
        }

        const emptyHeaderOrSinglePage = headings.length === 0 || toc.singlePage;
        const soloHeaderWithChildren =
            headings.length === 1 && headings[0].items && headings[0].items.length >= 1;

        if (emptyHeaderOrSinglePage || !(soloHeaderWithChildren || headings.length >= 2)) {
            return false;
        }

        return showMiniToc;
    }

    private renderBreadcrumbs() {
        const {breadcrumbs} = this.props;

        if (!breadcrumbs || breadcrumbs.length < 2) {
            return null;
        }

        return (
            <div className={b('breadcrumbs')}>
                <Breadcrumbs items={breadcrumbs} />
            </div>
        );
    }

    private renderTitle() {
        const {title, meta, bookmarkedPage, onChangeBookmarkPage} = this.props;
        const withBookmarks = onChangeBookmarkPage;

        if (!title) {
            return null;
        }

        return (
            <DocPageTitle stage={meta.stage} className={b('title')}>
                <HTML>{title}</HTML>
                {withBookmarks && (
                    <BookmarkButton
                        isBookmarked={Boolean(bookmarkedPage)}
                        onBookmark={onChangeBookmarkPage}
                    />
                )}
            </DocPageTitle>
        );
    }

    private renderPageContributors() {
        const {meta, hideContributors} = this.props;

        if (hideContributors) {
            return null;
        }

        const author = this.renderAuthor(!meta?.contributors?.length);
        const contributors = this.renderContributors();

        const separator = author && contributors && <div className={b('separator')}>{','}</div>;

        return (
            <div className={b('page-contributors')}>
                {author} {separator} {contributors}
            </div>
        );
    }

    private renderAuthor(onlyAuthor: boolean) {
        const {meta} = this.props;

        if (!isContributor(meta?.author)) {
            return null;
        }

        return (
            <Contributors
                users={[meta.author]}
                onlyAuthor={onlyAuthor}
                translationName={'authors'}
                isAuthor={true}
            />
        );
    }

    private renderContributors() {
        const {meta} = this.props;

        if (!meta?.contributors || meta.contributors.length === 0) {
            return null;
        }

        return <Contributors users={meta.contributors} />;
    }

    private renderContentMiniToc() {
        const {headings} = this.props;

        return (
            <div className={b('content-mini-toc', 'yfm')}>
                <ul>
                    {headings.map(({title, href, level, items}, index) => {
                        if (level !== 2) {
                            return null;
                        }

                        return (
                            <li key={index}>
                                <a href={href}>{title}</a>
                                {items && (
                                    <ul>
                                        {items.map(
                                            (
                                                {
                                                    title: itemTitle,
                                                    href: itemHref,
                                                    level: itemLevel,
                                                },
                                                idx,
                                            ) => {
                                                if (itemLevel !== 3) {
                                                    return null;
                                                }

                                                return (
                                                    <li key={idx}>
                                                        <a href={itemHref}>{itemTitle}</a>
                                                    </li>
                                                );
                                            },
                                        )}
                                    </ul>
                                )}
                            </li>
                        );
                    })}
                </ul>
            </div>
        );
    }

    private renderBody() {
        const {html, textSize} = this.props;

        if (!html) {
            return null;
        }

        return (
            <div
                ref={this.setBodyRef}
                className={b('body', {'text-size': textSize}, 'yfm')}
                dangerouslySetInnerHTML={{__html: html}}
            />
        );
    }

    private renderAsideMiniToc() {
        const {headings, router, headerHeight} = this.props;
        const {keyDOM} = this.state;

        return (
            <div className={b('aside-mini-toc')}>
                <MiniToc
                    headings={headings}
                    router={router}
                    headerHeight={headerHeight}
                    key={keyDOM}
                />
            </div>
        );
    }

    private renderFeedback() {
        const {singlePage, isLiked, isDisliked, onSendFeedback, hideFeedbackControls} = this.props;

        if (singlePage || hideFeedbackControls || !onSendFeedback) {
            return null;
        }

        return (
            <div className={b('feedback')}>
                <Feedback
                    isLiked={isLiked}
                    isDisliked={isDisliked}
                    onSendFeedback={onSendFeedback}
                    view={FeedbackView.Wide}
                />
            </div>
        );
    }

    private renderTocNavPanel() {
        const {toc, singlePage, router, fullScreen} = this.props;

        if (singlePage) {
            return null;
        }

        return (
            <TocNavPanel
                {...toc}
                router={router}
                fixed={fullScreen}
                className={b('toc-nav-panel')}
            />
        );
    }

    private isEditable() {
        const {toc, meta, vcsUrl, vcsType} = this.props;
        const editable =
            toc.stage !== 'preview' &&
            meta.stage !== 'preview' &&
            meta.editable !== false &&
            toc.editable !== false;

        return Boolean(editable && vcsUrl && vcsType);
    }

    private getIsVerticalView = () => {
        const {fullScreen} = this.props;
        return !this.showMiniToc || fullScreen;
    };

    private renderSearchBar = () => {
        const {
            showSearchBar,
            searchQuery,
            searchCurrentIndex,
            searchCountResults,
            onClickPrevSearch,
            onClickNextSearch,
            onCloseSearchBar,
            singlePage,
        } = this.props;

        if (!showSearchBar || singlePage) {
            return null;
        }

        return (
            <div className={b('search-bar')}>
                <SearchBar
                    searchCurrentIndex={searchCurrentIndex}
                    searchCountResults={searchCountResults}
                    onClickPrevSearch={onClickPrevSearch}
                    onClickNextSearch={onClickNextSearch}
                    onCloseSearchBar={onCloseSearchBar}
                    searchQuery={searchQuery}
                />
            </div>
        );
    };

    private renderControls() {
        const {
            lang,
            langs,
            textSize,
            theme,
            wideFormat,
            fullScreen,
            singlePage,
            vcsUrl,
            vcsType,
            onChangeLang,
            onChangeFullScreen,
            onChangeWideFormat,
            onChangeShowMiniToc,
            onChangeTheme,
            onChangeTextSize,
            onSendFeedback,
            onSubscribe,
            isLiked,
            isDisliked,
            hideControls,
            hideEditControl,
            hideFeedbackControls,
        } = this.props;

        if (hideControls) {
            return null;
        }

        const isVerticalView = this.getIsVerticalView();

        return (
            <div className={b('controls', {vertical: isVerticalView})}>
                <ControlsLayout isVerticalView={isVerticalView}>
                    <Controls
                        lang={lang}
                        langs={langs}
                        textSize={textSize}
                        theme={theme}
                        wideFormat={wideFormat}
                        showMiniToc={this.showMiniToc}
                        fullScreen={fullScreen}
                        singlePage={singlePage}
                        vcsUrl={vcsUrl as string}
                        vcsType={vcsType as Vcs}
                        isLiked={isLiked}
                        isDisliked={isDisliked}
                        onChangeLang={onChangeLang}
                        onChangeFullScreen={onChangeFullScreen}
                        onChangeWideFormat={onChangeWideFormat}
                        onChangeShowMiniToc={onChangeShowMiniToc}
                        onChangeTheme={onChangeTheme}
                        onChangeTextSize={onChangeTextSize}
                        onSendFeedback={onSendFeedback}
                        onSubscribe={onSubscribe}
                        hideEditControl={hideEditControl || fullScreen || !this.isEditable()}
                        hideFeedbackControls={hideFeedbackControls}
                    />
                </ControlsLayout>
            </div>
        );
    }
}

export default withHighlightedSearchWords(DocPage);
