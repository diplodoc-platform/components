import React from 'react';
import block from 'bem-cn-lite';

import './Button.scss';

const b = block('dc-button');

export interface ButtonProps {
    onClick?: () => void;
    onMouseOver?: () => void;
    onMouseLeave?: () => void;
    className?: string;
    buttonRef?: (ref: HTMLButtonElement) => void;
}

export const Button: React.FC<ButtonProps> = (props) => {
    const {onClick, children, className, buttonRef, onMouseOver, onMouseLeave} = props;

    return (
        <button
            className={b(null, className)}
            onClick={onClick}
            ref={buttonRef}
            onMouseOver={onMouseOver}
            onMouseLeave={onMouseLeave}
        >
            {children}
        </button>
    );
};
