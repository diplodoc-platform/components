import React from 'react';
import block from 'bem-cn-lite';

import {TocData, Router} from '../../models';
import {DocLayout} from '../DocLayout';
import {DocPageTitle} from '../DocPageTitle';
import {Text} from '../Text';
import {HTML} from '../HTML';

import './DocLeadingPage.scss';

const b = block('dc-doc-leading-page');

interface DocLeadingPageLinks {
    title: string;
    description: string;
    href: string;
}

interface DocLeadingPageData {
    title: string;
    description: string;
    links: DocLeadingPageLinks[];
}

export interface DocLeadingPageProps {
    data: DocLeadingPageData;
    toc: TocData;
    router: Router;
}

export const DocLeadingPage: React.FC<DocLeadingPageProps> = ({data: {title, description, links}, toc, router}) => {
    return (
        <DocLayout toc={toc} router={router} className={b()}>
            <span/>
            <DocLayout.Center>
                <main className={b('main')}>
                    <DocPageTitle stage={toc.stage} className={b('title')}>
                        <HTML>{title}</HTML>
                    </DocPageTitle>
                    <div className={b('description')}>
                        <Text data={description} html block/>
                    </div>
                    <ul className={b('links')}>
                        {links.map(({title: linkTitle, description: linkDescription, href}, index) => (
                            <li key={index} className={b('links-item')}>
                                <h2 className={b('links-title')}>
                                    <a href={href} className={b('links-link')}>{linkTitle}</a>
                                </h2>
                                <p className={b('links-description')}>{linkDescription}</p>
                            </li>
                        ))}
                    </ul>
                </main>
            </DocLayout.Center>
        </DocLayout>
    );
};
