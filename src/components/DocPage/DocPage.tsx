import React from 'react';
import block from 'bem-cn-lite';
import 'yfm-transform/dist/js/yfm';

import {DocPageData, Router, Lang} from '../../models';
import {DocLayout} from '../DocLayout';
import {DocPageTitle} from '../DocPageTitle';
import {MiniToc} from '../MiniToc';
import {Breadcrumbs} from '../Breadcrumbs';
import {HTML} from '../HTML';
import {VcsLink} from '../VcsLink';

import 'yfm-transform/dist/css/yfm.css';
import './DocPage.scss';

const b = block('dc-doc-page');

export interface DocPageProps extends DocPageData {
    router: Router;
    lang: Lang;
    headerHeight?: number;
}

class DocPage extends React.Component<DocPageProps> {
    render() {
        const {toc, router, lang, headerHeight} = this.props;

        const asideLinks = this.renderAsideLinks();
        const asideMiniToc = this.renderAsideMiniToc();

        return (
            <DocLayout toc={toc} router={router} lang={lang} headerHeight={headerHeight} className={b()}>
                <DocLayout.Center>
                    <div className={b('main')}>
                        {this.renderBreadcrumbs()}
                        <main className={b('content')}>
                            {this.renderTitle()}
                            {this.renderContentMiniToc()}
                            {this.renderBody()}
                        </main>
                        {/* {this.renderFeedback()} */}
                    </div>
                </DocLayout.Center>
                <DocLayout.Right>
                    <div className={b('aside')}>
                        {asideLinks}
                        {asideLinks && asideMiniToc && this.renderAsideSeparator()}
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
        const {html} = this.props;

        if (!html) {
            return null;
        }

        return <div className={b('body', 'yfm')} dangerouslySetInnerHTML={{__html: html}}/>;
    }

    private renderAsideLinks() {
        const {toc, meta, vcsUrl, vcsType, lang} = this.props;
        const editable = (
            toc.stage !== 'preview' &&
            meta.stage !== 'preview' &&
            meta.editable !== false &&
            toc.editable !== false
        );

        if (!editable || !vcsUrl || !vcsType) {
            return null;
        }

        return (
            <ul className={b('aside-links')}>
                <li className={b('aside-links-item')}>
                    <VcsLink
                        vcsUrl={vcsUrl}
                        vcsType={vcsType}
                        lang={lang}
                        className={b('aside-link')}
                    />
                </li>
            </ul>
        );
    }

    private renderAsideMiniToc() {
        const {headings, router, headerHeight} = this.props;

        if (headings.length === 0) {
            return null;
        }

        return (
            <div className={b('aside-mini-toc')}>
                <MiniToc headings={headings} router={router} headerHeight={headerHeight}/>
            </div>
        );
    }

    private renderAsideSeparator() {
        return <div className={b('aside-separator')}/>;
    }
}

export default DocPage;
