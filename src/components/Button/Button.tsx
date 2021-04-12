import React, {ReactElement} from 'react';
import block from 'bem-cn-lite';

import {ControlSizes, ButtonThemes} from '../../models';

import './Button.scss';

const b = block('dc-button');

export interface ButtonProps {
    onClick?: () => void;
    onMouseOver?: () => void;
    onMouseLeave?: () => void;
    className?: string;
    buttonRef?: (ref: HTMLButtonElement) => void;
    wrapper?: (node: ReactElement) => ReactElement;
    size?: string;
    theme?: string;
    active?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
    onClick,
    children,
    className,
    buttonRef,
    onMouseOver,
    onMouseLeave,
    wrapper,
    size = ControlSizes.M,
    theme = ButtonThemes.Float,
    active = false,
}) => {
    const modes = {size, theme, active};
    const classNames = [b(modes), className].join(' ');

    const buttonEl = (
        <button
            className={classNames}
            onClick={onClick}
            ref={buttonRef}
            onMouseOver={onMouseOver}
            onMouseLeave={onMouseLeave}
        >
            {children}
        </button>
    );

    return wrapper ? wrapper(buttonEl) : buttonEl;
};
