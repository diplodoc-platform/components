import React, {PropsWithChildren, useCallback, useEffect, useRef, useState} from 'react';
import block from 'bem-cn-lite';

import {usePopupState, useTranslation} from '../../hooks';
import {FeedbackSendData, FeedbackType} from '../../models';

import DislikeControl from './controls/DislikeControl';
import DislikeVariantsPopup, {FormData} from './controls/DislikeVariantsPopup';
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
                <h3 className={b('title', {view})}>{t<string>('main-question')}</h3>
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
    } = props;

    const likeControlRef = useRef<HTMLButtonElement | null>(null);
    const dislikeControlRef = useRef<HTMLButtonElement | null>(null);

    const [innerState, setInnerState] = useState<FeedbackType>(getInnerState(isLiked, isDisliked));
    useEffect(() => {
        setInnerState(getInnerState(isLiked, isDisliked));
    }, [isLiked, isDisliked, setInnerState]);

    const likeSuccessPopup = usePopupState({autoclose: 3000});
    const dislikeSuccessPopup = usePopupState({autoclose: 3000});
    const dislikeVariantsPopup = usePopupState();

    const hideFeedbackPopups = useCallback(() => {
        likeSuccessPopup.close();
        dislikeSuccessPopup.close();
        dislikeVariantsPopup.close();
    }, [likeSuccessPopup, dislikeSuccessPopup, dislikeVariantsPopup]);

    const onChangeLike = useCallback(() => {
        hideFeedbackPopups();

        if (innerState === FeedbackType.like) {
            setInnerState(FeedbackType.indeterminate);
            onSendFeedback({type: FeedbackType.indeterminate});
        } else {
            setInnerState(FeedbackType.like);
            onSendFeedback({type: FeedbackType.like});
            likeSuccessPopup.open();
        }
    }, [onSendFeedback, setInnerState, innerState, likeSuccessPopup, hideFeedbackPopups]);

    const onChangeDislike = useCallback(() => {
        hideFeedbackPopups();

        if (innerState === FeedbackType.dislike) {
            setInnerState(FeedbackType.indeterminate);
            onSendFeedback({type: FeedbackType.indeterminate});
        } else {
            dislikeVariantsPopup.open();
        }
    }, [onSendFeedback, setInnerState, innerState, dislikeVariantsPopup, hideFeedbackPopups]);

    const onSendDislikeInformation = useCallback(
        (data: FormData) => {
            hideFeedbackPopups();
            dislikeSuccessPopup.open();
            setInnerState(FeedbackType.dislike);
            onSendFeedback({type: FeedbackType.dislike, ...data});
        },
        [onSendFeedback, setInnerState, dislikeSuccessPopup, hideFeedbackPopups],
    );

    return (
        <React.Fragment>
            <ControlsLayout view={view}>
                <LikeControl
                    ref={likeControlRef}
                    view={view}
                    onClick={onChangeLike}
                    isLiked={innerState === FeedbackType.like}
                />
                <DislikeControl
                    ref={dislikeControlRef}
                    view={view}
                    onClick={onChangeDislike}
                    isDisliked={innerState === FeedbackType.dislike}
                />
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
                <DislikeVariantsPopup
                    visible={dislikeVariantsPopup.visible}
                    anchor={dislikeControlRef}
                    view={view}
                    onSubmit={onSendDislikeInformation}
                    onOutsideClick={hideFeedbackPopups}
                />
            )}
        </React.Fragment>
    );
};

export default Feedback;
