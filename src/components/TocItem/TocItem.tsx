import React from 'react';
import block from 'bem-cn-lite';

import {TocItem as ITocItem} from '../../models';
import {ToggleArrow} from '../ToggleArrow';

import {isExternalHref} from '../../utils';

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
    openItem: (id: string) => void;
    closeItem: (id: string) => void;
}

class TocItem extends React.Component<TocItemProps> {
    contentRef = React.createRef<HTMLDivElement>();

    render() {
        const {name, href, active, expandable, expanded} = this.props;
        const text = <span>{name}</span>;
        const icon = expandable ? (
            <ToggleArrow className={b('icon')} open={expanded} thin={true} />
        ) : null;
        const content = (
            <div
                ref={href ? null : this.contentRef}
                className={b('text', {active})}
                onClick={expandable && !href ? this.handleClick : undefined}
            >
                {icon}
                {text}
            </div>
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
                onClick={expandable && href ? this.handleClick : undefined}
                data-router-shallow
            >
                {content}
            </a>
        );
    }

    scrollToItem = () => {
        if (!this.contentRef.current) {
            return;
        }

        const itemElement = this.contentRef.current;
        const itemHeight = itemElement.offsetHeight ?? 0;
        const itemOffset = itemElement.offsetTop;
        const scrollableParent = itemElement.offsetParent as HTMLDivElement | null;

        if (!scrollableParent) {
            return;
        }

        const scrollableHeight = scrollableParent.offsetHeight;
        const scrollableOffset = scrollableParent.scrollTop;

        const itemVisible =
            itemOffset >= scrollableOffset &&
            itemOffset <= scrollableOffset + scrollableHeight - itemHeight;

        if (!itemVisible) {
            scrollableParent.scrollTop = itemOffset - Math.floor(scrollableHeight / 2) + itemHeight;
        }
    };

    private handleClick = () => {
        const {id, href, active, expanded, openItem, closeItem} = this.props;

        if (!active && href) {
            return;
        }

        if (expanded) {
            closeItem(id);
            return;
        }

        if (!expanded) {
            openItem(id);
            return;
        }
    };
}

export default TocItem;
