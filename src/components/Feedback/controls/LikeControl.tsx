import LikeActiveIcon from '@gravity-ui/icons/svgs/thumbs-up-fill.svg';
import LikeIcon from '@gravity-ui/icons/svgs/thumbs-up.svg';
import {Button, Icon} from '@gravity-ui/uikit';
import block from 'bem-cn-lite';
import React, {forwardRef, memo, useContext} from 'react';

import type {PopperPosition} from '../../../hooks';
import {useTranslation} from '../../../hooks';
import {Control} from '../../Control';
import {ControlsLayoutContext} from '../../Controls/ControlsLayout';
import {FeedbackView} from '../Feedback';

type LikeControlProps = {
    isVerticalView?: boolean | undefined;
    isLiked: boolean | undefined;
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

        if (view === FeedbackView.Wide) {
            return (
                <Button
                    size="m"
                    view="normal"
                    ref={ref}
                    onClick={onClick}
                    className={b('control', {view})}
                >
                    <Button.Icon>
                        <Icon data={isLiked ? LikeActiveIcon : LikeIcon} size={14} />
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
                icon={(args) => <Icon data={isLiked ? LikeActiveIcon : LikeIcon} {...args} />}
                popupPosition={popupPosition}
            />
        );
    }),
);

LikeControl.displayName = 'LikeControl';

export default LikeControl;
