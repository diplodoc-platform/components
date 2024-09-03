import React, {PropsWithChildren, RefObject, createRef} from 'react';

import {ClassNameProps} from 'src/models';

export interface OutsideClickProps extends ClassNameProps {
    onOutsideClick: () => void;
    anchor?: HTMLElement | RefObject<HTMLElement> | null;
}

export default class OutsideClick extends React.Component<PropsWithChildren<OutsideClickProps>> {
    ref = createRef<HTMLDivElement>();

    componentDidMount() {
        document.addEventListener('mousedown', this.handleOutsideClick);
    }

    componentWillUnmount() {
        document.removeEventListener('mousedown', this.handleOutsideClick);
    }

    render() {
        const {children, className} = this.props;

        return (
            <div className={className} ref={this.ref}>
                {children}
            </div>
        );
    }

    handleOutsideClick = (e: MouseEvent) => {
        const {onOutsideClick, anchor} = this.props;

        if (
            e.target &&
            !(
                this.ref?.current?.contains(e.target as Node) ||
                (anchor && 'contains' in anchor && anchor.contains(e.target as Node)) ||
                (anchor && 'current' in anchor && anchor.current?.contains(e.target as Node))
            )
        ) {
            onOutsideClick();
        }
    };
}
