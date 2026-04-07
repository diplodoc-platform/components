import type {TocItem as ITocItem} from '../../models';

import React from 'react';
import block from 'bem-cn-lite';
import {useAnalytics} from '@gravity-ui/page-constructor';
import {Button} from '@gravity-ui/uikit';
import {Ban} from '@gravity-ui/icons';

import {useTranslation} from '../../hooks';
import {isExternalHref} from '../../utils';
import {DefaultAnalyticsEventNames} from '../../shared/libs/analytics';
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
    deprecated?: boolean;
    toggleItem: (id: string, opened: boolean) => void;
}

export const TocItem: React.FC<TocItemProps> = React.forwardRef(
    (
        {
            id,
            name,
            href,
            active,
            expandable,
            expanded,
            toggleItem,
            labeled,
            deprecated,
            analyticsEvents,
        },
        ref: React.ForwardedRef<HTMLButtonElement>,
    ) => {
        const handleAnalytics = useAnalytics(DefaultAnalyticsEventNames.DOCS_TOC_ITEM_CLICK, href);

        const sendAnalytics = () => {
            handleAnalytics(analyticsEvents);
        };

        const handleClick = () => {
            sendAnalytics();
            toggleItem(id, expanded);
        };

        const handleArrowClick = (event: React.MouseEvent) => {
            event.stopPropagation();
            event.preventDefault();
            toggleItem(id, expanded);
        };

        const {t} = useTranslation('toc-nav-panel');

        const deprecatedIcon = deprecated ? <Ban /> : null;
        const text = (
            <span>
                {name} {deprecatedIcon}
            </span>
        );
        const icon = expandable ? (
            <ToggleArrow className={b('icon')} open={expanded} thin={true} />
        ) : null;

        const allyButtonProps = {
            'aria-expanded': expandable && !href ? expanded : undefined,
            'aria-label': expandable ? t('drop-down-list') + ' ' + name : undefined,
        };
        const textProps = {
            clicable: Boolean(expandable || href),
            active,
            labeled,
            deprecated,
        };

        const getContentClickHandler = () => {
            if (href) {
                return undefined;
            }
            if (expandable) {
                return handleClick;
            }
            return handleAnalytics;
        };

        const content = React.createElement(
            href ? 'div' : 'button',
            {
                ref,
                className: b('text', textProps, b('text-block')),
                onClick: getContentClickHandler(),
                ...allyButtonProps,
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
            className: b('link'),
            onClick: expandable && href ? handleClick : sendAnalytics,
            'aria-expanded': expandable ? expanded : undefined,
            'aria-current': active ? ('true' as const) : undefined,
            'data-router-shallow': true,
        };

        if (expandable && href) {
            return (
                <a {...linkAttributes}>
                    <div className={b('wrapper', b('text', textProps))}>
                        <Button
                            size={'xs'}
                            className={b('arrow')}
                            view={'flat'}
                            onClick={handleArrowClick}
                            extraProps={allyButtonProps}
                            ref={ref}
                        >
                            <Button.Icon>{icon}</Button.Icon>
                        </Button>
                        <span className={b('text')}>{text}</span>
                    </div>
                </a>
            );
        }

        return <a {...linkAttributes}>{content}</a>;
    },
);

TocItem.displayName = 'TocItem';

export default TocItem;
