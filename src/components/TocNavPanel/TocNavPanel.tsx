import React, {memo, useMemo} from 'react';

import {ArrowLeft, ArrowRight} from '@gravity-ui/icons';
import block from 'bem-cn-lite';

import {useTranslation} from '../../hooks';
import {Router, TocData, TocItem} from '../../models';
import {isActiveItem, isExternalHref} from '../../utils';

import './TocNavPanel.scss';

const b = block('dc-nav-toc-panel');

export interface TocNavPanelProps extends TocData {
    router: Router;
    fixed?: boolean;
    className?: string;
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

const TocNavControl = memo<{isNext?: boolean; item: FlatTocItem | null}>(({item, isNext}) => {
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
                    <div className={b('control-hint')}>{t<string>(keyHint)}</div>
                    <div className={b('control-text')}>
                        <a {...linkAttributes} className={b('link')} data-router-shallow>
                            {!isNext && <ArrowLeft width={16} height={16} />}
                            {item.name}
                            {isNext && <ArrowRight width={16} height={16} />}
                        </a>
                    </div>
                </React.Fragment>
            )}
        </div>
    );
});

TocNavControl.displayName = 'TocNavControl';

const TocNavPanel = memo<TocNavPanelProps>(({items, router, fixed, className}) => {
    const flatToc = useMemo(() => getFlatToc(items), [items]);
    const {prevItem, nextItem} = useMemo(
        () => getBoundingItems(flatToc, router),
        [flatToc, router],
    );

    if (!flatToc.length) {
        return null;
    }

    return (
        <div className={b({fixed}, className)}>
            <div className={b('content')}>
                {<TocNavControl item={prevItem} />}
                {<TocNavControl item={nextItem} isNext={true} />}
            </div>
        </div>
    );
});

TocNavPanel.displayName = 'TocNavPanel';

export default TocNavPanel;
