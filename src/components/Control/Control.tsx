import type {ButtonProps} from '@gravity-ui/uikit';
import type {PopperPosition} from '../../hooks';

import React, {forwardRef, useCallback, useImperativeHandle, useRef} from 'react';
import {Button, Popup, useDirection} from '@gravity-ui/uikit';
import block from 'bem-cn-lite';

import {usePopupState} from '../../hooks';
import {ControlSizes} from '../../models';
import {getPopupPosition} from '../../utils';

import './Control.scss';

const b = block('dc-control');

export interface IconProps {
    width: number;
    height: number;
}

export interface ControlProps {
    onClick?: () => void;
    setRef?: (ref: HTMLButtonElement) => void;
    isWideView?: boolean;
    isVerticalView?: boolean;
    tooltipText: string;
    isTooltipHidden?: boolean;
    className?: string;
    href?: string;
    target?: string;
    rel?: string;
    size?: ControlSizes;
    icon: React.FC<IconProps>;
    popupPosition?: PopperPosition;
    buttonExtraProps?: ButtonProps['extraProps'];
}

const ICONS_SIZES = {
    [ControlSizes.M]: 16,
    [ControlSizes.L]: 20,
    [ControlSizes.XL]: 20,
};

const Control = forwardRef<HTMLButtonElement, ControlProps>((props, ref) => {
    const {
        onClick,
        className,
        tooltipText,
        isTooltipHidden,
        isWideView,
        isVerticalView,
        size = ControlSizes.M,
        icon,
        popupPosition,
        buttonExtraProps: extraProps,
        href,
        target,
        rel,
    } = props;

    const controlRef = useRef<HTMLButtonElement | null>(null);

    const popupState = usePopupState({autoclose: 3000});
    const direction = useDirection();

    const getTooltipAlign = useCallback(() => {
        if (popupPosition) {
            return popupPosition;
        }

        return getPopupPosition(isVerticalView, direction);
    }, [isVerticalView, popupPosition, direction]);

    useImperativeHandle(ref, () => controlRef.current as HTMLButtonElement, [controlRef]);

    const position = getTooltipAlign();
    const Icon = icon;
    const iconSize = ICONS_SIZES[size];

    // UIKit up: ok
    return (
        <React.Fragment>
            <Button
                ref={controlRef}
                view="flat-secondary"
                className={b(null, className)}
                onClick={onClick}
                onMouseEnter={popupState.open}
                onMouseLeave={popupState.close}
                aria-label={tooltipText}
                size={size}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                {...(href ? ({href, target, rel} as any) : {})} // Button cannot detect type automatically
                {...extraProps}
            >
                <Button.Icon>
                    <Icon width={iconSize} height={iconSize} />
                </Button.Icon>
                {isWideView ? tooltipText : null}
            </Button>
            {controlRef.current && (
                <Popup
                    anchorElement={controlRef.current}
                    open={isTooltipHidden ? false : popupState.visible}
                    onOpenChange={(open) => {
                        if (!open) {
                            popupState.close();
                        }
                    }}
                    className={b('tooltip')}
                    placement={position}
                    returnFocus={false}
                >
                    <span className={b('tooltip-text')}>{tooltipText}</span>
                </Popup>
            )}
        </React.Fragment>
    );
});

Control.displayName = 'DCControl';

export default Control;
