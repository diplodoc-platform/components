import type {PopperPosition} from '../../../hooks';

import React, {forwardRef, memo, useContext} from 'react';
import {ThumbsUp, ThumbsUpFill} from '@gravity-ui/icons';
import {Button} from '@gravity-ui/uikit';
import block from 'bem-cn-lite';

import {useTranslation} from '../../../hooks';
import {Control} from '../../Control';
import {ControlsLayoutContext} from '../../Controls/ControlsLayout';
import {FeedbackView} from '../Feedback';

type LikeControlProps = {
    isVerticalView?: boolean | undefined;
    isLiked: boolean | undefined;
    isPopupVisible: boolean;
    className?: string | undefined;
    view: FeedbackView | undefined;
    onClick: () => void;
    popupPosition?: PopperPosition | undefined;
};

const b = block('dc-feedback');

const LikeControl = memo(
    forwardRef<HTMLButtonElement, LikeControlProps>(({isLiked, view, onClick}, ref) => {
        const {t} = useTranslation('feedback');
        const {isVerticalView, popupPosition, controlClassName} = useContext(ControlsLayoutContext);
        const tooltipText = isLiked ? t('cancel-like-text') : t('like-text');

        const Icon = isLiked ? ThumbsUpFill : ThumbsUp;

        if (view === FeedbackView.Wide) {
            return (
                <Button view="normal" ref={ref} onClick={onClick} className={b('control', {view})}>
                    <Button.Icon>
                        <Icon width={20} height={20} />
                    </Button.Icon>
                    {t<string>('button-like-text')}
                </Button>
            );
        }

        return (
            <Control
                onClick={onClick}
                className={b('control', {view}, controlClassName)}
                isVerticalView={isVerticalView}
                tooltipText={tooltipText}
                ref={ref}
                icon={Icon}
                popupPosition={popupPosition}
            />
        );
    }),
);

LikeControl.displayName = 'LikeControl';

export default LikeControl;
