import React, {memo, useMemo} from 'react';

import block from 'bem-cn-lite';

import {useTranslation} from '../../hooks';
import {DocHeadingItem, Router} from '../../models';
import {Scrollspy} from '../Scrollspy';

import './MiniToc.scss';

const b = block('dc-mini-toc');

export interface MinitocProps {
    headings: DocHeadingItem[];
    router: Router;
    headerHeight?: number;
    onItemClick?: (event: MouseEvent) => void;
}

export interface MinitocSectionProps {
    headings: DocHeadingItem[];
    router: Router;
    headerHeight?: number;
}

interface FlatHeadingItem {
    title: string;
    href: string;
    isChild: boolean;
}

function getFlatHeadings(items: DocHeadingItem[], isChild = false): FlatHeadingItem[] {
    return items.reduce((result, {href, title, items: subItems}) => {
        return result.concat({title, href, isChild}, getFlatHeadings(subItems || [], true));
    }, [] as FlatHeadingItem[]);
}

const MiniToc = memo<MinitocProps>(({headings, router, headerHeight, onItemClick}) => {
    const {t} = useTranslation('mini-toc');
    const flatHeadings = useMemo(() => getFlatHeadings(headings), [headings]);
    const sectionHrefs = useMemo(
        () => flatHeadings.map<string>(({href}) => href, []),
        [flatHeadings],
    );

    if (flatHeadings.length === 0) {
        return null;
    }

    const miniTocContent = flatHeadings.map(({href, title, isChild}, index) => {
        if (index === 0) {
            if (isChild) {
                return (
                    <li
                        key={href}
                        data-hash={href}
                        className={b('section')}
                        aria-current="location"
                    >
                        <h3 className={b('section-heading', {child: isChild})}>
                            <a className={b('section-link')} href={href} data-router-shallow>
                                {title}
                            </a>
                        </h3>
                    </li>
                );
            }
            return (
                <li key={href} data-hash={href} className={b('section')} aria-current="location">
                    <h2 className={b('section-heading', {child: isChild})}>
                        <a className={b('section-link')} href={href} data-router-shallow>
                            {title}
                        </a>
                    </h2>
                </li>
            );
        }

        if (isChild) {
            return (
                <li key={href} data-hash={href} className={b('section')}>
                    <h3 className={b('section-heading', {child: isChild})}>
                        <a className={b('section-link')} href={href} data-router-shallow>
                            {title}
                        </a>
                    </h3>
                </li>
            );
        }
        return (
            <li key={href} data-hash={href} className={b('section')}>
                <h2 className={b('section-heading', {child: isChild})}>
                    <a className={b('section-link')} href={href} data-router-shallow>
                        {title}
                    </a>
                </h2>
            </li>
        );
    });

    return (
        <nav className={b()} aria-label={t('article-navigation')}>
            <h1 className={b('title')}>{t<string>('title')}:</h1>
            <Scrollspy
                className={b('sections')}
                currentClassName={b('section', {active: true})}
                items={sectionHrefs}
                router={router}
                headerHeight={headerHeight}
                onSectionClick={onItemClick}
                aria-label={t('description')}
            >
                {miniTocContent}
            </Scrollspy>
        </nav>
    );
});

MiniToc.displayName = 'MiniToc';

export default MiniToc;
