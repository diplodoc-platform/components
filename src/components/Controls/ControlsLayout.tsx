import React, {PropsWithChildren, createContext} from 'react';

import block from 'bem-cn-lite';

import {PopperPosition} from '../../hooks';
import {ControlSizes} from '../../models';

type ControlsLayoutProps = {
    isWideView?: boolean;
    isVerticalView?: boolean;
    controlClassName?: string;
    controlSize?: ControlSizes;
    popupPosition?: PopperPosition;
};

export const ControlsLayoutContext = createContext<ControlsLayoutProps>({
    controlClassName: '',
    isWideView: false,
    isVerticalView: false,
    controlSize: ControlSizes.M,
    popupPosition: PopperPosition.BOTTOM_END,
});

const b = block('dc-controls');

export const ControlsLayout: React.FC<PropsWithChildren<ControlsLayoutProps>> = ({
    isWideView,
    isVerticalView,
    controlClassName,
    controlSize,
    popupPosition,
    children,
}) => {
    return (
        <ControlsLayoutContext.Provider
            value={{
                controlClassName: controlClassName || b('control'),
                isWideView: isWideView,
                isVerticalView: isVerticalView,
                controlSize: controlSize,
                popupPosition: popupPosition,
            }}
        >
            {children}
        </ControlsLayoutContext.Provider>
    );
};
