import React, {ReactPortal} from 'react';

import {Link} from '@gravity-ui/icons';
import block from 'bem-cn-lite';
import {createPortal} from 'react-dom';

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
    VcsType,
} from '../../models';
import {InnerProps, callSafe, getRandomKey, getStateKey, isContributor} from '../../utils';
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
                    {this.renderSinglePageControls()}
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

    private renderSinglePageControls() {
        const {singlePage, convertPathToOriginalArticle, generatePathToVcs, vcsType} = this.props;

        if (!this.bodyRef || !singlePage) {
            return null;
        }

        const headers = Array.from(this.bodyRef.querySelectorAll('[data-original-article]'));

        return headers.reduce((acc, header, index) => {
            const href = callSafe(
                convertPathToOriginalArticle,
                header.getAttribute('data-original-article') || '',
            );

            if (href && header) {
                const vcsHref = callSafe(generatePathToVcs, href);

                acc.push(
                    createPortal(
                        <>
                            <a className="yfm-anchor yfm-original-link" href={href}>
                                <Link />
                            </a>
                            {vcsHref && (
                                <EditControl
                                    vcsUrl={vcsHref}
                                    vcsType={vcsType}
                                    view={'wide'}
                                    className={b('edit-button')}
                                />
                            )}
                        </>,
                        header,
                        'key-' + index,
                    ),
                );
            }

            return acc;
        }, [] as ReactPortal[]);
    }

    private addLinksToOriginalArticle = () => {
        const {singlePage, generatePathToVcs} = this.props;

        if (!this.bodyRef || !singlePage) {
            return;
        }

        const headers = Array.from(this.bodyRef.querySelectorAll('[data-original-article]'));

        for (const header of headers) {
            /* Hide anchors */
            const anchors = header.querySelectorAll('.yfm-anchor');
            for (const anchor of anchors) {
                if (!anchor.classList.contains('yfm-original-link')) {
                    anchor.classList.add('yfm-anchor_hidden');
                }
            }

            /* Create the link to the vcs */
            if (typeof generatePathToVcs === 'function') {
                header.classList.add(b('header-container'));
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

        if (!toc || singlePage) {
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
                        vcsType={vcsType as VcsType}
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
