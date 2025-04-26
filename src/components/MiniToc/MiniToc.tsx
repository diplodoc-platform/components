import React, {FC, MouseEvent, useLayoutEffect, useRef, useState} from 'react';
import block from 'bem-cn-lite';
import clsx from 'clsx';

import {useTranslation} from '../../hooks';
import {DocHeadingItem, Router} from '../../models';
import {FlatHeadingItem} from '../SubNavigation/hooks/useHeadingIntersectionObserver';

import './MiniToc.scss';

const b = block('dc-mini-toc');

const overflownClassName = 'dc-mini-toc_overflowed';

export interface MinitocProps {
    headings: DocHeadingItem[];
    router: Router;
    headerHeight?: number;
    onItemClick?: (event: MouseEvent) => void;
    onActiveItemTitleChange?: (title: string) => void;
}

export interface MinitocSectionProps {
    headings: DocHeadingItem[];
    router: Router;
    headerHeight?: number;
}

type MiniTocProps = {
    headings: readonly FlatHeadingItem[];
    activeHeading: FlatHeadingItem | null;
    onItemClick?: (event: MouseEvent) => void;
};

const MiniToc: FC<MiniTocProps> = ({headings, activeHeading, onItemClick}) => {
    const {t} = useTranslation('mini-toc');

    const [isOverflown, setIsOverflown] = useState(false);
    const rootContainerRef = useRef<HTMLUListElement>(null);
    const [refMappings] = useState(() => new WeakMap<FlatHeadingItem, HTMLLIElement>());

    const refCb = (forHeading: FlatHeadingItem) => (current: HTMLLIElement) =>
        refMappings.set(forHeading, current);

    useLayoutEffect(() => {
        const scrollHeight = rootContainerRef.current?.scrollHeight ?? 0;
        const clientHeight = rootContainerRef.current?.clientHeight ?? 0;

        setIsOverflown(scrollHeight > clientHeight);
    }, [headings]);

    useLayoutEffect(() => {
        const maybeAffectedLink = activeHeading && refMappings.get(activeHeading);
        const root = rootContainerRef.current;

        if (!maybeAffectedLink || !root) {
            return;
        }

        const needsScroll = !(
            maybeAffectedLink.offsetTop > root.scrollTop &&
            maybeAffectedLink.offsetTop + maybeAffectedLink.clientHeight <
                root.scrollTop + root.clientHeight
        );
        const sign = maybeAffectedLink.offsetTop > root.scrollTop ? 1 : -1;

        const scrollToPos = needsScroll
            ? maybeAffectedLink.offsetTop + sign * (root.clientHeight / 2)
            : 0;

        if (needsScroll) {
            root.scroll({top: scrollToPos, behavior: 'smooth'});
        }
    }, [refMappings, activeHeading]);

    return headings.length ? (
        <nav className={b()} aria-label={t('article-navigation')}>
            <h2 className={b('title')}>{t('title')}:</h2>
            <ul
                className={clsx(b('sections'), isOverflown && overflownClassName)}
                aria-label={t('description')}
                ref={rootContainerRef}
            >
                {headings.map((heading) => (
                    <li
                        key={heading.href}
                        data-hash={heading.href}
                        onClick={onItemClick}
                        className={b('section', {
                            child: heading.isChild,
                            active: heading.href === activeHeading?.href,
                        })}
                        ref={refCb(heading)}
                    >
                        <a href={heading.href} className={b('section-link')} data-router-shallow>
                            {heading.title}
                        </a>
                    </li>
                ))}
            </ul>
            <div className={b('bottom')} />
        </nav>
    ) : null;
};

export default MiniToc;
