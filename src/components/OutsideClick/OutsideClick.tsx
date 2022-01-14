import React, {createRef} from 'react';

export interface OutsideClickProps {
    onOutsideClick: () => void;
    anchor?: HTMLElement | null;
}

export default class OutsideClick extends React.Component<OutsideClickProps> {
    ref = createRef<HTMLDivElement>();

    componentDidMount() {
        document.addEventListener('mousedown', this.handleOutsideClick);
    }

    componentWillUnmount() {
        document.removeEventListener('mousedown', this.handleOutsideClick);
    }

    render() {
        const {children} = this.props;
        return <div ref={this.ref}>{children}</div>;
    }

    handleOutsideClick = (e: MouseEvent) => {
        const {onOutsideClick, anchor} = this.props;

        if (
            e.target &&
            !(this.ref?.current?.contains(e.target as Node) || anchor?.contains(e.target as Node))
        ) {
            onOutsideClick();
        }
    };
}
