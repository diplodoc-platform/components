import React, {memo, useContext} from 'react';

import {Popup} from '@gravity-ui/uikit';
import block from 'bem-cn-lite';

import {useTranslation} from '../../../hooks';
import {ControlsLayoutContext} from '../../Controls/ControlsLayout';
import {SubscribeView} from '../Subscribe';
import {getPopupPosition} from '../utils';

const b = block('dc-subscribe');

const SubscribeSuccessPopup = memo<{
    anchor: React.RefObject<HTMLElement>;
    view?: SubscribeView;
    onOutsideClick: () => void;
}>(({anchor, view, onOutsideClick}) => {
    const {t} = useTranslation('controls');
    const {isVerticalView} = useContext(ControlsLayoutContext);

    return (
        <Popup
            anchorRef={anchor}
            open={true}
            onOutsideClick={onOutsideClick}
            contentClassName={b('success-popup', {view})}
            placement={getPopupPosition(isVerticalView, view)}
        >
            <h3 className={b('popup-title')}>{t<string>('verify-title')}</h3>
            <p className={b('popup-text')}>{t<string>('verify-text')}</p>
        </Popup>
    );
});

SubscribeSuccessPopup.displayName = 'SubscribeSuccessPopup';

export default SubscribeSuccessPopup;
