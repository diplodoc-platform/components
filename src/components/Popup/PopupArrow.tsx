import React from 'react';
import block from 'bem-cn-lite';

import {PopupPosition} from './Popup';

import './Popup.scss';

const b = block('dc-popup');

interface PopupArrowProps {
    position: PopupPosition;
    styles?: React.CSSProperties;
    attributes?: Record<string, unknown>;
    setArrowRef?: (value: HTMLDivElement) => void;
}

export function PopupArrow(props: PopupArrowProps) {
    const {styles, attributes, setArrowRef} = props;

    return (
        <div
            data-popper-arrow
            ref={setArrowRef}
            className={b('arrow')}
            style={styles}
            {...attributes}
        >
            <div className={b('arrow-content')}>
                <div className={b('arrow-circle-wrapper')}>
                    <div className={b('arrow-circle', {left: true})}></div>
                </div>
                <div className={b('arrow-circle-wrapper')}>
                    <div className={b('arrow-circle', {right: true})}></div>
                </div>
            </div>
        </div>
    );
}
