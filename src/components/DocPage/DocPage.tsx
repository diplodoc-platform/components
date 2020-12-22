import React from 'react';
import ReactDOMServer from 'react-dom/server';
import block from 'bem-cn-lite';
import '@doc-tools/transform/dist/js/yfm';

import {DocPageData, Lang, Router, Theme, DocSettings, TextSizes, Vcs} from '../../models';
import {DocLayout} from '../DocLayout';
import {DocPageTitle} from '../DocPageTitle';
import {MiniToc} from '../MiniToc';
import {HTML} from '../HTML';
import {Breadcrumbs} from '../Breadcrumbs';
import {TocNavPanel} from '../TocNavPanel';
import {Controls} from '../Controls';
import {EditButton} from '../EditButton';

import {getStateKey, InnerProps, callSafe, getHeaderTag, createElementFromHTML} from '../../utils';
import {DEFAULT_SETTINGS} from '../../constants';

import LinkIcon from '../../../assets/icons/link.svg';

import '@doc-tools/transform/dist/css/yfm.css';
import './DocPage.scss';

const b = block('dc-doc-page');

export interface DocPageProps extends DocPageData, Partial<DocSettings> {
    lang: Lang;
    router: Router;
    headerHeight?: number;
    tocTitleIcon?: React.ReactNode;
    hideTocHeader?: boolean;

    renderLoader?: () => React.ReactNode;
    convertPathToOriginalArticle?: (path: string) => string;
    generatePathToVcs?: (path: string) => string;
    onChangeLang?: (lang: Lang) => void;
    onChangeFullScreen?: (value: boolean) => void;
    onChangeSinglePage?: (value: boolean) => void;
    onChangeWideFormat?: (value: boolean) => void;
    onChangeShowMiniToc?: (value: boolean) => void;
    onChangeTheme?: (theme: Theme) => void;
    onChangeTextSize?: (textSize: TextSizes) => void;
}

type DocPageInnerProps = InnerProps<DocPageProps, DocSettings>;
type DocPageState = {
    loading: boolean;
};

class DocPage extends React.Component<DocPageInnerProps, DocPageState> {
    static defaultProps: DocSettings = DEFAULT_SETTINGS;

    state: DocPageState = {
        loading: false,
    };

    bodyRef: HTMLDivElement | null = null;
    bodyObserver: MutationObserver | null = null;

    componentDidMount(): void {
        if (this.props.singlePage) {
            this.addLinksToOriginalArticle();
        }

        this.addBodyObserver();
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
            lang,
            headerHeight,
            wideFormat,
            fullScreen,
            singlePage,
            tocTitleIcon,
            hideTocHeader,
        } = this.props;

        const asideMiniToc = this.renderAsideMiniToc();
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
                lang={lang}
                headerHeight={headerHeight}
                className={b(modes)}
                fullScreen={fullScreen}
                hideRight={hideMiniToc}
                tocTitleIcon={tocTitleIcon}
                wideFormat={wideFormat}
                hideTocHeader={hideTocHeader}
                loading={this.state.loading}
            >
                <DocLayout.Center>
                    {this.renderBreadcrumbs()}
                    {this.renderControls()}
                    <div className={b('main')}>
                        <main className={b('content')}>
                            {this.renderTitle()}
                            {hideMiniToc ? null : this.renderContentMiniToc()}
                            {this.renderBody()}
                        </main>
                        {this.renderTocNavPanel()}
                    </div>
                    {this.renderLoader()}
                </DocLayout.Center>
                <DocLayout.Right>
                    {/* This key allows recalculating the offset for the mini-toc for Safari */}
                    <div className={b('aside')} key={getStateKey(this.showMiniToc, wideFormat, singlePage)}>
                        {asideMiniToc}
                    </div>
                </DocLayout.Right>
            </DocLayout>
        );
    }

    private handleBodyMutation = () => {
        this.setState({loading: false});

        if (this.props.singlePage) {
            this.bodyObserver!.disconnect();
            this.addLinksToOriginalArticle();
            this.bodyObserver!.observe(this.bodyRef!, {
                childList: true,
                subtree: true,
            });
        }
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

        return (
            <div className={b('loader-wrapper')}>
                {renderLoader()}
            </div>
        );
    }

    private addLinksToOriginalArticle = () => {
        const {
            singlePage,
            lang,
            convertPathToOriginalArticle,
            generatePathToVcs,
        } = this.props;

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
                    linkToOriginal.innerHTML = ReactDOMServer.renderToStaticMarkup(<LinkIcon/>);
                    linkWrapperEl.append(linkToOriginal);

                    /* Create the link to the vcs */
                    if (typeof generatePathToVcs === 'function') {
                        const vcsHref = callSafe(generatePathToVcs, href);
                        const linkToVcs = createElementFromHTML(ReactDOMServer.renderToStaticMarkup(
                            <EditButton lang={lang} href={vcsHref}/>,
                        ));
                        linkWrapperEl.append(linkToVcs);
                        linkWrapperEl.classList.add(b('header-container'));
                    }
                }
            }
        }
    };

    get showMiniToc() {
        const {showMiniToc, singlePage} = this.props;

        if (singlePage) {
            return false;
        }

        return showMiniToc;
    }

    get isSinglePageSupported() {
        const {onChangeSinglePage} = this.props;
        return typeof onChangeSinglePage === 'function';
    }

    private renderBreadcrumbs() {
        const {breadcrumbs} = this.props;

        if (!breadcrumbs || breadcrumbs.length === 0) {
            return null;
        }

        return (
            <div className={b('breadcrumbs')}>
                <Breadcrumbs items={breadcrumbs}/>
            </div>
        );
    }

    private renderTitle() {
        const {title, meta} = this.props;

        if (!title) {
            return null;
        }

        return (
            <DocPageTitle stage={meta.stage} className={b('title')}>
                <HTML>{title}</HTML>
            </DocPageTitle>
        );
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
                                        {items.map(({
                                            title: itemTitle, href: itemHref, level: itemLevel,
                                        }, idx) => {
                                            if (itemLevel !== 3) {
                                                return null;
                                            }

                                            return (
                                                <li key={idx}>
                                                    <a href={itemHref}>{itemTitle}</a>
                                                </li>
                                            );
                                        })}
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
        const {headings, router, headerHeight, lang, toc} = this.props;

        if (headings.length < 2 || toc.singlePage) {
            return null;
        }

        return (
            <div className={b('aside-mini-toc')}>
                <MiniToc headings={headings} router={router} headerHeight={headerHeight} lang={lang}/>
            </div>
        );
    }

    private renderTocNavPanel() {
        const {toc, router, fullScreen, lang} = this.props;

        if (!toc || toc.singlePage) {
            return null;
        }

        return (
            <TocNavPanel
                {...toc}
                lang={lang}
                router={router}
                fixed={fullScreen}
                className={b('toc-nav-panel')}
            />
        );
    }

    private isEditable() {
        const {toc, meta, vcsUrl, vcsType} = this.props;
        const editable = (
            toc.stage !== 'preview' &&
            meta.stage !== 'preview' &&
            meta.editable !== false &&
            toc.editable !== false
        );

        return Boolean(editable && vcsUrl && vcsType);
    }

    private onChangeSinglePage = (value: boolean) => {
        const {onChangeSinglePage} = this.props;

        this.setState({loading: true}, () => {
            if (typeof onChangeSinglePage === 'function') {
                onChangeSinglePage(value);
            }
        });
    };

    private renderControls() {
        const {
            lang,
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
        } = this.props;

        const showEditControl = !fullScreen && this.isEditable();
        const verticalView = !this.showMiniToc || fullScreen;
        const onChangeSinglePage = this.isSinglePageSupported ? this.onChangeSinglePage : undefined;

        return (
            <div className={b('controls', {vertical: verticalView})}>
                <Controls
                    lang={lang}
                    textSize={textSize}
                    theme={theme}
                    wideFormat={wideFormat}
                    showMiniToc={this.showMiniToc}
                    fullScreen={fullScreen}
                    singlePage={singlePage}
                    onChangeLang={onChangeLang}
                    vcsUrl={vcsUrl as string}
                    vcsType={vcsType as Vcs}
                    showEditControl={showEditControl}
                    onChangeFullScreen={onChangeFullScreen}
                    onChangeSinglePage={onChangeSinglePage}
                    onChangeWideFormat={onChangeWideFormat}
                    onChangeShowMiniToc={onChangeShowMiniToc}
                    onChangeTheme={onChangeTheme}
                    onChangeTextSize={onChangeTextSize}
                    verticalView={verticalView}
                />
            </div>
        );
    }
}

export default DocPage;
