import React, {FC} from 'react';
import {Label, Popover, useDirection} from '@gravity-ui/uikit';
import block from 'bem-cn-lite';

import {TocLabel as TocLabelType} from '../../models';

import './TocLabel.scss';

const b = block('dc-toc-label');

interface TocLabelProps {
    label: TocLabelType;
}

const TocLabel: FC<TocLabelProps> = ({label}) => {
    const direction = useDirection();

    let labelElement = null;
    if (label?.title) {
        const hasDescription = Boolean(label.description);
        labelElement = (
            <Label size={'xs'} theme={label.theme} className={b({offset: !hasDescription})}>
                {label.title}
            </Label>
        );
        if (hasDescription) {
            const placement = direction === 'rtl' ? 'left' : 'right';
            labelElement = (
                <Popover
                    content={label.description}
                    placement={placement}
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
