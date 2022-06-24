import React, {useCallback, useState, useEffect, useRef} from 'react';
import block from 'bem-cn-lite';
import {withTranslation, WithTranslation, WithTranslationProps} from 'react-i18next';

import {Popup} from '../Popup';
import {Button} from '../Button';
import {Control} from '../Control';
import {List, ListItem} from '../List';
import {TextInput} from '../TextInput';
import {isEmailHasAtSymbol} from '../../utils';
import {PopperPosition} from '../../hooks';
import {ButtonThemes, SubscribeData, Lang, SubscribeType} from '../../models';

import SubscribeIcon from '../../../assets/icons/subscribe.svg';

import './Subscribe.scss';

const b = block('dc-subscribe');

export enum SubscribeView {
    Wide = 'wide',
    Regular = 'regular',
}

export interface SubscribeProps {
    lang: Lang;
    singlePage?: boolean;
    isVerticalView?: boolean;
    onSubscribe?: (data: SubscribeData) => void;
    view?: SubscribeView;
    classNameControl?: string;
}

type SubscribeInnerProps = SubscribeProps & WithTranslation & WithTranslationProps;

const Subscribe: React.FC<SubscribeInnerProps> = (props) => {
    const {lang, singlePage, isVerticalView, onSubscribe, view, classNameControl, i18n, t} = props;

    const subscribeControlRef = useRef<HTMLButtonElement | null>(null);
    const timerId = useRef<number | unknown>();
    const timeout = 60000;

    const [mail, setMail] = useState('');
    const [showSubscribeSuccessPopup, setShowSubscribeSuccessPopup] = useState(false);
    const [showSubscribeVariantsPopup, setShowSubscribeVariantsPopup] = useState(false);
    const [showError, setShowError] = useState(false);
    const [subscribeSelectors, setSubscribeSelectors] = useState(SubscribeType.documentation);

    const hideSubscribePopups = useCallback(() => {
        setShowSubscribeSuccessPopup(false);
        setShowSubscribeVariantsPopup(false);
        setShowError(false);
        setMail('');
    }, []);

    const resetSubscribeAdditionalInfo = useCallback(() => {
        setMail('');
    }, []);

    useEffect(() => {
        i18n.changeLanguage(lang);
    }, [i18n, lang]);

    const setTimer = useCallback((callback: () => void) => {
        timerId.current = setTimeout(async () => {
            callback();
        }, timeout);
    }, []);

    const clearTimer = useCallback(() => {
        clearTimeout(timerId.current as number);
        timerId.current = undefined;
    }, []);

    useEffect(() => {
        if (showSubscribeSuccessPopup) {
            setTimer(() => {
                setShowSubscribeSuccessPopup(false);
                clearTimer();
            });
        }
    }, [clearTimer, setTimer, showSubscribeSuccessPopup]);

    const setSubscribeControlRef = useCallback((ref) => {
        subscribeControlRef.current = ref;
    }, []);

    const onOutsideClick = useCallback(() => {
        hideSubscribePopups();
        setShowError(false);
    }, [hideSubscribePopups]);

    const onSendSubscribeInformation = useCallback(() => {
        if (isEmailHasAtSymbol(mail)) {
            setShowSubscribeSuccessPopup(true);
            setShowSubscribeVariantsPopup(false);
            setShowError(false);

            if (onSubscribe) {
                onSubscribe({
                    mail,
                    type: subscribeSelectors,
                });

                resetSubscribeAdditionalInfo();
            }
        } else {
            setShowError(true);
        }
    }, [onSubscribe, mail, resetSubscribeAdditionalInfo, subscribeSelectors]);

    const getPopupPosition = useCallback(() => {
        if (!view || view === SubscribeView.Regular) {
            return isVerticalView ? PopperPosition.LEFT_START : PopperPosition.BOTTOM_END;
        }

        return PopperPosition.RIGHT;
    }, [isVerticalView, view]);

    const onChangeSubscribe = () => {
        setShowSubscribeVariantsPopup(true);
        setShowSubscribeSuccessPopup(false);
    };

    const renderSubscribeControl = useCallback(() => {
        return (
            <Control
                onClick={onChangeSubscribe}
                className={b('control', {view}, classNameControl)}
                isVerticalView={isVerticalView}
                tooltipText={t(`subscribe-text`)}
                setRef={setSubscribeControlRef}
                icon={(args) => <SubscribeIcon {...args} />}
            />
        );
    }, [classNameControl, view, isVerticalView, setSubscribeControlRef, t]);

    const renderRegularSubscribeControls = useCallback(() => {
        return <React.Fragment>{renderSubscribeControl()}</React.Fragment>;
    }, [renderSubscribeControl]);

    const renderWideSubscribeControls = useCallback(() => {
        return (
            <div className={b('container', {view})}>
                <div className={b('container-row', {view})}>
                    <h3 className={b('title', {view})}>{t('main-question')}</h3>
                    <div className={b('controls', {view})}>
                        <Button
                            theme={ButtonThemes.Flat}
                            buttonRef={setSubscribeControlRef}
                            onClick={onChangeSubscribe}
                            className={b('control', {view})}
                        >
                            <SubscribeIcon className={b('subscribe-button')} />
                            {t('button-Subscribe-text')}
                        </Button>
                    </div>
                </div>
            </div>
        );
    }, [view, t, setSubscribeControlRef]);

    const renderSubscribeControls = useCallback(() => {
        return view === SubscribeView.Regular
            ? renderRegularSubscribeControls()
            : renderWideSubscribeControls();
    }, [view, renderRegularSubscribeControls, renderWideSubscribeControls]);

    const renderSubscribeSuccessPopup = useCallback(() => {
        const anchor = subscribeControlRef.current;
        const visible = showSubscribeSuccessPopup;

        if (!visible) {
            return null;
        }

        return (
            <Popup
                anchor={anchor}
                visible={visible}
                onOutsideClick={hideSubscribePopups}
                className={b('success-popup', {view})}
                position={getPopupPosition()}
            >
                <h3 className={b('popup-title')}>{t('verify-title')}</h3>
                <p className={b('popup-text')}>{t('verify-text')}</p>
            </Popup>
        );
    }, [showSubscribeSuccessPopup, hideSubscribePopups, view, getPopupPosition, t]);

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
    }, [t, subscribeSelectors]);

    const renderSubscribeVariantsTextArea = useCallback(() => {
        return (
            <div className={b('textarea')}>
                <TextInput
                    placeholder={t('subscribe-documentation-placeholder')}
                    error={showError ? t('email-text-invalid') : undefined}
                    text={mail}
                    onChange={(value: string) => {
                        setMail(value);
                    }}
                />
            </div>
        );
    }, [mail, showError, t]);

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

    const renderSubscribeVariantsContent = useCallback(() => {
        return (
            <React.Fragment>
                {renderSubscribeVariantsList()}
                {renderSubscribeVariantsTextArea()}
                {renderSubscribeVariantsActions()}
            </React.Fragment>
        );
    }, [
        renderSubscribeVariantsTextArea,
        renderSubscribeVariantsActions,
        renderSubscribeVariantsList,
    ]);

    const renderSubscribeVariantsPopup = useCallback(() => {
        if (!showSubscribeVariantsPopup) {
            return null;
        }

        return (
            <Popup
                anchor={subscribeControlRef.current}
                visible={showSubscribeVariantsPopup}
                onOutsideClick={onOutsideClick}
                className={b('variants-popup', {view})}
                position={getPopupPosition()}
            >
                {renderSubscribeVariantsContent()}
            </Popup>
        );
    }, [
        showSubscribeVariantsPopup,
        onOutsideClick,
        view,
        getPopupPosition,
        renderSubscribeVariantsContent,
    ]);

    if (singlePage || !onSubscribe) {
        return null;
    }

    return (
        <React.Fragment>
            {renderSubscribeControls()}
            {renderSubscribeSuccessPopup()}
            {renderSubscribeVariantsPopup()}
        </React.Fragment>
    );
};

export default withTranslation('controls')(Subscribe);
