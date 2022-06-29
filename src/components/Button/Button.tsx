import React, {ReactElement, MouseEvent} from 'react';
import block from 'bem-cn-lite';

import {ControlSizes, ButtonThemes} from '../../models';

import './Button.scss';

const b = block('dc-button');

export interface ButtonProps {
    onClick?: (e: MouseEvent) => void;
    onMouseOver?: () => void;
    onMouseLeave?: () => void;
    className?: string;
    buttonRef?: (ref: HTMLButtonElement) => void;
    wrapper?: (node: ReactElement) => ReactElement;
    size?: string;
    theme?: string;
    active?: boolean;
    type?: 'button' | 'submit' | 'reset';
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
    type,
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
            type={type}
        >
            {children}
        </button>
    );

    return wrapper ? wrapper(buttonEl) : buttonEl;
};
