import {PopupPosition} from '../../Popup';

export const getPopupPosition = (isVerticalView: boolean | undefined) => {
    return isVerticalView ? PopupPosition.LEFT_START : PopupPosition.BOTTOM_END;
};
