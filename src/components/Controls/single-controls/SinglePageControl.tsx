import React, {memo, useCallback, useContext} from 'react';

import {ChevronsCollapseToLine, ChevronsExpandToLines} from '@gravity-ui/icons';
import block from 'bem-cn-lite';

import {useTranslation} from '../../../hooks';
import {Control} from '../../Control';
import {ControlsLayoutContext} from '../ControlsLayout';

interface ControlProps {
    value?: boolean;
    onChange: (value: boolean) => void;
}

const b = block('dc-controls');

const SinglePageControl = memo<ControlProps>((props) => {
    const {t} = useTranslation('controls');
    const {controlClassName, controlSize, isVerticalView, popupPosition} =
        useContext(ControlsLayoutContext);
    const {value, onChange} = props;

    const onClick = useCallback(() => {
        onChange(!value);
    }, [value, onChange]);

    const activeMode = value ? 'enabled' : 'disabled';
    const Icon = value ? ChevronsExpandToLines : ChevronsCollapseToLine;

    return (
        <Control
            size={controlSize}
            onClick={onClick}
            className={controlClassName}
            isVerticalView={isVerticalView}
            tooltipText={t(`single-page-text-${activeMode}`)}
            icon={(args) => <Icon className={b('icon-rotated')} {...args} />}
            popupPosition={popupPosition}
        />
    );
});

SinglePageControl.displayName = 'SinglePageControl';

export default SinglePageControl;
