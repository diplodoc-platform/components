import React, {ReactElement} from 'react';
import _ from 'lodash';

import {InnerProps} from '../../utils';
import {Router} from '../../models';

interface ScrollspyDefaultProps {
    currentClassName: string;
    sectionOffset: number;
    headerOffset: number;
}

export interface ScrollspyProps extends Partial<ScrollspyDefaultProps> {
    items: string[];
    children: ReactElement[];
    router: Router;
    onSectionClick?: (event: MouseEvent) => void;
    className?: string;
}

interface ScrollspyState {
    targetItems: HTMLElement[];
    inViewState: boolean[];
}

type ScrollspyInnerProps = InnerProps<ScrollspyProps, ScrollspyDefaultProps>;

export class Scrollspy extends React.Component<ScrollspyInnerProps, ScrollspyState> {

    static defaultProps = {
        currentClassName: 'Scrollspy',
        sectionOffset: 20,
        headerOffset: 70,
    };

    scrollByClick: boolean;

    constructor(props: ScrollspyInnerProps) {
        super(props);

        this.state = {
            targetItems: [],
            inViewState: [],
        };

        this.scrollByClick = true;
    }

    componentDidMount() {
        this.initItems();
        window.addEventListener('scroll', this.handleScroll);
    }

    componentDidUpdate(prevProps: Readonly<ScrollspyProps>) {
        const {items, router} = this.props;

        if (!_.isEqual(items, prevProps.items) || prevProps.router.pathname !== router.pathname) {
            this.initItems();
        }
    }

    componentWillUnmount() {
        window.removeEventListener('scroll', this.handleScroll);
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
            }

            return (
                <ChildTag key={child.key} className={childClassNames} onClick={this.handleSectionClick}>
                    {child.props.children}
                </ChildTag>
            );
        });

        return (
            <ul className={className}>
                {items}
            </ul>
        );
    }

    private initItems() {
        const {items} = this.props;
        const targetItems = items
            .map((item) => (document.getElementById(item.slice(1))))
            .filter(Boolean) as HTMLElement[];

        this.setState({targetItems}, this.initSections);
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
        const {headerOffset} = this.props;
        const visibleAreaHeight = (window.innerHeight - headerOffset) * 0.33;
        const currentOffset = window.pageYOffset;
        const visibleItemOffset: boolean[] = [];
        let isOneActive = false;
        let isOnePseudoActive = false;

        targetItems.forEach((item, index) => {
            if (!item) {
                return;
            }

            const offsetTop = item.getBoundingClientRect().top;
            const isVisibleItem = visibleAreaHeight > offsetTop;

            if (hash) {
                if (hash === `#${item.getAttribute('id')}`) {
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
            } else if (!isOneActive && currentOffset > offsetTop) {
                if (visibleItemOffset[index - 1]) {
                    visibleItemOffset[index - 1] = false;
                }

                visibleItemOffset.push(true);
                isOnePseudoActive = true;
            } else {
                visibleItemOffset.push(false);
            }
        });

        if (targetItems && targetItems.length && !isOneActive && !isOnePseudoActive) {
            if (currentOffset < targetItems[0].getBoundingClientRect().top) {
                visibleItemOffset[0] = true;
                isOneActive = true;
            }
        }

        return isOneActive || isOnePseudoActive ? visibleItemOffset : inViewState;
    }

    private handleScroll = () => {
        if (this.scrollByClick) {
            this.saveActiveItems();
        } else {
            this.scrollByClick = true;
        }
    };

    private handleSectionClick = (event: MouseEvent) => {
        const {onSectionClick} = this.props;
        const {target} = event;

        if (target && (target as HTMLElement).tagName === 'a') {
            event.stopPropagation();

            this.scrollByClick = false;

            this.saveActiveItems((target as HTMLAnchorElement).hash);

            if (onSectionClick) {
                onSectionClick(event);
            }
        }
    };
}
