import React, {memo, useCallback, useState} from 'react';
import {WithTranslation, withTranslation} from 'react-i18next';
import block from 'bem-cn-lite';

import {TextInput} from '../../TextInput';
import {Popup} from '../../Popup';
import {SubscribeView} from '../Subscribe';
import {List, ListItem} from '../../List';
import {Button} from '../../Button';
import {isInvalidEmail} from '../../../utils';
import {getPopupPosition} from '../utils';

import {ButtonThemes, SubscribeData, SubscribeType} from '../../../models';

const b = block('dc-subscribe');

const SubscribeVariantsPopup: React.FC<
    {
        anchor: React.RefObject<HTMLElement>;
        visible: boolean;
        setVisible: (value: boolean) => void;
        isVerticalView?: boolean;
        view?: SubscribeView;
        onSubscribe?: (data: SubscribeData) => void;
        setVisibleSuccessPopup: (value: boolean) => void;
    } & WithTranslation
> = memo((props) => {
    const {
        t,
        visible,
        setVisible,
        anchor,
        view,
        isVerticalView,
        onSubscribe,
        setVisibleSuccessPopup,
    } = props;

    const hide = useCallback(() => setVisible(false), [setVisible]);

    const [email, setEmail] = useState('');
    const [showError, setShowError] = useState(false);
    const [subscribeSelectors, setSubscribeSelectors] = useState(SubscribeType.documentation);

    const resetSubscribeAdditionalInfo = useCallback(() => {
        setEmail('');
    }, []);

    const onSendSubscribeInformation = useCallback(
        (event) => {
            event.preventDefault();

            if (isInvalidEmail(email)) {
                setShowError(true);
                return;
            }

            setVisibleSuccessPopup(true);
            hide();
            setShowError(false);

            if (onSubscribe) {
                onSubscribe({
                    email,
                    type: subscribeSelectors,
                });

                resetSubscribeAdditionalInfo();
            }
        },
        [
            onSubscribe,
            email,
            resetSubscribeAdditionalInfo,
            subscribeSelectors,
            hide,
            setVisibleSuccessPopup,
        ],
    );

    const renderSubscribeVariantsList = useCallback(() => {
        const ITEMS = [
            {value: SubscribeType.documentation, text: t('subscribe-documentation-title')},
            {value: SubscribeType.page, text: t('subscribe-page-title')},
        ];

        return (
            <List
                items={ITEMS as ListItem[]}
                value={subscribeSelectors}
                onItemClick={(item) => setSubscribeSelectors(item.value as SubscribeType)}
            />
        );
    }, [subscribeSelectors, t]);

    const renderSubscribeVariantsTextArea = useCallback(() => {
        return (
            <div className={b('textarea')}>
                <form onSubmit={onSendSubscribeInformation}>
                    <TextInput
                        placeholder={t('subscribe-documentation-placeholder')}
                        error={showError ? t('email-text-invalid') : undefined}
                        text={email}
                        onChange={setEmail}
                    />
                </form>
            </div>
        );
    }, [email, showError, onSendSubscribeInformation, t]);

    const renderSubscribeVariantsActions = useCallback(() => {
        return (
            <div className={b('variants-actions')}>
                <Button
                    theme={ButtonThemes.Action}
                    className={b('variants-action')}
                    onClick={onSendSubscribeInformation}
                >
                    {t('subscribe-text')}
                </Button>
            </div>
        );
    }, [onSendSubscribeInformation, t]);

    return (
        <Popup
            anchor={anchor.current}
            visible={visible}
            onOutsideClick={hide}
            className={b('variants-popup', {view})}
            position={getPopupPosition(isVerticalView, view)}
        >
            {renderSubscribeVariantsList()}
            {renderSubscribeVariantsTextArea()}
            {renderSubscribeVariantsActions()}
        </Popup>
    );
});

SubscribeVariantsPopup.displayName = 'SubscribeVariantsPopup';

export default withTranslation('controls')(SubscribeVariantsPopup);
