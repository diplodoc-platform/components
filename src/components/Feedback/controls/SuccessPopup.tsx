import React, {RefObject, memo, useContext, useMemo} from 'react';

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

    return (
        <Popup
            anchorRef={anchor}
            open={visible}
            onOutsideClick={onOutsideClick}
            contentClassName={b('success-popup', {view})}
            placement={position}
            modifiers={[
                {name: 'preventOverflow', options: {padding: 1, altBoundary: true, altAxis: true}},
            ]}
        >
            <h3 className={b('popup-title')}>{t<string>('success-title')}</h3>
            <p className={b('popup-text')}>{t<string>('success-text')}</p>
        </Popup>
    );
});

SuccessPopup.displayName = 'FeedbackSuccessPopup';

export default SuccessPopup;
