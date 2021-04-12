import React, {useCallback, useEffect} from 'react';
import {WithTranslation, withTranslation, WithTranslationProps} from 'react-i18next';

import {Control} from '../../Control';
import {ControlSizes, Lang} from '../../../models';

import SinglePageIcon from '../../../../assets/icons/single-page.svg';
import SinglePageClickedIcon from '../../../../assets/icons/single-page-clicked.svg';

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

const SinglePageControl = (props: ControlInnerProps) => {
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
            tooltipText={t(`single-page-text-${activeMode}`)}
            icon={value ? SinglePageClickedIcon : SinglePageIcon}
        />
    );
};

export default withTranslation('controls')(SinglePageControl);
