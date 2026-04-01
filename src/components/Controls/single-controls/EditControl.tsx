import React, {memo, useCallback, useContext} from 'react';
import {Pencil} from '@gravity-ui/icons';
import {Button} from '@gravity-ui/uikit';
import block from 'bem-cn-lite';

import {useTranslation} from '../../../hooks';
import {Control} from '../../Control';
import {ControlsLayoutContext} from '../ControlsLayout';
import {CommonAnalyticsEvent, useAnalytics} from '../../../shared/libs/analytics';

interface EditControlProps {
    vcsUrl: string;
    vcsType?: string;
    view?: string;
    className?: string;
    onClick?(): void;
}

const b = block('dc-controls');

const EditControl = memo<EditControlProps>(
    ({vcsUrl, vcsType = 'github', view, className, onClick}) => {
        const {t} = useTranslation('controls');
        const analytics = useAnalytics();

        const {controlClassName, controlSize, isVerticalView, popupPosition} =
            useContext(ControlsLayoutContext);

        const handleClick = useCallback(() => {
            analytics.track(CommonAnalyticsEvent.DOCS_EDIT_IN_VCS_CLICK);
            onClick?.();
        }, [analytics, onClick]);

        if (view === 'wide') {
            return (
                <a href={vcsUrl} target="_blank" rel="noreferrer noopener" onClick={handleClick}>
                    <Button className={b('control', {view}, className)} view="raised">
                        <Button.Icon>
                            <Pencil width={14} height={14} />
                        </Button.Icon>
                        <span>{t('edit-text')}</span>
                    </Button>
                </a>
            );
        }

        return (
            <a
                href={vcsUrl}
                target="_blank"
                rel="noreferrer noopener"
                className={b('control', className)}
            >
                <Control
                    size={controlSize}
                    className={controlClassName}
                    isVerticalView={isVerticalView}
                    tooltipText={t(`edit-text-${vcsType}`)}
                    icon={Pencil}
                    popupPosition={popupPosition}
                    onClick={handleClick}
                />
            </a>
        );
    },
);

EditControl.displayName = 'EditControl';

export default EditControl;
