import React, {PropsWithChildren, createContext} from 'react';
import block from 'bem-cn-lite';

import {PopperPosition} from '../../hooks';
import {ControlSizes} from '../../models';

type ControlsLayoutProps = {
    isWideView?: boolean;
    isMobileView?: boolean;
    isVerticalView?: boolean;
    controlClassName?: string;
    controlSize?: ControlSizes;
    popupPosition?: PopperPosition;
};

export const ControlsLayoutContext = createContext<ControlsLayoutProps>({
    controlClassName: '',
    isWideView: false,
    isMobileView: false,
    isVerticalView: false,
    controlSize: ControlSizes.M,
    popupPosition: PopperPosition.BOTTOM_END,
});

const b = block('dc-controls');

export const ControlsLayout: React.FC<PropsWithChildren<ControlsLayoutProps>> = ({
    isWideView,
    isMobileView,
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
                isMobileView: isMobileView,
                isVerticalView: isVerticalView,
                controlSize: controlSize,
                popupPosition: popupPosition,
            }}
        >
            {children}
        </ControlsLayoutContext.Provider>
    );
};
