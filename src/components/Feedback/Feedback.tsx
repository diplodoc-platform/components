import type {PropsWithChildren} from 'react';
import type {FeedbackSendData} from '../../models';
import type {FormData} from './controls/FeedbackFormPopup';

import React, {useCallback, useContext, useEffect, useRef, useState} from 'react';
import block from 'bem-cn-lite';

import {InterfaceContext} from '../../contexts/InterfaceContext';
import {useInterface, usePopupState, useTranslation} from '../../hooks';
import {FeedbackType} from '../../models';
import {CommonAnalyticsEvent, useAnalytics} from '../../shared/libs/analytics';

import DislikeControl from './controls/DislikeControl';
import FeedbackControl from './controls/FeedbackControl';
import FeedbackFormPopup from './controls/FeedbackFormPopup';
import LikeControl from './controls/LikeControl';
import SuccessPopup from './controls/SuccessPopup';
import './Feedback.scss';

const b = block('dc-feedback');

export enum FeedbackView {
    Wide = 'wide',
    Regular = 'regular',
}

export interface FeedbackProps {
    isLiked?: boolean;
    isDisliked?: boolean;
    onSendFeedback: (data: FeedbackSendData) => void;
    view?: FeedbackView;
    /**
     * Opt in to the rating-free "leave a comment" entry point.
     * When omitted, falls back to the `feedback-comment` interface flag.
     */
    showComment?: boolean;
}

const getInnerState = (isLiked: boolean, isDisliked: boolean) => {
    switch (true) {
        case Boolean(isDisliked):
            return FeedbackType.dislike;
        case Boolean(isLiked):
            return FeedbackType.like;
        default:
            return FeedbackType.indeterminate;
    }
};

const ControlsLayout: React.FC<PropsWithChildren<{view: FeedbackView}>> = ({view, children}) => {
    const {t} = useTranslation('feedback');

    if (view === FeedbackView.Regular) {
        return <React.Fragment>{children}</React.Fragment>;
    }

    return (
        <div className={b('container', {view})}>
            <div className={b('container-col', {view})}>
                <h3 className={b('title', {view})}>{t('main-question')}</h3>
                <div className={b('controls', {view})}>{children}</div>
            </div>
        </div>
    );
};

const Feedback: React.FC<FeedbackProps> = (props) => {
    const {
        isLiked = false,
        isDisliked = false,
        onSendFeedback,
        view = FeedbackView.Regular,
        showComment,
    } = props;
    const analytics = useAnalytics();
    const likeControlRef = useRef<HTMLButtonElement | null>(null);
    const dislikeControlRef = useRef<HTMLButtonElement | null>(null);
    const feedbackControlRef = useRef<HTMLButtonElement | null>(null);

    const [innerState, setInnerState] = useState<FeedbackType>(getInnerState(isLiked, isDisliked));
    useEffect(() => {
        setInnerState(getInnerState(isLiked, isDisliked));
    }, [isLiked, isDisliked, setInnerState]);

    const likeSuccessPopup = usePopupState({autoclose: 3000});
    const dislikeSuccessPopup = usePopupState({autoclose: 3000});
    const commentSuccessPopup = usePopupState({autoclose: 3000});
    const dislikeVariantsPopup = usePopupState();
    const commentFormPopup = usePopupState();

    const hideFeedbackPopups = useCallback(() => {
        likeSuccessPopup.close();
        dislikeSuccessPopup.close();
        commentSuccessPopup.close();
        dislikeVariantsPopup.close();
        commentFormPopup.close();
    }, [
        likeSuccessPopup,
        dislikeSuccessPopup,
        commentSuccessPopup,
        dislikeVariantsPopup,
        commentFormPopup,
    ]);

    const onChangeLike = useCallback(() => {
        const event =
            view === FeedbackView.Regular
                ? CommonAnalyticsEvent.DOCS_ASIDE_LIKE_CLICK
                : CommonAnalyticsEvent.DOCS_FOOTER_LIKE_CLICK;
        analytics.track(event);
        hideFeedbackPopups();

        if (innerState === FeedbackType.like) {
            setInnerState(FeedbackType.indeterminate);
            onSendFeedback({type: FeedbackType.indeterminate});
        } else {
            setInnerState(FeedbackType.like);
            onSendFeedback({type: FeedbackType.like});
            likeSuccessPopup.open();
        }
    }, [view, analytics, hideFeedbackPopups, innerState, onSendFeedback, likeSuccessPopup]);

    const onChangeDislike = useCallback(() => {
        const event =
            view === FeedbackView.Regular
                ? CommonAnalyticsEvent.DOCS_ASIDE_DISLIKE_CLICK
                : CommonAnalyticsEvent.DOCS_FOOTER_DISLIKE_CLICK;
        analytics.track(event);
        hideFeedbackPopups();

        if (innerState === FeedbackType.dislike) {
            setInnerState(FeedbackType.indeterminate);
            onSendFeedback({type: FeedbackType.indeterminate});
        } else {
            dislikeVariantsPopup.open();
        }
    }, [view, analytics, hideFeedbackPopups, innerState, onSendFeedback, dislikeVariantsPopup]);

    const onSendDislikeInformation = useCallback(
        (data: FormData) => {
            hideFeedbackPopups();
            dislikeSuccessPopup.open();
            setInnerState(FeedbackType.dislike);
            onSendFeedback({type: FeedbackType.dislike, ...data});
        },
        [onSendFeedback, setInnerState, dislikeSuccessPopup, hideFeedbackPopups],
    );

    const onClickFeedback = useCallback(() => {
        const event =
            view === FeedbackView.Regular
                ? CommonAnalyticsEvent.DOCS_ASIDE_FEEDBACK_CLICK
                : CommonAnalyticsEvent.DOCS_FOOTER_FEEDBACK_CLICK;
        analytics.track(event);
        hideFeedbackPopups();
        commentFormPopup.open();
    }, [view, analytics, hideFeedbackPopups, commentFormPopup]);

    const onSendComment = useCallback(
        (data: FormData) => {
            hideFeedbackPopups();
            commentSuccessPopup.open();
            onSendFeedback({type: FeedbackType.comment, comment: data.comment});
        },
        [onSendFeedback, commentSuccessPopup, hideFeedbackPopups],
    );

    const isDislikePopupVisible = dislikeSuccessPopup.visible || dislikeVariantsPopup.visible;
    const isFeedbackHidden = useInterface('feedback');
    // The comment entry point is opt-in: enabled via the `showComment` prop, or
    // (when the prop is omitted) the `feedback-comment` interface flag. So an
    // upgrade adds nothing by default; consumers turn it on explicitly.
    const {interface: viewerInterface} = useContext(InterfaceContext);
    const isCommentEnabled = showComment ?? viewerInterface?.['feedback-comment'] === true; // prop wins; else flag

    if (isFeedbackHidden) {
        return null;
    }

    return (
        <React.Fragment>
            <ControlsLayout view={view}>
                <LikeControl
                    ref={likeControlRef}
                    view={view}
                    onClick={onChangeLike}
                    isLiked={innerState === FeedbackType.like}
                    isPopupVisible={likeSuccessPopup.visible}
                />
                <DislikeControl
                    ref={dislikeControlRef}
                    view={view}
                    onClick={onChangeDislike}
                    isDisliked={innerState === FeedbackType.dislike}
                    isPopupVisible={isDislikePopupVisible}
                />
                {isCommentEnabled &&
                    (view === FeedbackView.Wide ? (
                        // Wide: own full-width row so the button stays content-width and centered
                        <div className={b('comment-row')}>
                            <FeedbackControl
                                ref={feedbackControlRef}
                                view={view}
                                onClick={onClickFeedback}
                            />
                        </div>
                    ) : (
                        // Regular: bare control, like the like/dislike icons in the aside
                        <FeedbackControl
                            ref={feedbackControlRef}
                            view={view}
                            onClick={onClickFeedback}
                        />
                    ))}
            </ControlsLayout>
            {likeControlRef.current && (
                <SuccessPopup
                    visible={likeSuccessPopup.visible}
                    anchor={likeControlRef}
                    view={view}
                    onOutsideClick={hideFeedbackPopups}
                />
            )}
            {dislikeControlRef.current && (
                <SuccessPopup
                    visible={dislikeSuccessPopup.visible}
                    anchor={dislikeControlRef}
                    view={view}
                    onOutsideClick={hideFeedbackPopups}
                />
            )}
            {dislikeControlRef.current && (
                <FeedbackFormPopup
                    visible={dislikeVariantsPopup.visible}
                    anchor={dislikeControlRef}
                    view={view}
                    titleKey="dislike-variants-title"
                    showVariants
                    onSubmit={onSendDislikeInformation}
                    onOutsideClick={hideFeedbackPopups}
                />
            )}
            {isCommentEnabled && feedbackControlRef.current && (
                <SuccessPopup
                    visible={commentSuccessPopup.visible}
                    anchor={feedbackControlRef}
                    view={view}
                    onOutsideClick={hideFeedbackPopups}
                />
            )}
            {isCommentEnabled && feedbackControlRef.current && (
                <FeedbackFormPopup
                    visible={commentFormPopup.visible}
                    anchor={feedbackControlRef}
                    view={view}
                    titleKey="comment-form-title"
                    onSubmit={onSendComment}
                    onOutsideClick={hideFeedbackPopups}
                />
            )}
        </React.Fragment>
    );
};

export default Feedback;
