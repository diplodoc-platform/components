import DislikeActiveIcon from '@gravity-ui/icons/svgs/thumbs-down-fill.svg';
import DislikeIcon from '@gravity-ui/icons/svgs/thumbs-down.svg';
import {Button, Icon} from '@gravity-ui/uikit';
import block from 'bem-cn-lite';
import React, {forwardRef, memo, useContext} from 'react';

import {useTranslation} from '../../../hooks';
import {Control} from '../../Control';
import {ControlsLayoutContext} from '../../Controls/ControlsLayout';
import {FeedbackView} from '../Feedback';

type DislikeControlProps = {
    isVerticalView?: boolean | undefined;
    isDisliked: boolean | undefined;
    className?: string | undefined;
    view: FeedbackView | undefined;
    onClick: () => void;
};

const b = block('dc-feedback');

const DislikeControl = memo(
    forwardRef<HTMLButtonElement, DislikeControlProps>(({isDisliked, view, onClick}, ref) => {
        const {t} = useTranslation('feedback');
        const {isVerticalView, controlClassName} = useContext(ControlsLayoutContext);
        const tooltipText = isDisliked ? t('cancel-dislike-text') : t('dislike-text');

        if (view === FeedbackView.Wide) {
            return (
                <Button view="normal" ref={ref} onClick={onClick} className={b('control', {view})}>
                    <Button.Icon>
                        <Icon data={isDisliked ? DislikeActiveIcon : DislikeIcon} size={14} />
                    </Button.Icon>
                    {t<string>('button-dislike-text')}
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
                icon={(args) => (
                    <Icon data={isDisliked ? DislikeActiveIcon : DislikeIcon} {...args} />
                )}
            />
        );
    }),
);

DislikeControl.displayName = 'DislikeControl';

export default DislikeControl;
