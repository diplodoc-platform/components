import React, {
    RefObject,
    SyntheticEvent,
    forwardRef,
    memo,
    useCallback,
    useContext,
    useImperativeHandle,
    useMemo,
    useRef,
    useState,
} from 'react';

import {Button, Checkbox, Popup, TextArea} from '@gravity-ui/uikit';
import block from 'bem-cn-lite';

import {PopperPosition, useTranslation} from '../../../hooks';
import {ControlsLayoutContext} from '../../Controls/ControlsLayout';
import {FeedbackView} from '../Feedback';

export interface FeedbackCheckboxes {
    [key: string]: boolean;
}

const b = block('dc-feedback');

const DislikeVariantsList = memo(
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
                        // TODO: fix uikit API - onUpdate(value, key)
                        onUpdate={(state) => {
                            setChecked({
                                ...checked,
                                [variant]: state,
                            });
                        }}
                        content={t<string>(variant)}
                    />
                ))}
            </div>
        );
    }),
);

DislikeVariantsList.displayName = 'DislikeVariantsList';

const DislikeVariantsInput = memo(
    forwardRef<FormPart<string>>((_props, ref) => {
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
                    placeholder={t('comment-placeholder')}
                    hasClear
                    value={feedbackComment}
                    onChange={onChange}
                />
            </div>
        );
    }),
);

DislikeVariantsInput.displayName = 'DislikeVariantsInput';

type FormPart<T> = {
    data(): T;
    clean(): void;
};

export type FormData = {
    comment: string;
    answers: string[];
};

type DislikeVariantsPopupProps = {
    view: FeedbackView;
    visible: boolean;
    anchor: RefObject<HTMLButtonElement>;
    onOutsideClick: () => void;
    onSubmit: (data: FormData) => void;
};

const DislikeVariantsPopup: React.FC<DislikeVariantsPopupProps> = memo(
    ({anchor, visible, view, onOutsideClick, onSubmit}) => {
        const {t} = useTranslation('feedback');
        const {isVerticalView} = useContext(ControlsLayoutContext);
        const position = useMemo(() => {
            if (!view || view === FeedbackView.Regular) {
                return isVerticalView ? PopperPosition.LEFT_START : PopperPosition.BOTTOM_END;
            }

            return PopperPosition.RIGHT;
        }, [isVerticalView, view]);

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
                anchorRef={anchor}
                open={visible}
                onOutsideClick={onOutsideClick}
                contentClassName={b('variants-popup', {view})}
                placement={position}
                modifiers={[
                    {
                        name: 'preventOverflow',
                        options: {padding: 1, altBoundary: true, altAxis: true},
                    },
                ]}
            >
                <h3 className={b('popup-title')}>{t<string>('dislike-variants-title')}</h3>
                <form onSubmit={onFormSubmit}>
                    <DislikeVariantsList ref={feedbackCheckboxes} />
                    <DislikeVariantsInput ref={feedbackComment} />
                    <div className={b('variants-actions')}>
                        <Button view="action" className={b('variants-action')} type={'submit'}>
                            {t<string>('send-action-text')}
                        </Button>
                    </div>
                </form>
            </Popup>
        );
    },
);

DislikeVariantsPopup.displayName = 'FeedbackDislikeVariantsPopup';

export default DislikeVariantsPopup;
