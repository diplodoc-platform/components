import React, {RefObject, memo, useContext, useMemo} from 'react';

import {Popup} from '@gravity-ui/uikit';
import block from 'bem-cn-lite';

import {PopperPosition, useTranslation} from '../../../hooks';
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
    const position = useMemo(() => {
        if (!view || view === FeedbackView.Regular) {
            return isVerticalView ? PopperPosition.LEFT_START : PopperPosition.BOTTOM_END;
        }

        return PopperPosition.RIGHT;
    }, [isVerticalView, view]);

    return (
        <Popup
            anchorRef={anchor}
            open={visible}
            onOutsideClick={onOutsideClick}
            contentClassName={b('success-popup', {view})}
            placement={position}
        >
            <h3 className={b('popup-title')}>{t<string>('success-title')}</h3>
            <p className={b('popup-text')}>{t<string>('success-text')}</p>
        </Popup>
    );
});

SuccessPopup.displayName = 'FeedbackSuccessPopup';

export default SuccessPopup;
