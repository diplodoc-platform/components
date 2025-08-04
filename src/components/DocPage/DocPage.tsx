import type {ReactPortal} from 'react';
import type {
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
import type {InnerProps} from '../../utils';
import type {NotificationProps} from '../Notification';

import React from 'react';
import {Link} from '@gravity-ui/icons';
import block from 'bem-cn-lite';
import {createPortal} from 'react-dom';

import {InterfaceContext} from '../../contexts/InterfaceContext';
import {DEFAULT_SETTINGS} from '../../constants';
import {ControlSizes} from '../../models';
import {callSafe, getRandomKey, getStateKey, isContributor} from '../../utils';
import {BookmarkButton} from '../BookmarkButton';
import {Breadcrumbs} from '../Breadcrumbs';
import {ContentWrapper} from '../ContentWrapper';
import Contributors from '../Contributors/Contributors';
import {Controls, ControlsLayout, EditControl} from '../Controls';
import {DocLayout} from '../DocLayout';
import {DocPageTitle} from '../DocPageTitle';
import {Feedback, FeedbackView} from '../Feedback';
import {HTML} from '../HTML';
import {ShareButton} from '../ShareButton';
import {SubNavigation} from '../SubNavigation';
import {SearchBar, withHighlightedSearchWords} from '../SearchBar';
import {TocNavPanel} from '../TocNavPanel';
import UpdatedAtDate from '../UpdatedAtDate/UpdatedAtDate';
import {Notification} from '../Notification';

import RenderBodyWithHooks from './components/RenderBodyWithHooks/RenderBodyWithHooks';
import './DocPage.scss';

const b = block('dc-doc-page');

export interface DocPageProps extends DocPageData, DocSettings, NotificationProps {
    lang: `${Lang}` | Lang;
    langs?: (`${Lang}` | Lang)[];
    router: Router;
    headerHeight?: number;
    tocTitleIcon?: React.ReactNode;
    hideToc?: boolean;
    legacyToc?: boolean;

    showSearchBar?: boolean;
    searchQuery?: string;
    onClickPrevSearch?: () => void;
    onClickNextSearch?: () => void;
    onCloseSearchBar?: () => void;
    onTocNavPanelClick?: (at: 'prev' | 'next') => void;
    searchCurrentIndex?: number;
    searchCountResults?: number;

    hideTocHeader?: boolean;
    hideFeedback?: boolean;
    hideControls?: boolean;
    hideEditControl?: boolean;
    hideFeedbackControls?: boolean;
    hideContributors?: boolean;
    renderLoader?: () => React.ReactNode;
    convertPathToOriginalArticle?: (path: string) => string;
    generatePathToVcs?: (path: string) => string;
    onChangeLang?: (lang: `${Lang}` | Lang) => void;
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
    onMiniTocItemClick?: (event: MouseEvent) => void;
    useMainTag?: boolean;
    isMobile?: boolean;
    viewerInterface?: Record<string, boolean>;
}

type DocPageInnerProps = InnerProps<DocPageProps, DocSettings>;
type DocPageState = {
    loading: boolean;
    keyDOM: number;
};

class DocPage extends React.Component<DocPageInnerProps, DocPageState> {
    static defaultProps: DocSettings = DEFAULT_SETTINGS;
    static contextType = InterfaceContext;
    declare context: React.ContextType<typeof InterfaceContext>;

    state: DocPageState;
    bodyRef: HTMLDivElement | null = null;
    bodyObserver: MutationObserver | null = null;

    constructor(props: DocPageInnerProps) {
        super(props);

        this.state = {
            loading: props.singlePage,
            keyDOM: getRandomKey(),
        };
    }

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
            headings,
            lang,
            langs,
            theme,
            title,
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
            useMainTag,
            onChangeLang,
            onChangeTheme,
            onMiniTocItemClick,
            legacyToc,
            notification,
            notificationCb,
        } = this.props;

        const hideBurger = typeof headerHeight !== 'undefined' && headerHeight > 0;

        const modes = {
            'regular-page-width': !wideFormat,
            'full-screen': fullScreen,
            'single-page': singlePage,
        };

        const mobileControlsData = {
            controlSize: ControlSizes.L,
            lang,
            userSettings: {
                langs,
                onChangeLang,
                theme,
                onChangeTheme,
            },
        };

        return (
            <DocLayout
                toc={toc}
                router={router}
                headerHeight={headerHeight}
                className={b(modes)}
                fullScreen={fullScreen}
                tocTitleIcon={tocTitleIcon}
                wideFormat={wideFormat}
                hideTocHeader={hideTocHeader}
                hideToc={hideToc}
                loading={this.state.loading}
                footer={footer}
                singlePage={singlePage}
                onChangeSinglePage={onChangeSinglePage}
                pdfLink={pdfLink}
                legacyToc={legacyToc}
            >
                <DocLayout.Center>
                    {this.renderSearchBar()}
                    <Notification notification={notification} notificationCb={notificationCb} />
                    {this.renderBreadcrumbs()}
                    {this.renderControls()}
                    <div className={b('main')}>
                        <ContentWrapper className={b('content')} useMainTag={useMainTag}>
                            {this.renderTitle()}
                            {this.renderPageContributors()}
                            {this.showMiniToc && this.renderContentMiniToc()}
                            {this.renderBody()}
                            {this.renderFeedback()}
                        </ContentWrapper>
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
                        <SubNavigation
                            router={router}
                            toc={toc}
                            tocTitleIcon={tocTitleIcon}
                            keyDOM={this.state.keyDOM}
                            pageTitle={title}
                            headings={headings}
                            mobileControlsData={mobileControlsData}
                            headerHeight={headerHeight}
                            hideMiniToc={!this.showMiniToc}
                            hideBurger={hideBurger}
                            hideTocHeader={hideTocHeader}
                            onMiniTocItemClick={
                                onMiniTocItemClick as unknown as (event: React.MouseEvent) => void
                            }
                        />
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
                    const yfmImages = Array.from(yfmRoot.querySelectorAll('img'));

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
            const anchors = Array.from(header.querySelectorAll('.yfm-anchor'));
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
        const {title, meta, bookmarkedPage, onChangeBookmarkPage, isMobile, headerHeight} =
            this.props;
        const withBookmarks = onChangeBookmarkPage;
        const withShare = isMobile && Number(headerHeight) > 0 && !this.showMiniToc;

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
                {withShare && <ShareButton className={b('share-button')} title={title} />}
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
        const updatedAt = this.renderUpdatedAt(meta?.updatedAt);

        return (
            <div className={b('page-contributors')}>
                {author}
                {contributors}
                {updatedAt}
            </div>
        );
    }

    private renderUpdatedAt(updatedAt?: string) {
        if (!updatedAt) {
            return null;
        }

        return <UpdatedAtDate updatedAt={updatedAt} />;
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
        const {html, mdxArtifacts, textSize} = this.props;

        if (!html) {
            return null;
        }

        return (
            <RenderBodyWithHooks
                forwardRef={this.setBodyRef}
                className={b('body', {'text-size': textSize}, 'yfm')}
                html={html}
                mdxArtifacts={mdxArtifacts}
            />
        );
    }

    private renderFeedback() {
        const {
            singlePage,
            isLiked,
            isDisliked,
            onSendFeedback,
            hideFeedback,
            hideFeedbackControls,
        } = this.props;
        const {isHidden} = this.context;
        const isFeedbackHidden = isHidden('feedback');

        if (
            hideFeedback ||
            isFeedbackHidden ||
            singlePage ||
            hideFeedbackControls ||
            !onSendFeedback
        ) {
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
        const {toc, singlePage, router, fullScreen, onTocNavPanelClick} = this.props;
        const {isHidden} = this.context;
        const isTocHidden = isHidden('toc');

        if (isTocHidden || !toc || singlePage) {
            return null;
        }

        return (
            <TocNavPanel
                {...toc}
                onClick={onTocNavPanelClick}
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
        const {isHidden} = this.context;
        const isTocHidden = isHidden('toc');

        if (isTocHidden || !showSearchBar || singlePage) {
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
