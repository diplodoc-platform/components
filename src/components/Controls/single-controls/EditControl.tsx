import React, {memo, useContext} from 'react';
import {Pencil} from '@gravity-ui/icons';
import {Button} from '@gravity-ui/uikit';
import block from 'bem-cn-lite';

import {useTranslation} from '../../../hooks';
import {Control} from '../../Control';
import {ControlsLayoutContext} from '../ControlsLayout';

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
        const {controlClassName, controlSize, isVerticalView, popupPosition} =
            useContext(ControlsLayoutContext);

        if (view === 'wide') {
            return (
                <a href={vcsUrl} target="_blank" rel="noreferrer noopener" onClick={onClick}>
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
                    onClick={onClick}
                />
            </a>
        );
    },
);

EditControl.displayName = 'EditControl';

export default EditControl;
