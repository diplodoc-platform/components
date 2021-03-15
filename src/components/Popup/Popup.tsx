import React, {createRef, RefObject} from 'react';
import ReactDOM from 'react-dom';
import block from 'bem-cn-lite';
import _ from 'lodash';

import {OutsideClick} from '../OutsideClick';

import './Popup.scss';

const b = block('dc-popup');

export enum PopupPosition {
    bottom = 'bottom',
    left = 'left',
    rightTop = 'rightTop',
}

export interface PopupProps {
    anchor: React.ReactNode;
    visible: boolean;
    onOutsideClick: () => void;
    popupWidth?: number;
    className?: string;
    position?: PopupPosition;
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
            <OutsideClick onOutsideClick={onOutsideClick}>
                <div
                    ref={this.ref}
                    className={b(null, className)}
                    style={popupStyle}
                >
                    {children}
                </div>
            </OutsideClick>,
            document.body,
        );
    }

    private getPopupStyle = () => {
        const {popupWidth: fixedWidth, anchor, position} = this.props;

        if (!this.ref.current) {
            return {};
        }

        const {width: autoWidth, height: popupHeight} = this.ref.current.getBoundingClientRect();
        const popupWidth = fixedWidth ? fixedWidth : autoWidth;

        if (anchor) {
            const {top, bottom, right, left} = (anchor as HTMLElement).getBoundingClientRect();

            switch (position) {
                case PopupPosition.bottom:
                    return {
                        left: right - popupWidth,
                        width: popupWidth,
                        top: bottom + 4,
                    };
                case PopupPosition.left:
                    return {
                        left: left - popupWidth - 4,
                        width: popupWidth,
                        top: top,
                    };
                case PopupPosition.rightTop:
                    return {
                        left: right + 4,
                        width: popupWidth,
                        top: top - popupHeight,
                    };
            }
        }

        return {};
    };

    private calculatePopupStyle = () => {
        this.setState({popupStyle: this.getPopupStyle()});
    };
}
