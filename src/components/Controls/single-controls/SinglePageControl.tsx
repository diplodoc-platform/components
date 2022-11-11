import React, {useCallback, useEffect} from 'react';
import {WithTranslation, withTranslation, WithTranslationProps} from 'react-i18next';
import {Icon as IconComponent} from '@gravity-ui/uikit';

import {Control} from '../../Control';
import {ControlSizes, Lang} from '../../../models';
import {PopperPosition} from '../../../hooks';

import SinglePageIcon from '../../../../assets/icons/single-page.svg';
import SinglePageClickedIcon from '../../../../assets/icons/single-page-clicked.svg';

interface ControlProps {
    lang: Lang;
    value?: boolean;
    onChange?: (value: boolean) => void;
    isVerticalView?: boolean;
    className?: string;
    size?: ControlSizes;
    popupPosition?: PopperPosition;
}

type ControlInnerProps = ControlProps & WithTranslation & WithTranslationProps;

const SinglePageControl = (props: ControlInnerProps) => {
    const {className, isVerticalView, size, value, onChange, lang, i18n, popupPosition, t} = props;

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
            icon={(args) => (
                <IconComponent data={value ? SinglePageClickedIcon : SinglePageIcon} {...args} />
            )}
            popupPosition={popupPosition}
        />
    );
};

export default withTranslation('controls')(SinglePageControl);
