import {SubscribeView} from './Subscribe';
import {PopperPosition} from '../../hooks';

export const getPopupPosition = (isVerticalView: boolean | undefined, view?: SubscribeView) => {
    if (!view || view === SubscribeView.Regular) {
        return isVerticalView ? PopperPosition.LEFT_START : PopperPosition.BOTTOM_END;
    }

    return PopperPosition.RIGHT;
};
