import block from 'bem-cn-lite';
import ReactDOM from 'react-dom';
import React, {useRef} from 'react';

import {PopupArrow} from './PopupArrow';
import {usePopper, useForkRef, PopperPosition} from '../../hooks';
import {OutsideClick} from '../OutsideClick';

import './Popup.scss';

const b = block('dc-popup');

export interface PopupProps {
    anchor: HTMLElement | null;
    visible: boolean;
    position: PopperPosition;
    onOutsideClick: () => void;
    popupWidth?: number;
    className?: string;
    hasArrow?: boolean;
}

const Popup: React.FC<PopupProps> = (props) => {
    const popupRef = useRef<HTMLDivElement>(null);
    const {visible, onOutsideClick, hasArrow, position, children, className, anchor} = props;

    const {attributes, styles, setPopperRef, setArrowRef} = usePopper({
        anchor,
        placement: position,
        offset: [0, hasArrow ? 12 : 5],
        modifiers: [],
    });

    const handleRef = useForkRef(popupRef, (ref) => setPopperRef(ref));

    if (!visible || !document || !document.body) {
        return null;
    }

    const getPopupArrow = () => {
        return (
            <PopupArrow
                position={position}
                styles={styles.arrow}
                attributes={attributes.arrow}
                setArrowRef={setArrowRef}
            />
        );
    };

    const portalElement = ReactDOM.createPortal(
        <OutsideClick onOutsideClick={onOutsideClick} anchor={anchor}>
            <div
                ref={handleRef}
                className={b(null, className)}
                style={{...styles.popper}}
                {...attributes.popper}
            >
                {hasArrow && getPopupArrow()}
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

export default Popup;
