import React from 'react';

import block from 'bem-cn-lite';
import {KeyPrefix, Namespace, TFunction} from 'react-i18next';

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

class TocItem extends React.Component<TocItemProps> {
    contentRef = React.createRef<HTMLButtonElement>();

    render() {
        return (
            <WithAriaLabel
                render={(t: TFunction<Namespace<string>, KeyPrefix<Namespace<string>>>) => {
                    const {name, href, active, expandable, expanded, labeled} = this.props;
                    const text = <span>{name}</span>;
                    const icon = expandable ? (
                        <ToggleArrow className={b('icon')} open={expanded} thin={true} />
                    ) : null;

                    const content = React.createElement(
                        href ? 'div' : 'button',
                        {
                            ref: href ? null : this.contentRef,
                            className: b('text', {
                                clicable: Boolean(expandable || href),
                                active,
                                labeled,
                            }),
                            onClick: expandable && !href ? this.handleClick : undefined,
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
                            onClick={expandable && href ? this.handleClick : undefined}
                            data-router-shallow
                            aria-current={active ? 'true' : undefined}
                        >
                            {content}
                        </a>
                    );
                }}
            />
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
        const {id, href, active, expanded, toggleItem} = this.props;

        if (!active && href) {
            return;
        }

        toggleItem(id, expanded);
    };
}

export interface WithAriaLabelProps {
    render: (t: TFunction<Namespace<string>, KeyPrefix<Namespace<string>>>) => JSX.Element;
}

function WithAriaLabel({render}: WithAriaLabelProps) {
    const {t} = useTranslation('toc-nav-panel');
    return render(t);
}

export default TocItem;
