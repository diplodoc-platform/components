import React, {useCallback, useState, useEffect, useRef} from 'react';
import block from 'bem-cn-lite';
import {withTranslation, WithTranslation, WithTranslationProps} from 'react-i18next';
import {Checkbox, Popup, TextArea, Button, Icon as IconComponent} from '@gravity-ui/uikit';

import {Control} from '../Control';
import {PopperPosition} from '../../hooks';
import {FeedbackSendData, FeedbackType, Lang} from '../../models';
import {DISLIKE_VARIANTS} from '../../constants';

import DislikeActiveIcon from '@gravity-ui/icons/svgs/thumbs-down-fill.svg';
import DislikeIcon from '@gravity-ui/icons/svgs/thumbs-down.svg';

import './Feedback.scss';

const b = block('dc-feedback');

export enum FeedbackView {
    Wide = 'wide',
    Regular = 'regular',
}

export interface FeedbackProps {
    lang: Lang;
    singlePage?: boolean;
    isLiked?: boolean;
    isDisliked?: boolean;
    dislikeVariants?: string[];
    isVerticalView?: boolean;
    onSendFeedback?: (data: FeedbackSendData) => void;
    view?: FeedbackView;
    classNameControl?: string;
    popupPosition?: PopperPosition;
}

interface FeedbackCheckboxes {
    [key: string]: boolean;
}

type FeedbackInnerProps = FeedbackProps & WithTranslation & WithTranslationProps;

const Feedback: React.FC<FeedbackInnerProps> = (props) => {
    const {
        lang,
        singlePage,
        isLiked,
        isDisliked,
        dislikeVariants = DISLIKE_VARIANTS[lang],
        isVerticalView,
        onSendFeedback,
        view,
        classNameControl,
        i18n,
        popupPosition,
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
    }, [
        isDisliked,
        innerIsDisliked,
        hideFeedbackPopups,
        setInnerIsDisliked,
        showDislikeVariantsPopup,
    ]);

    const onSendDislikeInformation = useCallback(() => {
        setShowDislikeSuccessPopup(true);
        setShowLikeSuccessPopup(false);
        setShowDislikeVariantsPopup(false);

        if (onSendFeedback) {
            const type = FeedbackType.dislike;

            const additionalInfo = getPreparedFeedbackAdditionalInfo(
                feedbackComment,
                feedbackCheckboxes,
            );
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
            return isVerticalView ? PopperPosition.LEFT_START : PopperPosition.BOTTOM_END;
        }

        return PopperPosition.RIGHT;
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
        if (!isDisliked && !innerIsDisliked) {
            // Нажать дизлайк и показать окно с доп. информацией
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
        } else if (isDisliked && innerIsDisliked) {
            // Отжать дизлайк и отправить событие в неопределенное состояние
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
                icon={(args) => (
                    <IconComponent
                        data={LikeIcon}
                        className={b('like-button', {active: isLiked, view})}
                        {...args}
                    />
                )}
                popupPosition={popupPosition}
            />
        );
    }, [
        onChangeLike,
        classNameControl,
        view,
        isVerticalView,
        isLiked,
        setLikeControlRef,
        popupPosition,
        t,
    ]);

    const renderDislikeControl = useCallback(() => {
        return (
            <Control
                onClick={onChangeDislike}
                className={b('control', {view}, classNameControl)}
                isVerticalView={isVerticalView}
                tooltipText={t(`${innerIsDisliked ? 'cancel-' : ''}dislike-text`)}
                setRef={setDislikeControlRef}
                icon={(args) => (
                    <IconComponent
                        data={DislikeIcon}
                        className={b('like-button', {active: innerIsDisliked, view})}
                        {...args}
                    />
                )}
            />
        );
    }, [
        innerIsDisliked,
        onChangeDislike,
        classNameControl,
        view,
        isVerticalView,
        setDislikeControlRef,
        t,
    ]);

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
                <div className={b('container-row', {view})}>
                    <h3 className={b('title', {view})}>{t('main-question')}</h3>
                    <div className={b('controls', {view})}>
                        <Button
                            size="m"
                            view="normal"
                            ref={setLikeControlRef}
                            onClick={onChangeLike}
                            className={b('control', {view})}
                        >
                            <Button.Icon>
                                <IconComponent
                                    data={LikeIcon}
                                    size={14}
                                    className={b('feedback-button', {active: isLiked})}
                                />
                            </Button.Icon>
                            {t('button-like-text')}
                        </Button>
                        <Button
                            view="normal"
                            ref={setDislikeControlRef}
                            onClick={onChangeDislike}
                            className={b('control', {view})}
                        >
                            <Button.Icon>
                                <IconComponent
                                    data={DislikeIcon}
                                    size={14}
                                    className={b('feedback-button', {active: innerIsDisliked})}
                                />
                            </Button.Icon>
                            {t('button-dislike-text')}
                        </Button>
                    </div>
                </div>
            </div>
        );
    }, [
        innerIsDisliked,
        isLiked,
        view,
        t,
        setLikeControlRef,
        setDislikeControlRef,
        onChangeLike,
        onChangeDislike,
    ]);

    const renderFeedbackControls = useCallback(() => {
        return view === FeedbackView.Regular
            ? renderRegularFeedbackControls()
            : renderWideFeedbackControls();
    }, [view, renderRegularFeedbackControls, renderWideFeedbackControls]);

    const renderFeedbackSuccessPopup = useCallback(() => {
        const anchor = showLikeSuccessPopup ? likeControlRef : dislikeControlRef;
        const visible = showLikeSuccessPopup || showDislikeSuccessPopup;

        if (!visible) {
            return null;
        }

        return (
            <Popup
                anchorRef={anchor}
                open={visible}
                onOutsideClick={hideFeedbackPopups}
                contentClassName={b('success-popup', {view})}
                placement={getPopupPosition()}
            >
                <h3 className={b('popup-title')}>{t('success-title')}</h3>
                <p className={b('popup-text')}>{t('success-text')}</p>
            </Popup>
        );
    }, [
        showLikeSuccessPopup,
        showDislikeSuccessPopup,
        hideFeedbackPopups,
        view,
        getPopupPosition,
        t,
    ]);

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
                        onUpdate={(checked) => {
                            setFeedbackCheckboxes({
                                ...feedbackCheckboxes,
                                [variant]: checked,
                            });
                        }}
                        content={variant}
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
                    hasClear
                    value={feedbackComment}
                    onChange={(_event) => {
                        setFeedbackComment(_event.target.value);
                    }}
                />
            </div>
        );
    }, [feedbackComment, t]);

    const renderDislikeVariantsActions = useCallback(() => {
        return (
            <div className={b('variants-actions')}>
                <Button
                    view="action"
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
        if (!showDislikeVariantsPopup) {
            return null;
        }

        return (
            <Popup
                anchorRef={dislikeControlRef}
                open={showDislikeVariantsPopup}
                onOutsideClick={onOutsideClick}
                className={b('variants-popup', {view})}
                placement={getPopupPosition()}
            >
                {renderDislikeVariantsContent()}
            </Popup>
        );
    }, [
        showDislikeVariantsPopup,
        onOutsideClick,
        view,
        getPopupPosition,
        renderDislikeVariantsContent,
    ]);

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

function getPreparedFeedbackAdditionalInfo(
    feedbackComment: string,
    feedbackCheckboxes: FeedbackCheckboxes,
) {
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
