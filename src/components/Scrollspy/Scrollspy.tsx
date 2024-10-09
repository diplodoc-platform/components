import React, {HTMLProps, ReactElement} from 'react';
import debounce from 'lodash/debounce';
import isEqual from 'lodash/isEqual';
import scrollIntoView from 'scroll-into-view-if-needed';

import {Router} from '../../models';
import {InnerProps} from '../../utils';

interface ScrollspyDefaultProps {
    currentClassName: string;
    overflowedClassName: string;
    sectionOffset: number;
    headerHeight: number;
}

export interface ScrollspyProps
    extends Partial<ScrollspyDefaultProps>,
        Partial<HTMLProps<HTMLUListElement>> {
    items: string[];
    children: ReactElement[];
    router: Router;
    onSectionClick?: (event: MouseEvent) => void;
    className?: string;
    overflowedClassName?: string;
    scrollToListItem?: boolean;
    /** Is used to identify items for {@link onActiveItemTitleChange} */
    titles?: string[];
    /** Is called with active item's corresponding value in {@link titles}, if one exists */
    onActiveItemTitleChange?: (title: string) => void;
}

interface ScrollspyState {
    targetItems: HTMLElement[];
    inViewState: boolean[];
}

type ScrollspyInnerProps = InnerProps<ScrollspyProps, ScrollspyDefaultProps>;

export class Scrollspy extends React.Component<ScrollspyInnerProps, ScrollspyState> {
    static defaultProps: ScrollspyDefaultProps = {
        currentClassName: 'Scrollspy',
        overflowedClassName: 'Overflowed',
        sectionOffset: 20,
        headerHeight: 0,
    };

    containerRef = React.createRef<HTMLUListElement>();
    itemRefs = this.props.items.map(() => React.createRef<HTMLDivElement>());

    scrollByClick: boolean;
    prevOffset: number;
    hasActiveHash: boolean;
    firstItemIndexInView: number;
    lastItemIndexInView: number;
    overflowChecked: boolean;

    constructor(props: ScrollspyInnerProps) {
        super(props);

        this.state = {
            targetItems: [],
            inViewState: [],
        };

        this.overflowChecked = false;
        this.scrollByClick = false;
        this.prevOffset = 0;
        this.hasActiveHash = false;
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

        this.checkListOverflow();
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

        if (!this.overflowChecked) {
            this.overflowChecked = true;

            this.checkListOverflow();
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
        const {children, currentClassName, className, ...rest} = this.props;
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
                    aria-current={inViewState[index] ? 'location' : undefined}
                >
                    {child.props.children}
                </ChildTag>
            );
        });

        return (
            <ul className={className} ref={this.containerRef} {...rest}>
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
            .map((item) => document.getElementById(item.split('#')[1]))
            .filter(Boolean) as HTMLElement[];

        this.setState({targetItems}, this.initSections);
        this.scrollToListItem();
    }

    private initSections = () => {
        this.saveActiveItems();
    };

    private saveActiveItems(hash?: string) {
        const {titles, onActiveItemTitleChange} = this.props;

        const visibleItems = this.getViewState(hash);
        const activeItemTitle = this.getActiveItemTitle(titles, visibleItems);

        if (activeItemTitle !== null) {
            onActiveItemTitleChange?.(activeItemTitle);
        }

        this.setState({inViewState: visibleItems});
    }

    private getViewState(hash?: string) {
        const {targetItems, inViewState} = this.state;
        const {headerHeight} = this.props;
        const currentOffset = window.pageYOffset;

        const isScrollUp = currentOffset < this.prevOffset;
        this.prevOffset = currentOffset;

        const pureHash = hash?.startsWith('#') ? hash.substring(1) : hash;

        let newActiveIndex: number;
        if (pureHash) {
            newActiveIndex = targetItems.findIndex(
                (item) => item && item.getAttribute('id') === pureHash,
            );
        } else {
            newActiveIndex = targetItems.reduce<number>((res, item, index) => {
                if (!item) {
                    return res;
                }

                const isScrolledPast = item.getBoundingClientRect().top < headerHeight + 1;
                return isScrolledPast ? index : res;
            }, -1);
        }

        if (targetItems.length && newActiveIndex === -1) {
            newActiveIndex = 0;
        }

        if (newActiveIndex === -1) {
            return inViewState;
        }

        const prevActiveIndex = inViewState.findIndex(Boolean);
        const getNewInViewState = () => {
            if (newActiveIndex === prevActiveIndex) {
                return inViewState;
            }
            const result = new Array<boolean>(targetItems.length).fill(false);
            result[newActiveIndex] = true;
            return result;
        };

        if (pureHash) {
            this.hasActiveHash = true;
            return getNewInViewState();
        }

        // not changing active item until scroll up or the next item becomes active
        if (this.hasActiveHash) {
            if (isScrollUp || newActiveIndex > prevActiveIndex) {
                this.hasActiveHash = false;
                return getNewInViewState();
            }
            return inViewState;
        }

        return getNewInViewState();
    }

    private getActiveItemTitle(titles: string[] | undefined, inViewState: boolean[]) {
        const activeIndex = inViewState.findIndex(Boolean);
        return titles?.[activeIndex] ?? null;
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

    private checkListOverflow = () => {
        const {containerRef, itemRefs} = this;
        const {overflowedClassName} = this.props;

        const containerHeight = containerRef.current?.offsetHeight ?? 0;
        const itemsHeight = itemRefs.reduce(
            (heightSum, item) => heightSum + (item.current?.offsetHeight ?? 0),
            0,
        );

        if (containerHeight < itemsHeight) {
            containerRef.current?.classList.add(overflowedClassName);
        }
    };
}
