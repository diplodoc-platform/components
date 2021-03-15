import React from 'react';
import block from 'bem-cn-lite';
import {withTranslation, WithTranslation, WithTranslationProps} from 'react-i18next';

import {Popup, PopupPosition} from '../Popup';
import {Button} from '../Button';
import {Checkbox} from '../Checkbox';
import {TextArea} from '../TextArea';
import {Control} from '../Control';

import LikeIcon from '../../../assets/icons/like.svg';
import DislikeIcon from '../../../assets/icons/dislike.svg';

import {ButtonThemes, FeedbackSendData, FeedbackType, Lang} from '../../models';

import './Feedback.scss';

const b = block('dc-feedback');

export enum FeedbackView {
    wide = 'wide',
    regular = 'regular',
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

interface FeedbackState {
    showLikeSuccessPopup: boolean;
    showDislikeSuccessPopup: boolean;
    showDislikeVariantsPopup: boolean;
    feedbackComment: string;
    feedbackCheckboxes: {[key: string]: boolean};
    isDisliked: boolean;
}

type FeedbackInnerProps =
    & FeedbackProps
    & WithTranslation
    & WithTranslationProps;

class Feedback extends React.Component<FeedbackInnerProps, FeedbackState> {
    likeControlRef?: HTMLButtonElement;
    dislikeControlRef?: HTMLButtonElement;

    timeout = 3000;
    timerId: number | unknown = 0;

    state: FeedbackState = {
        showLikeSuccessPopup: false,
        showDislikeSuccessPopup: false,
        showDislikeVariantsPopup: false,
        feedbackComment: '',
        feedbackCheckboxes: {},
        isDisliked: false,
    };

    componentDidMount() {
        this.initStateFromProps();
    }

    componentDidUpdate(prevProps: FeedbackProps) {
        const {i18n, lang, isDisliked} = this.props;
        const {showLikeSuccessPopup, showDislikeSuccessPopup} = this.state;

        if (prevProps.lang !== lang) {
            i18n.changeLanguage(lang);
        }

        if (prevProps.isDisliked !== isDisliked) {
            this.setState({
                isDisliked,
            });
        }

        if (showLikeSuccessPopup || showDislikeSuccessPopup) {
            this.setTimer(() => {
                this.setState({
                    showLikeSuccessPopup: false,
                    showDislikeSuccessPopup: false,
                }, () => {
                    this.clearTimer();
                });
            });
        }
    }

    render() {
        const {lang, i18n, singlePage, onSendFeedback} = this.props;

        if (i18n.language !== lang) {
            i18n.changeLanguage(lang);
        }

        if (singlePage || !onSendFeedback) {
            return null;
        }

        return (
            <React.Fragment>
                {this.renderFeedbackControls()}
                {this.renderFeedbackSuccessPopup()}
                {this.renderDislikeVariantsPopup()}
            </React.Fragment>
        );
    }

    private initStateFromProps = () => {
        const {isDisliked} = this.props;

        this.setState({
            isDisliked,
        });
    };

    private setTimer(callback: () => void) {
        this.timerId = setTimeout(async () => {
            callback();
        }, this.timeout);
    }

    private clearTimer() {
        clearTimeout(this.timerId as number);
        this.timerId = undefined;
    }

    private getPopupPosition() {
        const {
            isVerticalView,
            view = FeedbackView.regular,
        } = this.props;

        if (view === FeedbackView.regular) {
            return isVerticalView ? PopupPosition.left : PopupPosition.bottom;
        }

        return PopupPosition.rightTop;
    }

    private renderFeedbackSuccessPopup() {
        const {showLikeSuccessPopup, showDislikeSuccessPopup} = this.state;
        const {t} = this.props;

        const anchor = showLikeSuccessPopup ? this.likeControlRef : this.dislikeControlRef;
        const visible = showLikeSuccessPopup || showDislikeSuccessPopup;
        const popupWidth = 320;

        if (!visible) {
            return null;
        }

        return (
            <Popup
                anchor={anchor}
                visible={visible}
                onOutsideClick={this.hideFeedbackPopups}
                popupWidth={popupWidth}
                className={b('success-popup')}
                position={this.getPopupPosition()}
            >
                <h3 className={b('popup-title')}>{t('success-title')}</h3>
                <p className={b('popup-text')}>{t('success-text')}</p>
            </Popup>
        );
    }

    private renderDislikeVariantsPopup() {
        const {showDislikeVariantsPopup, feedbackComment, feedbackCheckboxes} = this.state;
        const {t, dislikeVariants} = this.props;
        const popupWidth = 320;

        if (!showDislikeVariantsPopup) {
            return null;
        }

        return (
            <Popup
                anchor={this.dislikeControlRef}
                visible={showDislikeVariantsPopup}
                onOutsideClick={this.onOutsideClick}
                popupWidth={popupWidth}
                className={b('variants-popup')}
                position={this.getPopupPosition()}
            >
                <h3 className={b('popup-title')}>{t('dislike-variants-title')}</h3>
                {dislikeVariants.length ?
                    <div className={b('variants')}>
                        {dislikeVariants.map((variant, index) => (
                            <Checkbox
                                key={index}
                                className={b('variant')}
                                checked={feedbackCheckboxes[variant]}
                                onChange={(event) => {
                                    this.setState({feedbackCheckboxes: {
                                        ...feedbackCheckboxes,
                                        [variant]: event.target.checked,
                                    }});
                                }}
                                label={variant}
                            />
                        ))}
                    </div> : null
                }
                <div className={b('textarea')}>
                    <TextArea
                        size="m"
                        rows={6}
                        placeholder={t('comment-placeholder')}
                        clear
                        value={feedbackComment}
                        onChange={(_event, value) => {
                            this.setState({feedbackComment: value});
                        }}
                    />
                </div>
                <div className={b('variants-actions')}>
                    <Button
                        theme={ButtonThemes.action}
                        className={b('variants-action')}
                        onClick={this.onSendDislikeInformation}
                    >
                        {t('send-action-text')}
                    </Button>
                </div>
            </Popup>
        );
    }

    private renderFeedbackControls() {
        const {view = FeedbackView.regular} = this.props;

        return view === FeedbackView.regular
            ? this.renderRegularFeedbackControls()
            : this.renderWideFeedbackControls();
    }

    private renderRegularFeedbackControls() {
        const {
            isLiked,
            isVerticalView,
            classNameControl,
            view,
            t,
        } = this.props;
        const {isDisliked} = this.state;

        return (
            <React.Fragment>
                <Control
                    onClick={this.onChangeLike}
                    className={b('control', {view}, classNameControl)}
                    isVerticalView={isVerticalView}
                    tooltipText={t(`${isLiked ? 'cancel-' : ''}like-text`)}
                    setRef={this.makeSetRef('likeControlRef')}
                >
                    <LikeIcon className={b('like-button', {active: isLiked, view})}/>
                </Control>
                <Control
                    onClick={this.onChangeDislike}
                    className={b('control', {view}, classNameControl)}
                    isVerticalView={isVerticalView}
                    tooltipText={t(`${isDisliked ? 'cancel-' : ''}dislike-text`)}
                    setRef={this.makeSetRef('dislikeControlRef')}
                >
                    <DislikeIcon className={b('like-button', {active: isDisliked, view})}/>
                </Control>
            </React.Fragment>
        );
    }

    private renderWideFeedbackControls() {
        const {
            isLiked,
            view,
            t,
        } = this.props;
        const {isDisliked} = this.state;

        return (
            <div className={b()}>
                <h3 className={b('title', {view})}>{t('main-question')}</h3>
                <div className={b('controls', {view})}>
                    <Button
                        theme="like"
                        active={isLiked}
                        buttonRef={this.makeSetRef('likeControlRef')}
                        onClick={this.onChangeLike}
                        className={b('control', {view})}
                    >
                        <LikeIcon className={b('like-button', {active: isLiked, view})}/>
                        {t('button-like-text')}
                    </Button>
                    <Button
                        theme="like"
                        active={isDisliked}
                        buttonRef={this.makeSetRef('dislikeControlRef')}
                        onClick={this.onChangeDislike}
                        className={b('control', {view})}
                    >
                        <DislikeIcon className={b('like-button', {active: isDisliked, view})}/>
                        {t('button-dislike-text')}
                    </Button>
                </div>
            </div>
        );
    }

    private onChangeLike = () => {
        const {isLiked, onSendFeedback} = this.props;

        this.setState({
            showLikeSuccessPopup: true,
            showDislikeSuccessPopup: false,
            showDislikeVariantsPopup: false,
            isDisliked: false,
        });

        if (onSendFeedback) {
            onSendFeedback({
                type: isLiked ? FeedbackType.indeterminate : FeedbackType.like,
            });
        }
    };

    private onChangeDislike = () => {
        const {isDisliked, isLiked, onSendFeedback} = this.props;
        const {isDisliked: innerIsDisliked} = this.state;

        if (!isDisliked && !innerIsDisliked) { // Нажать дизлайк и показать окно с доп. информацией
            this.setState({
                showDislikeSuccessPopup: false,
                showDislikeVariantsPopup: true,
                showLikeSuccessPopup: false,
                isDisliked: true,
            }, () => {
                if (isLiked && onSendFeedback) {
                    onSendFeedback({type: FeedbackType.indeterminate});
                }
            });
        } else if (!isDisliked && innerIsDisliked) {
            this.hideFeedbackPopups();
            this.setState({
                isDisliked: false,
            });
        } else if (isDisliked && innerIsDisliked) { // Отжать дизлайк и отправить событие в неопределенное состояние
            this.hideFeedbackPopups();
            this.setState({
                isDisliked: false,
            });

            if (onSendFeedback) {
                onSendFeedback({type: FeedbackType.indeterminate});
            }
        }
    };

    private hideFeedbackPopups = () => {
        this.setState({
            showLikeSuccessPopup: false,
            showDislikeVariantsPopup: false,
            showDislikeSuccessPopup: false,
        });
    };

    private resetFeedbackAdditionalInfo = () => {
        this.setState({
            feedbackComment: '',
            feedbackCheckboxes: {},
        });
    };

    private getPreparedFeedbackAdditionalInfo = () => {
        const {feedbackComment: comment, feedbackCheckboxes} = this.state;

        const answers = Object.keys(feedbackCheckboxes).reduce((acc, key) => {
            if (feedbackCheckboxes[key]) {
                acc.push(key);
            }

            return acc;
        }, [] as string[]);

        return {
            comment,
            answers,
        };
    };

    private onSendDislikeInformation = () => {
        const {onSendFeedback} = this.props;

        this.setState({
            showLikeSuccessPopup: false,
            showDislikeVariantsPopup: false,
            showDislikeSuccessPopup: true,
        }, () => {
            if (onSendFeedback) {
                const type = FeedbackType.dislike;

                const additionalInfo = this.getPreparedFeedbackAdditionalInfo();
                const data = {
                    type,
                    ...additionalInfo,
                };

                onSendFeedback(data);

                this.resetFeedbackAdditionalInfo();
            }
        });
    };

    private onOutsideClick = () => {
        const {
            showDislikeVariantsPopup,
        } = this.state;

        this.hideFeedbackPopups();

        if (showDislikeVariantsPopup && this.state.isDisliked && !this.props.isDisliked) {
            this.setState({isDisliked: false});
        }
    };

    private makeSetRef = <K extends keyof Feedback>(field: K) => (ref: HTMLButtonElement) => {
        this[field] = ref;
    };
}

export default withTranslation('feedback')(Feedback);
