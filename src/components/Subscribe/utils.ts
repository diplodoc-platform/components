import {ThemeContextProps} from "@gravity-ui/uikit";

import {PopperPosition} from '../../hooks';
import {getPopupPosition} from "../../utils";

import {SubscribeView} from './Subscribe';

export const getSubscribePopupPosition = (isVerticalView: boolean | undefined, view?: SubscribeView, direction?: ThemeContextProps['direction']) => {
    if (!view || view === SubscribeView.Regular) {
        return getPopupPosition(isVerticalView, direction)
    }

    return PopperPosition.RIGHT;
};
