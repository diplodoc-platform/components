import React from 'react';
import block from 'bem-cn-lite';
import {withTranslation, WithTranslation, WithTranslationProps} from 'react-i18next';
import 'yfm-transform/dist/js/yfm';

import {DocPageData, Router, Lang} from '../../models';
import {DocLayout} from '../DocLayout';
import {DocPageTitle} from '../DocPageTitle';
import {MiniToc} from '../MiniToc';
import {Breadcrumbs} from '../Breadcrumbs';
import {HTML} from '../HTML';

import GithubIcon from '../../../assets/icons/github.svg';

import 'yfm-transform/dist/css/yfm.css';
import './DocPage.scss';

const b = block('dc-doc-page');

export interface DocPageProps extends DocPageData {
    router: Router;
    lang: Lang;
    headerHeight?: number;
}

type DocPageInnerProps =
    & DocPageProps
    & WithTranslation
    & WithTranslationProps;

class DocPage extends React.Component<DocPageInnerProps> {

    componentDidUpdate(prevProps: DocPageProps) {
        const {i18n, lang} = this.props;
        if (prevProps.lang !== lang) {
            i18n.changeLanguage(lang);
        }
    }

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
        const {toc, meta, githubUrl, lang, i18n, t} = this.props;
        const editable = (
            toc.stage !== 'preview' &&
            meta.stage !== 'preview' &&
            meta.editable !== false &&
            toc.editable !== false
        );
        const iconSize = 24;

        if (!editable || !githubUrl) {
            return null;
        }

        if (i18n.language !== lang) {
            i18n.changeLanguage(lang);
        }

        return (
            <ul className={b('aside-links')}>
                <li className={b('aside-links-item')}>
                    <a
                        href={githubUrl}
                        target="_blank"
                        rel="noreferrer noopener"
                        className={b('aside-link')}
                    >
                        <GithubIcon
                            className={b('aside-link-icon', {type: 'github'})}
                            width={iconSize}
                            height={iconSize}
                        />
                        {t('label_link-github')}
                    </a>
                </li>
            </ul>
        );
    }

    private renderAsideMiniToc() {
        const {headings, router} = this.props;

        if (headings.length === 0) {
            return null;
        }

        return (
            <div className={b('aside-mini-toc')}>
                <MiniToc headings={headings} router={router}/>
            </div>
        );
    }

    private renderAsideSeparator() {
        return <div className={b('aside-separator')}/>;
    }
}

export default withTranslation('docPage')(DocPage);
