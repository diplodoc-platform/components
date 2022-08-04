import React, {memo, useCallback} from 'react';
import {WithTranslation, withTranslation} from 'react-i18next';
import block from 'bem-cn-lite';

import {SubscribeView} from '../Subscribe';
import {Popup} from '../../Popup';
import useTimeout from '../../../hooks/useTimeout';
import {getPopupPosition} from '../utils';

const b = block('dc-subscribe');

const SubscribeSuccessPopup: React.FC<
    {
        anchor: React.RefObject<HTMLElement>;
        isVerticalView?: boolean;
        view?: SubscribeView;
        visible: boolean;
        setVisible: (value: boolean) => void;
    } & WithTranslation
> = memo((props) => {
    const {t, visible, setVisible, anchor, isVerticalView, view} = props;

    const hide = useCallback(() => setVisible(false), [setVisible]);

    useTimeout(hide, 60000);

    return (
        <Popup
            anchor={anchor.current}
            visible={visible}
            onOutsideClick={hide}
            className={b('success-popup', {view})}
            position={getPopupPosition(isVerticalView, view)}
        >
            <h3 className={b('popup-title')}>{t('verify-title')}</h3>
            <p className={b('popup-text')}>{t('verify-text')}</p>
        </Popup>
    );
});

SubscribeSuccessPopup.displayName = 'SubscribeSuccessPopup';

export default withTranslation('controls')(SubscribeSuccessPopup);
