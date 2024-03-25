import React, {FC} from 'react';

import {Label, Popover} from '@gravity-ui/uikit';
import block from 'bem-cn-lite';

import {TocLabel as TocLabelType} from '../../models';

import './TocLabel.scss';

const b = block('dc-toc-label');

interface TocLabelProps {
    label: TocLabelType;
}

const TocLabel: FC<TocLabelProps> = ({label}) => {
    let labelElement = null;
    if (label?.title) {
        const hasDescription = Boolean(label.description);
        labelElement = (
            <Label size={'xs'} theme={label.theme} className={b({offset: !hasDescription})}>
                {label.title}
            </Label>
        );
        if (hasDescription) {
            labelElement = (
                <Popover
                    content={label.description}
                    placement={'right'}
                    size={'s'}
                    className={b({offset: true})}
                >
                    {labelElement}
                </Popover>
            );
        }
    }
    return labelElement;
};

export default TocLabel;
