import React, {createRef} from 'react';

export interface OutsideClickProps {
    onOutsideClick: () => void;
}

export default class OutsideClick extends React.Component<OutsideClickProps> {
    ref = createRef<HTMLDivElement>();

    componentDidMount() {
        document.addEventListener('click', this.handleOutsideClick);
    }

    componentWillUnmount() {
        document.removeEventListener('click', this.handleOutsideClick);
    }

    render() {
        const {children} = this.props;
        return (
            <div ref={this.ref}>
                {children}
            </div>
        );
    }

    handleOutsideClick = (e: MouseEvent) => {
        if (e.target &&
            this.ref && this.ref.current &&
            !this.ref.current.contains(e.target as Node)) {
            this.props.onOutsideClick();
        }
    };
}
