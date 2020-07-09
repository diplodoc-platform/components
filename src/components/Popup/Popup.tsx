import React, {createRef, RefObject} from 'react';
import ReactDOM from 'react-dom';
import block from 'bem-cn-lite';
import _ from 'lodash';

import {OutsideClick} from '../OutsideClick';

import './Popup.scss';

const b = block('dc-popup');

export interface PopupProps {
    anchor: React.ReactNode;
    visible: boolean;
    onOutsideClick: () => void;
    popupWidth?: number;
    className?: string;
    align?: 'bottom' | 'left';
}

interface PopupState {
    popupStyle: object;
}

export class Popup extends React.Component<PopupProps, PopupState> {
    ref: RefObject<HTMLDivElement> = createRef();
    state = {
        popupStyle: {},
    };

    componentDidMount() {
        this.calculatePopupStyle();
        window.addEventListener('resize', this.calculatePopupStyle);
    }

    componentDidUpdate(prevProps: Readonly<PopupProps>): void {
        if (!_.isEqual(prevProps, this.props)) {
            this.calculatePopupStyle();
        }
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.calculatePopupStyle);
    }

    render() {
        const {visible, onOutsideClick, children, className} = this.props;
        const {popupStyle} = this.state;

        if (!visible || !document || !document.body) {
            return null;
        }

        return ReactDOM.createPortal(
            <div
                ref={this.ref}
                className={b(null, className)}
                style={popupStyle}
            >
                <OutsideClick onOutsideClick={onOutsideClick}>
                    {children}
                </OutsideClick>
            </div>,
            document.body,
        );
    }

    private getPopupStyle = () => {
        const {popupWidth: fixedWidth, anchor, align = 'bottom'} = this.props;

        if (!this.ref.current) {
            return {};
        }

        const {width: autoWidth} = this.ref.current.getBoundingClientRect();
        const popupWidth = fixedWidth ? fixedWidth : autoWidth;

        if (anchor) {
            const {top, bottom, right, left} = (anchor as HTMLElement).getBoundingClientRect();

            switch (align) {
                case 'bottom':
                    return {
                        left: right - popupWidth,
                        width: popupWidth,
                        top: bottom + 4,
                    };
                case 'left':
                    return {
                        left: left - popupWidth - 4,
                        width: popupWidth,
                        top: top,
                    };
            }
        }

        return {};
    };

    private calculatePopupStyle = () => {
        this.setState({popupStyle: this.getPopupStyle()});
    };
}
