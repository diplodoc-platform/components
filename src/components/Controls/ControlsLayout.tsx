import block from 'bem-cn-lite';
import React, {PropsWithChildren, createContext} from 'react';

import {PopperPosition} from '../../hooks';
import {ControlSizes} from '../../models';

type ControlsLayoutProps = {
    isVerticalView?: boolean;
    controlClassName?: string;
    controlSize?: ControlSizes;
    popupPosition?: PopperPosition;
};

export const ControlsLayoutContext = createContext<ControlsLayoutProps>({
    controlClassName: '',
    isVerticalView: false,
    controlSize: ControlSizes.M,
    popupPosition: PopperPosition.BOTTOM_END,
});

const b = block('dc-controls');

export const ControlsLayout: React.FC<PropsWithChildren<ControlsLayoutProps>> = ({
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
                isVerticalView: isVerticalView,
                controlSize: controlSize,
                popupPosition: popupPosition,
            }}
        >
            {children}
        </ControlsLayoutContext.Provider>
    );
};
