import FullScreenClickedIcon from '@gravity-ui/icons/svgs/square-dashed-circle.svg';
import FullScreenIcon from '@gravity-ui/icons/svgs/square-dashed.svg';
import {Icon} from '@gravity-ui/uikit';
import React, {memo, useCallback, useContext, useEffect} from 'react';

import {useTranslation} from '../../../hooks';
import {Control} from '../../Control';
import {ControlsLayoutContext} from '../ControlsLayout';

interface ControlProps {
    value?: boolean;
    onChange?: (value: boolean) => void;
}

const FullScreenControl = memo<ControlProps>((props) => {
    const {t} = useTranslation('controls');
    const {controlClassName, controlSize, isVerticalView, popupPosition} =
        useContext(ControlsLayoutContext);
    const {value, onChange} = props;

    const onClick = useCallback(() => {
        if (onChange) {
            onChange(!value);
        }
    }, [value, onChange]);

    const onKeyDown = useCallback(
        (event: KeyboardEvent | React.KeyboardEvent) => {
            if (event.key === 'Escape' && value) {
                onClick();
            }
        },
        [onClick, value],
    );

    useEffect(() => {
        document.addEventListener('keydown', onKeyDown);

        return () => {
            document.removeEventListener('keydown', onKeyDown);
        };
    }, [onKeyDown]);

    const activeMode = value ? 'enabled' : 'disabled';

    return (
        <Control
            size={controlSize}
            onClick={onClick}
            className={controlClassName}
            isVerticalView={isVerticalView}
            tooltipText={t(`full-screen-text-${activeMode}`)}
            icon={(args) => (
                <Icon data={value ? FullScreenClickedIcon : FullScreenIcon} {...args} />
            )}
            popupPosition={popupPosition}
        />
    );
});

FullScreenControl.displayName = 'FullScreenControl';

export default FullScreenControl;
