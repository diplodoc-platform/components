import React from 'react';
import block from 'bem-cn-lite';

import {DocLeadingPageData, DocLeadingLinks, Router, Lang} from '../../models';
import {DocLayout} from '../DocLayout';
import {DocPageTitle} from '../DocPageTitle';
import {Text} from '../Text';
import {HTML} from '../HTML';

import {DEFAULT_SETTINGS} from '../../constants';

import './DocLeadingPage.scss';

const b = block('dc-doc-leading-page');

const {wideFormat: defaultWideFormat} = DEFAULT_SETTINGS;

export interface DocLeadingPageProps extends DocLeadingPageData {
    router: Router;
    lang: Lang;
    headerHeight?: number;
    wideFormat?: boolean;
    hideTocHeader?: boolean;
    hideToc?: boolean;
    tocTitleIcon?: React.ReactNode;
}

export interface DocLinkProps {
    data: DocLeadingLinks;
    isRoot?: boolean;
}

const renderLeft = (data: DocLeadingLinks, isRoot?: boolean) => {
    const {imgSrc} = data;

    if (!imgSrc || !isRoot) {
        return null;
    }

    return (
        <div className={b('links-left')}>
            <img src={imgSrc}/>
        </div>
    );
};

const renderRight = (data: DocLeadingLinks, isRoot?: boolean) => {
    const {title, description, href, links} = data;

    let titleContent = href
        ? <a href={href} className={b('links-link')}>{title}</a>
        : title;
    titleContent = isRoot
        ? <h2 className={b('links-title', {root: isRoot})}>{titleContent}</h2>
        : <div className={b('links-title')}>{titleContent}</div>;


    return (
        <div className={b('links-right')}>
            {titleContent}
            {description && isRoot ? <p className={b('links-description')}>{description}</p> : null}
            <Links links={links}/>
        </div>
    );
};

export const Link: React.FC<DocLinkProps> = ({data, isRoot}) => {
    return (
        <li className={b('links-item', {root: isRoot})}>
            {renderLeft(data, isRoot)}
            {renderRight(data, isRoot)}
        </li>
    );
};

export interface DocLinksProps {
    links?: DocLeadingLinks[];
    isRoot?: boolean;
}

export const Links: React.FC<DocLinksProps> = ({links, isRoot}) => {
    if (!links || !links.length) {
        return null;
    }

    return (
        <ul className={b('links', {root: isRoot})}>
            {links.map((data, index) => <Link key={index} data={data} isRoot={isRoot}/>)}
        </ul>
    );
};

export const DocLeadingPage: React.FC<DocLeadingPageProps> = ({
    data: {title, description, links},
    toc, router, lang, headerHeight, wideFormat = defaultWideFormat, hideTocHeader, hideToc, tocTitleIcon,
}) => {
    const modes = {
        'regular-page-width': !wideFormat,
    };

    return (
        <DocLayout
            toc={toc}
            router={router}
            lang={lang}
            headerHeight={headerHeight}
            className={b(modes)}
            hideTocHeader={hideTocHeader}
            hideToc={hideToc}
            tocTitleIcon={tocTitleIcon}
        >
            <span/>
            <DocLayout.Center>
                <main className={b('main')}>
                    <DocPageTitle stage={toc.stage} className={b('title')}>
                        <HTML>{title}</HTML>
                    </DocPageTitle>
                    <div className={b('description')}>
                        <Text data={description} html block/>
                    </div>
                    <Links links={links} isRoot/>
                </main>
            </DocLayout.Center>
        </DocLayout>
    );
};
