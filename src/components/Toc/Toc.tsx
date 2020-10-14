import React from 'react';
import block from 'bem-cn-lite';
import isEqual from 'lodash/isEqual';

import {TocData, TocItem, Router} from '../../models';
import {ToggleArrow} from '../ToggleArrow';
import {HTML} from '../HTML';

import {isExternalHref, isActiveItem} from '../../utils';

import './Toc.scss';

const b = block('dc-toc');
const HEADER_DEFAULT_HEIGHT = 0;

export interface TocProps extends TocData {
    router: Router;
    headerHeight?: number;
    tocTitleIcon?: React.ReactNode;
}

interface FlatTocItem {
    name: string;
    href?: string;
    parents: string[];
    opened?: boolean;
}

interface TocState {
    flatToc: Record<string, FlatTocItem>;
    filteredItemIds: string[];
    filterName: string;
    contentScrolled: boolean;
    activeId?: string | null;
}

class Toc extends React.Component<TocProps, TocState> {

    contentRef = React.createRef<HTMLDivElement>();
    rootRef = React.createRef<HTMLDivElement>();

    containerEl: HTMLElement | null = null;
    footerEl: HTMLElement | null = null;

    state: TocState = {
        flatToc: {},
        filteredItemIds: [],
        filterName: '',
        contentScrolled: false,
        activeId: null,
    };

    componentDidMount() {
        this.containerEl = document.querySelector('.Layout__content');
        this.footerEl = document.querySelector('.Footer');
        this.setTocHeight();
        this.setState(this.getState(this.props, this.state), () => this.scrollToActiveItem());

        window.addEventListener('scroll', this.handleScroll);
        window.addEventListener('resize', this.handleResize);
        if (this.contentRef && this.contentRef.current) {
            this.contentRef.current.addEventListener('scroll', this.handleContentScroll);
        }
    }

    componentDidUpdate(prevProps: TocProps) {
        const {router} = this.props;

        if (prevProps.router.pathname !== router.pathname || !isEqual(prevProps.router.query, router.query)) {
            this.setTocHeight();
            this.setState(this.getState(this.props, this.state), () => this.scrollToActiveItem());
        }
    }

    componentWillUnmount() {
        window.removeEventListener('scroll', this.handleScroll);
        window.removeEventListener('resize', this.handleResize);
        if (this.contentRef && this.contentRef.current) {
            this.contentRef.current.removeEventListener('scroll', this.handleContentScroll);
        }
    }

    render() {
        const {items} = this.props;
        const {filterName, filteredItemIds} = this.state;
        let content;

        if (filterName.length !== 0 && filteredItemIds.length === 0) {
            content = this.renderEmpty('');
        } else {
            content = items ? this.renderList(items) : this.renderEmpty('');
        }

        return (
            <div className={b()} ref={this.rootRef}>
                {this.renderTop()}
                <div className={b('content')} ref={this.contentRef}>
                    {content}
                </div>
            </div>
        );
    }

    private renderList(items: TocItem[], isMain = true) {
        const {flatToc, filteredItemIds, filterName, activeId} = this.state;

        return (
            <ul className={b('list')}>
                {items.map(({id, name, href, items: subItems}, index) => {
                    const opened = flatToc[id] ? flatToc[id].opened : true;
                    let isOpenFilteredItem = false;
                    let active = false;
                    let visibleChildren = Boolean(subItems);
                    let icon = null;
                    let text;

                    if (filteredItemIds.length > 0) {
                        filteredItemIds.forEach((itemId) => {
                            if (flatToc[itemId].parents.includes(id)) {
                                isOpenFilteredItem = true;
                            }
                        });
                    }

                    if (subItems && subItems.length > 0) {
                        icon = <ToggleArrow className={b('list-item-icon')} open={opened} thin={true}/>;
                    }

                    if (filteredItemIds.includes(id)) {
                        const firstEntry = name.toLowerCase().indexOf(filterName.toLowerCase());
                        isOpenFilteredItem = true;

                        text = (
                            <React.Fragment>
                                {name.substring(0, firstEntry)}
                                <span className={b('list-item-text-match')}>
                                    {name.substring(firstEntry, firstEntry + filterName.length)}
                                </span>
                                {name.substring(firstEntry + filterName.length)}
                            </React.Fragment>
                        );
                    } else {
                        text = <span>{name}</span>;
                    }

                    let content = (
                        <div
                            className={b('list-item-text')}
                            onClick={subItems && subItems.length > 0 ? this.handleItemClick.bind(this, id) : undefined}
                        >
                            {icon}
                            {text}
                        </div>
                    );

                    if (filterName.length > 0 && !isOpenFilteredItem) {
                        return null;
                    }

                    if (href) {
                        const isExternal = isExternalHref(href);
                        const linkAttributes = {
                            href,
                            target: isExternal ? '_blank' : '_self',
                            rel: isExternal ? 'noopener noreferrer' : undefined,
                        };

                        content = (
                            <a {...linkAttributes} className={b('list-item-link')} data-router-shallow>
                                {content}
                            </a>
                        );

                        active = id === activeId;
                    }

                    if (subItems && (active || opened)) {
                        visibleChildren = true;
                    }

                    return (
                        <li key={index} id={id} className={b('list-item', {main: isMain, active, opened})}>
                            {content}
                            {subItems && visibleChildren && this.renderList(subItems, false)}
                        </li>
                    );
                })}
            </ul>
        );
    }

    private renderEmpty(text: string) {
        return <div className={b('empty')}>{text}</div>;
    }

    private renderTop() {
        const {router, title, href, tocTitleIcon} = this.props;
        const {contentScrolled} = this.state;
        let topHeader;

        if (href) {
            const active = isActiveItem(router, href);

            topHeader = (
                <a href={href} className={b('top-header', {active, link: true})} data-router-shallow>
                    <HTML>{title}</HTML>
                </a>
            );
        } else {
            topHeader = (
                <div className={b('top-header')}>
                    <HTML>{title}</HTML>
                </div>
            );
        }

        return (
            <div className={b('top', {scrolled: contentScrolled})}>
                {tocTitleIcon ?
                    <div className={b('top-header-icon')}>{tocTitleIcon}</div>
                    : null
                }
                {topHeader}
            </div>
        );
    }

    private getState(props: TocProps, state: TocState) {
        const flatToc: Record<string, FlatTocItem> = {};
        let activeId;

        function processItems(items: TocItem[], parentId?: string) {
            items.forEach(({id, href, name, items: subItems}) => {
                flatToc[id] = state.flatToc[id]
                    ? {...state.flatToc[id]}
                    : {name, href, parents: []};

                if (parentId) {
                    flatToc[id].parents = [parentId, ...flatToc[parentId].parents];
                }

                if (href && isActiveItem(props.router, href)) {
                    activeId = id;
                }

                if (subItems) {
                    if (typeof flatToc[id].opened === 'undefined') {
                        flatToc[id].opened = flatToc[id].parents.length === 0;
                    }

                    processItems(subItems, id);
                }
            });
        }

        processItems(props.items);

        if (activeId) {
            flatToc[activeId].parents.forEach((id) => {
                flatToc[id].opened = true;
            });
        }

        return {flatToc, activeId};
    }

    private setTocHeight() {
        const {headerHeight = HEADER_DEFAULT_HEIGHT} = this.props;
        const containerHeight = this.containerEl?.offsetHeight ?? 0;
        const footerHeight = this.footerEl?.offsetHeight ?? 0;
        const scrollDiff = window.scrollY + window.innerHeight + footerHeight - headerHeight - containerHeight;
        const rootNode = this.rootRef.current;

        if (!rootNode) {
            return;
        }

        if (scrollDiff > 0) {
            rootNode.style.height = window.innerHeight - headerHeight - scrollDiff + 'px';
        } else if (containerHeight < window.innerHeight) {
            rootNode.style.height = containerHeight - footerHeight + 'px';
        } else {
            rootNode.style.height = window.innerHeight - headerHeight + 'px';
        }
    }

    private scrollToActiveItem() {
        const {activeId} = this.state;
        const activeElement = activeId && document.getElementById(activeId);

        if (!activeElement) {
            return;
        }

        const itemElement = activeElement.querySelector<HTMLDivElement>(`.${b('list-item-text')}`);

        const itemHeight = itemElement?.offsetHeight ?? 0;
        const itemOffset = activeElement.offsetTop;
        const scrollableParent = activeElement.offsetParent as HTMLDivElement | null;

        if (!scrollableParent) {
            return;
        }

        const scrollableHeight = scrollableParent.offsetHeight;
        const scrollableOffset = scrollableParent.scrollTop;

        const itemVisible = (
            itemOffset >= scrollableOffset &&
            itemOffset <= scrollableOffset + scrollableHeight - itemHeight
        );

        if (!itemVisible) {
            scrollableParent.scrollTop = itemOffset - Math.floor(scrollableHeight / 2) + itemHeight;
        }
    }

    private handleScroll = () => {
        this.setTocHeight();
    };

    private handleResize = () => {
        this.setTocHeight();
    };

    private handleItemClick = (id: string) => {
        this.setState((prevState) => ({
            flatToc: {
                ...prevState.flatToc,
                [id]: {
                    ...prevState.flatToc[id],
                    opened: !prevState.flatToc[id].opened,
                },
            },
        }));
    };

    private handleContentScroll = () => {
        const contentNode = this.contentRef.current;
        const contentScrolled = contentNode ? contentNode.scrollTop > 0 : false;
        if (contentScrolled !== this.state.contentScrolled) {
            this.setState({contentScrolled});
        }
    };
}

export default Toc;
