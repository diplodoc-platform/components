import React, {useCallback, useState, useRef} from 'react';
import block from 'bem-cn-lite';
import {Popup, Button} from '@gravity-ui/uikit';

import {ControlSizes} from '../../models';
import {PopperPosition} from '../../hooks';

import './Control.scss';

const b = block('dc-control');

export interface IconProps {
    width: number;
    height: number;
}

export interface ControlProps {
    onClick?: () => void;
    setRef?: (ref: HTMLButtonElement) => void;
    isVerticalView?: boolean;
    tooltipText: string;
    className?: string;
    size?: ControlSizes;
    icon: React.FC<IconProps>;
    popupPosition?: PopperPosition;
}

const ICONS_SIZES = {
    [ControlSizes.M]: 16,
    [ControlSizes.L]: 20,
};

const Control = (props: ControlProps) => {
    const {
        onClick,
        className,
        tooltipText,
        isVerticalView,
        setRef,
        size = ControlSizes.M,
        icon,
        popupPosition,
    } = props;

    const controlRef = useRef<HTMLButtonElement | null>(null);
    const [isVisibleTooltip, setIsVisibleTooltip] = useState(false);

    const showTooltip = () => setIsVisibleTooltip(true);
    const hideTooltip = () => setIsVisibleTooltip(false);
    const getTooltipAlign = useCallback(() => {
        if (popupPosition) {
            return popupPosition;
        }

        return isVerticalView ? PopperPosition.LEFT_START : PopperPosition.BOTTOM_END;
    }, [isVerticalView, popupPosition]);
    const _setRef = useCallback(
        (ref: HTMLButtonElement) => {
            controlRef.current = ref;

            if (setRef) {
                setRef(ref);
            }
        },
        [setRef],
    );

    const position = getTooltipAlign();
    const Icon = icon;
    const iconSize = ICONS_SIZES[size];

    return (
        <React.Fragment>
            <Button
                view="flat-secondary"
                onClick={onClick}
                ref={_setRef}
                onMouseEnter={showTooltip}
                onMouseLeave={hideTooltip}
                className={b(null, className)}
                size={size}
            >
                <Button.Icon>
                    <Icon width={iconSize} height={iconSize} />
                </Button.Icon>
            </Button>
            <Popup
                anchorRef={controlRef}
                open={isVisibleTooltip}
                onOutsideClick={hideTooltip}
                contentClassName={b('tooltip')}
                placement={position}
            >
                <span className={b('tooltip-text')}>{tooltipText}</span>
            </Popup>
        </React.Fragment>
    );
};

Control.displayName = 'DCControl';

export default Control;
