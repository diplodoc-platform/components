import React from 'react';
import block from 'bem-cn-lite';

import {Button, ButtonProps} from '../Button';
import {ButtonThemes, ControlSizes} from '../../models';

import './ControlButton.scss';

const b = block('dc-control-button');

export const ControlButton: React.FC<ButtonProps> = (props) => {
    const {className, size = ControlSizes.S} = props;

    return (
        <Button
            {...props}
            className={b({size}, className)}
            theme={ButtonThemes.Flat}
        />
    );
};
