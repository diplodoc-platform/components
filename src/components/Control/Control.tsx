import React, {useCallback, useState, useRef} from 'react';
import block from 'bem-cn-lite';

import {ControlButton} from '../ControlButton';
import {Popup, PopupPosition} from '../Popup';
import {ControlSizes} from '../../models';

import './Control.scss';

const b = block('dc-control');

export interface IconProps {
    width?: number;
    height?: number;
}

export interface ControlProps {
    onClick: () => void;
    setRef?: (ref: HTMLButtonElement) => void;
    isVerticalView?: boolean;
    tooltipText: string;
    className?: string;
    size?: ControlSizes;
    icon: React.FC<IconProps>;
}

const ICONS_SIZES = {
    [ControlSizes.s]: 16,
    [ControlSizes.m]: 24,
};

const Control = (props: ControlProps) => {
    const {
        onClick,
        className,
        tooltipText,
        isVerticalView,
        setRef,
        size = ControlSizes.s,
        icon,
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
    const Icon = icon;
    const iconSize = ICONS_SIZES[size];

    return (
        <React.Fragment>
            <ControlButton
                onClick={onClick}
                buttonRef={_setRef}
                onMouseOver={showTooltip}
                onMouseLeave={hideTooltip}
                className={b(null, className)}
                size={size}
            >
                <Icon
                    width={iconSize}
                    height={iconSize}
                />
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
