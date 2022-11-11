import React, {useEffect} from 'react';
import {WithTranslation, withTranslation, WithTranslationProps} from 'react-i18next';
import {Icon as IconComponent} from '@gravity-ui/uikit';

import {Control} from '../../Control';
import {ControlSizes, Lang} from '../../../models';
import {PopperPosition} from '../../../hooks';

import PdfIcon from '../../../../assets/icons/pdf.svg';

interface ControlProps {
    lang: Lang;
    pdfLink?: string;
    isVerticalView?: boolean;
    className?: string;
    size?: ControlSizes;
    popupPosition?: PopperPosition;
}

type ControlInnerProps = ControlProps & WithTranslation & WithTranslationProps;

const PdfControl = (props: ControlInnerProps) => {
    const {className, isVerticalView, size, pdfLink, lang, i18n, popupPosition, t} = props;

    useEffect(() => {
        i18n.changeLanguage(lang);
    }, [i18n, lang]);

    if (!pdfLink) {
        return null;
    }

    return (
        <a href={pdfLink} target="_blank" rel="noreferrer noopener">
            <Control
                size={size}
                className={className}
                isVerticalView={isVerticalView}
                tooltipText={t('pdf-text')}
                icon={(args) => <IconComponent data={PdfIcon} {...args} />}
                popupPosition={popupPosition}
            />
        </a>
    );
};

export default withTranslation('controls')(PdfControl);
