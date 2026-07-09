import type {RefObject, SyntheticEvent} from 'react';

import React, {
    forwardRef,
    memo,
    useCallback,
    useContext,
    useImperativeHandle,
    useMemo,
    useRef,
    useState,
} from 'react';
import {Button, Checkbox, Popup, TextArea, useDirection} from '@gravity-ui/uikit';
import block from 'bem-cn-lite';

import {PopperPosition, useTranslation} from '../../../hooks';
import {getPopupPosition} from '../../../utils';
import {ControlsLayoutContext} from '../../Controls/ControlsLayout';
import {FeedbackView} from '../Feedback';

export interface FeedbackCheckboxes {
    [key: string]: boolean;
}

const b = block('dc-feedback');

const FeedbackVariantsList = memo(
    forwardRef<FormPart<string[]>>((_props, ref) => {
        const {t, i18n} = useTranslation('feedback-variants');
        const variants = i18n.getResourceBundle(i18n.language, 'feedback-variants');
        const [checked, setChecked] = useState({} as FeedbackCheckboxes);

        useImperativeHandle(ref, () => {
            return {
                data() {
                    return Object.keys(checked)
                        .filter((key) => Boolean(checked[key]))
                        .map((key) => variants[key]);
                },

                clean() {
                    setChecked({});
                },
            };
        });

        if (!Object.keys(variants).length) {
            return null;
        }

        return (
            <div className={b('variants')}>
                {Object.keys(variants).map((variant) => (
                    <Checkbox
                        key={variant}
                        className={b('variant')}
                        checked={checked[variant]}
                        // uikit Checkbox onUpdate reports only the value, not the variant key
                        onUpdate={(state) => {
                            setChecked({
                                ...checked,
                                [variant]: state,
                            });
                        }}
                        content={t(variant)}
                    />
                ))}
            </div>
        );
    }),
);

FeedbackVariantsList.displayName = 'FeedbackVariantsList';

const FeedbackCommentInput = memo(
    forwardRef<FormPart<string>, {placeholderKey: string}>(({placeholderKey}, ref) => {
        const {t} = useTranslation('feedback');
        const [feedbackComment, setFeedbackComment] = useState('');
        const onChange = useCallback((event: SyntheticEvent) => {
            setFeedbackComment((event.target as HTMLTextAreaElement).value);
        }, []);

        useImperativeHandle(ref, () => {
            return {
                data() {
                    return feedbackComment;
                },

                clean() {
                    setFeedbackComment('');
                },
            };
        });

        return (
            <div className={b('textarea')}>
                <TextArea
                    size="m"
                    rows={6}
                    placeholder={t(placeholderKey)}
                    hasClear
                    value={feedbackComment}
                    onChange={onChange}
                />
            </div>
        );
    }),
);

FeedbackCommentInput.displayName = 'FeedbackCommentInput';

type FormPart<T> = {
    data(): T;
    clean(): void;
};

export type FormData = {
    comment: string;
    answers: string[];
};

type FeedbackFormPopupProps = {
    view: FeedbackView;
    visible: boolean;
    anchor: RefObject<HTMLButtonElement | null>;
    titleKey: string;
    placeholderKey?: string;
    showVariants?: boolean;
    onOutsideClick: () => void;
    onSubmit: (data: FormData) => void;
};

const FeedbackFormPopup: React.FC<FeedbackFormPopupProps> = memo(
    ({
        anchor,
        visible,
        view,
        titleKey,
        placeholderKey = 'comment-placeholder',
        showVariants = false,
        onOutsideClick,
        onSubmit,
    }) => {
        const {t} = useTranslation('feedback');
        const {isVerticalView} = useContext(ControlsLayoutContext);
        const direction = useDirection();

        const position = useMemo(() => {
            if (!view || view === FeedbackView.Regular) {
                return getPopupPosition(isVerticalView, direction);
            }

            return PopperPosition.RIGHT;
        }, [isVerticalView, view, direction]);

        const feedbackComment = useRef<FormPart<string> | null>(null);
        const feedbackCheckboxes = useRef<FormPart<string[]> | null>(null);

        const onFormSubmit = useCallback(
            (event: SyntheticEvent) => {
                event.preventDefault();

                onSubmit({
                    comment: feedbackComment.current?.data() || '',
                    answers: feedbackCheckboxes.current?.data() || [],
                });

                feedbackComment.current?.clean();
                feedbackCheckboxes.current?.clean();
            },
            [onSubmit],
        );

        return (
            <Popup
                anchorElement={anchor.current}
                open={visible}
                onOutsideClick={onOutsideClick}
                className={b('variants-popup', {view})}
                placement={position}
                offset={{mainAxis: 1, crossAxis: 0}}
            >
                <h3 className={b('popup-title')}>{t(titleKey)}</h3>
                <form onSubmit={onFormSubmit}>
                    {showVariants && <FeedbackVariantsList ref={feedbackCheckboxes} />}
                    <FeedbackCommentInput ref={feedbackComment} placeholderKey={placeholderKey} />
                    <div className={b('variants-actions')}>
                        <Button view="action" className={b('variants-action')} type={'submit'}>
                            {t('send-action-text')}
                        </Button>
                    </div>
                </form>
            </Popup>
        );
    },
);

FeedbackFormPopup.displayName = 'FeedbackFormPopup';

export default FeedbackFormPopup;
