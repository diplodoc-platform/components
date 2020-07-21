import React from 'react';
import block from 'bem-cn-lite';

import {withTranslation, WithTranslation, WithTranslationProps} from 'react-i18next';

import {TocData, TocItem, Router, Lang} from '../../models';

import ArrowLeft from '../../../assets/icons/arrow-left.svg';
import ArrowRight from '../../../assets/icons/arrow-right.svg';

import {isExternalHref, isActiveItem} from '../../utils';

import './TocNavPanel.scss';

const b = block('dc-nav-toc-panel');

export interface TocNavPanelProps extends TocData {
    router: Router;
    lang: Lang;
    fixed?: boolean;
}

type TocNavPanelInnerProps =
    & TocNavPanelProps
    & WithTranslation
    & WithTranslationProps;

interface FlatTocItem {
    name: string;
    href: string;
}

interface TocNavPanelState {
    flatToc: FlatTocItem[];
    activeItemIndex: number;
}

class TocNavPanel extends React.Component<TocNavPanelInnerProps, TocNavPanelState> {
    state: TocNavPanelState = {
        flatToc: [],
        activeItemIndex: 0,
    };

    componentDidMount() {
        this.setState(this.getState(this.props));
    }

    componentDidUpdate(prevProps: TocNavPanelProps) {
        const {router, i18n, lang} = this.props;

        if (prevProps.router.pathname !== router.pathname) {
            this.setState(this.getState(this.props));
        }

        if (prevProps.lang !== lang) {
            i18n.changeLanguage(lang);
        }
    }

    render() {
        const {flatToc, activeItemIndex} = this.state;
        const {fixed = false} = this.props;

        if (!flatToc.length) {
            return null;
        }

        const prevItem = activeItemIndex > 0 ? flatToc[activeItemIndex - 1] : null;
        const nextItem = activeItemIndex < flatToc.length - 1 ? flatToc[activeItemIndex + 1] : null;

        return (
            <div className={b({fixed})}>
                <div className={b('content')}>
                    {this.renderControl(prevItem)}
                    {this.renderControl(nextItem, true)}
                </div>
            </div>
        );
    }

    private renderControl(tocItem: FlatTocItem | null, isNext?: boolean) {
        const {t} = this.props;
        const keyHint = isNext ? 'hint_next' : 'hint_previous';

        return (
            <div className={b('control', {left: !isNext, right: isNext})}>
                {tocItem &&
                    <React.Fragment>
                        <div className={b('control-hint')}>{t(keyHint)}</div>
                        <div className={b('control-text')}>
                            {!isNext && <ArrowLeft/>}
                            {this.renderLink(tocItem)}
                            {isNext && <ArrowRight/>}
                        </div>
                    </React.Fragment>
                }
            </div>
        );
    }

    private renderLink(item: FlatTocItem | null) {
        if (!item) {
            return null;
        }

        const isExternal = isExternalHref(item.href);
        const linkAttributes = {
            href: item.href,
            target: isExternal ? '_blank' : '_self',
            rel: isExternal ? 'noopener noreferrer' : undefined,
        };

        return (
            <a {...linkAttributes} className={b('link')} data-router-shallow>
                {item.name}
            </a>
        );
    }

    private getState(props: TocNavPanelProps): TocNavPanelState {
        const flatToc: FlatTocItem[] = [];
        let activeItemIndex = 0;

        function processItems(items: TocItem[]) {
            items.forEach(({href, name, items: subItems}) => {
                if (subItems) {
                    processItems(subItems);
                }

                if (href) {
                    flatToc.push({
                        name,
                        href,
                    });
                }

                if (href && isActiveItem(props.router, href)) {
                    activeItemIndex = flatToc.length - 1;
                }
            });
        }

        processItems(props.items);


        return {flatToc, activeItemIndex};
    }
}

export default withTranslation('toc-nav-panel')(TocNavPanel);
