import {PopupPosition} from '../../Popup';

export const getPopupPosition = (isVerticalView: boolean | undefined) => {
    return isVerticalView ? PopupPosition.left : PopupPosition.bottom;
};
