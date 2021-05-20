import block from 'bem-cn-lite';
import ReactDOM from 'react-dom';
import React, {useEffect, useRef, useState} from 'react';

import {PopupArrow} from './PopupArrow';
import {usePopper, useForkRef} from '../../hooks';
import {OutsideClick} from '../OutsideClick';

import './Popup.scss';

const b = block('dc-popup');

export enum PopupPosition {
    BOTTOM_END = 'bottom-end',
    BOTTOM = 'bottom',
    LEFT_START = 'left-start',
    RIGHT_TOP = 'right-top',
    TOP = 'top',
}

export interface PopupProps {
    anchorRef: HTMLElement | null;
    visible: boolean;
    position: PopupPosition;
    onOutsideClick: () => void;
    popupWidth?: number;
    className?: string;
    hasArrow?: boolean;
}

const Popup: React.FC<PopupProps> = (props) => {
    const popupRef = useRef<HTMLDivElement>(null);
    const [popupStyle, setPopupStyle] = useState({});

    useEffect(() => {
        calculatePopupStyle(props, popupRef, setPopupStyle);
        window.addEventListener('resize', () => calculatePopupStyle(props, popupRef, setPopupStyle));

        return () => {
            window.removeEventListener('resize', () => calculatePopupStyle(props, popupRef, setPopupStyle));
        };
    }, []);

    useEffect(() => {
        calculatePopupStyle(props, popupRef, setPopupStyle);
    }, [props]);

    const {visible, onOutsideClick, hasArrow, position, children, className, anchorRef} = props;

    const {attributes, styles, setPopperRef, setArrowRef} = usePopper({
        anchorRef,
        placement: position,
        offset: [0, hasArrow ? 12 : 5],
        modifiers: [],
    });

    const handleRef = useForkRef(popupRef, (ref) => setPopperRef(ref));

    if (!visible || !document || !document.body) {
        return null;
    }

    const portalElement = ReactDOM.createPortal(
        <OutsideClick onOutsideClick={onOutsideClick}>
            <div
                ref={handleRef}
                className={b(null, className)}
                style={{...popupStyle, ...styles.popper}} //...popupStyle,
                // role="tooltip"
                {...attributes.popper}
            >
                {hasArrow && (
                    <PopupArrow
                        position={position}
                        styles={styles.arrow}
                        attributes={attributes.arrow}
                        setArrowRef={setArrowRef}
                    />
                )}
                {children}
            </div>
        </OutsideClick>,
        document.body,
    );

    return (
        <React.Fragment>
            {portalElement}
        </React.Fragment>
    );
};

function getPopupStyle(props: PopupProps, popupRef: React.RefObject<HTMLDivElement>) {
    const {popupWidth: fixedWidth, anchorRef, position, hasArrow} = props;

    if (!popupRef.current) {
        return {};
    }

    const {width: autoWidth, height: popupHeight} = popupRef.current.getBoundingClientRect();
    const popupWidth = fixedWidth ? fixedWidth : autoWidth;

    if (anchorRef) {
        const {top, right} = (anchorRef as HTMLElement).getBoundingClientRect();

        // const anchorWidth = right - left;
        const popupIndent = hasArrow ? 10 : 5;

        // return {bottom, right, popupWidth, anchorWidth};

        switch (position) {
            // case PopupPosition.BOTTOM_END:
            //     return {
            //         left: right - popupWidth,
            //         width: popupWidth,
            //         top: bottom + popupIndent,

            //     };
            // case PopupPosition.BOTTOM:
            //     return {
            //         left: right - popupWidth / 2 - anchorWidth / 2,
            //         width: popupWidth,
            //         top: bottom + popupIndent,
            //         test: { bottom, right, popupWidth, anchorWidth }
            //     };
            // case PopupPosition.LEFT_START:
            //     return {
            //         left: left - popupWidth - popupIndent,
            //         width: popupWidth,
            //         top: top,
            //     };
            case PopupPosition.RIGHT_TOP:
                return {
                    left: right + popupIndent,
                    width: popupWidth,
                    top: top - popupHeight,
                };
        }
    }

    return {};
}

function calculatePopupStyle(
    props: PopupProps,
    popupRef: React.RefObject<HTMLDivElement>,
    setPopupStyle: (obj: object) => void): void {

    const newPopupStyles = getPopupStyle(props, popupRef);
    setPopupStyle(newPopupStyles);
}

export default Popup;
