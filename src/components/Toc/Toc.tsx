import React from 'react';
import block from 'bem-cn-lite';

import {omit} from 'lodash';
import {ControlSizes, Lang, Router, TocData, TocItem} from '../../models';
import {TocItem as Item} from '../TocItem';
import {HTML} from '../HTML';
import {Controls} from '../Controls';

import {isActiveItem, normalizeHash, normalizePath} from '../../utils';
import {TocItemRegistry} from './TocItemRegistry';

import './Toc.scss';
import {PopperPosition} from '../../hooks';

const b = block('dc-toc');
const HEADER_DEFAULT_HEIGHT = 0;

function zip<T>(array: string[], fill: T): Record<string, T> {
    return array.reduce((acc, item) => Object.assign(acc, {[item]: fill}), {});
}

export interface TocProps extends TocData {
    router: Router;
    headerHeight?: number;
    tocTitleIcon?: React.ReactNode;
    hideTocHeader?: boolean;
    lang: Lang;
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
    activeRef = React.createRef<Item>();

    containerEl: HTMLElement | null = null;
    footerEl: HTMLElement | null = null;

    constructor(props: TocProps) {
        super(props);

        this.state = this.computeState(this.getInitialState());
    }

    getInitialState() {
        return {
            registry: new TocItemRegistry(this.props.items, this.normalizeUrl),
            fixedById: {},
            activeId: null,
            contentScrolled: false,
        };
    }

    componentDidMount() {
        this.containerEl = document.querySelector('.Layout__content');
        this.footerEl = document.querySelector('.Footer');
        this.setTocHeight();

        window.addEventListener('scroll', this.handleScroll);
        window.addEventListener('resize', this.handleResize);
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
            this.setTocHeight();

            nextState = this.computeState(nextState || prevState);
        } else if (prevState.activeId !== this.state.activeId) {
            this.scrollToActiveItem();
        }

        if (nextState) {
            this.setState(nextState);
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
        const {items, hideTocHeader} = this.props;
        const content = items ? this.renderList(items) : this.renderEmpty('');

        return (
            <div className={b()} ref={this.rootRef}>
                {this.renderTop()}
                <div className={b('content', {offset_top: hideTocHeader})} ref={this.contentRef}>
                    {content}
                </div>
                {this.renderBottom()}
            </div>
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
            <ul className={b('list')}>
                {items.map((item, index) => {
                    const main = !this.state.registry.getParentId(item.id);
                    const active =
                        (singlePage && !activeId && index === 0 && main) || item.id === activeId;
                    const opened = fixedById[item.id] === 'opened';
                    const closed = fixedById[item.id] === 'closed';
                    const expandable = Boolean(item.items && item.items.length > 0);
                    const expanded =
                        expandable && !closed && (item.expanded || activeScope[item.id] || opened);

                    const ref = active ? {ref: this.activeRef} : {};

                    return (
                        <li
                            key={item.id}
                            id={item.id}
                            className={b('list-item', {main, active, opened: expanded})}
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

    private renderTop() {
        const {router, title, href, tocTitleIcon, hideTocHeader, singlePage} = this.props;
        const {contentScrolled} = this.state;
        let topHeader;

        if (hideTocHeader) {
            return null;
        }

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
            <div className={b('top', {scrolled: contentScrolled})}>
                {tocTitleIcon ? <div className={b('top-header-icon')}>{tocTitleIcon}</div> : null}
                {topHeader}
            </div>
        );
    }

    private renderBottom() {
        const {lang, singlePage, onChangeSinglePage, pdfLink} = this.props;
        const {contentScrolled} = this.state;

        return (
            <div className={b('bottom', {scrolled: contentScrolled})}>
                <Controls
                    lang={lang}
                    singlePage={singlePage}
                    onChangeSinglePage={onChangeSinglePage}
                    popupPosition={PopperPosition.TOP_START}
                    controlSize={ControlSizes.L}
                    pdfLink={pdfLink}
                />
            </div>
        );
    }

    private setTocHeight() {
        const {headerHeight = HEADER_DEFAULT_HEIGHT} = this.props;
        const containerHeight = this.containerEl?.offsetHeight ?? 0;
        const footerHeight = this.footerEl?.offsetHeight ?? 0;
        const scrollDiff =
            window.scrollY + window.innerHeight + footerHeight - headerHeight - containerHeight;
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

    private handleScroll = () => {
        this.setTocHeight();
    };

    private handleResize = () => {
        this.setTocHeight();
    };

    private scrollToActiveItem = () => {
        if (!this.activeRef.current) {
            return;
        }

        this.activeRef.current.scrollToItem();
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
