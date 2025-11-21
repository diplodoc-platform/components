import type {FC} from 'react';
import type {TocLabel as TocLabelType} from '../../models';

import React from 'react';
import {Label, Popover, useDirection} from '@gravity-ui/uikit';
import block from 'bem-cn-lite';

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

        const labelTooltip = <div className={b('label-tooltip')}>{label.description}</div>;

        // UIKit up: ok
        if (hasDescription) {
            const placement = direction === 'rtl' ? 'left' : 'right';
            labelElement = (
                <Popover
                    content={labelTooltip}
                    placement={placement}
                    hasArrow={true}
                    strategy="fixed"
                    className={b({offset: true})}
                >
                    <div className={b('label-wrapper')} onClick={(e) => e.preventDefault()}>
                        {labelElement}
                    </div>
                </Popover>
            );
        }
    }

    return labelElement;
};

export default TocLabel;
