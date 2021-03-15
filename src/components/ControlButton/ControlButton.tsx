import React from 'react';
import block from 'bem-cn-lite';

import {Button, ButtonProps} from '../Button';
import {ButtonThemes} from '../../models';

import './ControlButton.scss';

const b = block('dc-control-button');

export const ControlButton: React.FC<ButtonProps> = (props) => {
    const {className} = props;

    return (
        <Button
            {...props}
            className={b(null, className)}
            theme={ButtonThemes.flat}
        />
    );
};
