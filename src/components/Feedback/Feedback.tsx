import React, {useCallback, useState, useEffect, useRef} from 'react';
import block from 'bem-cn-lite';
import {withTranslation, WithTranslation, WithTranslationProps} from 'react-i18next';

import {Popup, PopupPosition} from '../Popup';
import {Button} from '../Button';
import {Checkbox} from '../Checkbox';
import {TextArea} from '../TextArea';
import {Control} from '../Control';
import {DividerControl} from '../Controls/single-controls';

import LikeIcon from '../../../assets/icons/like.svg';
import DislikeIcon from '../../../assets/icons/dislike.svg';

import {ButtonThemes, FeedbackSendData, FeedbackType, Lang} from '../../models';

import './Feedback.scss';

const b = block('dc-feedback');

export enum FeedbackView {
    Wide = 'wide',
    Regular = 'regular',
}

export interface FeedbackProps {
    lang: Lang;
    singlePage: boolean;
    isLiked: boolean;
    isDisliked: boolean;
    dislikeVariants: string[];
    isVerticalView?: boolean;
    onSendFeedback?: (data: FeedbackSendData) => void;
    view?: FeedbackView;
    classNameControl?: string;
}

interface FeedbackCheckboxes {
    [key: string]: boolean;
}

type FeedbackInnerProps =
    & FeedbackProps
    & WithTranslation
    & WithTranslationProps;

const Feedback: React.FC<FeedbackInnerProps> = (props) => {
    const {
        lang,
        singlePage,
        isLiked,
        isDisliked,
        dislikeVariants,
        isVerticalView,
        onSendFeedback,
        view,
        classNameControl,
        i18n,
        t,
    } = props;

    const likeControlRef = useRef<HTMLButtonElement | null>(null);
    const dislikeControlRef = useRef<HTMLButtonElement | null>(null);
    const timerId = useRef<number | unknown>();
    const timeout = 3000;

    const [innerIsDisliked, setInnerIsDisliked] = useState(isDisliked);
    const [feedbackComment, setFeedbackComment] = useState('');
    const [feedbackCheckboxes, setFeedbackCheckboxes] = useState({} as FeedbackCheckboxes);
    const [showLikeSuccessPopup, setShowLikeSuccessPopup] = useState(false);
    const [showDislikeSuccessPopup, setShowDislikeSuccessPopup] = useState(false);
    const [showDislikeVariantsPopup, setShowDislikeVariantsPopup] = useState(false);

    const hideFeedbackPopups = useCallback(() => {
        setShowDislikeSuccessPopup(false);
        setShowLikeSuccessPopup(false);
        setShowDislikeVariantsPopup(false);
    }, []);

    const resetFeedbackAdditionalInfo = useCallback(() => {
        setFeedbackComment('');
        setFeedbackCheckboxes({});
    }, []);

    useEffect(() => {
        setInnerIsDisliked(isDisliked);
    }, [isDisliked]);

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
        if (showLikeSuccessPopup || showDislikeSuccessPopup) {
            setTimer(() => {
                setShowDislikeSuccessPopup(false);
                setShowLikeSuccessPopup(false);
                clearTimer();
            });
        }
    }, [isDisliked, clearTimer, setTimer, showLikeSuccessPopup, showDislikeSuccessPopup]);

    const setLikeControlRef = useCallback((ref) => {
        likeControlRef.current = ref;
    }, []);

    const setDislikeControlRef = useCallback((ref) => {
        dislikeControlRef.current = ref;
    }, []);

    const onOutsideClick = useCallback(() => {
        hideFeedbackPopups();

        if (showDislikeVariantsPopup && innerIsDisliked && !isDisliked) {
            setInnerIsDisliked(false);
        }
    }, [isDisliked, innerIsDisliked, hideFeedbackPopups, setInnerIsDisliked, showDislikeVariantsPopup]);

    const onSendDislikeInformation = useCallback(() => {
        setShowDislikeSuccessPopup(true);
        setShowLikeSuccessPopup(false);
        setShowDislikeVariantsPopup(false);

        if (onSendFeedback) {
            const type = FeedbackType.dislike;

            const additionalInfo = getPreparedFeedbackAdditionalInfo(feedbackComment, feedbackCheckboxes);
            const data = {
                type,
                ...additionalInfo,
            };

            onSendFeedback(data);

            resetFeedbackAdditionalInfo();
        }
    }, [onSendFeedback, feedbackComment, feedbackCheckboxes, resetFeedbackAdditionalInfo]);

    const getPopupPosition = useCallback(() => {
        if (!view || view === FeedbackView.Regular) {
            return isVerticalView ? PopupPosition.left : PopupPosition.bottom;
        }

        return PopupPosition.rightTop;
    }, [isVerticalView, view]);

    const onChangeLike = useCallback(() => {
        setShowLikeSuccessPopup(true);
        setShowDislikeSuccessPopup(false);
        setShowDislikeVariantsPopup(false);
        setInnerIsDisliked(false);

        if (onSendFeedback) {
            onSendFeedback({
                type: isLiked ? FeedbackType.indeterminate : FeedbackType.like,
            });
        }
    }, [isLiked, onSendFeedback]);

    const onChangeDislike = useCallback(() => {
        if (!isDisliked && !innerIsDisliked) { // Нажать дизлайк и показать окно с доп. информацией
            setShowDislikeVariantsPopup(true);
            setInnerIsDisliked(true);
            setShowLikeSuccessPopup(false);
            setShowDislikeSuccessPopup(false);

            if (isLiked && onSendFeedback) {
                onSendFeedback({type: FeedbackType.indeterminate});
            }
        } else if (!isDisliked && innerIsDisliked) {
            hideFeedbackPopups();
            setInnerIsDisliked(false);
        } else if (isDisliked && innerIsDisliked) { // Отжать дизлайк и отправить событие в неопределенное состояние
            hideFeedbackPopups();
            setInnerIsDisliked(false);

            if (onSendFeedback) {
                onSendFeedback({type: FeedbackType.indeterminate});
            }
        }
    }, [innerIsDisliked, isDisliked, isLiked, onSendFeedback, hideFeedbackPopups]);

    const renderLikeControl = useCallback(() => {
        return (
            <Control
                onClick={onChangeLike}
                className={b('control', {view}, classNameControl)}
                isVerticalView={isVerticalView}
                tooltipText={t(`${isLiked ? 'cancel-' : ''}like-text`)}
                setRef={setLikeControlRef}
                icon={(args) => <LikeIcon className={b('like-button', {active: isLiked, view})} {...args}/>}
            />
        );
    }, [onChangeLike, classNameControl, view, isVerticalView, isLiked, setLikeControlRef, t]);

    const renderDislikeControl = useCallback(() => {
        return (
            <Control
                onClick={onChangeDislike}
                className={b('control', {view}, classNameControl)}
                isVerticalView={isVerticalView}
                tooltipText={t(`${innerIsDisliked ? 'cancel-' : ''}dislike-text`)}
                setRef={setDislikeControlRef}
                icon={(args) => <DislikeIcon className={b('like-button', {active: innerIsDisliked, view})} {...args}/>}
            />
        );
    }, [innerIsDisliked, onChangeDislike, classNameControl, view, isVerticalView, setDislikeControlRef, t]);

    const renderRegularFeedbackControls = useCallback(() => {
        return (
            <React.Fragment>
                {renderLikeControl()}
                {renderDislikeControl()}
            </React.Fragment>
        );
    }, [renderLikeControl, renderDislikeControl]);

    const renderWideFeedbackControls = useCallback(() => {
        return (
            <div className={b('container', {view})}>
                <DividerControl className={b('divider')} isVerticalView={false}/>
                <div className={b('container-row', {view})}>
                    <h3 className={b('title', {view})}>{t('main-question')}</h3>
                    <div className={b('controls', {view})}>
                        <Button
                            theme={ButtonThemes.Like}
                            active={isLiked}
                            buttonRef={setLikeControlRef}
                            onClick={onChangeLike}
                            className={b('control', {view})}
                        >
                            <LikeIcon className={b('like-button', {active: isLiked, view})}/>
                            {t('button-like-text')}
                        </Button>
                        <Button
                            theme={ButtonThemes.Like}
                            active={innerIsDisliked}
                            buttonRef={setDislikeControlRef}
                            onClick={onChangeDislike}
                            className={b('control', {view})}
                        >
                            <DislikeIcon className={b('like-button', {active: innerIsDisliked, view})}/>
                            {t('button-dislike-text')}
                        </Button>
                    </div>
                </div>
            </div>
        );
    }, [innerIsDisliked, isLiked, view, t, setLikeControlRef, setDislikeControlRef, onChangeLike, onChangeDislike]);

    const renderFeedbackControls = useCallback(() => {
        return view === FeedbackView.Regular
            ? renderRegularFeedbackControls()
            : renderWideFeedbackControls();
    }, [view, renderRegularFeedbackControls, renderWideFeedbackControls]);

    const renderFeedbackSuccessPopup = useCallback(() => {
        const anchor = showLikeSuccessPopup ? likeControlRef.current : dislikeControlRef.current;
        const visible = showLikeSuccessPopup || showDislikeSuccessPopup;
        const popupWidth = 320;

        if (!visible) {
            return null;
        }

        return (
            <Popup
                anchor={anchor}
                visible={visible}
                onOutsideClick={hideFeedbackPopups}
                popupWidth={popupWidth}
                className={b('success-popup')}
                position={getPopupPosition()}
            >
                <h3 className={b('popup-title')}>{t('success-title')}</h3>
                <p className={b('popup-text')}>{t('success-text')}</p>
            </Popup>
        );
    }, [t, hideFeedbackPopups, showLikeSuccessPopup, showDislikeSuccessPopup, getPopupPosition]);

    const renderDislikeVariantsList = useCallback(() => {
        if (!dislikeVariants.length) {
            return null;
        }

        return (
            <div className={b('variants')}>
                {dislikeVariants.map((variant, index) => (
                    <Checkbox
                        key={index}
                        className={b('variant')}
                        checked={feedbackCheckboxes[variant]}
                        onChange={(event) => {
                            setFeedbackCheckboxes({
                                ...feedbackCheckboxes,
                                [variant]: event.target.checked,
                            });
                        }}
                        label={variant}
                    />
                ))}
            </div>
        );
    }, [dislikeVariants, feedbackCheckboxes]);

    const renderDislikeVariantsTextArea = useCallback(() => {
        return (
            <div className={b('textarea')}>
                <TextArea
                    size="m"
                    rows={6}
                    placeholder={t('comment-placeholder')}
                    clear
                    value={feedbackComment}
                    onChange={(_event, value) => {
                        setFeedbackComment(value);
                    }}
                />
            </div>
        );
    }, [feedbackComment, t]);

    const renderDislikeVariantsActions = useCallback(() => {
        return (
            <div className={b('variants-actions')}>
                <Button
                    theme={ButtonThemes.Action}
                    className={b('variants-action')}
                    onClick={onSendDislikeInformation}
                >
                    {t('send-action-text')}
                </Button>
            </div>
        );
    }, [onSendDislikeInformation, t]);

    const renderDislikeVariantsContent = useCallback(() => {
        return (
            <React.Fragment>
                <h3 className={b('popup-title')}>{t('dislike-variants-title')}</h3>
                {renderDislikeVariantsList()}
                {renderDislikeVariantsTextArea()}
                {renderDislikeVariantsActions()}
            </React.Fragment>
        );
    }, [t, renderDislikeVariantsList, renderDislikeVariantsTextArea, renderDislikeVariantsActions]);

    const renderDislikeVariantsPopup = useCallback(() => {
        const popupWidth = 320;

        if (!showDislikeVariantsPopup) {
            return null;
        }

        return (
            <Popup
                anchor={dislikeControlRef.current}
                visible={showDislikeVariantsPopup}
                onOutsideClick={onOutsideClick}
                popupWidth={popupWidth}
                className={b('variants-popup')}
                position={getPopupPosition()}
            >
                {renderDislikeVariantsContent()}
            </Popup>
        );
    }, [showDislikeVariantsPopup, getPopupPosition, onOutsideClick, renderDislikeVariantsContent]);

    if (singlePage || !onSendFeedback) {
        return null;
    }

    return (
        <React.Fragment>
            {renderFeedbackControls()}
            {renderFeedbackSuccessPopup()}
            {renderDislikeVariantsPopup()}
        </React.Fragment>
    );
};

function getPreparedFeedbackAdditionalInfo(feedbackComment: string, feedbackCheckboxes: FeedbackCheckboxes) {
    const answers = Object.keys(feedbackCheckboxes).reduce((acc, key) => {
        if (feedbackCheckboxes[key]) {
            acc.push(key);
        }

        return acc;
    }, [] as string[]);

    return {
        comment: feedbackComment,
        answers,
    };
}

export default withTranslation('feedback')(Feedback);
