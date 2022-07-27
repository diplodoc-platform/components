import React, {memo, useCallback, useState} from 'react';
import {WithTranslation, withTranslation} from 'react-i18next';
import block from 'bem-cn-lite';
import {Button, List, Popup, TextInput} from '@yandex-cloud/uikit';

import {SubscribeView} from '../Subscribe';
import {isInvalidEmail} from '../../../utils';
import {getPopupPosition} from '../utils';

import {SubscribeData, SubscribeType} from '../../../models';

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

        const itemHeight = 36;
        const itemsHeight = itemHeight * ITEMS.length;
        const selectedItemIndex = ITEMS.findIndex(({value}) => value === subscribeSelectors);

        return (
            <List
                filterable={false}
                items={ITEMS}
                onItemClick={(item) => setSubscribeSelectors(item.value as SubscribeType)}
                selectedItemIndex={selectedItemIndex}
                itemHeight={itemHeight}
                itemsHeight={itemsHeight}
                renderItem={(item) => <div className={b('variant__list-item')}>{item.text}</div>}
            />
        );
    }, [subscribeSelectors, t]);

    const renderSubscribeForm = useCallback(() => {
        return (
            <form onSubmit={onSendSubscribeInformation}>
                <div className={b('textarea')}>
                    <TextInput
                        size="l"
                        placeholder={t('subscribe-documentation-placeholder')}
                        error={showError || undefined}
                        value={email}
                        onUpdate={setEmail}
                    />
                </div>
                <div className={b('variants-actions')}>
                    <Button
                        view="action"
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
            anchorRef={anchor}
            open={visible}
            onOutsideClick={hide}
            className={b('variants-popup', {view})}
            placement={getPopupPosition(isVerticalView, view)}
        >
            {renderSubscribeVariantsList()}
            {renderSubscribeForm()}
        </Popup>
    );
});

SubscribeVariantsPopup.displayName = 'SubscribeVariantsPopup';

export default withTranslation('controls')(SubscribeVariantsPopup);
