import React from 'react';

import block from 'bem-cn-lite';
import './Mark.scss';

const b = block('dc-mark');

export type MarkColor = 'blue' | 'green';

export interface MarkProps {
    text: string;
    color?: MarkColor;
    size?: 's' | 'm';
    className?: string;
}

export const Mark: React.FC<MarkProps> = ({text, color = 'blue', size = 's', className}) => {
    return <span className={b({color, size}, className)}>{text.toUpperCase()}</span>;
};
