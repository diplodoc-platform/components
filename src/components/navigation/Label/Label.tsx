import type {NavigationItemProps} from '@gravity-ui/page-constructor';
import type {FC} from 'react';
import type {LabelProps as BaseLabelProps} from '@gravity-ui/uikit';

import React from 'react';
import {Label as BaseLabel} from '@gravity-ui/uikit';

import './Label.scss';

export interface LabelProps extends NavigationItemProps, Pick<BaseLabelProps, 'theme' | 'size'> {
    text?: string;
}

export const Label: FC<LabelProps> = (props) => {
    const {className, size = 's', text, theme = 'normal'} = props;

    return (
        <div className={className}>
            <BaseLabel type="default" theme={theme} size={size}>
                {text}
            </BaseLabel>
        </div>
    );
};
