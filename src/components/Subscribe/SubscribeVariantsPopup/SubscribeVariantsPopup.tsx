import React, {SyntheticEvent, memo, useCallback, useContext, useState} from 'react';

import {Button, List, Popup, TextInput} from '@gravity-ui/uikit';
import block from 'bem-cn-lite';

import {useTranslation} from '../../../hooks';
import {SubscribeData, SubscribeType} from '../../../models';
import {isInvalidEmail} from '../../../utils';
import {ControlsLayoutContext} from '../../Controls/ControlsLayout';
import {SubscribeView} from '../Subscribe';
import {getPopupPosition} from '../utils';

const b = block('dc-subscribe');

const LIST_ITEM_HEIGHT = 36;

const SubscribeVariantsPopup = memo<{
    anchor: React.RefObject<HTMLElement>;
    view?: SubscribeView;
    onSubscribe?: (data: SubscribeData) => void;
    onSubmit: () => void;
    onOutsideClick: () => void;
}>((props) => {
    const {t} = useTranslation('controls');
    const {isVerticalView} = useContext(ControlsLayoutContext);
    const {anchor, view, onSubscribe, onSubmit, onOutsideClick} = props;

    const [email, setEmail] = useState('');
    const [showError, setShowError] = useState('');
    const [subscribeSelectors, setSubscribeSelectors] = useState(SubscribeType.documentation);

    const resetSubscribeAdditionalInfo = useCallback(() => {
        setEmail('');
    }, []);

    const onSendSubscribeInformation = useCallback(
        (event: SyntheticEvent) => {
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

        const itemsHeight = LIST_ITEM_HEIGHT * ITEMS.length;
        const selectedItemIndex = ITEMS.findIndex(({value}) => value === subscribeSelectors);

        return (
            <List
                filterable={false}
                items={ITEMS}
                onItemClick={(item) => setSubscribeSelectors(item.value as SubscribeType)}
                selectedItemIndex={selectedItemIndex}
                itemHeight={LIST_ITEM_HEIGHT}
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
                    <Button view="action" className={b('variants-action')} type={'submit'}>
                        {t<string>('subscribe-text')}
                    </Button>
                </div>
            </form>
        );
    }, [email, showError, onSendSubscribeInformation, t]);

    return (
        <Popup
            anchorRef={anchor}
            open={true}
            onOutsideClick={onOutsideClick}
            contentClassName={b('variants-popup', {view})}
            placement={getPopupPosition(isVerticalView, view)}
        >
            {renderSubscribeVariantsList()}
            {renderSubscribeForm()}
        </Popup>
    );
});

SubscribeVariantsPopup.displayName = 'SubscribeVariantsPopup';

export default SubscribeVariantsPopup;
