import React, {ReactElement} from 'react';

import {debounce, isEqual} from 'lodash';
import scrollIntoView from 'scroll-into-view-if-needed';

import {Router} from '../../models';
import {InnerProps} from '../../utils';

interface ScrollspyDefaultProps {
    currentClassName: string;
    sectionOffset: number;
    headerHeight: number;
}

export interface ScrollspyProps extends Partial<ScrollspyDefaultProps> {
    items: string[];
    children: ReactElement[];
    router: Router;
    onSectionClick?: (event: MouseEvent) => void;
    className?: string;
    scrollToListItem?: boolean;
}

interface ScrollspyState {
    targetItems: HTMLElement[];
    inViewState: boolean[];
}

type ScrollspyInnerProps = InnerProps<ScrollspyProps, ScrollspyDefaultProps>;

export class Scrollspy extends React.Component<ScrollspyInnerProps, ScrollspyState> {
    static defaultProps: ScrollspyDefaultProps = {
        currentClassName: 'Scrollspy',
        sectionOffset: 20,
        headerHeight: 0,
    };

    containerRef = React.createRef<HTMLUListElement>();
    itemRefs = this.props.items.map(() => React.createRef<HTMLDivElement>());

    scrollByClick: boolean;
    firstItemIndexInView: number;
    lastItemIndexInView: number;

    constructor(props: ScrollspyInnerProps) {
        super(props);

        this.state = {
            targetItems: [],
            inViewState: [],
        };

        this.scrollByClick = false;
        this.firstItemIndexInView = -1;
        this.lastItemIndexInView = -1;
    }

    componentDidMount() {
        this.initItems();
        window.addEventListener('scroll', this.handleScroll);

        const containerEl = this.containerRef.current;
        if (containerEl) {
            containerEl.addEventListener('scroll', this.updateScrollValues);
        }
    }

    componentDidUpdate(prevProps: Readonly<ScrollspyProps>, prevState: Readonly<ScrollspyState>) {
        const {items, router} = this.props;
        const {inViewState} = this.state;

        if (!isEqual(inViewState, prevState.inViewState)) {
            this.scrollToListItem();
        }

        if (!isEqual(items, prevProps.items) || prevProps.router.pathname !== router.pathname) {
            this.initItems();
        }

        if (router.hash !== prevProps.router.hash) {
            this.pauseScrollHandler();
            this.saveActiveItems(router.hash);
        }
    }

    componentWillUnmount() {
        window.removeEventListener('scroll', this.handleScroll);

        const containerEl = this.containerRef.current;
        if (containerEl) {
            containerEl.removeEventListener('scroll', this.updateScrollValues);
        }
    }

    render() {
        const {children, currentClassName, className} = this.props;
        const {inViewState} = this.state;

        const items = children.map((child, index) => {
            if (!child) {
                return null;
            }

            const ChildTag = child.type;
            let childClassNames = child.props.className;

            if (inViewState[index] && currentClassName.length > 0) {
                childClassNames += ` ${currentClassName}`;

                this.syncScroll(index);
            }

            return (
                <ChildTag
                    key={child.key}
                    className={childClassNames}
                    onClick={this.handleSectionClick}
                    ref={this.itemRefs[index]}
                >
                    {child.props.children}
                </ChildTag>
            );
        });

        return (
            <ul className={className} ref={this.containerRef}>
                {items}
            </ul>
        );
    }

    private updateFirstItemIndexInView(maxItemsInView: number) {
        this.firstItemIndexInView = Math.max(this.lastItemIndexInView - (maxItemsInView - 1), 0);
    }

    private getContainerValues(containerEl: HTMLUListElement) {
        const {children} = this.props;

        /* Average values */
        const childHeight = Math.round(containerEl.scrollHeight / children.length);
        const maxItemsInView = Math.round(containerEl.clientHeight / childHeight);

        return {childHeight, maxItemsInView};
    }

    private updateScrollValues = () => {
        const containerEl = this.containerRef.current;

        if (!containerEl) {
            return;
        }

        const {childHeight, maxItemsInView} = this.getContainerValues(containerEl);
        this.lastItemIndexInView =
            Math.round(containerEl.scrollTop / childHeight) + maxItemsInView - 1;

        this.updateFirstItemIndexInView(maxItemsInView);
    };

    private syncScroll(index: number) {
        const {children} = this.props;
        const containerEl = this.containerRef.current;

        if (!containerEl) {
            return;
        }

        const {childHeight, maxItemsInView} = this.getContainerValues(containerEl);

        if (this.lastItemIndexInView === -1) {
            this.lastItemIndexInView = maxItemsInView - 1;
        }

        this.updateFirstItemIndexInView(maxItemsInView);

        let itemInView = false;
        if (index >= this.lastItemIndexInView) {
            this.lastItemIndexInView = Math.min(index + 1, children.length - 1);
        } else if (index <= this.firstItemIndexInView) {
            this.lastItemIndexInView = Math.max(index + maxItemsInView - 2, maxItemsInView - 1);
        } else {
            itemInView = true;
        }

        this.updateFirstItemIndexInView(maxItemsInView);

        const endIsNear = index + maxItemsInView / 2 > children.length;
        if (itemInView) {
            return;
        } else if (endIsNear) {
            containerEl.scrollTop = containerEl.scrollHeight;
        } else {
            containerEl.scrollTop = childHeight * this.firstItemIndexInView;
        }
    }

    private scrollToListItem = () => {
        if (!this.props.scrollToListItem) {
            return;
        }

        let itemIndex = this.state.inViewState.findIndex((isActive) => isActive);

        if (itemIndex < 0) {
            itemIndex = 0;
        }

        const ref = this.itemRefs[itemIndex] && this.itemRefs[itemIndex].current;

        if (ref) {
            scrollIntoView(ref, {
                scrollMode: 'if-needed',
                block: 'nearest',
                inline: 'nearest',
                behavior: 'smooth',
            });
        }
    };

    private initItems() {
        const {items} = this.props;
        const targetItems = items
            .map((item) => document.getElementById(item.slice(1)))
            .filter(Boolean) as HTMLElement[];

        this.setState({targetItems}, this.initSections);
        this.scrollToListItem();
    }

    private initSections = () => {
        this.saveActiveItems();
    };

    private saveActiveItems(hash?: string) {
        const visibleItems = this.getViewState(hash);

        this.setState({inViewState: visibleItems});
    }

    private getViewState(hash?: string) {
        const {targetItems, inViewState} = this.state;
        const {headerHeight} = this.props;
        const currentOffset = window.pageYOffset;
        const visibleItemOffset: boolean[] = [];
        let isOneActive = false;

        const pureHash = hash && hash.startsWith('#') ? hash.substring(1) : hash;

        targetItems.forEach((item, index) => {
            if (!item) {
                return;
            }

            const offsetTop = item.getBoundingClientRect().top;
            const isVisibleItem = offsetTop < headerHeight + 1;

            if (pureHash) {
                if (pureHash === item.getAttribute('id')) {
                    visibleItemOffset.push(true);
                    isOneActive = true;
                } else {
                    visibleItemOffset.push(false);
                }
            } else if (isVisibleItem) {
                if (visibleItemOffset[index - 1]) {
                    visibleItemOffset[index - 1] = false;
                }

                visibleItemOffset.push(true);
                isOneActive = true;
            } else {
                visibleItemOffset.push(false);
            }
        });

        if (targetItems && targetItems.length && !isOneActive) {
            if (currentOffset < targetItems[0].getBoundingClientRect().top) {
                visibleItemOffset[0] = true;
                isOneActive = true;
            }
        }

        return isOneActive ? visibleItemOffset : inViewState;
    }

    private handleScroll = () => {
        if (this.scrollByClick) {
            // the end of smooth auto-scroll
            window.removeEventListener('scroll', this.handleScrollDebounced);
            window.addEventListener('scroll', this.handleScroll);
            this.scrollByClick = false;
        }
        this.saveActiveItems();
    };

    // eslint-disable-next-line @typescript-eslint/member-ordering, react/sort-comp
    private handleScrollDebounced = debounce(this.handleScroll, 100);

    private pauseScrollHandler() {
        // wait for the end of smooth auto-scroll
        this.scrollByClick = true;
        window.removeEventListener('scroll', this.handleScroll);
        window.addEventListener('scroll', this.handleScrollDebounced);
    }

    private handleSectionClick = (event: MouseEvent) => {
        const {onSectionClick} = this.props;
        const {target} = event;

        if (target && (target as HTMLElement).tagName === 'A') {
            event.stopPropagation();
            this.pauseScrollHandler();
            this.saveActiveItems((target as HTMLAnchorElement).hash);

            if (onSectionClick) {
                onSectionClick(event);
            }
        }
    };
}
