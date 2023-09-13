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

const MiniToc = memo<MinitocProps>(({headings, router, headerHeight}) => {
    const {t} = useTranslation('mini-toc');
    const flatHeadings = useMemo(() => getFlatHeadings(headings), [headings]);
    const sectionHrefs = useMemo(
        () => flatHeadings.map<string>(({href}) => href, []),
        [flatHeadings],
    );

    if (flatHeadings.length === 0) {
        return null;
    }

    return (
        <div className={b()}>
            <div className={b('title')}>{t<string>('title')}:</div>
            <Scrollspy
                className={b('sections')}
                currentClassName={b('section', {active: true})}
                items={sectionHrefs}
                router={router}
                headerHeight={headerHeight}
            >
                {flatHeadings.map(({href, title, isChild}) => (
                    <li key={href} data-hash={href} className={b('section', {child: isChild})}>
                        <a href={href} className={b('section-link')} data-router-shallow>
                            {title}
                        </a>
                    </li>
                ))}
            </Scrollspy>
        </div>
    );
});

MiniToc.displayName = 'MiniToc';

export default MiniToc;
