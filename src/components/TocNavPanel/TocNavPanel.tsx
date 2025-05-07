import React, {memo, useMemo} from 'react';
import {ArrowLeft, ArrowRight} from '@gravity-ui/icons';
import block from 'bem-cn-lite';

import {useTranslation} from '../../hooks';
import {Router, TocData, TocItem} from '../../models';
import {isActiveItem, isExternalHref} from '../../utils';

import './TocNavPanel.scss';

const b = block('dc-nav-toc-panel');

const ARROW_SIZE = 24;

export interface TocNavPanelProps extends TocData {
    router: Router;
    fixed?: boolean;
    className?: string;
    onClick?(at: 'prev' | 'next'): void;
}

interface FlatTocItem {
    name: string;
    href: string;
}

function getFlatToc(items: TocItem[]): FlatTocItem[] {
    return items.reduce((result, {href, name, items: subItems}) => {
        if (href) {
            result.push({name, href});
        }

        return result.concat(getFlatToc(subItems || []));
    }, [] as FlatTocItem[]);
}

function getBoundingItems(flatToc: FlatTocItem[], router: Router) {
    for (let i = 0; i < flatToc.length; i++) {
        const {href} = flatToc[i];

        if (isActiveItem(router, href)) {
            return {
                prevItem: flatToc[i - 1] || null,
                nextItem: flatToc[i + 1] || null,
            };
        }
    }

    return {
        prevItem: null,
        nextItem: null,
    };
}

type TocNavControlProps = {
    isNext?: boolean;
    item: FlatTocItem | null;
    onClick?(): void;
};

const TocNavControl = memo<TocNavControlProps>(({item, isNext, onClick}) => {
    const {t} = useTranslation('toc-nav-panel');
    const keyHint = isNext ? 'hint_next' : 'hint_previous';
    const isExternal = item && isExternalHref(item.href);
    const linkAttributes = {
        href: item?.href,
        target: isExternal ? '_blank' : '_self',
        rel: isExternal ? 'noopener noreferrer' : undefined,
    };

    return (
        <div className={b('control', {left: !isNext, right: isNext})}>
            {item && (
                <React.Fragment>
                    <div className={b('control-hint')}>{t(keyHint)}</div>
                    <div className={b('control-text')} onClick={onClick}>
                        <a {...linkAttributes} className={b('link')} data-router-shallow>
                            {!isNext && <ArrowLeft width={ARROW_SIZE} height={ARROW_SIZE} />}
                            <div className={b('control-name')}>{item.name}</div>
                            {isNext && <ArrowRight width={ARROW_SIZE} height={ARROW_SIZE} />}
                        </a>
                    </div>
                </React.Fragment>
            )}
        </div>
    );
});

TocNavControl.displayName = 'TocNavControl';

const TocNavPanel = memo<TocNavPanelProps>(({items, router, fixed, className, onClick}) => {
    const flatToc = useMemo(() => getFlatToc(items || []), [items]);
    const {prevItem, nextItem} = useMemo(
        () => getBoundingItems(flatToc, router),
        [flatToc, router],
    );

    const handleClickFactory = (at: 'prev' | 'next') => () => onClick?.(at);

    if (!flatToc.length) {
        return null;
    }

    return (
        <div className={b({fixed}, className)}>
            <div className={b('content')}>
                {<TocNavControl item={prevItem} onClick={handleClickFactory('prev')} />}
                {
                    <TocNavControl
                        item={nextItem}
                        isNext={true}
                        onClick={handleClickFactory('next')}
                    />
                }
            </div>
        </div>
    );
});

TocNavPanel.displayName = 'TocNavPanel';

export default TocNavPanel;
