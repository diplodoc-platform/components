import type {RefObject} from 'react';

import React, {memo, useContext, useMemo} from 'react';
import {Popup, useDirection} from '@gravity-ui/uikit';
import block from 'bem-cn-lite';

import {PopperPosition, useTranslation} from '../../../hooks';
import {getPopupPosition} from '../../../utils';
import {ControlsLayoutContext} from '../../Controls/ControlsLayout';
import {FeedbackView} from '../Feedback';

type SuccessPopupProps = {
    view: FeedbackView;
    visible: boolean;
    anchor: RefObject<HTMLButtonElement>;
    onOutsideClick: () => void;
};

const b = block('dc-feedback');

const SuccessPopup = memo<SuccessPopupProps>(({visible, anchor, onOutsideClick, view}) => {
    const {t} = useTranslation('feedback');
    const {isVerticalView} = useContext(ControlsLayoutContext);
    const direction = useDirection();

    const position = useMemo(() => {
        if (!view || view === FeedbackView.Regular) {
            return getPopupPosition(isVerticalView, direction);
        }

        return PopperPosition.RIGHT;
    }, [isVerticalView, view, direction]);

    // UIKit up: ok
    return (
        <Popup
            anchorRef={anchor}
            open={visible}
            onOutsideClick={onOutsideClick}
            className={b('success-popup', {view})}
            placement={position}
            offset={{mainAxis: 1, crossAxis: 0}}
        >
            <h3 className={b('popup-title')}>{t('success-title')}</h3>
            <p className={b('popup-text')}>{t('success-text')}</p>
        </Popup>
    );
});

SuccessPopup.displayName = 'FeedbackSuccessPopup';

export default SuccessPopup;
