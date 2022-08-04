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
        onSubmit: () => void;
    } & WithTranslation
> = memo((props) => {
    const {t, visible, setVisible, anchor, view, isVerticalView, onSubscribe, onSubmit} = props;

    const hide = useCallback(() => setVisible(false), [setVisible]);

    const [email, setEmail] = useState('');
    const [showError, setShowError] = useState('');
    const [subscribeSelectors, setSubscribeSelectors] = useState(SubscribeType.documentation);

    const resetSubscribeAdditionalInfo = useCallback(() => {
        setEmail('');
    }, []);

    const onSendSubscribeInformation = useCallback(
        (event) => {
            event.preventDefault();

            if (isInvalidEmail(email)) {
                setShowError(t('email-text-invalid'));
                return;
            }

            setShowError('');

            if (onSubscribe) {
                try {
                    onSubscribe({
                        email,
                        type: subscribeSelectors,
                    });

                    onSubmit();
                } catch (e) {
                    console.error(e);
                    setShowError(t('email-request-fail'));
                }

                resetSubscribeAdditionalInfo();
            }
        },
        [onSubscribe, email, resetSubscribeAdditionalInfo, subscribeSelectors, onSubmit, t],
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

    const renderSubscribeForm = useCallback(() => {
        return (
            <form onSubmit={onSendSubscribeInformation}>
                <div className={b('textarea')}>
                    <TextInput
                        placeholder={t('subscribe-documentation-placeholder')}
                        error={showError || undefined}
                        text={email}
                        onChange={setEmail}
                    />
                </div>
                <div className={b('variants-actions')}>
                    <Button
                        theme={ButtonThemes.Action}
                        className={b('variants-action')}
                        type={'submit'}
                    >
                        {t('subscribe-text')}
                    </Button>
                </div>
            </form>
        );
    }, [email, showError, onSendSubscribeInformation, t]);

    return (
        <Popup
            anchor={anchor.current}
            visible={visible}
            onOutsideClick={hide}
            className={b('variants-popup', {view})}
            position={getPopupPosition(isVerticalView, view)}
        >
            {renderSubscribeVariantsList()}
            {renderSubscribeForm()}
        </Popup>
    );
});

SubscribeVariantsPopup.displayName = 'SubscribeVariantsPopup';

export default withTranslation('controls')(SubscribeVariantsPopup);
