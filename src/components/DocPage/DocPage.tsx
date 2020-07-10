import React from 'react';
import block from 'bem-cn-lite';
import '@doc-tools/transform/dist/js/yfm';

import {DocPageData, Lang, Router, Theme, DocSettings, TextSizes, Vcs} from '../../models';
import {DocLayout} from '../DocLayout';
import {DocPageTitle} from '../DocPageTitle';
import {MiniToc} from '../MiniToc';
import {HTML} from '../HTML';
import {Breadcrumbs} from '../Breadcrumbs';
import {Controls} from '../Controls';

import {getStateKey, InnerProps} from '../../utils';
import {DEFAULT_SETTINGS} from '../../constants';

import '@doc-tools/transform/dist/css/yfm.css';
import './DocPage.scss';

const b = block('dc-doc-page');

export interface DocPageProps extends DocPageData, Partial<DocSettings> {
    lang: Lang;
    router: Router;
    headerHeight?: number;
    tocTitleIcon?: React.ReactNode;

    onChangeLang?: (lang: Lang) => void;
    onChangeFullScreen?: (value: boolean) => void;
    onChangeLimitTextWidth?: (value: boolean) => void;
    onChangeShowMiniToc?: (value: boolean) => void;
    onChangeTheme?: (theme: Theme) => void;
    onChangeTextSize?: (textSize: TextSizes) => void;
}

type DocPageInnerProps = InnerProps<DocPageProps, DocSettings>;

class DocPage extends React.Component<DocPageInnerProps> {
    static defaultProps: DocSettings = DEFAULT_SETTINGS;

    render() {
        const {
            toc,
            router,
            lang,
            headerHeight,
            limitTextWidth,
            fullScreen,
            showMiniToc,
            tocTitleIcon,
        } = this.props;

        const asideMiniToc = this.renderAsideMiniToc();
        const modes = {
            'limit-width': limitTextWidth,
            'full-screen': fullScreen,
            'hidden-mini-toc': !showMiniToc,
        };

        return (
            <DocLayout
                toc={toc}
                router={router}
                lang={lang}
                headerHeight={headerHeight}
                className={b(modes)}
                fullScreen={fullScreen}
                hideRight={!showMiniToc}
                tocTitleIcon={tocTitleIcon}
                limitTextWidth={limitTextWidth}
            >
                <DocLayout.Center>
                    {this.renderBreadcrumbs()}
                    {this.renderControls()}
                    <div className={b('main')}>
                        <main className={b('content')}>
                            {this.renderTitle()}
                            {showMiniToc ? this.renderContentMiniToc() : null}
                            {this.renderBody()}
                        </main>
                    </div>
                </DocLayout.Center>
                <DocLayout.Right>
                    /* This key allows recalculating the offset for the mini-toc for Safari */
                    <div className={b('aside')} key={getStateKey(showMiniToc, limitTextWidth)}>
                        {asideMiniToc}
                    </div>
                </DocLayout.Right>
            </DocLayout>
        );
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

        return <div className={b('body', {'text-size': textSize}, 'yfm')} dangerouslySetInnerHTML={{__html: html}}/>;
    }

    private renderAsideMiniToc() {
        const {headings, router, headerHeight, lang} = this.props;

        if (headings.length === 0) {
            return null;
        }

        return (
            <div className={b('aside-mini-toc')}>
                <MiniToc headings={headings} router={router} headerHeight={headerHeight} lang={lang}/>
            </div>
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

    private renderControls() {
        const {
            lang,
            textSize,
            theme,
            limitTextWidth,
            showMiniToc,
            fullScreen,
            vcsUrl,
            vcsType,
            onChangeLang,
            onChangeFullScreen,
            onChangeLimitTextWidth,
            onChangeShowMiniToc,
            onChangeTheme,
            onChangeTextSize,
        } = this.props;

        const showEditControl = !fullScreen && this.isEditable();
        const verticalView = !showMiniToc || fullScreen;

        return (
            <div className={b('controls', {vertical: verticalView})}>
                <Controls
                    lang={lang}
                    textSize={textSize}
                    theme={theme}
                    limitTextWidth={limitTextWidth}
                    showMiniToc={showMiniToc}
                    fullScreen={fullScreen}
                    onChangeLang={onChangeLang}
                    vcsUrl={vcsUrl as string}
                    vcsType={vcsType as Vcs}
                    showEditControl={showEditControl}
                    onChangeFullScreen={onChangeFullScreen}
                    onChangeLimitTextWidth={onChangeLimitTextWidth}
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
