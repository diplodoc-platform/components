import React, {ReactElement, useCallback, useState, useRef} from 'react';
import block from 'bem-cn-lite';

import {ControlButton} from '../ControlButton';
import {Popup, PopupPosition} from '../Popup';

import './Control.scss';

const b = block('dc-control');

export interface ControlProps {
    onClick: () => void;
    setRef?: (ref: HTMLButtonElement) => void;
    isVerticalView?: boolean;
    tooltipText: string;
    className?: string;
    children: (ReactElement | null)[] | ReactElement<unknown, React.FC>;
}

const Control = (props: ControlProps) => {
    const {
        children,
        onClick,
        className,
        tooltipText,
        isVerticalView,
        setRef,
    } = props;

    const controlRef = useRef<HTMLButtonElement | null>(null);
    const [isVisibleTooltip, setIsVisibleTooltip] = useState(false);

    const showTooltip = () => setIsVisibleTooltip(true);
    const hideTooltip = () => setIsVisibleTooltip(false);
    const getTooltipAlign = useCallback(() => {
        return isVerticalView ? PopupPosition.left : PopupPosition.bottom;
    }, [isVerticalView]);
    const _setRef = useCallback((ref: HTMLButtonElement) => {
        controlRef.current = ref;

        if (setRef) {
            setRef(ref);
        }
    }, [setRef]);

    const position = getTooltipAlign();

    return (
        <React.Fragment>
            <ControlButton
                onClick={onClick}
                buttonRef={_setRef}
                onMouseOver={showTooltip}
                onMouseLeave={hideTooltip}
                className={b(null, className)}
            >
                {children}
            </ControlButton>
            <Popup
                anchor={controlRef.current}
                visible={isVisibleTooltip}
                onOutsideClick={hideTooltip}
                className={b('tooltip')}
                position={position}
            >
                <span className={b('tooltip-text')}>
                    {tooltipText}
                </span>
            </Popup>
        </React.Fragment>
    );
};

Control.displayName = 'DCControl';

export default Control;
