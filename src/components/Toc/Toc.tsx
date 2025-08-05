import React from 'react';
import {getUniqId} from '@gravity-ui/uikit';
import block from 'bem-cn-lite';
import omit from 'lodash/omit';

import {PopperPosition} from '../../hooks';
import {ControlSizes, Router, TocData, TocItem} from '../../models';
import {isActiveItem, normalizeHash, normalizePath} from '../../utils';
import {Controls, ControlsLayout} from '../Controls';
import {HTML} from '../HTML';
import {TocItem as Item} from '../TocItem';
import TocLabel from '../TocLable/TocLabel';

import {TocItemRegistry} from './TocItemRegistry';
import './Toc.scss';

const b = block('dc-toc');

function zip<T>(array: string[], fill: T): Record<string, T> {
    return array.reduce((acc, item) => Object.assign(acc, {[item]: fill}), {});
}

export interface TocProps extends TocData {
    router: Router;
    headerHeight?: number;
    tocTitleIcon?: React.ReactNode;
    hideTocHeader?: boolean;
    singlePage?: boolean;
    onChangeSinglePage?: (value: boolean) => void;
    pdfLink?: string;
}

interface TocState {
    activeId: string | null | undefined;
    fixedById: Record<string, 'opened' | 'closed'>;
    contentScrolled: boolean;
    registry: TocItemRegistry;
}

class Toc extends React.Component<TocProps, TocState> {
    contentRef = React.createRef<HTMLDivElement>();
    rootRef = React.createRef<HTMLDivElement>();
    activeRef = React.createRef<HTMLButtonElement>();

    containerEl: HTMLElement | null = null;
    footerEl: HTMLElement | null = null;
    tocTopId: string;

    constructor(props: TocProps) {
        super(props);

        this.state = this.computeState(this.getInitialState());
        this.tocTopId = getUniqId();
    }

    getInitialState() {
        return {
            registry: new TocItemRegistry(this.props.items || [], this.normalizeUrl),
            fixedById: {},
            activeId: null,
            contentScrolled: false,
        };
    }

    componentDidMount() {
        this.containerEl = document.querySelector('.Layout__content');
        this.footerEl = document.querySelector('.Footer');

        if (this.contentRef && this.contentRef.current) {
            this.contentRef.current.addEventListener('scroll', this.handleContentScroll);
        }

        this.scrollToActiveItem();
    }

    componentDidUpdate(prevProps: TocProps, prevState: TocState) {
        const {router, singlePage, items} = this.props;

        let nextState;

        if (prevProps.items !== items) {
            nextState = this.getInitialState();
        }

        if (
            prevProps.router.pathname !== router.pathname ||
            prevProps.router.hash !== router.hash ||
            prevProps.singlePage !== singlePage
        ) {
            nextState = this.computeState(nextState || prevState);
        } else if (prevState.activeId !== this.state.activeId) {
            this.scrollToActiveItem();
        }

        if (nextState) {
            this.setState(nextState);
        }
    }

    componentWillUnmount() {
        if (this.contentRef && this.contentRef.current) {
            this.contentRef.current.removeEventListener('scroll', this.handleContentScroll);
        }
    }

    render() {
        const {items, hideTocHeader, extraHeader} = this.props;
        const content = items ? this.renderList(items) : this.renderEmpty('');

        return (
            <nav className={b()} ref={this.rootRef}>
                {this.renderTop()}
                <div
                    className={b('content', {
                        offset_top: hideTocHeader,
                        'with-extra-header': Boolean(extraHeader),
                    })}
                    ref={this.contentRef}
                >
                    {content}
                </div>
                {this.renderBottom()}
            </nav>
        );
    }

    computeState(prevState: TocState) {
        const {router} = this.props;
        const {pathname, hash} = router;

        const activeUrl = this.normalizeUrl(pathname, hash);
        const activeId = activeUrl && prevState.registry.getIdByUrl(activeUrl as string);

        let fixedById = prevState.fixedById;

        if (activeId && prevState.activeId && activeId !== prevState.activeId) {
            const expandedIds = [activeId].concat(prevState.registry.getParentIds(activeId));
            const dropClosedSign = expandedIds.filter((id) => prevState.fixedById[id] === 'closed');

            if (dropClosedSign.length) {
                fixedById = omit(fixedById, dropClosedSign);
            }
        }

        return {...prevState, activeId, fixedById};
    }

    private normalizeUrl = (path: string, hash: string | undefined) => {
        const {singlePage} = this.props;

        return singlePage ? normalizeHash(hash) : normalizePath(path);
    };

    private renderList = (items: TocItem[]) => {
        const {toggleItem} = this;
        const {singlePage} = this.props;
        const {activeId, fixedById} = this.state;

        const activeItem = activeId && this.state.registry.getItemById(activeId);
        const activeScope: Record<string, boolean> = activeItem
            ? zip([activeId].concat(this.state.registry.getParentIds(activeId)), true)
            : {};

        return (
            <ul className={b('list')} aria-labelledby={this.tocTopId}>
                {items.map((item, index) => {
                    const main = !this.state.registry.getParentId(item.id);
                    const active =
                        (singlePage && !activeId && index === 0 && main) || item.id === activeId;
                    const opened = fixedById[item.id] === 'opened';
                    const closed = fixedById[item.id] === 'closed';
                    const hasItems = Boolean(item.items && item.items.length > 0);
                    const expandable = hasItems && !item.labeled;
                    const expanded =
                        (expandable &&
                            !closed &&
                            (item.expanded || activeScope[item.id] || opened)) ||
                        (hasItems && Boolean(item.labeled));

                    const ref = active ? {ref: this.activeRef} : {};

                    return (
                        <li
                            key={item.id}
                            id={item.id}
                            className={b('list-item', {
                                main,
                                active,
                                opened: expanded,
                                labeled: item.labeled,
                            })}
                        >
                            <Item
                                {...{
                                    ...item,
                                    ...ref,
                                    active,
                                    expanded,
                                    expandable,
                                    toggleItem,
                                }}
                            />
                            {expanded && this.renderList(item.items as TocItem[])}
                        </li>
                    );
                })}
            </ul>
        );
    };

    private renderEmpty(text: string) {
        return <div className={b('empty')}>{text}</div>;
    }

    private renderTopMainContent() {
        const {tocTitleIcon, title, label} = this.props;
        const topHeader = (
            <div className={b('top-header')}>
                <HTML>{title}</HTML>
            </div>
        );

        return (
            <>
                {tocTitleIcon && (
                    <div className={b('top-header-icon')} aria-hidden="true">
                        {tocTitleIcon}
                    </div>
                )}
                {topHeader}
                {label && <TocLabel label={label} />}
            </>
        );
    }

    private renderTopWithExtra() {
        const {router, href, singlePage, extraHeader} = this.props;
        const {contentScrolled} = this.state;

        const isActive = href ? isActiveItem(router, href, singlePage) : false;
        const TopMainComponent = href ? 'a' : 'div';
        const topMainProps = href
            ? {href, className: b('top-main-link', {active: isActive}), 'data-router-shallow': true}
            : {className: b('top-main')};

        return (
            <div
                className={b('top', {scrolled: contentScrolled, 'with-extra-header': true})}
                id={this.tocTopId}
            >
                {extraHeader}
                <TopMainComponent {...topMainProps}>{this.renderTopMainContent()}</TopMainComponent>
            </div>
        );
    }

    private renderTopDefault() {
        const {router, title, href, tocTitleIcon, singlePage, label} = this.props;
        const {contentScrolled} = this.state;

        let topHeader;
        if (href) {
            const active = isActiveItem(router, href, singlePage);
            topHeader = (
                <a
                    href={href}
                    className={b('top-header', {active, link: true})}
                    data-router-shallow
                >
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
            <div className={b('top', {scrolled: contentScrolled})} id={this.tocTopId}>
                {tocTitleIcon && (
                    <div className={b('top-header-icon')} aria-hidden="true">
                        {tocTitleIcon}
                    </div>
                )}
                {topHeader}
                {label && <TocLabel label={label} />}
            </div>
        );
    }

    private renderTop() {
        const {hideTocHeader, extraHeader} = this.props;

        if (hideTocHeader) {
            return null;
        }

        return extraHeader ? this.renderTopWithExtra() : this.renderTopDefault();
    }

    private renderBottom() {
        const {singlePage, onChangeSinglePage, pdfLink} = this.props;
        const {contentScrolled} = this.state;

        return (
            <div className={b('bottom', {scrolled: contentScrolled})}>
                <ControlsLayout
                    controlSize={ControlSizes.L}
                    popupPosition={PopperPosition.TOP_START}
                >
                    <Controls
                        singlePage={singlePage}
                        onChangeSinglePage={onChangeSinglePage}
                        pdfLink={pdfLink}
                    />
                </ControlsLayout>
            </div>
        );
    }

    private scrollToItem = () => {
        if (!this.activeRef.current) {
            return;
        }

        const itemElement = this.activeRef.current;
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

    private scrollToActiveItem = () => {
        if (!this.activeRef.current) {
            return;
        }

        this.scrollToItem();
    };

    private handleContentScroll = () => {
        const contentNode = this.contentRef.current;
        const contentScrolled = contentNode ? contentNode.scrollTop > 0 : false;
        if (contentScrolled !== this.state.contentScrolled) {
            this.setState({contentScrolled});
        }
    };

    private openItem = (id: string) => {
        this.setState((prevState) => ({
            ...prevState,
            fixedById: {
                ...prevState.fixedById,
                [id]: 'opened',
            },
        }));
    };

    private closeItem = (id: string) => {
        const ids = this.state.registry.getChildIds(id);

        this.setState((prevState) => ({
            ...prevState,
            fixedById: {
                ...omit(prevState.fixedById, ids),
                [id]: 'closed',
            },
        }));
    };

    private toggleItem = (id: string, opened: boolean) => {
        if (opened) {
            this.closeItem(id);
        } else {
            this.openItem(id);
        }
    };
}

export default Toc;
