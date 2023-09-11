import {Icon} from '@gravity-ui/uikit';
import React, {memo, useContext} from 'react';

import PdfIcon from '../../../../assets/icons/pdf.svg';
import {useTranslation} from '../../../hooks';
import {Control} from '../../Control';
import {ControlsLayoutContext} from '../ControlsLayout';

interface ControlProps {
    pdfLink: string;
}

const PdfControl = memo<ControlProps>((props) => {
    const {t} = useTranslation('controls');
    const {controlClassName, controlSize, isVerticalView, popupPosition} =
        useContext(ControlsLayoutContext);
    const {pdfLink} = props;

    return (
        <a href={pdfLink} target="_blank" rel="noreferrer noopener">
            <Control
                size={controlSize}
                className={controlClassName}
                isVerticalView={isVerticalView}
                tooltipText={t('pdf-text')}
                icon={(args) => <Icon data={PdfIcon} {...args} />}
                popupPosition={popupPosition}
            />
        </a>
    );
});

PdfControl.displayName = 'PdfControl';

export default PdfControl;
