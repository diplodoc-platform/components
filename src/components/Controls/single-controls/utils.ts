import {PopperPosition} from '../../../hooks';

export const getPopupPosition = (isVerticalView: boolean | undefined) => {
    return isVerticalView ? PopperPosition.LEFT_START : PopperPosition.BOTTOM_END;
};
