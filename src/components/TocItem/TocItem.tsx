import React from 'react';
import block from 'bem-cn-lite';

import {useTranslation} from '../../hooks';
import {TocItem as ITocItem} from '../../models';
import {isExternalHref} from '../../utils';
import {ToggleArrow} from '../ToggleArrow';

import './TocItem.scss';

const b = block('dc-toc-item');

export interface TocItemProps extends ITocItem {
    id: string;
    name: string;
    href?: string;
    items?: ITocItem[];
    active: boolean;
    expandable: boolean;
    expanded: boolean;
    toggleItem: (id: string, opened: boolean) => void;
}

export const TocItem: React.FC<TocItemProps> = React.forwardRef(
    (
        {id, name, href, active, expandable, expanded, toggleItem, labeled},
        ref: React.ForwardedRef<HTMLButtonElement>,
    ) => {
        const handleClick = () => {
            if (!active && href) {
                return;
            }

            toggleItem(id, expanded);
        };

        const {t} = useTranslation('toc-nav-panel');

        const text = <span>{name}</span>;
        const icon = expandable ? (
            <ToggleArrow className={b('icon')} open={expanded} thin={true} />
        ) : null;

        const content = React.createElement(
            href ? 'div' : 'button',
            {
                ref: href ? null : ref,
                className: b('text', {
                    clicable: Boolean(expandable || href),
                    active,
                    labeled,
                }),
                onClick: expandable && !href ? handleClick : undefined,
                'aria-expanded': expandable ? expanded : undefined,
                'aria-label': expandable ? t('drop-down-list') + ' ' + name : undefined,
                tabIndex: expandable ? 0 : -1,
            },
            icon,
            text,
        );

        if (!href) {
            return content;
        }

        const isExternal = isExternalHref(href);
        const linkAttributes = {
            href,
            target: isExternal ? '_blank' : '_self',
            rel: isExternal ? 'noopener noreferrer' : undefined,
        };

        return (
            <a
                {...linkAttributes}
                className={b('link')}
                onClick={expandable && href ? handleClick : undefined}
                data-router-shallow
                aria-current={active ? 'true' : undefined}
            >
                {content}
            </a>
        );
    },
);

TocItem.displayName = 'TocItem';

export default TocItem;
