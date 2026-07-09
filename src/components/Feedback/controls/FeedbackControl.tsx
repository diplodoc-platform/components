import React, {forwardRef, memo, useContext} from 'react';
import {Comment} from '@gravity-ui/icons';
import {Button} from '@gravity-ui/uikit';
import block from 'bem-cn-lite';

import {useTranslation} from '../../../hooks';
import {Control} from '../../Control';
import {ControlsLayoutContext} from '../../Controls/ControlsLayout';
import {FeedbackView} from '../Feedback';

type FeedbackControlProps = {
    view: FeedbackView | undefined;
    onClick: () => void;
};

const b = block('dc-feedback');

const FeedbackControl = memo(
    forwardRef<HTMLButtonElement, FeedbackControlProps>(({view, onClick}, ref) => {
        const {t} = useTranslation('feedback');
        const {isVerticalView, popupPosition, controlClassName} = useContext(ControlsLayoutContext);

        if (view === FeedbackView.Wide) {
            return (
                <Button
                    view="flat"
                    ref={ref}
                    onClick={onClick}
                    className={b('comment-action', {view})}
                >
                    <Button.Icon>
                        <Comment width={20} height={20} />
                    </Button.Icon>
                    {t('comment-text')}
                </Button>
            );
        }

        return (
            <Control
                onClick={onClick}
                className={b('control', {view}, controlClassName)}
                isVerticalView={isVerticalView}
                tooltipText={t('comment-text')}
                ref={ref}
                icon={Comment}
                popupPosition={popupPosition}
            />
        );
    }),
);

FeedbackControl.displayName = 'FeedbackControl';

export default FeedbackControl;
