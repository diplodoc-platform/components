import React from 'react';
import block from 'bem-cn-lite';

import ChevronIcon from '../../../assets/icons/chevron.svg';

import './ToggleArrow.scss';

const b = block('dc-toggle-arrow');

export interface ToggleArrowProps {
    type?: 'horizontal' | 'vertical';
    open?: boolean;
    size?: number;
    thin?: boolean;
    slow?: boolean;
    className?: string;
}

export const ToggleArrow: React.FC<ToggleArrowProps> = ({
    type = 'horizontal',
    open = false,
    size = 16,
    thin = false,
    slow = false,
    className,
}) => (
    <ChevronIcon
        className={b({type, open, thin, slow}, className)}
        width={size}
        height={size}
    />
);
