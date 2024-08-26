import React, {forwardRef, memo, useContext} from 'react';
import {ThumbsDown, ThumbsDownFill} from '@gravity-ui/icons';
import {Button} from '@gravity-ui/uikit';
import block from 'bem-cn-lite';

import {useTranslation} from '../../../hooks';
import {Control} from '../../Control';
import {ControlsLayoutContext} from '../../Controls/ControlsLayout';
import {FeedbackView} from '../Feedback';
import { ControlSizes } from 'src/models';

type DislikeControlProps = {
    isVerticalView?: boolean | undefined;
    isDisliked: boolean | undefined;
    isPopupVisible: boolean;
    className?: string | undefined;
    view: FeedbackView | undefined;
    onClick: () => void;
};

const b = block('dc-feedback');

const DislikeControl = memo(
    forwardRef<HTMLButtonElement, DislikeControlProps>(
        ({isDisliked, isPopupVisible, view, onClick}, ref) => {
            const {t} = useTranslation('feedback');
            const {isVerticalView, controlClassName} = useContext(ControlsLayoutContext);
            const tooltipText = isDisliked ? t('cancel-dislike-text') : t('dislike-text');

            const Icon = isDisliked ? ThumbsDownFill : ThumbsDown;

            if (view === FeedbackView.Wide) {
                return (
                    <Button
                        size="xl"
                        view="normal"
                        ref={ref}
                        onClick={onClick}
                        className={b('control', {view})}
                    >
                        <Button.Icon>
                            <Icon width={20} height={20} />
                        </Button.Icon>
                        {t<string>('button-dislike-text')}
                    </Button>
                );
            }

            return (
                <Control
                    size={ControlSizes.XL}
                    onClick={onClick}
                    className={b('control', {view}, controlClassName)}
                    isVerticalView={isVerticalView}
                    tooltipText={tooltipText}
                    ref={ref}
                    icon={Icon}
                    buttonExtraProps={{
                        'aria-expanded': isPopupVisible,
                    }}
                />
            );
        },
    ),
);

DislikeControl.displayName = 'DislikeControl';

export default DislikeControl;
