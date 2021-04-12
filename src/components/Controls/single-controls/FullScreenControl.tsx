import React, {useCallback, useEffect} from 'react';
import {WithTranslation, withTranslation, WithTranslationProps} from 'react-i18next';

import {Control} from '../../Control';
import {ControlSizes, Lang} from '../../../models';

import FullScreenClickedIcon from '../../../../assets/icons/full-screen-clicked.svg';
import FullScreenIcon from '../../../../assets/icons/full-screen.svg';

interface ControlProps {
    value: boolean;
    lang: Lang;
    onChange?: (value: boolean) => void;
    isVerticalView?: boolean;
    className?: string;
    size?: ControlSizes;
}

type ControlInnerProps =
    & ControlProps
    & WithTranslation
    & WithTranslationProps;

const FullScreenControl = (props: ControlInnerProps) => {
    const {
        className,
        isVerticalView,
        size,
        value,
        onChange,
        lang,
        i18n,
        t,
    } = props;

    const onClick = useCallback(() => {
        if (onChange) {
            onChange(!value);
        }
    }, [value, onChange]);

    const onKeyDown = useCallback((event: KeyboardEvent | React.KeyboardEvent) => {
        if (event.key === 'Escape' && value) {
            onClick();
        }
    }, [value]);

    useEffect(() => {
        document.addEventListener('keydown', onKeyDown);

        return () => {
            document.removeEventListener('keydown', onKeyDown);
        };
    }, [onKeyDown]);

    useEffect(() => {
        i18n.changeLanguage(lang);
    }, [i18n, lang]);

    const activeMode = value ? 'enabled' : 'disabled';

    if (!onChange) {
        return null;
    }

    return (
        <Control
            size={size}
            onClick={onClick}
            className={className}
            isVerticalView={isVerticalView}
            tooltipText={t(`full-screen-text-${activeMode}`)}
            icon={value ? FullScreenClickedIcon : FullScreenIcon}
        />
    );
};

export default withTranslation('controls')(FullScreenControl);
